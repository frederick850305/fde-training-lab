# 2-35 方法链路闭环到原型流程总览

## 本节目标

在 2-34 的连续 Next 基础上继续完善链路终点：

让前端原型建议不再直接返回操作台，而是先进入原型流程总览页进行链路核对，
再由流程页一键回到操作台，形成完整闭环。

## 本节改动

1. 前端原型建议页按钮文案与行为调整
- 按钮改为“下一步：进入原型流程总览”。
- 点击后触发上抛事件，由顶层跳转到流程页。

2. 原型流程页增加闭环动作
- 增加“完成本轮并回到操作台总览”按钮。
- 点击后触发上抛事件，由顶层更新上下文状态并回到操作台。

3. App 顶层事件流转更新
- 原型建议确认后：写回建议状态 -> 跳到 `prototypeWorkflow`。
- 流程核对完成后：写回闭环状态 -> 跳到 `factoryWorkbench`。

4. 练习进度更新
- 2-33 标记为完成。
- 2-34 标记为完成。
- 新增 2-35 为当前。

## 涉及文件

- `frontend/src/views/FrontendPrototypeSuggestionView.vue`
- `frontend/src/views/PrototypeWorkflowView.vue`
- `frontend/src/App.vue`
- `prototype_factory/35_method_chain_close_loop_to_workflow.md`

## 验收方式

```bash
cd frontend
npm run build
```

页面手工验证：

1. 从需求输入开始按 Next 连续推进到“前端原型建议”。
2. 点击“下一步：进入原型流程总览”。
3. 在流程页点击“完成本轮并回到操作台总览”。
4. 确认已回到操作台，且上下文摘要显示本轮已闭环。
