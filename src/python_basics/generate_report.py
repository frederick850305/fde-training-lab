from pathlib import Path

import pandas as pd


def read_fault_cases(file_path: str) -> pd.DataFrame:
    """读取故障案例 Excel。"""
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"文件不存在: {file_path}")

    return pd.read_excel(path)


def build_markdown_table(counts: pd.Series, first_column_name: str) -> str:
    """根据统计结果生成 Markdown 表格。"""
    lines = [
        f"| {first_column_name} | 数量 |",
        "|---|---:|",
    ]

    for name, count in counts.items():
        lines.append(f"| {name} | {count} |")

    return "\n".join(lines)


def build_analysis_conclusion(df: pd.DataFrame) -> str:
    """生成简单分析结论。"""
    if df.empty:
        return "当前没有可分析的故障案例数据。"

    device_counts = df["device_type"].value_counts()
    urgency_counts = df["urgency"].value_counts()

    top_device = device_counts.index[0]
    top_device_count = device_counts.iloc[0]

    high_urgency_count = urgency_counts.get("高", 0)

    conclusion = (
        f"从当前样例数据看，{top_device}相关故障数量最多，共 {top_device_count} 条。"
        f"其中高紧急程度故障共 {high_urgency_count} 条。"
        "建议优先围绕高频设备和高紧急程度故障沉淀标准化处置知识。"
    )

    return conclusion


def generate_report(df: pd.DataFrame) -> str:
    """生成 Markdown 分析报告。"""
    device_counts = df["device_type"].value_counts()
    urgency_counts = df["urgency"].value_counts()

    device_table = build_markdown_table(device_counts, "设备类型")
    urgency_table = build_markdown_table(urgency_counts, "紧急程度")
    conclusion = build_analysis_conclusion(df)

    report = f"""# 故障案例分析报告

## 一、数据概览

本次共读取故障案例 {len(df)} 条。

## 二、按设备类型统计

{device_table}

## 三、按紧急程度统计

{urgency_table}

## 四、初步分析结论

{conclusion}
"""

    return report


def save_report(report: str, output_path: str) -> None:
    """保存 Markdown 报告。"""
    path = Path(output_path)
    path.parent.mkdir(exist_ok=True)
    path.write_text(report, encoding="utf-8")


def main() -> None:
    input_path = "data/fault_cases.xlsx"
    output_path = "output/fault_case_report.md"

    df = read_fault_cases(input_path)
    report = generate_report(df)
    save_report(report, output_path)

    print(f"报告已生成：{output_path}")


if __name__ == "__main__":
    main()