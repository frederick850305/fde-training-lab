# FDE Training Lab

FDE Training Lab 是一个面向 FDE（Forward Deployed Engineer / 前沿部署工程师）能力训练的自我练习项目。

本项目不是单纯学习 Python 语法，而是通过一个逐步演进的小型工程，系统练习：

* Python 文件处理、Markdown 解析、Excel 读取和报告生成
* CLI 命令行工具封装
* FastAPI 服务化接口开发
* DeepSeek 大模型能力接入
* 配置管理、日志记录、异常处理和错误响应规范化
* pytest 自动化测试
* Git / GitHub / Pull Request / GitHub Actions 工程流程

当前项目已经形成一条较完整的工程链路：

```text
业务输入文件
  ↓
Python service 层
  ↓
CLI / FastAPI 两类入口
  ↓
可选调用 DeepSeek
  ↓
生成结构化分析报告
```

---

## 一、项目能力概览

当前项目支持以下能力：

| 能力             | 说明                                               |
| -------------- | ------------------------------------------------ |
| 客户需求分析报告       | 读取 Markdown 客户需求，生成结构化需求分析报告                     |
| AI 辅助实施建议      | 可选调用 DeepSeek，为客户需求报告生成实施建议                      |
| 故障案例报告         | 读取 Excel 故障案例数据，生成故障案例分析报告                       |
| Excel 摘要       | 快速查看 Excel 文件的行列数和字段列表                           |
| CLI 工具         | 使用 `python -m src.python_basics.fde_tool` 执行各类任务 |
| FastAPI 服务     | 将核心能力封装为 HTTP API                                |
| 统一错误响应         | API 错误统一返回 `success/message/error_code`          |
| 大模型异常分类        | 对 DeepSeek 配置、鉴权、超时、限流、连接和响应异常分类处理               |
| 自动化测试          | 使用 pytest 覆盖 service、CLI、API、LLM 配置和异常处理         |
| GitHub Actions | 在无 DeepSeek API Key 环境下自动运行测试                    |

---

## 二、项目结构

```text
fde-training-lab/
├── README.md
├── requirements.txt
├── config.yaml
├── pytest.ini
├── .gitignore
│
├── .github/
│   └── workflows/
│       └── python-tests.yml
│
├── data/
│   ├── customer-requirement.md
│   └── fault_cases.xlsx
│
├── output/
│   ├── customer_requirement_summary.md
│   └── fault_case_report.md
│
├── src/
│   ├── api/
│   │   ├── main.py
│   │   ├── exception_handlers.py
│   │   ├── validators.py
│   │   ├── schemas/
│   │   │   └── common.py
│   │   ├── middlewares/
│   │   │   └── request_logging.py
│   │   └── routers/
│   │       ├── health.py
│   │       ├── requirement.py
│   │       ├── fault.py
│   │       └── excel.py
│   │
│   └── python_basics/
│       ├── fde_tool.py
│       ├── file_utils.py
│       ├── config_utils.py
│       ├── logging_utils.py
│       ├── requirement_service.py
│       ├── fault_report_service.py
│       ├── excel_summary_service.py
│       ├── llm_config.py
│       └── llm_service.py
│
└── tests/
    ├── test_api_main.py
    ├── test_api_validators.py
    ├── test_config_utils.py
    ├── test_excel_summary_service.py
    ├── test_exception_handlers.py
    ├── test_fault_report_service.py
    ├── test_fde_tool.py
    ├── test_fde_tool_error_handling.py
    ├── test_llm_config.py
    ├── test_llm_service.py
    ├── test_parse_requirement.py
    ├── test_requirement_ai_advice.py
    └── test_requirement_service.py
```

目录说明：

| 路径                   | 作用                       |
| -------------------- | ------------------------ |
| `data/`              | 示例输入数据                   |
| `output/`            | 程序生成的报告结果                |
| `src/python_basics/` | Python service 层和 CLI 工具 |
| `src/api/`           | FastAPI API 服务           |
| `tests/`             | pytest 自动化测试             |
| `.github/workflows/` | GitHub Actions 自动测试配置    |
| `config.yaml`        | CLI 默认输入输出路径配置           |
| `requirements.txt`   | Python 依赖清单              |

---

## 三、环境准备

本项目建议使用 Python 3.9+。

```bash
python3 --version
```

创建并激活虚拟环境：

```bash
python3 -m venv .venv
source .venv/bin/activate
```

安装依赖：

```bash
pip install -r requirements.txt
```

退出虚拟环境：

```bash
deactivate
```

---

## 四、依赖说明

当前核心依赖包括：

| 依赖              | 作用                        |
| --------------- | ------------------------- |
| `pandas`        | 读取和分析 Excel 数据            |
| `openpyxl`      | 支持 `.xlsx` 文件读取           |
| `pytest`        | 自动化测试                     |
| `PyYAML`        | 读取 YAML 配置文件              |
| `fastapi`       | API 服务框架                  |
| `uvicorn`       | FastAPI 本地开发服务器           |
| `httpx`         | FastAPI TestClient 依赖     |
| `openai`        | 通过 OpenAI 兼容协议调用 DeepSeek |
| `python-dotenv` | 本地加载 `.env` 环境变量          |

---

## 五、配置文件说明

项目根目录下的 `config.yaml` 用于配置 CLI 默认输入和输出路径。

示例：

```yaml
requirement:
  input: data/customer-requirement.md
  output: output/customer_requirement_summary.md

fault_report:
  input: data/fault_cases.xlsx
  output: output/fault_case_report.md

excel_summary:
  input: data/fault_cases.xlsx
```

默认情况下，CLI 会读取 `config.yaml`。

也可以通过 `--config` 指定其他配置文件：

```bash
python -m src.python_basics.fde_tool --config config.yaml requirement
```

命令行参数优先级高于配置文件。例如：

```bash
python -m src.python_basics.fde_tool requirement \
  --output output/custom_requirement_summary.md
```

这会临时覆盖 `config.yaml` 中的默认输出路径。

---

## 六、DeepSeek 配置说明

本项目支持使用 DeepSeek 为客户需求分析报告生成 AI 辅助实施建议。

API Key 不写入代码、不写入 `config.yaml`、不提交到 GitHub，只通过环境变量提供。

设置 API Key：

```bash
export DEEPSEEK_API_KEY="你的 DeepSeek API Key"
```

可选环境变量：

| 环境变量                       | 作用               | 默认值                        |
| -------------------------- | ---------------- | -------------------------- |
| `DEEPSEEK_API_KEY`         | DeepSeek API Key | 无，必须手动设置                   |
| `DEEPSEEK_MODEL`           | 默认模型名称           | `deepseek-v4-flash`        |
| `DEEPSEEK_BASE_URL`        | DeepSeek API 地址  | `https://api.deepseek.com` |
| `DEEPSEEK_TIMEOUT_SECONDS` | 请求超时时间           | `60.0`                     |
| `DEEPSEEK_MAX_RETRIES`     | 最大重试次数           | `1`                        |

本地开发时，可以使用 `.env` 保存环境变量，但 `.env` 不应提交到 GitHub。

示例 `.env`：

```bash
DEEPSEEK_API_KEY=你的 DeepSeek API Key
DEEPSEEK_MODEL=deepseek-v4-flash
DEEPSEEK_TIMEOUT_SECONDS=60
DEEPSEEK_MAX_RETRIES=1
```

---

## 七、CLI 工具使用说明

CLI 入口：

```bash
python -m src.python_basics.fde_tool
```

查看帮助：

```bash
python -m src.python_basics.fde_tool --help
```

当前支持三个子命令：

| 命令              | 作用                          |
| --------------- | --------------------------- |
| `requirement`   | 读取客户需求 Markdown，生成结构化需求分析报告 |
| `fault-report`  | 读取故障案例 Excel，生成故障案例分析报告     |
| `excel-summary` | 查看 Excel 文件基础摘要             |

---

## 八、生成客户需求结构化分析报告

默认输入：

```text
data/customer-requirement.md
```

默认输出：

```text
output/customer_requirement_summary.md
```

运行：

```bash
python -m src.python_basics.fde_tool requirement
```

指定输入和输出：

```bash
python -m src.python_basics.fde_tool requirement \
  --input data/customer-requirement.md \
  --output output/customer_requirement_summary.md
```

输出内容包括：

* 业务目标
* 用户角色
* 核心需求
* 初步功能模块建议
* 初步分析结论
* AI 辅助实施建议

默认情况下，不会调用 DeepSeek，报告第六节会显示：

```text
未启用 AI 辅助建议。
```

开启 AI 辅助建议：

```bash
python -m src.python_basics.fde_tool requirement \
  --input data/customer-requirement.md \
  --output output/ai_requirement_summary.md \
  --enable-ai-advice
```

开启 AI 前，需要确保当前终端已设置：

```bash
export DEEPSEEK_API_KEY="你的 DeepSeek API Key"
```

---

## 九、生成故障案例分析报告

默认输入：

```text
data/fault_cases.xlsx
```

默认输出：

```text
output/fault_case_report.md
```

运行：

```bash
python -m src.python_basics.fde_tool fault-report
```

指定输入和输出：

```bash
python -m src.python_basics.fde_tool fault-report \
  --input data/fault_cases.xlsx \
  --output output/fault_case_report.md
```

输出内容包括：

* 故障案例总数
* 按设备类型统计
* 按紧急程度统计
* 初步分析结论

---

## 十、查看 Excel 基础摘要

默认输入：

```text
data/fault_cases.xlsx
```

运行：

```bash
python -m src.python_basics.fde_tool excel-summary
```

指定输入：

```bash
python -m src.python_basics.fde_tool excel-summary \
  --input data/fault_cases.xlsx
```

输出内容包括：

* 文件路径
* 总行数
* 总列数
* 字段列表

---

## 十一、CLI 错误处理说明

CLI 对常见错误提供友好提示。

输入文件不存在：

```bash
python -m src.python_basics.fde_tool excel-summary --input data/not-exist.xlsx
```

示例输出：

```text
错误：文件不存在: data/not-exist.xlsx
请检查输入文件路径是否正确。
```

大模型相关错误会被分类处理：

| 场景         | 退出码 | 说明               |
| ---------- | --: | ---------------- |
| 成功         | `0` | 命令执行成功           |
| 文件或普通程序错误  | `1` | 输入文件不存在等         |
| 大模型配置或鉴权错误 | `2` | API Key 未配置或无效   |
| 大模型服务错误    | `3` | 超时、限流、连接失败、响应异常等 |

---

## 十二、FastAPI 服务使用说明

本项目使用 FastAPI 将核心能力封装为 HTTP API。

启动服务：

```bash
python -m uvicorn src.api.main:app --reload
```

默认访问地址：

```text
http://127.0.0.1:8000
```

Swagger 文档：

```text
http://127.0.0.1:8000/docs
```

---

## 十三、健康检查 API

请求：

```bash
curl http://127.0.0.1:8000/health
```

成功响应：

```json
{
  "status": "ok",
  "message": "FDE Training API is running"
}
```

---

## 十四、客户需求分析 API

接口：

```text
POST /requirement/summary
```

普通请求：

```bash
curl -X POST "http://127.0.0.1:8000/requirement/summary" \
  -H "Content-Type: application/json" \
  -d '{
    "input_path": "data/customer-requirement.md",
    "output_path": "output/api_requirement_summary.md",
    "enable_ai_advice": false
  }'
```

成功响应：

```json
{
  "success": true,
  "message": "客户需求结构化分析报告生成成功",
  "data": {
    "output_path": "output/api_requirement_summary.md"
  }
}
```

开启 AI 辅助建议：

```bash
curl -X POST "http://127.0.0.1:8000/requirement/summary" \
  -H "Content-Type: application/json" \
  -d '{
    "input_path": "data/customer-requirement.md",
    "output_path": "output/api_ai_requirement_summary.md",
    "enable_ai_advice": true
  }'
```

开启 AI 前，需要确保启动 API 的终端已设置：

```bash
export DEEPSEEK_API_KEY="你的 DeepSeek API Key"
```

---

## 十五、故障案例报告 API

接口：

```text
POST /fault/report
```

请求：

```bash
curl -X POST "http://127.0.0.1:8000/fault/report" \
  -H "Content-Type: application/json" \
  -d '{
    "input_path": "data/fault_cases.xlsx",
    "output_path": "output/api_fault_case_report.md"
  }'
```

成功响应示例：

```json
{
  "status": "success",
  "output_path": "output/api_fault_case_report.md"
}
```

---

## 十六、Excel 摘要 API

接口：

```text
POST /excel/summary
```

请求：

```bash
curl -X POST "http://127.0.0.1:8000/excel/summary" \
  -H "Content-Type: application/json" \
  -d '{
    "input_path": "data/fault_cases.xlsx"
  }'
```

成功响应示例：

```json
{
  "success": true,
  "message": "Excel 摘要生成成功",
  "data": {
    "file_path": "data/fault_cases.xlsx",
    "summary": "..."
  }
}
```

---

## 十七、API 错误响应结构

API 错误统一返回：

```json
{
  "success": false,
  "message": "错误说明",
  "error_code": "错误码"
}
```

常见错误码：

| 错误码                        | HTTP 状态码 | 说明                    |
| -------------------------- | -------: | --------------------- |
| `VALIDATION_ERROR`         |    `400` | 业务参数校验失败，如路径为空、文件类型错误 |
| `REQUEST_VALIDATION_ERROR` |    `422` | 请求体结构校验失败，如字段类型错误     |
| `FILE_NOT_FOUND`           |    `404` | 输入文件不存在               |
| `LLM_CONFIGURATION_ERROR`  |    `500` | 大模型配置错误               |
| `LLM_AUTHENTICATION_ERROR` |    `502` | 大模型鉴权失败               |
| `LLM_TIMEOUT_ERROR`        |    `504` | 大模型请求超时               |
| `LLM_SERVICE_UNAVAILABLE`  |    `503` | 大模型服务暂不可用、限流或网络连接失败   |
| `LLM_RESPONSE_ERROR`       |    `502` | 大模型上游响应异常             |
| `INTERNAL_ERROR`           |    `500` | 未预期的服务端异常             |

---

## 十八、日志说明

本项目使用 Python `logging` 记录运行过程。

CLI 日志会记录：

* 开始执行哪个命令
* 读取哪个输入文件
* 处理了多少条数据
* 报告输出到哪里
* 文件不存在等错误信息

DeepSeek 调用日志会记录：

* 调用模型
* 调用是否成功
* 调用耗时
* 错误类型

不会记录：

* API Key
* 完整 Prompt
* 完整模型响应
* 客户原始需求全文

---

## 十九、运行测试

本项目使用 pytest 进行自动化测试。

运行全部测试：

```bash
python -m pytest
```

推荐在提交前额外模拟无 DeepSeek API Key 的环境：

```bash
env -u DEEPSEEK_API_KEY python -m pytest
```

测试覆盖内容包括：

* Markdown 章节提取
* 客户需求报告生成
* 故障案例报告生成
* Excel 摘要生成
* YAML 配置读取
* CLI 参数解析
* CLI 错误处理
* FastAPI 健康检查
* FastAPI 参数校验
* FastAPI 统一错误响应
* FastAPI 大模型异常分类响应
* DeepSeek 配置加载
* DeepSeek 调用封装
* DeepSeek 异常分类
* DeepSeek 调用日志脱敏
* AI 辅助建议开启分支的 Mock 测试

自动化测试不会真实调用 DeepSeek。

---

## 二十、GitHub Actions 自动测试

本项目使用 GitHub Actions 自动运行测试。

工作流文件：

```text
.github/workflows/python-tests.yml
```

建议内容：

```yaml
name: Python Tests

on:
  push:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.9"

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Run tests without DeepSeek API key
        run: |
          env -u DEEPSEEK_API_KEY python -m pytest
```

触发条件：

* 任意分支 push 到 GitHub
* 创建或更新 Pull Request

查看运行结果：

```text
GitHub 仓库页面 → Actions → Python Tests
```

PR 页面显示绿色对勾，说明自动测试通过。

---

## 二十一、GitHub Flow 工作流

本项目采用 GitHub Flow 作为日常练习流程。

同步主分支：

```bash
git checkout main
git pull
git status
```

创建功能分支：

```bash
git checkout -b feature/example-task
```

查看修改：

```bash
git status
git diff
```

运行测试：

```bash
env -u DEEPSEEK_API_KEY python -m pytest
```

提交代码：

```bash
git add 文件名
git commit -m "提交说明"
```

推送分支：

```bash
git push --set-upstream origin feature/example-task
```

在 GitHub 上创建 PR：

```text
Compare & pull request
Create pull request
等待 Python Tests 通过
Merge pull request
Delete branch
```

合并后同步本地 main：

```bash
git checkout main
git pull
git status
```

---

## 二十二、常用命令速查

Git：

```bash
git status
git diff
git add 文件名
git commit -m "提交说明"
git push
git pull
git branch
git checkout main
git checkout -b feature/任务名称
```

Python CLI：

```bash
python -m src.python_basics.fde_tool --help
python -m src.python_basics.fde_tool requirement
python -m src.python_basics.fde_tool requirement --enable-ai-advice
python -m src.python_basics.fde_tool fault-report
python -m src.python_basics.fde_tool excel-summary
```

FastAPI：

```bash
python -m uvicorn src.api.main:app --reload
```

测试：

```bash
python -m pytest
env -u DEEPSEEK_API_KEY python -m pytest
```

虚拟环境：

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
deactivate
```

---

## 二十三、常见问题

### 1. 为什么测试不需要 DeepSeek API Key？

自动化测试通过 Mock 替代真实 DeepSeek 调用，只验证业务逻辑、参数传递、异常转换和响应结构，不依赖外部网络和真实账号。

### 2. 为什么默认不启用 AI 辅助建议？

因为大模型调用会产生网络依赖、耗时和费用。默认关闭可以保证 CLI、API 和 CI 测试稳定运行。

### 3. API Key 可以写进 config.yaml 吗？

不可以。API Key 只能通过环境变量或本地 `.env` 提供，不能提交到 GitHub。

### 4. `.env` 可以提交吗？

不可以。`.env` 应放入 `.gitignore`，只保留在本地开发环境。

### 5. 为什么有 CLI 和 API 两个入口？

CLI 适合本地批处理和脚本化执行，API 适合前端、业务系统、Agent 或其他服务调用。两者共用底层 service 层逻辑。

### 6. 为什么要区分 `VALIDATION_ERROR` 和 `REQUEST_VALIDATION_ERROR`？

`VALIDATION_ERROR` 表示业务参数不合法，例如路径为空、文件扩展名不正确。

`REQUEST_VALIDATION_ERROR` 表示请求体结构不合法，例如字段类型错误、JSON 格式不符合接口定义。

---

## 二十四、阶段成果

当前项目已经完成从脚本到工程化小项目的演进：

```text
Python 基础脚本
  ↓
可复用 service 模块
  ↓
CLI 工具
  ↓
FastAPI 服务
  ↓
DeepSeek AI 增强
  ↓
异常分类与日志脱敏
  ↓
pytest 自动化测试
  ↓
GitHub Actions 持续集成
```

第一阶段训练目标：

```text
Python + CLI + FastAPI + DeepSeek + 测试工程化
```

当前阶段已经基本闭环。
