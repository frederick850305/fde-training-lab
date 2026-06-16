import pandas as pd

from src.python_basics.excel_summary_service import generate_excel_summary


def test_generate_excel_summary(tmp_path):
    excel_path = tmp_path / "sample.xlsx"

    df = pd.DataFrame(
        [
            {
                "case_id": "FC-001",
                "device_type": "吊机",
                "urgency": "高",
            },
            {
                "case_id": "FC-002",
                "device_type": "焊机",
                "urgency": "中",
            },
        ]
    )

    df.to_excel(excel_path, index=False)

    summary = generate_excel_summary(str(excel_path))

    assert "Excel 文件摘要" in summary
    assert "总行数：2" in summary
    assert "总列数：3" in summary
    assert "- case_id" in summary
    assert "- device_type" in summary
    assert "- urgency" in summary
