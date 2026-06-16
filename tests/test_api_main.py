from fastapi.testclient import TestClient

from src.api.main import app


client = TestClient(app)


def test_health_check():
    response = client.get("/health")

    assert response.status_code == 200
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
    assert "文件不存在" in response.json()["detail"]
