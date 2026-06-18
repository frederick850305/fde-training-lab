from pathlib import Path
from src.python_basics.requirement_service import extract_section
import sys

# 支持直接运行该测试文件时也能导入项目源码。
PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))




def test_extract_business_goals():
    content = """
# 客户需求说明

## 业务目标

- 快速检索历史故障案例
- 自动归纳故障原因

## 用户角色

- 现场工程师
"""

    result = extract_section(content, "业务目标")

    assert result == [
        "快速检索历史故障案例",
        "自动归纳故障原因",
    ]


def test_extract_user_roles():
    content = """
# 客户需求说明

## 业务目标

- 快速检索历史故障案例

## 用户角色

- 现场工程师
- 设备管理员

## 核心需求

- 支持导入故障案例
"""

    result = extract_section(content, "用户角色")

    assert result == [
        "现场工程师",
        "设备管理员",
    ]


def test_extract_missing_section_returns_empty_list():
    content = """
# 客户需求说明

## 业务目标

- 快速检索历史故障案例
"""

    result = extract_section(content, "不存在的章节")

    assert result == []