# 2-7 API 契约设计模板

本文件用于把页面交互设计中的接口调用，整理成前后端都能理解的 API 契约。

核心原则：

```text
前端不要凭感觉调用接口，后端也不要让前端猜响应结构。
```

## 一、本节目标

完成 2-6 后，我们已经知道：

```text
页面有哪些字段
按钮点击后调用什么动作
成功和失败时如何展示
```

2-7 要进一步回答：

```text
前端要调用哪些接口？
每个接口是什么方法和路径？
请求参数有哪些？
响应结构是什么？
错误结构是什么？
页面如何适配响应？
```

这一步的输出会直接用于：

```text
axios API client 生成
Vue3 页面联调
FastAPI 接口校验
错误提示适配
README 接口说明
```

## 二、为什么要先写 API 契约

如果没有 API 契约，AI 生成前端代码时常见问题是：

```text
接口路径写错
GET/POST 方法写错
请求字段名和后端不一致
响应字段解析错误
错误提示只显示网络失败
不知道 success/message/error_code 怎么用
```

API 契约的作用是：

```text
让前端、后端、测试和 AI 都围绕同一份接口说明工作。
```

## 三、API 契约总表

建议先输出接口总览。

| 功能模块 | 页面 | 方法 | 接口路径 | 用途 | 一期是否需要 |
|---|---|---|---|---|---|
| 客户需求分析 | 客户需求分析页 | POST | `/requirement/summary` | 生成客户需求分析报告 | 是 |
| 后端健康检查 | 工作台/健康检查页 | GET | `/health` | 检查 FastAPI 服务状态 | 是 |

## 四、单接口契约模板

每个接口建议固定包含以下内容。

### 1. 基本信息

| 项目 | 内容 |
|---|---|
| 接口名称 | 客户需求分析报告生成 |
| 接口路径 | `POST /requirement/summary` |
| 对应页面 | 客户需求分析页 |
| 调用时机 | 用户点击“生成报告”按钮 |
| 是否一期必需 | 是 |

### 2. 请求参数

| 参数名 | 类型 | 是否必填 | 示例 | 说明 |
|---|---|---|---|---|
| input_path | string | 是 | `data/customer-requirement.md` | 输入需求文件路径 |
| output_path | string | 是 | `output/api_requirement_summary.md` | 报告输出路径 |
| enable_ai_advice | boolean | 否 | false | 是否启用 AI 辅助建议 |

### 3. 成功响应

```json
{
  "success": true,
  "message": "客户需求结构化分析报告生成成功",
  "data": {
    "output_path": "output/api_requirement_summary.md"
  }
}
```

### 4. 失败响应

```json
{
  "success": false,
  "message": "输入文件不存在",
  "error_code": "FILE_NOT_FOUND"
}
```

### 5. 页面适配规则

| 响应情况 | 页面展示 | 用户下一步 |
|---|---|---|
| success=true | 显示成功提示和 output_path | 复制路径或再次生成 |
| success=false | 显示 message 和 error_code | 修改参数后重试 |
| 网络异常 | 显示后端服务不可用 | 检查 FastAPI 是否启动 |

## 五、统一响应结构约定

第二阶段前端要适配第一阶段后端已经形成的统一响应结构。

成功结构：

```json
{
  "success": true,
  "message": "操作成功说明",
  "data": {}
}
```

失败结构：

```json
{
  "success": false,
  "message": "错误说明",
  "error_code": "错误码"
}
```

前端适配原则：

| 字段 | 前端用途 |
|---|---|
| success | 判断展示成功或失败状态 |
| message | 展示给用户的主提示 |
| data | 展示业务结果 |
| error_code | 展示错误码，方便排查 |

## 六、错误码展示建议

页面不需要把错误码翻译得太复杂，但要显示出来，方便 FDE 排查。

| error_code | 页面提示建议 | 用户动作 |
|---|---|---|
| VALIDATION_ERROR | 参数校验失败，请检查输入内容 | 修改表单参数 |
| REQUEST_VALIDATION_ERROR | 请求格式不正确，请检查前端参数 | 检查代码或接口契约 |
| FILE_NOT_FOUND | 输入文件不存在，请检查路径 | 修改 input_path |
| LLM_CONFIGURATION_ERROR | AI 配置异常，请检查环境变量 | 检查 DeepSeek 配置 |
| LLM_AUTHENTICATION_ERROR | AI 鉴权失败，请检查 API Key | 检查 API Key |
| LLM_TIMEOUT_ERROR | AI 请求超时，请稍后重试 | 重试或关闭 AI 建议 |
| LLM_SERVICE_UNAVAILABLE | AI 服务暂不可用 | 稍后重试 |
| LLM_RESPONSE_ERROR | AI 返回内容异常 | 重试或关闭 AI 建议 |
| INTERNAL_ERROR | 服务端异常，请查看后端日志 | 检查 FastAPI 日志 |

## 七、基础 Prompt 模板

将下面这段 Prompt 复制到 Codex/Copilot/ChatGPT 中使用。

```text
我正在做一个 Vue3 + FastAPI 的售前原型。请不要写代码。

请基于下面的页面字段与交互设计，帮我整理前后端 API 契约。

输出要求：
1. 先输出 API 总表。
2. 每个接口都要包含方法、路径、调用页面、调用时机、请求参数、成功响应、失败响应。
3. 请求参数要说明类型、是否必填、示例和说明。
4. 响应结构要适配 success/message/data/error_code。
5. 页面适配规则要说明成功、失败、网络异常分别如何展示。
6. 不要写代码。

请按以下结构输出：

## 1. API 契约总表

| 功能模块 | 页面 | 方法 | 接口路径 | 用途 | 一期是否需要 |
|---|---|---|---|---|---|

## 2. 接口详情

### 接口 1：接口名称

#### 基本信息

| 项目 | 内容 |
|---|---|

#### 请求参数

| 参数名 | 类型 | 是否必填 | 示例 | 说明 |
|---|---|---|---|---|

#### 成功响应示例

#### 失败响应示例

#### 页面适配规则

| 响应情况 | 页面展示 | 用户下一步 |
|---|---|---|

## 3. 错误码展示建议

| error_code | 页面提示建议 | 用户动作 |
|---|---|---|

页面字段与交互设计如下：
"""
在这里粘贴 2-6 的页面字段与交互设计结果
"""
```

## 八、增强 Prompt：生成 axios 封装前的契约检查

在生成前端 API 调用代码前，可以先检查 API 契约是否足够清楚。

```text
请检查下面的 API 契约是否足够用于生成 Vue3 axios 调用代码。

请重点检查：
1. 是否缺少接口路径或方法。
2. 请求参数是否和页面字段一致。
3. 成功响应是否能被页面展示。
4. 失败响应是否包含 message 和 error_code。
5. 是否区分了业务失败和网络异常。
6. 是否存在前端无法判断或无法展示的信息。

请输出：
## 1. 契约完整性检查
## 2. 风险点
## 3. 建议补充
## 4. 可直接用于 axios 封装的最终接口说明

API 契约如下：
"""
粘贴 API 契约
"""
```

## 九、增强 Prompt：生成 axios 调用代码

当契约确认后，可以用下面的 Prompt 生成前端调用代码。

```text
请基于下面的 API 契约，生成 Vue3 + Vite 项目中的 axios API 封装代码。

技术要求：
1. 使用 axios。
2. 创建统一 client，支持 baseURL 配置。
3. 每个接口封装为独立函数。
4. 不在 API 函数里直接操作页面状态。
5. 保持 success/message/data/error_code 原始结构，交给页面决定如何展示。
6. 给出建议文件路径。

请输出：
1. `src/api/client.js`
2. `src/api/requirement.js`
3. `src/api/health.js`
4. 页面中如何调用的简短示例

API 契约如下：
"""
粘贴 API 契约
"""
```

## 十、示例：FDE Prototype Factory Web Console

### 1. API 契约总表

| 功能模块 | 页面 | 方法 | 接口路径 | 用途 | 一期是否需要 |
|---|---|---|---|---|---|
| 后端健康检查 | 工作台首页/健康检查页 | GET | `/health` | 检查 FastAPI 服务是否正常 | 是 |
| 客户需求分析 | 客户需求分析页 | POST | `/requirement/summary` | 生成客户需求结构化分析报告 | 是 |
| 故障案例报告 | 故障报告页 | POST | `/fault/report` | 生成故障案例分析报告 | 后续 |
| Excel 摘要 | Excel 摘要页 | POST | `/excel/summary` | 查看 Excel 基础摘要 | 后续 |

### 2. 接口详情：后端健康检查

#### 基本信息

| 项目 | 内容 |
|---|---|
| 接口名称 | 后端健康检查 |
| 接口路径 | `GET /health` |
| 对应页面 | 工作台首页、健康检查页 |
| 调用时机 | 页面打开或点击“检查服务” |
| 是否一期必需 | 是 |

#### 请求参数

无。

#### 成功响应示例

```json
{
  "status": "ok",
  "message": "FDE Training API is running"
}
```

#### 失败响应示例

健康检查主要失败来自网络异常或服务未启动。

```json
{
  "success": false,
  "message": "后端服务不可用，请检查 FastAPI 是否启动",
  "error_code": "NETWORK_ERROR"
}
```

#### 页面适配规则

| 响应情况 | 页面展示 | 用户下一步 |
|---|---|---|
| status=ok | 显示服务正常 | 继续使用业务页面 |
| 网络异常 | 显示后端不可用 | 启动或检查 FastAPI |

### 3. 接口详情：客户需求分析报告生成

#### 基本信息

| 项目 | 内容 |
|---|---|
| 接口名称 | 客户需求分析报告生成 |
| 接口路径 | `POST /requirement/summary` |
| 对应页面 | 客户需求分析页 |
| 调用时机 | 点击“生成报告”按钮 |
| 是否一期必需 | 是 |

#### 请求参数

| 参数名 | 类型 | 是否必填 | 示例 | 说明 |
|---|---|---|---|---|
| input_path | string | 是 | `data/customer-requirement.md` | 输入需求文件路径 |
| output_path | string | 是 | `output/api_requirement_summary.md` | 输出报告路径 |
| enable_ai_advice | boolean | 否 | false | 是否启用 AI 辅助建议 |

#### 成功响应示例

```json
{
  "success": true,
  "message": "客户需求结构化分析报告生成成功",
  "data": {
    "output_path": "output/api_requirement_summary.md"
  }
}
```

#### 失败响应示例

```json
{
  "success": false,
  "message": "输入文件不存在",
  "error_code": "FILE_NOT_FOUND"
}
```

#### 页面适配规则

| 响应情况 | 页面展示 | 用户下一步 |
|---|---|---|
| success=true | 显示成功提示和 `data.output_path` | 复制路径或再次生成 |
| success=false | 显示 `message` 和 `error_code` | 修改参数后重试 |
| 网络异常 | 显示后端服务不可用 | 检查 FastAPI 是否启动 |

## 十一、API 契约质量检查

完成 API 契约后，用下面清单检查。

| 检查项 | 合格标准 |
|---|---|
| 接口路径是否明确 | 每个接口都有方法和路径 |
| 调用页面是否明确 | 知道哪个页面在什么时机调用 |
| 请求参数是否完整 | 参数名、类型、必填、示例清楚 |
| 响应结构是否稳定 | 成功和失败响应字段明确 |
| 错误处理是否明确 | 业务失败和网络异常分开处理 |
| 是否适配页面状态 | 能驱动 loading、成功、失败状态 |
| 是否能生成 axios | 可以直接作为 API client Prompt 输入 |
| 是否能写进 README | 对外说明足够清楚 |

## 十二、下一步衔接

完成 2-7 后，下一节进入：

```text
2-8 Vue3 项目初始化
```

下一节开始真正进入前端工程，在项目中创建 `frontend/`，使用 Vite 初始化 Vue3 项目，并为后续页面生成和接口联调准备目录结构。
