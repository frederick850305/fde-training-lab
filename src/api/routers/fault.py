from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from src.python_basics.fault_report_service import generate_fault_case_report


router = APIRouter(prefix="/fault", tags=["Fault"])


class FaultReportRequest(BaseModel):
    """故障案例分析请求参数。"""

    input_path: str = "data/fault_cases.xlsx"
    output_path: str = "output/api_fault_case_report.md"


class FaultReportResponse(BaseModel):
    """故障案例分析响应结果。"""

    status: str
    message: str
    output_path: str


@router.post("/report", response_model=FaultReportResponse)
def create_fault_report(
    request: FaultReportRequest,
) -> FaultReportResponse:
    """生成故障案例分析报告。"""
    try:
        generate_fault_case_report(
            input_path=request.input_path,
            output_path=request.output_path,
        )
    except FileNotFoundError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error),
        ) from error
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"生成故障案例分析报告失败: {error}",
        ) from error

    return FaultReportResponse(
        status="success",
        message="故障案例分析报告已生成",
        output_path=request.output_path,
    )
