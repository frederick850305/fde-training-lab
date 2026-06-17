from typing import Any, Dict

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse


def build_error_response(
    message: str,
    error_code: str,
) -> Dict[str, Any]:
    """构建统一错误响应。"""
    return {
        "success": False,
        "message": message,
        "error_code": error_code,
    }


async def http_exception_handler(
    request: Request,
    exc: HTTPException,
) -> JSONResponse:
    """处理 HTTPException，返回统一错误结构。"""
    detail = exc.detail

    if isinstance(detail, dict):
        message = str(detail.get("message", "请求处理失败"))
        error_code = str(detail.get("error_code", "HTTP_ERROR"))
    else:
        message = str(detail)
        error_code = "HTTP_ERROR"

    return JSONResponse(
        status_code=exc.status_code,
        content=build_error_response(
            message=message,
            error_code=error_code,
        ),
    )


async def general_exception_handler(
    request: Request,
    exc: Exception,
) -> JSONResponse:
    """处理未捕获异常，返回统一错误结构。"""
    return JSONResponse(
        status_code=500,
        content=build_error_response(
            message=f"服务器内部错误: {exc}",
            error_code="INTERNAL_ERROR",
        ),
    )


def register_exception_handlers(app: FastAPI) -> None:
    """注册全局异常处理器。"""
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)
