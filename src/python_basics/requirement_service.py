import logging
from src.python_basics.file_utils import read_text_file, save_text


def extract_section(content: str, section_title: str) -> list[str]:
    """从 Markdown 文本中提取指定二级标题下的列表内容。"""
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
    """把 Python 列表转换成 Markdown 列表。"""
    if not items:
        return "- 未提取到内容"

    return "\n".join([f"- {item}" for item in items])


def build_module_suggestions(core_requirements: list[str]) -> list[tuple[str, str]]:
    """根据核心需求生成初步功能模块建议。"""
    suggestions: list[tuple[str, str]] = []

    for requirement in core_requirements:
        if "导入" in requirement:
            suggestions.append(
                ("知识导入模块", "支持故障案例、手册、专家经验等资料录入")
            )
        elif "检索" in requirement:
            suggestions.append(
                ("知识检索模块", "支持按设备类型、故障现象、关键词进行查询")
            )
        elif "建议" in requirement:
            suggestions.append(("智能建议模块", "根据故障现象生成标准化处置建议"))
        elif "审核" in requirement or "发布" in requirement:
            suggestions.append(("专家审核模块", "支持专家复核、发布、版本留痕和回滚"))
        else:
            suggestions.append(("通用功能模块", f"围绕“{requirement}”进行功能设计"))

    return suggestions


def build_markdown_table(rows: list[tuple[str, str]]) -> str:
    """生成模块建议 Markdown 表格。"""
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


def generate_requirement_summary(input_path: str, output_path: str) -> None:
    """生成客户需求结构化分析报告。"""
    logging.info("开始生成客户需求结构化分析报告")
    logging.info("读取客户需求文件：%s", input_path)
    content = read_text_file(input_path)

    business_goals = extract_section(content, "业务目标")
    user_roles = extract_section(content, "用户角色")
    core_requirements = extract_section(content, "核心需求")
    module_suggestions = build_module_suggestions(core_requirements)
    logging.info(
        "需求解析完成：业务目标 %s 条，用户角色 %s 条，核心需求 %s 条",
        len(business_goals),
        len(user_roles),
        len(core_requirements),
    )
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

    save_text(output_path, report)
    logging.info("客户需求结构化分析报告已保存：%s", output_path)
    print(f"客户需求结构化分析报告已生成：{output_path}")
