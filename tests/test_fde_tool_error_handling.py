import pytest

from src.python_basics.fde_tool import main


def test_main_returns_error_code_when_input_file_missing(monkeypatch):
    monkeypatch.setattr(
        "sys.argv",
        [
            "fde_tool.py",
            "excel-summary",
            "--input",
            "data/not-exist.xlsx",
        ],
    )

    result = main()

    assert result == 1


def test_main_returns_success_code_for_requirement_command(monkeypatch):
    monkeypatch.setattr(
        "sys.argv",
        [
            "fde_tool.py",
            "requirement",
            "--input",
            "data/customer-requirement.md",
            "--output",
            "output/test_customer_requirement_summary.md",
        ],
    )

    result = main()

    assert result == 0
