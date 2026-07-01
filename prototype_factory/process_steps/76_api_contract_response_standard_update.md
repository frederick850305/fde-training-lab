# 2-76 API 契约统一响应格式优化

## 目标

优化 `06 API 契约` 页面的“统一响应格式”区域，把原先简单的 `code / message / data` 展示扩展为可复用的后端接口返回约定。

## 更新内容

- 将统一响应格式拆分为：
  - 统一返回 Envelope
  - 列表分页 Data
  - 失败与错误信息
  - 前端处理规则
- 新增兼容逻辑：历史 Markdown 中保存的旧格式仍可显示，后续重新生成会使用新的统一结构。
- 更新 LLM 生成提示：单接口契约生成时必须遵循 `code / message / data / traceId` 的统一响应结构。
- 成功响应示例加入分页字段 `records / pagination / summary`。
- 失败响应示例加入 `error.code / error.message / error.details`。

## 验证

- 已执行 `npm run build`，前端构建通过。
