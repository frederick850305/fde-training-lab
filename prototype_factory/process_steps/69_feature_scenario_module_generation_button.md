# 69 Feature Scenario Module Generation Button

## 目标
在第 03 步“功能设计”的业务场景卡片上增加主动调用 LLM 的“生成”按钮。用户点击后，系统根据当前业务场景上下文生成该场景对应的功能模块映射，并自动保存到当前步骤本地 Markdown。

## 设计说明
- “生成”按钮放在每张业务场景卡片右上角，与优先级和场景标题同层展示。
- 场景卡片本身仍用于切换当前场景；“生成”按钮只作用于对应场景。
- 将原场景卡从嵌套按钮结构改为可点击卡片，避免按钮内嵌按钮造成交互问题。

## 修改内容
- `FeatureDesignView.vue` 新增场景级 `生成` 按钮。
- 点击按钮后：
  - 自动选中该业务场景。
  - 调用 `/llm/revise-step`，输入当前场景、任务流程、页面映射、需求背景和现有模块。
  - 要求 LLM 返回 `{ modules: [] }` 格式的功能模块映射。
  - 将生成结果写入 `revisedModulesByScenarioKey[scenario.key]`。
  - 触发 `feature-draft-update`，由 App 写入 `prototype_factory/local_step_outputs/feature.md`。
- 增加 30 秒超时和生成状态提示。
- 生成成功后场景卡显示“已保存”。

## 验证
- 已运行 `npm run build`，构建通过。
