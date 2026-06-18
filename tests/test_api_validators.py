import pytest
from fastapi import HTTPException

from src.api.validators import (
    validate_excel_input,
    validate_markdown_input,
    validate_markdown_output,
)


def test_validate_markdown_input_accepts_md_file():
    validate_markdown_input("data/customer-requirement.md")


def test_validate_markdown_input_rejects_blank_path():
    with pytest.raises(HTTPException) as exc_info:
        validate_markdown_input("")

    assert exc_info.value.status_code == 400
    assert exc_info.value.detail["error_code"] == "VALIDATION_ERROR"
    assert "不能为空" in exc_info.value.detail["message"]


def test_validate_markdown_input_rejects_non_md_file():
    with pytest.raises(HTTPException) as exc_info:
        validate_markdown_input("data/fault_cases.xlsx")

    assert exc_info.value.status_code == 400
    assert exc_info.value.detail["error_code"] == "VALIDATION_ERROR"
    assert "文件类型不正确" in exc_info.value.detail["message"]


def test_validate_excel_input_accepts_xlsx_file():
    validate_excel_input("data/fault_cases.xlsx")


def test_validate_excel_input_accepts_xls_file():
    validate_excel_input("data/fault_cases.xls")


def test_validate_excel_input_rejects_txt_file():
    with pytest.raises(HTTPException) as exc_info:
        validate_excel_input("data/fault_cases.txt")

    assert exc_info.value.status_code == 400
    assert exc_info.value.detail["error_code"] == "VALIDATION_ERROR"
    assert "文件类型不正确" in exc_info.value.detail["message"]


def test_validate_markdown_output_accepts_md_file():
    validate_markdown_output("output/report.md")


def test_validate_markdown_output_rejects_txt_file():
    with pytest.raises(HTTPException) as exc_info:
        validate_markdown_output("output/report.txt")

    assert exc_info.value.status_code == 400
    assert exc_info.value.detail["error_code"] == "VALIDATION_ERROR"
    assert "文件类型不正确" in exc_info.value.detail["message"]