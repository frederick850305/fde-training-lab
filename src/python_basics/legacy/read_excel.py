from pathlib import Path

import pandas as pd


def read_fault_cases(file_path: str) -> pd.DataFrame:
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"文件不存在: {file_path}")

    return pd.read_excel(path)


def print_count_by_column(df: pd.DataFrame, column_name: str, title: str) -> None:
    print(f"\n{title}：")

    if column_name not in df.columns:
        print(f"- 未找到字段：{column_name}")
        return

    counts = df[column_name].value_counts()

    for name, count in counts.items():
        print(f"- {name}：{count}")


def main() -> None:
    file_path = "data/fault_cases.xlsx"
    df = read_fault_cases(file_path)

    print("故障案例 Excel 读取成功")
    print("=" * 40)

    print(f"故障案例总数：{len(df)}")

    print_count_by_column(df, "device_type", "按设备类型统计")
    print_count_by_column(df, "urgency", "按紧急程度统计")


if __name__ == "__main__":
    main()