from pathlib import Path
from typing import Iterable

from fastapi import HTTPException


def raise_validation_error(message: str) -> None:
    """抛出统一参数校验错误。"""
    raise HTTPException(
        status_code=400,
        detail={
            "success": False,
            "message": message,
            "error_code": "VALIDATION_ERROR",
        },
    )


def validate_not_blank(value: str, field_name: str) -> None:
    """校验字符串不能为空。"""
    if value is None or not str(value).strip():
        raise_validation_error(f"{field_name} 不能为空")


def validate_file_extension(
    file_path: str,
    allowed_extensions: Iterable[str],
    field_name: str,
) -> None:
    """校验文件扩展名是否符合要求。"""
    suffix = Path(file_path).suffix.lower()
    allowed = [ext.lower() for ext in allowed_extensions]

    if suffix not in allowed:
        allowed_text = "、".join(allowed)
        raise_validation_error(
            f"{field_name} 文件类型不正确，仅支持：{allowed_text}"
        )


def validate_markdown_input(file_path: str, field_name: str = "input_path") -> None:
    """校验 Markdown 输入文件路径。"""
    validate_not_blank(file_path, field_name)
    validate_file_extension(file_path, [".md"], field_name)


def validate_excel_input(file_path: str, field_name: str = "input_path") -> None:
    """校验 Excel 输入文件路径。"""
    validate_not_blank(file_path, field_name)
    validate_file_extension(file_path, [".xlsx", ".xls"], field_name)


def validate_markdown_output(file_path: str, field_name: str = "output_path") -> None:
    """校验 Markdown 输出文件路径。"""
    validate_not_blank(file_path, field_name)
    validate_file_extension(file_path, [".md"], field_name)