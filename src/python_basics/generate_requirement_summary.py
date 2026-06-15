from pathlib import Path


def read_text_file(file_path: str) -> str:
    """
    读取文本文件内容，以 UTF-8 编码返回文件全文。
    
    Args:
        file_path (str): 文件路径
    
    Returns:
        str: 文件的全部文本内容
    
    Raises:
        FileNotFoundError: 当指定路径的文件不存在时抛出
    """
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"文件不存在: {file_path}")

    return path.read_text(encoding="utf-8")


def extract_section(content: str, section_title: str) -> list[str]:
    """
    从 Markdown 文本中提取指定二级标题下的所有列表项内容。
    
    扫描文本中所有匹配的二级标题章节，收集其下的列表项（以 "- " 开头的行），
    遇到下一个二级标题时停止当前章节的提取。若同一标题出现多次，则合并所有匹配章节的列表项。
    
    Args:
        content (str): Markdown 格式的文本内容
        section_title (str): 要提取的二级标题名称（不包含 "## " 前缀）
    
    Returns:
        list[str]: 提取到的列表项内容列表，每项为去除 "- " 前缀和首尾空格后的纯文本。
                  若指定标题不存在，则返回空列表。
    """
    lines = content.splitlines()
    results: list[str] = []
    in_target_section = False

    for line in lines:
        stripped_line = line.strip()

        if stripped_line == f"## {section_title}":
            in_target_section = True
            continue

        if in_target_section and stripped_line.startswith("## "):
            break

        if in_target_section and stripped_line.startswith("- "):
            item = stripped_line.removeprefix("- ").strip()
            results.append(item)

    return results


def build_markdown_list(items: list[str]) -> str:
    """
    将字符串列表转换为 Markdown 无序列表格式。
    
    Args:
        items (list[str]): 待转换的字符串列表
    
    Returns:
        str: Markdown 格式的无序列表字符串；当列表为空时返回 "- 未提取到内容"
    """
    if not items:
        return "- 未提取到内容"

    return "\n".join([f"- {item}" for item in items])


def build_module_suggestions(core_requirements: list[str]) -> list[tuple[str, str]]:
    """
    根据核心需求列表生成初步功能模块建议。
    
    基于关键词匹配规则，将每条核心需求映射为对应的功能模块名称与描述。
    当前采用简单规则实现，后续可替换为大模型生成。
    
    Args:
        core_requirements (list[str]): 核心需求列表，每项为一条需求描述字符串
    
    Returns:
        list[tuple[str, str]]: 功能模块建议列表，每个元组包含模块名称和模块描述
    """
    """
    根据核心需求生成初步功能模块建议。

    这里先用简单规则实现，后续可以替换成大模型生成。
    """
    suggestions: list[tuple[str, str]] = []

    for requirement in core_requirements:
        if "导入" in requirement:
            suggestions.append(("知识导入模块", "支持故障案例、手册、专家经验等资料录入"))
        elif "检索" in requirement:
            suggestions.append(("知识检索模块", "支持按设备类型、故障现象、关键词进行查询"))
        elif "建议" in requirement:
            suggestions.append(("智能建议模块", "根据故障现象生成标准化处置建议"))
        elif "审核" in requirement or "发布" in requirement:
            suggestions.append(("专家审核模块", "支持专家复核、发布、版本留痕和回滚"))
        else:
            suggestions.append(("通用功能模块", f"围绕“{requirement}”进行功能设计"))

    return suggestions


def build_markdown_table(rows: list[tuple[str, str]]) -> str:
    """生成 Markdown 表格。"""
    lines = [
        "| 模块 | 建议 |",
        "|---|---|",
    ]

    if not rows:
        lines.append("| 暂无 | 未生成模块建议 |")
        return "\n".join(lines)

    for module, suggestion in rows:
        lines.append(f"| {module} | {suggestion} |")

    return "\n".join(lines)


def generate_summary_report(
    business_goals: list[str],
    user_roles: list[str],
    core_requirements: list[str],
) -> str:
    """生成客户需求结构化分析报告。"""
    module_suggestions = build_module_suggestions(core_requirements)

    report = f"""# 客户需求结构化分析报告

## 一、业务目标

{build_markdown_list(business_goals)}

## 二、用户角色

{build_markdown_list(user_roles)}

## 三、核心需求

{build_markdown_list(core_requirements)}

## 四、初步功能模块建议

{build_markdown_table(module_suggestions)}

## 五、初步分析结论

该需求具备典型的“知识沉淀 + 智能检索 + 专家审核 + 标准处置建议”特征，适合先建设一个轻量级故障知识助手 MVP。第一阶段不宜追求大而全，建议优先实现资料导入、基础检索、处置建议生成和专家审核闭环。
"""

    return report


def save_report(report: str, output_path: str) -> None:
    """保存 Markdown 报告。"""
    path = Path(output_path)
    path.parent.mkdir(exist_ok=True)
    path.write_text(report, encoding="utf-8")


def main() -> None:
    input_path = "data/customer-requirement.md"
    output_path = "output/customer_requirement_summary.md"

    content = read_text_file(input_path)

    business_goals = extract_section(content, "业务目标")
    user_roles = extract_section(content, "用户角色")
    core_requirements = extract_section(content, "核心需求")

    report = generate_summary_report(
        business_goals=business_goals,
        user_roles=user_roles,
        core_requirements=core_requirements,
    )

    save_report(report, output_path)

    print(f"客户需求结构化分析报告已生成：{output_path}")


if __name__ == "__main__":
    main()