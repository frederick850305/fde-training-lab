# 2-14 需求拆解模拟结果

## 本节目标

本节在 2-13 的需求输入工作台基础上，新增一份前端模拟的“需求拆解结果”。

当前仍然不调用 DeepSeek，也不调用 FastAPI。点击“开始分析”后，页面会根据固定模拟数据展示结构化拆解结果，让用户先理解后续大模型应该输出什么格式。

## 本节价值

2-13 解决的是“客户需求从哪里输入”。

2-14 解决的是“客户需求输入后，前台应该如何承接第一层结构化结果”。

这一步非常重要，因为后续接入 DeepSeek 时，不能只让大模型返回一大段自然语言，而应该让它按前台可展示、可流转、可继续加工的结构返回结果。

本节完成后，系统将具备：

- 输入客户原始需求
- 模拟开始分析
- 展示业务背景
- 展示客户痛点
- 展示业务目标
- 展示用户角色
- 展示待确认问题

## 新增文件

| 类型 | 文件 | 位置 |
| --- | --- | --- |
| 新增 | `14_requirement_analysis_mock.md` | `prototype_factory/14_requirement_analysis_mock.md` |
| 新增 | `requirementAnalysisMock.js` | `frontend/src/data/requirementAnalysisMock.js` |

## 修改文件

| 类型 | 文件 | 位置 |
| --- | --- | --- |
| 修改 | `RequirementInputView.vue` | `frontend/src/views/RequirementInputView.vue` |
| 修改 | `App.vue` | `frontend/src/App.vue` |

## 设计说明

本节新增 `requirementAnalysisMock.js`，用于保存模拟需求拆解结果。

这样做有两个好处：

1. 页面组件只负责展示和交互，不把大段业务模拟数据硬编码在页面里。
2. 后续接入 DeepSeek/FastAPI 时，可以把模拟数据替换成接口返回数据，页面结构不用大改。

## 模拟结果结构

本节的模拟结果包含：

- `businessBackground`：业务背景
- `painPoints`：客户痛点
- `businessGoals`：业务目标
- `userRoles`：用户角色
- `questions`：待确认问题

## 当前交互规则

- 输入为空时，点击“开始分析”显示校验错误。
- 输入内容后，点击“开始分析”进入 loading。
- loading 结束后，右侧显示模拟需求拆解摘要。
- 页面下方展示结构化的模拟需求拆解结果。
- 点击“清空”会清空输入、结果状态和模拟拆解结果。

## 后续扩展方向

后续可以继续扩展：

- 将模拟需求拆解结果传给“场景识别”步骤
- 增加“复制结果”按钮
- 增加“导出 Markdown”按钮
- 接入 FastAPI 接口
- 接入 DeepSeek 生成真实需求拆解结果

## 验收方式

启动前端后检查：

```bash
cd frontend
npm run dev
```

浏览器打开 Vite 地址，确认：

- 页面仍然出现“需求输入工作台”
- 点击“填入示例需求”后可以填充示例内容
- 点击“开始分析”后，右侧显示模拟成功结果
- 页面下方出现“模拟需求拆解结果”
- 可以看到业务背景、客户痛点、业务目标、用户角色、待确认问题
- 点击“清空”后，模拟结果消失
