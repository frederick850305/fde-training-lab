from fastapi import FastAPI


app = FastAPI(
    title="FDE Training API",
    description="FDE 自我训练项目 API 服务",
    version="0.1.0",
)


@app.get("/health")
def health_check() -> dict[str, str]:
    """健康检查接口。"""
    return {
        "status": "ok",
        "message": "FDE Training API is running",
    }