# 2-43 页面设计步骤大模型修订工作台

## 目标

把 `04 页面设计` 从单一页面清单展示，升级为面向实战项目的页面方案工作台：先总览全部业务场景，再按场景查看页面清单、导航结构、文件结构建议，并支持针对当前页面方案调用大模型修改。

## 本节改动

- 重构 `PageDesignView.vue`：
  - `上一步结果` 区域改为全部业务场景列表。
  - 选中业务场景后展示该场景下的页面清单、导航结构和文件结构建议。
  - 选中页面清单中的页面后，在右侧查看并编辑当前页面详情。
- 增加大模型修改入口：
  - 复用 `LlmStepRevisionPanel.vue`。
  - 当前步骤输出包含 `scenario`、`featureModules` 和 `pageDesign`。
  - 大模型返回后可应用到当前场景页面方案。
- 增强本地保存：
  - 新增 `page-design-draft-update` 事件。
  - 保存草稿会写入 `projectContext.stepResults.page`。
  - 确认后会写入 `selectedPageDesign`、`allPageDesigns` 和 `pageDesignResult`，供下一步交互设计导入。
- 修正大模型修改面板默认 API 地址为 `http://127.0.0.1:8000`。
- 修正后端 `llm_config.py` 对 `python-dotenv` 的强依赖，未安装时仍允许 FastAPI 启动。

## 验证

- `npm run build` 通过。
- `PYTHONDONTWRITEBYTECODE=1 python3 -c "import src.api.main; print('backend import ok')"` 通过。
