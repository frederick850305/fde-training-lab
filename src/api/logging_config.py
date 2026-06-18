import logging
import sys


def setup_api_logging() -> None:
    """配置 API 服务日志输出。"""
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stderr),
        ],
        force=True,
    )