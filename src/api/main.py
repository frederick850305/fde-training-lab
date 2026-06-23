from fastapi import FastAPI

from src.api.exception_handlers import register_exception_handlers
from src.api.routers import excel, fault, health,  requirement
from src.api.middlewares.request_logging import RequestLoggingMiddleware
from src.api.logging_config import setup_api_logging


def create_app() -> FastAPI:
    """创建 FastAPI 应用。"""
    setup_api_logging()
    app = FastAPI(
        title="FDE Training API",
        description="FDE 自我训练项目 API 服务",
        version="0.1.0",
    )
    app.add_middleware(RequestLoggingMiddleware)

    register_exception_handlers(app)

    app.include_router(health.router)
    app.include_router(requirement.router)
    app.include_router(fault.router)
    app.include_router(excel.router)

    return app


app = create_app()