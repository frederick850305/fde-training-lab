import pytest

from src.python_basics.llm_service import generate_text, get_deepseek_client


def test_generate_text_raises_when_prompt_is_empty():
    with pytest.raises(ValueError, match="prompt 不能为空"):
        generate_text("")


def test_generate_text_raises_when_prompt_is_blank():
    with pytest.raises(ValueError, match="prompt 不能为空"):
        generate_text("   ")


def test_get_deepseek_client_raises_when_api_key_missing(monkeypatch):
    monkeypatch.delenv("DEEPSEEK_API_KEY", raising=False)

    with pytest.raises(RuntimeError, match="DEEPSEEK_API_KEY"):
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
