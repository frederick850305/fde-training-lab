# 2-46 页面设计本地保存反馈与页面区域持久化

## 背景

点击 `04 页面设计` 的“保存本地版本”后，用户侧没有明显反馈；同时需要确保当前场景下选中的页面，以及大模型生成/修改后的页面区域内容，能够明确保存到本地上下文，供下一步交互设计导入。

## 本节改动

- `PageDesignView.vue`
  - 增加本地保存反馈文案，显示已保存的场景、页面、页面区域数量和保存时间。
  - 保存按钮点击后文案切换为“已保存”。
  - 编辑页面基础信息、承载功能、页面区域后，会重置为“待保存”状态。
  - 保存 payload 显式包含：
    - `currentScenarioKey`
    - `selectedPageKey`
    - `currentPage`
    - `currentPageSections`
    - `sectionGenerationSource`
    - `scenarioDesigns`
- `App.vue`
  - 页面设计保存后，额外写入：
    - `selectedPageSections`
    - `selectedPageScenario`
    - `pageDesignResult`
  - summary 中展示已保存页面区域数量。

## 验证

- `npm run build` 通过。
