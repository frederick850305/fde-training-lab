"""Markdown persistence for FDE method step outputs."""

from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

PROJECT_ROOT = Path(__file__).resolve().parents[3]
OUTPUT_DIR = PROJECT_ROOT / "prototype_factory" / "local_step_outputs"
JSON_START = "<!-- FDE_STEP_RESULT_JSON_START -->"
JSON_END = "<!-- FDE_STEP_RESULT_JSON_END -->"

STEP_LABELS = {
    "requirement": "01 需求拆解",
    "scenario": "02 场景识别",
    "feature": "03 功能设计",
    "page": "04 页面设计",
    "interaction": "05 交互设计",
    "api": "06 API 契约",
    "prototype": "07 前端原型方案",
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
