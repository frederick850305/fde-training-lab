"""extract_section 函数的单元测试"""
import pytest
from parse_requirement import extract_section


# ============================================================
# 正常路径测试
# ============================================================

def test_extract_section_normal():
    """测试正常提取二级标题下的列表项"""
    content = """## 业务目标
- 快速检索历史故障案例
- 自动归纳故障原因
- 生成标准化处置建议"""

    result = extract_section(content, "业务目标")
    assert result == ["快速检索历史故障案例", "自动归纳故障原因", "生成标准化处置建议"]


def test_extract_section_with_other_sections():
    """测试多章节时只提取目标章节的内容"""
    content = """## 业务目标
- 目标1
- 目标2

## 用户角色
- 角色A
- 角色B

## 核心需求
- 需求1
- 需求2"""

    result = extract_section(content, "用户角色")
    assert result == ["角色A", "角色B"]


def test_extract_section_empty_list():
    """测试章节下没有列表项时返回空列表"""
    content = """## 业务目标

## 用户角色
- 角色A"""

    result = extract_section(content, "业务目标")
    assert result == []


def test_extract_section_last_section():
    """测试提取最后一个章节的列表项（无后续二级标题作为结束标记）"""
    content = """## 核心需求
- 需求1
- 需求2"""

    result = extract_section(content, "核心需求")
    assert result == ["需求1", "需求2"]


def test_extract_section_with_blank_lines():
    """测试章节中列表项之间有空白行"""
    content = """## 业务目标

- 目标1

- 目标2

- 目标3"""

    result = extract_section(content, "业务目标")
    assert result == ["目标1", "目标2", "目标3"]


# ============================================================
# 边界条件测试
# ============================================================

def test_extract_section_not_found():
    """测试章节标题不存在时返回空列表"""
    content = """## 业务目标
- 目标1

## 用户角色
- 角色A"""

    result = extract_section(content, "不存在的章节")
    assert result == []


def test_extract_section_empty_content():
    """测试空文本内容"""
    result = extract_section("", "业务目标")
    assert result == []


def test_extract_section_title_partial_match():
    """测试部分匹配的标题不会被误识别"""
    content = """## 业务目标详情
- 不应该被提取

## 业务目标
- 应该被提取"""

    result = extract_section(content, "业务目标")
    assert result == ["应该被提取"]


def test_extract_section_list_item_with_extra_spaces():
    """测试列表项前后有多余空格"""
    content = """## 业务目标
  -   前后有空格  """

    result = extract_section(content, "业务目标")
    assert result == ["前后有空格"]


def test_extract_section_only_header_no_content():
    """测试只有标题没有列表项"""
    content = """## 业务目标
一些描述文字，但不是列表项。"""

    result = extract_section(content, "业务目标")
    assert result == []


def test_extract_section_title_with_special_chars():
    """测试章节标题包含特殊字符"""
    content = """## 业务目标 (v2.0)
- 目标1"""

    result = extract_section(content, "业务目标 (v2.0)")
    assert result == ["目标1"]


# ============================================================
# 错误/异常路径测试
# ============================================================

def test_extract_section_one_level_header():
    """测试一级标题不会被误匹配"""
    content = """# 业务目标
- 不应该被提取

## 业务目标
- 应该被提取"""

    result = extract_section(content, "业务目标")
    assert result == ["应该被提取"]


def test_extract_section_list_item_no_space_after_dash():
    """测试 - 后没有空格的不算列表项"""
    content = """## 业务目标
-正常项
- 正常项2"""

    result = extract_section(content, "业务目标")
    assert result == ["正常项2"]


def test_extract_section_same_title_appears_twice():
    """测试相同标题出现两次时提取所有匹配章节的列表项"""
    content = """## 业务目标
- 第一批目标

## 业务目标
- 第二批目标"""

    result = extract_section(content, "业务目标")
    assert result == ["第一批目标", "第二批目标"]


def test_extract_section_three_level_header():
    """测试三级标题不会被误当作结束标记"""
    content = """## 业务目标
- 目标1
### 子标题
- 目标2"""

    result = extract_section(content, "业务目标")
    assert result == ["目标1", "目标2"]
