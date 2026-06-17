from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from src.python_basics.requirement_service import generate_requirement_summary
from src.api.schemas.common import ApiResponse


router = APIRouter(prefix="/requirement", tags=["Requirement"])


class RequirementSummaryRequest(BaseModel):
    """客户需求分析请求参数。"""

    input_path: str = "data/customer-requirement.md"
    output_path: str = "output/api_requirement_summary.md"


@router.post("/summary", response_model=ApiResponse)
def create_requirement_summary(
    request: RequirementSummaryRequest,
) -> ApiResponse:
    """生成客户需求结构化分析报告。"""
    try:
        generate_requirement_summary(
            input_path=request.input_path,
            output_path=request.output_path,
        )
    except FileNotFoundError as error:
        raise HTTPException(
            status_code=404,
            detail={
                "success": False,
                "message": str(error),
                "error_code": "FILE_NOT_FOUND",
            },
        ) from error
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": f"生成客户需求结构化分析报告失败: {error}",
                "error_code": "INTERNAL_ERROR",
            },
        ) from error

    return ApiResponse(
        success=True,
        message="客户需求结构化分析报告已生成",
        data={
            "output_path": request.output_path,
        },
    )
