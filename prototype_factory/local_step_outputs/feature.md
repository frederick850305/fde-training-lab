# 03 功能设计

- 步骤标识：`feature`
- 保存时间：2026-07-01T15:42:11.770678+00:00
- 用途：作为下一步工作台的输入来源。

## 内容摘要

- **模块**：地图监控模块

## 结构化数据

<!-- FDE_STEP_RESULT_JSON_START -->
```json
{
  "allMappings": [
    {
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
      "modules": [
        {
          "key": "mapMonitor",
          "priority": "P0",
          "name": "地图监控模块",
          "sourceScenario": "调度员现场调度",
          "description": "基于地图看板实时展示所有车辆的位置、状态（空闲、排队、任务中、异常）、作业区域，支持缩放、点击查看车辆详情",
          "features": [
            "实时车辆位置标注与状态颜色区分",
            "点击车辆弹出详情窗口：车牌、司机、任务、状态",
            "地图图层切换：作业区域、禁入区域、排队区域",
            "车辆轨迹回放（可选）"
          ],
          "pageTitleSuggestion": "调度地图监控",
          "pageSuggestion": "DispatchMapView.vue",
          "apiSuggestion": "GET /api/vehicles/real-time-locations, GET /api/vehicles/{id}/detail",
          "scopeNote": "基于调度员通过地图看板查看车辆位置和状态的需求，以及车辆类型、状态筛选的支撑"
        },
        {
          "key": "vehicleFilter",
          "priority": "P0",
          "name": "车辆状态筛选模块",
          "sourceScenario": "调度员现场调度",
          "description": "支持按车辆类型、状态（空闲/排队/任务中）、作业区域、距离远近等条件筛选车辆，便于调度员快速定位合适车辆",
          "features": [
            "多条件组合筛选：车辆类型（生产车/物流车/外协车/临时车）、状态、区域",
            "筛选结果在地图上高亮显示",
            "列表视图展示筛选结果，支持排序",
            "一键重置筛选条件"
          ],
          "pageTitleSuggestion": "车辆状态筛选",
          "pageSuggestion": "VehicleFilterPanel.vue",
          "apiSuggestion": "GET /api/vehicles/filter?type=&status=&area=",
          "scopeNote": "根据业务场景中调度员需要筛选空闲/排队车辆，以及根据作业区域、车辆类型进行派车的需求"
        },
        {
          "key": "taskDispatch",
          "priority": "P0",
          "name": "任务派发模块",
          "sourceScenario": "调度员现场调度",
          "description": "调度员为选中的车辆分配任务，支持选择用车申请、输入作业点、选择优先级，并一键下发至司机移动端",
          "features": [
            "显示待派发的用车申请列表",
            "选择目标车辆后，匹配任务并确认派发",
            "支持紧急派车（跳过申请手动创建任务）",
            "派发成功后推送通知至司机端",
            "记录派发日志（操作人、时间、车辆、任务）"
          ],
          "pageTitleSuggestion": "任务派发",
          "pageSuggestion": "TaskDispatchDialog.vue",
          "apiSuggestion": "POST /api/tasks/dispatch, PUT /api/tasks/{id}/assign",
          "scopeNote": "基于调度员根据作业需求进行智能派车、任务下发的工作流程，及与司机移动端交互的需求"
        },
        {
          "key": "exceptionHandler",
          "priority": "P0",
          "name": "异常处理模块",
          "sourceScenario": "调度员现场调度",
          "description": "实时接收车辆异常告警（超速、禁入区域、异常停留、未授权入场等），支持调度员查看详情、处理告警、标记解决",
          "features": [
            "异常告警列表实时刷新，显示告警类型、车辆、时间、位置",
            "点击告警可在地图上定位车辆并查看详情",
            "支持处理告警：确认、忽略、通知相关人员",
            "告警历史记录查询与导出"
          ],
          "pageTitleSuggestion": "异常告警处理",
          "pageSuggestion": "ExceptionAlertPanel.vue",
          "apiSuggestion": "GET /api/alerts, PUT /api/alerts/{id}/handle",
          "scopeNote": "基于调度员需要处理异常情况的需求，以及系统安全管理能力（超速提醒、禁入区域告警等）"
        }
      ]
    },
    {
      "scenario": {
        "key": "scenario-1782887819107-1",
        "name": "司机任务执行",
        "priority": "P0",
        "description": "司机通过移动端接收调度任务，导航至指定作业点，现场确认到达、上传照片并完成任务关闭",
        "workflow": [
          "接收任务通知",
          "查看任务详情与作业点",
          "导航至作业点",
          "到达确认并上传现场照片",
          "完成装卸或转运",
          "提交任务完成"
        ],
        "pageMapping": {
          "role": "司机",
          "page": "TaskExecutionView.vue",
          "modules": [
            "任务列表模块",
            "任务详情模块",
            "导航模块",
            "现场反馈模块",
            "任务完成确认模块"
          ]
        }
      },
      "modules": [
        {
          "key": "taskList",
          "priority": "P0",
          "name": "任务列表模块",
          "sourceScenario": "司机任务执行",
          "description": "司机查看个人任务列表，接收新任务通知，筛选和查看不同状态的任务",
          "features": [
            "接收任务通知并显示未读标记",
            "按状态（待接单、进行中、已完成）筛选任务",
            "显示任务摘要信息（任务编号、作业点、要求时间）",
            "支持下拉刷新和分页加载"
          ],
          "pageTitleSuggestion": "任务列表",
          "pageSuggestion": "TaskListView.vue",
          "apiSuggestion": "GET /api/tasks?driverId={id}&status={status}",
          "scopeNote": "对应场景工作流第一步'接收任务通知'和第二步'查看任务详情与作业点'的列表展示需求"
        },
        {
          "key": "taskDetail",
          "priority": "P0",
          "name": "任务详情模块",
          "sourceScenario": "司机任务执行",
          "description": "展示任务的详细信息，包括作业点位置、任务要求、物资信息等",
          "features": [
            "展示作业点名称、地址、联系人信息",
            "展示任务要求（车辆类型、物资种类、作业说明）",
            "展示任务时间节点（计划到达时间、完成时间）",
            "提供导航入口和联系调度员功能"
          ],
          "pageTitleSuggestion": "任务详情",
          "pageSuggestion": "TaskDetailView.vue",
          "apiSuggestion": "GET /api/tasks/{taskId}",
          "scopeNote": "对应场景工作流第二步'查看任务详情与作业点'的详细展示需求"
        },
        {
          "key": "navigation",
          "priority": "P0",
          "name": "导航模块",
          "sourceScenario": "司机任务执行",
          "description": "从司机当前位置导航至指定作业点，实时显示路径和预计到达时间",
          "features": [
            "获取司机当前位置并计算到作业点的最优路径",
            "显示导航路线、距离和预计到达时间",
            "支持语音导航和路线偏离提醒",
            "到达作业点附近时自动触发到达确认提示"
          ],
          "pageTitleSuggestion": "导航与路径",
          "pageSuggestion": "NavigationView.vue",
          "apiSuggestion": "POST /api/navigation/route?origin={lat,lng}&destination={lat,lng}",
          "scopeNote": "对应场景工作流第三步'导航至作业点'的导航功能需求"
        },
        {
          "key": "siteFeedback",
          "priority": "P0",
          "name": "现场反馈模块",
          "sourceScenario": "司机任务执行",
          "description": "司机在到达作业点后确认到达，并上传现场照片或备注信息",
          "features": [
            "点击'到达确认'并记录到达时间",
            "现场拍照上传（支持多张照片）",
            "添加文字备注或异常说明",
            "反馈信息与任务关联并同步至调度端"
          ],
          "pageTitleSuggestion": "现场反馈",
          "pageSuggestion": "SiteFeedbackView.vue",
          "apiSuggestion": "POST /api/tasks/{taskId}/arrival (包含照片数据)",
          "scopeNote": "对应场景工作流第四步'到达确认并上传现场照片'的反馈需求"
        },
        {
          "key": "taskCompletion",
          "priority": "P0",
          "name": "任务完成确认模块",
          "sourceScenario": "司机任务执行",
          "description": "司机在完成装卸或转运后，提交任务完成并上传相关签收或作业完成凭证",
          "features": [
            "确认任务完成并录入实际完成时间",
            "上传签收单、作业完成照片等凭证",
            "提交后任务状态更新为已完成，通知调度员",
            "支持任务异常关闭（如未完成原因说明）"
          ],
          "pageTitleSuggestion": "任务完成确认",
          "pageSuggestion": "TaskCompletionView.vue",
          "apiSuggestion": "POST /api/tasks/{taskId}/completion",
          "scopeNote": "对应场景工作流第五步'完成装卸或转运'和第六步'提交任务完成'的完成确认需求"
        }
      ]
    },
    {
      "scenario": {
        "key": "scenario-1782887819107-2",
        "name": "门岗入场核验",
        "priority": "P1",
        "description": "门岗人员通过系统自动核验车辆预约和派车任务，确认车辆是否允许入场，并记录放行信息",
        "workflow": [
          "扫描车辆车牌或预约二维码",
          "系统自动核验预约有效性及任务关联",
          "根据核验结果放行或拒绝入场",
          "记录入场时间与车辆信息",
          "处理异常入场告警"
        ],
        "pageMapping": {
          "role": "门岗人员",
          "page": "GateCheckView.vue",
          "modules": [
            "入场核验模块",
            "放行管理模块",
            "异常告警模块",
            "放行记录查询模块"
          ]
        }
      },
      "modules": [
        {
          "key": "entryCheck",
          "priority": "P1",
          "name": "入场核验模块",
          "sourceScenario": "门岗入场核验",
          "description": "支持通过扫描车牌或预约二维码，自动核验车辆预约有效性及派车任务关联，快速得出入场许可结果",
          "features": [
            "扫描车牌或预约二维码",
            "自动核验预约有效性及任务关联",
            "显示核验结果（放行/拒绝）",
            "处理核验异常并引导手动操作"
          ],
          "pageTitleSuggestion": "入场核验 - 支持扫描车牌或二维码，自动核验预约与任务关联",
          "pageSuggestion": "EntryCheckPanel.vue",
          "apiSuggestion": "GET /api/vehicle/check，POST /api/vehicle/check/verify",
          "scopeNote": "对应门岗人员扫描核验流程，是场景核心操作入口"
        },
        {
          "key": "releaseManagement",
          "priority": "P1",
          "name": "放行管理模块",
          "sourceScenario": "门岗入场核验",
          "description": "根据核验结果执行放行或拒绝操作，记录放行时间、车辆信息，并更新相关任务状态",
          "features": [
            "手动确认放行或拒绝",
            "记录入场时间与车辆信息",
            "关联更新派车任务状态",
            "支持批量放行操作"
          ],
          "pageTitleSuggestion": "放行管理 - 管理车辆入场放行操作与记录",
          "pageSuggestion": "ReleaseManagementPanel.vue",
          "apiSuggestion": "POST /api/vehicle/release，GET /api/vehicle/release/record",
          "scopeNote": "对应放行/拒绝入场及信息记录流程"
        },
        {
          "key": "alertManagement",
          "priority": "P1",
          "name": "异常告警模块",
          "sourceScenario": "门岗入场核验",
          "description": "实时处理未授权入场、证照过期、异常停留等告警，支持告警确认、解除与上报",
          "features": [
            "告警实时展示与分类",
            "告警处理（确认/解除/上报）",
            "告警历史查询"
          ],
          "pageTitleSuggestion": "异常告警 - 处理入场违规与安全告警事件",
          "pageSuggestion": "AlertPanel.vue",
          "apiSuggestion": "GET /api/alert，POST /api/alert/handle",
          "scopeNote": "对应处理异常入场告警流程，保证安全管理"
        },
        {
          "key": "releaseRecordQuery",
          "priority": "P2",
          "name": "放行记录查询模块",
          "sourceScenario": "门岗入场核验",
          "description": "按时间、车牌、车辆类型等条件检索放行记录，查看核验详情，支持导出用于审计追溯",
          "features": [
            "多条件组合查询放行记录",
            "查看核验详情与放行凭证",
            "导出记录报表"
          ],
          "pageTitleSuggestion": "放行记录查询 - 追溯车辆入场放行历史数据",
          "pageSuggestion": "ReleaseRecordQueryView.vue",
          "apiSuggestion": "GET /api/vehicle/release/history",
          "scopeNote": "对应放行记录查询与历史追溯需求"
        }
      ]
    },
    {
      "scenario": {
        "key": "scenario-1782887819107-3",
        "name": "管理人员报表分析",
        "priority": "P1",
        "description": "管理人员查看车辆利用率、任务完成率、空驶率等统计报表，辅助车辆资源配置与费用优化决策",
        "workflow": [
          "选择报表类型与时间范围",
          "查看车辆利用率趋势图",
          "查看任务完成率与平均等待时长",
          "查看空驶率与排队统计",
          "查看外协车辆使用次数与异常记录",
          "导出报表或截图用于分析"
        ],
        "pageMapping": {
          "role": "管理人员",
          "page": "ReportDashboardView.vue",
          "modules": [
            "统计分析模块",
            "报表导出模块",
            "资源配置建议模块"
          ]
        }
      },
      "modules": [
        {
          "key": "statistics-analysis",
          "priority": "P1",
          "name": "统计分析模块",
          "sourceScenario": "管理人员报表分析",
          "description": "提供车辆利用率、任务完成率、平均等待时长、空驶率、排队情况、外协车辆使用次数、异常入场记录等核心统计指标的图表展示与分析功能",
          "features": [
            "按时间范围筛选报表数据",
            "展示车辆利用率趋势图",
            "展示任务完成率与平均等待时长图表",
            "展示空驶率与排队统计图表",
            "展示外协车辆使用次数与异常记录列表",
            "支持图表导出为图片或PDF"
          ],
          "pageTitleSuggestion": "车辆运营报表分析",
          "pageSuggestion": "StatisticsAnalysisView.vue",
          "apiSuggestion": "/api/reports/statistics",
          "scopeNote": "根据需求中管理人员希望查看车辆利用率、任务完成率、空驶率等统计分析报表，用于优化车辆资源配置和外协车辆费用管理"
        },
        {
          "key": "report-export",
          "priority": "P1",
          "name": "报表导出模块",
          "sourceScenario": "管理人员报表分析",
          "description": "支持将统计分析结果导出为Excel、PDF等格式，便于管理人员存档、分发和进一步分析",
          "features": [
            "选择导出格式（Excel/PDF）",
            "选择导出内容范围（全部报表/指定指标）",
            "一键导出并下载文件",
            "导出记录日志与审计追踪"
          ],
          "pageTitleSuggestion": "报表数据导出",
          "pageSuggestion": "ReportExportView.vue",
          "apiSuggestion": "/api/reports/export",
          "scopeNote": "根据场景工作流中“导出报表或截图用于分析”的要求，以及关键操作需留痕的审计需求"
        },
        {
          "key": "resource-allocation-suggestion",
          "priority": "P2",
          "name": "资源配置建议模块",
          "sourceScenario": "管理人员报表分析",
          "description": "基于历史数据与当前车辆使用情况，提供车辆资源配置优化建议和外协车辆费用管理参考",
          "features": [
            "分析车辆使用热点与瓶颈区域",
            "推荐车辆增减数量与类型调整",
            "展示外协车辆费用汇总与趋势",
            "提供资源配置优化报告预览"
          ],
          "pageTitleSuggestion": "资源配置优化建议",
          "pageSuggestion": "ResourceAllocationView.vue",
          "apiSuggestion": "/api/reports/resource-allocation",
          "scopeNote": "根据需求中“用于优化车辆资源配置和外协车辆费用管理”的业务目标，以及场景中辅助决策的定位"
        }
      ]
    }
  ],
  "module": {
    "key": "mapMonitor",
    "priority": "P0",
    "name": "地图监控模块",
    "sourceScenario": "调度员现场调度",
    "description": "基于地图看板实时展示所有车辆的位置、状态（空闲、排队、任务中、异常）、作业区域，支持缩放、点击查看车辆详情",
    "features": [
      "实时车辆位置标注与状态颜色区分",
      "点击车辆弹出详情窗口：车牌、司机、任务、状态",
      "地图图层切换：作业区域、禁入区域、排队区域",
      "车辆轨迹回放（可选）"
    ],
    "pageTitleSuggestion": "调度地图监控",
    "pageSuggestion": "DispatchMapView.vue",
    "apiSuggestion": "GET /api/vehicles/real-time-locations, GET /api/vehicles/{id}/detail",
    "scopeNote": "基于调度员通过地图看板查看车辆位置和状态的需求，以及车辆类型、状态筛选的支撑"
  },
  "revisedModulesByScenarioKey": {
    "scenario-1782804838550-2": [
      {
        "key": "scenario-1782804838550-2-scenario-module",
        "priority": "P1",
        "name": "门岗管理员查看业务状态工作台",
        "sourceScenario": "门岗管理员查看业务状态",
        "description": "围绕「门岗管理员查看业务状态」生成的场景专属功能模块，支撑门岗管理员完成当前任务流程。",
        "features": [
          "提供查看业务状态列表",
          "提供状态筛选",
          "提供详情查看",
          "提供处理反馈",
          "支持进入查看业务状态页面"
        ],
        "pageSuggestion": "VehicleGateAccessCheckView.vue",
        "apiSuggestion": "GET /api/scenarios/scenario-1782804838550-2",
        "scopeNote": "由当前业务场景动态生成，用于承接左侧选中场景。"
      }
    ],
    "scenario-1782804838550-0": [
      {
        "key": "scenario-1782804838550-0-scenario-module",
        "priority": "P0",
        "name": "调度员现场调度工作台",
        "sourceScenario": "调度员现场调度",
        "description": "围绕「调度员现场调度」生成的场景专属功能模块，支撑调度员完成当前任务流程。",
        "features": [
          "提供现场调度列表",
          "提供状态筛选",
          "提供详情查看",
          "提供处理反馈",
          "支持进入现场调度页面"
        ],
        "pageSuggestion": "VehicleOnsiteDispatchView.vue",
        "apiSuggestion": "GET /api/scenarios/scenario-1782804838550-0",
        "scopeNote": "由当前业务场景动态生成，用于承接左侧选中场景。"
      }
    ],
    "scenario-1782831312544-0": [
      {
        "key": "mapBoard",
        "priority": "P0",
        "name": "地图看板",
        "sourceScenario": "调度员现场调度",
        "description": "在地图上实时显示车辆位置、任务状态、空闲车辆、排队车辆和异常车辆，支持区域筛选和车辆详情查看。",
        "features": [
          "车辆实时位置展示",
          "车辆状态标识（空闲、任务、排队、异常）",
          "区域筛选与地图缩放",
          "车辆详情弹窗（车牌、司机、任务等）"
        ],
        "pageSuggestion": "VehicleDispatchView.vue",
        "apiSuggestion": "GET /api/vehicles/positions",
        "scopeNote": "根据调度员现场调度流程中的地图看板需求生成"
      },
      {
        "key": "intelligentDispatch",
        "priority": "P0",
        "name": "智能派车",
        "sourceScenario": "调度员现场调度",
        "description": "综合作业区域、车辆类型、任务优先级、距离远近等因素，智能推荐最佳车辆，支持调度员一键派车或手动调整。",
        "features": [
          "用车申请列表展示与审核",
          "智能匹配算法推荐车辆",
          "手动调整派车方案",
          "派车任务下发至司机"
        ],
        "pageSuggestion": "VehicleDispatchView.vue",
        "apiSuggestion": "POST /api/dispatch",
        "scopeNote": "根据调度员现场调度流程中的智能派车需求生成"
      },
      {
        "key": "taskTracking",
        "priority": "P0",
        "name": "任务跟踪",
        "sourceScenario": "调度员现场调度",
        "description": "实时跟踪派车任务的执行状态（接单、到达、装卸、关闭），展示任务进度和异常标记，支持调度员介入处理。",
        "features": [
          "任务状态实时更新",
          "任务列表与进度展示",
          "异常任务标记与预警",
          "调度员干预操作（重新派车、取消任务等）"
        ],
        "pageSuggestion": "VehicleDispatchView.vue",
        "apiSuggestion": "GET /api/tasks/status, PATCH /api/tasks/{id}",
        "scopeNote": "根据调度员现场调度流程中的任务跟踪需求生成"
      },
      {
        "key": "exceptionHandling",
        "priority": "P0",
        "name": "异常处理",
        "sourceScenario": "调度员现场调度",
        "description": "集中展示异常情况（排队超时、重复派车、车辆故障等），支持调度员临时调整任务、增派车辆、处理告警。",
        "features": [
          "异常情况列表与告警展示",
          "异常原因分析",
          "临时调整任务（换车、改路线等）",
          "增派车辆或取消任务"
        ],
        "pageSuggestion": "VehicleDispatchView.vue",
        "apiSuggestion": "GET /api/exceptions, POST /api/exceptions/resolve",
        "scopeNote": "根据调度员现场调度流程中的异常处理需求生成"
      }
    ],
    "scenario-1782831312544-4": [
      {
        "key": "reservation-registration",
        "priority": "P1",
        "name": "预约登记",
        "sourceScenario": "外协车辆预约入场",
        "description": "外协或临时车辆申请人提交预约登记信息，包括车辆信息、司机信息、入场时间等，系统自动审批并生成预约记录。",
        "features": [
          "填写车辆基本信息（车牌、类型、所属单位）",
          "填写司机信息（姓名、联系方式）",
          "选择预计入场时间与出场时间",
          "提交预约申请（自动审批）",
          "查看预约审批结果"
        ],
        "pageSuggestion": "VehicleReservationView.vue",
        "apiSuggestion": "POST /api/reservations, GET /api/reservations/{id}",
        "scopeNote": "对应工作流步骤1-2，角色外协/临时车辆申请人"
      },
      {
        "key": "authorization-credential",
        "priority": "P1",
        "name": "授权凭证",
        "sourceScenario": "外协车辆预约入场",
        "description": "预约通过后生成入场授权二维码，作为车辆入场凭证，支持下载或展示。",
        "features": [
          "自动生成入场授权二维码",
          "下载或打印授权凭证",
          "查看授权有效期与关联预约信息"
        ],
        "pageSuggestion": "VehicleReservationView.vue",
        "apiSuggestion": "GET /api/reservations/{id}/qrcode",
        "scopeNote": "对应工作流步骤3，获取入场授权码"
      },
      {
        "key": "entry-record",
        "priority": "P2",
        "name": "入场记录",
        "sourceScenario": "外协车辆预约入场",
        "description": "车辆到场后通过扫描入场码完成入场登记，记录入场时间、车辆、司机等信息，支持历史入场记录追溯。",
        "features": [
          "扫描入场授权码完成入场登记",
          "记录入场时间、车辆信息、司机信息",
          "查询个人历史入场记录"
        ],
        "pageSuggestion": "VehicleReservationView.vue",
        "apiSuggestion": "POST /api/entries, GET /api/entries",
        "scopeNote": "对应工作流步骤4，入场核验"
      },
      {
        "key": "exit-verification",
        "priority": "P2",
        "name": "出场核验",
        "sourceScenario": "外协车辆预约入场",
        "description": "车辆出场时核验出场信息，自动核销预约记录，记录出场时间。",
        "features": [
          "扫描车辆入场凭证或车牌",
          "核验出场信息并记录出场时间",
          "自动更新预约状态为已核销",
          "提供出场记录查询"
        ],
        "pageSuggestion": "VehicleReservationView.vue",
        "apiSuggestion": "POST /api/entries/{entryId}/exit, GET /api/entries/{entryId}",
        "scopeNote": "对应工作流步骤5，出场核销"
      }
    ],
    "scenario-1782831312544-1": [
      {
        "key": "efficiencyAnalysis",
        "priority": "P0",
        "name": "效率分析模块",
        "sourceScenario": "管理人员统计分析",
        "description": "提供车辆利用率、任务完成率、平均等待时长、空驶率、车辆排队情况等核心效率指标的统计与可视化展示。",
        "features": [
          "展示车辆利用率趋势图与分布",
          "展示任务完成率统计（按区域/时间/车辆类型）",
          "展示平均等待时长与空驶率图表",
          "展示车辆排队情况与异常通知"
        ],
        "pageSuggestion": "StatisticsDashboardView.vue",
        "apiSuggestion": "/api/v1/statistics/efficiency",
        "scopeNote": "对应工作流中的查看可视化图表与关键指标环节，支撑资源配置优化"
      },
      {
        "key": "costAnalysis",
        "priority": "P1",
        "name": "费用分析模块",
        "sourceScenario": "管理人员统计分析",
        "description": "统计外协车辆使用次数、入场记录及费用相关数据，辅助外协费用管理决策。",
        "features": [
          "展示外协车辆使用次数及费用汇总",
          "展示外协车辆入场/出场记录",
          "支持按时间范围与车辆维度下钻"
        ],
        "pageSuggestion": "StatisticsDashboardView.vue",
        "apiSuggestion": "/api/v1/statistics/cost",
        "scopeNote": "对应工作流中的下钻分析与费用管理目标"
      },
      {
        "key": "reportExport",
        "priority": "P1",
        "name": "报表导出模块",
        "sourceScenario": "管理人员统计分析",
        "description": "支持将当前查看的统计报表或下钻数据导出为Excel、PDF等格式，便于存档与进一步分析。",
        "features": [
          "导出当前可视化数据为Excel",
          "导出统计报表为PDF",
          "支持选择导出范围与格式"
        ],
        "pageSuggestion": "StatisticsDashboardView.vue",
        "apiSuggestion": "/api/v1/report/export",
        "scopeNote": "对应工作流中的导出报表或数据环节"
      },
      {
        "key": "dataDrillDown",
        "priority": "P2",
        "name": "数据下钻模块",
        "sourceScenario": "管理人员统计分析",
        "description": "允许从宏观统计图表演进到具体车辆、司机或区域的明细数据，支持多维分析。",
        "features": [
          "通过点击图表元素下钻至车辆/司机详情",
          "展示下钻后的明细列表与指标对比",
          "支持返回上钻至宏观视图"
        ],
        "pageSuggestion": "StatisticsDashboardView.vue",
        "apiSuggestion": "/api/v1/statistics/drilldown",
        "scopeNote": "对应工作流中的下钻分析具体车辆/司机/区域环节"
      }
    ],
    "scenario-1782831312544-2": [
      {
        "key": "TaskReceivingAndDisplay",
        "priority": "P1",
        "name": "任务接收与详情展示",
        "sourceScenario": "司机执行任务",
        "description": "司机通过手机端接收调度下发的任务通知，展示任务详情（作业点、物资、路线等），支持查看历史任务记录。",
        "features": [
          "接收调度任务推送通知",
          "展示任务列表与详情（作业点、物资、路线）",
          "支持任务筛选与搜索",
          "查看已完成任务历史"
        ],
        "pageSuggestion": "DriverTaskView.vue（子组件：TaskListSection.vue, TaskDetailPanel.vue）",
        "apiSuggestion": "/api/driver/tasks (GET, PATCH)",
        "scopeNote": "基于场景工作流前两步：接收调度下发的任务通知、查看任务详情；以及页面映射模块'任务接收与详情展示'。"
      },
      {
        "key": "NavigationAndGuidance",
        "priority": "P1",
        "name": "导航与路线指引",
        "sourceScenario": "司机执行任务",
        "description": "集成地图导航功能，根据任务作业点自动规划路线，提供语音播报和实时路况，支持一键导航到目标区域或门岗。",
        "features": [
          "自动规划从当前位置到作业点的最优路线",
          "地图显示路线与作业点标记",
          "语音导航播报",
          "支持切换导航方式（步行/驾车）"
        ],
        "pageSuggestion": "NavigationOverlay.vue（嵌入 DriverTaskView.vue）",
        "apiSuggestion": "/api/driver/navigation/route (POST)",
        "scopeNote": "基于场景工作流第三步'导航前往作业点'及页面映射模块'导航与路线指引'。"
      },
      {
        "key": "ArrivalConfirmation",
        "priority": "P1",
        "name": "现场到达确认与签到",
        "sourceScenario": "司机执行任务",
        "description": "司机到达作业点后，通过拍照或地理围栏签到确认到场，系统自动记录到达时间与位置，并可上传现场照片作为凭证。",
        "features": [
          "地理围栏自动检测到达并提醒签到",
          "拍照上传作业现场照片",
          "手动签到确认到达",
          "记录到达时间与GPS位置"
        ],
        "pageSuggestion": "ArrivalConfirmModal.vue",
        "apiSuggestion": "/api/driver/tasks/{taskId}/arrival (POST)",
        "scopeNote": "基于场景工作流第四步'到达确认（拍照/签到）'及页面映射模块'现场到达确认（拍照/签到）'。"
      },
      {
        "key": "TaskCompletionAndClosure",
        "priority": "P1",
        "name": "任务完成与关闭操作",
        "sourceScenario": "司机执行任务",
        "description": "完成装卸或作业后，司机一键关闭任务，填写作业备注（如装卸数量、异常情况），系统更新任务状态为已完成并记录完成时间。",
        "features": [
          "一键关闭当前任务",
          "填写作业完成备注（可选）",
          "报告作业异常（如物资损坏、超时）",
          "确认装卸数量或作业结果"
        ],
        "pageSuggestion": "TaskCompletionForm.vue",
        "apiSuggestion": "/api/driver/tasks/{taskId}/complete (POST)",
        "scopeNote": "基于场景工作流最后两步'完成装卸/作业'、'任务关闭确认'及页面映射模块'任务完成与关闭操作'。"
      },
      {
        "key": "TaskStatusRealTimeFeedback",
        "priority": "P1",
        "name": "任务状态实时反馈",
        "sourceScenario": "司机执行任务",
        "description": "任务执行过程中，自动将状态（已接单、已导航、已到达、已完成）实时同步至调度端，支持司机手动更新状态并推送位置信息。",
        "features": [
          "自动上报任务状态变化",
          "周期性上报车辆实时位置",
          "支持手动触发状态更新",
          "调度端可实时查看司机状态"
        ],
        "pageSuggestion": "StatusSyncService.js（后台服务，与 DriverTaskView.vue 联动）",
        "apiSuggestion": "/api/driver/tasks/{taskId}/status (PUT) + WebSocket 状态推送",
        "scopeNote": "基于场景工作流全过程状态实时更新需求及页面映射模块'任务状态实时反馈'，确保调度端与司机端状态一致。"
      }
    ],
    "scenario-1782831312544-3": [
      {
        "key": "entranceCheck",
        "priority": "P1",
        "name": "入场核验",
        "sourceScenario": "门岗入场核验",
        "description": "门岗人员通过扫描车牌或二维码，系统自动核验车辆预约、派车或授权状态，显示放行或拦截结果，并记录入场时间。",
        "features": [
          "扫描车牌/二维码",
          "自动核验预约/派车/授权",
          "显示放行/拦截结果",
          "记录入场时间"
        ],
        "pageSuggestion": "GateCheckView.vue（集成入口）或 EntraceCheckComponent.vue",
        "apiSuggestion": "POST /api/gate/entrance-check, GET /api/gate/entrance-check/{vehicleId}",
        "scopeNote": "基于当前场景工作流前4步，对应pageMapping中的入场核验模块"
      },
      {
        "key": "exitCheck",
        "priority": "P1",
        "name": "出场核验",
        "sourceScenario": "门岗入场核验",
        "description": "车辆出场时，门岗人员执行核验并记录出场时间，更新车辆在场状态，确保出场车辆已无有效任务或预约。",
        "features": [
          "扫描车牌/二维码",
          "核验车辆出场资格（任务/预约状态）",
          "记录出场时间",
          "更新车辆在场状态"
        ],
        "pageSuggestion": "GateCheckView.vue（集成入口）或 ExitCheckComponent.vue",
        "apiSuggestion": "POST /api/gate/exit-check, GET /api/gate/vehicle-status/{vehicleId}",
        "scopeNote": "基于当前场景工作流最后2步，对应pageMapping中的出场核验模块"
      },
      {
        "key": "exceptionHandling",
        "priority": "P1",
        "name": "异常处理",
        "sourceScenario": "门岗入场核验",
        "description": "核验失败或异常情况时（如无预约、证照过期、未授权、车牌无法识别），门岗人员可进行人工干预处理，记录异常原因及处理结果并通知相关方。",
        "features": [
          "异常拦截提示与原因展示",
          "人工审核与放行/拒绝操作",
          "记录异常处理结果（原因、处理人、时间）",
          "通知相关方（调度、安保）"
        ],
        "pageSuggestion": "GateCheckView.vue（集成异常弹窗）或 ExceptionHandlingComponent.vue",
        "apiSuggestion": "POST /api/gate/exception-handling, GET /api/gate/exception-rules",
        "scopeNote": "基于当前场景中核验失败需要拦截的情况，对应pageMapping中的异常处理模块"
      },
      {
        "key": "checkLogQuery",
        "priority": "P2",
        "name": "核验日志查询",
        "sourceScenario": "门岗入场核验",
        "description": "门岗人员查询车辆入场、出场核验历史记录，可按车牌、时间范围、结果状态等条件进行筛选和详情查看。",
        "features": [
          "按车牌/时间/结果筛选",
          "查看核验详情（车辆、司机、核验结果、时间）",
          "支持导出日志"
        ],
        "pageSuggestion": "GateCheckView.vue（内嵌列表）或独立页面 GateLogView.vue",
        "apiSuggestion": "GET /api/gate/logs?plate={plate}&start={start}&end={end}&status={status}",
        "scopeNote": "基于pageMapping中的核验日志查询模块，支持事后追溯和审计"
      }
    ],
    "scenario-1782887819107-0": [
      {
        "key": "mapMonitor",
        "priority": "P0",
        "name": "地图监控模块",
        "sourceScenario": "调度员现场调度",
        "description": "基于地图看板实时展示所有车辆的位置、状态（空闲、排队、任务中、异常）、作业区域，支持缩放、点击查看车辆详情",
        "features": [
          "实时车辆位置标注与状态颜色区分",
          "点击车辆弹出详情窗口：车牌、司机、任务、状态",
          "地图图层切换：作业区域、禁入区域、排队区域",
          "车辆轨迹回放（可选）"
        ],
        "pageTitleSuggestion": "调度地图监控",
        "pageSuggestion": "DispatchMapView.vue",
        "apiSuggestion": "GET /api/vehicles/real-time-locations, GET /api/vehicles/{id}/detail",
        "scopeNote": "基于调度员通过地图看板查看车辆位置和状态的需求，以及车辆类型、状态筛选的支撑"
      },
      {
        "key": "vehicleFilter",
        "priority": "P0",
        "name": "车辆状态筛选模块",
        "sourceScenario": "调度员现场调度",
        "description": "支持按车辆类型、状态（空闲/排队/任务中）、作业区域、距离远近等条件筛选车辆，便于调度员快速定位合适车辆",
        "features": [
          "多条件组合筛选：车辆类型（生产车/物流车/外协车/临时车）、状态、区域",
          "筛选结果在地图上高亮显示",
          "列表视图展示筛选结果，支持排序",
          "一键重置筛选条件"
        ],
        "pageTitleSuggestion": "车辆状态筛选",
        "pageSuggestion": "VehicleFilterPanel.vue",
        "apiSuggestion": "GET /api/vehicles/filter?type=&status=&area=",
        "scopeNote": "根据业务场景中调度员需要筛选空闲/排队车辆，以及根据作业区域、车辆类型进行派车的需求"
      },
      {
        "key": "taskDispatch",
        "priority": "P0",
        "name": "任务派发模块",
        "sourceScenario": "调度员现场调度",
        "description": "调度员为选中的车辆分配任务，支持选择用车申请、输入作业点、选择优先级，并一键下发至司机移动端",
        "features": [
          "显示待派发的用车申请列表",
          "选择目标车辆后，匹配任务并确认派发",
          "支持紧急派车（跳过申请手动创建任务）",
          "派发成功后推送通知至司机端",
          "记录派发日志（操作人、时间、车辆、任务）"
        ],
        "pageTitleSuggestion": "任务派发",
        "pageSuggestion": "TaskDispatchDialog.vue",
        "apiSuggestion": "POST /api/tasks/dispatch, PUT /api/tasks/{id}/assign",
        "scopeNote": "基于调度员根据作业需求进行智能派车、任务下发的工作流程，及与司机移动端交互的需求"
      },
      {
        "key": "exceptionHandler",
        "priority": "P0",
        "name": "异常处理模块",
        "sourceScenario": "调度员现场调度",
        "description": "实时接收车辆异常告警（超速、禁入区域、异常停留、未授权入场等），支持调度员查看详情、处理告警、标记解决",
        "features": [
          "异常告警列表实时刷新，显示告警类型、车辆、时间、位置",
          "点击告警可在地图上定位车辆并查看详情",
          "支持处理告警：确认、忽略、通知相关人员",
          "告警历史记录查询与导出"
        ],
        "pageTitleSuggestion": "异常告警处理",
        "pageSuggestion": "ExceptionAlertPanel.vue",
        "apiSuggestion": "GET /api/alerts, PUT /api/alerts/{id}/handle",
        "scopeNote": "基于调度员需要处理异常情况的需求，以及系统安全管理能力（超速提醒、禁入区域告警等）"
      }
    ],
    "scenario-1782887819107-1": [
      {
        "key": "taskList",
        "priority": "P0",
        "name": "任务列表模块",
        "sourceScenario": "司机任务执行",
        "description": "司机查看个人任务列表，接收新任务通知，筛选和查看不同状态的任务",
        "features": [
          "接收任务通知并显示未读标记",
          "按状态（待接单、进行中、已完成）筛选任务",
          "显示任务摘要信息（任务编号、作业点、要求时间）",
          "支持下拉刷新和分页加载"
        ],
        "pageTitleSuggestion": "任务列表",
        "pageSuggestion": "TaskListView.vue",
        "apiSuggestion": "GET /api/tasks?driverId={id}&status={status}",
        "scopeNote": "对应场景工作流第一步'接收任务通知'和第二步'查看任务详情与作业点'的列表展示需求"
      },
      {
        "key": "taskDetail",
        "priority": "P0",
        "name": "任务详情模块",
        "sourceScenario": "司机任务执行",
        "description": "展示任务的详细信息，包括作业点位置、任务要求、物资信息等",
        "features": [
          "展示作业点名称、地址、联系人信息",
          "展示任务要求（车辆类型、物资种类、作业说明）",
          "展示任务时间节点（计划到达时间、完成时间）",
          "提供导航入口和联系调度员功能"
        ],
        "pageTitleSuggestion": "任务详情",
        "pageSuggestion": "TaskDetailView.vue",
        "apiSuggestion": "GET /api/tasks/{taskId}",
        "scopeNote": "对应场景工作流第二步'查看任务详情与作业点'的详细展示需求"
      },
      {
        "key": "navigation",
        "priority": "P0",
        "name": "导航模块",
        "sourceScenario": "司机任务执行",
        "description": "从司机当前位置导航至指定作业点，实时显示路径和预计到达时间",
        "features": [
          "获取司机当前位置并计算到作业点的最优路径",
          "显示导航路线、距离和预计到达时间",
          "支持语音导航和路线偏离提醒",
          "到达作业点附近时自动触发到达确认提示"
        ],
        "pageTitleSuggestion": "导航与路径",
        "pageSuggestion": "NavigationView.vue",
        "apiSuggestion": "POST /api/navigation/route?origin={lat,lng}&destination={lat,lng}",
        "scopeNote": "对应场景工作流第三步'导航至作业点'的导航功能需求"
      },
      {
        "key": "siteFeedback",
        "priority": "P0",
        "name": "现场反馈模块",
        "sourceScenario": "司机任务执行",
        "description": "司机在到达作业点后确认到达，并上传现场照片或备注信息",
        "features": [
          "点击'到达确认'并记录到达时间",
          "现场拍照上传（支持多张照片）",
          "添加文字备注或异常说明",
          "反馈信息与任务关联并同步至调度端"
        ],
        "pageTitleSuggestion": "现场反馈",
        "pageSuggestion": "SiteFeedbackView.vue",
        "apiSuggestion": "POST /api/tasks/{taskId}/arrival (包含照片数据)",
        "scopeNote": "对应场景工作流第四步'到达确认并上传现场照片'的反馈需求"
      },
      {
        "key": "taskCompletion",
        "priority": "P0",
        "name": "任务完成确认模块",
        "sourceScenario": "司机任务执行",
        "description": "司机在完成装卸或转运后，提交任务完成并上传相关签收或作业完成凭证",
        "features": [
          "确认任务完成并录入实际完成时间",
          "上传签收单、作业完成照片等凭证",
          "提交后任务状态更新为已完成，通知调度员",
          "支持任务异常关闭（如未完成原因说明）"
        ],
        "pageTitleSuggestion": "任务完成确认",
        "pageSuggestion": "TaskCompletionView.vue",
        "apiSuggestion": "POST /api/tasks/{taskId}/completion",
        "scopeNote": "对应场景工作流第五步'完成装卸或转运'和第六步'提交任务完成'的完成确认需求"
      }
    ],
    "scenario-1782887819107-2": [
      {
        "key": "entryCheck",
        "priority": "P1",
        "name": "入场核验模块",
        "sourceScenario": "门岗入场核验",
        "description": "支持通过扫描车牌或预约二维码，自动核验车辆预约有效性及派车任务关联，快速得出入场许可结果",
        "features": [
          "扫描车牌或预约二维码",
          "自动核验预约有效性及任务关联",
          "显示核验结果（放行/拒绝）",
          "处理核验异常并引导手动操作"
        ],
        "pageTitleSuggestion": "入场核验 - 支持扫描车牌或二维码，自动核验预约与任务关联",
        "pageSuggestion": "EntryCheckPanel.vue",
        "apiSuggestion": "GET /api/vehicle/check，POST /api/vehicle/check/verify",
        "scopeNote": "对应门岗人员扫描核验流程，是场景核心操作入口"
      },
      {
        "key": "releaseManagement",
        "priority": "P1",
        "name": "放行管理模块",
        "sourceScenario": "门岗入场核验",
        "description": "根据核验结果执行放行或拒绝操作，记录放行时间、车辆信息，并更新相关任务状态",
        "features": [
          "手动确认放行或拒绝",
          "记录入场时间与车辆信息",
          "关联更新派车任务状态",
          "支持批量放行操作"
        ],
        "pageTitleSuggestion": "放行管理 - 管理车辆入场放行操作与记录",
        "pageSuggestion": "ReleaseManagementPanel.vue",
        "apiSuggestion": "POST /api/vehicle/release，GET /api/vehicle/release/record",
        "scopeNote": "对应放行/拒绝入场及信息记录流程"
      },
      {
        "key": "alertManagement",
        "priority": "P1",
        "name": "异常告警模块",
        "sourceScenario": "门岗入场核验",
        "description": "实时处理未授权入场、证照过期、异常停留等告警，支持告警确认、解除与上报",
        "features": [
          "告警实时展示与分类",
          "告警处理（确认/解除/上报）",
          "告警历史查询"
        ],
        "pageTitleSuggestion": "异常告警 - 处理入场违规与安全告警事件",
        "pageSuggestion": "AlertPanel.vue",
        "apiSuggestion": "GET /api/alert，POST /api/alert/handle",
        "scopeNote": "对应处理异常入场告警流程，保证安全管理"
      },
      {
        "key": "releaseRecordQuery",
        "priority": "P2",
        "name": "放行记录查询模块",
        "sourceScenario": "门岗入场核验",
        "description": "按时间、车牌、车辆类型等条件检索放行记录，查看核验详情，支持导出用于审计追溯",
        "features": [
          "多条件组合查询放行记录",
          "查看核验详情与放行凭证",
          "导出记录报表"
        ],
        "pageTitleSuggestion": "放行记录查询 - 追溯车辆入场放行历史数据",
        "pageSuggestion": "ReleaseRecordQueryView.vue",
        "apiSuggestion": "GET /api/vehicle/release/history",
        "scopeNote": "对应放行记录查询与历史追溯需求"
      }
    ],
    "scenario-1782887819107-3": [
      {
        "key": "statistics-analysis",
        "priority": "P1",
        "name": "统计分析模块",
        "sourceScenario": "管理人员报表分析",
        "description": "提供车辆利用率、任务完成率、平均等待时长、空驶率、排队情况、外协车辆使用次数、异常入场记录等核心统计指标的图表展示与分析功能",
        "features": [
          "按时间范围筛选报表数据",
          "展示车辆利用率趋势图",
          "展示任务完成率与平均等待时长图表",
          "展示空驶率与排队统计图表",
          "展示外协车辆使用次数与异常记录列表",
          "支持图表导出为图片或PDF"
        ],
        "pageTitleSuggestion": "车辆运营报表分析",
        "pageSuggestion": "StatisticsAnalysisView.vue",
        "apiSuggestion": "/api/reports/statistics",
        "scopeNote": "根据需求中管理人员希望查看车辆利用率、任务完成率、空驶率等统计分析报表，用于优化车辆资源配置和外协车辆费用管理"
      },
      {
        "key": "report-export",
        "priority": "P1",
        "name": "报表导出模块",
        "sourceScenario": "管理人员报表分析",
        "description": "支持将统计分析结果导出为Excel、PDF等格式，便于管理人员存档、分发和进一步分析",
        "features": [
          "选择导出格式（Excel/PDF）",
          "选择导出内容范围（全部报表/指定指标）",
          "一键导出并下载文件",
          "导出记录日志与审计追踪"
        ],
        "pageTitleSuggestion": "报表数据导出",
        "pageSuggestion": "ReportExportView.vue",
        "apiSuggestion": "/api/reports/export",
        "scopeNote": "根据场景工作流中“导出报表或截图用于分析”的要求，以及关键操作需留痕的审计需求"
      },
      {
        "key": "resource-allocation-suggestion",
        "priority": "P2",
        "name": "资源配置建议模块",
        "sourceScenario": "管理人员报表分析",
        "description": "基于历史数据与当前车辆使用情况，提供车辆资源配置优化建议和外协车辆费用管理参考",
        "features": [
          "分析车辆使用热点与瓶颈区域",
          "推荐车辆增减数量与类型调整",
          "展示外协车辆费用汇总与趋势",
          "提供资源配置优化报告预览"
        ],
        "pageTitleSuggestion": "资源配置优化建议",
        "pageSuggestion": "ResourceAllocationView.vue",
        "apiSuggestion": "/api/reports/resource-allocation",
        "scopeNote": "根据需求中“用于优化车辆资源配置和外协车辆费用管理”的业务目标，以及场景中辅助决策的定位"
      }
    ]
  },
  "confirmedAt": "2026-07-01T15:42:11.764Z"
}
```
<!-- FDE_STEP_RESULT_JSON_END -->
