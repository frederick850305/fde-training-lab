# 2-52 场景识别大模型修订与 Markdown 写回

## 目标

在 `02 场景识别` 页面加入大模型问答式修改区，用于调整当前生成的用户角色、业务场景、任务流程和页面映射；确认写入时将结果保存为本地 Markdown，并传递给下一步功能设计。

## 已完成

- 在场景详情与上下文写回区之间新增大模型修改面板。
- 大模型输入包含当前步骤完整结构化输出：
  - 用户角色
  - 全部业务场景
  - 当前选中场景
  - 任务流程
  - 页面映射
  - 第 01 步需求拆解摘要
- 应用大模型返回结果后，会回写到当前页面的可编辑角色、场景、流程和页面映射。
- 点击“写入场景并进入功能设计”继续走 `App.vue` 的统一 `writeStepResult('scenario', ...)` 链路。
- `writeStepResult` 会调用 `/method-files/scenario`，将 `scenario.md` 保存到 `prototype_factory/local_step_outputs`。
- 进入下一步时，前端会优先读取已保存 Markdown，恢复功能设计需要的输入上下文。

## 验证

- `npm run build` 通过。
- `PYTHONDONTWRITEBYTECODE=1 python3 -c "import src.api.main; print('backend import ok')"` 通过。
