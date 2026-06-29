# 2-32 需求结果写回并传递到场景识别

## 本节目标

本节在 2-31 的“项目上下文流转打通”基础上，继续往前推进一步：

将需求输入工作台的分析结果写回统一项目上下文，并传给场景识别工作台展示。

当前仍然不调用 DeepSeek，也不调用 FastAPI，不引入新的 npm 依赖。本节只打通第一条真正的“结果传递链”，不一次性重写全部工作台。

## 本节价值

2-31 已经实现：

- 操作台总览可以建立演示项目上下文
- 需求输入页可以读取当前上下文

但上下文里还没有真正承载“步骤产物”。

本节通过把需求输入的分析结果写回 `projectContext`，再传给场景识别页，验证：

1. 工作台不仅能共享项目信息
2. 还可以共享上一步的结构化结果
3. 场景识别页开始具备“基于上一步结果”的工作台意味

## 新增文件

| 类型 | 文件 | 位置 |
| --- | --- | --- |
| 新增 | `32_requirement_to_scenario_context.md` | `prototype_factory/32_requirement_to_scenario_context.md` |

## 修改文件

| 类型 | 文件 | 位置 |
| --- | --- | --- |
| 修改 | `RequirementInputView.vue` | `frontend/src/views/RequirementInputView.vue` |
| 修改 | `ScenarioIdentificationView.vue` | `frontend/src/views/ScenarioIdentificationView.vue` |
| 修改 | `App.vue` | `frontend/src/App.vue` |

## 当前交互规则

- 需求输入页完成模拟分析后，将分析结果通过事件上抛。
- `App.vue` 接收结果并写入统一 `projectContext`。
- 场景识别页读取 `projectContext` 中的需求拆解摘要。
- 用户从需求输入进入场景识别时，可以看到上一阶段结果已经开始传递。

## 后续扩展方向

后续可以继续扩展：

- 将场景识别结果继续写回上下文并传给功能设计。
- 在上下文中增加每一步的版本号、状态和时间戳。
- 将 mock 结果替换为 FastAPI + DeepSeek 的真实结果。

## 验收方式

执行前端构建：

```bash
cd frontend
npm run build
```

浏览器打开页面后确认：

- 在需求输入页点击“开始分析”后，分析结果能够写回项目上下文。
- 切换到场景识别页后，可以看到来自需求输入阶段的拆解摘要。
- 第一 Tab 的链路已经从“共享项目信息”升级为“共享步骤结果”。
- 第二阶段练习进度更新为 `2-32：需求结果写回并传递到场景识别`。