# 2-65 场景识别保存按钮与 LLM 自动生成任务流程/页面映射

## 本节目标

在「02 场景识别」工作台的三个关键位置增加「保存」按钮，支持将业务场景内容保存为本地 Markdown 文件，并在保存场景时自动调用大模型生成合理的任务流程和页面映射。

## 本节改动

### 1. `ScenarioIdentificationView.vue` — 业务场景卡片增加保存按钮

- 每个业务场景卡片的标题栏（优先级输入框旁）增加「保存」按钮。
- 点击保存：
  - 将当前业务场景的名称、优先级、说明、关联角色、任务流程和页面映射导出为格式化的 `.md` 文件并下载。
  - 同时将内容保存到浏览器 `localStorage`（key: `scenario_saved_items`）。
  - 卡片上显示「✓ 已保存」徽标，标记该场景已保存。
- 保存后自动调用 LLM（优先大模型/备选本地）根据业务场景生成合理的任务流程和页面映射：
  - **在线模式**（`executionMode === 'llm-ready'` 且已配置 LLM）：调用 `/llm/revise-step` 接口，传入当前场景，让大模型生成 workflow 和 pageMapping。
  - **离线模式**：根据场景名称、关联角色、领域前缀自动生成本地任务流程（5 个步骤）和页面映射（4 个模块 + Vue 文件建议）。
  - 生成结果直接回写到当前可编辑的任务流程和页面映射字段，用户可继续微调。

### 2. `ScenarioIdentificationView.vue` — 任务流程区域增加保存按钮

- 在任务流程区域的「新增步骤」按钮旁新增「保存」按钮。
- 点击保存将当前选中场景的任务流程步骤导出为格式化的 `.md` 文件。
- 保存后显示「✓ 已保存 HH:MM」时间戳徽标。

### 3. `ScenarioIdentificationView.vue` — 页面映射区域增加保存按钮

- 在页面映射区域的「新增模块」按钮旁新增「保存」按钮。
- 点击保存将当前选中场景的页面映射（建议页面 + 页面模块）导出为格式化的 `.md` 文件。
- 保存后显示「✓ 已保存 HH:MM」时间戳徽标。

### 4. 新增辅助函数

- `buildScenarioMdContent(scenario)` — 构建场景完整 Markdown 内容
- `buildWorkflowMdContent(scenario)` — 构建任务流程 Markdown 内容
- `buildPageMappingMdContent(scenario)` — 构建页面映射 Markdown 内容
- `downloadMdFile(filename, content)` — 触发浏览器下载 .md 文件
- `saveToLocalStorage(key, content)` — 将内容持久化到 localStorage
- `generateWorkflowAndMapping(scenario)` — LLM/本地生成任务流程和页面映射
- `generateLocalWorkflowAndMapping(scenario)` — 本地兜底生成逻辑
- `getDomainPrefixForScenario(scenario)` — 从场景文本识别领域前缀

## 验收方式

1. 进入第 02 步场景识别工作台。
2. 查看业务场景列表，每张场景卡片应显示「保存」按钮。
3. 点击场景卡片的「保存」按钮：
   - 浏览器自动下载格式化的 `.md` 文件。
   - 卡片上出现「✓ 已保存」徽标。
   - 下方的任务流程和页面映射区域自动更新为新生成的内容。
4. 点击任务流程区域的「保存」按钮：
   - 浏览器下载任务流程 `.md` 文件。
   - 显示「✓ 已保存 HH:MM」时间戳。
5. 点击页面映射区域的「保存」按钮：
   - 浏览器下载页面映射 `.md` 文件。
   - 显示「✓ 已保存 HH:MM」时间戳。
6. 检查浏览器 Console 无红色错误。
7. `npm run build` 构建通过。
