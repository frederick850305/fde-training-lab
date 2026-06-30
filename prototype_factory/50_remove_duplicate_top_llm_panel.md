# 2-50 移除顶部重复大模型修改面板

## 背景

`04 页面设计` 中顶部出现了通用“大模型修改”面板，页面底部也有页面设计专用的大模型修改面板，形成重复。

## 本节改动

- `FactoryWorkbenchView.vue`
  - 移除步骤工作台顶部的通用 `LlmStepRevisionPanel` 渲染。
  - 移除对应的组件 import。
- 保留各具体步骤内部自己的大模型修改入口，例如 `PageDesignView.vue` 底部的页面设计专用面板。

## 验证

- `npm run build` 通过。
