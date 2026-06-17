from typing import Any, Dict

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from src.python_basics.excel_summary_service import generate_excel_summary


router = APIRouter(prefix="/excel", tags=["Excel"])


class ExcelSummaryRequest(BaseModel):
    """Excel 摘要请求参数。"""

    input_path: str = "data/fault_cases.xlsx"


@router.post("/summary")
def create_excel_summary(
    request: ExcelSummaryRequest,
) -> Dict[str, Any]:
    """生成 Excel 文件基础摘要。"""
    try:
        summary = generate_excel_summary(request.input_path)
    except FileNotFoundError as error:
        raise HTTPException(
            status_code=404,
            detail=str(error),
        ) from error
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"生成 Excel 摘要失败: {error}",
        ) from error

    return {
        "status": "success",
        "file_path": request.input_path,
        "summary": summary,
    }
