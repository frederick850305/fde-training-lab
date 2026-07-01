# 65 Scenario Initial LLM Generation

## 目标
将第 02 步“场景识别”红框内的用户角色与业务场景初始内容，从前端 JavaScript 本地规则生成，改为进入页面时优先调用 LLM 基于第 01 步需求拆解结果生成。

## 修改内容
- `ScenarioIdentificationView.vue` 增加 `generateScenarioDraftFromRequirement()`。
- 从第 01 步传入的需求信息构造 LLM 输入，包含：客户原始需求、手工输入、附件解析文本、业务背景、痛点、目标、用户角色、待确认问题和回复。
- 页面加载或第 01 步需求拆解结果变化时，优先调用 `/llm/revise-step` 生成：
  - 用户角色 `roles`
  - 业务场景 `scenarios`
  - 每个场景的任务流程 `workflow`
  - 每个场景的页面映射 `pageMapping`
- “重新拆解”按钮复用同一个 LLM 生成入口。
- LLM 未启用、未配置或调用失败时，保留本地规则生成作为兜底，避免页面空白。
- 保存场景时记录 `generatedFromRequirementSignature`，用于判断已保存场景是否匹配当前第 01 步输入。

## 验证
- 已运行 `npm run build`，构建通过。
