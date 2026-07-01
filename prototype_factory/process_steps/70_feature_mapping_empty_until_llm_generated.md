# 70 Feature Mapping Empty Until LLM Generated

## 目标
调整第 03 步“功能模块映射”区域默认行为：进入页面或切换到未生成的业务场景时，不再展示本地规则预填的功能模块，只显示占位提示。用户点击业务场景卡片上的“生成”按钮后，才调用 LLM 填充该场景对应的功能模块映射。

## 修改内容
- `FeatureDesignView.vue` 的 `getModulesForScenario` 改为只读取 `revisedModulesByScenarioKey` 中已生成/已保存的模块。
- 未生成的场景返回空数组，不再使用本地规则自动推荐。
- 空状态文案改为“等待生成”，提示用户点击上方场景卡片的“生成”。
- LLM 生成成功后仍写入 `revisedModulesByScenarioKey[scenario.key]`，切换场景时同步显示对应已生成内容。
- 生成后继续通过 `feature-draft-update` 保存到 `prototype_factory/local_step_outputs/feature.md`。

## 验证
- 已运行 `npm run build`，构建通过。
