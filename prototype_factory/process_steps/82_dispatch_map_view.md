# 2-44：生成 P0 核心原型页面 - DispatchMapView（现场调度地图监控）

## 目标

根据 07 步「前端原型方案」输出的页面清单和页面规格，生成第一个 P0 核心原型页面：**DispatchMapView（现场调度地图监控）**。

## 背景

现有 5 个业务原型页面（ProjectOverviewView、ScheduleTrackingView 等）是早期通用骨架，与 07 步 FDE 方法链路产出的实际业务设计（海工生产运营—调度员现场调度场景）不匹配。需要按 07 步设计重新生成。

## 页面设计依据

来源：`prototype_factory/local_step_outputs/page.md` + `prototype.md`

- **名称**：现场调度地图监控
- **文件**：`DispatchMapView.vue`
- **优先级**：P0（核心页面）
- **职责**：基于地图看板实时展示所有车辆的位置、状态（空闲、排队、任务中、异常）、作业区域，支持缩放、点击查看车辆详情

## 实现要点

1. 用 CSS 模拟地图区域（网格背景 + 彩色车辆标记点），不接入真实地图 SDK
2. 顶部状态栏：4 个统计卡片（空闲/排队/任务中/异常）
3. 地图主体：模拟车辆标记点（按状态着色），可点击选中
4. 底部车辆详情面板：选中车辆后展开显示车牌、司机、状态、任务等
5. 右侧异常告警列表
6. 所有数据从 `dispatchMapMock.js` 读取

## 新增/修改文件

- `frontend/src/data/dispatchMapMock.js` — Mock 数据
- `frontend/src/views/DispatchMapView.vue` — 页面组件
- `frontend/src/App.vue` — 接入新页面

## 验收方式

1. `npm run dev` 正常启动
2. 切换到「业务原型系统」Tab，能看到新增的「地图监控」导航按钮
3. 点击进入后能看到模拟地图、车辆标记、统计卡片、告警列表
4. 点击车辆标记能展开底部详情面板
5. 浏览器 Console 无红色错误
