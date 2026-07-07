# 03 交互与API

- 步骤标识：`interactionapi`
- 保存时间：2026-07-07T12:45:17.030629+00:00
- 用途：作为下一步工作台的输入来源。

## 内容摘要

- **接口**：获取设备健康与履历概览

## 结构化数据

<!-- FDE_STEP_RESULT_JSON_START -->
```json
{
  "generatedPagesByKey": {
    "sc-1-page-1-0": {
      "key": "sc-1-page-1-0",
      "name": "PMS规则与计划管理",
      "vueFile": "PMSRulePlan.vue",
      "goal": "机务人员配置预防性维护规则，基于规则自动或手动生成年度/月度维护计划，并查看计划执行概览。",
      "features": [
        "PMS规则与计划管理"
      ],
      "sections": [
        "顶部操作栏（规则新增、计划生成、版本切换）",
        "规则配置表单（设备类型、工况条件、周期/运行小时/触发事件）",
        "计划列表（年度/月度计划，支持状态筛选）",
        "计划概览统计卡片（待生成工单数、已派发率、计划完成率）"
      ],
      "fields": [
        {
          "name": "equipmentType",
          "label": "设备类型",
          "type": "treeSelect",
          "required": true,
          "description": "从设备资产树中选择，支持多选"
        },
        {
          "name": "condition",
          "label": "工况条件",
          "type": "select",
          "required": false,
          "description": "如：正常运行、恶劣海况、停泊等"
        },
        {
          "name": "cycleType",
          "label": "周期类型",
          "type": "select",
          "required": false,
          "description": "日历周期/运行小时/触发事件"
        },
        {
          "name": "cycleValue",
          "label": "周期值",
          "type": "input",
          "required": false,
          "description": "周期天数或小时数，当周期类型为日历周期或运行小时时必填"
        },
        {
          "name": "triggerEvent",
          "label": "触发事件",
          "type": "input",
          "required": false,
          "description": "触发事件名称，当周期类型为触发事件时必填"
        },
        {
          "name": "planDateRange",
          "label": "计划日期范围",
          "type": "dateRangePicker",
          "required": true,
          "description": "生成计划时选择的起始日期至结束日期"
        },
        {
          "name": "planVersion",
          "label": "计划版本",
          "type": "select",
          "required": false,
          "description": "计划版本切换，下拉选择已有版本"
        },
        {
          "name": "planStatus",
          "label": "计划状态筛选",
          "type": "select",
          "required": false,
          "description": "筛选计划状态：草稿、已发布、执行中、已完成、已作废"
        }
      ],
      "actions": [
        {
          "label": "新增规则",
          "trigger": "点击顶部‘新增规则’按钮",
          "feedback": "弹出侧滑窗，展示规则配置表单，保存后刷新规则列表并显示成功消息"
        },
        {
          "label": "生成计划",
          "trigger": "点击顶部‘生成计划’按钮",
          "feedback": "弹出日期范围选择器，确认后调用后端生成接口，生成完成后刷新计划列表和概览数据"
        },
        {
          "label": "编辑规则",
          "trigger": "点击规则列表行内的编辑图标",
          "feedback": "弹出侧滑窗，预填当前规则数据，保存后刷新规则列表"
        },
        {
          "label": "启用/停用规则",
          "trigger": "点击规则列表行内的启用/停用开关",
          "feedback": "切换规则状态，调用后端接口更新，更新后刷新列表对应行状态"
        },
        {
          "label": "删除规则",
          "trigger": "点击规则列表行内的删除图标",
          "feedback": "弹出二次确认框，确认后删除规则并刷新列表"
        },
        {
          "label": "查看计划详情",
          "trigger": "点击计划列表行",
          "feedback": "跳转至计划详情页（当前步骤仅设计交互，实际跳转留待后续实现）"
        },
        {
          "label": "切换版本",
          "trigger": "选择版本下拉框",
          "feedback": "计划列表和概览数据根据所选版本同步刷新"
        }
      ],
      "validations": [
        "设备类型为必填项",
        "周期类型与周期值/触发事件互斥校验，若选择‘周期’则周期值必填，若选择‘触发事件’则触发事件必填，若选择‘运行小时’则周期值必填",
        "工况条件与周期类型组合需合理，若配置冲突需弹出确认提示",
        "计划日期范围不可为空",
        "操作删除规则时需二次确认"
      ],
      "states": {
        "empty": {
          "rules": "当无规则数据时展示引导卡片：‘请先配置PMS规则’并附新增规则按钮",
          "plans": "当无计划数据时展示提示：‘尚未生成计划，点击生成’并附生成计划按钮"
        },
        "loading": {
          "rules": "展示规则列表骨架屏",
          "plans": "展示计划列表骨架屏"
        },
        "success": {
          "rules": "规则列表正常展示，支持交互",
          "plans": "计划列表正常展示，概览卡片更新"
        },
        "error": {
          "rules": "规则加载失败时展示错误信息及重试按钮",
          "plans": "计划加载失败时展示错误信息及重试按钮"
        }
      },
      "generatedAt": "2026-07-07T12:42:05.618Z"
    },
    "sc-1-page-2-1": {
      "key": "sc-1-page-2-1",
      "name": "工单派发与资源校验",
      "vueFile": "WorkOrderDispatch.vue",
      "goal": "机务人员查看设备资产树与物资BOM关联，评估工单所需备件库存，批量派发工单至船舶并设定执行期限和优先级。",
      "features": [
        "工单派发与资源校验"
      ],
      "sections": [
        "左侧设备资产树（可展开至BOM节点）",
        "右侧工单待办列表（展示待派发工单，含设备、计划日期、所需备件）",
        "底部操作栏（批量派发、查看库存明细、派发日志）",
        "库存校验结果浮标（充足/缺件图标）"
      ],
      "fields": [
        {
          "name": "shipId",
          "label": "选择船舶",
          "type": "select",
          "required": true,
          "description": "派发工单的目标船舶，从船舶列表中选取"
        },
        {
          "name": "executionDeadline",
          "label": "执行期限",
          "type": "date",
          "required": true,
          "description": "工单必须完成的截止日期"
        },
        {
          "name": "priority",
          "label": "优先级",
          "type": "select",
          "required": true,
          "description": "工单执行优先级：高、中、低"
        }
      ],
      "actions": [
        {
          "label": "过滤工单",
          "trigger": "点击设备树节点",
          "feedback": "右侧工单列表更新为选中设备关联的待派发工单"
        },
        {
          "label": "查看库存",
          "trigger": "点击工单行内的“查看库存”按钮",
          "feedback": "弹出BOM备件库存详情窗口，显示备件清单与库存数量"
        },
        {
          "label": "选中工单",
          "trigger": "勾选工单行复选框",
          "feedback": "复选框选中状态变化，底部批量派发按钮可用"
        },
        {
          "label": "批量派发",
          "trigger": "点击“批量派发”按钮",
          "feedback": "弹出派发对话框，包含选择船舶、执行期限、优先级字段；提交后调用派发接口，工单移出待办列表，记录操作日志"
        },
        {
          "label": "触发补货",
          "trigger": "点击缺件工单行的“触发补货”按钮",
          "feedback": "创建补货申请单，并跳转至补货管理页面"
        }
      ],
      "validations": [
        "派发时至少勾选一个待派发工单",
        "选择船舶为必填项",
        "执行期限必填且需晚于当前日期",
        "优先级必选（高/中/低）",
        "库存校验结果：缺件时不允许派发（需先触发补货）"
      ],
      "states": {
        "empty": "无待派发工单时显示“所有工单已派发”提示",
        "loading": "树形组件和列表同时加载骨架屏",
        "success": "正常显示设备资产树和待派发工单列表，库存校验结果标记清晰",
        "error": "设备树或库存接口失败时显示局部错误提示，允许单独重试"
      },
      "generatedAt": "2026-07-07T12:43:03.067Z"
    },
    "sc-1-page-3-2": {
      "key": "sc-1-page-3-2",
      "name": "工单执行监控与异常预警",
      "vueFile": "WorkOrderMonitor.vue",
      "goal": "机务人员通过看板实时监控全船工单执行进度，查看船端反馈的报工记录、照片留痕，并对异常工单进行预警和干预。",
      "features": [
        "工单执行监控与异常预警"
      ],
      "sections": [
        "顶部全局筛选栏（船舶、设备、优先级、状态多选）",
        "工单执行进度看板（卡片式展示各工单状态、进度条、剩余时间）",
        "异常工单预警区（按异常类型分组展示，带颜色标记）",
        "右侧详情侧边栏（点击工单后展示报工记录、照片、干预历史）"
      ],
      "fields": [
        {
          "name": "shipId",
          "label": "船舶",
          "type": "select-multiple",
          "required": false,
          "description": "按船舶筛选工单，支持多选"
        },
        {
          "name": "equipmentId",
          "label": "设备",
          "type": "select-multiple",
          "required": false,
          "description": "按设备筛选工单，支持多选"
        },
        {
          "name": "priority",
          "label": "优先级",
          "type": "select-multiple",
          "required": false,
          "description": "按优先级（高、中、低）筛选"
        },
        {
          "name": "status",
          "label": "状态",
          "type": "select-multiple",
          "required": false,
          "description": "按工单状态筛选，如待执行、执行中、已完成、异常等"
        },
        {
          "name": "interveneRemark",
          "label": "干预备注",
          "type": "textarea",
          "required": true,
          "description": "干预操作时的备注说明，必填"
        }
      ],
      "actions": [
        {
          "label": "筛选工单",
          "trigger": "筛选条件变更（选择或取消选项）",
          "feedback": "重新加载工单看板数据，展示匹配的工单卡片，异常区同步更新"
        },
        {
          "label": "查看工单详情",
          "trigger": "点击工单卡片",
          "feedback": "右侧侧边栏展开，展示工单执行详情、报工记录、照片缩略图（可点击放大）、干预历史"
        },
        {
          "label": "干预工单",
          "trigger": "点击异常工单卡片的快捷干预菜单中的操作项（重新派发、补充物资、驳回重做、删除）",
          "feedback": "弹出二次确认对话框，确认后执行对应操作，更新看板数据并记录操作日志"
        },
        {
          "label": "刷新看板",
          "trigger": "点击手动刷新按钮 或 每30秒自动触发",
          "feedback": "重新请求工单看板数据，更新所有卡片和异常预警区内容"
        },
        {
          "label": "查看照片",
          "trigger": "点击照片缩略图",
          "feedback": "打开照片预览大图，支持左右滑动查看多张"
        }
      ],
      "validations": [
        "干预操作需二次确认才能执行",
        "筛选条件至少选择一个，否则显示所有工单",
        "干预备注为必填项"
      ],
      "states": {
        "empty": "无工单时显示“暂无工单”插图，无异常预警",
        "loading": "看板骨架屏加载，同时触发初次数据请求",
        "success": "正常展示看板卡片和异常预警区，每30秒自动刷新",
        "error": "数据接口失败时显示错误遮罩和重试按钮，可点击重试；船端离线时对应工单卡片标记“船端离线”"
      },
      "generatedAt": "2026-07-07T12:43:55.054Z"
    },
    "sc-1-page-4-3": {
      "key": "sc-1-page-4-3",
      "name": "工单审核与闭环处理",
      "vueFile": "WorkOrderReview.vue",
      "goal": "机务人员对船端提交的完工工单进行审核，确认质量合格后关闭工单并归档维保记录；不合格则驳回重做。",
      "features": [
        "工单审核与闭环处理"
      ],
      "sections": [
        "顶部筛选区（按船舶、设备、审核状态筛选）",
        "待审核工单列表（展示完工待审工单，含报工摘要、照片缩略图、质检指标）",
        "审核操作面板（审核结论：通过关闭、驳回重做、要求补充说明）",
        "审核历史列表（已审核工单的审核记录，支持查询和追溯）"
      ],
      "fields": [
        {
          "name": "filterVessel",
          "label": "船舶",
          "type": "select",
          "required": false,
          "description": "按船舶筛选待审核工单"
        },
        {
          "name": "filterEquipment",
          "label": "设备",
          "type": "select",
          "required": false,
          "description": "按设备筛选待审核工单"
        },
        {
          "name": "filterReviewStatus",
          "label": "审核状态",
          "type": "select",
          "required": false,
          "description": "按审核状态筛选工单，可选值：待审核、已通过、已驳回"
        },
        {
          "name": "reviewConclusion",
          "label": "审核结论",
          "type": "select",
          "required": true,
          "description": "审核结论：通过关闭、驳回重做、要求补充说明"
        },
        {
          "name": "reviewRemark",
          "label": "审核备注",
          "type": "textarea",
          "required": false,
          "description": "审核意见备注，当审核结论为驳回时必填"
        }
      ],
      "actions": [
        {
          "label": "查看工单详情",
          "trigger": "点击工单行",
          "feedback": "展开或弹出详情窗，展示完整报工报告、照片对比、质检记录"
        },
        {
          "label": "提交审核",
          "trigger": "选择审核结论并填写备注后点击提交按钮",
          "feedback": "调用POST /api/workorders/{id}/review，成功后待审核列表刷新，审核历史新增记录；失败时显示错误提示并保持原数据"
        },
        {
          "label": "检索审核历史",
          "trigger": "在审核历史区域输入筛选条件（时间、船舶、工单ID）并点击查询",
          "feedback": "更新审核历史列表，显示匹配的已审核工单记录"
        }
      ],
      "validations": [
        "审核结论必选，不可为空",
        "当审核结论为'驳回重做'或'要求补充说明'时，审核备注必填，且长度不超过500字",
        "审核备注支持纯文本，不得包含特殊字符"
      ],
      "states": {
        "empty": {
          "description": "无待审核工单时，待审核列表显示'所有工单已审核'提示，审核历史列表正常显示",
          "ui": "提示文字居中，不显示列表内容"
        },
        "loading": {
          "description": "待审核列表加载中或审核提交中",
          "ui": "列表区域显示骨架屏，提交按钮显示加载图标并禁用"
        },
        "success": {
          "description": "审核提交成功",
          "ui": "弹出成功提示，待审核列表自动刷新，审核历史尾部新增记录，工单状态更新"
        },
        "error": {
          "description": "审核提交失败或数据获取失败",
          "ui": "显示错误提示（如'提交失败，请重试'），原输入数据不被清空，待审核列表显示兜底提示"
        }
      },
      "generatedAt": "2026-07-07T12:44:16.279Z"
    },
    "sc-1-page-5-4": {
      "key": "sc-1-page-5-4",
      "name": "设备健康状态与履历管理",
      "vueFile": "EquipmentHealth.vue",
      "goal": "查看设备维保履历与健康度评估，根据预设规则触发PMS计划调整或物资预警。",
      "features": [
        "设备健康状态与履历管理"
      ],
      "sections": [
        "顶部设备选择器（船舶→设备树筛选）",
        "设备健康度概览卡片（健康度等级、维保频次、故障次数、工况状态）",
        "维保履历时间线（按时间倒序展示历史工单、执行结果、照片）",
        "触发规则配置面板（查看/修改自动调整条件和预警联动规则）",
        "操作日志与审计记录"
      ],
      "fields": [
        {
          "name": "deviceSelector",
          "label": "设备选择器",
          "type": "tree-select",
          "required": true,
          "description": "船舶→设备树，用于切换当前查看的设备"
        },
        {
          "name": "adjustmentRule.maxOverdueCount",
          "label": "连续超期次数阈值",
          "type": "number",
          "required": false,
          "description": "连续超期超过该次数后自动触发周期缩短"
        },
        {
          "name": "adjustmentRule.qualifiedRateThreshold",
          "label": "合格率阈值",
          "type": "number",
          "required": false,
          "description": "维保合格率低于该值时触发预警调整"
        },
        {
          "name": "adjustmentRule.autoShortenCycle",
          "label": "自动缩短周期",
          "type": "switch",
          "required": false,
          "description": "是否启用自动缩短维保周期"
        },
        {
          "name": "alertRule.enabled",
          "label": "物资预警联动",
          "type": "switch",
          "required": false,
          "description": "关键备件消耗后自动生成预警记录"
        }
      ],
      "actions": [
        {
          "label": "切换设备",
          "trigger": "设备选择器值变更",
          "feedback": "重新加载设备健康概览、履历时间线、规则配置和预警信息"
        },
        {
          "label": "查看工单详情",
          "trigger": "点击维保履历时间线上的工单条目",
          "feedback": "以新标签页或侧滑窗打开对应工单详情页面"
        },
        {
          "label": "编辑规则",
          "trigger": "点击触发规则配置面板中的编辑按钮",
          "feedback": "规则字段变为可编辑状态，显示保存/取消按钮"
        },
        {
          "label": "保存规则",
          "trigger": "点击保存按钮",
          "feedback": "调用后台接口保存规则，成功后显示成功提示并刷新数据；失败时显示错误提示"
        },
        {
          "label": "查看预警",
          "trigger": "点击物资预警记录",
          "feedback": "打开预警详情弹窗或跳转至预警页面"
        }
      ],
      "validations": [
        "调整条件阈值必须为正整数",
        "合格率阈值范围应在0-100之间",
        "保存规则时至少启用一个调整条件"
      ],
      "states": {
        "empty": "首次使用或无维保记录时，显示占位提示“暂无维保记录”",
        "loading": "使用骨架屏展示设备健康概览和履历时间线等待状态",
        "success": "正常展示设备健康概览卡片、履历时间线、规则配置及预警信息",
        "error": "数据加载失败时，在相应区域显示错误提示及重试按钮"
      },
      "generatedAt": "2026-07-07T12:44:46.230Z"
    }
  },
  "generatedApiByPageKey": {
    "sc-1-page-1-0": {
      "key": "api-sc-1-page-1-0",
      "method": "POST",
      "name": "生成计划",
      "path": "/api/pms/plans/generate",
      "goal": "基于当前所有有效PMS规则和选择的日期范围，自动生成年度/月度预防性维护计划，并返回新计划的基本信息",
      "trigger": "用户在PMS规则与计划管理页点击“生成计划”按钮，在弹出日期范围选择器中确认后触发",
      "requestParams": [
        {
          "name": "startDate",
          "type": "string",
          "required": true,
          "description": "计划起始日期，格式 yyyy-MM-dd"
        },
        {
          "name": "endDate",
          "type": "string",
          "required": true,
          "description": "计划结束日期，格式 yyyy-MM-dd"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "计划生成成功",
        "data": {
          "planId": "P2026010001",
          "version": "V1.0",
          "status": "draft",
          "startDate": "2026-01-01",
          "endDate": "2026-12-31",
          "totalWorkOrders": 120,
          "generatedAt": "2026-01-10T14:30:00Z"
        },
        "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
      },
      "errorResponse": {
        "code": 500,
        "message": "服务器内部错误",
        "data": null,
        "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
      },
      "errorCodes": [
        {
          "code": 400,
          "meaning": "请求参数错误（日期范围为空、格式错误或结束日期早于起始日期）",
          "frontendAdvice": "提示用户检查日期范围是否有效"
        },
        {
          "code": 409,
          "meaning": "所选日期范围内已存在计划，无法重复生成",
          "frontendAdvice": "提示用户该时间段已有计划，请调整日期或切换到历史版本查看"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "显示生成失败，请稍后重试"
        }
      ],
      "sourcePageKey": "sc-1-page-1-0"
    },
    "sc-1-page-2-1": {
      "key": "api-sc-1-page-2-1",
      "method": "POST",
      "name": "工单批量派发",
      "path": "/api/workorders/dispatch",
      "goal": "将选中的待派发工单批量派发至指定船舶，并设置执行期限和优先级",
      "trigger": "用户勾选多个待派发工单后，点击“批量派发”按钮，填写派发对话框中的船舶、执行期限、优先级，点击确认后触发",
      "requestParams": [
        {
          "name": "workOrderIds",
          "type": "array",
          "required": true,
          "description": "待派发的工单ID数组"
        },
        {
          "name": "shipId",
          "type": "string",
          "required": true,
          "description": "目标船舶ID"
        },
        {
          "name": "executionDeadline",
          "type": "string",
          "required": true,
          "description": "工单执行期限，格式YYYY-MM-DD"
        },
        {
          "name": "priority",
          "type": "string",
          "required": true,
          "description": "优先级：high/medium/low"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "成功",
        "data": {
          "dispatchedWorkOrderIds": [
            "WO001",
            "WO002"
          ],
          "failedWorkOrderIds": []
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
          "meaning": "请求参数校验失败，如缺少必填字段、执行期限早于当前日期等",
          "frontendAdvice": "提示用户检查输入信息并修正"
        },
        {
          "code": 404,
          "meaning": "工单不存在或状态不是待派发",
          "frontendAdvice": "提示用户刷新列表，可能工单已被其他操作处理"
        },
        {
          "code": 409,
          "meaning": "部分工单已派发或存在冲突",
          "frontendAdvice": "提示具体冲突原因，让用户确认是否继续或重新选择"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "提示用户稍后重试，并记录错误日志"
        }
      ],
      "sourcePageKey": "sc-1-page-2-1"
    },
    "sc-1-page-3-2": {
      "key": "api-sc-1-page-3-2",
      "method": "GET",
      "name": "获取工单看板数据",
      "path": "/api/workorders/dashboard",
      "goal": "机务人员通过看板实时监控全船工单执行进度，获取工单列表及异常预警信息",
      "trigger": "页面加载、筛选条件变更、手动刷新、每30秒自动刷新",
      "requestParams": [
        {
          "name": "shipId",
          "type": "string",
          "required": false,
          "description": "按船舶筛选工单，支持多选，多个值用逗号分隔"
        },
        {
          "name": "equipmentId",
          "type": "string",
          "required": false,
          "description": "按设备筛选工单，支持多选，多个值用逗号分隔"
        },
        {
          "name": "priority",
          "type": "string",
          "required": false,
          "description": "按优先级筛选，如 high,medium,low，支持多选"
        },
        {
          "name": "status",
          "type": "string",
          "required": false,
          "description": "按工单状态筛选，如 pending,in_progress,completed,abnormal，支持多选"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "成功",
        "data": {
          "workOrders": [
            {
              "id": "工单ID",
              "title": "工单标题",
              "shipName": "船舶名称",
              "equipmentName": "设备名称",
              "priority": "优先级",
              "status": "当前状态",
              "progress": 75,
              "remainingTime": "剩余时间描述",
              "isOffline": false,
              "abnormalType": null
            }
          ],
          "abnormalAlerts": [
            {
              "type": "overdue",
              "level": "yellow",
              "count": 2,
              "items": [
                {
                  "workOrderId": "工单ID",
                  "title": "工单标题",
                  "overdueDays": 1
                }
              ]
            },
            {
              "type": "missing_parts",
              "level": "gray",
              "count": 1,
              "items": []
            },
            {
              "type": "quality_fail",
              "level": "red",
              "count": 0,
              "items": []
            }
          ]
        },
        "traceId": "请求追踪ID"
      },
      "errorResponse": {
        "code": 500,
        "message": "服务器内部错误",
        "data": null,
        "traceId": "请求追踪ID"
      },
      "errorCodes": [
        {
          "code": 400,
          "meaning": "请求参数格式错误",
          "frontendAdvice": "检查筛选参数格式是否正确，如多选用逗号分隔"
        },
        {
          "code": 401,
          "meaning": "未授权访问",
          "frontendAdvice": "请重新登录后重试"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "显示错误遮罩和重试按钮，提示用户稍后重试"
        }
      ],
      "sourcePageKey": "sc-1-page-3-2"
    },
    "sc-1-page-4-3": {
      "key": "api-sc-1-page-4-3",
      "method": "POST",
      "name": "提交工单审核",
      "path": "/api/workorders/{id}/review",
      "goal": "机务人员对船端提交的完工工单进行审核，确认质量合格后关闭工单并归档维保记录；不合格则驳回重做或要求补充说明。",
      "trigger": "用户在审核操作面板选择审核结论、填写备注后点击提交按钮",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": true,
          "description": "工单ID，路径参数"
        },
        {
          "name": "reviewConclusion",
          "type": "string",
          "required": true,
          "description": "审核结论，可选值：pass（通过关闭）、reject（驳回重做）、request_supplement（要求补充说明）"
        },
        {
          "name": "reviewRemark",
          "type": "string",
          "required": false,
          "description": "审核意见备注，审核结论为reject或request_supplement时必填，长度不超过500字"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "审核提交成功",
        "data": {
          "workOrderId": "string",
          "status": "closed|in_progress|pending_supplement",
          "reviewRecord": {
            "id": "string",
            "conclusion": "string",
            "remark": "string",
            "reviewer": "string",
            "reviewTime": "string"
          }
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
          "meaning": "审核结论缺失或无效",
          "frontendAdvice": "提示用户选择正确的审核结论"
        },
        {
          "code": 4002,
          "meaning": "驳回时审核备注为空",
          "frontendAdvice": "提示用户填写驳回原因"
        },
        {
          "code": 4003,
          "meaning": "工单当前状态不允许审核（非待审核状态）",
          "frontendAdvice": "提示用户工单状态已变更，请刷新列表"
        },
        {
          "code": 4004,
          "meaning": "审核人权限不足",
          "frontendAdvice": "提示用户联系管理员分配审核权限"
        },
        {
          "code": 5001,
          "meaning": "服务器内部错误",
          "frontendAdvice": "显示通用错误提示，建议稍后重试"
        }
      ],
      "sourcePageKey": "sc-1-page-4-3"
    },
    "sc-1-page-5-4": {
      "key": "api-sc-1-page-5-4",
      "method": "GET",
      "name": "获取设备健康与履历概览",
      "path": "/api/equipment/{id}/dashboard",
      "goal": "获取指定设备的健康状态概览和维保履历列表，用于页面初始加载和设备切换后的数据刷新",
      "trigger": "进入页面或切换设备选择器时调用",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": true,
          "description": "设备ID（路径参数）"
        },
        {
          "name": "page",
          "type": "integer",
          "required": false,
          "description": "履历分页页码，默认1"
        },
        {
          "name": "size",
          "type": "integer",
          "required": false,
          "description": "每页条数，默认20"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "成功",
        "data": {
          "health": {
            "level": "良好|注意|警告|严重",
            "maintenanceFrequency": "每季度一次",
            "faultCount": 3,
            "workingCondition": "正常|异常"
          },
          "history": {
            "total": 50,
            "records": [
              {
                "workOrderId": "WO-20250101",
                "title": "主机润滑油系统保养",
                "executionResult": "完成",
                "photos": [
                  "https://oss.example.com/photo1.jpg"
                ],
                "completedAt": "2025-01-15 10:30:00"
              }
            ]
          }
        },
        "traceId": "a1b2c3d4"
      },
      "errorResponse": {
        "code": -1,
        "message": "失败",
        "data": null,
        "traceId": "e5f6g7h8"
      },
      "errorCodes": [
        {
          "code": 1001,
          "meaning": "设备ID不存在",
          "frontendAdvice": "提示用户设备不存在，返回设备列表页"
        },
        {
          "code": 1002,
          "meaning": "数据查询异常",
          "frontendAdvice": "显示错误提示并显示重试按钮，允许用户重新加载"
        }
      ],
      "sourcePageKey": "sc-1-page-5-4"
    }
  },
  "scenarioPageGroups": [
    {
      "key": "sc-1",
      "name": "岸基机务人员设备维保计划管理与工单监控",
      "priority": "P0",
      "pages": [
        {
          "key": "sc-1-page-1-0",
          "priority": "P0",
          "type": "工作台页",
          "name": "PMS规则与计划管理",
          "vueFile": "PMSRulePlan.vue",
          "goal": "机务人员配置预防性维护规则，基于规则自动或手动生成年度/月度维护计划，并查看计划执行概览。",
          "features": [
            "PMS规则与计划管理"
          ],
          "sections": [
            "顶部操作栏（规则新增、计划生成、版本切换）",
            "规则配置表单（设备类型、工况条件、周期/运行小时/触发事件）",
            "计划列表（年度/月度计划，支持状态筛选）",
            "计划概览统计卡片（待生成工单数、已派发率、计划完成率）"
          ],
          "states": [
            "正常态：展示规则列表、计划列表及概览统计",
            "空态：无规则时显示“请先配置PMS规则”引导卡片；无计划时显示“尚未生成计划，点击生成”",
            "加载态：展示骨架屏，规则和计划分别加载",
            "异常态：规则或计划数据加载失败时显示重试按钮和错误信息"
          ],
          "keyInteractions": [
            "点击“新增规则”按钮弹出侧滑窗，填写规则后保存并刷新列表",
            "点击“生成计划”按钮，弹出日期范围选择器，确认后调用后端生成接口",
            "计划列表支持行点击进入计划详情（暂不实现，留作后续）",
            "版本切换下拉框，选择不同版本后计划列表和概览数据同步刷新",
            "规则列表行内操作：编辑、启用/停用、删除"
          ],
          "dataInputs": [
            "PMS规则列表（GET /api/pms/rules）",
            "计划执行概览（GET /api/pms/plans/summary?year=2026）",
            "计划列表（GET /api/pms/plans?status=draft,published,executing,completed,cancelled）",
            "设备资产树（用于规则关联设备类型，GET /api/equipment/tree）"
          ],
          "originalPageKey": "page-1",
          "scenarioKey": "sc-1",
          "scenarioName": "岸基机务人员设备维保计划管理与工单监控"
        },
        {
          "key": "sc-1-page-2-1",
          "priority": "P0",
          "type": "列表页",
          "name": "工单派发与资源校验",
          "vueFile": "WorkOrderDispatch.vue",
          "goal": "机务人员查看设备资产树与物资BOM关联，评估工单所需备件库存，批量派发工单至船舶并设定执行期限和优先级。",
          "features": [
            "工单派发与资源校验"
          ],
          "sections": [
            "左侧设备资产树（可展开至BOM节点）",
            "右侧工单待办列表（展示待派发工单，含设备、计划日期、所需备件）",
            "底部操作栏（批量派发、查看库存明细、派发日志）",
            "库存校验结果浮标（充足/缺件图标）"
          ],
          "states": [
            "正常态：显示设备树和待派发工单列表，库存校验结果标记清晰",
            "空态：无待派发工单时显示“所有工单已派发”提示",
            "加载态：树形组件和列表同时加载骨架屏",
            "异常态：设备树或库存接口失败时显示局部错误提示，允许单独重试"
          ],
          "keyInteractions": [
            "点击设备树节点，右侧工单列表过滤为所选设备关联工单",
            "工单行内“查看库存”弹出BOM备件库存详情窗",
            "勾选多个工单后点击“批量派发”，弹出派发对话框（选择船舶、执行期限、优先级）",
            "派发成功后，工单移出待办列表，并在操作日志中记录",
            "缺件工单行显示“触发补货”按钮，点击创建补货申请单"
          ],
          "dataInputs": [
            "待派发工单列表（GET /api/workorders?status=pending）",
            "设备资产树（GET /api/equipment/tree）",
            "物资库存校验（GET /api/inventory/check?workOrderIds=...）",
            "船舶列表（GET /api/ships）",
            "派发操作（POST /api/workorders/dispatch）"
          ],
          "originalPageKey": "page-2",
          "scenarioKey": "sc-1",
          "scenarioName": "岸基机务人员设备维保计划管理与工单监控"
        },
        {
          "key": "sc-1-page-3-2",
          "priority": "P0",
          "type": "看板页",
          "name": "工单执行监控与异常预警",
          "vueFile": "WorkOrderMonitor.vue",
          "goal": "机务人员通过看板实时监控全船工单执行进度，查看船端反馈的报工记录、照片留痕，并对异常工单进行预警和干预。",
          "features": [
            "工单执行监控与异常预警"
          ],
          "sections": [
            "顶部全局筛选栏（船舶、设备、优先级、状态多选）",
            "工单执行进度看板（卡片式展示各工单状态、进度条、剩余时间）",
            "异常工单预警区（按异常类型分组展示，带颜色标记）",
            "右侧详情侧边栏（点击工单后展示报工记录、照片、干预历史）"
          ],
          "states": [
            "正常态：看板展示全量工单，异常区显示预警卡片",
            "空态：无工单时显示“暂无工单”插画",
            "加载态：看板骨架屏，同时触发定时刷新",
            "异常态：工单数据接口失败时显示错误遮罩及重试按钮",
            "离线或弱网提示：当船端同步中断时，对应船舶工单卡片显示“船端离线”标记"
          ],
          "keyInteractions": [
            "筛选条件变化时重新加载工单看板数据",
            "点击工单卡片打开右侧详情侧边栏，展示报工详情、照片留痕（图片缩略图可点击放大）",
            "异常工单卡片提供快捷干预菜单（重新派发、补充物资、驳回重做、删除）",
            "干预操作需二次确认，并计入操作日志",
            "看板支持自动刷新（每30秒），也可手动点击刷新按钮"
          ],
          "dataInputs": [
            "工单看板数据（GET /api/workorders/dashboard?shipId=&priority=&status=&equipmentId=）",
            "工单执行详情（GET /api/workorders/{id}/execution）",
            "报工附件照片（GET /api/workorders/{id}/attachments）",
            "干预操作（POST /api/workorders/{id}/intervene）"
          ],
          "originalPageKey": "page-3",
          "scenarioKey": "sc-1",
          "scenarioName": "岸基机务人员设备维保计划管理与工单监控"
        },
        {
          "key": "sc-1-page-4-3",
          "priority": "P0",
          "type": "列表页",
          "name": "工单审核与闭环处理",
          "vueFile": "WorkOrderReview.vue",
          "goal": "机务人员对船端提交的完工工单进行审核，确认质量合格后关闭工单并归档维保记录；不合格则驳回重做。",
          "features": [
            "工单审核与闭环处理"
          ],
          "sections": [
            "顶部筛选区（按船舶、设备、审核状态筛选）",
            "待审核工单列表（展示完工待审工单，含报工摘要、照片缩略图、质检指标）",
            "审核操作面板（审核结论：通过关闭、驳回重做、要求补充说明）",
            "审核历史列表（已审核工单的审核记录，支持查询和追溯）"
          ],
          "states": [
            "正常态：展示待审核列表和审核历史，操作面板可用",
            "空态：无待审核工单时显示“所有工单已审核”提示",
            "加载态：列表骨架屏",
            "异常态：审核提交失败时显示错误提示并保持原数据"
          ],
          "keyInteractions": [
            "点击工单行展开或弹出详情窗，查看完整报工报告、照片对比、质检记录",
            "选择审核结论并填写备注（驳回时必须填写原因），点击提交",
            "提交后待审核列表刷新，审核历史尾部新增记录",
            "审核历史支持按时间、船舶、工单ID检索",
            "审核通过后，工单状态变更为“已关闭”，并触发设备健康状态更新（调用后台接口）"
          ],
          "dataInputs": [
            "待审核工单列表（GET /api/workorders?status=pending_review）",
            "工单执行报告（GET /api/workorders/{id}/report）",
            "审核历史（GET /api/workorders/{id}/review/history）",
            "审核操作（POST /api/workorders/{id}/review）"
          ],
          "originalPageKey": "page-4",
          "scenarioKey": "sc-1",
          "scenarioName": "岸基机务人员设备维保计划管理与工单监控"
        },
        {
          "key": "sc-1-page-5-4",
          "priority": "P1",
          "type": "详情页",
          "name": "设备健康状态与履历管理",
          "vueFile": "EquipmentHealth.vue",
          "goal": "查看设备维保履历与健康度评估，根据预设规则触发PMS计划调整或物资预警。",
          "features": [
            "设备健康状态与履历管理"
          ],
          "sections": [
            "顶部设备选择器（船舶→设备树筛选）",
            "设备健康度概览卡片（健康度等级、维保频次、故障次数、工况状态）",
            "维保履历时间线（按时间倒序展示历史工单、执行结果、照片）",
            "触发规则配置面板（查看/修改自动调整条件和预警联动规则）",
            "操作日志与审计记录"
          ],
          "states": [
            "正常态：展示所选设备的健康概览和履历时间线",
            "空态：首次使用时显示“暂无维保记录”",
            "加载态：骨架屏加载设备数据和履历",
            "异常态：设备数据加载失败时显示错误提示",
            "设备未绑定BOM或无工况数据时给出提示"
          ],
          "keyInteractions": [
            "切换设备时重新加载所有数据",
            "点击时间线上的历史工单可跳转至对应工单详情（通过新标签页或侧滑窗）",
            "健康度等级变更时系统自动记录变更原因",
            "触发调整面板支持编辑规则（如连续两次超期自动缩短周期），保存后调用后台接口",
            "关联物资预警：当关键备件消耗后，系统自动生成预警记录，点击可查看预警详情"
          ],
          "dataInputs": [
            "设备健康状态（GET /api/equipment/{id}/health）",
            "维保履历（GET /api/equipment/{id}/history）",
            "工况实时数据（GET /api/equipment/{id}/workingCondition）",
            "触发规则配置（GET /api/equipment/{id}/adjustmentRules）",
            "物资预警联动（GET /api/equipment/{id}/relatedAlerts）"
          ],
          "originalPageKey": "page-5",
          "scenarioKey": "sc-1",
          "scenarioName": "岸基机务人员设备维保计划管理与工单监控"
        }
      ]
    },
    {
      "key": "sc-2",
      "name": "船舶管理人员航前健康校验与调度校验",
      "priority": "P0",
      "pages": []
    },
    {
      "key": "sc-3",
      "name": "船端一线作业人员移动端离线工单执行与报工",
      "priority": "P0",
      "pages": []
    },
    {
      "key": "sc-4",
      "name": "船端一线作业人员物资扫码盘点与库存预警",
      "priority": "P1",
      "pages": []
    },
    {
      "key": "sc-5",
      "name": "采办协同人员物资采购需求提报与验收",
      "priority": "P1",
      "pages": []
    },
    {
      "key": "sc-6",
      "name": "系统管理员组织权限与流程配置",
      "priority": "P1",
      "pages": []
    },
    {
      "key": "sc-7",
      "name": "审计员操作日志审计与合规查询",
      "priority": "P1",
      "pages": []
    }
  ],
  "pageDesign": {
    "roles": [
      {
        "id": "role-1783428011551-0",
        "name": "岸基机务人员",
        "focus": "机务管理、设备维保监督",
        "tagText": "设备维保监督、工单监控"
      },
      {
        "id": "role-1783428011551-1",
        "name": "船舶管理人员",
        "focus": "船舶运行管理、航前调度校验",
        "tagText": "船舶运行管理、航前校验"
      },
      {
        "id": "role-1783428011551-2",
        "name": "船端一线作业人员",
        "focus": "工单执行、报工、盘点、弱网离线作业",
        "tagText": "移动作业、离线报工、扫码盘点"
      },
      {
        "id": "role-1783428011551-3",
        "name": "系统管理员",
        "focus": "组织权限配置、流程配置、统一身份管理",
        "tagText": "权限管理、流程配置"
      },
      {
        "id": "role-1783428011551-4",
        "name": "审计员",
        "focus": "操作日志审计、合规审查",
        "tagText": "日志审计、合规查询"
      },
      {
        "id": "role-1783428011551-5",
        "name": "采办协同人员",
        "focus": "采购需求提报、物资验收、预算核减确认",
        "tagText": "采购提报、物资验收"
      }
    ],
    "sourceRoles": [
      {
        "name": "岸基机务人员",
        "focus": "机务管理、设备维保监督",
        "tags": [
          "设备维保监督",
          "工单监控"
        ]
      },
      {
        "name": "船舶管理人员",
        "focus": "船舶运行管理、航前调度校验",
        "tags": [
          "船舶运行管理",
          "航前校验"
        ]
      },
      {
        "name": "船端一线作业人员",
        "focus": "工单执行、报工、盘点、弱网离线作业",
        "tags": [
          "移动作业",
          "离线报工",
          "扫码盘点"
        ]
      },
      {
        "name": "系统管理员",
        "focus": "组织权限配置、流程配置、统一身份管理",
        "tags": [
          "权限管理",
          "流程配置"
        ]
      },
      {
        "name": "审计员",
        "focus": "操作日志审计、合规审查",
        "tags": [
          "日志审计",
          "合规查询"
        ]
      },
      {
        "name": "采办协同人员",
        "focus": "采购需求提报、物资验收、预算核减确认",
        "tags": [
          "采购提报",
          "物资验收"
        ]
      }
    ],
    "scenarios": [
      {
        "key": "sc-1",
        "name": "岸基机务人员设备维保计划管理与工单监控",
        "priority": "P0",
        "description": "岸基机务人员基于PMS规则（周期/工况/条件触发）制定并调整预防性维护计划（年度/月度），为每艘船舶生成计划工单。该场景始于PMS规则自动触发或人工干预调整计划，机务人员在岸端查看全船设备资产树与BOM关联，评估待执行工单优先级，监控各工单的流转状态（待派发、执行中、完工待审、已关闭），对异常工单（超期、缺件、报工不合格）进行人工干预（重新派发、补充物资、驳回重做），并确保工单闭环后的数据同步至船端移动端，同时记录操作日志供审计。关键判断：设备维保周期与工况数据的匹配、物资库存是否满足工单需求、工单执行质量是否符合规范。闭环结果：工单关闭，维保记录归档，设备健康状态更新，触发后续PMS计划调整或物资补货需求。",
        "summary": "岸基机务人员根据PMS规则制定/调整预防性维护计划，监控全船工单执行进度并处理异常工单。",
        "workflow": [
          "系统根据PMS规则自动生成或机务人员手动调整预防性维护计划（年度/月度），确定待执行工单列表",
          "机务人员查看设备资产树与物资BOM关联，评估工单所需备件库存是否充足，若缺件则触发物资补货需求",
          "机务人员将符合条件的工单派发至对应船舶，设定执行期限和优先级",
          "机务人员通过看板监控全船工单执行进度，查看船端反馈的报工记录、照片留痕和执行结果",
          "机务人员审核报工结果：合格则关闭工单并归档维保记录；不合格则驳回并要求重新执行或补充说明",
          "工单关闭后，系统同步更新设备健康状态、维保履历，并自动触发后续PMS计划调整或物资预警"
        ],
        "pageMapping": {
          "role": "岸基机务人员",
          "page": "PMSPlanManagement.vue",
          "modules": []
        }
      },
      {
        "key": "sc-2",
        "name": "船舶管理人员航前健康校验与调度校验",
        "priority": "P0",
        "description": "",
        "summary": "船舶管理人员在开航前对设备状态、物资库存、人员资质与证书进行综合校验，判断是否具备开航条件。",
        "workflow": [],
        "pageMapping": {
          "role": "船舶管理人员",
          "page": "",
          "modules": []
        }
      },
      {
        "key": "sc-3",
        "name": "船端一线作业人员移动端离线工单执行与报工",
        "priority": "P0",
        "description": "",
        "summary": "船端人员在弱网/无网环境下通过移动端接收、执行工单，完成报工、拍照留痕，待网络恢复后自动同步至岸端。",
        "workflow": [],
        "pageMapping": {
          "role": "船端一线作业人员",
          "page": "",
          "modules": []
        }
      },
      {
        "key": "sc-4",
        "name": "船端一线作业人员物资扫码盘点与库存预警",
        "priority": "P1",
        "description": "",
        "summary": "船端人员使用移动端扫描物资条码进行盘点，系统自动比对库存上下线并触发预警/补货需求。",
        "workflow": [],
        "pageMapping": {
          "role": "船端一线作业人员",
          "page": "",
          "modules": []
        }
      },
      {
        "key": "sc-5",
        "name": "采办协同人员物资采购需求提报与验收",
        "priority": "P1",
        "description": "",
        "summary": "采办协同人员依据库存预警或维保计划提报采购需求，完成到船物资验收并确认预算核减。",
        "workflow": [],
        "pageMapping": {
          "role": "采办协同人员",
          "page": "",
          "modules": []
        }
      },
      {
        "key": "sc-6",
        "name": "系统管理员组织权限与流程配置",
        "priority": "P1",
        "description": "",
        "summary": "系统管理员配置用户角色权限、审批流程模板及系统基础参数，支撑国产化环境下的灵活管理。",
        "workflow": [],
        "pageMapping": {
          "role": "系统管理员",
          "page": "",
          "modules": []
        }
      },
      {
        "key": "sc-7",
        "name": "审计员操作日志审计与合规查询",
        "priority": "P1",
        "description": "",
        "summary": "审计员查阅关键操作日志、维保记录与资质变更记录，生成合规审计报告供ISM/船级社审查。",
        "workflow": [],
        "pageMapping": {
          "role": "审计员",
          "page": "",
          "modules": []
        }
      }
    ],
    "availableScenarios": [
      {
        "key": "sc-1",
        "name": "岸基机务人员设备维保计划管理与工单监控",
        "priority": "P0",
        "description": "岸基机务人员基于PMS规则（周期/工况/条件触发）制定并调整预防性维护计划（年度/月度），为每艘船舶生成计划工单。该场景始于PMS规则自动触发或人工干预调整计划，机务人员在岸端查看全船设备资产树与BOM关联，评估待执行工单优先级，监控各工单的流转状态（待派发、执行中、完工待审、已关闭），对异常工单（超期、缺件、报工不合格）进行人工干预（重新派发、补充物资、驳回重做），并确保工单闭环后的数据同步至船端移动端，同时记录操作日志供审计。关键判断：设备维保周期与工况数据的匹配、物资库存是否满足工单需求、工单执行质量是否符合规范。闭环结果：工单关闭，维保记录归档，设备健康状态更新，触发后续PMS计划调整或物资补货需求。",
        "summary": "岸基机务人员根据PMS规则制定/调整预防性维护计划，监控全船工单执行进度并处理异常工单。",
        "workflow": [
          "系统根据PMS规则自动生成或机务人员手动调整预防性维护计划（年度/月度），确定待执行工单列表",
          "机务人员查看设备资产树与物资BOM关联，评估工单所需备件库存是否充足，若缺件则触发物资补货需求",
          "机务人员将符合条件的工单派发至对应船舶，设定执行期限和优先级",
          "机务人员通过看板监控全船工单执行进度，查看船端反馈的报工记录、照片留痕和执行结果",
          "机务人员审核报工结果：合格则关闭工单并归档维保记录；不合格则驳回并要求重新执行或补充说明",
          "工单关闭后，系统同步更新设备健康状态、维保履历，并自动触发后续PMS计划调整或物资预警"
        ],
        "pageMapping": {
          "role": "岸基机务人员",
          "page": "PMSPlanManagement.vue",
          "modules": []
        }
      },
      {
        "key": "sc-2",
        "name": "船舶管理人员航前健康校验与调度校验",
        "priority": "P0",
        "description": "",
        "summary": "船舶管理人员在开航前对设备状态、物资库存、人员资质与证书进行综合校验，判断是否具备开航条件。",
        "workflow": [],
        "pageMapping": {
          "role": "船舶管理人员",
          "page": "",
          "modules": []
        }
      },
      {
        "key": "sc-3",
        "name": "船端一线作业人员移动端离线工单执行与报工",
        "priority": "P0",
        "description": "",
        "summary": "船端人员在弱网/无网环境下通过移动端接收、执行工单，完成报工、拍照留痕，待网络恢复后自动同步至岸端。",
        "workflow": [],
        "pageMapping": {
          "role": "船端一线作业人员",
          "page": "",
          "modules": []
        }
      },
      {
        "key": "sc-4",
        "name": "船端一线作业人员物资扫码盘点与库存预警",
        "priority": "P1",
        "description": "",
        "summary": "船端人员使用移动端扫描物资条码进行盘点，系统自动比对库存上下线并触发预警/补货需求。",
        "workflow": [],
        "pageMapping": {
          "role": "船端一线作业人员",
          "page": "",
          "modules": []
        }
      },
      {
        "key": "sc-5",
        "name": "采办协同人员物资采购需求提报与验收",
        "priority": "P1",
        "description": "",
        "summary": "采办协同人员依据库存预警或维保计划提报采购需求，完成到船物资验收并确认预算核减。",
        "workflow": [],
        "pageMapping": {
          "role": "采办协同人员",
          "page": "",
          "modules": []
        }
      },
      {
        "key": "sc-6",
        "name": "系统管理员组织权限与流程配置",
        "priority": "P1",
        "description": "",
        "summary": "系统管理员配置用户角色权限、审批流程模板及系统基础参数，支撑国产化环境下的灵活管理。",
        "workflow": [],
        "pageMapping": {
          "role": "系统管理员",
          "page": "",
          "modules": []
        }
      },
      {
        "key": "sc-7",
        "name": "审计员操作日志审计与合规查询",
        "priority": "P1",
        "description": "",
        "summary": "审计员查阅关键操作日志、维保记录与资质变更记录，生成合规审计报告供ISM/船级社审查。",
        "workflow": [],
        "pageMapping": {
          "role": "审计员",
          "page": "",
          "modules": []
        }
      }
    ],
    "selectedScenarioKey": "sc-1",
    "modulesByScenarioKey": {
      "sc-1": [
        {
          "key": "mod-1",
          "priority": "P0",
          "name": "PMS规则与计划管理",
          "description": "机务人员配置预防性维护规则（周期、工况、条件触发），基于规则自动或手动生成年度/月度维护计划，支持计划调整、版本管理。",
          "features": [
            "按设备类型、工况条件配置PMS规则（周期/运行小时/触发事件）",
            "自动生成年度预防性维护计划，支持手动导入或调整",
            "计划版本管理，记录变更历史与审批记录",
            "查看计划执行概览（待生成工单数、已派发率等）"
          ],
          "pageSuggestion": "PMSRulePlan.vue",
          "apiHint": "GET /api/pms/rules 查询规则列表；POST /api/pms/plans/generate 生成计划",
          "dataNeeds": [
            "设备资产树及BOM关联",
            "PMS规则模板库",
            "计划执行统计（待生成工单数、已派发率）"
          ],
          "stateRules": [
            "计划状态：草稿、已发布、执行中、已完成、已作废",
            "规则有效性校验（例如周期与工况互斥需建议确认）"
          ],
          "apiSuggestion": "GET /api/pms/rules 查询规则列表；POST /api/pms/plans/generate 生成计划"
        },
        {
          "key": "mod-2",
          "priority": "P0",
          "name": "工单派发与资源校验",
          "description": "机务人员查看设备资产树与物资BOM关联，评估工单所需备件库存，按船舶派发工单并设定执行期限和优先级。",
          "features": [
            "展示设备资产树，关联BOM查看备件清单与库存",
            "自动校验库存是否满足工单需求，缺件时触发补货需求",
            "批量派发工单至指定船舶，设置执行期限和优先级（高/中/低）",
            "支持工单拆分、合并或重新分配"
          ],
          "pageSuggestion": "WorkOrderDispatch.vue",
          "apiHint": "GET /api/equipment/tree 获取设备资产树与BOM；GET /api/inventory/check 校验库存；POST /api/workorders/dispatch 派发工单",
          "dataNeeds": [
            "设备资产树与BOM关联数据",
            "物资库存实时数据",
            "船舶信息与值班人员列表"
          ],
          "stateRules": [
            "工单状态：待派发、已派发、执行中、完工待审、已关闭、已作废",
            "库存校验结果：充足/缺件（缺件时自动生成补货申请单）",
            "派发后船端移动端实时接收"
          ],
          "apiSuggestion": "GET /api/equipment/tree 获取设备资产树与BOM；GET /api/inventory/check 校验库存；POST /api/workorders/dispatch 派发工单"
        },
        {
          "key": "mod-3",
          "priority": "P0",
          "name": "工单执行监控与异常预警",
          "description": "机务人员通过看板实时监控全船工单执行进度，查看船端反馈的报工记录、照片留痕和执行结果，对超期、缺件、报工不合格的异常工单进行预警和人工干预。",
          "features": [
            "看板展示全船工单执行进度，支持按船舶、设备、优先级筛选",
            "查看船端报工详情（报工记录、照片留痕、执行结果）",
            "异常工单自动预警（超期、缺件、质量不合格），标记颜色区分",
            "支持直接干预：重新派发、补充物资、驳回重做、删除工单"
          ],
          "pageSuggestion": "WorkOrderMonitor.vue",
          "apiHint": "GET /api/workorders/dashboard 获取工单监控看板；GET /api/workorders/{id}/execution 查看执行详情；POST /api/workorders/{id}/intervene 进行干预操作",
          "dataNeeds": [
            "工单执行进度数据",
            "报工记录及附件（照片）",
            "异常规则配置（超期阈值等）"
          ],
          "stateRules": [
            "工单异常类型：超期、缺件、报工不合格",
            "预警级别：黄色（超期1天）、红色（超期3天）、灰色（缺件）",
            "干预操作记录需计入操作日志供审计"
          ],
          "apiSuggestion": "GET /api/workorders/dashboard 获取工单监控看板；GET /api/workorders/{id}/execution 查看执行详情；POST /api/workorders/{id}/intervene 进行干预操作"
        },
        {
          "key": "mod-4",
          "priority": "P0",
          "name": "工单审核与闭环处理",
          "description": "机务人员对船端提交的完工工单进行审核，确认质量合格后关闭工单并归档维保记录；不合格则驳回重做；审核通过后触发设备健康状态更新。",
          "features": [
            "查看工单执行结果报告（报工数据、照片对比、质检记录）",
            "审核操作：通过关闭、驳回重做、要求补充说明",
            "归档维保记录，同步更新设备履历",
            "审核历史可查询、可追溯，支撑ISM/船级社审查"
          ],
          "pageSuggestion": "WorkOrderReview.vue",
          "apiHint": "POST /api/workorders/{id}/review 提交审核结果；GET /api/workorders/{id}/review/history 查看审核历史",
          "dataNeeds": [
            "工单执行报告",
            "设备维保质量标准（建议确认）",
            "审核人权限与签名"
          ],
          "stateRules": [
            "审核结果：通过/驳回/驳回要求补充",
            "驳回后工单状态回退至执行中，生成新任务",
            "审核通过后设备健康状态自动更新（建议确认更新规则）"
          ],
          "apiSuggestion": "POST /api/workorders/{id}/review 提交审核结果；GET /api/workorders/{id}/review/history 查看审核历史"
        },
        {
          "key": "mod-5",
          "priority": "P1",
          "name": "设备健康状态与履历管理",
          "description": "工单闭环后系统自动更新设备健康状态与维保履历，并根据预设规则触发后续PMS计划调整或物资预警，支撑设备全生命周期管理。",
          "features": [
            "查看设备维保履历（历史工单、执行结果、照片留痕）",
            "设备健康度评估（基于维保频次、故障记录、工况数据）",
            "自动触发后续PMS计划调整（如缩短周期）",
            "与物资预警联动：关键备件消耗后补充库存需求"
          ],
          "pageSuggestion": "EquipmentHealth.vue",
          "apiHint": "GET /api/equipment/{id}/health 获取健康状态；GET /api/equipment/{id}/history 获取履历；POST /api/equipment/{id}/trigger-adjustment 触发计划调整",
          "dataNeeds": [
            "设备维保履历数据",
            "设备工况实时数据（建议确认来源）",
            "健康度评估模型（建议确认）"
          ],
          "stateRules": [
            "健康度等级：良好/注意/警告/严重",
            "触发调整条件：连续两次超期、合格率低于阈值等（建议确认）",
            "履历数据禁止修改，仅可归档补充"
          ],
          "apiSuggestion": "GET /api/equipment/{id}/health 获取健康状态；GET /api/equipment/{id}/history 获取履历；POST /api/equipment/{id}/trigger-adjustment 触发计划调整"
        }
      ]
    },
    "scenarioDetailReadyByKey": {
      "sc-1": true,
      "sc-2": false,
      "sc-3": false,
      "sc-4": false,
      "sc-5": false,
      "sc-6": false,
      "sc-7": false
    },
    "pageDesignsByScenarioKey": {
      "sc-1": {
        "pages": [
          {
            "key": "page-1",
            "priority": "P0",
            "type": "工作台页",
            "name": "PMS规则与计划管理",
            "vueFile": "PMSRulePlan.vue",
            "goal": "机务人员配置预防性维护规则，基于规则自动或手动生成年度/月度维护计划，并查看计划执行概览。",
            "features": [
              "PMS规则与计划管理"
            ],
            "sections": [
              "顶部操作栏（规则新增、计划生成、版本切换）",
              "规则配置表单（设备类型、工况条件、周期/运行小时/触发事件）",
              "计划列表（年度/月度计划，支持状态筛选）",
              "计划概览统计卡片（待生成工单数、已派发率、计划完成率）"
            ],
            "states": [
              "正常态：展示规则列表、计划列表及概览统计",
              "空态：无规则时显示“请先配置PMS规则”引导卡片；无计划时显示“尚未生成计划，点击生成”",
              "加载态：展示骨架屏，规则和计划分别加载",
              "异常态：规则或计划数据加载失败时显示重试按钮和错误信息"
            ],
            "keyInteractions": [
              "点击“新增规则”按钮弹出侧滑窗，填写规则后保存并刷新列表",
              "点击“生成计划”按钮，弹出日期范围选择器，确认后调用后端生成接口",
              "计划列表支持行点击进入计划详情（暂不实现，留作后续）",
              "版本切换下拉框，选择不同版本后计划列表和概览数据同步刷新",
              "规则列表行内操作：编辑、启用/停用、删除"
            ],
            "dataInputs": [
              "PMS规则列表（GET /api/pms/rules）",
              "计划执行概览（GET /api/pms/plans/summary?year=2026）",
              "计划列表（GET /api/pms/plans?status=draft,published,executing,completed,cancelled）",
              "设备资产树（用于规则关联设备类型，GET /api/equipment/tree）"
            ]
          },
          {
            "key": "page-2",
            "priority": "P0",
            "type": "列表页",
            "name": "工单派发与资源校验",
            "vueFile": "WorkOrderDispatch.vue",
            "goal": "机务人员查看设备资产树与物资BOM关联，评估工单所需备件库存，批量派发工单至船舶并设定执行期限和优先级。",
            "features": [
              "工单派发与资源校验"
            ],
            "sections": [
              "左侧设备资产树（可展开至BOM节点）",
              "右侧工单待办列表（展示待派发工单，含设备、计划日期、所需备件）",
              "底部操作栏（批量派发、查看库存明细、派发日志）",
              "库存校验结果浮标（充足/缺件图标）"
            ],
            "states": [
              "正常态：显示设备树和待派发工单列表，库存校验结果标记清晰",
              "空态：无待派发工单时显示“所有工单已派发”提示",
              "加载态：树形组件和列表同时加载骨架屏",
              "异常态：设备树或库存接口失败时显示局部错误提示，允许单独重试"
            ],
            "keyInteractions": [
              "点击设备树节点，右侧工单列表过滤为所选设备关联工单",
              "工单行内“查看库存”弹出BOM备件库存详情窗",
              "勾选多个工单后点击“批量派发”，弹出派发对话框（选择船舶、执行期限、优先级）",
              "派发成功后，工单移出待办列表，并在操作日志中记录",
              "缺件工单行显示“触发补货”按钮，点击创建补货申请单"
            ],
            "dataInputs": [
              "待派发工单列表（GET /api/workorders?status=pending）",
              "设备资产树（GET /api/equipment/tree）",
              "物资库存校验（GET /api/inventory/check?workOrderIds=...）",
              "船舶列表（GET /api/ships）",
              "派发操作（POST /api/workorders/dispatch）"
            ]
          },
          {
            "key": "page-3",
            "priority": "P0",
            "type": "看板页",
            "name": "工单执行监控与异常预警",
            "vueFile": "WorkOrderMonitor.vue",
            "goal": "机务人员通过看板实时监控全船工单执行进度，查看船端反馈的报工记录、照片留痕，并对异常工单进行预警和干预。",
            "features": [
              "工单执行监控与异常预警"
            ],
            "sections": [
              "顶部全局筛选栏（船舶、设备、优先级、状态多选）",
              "工单执行进度看板（卡片式展示各工单状态、进度条、剩余时间）",
              "异常工单预警区（按异常类型分组展示，带颜色标记）",
              "右侧详情侧边栏（点击工单后展示报工记录、照片、干预历史）"
            ],
            "states": [
              "正常态：看板展示全量工单，异常区显示预警卡片",
              "空态：无工单时显示“暂无工单”插画",
              "加载态：看板骨架屏，同时触发定时刷新",
              "异常态：工单数据接口失败时显示错误遮罩及重试按钮",
              "离线或弱网提示：当船端同步中断时，对应船舶工单卡片显示“船端离线”标记"
            ],
            "keyInteractions": [
              "筛选条件变化时重新加载工单看板数据",
              "点击工单卡片打开右侧详情侧边栏，展示报工详情、照片留痕（图片缩略图可点击放大）",
              "异常工单卡片提供快捷干预菜单（重新派发、补充物资、驳回重做、删除）",
              "干预操作需二次确认，并计入操作日志",
              "看板支持自动刷新（每30秒），也可手动点击刷新按钮"
            ],
            "dataInputs": [
              "工单看板数据（GET /api/workorders/dashboard?shipId=&priority=&status=&equipmentId=）",
              "工单执行详情（GET /api/workorders/{id}/execution）",
              "报工附件照片（GET /api/workorders/{id}/attachments）",
              "干预操作（POST /api/workorders/{id}/intervene）"
            ]
          },
          {
            "key": "page-4",
            "priority": "P0",
            "type": "列表页",
            "name": "工单审核与闭环处理",
            "vueFile": "WorkOrderReview.vue",
            "goal": "机务人员对船端提交的完工工单进行审核，确认质量合格后关闭工单并归档维保记录；不合格则驳回重做。",
            "features": [
              "工单审核与闭环处理"
            ],
            "sections": [
              "顶部筛选区（按船舶、设备、审核状态筛选）",
              "待审核工单列表（展示完工待审工单，含报工摘要、照片缩略图、质检指标）",
              "审核操作面板（审核结论：通过关闭、驳回重做、要求补充说明）",
              "审核历史列表（已审核工单的审核记录，支持查询和追溯）"
            ],
            "states": [
              "正常态：展示待审核列表和审核历史，操作面板可用",
              "空态：无待审核工单时显示“所有工单已审核”提示",
              "加载态：列表骨架屏",
              "异常态：审核提交失败时显示错误提示并保持原数据"
            ],
            "keyInteractions": [
              "点击工单行展开或弹出详情窗，查看完整报工报告、照片对比、质检记录",
              "选择审核结论并填写备注（驳回时必须填写原因），点击提交",
              "提交后待审核列表刷新，审核历史尾部新增记录",
              "审核历史支持按时间、船舶、工单ID检索",
              "审核通过后，工单状态变更为“已关闭”，并触发设备健康状态更新（调用后台接口）"
            ],
            "dataInputs": [
              "待审核工单列表（GET /api/workorders?status=pending_review）",
              "工单执行报告（GET /api/workorders/{id}/report）",
              "审核历史（GET /api/workorders/{id}/review/history）",
              "审核操作（POST /api/workorders/{id}/review）"
            ]
          },
          {
            "key": "page-5",
            "priority": "P1",
            "type": "详情页",
            "name": "设备健康状态与履历管理",
            "vueFile": "EquipmentHealth.vue",
            "goal": "查看设备维保履历与健康度评估，根据预设规则触发PMS计划调整或物资预警。",
            "features": [
              "设备健康状态与履历管理"
            ],
            "sections": [
              "顶部设备选择器（船舶→设备树筛选）",
              "设备健康度概览卡片（健康度等级、维保频次、故障次数、工况状态）",
              "维保履历时间线（按时间倒序展示历史工单、执行结果、照片）",
              "触发规则配置面板（查看/修改自动调整条件和预警联动规则）",
              "操作日志与审计记录"
            ],
            "states": [
              "正常态：展示所选设备的健康概览和履历时间线",
              "空态：首次使用时显示“暂无维保记录”",
              "加载态：骨架屏加载设备数据和履历",
              "异常态：设备数据加载失败时显示错误提示",
              "设备未绑定BOM或无工况数据时给出提示"
            ],
            "keyInteractions": [
              "切换设备时重新加载所有数据",
              "点击时间线上的历史工单可跳转至对应工单详情（通过新标签页或侧滑窗）",
              "健康度等级变更时系统自动记录变更原因",
              "触发调整面板支持编辑规则（如连续两次超期自动缩短周期），保存后调用后台接口",
              "关联物资预警：当关键备件消耗后，系统自动生成预警记录，点击可查看预警详情"
            ],
            "dataInputs": [
              "设备健康状态（GET /api/equipment/{id}/health）",
              "维保履历（GET /api/equipment/{id}/history）",
              "工况实时数据（GET /api/equipment/{id}/workingCondition）",
              "触发规则配置（GET /api/equipment/{id}/adjustmentRules）",
              "物资预警联动（GET /api/equipment/{id}/relatedAlerts）"
            ]
          }
        ],
        "navigation": [
          {
            "label": "PMS规则与计划管理",
            "target": "PMSRulePlan.vue",
            "default": true
          },
          {
            "label": "工单派发与资源校验",
            "target": "WorkOrderDispatch.vue",
            "default": false
          },
          {
            "label": "工单执行监控与异常预警",
            "target": "WorkOrderMonitor.vue",
            "default": false
          },
          {
            "label": "工单审核与闭环处理",
            "target": "WorkOrderReview.vue",
            "default": false
          },
          {
            "label": "设备健康状态与履历管理",
            "target": "EquipmentHealth.vue",
            "default": false
          }
        ],
        "fileStructure": {
          "views": [
            "PMSRulePlan.vue",
            "WorkOrderDispatch.vue",
            "WorkOrderMonitor.vue",
            "WorkOrderReview.vue",
            "EquipmentHealth.vue"
          ],
          "components": [
            "StatusTag.vue",
            "DataTable.vue",
            "EquipmentTree.vue",
            "PhotoGallery.vue",
            "AuditLogList.vue"
          ],
          "data": [
            "scenarioMockData.js"
          ]
        }
      },
      "sc-2": {
        "pages": []
      },
      "sc-3": {
        "pages": []
      },
      "sc-4": {
        "pages": []
      },
      "sc-5": {
        "pages": []
      },
      "sc-6": {
        "pages": []
      },
      "sc-7": {
        "pages": []
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
      "generatedAt": "2026-07-07T12:40:11.551Z",
      "planningNotes": [
        "依据弱网/离线作业痛点，将船端工单执行与报工拆为独立P0场景（sc-3），体现移动端核心能力。",
        "航前健康校验是投资关键动因，故为船舶管理人员设置P0场景（sc-2），具体判定规则（设备/物资/资质）需客户确认。",
        "物资与BOM关联不足导致缺件风险，故设置扫码盘点与预警场景（sc-4），并触发采办需求（sc-5）。",
        "系统管理员场景（sc-6）支撑国产化替代下权限与流程的自定义配置，适配信创环境。",
        "合规审计场景（sc-7）满足ISM/船级社审查要求，操作日志需支持多维度检索。",
        "所有场景均基于需求摘要中的角色、痛点与目标推导，外部系统集成规则、工单状态流转等细节在后续步骤细化。"
      ],
      "requirementSavedAt": "",
      "requirementProjectName": "船舶维护 PMS"
    },
    "activeKey": "sc-1",
    "savedAt": "2026-07-07T12:41:37.254Z",
    "requirementSnapshotKey": "v1:a82e1d80:13921"
  },
  "selectedPage": {
    "key": "sc-1-page-5-4",
    "name": "设备健康状态与履历管理",
    "vueFile": "EquipmentHealth.vue",
    "goal": "查看设备维保履历与健康度评估，根据预设规则触发PMS计划调整或物资预警。",
    "features": [
      "设备健康状态与履历管理"
    ],
    "sections": [
      "顶部设备选择器（船舶→设备树筛选）",
      "设备健康度概览卡片（健康度等级、维保频次、故障次数、工况状态）",
      "维保履历时间线（按时间倒序展示历史工单、执行结果、照片）",
      "触发规则配置面板（查看/修改自动调整条件和预警联动规则）",
      "操作日志与审计记录"
    ],
    "fields": [
      {
        "name": "deviceSelector",
        "label": "设备选择器",
        "type": "tree-select",
        "required": true,
        "description": "船舶→设备树，用于切换当前查看的设备"
      },
      {
        "name": "adjustmentRule.maxOverdueCount",
        "label": "连续超期次数阈值",
        "type": "number",
        "required": false,
        "description": "连续超期超过该次数后自动触发周期缩短"
      },
      {
        "name": "adjustmentRule.qualifiedRateThreshold",
        "label": "合格率阈值",
        "type": "number",
        "required": false,
        "description": "维保合格率低于该值时触发预警调整"
      },
      {
        "name": "adjustmentRule.autoShortenCycle",
        "label": "自动缩短周期",
        "type": "switch",
        "required": false,
        "description": "是否启用自动缩短维保周期"
      },
      {
        "name": "alertRule.enabled",
        "label": "物资预警联动",
        "type": "switch",
        "required": false,
        "description": "关键备件消耗后自动生成预警记录"
      }
    ],
    "actions": [
      {
        "label": "切换设备",
        "trigger": "设备选择器值变更",
        "feedback": "重新加载设备健康概览、履历时间线、规则配置和预警信息"
      },
      {
        "label": "查看工单详情",
        "trigger": "点击维保履历时间线上的工单条目",
        "feedback": "以新标签页或侧滑窗打开对应工单详情页面"
      },
      {
        "label": "编辑规则",
        "trigger": "点击触发规则配置面板中的编辑按钮",
        "feedback": "规则字段变为可编辑状态，显示保存/取消按钮"
      },
      {
        "label": "保存规则",
        "trigger": "点击保存按钮",
        "feedback": "调用后台接口保存规则，成功后显示成功提示并刷新数据；失败时显示错误提示"
      },
      {
        "label": "查看预警",
        "trigger": "点击物资预警记录",
        "feedback": "打开预警详情弹窗或跳转至预警页面"
      }
    ],
    "validations": [
      "调整条件阈值必须为正整数",
      "合格率阈值范围应在0-100之间",
      "保存规则时至少启用一个调整条件"
    ],
    "states": {
      "empty": "首次使用或无维保记录时，显示占位提示“暂无维保记录”",
      "loading": "使用骨架屏展示设备健康概览和履历时间线等待状态",
      "success": "正常展示设备健康概览卡片、履历时间线、规则配置及预警信息",
      "error": "数据加载失败时，在相应区域显示错误提示及重试按钮"
    },
    "generatedAt": "2026-07-07T12:44:46.230Z"
  },
  "selectedApiContract": {
    "key": "api-sc-1-page-5-4",
    "method": "GET",
    "name": "获取设备健康与履历概览",
    "path": "/api/equipment/{id}/dashboard",
    "goal": "获取指定设备的健康状态概览和维保履历列表，用于页面初始加载和设备切换后的数据刷新",
    "trigger": "进入页面或切换设备选择器时调用",
    "requestParams": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "description": "设备ID（路径参数）"
      },
      {
        "name": "page",
        "type": "integer",
        "required": false,
        "description": "履历分页页码，默认1"
      },
      {
        "name": "size",
        "type": "integer",
        "required": false,
        "description": "每页条数，默认20"
      }
    ],
    "successResponse": {
      "code": 0,
      "message": "成功",
      "data": {
        "health": {
          "level": "良好|注意|警告|严重",
          "maintenanceFrequency": "每季度一次",
          "faultCount": 3,
          "workingCondition": "正常|异常"
        },
        "history": {
          "total": 50,
          "records": [
            {
              "workOrderId": "WO-20250101",
              "title": "主机润滑油系统保养",
              "executionResult": "完成",
              "photos": [
                "https://oss.example.com/photo1.jpg"
              ],
              "completedAt": "2025-01-15 10:30:00"
            }
          ]
        }
      },
      "traceId": "a1b2c3d4"
    },
    "errorResponse": {
      "code": -1,
      "message": "失败",
      "data": null,
      "traceId": "e5f6g7h8"
    },
    "errorCodes": [
      {
        "code": 1001,
        "meaning": "设备ID不存在",
        "frontendAdvice": "提示用户设备不存在，返回设备列表页"
      },
      {
        "code": 1002,
        "meaning": "数据查询异常",
        "frontendAdvice": "显示错误提示并显示重试按钮，允许用户重新加载"
      }
    ],
    "sourcePageKey": "sc-1-page-5-4"
  },
  "selectedModuleApiHints": [
    {
      "key": "mod-5",
      "name": "设备健康状态与履历管理",
      "description": "工单闭环后系统自动更新设备健康状态与维保履历，并根据预设规则触发后续PMS计划调整或物资预警，支撑设备全生命周期管理。",
      "features": [
        "查看设备维保履历（历史工单、执行结果、照片留痕）",
        "设备健康度评估（基于维保频次、故障记录、工况数据）",
        "自动触发后续PMS计划调整（如缩短周期）",
        "与物资预警联动：关键备件消耗后补充库存需求"
      ],
      "pageSuggestion": "EquipmentHealth.vue",
      "apiHint": "GET /api/equipment/{id}/health 获取健康状态；GET /api/equipment/{id}/history 获取履历；POST /api/equipment/{id}/trigger-adjustment 触发计划调整",
      "dataNeeds": [
        "设备维保履历数据",
        "设备工况实时数据（建议确认来源）",
        "健康度评估模型（建议确认）"
      ],
      "stateRules": [
        "健康度等级：良好/注意/警告/严重",
        "触发调整条件：连续两次超期、合格率低于阈值等（建议确认）",
        "履历数据禁止修改，仅可归档补充"
      ]
    }
  ],
  "generationStatus": {
    "selectedPageKey": "sc-1-page-5-4",
    "interactionReady": true,
    "apiReady": true
  },
  "savedAt": "2026-07-07T12:45:17.012Z",
  "scenarioPageSnapshotKey": "v1:b6e95cb1:10231"
}
```
<!-- FDE_STEP_RESULT_JSON_END -->
