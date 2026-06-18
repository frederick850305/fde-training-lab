import logging
import time
import uuid
from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware


logger = logging.getLogger(__name__)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """记录每次 API 请求的基础日志，并生成 request_id。"""

    async def dispatch(
        self,
        request: Request,
        call_next: Callable,
    ) -> Response:
        request_id = uuid.uuid4().hex[:8]
        start_time = time.time()

        try:
            response = await call_next(request)
        except Exception:
            duration_ms = (time.time() - start_time) * 1000
            logger.exception(
                "request_id=%s method=%s path=%s status=500 duration_ms=%.2f",
                request_id,
                request.method,
                request.url.path,
                duration_ms,
            )
            raise

        duration_ms = (time.time() - start_time) * 1000
        response.headers["X-Request-ID"] = request_id

        logger.info(
            "request_id=%s method=%s path=%s status=%s duration_ms=%.2f",
            request_id,
            request.method,
            request.url.path,
            response.status_code,
            duration_ms,
        )

        return response
