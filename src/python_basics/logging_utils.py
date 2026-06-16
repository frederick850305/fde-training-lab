import logging
import sys


def setup_logging() -> None:
    """配置 CLI 工具日志输出。"""
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        handlers=[
            logging.StreamHandler(sys.stderr),
        ],
    )
