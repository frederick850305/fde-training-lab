from fastapi import APIRouter

from src.api.schemas.common import ApiResponse


router = APIRouter(tags=["Health"])


@router.get("/health", response_model=ApiResponse)
def health_check() -> ApiResponse:
    """健康检查接口。"""
    return ApiResponse(
        success=True,
        message="FDE Training API is running",
        data={
            "status": "ok",
        },
    )
