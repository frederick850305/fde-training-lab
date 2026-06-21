import pytest
import httpx

from types import SimpleNamespace

from openai import APITimeoutError

from src.python_basics.llm_service import (
    DEEPSEEK_BASE_URL,
    LLMServiceError,
    generate_text,
    get_deepseek_client,
)


def test_generate_text_raises_when_prompt_is_empty():
    with pytest.raises(ValueError, match="prompt 不能为空"):
        generate_text("")


def test_generate_text_raises_when_prompt_is_blank():
    with pytest.raises(ValueError, match="prompt 不能为空"):
        generate_text("   ")


def test_get_deepseek_client_raises_when_api_key_missing(monkeypatch):
    monkeypatch.delenv("DEEPSEEK_API_KEY", raising=False)

    with pytest.raises(LLMServiceError, match="API Key 未配置"):
        get_deepseek_client()


def test_generate_text_returns_model_response(monkeypatch):
    class _FakeMessage:
        content = "FDE 工程师是负责现场交付和客户技术支持的专业人员。"

    class _FakeChoice:
        message = _FakeMessage()

    class _FakeResponse:
        choices = [_FakeChoice()]

    class _FakeCompletions:
        def create(self, **kwargs):
            return _FakeResponse()

    class _FakeClient:
        chat = type("chat", (), {"completions": _FakeCompletions()})()

    monkeypatch.setattr(
        "src.python_basics.llm_service.get_deepseek_client",
        lambda: _FakeClient(),
    )

    result = generate_text("请用一句话解释什么是 FDE 工程师。")

    assert "FDE 工程师" in result


def test_generate_text_converts_timeout_error(monkeypatch):
    def raise_timeout(**kwargs):
        request = httpx.Request("POST", DEEPSEEK_BASE_URL)
        raise APITimeoutError(request=request)

    fake_client = SimpleNamespace(
        chat=SimpleNamespace(completions=SimpleNamespace(create=raise_timeout))
    )
    monkeypatch.setattr(
        "src.python_basics.llm_service.get_deepseek_client",
        lambda: fake_client,
    )

    with pytest.raises(LLMServiceError, match="请求超时"):
        generate_text("分析客户需求")


def test_generate_text_raises_when_response_is_empty(monkeypatch):
    response = SimpleNamespace(
        choices=[SimpleNamespace(message=SimpleNamespace(content=None))]
    )
    fake_client = SimpleNamespace(
        chat=SimpleNamespace(
            completions=SimpleNamespace(create=lambda **kwargs: response)
        )
    )
    monkeypatch.setattr(
        "src.python_basics.llm_service.get_deepseek_client",
        lambda: fake_client,
    )

    with pytest.raises(LLMServiceError, match="返回了空内容"):
        generate_text("分析客户需求")
