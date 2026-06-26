from typing import Any, Dict

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from src.python_basics.requirement_service import generate_requirement_summary
from src.python_basics.llm_service import (
    LLMAuthenticationError,
    LLMConfigurationError,
    LLMConnectionError,
    LLMRateLimitError,
    LLMResponseError,
    LLMTimeoutError,
)
from src.api.validators import validate_markdown_input, validate_markdown_output


router = APIRouter(prefix="/requirement", tags=["Requirement"])


class RequirementSummaryRequest(BaseModel):
    """客户需求分析请求参数。"""

    input_path: str = "data/customer-requirement.md"
    output_path: str = "output/api_requirement_summary.md"
    enable_ai_advice: bool = False


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
            enable_ai_advice=request.enable_ai_advice,
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
    except HTTPException:
        raise
    except LLMConfigurationError as error:
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "error_code": "LLM_CONFIGURATION_ERROR",
                "message": f"大模型配置错误: {error}",
            },
        ) from error
    except LLMAuthenticationError as error:
        raise HTTPException(
            status_code=502,
            detail={
                "success": False,
                "error_code": "LLM_AUTHENTICATION_ERROR",
                "message": f"大模型鉴权失败: {error}",
            },
        ) from error
    except LLMTimeoutError as error:
        raise HTTPException(
            status_code=504,
            detail={
                "success": False,
                "error_code": "LLM_TIMEOUT_ERROR",
                "message": f"大模型服务请求超时: {error}",
            },
        ) from error
    except (
        LLMConnectionError,
        LLMRateLimitError,
    ) as error:
        raise HTTPException(
            status_code=503,
            detail={
                "success": False,
                "error_code": "LLM_SERVICE_UNAVAILABLE",
                "message": f"大模型服务暂不可用: {error}",
            },
        ) from error
    except LLMResponseError as error:
        raise HTTPException(
            status_code=502,
            detail={
                "success": False,
                "error_code": "LLM_RESPONSE_ERROR",
                "message": f"大模型服务返回异常: {error}",
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
