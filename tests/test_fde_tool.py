from src.python_basics import fde_tool


def test_requirement_ai_advice_is_disabled_by_default():
    parser = fde_tool.build_parser()

    args = parser.parse_args(["requirement"])

    assert args.command == "requirement"
    assert args.enable_ai_advice is False


def test_requirement_ai_advice_can_be_enabled():
    parser = fde_tool.build_parser()

    args = parser.parse_args(
        [
            "requirement",
            "--enable-ai-advice",
        ]
    )

    assert args.command == "requirement"
    assert args.enable_ai_advice is True


def test_run_requirement_command_passes_ai_advice_flag(monkeypatch):
    captured_arguments = {}

    def fake_generate_requirement_summary(
        input_path,
        output_path,
        enable_ai_advice=False,
    ):
        captured_arguments["input_path"] = input_path
        captured_arguments["output_path"] = output_path
        captured_arguments["enable_ai_advice"] = enable_ai_advice

    monkeypatch.setattr(
        fde_tool,
        "load_config",
        lambda config_path: {},
    )
    monkeypatch.setattr(
        fde_tool,
        "generate_requirement_summary",
        fake_generate_requirement_summary,
    )

    parser = fde_tool.build_parser()
    args = parser.parse_args(
        [
            "requirement",
            "--input",
            "data/test-requirement.md",
            "--output",
            "output/test-summary.md",
            "--enable-ai-advice",
        ]
    )

    fde_tool.run_command(args)

    assert captured_arguments == {
        "input_path": "data/test-requirement.md",
        "output_path": "output/test-summary.md",
        "enable_ai_advice": True,
    }
