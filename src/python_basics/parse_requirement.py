from pathlib import Path


def read_text_file(file_path: str) -> str:
    """读取文本文件内容。"""
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"文件不存在: {file_path}")

    return path.read_text(encoding="utf-8")


def extract_section(content: str, section_title: str) -> list[str]:
    """
    从 Markdown 文本中提取指定二级标题下的列表内容。

    例如提取：
    ## 业务目标
    - 快速检索历史故障案例
    - 自动归纳故障原因
    """
    lines = content.splitlines()
    results: list[str] = []
    in_target_section = False

    for line in lines:
        stripped_line = line.strip()

        # 判断是否进入目标章节
        if stripped_line == f"## {section_title}":
            in_target_section = True
            continue

        # 遇到下一个二级标题，说明目标章节结束
        if in_target_section and stripped_line.startswith("## "):
            break

        # 提取目标章节下的列表项
        if in_target_section and stripped_line.startswith("- "):
            item = stripped_line.removeprefix("- ").strip()
            results.append(item)

    return results


def print_section(title: str, items: list[str]) -> None:
    """打印结构化章节内容。"""
    print(f"\n{title}：")

    if not items:
        print("- 未提取到内容")
        return

    for item in items:
        print(f"- {item}")


def main() -> None:
    file_path = "data/customer-requirement.md"
    content = read_text_file(file_path)

    business_goals = extract_section(content, "业务目标")
    user_roles = extract_section(content, "用户角色")
    core_requirements = extract_section(content, "核心需求")

    print("客户需求结构化提取结果")
    print("=" * 40)

    print_section("业务目标", business_goals)
    print_section("用户角色", user_roles)
    print_section("核心需求", core_requirements)


if __name__ == "__main__":
    main()