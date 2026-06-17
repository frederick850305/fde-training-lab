from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from src.python_basics.fault_report_service import generate_fault_case_report
from src.api.schemas.common import ApiResponse


router = APIRouter(prefix="/fault", tags=["Fault"])


class FaultReportRequest(BaseModel):
    """故障案例分析请求参数。"""

    input_path: str = "data/fault_cases.xlsx"
    output_path: str = "output/api_fault_case_report.md"


@router.post("/report", response_model=ApiResponse)
def create_fault_report(
    request: FaultReportRequest,
) -> ApiResponse:
    """生成故障案例分析报告。"""
    try:
        generate_fault_case_report(
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
                "message": f"生成故障案例分析报告失败: {error}",
                "error_code": "INTERNAL_ERROR",
            },
        ) from error

    return ApiResponse(
        success=True,
        message="故障案例分析报告已生成",
        data={
            "output_path": request.output_path,
        },
    )
