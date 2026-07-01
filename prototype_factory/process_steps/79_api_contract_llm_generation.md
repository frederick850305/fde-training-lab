# 79 API Contract LLM Generation

## Goal

将第 06 步“API 契约”从前端模拟数据改为基于第 05 步“页面交互”的大模型生成结果。

## Changes

- `ApiContractView.vue` 不再自动使用 `apiContractMock` 填充界面。
- 当 `api.md` 或 `projectContext.stepResults.api` 没有已保存内容时，页面只显示占位状态。
- 新增“生成接口契约”按钮，点击后读取页面交互结果中的页面、字段、按钮动作、校验规则和页面状态，压缩为 LLM 输入。
- LLM 返回接口契约后，立即触发 `api-contract-draft-update`，由 `App.vue` 保存到 `prototype_factory/local_step_outputs/api.md`。
- 点击“确认并进入下一步”时再次保存完整 API 契约结果，并进入第 07 步。

## Generation Strategy

第一版按“页面交互页”批量生成：每个页面只传递必要字段、动作、校验和状态，避免把全部项目上下文直接塞入模型。后续如果页面数量过多，可扩展为按页面或按场景分批生成，再合并写入 `api.md`。
