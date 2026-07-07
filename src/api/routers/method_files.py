"""Markdown persistence for FDE method step outputs."""

from __future__ import annotations

import json
import re
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

PROJECT_ROOT = Path(__file__).resolve().parents[3]
OUTPUT_DIR = PROJECT_ROOT / "prototype_factory" / "local_step_outputs"
PROTOTYPE_PACKAGE_DIR = OUTPUT_DIR / "prototype_generation_package"
JSON_START = "<!-- FDE_STEP_RESULT_JSON_START -->"
JSON_END = "<!-- FDE_STEP_RESULT_JSON_END -->"

STEP_LABELS = {
    "requirement": "01 需求拆解",
    "interaction": "05 交互设计",
    "api": "06 API 契约",
    "scenariopagedesign": "02 场景→页面",
    "interactionapi": "03 交互与API",
    "prototype": "04 前端原型方案",
    "prototypegenerate": "05 生成原型",
}

router = APIRouter(prefix="/method-files", tags=["method-files"])


class StepFilePayload(BaseModel):
    step_key: str = Field(..., min_length=1)
    title: Optional[str] = None
    result: dict[str, Any]


def _safe_step_key(step_key: str) -> str:
    normalized = step_key.strip().lower()
    if normalized not in STEP_LABELS:
        raise HTTPException(status_code=400, detail="Unsupported method step key")
    return normalized


def _step_file_path(step_key: str) -> Path:
    return OUTPUT_DIR / f"{step_key}.md"


def _value_to_text(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        return value.strip()
    if isinstance(value, (int, float, bool)):
        return str(value)
    if isinstance(value, list):
        parts = []
        for item in value[:8]:
            text = _value_to_text(item)
            if text:
                parts.append(text)
        return "；".join(parts)
    if isinstance(value, dict):
        for key in ("name", "title", "summary", "description", "goal"):
            text = _value_to_text(value.get(key))
            if text:
                return text
        return json.dumps(value, ensure_ascii=False)[:300]
    return str(value)


def _collect_summary_lines(result: dict[str, Any]) -> list[str]:
    lines: list[str] = []
    candidates = [
        ("项目", result.get("projectName") or result.get("project_name")),
        ("客户", result.get("customerName") or result.get("customer_name")),
        ("摘要", result.get("summary")),
        ("场景", result.get("scenario") or result.get("selectedScenario")),
        ("模块", result.get("module") or result.get("selectedFeatureModule")),
        ("页面", result.get("page") or result.get("currentPage")),
        ("接口", result.get("contract") or result.get("selectedApiContract")),
    ]

    analysis = result.get("analysis") if isinstance(result.get("analysis"), dict) else None
    if analysis:
        candidates.extend(
            [
                ("业务背景", analysis.get("businessBackground")),
                ("痛点", analysis.get("painPoints")),
                ("目标", analysis.get("goals")),
                ("角色", analysis.get("roles")),
            ]
        )

    for label, value in candidates:
        text = _value_to_text(value)
        if text:
            lines.append(f"- **{label}**：{text}")

    return lines[:10]


def _build_markdown(step_key: str, title: str, result: dict[str, Any], saved_at: str) -> str:
    readable_title = title or STEP_LABELS[step_key]
    summary_lines = _collect_summary_lines(result)
    summary = "\n".join(summary_lines) if summary_lines else "- 已保存该步骤的结构化输出。"
    json_payload = json.dumps(result, ensure_ascii=False, indent=2)
    return (
        f"# {readable_title}\n\n"
        f"- 步骤标识：`{step_key}`\n"
        f"- 保存时间：{saved_at}\n"
        f"- 用途：作为下一步工作台的输入来源。\n\n"
        f"## 内容摘要\n\n{summary}\n\n"
        f"## 结构化数据\n\n"
        f"{JSON_START}\n"
        f"```json\n{json_payload}\n```\n"
        f"{JSON_END}\n"
    )


def _parse_markdown_result(markdown: str) -> dict[str, Any]:
    pattern = rf"{re.escape(JSON_START)}\s*```json\s*(.*?)\s*```\s*{re.escape(JSON_END)}"
    match = re.search(pattern, markdown, re.S)
    if not match:
        raise HTTPException(status_code=422, detail="Saved Markdown does not contain structured step data")
    try:
        parsed = json.loads(match.group(1))
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=422, detail="Saved Markdown structured data is invalid JSON") from exc
    if not isinstance(parsed, dict):
        raise HTTPException(status_code=422, detail="Saved Markdown structured data must be an object")
    return parsed


def _extract_saved_at(markdown: str) -> str:
    match = re.search(r"保存时间：([^\n]+)", markdown)
    return match.group(1).strip() if match else ""


def _read_saved_result_if_exists(step_key: str) -> dict[str, Any]:
    file_path = _step_file_path(step_key)
    if not file_path.exists():
        return {}
    result = _parse_markdown_result(file_path.read_text(encoding="utf-8"))
    if result.get("invalidated"):
        return {}
    return result


def _build_prototype_package_readme(
    prototype_result: dict[str, Any],
    included_files: list[str],
    saved_at: str,
) -> str:
    project_name = prototype_result.get("projectName") or "原型系统"
    customer_name = prototype_result.get("customerName") or ""
    view_files = prototype_result.get("viewFiles") or []
    component_files = prototype_result.get("componentFiles") or []
    mock_files = prototype_result.get("mockDataFiles") or []

    return f"""# Codex 原型生成包说明

- 生成时间：{saved_at}
- 项目名称：{project_name}
- 客户名称：{customer_name or "未填写"}
- 页面数量：{len(view_files)}
- 通用组件数量：{len(component_files)}
- Mock 数据文件数量：{len(mock_files)}

## 使用方式

1. 解压 `codex-prototype-generation-package.zip`。
2. 在一个新的 Codex 会话中，把本说明和 zip 一起作为上下文。
3. 要求 Codex 基于 `context/` 目录中的方法链路资料生成 Vue3 + Vite 原型项目。
4. 生成时必须优先遵守 `context/prototype/*.json` 中的页面、组件、导航、API 映射和 mock 契约。

## 生成要求

- 技术栈：Vue 3、Vite、普通 CSS，不依赖 Element Plus 等外部 UI 库，除非 zip 中已有明确约定。
- 输出目录建议：`prototypes/{project_name}/`。
- 每个页面必须从契约声明的 mock 数据读取，不要在页面里重新编造大段业务数据。
- mock 文件必须同时导出契约要求的数据变量和读取函数，例如 `export const xxxRecords` 与 `export function fetchXxxData(...)`。
- 页面 import 路径必须和生成的文件结构一致，禁止使用不存在的别名或未安装依赖。
- 完成后运行 `npm install` 和 `npm run build`，修复所有编译错误。

## 推荐任务提示词

请基于我提供的 `codex-prototype-generation-package.zip` 生成一个可运行的 Vue3 + Vite 原型系统。你需要先阅读 `context/requirement.md`、`context/scenariopagedesign.md`、`context/interactionapi.md`、`context/prototype.md` 和 `context/prototype/*.json`，再实现页面、导航、组件、mock 数据和 API shim。重点保证 mock 数据导出名、读取函数、页面 import 和导航组件名完全一致。生成完成后请执行构建验证并修复问题。

## Zip 内文件清单

{chr(10).join(f"- `{path}`" for path in included_files)}
"""


def _build_prototype_package() -> dict[str, Any]:
    saved_at = datetime.now(timezone.utc).isoformat()
    prototype_result = _read_saved_result_if_exists("prototype")
    if not prototype_result:
        raise HTTPException(status_code=404, detail="No saved prototype.md for packaging")

    PROTOTYPE_PACKAGE_DIR.mkdir(parents=True, exist_ok=True)
    zip_path = PROTOTYPE_PACKAGE_DIR / "codex-prototype-generation-package.zip"
    readme_path = PROTOTYPE_PACKAGE_DIR / "README.md"

    source_files: list[tuple[Path, str]] = []
    for step_key in ("requirement", "scenariopagedesign", "interactionapi", "prototype"):
        file_path = _step_file_path(step_key)
        if file_path.exists():
            source_files.append((file_path, f"context/{file_path.name}"))

    included_files = [arcname for _, arcname in source_files]
    included_files.insert(0, "README.md")
    readme = _build_prototype_package_readme(prototype_result, included_files, saved_at)
    readme_path.write_text(readme, encoding="utf-8")

    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        archive.writestr("README.md", readme)
        for file_path, arcname in source_files:
            archive.write(file_path, arcname)

    return {
        "saved_at": saved_at,
        "package_dir": str(PROTOTYPE_PACKAGE_DIR),
        "zip_path": str(zip_path),
        "readme_path": str(readme_path),
        "included_files": included_files,
    }


@router.get("")
def list_method_step_files() -> dict[str, Any]:
    files = []
    for step_key, title in STEP_LABELS.items():
        file_path = _step_file_path(step_key)
        if not file_path.exists():
            continue

        markdown = file_path.read_text(encoding="utf-8")
        files.append(
            {
                "step_key": step_key,
                "title": title,
                "file_path": str(file_path),
                "saved_at": _extract_saved_at(markdown),
            }
        )

    latest_saved_at = max((item["saved_at"] for item in files if item["saved_at"]), default="")
    return {
        "output_dir": str(OUTPUT_DIR),
        "completed_count": len(files),
        "latest_saved_at": latest_saved_at,
        "files": files,
    }


@router.post("/prototype-package")
def create_prototype_generation_package() -> dict[str, Any]:
    return _build_prototype_package()


@router.post("/solution-package")
def create_solution_package() -> dict[str, Any]:
    """打包方案输出文件为 zip，保存到 prototypes/{project_name}/ 目录"""
    saved_at = datetime.now(timezone.utc).isoformat()

    # 读取 prototype.md 获取项目名称
    prototype_result = _read_saved_result_if_exists("prototype")
    project_name = (prototype_result.get("projectName") or "未命名项目").strip().replace(" ", "_")

    # 确定输出目录：prototypes/{project_name}/
    prototypes_root = PROJECT_ROOT / "prototypes"
    project_dir = prototypes_root / project_name
    project_dir.mkdir(parents=True, exist_ok=True)

    zip_filename = f"solution_package_{saved_at[:10].replace('-', '')}.zip"
    zip_path = project_dir / zip_filename

    # 收集所有方案文件
    solution_files: list[tuple[Path, str]] = []
    for step_key in ("requirement", "scenariopagedesign", "interactionapi", "prototype"):
        file_path = _step_file_path(step_key)
        if file_path.exists():
            solution_files.append((file_path, file_path.name))

    # 添加 generate_solution_word.md
    solution_word_path = OUTPUT_DIR / "generate_solution_word.md"
    if solution_word_path.exists():
        solution_files.append((solution_word_path, solution_word_path.name))
    else:
        solution_files.append((solution_word_path, "generate_solution_word.md（模板 - 待生成）"))

    included_names = [name for _, name in solution_files]

    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for file_path, arcname in solution_files:
            if file_path.exists():
                archive.write(file_path, arcname)

    return {
        "saved_at": saved_at,
        "project_name": project_name,
        "zip_path": str(zip_path),
        "zip_filename": zip_filename,
        "included_files": included_names,
    }


@router.post("/{step_key}")
def save_method_step_file(step_key: str, payload: StepFilePayload) -> dict[str, Any]:
    safe_key = _safe_step_key(step_key)
    if _safe_step_key(payload.step_key) != safe_key:
        raise HTTPException(status_code=400, detail="Path step key and payload step key do not match")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    saved_at = datetime.now(timezone.utc).isoformat()
    title = payload.title or STEP_LABELS[safe_key]
    markdown = _build_markdown(safe_key, title, payload.result, saved_at)
    file_path = _step_file_path(safe_key)
    file_path.write_text(markdown, encoding="utf-8")

    return {
        "step_key": safe_key,
        "title": title,
        "saved_at": saved_at,
        "file_path": str(file_path),
        "markdown": markdown,
        "result": payload.result,
    }


@router.get("/{step_key}")
def read_method_step_file(step_key: str) -> dict[str, Any]:
    safe_key = _safe_step_key(step_key)
    file_path = _step_file_path(safe_key)
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="No saved Markdown file for this step")

    markdown = file_path.read_text(encoding="utf-8")
    result = _parse_markdown_result(markdown)
    return {
        "step_key": safe_key,
        "title": STEP_LABELS[safe_key],
        "file_path": str(file_path),
        "markdown": markdown,
        "result": result,
    }
