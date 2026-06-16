from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from src.python_basics.requirement_service import generate_requirement_summary


app = FastAPI(
    title="FDE Training API",
    description="FDE 自我训练项目 API 服务",
    version="0.1.0",
)


class RequirementSummaryRequest(BaseModel):
    """客户需求分析请求参数。"""

    input_path: str = "data/customer-requirement.md"
    output_path: str = "output/api_requirement_summary.md"


class RequirementSummaryResponse(BaseModel):
    """客户需求分析响应结果。"""

    status: str
    message: str
    output_path: str


@app.get("/health")
def health_check() -> dict[str, str]:
    """健康检查接口。"""
    return {
        "status": "ok",
        "message": "FDE Training API is running",
    }


@app.post("/requirement/summary", response_model=RequirementSummaryResponse)
def create_requirement_summary(
    request: RequirementSummaryRequest,
) -> RequirementSummaryResponse:
    """生成客户需求结构化分析报告。"""
    try:
        generate_requirement_summary(
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
            detail=f"生成客户需求结构化分析报告失败: {error}",
        ) from error

    return RequirementSummaryResponse(
        status="success",
        message="客户需求结构化分析报告已生成",
        output_path=request.output_path,
    )