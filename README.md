# FDE Training Lab

这是我的 FDE 自我训练仓库，用于练习 Git、GitHub、Python、Codex 和工程化交付。

本仓库的训练目标不是单纯学习语法，而是逐步建立一个 FDE 工程师需要具备的基础能力：

- 使用 Git / GitHub 管理代码和文档
- 使用 Python 处理文本、Markdown、Excel 等常见工作资料
- 使用脚本自动生成分析报告
- 将零散脚本逐步封装成可复用的 CLI 工具
- 形成可提交、可演示、可交付的工程化习惯

---

## 一、当前项目结构

```text
fde-training-lab/
  README.md
  data/
    customer-requirement.md
    fault_cases.xlsx
  docs/
    git-cheatsheet.md
    stage-1-git-notes.md
    pr-practice-notes.md
  output/
    customer_requirement_summary.md
    fault_case_report.md
  src/
    python_basics/
      hello_fde.py
      read_text.py
      parse_requirement.py
      read_excel.py
      generate_report.py
      generate_requirement_summary.py
      fde_tool.py