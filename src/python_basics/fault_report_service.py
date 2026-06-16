from pathlib import Path

import pandas as pd

from src.python_basics.file_utils import save_text


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