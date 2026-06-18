from typing import Any, Dict

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from src.python_basics.fault_report_service import generate_fault_case_report
from src.api.validators import validate_excel_input, validate_markdown_output


router = APIRouter(prefix="/fault", tags=["Fault"])


class FaultReportRequest(BaseModel):
    """故障案例分析请求参数。"""

    input_path: str = "data/fault_cases.xlsx"
    output_path: str = "output/api_fault_case_report.md"


@router.post("/report")
def create_fault_report(
    request: FaultReportRequest,
) -> Dict[str, Any]:
    """生成故障案例分析报告。"""
    validate_excel_input(request.input_path)
    validate_markdown_output(request.output_path)
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
                "message": f"生成故障案例分析报告失败: {error}",
            },
        ) from error

    return {
        "status": "success",
        "output_path": request.output_path,
    }
