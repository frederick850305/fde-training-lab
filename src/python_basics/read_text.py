from pathlib import Path


def read_text_file(file_path: str) -> str:
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"文件不存在: {file_path}")

    return path.read_text(encoding="utf-8")


def main():
    file_path = "data/customer-requirement.md"
    content = read_text_file(file_path)

    print("读取文件成功：")
    print("-" * 40)
    print(content)


if __name__ == "__main__":
    main()