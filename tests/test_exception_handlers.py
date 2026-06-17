from fastapi.testclient import TestClient

from src.api.main import app


client = TestClient(app)


def test_http_exception_handler_returns_unified_error_response():
    response = client.post(
        "/excel/summary",
        json={
            "input_path": "data/not-exist.xlsx",
        },
    )

    assert response.status_code == 404

    data = response.json()
    assert data["success"] is False
    assert data["error_code"] == "FILE_NOT_FOUND"
    assert "文件不存在" in data["message"]
