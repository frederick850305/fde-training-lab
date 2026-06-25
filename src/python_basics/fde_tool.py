import argparse
import logging
import sys

from src.python_basics.fault_report_service import generate_fault_case_report
from src.python_basics.requirement_service import generate_requirement_summary
from src.python_basics.excel_summary_service import print_excel_summary
from src.python_basics.logging_utils import setup_logging
from src.python_basics.config_utils import get_config_value, load_config
from src.python_basics.llm_service import (
    LLMAuthenticationError,
    LLMConfigurationError,
    LLMConnectionError,
    LLMRateLimitError,
    LLMResponseError,
    LLMTimeoutError,
)


def build_parser() -> argparse.ArgumentParser:
    """构建命令行参数解析器。"""
    parser = argparse.ArgumentParser(
        description="FDE Training CLI Tool，用于练习客户需求解析和故障案例报告生成。"
    )
    parser.add_argument(
        "--config",
        default="config.yaml",
        help="配置文件路径，默认 config.yaml",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    requirement_parser = subparsers.add_parser(
        "requirement",
        help="生成客户需求结构化分析报告",
    )
    requirement_parser.add_argument(
        "--input",
        default=None,
        help="客户需求 Markdown 输入文件路径",
    )
    requirement_parser.add_argument(
        "--output",
        default=None,
        help="客户需求分析报告输出路径",
    )

    requirement_parser.add_argument(
        "--enable-ai-advice",
        action="store_true",
        help="启用 DeepSeek 生成 AI 辅助实施建议",
    )

    fault_parser = subparsers.add_parser(
        "fault-report",
        help="生成故障案例分析报告",
    )
    fault_parser.add_argument(
        "--input",
        default=None,
        help="故障案例 Excel 输入文件路径",
    )
    fault_parser.add_argument(
        "--output",
        default=None,
        help="故障案例分析报告输出路径",
    )

    excel_summary_parser = subparsers.add_parser(
        "excel-summary",
        help="查看 Excel 文件基础摘要",
    )
    excel_summary_parser.add_argument(
        "--input",
        default=None,
        help="Excel 输入文件路径",
    )

    return parser


def run_command(args: argparse.Namespace) -> None:
    """根据命令行参数执行具体命令。"""
    config = load_config(args.config)

    if args.command == "requirement":
        input_path = args.input or get_config_value(
            config,
            "requirement",
            "input",
            "data/customer-requirement.md",
        )
        output_path = args.output or get_config_value(
            config,
            "requirement",
            "output",
            "output/customer_requirement_summary.md",
        )

        generate_requirement_summary(
            input_path,
            output_path,
            enable_ai_advice=args.enable_ai_advice,
        )

    elif args.command == "fault-report":
        input_path = args.input or get_config_value(
            config,
            "fault_report",
            "input",
            "data/fault_cases.xlsx",
        )
        output_path = args.output or get_config_value(
            config,
            "fault_report",
            "output",
            "output/fault_case_report.md",
        )

        generate_fault_case_report(input_path, output_path)

    elif args.command == "excel-summary":
        input_path = args.input or get_config_value(
            config,
            "excel_summary",
            "input",
            "data/fault_cases.xlsx",
        )

        print_excel_summary(input_path)

    else:
        raise ValueError(f"不支持的命令：{args.command}")


def main() -> int:
    """CLI 主入口。"""
    setup_logging()
    parser = build_parser()
    args = parser.parse_args()

    try:
        logging.info("开始执行命令：%s", args.command)
        run_command(args)
        logging.info("命令执行成功：%s", args.command)
        return 0
    except FileNotFoundError as error:
        logging.error("文件不存在：%s", error)
        print(f"错误：{error}", file=sys.stderr)
        print("请检查输入文件路径是否正确。", file=sys.stderr)
        return 1
    except (
        LLMConfigurationError,
        LLMAuthenticationError,
    ) as error:
        logging.error("大模型配置或鉴权错误：%s", error)
        print(f"大模型配置错误：{error}", file=sys.stderr)
        return 2
    except LLMTimeoutError as error:
        logging.error("大模型服务请求超时：%s", error)
        print(f"大模型服务超时：{error}", file=sys.stderr)
        return 3
    except (
        LLMConnectionError,
        LLMRateLimitError,
        LLMResponseError,
    ) as error:
        logging.error("大模型服务暂不可用：%s", error)
        print(f"大模型服务暂不可用：{error}", file=sys.stderr)
        return 3
    except Exception as error:
        logging.exception("程序执行失败")
        print(f"程序执行失败：{error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
