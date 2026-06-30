# 2-39 FDE 自助式单页向导方法

## 本节目标

把“原型工厂方法”从多入口展示型工作台升级为单页向导式 FDE 自助工具，让用户从客户原始需求开始，依次完成需求拆解、场景识别、功能设计、页面设计、交互设计、API 契约和前端原型方案输出。

## 本节改动

### 1. `App.vue` — 方法链路统一上下文

- 新增 `executionMode`、`llmProvider`、`currentMethodStep` 和 `stepResults`。
- 保留 `selectedScenario`、`selectedFeatureModule`、`selectedApiContract` 等兼容字段，避免破坏已有业务原型页面。
- 将方法区改为统一向导容器，右侧只渲染当前步骤工作台。
- 每一步确认后写入 `stepResults`，并同步旧字段，再进入下一步。
- 更新进度：2-38 完成，2-39 当前。

### 2. `FactoryWorkbenchView.vue` — 单页向导壳

- 左侧固定展示 7 步 FDE 方法链路。
- 每一步展示“当前 / 已确认 / 可生成 / 未开始”状态。
- 顶部新增生成模式选择：Mock 演示生成、LLM 预留模式。
- LLM 模式只保留 DeepSeek / 其他 LLM 的选择状态，不发起真实后端请求。

### 3. `RequirementInputView.vue` — 生成草案与确认分离

- “生成草案”只在页面内展示需求拆解草案。
- 点击“确认并进入下一步”后才写入 `projectContext`。
- 当前模式说明会根据 `projectContext.executionMode` 展示 Mock 或 LLM 预留状态。

### 4. 步骤页按钮统一

- 功能设计、页面设计、交互设计、API 契约统一使用“确认并进入下一步”。
- 前端原型建议确认后写入结构化原型方案，包括页面、组件、Mock 数据、生成顺序、API 契约和 Prompt。

## 涉及文件

- `frontend/src/App.vue`
- `frontend/src/views/FactoryWorkbenchView.vue`
- `frontend/src/views/RequirementInputView.vue`
- `frontend/src/views/FeatureDesignView.vue`
- `frontend/src/views/PageDesignView.vue`
- `frontend/src/views/PageInteractionView.vue`
- `frontend/src/views/ApiContractView.vue`
- `frontend/src/views/FrontendPrototypeSuggestionView.vue`
- `prototype_factory/39_fde_self_service_wizard_method.md`

## 验收方式

1. 运行 `cd frontend && npm run build`。
2. 打开原型工厂方法页，验证首屏为左侧 7 步进度 + 右侧当前步骤。
3. 在需求输入页点击“生成草案”，验证不会立即推进到下一步。
4. 点击“确认并进入下一步”，验证左侧需求步骤变为已确认，并进入场景识别。
5. 按链路继续确认到前端原型方案，验证 API 契约仍可根据功能模块推荐动态 RESTful 路径。
6. 切换到 LLM 预留模式，验证界面显示 DeepSeek / 其他 LLM 选择，但不调用真实后端。
