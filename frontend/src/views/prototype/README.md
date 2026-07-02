# 业务原型系统页面

此目录存放根据 FDE 方法链路（07 步）产出的页面清单生成的**业务原型页面**。

> ⚠️ 原型页面已迁移至独立项目 `prototypes/sea-industry-dispatch/`，本目录仅供 FDE 系统内嵌引用。

## 已生成页面（全部 7 页）

| 文件 | 优先级 | 职责 |
|------|--------|------|
| `DispatchMapView.vue` | P0 | 现场调度地图监控 — 实时车辆位置、状态、告警 |
| `TaskListView.vue` | P0 | 司机任务列表 — 筛选、通知、状态管理 |
| `OnsiteVehicleFilterView.vue` | P1 | 车辆快速筛选 — 类型/状态/区域/距离 |
| `OnsiteDispatchDialogView.vue` | P1 | 现场派车 — 申请匹配、优先级、一键下发 |
| `OnsiteExceptionAlertView.vue` | P1 | 异常告警处理 — 实时告警、确认/忽略 |
| `EntryCheckPanelView.vue` | P1 | 入场核验 — 扫描/手动输入、预约验证 |
| `StatisticsAnalysisView.vue` | P1 | 统计分析 — KPI/柱状图/效率排名 |
