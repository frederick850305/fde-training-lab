# 2-10 客户需求分析页生成

本文件用于沉淀“客户需求分析页”的生成方法。该页面是第二阶段第一个真正的业务功能页，用于承接第一阶段 FastAPI 的 `/requirement/summary` 能力。

## 一、本节目标

本节生成一个 Vue3 页面组件：

```text
frontend/src/views/RequirementSummaryView.vue
```

本节先完成前端交互骨架：

| 能力 | 本节是否实现 |
|---|---|
| 输入需求文件路径 | 是 |
| 输入报告输出路径 | 是 |
| AI 建议开关 | 是 |
| 前端必填校验 | 是 |
| loading 状态 | 是，先模拟 |
| 成功结果展示 | 是，先模拟 |
| 失败结果展示 | 是，先预留 |
| 真实调用 FastAPI | 否，后续 2-12/2-13 实现 |

## 二、页面设计说明

### 页面目标

```text
让 FDE 能输入客户需求文件路径，触发需求分析报告生成，并看到任务结果。
```

### 页面字段

| 字段名称 | 字段标识 | 类型 | 是否必填 | 默认值 |
|---|---|---|---|---|
| 需求文件路径 | inputPath | 文本输入 | 是 | `data/customer-requirement.md` |
| 报告输出路径 | outputPath | 文本输入 | 是 | `output/api_requirement_summary.md` |
| 启用 AI 建议 | enableAiAdvice | 开关 | 否 | false |

### 页面状态

| 状态 | 触发条件 | 页面表现 |
|---|---|---|
| 默认 | 页面打开 | 展示默认字段和空结果 |
| 校验失败 | 必填字段为空 | 字段下方显示错误提示 |
| loading | 点击生成报告 | 按钮禁用，显示处理中 |
| 成功 | 模拟生成成功 | 展示成功提示和输出路径 |
| 失败 | 后续接口失败 | 展示错误信息和错误码 |

## 三、页面生成 Prompt

后续你可以把下面 Prompt 发给 Codex/Copilot。

```text
请为 Vue3 + Vite 项目生成一个客户需求分析页面组件。

文件路径：
frontend/src/views/RequirementSummaryView.vue

业务背景：
这是 FDE Prototype Factory Web Console 的核心功能页，用于调用后端 FastAPI 的客户需求分析能力。

本节要求：
1. 先不要真实调用后端接口。
2. 先完成页面布局、表单、前端校验、loading、成功、失败状态。
3. 使用 Vue3 `<script setup>`。
4. 使用 scoped CSS。
5. 不引入 UI 组件库。
6. 页面适合企业级售前原型展示。

字段：
1. inputPath：需求文件路径，必填，默认 `data/customer-requirement.md`
2. outputPath：报告输出路径，必填，默认 `output/api_requirement_summary.md`
3. enableAiAdvice：是否启用 AI 建议，默认 false

按钮：
1. 生成报告：校验通过后模拟 loading，再展示成功结果
2. 重置：恢复默认值并清空结果

结果区：
1. 默认展示空状态说明
2. loading 展示正在生成
3. 成功展示 message 和 output_path
4. 失败预留 message 和 error_code

请生成完整 Vue 单文件组件。
```

## 四、验收标准

| 检查项 | 合格标准 |
|---|---|
| 字段完整 | inputPath、outputPath、enableAiAdvice 都存在 |
| 校验可用 | 必填字段为空时不能提交 |
| 状态完整 | 默认、loading、成功、失败结构清楚 |
| 结果区清楚 | 用户能看到输出路径或错误信息 |
| 后续可联调 | 生成报告函数后续可替换为真实 API 调用 |

## 五、下一步衔接

完成 2-10 后，下一节进入：

```text
2-11 Vue3 组件拆分
```

下一节会把当前页面中可复用的 Header、能力卡片、结果面板、错误提示等结构进一步拆成组件。
