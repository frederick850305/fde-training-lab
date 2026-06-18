import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src.python_basics.llm_service import generate_text




def main() -> None:
    prompt = "请用一句话解释什么是 FDE 工程师。"
    try:
        result = generate_text(prompt)
        print(result)
    except Exception as error:
        print(f"运行失败：{error}", file=sys.stderr)
        print(
            "提示：默认使用 DeepSeek，请先设置 DEEPSEEK_API_KEY；"
            "如需切回 OpenAI，请设置 LLM_PROVIDER=openai 和 OPENAI_API_KEY。",
            file=sys.stderr,
        )
        raise SystemExit(1)


if __name__ == "__main__":
    main()