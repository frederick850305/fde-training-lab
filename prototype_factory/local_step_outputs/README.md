# FDE 方法步骤本地输出

本目录保存 FDE 自助式原型工厂各步骤的本地 Markdown 版本，作为工作台之间的数据传递载体。

## 文件清单

| 文件 | 步骤 | 说明 |
|---|---|---|
| `requirement.md` | 01 需求拆解 | 客户原始需求 → 业务背景、痛点、目标、角色和待确认问题 |
| `scenariopagedesign.md` | 02 场景→页面 | 需求拆解结果 → 角色、场景、功能模块、页面清单、导航结构 |
| `interactionapi.md` | 03 交互与API | 页面清单 → 字段、按钮、状态、API 路径、参数、响应和错误码 |
| `prototype.md` | 04 前端原型方案 | 汇总前三步的设计产物，包含 7 个子 Tab 的 LLM 生成结果 |

## 文件结构

每个 Markdown 文件包含两部分：

1. **人工可读的内容摘要**（项目、客户、场景、页面等关键信息）
2. **结构化 JSON 数据块**（包裹在 `<!-- FDE_STEP_RESULT_JSON_START -->` 和 `<!-- FDE_STEP_RESULT_JSON_END -->` 之间）

## 写入时机

- **步骤 01–03**：点击各工作台的「确认」按钮后，全量写入对应 Markdown 文件
- **步骤 04（前端原型方案）**：每个子 Tab 的「🤖 生成」按钮触发**增量写入**，只更新当前 Tab 生成的字段，不覆盖其他 Tab 已有数据。字段包括：
  - `pageDetailSpecs` — 页面规格（Tab 02）
  - `pageApiMapping` — 页面→API 映射（Tab 03）
  - `navigationRoutes` — 导航路由（Tab 04）
  - `componentFiles` — 组件契约（Tab 05）
  - `mockDataFiles` — Mock 数据 Schema（Tab 06）
  - `stepPrompts` — 代码生成 Prompt 任务包（Tab 07）

## 读取时机

进入下一步时，前端通过本地 FastAPI（`/method-files/{step_key}`）读取对应 Markdown 文件，将结构化数据恢复到 `projectContext`，作为新工作台的输入来源。

## 步骤演化历史

- 原始设计为 7 步（需求拆解 → 场景识别 → 功能设计 → 页面设计 → 交互设计 → API 契约 → 前端原型方案）
- Phase 2 合并为 4 步（场景+功能+页面 → 场景→页面；交互+API → 交互与API）
- 移除原「05 生成原型」步骤，原型代码生成改为通过 Tab 07 生成的 LLM Prompt 手动执行

