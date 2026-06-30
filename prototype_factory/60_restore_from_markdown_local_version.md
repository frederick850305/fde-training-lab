# 2-60 接续本地 Markdown 版本

## 目标

点击 `接续本地版本` 时，不再只依赖浏览器 localStorage，而是从项目固定目录中的 Markdown 文件读取此前步骤结果，并恢复到 `projectContext`。

## 已完成

- 新增 `GET /method-files` 汇总接口，扫描 `prototype_factory/local_step_outputs/*.md`。
- 前端启动时优先读取 Markdown 汇总，用于判断是否存在本地版本。
- 点击 `接续本地版本` 时，按步骤顺序读取：
  - `requirement.md`
  - `scenario.md`
  - `feature.md`
  - `page.md`
  - `interaction.md`
  - `api.md`
  - `prototype.md`
- 读取到的结构化 JSON 会恢复到 `projectContext.stepResults` 和兼容字段。
- 接续后自动进入最后已保存步骤的下一步。
- 本地版本提示区文案已简化，重点突出“发现本地 Markdown 记录”和“接续”。

## 验证

- `npm run build` 通过。
- 后端 `import src.api.main` 通过。
