from typing import Any, Dict

from fastapi import APIRouter


router = APIRouter(tags=["Health"])


@router.get("/health")
def health_check() -> Dict[str, Any]:
    """健康检查接口。"""
    return {
        "status": "ok",
        "message": "FDE Training API is running",
    }
