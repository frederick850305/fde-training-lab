# 2-37 功能模块与业务原型动态深度集成

## 本节目标

让“功能模块设计”工作台以及后续的业务原型页面全面摆脱静态默认数据的束缚，根据用户输入动态调整：

1. **功能模块动态生成**：`FeatureDesignView.vue` 根据需求关键词动态更名、描述和细化功能点。
2. **计划任务页动态集成**：`ScheduleTrackingView.vue` 接收 `projectContext`，展示功能模块设计阶段确认的模块名称和功能点。
3. **异常闭环页动态集成**：`IssueTrackingView.vue` 接收 `projectContext`，展示交互设计等后续阶段的联动信息。

## 本节改动

### 0. `FeatureDesignView.vue` — 功能设计动态化 (新增)

- **解析需求背景**：引入 `detectDomainLabel` 逻辑。
- **动态模块构建**：定义 `dynamicModules` 替换原始 Mock，实现“项目总览”->“车辆总览”等自动转换。
- **自适应过滤**：优化场景与模块的匹配算法，降低对硬编码字符串的依赖。

### 1. `ScheduleTrackingView.vue` — 计划任务页接入项目上下文

- **新增 props**：接收 `projectContext` 对象。
- **动态描述**：ViewHeading 的 description 会根据 `projectContext.selectedFeatureModule` 自动切换文案，显示关联的功能模块名称。
- **上下文 Banner**：当已确认功能模块时，顶部显示蓝色"方法联动"横幅，展示模块名称和功能点列表。
- **项目名称联动**：筛选器中的项目名称下拉使用 `projectContext.projectName`。

### 2. `IssueTrackingView.vue` — 异常闭环页接入项目上下文

- **新增 props**：接收 `projectContext` 对象。
- **双级联动**：
  - 优先展示 `selectedInteractionPage`（交互设计页字段）的联动信息。
  - 如果未完成交互设计，则退而展示 `selectedFeatureModule` 的功能模块信息。
- **动态描述**：ViewHeading description 根据上下文状态自动切换文案。
- **模块标注**：异常问题列表面板标题下方显示关联模块名称。

### 3. `App.vue` — 父组件传递上下文

- 为 `<ScheduleTrackingView>` 传递 `:project-context="projectContext"`。
- 为 `<IssueTrackingView>` 传递 `:project-context="projectContext"`。
- 进度列表更新 2-36 为完成，新增 2-37 条目。

## 涉及文件

- `frontend/src/App.vue`
- `frontend/src/views/ScheduleTrackingView.vue`
- `frontend/src/views/IssueTrackingView.vue`
- `prototype_factory/37_dynamic_details_integration.md`

## 验收方式

1. 运行 `cd frontend && npm run dev`。
2. 在方法工作台输入自定义需求（如：海工物料管理）。
3. 一路点击 Next 到达功能设计，确认一个功能模块（如：物料到货管理）。
4. 切换到顶部的"业务原型系统"页签。
5. 点击"计划任务"卡片：
   - 验证顶部显示"方法联动"横幅，展示功能模块名称和功能点。
   - 验证 ViewHeading 描述文字包含模块名称。
6. 点击"异常闭环"卡片：
   - 验证顶部显示"功能联动"横幅（如果未完成交互设计）。
   - 如果已完成交互设计，则显示"交互联动"横幅。
7. 验证三个业务原型页面（总览、计划任务、异常闭环）均已动态展示项目上下文信息。
