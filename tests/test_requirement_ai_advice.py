from src.python_basics.requirement_service import build_ai_requirement_advice_prompt


def test_build_ai_requirement_advice_prompt_contains_input_sections():
    prompt = build_ai_requirement_advice_prompt(
        business_goals="提升生产计划协同效率",
        user_roles="计划员、车间主任、项目经理",
        core_requirements="计划编制、进度跟踪、异常预警",
    )

    assert "提升生产计划协同效率" in prompt
    assert "计划员、车间主任、项目经理" in prompt
    assert "计划编制、进度跟踪、异常预警" in prompt
    assert "MVP 优先级建议" in prompt
    assert "主要风险点" in prompt