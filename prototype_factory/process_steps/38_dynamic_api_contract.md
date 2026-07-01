# 2-38 API 契约动态路径推荐

## 本节目标

让 `ApiContractView.vue` 承接功能设计阶段确认的 `projectContext.selectedFeatureModule`，不再固定展示 `/api/projects/overview`，而是根据业务模块动态推荐 RESTful API 路径。

## 本节改动

### 1. `ApiContractView.vue` — API 契约动态化

- 新增页面 key 与契约 key 映射，修正 `scheduleTracking` 无法匹配 `scheduleTasks`、`issueTracking` 无法匹配 `createIssue` 的问题。
- 新增 `featureResourceRules`，根据功能模块名称、描述、API 方向和功能点识别资源域。
- 根据资源域生成 RESTful 路径：
  - 车辆相关模块推荐 `/api/vehicles/...`。
  - 物料相关模块推荐 `/api/materials/...`。
  - 异常相关模块推荐 `/api/issues/...`。
  - 任务/计划相关模块推荐 `/api/tasks/...`。
- 保持 Mock 风格，所有动态逻辑均在前端 `computed` 中完成，不接入真实后端。
- 保持输出 contract 对象结构，确保点击“下一步”后 `selectedApiContract` 能继续传递到原型建议和流程总览。

### 2. `App.vue` — 进度状态更新

- 将 2-37 标记为完成。
- 新增 2-38 进度条目，并标记为当前。

## 涉及文件

- `frontend/src/views/ApiContractView.vue`
- `frontend/src/App.vue`
- `prototype_factory/38_dynamic_api_contract.md`

## 验收方式

1. 运行 `cd frontend && npm run dev`。
2. 输入车辆、物料、任务或异常相关需求。
3. 依次完成需求输入、场景识别、功能设计、页面设计和交互设计。
4. 进入 API 契约页，验证接口路径会随已确认功能模块变化，例如车辆模块展示 `/api/vehicles/...`。
5. 点击“下一步：进入原型建议”，验证接口名称、路径和请求方法仍能在下一页展示。
