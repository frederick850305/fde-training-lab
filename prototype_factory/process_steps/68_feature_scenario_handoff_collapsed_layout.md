# 68 Feature Scenario Handoff Collapsed Layout

## 目标
优化第 03 步“功能设计”中来自第 02 步“场景识别”的上一步结果展示：默认折叠，确保数据来自上一页保存结果，并重构当前场景详情的 UI。

## 修改内容
- `FeatureDesignView.vue` 的业务场景列表改为折叠面板，默认收起。
- 当前场景详情改为折叠面板，默认收起。
- 业务场景数据优先读取 `projectContext.stepResults.scenario`，再回退 `projectContext.selectedScenario`，确保承接上一页保存内容。
- 当前场景详情重构为：
  - 左侧窄块：关联角色、建议页面，上下排布。
  - 右侧宽块：任务流程，从左至右流程轨道展示。
- 保持选中场景后继续驱动下方功能模块推荐。

## 验证
- 已运行 `npm run build`，构建通过。
