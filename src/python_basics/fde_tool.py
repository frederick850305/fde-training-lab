import argparse
from pathlib import Path

import pandas as pd


def read_text_file(file_path: str) -> str:
    """读取文本文件内容。"""
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"文件不存在: {file_path}")

    return path.read_text(encoding="utf-8")


def extract_section(content: str, section_title: str) -> list[str]:
    """从 Markdown 文本中提取指定二级标题下的列表内容。"""
    lines = content.splitlines()
    results: list[str] = []
    in_target_section = False

    for line in lines:
        stripped_line = line.strip()

        if stripped_line == f"## {section_title}":
            in_target_section = True
            continue

        if in_target_section and stripped_line.startswith("## "):
            break

        if in_target_section and stripped_line.startswith("- "):
            item = stripped_line.removeprefix("- ").strip()
            results.append(item)

    return results


def build_markdown_list(items: list[str]) -> str:
    """把 Python 列表转换成 Markdown 列表。"""
    if not items:
        return "- 未提取到内容"

    return "\n".join([f"- {item}" for item in items])


def build_requirement_module_suggestions(core_requirements: list[str]) -> list[tuple[str, str]]:
    """根据核心需求生成初步功能模块建议。"""
    suggestions: list[tuple[str, str]] = []

    for requirement in core_requirements:
        if "导入" in requirement:
            suggestions.append(("知识导入模块", "支持故障案例、手册、专家经验等资料录入"))
        elif "检索" in requirement:
            suggestions.append(("知识检索模块", "支持按设备类型、故障现象、关键词进行查询"))
        elif "建议" in requirement:
            suggestions.append(("智能建议模块", "根据故障现象生成标准化处置建议"))
        elif "审核" in requirement or "发布" in requirement:
            suggestions.append(("专家审核模块", "支持专家复核、发布、版本留痕和回滚"))
        else:
            suggestions.append(("通用功能模块", f"围绕“{requirement}”进行功能设计"))

    return suggestions


def build_markdown_table(rows: list[tuple[str, str]], headers: tuple[str, str]) -> str:
    """生成两列表格。"""
    first_header, second_header = headers

    lines = [
        f"| {first_header} | {second_header} |",
        "|---|---|",
    ]

    if not rows:
        lines.append("| 暂无 | 暂无 |")
        return "\n".join(lines)

    for first_value, second_value in rows:
        lines.append(f"| {first_value} | {second_value} |")

    return "\n".join(lines)


def generate_requirement_summary(input_path: str, output_path: str) -> None:
    """生成客户需求结构化分析报告。"""
    content = read_text_file(input_path)

    business_goals = extract_section(content, "业务目标")
    user_roles = extract_section(content, "用户角色")
    core_requirements = extract_section(content, "核心需求")
    module_suggestions = build_requirement_module_suggestions(core_requirements)

    report = f"""# 客户需求结构化分析报告

## 一、业务目标

{build_markdown_list(business_goals)}

## 二、用户角色

{build_markdown_list(user_roles)}

## 三、核心需求

{build_markdown_list(core_requirements)}

## 四、初步功能模块建议

{build_markdown_table(module_suggestions, ("模块", "建议"))}

## 五、初步分析结论

该需求具备典型的“知识沉淀 + 智能检索 + 专家审核 + 标准处置建议”特征，适合先建设一个轻量级故障知识助手 MVP。第一阶段不宜追求大而全，建议优先实现资料导入、基础检索、处置建议生成和专家审核闭环。
"""

    save_text(output_path, report)
    print(f"客户需求结构化分析报告已生成：{output_path}")


def read_fault_cases(file_path: str) -> pd.DataFrame:
    """读取故障案例 Excel。"""
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"文件不存在: {file_path}")

    return pd.read_excel(path)


def build_count_table(counts: pd.Series, first_column_name: str) -> str:
    """根据统计结果生成 Markdown 表格。"""
    lines = [
        f"| {first_column_name} | 数量 |",
        "|---|---:|",
    ]

    for name, count in counts.items():
        lines.append(f"| {name} | {count} |")

    return "\n".join(lines)


def build_fault_analysis_conclusion(df: pd.DataFrame) -> str:
    """生成简单故障案例分析结论。"""
    if df.empty:
        return "当前没有可分析的故障案例数据。"

    device_counts = df["device_type"].value_counts()
    urgency_counts = df["urgency"].value_counts()

    top_device = device_counts.index[0]
    top_device_count = device_counts.iloc[0]
    high_urgency_count = urgency_counts.get("高", 0)

    return (
        f"从当前样例数据看，{top_device}相关故障数量最多，共 {top_device_count} 条。"
        f"其中高紧急程度故障共 {high_urgency_count} 条。"
        "建议优先围绕高频设备和高紧急程度故障沉淀标准化处置知识。"
    )


def generate_fault_case_report(input_path: str, output_path: str) -> None:
    """生成故障案例分析报告。"""
    df = read_fault_cases(input_path)

    device_counts = df["device_type"].value_counts()
    urgency_counts = df["urgency"].value_counts()

    report = f"""# 故障案例分析报告

## 一、数据概览

本次共读取故障案例 {len(df)} 条。

## 二、按设备类型统计

{build_count_table(device_counts, "设备类型")}

## 三、按紧急程度统计

{build_count_table(urgency_counts, "紧急程度")}

## 四、初步分析结论

{build_fault_analysis_conclusion(df)}
"""

    save_text(output_path, report)
    print(f"故障案例分析报告已生成：{output_path}")


def save_text(output_path: str, content: str) -> None:
    """保存文本文件。"""
    path = Path(output_path)
    path.parent.mkdir(exist_ok=True)
    path.write_text(content, encoding="utf-8")


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