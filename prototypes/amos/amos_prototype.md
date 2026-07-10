# AMOS M&P Vue 原型系统生成规格

> 来源：`AMOS M&P Vrs.10.0.30 User Guide.pdf`  
> 手册页数：391 页  
> 适用目标：生成一个用于演示和业务沟通的 Vue 原型系统，而不是完整生产系统。  
> 说明：本规格仅依据该 M&P 用户手册提炼。手册主窗口截图中出现 Quality、Voyage、Crewing 等菜单，但本 PDF 正文主要展开 Maintenance、Stock、Purchase、Budget/Financials；未展开的菜单可在原型中保留入口或置灰。

## 1. 产品定位

AMOS M&P 是面向船舶、海工或多安装地点资产的维护、库存、采购与财务预算管理系统。核心对象包括：

- Installation / Department：安装地点、船舶或部门范围。
- Function：固定功能位置，例如主机系统、辅助锅炉等。
- Component：实际可安装、拆卸、维修、跟踪历史的实体设备。
- Component Type：组件类型模板，用于继承常用字段、备件、作业、计数器和测点。
- Maintenance Job：预防性或计划性维护任务。
- Work Order：维护任务的执行单。
- Stock Type / Stock Item：库存物料类型和具体库存实例。
- Purchasing Form：采购过程中的 Requisition、Query、Purchase Order。
- Delivery / Transport / Quality Check / Claim：采购交付、运输、质检和索赔过程。
- Budget / Voucher：预算、发票凭证与成本归集。

## 2. 原型设计原则

### 2.1 视觉风格

- 采用企业桌面系统风格：顶部菜单栏、工具栏、左侧快捷栏、主工作区、多窗口/标签页。
- 默认主色：浅蓝标题栏、浅灰面板、白色表单区、蓝色选中态。
- 表格优先，业务对象以“列表 + 明细标签页”方式展示。
- 保留传统 AMOS 的操作感：New、View、Delete、Save、Refresh、Print、Lookup、Options、OK、Cancel。

### 2.2 布局结构

```text
AppShell
├── TopTitleBar：系统名称、当前 Installation / Department、当前用户
├── MenuBar：File / Maintenance / Stock / Purchase / Budget / Tools / Window / Help
├── IconToolbar：常用图标按钮
├── OptionalLeftShortcutBar：Listbar 或 Iconbar
├── Workspace
│   ├── Dashboard
│   └── OpenedWindowTabs
└── StatusBar：Ready / 当前部门 / 同步状态
```

### 2.3 通用交互

- 所有业务窗口先弹出 Filter Dialog，用户点击 OK 后进入结果列表。
- 主业务窗口采用上方或左侧列表，下方或右侧明细标签页。
- 双击列表行打开详情。
- Lookup 按钮使用 `...` 或放大镜图标，打开选择弹窗。
- Options 菜单承载当前窗口的高级动作，例如 Generate Forms、Deliveries、Budget Breakdown。
- 保存时校验必填字段；若开启审计，弹出 Audit Trail Reason。
- 支持 F5/Refresh 刷新当前窗口。
- 支持 Select View，用于切换预定义过滤与列配置。

## 3. 顶层菜单结构

```yaml
menus:
  File:
    - Print
    - Lock Application
    - Save
    - Close Window
    - Exit
  Maintenance:
    - Dashboard Alerts
    - Component Types
    - Components
    - Components Hierarchy
    - Functions
    - Functions Hierarchy
    - Component Type Jobs
    - Component Jobs
    - Job Planning
    - Maintenance Rounds
    - Work Orders
    - Work Planning
    - Maintenance Tasks
    - Projects
    - Update Counters
    - Update Measure Points
    - Report Work
    - Maintenance History
    - Maintenance Log
  Stock:
    - Stock Types
    - Stock Items
    - Stock Wanted
    - In / Out of Stock
    - Stock Control
    - Location Inventory
    - Stock Transactions
    - Transfer Documents
    - Forecast Stock Requirements
  Purchase:
    - Forms
    - Requisitions
    - Queries
    - Quotations
    - Quotation Comparison
    - Purchase Orders
    - Deliveries
    - Transport Documents
    - Quality Checks
    - Claims
    - Contracts
    - Custom Clearance Contracts
    - Custom Clearance Forms
  Budget:
    - Budget
    - Budget Overview
    - Budget Specification
    - Budget Breakdown
    - Budget Prognosis
    - Budget Hierarchy
    - Vouchers
  Tools:
    - Options
    - Select View
    - Configuration
    - Switch Department
    - Global Search
    - License Update
  Window:
    - Cascade
    - Maximize
    - Open Windows
  Help:
    - User Guide
    - About
```

## 4. 通用组件清单

### 4.1 AppShell

- `AmosTopBar`
  - 显示系统名：`AMOS - AMOS Traveller/Maintenance`
  - 显示当前 Installation / Department
  - 显示登录用户和锁定按钮
- `AmosMenuBar`
  - 顶部横向菜单
  - 不可访问菜单置灰
- `AmosToolbar`
  - 图标按钮：New、Open、Save、Refresh、Print、Search、Select View、Dashboard、Options
- `AmosShortcutBar`
  - 支持 iconbar/listbar 两种模式
  - 显示 Maintenance、Stock、Purchase、Budget 常用入口
- `AmosWorkspace`
  - 支持 Dashboard 和多业务窗口 tab
- `AmosStatusBar`
  - 显示 Ready、当前部门、全局模式标记

### 4.2 业务窗口组件

- `FilterDialog`
  - Basic tab、Advanced tab
  - OK、Cancel、Select All、Clear
- `RecordList`
  - 支持排序、列宽拖拽、多选、搜索、右键菜单
- `RecordDetailTabs`
  - 表单标签页
  - 每个窗口可配置 tabs
- `LookupDialog`
  - 输入关键字后自动定位匹配项
  - OK 选择记录
- `AuditTrailReasonDialog`
  - 字段变更原因选择
  - Set Reason、OK
- `SelectViewDialog`
  - 切换预定义视图
- `GlobalSearchPanel`
  - 跨 Installation / Department 查询
- `SplitScrollbarTable`
  - 模拟 AMOS 的可分割横向滚动表格

## 5. Dashboard 首页

### 5.1 页面目标

显示用户关注的告警、工作流通知、网页或图片小组件，作为进入业务窗口的入口。

### 5.2 页面结构

```yaml
route: /dashboard
title: Dashboard
regions:
  - Alerts Overview
  - Notifications
  - Web Page Widget
  - Image Widget
  - Task/List/Icon Bar
```

### 5.3 Alerts Overview

字段：

- Alert Group：Maintenance、Purchase 等。
- Alert Name：例如 Overdue Maintenance Workorders、New Requisitions to be processed。
- Number：数量。
- Chart：条形图或饼图展示。

交互：

- 双击告警：打开相关业务窗口并自动带入过滤条件。
- 右键菜单：Refresh、Open、Print。
- 切换图表类型：条形图 / 饼图。

### 5.4 Notifications

字段：

- Module
- Number

交互：

- 双击模块名：打开 WorkFlow Notifications。
- 可通过 Tools > Options > Dashboard 隐藏或显示。

## 6. Maintenance 模块

### 6.1 模块目标

维护设备结构、维护任务、计划、工单、项目、计数器、测点、执行上报和历史记录。

### 6.2 Component Types 页面

```yaml
route: /maintenance/component-types
windowTitle: Component Types
tabs:
  - General
  - Jobs
  - Parts
  - Counters
  - Measure Points
  - Related
  - Components
actions:
  - New
  - Copy
  - Register as Component
  - View Job
  - Add Part
  - Copy List
```

关键字段：

- Type Number
- Name
- Maker
- Type
- Component Class
- Related Types
- Parts list
- Default jobs
- Counters / Measure Points

主要流程：定义组件类型

1. 进入 `Maintenance > Component Types`。
2. 点击 `New`。
3. 填写 Type Number、Name、Maker、Type、Class。
4. 在 Jobs、Parts、Counters、Measure Points 标签页维护默认内容。
5. 保存。

主要流程：将组件类型注册为组件

1. 在 Component Types 窗口选择一条类型。
2. 点击 `Register as Component`。
3. 选择 Installation / Department。
4. 可勾选 Auto-Register Stock Items。
5. 点击 OK。
6. 在 Components 窗口查看生成的组件记录。

### 6.3 Components 页面

```yaml
route: /maintenance/components
windowTitle: Components
tabs:
  - General
  - Type Details
  - Financial
  - Jobs
  - Parts
  - Counters
  - Measure Points
  - Functions
  - Rotation Log
actions:
  - New
  - Copy
  - Save
  - Delete
  - Update Counter
  - Update Measure Point
```

关键字段：

- Number
- Type Number
- Name
- Status：Available、Installed、Transferred 等
- Maker
- Type
- Serial No.
- Location
- Parent Component
- Vendor
- Function
- Component Type Model

主要流程：新建组件

1. 进入 `Maintenance > Components`。
2. 点击 `New`。
3. 在 General tab 选择 Type Number。
4. 填写唯一 Number 和 Serial No.
5. 补充 Location、Vendor、Function 等。
6. 保存。

原型注意：

- Type Number 使用 LookupDialog。
- 状态变化会影响可执行动作，例如安装、拆卸、转移。
- Parts、Jobs、Counters 等可从 Component Type 继承，但组件级可覆盖。

### 6.4 Functions 页面

```yaml
route: /maintenance/functions
windowTitle: Functions
tabs:
  - General
  - Component
  - Counters
  - Criticality
  - Rotation Log
actions:
  - New
  - Install Component
  - Remove Component
  - Toggle Component Details
```

关键字段：

- Function No.
- Description
- Parent Function
- Status
- Location
- Installed Component
- Criticality
- Counter

主要流程：创建功能位置

1. 进入 `Maintenance > Functions`。
2. 点击 OK 通过过滤器。
3. 点击 `New`。
4. 输入 Function No.、Description、Parent Function。
5. 保存。

主要流程：安装组件到功能位置

1. 打开 Functions 或 Functions Hierarchy。
2. 选择目标 function。
3. 点击 `Install Component` 或右键选择 Install Component。
4. 选择可用组件。
5. 填写 Details。
6. 点击 OK 并保存。
7. Rotation Log 记录安装历史。

主要流程：从功能位置移除组件

1. 选择已安装组件的 function。
2. 点击 `Remove Component`。
3. 选择 New Location。
4. 选择移除后的 Status。
5. 填写 Details。
6. 保存，Rotation Log 记录拆卸历史。

### 6.5 Maintenance Jobs 页面

```yaml
routes:
  - /maintenance/component-type-jobs
  - /maintenance/component-jobs
windowTitles:
  - Component Type Jobs
  - Component Jobs
tabs:
  - General
  - Scheduling
  - Parts
  - Disciplines
  - Risk Management
  - Reporting Options
actions:
  - New
  - View
  - Delete
  - Details
  - Spare Booking
```

关键字段：

- Job No.
- Job Description
- Component Type / Component
- Frequency
- Planning Method
- Due Date
- Counter / Measure Point trigger
- Required Disciplines
- Required Parts
- Mandatory History
- Reporting Options
- Risk Management flag

主要流程：定义组件类型作业并应用到组件

1. 进入 `Maintenance > Component Types`。
2. 选择组件类型，打开 Jobs tab。
3. 点击 `New` 打开 Component Type Jobs。
4. 填写作业描述、周期、备件、工种、上报要求。
5. 保存。
6. 系统询问是否应用到现有组件。
7. 选择 Yes 后，关联组件的 Jobs tab 出现该作业。

### 6.6 Scheduling Jobs 页面

```yaml
route: /maintenance/job-planning
windowTitle: Job Planning
tabs:
  - Periodic Frequencies
  - Counters
  - Measure Points
  - Triggers
actions:
  - Calculate Due Date
  - Generate Work Orders
```

调度类型：

- Periodic：按天、周、月等周期。
- Counter-based：按运行小时或计数器。
- Measure Point：按测点读数。
- Trigger：由其他作业或状态触发。

### 6.7 Maintenance Rounds 页面

```yaml
route: /maintenance/rounds
windowTitle: Maintenance Rounds
tabs:
  - General
  - Schedule
  - Jobs
  - Reporting
  - Work Orders
actions:
  - Define Round
  - Allocate Jobs
  - Deactivate Job
  - Reactivate Job
  - Generate Round Work Order
```

主要流程：定义巡检轮次

1. 创建 Round。
2. 设置巡检周期。
3. 将多个作业分配到 Round。
4. 根据 Reporting Method 选择简单上报或完整上报。
5. 生成 Round Work Orders。

### 6.8 Work Orders 页面

```yaml
route: /maintenance/work-orders
windowTitle: Work Orders
tabs:
  - General
  - Job Details
  - Parts
  - Disciplines
  - Attachments
  - Permits to Work
  - Failure Mode
  - History
actions:
  - Generate
  - Plan
  - Issue
  - Print
  - Report Work
  - Requisition Work
```

状态：

| Status | 含义 |
|---|---|
| Requested | 周期作业生成或手工 Requisition Work 后的初始状态 |
| Planned | 已计划，可等待 Due Date 或审批 |
| Issued | 已签发，可打印和执行 |
| Completed | 已上报完成 |
| Postponed | 已延期 |
| Cancelled | 已取消 |

主要流程：生成初始工单

1. 系统按计划自动生成，或用户手工生成。
2. Work Order 初始状态通常为 Requested。
3. 计划人员调整备件、工种、日期和状态。
4. 将状态改为 Planned。
5. 到执行阶段改为 Issued，并打印。

主要流程：手工 Requisition Work

1. 从维护对象或 Work Orders 打开 Requisition Work。
2. 在 General tab 填写任务说明。
3. 可添加 Attachments。
4. 可添加 Permits to Work。
5. 在 Failure Mode tab 选择受影响 Function 和 Severity Code。
6. 点击 OK 生成 work order。

### 6.9 Work Planning 页面

```yaml
route: /maintenance/work-planning
windowTitle: Work Planning
purpose: 批量计划和调整工单
mainTable:
  - Work Order No.
  - Description
  - Component
  - Function
  - Due Date
  - Status
  - Discipline
  - Parts availability
actions:
  - Set Status
  - Adjust Parts
  - Adjust Disciplines
  - Issue Work Orders
```

### 6.10 Maintenance Projects 页面

```yaml
route: /maintenance/projects
windowTitle: Projects
tabs:
  - General
  - Sections
  - Access Control
  - Jobs
  - Work Orders
  - Sub-Contracting
  - Compendium
  - Costs
actions:
  - New Project
  - Copy Project
  - Add Section
  - Add Job
  - Generate Project Work Orders
  - Customise Compendium
```

项目流程：

1. 创建项目。
2. 维护项目 sections。
3. 设置访问控制。
4. 添加项目 jobs。
5. 生成 project work orders。
6. 处理分包。
7. 汇总 compendium。
8. 跟踪 project costs。

### 6.11 Counters and Measure Points 页面

```yaml
routes:
  - /maintenance/update-counters
  - /maintenance/update-measure-points
  - /maintenance/measure-point-trends
  - /maintenance/counter-measure-point-logs
```

字段：

- Component / Function
- Counter Code
- Current Value
- New Value
- Unit
- Reading Date
- Measure Point
- Trend
- Log entries

交互：

- 在 Components 窗口或独立 Update 窗口更新。
- 更新后影响基于计数器或测点的作业到期计算。
- Measure Point Trends 用图表展示读数趋势。

### 6.12 Report Work 页面

```yaml
route: /maintenance/report-work
windowTitle: Report Work
tabs:
  - General
  - Resources Used
  - Stock Used
  - History
  - Measure Points
  - Work Permit
  - Related Jobs
actions:
  - Open
  - Save Report
  - Complete Work Order
  - Report Overdue
  - Report Unplanned Maintenance
```

上报内容：

- Resources Used：人工、工时、工种。
- Stock Used：消耗备件。
- History：维修历史描述。
- Measure Points：执行时测点读数。
- Work Permit：关联作业许可。
- Related Jobs：关联或依赖作业。

## 7. Stock Management 模块

### 7.1 模块目标

维护库存类型、库存实例、替代件、状态、采购历史、库存需求、出入库、盘点、库存交易、转移单和需求预测。

### 7.2 Stock Types 页面

```yaml
route: /stock/stock-types
windowTitle: Stock Types
tabs:
  - General
  - Makers
  - Vendors
  - Grades
  - Component Types
  - Purchase History
actions:
  - New
  - Register as Stock Item
  - Set Status
```

关键字段：

- Stock Type No.
- Description
- Maker
- Vendor
- Grade
- Unit
- Best Purchase Price
- Status

### 7.3 Stock Items 页面

```yaml
route: /stock/stock-items
windowTitle: Stock Items
tabs:
  - General
  - Makers and Vendors
  - Components / Types
  - Depreciation
  - Locations
  - Transactions
actions:
  - New
  - Move
  - Set Status
  - View Purchase History
```

关键字段：

- Item No.
- Stock Type
- Quantity
- Location
- Expiry Date
- Perishable flag
- Status
- Unit Cost

主要流程：移动库存

1. 打开 Stock Items。
2. 选择一个或多个库存项。
3. 执行 Move。
4. 选择目标 Location。
5. 输入移动数量。
6. 保存并生成 Stock Transaction。

### 7.4 Parts Handling 页面

对象关系：

- Alternative Parts：可替代件。
- Replacement Parts：替换件。
- Obsolete Parts：废止件。

原型交互：

- 在 Stock Type 或 Stock Item 详情中显示替代关系。
- 采购或领用时提供替代件提示。

### 7.5 Stock Wanted 页面

```yaml
route: /stock/wanted
windowTitle: Stock Wanted
purpose: 计算和采购短缺库存
columns:
  - Stock Type
  - Description
  - Current Quantity
  - Minimum Quantity
  - Wanted Quantity
  - Vendor
  - Contract
actions:
  - Calculate Wanted Quantities
  - Generate Forms
  - Purchase
```

主要流程：从 Stock Wanted 发起采购

1. 进入 `Stock > Stock Wanted`。
2. 更新 Wanted Quantities。
3. 选择 `Options > Generate Forms`。
4. 在 Form Creation Dialog 选择 Requisition 或 Purchase Order。
5. 可选择合同和交付地点。
6. 系统生成采购 Forms。

### 7.6 Stock Transactions 页面

```yaml
route: /stock/transactions
windowTitle: Stock Transactions
actions:
  - Alter Transaction
  - Reverse Transaction
```

字段：

- Transaction No.
- Type：In、Out、Move、Reverse
- Stock Item
- Quantity
- From Location
- To Location
- Date
- Reference

### 7.7 Transfer Documents 页面

```yaml
route: /stock/transfer-documents
windowTitle: Transfer Documents
tabs:
  - General
  - Items
  - Approval
  - Transfer
  - Receiving
actions:
  - New
  - Submit
  - Approve
  - Transfer Items
  - Receive
```

状态流程：

```text
Draft -> Submitted -> Approved -> Transferred -> Received -> Closed
```

主要流程：

1. 创建 Transfer Document。
2. 添加需要转移的 items。
3. Submit。
4. Approve。
5. Transfer Items。
6. 接收方 Receive。

## 8. Purchasing 模块

### 8.1 模块目标

覆盖从需求申请、询价、报价、报价比较、采购订单、交付、运输、收货、质检、索赔到合同采购的完整流程。

### 8.2 Forms 页面

```yaml
route: /purchase/forms
windowTitle: Forms
types:
  - Requisition
  - Query
  - Purchase Order
tabs:
  - General
  - Additional Info
  - Line Items
  - Costs Overview
  - Delivery Destinations
  - Quotations
  - Deliveries
  - Vouchers
actions:
  - New
  - Convert
  - Print
  - Send
  - Apply Contract
  - Deliveries
  - Quality Check
```

关键规则：

- Forms 有 Header 和 Lines 两部分。
- Requisition、Query、Purchase Order 可以在流程中转换。
- Header 信息在转换后尽量保留。
- Line items 可以拆分到其他 forms。
- 采购到货后可登记为 Stock Items。

Forms Filter：

- Basic tab：Approval Status、Contract、Priority、Payment Terms、Receipt Condition、Created within last days。
- Advanced tab：Form Types、Statuses、Stock Classes、Priorities、Departments、Content。
- Content 选项：All、Goods Only、Services。
- Quality Check 选项：All、Claims only 等。

### 8.3 Requisition Forms 页面

主要流程：自动创建 Requisition

1. 从 Stock Wanted、Work Order 或维护任务触发。
2. 选择 Form Creation。
3. 选择 Requisition Form。
4. 系统根据库存或作业生成 line items。
5. 保存并进入后续采购流程。

主要流程：手工创建 Requisition

1. 进入 `Purchase > Forms`。
2. 点击 `New`。
3. 选择 Manual 和 Requisition。
4. 填写 Header。
5. 添加 Line Items。
6. 保存。

### 8.4 Query Forms 与 Quotations 页面

主要流程：Requisition 转 Query

1. 在 Forms 选择 Requisition。
2. 执行 Convert to Query。
3. 选择供应商或询价对象。
4. 保存 Query。

主要流程：添加报价

1. 打开 Query Form。
2. 进入 Quotations。
3. 点击 Add Quotation。
4. 选择 Vendor。
5. 输入价格、折扣、交期、备注和附件。
6. 打印或发送 quotation。

### 8.5 Quotation Comparison 页面

```yaml
route: /purchase/quotation-comparison
windowTitle: Quotation Comparison
regions:
  - Scenario List
  - Matrix Configuration
  - Comparison Matrix
  - Selection Actions
actions:
  - Configure Matrix
  - Compare
  - Best Price
  - Best Delivery Time
  - Propose Scenario
  - Approve Scenario
  - Select Scenario
  - Split Line Items
```

矩阵字段：

- Vendor
- Line Item
- Unit Price
- Discount
- Additional Cost
- Delivery Time
- Currency
- Best marker

### 8.6 Purchase Orders 页面

主要流程：转换为 Purchase Order

1. 在 Forms 中选择 Requisition 或 Query。
2. 执行 Convert to Purchase Order。
3. 检查 Header、Vendor、Delivery Location、Line Items。
4. 设置状态。
5. 审批订单。
6. 打印或发送 Purchase Order。

状态建议：

```text
Draft -> Awaiting Approval -> Approved -> Issued/Sent -> Partly Delivered -> Received -> Filed
```

### 8.7 Deliveries 页面

```yaml
route: /purchase/deliveries
windowTitle: Deliveries
tabs:
  - General
  - Line Items
  - Intermediate Locations
actions:
  - Register Delivery
  - Confirm
  - Receive
```

主要流程：

1. 在 Forms 中选择 Purchase Order。
2. 执行 `Options > Deliveries`。
3. 登记 Delivery。
4. 为每个 line item 填写 delivered quantity。
5. 可记录 intermediate location。
6. 收货后更新库存。

### 8.8 Transport Documents 页面

```yaml
route: /purchase/transport-documents
windowTitle: Transport Documents
tabs:
  - General
  - Deliveries
  - Intermediate Locations
actions:
  - New
  - Add Deliveries
  - Unconsolidated Deliveries
  - Update Location
```

### 8.9 Quality Checks and Claims 页面

```yaml
routes:
  - /purchase/quality-checks
  - /purchase/claims
tabs:
  - General
  - Items
  - Result
  - Claim
  - Return Items
actions:
  - Create Check
  - Accept
  - Reject
  - Escalate to Claim
  - Return Rejected Items
```

主要流程：

1. 对整个 form 或单个 item 创建 Quality Check。
2. 在 Quality Check Window 记录检查结果。
3. 不合格时 Escalate to Claim。
4. 可 Return Rejected Items。

### 8.10 Purchase Contracts 页面

```yaml
route: /purchase/contracts
windowTitle: Contracts
tabs:
  - General
  - Discounts
  - Delivery Zones
  - Product Groups
  - Price Matrix
  - Contract Items
  - Installation / Department
actions:
  - New
  - Create Price Matrix
  - Approve
  - Issue
  - Apply to Form
  - Export
```

合同规则：

- 支持不同级别和类型的折扣。
- 支持 Delivery Zones 和 Product Groups。
- Price Matrix 按产品组和地点维护价格。
- Contract 需要 Approve 和 Issue 后才能应用。
- 应用合同后，Forms 的可选 line items、价格和交付地点受合同约束。

主要流程：应用合同到采购单

1. 确保合同已批准并发布。
2. 在 Forms 选择已有采购单，或新建采购单时选择合同。
3. 选择 Delivery Location。
4. 系统校验合同有效性。
5. 点击 Continue / OK。
6. 采购单关联合同。

### 8.11 Custom Clearance 页面

```yaml
routes:
  - /purchase/custom-clearance-contracts
  - /purchase/custom-clearance-forms
tabs:
  - General
  - Details
  - Forms
  - Expenses
  - Items
actions:
  - New Contract
  - New Form
  - Attach Order Form
  - Add Expense
  - Finalise Item
```

## 9. Financials / Budget 模块

### 9.1 模块目标

创建预算、管理预算明细、处理发票凭证、展示预算进度、控制预算承诺。

### 9.2 Budget 页面

```yaml
route: /budget/budgets
windowTitle: Budget
tabs:
  - General
  - Overview
  - Details
  - Access
actions:
  - New
  - Copy
  - Set Status
  - Overview
  - Budget Breakdown
  - Prognosis
```

关键字段：

- Budget Code
- Title
- Budget Group Code
- Budget Class：Purchase、Stock、Maintenance
- Model：Manual 等
- Status
- Access：Open / Restricted
- Warning / Limit
- Committed
- Paid
- Forecast

主要流程：创建预算

1. 进入 `Financial/Budget > Budget`。
2. 点击 New。
3. 定义 Budget Code。
4. 添加 Budget Details。
5. 选择 Budget Group Code 形成层级。
6. 设置 Model 和 Access。
7. 保存。

### 9.3 Budget Overview / Breakdown / Prognosis

- Overview：查看预算总览。
- Breakdown：查看预算下所有成本明细。
- Prognosis：预测预算进度。
- Hierarchy：以树形结构查看预算组累计金额。

### 9.4 Vouchers 页面

```yaml
route: /budget/vouchers
windowTitle: Vouchers
tabs:
  - General
  - Forms
  - Line Items
  - Additional Costs
  - Recipient
actions:
  - New
  - Calculate
  - Link Form
  - Save
```

主要流程：为采购单创建发票

1. 进入 `Purchase > Forms` 并选择采购 form。
2. 执行创建 invoice/voucher。
3. Vouchers 窗口自动带出 vendor。
4. Forms tab 显示关联采购单。
5. 在 Line Items 输入发票数量和价格。
6. 点击 Calculate 更新 Net、VAT、Total Amount。
7. 保存。

## 10. 数据模型建议

### 10.1 核心实体

```ts
type Installation = {
  id: string
  code: string
  name: string
}

type Department = {
  id: string
  installationId: string
  code: string
  name: string
}

type ComponentType = {
  id: string
  typeNumber: string
  name: string
  maker?: string
  model?: string
  classCode?: string
  status: string
}

type Component = {
  id: string
  number: string
  typeNumber: string
  name: string
  serialNo?: string
  status: 'Available' | 'Installed' | 'Transferred' | 'Obsolete'
  location?: string
  functionNo?: string
}

type FunctionLocation = {
  id: string
  functionNo: string
  description: string
  parentFunctionNo?: string
  status: string
  criticality?: string
  installedComponentId?: string
}

type MaintenanceJob = {
  id: string
  jobNo: string
  description: string
  targetType: 'ComponentType' | 'Component' | 'Function'
  targetId: string
  frequency?: string
  planningMethod?: string
  requiredDisciplines: string[]
  requiredParts: string[]
}

type WorkOrder = {
  id: string
  workOrderNo: string
  description: string
  status: 'Requested' | 'Planned' | 'Issued' | 'Completed' | 'Postponed' | 'Cancelled'
  dueDate?: string
  componentId?: string
  functionNo?: string
  jobId?: string
}

type StockType = {
  id: string
  stockTypeNo: string
  description: string
  unit: string
  status: string
}

type StockItem = {
  id: string
  stockItemNo: string
  stockTypeNo: string
  quantity: number
  location: string
  status: string
  expiryDate?: string
}

type PurchaseForm = {
  id: string
  formNo: string
  type: 'Requisition' | 'Query' | 'PurchaseOrder'
  status: string
  vendorId?: string
  deliveryLocation?: string
  contractId?: string
  lineItems: PurchaseLineItem[]
}

type PurchaseLineItem = {
  id: string
  partNo: string
  description: string
  quantity: number
  unitPrice?: number
  currency?: string
}

type Budget = {
  id: string
  code: string
  title: string
  class: 'Purchase' | 'Stock' | 'Maintenance'
  status: string
  committed: number
  paid: number
  forecast?: number
}
```

### 10.2 Mock 数据建议

- 生成 2 个 installations：`Traveller`、`Office`。
- 每个 installation 下 2-3 个 departments。
- Components 示例：主机缸套、辅助锅炉、泵、阀门。
- Work Orders 示例：Overdue、Due This Week、Planned、Issued。
- Stock 示例：备件、耗材、易耗品、带保质期物料。
- Purchase Forms 示例：新申请、询价中、已选报价、已批准 PO、部分到货、已收货。
- Budget 示例：Purchase Budget、Stock Budget、Maintenance Budget。

## 11. 路由建议

```ts
export const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', component: DashboardPage },
  { path: '/maintenance/component-types', component: ComponentTypesPage },
  { path: '/maintenance/components', component: ComponentsPage },
  { path: '/maintenance/functions', component: FunctionsPage },
  { path: '/maintenance/jobs', component: MaintenanceJobsPage },
  { path: '/maintenance/job-planning', component: JobPlanningPage },
  { path: '/maintenance/rounds', component: MaintenanceRoundsPage },
  { path: '/maintenance/work-orders', component: WorkOrdersPage },
  { path: '/maintenance/work-planning', component: WorkPlanningPage },
  { path: '/maintenance/projects', component: ProjectsPage },
  { path: '/maintenance/report-work', component: ReportWorkPage },
  { path: '/stock/stock-types', component: StockTypesPage },
  { path: '/stock/stock-items', component: StockItemsPage },
  { path: '/stock/wanted', component: StockWantedPage },
  { path: '/stock/transactions', component: StockTransactionsPage },
  { path: '/stock/transfer-documents', component: TransferDocumentsPage },
  { path: '/purchase/forms', component: PurchaseFormsPage },
  { path: '/purchase/quotations', component: QuotationsPage },
  { path: '/purchase/quotation-comparison', component: QuotationComparisonPage },
  { path: '/purchase/deliveries', component: DeliveriesPage },
  { path: '/purchase/transport-documents', component: TransportDocumentsPage },
  { path: '/purchase/quality-checks', component: QualityChecksPage },
  { path: '/purchase/contracts', component: PurchaseContractsPage },
  { path: '/budget/budgets', component: BudgetsPage },
  { path: '/budget/vouchers', component: VouchersPage },
  { path: '/tools/options', component: OptionsPage },
  { path: '/tools/global-search', component: GlobalSearchPage }
]
```

## 12. Vue 页面生成提示词

可将以下提示词交给 Vue 原型生成器：

```text
请基于本 Markdown 生成一个 Vue 3 + TypeScript + Vite 的 AMOS M&P 原型系统。

要求：
1. 使用企业桌面管理系统风格，不要做营销型首页。
2. 第一屏为 Dashboard，包含顶部菜单栏、工具栏、左侧快捷栏、告警概览、通知列表、状态栏。
3. 实现 Maintenance、Stock、Purchase、Budget 四个主模块的可点击菜单和路由。
4. 业务页面使用“过滤器弹窗 + 结果表格 + 详情标签页”的统一模式。
5. 使用 mock 数据即可，但字段、状态、按钮、流程要贴近本规格。
6. 重点实现 Work Orders、Components、Stock Wanted、Purchase Forms、Quotation Comparison、Budget、Vouchers 页面。
7. 每个页面都要有 New、Save、Refresh、Print、Options 等传统 AMOS 操作按钮。
8. Lookup 字段使用弹窗选择；Options 使用下拉菜单；状态流使用标签或步骤条展示。
9. 支持桌面宽屏，移动端只需不破版。
10. UI 颜色以浅蓝标题栏、浅灰面板、白色表格和蓝色选中态为主。
```

## 13. 首批原型实现优先级

### P0：必须实现

- AppShell、MenuBar、Toolbar、Dashboard。
- Maintenance：Components、Functions、Work Orders、Report Work。
- Stock：Stock Items、Stock Wanted。
- Purchase：Forms、Quotation Comparison、Purchase Orders。
- Budget：Budget、Vouchers。

### P1：建议实现

- Component Types。
- Maintenance Jobs。
- Maintenance Rounds。
- Transfer Documents。
- Deliveries。
- Quality Checks / Claims。
- Purchase Contracts。

### P2：可后续补充

- Custom Clearance。
- Project Compendium。
- Contract XML Import / Export。
- Advanced Select View 配置器。
- Audit Trail 完整日志。

## 14. 来源页码索引

- Getting Started / Dashboard / Windows：手册页 12-34。
- Maintenance：手册页 35-180。
- Stock Management：手册页 181-228。
- Purchasing：手册页 229-356。
- Financials：手册页 357-372。
- Contracts XML：手册页 373-380。

