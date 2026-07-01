# 71 Feature Confirm Save And Handoff

## 目标
修复第 03 步“功能设计”确认进入下一步时的保存与传递链路：点击“确认并进入下一步”必须先保存本页生成内容到 `feature.md`，再将功能模块映射传递给第 04 步“页面设计”。

## 修改内容
- `FeatureDesignView.vue`：
  - 新增 `buildAllFeatureMappings()`，确认时统一收集所有业务场景的已生成模块。
  - 新增 `getFirstGeneratedModule()`，从已生成结果中安全选取传递给下一步的主模块。
  - 如果没有任何场景生成过功能模块，阻止进入第 04 步，并提示先点击场景卡片上的“生成”。
  - 确认 payload 增加 `confirmedAt`。
- `App.vue`：
  - `handleFeatureConfirm` 先调用 `writeStepResult('feature', result)` 保存到本地 Markdown。
  - 保存成功后再进入 `pageDesign`。
  - 上下文同步 `selectedFeatureModule`、`allFeatureMappings`、`revisedModulesByScenarioKey`，作为第 04 步输入。
  - 修复 `result.module.name` 在空模块情况下可能报错的问题。

## 验证
- 已运行 `npm run build`，构建通过。
