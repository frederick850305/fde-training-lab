# 2-73 默认大模型与 DeepSeek 运行配置

## 本次目标

将 FDE 自助式原型工厂的默认生成方式调整为正式大模型流程：

- 模式默认：大模型生成
- 模型默认：DeepSeek

## 已完成修改

- `App.vue` 的 `projectContext` 默认值改为 `executionMode: 'llm-ready'`。
- `App.vue` 的 `projectContext` 默认模型改为 `llmProvider: 'deepseek'`。
- `FactoryWorkbenchView.vue` 的顶部模式选择 fallback 改为 `llm-ready`，避免没有上下文时回落到本地规则生成。
- 保留“本地规则生成”作为手动可选项，方便 DeepSeek Key 未配置或服务不可用时切换。

## 注意事项

- 已保存的本地 Markdown / 浏览器上下文会保留当时保存的模式，不强制覆盖历史记录。
- 新建或重置后的默认体验为“大模型生成 + DeepSeek”。
