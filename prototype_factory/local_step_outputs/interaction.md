# 05 交互设计

- 步骤标识：`interaction`
- 保存时间：2026-07-01T15:42:14.344139+00:00
- 用途：作为下一步工作台的输入来源。

## 内容摘要

- 已保存该步骤的结构化输出。

## 结构化数据

<!-- FDE_STEP_RESULT_JSON_START -->
```json
{
  "pages": [
    {
      "key": "scenario-1782831312544-0-scenario-1782831312544-0-page-1-0",
      "name": "调度员现场调度工作台",
      "vueFile": "VehicleDispatchView.vue",
      "fields": [
        {
          "name": "region",
          "label": "区域筛选",
          "type": "select",
          "required": false,
          "description": "按作业区域筛选车辆显示"
        },
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "select",
          "required": false,
          "description": "按车辆类型筛选"
        },
        {
          "name": "vehicleStatus",
          "label": "车辆状态",
          "type": "select",
          "required": false,
          "description": "按车辆状态（空闲、任务、排队、异常）筛选"
        },
        {
          "name": "keyword",
          "label": "搜索关键字",
          "type": "input",
          "required": false,
          "description": "按车牌号或司机名称搜索"
        }
      ],
      "actions": [
        {
          "label": "区域筛选变更",
          "trigger": "onRegionChange",
          "feedback": "地图更新车辆标记"
        },
        {
          "label": "地图车辆点击",
          "trigger": "onVehicleClick",
          "feedback": "弹出车辆详情弹窗"
        },
        {
          "label": "车辆详情弹窗关闭",
          "trigger": "onCloseDetail",
          "feedback": "关闭弹窗"
        },
        {
          "label": "状态概览区卡片点击",
          "trigger": "onStatCardClick",
          "feedback": "跳转到对应筛选结果"
        },
        {
          "label": "异常告警面板告警点击",
          "trigger": "onAlarmClick",
          "feedback": "展开告警详情或处理入口"
        }
      ],
      "validations": [
        "车辆状态筛选必须与地图标记颜色一致",
        "区域筛选值需匹配系统预设区域字典",
        "搜索关键字长度不超过20字符"
      ],
      "states": {
        "empty": {
          "description": "无符合条件的车辆或告警显示",
          "actions": [
            {
              "label": "提示用户无数据"
            }
          ]
        },
        "loading": {
          "description": "地图和列表数据加载中",
          "actions": [
            {
              "label": "显示加载动画"
            }
          ]
        },
        "success": {
          "description": "数据加载正常，地图展示车辆标记",
          "actions": [
            {
              "label": "正常交互"
            }
          ]
        },
        "error": {
          "description": "数据加载失败或接口异常",
          "actions": [
            {
              "label": "显示错误提示和重试按钮"
            }
          ]
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-0-scenario-1782831312544-0-page-1-0",
        "priority": "P0",
        "type": "工作台页",
        "name": "调度员现场调度工作台",
        "vueFile": "VehicleDispatchView.vue",
        "goal": "在地图上实时显示车辆位置、任务状态、空闲车辆、排队车辆和异常车辆，支持区域筛选和车辆详情查看。",
        "features": [
          "车辆实时位置展示",
          "车辆状态标识（空闲",
          "任务",
          "排队",
          "异常）",
          "区域筛选与地图缩放",
          "车辆详情弹窗（车牌",
          "司机",
          "任务等）"
        ],
        "featureText": "车辆实时位置展示、车辆状态标识（空闲、任务、排队、异常）、区域筛选与地图缩放、车辆详情弹窗（车牌、司机、任务等）",
        "sections": [
          "状态概览区",
          "地图看板",
          "用车申请列表",
          "派车操作区",
          "任务跟踪面板",
          "异常告警面板"
        ],
        "originalPageKey": "scenario-1782831312544-0-page-1",
        "scenarioKey": "scenario-1782831312544-0",
        "scenarioName": "调度员现场调度"
      },
      "generatedAt": "2026-07-01T05:31:52.661Z"
    },
    {
      "key": "scenario-1782831312544-0-scenario-1782831312544-0-page-2-1",
      "name": "VehicleDispatch",
      "vueFile": "VehicleDispatchView.vue",
      "fields": [
        {
          "name": "approvalResult",
          "label": "审批结果",
          "type": "select",
          "required": true,
          "description": "对用车申请进行通过或驳回操作"
        },
        {
          "name": "approvalOpinion",
          "label": "审批意见",
          "type": "textarea",
          "required": false,
          "description": "审批时的补充说明或驳回原因"
        },
        {
          "name": "selectedVehicle",
          "label": "派车车辆",
          "type": "select",
          "required": true,
          "description": "从智能推荐列表或手动选择中确定要派出的车辆"
        },
        {
          "name": "priorityOverride",
          "label": "任务优先级",
          "type": "select",
          "required": false,
          "description": "手动调整任务优先级（高、中、低）"
        },
        {
          "name": "dispatchRemark",
          "label": "派车备注",
          "type": "textarea",
          "required": false,
          "description": "派车时额外说明信息，如作业点、注意事项"
        }
      ],
      "actions": [
        {
          "label": "审核通过",
          "trigger": "点击通过按钮",
          "feedback": "用车申请状态变为已通过，进入智能推荐派车区候选列表"
        },
        {
          "label": "审核驳回",
          "trigger": "点击驳回按钮",
          "feedback": "弹窗确认驳回原因，表单关闭，申请状态更新为已驳回"
        },
        {
          "label": "智能匹配推荐",
          "trigger": "点击智能推荐按钮",
          "feedback": "系统根据区域、车辆类型、优先级、距离计算并展示推荐车辆列表（带排序和评分）"
        },
        {
          "label": "手动调整派车方案",
          "trigger": "在推荐列表中修改车辆、优先级或备注",
          "feedback": "实时更新临时派车方案，不立即下发"
        },
        {
          "label": "下发任务",
          "trigger": "点击下发派车按钮",
          "feedback": "任务状态变为已下发，司机端收到任务推送，页面显示成功提示"
        }
      ],
      "validations": [
        "审批时如选择驳回，必须填写审批意见",
        "下发任务前必须选中已审核通过的用车申请且已选择派车车辆",
        "手动调整派车方案时，车辆状态必须为空闲且未超时"
      ],
      "states": {
        "empty": {
          "description": "用车申请列表为空，显示提示信息且禁用下发操作"
        },
        "loading": {
          "description": "正在加载用车申请列表或智能匹配结果，显示骨架屏或加载动画"
        },
        "success": {
          "description": "派车任务下发成功，弹出成功提示并可关闭"
        },
        "error": {
          "description": "派车下发或智能匹配失败，显示错误原因及重试按钮"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-0-scenario-1782831312544-0-page-2-1",
        "priority": "P1",
        "type": "辅助页",
        "name": "VehicleDispatch",
        "vueFile": "VehicleDispatchView.vue",
        "goal": "综合作业区域、车辆类型、任务优先级、距离远近等因素，智能推荐最佳车辆，支持调度员一键派车或手动调整。",
        "features": [
          "用车申请列表展示与审核",
          "智能匹配算法推荐车辆",
          "手动调整派车方案",
          "派车任务下发至司机"
        ],
        "featureText": "用车申请列表展示与审核、智能匹配算法推荐车辆、手动调整派车方案、派车任务下发至司机",
        "sections": [
          "用车申请审核区",
          "智能推荐派车区"
        ],
        "originalPageKey": "scenario-1782831312544-0-page-2",
        "scenarioKey": "scenario-1782831312544-0",
        "scenarioName": "调度员现场调度"
      },
      "generatedAt": "2026-07-01T05:32:10.027Z"
    },
    {
      "key": "scenario-1782831312544-0-scenario-1782831312544-0-page-3-2",
      "name": "VehicleDispatch",
      "vueFile": "VehicleDispatchView.vue",
      "fields": [
        {
          "name": "taskId",
          "label": "任务编号",
          "type": "string",
          "required": false,
          "description": "系统自动生成的唯一任务标识"
        },
        {
          "name": "vehiclePlate",
          "label": "车牌号",
          "type": "string",
          "required": false,
          "description": "执行任务的车辆车牌"
        },
        {
          "name": "driverName",
          "label": "司机姓名",
          "type": "string",
          "required": false,
          "description": "当前任务司机"
        },
        {
          "name": "status",
          "label": "任务状态",
          "type": "enum",
          "required": false,
          "description": "任务当前状态：待接单、已接单、到达、装卸中、已完成、异常"
        },
        {
          "name": "progress",
          "label": "进度",
          "type": "number",
          "required": false,
          "description": "任务完成百分比，0-100"
        },
        {
          "name": "priority",
          "label": "优先级",
          "type": "enum",
          "required": false,
          "description": "任务优先级：高、中、低"
        },
        {
          "name": "area",
          "label": "作业区域",
          "type": "string",
          "required": false,
          "description": "任务所在的作业区域"
        },
        {
          "name": "estimatedEndTime",
          "label": "预计结束时间",
          "type": "datetime",
          "required": false,
          "description": "任务预计完成时间"
        },
        {
          "name": "actualEndTime",
          "label": "实际结束时间",
          "type": "datetime",
          "required": false,
          "description": "任务实际完成时间"
        },
        {
          "name": "totalTasks",
          "label": "今日任务总数",
          "type": "number",
          "required": false,
          "description": "概览区统计的今日所有任务数量"
        },
        {
          "name": "completedTasks",
          "label": "已完成数量",
          "type": "number",
          "required": false,
          "description": "概览区统计的已完成任务数量"
        },
        {
          "name": "delayedTasks",
          "label": "延期数量",
          "type": "number",
          "required": false,
          "description": "概览区统计的超过预计时间的任务数量"
        },
        {
          "name": "abnormalTasks",
          "label": "异常数量",
          "type": "number",
          "required": false,
          "description": "概览区统计的标记异常的任务数量"
        }
      ],
      "actions": [
        {
          "label": "查看任务详情",
          "trigger": "click",
          "feedback": "弹出任务详情面板，包含任务所有字段和操作按钮"
        },
        {
          "label": "重新派车",
          "trigger": "click",
          "feedback": "打开派车弹窗，供调度员选择新车辆并下发"
        },
        {
          "label": "取消任务",
          "trigger": "click",
          "feedback": "弹出确认取消弹窗，要求填写取消原因，确认后刷新列表"
        },
        {
          "label": "标记异常",
          "trigger": "click",
          "feedback": "打开标记异常弹窗，选择异常类型并提交，更新任务状态"
        },
        {
          "label": "刷新任务列表",
          "trigger": "click",
          "feedback": "重新向服务端请求任务列表数据，更新页面"
        },
        {
          "label": "筛选任务",
          "trigger": "change",
          "feedback": "根据筛选条件（状态、区域等）过滤任务列表，实时更新"
        }
      ],
      "validations": [
        "重新派车前需确认当前任务是否可取消或已完成",
        "取消任务必须填写取消原因",
        "标记异常必须选择异常类型"
      ],
      "states": {
        "empty": "列表为空时显示'暂无任务'提示，概览区数字显示为0",
        "loading": "显示加载动画或骨架屏，待数据返回后渲染",
        "success": "正常显示任务列表、概览统计和异常告警",
        "error": "显示错误信息及'重试'按钮，允许用户重新加载"
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-0-scenario-1782831312544-0-page-3-2",
        "priority": "P1",
        "type": "辅助页",
        "name": "VehicleDispatch",
        "vueFile": "VehicleDispatchView.vue",
        "goal": "实时跟踪派车任务的执行状态（接单、到达、装卸、关闭），展示任务进度和异常标记，支持调度员介入处理。",
        "features": [
          "任务状态实时更新",
          "任务列表与进度展示",
          "异常任务标记与预警",
          "调度员干预操作（重新派车",
          "取消任务等）"
        ],
        "featureText": "任务状态实时更新、任务列表与进度展示、异常任务标记与预警、调度员干预操作（重新派车、取消任务等）",
        "sections": [
          "任务筛选区",
          "任务概览区",
          "任务列表与进度区",
          "异常任务告警区",
          "任务详情与干预操作区"
        ],
        "originalPageKey": "scenario-1782831312544-0-page-3",
        "scenarioKey": "scenario-1782831312544-0",
        "scenarioName": "调度员现场调度"
      },
      "generatedAt": "2026-07-01T05:32:48.918Z"
    },
    {
      "key": "scenario-1782831312544-0-scenario-1782831312544-0-page-4-3",
      "name": "VehicleDispatch",
      "vueFile": "VehicleDispatchView.vue",
      "fields": [
        {
          "name": "exceptionType",
          "label": "异常类型",
          "type": "select",
          "required": true,
          "description": "选择异常类型：排队超时、重复派车、车辆故障、位置偏移等"
        },
        {
          "name": "exceptionDescription",
          "label": "异常描述",
          "type": "textarea",
          "required": true,
          "description": "详细描述异常情况"
        },
        {
          "name": "vehiclePlate",
          "label": "车辆牌照",
          "type": "text",
          "required": true,
          "description": "关联车辆的车牌号"
        },
        {
          "name": "driverName",
          "label": "司机姓名",
          "type": "text",
          "required": false,
          "description": "关联司机姓名"
        },
        {
          "name": "handlerName",
          "label": "处理人",
          "type": "text",
          "required": false,
          "description": "当前处理异常的人员"
        },
        {
          "name": "actionType",
          "label": "处理动作",
          "type": "select",
          "required": true,
          "description": "选择处理方式：增派车辆、更换车辆、修改路线、取消任务、忽略"
        },
        {
          "name": "remark",
          "label": "处理备注",
          "type": "textarea",
          "required": false,
          "description": "补充处理说明"
        }
      ],
      "actions": [
        {
          "label": "查看详情",
          "trigger": "click",
          "feedback": "弹窗展示异常详细信息及车辆、任务上下文"
        },
        {
          "label": "处理异常",
          "trigger": "click",
          "feedback": "打开异常处理表单，允许调整任务或增派车辆"
        },
        {
          "label": "增派车辆",
          "trigger": "click",
          "feedback": "弹出车辆选择列表，确认后生成新派车任务"
        },
        {
          "label": "确认处理",
          "trigger": "submit",
          "feedback": "提交处理结果，更新异常状态，关闭弹窗并刷新列表"
        }
      ],
      "validations": [
        "异常类型必填",
        "异常描述必填",
        "车辆牌照必填",
        "处理动作必填"
      ],
      "states": {
        "empty": {
          "message": "暂无异常记录",
          "icon": "info-circle"
        },
        "loading": {
          "message": "正在加载异常数据...",
          "spinner": true
        },
        "success": {
          "message": "异常处理成功",
          "toast": "success"
        },
        "error": {
          "message": "操作失败，请重试",
          "toast": "error"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-0-scenario-1782831312544-0-page-4-3",
        "priority": "P1",
        "type": "辅助页",
        "name": "VehicleDispatch",
        "vueFile": "VehicleDispatchView.vue",
        "goal": "集中展示异常情况（排队超时、重复派车、车辆故障等），支持调度员临时调整任务、增派车辆、处理告警。",
        "features": [
          "异常情况列表与告警展示",
          "异常原因分析",
          "临时调整任务（换车",
          "改路线等）",
          "增派车辆或取消任务"
        ],
        "featureText": "异常情况列表与告警展示、异常原因分析、临时调整任务（换车、改路线等）、增派车辆或取消任务",
        "sections": [
          "异常告警概览区",
          "异常详情列表区",
          "异常处理操作区",
          "异常历史记录区"
        ],
        "originalPageKey": "scenario-1782831312544-0-page-4",
        "scenarioKey": "scenario-1782831312544-0",
        "scenarioName": "调度员现场调度"
      },
      "generatedAt": "2026-07-01T05:33:27.353Z"
    },
    {
      "key": "scenario-1782831312544-1-scenario-1782831312544-1-page-1-0",
      "name": "管理人员统计分析工作台",
      "vueFile": "StatisticsDashboardView.vue",
      "fields": [
        {
          "name": "reportType",
          "label": "报表类型",
          "type": "select",
          "required": true,
          "description": "选择要查看的统计报表类型，如车辆利用率、任务完成率等"
        },
        {
          "name": "timeRange",
          "label": "时间范围",
          "type": "daterange",
          "required": true,
          "description": "选择统计数据的起止时间"
        },
        {
          "name": "region",
          "label": "作业区域",
          "type": "select",
          "required": false,
          "description": "按作业区域筛选统计数据"
        },
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "select",
          "required": false,
          "description": "按车辆类型筛选统计数据"
        }
      ],
      "actions": [
        {
          "label": "切换报表",
          "trigger": "onReportTypeChange",
          "feedback": "页面图表与指标数据根据所选报表类型更新"
        },
        {
          "label": "导出报表",
          "trigger": "onExport",
          "feedback": "弹出导出配置弹窗，选择导出格式后触发下载"
        },
        {
          "label": "下钻查看",
          "trigger": "onDrillDown",
          "feedback": "点击图表元素后跳转至数据下钻页面查看明细"
        },
        {
          "label": "刷新数据",
          "trigger": "onRefresh",
          "feedback": "重新加载当前报表数据并更新图表"
        }
      ],
      "validations": [
        "报表类型为必选项",
        "时间范围起止日期不能为空且结束日期不能早于开始日期"
      ],
      "states": {
        "empty": {
          "description": "当前筛选条件下无统计数据，显示空状态提示与建议操作",
          "component": "EmptyStatePlaceholder"
        },
        "loading": {
          "description": "数据加载中，显示骨架屏或加载动画",
          "component": "SkeletonLoader"
        },
        "success": {
          "description": "数据加载成功，正常展示图表与指标",
          "component": "PageContent"
        },
        "error": {
          "description": "数据加载失败，显示错误提示与重试按钮",
          "component": "ErrorAlert"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-1-scenario-1782831312544-1-page-1-0",
        "priority": "P0",
        "type": "工作台页",
        "name": "管理人员统计分析工作台",
        "vueFile": "StatisticsDashboardView.vue",
        "goal": "提供车辆利用率、任务完成率、平均等待时长、空驶率、车辆排队情况等核心效率指标的统计与可视化展示。",
        "features": [
          "展示车辆利用率趋势图与分布",
          "展示任务完成率统计（按区域/时间/车辆类型）",
          "展示平均等待时长与空驶率图表",
          "展示车辆排队情况与异常通知"
        ],
        "featureText": "展示车辆利用率趋势图与分布、展示任务完成率统计（按区域/时间/车辆类型）、展示平均等待时长与空驶率图表、展示车辆排队情况与异常通知",
        "sections": [
          "管理人员统计分析状态概览",
          "效率分析",
          "费用分析",
          "报表导出",
          "选择报表类型与时间范围操作区",
          "查看可视化图表与关键指标操作区"
        ],
        "originalPageKey": "scenario-1782831312544-1-page-1",
        "scenarioKey": "scenario-1782831312544-1",
        "scenarioName": "管理人员统计分析"
      },
      "generatedAt": "2026-07-01T05:50:50.598Z"
    },
    {
      "key": "scenario-1782831312544-1-scenario-1782831312544-1-page-2-1",
      "name": "费用分析页面",
      "vueFile": "StatisticsDashboardView.vue",
      "fields": [
        {
          "name": "startDate",
          "label": "开始时间",
          "type": "date",
          "required": true,
          "description": "统计时间范围的起始日期"
        },
        {
          "name": "endDate",
          "label": "结束时间",
          "type": "date",
          "required": true,
          "description": "统计时间范围的结束日期"
        },
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "select",
          "required": false,
          "description": "按车辆类型筛选（如外协、临时等）"
        },
        {
          "name": "vehiclePlate",
          "label": "车牌号",
          "type": "input",
          "required": false,
          "description": "按车牌号模糊搜索"
        }
      ],
      "actions": [
        {
          "label": "查询",
          "trigger": "点击",
          "feedback": "根据筛选条件重新加载统计数据与记录列表"
        },
        {
          "label": "重置",
          "trigger": "点击",
          "feedback": "清空所有筛选条件并恢复默认视图"
        },
        {
          "label": "下钻",
          "trigger": "点击图表元素或记录项",
          "feedback": "展示对应车辆或时间段的明细数据（弹窗或跳转）"
        }
      ],
      "validations": [
        "开始时间不能为空",
        "结束时间不能为空",
        "结束时间不能早于开始时间"
      ],
      "states": {
        "empty": "当前筛选条件下无统计数据，请调整时间范围或筛选条件",
        "loading": "正在加载统计数据和记录，请稍候...",
        "success": "数据加载成功，展示统计图表与记录",
        "error": "数据加载失败，请检查网络或联系管理员"
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-1-scenario-1782831312544-1-page-2-1",
        "priority": "P1",
        "type": "辅助页",
        "name": "费用分析页面",
        "vueFile": "StatisticsDashboardView.vue",
        "goal": "统计外协车辆使用次数、入场记录及费用相关数据，辅助外协费用管理决策。",
        "features": [
          "展示外协车辆使用次数及费用汇总",
          "展示外协车辆入场/出场记录",
          "支持按时间范围与车辆维度下钻"
        ],
        "featureText": "展示外协车辆使用次数及费用汇总、展示外协车辆入场/出场记录、支持按时间范围与车辆维度下钻",
        "sections": [
          "外协车辆费用概览",
          "外协车辆入场记录",
          "外协车辆出场记录",
          "数据筛选与下钻"
        ],
        "originalPageKey": "scenario-1782831312544-1-page-2",
        "scenarioKey": "scenario-1782831312544-1",
        "scenarioName": "管理人员统计分析"
      },
      "generatedAt": "2026-07-01T05:51:16.817Z"
    },
    {
      "key": "scenario-1782831312544-1-scenario-1782831312544-1-page-3-2",
      "name": "报表导出页面",
      "vueFile": "StatisticsDashboardView.vue",
      "fields": [
        {
          "name": "reportType",
          "label": "报表类型",
          "type": "select",
          "required": true,
          "description": "选择要导出的报表类型，例如车辆利用率报表、任务完成率报表等。"
        },
        {
          "name": "timeRange",
          "label": "时间范围",
          "type": "daterange",
          "required": true,
          "description": "选择数据导出涵盖的时间范围。"
        },
        {
          "name": "exportFormat",
          "label": "导出格式",
          "type": "select",
          "required": true,
          "description": "选择导出文件格式，支持Excel或PDF。"
        },
        {
          "name": "scope",
          "label": "导出范围",
          "type": "select",
          "required": false,
          "description": "可选：全部数据、当前视图数据、所选下钻数据。"
        },
        {
          "name": "fileName",
          "label": "导出文件名",
          "type": "text",
          "required": false,
          "description": "自定义导出文件的名称，留空则使用默认名称。"
        }
      ],
      "actions": [
        {
          "label": "导出",
          "trigger": "点击导出按钮",
          "feedback": "触发导出任务，显示进度条；导出完成后提供下载链接或自动下载。"
        },
        {
          "label": "查询导出记录",
          "trigger": "点击查询或输入筛选条件",
          "feedback": "根据时间范围、报表类型等条件过滤历史导出记录列表。"
        },
        {
          "label": "取消导出",
          "trigger": "点击取消按钮（仅导出进行中时可见）",
          "feedback": "终止当前导出任务，清除进度。"
        }
      ],
      "validations": [
        "报表类型为必填项",
        "时间范围为必填项",
        "导出格式为必填项",
        "时间范围不能超过90天（系统限制）",
        "导出文件名不超过100字符"
      ],
      "states": {
        "empty": "当前没有任何导出记录或可选配置默认未设置时的提示状态。",
        "loading": "导出任务执行中，显示进度条和剩余时间预估。",
        "success": "导出完成，提供下载链接或自动下载文件，并展示成功提示。",
        "error": "导出失败，显示错误原因（如数据量过大、时间格式错误、系统异常），并提供重试按钮。"
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-1-scenario-1782831312544-1-page-3-2",
        "priority": "P1",
        "type": "辅助页",
        "name": "报表导出页面",
        "vueFile": "StatisticsDashboardView.vue",
        "goal": "支持将当前查看的统计报表或下钻数据导出为Excel、PDF等格式，便于存档与进一步分析。",
        "features": [
          "导出当前可视化数据为Excel",
          "导出统计报表为PDF",
          "支持选择导出范围与格式"
        ],
        "featureText": "导出当前可视化数据为Excel、导出统计报表为PDF、支持选择导出范围与格式",
        "sections": [
          "导出配置区",
          "导出进度展示区",
          "导出记录查询区"
        ],
        "originalPageKey": "scenario-1782831312544-1-page-3",
        "scenarioKey": "scenario-1782831312544-1",
        "scenarioName": "管理人员统计分析"
      },
      "generatedAt": "2026-07-01T05:51:58.027Z"
    },
    {
      "key": "scenario-1782831312544-1-scenario-1782831312544-1-page-4-3",
      "name": "数据下钻页面",
      "vueFile": "StatisticsDashboardView.vue",
      "fields": [
        {
          "name": "dateRange",
          "label": "时间范围",
          "type": "dateRange",
          "required": false,
          "description": "选择统计的时间范围"
        },
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "select",
          "required": false,
          "description": "筛选车辆类型（生产车辆/物流车辆/外协车辆/临时车辆）"
        },
        {
          "name": "area",
          "label": "作业区域",
          "type": "select",
          "required": false,
          "description": "筛选作业区域"
        },
        {
          "name": "driverName",
          "label": "司机姓名",
          "type": "input",
          "required": false,
          "description": "输入司机姓名进行搜索"
        },
        {
          "name": "plateNumber",
          "label": "车牌号",
          "type": "input",
          "required": false,
          "description": "输入车牌号进行搜索"
        }
      ],
      "actions": [
        {
          "label": "下钻至详情",
          "trigger": "点击图表元素或列表行",
          "feedback": "加载对应下钻数据并显示明细对比区"
        },
        {
          "label": "上钻返回",
          "trigger": "点击上钻返回操作区按钮",
          "feedback": "返回到上一级宏观视图"
        },
        {
          "label": "查看司机详情",
          "trigger": "点击司机姓名或详情链接",
          "feedback": "弹出司机详情弹窗或跳转"
        },
        {
          "label": "查看车辆详情",
          "trigger": "点击车牌号或车辆链接",
          "feedback": "弹出车辆详情弹窗或跳转"
        }
      ],
      "validations": [
        "时间范围选择不能超过一年（如适用）"
      ],
      "states": {
        "empty": "无数据时显示空状态提示，并提供返回上钻入口",
        "loading": "加载中显示骨架屏或加载动画",
        "success": "数据加载成功，正常展示图表与列表",
        "error": "数据加载失败，显示错误提示与重试按钮"
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-1-scenario-1782831312544-1-page-4-3",
        "priority": "P1",
        "type": "辅助页",
        "name": "数据下钻页面",
        "vueFile": "StatisticsDashboardView.vue",
        "goal": "允许从宏观统计图表演进到具体车辆、司机或区域的明细数据，支持多维分析。",
        "features": [
          "通过点击图表元素下钻至车辆/司机详情",
          "展示下钻后的明细列表与指标对比",
          "支持返回上钻至宏观视图"
        ],
        "featureText": "通过点击图表元素下钻至车辆/司机详情、展示下钻后的明细列表与指标对比、支持返回上钻至宏观视图",
        "sections": [
          "下钻路径导航区",
          "数据详细对比区",
          "明细数据列表区",
          "上钻返回操作区"
        ],
        "originalPageKey": "scenario-1782831312544-1-page-4",
        "scenarioKey": "scenario-1782831312544-1",
        "scenarioName": "管理人员统计分析"
      },
      "generatedAt": "2026-07-01T05:52:17.405Z"
    },
    {
      "key": "scenario-1782831312544-2-scenario-1782831312544-2-page-1-0",
      "name": "司机执行任务工作台",
      "vueFile": "DriverTaskView.vue（子组件：TaskListSection.vue, TaskDetailPanel.vue）",
      "fields": [
        {
          "name": "searchKeyword",
          "label": "搜索关键词",
          "type": "text",
          "required": false,
          "description": "按任务编号、作业点、物资名称等搜索"
        },
        {
          "name": "taskStatus",
          "label": "任务状态",
          "type": "select",
          "required": false,
          "description": "筛选任务状态：待接单、进行中、已完成等"
        },
        {
          "name": "dateRange",
          "label": "时间范围",
          "type": "dateRange",
          "required": false,
          "description": "按任务创建时间筛选"
        }
      ],
      "actions": [
        {
          "label": "搜索",
          "trigger": "点击搜索按钮",
          "feedback": "刷新任务列表并显示加载动画"
        },
        {
          "label": "查看任务详情",
          "trigger": "点击任务列表项",
          "feedback": "打开任务详情面板或弹窗，展示完整信息"
        },
        {
          "label": "执行任务",
          "trigger": "点击执行按钮",
          "feedback": "跳转到导航引导页面或开始任务执行流程"
        },
        {
          "label": "查看历史任务",
          "trigger": "点击历史标签页",
          "feedback": "切换列表显示已完成任务记录"
        }
      ],
      "validations": [
        "搜索关键词长度不超过50字符",
        "日期范围结束时间不能早于开始时间"
      ],
      "states": {
        "empty": "无待执行任务，请下拉刷新或查看历史任务",
        "loading": "正在加载任务列表，请稍后...",
        "success": "任务列表加载成功",
        "error": "任务列表加载失败，请检查网络后重试"
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-2-scenario-1782831312544-2-page-1-0",
        "priority": "P1",
        "type": "工作台页",
        "name": "司机执行任务工作台",
        "vueFile": "DriverTaskView.vue（子组件：TaskListSection.vue, TaskDetailPanel.vue）",
        "goal": "司机通过手机端接收调度下发的任务通知，展示任务详情（作业点、物资、路线等），支持查看历史任务记录。",
        "features": [
          "接收调度任务推送通知",
          "展示任务列表与详情（作业点",
          "物资",
          "路线）",
          "支持任务筛选与搜索",
          "查看已完成任务历史"
        ],
        "featureText": "接收调度任务推送通知、展示任务列表与详情（作业点、物资、路线）、支持任务筛选与搜索、查看已完成任务历史",
        "sections": [
          "任务筛选与搜索区域",
          "任务列表与详情展示区域"
        ],
        "originalPageKey": "scenario-1782831312544-2-page-1",
        "scenarioKey": "scenario-1782831312544-2",
        "scenarioName": "司机执行任务"
      },
      "generatedAt": "2026-07-01T05:52:51.981Z"
    },
    {
      "key": "scenario-1782831312544-2-scenario-1782831312544-2-page-2-1",
      "name": "导航路线指引页面",
      "vueFile": "NavigationOverlay.vue（嵌入 DriverTaskView.vue）",
      "fields": [
        {
          "name": "currentPosition",
          "label": "当前位置",
          "type": "info",
          "required": false,
          "description": "自动获取的GPS定位，不可编辑"
        },
        {
          "name": "destination",
          "label": "目的作业点",
          "type": "info",
          "required": false,
          "description": "从任务中获取的作业点名称或地址"
        },
        {
          "name": "routeType",
          "label": "导航方式",
          "type": "select",
          "required": true,
          "description": "驾车或步行，默认为驾车"
        },
        {
          "name": "voiceGuide",
          "label": "语音播报",
          "type": "switch",
          "required": false,
          "description": "开启/关闭语音导航提示"
        },
        {
          "name": "routeList",
          "label": "推荐路线",
          "type": "list",
          "required": false,
          "description": "多条备选路线，包括距离和预计时间"
        },
        {
          "name": "totalDistance",
          "label": "总距离",
          "type": "info",
          "required": false,
          "description": "当前选择路线的总里程"
        },
        {
          "name": "estimatedTime",
          "label": "预计用时",
          "type": "info",
          "required": false,
          "description": "当前选择路线的预计行驶时间"
        }
      ],
      "actions": [
        {
          "label": "开始导航",
          "trigger": "点击按钮",
          "feedback": "进入导航模式，地图实时更新，语音播报启动"
        },
        {
          "label": "切换路线",
          "trigger": "选择路线列表中的其他路线",
          "feedback": "地图更新新路线，距离和时间重新计算"
        },
        {
          "label": "切换导航方式",
          "trigger": "切换驾车/步行",
          "feedback": "路线重新规划并显示"
        },
        {
          "label": "切换语音播报",
          "trigger": "点击开关",
          "feedback": "语音播报开启或关闭"
        },
        {
          "label": "刷新路线",
          "trigger": "点击刷新按钮",
          "feedback": "重新规划当前位置到目的地路线"
        },
        {
          "label": "返回",
          "trigger": "点击返回按钮",
          "feedback": "关闭当前页面，回到司机工作台"
        }
      ],
      "validations": [
        "定位权限未开启，无法获取当前位置",
        "无法获取GPS信号，请确保在室外或开启定位服务",
        "目的地不在系统作业点范围内，无法规划路线",
        "当前无网络连接，请在联网后重试",
        "路线规划失败，请稍后重试"
      ],
      "states": {
        "empty": {
          "description": "无可用路线信息，请检查定位和目的地址",
          "icon": "empty"
        },
        "loading": {
          "description": "正在获取位置并规划路线，请稍候...",
          "icon": "loading"
        },
        "success": {
          "description": "路线规划完成，可开始导航",
          "icon": "success"
        },
        "error": {
          "description": "路线规划出错，请尝试刷新或联系调度员",
          "icon": "error"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-2-scenario-1782831312544-2-page-2-1",
        "priority": "P1",
        "type": "辅助页",
        "name": "导航路线指引页面",
        "vueFile": "NavigationOverlay.vue（嵌入 DriverTaskView.vue）",
        "goal": "集成地图导航功能，根据任务作业点自动规划路线，提供语音播报和实时路况，支持一键导航到目标区域或门岗。",
        "features": [
          "自动规划从当前位置到作业点的最优路线",
          "地图显示路线与作业点标记",
          "语音导航播报",
          "支持切换导航方式（步行/驾车）"
        ],
        "featureText": "自动规划从当前位置到作业点的最优路线、地图显示路线与作业点标记、语音导航播报、支持切换导航方式（步行/驾车）",
        "sections": [
          "地图显示区域",
          "导航控制区域",
          "路线信息面板"
        ],
        "originalPageKey": "scenario-1782831312544-2-page-2",
        "scenarioKey": "scenario-1782831312544-2",
        "scenarioName": "司机执行任务"
      },
      "generatedAt": "2026-07-01T05:53:09.433Z"
    },
    {
      "key": "scenario-1782831312544-2-scenario-1782831312544-2-page-3-2",
      "name": "到达拍照确认页面",
      "vueFile": "ArrivalConfirmModal.vue",
      "fields": [
        {
          "name": "photo",
          "label": "现场照片",
          "type": "file",
          "required": true,
          "description": "上传到达作业点后的现场照片，至少一张"
        },
        {
          "name": "arrivalTime",
          "label": "到达时间",
          "type": "datetime",
          "required": false,
          "description": "系统自动记录的到达时间（仅展示）"
        },
        {
          "name": "gpsLocation",
          "label": "GPS位置",
          "type": "text",
          "required": false,
          "description": "系统自动获取的当前位置坐标（仅展示）"
        },
        {
          "name": "manualCheckin",
          "label": "手动签到确认",
          "type": "checkbox",
          "required": false,
          "description": "若地理围栏未自动触发，可手动勾选签到"
        }
      ],
      "actions": [
        {
          "label": "签到确认",
          "trigger": "点击按钮",
          "feedback": "提交签到数据，返回成功或失败提示，并关闭弹窗"
        },
        {
          "label": "拍照上传",
          "trigger": "点击相机图标",
          "feedback": "打开系统相机或文件选择器，选择后预览照片"
        },
        {
          "label": "关闭弹窗",
          "trigger": "点击关闭图标或蒙层",
          "feedback": "取消签到，返回上一页"
        }
      ],
      "validations": [
        "需至少上传一张现场照片",
        "若手动勾选签到，需确认已在作业点范围内",
        "地理围栏自动检测可覆盖手动签到"
      ],
      "states": {
        "empty": "无照片、无签到记录，显示默认提示",
        "loading": "提交签到中，显示加载状态",
        "success": "签到成功，显示成功图标与反馈文字，自动关闭",
        "error": "签到失败，显示错误信息（如围栏外、拍照失败）"
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-2-scenario-1782831312544-2-page-3-2",
        "priority": "P1",
        "type": "辅助页",
        "name": "到达拍照确认页面",
        "vueFile": "ArrivalConfirmModal.vue",
        "goal": "司机到达作业点后，通过拍照或地理围栏签到确认到场，系统自动记录到达时间与位置，并可上传现场照片作为凭证。",
        "features": [
          "地理围栏自动检测到达并提醒签到",
          "拍照上传作业现场照片",
          "手动签到确认到达",
          "记录到达时间与GPS位置"
        ],
        "featureText": "地理围栏自动检测到达并提醒签到、拍照上传作业现场照片、手动签到确认到达、记录到达时间与GPS位置",
        "sections": [
          "到达提醒与签到区域",
          "现场拍照上传区域",
          "签到结果反馈区域"
        ],
        "originalPageKey": "scenario-1782831312544-2-page-3",
        "scenarioKey": "scenario-1782831312544-2",
        "scenarioName": "司机执行任务"
      },
      "generatedAt": "2026-07-01T05:53:30.183Z"
    },
    {
      "key": "scenario-1782831312544-2-scenario-1782831312544-2-page-4-3",
      "name": "到达拍照确认页面",
      "vueFile": "TaskCompletionForm.vue",
      "fields": [
        {
          "name": "loadQuantity",
          "label": "装卸数量",
          "type": "number",
          "required": false,
          "description": "实际装卸的物资数量，可选填写"
        },
        {
          "name": "operationResult",
          "label": "作业结果",
          "type": "select",
          "required": false,
          "description": "选择作业完成结果，如正常完成、部分完成、未完成等"
        },
        {
          "name": "remarks",
          "label": "作业备注",
          "type": "textarea",
          "required": false,
          "description": "填写作业过程中的备注信息，如异常情况描述"
        },
        {
          "name": "abnormalType",
          "label": "异常类型",
          "type": "select",
          "required": false,
          "description": "选择异常类型，如物资损坏、超时、其他"
        },
        {
          "name": "abnormalDescription",
          "label": "异常描述",
          "type": "textarea",
          "required": false,
          "description": "详细描述异常情况，仅在报告异常时填写"
        }
      ],
      "actions": [
        {
          "label": "关闭任务",
          "trigger": "点击“关闭任务”按钮",
          "feedback": "弹出二次确认对话框，确认后提交表单数据，调用关闭任务接口，成功后显示成功提示并返回任务列表"
        },
        {
          "label": "报告异常",
          "trigger": "点击“报告异常”按钮或切换开关",
          "feedback": "展开异常类型与描述输入区域，允许填写异常信息"
        },
        {
          "label": "提交异常报告",
          "trigger": "点击“提交异常”按钮",
          "feedback": "校验异常信息完整后提交，显示提交中状态，成功后显示成功提示，失败显示错误信息"
        }
      ],
      "validations": [
        "装卸数量必须为非负整数",
        "如果选择了异常类型，则异常描述为必填",
        "提交关闭任务时，至少填写装卸数量或作业结果之一（可配置）"
      ],
      "states": {
        "empty": "未填写任何信息，显示空表单，占位提示如“请输入装卸数量”",
        "loading": "提交请求中，按钮显示加载图标并禁用，页面不可重复操作",
        "success": "任务关闭成功，显示绿色成功提示，自动返回上一级任务列表",
        "error": "提交失败，显示红色错误提示，保留已填写内容，允许重新提交"
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-2-scenario-1782831312544-2-page-4-3",
        "priority": "P1",
        "type": "辅助页",
        "name": "到达拍照确认页面",
        "vueFile": "TaskCompletionForm.vue",
        "goal": "完成装卸或作业后，司机一键关闭任务，填写作业备注（如装卸数量、异常情况），系统更新任务状态为已完成并记录完成时间。",
        "features": [
          "一键关闭当前任务",
          "填写作业完成备注（可选）",
          "报告作业异常（如物资损坏",
          "超时）",
          "确认装卸数量或作业结果"
        ],
        "featureText": "一键关闭当前任务、填写作业完成备注（可选）、报告作业异常（如物资损坏、超时）、确认装卸数量或作业结果",
        "sections": [
          "任务完成信息与备注区域",
          "关闭确认操作区域"
        ],
        "originalPageKey": "scenario-1782831312544-2-page-4",
        "scenarioKey": "scenario-1782831312544-2",
        "scenarioName": "司机执行任务"
      },
      "generatedAt": "2026-07-01T05:53:59.593Z"
    },
    {
      "key": "scenario-1782831312544-3-scenario-1782831312544-3-page-1-0",
      "name": "门岗入场核验工作台",
      "vueFile": "GateCheckView.vue（集成入口）或 EntraceCheckComponent.vue",
      "fields": [
        {
          "name": "plateNumber",
          "label": "车牌号",
          "type": "text",
          "required": true,
          "description": "手动输入或通过扫描自动填充，用于核验车辆入场权限"
        },
        {
          "name": "scanButton",
          "label": "扫描",
          "type": "button",
          "required": false,
          "description": "触发摄像头扫描车牌或二维码，自动填充车牌号并发起核验"
        },
        {
          "name": "checkResultStatus",
          "label": "核验结果",
          "type": "text",
          "required": false,
          "description": "自动核验后显示放行或拦截状态，只读"
        },
        {
          "name": "checkResultDetail",
          "label": "核验详情",
          "type": "text",
          "required": false,
          "description": "显示车辆类型、有效期、所属单位等详细核验信息，只读"
        },
        {
          "name": "recordList",
          "label": "入场记录列表",
          "type": "table",
          "required": false,
          "description": "展示最近入场记录，包含车牌号、入场时间、核验结果、操作人"
        }
      ],
      "actions": [
        {
          "label": "扫描车牌",
          "trigger": "点击扫描按钮或扫描设备触发",
          "feedback": "系统自动识别车牌并填充车牌号字段，同时发起核验请求，核验结果区域展示放行或拦截信息"
        },
        {
          "label": "放行",
          "trigger": "核验通过后点击放行按钮",
          "feedback": "系统放行车辆，记录入场时间，更新入场记录列表，门禁联动抬杆"
        },
        {
          "label": "拦截",
          "trigger": "核验失败后点击拦截按钮",
          "feedback": "系统拦截车辆，记录拦截原因，更新入场记录列表，门禁保持关闭，可选通知相关人员"
        },
        {
          "label": "刷新入场记录",
          "trigger": "点击刷新按钮或页面加载",
          "feedback": "重新加载入场记录列表，显示最新数据"
        }
      ],
      "validations": [
        "车牌号必填且符合标准车牌格式",
        "扫描结果需与数据库匹配才能发起核验",
        "核验超时时需提示重试",
        "放行和拦截操作需二次确认"
      ],
      "states": {
        "empty": {
          "description": "未进行扫描或手动输入前，扫描输入区为空，核验结果区隐藏，操作按钮禁用，入场记录列表显示上次记录或空"
        },
        "loading": {
          "description": "正在调用门禁核验接口，显示加载动画或进度条，核验结果区显示'核验中...'，操作按钮禁用"
        },
        "success": {
          "description": "核验通过，核验结果区显示放行状态（绿色标记）和车辆详情，放行按钮可用，拦截按钮不可用，入场记录自动追加"
        },
        "error": {
          "description": "核验失败或接口异常，核验结果区显示拦截状态（红色标记）和失败原因，拦截按钮可用，放行按钮不可用，可手动修改车牌号后重新扫描"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-3-scenario-1782831312544-3-page-1-0",
        "priority": "P1",
        "type": "工作台页",
        "name": "门岗入场核验工作台",
        "vueFile": "GateCheckView.vue（集成入口）或 EntraceCheckComponent.vue",
        "goal": "门岗人员通过扫描车牌或二维码，系统自动核验车辆预约、派车或授权状态，显示放行或拦截结果，并记录入场时间。",
        "features": [
          "扫描车牌/二维码",
          "自动核验预约/派车/授权",
          "显示放行/拦截结果",
          "记录入场时间"
        ],
        "featureText": "扫描车牌/二维码、自动核验预约/派车/授权、显示放行/拦截结果、记录入场时间",
        "sections": [
          "扫描输入区",
          "核验结果展示区",
          "操作区",
          "入场记录列表"
        ],
        "scenarioKey": "scenario-1782831312544-3",
        "scenarioName": "门岗入场核验",
        "originalPageKey": "scenario-1782831312544-3-page-1"
      },
      "generatedAt": "2026-07-01T06:13:14.712Z"
    },
    {
      "key": "scenario-1782831312544-3-scenario-1782831312544-3-page-2-1",
      "name": "出场核验页面",
      "vueFile": "GateCheckView.vue（集成入口）或 ExitCheckComponent.vue",
      "fields": [
        {
          "name": "plateNumber",
          "label": "车牌号",
          "type": "text",
          "required": true,
          "description": "手动输入或扫描识别的车牌号码"
        },
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "readonly",
          "required": false,
          "description": "根据车牌号自动获取的车辆类型"
        },
        {
          "name": "unit",
          "label": "所属单位",
          "type": "readonly",
          "required": false,
          "description": "车辆所属单位"
        },
        {
          "name": "taskStatus",
          "label": "当前任务状态",
          "type": "readonly",
          "required": false,
          "description": "车辆当前是否有进行中的任务"
        },
        {
          "name": "reservationId",
          "label": "预约编号",
          "type": "readonly",
          "required": false,
          "description": "外协车辆的预约入场编号"
        },
        {
          "name": "exitTime",
          "label": "出场时间",
          "type": "datetime",
          "required": true,
          "description": "车辆实际出场时间，默认当前时间可编辑"
        }
      ],
      "actions": [
        {
          "label": "扫描车牌/二维码",
          "trigger": "点击调用设备摄像头扫描",
          "feedback": "扫描成功后自动填充车牌号，并触发资格核验"
        },
        {
          "label": "核验通过放行",
          "trigger": "点击执行核验通过操作",
          "feedback": "显示成功提示，更新出场记录列表，车辆状态变更为已出场"
        },
        {
          "label": "核验不通过拦截",
          "trigger": "点击执行核验不通过操作",
          "feedback": "显示失败原因弹窗，记录异常信息，车辆不得出场"
        },
        {
          "label": "复位/重新核验",
          "trigger": "点击清空当前表单",
          "feedback": "清空所有输入和结果，回到初始状态"
        }
      ],
      "validations": [
        "车牌号不能为空",
        "出场时间不能为空",
        "核验操作必须选择通过或不通过"
      ],
      "states": {
        "empty": {
          "description": "无车辆数据，显示提示语'请扫描或输入车牌号'",
          "style": "灰色背景，居中提示"
        },
        "loading": {
          "description": "扫描或查询中，显示 loading 动画",
          "style": "旋转加载图标"
        },
        "success": {
          "description": "核验通过，显示绿色成功提示框，并展示确认放行按钮已激活",
          "style": "绿色边框"
        },
        "error": {
          "description": "核验失败或系统错误，显示红色错误提示框，并显示错误详情",
          "style": "红色边框"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-3-scenario-1782831312544-3-page-2-1",
        "priority": "P1",
        "type": "辅助页",
        "name": "出场核验页面",
        "vueFile": "GateCheckView.vue（集成入口）或 ExitCheckComponent.vue",
        "goal": "车辆出场时，门岗人员执行核验并记录出场时间，更新车辆在场状态，确保出场车辆已无有效任务或预约。",
        "features": [
          "扫描车牌/二维码",
          "核验车辆出场资格（任务/预约状态）",
          "记录出场时间",
          "更新车辆在场状态"
        ],
        "featureText": "扫描车牌/二维码、核验车辆出场资格（任务/预约状态）、记录出场时间、更新车辆在场状态",
        "sections": [
          "扫描输入区",
          "出场资格核验区",
          "操作区",
          "出场记录列表"
        ],
        "scenarioKey": "scenario-1782831312544-3",
        "scenarioName": "门岗入场核验",
        "originalPageKey": "scenario-1782831312544-3-page-2"
      },
      "generatedAt": "2026-07-01T06:13:38.092Z"
    },
    {
      "key": "scenario-1782831312544-3-scenario-1782831312544-3-page-3-2",
      "name": "异常处理页面",
      "vueFile": "GateCheckView.vue（集成异常弹窗）或 ExceptionHandlingComponent.vue",
      "fields": [
        {
          "name": "reason",
          "label": "异常原因",
          "type": "select",
          "required": true,
          "description": "选择或输入异常原因，如无预约、证照过期等"
        },
        {
          "name": "result",
          "label": "处理结果",
          "type": "radio",
          "required": true,
          "description": "放行或拒绝"
        },
        {
          "name": "remark",
          "label": "处理备注",
          "type": "textarea",
          "required": false,
          "description": "补充说明"
        },
        {
          "name": "notifyRecipients",
          "label": "通知对象",
          "type": "checkbox",
          "required": false,
          "description": "选择通知调度、安保等"
        }
      ],
      "actions": [
        {
          "label": "查询",
          "trigger": "点击查询按钮",
          "feedback": "显示加载状态并刷新异常记录列表"
        },
        {
          "label": "放行",
          "trigger": "点击放行按钮并确认",
          "feedback": "提示操作成功，更新列表并关闭处理界面"
        },
        {
          "label": "拒绝",
          "trigger": "点击拒绝按钮并确认",
          "feedback": "提示操作成功，记录结果"
        },
        {
          "label": "通知",
          "trigger": "点击通知按钮",
          "feedback": "提示已通知相关方"
        }
      ],
      "validations": [
        "处理结果不能为空",
        "异常原因不能为空"
      ],
      "states": {
        "empty": "暂无异常记录",
        "loading": "正在加载异常记录...",
        "success": "操作成功",
        "error": "操作失败，请重试"
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-3-scenario-1782831312544-3-page-3-2",
        "priority": "P1",
        "type": "辅助页",
        "name": "异常处理页面",
        "vueFile": "GateCheckView.vue（集成异常弹窗）或 ExceptionHandlingComponent.vue",
        "goal": "核验失败或异常情况时（如无预约、证照过期、未授权、车牌无法识别），门岗人员可进行人工干预处理，记录异常原因及处理结果并通知相关方。",
        "features": [
          "异常拦截提示与原因展示",
          "人工审核与放行/拒绝操作",
          "记录异常处理结果（原因",
          "处理人",
          "时间）",
          "通知相关方（调度",
          "安保）"
        ],
        "featureText": "异常拦截提示与原因展示、人工审核与放行/拒绝操作、记录异常处理结果（原因、处理人、时间）、通知相关方（调度、安保）",
        "sections": [
          "查询条件区",
          "核验记录列表区"
        ],
        "scenarioKey": "scenario-1782831312544-3",
        "scenarioName": "门岗入场核验",
        "originalPageKey": "scenario-1782831312544-3-page-3"
      },
      "generatedAt": "2026-07-01T06:14:02.971Z"
    },
    {
      "key": "scenario-1782831312544-3-scenario-1782831312544-3-page-4-3",
      "name": "核验日志查询页面",
      "vueFile": "GateCheckView.vue（内嵌列表）或独立页面 GateLogView.vue",
      "fields": [
        {
          "name": "licensePlate",
          "label": "车牌号",
          "type": "input",
          "required": false,
          "description": "输入完整的车牌号或部分字符进行模糊查询"
        },
        {
          "name": "timeRange",
          "label": "核验时间范围",
          "type": "daterangepicker",
          "required": false,
          "description": "选择起始和结束日期，筛选该时间段内的核验记录"
        },
        {
          "name": "checkResult",
          "label": "核验结果",
          "type": "select",
          "required": false,
          "description": "下拉选择：通过、拒绝、异常，支持多选"
        },
        {
          "name": "direction",
          "label": "核验方向",
          "type": "select",
          "required": false,
          "description": "选择入场核验或出场核验"
        }
      ],
      "actions": [
        {
          "label": "查询",
          "trigger": "点击查询按钮",
          "feedback": "刷新列表数据，显示符合筛选条件的核验记录；如无结果则显示空状态"
        },
        {
          "label": "重置",
          "trigger": "点击重置按钮",
          "feedback": "清空所有筛选条件，恢复默认列表"
        },
        {
          "label": "查看详情",
          "trigger": "点击某条记录的行或详情按钮",
          "feedback": "弹窗或侧边栏展示该条核验的完整信息：车辆信息、司机信息、核验结果、时间、现场照片等"
        },
        {
          "label": "导出日志",
          "trigger": "点击导出按钮",
          "feedback": "导出当前筛选条件下的核验记录为Excel文件，触发浏览器下载"
        }
      ],
      "validations": [
        "车牌号输入长度不超过15个字符",
        "时间范围选择时开始日期不能晚于结束日期",
        "核验结果字段为可选，无需必填校验"
      ],
      "states": {
        "empty": {
          "description": "列表无数据",
          "icon": "inbox",
          "text": "暂无核验记录",
          "action": "调整筛选条件后重新查询"
        },
        "loading": {
          "description": "数据加载中",
          "spinner": true,
          "text": "正在查询核验日志..."
        },
        "success": {
          "description": "数据加载成功",
          "hidden": true
        },
        "error": {
          "description": "数据加载失败",
          "icon": "error",
          "text": "查询失败，请检查网络或联系管理员",
          "action": "重新加载"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-3-scenario-1782831312544-3-page-4-3",
        "priority": "P1",
        "type": "辅助页",
        "name": "核验日志查询页面",
        "vueFile": "GateCheckView.vue（内嵌列表）或独立页面 GateLogView.vue",
        "goal": "门岗人员查询车辆入场、出场核验历史记录，可按车牌、时间范围、结果状态等条件进行筛选和详情查看。",
        "features": [
          "按车牌/时间/结果筛选",
          "查看核验详情（车辆",
          "司机",
          "核验结果",
          "时间）",
          "支持导出日志"
        ],
        "featureText": "按车牌/时间/结果筛选、查看核验详情（车辆、司机、核验结果、时间）、支持导出日志",
        "sections": [
          "查询条件区",
          "核验记录列表区",
          "详情查看区"
        ],
        "scenarioKey": "scenario-1782831312544-3",
        "scenarioName": "门岗入场核验",
        "originalPageKey": "scenario-1782831312544-3-page-4"
      },
      "generatedAt": "2026-07-01T06:14:17.116Z"
    },
    {
      "key": "scenario-1782831312544-4-scenario-1782831312544-4-page-1-0",
      "name": "外协车辆预约入场工作台",
      "vueFile": "VehicleReservationView.vue",
      "fields": [
        {
          "name": "plateNumber",
          "label": "车牌号",
          "type": "text",
          "required": true,
          "description": "请输入车牌号，如京A12345"
        },
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "select",
          "required": true,
          "description": "选择车辆类型：货运、客运、特种等"
        },
        {
          "name": "belongCompany",
          "label": "所属单位",
          "type": "text",
          "required": true,
          "description": "填写车辆所属单位名称"
        },
        {
          "name": "driverName",
          "label": "司机姓名",
          "type": "text",
          "required": true,
          "description": "填写司机姓名"
        },
        {
          "name": "driverPhone",
          "label": "司机联系方式",
          "type": "text",
          "required": true,
          "description": "填写司机手机号码"
        },
        {
          "name": "plannedEntryTime",
          "label": "预计入场时间",
          "type": "datetime",
          "required": true,
          "description": "选择预计入场时间"
        },
        {
          "name": "plannedExitTime",
          "label": "预计出场时间",
          "type": "datetime",
          "required": false,
          "description": "选择预计出场时间，可选"
        }
      ],
      "actions": [
        {
          "label": "提交预约申请",
          "trigger": "click",
          "feedback": "提交成功后显示审批结果，包含审批状态和预约编号"
        },
        {
          "label": "查看审批结果",
          "trigger": "click",
          "feedback": "跳转至审批结果详情页或弹窗显示审批状态"
        }
      ],
      "validations": [
        "字段不能为空: 车牌号、车辆类型、所属单位、司机姓名、司机联系方式、预计入场时间",
        "车牌号格式不正确",
        "联系方式格式不正确（11位手机号）",
        "预计入场时间不能晚于预计出场时间",
        "预计入场时间不能早于当前时间"
      ],
      "states": {
        "empty": "请填写预约信息并提交",
        "loading": "正在提交预约申请...",
        "success": "预约已提交，请等待自动审批",
        "error": "提交失败，请检查表单信息后重试"
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-4-scenario-1782831312544-4-page-1-0",
        "priority": "P1",
        "type": "工作台页",
        "name": "外协车辆预约入场工作台",
        "vueFile": "VehicleReservationView.vue",
        "goal": "外协或临时车辆申请人提交预约登记信息，包括车辆信息、司机信息、入场时间等，系统自动审批并生成预约记录。",
        "features": [
          "填写车辆基本信息（车牌",
          "类型",
          "所属单位）",
          "填写司机信息（姓名",
          "联系方式）",
          "选择预计入场时间与出场时间",
          "提交预约申请（自动审批）",
          "查看预约审批结果"
        ],
        "featureText": "填写车辆基本信息（车牌、类型、所属单位）、填写司机信息（姓名、联系方式）、选择预计入场时间与出场时间、提交预约申请（自动审批）、查看预约审批结果",
        "sections": [
          "预约信息录入区",
          "提交与审批反馈区"
        ],
        "scenarioKey": "scenario-1782831312544-4",
        "scenarioName": "外协车辆预约入场",
        "originalPageKey": "scenario-1782831312544-4-page-1"
      },
      "generatedAt": "2026-07-01T06:15:23.435Z"
    },
    {
      "key": "scenario-1782831312544-4-scenario-1782831312544-4-page-2-1",
      "name": "授权凭证页面",
      "vueFile": "VehicleReservationView.vue",
      "fields": [
        {
          "name": "qrCodeImage",
          "label": "授权二维码",
          "type": "image",
          "required": false,
          "description": "动态生成的二维码图片，用于入场核验"
        },
        {
          "name": "authorizationCode",
          "label": "授权码",
          "type": "text",
          "required": false,
          "description": "系统生成的唯一授权码"
        },
        {
          "name": "validPeriod",
          "label": "授权有效期",
          "type": "dateRange",
          "required": false,
          "description": "允许入场的起止时间"
        },
        {
          "name": "reservationId",
          "label": "关联预约单号",
          "type": "text",
          "required": false,
          "description": "对应的入场预约申请编号"
        },
        {
          "name": "vehiclePlate",
          "label": "车牌号",
          "type": "text",
          "required": false,
          "description": "预约车辆的车牌号"
        },
        {
          "name": "driverName",
          "label": "司机姓名",
          "type": "text",
          "required": false,
          "description": "预约的司机姓名"
        }
      ],
      "actions": [
        {
          "label": "下载凭证",
          "trigger": "click",
          "feedback": "下载授权凭证图片到本地"
        },
        {
          "label": "打印凭证",
          "trigger": "click",
          "feedback": "调用系统打印功能打印凭证"
        },
        {
          "label": "查看预约详情",
          "trigger": "click",
          "feedback": "弹出或跳转到预约详情页面"
        }
      ],
      "validations": [
        "授权凭证页面 的关键筛选或处理字段不能为空。",
        "提交前校验状态流转是否合法，并给出明确错误提示。"
      ],
      "states": {
        "empty": "无授权信息，显示暂无授权凭证提示",
        "loading": "授权信息加载中，显示加载动画",
        "success": "授权生成成功，显示二维码和凭证信息",
        "error": "授权生成失败，显示错误提示及重试按钮"
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-4-scenario-1782831312544-4-page-2-1",
        "priority": "P1",
        "type": "辅助页",
        "name": "授权凭证页面",
        "vueFile": "VehicleReservationView.vue",
        "goal": "预约通过后生成入场授权二维码，作为车辆入场凭证，支持下载或展示。",
        "features": [
          "自动生成入场授权二维码",
          "下载或打印授权凭证",
          "查看授权有效期与关联预约信息"
        ],
        "featureText": "自动生成入场授权二维码、下载或打印授权凭证、查看授权有效期与关联预约信息",
        "sections": [
          "授权二维码展示区",
          "凭证操作区",
          "授权信息详情"
        ],
        "scenarioKey": "scenario-1782831312544-4",
        "scenarioName": "外协车辆预约入场",
        "originalPageKey": "scenario-1782831312544-4-page-2"
      },
      "generatedAt": "2026-07-01T06:15:38.923Z"
    },
    {
      "key": "scenario-1782831312544-4-scenario-1782831312544-4-page-3-2",
      "name": "入场记录页面",
      "vueFile": "VehicleReservationView.vue",
      "fields": [
        {
          "name": "entryCode",
          "label": "入场授权码",
          "type": "text",
          "required": true,
          "description": "扫描或手动输入授权码，用于自动填充车辆及司机信息"
        },
        {
          "name": "licensePlate",
          "label": "车牌号",
          "type": "text",
          "required": false,
          "description": "根据授权码自动带出，只读"
        },
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "text",
          "required": false,
          "description": "根据授权码自动带出，只读"
        },
        {
          "name": "driverName",
          "label": "司机姓名",
          "type": "text",
          "required": false,
          "description": "根据授权码自动带出，可编辑"
        },
        {
          "name": "driverPhone",
          "label": "司机手机号",
          "type": "tel",
          "required": false,
          "description": "根据授权码自动带出，可编辑"
        },
        {
          "name": "entryTime",
          "label": "入场时间",
          "type": "datetime",
          "required": false,
          "description": "系统自动生成，只读"
        }
      ],
      "actions": [
        {
          "label": "扫描入场授权码",
          "trigger": "点击扫码按钮或调用摄像头",
          "feedback": "显示扫描动画，成功时自动填充授权码并加载车辆司机信息"
        },
        {
          "label": "确认登记",
          "trigger": "点击确认按钮",
          "feedback": "提交登记申请，成功后显示成功提示，失败显示错误信息"
        },
        {
          "label": "查询历史入场记录",
          "trigger": "点击查询按钮或输入过滤条件",
          "feedback": "显示筛选后的历史记录列表"
        }
      ],
      "validations": [
        "入场授权码不能为空",
        "入场授权码格式必须为6位数字字母组合"
      ],
      "states": {
        "empty": "暂无入场记录或未扫描授权码",
        "loading": "正在扫描授权码或提交登记中...",
        "success": "入场登记成功",
        "error": "入场登记失败，请检查授权码是否有效或网络连接"
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-4-scenario-1782831312544-4-page-3-2",
        "priority": "P1",
        "type": "辅助页",
        "name": "入场记录页面",
        "vueFile": "VehicleReservationView.vue",
        "goal": "车辆到场后通过扫描入场码完成入场登记，记录入场时间、车辆、司机等信息，支持历史入场记录追溯。",
        "features": [
          "扫描入场授权码完成入场登记",
          "记录入场时间",
          "车辆信息",
          "司机信息",
          "查询个人历史入场记录"
        ],
        "featureText": "扫描入场授权码完成入场登记、记录入场时间、车辆信息、司机信息、查询个人历史入场记录",
        "sections": [
          "扫码入场区",
          "登记确认信息区",
          "历史入场记录查询区"
        ],
        "scenarioKey": "scenario-1782831312544-4",
        "scenarioName": "外协车辆预约入场",
        "originalPageKey": "scenario-1782831312544-4-page-3"
      },
      "generatedAt": "2026-07-01T06:16:36.004Z"
    },
    {
      "key": "scenario-1782831312544-4-scenario-1782831312544-4-page-4-3",
      "name": "出场核验页面",
      "vueFile": "VehicleReservationView.vue",
      "fields": [
        {
          "name": "vehicleIdInput",
          "label": "车牌号/凭证号",
          "type": "text",
          "required": true,
          "description": "手动输入或通过扫描获取车辆车牌号或入场凭证号"
        },
        {
          "name": "scanButton",
          "label": "扫描",
          "type": "button",
          "required": false,
          "description": "唤起摄像头扫描车牌或二维码/条形码凭证"
        },
        {
          "name": "vehicleInfo",
          "label": "车辆信息",
          "type": "display",
          "required": false,
          "description": "显示核验成功的车辆信息（车牌、车型、单位、司机等）"
        },
        {
          "name": "reservationInfo",
          "label": "预约信息",
          "type": "display",
          "required": false,
          "description": "显示关联的预约入场记录详情"
        },
        {
          "name": "exitTime",
          "label": "出场时间",
          "type": "datetime",
          "required": false,
          "description": "自动记录当前时间为出场时间，允许手动修正"
        },
        {
          "name": "exitRemark",
          "label": "出场备注",
          "type": "textarea",
          "required": false,
          "description": "记录出场时的特殊情况说明"
        },
        {
          "name": "queryKeyword",
          "label": "查询关键字",
          "type": "text",
          "required": false,
          "description": "按车牌、凭证号、预约单号等模糊搜索出场记录"
        },
        {
          "name": "queryDateRange",
          "label": "查询日期范围",
          "type": "dateRange",
          "required": false,
          "description": "筛选出场记录的起止日期"
        }
      ],
      "actions": [
        {
          "label": "扫描入场凭证",
          "trigger": "点击扫描按钮",
          "feedback": "打开摄像头/扫描界面，扫描成功后自动填充车辆或凭证信息并触发核验"
        },
        {
          "label": "核验出场",
          "trigger": "点击核验按钮（或扫描成功后自动触发）",
          "feedback": "显示核验结果：成功则展示车辆和预约信息，记录出场时间，更新预约状态为已核销；失败则提示错误信息"
        },
        {
          "label": "查询出场记录",
          "trigger": "点击查询按钮或输入查询条件后自动搜索",
          "feedback": "展示符合条件的出场记录列表，支持分页和详情查看"
        },
        {
          "label": "导出出场记录",
          "trigger": "点击导出按钮",
          "feedback": "下载当前查询结果或全部出场记录为Excel/CSV文件"
        }
      ],
      "validations": [
        "车牌号或凭证号不能为空",
        "车牌号格式应为标准车牌（如 京A12345）或凭证号长度在6-20位",
        "出场时间不能晚于当前时间",
        "查询日期范围不能超过90天",
        "核验失败时需提示具体原因（如预约已核销、车辆未预约、车辆已出场等）"
      ],
      "states": {
        "empty": "无车辆信息输入，页面显示默认引导文字和扫描/输入区域，无核验结果内容",
        "loading": "执行核验或查询时，按钮显示加载图标，界面不可重复操作",
        "success": "核验通过：显示车辆和预约详情，出场时间自动填入，预约状态变为已核销，提供操作成功提示",
        "error": "核验失败：显示错误提示（如未找到预约、证件过期等），输入区域保持可修改状态以便重新核验"
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-4-scenario-1782831312544-4-page-4-3",
        "priority": "P1",
        "type": "辅助页",
        "name": "出场核验页面",
        "vueFile": "VehicleReservationView.vue",
        "goal": "车辆出场时核验出场信息，自动核销预约记录，记录出场时间。",
        "features": [
          "扫描车辆入场凭证或车牌",
          "核验出场信息并记录出场时间",
          "自动更新预约状态为已核销",
          "提供出场记录查询"
        ],
        "featureText": "扫描车辆入场凭证或车牌、核验出场信息并记录出场时间、自动更新预约状态为已核销、提供出场记录查询",
        "sections": [
          "核验信息输入区",
          "核验结果与操作区",
          "出场记录查询区"
        ],
        "scenarioKey": "scenario-1782831312544-4",
        "scenarioName": "外协车辆预约入场",
        "originalPageKey": "scenario-1782831312544-4-page-4"
      },
      "generatedAt": "2026-07-01T06:17:03.296Z"
    },
    {
      "key": "scenario-1782887819107-0-scenario-1782887819107-0-page-1-0",
      "name": "现场调度地图监控",
      "vueFile": "DispatchMapView.vue",
      "fields": [
        {
          "name": "vehicleTypeFilter",
          "label": "车辆类型",
          "type": "select",
          "required": false,
          "description": "筛选指定类型的车辆，如生产车辆、物流车辆等"
        },
        {
          "name": "vehicleStatusFilter",
          "label": "车辆状态",
          "type": "select",
          "required": false,
          "description": "筛选空闲、任务中、排队、异常等状态的车辆"
        },
        {
          "name": "searchPlate",
          "label": "搜索车牌号",
          "type": "text",
          "required": false,
          "description": "输入车牌号快速定位车辆"
        }
      ],
      "actions": [
        {
          "label": "查看车辆详情",
          "trigger": "点击地图上的车辆图标",
          "feedback": "弹出详情窗口，显示车牌、司机、任务、状态等信息"
        },
        {
          "label": "切换地图图层",
          "trigger": "点击图层切换按钮",
          "feedback": "切换显示作业区域、禁入区域、排队区域等图层"
        },
        {
          "label": "派发任务",
          "trigger": "在控制面板中选择车辆并点击派车",
          "feedback": "打开派车对话框，填写任务信息后提交"
        },
        {
          "label": "处理异常告警",
          "trigger": "点击异常告警通知区域中的告警项",
          "feedback": "跳转至异常告警处理面板"
        }
      ],
      "validations": [
        "现场调度地图监控 的关键筛选或处理字段不能为空。",
        "提交前校验状态流转是否合法，并给出明确错误提示。"
      ],
      "states": {
        "empty": {
          "description": "无车辆数据时，地图中央显示提示文字“暂无车辆数据”"
        },
        "loading": {
          "description": "地图和车辆数据加载中，显示加载动画"
        },
        "success": {
          "description": "正常显示地图和车辆标注"
        },
        "error": {
          "description": "数据获取失败或地图加载失败时，显示错误提示和重试按钮"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-0-scenario-1782887819107-0-page-1-0",
        "priority": "P0",
        "type": "工作台页",
        "name": "现场调度地图监控",
        "vueFile": "DispatchMapView.vue",
        "goal": "基于地图看板实时展示所有车辆的位置、状态（空闲、排队、任务中、异常）、作业区域，支持缩放、点击查看车辆详情",
        "features": [
          "实时车辆位置标注与状态颜色区分",
          "点击车辆弹出详情窗口：车牌",
          "司机",
          "任务",
          "状态",
          "地图图层切换：作业区域",
          "禁入区域",
          "排队区域",
          "车辆轨迹回放（可选）"
        ],
        "featureText": "实时车辆位置标注与状态颜色区分、点击车辆弹出详情窗口：车牌、司机、任务、状态、地图图层切换：作业区域、禁入区域、排队区域、车辆轨迹回放（可选）",
        "sections": [
          "地图主区域",
          "车辆状态筛选与任务派发控制面板",
          "异常告警通知区域"
        ],
        "scenarioKey": "scenario-1782887819107-0",
        "scenarioName": "调度员现场调度",
        "originalPageKey": "scenario-1782887819107-0-page-1"
      },
      "generatedAt": "2026-07-01T07:30:36.998Z"
    },
    {
      "key": "scenario-1782887819107-0-scenario-1782887819107-0-page-2-1",
      "name": "现场车辆快速筛选",
      "vueFile": "OnsiteVehicleFilter.vue",
      "fields": [
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "select",
          "required": false,
          "description": "按车辆类型筛选，支持多选：生产车、物流车、外协车、临时车"
        },
        {
          "name": "status",
          "label": "车辆状态",
          "type": "select",
          "required": false,
          "description": "车辆当前状态：空闲、排队、任务中、异常"
        },
        {
          "name": "area",
          "label": "作业区域",
          "type": "select",
          "required": false,
          "description": "选择作业区域"
        },
        {
          "name": "sortBy",
          "label": "排序方式",
          "type": "select",
          "required": false,
          "description": "按距离优先、空闲时长或任务优先级排序"
        },
        {
          "name": "keyword",
          "label": "搜索关键字",
          "type": "text",
          "required": false,
          "description": "输入车牌号或司机姓名进行模糊匹配"
        }
      ],
      "actions": [
        {
          "label": "应用筛选",
          "trigger": "点击按钮",
          "feedback": "根据筛选条件重新加载车辆列表并在地图上高亮匹配车辆"
        },
        {
          "label": "重置",
          "trigger": "点击按钮",
          "feedback": "重置所有筛选条件为默认值，显示全部车辆"
        },
        {
          "label": "切换视图",
          "trigger": "点击切换按钮",
          "feedback": "在地图视图与列表视图之间切换"
        }
      ],
      "validations": [
        "关键字搜索长度不超过20个字符",
        "车辆类型和状态至少选择一项时执行查询"
      ],
      "states": {
        "empty": "没有符合条件的车辆，请调整筛选条件",
        "loading": "正在加载车辆数据，请稍候...",
        "success": "已加载N辆车辆，请在筛选结果中查看",
        "error": "车辆数据加载失败，请检查网络连接后重试"
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-0-scenario-1782887819107-0-page-2-1",
        "priority": "P1",
        "type": "辅助页",
        "name": "现场车辆快速筛选",
        "vueFile": "OnsiteVehicleFilter.vue",
        "goal": "支持按车辆类型、状态（空闲/排队/任务中）、作业区域、距离远近等条件筛选车辆，便于调度员快速定位合适车辆",
        "features": [
          "多条件组合筛选：车辆类型（生产车/物流车/外协车/临时车）",
          "状态",
          "区域",
          "筛选结果在地图上高亮显示",
          "列表视图展示筛选结果",
          "支持排序",
          "一键重置筛选条件"
        ],
        "featureText": "多条件组合筛选：车辆类型（生产车/物流车/外协车/临时车）、状态、区域、筛选结果在地图上高亮显示、列表视图展示筛选结果，支持排序、一键重置筛选条件",
        "sections": [
          "筛选条件面板",
          "筛选结果展示区（地图/列表）",
          "快捷操作栏"
        ],
        "scenarioKey": "scenario-1782887819107-0",
        "scenarioName": "调度员现场调度",
        "originalPageKey": "scenario-1782887819107-0-page-2"
      },
      "generatedAt": "2026-07-01T07:31:04.300Z"
    },
    {
      "key": "scenario-1782887819107-0-scenario-1782887819107-0-page-3-2",
      "name": "现场派车",
      "vueFile": "OnsiteDispatchDialog.vue",
      "fields": [
        {
          "name": "applicationSelection",
          "label": "待派发用车申请",
          "type": "tableSelect",
          "required": true,
          "description": "从待派发申请列表中选择一条用车申请，若启用紧急派车则无需选择"
        },
        {
          "name": "vehicleSelection",
          "label": "目标车辆",
          "type": "vehiclePicker",
          "required": true,
          "description": "选择要派发的车辆，支持按车牌、类型筛选"
        },
        {
          "name": "workPoint",
          "label": "作业点",
          "type": "text",
          "required": true,
          "description": "输入或选择作业点位置，如：5号泊位、2号堆场"
        },
        {
          "name": "priority",
          "label": "优先级",
          "type": "select",
          "required": true,
          "description": "高/中/低，用于调度排序"
        },
        {
          "name": "taskRemark",
          "label": "派车备注",
          "type": "textarea",
          "required": false,
          "description": "可附加说明或特殊要求"
        },
        {
          "name": "isEmergency",
          "label": "紧急派车",
          "type": "switch",
          "required": false,
          "description": "开启后跳过申请选择，手动创建任务"
        },
        {
          "name": "emergencyTaskDesc",
          "label": "任务描述",
          "type": "text",
          "required": false,
          "description": "紧急派车时必填，描述任务内容"
        }
      ],
      "actions": [
        {
          "label": "派发",
          "trigger": "click",
          "feedback": "校验表单 -> 调用派发接口 -> 成功显示Success状态并关闭对话框；失败显示Error状态"
        },
        {
          "label": "取消",
          "trigger": "click",
          "feedback": "关闭对话框不保存"
        },
        {
          "label": "切换紧急派车模式",
          "trigger": "isEmergency值变化",
          "feedback": "控制紧急任务字段的显隐与必填校验"
        }
      ],
      "validations": [
        "选择用车申请与紧急派车互斥，至少选择一种",
        "目标车辆必填",
        "作业点必填",
        "优先级必填",
        "紧急派车时，任务描述必填",
        "车辆与任务匹配检查：所选车辆是否已被占用或禁入"
      ],
      "states": {
        "empty": {
          "description": "页面初始化，待派发申请列表为空",
          "uiHint": "显示占位文字：暂无待派发申请，可切换紧急派车模式"
        },
        "loading": {
          "description": "表单提交中，等待接口返回",
          "uiHint": "显示加载动画，禁用提交按钮"
        },
        "success": {
          "description": "派发成功，接口返回成功",
          "uiHint": "显示成功提示信息，2秒后自动关闭对话框或跳转"
        },
        "error": {
          "description": "派发失败，接口返回错误",
          "uiHint": "显示错误信息（如：车辆忙、任务冲突），保持表单可编辑，允许修改后重试"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-0-scenario-1782887819107-0-page-3-2",
        "priority": "P1",
        "type": "辅助页",
        "name": "现场派车",
        "vueFile": "OnsiteDispatchDialog.vue",
        "goal": "调度员为选中的车辆分配任务，支持选择用车申请、输入作业点、选择优先级，并一键下发至司机移动端",
        "features": [
          "显示待派发的用车申请列表",
          "选择目标车辆后",
          "匹配任务并确认派发",
          "支持紧急派车（跳过申请手动创建任务）",
          "派发成功后推送通知至司机端",
          "记录派发日志（操作人",
          "时间",
          "车辆",
          "任务）"
        ],
        "featureText": "显示待派发的用车申请列表、选择目标车辆后，匹配任务并确认派发、支持紧急派车（跳过申请手动创建任务）、派发成功后推送通知至司机端、记录派发日志（操作人、时间、车辆、任务）",
        "sections": [
          "待派发用车申请列表",
          "车辆选择与任务匹配",
          "派发参数配置",
          "派发操作与日志"
        ],
        "scenarioKey": "scenario-1782887819107-0",
        "scenarioName": "调度员现场调度",
        "originalPageKey": "scenario-1782887819107-0-page-3"
      },
      "generatedAt": "2026-07-01T07:32:26.150Z"
    },
    {
      "key": "scenario-1782887819107-0-scenario-1782887819107-0-page-4-3",
      "name": "现场异常告警处理",
      "vueFile": "OnsiteExceptionAlert.vue",
      "fields": [
        {
          "name": "exportFormat",
          "label": "导出格式",
          "type": "select",
          "required": true,
          "description": "支持Excel（.xlsx）和PDF格式"
        },
        {
          "name": "exportScope",
          "label": "导出内容范围",
          "type": "radio",
          "required": true,
          "description": "选择导出全部报表或仅导出指定指标"
        },
        {
          "name": "selectedIndicators",
          "label": "指定指标",
          "type": "multi-select",
          "required": false,
          "description": "当导出范围选择'指定指标'时，可选择需要导出的具体指标列表"
        }
      ],
      "actions": [
        {
          "label": "导出",
          "trigger": "click导出按钮",
          "feedback": "校验必填字段，若通过则调用导出API；成功时自动下载文件并记录日志，显示成功提示；失败时显示错误信息"
        }
      ],
      "validations": [
        "导出格式为必选",
        "当导出范围选择'指定指标'时，至少选择一个指标"
      ],
      "states": {
        "empty": {
          "description": "页面初始加载，无导出操作进行"
        },
        "loading": {
          "description": "导出请求已发送，等待服务端响应"
        },
        "success": {
          "description": "导出成功，文件已开始下载，日志已记录"
        },
        "error": {
          "description": "导出失败，页面展示错误详情"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-0-scenario-1782887819107-0-page-4-3",
        "priority": "P1",
        "type": "辅助页",
        "name": "现场异常告警处理",
        "vueFile": "OnsiteExceptionAlert.vue",
        "goal": "实时接收车辆异常告警（超速、禁入区域、异常停留、未授权入场等），支持调度员查看详情、处理告警、标记解决",
        "features": [
          "异常告警列表实时刷新",
          "显示告警类型",
          "车辆",
          "时间",
          "位置",
          "点击告警可在地图上定位车辆并查看详情",
          "支持处理告警：确认",
          "忽略",
          "通知相关人员",
          "告警历史记录查询与导出"
        ],
        "featureText": "异常告警列表实时刷新，显示告警类型、车辆、时间、位置、点击告警可在地图上定位车辆并查看详情、支持处理告警：确认、忽略、通知相关人员、告警历史记录查询与导出",
        "sections": [
          "告警实时列表区域",
          "告警详情与处理区域",
          "历史告警查询区域"
        ],
        "scenarioKey": "scenario-1782887819107-0",
        "scenarioName": "调度员现场调度",
        "originalPageKey": "scenario-1782887819107-0-page-4"
      },
      "generatedAt": "2026-07-01T07:45:55.971Z"
    },
    {
      "key": "scenario-1782887819107-1-scenario-1782887819107-1-page-1-0",
      "name": "任务列表",
      "vueFile": "TaskListView.vue",
      "fields": [
        {
          "name": "statusFilter",
          "label": "任务状态筛选",
          "type": "select",
          "required": false,
          "description": "按任务状态（待接单、进行中、已完成）筛选列表"
        },
        {
          "name": "taskId",
          "label": "任务编号",
          "type": "text",
          "required": false,
          "description": "任务唯一标识号，展示在任务卡片中"
        },
        {
          "name": "workPoint",
          "label": "作业点",
          "type": "text",
          "required": false,
          "description": "任务作业地点名称"
        },
        {
          "name": "requiredTime",
          "label": "要求时间",
          "type": "text",
          "required": false,
          "description": "任务要求完成或到达的时间"
        },
        {
          "name": "taskStatus",
          "label": "任务状态",
          "type": "text",
          "required": false,
          "description": "当前任务状态（待接单、进行中、已完成）"
        }
      ],
      "actions": [
        {
          "label": "下拉刷新",
          "trigger": "用户下拉页面",
          "feedback": "重新加载任务列表数据"
        },
        {
          "label": "分页加载",
          "trigger": "滚动至列表底部",
          "feedback": "加载更多历史任务"
        },
        {
          "label": "点击任务项",
          "trigger": "点击任务卡片",
          "feedback": "跳转至任务详情页（TaskDetailView.vue）"
        },
        {
          "label": "接收通知",
          "trigger": "服务端推送或轮询",
          "feedback": "显示未读标记并更新任务列表"
        }
      ],
      "validations": [
        "任务列表 的关键筛选或处理字段不能为空。",
        "提交前校验状态流转是否合法，并给出明确错误提示。"
      ],
      "states": {
        "empty": "暂无任务，请等待新任务通知",
        "loading": "正在加载任务列表，显示骨架屏或加载动画",
        "success": "正常显示任务列表",
        "error": "加载失败，显示错误提示及重试按钮"
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-1-scenario-1782887819107-1-page-1-0",
        "priority": "P0",
        "type": "工作台页",
        "name": "任务列表",
        "vueFile": "TaskListView.vue",
        "goal": "司机查看个人任务列表，接收新任务通知，筛选和查看不同状态的任务",
        "features": [
          "接收任务通知并显示未读标记",
          "按状态（待接单",
          "进行中",
          "已完成）筛选任务",
          "显示任务摘要信息（任务编号",
          "作业点",
          "要求时间）",
          "支持下拉刷新和分页加载"
        ],
        "featureText": "接收任务通知并显示未读标记、按状态（待接单、进行中、已完成）筛选任务、显示任务摘要信息（任务编号、作业点、要求时间）、支持下拉刷新和分页加载",
        "sections": [
          "任务通知区域",
          "任务状态筛选区域",
          "任务列表展示区域"
        ],
        "scenarioKey": "scenario-1782887819107-1",
        "scenarioName": "司机任务执行",
        "originalPageKey": "scenario-1782887819107-1-page-1"
      },
      "generatedAt": "2026-07-01T07:33:39.817Z"
    },
    {
      "key": "scenario-1782887819107-1-scenario-1782887819107-1-page-2-1",
      "name": "任务详情",
      "vueFile": "TaskDetailView.vue",
      "fields": [
        {
          "name": "taskId",
          "label": "任务编号",
          "type": "text",
          "required": false,
          "description": "任务唯一标识"
        },
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "text",
          "required": false,
          "description": "车辆类型，如平板车、叉车等"
        },
        {
          "name": "plateNumber",
          "label": "车牌号",
          "type": "text",
          "required": false,
          "description": "车辆牌照号码"
        },
        {
          "name": "driverName",
          "label": "司机姓名",
          "type": "text",
          "required": false,
          "description": "司机姓名"
        },
        {
          "name": "driverPhone",
          "label": "司机电话",
          "type": "text",
          "required": false,
          "description": "司机联系电话"
        },
        {
          "name": "taskStatus",
          "label": "任务状态",
          "type": "text",
          "required": false,
          "description": "当前任务状态，如待执行、执行中、已完成"
        },
        {
          "name": "taskRequirement",
          "label": "任务要求",
          "type": "textarea",
          "required": false,
          "description": "车辆类型、物资种类、作业说明等综合描述"
        },
        {
          "name": "plannedArrivalTime",
          "label": "计划到达时间",
          "type": "datetime",
          "required": false,
          "description": "计划到达作业点的时间"
        },
        {
          "name": "plannedCompletionTime",
          "label": "计划完成时间",
          "type": "datetime",
          "required": false,
          "description": "计划完成任务的时间"
        },
        {
          "name": "siteName",
          "label": "作业点名称",
          "type": "text",
          "required": false,
          "description": "作业点名称或编号"
        },
        {
          "name": "siteAddress",
          "label": "作业点地址",
          "type": "text",
          "required": false,
          "description": "作业点详细地址"
        },
        {
          "name": "contactPerson",
          "label": "联系人",
          "type": "text",
          "required": false,
          "description": "作业点联系人姓名"
        },
        {
          "name": "contactPhone",
          "label": "联系人电话",
          "type": "text",
          "required": false,
          "description": "作业点联系人电话"
        }
      ],
      "actions": [
        {
          "label": "导航",
          "trigger": "tap",
          "feedback": "打开地图导航至作业点"
        },
        {
          "label": "联系调度员",
          "trigger": "tap",
          "feedback": "弹出联系调度员对话框，支持电话或消息"
        }
      ],
      "validations": [
        "任务详情 的关键筛选或处理字段不能为空。",
        "提交前校验状态流转是否合法，并给出明确错误提示。"
      ],
      "states": {
        "empty": "任务数据为空，请确认任务ID或刷新页面",
        "loading": "正在加载任务详情...",
        "success": "任务详情加载成功",
        "error": "加载任务详情失败，请稍后重试"
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-1-scenario-1782887819107-1-page-2-1",
        "priority": "P1",
        "type": "辅助页",
        "name": "任务详情",
        "vueFile": "TaskDetailView.vue",
        "goal": "展示任务的详细信息，包括作业点位置、任务要求、物资信息等",
        "features": [
          "展示作业点名称",
          "地址",
          "联系人信息",
          "展示任务要求（车辆类型",
          "物资种类",
          "作业说明）",
          "展示任务时间节点（计划到达时间",
          "完成时间）",
          "提供导航入口和联系调度员功能"
        ],
        "featureText": "展示作业点名称、地址、联系人信息、展示任务要求（车辆类型、物资种类、作业说明）、展示任务时间节点（计划到达时间、完成时间）、提供导航入口和联系调度员功能",
        "sections": [
          "任务基本信息区域",
          "作业点信息区域",
          "任务时间区域",
          "操作区域"
        ],
        "scenarioKey": "scenario-1782887819107-1",
        "scenarioName": "司机任务执行",
        "originalPageKey": "scenario-1782887819107-1-page-2"
      },
      "generatedAt": "2026-07-01T07:34:31.097Z"
    },
    {
      "key": "scenario-1782887819107-1-scenario-1782887819107-1-page-3-2",
      "name": "导航与路径",
      "vueFile": "NavigationView.vue",
      "fields": [
        {
          "name": "currentLocation",
          "label": "当前位置",
          "type": "geocoordinate",
          "required": true,
          "description": "实时获取的司机GPS坐标"
        },
        {
          "name": "destination",
          "label": "目标作业点",
          "type": "text",
          "required": true,
          "description": "任务指定的作业点名称或地址"
        },
        {
          "name": "remainingDistance",
          "label": "剩余距离",
          "type": "text",
          "required": false,
          "description": "实时显示的距目标点距离，如'1.2km'"
        },
        {
          "name": "estimatedArrivalTime",
          "label": "预计到达时间",
          "type": "text",
          "required": false,
          "description": "实时更新的预计到达时间，如'14:25'"
        },
        {
          "name": "navigationRoute",
          "label": "导航路线",
          "type": "polyline",
          "required": true,
          "description": "地图上绘制的从当前位置到目的地的路径"
        }
      ],
      "actions": [
        {
          "label": "开始导航",
          "trigger": "onStartNavigation",
          "feedback": "切换至导航模式，开始语音引导并在地图上显示路线"
        },
        {
          "label": "暂停语音",
          "trigger": "onToggleVoice",
          "feedback": "切换语音播报开关状态，暂停或恢复语音提示"
        },
        {
          "label": "关闭导航",
          "trigger": "onStopNavigation",
          "feedback": "退出导航视图，返回任务详情页"
        },
        {
          "label": "确认到达",
          "trigger": "onArrivalConfirm",
          "feedback": "弹出确认对话框，用户确认后标记任务状态为到达并记录时间"
        }
      ],
      "validations": [
        "GPS定位权限未开启，请前往设置开启位置服务",
        "导航目的地未指定，请先关联有效的作业点",
        "网络信号弱，地图加载可能延迟"
      ],
      "states": {
        "empty": {
          "description": "未开始导航，显示当前位置标记和任务作业点标记",
          "mockup": "页面显示地图，等待用户点击开始导航"
        },
        "loading": {
          "description": "正在计算路径或加载地图数据",
          "mockup": "地图区域显示加载动画，文字提示'正在获取导航路径…'"
        },
        "success": {
          "description": "导航进行中，实时显示路线、剩余距离和预计到达时间",
          "mockup": "地图高亮显示路径，底部栏显示距离和时间，语音播报正常"
        },
        "error": {
          "description": "定位失败或网络中断，无法获取导航信息",
          "mockup": "弹窗提示错误原因，并提供重试按钮"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-1-scenario-1782887819107-1-page-3-2",
        "priority": "P1",
        "type": "辅助页",
        "name": "导航与路径",
        "vueFile": "NavigationView.vue",
        "goal": "从司机当前位置导航至指定作业点，实时显示路径和预计到达时间",
        "features": [
          "获取司机当前位置并计算到作业点的最优路径",
          "显示导航路线",
          "距离和预计到达时间",
          "支持语音导航和路线偏离提醒",
          "到达作业点附近时自动触发到达确认提示"
        ],
        "featureText": "获取司机当前位置并计算到作业点的最优路径、显示导航路线、距离和预计到达时间、支持语音导航和路线偏离提醒、到达作业点附近时自动触发到达确认提示",
        "sections": [
          "地图显示区域",
          "导航信息区域",
          "操作与提示区域"
        ],
        "scenarioKey": "scenario-1782887819107-1",
        "scenarioName": "司机任务执行",
        "originalPageKey": "scenario-1782887819107-1-page-3"
      },
      "generatedAt": "2026-07-01T07:34:43.834Z"
    },
    {
      "key": "scenario-1782887819107-1-scenario-1782887819107-1-page-4-3",
      "name": "现场反馈",
      "vueFile": "SiteFeedbackView.vue",
      "fields": [
        {
          "name": "taskId",
          "label": "任务编号",
          "type": "hidden",
          "required": true,
          "description": "关联的任务ID，用于绑定反馈记录"
        },
        {
          "name": "arrivalTime",
          "label": "到达时间",
          "type": "text",
          "required": true,
          "description": "司机点击'到达确认'时自动记录的时间戳"
        },
        {
          "name": "photos",
          "label": "现场照片",
          "type": "file",
          "required": false,
          "description": "支持多张照片上传，用于记录现场情况，格式jpg/png，单张不超过5MB"
        },
        {
          "name": "remark",
          "label": "备注",
          "type": "textarea",
          "required": false,
          "description": "添加文字备注或异常说明，不超过500字符"
        }
      ],
      "actions": [
        {
          "label": "到达确认",
          "trigger": "click",
          "feedback": "记录到达时间并锁定按钮，显示成功提示'已到达'，同时禁用该按钮防止重复点击"
        },
        {
          "label": "上传照片",
          "trigger": "change",
          "feedback": "上传照片后显示缩略图预览，支持删除已上传照片；若上传失败显示错误提示"
        },
        {
          "label": "提交反馈",
          "trigger": "click",
          "feedback": "校验备注和照片后提交至后台，提交过程中按钮置为加载状态；成功后显示'反馈已提交'并自动跳转至任务列表，失败则保留输入内容显示错误信息"
        }
      ],
      "validations": [
        "到达确认必须在任务状态为'已出发'或'进行中'时执行",
        "照片格式仅支持jpg、png，单张不超过5MB",
        "备注长度不超过500字符",
        "提交反馈前必须已完成到达确认（即arrivalTime有值）"
      ],
      "states": {
        "empty": {
          "description": "页面初始加载完成时，显示任务信息（任务编号、计划到达时间等）以及'到达确认'按钮和拍照、备注组件，所有输入均为空"
        },
        "loading": {
          "description": "点击'到达确认'或'提交反馈'按钮时，对应按钮变为禁用并显示旋转加载图标，阻止用户重复操作"
        },
        "success": {
          "description": "到达确认成功：按钮变为绿色对勾并显示'已到达'文字；反馈提交成功：弹出绿色toast提示'反馈已提交'，3秒后自动返回任务列表"
        },
        "error": {
          "description": "网络异常或服务器返回错误时，在按钮下方显示红色错误提示文字，保留用户已填写的内容，允许用户修正后重试"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-1-scenario-1782887819107-1-page-4-3",
        "priority": "P1",
        "type": "辅助页",
        "name": "现场反馈",
        "vueFile": "SiteFeedbackView.vue",
        "goal": "司机在到达作业点后确认到达，并上传现场照片或备注信息",
        "features": [
          "点击'到达确认'并记录到达时间",
          "现场拍照上传（支持多张照片）",
          "添加文字备注或异常说明",
          "反馈信息与任务关联并同步至调度端"
        ],
        "featureText": "点击'到达确认'并记录到达时间、现场拍照上传（支持多张照片）、添加文字备注或异常说明、反馈信息与任务关联并同步至调度端",
        "sections": [
          "到达确认区域",
          "现场反馈与上传区域"
        ],
        "scenarioKey": "scenario-1782887819107-1",
        "scenarioName": "司机任务执行",
        "originalPageKey": "scenario-1782887819107-1-page-4"
      },
      "generatedAt": "2026-07-01T07:42:04.009Z"
    },
    {
      "key": "scenario-1782887819107-2-scenario-1782887819107-2-page-1-0",
      "name": "入场核验 - 支持扫描车牌或二维码，自动核验预约与任务关联",
      "vueFile": "EntryCheckPanel.vue",
      "fields": [
        {
          "name": "plateNumber",
          "label": "车牌号",
          "type": "text",
          "required": false,
          "description": "手动输入或通过扫描识别车牌号"
        },
        {
          "name": "qrCode",
          "label": "预约二维码",
          "type": "text",
          "required": false,
          "description": "通过扫描预约二维码自动填充"
        },
        {
          "name": "scanResult",
          "label": "扫描结果",
          "type": "text",
          "required": false,
          "description": "扫描识别后的原始内容（车牌或二维码）"
        },
        {
          "name": "verificationResult",
          "label": "核验结果",
          "type": "text",
          "required": false,
          "description": "自动核验后显示的放行或拒绝信息"
        },
        {
          "name": "exceptionReason",
          "label": "异常原因",
          "type": "textarea",
          "required": false,
          "description": "核验异常时的原因描述，供手动处理参考"
        },
        {
          "name": "manualAction",
          "label": "手动操作备注",
          "type": "textarea",
          "required": false,
          "description": "人工处理异常时填写的操作备注"
        }
      ],
      "actions": [
        {
          "label": "扫描车牌/二维码",
          "trigger": "点击扫描按钮或调用摄像头扫描",
          "feedback": "识别结果填充到对应字段，触发自动核验"
        },
        {
          "label": "手动核验",
          "trigger": "填写车牌号后点击核验按钮",
          "feedback": "调用后台服务核验预约与任务关联，展示核验结果"
        },
        {
          "label": "放行",
          "trigger": "在核验通过后点击放行按钮",
          "feedback": "更新车辆入场状态，记录操作日志，跳转或刷新页面"
        },
        {
          "label": "拒绝入场",
          "trigger": "在核验未通过时点击拒绝按钮",
          "feedback": "记录拒绝原因和操作人，更新状态，显示拒绝结果"
        },
        {
          "label": "提交异常处理",
          "trigger": "在异常处理区填写备注后提交",
          "feedback": "保存异常记录，更新操作记录区，提示成功或失败"
        }
      ],
      "validations": [
        "车牌号格式校验（符合标准车牌格式）",
        "预约二维码格式校验（符合系统编码规则）",
        "扫描结果不能为空时需自动发起核验",
        "手动核验时车牌号不能为空",
        "拒绝入场时需填写拒绝原因"
      ],
      "states": {
        "empty": "无扫描输入，显示提示信息“请扫描车牌或预约二维码”",
        "loading": "正在扫描或核验中，显示加载动画或进度条",
        "success": "核验通过，显示绿色放行提示，并提供放行按钮",
        "error": "核验失败或异常，显示红色拒绝提示，并展示异常处理区"
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-2-scenario-1782887819107-2-page-1-0",
        "priority": "P1",
        "type": "工作台页",
        "name": "入场核验 - 支持扫描车牌或二维码，自动核验预约与任务关联",
        "vueFile": "EntryCheckPanel.vue",
        "goal": "支持通过扫描车牌或预约二维码，自动核验车辆预约有效性及派车任务关联，快速得出入场许可结果",
        "features": [
          "扫描车牌或预约二维码",
          "自动核验预约有效性及任务关联",
          "显示核验结果（放行/拒绝）",
          "处理核验异常并引导手动操作"
        ],
        "featureText": "扫描车牌或预约二维码、自动核验预约有效性及任务关联、显示核验结果（放行/拒绝）、处理核验异常并引导手动操作",
        "sections": [
          "扫描输入区",
          "核验结果展示区",
          "异常处理区",
          "操作记录区"
        ],
        "scenarioKey": "scenario-1782887819107-2",
        "scenarioName": "门岗入场核验",
        "originalPageKey": "scenario-1782887819107-2-page-1"
      },
      "generatedAt": "2026-07-01T07:42:22.660Z"
    },
    {
      "key": "scenario-1782887819107-2-scenario-1782887819107-2-page-2-1",
      "name": "放行管理 - 管理车辆入场放行操作与记录",
      "vueFile": "ReleaseManagementPanel.vue",
      "fields": [
        {
          "name": "plateNumber",
          "label": "车牌号",
          "type": "text",
          "required": true,
          "description": "待放行车辆的车牌号，通过扫描或手动输入"
        },
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "select",
          "required": false,
          "description": "车辆类型，如生产车辆、物流车辆等"
        },
        {
          "name": "driverName",
          "label": "司机姓名",
          "type": "text",
          "required": false,
          "description": "车辆关联的司机姓名"
        },
        {
          "name": "entryTime",
          "label": "入场时间",
          "type": "datetime",
          "required": true,
          "description": "记录车辆实际入场时间"
        },
        {
          "name": "releaseAction",
          "label": "放行动作",
          "type": "radio",
          "required": true,
          "description": "选择放行或拒绝"
        },
        {
          "name": "remark",
          "label": "备注",
          "type": "textarea",
          "required": false,
          "description": "放行或拒绝的补充说明"
        }
      ],
      "actions": [
        {
          "label": "确认放行",
          "trigger": "点击放行按钮",
          "feedback": "更新车辆入场记录，关联任务状态变更为执行中，弹出成功提示"
        },
        {
          "label": "拒绝入场",
          "trigger": "点击拒绝按钮",
          "feedback": "记录拒绝原因，更新车辆状态为拒绝入场，弹出警告提示"
        },
        {
          "label": "批量放行",
          "trigger": "选择多辆车后点击批量放行",
          "feedback": "逐条更新所选车辆记录，批量更新任务状态，显示处理进度"
        },
        {
          "label": "查询车辆信息",
          "trigger": "车牌号输入完成或扫描后自动触发",
          "feedback": "自动填充车辆类型、司机、预约信息等字段"
        }
      ],
      "validations": [
        "车牌号不能为空",
        "入场时间不能为空",
        "放行动作必须选择",
        "拒绝时备注不能为空"
      ],
      "states": {
        "empty": {
          "description": "无待放行车辆时，显示空状态提示文字和刷新按钮"
        },
        "loading": {
          "description": "数据加载中，显示骨架屏或加载动画"
        },
        "success": {
          "description": "放行操作成功，显示成功提示并自动刷新列表"
        },
        "error": {
          "description": "放行操作失败，显示错误原因和重试按钮"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-2-scenario-1782887819107-2-page-2-1",
        "priority": "P1",
        "type": "辅助页",
        "name": "放行管理 - 管理车辆入场放行操作与记录",
        "vueFile": "ReleaseManagementPanel.vue",
        "goal": "根据核验结果执行放行或拒绝操作，记录放行时间、车辆信息，并更新相关任务状态",
        "features": [
          "手动确认放行或拒绝",
          "记录入场时间与车辆信息",
          "关联更新派车任务状态",
          "支持批量放行操作"
        ],
        "featureText": "手动确认放行或拒绝、记录入场时间与车辆信息、关联更新派车任务状态、支持批量放行操作",
        "sections": [
          "放行操作区",
          "车辆信息与记录区",
          "批量放行区",
          "任务状态关联区"
        ],
        "scenarioKey": "scenario-1782887819107-2",
        "scenarioName": "门岗入场核验",
        "originalPageKey": "scenario-1782887819107-2-page-2"
      },
      "generatedAt": "2026-07-01T07:43:37.654Z"
    },
    {
      "key": "scenario-1782887819107-2-scenario-1782887819107-2-page-3-2",
      "name": "异常告警 - 处理入场违规与安全告警事件",
      "vueFile": "AlertPanel.vue",
      "fields": [
        {
          "name": "alertType",
          "label": "告警类型",
          "type": "select",
          "required": false,
          "description": "按告警类型筛选，如未授权入场、证照过期、异常停留等"
        },
        {
          "name": "alertStatus",
          "label": "状态",
          "type": "select",
          "required": false,
          "description": "按处理状态筛选，如待处理、已确认、已解除、已上报"
        },
        {
          "name": "timeRange",
          "label": "时间范围",
          "type": "daterange",
          "required": false,
          "description": "筛选指定时间范围内的告警"
        },
        {
          "name": "keyword",
          "label": "搜索关键词",
          "type": "text",
          "required": false,
          "description": "按车牌号、司机、备注等搜索"
        },
        {
          "name": "alertId",
          "label": "告警ID",
          "type": "text",
          "required": false,
          "description": "精确查询告警ID"
        },
        {
          "name": "remark",
          "label": "处理备注",
          "type": "textarea",
          "required": false,
          "description": "填写处理时的备注信息"
        }
      ],
      "actions": [
        {
          "label": "确认告警",
          "trigger": "点击确认按钮",
          "feedback": "更新告警状态为‘已确认’，显示确认成功提示，更新告警列表"
        },
        {
          "label": "解除告警",
          "trigger": "点击解除按钮（需确认弹窗）",
          "feedback": "更新告警状态为‘已解除’，显示解除成功提示，更新列表；若解除失败给出错误提示"
        },
        {
          "label": "上报告警",
          "trigger": "点击上报按钮",
          "feedback": "弹出上报对话框，填写上报对象和原因，提交后更新状态为‘已上报’，显示上报成功提示"
        },
        {
          "label": "查询历史告警",
          "trigger": "切换至历史告警标签或点击查询按钮",
          "feedback": "加载历史告警列表，显示查询结果；若无数据展示空状态"
        },
        {
          "label": "筛选告警",
          "trigger": "选择筛选条件或更改筛选字段",
          "feedback": "实时更新告警列表，展示符合筛选条件的告警"
        },
        {
          "label": "查看告警详情",
          "trigger": "点击告警列表项",
          "feedback": "弹出告警详情弹窗或展开详情区域，展示告警详情"
        }
      ],
      "validations": [
        "确认告警时，必须至少选择一条告警",
        "解除告警时，必须填写解除原因",
        "上报告警时，必须填写上报对象和原因",
        "时间范围开始不能大于结束"
      ],
      "states": {
        "empty": "告警列表为空，展示提示文案‘暂无告警信息’，并提供‘刷新’按钮",
        "loading": "显示加载中骨架屏或旋转加载图标",
        "success": "操作成功时展示成功提示（如Toast）",
        "error": "操作失败时展示错误提示（如错误弹窗），并保留用户输入"
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-2-scenario-1782887819107-2-page-3-2",
        "priority": "P1",
        "type": "辅助页",
        "name": "异常告警 - 处理入场违规与安全告警事件",
        "vueFile": "AlertPanel.vue",
        "goal": "实时处理未授权入场、证照过期、异常停留等告警，支持告警确认、解除与上报",
        "features": [
          "告警实时展示与分类",
          "告警处理（确认/解除/上报）",
          "告警历史查询"
        ],
        "featureText": "告警实时展示与分类、告警处理（确认/解除/上报）、告警历史查询",
        "sections": [
          "实时告警列表",
          "告警处理面板",
          "告警历史查询"
        ],
        "scenarioKey": "scenario-1782887819107-2",
        "scenarioName": "门岗入场核验",
        "originalPageKey": "scenario-1782887819107-2-page-3"
      },
      "generatedAt": "2026-07-01T07:44:02.445Z"
    },
    {
      "key": "scenario-1782887819107-2-scenario-1782887819107-2-page-4-3",
      "name": "放行记录查询 - 追溯车辆入场放行历史数据",
      "vueFile": "ReleaseRecordQueryView.vue",
      "fields": [
        {
          "name": "startTime",
          "label": "开始时间",
          "type": "datetime",
          "required": true,
          "description": "查询起始时间"
        },
        {
          "name": "endTime",
          "label": "结束时间",
          "type": "datetime",
          "required": true,
          "description": "查询结束时间"
        },
        {
          "name": "plateNumber",
          "label": "车牌号",
          "type": "text",
          "required": false,
          "description": "模糊查询车牌号"
        },
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "select",
          "required": false,
          "description": "选择车辆类型，如生产车辆、物流车辆、外协车辆、临时车辆"
        },
        {
          "name": "entryResult",
          "label": "入场结果",
          "type": "select",
          "required": false,
          "description": "选择放行结果：放行、拒绝、异常"
        }
      ],
      "actions": [
        {
          "label": "查询",
          "trigger": "点击查询按钮",
          "feedback": "发送请求，加载数据列表，若参数校验失败提示错误；成功则刷新列表并更新状态"
        },
        {
          "label": "重置",
          "trigger": "点击重置按钮",
          "feedback": "清空所有查询条件，恢复默认值，并自动触发查询"
        },
        {
          "label": "导出",
          "trigger": "点击导出按钮",
          "feedback": "弹出导出文件格式选择（Excel/CSV），确认后下载文件，显示进度提示"
        },
        {
          "label": "查看详情",
          "trigger": "点击列表中的某条记录的查看操作",
          "feedback": "打开详情查看区或弹窗，显示完整放行记录信息，包括核验详情、放行凭证等"
        }
      ],
      "validations": [
        "开始时间不能晚于结束时间",
        "时间范围跨度不能超过90天",
        "车牌号输入长度不超过20个字符",
        "车辆类型和入场结果选择有效枚举值"
      ],
      "states": {
        "empty": {
          "description": "无查询结果时，显示空状态提示：暂无放行记录，请调整查询条件",
          "components": [
            "EmptyStatePlaceholder.vue"
          ]
        },
        "loading": {
          "description": "数据加载中，显示骨架屏或加载指示器，禁用查询按钮",
          "components": [
            "LoadingSpinner.vue"
          ]
        },
        "success": {
          "description": "查询成功，正常显示数据列表，支持分页、排序",
          "components": [
            "DataTable.vue",
            "Pagination.vue"
          ]
        },
        "error": {
          "description": "请求失败时，显示错误提示信息，提供重试按钮",
          "components": [
            "ErrorStatePlaceholder.vue"
          ]
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-2-scenario-1782887819107-2-page-4-3",
        "priority": "P1",
        "type": "辅助页",
        "name": "放行记录查询 - 追溯车辆入场放行历史数据",
        "vueFile": "ReleaseRecordQueryView.vue",
        "goal": "按时间、车牌、车辆类型等条件检索放行记录，查看核验详情，支持导出用于审计追溯",
        "features": [
          "多条件组合查询放行记录",
          "查看核验详情与放行凭证",
          "导出记录报表"
        ],
        "featureText": "多条件组合查询放行记录、查看核验详情与放行凭证、导出记录报表",
        "sections": [
          "查询条件区",
          "数据列表区",
          "详情查看区",
          "导出操作区"
        ],
        "scenarioKey": "scenario-1782887819107-2",
        "scenarioName": "门岗入场核验",
        "originalPageKey": "scenario-1782887819107-2-page-4"
      },
      "generatedAt": "2026-07-01T07:44:13.954Z"
    },
    {
      "key": "scenario-1782887819107-3-scenario-1782887819107-3-page-1-0",
      "name": "车辆运营报表分析",
      "vueFile": "StatisticsAnalysisView.vue",
      "fields": [
        {
          "name": "startDate",
          "label": "开始日期",
          "type": "date",
          "required": true,
          "description": "统计周期的开始日期"
        },
        {
          "name": "endDate",
          "label": "结束日期",
          "type": "date",
          "required": true,
          "description": "统计周期的结束日期"
        }
      ],
      "actions": [
        {
          "label": "查询",
          "trigger": "点击查询按钮",
          "feedback": "刷新图表和列表数据，显示加载状态"
        },
        {
          "label": "导出报表",
          "trigger": "点击导出按钮",
          "feedback": "根据当前筛选条件生成并下载报表文件（PDF或图片）"
        },
        {
          "label": "查看详情",
          "trigger": "点击图表或表格中的某一行",
          "feedback": "弹出详情弹窗或跳转到明细页面"
        }
      ],
      "validations": [
        "开始日期不能为空",
        "结束日期不能为空",
        "开始日期不能晚于结束日期"
      ],
      "states": {
        "empty": "当前筛选条件下无数据，显示空状态提示",
        "loading": "数据加载中，显示加载动画",
        "success": "数据加载成功，显示图表和列表",
        "error": "数据加载失败，显示错误提示和重试按钮"
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-3-scenario-1782887819107-3-page-1-0",
        "priority": "P1",
        "type": "工作台页",
        "name": "车辆运营报表分析",
        "vueFile": "StatisticsAnalysisView.vue",
        "goal": "提供车辆利用率、任务完成率、平均等待时长、空驶率、排队情况、外协车辆使用次数、异常入场记录等核心统计指标的图表展示与分析功能",
        "features": [
          "按时间范围筛选报表数据",
          "展示车辆利用率趋势图",
          "展示任务完成率与平均等待时长图表",
          "展示空驶率与排队统计图表",
          "展示外协车辆使用次数与异常记录列表",
          "支持图表导出为图片或PDF"
        ],
        "featureText": "按时间范围筛选报表数据、展示车辆利用率趋势图、展示任务完成率与平均等待时长图表、展示空驶率与排队统计图表、展示外协车辆使用次数与异常记录列表、支持图表导出为图片或PDF",
        "sections": [
          "筛选区域",
          "核心指标概览",
          "统计分析图表",
          "外协车辆与异常记录列表"
        ],
        "scenarioKey": "scenario-1782887819107-3",
        "scenarioName": "管理人员报表分析",
        "originalPageKey": "scenario-1782887819107-3-page-1"
      },
      "generatedAt": "2026-07-01T07:45:18.046Z"
    },
    {
      "key": "scenario-1782887819107-3-scenario-1782887819107-3-page-2-1",
      "name": "报表数据导出",
      "vueFile": "ReportExportView.vue",
      "fields": [
        {
          "name": "exportFormat",
          "label": "导出格式",
          "type": "radio",
          "required": true,
          "description": "选择导出文件的格式，支持Excel和PDF"
        },
        {
          "name": "exportScope",
          "label": "导出内容范围",
          "type": "checkbox",
          "required": true,
          "description": "选择需要导出的指标或报表，可多选或选择全部"
        },
        {
          "name": "exportDateRange",
          "label": "数据时间范围",
          "type": "dateRange",
          "required": false,
          "description": "限定导出数据所属的时间区间，可选"
        }
      ],
      "actions": [
        {
          "label": "导出",
          "trigger": "点击导出按钮",
          "feedback": "显示加载状态；导出成功后提示下载链接或直接下载；失败时提示错误信息并记录日志"
        },
        {
          "label": "重置",
          "trigger": "点击重置按钮",
          "feedback": "清空所有已选配置项，恢复默认状态"
        }
      ],
      "validations": [
        "导出格式必须选择且至少选中一项",
        "导出内容范围至少选择一个指标或报表",
        "若选择指定日期范围，开始日期不能晚于结束日期"
      ],
      "states": {
        "empty": "页面初始无导出记录日志，日志区域显示“暂无导出记录”占位提示",
        "loading": "点击导出后，导出按钮显示加载动画并禁用，同时日志区域新增一条“导出中”临时记录",
        "success": "导出成功，按钮恢复可用，日志区域生成成功记录（含文件名称、时间、格式等），并提供文件下载入口",
        "error": "导出失败，按钮恢复可用，日志区域生成失败记录（含错误描述），并显示错误提示消息"
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-3-scenario-1782887819107-3-page-2-1",
        "priority": "P1",
        "type": "辅助页",
        "name": "报表数据导出",
        "vueFile": "ReportExportView.vue",
        "goal": "支持将统计分析结果导出为Excel、PDF等格式，便于管理人员存档、分发和进一步分析",
        "features": [
          "选择导出格式（Excel/PDF）",
          "选择导出内容范围（全部报表/指定指标）",
          "一键导出并下载文件",
          "导出记录日志与审计追踪"
        ],
        "featureText": "选择导出格式（Excel/PDF）、选择导出内容范围（全部报表/指定指标）、一键导出并下载文件、导出记录日志与审计追踪",
        "sections": [
          "导出配置区域",
          "导出操作区域",
          "导出记录日志区域"
        ],
        "scenarioKey": "scenario-1782887819107-3",
        "scenarioName": "管理人员报表分析",
        "originalPageKey": "scenario-1782887819107-3-page-2"
      },
      "generatedAt": "2026-07-01T08:24:18.900Z"
    },
    {
      "key": "scenario-1782887819107-3-scenario-1782887819107-3-page-3-2",
      "name": "资源配置优化建议",
      "vueFile": "ResourceAllocationView.vue",
      "fields": [
        {
          "name": "dateRange",
          "label": "时间范围",
          "type": "daterange",
          "required": true,
          "description": "选择分析的时间范围，支持预设（近7天、近30天、自定义）"
        },
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "select",
          "required": false,
          "description": "筛选特定车辆类型（生产车辆、物流车辆、外协车辆、临时车辆）"
        },
        {
          "name": "area",
          "label": "区域",
          "type": "select",
          "required": false,
          "description": "筛选作业区域"
        }
      ],
      "actions": [
        {
          "label": "查询分析",
          "trigger": "click",
          "feedback": "加载数据后刷新热点图、推荐列表、费用汇总等区域"
        },
        {
          "label": "导出优化报告",
          "trigger": "click",
          "feedback": "生成PDF或Excel报告并下载"
        },
        {
          "label": "预览优化报告",
          "trigger": "click",
          "feedback": "打开新窗口或弹窗展示报告预览"
        }
      ],
      "validations": [
        "时间范围为必填项",
        "时间范围结束日期不能早于开始日期",
        "时间范围跨度不能超过一年"
      ],
      "states": {
        "empty": {
          "description": "无筛选结果时的空状态显示，提示用户调整筛选条件"
        },
        "loading": {
          "description": "数据加载中的状态，显示加载动画"
        },
        "success": {
          "description": "数据加载成功后的状态，正常展示各区域内容"
        },
        "error": {
          "description": "数据加载失败时的状态，显示错误提示和重试按钮"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-3-scenario-1782887819107-3-page-3-2",
        "priority": "P1",
        "type": "辅助页",
        "name": "资源配置优化建议",
        "vueFile": "ResourceAllocationView.vue",
        "goal": "基于历史数据与当前车辆使用情况，提供车辆资源配置优化建议和外协车辆费用管理参考",
        "features": [
          "分析车辆使用热点与瓶颈区域",
          "推荐车辆增减数量与类型调整",
          "展示外协车辆费用汇总与趋势",
          "提供资源配置优化报告预览"
        ],
        "featureText": "分析车辆使用热点与瓶颈区域、推荐车辆增减数量与类型调整、展示外协车辆费用汇总与趋势、提供资源配置优化报告预览",
        "sections": [
          "筛选与时间范围区域",
          "热点与瓶颈分析区域",
          "资源配置推荐区域",
          "外协费用汇总区域",
          "优化报告预览区域"
        ],
        "scenarioKey": "scenario-1782887819107-3",
        "scenarioName": "管理人员报表分析",
        "originalPageKey": "scenario-1782887819107-3-page-3"
      },
      "generatedAt": "2026-07-01T08:24:44.726Z"
    }
  ],
  "generatedPagesByKey": {
    "scenario-1782831312544-0-scenario-1782831312544-0-page-1-0": {
      "key": "scenario-1782831312544-0-scenario-1782831312544-0-page-1-0",
      "name": "调度员现场调度工作台",
      "vueFile": "VehicleDispatchView.vue",
      "fields": [
        {
          "name": "region",
          "label": "区域筛选",
          "type": "select",
          "required": false,
          "description": "按作业区域筛选车辆显示"
        },
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "select",
          "required": false,
          "description": "按车辆类型筛选"
        },
        {
          "name": "vehicleStatus",
          "label": "车辆状态",
          "type": "select",
          "required": false,
          "description": "按车辆状态（空闲、任务、排队、异常）筛选"
        },
        {
          "name": "keyword",
          "label": "搜索关键字",
          "type": "input",
          "required": false,
          "description": "按车牌号或司机名称搜索"
        }
      ],
      "actions": [
        {
          "label": "区域筛选变更",
          "trigger": "onRegionChange",
          "feedback": "地图更新车辆标记"
        },
        {
          "label": "地图车辆点击",
          "trigger": "onVehicleClick",
          "feedback": "弹出车辆详情弹窗"
        },
        {
          "label": "车辆详情弹窗关闭",
          "trigger": "onCloseDetail",
          "feedback": "关闭弹窗"
        },
        {
          "label": "状态概览区卡片点击",
          "trigger": "onStatCardClick",
          "feedback": "跳转到对应筛选结果"
        },
        {
          "label": "异常告警面板告警点击",
          "trigger": "onAlarmClick",
          "feedback": "展开告警详情或处理入口"
        }
      ],
      "validations": [
        "车辆状态筛选必须与地图标记颜色一致",
        "区域筛选值需匹配系统预设区域字典",
        "搜索关键字长度不超过20字符"
      ],
      "states": {
        "empty": {
          "description": "无符合条件的车辆或告警显示",
          "actions": [
            {
              "label": "提示用户无数据"
            }
          ]
        },
        "loading": {
          "description": "地图和列表数据加载中",
          "actions": [
            {
              "label": "显示加载动画"
            }
          ]
        },
        "success": {
          "description": "数据加载正常，地图展示车辆标记",
          "actions": [
            {
              "label": "正常交互"
            }
          ]
        },
        "error": {
          "description": "数据加载失败或接口异常",
          "actions": [
            {
              "label": "显示错误提示和重试按钮"
            }
          ]
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-0-scenario-1782831312544-0-page-1-0",
        "priority": "P0",
        "type": "工作台页",
        "name": "调度员现场调度工作台",
        "vueFile": "VehicleDispatchView.vue",
        "goal": "在地图上实时显示车辆位置、任务状态、空闲车辆、排队车辆和异常车辆，支持区域筛选和车辆详情查看。",
        "features": [
          "车辆实时位置展示",
          "车辆状态标识（空闲",
          "任务",
          "排队",
          "异常）",
          "区域筛选与地图缩放",
          "车辆详情弹窗（车牌",
          "司机",
          "任务等）"
        ],
        "featureText": "车辆实时位置展示、车辆状态标识（空闲、任务、排队、异常）、区域筛选与地图缩放、车辆详情弹窗（车牌、司机、任务等）",
        "sections": [
          "状态概览区",
          "地图看板",
          "用车申请列表",
          "派车操作区",
          "任务跟踪面板",
          "异常告警面板"
        ],
        "originalPageKey": "scenario-1782831312544-0-page-1",
        "scenarioKey": "scenario-1782831312544-0",
        "scenarioName": "调度员现场调度"
      },
      "generatedAt": "2026-07-01T05:31:52.661Z"
    },
    "scenario-1782831312544-0-scenario-1782831312544-0-page-2-1": {
      "key": "scenario-1782831312544-0-scenario-1782831312544-0-page-2-1",
      "name": "VehicleDispatch",
      "vueFile": "VehicleDispatchView.vue",
      "fields": [
        {
          "name": "approvalResult",
          "label": "审批结果",
          "type": "select",
          "required": true,
          "description": "对用车申请进行通过或驳回操作"
        },
        {
          "name": "approvalOpinion",
          "label": "审批意见",
          "type": "textarea",
          "required": false,
          "description": "审批时的补充说明或驳回原因"
        },
        {
          "name": "selectedVehicle",
          "label": "派车车辆",
          "type": "select",
          "required": true,
          "description": "从智能推荐列表或手动选择中确定要派出的车辆"
        },
        {
          "name": "priorityOverride",
          "label": "任务优先级",
          "type": "select",
          "required": false,
          "description": "手动调整任务优先级（高、中、低）"
        },
        {
          "name": "dispatchRemark",
          "label": "派车备注",
          "type": "textarea",
          "required": false,
          "description": "派车时额外说明信息，如作业点、注意事项"
        }
      ],
      "actions": [
        {
          "label": "审核通过",
          "trigger": "点击通过按钮",
          "feedback": "用车申请状态变为已通过，进入智能推荐派车区候选列表"
        },
        {
          "label": "审核驳回",
          "trigger": "点击驳回按钮",
          "feedback": "弹窗确认驳回原因，表单关闭，申请状态更新为已驳回"
        },
        {
          "label": "智能匹配推荐",
          "trigger": "点击智能推荐按钮",
          "feedback": "系统根据区域、车辆类型、优先级、距离计算并展示推荐车辆列表（带排序和评分）"
        },
        {
          "label": "手动调整派车方案",
          "trigger": "在推荐列表中修改车辆、优先级或备注",
          "feedback": "实时更新临时派车方案，不立即下发"
        },
        {
          "label": "下发任务",
          "trigger": "点击下发派车按钮",
          "feedback": "任务状态变为已下发，司机端收到任务推送，页面显示成功提示"
        }
      ],
      "validations": [
        "审批时如选择驳回，必须填写审批意见",
        "下发任务前必须选中已审核通过的用车申请且已选择派车车辆",
        "手动调整派车方案时，车辆状态必须为空闲且未超时"
      ],
      "states": {
        "empty": {
          "description": "用车申请列表为空，显示提示信息且禁用下发操作"
        },
        "loading": {
          "description": "正在加载用车申请列表或智能匹配结果，显示骨架屏或加载动画"
        },
        "success": {
          "description": "派车任务下发成功，弹出成功提示并可关闭"
        },
        "error": {
          "description": "派车下发或智能匹配失败，显示错误原因及重试按钮"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-0-scenario-1782831312544-0-page-2-1",
        "priority": "P1",
        "type": "辅助页",
        "name": "VehicleDispatch",
        "vueFile": "VehicleDispatchView.vue",
        "goal": "综合作业区域、车辆类型、任务优先级、距离远近等因素，智能推荐最佳车辆，支持调度员一键派车或手动调整。",
        "features": [
          "用车申请列表展示与审核",
          "智能匹配算法推荐车辆",
          "手动调整派车方案",
          "派车任务下发至司机"
        ],
        "featureText": "用车申请列表展示与审核、智能匹配算法推荐车辆、手动调整派车方案、派车任务下发至司机",
        "sections": [
          "用车申请审核区",
          "智能推荐派车区"
        ],
        "originalPageKey": "scenario-1782831312544-0-page-2",
        "scenarioKey": "scenario-1782831312544-0",
        "scenarioName": "调度员现场调度"
      },
      "generatedAt": "2026-07-01T05:32:10.027Z"
    },
    "scenario-1782831312544-0-scenario-1782831312544-0-page-3-2": {
      "key": "scenario-1782831312544-0-scenario-1782831312544-0-page-3-2",
      "name": "VehicleDispatch",
      "vueFile": "VehicleDispatchView.vue",
      "fields": [
        {
          "name": "taskId",
          "label": "任务编号",
          "type": "string",
          "required": false,
          "description": "系统自动生成的唯一任务标识"
        },
        {
          "name": "vehiclePlate",
          "label": "车牌号",
          "type": "string",
          "required": false,
          "description": "执行任务的车辆车牌"
        },
        {
          "name": "driverName",
          "label": "司机姓名",
          "type": "string",
          "required": false,
          "description": "当前任务司机"
        },
        {
          "name": "status",
          "label": "任务状态",
          "type": "enum",
          "required": false,
          "description": "任务当前状态：待接单、已接单、到达、装卸中、已完成、异常"
        },
        {
          "name": "progress",
          "label": "进度",
          "type": "number",
          "required": false,
          "description": "任务完成百分比，0-100"
        },
        {
          "name": "priority",
          "label": "优先级",
          "type": "enum",
          "required": false,
          "description": "任务优先级：高、中、低"
        },
        {
          "name": "area",
          "label": "作业区域",
          "type": "string",
          "required": false,
          "description": "任务所在的作业区域"
        },
        {
          "name": "estimatedEndTime",
          "label": "预计结束时间",
          "type": "datetime",
          "required": false,
          "description": "任务预计完成时间"
        },
        {
          "name": "actualEndTime",
          "label": "实际结束时间",
          "type": "datetime",
          "required": false,
          "description": "任务实际完成时间"
        },
        {
          "name": "totalTasks",
          "label": "今日任务总数",
          "type": "number",
          "required": false,
          "description": "概览区统计的今日所有任务数量"
        },
        {
          "name": "completedTasks",
          "label": "已完成数量",
          "type": "number",
          "required": false,
          "description": "概览区统计的已完成任务数量"
        },
        {
          "name": "delayedTasks",
          "label": "延期数量",
          "type": "number",
          "required": false,
          "description": "概览区统计的超过预计时间的任务数量"
        },
        {
          "name": "abnormalTasks",
          "label": "异常数量",
          "type": "number",
          "required": false,
          "description": "概览区统计的标记异常的任务数量"
        }
      ],
      "actions": [
        {
          "label": "查看任务详情",
          "trigger": "click",
          "feedback": "弹出任务详情面板，包含任务所有字段和操作按钮"
        },
        {
          "label": "重新派车",
          "trigger": "click",
          "feedback": "打开派车弹窗，供调度员选择新车辆并下发"
        },
        {
          "label": "取消任务",
          "trigger": "click",
          "feedback": "弹出确认取消弹窗，要求填写取消原因，确认后刷新列表"
        },
        {
          "label": "标记异常",
          "trigger": "click",
          "feedback": "打开标记异常弹窗，选择异常类型并提交，更新任务状态"
        },
        {
          "label": "刷新任务列表",
          "trigger": "click",
          "feedback": "重新向服务端请求任务列表数据，更新页面"
        },
        {
          "label": "筛选任务",
          "trigger": "change",
          "feedback": "根据筛选条件（状态、区域等）过滤任务列表，实时更新"
        }
      ],
      "validations": [
        "重新派车前需确认当前任务是否可取消或已完成",
        "取消任务必须填写取消原因",
        "标记异常必须选择异常类型"
      ],
      "states": {
        "empty": "列表为空时显示'暂无任务'提示，概览区数字显示为0",
        "loading": "显示加载动画或骨架屏，待数据返回后渲染",
        "success": "正常显示任务列表、概览统计和异常告警",
        "error": "显示错误信息及'重试'按钮，允许用户重新加载"
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-0-scenario-1782831312544-0-page-3-2",
        "priority": "P1",
        "type": "辅助页",
        "name": "VehicleDispatch",
        "vueFile": "VehicleDispatchView.vue",
        "goal": "实时跟踪派车任务的执行状态（接单、到达、装卸、关闭），展示任务进度和异常标记，支持调度员介入处理。",
        "features": [
          "任务状态实时更新",
          "任务列表与进度展示",
          "异常任务标记与预警",
          "调度员干预操作（重新派车",
          "取消任务等）"
        ],
        "featureText": "任务状态实时更新、任务列表与进度展示、异常任务标记与预警、调度员干预操作（重新派车、取消任务等）",
        "sections": [
          "任务筛选区",
          "任务概览区",
          "任务列表与进度区",
          "异常任务告警区",
          "任务详情与干预操作区"
        ],
        "originalPageKey": "scenario-1782831312544-0-page-3",
        "scenarioKey": "scenario-1782831312544-0",
        "scenarioName": "调度员现场调度"
      },
      "generatedAt": "2026-07-01T05:32:48.918Z"
    },
    "scenario-1782831312544-0-scenario-1782831312544-0-page-4-3": {
      "key": "scenario-1782831312544-0-scenario-1782831312544-0-page-4-3",
      "name": "VehicleDispatch",
      "vueFile": "VehicleDispatchView.vue",
      "fields": [
        {
          "name": "exceptionType",
          "label": "异常类型",
          "type": "select",
          "required": true,
          "description": "选择异常类型：排队超时、重复派车、车辆故障、位置偏移等"
        },
        {
          "name": "exceptionDescription",
          "label": "异常描述",
          "type": "textarea",
          "required": true,
          "description": "详细描述异常情况"
        },
        {
          "name": "vehiclePlate",
          "label": "车辆牌照",
          "type": "text",
          "required": true,
          "description": "关联车辆的车牌号"
        },
        {
          "name": "driverName",
          "label": "司机姓名",
          "type": "text",
          "required": false,
          "description": "关联司机姓名"
        },
        {
          "name": "handlerName",
          "label": "处理人",
          "type": "text",
          "required": false,
          "description": "当前处理异常的人员"
        },
        {
          "name": "actionType",
          "label": "处理动作",
          "type": "select",
          "required": true,
          "description": "选择处理方式：增派车辆、更换车辆、修改路线、取消任务、忽略"
        },
        {
          "name": "remark",
          "label": "处理备注",
          "type": "textarea",
          "required": false,
          "description": "补充处理说明"
        }
      ],
      "actions": [
        {
          "label": "查看详情",
          "trigger": "click",
          "feedback": "弹窗展示异常详细信息及车辆、任务上下文"
        },
        {
          "label": "处理异常",
          "trigger": "click",
          "feedback": "打开异常处理表单，允许调整任务或增派车辆"
        },
        {
          "label": "增派车辆",
          "trigger": "click",
          "feedback": "弹出车辆选择列表，确认后生成新派车任务"
        },
        {
          "label": "确认处理",
          "trigger": "submit",
          "feedback": "提交处理结果，更新异常状态，关闭弹窗并刷新列表"
        }
      ],
      "validations": [
        "异常类型必填",
        "异常描述必填",
        "车辆牌照必填",
        "处理动作必填"
      ],
      "states": {
        "empty": {
          "message": "暂无异常记录",
          "icon": "info-circle"
        },
        "loading": {
          "message": "正在加载异常数据...",
          "spinner": true
        },
        "success": {
          "message": "异常处理成功",
          "toast": "success"
        },
        "error": {
          "message": "操作失败，请重试",
          "toast": "error"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-0-scenario-1782831312544-0-page-4-3",
        "priority": "P1",
        "type": "辅助页",
        "name": "VehicleDispatch",
        "vueFile": "VehicleDispatchView.vue",
        "goal": "集中展示异常情况（排队超时、重复派车、车辆故障等），支持调度员临时调整任务、增派车辆、处理告警。",
        "features": [
          "异常情况列表与告警展示",
          "异常原因分析",
          "临时调整任务（换车",
          "改路线等）",
          "增派车辆或取消任务"
        ],
        "featureText": "异常情况列表与告警展示、异常原因分析、临时调整任务（换车、改路线等）、增派车辆或取消任务",
        "sections": [
          "异常告警概览区",
          "异常详情列表区",
          "异常处理操作区",
          "异常历史记录区"
        ],
        "originalPageKey": "scenario-1782831312544-0-page-4",
        "scenarioKey": "scenario-1782831312544-0",
        "scenarioName": "调度员现场调度"
      },
      "generatedAt": "2026-07-01T05:33:27.353Z"
    },
    "scenario-1782831312544-1-scenario-1782831312544-1-page-1-0": {
      "key": "scenario-1782831312544-1-scenario-1782831312544-1-page-1-0",
      "name": "管理人员统计分析工作台",
      "vueFile": "StatisticsDashboardView.vue",
      "fields": [
        {
          "name": "reportType",
          "label": "报表类型",
          "type": "select",
          "required": true,
          "description": "选择要查看的统计报表类型，如车辆利用率、任务完成率等"
        },
        {
          "name": "timeRange",
          "label": "时间范围",
          "type": "daterange",
          "required": true,
          "description": "选择统计数据的起止时间"
        },
        {
          "name": "region",
          "label": "作业区域",
          "type": "select",
          "required": false,
          "description": "按作业区域筛选统计数据"
        },
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "select",
          "required": false,
          "description": "按车辆类型筛选统计数据"
        }
      ],
      "actions": [
        {
          "label": "切换报表",
          "trigger": "onReportTypeChange",
          "feedback": "页面图表与指标数据根据所选报表类型更新"
        },
        {
          "label": "导出报表",
          "trigger": "onExport",
          "feedback": "弹出导出配置弹窗，选择导出格式后触发下载"
        },
        {
          "label": "下钻查看",
          "trigger": "onDrillDown",
          "feedback": "点击图表元素后跳转至数据下钻页面查看明细"
        },
        {
          "label": "刷新数据",
          "trigger": "onRefresh",
          "feedback": "重新加载当前报表数据并更新图表"
        }
      ],
      "validations": [
        "报表类型为必选项",
        "时间范围起止日期不能为空且结束日期不能早于开始日期"
      ],
      "states": {
        "empty": {
          "description": "当前筛选条件下无统计数据，显示空状态提示与建议操作",
          "component": "EmptyStatePlaceholder"
        },
        "loading": {
          "description": "数据加载中，显示骨架屏或加载动画",
          "component": "SkeletonLoader"
        },
        "success": {
          "description": "数据加载成功，正常展示图表与指标",
          "component": "PageContent"
        },
        "error": {
          "description": "数据加载失败，显示错误提示与重试按钮",
          "component": "ErrorAlert"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-1-scenario-1782831312544-1-page-1-0",
        "priority": "P0",
        "type": "工作台页",
        "name": "管理人员统计分析工作台",
        "vueFile": "StatisticsDashboardView.vue",
        "goal": "提供车辆利用率、任务完成率、平均等待时长、空驶率、车辆排队情况等核心效率指标的统计与可视化展示。",
        "features": [
          "展示车辆利用率趋势图与分布",
          "展示任务完成率统计（按区域/时间/车辆类型）",
          "展示平均等待时长与空驶率图表",
          "展示车辆排队情况与异常通知"
        ],
        "featureText": "展示车辆利用率趋势图与分布、展示任务完成率统计（按区域/时间/车辆类型）、展示平均等待时长与空驶率图表、展示车辆排队情况与异常通知",
        "sections": [
          "管理人员统计分析状态概览",
          "效率分析",
          "费用分析",
          "报表导出",
          "选择报表类型与时间范围操作区",
          "查看可视化图表与关键指标操作区"
        ],
        "originalPageKey": "scenario-1782831312544-1-page-1",
        "scenarioKey": "scenario-1782831312544-1",
        "scenarioName": "管理人员统计分析"
      },
      "generatedAt": "2026-07-01T05:50:50.598Z"
    },
    "scenario-1782831312544-1-scenario-1782831312544-1-page-2-1": {
      "key": "scenario-1782831312544-1-scenario-1782831312544-1-page-2-1",
      "name": "费用分析页面",
      "vueFile": "StatisticsDashboardView.vue",
      "fields": [
        {
          "name": "startDate",
          "label": "开始时间",
          "type": "date",
          "required": true,
          "description": "统计时间范围的起始日期"
        },
        {
          "name": "endDate",
          "label": "结束时间",
          "type": "date",
          "required": true,
          "description": "统计时间范围的结束日期"
        },
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "select",
          "required": false,
          "description": "按车辆类型筛选（如外协、临时等）"
        },
        {
          "name": "vehiclePlate",
          "label": "车牌号",
          "type": "input",
          "required": false,
          "description": "按车牌号模糊搜索"
        }
      ],
      "actions": [
        {
          "label": "查询",
          "trigger": "点击",
          "feedback": "根据筛选条件重新加载统计数据与记录列表"
        },
        {
          "label": "重置",
          "trigger": "点击",
          "feedback": "清空所有筛选条件并恢复默认视图"
        },
        {
          "label": "下钻",
          "trigger": "点击图表元素或记录项",
          "feedback": "展示对应车辆或时间段的明细数据（弹窗或跳转）"
        }
      ],
      "validations": [
        "开始时间不能为空",
        "结束时间不能为空",
        "结束时间不能早于开始时间"
      ],
      "states": {
        "empty": "当前筛选条件下无统计数据，请调整时间范围或筛选条件",
        "loading": "正在加载统计数据和记录，请稍候...",
        "success": "数据加载成功，展示统计图表与记录",
        "error": "数据加载失败，请检查网络或联系管理员"
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-1-scenario-1782831312544-1-page-2-1",
        "priority": "P1",
        "type": "辅助页",
        "name": "费用分析页面",
        "vueFile": "StatisticsDashboardView.vue",
        "goal": "统计外协车辆使用次数、入场记录及费用相关数据，辅助外协费用管理决策。",
        "features": [
          "展示外协车辆使用次数及费用汇总",
          "展示外协车辆入场/出场记录",
          "支持按时间范围与车辆维度下钻"
        ],
        "featureText": "展示外协车辆使用次数及费用汇总、展示外协车辆入场/出场记录、支持按时间范围与车辆维度下钻",
        "sections": [
          "外协车辆费用概览",
          "外协车辆入场记录",
          "外协车辆出场记录",
          "数据筛选与下钻"
        ],
        "originalPageKey": "scenario-1782831312544-1-page-2",
        "scenarioKey": "scenario-1782831312544-1",
        "scenarioName": "管理人员统计分析"
      },
      "generatedAt": "2026-07-01T05:51:16.817Z"
    },
    "scenario-1782831312544-1-scenario-1782831312544-1-page-3-2": {
      "key": "scenario-1782831312544-1-scenario-1782831312544-1-page-3-2",
      "name": "报表导出页面",
      "vueFile": "StatisticsDashboardView.vue",
      "fields": [
        {
          "name": "reportType",
          "label": "报表类型",
          "type": "select",
          "required": true,
          "description": "选择要导出的报表类型，例如车辆利用率报表、任务完成率报表等。"
        },
        {
          "name": "timeRange",
          "label": "时间范围",
          "type": "daterange",
          "required": true,
          "description": "选择数据导出涵盖的时间范围。"
        },
        {
          "name": "exportFormat",
          "label": "导出格式",
          "type": "select",
          "required": true,
          "description": "选择导出文件格式，支持Excel或PDF。"
        },
        {
          "name": "scope",
          "label": "导出范围",
          "type": "select",
          "required": false,
          "description": "可选：全部数据、当前视图数据、所选下钻数据。"
        },
        {
          "name": "fileName",
          "label": "导出文件名",
          "type": "text",
          "required": false,
          "description": "自定义导出文件的名称，留空则使用默认名称。"
        }
      ],
      "actions": [
        {
          "label": "导出",
          "trigger": "点击导出按钮",
          "feedback": "触发导出任务，显示进度条；导出完成后提供下载链接或自动下载。"
        },
        {
          "label": "查询导出记录",
          "trigger": "点击查询或输入筛选条件",
          "feedback": "根据时间范围、报表类型等条件过滤历史导出记录列表。"
        },
        {
          "label": "取消导出",
          "trigger": "点击取消按钮（仅导出进行中时可见）",
          "feedback": "终止当前导出任务，清除进度。"
        }
      ],
      "validations": [
        "报表类型为必填项",
        "时间范围为必填项",
        "导出格式为必填项",
        "时间范围不能超过90天（系统限制）",
        "导出文件名不超过100字符"
      ],
      "states": {
        "empty": "当前没有任何导出记录或可选配置默认未设置时的提示状态。",
        "loading": "导出任务执行中，显示进度条和剩余时间预估。",
        "success": "导出完成，提供下载链接或自动下载文件，并展示成功提示。",
        "error": "导出失败，显示错误原因（如数据量过大、时间格式错误、系统异常），并提供重试按钮。"
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-1-scenario-1782831312544-1-page-3-2",
        "priority": "P1",
        "type": "辅助页",
        "name": "报表导出页面",
        "vueFile": "StatisticsDashboardView.vue",
        "goal": "支持将当前查看的统计报表或下钻数据导出为Excel、PDF等格式，便于存档与进一步分析。",
        "features": [
          "导出当前可视化数据为Excel",
          "导出统计报表为PDF",
          "支持选择导出范围与格式"
        ],
        "featureText": "导出当前可视化数据为Excel、导出统计报表为PDF、支持选择导出范围与格式",
        "sections": [
          "导出配置区",
          "导出进度展示区",
          "导出记录查询区"
        ],
        "originalPageKey": "scenario-1782831312544-1-page-3",
        "scenarioKey": "scenario-1782831312544-1",
        "scenarioName": "管理人员统计分析"
      },
      "generatedAt": "2026-07-01T05:51:58.027Z"
    },
    "scenario-1782831312544-1-scenario-1782831312544-1-page-4-3": {
      "key": "scenario-1782831312544-1-scenario-1782831312544-1-page-4-3",
      "name": "数据下钻页面",
      "vueFile": "StatisticsDashboardView.vue",
      "fields": [
        {
          "name": "dateRange",
          "label": "时间范围",
          "type": "dateRange",
          "required": false,
          "description": "选择统计的时间范围"
        },
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "select",
          "required": false,
          "description": "筛选车辆类型（生产车辆/物流车辆/外协车辆/临时车辆）"
        },
        {
          "name": "area",
          "label": "作业区域",
          "type": "select",
          "required": false,
          "description": "筛选作业区域"
        },
        {
          "name": "driverName",
          "label": "司机姓名",
          "type": "input",
          "required": false,
          "description": "输入司机姓名进行搜索"
        },
        {
          "name": "plateNumber",
          "label": "车牌号",
          "type": "input",
          "required": false,
          "description": "输入车牌号进行搜索"
        }
      ],
      "actions": [
        {
          "label": "下钻至详情",
          "trigger": "点击图表元素或列表行",
          "feedback": "加载对应下钻数据并显示明细对比区"
        },
        {
          "label": "上钻返回",
          "trigger": "点击上钻返回操作区按钮",
          "feedback": "返回到上一级宏观视图"
        },
        {
          "label": "查看司机详情",
          "trigger": "点击司机姓名或详情链接",
          "feedback": "弹出司机详情弹窗或跳转"
        },
        {
          "label": "查看车辆详情",
          "trigger": "点击车牌号或车辆链接",
          "feedback": "弹出车辆详情弹窗或跳转"
        }
      ],
      "validations": [
        "时间范围选择不能超过一年（如适用）"
      ],
      "states": {
        "empty": "无数据时显示空状态提示，并提供返回上钻入口",
        "loading": "加载中显示骨架屏或加载动画",
        "success": "数据加载成功，正常展示图表与列表",
        "error": "数据加载失败，显示错误提示与重试按钮"
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-1-scenario-1782831312544-1-page-4-3",
        "priority": "P1",
        "type": "辅助页",
        "name": "数据下钻页面",
        "vueFile": "StatisticsDashboardView.vue",
        "goal": "允许从宏观统计图表演进到具体车辆、司机或区域的明细数据，支持多维分析。",
        "features": [
          "通过点击图表元素下钻至车辆/司机详情",
          "展示下钻后的明细列表与指标对比",
          "支持返回上钻至宏观视图"
        ],
        "featureText": "通过点击图表元素下钻至车辆/司机详情、展示下钻后的明细列表与指标对比、支持返回上钻至宏观视图",
        "sections": [
          "下钻路径导航区",
          "数据详细对比区",
          "明细数据列表区",
          "上钻返回操作区"
        ],
        "originalPageKey": "scenario-1782831312544-1-page-4",
        "scenarioKey": "scenario-1782831312544-1",
        "scenarioName": "管理人员统计分析"
      },
      "generatedAt": "2026-07-01T05:52:17.405Z"
    },
    "scenario-1782831312544-2-scenario-1782831312544-2-page-1-0": {
      "key": "scenario-1782831312544-2-scenario-1782831312544-2-page-1-0",
      "name": "司机执行任务工作台",
      "vueFile": "DriverTaskView.vue（子组件：TaskListSection.vue, TaskDetailPanel.vue）",
      "fields": [
        {
          "name": "searchKeyword",
          "label": "搜索关键词",
          "type": "text",
          "required": false,
          "description": "按任务编号、作业点、物资名称等搜索"
        },
        {
          "name": "taskStatus",
          "label": "任务状态",
          "type": "select",
          "required": false,
          "description": "筛选任务状态：待接单、进行中、已完成等"
        },
        {
          "name": "dateRange",
          "label": "时间范围",
          "type": "dateRange",
          "required": false,
          "description": "按任务创建时间筛选"
        }
      ],
      "actions": [
        {
          "label": "搜索",
          "trigger": "点击搜索按钮",
          "feedback": "刷新任务列表并显示加载动画"
        },
        {
          "label": "查看任务详情",
          "trigger": "点击任务列表项",
          "feedback": "打开任务详情面板或弹窗，展示完整信息"
        },
        {
          "label": "执行任务",
          "trigger": "点击执行按钮",
          "feedback": "跳转到导航引导页面或开始任务执行流程"
        },
        {
          "label": "查看历史任务",
          "trigger": "点击历史标签页",
          "feedback": "切换列表显示已完成任务记录"
        }
      ],
      "validations": [
        "搜索关键词长度不超过50字符",
        "日期范围结束时间不能早于开始时间"
      ],
      "states": {
        "empty": "无待执行任务，请下拉刷新或查看历史任务",
        "loading": "正在加载任务列表，请稍后...",
        "success": "任务列表加载成功",
        "error": "任务列表加载失败，请检查网络后重试"
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-2-scenario-1782831312544-2-page-1-0",
        "priority": "P1",
        "type": "工作台页",
        "name": "司机执行任务工作台",
        "vueFile": "DriverTaskView.vue（子组件：TaskListSection.vue, TaskDetailPanel.vue）",
        "goal": "司机通过手机端接收调度下发的任务通知，展示任务详情（作业点、物资、路线等），支持查看历史任务记录。",
        "features": [
          "接收调度任务推送通知",
          "展示任务列表与详情（作业点",
          "物资",
          "路线）",
          "支持任务筛选与搜索",
          "查看已完成任务历史"
        ],
        "featureText": "接收调度任务推送通知、展示任务列表与详情（作业点、物资、路线）、支持任务筛选与搜索、查看已完成任务历史",
        "sections": [
          "任务筛选与搜索区域",
          "任务列表与详情展示区域"
        ],
        "originalPageKey": "scenario-1782831312544-2-page-1",
        "scenarioKey": "scenario-1782831312544-2",
        "scenarioName": "司机执行任务"
      },
      "generatedAt": "2026-07-01T05:52:51.981Z"
    },
    "scenario-1782831312544-2-scenario-1782831312544-2-page-2-1": {
      "key": "scenario-1782831312544-2-scenario-1782831312544-2-page-2-1",
      "name": "导航路线指引页面",
      "vueFile": "NavigationOverlay.vue（嵌入 DriverTaskView.vue）",
      "fields": [
        {
          "name": "currentPosition",
          "label": "当前位置",
          "type": "info",
          "required": false,
          "description": "自动获取的GPS定位，不可编辑"
        },
        {
          "name": "destination",
          "label": "目的作业点",
          "type": "info",
          "required": false,
          "description": "从任务中获取的作业点名称或地址"
        },
        {
          "name": "routeType",
          "label": "导航方式",
          "type": "select",
          "required": true,
          "description": "驾车或步行，默认为驾车"
        },
        {
          "name": "voiceGuide",
          "label": "语音播报",
          "type": "switch",
          "required": false,
          "description": "开启/关闭语音导航提示"
        },
        {
          "name": "routeList",
          "label": "推荐路线",
          "type": "list",
          "required": false,
          "description": "多条备选路线，包括距离和预计时间"
        },
        {
          "name": "totalDistance",
          "label": "总距离",
          "type": "info",
          "required": false,
          "description": "当前选择路线的总里程"
        },
        {
          "name": "estimatedTime",
          "label": "预计用时",
          "type": "info",
          "required": false,
          "description": "当前选择路线的预计行驶时间"
        }
      ],
      "actions": [
        {
          "label": "开始导航",
          "trigger": "点击按钮",
          "feedback": "进入导航模式，地图实时更新，语音播报启动"
        },
        {
          "label": "切换路线",
          "trigger": "选择路线列表中的其他路线",
          "feedback": "地图更新新路线，距离和时间重新计算"
        },
        {
          "label": "切换导航方式",
          "trigger": "切换驾车/步行",
          "feedback": "路线重新规划并显示"
        },
        {
          "label": "切换语音播报",
          "trigger": "点击开关",
          "feedback": "语音播报开启或关闭"
        },
        {
          "label": "刷新路线",
          "trigger": "点击刷新按钮",
          "feedback": "重新规划当前位置到目的地路线"
        },
        {
          "label": "返回",
          "trigger": "点击返回按钮",
          "feedback": "关闭当前页面，回到司机工作台"
        }
      ],
      "validations": [
        "定位权限未开启，无法获取当前位置",
        "无法获取GPS信号，请确保在室外或开启定位服务",
        "目的地不在系统作业点范围内，无法规划路线",
        "当前无网络连接，请在联网后重试",
        "路线规划失败，请稍后重试"
      ],
      "states": {
        "empty": {
          "description": "无可用路线信息，请检查定位和目的地址",
          "icon": "empty"
        },
        "loading": {
          "description": "正在获取位置并规划路线，请稍候...",
          "icon": "loading"
        },
        "success": {
          "description": "路线规划完成，可开始导航",
          "icon": "success"
        },
        "error": {
          "description": "路线规划出错，请尝试刷新或联系调度员",
          "icon": "error"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-2-scenario-1782831312544-2-page-2-1",
        "priority": "P1",
        "type": "辅助页",
        "name": "导航路线指引页面",
        "vueFile": "NavigationOverlay.vue（嵌入 DriverTaskView.vue）",
        "goal": "集成地图导航功能，根据任务作业点自动规划路线，提供语音播报和实时路况，支持一键导航到目标区域或门岗。",
        "features": [
          "自动规划从当前位置到作业点的最优路线",
          "地图显示路线与作业点标记",
          "语音导航播报",
          "支持切换导航方式（步行/驾车）"
        ],
        "featureText": "自动规划从当前位置到作业点的最优路线、地图显示路线与作业点标记、语音导航播报、支持切换导航方式（步行/驾车）",
        "sections": [
          "地图显示区域",
          "导航控制区域",
          "路线信息面板"
        ],
        "originalPageKey": "scenario-1782831312544-2-page-2",
        "scenarioKey": "scenario-1782831312544-2",
        "scenarioName": "司机执行任务"
      },
      "generatedAt": "2026-07-01T05:53:09.433Z"
    },
    "scenario-1782831312544-2-scenario-1782831312544-2-page-3-2": {
      "key": "scenario-1782831312544-2-scenario-1782831312544-2-page-3-2",
      "name": "到达拍照确认页面",
      "vueFile": "ArrivalConfirmModal.vue",
      "fields": [
        {
          "name": "photo",
          "label": "现场照片",
          "type": "file",
          "required": true,
          "description": "上传到达作业点后的现场照片，至少一张"
        },
        {
          "name": "arrivalTime",
          "label": "到达时间",
          "type": "datetime",
          "required": false,
          "description": "系统自动记录的到达时间（仅展示）"
        },
        {
          "name": "gpsLocation",
          "label": "GPS位置",
          "type": "text",
          "required": false,
          "description": "系统自动获取的当前位置坐标（仅展示）"
        },
        {
          "name": "manualCheckin",
          "label": "手动签到确认",
          "type": "checkbox",
          "required": false,
          "description": "若地理围栏未自动触发，可手动勾选签到"
        }
      ],
      "actions": [
        {
          "label": "签到确认",
          "trigger": "点击按钮",
          "feedback": "提交签到数据，返回成功或失败提示，并关闭弹窗"
        },
        {
          "label": "拍照上传",
          "trigger": "点击相机图标",
          "feedback": "打开系统相机或文件选择器，选择后预览照片"
        },
        {
          "label": "关闭弹窗",
          "trigger": "点击关闭图标或蒙层",
          "feedback": "取消签到，返回上一页"
        }
      ],
      "validations": [
        "需至少上传一张现场照片",
        "若手动勾选签到，需确认已在作业点范围内",
        "地理围栏自动检测可覆盖手动签到"
      ],
      "states": {
        "empty": "无照片、无签到记录，显示默认提示",
        "loading": "提交签到中，显示加载状态",
        "success": "签到成功，显示成功图标与反馈文字，自动关闭",
        "error": "签到失败，显示错误信息（如围栏外、拍照失败）"
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-2-scenario-1782831312544-2-page-3-2",
        "priority": "P1",
        "type": "辅助页",
        "name": "到达拍照确认页面",
        "vueFile": "ArrivalConfirmModal.vue",
        "goal": "司机到达作业点后，通过拍照或地理围栏签到确认到场，系统自动记录到达时间与位置，并可上传现场照片作为凭证。",
        "features": [
          "地理围栏自动检测到达并提醒签到",
          "拍照上传作业现场照片",
          "手动签到确认到达",
          "记录到达时间与GPS位置"
        ],
        "featureText": "地理围栏自动检测到达并提醒签到、拍照上传作业现场照片、手动签到确认到达、记录到达时间与GPS位置",
        "sections": [
          "到达提醒与签到区域",
          "现场拍照上传区域",
          "签到结果反馈区域"
        ],
        "originalPageKey": "scenario-1782831312544-2-page-3",
        "scenarioKey": "scenario-1782831312544-2",
        "scenarioName": "司机执行任务"
      },
      "generatedAt": "2026-07-01T05:53:30.183Z"
    },
    "scenario-1782831312544-2-scenario-1782831312544-2-page-4-3": {
      "key": "scenario-1782831312544-2-scenario-1782831312544-2-page-4-3",
      "name": "到达拍照确认页面",
      "vueFile": "TaskCompletionForm.vue",
      "fields": [
        {
          "name": "loadQuantity",
          "label": "装卸数量",
          "type": "number",
          "required": false,
          "description": "实际装卸的物资数量，可选填写"
        },
        {
          "name": "operationResult",
          "label": "作业结果",
          "type": "select",
          "required": false,
          "description": "选择作业完成结果，如正常完成、部分完成、未完成等"
        },
        {
          "name": "remarks",
          "label": "作业备注",
          "type": "textarea",
          "required": false,
          "description": "填写作业过程中的备注信息，如异常情况描述"
        },
        {
          "name": "abnormalType",
          "label": "异常类型",
          "type": "select",
          "required": false,
          "description": "选择异常类型，如物资损坏、超时、其他"
        },
        {
          "name": "abnormalDescription",
          "label": "异常描述",
          "type": "textarea",
          "required": false,
          "description": "详细描述异常情况，仅在报告异常时填写"
        }
      ],
      "actions": [
        {
          "label": "关闭任务",
          "trigger": "点击“关闭任务”按钮",
          "feedback": "弹出二次确认对话框，确认后提交表单数据，调用关闭任务接口，成功后显示成功提示并返回任务列表"
        },
        {
          "label": "报告异常",
          "trigger": "点击“报告异常”按钮或切换开关",
          "feedback": "展开异常类型与描述输入区域，允许填写异常信息"
        },
        {
          "label": "提交异常报告",
          "trigger": "点击“提交异常”按钮",
          "feedback": "校验异常信息完整后提交，显示提交中状态，成功后显示成功提示，失败显示错误信息"
        }
      ],
      "validations": [
        "装卸数量必须为非负整数",
        "如果选择了异常类型，则异常描述为必填",
        "提交关闭任务时，至少填写装卸数量或作业结果之一（可配置）"
      ],
      "states": {
        "empty": "未填写任何信息，显示空表单，占位提示如“请输入装卸数量”",
        "loading": "提交请求中，按钮显示加载图标并禁用，页面不可重复操作",
        "success": "任务关闭成功，显示绿色成功提示，自动返回上一级任务列表",
        "error": "提交失败，显示红色错误提示，保留已填写内容，允许重新提交"
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-2-scenario-1782831312544-2-page-4-3",
        "priority": "P1",
        "type": "辅助页",
        "name": "到达拍照确认页面",
        "vueFile": "TaskCompletionForm.vue",
        "goal": "完成装卸或作业后，司机一键关闭任务，填写作业备注（如装卸数量、异常情况），系统更新任务状态为已完成并记录完成时间。",
        "features": [
          "一键关闭当前任务",
          "填写作业完成备注（可选）",
          "报告作业异常（如物资损坏",
          "超时）",
          "确认装卸数量或作业结果"
        ],
        "featureText": "一键关闭当前任务、填写作业完成备注（可选）、报告作业异常（如物资损坏、超时）、确认装卸数量或作业结果",
        "sections": [
          "任务完成信息与备注区域",
          "关闭确认操作区域"
        ],
        "originalPageKey": "scenario-1782831312544-2-page-4",
        "scenarioKey": "scenario-1782831312544-2",
        "scenarioName": "司机执行任务"
      },
      "generatedAt": "2026-07-01T05:53:59.593Z"
    },
    "scenario-1782831312544-3-scenario-1782831312544-3-page-1-0": {
      "key": "scenario-1782831312544-3-scenario-1782831312544-3-page-1-0",
      "name": "门岗入场核验工作台",
      "vueFile": "GateCheckView.vue（集成入口）或 EntraceCheckComponent.vue",
      "fields": [
        {
          "name": "plateNumber",
          "label": "车牌号",
          "type": "text",
          "required": true,
          "description": "手动输入或通过扫描自动填充，用于核验车辆入场权限"
        },
        {
          "name": "scanButton",
          "label": "扫描",
          "type": "button",
          "required": false,
          "description": "触发摄像头扫描车牌或二维码，自动填充车牌号并发起核验"
        },
        {
          "name": "checkResultStatus",
          "label": "核验结果",
          "type": "text",
          "required": false,
          "description": "自动核验后显示放行或拦截状态，只读"
        },
        {
          "name": "checkResultDetail",
          "label": "核验详情",
          "type": "text",
          "required": false,
          "description": "显示车辆类型、有效期、所属单位等详细核验信息，只读"
        },
        {
          "name": "recordList",
          "label": "入场记录列表",
          "type": "table",
          "required": false,
          "description": "展示最近入场记录，包含车牌号、入场时间、核验结果、操作人"
        }
      ],
      "actions": [
        {
          "label": "扫描车牌",
          "trigger": "点击扫描按钮或扫描设备触发",
          "feedback": "系统自动识别车牌并填充车牌号字段，同时发起核验请求，核验结果区域展示放行或拦截信息"
        },
        {
          "label": "放行",
          "trigger": "核验通过后点击放行按钮",
          "feedback": "系统放行车辆，记录入场时间，更新入场记录列表，门禁联动抬杆"
        },
        {
          "label": "拦截",
          "trigger": "核验失败后点击拦截按钮",
          "feedback": "系统拦截车辆，记录拦截原因，更新入场记录列表，门禁保持关闭，可选通知相关人员"
        },
        {
          "label": "刷新入场记录",
          "trigger": "点击刷新按钮或页面加载",
          "feedback": "重新加载入场记录列表，显示最新数据"
        }
      ],
      "validations": [
        "车牌号必填且符合标准车牌格式",
        "扫描结果需与数据库匹配才能发起核验",
        "核验超时时需提示重试",
        "放行和拦截操作需二次确认"
      ],
      "states": {
        "empty": {
          "description": "未进行扫描或手动输入前，扫描输入区为空，核验结果区隐藏，操作按钮禁用，入场记录列表显示上次记录或空"
        },
        "loading": {
          "description": "正在调用门禁核验接口，显示加载动画或进度条，核验结果区显示'核验中...'，操作按钮禁用"
        },
        "success": {
          "description": "核验通过，核验结果区显示放行状态（绿色标记）和车辆详情，放行按钮可用，拦截按钮不可用，入场记录自动追加"
        },
        "error": {
          "description": "核验失败或接口异常，核验结果区显示拦截状态（红色标记）和失败原因，拦截按钮可用，放行按钮不可用，可手动修改车牌号后重新扫描"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-3-scenario-1782831312544-3-page-1-0",
        "priority": "P1",
        "type": "工作台页",
        "name": "门岗入场核验工作台",
        "vueFile": "GateCheckView.vue（集成入口）或 EntraceCheckComponent.vue",
        "goal": "门岗人员通过扫描车牌或二维码，系统自动核验车辆预约、派车或授权状态，显示放行或拦截结果，并记录入场时间。",
        "features": [
          "扫描车牌/二维码",
          "自动核验预约/派车/授权",
          "显示放行/拦截结果",
          "记录入场时间"
        ],
        "featureText": "扫描车牌/二维码、自动核验预约/派车/授权、显示放行/拦截结果、记录入场时间",
        "sections": [
          "扫描输入区",
          "核验结果展示区",
          "操作区",
          "入场记录列表"
        ],
        "scenarioKey": "scenario-1782831312544-3",
        "scenarioName": "门岗入场核验",
        "originalPageKey": "scenario-1782831312544-3-page-1"
      },
      "generatedAt": "2026-07-01T06:13:14.712Z"
    },
    "scenario-1782831312544-3-scenario-1782831312544-3-page-2-1": {
      "key": "scenario-1782831312544-3-scenario-1782831312544-3-page-2-1",
      "name": "出场核验页面",
      "vueFile": "GateCheckView.vue（集成入口）或 ExitCheckComponent.vue",
      "fields": [
        {
          "name": "plateNumber",
          "label": "车牌号",
          "type": "text",
          "required": true,
          "description": "手动输入或扫描识别的车牌号码"
        },
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "readonly",
          "required": false,
          "description": "根据车牌号自动获取的车辆类型"
        },
        {
          "name": "unit",
          "label": "所属单位",
          "type": "readonly",
          "required": false,
          "description": "车辆所属单位"
        },
        {
          "name": "taskStatus",
          "label": "当前任务状态",
          "type": "readonly",
          "required": false,
          "description": "车辆当前是否有进行中的任务"
        },
        {
          "name": "reservationId",
          "label": "预约编号",
          "type": "readonly",
          "required": false,
          "description": "外协车辆的预约入场编号"
        },
        {
          "name": "exitTime",
          "label": "出场时间",
          "type": "datetime",
          "required": true,
          "description": "车辆实际出场时间，默认当前时间可编辑"
        }
      ],
      "actions": [
        {
          "label": "扫描车牌/二维码",
          "trigger": "点击调用设备摄像头扫描",
          "feedback": "扫描成功后自动填充车牌号，并触发资格核验"
        },
        {
          "label": "核验通过放行",
          "trigger": "点击执行核验通过操作",
          "feedback": "显示成功提示，更新出场记录列表，车辆状态变更为已出场"
        },
        {
          "label": "核验不通过拦截",
          "trigger": "点击执行核验不通过操作",
          "feedback": "显示失败原因弹窗，记录异常信息，车辆不得出场"
        },
        {
          "label": "复位/重新核验",
          "trigger": "点击清空当前表单",
          "feedback": "清空所有输入和结果，回到初始状态"
        }
      ],
      "validations": [
        "车牌号不能为空",
        "出场时间不能为空",
        "核验操作必须选择通过或不通过"
      ],
      "states": {
        "empty": {
          "description": "无车辆数据，显示提示语'请扫描或输入车牌号'",
          "style": "灰色背景，居中提示"
        },
        "loading": {
          "description": "扫描或查询中，显示 loading 动画",
          "style": "旋转加载图标"
        },
        "success": {
          "description": "核验通过，显示绿色成功提示框，并展示确认放行按钮已激活",
          "style": "绿色边框"
        },
        "error": {
          "description": "核验失败或系统错误，显示红色错误提示框，并显示错误详情",
          "style": "红色边框"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-3-scenario-1782831312544-3-page-2-1",
        "priority": "P1",
        "type": "辅助页",
        "name": "出场核验页面",
        "vueFile": "GateCheckView.vue（集成入口）或 ExitCheckComponent.vue",
        "goal": "车辆出场时，门岗人员执行核验并记录出场时间，更新车辆在场状态，确保出场车辆已无有效任务或预约。",
        "features": [
          "扫描车牌/二维码",
          "核验车辆出场资格（任务/预约状态）",
          "记录出场时间",
          "更新车辆在场状态"
        ],
        "featureText": "扫描车牌/二维码、核验车辆出场资格（任务/预约状态）、记录出场时间、更新车辆在场状态",
        "sections": [
          "扫描输入区",
          "出场资格核验区",
          "操作区",
          "出场记录列表"
        ],
        "scenarioKey": "scenario-1782831312544-3",
        "scenarioName": "门岗入场核验",
        "originalPageKey": "scenario-1782831312544-3-page-2"
      },
      "generatedAt": "2026-07-01T06:13:38.092Z"
    },
    "scenario-1782831312544-3-scenario-1782831312544-3-page-3-2": {
      "key": "scenario-1782831312544-3-scenario-1782831312544-3-page-3-2",
      "name": "异常处理页面",
      "vueFile": "GateCheckView.vue（集成异常弹窗）或 ExceptionHandlingComponent.vue",
      "fields": [
        {
          "name": "reason",
          "label": "异常原因",
          "type": "select",
          "required": true,
          "description": "选择或输入异常原因，如无预约、证照过期等"
        },
        {
          "name": "result",
          "label": "处理结果",
          "type": "radio",
          "required": true,
          "description": "放行或拒绝"
        },
        {
          "name": "remark",
          "label": "处理备注",
          "type": "textarea",
          "required": false,
          "description": "补充说明"
        },
        {
          "name": "notifyRecipients",
          "label": "通知对象",
          "type": "checkbox",
          "required": false,
          "description": "选择通知调度、安保等"
        }
      ],
      "actions": [
        {
          "label": "查询",
          "trigger": "点击查询按钮",
          "feedback": "显示加载状态并刷新异常记录列表"
        },
        {
          "label": "放行",
          "trigger": "点击放行按钮并确认",
          "feedback": "提示操作成功，更新列表并关闭处理界面"
        },
        {
          "label": "拒绝",
          "trigger": "点击拒绝按钮并确认",
          "feedback": "提示操作成功，记录结果"
        },
        {
          "label": "通知",
          "trigger": "点击通知按钮",
          "feedback": "提示已通知相关方"
        }
      ],
      "validations": [
        "处理结果不能为空",
        "异常原因不能为空"
      ],
      "states": {
        "empty": "暂无异常记录",
        "loading": "正在加载异常记录...",
        "success": "操作成功",
        "error": "操作失败，请重试"
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-3-scenario-1782831312544-3-page-3-2",
        "priority": "P1",
        "type": "辅助页",
        "name": "异常处理页面",
        "vueFile": "GateCheckView.vue（集成异常弹窗）或 ExceptionHandlingComponent.vue",
        "goal": "核验失败或异常情况时（如无预约、证照过期、未授权、车牌无法识别），门岗人员可进行人工干预处理，记录异常原因及处理结果并通知相关方。",
        "features": [
          "异常拦截提示与原因展示",
          "人工审核与放行/拒绝操作",
          "记录异常处理结果（原因",
          "处理人",
          "时间）",
          "通知相关方（调度",
          "安保）"
        ],
        "featureText": "异常拦截提示与原因展示、人工审核与放行/拒绝操作、记录异常处理结果（原因、处理人、时间）、通知相关方（调度、安保）",
        "sections": [
          "查询条件区",
          "核验记录列表区"
        ],
        "scenarioKey": "scenario-1782831312544-3",
        "scenarioName": "门岗入场核验",
        "originalPageKey": "scenario-1782831312544-3-page-3"
      },
      "generatedAt": "2026-07-01T06:14:02.971Z"
    },
    "scenario-1782831312544-3-scenario-1782831312544-3-page-4-3": {
      "key": "scenario-1782831312544-3-scenario-1782831312544-3-page-4-3",
      "name": "核验日志查询页面",
      "vueFile": "GateCheckView.vue（内嵌列表）或独立页面 GateLogView.vue",
      "fields": [
        {
          "name": "licensePlate",
          "label": "车牌号",
          "type": "input",
          "required": false,
          "description": "输入完整的车牌号或部分字符进行模糊查询"
        },
        {
          "name": "timeRange",
          "label": "核验时间范围",
          "type": "daterangepicker",
          "required": false,
          "description": "选择起始和结束日期，筛选该时间段内的核验记录"
        },
        {
          "name": "checkResult",
          "label": "核验结果",
          "type": "select",
          "required": false,
          "description": "下拉选择：通过、拒绝、异常，支持多选"
        },
        {
          "name": "direction",
          "label": "核验方向",
          "type": "select",
          "required": false,
          "description": "选择入场核验或出场核验"
        }
      ],
      "actions": [
        {
          "label": "查询",
          "trigger": "点击查询按钮",
          "feedback": "刷新列表数据，显示符合筛选条件的核验记录；如无结果则显示空状态"
        },
        {
          "label": "重置",
          "trigger": "点击重置按钮",
          "feedback": "清空所有筛选条件，恢复默认列表"
        },
        {
          "label": "查看详情",
          "trigger": "点击某条记录的行或详情按钮",
          "feedback": "弹窗或侧边栏展示该条核验的完整信息：车辆信息、司机信息、核验结果、时间、现场照片等"
        },
        {
          "label": "导出日志",
          "trigger": "点击导出按钮",
          "feedback": "导出当前筛选条件下的核验记录为Excel文件，触发浏览器下载"
        }
      ],
      "validations": [
        "车牌号输入长度不超过15个字符",
        "时间范围选择时开始日期不能晚于结束日期",
        "核验结果字段为可选，无需必填校验"
      ],
      "states": {
        "empty": {
          "description": "列表无数据",
          "icon": "inbox",
          "text": "暂无核验记录",
          "action": "调整筛选条件后重新查询"
        },
        "loading": {
          "description": "数据加载中",
          "spinner": true,
          "text": "正在查询核验日志..."
        },
        "success": {
          "description": "数据加载成功",
          "hidden": true
        },
        "error": {
          "description": "数据加载失败",
          "icon": "error",
          "text": "查询失败，请检查网络或联系管理员",
          "action": "重新加载"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-3-scenario-1782831312544-3-page-4-3",
        "priority": "P1",
        "type": "辅助页",
        "name": "核验日志查询页面",
        "vueFile": "GateCheckView.vue（内嵌列表）或独立页面 GateLogView.vue",
        "goal": "门岗人员查询车辆入场、出场核验历史记录，可按车牌、时间范围、结果状态等条件进行筛选和详情查看。",
        "features": [
          "按车牌/时间/结果筛选",
          "查看核验详情（车辆",
          "司机",
          "核验结果",
          "时间）",
          "支持导出日志"
        ],
        "featureText": "按车牌/时间/结果筛选、查看核验详情（车辆、司机、核验结果、时间）、支持导出日志",
        "sections": [
          "查询条件区",
          "核验记录列表区",
          "详情查看区"
        ],
        "scenarioKey": "scenario-1782831312544-3",
        "scenarioName": "门岗入场核验",
        "originalPageKey": "scenario-1782831312544-3-page-4"
      },
      "generatedAt": "2026-07-01T06:14:17.116Z"
    },
    "scenario-1782831312544-4-scenario-1782831312544-4-page-1-0": {
      "key": "scenario-1782831312544-4-scenario-1782831312544-4-page-1-0",
      "name": "外协车辆预约入场工作台",
      "vueFile": "VehicleReservationView.vue",
      "fields": [
        {
          "name": "plateNumber",
          "label": "车牌号",
          "type": "text",
          "required": true,
          "description": "请输入车牌号，如京A12345"
        },
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "select",
          "required": true,
          "description": "选择车辆类型：货运、客运、特种等"
        },
        {
          "name": "belongCompany",
          "label": "所属单位",
          "type": "text",
          "required": true,
          "description": "填写车辆所属单位名称"
        },
        {
          "name": "driverName",
          "label": "司机姓名",
          "type": "text",
          "required": true,
          "description": "填写司机姓名"
        },
        {
          "name": "driverPhone",
          "label": "司机联系方式",
          "type": "text",
          "required": true,
          "description": "填写司机手机号码"
        },
        {
          "name": "plannedEntryTime",
          "label": "预计入场时间",
          "type": "datetime",
          "required": true,
          "description": "选择预计入场时间"
        },
        {
          "name": "plannedExitTime",
          "label": "预计出场时间",
          "type": "datetime",
          "required": false,
          "description": "选择预计出场时间，可选"
        }
      ],
      "actions": [
        {
          "label": "提交预约申请",
          "trigger": "click",
          "feedback": "提交成功后显示审批结果，包含审批状态和预约编号"
        },
        {
          "label": "查看审批结果",
          "trigger": "click",
          "feedback": "跳转至审批结果详情页或弹窗显示审批状态"
        }
      ],
      "validations": [
        "字段不能为空: 车牌号、车辆类型、所属单位、司机姓名、司机联系方式、预计入场时间",
        "车牌号格式不正确",
        "联系方式格式不正确（11位手机号）",
        "预计入场时间不能晚于预计出场时间",
        "预计入场时间不能早于当前时间"
      ],
      "states": {
        "empty": "请填写预约信息并提交",
        "loading": "正在提交预约申请...",
        "success": "预约已提交，请等待自动审批",
        "error": "提交失败，请检查表单信息后重试"
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-4-scenario-1782831312544-4-page-1-0",
        "priority": "P1",
        "type": "工作台页",
        "name": "外协车辆预约入场工作台",
        "vueFile": "VehicleReservationView.vue",
        "goal": "外协或临时车辆申请人提交预约登记信息，包括车辆信息、司机信息、入场时间等，系统自动审批并生成预约记录。",
        "features": [
          "填写车辆基本信息（车牌",
          "类型",
          "所属单位）",
          "填写司机信息（姓名",
          "联系方式）",
          "选择预计入场时间与出场时间",
          "提交预约申请（自动审批）",
          "查看预约审批结果"
        ],
        "featureText": "填写车辆基本信息（车牌、类型、所属单位）、填写司机信息（姓名、联系方式）、选择预计入场时间与出场时间、提交预约申请（自动审批）、查看预约审批结果",
        "sections": [
          "预约信息录入区",
          "提交与审批反馈区"
        ],
        "scenarioKey": "scenario-1782831312544-4",
        "scenarioName": "外协车辆预约入场",
        "originalPageKey": "scenario-1782831312544-4-page-1"
      },
      "generatedAt": "2026-07-01T06:15:23.435Z"
    },
    "scenario-1782831312544-4-scenario-1782831312544-4-page-2-1": {
      "key": "scenario-1782831312544-4-scenario-1782831312544-4-page-2-1",
      "name": "授权凭证页面",
      "vueFile": "VehicleReservationView.vue",
      "fields": [
        {
          "name": "qrCodeImage",
          "label": "授权二维码",
          "type": "image",
          "required": false,
          "description": "动态生成的二维码图片，用于入场核验"
        },
        {
          "name": "authorizationCode",
          "label": "授权码",
          "type": "text",
          "required": false,
          "description": "系统生成的唯一授权码"
        },
        {
          "name": "validPeriod",
          "label": "授权有效期",
          "type": "dateRange",
          "required": false,
          "description": "允许入场的起止时间"
        },
        {
          "name": "reservationId",
          "label": "关联预约单号",
          "type": "text",
          "required": false,
          "description": "对应的入场预约申请编号"
        },
        {
          "name": "vehiclePlate",
          "label": "车牌号",
          "type": "text",
          "required": false,
          "description": "预约车辆的车牌号"
        },
        {
          "name": "driverName",
          "label": "司机姓名",
          "type": "text",
          "required": false,
          "description": "预约的司机姓名"
        }
      ],
      "actions": [
        {
          "label": "下载凭证",
          "trigger": "click",
          "feedback": "下载授权凭证图片到本地"
        },
        {
          "label": "打印凭证",
          "trigger": "click",
          "feedback": "调用系统打印功能打印凭证"
        },
        {
          "label": "查看预约详情",
          "trigger": "click",
          "feedback": "弹出或跳转到预约详情页面"
        }
      ],
      "validations": [
        "授权凭证页面 的关键筛选或处理字段不能为空。",
        "提交前校验状态流转是否合法，并给出明确错误提示。"
      ],
      "states": {
        "empty": "无授权信息，显示暂无授权凭证提示",
        "loading": "授权信息加载中，显示加载动画",
        "success": "授权生成成功，显示二维码和凭证信息",
        "error": "授权生成失败，显示错误提示及重试按钮"
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-4-scenario-1782831312544-4-page-2-1",
        "priority": "P1",
        "type": "辅助页",
        "name": "授权凭证页面",
        "vueFile": "VehicleReservationView.vue",
        "goal": "预约通过后生成入场授权二维码，作为车辆入场凭证，支持下载或展示。",
        "features": [
          "自动生成入场授权二维码",
          "下载或打印授权凭证",
          "查看授权有效期与关联预约信息"
        ],
        "featureText": "自动生成入场授权二维码、下载或打印授权凭证、查看授权有效期与关联预约信息",
        "sections": [
          "授权二维码展示区",
          "凭证操作区",
          "授权信息详情"
        ],
        "scenarioKey": "scenario-1782831312544-4",
        "scenarioName": "外协车辆预约入场",
        "originalPageKey": "scenario-1782831312544-4-page-2"
      },
      "generatedAt": "2026-07-01T06:15:38.923Z"
    },
    "scenario-1782831312544-4-scenario-1782831312544-4-page-3-2": {
      "key": "scenario-1782831312544-4-scenario-1782831312544-4-page-3-2",
      "name": "入场记录页面",
      "vueFile": "VehicleReservationView.vue",
      "fields": [
        {
          "name": "entryCode",
          "label": "入场授权码",
          "type": "text",
          "required": true,
          "description": "扫描或手动输入授权码，用于自动填充车辆及司机信息"
        },
        {
          "name": "licensePlate",
          "label": "车牌号",
          "type": "text",
          "required": false,
          "description": "根据授权码自动带出，只读"
        },
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "text",
          "required": false,
          "description": "根据授权码自动带出，只读"
        },
        {
          "name": "driverName",
          "label": "司机姓名",
          "type": "text",
          "required": false,
          "description": "根据授权码自动带出，可编辑"
        },
        {
          "name": "driverPhone",
          "label": "司机手机号",
          "type": "tel",
          "required": false,
          "description": "根据授权码自动带出，可编辑"
        },
        {
          "name": "entryTime",
          "label": "入场时间",
          "type": "datetime",
          "required": false,
          "description": "系统自动生成，只读"
        }
      ],
      "actions": [
        {
          "label": "扫描入场授权码",
          "trigger": "点击扫码按钮或调用摄像头",
          "feedback": "显示扫描动画，成功时自动填充授权码并加载车辆司机信息"
        },
        {
          "label": "确认登记",
          "trigger": "点击确认按钮",
          "feedback": "提交登记申请，成功后显示成功提示，失败显示错误信息"
        },
        {
          "label": "查询历史入场记录",
          "trigger": "点击查询按钮或输入过滤条件",
          "feedback": "显示筛选后的历史记录列表"
        }
      ],
      "validations": [
        "入场授权码不能为空",
        "入场授权码格式必须为6位数字字母组合"
      ],
      "states": {
        "empty": "暂无入场记录或未扫描授权码",
        "loading": "正在扫描授权码或提交登记中...",
        "success": "入场登记成功",
        "error": "入场登记失败，请检查授权码是否有效或网络连接"
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-4-scenario-1782831312544-4-page-3-2",
        "priority": "P1",
        "type": "辅助页",
        "name": "入场记录页面",
        "vueFile": "VehicleReservationView.vue",
        "goal": "车辆到场后通过扫描入场码完成入场登记，记录入场时间、车辆、司机等信息，支持历史入场记录追溯。",
        "features": [
          "扫描入场授权码完成入场登记",
          "记录入场时间",
          "车辆信息",
          "司机信息",
          "查询个人历史入场记录"
        ],
        "featureText": "扫描入场授权码完成入场登记、记录入场时间、车辆信息、司机信息、查询个人历史入场记录",
        "sections": [
          "扫码入场区",
          "登记确认信息区",
          "历史入场记录查询区"
        ],
        "scenarioKey": "scenario-1782831312544-4",
        "scenarioName": "外协车辆预约入场",
        "originalPageKey": "scenario-1782831312544-4-page-3"
      },
      "generatedAt": "2026-07-01T06:16:36.004Z"
    },
    "scenario-1782831312544-4-scenario-1782831312544-4-page-4-3": {
      "key": "scenario-1782831312544-4-scenario-1782831312544-4-page-4-3",
      "name": "出场核验页面",
      "vueFile": "VehicleReservationView.vue",
      "fields": [
        {
          "name": "vehicleIdInput",
          "label": "车牌号/凭证号",
          "type": "text",
          "required": true,
          "description": "手动输入或通过扫描获取车辆车牌号或入场凭证号"
        },
        {
          "name": "scanButton",
          "label": "扫描",
          "type": "button",
          "required": false,
          "description": "唤起摄像头扫描车牌或二维码/条形码凭证"
        },
        {
          "name": "vehicleInfo",
          "label": "车辆信息",
          "type": "display",
          "required": false,
          "description": "显示核验成功的车辆信息（车牌、车型、单位、司机等）"
        },
        {
          "name": "reservationInfo",
          "label": "预约信息",
          "type": "display",
          "required": false,
          "description": "显示关联的预约入场记录详情"
        },
        {
          "name": "exitTime",
          "label": "出场时间",
          "type": "datetime",
          "required": false,
          "description": "自动记录当前时间为出场时间，允许手动修正"
        },
        {
          "name": "exitRemark",
          "label": "出场备注",
          "type": "textarea",
          "required": false,
          "description": "记录出场时的特殊情况说明"
        },
        {
          "name": "queryKeyword",
          "label": "查询关键字",
          "type": "text",
          "required": false,
          "description": "按车牌、凭证号、预约单号等模糊搜索出场记录"
        },
        {
          "name": "queryDateRange",
          "label": "查询日期范围",
          "type": "dateRange",
          "required": false,
          "description": "筛选出场记录的起止日期"
        }
      ],
      "actions": [
        {
          "label": "扫描入场凭证",
          "trigger": "点击扫描按钮",
          "feedback": "打开摄像头/扫描界面，扫描成功后自动填充车辆或凭证信息并触发核验"
        },
        {
          "label": "核验出场",
          "trigger": "点击核验按钮（或扫描成功后自动触发）",
          "feedback": "显示核验结果：成功则展示车辆和预约信息，记录出场时间，更新预约状态为已核销；失败则提示错误信息"
        },
        {
          "label": "查询出场记录",
          "trigger": "点击查询按钮或输入查询条件后自动搜索",
          "feedback": "展示符合条件的出场记录列表，支持分页和详情查看"
        },
        {
          "label": "导出出场记录",
          "trigger": "点击导出按钮",
          "feedback": "下载当前查询结果或全部出场记录为Excel/CSV文件"
        }
      ],
      "validations": [
        "车牌号或凭证号不能为空",
        "车牌号格式应为标准车牌（如 京A12345）或凭证号长度在6-20位",
        "出场时间不能晚于当前时间",
        "查询日期范围不能超过90天",
        "核验失败时需提示具体原因（如预约已核销、车辆未预约、车辆已出场等）"
      ],
      "states": {
        "empty": "无车辆信息输入，页面显示默认引导文字和扫描/输入区域，无核验结果内容",
        "loading": "执行核验或查询时，按钮显示加载图标，界面不可重复操作",
        "success": "核验通过：显示车辆和预约详情，出场时间自动填入，预约状态变为已核销，提供操作成功提示",
        "error": "核验失败：显示错误提示（如未找到预约、证件过期等），输入区域保持可修改状态以便重新核验"
      },
      "sourcePageDesign": {
        "key": "scenario-1782831312544-4-scenario-1782831312544-4-page-4-3",
        "priority": "P1",
        "type": "辅助页",
        "name": "出场核验页面",
        "vueFile": "VehicleReservationView.vue",
        "goal": "车辆出场时核验出场信息，自动核销预约记录，记录出场时间。",
        "features": [
          "扫描车辆入场凭证或车牌",
          "核验出场信息并记录出场时间",
          "自动更新预约状态为已核销",
          "提供出场记录查询"
        ],
        "featureText": "扫描车辆入场凭证或车牌、核验出场信息并记录出场时间、自动更新预约状态为已核销、提供出场记录查询",
        "sections": [
          "核验信息输入区",
          "核验结果与操作区",
          "出场记录查询区"
        ],
        "scenarioKey": "scenario-1782831312544-4",
        "scenarioName": "外协车辆预约入场",
        "originalPageKey": "scenario-1782831312544-4-page-4"
      },
      "generatedAt": "2026-07-01T06:17:03.296Z"
    },
    "scenario-1782887819107-0-scenario-1782887819107-0-page-1-0": {
      "key": "scenario-1782887819107-0-scenario-1782887819107-0-page-1-0",
      "name": "现场调度地图监控",
      "vueFile": "DispatchMapView.vue",
      "fields": [
        {
          "name": "vehicleTypeFilter",
          "label": "车辆类型",
          "type": "select",
          "required": false,
          "description": "筛选指定类型的车辆，如生产车辆、物流车辆等"
        },
        {
          "name": "vehicleStatusFilter",
          "label": "车辆状态",
          "type": "select",
          "required": false,
          "description": "筛选空闲、任务中、排队、异常等状态的车辆"
        },
        {
          "name": "searchPlate",
          "label": "搜索车牌号",
          "type": "text",
          "required": false,
          "description": "输入车牌号快速定位车辆"
        }
      ],
      "actions": [
        {
          "label": "查看车辆详情",
          "trigger": "点击地图上的车辆图标",
          "feedback": "弹出详情窗口，显示车牌、司机、任务、状态等信息"
        },
        {
          "label": "切换地图图层",
          "trigger": "点击图层切换按钮",
          "feedback": "切换显示作业区域、禁入区域、排队区域等图层"
        },
        {
          "label": "派发任务",
          "trigger": "在控制面板中选择车辆并点击派车",
          "feedback": "打开派车对话框，填写任务信息后提交"
        },
        {
          "label": "处理异常告警",
          "trigger": "点击异常告警通知区域中的告警项",
          "feedback": "跳转至异常告警处理面板"
        }
      ],
      "validations": [
        "现场调度地图监控 的关键筛选或处理字段不能为空。",
        "提交前校验状态流转是否合法，并给出明确错误提示。"
      ],
      "states": {
        "empty": {
          "description": "无车辆数据时，地图中央显示提示文字“暂无车辆数据”"
        },
        "loading": {
          "description": "地图和车辆数据加载中，显示加载动画"
        },
        "success": {
          "description": "正常显示地图和车辆标注"
        },
        "error": {
          "description": "数据获取失败或地图加载失败时，显示错误提示和重试按钮"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-0-scenario-1782887819107-0-page-1-0",
        "priority": "P0",
        "type": "工作台页",
        "name": "现场调度地图监控",
        "vueFile": "DispatchMapView.vue",
        "goal": "基于地图看板实时展示所有车辆的位置、状态（空闲、排队、任务中、异常）、作业区域，支持缩放、点击查看车辆详情",
        "features": [
          "实时车辆位置标注与状态颜色区分",
          "点击车辆弹出详情窗口：车牌",
          "司机",
          "任务",
          "状态",
          "地图图层切换：作业区域",
          "禁入区域",
          "排队区域",
          "车辆轨迹回放（可选）"
        ],
        "featureText": "实时车辆位置标注与状态颜色区分、点击车辆弹出详情窗口：车牌、司机、任务、状态、地图图层切换：作业区域、禁入区域、排队区域、车辆轨迹回放（可选）",
        "sections": [
          "地图主区域",
          "车辆状态筛选与任务派发控制面板",
          "异常告警通知区域"
        ],
        "scenarioKey": "scenario-1782887819107-0",
        "scenarioName": "调度员现场调度",
        "originalPageKey": "scenario-1782887819107-0-page-1"
      },
      "generatedAt": "2026-07-01T07:30:36.998Z"
    },
    "scenario-1782887819107-0-scenario-1782887819107-0-page-2-1": {
      "key": "scenario-1782887819107-0-scenario-1782887819107-0-page-2-1",
      "name": "现场车辆快速筛选",
      "vueFile": "OnsiteVehicleFilter.vue",
      "fields": [
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "select",
          "required": false,
          "description": "按车辆类型筛选，支持多选：生产车、物流车、外协车、临时车"
        },
        {
          "name": "status",
          "label": "车辆状态",
          "type": "select",
          "required": false,
          "description": "车辆当前状态：空闲、排队、任务中、异常"
        },
        {
          "name": "area",
          "label": "作业区域",
          "type": "select",
          "required": false,
          "description": "选择作业区域"
        },
        {
          "name": "sortBy",
          "label": "排序方式",
          "type": "select",
          "required": false,
          "description": "按距离优先、空闲时长或任务优先级排序"
        },
        {
          "name": "keyword",
          "label": "搜索关键字",
          "type": "text",
          "required": false,
          "description": "输入车牌号或司机姓名进行模糊匹配"
        }
      ],
      "actions": [
        {
          "label": "应用筛选",
          "trigger": "点击按钮",
          "feedback": "根据筛选条件重新加载车辆列表并在地图上高亮匹配车辆"
        },
        {
          "label": "重置",
          "trigger": "点击按钮",
          "feedback": "重置所有筛选条件为默认值，显示全部车辆"
        },
        {
          "label": "切换视图",
          "trigger": "点击切换按钮",
          "feedback": "在地图视图与列表视图之间切换"
        }
      ],
      "validations": [
        "关键字搜索长度不超过20个字符",
        "车辆类型和状态至少选择一项时执行查询"
      ],
      "states": {
        "empty": "没有符合条件的车辆，请调整筛选条件",
        "loading": "正在加载车辆数据，请稍候...",
        "success": "已加载N辆车辆，请在筛选结果中查看",
        "error": "车辆数据加载失败，请检查网络连接后重试"
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-0-scenario-1782887819107-0-page-2-1",
        "priority": "P1",
        "type": "辅助页",
        "name": "现场车辆快速筛选",
        "vueFile": "OnsiteVehicleFilter.vue",
        "goal": "支持按车辆类型、状态（空闲/排队/任务中）、作业区域、距离远近等条件筛选车辆，便于调度员快速定位合适车辆",
        "features": [
          "多条件组合筛选：车辆类型（生产车/物流车/外协车/临时车）",
          "状态",
          "区域",
          "筛选结果在地图上高亮显示",
          "列表视图展示筛选结果",
          "支持排序",
          "一键重置筛选条件"
        ],
        "featureText": "多条件组合筛选：车辆类型（生产车/物流车/外协车/临时车）、状态、区域、筛选结果在地图上高亮显示、列表视图展示筛选结果，支持排序、一键重置筛选条件",
        "sections": [
          "筛选条件面板",
          "筛选结果展示区（地图/列表）",
          "快捷操作栏"
        ],
        "scenarioKey": "scenario-1782887819107-0",
        "scenarioName": "调度员现场调度",
        "originalPageKey": "scenario-1782887819107-0-page-2"
      },
      "generatedAt": "2026-07-01T07:31:04.300Z"
    },
    "scenario-1782887819107-0-scenario-1782887819107-0-page-3-2": {
      "key": "scenario-1782887819107-0-scenario-1782887819107-0-page-3-2",
      "name": "现场派车",
      "vueFile": "OnsiteDispatchDialog.vue",
      "fields": [
        {
          "name": "applicationSelection",
          "label": "待派发用车申请",
          "type": "tableSelect",
          "required": true,
          "description": "从待派发申请列表中选择一条用车申请，若启用紧急派车则无需选择"
        },
        {
          "name": "vehicleSelection",
          "label": "目标车辆",
          "type": "vehiclePicker",
          "required": true,
          "description": "选择要派发的车辆，支持按车牌、类型筛选"
        },
        {
          "name": "workPoint",
          "label": "作业点",
          "type": "text",
          "required": true,
          "description": "输入或选择作业点位置，如：5号泊位、2号堆场"
        },
        {
          "name": "priority",
          "label": "优先级",
          "type": "select",
          "required": true,
          "description": "高/中/低，用于调度排序"
        },
        {
          "name": "taskRemark",
          "label": "派车备注",
          "type": "textarea",
          "required": false,
          "description": "可附加说明或特殊要求"
        },
        {
          "name": "isEmergency",
          "label": "紧急派车",
          "type": "switch",
          "required": false,
          "description": "开启后跳过申请选择，手动创建任务"
        },
        {
          "name": "emergencyTaskDesc",
          "label": "任务描述",
          "type": "text",
          "required": false,
          "description": "紧急派车时必填，描述任务内容"
        }
      ],
      "actions": [
        {
          "label": "派发",
          "trigger": "click",
          "feedback": "校验表单 -> 调用派发接口 -> 成功显示Success状态并关闭对话框；失败显示Error状态"
        },
        {
          "label": "取消",
          "trigger": "click",
          "feedback": "关闭对话框不保存"
        },
        {
          "label": "切换紧急派车模式",
          "trigger": "isEmergency值变化",
          "feedback": "控制紧急任务字段的显隐与必填校验"
        }
      ],
      "validations": [
        "选择用车申请与紧急派车互斥，至少选择一种",
        "目标车辆必填",
        "作业点必填",
        "优先级必填",
        "紧急派车时，任务描述必填",
        "车辆与任务匹配检查：所选车辆是否已被占用或禁入"
      ],
      "states": {
        "empty": {
          "description": "页面初始化，待派发申请列表为空",
          "uiHint": "显示占位文字：暂无待派发申请，可切换紧急派车模式"
        },
        "loading": {
          "description": "表单提交中，等待接口返回",
          "uiHint": "显示加载动画，禁用提交按钮"
        },
        "success": {
          "description": "派发成功，接口返回成功",
          "uiHint": "显示成功提示信息，2秒后自动关闭对话框或跳转"
        },
        "error": {
          "description": "派发失败，接口返回错误",
          "uiHint": "显示错误信息（如：车辆忙、任务冲突），保持表单可编辑，允许修改后重试"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-0-scenario-1782887819107-0-page-3-2",
        "priority": "P1",
        "type": "辅助页",
        "name": "现场派车",
        "vueFile": "OnsiteDispatchDialog.vue",
        "goal": "调度员为选中的车辆分配任务，支持选择用车申请、输入作业点、选择优先级，并一键下发至司机移动端",
        "features": [
          "显示待派发的用车申请列表",
          "选择目标车辆后",
          "匹配任务并确认派发",
          "支持紧急派车（跳过申请手动创建任务）",
          "派发成功后推送通知至司机端",
          "记录派发日志（操作人",
          "时间",
          "车辆",
          "任务）"
        ],
        "featureText": "显示待派发的用车申请列表、选择目标车辆后，匹配任务并确认派发、支持紧急派车（跳过申请手动创建任务）、派发成功后推送通知至司机端、记录派发日志（操作人、时间、车辆、任务）",
        "sections": [
          "待派发用车申请列表",
          "车辆选择与任务匹配",
          "派发参数配置",
          "派发操作与日志"
        ],
        "scenarioKey": "scenario-1782887819107-0",
        "scenarioName": "调度员现场调度",
        "originalPageKey": "scenario-1782887819107-0-page-3"
      },
      "generatedAt": "2026-07-01T07:32:26.150Z"
    },
    "scenario-1782887819107-0-scenario-1782887819107-0-page-4-3": {
      "key": "scenario-1782887819107-0-scenario-1782887819107-0-page-4-3",
      "name": "现场异常告警处理",
      "vueFile": "OnsiteExceptionAlert.vue",
      "fields": [
        {
          "name": "exportFormat",
          "label": "导出格式",
          "type": "select",
          "required": true,
          "description": "支持Excel（.xlsx）和PDF格式"
        },
        {
          "name": "exportScope",
          "label": "导出内容范围",
          "type": "radio",
          "required": true,
          "description": "选择导出全部报表或仅导出指定指标"
        },
        {
          "name": "selectedIndicators",
          "label": "指定指标",
          "type": "multi-select",
          "required": false,
          "description": "当导出范围选择'指定指标'时，可选择需要导出的具体指标列表"
        }
      ],
      "actions": [
        {
          "label": "导出",
          "trigger": "click导出按钮",
          "feedback": "校验必填字段，若通过则调用导出API；成功时自动下载文件并记录日志，显示成功提示；失败时显示错误信息"
        }
      ],
      "validations": [
        "导出格式为必选",
        "当导出范围选择'指定指标'时，至少选择一个指标"
      ],
      "states": {
        "empty": {
          "description": "页面初始加载，无导出操作进行"
        },
        "loading": {
          "description": "导出请求已发送，等待服务端响应"
        },
        "success": {
          "description": "导出成功，文件已开始下载，日志已记录"
        },
        "error": {
          "description": "导出失败，页面展示错误详情"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-0-scenario-1782887819107-0-page-4-3",
        "priority": "P1",
        "type": "辅助页",
        "name": "现场异常告警处理",
        "vueFile": "OnsiteExceptionAlert.vue",
        "goal": "实时接收车辆异常告警（超速、禁入区域、异常停留、未授权入场等），支持调度员查看详情、处理告警、标记解决",
        "features": [
          "异常告警列表实时刷新",
          "显示告警类型",
          "车辆",
          "时间",
          "位置",
          "点击告警可在地图上定位车辆并查看详情",
          "支持处理告警：确认",
          "忽略",
          "通知相关人员",
          "告警历史记录查询与导出"
        ],
        "featureText": "异常告警列表实时刷新，显示告警类型、车辆、时间、位置、点击告警可在地图上定位车辆并查看详情、支持处理告警：确认、忽略、通知相关人员、告警历史记录查询与导出",
        "sections": [
          "告警实时列表区域",
          "告警详情与处理区域",
          "历史告警查询区域"
        ],
        "scenarioKey": "scenario-1782887819107-0",
        "scenarioName": "调度员现场调度",
        "originalPageKey": "scenario-1782887819107-0-page-4"
      },
      "generatedAt": "2026-07-01T07:45:55.971Z"
    },
    "scenario-1782887819107-1-scenario-1782887819107-1-page-1-0": {
      "key": "scenario-1782887819107-1-scenario-1782887819107-1-page-1-0",
      "name": "任务列表",
      "vueFile": "TaskListView.vue",
      "fields": [
        {
          "name": "statusFilter",
          "label": "任务状态筛选",
          "type": "select",
          "required": false,
          "description": "按任务状态（待接单、进行中、已完成）筛选列表"
        },
        {
          "name": "taskId",
          "label": "任务编号",
          "type": "text",
          "required": false,
          "description": "任务唯一标识号，展示在任务卡片中"
        },
        {
          "name": "workPoint",
          "label": "作业点",
          "type": "text",
          "required": false,
          "description": "任务作业地点名称"
        },
        {
          "name": "requiredTime",
          "label": "要求时间",
          "type": "text",
          "required": false,
          "description": "任务要求完成或到达的时间"
        },
        {
          "name": "taskStatus",
          "label": "任务状态",
          "type": "text",
          "required": false,
          "description": "当前任务状态（待接单、进行中、已完成）"
        }
      ],
      "actions": [
        {
          "label": "下拉刷新",
          "trigger": "用户下拉页面",
          "feedback": "重新加载任务列表数据"
        },
        {
          "label": "分页加载",
          "trigger": "滚动至列表底部",
          "feedback": "加载更多历史任务"
        },
        {
          "label": "点击任务项",
          "trigger": "点击任务卡片",
          "feedback": "跳转至任务详情页（TaskDetailView.vue）"
        },
        {
          "label": "接收通知",
          "trigger": "服务端推送或轮询",
          "feedback": "显示未读标记并更新任务列表"
        }
      ],
      "validations": [
        "任务列表 的关键筛选或处理字段不能为空。",
        "提交前校验状态流转是否合法，并给出明确错误提示。"
      ],
      "states": {
        "empty": "暂无任务，请等待新任务通知",
        "loading": "正在加载任务列表，显示骨架屏或加载动画",
        "success": "正常显示任务列表",
        "error": "加载失败，显示错误提示及重试按钮"
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-1-scenario-1782887819107-1-page-1-0",
        "priority": "P0",
        "type": "工作台页",
        "name": "任务列表",
        "vueFile": "TaskListView.vue",
        "goal": "司机查看个人任务列表，接收新任务通知，筛选和查看不同状态的任务",
        "features": [
          "接收任务通知并显示未读标记",
          "按状态（待接单",
          "进行中",
          "已完成）筛选任务",
          "显示任务摘要信息（任务编号",
          "作业点",
          "要求时间）",
          "支持下拉刷新和分页加载"
        ],
        "featureText": "接收任务通知并显示未读标记、按状态（待接单、进行中、已完成）筛选任务、显示任务摘要信息（任务编号、作业点、要求时间）、支持下拉刷新和分页加载",
        "sections": [
          "任务通知区域",
          "任务状态筛选区域",
          "任务列表展示区域"
        ],
        "scenarioKey": "scenario-1782887819107-1",
        "scenarioName": "司机任务执行",
        "originalPageKey": "scenario-1782887819107-1-page-1"
      },
      "generatedAt": "2026-07-01T07:33:39.817Z"
    },
    "scenario-1782887819107-1-scenario-1782887819107-1-page-2-1": {
      "key": "scenario-1782887819107-1-scenario-1782887819107-1-page-2-1",
      "name": "任务详情",
      "vueFile": "TaskDetailView.vue",
      "fields": [
        {
          "name": "taskId",
          "label": "任务编号",
          "type": "text",
          "required": false,
          "description": "任务唯一标识"
        },
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "text",
          "required": false,
          "description": "车辆类型，如平板车、叉车等"
        },
        {
          "name": "plateNumber",
          "label": "车牌号",
          "type": "text",
          "required": false,
          "description": "车辆牌照号码"
        },
        {
          "name": "driverName",
          "label": "司机姓名",
          "type": "text",
          "required": false,
          "description": "司机姓名"
        },
        {
          "name": "driverPhone",
          "label": "司机电话",
          "type": "text",
          "required": false,
          "description": "司机联系电话"
        },
        {
          "name": "taskStatus",
          "label": "任务状态",
          "type": "text",
          "required": false,
          "description": "当前任务状态，如待执行、执行中、已完成"
        },
        {
          "name": "taskRequirement",
          "label": "任务要求",
          "type": "textarea",
          "required": false,
          "description": "车辆类型、物资种类、作业说明等综合描述"
        },
        {
          "name": "plannedArrivalTime",
          "label": "计划到达时间",
          "type": "datetime",
          "required": false,
          "description": "计划到达作业点的时间"
        },
        {
          "name": "plannedCompletionTime",
          "label": "计划完成时间",
          "type": "datetime",
          "required": false,
          "description": "计划完成任务的时间"
        },
        {
          "name": "siteName",
          "label": "作业点名称",
          "type": "text",
          "required": false,
          "description": "作业点名称或编号"
        },
        {
          "name": "siteAddress",
          "label": "作业点地址",
          "type": "text",
          "required": false,
          "description": "作业点详细地址"
        },
        {
          "name": "contactPerson",
          "label": "联系人",
          "type": "text",
          "required": false,
          "description": "作业点联系人姓名"
        },
        {
          "name": "contactPhone",
          "label": "联系人电话",
          "type": "text",
          "required": false,
          "description": "作业点联系人电话"
        }
      ],
      "actions": [
        {
          "label": "导航",
          "trigger": "tap",
          "feedback": "打开地图导航至作业点"
        },
        {
          "label": "联系调度员",
          "trigger": "tap",
          "feedback": "弹出联系调度员对话框，支持电话或消息"
        }
      ],
      "validations": [
        "任务详情 的关键筛选或处理字段不能为空。",
        "提交前校验状态流转是否合法，并给出明确错误提示。"
      ],
      "states": {
        "empty": "任务数据为空，请确认任务ID或刷新页面",
        "loading": "正在加载任务详情...",
        "success": "任务详情加载成功",
        "error": "加载任务详情失败，请稍后重试"
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-1-scenario-1782887819107-1-page-2-1",
        "priority": "P1",
        "type": "辅助页",
        "name": "任务详情",
        "vueFile": "TaskDetailView.vue",
        "goal": "展示任务的详细信息，包括作业点位置、任务要求、物资信息等",
        "features": [
          "展示作业点名称",
          "地址",
          "联系人信息",
          "展示任务要求（车辆类型",
          "物资种类",
          "作业说明）",
          "展示任务时间节点（计划到达时间",
          "完成时间）",
          "提供导航入口和联系调度员功能"
        ],
        "featureText": "展示作业点名称、地址、联系人信息、展示任务要求（车辆类型、物资种类、作业说明）、展示任务时间节点（计划到达时间、完成时间）、提供导航入口和联系调度员功能",
        "sections": [
          "任务基本信息区域",
          "作业点信息区域",
          "任务时间区域",
          "操作区域"
        ],
        "scenarioKey": "scenario-1782887819107-1",
        "scenarioName": "司机任务执行",
        "originalPageKey": "scenario-1782887819107-1-page-2"
      },
      "generatedAt": "2026-07-01T07:34:31.097Z"
    },
    "scenario-1782887819107-1-scenario-1782887819107-1-page-3-2": {
      "key": "scenario-1782887819107-1-scenario-1782887819107-1-page-3-2",
      "name": "导航与路径",
      "vueFile": "NavigationView.vue",
      "fields": [
        {
          "name": "currentLocation",
          "label": "当前位置",
          "type": "geocoordinate",
          "required": true,
          "description": "实时获取的司机GPS坐标"
        },
        {
          "name": "destination",
          "label": "目标作业点",
          "type": "text",
          "required": true,
          "description": "任务指定的作业点名称或地址"
        },
        {
          "name": "remainingDistance",
          "label": "剩余距离",
          "type": "text",
          "required": false,
          "description": "实时显示的距目标点距离，如'1.2km'"
        },
        {
          "name": "estimatedArrivalTime",
          "label": "预计到达时间",
          "type": "text",
          "required": false,
          "description": "实时更新的预计到达时间，如'14:25'"
        },
        {
          "name": "navigationRoute",
          "label": "导航路线",
          "type": "polyline",
          "required": true,
          "description": "地图上绘制的从当前位置到目的地的路径"
        }
      ],
      "actions": [
        {
          "label": "开始导航",
          "trigger": "onStartNavigation",
          "feedback": "切换至导航模式，开始语音引导并在地图上显示路线"
        },
        {
          "label": "暂停语音",
          "trigger": "onToggleVoice",
          "feedback": "切换语音播报开关状态，暂停或恢复语音提示"
        },
        {
          "label": "关闭导航",
          "trigger": "onStopNavigation",
          "feedback": "退出导航视图，返回任务详情页"
        },
        {
          "label": "确认到达",
          "trigger": "onArrivalConfirm",
          "feedback": "弹出确认对话框，用户确认后标记任务状态为到达并记录时间"
        }
      ],
      "validations": [
        "GPS定位权限未开启，请前往设置开启位置服务",
        "导航目的地未指定，请先关联有效的作业点",
        "网络信号弱，地图加载可能延迟"
      ],
      "states": {
        "empty": {
          "description": "未开始导航，显示当前位置标记和任务作业点标记",
          "mockup": "页面显示地图，等待用户点击开始导航"
        },
        "loading": {
          "description": "正在计算路径或加载地图数据",
          "mockup": "地图区域显示加载动画，文字提示'正在获取导航路径…'"
        },
        "success": {
          "description": "导航进行中，实时显示路线、剩余距离和预计到达时间",
          "mockup": "地图高亮显示路径，底部栏显示距离和时间，语音播报正常"
        },
        "error": {
          "description": "定位失败或网络中断，无法获取导航信息",
          "mockup": "弹窗提示错误原因，并提供重试按钮"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-1-scenario-1782887819107-1-page-3-2",
        "priority": "P1",
        "type": "辅助页",
        "name": "导航与路径",
        "vueFile": "NavigationView.vue",
        "goal": "从司机当前位置导航至指定作业点，实时显示路径和预计到达时间",
        "features": [
          "获取司机当前位置并计算到作业点的最优路径",
          "显示导航路线",
          "距离和预计到达时间",
          "支持语音导航和路线偏离提醒",
          "到达作业点附近时自动触发到达确认提示"
        ],
        "featureText": "获取司机当前位置并计算到作业点的最优路径、显示导航路线、距离和预计到达时间、支持语音导航和路线偏离提醒、到达作业点附近时自动触发到达确认提示",
        "sections": [
          "地图显示区域",
          "导航信息区域",
          "操作与提示区域"
        ],
        "scenarioKey": "scenario-1782887819107-1",
        "scenarioName": "司机任务执行",
        "originalPageKey": "scenario-1782887819107-1-page-3"
      },
      "generatedAt": "2026-07-01T07:34:43.834Z"
    },
    "scenario-1782887819107-1-scenario-1782887819107-1-page-4-3": {
      "key": "scenario-1782887819107-1-scenario-1782887819107-1-page-4-3",
      "name": "现场反馈",
      "vueFile": "SiteFeedbackView.vue",
      "fields": [
        {
          "name": "taskId",
          "label": "任务编号",
          "type": "hidden",
          "required": true,
          "description": "关联的任务ID，用于绑定反馈记录"
        },
        {
          "name": "arrivalTime",
          "label": "到达时间",
          "type": "text",
          "required": true,
          "description": "司机点击'到达确认'时自动记录的时间戳"
        },
        {
          "name": "photos",
          "label": "现场照片",
          "type": "file",
          "required": false,
          "description": "支持多张照片上传，用于记录现场情况，格式jpg/png，单张不超过5MB"
        },
        {
          "name": "remark",
          "label": "备注",
          "type": "textarea",
          "required": false,
          "description": "添加文字备注或异常说明，不超过500字符"
        }
      ],
      "actions": [
        {
          "label": "到达确认",
          "trigger": "click",
          "feedback": "记录到达时间并锁定按钮，显示成功提示'已到达'，同时禁用该按钮防止重复点击"
        },
        {
          "label": "上传照片",
          "trigger": "change",
          "feedback": "上传照片后显示缩略图预览，支持删除已上传照片；若上传失败显示错误提示"
        },
        {
          "label": "提交反馈",
          "trigger": "click",
          "feedback": "校验备注和照片后提交至后台，提交过程中按钮置为加载状态；成功后显示'反馈已提交'并自动跳转至任务列表，失败则保留输入内容显示错误信息"
        }
      ],
      "validations": [
        "到达确认必须在任务状态为'已出发'或'进行中'时执行",
        "照片格式仅支持jpg、png，单张不超过5MB",
        "备注长度不超过500字符",
        "提交反馈前必须已完成到达确认（即arrivalTime有值）"
      ],
      "states": {
        "empty": {
          "description": "页面初始加载完成时，显示任务信息（任务编号、计划到达时间等）以及'到达确认'按钮和拍照、备注组件，所有输入均为空"
        },
        "loading": {
          "description": "点击'到达确认'或'提交反馈'按钮时，对应按钮变为禁用并显示旋转加载图标，阻止用户重复操作"
        },
        "success": {
          "description": "到达确认成功：按钮变为绿色对勾并显示'已到达'文字；反馈提交成功：弹出绿色toast提示'反馈已提交'，3秒后自动返回任务列表"
        },
        "error": {
          "description": "网络异常或服务器返回错误时，在按钮下方显示红色错误提示文字，保留用户已填写的内容，允许用户修正后重试"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-1-scenario-1782887819107-1-page-4-3",
        "priority": "P1",
        "type": "辅助页",
        "name": "现场反馈",
        "vueFile": "SiteFeedbackView.vue",
        "goal": "司机在到达作业点后确认到达，并上传现场照片或备注信息",
        "features": [
          "点击'到达确认'并记录到达时间",
          "现场拍照上传（支持多张照片）",
          "添加文字备注或异常说明",
          "反馈信息与任务关联并同步至调度端"
        ],
        "featureText": "点击'到达确认'并记录到达时间、现场拍照上传（支持多张照片）、添加文字备注或异常说明、反馈信息与任务关联并同步至调度端",
        "sections": [
          "到达确认区域",
          "现场反馈与上传区域"
        ],
        "scenarioKey": "scenario-1782887819107-1",
        "scenarioName": "司机任务执行",
        "originalPageKey": "scenario-1782887819107-1-page-4"
      },
      "generatedAt": "2026-07-01T07:42:04.009Z"
    },
    "scenario-1782887819107-2-scenario-1782887819107-2-page-1-0": {
      "key": "scenario-1782887819107-2-scenario-1782887819107-2-page-1-0",
      "name": "入场核验 - 支持扫描车牌或二维码，自动核验预约与任务关联",
      "vueFile": "EntryCheckPanel.vue",
      "fields": [
        {
          "name": "plateNumber",
          "label": "车牌号",
          "type": "text",
          "required": false,
          "description": "手动输入或通过扫描识别车牌号"
        },
        {
          "name": "qrCode",
          "label": "预约二维码",
          "type": "text",
          "required": false,
          "description": "通过扫描预约二维码自动填充"
        },
        {
          "name": "scanResult",
          "label": "扫描结果",
          "type": "text",
          "required": false,
          "description": "扫描识别后的原始内容（车牌或二维码）"
        },
        {
          "name": "verificationResult",
          "label": "核验结果",
          "type": "text",
          "required": false,
          "description": "自动核验后显示的放行或拒绝信息"
        },
        {
          "name": "exceptionReason",
          "label": "异常原因",
          "type": "textarea",
          "required": false,
          "description": "核验异常时的原因描述，供手动处理参考"
        },
        {
          "name": "manualAction",
          "label": "手动操作备注",
          "type": "textarea",
          "required": false,
          "description": "人工处理异常时填写的操作备注"
        }
      ],
      "actions": [
        {
          "label": "扫描车牌/二维码",
          "trigger": "点击扫描按钮或调用摄像头扫描",
          "feedback": "识别结果填充到对应字段，触发自动核验"
        },
        {
          "label": "手动核验",
          "trigger": "填写车牌号后点击核验按钮",
          "feedback": "调用后台服务核验预约与任务关联，展示核验结果"
        },
        {
          "label": "放行",
          "trigger": "在核验通过后点击放行按钮",
          "feedback": "更新车辆入场状态，记录操作日志，跳转或刷新页面"
        },
        {
          "label": "拒绝入场",
          "trigger": "在核验未通过时点击拒绝按钮",
          "feedback": "记录拒绝原因和操作人，更新状态，显示拒绝结果"
        },
        {
          "label": "提交异常处理",
          "trigger": "在异常处理区填写备注后提交",
          "feedback": "保存异常记录，更新操作记录区，提示成功或失败"
        }
      ],
      "validations": [
        "车牌号格式校验（符合标准车牌格式）",
        "预约二维码格式校验（符合系统编码规则）",
        "扫描结果不能为空时需自动发起核验",
        "手动核验时车牌号不能为空",
        "拒绝入场时需填写拒绝原因"
      ],
      "states": {
        "empty": "无扫描输入，显示提示信息“请扫描车牌或预约二维码”",
        "loading": "正在扫描或核验中，显示加载动画或进度条",
        "success": "核验通过，显示绿色放行提示，并提供放行按钮",
        "error": "核验失败或异常，显示红色拒绝提示，并展示异常处理区"
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-2-scenario-1782887819107-2-page-1-0",
        "priority": "P1",
        "type": "工作台页",
        "name": "入场核验 - 支持扫描车牌或二维码，自动核验预约与任务关联",
        "vueFile": "EntryCheckPanel.vue",
        "goal": "支持通过扫描车牌或预约二维码，自动核验车辆预约有效性及派车任务关联，快速得出入场许可结果",
        "features": [
          "扫描车牌或预约二维码",
          "自动核验预约有效性及任务关联",
          "显示核验结果（放行/拒绝）",
          "处理核验异常并引导手动操作"
        ],
        "featureText": "扫描车牌或预约二维码、自动核验预约有效性及任务关联、显示核验结果（放行/拒绝）、处理核验异常并引导手动操作",
        "sections": [
          "扫描输入区",
          "核验结果展示区",
          "异常处理区",
          "操作记录区"
        ],
        "scenarioKey": "scenario-1782887819107-2",
        "scenarioName": "门岗入场核验",
        "originalPageKey": "scenario-1782887819107-2-page-1"
      },
      "generatedAt": "2026-07-01T07:42:22.660Z"
    },
    "scenario-1782887819107-2-scenario-1782887819107-2-page-2-1": {
      "key": "scenario-1782887819107-2-scenario-1782887819107-2-page-2-1",
      "name": "放行管理 - 管理车辆入场放行操作与记录",
      "vueFile": "ReleaseManagementPanel.vue",
      "fields": [
        {
          "name": "plateNumber",
          "label": "车牌号",
          "type": "text",
          "required": true,
          "description": "待放行车辆的车牌号，通过扫描或手动输入"
        },
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "select",
          "required": false,
          "description": "车辆类型，如生产车辆、物流车辆等"
        },
        {
          "name": "driverName",
          "label": "司机姓名",
          "type": "text",
          "required": false,
          "description": "车辆关联的司机姓名"
        },
        {
          "name": "entryTime",
          "label": "入场时间",
          "type": "datetime",
          "required": true,
          "description": "记录车辆实际入场时间"
        },
        {
          "name": "releaseAction",
          "label": "放行动作",
          "type": "radio",
          "required": true,
          "description": "选择放行或拒绝"
        },
        {
          "name": "remark",
          "label": "备注",
          "type": "textarea",
          "required": false,
          "description": "放行或拒绝的补充说明"
        }
      ],
      "actions": [
        {
          "label": "确认放行",
          "trigger": "点击放行按钮",
          "feedback": "更新车辆入场记录，关联任务状态变更为执行中，弹出成功提示"
        },
        {
          "label": "拒绝入场",
          "trigger": "点击拒绝按钮",
          "feedback": "记录拒绝原因，更新车辆状态为拒绝入场，弹出警告提示"
        },
        {
          "label": "批量放行",
          "trigger": "选择多辆车后点击批量放行",
          "feedback": "逐条更新所选车辆记录，批量更新任务状态，显示处理进度"
        },
        {
          "label": "查询车辆信息",
          "trigger": "车牌号输入完成或扫描后自动触发",
          "feedback": "自动填充车辆类型、司机、预约信息等字段"
        }
      ],
      "validations": [
        "车牌号不能为空",
        "入场时间不能为空",
        "放行动作必须选择",
        "拒绝时备注不能为空"
      ],
      "states": {
        "empty": {
          "description": "无待放行车辆时，显示空状态提示文字和刷新按钮"
        },
        "loading": {
          "description": "数据加载中，显示骨架屏或加载动画"
        },
        "success": {
          "description": "放行操作成功，显示成功提示并自动刷新列表"
        },
        "error": {
          "description": "放行操作失败，显示错误原因和重试按钮"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-2-scenario-1782887819107-2-page-2-1",
        "priority": "P1",
        "type": "辅助页",
        "name": "放行管理 - 管理车辆入场放行操作与记录",
        "vueFile": "ReleaseManagementPanel.vue",
        "goal": "根据核验结果执行放行或拒绝操作，记录放行时间、车辆信息，并更新相关任务状态",
        "features": [
          "手动确认放行或拒绝",
          "记录入场时间与车辆信息",
          "关联更新派车任务状态",
          "支持批量放行操作"
        ],
        "featureText": "手动确认放行或拒绝、记录入场时间与车辆信息、关联更新派车任务状态、支持批量放行操作",
        "sections": [
          "放行操作区",
          "车辆信息与记录区",
          "批量放行区",
          "任务状态关联区"
        ],
        "scenarioKey": "scenario-1782887819107-2",
        "scenarioName": "门岗入场核验",
        "originalPageKey": "scenario-1782887819107-2-page-2"
      },
      "generatedAt": "2026-07-01T07:43:37.654Z"
    },
    "scenario-1782887819107-2-scenario-1782887819107-2-page-3-2": {
      "key": "scenario-1782887819107-2-scenario-1782887819107-2-page-3-2",
      "name": "异常告警 - 处理入场违规与安全告警事件",
      "vueFile": "AlertPanel.vue",
      "fields": [
        {
          "name": "alertType",
          "label": "告警类型",
          "type": "select",
          "required": false,
          "description": "按告警类型筛选，如未授权入场、证照过期、异常停留等"
        },
        {
          "name": "alertStatus",
          "label": "状态",
          "type": "select",
          "required": false,
          "description": "按处理状态筛选，如待处理、已确认、已解除、已上报"
        },
        {
          "name": "timeRange",
          "label": "时间范围",
          "type": "daterange",
          "required": false,
          "description": "筛选指定时间范围内的告警"
        },
        {
          "name": "keyword",
          "label": "搜索关键词",
          "type": "text",
          "required": false,
          "description": "按车牌号、司机、备注等搜索"
        },
        {
          "name": "alertId",
          "label": "告警ID",
          "type": "text",
          "required": false,
          "description": "精确查询告警ID"
        },
        {
          "name": "remark",
          "label": "处理备注",
          "type": "textarea",
          "required": false,
          "description": "填写处理时的备注信息"
        }
      ],
      "actions": [
        {
          "label": "确认告警",
          "trigger": "点击确认按钮",
          "feedback": "更新告警状态为‘已确认’，显示确认成功提示，更新告警列表"
        },
        {
          "label": "解除告警",
          "trigger": "点击解除按钮（需确认弹窗）",
          "feedback": "更新告警状态为‘已解除’，显示解除成功提示，更新列表；若解除失败给出错误提示"
        },
        {
          "label": "上报告警",
          "trigger": "点击上报按钮",
          "feedback": "弹出上报对话框，填写上报对象和原因，提交后更新状态为‘已上报’，显示上报成功提示"
        },
        {
          "label": "查询历史告警",
          "trigger": "切换至历史告警标签或点击查询按钮",
          "feedback": "加载历史告警列表，显示查询结果；若无数据展示空状态"
        },
        {
          "label": "筛选告警",
          "trigger": "选择筛选条件或更改筛选字段",
          "feedback": "实时更新告警列表，展示符合筛选条件的告警"
        },
        {
          "label": "查看告警详情",
          "trigger": "点击告警列表项",
          "feedback": "弹出告警详情弹窗或展开详情区域，展示告警详情"
        }
      ],
      "validations": [
        "确认告警时，必须至少选择一条告警",
        "解除告警时，必须填写解除原因",
        "上报告警时，必须填写上报对象和原因",
        "时间范围开始不能大于结束"
      ],
      "states": {
        "empty": "告警列表为空，展示提示文案‘暂无告警信息’，并提供‘刷新’按钮",
        "loading": "显示加载中骨架屏或旋转加载图标",
        "success": "操作成功时展示成功提示（如Toast）",
        "error": "操作失败时展示错误提示（如错误弹窗），并保留用户输入"
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-2-scenario-1782887819107-2-page-3-2",
        "priority": "P1",
        "type": "辅助页",
        "name": "异常告警 - 处理入场违规与安全告警事件",
        "vueFile": "AlertPanel.vue",
        "goal": "实时处理未授权入场、证照过期、异常停留等告警，支持告警确认、解除与上报",
        "features": [
          "告警实时展示与分类",
          "告警处理（确认/解除/上报）",
          "告警历史查询"
        ],
        "featureText": "告警实时展示与分类、告警处理（确认/解除/上报）、告警历史查询",
        "sections": [
          "实时告警列表",
          "告警处理面板",
          "告警历史查询"
        ],
        "scenarioKey": "scenario-1782887819107-2",
        "scenarioName": "门岗入场核验",
        "originalPageKey": "scenario-1782887819107-2-page-3"
      },
      "generatedAt": "2026-07-01T07:44:02.445Z"
    },
    "scenario-1782887819107-2-scenario-1782887819107-2-page-4-3": {
      "key": "scenario-1782887819107-2-scenario-1782887819107-2-page-4-3",
      "name": "放行记录查询 - 追溯车辆入场放行历史数据",
      "vueFile": "ReleaseRecordQueryView.vue",
      "fields": [
        {
          "name": "startTime",
          "label": "开始时间",
          "type": "datetime",
          "required": true,
          "description": "查询起始时间"
        },
        {
          "name": "endTime",
          "label": "结束时间",
          "type": "datetime",
          "required": true,
          "description": "查询结束时间"
        },
        {
          "name": "plateNumber",
          "label": "车牌号",
          "type": "text",
          "required": false,
          "description": "模糊查询车牌号"
        },
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "select",
          "required": false,
          "description": "选择车辆类型，如生产车辆、物流车辆、外协车辆、临时车辆"
        },
        {
          "name": "entryResult",
          "label": "入场结果",
          "type": "select",
          "required": false,
          "description": "选择放行结果：放行、拒绝、异常"
        }
      ],
      "actions": [
        {
          "label": "查询",
          "trigger": "点击查询按钮",
          "feedback": "发送请求，加载数据列表，若参数校验失败提示错误；成功则刷新列表并更新状态"
        },
        {
          "label": "重置",
          "trigger": "点击重置按钮",
          "feedback": "清空所有查询条件，恢复默认值，并自动触发查询"
        },
        {
          "label": "导出",
          "trigger": "点击导出按钮",
          "feedback": "弹出导出文件格式选择（Excel/CSV），确认后下载文件，显示进度提示"
        },
        {
          "label": "查看详情",
          "trigger": "点击列表中的某条记录的查看操作",
          "feedback": "打开详情查看区或弹窗，显示完整放行记录信息，包括核验详情、放行凭证等"
        }
      ],
      "validations": [
        "开始时间不能晚于结束时间",
        "时间范围跨度不能超过90天",
        "车牌号输入长度不超过20个字符",
        "车辆类型和入场结果选择有效枚举值"
      ],
      "states": {
        "empty": {
          "description": "无查询结果时，显示空状态提示：暂无放行记录，请调整查询条件",
          "components": [
            "EmptyStatePlaceholder.vue"
          ]
        },
        "loading": {
          "description": "数据加载中，显示骨架屏或加载指示器，禁用查询按钮",
          "components": [
            "LoadingSpinner.vue"
          ]
        },
        "success": {
          "description": "查询成功，正常显示数据列表，支持分页、排序",
          "components": [
            "DataTable.vue",
            "Pagination.vue"
          ]
        },
        "error": {
          "description": "请求失败时，显示错误提示信息，提供重试按钮",
          "components": [
            "ErrorStatePlaceholder.vue"
          ]
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-2-scenario-1782887819107-2-page-4-3",
        "priority": "P1",
        "type": "辅助页",
        "name": "放行记录查询 - 追溯车辆入场放行历史数据",
        "vueFile": "ReleaseRecordQueryView.vue",
        "goal": "按时间、车牌、车辆类型等条件检索放行记录，查看核验详情，支持导出用于审计追溯",
        "features": [
          "多条件组合查询放行记录",
          "查看核验详情与放行凭证",
          "导出记录报表"
        ],
        "featureText": "多条件组合查询放行记录、查看核验详情与放行凭证、导出记录报表",
        "sections": [
          "查询条件区",
          "数据列表区",
          "详情查看区",
          "导出操作区"
        ],
        "scenarioKey": "scenario-1782887819107-2",
        "scenarioName": "门岗入场核验",
        "originalPageKey": "scenario-1782887819107-2-page-4"
      },
      "generatedAt": "2026-07-01T07:44:13.954Z"
    },
    "scenario-1782887819107-3-scenario-1782887819107-3-page-1-0": {
      "key": "scenario-1782887819107-3-scenario-1782887819107-3-page-1-0",
      "name": "车辆运营报表分析",
      "vueFile": "StatisticsAnalysisView.vue",
      "fields": [
        {
          "name": "startDate",
          "label": "开始日期",
          "type": "date",
          "required": true,
          "description": "统计周期的开始日期"
        },
        {
          "name": "endDate",
          "label": "结束日期",
          "type": "date",
          "required": true,
          "description": "统计周期的结束日期"
        }
      ],
      "actions": [
        {
          "label": "查询",
          "trigger": "点击查询按钮",
          "feedback": "刷新图表和列表数据，显示加载状态"
        },
        {
          "label": "导出报表",
          "trigger": "点击导出按钮",
          "feedback": "根据当前筛选条件生成并下载报表文件（PDF或图片）"
        },
        {
          "label": "查看详情",
          "trigger": "点击图表或表格中的某一行",
          "feedback": "弹出详情弹窗或跳转到明细页面"
        }
      ],
      "validations": [
        "开始日期不能为空",
        "结束日期不能为空",
        "开始日期不能晚于结束日期"
      ],
      "states": {
        "empty": "当前筛选条件下无数据，显示空状态提示",
        "loading": "数据加载中，显示加载动画",
        "success": "数据加载成功，显示图表和列表",
        "error": "数据加载失败，显示错误提示和重试按钮"
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-3-scenario-1782887819107-3-page-1-0",
        "priority": "P1",
        "type": "工作台页",
        "name": "车辆运营报表分析",
        "vueFile": "StatisticsAnalysisView.vue",
        "goal": "提供车辆利用率、任务完成率、平均等待时长、空驶率、排队情况、外协车辆使用次数、异常入场记录等核心统计指标的图表展示与分析功能",
        "features": [
          "按时间范围筛选报表数据",
          "展示车辆利用率趋势图",
          "展示任务完成率与平均等待时长图表",
          "展示空驶率与排队统计图表",
          "展示外协车辆使用次数与异常记录列表",
          "支持图表导出为图片或PDF"
        ],
        "featureText": "按时间范围筛选报表数据、展示车辆利用率趋势图、展示任务完成率与平均等待时长图表、展示空驶率与排队统计图表、展示外协车辆使用次数与异常记录列表、支持图表导出为图片或PDF",
        "sections": [
          "筛选区域",
          "核心指标概览",
          "统计分析图表",
          "外协车辆与异常记录列表"
        ],
        "scenarioKey": "scenario-1782887819107-3",
        "scenarioName": "管理人员报表分析",
        "originalPageKey": "scenario-1782887819107-3-page-1"
      },
      "generatedAt": "2026-07-01T07:45:18.046Z"
    },
    "scenario-1782887819107-3-scenario-1782887819107-3-page-2-1": {
      "key": "scenario-1782887819107-3-scenario-1782887819107-3-page-2-1",
      "name": "报表数据导出",
      "vueFile": "ReportExportView.vue",
      "fields": [
        {
          "name": "exportFormat",
          "label": "导出格式",
          "type": "radio",
          "required": true,
          "description": "选择导出文件的格式，支持Excel和PDF"
        },
        {
          "name": "exportScope",
          "label": "导出内容范围",
          "type": "checkbox",
          "required": true,
          "description": "选择需要导出的指标或报表，可多选或选择全部"
        },
        {
          "name": "exportDateRange",
          "label": "数据时间范围",
          "type": "dateRange",
          "required": false,
          "description": "限定导出数据所属的时间区间，可选"
        }
      ],
      "actions": [
        {
          "label": "导出",
          "trigger": "点击导出按钮",
          "feedback": "显示加载状态；导出成功后提示下载链接或直接下载；失败时提示错误信息并记录日志"
        },
        {
          "label": "重置",
          "trigger": "点击重置按钮",
          "feedback": "清空所有已选配置项，恢复默认状态"
        }
      ],
      "validations": [
        "导出格式必须选择且至少选中一项",
        "导出内容范围至少选择一个指标或报表",
        "若选择指定日期范围，开始日期不能晚于结束日期"
      ],
      "states": {
        "empty": "页面初始无导出记录日志，日志区域显示“暂无导出记录”占位提示",
        "loading": "点击导出后，导出按钮显示加载动画并禁用，同时日志区域新增一条“导出中”临时记录",
        "success": "导出成功，按钮恢复可用，日志区域生成成功记录（含文件名称、时间、格式等），并提供文件下载入口",
        "error": "导出失败，按钮恢复可用，日志区域生成失败记录（含错误描述），并显示错误提示消息"
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-3-scenario-1782887819107-3-page-2-1",
        "priority": "P1",
        "type": "辅助页",
        "name": "报表数据导出",
        "vueFile": "ReportExportView.vue",
        "goal": "支持将统计分析结果导出为Excel、PDF等格式，便于管理人员存档、分发和进一步分析",
        "features": [
          "选择导出格式（Excel/PDF）",
          "选择导出内容范围（全部报表/指定指标）",
          "一键导出并下载文件",
          "导出记录日志与审计追踪"
        ],
        "featureText": "选择导出格式（Excel/PDF）、选择导出内容范围（全部报表/指定指标）、一键导出并下载文件、导出记录日志与审计追踪",
        "sections": [
          "导出配置区域",
          "导出操作区域",
          "导出记录日志区域"
        ],
        "scenarioKey": "scenario-1782887819107-3",
        "scenarioName": "管理人员报表分析",
        "originalPageKey": "scenario-1782887819107-3-page-2"
      },
      "generatedAt": "2026-07-01T08:24:18.900Z"
    },
    "scenario-1782887819107-3-scenario-1782887819107-3-page-3-2": {
      "key": "scenario-1782887819107-3-scenario-1782887819107-3-page-3-2",
      "name": "资源配置优化建议",
      "vueFile": "ResourceAllocationView.vue",
      "fields": [
        {
          "name": "dateRange",
          "label": "时间范围",
          "type": "daterange",
          "required": true,
          "description": "选择分析的时间范围，支持预设（近7天、近30天、自定义）"
        },
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "select",
          "required": false,
          "description": "筛选特定车辆类型（生产车辆、物流车辆、外协车辆、临时车辆）"
        },
        {
          "name": "area",
          "label": "区域",
          "type": "select",
          "required": false,
          "description": "筛选作业区域"
        }
      ],
      "actions": [
        {
          "label": "查询分析",
          "trigger": "click",
          "feedback": "加载数据后刷新热点图、推荐列表、费用汇总等区域"
        },
        {
          "label": "导出优化报告",
          "trigger": "click",
          "feedback": "生成PDF或Excel报告并下载"
        },
        {
          "label": "预览优化报告",
          "trigger": "click",
          "feedback": "打开新窗口或弹窗展示报告预览"
        }
      ],
      "validations": [
        "时间范围为必填项",
        "时间范围结束日期不能早于开始日期",
        "时间范围跨度不能超过一年"
      ],
      "states": {
        "empty": {
          "description": "无筛选结果时的空状态显示，提示用户调整筛选条件"
        },
        "loading": {
          "description": "数据加载中的状态，显示加载动画"
        },
        "success": {
          "description": "数据加载成功后的状态，正常展示各区域内容"
        },
        "error": {
          "description": "数据加载失败时的状态，显示错误提示和重试按钮"
        }
      },
      "sourcePageDesign": {
        "key": "scenario-1782887819107-3-scenario-1782887819107-3-page-3-2",
        "priority": "P1",
        "type": "辅助页",
        "name": "资源配置优化建议",
        "vueFile": "ResourceAllocationView.vue",
        "goal": "基于历史数据与当前车辆使用情况，提供车辆资源配置优化建议和外协车辆费用管理参考",
        "features": [
          "分析车辆使用热点与瓶颈区域",
          "推荐车辆增减数量与类型调整",
          "展示外协车辆费用汇总与趋势",
          "提供资源配置优化报告预览"
        ],
        "featureText": "分析车辆使用热点与瓶颈区域、推荐车辆增减数量与类型调整、展示外协车辆费用汇总与趋势、提供资源配置优化报告预览",
        "sections": [
          "筛选与时间范围区域",
          "热点与瓶颈分析区域",
          "资源配置推荐区域",
          "外协费用汇总区域",
          "优化报告预览区域"
        ],
        "scenarioKey": "scenario-1782887819107-3",
        "scenarioName": "管理人员报表分析",
        "originalPageKey": "scenario-1782887819107-3-page-3"
      },
      "generatedAt": "2026-07-01T08:24:44.726Z"
    }
  },
  "scenarioPageGroups": [
    {
      "key": "scenario-1782887819107-0",
      "name": "调度员现场调度",
      "priority": "P0",
      "pageCount": 4,
      "pages": [
        {
          "key": "scenario-1782887819107-0-scenario-1782887819107-0-page-1-0",
          "priority": "P0",
          "type": "工作台页",
          "name": "现场调度地图监控",
          "vueFile": "DispatchMapView.vue",
          "goal": "基于地图看板实时展示所有车辆的位置、状态（空闲、排队、任务中、异常）、作业区域，支持缩放、点击查看车辆详情",
          "features": [
            "实时车辆位置标注与状态颜色区分",
            "点击车辆弹出详情窗口：车牌",
            "司机",
            "任务",
            "状态",
            "地图图层切换：作业区域",
            "禁入区域",
            "排队区域",
            "车辆轨迹回放（可选）"
          ],
          "featureText": "实时车辆位置标注与状态颜色区分、点击车辆弹出详情窗口：车牌、司机、任务、状态、地图图层切换：作业区域、禁入区域、排队区域、车辆轨迹回放（可选）",
          "sections": [
            "地图主区域",
            "车辆状态筛选与任务派发控制面板",
            "异常告警通知区域"
          ],
          "scenarioKey": "scenario-1782887819107-0",
          "scenarioName": "调度员现场调度",
          "originalPageKey": "scenario-1782887819107-0-page-1"
        },
        {
          "key": "scenario-1782887819107-0-scenario-1782887819107-0-page-2-1",
          "priority": "P1",
          "type": "辅助页",
          "name": "现场车辆快速筛选",
          "vueFile": "OnsiteVehicleFilter.vue",
          "goal": "支持按车辆类型、状态（空闲/排队/任务中）、作业区域、距离远近等条件筛选车辆，便于调度员快速定位合适车辆",
          "features": [
            "多条件组合筛选：车辆类型（生产车/物流车/外协车/临时车）",
            "状态",
            "区域",
            "筛选结果在地图上高亮显示",
            "列表视图展示筛选结果",
            "支持排序",
            "一键重置筛选条件"
          ],
          "featureText": "多条件组合筛选：车辆类型（生产车/物流车/外协车/临时车）、状态、区域、筛选结果在地图上高亮显示、列表视图展示筛选结果，支持排序、一键重置筛选条件",
          "sections": [
            "筛选条件面板",
            "筛选结果展示区（地图/列表）",
            "快捷操作栏"
          ],
          "scenarioKey": "scenario-1782887819107-0",
          "scenarioName": "调度员现场调度",
          "originalPageKey": "scenario-1782887819107-0-page-2"
        },
        {
          "key": "scenario-1782887819107-0-scenario-1782887819107-0-page-3-2",
          "priority": "P1",
          "type": "辅助页",
          "name": "现场派车",
          "vueFile": "OnsiteDispatchDialog.vue",
          "goal": "调度员为选中的车辆分配任务，支持选择用车申请、输入作业点、选择优先级，并一键下发至司机移动端",
          "features": [
            "显示待派发的用车申请列表",
            "选择目标车辆后",
            "匹配任务并确认派发",
            "支持紧急派车（跳过申请手动创建任务）",
            "派发成功后推送通知至司机端",
            "记录派发日志（操作人",
            "时间",
            "车辆",
            "任务）"
          ],
          "featureText": "显示待派发的用车申请列表、选择目标车辆后，匹配任务并确认派发、支持紧急派车（跳过申请手动创建任务）、派发成功后推送通知至司机端、记录派发日志（操作人、时间、车辆、任务）",
          "sections": [
            "待派发用车申请列表",
            "车辆选择与任务匹配",
            "派发参数配置",
            "派发操作与日志"
          ],
          "scenarioKey": "scenario-1782887819107-0",
          "scenarioName": "调度员现场调度",
          "originalPageKey": "scenario-1782887819107-0-page-3"
        },
        {
          "key": "scenario-1782887819107-0-scenario-1782887819107-0-page-4-3",
          "priority": "P1",
          "type": "辅助页",
          "name": "现场异常告警处理",
          "vueFile": "OnsiteExceptionAlert.vue",
          "goal": "实时接收车辆异常告警（超速、禁入区域、异常停留、未授权入场等），支持调度员查看详情、处理告警、标记解决",
          "features": [
            "异常告警列表实时刷新",
            "显示告警类型",
            "车辆",
            "时间",
            "位置",
            "点击告警可在地图上定位车辆并查看详情",
            "支持处理告警：确认",
            "忽略",
            "通知相关人员",
            "告警历史记录查询与导出"
          ],
          "featureText": "异常告警列表实时刷新，显示告警类型、车辆、时间、位置、点击告警可在地图上定位车辆并查看详情、支持处理告警：确认、忽略、通知相关人员、告警历史记录查询与导出",
          "sections": [
            "告警实时列表区域",
            "告警详情与处理区域",
            "历史告警查询区域"
          ],
          "scenarioKey": "scenario-1782887819107-0",
          "scenarioName": "调度员现场调度",
          "originalPageKey": "scenario-1782887819107-0-page-4"
        }
      ]
    },
    {
      "key": "scenario-1782887819107-1",
      "name": "司机任务执行",
      "priority": "P0",
      "pageCount": 4,
      "pages": [
        {
          "key": "scenario-1782887819107-1-scenario-1782887819107-1-page-1-0",
          "priority": "P0",
          "type": "工作台页",
          "name": "任务列表",
          "vueFile": "TaskListView.vue",
          "goal": "司机查看个人任务列表，接收新任务通知，筛选和查看不同状态的任务",
          "features": [
            "接收任务通知并显示未读标记",
            "按状态（待接单",
            "进行中",
            "已完成）筛选任务",
            "显示任务摘要信息（任务编号",
            "作业点",
            "要求时间）",
            "支持下拉刷新和分页加载"
          ],
          "featureText": "接收任务通知并显示未读标记、按状态（待接单、进行中、已完成）筛选任务、显示任务摘要信息（任务编号、作业点、要求时间）、支持下拉刷新和分页加载",
          "sections": [
            "任务通知区域",
            "任务状态筛选区域",
            "任务列表展示区域"
          ],
          "scenarioKey": "scenario-1782887819107-1",
          "scenarioName": "司机任务执行",
          "originalPageKey": "scenario-1782887819107-1-page-1"
        },
        {
          "key": "scenario-1782887819107-1-scenario-1782887819107-1-page-2-1",
          "priority": "P1",
          "type": "辅助页",
          "name": "任务详情",
          "vueFile": "TaskDetailView.vue",
          "goal": "展示任务的详细信息，包括作业点位置、任务要求、物资信息等",
          "features": [
            "展示作业点名称",
            "地址",
            "联系人信息",
            "展示任务要求（车辆类型",
            "物资种类",
            "作业说明）",
            "展示任务时间节点（计划到达时间",
            "完成时间）",
            "提供导航入口和联系调度员功能"
          ],
          "featureText": "展示作业点名称、地址、联系人信息、展示任务要求（车辆类型、物资种类、作业说明）、展示任务时间节点（计划到达时间、完成时间）、提供导航入口和联系调度员功能",
          "sections": [
            "任务基本信息区域",
            "作业点信息区域",
            "任务时间区域",
            "操作区域"
          ],
          "scenarioKey": "scenario-1782887819107-1",
          "scenarioName": "司机任务执行",
          "originalPageKey": "scenario-1782887819107-1-page-2"
        },
        {
          "key": "scenario-1782887819107-1-scenario-1782887819107-1-page-3-2",
          "priority": "P1",
          "type": "辅助页",
          "name": "导航与路径",
          "vueFile": "NavigationView.vue",
          "goal": "从司机当前位置导航至指定作业点，实时显示路径和预计到达时间",
          "features": [
            "获取司机当前位置并计算到作业点的最优路径",
            "显示导航路线",
            "距离和预计到达时间",
            "支持语音导航和路线偏离提醒",
            "到达作业点附近时自动触发到达确认提示"
          ],
          "featureText": "获取司机当前位置并计算到作业点的最优路径、显示导航路线、距离和预计到达时间、支持语音导航和路线偏离提醒、到达作业点附近时自动触发到达确认提示",
          "sections": [
            "地图显示区域",
            "导航信息区域",
            "操作与提示区域"
          ],
          "scenarioKey": "scenario-1782887819107-1",
          "scenarioName": "司机任务执行",
          "originalPageKey": "scenario-1782887819107-1-page-3"
        },
        {
          "key": "scenario-1782887819107-1-scenario-1782887819107-1-page-4-3",
          "priority": "P1",
          "type": "辅助页",
          "name": "现场反馈",
          "vueFile": "SiteFeedbackView.vue",
          "goal": "司机在到达作业点后确认到达，并上传现场照片或备注信息",
          "features": [
            "点击'到达确认'并记录到达时间",
            "现场拍照上传（支持多张照片）",
            "添加文字备注或异常说明",
            "反馈信息与任务关联并同步至调度端"
          ],
          "featureText": "点击'到达确认'并记录到达时间、现场拍照上传（支持多张照片）、添加文字备注或异常说明、反馈信息与任务关联并同步至调度端",
          "sections": [
            "到达确认区域",
            "现场反馈与上传区域"
          ],
          "scenarioKey": "scenario-1782887819107-1",
          "scenarioName": "司机任务执行",
          "originalPageKey": "scenario-1782887819107-1-page-4"
        }
      ]
    },
    {
      "key": "scenario-1782887819107-2",
      "name": "门岗入场核验",
      "priority": "P1",
      "pageCount": 4,
      "pages": [
        {
          "key": "scenario-1782887819107-2-scenario-1782887819107-2-page-1-0",
          "priority": "P1",
          "type": "工作台页",
          "name": "入场核验 - 支持扫描车牌或二维码，自动核验预约与任务关联",
          "vueFile": "EntryCheckPanel.vue",
          "goal": "支持通过扫描车牌或预约二维码，自动核验车辆预约有效性及派车任务关联，快速得出入场许可结果",
          "features": [
            "扫描车牌或预约二维码",
            "自动核验预约有效性及任务关联",
            "显示核验结果（放行/拒绝）",
            "处理核验异常并引导手动操作"
          ],
          "featureText": "扫描车牌或预约二维码、自动核验预约有效性及任务关联、显示核验结果（放行/拒绝）、处理核验异常并引导手动操作",
          "sections": [
            "扫描输入区",
            "核验结果展示区",
            "异常处理区",
            "操作记录区"
          ],
          "scenarioKey": "scenario-1782887819107-2",
          "scenarioName": "门岗入场核验",
          "originalPageKey": "scenario-1782887819107-2-page-1"
        },
        {
          "key": "scenario-1782887819107-2-scenario-1782887819107-2-page-2-1",
          "priority": "P1",
          "type": "辅助页",
          "name": "放行管理 - 管理车辆入场放行操作与记录",
          "vueFile": "ReleaseManagementPanel.vue",
          "goal": "根据核验结果执行放行或拒绝操作，记录放行时间、车辆信息，并更新相关任务状态",
          "features": [
            "手动确认放行或拒绝",
            "记录入场时间与车辆信息",
            "关联更新派车任务状态",
            "支持批量放行操作"
          ],
          "featureText": "手动确认放行或拒绝、记录入场时间与车辆信息、关联更新派车任务状态、支持批量放行操作",
          "sections": [
            "放行操作区",
            "车辆信息与记录区",
            "批量放行区",
            "任务状态关联区"
          ],
          "scenarioKey": "scenario-1782887819107-2",
          "scenarioName": "门岗入场核验",
          "originalPageKey": "scenario-1782887819107-2-page-2"
        },
        {
          "key": "scenario-1782887819107-2-scenario-1782887819107-2-page-3-2",
          "priority": "P1",
          "type": "辅助页",
          "name": "异常告警 - 处理入场违规与安全告警事件",
          "vueFile": "AlertPanel.vue",
          "goal": "实时处理未授权入场、证照过期、异常停留等告警，支持告警确认、解除与上报",
          "features": [
            "告警实时展示与分类",
            "告警处理（确认/解除/上报）",
            "告警历史查询"
          ],
          "featureText": "告警实时展示与分类、告警处理（确认/解除/上报）、告警历史查询",
          "sections": [
            "实时告警列表",
            "告警处理面板",
            "告警历史查询"
          ],
          "scenarioKey": "scenario-1782887819107-2",
          "scenarioName": "门岗入场核验",
          "originalPageKey": "scenario-1782887819107-2-page-3"
        },
        {
          "key": "scenario-1782887819107-2-scenario-1782887819107-2-page-4-3",
          "priority": "P1",
          "type": "辅助页",
          "name": "放行记录查询 - 追溯车辆入场放行历史数据",
          "vueFile": "ReleaseRecordQueryView.vue",
          "goal": "按时间、车牌、车辆类型等条件检索放行记录，查看核验详情，支持导出用于审计追溯",
          "features": [
            "多条件组合查询放行记录",
            "查看核验详情与放行凭证",
            "导出记录报表"
          ],
          "featureText": "多条件组合查询放行记录、查看核验详情与放行凭证、导出记录报表",
          "sections": [
            "查询条件区",
            "数据列表区",
            "详情查看区",
            "导出操作区"
          ],
          "scenarioKey": "scenario-1782887819107-2",
          "scenarioName": "门岗入场核验",
          "originalPageKey": "scenario-1782887819107-2-page-4"
        }
      ]
    },
    {
      "key": "scenario-1782887819107-3",
      "name": "管理人员报表分析",
      "priority": "P1",
      "pageCount": 3,
      "pages": [
        {
          "key": "scenario-1782887819107-3-scenario-1782887819107-3-page-1-0",
          "priority": "P1",
          "type": "工作台页",
          "name": "车辆运营报表分析",
          "vueFile": "StatisticsAnalysisView.vue",
          "goal": "提供车辆利用率、任务完成率、平均等待时长、空驶率、排队情况、外协车辆使用次数、异常入场记录等核心统计指标的图表展示与分析功能",
          "features": [
            "按时间范围筛选报表数据",
            "展示车辆利用率趋势图",
            "展示任务完成率与平均等待时长图表",
            "展示空驶率与排队统计图表",
            "展示外协车辆使用次数与异常记录列表",
            "支持图表导出为图片或PDF"
          ],
          "featureText": "按时间范围筛选报表数据、展示车辆利用率趋势图、展示任务完成率与平均等待时长图表、展示空驶率与排队统计图表、展示外协车辆使用次数与异常记录列表、支持图表导出为图片或PDF",
          "sections": [
            "筛选区域",
            "核心指标概览",
            "统计分析图表",
            "外协车辆与异常记录列表"
          ],
          "scenarioKey": "scenario-1782887819107-3",
          "scenarioName": "管理人员报表分析",
          "originalPageKey": "scenario-1782887819107-3-page-1"
        },
        {
          "key": "scenario-1782887819107-3-scenario-1782887819107-3-page-2-1",
          "priority": "P1",
          "type": "辅助页",
          "name": "报表数据导出",
          "vueFile": "ReportExportView.vue",
          "goal": "支持将统计分析结果导出为Excel、PDF等格式，便于管理人员存档、分发和进一步分析",
          "features": [
            "选择导出格式（Excel/PDF）",
            "选择导出内容范围（全部报表/指定指标）",
            "一键导出并下载文件",
            "导出记录日志与审计追踪"
          ],
          "featureText": "选择导出格式（Excel/PDF）、选择导出内容范围（全部报表/指定指标）、一键导出并下载文件、导出记录日志与审计追踪",
          "sections": [
            "导出配置区域",
            "导出操作区域",
            "导出记录日志区域"
          ],
          "scenarioKey": "scenario-1782887819107-3",
          "scenarioName": "管理人员报表分析",
          "originalPageKey": "scenario-1782887819107-3-page-2"
        },
        {
          "key": "scenario-1782887819107-3-scenario-1782887819107-3-page-3-2",
          "priority": "P1",
          "type": "辅助页",
          "name": "资源配置优化建议",
          "vueFile": "ResourceAllocationView.vue",
          "goal": "基于历史数据与当前车辆使用情况，提供车辆资源配置优化建议和外协车辆费用管理参考",
          "features": [
            "分析车辆使用热点与瓶颈区域",
            "推荐车辆增减数量与类型调整",
            "展示外协车辆费用汇总与趋势",
            "提供资源配置优化报告预览"
          ],
          "featureText": "分析车辆使用热点与瓶颈区域、推荐车辆增减数量与类型调整、展示外协车辆费用汇总与趋势、提供资源配置优化报告预览",
          "sections": [
            "筛选与时间范围区域",
            "热点与瓶颈分析区域",
            "资源配置推荐区域",
            "外协费用汇总区域",
            "优化报告预览区域"
          ],
          "scenarioKey": "scenario-1782887819107-3",
          "scenarioName": "管理人员报表分析",
          "originalPageKey": "scenario-1782887819107-3-page-3"
        }
      ]
    }
  ],
  "pageDesign": {
    "scenario": {
      "key": "scenario-1782887819107-0",
      "name": "调度员现场调度",
      "priority": "P0",
      "description": "调度员通过地图看板实时查看车辆位置、状态和任务信息，根据作业需求进行智能派车、任务下发和异常处理",
      "workflow": [
        "查看车辆实时状态与位置地图",
        "筛选空闲车辆与排队车辆",
        "选择最佳车辆并派发任务",
        "下发任务指令至司机移动端",
        "监控任务执行过程",
        "处理调度异常"
      ],
      "pageMapping": {
        "role": "调度员",
        "page": "DispatchMapView.vue",
        "modules": [
          "地图监控模块",
          "任务派发模块",
          "异常处理模块",
          "车辆状态筛选模块"
        ]
      }
    },
    "currentScenarioKey": "scenario-1782887819107-0",
    "selectedPageKey": "scenario-1782887819107-0-page-1",
    "page": {
      "key": "scenario-1782887819107-0-page-1",
      "priority": "P0",
      "type": "工作台页",
      "name": "现场调度地图监控",
      "vueFile": "DispatchMapView.vue",
      "goal": "基于地图看板实时展示所有车辆的位置、状态（空闲、排队、任务中、异常）、作业区域，支持缩放、点击查看车辆详情",
      "features": [
        "实时车辆位置标注与状态颜色区分",
        "点击车辆弹出详情窗口：车牌",
        "司机",
        "任务",
        "状态",
        "地图图层切换：作业区域",
        "禁入区域",
        "排队区域",
        "车辆轨迹回放（可选）"
      ],
      "featureText": "实时车辆位置标注与状态颜色区分、点击车辆弹出详情窗口：车牌、司机、任务、状态、地图图层切换：作业区域、禁入区域、排队区域、车辆轨迹回放（可选）",
      "sections": [
        "地图主区域",
        "车辆状态筛选与任务派发控制面板",
        "异常告警通知区域"
      ]
    },
    "currentPage": {
      "key": "scenario-1782887819107-0-page-1",
      "priority": "P0",
      "type": "工作台页",
      "name": "现场调度地图监控",
      "vueFile": "DispatchMapView.vue",
      "goal": "基于地图看板实时展示所有车辆的位置、状态（空闲、排队、任务中、异常）、作业区域，支持缩放、点击查看车辆详情",
      "features": [
        "实时车辆位置标注与状态颜色区分",
        "点击车辆弹出详情窗口：车牌",
        "司机",
        "任务",
        "状态",
        "地图图层切换：作业区域",
        "禁入区域",
        "排队区域",
        "车辆轨迹回放（可选）"
      ],
      "featureText": "实时车辆位置标注与状态颜色区分、点击车辆弹出详情窗口：车牌、司机、任务、状态、地图图层切换：作业区域、禁入区域、排队区域、车辆轨迹回放（可选）",
      "sections": [
        "地图主区域",
        "车辆状态筛选与任务派发控制面板",
        "异常告警通知区域"
      ]
    },
    "currentPageSections": [
      "地图主区域",
      "车辆状态筛选与任务派发控制面板",
      "异常告警通知区域"
    ],
    "pageDesign": {
      "pages": [
        {
          "key": "scenario-1782887819107-0-page-1",
          "priority": "P0",
          "type": "工作台页",
          "name": "现场调度地图监控",
          "vueFile": "DispatchMapView.vue",
          "goal": "基于地图看板实时展示所有车辆的位置、状态（空闲、排队、任务中、异常）、作业区域，支持缩放、点击查看车辆详情",
          "features": [
            "实时车辆位置标注与状态颜色区分",
            "点击车辆弹出详情窗口：车牌",
            "司机",
            "任务",
            "状态",
            "地图图层切换：作业区域",
            "禁入区域",
            "排队区域",
            "车辆轨迹回放（可选）"
          ],
          "featureText": "实时车辆位置标注与状态颜色区分、点击车辆弹出详情窗口：车牌、司机、任务、状态、地图图层切换：作业区域、禁入区域、排队区域、车辆轨迹回放（可选）",
          "sections": [
            "地图主区域",
            "车辆状态筛选与任务派发控制面板",
            "异常告警通知区域"
          ],
          "scenarioKey": "scenario-1782887819107-0",
          "scenarioName": "调度员现场调度"
        },
        {
          "key": "scenario-1782887819107-0-page-2",
          "priority": "P1",
          "type": "辅助页",
          "name": "现场车辆快速筛选",
          "vueFile": "OnsiteVehicleFilter.vue",
          "goal": "支持按车辆类型、状态（空闲/排队/任务中）、作业区域、距离远近等条件筛选车辆，便于调度员快速定位合适车辆",
          "features": [
            "多条件组合筛选：车辆类型（生产车/物流车/外协车/临时车）",
            "状态",
            "区域",
            "筛选结果在地图上高亮显示",
            "列表视图展示筛选结果",
            "支持排序",
            "一键重置筛选条件"
          ],
          "featureText": "多条件组合筛选：车辆类型（生产车/物流车/外协车/临时车）、状态、区域、筛选结果在地图上高亮显示、列表视图展示筛选结果，支持排序、一键重置筛选条件",
          "sections": [
            "筛选条件面板",
            "筛选结果展示区（地图/列表）",
            "快捷操作栏"
          ],
          "scenarioKey": "scenario-1782887819107-0",
          "scenarioName": "调度员现场调度"
        },
        {
          "key": "scenario-1782887819107-0-page-3",
          "priority": "P1",
          "type": "辅助页",
          "name": "现场派车",
          "vueFile": "OnsiteDispatchDialog.vue",
          "goal": "调度员为选中的车辆分配任务，支持选择用车申请、输入作业点、选择优先级，并一键下发至司机移动端",
          "features": [
            "显示待派发的用车申请列表",
            "选择目标车辆后",
            "匹配任务并确认派发",
            "支持紧急派车（跳过申请手动创建任务）",
            "派发成功后推送通知至司机端",
            "记录派发日志（操作人",
            "时间",
            "车辆",
            "任务）"
          ],
          "featureText": "显示待派发的用车申请列表、选择目标车辆后，匹配任务并确认派发、支持紧急派车（跳过申请手动创建任务）、派发成功后推送通知至司机端、记录派发日志（操作人、时间、车辆、任务）",
          "sections": [
            "待派发用车申请列表",
            "车辆选择与任务匹配",
            "派发参数配置",
            "派发操作与日志"
          ],
          "scenarioKey": "scenario-1782887819107-0",
          "scenarioName": "调度员现场调度"
        },
        {
          "key": "scenario-1782887819107-0-page-4",
          "priority": "P1",
          "type": "辅助页",
          "name": "现场异常告警处理",
          "vueFile": "OnsiteExceptionAlert.vue",
          "goal": "实时接收车辆异常告警（超速、禁入区域、异常停留、未授权入场等），支持调度员查看详情、处理告警、标记解决",
          "features": [
            "异常告警列表实时刷新",
            "显示告警类型",
            "车辆",
            "时间",
            "位置",
            "点击告警可在地图上定位车辆并查看详情",
            "支持处理告警：确认",
            "忽略",
            "通知相关人员",
            "告警历史记录查询与导出"
          ],
          "featureText": "异常告警列表实时刷新，显示告警类型、车辆、时间、位置、点击告警可在地图上定位车辆并查看详情、支持处理告警：确认、忽略、通知相关人员、告警历史记录查询与导出",
          "sections": [
            "告警实时列表区域",
            "告警详情与处理区域",
            "历史告警查询区域"
          ],
          "scenarioKey": "scenario-1782887819107-0",
          "scenarioName": "调度员现场调度"
        },
        {
          "key": "scenario-1782887819107-1-page-1",
          "priority": "P0",
          "type": "工作台页",
          "name": "任务列表",
          "vueFile": "TaskListView.vue",
          "goal": "司机查看个人任务列表，接收新任务通知，筛选和查看不同状态的任务",
          "features": [
            "接收任务通知并显示未读标记",
            "按状态（待接单",
            "进行中",
            "已完成）筛选任务",
            "显示任务摘要信息（任务编号",
            "作业点",
            "要求时间）",
            "支持下拉刷新和分页加载"
          ],
          "featureText": "接收任务通知并显示未读标记、按状态（待接单、进行中、已完成）筛选任务、显示任务摘要信息（任务编号、作业点、要求时间）、支持下拉刷新和分页加载",
          "sections": [
            "任务通知区域",
            "任务状态筛选区域",
            "任务列表展示区域"
          ],
          "scenarioKey": "scenario-1782887819107-1",
          "scenarioName": "司机任务执行"
        },
        {
          "key": "scenario-1782887819107-1-page-2",
          "priority": "P1",
          "type": "辅助页",
          "name": "任务详情",
          "vueFile": "TaskDetailView.vue",
          "goal": "展示任务的详细信息，包括作业点位置、任务要求、物资信息等",
          "features": [
            "展示作业点名称",
            "地址",
            "联系人信息",
            "展示任务要求（车辆类型",
            "物资种类",
            "作业说明）",
            "展示任务时间节点（计划到达时间",
            "完成时间）",
            "提供导航入口和联系调度员功能"
          ],
          "featureText": "展示作业点名称、地址、联系人信息、展示任务要求（车辆类型、物资种类、作业说明）、展示任务时间节点（计划到达时间、完成时间）、提供导航入口和联系调度员功能",
          "sections": [
            "任务基本信息区域",
            "作业点信息区域",
            "任务时间区域",
            "操作区域"
          ],
          "scenarioKey": "scenario-1782887819107-1",
          "scenarioName": "司机任务执行"
        },
        {
          "key": "scenario-1782887819107-1-page-3",
          "priority": "P1",
          "type": "辅助页",
          "name": "导航与路径",
          "vueFile": "NavigationView.vue",
          "goal": "从司机当前位置导航至指定作业点，实时显示路径和预计到达时间",
          "features": [
            "获取司机当前位置并计算到作业点的最优路径",
            "显示导航路线",
            "距离和预计到达时间",
            "支持语音导航和路线偏离提醒",
            "到达作业点附近时自动触发到达确认提示"
          ],
          "featureText": "获取司机当前位置并计算到作业点的最优路径、显示导航路线、距离和预计到达时间、支持语音导航和路线偏离提醒、到达作业点附近时自动触发到达确认提示",
          "sections": [
            "地图显示区域",
            "导航信息区域",
            "操作与提示区域"
          ],
          "scenarioKey": "scenario-1782887819107-1",
          "scenarioName": "司机任务执行"
        },
        {
          "key": "scenario-1782887819107-1-page-4",
          "priority": "P1",
          "type": "辅助页",
          "name": "现场反馈",
          "vueFile": "SiteFeedbackView.vue",
          "goal": "司机在到达作业点后确认到达，并上传现场照片或备注信息",
          "features": [
            "点击'到达确认'并记录到达时间",
            "现场拍照上传（支持多张照片）",
            "添加文字备注或异常说明",
            "反馈信息与任务关联并同步至调度端"
          ],
          "featureText": "点击'到达确认'并记录到达时间、现场拍照上传（支持多张照片）、添加文字备注或异常说明、反馈信息与任务关联并同步至调度端",
          "sections": [
            "到达确认区域",
            "现场反馈与上传区域"
          ],
          "scenarioKey": "scenario-1782887819107-1",
          "scenarioName": "司机任务执行"
        },
        {
          "key": "scenario-1782887819107-2-page-1",
          "priority": "P1",
          "type": "工作台页",
          "name": "入场核验 - 支持扫描车牌或二维码，自动核验预约与任务关联",
          "vueFile": "EntryCheckPanel.vue",
          "goal": "支持通过扫描车牌或预约二维码，自动核验车辆预约有效性及派车任务关联，快速得出入场许可结果",
          "features": [
            "扫描车牌或预约二维码",
            "自动核验预约有效性及任务关联",
            "显示核验结果（放行/拒绝）",
            "处理核验异常并引导手动操作"
          ],
          "featureText": "扫描车牌或预约二维码、自动核验预约有效性及任务关联、显示核验结果（放行/拒绝）、处理核验异常并引导手动操作",
          "sections": [
            "扫描输入区",
            "核验结果展示区",
            "异常处理区",
            "操作记录区"
          ],
          "scenarioKey": "scenario-1782887819107-2",
          "scenarioName": "门岗入场核验"
        },
        {
          "key": "scenario-1782887819107-2-page-2",
          "priority": "P1",
          "type": "辅助页",
          "name": "放行管理 - 管理车辆入场放行操作与记录",
          "vueFile": "ReleaseManagementPanel.vue",
          "goal": "根据核验结果执行放行或拒绝操作，记录放行时间、车辆信息，并更新相关任务状态",
          "features": [
            "手动确认放行或拒绝",
            "记录入场时间与车辆信息",
            "关联更新派车任务状态",
            "支持批量放行操作"
          ],
          "featureText": "手动确认放行或拒绝、记录入场时间与车辆信息、关联更新派车任务状态、支持批量放行操作",
          "sections": [
            "放行操作区",
            "车辆信息与记录区",
            "批量放行区",
            "任务状态关联区"
          ],
          "scenarioKey": "scenario-1782887819107-2",
          "scenarioName": "门岗入场核验"
        },
        {
          "key": "scenario-1782887819107-2-page-3",
          "priority": "P1",
          "type": "辅助页",
          "name": "异常告警 - 处理入场违规与安全告警事件",
          "vueFile": "AlertPanel.vue",
          "goal": "实时处理未授权入场、证照过期、异常停留等告警，支持告警确认、解除与上报",
          "features": [
            "告警实时展示与分类",
            "告警处理（确认/解除/上报）",
            "告警历史查询"
          ],
          "featureText": "告警实时展示与分类、告警处理（确认/解除/上报）、告警历史查询",
          "sections": [
            "实时告警列表",
            "告警处理面板",
            "告警历史查询"
          ],
          "scenarioKey": "scenario-1782887819107-2",
          "scenarioName": "门岗入场核验"
        },
        {
          "key": "scenario-1782887819107-2-page-4",
          "priority": "P1",
          "type": "辅助页",
          "name": "放行记录查询 - 追溯车辆入场放行历史数据",
          "vueFile": "ReleaseRecordQueryView.vue",
          "goal": "按时间、车牌、车辆类型等条件检索放行记录，查看核验详情，支持导出用于审计追溯",
          "features": [
            "多条件组合查询放行记录",
            "查看核验详情与放行凭证",
            "导出记录报表"
          ],
          "featureText": "多条件组合查询放行记录、查看核验详情与放行凭证、导出记录报表",
          "sections": [
            "查询条件区",
            "数据列表区",
            "详情查看区",
            "导出操作区"
          ],
          "scenarioKey": "scenario-1782887819107-2",
          "scenarioName": "门岗入场核验"
        },
        {
          "key": "scenario-1782887819107-3-page-1",
          "priority": "P1",
          "type": "工作台页",
          "name": "车辆运营报表分析",
          "vueFile": "StatisticsAnalysisView.vue",
          "goal": "提供车辆利用率、任务完成率、平均等待时长、空驶率、排队情况、外协车辆使用次数、异常入场记录等核心统计指标的图表展示与分析功能",
          "features": [
            "按时间范围筛选报表数据",
            "展示车辆利用率趋势图",
            "展示任务完成率与平均等待时长图表",
            "展示空驶率与排队统计图表",
            "展示外协车辆使用次数与异常记录列表",
            "支持图表导出为图片或PDF"
          ],
          "featureText": "按时间范围筛选报表数据、展示车辆利用率趋势图、展示任务完成率与平均等待时长图表、展示空驶率与排队统计图表、展示外协车辆使用次数与异常记录列表、支持图表导出为图片或PDF",
          "sections": [
            "筛选区域",
            "核心指标概览",
            "统计分析图表",
            "外协车辆与异常记录列表"
          ],
          "scenarioKey": "scenario-1782887819107-3",
          "scenarioName": "管理人员报表分析"
        },
        {
          "key": "scenario-1782887819107-3-page-2",
          "priority": "P1",
          "type": "辅助页",
          "name": "报表数据导出",
          "vueFile": "ReportExportView.vue",
          "goal": "支持将统计分析结果导出为Excel、PDF等格式，便于管理人员存档、分发和进一步分析",
          "features": [
            "选择导出格式（Excel/PDF）",
            "选择导出内容范围（全部报表/指定指标）",
            "一键导出并下载文件",
            "导出记录日志与审计追踪"
          ],
          "featureText": "选择导出格式（Excel/PDF）、选择导出内容范围（全部报表/指定指标）、一键导出并下载文件、导出记录日志与审计追踪",
          "sections": [
            "导出配置区域",
            "导出操作区域",
            "导出记录日志区域"
          ],
          "scenarioKey": "scenario-1782887819107-3",
          "scenarioName": "管理人员报表分析"
        },
        {
          "key": "scenario-1782887819107-3-page-3",
          "priority": "P1",
          "type": "辅助页",
          "name": "资源配置优化建议",
          "vueFile": "ResourceAllocationView.vue",
          "goal": "基于历史数据与当前车辆使用情况，提供车辆资源配置优化建议和外协车辆费用管理参考",
          "features": [
            "分析车辆使用热点与瓶颈区域",
            "推荐车辆增减数量与类型调整",
            "展示外协车辆费用汇总与趋势",
            "提供资源配置优化报告预览"
          ],
          "featureText": "分析车辆使用热点与瓶颈区域、推荐车辆增减数量与类型调整、展示外协车辆费用汇总与趋势、提供资源配置优化报告预览",
          "sections": [
            "筛选与时间范围区域",
            "热点与瓶颈分析区域",
            "资源配置推荐区域",
            "外协费用汇总区域",
            "优化报告预览区域"
          ],
          "scenarioKey": "scenario-1782887819107-3",
          "scenarioName": "管理人员报表分析"
        }
      ],
      "navigation": [
        {
          "label": "现场调度地图监控",
          "target": "DispatchMapView.vue",
          "default": true,
          "scenarioKey": "scenario-1782887819107-0",
          "scenarioName": "调度员现场调度"
        },
        {
          "label": "现场车辆快速筛选",
          "target": "OnsiteVehicleFilter.vue",
          "default": false,
          "scenarioKey": "scenario-1782887819107-0",
          "scenarioName": "调度员现场调度"
        },
        {
          "label": "现场派车",
          "target": "OnsiteDispatchDialog.vue",
          "default": false,
          "scenarioKey": "scenario-1782887819107-0",
          "scenarioName": "调度员现场调度"
        },
        {
          "label": "现场异常告警处理",
          "target": "OnsiteExceptionAlert.vue",
          "default": false,
          "scenarioKey": "scenario-1782887819107-0",
          "scenarioName": "调度员现场调度"
        },
        {
          "label": "任务列表",
          "target": "TaskListView.vue",
          "default": true,
          "scenarioKey": "scenario-1782887819107-1",
          "scenarioName": "司机任务执行"
        },
        {
          "label": "任务详情",
          "target": "TaskDetailView.vue",
          "default": false,
          "scenarioKey": "scenario-1782887819107-1",
          "scenarioName": "司机任务执行"
        },
        {
          "label": "导航与路径",
          "target": "NavigationView.vue",
          "default": false,
          "scenarioKey": "scenario-1782887819107-1",
          "scenarioName": "司机任务执行"
        },
        {
          "label": "现场反馈",
          "target": "SiteFeedbackView.vue",
          "default": false,
          "scenarioKey": "scenario-1782887819107-1",
          "scenarioName": "司机任务执行"
        },
        {
          "label": "入场核验 - 支持扫描车牌或二维码，自动核验预约与任务关联",
          "target": "EntryCheckPanel.vue",
          "default": true,
          "scenarioKey": "scenario-1782887819107-2",
          "scenarioName": "门岗入场核验"
        },
        {
          "label": "放行管理 - 管理车辆入场放行操作与记录",
          "target": "ReleaseManagementPanel.vue",
          "default": false,
          "scenarioKey": "scenario-1782887819107-2",
          "scenarioName": "门岗入场核验"
        },
        {
          "label": "异常告警 - 处理入场违规与安全告警事件",
          "target": "AlertPanel.vue",
          "default": false,
          "scenarioKey": "scenario-1782887819107-2",
          "scenarioName": "门岗入场核验"
        },
        {
          "label": "放行记录查询 - 追溯车辆入场放行历史数据",
          "target": "ReleaseRecordQueryView.vue",
          "default": false,
          "scenarioKey": "scenario-1782887819107-2",
          "scenarioName": "门岗入场核验"
        },
        {
          "label": "车辆运营报表分析",
          "target": "StatisticsAnalysisView.vue",
          "default": true,
          "scenarioKey": "scenario-1782887819107-3",
          "scenarioName": "管理人员报表分析"
        },
        {
          "label": "报表数据导出",
          "target": "ReportExportView.vue",
          "default": false,
          "scenarioKey": "scenario-1782887819107-3",
          "scenarioName": "管理人员报表分析"
        },
        {
          "label": "资源配置优化建议",
          "target": "ResourceAllocationView.vue",
          "default": false,
          "scenarioKey": "scenario-1782887819107-3",
          "scenarioName": "管理人员报表分析"
        }
      ],
      "fileStructure": {
        "views": [
          "DispatchMapView.vue",
          "OnsiteVehicleFilter.vue",
          "OnsiteDispatchDialog.vue",
          "OnsiteExceptionAlert.vue",
          "TaskListView.vue",
          "TaskDetailView.vue",
          "NavigationView.vue",
          "SiteFeedbackView.vue",
          "EntryCheckPanel.vue",
          "ReleaseManagementPanel.vue",
          "AlertPanel.vue",
          "ReleaseRecordQueryView.vue",
          "StatisticsAnalysisView.vue",
          "ReportExportView.vue",
          "ResourceAllocationView.vue"
        ],
        "components": [
          "ScenarioHeader.vue",
          "ScenarioFilterBar.vue",
          "ScenarioDetailPanel.vue",
          "StatusTag.vue",
          "DataTable.vue"
        ],
        "data": [
          "ScenarioMockData.js"
        ]
      }
    },
    "scenarioSummaries": [
      {
        "key": "scenario-1782887819107-0",
        "name": "调度员现场调度",
        "priority": "P0",
        "pageCount": 4,
        "pages": [
          {
            "key": "scenario-1782887819107-0-page-1",
            "priority": "P0",
            "type": "工作台页",
            "name": "现场调度地图监控",
            "vueFile": "DispatchMapView.vue",
            "goal": "基于地图看板实时展示所有车辆的位置、状态（空闲、排队、任务中、异常）、作业区域，支持缩放、点击查看车辆详情",
            "features": [
              "实时车辆位置标注与状态颜色区分",
              "点击车辆弹出详情窗口：车牌",
              "司机",
              "任务",
              "状态",
              "地图图层切换：作业区域",
              "禁入区域",
              "排队区域",
              "车辆轨迹回放（可选）"
            ],
            "featureText": "实时车辆位置标注与状态颜色区分、点击车辆弹出详情窗口：车牌、司机、任务、状态、地图图层切换：作业区域、禁入区域、排队区域、车辆轨迹回放（可选）",
            "sections": [
              "地图主区域",
              "车辆状态筛选与任务派发控制面板",
              "异常告警通知区域"
            ]
          },
          {
            "key": "scenario-1782887819107-0-page-2",
            "priority": "P1",
            "type": "辅助页",
            "name": "现场车辆快速筛选",
            "vueFile": "OnsiteVehicleFilter.vue",
            "goal": "支持按车辆类型、状态（空闲/排队/任务中）、作业区域、距离远近等条件筛选车辆，便于调度员快速定位合适车辆",
            "features": [
              "多条件组合筛选：车辆类型（生产车/物流车/外协车/临时车）",
              "状态",
              "区域",
              "筛选结果在地图上高亮显示",
              "列表视图展示筛选结果",
              "支持排序",
              "一键重置筛选条件"
            ],
            "featureText": "多条件组合筛选：车辆类型（生产车/物流车/外协车/临时车）、状态、区域、筛选结果在地图上高亮显示、列表视图展示筛选结果，支持排序、一键重置筛选条件",
            "sections": [
              "筛选条件面板",
              "筛选结果展示区（地图/列表）",
              "快捷操作栏"
            ]
          },
          {
            "key": "scenario-1782887819107-0-page-3",
            "priority": "P1",
            "type": "辅助页",
            "name": "现场派车",
            "vueFile": "OnsiteDispatchDialog.vue",
            "goal": "调度员为选中的车辆分配任务，支持选择用车申请、输入作业点、选择优先级，并一键下发至司机移动端",
            "features": [
              "显示待派发的用车申请列表",
              "选择目标车辆后",
              "匹配任务并确认派发",
              "支持紧急派车（跳过申请手动创建任务）",
              "派发成功后推送通知至司机端",
              "记录派发日志（操作人",
              "时间",
              "车辆",
              "任务）"
            ],
            "featureText": "显示待派发的用车申请列表、选择目标车辆后，匹配任务并确认派发、支持紧急派车（跳过申请手动创建任务）、派发成功后推送通知至司机端、记录派发日志（操作人、时间、车辆、任务）",
            "sections": [
              "待派发用车申请列表",
              "车辆选择与任务匹配",
              "派发参数配置",
              "派发操作与日志"
            ]
          },
          {
            "key": "scenario-1782887819107-0-page-4",
            "priority": "P1",
            "type": "辅助页",
            "name": "现场异常告警处理",
            "vueFile": "OnsiteExceptionAlert.vue",
            "goal": "实时接收车辆异常告警（超速、禁入区域、异常停留、未授权入场等），支持调度员查看详情、处理告警、标记解决",
            "features": [
              "异常告警列表实时刷新",
              "显示告警类型",
              "车辆",
              "时间",
              "位置",
              "点击告警可在地图上定位车辆并查看详情",
              "支持处理告警：确认",
              "忽略",
              "通知相关人员",
              "告警历史记录查询与导出"
            ],
            "featureText": "异常告警列表实时刷新，显示告警类型、车辆、时间、位置、点击告警可在地图上定位车辆并查看详情、支持处理告警：确认、忽略、通知相关人员、告警历史记录查询与导出",
            "sections": [
              "告警实时列表区域",
              "告警详情与处理区域",
              "历史告警查询区域"
            ]
          }
        ]
      },
      {
        "key": "scenario-1782887819107-1",
        "name": "司机任务执行",
        "priority": "P0",
        "pageCount": 4,
        "pages": [
          {
            "key": "scenario-1782887819107-1-page-1",
            "priority": "P0",
            "type": "工作台页",
            "name": "任务列表",
            "vueFile": "TaskListView.vue",
            "goal": "司机查看个人任务列表，接收新任务通知，筛选和查看不同状态的任务",
            "features": [
              "接收任务通知并显示未读标记",
              "按状态（待接单",
              "进行中",
              "已完成）筛选任务",
              "显示任务摘要信息（任务编号",
              "作业点",
              "要求时间）",
              "支持下拉刷新和分页加载"
            ],
            "featureText": "接收任务通知并显示未读标记、按状态（待接单、进行中、已完成）筛选任务、显示任务摘要信息（任务编号、作业点、要求时间）、支持下拉刷新和分页加载",
            "sections": [
              "任务通知区域",
              "任务状态筛选区域",
              "任务列表展示区域"
            ]
          },
          {
            "key": "scenario-1782887819107-1-page-2",
            "priority": "P1",
            "type": "辅助页",
            "name": "任务详情",
            "vueFile": "TaskDetailView.vue",
            "goal": "展示任务的详细信息，包括作业点位置、任务要求、物资信息等",
            "features": [
              "展示作业点名称",
              "地址",
              "联系人信息",
              "展示任务要求（车辆类型",
              "物资种类",
              "作业说明）",
              "展示任务时间节点（计划到达时间",
              "完成时间）",
              "提供导航入口和联系调度员功能"
            ],
            "featureText": "展示作业点名称、地址、联系人信息、展示任务要求（车辆类型、物资种类、作业说明）、展示任务时间节点（计划到达时间、完成时间）、提供导航入口和联系调度员功能",
            "sections": [
              "任务基本信息区域",
              "作业点信息区域",
              "任务时间区域",
              "操作区域"
            ]
          },
          {
            "key": "scenario-1782887819107-1-page-3",
            "priority": "P1",
            "type": "辅助页",
            "name": "导航与路径",
            "vueFile": "NavigationView.vue",
            "goal": "从司机当前位置导航至指定作业点，实时显示路径和预计到达时间",
            "features": [
              "获取司机当前位置并计算到作业点的最优路径",
              "显示导航路线",
              "距离和预计到达时间",
              "支持语音导航和路线偏离提醒",
              "到达作业点附近时自动触发到达确认提示"
            ],
            "featureText": "获取司机当前位置并计算到作业点的最优路径、显示导航路线、距离和预计到达时间、支持语音导航和路线偏离提醒、到达作业点附近时自动触发到达确认提示",
            "sections": [
              "地图显示区域",
              "导航信息区域",
              "操作与提示区域"
            ]
          },
          {
            "key": "scenario-1782887819107-1-page-4",
            "priority": "P1",
            "type": "辅助页",
            "name": "现场反馈",
            "vueFile": "SiteFeedbackView.vue",
            "goal": "司机在到达作业点后确认到达，并上传现场照片或备注信息",
            "features": [
              "点击'到达确认'并记录到达时间",
              "现场拍照上传（支持多张照片）",
              "添加文字备注或异常说明",
              "反馈信息与任务关联并同步至调度端"
            ],
            "featureText": "点击'到达确认'并记录到达时间、现场拍照上传（支持多张照片）、添加文字备注或异常说明、反馈信息与任务关联并同步至调度端",
            "sections": [
              "到达确认区域",
              "现场反馈与上传区域"
            ]
          }
        ]
      },
      {
        "key": "scenario-1782887819107-2",
        "name": "门岗入场核验",
        "priority": "P1",
        "pageCount": 4,
        "pages": [
          {
            "key": "scenario-1782887819107-2-page-1",
            "priority": "P1",
            "type": "工作台页",
            "name": "入场核验 - 支持扫描车牌或二维码，自动核验预约与任务关联",
            "vueFile": "EntryCheckPanel.vue",
            "goal": "支持通过扫描车牌或预约二维码，自动核验车辆预约有效性及派车任务关联，快速得出入场许可结果",
            "features": [
              "扫描车牌或预约二维码",
              "自动核验预约有效性及任务关联",
              "显示核验结果（放行/拒绝）",
              "处理核验异常并引导手动操作"
            ],
            "featureText": "扫描车牌或预约二维码、自动核验预约有效性及任务关联、显示核验结果（放行/拒绝）、处理核验异常并引导手动操作",
            "sections": [
              "扫描输入区",
              "核验结果展示区",
              "异常处理区",
              "操作记录区"
            ]
          },
          {
            "key": "scenario-1782887819107-2-page-2",
            "priority": "P1",
            "type": "辅助页",
            "name": "放行管理 - 管理车辆入场放行操作与记录",
            "vueFile": "ReleaseManagementPanel.vue",
            "goal": "根据核验结果执行放行或拒绝操作，记录放行时间、车辆信息，并更新相关任务状态",
            "features": [
              "手动确认放行或拒绝",
              "记录入场时间与车辆信息",
              "关联更新派车任务状态",
              "支持批量放行操作"
            ],
            "featureText": "手动确认放行或拒绝、记录入场时间与车辆信息、关联更新派车任务状态、支持批量放行操作",
            "sections": [
              "放行操作区",
              "车辆信息与记录区",
              "批量放行区",
              "任务状态关联区"
            ]
          },
          {
            "key": "scenario-1782887819107-2-page-3",
            "priority": "P1",
            "type": "辅助页",
            "name": "异常告警 - 处理入场违规与安全告警事件",
            "vueFile": "AlertPanel.vue",
            "goal": "实时处理未授权入场、证照过期、异常停留等告警，支持告警确认、解除与上报",
            "features": [
              "告警实时展示与分类",
              "告警处理（确认/解除/上报）",
              "告警历史查询"
            ],
            "featureText": "告警实时展示与分类、告警处理（确认/解除/上报）、告警历史查询",
            "sections": [
              "实时告警列表",
              "告警处理面板",
              "告警历史查询"
            ]
          },
          {
            "key": "scenario-1782887819107-2-page-4",
            "priority": "P1",
            "type": "辅助页",
            "name": "放行记录查询 - 追溯车辆入场放行历史数据",
            "vueFile": "ReleaseRecordQueryView.vue",
            "goal": "按时间、车牌、车辆类型等条件检索放行记录，查看核验详情，支持导出用于审计追溯",
            "features": [
              "多条件组合查询放行记录",
              "查看核验详情与放行凭证",
              "导出记录报表"
            ],
            "featureText": "多条件组合查询放行记录、查看核验详情与放行凭证、导出记录报表",
            "sections": [
              "查询条件区",
              "数据列表区",
              "详情查看区",
              "导出操作区"
            ]
          }
        ]
      },
      {
        "key": "scenario-1782887819107-3",
        "name": "管理人员报表分析",
        "priority": "P1",
        "pageCount": 3,
        "pages": [
          {
            "key": "scenario-1782887819107-3-page-1",
            "priority": "P1",
            "type": "工作台页",
            "name": "车辆运营报表分析",
            "vueFile": "StatisticsAnalysisView.vue",
            "goal": "提供车辆利用率、任务完成率、平均等待时长、空驶率、排队情况、外协车辆使用次数、异常入场记录等核心统计指标的图表展示与分析功能",
            "features": [
              "按时间范围筛选报表数据",
              "展示车辆利用率趋势图",
              "展示任务完成率与平均等待时长图表",
              "展示空驶率与排队统计图表",
              "展示外协车辆使用次数与异常记录列表",
              "支持图表导出为图片或PDF"
            ],
            "featureText": "按时间范围筛选报表数据、展示车辆利用率趋势图、展示任务完成率与平均等待时长图表、展示空驶率与排队统计图表、展示外协车辆使用次数与异常记录列表、支持图表导出为图片或PDF",
            "sections": [
              "筛选区域",
              "核心指标概览",
              "统计分析图表",
              "外协车辆与异常记录列表"
            ]
          },
          {
            "key": "scenario-1782887819107-3-page-2",
            "priority": "P1",
            "type": "辅助页",
            "name": "报表数据导出",
            "vueFile": "ReportExportView.vue",
            "goal": "支持将统计分析结果导出为Excel、PDF等格式，便于管理人员存档、分发和进一步分析",
            "features": [
              "选择导出格式（Excel/PDF）",
              "选择导出内容范围（全部报表/指定指标）",
              "一键导出并下载文件",
              "导出记录日志与审计追踪"
            ],
            "featureText": "选择导出格式（Excel/PDF）、选择导出内容范围（全部报表/指定指标）、一键导出并下载文件、导出记录日志与审计追踪",
            "sections": [
              "导出配置区域",
              "导出操作区域",
              "导出记录日志区域"
            ]
          },
          {
            "key": "scenario-1782887819107-3-page-3",
            "priority": "P1",
            "type": "辅助页",
            "name": "资源配置优化建议",
            "vueFile": "ResourceAllocationView.vue",
            "goal": "基于历史数据与当前车辆使用情况，提供车辆资源配置优化建议和外协车辆费用管理参考",
            "features": [
              "分析车辆使用热点与瓶颈区域",
              "推荐车辆增减数量与类型调整",
              "展示外协车辆费用汇总与趋势",
              "提供资源配置优化报告预览"
            ],
            "featureText": "分析车辆使用热点与瓶颈区域、推荐车辆增减数量与类型调整、展示外协车辆费用汇总与趋势、提供资源配置优化报告预览",
            "sections": [
              "筛选与时间范围区域",
              "热点与瓶颈分析区域",
              "资源配置推荐区域",
              "外协费用汇总区域",
              "优化报告预览区域"
            ]
          }
        ]
      }
    ],
    "scenarioDesigns": {
      "scenario-1782887819107-0": {
        "pages": [
          {
            "key": "scenario-1782887819107-0-page-1",
            "priority": "P0",
            "type": "工作台页",
            "name": "现场调度地图监控",
            "vueFile": "DispatchMapView.vue",
            "goal": "基于地图看板实时展示所有车辆的位置、状态（空闲、排队、任务中、异常）、作业区域，支持缩放、点击查看车辆详情",
            "features": [
              "实时车辆位置标注与状态颜色区分",
              "点击车辆弹出详情窗口：车牌",
              "司机",
              "任务",
              "状态",
              "地图图层切换：作业区域",
              "禁入区域",
              "排队区域",
              "车辆轨迹回放（可选）"
            ],
            "featureText": "实时车辆位置标注与状态颜色区分、点击车辆弹出详情窗口：车牌、司机、任务、状态、地图图层切换：作业区域、禁入区域、排队区域、车辆轨迹回放（可选）",
            "sections": [
              "地图主区域",
              "车辆状态筛选与任务派发控制面板",
              "异常告警通知区域"
            ]
          },
          {
            "key": "scenario-1782887819107-0-page-2",
            "priority": "P1",
            "type": "辅助页",
            "name": "现场车辆快速筛选",
            "vueFile": "OnsiteVehicleFilter.vue",
            "goal": "支持按车辆类型、状态（空闲/排队/任务中）、作业区域、距离远近等条件筛选车辆，便于调度员快速定位合适车辆",
            "features": [
              "多条件组合筛选：车辆类型（生产车/物流车/外协车/临时车）",
              "状态",
              "区域",
              "筛选结果在地图上高亮显示",
              "列表视图展示筛选结果",
              "支持排序",
              "一键重置筛选条件"
            ],
            "featureText": "多条件组合筛选：车辆类型（生产车/物流车/外协车/临时车）、状态、区域、筛选结果在地图上高亮显示、列表视图展示筛选结果，支持排序、一键重置筛选条件",
            "sections": [
              "筛选条件面板",
              "筛选结果展示区（地图/列表）",
              "快捷操作栏"
            ]
          },
          {
            "key": "scenario-1782887819107-0-page-3",
            "priority": "P1",
            "type": "辅助页",
            "name": "现场派车",
            "vueFile": "OnsiteDispatchDialog.vue",
            "goal": "调度员为选中的车辆分配任务，支持选择用车申请、输入作业点、选择优先级，并一键下发至司机移动端",
            "features": [
              "显示待派发的用车申请列表",
              "选择目标车辆后",
              "匹配任务并确认派发",
              "支持紧急派车（跳过申请手动创建任务）",
              "派发成功后推送通知至司机端",
              "记录派发日志（操作人",
              "时间",
              "车辆",
              "任务）"
            ],
            "featureText": "显示待派发的用车申请列表、选择目标车辆后，匹配任务并确认派发、支持紧急派车（跳过申请手动创建任务）、派发成功后推送通知至司机端、记录派发日志（操作人、时间、车辆、任务）",
            "sections": [
              "待派发用车申请列表",
              "车辆选择与任务匹配",
              "派发参数配置",
              "派发操作与日志"
            ]
          },
          {
            "key": "scenario-1782887819107-0-page-4",
            "priority": "P1",
            "type": "辅助页",
            "name": "现场异常告警处理",
            "vueFile": "OnsiteExceptionAlert.vue",
            "goal": "实时接收车辆异常告警（超速、禁入区域、异常停留、未授权入场等），支持调度员查看详情、处理告警、标记解决",
            "features": [
              "异常告警列表实时刷新",
              "显示告警类型",
              "车辆",
              "时间",
              "位置",
              "点击告警可在地图上定位车辆并查看详情",
              "支持处理告警：确认",
              "忽略",
              "通知相关人员",
              "告警历史记录查询与导出"
            ],
            "featureText": "异常告警列表实时刷新，显示告警类型、车辆、时间、位置、点击告警可在地图上定位车辆并查看详情、支持处理告警：确认、忽略、通知相关人员、告警历史记录查询与导出",
            "sections": [
              "告警实时列表区域",
              "告警详情与处理区域",
              "历史告警查询区域"
            ]
          }
        ],
        "navigation": [
          {
            "label": "现场调度地图监控",
            "target": "DispatchMapView.vue",
            "default": true
          },
          {
            "label": "现场车辆快速筛选",
            "target": "OnsiteVehicleFilter.vue",
            "default": false
          },
          {
            "label": "现场派车",
            "target": "OnsiteDispatchDialog.vue",
            "default": false
          },
          {
            "label": "现场异常告警处理",
            "target": "OnsiteExceptionAlert.vue",
            "default": false
          }
        ],
        "fileStructure": {
          "views": [
            "DispatchMapView.vue",
            "OnsiteVehicleFilter.vue",
            "OnsiteDispatchDialog.vue",
            "OnsiteExceptionAlert.vue"
          ],
          "components": [
            "ScenarioHeader.vue",
            "ScenarioFilterBar.vue",
            "ScenarioDetailPanel.vue",
            "StatusTag.vue",
            "DataTable.vue"
          ],
          "data": [
            "ScenarioMockData.js"
          ]
        }
      },
      "scenario-1782887819107-1": {
        "pages": [
          {
            "key": "scenario-1782887819107-1-page-1",
            "priority": "P0",
            "type": "工作台页",
            "name": "任务列表",
            "vueFile": "TaskListView.vue",
            "goal": "司机查看个人任务列表，接收新任务通知，筛选和查看不同状态的任务",
            "features": [
              "接收任务通知并显示未读标记",
              "按状态（待接单",
              "进行中",
              "已完成）筛选任务",
              "显示任务摘要信息（任务编号",
              "作业点",
              "要求时间）",
              "支持下拉刷新和分页加载"
            ],
            "featureText": "接收任务通知并显示未读标记、按状态（待接单、进行中、已完成）筛选任务、显示任务摘要信息（任务编号、作业点、要求时间）、支持下拉刷新和分页加载",
            "sections": [
              "任务通知区域",
              "任务状态筛选区域",
              "任务列表展示区域"
            ]
          },
          {
            "key": "scenario-1782887819107-1-page-2",
            "priority": "P1",
            "type": "辅助页",
            "name": "任务详情",
            "vueFile": "TaskDetailView.vue",
            "goal": "展示任务的详细信息，包括作业点位置、任务要求、物资信息等",
            "features": [
              "展示作业点名称",
              "地址",
              "联系人信息",
              "展示任务要求（车辆类型",
              "物资种类",
              "作业说明）",
              "展示任务时间节点（计划到达时间",
              "完成时间）",
              "提供导航入口和联系调度员功能"
            ],
            "featureText": "展示作业点名称、地址、联系人信息、展示任务要求（车辆类型、物资种类、作业说明）、展示任务时间节点（计划到达时间、完成时间）、提供导航入口和联系调度员功能",
            "sections": [
              "任务基本信息区域",
              "作业点信息区域",
              "任务时间区域",
              "操作区域"
            ]
          },
          {
            "key": "scenario-1782887819107-1-page-3",
            "priority": "P1",
            "type": "辅助页",
            "name": "导航与路径",
            "vueFile": "NavigationView.vue",
            "goal": "从司机当前位置导航至指定作业点，实时显示路径和预计到达时间",
            "features": [
              "获取司机当前位置并计算到作业点的最优路径",
              "显示导航路线",
              "距离和预计到达时间",
              "支持语音导航和路线偏离提醒",
              "到达作业点附近时自动触发到达确认提示"
            ],
            "featureText": "获取司机当前位置并计算到作业点的最优路径、显示导航路线、距离和预计到达时间、支持语音导航和路线偏离提醒、到达作业点附近时自动触发到达确认提示",
            "sections": [
              "地图显示区域",
              "导航信息区域",
              "操作与提示区域"
            ]
          },
          {
            "key": "scenario-1782887819107-1-page-4",
            "priority": "P1",
            "type": "辅助页",
            "name": "现场反馈",
            "vueFile": "SiteFeedbackView.vue",
            "goal": "司机在到达作业点后确认到达，并上传现场照片或备注信息",
            "features": [
              "点击'到达确认'并记录到达时间",
              "现场拍照上传（支持多张照片）",
              "添加文字备注或异常说明",
              "反馈信息与任务关联并同步至调度端"
            ],
            "featureText": "点击'到达确认'并记录到达时间、现场拍照上传（支持多张照片）、添加文字备注或异常说明、反馈信息与任务关联并同步至调度端",
            "sections": [
              "到达确认区域",
              "现场反馈与上传区域"
            ]
          }
        ],
        "navigation": [
          {
            "label": "任务列表",
            "target": "TaskListView.vue",
            "default": true
          },
          {
            "label": "任务详情",
            "target": "TaskDetailView.vue",
            "default": false
          },
          {
            "label": "导航与路径",
            "target": "NavigationView.vue",
            "default": false
          },
          {
            "label": "现场反馈",
            "target": "SiteFeedbackView.vue",
            "default": false
          }
        ],
        "fileStructure": {
          "views": [
            "TaskListView.vue",
            "TaskDetailView.vue",
            "NavigationView.vue",
            "SiteFeedbackView.vue"
          ],
          "components": [
            "ScenarioHeader.vue",
            "ScenarioFilterBar.vue",
            "ScenarioDetailPanel.vue",
            "StatusTag.vue",
            "DataTable.vue"
          ],
          "data": [
            "ScenarioMockData.js"
          ]
        }
      },
      "scenario-1782887819107-2": {
        "pages": [
          {
            "key": "scenario-1782887819107-2-page-1",
            "priority": "P1",
            "type": "工作台页",
            "name": "入场核验 - 支持扫描车牌或二维码，自动核验预约与任务关联",
            "vueFile": "EntryCheckPanel.vue",
            "goal": "支持通过扫描车牌或预约二维码，自动核验车辆预约有效性及派车任务关联，快速得出入场许可结果",
            "features": [
              "扫描车牌或预约二维码",
              "自动核验预约有效性及任务关联",
              "显示核验结果（放行/拒绝）",
              "处理核验异常并引导手动操作"
            ],
            "featureText": "扫描车牌或预约二维码、自动核验预约有效性及任务关联、显示核验结果（放行/拒绝）、处理核验异常并引导手动操作",
            "sections": [
              "扫描输入区",
              "核验结果展示区",
              "异常处理区",
              "操作记录区"
            ]
          },
          {
            "key": "scenario-1782887819107-2-page-2",
            "priority": "P1",
            "type": "辅助页",
            "name": "放行管理 - 管理车辆入场放行操作与记录",
            "vueFile": "ReleaseManagementPanel.vue",
            "goal": "根据核验结果执行放行或拒绝操作，记录放行时间、车辆信息，并更新相关任务状态",
            "features": [
              "手动确认放行或拒绝",
              "记录入场时间与车辆信息",
              "关联更新派车任务状态",
              "支持批量放行操作"
            ],
            "featureText": "手动确认放行或拒绝、记录入场时间与车辆信息、关联更新派车任务状态、支持批量放行操作",
            "sections": [
              "放行操作区",
              "车辆信息与记录区",
              "批量放行区",
              "任务状态关联区"
            ]
          },
          {
            "key": "scenario-1782887819107-2-page-3",
            "priority": "P1",
            "type": "辅助页",
            "name": "异常告警 - 处理入场违规与安全告警事件",
            "vueFile": "AlertPanel.vue",
            "goal": "实时处理未授权入场、证照过期、异常停留等告警，支持告警确认、解除与上报",
            "features": [
              "告警实时展示与分类",
              "告警处理（确认/解除/上报）",
              "告警历史查询"
            ],
            "featureText": "告警实时展示与分类、告警处理（确认/解除/上报）、告警历史查询",
            "sections": [
              "实时告警列表",
              "告警处理面板",
              "告警历史查询"
            ]
          },
          {
            "key": "scenario-1782887819107-2-page-4",
            "priority": "P1",
            "type": "辅助页",
            "name": "放行记录查询 - 追溯车辆入场放行历史数据",
            "vueFile": "ReleaseRecordQueryView.vue",
            "goal": "按时间、车牌、车辆类型等条件检索放行记录，查看核验详情，支持导出用于审计追溯",
            "features": [
              "多条件组合查询放行记录",
              "查看核验详情与放行凭证",
              "导出记录报表"
            ],
            "featureText": "多条件组合查询放行记录、查看核验详情与放行凭证、导出记录报表",
            "sections": [
              "查询条件区",
              "数据列表区",
              "详情查看区",
              "导出操作区"
            ]
          }
        ],
        "navigation": [
          {
            "label": "入场核验 - 支持扫描车牌或二维码，自动核验预约与任务关联",
            "target": "EntryCheckPanel.vue",
            "default": true
          },
          {
            "label": "放行管理 - 管理车辆入场放行操作与记录",
            "target": "ReleaseManagementPanel.vue",
            "default": false
          },
          {
            "label": "异常告警 - 处理入场违规与安全告警事件",
            "target": "AlertPanel.vue",
            "default": false
          },
          {
            "label": "放行记录查询 - 追溯车辆入场放行历史数据",
            "target": "ReleaseRecordQueryView.vue",
            "default": false
          }
        ],
        "fileStructure": {
          "views": [
            "EntryCheckPanel.vue",
            "ReleaseManagementPanel.vue",
            "AlertPanel.vue",
            "ReleaseRecordQueryView.vue"
          ],
          "components": [
            "ScenarioHeader.vue",
            "ScenarioFilterBar.vue",
            "ScenarioDetailPanel.vue",
            "StatusTag.vue",
            "DataTable.vue"
          ],
          "data": [
            "ScenarioMockData.js"
          ]
        }
      },
      "scenario-1782887819107-3": {
        "pages": [
          {
            "key": "scenario-1782887819107-3-page-1",
            "priority": "P1",
            "type": "工作台页",
            "name": "车辆运营报表分析",
            "vueFile": "StatisticsAnalysisView.vue",
            "goal": "提供车辆利用率、任务完成率、平均等待时长、空驶率、排队情况、外协车辆使用次数、异常入场记录等核心统计指标的图表展示与分析功能",
            "features": [
              "按时间范围筛选报表数据",
              "展示车辆利用率趋势图",
              "展示任务完成率与平均等待时长图表",
              "展示空驶率与排队统计图表",
              "展示外协车辆使用次数与异常记录列表",
              "支持图表导出为图片或PDF"
            ],
            "featureText": "按时间范围筛选报表数据、展示车辆利用率趋势图、展示任务完成率与平均等待时长图表、展示空驶率与排队统计图表、展示外协车辆使用次数与异常记录列表、支持图表导出为图片或PDF",
            "sections": [
              "筛选区域",
              "核心指标概览",
              "统计分析图表",
              "外协车辆与异常记录列表"
            ]
          },
          {
            "key": "scenario-1782887819107-3-page-2",
            "priority": "P1",
            "type": "辅助页",
            "name": "报表数据导出",
            "vueFile": "ReportExportView.vue",
            "goal": "支持将统计分析结果导出为Excel、PDF等格式，便于管理人员存档、分发和进一步分析",
            "features": [
              "选择导出格式（Excel/PDF）",
              "选择导出内容范围（全部报表/指定指标）",
              "一键导出并下载文件",
              "导出记录日志与审计追踪"
            ],
            "featureText": "选择导出格式（Excel/PDF）、选择导出内容范围（全部报表/指定指标）、一键导出并下载文件、导出记录日志与审计追踪",
            "sections": [
              "导出配置区域",
              "导出操作区域",
              "导出记录日志区域"
            ]
          },
          {
            "key": "scenario-1782887819107-3-page-3",
            "priority": "P1",
            "type": "辅助页",
            "name": "资源配置优化建议",
            "vueFile": "ResourceAllocationView.vue",
            "goal": "基于历史数据与当前车辆使用情况，提供车辆资源配置优化建议和外协车辆费用管理参考",
            "features": [
              "分析车辆使用热点与瓶颈区域",
              "推荐车辆增减数量与类型调整",
              "展示外协车辆费用汇总与趋势",
              "提供资源配置优化报告预览"
            ],
            "featureText": "分析车辆使用热点与瓶颈区域、推荐车辆增减数量与类型调整、展示外协车辆费用汇总与趋势、提供资源配置优化报告预览",
            "sections": [
              "筛选与时间范围区域",
              "热点与瓶颈分析区域",
              "资源配置推荐区域",
              "外协费用汇总区域",
              "优化报告预览区域"
            ]
          }
        ],
        "navigation": [
          {
            "label": "车辆运营报表分析",
            "target": "StatisticsAnalysisView.vue",
            "default": true
          },
          {
            "label": "报表数据导出",
            "target": "ReportExportView.vue",
            "default": false
          },
          {
            "label": "资源配置优化建议",
            "target": "ResourceAllocationView.vue",
            "default": false
          }
        ],
        "fileStructure": {
          "views": [
            "StatisticsAnalysisView.vue",
            "ReportExportView.vue",
            "ResourceAllocationView.vue"
          ],
          "components": [
            "ScenarioHeader.vue",
            "ScenarioFilterBar.vue",
            "ScenarioDetailPanel.vue",
            "StatusTag.vue",
            "DataTable.vue"
          ],
          "data": [
            "ScenarioMockData.js"
          ]
        }
      }
    },
    "sectionGenerationSource": "initial",
    "savedAt": "2026-07-01T15:42:13.349Z"
  },
  "selectedPage": {
    "key": "scenario-1782887819107-0-scenario-1782887819107-0-page-1-0",
    "name": "现场调度地图监控",
    "vueFile": "DispatchMapView.vue",
    "fields": [
      {
        "name": "vehicleTypeFilter",
        "label": "车辆类型",
        "type": "select",
        "required": false,
        "description": "筛选指定类型的车辆，如生产车辆、物流车辆等"
      },
      {
        "name": "vehicleStatusFilter",
        "label": "车辆状态",
        "type": "select",
        "required": false,
        "description": "筛选空闲、任务中、排队、异常等状态的车辆"
      },
      {
        "name": "searchPlate",
        "label": "搜索车牌号",
        "type": "text",
        "required": false,
        "description": "输入车牌号快速定位车辆"
      }
    ],
    "actions": [
      {
        "label": "查看车辆详情",
        "trigger": "点击地图上的车辆图标",
        "feedback": "弹出详情窗口，显示车牌、司机、任务、状态等信息"
      },
      {
        "label": "切换地图图层",
        "trigger": "点击图层切换按钮",
        "feedback": "切换显示作业区域、禁入区域、排队区域等图层"
      },
      {
        "label": "派发任务",
        "trigger": "在控制面板中选择车辆并点击派车",
        "feedback": "打开派车对话框，填写任务信息后提交"
      },
      {
        "label": "处理异常告警",
        "trigger": "点击异常告警通知区域中的告警项",
        "feedback": "跳转至异常告警处理面板"
      }
    ],
    "validations": [
      "现场调度地图监控 的关键筛选或处理字段不能为空。",
      "提交前校验状态流转是否合法，并给出明确错误提示。"
    ],
    "states": {
      "empty": {
        "description": "无车辆数据时，地图中央显示提示文字“暂无车辆数据”"
      },
      "loading": {
        "description": "地图和车辆数据加载中，显示加载动画"
      },
      "success": {
        "description": "正常显示地图和车辆标注"
      },
      "error": {
        "description": "数据获取失败或地图加载失败时，显示错误提示和重试按钮"
      }
    },
    "sourcePageDesign": {
      "key": "scenario-1782887819107-0-scenario-1782887819107-0-page-1-0",
      "priority": "P0",
      "type": "工作台页",
      "name": "现场调度地图监控",
      "vueFile": "DispatchMapView.vue",
      "goal": "基于地图看板实时展示所有车辆的位置、状态（空闲、排队、任务中、异常）、作业区域，支持缩放、点击查看车辆详情",
      "features": [
        "实时车辆位置标注与状态颜色区分",
        "点击车辆弹出详情窗口：车牌",
        "司机",
        "任务",
        "状态",
        "地图图层切换：作业区域",
        "禁入区域",
        "排队区域",
        "车辆轨迹回放（可选）"
      ],
      "featureText": "实时车辆位置标注与状态颜色区分、点击车辆弹出详情窗口：车牌、司机、任务、状态、地图图层切换：作业区域、禁入区域、排队区域、车辆轨迹回放（可选）",
      "sections": [
        "地图主区域",
        "车辆状态筛选与任务派发控制面板",
        "异常告警通知区域"
      ],
      "scenarioKey": "scenario-1782887819107-0",
      "scenarioName": "调度员现场调度",
      "originalPageKey": "scenario-1782887819107-0-page-1"
    },
    "generatedAt": "2026-07-01T07:30:36.998Z",
    "goal": "基于地图看板实时展示所有车辆的位置、状态（空闲、排队、任务中、异常）、作业区域，支持缩放、点击查看车辆详情",
    "features": [
      "实时车辆位置标注与状态颜色区分",
      "点击车辆弹出详情窗口：车牌",
      "司机",
      "任务",
      "状态",
      "地图图层切换：作业区域",
      "禁入区域",
      "排队区域",
      "车辆轨迹回放（可选）"
    ],
    "sections": [
      "地图主区域",
      "车辆状态筛选与任务派发控制面板",
      "异常告警通知区域"
    ]
  },
  "savedAt": "2026-07-01T15:42:14.330Z"
}
```
<!-- FDE_STEP_RESULT_JSON_END -->
