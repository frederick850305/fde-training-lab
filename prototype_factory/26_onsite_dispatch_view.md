# 2-26 现场调度看板原型页

## 本节目标

在 P0 原型闭环中新增一个面向现场调度员的页面：现场调度看板。

前面已经完成：

- 2-23 项目总览原型页
- 2-24 计划任务跟踪原型页
- 2-25 异常问题闭环原型页

本节继续补充现场执行视角，让原型可以展示多作业面状态、关键资源占用和物料预警。

## 本节价值

现场调度员关注的不是单个任务，而是现场整体执行秩序：

- 哪些作业面正在施工
- 哪些作业面存在风险或阻塞
- 吊车、焊机、气瓶等关键资源是否冲突
- 焊材、切割嘴、保护气等现场物料是否短缺
- 出现异常时需要优先协调什么

这一页可以作为后续客户演示中非常直观的现场运营页面。

## 新增/修改文件

| 类型 | 文件 | 位置 |
| --- | --- | --- |
| 新增 | `26_onsite_dispatch_view.md` | `prototype_factory/26_onsite_dispatch_view.md` |
| 新增 | `OnsiteDispatchView.vue` | `frontend/src/views/OnsiteDispatchView.vue` |
| 修改 | `prototypeMockData.js` | `frontend/src/data/prototypeMockData.js` |
| 修改 | `App.vue` | `frontend/src/App.vue` |

## 页面能力

本节新增页面包含：

1. 作业面筛选
2. 现场状态摘要
3. 作业面状态列表
4. 关键资源占用卡片
5. 物料预警列表
6. 调度建议

## 当前阶段边界

当前仍然只使用前端 mock 数据：

- 不调用 FastAPI
- 不调用 DeepSeek
- 不做真实数据持久化
- 不做复杂排程算法

后续可以把这里的 mock 数据替换为接口返回数据。
