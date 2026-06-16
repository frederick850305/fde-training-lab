from pathlib import Path
from typing import Any

import yaml


DEFAULT_CONFIG_PATH = "config.yaml"


def load_config(config_path: str = DEFAULT_CONFIG_PATH) -> dict[str, Any]:
    """读取 YAML 配置文件。"""
    path = Path(config_path)

    if not path.exists():
        raise FileNotFoundError(f"配置文件不存在: {config_path}")

    with path.open("r", encoding="utf-8") as file:
        config = yaml.safe_load(file)

    if config is None:
        return {}

    if not isinstance(config, dict):
        raise ValueError(f"配置文件格式错误，应为 YAML 字典: {config_path}")

    return config


def get_config_value(
    config: dict[str, Any],
    section: str,
    key: str,
    default: str,
) -> str:
    """从配置中读取某个值，如果不存在则返回默认值。"""
    section_config = config.get(section, {})

    if not isinstance(section_config, dict):
        return default

    value = section_config.get(key, default)

    if value is None:
        return default

    return str(value)
