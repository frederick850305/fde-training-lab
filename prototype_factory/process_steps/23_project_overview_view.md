# 2-23 项目总览原型页

## 本节目标

本节在 2-22 的“原型 Mock 数据与通用组件准备”基础上，生成第一个真正的 P0 业务原型页面：项目总览页。

当前仍然不调用 DeepSeek，也不调用 FastAPI。本节使用 `prototypeMockData.js` 中的模拟数据，并复用 `MetricCard.vue`、`StatusTag.vue` 和 `DataTable.vue`，完成一个可展示的项目总览原型页面。

## 本节价值

前面 2-13 到 2-21 主要是在做“原型生成工作台”和“设计资产沉淀”。

2-23 开始进入“真实业务原型页面生成”。

项目总览页是 P0 页面中的第一个页面，它面向项目经理，用于一屏查看：

- 项目进度
- 延期任务
- 异常问题
- 资源占用
- 关键节点
- 异常问题摘要

这一步完成后，你会看到 AI 原型工厂从“设计流程”开始真正生成“可演示页面”。

## 新增文件

| 类型 | 文件 | 位置 |
| --- | --- | --- |
| 新增 | `23_project_overview_view.md` | `prototype_factory/23_project_overview_view.md` |
| 新增 | `ProjectOverviewView.vue` | `frontend/src/views/ProjectOverviewView.vue` |

## 修改文件

| 类型 | 文件 | 位置 |
| --- | --- | --- |
| 修改 | `App.vue` | `frontend/src/App.vue` |

## 页面设计

`ProjectOverviewView.vue` 包含：

1. 页面标题区
   - 页面名称
   - 当前项目名称
   - 当前模式提示

2. 指标卡片区
   - 项目进度
   - 延期任务
   - 异常问题
   - 资源占用

3. 关键节点区
   - 节点名称
   - 计划日期
   - 状态标签

4. 异常问题摘要区
   - 异常 ID
   - 异常标题
   - 责任人
   - 状态
   - 截止日期

## 当前交互规则

- 当前页面只使用本地 mock 数据。
- 当前页面不调用后端接口。
- 指标卡片复用 `MetricCard.vue`。
- 状态展示复用 `StatusTag.vue`。
- 异常列表复用 `DataTable.vue`。

## 后续扩展方向

后续可以继续扩展：

- 增加项目筛选条件
- 增加 loading/empty/error 状态切换
- 点击异常进入异常问题闭环页
- 将 mock 数据替换为 `GET /api/projects/overview`
- 继续生成计划任务跟踪页和异常问题闭环页

## 验收方式

启动前端后检查：

```bash
cd frontend
npm run dev
```

浏览器打开页面后确认：

- 工作区切换中出现“项目总览”
- 点击“项目总览”后进入项目总览原型页
- 可以看到 4 个指标卡片
- 可以看到关键节点状态
- 可以看到异常问题摘要表格
- 第二阶段练习进度更新为 `2-23：项目总览原型页`
