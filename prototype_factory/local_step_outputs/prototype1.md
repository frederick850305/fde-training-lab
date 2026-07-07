# 04 前端原型方案

- 步骤标识：`prototype`
- 保存时间：2026-07-07T00:26:09.594818+00:00
- 用途：作为下一步工作台的输入来源。

## 内容摘要

- **项目**：船舶维护 PMS
- **客户**：HG
- **摘要**：前端原型方案：38 个页面、38 个页面规格、38 个页面 API 映射。

## 原型系统生成补充约束

以下约束用于消除原 `prototype.md` 在代码生成时可能产生的歧义。本文件仍保留后续完整结构化数据，但生成 Vue 原型系统时必须优先遵守本节。

### 1. 页面生成边界

- 本文件的目标不是生成“原型说明展示页”，而是生成可交互的业务原型系统。
- 禁止将 `prototype.md` 或结构化 JSON 内容直接展示为页面主体。
- 禁止所有页面仅包裹同一个 `GenericPage`、`PrototypePage`、`PageRenderer` 或类似通用页面渲染器。
- 每个页面组件必须包含自身独立的业务主结构和页面级交互逻辑。
- 通用组件只能用于局部复用，例如状态标签、筛选栏、确认弹窗、资产树、表格、附件上传、差异对比等。
- 页面文件可以复用组合式函数、mock API、样式变量和局部组件，但不能让 38 个菜单最终呈现同一套主体布局。

### 2. 页面状态的正确理解

- `uiStates` 中的 `empty`、`loading`、`success`、`error` 是页面内部状态要求，不是业务页面上的演示按钮。
- 不允许在最终原型页面上展示“成功态 / 加载态 / 空态 / 错误态”等状态切换按钮。
- 页面加载时应先进入 `loading`，mock 数据返回后进入 `success`。
- 当筛选无结果或数据为空时进入 `empty`。
- 当 mock API 抛错或请求失败时进入 `error`。
- 状态 UI 应融入业务页面，例如骨架屏、空数据提示、错误提示和重试按钮，而不是作为说明区展示。

### 3. 独立页面与路由要求

- 必须根据 `navigationRoutes` 生成真实路由，并让左侧菜单点击后加载对应页面组件。
- 每个路由的 `component` 必须指向对应的独立 `.vue` 页面文件。
- 页面文件必须放置在 `/src/pages/` 下，并按业务模块分目录，例如 `/dispatch`、`/task`、`/collaboration`、`/admin`。
- 每个页面组件必须能通过路由独立打开，并完成本页面的核心业务流程。
- 不同菜单页面必须在视觉结构、信息组织和操作流程上有明显差异。

### 4. 不同业务页面必须具备的差异化主布局

生成页面时，应根据页面职责选择业务化布局，而不是统一使用“筛选栏 + 表格 + 详情面板”的模板。

- `MaintenancePlanWorkbench.vue`：设备资产树 + 计划状态总览 + 选中设备详情 + 维保历史 + 快速操作。
- `PlanEditor.vue`：设备选择区 + 计划参数表单 + 工单模板选择 + 冲突检测结果 + 提交审核区。
- `PlanApproval.vue`：待审申请列表 + 变更前后差异对比 + 审批意见 + 审核日志时间线。
- `VoyageHealthTrigger.vue`：待检查船舶卡片 + 自动/手动发起检查入口 + 检查任务状态。
- `VoyageHealthDashboard.vue`：健康分数/拦截状态 + 分类校验矩阵 + 不通过问题清单 + 导出操作。
- `VoyageHealthIssueDetail.vue`：问题基本信息 + 关联设备/物资/证书数据 + 紧急工单/物资调拨/豁免审批操作 + 处置进度。
- `VoyageHealthReports.vue`：历史检查记录检索 + 报告生成入口 + 下载记录 + 日志查看。
- `WorkOrderAuditList.vue`：待审核/已完成工单聚合视图 + 多维筛选 + 工单摘要卡或表格 + 快速定位。
- `WorkOrderAuditDetail.vue`：完整报工数据 + 附件/照片留痕 + 逐项核验 + 审核通过/退回 + 整改跟踪。
- `ShipMonitoringOverview.vue`：船舶地图或态势视图 + 船舶运行状态卡 + 通信连接状态 + 列表/地图切换。
- `ShipDetailBoard.vue`：单船当前航次 + 工单进度 + 航前健康结果 + 船员证书预警 + 问题处置入口。
- `DispatchCommandEditor.vue`：调度指令编辑表单 + 航前健康校验结果引用 + 下发确认 + 指令执行进度。
- `DataSyncManager.vue`：船岸同步概览 + 异常船舶定位 + 同步状态统计 + 进入明细入口。
- `SyncTaskList.vue`：同步任务列表 + 批量重试/忽略 + 冲突和失败任务快捷入口。
- `SyncTaskDetail.vue`：冲突字段差异对比 + 船端/岸端版本选择 + 逐字段合并 + 重试/忽略操作。
- `SyncReport.vue`：同步历史检索 + 健康度趋势 + 报告导出。
- `MobileWorkOrderList.vue`：移动端任务卡片列表 + 离线标识 + 本地缓存加载 + 排序筛选。
- `MobileWorkOrderDetail.vue`：移动端工单详情 + 设备信息 + 操作步骤 + 物料清单 + 安全注意事项 + 附件本地查看。
- `MobileWorkOrderExecute.vue`：移动端步骤执行流 + 实际工时/消耗物料/异常填写 + 拍照/录像留痕 + 离线暂存。
- `MobileSyncStatus.vue`：同步队列 + 冲突列表 + 手动同步 + 同步日志 + 本地缓存空间管理。
- `InventoryWorkbench.vue`：盘点任务 + 领料提示 + 退料记录 + 网络状态 + 快速入口。
- `BarcodeScanInventory.vue`：扫码识别区 + 物料信息 + 实物数量录入 + 系统库存对比 + 盘点差异生成。
- `MaterialRequisition.vue`：物料扫码/搜索 + 库存校验 + 关联工单 + 领用数量 + 待同步领料单。
- `MaterialReturn.vue`：退料扫码 + 退料原因 + 数量校验 + 本地库存更新 + 待同步退料单。
- `DataSyncDetail.vue`：移动端同步队列详情 + 失败重试 + 冲突处理 + 同步进度。
- `UserManager.vue`：用户列表 + 用户表单 + 角色分配 + 启用/禁用 + 批量导入导出。
- `RolePermissionManager.vue`：角色列表 + 菜单/操作权限矩阵 + 复制角色 + 权限保存。
- `WorkflowDesigner.vue`：流程画布 + 节点配置 + 条件分支 + 审批人/超时/转交策略。
- `ConfigSimulation.vue`：模拟用户视角 + 权限验证结果 + 流程试运行 + 发布确认。
- `AuditLogView.vue`：配置变更审计日志 + 检索 + 导出 + 日志详情。
- `SysMonitorDashboard.vue`：系统健康度 + 关键运行指标 + 模块状态 + 告警摘要。
- `AlertManagement.vue`：告警列表 + 分级响应 + 处置记录 + 关闭/升级操作。
- `AuditLogSearch.vue`：多维日志检索 + 操作详情 + 违规标记 + 导出。
- `ReportGenerator.vue`：报告模板选择 + 生成任务进度 + 报告下载。
- `AuditLogWorkspace.vue`：审计员一体化工作台 + 日志筛选 + 变更差异 + 合规标记 + 审计行为留痕。
- `ProcurementRequirementReview.vue`：采购需求列表 + BOM/预算校验 + 发起采购申请。
- `ProcurementOrderTracking.vue`：采购订单列表 + 到货进度 + 供应商/附件信息 + 订单状态更新。
- `GoodsReceiptAndInspection.vue`：扫码验收 + 检验结果录入 + 入库/退换货操作 + 预算核减确认。

### 5. 通用组件使用原则

- 通用组件应根据 `componentFiles` 生成并被页面局部引用。
- 通用组件不得替代页面主体业务结构。
- `AssetTree.vue` 适用于资产树区域，但不能让所有页面都变成资产树页面。
- `FilterBar.vue` 适用于列表筛选区域，但不是所有页面都必须以筛选表格为中心。
- `DiffView.vue` 应用于审批、同步冲突、审计差异等页面。
- `FileUploader.vue` 应用于移动报工、扫码盘点、验收等需要附件和拍照留痕的页面。
- `ConfirmationDialog.vue` 仅用于危险操作、提交、审批、下发、发布等二次确认。

### 6. Mock 数据与 API 要求

- 必须根据 `mockDataFiles` 生成独立 mock 数据模块，字段应符合 schema。
- API 层应根据 `pageApiMapping` 封装页面调用函数，页面不应直接硬编码所有业务数据。
- 原型阶段 API 可以返回 mock 数据并用延迟模拟请求。
- 页面交互必须通过 mock API 或封装函数改变页面状态，而不是只做静态展示。
- 移动端页面必须使用 `localStorage` 或 `IndexedDB` 模拟离线缓存、待同步队列和网络恢复后的同步。

### 7. 需要修正或忽略的原文歧义

- `generationPlan` 中出现的“入场核验、统计分析”等描述属于历史项目残留，生成船舶维护 PMS 原型时应忽略。
- step prompt 中“P0 页面清单（共 16 个）”与实际列表数量不一致，应以结构化 JSON 中每个页面的 `priority` 字段为准。
- `implementationDefaults.projectStructure` 中的 `/src/views/` 与 step prompt 中的 `/src/pages/` 不一致。本文件生成原型系统时统一采用 `/src/pages/`。
- 如果 `navigationRoutes` 与 `pages`、`viewFiles` 存在命名差异，应优先保证每个 `pages.file` 都有可访问页面，再补齐路由。

### 8. 最低验收标准

- 左侧菜单点击后，右侧必须加载对应页面组件，而不是只改变标题或数据。
- 至少每个业务模块的页面主布局应明显不同。
- 页面不得出现用于解释原型规格的说明区，除非该说明本身是业务页面内容。
- 38 个页面都应可访问、可交互、可触发 loading/empty/error/success 内部状态。
- 构建必须通过，浏览器访问路由不得出现空白页或控制台编译错误。

## 结构化数据

<!-- FDE_STEP_RESULT_JSON_START -->
```json
{
  "projectName": "船舶维护 PMS",
  "customerName": "HG",
  "summary": "前端原型方案：38 个页面、38 个页面规格、38 个页面 API 映射。",
  "sourceRefs": {
    "requirement": "prototype_factory/local_step_outputs/requirement.md",
    "scenarioPageDesign": "prototype_factory/local_step_outputs/scenariopagedesign.md",
    "interactionApi": "prototype_factory/local_step_outputs/interactionapi.md"
  },
  "sourceSummary": {
    "projectName": "船舶维护 PMS",
    "customerName": "HG",
    "businessBackground": "为响应信创国产化要求，替代现有封闭式AMOS系统，建设面向船舶运行维护的一体化管控平台，覆盖设备维保、物资备件、船员资质、证照检验、船岸协同和调度联动等核心业务。",
    "painPoints": [
      "设备维保与调度指令割裂，航前任务缺少底层校验，存在带病开航风险",
      "船端弱网/无网环境下移动作业能力不足，依赖纸质抄录和回港补录",
      "物资与设备BOM、PMS计划缺乏深度关联，难以前置发现缺件风险",
      "AMOS系统封闭，源代码不可控，国产化适配能力不足",
      "数据治理水平不足，编码标准不一致、一物多码，迁移难度高"
    ],
    "businessGoals": [
      "实现核心业务国产化替代，完成2艘试点船双轨验证和历史数据迁移",
      "支撑核心设备资产树、预防性维护计划、工单闭环、库存预警和航前健康校验",
      "支持移动端离线报工、拍照留痕、扫码盘点和船岸异步同步",
      "降低封闭软件依赖，提升维保执行率、数据准确率和物资保障前置性"
    ],
    "roles": [
      {
        "name": "岸基机务人员",
        "focus": "机务管理、设备维保监督，日常机务管理"
      },
      {
        "name": "船舶管理人员",
        "focus": "船舶运行管理，日常船舶管理"
      },
      {
        "name": "船端一线作业人员",
        "focus": "工单执行、报工、盘点，弱网/无网环境下移动作业，移动端离线报工、扫码盘点、拍照留痕，船端日常维保作业"
      },
      {
        "name": "系统管理员",
        "focus": "组织权限配置、流程配置、统一身份管理"
      },
      {
        "name": "审计员",
        "focus": "查阅关键操作日志，支撑合规审计与ISM/船级社审查"
      },
      {
        "name": "采办协同人员",
        "focus": "采购需求提报、物资验收、预算核减确认"
      }
    ],
    "scenarioCount": 11,
    "scenarios": [
      {
        "key": "sc-1",
        "name": "岸基机务人员制定与调整设备维保计划",
        "priority": "P0",
        "role": "岸基机务人员",
        "page": "MaintenancePlanManager.vue",
        "summary": "基于PMS周期/工况规则，制定预防性维护计划，调整计划周期，确保设备到期前生成工单"
      },
      {
        "key": "sc-2",
        "name": "岸基机务人员进行航前健康校验与开航拦截",
        "priority": "P0",
        "role": "岸基机务人员",
        "page": "VoyageHealthCheck.vue",
        "summary": "根据预设规则校验设备状态、物资缺件、证书资质，判定是否允许开航，对不通过项启动处置流程 (规则待确认)"
      },
      {
        "key": "sc-3",
        "name": "岸基机务人员审核与跟踪工单执行",
        "priority": "P0",
        "role": "岸基机务人员",
        "page": "WorkOrderAudit.vue",
        "summary": "查看工单完成情况、质量反馈，审核报工数据，督导异常工单整改"
      },
      {
        "key": "sc-4",
        "name": "船舶管理人员监控船舶运行状态与调度",
        "priority": "P0",
        "role": "船舶管理人员",
        "page": "ShipMonitoring.vue",
        "summary": "实时查看船舶位置、运营状态、航前准备情况，下发调度指令"
      },
      {
        "key": "sc-5",
        "name": "船舶管理人员进行船岸数据同步管理",
        "priority": "P1",
        "role": "船舶管理人员",
        "page": "DataSyncManager.vue",
        "summary": "管理船端弱网/离线数据的上传与下发，处理数据冲突和同步异常"
      },
      {
        "key": "sc-6",
        "name": "船端一线作业人员执行移动端工单与离线报工",
        "priority": "P0",
        "role": "船端一线作业人员",
        "page": "MobileWorkOrder.vue",
        "summary": "在弱网/无网环境下领取工单、填写执行数据、拍照留痕、提交报工，网络恢复后自动同步"
      },
      {
        "key": "sc-7",
        "name": "船端一线作业人员进行物资扫码盘点与领用",
        "priority": "P1",
        "role": "船端一线作业人员",
        "page": "InventoryScanning.vue",
        "summary": "使用移动端扫描物资条码完成库存盘点、领料申请、退料操作，同步库存数据"
      },
      {
        "key": "sc-8",
        "name": "系统管理员配置组织权限与流程定义",
        "priority": "P0",
        "role": "系统管理员",
        "page": "SysAdminConfig.vue",
        "summary": "管理用户、角色、权限分配，定义审批流程及工单流转节点"
      },
      {
        "key": "sc-9",
        "name": "系统管理员监控系统运行与操作审计",
        "priority": "P1",
        "role": "系统管理员",
        "page": "SysMonitorAndAudit.vue",
        "summary": "查看系统运行状态、用户操作日志，处理异常告警"
      },
      {
        "key": "sc-10",
        "name": "审计员查询操作日志支撑合规审查",
        "priority": "P0",
        "role": "审计员",
        "page": "",
        "summary": "按时间、角色、操作类型检索日志，生成审计报告以满足ISM/船级社要求"
      },
      {
        "key": "sc-11",
        "name": "采办协同人员发起采购与完成物资验收",
        "priority": "P0",
        "role": "采办协同人员",
        "page": "ProcurementAndAcceptance.vue",
        "summary": "根据库存预警或工单需求生成采购申请，到货后进行物资检验、入库并核减预算"
      }
    ],
    "apiContractCount": 38
  },
  "pages": [
    {
      "file": "MaintenancePlanWorkbench.vue",
      "responsibility": "为岸基机务人员提供设备资产树与计划状态总览，快速定位需处理的设备并导航至计划制定或详情",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "PlanEditor.vue",
      "responsibility": "支持岸基机务人员基于设备资产树和PMS规则新建或编辑预防性维护计划，校验冲突并提交审核",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "PlanApproval.vue",
      "responsibility": "管理计划变更申请的审核流程，支持查看差异、审批意见填写、通过/驳回操作，并记录日志",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "VoyageHealthTrigger.vue",
      "responsibility": "岸基机务人员查看待检查船舶列表，手动或自动发起航前健康检查任务",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "VoyageHealthDashboard.vue",
      "responsibility": "集中展示当前船舶健康校验结果，显示通过/不通过项及拦截告警，提供问题清单导出",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "VoyageHealthIssueDetail.vue",
      "responsibility": "展示单个不通过项的详细信息和关联数据，支持启动紧急工单、物资调拨、豁免审批等处置流程",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "VoyageHealthReports.vue",
      "responsibility": "查看历次航前健康检查记录，生成和下载健康报告，监控开航状态同步结果",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "WorkOrderAuditList.vue",
      "responsibility": "为岸基机务人员提供待审核/已完成工单的聚合视图，支持多维筛选和快速定位",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "WorkOrderAuditDetail.vue",
      "responsibility": "展示单个工单的完整报工数据，支持机务人员逐项核验并执行审核通过或退回操作，提供整改跟踪与审计日志查阅",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "ShipMonitoringOverview.vue",
      "responsibility": "提供所有在管船舶的实时位置、航速、作业状态和通信连接状态的整体视图，支持列表和地图两种展示方式，便于船舶管理人员快速掌握全局态势。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "ShipDetailBoard.vue",
      "responsibility": "展示选定船舶的详细运行信息，包括当前航次、工单执行进度、航前健康校验结果以及船员证书有效期预警，并提供健康校验问题处置功能。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "DispatchCommandEditor.vue",
      "responsibility": "船舶管理人员在确认船舶健康校验通过（或豁免后）后，编辑调度指令并下发至船端，跟踪指令执行进度直至闭环。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "DataSyncManager.vue",
      "responsibility": "提供所有已注册船舶的同步概览，快速识别异常船舶并导航至详细处理。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "SyncTaskList.vue",
      "responsibility": "展示选定船舶或全部船舶的同步任务明细，支持多条件筛选、批量操作，并提供冲突与失败任务的快捷入口。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "SyncTaskDetail.vue",
      "responsibility": "针对冲突或失败的任务，提供差异对比、逐字段合并、重试或忽略操作，并记录审计日志。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "SyncReport.vue",
      "responsibility": "检索同步历史记录，生成同步健康度报告并导出，支撑合规审计。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "MobileWorkOrderList.vue",
      "responsibility": "在弱网/无网环境下，通过本地缓存加载当前船端一线作业人员待执行的工单列表，支持筛选和排序，点击进入详情。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "MobileWorkOrderDetail.vue",
      "responsibility": "离线展示工单完整详情，包括设备信息、维保操作步骤、物料清单、安全注意事项，支持附件本地查看，引导作业人员按规程执行。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "MobileWorkOrderExecute.vue",
      "responsibility": "引导作业人员按步骤执行维保操作，填写实际工时、消耗物料、异常情况，并通过拍照/录像现场留痕，最后提交报工数据，所有数据在离线状态下暂存本地。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "MobileSyncStatus.vue",
      "responsibility": "展示同步队列状态、冲突列表，允许用户手动触发同步、查看同步日志、管理本地缓存空间。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "InventoryWorkbench.vue",
      "responsibility": "展示待处理盘点任务、领料提示、退料记录及网络状态，提供快速导航到扫描盘点、领料、退料和同步管理页面的入口，并显示同步概览。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "BarcodeScanInventory.vue",
      "responsibility": "通过摄像头扫描条码识别物料，录入实物数量并对比系统库存，支持拍照留痕，生成盘点差异记录。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "MaterialRequisition.vue",
      "responsibility": "扫描或搜索物料，校验库存，填写领用信息并关联工单，提交后扣减本地库存生成待同步领料单。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "MaterialReturn.vue",
      "responsibility": "扫描退料条码，选择退料原因并校验数量，提交后增加本地库存生成待同步退料单。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "DataSyncDetail.vue",
      "responsibility": "详细查看同步队列，管理同步进度、处理冲突和失败重试。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "UserManager.vue",
      "responsibility": "系统管理员对系统用户进行增删改查、批量导入导出、启用/禁用及角色分配操作，覆盖用户全生命周期管理。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "RolePermissionManager.vue",
      "responsibility": "系统管理员自定义角色，按模块精细配置功能菜单和操作权限，支持复制角色快速创建。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "WorkflowDesigner.vue",
      "responsibility": "系统管理员通过可视化拖拽设计器配置审批流程、工单流转节点，定义节点、审批人、条件分支、超时及转交策略。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "ConfigSimulation.vue",
      "responsibility": "支持系统管理员模拟切换视角测试权限和流程，确认无误后正式发布全局配置并记录变更。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "AuditLogView.vue",
      "responsibility": "集中展示所有用户、角色、权限、流程的变更审计日志，支持检索和导出。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "SysMonitorDashboard.vue",
      "responsibility": "集中展示系统整体健康度与关键运行指标，帮助管理员快速掌握系统运行态势",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "AlertManagement.vue",
      "responsibility": "集中管理所有系统异常告警，支持分级响应与处置流程记录",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "AuditLogSearch.vue",
      "responsibility": "支持按多维条件检索用户操作日志，辅助合规审计与违规排查",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "ReportGenerator.vue",
      "responsibility": "定期或按需生成系统运维状况报告与审计合规文档，支撑决策与审查",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "AuditLogWorkspace.vue",
      "responsibility": "审计员在一体化界面中通过多维筛选快速定位操作日志，查看完整详情与变更差异，对异常操作进行合规标记，并按需导出审计报告，所有审计行为自动留痕。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "ProcurementRequirementReview.vue",
      "responsibility": "采办协同人员审核自动生成的采购需求列表，校验预算与BOM关联后发起采购申请",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "ProcurementOrderTracking.vue",
      "responsibility": "查看采购订单列表，跟踪订单执行状态，接收和更新到货进度",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "GoodsReceiptAndInspection.vue",
      "responsibility": "对已到货的物资进行扫码验收，录入检验结果，执行入库或退换货操作",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    }
  ],
  "viewFiles": [
    {
      "file": "MaintenancePlanWorkbench.vue",
      "responsibility": "为岸基机务人员提供设备资产树与计划状态总览，快速定位需处理的设备并导航至计划制定或详情",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "PlanEditor.vue",
      "responsibility": "支持岸基机务人员基于设备资产树和PMS规则新建或编辑预防性维护计划，校验冲突并提交审核",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "PlanApproval.vue",
      "responsibility": "管理计划变更申请的审核流程，支持查看差异、审批意见填写、通过/驳回操作，并记录日志",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "VoyageHealthTrigger.vue",
      "responsibility": "岸基机务人员查看待检查船舶列表，手动或自动发起航前健康检查任务",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "VoyageHealthDashboard.vue",
      "responsibility": "集中展示当前船舶健康校验结果，显示通过/不通过项及拦截告警，提供问题清单导出",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "VoyageHealthIssueDetail.vue",
      "responsibility": "展示单个不通过项的详细信息和关联数据，支持启动紧急工单、物资调拨、豁免审批等处置流程",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "VoyageHealthReports.vue",
      "responsibility": "查看历次航前健康检查记录，生成和下载健康报告，监控开航状态同步结果",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "WorkOrderAuditList.vue",
      "responsibility": "为岸基机务人员提供待审核/已完成工单的聚合视图，支持多维筛选和快速定位",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "WorkOrderAuditDetail.vue",
      "responsibility": "展示单个工单的完整报工数据，支持机务人员逐项核验并执行审核通过或退回操作，提供整改跟踪与审计日志查阅",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "ShipMonitoringOverview.vue",
      "responsibility": "提供所有在管船舶的实时位置、航速、作业状态和通信连接状态的整体视图，支持列表和地图两种展示方式，便于船舶管理人员快速掌握全局态势。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "ShipDetailBoard.vue",
      "responsibility": "展示选定船舶的详细运行信息，包括当前航次、工单执行进度、航前健康校验结果以及船员证书有效期预警，并提供健康校验问题处置功能。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "DispatchCommandEditor.vue",
      "responsibility": "船舶管理人员在确认船舶健康校验通过（或豁免后）后，编辑调度指令并下发至船端，跟踪指令执行进度直至闭环。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "DataSyncManager.vue",
      "responsibility": "提供所有已注册船舶的同步概览，快速识别异常船舶并导航至详细处理。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "SyncTaskList.vue",
      "responsibility": "展示选定船舶或全部船舶的同步任务明细，支持多条件筛选、批量操作，并提供冲突与失败任务的快捷入口。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "SyncTaskDetail.vue",
      "responsibility": "针对冲突或失败的任务，提供差异对比、逐字段合并、重试或忽略操作，并记录审计日志。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "SyncReport.vue",
      "responsibility": "检索同步历史记录，生成同步健康度报告并导出，支撑合规审计。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "MobileWorkOrderList.vue",
      "responsibility": "在弱网/无网环境下，通过本地缓存加载当前船端一线作业人员待执行的工单列表，支持筛选和排序，点击进入详情。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "MobileWorkOrderDetail.vue",
      "responsibility": "离线展示工单完整详情，包括设备信息、维保操作步骤、物料清单、安全注意事项，支持附件本地查看，引导作业人员按规程执行。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "MobileWorkOrderExecute.vue",
      "responsibility": "引导作业人员按步骤执行维保操作，填写实际工时、消耗物料、异常情况，并通过拍照/录像现场留痕，最后提交报工数据，所有数据在离线状态下暂存本地。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "MobileSyncStatus.vue",
      "responsibility": "展示同步队列状态、冲突列表，允许用户手动触发同步、查看同步日志、管理本地缓存空间。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "InventoryWorkbench.vue",
      "responsibility": "展示待处理盘点任务、领料提示、退料记录及网络状态，提供快速导航到扫描盘点、领料、退料和同步管理页面的入口，并显示同步概览。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "BarcodeScanInventory.vue",
      "responsibility": "通过摄像头扫描条码识别物料，录入实物数量并对比系统库存，支持拍照留痕，生成盘点差异记录。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "MaterialRequisition.vue",
      "responsibility": "扫描或搜索物料，校验库存，填写领用信息并关联工单，提交后扣减本地库存生成待同步领料单。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "MaterialReturn.vue",
      "responsibility": "扫描退料条码，选择退料原因并校验数量，提交后增加本地库存生成待同步退料单。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "DataSyncDetail.vue",
      "responsibility": "详细查看同步队列，管理同步进度、处理冲突和失败重试。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "UserManager.vue",
      "responsibility": "系统管理员对系统用户进行增删改查、批量导入导出、启用/禁用及角色分配操作，覆盖用户全生命周期管理。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "RolePermissionManager.vue",
      "responsibility": "系统管理员自定义角色，按模块精细配置功能菜单和操作权限，支持复制角色快速创建。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "WorkflowDesigner.vue",
      "responsibility": "系统管理员通过可视化拖拽设计器配置审批流程、工单流转节点，定义节点、审批人、条件分支、超时及转交策略。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "ConfigSimulation.vue",
      "responsibility": "支持系统管理员模拟切换视角测试权限和流程，确认无误后正式发布全局配置并记录变更。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "AuditLogView.vue",
      "responsibility": "集中展示所有用户、角色、权限、流程的变更审计日志，支持检索和导出。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "SysMonitorDashboard.vue",
      "responsibility": "集中展示系统整体健康度与关键运行指标，帮助管理员快速掌握系统运行态势",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "AlertManagement.vue",
      "responsibility": "集中管理所有系统异常告警，支持分级响应与处置流程记录",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "AuditLogSearch.vue",
      "responsibility": "支持按多维条件检索用户操作日志，辅助合规审计与违规排查",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "ReportGenerator.vue",
      "responsibility": "定期或按需生成系统运维状况报告与审计合规文档，支撑决策与审查",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "AuditLogWorkspace.vue",
      "responsibility": "审计员在一体化界面中通过多维筛选快速定位操作日志，查看完整详情与变更差异，对异常操作进行合规标记，并按需导出审计报告，所有审计行为自动留痕。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "ProcurementRequirementReview.vue",
      "responsibility": "采办协同人员审核自动生成的采购需求列表，校验预算与BOM关联后发起采购申请",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "ProcurementOrderTracking.vue",
      "responsibility": "查看采购订单列表，跟踪订单执行状态，接收和更新到货进度",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "GoodsReceiptAndInspection.vue",
      "responsibility": "对已到货的物资进行扫码验收，录入检验结果，执行入库或退换货操作",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    }
  ],
  "pageDetailSpecs": [
    {
      "file": "MaintenancePlanWorkbench.vue",
      "layoutZones": [
        {
          "zone": "顶部区域",
          "content": "全局搜索与状态统计卡片（计划总数、即将到期数、缺失数）"
        },
        {
          "zone": "左侧区域",
          "content": "设备资产树（按系统/区域/设备层级展开，节点旁显示计划状态图标及标签）"
        },
        {
          "zone": "右侧详情面板",
          "content": "选中设备后展示该设备的计划摘要（当前计划状态、周期、上次执行日期、下次到期日）、维保历史记录、快速操作按钮（新增计划、编辑、查看详情）"
        },
        {
          "zone": "底部状态筛选栏",
          "content": "通过状态标签（未制定、审核中、已生效、即将到期、已过期）过滤资产树显示"
        },
        {
          "zone": "导出按钮区域",
          "content": "导出当前筛选后的设备维保计划总览报表"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "资产树列表为空，中央区域显示空状态插画及文字'暂无设备数据，请确认EAM同步是否完成'，并提供'刷新'按钮"
        },
        {
          "state": "loading",
          "content": "资产树区域显示骨架屏，顶部统计卡片显示占位符，右侧面板隐藏或显示加载中"
        },
        {
          "state": "success",
          "content": "正常显示资产树、统计卡片、右侧面板内容，可正常交互"
        },
        {
          "state": "error",
          "content": "API请求失败时，资产树区域显示错误提示'数据加载失败，请检查网络后重试'，并提供重试按钮；若存在上次缓存数据则显示缓存数据并附带提示'当前显示缓存数据'"
        }
      ],
      "keyInteractions": [
        "点击树节点前的展开图标：展开或收起子节点，并缓存展开状态",
        "点击设备树节点：高亮该节点，右侧详情面板加载并显示该设备计划摘要、维保历史及操作按钮",
        "点击右侧面板-快速操作按钮'新增计划'：跳转至计划编辑页面，携带选中设备的ID",
        "点击右侧面板-快速操作按钮'编辑计划'：跳转至计划编辑页面，携带选中设备ID及已有计划数据（若有）",
        "点击右侧面板-快速操作按钮'查看详情'：跳转至设备维保计划详情页面",
        "点击底部状态标签（多选）：资产树即时过滤，只显示符合所选状态的设备节点，并高亮；统计卡片数据同步更新",
        "点击导出报表按钮：下载CSV/Excel文件，包含当前筛选后的设备维保计划总览（设备名称、计划状态、周期、下次执行日期）"
      ]
    },
    {
      "file": "PlanEditor.vue",
      "layoutZones": [
        {
          "zone": "顶部导航与操作栏",
          "content": "返回工作台、保存草稿、提交审核按钮"
        },
        {
          "zone": "设备选择区",
          "content": "支持单选或批量选择设备（从设备树弹窗选择或输入设备编码），已选设备列表显示编码、名称、当前计划状态"
        },
        {
          "zone": "计划参数设定区",
          "content": "计划类型单选项（日历周期/运行小时/工况触发），周期数值与单位输入，起始日期选择器，前置预警天数输入框，优先级下拉选择"
        },
        {
          "zone": "工单模板关联区",
          "content": "下拉搜索并选择关联的工单模板，显示模板摘要（步骤数、所需备件数）"
        },
        {
          "zone": "冲突检测提示区",
          "content": "提交前自动检测所选设备在设定时段内是否存在已有生效计划，以列表形式展示冲突详情并允许用户调整"
        },
        {
          "zone": "底部提交区",
          "content": "保存草稿（本地存储）或提交审核（触发工作流）"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "表单初始状态，所有字段为空，设备选择区提示'请选择设备'，工单模板区提示'建议关联工单模板'"
        },
        {
          "state": "loading",
          "content": "提交审核或检测冲突时显示加载遮罩，调取工单模板列表时下拉显示加载中"
        },
        {
          "state": "success",
          "content": "提交成功，跳转至工作台或审核列表，并显示成功消息"
        },
        {
          "state": "error",
          "content": "冲突检测失败或提交超时，显示错误提示并保留用户已填数据；字段校验失败时高亮错误字段并显示提示"
        }
      ],
      "keyInteractions": [
        "点击设备选择按钮：打开设备树弹窗，多选后回填至设备选择区",
        "点击检测冲突按钮：调用POST /api/maintenance-plans/validate-conflicts，结果以列表展示在下方冲突检测提示区",
        "点击保存草稿按钮：将当前表单数据保存至本地存储或后台草稿接口，并显示保存成功提示",
        "点击提交审核按钮：触发前端校验，通过后调用POST/PUT计划接口，成功后跳转至工作台或审核列表；失败显示错误信息"
      ]
    },
    {
      "file": "PlanApproval.vue",
      "layoutZones": [
        {
          "zone": "顶部筛选栏",
          "content": "按状态（待审核、已通过、已驳回）、申请时间范围、发起人筛选待审列表"
        },
        {
          "zone": "待审列表区",
          "content": "表格展示申请编号、设备名称、变更类型（新建/修改/废止）、发起人、提交时间、当前处理人、状态标签，支持排序"
        },
        {
          "zone": "变更详情面板",
          "content": "选中一条申请后，以对比视图展示变更前后差异（计划参数、工单模板）"
        },
        {
          "zone": "审批操作区",
          "content": "审批意见文本框，通过/驳回按钮，附带提交确认弹窗"
        },
        {
          "zone": "审核日志区",
          "content": "以时间线形式展示该申请的所有审核记录（操作人、时间、意见、结果）"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "待审列表无数据时，显示“当前无待审批的变更申请”及历史记录入口"
        },
        {
          "state": "loading",
          "content": "列表初始加载显示骨架屏；提交审批操作时按钮显示加载状态"
        },
        {
          "state": "success",
          "content": "审批操作成功后显示成功提示，并刷新列表"
        },
        {
          "state": "error",
          "content": "审批操作失败时显示错误提示，保留当前输入的意见"
        }
      ],
      "keyInteractions": [
        "用户点击筛选按钮或更改筛选条件后自动触发：重新加载待审列表，更新表格数据，筛选条件保留在控件中",
        "用户点击列表行或行内查看按钮：展开或侧滑展示变更详情面板，以对比视图展示变更前后差异",
        "用户点击通过按钮：弹出确认弹窗，用户确认后提交审批操作，按钮显示加载状态；成功后关闭面板、刷新列表并显示成功提示；失败时显示错误提示并保留输入",
        "用户点击驳回按钮：弹出确认弹窗，用户确认后提交驳回操作，按钮显示加载状态；成功后关闭面板、刷新列表并显示驳回成功提示；失败时显示错误提示并保留输入",
        "用户点击审核日志区域标题或展开按钮：切换时间线详情的展开/收起状态"
      ]
    },
    {
      "file": "VoyageHealthTrigger.vue",
      "layoutZones": [
        {
          "zone": "顶部通知栏",
          "content": "推送的开航前校验通知"
        },
        {
          "zone": "船舶列表区",
          "content": "显示待检查、执行中、已完成的船舶"
        },
        {
          "zone": "手动发起检查入口",
          "content": "搜索/选择船舶并触发"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "无待检查船舶或历史记录，显示空态提示：'暂无待检查船舶'，并提供'手动发起检查'引导"
        },
        {
          "state": "loading",
          "content": "列表数据加载中，显示骨架屏或loading指示器"
        },
        {
          "state": "success",
          "content": "列表数据加载成功，正常显示船舶列表及通知栏"
        },
        {
          "state": "error",
          "content": "网络错误或接口失败，显示错误提示和重试按钮"
        }
      ],
      "keyInteractions": [
        "查看船舶看板：点击船舶卡片，跳转至该船舶的航前健康检查看板页面",
        "发起检查：点击'发起检查'按钮，打开船舶选择对话框，选择后调用POST /api/voyage-health/check-tasks创建任务，成功后跳转至看板页，失败显示错误提示"
      ]
    },
    {
      "file": "VoyageHealthDashboard.vue",
      "layoutZones": [
        {
          "zone": "头部概览区",
          "content": "整体健康分数、开航拦截状态"
        },
        {
          "zone": "分类结果区",
          "content": "设备维保/物资库存/证书资质三栏，每栏显示通过/不通过数量"
        },
        {
          "zone": "问题清单表格区",
          "content": "显示所有不通过项，含类型、描述、严重等级"
        },
        {
          "zone": "操作栏",
          "content": "导出PDF/Excel按钮"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "校验任务刚创建，尚未完成，无任何校验结果展示，显示空状态提示如'暂无校验结果'"
        },
        {
          "state": "loading",
          "content": "获取校验结果中，显示加载骨架屏或旋转器"
        },
        {
          "state": "success",
          "content": "成功获取校验结果，正常显示看板内容，通过项绿色图标，不通过项红色图标并附带告警标识"
        },
        {
          "state": "error",
          "content": "校验规则执行失败或网络异常，显示错误提示和重新加载按钮"
        }
      ],
      "keyInteractions": [
        "查看问题详情：点击问题行，跳转至对应问题详情页",
        "导出问题清单：点击导出按钮（PDF/Excel），生成并下载文件"
      ]
    },
    {
      "file": "VoyageHealthIssueDetail.vue",
      "layoutZones": [
        {
          "zone": "问题标题与基本信息区",
          "content": "类型、关联对象、过期/逾期时间、严重等级"
        },
        {
          "zone": "详情数据区",
          "content": "逾期工单清单/缺件物料表格/过期证书列表"
        },
        {
          "zone": "处置操作区",
          "content": "创建紧急工单按钮、发起调拨申请按钮、提交豁免审批按钮"
        },
        {
          "zone": "处置进度区",
          "content": "已发起的处置单状态跟踪"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "页面没有不通过项数据，显示空提示或已解决信息"
        },
        {
          "state": "loading",
          "content": "获取不通过项详情中，显示加载骨架屏"
        },
        {
          "state": "success",
          "content": "正常显示详情和操作区"
        },
        {
          "state": "error",
          "content": "数据获取失败或权限不足，显示错误信息和重试按钮"
        }
      ],
      "keyInteractions": [
        "创建紧急工单：点击按钮弹出表单，填写后提交，成功后刷新处置进度区",
        "发起调拨申请：点击按钮弹出表单，填写后提交，成功后刷新处置进度区",
        "提交豁免审批：点击按钮弹出表单，填写后提交，成功后刷新处置进度区",
        "表单提交：用户点击表单中的确认按钮，调用对应API，成功关闭弹窗并更新处置进度区，失败显示错误提示"
      ]
    },
    {
      "file": "VoyageHealthReports.vue",
      "layoutZones": [
        {
          "zone": "搜索筛选区",
          "content": "按船舶、日期范围、状态过滤"
        },
        {
          "zone": "记录列表区",
          "content": "展示检查任务、生成报告状态、开航状态"
        },
        {
          "zone": "报告生成入口",
          "content": "针对已完成任务生成报告"
        },
        {
          "zone": "日志查看弹窗",
          "content": "点击日志按钮展开操作时间线"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "列表无记录时展示空态提示，包含引导文字‘暂无历史校验记录’"
        },
        {
          "state": "loading",
          "content": "列表数据加载中显示骨架屏或加载图标"
        },
        {
          "state": "success",
          "content": "列表正常展示，记录可点击操作，报告状态和开航状态实时更新"
        },
        {
          "state": "error",
          "content": "查询失败时显示错误提示，提供重试按钮"
        }
      ],
      "keyInteractions": [
        "点击搜索按钮：发起GET请求，加载记录列表，显示加载态，刷新列表",
        "点击生成报告按钮：发起POST请求，生成中的报告状态变为‘生成中’，异步刷新后更新为‘已生成’",
        "点击下载报告按钮：获取下载链接，触发PDF下载",
        "点击开航状态标签：弹出详情弹窗，显示拦截原因或允许开航时间",
        "点击日志按钮：弹出日志查看弹窗，展示操作时间线，请求日志API"
      ]
    },
    {
      "file": "WorkOrderAuditList.vue",
      "layoutZones": [
        {
          "zone": "顶部导航和用户信息",
          "content": "展示用户登录信息及系统导航"
        },
        {
          "zone": "筛选条件栏",
          "content": "包含船舶名称下拉、设备资产树选择器、工单类型多选、工单状态多选、时间范围日期选择器、搜索按钮"
        },
        {
          "zone": "工单摘要列表",
          "content": "表头（工单号、关联设备、优先级、报工时间、当前状态、操作），每行含状态标签，支持排序（优先级、报工时间）和分页"
        },
        {
          "zone": "列表空态提示",
          "content": "无符合条件的工单时显示空状态插图及引导文字"
        },
        {
          "zone": "加载状态骨架屏",
          "content": "列表数据加载时显示骨架屏或进度条"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "无符合条件的工单时显示空状态插图及引导文字，无数据提示（如‘暂无工单’）"
        },
        {
          "state": "loading",
          "content": "列表数据加载中显示骨架屏或进度条，禁用交互"
        },
        {
          "state": "success",
          "content": "正常展示工单列表，包含分页、排序等交互"
        },
        {
          "state": "error",
          "content": "网络错误或接口异常时显示错误提示及重试按钮，点击重试重新加载"
        }
      ],
      "keyInteractions": [
        "点击搜索按钮：根据当前筛选条件重新加载工单列表，显示加载态，请求 GET /api/workOrders",
        "点击列表行：跳转至工单详情核验页面 WorkOrderAuditDetail.vue，携带工单ID",
        "切换分页页码或每页条数：重新请求对应页码数据，列表更新",
        "点击列表表头的优先级或报工时间排序图标：切换排序方向，重新加载列表数据",
        "点击列表行中的状态标签（如‘待审核’）：自动将该状态添加到工单状态筛选项，并触发搜索",
        "选择船舶名称下拉值：设备资产树选择器更新为仅显示该船舶下的设备节点"
      ]
    },
    {
      "file": "WorkOrderAuditDetail.vue",
      "layoutZones": [
        {
          "zone": "页面顶部信息区",
          "content": "工单编号、关联设备、当前状态、优先级标签，以及返回列表按钮"
        },
        {
          "zone": "工单基本信息分区",
          "content": "设备名称、报工人员、报工时间、工单类型、维保标准说明（只读）"
        },
        {
          "zone": "执行明细分区",
          "content": "实际执行人员、开始/结束时间、总实际工时、执行步骤列表（勾选状态、完成说明、附件链接）"
        },
        {
          "zone": "物料消耗分区",
          "content": "物料名称、编码、计划用量、实际用量、批次号，超量物料高亮标示，支持查看物料附件"
        },
        {
          "zone": "多媒体附件分区",
          "content": "照片/视频缩略图网格，点击弹出预览，显示拍摄时间戳"
        },
        {
          "zone": "异常记录分区",
          "content": "异常类型、描述、现场照片，展示处理状态（待处理/已处理）"
        },
        {
          "zone": "审核操作区",
          "content": "审核通过按钮（绿色）、退回整改按钮（红色），退回时弹出模态框填写审核意见（必填）、选择整改要求、支持上传附件"
        },
        {
          "zone": "审核历史分区",
          "content": "Tab切换，默认显示‘审核日志’，展示历次审核记录（操作人、时间、结论、意见、附件），支持版本对比"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "整改任务列表为空时显示‘暂无整改任务’"
        },
        {
          "state": "loading",
          "content": "详情数据加载中显示骨架屏或全页加载指示"
        },
        {
          "state": "success",
          "content": "操作成功提示（审核通过/退回），工单状态实时更新"
        },
        {
          "state": "error",
          "content": "工单ID无效或接口失败，显示错误提示和返回按钮"
        }
      ],
      "keyInteractions": [
        "点击绿色‘审核通过’按钮：弹出二次确认对话框，确认后调用 POST /api/workOrders/{workOrderId}/approve，成功提示，工单状态更新为‘已闭环’，审核按钮置灰，记录审核人及时间",
        "点击红色‘退回整改’按钮：弹出模态框，填写审核意见（必填）、选择整改要求（至少一项）、可上传附件，提交后调用 POST /api/workOrders/{workOrderId}/reject，成功提示，工单状态更新为‘需整改’，刷新整改跟踪Tab，生成整改任务通知",
        "点击附件缩略图：弹出全屏预览（图片/视频），支持左右滑动",
        "点击审核历史Tab中的‘对比’按钮：弹出差异视图，并列显示两版审核意见和附件",
        "点击整改任务项中的‘查看整改后报工’：跳转至工单详情（新版本），进入重新审核流程",
        "点击页面顶部‘返回列表’按钮：返回工单审核列表页"
      ]
    },
    {
      "file": "ShipMonitoringOverview.vue",
      "layoutZones": [
        {
          "zone": "地图视图区",
          "content": "显示所有船舶的实时位置标记，支持点击查看船舶信息浮窗"
        },
        {
          "zone": "列表视图区",
          "content": "以表格形式显示船舶列表，包含名称、位置、航速、状态等信息"
        },
        {
          "zone": "状态筛选栏",
          "content": "提供筛选条件（如作业状态、通信状态），输入后自动筛选"
        },
        {
          "zone": "船舶状态统计卡片",
          "content": "展示在管船舶总数、运行中、停泊中、异常等统计数据"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "无船舶数据时显示空态提示：'暂无船舶数据，请检查网络或联系管理员'"
        },
        {
          "state": "loading",
          "content": "显示加载中动画或骨架屏，地图底图先行加载"
        },
        {
          "state": "success",
          "content": "正常显示船舶列表和地图标记，状态统计卡片展示各项数据"
        },
        {
          "state": "error",
          "content": "API请求失败时显示错误提示，并提供'重试'按钮；WebSocket断线时提示并尝试重连"
        }
      ],
      "keyInteractions": [
        "切换视图（地图/列表）",
        "查看船舶信息（点击地图标记弹出浮窗）",
        "跳转至船舶详情（点击浮窗中链接）",
        "查看船舶详情（点击列表行）",
        "筛选船舶（输入条件自动触发）",
        "自动数据刷新（每10秒轮询或WebSocket）"
      ]
    },
    {
      "file": "ShipDetailBoard.vue",
      "layoutZones": [
        {
          "zone": "航次信息区域",
          "content": "显示当前航次号、出发港、目的港、计划时间等"
        },
        {
          "zone": "工单执行进度区域",
          "content": "统计卡片展示工单总数、完成数、进行中数，下方附带工单列表"
        },
        {
          "zone": "航前健康校验结果区域",
          "content": "逐项展示校验结果（通过/不通过），不通过项可展开查看详情"
        },
        {
          "zone": "船员证书有效期预警区域",
          "content": "列出过期或即将到期的证书，含持有人和到期日期"
        },
        {
          "zone": "问题处置面板",
          "content": "点击“转处置”或“申请豁免”时弹出的对话框或侧面板"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "船舶无当前航次或工单数据，页面展示空状态插图及信息提示"
        },
        {
          "state": "loading",
          "content": "页面初始化或刷新时，显示骨架屏或加载指示器"
        },
        {
          "state": "success",
          "content": "数据正常加载，根据实际数据展示航次信息、工单进度、健康校验结果及证书预警；包含正常态和部分不通过态"
        },
        {
          "state": "error",
          "content": "API请求失败，显示错误消息和“重新加载”按钮，并保留已缓存数据（如有）"
        }
      ],
      "keyInteractions": [
        "展开不通过项详情（点击不通过行）",
        "转处置（点击按钮弹出对话框选择责任角色）",
        "确认转处置（提交后更新状态并通知）",
        "申请豁免（填写理由和有效期后提交）",
        "提交豁免申请（更新状态为待审批）",
        "查看证书详情（点击证书名称弹出提示）",
        "返回总览（点击顶部按钮）",
        "下发调度指令（跳转至指令编辑页）",
        "查看工单详情（点击工单行跳转）"
      ]
    },
    {
      "file": "DispatchCommandEditor.vue",
      "layoutZones": [
        {
          "zone": "指令编辑表单区域",
          "content": "包含航次任务、出发/预计到达时间、航线选择、任务要求等输入项"
        },
        {
          "zone": "指令状态跟踪区域",
          "content": "以时间线形式展示指令当前状态（已下发→已接收→执行中→已完成→已闭环）"
        },
        {
          "zone": "历史指令列表区域",
          "content": "列出最近下发的指令，方便查阅和再次使用"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "无历史指令或当前指令时显示空态提示"
        },
        {
          "state": "loading",
          "content": "加载数据或处理请求时显示加载中指示器"
        },
        {
          "state": "success",
          "content": "操作成功（下发、刷新或闭环成功）时显示成功提示"
        },
        {
          "state": "error",
          "content": "操作失败（网络异常、API错误）时显示错误提示"
        }
      ],
      "keyInteractions": [
        "下发调度指令（点击后确认并调用API创建）",
        "刷新（点击获取最新状态）",
        "确认闭环（启用后填写结果并提交闭环）"
      ]
    },
    {
      "file": "DataSyncManager.vue",
      "layoutZones": [
        {
          "zone": "顶部筛选栏",
          "content": "按同步状态（正常/异常/未同步）快捷筛选，支持高亮异常船舶优先排序"
        },
        {
          "zone": "船舶概览卡片区",
          "content": "每艘船一张卡片，展示船名、通信状态、最近同步时间、待同步数据包数量、冲突数、失败数"
        },
        {
          "zone": "全局操作栏",
          "content": "手动触发全量船舶同步状态刷新按钮，刷新拉取各船最新同步心跳"
        },
        {
          "zone": "快速跳转入口",
          "content": "点击船舶卡片可一键跳转至该船舶的同步任务详细列表页（SyncTaskList.vue）"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "暂未注册船舶，请先注册船舶"
        },
        {
          "state": "loading",
          "content": "正在加载船舶同步状态...，骨架屏展示"
        },
        {
          "state": "success",
          "content": "船舶同步状态卡片正常展示，异常船舶高亮"
        },
        {
          "state": "error",
          "content": "获取同步状态失败，请重试"
        }
      ],
      "keyInteractions": [
        "点击船舶卡片：跳转至SyncTaskList.vue，携带船舶ID参数",
        "点击刷新按钮：调用GET /api/v1/sync/shipments/summary获取全量概览，并逐个调用GET /api/v1/sync/shipments/{shipId}/heartbeat更新每船心跳状态，刷新卡片展示",
        "筛选下拉切换：根据选中状态重新请求或本地过滤，更新船舶卡片列表，异常船舶优先展示"
      ]
    },
    {
      "file": "SyncTaskList.vue",
      "layoutZones": [
        {
          "zone": "顶部筛选区",
          "content": "按船舶下拉选择（含全部）、数据类型（工单报工/盘点结果/附件图片）、状态（待上传/上传中/已同步/冲突/失败）、时间范围选择器"
        },
        {
          "zone": "快捷标签页",
          "content": "“全部任务”、“冲突任务”、“失败任务”三个标签，一键切换聚焦待处理条目"
        },
        {
          "zone": "任务列表主体",
          "content": "表格或列表形式，每行展示数据类型、创建时间、来源终端、船端版本号、数据包大小、当前状态，支持多选"
        },
        {
          "zone": "批量操作栏",
          "content": "勾选后出现“重新同步”、“标记忽略”、“查看详情”等按钮（冲突/失败任务不可批量忽略）"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "无同步任务时展示“暂无同步任务”及业务建议（如建议检查网络连接或手动触发同步）"
        },
        {
          "state": "loading",
          "content": "初始加载或筛选切换时显示加载动画（骨架屏或旋转图标）"
        },
        {
          "state": "success",
          "content": "数据加载成功，正常展示任务列表及筛选区"
        },
        {
          "state": "error",
          "content": "接口请求失败时显示错误提示（如“数据加载失败，请重试”）并提供重试按钮"
        }
      ],
      "keyInteractions": [
        "切换标签页：点击“全部任务”、“冲突任务”或“失败任务”标签，自动刷新列表数据，重置除船舶外的筛选条件，聚焦对应状态的任务",
        "筛选查询：选择或更改任意筛选条件（时间范围支持防抖），自动发起GET /api/v1/sync/tasks请求，更新列表数据",
        "批量重试：勾选任务后点击“重新同步”按钮（仅对失败或冲突任务可用），调用POST /api/v1/sync/tasks/batch-retry，成功后刷新列表并提示重试结果；失败则显示错误原因",
        "批量忽略：勾选任务后点击“标记忽略”按钮（冲突和失败任务不可用），调用POST /api/v1/sync/tasks/batch-ignore，成功后刷新列表并提示忽略结果；失败则显示错误原因",
        "查看详情：点击单条任务行或“查看详情”按钮，跳转至SyncTaskDetail.vue页面或打开详情弹窗，展示任务完整信息",
        "分页切换：点击分页控件（页码、上一页/下一页），加载对应页数据，保持当前筛选条件不变"
      ]
    },
    {
      "file": "SyncTaskDetail.vue",
      "layoutZones": [
        {
          "zone": "任务基本信息区",
          "content": "任务ID、数据类型、来源船舶、创建时间、当前状态、错误原因（如失败）"
        },
        {
          "zone": "冲突解决面板",
          "content": "仅当状态为冲突时显示：并排对比船端版本与岸端版本，差异字段高亮，每行提供单选按钮（采用船端/采用岸端/手动编辑），以及快捷操作按钮“全部采用船端版本”或“全部采用岸端版本”，底部提交解决按钮"
        },
        {
          "zone": "失败处理面板",
          "content": "仅当状态为失败时显示：显示失败原因详情和错误码，提供“重新同步”按钮和“忽略”按钮（点击忽略弹出备注输入框，确认后提交）"
        },
        {
          "zone": "操作记录区",
          "content": "展示该任务的历史操作日志（包括自动同步、重试、冲突解决、忽略等），支持审计追溯"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "任务状态为已同步或无冲突无失败时，整个页面显示“无需处理”提示"
        },
        {
          "state": "loading",
          "content": "获取冲突差异详情或失败详情时，对应面板显示骨架屏加载状态"
        },
        {
          "state": "success",
          "content": "操作成功后显示全局通知（如“冲突解决成功”），并自动刷新任务基本信息与操作记录区"
        },
        {
          "state": "error",
          "content": "接口调用失败时显示错误提示（如“获取差异失败，请重试”），并提供重新加载按钮"
        }
      ],
      "keyInteractions": [
        "提交冲突解决：点击冲突解决面板底部的“提交解决”按钮，调用 POST /api/v1/sync/conflicts/{conflictId}/resolve 提交合并结果；成功后显示成功提示并刷新任务状态与操作记录；失败时显示错误信息并允许重试",
        "全部采用船端版本：点击冲突解决面板顶部的快捷操作按钮，将所有差异字段的 selectedVersion 自动设为 'boat'，实时更新合并结果并清除未处理高亮",
        "全部采用岸端版本：点击冲突解决面板顶部的快捷操作按钮，将所有差异字段的 selectedVersion 自动设为 'shore'，实时更新合并结果并清除未处理高亮",
        "重新同步：在失败处理面板点击“重新同步”按钮，调用 POST /api/v1/sync/tasks/{taskId}/retry；按钮进入加载状态，成功后任务状态更新为“同步中”；失败次数超过3次时按钮置灰并显示“建议联系船端排查”",
        "忽略：在失败处理面板点击“忽略”按钮，弹出备注输入框（必填），确认后调用 POST /api/v1/sync/tasks/{taskId}/ignore，成功后任务状态变为“已忽略”，操作记录更新"
      ]
    },
    {
      "file": "SyncReport.vue",
      "layoutZones": [
        {
          "zone": "筛选区",
          "content": "包含船舶下拉、日期范围、操作类型（自动同步/人工重试/冲突解决/忽略）筛选条件"
        },
        {
          "zone": "审计日志列表区",
          "content": "表格展示船舶、操作时间、操作人员、操作描述、处理结果，支持分页"
        },
        {
          "zone": "统计看板区",
          "content": "显示指定周期内的同步成功率、平均延迟、冲突率、未处理量，以卡片或图表展示"
        },
        {
          "zone": "导出操作栏",
          "content": "提供“导出PDF”和“导出CSV”按钮"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "暂无同步历史记录"
        },
        {
          "state": "loading",
          "content": "正在加载同步历史记录..."
        },
        {
          "state": "success",
          "content": "数据加载成功，列表和统计看板已更新"
        },
        {
          "state": "error",
          "content": "数据加载失败，请稍后重试"
        }
      ],
      "keyInteractions": [
        "切换筛选条件：自动重新加载审计日志列表和统计看板数据，触发加载状态",
        "导出PDF：调用导出接口（GET /api/v1/sync/report/export），校验用户权限（审计员或管理员），权限不足时显示错误提示，否则下载PDF文件",
        "导出CSV：调用导出接口（GET /api/v1/sync/report/export?format=csv），校验用户权限（审计员或管理员），权限不足时显示错误提示，否则下载CSV文件",
        "点击日志记录：展开该条日志记录的详情内容（如冲突解决的具体信息、操作前后数据对比）"
      ]
    },
    {
      "file": "MobileWorkOrderList.vue",
      "layoutZones": [
        {
          "zone": "顶部状态栏",
          "content": "网络状态图标、当前用户、未同步数量提示"
        },
        {
          "zone": "筛选区",
          "content": "设备类型下拉、状态（待执行/执行中）筛选、优先级筛选、日期排序切换"
        },
        {
          "zone": "工单列表区",
          "content": "卡片式展示工单编号、设备名称、位置、优先级、计划日期、状态标签，支持上拉加载更多"
        },
        {
          "zone": "空态提示",
          "content": "无待执行工单时显示“暂无待执行工单”和刷新按钮"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "本地缓存无数据时显示空态提示及刷新按钮"
        },
        {
          "state": "loading",
          "content": "首次打开或下拉刷新时显示加载动画"
        },
        {
          "state": "success",
          "content": "列表加载完成，展示工单卡片"
        },
        {
          "state": "error",
          "content": "网络请求失败或本地数据库读取错误时显示错误提示及重试按钮"
        }
      ],
      "keyInteractions": [
        "查看工单详情：点击工单卡片，跳转至MobileWorkOrderDetail.vue",
        "下拉刷新：若网络可用则请求服务器并更新本地缓存",
        "加载更多：滚动到底部，加载下一页数据",
        "筛选变更：选择筛选条件，实时过滤工单列表",
        "刷新：点击空态刷新按钮，尝试重新加载数据"
      ]
    },
    {
      "file": "MobileWorkOrderDetail.vue",
      "layoutZones": [
        {
          "zone": "顶部导航栏",
          "content": "返回按钮、工单编号、状态标签"
        },
        {
          "zone": "设备信息区",
          "content": "设备名称、型号、位置、维保类型、设备资产树路径"
        },
        {
          "zone": "维保步骤区",
          "content": "按顺序显示步骤列表，每步含序号、操作描述、所需工具/物料、安全提示，支持勾选已完成步骤"
        },
        {
          "zone": "物料清单区",
          "content": "备件表格（名称、型号、计划用量、实际库存位置），可标记“已领用”"
        },
        {
          "zone": "附件区",
          "content": "已下载的图纸、手册缩略图列表，点击可打开查看（支持缩放旋转）"
        },
        {
          "zone": "底部操作栏",
          "content": "“开始执行”按钮（进入执行页）、“查看安全注意事项”浮层入口"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "无工单数据场景（通常不会出现），显示空白占位提示"
        },
        {
          "state": "loading",
          "content": "首次从列表页跳转时从本地缓存读取工单数据，显示加载中动画或骨架屏"
        },
        {
          "state": "success",
          "content": "数据加载完成，正常展示工单详情、步骤、物料、附件，支持交互操作"
        },
        {
          "state": "error",
          "content": "本地缓存数据损坏或读取失败，提示用户重新进入列表页刷新获取"
        }
      ],
      "keyInteractions": [
        "步骤勾选：点击步骤勾选框，切换勾选状态，实时持久化至本地SQLite，支持断点续执",
        "开始执行：点击底部\"开始执行\"按钮，跳转至维保执行与报工录入页（MobileWorkOrderExecute.vue），携带工单ID",
        "查看附件：点击附件缩略图，本地打开文件，PDF支持分页查看，图片支持缩放旋转",
        "标记已领用：长按物料行，变更物料状态为已领用，本地持久化，UI更新标记",
        "返回：点击顶部导航栏返回按钮，返回工单列表页（携带当前工单ID以便恢复状态）",
        "查看安全注意事项：点击底部\"查看安全注意事项\"浮层入口，弹出浮层显示安全注意事项内容（可滚动）"
      ]
    },
    {
      "file": "MobileWorkOrderExecute.vue",
      "layoutZones": [
        {
          "zone": "顶部导航栏",
          "content": "返回按钮、工单编号、当前步骤进度（如3/8）"
        },
        {
          "zone": "步骤执行区",
          "content": "当前步骤卡片（显示序号、操作描述），实际开始/结束时间输入（默认当前时间，可修改），执行人选择（预设本人），异常备注文本输入"
        },
        {
          "zone": "物料消耗区",
          "content": "从物料清单中选择实际消耗的备件（含数量输入），支持追加领用（搜索新增物料）"
        },
        {
          "zone": "多媒体留痕区",
          "content": "拍照/录像按钮，已拍摄的缩略图列表，支持预览和删除，每个媒体可关联至当前步骤"
        },
        {
          "zone": "提交报工按钮",
          "content": "位于底部，点击后校验必填项（步骤完成、异常说明），通过后存储至本地SQLite并标记工单为“待同步”"
        },
        {
          "zone": "空间不足提示",
          "content": "当本地存储低于阈值时弹窗"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "首次进入，无历史数据"
        },
        {
          "state": "loading",
          "content": "正在保存报工数据到本地数据库"
        },
        {
          "state": "success",
          "content": "报工数据已保存，工单状态置为‘待同步’"
        },
        {
          "state": "error",
          "content": "校验失败或存储空间不足，请检查输入或清理历史数据"
        }
      ],
      "keyInteractions": [
        "提交报工：点击底部提交报工按钮，校验必填项（步骤完成、异常说明），通过后存储至本地SQLite并标记工单为‘待同步’，显示‘报工已保存’提示",
        "拍照/录像：点击拍照/录像按钮，调用系统相机，拍摄后文件自动添加至当前步骤的多媒体列表",
        "添加物料：点击添加物料按钮（在物料消耗区），将当前输入的物料编码和数量添加到消耗物料列表中，并清空输入",
        "删除物料：点击物料条目上的删除按钮，从消耗物料列表中移除该条目",
        "预览多媒体：点击已拍摄的缩略图，打开预览界面展示图片或视频",
        "删除多媒体：点击多媒体条目上的删除按钮，从当前步骤的多媒体列表中移除该条目"
      ]
    },
    {
      "file": "MobileSyncStatus.vue",
      "layoutZones": [
        {
          "zone": "同步概览区",
          "content": "网络状态、待同步工单数、上次同步时间、存储使用量"
        },
        {
          "zone": "同步队列区",
          "content": "表格展示每项工单的同步状态（待同步/同步中/已完成/失败）、重试次数、提交时间"
        },
        {
          "zone": "冲突列表区",
          "content": "若有冲突，展示工单ID、差异对比（岸端版本 vs 本地版本）、解决状态，提供“使用本地”、“使用岸端”、“标记待岸基处理”操作"
        },
        {
          "zone": "手动触发按钮",
          "content": "强制同步所有待同步工单"
        },
        {
          "zone": "缓存管理区",
          "content": "清理已同步数据、清理全部缓存（含附件）"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "所有工单已完成同步且无冲突，同步概览区显示“全部同步”，队列列表为空，冲突列表为空；显示绿色网络状态图标，存储使用量正常"
        },
        {
          "state": "loading",
          "content": "正在同步数据，同步概览区显示进度条或百分比，同步队列区对应工单状态为“同步中”；禁止其他同步操作（如手动同步按钮置灰），但允许查看和冲突解决"
        },
        {
          "state": "success",
          "content": "同步任务完成，无失败或冲突，同步概览区更新“上次同步时间”和“待同步工单数”为0；短暂显示成功提示（如Toast），自动清理已同步数据（根据保留策略）"
        },
        {
          "state": "error",
          "content": "同步任务失败（如网络中断、校验失败或超出重试次数），同步队列区对应工单显示“失败”并标注错误原因；失败工单显示重试按钮，冲突列表中可能出现冲突记录，提示用户手动处理"
        }
      ],
      "keyInteractions": [
        "手动同步：点击“手动同步”按钮，触发后台同步任务，同步概览区显示进度条或百分比，同步队列区更新状态标签（同步中/已完成/失败）",
        "解决冲突：点击冲突列表中的某项，展开差异对比，选择“使用本地”、“使用岸端”或“标记待岸基处理”，根据所选策略更新冲突解决状态；选择“使用本地”或“使用岸端”后自动提交并同步；选择“标记待岸基处理”则保留冲突记录由岸基人员处理",
        "清理缓存：点击“清理已同步数据”或“清理全部缓存”按钮，弹出二次确认对话框，确认后删除对应数据；清理已同步数据仅删除已同步的工单缓存（保留日志30天）；清理全部缓存删除所有本地缓存（含附件），释放存储空间",
        "自动同步：网络恢复且存在待同步工单时自动触发，后台自动启动同步任务，状态标签由“待同步”切换为“同步中”，同步完成后更新为“已完成”或“失败”；若失败则保留本地数据，并在同步队列区显示重试次数和错误原因"
      ]
    },
    {
      "file": "InventoryWorkbench.vue",
      "layoutZones": [
        {
          "zone": "网络状态指示区",
          "content": "显示在线/弱网/离线状态图标及本地数据版本"
        },
        {
          "zone": "待办任务卡片区",
          "content": "按任务类型（盘点/领料/退料）分组展示待处理条目，含数量标识"
        },
        {
          "zone": "快捷操作栏",
          "content": "三个按钮（扫描盘点、领料、退料）跳转至对应页面"
        },
        {
          "zone": "同步进度概览区",
          "content": "显示待同步条数、上次同步时间、手动同步按钮"
        },
        {
          "zone": "最近操作记录区",
          "content": "最近5条本地操作摘要（类型、物料、时间、状态）"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "无待办任务时显示鼓励提示：“暂无待办任务，您可以手动盘点或领料”"
        },
        {
          "state": "loading",
          "content": "首次加载本地缓存时显示加载骨架屏"
        },
        {
          "state": "success",
          "content": "正常显示数据：网络状态、待办任务卡片、快捷操作栏、同步概览、操作记录"
        },
        {
          "state": "error",
          "content": "本地缓存加载失败时显示错误提示并提供重试按钮"
        }
      ],
      "keyInteractions": [
        "点击待办任务卡片：tap，跳转到对应操作页并预填任务ID",
        "点击同步按钮：tap，触发全局同步（在线时）；离线时提示无法同步",
        "下拉刷新：pullToRefresh，重新加载本地缓存，检测版本差异，若版本不一致则提示在线同步",
        "点击扫描盘点按钮：tap，跳转至扫描盘点页面",
        "点击领料按钮：tap，跳转至领料页面",
        "点击退料按钮：tap，跳转至退料页面"
      ]
    },
    {
      "file": "BarcodeScanInventory.vue",
      "layoutZones": [
        {
          "zone": "扫描预览区",
          "content": "全屏摄像头取景框，支持手动输入条码"
        },
        {
          "zone": "物料信息展示区",
          "content": "识别成功后显示物料编码、名称、图例、系统库存数量"
        },
        {
          "zone": "实物录入区",
          "content": "数字输入框填写实物数量，自动计算差异并显示盘盈/盘亏/一致标识"
        },
        {
          "zone": "证据附件区",
          "content": "拍照/视频按钮，已拍缩略图列表，支持删除重拍"
        },
        {
          "zone": "操作按钮区",
          "content": "提交盘点 / 重置 / 继续扫描（批量模式）"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "摄像头取景框显示示例提示“请对准条码”，无物料信息"
        },
        {
          "state": "loading",
          "content": "摄像头扫描中或识别请求进行中，显示加载动画"
        },
        {
          "state": "success",
          "content": "条码识别成功，物料信息展示区正常显示，可进行后续操作"
        },
        {
          "state": "error",
          "content": "条码无法识别或未在本地物料缓存中找到，显示“未知物料”提示并允许手动录入条码"
        }
      ],
      "keyInteractions": [
        "扫描条码：点击扫描按钮或自动调用摄像头，识别中显示加载动画，识别成功后自动填充物料信息",
        "手动输入条码：在输入框键入条码后回车，查询本地缓存，成功显示物料信息，失败提示未知物料",
        "录入实物数量：数字输入框值变更，实时计算差异并更新差异标识颜色",
        "拍照/录制视频：点击拍照或视频按钮调用系统相机，拍摄后生成缩略图，存入本地，显示在证据附件区",
        "删除附件：点击缩略图删除按钮，移除该附件记录",
        "提交盘点：点击提交盘点按钮，本地生成盘点差异记录，标记待同步，返回工作台更新待办",
        "重置：点击重置按钮，清空当前物料信息、实物数量和附件，恢复扫描预览",
        "继续扫描（批量模式）：点击继续扫描按钮，清空当前输入但保留已提交记录，自动进入下一件扫描"
      ]
    },
    {
      "file": "MaterialRequisition.vue",
      "layoutZones": [
        {
          "zone": "物料选择区",
          "content": "顶部搜索框 + 条码扫描入口，下方展示物料卡片（编码、名称、库存量、阈值）"
        },
        {
          "zone": "领用详情表单区",
          "content": "领用数量输入框、用途说明文本域、关联工单下拉选择（从本地工单列表）"
        },
        {
          "zone": "缺件预警提示区",
          "content": "当领用数量超过库存时，显示红色预警并自动生成缺件申请单（可补充紧急度说明）"
        },
        {
          "zone": "操作按钮区",
          "content": "提交领料 / 取消 / 添加到领料单（允许一次领多种物料？本设计单次单一物料，可多次操作）"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "未选择物料时，显示提示“请扫描或搜索物料”，表单区域禁用或隐藏"
        },
        {
          "state": "loading",
          "content": "搜索物料、加载工单列表或提交领料时，显示加载指示器，禁用交互"
        },
        {
          "state": "success",
          "content": "提交成功，显示成功提示“领料单已生成”，本地库存更新，跳转回工作台"
        },
        {
          "state": "error",
          "content": "校验不通过或提交失败时，显示错误提示（如数量超限、工单无效、网络错误），保留用户输入以便修正"
        }
      ],
      "keyInteractions": [
        "扫描条码：物理扫描枪输入或点击扫描按钮，自动填充物料编码，查询并展示物料卡片信息（名称、库存量、阈值）",
        "搜索物料：在搜索框输入物料编码或名称后点击搜索/回车，展示匹配的物料列表，用户点击选择后填充物料编码并加载库存数据",
        "提交领料：点击“提交领料”按钮，执行字段校验，若数量超限则显示缺件预警并阻止提交，否则发起POST请求，成功则本地扣减库存，生成领料记录并跳转回工作台；失败则显示错误提示",
        "取消：点击“取消”按钮，清空当前表单，返回上一页或工作台",
        "添加到领料单：点击“添加到领料单”按钮，将当前物料加入本地临时领料单列表，允许继续添加其他物料，最后统一提交（当前设计单次单一物料，此按钮可能暂不启用或用于多次操作积累）"
      ]
    },
    {
      "file": "MaterialReturn.vue",
      "layoutZones": [
        {
          "zone": "物料选择区",
          "content": "条码扫描入口 + 手动输入物料编码"
        },
        {
          "zone": "退料信息展示区",
          "content": "展示物料名称、编码、最近领用记录摘要（领料单号、数量、日期）"
        },
        {
          "zone": "退料表单区",
          "content": "退料数量输入框、退料原因下拉选择（工单剩余/物料质量问题/误领等）、备注文本域"
        },
        {
          "zone": "校验结果区",
          "content": "自动显示最大可退量，若超量显示红色拦截提示"
        },
        {
          "zone": "证据附件区（仅限质量问题）",
          "content": "拍照按钮，与盘点复用拍照功能"
        },
        {
          "zone": "操作按钮区",
          "content": "提交退料 / 取消"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "未选择物料时，显示提示信息'请扫描或输入物料编码'，退料表单和操作按钮均不可用"
        },
        {
          "state": "loading",
          "content": "加载领用记录时，物料选择区下方显示加载中动画"
        },
        {
          "state": "success",
          "content": "提交成功后，弹窗或顶部提示'退料成功，已生成待同步退料单'，并自动返回工作台"
        },
        {
          "state": "error",
          "content": "校验失败时，对应字段显示红色错误提示（如'数量超过可退量'、'请选择退料原因'），提交按钮保持禁用状态"
        }
      ],
      "keyInteractions": [
        "扫描条码：扫描设备或手动输入条码，自动填充物料编码、名称，并加载该物料最近5条领用记录（领料单号、数量、日期）",
        "输入退料数量：用户更改退料数量输入框的值，实时计算并显示最大可退量，若超量则显示红色拦截提示并禁用提交按钮",
        "选择退料原因：用户从下拉列表选择退料原因，若选择'物料质量问题'，动态显示拍照证据输入区；否则隐藏",
        "提交退料：用户点击提交按钮，校验通过后本地增加库存，生成待同步退料单，显示提交成功提示并返回工作台；否则显示校验失败提示（如超量、必填项缺失）",
        "取消：用户点击取消按钮，返回工作台，不保存任何数据"
      ]
    },
    {
      "file": "DataSyncDetail.vue",
      "layoutZones": [
        {
          "zone": "同步状态总览区",
          "content": "显示待同步/同步中/成功/失败的条数统计及进度条"
        },
        {
          "zone": "同步队列列表区",
          "content": "按时间倒序展示每条待同步/已同步记录（数据类型、物料名称、操作类型、操作时间、状态标识）"
        },
        {
          "zone": "同步失败/冲突处理区",
          "content": "专门展示失败和冲突项，每条提供重试按钮或冲突对比视图（本地 vs 岸端）"
        },
        {
          "zone": "手动操作区",
          "content": "全局同步按钮（在线时）、清除成功记录按钮、历史同步日志入口"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "无待同步记录时显示“所有数据已同步”空状态提示"
        },
        {
          "state": "loading",
          "content": "列表加载时显示骨架屏，状态统计区域显示加载中"
        },
        {
          "state": "success",
          "content": "同步成功时更新状态统计数字，短暂显示绿色成功提示"
        },
        {
          "state": "error",
          "content": "网络异常或同步失败时显示红色错误提示，禁用自动同步，允许手动重试"
        }
      ],
      "keyInteractions": [
        "重试：点击触发，重新上传该条数据，更新状态为同步中，完成后更新统计",
        "保留本地：点击触发，确认使用本地版本解决冲突，自动更新缓存并清除冲突标记",
        "采用岸端：点击触发，确认使用岸端版本解决冲突，自动更新缓存并清除冲突标记",
        "全局同步：点击触发，执行全部待同步数据上传，展示进度条，完成后更新统计",
        "清除成功记录：点击触发，移除列表中所有状态为成功的记录",
        "查看同步日志：点击触发，跳转至历史同步日志页面",
        "下拉刷新：下拉触发，手动触发岸端同步状态检查，刷新同步队列",
        "长按查看详情：长按触发，弹窗显示该条数据的原始JSON内容"
      ]
    },
    {
      "file": "UserManager.vue",
      "layoutZones": [
        {
          "zone": "顶部筛选栏",
          "content": "部门、角色、状态、搜索框"
        },
        {
          "zone": "操作按钮区",
          "content": "新建用户、批量导入、批量导出"
        },
        {
          "zone": "用户列表表格",
          "content": "账号、姓名、部门、角色、状态、操作列"
        },
        {
          "zone": "分页控件",
          "content": ""
        },
        {
          "zone": "新建/编辑用户弹窗",
          "content": "表单：账号、姓名、部门、联系方式、角色分配"
        },
        {
          "zone": "批量导入弹窗",
          "content": "上传CSV、预览、确认"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "无用户时显示引导创建提示"
        },
        {
          "state": "loading",
          "content": "骨架屏或加载动画"
        },
        {
          "state": "success",
          "content": "操作成功时显示成功提示，并刷新列表数据"
        },
        {
          "state": "error",
          "content": "接口超时或错误时显示错误提示与重试按钮"
        }
      ],
      "keyInteractions": [
        "新建用户：点击“新建用户”按钮，弹出创建表单弹窗，填写后保存并刷新列表",
        "编辑用户：点击表格行操作列“编辑”按钮，弹出编辑表单弹窗，修改后保存并刷新列表",
        "启用/禁用用户：点击“启用/禁用”按钮，二次确认后切换用户状态并更新列表",
        "批量导入：按住Shift多选用户后点击“批量导入”按钮，弹出上传CSV弹窗，上传、预览、确认导入",
        "导出用户：点击“导出”按钮，下载CSV文件",
        "搜索：点击搜索按钮，根据筛选条件过滤用户列表并刷新"
      ]
    },
    {
      "file": "RolePermissionManager.vue",
      "layoutZones": [
        {
          "zone": "角色列表左面板",
          "content": "角色名称、关联用户数、操作按钮"
        },
        {
          "zone": "角色详情右面板",
          "content": "角色基本信息、权限树、操作按钮"
        },
        {
          "zone": "顶部工具栏",
          "content": "新建角色、复制角色、删除角色"
        },
        {
          "zone": "权限树组件",
          "content": "模块展开勾选操作权限"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "无角色时显示空状态提示，引导用户创建第一个角色"
        },
        {
          "state": "loading",
          "content": "角色列表加载中显示加载指示器；权限树加载中显示树加载状态"
        },
        {
          "state": "success",
          "content": "操作成功时显示成功反馈（如Toast提示）"
        },
        {
          "state": "error",
          "content": "操作失败时显示错误反馈（如Toast提示），权限树加载失败显示重试按钮"
        }
      ],
      "keyInteractions": [
        "选择角色：点击左面板角色项，右面板切换显示该角色的基本信息与权限树",
        "新建角色：点击顶部工具栏'新建角色'按钮，弹出新建角色表单，填写名称和描述，提交后保存并刷新角色列表，自动选中新角色",
        "复制角色：点击顶部工具栏'复制角色'按钮，弹出选择源角色对话框，选择后生成副本并刷新列表，自动选中新角色",
        "删除角色：点击顶部工具栏或右面板'删除'按钮，检查关联用户和流程引用，若存在引用则弹出禁止删除提示；否则确认后删除并刷新列表",
        "配置权限：在权限树中勾选/取消勾选模块或操作权限，自动保存权限配置，显示保存成功提示；若失败显示错误提示",
        "保存角色信息：点击右面板'保存'按钮，更新角色名称和描述，保存成功后显示成功提示并刷新列表"
      ]
    },
    {
      "file": "WorkflowDesigner.vue",
      "layoutZones": [
        {
          "zone": "流程类型选择/列表区域",
          "content": "流程类型选择/列表区域"
        },
        {
          "zone": "流程设计画布（拖拽节点、连接线）",
          "content": "流程设计画布（拖拽节点、连接线）"
        },
        {
          "zone": "节点属性面板（审批人、超时规则、转交策略）",
          "content": "节点属性面板（审批人、超时规则、转交策略）"
        },
        {
          "zone": "顶部操作栏（保存、发布、版本管理）",
          "content": "顶部操作栏（保存、发布、版本管理）"
        },
        {
          "zone": "已发布流程概览视图",
          "content": "已发布流程概览视图"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "无流程定义时，显示创建引导提示，如“点击选择流程类型开始设计新流程”"
        },
        {
          "state": "loading",
          "content": "加载流程列表、流程类型或画布数据时显示加载指示器"
        },
        {
          "state": "success",
          "content": "保存或发布成功后显示成功提示消息"
        },
        {
          "state": "error",
          "content": "保存失败或网络错误时显示错误提示信息，并建议重试或查看日志"
        }
      ],
      "keyInteractions": [
        "选择流程类型",
        "拖拽节点到画布",
        "连接节点",
        "点击节点打开属性面板",
        "保存草稿",
        "发布流程",
        "查看版本管理"
      ]
    },
    {
      "file": "ConfigSimulation.vue",
      "layoutZones": [
        {
          "zone": "模拟用户/角色选择下拉框",
          "content": "模拟用户/角色选择下拉框"
        },
        {
          "zone": "模拟操作区域（菜单导航模拟、流程实例模拟）",
          "content": "模拟操作区域（菜单导航模拟、流程实例模拟）"
        },
        {
          "zone": "配置冲突检查结果列表",
          "content": "配置冲突检查结果列表"
        },
        {
          "zone": "全局发布按钮与影响范围确认弹窗",
          "content": "全局发布按钮与影响范围确认弹窗"
        },
        {
          "zone": "变更日志摘要",
          "content": "变更日志摘要"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "当前配置无需验证"
        },
        {
          "state": "loading",
          "content": "模拟启动或执行中，请稍候"
        },
        {
          "state": "success",
          "content": "配置发布成功，变更已生效"
        },
        {
          "state": "error",
          "content": "操作失败，请检查网络或联系管理员"
        }
      ],
      "keyInteractions": [
        "开始模拟",
        "执行模拟操作",
        "检查配置冲突",
        "正式发布",
        "查看变更日志"
      ]
    },
    {
      "file": "AuditLogView.vue",
      "layoutZones": [
        {
          "zone": "顶部筛选栏（时间范围、操作人、操作对象类型、操作类型）",
          "content": "顶部筛选栏（时间范围、操作人、操作对象类型、操作类型）"
        },
        {
          "zone": "日志列表表格（操作时间、操作人、操作类型、操作对象、内容摘要）",
          "content": "日志列表表格（操作时间、操作人、操作类型、操作对象、内容摘要）"
        },
        {
          "zone": "日志详情抽屉（变更前后对比）",
          "content": "日志详情抽屉（变更前后对比）"
        },
        {
          "zone": "导出按钮",
          "content": "导出按钮"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "显示提示文案'无审计记录'，并提供继续筛选的建议"
        },
        {
          "state": "loading",
          "content": "显示加载中状态，如旋转图标覆盖列表区域"
        },
        {
          "state": "success",
          "content": "正常显示日志列表表格，支持分页"
        },
        {
          "state": "error",
          "content": "显示错误提示信息，如'查询失败，请重试'，并提供重试按钮"
        }
      ],
      "keyInteractions": [
        "查询",
        "重置",
        "导出",
        "查看详情"
      ]
    },
    {
      "file": "SysMonitorDashboard.vue",
      "layoutZones": [
        {
          "zone": "告警横幅",
          "content": "顶部红色告警横幅（微服务异常或同步成功率低时显示）"
        },
        {
          "zone": "指标卡片行",
          "content": "指标卡片行：服务在线数/异常数、数据库连接池使用率、CPU/内存/磁盘使用率"
        },
        {
          "zone": "统计图表区",
          "content": "统计图表区：资源使用趋势折线图、近24小时同步成功率柱状图"
        },
        {
          "zone": "快捷入口",
          "content": "快捷入口按钮区：跳转至告警管理、操作审计、报告生成"
        },
        {
          "zone": "筛选器栏",
          "content": "筛选器栏：按船舶、模块、时间范围筛选指标（支持自动刷新）"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "首次部署无数据时，展示空态提示：暂无运行数据；显示空状态插图及文字说明"
        },
        {
          "state": "loading",
          "content": "异步获取数据时显示骨架屏；骨架屏占位，禁用交互"
        },
        {
          "state": "success",
          "content": "数据加载成功，正常展示仪表盘；所有指标卡片、图表、筛选器可用"
        },
        {
          "state": "error",
          "content": "API超时或返回错误；显示错误提示与重试按钮，自动刷新停止"
        }
      ],
      "keyInteractions": [
        "点击微服务异常数卡片：跳转至告警管理页面并预设筛选条件为异常服务",
        "点击同步成功率柱状图某时段：下钻查看该时段内失败船舶列表",
        "切换自动刷新开关：开启或关闭自动刷新定时器（默认每30秒）",
        "鼠标悬停趋势图数据点：显示该时间点具体数值"
      ]
    },
    {
      "file": "AlertManagement.vue",
      "layoutZones": [
        {
          "zone": "筛选栏",
          "content": "筛选栏：严重程度、告警类型、时间范围、状态（未处理/处理中/已解决）"
        },
        {
          "zone": "告警列表表格",
          "content": "告警列表表格：类型、级别、描述、影响范围、发生时间、累计次数、状态"
        },
        {
          "zone": "告警详情抽屉",
          "content": "告警详情抽屉：告警内容、影响船舶/模块、首次/最近发生时间、关联操作日志列表"
        },
        {
          "zone": "处理操作面板",
          "content": "处理操作面板：处理措施下拉选择、处理备注输入框、状态更新按钮"
        },
        {
          "zone": "历史处理记录查询区",
          "content": "历史处理记录查询区：按处理人、处理结果、时间范围检索"
        },
        {
          "zone": "批量操作栏",
          "content": "批量操作栏：批量标记处理状态"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "显示空态提示：‘暂无告警记录’，并提供刷新按钮"
        },
        {
          "state": "loading",
          "content": "列表区域显示骨架屏或加载动画，操作按钮禁用"
        },
        {
          "state": "success",
          "content": "列表正常展示，操作成功时显示短暂成功提示（如Toast）"
        },
        {
          "state": "error",
          "content": "当API不可用时，显示错误提示：‘数据加载失败，请检查网络’，并提供重试按钮"
        }
      ],
      "keyInteractions": [
        "查看告警详情：点击告警行，展开告警详情抽屉，显示告警内容、影响范围、首次/最近发生时间、关联操作日志列表",
        "提交处理：点击处理操作面板中的状态更新按钮，校验处理措施必选后，调用PUT /api/monitor/alerts/{alertId}/handle，更新告警状态为‘处理中’或‘已解决’，并显示成功提示；若校验失败，高亮错误字段",
        "批量标记处理：选中多条告警后点击批量操作栏中的标记按钮，弹出确认对话框，确认后批量调用更新接口，显示批量处理进度和结果",
        "关联操作日志跳转：点击告警详情中的关联操作日志链接，跳转至审计日志页面，并携带当前告警ID作为筛选条件",
        "查询历史处理记录：点击历史处理记录查询区的查询按钮，根据输入的处理人、处理结果、时间范围重新加载历史记录列表"
      ]
    },
    {
      "file": "AuditLogSearch.vue",
      "layoutZones": [
        {
          "zone": "复合筛选面板",
          "content": "复合筛选面板：时间范围（自定义+快捷选项）、用户角色、操作类型、操作对象"
        },
        {
          "zone": "日志结果表格",
          "content": "日志结果表格：时间、操作用户、角色、IP地址、操作类型、对象、详情（展开后显示变更前后值）"
        },
        {
          "zone": "标记操作栏",
          "content": "标记操作栏：单条/批量标记为‘待审核’并添加备注"
        },
        {
          "zone": "审核确认栏",
          "content": "审核确认栏：对‘待审核’条目执行‘确认’或‘驳回’"
        },
        {
          "zone": "导出工具栏",
          "content": "导出工具栏：导出CSV/PDF，导出内容含筛选条件摘要"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "无符合条件的日志数据，显示空态提示"
        },
        {
          "state": "loading",
          "content": "查询或审核提交过程中显示加载动画"
        },
        {
          "state": "success",
          "content": "正常显示日志表格及操作结果反馈"
        },
        {
          "state": "error",
          "content": "查询超时或请求失败时显示错误信息及重试按钮"
        }
      ],
      "keyInteractions": [
        "查询：点击查询按钮，触发loading状态，发送GET /api/audit/logs请求，成功后表格更新，失败显示错误提示",
        "展开详情：点击日志行中的展开图标，发送GET /api/audit/logs/{logId}，在行内展开区域展示变更前后JSON对比",
        "标记待审核：勾选单条或多条日志后点击标记按钮，弹出备注输入框，输入备注后确认，发送PUT /api/audit/logs/{logId}/mark，标记成功则更新行状态为'待审核'",
        "审核确认：在待审核条目上点击确认或驳回，发送PUT /api/audit/logs/{logId}/mark（状态为confirmed或rejected），成功后更新条目标记状态",
        "批量审核：勾选多条待审核日志后点击确认/驳回按钮，依次发送PUT请求，完成后刷新表格并显示汇总结果",
        "导出CSV/PDF：点击导出按钮，显示导出进度态，发送POST /api/audit/logs/export，生成文件后自动下载"
      ]
    },
    {
      "file": "ReportGenerator.vue",
      "layoutZones": [
        {
          "zone": "报告模板选择区",
          "content": "预设模板列表（运维周报、月报、审计摘要、航前合规汇总）"
        },
        {
          "zone": "自定义配置区",
          "content": "选择船舶、时间区间、是否包含告警明细、操作审计摘要等"
        },
        {
          "zone": "生成与预览区",
          "content": "一键生成按钮、生成进度条、实时预览（PDF/Word）"
        },
        {
          "zone": "定时计划设置区",
          "content": "启动/关闭定时生成，配置cron表达式、接收邮箱"
        },
        {
          "zone": "已生成报告列表",
          "content": "按类型、生成时间检索，下载或删除操作"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "无任何报告，展示空状态引导（如提示'暂无报告，请先生成'）"
        },
        {
          "state": "loading",
          "content": "生成报告或列表加载时显示加载动画或进度条"
        },
        {
          "state": "success",
          "content": "操作成功，显示成功提示（如'报告生成完成'/'定时计划已保存'）"
        },
        {
          "state": "error",
          "content": "操作失败，显示错误信息（如'生成失败，请重试'/'网络异常'）"
        }
      ],
      "keyInteractions": [
        "点击'生成'按钮：显示生成进度条，完成后自动打开预览窗口",
        "点击报告项上的'预览'按钮：弹出实时预览窗口（PDF/Word）",
        "点击报告项上的'下载'按钮：触发文件下载",
        "点击报告项上的'删除'按钮：从已生成列表中移除该报告",
        "点击定时计划设置区的'保存'按钮：提示'定时计划已保存'并开启定时任务",
        "点击定时计划设置区的开关：启动或关闭定时生成计划，状态实时更新",
        "点击'刷新'按钮：重新加载已生成报告列表"
      ]
    },
    {
      "file": "AuditLogWorkspace.vue",
      "layoutZones": [
        {
          "zone": "顶部统计摘要区",
          "content": "展示总日志条数及按操作类型/日期的柱状图或饼图"
        },
        {
          "zone": "高级筛选面板区",
          "content": "包含时间范围选择器（近7天/30天/自定义）、用户角色下拉、操作类型多选、船舶名称搜索"
        },
        {
          "zone": "日志列表区",
          "content": "每行显示操作人、时间、模块、操作类型、状态（正常/待审核/不合规），支持点击展开详情"
        },
        {
          "zone": "详情展开面板",
          "content": "以左右对比或内联高亮展示变更前后内容，包含所有元数据字段"
        },
        {
          "zone": "操作工具栏",
          "content": "每条日志右侧或详情面板内提供标记按钮（待审核/不合规），以及列表顶部的导出报告按钮"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "当前筛选条件下无操作日志，请调整查询条件。展示空状态图标和提示文字。"
        },
        {
          "state": "loading",
          "content": "初次加载或筛选查询时显示骨架屏或加载中动画，所有可交互区域（查询按钮、列表、统计图）置灰不可操作。"
        },
        {
          "state": "success",
          "content": "加载成功，列表展示日志数据，统计图展示分布，筛选条件保留可继续调整。"
        },
        {
          "state": "error",
          "content": "接口请求失败时显示错误提示与重试按钮，保留当前已输入筛选条件，以便用户重试。"
        }
      ],
      "keyInteractions": [
        "点击查询按钮或自动触发（筛选条件变化后）：列表刷新并显示加载中骨架屏；统计图同步更新；无匹配时显示空态。",
        "点击日志行：详情面板展开或折叠，变更差异区域高亮显示新增（绿色）、删除（红色）；面板含关闭按钮。",
        "点击日志行右侧或详情内的“标记为待审核”按钮：弹出标记弹窗，必填审计意见；提交后日志状态更新为黄色‘待审核’；操作自动记录审计痕迹。",
        "点击日志行右侧或详情内的“标记为不合规”按钮：弹出标记弹窗，必填审计意见，可选触发审批流程；提交后日志状态更新为红色‘不合规’；若触发审批则流转至审批环节；操作自动记录审计痕迹。",
        "点击列表顶部的“导出报告”按钮：弹出导出配置对话框，选择格式、填写标题和签名；确认后显示生成进度条；完成后提供下载链接并自动记录导出日志。"
      ]
    },
    {
      "file": "ProcurementRequirementReview.vue",
      "layoutZones": [
        {
          "zone": "筛选与搜索区",
          "content": "物料编码、紧急程度、创建时间"
        },
        {
          "zone": "采购需求列表区",
          "content": "展示待处理需求，含物料编码、名称、数量、建议供应商、状态"
        },
        {
          "zone": "需求详情预览区",
          "content": "点击列表项展开，显示库存、BOM关联、预算余额"
        },
        {
          "zone": "发起采购申请操作区",
          "content": "按钮、弹窗表单：采购说明、交货期限、供应商选择、附件上传"
        },
        {
          "zone": "预算不足提示区",
          "content": "条件触发"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "暂无待处理的采购需求，列表显示空状态提示"
        },
        {
          "state": "loading",
          "content": "数据加载中，列表区域显示骨架屏"
        },
        {
          "state": "success",
          "content": "数据加载成功，列表正常展示；操作提交成功后显示成功提示"
        },
        {
          "state": "error",
          "content": "数据加载失败，显示错误提示及重试按钮；操作提交失败时显示错误信息"
        }
      ],
      "keyInteractions": [
        "筛选条件变化（输入或选择后自动触发或点击按钮）：重新加载采购需求列表，展示匹配结果",
        "点击需求列表行：展开或收起该行的详情预览区，显示库存、BOM关联、预算余额等信息",
        "点击'发起采购申请'按钮：弹出采购申请表单弹窗，表单包括采购说明、交货期限、供应商选择、附件上传",
        "点击表单中的'提交'按钮：系统校验预算余额，若不足则阻止提交并弹出提示'预算不足，请调整数量或发起预算追加流程'；若通过则提交申请，显示提交成功反馈",
        "点击供应商字段下拉或手动输入：调用GET /api/suppliers获取合格供应商列表并显示，支持搜索选择",
        "点击附件上传区域的'选择文件'：弹出文件选择对话框，选择后上传并显示文件列表，校验格式及大小"
      ]
    },
    {
      "file": "ProcurementOrderTracking.vue",
      "layoutZones": [
        {
          "zone": "筛选与搜索区",
          "content": "订单号、供应商、状态、预计到货时间筛选条件"
        },
        {
          "zone": "采购订单列表区",
          "content": "显示订单号、物料、金额、供应商、状态、预计到货时间"
        },
        {
          "zone": "订单详情面板",
          "content": "点击订单行展开，展示完整信息及审批历史"
        },
        {
          "zone": "状态更新操作区",
          "content": "手动更新状态按钮，备注输入"
        },
        {
          "zone": "预警提示区",
          "content": "超期未到货时高亮显示"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "列表无数据时展示暂无采购订单提示"
        },
        {
          "state": "loading",
          "content": "列表数据加载中显示加载骨架屏或loading图标"
        },
        {
          "state": "success",
          "content": "数据正常加载显示列表"
        },
        {
          "state": "error",
          "content": "列表加载失败显示错误信息及重试按钮"
        }
      ],
      "keyInteractions": [
        "点击订单行：展开/收起订单详情面板，显示完整信息及审批历史",
        "点击'更新状态'按钮：弹出状态选择弹窗，用户选择新状态并输入备注后提交，系统更新订单状态并刷新列表，成功时显示成功提示",
        "当订单状态变为'已到货'时自动触发到货提醒，并提供'去验收'按钮，点击跳转到验收页面"
      ],
      "revisionNote": "根据用户要求将原页面规格转换为layoutZones/uiStates/keyInteractions格式"
    },
    {
      "file": "GoodsReceiptAndInspection.vue",
      "layoutZones": [
        {
          "zone": "订单选择区",
          "content": "下拉选择或搜索待验收的采购订单"
        },
        {
          "zone": "条码扫描/手动录入区",
          "content": "支持摄像头扫描或输入框"
        },
        {
          "zone": "物料明细核对区",
          "content": "显示订单物料、应到数量、实到数量输入框、外观检验结果选择"
        },
        {
          "zone": "附件上传区",
          "content": "照片、质检报告"
        },
        {
          "zone": "检验结论与操作区",
          "content": "合格/部分合格/不合格按钮，入库/退换货确认"
        },
        {
          "zone": "历史记录与跟踪区",
          "content": "入库记录、退换货单列表"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "暂无待验收的采购订单，展示文字提示，隐藏操作区域"
        },
        {
          "state": "loading",
          "content": "订单加载中或扫描识别中，显示加载动画，禁用相关操作按钮"
        },
        {
          "state": "success",
          "content": "入库或退换货操作成功，显示成功反馈弹窗，自动刷新数据或跳转"
        },
        {
          "state": "error",
          "content": "条码无法识别、订单信息不匹配或校验失败，显示错误提示，高亮异常字段，允许重新操作"
        }
      ],
      "keyInteractions": [
        "选择订单：从订单选择下拉框中选中一项，自动加载该订单的物料列表，高亮显示物料行",
        "扫描条码：摄像头扫描或手动输入条码，自动定位到对应物料行，若无法识别则给出错误提示",
        "上传附件：选择文件或拍照上传，表格相应行显示已上传附件列表，支持预览和删除",
        "确认验收：点击按钮触发检验结论弹窗（合格/部分合格/不合格），根据选择执行入库或退换货：合格则自动更新库存台账并核减预算，显示成功信息；部分合格则部分入库+部分退换货；不合格则全部退换货，生成退换货单并通知供应商",
        "提交退换货：在退换货弹窗中填写原因并确认，生成退换货单，关闭弹窗，列表刷新显示新退换货记录"
      ],
      "revisionNote": "根据用户要求将原页面规格转换为layoutZones/uiStates/keyInteractions格式"
    }
  ],
  "pageApiMapping": [
    {
      "page": "MaintenancePlanWorkbench.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/equipment-tree",
          "usage": "页面加载时获取设备资产树及各设备维保计划状态，同时返回统计卡片数据（计划总数、即将到期数、缺失数）"
        }
      ]
    },
    {
      "page": "PlanEditor.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/equipment-tree",
          "usage": "打开设备选择弹窗时，加载设备资产树供用户单选或多选设备"
        },
        {
          "method": "POST",
          "path": "/api/maintenance-plans",
          "usage": "用户填写表单并点击提交审核按钮时，创建新的预防性维护计划，触发前端校验后调用此接口"
        }
      ]
    },
    {
      "page": "PlanApproval.vue",
      "apis": [
        {
          "method": "POST",
          "path": "/api/approvals/{id}/action",
          "usage": "用户在审批操作区点击通过或驳回按钮，提交审批决策并填写意见"
        },
        {
          "method": "GET",
          "path": "/api/audit-logs",
          "usage": "选中某条申请后，在审核日志区按申请ID查询该申请的历史审核记录，以时间线形式展示"
        }
      ]
    },
    {
      "page": "VoyageHealthTrigger.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/vessels/status",
          "usage": "页面加载时获取船舶列表，展示待检查、执行中、已完成的船舶卡片"
        },
        {
          "method": "POST",
          "path": "/api/voyage-health/check-tasks",
          "usage": "用户选择船舶并点击手动发起检查时，创建航前健康检查任务"
        }
      ]
    },
    {
      "page": "VoyageHealthDashboard.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/voyage-health/check-summary",
          "usage": "页面加载时获取当前船舶健康校验总览数据，包括健康分数、拦截状态、分类结果和问题清单"
        },
        {
          "method": "GET",
          "path": "/api/voyage-health/issues/{issueId}",
          "usage": "用户在问题清单表格中点击某条不通过项时，跳转详情页或弹窗展示该项的详细信息"
        }
      ]
    },
    {
      "page": "VoyageHealthIssueDetail.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/voyage-health/issues/{issueId}",
          "usage": "页面加载时获取不通过项的详细信息，包括基本信息、关联对象、处置进度等"
        },
        {
          "method": "POST",
          "path": "/api/dispatch-commands",
          "usage": "创建紧急工单后调用，用于下发调度指令（若业务映射）"
        },
        {
          "method": "POST",
          "path": "/api/inventory/requisition",
          "usage": "发起物资调拨申请时提交领料单"
        },
        {
          "method": "POST",
          "path": "/api/approvals/{id}/action",
          "usage": "提交豁免审批操作，如通过或驳回"
        }
      ]
    },
    {
      "page": "VoyageHealthReports.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/voyage-health/reports",
          "usage": "页面加载或筛选时获取历次航前健康检查记录列表"
        },
        {
          "method": "POST",
          "path": "/api/report/generate",
          "usage": "点击生成报告按钮时发起报告生成任务"
        }
      ]
    },
    {
      "page": "WorkOrderAuditList.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/workOrders",
          "usage": "页面加载、筛选或分页排序时获取待审核/已完成工单列表"
        }
      ]
    },
    {
      "page": "WorkOrderAuditDetail.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/workorders/{id}",
          "usage": "页面加载时获取工单完整详情，包括执行明细、物料消耗、附件等"
        },
        {
          "method": "POST",
          "path": "/api/workOrders/{workOrderId}/audit",
          "usage": "审核通过或退回时调用，更新工单状态并记录审批意见"
        }
      ]
    },
    {
      "page": "ShipMonitoringOverview.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/vessels/status",
          "usage": "页面加载及自动刷新时获取所有在管船舶的实时位置、航速、状态等列表数据"
        },
        {
          "method": "GET",
          "path": "/api/vessels/{id}/detail",
          "usage": "点击地图标记或列表行时获取选定船舶的详细运行数据"
        }
      ]
    },
    {
      "page": "ShipDetailBoard.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/vessels/{id}/detail",
          "usage": "页面初始化时加载选定船舶的航次信息、工单执行进度、健康校验结果及证书预警数据"
        },
        {
          "method": "GET",
          "path": "/api/voyage-health/issues/{issueId}",
          "usage": "用户点击不通过项行时获取该项详细信息和关联数据"
        }
      ]
    },
    {
      "page": "DispatchCommandEditor.vue",
      "apis": [
        {
          "method": "POST",
          "path": "/api/dispatch-commands",
          "usage": "用户填写指令表单并点击下发时创建调度指令并触发状态流转"
        }
      ]
    },
    {
      "page": "DataSyncManager.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/v1/sync/shipments/summary",
          "usage": "页面加载或手动刷新时获取所有船舶同步状态概览"
        }
      ]
    },
    {
      "page": "SyncTaskList.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/v1/sync/tasks",
          "usage": "页面加载、切换标签页或筛选条件变更时查询同步任务列表"
        }
      ]
    },
    {
      "page": "SyncTaskDetail.vue",
      "apis": [
        {
          "method": "POST",
          "path": "/api/v1/sync/conflicts/{conflictId}/resolve",
          "usage": "用户在冲突解决面板提交合并结果时调用"
        },
        {
          "method": "GET",
          "path": "/api/v1/sync/audit-log",
          "usage": "页面加载时查询该任务的历史操作日志用于审计追溯"
        }
      ]
    },
    {
      "page": "SyncReport.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/v1/sync/audit-log",
          "usage": "加载筛选后的同步审计日志列表，支撑列表区展示和统计看板数据源"
        },
        {
          "method": "GET",
          "path": "/api/v1/sync/shipments/summary",
          "usage": "获取船舶同步概览数据，用于统计看板卡片的同步成功率、平均延迟、冲突率等指标"
        },
        {
          "method": "POST",
          "path": "/api/report/generate",
          "usage": "用户点击导出PDF或CSV时，异步生成同步健康度报告，返回任务ID供前端轮询下载"
        }
      ]
    },
    {
      "page": "MobileWorkOrderList.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/workorders",
          "usage": "首次打开或下拉刷新时请求服务器获取待执行工单列表，同步更新本地缓存"
        },
        {
          "method": "GET",
          "path": "/api/sync/status",
          "usage": "获取当前船舶同步状态，用于顶部状态栏显示未同步数量"
        }
      ]
    },
    {
      "page": "MobileWorkOrderDetail.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/workorders/{id}",
          "usage": "从本地缓存读取工单详情数据（若无缓存则请求网络），展示设备信息、维保步骤、物料清单、附件元数据"
        }
      ]
    },
    {
      "page": "MobileWorkOrderExecute.vue",
      "apis": [
        {
          "method": "POST",
          "path": "/api/workorders/{id}/report",
          "usage": "提交报工数据时，将离线录入的工时、物料消耗、多媒体附件等批量同步至服务端"
        }
      ]
    },
    {
      "page": "MobileSyncStatus.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/sync/status",
          "usage": "加载页面时获取同步队列状态、冲突列表、存储使用量等概览信息"
        },
        {
          "method": "POST",
          "path": "/api/sync/trigger",
          "usage": "用户点击手动同步按钮时触发后台同步任务，服务端开始处理待同步工单"
        },
        {
          "method": "POST",
          "path": "/api/v1/sync/conflicts/{conflictId}/resolve",
          "usage": "用户在冲突列表中做出解决决策（使用本地/使用岸端/标记待处理）后提交合并结果"
        }
      ]
    },
    {
      "page": "InventoryWorkbench.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/inventory/workbench",
          "usage": "进入页面时调用，获取待办任务、同步概览、最近操作记录以及网络状态等聚合数据，用于填充工作台各个区域"
        }
      ]
    },
    {
      "page": "BarcodeScanInventory.vue",
      "apis": [
        {
          "method": "POST",
          "path": "/api/inventory/physicalCount",
          "usage": "用户录入实物数量并点击提交盘点按钮后调用，将条码、实物数量及证据附件提交至服务端生成盘点差异记录"
        }
      ]
    },
    {
      "page": "MaterialRequisition.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/workorders",
          "usage": "进入页面或需要关联工单时调用，获取当前船舶待执行的工单列表，用于下拉选择关联工单"
        },
        {
          "method": "POST",
          "path": "/api/inventory/requisition",
          "usage": "用户填写领用信息并点击提交领料按钮后调用，创建领料单并扣减本地库存"
        }
      ]
    },
    {
      "page": "MaterialReturn.vue",
      "apis": [
        {
          "method": "POST",
          "path": "/api/inventory/return",
          "usage": "用户填写退料信息并点击提交退料按钮后调用，增加本地库存并生成待同步退料单"
        }
      ]
    },
    {
      "page": "DataSyncDetail.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/v1/sync/shipments/summary",
          "usage": "进入页面时调用，获取待同步/同步中/成功/失败的条数统计及进度条数据，用于同步状态总览区"
        },
        {
          "method": "GET",
          "path": "/api/v1/sync/tasks",
          "usage": "进入页面及下拉刷新时调用，获取按时间倒序排列的同步任务列表，用于同步队列列表区"
        },
        {
          "method": "POST",
          "path": "/api/v1/sync/conflicts/{conflictId}/resolve",
          "usage": "用户在冲突处理区选择保留本地或采用岸端版本后调用，提交冲突解决结果并更新缓存"
        },
        {
          "method": "POST",
          "path": "/api/sync/trigger",
          "usage": "用户点击全局同步按钮时调用，触发所有待同步数据的后台上传"
        }
      ]
    },
    {
      "page": "UserManager.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/users",
          "usage": "页面加载时获取用户列表进行展示，配合筛选条件刷新列表数据"
        },
        {
          "method": "PUT",
          "path": "/api/roles/{roleId}",
          "usage": "分配用户角色时调用，更新角色权限关联用户信息（备用）"
        }
      ]
    },
    {
      "page": "RolePermissionManager.vue",
      "apis": [
        {
          "method": "PUT",
          "path": "/api/roles/{roleId}",
          "usage": "保存角色名称、描述及权限树配置后调用，更新角色信息与权限"
        }
      ]
    },
    {
      "page": "WorkflowDesigner.vue",
      "apis": [
        {
          "method": "POST",
          "path": "/api/workflows",
          "usage": "保存流程设计草稿时调用，将画布节点及属性提交至服务端"
        }
      ]
    },
    {
      "page": "ConfigSimulation.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/users",
          "usage": "模拟切换用户/角色时，加载用户列表供下拉选择"
        },
        {
          "method": "POST",
          "path": "/api/config/publish",
          "usage": "正式发布全局配置前校验并确认影响范围后调用"
        }
      ]
    },
    {
      "page": "AuditLogView.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/audit-logs",
          "usage": "页面加载及筛选条件变动时，分页查询审计日志列表"
        }
      ]
    },
    {
      "page": "SysMonitorDashboard.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/monitor/overview",
          "usage": "页面加载时获取系统整体健康度、关键运行指标及摘要统计，填充指标卡片、告警横幅和统计图表"
        }
      ]
    },
    {
      "page": "AlertManagement.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/monitor/alerts",
          "usage": "页面加载及切换筛选条件时获取分页告警列表，支持按严重程度、类型、时间范围、状态筛选"
        }
      ]
    },
    {
      "page": "AuditLogSearch.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/audit/logs",
          "usage": "用户点击查询或筛选条件变化时获取操作审计日志分页列表，用于表格展示及详情展开"
        }
      ]
    },
    {
      "page": "ReportGenerator.vue",
      "apis": [
        {
          "method": "POST",
          "path": "/api/report/generate",
          "usage": "用户点击一键生成按钮时根据所选模板和参数异步生成报告，返回任务ID供进度轮询和下载"
        }
      ]
    },
    {
      "page": "AuditLogWorkspace.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/audit/logs",
          "usage": "页面加载及高级筛选条件变化时获取操作审计日志列表，同时获取统计摘要（需后端在响应中返回）"
        }
      ]
    },
    {
      "page": "ProcurementRequirementReview.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/procurement/orders",
          "usage": "页面加载时获取待处理的采购需求列表，用于展示列表区"
        },
        {
          "method": "POST",
          "path": "/api/procurement/orders",
          "usage": "用户点击发起采购申请并提交表单时调用，创建采购订单并校验预算"
        }
      ]
    },
    {
      "page": "ProcurementOrderTracking.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/procurement/orders",
          "usage": "页面加载及筛选条件变化时获取采购订单列表"
        }
      ]
    },
    {
      "page": "GoodsReceiptAndInspection.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/procurement/orders",
          "usage": "页面加载时获取待验收的采购订单列表，供用户选择"
        },
        {
          "method": "POST",
          "path": "/api/inspection/records",
          "usage": "用户确认验收结论并提交时调用，创建验收记录并触发入库或退换货"
        }
      ]
    }
  ],
  "navigationRoutes": [
    {
      "group": "调度指挥",
      "icon": "🚢",
      "routes": [
        {
          "path": "/dispatch/plan-workbench",
          "component": "MaintenancePlanWorkbench.vue",
          "title": "计划工作台",
          "default": true
        },
        {
          "path": "/dispatch/plan-editor",
          "component": "PlanEditor.vue",
          "title": "计划编辑",
          "default": false
        },
        {
          "path": "/dispatch/plan-approval",
          "component": "PlanApproval.vue",
          "title": "计划审批",
          "default": false
        },
        {
          "path": "/dispatch/voyage-health-trigger",
          "component": "VoyageHealthTrigger.vue",
          "title": "航前健康检查发起",
          "default": false
        },
        {
          "path": "/dispatch/voyage-health-dashboard",
          "component": "VoyageHealthDashboard.vue",
          "title": "健康校验总览",
          "default": false
        },
        {
          "path": "/dispatch/voyage-health-issue-detail",
          "component": "VoyageHealthIssueDetail.vue",
          "title": "健康问题处置",
          "default": false
        },
        {
          "path": "/dispatch/voyage-health-reports",
          "component": "VoyageHealthReports.vue",
          "title": "健康报告",
          "default": false
        },
        {
          "path": "/dispatch/work-order-audit-list",
          "component": "WorkOrderAuditList.vue",
          "title": "工单审核列表",
          "default": false
        },
        {
          "path": "/dispatch/work-order-audit-detail",
          "component": "WorkOrderAuditDetail.vue",
          "title": "工单审核详情",
          "default": false
        },
        {
          "path": "/dispatch/ship-monitoring",
          "component": "ShipMonitoringOverview.vue",
          "title": "船舶监控总览",
          "default": false
        },
        {
          "path": "/dispatch/ship-detail",
          "component": "ShipDetailBoard.vue",
          "title": "船舶详情",
          "default": false
        },
        {
          "path": "/dispatch/command-editor",
          "component": "DispatchCommandEditor.vue",
          "title": "调度指令编辑",
          "default": false
        }
      ]
    },
    {
      "group": "任务执行",
      "icon": "🔧",
      "routes": [
        {
          "path": "/task/work-order-list",
          "component": "MobileWorkOrderList.vue",
          "title": "待办工单",
          "default": true
        },
        {
          "path": "/task/work-order-detail",
          "component": "MobileWorkOrderDetail.vue",
          "title": "工单详情",
          "default": false
        },
        {
          "path": "/task/work-order-execute",
          "component": "MobileWorkOrderExecute.vue",
          "title": "工单执行",
          "default": false
        },
        {
          "path": "/task/sync-status",
          "component": "MobileSyncStatus.vue",
          "title": "同步状态",
          "default": false
        },
        {
          "path": "/task/inventory-workbench",
          "component": "InventoryWorkbench.vue",
          "title": "库存工作台",
          "default": false
        },
        {
          "path": "/task/barcode-scan",
          "component": "BarcodeScanInventory.vue",
          "title": "扫码盘点",
          "default": false
        },
        {
          "path": "/task/material-requisition",
          "component": "MaterialRequisition.vue",
          "title": "领料申请",
          "default": false
        },
        {
          "path": "/task/material-return",
          "component": "MaterialReturn.vue",
          "title": "退料操作",
          "default": false
        },
        {
          "path": "/task/data-sync-detail",
          "component": "DataSyncDetail.vue",
          "title": "同步详情",
          "default": false
        }
      ]
    },
    {
      "group": "数据协同",
      "icon": "📡",
      "routes": [
        {
          "path": "/collaboration/data-sync-manager",
          "component": "DataSyncManager.vue",
          "title": "同步管理",
          "default": true
        },
        {
          "path": "/collaboration/sync-task-list",
          "component": "SyncTaskList.vue",
          "title": "同步任务列表",
          "default": false
        },
        {
          "path": "/collaboration/sync-task-detail",
          "component": "SyncTaskDetail.vue",
          "title": "同步任务详情",
          "default": false
        },
        {
          "path": "/collaboration/sync-report",
          "component": "SyncReport.vue",
          "title": "同步报告",
          "default": false
        },
        {
          "path": "/collaboration/procurement-review",
          "component": "ProcurementRequirementReview.vue",
          "title": "采购需求审核",
          "default": false
        },
        {
          "path": "/collaboration/procurement-order-tracking",
          "component": "ProcurementOrderTracking.vue",
          "title": "采购订单跟踪",
          "default": false
        },
        {
          "path": "/collaboration/goods-receipt",
          "component": "GoodsReceiptAndInspection.vue",
          "title": "到货验收",
          "default": false
        }
      ]
    },
    {
      "group": "系统管理",
      "icon": "⚙️",
      "routes": [
        {
          "path": "/admin/user-manager",
          "component": "UserManager.vue",
          "title": "用户管理",
          "default": true
        },
        {
          "path": "/admin/role-permission",
          "component": "RolePermissionManager.vue",
          "title": "角色权限",
          "default": false
        },
        {
          "path": "/admin/workflow-designer",
          "component": "WorkflowDesigner.vue",
          "title": "流程设计器",
          "default": false
        },
        {
          "path": "/admin/config-simulation",
          "component": "ConfigSimulation.vue",
          "title": "配置模拟",
          "default": false
        },
        {
          "path": "/admin/audit-log",
          "component": "AuditLogView.vue",
          "title": "审计日志",
          "default": false
        },
        {
          "path": "/admin/monitor-dashboard",
          "component": "SysMonitorDashboard.vue",
          "title": "系统监控",
          "default": false
        },
        {
          "path": "/admin/alert-management",
          "component": "AlertManagement.vue",
          "title": "告警管理",
          "default": false
        },
        {
          "path": "/admin/audit-log-search",
          "component": "AuditLogSearch.vue",
          "title": "日志检索",
          "default": false
        },
        {
          "path": "/admin/report-generator",
          "component": "ReportGenerator.vue",
          "title": "报告生成",
          "default": false
        },
        {
          "path": "/admin/audit-log-workspace",
          "component": "AuditLogWorkspace.vue",
          "title": "审计工作台",
          "default": false
        }
      ]
    }
  ],
  "componentFiles": [
    {
      "file": "AssetTree.vue",
      "responsibility": "通用设备资产树组件，支持层级展开/收起、节点选中、过滤筛选，适用于设备列表及其状态概览场景。",
      "reusedBy": [
        "MaintenancePlanWorkbench.vue",
        "PlanEditor.vue",
        "WorkOrderAuditList.vue"
      ],
      "props": [
        {
          "name": "nodes",
          "type": "Array",
          "required": true,
          "default": "[]",
          "description": "树节点数据，每个节点包含 id, label, children, status 等字段"
        },
        {
          "name": "selectedId",
          "type": "String",
          "required": false,
          "default": "null",
          "description": "当前选中节点的 ID，用于高亮"
        },
        {
          "name": "filter",
          "type": "String",
          "required": false,
          "default": "''",
          "description": "节点过滤关键字，实时过滤匹配节点"
        },
        {
          "name": "loading",
          "type": "Boolean",
          "required": false,
          "default": "false",
          "description": "是否处于加载中状态"
        },
        {
          "name": "error",
          "type": "Boolean",
          "required": false,
          "default": "false",
          "description": "数据加载是否出错"
        }
      ],
      "events": [
        {
          "name": "node-click",
          "payload": "node: Object",
          "description": "点击节点时触发，返回节点数据"
        },
        {
          "name": "node-expand",
          "payload": "node: Object",
          "description": "展开节点时触发"
        },
        {
          "name": "node-collapse",
          "payload": "node: Object",
          "description": "收起节点时触发"
        },
        {
          "name": "filter-change",
          "payload": "value: String",
          "description": "过滤输入变化时触发，返回当前过滤文本"
        }
      ],
      "slots": []
    },
    {
      "file": "FilterBar.vue",
      "responsibility": "通用筛选栏组件，支持配置多个筛选字段、搜索/重置操作，适用于列表页面的条件筛选场景。",
      "reusedBy": [
        "PlanApproval.vue",
        "WorkOrderAuditList.vue",
        "DataSyncManager.vue",
        "SyncTaskList.vue",
        "AuditLogSearch.vue",
        "AlertManagement.vue",
        "ProcurementRequirementReview.vue"
      ],
      "props": [
        {
          "name": "filters",
          "type": "Array",
          "required": true,
          "default": "[]",
          "description": "筛选配置项数组，每项包含 name、label、type（text/select/date-range等）、options（可选）"
        },
        {
          "name": "modelValue",
          "type": "Object",
          "required": true,
          "default": "{}",
          "description": "当前筛选值对象，键为筛选字段 name"
        },
        {
          "name": "loading",
          "type": "Boolean",
          "required": false,
          "default": "false",
          "description": "是否处于搜索加载中状态"
        }
      ],
      "events": [
        {
          "name": "update:modelValue",
          "payload": "newModel: Object",
          "description": "筛选值变化时触发，用于 v-model 双向绑定"
        },
        {
          "name": "search",
          "payload": "",
          "description": "点击搜索按钮时触发，父组件执行查询"
        },
        {
          "name": "reset",
          "payload": "",
          "description": "点击重置按钮时触发，清空所有筛选值"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "用于插入自定义筛选控件或额外按钮"
        }
      ]
    },
    {
      "file": "StatusBadge.vue",
      "responsibility": "通用状态标签组件，显示不同状态对应的颜色和文字标签，支持自定义样式。",
      "reusedBy": [
        "PlanApproval.vue",
        "WorkOrderAuditList.vue",
        "WorkOrderAuditDetail.vue",
        "SyncTaskList.vue",
        "ShipDetailBoard.vue",
        "VoyageHealthDashboard.vue",
        "MobileWorkOrderList.vue",
        "AuditLogWorkspace.vue"
      ],
      "props": [
        {
          "name": "status",
          "type": "String",
          "required": true,
          "default": "",
          "description": "状态值，用于映射预设的颜色方案，如 'pending'/'approved'/'rejected'/'failed'"
        },
        {
          "name": "label",
          "type": "String",
          "required": false,
          "default": "",
          "description": "显示的文本，若不传则自动根据 status 映射默认标签"
        },
        {
          "name": "type",
          "type": "String",
          "required": false,
          "default": "primary",
          "description": "颜色主题：primary / success / warning / danger / info"
        },
        {
          "name": "size",
          "type": "String",
          "required": false,
          "default": "default",
          "description": "尺寸：small / default / large"
        }
      ],
      "events": [
        {
          "name": "click",
          "payload": "event: Event",
          "description": "点击标签时触发，用于快速筛选等交互"
        }
      ],
      "slots": []
    },
    {
      "file": "FileUploader.vue",
      "responsibility": "通用文件/附件上传组件，支持拍照、相册选择、预览、删除，可限制文件类型和大小。",
      "reusedBy": [
        "MobileWorkOrderExecute.vue",
        "GoodsReceiptAndInspection.vue",
        "MaterialReturn.vue",
        "BarcodeScanInventory.vue",
        "ProcurementRequirementReview.vue"
      ],
      "props": [
        {
          "name": "accept",
          "type": "String",
          "required": false,
          "default": "'image/*,video/*'",
          "description": "允许的文件类型，参考 HTML input accept 属性"
        },
        {
          "name": "multiple",
          "type": "Boolean",
          "required": false,
          "default": "true",
          "description": "是否允许上传多个文件"
        },
        {
          "name": "maxSize",
          "type": "Number",
          "required": false,
          "default": "10485760",
          "description": "单个文件最大字节数，默认 10MB"
        },
        {
          "name": "fileList",
          "type": "Array",
          "required": true,
          "default": "[]",
          "description": "已上传文件列表，每项包含 id、name、url、type、size 等"
        },
        {
          "name": "readonly",
          "type": "Boolean",
          "required": false,
          "default": "false",
          "description": "是否为只读模式（仅查看和预览，不允许上传/删除）"
        }
      ],
      "events": [
        {
          "name": "upload",
          "payload": "file: File",
          "description": "选择文件后触发上传逻辑，父组件处理后更新 fileList"
        },
        {
          "name": "preview",
          "payload": "file: Object",
          "description": "点击预览时触发，返回文件对象"
        },
        {
          "name": "delete",
          "payload": "file: Object",
          "description": "删除文件时触发，返回需删除的文件对象"
        },
        {
          "name": "error",
          "payload": "error: { code: String, message: String }",
          "description": "文件校验失败或上传出错时触发"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "自定义触发按钮区域，例如图片上传占位符"
        }
      ]
    },
    {
      "file": "ApprovalActions.vue",
      "responsibility": "通用审批操作组件，提供通过、驳回按钮及审批意见输入，常用于审核流程页面。",
      "reusedBy": [
        "PlanApproval.vue",
        "WorkOrderAuditDetail.vue"
      ],
      "props": [
        {
          "name": "allowApprove",
          "type": "Boolean",
          "required": false,
          "default": "true",
          "description": "是否显示通过按钮"
        },
        {
          "name": "allowReject",
          "type": "Boolean",
          "required": false,
          "default": "true",
          "description": "是否显示驳回按钮"
        },
        {
          "name": "approveDisabled",
          "type": "Boolean",
          "required": false,
          "default": "false",
          "description": "通过按钮是否禁用"
        },
        {
          "name": "rejectDisabled",
          "type": "Boolean",
          "required": false,
          "default": "false",
          "description": "驳回按钮是否禁用"
        },
        {
          "name": "loading",
          "type": "Boolean",
          "required": false,
          "default": "false",
          "description": "操作是否正在提交中"
        },
        {
          "name": "commentRequired",
          "type": "Boolean",
          "required": false,
          "default": "true",
          "description": "驳回时意见是否必填"
        }
      ],
      "events": [
        {
          "name": "approve",
          "payload": "reason: String",
          "description": "点击通过按钮时触发，返回通过意见（可选）"
        },
        {
          "name": "reject",
          "payload": "reason: String",
          "description": "点击驳回按钮时触发，返回驳回意见"
        }
      ],
      "slots": [
        {
          "name": "extra",
          "description": "在按钮组右侧或下方插入额外操作按钮"
        }
      ]
    },
    {
      "file": "DiffView.vue",
      "responsibility": "差异对比组件，以并排或内联方式展示两个版本的变更内容，高亮新增、删除、修改字段。",
      "reusedBy": [
        "PlanApproval.vue",
        "SyncTaskDetail.vue",
        "AuditLogWorkspace.vue"
      ],
      "props": [
        {
          "name": "left",
          "type": "Object",
          "required": true,
          "default": "",
          "description": "旧版本数据对象"
        },
        {
          "name": "right",
          "type": "Object",
          "required": true,
          "default": "",
          "description": "新版本数据对象"
        },
        {
          "name": "fields",
          "type": "Array",
          "required": false,
          "default": "null",
          "description": "指定要对比的字段列表，不传则对比所有字段"
        },
        {
          "name": "mode",
          "type": "String",
          "required": false,
          "default": "'side-by-side'",
          "description": "对比模式：'side-by-side'（并排）或 'inline'（内联）"
        },
        {
          "name": "resolveMode",
          "type": "Boolean",
          "required": false,
          "default": "false",
          "description": "是否启用冲突解决模式（允许用户选择采用哪边版本）"
        }
      ],
      "events": [
        {
          "name": "resolve",
          "payload": "{ field: String, selectedVersion: 'left' | 'right' }",
          "description": "冲突解决模式下用户选择版本时触发"
        }
      ],
      "slots": []
    },
    {
      "file": "ConfirmationDialog.vue",
      "responsibility": "通用确认弹窗组件，用于二次确认操作，支持自定义标题、内容、按钮文本和类型。",
      "reusedBy": [
        "UserManager.vue",
        "RolePermissionManager.vue",
        "WorkOrderAuditDetail.vue",
        "DispatchCommandEditor.vue",
        "ConfigSimulation.vue",
        "BarcodeScanInventory.vue",
        "MaterialRequisition.vue",
        "MaterialReturn.vue"
      ],
      "props": [
        {
          "name": "visible",
          "type": "Boolean",
          "required": true,
          "default": "false",
          "description": "是否显示弹窗"
        },
        {
          "name": "title",
          "type": "String",
          "required": false,
          "default": "'确认操作'",
          "description": "弹窗标题"
        },
        {
          "name": "message",
          "type": "String",
          "required": false,
          "default": "'您确定要执行此操作吗？'",
          "description": "弹窗提示内容"
        },
        {
          "name": "confirmText",
          "type": "String",
          "required": false,
          "default": "'确定'",
          "description": "确认按钮文本"
        },
        {
          "name": "cancelText",
          "type": "String",
          "required": false,
          "default": "'取消'",
          "description": "取消按钮文本"
        },
        {
          "name": "loading",
          "type": "Boolean",
          "required": false,
          "default": "false",
          "description": "确认操作是否处理中（按钮显示加载状态）"
        },
        {
          "name": "type",
          "type": "String",
          "required": false,
          "default": "'info'",
          "description": "弹窗类型：info / warning / danger，影响图标和按钮颜色"
        }
      ],
      "events": [
        {
          "name": "confirm",
          "payload": "",
          "description": "点击确认按钮时触发"
        },
        {
          "name": "cancel",
          "payload": "",
          "description": "点击取消按钮或关闭弹窗时触发"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "自定义弹窗内容区域，覆盖 message 属性"
        }
      ]
    }
  ],
  "mockDataFiles": [
    {
      "file": "mockOps.js",
      "content": "模拟运维管理相关数据，包括设备维保计划、航前健康检查、工单执行跟踪等接口的响应数据。",
      "usedBy": [
        "MaintenancePlanWorkbench.vue",
        "PlanEditor.vue",
        "PlanApproval.vue",
        "VoyageHealthTrigger.vue",
        "VoyageHealthDashboard.vue",
        "VoyageHealthIssueDetail.vue",
        "VoyageHealthReports.vue",
        "WorkOrderAuditList.vue",
        "WorkOrderAuditDetail.vue",
        "MobileWorkOrderList.vue",
        "MobileWorkOrderDetail.vue",
        "MobileWorkOrderExecute.vue"
      ],
      "schema": [
        {
          "field": "equipmentTree",
          "type": "array",
          "description": "设备资产树列表，每个节点包含 id、name、children、planStatus（计划状态）、stats（统计信息）等字段"
        },
        {
          "field": "maintenancePlans",
          "type": "array",
          "description": "预防性维护计划列表，每个计划包含 id、equipmentIds、planType、cycleValue、cycleUnit、startDate、advanceWarningDays、priority、status 等"
        },
        {
          "field": "approvals",
          "type": "array",
          "description": "审批申请列表，每个申请包含 id、applicant、planId、action、comment、status、history（历史记录）等"
        },
        {
          "field": "voyageHealthChecks",
          "type": "array",
          "description": "航前健康检查记录列表，每个记录包含 checkId、shipId、status、score、interceptStatus、issueCount、summary 等"
        },
        {
          "field": "voyageHealthIssues",
          "type": "array",
          "description": "健康检查不通过项列表，每项包含 issueId、checkId、severity、relatedObject、expireDate、disposalProgress 等"
        },
        {
          "field": "workOrders",
          "type": "array",
          "description": "工单列表，每个工单包含 id、type、status、priority、shipId、equipmentId、planDate、reportData 等"
        },
        {
          "field": "auditLogs",
          "type": "array",
          "description": "操作审计日志列表（用于审批日志），包含 id、operator、action、objectType、timestamp 等"
        }
      ]
    },
    {
      "file": "mockVessel.js",
      "content": "模拟船舶运行监控与调度指令相关数据，包括船舶状态、单船详情、调度指令等接口的响应数据。",
      "usedBy": [
        "ShipMonitoringOverview.vue",
        "ShipDetailBoard.vue",
        "DispatchCommandEditor.vue"
      ],
      "schema": [
        {
          "field": "vessels",
          "type": "array",
          "description": "船舶列表，每个船舶包含 id、name、position（经纬度）、speed、operationalStatus、communicationStatus、route 等"
        },
        {
          "field": "vesselDetail",
          "type": "object",
          "description": "单船运行详情，包含 currentVoyage（航次信息）、workOrderProgress、healthCheckResult、certificateAlerts 等"
        },
        {
          "field": "dispatchCommands",
          "type": "array",
          "description": "调度指令列表，每个指令包含 id、vesselId、voyageNumber、departureTime、estimatedArrivalTime、route、taskRequirements、status 等"
        }
      ]
    },
    {
      "file": "mockSync.js",
      "content": "模拟数据同步管理相关数据，包括同步概览、同步任务列表、冲突解决、同步审计日志等接口的响应数据。",
      "usedBy": [
        "DataSyncManager.vue",
        "SyncTaskList.vue",
        "SyncTaskDetail.vue",
        "SyncReport.vue",
        "MobileSyncStatus.vue",
        "DataSyncDetail.vue"
      ],
      "schema": [
        {
          "field": "syncShipmentsSummary",
          "type": "array",
          "description": "船舶同步状态概览，每项包含 shipId、syncStatus（normal/abnormal/unsynced）、lastSyncTime、taskCount 等"
        },
        {
          "field": "syncTasks",
          "type": "array",
          "description": "同步任务列表，每个任务包含 taskId、shipId、type、status、startTime、endTime、retryCount 等"
        },
        {
          "field": "conflicts",
          "type": "array",
          "description": "冲突记录列表，每个冲突包含 conflictId、workOrderId、fieldDifferences、resolveStatus、boatVersion、shoreVersion 等"
        },
        {
          "field": "syncAuditLogs",
          "type": "array",
          "description": "同步审计日志列表，每条日志包含 id、shipId、actionType、operator、timestamp、detail 等"
        },
        {
          "field": "syncStatusOverview",
          "type": "object",
          "description": "当前船舶同步状态总览，包含 networkStatus、pendingCount、lastSyncTime、storageUsage 等"
        }
      ]
    },
    {
      "file": "mockInventory.js",
      "content": "模拟物资库存管理相关数据，包括工作台概览、盘点差异、领料单、退料单、验收记录等接口的响应数据。",
      "usedBy": [
        "InventoryWorkbench.vue",
        "BarcodeScanInventory.vue",
        "MaterialRequisition.vue",
        "MaterialReturn.vue",
        "GoodsReceiptAndInspection.vue"
      ],
      "schema": [
        {
          "field": "inventoryWorkbench",
          "type": "object",
          "description": "工作台概览数据，包含 pendingTasks（按盘点/领料/退料分组）、syncProgress、recentOperations、networkStatus 等"
        },
        {
          "field": "physicalCountRecords",
          "type": "array",
          "description": "盘点差异记录列表，每条记录包含 taskId、userId、barcode、materialCode、systemInventory、actualQuantity、attachmentMedia 等"
        },
        {
          "field": "requisitionOrders",
          "type": "array",
          "description": "领料单列表，每个领料单包含 orderId、materialCode、quantity、purpose、relatedOrder、status 等"
        },
        {
          "field": "returnOrders",
          "type": "array",
          "description": "退料单列表，每个退料单包含 orderId、materialCode、returnQuantity、returnReason、remark、status 等"
        },
        {
          "field": "inspectionRecords",
          "type": "array",
          "description": "验收记录列表，每个记录包含 inspectionId、orderId、items、inspectionConclusion、defectReason、result（入库/退换货状态）等"
        }
      ]
    },
    {
      "file": "mockSystem.js",
      "content": "模拟系统管理相关数据，包括用户、角色、流程定义、配置发布、审计日志、系统监控、报告生成、采购订单等接口的响应数据。",
      "usedBy": [
        "UserManager.vue",
        "RolePermissionManager.vue",
        "WorkflowDesigner.vue",
        "ConfigSimulation.vue",
        "AuditLogView.vue",
        "SysMonitorDashboard.vue",
        "AlertManagement.vue",
        "AuditLogSearch.vue",
        "ReportGenerator.vue",
        "AuditLogWorkspace.vue",
        "ProcurementRequirementReview.vue",
        "ProcurementOrderTracking.vue"
      ],
      "schema": [
        {
          "field": "users",
          "type": "array",
          "description": "用户列表，每个用户包含 id、account、name、department、role、status 等"
        },
        {
          "field": "roles",
          "type": "array",
          "description": "角色列表，每个角色包含 roleId、roleName、description、permissions（权限树）等"
        },
        {
          "field": "workflows",
          "type": "array",
          "description": "流程定义列表，每个流程包含 processType、canvasData、approvers、timeoutRule、versionLabel 等"
        },
        {
          "field": "auditLogs",
          "type": "array",
          "description": "审计日志列表（系统级），每条日志包含 id、operator、operationType、objectType、detail、timestamp 等"
        },
        {
          "field": "monitorOverview",
          "type": "object",
          "description": "系统运行状态总览，包含 healthScore、keyIndicators、alertSummary、moduleMetrics 等"
        },
        {
          "field": "alerts",
          "type": "array",
          "description": "告警列表，每个告警包含 alertId、severity、type、message、occurTime、status 等"
        },
        {
          "field": "procurementOrders",
          "type": "array",
          "description": "采购订单列表，每个订单包含 orderNo、supplier、status、items、expectedDelivery、attachmentFileIds 等"
        },
        {
          "field": "reports",
          "type": "array",
          "description": "报告生成记录，每个报告包含 taskId、templateId、status、progress、downloadUrl 等"
        }
      ]
    }
  ],
  "generationPlan": [
    {
      "step": 1,
      "title": "生成 Mock 数据",
      "description": "先生成所有页面的 mock 数据文件和枚举常量，确保后续组件有数据可展示。"
    },
    {
      "step": 2,
      "title": "生成通用组件",
      "description": "按组件接口契约生成 StatusTag、DataTable、MetricCard 等可复用组件。"
    },
    {
      "step": 3,
      "title": "生成页面（按优先级）",
      "description": "先 P0 核心页面（调度看板、任务列表），再 P1 重要页面（入场核验、统计分析），最后 P2 辅助页面。"
    },
    {
      "step": 4,
      "title": "生成路由和 API 层",
      "description": "配置 vue-router 路由表，创建 api/ 目录下的请求封装。"
    }
  ],
  "stepPrompts": [
    {
      "step": 1,
      "title": "生成 Mock 数据和枚举常量",
      "prompt": "请根据以下 mock 数据文件定义，生成完整的 mock 数据文件（每个文件为独立的 JavaScript 模块，导出模拟数据对象），并生成项目中使用的所有枚举常量文件（如常量状态码、状态标签映射、类型定义等）。\n\nMock 文件清单：\n- mockOps.js：模拟运维管理相关数据，包括设备维保计划、航前健康检查、工单执行跟踪等接口的响应数据。\n- mockVessel.js：模拟船舶运行监控与调度指令相关数据，包括船舶状态、单船详情、调度指令等。\n- mockSync.js：模拟数据同步管理相关数据，包括同步概览、同步任务列表、冲突解决、同步审计日志等。\n- mockInventory.js：模拟物资库存管理相关数据，包括工作台概览、盘点差异、领料单、退料单、验收记录等。\n- mockSystem.js：模拟系统管理相关数据，包括用户、角色、流程定义、配置发布、审计日志、系统监控、报告生成、采购订单等。\n\n枚举常量文件建议：\n- enums/planStatus.js （计划状态枚举：未制定、审核中、已生效、即将到期、已过期）\n- enums/workOrderStatus.js （工单状态枚举：待执行、执行中、已完成、需整改、已闭环）\n- enums/syncStatus.js （同步状态枚举：待同步、同步中、已完成、失败、冲突）\n- enums/healthCheckStatus.js （健康校验状态枚举：通过、不通过、待检查）\n- enums/alertSeverity.js （告警严重程度枚举：紧急、主要、次要、提示）\n- enums/approvalAction.js （审批操作枚举：通过、驳回）\n\n关键技术约束：\n- 所有 mock 数据必须符合每个 schema 定义的字段和类型。\n- 数据需包含足够丰富的样本（每个列表至少 10 条记录），且涵盖正常、边界、异常情况。\n- 使用 ES Module 导出（export const ...）。\n- 枚举常量使用 const objects 并添加注释说明用途。\n\n验收标准：\n1. 每个 mock 文件导出的数据对象可以直接被页面引用并模拟 API 响应。\n2. 枚举常量文件在所有页面中可以 import 并用于状态绑定与展示。\n3. mock 数据中的日期字段使用 ISO 8601 格式。\n4. 数据关系与业务逻辑一致（例如工单的 equipmentId 应存在于设备树中）。\n5. 所有文件放置在 /src/mock/ 目录下，枚举放置在 /src/enums/ 目录下。"
    },
    {
      "step": 2,
      "title": "生成通用组件",
      "prompt": "请根据以下通用组件定义，生成对应的 Vue 组件文件（使用 Vue 3 Composition API + <script setup> 语法）。每个组件需独立文件，并满足指定的 props、events、slots 接口。组件应支持响应式、无障碍访问（ARIA）和基本的加载状态、空状态、错误状态。\n\n组件清单：\n1. AssetTree.vue：通用设备资产树组件，支持层级展开/收起、节点选中、过滤筛选、loading/error/empty 状态。\n2. FilterBar.vue：通用筛选栏组件，支持配置多个筛选字段（文本、下拉、日期范围）、搜索/重置操作。\n3. StatusBadge.vue：通用状态标签组件，显示不同状态对应的颜色和文字标签，支持自定义样式。\n4. FileUploader.vue：通用文件/附件上传组件，支持拍照、相册选择、预览、删除，可限制文件类型和大小，支持多选。\n5. ApprovalActions.vue：通用审批操作组件，提供通过、驳回按钮及审核意见输入，支持 loading 和必填校验。\n6. DiffView.vue：差异对比组件，以并排或内联方式展示两个版本的变更内容，高亮新增/删除/修改字段，可选冲突解决模式。\n7. ConfirmationDialog.vue：通用确认弹窗组件，用于二次确认操作，支持自定义标题、内容、按钮文本和类型（info/warning/danger）。\n\n关键技术约束：\n- 使用 TypeScript 定义 props 类型（使用 defineProps 与 PropType）。\n- 组件样式使用 scoped CSS，并遵循项目统一的命名规范（如 BEM）。\n- 所有交互事件通过 emit 触发。\n- 组件内部需包含完整的 load/empty/error 状态处理逻辑（如 loading 时禁用交互、error 时显示重试按钮等）。\n- 组件应具备良好的可访问性（如 keyboard events、aria-labels）。\n\n验收标准：\n1. 每个组件文件放置在 /src/components/common/ 目录下。\n2. 组件在 Storybook 或单独测试页面中能正确渲染各种状态。\n3. 所有 props 和 events 类型完整，与原型设计中的定义一致。\n4. 组件无未处理的异常情况，边界输入（空数组、null、undefined）不会导致崩溃。"
    },
    {
      "step": 3,
      "title": "生成页面（按优先级 P0→P1→P2）",
      "prompt": "请根据以下页面清单和对应的 pageSpecs 定义，生成所有页面的 Vue 3 组件文件。按优先级依次生成：先 P0 页面，再 P1 页面，最后 P2 页面（如有）。每个页面需完全实现 zones、states、keyInteractions 中描述的功能。\n\nP0 页面清单（共 16 个）：\n- MaintenancePlanWorkbench.vue\n- PlanEditor.vue\n- PlanApproval.vue\n- VoyageHealthTrigger.vue\n- VoyageHealthDashboard.vue\n- VoyageHealthIssueDetail.vue\n- WorkOrderAuditList.vue\n- WorkOrderAuditDetail.vue\n- ShipMonitoringOverview.vue\n- ShipDetailBoard.vue\n- DispatchCommandEditor.vue\n- DataSyncManager.vue\n- SyncTaskList.vue\n- SyncTaskDetail.vue\n- MobileWorkOrderList.vue\n- MobileWorkOrderDetail.vue\n- MobileWorkOrderExecute.vue\n- MobileSyncStatus.vue\n- InventoryWorkbench.vue\n- BarcodeScanInventory.vue\n- MaterialRequisition.vue\n- MaterialReturn.vue\n- DataSyncDetail.vue\n- UserManager.vue\n- RolePermissionManager.vue\n- WorkflowDesigner.vue\n- ConfigSimulation.vue\n- AuditLogView.vue\n- SysMonitorDashboard.vue\n- AlertManagement.vue\n- AuditLogSearch.vue\n- ReportGenerator.vue\n- AuditLogWorkspace.vue\n- ProcurementRequirementReview.vue\n- ProcurementOrderTracking.vue\n- GoodsReceiptAndInspection.vue\n\nP1 页面清单：\n- VoyageHealthReports.vue\n- SyncReport.vue\n- ConfigSimulation.vue （已算入P0？此处确认：ConfigSimulation为P1，故单独列出）\n- ReportGenerator.vue （P1）\n- ProcurementOrderTracking.vue （P1）\n\n（注：上述清单中部分页面同时出现在P0和P1，请以原始JSON中priority字段为准：P0的页面包括所有priority为P0的页面，P1为priority为P1的页面。请重新核对原始JSON中每个页面的priority字段，并严格按照顺序生成。如果某个页面在原始中为P0，则在P0步骤生成；如果为P1，则在P1步骤生成。例如：VoyageHealthReports为P1，SyncReport为P1，ConfigSimulation为P1，ReportGenerator为P1，ProcurementOrderTracking为P1。InventoryWorkbench为P1。）\n\n关键技术约束：\n- 每个页面文件放置在 /src/pages/ 目录下，按业务模块创建子目录（如 /dispatch, /task, /collaboration, /admin）。\n- 使用 Composition API + <script setup>，并引入必要的通用组件（如 StatusBadge, FilterBar, ConfirmationDialog 等）。\n- 页面内的 zones 布局推荐使用 CSS Grid 或 Flexbox，确保响应式。\n- 每个状态（empty/loading/success/error）必须实现对应的 UI 展示，使用组件内状态变量控制。\n- 关键交互（点击、筛选、提交、跳转）必须绑定对应的事件处理函数，并在函数中调用模拟的 API（mock 数据直接 import 或通过异步延迟返回）。\n- 移动端页面（MobileWorkOrderList, MobileWorkOrderDetail, MobileWorkOrderExecute, MobileSyncStatus, InventoryWorkbench, BarcodeScanInventory, MaterialRequisition, MaterialReturn, DataSyncDetail）需适配移动端屏幕，支持 touch 事件和离线缓存逻辑（使用 localStorage 或 IndexedDB 模拟）。\n\n验收标准：\n1. 每个页面在浏览器中独立打开时，根据状态显示正确的 UI，并能完成所有关键交互流程。\n2. 页面中的筛选、排序、分页等功能正常工作。\n3. 页面与通用组件之间的数据流（props/events）正确。\n4. 移动端页面能在 Chrome DevTools 移动端模拟器中正常显示和操作。\n5. 所有页面加载时优先显示 loading 状态，数据到达后切换为 success 状态，错误时显示 error 状态。"
    },
    {
      "step": 4,
      "title": "生成路由配置和 API 调用层",
      "prompt": "请根据 navigationRoutes 和 apiMapping 定义，生成项目的路由配置文件（router/index.js 或 router/index.ts）和 API 调用层文件（位于 /src/api/ 目录下）。\n\n路由配置要求：\n- 使用 vue-router 4.x（createRouter, createWebHashHistory）。\n- 按照 navigationRoutes 中的 group 划分模块，每个 group 下的 routes 作为子路由，但为了简单可平铺为一级路由（除移动端需单独考虑）。移动端页面建议单独分组，路径前加 /mobile 前缀（如 /mobile/task/work-order-list）。\n- 为每个路由指定 component 的懒加载（() => import(...)）。\n- 设置默认路由（default: true 的页面作为组内首页）。\n- 添加全局导航守卫（例如检查登录状态，但当前阶段可暂用空函数）。\n\nAPI 调用层要求：\n- 每个页面涉及的外部 API 调用，需在 /src/api/ 目录下按模块创建文件（如 ops.js, vessel.js, sync.js, inventory.js, system.js）。\n- 每个 API 函数使用 axios 或 fetch 封装，基础 URL 从环境变量读取（process.env.VUE_APP_API_BASE_URL 或 import.meta.env.VITE_API_BASE_URL）。\n- 函数签名应包含必要的参数和返回类型（使用 JSDoc 或 TypeScript）。\n- 对于当前原型阶段，所有 API 调用应优先返回 mock 数据（即直接导入步骤1生成的 mock 数据文件），并包裹在 setTimeout 模拟异步延迟（300-800ms）。\n- 需实现统一的请求异常处理（在响应拦截器中处理错误码并抛出友好异常）。\n\n关键技术约束：\n- 路由文件路径为 /src/router/index.js。\n- API 文件命名与 mock 数据文件对应（注意不要与 mock 混淆，API 文件调用 mock 数据）。\n- 使用 ES Module 导出。\n- 路由配置中需为每个路由添加 name 和 meta（如 title, icon, group）。\n\n验收标准：\n1. 路由配置正确，浏览器访问对应路径能跳转到相应的页面组件。\n2. 点击页面中的交互（如跳转、保存、提交）时，通过 API 层调用返回 mock 数据，且页面正确更新状态。\n3. API 层函数在调用时触发 loading 状态，mock 延迟结束后返回数据。\n4. 错误情况（如手动将 mock 数据置空或抛出异常）能触发 error 状态并显示错误提示。\n5. 所有 API 函数命名遵循 restful 风格（例如 getWorkOrders, createWorkOrder）。"
    }
  ],
  "implementationDefaults": {
    "projectStructure": {
      "description": "基于 Vue3 + Vite 的前端项目目录结构",
      "tree": [
        "frontend/",
        "├── index.html",
        "├── package.json",
        "├── vite.config.js",
        "└── src/",
        "    ├── App.vue                    # 根组件 + 路由出口",
        "    ├── main.js                   # createApp + router + 全局样式",
        "    ├── style.css                 # 全局样式变量和基础重置",
        "    ├── router/",
        "    │   └── index.js              # vue-router 路由配置",
        "    ├── views/                    # 页面组件（按业务场景组织）",
        "    ├── components/               # 通用组件（按功能类型组织）",
        "    └── data/                     # Mock 数据 + 常量枚举"
      ]
    },
    "styleGuide": {
      "colorTokens": [
        {
          "name": "--color-primary",
          "value": "#1a73e8",
          "usage": "主色：按钮、链接、选中态"
        },
        {
          "name": "--color-success",
          "value": "#0d904f",
          "usage": "成功状态：完成、通过"
        },
        {
          "name": "--color-warning",
          "value": "#f5a623",
          "usage": "警告状态：待处理、注意"
        },
        {
          "name": "--color-danger",
          "value": "#d93025",
          "usage": "危险/错误：告警、拒绝、异常"
        },
        {
          "name": "--color-bg",
          "value": "#f5f6fa",
          "usage": "页面背景色"
        },
        {
          "name": "--color-surface",
          "value": "#ffffff",
          "usage": "卡片/面板背景色"
        },
        {
          "name": "--color-text",
          "value": "#1f1f1f",
          "usage": "主要文字"
        },
        {
          "name": "--color-text-secondary",
          "value": "#5f6368",
          "usage": "次要文字/说明"
        },
        {
          "name": "--color-border",
          "value": "#e0e0e0",
          "usage": "边框/分割线"
        }
      ],
      "spacing": "4px 步长，常用 8px / 12px / 16px / 24px / 32px",
      "fontSize": "12px 说明文字 / 14px 正文 / 16px 标题 / 20px 大标题",
      "breakpoints": [
        {
          "name": "mobile",
          "value": "< 768px"
        },
        {
          "name": "tablet",
          "value": "768px - 1024px"
        },
        {
          "name": "desktop",
          "value": "> 1024px"
        }
      ],
      "componentNaming": "PascalCase 文件名，kebab-case 路由路径",
      "vueConvention": "单文件组件 .vue，Options API 或 Composition API（推荐 <script setup>）"
    }
  },
  "savedAt": "2026-07-07T00:26:09.570Z",
  "scenarioPageSnapshotKey": "v1:5dcbdda1:82273",
  "interactionApiSnapshotKey": "v1:61744c79:154143"
}
```
<!-- FDE_STEP_RESULT_JSON_END -->
