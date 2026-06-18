from src.python_basics.requirement_service import generate_requirement_summary


def test_generate_requirement_summary(tmp_path):
    input_path = tmp_path / "customer_requirement.md"
    output_path = tmp_path / "requirement_summary.md"

    input_path.write_text(
        """# 客户需求说明

## 业务目标

- 提升故障处理效率

## 用户角色

- 现场工程师

## 核心需求

- 支持导入故障案例资料
- 支持按关键词检索知识
- 根据故障现象生成处置建议
""",
        encoding="utf-8",
    )

    generate_requirement_summary(str(input_path), str(output_path))

    report = output_path.read_text(encoding="utf-8")

    assert "# 客户需求结构化分析报告" in report
    assert "- 提升故障处理效率" in report
    assert "- 现场工程师" in report
    assert "- 支持导入故障案例资料" in report
    assert "| 知识导入模块 | 支持故障案例、手册、专家经验等资料录入 |" in report
    assert "| 知识检索模块 | 支持按设备类型、故障现象、关键词进行查询 |" in report
    assert "| 智能建议模块 | 根据故障现象生成标准化处置建议 |" in report
