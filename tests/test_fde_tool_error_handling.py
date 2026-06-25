import pytest

from src.python_basics.fde_tool import main
from src.python_basics import fde_tool
from src.python_basics.llm_service import (
    LLMConfigurationError,
    LLMTimeoutError,
)


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


def test_main_returns_configuration_error_code(
    monkeypatch,
    capsys,
):
    def raise_configuration_error(args):
        raise LLMConfigurationError("DeepSeek API Key 未配置")

    monkeypatch.setattr(
        "sys.argv",
        [
            "fde_tool.py",
            "requirement",
            "--enable-ai-advice",
        ],
    )
    monkeypatch.setattr(
        fde_tool,
        "run_command",
        raise_configuration_error,
    )

    result = main()
    captured = capsys.readouterr()

    assert result == 2
    assert "大模型配置错误" in captured.err
    assert "API Key 未配置" in captured.err

def test_main_returns_llm_timeout_error_code(
    monkeypatch,
    capsys,
):
    def raise_timeout_error(args):
        raise LLMTimeoutError(
            "DeepSeek 请求超时，请稍后重试"
        )

    monkeypatch.setattr(
        "sys.argv",
        [
            "fde_tool.py",
            "requirement",
            "--enable-ai-advice",
        ],
    )
    monkeypatch.setattr(
        fde_tool,
        "run_command",
        raise_timeout_error,
    )

    result = main()
    captured = capsys.readouterr()

    assert result == 3
    assert "大模型服务超时" in captured.err
    assert "请稍后重试" in captured.err
