from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.exception_handlers import register_exception_handlers
from src.api.routers import excel, fault, health, llm, method_files, prototype_projects, requirement
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
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://127.0.0.1:5173",
            "http://localhost:5173",
            "http://127.0.0.1:5174",
            "http://localhost:5174",
            "http://127.0.0.1:5175",
            "http://localhost:5175",
        ],
        allow_origin_regex=r"^https?://(127\.0\.0\.1|localhost):51[0-9]{2}$",
        allow_credentials=True,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
    )
    app.add_middleware(RequestLoggingMiddleware)

    register_exception_handlers(app)

    app.include_router(health.router)
    app.include_router(requirement.router)
    app.include_router(fault.router)
    app.include_router(excel.router)
    app.include_router(llm.router)
    app.include_router(method_files.router)
    app.include_router(prototype_projects.router)

    return app


app = create_app()
