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
```

## 二、环境准备
本项目使用 Python 3。

检查 Python 版本：

python3 --version

安装依赖：

pip3 install -r requirements.txt

如果 pip3 不可用，可以使用：

python3 -m pip install pandas openpyxl

## 三、FDE CLI 工具说明

CLI 工具入口文件：

src/python_basics/fde_tool.py

当前支持两个命令：

命令	作用
requirement	读取客户需求 Markdown，生成结构化需求分析报告
fault-report	读取故障案例 Excel，生成故障案例分析报告

## 四、生成客户需求结构化分析报告

默认输入文件：

data/customer-requirement.md

默认输出文件：

output/customer_requirement_summary.md

运行命令：

python3 src/python_basics/fde_tool.py requirement

也可以指定输入和输出路径：

python3 src/python_basics/fde_tool.py requirement \
  --input data/customer-requirement.md \
  --output output/customer_requirement_summary.md

输出内容包括：

业务目标
用户角色
核心需求
初步功能模块建议
初步分析结论 

## 五、生成故障案例分析报告

默认输入文件：

data/fault_cases.xlsx

默认输出文件：

output/fault_case_report.md

运行命令：

python3 src/python_basics/fde_tool.py fault-report

也可以指定输入和输出路径：

python3 src/python_basics/fde_tool.py fault-report \
  --input data/fault_cases.xlsx \
  --output output/fault_case_report.md

输出内容包括：

故障案例总数
按设备类型统计
按紧急程度统计
初步分析结论

## 六、查看 CLI 帮助

查看总帮助：

python3 src/python_basics/fde_tool.py --help

查看客户需求报告命令帮助：

python3 src/python_basics/fde_tool.py requirement --help

查看故障案例报告命令帮助：

python3 src/python_basics/fde_tool.py fault-report --help

## 七、GitHub Flow 训练流程

本项目采用 GitHub Flow 进行练习：

main → feature 分支 → 修改文件 → commit → push → Pull Request → merge → 本地 pull

常用命令：

git checkout main
git pull
git checkout -b feature/任务名称

git status
git diff
git add 文件名
git commit -m "提交说明"
git push --set-upstream origin feature/任务名称

PR 合并后，本地同步：

git checkout main
git pull
git status

## 八、训练目标

通过本仓库持续训练以下能力：

阶段	能力
阶段 1	Git / GitHub / PR 工作流
阶段 2	Python 文件处理和数据处理
阶段 3	CLI 工具封装
阶段 4	API 服务封装
阶段 5	AI / RAG / Agent 原型能力

保存 README。

