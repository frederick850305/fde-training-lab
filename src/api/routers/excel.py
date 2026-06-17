from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from src.python_basics.excel_summary_service import generate_excel_summary
from src.api.schemas.common import ApiResponse


router = APIRouter(prefix="/excel", tags=["Excel"])


class ExcelSummaryRequest(BaseModel):
    """Excel 摘要请求参数。"""

    input_path: str = "data/fault_cases.xlsx"



@router.post("/summary", response_model=ApiResponse)
def create_excel_summary(
    request: ExcelSummaryRequest,
) -> ApiResponse:
    """生成 Excel 文件基础摘要。"""
    try:
        summary = generate_excel_summary(request.input_path)
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
                "message": f"生成 Excel 摘要失败: {error}",
                "error_code": "INTERNAL_ERROR",
            },
        ) from error

    return ApiResponse(
        success=True,
        message="Excel 摘要生成成功",
        data={
            "file_path": request.input_path,
            "summary": summary,
        },
    )
