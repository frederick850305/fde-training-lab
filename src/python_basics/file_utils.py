from pathlib import Path


def read_text_file(file_path: str) -> str:
    """读取文本文件内容。"""
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"文件不存在: {file_path}")

    return path.read_text(encoding="utf-8")


def save_text(output_path: str, content: str) -> None:
    """保存文本文件。"""
    path = Path(output_path)
    path.parent.mkdir(exist_ok=True)
    path.write_text(content, encoding="utf-8")