# FDE Training Lab

这是我的 FDE 自我训练仓库，用于练习 Git、GitHub、Python、CLI 工具、测试、自动化和工程化交付。

本项目的目标不是单纯学习 Python 语法，而是模拟一个 FDE 工程师的成长路径：

- 使用 Git / GitHub 管理代码和文档
- 使用 Python 处理 Markdown、Excel 等常见工作资料
- 将零散脚本封装为可复用 CLI 工具
- 使用配置文件管理默认路径
- 使用日志记录工具运行过程
- 使用 pytest 编写基础测试
- 使用 GitHub Actions 自动运行测试
- 逐步形成可演示、可交付、可维护的小型工程项目

---

## 一、项目结构

```text
fde-training-lab/
  README.md
  requirements.txt
  config.yaml
  pytest.ini
  .gitignore

  .github/
    workflows/
      python-tests.yml

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
    __init__.py
    python_basics/
      __init__.py
      fde_tool.py
      file_utils.py
      config_utils.py
      logging_utils.py
      requirement_service.py
      fault_report_service.py
      excel_summary_service.py

  tests/
    test_parse_requirement.py
    test_excel_summary_service.py
    test_config_utils.py
    test_fde_tool_error_handling.py
```

文件及目录说明：

| 路径 | 作用 |
|------|------|
| README.md | 项目说明和使用手册 |
| requirements.txt | Python 依赖清单 |
| config.yaml | CLI 默认配置文件 |
| pytest.ini | pytest 测试配置 |
| .gitignore | 忽略本地临时文件、虚拟环境和缓存 |
| .github/workflows/python-tests.yml | GitHub Actions 自动测试配置 |
| data/ | 示例输入数据 |
| output/ | 生成的报告结果 |
| src/python_basics/ | Python CLI 工具源码 |
| tests/ | pytest 测试代码 |

---

## 二、环境准备

本项目使用 Python 3.9+。

```bash
# 检查 Python 版本
python3 --version

# 创建虚拟环境
python3 -m venv .venv

# 激活虚拟环境
source .venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 退出虚拟环境
deactivate
```

---

## 三、配置文件说明

项目根目录下的 config.yaml 用于配置 CLI 默认输入和输出路径。

示例：

requirement:
  input: data/customer-requirement.md
  output: output/customer_requirement_summary.md

fault_report:
  input: data/fault_cases.xlsx
  output: output/fault_case_report.md

excel_summary:
  input: data/fault_cases.xlsx

默认情况下，CLI 会读取 config.yaml。

也可以通过 --config 指定其他配置文件：

python src/python_basics/fde_tool.py --config config.yaml requirement

命令行参数优先级高于配置文件。例如：

python src/python_basics/fde_tool.py requirement \
  --output output/custom_requirement_summary.md

这会临时覆盖 config.yaml 中的默认输出路径。

---

## 四、CLI 工具使用说明

CLI 入口文件：

src/python_basics/fde_tool.py

查看帮助：

python src/python_basics/fde_tool.py --help

当前支持三个子命令：

命令	作用
requirement	读取客户需求 Markdown，生成结构化需求分析报告
fault-report	读取故障案例 Excel，生成故障案例分析报告
excel-summary	查看 Excel 文件基础摘要

---

## 五、生成客户需求结构化分析报告

默认输入：

data/customer-requirement.md

默认输出：

output/customer_requirement_summary.md

运行：

python src/python_basics/fde_tool.py requirement

指定输入和输出：

python src/python_basics/fde_tool.py requirement \
  --input data/customer-requirement.md \
  --output output/customer_requirement_summary.md

输出内容包括：

业务目标
用户角色
核心需求
初步功能模块建议
初步分析结论

---

## 六、生成故障案例分析报告

默认输入：

data/fault_cases.xlsx

默认输出：

output/fault_case_report.md

运行：

python src/python_basics/fde_tool.py fault-report

指定输入和输出：

python src/python_basics/fde_tool.py fault-report \
  --input data/fault_cases.xlsx \
  --output output/fault_case_report.md

输出内容包括：

故障案例总数
按设备类型统计
按紧急程度统计
初步分析结论

---

## 七、查看 Excel 基础摘要

默认输入：

data/fault_cases.xlsx

运行：

python src/python_basics/fde_tool.py excel-summary

指定输入：

python src/python_basics/fde_tool.py excel-summary \
  --input data/fault_cases.xlsx

输出内容包括：

文件路径
总行数
总列数
字段列表

---

## 八、日志说明

本项目使用 Python logging 模块记录 CLI 运行过程。

日志会记录：

开始执行哪个命令
读取哪个输入文件
处理了多少条数据
报告输出到哪里
文件不存在等错误信息

示例：

2026-06-16 10:30:15,123 [INFO] 开始执行命令：excel-summary
2026-06-16 10:30:15,125 [INFO] 读取 Excel 文件：data/fault_cases.xlsx
2026-06-16 10:30:15,310 [INFO] Excel 摘要生成完成

如果输入文件不存在，CLI 会输出友好错误提示：

python src/python_basics/fde_tool.py excel-summary --input data/not-exist.xlsx

示例输出：

错误：文件不存在: data/not-exist.xlsx
请检查输入文件路径是否正确。

---

## 九、运行测试

本项目使用 pytest 进行基础测试。

运行全部测试：

pytest

如果一切正常，会看到类似：

7 passed

测试覆盖内容包括：

Markdown 章节提取
Excel 摘要生成
配置读取
CLI 错误处理

---

## 十、GitHub Actions 自动测试

本项目配置了 GitHub Actions 自动测试：

.github/workflows/python-tests.yml

触发条件：

on:
  push:
  pull_request:

也就是说：

任意分支 push 到 GitHub，会自动运行测试
创建或更新 Pull Request，会自动运行测试
PR 合并到 main 后，也会自动运行测试

自动测试会执行：

pip install -r requirements.txt
pytest

查看运行结果：

GitHub 仓库页面 → Actions → Python Tests

如果 PR 页面显示绿色对勾，说明自动测试通过。

---

## 十一、GitHub Flow 工作流

本项目采用 GitHub Flow 作为日常练习流程。

新建分支做任务
git checkout main
git pull
git checkout -b feature/任务名称
修改文件后提交
git status
git diff
git add 文件名
git commit -m "提交说明"
第一次推送新分支
git push --set-upstream origin feature/任务名称
GitHub 上创建 PR
Compare & pull request
Create pull request
等待 Python Tests 通过
Merge pull request
Confirm merge
合并后同步本地 main
git checkout main
git pull
git status

---

## 十二、常用命令速查
Git
git status
git diff
git add 文件名
git commit -m "提交说明"
git push
git pull
git branch
git checkout main
git checkout -b feature/任务名称
Python
python src/python_basics/fde_tool.py --help
python src/python_basics/fde_tool.py requirement
python src/python_basics/fde_tool.py fault-report
python src/python_basics/fde_tool.py excel-summary
测试
pytest
虚拟环境
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
deactivate