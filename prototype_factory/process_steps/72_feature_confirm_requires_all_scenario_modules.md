# 72 Feature Confirm Requires All Scenario Modules

## 目标
防止第 03 步“功能设计”进入第 04 步时，部分业务场景还没有生成对应功能模块，导致页面设计阶段输入不完整。

## 修改内容
- `FeatureDesignView.vue` 的 `confirmAndNext()` 校验从“至少一个场景已生成模块”改为“所有业务场景都必须已生成模块”。
- 新增 `getMissingGeneratedScenarios()`，列出未生成功能模块的场景名称。
- 如果存在未生成场景，阻止跳转，并提示用户逐个点击场景卡片上的“生成”。
- 只有全部场景均有模块映射后，才保存 `feature.md` 并进入第 04 步页面设计。

## 验证
- 已运行 `npm run build`，构建通过。
