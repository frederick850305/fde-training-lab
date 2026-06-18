import pandas as pd

from src.python_basics.fault_report_service import generate_fault_case_report


def test_generate_fault_case_report(tmp_path):
    input_path = tmp_path / "fault_cases.xlsx"
    output_path = tmp_path / "fault_case_report.md"

    df = pd.DataFrame(
        [
            {"case_id": "FC-001", "device_type": "吊机", "urgency": "高"},
            {"case_id": "FC-002", "device_type": "焊机", "urgency": "中"},
            {"case_id": "FC-003", "device_type": "吊机", "urgency": "高"},
        ]
    )
    df.to_excel(input_path, index=False)

    generate_fault_case_report(str(input_path), str(output_path))

    report = output_path.read_text(encoding="utf-8")

    assert "# 故障案例分析报告" in report
    assert "本次共读取故障案例 3 条。" in report
    assert "| 吊机 | 2 |" in report
    assert "| 焊机 | 1 |" in report
    assert "| 高 | 2 |" in report
    assert "| 中 | 1 |" in report
    assert "吊机相关故障数量最多，共 2 条" in report
    assert "其中高紧急程度故障共 2 条" in report
