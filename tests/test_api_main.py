from fastapi.testclient import TestClient

from src.api.main import app


client = TestClient(app)


def test_health_check():
    response = client.get("/health")

    assert response.status_code == 200
    assert "x-request-id" in response.headers
    assert response.json() == {
        "status": "ok",
        "message": "FDE Training API is running",
    }


def test_requirement_summary_api_success(tmp_path):
    output_path = tmp_path / "api_requirement_summary.md"

    response = client.post(
        "/requirement/summary",
        json={
            "input_path": "data/customer-requirement.md",
            "output_path": str(output_path),
        },
    )

    assert response.status_code == 200
    assert response.json()["status"] == "success"
    assert response.json()["output_path"] == str(output_path)
    assert output_path.exists()


def test_requirement_summary_api_file_not_found():
    response = client.post(
        "/requirement/summary",
        json={
            "input_path": "data/not-exist.md",
            "output_path": "output/api_requirement_summary.md",
        },
    )

    assert response.status_code == 404
    detail = response.json()
    assert detail["success"] is False
    assert detail["error_code"] == "FILE_NOT_FOUND"
    assert "文件不存在" in detail["message"]


def test_fault_report_api_success(tmp_path):
    output_path = tmp_path / "api_fault_case_report.md"

    response = client.post(
        "/fault/report",
        json={
            "input_path": "data/fault_cases.xlsx",
            "output_path": str(output_path),
        },
    )

    assert response.status_code == 200
    assert response.json()["status"] == "success"
    assert response.json()["output_path"] == str(output_path)
    assert output_path.exists()


def test_fault_report_api_file_not_found():
    response = client.post(
        "/fault/report",
        json={
            "input_path": "data/not-exist.xlsx",
            "output_path": "output/api_fault_case_report.md",
        },
    )

    assert response.status_code == 404
    detail = response.json()
    assert detail["success"] is False
    assert detail["error_code"] == "FILE_NOT_FOUND"
    assert "文件不存在" in detail["message"]


def test_excel_summary_api_success():
    response = client.post(
        "/excel/summary",
        json={
            "input_path": "data/fault_cases.xlsx",
        },
    )

    assert response.status_code == 200

    data = response.json()
    assert data["success"] is True
    assert data["message"] == "Excel 摘要生成成功"
    assert data["data"]["file_path"] == "data/fault_cases.xlsx"
    assert "Excel 文件摘要" in data["data"]["summary"]
    assert "字段列表" in data["data"]["summary"]


def test_excel_summary_api_file_not_found():
    response = client.post(
        "/excel/summary",
        json={
            "input_path": "data/not-exist.xlsx",
        },
    )

    assert response.status_code == 404
    detail = response.json()
    assert detail["success"] is False
    assert detail["error_code"] == "FILE_NOT_FOUND"
    assert "文件不存在" in detail["message"]
