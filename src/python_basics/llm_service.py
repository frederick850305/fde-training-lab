import logging
import time

from typing import Optional

from openai import (
    APIConnectionError,
    APIStatusError,
    APITimeoutError,
    AuthenticationError,
    OpenAI,
    RateLimitError,
)

from src.python_basics.llm_config import (
    LLMConfig,
    LLMConfigError,
    load_llm_config,
)

logger = logging.getLogger(__name__)


class LLMServiceError(RuntimeError):
    """大模型服务调用异常。"""

class LLMConfigurationError(LLMServiceError):
    """大模型配置错误。"""


class LLMAuthenticationError(LLMServiceError):
    """大模型服务鉴权错误。"""


class LLMTimeoutError(LLMServiceError):
    """大模型请求超时。"""


class LLMConnectionError(LLMServiceError):
    """大模型服务连接失败。"""


class LLMRateLimitError(LLMServiceError):
    """大模型服务限流或额度不足。"""


class LLMResponseError(LLMServiceError):
    """大模型服务返回异常。"""


def _get_duration_ms(start_time: float) -> float:
    """计算从开始时间到当前时间的毫秒数。"""
    return (time.perf_counter() - start_time) * 1000


def _log_call_failure(
    model: str,
    start_time: float,
    error_type: str,
) -> None:
    """记录不包含敏感信息的大模型调用失败日志。"""
    logger.warning(
        "DeepSeek 调用失败：model=%s, duration_ms=%.2f, error_type=%s",
        model,
        _get_duration_ms(start_time),
        error_type,
    )


def _load_service_config() -> LLMConfig:
    """加载配置，并转换为统一的大模型服务异常。"""
    try:
        return load_llm_config()
    except LLMConfigError as error:
        raise LLMConfigurationError(str(error)) from error


def get_deepseek_client(
    config: Optional[LLMConfig] = None,
) -> OpenAI:
    """根据配置创建 DeepSeek 客户端。"""
    selected_config = config or _load_service_config()

    return OpenAI(
        api_key=selected_config.api_key,
        base_url=selected_config.base_url,
        timeout=selected_config.timeout_seconds,
        max_retries=selected_config.max_retries,
    )


def generate_text(
    prompt: str,
    model: Optional[str] = None,
) -> str:
    """调用 DeepSeek 生成文本。"""
    if not prompt or not prompt.strip():
        raise ValueError("prompt 不能为空")
    config = _load_service_config()
    client = get_deepseek_client(config)
    selected_model = model or config.model
    start_time = time.perf_counter()

    try:
        response = client.chat.completions.create(
            model=selected_model,
            messages=[
                {
                    "role": "system",
                    "content": "你是一个专业、严谨、务实的企业软件解决方案助手。",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            stream=False,
        )
    
    except APITimeoutError as error:
        _log_call_failure(
            selected_model,
            start_time,
            "timeout",
        )
        raise LLMTimeoutError("DeepSeek 请求超时，请稍后重试") from error

    except AuthenticationError as error:
        _log_call_failure(
            selected_model,
            start_time,
            "authentication",
        )
        raise LLMAuthenticationError(
            "DeepSeek API Key 无效或没有访问权限"
        ) from error

    except RateLimitError as error:
        _log_call_failure(
            selected_model,
            start_time,
            "rate_limit",
        )
        raise LLMRateLimitError(
            "DeepSeek 请求频率过高或账户额度不足，请稍后重试"
        ) from error

    except APIConnectionError as error:
        _log_call_failure(
            selected_model,
            start_time,
            "connection",
        )
        raise LLMConnectionError("无法连接 DeepSeek 服务，请检查网络连接") from error

    except APIStatusError as error:
        _log_call_failure(
            selected_model,
            start_time,
            "status_error",
        )
        raise LLMResponseError(
            f"DeepSeek 服务返回错误，状态码：{error.status_code}"
        ) from error

    content = response.choices[0].message.content

    if not content or not content.strip():
        _log_call_failure(
            selected_model,
            start_time,
            "empty_response",
        )
        raise LLMResponseError("DeepSeek 返回了空内容")
    logger.info(
        "DeepSeek 调用成功：model=%s, duration_ms=%.2f",
        selected_model,
        _get_duration_ms(start_time),
    )
    return content
