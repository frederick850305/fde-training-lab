export const prototypeContract = {
  "version": 1,
  "projectName": "车辆管理",
  "customerName": "HG",
  "defaultRole": "dispatcher",
  "roles": [
    {
      "key": "dispatcher",
      "label": "调度员",
      "userName": "调度员-王敏",
      "description": "处理派车、监控告警和任务调整"
    },
    {
      "key": "driver",
      "label": "司机",
      "userName": "司机-李师傅",
      "description": "查看并执行本人运输任务"
    },
    {
      "key": "gate",
      "label": "门岗",
      "userName": "门岗-赵工",
      "description": "车辆入场核验与放行记录处理"
    },
    {
      "key": "approver",
      "label": "审批人员",
      "userName": "审批-陈主管",
      "description": "审批外协预约和授权码同步"
    },
    {
      "key": "manager",
      "label": "管理层",
      "userName": "管理层-刘总",
      "description": "查看运营报表和管理分析"
    },
    {
      "key": "admin",
      "label": "系统管理员",
      "userName": "管理员-周工",
      "description": "维护车辆档案和系统配置"
    }
  ],
  "navigationGroups": [
    {
      "group": "调度指挥",
      "icon": "🚦",
      "defaultRole": "dispatcher",
      "routes": [
        {
          "path": "/dispatch/workbench",
          "component": "DispatchWorkbenchView",
          "file": "DispatchWorkbenchView.vue",
          "title": "调度工作台",
          "default": true,
          "roles": [
            "dispatcher"
          ]
        },
        {
          "path": "/dispatch/monitor",
          "component": "AlertAndTaskMonitorView",
          "file": "AlertAndTaskMonitorView.vue",
          "title": "告警与任务监控",
          "default": false,
          "roles": [
            "dispatcher"
          ]
        },
        {
          "path": "/dispatch/mobile",
          "component": "MobileDispatchView",
          "file": "MobileDispatchView.vue",
          "title": "移动调度",
          "default": false,
          "roles": [
            "dispatcher"
          ]
        },
        {
          "path": "/dispatch/task-adjust",
          "component": "TaskAdjustView",
          "file": "TaskAdjustView.vue",
          "title": "任务调整",
          "default": false,
          "roles": [
            "dispatcher"
          ]
        }
      ]
    },
    {
      "group": "任务执行",
      "icon": "🚚",
      "defaultRole": "driver",
      "routes": [
        {
          "path": "/task/list",
          "component": "DriverTaskListView",
          "file": "DriverTaskListView.vue",
          "title": "司机任务列表",
          "default": true,
          "roles": [
            "driver"
          ]
        },
        {
          "path": "/task/execute",
          "component": "DriverTaskExecuteView",
          "file": "DriverTaskExecuteView.vue",
          "title": "任务执行",
          "default": false,
          "roles": [
            "driver"
          ]
        }
      ]
    },
    {
      "group": "场地管理",
      "icon": "🏢",
      "defaultRole": "gate",
      "routes": [
        {
          "path": "/gate/access-check",
          "component": "GateAccessCheckView",
          "file": "GateAccessCheckView.vue",
          "title": "门岗核验",
          "default": true,
          "roles": [
            "gate",
            "manager",
            "admin"
          ]
        },
        {
          "path": "/gate/entry-records",
          "component": "GateEntryRecordsView",
          "file": "GateEntryRecordsView.vue",
          "title": "入场记录",
          "default": false,
          "roles": [
            "gate",
            "manager",
            "admin"
          ]
        }
      ]
    },
    {
      "group": "外协管理",
      "icon": "📋",
      "defaultRole": "approver",
      "routes": [
        {
          "path": "/external/workspace",
          "component": "WorkspaceView",
          "file": "WorkspaceView.vue",
          "title": "预约工作台",
          "default": true,
          "roles": [
            "approver",
            "manager",
            "admin"
          ]
        },
        {
          "path": "/external/access-code",
          "component": "AccessCodeView",
          "file": "AccessCodeView.vue",
          "title": "授权码管理",
          "default": false,
          "roles": [
            "approver",
            "manager",
            "admin"
          ]
        },
        {
          "path": "/external/history",
          "component": "HistoryView",
          "file": "HistoryView.vue",
          "title": "历史记录",
          "default": false,
          "roles": [
            "approver",
            "manager",
            "admin"
          ]
        }
      ]
    },
    {
      "group": "综合管理",
      "icon": "📊",
      "defaultRole": "manager",
      "routes": [
        {
          "path": "/management/reports",
          "component": "ManagementReportsView",
          "file": "ManagementReportsView.vue",
          "title": "运营报表",
          "default": true,
          "roles": [
            "manager",
            "admin"
          ]
        },
        {
          "path": "/management/report-detail",
          "component": "ReportDetailView",
          "file": "ReportDetailView.vue",
          "title": "报表详情",
          "default": false,
          "roles": [
            "manager",
            "admin"
          ]
        },
        {
          "path": "/management/vehicle-archive",
          "component": "VehicleArchiveList",
          "file": "VehicleArchiveList.vue",
          "title": "车辆档案列表",
          "default": false,
          "roles": [
            "manager",
            "admin"
          ]
        },
        {
          "path": "/management/vehicle-archive/edit",
          "component": "VehicleArchiveEdit",
          "file": "VehicleArchiveEdit.vue",
          "title": "车辆档案编辑",
          "default": false,
          "roles": [
            "manager",
            "admin"
          ]
        },
        {
          "path": "/management/vehicle-archive/logs",
          "component": "VehicleArchiveLogs",
          "file": "VehicleArchiveLogs.vue",
          "title": "档案操作日志",
          "default": false,
          "roles": [
            "manager",
            "admin"
          ]
        }
      ]
    }
  ],
  "pages": [
    {
      "file": "DispatchWorkbenchView.vue",
      "component": "DispatchWorkbenchView",
      "title": "DispatchWorkbenchView",
      "responsibility": "调度员集中管理实时车辆状态、接收用车需求、执行派车操作，以地图和状态看板为核心支撑高效调度。",
      "mocks": [
        {
          "file": "mockDispatch.js",
          "importPath": "../data/mockDispatch.js",
          "dataExport": "dispatchRecords",
          "readFunction": "fetchDispatchData",
          "schema": [
            {
              "field": "demand",
              "type": "object",
              "description": "用车需求详情，包含需求ID、申请时间、申请人、出发地、目的地、需求时间、车辆类型等"
            },
            {
              "field": "vehicleList",
              "type": "array",
              "description": "可选车辆列表，每辆车包含车辆ID、车牌号、车辆类型、当前位置、司机姓名、司机电话、在线状态等"
            },
            {
              "field": "dispatchTask",
              "type": "object",
              "description": "派车后生成的任务信息，包含任务ID、任务状态、派车时间、司机ID、车辆ID等"
            },
            {
              "field": "adjustmentOperation",
              "type": "object",
              "description": "任务调整操作记录，包含操作类型（改派/取消/加派）、原因、目标司机ID、加派地点等"
            },
            {
              "field": "mobileAlert",
              "type": "object",
              "description": "移动端告警消息，包含告警ID、类型、车辆信息、位置、时间、紧急程度"
            },
            {
              "field": "nearbyVehicles",
              "type": "array",
              "description": "周边车辆信息列表，包含车辆ID、车牌号、当前位置、距离、司机状态"
            }
          ],
          "description": "调度派车相关Mock数据：包括派车确认、任务调整等API的请求与响应数据"
        }
      ],
      "apis": [
        {
          "method": "POST",
          "path": "/api/v1/tasks/dispatch",
          "usage": "调度员在地图或看板上确认派车时，提交派车请求生成任务并通知司机"
        },
        {
          "method": "POST",
          "path": "/api/tasks/adjustment",
          "usage": "调度员对已派发任务进行改派、取消或加派时，提交调整请求并记录操作日志"
        }
      ]
    },
    {
      "file": "AlertAndTaskMonitorView.vue",
      "component": "AlertAndTaskMonitorView",
      "title": "AlertAndTaskMonitorView",
      "responsibility": "实时监控车辆异常告警（超速、禁入、异常停留）并处理，同时跟踪已派发任务的执行进度，支持干预操作。",
      "mocks": [
        {
          "file": "mockAlerts.js",
          "importPath": "../data/mockAlerts.js",
          "dataExport": "alertsRecords",
          "readFunction": "fetchAlertsData",
          "schema": [
            {
              "field": "alertItem",
              "type": "object",
              "description": "单条告警记录，包含告警ID、告警类型（超速/禁入/异常停留/司机反馈）、车辆ID、车牌号、告警时间、紧急程度、处理状态、处理备注"
            },
            {
              "field": "taskProgress",
              "type": "object",
              "description": "已派发任务执行进度信息，包含任务ID、车辆ID、车牌号、司机、任务状态、当前阶段、预计完成时间"
            },
            {
              "field": "alertFilterParams",
              "type": "object",
              "description": "告警列表筛选参数，包含告警类型、车辆类型、紧急程度、排序字段"
            }
          ],
          "description": "告警监控相关Mock数据：包括实时告警列表、告警处理等API的请求与响应数据"
        }
      ],
      "apis": [
        {
          "method": "POST",
          "path": "/api/v1/alerts/handle",
          "usage": "监控人员对实时告警进行确认、忽略或转人工处理时，更新告警状态并记录备注"
        },
        {
          "method": "GET",
          "path": "/api/alerts/realtime",
          "usage": "页面加载时或定时刷新，获取当前车辆异常告警和司机反馈列表，支撑告警面板和任务监控"
        },
        {
          "method": "POST",
          "path": "/api/tasks/adjustment",
          "usage": "监控人员根据任务执行情况对异常任务进行改派或取消等干预操作"
        }
      ]
    },
    {
      "file": "DriverTaskListView.vue",
      "component": "DriverTaskListView",
      "title": "DriverTaskListView",
      "responsibility": "司机查看并确认接单，管理待接单、进行中、已完成的任务",
      "mocks": [
        {
          "file": "mockTasks.js",
          "importPath": "../data/mockTasks.js",
          "dataExport": "tasksRecords",
          "readFunction": "fetchTasksData",
          "schema": [
            {
              "field": "taskItem",
              "type": "object",
              "description": "单条任务信息，包含任务ID、任务标题、车牌号、出发地、目的地、作业点、任务状态（待接单/进行中/已完成）、创建时间、预计时间"
            },
            {
              "field": "taskDetail",
              "type": "object",
              "description": "任务完整详情，包含任务ID、车辆信息、司机信息、物资清单、导航信息、操作按钮（确认到达/完成）"
            },
            {
              "field": "taskCompletion",
              "type": "object",
              "description": "任务完成提交数据，包含现场照片列表、完成时间、备注"
            },
            {
              "field": "driverFeedback",
              "type": "object",
              "description": "司机反馈消息，包含反馈ID、类型、内容、时间、附件"
            }
          ],
          "description": "司机任务相关Mock数据：包括司机任务列表、任务完成确认等API的请求与响应数据"
        }
      ],
      "apis": [
        {
          "method": "GET",
          "path": "/api/driver/tasks",
          "usage": "司机进入任务列表页时，按状态筛选获取当前登录司机的任务列表，展示待接单、进行中、已完成任务"
        }
      ]
    },
    {
      "file": "DriverTaskExecuteView.vue",
      "component": "DriverTaskExecuteView",
      "title": "DriverTaskExecuteView",
      "responsibility": "司机查看任务完整详情、导航到作业点、确认到达与完成、发起异常反馈",
      "mocks": [
        {
          "file": "mockTasks.js",
          "importPath": "../data/mockTasks.js",
          "dataExport": "tasksRecords",
          "readFunction": "fetchTasksData",
          "schema": [
            {
              "field": "taskItem",
              "type": "object",
              "description": "单条任务信息，包含任务ID、任务标题、车牌号、出发地、目的地、作业点、任务状态（待接单/进行中/已完成）、创建时间、预计时间"
            },
            {
              "field": "taskDetail",
              "type": "object",
              "description": "任务完整详情，包含任务ID、车辆信息、司机信息、物资清单、导航信息、操作按钮（确认到达/完成）"
            },
            {
              "field": "taskCompletion",
              "type": "object",
              "description": "任务完成提交数据，包含现场照片列表、完成时间、备注"
            },
            {
              "field": "driverFeedback",
              "type": "object",
              "description": "司机反馈消息，包含反馈ID、类型、内容、时间、附件"
            }
          ],
          "description": "司机任务相关Mock数据：包括司机任务列表、任务完成确认等API的请求与响应数据"
        }
      ],
      "apis": [
        {
          "method": "POST",
          "path": "/api/driver/tasks/{taskId}/complete",
          "usage": "司机到达作业点完成任务时，上传现场照片并提交完成确认，触发后续同步"
        },
        {
          "method": "POST",
          "path": "/api/tasks/adjustment",
          "usage": "司机在执行过程中遇到异常情况时，发起异常反馈或请求任务调整"
        }
      ]
    },
    {
      "file": "MobileDispatchView.vue",
      "component": "MobileDispatchView",
      "title": "MobileDispatchView",
      "responsibility": "实时接收异常告警与司机反馈，查看周边车辆状态，并与司机即时通讯，快速发起任务调整。",
      "mocks": [
        {
          "file": "mockDispatch.js",
          "importPath": "../data/mockDispatch.js",
          "dataExport": "dispatchRecords",
          "readFunction": "fetchDispatchData",
          "schema": [
            {
              "field": "demand",
              "type": "object",
              "description": "用车需求详情，包含需求ID、申请时间、申请人、出发地、目的地、需求时间、车辆类型等"
            },
            {
              "field": "vehicleList",
              "type": "array",
              "description": "可选车辆列表，每辆车包含车辆ID、车牌号、车辆类型、当前位置、司机姓名、司机电话、在线状态等"
            },
            {
              "field": "dispatchTask",
              "type": "object",
              "description": "派车后生成的任务信息，包含任务ID、任务状态、派车时间、司机ID、车辆ID等"
            },
            {
              "field": "adjustmentOperation",
              "type": "object",
              "description": "任务调整操作记录，包含操作类型（改派/取消/加派）、原因、目标司机ID、加派地点等"
            },
            {
              "field": "mobileAlert",
              "type": "object",
              "description": "移动端告警消息，包含告警ID、类型、车辆信息、位置、时间、紧急程度"
            },
            {
              "field": "nearbyVehicles",
              "type": "array",
              "description": "周边车辆信息列表，包含车辆ID、车牌号、当前位置、距离、司机状态"
            }
          ],
          "description": "调度派车相关Mock数据：包括派车确认、任务调整等API的请求与响应数据"
        },
        {
          "file": "mockAlerts.js",
          "importPath": "../data/mockAlerts.js",
          "dataExport": "alertsRecords",
          "readFunction": "fetchAlertsData",
          "schema": [
            {
              "field": "alertItem",
              "type": "object",
              "description": "单条告警记录，包含告警ID、告警类型（超速/禁入/异常停留/司机反馈）、车辆ID、车牌号、告警时间、紧急程度、处理状态、处理备注"
            },
            {
              "field": "taskProgress",
              "type": "object",
              "description": "已派发任务执行进度信息，包含任务ID、车辆ID、车牌号、司机、任务状态、当前阶段、预计完成时间"
            },
            {
              "field": "alertFilterParams",
              "type": "object",
              "description": "告警列表筛选参数，包含告警类型、车辆类型、紧急程度、排序字段"
            }
          ],
          "description": "告警监控相关Mock数据：包括实时告警列表、告警处理等API的请求与响应数据"
        }
      ],
      "apis": [
        {
          "method": "GET",
          "path": "/api/alerts/realtime",
          "usage": "移动端页面打开时或定时刷新，获取实时告警和司机反馈消息，支撑告警及时响应"
        },
        {
          "method": "POST",
          "path": "/api/tasks/adjustment",
          "usage": "移动端调度员对异常任务进行快速改派、加派或取消操作"
        },
        {
          "method": "POST",
          "path": "/api/v1/tasks/dispatch",
          "usage": "移动端调度员在收到用车需求后，直接发起派车操作并通知司机"
        }
      ]
    },
    {
      "file": "TaskAdjustView.vue",
      "component": "TaskAdjustView",
      "title": "TaskAdjustView",
      "responsibility": "对选中车辆/任务执行改派、取消或新增临时任务，并填写异常处理记录提交上报。",
      "mocks": [
        {
          "file": "mockDispatch.js",
          "importPath": "../data/mockDispatch.js",
          "dataExport": "dispatchRecords",
          "readFunction": "fetchDispatchData",
          "schema": [
            {
              "field": "demand",
              "type": "object",
              "description": "用车需求详情，包含需求ID、申请时间、申请人、出发地、目的地、需求时间、车辆类型等"
            },
            {
              "field": "vehicleList",
              "type": "array",
              "description": "可选车辆列表，每辆车包含车辆ID、车牌号、车辆类型、当前位置、司机姓名、司机电话、在线状态等"
            },
            {
              "field": "dispatchTask",
              "type": "object",
              "description": "派车后生成的任务信息，包含任务ID、任务状态、派车时间、司机ID、车辆ID等"
            },
            {
              "field": "adjustmentOperation",
              "type": "object",
              "description": "任务调整操作记录，包含操作类型（改派/取消/加派）、原因、目标司机ID、加派地点等"
            },
            {
              "field": "mobileAlert",
              "type": "object",
              "description": "移动端告警消息，包含告警ID、类型、车辆信息、位置、时间、紧急程度"
            },
            {
              "field": "nearbyVehicles",
              "type": "array",
              "description": "周边车辆信息列表，包含车辆ID、车牌号、当前位置、距离、司机状态"
            }
          ],
          "description": "调度派车相关Mock数据：包括派车确认、任务调整等API的请求与响应数据"
        }
      ],
      "apis": [
        {
          "method": "POST",
          "path": "/api/tasks/adjustment",
          "usage": "在点击提交调整操作（改派、取消或新增临时任务）并填写异常处理记录后，调用该接口将调整内容和异常处理记录一并提交。"
        }
      ]
    },
    {
      "file": "GateAccessCheckView.vue",
      "component": "GateAccessCheckView",
      "title": "GateAccessCheckView",
      "responsibility": "门岗人员在固定终端上实时查看待核验车辆、查看核验详情、执行放行或拒绝操作，并在接口异常时进行降级处理。",
      "mocks": [
        {
          "file": "mockGate.js",
          "importPath": "../data/mockGate.js",
          "dataExport": "gateRecords",
          "readFunction": "fetchGateData",
          "schema": [
            {
              "field": "pendingVehicle",
              "type": "object",
              "description": "待核验车辆信息，包含车辆ID、车牌号、车辆类型、预约信息、证照状态、入场意图"
            },
            {
              "field": "entryRecord",
              "type": "object",
              "description": "历史入场记录，包含记录ID、车牌号、操作结果（放行/拒绝）、操作时间、操作员、拒绝原因、同步状态"
            },
            {
              "field": "gateActionParams",
              "type": "object",
              "description": "入场操作请求参数，包含车辆ID、操作类型、拒绝原因、备注、操作员ID"
            },
            {
              "field": "entryRecordFilter",
              "type": "object",
              "description": "入场记录筛选条件，包含起始日期、结束日期、车牌号、操作结果、同步状态"
            }
          ],
          "description": "门禁管理相关Mock数据：包括车辆入场操作、入场记录查询等API的请求与响应数据"
        }
      ],
      "apis": [
        {
          "method": "POST",
          "path": "/api/gate/vehicle-action",
          "usage": "门岗人员在核验车辆后，点击放行或拒绝按钮时调用此接口执行入场操作，并触发相应的道闸控制或拒绝记录生成。"
        }
      ]
    },
    {
      "file": "GateEntryRecordsView.vue",
      "component": "GateEntryRecordsView",
      "title": "GateEntryRecordsView",
      "responsibility": "门岗或管理员查看历史入场处理记录（放行/拒绝），追踪记录同步状态，对同步失败的记录进行手动重新同步。",
      "mocks": [
        {
          "file": "mockGate.js",
          "importPath": "../data/mockGate.js",
          "dataExport": "gateRecords",
          "readFunction": "fetchGateData",
          "schema": [
            {
              "field": "pendingVehicle",
              "type": "object",
              "description": "待核验车辆信息，包含车辆ID、车牌号、车辆类型、预约信息、证照状态、入场意图"
            },
            {
              "field": "entryRecord",
              "type": "object",
              "description": "历史入场记录，包含记录ID、车牌号、操作结果（放行/拒绝）、操作时间、操作员、拒绝原因、同步状态"
            },
            {
              "field": "gateActionParams",
              "type": "object",
              "description": "入场操作请求参数，包含车辆ID、操作类型、拒绝原因、备注、操作员ID"
            },
            {
              "field": "entryRecordFilter",
              "type": "object",
              "description": "入场记录筛选条件，包含起始日期、结束日期、车牌号、操作结果、同步状态"
            }
          ],
          "description": "门禁管理相关Mock数据：包括车辆入场操作、入场记录查询等API的请求与响应数据"
        }
      ],
      "apis": [
        {
          "method": "GET",
          "path": "/api/gate/entry-records",
          "usage": "页面加载或切换筛选条件时，调用此接口获取历史入场处理记录列表，用于展示入场记录表格并支持后续手动重新同步操作。"
        }
      ]
    },
    {
      "file": "ManagementReportsView.vue",
      "component": "ManagementReportsView",
      "title": "ManagementReportsView",
      "responsibility": "管理人员通过该页面查看实时关键运营指标，按时间、车辆类型、作业区域等维度筛选数据，通过指标卡片和趋势图快速掌握整体状况，并可导出报表或下钻到明细详情。",
      "mocks": [],
      "apis": [
        {
          "method": "GET",
          "path": "/api/reports/overview",
          "usage": "页面初始化或筛选条件变更时，调用此接口获取运营报表概览数据，包括指标卡片和趋势图数据，用于渲染概览工作台。"
        }
      ]
    },
    {
      "file": "ReportDetailView.vue",
      "component": "ReportDetailView",
      "title": "ReportDetailView",
      "responsibility": "展示从概览工作台下钻的明细数据，包括外协车辆费用明细、异常入场记录、排班排队分析等，支持进一步搜索、排序、分页以及当前明细的导出。",
      "mocks": [],
      "apis": [
        {
          "method": "GET",
          "path": "/api/reports/detail",
          "usage": "页面加载或用户切换明细类型、调整筛选条件、搜索、排序、分页时，调用此接口获取当前明细表格数据，用于展示和导出。"
        }
      ]
    },
    {
      "file": "WorkspaceView.vue",
      "component": "WorkspaceView",
      "title": "WorkspaceView",
      "responsibility": "集中处理外协/临时车辆预约申请，支持待办列表浏览、快速筛选、查看详情和审批操作（通过/驳回），以及审批通过后授权码同步状态监控。",
      "mocks": [
        {
          "file": "mockReservations.js",
          "importPath": "../data/mockReservations.js",
          "dataExport": "reservationsRecords",
          "readFunction": "fetchReservationsData",
          "schema": [
            {
              "field": "reservationItem",
              "type": "object",
              "description": "预约申请单，包含申请ID、车牌号、车辆类型、所属单位、作业区域、预约时间、申请状态、超时标记"
            },
            {
              "field": "approvalAction",
              "type": "object",
              "description": "审批操作参数，包含预约ID、是否通过、审批意见、是否强制通过"
            },
            {
              "field": "accessCode",
              "type": "object",
              "description": "授权码信息，包含授权码ID、授权码值、关联车牌号、同步状态、有效期、使用状态"
            },
            {
              "field": "historyRecord",
              "type": "object",
              "description": "历史预约记录，包含记录ID、车牌号、预约时间、审批状态、授权码、入场时间、出场时间、费用"
            }
          ],
          "description": "预约审批相关Mock数据：包括预约申请批准、授权码列表、历史预约查询等API的请求与响应数据"
        }
      ],
      "apis": [
        {
          "method": "POST",
          "path": "/api/reservations/{id}/approve",
          "usage": "审批人员点击通过按钮时调用，提交审批通过请求，系统生成授权码并触发门禁同步"
        },
        {
          "method": "GET",
          "path": "/api/access-codes",
          "usage": "在审批通过后或手动刷新时调用，用于监控授权码同步状态"
        }
      ]
    },
    {
      "file": "AccessCodeView.vue",
      "component": "AccessCodeView",
      "title": "AccessCodeView",
      "responsibility": "查看所有已生成授权码的列表及状态，监控门禁同步情况，处理同步失败记录，并查看授权码使用详情。",
      "mocks": [
        {
          "file": "mockReservations.js",
          "importPath": "../data/mockReservations.js",
          "dataExport": "reservationsRecords",
          "readFunction": "fetchReservationsData",
          "schema": [
            {
              "field": "reservationItem",
              "type": "object",
              "description": "预约申请单，包含申请ID、车牌号、车辆类型、所属单位、作业区域、预约时间、申请状态、超时标记"
            },
            {
              "field": "approvalAction",
              "type": "object",
              "description": "审批操作参数，包含预约ID、是否通过、审批意见、是否强制通过"
            },
            {
              "field": "accessCode",
              "type": "object",
              "description": "授权码信息，包含授权码ID、授权码值、关联车牌号、同步状态、有效期、使用状态"
            },
            {
              "field": "historyRecord",
              "type": "object",
              "description": "历史预约记录，包含记录ID、车牌号、预约时间、审批状态、授权码、入场时间、出场时间、费用"
            }
          ],
          "description": "预约审批相关Mock数据：包括预约申请批准、授权码列表、历史预约查询等API的请求与响应数据"
        }
      ],
      "apis": [
        {
          "method": "GET",
          "path": "/api/access-codes",
          "usage": "页面加载时调用，分页查询所有授权码列表，支持按同步状态筛选和车牌号搜索；手动刷新时也调用"
        }
      ]
    },
    {
      "file": "HistoryView.vue",
      "component": "HistoryView",
      "title": "HistoryView",
      "responsibility": "提供外协/临时车辆预约历史记录的多维度查询、详情追溯和导出，支持费用统计对账。",
      "mocks": [
        {
          "file": "mockReservations.js",
          "importPath": "../data/mockReservations.js",
          "dataExport": "reservationsRecords",
          "readFunction": "fetchReservationsData",
          "schema": [
            {
              "field": "reservationItem",
              "type": "object",
              "description": "预约申请单，包含申请ID、车牌号、车辆类型、所属单位、作业区域、预约时间、申请状态、超时标记"
            },
            {
              "field": "approvalAction",
              "type": "object",
              "description": "审批操作参数，包含预约ID、是否通过、审批意见、是否强制通过"
            },
            {
              "field": "accessCode",
              "type": "object",
              "description": "授权码信息，包含授权码ID、授权码值、关联车牌号、同步状态、有效期、使用状态"
            },
            {
              "field": "historyRecord",
              "type": "object",
              "description": "历史预约记录，包含记录ID、车牌号、预约时间、审批状态、授权码、入场时间、出场时间、费用"
            }
          ],
          "description": "预约审批相关Mock数据：包括预约申请批准、授权码列表、历史预约查询等API的请求与响应数据"
        }
      ],
      "apis": [
        {
          "method": "GET",
          "path": "/api/reservations/history",
          "usage": "页面加载时以及点击查询按钮时调用，根据筛选条件分页查询历史预约记录，用于列表展示和导出"
        }
      ]
    },
    {
      "file": "VehicleArchiveList.vue",
      "component": "VehicleArchiveList",
      "title": "VehicleArchiveList",
      "responsibility": "管理员查看全厂车辆档案列表，执行筛选、搜索、停用/启用操作，并接收到期提醒。",
      "mocks": [
        {
          "file": "mockVehicles.js",
          "importPath": "../data/mockVehicles.js",
          "dataExport": "vehiclesRecords",
          "readFunction": "fetchVehiclesData",
          "schema": [
            {
              "field": "vehicleItem",
              "type": "object",
              "description": "单辆车档案信息，包含车辆ID、车牌号、车辆类型、所属单位、司机姓名、司机电话、年检有效期、保险有效期、状态"
            },
            {
              "field": "vehicleSaveParams",
              "type": "object",
              "description": "保存车辆档案请求参数，包含车辆ID（编辑时）、车辆类型、车牌号、所属单位、司机信息、有效期"
            },
            {
              "field": "operationLog",
              "type": "object",
              "description": "操作日志记录，包含日志ID、操作人、操作时间、操作类型（新增/编辑/停用等）、关联车辆ID、变更详情"
            },
            {
              "field": "vehicleFilter",
              "type": "object",
              "description": "车辆列表筛选条件，包含车辆类型、所属单位、状态、有效期状态、关键字"
            }
          ],
          "description": "车辆档案相关Mock数据：包括车辆列表查询、保存车辆档案、操作日志查询等API的请求与响应数据"
        }
      ],
      "apis": [
        {
          "method": "GET",
          "path": "/api/vehicles",
          "usage": "页面加载时调用，获取车辆档案列表，支持筛选、搜索和分页；停用/启用操作后刷新列表"
        },
        {
          "method": "POST",
          "path": "/api/vehicles",
          "usage": "当管理员执行停用或启用操作时，调用此接口更新车辆状态字段（如启用/停用）"
        },
        {
          "method": "GET",
          "path": "/api/vehicles/logs",
          "usage": "在查看操作记录或接收到期提醒时，调用此接口获取车辆相关操作日志"
        }
      ]
    },
    {
      "file": "VehicleArchiveEdit.vue",
      "component": "VehicleArchiveEdit",
      "title": "VehicleArchiveEdit",
      "responsibility": "管理员新增或编辑车辆的全部基础档案信息，包括证照图片上传及有效期设置。",
      "mocks": [
        {
          "file": "mockVehicles.js",
          "importPath": "../data/mockVehicles.js",
          "dataExport": "vehiclesRecords",
          "readFunction": "fetchVehiclesData",
          "schema": [
            {
              "field": "vehicleItem",
              "type": "object",
              "description": "单辆车档案信息，包含车辆ID、车牌号、车辆类型、所属单位、司机姓名、司机电话、年检有效期、保险有效期、状态"
            },
            {
              "field": "vehicleSaveParams",
              "type": "object",
              "description": "保存车辆档案请求参数，包含车辆ID（编辑时）、车辆类型、车牌号、所属单位、司机信息、有效期"
            },
            {
              "field": "operationLog",
              "type": "object",
              "description": "操作日志记录，包含日志ID、操作人、操作时间、操作类型（新增/编辑/停用等）、关联车辆ID、变更详情"
            },
            {
              "field": "vehicleFilter",
              "type": "object",
              "description": "车辆列表筛选条件，包含车辆类型、所属单位、状态、有效期状态、关键字"
            }
          ],
          "description": "车辆档案相关Mock数据：包括车辆列表查询、保存车辆档案、操作日志查询等API的请求与响应数据"
        }
      ],
      "apis": [
        {
          "method": "GET",
          "path": "/api/vehicles",
          "usage": "编辑模式下打开页面时，根据车牌或ID筛选获取该车辆现有档案信息用于回显"
        },
        {
          "method": "POST",
          "path": "/api/vehicles",
          "usage": "点击保存按钮时调用，新增或更新车辆档案信息，包括证照图片上传和有效期设置"
        }
      ]
    },
    {
      "file": "VehicleArchiveLogs.vue",
      "component": "VehicleArchiveLogs",
      "title": "VehicleArchiveLogs",
      "responsibility": "管理员查询和导出所有车辆档案的关键操作日志，用于审计追溯。",
      "mocks": [
        {
          "file": "mockVehicles.js",
          "importPath": "../data/mockVehicles.js",
          "dataExport": "vehiclesRecords",
          "readFunction": "fetchVehiclesData",
          "schema": [
            {
              "field": "vehicleItem",
              "type": "object",
              "description": "单辆车档案信息，包含车辆ID、车牌号、车辆类型、所属单位、司机姓名、司机电话、年检有效期、保险有效期、状态"
            },
            {
              "field": "vehicleSaveParams",
              "type": "object",
              "description": "保存车辆档案请求参数，包含车辆ID（编辑时）、车辆类型、车牌号、所属单位、司机信息、有效期"
            },
            {
              "field": "operationLog",
              "type": "object",
              "description": "操作日志记录，包含日志ID、操作人、操作时间、操作类型（新增/编辑/停用等）、关联车辆ID、变更详情"
            },
            {
              "field": "vehicleFilter",
              "type": "object",
              "description": "车辆列表筛选条件，包含车辆类型、所属单位、状态、有效期状态、关键字"
            }
          ],
          "description": "车辆档案相关Mock数据：包括车辆列表查询、保存车辆档案、操作日志查询等API的请求与响应数据"
        }
      ],
      "apis": [
        {
          "method": "GET",
          "path": "/api/vehicles/logs",
          "usage": "页面加载时，根据筛选条件分页查询操作日志列表"
        }
      ]
    }
  ],
  "mocks": [
    {
      "file": "mockDispatch.js",
      "domain": "Dispatch",
      "dataExport": "dispatchRecords",
      "readFunction": "fetchDispatchData",
      "usedBy": [
        "DispatchWorkbenchView.vue",
        "TaskAdjustView.vue",
        "MobileDispatchView.vue"
      ],
      "schema": [
        {
          "field": "demand",
          "type": "object",
          "description": "用车需求详情，包含需求ID、申请时间、申请人、出发地、目的地、需求时间、车辆类型等"
        },
        {
          "field": "vehicleList",
          "type": "array",
          "description": "可选车辆列表，每辆车包含车辆ID、车牌号、车辆类型、当前位置、司机姓名、司机电话、在线状态等"
        },
        {
          "field": "dispatchTask",
          "type": "object",
          "description": "派车后生成的任务信息，包含任务ID、任务状态、派车时间、司机ID、车辆ID等"
        },
        {
          "field": "adjustmentOperation",
          "type": "object",
          "description": "任务调整操作记录，包含操作类型（改派/取消/加派）、原因、目标司机ID、加派地点等"
        },
        {
          "field": "mobileAlert",
          "type": "object",
          "description": "移动端告警消息，包含告警ID、类型、车辆信息、位置、时间、紧急程度"
        },
        {
          "field": "nearbyVehicles",
          "type": "array",
          "description": "周边车辆信息列表，包含车辆ID、车牌号、当前位置、距离、司机状态"
        }
      ],
      "description": "调度派车相关Mock数据：包括派车确认、任务调整等API的请求与响应数据"
    },
    {
      "file": "mockAlerts.js",
      "domain": "Alerts",
      "dataExport": "alertsRecords",
      "readFunction": "fetchAlertsData",
      "usedBy": [
        "AlertAndTaskMonitorView.vue",
        "MobileDispatchView.vue"
      ],
      "schema": [
        {
          "field": "alertItem",
          "type": "object",
          "description": "单条告警记录，包含告警ID、告警类型（超速/禁入/异常停留/司机反馈）、车辆ID、车牌号、告警时间、紧急程度、处理状态、处理备注"
        },
        {
          "field": "taskProgress",
          "type": "object",
          "description": "已派发任务执行进度信息，包含任务ID、车辆ID、车牌号、司机、任务状态、当前阶段、预计完成时间"
        },
        {
          "field": "alertFilterParams",
          "type": "object",
          "description": "告警列表筛选参数，包含告警类型、车辆类型、紧急程度、排序字段"
        }
      ],
      "description": "告警监控相关Mock数据：包括实时告警列表、告警处理等API的请求与响应数据"
    },
    {
      "file": "mockTasks.js",
      "domain": "Tasks",
      "dataExport": "tasksRecords",
      "readFunction": "fetchTasksData",
      "usedBy": [
        "DriverTaskListView.vue",
        "DriverTaskExecuteView.vue"
      ],
      "schema": [
        {
          "field": "taskItem",
          "type": "object",
          "description": "单条任务信息，包含任务ID、任务标题、车牌号、出发地、目的地、作业点、任务状态（待接单/进行中/已完成）、创建时间、预计时间"
        },
        {
          "field": "taskDetail",
          "type": "object",
          "description": "任务完整详情，包含任务ID、车辆信息、司机信息、物资清单、导航信息、操作按钮（确认到达/完成）"
        },
        {
          "field": "taskCompletion",
          "type": "object",
          "description": "任务完成提交数据，包含现场照片列表、完成时间、备注"
        },
        {
          "field": "driverFeedback",
          "type": "object",
          "description": "司机反馈消息，包含反馈ID、类型、内容、时间、附件"
        }
      ],
      "description": "司机任务相关Mock数据：包括司机任务列表、任务完成确认等API的请求与响应数据"
    },
    {
      "file": "mockGate.js",
      "domain": "Gate",
      "dataExport": "gateRecords",
      "readFunction": "fetchGateData",
      "usedBy": [
        "GateAccessCheckView.vue",
        "GateEntryRecordsView.vue"
      ],
      "schema": [
        {
          "field": "pendingVehicle",
          "type": "object",
          "description": "待核验车辆信息，包含车辆ID、车牌号、车辆类型、预约信息、证照状态、入场意图"
        },
        {
          "field": "entryRecord",
          "type": "object",
          "description": "历史入场记录，包含记录ID、车牌号、操作结果（放行/拒绝）、操作时间、操作员、拒绝原因、同步状态"
        },
        {
          "field": "gateActionParams",
          "type": "object",
          "description": "入场操作请求参数，包含车辆ID、操作类型、拒绝原因、备注、操作员ID"
        },
        {
          "field": "entryRecordFilter",
          "type": "object",
          "description": "入场记录筛选条件，包含起始日期、结束日期、车牌号、操作结果、同步状态"
        }
      ],
      "description": "门禁管理相关Mock数据：包括车辆入场操作、入场记录查询等API的请求与响应数据"
    },
    {
      "file": "mockReservations.js",
      "domain": "Reservations",
      "dataExport": "reservationsRecords",
      "readFunction": "fetchReservationsData",
      "usedBy": [
        "WorkspaceView.vue",
        "AccessCodeView.vue",
        "HistoryView.vue"
      ],
      "schema": [
        {
          "field": "reservationItem",
          "type": "object",
          "description": "预约申请单，包含申请ID、车牌号、车辆类型、所属单位、作业区域、预约时间、申请状态、超时标记"
        },
        {
          "field": "approvalAction",
          "type": "object",
          "description": "审批操作参数，包含预约ID、是否通过、审批意见、是否强制通过"
        },
        {
          "field": "accessCode",
          "type": "object",
          "description": "授权码信息，包含授权码ID、授权码值、关联车牌号、同步状态、有效期、使用状态"
        },
        {
          "field": "historyRecord",
          "type": "object",
          "description": "历史预约记录，包含记录ID、车牌号、预约时间、审批状态、授权码、入场时间、出场时间、费用"
        }
      ],
      "description": "预约审批相关Mock数据：包括预约申请批准、授权码列表、历史预约查询等API的请求与响应数据"
    },
    {
      "file": "mockVehicles.js",
      "domain": "Vehicles",
      "dataExport": "vehiclesRecords",
      "readFunction": "fetchVehiclesData",
      "usedBy": [
        "VehicleArchiveList.vue",
        "VehicleArchiveEdit.vue",
        "VehicleArchiveLogs.vue"
      ],
      "schema": [
        {
          "field": "vehicleItem",
          "type": "object",
          "description": "单辆车档案信息，包含车辆ID、车牌号、车辆类型、所属单位、司机姓名、司机电话、年检有效期、保险有效期、状态"
        },
        {
          "field": "vehicleSaveParams",
          "type": "object",
          "description": "保存车辆档案请求参数，包含车辆ID（编辑时）、车辆类型、车牌号、所属单位、司机信息、有效期"
        },
        {
          "field": "operationLog",
          "type": "object",
          "description": "操作日志记录，包含日志ID、操作人、操作时间、操作类型（新增/编辑/停用等）、关联车辆ID、变更详情"
        },
        {
          "field": "vehicleFilter",
          "type": "object",
          "description": "车辆列表筛选条件，包含车辆类型、所属单位、状态、有效期状态、关键字"
        }
      ],
      "description": "车辆档案相关Mock数据：包括车辆列表查询、保存车辆档案、操作日志查询等API的请求与响应数据"
    }
  ]
}

export default prototypeContract
