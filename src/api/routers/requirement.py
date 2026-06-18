from typing import Any, Dict

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from src.python_basics.requirement_service import generate_requirement_summary
from src.api.validators import validate_markdown_input, validate_markdown_output


router = APIRouter(prefix="/requirement", tags=["Requirement"])


class RequirementSummaryRequest(BaseModel):
    """客户需求分析请求参数。"""

    input_path: str = "data/customer-requirement.md"
    output_path: str = "output/api_requirement_summary.md"


@router.post("/summary")
def create_requirement_summary(
    request: RequirementSummaryRequest,
) -> Dict[str, Any]:
    """生成客户需求结构化分析报告。"""
    validate_markdown_input(request.input_path)
    validate_markdown_output(request.output_path)
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
                "error_code": "FILE_NOT_FOUND",
                "message": str(error),
            },
        ) from error
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error_code": "INTERNAL_ERROR",
                "message": f"生成客户需求结构化分析报告失败: {error}",
            },
        ) from error

    return {
        "status": "success",
        "output_path": request.output_path,
    }
