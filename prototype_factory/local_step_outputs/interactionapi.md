# 03 交互与API

- 步骤标识：`interactionapi`
- 保存时间：2026-07-07T00:13:48.584366+00:00
- 用途：作为下一步工作台的输入来源。

## 内容摘要

- **接口**：创建验收记录

## 结构化数据

<!-- FDE_STEP_RESULT_JSON_START -->
```json
{
  "generatedPagesByKey": {
    "sc-1-page-1-0": {
      "key": "sc-1-page-1-0",
      "name": "设备维保计划工作台",
      "vueFile": "MaintenancePlanWorkbench.vue",
      "goal": "为岸基机务人员提供设备资产树与计划状态总览，快速定位需处理的设备并导航至计划制定或详情",
      "features": [
        "设备资产树与计划状态总览"
      ],
      "sections": [
        "顶部全局搜索与状态统计卡片（计划总数、即将到期数、缺失数）",
        "左侧设备资产树（按系统/区域/设备层级展开，节点旁显示计划状态图标及标签）",
        "右侧详情面板：选中设备后展示该设备的计划摘要（当前计划状态、周期、上次执行日期、下次到期日）、维保历史记录、快速操作按钮（新增计划、编辑、查看详情）",
        "底部状态筛选栏：通过状态标签（未制定、审核中、已生效、即将到期、已过期）过滤资产树显示",
        "导出报表按钮：导出当前筛选后的设备维保计划总览报表"
      ],
      "fields": [
        {
          "name": "globalSearch",
          "label": "全局搜索",
          "type": "text",
          "required": false,
          "description": "在资产树中搜索设备名称或编号，实时过滤树节点"
        },
        {
          "name": "statusFilter",
          "label": "状态筛选",
          "type": "multi-select",
          "required": false,
          "description": "通过状态标签筛选资产树，支持多选：未制定、审核中、已生效、即将到期、已过期"
        }
      ],
      "actions": [
        {
          "label": "展开/折叠节点",
          "trigger": "点击树节点前的展开图标",
          "feedback": "展开或收起子节点，并缓存展开状态"
        },
        {
          "label": "选中设备",
          "trigger": "点击设备树节点",
          "feedback": "高亮该节点，右侧详情面板加载并显示该设备计划摘要、维保历史及操作按钮"
        },
        {
          "label": "新增计划",
          "trigger": "点击右侧面板-快速操作按钮'新增计划'",
          "feedback": "跳转至计划编辑页面，携带选中设备的ID"
        },
        {
          "label": "编辑计划",
          "trigger": "点击右侧面板-快速操作按钮'编辑计划'",
          "feedback": "跳转至计划编辑页面，携带选中设备ID及已有计划数据（若有）"
        },
        {
          "label": "查看详情",
          "trigger": "点击右侧面板-快速操作按钮'查看详情'",
          "feedback": "跳转至设备维保计划详情页面"
        },
        {
          "label": "状态筛选",
          "trigger": "点击底部状态标签（多选）",
          "feedback": "资产树即时过滤，只显示符合所选状态的设备节点，并高亮；统计卡片数据同步更新"
        },
        {
          "label": "导出报表",
          "trigger": "点击导出报表按钮",
          "feedback": "下载CSV/Excel文件，包含当前筛选后的设备维保计划总览（设备名称、计划状态、周期、下次执行日期）"
        }
      ],
      "validations": [
        "全局搜索输入长度不超过50字符",
        "状态筛选至少选择一个标签时才有效（否则显示全部）",
        "导出报表前确保有至少一条数据，否则禁用按钮并提示'暂无数据可导出'"
      ],
      "states": {
        "empty": "资产树列表为空，中央区域显示空状态插画及文字'暂无设备数据，请确认EAM同步是否完成'，并提供'刷新'按钮",
        "loading": "资产树区域显示骨架屏，顶部统计卡片显示占位符，右侧面板隐藏或显示加载中",
        "success": "正常显示资产树、统计卡片、右侧面板内容，可正常交互",
        "error": "API请求失败时，资产树区域显示错误提示'数据加载失败，请检查网络后重试'，并提供重试按钮；若存在上次缓存数据则显示缓存数据并附带提示'当前显示缓存数据'"
      },
      "generatedAt": "2026-07-06T23:49:41.127Z"
    },
    "sc-1-page-2-1": {
      "key": "sc-1-page-2-1",
      "name": "预防性维护计划制定与编辑",
      "vueFile": "PlanEditor.vue",
      "goal": "支持岸基机务人员基于设备资产树和PMS规则新建或编辑预防性维护计划，校验冲突并提交审核",
      "features": [
        "预防性维护计划制定与编辑"
      ],
      "sections": [
        "顶部导航与操作栏：返回工作台、保存草稿、提交审核按钮",
        "设备选择区：支持单选或批量选择设备（从设备树弹窗选择或输入设备编码），已选设备列表显示编码、名称、当前计划状态",
        "计划参数设定区：计划类型单选项（日历周期/运行小时/工况触发），周期数值与单位输入，起始日期选择器，前置预警天数输入框，优先级下拉选择",
        "工单模板关联区：下拉搜索并选择关联的工单模板，显示模板摘要（步骤数、所需备件数）",
        "冲突检测提示区：提交前自动检测所选设备在设定时段内是否存在已有生效计划，以列表形式展示冲突详情并允许用户调整",
        "底部提交区：保存草稿（本地存储）或提交审核（触发工作流）"
      ],
      "fields": [
        {
          "name": "equipmentSelection",
          "label": "选择设备",
          "type": "tree-select-multiple",
          "required": true,
          "description": "从设备树弹窗选择设备，支持多选，回填显示设备编码、名称、状态"
        },
        {
          "name": "planType",
          "label": "计划类型",
          "type": "radio",
          "required": true,
          "description": "日历周期/运行小时/工况触发"
        },
        {
          "name": "cycleValue",
          "label": "周期数值",
          "type": "number",
          "required": true,
          "description": "配合周期单位使用，例如每30天"
        },
        {
          "name": "cycleUnit",
          "label": "周期单位",
          "type": "select",
          "required": true,
          "description": "天、周、月、年、小时等"
        },
        {
          "name": "startDate",
          "label": "起始日期",
          "type": "date-picker",
          "required": true,
          "description": "计划开始的日期"
        },
        {
          "name": "advanceWarningDays",
          "label": "前置预警天数",
          "type": "number",
          "required": false,
          "description": "计划执行前提前多少天提醒"
        },
        {
          "name": "priority",
          "label": "优先级",
          "type": "select",
          "required": true,
          "description": "例如高、中、低"
        },
        {
          "name": "workOrderTemplate",
          "label": "关联工单模板",
          "type": "search-select",
          "required": false,
          "description": "下拉搜索选择工单模板，显示模板摘要"
        }
      ],
      "actions": [
        {
          "label": "选择设备",
          "trigger": "click",
          "feedback": "打开设备树弹窗，多选后回填至设备选择区"
        },
        {
          "label": "检测冲突",
          "trigger": "click",
          "feedback": "调用POST /api/maintenance-plans/validate-conflicts，结果以列表展示在下方冲突检测提示区"
        },
        {
          "label": "保存草稿",
          "trigger": "click",
          "feedback": "将当前表单数据保存至本地存储或后台草稿接口，并显示保存成功提示"
        },
        {
          "label": "提交审核",
          "trigger": "click",
          "feedback": "触发前端校验，通过后调用POST/PUT计划接口，成功后跳转至工作台或审核列表；失败显示错误信息"
        }
      ],
      "validations": [
        "必填项校验：设备选择、计划类型、周期数值、周期单位、起始日期、优先级为必填",
        "周期数值必须为正整数",
        "周期单位与计划类型匹配（运行小时类型时周期单位只能为小时）",
        "起始日期不能早于当前日期",
        "前置预警天数若填写必须非负",
        "提交前自动进行冲突检测，若有冲突则不允许提交，并展示冲突详情"
      ],
      "states": {
        "empty": "表单初始状态，所有字段为空，设备选择区提示'请选择设备'，工单模板区提示'建议关联工单模板'",
        "loading": "提交审核或检测冲突时显示加载遮罩，调取工单模板列表时下拉显示加载中",
        "success": "提交成功，跳转至工作台或审核列表，并显示成功消息",
        "error": "冲突检测失败或提交超时，显示错误提示并保留用户已填数据；字段校验失败时高亮错误字段并显示提示"
      },
      "generatedAt": "2026-07-06T23:50:10.537Z"
    },
    "sc-1-page-3-2": {
      "key": "sc-1-page-3-2",
      "name": "计划变更审核与协同确认",
      "vueFile": "PlanApproval.vue",
      "goal": "管理计划变更申请的审核流程，支持查看差异、审批意见填写、通过/驳回操作，并记录日志",
      "features": [
        "计划变更审核与协同确认"
      ],
      "sections": [
        "顶部筛选栏：按状态（待审核、已通过、已驳回）、申请时间范围、发起人筛选待审列表",
        "待审列表区：表格展示申请编号、设备名称、变更类型（新建/修改/废止）、发起人、提交时间、当前处理人、状态标签，支持排序",
        "变更详情面板：选中一条申请后，以对比视图展示变更前后差异（计划参数、工单模板）",
        "审批操作区：审批意见文本框，通过/驳回按钮，附带提交确认弹窗",
        "审核日志区：以时间线形式展示该申请的所有审核记录（操作人、时间、意见、结果）"
      ],
      "fields": [
        {
          "name": "statusFilter",
          "label": "审批状态",
          "type": "select",
          "required": false,
          "description": "按状态筛选：待审核、已通过、已驳回"
        },
        {
          "name": "dateRange",
          "label": "申请时间范围",
          "type": "daterange",
          "required": false,
          "description": "按申请提交时间筛选"
        },
        {
          "name": "initiator",
          "label": "发起人",
          "type": "text",
          "required": false,
          "description": "按发起人名称或工号模糊搜索"
        },
        {
          "name": "approvalComment",
          "label": "审批意见",
          "type": "textarea",
          "required": false,
          "description": "审核人填写的审批意见，建议填写"
        }
      ],
      "actions": [
        {
          "label": "筛选",
          "trigger": "用户点击筛选按钮或更改筛选条件后自动触发",
          "feedback": "重新加载待审列表，更新表格数据，筛选条件保留在控件中"
        },
        {
          "label": "查看变更详情",
          "trigger": "用户点击列表行或行内查看按钮",
          "feedback": "展开或侧滑展示变更详情面板，以对比视图展示变更前后差异"
        },
        {
          "label": "通过",
          "trigger": "用户点击通过按钮",
          "feedback": "弹出确认弹窗，用户确认后提交审批操作，按钮显示加载状态；成功后关闭面板、刷新列表并显示成功提示；失败时显示错误提示并保留输入"
        },
        {
          "label": "驳回",
          "trigger": "用户点击驳回按钮",
          "feedback": "弹出确认弹窗，用户确认后提交驳回操作，按钮显示加载状态；成功后关闭面板、刷新列表并显示驳回成功提示；失败时显示错误提示并保留输入"
        },
        {
          "label": "展开/收起审核日志",
          "trigger": "用户点击审核日志区域标题或展开按钮",
          "feedback": "切换时间线详情的展开/收起状态"
        }
      ],
      "validations": [
        "提交审批前必须通过确认弹窗二次确认",
        "当审批意见配置为必填时，提交前需校验意见不为空"
      ],
      "states": {
        "empty": "待审列表无数据时，显示“当前无待审批的变更申请”及历史记录入口",
        "loading": "列表初始加载显示骨架屏；提交审批操作时按钮显示加载状态",
        "success": "审批操作成功后显示成功提示，并刷新列表",
        "error": "审批操作失败时显示错误提示，保留当前输入的意见"
      },
      "generatedAt": "2026-07-06T23:50:42.209Z"
    },
    "sc-2-page-1-0": {
      "key": "sc-2-page-1-0",
      "name": "航前健康检查任务触发",
      "vueFile": "VoyageHealthTrigger.vue",
      "goal": "岸基机务人员查看待检查船舶列表，手动或自动发起航前健康检查任务",
      "features": [
        "航前健康检查任务触发"
      ],
      "sections": [
        "顶部通知栏（推送的开航前校验通知）",
        "船舶列表区（显示待检查、执行中、已完成的船舶）",
        "手动发起检查入口（搜索/选择船舶并触发）"
      ],
      "fields": [
        {
          "name": "shipSearch",
          "label": "搜索船舶",
          "type": "text",
          "required": false,
          "description": "按船名或船舶编号搜索待检查船舶"
        }
      ],
      "actions": [
        {
          "label": "查看船舶看板",
          "trigger": "点击船舶卡片",
          "feedback": "跳转至该船舶的航前健康检查看板页面"
        },
        {
          "label": "发起检查",
          "trigger": "点击'发起检查'按钮",
          "feedback": "打开船舶选择对话框，用户选择船舶后，调用POST /api/voyage-health/check-tasks创建检查任务，成功后跳转至看板页；失败时显示错误提示"
        }
      ],
      "validations": [
        "发起检查时，必须选择一艘船舶",
        "搜索框输入不能包含特殊字符"
      ],
      "states": {
        "empty": {
          "description": "无待检查船舶或历史记录，显示空态提示：'暂无待检查船舶'，并提供'手动发起检查'引导",
          "components": [
            "空态插图",
            "引导文字",
            "手动发起检查按钮"
          ]
        },
        "loading": {
          "description": "列表数据加载中，显示骨架屏或loading指示器",
          "components": [
            "骨架屏"
          ]
        },
        "success": {
          "description": "列表数据加载成功，正常显示船舶列表及通知栏",
          "components": [
            "船舶卡片列表",
            "通知栏"
          ]
        },
        "error": {
          "description": "网络错误或接口失败，显示错误提示和重试按钮",
          "components": [
            "错误图标",
            "错误描述文字",
            "重试按钮"
          ]
        }
      },
      "generatedAt": "2026-07-06T23:51:35.016Z"
    },
    "sc-2-page-2-1": {
      "key": "sc-2-page-2-1",
      "name": "健康状态总览与拦截告警看板",
      "vueFile": "VoyageHealthDashboard.vue",
      "goal": "集中展示当前船舶健康校验结果，显示通过/不通过项及拦截告警，提供问题清单导出",
      "features": [
        "健康状态总览与拦截告警看板"
      ],
      "sections": [
        "头部概览区（整体健康分数、开航拦截状态）",
        "分类结果区（设备维保/物资库存/证书资质三栏，每栏显示通过/不通过数量）",
        "问题清单表格区（显示所有不通过项，含类型、描述、严重等级）",
        "操作栏（导出PDF/Excel按钮）"
      ],
      "fields": [
        {
          "name": "healthScore",
          "label": "整体健康分数",
          "type": "number",
          "required": false,
          "description": "0-100分，根据校验通过比例计算"
        },
        {
          "name": "sailingInterceptStatus",
          "label": "开航拦截状态",
          "type": "string",
          "required": true,
          "description": "允许开航或拦截，若存在任何不通过项默认拦截"
        },
        {
          "name": "categoryResults",
          "label": "分类校验结果",
          "type": "array",
          "required": true,
          "description": "包含设备维保、物资库存、证书资质三栏，每栏有通过/不通过数量"
        },
        {
          "name": "issueList",
          "label": "问题清单",
          "type": "array",
          "required": false,
          "description": "所有不通过项，每项含类型、描述、严重等级（高危/中危/低危）"
        },
        {
          "name": "issueType",
          "label": "问题类型",
          "type": "string",
          "required": false,
          "description": "归属分类，如设备维保、物资库存、证书资质"
        },
        {
          "name": "issueDescription",
          "label": "问题描述",
          "type": "string",
          "required": false,
          "description": "未通过项的具体问题说明"
        },
        {
          "name": "severityLevel",
          "label": "严重等级",
          "type": "string",
          "required": false,
          "description": "高危（直接拦截）、中危（需审核）、低危（建议关注）"
        }
      ],
      "actions": [
        {
          "label": "查看问题详情",
          "trigger": "点击问题行",
          "feedback": "跳转至对应问题详情页"
        },
        {
          "label": "导出问题清单",
          "trigger": "点击导出按钮（PDF/Excel）",
          "feedback": "生成并下载文件，格式根据用户选择"
        }
      ],
      "validations": [
        "健康状态总览与拦截告警看板 的关键筛选或处理字段不能为空。",
        "提交前校验状态流转是否合法，并给出明确错误提示。"
      ],
      "states": {
        "empty": {
          "description": "校验任务刚创建，尚未完成，无任何校验结果展示",
          "display": "显示空状态提示，如'暂无校验结果'"
        },
        "loading": {
          "description": "获取校验结果中",
          "display": "显示加载骨架屏或旋转器"
        },
        "success": {
          "description": "成功获取校验结果，正常显示看板内容",
          "display": "正常展示数据，通过项绿色图标，不通过项红色图标并附带告警标识"
        },
        "error": {
          "description": "校验规则执行失败或网络异常",
          "display": "显示错误提示和重新加载按钮"
        }
      },
      "generatedAt": "2026-07-06T23:52:14.988Z"
    },
    "sc-2-page-3-2": {
      "key": "sc-2-page-3-2",
      "name": "不通过项详情与处置流程",
      "vueFile": "VoyageHealthIssueDetail.vue",
      "goal": "展示单个不通过项的详细信息和关联数据，支持启动紧急工单、物资调拨、豁免审批等处置流程",
      "features": [
        "不通过项详情查看与处置流程发起"
      ],
      "sections": [
        "问题标题与基本信息区（类型、关联对象、过期/逾期时间、严重等级）",
        "详情数据区（逾期工单清单/缺件物料表格/过期证书列表）",
        "处置操作区（创建紧急工单按钮、发起调拨申请按钮、提交豁免审批按钮）",
        "处置进度区（已发起的处置单状态跟踪）"
      ],
      "fields": [
        {
          "name": "emergencyWorkOrder_priority",
          "label": "紧急工单优先级",
          "type": "select",
          "required": true,
          "description": "紧急工单的优先级，默认取关联问题的严重等级"
        },
        {
          "name": "emergencyWorkOrder_executor",
          "label": "指定执行人",
          "type": "text",
          "required": true,
          "description": "执行紧急工单的机务人员或船员"
        },
        {
          "name": "emergencyWorkOrder_description",
          "label": "问题描述",
          "type": "textarea",
          "required": false,
          "description": "补充说明或处置要点"
        },
        {
          "name": "transferRequest_materialId",
          "label": "缺件物料",
          "type": "select",
          "required": true,
          "description": "从缺件物料列表中选择需要调拨的物料"
        },
        {
          "name": "transferRequest_quantity",
          "label": "调拨数量",
          "type": "number",
          "required": true,
          "description": "需要调拨的数量"
        },
        {
          "name": "transferRequest_target",
          "label": "目标位置/船舶",
          "type": "text",
          "required": true,
          "description": "物料送达的船舶或仓库"
        },
        {
          "name": "exemptionRequest_certificateId",
          "label": "过期证书",
          "type": "select",
          "required": true,
          "description": "选择需要豁免的过期证书"
        },
        {
          "name": "exemptionRequest_reason",
          "label": "豁免原因",
          "type": "textarea",
          "required": true,
          "description": "临时豁免的详细理由"
        },
        {
          "name": "exemptionRequest_validUntil",
          "label": "豁免有效期",
          "type": "date",
          "required": true,
          "description": "临时豁免的截止日期"
        }
      ],
      "actions": [
        {
          "label": "创建紧急工单",
          "trigger": "点击按钮",
          "feedback": "弹出创建紧急工单表单，用户填写后提交，提交成功后刷新处置进度区"
        },
        {
          "label": "发起调拨申请",
          "trigger": "点击按钮",
          "feedback": "弹出发起调拨申请表单，用户填写后提交，提交成功后刷新处置进度区"
        },
        {
          "label": "提交豁免审批",
          "trigger": "点击按钮",
          "feedback": "弹出提交豁免审批表单，用户填写后提交，提交成功后刷新处置进度区"
        },
        {
          "label": "表单提交",
          "trigger": "用户点击表单中的确认按钮",
          "feedback": "调用对应API，成功后关闭弹窗并更新处置进度区；失败时显示错误提示"
        }
      ],
      "validations": [
        "必填字段不能为空",
        "调拨数量必须为正整数",
        "豁免有效期必须晚于当前日期",
        "紧急工单优先级必须选择"
      ],
      "states": {
        "empty": "页面没有不通过项数据，显示空提示或已解决信息",
        "loading": "获取不通过项详情中，显示加载骨架屏",
        "success": "正常显示详情和操作区",
        "error": "数据获取失败或权限不足，显示错误信息和重试按钮"
      },
      "generatedAt": "2026-07-06T23:52:43.207Z"
    },
    "sc-2-page-4-3": {
      "key": "sc-2-page-4-3",
      "name": "校验记录与航前健康报告",
      "vueFile": "VoyageHealthReports.vue",
      "goal": "查看历次航前健康检查记录，生成和下载健康报告，监控开航状态同步结果",
      "features": [
        "校验记录与航前健康报告管理"
      ],
      "sections": [
        "搜索筛选区（按船舶、日期范围、状态过滤）",
        "记录列表区（展示检查任务、生成报告状态、开航状态）",
        "报告生成入口（针对已完成任务生成报告）",
        "日志查看弹窗（点击日志按钮展开操作时间线）"
      ],
      "fields": [
        {
          "name": "shipId",
          "label": "船舶",
          "type": "select",
          "required": true,
          "description": "用于筛选记录关联的船舶"
        },
        {
          "name": "dateRange",
          "label": "日期范围",
          "type": "dateRange",
          "required": false,
          "description": "按时间段过滤校验记录"
        },
        {
          "name": "status",
          "label": "状态",
          "type": "select",
          "required": false,
          "description": "按报告状态或开航状态过滤"
        },
        {
          "name": "taskId",
          "label": "检查任务ID",
          "type": "text",
          "required": false,
          "description": "用于查看日志时传入的标识"
        },
        {
          "name": "reportStatus",
          "label": "报告状态",
          "type": "tag",
          "required": false,
          "description": "显示生成中、已生成、已归档"
        },
        {
          "name": "sailingStatus",
          "label": "开航状态",
          "type": "tag",
          "required": false,
          "description": "显示允许/拦截，拦截时关联未关闭问题数"
        },
        {
          "name": "reportDownloadUrl",
          "label": "下载链接",
          "type": "hidden",
          "required": false,
          "description": "用于下载PDF报告的临时链接"
        }
      ],
      "actions": [
        {
          "label": "搜索筛选",
          "trigger": "点击查询按钮",
          "feedback": "发起GET请求，加载记录列表，显示加载态，刷新列表"
        },
        {
          "label": "生成报告",
          "trigger": "点击生成报告按钮",
          "feedback": "发起POST请求，生成中的报告状态变为“生成中”，异步刷新后更新为“已生成”"
        },
        {
          "label": "下载报告",
          "trigger": "点击下载报告按钮",
          "feedback": "获取下载链接，触发PDF下载"
        },
        {
          "label": "查看开航状态详情",
          "trigger": "点击开航状态标签",
          "feedback": "弹出详情弹窗，显示拦截原因或允许开航时间"
        },
        {
          "label": "查看日志",
          "trigger": "点击日志按钮",
          "feedback": "弹出日志查看弹窗，展示操作时间线，请求日志API"
        }
      ],
      "validations": [
        "必填项：船舶字段在搜索时必须选择",
        "日期范围：开始日期不能晚于结束日期",
        "生成报告：仅对已完成检查任务可用，未完成时按钮置灰"
      ],
      "states": {
        "empty": "列表无记录时展示空态提示，包含引导文字‘暂无历史校验记录’",
        "loading": "列表数据加载中显示骨架屏或加载图标",
        "success": "列表正常展示，记录可点击操作，报告状态和开航状态实时更新",
        "error": "查询失败时显示错误提示，提供重试按钮"
      },
      "generatedAt": "2026-07-06T23:53:22.596Z"
    },
    "sc-3-page-1-0": {
      "key": "sc-3-page-1-0",
      "name": "工单执行跟踪列表",
      "vueFile": "WorkOrderAuditList.vue",
      "goal": "为岸基机务人员提供待审核/已完成工单的聚合视图，支持多维筛选和快速定位",
      "features": [
        "工单执行跟踪筛选列表"
      ],
      "sections": [
        "顶部导航和用户信息",
        "筛选条件栏：船舶名称下拉、设备资产树选择器、工单类型多选、工单状态多选、时间范围日期选择器、搜索按钮",
        "工单摘要列表：表头（工单号、关联设备、优先级、报工时间、当前状态、操作），每行含状态标签，支持排序（优先级、报工时间）和分页",
        "列表空态提示（无符合条件的工单）",
        "加载状态骨架屏"
      ],
      "fields": [
        {
          "name": "shipName",
          "label": "船舶名称",
          "type": "dropdown",
          "required": false,
          "description": "按船舶筛选工单，下拉列表数据来自 GET /api/ships"
        },
        {
          "name": "equipmentTree",
          "label": "设备资产树",
          "type": "treeSelector",
          "required": false,
          "description": "按设备节点筛选，联动船舶选择，数据来自 GET /api/equipmentTree?shipId="
        },
        {
          "name": "workOrderType",
          "label": "工单类型",
          "type": "multiSelect",
          "required": false,
          "description": "可多选：预防性、纠正性、紧急"
        },
        {
          "name": "workOrderStatus",
          "label": "工单状态",
          "type": "multiSelect",
          "required": false,
          "description": "可多选：待审核、已通过、需整改"
        },
        {
          "name": "dateRange",
          "label": "报工时间范围",
          "type": "dateRangePicker",
          "required": false,
          "description": "默认最近一周，支持快捷选择最近一天、一周、一月"
        }
      ],
      "actions": [
        {
          "label": "搜索",
          "trigger": "点击搜索按钮",
          "feedback": "根据当前筛选条件重新加载工单列表，显示加载态，请求 GET /api/workOrders"
        },
        {
          "label": "查看工单详情",
          "trigger": "点击列表行",
          "feedback": "跳转至工单详情核验页面 WorkOrderAuditDetail.vue，携带工单ID"
        },
        {
          "label": "分页切换",
          "trigger": "切换分页页码或每页条数",
          "feedback": "重新请求对应页码数据，列表更新"
        },
        {
          "label": "排序切换",
          "trigger": "点击列表表头的优先级或报工时间排序图标",
          "feedback": "切换排序方向，重新加载列表数据"
        },
        {
          "label": "状态标签快速筛选",
          "trigger": "点击列表行中的状态标签（如'待审核'）",
          "feedback": "自动将该状态添加到工单状态筛选项，并触发搜索"
        },
        {
          "label": "船舶联动设备树",
          "trigger": "选择船舶名称下拉值",
          "feedback": "设备资产树选择器更新为仅显示该船舶下的设备节点"
        }
      ],
      "validations": [
        "工单执行跟踪列表 的关键筛选或处理字段不能为空。",
        "提交前校验状态流转是否合法，并给出明确错误提示。"
      ],
      "states": {
        "empty": {
          "description": "无符合条件的工单时显示空状态插图及引导文字，无数据提示（如'暂无工单'）"
        },
        "loading": {
          "description": "列表数据加载中显示骨架屏或进度条，禁用交互"
        },
        "success": {
          "description": "正常展示工单列表，包含分页、排序等交互"
        },
        "error": {
          "description": "网络错误或接口异常时显示错误提示及重试按钮，点击重试重新加载"
        }
      },
      "generatedAt": "2026-07-06T23:53:48.282Z"
    },
    "sc-3-page-2-1": {
      "key": "sc-3-page-2-1",
      "name": "工单审核详情与操作",
      "vueFile": "WorkOrderAuditDetail.vue",
      "goal": "展示单个工单的完整报工数据，支持机务人员逐项核验并执行审核通过或退回操作，提供整改跟踪与审计日志查阅",
      "features": [
        "报工数据核验详情",
        "审核通过/退回处理",
        "整改跟踪与审计日志"
      ],
      "sections": [
        "页面顶部：工单编号、关联设备、当前状态、优先级标签，以及返回列表按钮",
        "工单基本信息分区：设备名称、报工人员、报工时间、工单类型、维保标准说明（只读）",
        "执行明细分区：实际执行人员、开始/结束时间、总实际工时、执行步骤列表（勾选状态、完成说明、附件链接）",
        "物料消耗分区：物料名称、编码、计划用量、实际用量、批次号，超量物料高亮标示，支持查看物料附件",
        "多媒体附件分区：照片/视频缩略图网格，点击弹出预览，显示拍摄时间戳",
        "异常记录分区：异常类型、描述、现场照片，展示处理状态（待处理/已处理）",
        "审核操作区：审核通过按钮（绿色）、退回整改按钮（红色），退回时弹出模态框填写审核意见（必填）、选择整改要求（补全数据/重新执行/更换物料/其他+自由文本）、支持上传附件",
        "审核历史分区：Tab切换，默认显示'审核日志'，展示历次审核记录（操作人、时间、结论、意见、附件），支持版本对比"
      ],
      "fields": [
        {
          "name": "opinion",
          "label": "审核意见",
          "type": "textarea",
          "required": true,
          "description": "审核意见，必填"
        },
        {
          "name": "reworkRequirements",
          "label": "整改要求",
          "type": "checkbox-group",
          "required": true,
          "description": "至少选择一项：补全数据、重新执行、更换物料、其他"
        },
        {
          "name": "otherRequirementText",
          "label": "其他要求描述",
          "type": "text",
          "required": false,
          "description": "当选择‘其他’时填写自由文本"
        },
        {
          "name": "attachment",
          "label": "附件",
          "type": "file",
          "required": false,
          "description": "上传附件（图片/视频/文档），支持多文件"
        },
        {
          "name": "opinionForApproval",
          "label": "审核备注（通过时）",
          "type": "text",
          "required": false,
          "description": "通过时可选填备注"
        }
      ],
      "actions": [
        {
          "label": "确认通过",
          "trigger": "点击绿色‘审核通过’按钮 → 弹出二次确认对话框 → 确认后调用 POST /api/workOrders/{workOrderId}/approve",
          "feedback": "成功提示，工单状态更新为‘已闭环’，审核按钮置灰，记录审核人及时间"
        },
        {
          "label": "退回整改",
          "trigger": "点击红色‘退回整改’按钮 → 弹出模态框，填写审核意见（必填）、选择整改要求（至少一项）、可上传附件 → 提交后调用 POST /api/workOrders/{workOrderId}/reject",
          "feedback": "成功提示，工单状态更新为‘需整改’，刷新整改跟踪Tab，生成整改任务通知"
        },
        {
          "label": "查看附件",
          "trigger": "点击附件缩略图",
          "feedback": "弹出全屏预览（图片/视频），支持左右滑动"
        },
        {
          "label": "版本对比",
          "trigger": "点击审核历史Tab中的‘对比’按钮",
          "feedback": "弹出差异视图，并列显示两版审核意见和附件"
        },
        {
          "label": "查看整改后报工",
          "trigger": "点击整改任务项中的‘查看整改后报工’",
          "feedback": "跳转至工单详情（新版本），进入重新审核流程"
        },
        {
          "label": "返回列表",
          "trigger": "点击页面顶部‘返回列表’按钮",
          "feedback": "返回工单审核列表页"
        }
      ],
      "validations": [
        "审核意见不能为空",
        "整改要求至少选择一项",
        "附件格式限制：图片(jpg/png)、视频(mp4/mov)、文档(pdf/docx)",
        "附件大小不超过50MB",
        "物料消耗超量时自动高亮提示（超量阈值规则由业务确认）"
      ],
      "states": {
        "empty": "整改任务列表为空时显示‘暂无整改任务’",
        "loading": "详情数据加载中显示骨架屏或全页加载指示",
        "success": "操作成功提示（审核通过/退回），工单状态实时更新",
        "error": "工单ID无效或接口失败，显示错误提示和返回按钮"
      },
      "generatedAt": "2026-07-06T23:54:49.253Z"
    },
    "sc-4-page-sc4-1-0": {
      "key": "sc-4-page-sc4-1-0",
      "name": "船舶运行监控总览",
      "vueFile": "ShipMonitoringOverview.vue",
      "goal": "提供所有在管船舶的实时位置、航速、作业状态和通信连接状态的整体视图，支持列表和地图两种展示方式，便于船舶管理人员快速掌握全局态势。",
      "features": [
        "船舶实时监控总览"
      ],
      "sections": [
        "地图视图区",
        "列表视图区",
        "状态筛选栏",
        "船舶状态统计卡片"
      ],
      "fields": [
        {
          "name": "vesselName",
          "label": "船舶名称",
          "type": "text",
          "required": false,
          "description": "输入船舶名称关键字进行模糊搜索"
        },
        {
          "name": "route",
          "label": "航线",
          "type": "select",
          "required": false,
          "description": "按航线筛选船舶，选项由后台配置"
        },
        {
          "name": "operationalStatus",
          "label": "作业状态",
          "type": "select",
          "required": false,
          "description": "按作业状态（航行/作业/停泊）筛选"
        },
        {
          "name": "communicationStatus",
          "label": "通信状态",
          "type": "select",
          "required": false,
          "description": "按通信状态（在线/弱网/离线）筛选"
        }
      ],
      "actions": [
        {
          "label": "切换视图",
          "trigger": "点击地图/列表切换按钮",
          "feedback": "页面在地图视图和列表视图之间切换，当前激活按钮高亮"
        },
        {
          "label": "查看船舶信息",
          "trigger": "在地图上点击船舶标记",
          "feedback": "弹出船舶信息浮窗，显示名称、位置、航速、作业状态、通信状态及更新时间"
        },
        {
          "label": "跳转至船舶详情",
          "trigger": "点击船舶信息浮窗中的'查看详情'链接或按钮",
          "feedback": "导航至单船运行详情看板页面"
        },
        {
          "label": "查看船舶详情",
          "trigger": "在列表视图中点击行",
          "feedback": "导航至单船运行详情看板页面"
        },
        {
          "label": "筛选船舶",
          "trigger": "在筛选栏输入或选择筛选条件后自动触发",
          "feedback": "地图和列表视图同时更新，仅显示符合条件的船舶"
        },
        {
          "label": "自动数据刷新",
          "trigger": "页面加载后立即启动轮询（每10秒）或WebSocket连接",
          "feedback": "实时更新船舶位置、航速、状态等信息，数据变化时地图标记和列表行相应更新"
        }
      ],
      "validations": [
        "筛选输入字符串长度不超过100字符",
        "筛选条件为空时显示全部船舶"
      ],
      "states": {
        "empty": "无船舶数据时显示空态提示：'暂无船舶数据，请检查网络或联系管理员'",
        "loading": "显示加载中动画或骨架屏，地图底图先行加载",
        "success": "正常显示船舶列表和地图标记，状态统计卡片展示各项数据",
        "error": "API请求失败时显示错误提示，并提供'重试'按钮；WebSocket断线时提示并尝试重连"
      },
      "generatedAt": "2026-07-06T23:55:25.091Z"
    },
    "sc-4-page-sc4-2-1": {
      "key": "sc-4-page-sc4-2-1",
      "name": "单船运行详情看板",
      "vueFile": "ShipDetailBoard.vue",
      "goal": "展示选定船舶的详细运行信息，包括当前航次、工单执行进度、航前健康校验结果以及船员证书有效期预警，并提供健康校验问题处置功能。",
      "features": [
        "单船运行详情看板",
        "航前健康校验问题处置"
      ],
      "sections": [
        "航次信息区域（航次号、出发/目的港、计划时间）",
        "工单执行进度区域（统计卡片+工单列表）",
        "航前健康校验结果区域（校验项列表，每项通过/不通过状态及操作按钮）",
        "船员证书有效期预警区域（过期/即将到期证书列表）",
        "问题处置面板（点击“转处置”或“豁免”弹出的对话框/侧面板）"
      ],
      "fields": [
        {
          "name": "issueId",
          "label": "问题ID",
          "type": "hidden",
          "required": true,
          "description": "当前处理航前健康校验问题唯一标识，由系统自动填充"
        },
        {
          "name": "responsibleRole",
          "label": "责任角色",
          "type": "select",
          "required": true,
          "description": "选择处理该问题的责任部门或角色，如机务、采办"
        },
        {
          "name": "exemptionReason",
          "label": "豁免理由",
          "type": "textarea",
          "required": true,
          "description": "填写申请临时豁免的详细理由，不超过500字"
        },
        {
          "name": "exemptionExpiry",
          "label": "豁免有效期",
          "type": "date",
          "required": true,
          "description": "选择豁免的有效截止日期，必须为未来日期"
        }
      ],
      "actions": [
        {
          "label": "展开不通过项详情",
          "trigger": "点击健康校验列表中状态为“不通过”的行",
          "feedback": "行展开，显示关联的逾期工单、缺件物资、过期证书等详情，并出现“转处置”和“申请豁免”按钮"
        },
        {
          "label": "转处置",
          "trigger": "点击“转处置”按钮",
          "feedback": "弹出对话框，显示责任角色下拉选择框和确认/取消按钮"
        },
        {
          "label": "确认转处置",
          "trigger": "在转处置对话框中选定责任角色后点击“确认”",
          "feedback": "调用POST /api/health-check/{issueId}/resolve，成功后关闭对话框，列表该行状态更新为“已转处置”，对应角色收到工单通知；失败则显示错误消息"
        },
        {
          "label": "申请豁免",
          "trigger": "点击“申请豁免”按钮",
          "feedback": "弹出对话框，显示豁免表单（理由、有效期）和提交/取消按钮"
        },
        {
          "label": "提交豁免申请",
          "trigger": "在豁免对话框中填写表单后点击“提交”",
          "feedback": "调用POST /api/health-check/{issueId}/exemption，成功后关闭对话框，该行状态更新为“豁免待审批”；失败则显示错误消息"
        },
        {
          "label": "查看证书详情",
          "trigger": "点击船员证书预警列表中的证书名称",
          "feedback": "弹出轻提示或侧面板，显示证书持有人和到期日期"
        },
        {
          "label": "返回总览",
          "trigger": "点击页面顶部“返回总览”按钮",
          "feedback": "路由跳转至船舶监控总览页"
        },
        {
          "label": "下发调度指令",
          "trigger": "点击“下发调度指令”按钮",
          "feedback": "路由跳转至DispatchCommandEditor页面"
        },
        {
          "label": "查看工单详情",
          "trigger": "点击工单列表中任意一行",
          "feedback": "路由跳转至PMS工单详情页"
        }
      ],
      "validations": [
        "转处置时，责任角色不能为空",
        "豁免理由不能为空，且长度不超过500字",
        "豁免有效期必须为当前日期之后的日期，格式为YYYY-MM-DD",
        "页面数据请求失败时，显示错误状态提示并提供重试按钮",
        "空态时，显示“暂无航次或工单数据”提示"
      ],
      "states": {
        "empty": {
          "description": "船舶无当前航次或工单数据，页面展示空状态插图及信息提示"
        },
        "loading": {
          "description": "页面初始化或刷新时，显示骨架屏或加载指示器"
        },
        "success": {
          "description": "数据正常加载，根据实际数据展示航次信息、工单进度、健康校验结果及证书预警；包含正常态和部分不通过态"
        },
        "error": {
          "description": "API请求失败，显示错误消息和“重新加载”按钮，并保留已缓存数据（如有）"
        }
      },
      "generatedAt": "2026-07-06T23:56:02.471Z"
    },
    "sc-4-page-sc4-3-2": {
      "key": "sc-4-page-sc4-3-2",
      "name": "调度指令编辑与下发",
      "vueFile": "DispatchCommandEditor.vue",
      "goal": "船舶管理人员在确认船舶健康校验通过（或豁免后）后，编辑调度指令并下发至船端，跟踪指令执行进度直至闭环。",
      "features": [
        "调度指令编辑与下发"
      ],
      "sections": [
        "指令编辑表单区域（航次任务、出发/预计到达时间、航线选择、任务要求）",
        "指令状态跟踪区域（当前指令状态时间线，显示已下发/已接收/执行中/已完成/已闭环）",
        "历史指令列表区域（最近下发的指令，方便查看）"
      ],
      "fields": [
        {
          "name": "vesselId",
          "label": "船舶",
          "type": "select",
          "required": true,
          "description": "选择目标船舶，支持从总览页传入船舶ID预填"
        },
        {
          "name": "departureTime",
          "label": "出发时间",
          "type": "datetime-local",
          "required": true,
          "description": "航次出发时间，必须晚于当前时间"
        },
        {
          "name": "estimatedArrivalTime",
          "label": "预计到达时间",
          "type": "datetime-local",
          "required": true,
          "description": "预计抵达目的港或下一港口的时间，必须晚于出发时间"
        },
        {
          "name": "route",
          "label": "航线",
          "type": "select",
          "required": true,
          "description": "选择预定义航线或手动输入航线信息"
        },
        {
          "name": "taskRequirements",
          "label": "任务要求",
          "type": "textarea",
          "required": true,
          "description": "本次航次的具体任务描述，如载货要求、注意事项等"
        }
      ],
      "actions": [
        {
          "label": "下发调度指令",
          "trigger": "click",
          "feedback": "弹出确认对话框，用户确认后调用 POST /api/dispatch-commands 创建并下发指令；成功后自动刷新状态跟踪区域并显示成功提示；失败时显示错误信息"
        },
        {
          "label": "刷新",
          "trigger": "click",
          "feedback": "调用 GET /api/dispatch-commands/{id}/status 获取最新指令状态，更新状态时间线"
        },
        {
          "label": "确认闭环",
          "trigger": "click",
          "feedback": "当指令状态为已完成时启用，弹出闭环确认表单（执行结果描述、附件），用户确认后调用 POST /api/dispatch-commands/{id}/close，记录闭环结果并更新状态为已闭环，显示成功提示"
        }
      ],
      "validations": [
        "船舶不能为空",
        "出发时间不能为空",
        "出发时间必须晚于当前时间",
        "预计到达时间不能为空",
        "预计到达时间必须晚于出发时间",
        "航线不能为空",
        "任务要求不能为空"
      ],
      "states": {
        "empty": "无历史指令或当前指令时显示空态提示",
        "loading": "加载数据或处理请求时显示加载中指示器",
        "success": "操作成功（下发、刷新或闭环成功）时显示成功提示",
        "error": "操作失败（网络异常、API错误）时显示错误提示"
      },
      "generatedAt": "2026-07-06T23:56:40.459Z"
    },
    "sc-5-page-1-0": {
      "key": "sc-5-page-1-0",
      "name": "船岸同步状态总览仪表板",
      "vueFile": "DataSyncManager.vue",
      "goal": "提供所有已注册船舶的同步概览，快速识别异常船舶并导航至详细处理。",
      "features": [
        "船岸同步状态总览仪表板"
      ],
      "sections": [
        "顶部筛选栏：按同步状态（正常/异常/未同步）快捷筛选，支持高亮异常船舶优先排序",
        "船舶概览卡片区：每艘船一张卡片，展示船名、通信状态、最近同步时间、待同步数据包数量、冲突数、失败数",
        "全局操作栏：手动触发全量船舶同步状态刷新按钮，刷新拉取各船最新同步心跳",
        "快速跳转入口：点击船舶卡片可一键跳转至该船舶的同步任务详细列表页（SyncTaskList.vue）"
      ],
      "fields": [
        {
          "name": "syncStatusFilter",
          "label": "同步状态",
          "type": "select",
          "required": false,
          "description": "按同步状态（正常/异常/未同步）筛选船舶，异常船舶自动高亮排序"
        }
      ],
      "actions": [
        {
          "label": "点击船舶卡片",
          "trigger": "click",
          "feedback": "跳转至SyncTaskList.vue，携带船舶ID参数"
        },
        {
          "label": "点击刷新按钮",
          "trigger": "click",
          "feedback": "调用GET /api/v1/sync/shipments/summary获取全量概览，并逐个调用GET /api/v1/sync/shipments/{shipId}/heartbeat更新每船心跳状态，刷新卡片展示"
        },
        {
          "label": "筛选下拉切换",
          "trigger": "change",
          "feedback": "根据选中状态重新请求或本地过滤，更新船舶卡片列表，异常船舶优先展示"
        }
      ],
      "validations": [
        "船岸同步状态总览仪表板 的关键筛选或处理字段不能为空。",
        "提交前校验状态流转是否合法，并给出明确错误提示。"
      ],
      "states": {
        "empty": {
          "message": "暂未注册船舶，请先注册船舶"
        },
        "loading": {
          "message": "正在加载船舶同步状态...",
          "skeleton": true
        },
        "success": {
          "description": "船舶同步状态卡片正常展示，异常船舶高亮"
        },
        "error": {
          "message": "获取同步状态失败，请重试"
        }
      },
      "generatedAt": "2026-07-06T23:57:04.625Z"
    },
    "sc-5-page-2-1": {
      "key": "sc-5-page-2-1",
      "name": "同步任务详细列表与多维度筛选",
      "vueFile": "SyncTaskList.vue",
      "goal": "展示选定船舶或全部船舶的同步任务明细，支持多条件筛选、批量操作，并提供冲突与失败任务的快捷入口。",
      "features": [
        "同步任务详细列表与多维度筛选"
      ],
      "sections": [
        "顶部筛选区：按船舶下拉选择（含全部）、数据类型（工单报工/盘点结果/附件图片）、状态（待上传/上传中/已同步/冲突/失败）、时间范围选择器",
        "快捷标签页：“全部任务”、“冲突任务”、“失败任务”三个标签，一键切换聚焦待处理条目",
        "任务列表主体：表格或列表形式，每行展示数据类型、创建时间、来源终端、船端版本号、数据包大小、当前状态，支持多选",
        "批量操作栏：勾选后出现“重新同步”、“标记忽略”、“查看详情”等按钮（冲突/失败任务不可批量忽略）"
      ],
      "fields": [
        {
          "name": "shipId",
          "label": "船舶",
          "type": "select",
          "required": false,
          "description": "下拉选择船舶，包含“全部船舶”选项"
        },
        {
          "name": "type",
          "label": "数据类型",
          "type": "select",
          "required": false,
          "description": "可选值：工单报工、盘点结果、附件图片"
        },
        {
          "name": "status",
          "label": "状态",
          "type": "select",
          "required": false,
          "description": "可选值：待上传、上传中、已同步、冲突、失败"
        },
        {
          "name": "timeRange",
          "label": "时间范围",
          "type": "daterange",
          "required": false,
          "description": "选择起始和结束时间，用于筛选同步任务的创建时间范围"
        }
      ],
      "actions": [
        {
          "label": "切换标签页",
          "trigger": "点击“全部任务”、“冲突任务”或“失败任务”标签",
          "feedback": "自动刷新列表数据，重置除船舶外的筛选条件，聚焦对应状态的任务"
        },
        {
          "label": "筛选查询",
          "trigger": "选择或更改任意筛选条件（时间范围支持防抖）",
          "feedback": "自动发起GET /api/v1/sync/tasks请求，更新列表数据"
        },
        {
          "label": "批量重试",
          "trigger": "勾选任务后点击“重新同步”按钮（仅对失败或冲突任务可用）",
          "feedback": "调用POST /api/v1/sync/tasks/batch-retry，成功后刷新列表并提示重试结果；失败则显示错误原因"
        },
        {
          "label": "批量忽略",
          "trigger": "勾选任务后点击“标记忽略”按钮（冲突和失败任务不可用）",
          "feedback": "调用POST /api/v1/sync/tasks/batch-ignore，成功后刷新列表并提示忽略结果；失败则显示错误原因"
        },
        {
          "label": "查看详情",
          "trigger": "点击单条任务行或“查看详情”按钮",
          "feedback": "跳转至SyncTaskDetail.vue页面或打开详情弹窗，展示任务完整信息"
        },
        {
          "label": "分页切换",
          "trigger": "点击分页控件（页码、上一页/下一页）",
          "feedback": "加载对应页数据，保持当前筛选条件不变"
        }
      ],
      "validations": [
        "时间范围起始日期不能晚于结束日期",
        "批量忽略操作仅允许状态为“待上传”“上传中”“已同步”的任务，冲突和失败任务需逐条处理",
        "批量重试操作仅允许状态为“失败”或“冲突”的任务",
        "筛选输入必须符合枚举值：船舶ID、数据类型、状态选项需与后端定义一致"
      ],
      "states": {
        "empty": "无同步任务时展示“暂无同步任务”及业务建议（如建议检查网络连接或手动触发同步）",
        "loading": "初始加载或筛选切换时显示加载动画（骨架屏或旋转图标）",
        "success": "数据加载成功，正常展示任务列表及筛选区",
        "error": "接口请求失败时显示错误提示（如“数据加载失败，请重试”）并提供重试按钮"
      },
      "generatedAt": "2026-07-06T23:57:57.875Z"
    },
    "sc-5-page-3-2": {
      "key": "sc-5-page-3-2",
      "name": "同步任务详情（冲突解决与失败重试）",
      "vueFile": "SyncTaskDetail.vue",
      "goal": "针对冲突或失败的任务，提供差异对比、逐字段合并、重试或忽略操作，并记录审计日志。",
      "features": [
        "数据冲突差异对比与解决面板",
        "同步失败任务重试与忽略处理"
      ],
      "sections": [
        "任务基本信息区：任务ID、数据类型、来源船舶、创建时间、当前状态、错误原因（如失败）",
        "冲突解决面板（仅当状态为冲突时显示）：并排对比船端版本与岸端版本，差异字段高亮，每行提供单选按钮（采用船端/采用岸端/手动编辑），以及快捷操作按钮“全部采用船端版本”或“全部采用岸端版本”，底部提交解决按钮",
        "失败处理面板（仅当状态为失败时显示）：显示失败原因详情和错误码，提供“重新同步”按钮和“忽略”按钮（点击忽略弹出备注输入框，确认后提交）",
        "操作记录区：展示该任务的历史操作日志（包括自动同步、重试、冲突解决、忽略等），支持审计追溯"
      ],
      "fields": [
        {
          "name": "conflictResolutions",
          "label": "冲突字段解决列表",
          "type": "array",
          "required": true,
          "description": "动态列表，每项包含 fieldId (string), selectedVersion (radio: 'boat'|'shore'|'manual'), manualValue (string, 当selectedVersion='manual'时必填)。由前端根据冲突差异数据生成。"
        },
        {
          "name": "ignoredReason",
          "label": "忽略原因",
          "type": "textarea",
          "required": true,
          "description": "忽略任务时必须填写的备注原因，用于审计日志。"
        }
      ],
      "actions": [
        {
          "label": "提交冲突解决",
          "trigger": "点击冲突解决面板底部的“提交解决”按钮",
          "feedback": "调用 POST /api/v1/sync/conflicts/{conflictId}/resolve 提交合并结果；成功后显示成功提示并刷新任务状态与操作记录；失败时显示错误信息并允许重试。"
        },
        {
          "label": "全部采用船端版本",
          "trigger": "点击冲突解决面板顶部的快捷操作按钮",
          "feedback": "将所有差异字段的 selectedVersion 自动设为 'boat'，实时更新合并结果并清除未处理高亮。"
        },
        {
          "label": "全部采用岸端版本",
          "trigger": "点击冲突解决面板顶部的快捷操作按钮",
          "feedback": "将所有差异字段的 selectedVersion 自动设为 'shore'，实时更新合并结果并清除未处理高亮。"
        },
        {
          "label": "重新同步",
          "trigger": "在失败处理面板点击“重新同步”按钮",
          "feedback": "调用 POST /api/v1/sync/tasks/{taskId}/retry；按钮进入加载状态，成功后任务状态更新为“同步中”；失败次数超过3次时按钮置灰并显示“建议联系船端排查”。"
        },
        {
          "label": "忽略",
          "trigger": "在失败处理面板点击“忽略”按钮",
          "feedback": "弹出备注输入框（必填），确认后调用 POST /api/v1/sync/tasks/{taskId}/ignore，成功后任务状态变为“已忽略”，操作记录更新。"
        }
      ],
      "validations": [
        "忽略操作必须填写备注，否则提交按钮禁用。",
        "手动编辑字段时，若 selectedVersion='manual'，则 manualValue 不能为空。",
        "冲突解决提交前，所有差异字段必须已完成选择（即 selectedVersion 赋值），否则提示“请完成所有字段选择”。"
      ],
      "states": {
        "empty": "任务状态为已同步或无冲突无失败时，整个页面显示“无需处理”提示。",
        "loading": "获取冲突差异详情或失败详情时，对应面板显示骨架屏加载状态。",
        "success": "操作成功后显示全局通知（如“冲突解决成功”），并自动刷新任务基本信息与操作记录区。",
        "error": "接口调用失败时显示错误提示（如“获取差异失败，请重试”），并提供重新加载按钮。"
      },
      "generatedAt": "2026-07-06T23:59:07.505Z"
    },
    "sc-5-page-4-3": {
      "key": "sc-5-page-4-3",
      "name": "同步历史报告与审计日志",
      "vueFile": "SyncReport.vue",
      "goal": "检索同步历史记录，生成同步健康度报告并导出，支撑合规审计。",
      "features": [
        "同步历史报告与审计日志查询"
      ],
      "sections": [
        "筛选区：船舶下拉、日期范围、操作类型（自动同步/人工重试/冲突解决/忽略）",
        "审计日志列表：表格展示船舶、操作时间、操作人员、操作描述、处理结果，支持分页",
        "统计看板区：显示指定周期内的同步成功率、平均延迟、冲突率、未处理量，以卡片或图表展示",
        "导出操作栏：提供“导出PDF”和“导出CSV”按钮，点击后生成报告并下载"
      ],
      "fields": [
        {
          "name": "shipId",
          "label": "船舶",
          "type": "select",
          "required": true,
          "description": "选择要查询的船舶，选项从船舶基础信息接口获取"
        },
        {
          "name": "startTime",
          "label": "开始日期",
          "type": "date",
          "required": true,
          "description": "查询范围的起始日期"
        },
        {
          "name": "endTime",
          "label": "结束日期",
          "type": "date",
          "required": true,
          "description": "查询范围的结束日期"
        },
        {
          "name": "actionType",
          "label": "操作类型",
          "type": "select",
          "required": false,
          "description": "筛选操作类型：自动同步、人工重试、冲突解决、忽略（可多选）"
        }
      ],
      "actions": [
        {
          "label": "切换筛选条件",
          "trigger": "onFilterChange",
          "feedback": "自动重新加载审计日志列表和统计看板数据，触发加载状态"
        },
        {
          "label": "导出PDF",
          "trigger": "onClickExportPdf",
          "feedback": "调用导出接口（GET /api/v1/sync/report/export），校验用户权限（审计员或管理员），权限不足时显示错误提示，否则下载PDF文件"
        },
        {
          "label": "导出CSV",
          "trigger": "onClickExportCsv",
          "feedback": "调用导出接口（GET /api/v1/sync/report/export?format=csv），校验用户权限（审计员或管理员），权限不足时显示错误提示，否则下载CSV文件"
        },
        {
          "label": "点击日志记录",
          "trigger": "onClickLogRecord",
          "feedback": "展开该条日志记录的详情内容（如冲突解决的具体信息、操作前后数据对比）"
        }
      ],
      "validations": [
        "船舶为必选筛选条件",
        "开始日期不能晚于结束日期",
        "导出报告前需校验当前用户是否具有审计报告导出权限（角色：审计员或管理员）"
      ],
      "states": {
        "empty": "暂无同步历史记录",
        "loading": "正在加载同步历史记录...",
        "success": "数据加载成功，列表和统计看板已更新",
        "error": "数据加载失败，请稍后重试"
      },
      "generatedAt": "2026-07-06T23:59:30.818Z"
    },
    "sc-6-page-1-0": {
      "key": "sc-6-page-1-0",
      "name": "待执行工单离线列表",
      "vueFile": "MobileWorkOrderList.vue",
      "goal": "在弱网/无网环境下，通过本地缓存加载当前船端一线作业人员待执行的工单列表，支持筛选和排序，点击进入详情。",
      "features": [
        "待执行工单离线列表"
      ],
      "sections": [
        "顶部状态栏：网络状态图标、当前用户、未同步数量提示",
        "筛选区：设备类型下拉、状态（待执行/执行中）筛选、优先级筛选、日期排序切换",
        "工单列表区：卡片式展示工单编号、设备名称、位置、优先级、计划日期、状态标签，支持上拉加载更多",
        "空态提示：无待执行工单时显示“暂无待执行工单”和刷新按钮"
      ],
      "fields": [
        {
          "name": "deviceType",
          "label": "设备类型",
          "type": "select",
          "required": false,
          "description": "按设备类型筛选工单"
        },
        {
          "name": "status",
          "label": "状态",
          "type": "select",
          "required": false,
          "description": "按工单状态筛选（待执行/执行中）"
        },
        {
          "name": "priority",
          "label": "优先级",
          "type": "select",
          "required": false,
          "description": "按优先级筛选"
        }
      ],
      "actions": [
        {
          "label": "查看工单详情",
          "trigger": "点击工单卡片",
          "feedback": "跳转至MobileWorkOrderDetail.vue"
        },
        {
          "label": "下拉刷新",
          "trigger": "下拉列表",
          "feedback": "若网络可用则请求服务器并更新本地缓存"
        },
        {
          "label": "加载更多",
          "trigger": "滚动到底部",
          "feedback": "加载下一页数据"
        },
        {
          "label": "筛选变更",
          "trigger": "选择筛选条件",
          "feedback": "实时过滤工单列表"
        },
        {
          "label": "刷新",
          "trigger": "点击空态刷新按钮",
          "feedback": "尝试重新加载数据"
        }
      ],
      "validations": [
        "待执行工单离线列表 的关键筛选或处理字段不能为空。",
        "提交前校验状态流转是否合法，并给出明确错误提示。"
      ],
      "states": {
        "empty": "本地缓存无数据时显示空态提示及刷新按钮",
        "loading": "首次打开或下拉刷新时显示加载动画",
        "success": "列表加载完成，展示工单卡片",
        "error": "网络请求失败或本地数据库读取错误时显示错误提示及重试按钮"
      },
      "generatedAt": "2026-07-07T00:00:01.787Z"
    },
    "sc-6-page-2-1": {
      "key": "sc-6-page-2-1",
      "name": "工单详情与维保指引查看",
      "vueFile": "MobileWorkOrderDetail.vue",
      "goal": "离线展示工单完整详情，包括设备信息、维保操作步骤、物料清单、安全注意事项，支持附件本地查看，引导作业人员按规程执行。",
      "features": [
        "工单详情与维保指引查看"
      ],
      "sections": [
        "顶部导航栏：返回按钮、工单编号、状态标签",
        "设备信息区：设备名称、型号、位置、维保类型、设备资产树路径",
        "维保步骤区：按顺序显示步骤列表，每步含序号、操作描述、所需工具/物料、安全提示，支持勾选已完成步骤",
        "物料清单区：备件表格（名称、型号、计划用量、实际库存位置），可标记“已领用”",
        "附件区：已下载的图纸、手册缩略图列表，点击可打开查看（支持缩放旋转）",
        "底部操作栏：“开始执行”按钮（进入执行页）、“查看安全注意事项”浮层入口"
      ],
      "fields": [
        {
          "name": "workOrderNumber",
          "label": "工单编号",
          "type": "text",
          "required": false,
          "description": "唯一标识工单的编号，如WO-2025-001"
        },
        {
          "name": "statusLabel",
          "label": "状态标签",
          "type": "text",
          "required": false,
          "description": "工单当前状态，如待执行、执行中、已完成"
        },
        {
          "name": "equipmentName",
          "label": "设备名称",
          "type": "text",
          "required": false,
          "description": "维保设备名称"
        },
        {
          "name": "model",
          "label": "型号",
          "type": "text",
          "required": false,
          "description": "设备型号"
        },
        {
          "name": "location",
          "label": "位置",
          "type": "text",
          "required": false,
          "description": "设备安装位置"
        },
        {
          "name": "maintenanceType",
          "label": "维保类型",
          "type": "text",
          "required": false,
          "description": "周期性/故障/临时"
        },
        {
          "name": "assetTreePath",
          "label": "设备资产树路径",
          "type": "text",
          "required": false,
          "description": "设备在资产树中的完整路径，如船舶-主机-气缸"
        },
        {
          "name": "stepList",
          "label": "维保步骤列表",
          "type": "list",
          "required": false,
          "description": "按顺序显示步骤，每步包含序号、操作描述、所需工具/物料、安全提示，支持勾选"
        },
        {
          "name": "materialList",
          "label": "物料清单",
          "type": "list",
          "required": false,
          "description": "备件表格，含名称、型号、计划用量、实际库存位置，可标记已领用"
        },
        {
          "name": "attachmentList",
          "label": "附件列表",
          "type": "list",
          "required": false,
          "description": "已下载的图纸、手册缩略图，点击可打开查看"
        }
      ],
      "actions": [
        {
          "label": "步骤勾选",
          "trigger": "点击步骤勾选框",
          "feedback": "切换勾选状态，实时持久化至本地SQLite，支持断点续执"
        },
        {
          "label": "开始执行",
          "trigger": "点击底部\"开始执行\"按钮",
          "feedback": "跳转至维保执行与报工录入页（MobileWorkOrderExecute.vue），携带工单ID"
        },
        {
          "label": "查看附件",
          "trigger": "点击附件缩略图",
          "feedback": "本地打开文件，PDF支持分页查看，图片支持缩放旋转"
        },
        {
          "label": "标记已领用",
          "trigger": "长按物料行",
          "feedback": "变更物料状态为已领用，本地持久化，UI更新标记"
        },
        {
          "label": "返回",
          "trigger": "点击顶部导航栏返回按钮",
          "feedback": "返回工单列表页（携带当前工单ID以便恢复状态）"
        },
        {
          "label": "查看安全注意事项",
          "trigger": "点击底部\"查看安全注意事项\"浮层入口",
          "feedback": "弹出浮层显示安全注意事项内容（可滚动）"
        }
      ],
      "validations": [
        "步骤勾选需在本地持久化成功后方可视为有效操作，若持久化失败应提示用户重试",
        "物料可用量若为待联机获取状态，标记领用时需提示用户后续联机会同步",
        "附件本地查看需确保文件已完整缓存，否则提示文件未下载"
      ],
      "states": {
        "empty": "无工单数据场景（通常不会出现，因从列表页跳转时确保有数据），显示空白占位提示",
        "loading": "首次从列表页跳转时从本地缓存读取工单数据，显示加载中动画或骨架屏",
        "success": "数据加载完成，正常展示工单详情、步骤、物料、附件，支持交互操作",
        "error": "本地缓存数据损坏或读取失败，提示用户重新进入列表页刷新获取"
      },
      "generatedAt": "2026-07-07T00:01:00.456Z"
    },
    "sc-6-page-3-2": {
      "key": "sc-6-page-3-2",
      "name": "维保执行与报工录入",
      "vueFile": "MobileWorkOrderExecute.vue",
      "goal": "引导作业人员按步骤执行维保操作，填写实际工时、消耗物料、异常情况，并通过拍照/录像现场留痕，最后提交报工数据，所有数据在离线状态下暂存本地。",
      "features": [
        "维保执行与报工录入"
      ],
      "sections": [
        "顶部导航栏：返回按钮、工单编号、当前步骤进度（如3/8）",
        "步骤执行区：当前步骤卡片（显示序号、操作描述），实际开始/结束时间输入（默认当前时间，可修改），执行人选择（预设本人），异常备注文本输入",
        "物料消耗区：从物料清单中选择实际消耗的备件（含数量输入），支持追加领用（搜索新增物料）",
        "多媒体留痕区：拍照/录像按钮，已拍摄的缩略图列表，支持预览和删除，每个媒体可关联至当前步骤",
        "提交报工按钮：位于底部，点击后校验必填项（步骤完成、异常说明），通过后存储至本地SQLite并标记工单为“待同步”",
        "空间不足提示：当本地存储低于阈值时弹窗"
      ],
      "fields": [
        {
          "name": "actualStartTime",
          "label": "实际开始时间",
          "type": "datetime-local",
          "required": true,
          "description": "步骤实际开始时间，默认当前时间，可修改"
        },
        {
          "name": "actualEndTime",
          "label": "实际结束时间",
          "type": "datetime-local",
          "required": true,
          "description": "步骤实际结束时间，默认当前时间，可修改"
        },
        {
          "name": "executor",
          "label": "执行人",
          "type": "text",
          "required": false,
          "description": "步骤执行人，默认当前用户"
        },
        {
          "name": "abnormalRemark",
          "label": "异常备注",
          "type": "textarea",
          "required": false,
          "description": "步骤异常情况说明"
        },
        {
          "name": "materialCode",
          "label": "物料编码",
          "type": "text",
          "required": false,
          "description": "消耗物料编码（从物料清单选择或搜索）"
        },
        {
          "name": "materialQuantity",
          "label": "消耗数量",
          "type": "number",
          "required": false,
          "description": "该物料实际消耗数量"
        },
        {
          "name": "mediaFiles",
          "label": "多媒体留痕",
          "type": "file",
          "required": false,
          "description": "拍照或录像文件，可多个，支持预览删除"
        }
      ],
      "actions": [
        {
          "label": "提交报工",
          "trigger": "点击底部提交报工按钮",
          "feedback": "校验必填项（步骤完成、异常说明），通过后存储至本地SQLite并标记工单为‘待同步’，显示‘报工已保存’提示"
        },
        {
          "label": "拍照/录像",
          "trigger": "点击拍照/录像按钮",
          "feedback": "调用系统相机，拍摄后文件自动添加至当前步骤的多媒体列表"
        },
        {
          "label": "添加物料",
          "trigger": "点击添加物料按钮（在物料消耗区）",
          "feedback": "将当前输入的物料编码和数量添加到消耗物料列表中，并清空输入"
        },
        {
          "label": "删除物料",
          "trigger": "点击物料条目上的删除按钮",
          "feedback": "从消耗物料列表中移除该条目"
        },
        {
          "label": "预览多媒体",
          "trigger": "点击已拍摄的缩略图",
          "feedback": "打开预览界面展示图片或视频"
        },
        {
          "label": "删除多媒体",
          "trigger": "点击多媒体条目上的删除按钮",
          "feedback": "从当前步骤的多媒体列表中移除该条目"
        }
      ],
      "validations": [
        "实际开始时间不能为空",
        "实际结束时间不能为空",
        "消耗物料数量必须大于0（如填写了物料编码）",
        "多媒体文件大小不能超过50MB（如有）"
      ],
      "states": {
        "empty": {
          "description": "首次进入，无历史数据"
        },
        "loading": {
          "description": "正在保存报工数据到本地数据库"
        },
        "success": {
          "description": "报工数据已保存，工单状态置为‘待同步’"
        },
        "error": {
          "description": "校验失败或存储空间不足，请检查输入或清理历史数据"
        }
      },
      "generatedAt": "2026-07-07T00:02:01.486Z"
    },
    "sc-6-page-4-3": {
      "key": "sc-6-page-4-3",
      "name": "离线缓存与自动同步管理",
      "vueFile": "MobileSyncStatus.vue",
      "goal": "展示同步队列状态、冲突列表，允许用户手动触发同步、查看同步日志、管理本地缓存空间。",
      "features": [
        "离线缓存与自动同步"
      ],
      "sections": [
        "同步概览区：网络状态、待同步工单数、上次同步时间、存储使用量",
        "同步队列区：表格展示每项工单的同步状态（待同步/同步中/已完成/失败）、重试次数、提交时间",
        "冲突列表区：若有冲突，展示工单ID、差异对比（岸端版本 vs 本地版本）、解决状态，提供“使用本地”、“使用岸端”、“标记待岸基处理”操作",
        "手动触发按钮：强制同步所有待同步工单",
        "缓存管理区：清理已同步数据、清理全部缓存（含附件）"
      ],
      "fields": [
        {
          "name": "field1",
          "label": "同步概览区：网络状态、待同步工单数、上次同步时间、存储使用量",
          "type": "状态/摘要",
          "required": true,
          "description": "支撑「离线缓存与自动同步管理」中的同步概览区：网络状态、待同步工单数、上次同步时间、存储使用量展示或录入。"
        },
        {
          "name": "field2",
          "label": "同步队列区：表格展示每项工单的同步状态（待同步/同步中/已完成/失败）、重试次数、提交时间",
          "type": "文本/选择",
          "required": true,
          "description": "支撑「离线缓存与自动同步管理」中的同步队列区：表格展示每项工单的同步状态（待同步/同步中/已完成/失败）、重试次数、提交时间展示或录入。"
        },
        {
          "name": "field3",
          "label": "冲突列表区：若有冲突，展示工单ID、差异对比（岸端版本 vs 本地版本）、解决状态，提供“使用本地”、“使用岸端”、“标记待岸基处理”操作",
          "type": "文本/选择",
          "required": false,
          "description": "支撑「离线缓存与自动同步管理」中的冲突列表区：若有冲突，展示工单ID、差异对比（岸端版本 vs 本地版本）、解决状态，提供“使用本地”、“使用岸端”、“标记待岸基处理”操作展示或录入。"
        },
        {
          "name": "field4",
          "label": "手动触发按钮：强制同步所有待同步工单",
          "type": "文本/选择",
          "required": false,
          "description": "支撑「离线缓存与自动同步管理」中的手动触发按钮：强制同步所有待同步工单展示或录入。"
        },
        {
          "name": "field5",
          "label": "缓存管理区：清理已同步数据、清理全部缓存（含附件）",
          "type": "文本/选择",
          "required": false,
          "description": "支撑「离线缓存与自动同步管理」中的缓存管理区：清理已同步数据、清理全部缓存（含附件）展示或录入。"
        }
      ],
      "actions": [
        {
          "label": "手动同步",
          "trigger": "点击“手动同步”按钮",
          "feedback": "触发后台同步任务，同步概览区显示进度条或百分比，同步队列区更新状态标签（同步中/已完成/失败）。"
        },
        {
          "label": "解决冲突",
          "trigger": "点击冲突列表中的某项，展开差异对比，选择“使用本地”、“使用岸端”或“标记待岸基处理”",
          "feedback": "根据所选策略更新冲突解决状态：选择“使用本地”或“使用岸端”后自动提交并同步；选择“标记待岸基处理”则保留冲突记录由岸基人员处理。同步队列区对应工单状态更新。"
        },
        {
          "label": "清理缓存",
          "trigger": "点击“清理已同步数据”或“清理全部缓存”按钮",
          "feedback": "弹出二次确认对话框，确认后删除对应数据：清理已同步数据仅删除已同步的工单缓存（保留日志30天）；清理全部缓存删除所有本地缓存（含附件），释放存储空间。缓存管理区的存储使用量即时更新。"
        },
        {
          "label": "自动同步",
          "trigger": "网络恢复且存在待同步工单时自动触发",
          "feedback": "后台自动启动同步任务，状态标签由“待同步”切换为“同步中”，同步完成后更新为“已完成”或“失败”；若失败则保留本地数据，并在同步队列区显示重试次数和错误原因。"
        }
      ],
      "validations": [
        "清理缓存操作前需用户二次确认，防止误删未同步数据",
        "手动同步触发时需检查网络状态，若离线则提示用户等待网络恢复或稍后自动同步",
        "冲突解决操作需在展开差异对比后确认选择，避免误操作"
      ],
      "states": {
        "empty": {
          "description": "所有工单已完成同步且无冲突，同步概览区显示“全部同步”，队列列表为空，冲突列表为空",
          "uiHints": "显示绿色网络状态图标，存储使用量正常"
        },
        "loading": {
          "description": "正在同步数据，同步概览区显示进度条或百分比，同步队列区对应工单状态为“同步中”",
          "uiHints": "禁止其他同步操作（如手动同步按钮置灰），但允许查看和冲突解决"
        },
        "success": {
          "description": "同步任务完成，无失败或冲突，同步概览区更新“上次同步时间”和“待同步工单数”为0",
          "uiHints": "短暂显示成功提示（如Toast），自动清理已同步数据（根据保留策略）"
        },
        "error": {
          "description": "同步任务失败（如网络中断、校验失败或超出重试次数），同步队列区对应工单显示“失败”并标注错误原因",
          "uiHints": "失败工单显示重试按钮，冲突列表中可能出现冲突记录（若岸端版本已更新），提示用户手动处理"
        }
      },
      "generatedAt": "2026-07-07T00:02:47.770Z"
    },
    "sc-7-page-1-0": {
      "key": "sc-7-page-1-0",
      "name": "物资盘点领用工作台",
      "vueFile": "InventoryWorkbench.vue",
      "goal": "展示待处理盘点任务、领料提示、退料记录及网络状态，提供快速导航到扫描盘点、领料、退料和同步管理页面的入口，并显示同步概览。",
      "features": [
        "离线库存与待处理任务加载",
        "离线数据同步与状态管理"
      ],
      "sections": [
        "网络状态指示区：显示在线/弱网/离线状态图标及本地数据版本",
        "待办任务卡片区：按任务类型（盘点/领料/退料）分组展示待处理条目，含数量标识",
        "快捷操作栏：三个按钮（扫描盘点、领料、退料）跳转至对应页面",
        "同步进度概览区：显示待同步条数、上次同步时间、手动同步按钮",
        "最近操作记录区：最近5条本地操作摘要（类型、物料、时间、状态）"
      ],
      "fields": [
        {
          "name": "field1",
          "label": "网络状态指示区：显示在线/弱网/离线状态图标及本地数据版本",
          "type": "状态/摘要",
          "required": true,
          "description": "支撑「物资盘点领用工作台」中的网络状态指示区：显示在线/弱网/离线状态图标及本地数据版本展示或录入。"
        },
        {
          "name": "field2",
          "label": "待办任务卡片区：按任务类型（盘点/领料/退料）分组展示待处理条目，含数量标识",
          "type": "文本/选择",
          "required": true,
          "description": "支撑「物资盘点领用工作台」中的待办任务卡片区：按任务类型（盘点/领料/退料）分组展示待处理条目，含数量标识展示或录入。"
        },
        {
          "name": "field3",
          "label": "快捷操作栏：三个按钮（扫描盘点、领料、退料）跳转至对应页面",
          "type": "文本/选择",
          "required": false,
          "description": "支撑「物资盘点领用工作台」中的快捷操作栏：三个按钮（扫描盘点、领料、退料）跳转至对应页面展示或录入。"
        },
        {
          "name": "field4",
          "label": "同步进度概览区：显示待同步条数、上次同步时间、手动同步按钮",
          "type": "文本/选择",
          "required": false,
          "description": "支撑「物资盘点领用工作台」中的同步进度概览区：显示待同步条数、上次同步时间、手动同步按钮展示或录入。"
        },
        {
          "name": "field5",
          "label": "最近操作记录区：最近5条本地操作摘要（类型、物料、时间、状态）",
          "type": "文本/选择",
          "required": false,
          "description": "支撑「物资盘点领用工作台」中的最近操作记录区：最近5条本地操作摘要（类型、物料、时间、状态）展示或录入。"
        }
      ],
      "actions": [
        {
          "label": "点击待办任务卡片",
          "trigger": "tap",
          "feedback": "跳转到对应操作页并预填任务ID"
        },
        {
          "label": "点击同步按钮",
          "trigger": "tap",
          "feedback": "触发全局同步（在线时）；离线时提示无法同步"
        },
        {
          "label": "下拉刷新",
          "trigger": "pullToRefresh",
          "feedback": "重新加载本地缓存，检测版本差异，若版本不一致则提示在线同步"
        },
        {
          "label": "点击扫描盘点按钮",
          "trigger": "tap",
          "feedback": "跳转至扫描盘点页面"
        },
        {
          "label": "点击领料按钮",
          "trigger": "tap",
          "feedback": "跳转至领料页面"
        },
        {
          "label": "点击退料按钮",
          "trigger": "tap",
          "feedback": "跳转至退料页面"
        }
      ],
      "validations": [
        "物资盘点领用工作台 的关键筛选或处理字段不能为空。",
        "提交前校验状态流转是否合法，并给出明确错误提示。"
      ],
      "states": {
        "empty": "无待办任务时显示鼓励提示：“暂无待办任务，您可以手动盘点或领料”",
        "loading": "首次加载本地缓存时显示加载骨架屏",
        "success": "正常显示数据：网络状态、待办任务卡片、快捷操作栏、同步概览、操作记录",
        "error": "本地缓存加载失败时显示错误提示并提供重试按钮"
      },
      "generatedAt": "2026-07-07T00:03:48.597Z"
    },
    "sc-7-page-2-1": {
      "key": "sc-7-page-2-1",
      "name": "条码扫描盘点",
      "vueFile": "BarcodeScanInventory.vue",
      "goal": "通过摄像头扫描条码识别物料，录入实物数量并对比系统库存，支持拍照留痕，生成盘点差异记录。",
      "features": [
        "条码扫描盘点"
      ],
      "sections": [
        "扫描预览区：全屏摄像头取景框，支持手动输入条码",
        "物料信息展示区：识别成功后显示物料编码、名称、图例、系统库存数量",
        "实物录入区：数字输入框填写实物数量，自动计算差异并显示盘盈/盘亏/一致标识",
        "证据附件区：拍照/视频按钮，已拍缩略图列表，支持删除重拍",
        "操作按钮区：提交盘点 / 重置 / 继续扫描（批量模式）"
      ],
      "fields": [
        {
          "name": "barcodeInput",
          "label": "条码输入",
          "type": "text",
          "required": true,
          "description": "手动输入或摄像头自动识别条码"
        },
        {
          "name": "materialCode",
          "label": "物料编码",
          "type": "text",
          "required": false,
          "description": "自动显示识别的物料编码"
        },
        {
          "name": "materialName",
          "label": "物料名称",
          "type": "text",
          "required": false,
          "description": "自动显示识别的物料名称"
        },
        {
          "name": "systemInventory",
          "label": "系统库存数量",
          "type": "number",
          "required": false,
          "description": "从本地缓存获取的当前库存"
        },
        {
          "name": "actualQuantity",
          "label": "实物清点数量",
          "type": "number",
          "required": true,
          "description": "用户录入实际清点数量，触发差异计算"
        },
        {
          "name": "differenceFlag",
          "label": "差异标识",
          "type": "text",
          "required": false,
          "description": "自动计算：盘盈/盘亏/一致"
        },
        {
          "name": "attachmentMedia",
          "label": "证据附件",
          "type": "file",
          "required": false,
          "description": "拍照或视频留痕，支持多文件"
        }
      ],
      "actions": [
        {
          "label": "扫描条码",
          "trigger": "点击扫描按钮或自动调用摄像头",
          "feedback": "识别中显示加载动画，识别成功后自动填充物料信息"
        },
        {
          "label": "手动输入条码",
          "trigger": "在输入框键入条码后回车",
          "feedback": "查询本地缓存，成功显示物料信息，失败提示未知物料"
        },
        {
          "label": "录入实物数量",
          "trigger": "数字输入框值变更",
          "feedback": "实时计算差异并更新差异标识颜色"
        },
        {
          "label": "拍照/录制视频",
          "trigger": "点击拍照或视频按钮调用系统相机",
          "feedback": "拍摄后生成缩略图，存入本地，显示在证据附件区"
        },
        {
          "label": "删除附件",
          "trigger": "点击缩略图删除按钮",
          "feedback": "移除该附件记录"
        },
        {
          "label": "提交盘点",
          "trigger": "点击提交盘点按钮",
          "feedback": "本地生成盘点差异记录，标记待同步，返回工作台更新待办"
        },
        {
          "label": "重置",
          "trigger": "点击重置按钮",
          "feedback": "清空当前物料信息、实物数量和附件，恢复扫描预览"
        },
        {
          "label": "继续扫描（批量模式）",
          "trigger": "点击继续扫描按钮",
          "feedback": "清空当前输入但保留已提交记录，自动进入下一件扫描"
        }
      ],
      "validations": [
        "实物清点数量必须为0或正整数",
        "条码不能为空（手动输入时）",
        "照片/视频文件大小不得超过10MB（离线时压缩处理）",
        "同一盘点任务下不可重复提交同一条码（若有唯一约束）",
        "提交前必须已成功识别物料或手动确认未知物料"
      ],
      "states": {
        "empty": "摄像头取景框显示示例提示“请对准条码”，无物料信息",
        "loading": "摄像头扫描中或识别请求进行中，显示加载动画",
        "success": "条码识别成功，物料信息展示区正常显示，可进行后续操作",
        "error": "条码无法识别或未在本地物料缓存中找到，显示“未知物料”提示并允许手动录入条码"
      },
      "generatedAt": "2026-07-07T00:04:24.439Z"
    },
    "sc-7-page-3-2": {
      "key": "sc-7-page-3-2",
      "name": "物资领用",
      "vueFile": "MaterialRequisition.vue",
      "goal": "扫描或搜索物料，校验库存，填写领用信息并关联工单，提交后扣减本地库存生成待同步领料单。",
      "features": [
        "物资领用管理"
      ],
      "sections": [
        "物料选择区：顶部搜索框 + 条码扫描入口，下方展示物料卡片（编码、名称、库存量、阈值）",
        "领用详情表单区：领用数量输入框、用途说明文本域、关联工单下拉选择（从本地工单列表）",
        "缺件预警提示区：当领用数量超过库存时，显示红色预警并自动生成缺件申请单（可补充紧急度说明）",
        "操作按钮区：提交领料 / 取消 / 添加到领料单（允许一次领多种物料？本设计单次单一物料，可多次操作）"
      ],
      "fields": [
        {
          "name": "materialCode",
          "label": "物料编码",
          "type": "text",
          "required": true,
          "description": "手动输入或通过条码扫描自动填充，用于查询物料库存信息"
        },
        {
          "name": "quantity",
          "label": "领用数量",
          "type": "number",
          "required": true,
          "description": "输入领用数量，实时校验是否超出库存可用量"
        },
        {
          "name": "purpose",
          "label": "用途说明",
          "type": "textarea",
          "required": true,
          "description": "填写领用用途，用于记录和审核"
        },
        {
          "name": "relatedOrder",
          "label": "关联工单",
          "type": "select",
          "required": false,
          "description": "从待处理工单列表中选择关联工单号，支持搜索过滤"
        },
        {
          "name": "urgencyNote",
          "label": "紧急度说明",
          "type": "textarea",
          "required": false,
          "description": "当缺件预警触发时显示，用于补充缺件申请单的紧急度描述"
        }
      ],
      "actions": [
        {
          "label": "扫描条码",
          "trigger": "物理扫描枪输入或点击扫描按钮",
          "feedback": "自动填充物料编码，查询并展示物料卡片信息（名称、库存量、阈值）"
        },
        {
          "label": "搜索物料",
          "trigger": "在搜索框输入物料编码或名称后点击搜索/回车",
          "feedback": "展示匹配的物料列表，用户点击选择后填充物料编码并加载库存数据"
        },
        {
          "label": "提交领料",
          "trigger": "点击“提交领料”按钮",
          "feedback": "执行字段校验，若数量超限则显示缺件预警并阻止提交，否则发起POST请求，成功则本地扣减库存，生成领料记录并跳转回工作台；失败则显示错误提示"
        },
        {
          "label": "取消",
          "trigger": "点击“取消”按钮",
          "feedback": "清空当前表单，返回上一页或工作台"
        },
        {
          "label": "添加到领料单",
          "trigger": "点击“添加到领料单”按钮",
          "feedback": "将当前物料加入本地临时领料单列表，允许继续添加其他物料，最后统一提交（当前设计单次单一物料，此按钮可能暂不启用或用于多次操作积累）"
        }
      ],
      "validations": [
        "必填字段校验：物料编码、领用数量、用途说明不能为空",
        "数量范围校验：领用数量必须大于0且不超过库存可用量（从本地缓存获取）",
        "工单有效性校验：若关联工单，所选工单必须处于进行中状态",
        "缺件预警校验：当领用数量超过库存时，触发红色预警并自动生成缺件申请单（可补充紧急度说明），但允许继续提交（需确认业务规则）"
      ],
      "states": {
        "empty": {
          "description": "未选择物料时，显示提示“请扫描或搜索物料”，表单区域禁用或隐藏"
        },
        "loading": {
          "description": "搜索物料、加载工单列表或提交领料时，显示加载指示器，禁用交互"
        },
        "success": {
          "description": "提交成功，显示成功提示“领料单已生成”，本地库存更新，跳转回工作台"
        },
        "error": {
          "description": "校验不通过或提交失败时，显示错误提示（如数量超限、工单无效、网络错误），保留用户输入以便修正"
        }
      },
      "generatedAt": "2026-07-07T00:04:58.435Z"
    },
    "sc-7-page-4-3": {
      "key": "sc-7-page-4-3",
      "name": "退料管理",
      "vueFile": "MaterialReturn.vue",
      "goal": "扫描退料条码，选择退料原因并校验数量，提交后增加本地库存生成待同步退料单。",
      "features": [
        "退料管理"
      ],
      "sections": [
        "物料选择区：条码扫描入口 + 手动输入物料编码",
        "退料信息展示区：展示物料名称、编码、最近领用记录摘要（领料单号、数量、日期）",
        "退料表单区：退料数量输入框、退料原因下拉选择（工单剩余/物料质量问题/误领等）、备注文本域",
        "校验结果区：自动显示最大可退量，若超量显示红色拦截提示",
        "证据附件区（仅限质量问题）：拍照按钮，与盘点复用拍照功能",
        "操作按钮区：提交退料 / 取消"
      ],
      "fields": [
        {
          "name": "materialCode",
          "label": "物料编码",
          "type": "text",
          "required": true,
          "description": "通过条码扫描或手动输入物料编码，自动填充物料信息并加载最近领用记录"
        },
        {
          "name": "returnQuantity",
          "label": "退料数量",
          "type": "number",
          "required": true,
          "description": "输入退料数量，系统实时校验是否超过最大可退量（总领用量-已退量）"
        },
        {
          "name": "returnReason",
          "label": "退料原因",
          "type": "select",
          "required": true,
          "description": "从枚举值中选择：工单剩余、物料质量问题、误领等"
        },
        {
          "name": "remark",
          "label": "备注",
          "type": "textarea",
          "required": false,
          "description": "可选填的备注信息"
        },
        {
          "name": "evidencePhoto",
          "label": "证据附件",
          "type": "image",
          "required": false,
          "description": "仅当退料原因为'物料质量问题'时显示，拍照留痕，复用盘点模块的拍照功能"
        }
      ],
      "actions": [
        {
          "label": "扫描条码",
          "trigger": "扫描设备或手动输入条码",
          "feedback": "自动填充物料编码、名称，并加载该物料最近5条领用记录（领料单号、数量、日期）"
        },
        {
          "label": "输入退料数量",
          "trigger": "用户更改退料数量输入框的值",
          "feedback": "实时计算并显示最大可退量，若超量则显示红色拦截提示并禁用提交按钮"
        },
        {
          "label": "选择退料原因",
          "trigger": "用户从下拉列表选择退料原因",
          "feedback": "若选择'物料质量问题'，动态显示拍照证据输入区；否则隐藏"
        },
        {
          "label": "提交退料",
          "trigger": "用户点击提交按钮",
          "feedback": "校验通过后本地增加库存，生成待同步退料单，显示提交成功提示并返回工作台；否则显示校验失败提示（如超量、必填项缺失）"
        },
        {
          "label": "取消",
          "trigger": "用户点击取消按钮",
          "feedback": "返回工作台，不保存任何数据"
        }
      ],
      "validations": [
        "物料编码不能为空",
        "退料原因不能为空",
        "退料数量必须大于0",
        "退料数量不能超过最大可退量（该物料总领用量-已退量）；超量时直接拦截，不可强制提交",
        "若退料原因为'物料质量问题'，必须提供拍照证据"
      ],
      "states": {
        "empty": "未选择物料时，显示提示信息'请扫描或输入物料编码'，退料表单和操作按钮均不可用",
        "loading": "加载领用记录时，物料选择区下方显示加载中动画",
        "success": "提交成功后，弹窗或顶部提示'退料成功，已生成待同步退料单'，并自动返回工作台",
        "error": "校验失败时，对应字段显示红色错误提示（如'数量超过可退量'、'请选择退料原因'），提交按钮保持禁用状态"
      },
      "generatedAt": "2026-07-07T00:05:23.522Z"
    },
    "sc-7-page-5-4": {
      "key": "sc-7-page-5-4",
      "name": "数据同步管理",
      "vueFile": "DataSyncDetail.vue",
      "goal": "详细查看同步队列，管理同步进度、处理冲突和失败重试。",
      "features": [
        "离线数据同步与状态管理"
      ],
      "sections": [
        "同步状态总览区：显示待同步/同步中/成功/失败的条数统计及进度条",
        "同步队列列表区：按时间倒序展示每条待同步/已同步记录（数据类型、物料名称、操作类型、操作时间、状态标识）",
        "同步失败/冲突处理区：专门展示失败和冲突项，每条提供重试按钮或冲突对比视图（本地 vs 岸端）",
        "手动操作区：全局同步按钮（在线时）、清除成功记录按钮、历史同步日志入口"
      ],
      "fields": [
        {
          "name": "conflictResolution",
          "label": "冲突解决方案",
          "type": "radio",
          "required": true,
          "description": "选择保留本地版本或采用岸端版本"
        },
        {
          "name": "dataType",
          "label": "数据类型",
          "type": "text",
          "required": false,
          "description": "如盘点差异、领料单、退料单等"
        },
        {
          "name": "materialName",
          "label": "物料名称",
          "type": "text",
          "required": false,
          "description": "关联的物料名称"
        },
        {
          "name": "operationTime",
          "label": "操作时间",
          "type": "datetime",
          "required": false,
          "description": "本地记录的操作时间"
        },
        {
          "name": "status",
          "label": "状态",
          "type": "text",
          "required": false,
          "description": "待同步、同步中、成功、失败或冲突"
        }
      ],
      "actions": [
        {
          "label": "重试",
          "trigger": "click",
          "feedback": "重新上传该条数据，更新状态为同步中，完成后更新统计"
        },
        {
          "label": "保留本地",
          "trigger": "click",
          "feedback": "确认使用本地版本解决冲突，自动更新缓存并清除冲突标记"
        },
        {
          "label": "采用岸端",
          "trigger": "click",
          "feedback": "确认使用岸端版本解决冲突，自动更新缓存并清除冲突标记"
        },
        {
          "label": "全局同步",
          "trigger": "click",
          "feedback": "执行全部待同步数据上传，展示进度条，完成后更新统计"
        },
        {
          "label": "清除成功记录",
          "trigger": "click",
          "feedback": "移除列表中所有状态为成功的记录"
        },
        {
          "label": "查看同步日志",
          "trigger": "click",
          "feedback": "跳转至历史同步日志页面"
        },
        {
          "label": "下拉刷新",
          "trigger": "pull",
          "feedback": "手动触发岸端同步状态检查，刷新同步队列"
        },
        {
          "label": "长按查看详情",
          "trigger": "longpress",
          "feedback": "弹窗显示该条数据的原始JSON内容"
        }
      ],
      "validations": [
        "网络离线时自动禁用全局同步和重试操作",
        "重试次数超过3次时弹出提示要求人工介入",
        "同步过程中提示用户不要退出应用，避免数据丢失"
      ],
      "states": {
        "empty": {
          "description": "无待同步记录时显示“所有数据已同步”空状态提示"
        },
        "loading": {
          "description": "列表加载时显示骨架屏，状态统计区域显示加载中"
        },
        "success": {
          "description": "同步成功时更新状态统计数字，短暂显示绿色成功提示"
        },
        "error": {
          "description": "网络异常或同步失败时显示红色错误提示，禁用自动同步，允许手动重试"
        }
      },
      "generatedAt": "2026-07-07T00:06:03.270Z"
    },
    "sc-8-page-1-0": {
      "key": "sc-8-page-1-0",
      "name": "用户管理",
      "vueFile": "UserManager.vue",
      "goal": "系统管理员对系统用户进行增删改查、批量导入导出、启用/禁用及角色分配操作，覆盖用户全生命周期管理。",
      "features": [
        "用户管理"
      ],
      "sections": [
        "顶部筛选栏（部门、角色、状态、搜索框）",
        "操作按钮区（新建用户、批量导入、批量导出）",
        "用户列表表格（账号、姓名、部门、角色、状态、操作列）",
        "分页控件",
        "新建/编辑用户弹窗（表单：账号、姓名、部门、联系方式、角色分配）",
        "批量导入弹窗（上传CSV、预览、确认）"
      ],
      "fields": [
        {
          "name": "account",
          "label": "账号",
          "type": "text",
          "required": true,
          "description": "用户登录账号，需唯一"
        },
        {
          "name": "name",
          "label": "姓名",
          "type": "text",
          "required": true,
          "description": "用户真实姓名"
        },
        {
          "name": "departmentId",
          "label": "所属部门",
          "type": "select",
          "required": true,
          "description": "从组织架构树中选择部门"
        },
        {
          "name": "contact",
          "label": "联系方式",
          "type": "text",
          "required": false,
          "description": "手机或邮箱，可选"
        },
        {
          "name": "roleIds",
          "label": "角色分配",
          "type": "multi-select",
          "required": true,
          "description": "选择一个或多个角色"
        },
        {
          "name": "keyword",
          "label": "搜索关键词",
          "type": "text",
          "required": false,
          "description": "按账号或姓名模糊搜索"
        },
        {
          "name": "departmentFilter",
          "label": "部门筛选",
          "type": "select",
          "required": false,
          "description": "按部门过滤用户列表"
        },
        {
          "name": "roleFilter",
          "label": "角色筛选",
          "type": "select",
          "required": false,
          "description": "按角色过滤用户列表"
        },
        {
          "name": "statusFilter",
          "label": "状态筛选",
          "type": "select",
          "required": false,
          "description": "按启用/禁用状态过滤"
        }
      ],
      "actions": [
        {
          "label": "新建用户",
          "trigger": "点击“新建用户”按钮",
          "feedback": "弹出创建表单弹窗，填写后保存并刷新列表"
        },
        {
          "label": "编辑用户",
          "trigger": "点击表格行操作列“编辑”按钮",
          "feedback": "弹出编辑表单弹窗，修改后保存并刷新列表"
        },
        {
          "label": "启用/禁用用户",
          "trigger": "点击“启用/禁用”按钮",
          "feedback": "二次确认后切换用户状态并更新列表"
        },
        {
          "label": "批量导入",
          "trigger": "按住Shift多选用户后点击“批量导入”按钮",
          "feedback": "弹出上传CSV弹窗，上传、预览、确认导入"
        },
        {
          "label": "导出用户",
          "trigger": "点击“导出”按钮",
          "feedback": "下载CSV文件"
        },
        {
          "label": "搜索",
          "trigger": "点击搜索按钮",
          "feedback": "根据筛选条件过滤用户列表并刷新"
        }
      ],
      "validations": [
        "账号为必填项，且不能与已有账号重复（需调用后端校验接口）",
        "姓名为必填项",
        "部门为必填项",
        "角色至少选择一个（必填）",
        "批量导入时，CSV文件格式必须正确，重复账号需提示用户选择覆盖或跳过（后端校验）"
      ],
      "states": {
        "empty": "无用户时显示引导创建提示",
        "loading": "骨架屏或加载动画",
        "success": "操作成功时显示成功提示，并刷新列表数据",
        "error": "接口超时或错误时显示错误提示与重试按钮"
      },
      "generatedAt": "2026-07-07T00:06:49.131Z"
    },
    "sc-8-page-2-1": {
      "key": "sc-8-page-2-1",
      "name": "角色与权限管理",
      "vueFile": "RolePermissionManager.vue",
      "goal": "系统管理员自定义角色，按模块精细配置功能菜单和操作权限，支持复制角色快速创建。",
      "features": [
        "角色与权限管理"
      ],
      "sections": [
        "角色列表左面板（角色名称、关联用户数、操作按钮）",
        "角色详情右面板（角色基本信息、权限树、操作按钮）",
        "顶部工具栏（新建角色、复制角色、删除角色）",
        "权限树组件（模块展开勾选操作权限）"
      ],
      "fields": [
        {
          "name": "roleName",
          "label": "角色名称",
          "type": "text",
          "required": true,
          "description": "角色唯一名称"
        },
        {
          "name": "description",
          "label": "角色描述",
          "type": "textarea",
          "required": false,
          "description": "角色职责说明"
        },
        {
          "name": "permissions",
          "label": "权限配置",
          "type": "tree",
          "required": true,
          "description": "按模块展开，勾选功能菜单和操作权限（查看、新增、编辑、删除、审核）"
        },
        {
          "name": "sourceRoleId",
          "label": "源角色",
          "type": "select",
          "required": true,
          "description": "复制角色时选择要复制的源角色"
        }
      ],
      "actions": [
        {
          "label": "选择角色",
          "trigger": "点击左面板角色项",
          "feedback": "右面板切换显示该角色的基本信息与权限树"
        },
        {
          "label": "新建角色",
          "trigger": "点击顶部工具栏'新建角色'按钮",
          "feedback": "弹出新建角色表单，填写名称和描述，提交后保存并刷新角色列表，自动选中新角色"
        },
        {
          "label": "复制角色",
          "trigger": "点击顶部工具栏'复制角色'按钮",
          "feedback": "弹出选择源角色对话框，选择后生成副本并刷新列表，自动选中新角色"
        },
        {
          "label": "删除角色",
          "trigger": "点击顶部工具栏或右面板'删除'按钮",
          "feedback": "检查关联用户和流程引用，若存在引用则弹出禁止删除提示；否则确认后删除并刷新列表"
        },
        {
          "label": "配置权限",
          "trigger": "在权限树中勾选/取消勾选模块或操作权限",
          "feedback": "自动保存权限配置，显示保存成功提示；若失败显示错误提示"
        },
        {
          "label": "保存角色信息",
          "trigger": "点击右面板'保存'按钮",
          "feedback": "更新角色名称和描述，保存成功后显示成功提示并刷新列表"
        }
      ],
      "validations": [
        "角色名称不能为空且不可与现有角色重名",
        "删除角色前必须检查是否存在关联用户或流程引用，若有则禁止删除并提示",
        "复制角色时必选源角色",
        "权限配置至少勾选一个模块的一个操作权限"
      ],
      "states": {
        "empty": "无角色时显示空状态提示，引导用户创建第一个角色",
        "loading": "角色列表加载中显示加载指示器；权限树加载中显示树加载状态",
        "success": "操作成功时显示成功反馈（如Toast提示）",
        "error": "操作失败时显示错误反馈（如Toast提示），权限树加载失败显示重试按钮"
      },
      "generatedAt": "2026-07-07T00:07:32.312Z"
    },
    "sc-8-page-3-2": {
      "key": "sc-8-page-3-2",
      "name": "流程定义",
      "vueFile": "WorkflowDesigner.vue",
      "goal": "系统管理员通过可视化拖拽设计器配置审批流程、工单流转节点，定义节点、审批人、条件分支、超时及转交策略。",
      "features": [
        "流程定义"
      ],
      "sections": [
        "流程类型选择/列表区域",
        "流程设计画布（拖拽节点、连接线）",
        "节点属性面板（审批人、超时规则、转交策略）",
        "顶部操作栏（保存、发布、版本管理）",
        "已发布流程概览视图"
      ],
      "fields": [
        {
          "name": "processType",
          "label": "流程类型",
          "type": "select",
          "required": true,
          "description": "选择流程类型，如工单审核、采购审批、航前校验处置等"
        },
        {
          "name": "canvasData",
          "label": "画布数据",
          "type": "json",
          "required": true,
          "description": "包含节点列表、连线列表、节点属性等流程设计数据"
        },
        {
          "name": "approverRoleOrUser",
          "label": "审批人",
          "type": "multi-select",
          "required": true,
          "description": "为每个审批节点指定角色或具体用户（从组织架构选择）"
        },
        {
          "name": "timeoutRule",
          "label": "超时规则",
          "type": "object",
          "required": false,
          "description": "包含超时小时数及转交对象（角色或用户）"
        },
        {
          "name": "transferTarget",
          "label": "转交对象",
          "type": "select",
          "required": false,
          "description": "超时后自动转交的角色或用户"
        },
        {
          "name": "versionLabel",
          "label": "版本标签",
          "type": "text",
          "required": false,
          "description": "发布时创建的版本标识"
        }
      ],
      "actions": [
        {
          "label": "选择流程类型",
          "trigger": "从下拉列表中选择流程类型",
          "feedback": "筛选显示对应流程列表或初始化新流程设计画布"
        },
        {
          "label": "拖拽节点到画布",
          "trigger": "从左侧节点库拖拽节点（开始、审批、条件分支、结束等）到画布",
          "feedback": "节点在画布上显示，并可与现有节点连接"
        },
        {
          "label": "连接节点",
          "trigger": "在画布上从一个节点拖出连接线到另一节点",
          "feedback": "显示连接箭头，形成流程顺序"
        },
        {
          "label": "点击节点打开属性面板",
          "trigger": "点击画布上的节点",
          "feedback": "右侧属性面板显示，可编辑审批人、超时规则、转交策略"
        },
        {
          "label": "保存草稿",
          "trigger": "点击顶部操作栏“保存”按钮",
          "feedback": "保存当前流程设计为草稿版本，提示“保存成功”或失败信息"
        },
        {
          "label": "发布流程",
          "trigger": "点击顶部操作栏“发布”按钮",
          "feedback": "创建新版本并生效，提示“发布成功”；若存在未保存变更则先提示保存"
        },
        {
          "label": "查看版本管理",
          "trigger": "点击顶部操作栏“版本管理”按钮",
          "feedback": "弹出历史版本列表，可选择回滚到指定版本"
        }
      ],
      "validations": [
        "流程类型必须选择",
        "画布至少包含一个开始节点和一个结束节点",
        "每个审批节点必须指定审批人",
        "超时规则若配置，小时数必须大于0",
        "转交对象若指定必须有效（角色或用户）",
        "发布前必须确认流程定义完整且无错误"
      ],
      "states": {
        "empty": "无流程定义时，显示创建引导提示，如“点击选择流程类型开始设计新流程”",
        "loading": "加载流程列表、流程类型或画布数据时显示加载指示器",
        "success": "保存或发布成功后显示成功提示消息",
        "error": "保存失败或网络错误时显示错误提示信息，并建议重试或查看日志"
      },
      "generatedAt": "2026-07-07T00:07:55.384Z"
    },
    "sc-8-page-4-3": {
      "key": "sc-8-page-4-3",
      "name": "配置验证与发布",
      "vueFile": "ConfigSimulation.vue",
      "goal": "支持系统管理员模拟切换视角测试权限和流程，确认无误后正式发布全局配置并记录变更。",
      "features": [
        "配置验证与发布"
      ],
      "sections": [
        "模拟用户/角色选择下拉框",
        "模拟操作区域（菜单导航模拟、流程实例模拟）",
        "配置冲突检查结果列表",
        "全局发布按钮与影响范围确认弹窗",
        "变更日志摘要"
      ],
      "fields": [
        {
          "name": "simulatedRoleId",
          "label": "模拟角色",
          "type": "select",
          "required": true,
          "description": "选择一个角色以查看其权限视图，页面UI将切换为该角色对应的菜单和按钮状态"
        },
        {
          "name": "simulatedUserId",
          "label": "模拟用户",
          "type": "select",
          "required": false,
          "description": "可选，绑定具体用户以执行流程测试（如创建工单、审批），若不选则使用角色默认用户"
        },
        {
          "name": "actionType",
          "label": "模拟操作类型",
          "type": "select",
          "required": true,
          "description": "选择要测试的操作类型：菜单访问或流程提交（如创建工单、审批）"
        }
      ],
      "actions": [
        {
          "label": "开始模拟",
          "trigger": "click",
          "feedback": "切换页面视图为所选角色权限，并启用模拟操作区域；同时显示当前角色可见的菜单和可用操作"
        },
        {
          "label": "执行模拟操作",
          "trigger": "click",
          "feedback": "根据当前选择的模拟操作类型执行对应动作（如创建工单、提交审批），并展示结果（流程节点跳转、操作成功/失败提示）"
        },
        {
          "label": "检查配置冲突",
          "trigger": "click",
          "feedback": "扫描配置并展示冲突列表（如角色重复授权、流程节点指向无效用户）；若无冲突显示“未发现冲突”"
        },
        {
          "label": "正式发布",
          "trigger": "click",
          "feedback": "弹出影响范围确认弹窗，显示影响用户数、正在运行流程数等；确认后发布配置并记录变更日志，显示成功提示"
        },
        {
          "label": "查看变更日志",
          "trigger": "click",
          "feedback": "展开或跳转到变更日志摘要页面，显示变更时间、操作人、变更内容摘要"
        }
      ],
      "validations": [
        "模拟角色不能为空",
        "发布前建议进行冲突检查，以避免影响已运行的流程",
        "发布操作不可撤销，请在确认影响范围后慎重操作"
      ],
      "states": {
        "empty": "当前配置无需验证",
        "loading": "模拟启动或执行中，请稍候",
        "success": "配置发布成功，变更已生效",
        "error": "操作失败，请检查网络或联系管理员"
      },
      "generatedAt": "2026-07-07T00:08:29.051Z"
    },
    "sc-8-page-5-4": {
      "key": "sc-8-page-5-4",
      "name": "审计日志查询",
      "vueFile": "AuditLogView.vue",
      "goal": "集中展示所有用户、角色、权限、流程的变更审计日志，支持检索和导出。",
      "features": [
        "审计日志查询"
      ],
      "sections": [
        "顶部筛选栏（时间范围、操作人、操作对象类型、操作类型）",
        "日志列表表格（操作时间、操作人、操作类型、操作对象、内容摘要）",
        "日志详情抽屉（变更前后对比）",
        "导出按钮"
      ],
      "fields": [
        {
          "name": "startDate",
          "label": "开始时间",
          "type": "date",
          "required": false,
          "description": "筛选起始日期"
        },
        {
          "name": "endDate",
          "label": "结束时间",
          "type": "date",
          "required": false,
          "description": "筛选结束日期"
        },
        {
          "name": "operator",
          "label": "操作人",
          "type": "text",
          "required": false,
          "description": "操作人用户名或IP"
        },
        {
          "name": "objectType",
          "label": "操作对象类型",
          "type": "select",
          "required": false,
          "description": "可选值：用户、角色、流程"
        },
        {
          "name": "actionType",
          "label": "操作类型",
          "type": "select",
          "required": false,
          "description": "可选值：新增、编辑、删除、启用、禁用、发布"
        },
        {
          "name": "exportFormat",
          "label": "导出格式",
          "type": "select",
          "required": true,
          "description": "导出文件格式：Excel或PDF"
        }
      ],
      "actions": [
        {
          "label": "查询",
          "trigger": "click",
          "feedback": "调用GET /api/audit-logs，获取筛选后的日志列表，更新表格数据；若失败显示错误提示"
        },
        {
          "label": "重置",
          "trigger": "click",
          "feedback": "清除所有筛选条件，重新加载无筛选的日志列表"
        },
        {
          "label": "导出",
          "trigger": "click",
          "feedback": "校验当前用户导出权限（审计员/系统管理员），若有权则调用GET /api/audit-logs/export并驱动文件下载，否则提示无权限"
        },
        {
          "label": "查看详情",
          "trigger": "rowClick",
          "feedback": "调用GET /api/audit-logs/:id/detail，获取变更前后对比数据，打开详情抽屉展示"
        }
      ],
      "validations": [
        "开始时间不能晚于结束时间",
        "导出时需确保日期范围在日志保留期限内（默认1年）"
      ],
      "states": {
        "empty": "显示提示文案'无审计记录'，并提供继续筛选的建议",
        "loading": "显示加载中状态，如旋转图标覆盖列表区域",
        "success": "正常显示日志列表表格，支持分页",
        "error": "显示错误提示信息，如'查询失败，请重试'，并提供重试按钮"
      },
      "generatedAt": "2026-07-07T00:08:58.692Z"
    },
    "sc-9-page-1-0": {
      "key": "sc-9-page-1-0",
      "name": "系统运行状态总览仪表盘",
      "vueFile": "SysMonitorDashboard.vue",
      "goal": "集中展示系统整体健康度与关键运行指标，帮助管理员快速掌握系统运行态势",
      "features": [
        "系统运行状态总览仪表盘"
      ],
      "sections": [
        "顶部红色告警横幅（微服务异常或同步成功率低时显示）",
        "指标卡片行：服务在线数/异常数、数据库连接池使用率、CPU/内存/磁盘使用率",
        "统计图表区：资源使用趋势折线图、近24小时同步成功率柱状图",
        "快捷入口按钮区：跳转至告警管理、操作审计、报告生成",
        "筛选器栏：按船舶、模块、时间范围筛选指标（支持自动刷新）"
      ],
      "fields": [
        {
          "name": "shipFilter",
          "label": "船舶",
          "type": "select",
          "required": false,
          "description": "按船舶筛选运行指标"
        },
        {
          "name": "moduleFilter",
          "label": "模块",
          "type": "select",
          "required": false,
          "description": "按模块筛选运行指标"
        },
        {
          "name": "timeRange",
          "label": "时间范围",
          "type": "select",
          "required": false,
          "description": "选择指标展示的时间范围（如24h、7d）"
        },
        {
          "name": "autoRefresh",
          "label": "自动刷新",
          "type": "switch",
          "required": false,
          "description": "开启后每30秒自动刷新仪表盘数据"
        }
      ],
      "actions": [
        {
          "label": "点击微服务异常数卡片",
          "trigger": "click",
          "feedback": "跳转至告警管理页面并预设筛选条件为异常服务"
        },
        {
          "label": "点击同步成功率柱状图某时段",
          "trigger": "click",
          "feedback": "下钻查看该时段内失败船舶列表"
        },
        {
          "label": "切换自动刷新开关",
          "trigger": "change",
          "feedback": "开启或关闭自动刷新定时器（默认每30秒）"
        },
        {
          "label": "鼠标悬停趋势图数据点",
          "trigger": "hover",
          "feedback": "显示该时间点具体数值"
        }
      ],
      "validations": [
        "选择时间范围时，开始时间不得晚于结束时间",
        "自动刷新开启时，若API返回错误应停止刷新并显示异常态"
      ],
      "states": {
        "empty": {
          "description": "首次部署无数据时，展示空态提示：暂无运行数据",
          "feedback": "显示空状态插图及文字说明"
        },
        "loading": {
          "description": "异步获取数据时显示骨架屏",
          "feedback": "骨架屏占位，禁用交互"
        },
        "success": {
          "description": "数据加载成功，正常展示仪表盘",
          "feedback": "所有指标卡片、图表、筛选器可用"
        },
        "error": {
          "description": "API超时或返回错误",
          "feedback": "显示错误提示与重试按钮，自动刷新停止"
        }
      },
      "generatedAt": "2026-07-07T00:09:19.733Z"
    },
    "sc-9-page-2-1": {
      "key": "sc-9-page-2-1",
      "name": "异常告警分级处理与闭环",
      "vueFile": "AlertManagement.vue",
      "goal": "集中管理所有系统异常告警，支持分级响应与处置流程记录",
      "features": [
        "异常告警分级处理与闭环"
      ],
      "sections": [
        "筛选栏：严重程度、告警类型、时间范围、状态（未处理/处理中/已解决）",
        "告警列表表格：类型、级别、描述、影响范围、发生时间、累计次数、状态",
        "告警详情抽屉：告警内容、影响船舶/模块、首次/最近发生时间、关联操作日志列表",
        "处理操作面板：处理措施下拉选择、处理备注输入框、状态更新按钮",
        "历史处理记录查询区：按处理人、处理结果、时间范围检索",
        "批量操作栏：批量标记处理状态"
      ],
      "fields": [
        {
          "name": "severity",
          "label": "严重程度",
          "type": "select",
          "required": false,
          "description": "筛选：紧急、严重、警告、提示"
        },
        {
          "name": "alertType",
          "label": "告警类型",
          "type": "select",
          "required": false,
          "description": "筛选：服务异常、同步失败、资源超标、弱网节点"
        },
        {
          "name": "timeRange",
          "label": "时间范围",
          "type": "date-range",
          "required": false,
          "description": "筛选：告警发生时间范围"
        },
        {
          "name": "status",
          "label": "状态",
          "type": "select",
          "required": false,
          "description": "筛选：未处理、处理中、已解决"
        },
        {
          "name": "handlingMeasures",
          "label": "处理措施",
          "type": "select",
          "required": true,
          "description": "选择处理措施：重启服务、通知运维、调整同步策略、临时忽略等"
        },
        {
          "name": "remark",
          "label": "处理备注",
          "type": "text",
          "required": false,
          "description": "填写处理备注说明"
        },
        {
          "name": "handler",
          "label": "处理人",
          "type": "text",
          "required": false,
          "description": "历史处理记录查询：按处理人检索"
        },
        {
          "name": "handlingResult",
          "label": "处理结果",
          "type": "select",
          "required": false,
          "description": "历史处理记录查询：处理中、已解决等"
        },
        {
          "name": "historyTimeRange",
          "label": "历史时间范围",
          "type": "date-range",
          "required": false,
          "description": "历史处理记录查询：按时间范围检索"
        }
      ],
      "actions": [
        {
          "label": "查看告警详情",
          "trigger": "点击告警行",
          "feedback": "展开告警详情抽屉，显示告警内容、影响范围、首次/最近发生时间、关联操作日志列表"
        },
        {
          "label": "提交处理",
          "trigger": "点击处理操作面板中的状态更新按钮",
          "feedback": "校验处理措施必选后，调用PUT /api/monitor/alerts/{alertId}/handle，更新告警状态为‘处理中’或‘已解决’，并显示成功提示；若校验失败，高亮错误字段"
        },
        {
          "label": "批量标记处理",
          "trigger": "选中多条告警后点击批量操作栏中的标记按钮",
          "feedback": "弹出确认对话框，确认后批量调用更新接口，显示批量处理进度和结果"
        },
        {
          "label": "关联操作日志跳转",
          "trigger": "点击告警详情中的关联操作日志链接",
          "feedback": "跳转至审计日志页面，并携带当前告警ID作为筛选条件"
        },
        {
          "label": "查询历史处理记录",
          "trigger": "点击历史处理记录查询区的查询按钮",
          "feedback": "根据输入的处理人、处理结果、时间范围重新加载历史记录列表"
        }
      ],
      "validations": [
        "处理措施为必选项，提交时必须选择一项",
        "处理备注长度不超过500字符",
        "时间范围筛选的开始日期不能晚于结束日期"
      ],
      "states": {
        "empty": "显示空态提示：‘暂无告警记录’，并提供刷新按钮",
        "loading": "列表区域显示骨架屏或加载动画，操作按钮禁用",
        "success": "列表正常展示，操作成功时显示短暂成功提示（如Toast）",
        "error": "当API不可用时，显示错误提示：‘数据加载失败，请检查网络’，并提供重试按钮"
      },
      "generatedAt": "2026-07-07T00:09:47.844Z"
    },
    "sc-9-page-3-2": {
      "key": "sc-9-page-3-2",
      "name": "操作审计日志精细查询与异常标记",
      "vueFile": "AuditLogSearch.vue",
      "goal": "支持按多维条件检索用户操作日志，辅助合规审计与违规排查",
      "features": [
        "操作审计日志精细查询与异常标记"
      ],
      "sections": [
        "复合筛选面板：时间范围（自定义+快捷选项）、用户角色、操作类型、操作对象",
        "日志结果表格：时间、操作用户、角色、IP地址、操作类型、对象、详情（展开后显示变更前后值）",
        "标记操作栏：单条/批量标记为‘待审核’并添加备注",
        "审核确认栏：对‘待审核’条目执行‘确认’或‘驳回’",
        "导出工具栏：导出CSV/PDF，导出内容含筛选条件摘要"
      ],
      "fields": [
        {
          "name": "startDate",
          "label": "开始时间",
          "type": "date",
          "required": false,
          "description": "筛选的时间范围起始，支持自定义日期"
        },
        {
          "name": "endDate",
          "label": "结束时间",
          "type": "date",
          "required": false,
          "description": "筛选的时间范围结束，支持自定义日期"
        },
        {
          "name": "quickRange",
          "label": "快捷时间范围",
          "type": "select",
          "required": false,
          "description": "预定义时间快捷选项：近7天、近30天、自定义等"
        },
        {
          "name": "userRole",
          "label": "用户角色",
          "type": "multiselect",
          "required": false,
          "description": "按操作者角色筛选，可选：岸基机务/船舶管理/船端作业/系统管理员/审计员/采办协同"
        },
        {
          "name": "operationType",
          "label": "操作类型",
          "type": "multiselect",
          "required": false,
          "description": "按操作类型筛选，可选：登录/数据增删改/权限变更/流程发布/同步操作"
        },
        {
          "name": "operationObject",
          "label": "操作对象",
          "type": "text",
          "required": false,
          "description": "按操作对象模块名称或资源ID模糊筛选"
        },
        {
          "name": "markNote",
          "label": "标记备注",
          "type": "textarea",
          "required": true,
          "description": "标记为待审核时必须填写备注说明"
        },
        {
          "name": "auditDecision",
          "label": "审核决定",
          "type": "select",
          "required": true,
          "description": "对待审核条目执行确认或驳回，选项：确认/驳回"
        }
      ],
      "actions": [
        {
          "label": "查询",
          "trigger": "点击查询按钮",
          "feedback": "触发loading状态，发送GET /api/audit/logs请求，成功后表格更新，失败显示错误提示"
        },
        {
          "label": "展开详情",
          "trigger": "点击日志行中的展开图标",
          "feedback": "发送GET /api/audit/logs/{logId}，在行内展开区域展示变更前后JSON对比"
        },
        {
          "label": "标记待审核",
          "trigger": "勾选单条或多条日志后点击标记按钮，弹出备注输入框",
          "feedback": "输入备注后确认，发送PUT /api/audit/logs/{logId}/mark，标记成功则更新行状态为'待审核'"
        },
        {
          "label": "审核确认",
          "trigger": "在待审核条目上点击确认或驳回",
          "feedback": "发送PUT /api/audit/logs/{logId}/mark（状态为confirmed或rejected），成功后更新条目标记状态"
        },
        {
          "label": "批量审核",
          "trigger": "勾选多条待审核日志后点击确认/驳回按钮",
          "feedback": "依次发送PUT请求，完成后刷新表格并显示汇总结果"
        },
        {
          "label": "导出CSV/PDF",
          "trigger": "点击导出按钮",
          "feedback": "显示导出进度态，发送POST /api/audit/logs/export，生成文件后自动下载"
        }
      ],
      "validations": [
        "标记待审核时备注不可为空",
        "时间范围筛选至少填写一个条件（开始或结束或快捷选项）",
        "导出操作要求当前查询结果非空",
        "审核操作要求选中条目均为待审核状态",
        "快捷时间与自定义时间不可同时使用（互斥）"
      ],
      "states": {
        "empty": "无符合条件的日志数据，显示空态提示",
        "loading": "查询或审核提交过程中显示加载动画",
        "success": "正常显示日志表格及操作结果反馈",
        "error": "查询超时或请求失败时显示错误信息及重试按钮"
      },
      "generatedAt": "2026-07-07T00:10:27.889Z"
    },
    "sc-9-page-4-3": {
      "key": "sc-9-page-4-3",
      "name": "运维报告与合规文档自动生成",
      "vueFile": "ReportGenerator.vue",
      "goal": "定期或按需生成系统运维状况报告与审计合规文档，支撑决策与审查",
      "features": [
        "运维报告与合规文档自动生成"
      ],
      "sections": [
        "报告模板选择区：预设模板列表（运维周报、月报、审计摘要、航前合规汇总）",
        "自定义配置区：选择船舶、时间区间、是否包含告警明细、操作审计摘要等",
        "生成与预览区：一键生成按钮、生成进度条、实时预览（PDF/Word）",
        "定时计划设置区：启动/关闭定时生成，配置cron表达式、接收邮箱",
        "已生成报告列表：按类型、生成时间检索，下载或删除操作"
      ],
      "fields": [
        {
          "name": "templateId",
          "label": "报告模板选择",
          "type": "select",
          "required": true,
          "description": "选择预设报告模板（运维周报、月报、审计摘要、航前合规汇总）"
        },
        {
          "name": "shipNames",
          "label": "船舶选择",
          "type": "multi-select",
          "required": false,
          "description": "选择要包含的船舶，为空则全部"
        },
        {
          "name": "timeRange",
          "label": "时间区间",
          "type": "date-range",
          "required": true,
          "description": "报告覆盖的时间区间"
        },
        {
          "name": "includeAlerts",
          "label": "包含告警明细",
          "type": "checkbox",
          "required": false,
          "description": "是否在报告中包含告警明细"
        },
        {
          "name": "includeAudit",
          "label": "包含操作审计摘要",
          "type": "checkbox",
          "required": false,
          "description": "是否在报告中包含操作审计摘要"
        },
        {
          "name": "cronExpression",
          "label": "定时生成cron表达式",
          "type": "text",
          "required": false,
          "description": "定时生成计划的cron表达式，空表示不启用定时"
        },
        {
          "name": "emailRecipients",
          "label": "接收邮箱",
          "type": "text",
          "required": false,
          "description": "定时生成后报告发送的邮箱列表，多个用分号分隔"
        }
      ],
      "actions": [
        {
          "label": "生成报告",
          "trigger": "点击'生成'按钮",
          "feedback": "显示生成进度条，完成后自动打开预览窗口"
        },
        {
          "label": "预览",
          "trigger": "点击报告项上的'预览'按钮",
          "feedback": "弹出实时预览窗口（PDF/Word）"
        },
        {
          "label": "下载",
          "trigger": "点击报告项上的'下载'按钮",
          "feedback": "触发文件下载"
        },
        {
          "label": "删除",
          "trigger": "点击报告项上的'删除'按钮",
          "feedback": "从已生成列表中移除该报告"
        },
        {
          "label": "保存定时计划",
          "trigger": "点击定时计划设置区的'保存'按钮",
          "feedback": "提示'定时计划已保存'并开启定时任务"
        },
        {
          "label": "切换定时生成",
          "trigger": "点击定时计划设置区的开关",
          "feedback": "启动或关闭定时生成计划，状态实时更新"
        },
        {
          "label": "刷新列表",
          "trigger": "点击'刷新'按钮",
          "feedback": "重新加载已生成报告列表"
        }
      ],
      "validations": [
        "报告模板为必选项",
        "时间区间不能为空且起始日期不能晚于结束日期",
        "若设置了定时计划，cron表达式必须符合格式",
        "若填写了接收邮箱，邮箱格式必须正确"
      ],
      "states": {
        "empty": "无任何报告，展示空状态引导（如提示'暂无报告，请先生成'）",
        "loading": "生成报告或列表加载时显示加载动画或进度条",
        "success": "操作成功，显示成功提示（如'报告生成完成'/'定时计划已保存'）",
        "error": "操作失败，显示错误信息（如'生成失败，请重试'/'网络异常'）"
      },
      "generatedAt": "2026-07-07T00:11:03.215Z"
    },
    "sc-10-page-1-0": {
      "key": "sc-10-page-1-0",
      "name": "审计日志查询与合规审查工作台",
      "vueFile": "AuditLogWorkspace.vue",
      "goal": "审计员在一体化界面中通过多维筛选快速定位操作日志，查看完整详情与变更差异，对异常操作进行合规标记，并按需导出审计报告，所有审计行为自动留痕。",
      "features": [
        "审计日志查询与列表展示",
        "日志详情查看与变更差异对比",
        "合规判定与异常标记",
        "审计报告导出"
      ],
      "sections": [
        "顶部统计摘要区：展示总日志条数及按操作类型/日期的柱状图或饼图",
        "高级筛选面板区：包含时间范围选择器（近7天/30天/自定义）、用户角色下拉、操作类型多选、船舶名称搜索",
        "日志列表区：每行显示操作人、时间、模块、操作类型、状态（正常/待审核/不合规），支持点击展开详情",
        "详情展开面板：以左右对比或内联高亮展示变更前后内容，包含所有元数据字段",
        "操作工具栏：每条日志右侧或详情面板内提供标记按钮（待审核/不合规），以及列表顶部的导出报告按钮"
      ],
      "fields": [
        {
          "name": "timeRange",
          "label": "时间范围",
          "type": "dateRange",
          "required": true,
          "description": "选择日志查询的起止日期，支持快捷选项（近7天、近30天）和自定义。"
        },
        {
          "name": "role",
          "label": "用户角色",
          "type": "select",
          "required": false,
          "description": "按操作人角色筛选，选项来自用户角色枚举列表。"
        },
        {
          "name": "operationTypes",
          "label": "操作类型",
          "type": "multiSelect",
          "required": false,
          "description": "按操作类型多选筛选，选项来自操作类型枚举列表。"
        },
        {
          "name": "vesselName",
          "label": "船舶名称",
          "type": "text",
          "required": false,
          "description": "按船舶名称模糊搜索。"
        },
        {
          "name": "comment",
          "label": "审计意见",
          "type": "textArea",
          "required": true,
          "description": "标记日志时必须填写的审核意见，支持选择预定义模板。"
        },
        {
          "name": "triggerWorkflow",
          "label": "触发审批流程",
          "type": "checkbox",
          "required": false,
          "description": "标记为不合规时可选是否触发审批流程。"
        },
        {
          "name": "exportFormat",
          "label": "导出格式",
          "type": "radio",
          "required": true,
          "description": "选择导出PDF或CSV格式。"
        },
        {
          "name": "exportTitle",
          "label": "报告标题",
          "type": "text",
          "required": true,
          "description": "审计报告标题，默认预填但可修改。"
        },
        {
          "name": "signerName",
          "label": "审计员签名",
          "type": "text",
          "required": false,
          "description": "可选填写审计员姓名，用于报告水印。"
        }
      ],
      "actions": [
        {
          "label": "查询日志",
          "trigger": "点击查询按钮或自动触发（筛选条件变化后）",
          "feedback": "列表刷新并显示加载中骨架屏；统计图同步更新；无匹配时显示空态。"
        },
        {
          "label": "展开/收起日志详情",
          "trigger": "点击日志行",
          "feedback": "详情面板展开或折叠，变更差异区域高亮显示新增（绿色）、删除（红色）；面板含关闭按钮。"
        },
        {
          "label": "标记为待审核",
          "trigger": "点击日志行右侧或详情内的“标记为待审核”按钮",
          "feedback": "弹出标记弹窗，必填审计意见；提交后日志状态更新为黄色‘待审核’；操作自动记录审计痕迹。"
        },
        {
          "label": "标记为不合规",
          "trigger": "点击日志行右侧或详情内的“标记为不合规”按钮",
          "feedback": "弹出标记弹窗，必填审计意见，可选触发审批流程；提交后日志状态更新为红色‘不合规’；若触发审批则流转至审批环节；操作自动记录审计痕迹。"
        },
        {
          "label": "导出报告",
          "trigger": "点击列表顶部的“导出报告”按钮",
          "feedback": "弹出导出配置对话框，选择格式、填写标题和签名；确认后显示生成进度条；完成后提供下载链接并自动记录导出日志。"
        }
      ],
      "validations": [
        "标记日志时comment字段为必填，不能为空。",
        "导出报告时exportFormat与exportTitle为必填。",
        "时间范围timeRange必填，且开始日期不能晚于结束日期。",
        "筛选条件如operationTypes选择后至少一项为有效值。"
      ],
      "states": {
        "empty": "当前筛选条件下无操作日志，请调整查询条件。展示空状态图标和提示文字。",
        "loading": "初次加载或筛选查询时显示骨架屏或加载中动画，所有可交互区域（查询按钮、列表、统计图）置灰不可操作。",
        "success": "加载成功，列表展示日志数据，统计图展示分布，筛选条件保留可继续调整。",
        "error": "接口请求失败时显示错误提示与重试按钮，保留当前已输入筛选条件，以便用户重试。"
      },
      "generatedAt": "2026-07-07T00:11:26.618Z"
    },
    "sc-11-page-1-0": {
      "key": "sc-11-page-1-0",
      "name": "采购需求审核与申请发起",
      "vueFile": "ProcurementRequirementReview.vue",
      "goal": "采办协同人员审核自动生成的采购需求列表，校验预算与BOM关联后发起采购申请",
      "features": [
        "采购需求审核与申请发起"
      ],
      "sections": [
        "筛选与搜索区（物料编码、紧急程度、创建时间）",
        "采购需求列表区（展示待处理需求，含物料编码、名称、数量、建议供应商、状态）",
        "需求详情预览区（点击列表项展开，显示库存、BOM关联、预算余额）",
        "发起采购申请操作区（按钮、弹窗表单：采购说明、交货期限、供应商选择、附件上传）",
        "预算不足提示区（条件触发）"
      ],
      "fields": [
        {
          "name": "materialCode",
          "label": "物料编码",
          "type": "text",
          "required": false,
          "description": "筛选采购需求列表的物料编码"
        },
        {
          "name": "urgencyLevel",
          "label": "紧急程度",
          "type": "select",
          "required": false,
          "description": "筛选采购需求列表的紧急程度，选项如一般、紧急、非常紧急"
        },
        {
          "name": "createTimeRange",
          "label": "创建时间",
          "type": "dateRange",
          "required": false,
          "description": "筛选采购需求列表的创建时间范围"
        },
        {
          "name": "purchaseDescription",
          "label": "采购说明",
          "type": "textarea",
          "required": true,
          "description": "采购申请表单中的采购说明"
        },
        {
          "name": "deliveryDeadline",
          "label": "交货期限",
          "type": "date",
          "required": true,
          "description": "采购申请表单中的交货期限"
        },
        {
          "name": "supplierId",
          "label": "供应商",
          "type": "select",
          "required": true,
          "description": "从合格供应商列表中选择或手动输入，选择时需调用GET /api/suppliers"
        },
        {
          "name": "attachmentFiles",
          "label": "附件",
          "type": "file",
          "required": false,
          "description": "上传询比价附件，支持多文件，格式仅限pdf/jpg/png"
        }
      ],
      "actions": [
        {
          "label": "筛选",
          "trigger": "筛选条件变化（输入或选择后自动触发或点击按钮）",
          "feedback": "重新加载采购需求列表，展示匹配结果"
        },
        {
          "label": "展开/收起需求详情",
          "trigger": "点击需求列表行",
          "feedback": "展开或收起该行的详情预览区，显示库存、BOM关联、预算余额等信息"
        },
        {
          "label": "发起采购申请",
          "trigger": "点击'发起采购申请'按钮",
          "feedback": "弹出采购申请表单弹窗，表单包括采购说明、交货期限、供应商选择、附件上传"
        },
        {
          "label": "提交采购申请",
          "trigger": "点击表单中的'提交'按钮",
          "feedback": "系统校验预算余额，若不足则阻止提交并弹出提示'预算不足，请调整数量或发起预算追加流程'；若通过则提交申请，显示提交成功反馈"
        },
        {
          "label": "供应商选择",
          "trigger": "点击供应商字段下拉或手动输入",
          "feedback": "调用GET /api/suppliers获取合格供应商列表并显示，支持搜索选择"
        },
        {
          "label": "附件上传",
          "trigger": "点击附件上传区域的'选择文件'",
          "feedback": "弹出文件选择对话框，选择后上传并显示文件列表，校验格式及大小"
        }
      ],
      "validations": [
        "采购说明不能为空",
        "交货期限不能为空",
        "供应商不能为空",
        "预算余额不足时，提示'预算不足，请调整数量或发起预算追加流程'",
        "附件格式仅限pdf/jpg/png，且单文件大小不超过10MB"
      ],
      "states": {
        "empty": "暂无待处理的采购需求，列表显示空状态提示",
        "loading": "数据加载中，列表区域显示骨架屏",
        "success": "数据加载成功，列表正常展示；操作提交成功后显示成功提示",
        "error": "数据加载失败，显示错误提示及重试按钮；操作提交失败时显示错误信息"
      },
      "generatedAt": "2026-07-07T00:12:01.898Z"
    },
    "sc-11-page-2-1": {
      "key": "sc-11-page-2-1",
      "name": "采购订单跟踪",
      "vueFile": "ProcurementOrderTracking.vue",
      "goal": "查看采购订单列表，跟踪订单执行状态，接收和更新到货进度",
      "features": [
        "采购订单跟踪"
      ],
      "sections": [
        "筛选与搜索区（订单号、供应商、状态、预计到货时间）",
        "采购订单列表区（显示订单号、物料、金额、供应商、状态、预计到货时间）",
        "订单详情面板（点击订单行展开，展示完整信息及审批历史）",
        "状态更新操作区（手动更新状态按钮，备注输入）",
        "预警提示区（超期未到货时高亮显示）"
      ],
      "fields": [
        {
          "name": "orderNo",
          "label": "订单号",
          "type": "text",
          "required": false,
          "description": "按订单号精确搜索"
        },
        {
          "name": "supplier",
          "label": "供应商",
          "type": "text",
          "required": false,
          "description": "按供应商名称模糊搜索"
        },
        {
          "name": "status",
          "label": "订单状态",
          "type": "select",
          "required": false,
          "description": "可选状态：待发货、已发货、运输中、部分到货、已到货"
        },
        {
          "name": "expectedDeliveryStart",
          "label": "预计到货开始时间",
          "type": "date",
          "required": false,
          "description": "筛选预计到货时间范围的起始日期"
        },
        {
          "name": "expectedDeliveryEnd",
          "label": "预计到货结束时间",
          "type": "date",
          "required": false,
          "description": "筛选预计到货时间范围的结束日期"
        },
        {
          "name": "newStatus",
          "label": "新状态",
          "type": "select",
          "required": true,
          "description": "更新订单状态至：待发货、已发货、运输中、部分到货、已到货"
        },
        {
          "name": "remark",
          "label": "备注",
          "type": "textarea",
          "required": false,
          "description": "状态更新时的补充说明"
        }
      ],
      "actions": [
        {
          "label": "点击订单行",
          "trigger": "click on order row",
          "feedback": "展开/收起订单详情面板，显示完整信息及审批历史"
        },
        {
          "label": "更新状态",
          "trigger": "click on '更新状态' button",
          "feedback": "弹出状态选择弹窗，用户选择新状态并输入备注后提交，系统更新订单状态并刷新列表，成功时显示成功提示"
        },
        {
          "label": "到货通知跳转",
          "trigger": "当订单状态变为'已到货'时自动触发",
          "feedback": "弹出到货提醒，并提供'去验收'按钮，点击跳转到验收页面"
        }
      ],
      "validations": [
        "更新状态时，若选择'部分到货'或'已到货'，备注必填"
      ],
      "states": {
        "empty": "列表无数据时展示暂无采购订单提示",
        "loading": "列表数据加载中显示加载骨架屏或loading图标",
        "success": "数据正常加载显示列表",
        "error": "列表加载失败显示错误信息及重试按钮"
      },
      "generatedAt": "2026-07-07T00:12:38.761Z"
    },
    "sc-11-page-3-2": {
      "key": "sc-11-page-3-2",
      "name": "到货验收与入库处理",
      "vueFile": "GoodsReceiptAndInspection.vue",
      "goal": "对已到货的物资进行扫码验收，录入检验结果，执行入库或退换货操作",
      "features": [
        "到货验收与入库处理"
      ],
      "sections": [
        "订单选择区（下拉选择或搜索待验收的采购订单）",
        "条码扫描/手动录入区（支持摄像头扫描或输入框）",
        "物料明细核对区（显示订单物料、应到数量、实到数量输入框、外观检验结果选择）",
        "附件上传区（照片、质检报告）",
        "检验结论与操作区（合格/部分合格/不合格按钮，入库/退换货确认）",
        "历史记录与跟踪区（入库记录、退换货单列表）"
      ],
      "fields": [
        {
          "name": "orderId",
          "label": "待验收采购订单",
          "type": "select",
          "required": true,
          "description": "通过下拉选择或搜索待验收的采购订单，加载订单物料信息"
        },
        {
          "name": "barcode",
          "label": "物料条码",
          "type": "text",
          "required": true,
          "description": "支持摄像头扫描或手动输入，用于快速定位物料"
        },
        {
          "name": "receivedQuantity",
          "label": "实到数量",
          "type": "number",
          "required": true,
          "description": "实际到货的物料数量"
        },
        {
          "name": "appearanceResult",
          "label": "外观检验结果",
          "type": "radio",
          "required": true,
          "description": "选项：合格、不合格"
        },
        {
          "name": "attachments",
          "label": "附件（照片/质检报告）",
          "type": "file",
          "required": false,
          "description": "支持多文件上传，用于佐证检验结论"
        },
        {
          "name": "defectReason",
          "label": "不合格原因及处理意见",
          "type": "textarea",
          "required": false,
          "description": "仅在检验结论为不合格或部分不合格时必填，用于发起退换货"
        }
      ],
      "actions": [
        {
          "label": "确认验收",
          "trigger": "点击按钮，触发检验结论弹窗（合格/部分合格/不合格）",
          "feedback": "根据选择执行入库或退换货：合格则自动更新库存台账并核减预算，显示成功信息；部分合格则部分入库+部分退换货；不合格则全部退换货，生成退换货单并通知供应商"
        },
        {
          "label": "选择订单",
          "trigger": "从订单选择下拉框中选中一项",
          "feedback": "自动加载该订单的物料列表，高亮显示物料行"
        },
        {
          "label": "扫描条码",
          "trigger": "摄像头扫描或手动输入条码",
          "feedback": "自动定位到对应物料行，若无法识别则给出错误提示"
        },
        {
          "label": "上传附件",
          "trigger": "选择文件或拍照上传",
          "feedback": "表格相应行显示已上传附件列表，支持预览和删除"
        },
        {
          "label": "提交退换货",
          "trigger": "在退换货弹窗中填写原因并确认",
          "feedback": "生成退换货单，关闭弹窗，列表刷新显示新退换货记录"
        }
      ],
      "validations": [
        "必须选择待验收采购订单",
        "物料条码不能为空，且至少与一个订单物料匹配",
        "实到数量必须为大于等于0的整数",
        "外观检验结果必须选择合格或不合格",
        "当整体检验结论为不合格或部分不合格时，必须填写不合格原因及处理意见",
        "附件上传限制文件类型为图片（jpg/png）、PDF，单文件大小不超过20MB"
      ],
      "states": {
        "empty": {
          "description": "暂无待验收的采购订单，显示空态提示",
          "view": "展示文字提示‘暂无待验收的采购订单’，隐藏操作区域"
        },
        "loading": {
          "description": "订单加载中或扫描识别中",
          "view": "显示加载动画，禁用相关操作按钮"
        },
        "success": {
          "description": "入库或退换货操作成功",
          "view": "显示成功反馈弹窗，自动刷新数据或跳转"
        },
        "error": {
          "description": "条码无法识别、订单信息不匹配或校验失败",
          "view": "显示错误提示，高亮异常字段，允许重新操作"
        }
      },
      "generatedAt": "2026-07-07T00:13:07.552Z"
    }
  },
  "generatedApiByPageKey": {
    "sc-1-page-1-0": {
      "key": "api-sc-1-page-1-0",
      "method": "GET",
      "name": "获取设备维保计划资产树",
      "path": "/api/equipment-tree",
      "goal": "获取设备资产树及各设备维保计划状态，同时返回统计信息（计划总数、即将到期数、缺失数）",
      "trigger": "页面加载时调用，状态筛选或全局搜索条件变更时重新调用",
      "requestParams": [
        {
          "name": "type",
          "type": "string",
          "required": true,
          "description": "固定值 maintenance-plan-status"
        },
        {
          "name": "statusFilter",
          "type": "string",
          "required": false,
          "description": "按计划状态筛选，多选以逗号分隔：未制定,审核中,已生效,即将到期,已过期"
        },
        {
          "name": "globalSearch",
          "type": "string",
          "required": false,
          "description": "设备名称或编号关键字，用于资产树实时过滤"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "成功",
        "data": {
          "tree": [
            {
              "id": "node-id",
              "name": "节点名称",
              "type": "system|area|equipment",
              "children": [],
              "planStatus": "未制定|审核中|已生效|即将到期|已过期"
            }
          ],
          "stats": {
            "total": 100,
            "dueSoon": 15,
            "missing": 5
          }
        },
        "traceId": "全局唯一追踪ID"
      },
      "errorResponse": {
        "code": 500,
        "message": "服务器内部错误",
        "data": null,
        "traceId": "全局唯一追踪ID"
      },
      "errorCodes": [
        {
          "code": "EAM_SYNC_FAIL",
          "meaning": "EAM数据同步异常或未完成同步",
          "frontendAdvice": "提示用户确认EAM同步状态，优先展示缓存数据（若有）"
        },
        {
          "code": "TREE_DATA_EMPTY",
          "meaning": "资产树无任何设备数据",
          "frontendAdvice": "显示空状态插画及提示：暂无设备数据，请确认EAM同步是否完成，并提供刷新按钮"
        }
      ],
      "sourcePageKey": "sc-1-page-1-0"
    },
    "sc-1-page-2-1": {
      "key": "api-sc-1-page-2-1",
      "method": "POST",
      "name": "创建预防性维护计划",
      "path": "/api/maintenance-plans",
      "goal": "新建一个预防性维护计划，提交后进入审核流程",
      "trigger": "用户在表单填写完整并通过冲突检测后，点击'提交审核'按钮",
      "requestParams": [
        {
          "name": "equipmentIds",
          "type": "array",
          "required": true,
          "description": "所选设备ID列表（从设备树选择）"
        },
        {
          "name": "planType",
          "type": "string",
          "required": true,
          "description": "计划类型：CALENDAR / HOURS / CONDITION"
        },
        {
          "name": "cycleValue",
          "type": "number",
          "required": true,
          "description": "周期数值"
        },
        {
          "name": "cycleUnit",
          "type": "string",
          "required": true,
          "description": "周期单位：DAY, WEEK, MONTH, YEAR, HOUR"
        },
        {
          "name": "startDate",
          "type": "string",
          "required": true,
          "description": "起始日期，格式yyyy-MM-dd"
        },
        {
          "name": "advanceWarningDays",
          "type": "number",
          "required": false,
          "description": "前置预警天数"
        },
        {
          "name": "priority",
          "type": "string",
          "required": true,
          "description": "优先级：HIGH, MEDIUM, LOW"
        },
        {
          "name": "workOrderTemplateId",
          "type": "string",
          "required": false,
          "description": "关联工单模板ID"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "创建成功",
        "data": {
          "id": "string",
          "status": "PENDING_REVIEW",
          "createdAt": "2024-01-01T12:00:00Z"
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 400,
        "message": "请求参数校验失败或存在冲突",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": "PLAN_CONFLICT",
          "meaning": "所选设备在设定时段内存在已有生效计划",
          "frontendAdvice": "展示冲突列表，请用户调整后再提交"
        },
        {
          "code": "INVALID_PARAM",
          "meaning": "参数校验失败（如周期数值非正、日期早于当天）",
          "frontendAdvice": "高亮对应字段并显示错误提示"
        },
        {
          "code": "TEMPLATE_NOT_FOUND",
          "meaning": "关联的工单模板不存在",
          "frontendAdvice": "提示用户重新选择工单模板"
        }
      ],
      "sourcePageKey": "sc-1-page-2-1"
    },
    "sc-1-page-3-2": {
      "key": "api-sc-1-page-3-2",
      "method": "POST",
      "name": "提交审批操作（通过/驳回）",
      "path": "/api/approvals/{id}/action",
      "goal": "对指定的计划变更申请执行通过或驳回操作，并记录审批意见",
      "trigger": "用户在审批详情面板中填写意见后点击“通过”或“驳回”按钮，并在确认弹窗中确认后触发",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": true,
          "description": "审批申请的唯一标识，通过路径参数传递"
        },
        {
          "name": "action",
          "type": "string",
          "required": true,
          "description": "审批操作类型：through（通过）或 reject（驳回）"
        },
        {
          "name": "comment",
          "type": "string",
          "required": false,
          "description": "审批意见，建议填写；当系统配置审批意见必填时，必须提供"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "审批操作成功",
        "data": {
          "approvalId": "approval-12345",
          "status": "approved",
          "updatedAt": "2025-03-24T10:30:00Z"
        },
        "traceId": "trace-abc123"
      },
      "errorResponse": {
        "code": 400,
        "message": "审批操作失败",
        "data": null,
        "traceId": "trace-def456"
      },
      "errorCodes": [
        {
          "code": "400",
          "meaning": "请求参数错误（如缺少必填字段、action值无效）",
          "frontendAdvice": "检查请求参数是否完整且合法，提示用户修正输入"
        },
        {
          "code": "404",
          "meaning": "审批申请记录不存在",
          "frontendAdvice": "提示用户该申请可能已被删除或无效，建议刷新列表"
        },
        {
          "code": "409",
          "meaning": "审批状态冲突（该申请已处理或流程不允许当前操作）",
          "frontendAdvice": "提示用户该申请已被他人处理，请刷新列表查看最新状态"
        },
        {
          "code": "500",
          "meaning": "服务器内部错误",
          "frontendAdvice": "提示用户操作失败，稍后重试"
        }
      ],
      "sourcePageKey": "sc-1-page-3-2"
    },
    "sc-2-page-1-0": {
      "key": "api-sc-2-page-1-0",
      "method": "POST",
      "name": "创建航前健康检查任务",
      "path": "/api/voyage-health/check-tasks",
      "goal": "手动发起航前健康检查任务，系统创建检查任务并开始执行预设规则校验",
      "trigger": "用户在手动发起检查对话框中选择船舶后点击确认按钮",
      "requestParams": [
        {
          "name": "shipId",
          "type": "string",
          "required": true,
          "description": "船舶唯一标识"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "taskId": "string",
          "status": "pending",
          "shipId": "string",
          "createdAt": "string"
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 1001,
        "message": "错误描述",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": 400,
          "meaning": "请求参数错误，如缺少shipId或shipId格式无效",
          "frontendAdvice": "检查输入参数，提示用户重新选择船舶"
        },
        {
          "code": 404,
          "meaning": "船舶不存在或已失效",
          "frontendAdvice": "提示用户船舶信息异常，刷新列表或联系管理员"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "提示用户操作失败，稍后重试"
        }
      ],
      "sourcePageKey": "sc-2-page-1-0"
    },
    "sc-2-page-2-1": {
      "key": "api-sc-2-page-2-1",
      "method": "GET",
      "name": "获取健康校验总览",
      "path": "/api/voyage-health/check-summary",
      "goal": "获取当前船舶健康校验的总览数据，包括健康分数、拦截状态、分类结果和问题清单",
      "trigger": "进入看板页时自动调用",
      "requestParams": [
        {
          "name": "shipId",
          "type": "string",
          "required": true,
          "description": "船舶唯一标识"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "healthScore": 90,
          "sailingInterceptStatus": "allow",
          "categoryResults": [
            {
              "category": "设备维保",
              "passCount": 12,
              "failCount": 2
            },
            {
              "category": "物资库存",
              "passCount": 20,
              "failCount": 1
            },
            {
              "category": "证书资质",
              "passCount": 8,
              "failCount": 0
            }
          ],
          "issueList": [
            {
              "id": "i123",
              "type": "设备维保",
              "description": "主机润滑油压力低",
              "severity": "high"
            },
            {
              "id": "i124",
              "type": "物资库存",
              "description": "救生圈缺失",
              "severity": "critical"
            }
          ]
        },
        "traceId": "uuid"
      },
      "errorResponse": {
        "code": 500,
        "message": "内部服务错误",
        "data": null,
        "traceId": "uuid"
      },
      "errorCodes": [
        {
          "code": 400,
          "meaning": "请求参数错误，如缺少shipId",
          "frontendAdvice": "检查shipId是否传递"
        },
        {
          "code": 404,
          "meaning": "未找到该船舶的健康校验数据",
          "frontendAdvice": "提示用户船舶信息不存在"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "提示稍后重试"
        }
      ],
      "sourcePageKey": "sc-2-page-2-1"
    },
    "sc-2-page-3-2": {
      "key": "api-sc-2-page-3-2",
      "method": "GET",
      "name": "获取不通过项详情",
      "path": "/api/voyage-health/issues/{issueId}",
      "goal": "展示单个不通过项的详细信息和关联数据，包括基本信息、关联对象、过期/逾期时间、严重等级、物料/工单/证书列表以及处置进度",
      "trigger": "页面加载时或从列表页点击跳转时",
      "requestParams": [
        {
          "name": "issueId",
          "type": "string",
          "required": true,
          "description": "不通过项的唯一标识，路径参数"
        }
      ],
      "successResponse": {
        "code": "0",
        "message": "success",
        "data": {
          "issueId": "string",
          "title": "string",
          "type": "string",
          "severity": "string",
          "relatedObjectId": "string",
          "relatedObjectType": "string",
          "expiredDate": "string",
          "overdueDays": "integer",
          "status": "string",
          "overdueWorkOrders": [
            {
              "workOrderId": "string",
              "description": "string",
              "dueDate": "string"
            }
          ],
          "missingMaterials": [
            {
              "materialId": "string",
              "name": "string",
              "requiredQuantity": "integer"
            }
          ],
          "expiredCertificates": [
            {
              "certificateId": "string",
              "name": "string",
              "expiryDate": "string"
            }
          ],
          "disposalProgress": [
            {
              "disposalType": "string",
              "status": "string",
              "createdAt": "string",
              "updatedAt": "string"
            }
          ]
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": "string",
        "message": "string",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": "404",
          "meaning": "不通过项不存在或已被删除",
          "frontendAdvice": "显示'问题不存在'提示，引导用户返回列表页"
        },
        {
          "code": "403",
          "meaning": "当前用户无权限查看该不通过项",
          "frontendAdvice": "显示'无权限'提示，并提供联系管理员指引"
        },
        {
          "code": "500",
          "meaning": "服务器内部错误",
          "frontendAdvice": "显示'服务器繁忙，请稍后再试'，并提供重试按钮"
        }
      ],
      "sourcePageKey": "sc-2-page-3-2"
    },
    "sc-2-page-4-3": {
      "key": "api-sc-2-page-4-3",
      "method": "GET",
      "name": "获取校验记录列表",
      "path": "/api/voyage-health/reports",
      "goal": "分页查询历次航前健康检查记录，用于列表展示和状态更新",
      "trigger": "页面加载、搜索筛选按钮点击、报告生成后刷新列表",
      "requestParams": [
        {
          "name": "shipId",
          "type": "string",
          "required": true,
          "description": "船舶ID，必填参数"
        },
        {
          "name": "dateRange",
          "type": "string",
          "required": false,
          "description": "日期范围，格式：startDate,endDate，示例：2024-01-01,2024-01-31"
        },
        {
          "name": "status",
          "type": "string",
          "required": false,
          "description": "筛选状态：reportStatus（生成中/已生成/已归档）或sailingStatus（允许/拦截），支持组合"
        },
        {
          "name": "page",
          "type": "integer",
          "required": false,
          "description": "当前页码，默认1"
        },
        {
          "name": "pageSize",
          "type": "integer",
          "required": false,
          "description": "每页条数，默认20"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "查询成功",
        "data": {
          "total": 100,
          "list": [
            {
              "reportId": "rpt-001",
              "shipId": "ship-123",
              "shipName": "海神号",
              "taskId": "task-456",
              "inspectionDate": "2024-01-15",
              "reportStatus": "已生成",
              "sailingStatus": "允许",
              "reportDownloadUrl": "/api/voyage-health/reports/rpt-001/download",
              "interceptedIssues": 0,
              "generateTime": "2024-01-15T10:30:00Z"
            },
            {
              "reportId": "rpt-002",
              "shipId": "ship-124",
              "shipName": "远洋号",
              "taskId": "task-789",
              "inspectionDate": "2024-01-14",
              "reportStatus": "生成中",
              "sailingStatus": "拦截",
              "reportDownloadUrl": "",
              "interceptedIssues": 3,
              "generateTime": "2024-01-14T14:20:00Z"
            }
          ]
        },
        "traceId": "trace-xxxx"
      },
      "errorResponse": {
        "code": 400,
        "message": "参数校验失败",
        "data": null,
        "traceId": "trace-xxxx"
      },
      "errorCodes": [
        {
          "code": "400",
          "meaning": "请求参数错误（如缺少必填参数shipId、日期格式错误）",
          "frontendAdvice": "检查输入参数是否完整且合法，提示用户修正"
        },
        {
          "code": "500",
          "meaning": "服务器内部错误",
          "frontendAdvice": "稍后重试，若持续报错请联系管理员"
        }
      ],
      "sourcePageKey": "sc-2-page-4-3"
    },
    "sc-3-page-1-0": {
      "key": "api-sc-3-page-1-0",
      "method": "GET",
      "name": "工单执行跟踪列表查询",
      "path": "/api/workOrders",
      "goal": "为岸基机务人员提供待审核/已完成工单的聚合视图，支持按船舶、设备、工单类型、状态、时间范围等多维筛选和分页排序",
      "trigger": "页面初始化、点击搜索按钮、切换分页、切换排序、点击状态标签快速筛选",
      "requestParams": [
        {
          "name": "status",
          "type": "string",
          "required": false,
          "description": "工单状态，多选用逗号分隔，如 '待审核,已通过,需整改'，默认'待审核'"
        },
        {
          "name": "shipId",
          "type": "string",
          "required": false,
          "description": "船舶ID，来自船舶名称下拉选择"
        },
        {
          "name": "equipmentId",
          "type": "string",
          "required": false,
          "description": "设备资产树节点ID，联动船舶选择"
        },
        {
          "name": "type",
          "type": "string",
          "required": false,
          "description": "工单类型，多选用逗号分隔，如 '预防性,纠正性,紧急'"
        },
        {
          "name": "startDate",
          "type": "string",
          "required": false,
          "description": "报工开始日期，格式 yyyy-MM-dd，配合endDate使用"
        },
        {
          "name": "endDate",
          "type": "string",
          "required": false,
          "description": "报工结束日期，格式 yyyy-MM-dd"
        },
        {
          "name": "page",
          "type": "integer",
          "required": false,
          "description": "页码，从1开始，默认1"
        },
        {
          "name": "size",
          "type": "integer",
          "required": false,
          "description": "每页条数，默认20"
        },
        {
          "name": "sort",
          "type": "string",
          "required": false,
          "description": "排序字段和方向，如 'priority,desc' 或 'reportTime,asc'"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "成功",
        "data": {
          "records": [
            {
              "workOrderId": "string",
              "workOrderNo": "string",
              "equipmentName": "string",
              "priority": "string",
              "reportTime": "string",
              "status": "string"
            }
          ],
          "total": 0,
          "page": 1,
          "size": 20
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 500,
        "message": "服务器内部错误",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": 400,
          "meaning": "请求参数错误",
          "frontendAdvice": "检查筛选条件参数是否正确"
        },
        {
          "code": 401,
          "meaning": "未登录或权限不足",
          "frontendAdvice": "提示用户登录，跳转登录页"
        },
        {
          "code": 403,
          "meaning": "无权限访问该资源",
          "frontendAdvice": "显示权限不足提示"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "显示错误提示，提供重试按钮"
        }
      ],
      "sourcePageKey": "sc-3-page-1-0"
    },
    "sc-3-page-2-1": {
      "key": "api-sc-3-page-2-1",
      "method": "POST",
      "name": "审核工单",
      "path": "/api/workOrders/{workOrderId}/audit",
      "goal": "处理工单审核决策，支持通过或退回操作，并更新工单状态及生成相关记录",
      "trigger": "用户点击审核通过或退回整改按钮并确认后",
      "requestParams": [
        {
          "name": "workOrderId",
          "type": "string",
          "required": true,
          "description": "工单ID，路径参数"
        },
        {
          "name": "action",
          "type": "string",
          "required": true,
          "description": "审核动作：approve（通过）或 reject（退回）"
        },
        {
          "name": "opinion",
          "type": "string",
          "required": true,
          "description": "审核意见，必填"
        },
        {
          "name": "reworkRequirements",
          "type": "string",
          "required": false,
          "description": "退回时必填，整改要求（至少一项：补全数据、重新执行、更换物料、其他），多个用逗号分隔"
        },
        {
          "name": "otherRequirementText",
          "type": "string",
          "required": false,
          "description": "当整改要求选择'其他'时填写的自由文本"
        },
        {
          "name": "attachment",
          "type": "string",
          "required": false,
          "description": "附件（图片/视频/文档），支持多文件，传入文件ID或URL列表，JSON字符串"
        },
        {
          "name": "opinionForApproval",
          "type": "string",
          "required": false,
          "description": "通过时的可选备注"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "操作成功",
        "data": {
          "workOrderId": "string",
          "status": "已闭环|需整改",
          "auditRecordId": "string",
          "auditor": "string",
          "auditTime": "string"
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 400,
        "message": "请求参数错误",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": 4001,
          "meaning": "工单ID无效或工单状态不允许审核（如已闭环）",
          "frontendAdvice": "提示用户工单已闭环或不存在，并返回列表"
        },
        {
          "code": 4002,
          "meaning": "退回时审核意见或整改要求缺失",
          "frontendAdvice": "提示用户填写必填项"
        },
        {
          "code": 4003,
          "meaning": "当前用户无审核权限",
          "frontendAdvice": "提示用户联系管理员获取权限"
        },
        {
          "code": 5000,
          "meaning": "服务器内部错误",
          "frontendAdvice": "提示用户稍后重试或联系技术支持"
        }
      ],
      "sourcePageKey": "sc-3-page-2-1"
    },
    "sc-4-page-sc4-1-0": {
      "key": "api-sc-4-page-sc4-1-0",
      "method": "GET",
      "name": "获取船舶状态列表",
      "path": "/api/vessels/status",
      "goal": "返回所有在管船舶的实时位置、航速、作业状态和通信连接状态，支持按船舶名称、航线、作业状态、通信状态筛选，用于船舶运行监控总览页面的地图/列表展示",
      "trigger": "页面加载时自动发起请求；后续每10秒轮询或通过WebSocket实时推送更新",
      "requestParams": [
        {
          "name": "vesselName",
          "type": "string",
          "required": false,
          "description": "船舶名称关键字模糊搜索"
        },
        {
          "name": "route",
          "type": "string",
          "required": false,
          "description": "航线筛选，取值由后台配置"
        },
        {
          "name": "operationalStatus",
          "type": "string",
          "required": false,
          "description": "作业状态筛选，可选值：航行、作业、停泊"
        },
        {
          "name": "communicationStatus",
          "type": "string",
          "required": false,
          "description": "通信状态筛选，可选值：在线、弱网、离线"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "success",
        "data": {
          "items": [
            {
              "vesselId": "string",
              "vesselName": "string",
              "position": {
                "lat": "number",
                "lng": "number"
              },
              "speed": "number",
              "operationalStatus": "string",
              "communicationStatus": "string",
              "updateTime": "string (ISO 8601)"
            }
          ],
          "total": "number"
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 400,
        "message": "请求参数错误",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": 401,
          "meaning": "未授权，需登录",
          "frontendAdvice": "跳转至登录页"
        },
        {
          "code": 403,
          "meaning": "无权限访问该资源",
          "frontendAdvice": "提示用户无权限"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "显示错误提示并提供重试按钮"
        }
      ],
      "sourcePageKey": "sc-4-page-sc4-1-0"
    },
    "sc-4-page-sc4-2-1": {
      "key": "api-sc-4-page-sc4-2-1",
      "method": "GET",
      "name": "获取单船运行详情",
      "path": "/api/vessels/{id}/detail",
      "goal": "返回选定船舶的当前航次、工单执行进度、航前健康校验结果以及船员证书有效期预警数据，为看板展示提供数据支撑。",
      "trigger": "页面加载时自动调用",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": true,
          "description": "船舶唯一标识符，路径参数"
        }
      ],
      "successResponse": {
        "code": "200",
        "message": "success",
        "data": {
          "voyage": {
            "voyageNumber": "string",
            "departurePort": "string",
            "destinationPort": "string",
            "plannedDepartureTime": "string (ISO 8601)",
            "estimatedArrivalTime": "string (ISO 8601)"
          },
          "workOrders": [
            {
              "id": "string",
              "type": "string",
              "status": "string (待执行/执行中/已完成)",
              "plannedTime": "string (ISO 8601)",
              "description": "string"
            }
          ],
          "healthCheckItems": [
            {
              "id": "string",
              "category": "string",
              "status": "string (通过/不通过)",
              "detail": "string",
              "attachments": [
                "string"
              ],
              "relatedOrderId": "string",
              "relatedMaterialId": "string",
              "relatedCertificateId": "string"
            }
          ],
          "certificateWarnings": [
            {
              "certificateName": "string",
              "holderName": "string",
              "expiryDate": "string (YYYY-MM-DD)",
              "warningLevel": "string (normal/warning/expired)"
            }
          ]
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": "string",
        "message": "string",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": "404",
          "meaning": "未找到指定船舶",
          "frontendAdvice": "跳转回总览页，并提示用户船舶不存在或已删除"
        },
        {
          "code": "500",
          "meaning": "服务器内部错误",
          "frontendAdvice": "显示通用错误提示，并提供重试按钮"
        },
        {
          "code": "503",
          "meaning": "服务暂时不可用",
          "frontendAdvice": "显示加载超时或服务繁忙提示，支持手动刷新"
        }
      ],
      "sourcePageKey": "sc-4-page-sc4-2-1"
    },
    "sc-4-page-sc4-3-2": {
      "key": "api-sc-4-page-sc4-3-2",
      "method": "POST",
      "name": "创建并下发调度指令",
      "path": "/api/dispatch-commands",
      "goal": "创建调度指令并下发至船端系统，触发状态流转至已下发",
      "trigger": "用户在调度指令编辑表单填写完毕，点击'下发调度指令'按钮并确认后调用",
      "requestParams": [
        {
          "name": "vesselId",
          "type": "string",
          "required": true,
          "description": "目标船舶ID，支持从总览页传入预填"
        },
        {
          "name": "voyageNumber",
          "type": "string",
          "required": false,
          "description": "航次号，可选填，系统可自动生成"
        },
        {
          "name": "departureTime",
          "type": "string",
          "required": true,
          "description": "出发时间，格式ISO 8601，必须晚于当前时间"
        },
        {
          "name": "estimatedArrivalTime",
          "type": "string",
          "required": true,
          "description": "预计到达时间，格式ISO 8601，必须晚于出发时间"
        },
        {
          "name": "route",
          "type": "string",
          "required": true,
          "description": "航线标识或手工输入的航线名称"
        },
        {
          "name": "taskRequirements",
          "type": "string",
          "required": true,
          "description": "任务要求文本描述"
        }
      ],
      "successResponse": {
        "code": "0",
        "message": "调度指令下发成功",
        "data": {
          "dispatchCommandId": "string",
          "status": "已下发",
          "createdAt": "2025-03-20T10:00:00Z"
        },
        "traceId": "uuid"
      },
      "errorResponse": {
        "code": "string",
        "message": "错误描述",
        "data": null,
        "traceId": "uuid"
      },
      "errorCodes": [
        {
          "code": "VALIDATION_ERROR",
          "meaning": "参数校验失败",
          "frontendAdvice": "根据后端返回的具体校验错误提示用户修正表单字段"
        },
        {
          "code": "VESSEL_NOT_FOUND",
          "meaning": "船舶ID不存在",
          "frontendAdvice": "提示用户船舶信息异常，请重新选择船舶"
        },
        {
          "code": "ROUTE_NOT_FOUND",
          "meaning": "选择的航线不存在",
          "frontendAdvice": "提示用户航线无效，请重新选择或手动输入"
        },
        {
          "code": "SCHEDULE_CONFLICT",
          "meaning": "该船舶在指定时间段已有冲突的调度指令",
          "frontendAdvice": "提示用户时间冲突，建议调整出发或到达时间"
        },
        {
          "code": "DISPATCH_FAILED",
          "meaning": "下发至船端失败",
          "frontendAdvice": "提示用户下发失败，请稍后重试或联系系统管理员"
        }
      ],
      "sourcePageKey": "sc-4-page-sc4-3-2"
    },
    "sc-5-page-1-0": {
      "key": "api-sc-5-page-1-0",
      "method": "GET",
      "name": "获取船舶同步概览",
      "path": "/api/v1/sync/shipments/summary",
      "goal": "获取所有已注册船舶的同步状态概览，支持按同步状态筛选",
      "trigger": "页面加载时、手动刷新按钮点击时、筛选下拉切换时",
      "requestParams": [
        {
          "name": "syncStatusFilter",
          "type": "string",
          "required": false,
          "description": "按同步状态筛选，可选值：normal/abnormal/unsynced，为空则返回全部"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "成功",
        "data": {
          "ships": [
            {
              "shipId": "string",
              "shipName": "string",
              "communicationStatus": "online|offline",
              "lastSyncTime": "datetime",
              "pendingPackages": 0,
              "conflicts": 0,
              "failures": 0,
              "syncStatus": "normal|abnormal|unsynced"
            }
          ]
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": -1,
        "message": "错误描述",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": 1001,
          "meaning": "船舶同步心跳异常",
          "frontendAdvice": "提示用户稍后重试或联系管理员"
        },
        {
          "code": 1002,
          "meaning": "船舶信息不存在",
          "frontendAdvice": "提示船舶未注册，引导注册"
        },
        {
          "code": 1003,
          "meaning": "请求参数错误",
          "frontendAdvice": "检查筛选参数值是否合法"
        }
      ],
      "sourcePageKey": "sc-5-page-1-0"
    },
    "sc-5-page-2-1": {
      "key": "api-sc-5-page-2-1",
      "method": "GET",
      "name": "查询同步任务列表",
      "path": "/api/v1/sync/tasks",
      "goal": "获取符合筛选条件的同步任务列表，支持分页和多条件筛选",
      "trigger": "页面加载、切换标签页、更改筛选条件、分页切换时自动发起",
      "requestParams": [
        {
          "name": "shipId",
          "type": "string",
          "required": false,
          "description": "船舶ID，为空表示全部船舶"
        },
        {
          "name": "type",
          "type": "string",
          "required": false,
          "description": "数据类型，枚举：工单报工、盘点结果、附件图片"
        },
        {
          "name": "status",
          "type": "string",
          "required": false,
          "description": "状态，枚举：待上传、上传中、已同步、冲突、失败"
        },
        {
          "name": "startTime",
          "type": "string",
          "required": false,
          "description": "起始时间，ISO8601格式"
        },
        {
          "name": "endTime",
          "type": "string",
          "required": false,
          "description": "结束时间，ISO8601格式"
        },
        {
          "name": "page",
          "type": "integer",
          "required": true,
          "description": "页码，从1开始"
        },
        {
          "name": "pageSize",
          "type": "integer",
          "required": true,
          "description": "每页条数，默认20"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "total": 100,
          "page": 1,
          "pageSize": 20,
          "list": [
            {
              "id": "string",
              "shipId": "string",
              "type": "string",
              "status": "string",
              "createdAt": "string",
              "sourceTerminal": "string",
              "shipVersion": "string",
              "dataSize": "integer",
              "failReason": "string",
              "updatedAt": "string"
            }
          ]
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 1001,
        "message": "参数错误",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": 1001,
          "meaning": "请求参数校验失败",
          "frontendAdvice": "检查筛选条件是否合法"
        },
        {
          "code": 1002,
          "meaning": "船舶不存在",
          "frontendAdvice": "提示用户重新选择船舶"
        },
        {
          "code": 2001,
          "meaning": "服务器内部错误",
          "frontendAdvice": "显示错误提示并允许重试"
        },
        {
          "code": 2002,
          "meaning": "数据查询超时",
          "frontendAdvice": "提示稍后重试"
        }
      ],
      "sourcePageKey": "sc-5-page-2-1"
    },
    "sc-5-page-3-2": {
      "key": "api-sc-5-page-3-2",
      "method": "POST",
      "name": "提交冲突解决",
      "path": "/api/v1/sync/conflicts/{conflictId}/resolve",
      "goal": "提交冲突字段的合并结果，更新岸端数据并标记冲突为已解决，记录操作日志。",
      "trigger": "用户在冲突解决面板完成所有差异字段选择后点击“提交解决”按钮。",
      "requestParams": [
        {
          "name": "conflictId",
          "type": "string",
          "required": true,
          "description": "冲突记录ID，从路径参数传入。"
        },
        {
          "name": "resolutions",
          "type": "array",
          "required": true,
          "description": "冲突字段解决列表，每项包含 fieldId (string), selectedVersion (enum: 'boat'|'shore'|'manual'), manualValue (string, 当 selectedVersion='manual' 时必填)。"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "冲突解决成功",
        "data": {
          "taskId": "string",
          "newStatus": "synced",
          "dataVersion": "string"
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 400,
        "message": "请求参数错误",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": "CONFLICT_ALREADY_RESOLVED",
          "meaning": "该冲突已被其他用户解决，当前提交无效。",
          "frontendAdvice": "提示用户“冲突已被解决，请刷新页面查看最新状态”，并刷新任务详情。"
        },
        {
          "code": "INVALID_RESOLUTION",
          "meaning": "提交的解决数据校验失败（例如缺少必填字段、字段值类型错误）。",
          "frontendAdvice": "根据具体错误信息提示用户修正字段选择，如“字段甲的手动编辑值不能为空”。"
        },
        {
          "code": "NEW_VERSION_OCCURRED",
          "meaning": "解决过程中船端上传了新版本，当前差异已过期。",
          "frontendAdvice": "弹出提示“有新版本产生，请重新加载比对”，强制重新获取差异。"
        }
      ],
      "sourcePageKey": "sc-5-page-3-2"
    },
    "sc-5-page-4-3": {
      "key": "api-sc-5-page-4-3",
      "method": "GET",
      "name": "查询同步审计日志",
      "path": "/api/v1/sync/audit-log",
      "goal": "根据筛选条件分页查询同步操作及人工干预的审计日志列表，支撑列表展示与统计看板的数据来源。",
      "trigger": "用户切换筛选条件（船舶、日期范围、操作类型）或切换分页时自动触发。",
      "requestParams": [
        {
          "name": "shipId",
          "type": "string",
          "required": true,
          "description": "船舶唯一标识，必选，选项来自船舶基础信息接口。"
        },
        {
          "name": "startTime",
          "type": "string",
          "required": true,
          "description": "起始日期，格式 yyyy-MM-dd。"
        },
        {
          "name": "endTime",
          "type": "string",
          "required": true,
          "description": "结束日期，格式 yyyy-MM-dd，不能早于 startTime。"
        },
        {
          "name": "actionType",
          "type": "string",
          "required": false,
          "description": "操作类型筛选，多选时以逗号分隔，可选值：AUTO_SYNC,MANUAL_RETRY,CONFLICT_RESOLVE,IGNORE。"
        },
        {
          "name": "page",
          "type": "integer",
          "required": true,
          "description": "当前页码，从1开始。"
        },
        {
          "name": "size",
          "type": "integer",
          "required": true,
          "description": "每页记录数，默认20。"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "success",
        "data": {
          "list": [
            {
              "logId": "string",
              "shipName": "string",
              "operateTime": "string",
              "operator": "string",
              "operateDesc": "string",
              "result": "string",
              "detailUrl": "string"
            }
          ],
          "total": 0
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 400,
        "message": "参数校验失败",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": 400,
          "meaning": "请求参数缺失或格式错误",
          "frontendAdvice": "检查 shipId、日期范围、分页参数是否完整且合法。"
        },
        {
          "code": 403,
          "meaning": "当前用户无权限查看审计日志",
          "frontendAdvice": "提示用户权限不足，联系管理员授权。"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "显示'数据加载失败，请稍后重试'。"
        }
      ],
      "sourcePageKey": "sc-5-page-4-3"
    },
    "sc-6-page-1-0": {
      "key": "api-sc-6-page-1-0",
      "method": "GET",
      "name": "获取待执行工单列表",
      "path": "/api/workorders",
      "goal": "在联网状态下获取当前船舶待执行的工单列表，用于填充页面列表并同步本地缓存",
      "trigger": "页面加载、下拉刷新、空态重试",
      "requestParams": [
        {
          "name": "shipId",
          "type": "string",
          "required": true,
          "description": "当前船舶唯一标识"
        },
        {
          "name": "status",
          "type": "string",
          "required": false,
          "description": "工单状态筛选，默认待执行，可选待执行、执行中"
        },
        {
          "name": "deviceType",
          "type": "string",
          "required": false,
          "description": "设备类型筛选"
        },
        {
          "name": "priority",
          "type": "string",
          "required": false,
          "description": "优先级筛选（高、中、低）"
        },
        {
          "name": "sortBy",
          "type": "string",
          "required": false,
          "description": "排序字段，可选planDate（计划日期）、priority"
        },
        {
          "name": "sortOrder",
          "type": "string",
          "required": false,
          "description": "排序方向，asc或desc"
        },
        {
          "name": "page",
          "type": "integer",
          "required": false,
          "description": "当前页码"
        },
        {
          "name": "pageSize",
          "type": "integer",
          "required": false,
          "description": "每页条数"
        }
      ],
      "successResponse": {
        "code": "0",
        "message": "成功",
        "data": {
          "total": 100,
          "list": [
            {
              "workOrderId": "WO20231001",
              "workOrderNo": "WO20231001",
              "deviceName": "主机润滑油泵",
              "deviceLocation": "机舱底层",
              "priority": "高",
              "planDate": "2025-03-15",
              "status": "待执行",
              "description": "更换润滑油泵密封件",
              "attachmentUrls": [
                "https://.../drawing1.pdf",
                "https://.../manual.pdf"
              ]
            }
          ]
        },
        "traceId": "a1b2c3d4"
      },
      "errorResponse": {
        "code": "ERROR",
        "message": "请求失败，请稍后重试",
        "data": null,
        "traceId": "x1y2z3"
      },
      "errorCodes": [
        {
          "code": "401",
          "meaning": "未登录或会话过期",
          "frontendAdvice": "跳转登录页并提示用户重新登录"
        },
        {
          "code": "403",
          "meaning": "无权限访问该船舶的工单",
          "frontendAdvice": "提示用户无权限并联系管理员"
        },
        {
          "code": "500",
          "meaning": "服务器内部错误",
          "frontendAdvice": "显示错误提示，自动重试一次"
        },
        {
          "code": "1001",
          "meaning": "船舶标识无效",
          "frontendAdvice": "检查当前船舶信息并重新加载"
        }
      ],
      "sourcePageKey": "sc-6-page-1-0"
    },
    "sc-6-page-2-1": {
      "key": "api-sc-6-page-2-1",
      "method": "GET",
      "name": "获取工单详情",
      "path": "/api/workorders/{id}",
      "goal": "离线展示工单完整详情，包括设备信息、维保步骤、物料清单、附件元数据",
      "trigger": "从工单列表页跳转至详情页时触发",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": true,
          "description": "工单ID，作为路径参数"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "成功",
        "data": {
          "id": "string",
          "workOrderNumber": "string",
          "statusLabel": "string",
          "equipmentName": "string",
          "model": "string",
          "location": "string",
          "maintenanceType": "string",
          "assetTreePath": "string",
          "stepList": [
            {
              "stepId": "string",
              "orderNo": 0,
              "description": "string",
              "tools": "string",
              "materials": "string",
              "safetyTips": "string"
            }
          ],
          "materialList": [
            {
              "materialCode": "string",
              "name": "string",
              "model": "string",
              "planQuantity": 0,
              "actualStockLocation": "string",
              "availableQuantity": 0
            }
          ],
          "attachmentList": [
            {
              "fileType": "string",
              "localCachePath": "string",
              "fileSize": 0
            }
          ]
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 404,
        "message": "工单不存在或数据异常",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": 404,
          "meaning": "工单ID不存在或已删除",
          "frontendAdvice": "提示用户工单不可见，返回列表页"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "提示用户稍后重试，返回列表页"
        }
      ],
      "sourcePageKey": "sc-6-page-2-1"
    },
    "sc-6-page-3-2": {
      "key": "api-sc-6-page-3-2",
      "method": "POST",
      "name": "提交报工数据",
      "path": "/api/workorders/{id}/report",
      "goal": "将离线报工数据批量同步至服务端，完成维保工单的正式报工记录",
      "trigger": "离线数据同步时调用（如网络恢复后自动触发或手动点击同步按钮）",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": true,
          "description": "工单ID，路径参数，标识报工所属工单"
        },
        {
          "name": "stepReports",
          "type": "array",
          "required": true,
          "description": "步骤执行报告列表，每项包含步骤ID、实际开始时间(ISO 8601)、实际结束时间、执行人、异常备注"
        },
        {
          "name": "materialConsumptions",
          "type": "array",
          "required": true,
          "description": "物料消耗列表，每项包含物料编码、消耗数量"
        },
        {
          "name": "mediaFiles",
          "type": "array",
          "required": false,
          "description": "多媒体文件列表，每项包含本地路径（待上传）、文件哈希、关联步骤ID"
        },
        {
          "name": "reportSubmitTime",
          "type": "string",
          "required": true,
          "description": "报工提交时间（ISO 8601），用于版本冲突判断"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "报工提交成功",
        "data": {
          "reportId": "string",
          "syncStatus": "synced"
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 400,
        "message": "请求参数错误",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": 4000,
          "meaning": "请求参数校验失败（如必填字段缺失、时间格式错误）",
          "frontendAdvice": "检查报工数据完整性，提示用户补充必填项"
        },
        {
          "code": 4040,
          "meaning": "工单ID不存在",
          "frontendAdvice": "返回工单列表页，重新选择有效工单"
        },
        {
          "code": 4090,
          "meaning": "版本冲突（服务端已有更新版本）",
          "frontendAdvice": "提示用户确认是否覆盖，或保留服务端版本"
        },
        {
          "code": 5000,
          "meaning": "服务器内部错误",
          "frontendAdvice": "提示稍后重试，或联系管理员"
        }
      ],
      "sourcePageKey": "sc-6-page-3-2"
    },
    "sc-6-page-4-3": {
      "key": "api-sc-6-page-4-3",
      "method": "POST",
      "name": "强制同步待同步工单",
      "path": "/api/sync/trigger",
      "goal": "触发后台同步任务，服务端获取所有待同步工单并启动同步流程",
      "trigger": "用户点击「手动同步」按钮",
      "requestParams": [
        {
          "name": "field1",
          "type": "string",
          "required": true,
          "description": "支撑「离线缓存与自动同步管理」中的同步概览区：网络状态、待同步工单数、上次同步时间、存储使用量展示或录入。"
        },
        {
          "name": "field2",
          "type": "string",
          "required": true,
          "description": "支撑「离线缓存与自动同步管理」中的同步队列区：表格展示每项工单的同步状态（待同步/同步中/已完成/失败）、重试次数、提交时间展示或录入。"
        },
        {
          "name": "field3",
          "type": "string",
          "required": false,
          "description": "支撑「离线缓存与自动同步管理」中的冲突列表区：若有冲突，展示工单ID、差异对比（岸端版本 vs 本地版本）、解决状态，提供“使用本地”、“使用岸端”、“标记待岸基处理”操作展示或录入。"
        },
        {
          "name": "field4",
          "type": "string",
          "required": false,
          "description": "支撑「离线缓存与自动同步管理」中的手动触发按钮：强制同步所有待同步工单展示或录入。"
        },
        {
          "name": "field5",
          "type": "string",
          "required": false,
          "description": "支撑「离线缓存与自动同步管理」中的缓存管理区：清理已同步数据、清理全部缓存（含附件）展示或录入。"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "同步任务已启动",
        "data": {
          "taskId": "uuid",
          "totalCount": 10,
          "estimatedTimeSeconds": 30
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 500,
        "message": "同步任务启动失败",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": 503,
          "meaning": "服务端正在处理同步，请稍后重试",
          "frontendAdvice": "提示用户同步队列繁忙，稍后再试"
        },
        {
          "code": 400,
          "meaning": "请求参数错误（预留）",
          "frontendAdvice": "检查网络状态后重试"
        }
      ],
      "sourcePageKey": "sc-6-page-4-3"
    },
    "sc-7-page-1-0": {
      "key": "api-sc-7-page-1-0",
      "method": "GET",
      "name": "获取工作台概览数据",
      "path": "/api/inventory/workbench",
      "goal": "为物资盘点领用工作台提供聚合数据，包括待办任务（按盘点/领料/退料分组）、同步进度概览、最近操作记录以及网络状态和相关版本信息。",
      "trigger": "页面加载、下拉刷新（触发版本检测后调用）、手动点击同步按钮后刷新工作台状态",
      "requestParams": [
        {
          "name": "shipId",
          "type": "string",
          "required": false,
          "description": "船舶编号，未传递时默认为当前登录用户所属船舶"
        },
        {
          "name": "localVersion",
          "type": "string",
          "required": false,
          "description": "本地数据版本号，用于服务端判断是否需要增量更新；空时返回全量数据"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "networkStatus": "online|weak|offline",
          "localDataVersion": "v20250315",
          "tasks": {
            "count": {
              "inventory": 3,
              "picking": 5,
              "return": 2
            },
            "list": [
              {
                "type": "inventory",
                "taskId": "INV-001",
                "title": "A区物资盘点",
                "dueDate": "2025-03-18",
                "status": "pending"
              }
            ]
          },
          "syncStatus": {
            "pendingCount": 2,
            "failedCount": 0,
            "lastSyncTime": "2025-03-17T10:30:00Z"
          },
          "recentOperations": [
            {
              "type": "inventory",
              "materialName": "螺栓M10",
              "operationTime": "2025-03-17T09:00:00Z",
              "status": "synced"
            }
          ]
        },
        "traceId": "a1b2c3d4"
      },
      "errorResponse": {
        "code": -1,
        "message": "获取工作台数据失败",
        "data": null,
        "traceId": "e5f6g7h8"
      },
      "errorCodes": [
        {
          "code": 1001,
          "meaning": "本地缓存数据损坏或无法读取",
          "frontendAdvice": "提示用户缓存异常，引导清除本地缓存并重新加载基础数据"
        },
        {
          "code": 1002,
          "meaning": "服务端数据库连接失败或超时",
          "frontendAdvice": "显示网络异常提示，建议用户检查网络后重试；降级展示本地缓存数据"
        },
        {
          "code": 1003,
          "meaning": "用户身份校验失败（token过期等）",
          "frontendAdvice": "跳转登录页面要求重新认证"
        }
      ],
      "sourcePageKey": "sc-7-page-1-0"
    },
    "sc-7-page-2-1": {
      "key": "api-sc-7-page-2-1",
      "method": "POST",
      "name": "提交盘点差异",
      "path": "/api/inventory/physicalCount",
      "goal": "将用户录入的实物盘点数据（条码、实物数量、证据附件等）提交至服务端，生成盘点差异记录并标记待同步",
      "trigger": "用户点击“提交盘点”按钮，且通过前端验证（条码非空、实物数量为0或正整数、已识别物料或已确认未知物料）",
      "requestParams": [
        {
          "name": "taskId",
          "type": "string",
          "required": false,
          "description": "盘点任务ID（从工作台传入），用于关联任务"
        },
        {
          "name": "userId",
          "type": "string",
          "required": true,
          "description": "当前操作用户ID"
        },
        {
          "name": "barcode",
          "type": "string",
          "required": true,
          "description": "手动输入或摄像头识别的条码"
        },
        {
          "name": "materialCode",
          "type": "string",
          "required": false,
          "description": "识别后自动填充的物料编码（若条码无法识别则可为空）"
        },
        {
          "name": "materialName",
          "type": "string",
          "required": false,
          "description": "识别后自动填充的物料名称"
        },
        {
          "name": "systemInventory",
          "type": "number",
          "required": false,
          "description": "从本地缓存获取的系统库存数量"
        },
        {
          "name": "actualQuantity",
          "type": "number",
          "required": true,
          "description": "用户录入的实物清点数量，必须为0或正整数"
        },
        {
          "name": "attachmentMedia",
          "type": "array",
          "required": false,
          "description": "拍照或视频文件列表（Base64或本地路径），每项含类型（image/video）和内容"
        },
        {
          "name": "remark",
          "type": "string",
          "required": false,
          "description": "用户额外备注（仅在提交时可选）"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "盘点差异提交成功",
        "data": {
          "recordId": "string",
          "status": "待同步",
          "createdAt": "datetime"
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 400,
        "message": "请求参数错误",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": "40001",
          "meaning": "条码不能为空",
          "frontendAdvice": "请检查条码输入或重新扫描"
        },
        {
          "code": "40002",
          "meaning": "实物数量必须为0或正整数",
          "frontendAdvice": "请重新输入有效的实物数量"
        },
        {
          "code": "40003",
          "meaning": "该条码已在当前盘点任务中提交，不可重复提交",
          "frontendAdvice": "请使用继续扫描功能扫描其他物料"
        },
        {
          "code": "40010",
          "meaning": "服务端系统库存查询失败或离线缓存不一致",
          "frontendAdvice": "请稍后重试，或确认网络连接后同步"
        },
        {
          "code": "50000",
          "meaning": "服务端内部错误",
          "frontendAdvice": "提交失败，请稍后重试"
        }
      ],
      "sourcePageKey": "sc-7-page-2-1"
    },
    "sc-7-page-3-2": {
      "key": "api-sc-7-page-3-2",
      "method": "POST",
      "name": "创建领料单",
      "path": "/api/inventory/requisition",
      "goal": "提交领料申请，校验库存并扣减本地库存，生成待同步领料单",
      "trigger": "用户点击“提交领料”按钮，且前端通过字段校验和数量校验后",
      "requestParams": [
        {
          "name": "materialCode",
          "type": "string",
          "required": true,
          "description": "物料编码，手动输入或扫描自动填充"
        },
        {
          "name": "quantity",
          "type": "number",
          "required": true,
          "description": "领用数量，需大于0且不超过库存可用量"
        },
        {
          "name": "purpose",
          "type": "string",
          "required": true,
          "description": "用途说明"
        },
        {
          "name": "relatedOrder",
          "type": "string",
          "required": false,
          "description": "关联工单号，可选；若有则必须为进行中状态"
        },
        {
          "name": "urgencyNote",
          "type": "string",
          "required": false,
          "description": "紧急度说明，当触发缺件预警时补充"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "领料单创建成功",
        "data": {
          "requisitionId": "string",
          "materialCode": "string",
          "quantity": "number",
          "purpose": "string",
          "relatedOrder": "string",
          "urgencyNote": "string",
          "createdAt": "string",
          "operator": "string"
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 400,
        "message": "请求参数错误或业务校验失败",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": 4001,
          "meaning": "物料编码不存在或已禁用",
          "frontendAdvice": "提示用户检查物料编码，重新输入或扫描"
        },
        {
          "code": 4002,
          "meaning": "领用数量超过库存可用量",
          "frontendAdvice": "触发缺件预警，允许用户补充紧急度说明后再次提交，或调整数量"
        },
        {
          "code": 4003,
          "meaning": "关联工单无效或非进行中状态",
          "frontendAdvice": "提示用户选择正确的进行中工单"
        },
        {
          "code": 4004,
          "meaning": "必填字段缺失",
          "frontendAdvice": "提示用户填写所有必填项"
        },
        {
          "code": 5000,
          "meaning": "服务器内部错误",
          "frontendAdvice": "提示用户稍后重试，并记录日志"
        }
      ],
      "sourcePageKey": "sc-7-page-3-2"
    },
    "sc-7-page-4-3": {
      "key": "api-sc-7-page-4-3",
      "method": "POST",
      "name": "创建退料单",
      "path": "/api/inventory/return",
      "goal": "提交退料申请，增加本地库存并生成待同步退料单",
      "trigger": "用户点击提交按钮，且前端校验通过",
      "requestParams": [
        {
          "name": "materialCode",
          "type": "string",
          "required": true,
          "description": "物料编码，通过条码扫描或手动输入"
        },
        {
          "name": "returnQuantity",
          "type": "number",
          "required": true,
          "description": "退料数量，必须大于0且不超过最大可退量"
        },
        {
          "name": "returnReason",
          "type": "string",
          "required": true,
          "description": "退料原因枚举值：工单剩余、物料质量问题、误领等"
        },
        {
          "name": "remark",
          "type": "string",
          "required": false,
          "description": "备注信息"
        },
        {
          "name": "evidencePhoto",
          "type": "string",
          "required": false,
          "description": "当退料原因为\"物料质量问题\"时必填，拍照证据的Base64或文件标识"
        }
      ],
      "successResponse": {
        "code": "0",
        "message": "成功",
        "data": {
          "returnId": "string",
          "materialCode": "string",
          "returnQuantity": "number",
          "returnReason": "string",
          "remark": "string",
          "evidencePhoto": "string",
          "createdTime": "string",
          "status": "pendingSync"
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": "string",
        "message": "string",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": "RETURN_QUANTITY_EXCEED",
          "meaning": "退料数量超过最大可退量",
          "frontendAdvice": "在前端实时校验并阻止提交，显示红色提示"
        }
      ],
      "sourcePageKey": "sc-7-page-4-3"
    },
    "sc-7-page-5-4": {
      "key": "api-sc-7-page-5-4",
      "method": "GET",
      "name": "查询同步状态",
      "path": "/api/sync/status",
      "goal": "获取当前船舶的离线数据同步状态及同步队列列表，包含统计和详细记录",
      "trigger": "进入页面时自动调用，也用于下拉刷新",
      "requestParams": [
        {
          "name": "shipId",
          "type": "string",
          "required": true,
          "description": "船舶唯一标识，从当前登录船端上下文获取"
        },
        {
          "name": "status",
          "type": "string",
          "required": false,
          "description": "按状态筛选，如待同步、同步中、成功、失败、冲突（不传则返回全部）"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "success",
        "data": {
          "syncSummary": {
            "pending": 12,
            "syncing": 3,
            "success": 45,
            "failed": 2,
            "conflict": 1,
            "totalProgress": 0.8
          },
          "syncItems": [
            {
              "id": "sync-001",
              "dataType": "盘点差异",
              "materialName": "轴承A",
              "operationTime": "2025-03-20 14:30:00",
              "status": "failed",
              "retryCount": 2,
              "conflictDetail": null
            },
            {
              "id": "sync-002",
              "dataType": "领料单",
              "materialName": "螺栓M10",
              "operationTime": "2025-03-20 15:00:00",
              "status": "conflict",
              "retryCount": 0,
              "conflictDetail": {
                "localVersion": {
                  "quantity": 10
                },
                "remoteVersion": {
                  "quantity": 8
                },
                "diffFields": [
                  "quantity"
                ]
              }
            }
          ]
        },
        "traceId": "a1b2c3d4"
      },
      "errorResponse": {
        "code": 500,
        "message": "服务器错误",
        "data": null,
        "traceId": "e5f6g7h8"
      },
      "errorCodes": [
        {
          "code": 400,
          "meaning": "请求参数错误，如缺少shipId或格式不正确",
          "frontendAdvice": "检查船舶标识参数，重新请求"
        },
        {
          "code": 401,
          "meaning": "未授权，船舶未登录或令牌失效",
          "frontendAdvice": "跳转至登录页面重新获取令牌"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "提示用户稍后重试，或联系管理员"
        },
        {
          "code": 503,
          "meaning": "服务暂时不可用（可能岸基网络不通）",
          "frontendAdvice": "提示网络异常，稍后自动重试"
        }
      ],
      "sourcePageKey": "sc-7-page-5-4"
    },
    "sc-8-page-1-0": {
      "key": "api-sc-8-page-1-0",
      "method": "GET",
      "name": "用户列表查询",
      "path": "/api/users",
      "goal": "分页查询用户列表，支持按部门、角色、状态和关键词筛选",
      "trigger": "页面加载、点击搜索按钮、切换筛选条件或改变分页时触发",
      "requestParams": [
        {
          "name": "page",
          "type": "integer",
          "required": true,
          "description": "当前页码，从1开始"
        },
        {
          "name": "size",
          "type": "integer",
          "required": true,
          "description": "每页记录数"
        },
        {
          "name": "keyword",
          "type": "string",
          "required": false,
          "description": "按账号或姓名模糊搜索"
        },
        {
          "name": "departmentId",
          "type": "string",
          "required": false,
          "description": "部门ID筛选"
        },
        {
          "name": "roleId",
          "type": "string",
          "required": false,
          "description": "角色ID筛选"
        },
        {
          "name": "status",
          "type": "string",
          "required": false,
          "description": "用户状态：enabled/disabled"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "查询成功",
        "data": {
          "total": 0,
          "records": [
            {
              "id": "",
              "account": "",
              "name": "",
              "departmentId": "",
              "departmentName": "",
              "contact": "",
              "roleIds": [],
              "roleNames": [],
              "status": "enabled",
              "createdAt": ""
            }
          ],
          "page": 0,
          "size": 0
        },
        "traceId": ""
      },
      "errorResponse": {
        "code": 400,
        "message": "请求参数错误",
        "data": null,
        "traceId": ""
      },
      "errorCodes": [
        {
          "code": 400,
          "meaning": "参数校验失败",
          "frontendAdvice": "检查请求参数是否符合要求"
        },
        {
          "code": 401,
          "meaning": "未授权",
          "frontendAdvice": "用户未登录，请重新登录"
        },
        {
          "code": 403,
          "meaning": "权限不足",
          "frontendAdvice": "当前用户无权限查看用户列表"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "请稍后重试或联系管理员"
        }
      ],
      "sourcePageKey": "sc-8-page-1-0"
    },
    "sc-8-page-2-1": {
      "key": "api-sc-8-page-2-1",
      "method": "PUT",
      "name": "更新角色信息与权限",
      "path": "/api/roles/{roleId}",
      "goal": "更新指定角色的基本信息与权限配置",
      "trigger": "用户修改权限树或角色信息后点击保存，或权限树自动保存",
      "requestParams": [
        {
          "name": "roleId",
          "type": "string",
          "required": true,
          "description": "角色唯一标识"
        },
        {
          "name": "roleName",
          "type": "string",
          "required": true,
          "description": "角色名称"
        },
        {
          "name": "description",
          "type": "string",
          "required": false,
          "description": "角色描述"
        },
        {
          "name": "permissions",
          "type": "object",
          "required": true,
          "description": "权限配置对象，包含模块及操作权限"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "操作成功",
        "data": {
          "id": "string",
          "roleName": "string",
          "description": "string",
          "permissions": {}
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 400,
        "message": "请求参数错误",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": 4001,
          "meaning": "角色名称已存在",
          "frontendAdvice": "请更换角色名称"
        },
        {
          "code": 4002,
          "meaning": "权限配置无效",
          "frontendAdvice": "请检查权限选择"
        },
        {
          "code": 4003,
          "meaning": "角色不存在",
          "frontendAdvice": "请刷新页面后重试"
        }
      ],
      "sourcePageKey": "sc-8-page-2-1"
    },
    "sc-8-page-3-2": {
      "key": "api-sc-8-page-3-2",
      "method": "POST",
      "name": "保存流程定义（草稿）",
      "path": "/api/workflows",
      "goal": "将当前画布上的流程设计保存为草稿版本，支持新建或更新已有流程定义。",
      "trigger": "用户点击顶部操作栏“保存”按钮时调用",
      "requestParams": [
        {
          "name": "processType",
          "type": "string",
          "required": true,
          "description": "流程类型枚举，如 WORK_ORDER_APPROVAL、PURCHASE_APPROVAL、VOYAGE_CHECK"
        },
        {
          "name": "canvasData",
          "type": "object",
          "required": true,
          "description": "包含节点列表、连线列表、节点属性的JSON对象，节点至少包含开始和结束节点"
        },
        {
          "name": "approverRoleOrUser",
          "type": "array",
          "required": true,
          "description": "每个审批节点所需的审批人指定，元素为{nodeId, approverType(role/user), approverId}"
        },
        {
          "name": "timeoutRule",
          "type": "object",
          "required": false,
          "description": "超时规则，包含hours(整数)和transferTarget(角色ID或用户ID列表)"
        },
        {
          "name": "transferTarget",
          "type": "string",
          "required": false,
          "description": "超时后自动转交的角色ID或用户ID，仅在timeoutRule存在时有效"
        },
        {
          "name": "versionLabel",
          "type": "string",
          "required": false,
          "description": "当前草稿版本标签，若不传则系统自动生成"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "保存成功",
        "data": {
          "id": "流程定义ID",
          "name": "流程名称",
          "processType": "流程类型",
          "canvasData": "保存后的画布数据（带版本号）",
          "status": "DRAFT",
          "createdAt": "ISO日期",
          "updatedAt": "ISO日期"
        },
        "traceId": "请求追踪标识"
      },
      "errorResponse": {
        "code": 400,
        "message": "保存失败，参数校验未通过",
        "data": null,
        "traceId": "请求追踪标识"
      },
      "errorCodes": [
        {
          "code": 400,
          "meaning": "请求参数错误（例如缺少流程类型、画布数据不合法）",
          "frontendAdvice": "检查必填字段是否完整，画布数据格式是否正确"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "提示用户稍后重试，并记录日志"
        }
      ],
      "sourcePageKey": "sc-8-page-3-2"
    },
    "sc-8-page-4-3": {
      "key": "api-sc-8-page-4-3",
      "method": "POST",
      "name": "正式发布配置",
      "path": "/api/config/publish",
      "goal": "将当前已验证的配置正式发布至全局生效，并记录变更日志与影响范围",
      "trigger": "用户点击“正式发布”按钮并确认影响范围弹窗后触发",
      "requestParams": [
        {
          "name": "confirmImpact",
          "type": "boolean",
          "required": true,
          "description": "是否已确认影响范围（如影响用户数、正在运行流程数）"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "配置发布成功，变更已生效",
        "data": {
          "changeLogId": "string",
          "affectedUserCount": 0,
          "affectedProcessCount": 0
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 400,
        "message": "发布失败，请检查冲突或网络",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": 400,
          "meaning": "请求参数错误，如未确认影响范围",
          "frontendAdvice": "请确认影响范围后重试"
        },
        {
          "code": 409,
          "meaning": "存在未解决的配置冲突，无法发布",
          "frontendAdvice": "请先检查并解决配置冲突后再发布"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "请联系管理员或稍后重试"
        }
      ],
      "sourcePageKey": "sc-8-page-4-3"
    },
    "sc-8-page-5-4": {
      "key": "api-sc-8-page-5-4",
      "method": "GET",
      "name": "查询审计日志列表",
      "path": "/api/audit-logs",
      "goal": "根据筛选条件分页查询审计日志记录",
      "trigger": "页面加载/点击查询按钮/点击重置按钮",
      "requestParams": [
        {
          "name": "startDate",
          "type": "string",
          "required": false,
          "description": "筛选起始日期，格式 yyyy-MM-dd"
        },
        {
          "name": "endDate",
          "type": "string",
          "required": false,
          "description": "筛选结束日期，格式 yyyy-MM-dd"
        },
        {
          "name": "operator",
          "type": "string",
          "required": false,
          "description": "操作人用户名或IP"
        },
        {
          "name": "objectType",
          "type": "string",
          "required": false,
          "description": "操作对象类型：用户、角色、流程"
        },
        {
          "name": "actionType",
          "type": "string",
          "required": false,
          "description": "操作类型：新增、编辑、删除、启用、禁用、发布"
        },
        {
          "name": "page",
          "type": "integer",
          "required": true,
          "description": "页码，从1开始"
        },
        {
          "name": "pageSize",
          "type": "integer",
          "required": true,
          "description": "每页条数"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "成功",
        "data": {
          "records": [
            {
              "id": "string",
              "operationTime": "string",
              "operator": "string",
              "operatorIp": "string",
              "actionType": "string",
              "objectType": "string",
              "objectId": "string",
              "objectName": "string",
              "summary": "string",
              "detailUrl": "string"
            }
          ],
          "total": 0,
          "page": 1,
          "pageSize": 20
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 400,
        "message": "请求参数无效",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": 400,
          "meaning": "请求参数格式错误或缺少必填参数",
          "frontendAdvice": "检查输入参数，确保日期格式正确、分页参数为正整数"
        },
        {
          "code": 403,
          "meaning": "无权限访问审计日志",
          "frontendAdvice": "提示用户权限不足，请联系管理员"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "显示'查询失败，请稍后重试'并提供重试按钮"
        }
      ],
      "sourcePageKey": "sc-8-page-5-4"
    },
    "sc-9-page-1-0": {
      "key": "api-sc-9-page-1-0",
      "method": "GET",
      "name": "获取系统运行状态总览",
      "path": "/api/monitor/overview",
      "goal": "返回系统整体健康度、关键运行指标及摘要统计，支持按船舶、模块和时间范围筛选",
      "trigger": "页面加载、筛选条件变化或自动刷新定时器触发时调用",
      "requestParams": [
        {
          "name": "shipFilter",
          "type": "string",
          "required": false,
          "description": "船舶标识，用于筛选特定船舶的运行指标"
        },
        {
          "name": "moduleFilter",
          "type": "string",
          "required": false,
          "description": "模块标识，用于筛选特定模块的运行指标"
        },
        {
          "name": "timeRange",
          "type": "string",
          "required": false,
          "description": "指标展示的时间范围，枚举值：24h, 7d, 30d，默认24h"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "成功",
        "data": {
          "healthStatus": {
            "overallHealth": "healthy|warning|critical",
            "serviceCount": 10,
            "healthyServiceCount": 9,
            "errorServiceCount": 1,
            "offlineServiceCount": 0,
            "dbPoolUsage": 0.65,
            "cpuUsage": 0.45,
            "memoryUsage": 0.72,
            "diskUsage": 0.58,
            "networkUsage": 0.33
          },
          "syncStats": {
            "totalShips": 20,
            "syncSuccessRate": 0.96,
            "pendingSyncCount": 120,
            "failedInLast24h": 5,
            "lastSyncTime": "2025-03-20T14:30:00Z"
          },
          "alerts": {
            "totalAlerts": 3,
            "criticalAlerts": 1,
            "warningAlerts": 2,
            "recentAlerts": [
              {
                "id": "alert-001",
                "severity": "critical",
                "message": "微服务 'sync-engine' 异常，请立即处理",
                "time": "2025-03-20T14:25:00Z"
              }
            ]
          },
          "resourceTrend": {
            "timePoints": [
              "2025-03-20T14:00:00Z",
              "2025-03-20T14:30:00Z"
            ],
            "cpu": [
              0.4,
              0.45
            ],
            "memory": [
              0.7,
              0.72
            ],
            "disk": [
              0.55,
              0.58
            ]
          }
        },
        "traceId": "trace-abc123"
      },
      "errorResponse": {
        "code": 500,
        "message": "服务器内部错误",
        "data": null,
        "traceId": "trace-def456"
      },
      "errorCodes": [
        {
          "code": 401,
          "meaning": "未授权，用户登录过期或无效",
          "frontendAdvice": "跳转至登录页面，提示用户重新登录"
        },
        {
          "code": 403,
          "meaning": "权限不足，当前用户无查看监控仪表盘的权限",
          "frontendAdvice": "显示提示信息，并引导用户联系管理员申请权限"
        },
        {
          "code": 500,
          "meaning": "服务器内部异常，无法获取监控数据",
          "frontendAdvice": "显示错误提示，停止自动刷新，提供手动重试按钮或跳转至错误页"
        },
        {
          "code": 503,
          "meaning": "服务暂时不可用（如监控服务宕机）",
          "frontendAdvice": "显示服务不可用提示，自动停止刷新，并建议稍后重试"
        }
      ],
      "sourcePageKey": "sc-9-page-1-0"
    },
    "sc-9-page-2-1": {
      "key": "api-sc-9-page-2-1",
      "method": "GET",
      "name": "告警列表查询",
      "path": "/api/monitor/alerts",
      "goal": "分页获取异常告警列表，支持按严重程度、告警类型、时间范围、状态筛选，用于页面列表展示及筛选交互",
      "trigger": "页面加载时、筛选条件变更时、翻页或改变每页条数时",
      "requestParams": [
        {
          "name": "severity",
          "type": "string",
          "required": false,
          "description": "严重程度筛选，可选值：紧急、严重、警告、提示"
        },
        {
          "name": "alertType",
          "type": "string",
          "required": false,
          "description": "告警类型筛选，可选值：服务异常、同步失败、资源超标、弱网节点"
        },
        {
          "name": "startTime",
          "type": "string",
          "required": false,
          "description": "告警发生时间范围起始，ISO 8601格式（如2024-01-01T00:00:00Z）"
        },
        {
          "name": "endTime",
          "type": "string",
          "required": false,
          "description": "告警发生时间范围结束，ISO 8601格式"
        },
        {
          "name": "status",
          "type": "string",
          "required": false,
          "description": "处理状态筛选，可选值：未处理、处理中、已解决"
        },
        {
          "name": "pageNum",
          "type": "integer",
          "required": true,
          "description": "当前页码，从1开始"
        },
        {
          "name": "pageSize",
          "type": "integer",
          "required": true,
          "description": "每页条数，默认20"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "OK",
        "data": {
          "list": [
            {
              "alertId": "string",
              "alertType": "string",
              "severity": "string",
              "description": "string",
              "scope": "string",
              "occurTime": "string",
              "firstOccurTime": "string",
              "lastOccurTime": "string",
              "cumulativeCount": "integer",
              "status": "string"
            }
          ],
          "total": 0,
          "pageNum": 1,
          "pageSize": 20
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 500,
        "message": "服务器内部错误",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": 400,
          "meaning": "请求参数校验失败（如分页参数非法、时间范围无效）",
          "frontendAdvice": "提示用户检查筛选条件，并高亮错误字段"
        },
        {
          "code": 401,
          "meaning": "未授权或会话过期",
          "frontendAdvice": "跳转至登录页或刷新token"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "显示'数据加载失败，请检查网络'并提供重试按钮"
        }
      ],
      "sourcePageKey": "sc-9-page-2-1"
    },
    "sc-9-page-3-2": {
      "key": "api-sc-9-page-3-2",
      "method": "GET",
      "name": "操作审计日志列表查询",
      "path": "/api/audit/logs",
      "goal": "按多维条件检索用户操作日志，支持分页和排序，用于合规审计与违规排查",
      "trigger": "用户点击查询按钮或页面初始化时（默认加载最近7天日志）",
      "requestParams": [
        {
          "name": "startDate",
          "type": "string",
          "required": false,
          "description": "筛选起始时间，格式yyyy-MM-dd，与endDate或quickRange至少提供一个"
        },
        {
          "name": "endDate",
          "type": "string",
          "required": false,
          "description": "筛选结束时间，格式yyyy-MM-dd"
        },
        {
          "name": "quickRange",
          "type": "string",
          "required": false,
          "description": "快捷时间范围，可选值：last7Days,last30Days,custom；使用自定义时需同时提供startDate和endDate"
        },
        {
          "name": "userRole",
          "type": "string",
          "required": false,
          "description": "用户角色筛选，多选用逗号分隔，可选：shoreManager,shipManager,shipCrew,sysAdmin,auditor,procurement"
        },
        {
          "name": "operationType",
          "type": "string",
          "required": false,
          "description": "操作类型筛选，多选用逗号分隔，可选：login,dataCud,permissionChange,processPublish,sync"
        },
        {
          "name": "operationObject",
          "type": "string",
          "required": false,
          "description": "操作对象模糊匹配（模块名称或资源ID）"
        },
        {
          "name": "page",
          "type": "integer",
          "required": false,
          "description": "当前页码，从1开始，默认1"
        },
        {
          "name": "pageSize",
          "type": "integer",
          "required": false,
          "description": "每页记录数，默认20，最大100"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "成功",
        "data": {
          "items": [
            {
              "logId": "string",
              "timestamp": "string",
              "userName": "string",
              "userRole": "string",
              "ipAddress": "string",
              "operationType": "string",
              "operationObject": "string",
              "description": "string",
              "changeBefore": "object",
              "changeAfter": "object",
              "markStatus": "string",
              "markNote": "string",
              "auditDecision": "string"
            }
          ],
          "total": 0,
          "page": 1,
          "pageSize": 20
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 400,
        "message": "请求参数错误",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": 400,
          "meaning": "请求参数校验失败（如日期格式错误、pageSize超出范围）",
          "frontendAdvice": "根据后端返回的message提示用户修正输入"
        },
        {
          "code": 401,
          "meaning": "未登录或会话过期",
          "frontendAdvice": "跳转登录页或提示重新登录"
        },
        {
          "code": 403,
          "meaning": "当前用户无审计日志查看权限",
          "frontendAdvice": "显示无权限提示并建议联系管理员"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误（如查询超时）",
          "frontendAdvice": "显示错误提示并提供重试按钮"
        }
      ],
      "sourcePageKey": "sc-9-page-3-2"
    },
    "sc-9-page-4-3": {
      "key": "api-sc-9-page-4-3",
      "method": "POST",
      "name": "生成报告",
      "path": "/api/report/generate",
      "goal": "根据选定的模板和参数异步生成运维报告或合规文档，返回任务ID供前端轮询进度或下载",
      "trigger": "用户点击“生成报告”按钮后",
      "requestParams": [
        {
          "name": "templateId",
          "type": "string",
          "required": true,
          "description": "报告模板ID，取自模板列表"
        },
        {
          "name": "shipNames",
          "type": "array<string>",
          "required": false,
          "description": "船舶名称列表，为空表示全部船舶"
        },
        {
          "name": "timeRange",
          "type": "object",
          "required": true,
          "description": "时间区间，包含start和end字段，格式为ISO日期字符串"
        },
        {
          "name": "includeAlerts",
          "type": "boolean",
          "required": false,
          "description": "是否包含告警明细"
        },
        {
          "name": "includeAudit",
          "type": "boolean",
          "required": false,
          "description": "是否包含操作审计摘要"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "报告生成任务已提交",
        "data": {
          "taskId": "string",
          "status": "PENDING"
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 40001,
        "message": "请求参数校验失败",
        "data": {
          "errors": [
            "templateId 不能为空",
            "timeRange 格式不正确"
          ]
        },
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": 40001,
          "meaning": "参数校验失败，如必填项缺失或格式错误",
          "frontendAdvice": "根据返回的错误提示修正表单输入后重试"
        },
        {
          "code": 40002,
          "meaning": "模板不存在或已停用",
          "frontendAdvice": "重新选择有效模板"
        },
        {
          "code": 50001,
          "meaning": "系统内部异常，生成任务提交失败",
          "frontendAdvice": "提示用户稍后重试，并记录错误日志"
        },
        {
          "code": 40901,
          "meaning": "同一模板和参数报告正在生成中，不允许重复提交",
          "frontendAdvice": "显示“当前报告正在生成，请耐心等待”"
        }
      ],
      "sourcePageKey": "sc-9-page-4-3"
    },
    "sc-10-page-1-0": {
      "key": "api-sc-10-page-1-0",
      "method": "GET",
      "name": "审计日志列表查询",
      "path": "/api/audit-logs",
      "goal": "支持多维度条件组合查询审计日志，返回分页列表及统计摘要，用于工作台展示与筛选。",
      "trigger": "页面初始化时自动加载最近30天日志；或在筛选条件变化后自动触发（或点击查询按钮）",
      "requestParams": [
        {
          "name": "startDate",
          "type": "string",
          "required": true,
          "description": "开始日期，格式YYYY-MM-DD，例如2025-01-01"
        },
        {
          "name": "endDate",
          "type": "string",
          "required": true,
          "description": "结束日期，格式YYYY-MM-DD，例如2025-01-31"
        },
        {
          "name": "role",
          "type": "string",
          "required": false,
          "description": "用户角色编码，来自枚举列表，例如 ashore_engineer"
        },
        {
          "name": "operationTypes",
          "type": "string",
          "required": false,
          "description": "操作类型，多选用逗号分隔，例如 login,data_modify"
        },
        {
          "name": "vesselName",
          "type": "string",
          "required": false,
          "description": "船舶名称，模糊搜索"
        },
        {
          "name": "page",
          "type": "integer",
          "required": false,
          "description": "页码，从1开始，默认1"
        },
        {
          "name": "limit",
          "type": "integer",
          "required": false,
          "description": "每页条数，默认20"
        },
        {
          "name": "sortBy",
          "type": "string",
          "required": false,
          "description": "排序字段，可选time（默认）或operator，默认time"
        },
        {
          "name": "order",
          "type": "string",
          "required": false,
          "description": "排序方向，asc或desc，默认desc"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "操作成功",
        "data": {
          "items": [
            {
              "id": "log_001",
              "operator": "张三",
              "time": "2025-06-01 10:30:00",
              "module": "船舶基础数据",
              "operationType": "data_modify",
              "status": "normal",
              "ip": "192.168.1.100",
              "object": "船舶信息表"
            }
          ],
          "total": 120,
          "page": 1,
          "limit": 20,
          "statistics": {
            "totalCount": 120,
            "typeDistribution": [
              {
                "type": "login",
                "count": 30
              },
              {
                "type": "data_modify",
                "count": 50
              }
            ],
            "dailyDistribution": [
              {
                "date": "2025-06-01",
                "count": 15
              }
            ]
          }
        },
        "traceId": "trace-xxx-yyy"
      },
      "errorResponse": {
        "code": -1,
        "message": "请求参数校验失败",
        "data": null,
        "traceId": "trace-xxx-yyy"
      },
      "errorCodes": [
        {
          "code": 1001,
          "meaning": "必填参数缺失（startDate或endDate为空）",
          "frontendAdvice": "提示用户选择时间范围并重试"
        },
        {
          "code": 1002,
          "meaning": "日期格式错误或开始日期晚于结束日期",
          "frontendAdvice": "重新选择有效的时间范围"
        },
        {
          "code": 1010,
          "meaning": "服务器内部错误",
          "frontendAdvice": "显示错误提示及重试按钮"
        }
      ],
      "sourcePageKey": "sc-10-page-1-0"
    },
    "sc-11-page-1-0": {
      "key": "api-sc-11-page-1-0",
      "method": "POST",
      "name": "发起采购申请",
      "path": "/api/procurement/orders",
      "goal": "采办协同人员提交采购申请，系统创建采购订单并校验预算余额",
      "trigger": "用户在“发起采购申请”弹窗表单中填写信息后点击“提交”按钮",
      "requestParams": [
        {
          "name": "requirementIds",
          "type": "array",
          "required": true,
          "description": "采购需求ID列表，来自选中的需求行"
        },
        {
          "name": "purchaseDescription",
          "type": "string",
          "required": true,
          "description": "采购说明"
        },
        {
          "name": "deliveryDeadline",
          "type": "string",
          "required": true,
          "description": "交货期限，格式YYYY-MM-DD"
        },
        {
          "name": "supplierId",
          "type": "string",
          "required": true,
          "description": "供应商ID"
        },
        {
          "name": "attachmentFileIds",
          "type": "array",
          "required": false,
          "description": "已上传的附件文件ID列表"
        }
      ],
      "successResponse": {
        "code": "SUCCESS",
        "message": "采购申请提交成功",
        "data": {
          "orderId": "string",
          "status": "PENDING_APPROVAL"
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": "ERROR",
        "message": "错误描述",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": "BUDGET_INSUFFICIENT",
          "meaning": "预算余额不足，无法发起申请",
          "frontendAdvice": "提示用户调整数量或发起预算追加流程"
        },
        {
          "code": "SUPPLIER_INVALID",
          "meaning": "所选供应商不在合格列表中或状态异常",
          "frontendAdvice": "提示用户重新选择供应商"
        },
        {
          "code": "VALIDATION_ERROR",
          "meaning": "请求参数校验失败",
          "frontendAdvice": "检查表单字段是否填写完整"
        },
        {
          "code": "INTERNAL_ERROR",
          "meaning": "服务器内部错误",
          "frontendAdvice": "请稍后重试或联系管理员"
        }
      ],
      "sourcePageKey": "sc-11-page-1-0"
    },
    "sc-11-page-2-1": {
      "key": "api-sc-11-page-2-1",
      "method": "GET",
      "name": "查询采购订单列表",
      "path": "/api/procurement/orders",
      "goal": "获取采购订单列表，用于页面渲染及筛选",
      "trigger": "页面加载时自动调用，以及筛选条件、排序条件变化时重新调用",
      "requestParams": [
        {
          "name": "orderNo",
          "type": "string",
          "required": false,
          "description": "按订单号精确搜索"
        },
        {
          "name": "supplier",
          "type": "string",
          "required": false,
          "description": "按供应商名称模糊搜索"
        },
        {
          "name": "status",
          "type": "string",
          "required": false,
          "description": "订单状态筛选，可选值：待发货、已发货、运输中、部分到货、已到货"
        },
        {
          "name": "expectedDeliveryStart",
          "type": "string",
          "required": false,
          "description": "预计到货时间范围的起始日期，格式 yyyy-MM-dd"
        },
        {
          "name": "expectedDeliveryEnd",
          "type": "string",
          "required": false,
          "description": "预计到货时间范围的结束日期，格式 yyyy-MM-dd"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "success",
        "data": {
          "orders": [
            {
              "orderId": "string",
              "orderNo": "string",
              "materialName": "string",
              "amount": "number",
              "supplier": "string",
              "status": "string",
              "expectedDeliveryDate": "string",
              "remark": "string",
              "approvalHistory": [
                {
                  "action": "string",
                  "operator": "string",
                  "time": "string",
                  "comment": "string"
                }
              ]
            }
          ],
          "total": 0
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 500,
        "message": "Internal Server Error",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": 400,
          "meaning": "请求参数错误（如日期格式不合法、筛选值不在可选范围）",
          "frontendAdvice": "校验输入参数后重试，向用户提示具体错误"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "显示通用错误提示，并支持重试按钮"
        },
        {
          "code": 404,
          "meaning": "资源不存在（如路径错误）",
          "frontendAdvice": "报告技术人员路径配置"
        }
      ],
      "sourcePageKey": "sc-11-page-2-1"
    },
    "sc-11-page-3-2": {
      "key": "api-sc-11-page-3-2",
      "method": "POST",
      "name": "创建验收记录",
      "path": "/api/inspection/records",
      "goal": "提交到货验收结果，并根据检验结论自动执行入库或退换货处理",
      "trigger": "用户填写完物料验收信息后，点击“确认验收”按钮，在弹窗中选择检验结论并确认提交",
      "requestParams": [
        {
          "name": "orderId",
          "type": "string",
          "required": true,
          "description": "待验收采购订单ID"
        },
        {
          "name": "items",
          "type": "array",
          "required": true,
          "description": "物料验收明细列表，每个元素包含物料编码、条码、实到数量、外观检验结果以及附件"
        },
        {
          "name": "inspectionConclusion",
          "type": "string",
          "required": true,
          "description": "检验结论枚举：PASS（全部合格）、PARTIAL（部分合格）、FAIL（全部不合格）"
        },
        {
          "name": "defectReason",
          "type": "string",
          "required": false,
          "description": "不合格原因及处理意见，当inspectionConclusion为PARTIAL或FAIL时必填"
        }
      ],
      "successResponse": {
        "code": "SUCCESS",
        "message": "验收记录创建成功",
        "data": {
          "inspectionRecordId": "string",
          "stockInResult": {
            "status": "string",
            "inventoryRecordId": "string"
          },
          "returnOrderResult": {
            "status": "string",
            "returnOrderId": "string"
          }
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": "ERROR",
        "message": "请求处理失败",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": "ORDER_NOT_FOUND",
          "meaning": "采购订单不存在",
          "frontendAdvice": "请重新选择有效的采购订单"
        },
        {
          "code": "MATERIAL_MISMATCH",
          "meaning": "物料条码与订单不匹配",
          "frontendAdvice": "请确认条码正确或重新扫描"
        },
        {
          "code": "INVALID_QUANTITY",
          "meaning": "实到数量无效（非正整数）",
          "frontendAdvice": "请输入大于等于0的整数"
        },
        {
          "code": "INVALID_CONCLUSION",
          "meaning": "检验结论不合法",
          "frontendAdvice": "请选择合格、部分合格或不合格"
        },
        {
          "code": "DEFECT_REASON_REQUIRED",
          "meaning": "不合格时必须填写原因及处理意见",
          "frontendAdvice": "请填写不合格原因及处理意见"
        },
        {
          "code": "STOCK_IN_FAILED",
          "meaning": "入库操作失败",
          "frontendAdvice": "请检查库存与预算，稍后重试"
        },
        {
          "code": "RETURN_ORDER_FAILED",
          "meaning": "创建退换货单失败",
          "frontendAdvice": "请检查供应商信息，稍后重试"
        }
      ],
      "sourcePageKey": "sc-11-page-3-2"
    }
  },
  "scenarioPageGroups": [
    {
      "key": "sc-1",
      "name": "岸基机务人员制定与调整设备维保计划",
      "priority": "P0",
      "pages": [
        {
          "key": "sc-1-page-1-0",
          "priority": "P0",
          "type": "工作台页",
          "name": "设备维保计划工作台",
          "vueFile": "MaintenancePlanWorkbench.vue",
          "goal": "为岸基机务人员提供设备资产树与计划状态总览，快速定位需处理的设备并导航至计划制定或详情",
          "features": [
            "设备资产树与计划状态总览"
          ],
          "sections": [
            "顶部全局搜索与状态统计卡片（计划总数、即将到期数、缺失数）",
            "左侧设备资产树（按系统/区域/设备层级展开，节点旁显示计划状态图标及标签）",
            "右侧详情面板：选中设备后展示该设备的计划摘要（当前计划状态、周期、上次执行日期、下次到期日）、维保历史记录、快速操作按钮（新增计划、编辑、查看详情）",
            "底部状态筛选栏：通过状态标签（未制定、审核中、已生效、即将到期、已过期）过滤资产树显示",
            "导出报表按钮：导出当前筛选后的设备维保计划总览报表"
          ],
          "states": [
            "正常态：资产树正常加载，节点状态标签正确显示，右侧面板展示选中设备详情",
            "空态：无设备资产数据时，显示'暂无设备数据，请确认EAM同步是否完成'提示及引导",
            "加载态：资产树骨架屏加载，顶部统计卡片显示占位符",
            "异常态：API超时或失败时，显示错误提示与重试按钮，保留上次缓存数据（若有）"
          ],
          "keyInteractions": [
            "展开/折叠设备树节点",
            "点击设备节点触发右侧面板加载设备详情",
            "通过状态标签组合筛选资产树，高亮符合条件的设备节点",
            "点击快速操作按钮'新增计划'或'编辑计划'跳转至计划编辑页面（携带设备ID）",
            "点击导出报表按钮触发下载CSV/Excel文件"
          ],
          "dataInputs": [
            "GET /api/equipment-tree?type=maintenance-plan-status 获取资产树及计划状态",
            "GET /api/equipment/{id}/plan-summary 获取单个设备计划摘要及维保历史"
          ],
          "originalPageKey": "page-1",
          "scenarioKey": "sc-1",
          "scenarioName": "岸基机务人员制定与调整设备维保计划"
        },
        {
          "key": "sc-1-page-2-1",
          "priority": "P0",
          "type": "表单页",
          "name": "预防性维护计划制定与编辑",
          "vueFile": "PlanEditor.vue",
          "goal": "支持岸基机务人员基于设备资产树和PMS规则新建或编辑预防性维护计划，校验冲突并提交审核",
          "features": [
            "预防性维护计划制定与编辑"
          ],
          "sections": [
            "顶部导航与操作栏：返回工作台、保存草稿、提交审核按钮",
            "设备选择区：支持单选或批量选择设备（从设备树弹窗选择或输入设备编码），已选设备列表显示编码、名称、当前计划状态",
            "计划参数设定区：计划类型单选项（日历周期/运行小时/工况触发），周期数值与单位输入，起始日期选择器，前置预警天数输入框，优先级下拉选择",
            "工单模板关联区：下拉搜索并选择关联的工单模板，显示模板摘要（步骤数、所需备件数）",
            "冲突检测提示区：提交前自动检测所选设备在设定时段内是否存在已有生效计划，以列表形式展示冲突详情并允许用户调整",
            "底部提交区：保存草稿（本地存储）或提交审核（触发工作流）"
          ],
          "states": [
            "正常态：表单可编辑，所有字段正常",
            "空态：编辑新建计划时设备列表为空显示'请选择设备'；未选择工单模板时显示'建议关联工单模板'",
            "加载态：提交审核时显示加载遮罩；调取工单模板列表时显示下拉加载中",
            "异常态：冲突检测失败或提交超时，显示错误提示并保留用户已填数据"
          ],
          "keyInteractions": [
            "点击'选择设备'打开设备树弹窗，支持多选并回填",
            "切换计划类型时动态显示对应参数输入（如运行小时需选计量变量）",
            "点击'检测冲突'触发异步校验，结果在下方区域展示",
            "点击'保存草稿'将当前表单数据存入本地或后台保存",
            "点击'提交审核'触发前端校验（必填项、冲突无错误）后提交POST/PUT请求，成功后跳转至工作台或审核列表"
          ],
          "dataInputs": [
            "GET /api/equipment/list?status=active 获取可选设备列表（含运行小时变量）",
            "GET /api/templates?type=work-order 获取工单模板列表",
            "POST /api/maintenance-plans/validate-conflicts 提交计划参数检测冲突",
            "POST /api/maintenance-plans 创建计划",
            "PUT /api/maintenance-plans/{id} 更新计划"
          ],
          "originalPageKey": "page-2",
          "scenarioKey": "sc-1",
          "scenarioName": "岸基机务人员制定与调整设备维保计划"
        },
        {
          "key": "sc-1-page-3-2",
          "priority": "P0",
          "type": "列表页",
          "name": "计划变更审核与协同确认",
          "vueFile": "PlanApproval.vue",
          "goal": "管理计划变更申请的审核流程，支持查看差异、审批意见填写、通过/驳回操作，并记录日志",
          "features": [
            "计划变更审核与协同确认"
          ],
          "sections": [
            "顶部筛选栏：按状态（待审核、已通过、已驳回）、申请时间范围、发起人筛选待审列表",
            "待审列表区：表格展示申请编号、设备名称、变更类型（新建/修改/废止）、发起人、提交时间、当前处理人、状态标签，支持排序",
            "变更详情面板：选中一条申请后，以对比视图展示变更前后差异（计划参数、工单模板）",
            "审批操作区：审批意见文本框，通过/驳回按钮，附带提交确认弹窗",
            "审核日志区：以时间线形式展示该申请的所有审核记录（操作人、时间、意见、结果）"
          ],
          "states": [
            "正常态：列表加载完成，筛选功能正常，变更详情展示正确",
            "空态：无待审申请时显示'当前无待审批的变更申请'及历史记录入口",
            "加载态：列表初始加载显示骨架屏；提交审批时显示加载状态",
            "异常态：提交审批失败时显示错误提示并保留输入意见"
          ],
          "keyInteractions": [
            "点击筛选条件实时刷新列表",
            "点击列表行展开或侧边展示变更详情面板",
            "在变更详情中切换'变更前/变更后'视图对比",
            "填写审批意见后点击通过或驳回，确认弹窗后提交审批操作",
            "点击审核日志区域展开/收起时间线详情"
          ],
          "dataInputs": [
            "GET /api/approvals?type=plan-change&status=pending 获取待审列表",
            "GET /api/approvals/{id}/diff 获取变更前后差异",
            "GET /api/approvals/{id}/logs 获取审核日志",
            "POST /api/approvals/{id}/action 提交审批操作（通过/驳回）"
          ],
          "originalPageKey": "page-3",
          "scenarioKey": "sc-1",
          "scenarioName": "岸基机务人员制定与调整设备维保计划"
        }
      ]
    },
    {
      "key": "sc-2",
      "name": "岸基机务人员进行航前健康校验与开航拦截",
      "priority": "P0",
      "pages": [
        {
          "key": "sc-2-page-1-0",
          "priority": "P0",
          "type": "工作台页",
          "name": "航前健康检查任务触发",
          "vueFile": "VoyageHealthTrigger.vue",
          "goal": "岸基机务人员查看待检查船舶列表，手动或自动发起航前健康检查任务",
          "features": [
            "航前健康检查任务触发"
          ],
          "sections": [
            "顶部通知栏（推送的开航前校验通知）",
            "船舶列表区（显示待检查、执行中、已完成的船舶）",
            "手动发起检查入口（搜索/选择船舶并触发）"
          ],
          "states": [
            "正常态（有通知/任务列表）",
            "空态（无待检查船舶或历史记录）",
            "加载态（列表加载中）",
            "异常态（网络错误/接口失败）"
          ],
          "keyInteractions": [
            "点击船舶卡片进入看板页",
            "点击‘发起检查’按钮创建任务并跳转看板"
          ],
          "dataInputs": [
            "GET /api/voyage-health/check-tasks?status=pending, in_progress",
            "POST /api/voyage-health/check-tasks (手动发起)"
          ],
          "originalPageKey": "page-1",
          "scenarioKey": "sc-2",
          "scenarioName": "岸基机务人员进行航前健康校验与开航拦截"
        },
        {
          "key": "sc-2-page-2-1",
          "priority": "P0",
          "type": "看板页",
          "name": "健康状态总览与拦截告警看板",
          "vueFile": "VoyageHealthDashboard.vue",
          "goal": "集中展示当前船舶健康校验结果，显示通过/不通过项及拦截告警，提供问题清单导出",
          "features": [
            "健康状态总览与拦截告警看板"
          ],
          "sections": [
            "头部概览区（整体健康分数、开航拦截状态）",
            "分类结果区（设备维保/物资库存/证书资质三栏，每栏显示通过/不通过数量）",
            "问题清单表格区（显示所有不通过项，含类型、描述、严重等级）",
            "操作栏（导出PDF/Excel按钮）"
          ],
          "states": [
            "正常态（有校验结果）",
            "空态（校验任务刚创建，尚未完成）",
            "加载态（获取结果中）",
            "异常态（校验规则执行失败）"
          ],
          "keyInteractions": [
            "点击问题行跳转详情页",
            "点击导出按钮生成并下载文件"
          ],
          "dataInputs": [
            "GET /api/voyage-health/check-summary?shipId={id}",
            "GET /api/voyage-health/issues?checkTaskId={id}",
            "POST /api/voyage-health/export-issues"
          ],
          "originalPageKey": "page-2",
          "scenarioKey": "sc-2",
          "scenarioName": "岸基机务人员进行航前健康校验与开航拦截"
        },
        {
          "key": "sc-2-page-3-2",
          "priority": "P0",
          "type": "详情页",
          "name": "不通过项详情与处置流程",
          "vueFile": "VoyageHealthIssueDetail.vue",
          "goal": "展示单个不通过项的详细信息和关联数据，支持启动紧急工单、物资调拨、豁免审批等处置流程",
          "features": [
            "不通过项详情查看与处置流程发起"
          ],
          "sections": [
            "问题标题与基本信息区（类型、关联对象、过期/逾期时间、严重等级）",
            "详情数据区（逾期工单清单/缺件物料表格/过期证书列表）",
            "处置操作区（创建紧急工单按钮、发起调拨申请按钮、提交豁免审批按钮）",
            "处置进度区（已发起的处置单状态跟踪）"
          ],
          "states": [
            "正常态（有详情）",
            "加载态（获取详情中）",
            "异常态（数据不存在或权限不足）",
            "空态（如果问题已被处理，显示已解决信息）"
          ],
          "keyInteractions": [
            "点击创建紧急工单弹出表单填写",
            "点击发起调拨申请弹出表单",
            "点击提交豁免审批弹出表单",
            "表单提交后刷新处置进度"
          ],
          "dataInputs": [
            "GET /api/voyage-health/issues/{issueId}",
            "POST /api/work-orders/emergency",
            "POST /api/materials/transfer-requests",
            "POST /api/certificates/exemption-requests"
          ],
          "originalPageKey": "page-3",
          "scenarioKey": "sc-2",
          "scenarioName": "岸基机务人员进行航前健康校验与开航拦截"
        },
        {
          "key": "sc-2-page-4-3",
          "priority": "P1",
          "type": "列表页",
          "name": "校验记录与航前健康报告",
          "vueFile": "VoyageHealthReports.vue",
          "goal": "查看历次航前健康检查记录，生成和下载健康报告，监控开航状态同步结果",
          "features": [
            "校验记录与航前健康报告管理"
          ],
          "sections": [
            "搜索筛选区（按船舶、日期范围、状态过滤）",
            "记录列表区（展示检查任务、生成报告状态、开航状态）",
            "报告生成入口（针对已完成任务生成报告）",
            "日志查看弹窗（点击日志按钮展开操作时间线）"
          ],
          "states": [
            "正常态（有记录）",
            "空态（无历史记录）",
            "加载态（列表加载中）",
            "异常态（查询失败）"
          ],
          "keyInteractions": [
            "点击生成报告按钮触发异步生成并刷新列表",
            "点击下载报告按钮下载PDF",
            "点击开航状态标签查看详情"
          ],
          "dataInputs": [
            "GET /api/voyage-health/reports?shipId={}&dateRange={}",
            "POST /api/voyage-health/reports/generate",
            "GET /api/voyage-health/reports/{id}/download",
            "GET /api/voyage-health/logs?taskId={}"
          ],
          "originalPageKey": "page-4",
          "scenarioKey": "sc-2",
          "scenarioName": "岸基机务人员进行航前健康校验与开航拦截"
        }
      ]
    },
    {
      "key": "sc-3",
      "name": "岸基机务人员审核与跟踪工单执行",
      "priority": "P0",
      "pages": [
        {
          "key": "sc-3-page-1-0",
          "priority": "P0",
          "type": "列表页",
          "name": "工单执行跟踪列表",
          "vueFile": "WorkOrderAuditList.vue",
          "goal": "为岸基机务人员提供待审核/已完成工单的聚合视图，支持多维筛选和快速定位",
          "features": [
            "工单执行跟踪筛选列表"
          ],
          "sections": [
            "顶部导航和用户信息",
            "筛选条件栏：船舶名称下拉、设备资产树选择器、工单类型多选、工单状态多选、时间范围日期选择器、搜索按钮",
            "工单摘要列表：表头（工单号、关联设备、优先级、报工时间、当前状态、操作），每行含状态标签，支持排序（优先级、报工时间）和分页",
            "列表空态提示（无符合条件的工单）",
            "加载状态骨架屏"
          ],
          "states": [
            "正常态：列表数据正常展示",
            "空态：无待审核或已完成工单时显示空状态插图及引导文字",
            "加载态：列表数据加载中显示骨架屏或进度条",
            "异常态：网络错误或接口异常时显示错误提示及重试按钮",
            "筛选无结果：组合筛选后无匹配工单显示'暂无数据'及清除筛选建议"
          ],
          "keyInteractions": [
            "点击列表行跳转至工单详情核验页面（WorkOrderAuditDetail.vue）并携带工单ID",
            "筛选条件联动：选择船舶后设备资产树自动过滤该船舶下设备",
            "时间范围默认最近一周，可快捷选择最近一天、一周、一月",
            "分页切换或点击排序触发重新加载列表",
            "状态标签点击可快速筛选该状态（如点击'待审核'标签自动筛选待审核工单）"
          ],
          "dataInputs": [
            "用户身份与权限（审核人角色）",
            "船舶列表数据（GET /api/ships）",
            "设备资产树数据（按船舶过滤：GET /api/equipmentTree?shipId=）",
            "工单列表数据（GET /api/workOrders?status=待审核,已通过,需整改&shipId=&equipmentId=&type=&startDate=&endDate=&page=&size=&sort=）"
          ],
          "originalPageKey": "page-1",
          "scenarioKey": "sc-3",
          "scenarioName": "岸基机务人员审核与跟踪工单执行"
        },
        {
          "key": "sc-3-page-2-1",
          "priority": "P0",
          "type": "详情页",
          "name": "工单审核详情与操作",
          "vueFile": "WorkOrderAuditDetail.vue",
          "goal": "展示单个工单的完整报工数据，支持机务人员逐项核验并执行审核通过或退回操作，提供整改跟踪与审计日志查阅",
          "features": [
            "报工数据核验详情",
            "审核通过/退回处理",
            "整改跟踪与审计日志"
          ],
          "sections": [
            "页面顶部：工单编号、关联设备、当前状态、优先级标签，以及返回列表按钮",
            "工单基本信息分区：设备名称、报工人员、报工时间、工单类型、维保标准说明（只读）",
            "执行明细分区：实际执行人员、开始/结束时间、总实际工时、执行步骤列表（勾选状态、完成说明、附件链接）",
            "物料消耗分区：物料名称、编码、计划用量、实际用量、批次号，超量物料高亮标示，支持查看物料附件",
            "多媒体附件分区：照片/视频缩略图网格，点击弹出预览，显示拍摄时间戳",
            "异常记录分区：异常类型、描述、现场照片，展示处理状态（待处理/已处理）",
            "审核操作区：审核通过按钮（绿色）、退回整改按钮（红色），退回时弹出模态框填写审核意见（必填）、选择整改要求（补全数据/重新执行/更换物料/其他+自由文本）、支持上传附件",
            "审核历史分区：Tab切换，默认显示'审核日志'，展示历次审核记录（操作人、时间、结论、意见、附件），支持版本对比",
            "整改跟踪分区（Tab页）：展示退回工单的整改任务列表（整改要求、责任人、计划完成时间、实际完成时间、整改结果说明），支持点击查看整改后报工数据重新进入审核流程",
            "审计日志查询分区（Tab页）：按时间、操作人、工单号检索审核操作记录，列表展示操作类型、时间、审核意见、操作人，支持导出（Excel/PDF）"
          ],
          "states": [
            "正常态：工单详情数据完整展示，所有操作可用",
            "加载态：详情数据加载中显示骨架屏或全页加载指示",
            "异常态：工单ID无效或接口失败，显示错误提示和返回按钮",
            "审核通过完成态：操作后显示成功提示，工单状态更新为'已闭环'，审核按钮置灰",
            "退回操作态：退回提交后显示成功提示，工单状态更新为'需整改'，刷新整改跟踪Tab",
            "空态：整改任务列表为空时显示'暂无整改任务'",
            "超量物料高亮状态：物料消耗超出计划用量时以橙色/红色背景突出显示"
          ],
          "keyInteractions": [
            "点击附件缩略图弹出全屏预览（图片/视频播放），支持左右滑动",
            "物料超量时显示工具提示超量数量",
            "审核通过：点击'确认通过'弹出二次确认对话框，确认后调用POST接口，成功后更新页面状态并显示审核人时间",
            "退回整改：点击'退回整改'弹出模态框，填写意见和选择要求（至少一项）后提交，调用POST接口，成功后跳转至整改跟踪Tab并刷新列表",
            "审核历史Tab：支持按版本对比，点击'对比'按钮弹出差异视图（并列显示两版审核意见和附件）",
            "整改任务项：点击'查看整改后报工'跳转回工单详情（此时工单版本为整改后重新报工的新版本）",
            "审计日志导出：点击导出按钮，按当前筛选条件导出为Excel或PDF",
            "批注：在核验分区支持文本批注（如标记某物料异常），批注内容自动带入审核意见"
          ],
          "dataInputs": [
            "工单ID（从列表页传递）",
            "工单报工详情数据（GET /api/workOrders/{workOrderId}/reportDetail）",
            "维保标准参考数据（可选：GET /api/maintenanceStandards?equipmentId=）",
            "当前用户身份与权限",
            "设备维保记录更新接口（POST /api/workOrders/{workOrderId}/approve 和 reject）",
            "整改任务数据（GET /api/workOrders/{workOrderId}/reworkTasks）",
            "审核日志数据（GET /api/workOrders/{workOrderId}/auditLogs）"
          ],
          "originalPageKey": "page-2",
          "scenarioKey": "sc-3",
          "scenarioName": "岸基机务人员审核与跟踪工单执行"
        }
      ]
    },
    {
      "key": "sc-4",
      "name": "船舶管理人员监控船舶运行状态与调度",
      "priority": "P0",
      "pages": [
        {
          "key": "sc-4-page-sc4-1-0",
          "priority": "P0",
          "type": "工作台页",
          "name": "船舶运行监控总览",
          "vueFile": "ShipMonitoringOverview.vue",
          "goal": "提供所有在管船舶的实时位置、航速、作业状态和通信连接状态的整体视图，支持列表和地图两种展示方式，便于船舶管理人员快速掌握全局态势。",
          "features": [
            "船舶实时监控总览"
          ],
          "sections": [
            "地图视图区",
            "列表视图区",
            "状态筛选栏",
            "船舶状态统计卡片"
          ],
          "states": [
            "正常态（有船舶数据）",
            "空态（无船舶数据）",
            "加载态（轮询中）",
            "异常态（API失败）"
          ],
          "keyInteractions": [
            "点击地图/列表视图切换按钮切换展示方式",
            "在地图上点击船舶标记显示船舶信息浮窗，点击浮窗跳转至单船详情页",
            "在列表视图中点击行跳转至单船详情页",
            "使用筛选栏按名称、状态、航线过滤船舶列表",
            "船舶状态颜色标识（绿色在线、黄色弱网、灰色离线）",
            "页面自动轮询（每10秒）或WebSocket接收实时数据更新"
          ],
          "dataInputs": [
            "GET /api/vessels/status 返回船舶状态列表（含实时位置、航速、作业状态、通信状态）",
            "地图加载所需的底图数据（默认使用天地图或离线瓦片）",
            "筛选条件（船舶名称、航线、作业状态、通信状态）"
          ],
          "originalPageKey": "page-sc4-1",
          "scenarioKey": "sc-4",
          "scenarioName": "船舶管理人员监控船舶运行状态与调度"
        },
        {
          "key": "sc-4-page-sc4-2-1",
          "priority": "P0",
          "type": "看板页",
          "name": "单船运行详情看板",
          "vueFile": "ShipDetailBoard.vue",
          "goal": "展示选定船舶的详细运行信息，包括当前航次、工单执行进度、航前健康校验结果以及船员证书有效期预警，并提供健康校验问题处置功能。",
          "features": [
            "单船运行详情看板",
            "航前健康校验问题处置"
          ],
          "sections": [
            "航次信息区域（航次号、出发/目的港、计划时间）",
            "工单执行进度区域（统计卡片+工单列表）",
            "航前健康校验结果区域（校验项列表，每项通过/不通过状态及操作按钮）",
            "船员证书有效期预警区域（过期/即将到期证书列表）",
            "问题处置面板（点击“转处置”或“豁免”弹出的对话框/侧面板）"
          ],
          "states": [
            "正常态（数据完整）",
            "加载态",
            "空态（船舶无航次/工单）",
            "异常态（API失败）",
            "部分不通过态（健康校验有不通过项）"
          ],
          "keyInteractions": [
            "点击健康校验项列表中的不通过项，可展开查看详情（关联工单、物资、证书），并出现“转处置”按钮",
            "点击“转处置”弹出选择责任角色对话框，选择后确认，系统创建处置工单并关闭对话框",
            "点击“申请豁免”弹出豁免表单（理由、有效期），提交后状态更新为“豁免待审批”",
            "点击证书预警列表中的证书可查看持有人和到期时间",
            "页面顶部提供返回总览和“下发调度指令”按钮（跳转至DispatchCommandEditor页面）",
            "工单列表支持点击查看详情（跳转至PMS工单详情页）"
          ],
          "dataInputs": [
            "路径参数：船舶ID",
            "GET /api/vessels/{id}/detail 返回航次、工单列表、健康校验结果",
            "GET /api/vessels/{id}/health-check 返回健康校验项列表",
            "GET /api/vessels/{id}/certificates 返回船员证书预警列表",
            "POST /api/health-check/{id}/resolve 转处置请求体（问题ID，责任角色）",
            "POST /api/health-check/{id}/exemption 豁免请求体（理由，有效期）"
          ],
          "originalPageKey": "page-sc4-2",
          "scenarioKey": "sc-4",
          "scenarioName": "船舶管理人员监控船舶运行状态与调度"
        },
        {
          "key": "sc-4-page-sc4-3-2",
          "priority": "P0",
          "type": "工作台页",
          "name": "调度指令编辑与下发",
          "vueFile": "DispatchCommandEditor.vue",
          "goal": "船舶管理人员在确认船舶健康校验通过（或豁免后）后，编辑调度指令并下发至船端，跟踪指令执行进度直至闭环。",
          "features": [
            "调度指令编辑与下发"
          ],
          "sections": [
            "指令编辑表单区域（航次任务、出发/预计到达时间、航线选择、任务要求）",
            "指令状态跟踪区域（当前指令状态时间线，显示已下发/已接收/执行中/已完成/已闭环）",
            "历史指令列表区域（最近下发的指令，方便查看）"
          ],
          "states": [
            "正常态（可编辑下发）",
            "已下发待确认态",
            "执行中态",
            "已完成态",
            "空态（无历史指令）",
            "异常态（下发失败）"
          ],
          "keyInteractions": [
            "选择船舶（通过下拉选择器，支持从总览页传入船舶ID）",
            "填写指令表单，点击“下发调度指令”，系统弹出确认对话框，确认后调用API下发",
            "下发成功后，状态跟踪区域自动刷新，显示最新状态",
            "点击“刷新”按钮手动获取最新指令状态",
            "船端确认后，状态自动更新（轮询或WebSocket）",
            "指令完成后，管理员可点击“确认闭环”按钮，记录闭环结果",
            "若超时未确认，系统显示告警提示并提供“重新通知”按钮"
          ],
          "dataInputs": [
            "船舶ID（从上游页面传入或选择）",
            "GET /api/dispatch-commands/{id}/status 获取指令状态",
            "GET /api/vessels/{id}/routes 获取预定义航线列表",
            "POST /api/dispatch-commands 创建并下发指令请求体（船舶ID，航次号，出发时间，预计到达时间，航线，任务要求）",
            "POST /api/dispatch-commands/{id}/close 确认闭环请求体（执行结果描述，附件）"
          ],
          "originalPageKey": "page-sc4-3",
          "scenarioKey": "sc-4",
          "scenarioName": "船舶管理人员监控船舶运行状态与调度"
        }
      ]
    },
    {
      "key": "sc-5",
      "name": "船舶管理人员进行船岸数据同步管理",
      "priority": "P1",
      "pages": [
        {
          "key": "sc-5-page-1-0",
          "priority": "P0",
          "type": "工作台页",
          "name": "船岸同步状态总览仪表板",
          "vueFile": "DataSyncManager.vue",
          "goal": "提供所有已注册船舶的同步概览，快速识别异常船舶并导航至详细处理。",
          "features": [
            "船岸同步状态总览仪表板"
          ],
          "sections": [
            "顶部筛选栏：按同步状态（正常/异常/未同步）快捷筛选，支持高亮异常船舶优先排序",
            "船舶概览卡片区：每艘船一张卡片，展示船名、通信状态、最近同步时间、待同步数据包数量、冲突数、失败数",
            "全局操作栏：手动触发全量船舶同步状态刷新按钮，刷新拉取各船最新同步心跳",
            "快速跳转入口：点击船舶卡片可一键跳转至该船舶的同步任务详细列表页（SyncTaskList.vue）"
          ],
          "states": [
            "正常态：至少有一艘船舶且数据正常显示",
            "空态：无已注册船舶时显示空白提示并引导注册",
            "加载态：首次加载或手动刷新时显示骨架屏及进度指示",
            "异常态：拉取心跳超时或后端返回错误时显示错误提示及重试按钮"
          ],
          "keyInteractions": [
            "点击船舶卡片跳转至同步任务列表（附带船舶ID参数）",
            "点击刷新按钮调取全量心跳接口并更新所有卡片状态",
            "筛选下拉切换时重新请求并渲染船舶卡片列表"
          ],
          "dataInputs": [
            "GET /api/v1/sync/shipments/summary 返回船舶列表及同步概览",
            "GET /api/v1/sync/shipments/{shipId}/heartbeat 返回单船最新心跳（手动刷新时逐个调用）"
          ],
          "originalPageKey": "page-1",
          "scenarioKey": "sc-5",
          "scenarioName": "船舶管理人员进行船岸数据同步管理"
        },
        {
          "key": "sc-5-page-2-1",
          "priority": "P0",
          "type": "列表页",
          "name": "同步任务详细列表与多维度筛选",
          "vueFile": "SyncTaskList.vue",
          "goal": "展示选定船舶或全部船舶的同步任务明细，支持多条件筛选、批量操作，并提供冲突与失败任务的快捷入口。",
          "features": [
            "同步任务详细列表与多维度筛选"
          ],
          "sections": [
            "顶部筛选区：按船舶下拉选择（含全部）、数据类型（工单报工/盘点结果/附件图片）、状态（待上传/上传中/已同步/冲突/失败）、时间范围选择器",
            "快捷标签页：“全部任务”、“冲突任务”、“失败任务”三个标签，一键切换聚焦待处理条目",
            "任务列表主体：表格或列表形式，每行展示数据类型、创建时间、来源终端、船端版本号、数据包大小、当前状态，支持多选",
            "批量操作栏：勾选后出现“重新同步”、“标记忽略”、“查看详情”等按钮（冲突/失败任务不可批量忽略）"
          ],
          "states": [
            "正常态：有任务数据并正确展示",
            "空态：无同步任务时显示“暂无同步任务”并展示业务建议",
            "加载态：初始加载或筛选切换时显示加载动画",
            "异常态：接口失败时显示错误提示并允许重试"
          ],
          "keyInteractions": [
            "切换快捷标签页时自动更新列表数据并重置筛选条件（除船舶外）",
            "勾选任务后根据选中任务的状态动态显示可用的批量操作按钮",
            "点击单条任务可跳转至同步任务详情页（SyncTaskDetail.vue）或弹窗查看详情",
            "输入时间范围后自动触发查询（含防抖）"
          ],
          "dataInputs": [
            "GET /api/v1/sync/tasks?shipId={}&type={}&status={}&startTime={}&endTime={} 分页查询",
            "POST /api/v1/sync/tasks/batch-retry 批量重试（需传递任务ID数组）",
            "POST /api/v1/sync/tasks/batch-ignore 批量忽略（需传递任务ID数组及备注）"
          ],
          "originalPageKey": "page-2",
          "scenarioKey": "sc-5",
          "scenarioName": "船舶管理人员进行船岸数据同步管理"
        },
        {
          "key": "sc-5-page-3-2",
          "priority": "P0",
          "type": "详情页",
          "name": "同步任务详情（冲突解决与失败重试）",
          "vueFile": "SyncTaskDetail.vue",
          "goal": "针对冲突或失败的任务，提供差异对比、逐字段合并、重试或忽略操作，并记录审计日志。",
          "features": [
            "数据冲突差异对比与解决面板",
            "同步失败任务重试与忽略处理"
          ],
          "sections": [
            "任务基本信息区：任务ID、数据类型、来源船舶、创建时间、当前状态、错误原因（如失败）",
            "冲突解决面板（仅当状态为冲突时显示）：并排对比船端版本与岸端版本，差异字段高亮，每行提供单选按钮（采用船端/采用岸端/手动编辑），以及快捷操作按钮“全部采用船端版本”或“全部采用岸端版本”，底部提交解决按钮",
            "失败处理面板（仅当状态为失败时显示）：显示失败原因详情和错误码，提供“重新同步”按钮和“忽略”按钮（点击忽略弹出备注输入框，确认后提交）",
            "操作记录区：展示该任务的历史操作日志（包括自动同步、重试、冲突解决、忽略等），支持审计追溯"
          ],
          "states": [
            "正常态：任务状态为冲突或失败，对应面板可见且可编辑",
            "空态：任务状态正常（如已同步）时显示“无需处理”提示",
            "加载态：获取冲突差异或失败详情时显示加载状态",
            "异常态：接口报错时显示错误提示并允许重试"
          ],
          "keyInteractions": [
            "在冲突面板中逐字段选择版本后，系统实时计算最终合并结果并高亮显示未处理的差异字段",
            "点击“全部采用船端版本”或“全部采用岸端版本”快速填充所有字段选择",
            "提交冲突解决时调用POST /api/v1/sync/conflicts/{conflictId}/resolve，成功后刷新任务状态并更新操作记录",
            "点击“重新同步”调用POST /api/v1/sync/tasks/{taskId}/retry，并跟踪重试状态",
            "点击“忽略”弹出二次确认模态框，强制填写备注，提交后调用POST /api/v1/sync/tasks/batch-ignore（单个任务）",
            "若任务失败次数超过3次，重新同步按钮置灰并提示“建议联系船端排查”"
          ],
          "dataInputs": [
            "GET /api/v1/sync/conflicts/{conflictId}/diff 获取冲突差异详情",
            "POST /api/v1/sync/conflicts/{conflictId}/resolve 提交解决结果（包含合并后数据快照）",
            "POST /api/v1/sync/tasks/{taskId}/retry 重试单个任务",
            "POST /api/v1/sync/tasks/{taskId}/ignore 忽略单个任务（需备注）"
          ],
          "originalPageKey": "page-3",
          "scenarioKey": "sc-5",
          "scenarioName": "船舶管理人员进行船岸数据同步管理"
        },
        {
          "key": "sc-5-page-4-3",
          "priority": "P1",
          "type": "看板页",
          "name": "同步历史报告与审计日志",
          "vueFile": "SyncReport.vue",
          "goal": "检索同步历史记录，生成同步健康度报告并导出，支撑合规审计。",
          "features": [
            "同步历史报告与审计日志查询"
          ],
          "sections": [
            "筛选区：船舶下拉、日期范围、操作类型（自动同步/人工重试/冲突解决/忽略）",
            "审计日志列表：表格展示船舶、操作时间、操作人员、操作描述、处理结果，支持分页",
            "统计看板区：显示指定周期内的同步成功率、平均延迟、冲突率、未处理量，以卡片或图表展示",
            "导出操作栏：提供“导出PDF”和“导出CSV”按钮，点击后生成报告并下载"
          ],
          "states": [
            "正常态：有日志数据并正确展示统计图表",
            "空态：无日志时显示“暂无同步历史记录”",
            "加载态：筛选条件变化时整体刷新加载",
            "异常态：接口失败时显示错误提示"
          ],
          "keyInteractions": [
            "切换筛选条件后自动重新加载审计日志列表和统计看板数据",
            "点击导出按钮调取导出接口，根据用户权限验证（审计员或管理员）后下载文件",
            "点击日志列表中某条记录可展开详情（如冲突解决的具体内容）"
          ],
          "dataInputs": [
            "GET /api/v1/sync/report?shipId={}&startTime={}&endTime={} 获取统计报告",
            "GET /api/v1/sync/audit-log?shipId={}&operator={}&action={}&page={} 分页查询审计日志",
            "GET /api/v1/sync/report/export?shipId={}&startTime={}&endTime={}&format=pdf 导出报告"
          ],
          "originalPageKey": "page-4",
          "scenarioKey": "sc-5",
          "scenarioName": "船舶管理人员进行船岸数据同步管理"
        }
      ]
    },
    {
      "key": "sc-6",
      "name": "船端一线作业人员执行移动端工单与离线报工",
      "priority": "P0",
      "pages": [
        {
          "key": "sc-6-page-1-0",
          "priority": "P0",
          "type": "列表页",
          "name": "待执行工单离线列表",
          "vueFile": "MobileWorkOrderList.vue",
          "goal": "在弱网/无网环境下，通过本地缓存加载当前船端一线作业人员待执行的工单列表，支持筛选和排序，点击进入详情。",
          "features": [
            "待执行工单离线列表"
          ],
          "sections": [
            "顶部状态栏：网络状态图标、当前用户、未同步数量提示",
            "筛选区：设备类型下拉、状态（待执行/执行中）筛选、优先级筛选、日期排序切换",
            "工单列表区：卡片式展示工单编号、设备名称、位置、优先级、计划日期、状态标签，支持上拉加载更多",
            "空态提示：无待执行工单时显示“暂无待执行工单”和刷新按钮"
          ],
          "states": [
            "正常态：列表加载完成，有数据",
            "空态：本地缓存无数据",
            "加载态：首次打开或下拉刷新时显示加载动画",
            "异常态：网络请求失败或本地数据库读取错误，显示错误提示及重试按钮"
          ],
          "keyInteractions": [
            "进入页面时自动检测网络状态，若网络可用则请求服务器并同步本地缓存",
            "点击工单卡片跳转至工单详情页（MobileWorkOrderDetail.vue）",
            "下拉刷新：强制从服务器拉取最新数据（网络可用时），更新本地缓存",
            "筛选条件变更后实时过滤列表"
          ],
          "dataInputs": [
            "工单列表数据：工单ID、设备名称、设备位置、优先级、计划日期、状态、简要描述、附件URL列表",
            "筛选参数：设备类型、优先级、状态",
            "离线缓存策略：本地SQLite中存储的最新工单列表"
          ],
          "originalPageKey": "page-1",
          "scenarioKey": "sc-6",
          "scenarioName": "船端一线作业人员执行移动端工单与离线报工"
        },
        {
          "key": "sc-6-page-2-1",
          "priority": "P0",
          "type": "详情页",
          "name": "工单详情与维保指引查看",
          "vueFile": "MobileWorkOrderDetail.vue",
          "goal": "离线展示工单完整详情，包括设备信息、维保操作步骤、物料清单、安全注意事项，支持附件本地查看，引导作业人员按规程执行。",
          "features": [
            "工单详情与维保指引查看"
          ],
          "sections": [
            "顶部导航栏：返回按钮、工单编号、状态标签",
            "设备信息区：设备名称、型号、位置、维保类型、设备资产树路径",
            "维保步骤区：按顺序显示步骤列表，每步含序号、操作描述、所需工具/物料、安全提示，支持勾选已完成步骤",
            "物料清单区：备件表格（名称、型号、计划用量、实际库存位置），可标记“已领用”",
            "附件区：已下载的图纸、手册缩略图列表，点击可打开查看（支持缩放旋转）",
            "底部操作栏：“开始执行”按钮（进入执行页）、“查看安全注意事项”浮层入口"
          ],
          "states": [
            "正常态：工单数据加载完成，步骤未勾选",
            "部分完成态：部分步骤已勾选（本地持久化），断点续执",
            "全完成态：所有步骤勾选（可进入执行页提交报工）",
            "加载态：首次从列表页跳转时从本地缓存读取",
            "异常态：工单数据加载失败（本地缓存损坏），提示重新进入列表页刷新"
          ],
          "keyInteractions": [
            "点击步骤勾选框切换完成状态，实时持久化至本地SQLite",
            "点击“开始执行”按钮跳转至维保执行与报工录入页（MobileWorkOrderExecute.vue），携带工单ID",
            "点击附件缩略图打开本地文件，支持PDF分页、图片缩放旋转",
            "长按物料行可标记已领用（变更状态）"
          ],
          "dataInputs": [
            "工单详情：工单ID、设备名称、型号、位置、维保类型、设备资产树路径",
            "维保步骤列表：步骤ID、序号、描述、所需工具、安全提示、物料关联ID",
            "物料清单：备件编码、名称、计划数量、库存可用量、位置",
            "附件列表：文件类型、本地缓存路径、文件大小"
          ],
          "originalPageKey": "page-2",
          "scenarioKey": "sc-6",
          "scenarioName": "船端一线作业人员执行移动端工单与离线报工"
        },
        {
          "key": "sc-6-page-3-2",
          "priority": "P0",
          "type": "表单页",
          "name": "维保执行与报工录入",
          "vueFile": "MobileWorkOrderExecute.vue",
          "goal": "引导作业人员按步骤执行维保操作，填写实际工时、消耗物料、异常情况，并通过拍照/录像现场留痕，最后提交报工数据，所有数据在离线状态下暂存本地。",
          "features": [
            "维保执行与报工录入"
          ],
          "sections": [
            "顶部导航栏：返回按钮、工单编号、当前步骤进度（如3/8）",
            "步骤执行区：当前步骤卡片（显示序号、操作描述），实际开始/结束时间输入（默认当前时间，可修改），执行人选择（预设本人），异常备注文本输入",
            "物料消耗区：从物料清单中选择实际消耗的备件（含数量输入），支持追加领用（搜索新增物料）",
            "多媒体留痕区：拍照/录像按钮，已拍摄的缩略图列表，支持预览和删除，每个媒体可关联至当前步骤",
            "提交报工按钮：位于底部，点击后校验必填项（步骤完成、异常说明），通过后存储至本地SQLite并标记工单为“待同步”",
            "空间不足提示：当本地存储低于阈值时弹窗"
          ],
          "states": [
            "正常执行态：首次进入，无历史数据",
            "断点续执态：部分步骤已完成（从详情页勾选继承），继续填写当前步骤",
            "提交成功态：报工数据本地存储成功，显示“报工已保存”提示",
            "校验失败态：必填项未填时按钮禁用并提示",
            "存储空间不足态：弹窗警告，引导清理"
          ],
          "keyInteractions": [
            "按步骤顺序引导，每完成一步自动进入下一步（或点击顶部进度条跳转）",
            "点击拍照/录像按钮调用系统相机，拍摄后图片/视频自动添加至当前步骤",
            "提交报工时执行本地校验，通过后将整个报工数据打包存入本地SQLite，工单状态置为“待同步”",
            "若同一工单多次提交，本地覆盖上次缓存（保留历史版本用于冲突解决）",
            "当存储空间低于阈值时弹窗提示清理已同步数据"
          ],
          "dataInputs": [
            "工单ID、当前步骤ID、步骤序列（来自工单详情）",
            "实际开始时间、实际结束时间（DateTime）",
            "执行人（默认当前用户）",
            "异常备注（文本）",
            "消耗物料列表（备件编码、数量）",
            "多媒体文件列表（本地路径、文件哈希、关联步骤ID）",
            "提交报工时间（自动生成）"
          ],
          "originalPageKey": "page-3",
          "scenarioKey": "sc-6",
          "scenarioName": "船端一线作业人员执行移动端工单与离线报工"
        },
        {
          "key": "sc-6-page-4-3",
          "priority": "P0",
          "type": "设置/管理页",
          "name": "离线缓存与自动同步管理",
          "vueFile": "MobileSyncStatus.vue",
          "goal": "展示同步队列状态、冲突列表，允许用户手动触发同步、查看同步日志、管理本地缓存空间。",
          "features": [
            "离线缓存与自动同步"
          ],
          "sections": [
            "同步概览区：网络状态、待同步工单数、上次同步时间、存储使用量",
            "同步队列区：表格展示每项工单的同步状态（待同步/同步中/已完成/失败）、重试次数、提交时间",
            "冲突列表区：若有冲突，展示工单ID、差异对比（岸端版本 vs 本地版本）、解决状态，提供“使用本地”、“使用岸端”、“标记待岸基处理”操作",
            "手动触发按钮：强制同步所有待同步工单",
            "缓存管理区：清理已同步数据、清理全部缓存（含附件）"
          ],
          "states": [
            "正常态：已同步且无冲突",
            "待同步态：有未同步数据，显示待同步数量",
            "同步中态：显示进度条或百分比",
            "冲突态：显示冲突列表，需人工干预",
            "错误态：同步失败超过重试次数，显示失败原因"
          ],
          "keyInteractions": [
            "点击手动同步按钮触发后台同步任务，过程中显示进度",
            "点击冲突项展开差异对比，选择解决策略",
            "点击清理按钮删除已同步数据和附件（保留日志30天）",
            "自动同步时更新状态标签和队列显示"
          ],
          "dataInputs": [
            "同步队列列表：工单ID、报文JSON、附件列表、本地版本号、同步状态、重试次数",
            "冲突记录：工单ID、岸端版本字段差异、本地版本字段差异、解决状态",
            "存储空间用量：总容量、已使用、可清理空间"
          ],
          "originalPageKey": "page-4",
          "scenarioKey": "sc-6",
          "scenarioName": "船端一线作业人员执行移动端工单与离线报工"
        }
      ]
    },
    {
      "key": "sc-7",
      "name": "船端一线作业人员进行物资扫码盘点与领用",
      "priority": "P1",
      "pages": [
        {
          "key": "sc-7-page-1-0",
          "priority": "P1",
          "type": "工作台页",
          "name": "物资盘点领用工作台",
          "vueFile": "InventoryWorkbench.vue",
          "goal": "展示待处理盘点任务、领料提示、退料记录及网络状态，提供快速导航到扫描盘点、领料、退料和同步管理页面的入口，并显示同步概览。",
          "features": [
            "离线库存与待处理任务加载",
            "离线数据同步与状态管理"
          ],
          "sections": [
            "网络状态指示区：显示在线/弱网/离线状态图标及本地数据版本",
            "待办任务卡片区：按任务类型（盘点/领料/退料）分组展示待处理条目，含数量标识",
            "快捷操作栏：三个按钮（扫描盘点、领料、退料）跳转至对应页面",
            "同步进度概览区：显示待同步条数、上次同步时间、手动同步按钮",
            "最近操作记录区：最近5条本地操作摘要（类型、物料、时间、状态）"
          ],
          "states": [
            "正常态：有网络且有待办任务，本地数据最新",
            "空态：无待办任务，显示鼓励提示（“暂无待办任务，您可以手动盘点或领料”）",
            "加载态：首次加载本地缓存时显示加载骨架屏",
            "异常态：本地缓存加载失败，显示错误提示并提供重试按钮"
          ],
          "keyInteractions": [
            "点击待办任务卡片跳转到对应操作页并预填任务ID",
            "点击同步按钮触发全局同步（在线时）",
            "下拉刷新重新加载本地缓存（先检测版本，版本不一致则提示在线同步）"
          ],
          "dataInputs": [
            "本地缓存的待执行盘点任务列表",
            "本地缓存的关联工单列表（待领料）",
            "本地缓存的退料记录摘要",
            "本地数据版本号",
            "网络状态枚举（online/weak/offline）",
            "同步队列统计（待同步条数、失败条数）"
          ],
          "originalPageKey": "page-1",
          "scenarioKey": "sc-7",
          "scenarioName": "船端一线作业人员进行物资扫码盘点与领用"
        },
        {
          "key": "sc-7-page-2-1",
          "priority": "P0",
          "type": "详情页",
          "name": "条码扫描盘点",
          "vueFile": "BarcodeScanInventory.vue",
          "goal": "通过摄像头扫描条码识别物料，录入实物数量并对比系统库存，支持拍照留痕，生成盘点差异记录。",
          "features": [
            "条码扫描盘点"
          ],
          "sections": [
            "扫描预览区：全屏摄像头取景框，支持手动输入条码",
            "物料信息展示区：识别成功后显示物料编码、名称、图例、系统库存数量",
            "实物录入区：数字输入框填写实物数量，自动计算差异并显示盘盈/盘亏/一致标识",
            "证据附件区：拍照/视频按钮，已拍缩略图列表，支持删除重拍",
            "操作按钮区：提交盘点 / 重置 / 继续扫描（批量模式）"
          ],
          "states": [
            "正常态：摄像头可用，扫描成功显示物料信息",
            "空态：无扫描操作，展示示例提示“请对准条码”",
            "加载态：识别中显示加载动画",
            "异常态：条码无法识别或本地未找到物料，显示“未知物料”提示并提供手动录入入口"
          ],
          "keyInteractions": [
            "摄像头实时扫描，识别成功后自动加载物料信息",
            "数量录入后实时计算差异并变更标识颜色",
            "点击拍照按钮调用系统相机，照片压缩后存入本地",
            "提交后本地生成盘点差异记录，并返回工作台更新待办列表"
          ],
          "dataInputs": [
            "条码字符串",
            "系统库存数量（本地缓存）",
            "实物清点数量",
            "照片/视频文件（Base64或本地路径）",
            "盘点任务ID（从工作台传入）",
            "用户ID（登录态）"
          ],
          "originalPageKey": "page-2",
          "scenarioKey": "sc-7",
          "scenarioName": "船端一线作业人员进行物资扫码盘点与领用"
        },
        {
          "key": "sc-7-page-3-2",
          "priority": "P0",
          "type": "详情页",
          "name": "物资领用",
          "vueFile": "MaterialRequisition.vue",
          "goal": "扫描或搜索物料，校验库存，填写领用信息并关联工单，提交后扣减本地库存生成待同步领料单。",
          "features": [
            "物资领用管理"
          ],
          "sections": [
            "物料选择区：顶部搜索框 + 条码扫描入口，下方展示物料卡片（编码、名称、库存量、阈值）",
            "领用详情表单区：领用数量输入框、用途说明文本域、关联工单下拉选择（从本地工单列表）",
            "缺件预警提示区：当领用数量超过库存时，显示红色预警并自动生成缺件申请单（可补充紧急度说明）",
            "操作按钮区：提交领料 / 取消 / 添加到领料单（允许一次领多种物料？本设计单次单一物料，可多次操作）"
          ],
          "states": [
            "正常态：物料已选择，库存充足，表单有效",
            "空态：未选择物料时显示提示“请扫描或搜索物料”",
            "加载态：搜索物料或加载工单列表时显示加载指示",
            "异常态：校验不通过（如数量超库存、工单无效）显示错误提示并阻止提交"
          ],
          "keyInteractions": [
            "扫描条码自动填充物料并加载库存数据",
            "手动输入数量后实时校验并触发缺件预警",
            "从工单列表选择关联工单（支持搜索过滤）",
            "提交后本地扣减库存，生成领料记录并跳转回工作台"
          ],
          "dataInputs": [
            "物料编码（手动或扫描）",
            "领用数量",
            "用途说明",
            "关联工单号（可选）",
            "库存可用量（本地缓存）",
            "缺件预警阈值（本地缓存）",
            "本地待处理工单列表",
            "用户ID"
          ],
          "originalPageKey": "page-3",
          "scenarioKey": "sc-7",
          "scenarioName": "船端一线作业人员进行物资扫码盘点与领用"
        },
        {
          "key": "sc-7-page-4-3",
          "priority": "P0",
          "type": "详情页",
          "name": "退料管理",
          "vueFile": "MaterialReturn.vue",
          "goal": "扫描退料条码，选择退料原因并校验数量，提交后增加本地库存生成待同步退料单。",
          "features": [
            "退料管理"
          ],
          "sections": [
            "物料选择区：条码扫描入口 + 手动输入物料编码",
            "退料信息展示区：展示物料名称、编码、最近领用记录摘要（领料单号、数量、日期）",
            "退料表单区：退料数量输入框、退料原因下拉选择（工单剩余/物料质量问题/误领等）、备注文本域",
            "校验结果区：自动显示最大可退量，若超量显示红色拦截提示",
            "证据附件区（仅限质量问题）：拍照按钮，与盘点复用拍照功能",
            "操作按钮区：提交退料 / 取消"
          ],
          "states": [
            "正常态：物料已选择，退料数量合法，可提交",
            "空态：未选择物料时提示",
            "加载态：加载领用记录时显示加载",
            "异常态：退料超过可退量时直接拦截，显示提示并禁用提交"
          ],
          "keyInteractions": [
            "扫描条码自动填充物料并加载最近领用记录",
            "输入数量时实时校验最大可退量",
            "原因选择“物料质量问题”时显示拍照入口",
            "提交后本地增加库存，生成退料记录并返回工作台"
          ],
          "dataInputs": [
            "物料编码",
            "退料数量",
            "退料原因枚举",
            "备注",
            "历史领用记录（物料维度最近5条）",
            "已退总量（本地计算）",
            "照片（质量问题）",
            "用户ID"
          ],
          "originalPageKey": "page-4",
          "scenarioKey": "sc-7",
          "scenarioName": "船端一线作业人员进行物资扫码盘点与领用"
        },
        {
          "key": "sc-7-page-5-4",
          "priority": "P0",
          "type": "列表页",
          "name": "数据同步管理",
          "vueFile": "DataSyncDetail.vue",
          "goal": "详细查看同步队列，管理同步进度、处理冲突和失败重试。",
          "features": [
            "离线数据同步与状态管理"
          ],
          "sections": [
            "同步状态总览区：显示待同步/同步中/成功/失败的条数统计及进度条",
            "同步队列列表区：按时间倒序展示每条待同步/已同步记录（数据类型、物料名称、操作类型、操作时间、状态标识）",
            "同步失败/冲突处理区：专门展示失败和冲突项，每条提供重试按钮或冲突对比视图（本地 vs 岸端）",
            "手动操作区：全局同步按钮（在线时）、清除成功记录按钮、历史同步日志入口"
          ],
          "states": [
            "正常态：有同步记录，同步队列展示正常",
            "空态：无待同步记录，显示“所有数据已同步”",
            "加载态：加载同步列表时显示骨架屏",
            "异常态：网络异常无法同步时，显示提示并禁用自动同步"
          ],
          "keyInteractions": [
            "点击单项重试按钮重新上传该条数据",
            "冲突项点击后展开对比视图，选择“保留本地”或“采用岸端”",
            "长按单项查看详情（原始数据JSON）",
            "下拉刷新手动检查岸端同步状态"
          ],
          "dataInputs": [
            "待同步队列（数据类型、内容JSON、本地时间、重试次数、附件列表）",
            "岸端同步结果反馈（成功/失败原因/冲突详情）",
            "冲突数据对比视图（本地版本、岸端版本、差异字段）",
            "网络状态"
          ],
          "originalPageKey": "page-5",
          "scenarioKey": "sc-7",
          "scenarioName": "船端一线作业人员进行物资扫码盘点与领用"
        }
      ]
    },
    {
      "key": "sc-8",
      "name": "系统管理员配置组织权限与流程定义",
      "priority": "P0",
      "pages": [
        {
          "key": "sc-8-page-1-0",
          "priority": "P0",
          "type": "列表页",
          "name": "用户管理",
          "vueFile": "UserManager.vue",
          "goal": "系统管理员对系统用户进行增删改查、批量导入导出、启用/禁用及角色分配操作，覆盖用户全生命周期管理。",
          "features": [
            "用户管理"
          ],
          "sections": [
            "顶部筛选栏（部门、角色、状态、搜索框）",
            "操作按钮区（新建用户、批量导入、批量导出）",
            "用户列表表格（账号、姓名、部门、角色、状态、操作列）",
            "分页控件",
            "新建/编辑用户弹窗（表单：账号、姓名、部门、联系方式、角色分配）",
            "批量导入弹窗（上传CSV、预览、确认）"
          ],
          "states": [
            "正常态：展示用户列表，数据不少于1条",
            "空态：无用户时显示引导创建提示",
            "加载态：骨架屏或加载动画",
            "异常态：接口超时或错误时显示错误提示与重试按钮"
          ],
          "keyInteractions": [
            "点击“新建用户”弹出创建表单弹窗，填写后保存并刷新列表",
            "点击表格行操作列“编辑”弹出编辑表单弹窗，修改后保存",
            "点击“启用/禁用”按钮，二次确认后切换用户状态并更新列表",
            "支持按住Shift多选用户后点击“批量导入”",
            "点击“导出”下载CSV文件",
            "点击搜索按钮触发按部门/角色/状态/关键词过滤"
          ],
          "dataInputs": [
            "用户列表查询参数（部门ID、角色ID、状态、关键词、分页）",
            "新建/编辑用户表单字段（账号、姓名、部门ID、联系方式、角色ID列表）",
            "批量导入文件（CSV格式，含用户信息字段）"
          ],
          "originalPageKey": "page-1",
          "scenarioKey": "sc-8",
          "scenarioName": "系统管理员配置组织权限与流程定义"
        },
        {
          "key": "sc-8-page-2-1",
          "priority": "P0",
          "type": "列表页",
          "name": "角色与权限管理",
          "vueFile": "RolePermissionManager.vue",
          "goal": "系统管理员自定义角色，按模块精细配置功能菜单和操作权限，支持复制角色快速创建。",
          "features": [
            "角色与权限管理"
          ],
          "sections": [
            "角色列表左面板（角色名称、关联用户数、操作按钮）",
            "角色详情右面板（角色基本信息、权限树、操作按钮）",
            "顶部工具栏（新建角色、复制角色、删除角色）",
            "权限树组件（模块展开勾选操作权限）"
          ],
          "states": [
            "正常态：左面板显示角色列表，右面板显示选中角色详情",
            "空态：无角色时显示提示创建",
            "加载态：角色列表加载中",
            "异常态：权限树加载失败提示"
          ],
          "keyInteractions": [
            "点击左面板角色项，右面板切换显示该角色的权限配置",
            "点击“新建角色”填写名称和描述，保存后刷新左面板",
            "点击“复制角色”选择源角色，生成新角色副本",
            "在权限树勾选模块和操作权限（查看、新增、编辑、删除、审核），自动保存",
            "删除角色前检查引用，存在引用则弹框提示禁止删除"
          ],
          "dataInputs": [
            "角色列表查询（无参）",
            "权限树数据（模块列表+操作类型）",
            "创建/编辑角色表单（名称、描述、权限树选中项）",
            "复制角色参数（源角色ID）"
          ],
          "originalPageKey": "page-2",
          "scenarioKey": "sc-8",
          "scenarioName": "系统管理员配置组织权限与流程定义"
        },
        {
          "key": "sc-8-page-3-2",
          "priority": "P0",
          "type": "工作台页",
          "name": "流程定义",
          "vueFile": "WorkflowDesigner.vue",
          "goal": "系统管理员通过可视化拖拽设计器配置审批流程、工单流转节点，定义节点、审批人、条件分支、超时及转交策略。",
          "features": [
            "流程定义"
          ],
          "sections": [
            "流程类型选择/列表区域",
            "流程设计画布（拖拽节点、连接线）",
            "节点属性面板（审批人、超时规则、转交策略）",
            "顶部操作栏（保存、发布、版本管理）",
            "已发布流程概览视图"
          ],
          "states": [
            "正常态：显示已有流程列表，选中后进入设计器",
            "空态：无流程时显示创建引导",
            "加载态：流程定义数据加载中",
            "异常态：设计器保存失败提示"
          ],
          "keyInteractions": [
            "选择流程类型（工单审核、采购审批、航前校验等）",
            "从左侧节点库拖拽节点到画布并连线",
            "点击节点打开属性面板设置审批人角色/用户、超时提醒时间、转交对象",
            "点击“保存”保存草稿版本，点击“发布”创建新版本并生效",
            "点击版本管理查看历史版本并回滚"
          ],
          "dataInputs": [
            "流程定义ID（创建时无）",
            "流程类型枚举",
            "画布数据（节点列表、连线列表、节点属性）",
            "审批人选择（角色ID或用户ID列表）",
            "超时规则（小时数、转交对象）"
          ],
          "originalPageKey": "page-3",
          "scenarioKey": "sc-8",
          "scenarioName": "系统管理员配置组织权限与流程定义"
        },
        {
          "key": "sc-8-page-4-3",
          "priority": "P1",
          "type": "工作台页",
          "name": "配置验证与发布",
          "vueFile": "ConfigSimulation.vue",
          "goal": "支持系统管理员模拟切换视角测试权限和流程，确认无误后正式发布全局配置并记录变更。",
          "features": [
            "配置验证与发布"
          ],
          "sections": [
            "模拟用户/角色选择下拉框",
            "模拟操作区域（菜单导航模拟、流程实例模拟）",
            "配置冲突检查结果列表",
            "全局发布按钮与影响范围确认弹窗",
            "变更日志摘要"
          ],
          "states": [
            "正常态：可正常选择角色进行模拟",
            "空态：无待验证配置时提示“当前配置无需验证”",
            "加载态：模拟启动或执行中",
            "异常态：模拟执行时接口异常提示"
          ],
          "keyInteractions": [
            "选择模拟角色后，页面UI切换为该角色视图（菜单过滤、按钮禁用）",
            "在模拟模式下执行创建工单、审批等操作，验证流程节点跳转",
            "点击“检查冲突”扫描并展示冲突项",
            "点击“正式发布”弹出确认框显示影响范围（如影响用户数、运行流程数）",
            "发布后显示变更记录摘要链接"
          ],
          "dataInputs": [
            "模拟角色ID/用户ID",
            "模拟操作动作（菜单访问、流程提交）",
            "发布确认信息"
          ],
          "originalPageKey": "page-4",
          "scenarioKey": "sc-8",
          "scenarioName": "系统管理员配置组织权限与流程定义"
        },
        {
          "key": "sc-8-page-5-4",
          "priority": "P0",
          "type": "列表页",
          "name": "审计日志查询",
          "vueFile": "AuditLogView.vue",
          "goal": "集中展示所有用户、角色、权限、流程的变更审计日志，支持检索和导出。",
          "features": [
            "审计日志查询"
          ],
          "sections": [
            "顶部筛选栏（时间范围、操作人、操作对象类型、操作类型）",
            "日志列表表格（操作时间、操作人、操作类型、操作对象、内容摘要）",
            "日志详情抽屉（变更前后对比）",
            "导出按钮"
          ],
          "states": [
            "正常态：显示日志列表",
            "空态：无匹配日志时提示“无审计记录”",
            "加载态：日志数据加载中",
            "异常态：查询接口失败"
          ],
          "keyInteractions": [
            "选择筛选条件后点击查询或重置",
            "点击表格行展开详情抽屉查看变更前后对比",
            "点击“导出”选择格式（Excel/PDF）下载文件",
            "分页浏览"
          ],
          "dataInputs": [
            "筛选条件：时间范围、操作人、操作对象类型、操作类型",
            "分页参数",
            "导出格式"
          ],
          "originalPageKey": "page-5",
          "scenarioKey": "sc-8",
          "scenarioName": "系统管理员配置组织权限与流程定义"
        }
      ]
    },
    {
      "key": "sc-9",
      "name": "系统管理员监控系统运行与操作审计",
      "priority": "P1",
      "pages": [
        {
          "key": "sc-9-page-1-0",
          "priority": "P0",
          "type": "看板页",
          "name": "系统运行状态总览仪表盘",
          "vueFile": "SysMonitorDashboard.vue",
          "goal": "集中展示系统整体健康度与关键运行指标，帮助管理员快速掌握系统运行态势",
          "features": [
            "系统运行状态总览仪表盘"
          ],
          "sections": [
            "顶部红色告警横幅（微服务异常或同步成功率低时显示）",
            "指标卡片行：服务在线数/异常数、数据库连接池使用率、CPU/内存/磁盘使用率",
            "统计图表区：资源使用趋势折线图、近24小时同步成功率柱状图",
            "快捷入口按钮区：跳转至告警管理、操作审计、报告生成",
            "筛选器栏：按船舶、模块、时间范围筛选指标（支持自动刷新）"
          ],
          "states": [
            "正常态（所有指标健康）",
            "告警态（微服务异常或资源超阈值显示红色横幅）",
            "空态（首次部署无数据）",
            "加载态（异步获取数据时显示骨架屏）",
            "异常态（API超时或返回错误）"
          ],
          "keyInteractions": [
            "点击微服务异常数卡片跳转至告警管理页面并预设筛选条件",
            "点击同步成功率柱状图某时段可下钻查看失败船舶列表",
            "切换自动刷新开关（默认每30秒）",
            "鼠标悬停在趋势图上显示时间点具体数值"
          ],
          "dataInputs": [
            "GET /api/monitor/overview 返回整体健康度与摘要指标",
            "GET /api/monitor/sync-stats?range=24h 返回各船舶同步统计",
            "GET /api/monitor/resource-trend?type=cpu,memory,disk,network 资源时序数据"
          ],
          "originalPageKey": "page-1",
          "scenarioKey": "sc-9",
          "scenarioName": "系统管理员监控系统运行与操作审计"
        },
        {
          "key": "sc-9-page-2-1",
          "priority": "P0",
          "type": "列表页",
          "name": "异常告警分级处理与闭环",
          "vueFile": "AlertManagement.vue",
          "goal": "集中管理所有系统异常告警，支持分级响应与处置流程记录",
          "features": [
            "异常告警分级处理与闭环"
          ],
          "sections": [
            "筛选栏：严重程度、告警类型、时间范围、状态（未处理/处理中/已解决）",
            "告警列表表格：类型、级别、描述、影响范围、发生时间、累计次数、状态",
            "告警详情抽屉：告警内容、影响船舶/模块、首次/最近发生时间、关联操作日志列表",
            "处理操作面板：处理措施下拉选择、处理备注输入框、状态更新按钮",
            "历史处理记录查询区：按处理人、处理结果、时间范围检索",
            "批量操作栏：批量标记处理状态"
          ],
          "states": [
            "正常态（有告警数据）",
            "空态（无告警）",
            "加载态",
            "异常态（API不可用）",
            "处理中状态（局部loading）"
          ],
          "keyInteractions": [
            "点击告警行展开详情抽屉",
            "选择处理措施并填写备注后提交，状态变更为‘处理中’或‘已解决’",
            "批量选中告警后统一标记处理",
            "点击关联操作日志链接跳转至审计日志页面"
          ],
          "dataInputs": [
            "GET /api/monitor/alerts 告警列表",
            "PUT /api/monitor/alerts/{alertId}/handle 更新处理",
            "GET /api/monitor/alerts/{alertId} 告警详情"
          ],
          "originalPageKey": "page-2",
          "scenarioKey": "sc-9",
          "scenarioName": "系统管理员监控系统运行与操作审计"
        },
        {
          "key": "sc-9-page-3-2",
          "priority": "P0",
          "type": "列表页",
          "name": "操作审计日志精细查询与异常标记",
          "vueFile": "AuditLogSearch.vue",
          "goal": "支持按多维条件检索用户操作日志，辅助合规审计与违规排查",
          "features": [
            "操作审计日志精细查询与异常标记"
          ],
          "sections": [
            "复合筛选面板：时间范围（自定义+快捷选项）、用户角色、操作类型、操作对象",
            "日志结果表格：时间、操作用户、角色、IP地址、操作类型、对象、详情（展开后显示变更前后值）",
            "标记操作栏：单条/批量标记为‘待审核’并添加备注",
            "审核确认栏：对‘待审核’条目执行‘确认’或‘驳回’",
            "导出工具栏：导出CSV/PDF，导出内容含筛选条件摘要"
          ],
          "states": [
            "正常态（有日志数据）",
            "空态（无符合条件的日志）",
            "加载态",
            "异常态（查询超时）",
            "导出进度态（生成文件期间显示进度）"
          ],
          "keyInteractions": [
            "组合条件查询后刷新表格",
            "点击详情展开查看变更前后JSON对比",
            "右键或勾选条目标记为‘待审核’",
            "点击导出按钮触发异步导出并下载",
            "对标记条目批量审核确认"
          ],
          "dataInputs": [
            "GET /api/audit/logs 日志列表",
            "PUT /api/audit/logs/{logId}/mark 标记状态",
            "GET /api/audit/logs/{logId} 详情",
            "POST /api/audit/logs/export 导出"
          ],
          "originalPageKey": "page-3",
          "scenarioKey": "sc-9",
          "scenarioName": "系统管理员监控系统运行与操作审计"
        },
        {
          "key": "sc-9-page-4-3",
          "priority": "P1",
          "type": "工作台页",
          "name": "运维报告与合规文档自动生成",
          "vueFile": "ReportGenerator.vue",
          "goal": "定期或按需生成系统运维状况报告与审计合规文档，支撑决策与审查",
          "features": [
            "运维报告与合规文档自动生成"
          ],
          "sections": [
            "报告模板选择区：预设模板列表（运维周报、月报、审计摘要、航前合规汇总）",
            "自定义配置区：选择船舶、时间区间、是否包含告警明细、操作审计摘要等",
            "生成与预览区：一键生成按钮、生成进度条、实时预览（PDF/Word）",
            "定时计划设置区：启动/关闭定时生成，配置cron表达式、接收邮箱",
            "已生成报告列表：按类型、生成时间检索，下载或删除操作"
          ],
          "states": [
            "正常态（有模板和报告列表）",
            "空态（无任何报告）",
            "生成中态（进度条显示）",
            "异常态（生成失败提示）",
            "空态（未配置定时计划）"
          ],
          "keyInteractions": [
            "选择模板或自定义配置后点击生成",
            "查看生成进度条，完成后自动打开预览",
            "设置定时生成计划，保存后生效",
            "从已生成列表下载报告",
            "删除过期报告"
          ],
          "dataInputs": [
            "GET /api/report/templates 报告模板列表",
            "POST /api/report/generate 生成报告",
            "GET /api/report/list 已生成报告列表",
            "DELETE /api/report/{reportId} 删除报告"
          ],
          "originalPageKey": "page-4",
          "scenarioKey": "sc-9",
          "scenarioName": "系统管理员监控系统运行与操作审计"
        }
      ]
    },
    {
      "key": "sc-10",
      "name": "审计员查询操作日志支撑合规审查",
      "priority": "P0",
      "pages": [
        {
          "key": "sc-10-page-1-0",
          "priority": "P0",
          "type": "工作台页",
          "name": "审计日志查询与合规审查工作台",
          "vueFile": "AuditLogWorkspace.vue",
          "goal": "审计员在一体化界面中通过多维筛选快速定位操作日志，查看完整详情与变更差异，对异常操作进行合规标记，并按需导出审计报告，所有审计行为自动留痕。",
          "features": [
            "审计日志查询与列表展示",
            "日志详情查看与变更差异对比",
            "合规判定与异常标记",
            "审计报告导出"
          ],
          "sections": [
            "顶部统计摘要区：展示总日志条数及按操作类型/日期的柱状图或饼图",
            "高级筛选面板区：包含时间范围选择器（近7天/30天/自定义）、用户角色下拉、操作类型多选、船舶名称搜索",
            "日志列表区：每行显示操作人、时间、模块、操作类型、状态（正常/待审核/不合规），支持点击展开详情",
            "详情展开面板：以左右对比或内联高亮展示变更前后内容，包含所有元数据字段",
            "操作工具栏：每条日志右侧或详情面板内提供标记按钮（待审核/不合规），以及列表顶部的导出报告按钮"
          ],
          "states": [
            "正常态：有日志数据展示并可按条件筛选",
            "空态：无匹配日志时显示“当前筛选条件下无操作日志，请调整查询条件”并配图标",
            "加载态：初次加载或筛选查询时显示骨架屏或加载中动画",
            "异常态：接口请求失败时显示错误提示与重试按钮"
          ],
          "keyInteractions": [
            "选择筛选条件后自动触发查询（或点击查询按钮），列表刷新并更新统计图",
            "点击日志行展开/收起详情面板，变更差异区域高亮显示新增（绿色）和删除（红色）",
            "点击“标记为待审核”或“标记为不合规”按钮弹出标记弹窗，必填审计意见，可选触发审批流程",
            "点击“导出报告”按钮弹出导出配置对话框，选择格式并填写标题，确认后后台异步生成并通知下载"
          ],
          "dataInputs": [
            "筛选条件：timeRange（开始/结束日期）、role（角色编码）、operationTypes（操作类型数组）、vesselName（船舶名称）",
            "日志列表数据：分页列表（items, total, page, limit），每条包含id, operator, time, module, operationType, status, ip, object, oldValue, newValue等",
            "日志详情数据：通过GET /api/audit-logs/{logId}/detail获取，含fullMetadata, oldValueJSON, newValueJSON, relatedLogIds",
            "标记提交数据：logId, status（pending_review或non_compliant）, comment, triggerWorkflow",
            "导出配置：format（pdf/csv）, title, signerName, filters（当前筛选条件）"
          ],
          "originalPageKey": "page-1",
          "scenarioKey": "sc-10",
          "scenarioName": "审计员查询操作日志支撑合规审查"
        }
      ]
    },
    {
      "key": "sc-11",
      "name": "采办协同人员发起采购与完成物资验收",
      "priority": "P0",
      "pages": [
        {
          "key": "sc-11-page-1-0",
          "priority": "P0",
          "type": "工作台页",
          "name": "采购需求审核与申请发起",
          "vueFile": "ProcurementRequirementReview.vue",
          "goal": "采办协同人员审核自动生成的采购需求列表，校验预算与BOM关联后发起采购申请",
          "features": [
            "采购需求审核与申请发起"
          ],
          "sections": [
            "筛选与搜索区（物料编码、紧急程度、创建时间）",
            "采购需求列表区（展示待处理需求，含物料编码、名称、数量、建议供应商、状态）",
            "需求详情预览区（点击列表项展开，显示库存、BOM关联、预算余额）",
            "发起采购申请操作区（按钮、弹窗表单：采购说明、交货期限、供应商选择、附件上传）",
            "预算不足提示区（条件触发）"
          ],
          "states": [
            "正常态：列表显示待处理需求，可操作",
            "空态：无待处理需求，显示“暂无待处理的采购需求”",
            "加载态：列表加载中，显示骨架屏",
            "异常态：数据加载失败，显示错误提示及重试按钮"
          ],
          "keyInteractions": [
            "点击需求列表行展开/收起详情，查看库存、BOM关联、预算余额",
            "点击“发起采购申请”按钮弹出表单，表单内动态校验预算余额",
            "预算不足时自动弹出提示并阻止提交，允许调整数量或跳转预算追加流程",
            "供应商选择支持从合格供应商列表下拉选择或手动输入",
            "附件上传支持多文件，格式限制（pdf/jpg/png）"
          ],
          "dataInputs": [
            "筛选条件（物料编码、紧急程度、创建时间范围）",
            "采购需求ID（用于获取详情）",
            "采购申请表单：采购说明、交货期限、供应商ID、附件文件列表",
            "预算追加申请（可选跳转）"
          ],
          "originalPageKey": "page-1",
          "scenarioKey": "sc-11",
          "scenarioName": "采办协同人员发起采购与完成物资验收"
        },
        {
          "key": "sc-11-page-2-1",
          "priority": "P1",
          "type": "列表页",
          "name": "采购订单跟踪",
          "vueFile": "ProcurementOrderTracking.vue",
          "goal": "查看采购订单列表，跟踪订单执行状态，接收和更新到货进度",
          "features": [
            "采购订单跟踪"
          ],
          "sections": [
            "筛选与搜索区（订单号、供应商、状态、预计到货时间）",
            "采购订单列表区（显示订单号、物料、金额、供应商、状态、预计到货时间）",
            "订单详情面板（点击订单行展开，展示完整信息及审批历史）",
            "状态更新操作区（手动更新状态按钮，备注输入）",
            "预警提示区（超期未到货时高亮显示）"
          ],
          "states": [
            "正常态：列表正常显示订单，可操作",
            "空态：无订单记录，显示“暂无采购订单”",
            "加载态：列表加载中",
            "异常态：列表加载失败，显示重试"
          ],
          "keyInteractions": [
            "点击订单行展开详情面板，查看物料明细、金额、供应商、审批历史",
            "点击“更新状态”按钮弹出状态选择弹窗，可选状态含待发货、已发货、运输中、部分到货、已到货，更新后添加备注",
            "超时未到货订单在列表中自动高亮（红色背景）并显示预警图标",
            "到货通知：当订单状态变为“已到货”时，系统自动弹出提醒并跳转到验收页面（或按钮）"
          ],
          "dataInputs": [
            "筛选条件（订单号、供应商、状态、时间范围）",
            "订单ID（用于获取详情）",
            "状态更新：新状态值、备注文字"
          ],
          "originalPageKey": "page-2",
          "scenarioKey": "sc-11",
          "scenarioName": "采办协同人员发起采购与完成物资验收"
        },
        {
          "key": "sc-11-page-3-2",
          "priority": "P0",
          "type": "工作台页",
          "name": "到货验收与入库处理",
          "vueFile": "GoodsReceiptAndInspection.vue",
          "goal": "对已到货的物资进行扫码验收，录入检验结果，执行入库或退换货操作",
          "features": [
            "到货验收与入库处理"
          ],
          "sections": [
            "订单选择区（下拉选择或搜索待验收的采购订单）",
            "条码扫描/手动录入区（支持摄像头扫描或输入框）",
            "物料明细核对区（显示订单物料、应到数量、实到数量输入框、外观检验结果选择）",
            "附件上传区（照片、质检报告）",
            "检验结论与操作区（合格/部分合格/不合格按钮，入库/退换货确认）",
            "历史记录与跟踪区（入库记录、退换货单列表）"
          ],
          "states": [
            "正常态：可进行验收操作",
            "空态：无可验收的订单，显示“暂无待验收的采购订单”",
            "加载态：订单加载中或扫描识别中",
            "异常态：条码无法识别或订单信息不匹配，给出错误提示"
          ],
          "keyInteractions": [
            "选择待验收订单后自动加载物料列表，支持扫码快速定位物料",
            "每行物料输入实到数量，选择外观检验结果（合格/不合格），可上传图片或报告",
            "点击“确认验收”后弹出检验结论弹窗：合格（走入库）、部分合格（部分入库+部分退换货）、不合格（全部退换货）",
            "入库时自动更新库存台账，核减预算，并显示成功信息",
            "退换货时弹出表单填写不合格原因及处理意见，提交后生成退换货单并通知供应商"
          ],
          "dataInputs": [
            "待验收订单ID",
            "物料条码（手动或扫描）",
            "实到数量（数字输入）",
            "外观检验结果（合格/不合格）",
            "附件文件（照片、质检报告）",
            "退换货处理意见（文本）"
          ],
          "originalPageKey": "page-3",
          "scenarioKey": "sc-11",
          "scenarioName": "采办协同人员发起采购与完成物资验收"
        }
      ]
    }
  ],
  "pageDesign": {
    "roles": [
      {
        "id": "role-1783353814959-0",
        "name": "岸基机务人员",
        "focus": "机务管理、设备维保监督，日常机务管理",
        "tagText": "设备维保计划、工单督导、航前校验"
      },
      {
        "id": "role-1783353814959-1",
        "name": "船舶管理人员",
        "focus": "船舶运行管理，日常船舶管理",
        "tagText": "船舶状态监控、船岸协同"
      },
      {
        "id": "role-1783353814959-2",
        "name": "船端一线作业人员",
        "focus": "工单执行、报工、盘点，弱网/无网环境下移动作业，移动端离线报工、扫码盘点、拍照留痕，船端日常维保作业",
        "tagText": "移动工单执行、离线报工、扫码盘点"
      },
      {
        "id": "role-1783353814959-3",
        "name": "系统管理员",
        "focus": "组织权限配置、流程配置、统一身份管理",
        "tagText": "权限配置、流程配置、系统监控"
      },
      {
        "id": "role-1783353814959-4",
        "name": "审计员",
        "focus": "查阅关键操作日志，支撑合规审计与ISM/船级社审查",
        "tagText": "日志查询、合规审查"
      },
      {
        "id": "role-1783353814959-5",
        "name": "采办协同人员",
        "focus": "采购需求提报、物资验收、预算核减确认",
        "tagText": "采购需求、物资验收"
      }
    ],
    "sourceRoles": [
      {
        "name": "岸基机务人员",
        "focus": "机务管理、设备维保监督，日常机务管理",
        "tags": [
          "设备维保计划",
          "工单督导",
          "航前校验"
        ]
      },
      {
        "name": "船舶管理人员",
        "focus": "船舶运行管理，日常船舶管理",
        "tags": [
          "船舶状态监控",
          "船岸协同"
        ]
      },
      {
        "name": "船端一线作业人员",
        "focus": "工单执行、报工、盘点，弱网/无网环境下移动作业，移动端离线报工、扫码盘点、拍照留痕，船端日常维保作业",
        "tags": [
          "移动工单执行",
          "离线报工",
          "扫码盘点"
        ]
      },
      {
        "name": "系统管理员",
        "focus": "组织权限配置、流程配置、统一身份管理",
        "tags": [
          "权限配置",
          "流程配置",
          "系统监控"
        ]
      },
      {
        "name": "审计员",
        "focus": "查阅关键操作日志，支撑合规审计与ISM/船级社审查",
        "tags": [
          "日志查询",
          "合规审查"
        ]
      },
      {
        "name": "采办协同人员",
        "focus": "采购需求提报、物资验收、预算核减确认",
        "tags": [
          "采购需求",
          "物资验收"
        ]
      }
    ],
    "scenarios": [
      {
        "key": "sc-1",
        "name": "岸基机务人员制定与调整设备维保计划",
        "priority": "P0",
        "description": "岸基机务人员基于设备资产树和PMS预设规则（日历周期、运行小时、工况触发条件），制定或调整各设备的预防性维护计划。触发条件包括新设备录入、计划到期、工况变更或临时维保要求。机务人员需判断计划合理性、优先级，并协调船端确认。最终计划生效后，系统自动跟踪到期条件并生成工单，全程记录变更日志供审计。",
        "summary": "基于PMS周期/工况规则，制定预防性维护计划，调整计划周期，确保设备到期前生成工单",
        "workflow": [
          "岸基机务人员登录系统，进入设备维保计划管理页面，查看所有设备资产树及其当前维保计划状态",
          "根据PMS规则（日历时间/运行小时/工况触发）或临时调整需求，新增或修改设备的预防性维护计划，设定执行周期、起始日期、触发条件及优先级",
          "提交计划变更申请，触发内部或与船端的协同审核流程（若有配置），待审核通过后计划正式生效",
          "系统按计划到期条件自动生成工单，同步至船端及移动端，记录计划调整日志，支持后续审计查询"
        ],
        "pageMapping": {
          "role": "岸基机务人员",
          "page": "MaintenancePlanManager.vue",
          "modules": []
        }
      },
      {
        "key": "sc-2",
        "name": "岸基机务人员进行航前健康校验与开航拦截",
        "priority": "P0",
        "description": "船舶计划开航前，岸基机务人员登录系统，系统根据预设规则自动校验关键设备维保状态（是否逾期工单）、物资备件库存（是否低于安全库存）、船员证书和船舶证照有效期。若存在未完成工单、缺件或过期证照，系统判定为不通过并拦截开航，生成红灯告警及详细问题清单。机务人员需逐项审核问题，启动处置流程（如派发紧急工单、调拨物资、申请临时豁免）。所有校验记录、处置结果和决策日志留痕，供审计和后续航前复查。",
        "summary": "根据预设规则校验设备状态、物资缺件、证书资质，判定是否允许开航，对不通过项启动处置流程 (规则待确认)",
        "workflow": [
          "岸基机务人员接收船舶开航前校验通知（或主动进入航前健康校验页面），系统自动发起健康检查任务",
          "系统按预设规则自动校验：设备维保状态（检查是否有逾期或即将到期的工单）、物资库存（检查关键备件是否低于安全库存）、证书资质（船员证书、船舶证照是否在有效期内）",
          "校验完成后展示健康状态看板，通过项绿色标示，不通过项红色标示并附带问题说明；系统判定是否允许开航，不通过则生成拦截告警",
          "机务人员逐项查看不通过详情，根据系统建议手动启动处置流程：如创建紧急工单、发起物资调拨申请、上报临时豁免审批；处置工单发送至对应角色环节",
          "所有校验结果、处置决策、操作日志自动记录，生成航前健康报告；待所有不通过项处理完毕或豁免审批通过后，系统更新为可以开航状态，供后续调度指令使用"
        ],
        "pageMapping": {
          "role": "岸基机务人员",
          "page": "VoyageHealthCheck.vue",
          "modules": []
        }
      },
      {
        "key": "sc-3",
        "name": "岸基机务人员审核与跟踪工单执行",
        "priority": "P0",
        "description": "当船端一线作业人员完成工单并提交报工后，岸基机务人员登录系统进入工单执行跟踪页面，系统汇总显示所有待审核和已完成的工单。机务人员需逐项审核工单的完成质量、报工数据（工时、物料消耗、异常记录、照片附件等），判断是否满足维保标准。若存在异常（如漏项、质量不达标、物料使用不合理），需退回并要求船端整改或重新执行；若合格则确认工单闭环。系统记录审核意见、整改要求和闭环时间，更新设备维保记录，触发后续计划或预警。所有操作日志留痕，支撑审计。",
        "summary": "查看工单完成情况、质量反馈，审核报工数据，督导异常工单整改",
        "workflow": [
          "岸基机务人员登录系统，进入工单执行跟踪页面，系统按船舶、设备、工单类型筛选展示所有待审核和已完成的工单列表，支持按状态（待审核/已通过/需整改）、时间范围检索",
          "选择单个工单进入详情页，查看报工数据：执行人员、实际工时、消耗物料及编号、执行步骤完成情况、现场照片/视频附件、异常记录（如设备损坏、备件缺件）",
          "根据维保标准和质量要求，逐项核验报工数据是否完整、准确，如有异常或不合格项，填写审核意见和整改要求，选择“退回整改”，系统自动生成整改任务并通知船端责任人",
          "若所有项目合格，点击“确认通过”，工单状态更新为“已闭环”，系统自动记录审核人、审核时间、审核意见，更新设备维保记录（如下次计划日期、设备状态）",
          "系统生成审核日志并关联工单记录，支持后续审计查询；若存在多次整改，保留历次审核版本和整改闭环轨迹"
        ],
        "pageMapping": {
          "role": "岸基机务人员",
          "page": "WorkOrderAudit.vue",
          "modules": []
        }
      },
      {
        "key": "sc-4",
        "name": "船舶管理人员监控船舶运行状态与调度",
        "priority": "P0",
        "description": "船舶管理人员登录系统后，进入船舶运行监控页面，系统通过船端上报数据（GPS位置、航速、工况）实时展示各船舶当前运行状态、任务执行进度及航前健康校验结果。当船舶计划开航或执行关键调度任务时，系统自动汇总航前健康校验结论（设备维保状态、备件库存、证书资质），管理人员需根据校验结果判断是否允许开航：若通过则下发调度指令（任务计划、航线、泊位、时间窗口）；若不通过则查看问题清单并启动处置流转（如发送至机务或采办协同）。调度指令下发后，系统跟踪执行进度，并在指令完成后记录闭环日志，支持后续复盘与审计。",
        "summary": "实时查看船舶位置、运营状态、航前准备情况，下发调度指令",
        "workflow": [
          "船舶管理人员登录系统，进入船舶运行监控主页，系统以列表/地图视图展示所有在管船舶的实时位置、航速、作业状态和通信连接状态",
          "选择目标船舶，查看其详细运行看板，包括当前航次、船端工单执行进度、航前健康校验结果（每项通过/不通过状态及附件）、船员证书有效期预警",
          "若船舶航前健康校验全部通过，管理人员在调度指令编辑面板中设定或确认航次指令（出发时间、预计抵达时间、航线、任务要求等），点击‘下发调度指令’，系统自动通知船端并推送至相关系统（如PMS、移动端）",
          "若存在不通过项，管理人员查看问题详情，可手动选择‘转处置’（如将缺件问题转交采办、将逾期工单转交机务），并设置临时豁免或延期开航标记，系统将问题分派至对应责任人并记录决策依据",
          "调度指令下发后，系统实时更新指令状态（已接收/执行中/已完成），管理人员可随时查看执行反馈（船端确认、任务节点进度），并在指令完成后确认闭环，系统自动记录操作日志和时间戳用于审计"
        ],
        "pageMapping": {
          "role": "船舶管理人员",
          "page": "ShipMonitoring.vue",
          "modules": []
        }
      },
      {
        "key": "sc-5",
        "name": "船舶管理人员进行船岸数据同步管理",
        "priority": "P1",
        "description": "在船端作业人员离线上报工单、盘点数据后，船舶管理人员登录系统进入数据同步管理页面，系统自动检测船端同步请求。管理人员需查看同步队列中的数据包状态（待上传/上传中/已同步/冲突/失败），并处理数据冲突（如同一条记录在船端和岸端同时修改）或同步失败异常。管理员可选择手动触发同步、解决冲突（采用船端/岸端版本或手动合并）、确认数据一致性。同步完成后，系统更新岸端数据并记录同步日志，供后续审计和异常排查。该场景保障弱网/离线下业务数据最终一致性。",
        "summary": "管理船端弱网/离线数据的上传与下发，处理数据冲突和同步异常",
        "workflow": [
          "船舶管理人员登录系统，进入数据同步管理页面，系统展示所有已注册船舶的同步状态总览（最近同步时间、待同步数据量、冲突数据量、失败记录数）。",
          "管理人员可选择一艘船舶或筛选未同步数据包，查看待处理同步任务的详细列表（数据类型：工单报工/盘点结果/附件图片；创建时间；来源终端；船端版本号）。",
          "如果存在数据冲突（同一条记录在船端和岸端均有修改），系统以差异对比视图展示双方数据，管理人员根据业务规则判断采用船端版本、岸端版本或手动编辑合并，提交后系统更新岸端数据并标记冲突已解决。",
          "如果存在同步失败记录，管理人员查看失败原因（如网络中断、数据校验不通过），选择重新同步或忽略，并填写备注。系统重新发起同步并记录操作日志。",
          "处理完所有任务后，系统更新该船舶的同步状态为‘已同步’，并记录本次同步操作的管理员、时间、处理结果，生成同步报告供审计查阅。"
        ],
        "pageMapping": {
          "role": "船舶管理人员",
          "page": "DataSyncManager.vue",
          "modules": []
        }
      },
      {
        "key": "sc-6",
        "name": "船端一线作业人员执行移动端工单与离线报工",
        "priority": "P0",
        "description": "在弱网/无网环境下，船端一线作业人员通过移动端接收由PMS计划自动生成或岸基分派的工单。作业人员需在离线状态下查看工单详情（设备信息、维保步骤、物料清单），按照步骤执行维保操作，填写实际工时、操作记录、消耗物料，并通过拍照/录像留痕。提交报工后，数据缓存至本地，待网络恢复时自动同步至岸端服务器，更新工单状态并记录同步日志。若同步失败或存在数据冲突，系统提示重试或由船岸数据同步管理流程处理，确保业务闭环和审计留痕。",
        "summary": "在弱网/无网环境下领取工单、填写执行数据、拍照留痕、提交报工，网络恢复后自动同步",
        "workflow": [
          "船端一线作业人员登录移动端应用，系统自动检测网络状态。在网络弱/无网络时，从本地缓存加载待执行工单列表。",
          "选择目标工单，查看完整详情：设备名称、位置、维保步骤说明、所需物料清单、安全注意事项。支持将相关附件（图纸、操作手册）下载至本地。",
          "按顺序执行维保操作，在移动端表单中逐项填写：实际开始时间、完成时间、操作人、异常情况描述、消耗物料及数量。支持现场拍照或录制短视频并关联至对应步骤。",
          "完成所有步骤后，点击“提交报工”按钮。系统在离线状态下将报工数据（含附件）序列化存储至本地SQLite或文件系统，并将工单状态标记为“待同步”。",
          "当网络恢复（弱网或连接岸基网络）时，系统自动启动后台同步任务：将缓存的报工数据、附件压缩上传至岸端服务器。服务器接收后更新工单状态为“已完成”或“待审核”，并记录同步时间、同步结果。若同步失败（如网络中断、校验不通过），在移动端提示“同步失败，请检查网络后重试”，并保留本地数据直至成功。",
          "同步成功后，移动端显示“已同步”状态，并清理本地缓存。系统生成同步日志（包含同步时间、数据包大小、是否冲突等），供后续审计和异常排查。"
        ],
        "pageMapping": {
          "role": "船端一线作业人员",
          "page": "MobileWorkOrder.vue",
          "modules": []
        }
      },
      {
        "key": "sc-7",
        "name": "船端一线作业人员进行物资扫码盘点与领用",
        "priority": "P1",
        "description": "船端一线作业人员使用移动端扫描物资条码完成库存盘点、领料申请、退料操作，同步库存数据。触发条件包括：定期盘点任务到达、工单执行中发现缺件需要领料、退料需求（如物料使用剩余或调整）。角色目标：通过扫码快速准确记录库存变动，确保账实一致，支持弱网/无网环境下离线操作。关键判断：扫码后验证条码合法性，对比系统库存与实物，标记差异并提交；领料时校验库存量充足，不足时提示缺件；退料时核验退料物料与工单关联。闭环结果：盘点差异生成待处理记录，领退料更新本地库存并标记同步状态，网络恢复后自动同步岸端，差异记录需岸基确认处理。",
        "summary": "使用移动端扫描物资条码完成库存盘点、领料申请、退料操作，同步库存数据",
        "workflow": [
          "船端一线作业人员登录移动端，进入物资盘点或领用功能；系统自动检测网络状态，在弱网/无网时加载本地缓存的物资库存数据和待处理任务列表。",
          "执行盘点：选择盘点任务或手动触发，使用移动端摄像头扫描物资条码，系统自动识别物料编号并展示当前系统库存数量；实物清点后录入实际数量，系统自动比对差异并标记（一致/盘盈/盘亏）；可逐条扫描或批量扫描，支持拍照留痕作为差异证据。",
          "执行领用：在工单执行过程中或主动进入领料功能，扫描所需物资条码，查看库存量是否满足需求；填写领用数量、用途（关联工单号），若库存不足则触发缺件预警并记录申请单；提交后扣减本地库存，数据标记为待同步。",
          "执行退料：选择退料功能，扫描退料条码，选择关联工单或退料原因（如工单剩余、物料质量问题）；系统校验退料数量不超过原领用量；提交后增加本地库存，数据标记为待同步。",
          "所有操作完成后，系统在本地生成操作明细日志（含时间、操作人、物料、数量、类型），并缓存至本地数据库。当网络恢复（弱网或连接岸基）时，自动执行同步任务：将盘点差异记录、领料/退料单上传岸端；岸端接收后更新主库存记录，并反馈处理结果（如差异待审核、领料确认）。若同步失败，在移动端提示重试，保留本地数据直至成功。"
        ],
        "pageMapping": {
          "role": "船端一线作业人员",
          "page": "InventoryScanning.vue",
          "modules": []
        }
      },
      {
        "key": "sc-8",
        "name": "系统管理员配置组织权限与流程定义",
        "priority": "P0",
        "description": "系统管理员在项目初始化、组织架构调整或业务规则变更时，通过系统管理后台完成统一身份管理、用户-角色-权限分配、审批流程及工单流转节点配置。触发条件包括：系统部署上线、新增/离职/转岗人员、业务流程变更。角色目标：确保各角色（岸基机务、船舶管理、船端作业、采办协同、审计员等）拥有正确的功能访问权限和操作权限，以及PMS工单、采购审批、航前校验等闭环流程的节点、条件和审批人设置。关键判断：权限分配需符合最小权限原则，避免越权操作；流程配置需确保业务闭环的完整性和合理性（如航前拦截审批、物资领用审批等）。闭环结果：配置变更经测试验证后正式生效并记录操作日志，所有权限和流程调整可追溯，支撑合规审计与ISM/船级社审查。",
        "summary": "管理用户、角色、权限分配，定义审批流程及工单流转节点",
        "workflow": [
          "系统管理员登录系统，进入权限与流程管理主页，查看当前组织架构、角色列表和现有流程定义概览。",
          "用户管理：创建新用户或编辑现有用户，填写用户基本信息（账号、姓名、所属部门、联系方式），为用户分配一个或多个角色（如岸基机务、船舶管理、船端作业等），支持批量导入或单条操作；禁用/启用用户账号，记录操作原因。",
          "角色与权限管理：创建新角色（如航前校验审批员），为角色分配可访问的功能菜单和操作权限（查看、新增、编辑、删除、审核等），支持按模块（设备维保、物资库存、工单执行、数据同步、审计日志）精细化授权；复制现有角色快速配置，调整后保存生效。",
          "流程定义：进入流程设计器，选择业务类型（如工单审核、物资采购审批、航前校验处置），配置流程节点（开始节点->审批节点1->条件分支->审批节点2->结束节点），为每个节点设置审批人角色或指定用户、超时提醒规则和转交策略；保存并发布流程版本。",
          "配置验证与发布：系统管理员可切换视角模拟某个角色登录，测试权限和流程是否按预期运行，检查是否有漏配或冲突；确认无误后点击‘正式发布’，系统将最新配置同步至全局生效，并记录本次配置变更的时间、操作人、变更内容摘要。",
          "日志留痕：所有用户、角色、权限、流程的创建、修改、删除操作均自动写入审计日志，系统管理员可在审计日志页面按时间、操作对象、操作类型进行检索，确保每次配置变更可追溯。"
        ],
        "pageMapping": {
          "role": "系统管理员",
          "page": "SysAdminConfig.vue",
          "modules": []
        }
      },
      {
        "key": "sc-9",
        "name": "系统管理员监控系统运行与操作审计",
        "priority": "P1",
        "description": "系统管理员在系统日常运维、合规审计或异常发生时，通过监控后台查看系统整体运行状态（服务在线状态、数据库连接、资源使用率、网络通信等），实时接收并处理异常告警（如服务宕机、同步失败、弱网节点）。同时，为支撑ISM规则和船级社审查，需按时间、用户角色、操作类型检索操作用户日志，确认操作合规性，并在需要时导出审计报告。关键判断：识别告警级别决定处理优先级，判断操作日志是否异常（如越权、频繁修改）。闭环结果：异常处理记录和审核结果写入系统审计日志，生成运维/审计报告，确保系统运行稳定和操作可追溯。",
        "summary": "查看系统运行状态、用户操作日志，处理异常告警",
        "workflow": [
          "系统管理员登录系统，进入系统运行监控主页，仪表盘展示整体运行状态：服务在线数、各模块健康度、数据库连接池、资源使用趋势图、近24小时同步成功率及异常告警数。",
          "点击异常告警列表查看详情，包括告警类型（服务异常、同步失败、资源超标）、发生时间、影响船舶/模块、严重程度。管理员判断是否需要立即处理，选择处理措施（例如：重启微服务、通知运维团队、调整同步策略），填写处理备注，并标记告警状态为‘处理中’或‘已解决’。",
          "进入操作审计日志页面，按时间范围（如最近7天）、用户角色（如船端作业人员、系统管理员）、操作类型（登录、数据修改、权限变更、流程发布）等条件组合检索日志，查看操作详情（操作人、时间、IP、操作对象、变更前后值）。",
          "若发现疑似越权或违规操作，管理员可标记该日志条目为‘待审核’，并添加备注说明；符合审计要求的日志，可按需导出为CSV/PDF格式的审计报告，报告包含筛选条件和统计摘要。",
          "所有监控告警处理、日志标记和导出操作均自动记录到操作审计日志，确保后续可追溯，系统管理员定期生成运维周报或审计汇报文档。"
        ],
        "pageMapping": {
          "role": "系统管理员",
          "page": "SysMonitorAndAudit.vue",
          "modules": []
        }
      },
      {
        "key": "sc-10",
        "name": "审计员查询操作日志支撑合规审查",
        "priority": "P0",
        "description": "审计员在定期合规审计、ISM/船级社审查或异常事件调查时，通过系统审计日志模块按时间范围、用户角色、操作类型等条件组合检索操作日志，查看每条日志的详细内容（操作人、时间、IP、操作对象、变更前后值），并根据业务规则判断操作是否合规，若发现疑似违规或越权操作则进行标记并记录审计意见，最终按需导出审计报告，所有审计行为本身也纳入系统日志留痕，确保审查过程和结论可追溯。",
        "summary": "按时间、角色、操作类型检索日志，生成审计报告以满足ISM/船级社要求",
        "workflow": [
          "审计员登录系统，进入操作审计日志页面，系统默认展示近期操作日志列表，可查看总日志条数及统计摘要",
          "通过面板选择检索条件：时间范围（如最近30天）、用户角色（如岸基机务、船端作业、系统管理员）、操作类型（如登录、数据修改、权限变更、流程发布）、船舶名称等，可多条件组合筛选",
          "点击单条日志展开查看详情，包括操作人账号、姓名、操作时间、IP地址、操作模块、操作对象、变更前内容、变更后内容，界面高亮显示变更差异",
          "根据业务合规标准，判断操作是否异常（如非工作时间大量修改、权限变更未授权），选择标记为“待审核”并填写审计意见或备注；若确认违规可标记为“不合规”并触发审批流程",
          "筛选出需要归档的日志范围，点击导出审计报告，选择格式（PDF/CSV）并填写报告标题和范围说明，系统生成带水印和审计印章的正式报告；所有审计标记、备注和导出操作自动写入审计日志，支撑事后追溯"
        ],
        "pageMapping": {
          "role": "审计员",
          "page": "",
          "modules": []
        }
      },
      {
        "key": "sc-11",
        "name": "采办协同人员发起采购与完成物资验收",
        "priority": "P0",
        "description": "当库存预警（低于安全库存）或工单执行中触发缺件时，系统自动生成采购需求申请。采办协同人员登录系统，查看采购需求列表，汇总并审核需求合理性（核对库存、设备BOM关联、预算余额），确认后发起正式采购申请（含供应商选择、询比价需求）。采购物资到货后，采办协同人员进行到货检验（数量、质量、条码扫描），录入检验结果。检验合格则办理入库，系统自动更新库存台账并核减对应预算；不合格时生成退换货流程。所有操作自动记录日志，支撑审计和后续物资追溯。关键判断包括预算是否充足、供应商资质、检验标准是否达标。闭环结果：采购单状态更新为已收货/已入库，库存账实一致，预算核减完成。",
        "summary": "根据库存预警或工单需求生成采购申请，到货后进行物资检验、入库并核减预算",
        "workflow": [
          "采办协同人员登录系统，进入采购管理页面，系统自动展示待处理的采购需求列表（由库存预警或工单缺件自动生成），包含物料编码、名称、数量、紧急程度、建议供应商等",
          "选择单一或多个需求，点击‘发起采购申请’，系统校验预算余额是否充足，若不足则提示并允许调整数量或发起预算追加流程；填写采购说明、交货期限、选择供应商（从合格供应商列表选择或手动输入），上传询比价附件后提交申请",
          "采购申请审批通过后（由系统管理员预设的采购审批流程处理），系统生成采购订单并发送至供应商（可对接外部采购系统或手动通知）。采办协同人员跟踪订单状态（待发货、已发货、运输中）",
          "物资到货后，采办协同人员进入‘到货验收’功能，扫描物资条码（或手动录入），系统加载采购订单信息；逐项核对实到数量、外观质量，可关联附件（照片、质检报告），录入检验结论（合格/不合格/部分不合格）",
          "若检验合格，点击‘确认入库’，系统自动更新库存台账（增加库存量），关联设备BOM（若适用），并核减对应预算账户余额，同时更新采购单状态为‘已入库’",
          "若检验不合格，选择‘退换货’并填写不合格原因及处理意见（如退回供应商、换货），系统自动通知供应商并生成退换货记录，待供应商处理后再验收",
          "所有操作（采购申请、审批、验收、入库、退换货）自动生成操作日志，记录操作人、时间、操作类型、变更数据，支撑后续审计和物资追溯"
        ],
        "pageMapping": {
          "role": "采办协同人员",
          "page": "ProcurementAndAcceptance.vue",
          "modules": []
        }
      }
    ],
    "availableScenarios": [
      {
        "key": "sc-1",
        "name": "岸基机务人员制定与调整设备维保计划",
        "priority": "P0",
        "description": "岸基机务人员基于设备资产树和PMS预设规则（日历周期、运行小时、工况触发条件），制定或调整各设备的预防性维护计划。触发条件包括新设备录入、计划到期、工况变更或临时维保要求。机务人员需判断计划合理性、优先级，并协调船端确认。最终计划生效后，系统自动跟踪到期条件并生成工单，全程记录变更日志供审计。",
        "summary": "基于PMS周期/工况规则，制定预防性维护计划，调整计划周期，确保设备到期前生成工单",
        "workflow": [
          "岸基机务人员登录系统，进入设备维保计划管理页面，查看所有设备资产树及其当前维保计划状态",
          "根据PMS规则（日历时间/运行小时/工况触发）或临时调整需求，新增或修改设备的预防性维护计划，设定执行周期、起始日期、触发条件及优先级",
          "提交计划变更申请，触发内部或与船端的协同审核流程（若有配置），待审核通过后计划正式生效",
          "系统按计划到期条件自动生成工单，同步至船端及移动端，记录计划调整日志，支持后续审计查询"
        ],
        "pageMapping": {
          "role": "岸基机务人员",
          "page": "MaintenancePlanManager.vue",
          "modules": []
        }
      },
      {
        "key": "sc-2",
        "name": "岸基机务人员进行航前健康校验与开航拦截",
        "priority": "P0",
        "description": "船舶计划开航前，岸基机务人员登录系统，系统根据预设规则自动校验关键设备维保状态（是否逾期工单）、物资备件库存（是否低于安全库存）、船员证书和船舶证照有效期。若存在未完成工单、缺件或过期证照，系统判定为不通过并拦截开航，生成红灯告警及详细问题清单。机务人员需逐项审核问题，启动处置流程（如派发紧急工单、调拨物资、申请临时豁免）。所有校验记录、处置结果和决策日志留痕，供审计和后续航前复查。",
        "summary": "根据预设规则校验设备状态、物资缺件、证书资质，判定是否允许开航，对不通过项启动处置流程 (规则待确认)",
        "workflow": [
          "岸基机务人员接收船舶开航前校验通知（或主动进入航前健康校验页面），系统自动发起健康检查任务",
          "系统按预设规则自动校验：设备维保状态（检查是否有逾期或即将到期的工单）、物资库存（检查关键备件是否低于安全库存）、证书资质（船员证书、船舶证照是否在有效期内）",
          "校验完成后展示健康状态看板，通过项绿色标示，不通过项红色标示并附带问题说明；系统判定是否允许开航，不通过则生成拦截告警",
          "机务人员逐项查看不通过详情，根据系统建议手动启动处置流程：如创建紧急工单、发起物资调拨申请、上报临时豁免审批；处置工单发送至对应角色环节",
          "所有校验结果、处置决策、操作日志自动记录，生成航前健康报告；待所有不通过项处理完毕或豁免审批通过后，系统更新为可以开航状态，供后续调度指令使用"
        ],
        "pageMapping": {
          "role": "岸基机务人员",
          "page": "VoyageHealthCheck.vue",
          "modules": []
        }
      },
      {
        "key": "sc-3",
        "name": "岸基机务人员审核与跟踪工单执行",
        "priority": "P0",
        "description": "当船端一线作业人员完成工单并提交报工后，岸基机务人员登录系统进入工单执行跟踪页面，系统汇总显示所有待审核和已完成的工单。机务人员需逐项审核工单的完成质量、报工数据（工时、物料消耗、异常记录、照片附件等），判断是否满足维保标准。若存在异常（如漏项、质量不达标、物料使用不合理），需退回并要求船端整改或重新执行；若合格则确认工单闭环。系统记录审核意见、整改要求和闭环时间，更新设备维保记录，触发后续计划或预警。所有操作日志留痕，支撑审计。",
        "summary": "查看工单完成情况、质量反馈，审核报工数据，督导异常工单整改",
        "workflow": [
          "岸基机务人员登录系统，进入工单执行跟踪页面，系统按船舶、设备、工单类型筛选展示所有待审核和已完成的工单列表，支持按状态（待审核/已通过/需整改）、时间范围检索",
          "选择单个工单进入详情页，查看报工数据：执行人员、实际工时、消耗物料及编号、执行步骤完成情况、现场照片/视频附件、异常记录（如设备损坏、备件缺件）",
          "根据维保标准和质量要求，逐项核验报工数据是否完整、准确，如有异常或不合格项，填写审核意见和整改要求，选择“退回整改”，系统自动生成整改任务并通知船端责任人",
          "若所有项目合格，点击“确认通过”，工单状态更新为“已闭环”，系统自动记录审核人、审核时间、审核意见，更新设备维保记录（如下次计划日期、设备状态）",
          "系统生成审核日志并关联工单记录，支持后续审计查询；若存在多次整改，保留历次审核版本和整改闭环轨迹"
        ],
        "pageMapping": {
          "role": "岸基机务人员",
          "page": "WorkOrderAudit.vue",
          "modules": []
        }
      },
      {
        "key": "sc-4",
        "name": "船舶管理人员监控船舶运行状态与调度",
        "priority": "P0",
        "description": "船舶管理人员登录系统后，进入船舶运行监控页面，系统通过船端上报数据（GPS位置、航速、工况）实时展示各船舶当前运行状态、任务执行进度及航前健康校验结果。当船舶计划开航或执行关键调度任务时，系统自动汇总航前健康校验结论（设备维保状态、备件库存、证书资质），管理人员需根据校验结果判断是否允许开航：若通过则下发调度指令（任务计划、航线、泊位、时间窗口）；若不通过则查看问题清单并启动处置流转（如发送至机务或采办协同）。调度指令下发后，系统跟踪执行进度，并在指令完成后记录闭环日志，支持后续复盘与审计。",
        "summary": "实时查看船舶位置、运营状态、航前准备情况，下发调度指令",
        "workflow": [
          "船舶管理人员登录系统，进入船舶运行监控主页，系统以列表/地图视图展示所有在管船舶的实时位置、航速、作业状态和通信连接状态",
          "选择目标船舶，查看其详细运行看板，包括当前航次、船端工单执行进度、航前健康校验结果（每项通过/不通过状态及附件）、船员证书有效期预警",
          "若船舶航前健康校验全部通过，管理人员在调度指令编辑面板中设定或确认航次指令（出发时间、预计抵达时间、航线、任务要求等），点击‘下发调度指令’，系统自动通知船端并推送至相关系统（如PMS、移动端）",
          "若存在不通过项，管理人员查看问题详情，可手动选择‘转处置’（如将缺件问题转交采办、将逾期工单转交机务），并设置临时豁免或延期开航标记，系统将问题分派至对应责任人并记录决策依据",
          "调度指令下发后，系统实时更新指令状态（已接收/执行中/已完成），管理人员可随时查看执行反馈（船端确认、任务节点进度），并在指令完成后确认闭环，系统自动记录操作日志和时间戳用于审计"
        ],
        "pageMapping": {
          "role": "船舶管理人员",
          "page": "ShipMonitoring.vue",
          "modules": []
        }
      },
      {
        "key": "sc-5",
        "name": "船舶管理人员进行船岸数据同步管理",
        "priority": "P1",
        "description": "在船端作业人员离线上报工单、盘点数据后，船舶管理人员登录系统进入数据同步管理页面，系统自动检测船端同步请求。管理人员需查看同步队列中的数据包状态（待上传/上传中/已同步/冲突/失败），并处理数据冲突（如同一条记录在船端和岸端同时修改）或同步失败异常。管理员可选择手动触发同步、解决冲突（采用船端/岸端版本或手动合并）、确认数据一致性。同步完成后，系统更新岸端数据并记录同步日志，供后续审计和异常排查。该场景保障弱网/离线下业务数据最终一致性。",
        "summary": "管理船端弱网/离线数据的上传与下发，处理数据冲突和同步异常",
        "workflow": [
          "船舶管理人员登录系统，进入数据同步管理页面，系统展示所有已注册船舶的同步状态总览（最近同步时间、待同步数据量、冲突数据量、失败记录数）。",
          "管理人员可选择一艘船舶或筛选未同步数据包，查看待处理同步任务的详细列表（数据类型：工单报工/盘点结果/附件图片；创建时间；来源终端；船端版本号）。",
          "如果存在数据冲突（同一条记录在船端和岸端均有修改），系统以差异对比视图展示双方数据，管理人员根据业务规则判断采用船端版本、岸端版本或手动编辑合并，提交后系统更新岸端数据并标记冲突已解决。",
          "如果存在同步失败记录，管理人员查看失败原因（如网络中断、数据校验不通过），选择重新同步或忽略，并填写备注。系统重新发起同步并记录操作日志。",
          "处理完所有任务后，系统更新该船舶的同步状态为‘已同步’，并记录本次同步操作的管理员、时间、处理结果，生成同步报告供审计查阅。"
        ],
        "pageMapping": {
          "role": "船舶管理人员",
          "page": "DataSyncManager.vue",
          "modules": []
        }
      },
      {
        "key": "sc-6",
        "name": "船端一线作业人员执行移动端工单与离线报工",
        "priority": "P0",
        "description": "在弱网/无网环境下，船端一线作业人员通过移动端接收由PMS计划自动生成或岸基分派的工单。作业人员需在离线状态下查看工单详情（设备信息、维保步骤、物料清单），按照步骤执行维保操作，填写实际工时、操作记录、消耗物料，并通过拍照/录像留痕。提交报工后，数据缓存至本地，待网络恢复时自动同步至岸端服务器，更新工单状态并记录同步日志。若同步失败或存在数据冲突，系统提示重试或由船岸数据同步管理流程处理，确保业务闭环和审计留痕。",
        "summary": "在弱网/无网环境下领取工单、填写执行数据、拍照留痕、提交报工，网络恢复后自动同步",
        "workflow": [
          "船端一线作业人员登录移动端应用，系统自动检测网络状态。在网络弱/无网络时，从本地缓存加载待执行工单列表。",
          "选择目标工单，查看完整详情：设备名称、位置、维保步骤说明、所需物料清单、安全注意事项。支持将相关附件（图纸、操作手册）下载至本地。",
          "按顺序执行维保操作，在移动端表单中逐项填写：实际开始时间、完成时间、操作人、异常情况描述、消耗物料及数量。支持现场拍照或录制短视频并关联至对应步骤。",
          "完成所有步骤后，点击“提交报工”按钮。系统在离线状态下将报工数据（含附件）序列化存储至本地SQLite或文件系统，并将工单状态标记为“待同步”。",
          "当网络恢复（弱网或连接岸基网络）时，系统自动启动后台同步任务：将缓存的报工数据、附件压缩上传至岸端服务器。服务器接收后更新工单状态为“已完成”或“待审核”，并记录同步时间、同步结果。若同步失败（如网络中断、校验不通过），在移动端提示“同步失败，请检查网络后重试”，并保留本地数据直至成功。",
          "同步成功后，移动端显示“已同步”状态，并清理本地缓存。系统生成同步日志（包含同步时间、数据包大小、是否冲突等），供后续审计和异常排查。"
        ],
        "pageMapping": {
          "role": "船端一线作业人员",
          "page": "MobileWorkOrder.vue",
          "modules": []
        }
      },
      {
        "key": "sc-7",
        "name": "船端一线作业人员进行物资扫码盘点与领用",
        "priority": "P1",
        "description": "船端一线作业人员使用移动端扫描物资条码完成库存盘点、领料申请、退料操作，同步库存数据。触发条件包括：定期盘点任务到达、工单执行中发现缺件需要领料、退料需求（如物料使用剩余或调整）。角色目标：通过扫码快速准确记录库存变动，确保账实一致，支持弱网/无网环境下离线操作。关键判断：扫码后验证条码合法性，对比系统库存与实物，标记差异并提交；领料时校验库存量充足，不足时提示缺件；退料时核验退料物料与工单关联。闭环结果：盘点差异生成待处理记录，领退料更新本地库存并标记同步状态，网络恢复后自动同步岸端，差异记录需岸基确认处理。",
        "summary": "使用移动端扫描物资条码完成库存盘点、领料申请、退料操作，同步库存数据",
        "workflow": [
          "船端一线作业人员登录移动端，进入物资盘点或领用功能；系统自动检测网络状态，在弱网/无网时加载本地缓存的物资库存数据和待处理任务列表。",
          "执行盘点：选择盘点任务或手动触发，使用移动端摄像头扫描物资条码，系统自动识别物料编号并展示当前系统库存数量；实物清点后录入实际数量，系统自动比对差异并标记（一致/盘盈/盘亏）；可逐条扫描或批量扫描，支持拍照留痕作为差异证据。",
          "执行领用：在工单执行过程中或主动进入领料功能，扫描所需物资条码，查看库存量是否满足需求；填写领用数量、用途（关联工单号），若库存不足则触发缺件预警并记录申请单；提交后扣减本地库存，数据标记为待同步。",
          "执行退料：选择退料功能，扫描退料条码，选择关联工单或退料原因（如工单剩余、物料质量问题）；系统校验退料数量不超过原领用量；提交后增加本地库存，数据标记为待同步。",
          "所有操作完成后，系统在本地生成操作明细日志（含时间、操作人、物料、数量、类型），并缓存至本地数据库。当网络恢复（弱网或连接岸基）时，自动执行同步任务：将盘点差异记录、领料/退料单上传岸端；岸端接收后更新主库存记录，并反馈处理结果（如差异待审核、领料确认）。若同步失败，在移动端提示重试，保留本地数据直至成功。"
        ],
        "pageMapping": {
          "role": "船端一线作业人员",
          "page": "InventoryScanning.vue",
          "modules": []
        }
      },
      {
        "key": "sc-8",
        "name": "系统管理员配置组织权限与流程定义",
        "priority": "P0",
        "description": "系统管理员在项目初始化、组织架构调整或业务规则变更时，通过系统管理后台完成统一身份管理、用户-角色-权限分配、审批流程及工单流转节点配置。触发条件包括：系统部署上线、新增/离职/转岗人员、业务流程变更。角色目标：确保各角色（岸基机务、船舶管理、船端作业、采办协同、审计员等）拥有正确的功能访问权限和操作权限，以及PMS工单、采购审批、航前校验等闭环流程的节点、条件和审批人设置。关键判断：权限分配需符合最小权限原则，避免越权操作；流程配置需确保业务闭环的完整性和合理性（如航前拦截审批、物资领用审批等）。闭环结果：配置变更经测试验证后正式生效并记录操作日志，所有权限和流程调整可追溯，支撑合规审计与ISM/船级社审查。",
        "summary": "管理用户、角色、权限分配，定义审批流程及工单流转节点",
        "workflow": [
          "系统管理员登录系统，进入权限与流程管理主页，查看当前组织架构、角色列表和现有流程定义概览。",
          "用户管理：创建新用户或编辑现有用户，填写用户基本信息（账号、姓名、所属部门、联系方式），为用户分配一个或多个角色（如岸基机务、船舶管理、船端作业等），支持批量导入或单条操作；禁用/启用用户账号，记录操作原因。",
          "角色与权限管理：创建新角色（如航前校验审批员），为角色分配可访问的功能菜单和操作权限（查看、新增、编辑、删除、审核等），支持按模块（设备维保、物资库存、工单执行、数据同步、审计日志）精细化授权；复制现有角色快速配置，调整后保存生效。",
          "流程定义：进入流程设计器，选择业务类型（如工单审核、物资采购审批、航前校验处置），配置流程节点（开始节点->审批节点1->条件分支->审批节点2->结束节点），为每个节点设置审批人角色或指定用户、超时提醒规则和转交策略；保存并发布流程版本。",
          "配置验证与发布：系统管理员可切换视角模拟某个角色登录，测试权限和流程是否按预期运行，检查是否有漏配或冲突；确认无误后点击‘正式发布’，系统将最新配置同步至全局生效，并记录本次配置变更的时间、操作人、变更内容摘要。",
          "日志留痕：所有用户、角色、权限、流程的创建、修改、删除操作均自动写入审计日志，系统管理员可在审计日志页面按时间、操作对象、操作类型进行检索，确保每次配置变更可追溯。"
        ],
        "pageMapping": {
          "role": "系统管理员",
          "page": "SysAdminConfig.vue",
          "modules": []
        }
      },
      {
        "key": "sc-9",
        "name": "系统管理员监控系统运行与操作审计",
        "priority": "P1",
        "description": "系统管理员在系统日常运维、合规审计或异常发生时，通过监控后台查看系统整体运行状态（服务在线状态、数据库连接、资源使用率、网络通信等），实时接收并处理异常告警（如服务宕机、同步失败、弱网节点）。同时，为支撑ISM规则和船级社审查，需按时间、用户角色、操作类型检索操作用户日志，确认操作合规性，并在需要时导出审计报告。关键判断：识别告警级别决定处理优先级，判断操作日志是否异常（如越权、频繁修改）。闭环结果：异常处理记录和审核结果写入系统审计日志，生成运维/审计报告，确保系统运行稳定和操作可追溯。",
        "summary": "查看系统运行状态、用户操作日志，处理异常告警",
        "workflow": [
          "系统管理员登录系统，进入系统运行监控主页，仪表盘展示整体运行状态：服务在线数、各模块健康度、数据库连接池、资源使用趋势图、近24小时同步成功率及异常告警数。",
          "点击异常告警列表查看详情，包括告警类型（服务异常、同步失败、资源超标）、发生时间、影响船舶/模块、严重程度。管理员判断是否需要立即处理，选择处理措施（例如：重启微服务、通知运维团队、调整同步策略），填写处理备注，并标记告警状态为‘处理中’或‘已解决’。",
          "进入操作审计日志页面，按时间范围（如最近7天）、用户角色（如船端作业人员、系统管理员）、操作类型（登录、数据修改、权限变更、流程发布）等条件组合检索日志，查看操作详情（操作人、时间、IP、操作对象、变更前后值）。",
          "若发现疑似越权或违规操作，管理员可标记该日志条目为‘待审核’，并添加备注说明；符合审计要求的日志，可按需导出为CSV/PDF格式的审计报告，报告包含筛选条件和统计摘要。",
          "所有监控告警处理、日志标记和导出操作均自动记录到操作审计日志，确保后续可追溯，系统管理员定期生成运维周报或审计汇报文档。"
        ],
        "pageMapping": {
          "role": "系统管理员",
          "page": "SysMonitorAndAudit.vue",
          "modules": []
        }
      },
      {
        "key": "sc-10",
        "name": "审计员查询操作日志支撑合规审查",
        "priority": "P0",
        "description": "审计员在定期合规审计、ISM/船级社审查或异常事件调查时，通过系统审计日志模块按时间范围、用户角色、操作类型等条件组合检索操作日志，查看每条日志的详细内容（操作人、时间、IP、操作对象、变更前后值），并根据业务规则判断操作是否合规，若发现疑似违规或越权操作则进行标记并记录审计意见，最终按需导出审计报告，所有审计行为本身也纳入系统日志留痕，确保审查过程和结论可追溯。",
        "summary": "按时间、角色、操作类型检索日志，生成审计报告以满足ISM/船级社要求",
        "workflow": [
          "审计员登录系统，进入操作审计日志页面，系统默认展示近期操作日志列表，可查看总日志条数及统计摘要",
          "通过面板选择检索条件：时间范围（如最近30天）、用户角色（如岸基机务、船端作业、系统管理员）、操作类型（如登录、数据修改、权限变更、流程发布）、船舶名称等，可多条件组合筛选",
          "点击单条日志展开查看详情，包括操作人账号、姓名、操作时间、IP地址、操作模块、操作对象、变更前内容、变更后内容，界面高亮显示变更差异",
          "根据业务合规标准，判断操作是否异常（如非工作时间大量修改、权限变更未授权），选择标记为“待审核”并填写审计意见或备注；若确认违规可标记为“不合规”并触发审批流程",
          "筛选出需要归档的日志范围，点击导出审计报告，选择格式（PDF/CSV）并填写报告标题和范围说明，系统生成带水印和审计印章的正式报告；所有审计标记、备注和导出操作自动写入审计日志，支撑事后追溯"
        ],
        "pageMapping": {
          "role": "审计员",
          "page": "",
          "modules": []
        }
      },
      {
        "key": "sc-11",
        "name": "采办协同人员发起采购与完成物资验收",
        "priority": "P0",
        "description": "当库存预警（低于安全库存）或工单执行中触发缺件时，系统自动生成采购需求申请。采办协同人员登录系统，查看采购需求列表，汇总并审核需求合理性（核对库存、设备BOM关联、预算余额），确认后发起正式采购申请（含供应商选择、询比价需求）。采购物资到货后，采办协同人员进行到货检验（数量、质量、条码扫描），录入检验结果。检验合格则办理入库，系统自动更新库存台账并核减对应预算；不合格时生成退换货流程。所有操作自动记录日志，支撑审计和后续物资追溯。关键判断包括预算是否充足、供应商资质、检验标准是否达标。闭环结果：采购单状态更新为已收货/已入库，库存账实一致，预算核减完成。",
        "summary": "根据库存预警或工单需求生成采购申请，到货后进行物资检验、入库并核减预算",
        "workflow": [
          "采办协同人员登录系统，进入采购管理页面，系统自动展示待处理的采购需求列表（由库存预警或工单缺件自动生成），包含物料编码、名称、数量、紧急程度、建议供应商等",
          "选择单一或多个需求，点击‘发起采购申请’，系统校验预算余额是否充足，若不足则提示并允许调整数量或发起预算追加流程；填写采购说明、交货期限、选择供应商（从合格供应商列表选择或手动输入），上传询比价附件后提交申请",
          "采购申请审批通过后（由系统管理员预设的采购审批流程处理），系统生成采购订单并发送至供应商（可对接外部采购系统或手动通知）。采办协同人员跟踪订单状态（待发货、已发货、运输中）",
          "物资到货后，采办协同人员进入‘到货验收’功能，扫描物资条码（或手动录入），系统加载采购订单信息；逐项核对实到数量、外观质量，可关联附件（照片、质检报告），录入检验结论（合格/不合格/部分不合格）",
          "若检验合格，点击‘确认入库’，系统自动更新库存台账（增加库存量），关联设备BOM（若适用），并核减对应预算账户余额，同时更新采购单状态为‘已入库’",
          "若检验不合格，选择‘退换货’并填写不合格原因及处理意见（如退回供应商、换货），系统自动通知供应商并生成退换货记录，待供应商处理后再验收",
          "所有操作（采购申请、审批、验收、入库、退换货）自动生成操作日志，记录操作人、时间、操作类型、变更数据，支撑后续审计和物资追溯"
        ],
        "pageMapping": {
          "role": "采办协同人员",
          "page": "ProcurementAndAcceptance.vue",
          "modules": []
        }
      }
    ],
    "selectedScenarioKey": "sc-11",
    "modulesByScenarioKey": {
      "sc-1": [
        {
          "key": "mod-1",
          "priority": "P0",
          "name": "设备资产树与计划状态总览",
          "description": "以树形结构展示全船所有设备资产，并高亮显示每个设备当前的维保计划状态（待制定、已生效、即将到期、临期提醒），支持按设备分类、搜索过滤。",
          "features": [
            "按系统/区域/设备层级展开资产树，查看每个设备的维保计划摘要",
            "通过状态标签快速筛选设备（如：计划即将到期、计划缺失、计划已过期）",
            "点击设备节点跳转至计划制定或详情页面",
            "导出设备维保计划总览报表（含计划周期、最后执行日期）"
          ],
          "pageSuggestion": "EquipmentPlanOverview.vue",
          "apiHint": "GET /api/equipment-tree?type=maintenance-plan-status 返回树形结构含计划状态",
          "dataNeeds": [
            "设备资产树结构（EAM 数据）",
            "各设备当前有效的维保计划（计划类型、下次执行日期、周期规则）",
            "设备维保历史记录（最后完成时间）"
          ],
          "stateRules": [
            "计划状态：未制定、审核中、已生效、已暂停、已过期",
            "临界期提醒：距离计划到期日期 ≤7 天时标记“即将到期”",
            "设备状态关联：若设备处于停用或报废状态，不应显示维保计划（建议确认停用设备的处理方式）"
          ],
          "apiSuggestion": "GET /api/equipment-tree?type=maintenance-plan-status 返回树形结构含计划状态"
        },
        {
          "key": "mod-2",
          "priority": "P0",
          "name": "预防性维护计划制定与编辑",
          "description": "为用户提供基于日历周期、运行小时或工况触发条件的预防性维护计划新建和编辑界面，支持选择设备、设定优先级、指定工单模板。",
          "features": [
            "选择目标设备（支持单个或批量），设定计划类型（日历周期/运行小时/工况触发）及具体参数",
            "设置执行周期（如每月/每1000小时）、起始日期、前置预警天数",
            "选择关联的工单模板（包含操作步骤、安全要求、所需备件）",
            "保存草稿或直接提交审核，系统自动校验计划冲突（与已有计划时间重叠）"
          ],
          "pageSuggestion": "PlanEditor.vue",
          "apiHint": "POST /api/maintenance-plans 创建计划；PUT /api/maintenance-plans/{id} 更新计划",
          "dataNeeds": [
            "设备资产列表（含运行小时计数器、关联的工况状态变量）",
            "PMS预设规则模板（周期类型、默认参数）",
            "工单模板列表（含步骤、备件需求）",
            "已有维保计划数据（用于冲突检测）"
          ],
          "stateRules": [
            "草稿状态可随时修改，审核中或已生效计划需通过变更流程修改",
            "冲突规则：同一设备同一时刻不应存在两个生效中的计划（建议确认是否允许并行计划）",
            "若设备运行小时达到设定阈值但计划尚未到达日期，应触发提醒（依赖实时数据接口）"
          ],
          "apiSuggestion": "POST /api/maintenance-plans 创建计划；PUT /api/maintenance-plans/{id} 更新计划"
        },
        {
          "key": "mod-3",
          "priority": "P0",
          "name": "计划变更审核与协同确认",
          "description": "管理计划新建或修改后的审核流程，支持内部审核及船端确认，审核通过后计划正式生效。",
          "features": [
            "提交计划变更申请后，自动推送给配置的审核人（岸基或船端管理人员）",
            "审核人可查看变更前后差异、填写审批意见，选择通过或驳回",
            "被驳回后机务人员可查看驳回原因并重新提交",
            "记录完整审核日志，包括操作人、时间、意见、结果"
          ],
          "pageSuggestion": "PlanApprovalWorkflow.vue",
          "apiHint": "GET /api/approvals?type=plan-change 获取待审列表；POST /api/approvals/{id}/action 审批操作",
          "dataNeeds": [
            "审核流程配置（审批节点、审批人、会签/或签规则）",
            "变更前后计划内容快照",
            "审核历史记录"
          ],
          "stateRules": [
            "审核流程可根据组织配置免审批（建议确认客户是否启用默认审批流）",
            "审批超时未处理应触发提醒（如48小时）",
            "计划生效后不允许直接删除，需通过“计划废止”流程操作（建议确认）"
          ],
          "apiSuggestion": "GET /api/approvals?type=plan-change 获取待审列表；POST /api/approvals/{id}/action 审批操作"
        },
        {
          "key": "mod-4",
          "priority": "P0",
          "name": "计划到期工单自动生成与同步",
          "description": "后台定时任务根据已生效的维保计划到期条件自动生成工单，并同步至船端及移动端，同时记录日志供审计。",
          "features": [
            "按配置频率（每天/每小时）扫描所有生效计划，检测满足到期条件的设备",
            "自动创建工单（包含操作步骤、安全要求、所需备件等，来源于关联的工单模板）",
            "将新建工单插入船端离线数据队列，待网络可用时下发至移动端",
            "记录工单生成日志（计划ID、生成时间、工单编码、状态）"
          ],
          "pageSuggestion": "（后台服务，无需独立页面）",
          "apiHint": "定时任务：Scheduler 扫描计划；POST /api/work-orders/batch-create 批量生成工单",
          "dataNeeds": [
            "所有已生效的维保计划（包含到期条件、工单模板ID）",
            "当前船端离线队列状态（是否可同步）",
            "设备运行小时实时数据（若为运行小时触发）"
          ],
          "stateRules": [
            "已生成的工单如果被取消或关闭，不应重复生成（需记录生成标记）",
            "弱网情况下工单先进入本地队列，网络恢复后自动推送（建议确认船端同步机制）",
            "计划到期生成工单的提前量：应支持配置（如到期前0天/1天/7天）"
          ],
          "apiSuggestion": "定时任务：Scheduler 扫描计划；POST /api/work-orders/batch-create 批量生成工单"
        }
      ],
      "sc-2": [
        {
          "key": "mod-1",
          "priority": "P0",
          "name": "航前健康检查任务触发",
          "description": "接收开航前校验通知或手动发起健康检查，系统自动创建检查任务并开始执行预设规则校验",
          "features": [
            "接收系统自动推送的船舶开航前校验通知，显示待检查船舶列表",
            "支持手动选择船舶并主动发起航前健康检查任务",
            "查看历史检查任务状态，重新执行未通过或已完成的检查"
          ],
          "pageSuggestion": "VoyageHealthCheckTrigger.vue",
          "apiHint": "POST /api/voyage-health/check-tasks 创建检查任务；GET /api/voyage-health/check-tasks?status=pending 查询待办任务",
          "dataNeeds": [
            "船舶基本信息",
            "计划开航时间",
            "历史检查记录"
          ],
          "stateRules": [
            "任务状态：待执行、执行中、已完成、异常",
            "通知触发条件：计划开航前XX小时（建议确认具体提前量）"
          ],
          "apiSuggestion": "POST /api/voyage-health/check-tasks 创建检查任务；GET /api/voyage-health/check-tasks?status=pending 查询待办任务"
        },
        {
          "key": "mod-2",
          "priority": "P0",
          "name": "健康状态总览与拦截告警看板",
          "description": "展示校验结果汇总看板，通过项绿色、不通过项红色，系统自动判定是否允许开航并生成拦截告警",
          "features": [
            "按设备维保、物资库存、证书资质三类展示校验状态，支持筛选和分类查看",
            "显示整体健康分数和拦截告警信息，不通过项附带问题描述与严重等级",
            "提供一键导出问题清单功能（PDF/Excel）"
          ],
          "pageSuggestion": "VoyageHealthDashboard.vue",
          "apiHint": "GET /api/voyage-health/check-summary?shipId={shipId} 获取校验总览；GET /api/voyage-health/issues?checkTaskId={id} 获取问题清单",
          "dataNeeds": [
            "每项校验结果（通过/不通过）",
            "未通过项的问题描述",
            "开航拦截状态（允许/拦截）"
          ],
          "stateRules": [
            "通过项显示绿色图标，不通过项红色图标并附带告警标识",
            "若存在任何不通过项，系统默认拦截开航（具体规则建议确认）",
            "告警等级：高危（直接拦截）、中危（需审核）、低危（建议关注）"
          ],
          "apiSuggestion": "GET /api/voyage-health/check-summary?shipId={shipId} 获取校验总览；GET /api/voyage-health/issues?checkTaskId={id} 获取问题清单"
        },
        {
          "key": "mod-3",
          "priority": "P0",
          "name": "不通过项详情查看与处置流程发起",
          "description": "机务人员逐项查看不通过详情，根据系统建议手动启动处置流程：创建紧急工单、发起物资调拨申请、上报临时豁免审批",
          "features": [
            "点击不通过项，展开详情（如逾期工单编号、缺件物料清单、过期证书名称及到期日）",
            "对设备维保问题：一键创建紧急维修工单并指定执行人",
            "对物资缺件问题：发起物资调拨申请/采购申请，关联相关工单",
            "对证书过期问题：提交临时豁免审批申请，或通知相关船员/岸基更新证书"
          ],
          "pageSuggestion": "VoyageHealthIssueDetail.vue",
          "apiHint": "POST /api/work-orders/emergency 创建紧急工单；POST /api/materials/transfer-requests 发起调拨申请；POST /api/certificates/exemption-requests 提交豁免审批",
          "dataNeeds": [
            "不通过项的详细信息（类型、关联对象ID、过期/逾期时间）",
            "处置操作可用的模板或建议选项（如默认执行人、优先级）"
          ],
          "stateRules": [
            "处置流程创建后自动关联健康检查任务",
            "审批通过或不通过需更新健康检查状态",
            "建议确认处置流程分支：紧急工单流转规则、调拨审批层级、临时豁免有效期"
          ],
          "apiSuggestion": "POST /api/work-orders/emergency 创建紧急工单；POST /api/materials/transfer-requests 发起调拨申请；POST /api/certificates/exemption-requests 提交豁免审批"
        },
        {
          "key": "mod-4",
          "priority": "P1",
          "name": "校验记录与航前健康报告管理",
          "description": "自动记录所有校验结果、处置决策和操作日志，生成航前健康报告；处置通过后更新开航状态",
          "features": [
            "查看历次航前健康检查记录及详细日志（含操作人、时间、处置结果）",
            "生成可导出的航前健康报告（包含校验结论、问题清单、处置闭环情况）",
            "在所有不通过项处理完毕或豁免审批通过后，系统更新船舶状态为“允许开航”，并同步至调度模块"
          ],
          "pageSuggestion": "VoyageHealthReport.vue",
          "apiHint": "GET /api/voyage-health/reports?shipId={shipId} 查询报告列表；POST /api/voyage-health/reports/generate 生成报告；PATCH /api/ships/{shipId}/sailing-status 更新开航状态",
          "dataNeeds": [
            "校验结果快照",
            "处置工单/调拨/豁免的状态与结果",
            "操作日志时间线"
          ],
          "stateRules": [
            "报告状态：生成中、已生成、已归档",
            "开航状态：允许/拦截，拦截需关联未关闭问题数",
            "日志记录不可修改，仅供审计查阅"
          ],
          "apiSuggestion": "GET /api/voyage-health/reports?shipId={shipId} 查询报告列表；POST /api/voyage-health/reports/generate 生成报告；PATCH /api/ships/{shipId}/sailing-status 更新开航状态"
        }
      ],
      "sc-3": [
        {
          "key": "mod-1",
          "priority": "P0",
          "name": "工单执行跟踪筛选列表",
          "description": "为岸基机务人员提供待审核/已完成工单的聚合视图，支持按船舶、设备、工单类型、状态（待审核/已通过/需整改）和时间范围进行多维筛选，快速定位待处理工单。",
          "features": [
            "展示所有待审核和已完成工单的摘要列表（工单号、关联设备、优先级、报工时间、当前状态）",
            "支持组合条件筛选：船舶名称、设备资产树节点、工单类型（预防性/纠正性/紧急）、工单状态、报工时间范围",
            "支持列表排序（按优先级、报工时间倒序）和分页加载",
            "点击列表行跳转至工单详情核验页面"
          ],
          "pageSuggestion": "WorkOrderAuditList.vue",
          "apiHint": "GET /api/workOrders?status=待审核,已通过,需整改&shipId=&equipmentId=&type=&startDate=&endDate=&page=&size=",
          "dataNeeds": [
            "工单基础信息：工单ID、工单编号、关联设备名称及编码、工单类型、报工时间、当前状态（待审核/已通过/需整改）、报工人、优先级",
            "船舶与设备资产树基础数据（用于筛选）"
          ],
          "stateRules": [
            "工单状态流转：待审核 -> 已通过 或 需整改；已通过不可再退回；需整改状态下可重新提交报工后变回待审核",
            "列表默认展示最近一周的待审核工单（建议确认默认时间范围）",
            "筛选条件至少包含：船舶、设备、工单类型、状态、时间"
          ],
          "apiSuggestion": "GET /api/workOrders?status=待审核,已通过,需整改&shipId=&equipmentId=&type=&startDate=&endDate=&page=&size="
        },
        {
          "key": "mod-2",
          "priority": "P0",
          "name": "报工数据核验详情",
          "description": "展示单个工单的完整报工数据，包括执行人员、实际工时、消耗物料清单及编号、执行步骤完成情况、现场照片/视频附件、异常记录等，供机务人员逐项核验。",
          "features": [
            "展示工单基本信息：设备名称、报工人员、报工时间、工单类型、维保标准说明",
            "展示执行明细：实际执行人员、开始/结束时间、总实际工时、执行步骤勾选状态及完成说明",
            "展示物料消耗清单：物料名称、编码、计划用量、实际用量、批次号，支持附件查看",
            "展示现场多媒体附件：照片/视频缩略图，支持点击放大预览，记录拍摄时间戳",
            "展示异常记录：异常类型（设备损坏/备件缺件/其他）、异常描述、现场照片"
          ],
          "pageSuggestion": "WorkOrderDetailReview.vue",
          "apiHint": "GET /api/workOrders/{workOrderId}/reportDetail - 获取工单报工详情（含物料、附件、执行步骤）",
          "dataNeeds": [
            "工单报工详情：执行人员及工时、执行步骤列表及完成状态、消耗物料清单（名称、编码、计划量、实际量）、多媒体附件列表（类型、URL、拍摄时间）、异常记录列表（类型、描述、照片）",
            "维保标准参考数据（如标准工时、标准物料清单）用于对比"
          ],
          "stateRules": [
            "附件文件类型限制：支持图片(jpg/png)、视频(mp4/mov)（建议确认最大文件大小和数量）",
            "物料消耗若超出计划用量需高亮提示“超量”（建议确认超量阈值规则）",
            "异常记录需展示是否已处理标记（待处理/已处理）"
          ],
          "apiSuggestion": "GET /api/workOrders/{workOrderId}/reportDetail - 获取工单报工详情（含物料、附件、执行步骤）"
        },
        {
          "key": "mod-3",
          "priority": "P0",
          "name": "审核通过/退回处理",
          "description": "支持机务人员根据核验结果做出审核决策：若所有项目合格则确认闭环，更新设备维保记录；若有异常则填写审核意见和整改要求并退回，系统自动生成整改任务通知船端。",
          "features": [
            "审核通过操作：点击“确认通过”，弹出二次确认，提交后工单状态变更为“已闭环”，系统自动记录审核人、审核时间、审核意见（可填写备注），更新设备维保记录（下次计划日期、设备状态）",
            "退回整改操作：填写审核意见（必填），选择整改要求（如补全数据、重新执行、更换物料），支持附加整改说明文件，提交后工单状态变为“需整改”，系统自动生成整改任务并通知船端相关责任人",
            "审核历史追溯：展示当前工单历次审核记录（审核人、时间、结论、意见），支持版本对比",
            "批量审核操作（可选）：勾选多个合格工单进行批量通过（建议确认是否需要）"
          ],
          "pageSuggestion": "WorkOrderAuditAction.vue",
          "apiHint": "POST /api/workOrders/{workOrderId}/approve - 工单通过；POST /api/workOrders/{workOrderId}/reject - 退回整改（含审核意见和整改要求）",
          "dataNeeds": [
            "当前用户身份与权限（审核人角色）",
            "设备维保记录字段：下次计划日期、设备状态（正常/待修/停用）",
            "整改任务通知接收人配置（船端一线作业人员角色）"
          ],
          "stateRules": [
            "退回整改时，审核意见不能为空，整改要求至少选择一项（建议确认是否允许自由文本补充）",
            "通过操作后，设备维保记录自动更新（下次计划日期 = 当前日期 + 维保周期，建议确认周期计算规则）",
            "若工单已闭环，禁止再次审核操作",
            "批量通过仅适用于无异常且数据完整的工单（建议确认批量条件）"
          ],
          "apiSuggestion": "POST /api/workOrders/{workOrderId}/approve - 工单通过；POST /api/workOrders/{workOrderId}/reject - 退回整改（含审核意见和整改要求）"
        },
        {
          "key": "mod-4",
          "priority": "P1",
          "name": "整改跟踪与审计日志",
          "description": "跟踪退回工单的整改进度，支持查看历次审核版本和整改闭环轨迹，提供审计查询入口。",
          "features": [
            "展示退回工单的整改任务列表：整改要求、责任人、计划完成时间、实际完成时间、整改结果说明",
            "支持机务人员查看船端整改后的报工数据，重新进入审核流程",
            "提供审计日志查询：按时间、操作人、工单号检索审核操作记录（通过/退回/修改），展示操作类型、时间、审核意见、操作人",
            "导出审计报告（可选）：按时间段导出审核日志Excel/PDF（建议确认是否必须）"
          ],
          "pageSuggestion": "WorkOrderAuditLog.vue",
          "apiHint": "GET /api/workOrders/{workOrderId}/auditLogs - 获取审核日志；GET /api/workOrders/{workOrderId}/reworkTasks - 获取整改任务列表",
          "dataNeeds": [
            "审核日志数据：操作人、操作时间、操作类型（通过/退回）、审核意见、附件",
            "整改任务数据：整改要求、责任人、计划完成日期、实际完成日期、整改结果、重新报工关联工单ID"
          ],
          "stateRules": [
            "审计日志保留所有历史版本，不可删除或修改（建议确认保留期限）",
            "整改任务超时需触发告警（建议确认超时阈值：如超过计划完成日期3天告警）",
            "整改完成后，工单重新进入待审核状态，原审核记录保留以形成闭环轨迹"
          ],
          "apiSuggestion": "GET /api/workOrders/{workOrderId}/auditLogs - 获取审核日志；GET /api/workOrders/{workOrderId}/reworkTasks - 获取整改任务列表"
        }
      ],
      "sc-4": [
        {
          "key": "mod-1",
          "priority": "P0",
          "name": "船舶实时监控总览",
          "description": "提供所有在管船舶的实时位置、航速、作业状态和通信连接状态的整体视图，支持列表和地图两种展示方式，便于船舶管理人员快速掌握全局态势。",
          "features": [
            "以地图/列表视图展示所有船舶的实时GPS位置、航速、当前作业状态（航行/作业/停泊）",
            "展示船舶通信连接状态（在线/弱网/离线），并用颜色标识",
            "支持按船舶名称、航线、状态进行筛选和搜索",
            "点击船舶标记跳转至单船运行详情看板"
          ],
          "pageSuggestion": "ShipMonitoringOverview.vue",
          "apiHint": "GET /api/vessels/status 获取所有船舶状态，支持轮询或WebSocket",
          "dataNeeds": [
            "船舶基础信息列表",
            "实时GPS经纬度",
            "航速（节）",
            "作业状态枚举",
            "通信连接状态",
            "更新时间戳"
          ],
          "stateRules": [
            "通信连接状态判定阈值：在线（>30s收到心跳）、弱网（30s-5min）、离线（>5min）【建议确认】",
            "作业状态由船端上报或自动判定（如航速>0且非锚泊则为航行）【建议确认】"
          ],
          "apiSuggestion": "GET /api/vessels/status 获取所有船舶状态，支持轮询或WebSocket"
        },
        {
          "key": "mod-2",
          "priority": "P0",
          "name": "单船运行详情看板",
          "description": "展示选定船舶的详细运行信息，包括当前航次信息、船端工单执行进度、航前健康校验结果以及船员证书有效期预警，为调度决策提供数据支撑。",
          "features": [
            "查看当前航次（航次编号、出发港、目的港、计划开航时间、预计抵达时间）",
            "展示船端工单执行进度（待执行/执行中/已完成工单数量及明细）",
            "展示航前健康校验结果列表（设备维保状态、物资库存、证书资质，每项通过/不通过及附件）",
            "展示船员证书有效期预警列表（证书名称、持有人、到期日期，红色标记已过期/黄色标记30天内到期）"
          ],
          "pageSuggestion": "ShipDetailBoard.vue",
          "apiHint": "GET /api/vessels/{id}/detail 获取船舶详细运行信息；GET /api/vessels/{id}/health-check 获取航前健康校验结果",
          "dataNeeds": [
            "航次信息（航次号、起止港、时间）",
            "工单列表（状态、类型、计划时间）",
            "健康校验项列表（类别、状态、详情、处置记录）",
            "船员证书列表（证书编号、持有人、有效期）"
          ],
          "stateRules": [
            "工单状态流转：计划→已派发→执行中→待审核→已闭环/退回整改【建议确认】",
            "健康校验判定规则：设备维保逾期则判定不通过；物资低于安全库存则不通过；证书过期则不通过【建议确认】",
            "证书有效期预警阈值：30天内到期黄色预警，已过期红色预警"
          ],
          "apiSuggestion": "GET /api/vessels/{id}/detail 获取船舶详细运行信息；GET /api/vessels/{id}/health-check 获取航前健康校验结果"
        },
        {
          "key": "mod-3",
          "priority": "P0",
          "name": "航前健康校验问题处置",
          "description": "当航前健康校验存在不通过项时，船舶管理人员可查看详细问题清单，并手动选择将问题转交至对应责任角色（机务/采办）进行处置，或申请临时豁免/延期开航，系统记录决策依据并分派任务。",
          "features": [
            "以列表形式展示所有不通过项（设备逾期工单、物资缺件、证书过期），支持按严重程度排序",
            "对每一项不通过，可选择“转处置”并指定责任角色（如缺件转采办、逾期工单转机务），系统自动生成处置工单并通知责任人",
            "提供“临时豁免”或“延期开航”操作，需填写豁免理由和有效期，系统记录决策日志",
            "处置完成后，系统自动更新健康校验状态，待所有不通过项处理完毕或豁免审批通过后，允许开航"
          ],
          "pageSuggestion": "HealthCheckIssueHandler.vue",
          "apiHint": "POST /api/health-check/{id}/resolve 转处置；POST /api/health-check/{id}/exemption 提交豁免申请",
          "dataNeeds": [
            "不通过项列表（类别、描述、关联对象ID）",
            "责任角色列表（机务、采办等）",
            "豁免表单（理由、有效期）"
          ],
          "stateRules": [
            "转处置后，系统自动创建工单并推送至对应角色，工单类型为“航前问题处置”",
            "临时豁免需经审批（默认审批角色为该船舶管理人员上级或机务主管）【建议确认】",
            "所有不通过项必须全部处理完毕或获得有效豁免，系统才允许开航状态更新"
          ],
          "apiSuggestion": "POST /api/health-check/{id}/resolve 转处置；POST /api/health-check/{id}/exemption 提交豁免申请"
        },
        {
          "key": "mod-4",
          "priority": "P0",
          "name": "调度指令编辑与下发",
          "description": "船舶管理人员在确认船舶健康校验通过（或豁免后）后，编辑调度指令（航次任务、出发时间、航线、任务要求），下发至船端并推送至相关系统，随后跟踪指令执行进度直至闭环。",
          "features": [
            "在调度指令编辑面板中设定航次指令：出发时间、预计抵达时间、航线（支持选择预定义航线或手动输入）、任务要求（文本描述）",
            "点击“下发调度指令”，系统自动推送指令至船端系统（PMS、移动端）并记录下发时间和操作人",
            "实时查看指令状态（已接收/执行中/已完成），船端确认后更新状态",
            "指令完成后，支持管理人员确认闭环，系统自动记录闭环日志（时间、执行结果、反馈附件）"
          ],
          "pageSuggestion": "DispatchCommandEditor.vue",
          "apiHint": "POST /api/dispatch-commands 创建并下发调度指令；GET /api/dispatch-commands/{id}/status 获取指令状态",
          "dataNeeds": [
            "船舶ID",
            "预定义航线列表",
            "航次指令表单数据",
            "指令状态枚举",
            "船端确认反馈信息"
          ],
          "stateRules": [
            "指令状态流转：待下发→已下发（船端未确认）→已接收（船端确认）→执行中→已完成（船端反馈完成）→已闭环（管理人员确认）",
            "若船端在设定时间内未确认，系统应触发超时告警并通知管理人员【建议确认】",
            "指令下发后不可撤回，但可下发补充指令"
          ],
          "apiSuggestion": "POST /api/dispatch-commands 创建并下发调度指令；GET /api/dispatch-commands/{id}/status 获取指令状态"
        }
      ],
      "sc-5": [
        {
          "key": "mod-1",
          "priority": "P0",
          "name": "船岸同步状态总览仪表板",
          "description": "以列表或卡片视图展示所有已注册船舶的同步概览信息，包括最近同步时间、待同步数据量、冲突数据量、失败记录数，支持快速定位问题船舶并跳转至详细处理页面。",
          "features": [
            "展示所有船舶的同步概览卡片，包含船名、通信状态、最近同步时间、待同步数据包数量、冲突数、失败数",
            "支持按同步状态（正常/异常/未同步）快捷筛选，高亮展示异常船舶并优先排序",
            "点击单艘船舶卡片可一键跳转至该船舶的同步任务详细列表",
            "手动触发全量船舶同步状态刷新（主动拉取各船最新同步心跳）"
          ],
          "pageSuggestion": "DataSyncManager.vue",
          "apiHint": "GET /api/v1/sync/shipments/summary 获取所有船舶同步概览；GET /api/v1/sync/shipments/{shipId}/heartbeat 获取单船最新同步心跳",
          "dataNeeds": [
            "已注册船舶列表及基础信息（船名、IMEI/船端编号）",
            "各船最近一次同步时间戳",
            "各船待同步数据包数量（按类型区分）",
            "各船冲突数据包数量",
            "各船同步失败记录数量"
          ],
          "stateRules": [
            "同步状态异常（冲突数>0或失败数>0）时，船舶卡片显示红色角标或置顶，建议确认具体异常判定阈值",
            "待同步数据量>0但无冲突/失败时，显示黄色提示",
            "超过48小时未同步的船舶自动标记为离线状态，需要人工确认"
          ],
          "apiSuggestion": "GET /api/v1/sync/shipments/summary 获取所有船舶同步概览；GET /api/v1/sync/shipments/{shipId}/heartbeat 获取单船最新同步心跳"
        },
        {
          "key": "mod-2",
          "priority": "P0",
          "name": "同步任务详细列表与多维度筛选",
          "description": "针对选定船舶（或全部船舶）展示待处理的同步任务明细，每条任务记录包含数据类型（工单报工/盘点结果/附件图片）、创建时间、来源终端、船端版本号、状态（待上传/上传中/已同步/冲突/失败），支持多条件组合筛选和批量操作。",
          "features": [
            "按船舶、数据类型、状态、时间范围组合筛选同步任务列表",
            "每条任务展示关键字段：数据类型、创建时间、来源终端、船端版本号、数据包大小、当前状态",
            "支持批量勾选并执行“重新同步”、“标记忽略”、“查看详情”等操作",
            "提供“冲突任务”与“失败任务”快捷标签页，一键聚焦待处理条目"
          ],
          "pageSuggestion": "DataSyncTaskList.vue",
          "apiHint": "GET /api/v1/sync/tasks?shipId={shipId}&type={type}&status={status}&startTime={}&endTime={} 分页查询同步任务；POST /api/v1/sync/tasks/batch-retry 批量重试",
          "dataNeeds": [
            "船舶ID、任务唯一标识",
            "数据类型枚举（workOrder / inventory / attachment）",
            "创建时间（船端时间）、来源终端标识（如手持终端IMEI或船端设备ID）",
            "船端版本号（用于冲突检测）",
            "任务当前状态（pending / uploading / synced / conflict / failed）",
            "失败原因说明（如网络超时、数据校验不通过）"
          ],
          "stateRules": [
            "冲突任务和失败任务必须优先展示在前，且不可批量忽略（需逐条处理）",
            "同一船舶的同步任务应按创建时间倒序排列, 建议确认是否允许跨船批量操作",
            "待上传状态的任务若超过24小时未更新，自动置为失败并记录原因“超时未上传”"
          ],
          "apiSuggestion": "GET /api/v1/sync/tasks?shipId={shipId}&type={type}&status={status}&startTime={}&endTime={} 分页查询同步任务；POST /api/v1/sync/tasks/batch-retry 批量重试"
        },
        {
          "key": "mod-3",
          "priority": "P0",
          "name": "数据冲突差异对比与解决面板",
          "description": "当同步任务存在数据冲突时，系统以并排对比视图展示船端版本与岸端版本的全部差异字段，管理人员可逐字段选择采用船端版本、岸端版本或手动编辑合并值，提交后更新岸端数据并标记冲突已解决，同时记录解决操作日志。",
          "features": [
            "并排展示冲突记录的船端版本与岸端版本，差异字段高亮显示（支持结构化数据如工单信息、盘点明细等）",
            "逐字段提供单选按钮（采用船端/采用岸端/手动编辑），支持用户输入合并值",
            "一键“全部采用船端版本”或“全部采用岸端版本”快捷操作",
            "提交解决后，系统将最终合并结果写入岸端数据库，标记冲突任务为已解决，并记录操作人、时间、解决方式"
          ],
          "pageSuggestion": "ConflictResolutionDialog.vue（弹窗或嵌入式面板）",
          "apiHint": "GET /api/v1/sync/conflicts/{conflictId}/diff 获取冲突差异详情；POST /api/v1/sync/conflicts/{conflictId}/resolve 提交解决结果",
          "dataNeeds": [
            "冲突记录ID、关联的同步任务ID",
            "船端版本记录完整JSON快照",
            "岸端版本记录完整JSON快照",
            "字段级差异元数据（字段名、船端值、岸端值、字段类型）",
            "用户提交的最终合并结果（字段级选择或整体版本标记）"
          ],
          "stateRules": [
            "冲突必须有且只有两个版本（船端和岸端），三向合并暂不支持，建议确认是否需要三向合并场景",
            "提交解决后，岸端记录必须更新数据版本号，并生成回滚快照以便后续审计",
            "若在解决过程中船端再次上传新版本，应提示“有新版本产生，请重新加载比对”，强制重新获取差异"
          ],
          "apiSuggestion": "GET /api/v1/sync/conflicts/{conflictId}/diff 获取冲突差异详情；POST /api/v1/sync/conflicts/{conflictId}/resolve 提交解决结果"
        },
        {
          "key": "mod-4",
          "priority": "P0",
          "name": "同步失败任务重试与忽略处理",
          "description": "针对同步失败的任务，管理人员可查看详细失败原因（如网络中断、数据校验不通过、岸端服务不可用等），选择重新同步或操作忽略（需填写备注说明），系统重新发起同步请求并记录操作日志，同步成功后更新任务状态为已同步。",
          "features": [
            "展开失败任务查看具体失败原因和错误码（支持复制错误详情）",
            "选择“重新同步”操作，系统重新提交数据包至同步队列并跟踪执行状态",
            "选择“忽略”操作，需填写备注原因（如数据无需回传、已离线删除），系统将任务标记为已忽略并记录审计日志",
            "支持批量选中同类型失败任务进行重试或忽略（需二次确认）"
          ],
          "pageSuggestion": "SyncFailurePanel.vue",
          "apiHint": "POST /api/v1/sync/tasks/{taskId}/retry 重试单个任务；POST /api/v1/sync/tasks/batch-ignore 批量忽略（需备注）",
          "dataNeeds": [
            "失败任务ID",
            "失败原因（预定义错误码+描述）",
            "任务原始数据包（用于重试时重新提交）",
            "最近一次失败时间戳、失败次数",
            "操作备注（忽略时必须填写）"
          ],
          "stateRules": [
            "同一任务失败超过3次后，应在UI上提示“建议联系船端排查”并禁止再次重试（除非手动重置失败计数）",
            "忽略操作不可撤回，需在备注中明确说明合规依据",
            "重试前系统应校验数据包完整性（如文件是否损坏），若校验失败则提示“数据包异常，需船端重新上传”"
          ],
          "apiSuggestion": "POST /api/v1/sync/tasks/{taskId}/retry 重试单个任务；POST /api/v1/sync/tasks/batch-ignore 批量忽略（需备注）"
        },
        {
          "key": "mod-5",
          "priority": "P1",
          "name": "同步历史报告与审计日志查询",
          "description": "提供按船舶、时间范围、操作类型检索同步历史记录的功能，管理人员可以生成同步报告（包含同步成功/失败/冲突统计、处理人、处理结果），导出PDF或CSV供审计或船级社合规审查。",
          "features": [
            "按船舶、日期范围、操作类型（自动同步/人工重试/冲突解决/忽略）筛选同步历史日志",
            "以列表形式展示每条日志的关键信息：船舶、操作时间、操作人员、操作描述、处理结果",
            "一键生成同步健康度报告，汇总指定周期内的同步成功率、平均延迟、冲突率、未处理量",
            "支持导出报告为PDF或CSV，提供打印友好排版"
          ],
          "pageSuggestion": "SyncReportPage.vue",
          "apiHint": "GET /api/v1/sync/report?shipId={}&startTime={}&endTime={} 获取同步统计报告；GET /api/v1/sync/audit-log?shipId={}&operator={}&action={} 查询审计日志；GET /api/v1/sync/report/export 导出报告",
          "dataNeeds": [
            "同步任务历史记录（含状态变迁、操作人、时间戳）",
            "人工操作日志（冲突解决、重试、忽略等）",
            "船舶基础信息（用于筛选）",
            "统计指标：总任务数、成功数、失败数、冲突数、平均同步延迟"
          ],
          "stateRules": [
            "审计日志至少保存3年，需支持按时间分区归档查询",
            "报告中的“同步成功率”计算分母应排除已忽略任务，避免失真",
            "导出报告时需校验当前用户是否具有“审计报告导出”权限（角色：审计员或管理员）"
          ],
          "apiSuggestion": "GET /api/v1/sync/report?shipId={}&startTime={}&endTime={} 获取同步统计报告；GET /api/v1/sync/audit-log?shipId={}&operator={}&action={} 查询审计日志；GET /api/v1/sync/report/export 导出报告"
        }
      ],
      "sc-6": [
        {
          "key": "mod-1",
          "priority": "P0",
          "name": "待执行工单离线列表",
          "description": "在弱网/无网环境下，通过本地缓存加载当前船端一线作业人员待执行的工单列表，支持按设备、优先级、状态筛选。网络恢复时自动增量更新本地缓存。",
          "features": [
            "登录后自动检测网络状态，无网时从本地SQLite加载待执行工单列表",
            "列表展示工单编号、设备名称、设备位置、优先级、计划日期、简要描述",
            "支持按设备类型、优先级、状态（待执行/执行中）筛选和排序",
            "点击工单进入详情页，同时将工单相关附件（图纸、手册）提前下载至本地存储"
          ],
          "pageSuggestion": "MobileWorkOrderList.vue",
          "apiHint": "GET /api/workorders?status=待执行&shipId={shipId} 获取待执行工单列表（支持分页）",
          "dataNeeds": [
            "工单ID、设备名称、设备位置、优先级、计划时间、状态、简要描述、关联附件URL列表"
          ],
          "stateRules": [
            "启动时判断网络状态：若网络可用则请求服务器并更新本地缓存；若无网络则直接读取本地数据",
            "本地缓存工单列表容量上限建议确认（如500条），超出时按优先级+日期淘汰",
            "工单状态“已下发”时自动进入待执行列表，状态“已领取”后更新为执行中"
          ],
          "apiSuggestion": "GET /api/workorders?status=待执行&shipId={shipId} 获取待执行工单列表（支持分页）"
        },
        {
          "key": "mod-2",
          "priority": "P0",
          "name": "工单详情与维保指引查看",
          "description": "离线展示工单完整详情，包括设备信息、维保操作步骤、物料清单、安全注意事项，支持图纸/手册等附件本地查看，协助作业人员按规程执行。",
          "features": [
            "离线查看工单详细页：设备名称、型号、位置、维保类型（周期性/故障/临时）",
            "按顺序展示维保步骤（步骤编号、操作描述、所需工具/物料、安全提示），支持勾选已完成步骤",
            "查看物料清单（备件名称、型号、计划用量、实际库存位置），标记为已领用",
            "离线打开已下载的附件（图纸PDF、操作手册图片），支持缩放、旋转"
          ],
          "pageSuggestion": "MobileWorkOrderDetail.vue",
          "apiHint": "GET /api/workorders/{id} 获取工单详情（含步骤、物料、附件元数据）",
          "dataNeeds": [
            "工单详情：设备资产树路径、维保步骤列表（含步骤ID、序号、描述、工具、安全、物料）、物料清单（备件编码、名称、计划数量、库存可用量）、附件列表（文件类型、本地缓存路径）"
          ],
          "stateRules": [
            "附件下载策略：仅在网络可用时后台静默下载至本地缓存目录，下载失败不影响工单查看",
            "步骤勾选记录本地持久化，支持断点续执（重新打开时恢复已勾选状态）",
            "物料可用量显示：若本地缓存了库存数据，则显示库存余量；否则显示“待联机获取”"
          ],
          "apiSuggestion": "GET /api/workorders/{id} 获取工单详情（含步骤、物料、附件元数据）"
        },
        {
          "key": "mod-3",
          "priority": "P0",
          "name": "维保执行与报工录入",
          "description": "引导作业人员按步骤执行维保操作，填写实际工时、消耗物料、异常情况，并通过拍照/录像现场留痕，最后提交报工数据。所有数据在离线状态下暂存本地。",
          "features": [
            "按步骤引导执行：每一步可记录实际开始/结束时间、执行人、异常备注",
            "填写消耗物料：从物料清单中选择实际使用的备件，录入实际消耗数量，支持追加领用",
            "多媒体留痕：调用相机拍照或录制短视频，关联至对应步骤或整单，支持预览和删除",
            "提交报工：校验必填项（步骤完成、异常说明），一键提交；系统将报工数据（含附件）序列化至本地SQLite并将工单状态标记为“待同步”"
          ],
          "pageSuggestion": "MobileWorkOrderExecute.vue",
          "apiHint": "POST /api/workorders/{id}/report (预留离线批量上报接口: POST /api/sync/batch) 提交报工数据",
          "dataNeeds": [
            "报工数据：工单ID、步骤ID序列含时间戳+执行人、消耗物料列表（备件编码、数量）、异常描述、照片/视频文件列表（本地路径+文件哈希）、报工提交时间"
          ],
          "stateRules": [
            "离线状态下提交报工成功仅表示本地存储成功，非服务端确认",
            "若同一工单重复提交，本地覆盖之前缓存，但保留历史版本（用于冲突解决）",
            "拍照/录像文件大小限制建议确认（如单文件50MB，总容量2GB），超出提示压缩或删除",
            "当设备本地存储空间低于阈值（如100MB），弹窗提醒清理历史已同步数据"
          ],
          "apiSuggestion": "POST /api/workorders/{id}/report (预留离线批量上报接口: POST /api/sync/batch) 提交报工数据"
        },
        {
          "key": "mod-4",
          "priority": "P0",
          "name": "离线缓存与自动同步",
          "description": "在弱网/无网环境下缓存报工数据，网络恢复后自动压缩上传至岸端服务器，处理同步失败和冲突，确保数据最终一致性。",
          "features": [
            "后台定时检测网络状态，当网络可用且本地有待同步工单时，自动启动同步任务",
            "将缓存的报工数据（含附件压缩包）分片上传至服务器，支持断点续传",
            "服务器校验数据完整性（哈希校验），若成功更新工单状态并记录同步日志；若失败（网络中断、校验失败）保留本地数据并提示重试",
            "处理数据冲突（如同工单岸端已更新）：展示差异对比，提示用户手动选择版本或标记待岸基处理"
          ],
          "pageSuggestion": "MobileSyncManager.vue (后台服务，可在设置页查看同步状态)",
          "apiHint": "POST /api/sync/upload (上传报工数据包); GET /api/sync/conflicts (查询冲突列表); POST /api/sync/resolve (解决冲突)",
          "dataNeeds": [
            "同步队列：每条记录含工单ID、报工数据JSON、附件列表、本地版本号、同步状态（待同步/同步中/已完成/失败）、重试次数",
            "冲突记录：字段差异（岸端版本 vs 本地版本）、解决状态"
          ],
          "stateRules": [
            "同步优先级：按提交时间递增处理，同类工单按紧急程度优先",
            "单工单重试上限建议确认（如3次），超限后进入人工干预列表",
            "网络状态变化时自动暂停/恢复同步，不阻塞用户操作",
            "同步成功后自动清理已同步的报工数据和附件，释放本地空间（保留日志30天建议确认）",
            "冲突解决策略：若未配置规则，默认标记为“待岸基处理”，由船舶管理人员在DataSyncManager.vue中处理"
          ],
          "apiSuggestion": "POST /api/sync/upload (上传报工数据包); GET /api/sync/conflicts (查询冲突列表); POST /api/sync/resolve (解决冲突)"
        }
      ],
      "sc-7": [
        {
          "key": "mod-1",
          "priority": "P1",
          "name": "离线库存与待处理任务加载",
          "description": "在弱网或无网环境下，从本地缓存加载库存物资数据、待执行盘点任务列表及关联工单信息，确保离线时仍能访问基础数据。",
          "features": [
            "登录后自动检测网络状态，若弱网/无网则从本地数据库（SQLite/IndexedDB）加载缓存数据",
            "展示所有待处理盘点任务、待领用工单提示及待退料记录列表",
            "支持手动刷新本地缓存（如强制重新从岸端拉取最新版本，需在线）"
          ],
          "pageSuggestion": "InventoryTaskLoader.vue",
          "apiHint": "GET /api/inventory/cache (缓存版本校验), GET /api/inventory/tasks (盘点任务列表, 在线时)",
          "dataNeeds": [
            "本地缓存的物资库存数据（物料编码、名称、类别、当前库存量、单位、条码、库存阈值）",
            "待执行盘点任务列表（任务ID、计划盘点日期、物料范围、状态）",
            "关联工单列表（工单号、所需物料清单、状态）",
            "网络状态标识"
          ],
          "stateRules": [
            "本地数据版本号与岸端不一致时，提示用户在线同步更新",
            "缓存加载失败时，展示错误提示并允许尝试重新加载默认数据（建议确认离线数据备份策略）"
          ],
          "apiSuggestion": "GET /api/inventory/cache (缓存版本校验), GET /api/inventory/tasks (盘点任务列表, 在线时)"
        },
        {
          "key": "mod-2",
          "priority": "P0",
          "name": "条码扫描盘点",
          "description": "通过移动端摄像头扫描物资条码，自动识别物料，对比系统库存与实物数量，标记差异并支持拍照留痕，生成盘点差异记录。",
          "features": [
            "支持单件扫描和批量连续扫描（自动切换下一件），识别条码后显示物料信息及当前系统库存",
            "录入实物清点数量，自动计算差异并标记盘盈/盘亏/一致，支持逐条修改",
            "对差异项可拍照或录制视频留痕，关联至该条盘点记录",
            "提交后本地生成盘点差异明细记录，状态标记为“待同步”"
          ],
          "pageSuggestion": "BarcodeScanInventory.vue",
          "apiHint": "POST /api/inventory/scan (条码识别, 获取物料信息), POST /api/inventory/physicalCount (提交盘点差异)",
          "dataNeeds": [
            "条码识别结果（物料编码、名称）",
            "系统库存数量（从本地缓存获取）",
            "实物清点数量",
            "拍照/视频文件（Base64或本地路径）",
            "盘点任务ID（若有）"
          ],
          "stateRules": [
            "条码无法识别或未在缓存中找到，提示“未知物料，请手动录入或联系岸基”（建议确认条码覆盖范围）",
            "盘点提交后，本地记录不可修改，仅可追加备注（建议确认是否需要审核后修改）",
            "离线期间拍照文件需压缩至合理大小，避免存储溢出（建议确认最大附件大小）"
          ],
          "apiSuggestion": "POST /api/inventory/scan (条码识别, 获取物料信息), POST /api/inventory/physicalCount (提交盘点差异)"
        },
        {
          "key": "mod-3",
          "priority": "P0",
          "name": "物资领用管理",
          "description": "在工单执行或主动领料场景下，扫描物资条码，校验库存充足性，填写领用信息并关联工单，提交后扣减本地库存并生成待同步领料单。",
          "features": [
            "扫描条码或搜索物料，展示实时库存、库存阈值及在途数量",
            "填写领用数量、用途说明并关联工单号（支持从待处理工单列表选取）",
            "若领用数量超过库存，触发缺件预警并自动生成缺件申请单（可手动补充紧急度说明）",
            "提交后本地扣减库存，生成领料记录（含时间、操作人、物料编码、数量、工单号），标记为“待同步”"
          ],
          "pageSuggestion": "MaterialRequisition.vue",
          "apiHint": "POST /api/inventory/requisition (创建领料单), GET /api/orders?status=active (查询进行中工单)",
          "dataNeeds": [
            "库存可用量（考虑已锁定/在途）",
            "工单列表（工单号、所需物料清单）",
            "缺件预警阈值（安全库存、最低库存）",
            "领料单模板（数量、用途、关联）"
          ],
          "stateRules": [
            "缺件预警后生成申请单，但本地仍允许提交（待岸基确认是否允许超量领用紧急情况？建议确认）",
            "领料单不可撤销，但可生成退料单对冲（建议确认是否需要撤销机制）",
            "同步后若岸端库存核减失败（如并发冲突），本地需响应冲突提示并进入数据同步模块处理"
          ],
          "apiSuggestion": "POST /api/inventory/requisition (创建领料单), GET /api/orders?status=active (查询进行中工单)"
        },
        {
          "key": "mod-4",
          "priority": "P0",
          "name": "退料管理",
          "description": "扫描退料条码，选择关联工单或退料原因，校验退料数量不超过原领用量，提交后增加本地库存并生成待同步退料单。",
          "features": [
            "扫描退料条码或手动选择物料，系统展示最近领用记录及领用数量",
            "选择退料原因（工单剩余、物料质量问题、误领等），可填写备注",
            "自动校验退料数量是否超过原领用总量，若超过则提示限制",
            "提交后本地增加库存，生成退料记录（含时间、操作人、物料、数量、原因），标记为“待同步”"
          ],
          "pageSuggestion": "MaterialReturn.vue",
          "apiHint": "POST /api/inventory/return (创建退料单), GET /api/inventory/requisitions?filter=recent (查询领用记录)",
          "dataNeeds": [
            "历史领用记录（领料单号、工单号、物料编码、领用数量、领用时间）",
            "退料原因枚举（建议确认退料类型）",
            "退料数量校验规则（最大退料量 = 该物料总领用量 - 已退量）"
          ],
          "stateRules": [
            "退料数量超过可退量时，直接拦截并提示，不可强制提交",
            "退料单提交后不可撤销（若岸基审核不通过可生成新的领料单调整，建议确认处理流程）",
            "若物料质量问题需拍照留痕，复用盘点模块的拍照功能（建议确认是否单独附件）"
          ],
          "apiSuggestion": "POST /api/inventory/return (创建退料单), GET /api/inventory/requisitions?filter=recent (查询领用记录)"
        },
        {
          "key": "mod-5",
          "priority": "P0",
          "name": "离线数据同步与状态管理",
          "description": "管理所有离线操作的缓存数据，在网络恢复后自动执行同步任务，处理同步结果（成功/失败/冲突），并提供重试和手动触发同步能力。",
          "features": [
            "自动后台检测网络，当网络恢复（弱网/连接岸基）时，按队列顺序依次上传待同步数据（盘点差异、领料单、退料单及附件）",
            "同步过程中展示进度条，同步完成后展示成功/失败/冲突项明细列表",
            "对同步失败项支持手动重试或重新上传，对数据冲突（如岸端同时修改了库存）展示差异并引导用户选择保留本地或采用岸端版本",
            "支持手动强制全局同步（在线时）以及查看历史同步日志"
          ],
          "pageSuggestion": "DataSyncManager.vue",
          "apiHint": "POST /api/sync/upload (批量上传离线数据), GET /api/sync/status?shipId=xxx (查询同步状态), POST /api/sync/resolveConflict (解决冲突)",
          "dataNeeds": [
            "待同步队列（数据类型、内容JSON、本地创建时间、重试次数、附件列表）",
            "岸端同步结果反馈（成功/失败原因/冲突详情）",
            "冲突数据对比视图（本地版本、岸端版本、差异字段）"
          ],
          "stateRules": [
            "同步失败后保留本地数据，重试次数超过3次时自动标记为“同步异常”并提示人工介入（建议确认最大重试次数）",
            "数据冲突解决后，自动更新本地缓存并清除冲突标记",
            "同步过程中不可退出应用或切换到其他功能，以免数据丢失（建议确认是否需要后台保活机制）"
          ],
          "apiSuggestion": "POST /api/sync/upload (批量上传离线数据), GET /api/sync/status?shipId=xxx (查询同步状态), POST /api/sync/resolveConflict (解决冲突)"
        }
      ],
      "sc-8": [
        {
          "key": "mod-1",
          "priority": "P0",
          "name": "用户管理",
          "description": "支持对系统用户的增删改查、批量导入导出、启用/禁用及角色分配，覆盖用户全生命周期管理。",
          "features": [
            "创建新用户，填写账号、姓名、所属部门、联系方式，分配一个或多个角色",
            "编辑已有用户信息及角色分配，支持批量导入用户（CSV）和批量导出",
            "启用或禁用用户账号，禁用后该用户无法登录系统",
            "支持按部门、角色、状态筛选用户列表，快速定位目标用户"
          ],
          "pageSuggestion": "UserManager.vue",
          "apiHint": "GET/POST/PUT/DELETE /api/users；POST /api/users/batch；POST /api/users/import；GET /api/users/export",
          "dataNeeds": [
            "用户基本信息（账号、姓名、部门、联系方式）",
            "角色列表（预定义角色与自定义角色）",
            "组织架构树"
          ],
          "stateRules": [
            "用户状态：启用/禁用，禁用时登录接口返回403及原因",
            "删除用户前需确认是否存在关联记录（如工单、流程），建议二次弹窗确认",
            "批量导入时需校验数据格式，重复账号提示覆盖或跳过（建议确认）"
          ],
          "apiSuggestion": "GET/POST/PUT/DELETE /api/users；POST /api/users/batch；POST /api/users/import；GET /api/users/export"
        },
        {
          "key": "mod-2",
          "priority": "P0",
          "name": "角色与权限管理",
          "description": "支持自定义角色，按模块（设备维保、物资库存、工单执行等）精细配置功能菜单和操作权限（查看、新增、编辑、删除、审核），支持复制现有角色快速创建。",
          "features": [
            "创建新角色（如航前校验审批员），填写角色名称和描述",
            "为角色分配可访问的功能模块及操作权限，权限树按模块+操作类型展开",
            "支持复制现有角色，快速创建相似角色，修改后保存生效",
            "查看所有角色列表及关联用户数，角色被引用时提示不可删除（建议确认）"
          ],
          "pageSuggestion": "RolePermissionManager.vue",
          "apiHint": "GET/POST/PUT/DELETE /api/roles；GET /api/permissions/tree；POST /api/roles/copy",
          "dataNeeds": [
            "角色列表（含关联用户数）",
            "功能模块列表（设备维保、物资库存、工单执行、数据同步、审计日志等）",
            "每个模块的操作类型列表（查看、新增、编辑、删除、审核）"
          ],
          "stateRules": [
            "角色删除前检查是否存在关联用户或流程引用，若有则禁止删除并提示（建议确认）",
            "权限修改后需重新登录或刷新权限缓存才能生效"
          ],
          "apiSuggestion": "GET/POST/PUT/DELETE /api/roles；GET /api/permissions/tree；POST /api/roles/copy"
        },
        {
          "key": "mod-3",
          "priority": "P0",
          "name": "流程定义",
          "description": "提供可视化流程设计器，支持配置工单审核、采购审批、航前校验处置等业务流程，定义节点、审批人、条件分支、超时及转交策略。",
          "features": [
            "通过拖拽式流程设计器创建新流程，放置开始、审批、条件分支、结束等节点",
            "为每个审批节点设置审批人（指定角色或具体用户）、超时提醒规则（如超过24小时自动转交）",
            "保存并发布流程版本，发布后生效，历史版本可追溯",
            "支持查看已发布流程的示意图及节点配置详情"
          ],
          "pageSuggestion": "WorkflowDesigner.vue",
          "apiHint": "GET/POST/PUT /api/workflows；GET /api/workflows/types；POST /api/workflows/deploy；GET /api/workflows/versions",
          "dataNeeds": [
            "流程类型列表（工单审核、物资采购审批、航前校验处置等）",
            "组织架构和角色数据用于选择审批人",
            "超时规则配置（小时数、转交对象）"
          ],
          "stateRules": [
            "已发布的流程不可直接编辑，需创建新版本后重新发布（建议确认）",
            "流程发布后，正在执行的实例继续按原版本执行，新实例使用新版本"
          ],
          "apiSuggestion": "GET/POST/PUT /api/workflows；GET /api/workflows/types；POST /api/workflows/deploy；GET /api/workflows/versions"
        },
        {
          "key": "mod-4",
          "priority": "P1",
          "name": "配置验证与发布",
          "description": "支持系统管理员模拟切换视角为指定角色登录，测试权限和流程是否按预期运行，确认无误后正式发布全局配置，记录变更日志。",
          "features": [
            "选择任意角色进行模拟登录，查看该角色可见的菜单和可执行的操作",
            "选择模拟用户执行流程实例（如创建工单、提交审批），校验流程节点跳转是否正确",
            "检查配置冲突（如角色重复授权、流程节点指向无效用户）并提示",
            "确认无误后点击‘正式发布’，系统将最新配置同步至全局生效，并记录变更时间、操作人、变更内容摘要"
          ],
          "pageSuggestion": "ConfigSimulation.vue",
          "apiHint": "POST /api/config/simulate/start；POST /api/config/simulate/action；POST /api/config/publish；GET /api/config/diff",
          "dataNeeds": [
            "当前全局配置快照（角色、权限、流程）",
            "模拟用户与角色映射"
          ],
          "stateRules": [
            "模拟操作不保存真实数据，仅做校验，退出模拟后自动清除测试数据",
            "发布前需确认变更影响范围（如影响用户数、正在运行流程数），建议弹出确认对话框"
          ],
          "apiSuggestion": "POST /api/config/simulate/start；POST /api/config/simulate/action；POST /api/config/publish；GET /api/config/diff"
        },
        {
          "key": "mod-5",
          "priority": "P0",
          "name": "审计日志查询",
          "description": "集中展示所有用户、角色、权限、流程的创建、修改、删除操作的审计日志，支持按时间、操作对象、操作类型检索，并可导出审计报告。",
          "features": [
            "按时间范围、操作人、操作对象（用户/角色/流程）、操作类型（新增/修改/删除）多条件检索日志",
            "查看每条日志的详细内容：操作时间、操作人IP、操作内容摘要、变更前后对比",
            "支持导出审计日志为Excel或PDF格式，用于ISM/船级社审查",
            "日志数据只读，不可编辑或删除，保证合规审计的完整性"
          ],
          "pageSuggestion": "AuditLogView.vue",
          "apiHint": "GET /api/audit-logs；GET /api/audit-logs/export；GET /api/audit-logs/:id/detail",
          "dataNeeds": [
            "审计日志列表（时间、操作人、操作类型、操作对象、内容摘要）",
            "操作类型枚举（新增、编辑、删除、启用、禁用、发布等）"
          ],
          "stateRules": [
            "日志数据保留期限根据等保要求配置，默认不少于1年（建议确认）",
            "导出时需校验当前用户是否有导出权限（通常仅审计员与系统管理员可导出）"
          ],
          "apiSuggestion": "GET /api/audit-logs；GET /api/audit-logs/export；GET /api/audit-logs/:id/detail"
        }
      ],
      "sc-9": [
        {
          "key": "mod-1",
          "priority": "P0",
          "name": "系统运行状态总览仪表盘",
          "description": "集中展示系统整体健康度与关键运行指标，帮助管理员快速掌握系统运行态势。",
          "features": [
            "以仪表盘卡片或图表呈现服务在线状态（各微服务实例数/健康/异常）、数据库连接池使用率、CPU/内存/磁盘资源趋势图",
            "展示近24小时船岸数据同步成功率、待同步数据量及异常告警数统计",
            "支持按船舶、模块或时间范围筛选运行指标，并支持自动刷新（如每30秒）",
            "提供一键跳转至异常告警列表或审计日志页面的快捷入口"
          ],
          "pageSuggestion": "SysMonitorDashboard.vue",
          "apiHint": "GET /api/monitor/overview（返回整体健康度与摘要指标）; GET /api/monitor/sync-stats?range=24h（同步统计）; GET /api/monitor/resource-trend（资源趋势数据）",
          "dataNeeds": [
            "所有微服务实例清单及当前状态（online/offline/error）",
            "数据库连接池当前活跃数、最大连接数、等待数",
            "各船舶最近一次同步时间、同步成功/失败记录数",
            "资源使用历史时序数据（CPU/内存/磁盘/网络）"
          ],
          "stateRules": [
            "当任一微服务状态为 error 或超过半数离线时，仪表盘顶部展示红色告警横幅",
            "同步成功率低于90%时自动标记为警告状态（建议确认阈值）",
            "资源使用率超过80%时触发橙色预警，超过95%时触发红色预警"
          ],
          "apiSuggestion": "GET /api/monitor/overview（返回整体健康度与摘要指标）; GET /api/monitor/sync-stats?range=24h（同步统计）; GET /api/monitor/resource-trend（资源趋势数据）"
        },
        {
          "key": "mod-2",
          "priority": "P0",
          "name": "异常告警分级处理与闭环",
          "description": "集中管理所有系统异常告警，支持分级响应与处置流程记录。",
          "features": [
            "以列表视图展示未处理及历史告警，支持按严重程度（紧急/严重/警告/提示）、告警类型（服务异常/同步失败/资源超标/弱网节点）、发生时间排序与筛选",
            "点击单条告警展开详情：告警内容、影响范围（船舶/模块/服务）、首次/最近发生时间、累计次数、关联操作日志",
            "管理员可为告警选择处理措施（如重启服务、通知运维、调整同步策略、临时忽略），填写处理备注，并标记状态为“处理中”或“已解决”",
            "所有告警处理操作自动写入审计日志，支持按处理人、处理结果、时间范围检索历史告警处置记录"
          ],
          "pageSuggestion": "AlertManagement.vue",
          "apiHint": "GET /api/monitor/alerts（告警列表，支持分页、时间范围、类型、级别筛选）; PUT /api/monitor/alerts/{alertId}/handle（标记处理）; GET /api/monitor/alerts/{alertId}（告警详情）",
          "dataNeeds": [
            "告警列表：类型、级别、描述、影响范围、发生时间、累计次数、当前状态",
            "可用的处理措施枚举（如 restart-service、notify-team、adjust-sync、ignore）",
            "操作日志关联：每次告警处理记录的操作用户、时间、措施、备注"
          ],
          "stateRules": [
            "告警级别由系统根据预设规则自动生成（如连续同步失败3次为警告，5次为严重）",
            "紧急告警（如核心服务宕机）超过30分钟未处理，自动触发通知（建议确认通知方式）",
            "已解决的告警如再次触发，系统自动重新打开并标记为复发"
          ],
          "apiSuggestion": "GET /api/monitor/alerts（告警列表，支持分页、时间范围、类型、级别筛选）; PUT /api/monitor/alerts/{alertId}/handle（标记处理）; GET /api/monitor/alerts/{alertId}（告警详情）"
        },
        {
          "key": "mod-3",
          "priority": "P0",
          "name": "操作审计日志精细查询与异常标记",
          "description": "支持按多维条件检索用户操作日志，辅助合规审计与违规排查。",
          "features": [
            "提供复合筛选面板：时间范围（支持自定义及常用快捷选项如近7天、近30天）、用户角色（岸基机务/船舶管理/船端作业/系统管理员/审计员/采办协同）、操作类型（登录/数据增删改/权限变更/流程发布/同步操作）、操作对象（模块名称或具体资源ID）",
            "查询结果以表格展示，包含时间、操作用户、角色、IP地址、操作类型、对象、详情，支持点击展开变更前后字段值对比",
            "管理员可对疑似越权或违规操作条目标记为“待审核”，并添加备注说明；已标记条目支持批量驳回或确认",
            "支持将当前查询结果或选中条目导出为CSV/PDF，导出内容包含筛选条件摘要及统计信息"
          ],
          "pageSuggestion": "AuditLogSearch.vue",
          "apiHint": "GET /api/audit/logs（日志列表，支持复杂筛选与分页）; PUT /api/audit/logs/{logId}/mark（标记待审核/已确认）; GET /api/audit/logs/{logId}（详情含变更前后）; POST /api/audit/logs/export（导出）",
          "dataNeeds": [
            "操作日志字段：时间戳、用户ID、用户角色、IP地址、操作类型、操作对象类型及ID、操作描述、变更前值JSON、变更后值JSON",
            "用户角色枚举列表、操作类型枚举列表",
            "待审核标记状态（normal / pending-review / confirmed）及备注"
          ],
          "stateRules": [
            "操作日志至少保存1年（建议确认保存期限，等保三级通常要求6个月以上）",
            "标记为“待审核”的条目不可重复标记，且需审核人字段记录操作管理员",
            "导出PDF报告需包含查询条件、导出时间、操作人签名（建议确认）"
          ],
          "apiSuggestion": "GET /api/audit/logs（日志列表，支持复杂筛选与分页）; PUT /api/audit/logs/{logId}/mark（标记待审核/已确认）; GET /api/audit/logs/{logId}（详情含变更前后）; POST /api/audit/logs/export（导出）"
        },
        {
          "key": "mod-4",
          "priority": "P1",
          "name": "运维报告与合规文档自动生成",
          "description": "定期或按需生成系统运维状况报告与审计合规文档，支撑管理层决策与ISM/船级社审查。",
          "features": [
            "支持预设报告模板（运维周报/月报、审计摘要、航前合规汇总），自动汇集仪表盘指标、告警统计、同步成功率、异常处理记录等数据",
            "管理员可自定义报告内容范围：选择船舶、时间区间、是否包含告警明细、操作审计摘要等",
            "一键生成PDF/Word报告并预览，支持设置定时生成计划（如每周一上午8点自动生成并推送）",
            "所有已生成的报告按时间归档，支持按报告类型、生成时间检索和下载，同时记录生成操作到审计日志"
          ],
          "pageSuggestion": "ReportGenerator.vue",
          "apiHint": "GET /api/report/templates（报告模板列表）; POST /api/report/generate（生成报告，参数含模板ID、筛选条件）; GET /api/report/list（已生成报告列表）; DELETE /api/report/{reportId}（删除过期报告）",
          "dataNeeds": [
            "报告模板定义（名称、包含的数据模块、版式配置）",
            "报告内容所需数据：仪表盘摘要、告警统计、同步成功率、异常处理记录、操作日志统计",
            "定时任务配置（cron表达式、接收邮箱或通知方式）",
            "已生成报告存储路径、生成时间、大小、下载权限"
          ],
          "stateRules": [
            "报告生成使用异步任务，如果数据量大需显示进度条或预计完成时间",
            "未完成生成前不可重复触发相同报告",
            "报告归档保留周期建议为12个月（建议确认）"
          ],
          "apiSuggestion": "GET /api/report/templates（报告模板列表）; POST /api/report/generate（生成报告，参数含模板ID、筛选条件）; GET /api/report/list（已生成报告列表）; DELETE /api/report/{reportId}（删除过期报告）"
        }
      ],
      "sc-10": [
        {
          "key": "mod-1",
          "priority": "P0",
          "name": "审计日志查询与列表展示",
          "description": "提供多维度条件组合的审计日志检索面板，支持按时间范围、用户角色、操作类型、船舶名称等筛选，并以列表形式展示日志摘要及统计信息。",
          "features": [
            "以卡片或表格形式展示最近操作日志列表，显示操作人、时间、模块、操作类型等摘要信息",
            "提供高级筛选面板，支持时间范围（近7天/30天/自定义）、用户角色、操作类型（登录/数据修改/权限变更/流程发布）、船舶名称等多条件组合",
            "展示总日志条数及按操作类型或日期的统计分布图",
            "支持日志列表按时间倒序正序排序、分页加载"
          ],
          "pageSuggestion": "AuditLogQuery.vue",
          "apiHint": "GET /api/audit-logs?timeRange=&role=&operationType=&vesselName=&page=&limit=&sortBy=&order=",
          "dataNeeds": [
            "审计日志记录列表（每条含操作人、时间、IP、模块、对象、操作类型）",
            "用户角色枚举列表（岸基机务、船舶管理、船端作业、系统管理员、采办协同）",
            "操作类型枚举列表（登录、数据修改、权限变更、流程发布等）",
            "船舶名称列表（由船舶基础数据提供）"
          ],
          "stateRules": [
            "列表默认加载最近30天日志，支持按条件筛选后刷新",
            "查询结果分页加载，每页默认20条",
            "统计图随筛选条件实时更新"
          ],
          "apiSuggestion": "GET /api/audit-logs?timeRange=&role=&operationType=&vesselName=&page=&limit=&sortBy=&order="
        },
        {
          "key": "mod-2",
          "priority": "P0",
          "name": "日志详情查看与变更差异对比",
          "description": "点击单条日志展开完整详情，包括操作人账号、姓名、操作时间、IP地址、操作模块、操作对象、变更前内容与变更后内容，并以高亮方式清晰展示数据变更差异。",
          "features": [
            "点击日志条目展开/折叠详细面板，展示所有元数据字段",
            "变更前/变更后内容以左右对比或内联高亮形式展示，支持JSON格式化显示",
            "支持查看关联日志（如同一对象或同一次会话的连续操作）",
            "支持日志详情快速复制或截图（合规留痕需要）"
          ],
          "pageSuggestion": "AuditLogDetail.vue",
          "apiHint": "GET /api/audit-logs/{logId}/detail（包含变更前后完整数据）",
          "dataNeeds": [
            "日志的完整元数据（操作人姓名、账号、部门、IP、时间戳、浏览器UA等）",
            "变更前数据对象（序列化JSON）",
            "变更后数据对象（序列化JSON）",
            "关联日志ID列表（可选）"
          ],
          "stateRules": [
            "详情面板支持独立关闭或保持打开",
            "变更差异对比区域默认仅对修改操作（数据修改、权限变更）显示，其他操作显示操作摘要",
            "高亮区域支持颜色区分（增加绿色、删除红色）"
          ],
          "apiSuggestion": "GET /api/audit-logs/{logId}/detail（包含变更前后完整数据）"
        },
        {
          "key": "mod-3",
          "priority": "P0",
          "name": "合规判定与异常标记",
          "description": "审计员根据业务合规标准对日志进行人工审核，支持将疑似异常日志标记为‘待审核’或‘不合规’，并填写审计意见与备注，触发后续审批流程（如需要）。所有标记操作自动记录到审计日志。",
          "features": [
            "在日志详情页面或列表批量操作中，提供‘标记为待审核’和‘标记为不合规’按钮",
            "填写审计意见文本（必填），并可选择自动生成预定义标准意见模板",
            "标记为‘不合规’时触发可选审批流程（如向系统管理员或上级发送通知）",
            "支持查看历史标记记录与处理状态（已处理/待处理）"
          ],
          "pageSuggestion": "AuditMarking.vue",
          "apiHint": "POST /api/audit-logs/{logId}/mark {status: 'pending_review'|'non_compliant', comment: '...', triggerWorkflow: true/false}",
          "dataNeeds": [
            "当前日志ID及操作摘要",
            "预定义合规判定标准列表（建议确认：由客户提供具体规则，如非工作时间修改、频繁权限变更等）",
            "可选审批流程配置（如有）"
          ],
          "stateRules": [
            "标记操作不可撤回，但支持后续补充审核意见",
            "标记后日志状态更新并在列表中以不同颜色标识（黄色-待审核，红色-不合规）",
            "所有标记操作的审计痕迹自动写入系统日志（操作人、时间、标记内容）",
            "若触发审批流程，标记状态流转至审批环节，待审批通过后最终固化"
          ],
          "apiSuggestion": "POST /api/audit-logs/{logId}/mark {status: 'pending_review'|'non_compliant', comment: '...', triggerWorkflow: true/false}"
        },
        {
          "key": "mod-4",
          "priority": "P1",
          "name": "审计报告导出",
          "description": "支持将筛选后的日志范围导出为PDF或CSV格式的正式审计报告，报告带水印和审计印章，包含筛选条件、统计摘要、详细日志列表及审计意见。",
          "features": [
            "在筛选结果页面提供‘导出报告’按钮，支持选择格式（PDF/CSV）",
            "导出前填写报告标题、报告范围说明、审计员签名（可选）",
            "系统生成带水印（如‘审计专用’）和电子印章的PDF报告，或生成结构化CSV文件",
            "导出完成后在界面提供下载链接，同时将导出操作记录到审计日志"
          ],
          "pageSuggestion": "AuditReportExport.vue",
          "apiHint": "POST /api/audit-logs/export {format:'pdf'|'csv', filters:{...}, title:'...', signer:'...'}（返回下载URL或直接流式下载）",
          "dataNeeds": [
            "当前筛选条件（时间范围、角色、操作类型、船舶等）",
            "审计员身份信息（用于签名和水印嵌入）",
            "报告模板配置（如公司Logo、审计印章图片）"
          ],
          "stateRules": [
            "导出为异步任务，生成期间显示进度条，完成后通知用户下载",
            "CSV文件支持UTF-8 BOM编码以兼容Excel中文",
            "报告文件名固定格式：审计报告_YYYYMMDD_HHmmss.pdf",
            "每次导出操作自动写入审计日志，记录导出人、时间、筛选条件、文件大小"
          ],
          "apiSuggestion": "POST /api/audit-logs/export {format:'pdf'|'csv', filters:{...}, title:'...', signer:'...'}（返回下载URL或直接流式下载）"
        }
      ],
      "sc-11": [
        {
          "key": "mod-1",
          "priority": "P0",
          "name": "采购需求审核与申请发起",
          "description": "采办协同人员查看由库存预警或工单缺件自动生成的采购需求列表，审核需求合理性（核对库存、BOM关联、预算余额），选择需求并发起正式采购申请，包括预算校验、供应商选择、填写采购说明和上传询比价附件。",
          "features": [
            "查看待处理采购需求列表，支持按物料编码、紧急程度、创建时间筛选",
            "审核需求合理性，核对现有库存、设备BOM关联和预算余额，可标记需求为待调整或转人工",
            "发起采购申请，系统自动校验预算余额，若不足则提示调整数量或发起预算追加流程",
            "填写采购说明、交货期限，从合格供应商列表选择或手动输入供应商，上传询比价附件后提交申请"
          ],
          "pageSuggestion": "ProcurementRequest.vue",
          "apiHint": "GET /api/procurement/requirements 查询采购需求列表；POST /api/procurement/orders 创建采购申请；GET /api/budget/balance 查询预算余额；GET /api/suppliers 查询合格供应商列表",
          "dataNeeds": [
            "采购需求列表（物料编码、名称、数量、紧急程度、建议供应商）",
            "预算余额数据",
            "设备BOM关联信息",
            "合格供应商列表",
            "历史采购记录（可选）"
          ],
          "stateRules": [
            "预算余额不足时提示‘预算不足，请调整数量或发起预算追加流程’（建议确认预算追加流程）",
            "供应商列表需为合格供应商且状态正常",
            "采购需求标记为‘待处理’、‘已处理’、‘已驳回’等状态",
            "操作自动记录日志，包含操作人、时间、操作类型、变更数据"
          ],
          "apiSuggestion": "GET /api/procurement/requirements 查询采购需求列表；POST /api/procurement/orders 创建采购申请；GET /api/budget/balance 查询预算余额；GET /api/suppliers 查询合格供应商列表"
        },
        {
          "key": "mod-2",
          "priority": "P1",
          "name": "采购订单跟踪",
          "description": "采购申请审批通过后，系统生成采购订单。采办协同人员跟踪订单执行状态，包括供应商发货、物流运输、预计到货时间，并可手动更新订单状态或记录异常。",
          "features": [
            "查看采购订单列表，支持按订单号、供应商、状态筛选",
            "查看订单详情，包括采购物料明细、金额、供应商、审批历史",
            "跟踪订单状态（待发货、已发货、运输中、部分到货、已到货），支持手动更新状态并添加备注",
            "接收到货通知，自动提醒采办人员到货验收"
          ],
          "pageSuggestion": "ProcurementOrderTracking.vue",
          "apiHint": "GET /api/procurement/orders 查询订单列表；GET /api/procurement/orders/{id} 查询订单详情；PATCH /api/procurement/orders/{id}/status 更新订单状态",
          "dataNeeds": [
            "采购订单数据（订单号、物料明细、数量、金额、供应商、状态、预计到货时间）",
            "物流信息（可选）",
            "订单变更日志"
          ],
          "stateRules": [
            "订单状态流转：待审批（系统处理）->待发货->已发货->运输中->已到货->部分验收->已入库（建议确认状态定义）",
            "超时未到货自动触发预警（建议确认）",
            "状态变更操作自动记录日志"
          ],
          "apiSuggestion": "GET /api/procurement/orders 查询订单列表；GET /api/procurement/orders/{id} 查询订单详情；PATCH /api/procurement/orders/{id}/status 更新订单状态"
        },
        {
          "key": "mod-3",
          "priority": "P0",
          "name": "到货验收与入库处理",
          "description": "物资到货后，采办协同人员进行到货检验。通过扫描物资条码加载采购订单信息，逐项核对实到数量、外观质量，录入检验结论（合格/不合格/部分不合格）。合格则确认入库，系统自动更新库存台账、关联设备BOM并核减预算；不合格则发起退换货流程。",
          "features": [
            "扫描物资条码自动加载采购订单及物料信息，支持手动录入条码",
            "录入实到数量、外观质量检验结果，可关联照片、质检报告等附件",
            "根据检验结论执行：合格则确认入库，系统更新库存、核减预算；不合格则发起退换货，填写不合格原因和处理意见",
            "查看入库历史记录和退换货跟踪"
          ],
          "pageSuggestion": "GoodsReceiptAndInspection.vue",
          "apiHint": "POST /api/inspection/records 创建验收记录；POST /api/inventory/stock-in 确认入库；POST /api/inventory/return-order 创建退换货单；GET /api/procurement/orders/{id} 加载订单信息",
          "dataNeeds": [
            "采购订单详情（物料编码、应到数量）",
            "库存台账（当前库存、安全库存）",
            "设备BOM关联数据",
            "预算账户余额",
            "供应商联系信息（退换货通知）",
            "检验标准文档（可选）"
          ],
          "stateRules": [
            "入库时需校验库存唯一性（一物多码？建议确认编码规范）",
            "退换货需生成退换货单并通知供应商，待供应商处理后再验收",
            "入库操作需同时核减预算，若预算不足则提示（建议确认预算核减规则）",
            "所有操作（验收、入库、退换货）自动记录日志，日志包含操作人、时间、操作类型、变更数据"
          ],
          "apiSuggestion": "POST /api/inspection/records 创建验收记录；POST /api/inventory/stock-in 确认入库；POST /api/inventory/return-order 创建退换货单；GET /api/procurement/orders/{id} 加载订单信息"
        }
      ]
    },
    "scenarioDetailReadyByKey": {
      "sc-1": true,
      "sc-2": true,
      "sc-3": true,
      "sc-4": true,
      "sc-5": true,
      "sc-6": true,
      "sc-7": true,
      "sc-8": true,
      "sc-9": true,
      "sc-10": true,
      "sc-11": true
    },
    "pageDesignsByScenarioKey": {
      "sc-1": {
        "pages": [
          {
            "key": "page-1",
            "priority": "P0",
            "type": "工作台页",
            "name": "设备维保计划工作台",
            "vueFile": "MaintenancePlanWorkbench.vue",
            "goal": "为岸基机务人员提供设备资产树与计划状态总览，快速定位需处理的设备并导航至计划制定或详情",
            "features": [
              "设备资产树与计划状态总览"
            ],
            "sections": [
              "顶部全局搜索与状态统计卡片（计划总数、即将到期数、缺失数）",
              "左侧设备资产树（按系统/区域/设备层级展开，节点旁显示计划状态图标及标签）",
              "右侧详情面板：选中设备后展示该设备的计划摘要（当前计划状态、周期、上次执行日期、下次到期日）、维保历史记录、快速操作按钮（新增计划、编辑、查看详情）",
              "底部状态筛选栏：通过状态标签（未制定、审核中、已生效、即将到期、已过期）过滤资产树显示",
              "导出报表按钮：导出当前筛选后的设备维保计划总览报表"
            ],
            "states": [
              "正常态：资产树正常加载，节点状态标签正确显示，右侧面板展示选中设备详情",
              "空态：无设备资产数据时，显示'暂无设备数据，请确认EAM同步是否完成'提示及引导",
              "加载态：资产树骨架屏加载，顶部统计卡片显示占位符",
              "异常态：API超时或失败时，显示错误提示与重试按钮，保留上次缓存数据（若有）"
            ],
            "keyInteractions": [
              "展开/折叠设备树节点",
              "点击设备节点触发右侧面板加载设备详情",
              "通过状态标签组合筛选资产树，高亮符合条件的设备节点",
              "点击快速操作按钮'新增计划'或'编辑计划'跳转至计划编辑页面（携带设备ID）",
              "点击导出报表按钮触发下载CSV/Excel文件"
            ],
            "dataInputs": [
              "GET /api/equipment-tree?type=maintenance-plan-status 获取资产树及计划状态",
              "GET /api/equipment/{id}/plan-summary 获取单个设备计划摘要及维保历史"
            ]
          },
          {
            "key": "page-2",
            "priority": "P0",
            "type": "表单页",
            "name": "预防性维护计划制定与编辑",
            "vueFile": "PlanEditor.vue",
            "goal": "支持岸基机务人员基于设备资产树和PMS规则新建或编辑预防性维护计划，校验冲突并提交审核",
            "features": [
              "预防性维护计划制定与编辑"
            ],
            "sections": [
              "顶部导航与操作栏：返回工作台、保存草稿、提交审核按钮",
              "设备选择区：支持单选或批量选择设备（从设备树弹窗选择或输入设备编码），已选设备列表显示编码、名称、当前计划状态",
              "计划参数设定区：计划类型单选项（日历周期/运行小时/工况触发），周期数值与单位输入，起始日期选择器，前置预警天数输入框，优先级下拉选择",
              "工单模板关联区：下拉搜索并选择关联的工单模板，显示模板摘要（步骤数、所需备件数）",
              "冲突检测提示区：提交前自动检测所选设备在设定时段内是否存在已有生效计划，以列表形式展示冲突详情并允许用户调整",
              "底部提交区：保存草稿（本地存储）或提交审核（触发工作流）"
            ],
            "states": [
              "正常态：表单可编辑，所有字段正常",
              "空态：编辑新建计划时设备列表为空显示'请选择设备'；未选择工单模板时显示'建议关联工单模板'",
              "加载态：提交审核时显示加载遮罩；调取工单模板列表时显示下拉加载中",
              "异常态：冲突检测失败或提交超时，显示错误提示并保留用户已填数据"
            ],
            "keyInteractions": [
              "点击'选择设备'打开设备树弹窗，支持多选并回填",
              "切换计划类型时动态显示对应参数输入（如运行小时需选计量变量）",
              "点击'检测冲突'触发异步校验，结果在下方区域展示",
              "点击'保存草稿'将当前表单数据存入本地或后台保存",
              "点击'提交审核'触发前端校验（必填项、冲突无错误）后提交POST/PUT请求，成功后跳转至工作台或审核列表"
            ],
            "dataInputs": [
              "GET /api/equipment/list?status=active 获取可选设备列表（含运行小时变量）",
              "GET /api/templates?type=work-order 获取工单模板列表",
              "POST /api/maintenance-plans/validate-conflicts 提交计划参数检测冲突",
              "POST /api/maintenance-plans 创建计划",
              "PUT /api/maintenance-plans/{id} 更新计划"
            ]
          },
          {
            "key": "page-3",
            "priority": "P0",
            "type": "列表页",
            "name": "计划变更审核与协同确认",
            "vueFile": "PlanApproval.vue",
            "goal": "管理计划变更申请的审核流程，支持查看差异、审批意见填写、通过/驳回操作，并记录日志",
            "features": [
              "计划变更审核与协同确认"
            ],
            "sections": [
              "顶部筛选栏：按状态（待审核、已通过、已驳回）、申请时间范围、发起人筛选待审列表",
              "待审列表区：表格展示申请编号、设备名称、变更类型（新建/修改/废止）、发起人、提交时间、当前处理人、状态标签，支持排序",
              "变更详情面板：选中一条申请后，以对比视图展示变更前后差异（计划参数、工单模板）",
              "审批操作区：审批意见文本框，通过/驳回按钮，附带提交确认弹窗",
              "审核日志区：以时间线形式展示该申请的所有审核记录（操作人、时间、意见、结果）"
            ],
            "states": [
              "正常态：列表加载完成，筛选功能正常，变更详情展示正确",
              "空态：无待审申请时显示'当前无待审批的变更申请'及历史记录入口",
              "加载态：列表初始加载显示骨架屏；提交审批时显示加载状态",
              "异常态：提交审批失败时显示错误提示并保留输入意见"
            ],
            "keyInteractions": [
              "点击筛选条件实时刷新列表",
              "点击列表行展开或侧边展示变更详情面板",
              "在变更详情中切换'变更前/变更后'视图对比",
              "填写审批意见后点击通过或驳回，确认弹窗后提交审批操作",
              "点击审核日志区域展开/收起时间线详情"
            ],
            "dataInputs": [
              "GET /api/approvals?type=plan-change&status=pending 获取待审列表",
              "GET /api/approvals/{id}/diff 获取变更前后差异",
              "GET /api/approvals/{id}/logs 获取审核日志",
              "POST /api/approvals/{id}/action 提交审批操作（通过/驳回）"
            ]
          }
        ],
        "navigation": [
          {
            "label": "维保计划工作台",
            "target": "MaintenancePlanWorkbench.vue",
            "default": true
          },
          {
            "label": "计划制定与编辑",
            "target": "PlanEditor.vue",
            "default": false
          },
          {
            "label": "计划变更审核",
            "target": "PlanApproval.vue",
            "default": false
          }
        ],
        "fileStructure": {
          "views": [
            "MaintenancePlanWorkbench.vue",
            "PlanEditor.vue",
            "PlanApproval.vue"
          ],
          "components": [
            "EquipmentTree.vue",
            "PlanStatusTag.vue",
            "PlanSummaryPanel.vue",
            "DeviceSelectorModal.vue",
            "PlanForm.vue",
            "ConflictAlert.vue",
            "ApprovalList.vue",
            "ChangeDiffViewer.vue",
            "AuditTimeline.vue"
          ],
          "data": [
            "mockEquipmentTree.js",
            "mockMaintenancePlans.js",
            "mockWorkOrderTemplates.js",
            "mockApprovals.js"
          ]
        }
      },
      "sc-2": {
        "pages": [
          {
            "key": "page-1",
            "priority": "P0",
            "type": "工作台页",
            "name": "航前健康检查任务触发",
            "vueFile": "VoyageHealthTrigger.vue",
            "goal": "岸基机务人员查看待检查船舶列表，手动或自动发起航前健康检查任务",
            "features": [
              "航前健康检查任务触发"
            ],
            "sections": [
              "顶部通知栏（推送的开航前校验通知）",
              "船舶列表区（显示待检查、执行中、已完成的船舶）",
              "手动发起检查入口（搜索/选择船舶并触发）"
            ],
            "states": [
              "正常态（有通知/任务列表）",
              "空态（无待检查船舶或历史记录）",
              "加载态（列表加载中）",
              "异常态（网络错误/接口失败）"
            ],
            "keyInteractions": [
              "点击船舶卡片进入看板页",
              "点击‘发起检查’按钮创建任务并跳转看板"
            ],
            "dataInputs": [
              "GET /api/voyage-health/check-tasks?status=pending, in_progress",
              "POST /api/voyage-health/check-tasks (手动发起)"
            ]
          },
          {
            "key": "page-2",
            "priority": "P0",
            "type": "看板页",
            "name": "健康状态总览与拦截告警看板",
            "vueFile": "VoyageHealthDashboard.vue",
            "goal": "集中展示当前船舶健康校验结果，显示通过/不通过项及拦截告警，提供问题清单导出",
            "features": [
              "健康状态总览与拦截告警看板"
            ],
            "sections": [
              "头部概览区（整体健康分数、开航拦截状态）",
              "分类结果区（设备维保/物资库存/证书资质三栏，每栏显示通过/不通过数量）",
              "问题清单表格区（显示所有不通过项，含类型、描述、严重等级）",
              "操作栏（导出PDF/Excel按钮）"
            ],
            "states": [
              "正常态（有校验结果）",
              "空态（校验任务刚创建，尚未完成）",
              "加载态（获取结果中）",
              "异常态（校验规则执行失败）"
            ],
            "keyInteractions": [
              "点击问题行跳转详情页",
              "点击导出按钮生成并下载文件"
            ],
            "dataInputs": [
              "GET /api/voyage-health/check-summary?shipId={id}",
              "GET /api/voyage-health/issues?checkTaskId={id}",
              "POST /api/voyage-health/export-issues"
            ]
          },
          {
            "key": "page-3",
            "priority": "P0",
            "type": "详情页",
            "name": "不通过项详情与处置流程",
            "vueFile": "VoyageHealthIssueDetail.vue",
            "goal": "展示单个不通过项的详细信息和关联数据，支持启动紧急工单、物资调拨、豁免审批等处置流程",
            "features": [
              "不通过项详情查看与处置流程发起"
            ],
            "sections": [
              "问题标题与基本信息区（类型、关联对象、过期/逾期时间、严重等级）",
              "详情数据区（逾期工单清单/缺件物料表格/过期证书列表）",
              "处置操作区（创建紧急工单按钮、发起调拨申请按钮、提交豁免审批按钮）",
              "处置进度区（已发起的处置单状态跟踪）"
            ],
            "states": [
              "正常态（有详情）",
              "加载态（获取详情中）",
              "异常态（数据不存在或权限不足）",
              "空态（如果问题已被处理，显示已解决信息）"
            ],
            "keyInteractions": [
              "点击创建紧急工单弹出表单填写",
              "点击发起调拨申请弹出表单",
              "点击提交豁免审批弹出表单",
              "表单提交后刷新处置进度"
            ],
            "dataInputs": [
              "GET /api/voyage-health/issues/{issueId}",
              "POST /api/work-orders/emergency",
              "POST /api/materials/transfer-requests",
              "POST /api/certificates/exemption-requests"
            ]
          },
          {
            "key": "page-4",
            "priority": "P1",
            "type": "列表页",
            "name": "校验记录与航前健康报告",
            "vueFile": "VoyageHealthReports.vue",
            "goal": "查看历次航前健康检查记录，生成和下载健康报告，监控开航状态同步结果",
            "features": [
              "校验记录与航前健康报告管理"
            ],
            "sections": [
              "搜索筛选区（按船舶、日期范围、状态过滤）",
              "记录列表区（展示检查任务、生成报告状态、开航状态）",
              "报告生成入口（针对已完成任务生成报告）",
              "日志查看弹窗（点击日志按钮展开操作时间线）"
            ],
            "states": [
              "正常态（有记录）",
              "空态（无历史记录）",
              "加载态（列表加载中）",
              "异常态（查询失败）"
            ],
            "keyInteractions": [
              "点击生成报告按钮触发异步生成并刷新列表",
              "点击下载报告按钮下载PDF",
              "点击开航状态标签查看详情"
            ],
            "dataInputs": [
              "GET /api/voyage-health/reports?shipId={}&dateRange={}",
              "POST /api/voyage-health/reports/generate",
              "GET /api/voyage-health/reports/{id}/download",
              "GET /api/voyage-health/logs?taskId={}"
            ]
          }
        ],
        "navigation": [
          {
            "label": "航前健康检查任务",
            "target": "VoyageHealthTrigger.vue",
            "default": true
          },
          {
            "label": "健康校验看板",
            "target": "VoyageHealthDashboard.vue",
            "default": false
          },
          {
            "label": "问题详情与处置",
            "target": "VoyageHealthIssueDetail.vue",
            "default": false
          },
          {
            "label": "校验报告与记录",
            "target": "VoyageHealthReports.vue",
            "default": false
          }
        ],
        "fileStructure": {
          "views": [
            "VoyageHealthTrigger.vue",
            "VoyageHealthDashboard.vue",
            "VoyageHealthIssueDetail.vue",
            "VoyageHealthReports.vue"
          ],
          "components": [
            "StatusTag.vue",
            "IssueCard.vue",
            "DispositionForm.vue",
            "DataTable.vue",
            "ExportButton.vue"
          ],
          "data": [
            "scenarioMockData.js"
          ]
        },
        "revisionNote": "根据4个功能模块拆分为4个页面：任务触发工作台、健康看板、问题详情处置、报告与记录。每个页面承载一个模块，便于职责分明。导航列表包含所有页面，默认进入任务触发页。"
      },
      "sc-3": {
        "pages": [
          {
            "key": "page-1",
            "priority": "P0",
            "type": "列表页",
            "name": "工单执行跟踪列表",
            "vueFile": "WorkOrderAuditList.vue",
            "goal": "为岸基机务人员提供待审核/已完成工单的聚合视图，支持多维筛选和快速定位",
            "features": [
              "工单执行跟踪筛选列表"
            ],
            "sections": [
              "顶部导航和用户信息",
              "筛选条件栏：船舶名称下拉、设备资产树选择器、工单类型多选、工单状态多选、时间范围日期选择器、搜索按钮",
              "工单摘要列表：表头（工单号、关联设备、优先级、报工时间、当前状态、操作），每行含状态标签，支持排序（优先级、报工时间）和分页",
              "列表空态提示（无符合条件的工单）",
              "加载状态骨架屏"
            ],
            "states": [
              "正常态：列表数据正常展示",
              "空态：无待审核或已完成工单时显示空状态插图及引导文字",
              "加载态：列表数据加载中显示骨架屏或进度条",
              "异常态：网络错误或接口异常时显示错误提示及重试按钮",
              "筛选无结果：组合筛选后无匹配工单显示'暂无数据'及清除筛选建议"
            ],
            "keyInteractions": [
              "点击列表行跳转至工单详情核验页面（WorkOrderAuditDetail.vue）并携带工单ID",
              "筛选条件联动：选择船舶后设备资产树自动过滤该船舶下设备",
              "时间范围默认最近一周，可快捷选择最近一天、一周、一月",
              "分页切换或点击排序触发重新加载列表",
              "状态标签点击可快速筛选该状态（如点击'待审核'标签自动筛选待审核工单）"
            ],
            "dataInputs": [
              "用户身份与权限（审核人角色）",
              "船舶列表数据（GET /api/ships）",
              "设备资产树数据（按船舶过滤：GET /api/equipmentTree?shipId=）",
              "工单列表数据（GET /api/workOrders?status=待审核,已通过,需整改&shipId=&equipmentId=&type=&startDate=&endDate=&page=&size=&sort=）"
            ]
          },
          {
            "key": "page-2",
            "priority": "P0",
            "type": "详情页",
            "name": "工单审核详情与操作",
            "vueFile": "WorkOrderAuditDetail.vue",
            "goal": "展示单个工单的完整报工数据，支持机务人员逐项核验并执行审核通过或退回操作，提供整改跟踪与审计日志查阅",
            "features": [
              "报工数据核验详情",
              "审核通过/退回处理",
              "整改跟踪与审计日志"
            ],
            "sections": [
              "页面顶部：工单编号、关联设备、当前状态、优先级标签，以及返回列表按钮",
              "工单基本信息分区：设备名称、报工人员、报工时间、工单类型、维保标准说明（只读）",
              "执行明细分区：实际执行人员、开始/结束时间、总实际工时、执行步骤列表（勾选状态、完成说明、附件链接）",
              "物料消耗分区：物料名称、编码、计划用量、实际用量、批次号，超量物料高亮标示，支持查看物料附件",
              "多媒体附件分区：照片/视频缩略图网格，点击弹出预览，显示拍摄时间戳",
              "异常记录分区：异常类型、描述、现场照片，展示处理状态（待处理/已处理）",
              "审核操作区：审核通过按钮（绿色）、退回整改按钮（红色），退回时弹出模态框填写审核意见（必填）、选择整改要求（补全数据/重新执行/更换物料/其他+自由文本）、支持上传附件",
              "审核历史分区：Tab切换，默认显示'审核日志'，展示历次审核记录（操作人、时间、结论、意见、附件），支持版本对比",
              "整改跟踪分区（Tab页）：展示退回工单的整改任务列表（整改要求、责任人、计划完成时间、实际完成时间、整改结果说明），支持点击查看整改后报工数据重新进入审核流程",
              "审计日志查询分区（Tab页）：按时间、操作人、工单号检索审核操作记录，列表展示操作类型、时间、审核意见、操作人，支持导出（Excel/PDF）"
            ],
            "states": [
              "正常态：工单详情数据完整展示，所有操作可用",
              "加载态：详情数据加载中显示骨架屏或全页加载指示",
              "异常态：工单ID无效或接口失败，显示错误提示和返回按钮",
              "审核通过完成态：操作后显示成功提示，工单状态更新为'已闭环'，审核按钮置灰",
              "退回操作态：退回提交后显示成功提示，工单状态更新为'需整改'，刷新整改跟踪Tab",
              "空态：整改任务列表为空时显示'暂无整改任务'",
              "超量物料高亮状态：物料消耗超出计划用量时以橙色/红色背景突出显示"
            ],
            "keyInteractions": [
              "点击附件缩略图弹出全屏预览（图片/视频播放），支持左右滑动",
              "物料超量时显示工具提示超量数量",
              "审核通过：点击'确认通过'弹出二次确认对话框，确认后调用POST接口，成功后更新页面状态并显示审核人时间",
              "退回整改：点击'退回整改'弹出模态框，填写意见和选择要求（至少一项）后提交，调用POST接口，成功后跳转至整改跟踪Tab并刷新列表",
              "审核历史Tab：支持按版本对比，点击'对比'按钮弹出差异视图（并列显示两版审核意见和附件）",
              "整改任务项：点击'查看整改后报工'跳转回工单详情（此时工单版本为整改后重新报工的新版本）",
              "审计日志导出：点击导出按钮，按当前筛选条件导出为Excel或PDF",
              "批注：在核验分区支持文本批注（如标记某物料异常），批注内容自动带入审核意见"
            ],
            "dataInputs": [
              "工单ID（从列表页传递）",
              "工单报工详情数据（GET /api/workOrders/{workOrderId}/reportDetail）",
              "维保标准参考数据（可选：GET /api/maintenanceStandards?equipmentId=）",
              "当前用户身份与权限",
              "设备维保记录更新接口（POST /api/workOrders/{workOrderId}/approve 和 reject）",
              "整改任务数据（GET /api/workOrders/{workOrderId}/reworkTasks）",
              "审核日志数据（GET /api/workOrders/{workOrderId}/auditLogs）"
            ]
          }
        ],
        "navigation": [
          {
            "label": "工单审核跟踪",
            "target": "WorkOrderAuditList.vue",
            "default": true
          }
        ],
        "fileStructure": {
          "views": [
            "WorkOrderAuditList.vue",
            "WorkOrderAuditDetail.vue"
          ],
          "components": [
            "StatusTag.vue",
            "DataTable.vue",
            "FilterBar.vue",
            "MediaPreview.vue",
            "AuditActionModal.vue",
            "AuditHistoryCompare.vue",
            "ReworkTaskPanel.vue",
            "AuditLogSearch.vue"
          ],
          "data": [
            "mockWorkOrders.js",
            "mockWorkOrderDetail.js",
            "mockShips.js",
            "mockEquipmentTree.js",
            "mockAuditLogs.js",
            "mockReworkTasks.js",
            "mockMaintenanceStandards.js"
          ]
        }
      },
      "sc-4": {
        "pages": [
          {
            "key": "page-sc4-1",
            "priority": "P0",
            "type": "工作台页",
            "name": "船舶运行监控总览",
            "vueFile": "ShipMonitoringOverview.vue",
            "goal": "提供所有在管船舶的实时位置、航速、作业状态和通信连接状态的整体视图，支持列表和地图两种展示方式，便于船舶管理人员快速掌握全局态势。",
            "features": [
              "船舶实时监控总览"
            ],
            "sections": [
              "地图视图区",
              "列表视图区",
              "状态筛选栏",
              "船舶状态统计卡片"
            ],
            "states": [
              "正常态（有船舶数据）",
              "空态（无船舶数据）",
              "加载态（轮询中）",
              "异常态（API失败）"
            ],
            "keyInteractions": [
              "点击地图/列表视图切换按钮切换展示方式",
              "在地图上点击船舶标记显示船舶信息浮窗，点击浮窗跳转至单船详情页",
              "在列表视图中点击行跳转至单船详情页",
              "使用筛选栏按名称、状态、航线过滤船舶列表",
              "船舶状态颜色标识（绿色在线、黄色弱网、灰色离线）",
              "页面自动轮询（每10秒）或WebSocket接收实时数据更新"
            ],
            "dataInputs": [
              "GET /api/vessels/status 返回船舶状态列表（含实时位置、航速、作业状态、通信状态）",
              "地图加载所需的底图数据（默认使用天地图或离线瓦片）",
              "筛选条件（船舶名称、航线、作业状态、通信状态）"
            ]
          },
          {
            "key": "page-sc4-2",
            "priority": "P0",
            "type": "看板页",
            "name": "单船运行详情看板",
            "vueFile": "ShipDetailBoard.vue",
            "goal": "展示选定船舶的详细运行信息，包括当前航次、工单执行进度、航前健康校验结果以及船员证书有效期预警，并提供健康校验问题处置功能。",
            "features": [
              "单船运行详情看板",
              "航前健康校验问题处置"
            ],
            "sections": [
              "航次信息区域（航次号、出发/目的港、计划时间）",
              "工单执行进度区域（统计卡片+工单列表）",
              "航前健康校验结果区域（校验项列表，每项通过/不通过状态及操作按钮）",
              "船员证书有效期预警区域（过期/即将到期证书列表）",
              "问题处置面板（点击“转处置”或“豁免”弹出的对话框/侧面板）"
            ],
            "states": [
              "正常态（数据完整）",
              "加载态",
              "空态（船舶无航次/工单）",
              "异常态（API失败）",
              "部分不通过态（健康校验有不通过项）"
            ],
            "keyInteractions": [
              "点击健康校验项列表中的不通过项，可展开查看详情（关联工单、物资、证书），并出现“转处置”按钮",
              "点击“转处置”弹出选择责任角色对话框，选择后确认，系统创建处置工单并关闭对话框",
              "点击“申请豁免”弹出豁免表单（理由、有效期），提交后状态更新为“豁免待审批”",
              "点击证书预警列表中的证书可查看持有人和到期时间",
              "页面顶部提供返回总览和“下发调度指令”按钮（跳转至DispatchCommandEditor页面）",
              "工单列表支持点击查看详情（跳转至PMS工单详情页）"
            ],
            "dataInputs": [
              "路径参数：船舶ID",
              "GET /api/vessels/{id}/detail 返回航次、工单列表、健康校验结果",
              "GET /api/vessels/{id}/health-check 返回健康校验项列表",
              "GET /api/vessels/{id}/certificates 返回船员证书预警列表",
              "POST /api/health-check/{id}/resolve 转处置请求体（问题ID，责任角色）",
              "POST /api/health-check/{id}/exemption 豁免请求体（理由，有效期）"
            ]
          },
          {
            "key": "page-sc4-3",
            "priority": "P0",
            "type": "工作台页",
            "name": "调度指令编辑与下发",
            "vueFile": "DispatchCommandEditor.vue",
            "goal": "船舶管理人员在确认船舶健康校验通过（或豁免后）后，编辑调度指令并下发至船端，跟踪指令执行进度直至闭环。",
            "features": [
              "调度指令编辑与下发"
            ],
            "sections": [
              "指令编辑表单区域（航次任务、出发/预计到达时间、航线选择、任务要求）",
              "指令状态跟踪区域（当前指令状态时间线，显示已下发/已接收/执行中/已完成/已闭环）",
              "历史指令列表区域（最近下发的指令，方便查看）"
            ],
            "states": [
              "正常态（可编辑下发）",
              "已下发待确认态",
              "执行中态",
              "已完成态",
              "空态（无历史指令）",
              "异常态（下发失败）"
            ],
            "keyInteractions": [
              "选择船舶（通过下拉选择器，支持从总览页传入船舶ID）",
              "填写指令表单，点击“下发调度指令”，系统弹出确认对话框，确认后调用API下发",
              "下发成功后，状态跟踪区域自动刷新，显示最新状态",
              "点击“刷新”按钮手动获取最新指令状态",
              "船端确认后，状态自动更新（轮询或WebSocket）",
              "指令完成后，管理员可点击“确认闭环”按钮，记录闭环结果",
              "若超时未确认，系统显示告警提示并提供“重新通知”按钮"
            ],
            "dataInputs": [
              "船舶ID（从上游页面传入或选择）",
              "GET /api/dispatch-commands/{id}/status 获取指令状态",
              "GET /api/vessels/{id}/routes 获取预定义航线列表",
              "POST /api/dispatch-commands 创建并下发指令请求体（船舶ID，航次号，出发时间，预计到达时间，航线，任务要求）",
              "POST /api/dispatch-commands/{id}/close 确认闭环请求体（执行结果描述，附件）"
            ]
          }
        ],
        "navigation": [
          {
            "label": "船舶运行监控",
            "target": "ShipMonitoringOverview.vue",
            "default": true
          }
        ],
        "fileStructure": {
          "views": [
            "ShipMonitoringOverview.vue",
            "ShipDetailBoard.vue",
            "DispatchCommandEditor.vue"
          ],
          "components": [
            "MapComponent.vue",
            "VesselStatusCard.vue",
            "FilterBar.vue",
            "VesselList.vue",
            "VoyageInfoPanel.vue",
            "WorkOrderProgress.vue",
            "HealthCheckList.vue",
            "CertificateAlertList.vue",
            "IssueResolveDialog.vue",
            "ExemptionForm.vue",
            "DispatchForm.vue",
            "CommandTimeline.vue",
            "HistoryCommandList.vue"
          ],
          "data": [
            "scenarioMockData.js"
          ]
        }
      },
      "sc-5": {
        "pages": [
          {
            "key": "page-1",
            "priority": "P0",
            "type": "工作台页",
            "name": "船岸同步状态总览仪表板",
            "vueFile": "DataSyncManager.vue",
            "goal": "提供所有已注册船舶的同步概览，快速识别异常船舶并导航至详细处理。",
            "features": [
              "船岸同步状态总览仪表板"
            ],
            "sections": [
              "顶部筛选栏：按同步状态（正常/异常/未同步）快捷筛选，支持高亮异常船舶优先排序",
              "船舶概览卡片区：每艘船一张卡片，展示船名、通信状态、最近同步时间、待同步数据包数量、冲突数、失败数",
              "全局操作栏：手动触发全量船舶同步状态刷新按钮，刷新拉取各船最新同步心跳",
              "快速跳转入口：点击船舶卡片可一键跳转至该船舶的同步任务详细列表页（SyncTaskList.vue）"
            ],
            "states": [
              "正常态：至少有一艘船舶且数据正常显示",
              "空态：无已注册船舶时显示空白提示并引导注册",
              "加载态：首次加载或手动刷新时显示骨架屏及进度指示",
              "异常态：拉取心跳超时或后端返回错误时显示错误提示及重试按钮"
            ],
            "keyInteractions": [
              "点击船舶卡片跳转至同步任务列表（附带船舶ID参数）",
              "点击刷新按钮调取全量心跳接口并更新所有卡片状态",
              "筛选下拉切换时重新请求并渲染船舶卡片列表"
            ],
            "dataInputs": [
              "GET /api/v1/sync/shipments/summary 返回船舶列表及同步概览",
              "GET /api/v1/sync/shipments/{shipId}/heartbeat 返回单船最新心跳（手动刷新时逐个调用）"
            ]
          },
          {
            "key": "page-2",
            "priority": "P0",
            "type": "列表页",
            "name": "同步任务详细列表与多维度筛选",
            "vueFile": "SyncTaskList.vue",
            "goal": "展示选定船舶或全部船舶的同步任务明细，支持多条件筛选、批量操作，并提供冲突与失败任务的快捷入口。",
            "features": [
              "同步任务详细列表与多维度筛选"
            ],
            "sections": [
              "顶部筛选区：按船舶下拉选择（含全部）、数据类型（工单报工/盘点结果/附件图片）、状态（待上传/上传中/已同步/冲突/失败）、时间范围选择器",
              "快捷标签页：“全部任务”、“冲突任务”、“失败任务”三个标签，一键切换聚焦待处理条目",
              "任务列表主体：表格或列表形式，每行展示数据类型、创建时间、来源终端、船端版本号、数据包大小、当前状态，支持多选",
              "批量操作栏：勾选后出现“重新同步”、“标记忽略”、“查看详情”等按钮（冲突/失败任务不可批量忽略）"
            ],
            "states": [
              "正常态：有任务数据并正确展示",
              "空态：无同步任务时显示“暂无同步任务”并展示业务建议",
              "加载态：初始加载或筛选切换时显示加载动画",
              "异常态：接口失败时显示错误提示并允许重试"
            ],
            "keyInteractions": [
              "切换快捷标签页时自动更新列表数据并重置筛选条件（除船舶外）",
              "勾选任务后根据选中任务的状态动态显示可用的批量操作按钮",
              "点击单条任务可跳转至同步任务详情页（SyncTaskDetail.vue）或弹窗查看详情",
              "输入时间范围后自动触发查询（含防抖）"
            ],
            "dataInputs": [
              "GET /api/v1/sync/tasks?shipId={}&type={}&status={}&startTime={}&endTime={} 分页查询",
              "POST /api/v1/sync/tasks/batch-retry 批量重试（需传递任务ID数组）",
              "POST /api/v1/sync/tasks/batch-ignore 批量忽略（需传递任务ID数组及备注）"
            ]
          },
          {
            "key": "page-3",
            "priority": "P0",
            "type": "详情页",
            "name": "同步任务详情（冲突解决与失败重试）",
            "vueFile": "SyncTaskDetail.vue",
            "goal": "针对冲突或失败的任务，提供差异对比、逐字段合并、重试或忽略操作，并记录审计日志。",
            "features": [
              "数据冲突差异对比与解决面板",
              "同步失败任务重试与忽略处理"
            ],
            "sections": [
              "任务基本信息区：任务ID、数据类型、来源船舶、创建时间、当前状态、错误原因（如失败）",
              "冲突解决面板（仅当状态为冲突时显示）：并排对比船端版本与岸端版本，差异字段高亮，每行提供单选按钮（采用船端/采用岸端/手动编辑），以及快捷操作按钮“全部采用船端版本”或“全部采用岸端版本”，底部提交解决按钮",
              "失败处理面板（仅当状态为失败时显示）：显示失败原因详情和错误码，提供“重新同步”按钮和“忽略”按钮（点击忽略弹出备注输入框，确认后提交）",
              "操作记录区：展示该任务的历史操作日志（包括自动同步、重试、冲突解决、忽略等），支持审计追溯"
            ],
            "states": [
              "正常态：任务状态为冲突或失败，对应面板可见且可编辑",
              "空态：任务状态正常（如已同步）时显示“无需处理”提示",
              "加载态：获取冲突差异或失败详情时显示加载状态",
              "异常态：接口报错时显示错误提示并允许重试"
            ],
            "keyInteractions": [
              "在冲突面板中逐字段选择版本后，系统实时计算最终合并结果并高亮显示未处理的差异字段",
              "点击“全部采用船端版本”或“全部采用岸端版本”快速填充所有字段选择",
              "提交冲突解决时调用POST /api/v1/sync/conflicts/{conflictId}/resolve，成功后刷新任务状态并更新操作记录",
              "点击“重新同步”调用POST /api/v1/sync/tasks/{taskId}/retry，并跟踪重试状态",
              "点击“忽略”弹出二次确认模态框，强制填写备注，提交后调用POST /api/v1/sync/tasks/batch-ignore（单个任务）",
              "若任务失败次数超过3次，重新同步按钮置灰并提示“建议联系船端排查”"
            ],
            "dataInputs": [
              "GET /api/v1/sync/conflicts/{conflictId}/diff 获取冲突差异详情",
              "POST /api/v1/sync/conflicts/{conflictId}/resolve 提交解决结果（包含合并后数据快照）",
              "POST /api/v1/sync/tasks/{taskId}/retry 重试单个任务",
              "POST /api/v1/sync/tasks/{taskId}/ignore 忽略单个任务（需备注）"
            ]
          },
          {
            "key": "page-4",
            "priority": "P1",
            "type": "看板页",
            "name": "同步历史报告与审计日志",
            "vueFile": "SyncReport.vue",
            "goal": "检索同步历史记录，生成同步健康度报告并导出，支撑合规审计。",
            "features": [
              "同步历史报告与审计日志查询"
            ],
            "sections": [
              "筛选区：船舶下拉、日期范围、操作类型（自动同步/人工重试/冲突解决/忽略）",
              "审计日志列表：表格展示船舶、操作时间、操作人员、操作描述、处理结果，支持分页",
              "统计看板区：显示指定周期内的同步成功率、平均延迟、冲突率、未处理量，以卡片或图表展示",
              "导出操作栏：提供“导出PDF”和“导出CSV”按钮，点击后生成报告并下载"
            ],
            "states": [
              "正常态：有日志数据并正确展示统计图表",
              "空态：无日志时显示“暂无同步历史记录”",
              "加载态：筛选条件变化时整体刷新加载",
              "异常态：接口失败时显示错误提示"
            ],
            "keyInteractions": [
              "切换筛选条件后自动重新加载审计日志列表和统计看板数据",
              "点击导出按钮调取导出接口，根据用户权限验证（审计员或管理员）后下载文件",
              "点击日志列表中某条记录可展开详情（如冲突解决的具体内容）"
            ],
            "dataInputs": [
              "GET /api/v1/sync/report?shipId={}&startTime={}&endTime={} 获取统计报告",
              "GET /api/v1/sync/audit-log?shipId={}&operator={}&action={}&page={} 分页查询审计日志",
              "GET /api/v1/sync/report/export?shipId={}&startTime={}&endTime={}&format=pdf 导出报告"
            ]
          }
        ],
        "navigation": [
          {
            "label": "船岸同步状态总览",
            "target": "DataSyncManager.vue",
            "default": true
          },
          {
            "label": "同步任务列表",
            "target": "SyncTaskList.vue",
            "default": false
          },
          {
            "label": "同步任务详情",
            "target": "SyncTaskDetail.vue",
            "default": false
          },
          {
            "label": "同步历史报告",
            "target": "SyncReport.vue",
            "default": false
          }
        ],
        "fileStructure": {
          "views": [
            "DataSyncManager.vue",
            "SyncTaskList.vue",
            "SyncTaskDetail.vue",
            "SyncReport.vue"
          ],
          "components": [
            "StatusTag.vue",
            "DataTable.vue",
            "ConflictDiffView.vue",
            "FilterBar.vue",
            "StatsCard.vue",
            "ExportButton.vue"
          ],
          "data": [
            "scenarioMockData.js"
          ]
        }
      },
      "sc-6": {
        "pages": [
          {
            "key": "page-1",
            "priority": "P0",
            "type": "列表页",
            "name": "待执行工单离线列表",
            "vueFile": "MobileWorkOrderList.vue",
            "goal": "在弱网/无网环境下，通过本地缓存加载当前船端一线作业人员待执行的工单列表，支持筛选和排序，点击进入详情。",
            "features": [
              "待执行工单离线列表"
            ],
            "sections": [
              "顶部状态栏：网络状态图标、当前用户、未同步数量提示",
              "筛选区：设备类型下拉、状态（待执行/执行中）筛选、优先级筛选、日期排序切换",
              "工单列表区：卡片式展示工单编号、设备名称、位置、优先级、计划日期、状态标签，支持上拉加载更多",
              "空态提示：无待执行工单时显示“暂无待执行工单”和刷新按钮"
            ],
            "states": [
              "正常态：列表加载完成，有数据",
              "空态：本地缓存无数据",
              "加载态：首次打开或下拉刷新时显示加载动画",
              "异常态：网络请求失败或本地数据库读取错误，显示错误提示及重试按钮"
            ],
            "keyInteractions": [
              "进入页面时自动检测网络状态，若网络可用则请求服务器并同步本地缓存",
              "点击工单卡片跳转至工单详情页（MobileWorkOrderDetail.vue）",
              "下拉刷新：强制从服务器拉取最新数据（网络可用时），更新本地缓存",
              "筛选条件变更后实时过滤列表"
            ],
            "dataInputs": [
              "工单列表数据：工单ID、设备名称、设备位置、优先级、计划日期、状态、简要描述、附件URL列表",
              "筛选参数：设备类型、优先级、状态",
              "离线缓存策略：本地SQLite中存储的最新工单列表"
            ]
          },
          {
            "key": "page-2",
            "priority": "P0",
            "type": "详情页",
            "name": "工单详情与维保指引查看",
            "vueFile": "MobileWorkOrderDetail.vue",
            "goal": "离线展示工单完整详情，包括设备信息、维保操作步骤、物料清单、安全注意事项，支持附件本地查看，引导作业人员按规程执行。",
            "features": [
              "工单详情与维保指引查看"
            ],
            "sections": [
              "顶部导航栏：返回按钮、工单编号、状态标签",
              "设备信息区：设备名称、型号、位置、维保类型、设备资产树路径",
              "维保步骤区：按顺序显示步骤列表，每步含序号、操作描述、所需工具/物料、安全提示，支持勾选已完成步骤",
              "物料清单区：备件表格（名称、型号、计划用量、实际库存位置），可标记“已领用”",
              "附件区：已下载的图纸、手册缩略图列表，点击可打开查看（支持缩放旋转）",
              "底部操作栏：“开始执行”按钮（进入执行页）、“查看安全注意事项”浮层入口"
            ],
            "states": [
              "正常态：工单数据加载完成，步骤未勾选",
              "部分完成态：部分步骤已勾选（本地持久化），断点续执",
              "全完成态：所有步骤勾选（可进入执行页提交报工）",
              "加载态：首次从列表页跳转时从本地缓存读取",
              "异常态：工单数据加载失败（本地缓存损坏），提示重新进入列表页刷新"
            ],
            "keyInteractions": [
              "点击步骤勾选框切换完成状态，实时持久化至本地SQLite",
              "点击“开始执行”按钮跳转至维保执行与报工录入页（MobileWorkOrderExecute.vue），携带工单ID",
              "点击附件缩略图打开本地文件，支持PDF分页、图片缩放旋转",
              "长按物料行可标记已领用（变更状态）"
            ],
            "dataInputs": [
              "工单详情：工单ID、设备名称、型号、位置、维保类型、设备资产树路径",
              "维保步骤列表：步骤ID、序号、描述、所需工具、安全提示、物料关联ID",
              "物料清单：备件编码、名称、计划数量、库存可用量、位置",
              "附件列表：文件类型、本地缓存路径、文件大小"
            ]
          },
          {
            "key": "page-3",
            "priority": "P0",
            "type": "表单页",
            "name": "维保执行与报工录入",
            "vueFile": "MobileWorkOrderExecute.vue",
            "goal": "引导作业人员按步骤执行维保操作，填写实际工时、消耗物料、异常情况，并通过拍照/录像现场留痕，最后提交报工数据，所有数据在离线状态下暂存本地。",
            "features": [
              "维保执行与报工录入"
            ],
            "sections": [
              "顶部导航栏：返回按钮、工单编号、当前步骤进度（如3/8）",
              "步骤执行区：当前步骤卡片（显示序号、操作描述），实际开始/结束时间输入（默认当前时间，可修改），执行人选择（预设本人），异常备注文本输入",
              "物料消耗区：从物料清单中选择实际消耗的备件（含数量输入），支持追加领用（搜索新增物料）",
              "多媒体留痕区：拍照/录像按钮，已拍摄的缩略图列表，支持预览和删除，每个媒体可关联至当前步骤",
              "提交报工按钮：位于底部，点击后校验必填项（步骤完成、异常说明），通过后存储至本地SQLite并标记工单为“待同步”",
              "空间不足提示：当本地存储低于阈值时弹窗"
            ],
            "states": [
              "正常执行态：首次进入，无历史数据",
              "断点续执态：部分步骤已完成（从详情页勾选继承），继续填写当前步骤",
              "提交成功态：报工数据本地存储成功，显示“报工已保存”提示",
              "校验失败态：必填项未填时按钮禁用并提示",
              "存储空间不足态：弹窗警告，引导清理"
            ],
            "keyInteractions": [
              "按步骤顺序引导，每完成一步自动进入下一步（或点击顶部进度条跳转）",
              "点击拍照/录像按钮调用系统相机，拍摄后图片/视频自动添加至当前步骤",
              "提交报工时执行本地校验，通过后将整个报工数据打包存入本地SQLite，工单状态置为“待同步”",
              "若同一工单多次提交，本地覆盖上次缓存（保留历史版本用于冲突解决）",
              "当存储空间低于阈值时弹窗提示清理已同步数据"
            ],
            "dataInputs": [
              "工单ID、当前步骤ID、步骤序列（来自工单详情）",
              "实际开始时间、实际结束时间（DateTime）",
              "执行人（默认当前用户）",
              "异常备注（文本）",
              "消耗物料列表（备件编码、数量）",
              "多媒体文件列表（本地路径、文件哈希、关联步骤ID）",
              "提交报工时间（自动生成）"
            ]
          },
          {
            "key": "page-4",
            "priority": "P0",
            "type": "设置/管理页",
            "name": "离线缓存与自动同步管理",
            "vueFile": "MobileSyncStatus.vue",
            "goal": "展示同步队列状态、冲突列表，允许用户手动触发同步、查看同步日志、管理本地缓存空间。",
            "features": [
              "离线缓存与自动同步"
            ],
            "sections": [
              "同步概览区：网络状态、待同步工单数、上次同步时间、存储使用量",
              "同步队列区：表格展示每项工单的同步状态（待同步/同步中/已完成/失败）、重试次数、提交时间",
              "冲突列表区：若有冲突，展示工单ID、差异对比（岸端版本 vs 本地版本）、解决状态，提供“使用本地”、“使用岸端”、“标记待岸基处理”操作",
              "手动触发按钮：强制同步所有待同步工单",
              "缓存管理区：清理已同步数据、清理全部缓存（含附件）"
            ],
            "states": [
              "正常态：已同步且无冲突",
              "待同步态：有未同步数据，显示待同步数量",
              "同步中态：显示进度条或百分比",
              "冲突态：显示冲突列表，需人工干预",
              "错误态：同步失败超过重试次数，显示失败原因"
            ],
            "keyInteractions": [
              "点击手动同步按钮触发后台同步任务，过程中显示进度",
              "点击冲突项展开差异对比，选择解决策略",
              "点击清理按钮删除已同步数据和附件（保留日志30天）",
              "自动同步时更新状态标签和队列显示"
            ],
            "dataInputs": [
              "同步队列列表：工单ID、报文JSON、附件列表、本地版本号、同步状态、重试次数",
              "冲突记录：工单ID、岸端版本字段差异、本地版本字段差异、解决状态",
              "存储空间用量：总容量、已使用、可清理空间"
            ]
          }
        ],
        "navigation": [
          {
            "label": "待执行工单",
            "target": "MobileWorkOrderList.vue",
            "default": true
          },
          {
            "label": "同步管理",
            "target": "MobileSyncStatus.vue",
            "default": false
          }
        ],
        "fileStructure": {
          "views": [
            "MobileWorkOrderList.vue",
            "MobileWorkOrderDetail.vue",
            "MobileWorkOrderExecute.vue",
            "MobileSyncStatus.vue"
          ],
          "components": [
            "StatusTag.vue",
            "WorkOrderCard.vue",
            "StepItem.vue",
            "MaterialSelector.vue",
            "MediaCapture.vue",
            "SyncQueueItem.vue",
            "ConflictResolver.vue",
            "EmptyState.vue",
            "LoadingSpinner.vue",
            "ErrorHint.vue"
          ],
          "data": [
            "scenarioMockData.js"
          ]
        }
      },
      "sc-7": {
        "pages": [
          {
            "key": "page-1",
            "priority": "P1",
            "type": "工作台页",
            "name": "物资盘点领用工作台",
            "vueFile": "InventoryWorkbench.vue",
            "goal": "展示待处理盘点任务、领料提示、退料记录及网络状态，提供快速导航到扫描盘点、领料、退料和同步管理页面的入口，并显示同步概览。",
            "features": [
              "离线库存与待处理任务加载",
              "离线数据同步与状态管理"
            ],
            "sections": [
              "网络状态指示区：显示在线/弱网/离线状态图标及本地数据版本",
              "待办任务卡片区：按任务类型（盘点/领料/退料）分组展示待处理条目，含数量标识",
              "快捷操作栏：三个按钮（扫描盘点、领料、退料）跳转至对应页面",
              "同步进度概览区：显示待同步条数、上次同步时间、手动同步按钮",
              "最近操作记录区：最近5条本地操作摘要（类型、物料、时间、状态）"
            ],
            "states": [
              "正常态：有网络且有待办任务，本地数据最新",
              "空态：无待办任务，显示鼓励提示（“暂无待办任务，您可以手动盘点或领料”）",
              "加载态：首次加载本地缓存时显示加载骨架屏",
              "异常态：本地缓存加载失败，显示错误提示并提供重试按钮"
            ],
            "keyInteractions": [
              "点击待办任务卡片跳转到对应操作页并预填任务ID",
              "点击同步按钮触发全局同步（在线时）",
              "下拉刷新重新加载本地缓存（先检测版本，版本不一致则提示在线同步）"
            ],
            "dataInputs": [
              "本地缓存的待执行盘点任务列表",
              "本地缓存的关联工单列表（待领料）",
              "本地缓存的退料记录摘要",
              "本地数据版本号",
              "网络状态枚举（online/weak/offline）",
              "同步队列统计（待同步条数、失败条数）"
            ]
          },
          {
            "key": "page-2",
            "priority": "P0",
            "type": "详情页",
            "name": "条码扫描盘点",
            "vueFile": "BarcodeScanInventory.vue",
            "goal": "通过摄像头扫描条码识别物料，录入实物数量并对比系统库存，支持拍照留痕，生成盘点差异记录。",
            "features": [
              "条码扫描盘点"
            ],
            "sections": [
              "扫描预览区：全屏摄像头取景框，支持手动输入条码",
              "物料信息展示区：识别成功后显示物料编码、名称、图例、系统库存数量",
              "实物录入区：数字输入框填写实物数量，自动计算差异并显示盘盈/盘亏/一致标识",
              "证据附件区：拍照/视频按钮，已拍缩略图列表，支持删除重拍",
              "操作按钮区：提交盘点 / 重置 / 继续扫描（批量模式）"
            ],
            "states": [
              "正常态：摄像头可用，扫描成功显示物料信息",
              "空态：无扫描操作，展示示例提示“请对准条码”",
              "加载态：识别中显示加载动画",
              "异常态：条码无法识别或本地未找到物料，显示“未知物料”提示并提供手动录入入口"
            ],
            "keyInteractions": [
              "摄像头实时扫描，识别成功后自动加载物料信息",
              "数量录入后实时计算差异并变更标识颜色",
              "点击拍照按钮调用系统相机，照片压缩后存入本地",
              "提交后本地生成盘点差异记录，并返回工作台更新待办列表"
            ],
            "dataInputs": [
              "条码字符串",
              "系统库存数量（本地缓存）",
              "实物清点数量",
              "照片/视频文件（Base64或本地路径）",
              "盘点任务ID（从工作台传入）",
              "用户ID（登录态）"
            ]
          },
          {
            "key": "page-3",
            "priority": "P0",
            "type": "详情页",
            "name": "物资领用",
            "vueFile": "MaterialRequisition.vue",
            "goal": "扫描或搜索物料，校验库存，填写领用信息并关联工单，提交后扣减本地库存生成待同步领料单。",
            "features": [
              "物资领用管理"
            ],
            "sections": [
              "物料选择区：顶部搜索框 + 条码扫描入口，下方展示物料卡片（编码、名称、库存量、阈值）",
              "领用详情表单区：领用数量输入框、用途说明文本域、关联工单下拉选择（从本地工单列表）",
              "缺件预警提示区：当领用数量超过库存时，显示红色预警并自动生成缺件申请单（可补充紧急度说明）",
              "操作按钮区：提交领料 / 取消 / 添加到领料单（允许一次领多种物料？本设计单次单一物料，可多次操作）"
            ],
            "states": [
              "正常态：物料已选择，库存充足，表单有效",
              "空态：未选择物料时显示提示“请扫描或搜索物料”",
              "加载态：搜索物料或加载工单列表时显示加载指示",
              "异常态：校验不通过（如数量超库存、工单无效）显示错误提示并阻止提交"
            ],
            "keyInteractions": [
              "扫描条码自动填充物料并加载库存数据",
              "手动输入数量后实时校验并触发缺件预警",
              "从工单列表选择关联工单（支持搜索过滤）",
              "提交后本地扣减库存，生成领料记录并跳转回工作台"
            ],
            "dataInputs": [
              "物料编码（手动或扫描）",
              "领用数量",
              "用途说明",
              "关联工单号（可选）",
              "库存可用量（本地缓存）",
              "缺件预警阈值（本地缓存）",
              "本地待处理工单列表",
              "用户ID"
            ]
          },
          {
            "key": "page-4",
            "priority": "P0",
            "type": "详情页",
            "name": "退料管理",
            "vueFile": "MaterialReturn.vue",
            "goal": "扫描退料条码，选择退料原因并校验数量，提交后增加本地库存生成待同步退料单。",
            "features": [
              "退料管理"
            ],
            "sections": [
              "物料选择区：条码扫描入口 + 手动输入物料编码",
              "退料信息展示区：展示物料名称、编码、最近领用记录摘要（领料单号、数量、日期）",
              "退料表单区：退料数量输入框、退料原因下拉选择（工单剩余/物料质量问题/误领等）、备注文本域",
              "校验结果区：自动显示最大可退量，若超量显示红色拦截提示",
              "证据附件区（仅限质量问题）：拍照按钮，与盘点复用拍照功能",
              "操作按钮区：提交退料 / 取消"
            ],
            "states": [
              "正常态：物料已选择，退料数量合法，可提交",
              "空态：未选择物料时提示",
              "加载态：加载领用记录时显示加载",
              "异常态：退料超过可退量时直接拦截，显示提示并禁用提交"
            ],
            "keyInteractions": [
              "扫描条码自动填充物料并加载最近领用记录",
              "输入数量时实时校验最大可退量",
              "原因选择“物料质量问题”时显示拍照入口",
              "提交后本地增加库存，生成退料记录并返回工作台"
            ],
            "dataInputs": [
              "物料编码",
              "退料数量",
              "退料原因枚举",
              "备注",
              "历史领用记录（物料维度最近5条）",
              "已退总量（本地计算）",
              "照片（质量问题）",
              "用户ID"
            ]
          },
          {
            "key": "page-5",
            "priority": "P0",
            "type": "列表页",
            "name": "数据同步管理",
            "vueFile": "DataSyncDetail.vue",
            "goal": "详细查看同步队列，管理同步进度、处理冲突和失败重试。",
            "features": [
              "离线数据同步与状态管理"
            ],
            "sections": [
              "同步状态总览区：显示待同步/同步中/成功/失败的条数统计及进度条",
              "同步队列列表区：按时间倒序展示每条待同步/已同步记录（数据类型、物料名称、操作类型、操作时间、状态标识）",
              "同步失败/冲突处理区：专门展示失败和冲突项，每条提供重试按钮或冲突对比视图（本地 vs 岸端）",
              "手动操作区：全局同步按钮（在线时）、清除成功记录按钮、历史同步日志入口"
            ],
            "states": [
              "正常态：有同步记录，同步队列展示正常",
              "空态：无待同步记录，显示“所有数据已同步”",
              "加载态：加载同步列表时显示骨架屏",
              "异常态：网络异常无法同步时，显示提示并禁用自动同步"
            ],
            "keyInteractions": [
              "点击单项重试按钮重新上传该条数据",
              "冲突项点击后展开对比视图，选择“保留本地”或“采用岸端”",
              "长按单项查看详情（原始数据JSON）",
              "下拉刷新手动检查岸端同步状态"
            ],
            "dataInputs": [
              "待同步队列（数据类型、内容JSON、本地时间、重试次数、附件列表）",
              "岸端同步结果反馈（成功/失败原因/冲突详情）",
              "冲突数据对比视图（本地版本、岸端版本、差异字段）",
              "网络状态"
            ]
          }
        ],
        "navigation": [
          {
            "label": "物资工作台",
            "target": "InventoryWorkbench.vue",
            "default": true
          },
          {
            "label": "扫描盘点",
            "target": "BarcodeScanInventory.vue",
            "default": false
          },
          {
            "label": "物资领用",
            "target": "MaterialRequisition.vue",
            "default": false
          },
          {
            "label": "退料管理",
            "target": "MaterialReturn.vue",
            "default": false
          },
          {
            "label": "数据同步",
            "target": "DataSyncDetail.vue",
            "default": false
          }
        ],
        "fileStructure": {
          "views": [
            "InventoryWorkbench.vue",
            "BarcodeScanInventory.vue",
            "MaterialRequisition.vue",
            "MaterialReturn.vue",
            "DataSyncDetail.vue"
          ],
          "components": [
            "NetworkStatusBar.vue",
            "ScanPreview.vue",
            "MaterialCard.vue",
            "SyncProgressBar.vue",
            "ConflictResolver.vue",
            "PhotoAttachment.vue",
            "TodoTaskCard.vue"
          ],
          "data": [
            "scenarioMockData.js"
          ]
        }
      },
      "sc-8": {
        "pages": [
          {
            "key": "page-1",
            "priority": "P0",
            "type": "列表页",
            "name": "用户管理",
            "vueFile": "UserManager.vue",
            "goal": "系统管理员对系统用户进行增删改查、批量导入导出、启用/禁用及角色分配操作，覆盖用户全生命周期管理。",
            "features": [
              "用户管理"
            ],
            "sections": [
              "顶部筛选栏（部门、角色、状态、搜索框）",
              "操作按钮区（新建用户、批量导入、批量导出）",
              "用户列表表格（账号、姓名、部门、角色、状态、操作列）",
              "分页控件",
              "新建/编辑用户弹窗（表单：账号、姓名、部门、联系方式、角色分配）",
              "批量导入弹窗（上传CSV、预览、确认）"
            ],
            "states": [
              "正常态：展示用户列表，数据不少于1条",
              "空态：无用户时显示引导创建提示",
              "加载态：骨架屏或加载动画",
              "异常态：接口超时或错误时显示错误提示与重试按钮"
            ],
            "keyInteractions": [
              "点击“新建用户”弹出创建表单弹窗，填写后保存并刷新列表",
              "点击表格行操作列“编辑”弹出编辑表单弹窗，修改后保存",
              "点击“启用/禁用”按钮，二次确认后切换用户状态并更新列表",
              "支持按住Shift多选用户后点击“批量导入”",
              "点击“导出”下载CSV文件",
              "点击搜索按钮触发按部门/角色/状态/关键词过滤"
            ],
            "dataInputs": [
              "用户列表查询参数（部门ID、角色ID、状态、关键词、分页）",
              "新建/编辑用户表单字段（账号、姓名、部门ID、联系方式、角色ID列表）",
              "批量导入文件（CSV格式，含用户信息字段）"
            ]
          },
          {
            "key": "page-2",
            "priority": "P0",
            "type": "列表页",
            "name": "角色与权限管理",
            "vueFile": "RolePermissionManager.vue",
            "goal": "系统管理员自定义角色，按模块精细配置功能菜单和操作权限，支持复制角色快速创建。",
            "features": [
              "角色与权限管理"
            ],
            "sections": [
              "角色列表左面板（角色名称、关联用户数、操作按钮）",
              "角色详情右面板（角色基本信息、权限树、操作按钮）",
              "顶部工具栏（新建角色、复制角色、删除角色）",
              "权限树组件（模块展开勾选操作权限）"
            ],
            "states": [
              "正常态：左面板显示角色列表，右面板显示选中角色详情",
              "空态：无角色时显示提示创建",
              "加载态：角色列表加载中",
              "异常态：权限树加载失败提示"
            ],
            "keyInteractions": [
              "点击左面板角色项，右面板切换显示该角色的权限配置",
              "点击“新建角色”填写名称和描述，保存后刷新左面板",
              "点击“复制角色”选择源角色，生成新角色副本",
              "在权限树勾选模块和操作权限（查看、新增、编辑、删除、审核），自动保存",
              "删除角色前检查引用，存在引用则弹框提示禁止删除"
            ],
            "dataInputs": [
              "角色列表查询（无参）",
              "权限树数据（模块列表+操作类型）",
              "创建/编辑角色表单（名称、描述、权限树选中项）",
              "复制角色参数（源角色ID）"
            ]
          },
          {
            "key": "page-3",
            "priority": "P0",
            "type": "工作台页",
            "name": "流程定义",
            "vueFile": "WorkflowDesigner.vue",
            "goal": "系统管理员通过可视化拖拽设计器配置审批流程、工单流转节点，定义节点、审批人、条件分支、超时及转交策略。",
            "features": [
              "流程定义"
            ],
            "sections": [
              "流程类型选择/列表区域",
              "流程设计画布（拖拽节点、连接线）",
              "节点属性面板（审批人、超时规则、转交策略）",
              "顶部操作栏（保存、发布、版本管理）",
              "已发布流程概览视图"
            ],
            "states": [
              "正常态：显示已有流程列表，选中后进入设计器",
              "空态：无流程时显示创建引导",
              "加载态：流程定义数据加载中",
              "异常态：设计器保存失败提示"
            ],
            "keyInteractions": [
              "选择流程类型（工单审核、采购审批、航前校验等）",
              "从左侧节点库拖拽节点到画布并连线",
              "点击节点打开属性面板设置审批人角色/用户、超时提醒时间、转交对象",
              "点击“保存”保存草稿版本，点击“发布”创建新版本并生效",
              "点击版本管理查看历史版本并回滚"
            ],
            "dataInputs": [
              "流程定义ID（创建时无）",
              "流程类型枚举",
              "画布数据（节点列表、连线列表、节点属性）",
              "审批人选择（角色ID或用户ID列表）",
              "超时规则（小时数、转交对象）"
            ]
          },
          {
            "key": "page-4",
            "priority": "P1",
            "type": "工作台页",
            "name": "配置验证与发布",
            "vueFile": "ConfigSimulation.vue",
            "goal": "支持系统管理员模拟切换视角测试权限和流程，确认无误后正式发布全局配置并记录变更。",
            "features": [
              "配置验证与发布"
            ],
            "sections": [
              "模拟用户/角色选择下拉框",
              "模拟操作区域（菜单导航模拟、流程实例模拟）",
              "配置冲突检查结果列表",
              "全局发布按钮与影响范围确认弹窗",
              "变更日志摘要"
            ],
            "states": [
              "正常态：可正常选择角色进行模拟",
              "空态：无待验证配置时提示“当前配置无需验证”",
              "加载态：模拟启动或执行中",
              "异常态：模拟执行时接口异常提示"
            ],
            "keyInteractions": [
              "选择模拟角色后，页面UI切换为该角色视图（菜单过滤、按钮禁用）",
              "在模拟模式下执行创建工单、审批等操作，验证流程节点跳转",
              "点击“检查冲突”扫描并展示冲突项",
              "点击“正式发布”弹出确认框显示影响范围（如影响用户数、运行流程数）",
              "发布后显示变更记录摘要链接"
            ],
            "dataInputs": [
              "模拟角色ID/用户ID",
              "模拟操作动作（菜单访问、流程提交）",
              "发布确认信息"
            ]
          },
          {
            "key": "page-5",
            "priority": "P0",
            "type": "列表页",
            "name": "审计日志查询",
            "vueFile": "AuditLogView.vue",
            "goal": "集中展示所有用户、角色、权限、流程的变更审计日志，支持检索和导出。",
            "features": [
              "审计日志查询"
            ],
            "sections": [
              "顶部筛选栏（时间范围、操作人、操作对象类型、操作类型）",
              "日志列表表格（操作时间、操作人、操作类型、操作对象、内容摘要）",
              "日志详情抽屉（变更前后对比）",
              "导出按钮"
            ],
            "states": [
              "正常态：显示日志列表",
              "空态：无匹配日志时提示“无审计记录”",
              "加载态：日志数据加载中",
              "异常态：查询接口失败"
            ],
            "keyInteractions": [
              "选择筛选条件后点击查询或重置",
              "点击表格行展开详情抽屉查看变更前后对比",
              "点击“导出”选择格式（Excel/PDF）下载文件",
              "分页浏览"
            ],
            "dataInputs": [
              "筛选条件：时间范围、操作人、操作对象类型、操作类型",
              "分页参数",
              "导出格式"
            ]
          }
        ],
        "navigation": [
          {
            "label": "用户管理",
            "target": "UserManager.vue",
            "default": true
          },
          {
            "label": "角色与权限管理",
            "target": "RolePermissionManager.vue",
            "default": false
          },
          {
            "label": "流程定义",
            "target": "WorkflowDesigner.vue",
            "default": false
          },
          {
            "label": "配置验证与发布",
            "target": "ConfigSimulation.vue",
            "default": false
          },
          {
            "label": "审计日志查询",
            "target": "AuditLogView.vue",
            "default": false
          }
        ],
        "fileStructure": {
          "views": [
            "UserManager.vue",
            "RolePermissionManager.vue",
            "WorkflowDesigner.vue",
            "ConfigSimulation.vue",
            "AuditLogView.vue"
          ],
          "components": [
            "UserTable.vue",
            "UserFormDialog.vue",
            "RoleListPanel.vue",
            "PermissionTree.vue",
            "WorkflowCanvas.vue",
            "NodePropertyPanel.vue",
            "RoleSimulator.vue",
            "ConflictChecker.vue",
            "AuditLogTable.vue",
            "LogDetailDrawer.vue"
          ],
          "data": [
            "userMockData.js",
            "roleMockData.js",
            "permissionTreeMock.js",
            "workflowMockData.js",
            "auditLogMockData.js"
          ]
        }
      },
      "sc-9": {
        "pages": [
          {
            "key": "page-1",
            "priority": "P0",
            "type": "看板页",
            "name": "系统运行状态总览仪表盘",
            "vueFile": "SysMonitorDashboard.vue",
            "goal": "集中展示系统整体健康度与关键运行指标，帮助管理员快速掌握系统运行态势",
            "features": [
              "系统运行状态总览仪表盘"
            ],
            "sections": [
              "顶部红色告警横幅（微服务异常或同步成功率低时显示）",
              "指标卡片行：服务在线数/异常数、数据库连接池使用率、CPU/内存/磁盘使用率",
              "统计图表区：资源使用趋势折线图、近24小时同步成功率柱状图",
              "快捷入口按钮区：跳转至告警管理、操作审计、报告生成",
              "筛选器栏：按船舶、模块、时间范围筛选指标（支持自动刷新）"
            ],
            "states": [
              "正常态（所有指标健康）",
              "告警态（微服务异常或资源超阈值显示红色横幅）",
              "空态（首次部署无数据）",
              "加载态（异步获取数据时显示骨架屏）",
              "异常态（API超时或返回错误）"
            ],
            "keyInteractions": [
              "点击微服务异常数卡片跳转至告警管理页面并预设筛选条件",
              "点击同步成功率柱状图某时段可下钻查看失败船舶列表",
              "切换自动刷新开关（默认每30秒）",
              "鼠标悬停在趋势图上显示时间点具体数值"
            ],
            "dataInputs": [
              "GET /api/monitor/overview 返回整体健康度与摘要指标",
              "GET /api/monitor/sync-stats?range=24h 返回各船舶同步统计",
              "GET /api/monitor/resource-trend?type=cpu,memory,disk,network 资源时序数据"
            ]
          },
          {
            "key": "page-2",
            "priority": "P0",
            "type": "列表页",
            "name": "异常告警分级处理与闭环",
            "vueFile": "AlertManagement.vue",
            "goal": "集中管理所有系统异常告警，支持分级响应与处置流程记录",
            "features": [
              "异常告警分级处理与闭环"
            ],
            "sections": [
              "筛选栏：严重程度、告警类型、时间范围、状态（未处理/处理中/已解决）",
              "告警列表表格：类型、级别、描述、影响范围、发生时间、累计次数、状态",
              "告警详情抽屉：告警内容、影响船舶/模块、首次/最近发生时间、关联操作日志列表",
              "处理操作面板：处理措施下拉选择、处理备注输入框、状态更新按钮",
              "历史处理记录查询区：按处理人、处理结果、时间范围检索",
              "批量操作栏：批量标记处理状态"
            ],
            "states": [
              "正常态（有告警数据）",
              "空态（无告警）",
              "加载态",
              "异常态（API不可用）",
              "处理中状态（局部loading）"
            ],
            "keyInteractions": [
              "点击告警行展开详情抽屉",
              "选择处理措施并填写备注后提交，状态变更为‘处理中’或‘已解决’",
              "批量选中告警后统一标记处理",
              "点击关联操作日志链接跳转至审计日志页面"
            ],
            "dataInputs": [
              "GET /api/monitor/alerts 告警列表",
              "PUT /api/monitor/alerts/{alertId}/handle 更新处理",
              "GET /api/monitor/alerts/{alertId} 告警详情"
            ]
          },
          {
            "key": "page-3",
            "priority": "P0",
            "type": "列表页",
            "name": "操作审计日志精细查询与异常标记",
            "vueFile": "AuditLogSearch.vue",
            "goal": "支持按多维条件检索用户操作日志，辅助合规审计与违规排查",
            "features": [
              "操作审计日志精细查询与异常标记"
            ],
            "sections": [
              "复合筛选面板：时间范围（自定义+快捷选项）、用户角色、操作类型、操作对象",
              "日志结果表格：时间、操作用户、角色、IP地址、操作类型、对象、详情（展开后显示变更前后值）",
              "标记操作栏：单条/批量标记为‘待审核’并添加备注",
              "审核确认栏：对‘待审核’条目执行‘确认’或‘驳回’",
              "导出工具栏：导出CSV/PDF，导出内容含筛选条件摘要"
            ],
            "states": [
              "正常态（有日志数据）",
              "空态（无符合条件的日志）",
              "加载态",
              "异常态（查询超时）",
              "导出进度态（生成文件期间显示进度）"
            ],
            "keyInteractions": [
              "组合条件查询后刷新表格",
              "点击详情展开查看变更前后JSON对比",
              "右键或勾选条目标记为‘待审核’",
              "点击导出按钮触发异步导出并下载",
              "对标记条目批量审核确认"
            ],
            "dataInputs": [
              "GET /api/audit/logs 日志列表",
              "PUT /api/audit/logs/{logId}/mark 标记状态",
              "GET /api/audit/logs/{logId} 详情",
              "POST /api/audit/logs/export 导出"
            ]
          },
          {
            "key": "page-4",
            "priority": "P1",
            "type": "工作台页",
            "name": "运维报告与合规文档自动生成",
            "vueFile": "ReportGenerator.vue",
            "goal": "定期或按需生成系统运维状况报告与审计合规文档，支撑决策与审查",
            "features": [
              "运维报告与合规文档自动生成"
            ],
            "sections": [
              "报告模板选择区：预设模板列表（运维周报、月报、审计摘要、航前合规汇总）",
              "自定义配置区：选择船舶、时间区间、是否包含告警明细、操作审计摘要等",
              "生成与预览区：一键生成按钮、生成进度条、实时预览（PDF/Word）",
              "定时计划设置区：启动/关闭定时生成，配置cron表达式、接收邮箱",
              "已生成报告列表：按类型、生成时间检索，下载或删除操作"
            ],
            "states": [
              "正常态（有模板和报告列表）",
              "空态（无任何报告）",
              "生成中态（进度条显示）",
              "异常态（生成失败提示）",
              "空态（未配置定时计划）"
            ],
            "keyInteractions": [
              "选择模板或自定义配置后点击生成",
              "查看生成进度条，完成后自动打开预览",
              "设置定时生成计划，保存后生效",
              "从已生成列表下载报告",
              "删除过期报告"
            ],
            "dataInputs": [
              "GET /api/report/templates 报告模板列表",
              "POST /api/report/generate 生成报告",
              "GET /api/report/list 已生成报告列表",
              "DELETE /api/report/{reportId} 删除报告"
            ]
          }
        ],
        "navigation": [
          {
            "label": "运行监控",
            "target": "SysMonitorDashboard.vue",
            "default": true
          },
          {
            "label": "告警管理",
            "target": "AlertManagement.vue",
            "default": false
          },
          {
            "label": "操作审计",
            "target": "AuditLogSearch.vue",
            "default": false
          },
          {
            "label": "报告生成",
            "target": "ReportGenerator.vue",
            "default": false
          }
        ],
        "fileStructure": {
          "views": [
            "SysMonitorDashboard.vue",
            "AlertManagement.vue",
            "AuditLogSearch.vue",
            "ReportGenerator.vue"
          ],
          "components": [
            "StatusTag.vue",
            "DataTable.vue",
            "TrendChart.vue",
            "DetailDrawer.vue",
            "ExportButton.vue"
          ],
          "data": [
            "scenarioMockData.js"
          ]
        }
      },
      "sc-10": {
        "pages": [
          {
            "key": "page-1",
            "priority": "P0",
            "type": "工作台页",
            "name": "审计日志查询与合规审查工作台",
            "vueFile": "AuditLogWorkspace.vue",
            "goal": "审计员在一体化界面中通过多维筛选快速定位操作日志，查看完整详情与变更差异，对异常操作进行合规标记，并按需导出审计报告，所有审计行为自动留痕。",
            "features": [
              "审计日志查询与列表展示",
              "日志详情查看与变更差异对比",
              "合规判定与异常标记",
              "审计报告导出"
            ],
            "sections": [
              "顶部统计摘要区：展示总日志条数及按操作类型/日期的柱状图或饼图",
              "高级筛选面板区：包含时间范围选择器（近7天/30天/自定义）、用户角色下拉、操作类型多选、船舶名称搜索",
              "日志列表区：每行显示操作人、时间、模块、操作类型、状态（正常/待审核/不合规），支持点击展开详情",
              "详情展开面板：以左右对比或内联高亮展示变更前后内容，包含所有元数据字段",
              "操作工具栏：每条日志右侧或详情面板内提供标记按钮（待审核/不合规），以及列表顶部的导出报告按钮"
            ],
            "states": [
              "正常态：有日志数据展示并可按条件筛选",
              "空态：无匹配日志时显示“当前筛选条件下无操作日志，请调整查询条件”并配图标",
              "加载态：初次加载或筛选查询时显示骨架屏或加载中动画",
              "异常态：接口请求失败时显示错误提示与重试按钮"
            ],
            "keyInteractions": [
              "选择筛选条件后自动触发查询（或点击查询按钮），列表刷新并更新统计图",
              "点击日志行展开/收起详情面板，变更差异区域高亮显示新增（绿色）和删除（红色）",
              "点击“标记为待审核”或“标记为不合规”按钮弹出标记弹窗，必填审计意见，可选触发审批流程",
              "点击“导出报告”按钮弹出导出配置对话框，选择格式并填写标题，确认后后台异步生成并通知下载"
            ],
            "dataInputs": [
              "筛选条件：timeRange（开始/结束日期）、role（角色编码）、operationTypes（操作类型数组）、vesselName（船舶名称）",
              "日志列表数据：分页列表（items, total, page, limit），每条包含id, operator, time, module, operationType, status, ip, object, oldValue, newValue等",
              "日志详情数据：通过GET /api/audit-logs/{logId}/detail获取，含fullMetadata, oldValueJSON, newValueJSON, relatedLogIds",
              "标记提交数据：logId, status（pending_review或non_compliant）, comment, triggerWorkflow",
              "导出配置：format（pdf/csv）, title, signerName, filters（当前筛选条件）"
            ]
          }
        ],
        "navigation": [
          {
            "label": "审计日志查询与合规审查",
            "target": "AuditLogWorkspace.vue",
            "default": true
          }
        ],
        "fileStructure": {
          "views": [
            "AuditLogWorkspace.vue"
          ],
          "components": [
            "FilterPanel.vue",
            "LogTable.vue",
            "LogDetailPanel.vue",
            "MarkDialog.vue",
            "ExportDialog.vue",
            "StatsChart.vue"
          ],
          "data": [
            "auditLogMockData.js"
          ]
        }
      },
      "sc-11": {
        "pages": [
          {
            "key": "page-1",
            "priority": "P0",
            "type": "工作台页",
            "name": "采购需求审核与申请发起",
            "vueFile": "ProcurementRequirementReview.vue",
            "goal": "采办协同人员审核自动生成的采购需求列表，校验预算与BOM关联后发起采购申请",
            "features": [
              "采购需求审核与申请发起"
            ],
            "sections": [
              "筛选与搜索区（物料编码、紧急程度、创建时间）",
              "采购需求列表区（展示待处理需求，含物料编码、名称、数量、建议供应商、状态）",
              "需求详情预览区（点击列表项展开，显示库存、BOM关联、预算余额）",
              "发起采购申请操作区（按钮、弹窗表单：采购说明、交货期限、供应商选择、附件上传）",
              "预算不足提示区（条件触发）"
            ],
            "states": [
              "正常态：列表显示待处理需求，可操作",
              "空态：无待处理需求，显示“暂无待处理的采购需求”",
              "加载态：列表加载中，显示骨架屏",
              "异常态：数据加载失败，显示错误提示及重试按钮"
            ],
            "keyInteractions": [
              "点击需求列表行展开/收起详情，查看库存、BOM关联、预算余额",
              "点击“发起采购申请”按钮弹出表单，表单内动态校验预算余额",
              "预算不足时自动弹出提示并阻止提交，允许调整数量或跳转预算追加流程",
              "供应商选择支持从合格供应商列表下拉选择或手动输入",
              "附件上传支持多文件，格式限制（pdf/jpg/png）"
            ],
            "dataInputs": [
              "筛选条件（物料编码、紧急程度、创建时间范围）",
              "采购需求ID（用于获取详情）",
              "采购申请表单：采购说明、交货期限、供应商ID、附件文件列表",
              "预算追加申请（可选跳转）"
            ]
          },
          {
            "key": "page-2",
            "priority": "P1",
            "type": "列表页",
            "name": "采购订单跟踪",
            "vueFile": "ProcurementOrderTracking.vue",
            "goal": "查看采购订单列表，跟踪订单执行状态，接收和更新到货进度",
            "features": [
              "采购订单跟踪"
            ],
            "sections": [
              "筛选与搜索区（订单号、供应商、状态、预计到货时间）",
              "采购订单列表区（显示订单号、物料、金额、供应商、状态、预计到货时间）",
              "订单详情面板（点击订单行展开，展示完整信息及审批历史）",
              "状态更新操作区（手动更新状态按钮，备注输入）",
              "预警提示区（超期未到货时高亮显示）"
            ],
            "states": [
              "正常态：列表正常显示订单，可操作",
              "空态：无订单记录，显示“暂无采购订单”",
              "加载态：列表加载中",
              "异常态：列表加载失败，显示重试"
            ],
            "keyInteractions": [
              "点击订单行展开详情面板，查看物料明细、金额、供应商、审批历史",
              "点击“更新状态”按钮弹出状态选择弹窗，可选状态含待发货、已发货、运输中、部分到货、已到货，更新后添加备注",
              "超时未到货订单在列表中自动高亮（红色背景）并显示预警图标",
              "到货通知：当订单状态变为“已到货”时，系统自动弹出提醒并跳转到验收页面（或按钮）"
            ],
            "dataInputs": [
              "筛选条件（订单号、供应商、状态、时间范围）",
              "订单ID（用于获取详情）",
              "状态更新：新状态值、备注文字"
            ]
          },
          {
            "key": "page-3",
            "priority": "P0",
            "type": "工作台页",
            "name": "到货验收与入库处理",
            "vueFile": "GoodsReceiptAndInspection.vue",
            "goal": "对已到货的物资进行扫码验收，录入检验结果，执行入库或退换货操作",
            "features": [
              "到货验收与入库处理"
            ],
            "sections": [
              "订单选择区（下拉选择或搜索待验收的采购订单）",
              "条码扫描/手动录入区（支持摄像头扫描或输入框）",
              "物料明细核对区（显示订单物料、应到数量、实到数量输入框、外观检验结果选择）",
              "附件上传区（照片、质检报告）",
              "检验结论与操作区（合格/部分合格/不合格按钮，入库/退换货确认）",
              "历史记录与跟踪区（入库记录、退换货单列表）"
            ],
            "states": [
              "正常态：可进行验收操作",
              "空态：无可验收的订单，显示“暂无待验收的采购订单”",
              "加载态：订单加载中或扫描识别中",
              "异常态：条码无法识别或订单信息不匹配，给出错误提示"
            ],
            "keyInteractions": [
              "选择待验收订单后自动加载物料列表，支持扫码快速定位物料",
              "每行物料输入实到数量，选择外观检验结果（合格/不合格），可上传图片或报告",
              "点击“确认验收”后弹出检验结论弹窗：合格（走入库）、部分合格（部分入库+部分退换货）、不合格（全部退换货）",
              "入库时自动更新库存台账，核减预算，并显示成功信息",
              "退换货时弹出表单填写不合格原因及处理意见，提交后生成退换货单并通知供应商"
            ],
            "dataInputs": [
              "待验收订单ID",
              "物料条码（手动或扫描）",
              "实到数量（数字输入）",
              "外观检验结果（合格/不合格）",
              "附件文件（照片、质检报告）",
              "退换货处理意见（文本）"
            ]
          }
        ],
        "navigation": [
          {
            "label": "采购需求审核与申请",
            "target": "ProcurementRequirementReview.vue",
            "default": true
          },
          {
            "label": "采购订单跟踪",
            "target": "ProcurementOrderTracking.vue",
            "default": false
          },
          {
            "label": "到货验收与入库",
            "target": "GoodsReceiptAndInspection.vue",
            "default": false
          }
        ],
        "fileStructure": {
          "views": [
            "ProcurementRequirementReview.vue",
            "ProcurementOrderTracking.vue",
            "GoodsReceiptAndInspection.vue"
          ],
          "components": [
            "StatusTag.vue",
            "DataTable.vue",
            "ScanInput.vue",
            "AttachmentUploader.vue",
            "BudgetBalanceDialog.vue"
          ],
          "data": [
            "procurementMockData.js"
          ]
        }
      }
    },
    "requirementInputSnapshot": {
      "projectName": "船舶维护 PMS",
      "customerName": "HG",
      "projectStage": "原型设计",
      "sourceRequirement": "# 项目需求预整理\n\n> 生成日期：2026-07-06\n> 材料来源：《信息化建设项目立项报告-AMOS 系统国产化 0630V2.doc》\n> 说明：标 `[来源：立项报告]` 为输入直接来源；标 `[推断：依据]` 为基于材料的合理推断；标 `【待确认】` 为需客户确认项（汇总见第 13 章）\n\n## 1. 项目背景\n- 项目名称：AMOS 系统国产化升级及一体化船舶运行维护管控平台 [来源：立项报告]\n- 立项单位：海洋石油工程股份有限公司 [来源：立项报告]\n- 业务领域：海工船舶设备维保、物资备件、船员资质、证照检验、船岸协同和调度联动 [来源：立项报告]\n- 建设动因：现有船舶运行维护管理依赖 AMOS 等传统封闭式软件，C/S 架构，与国产操作系统、国产数据库和公司统一技术底座适配能力不足；随着公司船队精细化管理、调度指挥体系建设和信创合规要求持续深化，单一维保系统已难以满足设备状态、物资保障、人员资质和航前调度一体化管控需求 [来源：立项报告]\n- 合规依据：国家网络安全、数据安全、信创国产化、等级保护和企业信息化资产管理相关要求；公司信息化规划、数据治理\"五定\"要求、船舶安全管理和 ISM 规则审计要求；船级社对维保记录、证照管理和作业留痕的合规要求 [来源：立项报告]\n- 项目分期：本次申报按一期建设实施，重点完成现有 AMOS 核心业务替代、历史数据迁移、试点船双轨运行和核心接口集成；为后续轻量化业务孪生、能效碳排融合和更大范围船队推广预留扩展空间 [来源：立项报告]\n- 建设周期：暂按 12 个月安排（蓝图设计 M1-M3 / 核心研发 M2-M10 / 迁移试点 M8-M11 / 联调验收 M11-M12）[来源：立项报告]\n- 投资预算：424.3 万元（不含税），2026 年投入；明细构成：软件 0 / 硬件 14.3（手持终端 26 台）/ 咨询 10 / 实施 380 / 管理 10 / 不可预见 10 [来源：立项报告]\n- 前期工作：已形成《一体化船舶运行维护管控平台》建设方案，梳理了现有 AMOS 系统业务边界、数据迁移难点、远洋弱网通信场景、移动端离线需求、信创技术路线和试点推广路径 [来源：立项报告]\n- 项目意义：以国产化替代为牵引，建设面向船舶运行维护核心业务的自主可控平台，将设备资产、PMS 维保、物资 BOM、库存、证照、船员资质和调度校验能力纳入统一平台 [来源：立项报告]\n\n## 2. 客户目标\n- 总体目标：建设自主可控、符合信创技术路线的一体化船舶运行维护管控平台，形成设备维保、物资保障、人员资质、证照检验、移动离线作业、船岸同步和调度校验的核心业务闭环 [来源：立项报告]\n- 本期目标：完成核心功能上线、2 艘试点船双轨验证、AMOS 关键历史数据迁移和核心接口联调 [来源：立项报告]\n- 业务能力目标：支撑核心设备资产树、预防性维护计划、工单闭环、库存预警、缺件触发采购建议和航前健康校验 [来源：立项报告]\n- 功能目标：完成 PC 端和移动端基础应用，支持弱网离线报工、拍照留痕、扫码盘点和船岸异步同步 [来源：立项报告]\n- 综合效益目标：降低封闭软件依赖，提升维保执行率、数据准确率、物资保障前置性和调度决策可靠性 [来源：立项报告]\n- 管理转型目标：实现从\"事后记录\"向\"事前预警、过程管控、闭环追溯\"的管理转型 [来源：立项报告]\n- 直接效益目标：国产化替代降低对外部封闭软件的持续依赖，减少后续许可、升级和定制受限风险；物资 BOM、库存预警和采购需求前置，降低备件呆滞库存和停工待料风险；弱网增量同步和移动端离线作业降低重复录入、卫星通信和人工核对成本 [来源：立项报告]\n- 间接效益目标：提升船舶维保数字化、调度决策、合规审计和数据资产治理水平；航前健康体检机制降低带病开航和非计划停航风险；日志留痕和数据治理提升船级社、ISM 和公司内部审计支撑能力 [来源：立项报告]\n- 【待确认：是否有具体的量化业务目标（维保执行率提升至 X%、数据准确率 Y%、缺件风险下降 Z%、维保周期缩短天数等）】（见 Q5）\n\n## 3. 当前痛点\n1. 设备维保与调度指令割裂：航前任务下达缺少设备健康、物资保障和人员资质的底层校验，岸基调度部门难以及时掌握单船核心设备健康度、备件保障水平和关键资质状态 [来源：立项报告]\n   - 影响：存在带病开航和非计划停航风险\n2. 船端弱网/无网环境下移动作业能力不足：一线人员仍依赖纸质抄录、回港补录和人工复核 [来源：立项报告]\n   - 影响：重复录入成本高、卫星通信成本高、数据时效性差\n3. 物资、备件和库存数据缺乏与设备 BOM、PMS 计划的深度关联 [来源：立项报告]\n   - 影响：难以前置发现缺件风险和停工待料风险，备件呆滞库存成本高\n4. AMOS 系统封闭性强：源代码和底层逻辑不可控，数据库结构复杂，部分附件存在库文件分离、命名不规范和路径映射复杂等问题 [来源：立项报告]\n   - 影响：自主可控水平低，国产化适配能力不足，定制受限\n5. 数据治理水平不足：现有 AMOS 数据历史积累时间长、表结构复杂、编码标准不一致、附件路径分散、部分物料一物多码、数据质量参差不齐 [来源：立项报告]\n   - 影响：数据迁移难度高，难以支撑一体化管控和智能预警\n6. 与国内外最佳实践存在差距：在自主可控、业务协同、移动作业、数据治理、智能预警和审计追溯方面存在差距 [来源：立项报告]\n   - 影响：亟需在国产化适配、弱网离线同步、航前健康体检、物资前瞻保障和合规证照预警方面系统性补强\n7. 业务现状混合并存：船舶设备资产管理、预防性维护、维修工单、备件库存、采购需求、船员资质、船舶证照、岸基机务管理和调度指挥协同等业务以系统记录、线下台账、纸质流转和人工核对并存 [来源：立项报告]\n   - 影响：业务协同效率低，数据口径不一致\n\n## 4. 用户角色与职责\n\n| 角色 | 职责 | 使用场景 | 来源 |\n|------|------|---------|------|\n| 领导小组 | 重大事项决策 | 项目关键节点决策 | 立项报告 |\n| 业务工作组 | 需求确认和业务验收 | 需求调研、流程梳理、阶段验收 | 立项报告 |\n| 技术实施组 | 系统设计、开发和部署 | 全周期研发实施 | 立项报告 |\n| 数据迁移组 | 抽取、清洗、核验和封账 | AMOS 数据迁移阶段 | 立项报告 |\n| 试点船工作组 | 现场试运行 | 2 艘试点船部署与双轨运行 | 立项报告 |\n| 验收运维组 | 培训、运维移交和后续推广准备 | 联调验收及上线后 | 立项报告 |\n| 岸基机务人员 | 机务管理、设备维保监督 | 日常机务管理 | 立项报告 |\n| 船舶管理人员 | 船舶运行管理 | 日常船舶管理 | 立项报告 |\n| 信息化部门 | 平台运维统筹、信创环境支持、年度运维 | 上线后运维 | 立项报告 |\n| 采办协同人员 | 采购需求提报、物资验收、预算核减确认 | 采购需求触发与验收节点 | 立项报告 |\n| 试点船人员 | 移动端离线报工、扫码盘点、拍照留痕 | 船端日常维保作业 | 立项报告 |\n| 船端一线作业人员 | 工单执行、报工、盘点 | 弱网/无网环境下移动作业 | 立项报告 |\n| 系统管理员 | 组织权限配置、流程配置、统一身份管理 | 系统配置与维护 | [推断：基础平台提供组织权限、统一身份、工作流，需管理员角色] |\n| 审计员 | 查阅关键操作日志、审计追溯 | 合规审计与 ISM/船级社审查 | [推断：第七章明确\"审计员\"账号权限] |\n| 接口账号 | 系统间数据握手鉴权 | 与调度、采办、能耗、数据湖等系统集成 | [推断：第七章明确\"接口账号\"权限] |\n| 【待确认】调度指挥人员 | 与船队可视化指挥调度系统协同的角色与职责 | 航前健康校验、调度联动 | -（见 Q20） |\n\n## 5. 核心业务流程\n\n### 5.1 PMS 预防性维护与工单闭环流程 [来源：立项报告]\n1. 基于设备资产树和 PMS 维保计划，系统自动生成维保计划任务\n2. 维保任务转化为工单，下达至船端作业人员\n3. 船端人员在弱网/无网环境下通过移动端离线执行工单、拍照留痕\n4. 联网后船岸异步同步，工单报工数据回传岸基\n5. 工单闭环归档，更新设备维保履历\n- 【待确认：PMS 计划生成的具体规则（周期/工况/条件触发）、工单状态流转的完整节点】（见 Q16）\n\n### 5.2 缺件触发采购建议流程 [来源：立项报告]\n1. 物资 BOM 与 PMS 计划联动，前置识别维保所需备件\n2. 库存预警触发，系统生成缺件风险提示\n3. 缺件触发采购建议，提报至集团采办 2.0 平台（仅在采购需求提报节点数据握手，不重建供应商寻源、多级审批和物流全链路）\n4. 采办订单状态回传\n5. 物资验收，预算核减确认\n- 【待确认：采购需求提报到采办 2.0 的具体数据字段和触发条件、订单状态回传的字段范围】（见 Q11）\n\n### 5.3 航前健康校验流程 [来源：立项报告]\n1. 调度指令下达前，系统在设备状态、物资保障、人员资质证照三个维度自动校验\n2. 校验通过则允许开航，校验不通过则拦截并提示\n3. 校验结果留痕，支撑船级社、ISM 和公司内部审计\n- 【待确认：航前健康校验的判定规则（哪些设备/物资/资质不通过则拦截开航）、校验不通过的处置流程】（见 Q13）\n\n### 5.4 AMOS 历史数据迁移流程 [来源：立项报告]\n1. 建立镜像中转池，对 AMOS 源系统只读抽取\n2. 视图优先、快照加增量补丁方式迁移\n3. MD5 完整性校验\n4. 业务抽样验收\n5. 迁移前基准快照、双轨运行、应急回滚机制保障\n6. 切换期间保留只读归档底座\n- 【待确认：AMOS 历史数据迁移的截止时间点（封账基准日）、历史数据保留期限】（见 Q10）\n\n### 5.5 船岸数据同步流程 [来源：立项报告]\n1. 船端移动端本地缓存作业数据\n2. 网络探测，检测可用连接\n3. 增量同步至岸基\n4. 字段级冲突仲裁（并发修改时）\n5. 无法自动仲裁的进入人工仲裁池\n- 【待确认：船岸同步的频率（实时/定时）、卫星通信带宽约束、冲突仲裁的具体规则、大附件处理策略】（见 Q12）\n\n## 6. 功能范围\n\n### 6.1 明确需要覆盖\n- 平台基础框架（组织权限、统一身份认证、工作流引擎、日志审计）[来源：立项报告]\n- 设备资产树（SFI 资产结构映射）[来源：立项报告]\n- PMS 维保引擎（预防性维护计划自动生成）[来源：立项报告]\n- 工单闭环（工单生成、执行、报工、归档）[来源：立项报告]\n- 物资 BOM（与设备、PMS 联动）[来源：立项报告]\n- 库存与安全库存预警 [来源：立项报告]\n- 移动端离线作业（离线报工、扫码盘点、拍照留痕）[来源：立项报告]\n- 船岸同步（本地缓存、网络探测、增量同步、冲突仲裁）[来源：立项报告]\n- 数据迁移（镜像中转池、只读抽取、视图优先、快照加增量、MD5 校验、抽样验收、回滚）[来源：立项报告]\n- 基础接口集成（调度、采办、能耗、数据湖、统一身份）[来源：立项报告]\n- 试点上线服务（2 艘试点船部署、双轨运行）[来源：立项报告]\n- 航前健康校验（设备/物资/资质三维校验）[来源：立项报告]\n- 缺件触发采购建议 [来源：立项报告]\n- 证照管理、船员资质管理 [来源：立项报告]\n- 信创适配与部署验证（国产 CPU/OS/DB）[来源：立项报告]\n- 安全等级保护定级备案、访问控制、权限分级、接口鉴权、安全测试 [来源：立项报告]\n\n### 6.2 暂不确定（待确认）\n- 轻量化三维/业务孪生在核心设备定位和维保辅助展示的具体范围（材料明确\"仅在核心设备定位和维保辅助展示层面预留，不纳入全船高精度建模\"，但具体展示形态待确认）【待确认】（见 Q15）\n- 报表、指标、看板的具体清单【待确认】（见 Q6）\n- 通知方式与场景对应【待确认】（见 Q8）\n- 移动端功能边界（是否与 PC 端全功能一致）【待确认】（见 Q7）\n\n### 6.3 明确不覆盖\n- 全船高精度三维建模（轻量化三维仅在核心设备定位和维保辅助展示层面预留）[来源：立项报告]\n- 供应商寻源 [来源：立项报告]\n- 多级审批（不重建，仅采购需求提报节点数据握手）[来源：立项报告]\n- 物流全链路（不重建）[来源：立项报告]\n- 轻量化业务孪生、能效碳排融合（纳入后续扩展清单，不在一期范围）[来源：立项报告]\n- 年度运维费用（原则上不纳入本次 424.3 万元建设投资，另行测算）[来源：立项报告]\n\n## 7. 关键业务规则\n\n| 规则内容 | 来源附件 | 是否明确（明确/推断/待确认）|\n|---------|---------|--------------------------|\n| 最小权限原则配置岸基、船端、管理员、审计员、接口账号权限 | 立项报告 | 明确 |\n| 关键操作保留执行人、复核人、时间戳和业务对象日志 | 立项报告 | 明确 |\n| 数据迁移采用只读镜像抽取、静态封账、MD5 完整性校验、迁移前基准快照 | 立项报告 | 明确 |\n| 双轨运行和应急回滚机制保障新老系统切换 | 立项报告 | 明确 |\n| 切换期间保留只读归档底座，防止历史数据丢失、误改和不可追溯 | 立项报告 | 明确 |\n| 移动端采用本地缓存、网络探测、增量同步和冲突仲裁机制保障远洋弱网业务连续 | 立项报告 | 明确 |\n| 字段级冲突仲裁 + 人工仲裁池处理并发修改冲突 | 立项报告 | 明确 |\n| 物资 BOM 与 PMS 计划联动，前置识别缺件风险 | 立项报告 | 明确 |\n| 库存预警触发缺件采购建议 | 立项报告 | 明确 |\n| 航前健康校验在设备状态、物资保障、人员资质证照三维自动校验 | 立项报告 | 明确 |\n| 与采办 2.0 仅在采购需求提报、订单状态回传、物资验收、预算核减确认节点数据握手 | 立项报告 | 明确 |\n| 数据库优先适配人大金仓等国产数据库，操作系统适配麒麟等国产环境 | 立项报告 | 明确（型号\"等\"字存疑，见 Q2/Q3） |\n| 数据治理遵循公司\"五定\"要求 | 立项报告 | 明确 |\n| 合规遵循 ISM 规则审计、船级社维保记录/证照管理/作业留痕要求 | 立项报告 | 明确 |\n| 关键操作留痕支撑船级社、ISM 和公司内部审计 | 立项报告 | 明确 |\n| PMS 计划自动生成规则（周期/工况/条件触发） | - | 待确认（见 Q16） |\n| 航前健康校验判定规则（哪些不通过则拦截开航） | - | 待确认（见 Q13） |\n| 采购需求提报触发条件与字段 | - | 待确认（见 Q11） |\n| 船岸同步频率与冲突仲裁规则 | - | 待确认（见 Q12） |\n| 数据权限隔离规则（各角色可见数据范围） | [推断：权限分级要求下需明确数据权限边界] | 推断（见 Q19） |\n\n## 8. 异常与边界场景\n\n**数据迁移风险与应对** [来源：立项报告]\n- 异常：历史表结构复杂、附件路径分散、编码不统一、一物多码\n- 应对：建立镜像中转池、快照校验、业务抽样验收和回滚机制；只读镜像抽取、静态封账、MD5 完整性校验、迁移前基准快照；切换期间保留只读归档底座\n\n**弱网同步风险与应对** [来源：立项报告]\n- 异常：船岸断连、并发修改、数据冲突\n- 应对：离线缓存、增量同步、字段级冲突仲裁、人工仲裁池\n\n**信创适配风险与应对** [来源：立项报告]\n- 异常：国产 OS/DB/中间件兼容性差异\n- 应对：提前完成适配验证，明确标准环境和兼容清单\n- 【待确认：国产 DB/OS 具体型号与版本、兼容清单范围】（见 Q2/Q3）\n\n**组织协同风险与应对** [来源：立项报告]\n- 异常：业务流程调整和试点配合不足\n- 应对：设立业务工作组，明确职责、培训和验收标准\n\n**范围控制风险与应对** [来源：立项报告]\n- 异常：一期预算与完整平台能力边界不清\n- 应对：严格以核心替代和试点闭环为一期范围，后续能力分期实施\n\n**试点船现场风险** [来源：立项报告]\n- 异常：试点船现场业务负荷影响上线配合\n- 应对：试点先行、双轨并行、静态封账、数据抽样验收、接口轻量化、关键能力优先、范围变更控制\n- 【待确认：2 艘试点船具体是哪两艘、选择标准】（见 Q1）\n\n**新老系统切换风险** [来源：立项报告]\n- 异常：切换期间历史数据丢失、误改、不可追溯\n- 应对：双轨运行、应急回滚、只读归档底座\n\n**卫星通信带宽约束** [推断：远洋船舶卫星通信带宽有限]\n- 异常：大附件同步、批量数据同步受带宽限制\n- 应对：增量同步机制 [推断]\n- 【待确认：卫星通信带宽约束、大附件处理策略】（见 Q12）\n\n## 9. 数据对象\n\n| 对象 | 关键字段 | 来源 | 备注 |\n|------|---------|------|------|\n| 设备资产 | SFI 资产结构、设备主数据、设备资产树 | 立项报告 | 设备资产域核心对象 |\n| PMS 维保计划 | 计划编号、设备、维护周期、维护内容、触发条件 | 立项报告 | 维保工单域，与设备、BOM 联动 |\n| 维保工单 | 工单编号、设备、计划、执行人、状态、报工记录、附件 | 立项报告 | 维保工单域，工单履历需迁移 |\n| 备件主数据 | 备件编码、名称、规格、关联设备 BOM | 立项报告 | 物资库存域，存在一物多码问题 |\n| 物资 BOM | BOM 编号、设备、备件清单、数量 | 立项报告 | 物资库存域，与 PMS 联动 |\n| 库存 | 库存快照、安全库存阈值、预警状态 | 立项报告 | 物资库存域，库存快照需迁移 |\n| 采购需求 | 需求编号、备件、数量、触发原因、状态 | 立项报告 | 采购需求域，提报至采办 2.0 |\n| 船舶证照 | 证照编号、类型、有效期、状态 | 立项报告 | 船舶证照域 |\n| 船员资质 | 人员、资质类型、有效期、状态 | 立项报告 | 船员资质域，基础人员资质信息需迁移 |\n| 附件档案 | 附件名称、路径、关联业务对象、MD5 | 立项报告 | 附件档案域，存在库文件分离、命名不规范、路径映射复杂问题 |\n| 关键附件 | 附件内容、关联设备/工单 | 立项报告 | 附件档案域，关键附件需迁移 |\n| 接口交换数据 | 接口、方向、报文、时间戳 | 立项报告 | 接口交换域 |\n| 航前校验记录 | 校验编号、船舶、设备状态、物资保障、资质证照、校验结果、时间 | [推断：航前健康校验功能必需] | 具体字段【待确认】（见 Q13） |\n| 冲突仲裁记录 | 同步对象、冲突字段、仲裁结果、仲裁人、时间 | [推断：字段级冲突仲裁机制必需] | - |\n| 操作日志 | 操作人、复核人、时间戳、业务对象、操作类型 | 立项报告 | 关键操作留痕 |\n| 【待确认】设备健康度模型 | 设备健康度评估字段、库存预警阈值规则字段 | - | 【待确认：设备健康度评估模型与预警阈值规则】（见 Q22） |\n\n## 10. 系统集成/API/外部依赖\n\n**外部系统集成** [来源：立项报告]\n- 船队可视化指挥调度系统：航前健康校验、调度联动（轻量集成）\n- 集团采办 2.0 平台：采购需求提报、订单状态回传、物资验收、预算核减确认（关键节点数据握手，不重建寻源/审批/物流）\n- 能耗采集系统：能耗数据采集（轻量集成）\n- 公司数据湖：数据入湖、主数据治理\n- 统一身份认证系统：单点登录、组织架构同步\n- 【待确认：与船队可视化指挥调度系统、能耗采集系统的具体接口字段和交互频率】（见 Q21）\n\n**公司统一底座复用** [来源：立项报告]\n- 数据湖\n- 统一身份认证\n- 微服务治理\n- 工作流引擎\n- 信创基础设施（国产 CPU/OS/DB 资源池）\n\n**硬件依赖** [来源：立项报告]\n- 手持终端设备 26 台（单价 0.55 万元，船上资产盘点、扫码出入库、移动报工等场景使用）\n\n**信创环境依赖** [来源：立项报告]\n- 国产 CPU\n- 国产操作系统（麒麟等）\n- 国产数据库（人大金仓等）\n- 国产中间件\n- 【待确认：具体型号、版本、兼容清单】（见 Q2/Q3）\n\n**待确认集成项**\n- 【待确认：是否需要与电子签章、即时通讯（企微/钉钉）等第三方服务集成】（见 Q8）\n- 【待确认：是否需要对接财务系统实现预算核减自动记账】（见 Q17）\n\n## 11. 报表、指标、看板需求\n\n> 材料中未列具体报表清单，以下按业务域推断可能需要的报表与指标，全部标 `[推断]`；具体口径、统计频率、看板布局标 `【待确认】`。\n\n**维保执行类** [推断：基于 PMS 维保引擎和工单闭环功能推断]\n- 维保计划执行率报表（按船舶/设备/周期）\n- 工单闭环率报表\n- 维保超期/未完成报表\n- [推断：可能需要维保人员工作量统计用于绩效评估]\n\n**物资库存类** [推断：基于物资 BOM、库存预警、缺件采购功能推断]\n- 库存周转率报表\n- 安全库存预警报表\n- 缺件风险预警报表\n- 备件呆滞库存报表\n- 采购需求提报与到货统计\n\n**资质证照类** [推断：基于船员资质、船舶证照管理推断]\n- 资质到期预警报表\n- 证照到期预警报表\n- 持证合规率报表\n\n**航前校验类** [推断：基于航前健康校验功能推断]\n- 航前校验通过率报表\n- 校验不通过原因分析报表\n- 带病开航/非计划停航统计\n\n**数据治理类** [推断：基于数据迁移和质量校验推断]\n- 数据迁移完成率/准确率报表\n- 数据质量校验报告\n- 一物多码/编码不规范统计\n\n**审计合规类** [推断：基于日志留痕和 ISM/船级社审计要求推断]\n- 关键操作日志报表\n- 审计追溯报表\n\n**管理看板** [推断：基于一体化管控平台定位推断]\n- 船队设备健康度总览看板\n- 维保执行总览看板\n- 物资保障总览看板\n- 资质证照合规总览看板\n- 航前校验状态看板\n\n**待确认**\n- 【待确认：报表/看板的具体清单和指标口径】（见 Q6）\n- 【待确认：报表是否需要定时自动推送、导出（Excel/PDF）、权限分级查看】（见 Q6）\n- 【待确认：看板的服务对象（岸基管理层/机务/调度）和刷新频率】（见 Q6）\n\n## 12. 移动端/权限/审批/通知等特殊要求\n\n### 移动端\n- 支持 PC 端和移动端（手持终端）跨端访问 [来源：立项报告]\n- B/S 管理端 + 移动离线端 [来源：立项报告]\n- 移动端支持离线报工、拍照留痕、扫码盘点 [来源：立项报告]\n- 本地缓存、网络探测、增量同步、冲突仲裁机制保障远洋弱网业务连续 [来源：立项报告]\n- 【待确认：移动端支持的平台（iOS/Android/鸿蒙）】（见 Q7）\n- 【待确认：移动端功能边界是否与 PC 端全功能一致，还是仅作业子集】（见 Q7）\n\n### 权限\n- 基于角色的权限控制（RBAC），按最小权限原则配置 [来源：立项报告]\n- 权限分级：岸基、船端、管理员、审计员、接口账号 [来源：立项报告]\n- 数据权限隔离 [推断：权限分级要求下需明确各角色可见数据范围]\n- 统一身份认证 [来源：立项报告]\n- 【待确认：数据权限隔离的具体规则（按船舶/部门/角色）】（见 Q19）\n\n### 审批\n- 复用公司工作流引擎 [来源：立项报告]\n- 工单流转、采购需求提报等流程 [来源：立项报告]\n- 【待确认：是否需要委托/代理/会签/加签等特殊审批机制】（见 Q18）\n\n### 通知\n- 【待确认：通知方式（短信/邮件/企微/钉钉/站内信）及各场景对应】（见 Q8）\n- 【待确认：预警通知（库存预警、资质到期、航前校验不通过）的触发规则和通知对象】（见 Q8）\n\n### 性能\n- 【待确认：并发用户数预期、响应时间要求、数据量预期】（见 Q9）\n- [推断：船端离线作业需考虑手持终端性能与本地存储容量约束]\n\n### 安全合规\n- 安全等级保护定级备案 [来源：立项报告]\n- 访问控制、身份认证、权限分级、日志审计、数据备份、接口鉴权、安全测试 [来源：立项报告]\n- 【待确认：等保定级级别（二级/三级）、是否已完成定级备案】（见 Q4）\n- 国产化：国产 CPU/OS/DB/中间件 [来源：立项报告]\n- 【待确认：具体型号与版本】（见 Q2/Q3）\n- 供应链安全：外部接口或历史数据归档能力需专项论证边界、责任和替代路线 [来源：立项报告]\n\n### 多语言/多时区\n- 【待确认：是否需要多语言支持（中/英），是否涉及外籍船员】（见 Q14）\n\n### 运维\n- \"信息化部门统筹、业务部门协同、供应商支撑\"运维模式 [来源：立项报告]\n- 年度运维费用另行测算，不纳入本次建设投资 [来源：立项报告]\n- 运维内容：软件维护、信创环境适配支持、移动端升级、接口监控、数据备份、安全巡检、用户支持 [来源：立项报告]\n\n## 13. 待客户确认问题\n\n| 编号 | 问题 | 涉及章节 | 优先级 |\n|------|------|---------|-------|\n| Q1 | 2 艘试点船具体是哪两艘？选择标准是什么？ | 第5/6章 | 高 |\n| Q2 | 国产数据库具体采用哪款（人大金仓/达梦/其他）？版本？ | 第12章 | 高 |\n| Q3 | 国产操作系统具体采用哪款（麒麟哪个版本/统信/其他）？ | 第12章 | 高 |\n| Q4 | 等保定级级别（二级/三级）？是否已完成定级备案？ | 第12章 | 高 |\n| Q5 | 是否有具体的量化业务目标（维保执行率提升至 X%、数据准确率 Y%、缺件风险下降 Z%等）？ | 第2章 | 高 |\n| Q6 | 报表/看板的具体清单和指标口径？是否需要定时推送/导出？看板服务对象和刷新频率？ | 第11章 | 中 |\n| Q7 | 移动端支持的平台（iOS/Android/鸿蒙）？功能边界是否与 PC 端一致？ | 第12章 | 中 |\n| Q8 | 通知方式（短信/邮件/企微/钉钉/站内信）？各场景对应哪些通知？预警通知触发规则和通知对象？是否需要电子签章/即时通讯集成？ | 第12章 | 中 |\n| Q9 | 并发用户数、响应时间、数据量预期等性能指标要求？ | 第12章 | 中 |\n| Q10 | AMOS 历史数据迁移的截止时间点（封账基准日）？历史数据保留期限？ | 第8/9章 | 中 |\n| Q11 | 采购需求提报到采办 2.0 的具体数据字段和触发条件？订单状态回传字段范围？ | 第10章 | 中 |\n| Q12 | 船岸同步的频率（实时/定时）？卫星通信带宽约束？冲突仲裁具体规则？大附件处理策略？ | 第8章 | 中 |\n| Q13 | 航前健康校验的判定规则（哪些设备/物资/资质不通过则拦截开航）？校验不通过的处置流程？航前校验记录的具体字段？ | 第5/7/9章 | 高 |\n| Q14 | 是否需要多语言支持（中/英）？是否涉及外籍船员？ | 第12章 | 低 |\n| Q15 | 轻量化三维/业务孪生在核心设备定位和维保辅助展示的具体范围？ | 第6章 | 低 |\n| Q16 | PMS 计划自动生成的具体规则（周期/工况/条件触发）？工单状态流转的完整节点？ | 第5/7章 | 高 |\n| Q17 | 是否需要对接财务系统实现预算核减自动记账？ | 第10章 | 中 |\n| Q18 | 是否需要委托/代理/会签/加签等特殊审批机制？ | 第12章 | 低 |\n| Q19 | 数据权限隔离的具体规则（按船舶/部门/角色）？ | 第12章 | 中 |\n| Q20 | 调度指挥人员（与船队可视化指挥调度系统协同）的具体角色与职责？ | 第4章 | 中 |\n| Q21 | 与船队可视化指挥调度系统、能耗采集系统的具体接口字段和交互频率？ | 第10章 | 中 |\n| Q22 | 设备健康度评估模型与库存预警阈值规则？ | 第9章 | 中 |\n",
      "manualRequirement": "",
      "attachmentText": "",
      "attachments": [],
      "analysis": {
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
        "userRoles": [
          {
            "name": "岸基机务人员",
            "responsibility": "机务管理、设备维保监督，日常机务管理"
          },
          {
            "name": "船舶管理人员",
            "responsibility": "船舶运行管理，日常船舶管理"
          },
          {
            "name": "船端一线作业人员",
            "responsibility": "工单执行、报工、盘点，弱网/无网环境下移动作业，移动端离线报工、扫码盘点、拍照留痕，船端日常维保作业"
          },
          {
            "name": "系统管理员",
            "responsibility": "组织权限配置、流程配置、统一身份管理"
          },
          {
            "name": "审计员",
            "responsibility": "查阅关键操作日志，支撑合规审计与ISM/船级社审查"
          },
          {
            "name": "采办协同人员",
            "responsibility": "采购需求提报、物资验收、预算核减确认"
          }
        ],
        "questions": [
          "2艘试点船具体是哪两艘？选择标准是什么？",
          "国产数据库具体采用哪款（人大金仓/达梦/其他）？版本？",
          "国产操作系统具体采用哪款（麒麟哪个版本/统信/其他）？",
          "等保定级级别（二级/三级）？是否已完成定级备案？",
          "是否有具体的量化业务目标（维保执行率提升至X%、数据准确率Y%等）？",
          "航前健康校验的判定规则（哪些设备/物资/资质不通过则拦截开航）？校验不通过的处置流程？",
          "PMS计划自动生成的具体规则（周期/工况/条件触发）？工单状态流转的完整节点？"
        ],
        "clarificationInsights": [],
        "importedMarkdownName": "项目需求预整理_20260706.md",
        "attachments": [],
        "generationSource": "deepseek",
        "questionResponses": [
          {
            "question": "2艘试点船具体是哪两艘？选择标准是什么？",
            "answer": ""
          },
          {
            "question": "国产数据库具体采用哪款（人大金仓/达梦/其他）？版本？",
            "answer": ""
          },
          {
            "question": "国产操作系统具体采用哪款（麒麟哪个版本/统信/其他）？",
            "answer": ""
          },
          {
            "question": "等保定级级别（二级/三级）？是否已完成定级备案？",
            "answer": ""
          },
          {
            "question": "是否有具体的量化业务目标（维保执行率提升至X%、数据准确率Y%等）？",
            "answer": ""
          },
          {
            "question": "航前健康校验的判定规则（哪些设备/物资/资质不通过则拦截开航）？校验不通过的处置流程？",
            "answer": ""
          },
          {
            "question": "PMS计划自动生成的具体规则（周期/工况/条件触发）？工单状态流转的完整节点？",
            "answer": ""
          }
        ],
        "clarificationMessages": []
      }
    },
    "scenarioGenerationMeta": {
      "source": "llm",
      "basedOn": "prototype_factory/local_step_outputs/requirement.md",
      "generatedAt": "2026-07-06T16:03:34.960Z",
      "planningNotes": [
        "每个核心角色至少包含一个P0场景，确保业务闭环可覆盖",
        "弱网/无网移动端场景独立为‘移动端工单执行与离线报工’，突出离线能力",
        "航前健康校验作为独立场景体现开航拦截闭环，其判定规则依据questionResponses待确认",
        "物资备件与采购协同独立为‘采购需求与物资验收’，与库存预警联动",
        "系统管理员场景拆分为权限配置与系统监控，审计员场景独立支撑合规审计",
        "所有场景基于requirementBrief中原有角色和业务目标推导，未引入外部系统或规则"
      ],
      "requirementSavedAt": "",
      "requirementProjectName": "船舶维护 PMS"
    },
    "activeKey": "sc-11",
    "savedAt": "2026-07-06T23:49:15.144Z",
    "requirementSnapshotKey": "v1:a82e1d80:13921"
  },
  "selectedPage": {
    "key": "sc-11-page-3-2",
    "name": "到货验收与入库处理",
    "vueFile": "GoodsReceiptAndInspection.vue",
    "goal": "对已到货的物资进行扫码验收，录入检验结果，执行入库或退换货操作",
    "features": [
      "到货验收与入库处理"
    ],
    "sections": [
      "订单选择区（下拉选择或搜索待验收的采购订单）",
      "条码扫描/手动录入区（支持摄像头扫描或输入框）",
      "物料明细核对区（显示订单物料、应到数量、实到数量输入框、外观检验结果选择）",
      "附件上传区（照片、质检报告）",
      "检验结论与操作区（合格/部分合格/不合格按钮，入库/退换货确认）",
      "历史记录与跟踪区（入库记录、退换货单列表）"
    ],
    "fields": [
      {
        "name": "orderId",
        "label": "待验收采购订单",
        "type": "select",
        "required": true,
        "description": "通过下拉选择或搜索待验收的采购订单，加载订单物料信息"
      },
      {
        "name": "barcode",
        "label": "物料条码",
        "type": "text",
        "required": true,
        "description": "支持摄像头扫描或手动输入，用于快速定位物料"
      },
      {
        "name": "receivedQuantity",
        "label": "实到数量",
        "type": "number",
        "required": true,
        "description": "实际到货的物料数量"
      },
      {
        "name": "appearanceResult",
        "label": "外观检验结果",
        "type": "radio",
        "required": true,
        "description": "选项：合格、不合格"
      },
      {
        "name": "attachments",
        "label": "附件（照片/质检报告）",
        "type": "file",
        "required": false,
        "description": "支持多文件上传，用于佐证检验结论"
      },
      {
        "name": "defectReason",
        "label": "不合格原因及处理意见",
        "type": "textarea",
        "required": false,
        "description": "仅在检验结论为不合格或部分不合格时必填，用于发起退换货"
      }
    ],
    "actions": [
      {
        "label": "确认验收",
        "trigger": "点击按钮，触发检验结论弹窗（合格/部分合格/不合格）",
        "feedback": "根据选择执行入库或退换货：合格则自动更新库存台账并核减预算，显示成功信息；部分合格则部分入库+部分退换货；不合格则全部退换货，生成退换货单并通知供应商"
      },
      {
        "label": "选择订单",
        "trigger": "从订单选择下拉框中选中一项",
        "feedback": "自动加载该订单的物料列表，高亮显示物料行"
      },
      {
        "label": "扫描条码",
        "trigger": "摄像头扫描或手动输入条码",
        "feedback": "自动定位到对应物料行，若无法识别则给出错误提示"
      },
      {
        "label": "上传附件",
        "trigger": "选择文件或拍照上传",
        "feedback": "表格相应行显示已上传附件列表，支持预览和删除"
      },
      {
        "label": "提交退换货",
        "trigger": "在退换货弹窗中填写原因并确认",
        "feedback": "生成退换货单，关闭弹窗，列表刷新显示新退换货记录"
      }
    ],
    "validations": [
      "必须选择待验收采购订单",
      "物料条码不能为空，且至少与一个订单物料匹配",
      "实到数量必须为大于等于0的整数",
      "外观检验结果必须选择合格或不合格",
      "当整体检验结论为不合格或部分不合格时，必须填写不合格原因及处理意见",
      "附件上传限制文件类型为图片（jpg/png）、PDF，单文件大小不超过20MB"
    ],
    "states": {
      "empty": {
        "description": "暂无待验收的采购订单，显示空态提示",
        "view": "展示文字提示‘暂无待验收的采购订单’，隐藏操作区域"
      },
      "loading": {
        "description": "订单加载中或扫描识别中",
        "view": "显示加载动画，禁用相关操作按钮"
      },
      "success": {
        "description": "入库或退换货操作成功",
        "view": "显示成功反馈弹窗，自动刷新数据或跳转"
      },
      "error": {
        "description": "条码无法识别、订单信息不匹配或校验失败",
        "view": "显示错误提示，高亮异常字段，允许重新操作"
      }
    },
    "generatedAt": "2026-07-07T00:13:07.552Z"
  },
  "selectedApiContract": {
    "key": "api-sc-11-page-3-2",
    "method": "POST",
    "name": "创建验收记录",
    "path": "/api/inspection/records",
    "goal": "提交到货验收结果，并根据检验结论自动执行入库或退换货处理",
    "trigger": "用户填写完物料验收信息后，点击“确认验收”按钮，在弹窗中选择检验结论并确认提交",
    "requestParams": [
      {
        "name": "orderId",
        "type": "string",
        "required": true,
        "description": "待验收采购订单ID"
      },
      {
        "name": "items",
        "type": "array",
        "required": true,
        "description": "物料验收明细列表，每个元素包含物料编码、条码、实到数量、外观检验结果以及附件"
      },
      {
        "name": "inspectionConclusion",
        "type": "string",
        "required": true,
        "description": "检验结论枚举：PASS（全部合格）、PARTIAL（部分合格）、FAIL（全部不合格）"
      },
      {
        "name": "defectReason",
        "type": "string",
        "required": false,
        "description": "不合格原因及处理意见，当inspectionConclusion为PARTIAL或FAIL时必填"
      }
    ],
    "successResponse": {
      "code": "SUCCESS",
      "message": "验收记录创建成功",
      "data": {
        "inspectionRecordId": "string",
        "stockInResult": {
          "status": "string",
          "inventoryRecordId": "string"
        },
        "returnOrderResult": {
          "status": "string",
          "returnOrderId": "string"
        }
      },
      "traceId": "string"
    },
    "errorResponse": {
      "code": "ERROR",
      "message": "请求处理失败",
      "data": null,
      "traceId": "string"
    },
    "errorCodes": [
      {
        "code": "ORDER_NOT_FOUND",
        "meaning": "采购订单不存在",
        "frontendAdvice": "请重新选择有效的采购订单"
      },
      {
        "code": "MATERIAL_MISMATCH",
        "meaning": "物料条码与订单不匹配",
        "frontendAdvice": "请确认条码正确或重新扫描"
      },
      {
        "code": "INVALID_QUANTITY",
        "meaning": "实到数量无效（非正整数）",
        "frontendAdvice": "请输入大于等于0的整数"
      },
      {
        "code": "INVALID_CONCLUSION",
        "meaning": "检验结论不合法",
        "frontendAdvice": "请选择合格、部分合格或不合格"
      },
      {
        "code": "DEFECT_REASON_REQUIRED",
        "meaning": "不合格时必须填写原因及处理意见",
        "frontendAdvice": "请填写不合格原因及处理意见"
      },
      {
        "code": "STOCK_IN_FAILED",
        "meaning": "入库操作失败",
        "frontendAdvice": "请检查库存与预算，稍后重试"
      },
      {
        "code": "RETURN_ORDER_FAILED",
        "meaning": "创建退换货单失败",
        "frontendAdvice": "请检查供应商信息，稍后重试"
      }
    ],
    "sourcePageKey": "sc-11-page-3-2"
  },
  "selectedModuleApiHints": [
    {
      "key": "mod-3",
      "name": "到货验收与入库处理",
      "description": "物资到货后，采办协同人员进行到货检验。通过扫描物资条码加载采购订单信息，逐项核对实到数量、外观质量，录入检验结论（合格/不合格/部分不合格）。合格则确认入库，系统自动更新库存台账、关联设备BOM并核减预算；不合格则发起退换货流程。",
      "features": [
        "扫描物资条码自动加载采购订单及物料信息，支持手动录入条码",
        "录入实到数量、外观质量检验结果，可关联照片、质检报告等附件",
        "根据检验结论执行：合格则确认入库，系统更新库存、核减预算；不合格则发起退换货，填写不合格原因和处理意见",
        "查看入库历史记录和退换货跟踪"
      ],
      "pageSuggestion": "GoodsReceiptAndInspection.vue",
      "apiHint": "POST /api/inspection/records 创建验收记录；POST /api/inventory/stock-in 确认入库；POST /api/inventory/return-order 创建退换货单；GET /api/procurement/orders/{id} 加载订单信息",
      "dataNeeds": [
        "采购订单详情（物料编码、应到数量）",
        "库存台账（当前库存、安全库存）",
        "设备BOM关联数据",
        "预算账户余额",
        "供应商联系信息（退换货通知）",
        "检验标准文档（可选）"
      ],
      "stateRules": [
        "入库时需校验库存唯一性（一物多码？建议确认编码规范）",
        "退换货需生成退换货单并通知供应商，待供应商处理后再验收",
        "入库操作需同时核减预算，若预算不足则提示（建议确认预算核减规则）",
        "所有操作（验收、入库、退换货）自动记录日志，日志包含操作人、时间、操作类型、变更数据"
      ]
    }
  ],
  "generationStatus": {
    "selectedPageKey": "sc-11-page-3-2",
    "interactionReady": true,
    "apiReady": true
  },
  "savedAt": "2026-07-07T00:13:48.558Z",
  "scenarioPageSnapshotKey": "v1:5dcbdda1:82273"
}
```
<!-- FDE_STEP_RESULT_JSON_END -->
