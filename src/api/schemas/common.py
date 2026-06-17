from typing import Any, Dict, Optional

from pydantic import BaseModel


class ApiResponse(BaseModel):
    """统一 API 成功响应模型。"""

    success: bool = True
    message: str
    data: Optional[Dict[str, Any]] = None


class ApiErrorResponse(BaseModel):
    """统一 API 错误响应模型。"""

    success: bool = False
    message: str
    error_code: str
