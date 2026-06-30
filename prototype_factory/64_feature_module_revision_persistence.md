# 64 Feature Module Revision Persistence

## 目标
修复功能设计页中，大模型修改删除某个场景下的功能模块后，进入下一步再返回功能设计页时删除结果丢失的问题。

## 问题原因
- 功能设计页的 `revisedModulesByScenarioKey` 只保存在组件本地状态，页面重新挂载后会回到默认规则生成的功能模块。
- 当大模型修改结果为 `modules: []` 时，空数组没有被稳定识别为“有效修改结果”，导致删除全部模块的意图容易被默认推荐逻辑覆盖。

## 修改内容
- `FeatureDesignView.vue` 从 `projectContext.stepResults.feature` 恢复 `revisedModulesByScenarioKey`。
- `getModulesForScenario` 改为使用 `hasOwnProperty` 判断是否存在场景级修改，使空数组也能覆盖默认模块。
- 大模型修改后保存 `revisedModulesByScenarioKey`，并在确认进入下一步时一并写入结果。
- `App.vue` 在功能设计草稿、确认结果和本地 Markdown 恢复链路中同步 `revisedModulesByScenarioKey`。

## 验证
- 已运行 `npm run build`，构建通过。
