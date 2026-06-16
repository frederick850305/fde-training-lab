from fastapi import APIRouter


router = APIRouter()


@router.get("/health")
def health_check() -> dict[str, str]:
    """健康检查接口。"""
    return {
        "status": "ok",
        "message": "FDE Training API is running",
    }
