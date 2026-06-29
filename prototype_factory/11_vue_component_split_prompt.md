# 2-11 Vue3 组件拆分 Prompt

## 一、本节目标

将当前 Vue3 原型页面中的重复 UI 结构拆分为可复用组件，为后续扩展更多页面做准备。

当前页面已经包含：

- 工作台首页
- 能力入口卡片
- 客户需求分析页
- 执行结果展示区

本节将拆出以下组件：

```text
frontend/src/components/AppHeader.vue
frontend/src/components/FeatureCard.vue
frontend/src/components/ViewHeading.vue
frontend/src/components/ResultPanel.vue