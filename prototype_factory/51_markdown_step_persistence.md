# 2-51 方法步骤 Markdown 本地持久化

## 目标

将每一步的“保存本地版本”从仅写入前端 `projectContext/localStorage`，扩展为写入项目固定目录下的 Markdown 文件，并在进入下一步时从 Markdown 文件读取上一步结果，补齐下一步需要的输入上下文。

## 已完成

- 新增 FastAPI 路由 `method_files`。
- 固定保存目录：`prototype_factory/local_step_outputs`。
- 每个步骤保存为独立 Markdown 文件：`requirement.md`、`scenario.md`、`feature.md`、`page.md`、`interaction.md`、`api.md`、`prototype.md`。
- Markdown 同时包含人工可读摘要和机器可读 JSON 数据块。
- 前端 `writeStepResult` 统一同步保存 Markdown。
- 进入后续步骤前，如果内存上下文缺失，会读取前置步骤 Markdown 并恢复到 `projectContext`。
- 大模型修改应用后的结果也会同步保存 Markdown。

## 说明

当前仍保留 `projectContext.stepResults` 作为运行时上下文和现有页面兼容层；Markdown 文件作为跨刷新、跨步骤接续的固定本地版本来源。

## 目录预创建

- 已预创建 `prototype_factory/local_step_outputs`，避免首次保存前用户看不到固定目录。
- 目录内保留 `README.md` 说明各步骤 Markdown 文件命名和用途。
