# 2-27 物料到货跟踪原型页

## 本节目标

在已经完成项目总览、计划任务、异常闭环、现场调度之后，新增一个面向物资协调员和现场调度员的 P0 原型页面：物料到货跟踪。

这一步的核心价值是把现场调度中的“物料预警”继续向上游追踪，明确哪些物料已经到货、哪些在途、哪些存在延期风险，并形成可视化的前台原型页面。

## 本节产物

新增文件：

- `frontend/src/views/MaterialTrackingView.vue`
- `prototype_factory/27_material_tracking_view.md`

修改文件：

- `frontend/src/data/prototypeMockData.js`
- `frontend/src/components/StatusTag.vue`
- `frontend/src/App.vue`

## 页面能力

本节页面包含：

1. 物料到货指标摘要
2. 按区域、物料类别、到货状态筛选
3. 物料到货跟踪表格
4. 到货风险提示
5. 协调动作建议

## 设计说明

当前页面仍然使用本地 mock 数据，不调用后端接口。

后续接入 FastAPI 后，可以将本页数据替换为：

- `GET /api/materials/summary`
- `GET /api/materials/deliveries`
- `POST /api/materials/coordination-actions`

## 验收标准

启动前端后，应能在工作区切换中看到“物料跟踪”。点击后进入页面，能够看到物料指标、筛选区、到货跟踪表和协调建议。
