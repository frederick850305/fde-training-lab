# 07 前端原型方案

- 步骤标识：`prototype`
- 保存时间：2026-07-01T06:18:27.526823+00:00
- 用途：作为下一步工作台的输入来源。

## 内容摘要

- 已保存该步骤的结构化输出。

## 结构化数据

<!-- FDE_STEP_RESULT_JSON_START -->
```json
{
  "viewFiles": [
    {
      "file": "VehicleDispatchView.vue",
      "responsibility": "在地图上实时显示车辆位置、任务状态、空闲车辆、排队车辆和异常车辆，支持区域筛选和车辆详情查看。",
      "source": "页面设计：页面清单 + 页面详情"
    },
    {
      "file": "VehicleDispatchView.vue",
      "responsibility": "综合作业区域、车辆类型、任务优先级、距离远近等因素，智能推荐最佳车辆，支持调度员一键派车或手动调整。",
      "source": "页面设计：页面清单 + 页面详情"
    },
    {
      "file": "VehicleDispatchView.vue",
      "responsibility": "实时跟踪派车任务的执行状态（接单、到达、装卸、关闭），展示任务进度和异常标记，支持调度员介入处理。",
      "source": "页面设计：页面清单 + 页面详情"
    },
    {
      "file": "VehicleDispatchView.vue",
      "responsibility": "集中展示异常情况（排队超时、重复派车、车辆故障等），支持调度员临时调整任务、增派车辆、处理告警。",
      "source": "页面设计：页面清单 + 页面详情"
    },
    {
      "file": "StatisticsDashboardView.vue",
      "responsibility": "提供车辆利用率、任务完成率、平均等待时长、空驶率、车辆排队情况等核心效率指标的统计与可视化展示。",
      "source": "页面设计：页面清单 + 页面详情"
    },
    {
      "file": "StatisticsDashboardView.vue",
      "responsibility": "统计外协车辆使用次数、入场记录及费用相关数据，辅助外协费用管理决策。",
      "source": "页面设计：页面清单 + 页面详情"
    },
    {
      "file": "StatisticsDashboardView.vue",
      "responsibility": "支持将当前查看的统计报表或下钻数据导出为Excel、PDF等格式，便于存档与进一步分析。",
      "source": "页面设计：页面清单 + 页面详情"
    },
    {
      "file": "StatisticsDashboardView.vue",
      "responsibility": "允许从宏观统计图表演进到具体车辆、司机或区域的明细数据，支持多维分析。",
      "source": "页面设计：页面清单 + 页面详情"
    },
    {
      "file": "DriverTaskView.vue（子组件：TaskListSection.vue, TaskDetailPanel.vue）",
      "responsibility": "司机通过手机端接收调度下发的任务通知，展示任务详情（作业点、物资、路线等），支持查看历史任务记录。",
      "source": "页面设计：页面清单 + 页面详情"
    },
    {
      "file": "NavigationOverlay.vue（嵌入 DriverTaskView.vue）",
      "responsibility": "集成地图导航功能，根据任务作业点自动规划路线，提供语音播报和实时路况，支持一键导航到目标区域或门岗。",
      "source": "页面设计：页面清单 + 页面详情"
    },
    {
      "file": "ArrivalConfirmModal.vue",
      "responsibility": "司机到达作业点后，通过拍照或地理围栏签到确认到场，系统自动记录到达时间与位置，并可上传现场照片作为凭证。",
      "source": "页面设计：页面清单 + 页面详情"
    },
    {
      "file": "TaskCompletionForm.vue",
      "responsibility": "完成装卸或作业后，司机一键关闭任务，填写作业备注（如装卸数量、异常情况），系统更新任务状态为已完成并记录完成时间。",
      "source": "页面设计：页面清单 + 页面详情"
    },
    {
      "file": "GateCheckView.vue（集成入口）或 EntraceCheckComponent.vue",
      "responsibility": "门岗人员通过扫描车牌或二维码，系统自动核验车辆预约、派车或授权状态，显示放行或拦截结果，并记录入场时间。",
      "source": "页面设计：页面清单 + 页面详情"
    },
    {
      "file": "GateCheckView.vue（集成入口）或 ExitCheckComponent.vue",
      "responsibility": "车辆出场时，门岗人员执行核验并记录出场时间，更新车辆在场状态，确保出场车辆已无有效任务或预约。",
      "source": "页面设计：页面清单 + 页面详情"
    },
    {
      "file": "GateCheckView.vue（集成异常弹窗）或 ExceptionHandlingComponent.vue",
      "responsibility": "核验失败或异常情况时（如无预约、证照过期、未授权、车牌无法识别），门岗人员可进行人工干预处理，记录异常原因及处理结果并通知相关方。",
      "source": "页面设计：页面清单 + 页面详情"
    },
    {
      "file": "GateCheckView.vue（内嵌列表）或独立页面 GateLogView.vue",
      "responsibility": "门岗人员查询车辆入场、出场核验历史记录，可按车牌、时间范围、结果状态等条件进行筛选和详情查看。",
      "source": "页面设计：页面清单 + 页面详情"
    },
    {
      "file": "VehicleReservationView.vue",
      "responsibility": "外协或临时车辆申请人提交预约登记信息，包括车辆信息、司机信息、入场时间等，系统自动审批并生成预约记录。",
      "source": "页面设计：页面清单 + 页面详情"
    },
    {
      "file": "VehicleReservationView.vue",
      "responsibility": "预约通过后生成入场授权二维码，作为车辆入场凭证，支持下载或展示。",
      "source": "页面设计：页面清单 + 页面详情"
    },
    {
      "file": "VehicleReservationView.vue",
      "responsibility": "车辆到场后通过扫描入场码完成入场登记，记录入场时间、车辆、司机等信息，支持历史入场记录追溯。",
      "source": "页面设计：页面清单 + 页面详情"
    },
    {
      "file": "VehicleReservationView.vue",
      "responsibility": "车辆出场时核验出场信息，自动核销预约记录，记录出场时间。",
      "source": "页面设计：页面清单 + 页面详情"
    }
  ],
  "componentFiles": [
    {
      "file": "ScenarioHeader.vue",
      "responsibility": "承载页面标题、状态摘要和主操作入口。",
      "reusedBy": [
        "VehicleDispatchView.vue",
        "VehicleDispatchView.vue",
        "VehicleDispatchView.vue",
        "VehicleDispatchView.vue",
        "StatisticsDashboardView.vue",
        "StatisticsDashboardView.vue",
        "StatisticsDashboardView.vue",
        "StatisticsDashboardView.vue",
        "DriverTaskView.vue（子组件：TaskListSection.vue, TaskDetailPanel.vue）",
        "NavigationOverlay.vue（嵌入 DriverTaskView.vue）",
        "ArrivalConfirmModal.vue",
        "TaskCompletionForm.vue",
        "GateCheckView.vue（集成入口）或 EntraceCheckComponent.vue",
        "GateCheckView.vue（集成入口）或 ExitCheckComponent.vue",
        "GateCheckView.vue（集成异常弹窗）或 ExceptionHandlingComponent.vue",
        "GateCheckView.vue（内嵌列表）或独立页面 GateLogView.vue",
        "VehicleReservationView.vue",
        "VehicleReservationView.vue",
        "VehicleReservationView.vue",
        "VehicleReservationView.vue"
      ]
    },
    {
      "file": "ScenarioFilterBar.vue",
      "responsibility": "承载筛选条件、查询和重置动作。",
      "reusedBy": [
        "VehicleDispatchView.vue",
        "VehicleDispatchView.vue",
        "VehicleDispatchView.vue",
        "VehicleDispatchView.vue",
        "StatisticsDashboardView.vue",
        "StatisticsDashboardView.vue",
        "StatisticsDashboardView.vue",
        "StatisticsDashboardView.vue",
        "DriverTaskView.vue（子组件：TaskListSection.vue, TaskDetailPanel.vue）",
        "NavigationOverlay.vue（嵌入 DriverTaskView.vue）",
        "ArrivalConfirmModal.vue",
        "TaskCompletionForm.vue",
        "GateCheckView.vue（集成入口）或 EntraceCheckComponent.vue",
        "GateCheckView.vue（集成入口）或 ExitCheckComponent.vue",
        "GateCheckView.vue（集成异常弹窗）或 ExceptionHandlingComponent.vue",
        "GateCheckView.vue（内嵌列表）或独立页面 GateLogView.vue",
        "VehicleReservationView.vue",
        "VehicleReservationView.vue",
        "VehicleReservationView.vue",
        "VehicleReservationView.vue"
      ]
    },
    {
      "file": "ScenarioDetailPanel.vue",
      "responsibility": "承载当前记录详情、处理表单和状态反馈。",
      "reusedBy": [
        "VehicleDispatchView.vue",
        "VehicleDispatchView.vue",
        "VehicleDispatchView.vue",
        "VehicleDispatchView.vue",
        "StatisticsDashboardView.vue",
        "StatisticsDashboardView.vue",
        "StatisticsDashboardView.vue",
        "StatisticsDashboardView.vue",
        "DriverTaskView.vue（子组件：TaskListSection.vue, TaskDetailPanel.vue）",
        "NavigationOverlay.vue（嵌入 DriverTaskView.vue）",
        "ArrivalConfirmModal.vue",
        "TaskCompletionForm.vue",
        "GateCheckView.vue（集成入口）或 EntraceCheckComponent.vue",
        "GateCheckView.vue（集成入口）或 ExitCheckComponent.vue",
        "GateCheckView.vue（集成异常弹窗）或 ExceptionHandlingComponent.vue",
        "GateCheckView.vue（内嵌列表）或独立页面 GateLogView.vue",
        "VehicleReservationView.vue",
        "VehicleReservationView.vue",
        "VehicleReservationView.vue",
        "VehicleReservationView.vue"
      ]
    },
    {
      "file": "StatusTag.vue",
      "responsibility": "根据页面设计阶段的文件建议拆分出的可复用组件。",
      "reusedBy": [
        "VehicleDispatchView.vue",
        "VehicleDispatchView.vue",
        "VehicleDispatchView.vue",
        "VehicleDispatchView.vue",
        "StatisticsDashboardView.vue",
        "StatisticsDashboardView.vue",
        "StatisticsDashboardView.vue",
        "StatisticsDashboardView.vue",
        "DriverTaskView.vue（子组件：TaskListSection.vue, TaskDetailPanel.vue）",
        "NavigationOverlay.vue（嵌入 DriverTaskView.vue）",
        "ArrivalConfirmModal.vue",
        "TaskCompletionForm.vue",
        "GateCheckView.vue（集成入口）或 EntraceCheckComponent.vue",
        "GateCheckView.vue（集成入口）或 ExitCheckComponent.vue",
        "GateCheckView.vue（集成异常弹窗）或 ExceptionHandlingComponent.vue",
        "GateCheckView.vue（内嵌列表）或独立页面 GateLogView.vue",
        "VehicleReservationView.vue",
        "VehicleReservationView.vue",
        "VehicleReservationView.vue",
        "VehicleReservationView.vue"
      ]
    },
    {
      "file": "DataTable.vue",
      "responsibility": "承载列表展示、分页和行级操作。",
      "reusedBy": [
        "VehicleDispatchView.vue",
        "VehicleDispatchView.vue",
        "VehicleDispatchView.vue",
        "VehicleDispatchView.vue",
        "StatisticsDashboardView.vue",
        "StatisticsDashboardView.vue",
        "StatisticsDashboardView.vue",
        "StatisticsDashboardView.vue",
        "DriverTaskView.vue（子组件：TaskListSection.vue, TaskDetailPanel.vue）",
        "NavigationOverlay.vue（嵌入 DriverTaskView.vue）",
        "ArrivalConfirmModal.vue",
        "TaskCompletionForm.vue",
        "GateCheckView.vue（集成入口）或 EntraceCheckComponent.vue",
        "GateCheckView.vue（集成入口）或 ExitCheckComponent.vue",
        "GateCheckView.vue（集成异常弹窗）或 ExceptionHandlingComponent.vue",
        "GateCheckView.vue（内嵌列表）或独立页面 GateLogView.vue",
        "VehicleReservationView.vue",
        "VehicleReservationView.vue",
        "VehicleReservationView.vue",
        "VehicleReservationView.vue"
      ]
    }
  ],
  "mockDataFiles": [
    {
      "file": "ScenarioMockData.js",
      "content": "承载页面设计阶段确认的页面清单、导航结构、页面区域和示例业务数据。",
      "usedBy": [
        "VehicleDispatchView.vue",
        "VehicleDispatchView.vue",
        "VehicleDispatchView.vue",
        "VehicleDispatchView.vue",
        "StatisticsDashboardView.vue",
        "StatisticsDashboardView.vue",
        "StatisticsDashboardView.vue",
        "StatisticsDashboardView.vue",
        "DriverTaskView.vue（子组件：TaskListSection.vue, TaskDetailPanel.vue）",
        "NavigationOverlay.vue（嵌入 DriverTaskView.vue）",
        "ArrivalConfirmModal.vue",
        "TaskCompletionForm.vue",
        "GateCheckView.vue（集成入口）或 EntraceCheckComponent.vue",
        "GateCheckView.vue（集成入口）或 ExitCheckComponent.vue",
        "GateCheckView.vue（集成异常弹窗）或 ExceptionHandlingComponent.vue",
        "GateCheckView.vue（内嵌列表）或独立页面 GateLogView.vue",
        "VehicleReservationView.vue",
        "VehicleReservationView.vue",
        "VehicleReservationView.vue",
        "VehicleReservationView.vue"
      ]
    }
  ],
  "generationSteps": [
    {
      "step": 1,
      "title": "先生成 mock 数据",
      "description": "先创建 prototypeMockData.js，保证页面可以独立运行和展示。"
    },
    {
      "step": 2,
      "title": "再生成通用组件",
      "description": "优先生成 MetricCard、StatusTag、DataTable、EmptyState，避免页面重复代码。"
    },
    {
      "step": 3,
      "title": "再生成 P0 页面",
      "description": "先完成 ProjectOverviewView、ScheduleTrackingView、IssueTrackingView 三个核心页面。"
    }
  ],
  "pageDesign": {
    "scenario": {
      "key": "scenario-1782831312544-4",
      "name": "外协车辆预约入场",
      "priority": "P1",
      "description": "外协或临时车辆申请人通过系统提交预约登记（车辆信息、司机、入场时间等），系统自动审批（无分级限制），生成入场授权二维码；到场后凭码入场，出场后自动核销。",
      "workflow": [
        "预约登记",
        "提交申请（自动审批）",
        "获取入场授权码",
        "到场扫码入场",
        "出场核验"
      ],
      "pageMapping": {
        "role": "外协/临时车辆申请人",
        "page": "VehicleReservationView.vue",
        "modules": [
          "预约登记",
          "授权凭证",
          "入场记录",
          "出场核验"
        ]
      },
      "savedAt": "22:56"
    },
    "currentScenarioKey": "scenario-1782831312544-4",
    "selectedPageKey": "scenario-1782831312544-4-page-1",
    "page": {
      "key": "scenario-1782831312544-4-page-1",
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
      ]
    },
    "currentPage": {
      "key": "scenario-1782831312544-4-page-1",
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
      ]
    },
    "currentPageSections": [
      "预约信息录入区",
      "提交与审批反馈区"
    ],
    "pageDesign": {
      "pages": [
        {
          "key": "scenario-1782831312544-0-page-1",
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
          "scenarioKey": "scenario-1782831312544-0",
          "scenarioName": "调度员现场调度"
        },
        {
          "key": "scenario-1782831312544-0-page-2",
          "priority": "P1",
          "type": "辅助页",
          "name": "智能派车页面",
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
          "scenarioKey": "scenario-1782831312544-0",
          "scenarioName": "调度员现场调度"
        },
        {
          "key": "scenario-1782831312544-0-page-3",
          "priority": "P1",
          "type": "辅助页",
          "name": "任务跟踪页面",
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
          "scenarioKey": "scenario-1782831312544-0",
          "scenarioName": "调度员现场调度"
        },
        {
          "key": "scenario-1782831312544-0-page-4",
          "priority": "P1",
          "type": "辅助页",
          "name": "异常处理页面",
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
          "scenarioKey": "scenario-1782831312544-0",
          "scenarioName": "调度员现场调度"
        },
        {
          "key": "scenario-1782831312544-1-page-1",
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
          "scenarioKey": "scenario-1782831312544-1",
          "scenarioName": "管理人员统计分析"
        },
        {
          "key": "scenario-1782831312544-1-page-2",
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
          "scenarioKey": "scenario-1782831312544-1",
          "scenarioName": "管理人员统计分析"
        },
        {
          "key": "scenario-1782831312544-1-page-3",
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
          "scenarioKey": "scenario-1782831312544-1",
          "scenarioName": "管理人员统计分析"
        },
        {
          "key": "scenario-1782831312544-1-page-4",
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
          "scenarioKey": "scenario-1782831312544-1",
          "scenarioName": "管理人员统计分析"
        },
        {
          "key": "scenario-1782831312544-2-page-1",
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
          "scenarioKey": "scenario-1782831312544-2",
          "scenarioName": "司机执行任务"
        },
        {
          "key": "scenario-1782831312544-2-page-2",
          "priority": "P1",
          "type": "辅助页",
          "name": "导航与路线指引页面",
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
          "scenarioKey": "scenario-1782831312544-2",
          "scenarioName": "司机执行任务"
        },
        {
          "key": "scenario-1782831312544-2-page-3",
          "priority": "P1",
          "type": "辅助页",
          "name": "现场到达确认与签到页面",
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
          "scenarioKey": "scenario-1782831312544-2",
          "scenarioName": "司机执行任务"
        },
        {
          "key": "scenario-1782831312544-2-page-4",
          "priority": "P1",
          "type": "辅助页",
          "name": "任务完成与关闭操作页面",
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
          "scenarioKey": "scenario-1782831312544-2",
          "scenarioName": "司机执行任务"
        },
        {
          "key": "scenario-1782831312544-3-page-1",
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
          "scenarioName": "门岗入场核验"
        },
        {
          "key": "scenario-1782831312544-3-page-2",
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
          "scenarioName": "门岗入场核验"
        },
        {
          "key": "scenario-1782831312544-3-page-3",
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
          "scenarioName": "门岗入场核验"
        },
        {
          "key": "scenario-1782831312544-3-page-4",
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
          "scenarioName": "门岗入场核验"
        },
        {
          "key": "scenario-1782831312544-4-page-1",
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
          "scenarioName": "外协车辆预约入场"
        },
        {
          "key": "scenario-1782831312544-4-page-2",
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
          "scenarioName": "外协车辆预约入场"
        },
        {
          "key": "scenario-1782831312544-4-page-3",
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
          "scenarioName": "外协车辆预约入场"
        },
        {
          "key": "scenario-1782831312544-4-page-4",
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
          "scenarioName": "外协车辆预约入场"
        }
      ],
      "navigation": [
        {
          "label": "调度员现场调度工作台",
          "target": "VehicleDispatchView.vue",
          "default": true,
          "scenarioKey": "scenario-1782831312544-0",
          "scenarioName": "调度员现场调度"
        },
        {
          "label": "智能派车页面",
          "target": "VehicleDispatchView.vue",
          "default": false,
          "scenarioKey": "scenario-1782831312544-0",
          "scenarioName": "调度员现场调度"
        },
        {
          "label": "任务跟踪页面",
          "target": "VehicleDispatchView.vue",
          "default": false,
          "scenarioKey": "scenario-1782831312544-0",
          "scenarioName": "调度员现场调度"
        },
        {
          "label": "异常处理页面",
          "target": "VehicleDispatchView.vue",
          "default": false,
          "scenarioKey": "scenario-1782831312544-0",
          "scenarioName": "调度员现场调度"
        },
        {
          "label": "管理人员统计分析工作台",
          "target": "StatisticsDashboardView.vue",
          "default": true,
          "scenarioKey": "scenario-1782831312544-1",
          "scenarioName": "管理人员统计分析"
        },
        {
          "label": "费用分析页面",
          "target": "StatisticsDashboardView.vue",
          "default": false,
          "scenarioKey": "scenario-1782831312544-1",
          "scenarioName": "管理人员统计分析"
        },
        {
          "label": "报表导出页面",
          "target": "StatisticsDashboardView.vue",
          "default": false,
          "scenarioKey": "scenario-1782831312544-1",
          "scenarioName": "管理人员统计分析"
        },
        {
          "label": "数据下钻页面",
          "target": "StatisticsDashboardView.vue",
          "default": false,
          "scenarioKey": "scenario-1782831312544-1",
          "scenarioName": "管理人员统计分析"
        },
        {
          "label": "司机执行任务工作台",
          "target": "DriverTaskView.vue（子组件：TaskListSection.vue, TaskDetailPanel.vue）",
          "default": true,
          "scenarioKey": "scenario-1782831312544-2",
          "scenarioName": "司机执行任务"
        },
        {
          "label": "导航与路线指引页面",
          "target": "NavigationOverlay.vue（嵌入 DriverTaskView.vue）",
          "default": false,
          "scenarioKey": "scenario-1782831312544-2",
          "scenarioName": "司机执行任务"
        },
        {
          "label": "现场到达确认与签到页面",
          "target": "ArrivalConfirmModal.vue",
          "default": false,
          "scenarioKey": "scenario-1782831312544-2",
          "scenarioName": "司机执行任务"
        },
        {
          "label": "任务完成与关闭操作页面",
          "target": "TaskCompletionForm.vue",
          "default": false,
          "scenarioKey": "scenario-1782831312544-2",
          "scenarioName": "司机执行任务"
        },
        {
          "label": "门岗入场核验工作台",
          "target": "GateCheckView.vue（集成入口）或 EntraceCheckComponent.vue",
          "default": true,
          "scenarioKey": "scenario-1782831312544-3",
          "scenarioName": "门岗入场核验"
        },
        {
          "label": "出场核验页面",
          "target": "GateCheckView.vue（集成入口）或 ExitCheckComponent.vue",
          "default": false,
          "scenarioKey": "scenario-1782831312544-3",
          "scenarioName": "门岗入场核验"
        },
        {
          "label": "异常处理页面",
          "target": "GateCheckView.vue（集成异常弹窗）或 ExceptionHandlingComponent.vue",
          "default": false,
          "scenarioKey": "scenario-1782831312544-3",
          "scenarioName": "门岗入场核验"
        },
        {
          "label": "核验日志查询页面",
          "target": "GateCheckView.vue（内嵌列表）或独立页面 GateLogView.vue",
          "default": false,
          "scenarioKey": "scenario-1782831312544-3",
          "scenarioName": "门岗入场核验"
        },
        {
          "label": "外协车辆预约入场工作台",
          "target": "VehicleReservationView.vue",
          "default": true,
          "scenarioKey": "scenario-1782831312544-4",
          "scenarioName": "外协车辆预约入场"
        },
        {
          "label": "授权凭证页面",
          "target": "VehicleReservationView.vue",
          "default": false,
          "scenarioKey": "scenario-1782831312544-4",
          "scenarioName": "外协车辆预约入场"
        },
        {
          "label": "入场记录页面",
          "target": "VehicleReservationView.vue",
          "default": false,
          "scenarioKey": "scenario-1782831312544-4",
          "scenarioName": "外协车辆预约入场"
        },
        {
          "label": "出场核验页面",
          "target": "VehicleReservationView.vue",
          "default": false,
          "scenarioKey": "scenario-1782831312544-4",
          "scenarioName": "外协车辆预约入场"
        }
      ],
      "fileStructure": {
        "views": [
          "VehicleDispatchView.vue",
          "StatisticsDashboardView.vue",
          "DriverTaskView.vue（子组件：TaskListSection.vue, TaskDetailPanel.vue）",
          "NavigationOverlay.vue（嵌入 DriverTaskView.vue）",
          "ArrivalConfirmModal.vue",
          "TaskCompletionForm.vue",
          "GateCheckView.vue（集成入口）或 EntraceCheckComponent.vue",
          "GateCheckView.vue（集成入口）或 ExitCheckComponent.vue",
          "GateCheckView.vue（集成异常弹窗）或 ExceptionHandlingComponent.vue",
          "GateCheckView.vue（内嵌列表）或独立页面 GateLogView.vue",
          "VehicleReservationView.vue"
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
        "key": "scenario-1782831312544-0",
        "name": "调度员现场调度",
        "priority": "P0",
        "pageCount": 4,
        "pages": [
          {
            "key": "scenario-1782831312544-0-page-1",
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
            ]
          },
          {
            "key": "scenario-1782831312544-0-page-2",
            "priority": "P1",
            "type": "辅助页",
            "name": "智能派车页面",
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
            ]
          },
          {
            "key": "scenario-1782831312544-0-page-3",
            "priority": "P1",
            "type": "辅助页",
            "name": "任务跟踪页面",
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
            ]
          },
          {
            "key": "scenario-1782831312544-0-page-4",
            "priority": "P1",
            "type": "辅助页",
            "name": "异常处理页面",
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
            ]
          }
        ]
      },
      {
        "key": "scenario-1782831312544-1",
        "name": "管理人员统计分析",
        "priority": "P0",
        "pageCount": 4,
        "pages": [
          {
            "key": "scenario-1782831312544-1-page-1",
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
            ]
          },
          {
            "key": "scenario-1782831312544-1-page-2",
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
            ]
          },
          {
            "key": "scenario-1782831312544-1-page-3",
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
            ]
          },
          {
            "key": "scenario-1782831312544-1-page-4",
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
            ]
          }
        ]
      },
      {
        "key": "scenario-1782831312544-2",
        "name": "司机执行任务",
        "priority": "P1",
        "pageCount": 4,
        "pages": [
          {
            "key": "scenario-1782831312544-2-page-1",
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
            ]
          },
          {
            "key": "scenario-1782831312544-2-page-2",
            "priority": "P1",
            "type": "辅助页",
            "name": "导航与路线指引页面",
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
            ]
          },
          {
            "key": "scenario-1782831312544-2-page-3",
            "priority": "P1",
            "type": "辅助页",
            "name": "现场到达确认与签到页面",
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
            ]
          },
          {
            "key": "scenario-1782831312544-2-page-4",
            "priority": "P1",
            "type": "辅助页",
            "name": "任务完成与关闭操作页面",
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
            ]
          }
        ]
      },
      {
        "key": "scenario-1782831312544-3",
        "name": "门岗入场核验",
        "priority": "P1",
        "pageCount": 4,
        "pages": [
          {
            "key": "scenario-1782831312544-3-page-1",
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
            ]
          },
          {
            "key": "scenario-1782831312544-3-page-2",
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
            ]
          },
          {
            "key": "scenario-1782831312544-3-page-3",
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
            ]
          },
          {
            "key": "scenario-1782831312544-3-page-4",
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
            ]
          }
        ]
      },
      {
        "key": "scenario-1782831312544-4",
        "name": "外协车辆预约入场",
        "priority": "P1",
        "pageCount": 4,
        "pages": [
          {
            "key": "scenario-1782831312544-4-page-1",
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
            ]
          },
          {
            "key": "scenario-1782831312544-4-page-2",
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
            ]
          },
          {
            "key": "scenario-1782831312544-4-page-3",
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
            ]
          },
          {
            "key": "scenario-1782831312544-4-page-4",
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
            ]
          }
        ]
      }
    ],
    "scenarioDesigns": {
      "scenario-1782831312544-0": {
        "pages": [
          {
            "key": "scenario-1782831312544-0-page-1",
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
            ]
          },
          {
            "key": "scenario-1782831312544-0-page-2",
            "priority": "P1",
            "type": "辅助页",
            "name": "智能派车页面",
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
            ]
          },
          {
            "key": "scenario-1782831312544-0-page-3",
            "priority": "P1",
            "type": "辅助页",
            "name": "任务跟踪页面",
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
            ]
          },
          {
            "key": "scenario-1782831312544-0-page-4",
            "priority": "P1",
            "type": "辅助页",
            "name": "异常处理页面",
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
            ]
          }
        ],
        "navigation": [
          {
            "label": "调度员现场调度工作台",
            "target": "VehicleDispatchView.vue",
            "default": true
          },
          {
            "label": "智能派车页面",
            "target": "VehicleDispatchView.vue",
            "default": false
          },
          {
            "label": "任务跟踪页面",
            "target": "VehicleDispatchView.vue",
            "default": false
          },
          {
            "label": "异常处理页面",
            "target": "VehicleDispatchView.vue",
            "default": false
          }
        ],
        "fileStructure": {
          "views": [
            "VehicleDispatchView.vue",
            "VehicleDispatchView.vue",
            "VehicleDispatchView.vue",
            "VehicleDispatchView.vue"
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
      "scenario-1782831312544-1": {
        "pages": [
          {
            "key": "scenario-1782831312544-1-page-1",
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
            ]
          },
          {
            "key": "scenario-1782831312544-1-page-2",
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
            ]
          },
          {
            "key": "scenario-1782831312544-1-page-3",
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
            ]
          },
          {
            "key": "scenario-1782831312544-1-page-4",
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
            ]
          }
        ],
        "navigation": [
          {
            "label": "管理人员统计分析工作台",
            "target": "StatisticsDashboardView.vue",
            "default": true
          },
          {
            "label": "费用分析页面",
            "target": "StatisticsDashboardView.vue",
            "default": false
          },
          {
            "label": "报表导出页面",
            "target": "StatisticsDashboardView.vue",
            "default": false
          },
          {
            "label": "数据下钻页面",
            "target": "StatisticsDashboardView.vue",
            "default": false
          }
        ],
        "fileStructure": {
          "views": [
            "StatisticsDashboardView.vue",
            "StatisticsDashboardView.vue",
            "StatisticsDashboardView.vue",
            "StatisticsDashboardView.vue"
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
      "scenario-1782831312544-2": {
        "pages": [
          {
            "key": "scenario-1782831312544-2-page-1",
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
            ]
          },
          {
            "key": "scenario-1782831312544-2-page-2",
            "priority": "P1",
            "type": "辅助页",
            "name": "导航与路线指引页面",
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
            ]
          },
          {
            "key": "scenario-1782831312544-2-page-3",
            "priority": "P1",
            "type": "辅助页",
            "name": "现场到达确认与签到页面",
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
            ]
          },
          {
            "key": "scenario-1782831312544-2-page-4",
            "priority": "P1",
            "type": "辅助页",
            "name": "任务完成与关闭操作页面",
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
            ]
          }
        ],
        "navigation": [
          {
            "label": "司机执行任务工作台",
            "target": "DriverTaskView.vue（子组件：TaskListSection.vue, TaskDetailPanel.vue）",
            "default": true
          },
          {
            "label": "导航与路线指引页面",
            "target": "NavigationOverlay.vue（嵌入 DriverTaskView.vue）",
            "default": false
          },
          {
            "label": "现场到达确认与签到页面",
            "target": "ArrivalConfirmModal.vue",
            "default": false
          },
          {
            "label": "任务完成与关闭操作页面",
            "target": "TaskCompletionForm.vue",
            "default": false
          }
        ],
        "fileStructure": {
          "views": [
            "DriverTaskView.vue（子组件：TaskListSection.vue, TaskDetailPanel.vue）",
            "NavigationOverlay.vue（嵌入 DriverTaskView.vue）",
            "ArrivalConfirmModal.vue",
            "TaskCompletionForm.vue"
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
      "scenario-1782831312544-3": {
        "pages": [
          {
            "key": "scenario-1782831312544-3-page-1",
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
            ]
          },
          {
            "key": "scenario-1782831312544-3-page-2",
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
            ]
          },
          {
            "key": "scenario-1782831312544-3-page-3",
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
            ]
          },
          {
            "key": "scenario-1782831312544-3-page-4",
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
            ]
          }
        ],
        "navigation": [
          {
            "label": "门岗入场核验工作台",
            "target": "GateCheckView.vue（集成入口）或 EntraceCheckComponent.vue",
            "default": true
          },
          {
            "label": "出场核验页面",
            "target": "GateCheckView.vue（集成入口）或 ExitCheckComponent.vue",
            "default": false
          },
          {
            "label": "异常处理页面",
            "target": "GateCheckView.vue（集成异常弹窗）或 ExceptionHandlingComponent.vue",
            "default": false
          },
          {
            "label": "核验日志查询页面",
            "target": "GateCheckView.vue（内嵌列表）或独立页面 GateLogView.vue",
            "default": false
          }
        ],
        "fileStructure": {
          "views": [
            "GateCheckView.vue（集成入口）或 EntraceCheckComponent.vue",
            "GateCheckView.vue（集成入口）或 ExitCheckComponent.vue",
            "GateCheckView.vue（集成异常弹窗）或 ExceptionHandlingComponent.vue",
            "GateCheckView.vue（内嵌列表）或独立页面 GateLogView.vue"
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
      "scenario-1782831312544-4": {
        "pages": [
          {
            "key": "scenario-1782831312544-4-page-1",
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
            ]
          },
          {
            "key": "scenario-1782831312544-4-page-2",
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
            ]
          },
          {
            "key": "scenario-1782831312544-4-page-3",
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
            ]
          },
          {
            "key": "scenario-1782831312544-4-page-4",
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
            ]
          }
        ],
        "navigation": [
          {
            "label": "外协车辆预约入场工作台",
            "target": "VehicleReservationView.vue",
            "default": true
          },
          {
            "label": "授权凭证页面",
            "target": "VehicleReservationView.vue",
            "default": false
          },
          {
            "label": "入场记录页面",
            "target": "VehicleReservationView.vue",
            "default": false
          },
          {
            "label": "出场核验页面",
            "target": "VehicleReservationView.vue",
            "default": false
          }
        ],
        "fileStructure": {
          "views": [
            "VehicleReservationView.vue",
            "VehicleReservationView.vue",
            "VehicleReservationView.vue",
            "VehicleReservationView.vue"
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
    "savedAt": "2026-07-01T06:10:57.724Z"
  },
  "apiContract": {
    "contracts": [
      {
        "key": "scenario-1782831312544-0-scenario-1782831312544-0-page-1-0-contract",
        "method": "GET/POST",
        "name": "调度员现场调度工作台接口契约",
        "path": "/api/resources",
        "goal": "支撑「调度员现场调度工作台」页面的数据查询、保存和状态反馈。",
        "sourcePage": "调度员现场调度工作台",
        "trigger": "页面初始化、查询刷新、保存当前处理结果",
        "requestParams": [
          {
            "name": "region",
            "type": "select",
            "required": false,
            "description": "按作业区域筛选车辆显示"
          },
          {
            "name": "vehicleType",
            "type": "select",
            "required": false,
            "description": "按车辆类型筛选"
          },
          {
            "name": "vehicleStatus",
            "type": "select",
            "required": false,
            "description": "按车辆状态（空闲、任务、排队、异常）筛选"
          },
          {
            "name": "keyword",
            "type": "input",
            "required": false,
            "description": "按车牌号或司机名称搜索"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "资源数据处理成功",
          "data": {
            "page_key": "scenario-1782831312544-0-scenario-1782831312544-0-page-1-0",
            "records": [],
            "summary": {}
          }
        },
        "errorResponse": {
          "success": false,
          "message": "资源数据处理失败",
          "data": null,
          "error_code": "RESOURCES_FAILED"
        },
        "errorCodes": [
          {
            "code": "RESOURCES_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面表单旁提示具体字段错误，并保留用户已输入内容。"
          },
          {
            "code": "RESOURCES_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ]
      },
      {
        "key": "scenario-1782831312544-0-scenario-1782831312544-0-page-2-1-contract",
        "method": "GET/POST",
        "name": "VehicleDispatch接口契约",
        "path": "/api/scenario-1782831312544-0-scenario-1782831312544-0-page-2-1",
        "goal": "支撑「VehicleDispatch」页面的数据查询、保存和状态反馈。",
        "sourcePage": "VehicleDispatch",
        "trigger": "页面初始化、查询刷新、保存当前处理结果",
        "requestParams": [
          {
            "name": "approvalResult",
            "type": "select",
            "required": true,
            "description": "对用车申请进行通过或驳回操作"
          },
          {
            "name": "approvalOpinion",
            "type": "textarea",
            "required": false,
            "description": "审批时的补充说明或驳回原因"
          },
          {
            "name": "selectedVehicle",
            "type": "select",
            "required": true,
            "description": "从智能推荐列表或手动选择中确定要派出的车辆"
          },
          {
            "name": "priorityOverride",
            "type": "select",
            "required": false,
            "description": "手动调整任务优先级（高、中、低）"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "VehicleDispatch数据处理成功",
          "data": {
            "page_key": "scenario-1782831312544-0-scenario-1782831312544-0-page-2-1",
            "records": [],
            "summary": {}
          }
        },
        "errorResponse": {
          "success": false,
          "message": "VehicleDispatch数据处理失败",
          "data": null,
          "error_code": "SCENARIO_1782831312544_0_SCENARIO_1782831312544_0_PAGE_2_1_FAILED"
        },
        "errorCodes": [
          {
            "code": "SCENARIO_1782831312544_0_SCENARIO_1782831312544_0_PAGE_2_1_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面表单旁提示具体字段错误，并保留用户已输入内容。"
          },
          {
            "code": "SCENARIO_1782831312544_0_SCENARIO_1782831312544_0_PAGE_2_1_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ]
      },
      {
        "key": "scenario-1782831312544-0-scenario-1782831312544-0-page-3-2-contract",
        "method": "GET/POST",
        "name": "VehicleDispatch接口契约",
        "path": "/api/scenario-1782831312544-0-scenario-1782831312544-0-page-3-2",
        "goal": "支撑「VehicleDispatch」页面的数据查询、保存和状态反馈。",
        "sourcePage": "VehicleDispatch",
        "trigger": "页面初始化、查询刷新、保存当前处理结果",
        "requestParams": [
          {
            "name": "taskId",
            "type": "string",
            "required": false,
            "description": "系统自动生成的唯一任务标识"
          },
          {
            "name": "vehiclePlate",
            "type": "string",
            "required": false,
            "description": "执行任务的车辆车牌"
          },
          {
            "name": "driverName",
            "type": "string",
            "required": false,
            "description": "当前任务司机"
          },
          {
            "name": "status",
            "type": "enum",
            "required": false,
            "description": "任务当前状态：待接单、已接单、到达、装卸中、已完成、异常"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "VehicleDispatch数据处理成功",
          "data": {
            "page_key": "scenario-1782831312544-0-scenario-1782831312544-0-page-3-2",
            "records": [],
            "summary": {}
          }
        },
        "errorResponse": {
          "success": false,
          "message": "VehicleDispatch数据处理失败",
          "data": null,
          "error_code": "SCENARIO_1782831312544_0_SCENARIO_1782831312544_0_PAGE_3_2_FAILED"
        },
        "errorCodes": [
          {
            "code": "SCENARIO_1782831312544_0_SCENARIO_1782831312544_0_PAGE_3_2_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面表单旁提示具体字段错误，并保留用户已输入内容。"
          },
          {
            "code": "SCENARIO_1782831312544_0_SCENARIO_1782831312544_0_PAGE_3_2_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ]
      },
      {
        "key": "scenario-1782831312544-0-scenario-1782831312544-0-page-4-3-contract",
        "method": "GET/POST",
        "name": "VehicleDispatch接口契约",
        "path": "/api/scenario-1782831312544-0-scenario-1782831312544-0-page-4-3",
        "goal": "支撑「VehicleDispatch」页面的数据查询、保存和状态反馈。",
        "sourcePage": "VehicleDispatch",
        "trigger": "页面初始化、查询刷新、保存当前处理结果",
        "requestParams": [
          {
            "name": "exceptionType",
            "type": "select",
            "required": true,
            "description": "选择异常类型：排队超时、重复派车、车辆故障、位置偏移等"
          },
          {
            "name": "exceptionDescription",
            "type": "textarea",
            "required": true,
            "description": "详细描述异常情况"
          },
          {
            "name": "vehiclePlate",
            "type": "text",
            "required": true,
            "description": "关联车辆的车牌号"
          },
          {
            "name": "driverName",
            "type": "text",
            "required": false,
            "description": "关联司机姓名"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "VehicleDispatch数据处理成功",
          "data": {
            "page_key": "scenario-1782831312544-0-scenario-1782831312544-0-page-4-3",
            "records": [],
            "summary": {}
          }
        },
        "errorResponse": {
          "success": false,
          "message": "VehicleDispatch数据处理失败",
          "data": null,
          "error_code": "SCENARIO_1782831312544_0_SCENARIO_1782831312544_0_PAGE_4_3_FAILED"
        },
        "errorCodes": [
          {
            "code": "SCENARIO_1782831312544_0_SCENARIO_1782831312544_0_PAGE_4_3_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面表单旁提示具体字段错误，并保留用户已输入内容。"
          },
          {
            "code": "SCENARIO_1782831312544_0_SCENARIO_1782831312544_0_PAGE_4_3_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ]
      },
      {
        "key": "scenario-1782831312544-1-scenario-1782831312544-1-page-1-0-contract",
        "method": "GET/POST",
        "name": "管理人员统计分析工作台接口契约",
        "path": "/api/scenario-1782831312544-1-scenario-1782831312544-1-page-1-0",
        "goal": "支撑「管理人员统计分析工作台」页面的数据查询、保存和状态反馈。",
        "sourcePage": "管理人员统计分析工作台",
        "trigger": "页面初始化、查询刷新、保存当前处理结果",
        "requestParams": [
          {
            "name": "reportType",
            "type": "select",
            "required": true,
            "description": "选择要查看的统计报表类型，如车辆利用率、任务完成率等"
          },
          {
            "name": "timeRange",
            "type": "daterange",
            "required": true,
            "description": "选择统计数据的起止时间"
          },
          {
            "name": "region",
            "type": "select",
            "required": false,
            "description": "按作业区域筛选统计数据"
          },
          {
            "name": "vehicleType",
            "type": "select",
            "required": false,
            "description": "按车辆类型筛选统计数据"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "管理人员统计分析工作台数据处理成功",
          "data": {
            "page_key": "scenario-1782831312544-1-scenario-1782831312544-1-page-1-0",
            "records": [],
            "summary": {}
          }
        },
        "errorResponse": {
          "success": false,
          "message": "管理人员统计分析工作台数据处理失败",
          "data": null,
          "error_code": "SCENARIO_1782831312544_1_SCENARIO_1782831312544_1_PAGE_1_0_FAILED"
        },
        "errorCodes": [
          {
            "code": "SCENARIO_1782831312544_1_SCENARIO_1782831312544_1_PAGE_1_0_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面表单旁提示具体字段错误，并保留用户已输入内容。"
          },
          {
            "code": "SCENARIO_1782831312544_1_SCENARIO_1782831312544_1_PAGE_1_0_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ]
      },
      {
        "key": "scenario-1782831312544-1-scenario-1782831312544-1-page-2-1-contract",
        "method": "GET/POST",
        "name": "费用分析页面接口契约",
        "path": "/api/scenario-1782831312544-1-scenario-1782831312544-1-page-2-1",
        "goal": "支撑「费用分析页面」页面的数据查询、保存和状态反馈。",
        "sourcePage": "费用分析页面",
        "trigger": "页面初始化、查询刷新、保存当前处理结果",
        "requestParams": [
          {
            "name": "startDate",
            "type": "date",
            "required": true,
            "description": "统计时间范围的起始日期"
          },
          {
            "name": "endDate",
            "type": "date",
            "required": true,
            "description": "统计时间范围的结束日期"
          },
          {
            "name": "vehicleType",
            "type": "select",
            "required": false,
            "description": "按车辆类型筛选（如外协、临时等）"
          },
          {
            "name": "vehiclePlate",
            "type": "input",
            "required": false,
            "description": "按车牌号模糊搜索"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "费用分析页面数据处理成功",
          "data": {
            "page_key": "scenario-1782831312544-1-scenario-1782831312544-1-page-2-1",
            "records": [],
            "summary": {}
          }
        },
        "errorResponse": {
          "success": false,
          "message": "费用分析页面数据处理失败",
          "data": null,
          "error_code": "SCENARIO_1782831312544_1_SCENARIO_1782831312544_1_PAGE_2_1_FAILED"
        },
        "errorCodes": [
          {
            "code": "SCENARIO_1782831312544_1_SCENARIO_1782831312544_1_PAGE_2_1_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面表单旁提示具体字段错误，并保留用户已输入内容。"
          },
          {
            "code": "SCENARIO_1782831312544_1_SCENARIO_1782831312544_1_PAGE_2_1_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ]
      },
      {
        "key": "scenario-1782831312544-1-scenario-1782831312544-1-page-3-2-contract",
        "method": "GET/POST",
        "name": "报表导出页面接口契约",
        "path": "/api/scenario-1782831312544-1-scenario-1782831312544-1-page-3-2",
        "goal": "支撑「报表导出页面」页面的数据查询、保存和状态反馈。",
        "sourcePage": "报表导出页面",
        "trigger": "页面初始化、查询刷新、保存当前处理结果",
        "requestParams": [
          {
            "name": "reportType",
            "type": "select",
            "required": true,
            "description": "选择要导出的报表类型，例如车辆利用率报表、任务完成率报表等。"
          },
          {
            "name": "timeRange",
            "type": "daterange",
            "required": true,
            "description": "选择数据导出涵盖的时间范围。"
          },
          {
            "name": "exportFormat",
            "type": "select",
            "required": true,
            "description": "选择导出文件格式，支持Excel或PDF。"
          },
          {
            "name": "scope",
            "type": "select",
            "required": false,
            "description": "可选：全部数据、当前视图数据、所选下钻数据。"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "报表导出页面数据处理成功",
          "data": {
            "page_key": "scenario-1782831312544-1-scenario-1782831312544-1-page-3-2",
            "records": [],
            "summary": {}
          }
        },
        "errorResponse": {
          "success": false,
          "message": "报表导出页面数据处理失败",
          "data": null,
          "error_code": "SCENARIO_1782831312544_1_SCENARIO_1782831312544_1_PAGE_3_2_FAILED"
        },
        "errorCodes": [
          {
            "code": "SCENARIO_1782831312544_1_SCENARIO_1782831312544_1_PAGE_3_2_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面表单旁提示具体字段错误，并保留用户已输入内容。"
          },
          {
            "code": "SCENARIO_1782831312544_1_SCENARIO_1782831312544_1_PAGE_3_2_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ]
      },
      {
        "key": "scenario-1782831312544-1-scenario-1782831312544-1-page-4-3-contract",
        "method": "GET/POST",
        "name": "数据下钻页面接口契约",
        "path": "/api/scenario-1782831312544-1-scenario-1782831312544-1-page-4-3",
        "goal": "支撑「数据下钻页面」页面的数据查询、保存和状态反馈。",
        "sourcePage": "数据下钻页面",
        "trigger": "页面初始化、查询刷新、保存当前处理结果",
        "requestParams": [
          {
            "name": "dateRange",
            "type": "dateRange",
            "required": false,
            "description": "选择统计的时间范围"
          },
          {
            "name": "vehicleType",
            "type": "select",
            "required": false,
            "description": "筛选车辆类型（生产车辆/物流车辆/外协车辆/临时车辆）"
          },
          {
            "name": "area",
            "type": "select",
            "required": false,
            "description": "筛选作业区域"
          },
          {
            "name": "driverName",
            "type": "input",
            "required": false,
            "description": "输入司机姓名进行搜索"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "数据下钻页面数据处理成功",
          "data": {
            "page_key": "scenario-1782831312544-1-scenario-1782831312544-1-page-4-3",
            "records": [],
            "summary": {}
          }
        },
        "errorResponse": {
          "success": false,
          "message": "数据下钻页面数据处理失败",
          "data": null,
          "error_code": "SCENARIO_1782831312544_1_SCENARIO_1782831312544_1_PAGE_4_3_FAILED"
        },
        "errorCodes": [
          {
            "code": "SCENARIO_1782831312544_1_SCENARIO_1782831312544_1_PAGE_4_3_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面表单旁提示具体字段错误，并保留用户已输入内容。"
          },
          {
            "code": "SCENARIO_1782831312544_1_SCENARIO_1782831312544_1_PAGE_4_3_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ]
      },
      {
        "key": "scenario-1782831312544-2-scenario-1782831312544-2-page-1-0-contract",
        "method": "GET/POST",
        "name": "司机执行任务工作台接口契约",
        "path": "/api/vehicles",
        "goal": "支撑「司机执行任务工作台」页面的数据查询、保存和状态反馈。",
        "sourcePage": "司机执行任务工作台",
        "trigger": "页面初始化、查询刷新、保存当前处理结果",
        "requestParams": [
          {
            "name": "searchKeyword",
            "type": "text",
            "required": false,
            "description": "按任务编号、作业点、物资名称等搜索"
          },
          {
            "name": "taskStatus",
            "type": "select",
            "required": false,
            "description": "筛选任务状态：待接单、进行中、已完成等"
          },
          {
            "name": "dateRange",
            "type": "dateRange",
            "required": false,
            "description": "按任务创建时间筛选"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "车辆数据处理成功",
          "data": {
            "page_key": "scenario-1782831312544-2-scenario-1782831312544-2-page-1-0",
            "records": [],
            "summary": {}
          }
        },
        "errorResponse": {
          "success": false,
          "message": "车辆数据处理失败",
          "data": null,
          "error_code": "VEHICLES_FAILED"
        },
        "errorCodes": [
          {
            "code": "VEHICLES_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面表单旁提示具体字段错误，并保留用户已输入内容。"
          },
          {
            "code": "VEHICLES_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ]
      },
      {
        "key": "scenario-1782831312544-2-scenario-1782831312544-2-page-2-1-contract",
        "method": "GET/POST",
        "name": "导航路线指引页面接口契约",
        "path": "/api/scenario-1782831312544-2-scenario-1782831312544-2-page-2-1",
        "goal": "支撑「导航路线指引页面」页面的数据查询、保存和状态反馈。",
        "sourcePage": "导航路线指引页面",
        "trigger": "页面初始化、查询刷新、保存当前处理结果",
        "requestParams": [
          {
            "name": "currentPosition",
            "type": "info",
            "required": false,
            "description": "自动获取的GPS定位，不可编辑"
          },
          {
            "name": "destination",
            "type": "info",
            "required": false,
            "description": "从任务中获取的作业点名称或地址"
          },
          {
            "name": "routeType",
            "type": "select",
            "required": true,
            "description": "驾车或步行，默认为驾车"
          },
          {
            "name": "voiceGuide",
            "type": "switch",
            "required": false,
            "description": "开启/关闭语音导航提示"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "导航路线指引页面数据处理成功",
          "data": {
            "page_key": "scenario-1782831312544-2-scenario-1782831312544-2-page-2-1",
            "records": [],
            "summary": {}
          }
        },
        "errorResponse": {
          "success": false,
          "message": "导航路线指引页面数据处理失败",
          "data": null,
          "error_code": "SCENARIO_1782831312544_2_SCENARIO_1782831312544_2_PAGE_2_1_FAILED"
        },
        "errorCodes": [
          {
            "code": "SCENARIO_1782831312544_2_SCENARIO_1782831312544_2_PAGE_2_1_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面表单旁提示具体字段错误，并保留用户已输入内容。"
          },
          {
            "code": "SCENARIO_1782831312544_2_SCENARIO_1782831312544_2_PAGE_2_1_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ]
      },
      {
        "key": "scenario-1782831312544-2-scenario-1782831312544-2-page-3-2-contract",
        "method": "GET/POST",
        "name": "到达拍照确认页面接口契约",
        "path": "/api/scenario-1782831312544-2-scenario-1782831312544-2-page-3-2",
        "goal": "支撑「到达拍照确认页面」页面的数据查询、保存和状态反馈。",
        "sourcePage": "到达拍照确认页面",
        "trigger": "页面初始化、查询刷新、保存当前处理结果",
        "requestParams": [
          {
            "name": "photo",
            "type": "file",
            "required": true,
            "description": "上传到达作业点后的现场照片，至少一张"
          },
          {
            "name": "arrivalTime",
            "type": "datetime",
            "required": false,
            "description": "系统自动记录的到达时间（仅展示）"
          },
          {
            "name": "gpsLocation",
            "type": "text",
            "required": false,
            "description": "系统自动获取的当前位置坐标（仅展示）"
          },
          {
            "name": "manualCheckin",
            "type": "checkbox",
            "required": false,
            "description": "若地理围栏未自动触发，可手动勾选签到"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "到达拍照确认页面数据处理成功",
          "data": {
            "page_key": "scenario-1782831312544-2-scenario-1782831312544-2-page-3-2",
            "records": [],
            "summary": {}
          }
        },
        "errorResponse": {
          "success": false,
          "message": "到达拍照确认页面数据处理失败",
          "data": null,
          "error_code": "SCENARIO_1782831312544_2_SCENARIO_1782831312544_2_PAGE_3_2_FAILED"
        },
        "errorCodes": [
          {
            "code": "SCENARIO_1782831312544_2_SCENARIO_1782831312544_2_PAGE_3_2_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面表单旁提示具体字段错误，并保留用户已输入内容。"
          },
          {
            "code": "SCENARIO_1782831312544_2_SCENARIO_1782831312544_2_PAGE_3_2_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ]
      },
      {
        "key": "scenario-1782831312544-2-scenario-1782831312544-2-page-4-3-contract",
        "method": "GET/POST",
        "name": "到达拍照确认页面接口契约",
        "path": "/api/scenario-1782831312544-2-scenario-1782831312544-2-page-4-3",
        "goal": "支撑「到达拍照确认页面」页面的数据查询、保存和状态反馈。",
        "sourcePage": "到达拍照确认页面",
        "trigger": "页面初始化、查询刷新、保存当前处理结果",
        "requestParams": [
          {
            "name": "loadQuantity",
            "type": "number",
            "required": false,
            "description": "实际装卸的物资数量，可选填写"
          },
          {
            "name": "operationResult",
            "type": "select",
            "required": false,
            "description": "选择作业完成结果，如正常完成、部分完成、未完成等"
          },
          {
            "name": "remarks",
            "type": "textarea",
            "required": false,
            "description": "填写作业过程中的备注信息，如异常情况描述"
          },
          {
            "name": "abnormalType",
            "type": "select",
            "required": false,
            "description": "选择异常类型，如物资损坏、超时、其他"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "到达拍照确认页面数据处理成功",
          "data": {
            "page_key": "scenario-1782831312544-2-scenario-1782831312544-2-page-4-3",
            "records": [],
            "summary": {}
          }
        },
        "errorResponse": {
          "success": false,
          "message": "到达拍照确认页面数据处理失败",
          "data": null,
          "error_code": "SCENARIO_1782831312544_2_SCENARIO_1782831312544_2_PAGE_4_3_FAILED"
        },
        "errorCodes": [
          {
            "code": "SCENARIO_1782831312544_2_SCENARIO_1782831312544_2_PAGE_4_3_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面表单旁提示具体字段错误，并保留用户已输入内容。"
          },
          {
            "code": "SCENARIO_1782831312544_2_SCENARIO_1782831312544_2_PAGE_4_3_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ]
      },
      {
        "key": "scenario-1782831312544-3-scenario-1782831312544-3-page-1-0-contract",
        "method": "GET/POST",
        "name": "门岗入场核验工作台接口契约",
        "path": "/api/scenario-1782831312544-3-scenario-1782831312544-3-page-1-0",
        "goal": "支撑「门岗入场核验工作台」页面的数据查询、保存和状态反馈。",
        "sourcePage": "门岗入场核验工作台",
        "trigger": "页面初始化、查询刷新、保存当前处理结果",
        "requestParams": [
          {
            "name": "plateNumber",
            "type": "text",
            "required": true,
            "description": "手动输入或通过扫描自动填充，用于核验车辆入场权限"
          },
          {
            "name": "scanButton",
            "type": "button",
            "required": false,
            "description": "触发摄像头扫描车牌或二维码，自动填充车牌号并发起核验"
          },
          {
            "name": "checkResultStatus",
            "type": "text",
            "required": false,
            "description": "自动核验后显示放行或拦截状态，只读"
          },
          {
            "name": "checkResultDetail",
            "type": "text",
            "required": false,
            "description": "显示车辆类型、有效期、所属单位等详细核验信息，只读"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "门岗入场核验工作台数据处理成功",
          "data": {
            "page_key": "scenario-1782831312544-3-scenario-1782831312544-3-page-1-0",
            "records": [],
            "summary": {}
          }
        },
        "errorResponse": {
          "success": false,
          "message": "门岗入场核验工作台数据处理失败",
          "data": null,
          "error_code": "SCENARIO_1782831312544_3_SCENARIO_1782831312544_3_PAGE_1_0_FAILED"
        },
        "errorCodes": [
          {
            "code": "SCENARIO_1782831312544_3_SCENARIO_1782831312544_3_PAGE_1_0_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面表单旁提示具体字段错误，并保留用户已输入内容。"
          },
          {
            "code": "SCENARIO_1782831312544_3_SCENARIO_1782831312544_3_PAGE_1_0_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ]
      },
      {
        "key": "scenario-1782831312544-3-scenario-1782831312544-3-page-2-1-contract",
        "method": "GET/POST",
        "name": "出场核验页面接口契约",
        "path": "/api/scenario-1782831312544-3-scenario-1782831312544-3-page-2-1",
        "goal": "支撑「出场核验页面」页面的数据查询、保存和状态反馈。",
        "sourcePage": "出场核验页面",
        "trigger": "页面初始化、查询刷新、保存当前处理结果",
        "requestParams": [
          {
            "name": "plateNumber",
            "type": "text",
            "required": true,
            "description": "手动输入或扫描识别的车牌号码"
          },
          {
            "name": "vehicleType",
            "type": "readonly",
            "required": false,
            "description": "根据车牌号自动获取的车辆类型"
          },
          {
            "name": "unit",
            "type": "readonly",
            "required": false,
            "description": "车辆所属单位"
          },
          {
            "name": "taskStatus",
            "type": "readonly",
            "required": false,
            "description": "车辆当前是否有进行中的任务"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "出场核验页面数据处理成功",
          "data": {
            "page_key": "scenario-1782831312544-3-scenario-1782831312544-3-page-2-1",
            "records": [],
            "summary": {}
          }
        },
        "errorResponse": {
          "success": false,
          "message": "出场核验页面数据处理失败",
          "data": null,
          "error_code": "SCENARIO_1782831312544_3_SCENARIO_1782831312544_3_PAGE_2_1_FAILED"
        },
        "errorCodes": [
          {
            "code": "SCENARIO_1782831312544_3_SCENARIO_1782831312544_3_PAGE_2_1_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面表单旁提示具体字段错误，并保留用户已输入内容。"
          },
          {
            "code": "SCENARIO_1782831312544_3_SCENARIO_1782831312544_3_PAGE_2_1_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ]
      },
      {
        "key": "scenario-1782831312544-3-scenario-1782831312544-3-page-3-2-contract",
        "method": "GET/POST",
        "name": "异常处理页面接口契约",
        "path": "/api/issues",
        "goal": "支撑「异常处理页面」页面的数据查询、保存和状态反馈。",
        "sourcePage": "异常处理页面",
        "trigger": "页面初始化、查询刷新、保存当前处理结果",
        "requestParams": [
          {
            "name": "reason",
            "type": "select",
            "required": true,
            "description": "选择或输入异常原因，如无预约、证照过期等"
          },
          {
            "name": "result",
            "type": "radio",
            "required": true,
            "description": "放行或拒绝"
          },
          {
            "name": "remark",
            "type": "textarea",
            "required": false,
            "description": "补充说明"
          },
          {
            "name": "notifyRecipients",
            "type": "checkbox",
            "required": false,
            "description": "选择通知调度、安保等"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "异常数据处理成功",
          "data": {
            "page_key": "scenario-1782831312544-3-scenario-1782831312544-3-page-3-2",
            "records": [],
            "summary": {}
          }
        },
        "errorResponse": {
          "success": false,
          "message": "异常数据处理失败",
          "data": null,
          "error_code": "ISSUES_FAILED"
        },
        "errorCodes": [
          {
            "code": "ISSUES_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面表单旁提示具体字段错误，并保留用户已输入内容。"
          },
          {
            "code": "ISSUES_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ]
      },
      {
        "key": "scenario-1782831312544-3-scenario-1782831312544-3-page-4-3-contract",
        "method": "GET/POST",
        "name": "核验日志查询页面接口契约",
        "path": "/api/scenario-1782831312544-3-scenario-1782831312544-3-page-4-3",
        "goal": "支撑「核验日志查询页面」页面的数据查询、保存和状态反馈。",
        "sourcePage": "核验日志查询页面",
        "trigger": "页面初始化、查询刷新、保存当前处理结果",
        "requestParams": [
          {
            "name": "licensePlate",
            "type": "input",
            "required": false,
            "description": "输入完整的车牌号或部分字符进行模糊查询"
          },
          {
            "name": "timeRange",
            "type": "daterangepicker",
            "required": false,
            "description": "选择起始和结束日期，筛选该时间段内的核验记录"
          },
          {
            "name": "checkResult",
            "type": "select",
            "required": false,
            "description": "下拉选择：通过、拒绝、异常，支持多选"
          },
          {
            "name": "direction",
            "type": "select",
            "required": false,
            "description": "选择入场核验或出场核验"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "核验日志查询页面数据处理成功",
          "data": {
            "page_key": "scenario-1782831312544-3-scenario-1782831312544-3-page-4-3",
            "records": [],
            "summary": {}
          }
        },
        "errorResponse": {
          "success": false,
          "message": "核验日志查询页面数据处理失败",
          "data": null,
          "error_code": "SCENARIO_1782831312544_3_SCENARIO_1782831312544_3_PAGE_4_3_FAILED"
        },
        "errorCodes": [
          {
            "code": "SCENARIO_1782831312544_3_SCENARIO_1782831312544_3_PAGE_4_3_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面表单旁提示具体字段错误，并保留用户已输入内容。"
          },
          {
            "code": "SCENARIO_1782831312544_3_SCENARIO_1782831312544_3_PAGE_4_3_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ]
      },
      {
        "key": "scenario-1782831312544-4-scenario-1782831312544-4-page-1-0-contract",
        "method": "GET/POST",
        "name": "外协车辆预约入场工作台接口契约",
        "path": "/api/vehicles",
        "goal": "支撑「外协车辆预约入场工作台」页面的数据查询、保存和状态反馈。",
        "sourcePage": "外协车辆预约入场工作台",
        "trigger": "页面初始化、查询刷新、保存当前处理结果",
        "requestParams": [
          {
            "name": "plateNumber",
            "type": "text",
            "required": true,
            "description": "请输入车牌号，如京A12345"
          },
          {
            "name": "vehicleType",
            "type": "select",
            "required": true,
            "description": "选择车辆类型：货运、客运、特种等"
          },
          {
            "name": "belongCompany",
            "type": "text",
            "required": true,
            "description": "填写车辆所属单位名称"
          },
          {
            "name": "driverName",
            "type": "text",
            "required": true,
            "description": "填写司机姓名"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "车辆数据处理成功",
          "data": {
            "page_key": "scenario-1782831312544-4-scenario-1782831312544-4-page-1-0",
            "records": [],
            "summary": {}
          }
        },
        "errorResponse": {
          "success": false,
          "message": "车辆数据处理失败",
          "data": null,
          "error_code": "VEHICLES_FAILED"
        },
        "errorCodes": [
          {
            "code": "VEHICLES_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面表单旁提示具体字段错误，并保留用户已输入内容。"
          },
          {
            "code": "VEHICLES_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ]
      },
      {
        "key": "scenario-1782831312544-4-scenario-1782831312544-4-page-2-1-contract",
        "method": "GET/POST",
        "name": "授权凭证页面接口契约",
        "path": "/api/scenario-1782831312544-4-scenario-1782831312544-4-page-2-1",
        "goal": "支撑「授权凭证页面」页面的数据查询、保存和状态反馈。",
        "sourcePage": "授权凭证页面",
        "trigger": "页面初始化、查询刷新、保存当前处理结果",
        "requestParams": [
          {
            "name": "qrCodeImage",
            "type": "image",
            "required": false,
            "description": "动态生成的二维码图片，用于入场核验"
          },
          {
            "name": "authorizationCode",
            "type": "text",
            "required": false,
            "description": "系统生成的唯一授权码"
          },
          {
            "name": "validPeriod",
            "type": "dateRange",
            "required": false,
            "description": "允许入场的起止时间"
          },
          {
            "name": "reservationId",
            "type": "text",
            "required": false,
            "description": "对应的入场预约申请编号"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "授权凭证页面数据处理成功",
          "data": {
            "page_key": "scenario-1782831312544-4-scenario-1782831312544-4-page-2-1",
            "records": [],
            "summary": {}
          }
        },
        "errorResponse": {
          "success": false,
          "message": "授权凭证页面数据处理失败",
          "data": null,
          "error_code": "SCENARIO_1782831312544_4_SCENARIO_1782831312544_4_PAGE_2_1_FAILED"
        },
        "errorCodes": [
          {
            "code": "SCENARIO_1782831312544_4_SCENARIO_1782831312544_4_PAGE_2_1_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面表单旁提示具体字段错误，并保留用户已输入内容。"
          },
          {
            "code": "SCENARIO_1782831312544_4_SCENARIO_1782831312544_4_PAGE_2_1_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ]
      },
      {
        "key": "scenario-1782831312544-4-scenario-1782831312544-4-page-3-2-contract",
        "method": "GET/POST",
        "name": "入场记录页面接口契约",
        "path": "/api/scenario-1782831312544-4-scenario-1782831312544-4-page-3-2",
        "goal": "支撑「入场记录页面」页面的数据查询、保存和状态反馈。",
        "sourcePage": "入场记录页面",
        "trigger": "页面初始化、查询刷新、保存当前处理结果",
        "requestParams": [
          {
            "name": "entryCode",
            "type": "text",
            "required": true,
            "description": "扫描或手动输入授权码，用于自动填充车辆及司机信息"
          },
          {
            "name": "licensePlate",
            "type": "text",
            "required": false,
            "description": "根据授权码自动带出，只读"
          },
          {
            "name": "vehicleType",
            "type": "text",
            "required": false,
            "description": "根据授权码自动带出，只读"
          },
          {
            "name": "driverName",
            "type": "text",
            "required": false,
            "description": "根据授权码自动带出，可编辑"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "入场记录页面数据处理成功",
          "data": {
            "page_key": "scenario-1782831312544-4-scenario-1782831312544-4-page-3-2",
            "records": [],
            "summary": {}
          }
        },
        "errorResponse": {
          "success": false,
          "message": "入场记录页面数据处理失败",
          "data": null,
          "error_code": "SCENARIO_1782831312544_4_SCENARIO_1782831312544_4_PAGE_3_2_FAILED"
        },
        "errorCodes": [
          {
            "code": "SCENARIO_1782831312544_4_SCENARIO_1782831312544_4_PAGE_3_2_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面表单旁提示具体字段错误，并保留用户已输入内容。"
          },
          {
            "code": "SCENARIO_1782831312544_4_SCENARIO_1782831312544_4_PAGE_3_2_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ]
      },
      {
        "key": "scenario-1782831312544-4-scenario-1782831312544-4-page-4-3-contract",
        "method": "GET/POST",
        "name": "出场核验页面接口契约",
        "path": "/api/scenario-1782831312544-4-scenario-1782831312544-4-page-4-3",
        "goal": "支撑「出场核验页面」页面的数据查询、保存和状态反馈。",
        "sourcePage": "出场核验页面",
        "trigger": "页面初始化、查询刷新、保存当前处理结果",
        "requestParams": [
          {
            "name": "vehicleIdInput",
            "type": "text",
            "required": true,
            "description": "手动输入或通过扫描获取车辆车牌号或入场凭证号"
          },
          {
            "name": "scanButton",
            "type": "button",
            "required": false,
            "description": "唤起摄像头扫描车牌或二维码/条形码凭证"
          },
          {
            "name": "vehicleInfo",
            "type": "display",
            "required": false,
            "description": "显示核验成功的车辆信息（车牌、车型、单位、司机等）"
          },
          {
            "name": "reservationInfo",
            "type": "display",
            "required": false,
            "description": "显示关联的预约入场记录详情"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "出场核验页面数据处理成功",
          "data": {
            "page_key": "scenario-1782831312544-4-scenario-1782831312544-4-page-4-3",
            "records": [],
            "summary": {}
          }
        },
        "errorResponse": {
          "success": false,
          "message": "出场核验页面数据处理失败",
          "data": null,
          "error_code": "SCENARIO_1782831312544_4_SCENARIO_1782831312544_4_PAGE_4_3_FAILED"
        },
        "errorCodes": [
          {
            "code": "SCENARIO_1782831312544_4_SCENARIO_1782831312544_4_PAGE_4_3_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面表单旁提示具体字段错误，并保留用户已输入内容。"
          },
          {
            "code": "SCENARIO_1782831312544_4_SCENARIO_1782831312544_4_PAGE_4_3_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ]
      }
    ],
    "selectedContract": {
      "key": "scenario-1782831312544-0-scenario-1782831312544-0-page-1-0-contract",
      "method": "GET/POST",
      "name": "调度员现场调度工作台接口契约",
      "path": "/api/resources",
      "goal": "支撑「调度员现场调度工作台」页面的数据查询、保存和状态反馈。",
      "sourcePage": "调度员现场调度工作台",
      "trigger": "页面初始化、查询刷新、保存当前处理结果",
      "requestParams": [
        {
          "name": "region",
          "type": "select",
          "required": false,
          "description": "按作业区域筛选车辆显示"
        },
        {
          "name": "vehicleType",
          "type": "select",
          "required": false,
          "description": "按车辆类型筛选"
        },
        {
          "name": "vehicleStatus",
          "type": "select",
          "required": false,
          "description": "按车辆状态（空闲、任务、排队、异常）筛选"
        },
        {
          "name": "keyword",
          "type": "input",
          "required": false,
          "description": "按车牌号或司机名称搜索"
        }
      ],
      "successResponse": {
        "success": true,
        "message": "资源数据处理成功",
        "data": {
          "page_key": "scenario-1782831312544-0-scenario-1782831312544-0-page-1-0",
          "records": [],
          "summary": {}
        }
      },
      "errorResponse": {
        "success": false,
        "message": "资源数据处理失败",
        "data": null,
        "error_code": "RESOURCES_FAILED"
      },
      "errorCodes": [
        {
          "code": "RESOURCES_VALIDATION_FAILED",
          "meaning": "请求参数或状态流转不合法。",
          "frontendAdvice": "在页面表单旁提示具体字段错误，并保留用户已输入内容。"
        },
        {
          "code": "RESOURCES_SYNC_FAILED",
          "meaning": "服务端保存或同步失败。",
          "frontendAdvice": "展示失败原因并提供重试入口。"
        }
      ]
    },
    "interactionDesign": {
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
        }
      },
      "scenarioPageGroups": [
        {
          "key": "scenario-1782831312544-0",
          "name": "调度员现场调度",
          "priority": "P0",
          "pageCount": 4,
          "pages": [
            {
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
              "scenarioKey": "scenario-1782831312544-0",
              "scenarioName": "调度员现场调度",
              "originalPageKey": "scenario-1782831312544-0-page-1"
            },
            {
              "key": "scenario-1782831312544-0-scenario-1782831312544-0-page-2-1",
              "priority": "P1",
              "type": "辅助页",
              "name": "智能派车页面",
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
              "scenarioKey": "scenario-1782831312544-0",
              "scenarioName": "调度员现场调度",
              "originalPageKey": "scenario-1782831312544-0-page-2"
            },
            {
              "key": "scenario-1782831312544-0-scenario-1782831312544-0-page-3-2",
              "priority": "P1",
              "type": "辅助页",
              "name": "任务跟踪页面",
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
              "scenarioKey": "scenario-1782831312544-0",
              "scenarioName": "调度员现场调度",
              "originalPageKey": "scenario-1782831312544-0-page-3"
            },
            {
              "key": "scenario-1782831312544-0-scenario-1782831312544-0-page-4-3",
              "priority": "P1",
              "type": "辅助页",
              "name": "异常处理页面",
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
              "scenarioKey": "scenario-1782831312544-0",
              "scenarioName": "调度员现场调度",
              "originalPageKey": "scenario-1782831312544-0-page-4"
            }
          ]
        },
        {
          "key": "scenario-1782831312544-1",
          "name": "管理人员统计分析",
          "priority": "P0",
          "pageCount": 4,
          "pages": [
            {
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
              "scenarioKey": "scenario-1782831312544-1",
              "scenarioName": "管理人员统计分析",
              "originalPageKey": "scenario-1782831312544-1-page-1"
            },
            {
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
              "scenarioKey": "scenario-1782831312544-1",
              "scenarioName": "管理人员统计分析",
              "originalPageKey": "scenario-1782831312544-1-page-2"
            },
            {
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
              "scenarioKey": "scenario-1782831312544-1",
              "scenarioName": "管理人员统计分析",
              "originalPageKey": "scenario-1782831312544-1-page-3"
            },
            {
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
              "scenarioKey": "scenario-1782831312544-1",
              "scenarioName": "管理人员统计分析",
              "originalPageKey": "scenario-1782831312544-1-page-4"
            }
          ]
        },
        {
          "key": "scenario-1782831312544-2",
          "name": "司机执行任务",
          "priority": "P1",
          "pageCount": 4,
          "pages": [
            {
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
              "scenarioKey": "scenario-1782831312544-2",
              "scenarioName": "司机执行任务",
              "originalPageKey": "scenario-1782831312544-2-page-1"
            },
            {
              "key": "scenario-1782831312544-2-scenario-1782831312544-2-page-2-1",
              "priority": "P1",
              "type": "辅助页",
              "name": "导航与路线指引页面",
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
              "scenarioKey": "scenario-1782831312544-2",
              "scenarioName": "司机执行任务",
              "originalPageKey": "scenario-1782831312544-2-page-2"
            },
            {
              "key": "scenario-1782831312544-2-scenario-1782831312544-2-page-3-2",
              "priority": "P1",
              "type": "辅助页",
              "name": "现场到达确认与签到页面",
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
              "scenarioKey": "scenario-1782831312544-2",
              "scenarioName": "司机执行任务",
              "originalPageKey": "scenario-1782831312544-2-page-3"
            },
            {
              "key": "scenario-1782831312544-2-scenario-1782831312544-2-page-4-3",
              "priority": "P1",
              "type": "辅助页",
              "name": "任务完成与关闭操作页面",
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
              "scenarioKey": "scenario-1782831312544-2",
              "scenarioName": "司机执行任务",
              "originalPageKey": "scenario-1782831312544-2-page-4"
            }
          ]
        },
        {
          "key": "scenario-1782831312544-3",
          "name": "门岗入场核验",
          "priority": "P1",
          "pageCount": 4,
          "pages": [
            {
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
            {
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
            {
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
            {
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
            }
          ]
        },
        {
          "key": "scenario-1782831312544-4",
          "name": "外协车辆预约入场",
          "priority": "P1",
          "pageCount": 4,
          "pages": [
            {
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
            {
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
            {
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
            {
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
            }
          ]
        }
      ],
      "pageDesign": {
        "scenario": {
          "key": "scenario-1782831312544-4",
          "name": "外协车辆预约入场",
          "priority": "P1",
          "description": "外协或临时车辆申请人通过系统提交预约登记（车辆信息、司机、入场时间等），系统自动审批（无分级限制），生成入场授权二维码；到场后凭码入场，出场后自动核销。",
          "workflow": [
            "预约登记",
            "提交申请（自动审批）",
            "获取入场授权码",
            "到场扫码入场",
            "出场核验"
          ],
          "pageMapping": {
            "role": "外协/临时车辆申请人",
            "page": "VehicleReservationView.vue",
            "modules": [
              "预约登记",
              "授权凭证",
              "入场记录",
              "出场核验"
            ]
          },
          "savedAt": "22:56"
        },
        "currentScenarioKey": "scenario-1782831312544-4",
        "selectedPageKey": "scenario-1782831312544-4-page-1",
        "page": {
          "key": "scenario-1782831312544-4-page-1",
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
          ]
        },
        "currentPage": {
          "key": "scenario-1782831312544-4-page-1",
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
          ]
        },
        "currentPageSections": [
          "预约信息录入区",
          "提交与审批反馈区"
        ],
        "pageDesign": {
          "pages": [
            {
              "key": "scenario-1782831312544-0-page-1",
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
              "scenarioKey": "scenario-1782831312544-0",
              "scenarioName": "调度员现场调度"
            },
            {
              "key": "scenario-1782831312544-0-page-2",
              "priority": "P1",
              "type": "辅助页",
              "name": "智能派车页面",
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
              "scenarioKey": "scenario-1782831312544-0",
              "scenarioName": "调度员现场调度"
            },
            {
              "key": "scenario-1782831312544-0-page-3",
              "priority": "P1",
              "type": "辅助页",
              "name": "任务跟踪页面",
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
              "scenarioKey": "scenario-1782831312544-0",
              "scenarioName": "调度员现场调度"
            },
            {
              "key": "scenario-1782831312544-0-page-4",
              "priority": "P1",
              "type": "辅助页",
              "name": "异常处理页面",
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
              "scenarioKey": "scenario-1782831312544-0",
              "scenarioName": "调度员现场调度"
            },
            {
              "key": "scenario-1782831312544-1-page-1",
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
              "scenarioKey": "scenario-1782831312544-1",
              "scenarioName": "管理人员统计分析"
            },
            {
              "key": "scenario-1782831312544-1-page-2",
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
              "scenarioKey": "scenario-1782831312544-1",
              "scenarioName": "管理人员统计分析"
            },
            {
              "key": "scenario-1782831312544-1-page-3",
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
              "scenarioKey": "scenario-1782831312544-1",
              "scenarioName": "管理人员统计分析"
            },
            {
              "key": "scenario-1782831312544-1-page-4",
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
              "scenarioKey": "scenario-1782831312544-1",
              "scenarioName": "管理人员统计分析"
            },
            {
              "key": "scenario-1782831312544-2-page-1",
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
              "scenarioKey": "scenario-1782831312544-2",
              "scenarioName": "司机执行任务"
            },
            {
              "key": "scenario-1782831312544-2-page-2",
              "priority": "P1",
              "type": "辅助页",
              "name": "导航与路线指引页面",
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
              "scenarioKey": "scenario-1782831312544-2",
              "scenarioName": "司机执行任务"
            },
            {
              "key": "scenario-1782831312544-2-page-3",
              "priority": "P1",
              "type": "辅助页",
              "name": "现场到达确认与签到页面",
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
              "scenarioKey": "scenario-1782831312544-2",
              "scenarioName": "司机执行任务"
            },
            {
              "key": "scenario-1782831312544-2-page-4",
              "priority": "P1",
              "type": "辅助页",
              "name": "任务完成与关闭操作页面",
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
              "scenarioKey": "scenario-1782831312544-2",
              "scenarioName": "司机执行任务"
            },
            {
              "key": "scenario-1782831312544-3-page-1",
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
              "scenarioName": "门岗入场核验"
            },
            {
              "key": "scenario-1782831312544-3-page-2",
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
              "scenarioName": "门岗入场核验"
            },
            {
              "key": "scenario-1782831312544-3-page-3",
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
              "scenarioName": "门岗入场核验"
            },
            {
              "key": "scenario-1782831312544-3-page-4",
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
              "scenarioName": "门岗入场核验"
            },
            {
              "key": "scenario-1782831312544-4-page-1",
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
              "scenarioName": "外协车辆预约入场"
            },
            {
              "key": "scenario-1782831312544-4-page-2",
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
              "scenarioName": "外协车辆预约入场"
            },
            {
              "key": "scenario-1782831312544-4-page-3",
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
              "scenarioName": "外协车辆预约入场"
            },
            {
              "key": "scenario-1782831312544-4-page-4",
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
              "scenarioName": "外协车辆预约入场"
            }
          ],
          "navigation": [
            {
              "label": "调度员现场调度工作台",
              "target": "VehicleDispatchView.vue",
              "default": true,
              "scenarioKey": "scenario-1782831312544-0",
              "scenarioName": "调度员现场调度"
            },
            {
              "label": "智能派车页面",
              "target": "VehicleDispatchView.vue",
              "default": false,
              "scenarioKey": "scenario-1782831312544-0",
              "scenarioName": "调度员现场调度"
            },
            {
              "label": "任务跟踪页面",
              "target": "VehicleDispatchView.vue",
              "default": false,
              "scenarioKey": "scenario-1782831312544-0",
              "scenarioName": "调度员现场调度"
            },
            {
              "label": "异常处理页面",
              "target": "VehicleDispatchView.vue",
              "default": false,
              "scenarioKey": "scenario-1782831312544-0",
              "scenarioName": "调度员现场调度"
            },
            {
              "label": "管理人员统计分析工作台",
              "target": "StatisticsDashboardView.vue",
              "default": true,
              "scenarioKey": "scenario-1782831312544-1",
              "scenarioName": "管理人员统计分析"
            },
            {
              "label": "费用分析页面",
              "target": "StatisticsDashboardView.vue",
              "default": false,
              "scenarioKey": "scenario-1782831312544-1",
              "scenarioName": "管理人员统计分析"
            },
            {
              "label": "报表导出页面",
              "target": "StatisticsDashboardView.vue",
              "default": false,
              "scenarioKey": "scenario-1782831312544-1",
              "scenarioName": "管理人员统计分析"
            },
            {
              "label": "数据下钻页面",
              "target": "StatisticsDashboardView.vue",
              "default": false,
              "scenarioKey": "scenario-1782831312544-1",
              "scenarioName": "管理人员统计分析"
            },
            {
              "label": "司机执行任务工作台",
              "target": "DriverTaskView.vue（子组件：TaskListSection.vue, TaskDetailPanel.vue）",
              "default": true,
              "scenarioKey": "scenario-1782831312544-2",
              "scenarioName": "司机执行任务"
            },
            {
              "label": "导航与路线指引页面",
              "target": "NavigationOverlay.vue（嵌入 DriverTaskView.vue）",
              "default": false,
              "scenarioKey": "scenario-1782831312544-2",
              "scenarioName": "司机执行任务"
            },
            {
              "label": "现场到达确认与签到页面",
              "target": "ArrivalConfirmModal.vue",
              "default": false,
              "scenarioKey": "scenario-1782831312544-2",
              "scenarioName": "司机执行任务"
            },
            {
              "label": "任务完成与关闭操作页面",
              "target": "TaskCompletionForm.vue",
              "default": false,
              "scenarioKey": "scenario-1782831312544-2",
              "scenarioName": "司机执行任务"
            },
            {
              "label": "门岗入场核验工作台",
              "target": "GateCheckView.vue（集成入口）或 EntraceCheckComponent.vue",
              "default": true,
              "scenarioKey": "scenario-1782831312544-3",
              "scenarioName": "门岗入场核验"
            },
            {
              "label": "出场核验页面",
              "target": "GateCheckView.vue（集成入口）或 ExitCheckComponent.vue",
              "default": false,
              "scenarioKey": "scenario-1782831312544-3",
              "scenarioName": "门岗入场核验"
            },
            {
              "label": "异常处理页面",
              "target": "GateCheckView.vue（集成异常弹窗）或 ExceptionHandlingComponent.vue",
              "default": false,
              "scenarioKey": "scenario-1782831312544-3",
              "scenarioName": "门岗入场核验"
            },
            {
              "label": "核验日志查询页面",
              "target": "GateCheckView.vue（内嵌列表）或独立页面 GateLogView.vue",
              "default": false,
              "scenarioKey": "scenario-1782831312544-3",
              "scenarioName": "门岗入场核验"
            },
            {
              "label": "外协车辆预约入场工作台",
              "target": "VehicleReservationView.vue",
              "default": true,
              "scenarioKey": "scenario-1782831312544-4",
              "scenarioName": "外协车辆预约入场"
            },
            {
              "label": "授权凭证页面",
              "target": "VehicleReservationView.vue",
              "default": false,
              "scenarioKey": "scenario-1782831312544-4",
              "scenarioName": "外协车辆预约入场"
            },
            {
              "label": "入场记录页面",
              "target": "VehicleReservationView.vue",
              "default": false,
              "scenarioKey": "scenario-1782831312544-4",
              "scenarioName": "外协车辆预约入场"
            },
            {
              "label": "出场核验页面",
              "target": "VehicleReservationView.vue",
              "default": false,
              "scenarioKey": "scenario-1782831312544-4",
              "scenarioName": "外协车辆预约入场"
            }
          ],
          "fileStructure": {
            "views": [
              "VehicleDispatchView.vue",
              "StatisticsDashboardView.vue",
              "DriverTaskView.vue（子组件：TaskListSection.vue, TaskDetailPanel.vue）",
              "NavigationOverlay.vue（嵌入 DriverTaskView.vue）",
              "ArrivalConfirmModal.vue",
              "TaskCompletionForm.vue",
              "GateCheckView.vue（集成入口）或 EntraceCheckComponent.vue",
              "GateCheckView.vue（集成入口）或 ExitCheckComponent.vue",
              "GateCheckView.vue（集成异常弹窗）或 ExceptionHandlingComponent.vue",
              "GateCheckView.vue（内嵌列表）或独立页面 GateLogView.vue",
              "VehicleReservationView.vue"
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
            "key": "scenario-1782831312544-0",
            "name": "调度员现场调度",
            "priority": "P0",
            "pageCount": 4,
            "pages": [
              {
                "key": "scenario-1782831312544-0-page-1",
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
                ]
              },
              {
                "key": "scenario-1782831312544-0-page-2",
                "priority": "P1",
                "type": "辅助页",
                "name": "智能派车页面",
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
                ]
              },
              {
                "key": "scenario-1782831312544-0-page-3",
                "priority": "P1",
                "type": "辅助页",
                "name": "任务跟踪页面",
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
                ]
              },
              {
                "key": "scenario-1782831312544-0-page-4",
                "priority": "P1",
                "type": "辅助页",
                "name": "异常处理页面",
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
                ]
              }
            ]
          },
          {
            "key": "scenario-1782831312544-1",
            "name": "管理人员统计分析",
            "priority": "P0",
            "pageCount": 4,
            "pages": [
              {
                "key": "scenario-1782831312544-1-page-1",
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
                ]
              },
              {
                "key": "scenario-1782831312544-1-page-2",
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
                ]
              },
              {
                "key": "scenario-1782831312544-1-page-3",
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
                ]
              },
              {
                "key": "scenario-1782831312544-1-page-4",
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
                ]
              }
            ]
          },
          {
            "key": "scenario-1782831312544-2",
            "name": "司机执行任务",
            "priority": "P1",
            "pageCount": 4,
            "pages": [
              {
                "key": "scenario-1782831312544-2-page-1",
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
                ]
              },
              {
                "key": "scenario-1782831312544-2-page-2",
                "priority": "P1",
                "type": "辅助页",
                "name": "导航与路线指引页面",
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
                ]
              },
              {
                "key": "scenario-1782831312544-2-page-3",
                "priority": "P1",
                "type": "辅助页",
                "name": "现场到达确认与签到页面",
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
                ]
              },
              {
                "key": "scenario-1782831312544-2-page-4",
                "priority": "P1",
                "type": "辅助页",
                "name": "任务完成与关闭操作页面",
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
                ]
              }
            ]
          },
          {
            "key": "scenario-1782831312544-3",
            "name": "门岗入场核验",
            "priority": "P1",
            "pageCount": 4,
            "pages": [
              {
                "key": "scenario-1782831312544-3-page-1",
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
                ]
              },
              {
                "key": "scenario-1782831312544-3-page-2",
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
                ]
              },
              {
                "key": "scenario-1782831312544-3-page-3",
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
                ]
              },
              {
                "key": "scenario-1782831312544-3-page-4",
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
                ]
              }
            ]
          },
          {
            "key": "scenario-1782831312544-4",
            "name": "外协车辆预约入场",
            "priority": "P1",
            "pageCount": 4,
            "pages": [
              {
                "key": "scenario-1782831312544-4-page-1",
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
                ]
              },
              {
                "key": "scenario-1782831312544-4-page-2",
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
                ]
              },
              {
                "key": "scenario-1782831312544-4-page-3",
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
                ]
              },
              {
                "key": "scenario-1782831312544-4-page-4",
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
                ]
              }
            ]
          }
        ],
        "scenarioDesigns": {
          "scenario-1782831312544-0": {
            "pages": [
              {
                "key": "scenario-1782831312544-0-page-1",
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
                ]
              },
              {
                "key": "scenario-1782831312544-0-page-2",
                "priority": "P1",
                "type": "辅助页",
                "name": "智能派车页面",
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
                ]
              },
              {
                "key": "scenario-1782831312544-0-page-3",
                "priority": "P1",
                "type": "辅助页",
                "name": "任务跟踪页面",
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
                ]
              },
              {
                "key": "scenario-1782831312544-0-page-4",
                "priority": "P1",
                "type": "辅助页",
                "name": "异常处理页面",
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
                ]
              }
            ],
            "navigation": [
              {
                "label": "调度员现场调度工作台",
                "target": "VehicleDispatchView.vue",
                "default": true
              },
              {
                "label": "智能派车页面",
                "target": "VehicleDispatchView.vue",
                "default": false
              },
              {
                "label": "任务跟踪页面",
                "target": "VehicleDispatchView.vue",
                "default": false
              },
              {
                "label": "异常处理页面",
                "target": "VehicleDispatchView.vue",
                "default": false
              }
            ],
            "fileStructure": {
              "views": [
                "VehicleDispatchView.vue",
                "VehicleDispatchView.vue",
                "VehicleDispatchView.vue",
                "VehicleDispatchView.vue"
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
          "scenario-1782831312544-1": {
            "pages": [
              {
                "key": "scenario-1782831312544-1-page-1",
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
                ]
              },
              {
                "key": "scenario-1782831312544-1-page-2",
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
                ]
              },
              {
                "key": "scenario-1782831312544-1-page-3",
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
                ]
              },
              {
                "key": "scenario-1782831312544-1-page-4",
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
                ]
              }
            ],
            "navigation": [
              {
                "label": "管理人员统计分析工作台",
                "target": "StatisticsDashboardView.vue",
                "default": true
              },
              {
                "label": "费用分析页面",
                "target": "StatisticsDashboardView.vue",
                "default": false
              },
              {
                "label": "报表导出页面",
                "target": "StatisticsDashboardView.vue",
                "default": false
              },
              {
                "label": "数据下钻页面",
                "target": "StatisticsDashboardView.vue",
                "default": false
              }
            ],
            "fileStructure": {
              "views": [
                "StatisticsDashboardView.vue",
                "StatisticsDashboardView.vue",
                "StatisticsDashboardView.vue",
                "StatisticsDashboardView.vue"
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
          "scenario-1782831312544-2": {
            "pages": [
              {
                "key": "scenario-1782831312544-2-page-1",
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
                ]
              },
              {
                "key": "scenario-1782831312544-2-page-2",
                "priority": "P1",
                "type": "辅助页",
                "name": "导航与路线指引页面",
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
                ]
              },
              {
                "key": "scenario-1782831312544-2-page-3",
                "priority": "P1",
                "type": "辅助页",
                "name": "现场到达确认与签到页面",
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
                ]
              },
              {
                "key": "scenario-1782831312544-2-page-4",
                "priority": "P1",
                "type": "辅助页",
                "name": "任务完成与关闭操作页面",
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
                ]
              }
            ],
            "navigation": [
              {
                "label": "司机执行任务工作台",
                "target": "DriverTaskView.vue（子组件：TaskListSection.vue, TaskDetailPanel.vue）",
                "default": true
              },
              {
                "label": "导航与路线指引页面",
                "target": "NavigationOverlay.vue（嵌入 DriverTaskView.vue）",
                "default": false
              },
              {
                "label": "现场到达确认与签到页面",
                "target": "ArrivalConfirmModal.vue",
                "default": false
              },
              {
                "label": "任务完成与关闭操作页面",
                "target": "TaskCompletionForm.vue",
                "default": false
              }
            ],
            "fileStructure": {
              "views": [
                "DriverTaskView.vue（子组件：TaskListSection.vue, TaskDetailPanel.vue）",
                "NavigationOverlay.vue（嵌入 DriverTaskView.vue）",
                "ArrivalConfirmModal.vue",
                "TaskCompletionForm.vue"
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
          "scenario-1782831312544-3": {
            "pages": [
              {
                "key": "scenario-1782831312544-3-page-1",
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
                ]
              },
              {
                "key": "scenario-1782831312544-3-page-2",
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
                ]
              },
              {
                "key": "scenario-1782831312544-3-page-3",
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
                ]
              },
              {
                "key": "scenario-1782831312544-3-page-4",
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
                ]
              }
            ],
            "navigation": [
              {
                "label": "门岗入场核验工作台",
                "target": "GateCheckView.vue（集成入口）或 EntraceCheckComponent.vue",
                "default": true
              },
              {
                "label": "出场核验页面",
                "target": "GateCheckView.vue（集成入口）或 ExitCheckComponent.vue",
                "default": false
              },
              {
                "label": "异常处理页面",
                "target": "GateCheckView.vue（集成异常弹窗）或 ExceptionHandlingComponent.vue",
                "default": false
              },
              {
                "label": "核验日志查询页面",
                "target": "GateCheckView.vue（内嵌列表）或独立页面 GateLogView.vue",
                "default": false
              }
            ],
            "fileStructure": {
              "views": [
                "GateCheckView.vue（集成入口）或 EntraceCheckComponent.vue",
                "GateCheckView.vue（集成入口）或 ExitCheckComponent.vue",
                "GateCheckView.vue（集成异常弹窗）或 ExceptionHandlingComponent.vue",
                "GateCheckView.vue（内嵌列表）或独立页面 GateLogView.vue"
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
          "scenario-1782831312544-4": {
            "pages": [
              {
                "key": "scenario-1782831312544-4-page-1",
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
                ]
              },
              {
                "key": "scenario-1782831312544-4-page-2",
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
                ]
              },
              {
                "key": "scenario-1782831312544-4-page-3",
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
                ]
              },
              {
                "key": "scenario-1782831312544-4-page-4",
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
                ]
              }
            ],
            "navigation": [
              {
                "label": "外协车辆预约入场工作台",
                "target": "VehicleReservationView.vue",
                "default": true
              },
              {
                "label": "授权凭证页面",
                "target": "VehicleReservationView.vue",
                "default": false
              },
              {
                "label": "入场记录页面",
                "target": "VehicleReservationView.vue",
                "default": false
              },
              {
                "label": "出场核验页面",
                "target": "VehicleReservationView.vue",
                "default": false
              }
            ],
            "fileStructure": {
              "views": [
                "VehicleReservationView.vue",
                "VehicleReservationView.vue",
                "VehicleReservationView.vue",
                "VehicleReservationView.vue"
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
        "savedAt": "2026-07-01T06:10:57.724Z"
      },
      "selectedPage": {
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
        "generatedAt": "2026-07-01T06:17:03.296Z",
        "goal": "车辆出场时核验出场信息，自动核销预约记录，记录出场时间。",
        "features": [
          "扫描车辆入场凭证或车牌",
          "核验出场信息并记录出场时间",
          "自动更新预约状态为已核销",
          "提供出场记录查询"
        ],
        "sections": [
          "核验信息输入区",
          "核验结果与操作区",
          "出场记录查询区"
        ]
      },
      "savedAt": "2026-07-01T06:17:28.460Z"
    },
    "pageDesign": {
      "scenario": {
        "key": "scenario-1782831312544-4",
        "name": "外协车辆预约入场",
        "priority": "P1",
        "description": "外协或临时车辆申请人通过系统提交预约登记（车辆信息、司机、入场时间等），系统自动审批（无分级限制），生成入场授权二维码；到场后凭码入场，出场后自动核销。",
        "workflow": [
          "预约登记",
          "提交申请（自动审批）",
          "获取入场授权码",
          "到场扫码入场",
          "出场核验"
        ],
        "pageMapping": {
          "role": "外协/临时车辆申请人",
          "page": "VehicleReservationView.vue",
          "modules": [
            "预约登记",
            "授权凭证",
            "入场记录",
            "出场核验"
          ]
        },
        "savedAt": "22:56"
      },
      "currentScenarioKey": "scenario-1782831312544-4",
      "selectedPageKey": "scenario-1782831312544-4-page-1",
      "page": {
        "key": "scenario-1782831312544-4-page-1",
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
        ]
      },
      "currentPage": {
        "key": "scenario-1782831312544-4-page-1",
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
        ]
      },
      "currentPageSections": [
        "预约信息录入区",
        "提交与审批反馈区"
      ],
      "pageDesign": {
        "pages": [
          {
            "key": "scenario-1782831312544-0-page-1",
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
            "scenarioKey": "scenario-1782831312544-0",
            "scenarioName": "调度员现场调度"
          },
          {
            "key": "scenario-1782831312544-0-page-2",
            "priority": "P1",
            "type": "辅助页",
            "name": "智能派车页面",
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
            "scenarioKey": "scenario-1782831312544-0",
            "scenarioName": "调度员现场调度"
          },
          {
            "key": "scenario-1782831312544-0-page-3",
            "priority": "P1",
            "type": "辅助页",
            "name": "任务跟踪页面",
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
            "scenarioKey": "scenario-1782831312544-0",
            "scenarioName": "调度员现场调度"
          },
          {
            "key": "scenario-1782831312544-0-page-4",
            "priority": "P1",
            "type": "辅助页",
            "name": "异常处理页面",
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
            "scenarioKey": "scenario-1782831312544-0",
            "scenarioName": "调度员现场调度"
          },
          {
            "key": "scenario-1782831312544-1-page-1",
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
            "scenarioKey": "scenario-1782831312544-1",
            "scenarioName": "管理人员统计分析"
          },
          {
            "key": "scenario-1782831312544-1-page-2",
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
            "scenarioKey": "scenario-1782831312544-1",
            "scenarioName": "管理人员统计分析"
          },
          {
            "key": "scenario-1782831312544-1-page-3",
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
            "scenarioKey": "scenario-1782831312544-1",
            "scenarioName": "管理人员统计分析"
          },
          {
            "key": "scenario-1782831312544-1-page-4",
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
            "scenarioKey": "scenario-1782831312544-1",
            "scenarioName": "管理人员统计分析"
          },
          {
            "key": "scenario-1782831312544-2-page-1",
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
            "scenarioKey": "scenario-1782831312544-2",
            "scenarioName": "司机执行任务"
          },
          {
            "key": "scenario-1782831312544-2-page-2",
            "priority": "P1",
            "type": "辅助页",
            "name": "导航与路线指引页面",
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
            "scenarioKey": "scenario-1782831312544-2",
            "scenarioName": "司机执行任务"
          },
          {
            "key": "scenario-1782831312544-2-page-3",
            "priority": "P1",
            "type": "辅助页",
            "name": "现场到达确认与签到页面",
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
            "scenarioKey": "scenario-1782831312544-2",
            "scenarioName": "司机执行任务"
          },
          {
            "key": "scenario-1782831312544-2-page-4",
            "priority": "P1",
            "type": "辅助页",
            "name": "任务完成与关闭操作页面",
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
            "scenarioKey": "scenario-1782831312544-2",
            "scenarioName": "司机执行任务"
          },
          {
            "key": "scenario-1782831312544-3-page-1",
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
            "scenarioName": "门岗入场核验"
          },
          {
            "key": "scenario-1782831312544-3-page-2",
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
            "scenarioName": "门岗入场核验"
          },
          {
            "key": "scenario-1782831312544-3-page-3",
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
            "scenarioName": "门岗入场核验"
          },
          {
            "key": "scenario-1782831312544-3-page-4",
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
            "scenarioName": "门岗入场核验"
          },
          {
            "key": "scenario-1782831312544-4-page-1",
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
            "scenarioName": "外协车辆预约入场"
          },
          {
            "key": "scenario-1782831312544-4-page-2",
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
            "scenarioName": "外协车辆预约入场"
          },
          {
            "key": "scenario-1782831312544-4-page-3",
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
            "scenarioName": "外协车辆预约入场"
          },
          {
            "key": "scenario-1782831312544-4-page-4",
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
            "scenarioName": "外协车辆预约入场"
          }
        ],
        "navigation": [
          {
            "label": "调度员现场调度工作台",
            "target": "VehicleDispatchView.vue",
            "default": true,
            "scenarioKey": "scenario-1782831312544-0",
            "scenarioName": "调度员现场调度"
          },
          {
            "label": "智能派车页面",
            "target": "VehicleDispatchView.vue",
            "default": false,
            "scenarioKey": "scenario-1782831312544-0",
            "scenarioName": "调度员现场调度"
          },
          {
            "label": "任务跟踪页面",
            "target": "VehicleDispatchView.vue",
            "default": false,
            "scenarioKey": "scenario-1782831312544-0",
            "scenarioName": "调度员现场调度"
          },
          {
            "label": "异常处理页面",
            "target": "VehicleDispatchView.vue",
            "default": false,
            "scenarioKey": "scenario-1782831312544-0",
            "scenarioName": "调度员现场调度"
          },
          {
            "label": "管理人员统计分析工作台",
            "target": "StatisticsDashboardView.vue",
            "default": true,
            "scenarioKey": "scenario-1782831312544-1",
            "scenarioName": "管理人员统计分析"
          },
          {
            "label": "费用分析页面",
            "target": "StatisticsDashboardView.vue",
            "default": false,
            "scenarioKey": "scenario-1782831312544-1",
            "scenarioName": "管理人员统计分析"
          },
          {
            "label": "报表导出页面",
            "target": "StatisticsDashboardView.vue",
            "default": false,
            "scenarioKey": "scenario-1782831312544-1",
            "scenarioName": "管理人员统计分析"
          },
          {
            "label": "数据下钻页面",
            "target": "StatisticsDashboardView.vue",
            "default": false,
            "scenarioKey": "scenario-1782831312544-1",
            "scenarioName": "管理人员统计分析"
          },
          {
            "label": "司机执行任务工作台",
            "target": "DriverTaskView.vue（子组件：TaskListSection.vue, TaskDetailPanel.vue）",
            "default": true,
            "scenarioKey": "scenario-1782831312544-2",
            "scenarioName": "司机执行任务"
          },
          {
            "label": "导航与路线指引页面",
            "target": "NavigationOverlay.vue（嵌入 DriverTaskView.vue）",
            "default": false,
            "scenarioKey": "scenario-1782831312544-2",
            "scenarioName": "司机执行任务"
          },
          {
            "label": "现场到达确认与签到页面",
            "target": "ArrivalConfirmModal.vue",
            "default": false,
            "scenarioKey": "scenario-1782831312544-2",
            "scenarioName": "司机执行任务"
          },
          {
            "label": "任务完成与关闭操作页面",
            "target": "TaskCompletionForm.vue",
            "default": false,
            "scenarioKey": "scenario-1782831312544-2",
            "scenarioName": "司机执行任务"
          },
          {
            "label": "门岗入场核验工作台",
            "target": "GateCheckView.vue（集成入口）或 EntraceCheckComponent.vue",
            "default": true,
            "scenarioKey": "scenario-1782831312544-3",
            "scenarioName": "门岗入场核验"
          },
          {
            "label": "出场核验页面",
            "target": "GateCheckView.vue（集成入口）或 ExitCheckComponent.vue",
            "default": false,
            "scenarioKey": "scenario-1782831312544-3",
            "scenarioName": "门岗入场核验"
          },
          {
            "label": "异常处理页面",
            "target": "GateCheckView.vue（集成异常弹窗）或 ExceptionHandlingComponent.vue",
            "default": false,
            "scenarioKey": "scenario-1782831312544-3",
            "scenarioName": "门岗入场核验"
          },
          {
            "label": "核验日志查询页面",
            "target": "GateCheckView.vue（内嵌列表）或独立页面 GateLogView.vue",
            "default": false,
            "scenarioKey": "scenario-1782831312544-3",
            "scenarioName": "门岗入场核验"
          },
          {
            "label": "外协车辆预约入场工作台",
            "target": "VehicleReservationView.vue",
            "default": true,
            "scenarioKey": "scenario-1782831312544-4",
            "scenarioName": "外协车辆预约入场"
          },
          {
            "label": "授权凭证页面",
            "target": "VehicleReservationView.vue",
            "default": false,
            "scenarioKey": "scenario-1782831312544-4",
            "scenarioName": "外协车辆预约入场"
          },
          {
            "label": "入场记录页面",
            "target": "VehicleReservationView.vue",
            "default": false,
            "scenarioKey": "scenario-1782831312544-4",
            "scenarioName": "外协车辆预约入场"
          },
          {
            "label": "出场核验页面",
            "target": "VehicleReservationView.vue",
            "default": false,
            "scenarioKey": "scenario-1782831312544-4",
            "scenarioName": "外协车辆预约入场"
          }
        ],
        "fileStructure": {
          "views": [
            "VehicleDispatchView.vue",
            "StatisticsDashboardView.vue",
            "DriverTaskView.vue（子组件：TaskListSection.vue, TaskDetailPanel.vue）",
            "NavigationOverlay.vue（嵌入 DriverTaskView.vue）",
            "ArrivalConfirmModal.vue",
            "TaskCompletionForm.vue",
            "GateCheckView.vue（集成入口）或 EntraceCheckComponent.vue",
            "GateCheckView.vue（集成入口）或 ExitCheckComponent.vue",
            "GateCheckView.vue（集成异常弹窗）或 ExceptionHandlingComponent.vue",
            "GateCheckView.vue（内嵌列表）或独立页面 GateLogView.vue",
            "VehicleReservationView.vue"
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
          "key": "scenario-1782831312544-0",
          "name": "调度员现场调度",
          "priority": "P0",
          "pageCount": 4,
          "pages": [
            {
              "key": "scenario-1782831312544-0-page-1",
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
              ]
            },
            {
              "key": "scenario-1782831312544-0-page-2",
              "priority": "P1",
              "type": "辅助页",
              "name": "智能派车页面",
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
              ]
            },
            {
              "key": "scenario-1782831312544-0-page-3",
              "priority": "P1",
              "type": "辅助页",
              "name": "任务跟踪页面",
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
              ]
            },
            {
              "key": "scenario-1782831312544-0-page-4",
              "priority": "P1",
              "type": "辅助页",
              "name": "异常处理页面",
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
              ]
            }
          ]
        },
        {
          "key": "scenario-1782831312544-1",
          "name": "管理人员统计分析",
          "priority": "P0",
          "pageCount": 4,
          "pages": [
            {
              "key": "scenario-1782831312544-1-page-1",
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
              ]
            },
            {
              "key": "scenario-1782831312544-1-page-2",
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
              ]
            },
            {
              "key": "scenario-1782831312544-1-page-3",
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
              ]
            },
            {
              "key": "scenario-1782831312544-1-page-4",
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
              ]
            }
          ]
        },
        {
          "key": "scenario-1782831312544-2",
          "name": "司机执行任务",
          "priority": "P1",
          "pageCount": 4,
          "pages": [
            {
              "key": "scenario-1782831312544-2-page-1",
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
              ]
            },
            {
              "key": "scenario-1782831312544-2-page-2",
              "priority": "P1",
              "type": "辅助页",
              "name": "导航与路线指引页面",
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
              ]
            },
            {
              "key": "scenario-1782831312544-2-page-3",
              "priority": "P1",
              "type": "辅助页",
              "name": "现场到达确认与签到页面",
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
              ]
            },
            {
              "key": "scenario-1782831312544-2-page-4",
              "priority": "P1",
              "type": "辅助页",
              "name": "任务完成与关闭操作页面",
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
              ]
            }
          ]
        },
        {
          "key": "scenario-1782831312544-3",
          "name": "门岗入场核验",
          "priority": "P1",
          "pageCount": 4,
          "pages": [
            {
              "key": "scenario-1782831312544-3-page-1",
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
              ]
            },
            {
              "key": "scenario-1782831312544-3-page-2",
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
              ]
            },
            {
              "key": "scenario-1782831312544-3-page-3",
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
              ]
            },
            {
              "key": "scenario-1782831312544-3-page-4",
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
              ]
            }
          ]
        },
        {
          "key": "scenario-1782831312544-4",
          "name": "外协车辆预约入场",
          "priority": "P1",
          "pageCount": 4,
          "pages": [
            {
              "key": "scenario-1782831312544-4-page-1",
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
              ]
            },
            {
              "key": "scenario-1782831312544-4-page-2",
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
              ]
            },
            {
              "key": "scenario-1782831312544-4-page-3",
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
              ]
            },
            {
              "key": "scenario-1782831312544-4-page-4",
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
              ]
            }
          ]
        }
      ],
      "scenarioDesigns": {
        "scenario-1782831312544-0": {
          "pages": [
            {
              "key": "scenario-1782831312544-0-page-1",
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
              ]
            },
            {
              "key": "scenario-1782831312544-0-page-2",
              "priority": "P1",
              "type": "辅助页",
              "name": "智能派车页面",
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
              ]
            },
            {
              "key": "scenario-1782831312544-0-page-3",
              "priority": "P1",
              "type": "辅助页",
              "name": "任务跟踪页面",
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
              ]
            },
            {
              "key": "scenario-1782831312544-0-page-4",
              "priority": "P1",
              "type": "辅助页",
              "name": "异常处理页面",
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
              ]
            }
          ],
          "navigation": [
            {
              "label": "调度员现场调度工作台",
              "target": "VehicleDispatchView.vue",
              "default": true
            },
            {
              "label": "智能派车页面",
              "target": "VehicleDispatchView.vue",
              "default": false
            },
            {
              "label": "任务跟踪页面",
              "target": "VehicleDispatchView.vue",
              "default": false
            },
            {
              "label": "异常处理页面",
              "target": "VehicleDispatchView.vue",
              "default": false
            }
          ],
          "fileStructure": {
            "views": [
              "VehicleDispatchView.vue",
              "VehicleDispatchView.vue",
              "VehicleDispatchView.vue",
              "VehicleDispatchView.vue"
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
        "scenario-1782831312544-1": {
          "pages": [
            {
              "key": "scenario-1782831312544-1-page-1",
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
              ]
            },
            {
              "key": "scenario-1782831312544-1-page-2",
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
              ]
            },
            {
              "key": "scenario-1782831312544-1-page-3",
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
              ]
            },
            {
              "key": "scenario-1782831312544-1-page-4",
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
              ]
            }
          ],
          "navigation": [
            {
              "label": "管理人员统计分析工作台",
              "target": "StatisticsDashboardView.vue",
              "default": true
            },
            {
              "label": "费用分析页面",
              "target": "StatisticsDashboardView.vue",
              "default": false
            },
            {
              "label": "报表导出页面",
              "target": "StatisticsDashboardView.vue",
              "default": false
            },
            {
              "label": "数据下钻页面",
              "target": "StatisticsDashboardView.vue",
              "default": false
            }
          ],
          "fileStructure": {
            "views": [
              "StatisticsDashboardView.vue",
              "StatisticsDashboardView.vue",
              "StatisticsDashboardView.vue",
              "StatisticsDashboardView.vue"
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
        "scenario-1782831312544-2": {
          "pages": [
            {
              "key": "scenario-1782831312544-2-page-1",
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
              ]
            },
            {
              "key": "scenario-1782831312544-2-page-2",
              "priority": "P1",
              "type": "辅助页",
              "name": "导航与路线指引页面",
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
              ]
            },
            {
              "key": "scenario-1782831312544-2-page-3",
              "priority": "P1",
              "type": "辅助页",
              "name": "现场到达确认与签到页面",
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
              ]
            },
            {
              "key": "scenario-1782831312544-2-page-4",
              "priority": "P1",
              "type": "辅助页",
              "name": "任务完成与关闭操作页面",
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
              ]
            }
          ],
          "navigation": [
            {
              "label": "司机执行任务工作台",
              "target": "DriverTaskView.vue（子组件：TaskListSection.vue, TaskDetailPanel.vue）",
              "default": true
            },
            {
              "label": "导航与路线指引页面",
              "target": "NavigationOverlay.vue（嵌入 DriverTaskView.vue）",
              "default": false
            },
            {
              "label": "现场到达确认与签到页面",
              "target": "ArrivalConfirmModal.vue",
              "default": false
            },
            {
              "label": "任务完成与关闭操作页面",
              "target": "TaskCompletionForm.vue",
              "default": false
            }
          ],
          "fileStructure": {
            "views": [
              "DriverTaskView.vue（子组件：TaskListSection.vue, TaskDetailPanel.vue）",
              "NavigationOverlay.vue（嵌入 DriverTaskView.vue）",
              "ArrivalConfirmModal.vue",
              "TaskCompletionForm.vue"
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
        "scenario-1782831312544-3": {
          "pages": [
            {
              "key": "scenario-1782831312544-3-page-1",
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
              ]
            },
            {
              "key": "scenario-1782831312544-3-page-2",
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
              ]
            },
            {
              "key": "scenario-1782831312544-3-page-3",
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
              ]
            },
            {
              "key": "scenario-1782831312544-3-page-4",
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
              ]
            }
          ],
          "navigation": [
            {
              "label": "门岗入场核验工作台",
              "target": "GateCheckView.vue（集成入口）或 EntraceCheckComponent.vue",
              "default": true
            },
            {
              "label": "出场核验页面",
              "target": "GateCheckView.vue（集成入口）或 ExitCheckComponent.vue",
              "default": false
            },
            {
              "label": "异常处理页面",
              "target": "GateCheckView.vue（集成异常弹窗）或 ExceptionHandlingComponent.vue",
              "default": false
            },
            {
              "label": "核验日志查询页面",
              "target": "GateCheckView.vue（内嵌列表）或独立页面 GateLogView.vue",
              "default": false
            }
          ],
          "fileStructure": {
            "views": [
              "GateCheckView.vue（集成入口）或 EntraceCheckComponent.vue",
              "GateCheckView.vue（集成入口）或 ExitCheckComponent.vue",
              "GateCheckView.vue（集成异常弹窗）或 ExceptionHandlingComponent.vue",
              "GateCheckView.vue（内嵌列表）或独立页面 GateLogView.vue"
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
        "scenario-1782831312544-4": {
          "pages": [
            {
              "key": "scenario-1782831312544-4-page-1",
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
              ]
            },
            {
              "key": "scenario-1782831312544-4-page-2",
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
              ]
            },
            {
              "key": "scenario-1782831312544-4-page-3",
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
              ]
            },
            {
              "key": "scenario-1782831312544-4-page-4",
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
              ]
            }
          ],
          "navigation": [
            {
              "label": "外协车辆预约入场工作台",
              "target": "VehicleReservationView.vue",
              "default": true
            },
            {
              "label": "授权凭证页面",
              "target": "VehicleReservationView.vue",
              "default": false
            },
            {
              "label": "入场记录页面",
              "target": "VehicleReservationView.vue",
              "default": false
            },
            {
              "label": "出场核验页面",
              "target": "VehicleReservationView.vue",
              "default": false
            }
          ],
          "fileStructure": {
            "views": [
              "VehicleReservationView.vue",
              "VehicleReservationView.vue",
              "VehicleReservationView.vue",
              "VehicleReservationView.vue"
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
      "savedAt": "2026-07-01T06:10:57.724Z"
    },
    "confirmedAt": "2026-07-01T06:18:04.756Z"
  },
  "prompt": "请基于 Vue3 + Vite 生成一个海工生产运营前端原型。\n\n要求：\n1. 先不调用真实后端，只使用本地 mock 数据。\n2. 页面包含 ProjectOverviewView、ScheduleTrackingView、IssueTrackingView。\n3. 通用组件包含 MetricCard、StatusTag、DataTable、EmptyState。\n4. 页面需要体现 loading、empty、success、error 四类状态。\n5. API 返回结构统一使用 success、message、data、error_code。\n6. 不引入复杂 UI 组件库，优先使用普通 HTML、CSS 和 Vue3 Composition API。\n7. 代码要便于后续替换为 FastAPI 接口调用。"
}
```
<!-- FDE_STEP_RESULT_JSON_END -->
