import sys

from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src.python_basics.requirement_service import generate_requirement_summary

def main() -> None:
    generate_requirement_summary(
        input_path="data/customer-requirement.md",
        output_path="output/ai_requirement_summary.md",
        enable_ai_advice=True,
    )

    print("AI 增强需求分析报告已生成：output/ai_requirement_summary.md")


if __name__ == "__main__":
    main()
