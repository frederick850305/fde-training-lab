# 2-6 交互与API一体化设计模板

本文件用于把 2-5 的页面清单，一次性生成页面交互设计和对应的 API 契约。

核心原则：

```text
字段即参数，按钮即接口，状态即响应适配。
不要分开设计交互和 API，它们天然是一体两面。
```

## 一、本节目标

完成 2-5 后，我们已经知道有哪些页面。2-6 不需要分成两步（先交互再 API），而是一次性完成：

```text
选择页面
  -> 字段设计 → 这些字段就是 API 请求参数
  -> 按钮设计 → 按钮点击就是 API 调用
  -> 状态设计 → 状态展示就是 API 响应适配
  -> API 契约 → 方法、路径、参数（=字段）、响应、错误码
```

## 二、为什么合并

原来的两步存在大量重复：

| 原 Step 05（交互） | 原 Step 06（API） | 实际关系 |
|---|---|---|
| 字段名称 `vehicleId` | 请求参数 `vehicle_id` | 同一个东西，名称不同而已 |
| 按钮「查询车辆」 | `GET /api/vehicles` | 按钮动作 = API 调用 |
| 成功状态展示 | `successResponse.data` | 状态 = 响应适配 |
| 失败状态展示 | `errorResponse` + `errorCodes` | 状态 = 错误适配 |

合并后，用户选择一个页面，点一次「生成」，交互和 API 同时产出，左右对照查看。

## 三、输出结构

### 左侧：交互设计

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| vehicleId | 文本 | 是 | 目标车辆标识 |
| taskType | 下拉选择 | 是 | 任务类型：吊装/转运/配送 |

| 按钮 | 触发 | 反馈 |
|---|---|---|
| 查询车辆 | 点击按钮 | 更新地图车辆标记 |
| 派发任务 | 点击派发 | 保存任务并通知司机 |

| 状态 | 表现 |
|---|---|
| 默认 | 展示空地图和筛选面板 |
| loading | 地图加载中动画 |
| 成功 | 展示车辆标记和任务结果 |
| 失败 | 展示错误提示和重试按钮 |

### 右侧：API 契约

| 项目 | 内容 |
|---|---|
| 方法 | POST |
| 路径 | `/api/vehicles/dispatch` |
| 调用时机 | 调度员选择车辆后点击「派发任务」 |
| 请求参数 | `vehicleId` (string,必填), `taskType` (string,必填), `priority` (string) |
| 成功响应 | `{ code:0, message:"success", data:{ taskId, status } }` |
| 失败响应 | `{ code:500, message:"派发失败", error:{ code:"DISPATCH_FAILED" } }` |

## 四、基础 Prompt 模板

```text
我正在做一个 Vue3 售前原型设计。请不要写代码。

请基于下面的页面设计，一次性生成该页面的交互设计和 API 契约。

输出要求：
1. 只返回严格 JSON，结构为：
{
  "interactionDesign": {
    "fields": [{ "name", "label", "type", "required", "description" }],
    "actions": [{ "label", "trigger", "feedback" }],
    "validations": ["校验规则..."],
    "states": { "empty", "loading", "success", "error" }
  },
  "apiContract": {
    "method": "GET|POST|PUT|DELETE",
    "name": "接口中文名",
    "path": "/api/...",
    "goal": "接口目标",
    "trigger": "调用时机",
    "requestParams": [{ "name", "type", "required", "description" }],
    "successResponse": { "code":0, "message":"success", "data":{} },
    "errorResponse": { "code":500, "message":"...", "error":{} },
    "errorCodes": [{ "code", "meaning", "frontendAdvice" }]
  }
}

2. 字段设计时，requestParams 直接复用 fields 的 name/type/required/description。
3. actions 中的核心操作对应 API 的 method 和 path。
4. states 中的 success/error 对应 API 的 successResponse/errorResponse。
5. errorCodes 至少包含 VALIDATION_FAILED 和业务失败码。

页面设计如下：
"""
粘贴 2-5 的页面设计结果
"""
```

## 五、验收清单

| 检查项 | 合格标准 |
|---|---|
| 字段 = API 参数 | 交互的字段名称与 API 的 requestParams 一致 |
| 按钮 = API 方法 | 主按钮动作有对应的 API 方法和路径 |
| 状态 = 响应适配 | 成功/失败状态的描述与 API 响应结构对应 |
| 接口路径合理 | 路径按业务资源归类（/api/vehicles, /api/tasks 等） |
| 错误码完整 | 至少包含校验失败和业务失败两类错误码 |

## 六、与原两步流程的对比

| 对比维度 | 原两步流程 | 合并后 |
|---|---|---|
| 步骤数 | 2（交互 + API） | 1（交互与API） |
| 用户点「生成」次数 | 2-3 次 | 1 次 |
| 页面切换 | 从交互页切换到 API 页 | 同一页面左右对照 |
| 字段/参数一致性 | 需手动核对 | 自动关联 |
| 按钮/接口对应 | 需手动核对 | 同一视图可见 |
