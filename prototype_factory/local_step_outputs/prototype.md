# 04 前端原型方案

- 步骤标识：`prototype`
- 保存时间：2026-07-03T10:28:36.109978+00:00
- 用途：作为下一步工作台的输入来源。

## 内容摘要

- **项目**：车辆管理
- **客户**：HG
- **摘要**：前端原型方案：16 个页面、16 个页面规格、16 个页面 API 映射。

## 结构化数据

<!-- FDE_STEP_RESULT_JSON_START -->
```json
{
  "projectName": "车辆管理",
  "customerName": "HG",
  "summary": "前端原型方案：16 个页面、16 个页面规格、16 个页面 API 映射。",
  "sourceRefs": {
    "requirement": "prototype_factory/local_step_outputs/requirement.md",
    "scenarioPageDesign": "prototype_factory/local_step_outputs/scenariopagedesign.md",
    "interactionApi": "prototype_factory/local_step_outputs/interactionapi.md"
  },
  "sourceSummary": {
    "projectName": "车辆管理",
    "customerName": "HG",
    "businessBackground": "HG海工基地车辆管理依赖电话、微信和人工登记，无法实时掌握车辆位置、任务状态和使用效率，导致调度混乱和效率低下。",
    "painPoints": [
      "现场经常出现车辆排队等待、重复派车、空驶率高",
      "司机找不到作业点，门岗放行信息不一致",
      "车辆位置、任务状态、使用效率无法实时掌握",
      "外协和临时车辆入场依赖人工登记，审批和核验效率低",
      "车辆利用率、等待时长、空驶率等缺乏统计分析"
    ],
    "businessGoals": [
      "实现车辆、司机、任务、物资、门禁的一体化管理",
      "提升车辆调度效率，减少人工沟通成本",
      "降低车辆等待和空驶时间，优化资源配置",
      "外协车辆费用管理和安全管控能力"
    ],
    "roles": [
      {
        "name": "调度员",
        "focus": "在调度中心通过地图看板实时监控车辆状态、派车、任务调整及异常处理"
      },
      {
        "name": "司机",
        "focus": "通过移动端接收任务、导航到作业点、确认作业完成并上传照片"
      },
      {
        "name": "现场调度员",
        "focus": "通过移动端在现场临时调整任务、查看车辆状态、处理异常情况"
      },
      {
        "name": "门岗人员",
        "focus": "在道闸处核验车辆入场授权、手动放行或拒绝、处理异常"
      },
      {
        "name": "管理人员",
        "focus": "查看车辆运营统计报表、优化资源配置与外协费用管理"
      },
      {
        "name": "外协/临时车辆申请者",
        "focus": "在线提交车辆预约登记、查看审批进度及入场授权"
      },
      {
        "name": "管理员",
        "focus": "维护车辆基础档案、证照、年检保险状态及准入有效期"
      }
    ],
    "scenarioCount": 7,
    "scenarios": [
      {
        "key": "sc-1",
        "name": "调度员实时调度派车与异常监控",
        "priority": "P0",
        "page": "DispatchCenterView.vue"
      },
      {
        "key": "sc-2",
        "name": "司机移动端任务接收与执行",
        "priority": "P0",
        "page": "DriverTaskView.vue"
      },
      {
        "key": "sc-3",
        "name": "现场调度员移动端临时调整与异常处理",
        "priority": "P1",
        "page": "MobileDispatchView.vue"
      },
      {
        "key": "sc-4",
        "name": "门岗车辆入场核验与放行",
        "priority": "P1",
        "page": "GateAccessCheckView.vue"
      },
      {
        "key": "sc-5",
        "name": "管理人员查看运营报表与决策分析",
        "priority": "P1",
        "page": "ManagementReportsView.vue"
      },
      {
        "key": "sc-6",
        "name": "外协/临时车辆预约与入场审批",
        "priority": "P1",
        "page": "WorkspaceView.vue"
      },
      {
        "key": "sc-7",
        "name": "管理员车辆台账维护与证照管理",
        "priority": "P1",
        "page": "VehicleArchiveManager.vue"
      }
    ],
    "apiContractCount": 16
  },
  "pages": [
    {
      "file": "DispatchWorkbenchView.vue",
      "responsibility": "调度员集中管理实时车辆状态、接收用车需求、执行派车操作，以地图和状态看板为核心支撑高效调度。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "AlertAndTaskMonitorView.vue",
      "responsibility": "实时监控车辆异常告警（超速、禁入、异常停留）并处理，同时跟踪已派发任务的执行进度，支持干预操作。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "DriverTaskListView.vue",
      "responsibility": "司机查看并确认接单，管理待接单、进行中、已完成的任务",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "DriverTaskExecuteView.vue",
      "responsibility": "司机查看任务完整详情、导航到作业点、确认到达与完成、发起异常反馈",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "MobileDispatchView.vue",
      "responsibility": "实时接收异常告警与司机反馈，查看周边车辆状态，并与司机即时通讯，快速发起任务调整。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "TaskAdjustView.vue",
      "responsibility": "对选中车辆/任务执行改派、取消或新增临时任务，并填写异常处理记录提交上报。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "GateAccessCheckView.vue",
      "responsibility": "门岗人员在固定终端上实时查看待核验车辆、查看核验详情、执行放行或拒绝操作，并在接口异常时进行降级处理。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "GateEntryRecordsView.vue",
      "responsibility": "门岗或管理员查看历史入场处理记录（放行/拒绝），追踪记录同步状态，对同步失败的记录进行手动重新同步。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "ManagementReportsView.vue",
      "responsibility": "管理人员通过该页面查看实时关键运营指标，按时间、车辆类型、作业区域等维度筛选数据，通过指标卡片和趋势图快速掌握整体状况，并可导出报表或下钻到明细详情。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "ReportDetailView.vue",
      "responsibility": "展示从概览工作台下钻的明细数据，包括外协车辆费用明细、异常入场记录、排班排队分析等，支持进一步搜索、排序、分页以及当前明细的导出。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "WorkspaceView.vue",
      "responsibility": "集中处理外协/临时车辆预约申请，支持待办列表浏览、快速筛选、查看详情和审批操作（通过/驳回），以及审批通过后授权码同步状态监控。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "AccessCodeView.vue",
      "responsibility": "查看所有已生成授权码的列表及状态，监控门禁同步情况，处理同步失败记录，并查看授权码使用详情。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "HistoryView.vue",
      "responsibility": "提供外协/临时车辆预约历史记录的多维度查询、详情追溯和导出，支持费用统计对账。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P2"
    },
    {
      "file": "VehicleArchiveList.vue",
      "responsibility": "管理员查看全厂车辆档案列表，执行筛选、搜索、停用/启用操作，并接收到期提醒。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "VehicleArchiveEdit.vue",
      "responsibility": "管理员新增或编辑车辆的全部基础档案信息，包括证照图片上传及有效期设置。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "VehicleArchiveLogs.vue",
      "responsibility": "管理员查询和导出所有车辆档案的关键操作日志，用于审计追溯。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P2"
    }
  ],
  "viewFiles": [
    {
      "file": "DispatchWorkbenchView.vue",
      "responsibility": "调度员集中管理实时车辆状态、接收用车需求、执行派车操作，以地图和状态看板为核心支撑高效调度。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "AlertAndTaskMonitorView.vue",
      "responsibility": "实时监控车辆异常告警（超速、禁入、异常停留）并处理，同时跟踪已派发任务的执行进度，支持干预操作。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "DriverTaskListView.vue",
      "responsibility": "司机查看并确认接单，管理待接单、进行中、已完成的任务",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "DriverTaskExecuteView.vue",
      "responsibility": "司机查看任务完整详情、导航到作业点、确认到达与完成、发起异常反馈",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "MobileDispatchView.vue",
      "responsibility": "实时接收异常告警与司机反馈，查看周边车辆状态，并与司机即时通讯，快速发起任务调整。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "TaskAdjustView.vue",
      "responsibility": "对选中车辆/任务执行改派、取消或新增临时任务，并填写异常处理记录提交上报。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "GateAccessCheckView.vue",
      "responsibility": "门岗人员在固定终端上实时查看待核验车辆、查看核验详情、执行放行或拒绝操作，并在接口异常时进行降级处理。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "GateEntryRecordsView.vue",
      "responsibility": "门岗或管理员查看历史入场处理记录（放行/拒绝），追踪记录同步状态，对同步失败的记录进行手动重新同步。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "ManagementReportsView.vue",
      "responsibility": "管理人员通过该页面查看实时关键运营指标，按时间、车辆类型、作业区域等维度筛选数据，通过指标卡片和趋势图快速掌握整体状况，并可导出报表或下钻到明细详情。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "ReportDetailView.vue",
      "responsibility": "展示从概览工作台下钻的明细数据，包括外协车辆费用明细、异常入场记录、排班排队分析等，支持进一步搜索、排序、分页以及当前明细的导出。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "WorkspaceView.vue",
      "responsibility": "集中处理外协/临时车辆预约申请，支持待办列表浏览、快速筛选、查看详情和审批操作（通过/驳回），以及审批通过后授权码同步状态监控。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "AccessCodeView.vue",
      "responsibility": "查看所有已生成授权码的列表及状态，监控门禁同步情况，处理同步失败记录，并查看授权码使用详情。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "HistoryView.vue",
      "responsibility": "提供外协/临时车辆预约历史记录的多维度查询、详情追溯和导出，支持费用统计对账。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P2"
    },
    {
      "file": "VehicleArchiveList.vue",
      "responsibility": "管理员查看全厂车辆档案列表，执行筛选、搜索、停用/启用操作，并接收到期提醒。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "VehicleArchiveEdit.vue",
      "responsibility": "管理员新增或编辑车辆的全部基础档案信息，包括证照图片上传及有效期设置。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "VehicleArchiveLogs.vue",
      "responsibility": "管理员查询和导出所有车辆档案的关键操作日志，用于审计追溯。",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P2"
    }
  ],
  "pageDetailSpecs": [
    {
      "file": "DispatchWorkbenchView.vue",
      "layoutZones": [
        {
          "zone": "地图区域",
          "content": "左侧主区域，显示车辆位置、状态、轨迹，支持缩放和点击弹窗"
        },
        {
          "zone": "状态看板区域",
          "content": "右侧顶部，卡片式统计空闲/任务中/排队/异常车辆数量，可点击筛选"
        },
        {
          "zone": "需求列表区域",
          "content": "右侧中部，展示待处理用车需求（含生产计划推送），支持排序和派车按钮"
        },
        {
          "zone": "派车操作面板",
          "content": "右侧底部或浮动弹窗，选择车辆、确认派车、查看推荐车辆详情"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "无车辆在线或无可调度车辆时，地图显示空区域提示，看板显示0，需求列表显示'暂无待处理需求'"
        },
        {
          "state": "loading",
          "content": "初次加载或数据刷新时，地图和列表显示骨架屏或加载动画"
        },
        {
          "state": "success",
          "content": "正常态：地图加载车辆位置、看板显示统计数据、需求列表有数据、派车面板就绪"
        },
        {
          "state": "error",
          "content": "接口超时或数据异常时，显示错误提示和重试按钮；GPS数据中断时地图显示车辆离线标记"
        }
      ],
      "keyInteractions": [
        "地图点击车辆：点击车辆标记，显示车辆信息弹窗包含车牌、司机、速度、任务",
        "状态看板点击分类：点击状态卡片，跳转至对应车辆列表并在地图高亮该分类车辆",
        "需求列表点击派车：点击需求行中的派车按钮，打开派车操作面板，自动推荐可用车辆",
        "派车面板确认派车：点击确认按钮，刷新地图和看板状态，推送消息给司机",
        "地图框选车辆：在地图上框选，筛选框内车辆并同步至看板和需求列表",
        "异常状态突出显示：超速>30km/h或禁入区域触发，车辆图标闪烁并显示告警标记，地图高亮区域"
      ]
    },
    {
      "file": "AlertAndTaskMonitorView.vue",
      "layoutZones": [
        {
          "zone": "告警列表区域",
          "content": "左侧，按时间倒序展示告警事件，支持状态筛选和严重程度颜色标识"
        },
        {
          "zone": "告警处理弹窗",
          "content": "点击告警后弹出，展示告警详情、车辆信息、位置，提供确认/忽略/转人工按钮及备注输入"
        },
        {
          "zone": "任务列表区域",
          "content": "右侧，展示所有已派发任务的状态和进度，支持筛选和查看详情"
        },
        {
          "zone": "任务详情抽屉",
          "content": "点击任务后展开，显示任务步骤时间戳、司机操作记录、现场照片、关联告警记录"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "告警列表显示'暂无告警'，任务列表显示'暂无任务'，无数据时展示空态占位"
        },
        {
          "state": "loading",
          "content": "数据加载时列表显示骨架屏，避免页面跳动"
        },
        {
          "state": "success",
          "content": "数据加载成功，正常展示列表"
        },
        {
          "state": "error",
          "content": "数据获取失败时，列表区域显示错误提示，并提供重试按钮"
        }
      ],
      "keyInteractions": [
        "确认告警：点击告警详情弹窗中的确认按钮，调用POST /api/v1/alerts/handle，成功后更新告警状态为已处理，列表刷新",
        "忽略告警：点击告警详情弹窗中的忽略按钮，调用POST /api/v1/alerts/handle，成功后告警标记为已忽略，列表刷新",
        "转人工：点击告警详情弹窗中的转人工按钮，调用POST /api/v1/alerts/handle，状态转为转人工，提示操作成功",
        "催办任务：点击任务详情中的催办按钮，调用POST /api/v1/tasks/remind，弹出提示已发送催办通知",
        "取消任务：点击任务详情中的取消按钮，弹出确认对话框，要求填写取消原因，调用POST /api/v1/tasks/cancel，成功后任务状态更新",
        "导出Excel：点击告警列表或任务列表的导出按钮（预留），触发文件下载，导出当前筛选条件下的数据",
        "地图定位：点击告警列表项，弹窗展示告警详情，同时在地图上定位车辆位置",
        "筛选告警状态：选择告警状态筛选下拉框，重新加载告警列表，根据选中状态过滤",
        "筛选任务状态：选择任务状态筛选下拉框，重新加载任务列表，根据选中状态过滤"
      ]
    },
    {
      "file": "DriverTaskListView.vue",
      "layoutZones": [
        {
          "zone": "顶部状态筛选栏",
          "content": "包含全部/待接单/进行中/已完成四个筛选标签"
        },
        {
          "zone": "任务卡片列表区",
          "content": "每项显示任务ID、作业点名称、预计时间、车牌、状态标签"
        },
        {
          "zone": "底部导航栏",
          "content": "提供回到工作台等导航按钮"
        },
        {
          "zone": "未读推送通知角标",
          "content": "显示未读推送消息数量"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "当任务列表为空时，显示空状态提示文字（如'暂无任务'）及插图，底部导航栏保留"
        },
        {
          "state": "loading",
          "content": "首次加载或下拉刷新时显示加载动画（骨架屏或转圈）"
        },
        {
          "state": "success",
          "content": "正常展示任务卡片列表，支持滚动"
        },
        {
          "state": "error",
          "content": "网络请求失败时显示错误提示（如'网络异常，请重试'）及重试按钮，点击重试重新加载"
        }
      ],
      "keyInteractions": [
        "下拉刷新：用户下拉列表，显示加载动画，调用GET /api/driver/tasks?status=当前筛选条件，刷新列表",
        "点击任务卡片：用户点击卡片，跳转至DriverTaskExecuteView.vue，携带taskId",
        "确认接单：用户点击待接单任务上的确认接单按钮，弹出确认对话框，调用POST /api/driver/tasks/{taskId}/accept，成功后卡片状态变为进行中并刷新列表；若失败则显示错误提示",
        "切换筛选：用户点击顶部状态筛选标签（全部/待接单/进行中/已完成），更新筛选条件，重新加载对应状态的任务列表",
        "点击推送通知：用户点击通知角标或推送消息，跳转至对应任务详情页（若未读，标记已读）"
      ]
    },
    {
      "file": "DriverTaskExecuteView.vue",
      "layoutZones": [
        {
          "zone": "顶部导航栏",
          "content": "返回按钮、任务ID、状态标签"
        },
        {
          "zone": "任务信息卡片区",
          "content": "作业点名称/地址/经纬度、预计时间、关联物资提货单号、车牌、司机手机号、调度员联系电话"
        },
        {
          "zone": "操作按钮区",
          "content": "导航按钮、到达确认按钮、完成确认按钮"
        },
        {
          "zone": "照片上传区域",
          "content": "拍照/相册选择、预览、删除"
        },
        {
          "zone": "异常反馈入口",
          "content": "按钮，点击后弹出反馈表单"
        },
        {
          "zone": "历史反馈记录列表",
          "content": "可展开查看"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "无任务或无数据时显示空状态示意，当前页面从列表跳转进来，一般不会空，但历史反馈无记录时显示'暂无反馈'"
        },
        {
          "state": "loading",
          "content": "页面加载时显示骨架屏，加载任务详情数据"
        },
        {
          "state": "success",
          "content": "正常展示任务详情和对应状态下的操作按钮"
        },
        {
          "state": "error",
          "content": "接口失败时显示错误提示和重试按钮；物资系统接口调用失败时显示提示但不阻塞导航"
        }
      ],
      "keyInteractions": [
        "导航：点击导航按钮，调用系统地图APP（通过URL Scheme传入经纬度或地址）打开导航界面",
        "拨号（司机/调度员）：点击司机手机号或调度员联系电话，拔出系统拨号界面，显示对应电话号码",
        "查看物资详情：点击关联物资提货单号，调用物资系统接口获取物资详情并跳转到物资详情页面",
        "到达确认：点击到达确认按钮，调用POST /api/driver/tasks/{taskId}/arrive，按钮锁定，状态更新为已到达，记录到达时间",
        "完成确认：点击完成确认按钮，弹出拍照/相册选择组件，用户选择至少1张照片后上传，然后调用POST /api/driver/tasks/{taskId}/complete，任务状态更新为已完成，按钮置灰禁用",
        "提交异常反馈：在异常反馈表单中填写完成并点击提交，调用POST /api/driver/feedback提交异常事件，提交成功后关闭表单并刷新历史反馈列表，推送至调度员端",
        "查看历史反馈：点击历史反馈记录列表项（可展开），展开显示对应反馈的详细信息（类型、描述、照片、处理状态、时间）",
        "重试加载：数据加载失败时点击错误提示中的重试按钮，重新调用GET /api/driver/tasks/{taskId}获取详情数据"
      ],
      "revisionNote": "根据原页面规格DriverTaskExecuteView.vue转换而来"
    },
    {
      "file": "MobileDispatchView.vue",
      "layoutZones": [
        {
          "zone": "顶部告警与反馈滚动通知栏",
          "content": "折叠/展开"
        },
        {
          "zone": "中央车辆地图/列表视图",
          "content": "可切换"
        },
        {
          "zone": "底部浮动操作栏",
          "content": "包含通讯入口、快速调整按钮"
        },
        {
          "zone": "即时通讯面板",
          "content": "从底部弹出，含消息列表和输入框"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "无告警且无周边车辆，显示提示信息"
        },
        {
          "state": "loading",
          "content": "正在获取告警和车辆数据，显示加载动画"
        },
        {
          "state": "success",
          "content": "数据加载完成，正常显示"
        },
        {
          "state": "error",
          "content": "网络错误或数据加载失败，显示重试按钮"
        }
      ],
      "keyInteractions": [
        "告警项点击：点击告警卡片，弹出快捷操作菜单（查看车辆详情、发起通讯、转派任务）",
        "车辆标记点击：点击地图车辆标注或列表行，弹出信息卡片（司机联系方式、当前任务、调整按钮）",
        "通讯按钮点击：点击底部浮动操作栏通讯入口，展开即时通讯面板（从底部弹出）",
        "切换视图：点击右上角切换图标，在地图和列表视图之间切换",
        "下拉刷新：下拉手势，重新加载告警和车辆数据，显示加载动画",
        "改派任务：在车辆信息卡片中选择改派，弹出改派表单（选择新司机、填写原因），提交后更新任务状态",
        "取消任务：在车辆信息卡片中选择取消，弹出确认对话框，确认后取消任务并通知司机",
        "新增临时任务：点击底部浮动操作栏快速调整按钮中的新增临时任务，弹出新增任务表单（作业点、预计时间、要求），提交后生成任务",
        "发送消息：点击发送按钮或在输入框按回车，消息发送并显示在对话列表中，带送达状态",
        "标记已读：滑动或点击已读按钮，告警标记为已读，通知列表刷新"
      ],
      "revisionNote": "根据原页面规格MobileDispatchView.vue转换而来"
    },
    {
      "file": "TaskAdjustView.vue",
      "layoutZones": [
        {
          "zone": "顶部任务/车辆信息摘要区",
          "content": "车牌、司机、任务描述"
        },
        {
          "zone": "操作类型选择按钮组",
          "content": "改派、取消、加派"
        },
        {
          "zone": "操作表单区",
          "content": "根据选择动态显示：改派→司机选择列表；取消→确认原因；加派→作业点、时间、要求"
        },
        {
          "zone": "异常处理记录区",
          "content": "处理原因、备注、附件上传"
        },
        {
          "zone": "底部提交确认按钮区",
          "content": "提交按钮"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "未从路由传入有效的任务/车辆数据，页面顶部显示错误提示「无法获取任务信息，请返回重试」，底部提交按钮置灰不可点击"
        },
        {
          "state": "loading",
          "content": "提交按钮显示转圈动画，全屏显示半透明加载遮罩，禁止用户操作"
        },
        {
          "state": "success",
          "content": "提交成功后自动返回主工作台页面，并触发任务列表刷新，同时页面底部可短暂显示成功提示 toast"
        },
        {
          "state": "error",
          "content": "提交失败时关闭加载遮罩，在页面顶部显示红色错误消息（如操作失败：原因），提交按钮恢复可点击状态，允许用户修正后重新提交"
        }
      ],
      "keyInteractions": [
        "选择操作类型：change事件，根据所选类型（改派/取消/加派）动态显示对应的表单区域，隐藏不相关的字段",
        "改派-选择司机：点击，弹出底部浮层或全屏列表，展示周边空闲司机（含姓名、车牌、当前位置），选中后回填至「目标司机」字段",
        "加派-选择作业点：点击，弹出作业点选择器（支持搜索或地图选点），选中后回填至「作业地点」字段",
        "提交确认：点击，触发二次确认弹窗，显示操作摘要（包括操作类型、关键字段值、异常处理原因），用户确认后开始提交；提交过程中显示加载遮罩，提交成功后自动返回主工作台页面并刷新列表，提交失败则展示错误消息并允许重新提交"
      ],
      "revisionNote": "根据原页面规格TaskAdjustView.vue转换而来"
    },
    {
      "file": "GateAccessCheckView.vue",
      "layoutZones": [
        {
          "zone": "顶部状态栏",
          "content": "显示当前接口连接状态（正常/异常）、待处理车辆数"
        },
        {
          "zone": "左侧待核验车辆列表",
          "content": "车牌号、核验状态图标、来源标签，支持筛选"
        },
        {
          "zone": "右侧核验详情与操作区",
          "content": "车辆档案摘要、核验结果详情、预设原因列表、手动放行/拒绝按钮、异常原因登记弹窗"
        },
        {
          "zone": "底部操作日志/提示区域（可选）",
          "content": "操作日志或提示信息"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "当前无待入场车辆，显示空状态提示"
        },
        {
          "state": "loading",
          "content": "数据加载中，显示骨架屏或加载动画"
        },
        {
          "state": "success",
          "content": "操作成功（放行/拒绝/降级成功）后显示短暂成功提示"
        },
        {
          "state": "error",
          "content": "接口异常时触发降级模式，显示降级面板；或操作失败时显示错误提示"
        }
      ],
      "keyInteractions": [
        "选择车辆行：点击左侧待核验列表中的某一行，右侧区域加载该车的核验详情、车辆档案摘要及关联任务信息",
        "放行（核验通过车辆）：点击选中车辆详情区的“放行”按钮，弹出二次确认弹窗，确认后调用POST /api/gate/vehicle-action接口，车辆从列表移除，显示放行成功反馈",
        "手动放行（核验失败/需人工判断）：点击“手动放行”按钮，直接调用POST /api/gate/vehicle-action接口，车辆从列表移除，显示放行成功反馈",
        "拒绝：点击“拒绝”按钮，弹出异常原因登记弹窗（含abnormalReason和abnormalRemark字段），提交后调用POST /api/gate/abnormal-record接口，车辆从列表移除，显示拒绝成功反馈",
        "异常原因提交：在异常原因登记弹窗中点击“确认”按钮，提交表单，调用POST /api/gate/abnormal-record，关闭弹窗，列表更新",
        "手动刷新：点击刷新按钮（或下拉手势），重新请求GET /api/gate/pending-vehicles，列表更新，显示加载态",
        "降级放行/拒绝：在降级面板中手动录入车牌并选择操作（放行或拒绝）后点击确认，调用POST /api/gate/degraded-action，操作成功或失败后给出相应反馈，关闭降级面板",
        "筛选状态变更：改变筛选下拉框的值，重新请求列表（带上筛选参数）或本地过滤，列表刷新"
      ]
    },
    {
      "file": "GateEntryRecordsView.vue",
      "layoutZones": [
        {
          "zone": "顶部筛选栏",
          "content": "时间范围、车牌号、操作结果（放行/拒绝）、同步状态"
        },
        {
          "zone": "记录列表",
          "content": "显示时间、车牌、操作类型、操作员、同步状态标签、重新同步按钮（仅同步失败时显示）"
        },
        {
          "zone": "记录详情弹窗",
          "content": "显示完整核验结果快照、接口返回信息、异常原因、降级标记等"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "显示“暂无入场记录”占位图"
        },
        {
          "state": "loading",
          "content": "列表区域显示加载状态，如骨架屏或加载指示器"
        },
        {
          "state": "success",
          "content": "列表正常展示记录数据"
        },
        {
          "state": "error",
          "content": "列表请求失败时显示错误提示，并提供重试按钮"
        }
      ],
      "keyInteractions": [
        "筛选条件变更：用户修改任何筛选字段值，自动触发列表请求，列表重新加载，显示加载态",
        "重新同步：点击“重新同步”按钮（仅在同步失败记录行中显示），调用POST /api/gate/retry-sync/{recordId}，按钮变为加载状态，完成后更新该记录同步状态为“同步中”或“已同步”，若失败则保持“同步失败”并提示错误",
        "查看详情：点击列表行，弹窗显示该条记录的完整核验结果快照，包括接口返回信息、异常原因、降级标记等"
      ]
    },
    {
      "file": "ManagementReportsView.vue",
      "layoutZones": [
        {
          "zone": "顶部筛选区",
          "content": "时间范围选择器、车辆类型多选、作业区域多选、查询按钮"
        },
        {
          "zone": "指标卡片区",
          "content": "5个关键运营指标卡片横向排列，支持点击下钻"
        },
        {
          "zone": "趋势图区域",
          "content": "折线图/柱状图，含指标切换下拉、粒度切换"
        },
        {
          "zone": "导出操作区",
          "content": "“导出Excel”“导出PDF”按钮及范围选择"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "当前筛选条件下没有任何数据，展示空状态提示“暂无统计数据”，指标卡片显示“暂无数据”，趋势图展示空白状态，显示空状态插画及文字提示"
        },
        {
          "state": "loading",
          "content": "数据加载中，展示骨架屏或加载动画，筛选区域保持可操作，数据区域显示加载指示器，防止重复提交"
        },
        {
          "state": "success",
          "content": "数据加载成功并正常展示，指标卡片、趋势图、导出选项等区域正常渲染，无额外提示"
        },
        {
          "state": "error",
          "content": "网络错误或接口异常，显示错误提示信息“加载失败，请重试”和重试按钮，数据区域保留上次成功缓存或清空"
        }
      ],
      "keyInteractions": [
        "筛选查询：点击“查询”按钮或任意筛选条件变更后自动查询，所有数据区域显示加载态，数据返回后更新显示，若出错显示错误提示",
        "点击指标卡片：鼠标点击任意指标卡片，跳转至对应的明细数据详情页，并携带当前所有筛选条件作为参数",
        "切换趋势图指标：趋势图指标下拉框选项变更，趋势图重新加载对应指标的数据，显示加载态后更新图表",
        "切换趋势图粒度：趋势图粒度下拉框选项变更，趋势图重新加载对应粒度的数据，显示加载态后更新图表",
        "点击趋势图数据点：鼠标点击趋势图上的数据点，跳转至该时间点的明细数据列表页，携带当前筛选条件及选中的时间点",
        "导出报表：点击“导出Excel”或“导出PDF”按钮，若导出范围未选择则提示选择，随后显示导出进度，完成后提供下载链接或自动下载，失败显示错误原因",
        "重试加载：在异常态下点击“重试”按钮，重新触发当前页面的所有数据加载请求"
      ]
    },
    {
      "file": "ReportDetailView.vue",
      "layoutZones": [
        {
          "zone": "页面顶部面包屑导航及返回概览按钮",
          "content": "页面顶部面包屑导航及返回概览按钮"
        },
        {
          "zone": "当前筛选条件标签（显示继承自概览页的筛选条件，可微调）",
          "content": "当前筛选条件标签（显示继承自概览页的筛选条件，可微调）"
        },
        {
          "zone": "明细类型标签页（外协费用明细/异常入场记录/排班排队分析）",
          "content": "明细类型标签页（外协费用明细/异常入场记录/排班排队分析）"
        },
        {
          "zone": "表格区（含搜索框、排序箭头、分页控制器）",
          "content": "表格区（含搜索框、排序箭头、分页控制器）"
        },
        {
          "zone": "导出当前明细按钮",
          "content": "导出当前明细按钮"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "无对应明细数据时，表格区展示'暂无记录'图片和文字提示，并提供清除筛选条件或重新选择的引导按钮"
        },
        {
          "state": "loading",
          "content": "数据加载中，表格行显示骨架屏或加载中提示，禁用交互操作"
        },
        {
          "state": "success",
          "content": "数据正常加载，表格展示数据，所有交互可用"
        },
        {
          "state": "error",
          "content": "数据加载失败，表格区显示错误提示和重试按钮，点击重试重新请求"
        }
      ],
      "keyInteractions": [
        "切换明细类型：点击明细类型标签页，刷新表格数据，重置搜索和排序状态，更新URL参数或本地状态",
        "搜索：在搜索框中输入关键字后按回车或点击搜索图标，根据关键字过滤表格数据，重新查询并更新分页",
        "排序：点击列头排序箭头，切换升序/降序，重新排序表格数据，保留当前搜索和分页",
        "分页：点击分页控件页码或上一页/下一页，加载新页码的数据，保持当前筛选和排序条件",
        "导出：点击“导出当前明细”按钮，弹出导出确认或直接下载导出文件（CSV/Excel），提示导出进度",
        "返回概览：点击面包屑导航中的概览层级或“返回概览”按钮，返回概览工作台页面，保留筛选条件",
        "微调筛选条件：点击筛选条件标签旁的编辑或直接在筛选区域修改，更新筛选条件，重新加载表格数据"
      ]
    },
    {
      "file": "WorkspaceView.vue",
      "layoutZones": [
        {
          "zone": "顶部筛选与排序栏（车辆类型、作业区域、申请日期、紧急度排序）",
          "content": "顶部筛选与排序栏（车辆类型、作业区域、申请日期、紧急度排序）"
        },
        {
          "zone": "左侧待办申请列表区（状态标签、超时标识、关键字段摘要）",
          "content": "左侧待办申请列表区（状态标签、超时标识、关键字段摘要）"
        },
        {
          "zone": "右侧详情与操作区（表单详情、车辆档案校验结果、通过/驳回按钮、审批意见输入框、授权码生成与同步状态反馈）",
          "content": "右侧详情与操作区（表单详情、车辆档案校验结果、通过/驳回按钮、审批意见输入框、授权码生成与同步状态反馈）"
        },
        {
          "zone": "底部操作日志快照（审批记录）",
          "content": "底部操作日志快照（审批记录）"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "无待审批预约，列表区域显示「暂无待审批预约」，详情区域隐藏或提示选择申请"
        },
        {
          "state": "loading",
          "content": "列表加载中显示骨架屏，详情加载中显示 loading 指示"
        },
        {
          "state": "success",
          "content": "正常显示待办列表和详情面板，审批操作成功反馈"
        },
        {
          "state": "error",
          "content": "接口请求失败时显示网络错误提示和重试按钮，车辆档案校验接口失败时在详情面板局部提示"
        },
        {
          "state": "overdue_warning",
          "content": "列表中有超时未处理的申请时，对应项显示黄色角标，并在顶部显示提示信息"
        }
      ],
      "keyInteractions": [
        "点击列表项：用户点击待办列表中某一条申请，右侧详情面板加载该申请的完整信息，包括车辆档案校验结果",
        "筛选条件变更：用户修改任意筛选条件（车辆类型、作业区域、申请日期、排序方式、车牌搜索），重新请求待办列表，更新列表数据，若请求失败显示错误状态",
        "通过审批：用户点击「通过」按钮，弹出二次确认对话框（若车辆证照过期则强制确认），确认后调用审批通过接口，成功后显示授权码和同步状态，若失败显示错误提示",
        "驳回审批：用户点击「驳回」按钮，弹出原因输入框（必填），提交后调用审批驳回接口，成功后刷新列表并关闭详情面板",
        "重新同步授权码：用户点击「重新同步」按钮，调用授权码同步接口，更新同步状态显示",
        "手动刷新列表：用户点击刷新按钮或下拉刷新，重新请求待办列表，显示加载态"
      ]
    },
    {
      "file": "AccessCodeView.vue",
      "layoutZones": [
        {
          "zone": "顶部状态筛选栏（全部|同步成功|同步失败|待同步|已过期|已使用）",
          "content": "顶部状态筛选栏（全部|同步成功|同步失败|待同步|已过期|已使用）"
        },
        {
          "zone": "授权码列表区（车牌号、授权码、有效期、同步状态、使用时间、门岗信息）",
          "content": "授权码列表区（车牌号、授权码、有效期、同步状态、使用时间、门岗信息）"
        },
        {
          "zone": "单条记录展开详情（同步日志、重试按钮）",
          "content": "单条记录展开详情（同步日志、重试按钮）"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "暂无授权码数据，显示占位提示"
        },
        {
          "state": "loading",
          "content": "列表区域显示骨架屏加载效果"
        },
        {
          "state": "success",
          "content": "列表正常展示，状态标签颜色区分（同步成功绿色、同步失败红色、待同步橙色、已过期灰色、已使用蓝色等）"
        },
        {
          "state": "error",
          "content": "接口请求失败，显示错误提示及重试按钮"
        }
      ],
      "keyInteractions": [
        "切换状态筛选标签：点击状态筛选标签，切换列表数据，高亮选中标签",
        "查看授权码详情：点击单条记录行或展开按钮，展开该记录详情区域，显示同步日志（失败原因）和重试按钮",
        "重新同步：点击重新同步按钮，按钮显示加载状态，请求POST /api/access-codes/{id}/resync，成功后刷新列表对应记录状态，失败提示错误信息",
        "搜索车牌号：输入回车或点击搜索图标，根据关键字重新加载列表数据"
      ]
    },
    {
      "file": "HistoryView.vue",
      "layoutZones": [
        {
          "zone": "顶部筛选栏",
          "content": "多条件筛选：时间范围、车辆、所属单位、作业区域、审批状态"
        },
        {
          "zone": "历史记录列表",
          "content": "倒序展示历史预约记录，显示审批状态、授权码、入场/出场时间、费用"
        },
        {
          "zone": "详情展开/弹窗",
          "content": "单条记录展开详情或弹窗，展示完整操作日志和费用明细"
        },
        {
          "zone": "导出区域",
          "content": "导出按钮及导出进度提示"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "按条件无数据时显示『暂无记录』并提示修改筛选条件"
        },
        {
          "state": "loading",
          "content": "列表数据加载中，显示加载态"
        },
        {
          "state": "success",
          "content": "数据加载成功，正常展示列表"
        },
        {
          "state": "error",
          "content": "接口请求失败时提示重试"
        }
      ],
      "keyInteractions": [
        "筛选条件变更：自动发起请求获取新列表，显示加载态",
        "查看详情：打开详情弹窗，展示操作日志时间线和费用明细",
        "导出Excel：确认后开始生成，显示进度条，完成后自动下载",
        "分页：跳转目标页码，重新请求数据并更新列表"
      ]
    },
    {
      "file": "VehicleArchiveList.vue",
      "layoutZones": [
        {
          "zone": "顶部操作栏",
          "content": "新增车辆按钮、导出按钮、批量停用/启用按钮（可选）"
        },
        {
          "zone": "筛选区",
          "content": "车辆类型、所属单位、车辆状态、有效期状态下拉框；车牌号/司机姓名搜索框"
        },
        {
          "zone": "到期提醒横幅/面板",
          "content": "展示临近30天到期的车辆条目列表，含车辆、到期类型、剩余天数，可点击跳转编辑页"
        },
        {
          "zone": "车辆列表主体",
          "content": "展示车牌号、车辆类型、所属单位、司机、有效期状态、车辆状态；每行包含『编辑』、『停用/启用』按钮"
        },
        {
          "zone": "分页控件",
          "content": "分页组件，支持页码切换"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "无车辆数据时展示空态插画及提示文字“暂无车辆，请点击新增”，并突出显示新增按钮"
        },
        {
          "state": "loading",
          "content": "列表区域显示骨架屏或loading旋转动画"
        },
        {
          "state": "success",
          "content": "正常显示车辆列表，筛选、搜索、分页功能可用"
        },
        {
          "state": "error",
          "content": "网络异常或接口错误时展示错误提示信息及重试按钮"
        }
      ],
      "keyInteractions": [
        "新增车辆：点击顶部操作栏『新增车辆』按钮，跳转至新增车辆页面",
        "导出：点击顶部操作栏『导出』按钮，导出当前筛选结果或全部列表为Excel文件",
        "批量停用：点击顶部操作栏『批量停用』按钮（可选功能），弹出批量停用弹窗，选择车辆并填写停用原因后提交",
        "批量启用：点击顶部操作栏『批量启用』按钮（可选功能），弹出确认弹窗，确认后批量启用",
        "搜索：在搜索框输入后按回车或点击搜索图标，触发防抖（300ms）后请求接口刷新列表",
        "筛选变化：任一筛选下拉框值变化，即时触发防抖请求刷新列表",
        "点击到期提醒条目：点击到期提醒横幅/面板中的车辆条目，跳转至对应车辆编辑页并自动定位至有效期设置区域",
        "停用车辆：点击列表行内『停用』按钮，弹出确认弹窗，要求填写停用原因（必填），提交后刷新列表并更新提醒区域",
        "启用车辆：点击列表行内『启用』按钮，弹出确认弹窗（无需原因），确认后刷新列表",
        "编辑车辆：点击列表行内『编辑』按钮，跳转至对应车辆编辑页"
      ]
    },
    {
      "file": "VehicleArchiveEdit.vue",
      "layoutZones": [
        {
          "zone": "页面标题",
          "content": "『新增车辆』或『编辑车辆 - 车牌号』"
        },
        {
          "zone": "基本信息区",
          "content": "车辆类型（下拉）、车牌号（文本输入）、所属单位（下拉）、司机姓名、司机电话"
        },
        {
          "zone": "有效期设置区",
          "content": "年检有效期、保险有效期、准入有效期三个日期选择器（可单独清除）"
        },
        {
          "zone": "证照图片管理区",
          "content": "列表展示已有证照（类型、缩略图）；操作按钮『上传』、『预览』、『替换』、『删除』；支持拖拽排序（可选）"
        },
        {
          "zone": "操作按钮区",
          "content": "『保存』、『取消』按钮；保存时触发完整校验"
        },
        {
          "zone": "操作日志摘要区",
          "content": "只读显示该车辆最近操作日志的简要列表（可选，不超过4条），点击可跳转到操作日志页"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "新增模式下所有字段为空，证照图片区无图片；编辑模式下预填充数据"
        },
        {
          "state": "loading",
          "content": "页面加载车辆详情数据时显示loading；保存时按钮显示loading并禁用"
        },
        {
          "state": "success",
          "content": "保存成功后跳转到列表页并显示成功提示"
        },
        {
          "state": "error",
          "content": "保存失败时显示错误信息（如网络错误、数据冲突），保留用户输入；校验失败时在对应字段下显示错误信息"
        }
      ],
      "keyInteractions": [
        "保存：点击保存按钮，执行完整校验（必填字段不能为空，日期不能早于当天）；校验通过后显示提交loading，成功后跳转到列表页并刷新；失败时显示错误信息并保留输入",
        "取消：点击取消按钮，返回上一页（列表页），如果表单有未保存修改，弹出确认提示",
        "上传证照：点击上传按钮，弹出文件选择器，选择图片后自动上传并显示缩略图，同时要求选择证照类型",
        "预览证照：点击预览按钮（或图片缩略图），弹出预览弹窗，可放大查看证照图片",
        "替换证照：点击替换按钮，弹出文件选择器，选择新图片后上传并替换旧图，旧图标记为历史版本，并记录操作日志",
        "删除证照：点击删除按钮，弹出确认弹窗，确认后删除图片并记录操作日志，缩略图移除",
        "查看操作日志：点击操作日志摘要区的日志条目，跳转到操作日志详情页，显示该车辆的所有操作日志"
      ]
    },
    {
      "file": "VehicleArchiveLogs.vue",
      "layoutZones": [
        {
          "zone": "筛选区",
          "content": "包含时间范围（日期选择器）、操作人（下拉或输入）、操作类型（多选下拉）、关联车辆（车牌号输入/选择）"
        },
        {
          "zone": "日志列表区",
          "content": "展示操作日志表格，包括时间、操作人、操作类型、关联车辆、修改内容摘要；每行可展开显示详情"
        },
        {
          "zone": "操作区",
          "content": "包含导出Excel按钮，位于列表上方或右侧"
        },
        {
          "zone": "分页区",
          "content": "位于列表底部，支持页码跳转和每页条数设置"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "列表区域显示“暂无操作记录”空白提示"
        },
        {
          "state": "loading",
          "content": "查询或导出时显示加载动画（如骨架屏或旋转图标），禁用交互按钮"
        },
        {
          "state": "success",
          "content": "导出成功时弹出成功提示并下载文件；查询成功时正常显示列表"
        },
        {
          "state": "error",
          "content": "查询失败或导出失败时在页面顶部或弹窗展示错误提示信息"
        }
      ],
      "keyInteractions": [
        "点击导出按钮，若筛选结果超过10万条则弹出提示要求缩小范围，否则发起POST请求并显示loading，完成后提示成功或失败",
        "点击日志行，该行下方展开区域显示修改内容的前后JSON对比（before/after）"
      ]
    }
  ],
  "pageApiMapping": [
    {
      "page": "DispatchWorkbenchView.vue",
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
      "page": "AlertAndTaskMonitorView.vue",
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
      "page": "DriverTaskListView.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/driver/tasks",
          "usage": "司机进入任务列表页时，按状态筛选获取当前登录司机的任务列表，展示待接单、进行中、已完成任务"
        }
      ]
    },
    {
      "page": "DriverTaskExecuteView.vue",
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
      "page": "MobileDispatchView.vue",
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
      "page": "TaskAdjustView.vue",
      "apis": [
        {
          "method": "POST",
          "path": "/api/tasks/adjustment",
          "usage": "在点击提交调整操作（改派、取消或新增临时任务）并填写异常处理记录后，调用该接口将调整内容和异常处理记录一并提交。"
        }
      ]
    },
    {
      "page": "GateAccessCheckView.vue",
      "apis": [
        {
          "method": "POST",
          "path": "/api/gate/vehicle-action",
          "usage": "门岗人员在核验车辆后，点击放行或拒绝按钮时调用此接口执行入场操作，并触发相应的道闸控制或拒绝记录生成。"
        }
      ]
    },
    {
      "page": "GateEntryRecordsView.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/gate/entry-records",
          "usage": "页面加载或切换筛选条件时，调用此接口获取历史入场处理记录列表，用于展示入场记录表格并支持后续手动重新同步操作。"
        }
      ]
    },
    {
      "page": "ManagementReportsView.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/reports/overview",
          "usage": "页面初始化或筛选条件变更时，调用此接口获取运营报表概览数据，包括指标卡片和趋势图数据，用于渲染概览工作台。"
        }
      ]
    },
    {
      "page": "ReportDetailView.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/reports/detail",
          "usage": "页面加载或用户切换明细类型、调整筛选条件、搜索、排序、分页时，调用此接口获取当前明细表格数据，用于展示和导出。"
        }
      ]
    },
    {
      "page": "WorkspaceView.vue",
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
      "page": "AccessCodeView.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/access-codes",
          "usage": "页面加载时调用，分页查询所有授权码列表，支持按同步状态筛选和车牌号搜索；手动刷新时也调用"
        }
      ]
    },
    {
      "page": "HistoryView.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/reservations/history",
          "usage": "页面加载时以及点击查询按钮时调用，根据筛选条件分页查询历史预约记录，用于列表展示和导出"
        }
      ]
    },
    {
      "page": "VehicleArchiveList.vue",
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
      "page": "VehicleArchiveEdit.vue",
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
      "page": "VehicleArchiveLogs.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/vehicles/logs",
          "usage": "页面加载时，根据筛选条件分页查询操作日志列表"
        }
      ]
    }
  ],
  "navigationRoutes": [
    {
      "group": "调度指挥",
      "icon": "🚦",
      "routes": [
        {
          "path": "/dispatch/workbench",
          "component": "DispatchWorkbenchView.vue",
          "title": "调度工作台",
          "default": true
        },
        {
          "path": "/dispatch/monitor",
          "component": "AlertAndTaskMonitorView.vue",
          "title": "告警与任务监控",
          "default": false
        },
        {
          "path": "/dispatch/mobile",
          "component": "MobileDispatchView.vue",
          "title": "移动调度",
          "default": false
        },
        {
          "path": "/dispatch/task-adjust",
          "component": "TaskAdjustView.vue",
          "title": "任务调整",
          "default": false
        }
      ]
    },
    {
      "group": "任务执行",
      "icon": "🚚",
      "routes": [
        {
          "path": "/task/list",
          "component": "DriverTaskListView.vue",
          "title": "司机任务列表",
          "default": true
        },
        {
          "path": "/task/execute",
          "component": "DriverTaskExecuteView.vue",
          "title": "任务执行",
          "default": false
        }
      ]
    },
    {
      "group": "场地管理",
      "icon": "🏢",
      "routes": [
        {
          "path": "/gate/access-check",
          "component": "GateAccessCheckView.vue",
          "title": "门岗核验",
          "default": true
        },
        {
          "path": "/gate/entry-records",
          "component": "GateEntryRecordsView.vue",
          "title": "入场记录",
          "default": false
        }
      ]
    },
    {
      "group": "外协管理",
      "icon": "📋",
      "routes": [
        {
          "path": "/external/workspace",
          "component": "WorkspaceView.vue",
          "title": "预约工作台",
          "default": true
        },
        {
          "path": "/external/access-code",
          "component": "AccessCodeView.vue",
          "title": "授权码管理",
          "default": false
        },
        {
          "path": "/external/history",
          "component": "HistoryView.vue",
          "title": "历史记录",
          "default": false
        }
      ]
    },
    {
      "group": "综合管理",
      "icon": "📊",
      "routes": [
        {
          "path": "/management/reports",
          "component": "ManagementReportsView.vue",
          "title": "运营报表",
          "default": true
        },
        {
          "path": "/management/report-detail",
          "component": "ReportDetailView.vue",
          "title": "报表详情",
          "default": false
        },
        {
          "path": "/management/vehicle-archive",
          "component": "VehicleArchiveList.vue",
          "title": "车辆档案列表",
          "default": false
        },
        {
          "path": "/management/vehicle-archive/edit",
          "component": "VehicleArchiveEdit.vue",
          "title": "车辆档案编辑",
          "default": false
        },
        {
          "path": "/management/vehicle-archive/logs",
          "component": "VehicleArchiveLogs.vue",
          "title": "档案操作日志",
          "default": false
        }
      ]
    }
  ],
  "componentFiles": [
    {
      "file": "StatusTag.vue",
      "responsibility": "显示不同状态的颜色标签，支持自定义颜色和文本",
      "reusedBy": [
        "DispatchWorkbenchView.vue",
        "AlertAndTaskMonitorView.vue",
        "DriverTaskListView.vue",
        "GateEntryRecordsView.vue",
        "WorkspaceView.vue",
        "AccessCodeView.vue",
        "HistoryView.vue",
        "VehicleArchiveList.vue"
      ],
      "props": [
        {
          "name": "status",
          "type": "String",
          "required": true,
          "default": "",
          "description": "状态标识，用于关联预设的颜色映射，如'空闲'、'任务中'、'成功'、'失败'等"
        },
        {
          "name": "text",
          "type": "String",
          "required": false,
          "default": "",
          "description": "显示的标签文本，如果未设置则使用 status 值"
        },
        {
          "name": "size",
          "type": "String",
          "required": false,
          "default": "default",
          "description": "标签尺寸，可选 'small'、'default'、'large'"
        },
        {
          "name": "customClass",
          "type": "String",
          "required": false,
          "default": "",
          "description": "自定义 CSS 类名，用于覆盖默认样式"
        }
      ],
      "events": [],
      "slots": []
    },
    {
      "file": "DataFilterBar.vue",
      "responsibility": "提供筛选条件的组合区域，包含时间范围选择器、下拉选择器、搜索输入框等，支持自定义筛选项",
      "reusedBy": [
        "ManagementReportsView.vue",
        "ReportDetailView.vue",
        "HistoryView.vue",
        "VehicleArchiveList.vue",
        "VehicleArchiveLogs.vue",
        "GateEntryRecordsView.vue"
      ],
      "props": [
        {
          "name": "filters",
          "type": "Array",
          "required": true,
          "default": "[]",
          "description": "筛选配置项数组，每个项包含 { type: 'dateRange'|'select'|'input', label, key, options(select类型), placeholder }"
        },
        {
          "name": "modelValue",
          "type": "Object",
          "required": true,
          "default": "{}",
          "description": "当前筛选值对象，键为 filter key，值为选中的值"
        },
        {
          "name": "showSearchButton",
          "type": "Boolean",
          "required": false,
          "default": true,
          "description": "是否显示查询按钮，若为 false 则自动触发查询（防抖）"
        },
        {
          "name": "autoSearchDelay",
          "type": "Number",
          "required": false,
          "default": 300,
          "description": "自动触发查询的防抖延迟毫秒数"
        }
      ],
      "events": [
        {
          "name": "update:modelValue",
          "payload": "Object 新的筛选值对象",
          "description": "当任何筛选字段值变化时触发，传递更新后的筛选值对象"
        },
        {
          "name": "search",
          "payload": "Object 当前筛选值对象",
          "description": "用户点击查询按钮或自动触发搜索时发出，传递当前筛选值"
        },
        {
          "name": "reset",
          "payload": "",
          "description": "用户点击重置按钮时发出，清空所有筛选条件"
        }
      ],
      "slots": [
        {
          "name": "extra",
          "description": "用于在筛选栏末尾插入额外操作按钮或自定义内容"
        }
      ]
    },
    {
      "file": "DataTable.vue",
      "responsibility": "通用数据表格组件，支持列配置、排序、分页、搜索、展开行、自定义插槽",
      "reusedBy": [
        "AlertAndTaskMonitorView.vue",
        "GateEntryRecordsView.vue",
        "ReportDetailView.vue",
        "AccessCodeView.vue",
        "HistoryView.vue",
        "VehicleArchiveList.vue",
        "VehicleArchiveLogs.vue",
        "WorkspaceView.vue"
      ],
      "props": [
        {
          "name": "columns",
          "type": "Array",
          "required": true,
          "default": "[]",
          "description": "列定义数组，每项包含 { key, title, sortable, width, align, customRender }"
        },
        {
          "name": "data",
          "type": "Array",
          "required": true,
          "default": "[]",
          "description": "表格数据数组"
        },
        {
          "name": "loading",
          "type": "Boolean",
          "required": false,
          "default": false,
          "description": "是否显示加载状态"
        },
        {
          "name": "emptyText",
          "type": "String",
          "required": false,
          "default": "暂无数据",
          "description": "数据为空时显示的文本提示"
        },
        {
          "name": "pagination",
          "type": "Object",
          "required": false,
          "default": null,
          "description": "分页配置，如果设置为 null 则不显示分页；包含 { current, pageSize, total }"
        },
        {
          "name": "rowKey",
          "type": "String",
          "required": false,
          "default": "id",
          "description": "用于标识行的唯一键字段名"
        },
        {
          "name": "expandable",
          "type": "Boolean",
          "required": false,
          "default": false,
          "description": "是否支持展开行"
        }
      ],
      "events": [
        {
          "name": "sortChange",
          "payload": "{ key, order }",
          "description": "点击排序列头时触发，返回排序列的 key 和排序方向 'asc' 或 'desc'"
        },
        {
          "name": "pageChange",
          "payload": "Number 新页码",
          "description": "切换页码时触发，返回目标页码"
        },
        {
          "name": "pageSizeChange",
          "payload": "Number 新每页条数",
          "description": "修改每页条数时触发"
        },
        {
          "name": "rowClick",
          "payload": "Object 当前行数据",
          "description": "点击某一行时触发，传递该行数据"
        },
        {
          "name": "expandChange",
          "payload": "{ row, expanded }",
          "description": "展开行状态变化时触发，返回行数据和展开/收起状态"
        }
      ],
      "slots": [
        {
          "name": "empty",
          "description": "自定义空状态内容"
        },
        {
          "name": "expandRow",
          "description": "展开行的内容插槽，作用域插槽可获取行数据"
        },
        {
          "name": "cell",
          "description": "自定义单元格渲染，作用域插槽包含 { column, row, value }"
        }
      ]
    },
    {
      "file": "DetailPanel.vue",
      "responsibility": "通用详情展示面板，支持抽屉或弹窗模式，可配置标题、分组信息、自定义内容区块",
      "reusedBy": [
        "DispatchWorkbenchView.vue",
        "AlertAndTaskMonitorView.vue",
        "DriverTaskExecuteView.vue",
        "MobileDispatchView.vue",
        "TaskAdjustView.vue",
        "GateAccessCheckView.vue",
        "GateEntryRecordsView.vue",
        "WorkspaceView.vue",
        "AccessCodeView.vue",
        "HistoryView.vue",
        "VehicleArchiveEdit.vue"
      ],
      "props": [
        {
          "name": "visible",
          "type": "Boolean",
          "required": false,
          "default": false,
          "description": "是否显示详情面板"
        },
        {
          "name": "title",
          "type": "String",
          "required": false,
          "default": "",
          "description": "面板标题"
        },
        {
          "name": "mode",
          "type": "String",
          "required": false,
          "default": "drawer",
          "description": "展示模式，可选 'drawer'（抽屉）、'modal'（弹窗）"
        },
        {
          "name": "width",
          "type": "String",
          "required": false,
          "default": "400px",
          "description": "面板宽度，支持 CSS 单位"
        },
        {
          "name": "closable",
          "type": "Boolean",
          "required": false,
          "default": true,
          "description": "是否显示关闭按钮"
        }
      ],
      "events": [
        {
          "name": "close",
          "payload": "",
          "description": "用户关闭面板时触发"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "面板主体内容，通常包含多个 info-group"
        },
        {
          "name": "header",
          "description": "自定义头部区域，覆盖 title 和关闭按钮"
        },
        {
          "name": "footer",
          "description": "面板底部操作区，通常放置确认/取消按钮"
        }
      ]
    },
    {
      "file": "ConfirmDialog.vue",
      "responsibility": "通用确认对话框，用于二次确认操作，支持自定义标题、内容和按钮文本",
      "reusedBy": [
        "AlertAndTaskMonitorView.vue",
        "DriverTaskListView.vue",
        "MobileDispatchView.vue",
        "TaskAdjustView.vue",
        "GateAccessCheckView.vue",
        "WorkspaceView.vue",
        "VehicleArchiveList.vue",
        "VehicleArchiveEdit.vue"
      ],
      "props": [
        {
          "name": "visible",
          "type": "Boolean",
          "required": false,
          "default": false,
          "description": "是否显示对话框"
        },
        {
          "name": "title",
          "type": "String",
          "required": false,
          "default": "确认操作",
          "description": "对话框标题"
        },
        {
          "name": "content",
          "type": "String",
          "required": false,
          "default": "",
          "description": "确认提示内容文本"
        },
        {
          "name": "confirmText",
          "type": "String",
          "required": false,
          "default": "确定",
          "description": "确认按钮文本"
        },
        {
          "name": "cancelText",
          "type": "String",
          "required": false,
          "default": "取消",
          "description": "取消按钮文本"
        },
        {
          "name": "loading",
          "type": "Boolean",
          "required": false,
          "default": false,
          "description": "确认按钮是否显示加载中状态"
        },
        {
          "name": "danger",
          "type": "Boolean",
          "required": false,
          "default": false,
          "description": "是否为危险操作（如删除），确认按钮显示红色"
        }
      ],
      "events": [
        {
          "name": "confirm",
          "payload": "",
          "description": "用户点击确认按钮时触发"
        },
        {
          "name": "cancel",
          "payload": "",
          "description": "用户点击取消或关闭时触发"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "自定义对话框内容，如果提供则覆盖 content prop"
        }
      ]
    },
    {
      "file": "FileUpload.vue",
      "responsibility": "通用文件/图片上传组件，支持多文件、预览、删除、替换，集成拖拽排序（可选）",
      "reusedBy": [
        "DriverTaskExecuteView.vue",
        "VehicleArchiveEdit.vue"
      ],
      "props": [
        {
          "name": "fileList",
          "type": "Array",
          "required": false,
          "default": "[]",
          "description": "已上传的文件列表，每项包含 { id, url, name, type, thumbnail }"
        },
        {
          "name": "accept",
          "type": "String",
          "required": false,
          "default": "image/*",
          "description": "允许的文件 MIME 类型，如 'image/*'、'.pdf,.doc'"
        },
        {
          "name": "multiple",
          "type": "Boolean",
          "required": false,
          "default": true,
          "description": "是否允许选择多个文件"
        },
        {
          "name": "maxCount",
          "type": "Number",
          "required": false,
          "default": 9,
          "description": "最大上传文件数量"
        },
        {
          "name": "uploadUrl",
          "type": "String",
          "required": true,
          "default": "",
          "description": "文件上传接口地址"
        },
        {
          "name": "headers",
          "type": "Object",
          "required": false,
          "default": "{}",
          "description": "上传请求的额外头部"
        }
      ],
      "events": [
        {
          "name": "update:fileList",
          "payload": "Array 新的文件列表",
          "description": "文件列表发生变化时触发，包括上传、删除、替换"
        },
        {
          "name": "uploadSuccess",
          "payload": "{ file, response }",
          "description": "单个文件上传成功时触发，传递文件对象和后端响应"
        },
        {
          "name": "uploadError",
          "payload": "{ file, error }",
          "description": "单个文件上传失败时触发"
        },
        {
          "name": "preview",
          "payload": "Object 点击的文件对象",
          "description": "用户点击预览按钮时触发"
        }
      ],
      "slots": [
        {
          "name": "trigger",
          "description": "用于自定义触发上传的按钮区域"
        },
        {
          "name": "fileCard",
          "description": "自定义文件卡片渲染，作用域插槽包含 { file, index }"
        }
      ]
    }
  ],
  "mockDataFiles": [
    {
      "file": "mockDispatch.js",
      "content": "调度派车相关Mock数据：包括派车确认、任务调整等API的请求与响应数据",
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
      ]
    },
    {
      "file": "mockAlerts.js",
      "content": "告警监控相关Mock数据：包括实时告警列表、告警处理等API的请求与响应数据",
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
      ]
    },
    {
      "file": "mockTasks.js",
      "content": "司机任务相关Mock数据：包括司机任务列表、任务完成确认等API的请求与响应数据",
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
      ]
    },
    {
      "file": "mockGate.js",
      "content": "门禁管理相关Mock数据：包括车辆入场操作、入场记录查询等API的请求与响应数据",
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
      ]
    },
    {
      "file": "mockReservations.js",
      "content": "预约审批相关Mock数据：包括预约申请批准、授权码列表、历史预约查询等API的请求与响应数据",
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
      ]
    },
    {
      "file": "mockVehicles.js",
      "content": "车辆档案相关Mock数据：包括车辆列表查询、保存车辆档案、操作日志查询等API的请求与响应数据",
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
      "prompt": "你是一个前端开发工程师，负责为项目“车辆管理”（客户：HG）生成 Mock 数据和枚举常量。请根据以下要求生成所有 Mock 数据文件和枚举常量定义。\n\n## 要求\n1. **Mock 数据文件**：参照下方列表生成每个文件的完整内容，使用 Faker.js（或手动构造）填充数据，确保数据合理且覆盖正常、边界（如空列表、超时、到期）和异常情况（如接口错误）。\n   - `mockDispatch.js`：调度派车相关数据，包括用车需求、可选车辆、派车任务、调整操作、移动端告警、周边车辆。\n   - `mockAlerts.js`：告警监控数据，包括告警项、任务进度、告警筛选参数。\n   - `mockTasks.js`：司机任务数据，包括任务项、任务详情、完成提交、司机反馈。\n   - `mockGate.js`：门禁管理数据，包括待核验车辆、入场记录、操作参数、筛选条件。\n   - `mockReservations.js`：预约审批数据，包括预约申请、审批操作、授权码、历史记录。\n   - `mockVehicles.js`：车辆档案数据，包括车辆项、保存参数、操作日志、筛选条件。\n2. **枚举常量**：在 `src/constants/enums.js` 中定义以下枚举（使用 const 对象+Object.freeze），并为每个枚举附带中文说明。\n   - VehicleStatus: { IDLE: '空闲', ON_TASK: '任务中', QUEUED: '排队', ABNORMAL: '异常' }\n   - AlertType: { SPEEDING: '超速', FORBIDDEN_ZONE: '禁入', ABNORMAL_STOP: '异常停留', DRIVER_FEEDBACK: '司机反馈' }\n   - TaskStatus: { PENDING_ACCEPT: '待接单', IN_PROGRESS: '进行中', COMPLETED: '已完成', CANCELLED: '已取消' }\n   - GateAction: { APPROVE: '放行', REJECT: '拒绝', MANUAL_APPROVE: '手动放行' }\n   - SyncStatus: { SUCCESS: '已同步', FAILED: '同步失败', PENDING: '待同步', EXPIRED: '已过期', USED: '已使用' }\n   - ApprovalResult: { PASSED: '通过', REJECTED: '驳回' }\n3. **技术约束**：使用 ES Module 导出（export），Mock 数据中接口响应格式统一为 `{ code: 0, data: ..., message: '' }`，错误时 code 非0。每条 Mock 数据保证字段与 schema 一致。\n4. **验收标准**：所有 Mock 文件可独立运行，引入后可通过 `import { mockDispatch, mockAlerts } from '../mock/...'` 使用；枚举文件可通过 `import { VehicleStatus } from '@/constants/enums'` 引用。"
    },
    {
      "step": 2,
      "title": "生成通用组件",
      "prompt": "你是一个前端开发工程师，为项目“车辆管理”（客户：HG）生成通用组件。请严格按照下方列表和接口契约（props/events/slots）使用 Vue 3 Composition API + TypeScript（可选）实现，并放在 `src/components/common/` 目录下。组件需支持响应式、样式采用 CSS Modules 或 scoped，无第三方 UI 库依赖（可自行用 flex/grid 实现布局）。\n\n## 组件列表\n1. **StatusTag.vue**\n   - 显示状态标签，颜色由 status prop 自动映射（预设颜色：空闲-绿、任务中-蓝、排队-橙、异常-红、成功-绿、失败-红等）。\n   - Props: status (String, 必填), text (String, 可选), size ('small'|'default'|'large'), customClass。\n   - 无 events 或 slots。\n   - 验收：不同 status 渲染正确颜色，大小变化正确。\n\n2. **DataFilterBar.vue**\n   - 筛选条件组合区域，接受 filters 配置渲染时间范围选择器、下拉框、输入框等。\n   - Props: filters (Array, 必填，每项 { type, label, key, options?, placeholder? }), modelValue (Object, 必填), showSearchButton (Boolean, 默认 true), autoSearchDelay (Number, 默认 300)。\n   - Events: update:modelValue, search, reset。\n   - Slots: extra。\n   - 验收：根据 filters 动态渲染控件，点击搜索/自动搜索触发 search 事件，重置清空。\n\n3. **DataTable.vue**\n   - 通用表格，支持列配置、排序、分页、展开行。\n   - Props: columns (Array, 必填), data (Array, 必填), loading, emptyText, pagination (Object 或 null), rowKey, expandable。\n   - Events: sortChange, pageChange, pageSizeChange, rowClick, expandChange。\n   - Slots: empty, expandRow, cell（作用域插槽）。\n   - 验收：排序箭头点击触发 sortChange；分页切换触发 pageChange；展开行正确渲染；空数据展示 emptyText。\n\n4. **DetailPanel.vue**\n   - 详情面板，支持抽屉/弹窗模式。\n   - Props: visible, title, mode ('drawer'|'modal'), width, closable。\n   - Events: close。\n   - Slots: default, header, footer。\n   - 验收：关闭按钮触发 close 事件；模式切换正确。\n\n5. **ConfirmDialog.vue**\n   - 二次确认对话框。\n   - Props: visible, title, content, confirmText, cancelText, loading, danger。\n   - Events: confirm, cancel。\n   - Slots: default。\n   - 验收：点击确认/取消分别触发对应事件；danger 时按钮红色。\n\n6. **FileUpload.vue**\n   - 文件/图片上传组件。\n   - Props: fileList (Array, 默认 []), accept, multiple, maxCount, uploadUrl (必填), headers。\n   - Events: update:fileList, uploadSuccess, uploadError, preview。\n   - Slots: trigger, fileCard。\n   - 验收：支持拖拽/点击上传，上传成功后更新 fileList，预览触发 preview 事件。\n\n所有组件需在 `src/components/index.js` 中统一导出。"
    },
    {
      "step": 3,
      "title": "生成页面（按优先级 P0→P1→P2）",
      "prompt": "你是一个前端开发工程师，为项目“车辆管理”（客户：HG）生成所有页面组件。请根据以下优先级顺序生成，每个页面使用已生成的通用组件（StatusTag、DataFilterBar、DataTable、DetailPanel、ConfirmDialog、FileUpload）和 Mock 数据。页面放在 `src/views/` 目录下，文件名、责任、zone、states、keyInteractions 参考下方说明。\n\n## 优先级与页面列表\n### P0（核心流程，必须完整实现）\n1. **DispatchWorkbenchView.vue**：调度工作台，含地图区域、状态看板、需求列表、派车面板。\n2. **AlertAndTaskMonitorView.vue**：告警与任务监控，含告警列表、任务列表、处理弹窗。\n3. **DriverTaskListView.vue**：司机任务列表，含筛选栏、任务卡片列表。\n4. **DriverTaskExecuteView.vue**：任务执行页，含导航、到达/完成确认、照片上传、反馈。\n5. **MobileDispatchView.vue**：移动调度，含告警通知、车辆地图/列表、通讯面板。\n6. **TaskAdjustView.vue**：任务调整，含操作类型选择、表单、异常记录、提交。\n7. **GateAccessCheckView.vue**：门岗核验，含待核验列表、核验详情、放行/拒绝操作、降级模式。\n8. **WorkspaceView.vue**：预约工作台，含待办列表、审批详情、通过/驳回。\n### P1（重要功能）\n9. **GateEntryRecordsView.vue**：入场记录，含筛选、列表、重新同步。\n10. **ManagementReportsView.vue**：运营报表，含指标卡片、趋势图、导出。\n11. **ReportDetailView.vue**：报表详情，含明细类型标签、表格、搜索排序分页。\n12. **AccessCodeView.vue**：授权码管理，含筛选、列表、重试同步。\n13. **VehicleArchiveList.vue**：车辆档案列表，含到期提醒、筛选、停用/启用。\n14. **VehicleArchiveEdit.vue**：车辆档案编辑/新增，含基本信息、有效期、证照上传。\n### P2（辅助功能）\n15. **HistoryView.vue**：历史记录，含筛选、列表、详情、导出。\n16. **VehicleArchiveLogs.vue**：档案操作日志，含筛选、日志列表、导出。\n\n## 实现要求\n- 每个页面根据原型设计中的 zones 划分布局，使用 flex/grid。\n- 实现 states：empty（空数据）、loading（骨架屏）、success（正常）、error（错误提示+重试）。\n- 实现 keyInteractions 中的所有交互，调用 Mock 数据（通过 import 假数据或模拟请求）。\n- 每个页面在 mounted 时模拟请求，延迟 500ms 返回数据，展示 loading 态。\n- 使用 Vue Router 的 $router.push 处理页面跳转（路由路径参考 navigationRoutes）。\n- 验收标准：所有 P0 页面交互可操作，状态切换正确，Mock 数据展示完整。P1/P2 页面至少实现核心交互。"
    },
    {
      "step": 4,
      "title": "生成路由配置和 API 调用层",
      "prompt": "你是一个前端开发工程师，为项目“车辆管理”（客户：HG）生成路由配置和 API 调用层。要求如下：\n\n## 路由配置\n- 在 `src/router/index.js` 中创建 vue-router 实例，使用 history 模式，base 为 '/vehicle-management/'。\n- 根据以下分组和路由定义生成所有路由，每个路由的 component 懒加载（() => import('@/views/...')）。\n  - 调度指挥：/dispatch/workbench (DispatchWorkbenchView)，/dispatch/monitor (AlertAndTaskMonitorView)，/dispatch/mobile (MobileDispatchView)，/dispatch/task-adjust (TaskAdjustView)\n  - 任务执行：/task/list (DriverTaskListView)，/task/execute (DriverTaskExecuteView)\n  - 场地管理：/gate/access-check (GateAccessCheckView)，/gate/entry-records (GateEntryRecordsView)\n  - 外协管理：/external/workspace (WorkspaceView)，/external/access-code (AccessCodeView)，/external/history (HistoryView)\n  - 综合管理：/management/reports (ManagementReportsView)，/management/report-detail (ReportDetailView)，/management/vehicle-archive (VehicleArchiveList)，/management/vehicle-archive/edit (VehicleArchiveEdit)，/management/vehicle-archive/logs (VehicleArchiveLogs)\n- 默认路由 redirect 到 /dispatch/workbench。\n- 配置一个 404 页面 Not Found。\n\n## API 调用层\n- 在 `src/api/` 目录下按模块创建 HTTP 请求封装文件，使用 axios 实例。\n- 基础 URL 可从环境变量 VUE_APP_API_BASE 获取，默认为 '/api'。\n- axios 实例添加请求拦截器（注入 Token）和响应拦截器（统一错误处理，如 code !==0 时 reject）。\n- 每个 API 文件导出函数，命名对应页面用途，例如：\n  - `src/api/dispatch.js`：export function postDispatch(data)，export function postTaskAdjustment(data)\n  - `src/api/alerts.js`：export function getRealtimeAlerts(params)，export function postAlertHandle(data)\n  - `src/api/tasks.js`：export function getDriverTasks(params)，export function postTaskComplete(taskId, data)，export function postTaskAccept(taskId)\n  - `src/api/gate.js`：export function getPendingVehicles(params)，export function postVehicleAction(data)，export function getEntryRecords(params)，export function retrySync(recordId)\n  - `src/api/reservations.js`：export function getReservations(params)，export function approveReservation(id, data)，export function getAccessCodes(params)，export function resyncAccessCode(id)，export function getHistory(params)\n  - `src/api/vehicles.js`：export function getVehicles(params)，export function saveVehicle(data)，export function getVehicleLogs(params)\n- 验收标准：路由配置正确，导航可切换页面；所有 API 函数可被导入，且符合接口路径和 method（参考 apiMapping）。"
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
  "savedAt": "2026-07-03T10:28:36.102Z"
}
```
<!-- FDE_STEP_RESULT_JSON_END -->
