import os
from typing import Optional

from openai import OpenAI


DEFAULT_MODEL = "deepseek-v4-flash"
DEEPSEEK_BASE_URL = "https://api.deepseek.com"


def get_deepseek_client() -> OpenAI:
    """创建 DeepSeek 客户端。"""
    api_key = os.getenv("DEEPSEEK_API_KEY")

    if not api_key:
        raise RuntimeError("环境变量 DEEPSEEK_API_KEY 未设置")

    return OpenAI(
        api_key=api_key,
        base_url=DEEPSEEK_BASE_URL,
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

    content = response.choices[0].message.content

    if content is None:
        return ""

    return content