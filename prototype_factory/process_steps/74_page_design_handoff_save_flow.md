# 2-74 页面设计输入承接与保存流转优化

## 本次目标

优化第 04 步页面设计：

- 页面场景、页面清单、当前页面基础信息优先从本地 Markdown / 上一步结果恢复。
- 页面区域通过“调用大模型生成”按当前页面上下文生成。
- 页面区域“保存”按钮写入本页对应的 `page.md`。
- 移除底部“保存本地版本”按钮，确认进入下一步时自动保存完整页面设计成果。

## 已完成

- `PageDesignView.vue` 新增 `getAllFeatureMappings()`，兼容读取 `projectContext.allFeatureMappings` 与 `stepResults.feature`。
- `PageDesignView.vue` 新增 `getStoredScenarioDesign()`，优先恢复已保存的页面设计结果。
- 页面区域生成接口输入补充了业务场景、全部页面清单、导航结构、文件结构和当前页面。
- 页面区域保存继续通过 `page-design-draft-update` 写入 `page.md`。
- “确认并进入下一步”会构建本页完整成果并通过 `page-design-confirm` 写入 `page.md` 后进入交互设计。
- 底部“保存本地版本”按钮已移除。
