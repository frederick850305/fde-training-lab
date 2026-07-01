# 2-75 页面设计业务场景数量截断修复

## 问题

功能设计阶段显示 5 个业务场景，但进入页面设计阶段只显示 4 个。

## 原因

`PageDesignView.vue` 中 `visibleScenarioTabs` 使用了 `availableScenarios.value.slice(0, 4)`，导致页面设计工作台最多只渲染前 4 个场景。数据本身没有丢失，是 UI 渲染层主动截断。

## 修复

将 `visibleScenarioTabs` 改为直接返回 `availableScenarios.value`，页面设计阶段展示全部业务场景。

## 验证点

- 第 03 步功能设计有 5 个场景时，第 04 步页面设计应同步展示 5 个场景。
- 切换任意场景后，页面清单和当前页面仍根据当前场景联动。
