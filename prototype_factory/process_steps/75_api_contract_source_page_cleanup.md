# 75 API 契约来源页面清理

## 目标

修复 06 API 契约阶段中，点击单个接口的“生成契约”后，契约详情仍展示并保存 `来源页面/sourcePage` 的问题。

## 完成内容

- 在 `ApiContractView.vue` 的基础信息区移除“来源页面”展示项。
- 新增 API 契约保存前清洗逻辑，`api-contract-draft-update` 和确认进入下一步时都会移除 `sourcePage`。
- 调整单接口契约生成提示词：`sourcePage` 仅作为 LLM 生成上下文，不要求也不允许写入最终 API 契约。

## 验证

- 已执行 `npm run build`，前端构建通过。
