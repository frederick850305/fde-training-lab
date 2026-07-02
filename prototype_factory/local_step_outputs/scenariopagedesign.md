# 02 场景→页面

- 步骤标识：`scenariopagedesign`
- 保存时间：2026-07-02T10:26:35.494932+00:00
- 用途：作为下一步工作台的输入来源。

## 内容摘要

- 已保存该步骤的结构化输出。

## 结构化数据

<!-- FDE_STEP_RESULT_JSON_START -->
```json
{
  "roles": [
    {
      "id": "role-1782987090417-0",
      "name": "调度员",
      "focus": "负责用车申请审批、调度派车、任务下发、查看车辆状态地图、进行合理派车、处理异常情况",
      "tagText": "现场调度、资源协调、异常闭环"
    },
    {
      "id": "role-1782987090417-1",
      "name": "司机",
      "focus": "通过移动端查看任务、导航到作业点、上传现场照片、确认到达和完成任务",
      "tagText": "任务接收、状态回传、异常反馈"
    },
    {
      "id": "role-1782987090417-2",
      "name": "门岗人员",
      "focus": "根据车辆预约和派车任务自动核验是否允许入场",
      "tagText": "入场核验、车辆放行、异常登记"
    },
    {
      "id": "role-1782987090417-3",
      "name": "管理人员",
      "focus": "查看统计分析报表，优化车辆资源配置，管理外协车辆费用",
      "tagText": "查看业务状态、处理待办事项、跟踪执行进展"
    }
  ],
  "sourceRoles": [
    {
      "name": "调度员",
      "focus": "负责用车申请审批、调度派车、任务下发、查看车辆状态地图、进行合理派车、处理异常情况",
      "tags": [
        "现场调度",
        "资源协调",
        "异常闭环"
      ]
    },
    {
      "name": "司机",
      "focus": "通过移动端查看任务、导航到作业点、上传现场照片、确认到达和完成任务",
      "tags": [
        "任务接收",
        "状态回传",
        "异常反馈"
      ]
    },
    {
      "name": "门岗人员",
      "focus": "根据车辆预约和派车任务自动核验是否允许入场",
      "tags": [
        "入场核验",
        "车辆放行",
        "异常登记"
      ]
    },
    {
      "name": "管理人员",
      "focus": "查看统计分析报表，优化车辆资源配置，管理外协车辆费用",
      "tags": [
        "查看业务状态",
        "处理待办事项",
        "跟踪执行进展"
      ]
    }
  ],
  "scenarios": [
    {
      "key": "sc-1",
      "name": "调度员现场调度派车与异常处理",
      "priority": "P0",
      "description": "调度员在车辆调度看板上实时查看任务请求、车辆位置和状态地图，根据作业区域、车辆类型、任务优先级和距离等因素合理派车，并处理超速告警、禁入区域等异常情况。",
      "workflow": [
        "查看调度看板与待派任务列表",
        "分析车辆状态并执行派车操作",
        "监控任务执行并处理异常告警"
      ],
      "pageMapping": {
        "role": "调度员",
        "page": "VehicleDispatchView.vue",
        "modules": [
          "调度总览地图",
          "任务派发面板",
          "异常告警处理"
        ]
      }
    },
    {
      "key": "sc-2",
      "name": "司机移动端任务接收与作业确认",
      "priority": "P0",
      "description": "司机通过手机APP接收调度下发的派车任务，获取导航信息前往作业点，到达后拍照上传并确认到达，完成装卸后提交任务关闭，实现任务执行全程闭环。",
      "workflow": [
        "接收任务并查看作业详情",
        "导航至作业点并确认到达",
        "上传现场照片并提交任务完成"
      ],
      "pageMapping": {
        "role": "司机",
        "page": "DriverTaskView.vue",
        "modules": [
          "任务列表",
          "导航与作业确认",
          "照片上传与任务提交"
        ]
      }
    },
    {
      "key": "sc-3",
      "name": "门岗人员入场核验与放行管理",
      "priority": "P1",
      "description": "门岗人员通过系统查看待入场车辆列表，自动比对车辆预约和派车任务授权，人工确认后放行，并登记异常车辆或未授权入场告警。",
      "workflow": [
        "查看入场核验列表与自动比对",
        "人工确认车辆授权信息",
        "放行通过或登记异常并触发告警"
      ],
      "pageMapping": {
        "role": "门岗人员",
        "page": "GateCheckView.vue",
        "modules": [
          "入场核验列表",
          "自动核验结果展示",
          "放行与异常登记"
        ]
      }
    },
    {
      "key": "sc-4",
      "name": "管理人员查看运营报表与资源优化",
      "priority": "P1",
      "description": "管理人员在报表中心查看车辆利用率、任务完成率、平均等待时长、空驶率等统计分析数据，分析外协车辆使用情况，辅助优化车辆资源配置和费用管理。",
      "workflow": [
        "选择报表周期和指标维度",
        "查看图表与关键数据摘要",
        "导出报表并制定优化决策"
      ],
      "pageMapping": {
        "role": "管理人员",
        "page": "ManagerReportsView.vue",
        "modules": [
          "报表筛选区",
          "指标图表展示",
          "数据导出与决策建议"
        ]
      }
    }
  ],
  "availableScenarios": [
    {
      "key": "sc-1",
      "name": "调度员现场调度派车与异常处理",
      "priority": "P0",
      "description": "调度员在车辆调度看板上实时查看任务请求、车辆位置和状态地图，根据作业区域、车辆类型、任务优先级和距离等因素合理派车，并处理超速告警、禁入区域等异常情况。",
      "workflow": [
        "查看调度看板与待派任务列表",
        "分析车辆状态并执行派车操作",
        "监控任务执行并处理异常告警"
      ],
      "pageMapping": {
        "role": "调度员",
        "page": "VehicleDispatchView.vue",
        "modules": [
          "调度总览地图",
          "任务派发面板",
          "异常告警处理"
        ]
      }
    },
    {
      "key": "sc-2",
      "name": "司机移动端任务接收与作业确认",
      "priority": "P0",
      "description": "司机通过手机APP接收调度下发的派车任务，获取导航信息前往作业点，到达后拍照上传并确认到达，完成装卸后提交任务关闭，实现任务执行全程闭环。",
      "workflow": [
        "接收任务并查看作业详情",
        "导航至作业点并确认到达",
        "上传现场照片并提交任务完成"
      ],
      "pageMapping": {
        "role": "司机",
        "page": "DriverTaskView.vue",
        "modules": [
          "任务列表",
          "导航与作业确认",
          "照片上传与任务提交"
        ]
      }
    },
    {
      "key": "sc-3",
      "name": "门岗人员入场核验与放行管理",
      "priority": "P1",
      "description": "门岗人员通过系统查看待入场车辆列表，自动比对车辆预约和派车任务授权，人工确认后放行，并登记异常车辆或未授权入场告警。",
      "workflow": [
        "查看入场核验列表与自动比对",
        "人工确认车辆授权信息",
        "放行通过或登记异常并触发告警"
      ],
      "pageMapping": {
        "role": "门岗人员",
        "page": "GateCheckView.vue",
        "modules": [
          "入场核验列表",
          "自动核验结果展示",
          "放行与异常登记"
        ]
      }
    },
    {
      "key": "sc-4",
      "name": "管理人员查看运营报表与资源优化",
      "priority": "P1",
      "description": "管理人员在报表中心查看车辆利用率、任务完成率、平均等待时长、空驶率等统计分析数据，分析外协车辆使用情况，辅助优化车辆资源配置和费用管理。",
      "workflow": [
        "选择报表周期和指标维度",
        "查看图表与关键数据摘要",
        "导出报表并制定优化决策"
      ],
      "pageMapping": {
        "role": "管理人员",
        "page": "ManagerReportsView.vue",
        "modules": [
          "报表筛选区",
          "指标图表展示",
          "数据导出与决策建议"
        ]
      }
    }
  ],
  "selectedScenarioKey": "sc-4",
  "modulesByScenarioKey": {
    "sc-1": [
      {
        "key": "mod-1",
        "priority": "P0",
        "name": "车辆状态与调度总览地图",
        "description": "提供车辆实时位置、状态（空闲/繁忙/排队/异常）的地图展示，整合待派任务标记，支持调度员快速掌握全局态势。",
        "features": [
          "在地图上标注所有车辆当前位置和状态颜色标记",
          "显示待派任务请求的分布及优先级标识",
          "支持地图缩放、平移、点击车辆查看详细状态信息",
          "提供车辆筛选（类型、区域、状态）和快速定位功能"
        ],
        "pageSuggestion": "VehicleDispatchView.vue",
        "apiSuggestion": "GET /api/dispatch/overview; GET /api/vehicle/status-map"
      },
      {
        "key": "mod-2",
        "priority": "P0",
        "name": "任务派发与分配操作",
        "description": "展示待派任务列表，支持按区域、车辆类型、优先级、距离等条件筛选，执行派车操作并生成任务下发。",
        "features": [
          "展示待派任务列表（含申请时间、作业区域、货物类型等）",
          "支持根据车辆状态和距离推荐可用车辆",
          "执行派车操作（选择车辆、分配司机、确认下发）",
          "派车后自动更新车辆状态并推送任务给司机"
        ],
        "pageSuggestion": "TaskDispatchPanel.vue",
        "apiSuggestion": "GET /api/dispatch/pending-tasks; POST /api/dispatch/assign"
      },
      {
        "key": "mod-3",
        "priority": "P1",
        "name": "任务执行监控",
        "description": "监控已派发任务的执行全过程，包括司机接单、到达、装卸、完成状态，以及任务异常（超时、偏离路线）的预警。",
        "features": [
          "展示在途任务列表及实时状态（待接单/已接单/途中/到达/完成）",
          "查看每个任务的执行轨迹和时间节点",
          "识别超时未接单或未到达任务并触发提醒",
          "支持调度员手动干预（重新派车、取消任务等）"
        ],
        "pageSuggestion": "VehicleDispatchView.vue",
        "apiSuggestion": "GET /api/dispatch/active-tasks; PUT /api/dispatch/task/{id}/intervene"
      },
      {
        "key": "mod-4",
        "priority": "P0",
        "name": "异常告警处理",
        "description": "集中展示车辆运行中的异常告警（超速、禁入区域、证照过期、异常停留等），支持快速定位告警车辆并执行处理操作。",
        "features": [
          "实时展示告警列表（类型、时间、车辆、位置）",
          "点击告警可在地图上定位该车辆",
          "支持处理告警（确认、忽略、通知司机、上报）",
          "记录告警处理日志，统计告警类型分布"
        ],
        "pageSuggestion": "VehicleDispatchView.vue",
        "apiSuggestion": "GET /api/alert/list; POST /api/alert/{id}/handle"
      }
    ],
    "sc-2": [
      {
        "key": "mod-1",
        "priority": "P0",
        "name": "任务接收与详情查看",
        "description": "司机接收调度下发的派车任务，查看任务详情包括作业点、时间要求、货物信息等。",
        "features": [
          "展示待接收与已接收任务列表",
          "支持手动刷新与推送通知接收新任务",
          "点击任务查看完整作业详情（地址、联系人、货物、备注）",
          "接收任务并更新任务状态为已接受"
        ],
        "pageSuggestion": "DriverTaskView.vue",
        "apiSuggestion": "GET /api/driver/tasks, POST /api/driver/tasks/{id}/accept"
      },
      {
        "key": "mod-2",
        "priority": "P0",
        "name": "导航与到达确认",
        "description": "司机根据任务作业点信息发起导航，到达现场后通过位置或手动确认到达。",
        "features": [
          "调用手机地图应用导航至作业点",
          "显示作业点地址与联系电话便于沟通",
          "到达后点击确认到达按钮，上传到达时间与位置信息",
          "处理异常情况如无法到达、地点变更等上报功能"
        ],
        "pageSuggestion": "DriverTaskView.vue",
        "apiSuggestion": "POST /api/driver/tasks/{id}/arrive, GET /api/driver/tasks/{id}/route"
      },
      {
        "key": "mod-3",
        "priority": "P0",
        "name": "现场拍照与任务关闭",
        "description": "司机在作业完成后拍摄现场照片（装卸前后或凭证），提交任务完成并关闭流程。",
        "features": [
          "拍摄或从相册选择装卸过程照片",
          "上传多张照片并附带备注说明",
          "确认任务完成并提交关闭，触发后续审批或结算流程",
          "查看任务完成状态与历史记录"
        ],
        "pageSuggestion": "DriverTaskView.vue",
        "apiSuggestion": "POST /api/driver/tasks/{id}/photos, POST /api/driver/tasks/{id}/complete"
      }
    ],
    "sc-3": [
      {
        "key": "mod-1",
        "priority": "P0",
        "name": "待入场车辆核验列表",
        "description": "展示待入场车辆基本信息及预约、派车任务的自动比对结果，支持门岗人员快速检索和筛选。",
        "features": [
          "加载待入场车辆列表，显示车牌、车型、所属单位、预约号、派车任务",
          "自动比对车辆预约和派车任务授权状态，标注通过/未授权/待确认标签",
          "支持按车牌、入场时段、车辆类型等条件筛选和排序",
          "提供刷新列表和分页浏览功能"
        ],
        "pageSuggestion": "GateCheckView.vue",
        "apiSuggestion": "GET /api/gate/pending-vehicles"
      },
      {
        "key": "mod-2",
        "priority": "P0",
        "name": "人工核验确认",
        "description": "门岗人员逐条或批量查看车辆授权详情，人工确认准入资格，完成入场前的最后审核。",
        "features": [
          "查看车辆预约详情、派车任务单、司机及随行人员信息",
          "人工标记车辆授权状态（允许/拒绝/待补充资料）",
          "支持单辆确认与批量确认操作",
          "确认后自动更新核验结果并通知后续流程"
        ],
        "pageSuggestion": "GateCheckView.vue",
        "apiSuggestion": "POST /api/gate/verify"
      },
      {
        "key": "mod-3",
        "priority": "P0",
        "name": "放行与异常登记",
        "description": "执行车辆放行操作或登记异常车辆信息，触发未授权入场告警，记录处理结果。",
        "features": [
          "执行放行操作，记录放行时间和门岗人员",
          "对于未授权车辆，登记异常原因并触发实时告警通知",
          "支持手动补录异常车辆入场记录（如紧急放行）",
          "查看异常登记历史，支持编辑备注和关联告警"
        ],
        "pageSuggestion": "GateCheckView.vue",
        "apiSuggestion": "POST /api/gate/release, POST /api/gate/exception"
      }
    ],
    "sc-4": [
      {
        "key": "mod-1",
        "priority": "P0",
        "name": "报表筛选与查询",
        "description": "提供报表周期和指标维度的选择与筛选功能，支持按车辆类型、外协单位、时间范围等维度灵活查询。",
        "features": [
          "支持选择报表周期（日/周/月/自定义范围）",
          "支持选择指标维度（车辆利用率、任务完成率、平均等待时长、空驶率等）",
          "支持按车辆类型、外协/自有等分类进一步筛选",
          "支持重置筛选条件并重新查询"
        ],
        "pageSuggestion": "ManagerReportsView.vue",
        "apiSuggestion": "GET /api/reports/filter-options, POST /api/reports/query"
      },
      {
        "key": "mod-2",
        "priority": "P0",
        "name": "指标图表展示",
        "description": "以图表和关键数据摘要的形式直观展示车辆利用率、任务完成率、平均等待时长、空驶率等统计分析数据。",
        "features": [
          "展示车辆利用率趋势图（折线图/柱状图）",
          "展示任务完成率及外协车辆使用次数统计图",
          "展示平均等待时长、空驶率等关键数据摘要卡片",
          "支持图表交互（悬停查看详情、点击下钻）"
        ],
        "pageSuggestion": "ManagerReportsView.vue",
        "apiSuggestion": "GET /api/reports/chart-data"
      },
      {
        "key": "mod-3",
        "priority": "P1",
        "name": "数据导出与决策建议",
        "description": "支持将当前报表数据导出为文件，并根据分析结果自动生成资源优化建议，辅助管理人员制定决策。",
        "features": [
          "支持将图表和表格数据导出为Excel/PDF格式",
          "展示资源优化建议（如外协车辆费用优化、减少空驶率的调度策略）",
          "支持一键下载导出文件",
          "记录导出历史以供追溯"
        ],
        "pageSuggestion": "ManagerReportsView.vue",
        "apiSuggestion": "GET /api/reports/export, GET /api/reports/optimization-advice"
      }
    ]
  },
  "pageDesignsByScenarioKey": {
    "sc-1": {
      "pages": [
        {
          "key": "page-1",
          "priority": "P0",
          "type": "工作台页",
          "name": "调度员现场调度派车与异常处理工作台",
          "vueFile": "VehicleDispatchView.vue",
          "goal": "调度员在车辆调度看板上实时查看任务请求、车辆位置和状态地图，根据作业区域、车辆类型、任务优先级和距离等因素合理派车，并处理超速告警、禁入区域等异常情况。",
          "features": [
            "车辆状态与调度总览地图",
            "任务派发与分配操作",
            "任务执行监控",
            "异常告警处理"
          ],
          "sections": [
            "地图总览区",
            "任务派发区",
            "任务监控区",
            "告警处理区"
          ]
        }
      ],
      "navigation": [
        {
          "label": "调度员现场调度派车与异常处理",
          "target": "VehicleDispatchView.vue",
          "default": true
        }
      ],
      "fileStructure": {
        "views": [
          "VehicleDispatchView.vue"
        ],
        "components": [
          "DispatchMap.vue",
          "TaskList.vue",
          "AlertList.vue",
          "StatusTag.vue"
        ],
        "data": [
          "scenarioMockData.js"
        ]
      }
    },
    "sc-2": {
      "pages": [
        {
          "key": "page-1",
          "priority": "P0",
          "type": "工作台页",
          "name": "司机移动端任务接收与作业确认工作台",
          "vueFile": "DriverTaskView.vue",
          "goal": "司机在移动端集中接收调度任务、导航至作业点确认到达、拍照提交任务完成，实现任务执行全程操作。",
          "features": [
            "任务接收与详情查看",
            "导航与到达确认",
            "现场拍照与任务关闭"
          ],
          "sections": [
            "顶部操作栏",
            "任务列表区",
            "作业详情与导航区",
            "照片上传与任务提交区"
          ]
        }
      ],
      "navigation": [
        {
          "label": "司机移动端任务接收与作业确认",
          "target": "DriverTaskView.vue",
          "default": true
        }
      ],
      "fileStructure": {
        "views": [
          "DriverTaskView.vue"
        ],
        "components": [
          "StatusTag.vue",
          "TaskCard.vue",
          "PhotoUploader.vue",
          "NavigationAction.vue"
        ],
        "data": [
          "scenarioMockData.js"
        ]
      }
    },
    "sc-3": {
      "pages": [
        {
          "key": "page-1",
          "priority": "P0",
          "type": "工作台页",
          "name": "门岗人员入场核验与放行管理工作台",
          "vueFile": "GateCheckView.vue",
          "goal": "门岗人员在一个界面内完成待入场车辆核验、人工授权确认、放行或异常登记，实现入场全流程管控",
          "features": [
            "待入场车辆核验列表",
            "人工核验确认",
            "放行与异常登记"
          ],
          "sections": [
            "顶部筛选与状态栏",
            "车辆核验列表区",
            "核验详情与确认操作区",
            "异常登记与告警区"
          ]
        }
      ],
      "navigation": [
        {
          "label": "门岗核验放行",
          "target": "GateCheckView.vue",
          "default": true
        }
      ],
      "fileStructure": {
        "views": [
          "GateCheckView.vue"
        ],
        "components": [
          "StatusTag.vue",
          "DataTable.vue",
          "VerifyModal.vue",
          "ExceptionForm.vue",
          "BatchActions.vue"
        ],
        "data": [
          "gateCheckMockData.js"
        ]
      }
    },
    "sc-4": {
      "pages": [
        {
          "key": "page-1",
          "priority": "P0",
          "type": "工作台页",
          "name": "管理人员查看运营报表与资源优化工作台",
          "vueFile": "ManagerReportsView.vue",
          "goal": "管理人员综合查看运营报表、分析关键指标并导出决策建议",
          "features": [
            "报表筛选与查询",
            "指标图表展示",
            "数据导出与决策建议"
          ],
          "sections": [
            "报表筛选栏",
            "图表与摘要展示区",
            "决策建议区",
            "导出操作区"
          ]
        }
      ],
      "navigation": [
        {
          "label": "运营报表与资源优化",
          "target": "ManagerReportsView.vue",
          "default": true
        }
      ],
      "fileStructure": {
        "views": [
          "ManagerReportsView.vue"
        ],
        "components": [
          "ReportFilterBar.vue",
          "ChartCard.vue",
          "SummaryCard.vue",
          "AdvicePanel.vue",
          "ExportButton.vue"
        ],
        "data": [
          "scenarioMockData.js"
        ]
      }
    }
  },
  "activeKey": "sc-4",
  "savedAt": "2026-07-02T10:26:35.491Z"
}
```
<!-- FDE_STEP_RESULT_JSON_END -->
