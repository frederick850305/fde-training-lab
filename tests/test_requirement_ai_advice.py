from src.python_basics import requirement_service


def test_build_ai_requirement_advice_prompt_contains_input_sections():
    prompt = requirement_service.build_ai_requirement_advice_prompt(
        business_goals="提升生产计划协同效率",
        user_roles="计划员、车间主任、项目经理",
        core_requirements="计划编制、进度跟踪、异常预警",
    )

    assert "提升生产计划协同效率" in prompt
    assert "计划员、车间主任、项目经理" in prompt
    assert "计划编制、进度跟踪、异常预警" in prompt
    assert "MVP 优先级建议" in prompt
    assert "主要风险点" in prompt


def test_generate_requirement_summary_with_ai_advice(
    monkeypatch,
    tmp_path,
):
    input_path = tmp_path / "customer_requirement.md"
    output_path = tmp_path / "requirement_summary.md"
    captured_arguments = {}

    input_path.write_text(
        """# 客户需求说明

## 业务目标

- 提升设备故障处理效率

## 用户角色

- 现场工程师

## 核心需求

- 支持导入故障案例资料
- 支持按关键词检索知识
""",
        encoding="utf-8",
    )

    def fake_generate_ai_requirement_advice(
        business_goals,
        user_roles,
        core_requirements,
        model=None,
    ):
        captured_arguments["business_goals"] = business_goals
        captured_arguments["user_roles"] = user_roles
        captured_arguments["core_requirements"] = core_requirements

        return """### 1. 建设重点判断

- 优先完成故障知识导入和检索闭环。

### 2. MVP 优先级建议

- 高优先级：故障案例导入与关键词检索。"""

    monkeypatch.setattr(
        requirement_service,
        "generate_ai_requirement_advice",
        fake_generate_ai_requirement_advice,
    )

    requirement_service.generate_requirement_summary(
        input_path=str(input_path),
        output_path=str(output_path),
        enable_ai_advice=True,
    )

    report = output_path.read_text(encoding="utf-8")

    assert captured_arguments == {
        "business_goals": "- 提升设备故障处理效率",
        "user_roles": "- 现场工程师",
        "core_requirements": ("- 支持导入故障案例资料\n- 支持按关键词检索知识"),
    }
    assert "## 六、AI 辅助实施建议" in report
    assert "优先完成故障知识导入和检索闭环" in report
    assert "高优先级：故障案例导入与关键词检索" in report
    assert "未启用 AI 辅助建议" not in report
