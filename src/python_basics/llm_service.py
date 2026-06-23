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
    DEFAULT_MODEL,
    LLMConfig,
    LLMConfigError,
    load_llm_config,
)


class LLMServiceError(RuntimeError):
    """大模型服务调用异常。"""


def _load_service_config() -> LLMConfig:
    """加载配置，并转换为统一的大模型服务异常。"""
    try:
        return load_llm_config()
    except LLMConfigError as error:
        raise LLMServiceError(str(error)) from error


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

    client = get_deepseek_client()
    selected_model = model or DEFAULT_MODEL

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
        raise LLMServiceError("DeepSeek 请求超时，请稍后重试") from error
    except AuthenticationError as error:
        raise LLMServiceError("DeepSeek API Key 无效或没有访问权限") from error
    except RateLimitError as error:
        raise LLMServiceError(
            "DeepSeek 请求频率过高或账户额度不足，请稍后重试"
        ) from error
    except APIConnectionError as error:
        raise LLMServiceError("无法连接 DeepSeek 服务，请检查网络连接") from error
    except APIStatusError as error:
        raise LLMServiceError(
            f"DeepSeek 服务返回错误，状态码：{error.status_code}"
        ) from error

    content = response.choices[0].message.content

    if not content or not content.strip():
        raise LLMServiceError("DeepSeek 返回了空内容")

    return content
