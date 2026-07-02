# 业务原型系统页面

此目录存放根据 FDE 方法链路（07 步）产出的页面清单生成的**业务原型页面**。

## 目录约定

- 每个 `.vue` 文件对应 07 步页面清单中的一个页面
- 文件名与 `prototype_factory/local_step_outputs/prototype.md` 中的 `viewFiles[].file` 一致
- 按优先级命名：P0 核心页面优先生成，P1/P2 辅助页面后续补充

## 已生成页面

| 文件 | 优先级 | 职责 |
|------|--------|------|
| `DispatchMapView.vue` | P0 | 现场调度地图监控 — 实时车辆位置、状态、告警 |

## 依赖

- 共享组件：`frontend/src/components/`
- Mock 数据：`frontend/src/data/prototype/`
- 不与 FDE 方法链路视图（`frontend/src/views/*.vue`）互相污染
