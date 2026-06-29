# 2-22 原型 Mock 数据与通用组件准备

## 本节目标

本节在 2-21 的“前端原型建议模拟工作台”基础上，开始为后续真实生成 P0 前端原型页面做准备。

当前仍然不调用 DeepSeek，也不调用 FastAPI。本节先新增一份统一的原型 mock 数据，并准备几个后续页面会复用的 Vue3 通用组件。

## 本节价值

2-21 已经说明了后续应该生成哪些页面、哪些组件、哪些 mock 数据。

2-22 开始真正把这些建议落到工程文件里。

但本节不急着生成完整业务页面，而是先完成两件事：

1. 准备 `prototypeMockData.js`，让后续页面可以直接引用统一数据。
2. 准备通用组件，减少后续页面重复代码。

这样做可以让后续的 `ProjectOverviewView.vue`、`ScheduleTrackingView.vue`、`IssueTrackingView.vue` 更清晰，也更接近真实工程写法。

## 新增文件

| 类型 | 文件 | 位置 |
| --- | --- | --- |
| 新增 | `22_prototype_mock_components.md` | `prototype_factory/22_prototype_mock_components.md` |
| 新增 | `prototypeMockData.js` | `frontend/src/data/prototypeMockData.js` |
| 新增 | `MetricCard.vue` | `frontend/src/components/MetricCard.vue` |
| 新增 | `StatusTag.vue` | `frontend/src/components/StatusTag.vue` |
| 新增 | `DataTable.vue` | `frontend/src/components/DataTable.vue` |
| 新增 | `EmptyState.vue` | `frontend/src/components/EmptyState.vue` |

## 修改文件

| 类型 | 文件 | 位置 |
| --- | --- | --- |
| 修改 | `App.vue` | `frontend/src/App.vue` |

## 文件说明

### prototypeMockData.js

用于集中保存后续 P0 原型页面需要用到的模拟数据，包括：

- 项目总览指标
- 计划任务列表
- 异常问题列表
- 状态选项

### MetricCard.vue

用于展示关键指标，例如：

- 项目进度
- 延期任务
- 异常问题
- 资源占用

### StatusTag.vue

用于统一展示状态标签，例如：

- 正常
- 预警
- 延期
- 阻塞
- 已完成

### DataTable.vue

用于展示简单表格数据。

本节先实现轻量版本，只支持：

- 列配置
- 行数据
- 空状态展示

### EmptyState.vue

用于统一展示空状态。

## 当前交互规则

本节主要是工程能力准备，不新增单独工作区页面。

用户在本节验收时，重点检查：

- 文件是否创建成功
- 组件代码是否完整
- `App.vue` 进度是否更新到 2-22

## 后续扩展方向

后续小节可以继续扩展：

- 生成 `ProjectOverviewView.vue`
- 在项目总览页中使用 `MetricCard`
- 在计划任务页中使用 `DataTable` 和 `StatusTag`
- 在异常问题页中使用 `DataTable`、`StatusTag` 和 `EmptyState`
- 后续再把 mock 数据替换为 FastAPI 接口请求

## 验收方式

启动前端后检查：

```bash
cd frontend
npm run dev
```

浏览器打开页面后确认：

- 页面可以正常打开
- 第二阶段练习进度更新为 `2-22：原型 Mock 数据与通用组件准备`

在 VSCode 中确认新增文件：

- `frontend/src/data/prototypeMockData.js`
- `frontend/src/components/MetricCard.vue`
- `frontend/src/components/StatusTag.vue`
- `frontend/src/components/DataTable.vue`
- `frontend/src/components/EmptyState.vue`
