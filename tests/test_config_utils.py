from src.python_basics.config_utils import get_config_value


def test_get_config_value_returns_configured_value():
    config = {
        "requirement": {
            "input": "data/custom.md",
        }
    }

    result = get_config_value(
        config=config,
        section="requirement",
        key="input",
        default="data/default.md",
    )

    assert result == "data/custom.md"


def test_get_config_value_returns_default_when_section_missing():
    config = {}

    result = get_config_value(
        config=config,
        section="requirement",
        key="input",
        default="data/default.md",
    )

    assert result == "data/default.md"


def test_get_config_value_returns_default_when_key_missing():
    config = {
        "requirement": {}
    }

    result = get_config_value(
        config=config,
        section="requirement",
        key="input",
        default="data/default.md",
    )

    assert result == "data/default.md"