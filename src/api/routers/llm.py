import json
import os
from pathlib import Path
from typing import Any, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from src.api.schemas.common import ApiResponse
from src.python_basics.llm_config import DEFAULT_BASE_URL, DEFAULT_MODEL
from src.python_basics.llm_service import (
    LLMAuthenticationError,
    LLMConfigurationError,
    LLMConnectionError,
    LLMRateLimitError,
    LLMResponseError,
    LLMTimeoutError,
    generate_text,
)

router = APIRouter(prefix="/llm", tags=["LLM"])

PROJECT_ROOT = Path(__file__).resolve().parents[3]
ENV_PATH = PROJECT_ROOT / ".env"


class LLMConfigRequest(BaseModel):
    api_key: str = Field(min_length=8)
    model: str = DEFAULT_MODEL
    base_url: str = DEFAULT_BASE_URL


class RequirementAnalysisRequest(BaseModel):
    source_requirement: str = Field(min_length=1)
    project_name: Optional[str] = None
    customer_name: Optional[str] = None
    attachments: list[dict[str, Any]] = Field(default_factory=list)


class StepRevisionRequest(BaseModel):
    step_key: str = Field(min_length=1)
    step_title: str = Field(min_length=1)
    instruction: str = Field(min_length=1)
    current_output: Any
    project_context: dict[str, Any] = Field(default_factory=dict)


def _mask_secret(value: str) -> str:
    if not value:
        return ""
    if len(value) <= 8:
        return "****"
    return f"{value[:4]}****{value[-4:]}"


def _read_env_lines() -> list[str]:
    if not ENV_PATH.exists():
        return []
    return ENV_PATH.read_text(encoding="utf-8").splitlines()



def _clean_env_value(name: str, value: str, default: str = "") -> str:
    selected = (value or default).strip()
    if "\n" in selected or "\r" in selected:
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "error_code": "INVALID_LLM_CONFIG",
                "message": f"{name} 不能包含换行符",
            },
        )
    return selected

def _write_env_values(values: dict[str, str]) -> None:
    lines = _read_env_lines()
    seen: set[str] = set()
    output: list[str] = []

    for line in lines:
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in line:
            output.append(line)
            continue

        key = line.split("=", 1)[0].strip()
        if key in values:
            output.append(f"{key}={values[key]}")
            seen.add(key)
        else:
            output.append(line)

    for key, value in values.items():
        if key not in seen:
            output.append(f"{key}={value}")

    ENV_PATH.write_text("\n".join(output).rstrip() + "\n", encoding="utf-8")
    try:
        ENV_PATH.chmod(0o600)
    except OSError:
        pass

    os.environ.update(values)


def _load_saved_config() -> dict[str, str]:
    lines = _read_env_lines()
    values: dict[str, str] = {}
    for line in lines:
        if "=" not in line or line.strip().startswith("#"):
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip()
    return values


def _build_requirement_prompt(request: RequirementAnalysisRequest) -> str:
    attachments = "\n".join(
        f"- {item.get('name', '未命名附件')}：{item.get('parseLabel', item.get('type', ''))}"
        for item in request.attachments
    ) or "无"
    return f"""
你是企业软件 FDE 原型专家。请基于客户原始需求，输出严格 JSON，不要输出 Markdown，不要添加解释。

项目名称：{request.project_name or '未填写'}
客户名称：{request.customer_name or '未填写'}
附件摘要：
{attachments}

客户原始需求与附件解析文本：
{request.source_requirement}

请输出 JSON 对象，字段必须为：
{{
  "businessBackground": "一句到两句业务背景",
  "painPoints": ["痛点1", "痛点2"],
  "businessGoals": ["目标1", "目标2"],
  "userRoles": [{{"name": "角色名", "responsibility": "职责说明"}}],
  "questions": ["需要用户补充确认的问题"]
}}
要求：
1. 内容必须来自客户需求，不要编造不存在的系统。
2. questions 用于让产品负责人回复后继续进入场景识别。
3. userRoles 要能支撑后续业务场景识别。
""".strip()


def _build_step_revision_prompt(request: StepRevisionRequest) -> str:
    return f"""
你是企业软件 FDE 原型专家。请根据用户的修改要求，修改当前步骤的结构化输出。

要求：
1. 必须只输出严格 JSON，不要输出 Markdown，不要添加解释。
2. 必须保持原有 JSON 的整体结构和关键字段，除非用户明确要求新增字段。
3. 修改内容必须服务于当前步骤，不要跳到后续实现细节。
4. 如果需要记录修改依据，可以在 JSON 中增加 revisionNote 字段。

步骤：{request.step_key} / {request.step_title}
项目上下文：
{json.dumps(request.project_context, ensure_ascii=False, indent=2)}

当前输出：
{json.dumps(request.current_output, ensure_ascii=False, indent=2)}

用户修改要求：
{request.instruction}
""".strip()


def _extract_json_object(text: str) -> dict[str, Any]:
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start = text.find("{")
        end = text.rfind("}")
        if start == -1 or end == -1 or end <= start:
            raise
        return json.loads(text[start : end + 1])


def _normalize_analysis(data: dict[str, Any]) -> dict[str, Any]:
    return {
        "businessBackground": str(data.get("businessBackground") or ""),
        "painPoints": [str(item) for item in data.get("painPoints") or [] if str(item).strip()],
        "businessGoals": [str(item) for item in data.get("businessGoals") or data.get("goals") or [] if str(item).strip()],
        "userRoles": [
            {
                "name": str(item.get("name") or "未命名角色"),
                "responsibility": str(item.get("responsibility") or item.get("focus") or ""),
            }
            for item in data.get("userRoles") or []
            if isinstance(item, dict)
        ],
        "questions": [str(item) for item in data.get("questions") or [] if str(item).strip()],
    }


def _handle_llm_error(error: Exception) -> HTTPException:
    if isinstance(error, LLMConfigurationError):
        return HTTPException(status_code=500, detail={"success": False, "error_code": "LLM_CONFIGURATION_ERROR", "message": str(error)})
    if isinstance(error, LLMAuthenticationError):
        return HTTPException(status_code=502, detail={"success": False, "error_code": "LLM_AUTHENTICATION_ERROR", "message": str(error)})
    if isinstance(error, LLMTimeoutError):
        return HTTPException(status_code=504, detail={"success": False, "error_code": "LLM_TIMEOUT_ERROR", "message": str(error)})
    if isinstance(error, (LLMConnectionError, LLMRateLimitError)):
        return HTTPException(status_code=503, detail={"success": False, "error_code": "LLM_SERVICE_UNAVAILABLE", "message": str(error)})
    if isinstance(error, LLMResponseError):
        return HTTPException(status_code=502, detail={"success": False, "error_code": "LLM_RESPONSE_ERROR", "message": str(error)})
    return HTTPException(status_code=500, detail={"success": False, "error_code": "INTERNAL_ERROR", "message": str(error)})


@router.get("/config", response_model=ApiResponse)
def get_llm_config() -> ApiResponse:
    saved = _load_saved_config()
    api_key = os.getenv("DEEPSEEK_API_KEY") or saved.get("DEEPSEEK_API_KEY", "")
    model = os.getenv("DEEPSEEK_MODEL") or saved.get("DEEPSEEK_MODEL", DEFAULT_MODEL)
    base_url = os.getenv("DEEPSEEK_BASE_URL") or saved.get("DEEPSEEK_BASE_URL", DEFAULT_BASE_URL)
    if api_key:
        os.environ["DEEPSEEK_API_KEY"] = api_key
    if model:
        os.environ["DEEPSEEK_MODEL"] = model
    if base_url:
        os.environ["DEEPSEEK_BASE_URL"] = base_url
    return ApiResponse(
        message="LLM 配置读取成功",
        data={
            "configured": bool(api_key),
            "masked_api_key": _mask_secret(api_key),
            "model": model,
            "base_url": base_url,
        },
    )


@router.post("/config", response_model=ApiResponse)
def save_llm_config(request: LLMConfigRequest) -> ApiResponse:
    api_key = _clean_env_value("DEEPSEEK_API_KEY", request.api_key)
    model = _clean_env_value("DEEPSEEK_MODEL", request.model, DEFAULT_MODEL)
    base_url = _clean_env_value("DEEPSEEK_BASE_URL", request.base_url, DEFAULT_BASE_URL)
    _write_env_values(
        {
            "DEEPSEEK_API_KEY": api_key,
            "DEEPSEEK_MODEL": model,
            "DEEPSEEK_BASE_URL": base_url,
        }
    )
    return ApiResponse(
        message="DeepSeek 配置已保存到本地 .env",
        data={
            "configured": True,
            "masked_api_key": _mask_secret(api_key),
            "model": model,
            "base_url": base_url,
        },
    )


@router.post("/requirement-analysis", response_model=ApiResponse)
def create_requirement_analysis(request: RequirementAnalysisRequest) -> ApiResponse:
    prompt = _build_requirement_prompt(request)
    try:
        content = generate_text(prompt=prompt)
        analysis = _normalize_analysis(_extract_json_object(content))
    except Exception as error:
        raise _handle_llm_error(error) from error

    return ApiResponse(
        message="DeepSeek 需求拆解完成",
        data={"analysis": analysis},
    )


@router.post("/revise-step", response_model=ApiResponse)
def revise_step_output(request: StepRevisionRequest) -> ApiResponse:
    prompt = _build_step_revision_prompt(request)
    try:
      content = generate_text(prompt=prompt)
      revised_output = _extract_json_object(content)
    except Exception as error:
        raise _handle_llm_error(error) from error

    return ApiResponse(
        message="DeepSeek 步骤输出修改完成",
        data={"revised_output": revised_output},
    )
