# 2-21 前端原型建议模拟工作台

## 本节目标

本节在 2-20 的“API 契约设计模拟工作台”基础上，继续完成原型生成流程的第七步：前端原型建议。

当前仍然不调用 DeepSeek，也不调用 FastAPI。本节通过前端模拟数据，把前面沉淀的需求、场景、功能、页面、交互和 API 契约，汇总成可以指导 Codex/Copilot 生成 Vue3 前端原型的建议。

## 本节价值

API 契约设计回答的是“前后端如何交互”。

前端原型建议回答的是“接下来应该让 AI 生成哪些 Vue 文件、组件如何拆分、mock 数据放在哪里、按什么顺序生成更稳”。

这一步是从“设计资产”走向“代码生成”的桥。后续接入 DeepSeek 或调用 Codex/Copilot 时，不应该直接一句话让 AI 写完整系统，而是要带着清晰的文件清单、组件拆分、生成顺序和约束 Prompt。

## 新增文件

| 类型 | 文件 | 位置 |
| --- | --- | --- |
| 新增 | `21_frontend_prototype_suggestion_mock.md` | `prototype_factory/21_frontend_prototype_suggestion_mock.md` |
| 新增 | `frontendPrototypeSuggestionMock.js` | `frontend/src/data/frontendPrototypeSuggestionMock.js` |
| 新增 | `FrontendPrototypeSuggestionView.vue` | `frontend/src/views/FrontendPrototypeSuggestionView.vue` |

## 修改文件

| 类型 | 文件 | 位置 |
| --- | --- | --- |
| 修改 | `App.vue` | `frontend/src/App.vue` |

## 页面设计

`FrontendPrototypeSuggestionView.vue` 包含五类信息：

1. Vue 页面文件建议
   - 文件名
   - 页面职责
   - 来源设计资产

2. 组件拆分建议
   - 组件名
   - 组件职责
   - 可复用位置

3. Mock 数据建议
   - 数据文件
   - 数据内容
   - 服务页面

4. 生成顺序建议
   - 先生成 mock 数据
   - 再生成通用组件
   - 再生成页面
   - 最后接入 API 请求

5. Codex/Copilot Prompt
   - 用于后续复制给 AI 生成前端原型

## 当前交互规则

- 页面默认展示前端原型建议总览。
- 点击不同建议类型，可查看对应清单。
- 页面底部展示一段可复制的代码生成 Prompt。

## 后续扩展方向

后续可以继续扩展：

- 增加“复制 Prompt”按钮
- 增加“生成原型文件”按钮
- 接入 DeepSeek 生成动态 Prompt
- 接入 Codex 自动创建页面文件
- 生成真实 Vue3 前端原型页面

## 验收方式

启动前端后检查：

```bash
cd frontend
npm run dev
```

浏览器打开页面后确认：

- 工作区切换中出现“原型建议”
- 点击“原型建议”后进入前端原型建议模拟工作台
- 可以看到页面文件、组件文件、mock 数据和生成顺序建议
- 可以看到 Codex/Copilot 代码生成 Prompt
- 第二阶段练习进度更新为 `2-21：前端原型建议模拟工作台`
