import os
from dataclasses import dataclass, field

from dotenv import load_dotenv


DEFAULT_MODEL = "deepseek-v4-flash"
DEFAULT_BASE_URL = "https://api.deepseek.com"
DEFAULT_TIMEOUT_SECONDS = 60.0
DEFAULT_MAX_RETRIES = 1

# 模块初始化时只加载一次 .env 文件
load_dotenv(override=False)


class LLMConfigError(ValueError):
    """大模型配置错误。"""


@dataclass(frozen=True)
class LLMConfig:
    """DeepSeek 运行配置。"""

    api_key: str = field(repr=False)
    model: str = DEFAULT_MODEL
    base_url: str = DEFAULT_BASE_URL
    timeout_seconds: float = DEFAULT_TIMEOUT_SECONDS
    max_retries: int = DEFAULT_MAX_RETRIES


def _get_env_text(name: str, default: str) -> str:
    """读取文本环境变量，空值时使用默认值。"""
    value = os.getenv(name)

    if value is None or not value.strip():
        return default

    return value.strip()


def load_llm_config() -> LLMConfig:
    """从环境变量加载并校验 DeepSeek 配置。"""
    api_key = os.getenv("DEEPSEEK_API_KEY", "").strip()

    if not api_key:
        raise LLMConfigError(
            "DeepSeek API Key 未配置，请设置环境变量 DEEPSEEK_API_KEY"
        )

    try:
        timeout_seconds = float(
            _get_env_text(
                "DEEPSEEK_TIMEOUT_SECONDS",
                str(DEFAULT_TIMEOUT_SECONDS),
            )
        )
    except ValueError as error:
        raise LLMConfigError(
            "DEEPSEEK_TIMEOUT_SECONDS 必须是数字"
        ) from error

    try:
        max_retries = int(
            _get_env_text(
                "DEEPSEEK_MAX_RETRIES",
                str(DEFAULT_MAX_RETRIES),
            )
        )
    except ValueError as error:
        raise LLMConfigError(
            "DEEPSEEK_MAX_RETRIES 必须是整数"
        ) from error

    if timeout_seconds <= 0:
        raise LLMConfigError(
            "DEEPSEEK_TIMEOUT_SECONDS 必须大于 0"
        )

    if max_retries < 0:
        raise LLMConfigError(
            "DEEPSEEK_MAX_RETRIES 不能小于 0"
        )

    return LLMConfig(
        api_key=api_key,
        model=_get_env_text("DEEPSEEK_MODEL", DEFAULT_MODEL),
        base_url=_get_env_text("DEEPSEEK_BASE_URL", DEFAULT_BASE_URL),
        timeout_seconds=timeout_seconds,
        max_retries=max_retries,
    )