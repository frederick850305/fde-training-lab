from pathlib import Path

import pandas as pd
import logging


def read_excel_file(file_path: str) -> pd.DataFrame:
    """读取 Excel 文件。"""
    logging.info("读取 Excel 文件：%s", file_path)
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"文件不存在: {file_path}")
    df = pd.read_excel(path)
    logging.info("Excel 文件读取成功，行数：%s，列数：%s", len(df), len(df.columns))
    return pd.read_excel(path)


def generate_excel_summary(file_path: str) -> str:
    """生成 Excel 文件基础摘要。"""
    df = read_excel_file(file_path)

    column_lines = "\n".join([f"- {column}" for column in df.columns])

    summary = f"""Excel 文件摘要
========================================
文件路径：{file_path}
总行数：{len(df)}
总列数：{len(df.columns)}

字段列表：
{column_lines}
"""

    return summary


def print_excel_summary(file_path: str) -> None:
    """打印 Excel 文件基础摘要。"""
    logging.info("开始生成 Excel 摘要")
    summary = generate_excel_summary(file_path)
    print(summary)
    logging.info("Excel 摘要生成完成")