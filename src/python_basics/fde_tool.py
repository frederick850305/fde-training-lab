import argparse
from pathlib import Path
import sys


PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src.python_basics.fault_report_service import generate_fault_case_report
from src.python_basics.requirement_service import generate_requirement_summary


def build_parser() -> argparse.ArgumentParser:
    """构建命令行参数解析器。"""
    parser = argparse.ArgumentParser(
        description="FDE Training CLI Tool，用于练习客户需求解析和故障案例报告生成。"
    )

    subparsers = parser.add_subparsers(dest="command", required=True)

    requirement_parser = subparsers.add_parser(
        "requirement",
        help="生成客户需求结构化分析报告",
    )
    requirement_parser.add_argument(
        "--input",
        default="data/customer-requirement.md",
        help="客户需求 Markdown 输入文件路径",
    )
    requirement_parser.add_argument(
        "--output",
        default="output/customer_requirement_summary.md",
        help="客户需求分析报告输出路径",
    )

    fault_parser = subparsers.add_parser(
        "fault-report",
        help="生成故障案例分析报告",
    )
    fault_parser.add_argument(
        "--input",
        default="data/fault_cases.xlsx",
        help="故障案例 Excel 输入文件路径",
    )
    fault_parser.add_argument(
        "--output",
        default="output/fault_case_report.md",
        help="故障案例分析报告输出路径",
    )

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    if args.command == "requirement":
        generate_requirement_summary(args.input, args.output)
    elif args.command == "fault-report":
        generate_fault_case_report(args.input, args.output)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()