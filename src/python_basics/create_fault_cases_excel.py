from pathlib import Path

import pandas as pd


def main() -> None:
    data_dir = Path("data")
    data_dir.mkdir(exist_ok=True)

    fault_cases = [
        {
            "case_id": "FC-001",
            "device_type": "吊机",
            "fault_description": "吊机启动后无动作",
            "urgency": "高",
            "solution": "检查主电源、急停按钮和控制回路",
        },
        {
            "case_id": "FC-002",
            "device_type": "焊机",
            "fault_description": "焊接电流不稳定",
            "urgency": "中",
            "solution": "检查接地线、焊把线和电流参数设置",
        },
        {
            "case_id": "FC-003",
            "device_type": "空压机",
            "fault_description": "压力无法达到设定值",
            "urgency": "中",
            "solution": "检查泄漏点、滤芯和压力开关",
        },
        {
            "case_id": "FC-004",
            "device_type": "吊机",
            "fault_description": "吊装过程中报警停机",
            "urgency": "高",
            "solution": "检查限位器、载荷传感器和报警记录",
        },
        {
            "case_id": "FC-005",
            "device_type": "焊机",
            "fault_description": "设备无法通电",
            "urgency": "中",
            "solution": "检查输入电源、保险丝和开关状态",
        },
        {
            "case_id": "FC-006",
            "device_type": "配电柜",
            "fault_description": "柜内温度偏高",
            "urgency": "低",
            "solution": "检查散热风扇、通风口和负载情况",
        },
    ]

    df = pd.DataFrame(fault_cases)
    output_path = data_dir / "fault_cases.xlsx"
    df.to_excel(output_path, index=False)

    print(f"Excel 文件已生成：{output_path}")


if __name__ == "__main__":
    main()