# 业务原型系统 Mock 数据

此目录存放根据 07 步「前端原型方案」产出的 Mock 数据 Schema 生成的**原型 Mock 数据文件**。

## 目录约定

- 每个 `.js` 文件对应 07 步 prototype.md 中 `mockDataFiles[].file` 的建议
- 按业务域拆分（如 dispatch、task、alert 等）
- export 命名与页面 import 一致

## 已生成文件

| 文件 | 服务页面 | 内容 |
|------|----------|------|
| `dispatchMapMock.js` | DispatchMapView | 车辆、告警、区域、统计 |

## 依赖

- 不与 FDE 方法链路 Mock 数据（`frontend/src/data/*.js`）互相污染
