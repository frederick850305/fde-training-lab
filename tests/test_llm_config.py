import pytest

from src.python_basics.llm_config import (
    DEFAULT_BASE_URL,
    DEFAULT_MAX_RETRIES,
    DEFAULT_MODEL,
    DEFAULT_TIMEOUT_SECONDS,
    LLMConfigError,
    load_llm_config,
)


def clear_optional_env(monkeypatch):
    names = [
        "DEEPSEEK_MODEL",
        "DEEPSEEK_BASE_URL",
        "DEEPSEEK_TIMEOUT_SECONDS",
        "DEEPSEEK_MAX_RETRIES",
    ]

    for name in names:
        monkeypatch.delenv(name, raising=False)


def test_load_llm_config_uses_defaults(monkeypatch):
    monkeypatch.setenv("DEEPSEEK_API_KEY", "test-key")
    clear_optional_env(monkeypatch)

    config = load_llm_config()

    assert config.api_key == "test-key"
    assert config.model == DEFAULT_MODEL
    assert config.base_url == DEFAULT_BASE_URL
    assert config.timeout_seconds == DEFAULT_TIMEOUT_SECONDS
    assert config.max_retries == DEFAULT_MAX_RETRIES


def test_load_llm_config_uses_environment_overrides(monkeypatch):
    monkeypatch.setenv("DEEPSEEK_API_KEY", "test-key")
    monkeypatch.setenv("DEEPSEEK_MODEL", "custom-model")
    monkeypatch.setenv("DEEPSEEK_BASE_URL", "https://example.com")
    monkeypatch.setenv("DEEPSEEK_TIMEOUT_SECONDS", "30.5")
    monkeypatch.setenv("DEEPSEEK_MAX_RETRIES", "2")

    config = load_llm_config()

    assert config.model == "custom-model"
    assert config.base_url == "https://example.com"
    assert config.timeout_seconds == 30.5
    assert config.max_retries == 2


def test_load_llm_config_rejects_missing_api_key(monkeypatch):
    monkeypatch.delenv("DEEPSEEK_API_KEY", raising=False)

    with pytest.raises(LLMConfigError, match="API Key 未配置"):
        load_llm_config()


def test_load_llm_config_rejects_invalid_timeout(monkeypatch):
    monkeypatch.setenv("DEEPSEEK_API_KEY", "test-key")
    monkeypatch.setenv("DEEPSEEK_TIMEOUT_SECONDS", "abc")

    with pytest.raises(LLMConfigError, match="必须是数字"):
        load_llm_config()
