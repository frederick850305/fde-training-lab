from fastapi import HTTPException
from fastapi.testclient import TestClient

from src.api.main import app
from src.api.routers import requirement as requirement_router

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


def test_requirement_summary_api_rejects_blank_input_path():
    response = client.post(
        "/requirement/summary",
        json={
            "input_path": "",
            "output_path": "output/api_requirement_summary.md",
        },
    )

    assert response.status_code == 400

    data = response.json()
    assert data["success"] is False
    assert data["error_code"] == "VALIDATION_ERROR"
    assert "不能为空" in data["message"]


def test_requirement_summary_api_rejects_invalid_output_extension():
    response = client.post(
        "/requirement/summary",
        json={
            "input_path": "data/customer-requirement.md",
            "output_path": "output/requirement_summary.txt",
        },
    )

    assert response.status_code == 400

    data = response.json()
    assert data["success"] is False
    assert data["error_code"] == "VALIDATION_ERROR"
    assert "文件类型不正确" in data["message"]


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


def test_excel_summary_api_rejects_blank_input_path():
    response = client.post(
        "/excel/summary",
        json={
            "input_path": "",
        },
    )

    assert response.status_code == 400

    data = response.json()
    assert data["success"] is False
    assert data["error_code"] == "VALIDATION_ERROR"
    assert "不能为空" in data["message"]


def test_fault_report_api_rejects_invalid_output_extension():
    response = client.post(
        "/fault/report",
        json={
            "input_path": "data/fault_cases.xlsx",
            "output_path": "output/report.txt",
        },
    )

    assert response.status_code == 400

    data = response.json()
    assert data["success"] is False
    assert data["error_code"] == "VALIDATION_ERROR"
    assert "文件类型不正确" in data["message"]


def test_requirement_summary_api_rejects_invalid_input_path_type():
    response = client.post(
        "/requirement/summary",
        json={
            "input_path": 123,
            "output_path": "output/api_requirement_summary.md",
        },
    )

    assert response.status_code == 422

    data = response.json()
    assert data["success"] is False
    assert data["error_code"] == "REQUEST_VALIDATION_ERROR"
    assert data["message"] == "请求参数校验失败"


def test_requirement_summary_api_passes_ai_advice_flag(
    monkeypatch,
    tmp_path,
):
    captured_arguments = {}

    def fake_generate_requirement_summary(
        input_path,
        output_path,
        enable_ai_advice=False,
    ):
        captured_arguments["input_path"] = input_path
        captured_arguments["output_path"] = output_path
        captured_arguments["enable_ai_advice"] = enable_ai_advice

    monkeypatch.setattr(
        requirement_router,
        "generate_requirement_summary",
        fake_generate_requirement_summary,
    )

    output_path = tmp_path / "ai_requirement_summary.md"

    response = client.post(
        "/requirement/summary",
        json={
            "input_path": "data/customer-requirement.md",
            "output_path": str(output_path),
            "enable_ai_advice": True,
        },
    )

    assert response.status_code == 200
    assert captured_arguments == {
        "input_path": "data/customer-requirement.md",
        "output_path": str(output_path),
        "enable_ai_advice": True,
    }


def test_requirement_summary_api_keeps_structured_http_exception(monkeypatch):
    def raise_http_exception(*args, **kwargs):
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "error_code": "INVALID_REQUIREMENT_INPUT",
                "message": "客户需求文件格式不正确",
            },
        )

    monkeypatch.setattr(
        requirement_router,
        "generate_requirement_summary",
        raise_http_exception,
    )

    response = client.post(
        "/requirement/summary",
        json={
            "input_path": "data/customer-requirement.md",
            "output_path": "output/api_requirement_summary.md",
        },
    )

    assert response.status_code == 400

    data = response.json()
    assert data["success"] is False
    assert data["error_code"] == "INVALID_REQUIREMENT_INPUT"
    assert data["message"] == "客户需求文件格式不正确"
