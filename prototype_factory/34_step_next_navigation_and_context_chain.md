# 2-34 步骤连续 Next 导航与上下文贯通

## 本节目标

本节在 2-33 的“场景结果写回并传递到功能设计”基础上，继续解决方法工作台的流程体验问题：

让用户可以在每一步直接点击 `Next` 进入下一步，不再必须回到操作台总览重新选择页面。

同时要求每次 `Next` 都把此前步骤的上下文结果继续写回并传递。

## 本节价值

此前虽然已经打通了部分上下文流转，但整体仍偏“单步确认”。

本节完成后，方法工作台主链路变成一条可连续执行的流程：

需求输入 -> 场景识别 -> 功能设计 -> 页面设计 -> 交互设计 -> API 契约 -> 前端原型建议

每一步都可以：

1. 当前页完成确认
2. 写回顶层 `projectContext`
3. 自动进入下一步

## 新增文件

| 类型 | 文件 | 位置 |
| --- | --- | --- |
| 新增 | `34_step_next_navigation_and_context_chain.md` | `prototype_factory/34_step_next_navigation_and_context_chain.md` |

## 修改文件

| 类型 | 文件 | 位置 |
| --- | --- | --- |
| 修改 | `RequirementInputView.vue` | `frontend/src/views/RequirementInputView.vue` |
| 修改 | `FeatureDesignView.vue` | `frontend/src/views/FeatureDesignView.vue` |
| 修改 | `PageDesignView.vue` | `frontend/src/views/PageDesignView.vue` |
| 修改 | `PageInteractionView.vue` | `frontend/src/views/PageInteractionView.vue` |
| 修改 | `ApiContractView.vue` | `frontend/src/views/ApiContractView.vue` |
| 修改 | `FrontendPrototypeSuggestionView.vue` | `frontend/src/views/FrontendPrototypeSuggestionView.vue` |
| 修改 | `App.vue` | `frontend/src/App.vue` |

## 当前交互规则

- 每个方法步骤页面提供下一步按钮。
- 每次下一步都通过事件把本步结果上抛给 `App.vue`。
- `App.vue` 统一更新 `projectContext` 并跳转下一步。
- 原型建议完成后可一键回到操作台总览。

## 验收方式

执行前端构建：

```bash
cd frontend
npm run build
```

浏览器打开页面后确认：

- 不需要回首页即可连续执行下一步。
- 每步点击 next 后都能进入对应下一页。
- 上下文摘要随步骤推进持续更新。