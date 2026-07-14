# AMOS 系统使用流程与功能模块设计

> 依据：`AMOS M&P Vrs.10.0.30 User Guide`（Revision 1，2015-10，共 391 个 PDF 页面）  
> 范围：手册正文明确展开的 Getting Started、Maintenance、Stock Management、Purchasing、Financials。  
> 页码说明：本文统一使用 PDF 文件中的实际页码，而不是页脚显示的手册章节页码。

## 1. 系统定位

AMOS M&P 是围绕设备全生命周期建立的维护、库存、采购和预算一体化系统，适合船舶、海工设施、工厂或其他多地点资产场景。

系统的主业务闭环是：

```text
设备结构与维护标准
  -> 维护计划与工单
  -> 备件需求与库存检查
  -> 采购询价、比价和订单
  -> 到货、收货、质检与入库
  -> 维修执行与完工上报
  -> 维护历史、库存交易和成本预算更新
```

它不是几个孤立模块的集合，而是以 `Component / Function / Job / Work Order / Stock Item / Purchase Form / Budget Code` 为核心对象串联起来的业务平台。

## 2. 核心业务对象

| 对象 | 中文含义 | 业务作用 |
|---|---|---|
| Installation / Department | 安装地点 / 部门 | 定义数据和操作的组织范围；进入业务前应确认当前部门 |
| Function | 功能位置 | 表示设备承担功能的固定位置，如主机、泵位、锅炉位 |
| Component Type | 设备类型模板 | 统一定义同类设备的作业、备件、计数器和测点 |
| Component | 实体设备 | 可安装、拆卸、转移、维修并积累历史的实物对象 |
| Maintenance Job | 维护作业标准 | 定义做什么、何时做、需要哪些备件和工种 |
| Work Order | 维护工单 | 将维护要求转化为可计划、签发、执行和上报的任务 |
| Round | 维护轮次 / 巡检 | 把多个作业合并到一次巡检或一张轮次工单 |
| Stock Type / Stock Item | 物料类型 / 库存物料 | 管理备件主数据、库存数量、位置和替代关系 |
| Purchasing Form | 采购表单 | 承载请购、询价、采购订单等采购过程 |
| Delivery / Transport | 交付 / 运输 | 管理分批交付、在途地点和最终收货 |
| Quality Check / Claim | 质检 / 索赔 | 记录到货质量问题，并可升级为索赔 |
| Budget / Voucher | 预算 / 凭证 | 管理预算、承诺、支付、发票和贷项通知单 |

对象关系可概括为：

```text
Component Type --实例化--> Component --安装在--> Function
       |                         |
       +--定义 Job ------------+
                                  
Job --按周期/计数器/测点/触发器--> Work Order --执行--> Report Work
                                              |            |
                                              |            +--> Maintenance History / Log
                                              +--需要备件--> Stock Wanted
                                                               |
                                                               +--> Requisition -> Query/Quotation
                                                                    -> Purchase Order -> Delivery
                                                                    -> Receive -> Stock Transaction

Purchase Order / Stock Transaction / Maintenance Log / Voucher -> Budget
```

## 3. 系统使用总流程

### 3.1 登录与进入业务

1. 启动 AMOS，进入 Dashboard。
2. 查看 Alerts Overview 和 Notifications，识别逾期维护、待处理请购、待审批事项等。
3. 检查标题栏中的当前 `Installation / Department`；若不正确，关闭已打开窗口并切换部门。
4. 从菜单、任务栏、列表栏或图标栏进入业务窗口。
5. 业务窗口通常先打开 Filter，输入查询条件后查看结果。
6. 对跨多个地点的数据，可启用 Global Search，并选择有权限的安装地点或部门。
7. 完成编辑后保存；启用审计时，对受控字段填写变更原因。

手册依据：Dashboard 与常用入口见 PDF 第 12-17 页；窗口、查询、视图、保存与审计见第 18-29 页；部门切换与 Global Search 见第 30-33 页。

### 3.2 基础建模流程

这是系统正式运行前的基础配置链：

```text
建立 Installation / Department 范围
  -> 建立 Component Type
  -> 配置默认 Jobs / Parts / Counters / Measure Points
  -> 注册或创建 Component
  -> 建立 Function 层级
  -> 将 Component 安装到 Function
  -> 定义作业计划与首张工单
```

关键原则：

- `Component Type` 是模板；从类型注册组件时，可继承完整的作业、备件、计数器和测点。
- 直接在 Components 窗口创建组件时，只继承部分类型信息，其余内容需补充。
- `Function` 是位置，`Component` 是实物；同一功能位置可以在不同时期安装不同组件，安装与拆卸形成 Rotation Log。
- 类型级 Job 可应用到所有同类型组件；组件级 Job 只影响指定设备。

手册依据：Component Type 与注册组件见 PDF 第 36-41 页；Component 见第 42-45 页；Function、安装与移除见第 46-56 页。

### 3.3 计划性维护闭环

```text
定义 Job
  -> 选择调度方式
  -> 生成初始 Work Order
  -> Requested
  -> Planned
  -> Issued
  -> 现场执行
  -> Report Work
  -> Completed
  -> Control / File
  -> 系统按计划生成下一张 Work Order
```

1. 在 Component Type 或 Component 上建立维护 Job。
2. 设置备件、工种、风险控制、强制历史和上报要求。
3. 设置一种或多种调度条件：
   - Periodic：按固定周期；
   - Counter：按运行小时或累计值；
   - Measure Point / CBM：按测点或状态监测条件；
   - Trigger：按到港、离港等业务事件。
4. 创建首张工单。系统参数允许时可自动创建，否则由用户手工生成。
5. 在 Work Orders 或 Work Planning 中调整日期、备件、工种和状态。
6. 将已计划工单 Issue，形成现场执行任务并按需打印。
7. 执行后在 Report Work 中登记人员工时、备件消耗、历史说明、测点和作业许可。
8. 将工单置为 Completed；控制和归档后不可继续修改。
9. 周期或计数器作业完成后，AMOS 根据计划自动生成下一张工单。

工单的主状态语义：

| 状态 | 含义 |
|---|---|
| Requested | 自动生成或人工申请后的待计划状态 |
| Planned | 日期与资源已计划，可进入签发 |
| Issued | 已签发，进入现场执行 |
| Completed | 已完成并上报 |
| Postponed | 延期处理 |
| Cancelled | 取消，不再执行 |

手册依据：作业调度见 PDF 第 79-87 页；初始工单见第 88-89 页；维护处理总流程见第 102-103 页；工单计划与状态见第 111-122 页；工作上报与历史见第 165-180 页。

### 3.4 非计划 / 临时维护流程

```text
发现故障或临时需求
  -> Requisition Work
  -> 说明工作、设备/功能、备件、工时、附件和许可
  -> 生成 Requested Work Order
  -> Plan -> Issue -> Execute -> Report -> Complete
```

适用场景包括设备突发故障、低频任务、临时改造和坞修附加工作。若任务本来已有计划，只是提前执行，可创建 One-Off Work Order，并在后续排程中考虑本次实际完成时间。

手册依据：非计划与意外维护的区别见 PDF 第 102-103 页；One-Off 与 Requisition Work 见第 104-110 页。

### 3.5 维护轮次流程

```text
定义 Round
  -> 设置周期或触发条件
  -> 分配多个 Jobs
  -> 选择简单或完整上报方式
  -> 生成 Round Work Order
  -> 执行与上报
  -> 自动生成下一轮工单
```

轮次适合巡检、抄表和同一路线的多项任务。系统可选择在轮次工单中包含全部活动 Job，或只包含到期日不晚于轮次工单到期日的 Job。

手册依据：Maintenance Rounds 见 PDF 第 90-102 页。

### 3.6 维护项目流程

```text
创建 Project
  -> 划分 Sections
  -> 设置访问控制
  -> 添加 Project Jobs / Work Orders
  -> 补充团队、备件和成本
  -> 生成 Compendium 用于询价或沟通
  -> Issue 并实施
  -> Report Work
  -> 跟踪进度、日志和实际成本
```

项目适合坞修、船检、大修和集中改造，可同时容纳计划性与非计划性维护，并支持分包。

手册依据：项目端到端流程见 PDF 第 130 页；详细项目功能见第 130-159 页。

### 3.7 库存管理流程

```text
维护 Stock Type
  -> 注册 Stock Item
  -> 设置仓位、状态、批次/有效期
  -> 日常入库、出库、移动和盘点
  -> 形成 Stock Transaction
  -> 计算 Wanted Quantity
  -> 触发采购
```

库存模块还负责：

- 可替代件、替换件和废止件；
- 多仓位数量和库内移动；
- 易腐或有有效期物料；
- Location Inventory 与 Stock Control 盘点；
- 每笔出入库交易的追溯、调整和冲销；
- 跨部门 Transfer Document 的创建、提交、审批、发运和接收；
- 基于库存和计划需求的需求预测。

跨地点调拨主状态流：

```text
Create Transfer Document
  -> Submit
  -> Approve
  -> Transfer / Dispatch
  -> Receive
  -> 更新双方库存与交易记录
```

手册依据：库存主数据见 PDF 第 182-210 页；Stock Wanted 见第 211-213 页；盘点与交易见第 214-217 页；调拨见第 218-227 页；预测见第 228 页。

### 3.8 采购到收货流程

```text
库存短缺或人工需求
  -> Requisition
  -> Query
  -> 向多个 Vendor 获取 Quotation
  -> 更新报价与附加费用
  -> Quotation Comparison
  -> Propose / Approve / Select
  -> Purchase Order
  -> Approve / Send
  -> Delivery
  -> Transport（可选）
  -> Receive
  -> Quality Check / Claim（如有）
  -> 更新 Stock Item 和 Stock Transaction
```

采购表单采用“表头 + 行项目”结构。表单记录长期保留，但行项目可在请购、询价、报价和订单间拆分；同一订单也可多次、分批交付。

主要控制点：

- Requisition 可由 Stock Wanted 自动生成，也可手工创建。
- Query 可从 Requisition 转换，也可直接新建。
- 同一 Query 可登记多个供应商报价。
- Quotation Comparison 可按价格、交期、折扣和附加费用形成不同场景。
- 选定报价后生成或更新 Purchase Order，并进入审批和发送。
- Delivery 允许记录分批到货和中间地点；Transport Document 负责在途追踪。
- Receive 将实际数量登记到目标 Location，并更新库存。
- 质量问题先登记为 Quality Check，必要时升级为 Claim；拒收物料可退回。
- Purchase Contract 可按 Vendor、Product Group、Delivery Zone、价格矩阵、折扣和附加费自动约束采购价格。

手册依据：采购模型见 PDF 第 229-242 页；请购、询价和报价见第 243-260 页；比价见第 261-281 页；订单见第 282-287 页；交付、运输和收货见第 288-305 页；质检和索赔见第 306-314 页；采购合同见第 315-350 页。

### 3.9 预算与凭证流程

```text
定义 Budget Code 与年度预算
  -> Purchase / Stock / Maintenance 业务发生
  -> Forecast / Committed / Paid 更新
  -> 登记 Invoice 或 Credit Note Voucher
  -> Voucher 审批与付款/收款
  -> Budget Breakdown / Progress / Prognosis
```

预算分为 Purchase、Stock 和 Maintenance 三类，分别可受到采购订单、库存交易和维护日志影响；Voucher 也可更新预算。采购表单不同类型和状态对预算的影响，可配置为 None、Forecast 或 Committed。

系统提供：

- Budget Code、明细、规格和层级；
- 年度预算复制；
- 预算分解与进度图；
- 基于实际消耗的 Prognosis 版本；
- 预算预警、限额和超预算审批控制；
- 关联采购表单或独立创建的 Invoice / Credit Note；
- Voucher 从创建、审批到付款或收款的工作流。

手册依据：预算建立见 PDF 第 358-361 页；Voucher 见第 362-365 页；预算分解、预测和承诺控制见第 365-369 页；业务对象对预算的影响见第 370-371 页。

## 4. 功能模块设计

### 4.1 一级模块划分

| 一级模块 | 二级功能 | 核心输出 |
|---|---|---|
| 工作台与通用能力 | Dashboard、Alerts、Notifications、Filter、Search、View、Print、Audit Trail、部门切换、Global Search | 待办入口、统一查询、跨组织视图、操作审计 |
| 设备资产 | Component Types、Components、Functions、层级视图、安装/拆卸、Criticality、Rotation Log | 设备台账、功能位置树、设备履历 |
| 维护管理 | Jobs、Scheduling、Rounds、Work Orders、Work Planning、Maintenance Tasks、Projects、Counters、Measure Points、Report Work、History、Log | 维护计划、工单、执行记录和维护历史 |
| 库存管理 | Stock Types、Stock Items、Alternative/Replacement、Stock Wanted、In/Out、Stock Control、Transactions、Transfer、Forecast | 库存余额、交易流水、调拨单、采购需求 |
| 采购管理 | Forms、Requisitions、Queries、Quotations、Comparison、Orders、Deliveries、Transport、Receive、Quality/Claims、Contracts、Custom Clearance | 采购订单、交付记录、质检索赔、合同价格 |
| 财务预算 | Budget、Specification、Overview、Breakdown、Progress、Prognosis、Commitment Control、Voucher、Hierarchy | 预算占用、实际成本、发票凭证和预测 |
| 系统管理 | Options、Configuration、Access Control、Workflow、Parameters、License | 系统参数、权限、流程和许可证 |

### 4.2 推荐的页面结构

AMOS 的典型业务窗口适合统一设计为：

```text
窗口标题与当前 Installation / Department
  + Toolbar：New / View / Save / Delete / Refresh / Print / Options
  + Filter：Basic / Advanced / Global Search
  + Record List：排序、多选、状态、Inst/Dept
  + Detail Tabs：General + 模块专属标签
  + Status / Audit：状态操作、变更原因和日志
```

对原型或重构系统，建议保留以下一致性交互：

- 先筛选、后进入列表；
- 列表与详情联动，双击打开记录；
- Lookup 统一选择主数据；
- 高级业务动作放入 Options；
- 状态变化使用显式动作并校验前置条件；
- 关键修改写入 Audit Trail；
- Global 模式显著展示 `Inst/Dept`，避免跨组织误操作。

### 4.3 模块间接口

| 上游模块 | 触发事件 | 下游模块 / 结果 |
|---|---|---|
| 设备资产 | 注册 Component Type | 生成 Component，并继承 Job、Part、Counter、Measure Point |
| 维护计划 | Job 到期或触发 | 生成 Work Order |
| Work Order | 需要备件 | Stock Wanted / Requisition |
| Report Work | 登记 Stock Used | 扣减库存并形成 Stock Transaction |
| Report Work | 完成周期作业 | 写入 History / Log，并生成下一张 Work Order |
| Stock Wanted | 计算短缺 | 生成 Requisition Form |
| Purchase Order | 登记 Delivery / Receive | 增加库存并形成 Stock Transaction |
| Receive | 质量异常 | Quality Check，可升级 Claim 或退货 |
| Purchase Order | 状态和金额变化 | 更新 Purchase Budget 的 Forecast / Committed / Paid |
| Stock Transaction | 出入库成本 | 更新 Stock Budget |
| Maintenance Log | 人工和资源成本 | 更新 Maintenance Budget |
| Voucher | 发票 / 贷项 | 更新付款、收款和预算数据 |

### 4.4 角色与权限建议

手册中的能力受 Access Control、Workflow 和系统参数影响。面向实施或原型，可按下列角色划分：

| 角色 | 主要权限 |
|---|---|
| 维护工程师 | 设备、功能位置、Job、Counter、Measure Point |
| 维护计划员 | 生成、计划、延期、签发和控制 Work Order |
| 现场执行人员 | 查看 Issued 工单并提交 Report Work |
| 库管员 | 收发存、盘点、移动、调拨和交易冲销 |
| 采购员 | Requisition、Query、Quotation、PO、Delivery |
| 采购审批人 | 报价方案、订单、合同和超预算审批 |
| 质检人员 | Quality Check、Claim、拒收和退货 |
| 财务人员 | Budget、Voucher、Breakdown、Prognosis |
| 系统管理员 | 部门、权限、工作流、参数、审计和许可证 |

建议将以下动作设为受控权限：跨部门 Global 操作、组件转移、库存交易冲销、调拨审批、订单审批、报价方案审批、合同签发、超预算审批、工单控制归档和审计原因维护。

## 5. 日常岗位操作建议

### 每日

1. 从 Dashboard 查看逾期工单、待计划工单、待审批采购和库存告警。
2. 更新关键设备计数器和测点。
3. 计划并签发到期工单。
4. 上报已完成工作和备件消耗。
5. 登记收货、质检和库存移动。

### 每周

1. 在 Work Planning 中检查未来一段时间的工作负荷与资源冲突。
2. 计算 Stock Wanted，合并采购需求。
3. 跟踪 Query、Quotation、PO、Delivery 和在途运输。
4. 检查逾期、延期和未控制的已完成工单。

### 每月或每个报告期

1. 盘点重点仓位并核对 Stock Transactions。
2. 检查 Maintenance History、失败模式和重复故障。
3. 分析预算的 Forecast、Committed、Paid 与 Actual。
4. 更新 Budget Prognosis。
5. 复核权限、审计记录和跨部门操作。

## 6. 实施与设计注意事项

1. **组织范围优先**：AMOS 的许多记录受 Installation / Department 限制，错误部门可能导致查不到数据或写入错误范围。
2. **参数决定流程差异**：首张工单是否自动生成、完成后是否自动排下一张、工单初始状态、预算影响方式等均可能由系统参数决定。
3. **权限决定可见与可操作范围**：手册描述的是完整能力，实际用户看到的菜单、字段和操作取决于 Access Control。
4. **状态是流程控制核心**：工单、采购表单、合同、调拨单和凭证都应通过状态驱动后续动作，不能只作为展示字段。
5. **主数据质量决定自动化效果**：设备类型、作业周期、库存地点、供应商、预算代码不完整，会直接破坏工单生成、备件计算和预算联动。
6. **历史记录应尽量不可篡改**：已控制或归档的工单、库存交易和审计记录应保持可追溯；更正优先使用冲销或补充记录。
7. **本手册版本较旧**：本文对应 AMOS BusinessSuite 10.0.30。若用于现网实施，应再与当前版本、许可证、参数和企业流程核对。

## 7. 手册章节索引

| 手册章节 | PDF 页码 | 本文对应内容 |
|---|---:|---|
| Chapter 1 - Getting Started with AMOS | 11-34 | 登录、Dashboard、窗口、查询、审计、部门、Global Search |
| Chapter 2 - Maintenance | 35-180 | 设备、功能、作业、计划、工单、项目、上报和历史 |
| Chapter 3 - Stock Management | 181-228 | 库存主数据、出入库、盘点、交易、调拨和预测 |
| Chapter 4 - Purchasing | 229-356 | 请购、询价、报价、比价、订单、交付、质检、合同 |
| Chapter 5 - Financials | 357-372 | 预算、凭证、分解、预测和承诺控制 |
| Appendix A - Contracts XML File Formats | 373-391 | 合同 XML 交换格式；不属于日常操作主流程 |
