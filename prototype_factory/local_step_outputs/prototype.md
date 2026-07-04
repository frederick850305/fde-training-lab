# 04 前端原型方案

- 步骤标识：`prototype`
- 保存时间：2026-07-04T04:50:02.963844+00:00
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
          "content": "右侧底部/浮动弹窗，选择车辆、确认派车、查看推荐车辆详情"
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
        "地图点击车辆：显示车辆信息弹窗，包含车牌、司机、速度、任务",
        "状态看板点击分类：跳转至对应车辆列表并在地图高亮该分类车辆",
        "需求列表点击派车：打开派车操作面板，自动推荐可用车辆",
        "派车面板确认派车：刷新地图和看板状态，推送消息给司机",
        "地图框选车辆：筛选框内车辆并同步至看板和需求列表",
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
          "content": "告警列表显示“暂无告警”，任务列表显示“暂无任务”，无数据时展示空态占位"
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
        "确认告警：调用POST /api/v1/alerts/handle，成功后更新告警状态为已处理，列表刷新",
        "忽略告警：调用POST /api/v1/alerts/handle，成功后告警标记为已忽略，列表刷新",
        "转人工：调用POST /api/v1/alerts/handle，状态转为转人工，提示操作成功",
        "催办任务：调用POST /api/v1/tasks/remind，弹出提示已发送催办通知",
        "取消任务：弹出确认对话框，要求填写取消原因，调用POST /api/v1/tasks/cancel，成功后任务状态更新",
        "导出Excel：触发文件下载，导出当前筛选条件下的数据",
        "地图定位：弹窗展示告警详情，同时在地图上定位车辆位置",
        "筛选告警状态：重新加载告警列表，根据选中状态过滤",
        "筛选任务状态：重新加载任务列表，根据选中状态过滤"
      ]
    },
    {
      "file": "DriverTaskListView.vue",
      "layoutZones": [
        {
          "zone": "顶部状态筛选栏",
          "content": "全部/待接单/进行中/已完成四个标签"
        },
        {
          "zone": "任务卡片列表区",
          "content": "每项显示任务ID、作业点名称、预计时间、车牌、状态标签"
        },
        {
          "zone": "底部导航栏",
          "content": "回到工作台等导航按钮"
        },
        {
          "zone": "未读推送通知角标",
          "content": "显示未读推送通知数量"
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
        "下拉刷新：显示加载动画，调用GET /api/driver/tasks?status=当前筛选条件，刷新列表",
        "点击任务卡片：跳转至DriverTaskExecuteView.vue，携带taskId",
        "确认接单：弹出确认对话框，调用POST /api/driver/tasks/{taskId}/accept，成功后卡片状态变为进行中并刷新列表；若失败则显示错误提示",
        "切换筛选：更新筛选条件，重新加载对应状态的任务列表",
        "点击推送通知：跳转至对应任务详情页（若未读，标记已读）"
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
      ]
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
      ]
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
          "content": "提交确认按钮"
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
        "选择操作类型：change，根据所选类型（改派/取消/加派）动态显示对应的表单区域，隐藏不相关的字段",
        "改派-选择司机：click，弹出底部浮层或全屏列表，展示周边空闲司机（含姓名、车牌、当前位置），选中后回填至「目标司机」字段",
        "加派-选择作业点：click，弹出作业点选择器（支持搜索或地图选点），选中后回填至「作业地点」字段",
        "提交确认：click，触发二次确认弹窗，显示操作摘要（包括操作类型、关键字段值、异常处理原因），用户确认后开始提交；提交过程中显示加载遮罩，提交成功后自动返回主工作台页面并刷新列表，提交失败则展示错误消息并允许重新提交"
      ]
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
          "zone": "底部操作日志/提示区域",
          "content": "可选区域，用于显示操作日志或提示信息"
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
        "选择车辆行：点击左侧待核验列表中的某一行",
        "放行（核验通过车辆）：点击选中车辆详情区的“放行”按钮，弹出二次确认弹窗",
        "手动放行（核验失败/需人工判断）：点击“手动放行”按钮，直接调用接口",
        "拒绝：点击“拒绝”按钮，弹出异常原因登记弹窗并提交",
        "异常原因提交：在异常原因登记弹窗中点击“确认”按钮",
        "手动刷新：点击刷新按钮或下拉手势",
        "降级放行/拒绝：在降级面板中手动录入车牌并选择操作后点击确认",
        "筛选状态变更：改变筛选下拉框的值"
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
        "筛选条件变更：用户修改任何筛选字段值，自动触发列表请求",
        "重新同步：点击“重新同步”按钮（同步失败记录行中），调用接口更新同步状态",
        "查看详情：点击列表行，弹窗显示完整核验结果快照"
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
          "content": "5个指标卡片横向排列，支持点击下钻"
        },
        {
          "zone": "趋势图区域",
          "content": "折线图/柱状图，指标切换下拉、粒度切换"
        },
        {
          "zone": "导出操作区",
          "content": "“导出Excel”“导出PDF”按钮及范围选择"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "当前筛选条件下没有任何数据，展示空状态提示“暂无统计数据”，指标卡片显示“暂无数据”，趋势图展示空白状态"
        },
        {
          "state": "loading",
          "content": "数据加载中，展示骨架屏或加载动画"
        },
        {
          "state": "success",
          "content": "数据加载成功并正常展示"
        },
        {
          "state": "error",
          "content": "网络错误或接口异常，显示错误提示信息和重试按钮"
        }
      ],
      "keyInteractions": [
        "筛选查询：点击“查询”按钮或筛选条件变更后自动查询",
        "点击指标卡片：鼠标点击任意指标卡片，跳转至对应的明细数据详情页",
        "切换趋势图指标：趋势图指标下拉框选项变更，重新加载图表",
        "切换趋势图粒度：趋势图粒度下拉框选项变更，重新加载图表",
        "点击趋势图数据点：鼠标点击趋势图上的数据点，跳转至明细列表页",
        "导出报表：点击“导出Excel”或“导出PDF”按钮，触发导出流程",
        "重试加载：在异常态下点击“重试”按钮，重新加载所有数据"
      ]
    },
    {
      "file": "ReportDetailView.vue",
      "layoutZones": [
        {
          "zone": "面包屑导航及返回概览",
          "content": "页面顶部面包屑导航及返回概览按钮"
        },
        {
          "zone": "筛选条件标签",
          "content": "当前筛选条件标签（显示继承自概览页的筛选条件，可微调）"
        },
        {
          "zone": "明细类型标签页",
          "content": "明细类型标签页（外协费用明细/异常入场记录/排班排队分析）"
        },
        {
          "zone": "表格区",
          "content": "表格区（含搜索框、排序箭头、分页控制器）"
        },
        {
          "zone": "导出按钮",
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
        "切换明细类型：点击明细类型标签页，刷新表格数据，重置搜索和排序状态",
        "搜索：在搜索框中输入关键字后按回车或点击搜索图标，根据关键字过滤表格数据，重新查询并更新分页",
        "排序：点击列头排序箭头，切换升序/降序，重新排序表格数据，保留当前搜索和分页",
        "分页：点击分页控件页码或上一页/下一页，加载新页码的数据，保持当前筛选和排序条件",
        "导出：点击“导出当前明细”按钮，弹出导出确认或直接下载导出文件（CSV/Excel），提示导出进度",
        "返回概览：点击面包屑导航中的概览层级或“返回概览”按钮，返回概览工作台页面，保留筛选条件",
        "微调筛选条件：点击筛选条件标签旁的编辑或直接在筛选区域修改，更新筛选条件，重新加载表格数据"
      ],
      "revisionNote": "根据用户要求将页面规格转换为新结构：layoutZones, uiStates, keyInteractions"
    },
    {
      "file": "WorkspaceView.vue",
      "layoutZones": [
        {
          "zone": "顶部筛选与排序栏",
          "content": "顶部筛选与排序栏（车辆类型、作业区域、申请日期、紧急度排序）"
        },
        {
          "zone": "左侧待办申请列表区",
          "content": "左侧待办申请列表区（状态标签、超时标识、关键字段摘要）"
        },
        {
          "zone": "右侧详情与操作区",
          "content": "右侧详情与操作区（表单详情、车辆档案校验结果、通过/驳回按钮、审批意见输入框、授权码生成与同步状态反馈）"
        },
        {
          "zone": "底部操作日志快照",
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
        "点击列表项：右侧详情面板加载该申请的完整信息，包括车辆档案校验结果",
        "筛选条件变更：修改筛选条件后重新请求待办列表，更新列表数据，失败显示错误状态",
        "通过审批：点击「通过」按钮，弹出二次确认对话框（若车辆证照过期则强制确认），确认后调用审批通过接口，成功后显示授权码和同步状态，失败显示错误提示",
        "驳回审批：点击「驳回」按钮，弹出原因输入框（必填），提交后调用审批驳回接口，成功后刷新列表并关闭详情面板",
        "重新同步授权码：点击「重新同步」按钮，调用授权码同步接口，更新同步状态显示",
        "手动刷新列表：点击刷新按钮或下拉刷新，重新请求待办列表，显示加载态"
      ],
      "revisionNote": "根据用户要求将页面规格转换为新结构：layoutZones, uiStates, keyInteractions"
    },
    {
      "file": "AccessCodeView.vue",
      "layoutZones": [
        {
          "zone": "顶部状态筛选栏",
          "content": "顶部状态筛选栏（全部|同步成功|同步失败|待同步|已过期|已使用）"
        },
        {
          "zone": "授权码列表区",
          "content": "授权码列表区（车牌号、授权码、有效期、同步状态、使用时间、门岗信息）"
        },
        {
          "zone": "单条记录展开详情",
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
        "查看授权码详情：点击单条记录行或展开按钮，展开详情区域显示同步日志和重试按钮",
        "重新同步：点击重新同步按钮，按钮加载状态，请求重新同步接口，成功后刷新列表对应记录状态，失败提示错误信息",
        "搜索车牌号：输入回车或点击搜索图标，根据关键字重新加载列表数据"
      ],
      "revisionNote": "根据用户要求将页面规格转换为新结构：layoutZones, uiStates, keyInteractions"
    },
    {
      "file": "HistoryView.vue",
      "layoutZones": [
        {
          "zone": "筛选栏",
          "content": "顶部多条件筛选栏（时间范围、车辆、所属单位、作业区域、审批状态）"
        },
        {
          "zone": "历史记录列表",
          "content": "历史记录列表区（倒序展示，显示审批状态、授权码、入场/出场时间、费用）"
        },
        {
          "zone": "详情弹窗",
          "content": "单条记录展开详情或弹窗（完整操作日志、费用明细）"
        },
        {
          "zone": "导出按钮",
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
          "content": "列表数据加载中"
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
        "筛选条件变更时自动发起请求获取新列表，显示加载态",
        "点击查看详情打开详情弹窗，展示操作日志时间线和费用明细",
        "点击导出Excel确认后开始生成，显示进度条，完成后自动下载",
        "点击分页跳转目标页码，重新请求数据并更新列表"
      ]
    },
    {
      "file": "VehicleArchiveList.vue",
      "layoutZones": [
        {
          "zone": "顶部操作栏",
          "content": "顶部操作栏：新增车辆按钮、导出按钮、批量停用/启用（可选）"
        },
        {
          "zone": "筛选区",
          "content": "筛选区：车辆类型、所属单位、车辆状态、有效期状态下拉框；车牌号/司机姓名搜索框"
        },
        {
          "zone": "到期提醒横幅",
          "content": "到期提醒横幅/面板：展示临近30天到期的车辆条目列表（车辆、到期类型、剩余天数），可点击跳转编辑页"
        },
        {
          "zone": "车辆列表主体",
          "content": "车辆列表主体：展示车牌号、车辆类型、所属单位、司机、有效期状态、车辆状态；每行包含『编辑』、『停用/启用』按钮"
        },
        {
          "zone": "分页控件",
          "content": "分页控件"
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
        "点击顶部操作栏『新增车辆』按钮跳转至新增车辆页面",
        "点击顶部操作栏『导出』按钮导出当前筛选结果或全部列表为Excel文件",
        "点击顶部操作栏『批量停用』按钮弹出批量停用弹窗，选择车辆并填写停用原因后提交",
        "点击顶部操作栏『批量启用』按钮弹出确认弹窗，确认后批量启用",
        "在搜索框输入后按回车或点击搜索图标触发防抖（300ms）后请求接口刷新列表",
        "任一筛选下拉框值变化时即时触发防抖请求刷新列表",
        "点击到期提醒横幅/面板中的车辆条目跳转至对应车辆编辑页并自动定位至有效期设置区域",
        "点击列表行内『停用』按钮弹出确认弹窗，要求填写停用原因（必填），提交后刷新列表并更新提醒区域",
        "点击列表行内『启用』按钮弹出确认弹窗（无需原因），确认后刷新列表",
        "点击列表行内『编辑』按钮跳转至对应车辆编辑页"
      ]
    },
    {
      "file": "VehicleArchiveEdit.vue",
      "layoutZones": [
        {
          "zone": "页面标题",
          "content": "页面标题：『新增车辆』或『编辑车辆 - 车牌号』"
        },
        {
          "zone": "基本信息区",
          "content": "基本信息区：车辆类型（下拉）、车牌号（文本输入）、所属单位（下拉）、司机姓名、司机电话"
        },
        {
          "zone": "有效期设置区",
          "content": "有效期设置区：年检有效期、保险有效期、准入有效期三个日期选择器（可单独清除）"
        },
        {
          "zone": "证照图片管理区",
          "content": "证照图片管理区：列表展示已有证照（类型、缩略图）；操作按钮『上传』、『预览』、『替换』、『删除』；支持拖拽排序（可选）"
        },
        {
          "zone": "操作按钮区",
          "content": "操作按钮区：『保存』、『取消』；保存时触发完整校验"
        },
        {
          "zone": "操作日志摘要区",
          "content": "操作日志摘要区（只读）：显示该车辆最近操作日志的简要列表（可选，不超过4条），点击可跳转到操作日志页"
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
        "点击保存按钮执行完整校验，必填字段不能为空，日期不能早于当天；校验通过后显示提交loading，成功后跳转到列表页并刷新；失败时显示错误信息并保留输入",
        "点击取消按钮返回上一页（列表页），如果表单有未保存修改，弹出确认提示",
        "点击上传按钮弹出文件选择器，选择图片后自动上传并显示缩略图，同时要求选择证照类型",
        "点击预览按钮（或图片缩略图）弹出预览弹窗，可放大查看证照图片",
        "点击替换按钮弹出文件选择器，选择新图片后上传并替换旧图，旧图标记为历史版本，并记录操作日志",
        "点击删除按钮弹出确认弹窗，确认后删除图片并记录操作日志，缩略图移除",
        "点击操作日志摘要区的日志条目跳转到操作日志详情页，显示该车辆的所有操作日志"
      ]
    },
    {
      "file": "VehicleArchiveLogs.vue",
      "layoutZones": [
        {
          "zone": "筛选区",
          "content": "时间范围（日期选择器）、操作人（下拉或输入）、操作类型（多选下拉）、关联车辆（车牌号输入/选择）"
        },
        {
          "zone": "日志列表",
          "content": "展示时间、操作人、操作类型、关联车辆、修改内容摘要，点击行可展开详情"
        },
        {
          "zone": "导出按钮",
          "content": "点击后导出当前筛选条件下的日志为Excel文件"
        },
        {
          "zone": "分页控件",
          "content": "分页控件"
        }
      ],
      "uiStates": [
        {
          "state": "empty",
          "content": "暂无操作记录"
        },
        {
          "state": "loading",
          "content": "查询或导出进行中，显示加载动画"
        },
        {
          "state": "success",
          "content": "操作成功"
        },
        {
          "state": "error",
          "content": "查询失败或导出失败时展示错误提示"
        }
      ],
      "keyInteractions": [
        "点击导出按钮：当筛选结果条数超过最大限制（默认10万）时弹出提示要求缩小范围；否则发起POST /api/vehicles/logs/export请求并显示loading，导出完成后根据结果提示成功或失败",
        "点击日志行：展开该行下方详细区域，展示修改内容的前后JSON对比（before/after）"
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
          "usage": "调度员在派车操作时提交派车请求"
        },
        {
          "method": "GET",
          "path": "/api/alerts/realtime",
          "usage": "页面加载时获取实时告警与司机反馈数据以更新告警面板"
        },
        {
          "method": "POST",
          "path": "/api/v1/tasks/adjustment",
          "usage": "调度员在需要改派、取消或加派任务时提交调整"
        }
      ]
    },
    {
      "page": "AlertAndTaskMonitorView.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/alerts/realtime",
          "usage": "页面加载及定时刷新时获取实时告警与任务进度数据"
        },
        {
          "method": "POST",
          "path": "/api/v1/alerts/handle",
          "usage": "管理员对告警进行确认、忽略或转人工处理时提交"
        },
        {
          "method": "POST",
          "path": "/api/v1/tasks/adjustment",
          "usage": "在处理异常或干预任务执行时提交任务调整"
        }
      ]
    },
    {
      "page": "DriverTaskListView.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/driver/tasks",
          "usage": "司机进入任务列表页时根据状态筛选获取待接单、进行中、已完成任务"
        }
      ]
    },
    {
      "page": "DriverTaskExecuteView.vue",
      "apis": [
        {
          "method": "POST",
          "path": "/api/driver/tasks/{taskId}/complete",
          "usage": "司机到达作业点、完成作业后上传照片并点击完成按钮时调用"
        }
      ]
    },
    {
      "page": "MobileDispatchView.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/alerts/realtime",
          "usage": "页面加载时获取实时异常告警与司机反馈列表"
        },
        {
          "method": "POST",
          "path": "/api/v1/tasks/adjustment",
          "usage": "调度员在移动端发起改派、取消等任务调整时提交"
        }
      ]
    },
    {
      "page": "TaskAdjustView.vue",
      "apis": [
        {
          "method": "POST",
          "path": "/api/tasks/adjustment",
          "usage": "当用户提交任务调整（含改派、取消或加派）及异常处理记录时调用"
        }
      ]
    },
    {
      "page": "GateAccessCheckView.vue",
      "apis": [
        {
          "method": "POST",
          "path": "/api/gate/vehicle-action",
          "usage": "当门岗人员对指定车辆执行放行或拒绝入场操作时调用"
        }
      ]
    },
    {
      "page": "GateEntryRecordsView.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/gate/entry-records",
          "usage": "当用户加载历史入场处理记录列表，或根据条件筛选记录时调用"
        }
      ]
    },
    {
      "page": "ManagementReportsView.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/reports/overview",
          "usage": "当用户进入运营报表概览页，或切换筛选条件刷新指标卡片和趋势图时调用"
        }
      ]
    },
    {
      "page": "ReportDetailView.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/reports/detail",
          "usage": "当用户从概览下钻进入明细页，或输入搜索条件、切换分页排序时调用"
        }
      ]
    },
    {
      "page": "WorkspaceView.vue",
      "apis": [
        {
          "method": "POST",
          "path": "/api/reservations/{id}/approve",
          "usage": "审批人在待办列表点击“通过”按钮时调用，批准预约申请并触发授权码生成与门禁同步"
        }
      ]
    },
    {
      "page": "AccessCodeView.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/access-codes",
          "usage": "页面加载时调用，分页获取授权码列表，支持按同步状态筛选和车牌号搜索；后续操作如同步失败后刷新列表时也调用"
        }
      ]
    },
    {
      "page": "HistoryView.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/reservations/history",
          "usage": "页面加载时根据筛选条件分页查询历史预约记录，展示列表；点击搜索、切换页时重新调用"
        },
        {
          "method": "GET",
          "path": "/api/reports/detail",
          "usage": "用户在费用统计对账模块查看明细或导出时调用，获取按时间范围等筛选的详细费用数据"
        }
      ]
    },
    {
      "page": "VehicleArchiveList.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/vehicles",
          "usage": "页面加载时获取车辆档案列表，支持多维度筛选与搜索；用户执行停用/启用操作后刷新列表时也调用"
        },
        {
          "method": "GET",
          "path": "/api/vehicles/logs",
          "usage": "管理员查看某车辆的操作日志时调用，获取该车辆相关的变更记录"
        }
      ]
    },
    {
      "page": "VehicleArchiveEdit.vue",
      "apis": [
        {
          "method": "POST",
          "path": "/api/vehicles",
          "usage": "管理员新增车辆或保存编辑后的车辆档案时调用，提交基础信息及证照数据，新建时也可用于回填已有数据（需配合GET）"
        }
      ]
    },
    {
      "page": "VehicleArchiveLogs.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/vehicles",
          "usage": "用于加载车辆列表供用户选择筛选条件中的车辆"
        },
        {
          "method": "GET",
          "path": "/api/vehicles/logs",
          "usage": "页面加载时查询操作日志列表，支持分页和筛选条件；导出时获取全量数据"
        }
      ]
    }
  ],
  "navigationRoutes": [
    {
      "group": "调度与任务",
      "icon": "🚗",
      "routes": [
        {
          "path": "/dispatch/workbench",
          "component": "DispatchWorkbenchView.vue",
          "title": "调度工作台",
          "default": true
        },
        {
          "path": "/dispatch/alert-monitor",
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
        },
        {
          "path": "/dispatch/driver-tasks",
          "component": "DriverTaskListView.vue",
          "title": "司机任务列表",
          "default": false
        },
        {
          "path": "/dispatch/driver-execute",
          "component": "DriverTaskExecuteView.vue",
          "title": "任务执行",
          "default": false
        }
      ]
    },
    {
      "group": "门禁管理",
      "icon": "🚧",
      "routes": [
        {
          "path": "/gate/access-check",
          "component": "GateAccessCheckView.vue",
          "title": "门禁核验",
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
          "path": "/outsource/workspace",
          "component": "WorkspaceView.vue",
          "title": "预约工作台",
          "default": true
        },
        {
          "path": "/outsource/access-code",
          "component": "AccessCodeView.vue",
          "title": "授权码管理",
          "default": false
        },
        {
          "path": "/outsource/history",
          "component": "HistoryView.vue",
          "title": "预约历史",
          "default": false
        }
      ]
    },
    {
      "group": "车辆档案",
      "icon": "📁",
      "routes": [
        {
          "path": "/vehicle/archive-list",
          "component": "VehicleArchiveList.vue",
          "title": "车辆档案列表",
          "default": true
        },
        {
          "path": "/vehicle/archive-edit",
          "component": "VehicleArchiveEdit.vue",
          "title": "车辆档案编辑",
          "default": false
        },
        {
          "path": "/vehicle/archive-logs",
          "component": "VehicleArchiveLogs.vue",
          "title": "档案操作日志",
          "default": false
        }
      ]
    },
    {
      "group": "报表与统计",
      "icon": "📊",
      "routes": [
        {
          "path": "/report/management",
          "component": "ManagementReportsView.vue",
          "title": "管理报表",
          "default": true
        },
        {
          "path": "/report/detail",
          "component": "ReportDetailView.vue",
          "title": "报表明细",
          "default": false
        }
      ]
    }
  ],
  "componentFiles": [
    {
      "file": "StatusTag.vue",
      "responsibility": "根据状态类型和值显示不同颜色的标签，如任务状态、同步状态、告警严重程度等。",
      "reusedBy": [
        "DispatchWorkbenchView.vue",
        "AlertAndTaskMonitorView.vue",
        "DriverTaskListView.vue",
        "DriverTaskExecuteView.vue",
        "MobileDispatchView.vue",
        "GateAccessCheckView.vue",
        "GateEntryRecordsView.vue",
        "WorkspaceView.vue",
        "AccessCodeView.vue",
        "HistoryView.vue",
        "VehicleArchiveList.vue",
        "VehicleArchiveEdit.vue",
        "VehicleArchiveLogs.vue"
      ],
      "props": [
        {
          "name": "statusType",
          "type": "string",
          "required": true,
          "default": "default",
          "description": "状态分类，如'taskStatus','syncStatus','alertSeverity','vehicleStatus'等，用于映射颜色方案。"
        },
        {
          "name": "statusValue",
          "type": "string",
          "required": true,
          "default": "",
          "description": "具体状态值，如'待接单','同步成功','超速','启用'等。"
        },
        {
          "name": "size",
          "type": "string",
          "required": false,
          "default": "medium",
          "description": "标签尺寸：'small','medium','large'。"
        }
      ],
      "events": [],
      "slots": []
    },
    {
      "file": "FilterBar.vue",
      "responsibility": "统一定义筛选条件集合，根据传入的配置生成对应的筛选控件（下拉、日期、输入框等），筛选变更时统一触发change事件。",
      "reusedBy": [
        "DriverTaskListView.vue",
        "GateEntryRecordsView.vue",
        "ManagementReportsView.vue",
        "ReportDetailView.vue",
        "WorkspaceView.vue",
        "AccessCodeView.vue",
        "HistoryView.vue",
        "VehicleArchiveList.vue",
        "VehicleArchiveLogs.vue"
      ],
      "props": [
        {
          "name": "filters",
          "type": "array",
          "required": true,
          "default": "[]",
          "description": "筛选字段配置数组，每个元素包含：{id,label,type:'select'|'date'|'text'|'cascader',options?:[],value?:any}。"
        },
        {
          "name": "modelValue",
          "type": "object",
          "required": false,
          "default": "{}",
          "description": "当前筛选条件的值对象，支持v-model。"
        }
      ],
      "events": [
        {
          "name": "update:modelValue",
          "payload": "object",
          "description": "任一筛选条件变化时触发，携带当前所有筛选值的对象。"
        }
      ],
      "slots": [
        {
          "name": "extra",
          "description": "在筛选栏末尾插入额外操作按钮的区域。"
        }
      ]
    },
    {
      "file": "DataTable.vue",
      "responsibility": "通用表格/列表组件，支持自定义列渲染、排序、行点击、展开详情、空/加载/错误状态。",
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
          "type": "array",
          "required": true,
          "default": "[]",
          "description": "列定义数组，每个元素：{key,label,width?,sortable?,slotName?}。"
        },
        {
          "name": "data",
          "type": "array",
          "required": true,
          "default": "[]",
          "description": "表格数据数组。"
        },
        {
          "name": "loading",
          "type": "boolean",
          "required": false,
          "default": "false",
          "description": "是否处于加载状态。"
        },
        {
          "name": "emptyText",
          "type": "string",
          "required": false,
          "default": "暂无数据",
          "description": "空状态时显示的文本。"
        },
        {
          "name": "rowKey",
          "type": "string",
          "required": false,
          "default": "id",
          "description": "行数据的唯一键字段名。"
        },
        {
          "name": "pagination",
          "type": "object",
          "required": false,
          "default": "null",
          "description": "分页配置对象：{page, pageSize, total}；不传则不显示分页。"
        }
      ],
      "events": [
        {
          "name": "row-click",
          "payload": "rowData, rowIndex",
          "description": "点击行时触发，携带行数据和索引。"
        },
        {
          "name": "sort-change",
          "payload": "{key, order}",
          "description": "列排序变化时触发，携带排序列key和顺序('asc'|'desc')。"
        },
        {
          "name": "page-change",
          "payload": "page",
          "description": "分页页码变化时触发，携带新页码。"
        },
        {
          "name": "page-size-change",
          "payload": "pageSize",
          "description": "每页数量变化时触发。"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "用于自定义列渲染，作用域插槽，暴露{row, column, index}。"
        },
        {
          "name": "empty",
          "description": "自定义空状态内容。"
        }
      ]
    },
    {
      "file": "PaginationBar.vue",
      "responsibility": "独立分页组件，支持页码切换、每页条数选择、总条数展示。",
      "reusedBy": [
        "GateEntryRecordsView.vue",
        "ReportDetailView.vue",
        "HistoryView.vue",
        "VehicleArchiveList.vue",
        "VehicleArchiveLogs.vue",
        "AccessCodeView.vue"
      ],
      "props": [
        {
          "name": "page",
          "type": "number",
          "required": true,
          "default": "1",
          "description": "当前页码，支持v-model。"
        },
        {
          "name": "pageSize",
          "type": "number",
          "required": false,
          "default": "20",
          "description": "每页条数，支持v-model。"
        },
        {
          "name": "total",
          "type": "number",
          "required": true,
          "default": "0",
          "description": "总记录数。"
        },
        {
          "name": "pageSizes",
          "type": "array",
          "required": false,
          "default": "[10,20,50,100]",
          "description": "可选的每页条数选项。"
        }
      ],
      "events": [
        {
          "name": "update:page",
          "payload": "number",
          "description": "页码改变时触发。"
        },
        {
          "name": "update:pageSize",
          "payload": "number",
          "description": "每页条数改变时触发。"
        }
      ],
      "slots": []
    },
    {
      "file": "SearchInput.vue",
      "responsibility": "带搜索图标和清除按钮的输入框，支持防抖和回显。",
      "reusedBy": [
        "VehicleArchiveList.vue",
        "VehicleArchiveLogs.vue",
        "ReportDetailView.vue",
        "AccessCodeView.vue",
        "HistoryView.vue"
      ],
      "props": [
        {
          "name": "modelValue",
          "type": "string",
          "required": true,
          "default": "",
          "description": "搜索关键字，支持v-model。"
        },
        {
          "name": "placeholder",
          "type": "string",
          "required": false,
          "default": "搜索...",
          "description": "占位提示文本。"
        },
        {
          "name": "debounce",
          "type": "number",
          "required": false,
          "default": "300",
          "description": "防抖延迟毫秒数。"
        }
      ],
      "events": [
        {
          "name": "update:modelValue",
          "payload": "string",
          "description": "输入值变化时触发（已防抖）。"
        },
        {
          "name": "search",
          "payload": "string",
          "description": "用户点击搜索图标或回车时触发。"
        },
        {
          "name": "clear",
          "payload": "",
          "description": "用户点击清除按钮时触发。"
        }
      ],
      "slots": []
    },
    {
      "file": "ExportButton.vue",
      "responsibility": "提供导出操作按钮，支持加载状态、文件格式选择、导出范围选择，导出完成后触发回调。",
      "reusedBy": [
        "AlertAndTaskMonitorView.vue",
        "ManagementReportsView.vue",
        "ReportDetailView.vue",
        "HistoryView.vue",
        "VehicleArchiveList.vue",
        "VehicleArchiveLogs.vue"
      ],
      "props": [
        {
          "name": "loading",
          "type": "boolean",
          "required": false,
          "default": "false",
          "description": "是否正在导出。"
        },
        {
          "name": "formats",
          "type": "array",
          "required": false,
          "default": "['Excel']",
          "description": "可选的导出格式数组，如['Excel','PDF']。"
        },
        {
          "name": "range",
          "type": "string",
          "required": false,
          "default": "current",
          "description": "导出范围：'current'(当前筛选) 或 'all'(全部)。"
        }
      ],
      "events": [
        {
          "name": "export",
          "payload": "{format,range}",
          "description": "用户点击导出按钮并确认后触发，携带选择的格式和范围。"
        }
      ],
      "slots": []
    },
    {
      "file": "ConfirmDialog.vue",
      "responsibility": "通用确认弹窗，支持自定义标题、内容、确认/取消按钮文本，可配置额外表单或复选框。",
      "reusedBy": [
        "AlertAndTaskMonitorView.vue",
        "DriverTaskListView.vue",
        "MobileDispatchView.vue",
        "TaskAdjustView.vue",
        "GateAccessCheckView.vue",
        "WorkspaceView.vue",
        "VehicleArchiveEdit.vue"
      ],
      "props": [
        {
          "name": "visible",
          "type": "boolean",
          "required": true,
          "default": "false",
          "description": "是否显示弹窗，支持v-model。"
        },
        {
          "name": "title",
          "type": "string",
          "required": false,
          "default": "确认操作",
          "description": "弹窗标题。"
        },
        {
          "name": "confirmText",
          "type": "string",
          "required": false,
          "default": "确认",
          "description": "确认按钮文本。"
        },
        {
          "name": "cancelText",
          "type": "string",
          "required": false,
          "default": "取消",
          "description": "取消按钮文本。"
        },
        {
          "name": "loading",
          "type": "boolean",
          "required": false,
          "default": "false",
          "description": "确认按钮是否显示加载状态。"
        },
        {
          "name": "type",
          "type": "string",
          "required": false,
          "default": "warning",
          "description": "弹窗类型：'warning','danger','info'。"
        }
      ],
      "events": [
        {
          "name": "update:visible",
          "payload": "boolean",
          "description": "弹窗关闭时触发。"
        },
        {
          "name": "confirm",
          "payload": "",
          "description": "点击确认按钮时触发。"
        },
        {
          "name": "cancel",
          "payload": "",
          "description": "点击取消按钮时触发。"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "内容区域插槽，用于展示确认信息或额外表单控件。"
        }
      ]
    },
    {
      "file": "ImageUploader.vue",
      "responsibility": "支持拍照/相册选择、预览、删除、替换的多图片上传组件，可限制数量、类型和大小。",
      "reusedBy": [
        "DriverTaskExecuteView.vue",
        "VehicleArchiveEdit.vue"
      ],
      "props": [
        {
          "name": "value",
          "type": "array",
          "required": true,
          "default": "[]",
          "description": "已上传图片列表，每个元素为 {url, uid, name, type, status?}，支持v-model。"
        },
        {
          "name": "maxCount",
          "type": "number",
          "required": false,
          "default": "9",
          "description": "最大上传图片数量。"
        },
        {
          "name": "accept",
          "type": "string",
          "required": false,
          "default": "image/*",
          "description": "允许的文件MIME类型。"
        },
        {
          "name": "disabled",
          "type": "boolean",
          "required": false,
          "default": "false",
          "description": "是否禁用上传。"
        }
      ],
      "events": [
        {
          "name": "update:value",
          "payload": "array",
          "description": "图片列表变化时触发（上传、删除、替换后）。"
        },
        {
          "name": "preview",
          "payload": "imageItem",
          "description": "点击图片预览时触发，可交由父组件打开预览弹窗。"
        },
        {
          "name": "error",
          "payload": "errorMessage",
          "description": "上传出错时触发。"
        }
      ],
      "slots": [
        {
          "name": "upload-trigger",
          "description": "自定义上传触发区域，默认是加号按钮。"
        }
      ]
    }
  ],
  "mockDataFiles": [
    {
      "file": "mockDispatch.js",
      "content": "模拟派车调度相关数据，包括派车确认、任务调整、工作台首页数据",
      "usedBy": [
        "DispatchWorkbenchView.vue",
        "TaskAdjustView.vue",
        "MobileDispatchView.vue"
      ],
      "schema": [
        {
          "field": "taskId",
          "type": "string",
          "description": "任务唯一标识"
        },
        {
          "field": "demandId",
          "type": "string",
          "description": "用车需求ID"
        },
        {
          "field": "vehicleId",
          "type": "string",
          "description": "车辆ID"
        },
        {
          "field": "driverId",
          "type": "string",
          "description": "司机ID"
        },
        {
          "field": "status",
          "type": "string",
          "description": "任务状态：pending（待接单）/inProgress（进行中）/completed（已完成）/cancelled（已取消）"
        },
        {
          "field": "dispatchTime",
          "type": "string",
          "description": "派车时间，ISO 8601格式"
        },
        {
          "field": "dispatchNote",
          "type": "string",
          "description": "派车备注"
        },
        {
          "field": "operationType",
          "type": "string",
          "description": "任务调整类型：reassign/cancel/add"
        }
      ]
    },
    {
      "file": "mockAlerts.js",
      "content": "模拟车辆异常告警及司机反馈数据，用于实时告警监控与处理",
      "usedBy": [
        "AlertAndTaskMonitorView.vue"
      ],
      "schema": [
        {
          "field": "alertId",
          "type": "string",
          "description": "告警唯一标识"
        },
        {
          "field": "vehicleId",
          "type": "string",
          "description": "关联车辆ID"
        },
        {
          "field": "alertType",
          "type": "string",
          "description": "告警类型：speeding（超速）/zone_entry（禁入）/abnormal_stay（异常停留）/driver_feedback（司机反馈）"
        },
        {
          "field": "urgencyLevel",
          "type": "string",
          "description": "紧急程度：high/medium/low"
        },
        {
          "field": "alertTime",
          "type": "string",
          "description": "告警发生时间，ISO 8601格式"
        },
        {
          "field": "status",
          "type": "string",
          "description": "处理状态：pending/confirmed/ignored/transferred"
        },
        {
          "field": "remark",
          "type": "string",
          "description": "处理备注"
        }
      ]
    },
    {
      "file": "mockDriver.js",
      "content": "模拟司机端任务数据，包括任务列表和任务执行详情",
      "usedBy": [
        "DriverTaskListView.vue",
        "DriverTaskExecuteView.vue"
      ],
      "schema": [
        {
          "field": "taskId",
          "type": "string",
          "description": "任务唯一标识"
        },
        {
          "field": "demandId",
          "type": "string",
          "description": "用车需求ID"
        },
        {
          "field": "vehicleId",
          "type": "string",
          "description": "车辆ID"
        },
        {
          "field": "status",
          "type": "string",
          "description": "任务状态：pending（待接单）/inProgress（进行中）/completed（已完成）"
        },
        {
          "field": "startLocation",
          "type": "string",
          "description": "起始地点"
        },
        {
          "field": "endLocation",
          "type": "string",
          "description": "目的地"
        },
        {
          "field": "estimatedTime",
          "type": "string",
          "description": "预计完成时间，ISO 8601格式"
        },
        {
          "field": "completedTime",
          "type": "string",
          "description": "实际完成时间，ISO 8601格式"
        }
      ]
    },
    {
      "file": "mockGate.js",
      "content": "模拟门禁核验和入场记录数据",
      "usedBy": [
        "GateAccessCheckView.vue",
        "GateEntryRecordsView.vue"
      ],
      "schema": [
        {
          "field": "recordId",
          "type": "string",
          "description": "入场记录唯一标识"
        },
        {
          "field": "vehicleId",
          "type": "string",
          "description": "车辆ID"
        },
        {
          "field": "plateNumber",
          "type": "string",
          "description": "车牌号"
        },
        {
          "field": "action",
          "type": "string",
          "description": "操作类型：allow（放行）/reject（拒绝）"
        },
        {
          "field": "reason",
          "type": "string",
          "description": "拒绝原因分类：黑名单/证照过期/无预约/车辆不符/其他"
        },
        {
          "field": "operationTime",
          "type": "string",
          "description": "操作时间，ISO 8601格式"
        },
        {
          "field": "syncStatus",
          "type": "string",
          "description": "同步状态：PENDING/SYNCING/SYNCED/FAILED"
        }
      ]
    },
    {
      "file": "mockReservation.js",
      "content": "模拟预约申请、授权码和历史预约数据",
      "usedBy": [
        "WorkspaceView.vue",
        "AccessCodeView.vue",
        "HistoryView.vue"
      ],
      "schema": [
        {
          "field": "reservationId",
          "type": "string",
          "description": "预约申请ID"
        },
        {
          "field": "vehicleId",
          "type": "string",
          "description": "车辆ID"
        },
        {
          "field": "plateNumber",
          "type": "string",
          "description": "车牌号"
        },
        {
          "field": "status",
          "type": "string",
          "description": "审批状态：pending_approval/approved/rejected"
        },
        {
          "field": "accessCode",
          "type": "string",
          "description": "授权码"
        },
        {
          "field": "syncStatus",
          "type": "string",
          "description": "授权码同步状态：SYNC_SUCCESS/SYNC_FAIL/PENDING_SYNC/EXPIRED/USED"
        },
        {
          "field": "entryTime",
          "type": "string",
          "description": "入场时间，ISO 8601格式"
        },
        {
          "field": "exitTime",
          "type": "string",
          "description": "出场时间，ISO 8601格式"
        }
      ]
    },
    {
      "file": "mockVehicles.js",
      "content": "模拟车辆档案和操作日志数据",
      "usedBy": [
        "VehicleArchiveList.vue",
        "VehicleArchiveEdit.vue",
        "VehicleArchiveLogs.vue"
      ],
      "schema": [
        {
          "field": "vehicleId",
          "type": "string",
          "description": "车辆唯一标识"
        },
        {
          "field": "plateNumber",
          "type": "string",
          "description": "车牌号"
        },
        {
          "field": "vehicleType",
          "type": "string",
          "description": "车辆类型：生产车辆/物流车辆/外协车辆/临时车辆"
        },
        {
          "field": "department",
          "type": "string",
          "description": "所属单位"
        },
        {
          "field": "driverName",
          "type": "string",
          "description": "司机姓名"
        },
        {
          "field": "status",
          "type": "string",
          "description": "车辆状态：正常/停用"
        },
        {
          "field": "expireStatus",
          "type": "string",
          "description": "有效期状态：正常/临近到期/已过期"
        },
        {
          "field": "logAction",
          "type": "string",
          "description": "操作类型：新增/编辑/停用/启用/上传证照/删除证照"
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
      "prompt": "请根据以下项目上下文和原型设计，生成所有页面的 Mock 数据文件和枚举常量。\n\n项目名称：车辆管理-HG海工基地\n\n上下文：系统需要实现车辆、司机、任务、物资、门禁的一体化管理，包含调度员、司机、现场调度员、门岗、管理人员、外协申请者、管理员7个角色。\n\n要求：\n1. 生成以下 Mock 数据文件（JSON 格式，存储在 src/mock/ 目录）：\n   - mockDispatch.js：模拟派车调度相关数据，包括派车确认、任务调整、工作台首页数据。字段：taskId, demandId, vehicleId, driverId, status(pending/inProgress/completed/cancelled), dispatchTime, dispatchNote, operationType(reassign/cancel/add)。\n   - mockAlerts.js：模拟车辆异常告警及司机反馈数据。字段：alertId, vehicleId, alertType(speeding/zone_entry/abnormal_stay/driver_feedback), urgencyLevel(high/medium/low), alertTime, status(pending/confirmed/ignored/transferred), remark。\n   - mockDriver.js：模拟司机端任务数据。字段：taskId, demandId, vehicleId, status(pending/inProgress/completed), startLocation, endLocation, estimatedTime, completedTime。\n   - mockGate.js：模拟门禁核验和入场记录数据。字段：recordId, vehicleId, plateNumber, action(allow/reject), reason(黑名单/证照过期/无预约/车辆不符/其他), operationTime, syncStatus(PENDING/SYNCING/SYNCED/FAILED)。\n   - mockReservation.js：模拟预约申请、授权码和历史预约数据。字段：reservationId, vehicleId, plateNumber, status(pending_approval/approved/rejected), accessCode, syncStatus(SYNC_SUCCESS/SYNC_FAIL/PENDING_SYNC/EXPIRED/USED), entryTime, exitTime。\n   - mockVehicles.js：模拟车辆档案和操作日志数据。字段：vehicleId, plateNumber, vehicleType(生产车辆/物流车辆/外协车辆/临时车辆), department, driverName, status(正常/停用), expireStatus(正常/临近到期/已过期), logAction(新增/编辑/停用/启用/上传证照/删除证照)。\n\n2. 生成枚举常量文件 src/constants/enums.js，定义以下枚举：\n   - TaskStatus: { PENDING: '待接单', IN_PROGRESS: '进行中', COMPLETED: '已完成', CANCELLED: '已取消' }\n   - AlertSeverity: { HIGH: '高', MEDIUM: '中', LOW: '低' }\n   - AlertStatus: { PENDING: '待处理', CONFIRMED: '已确认', IGNORED: '已忽略', TRANSFERRED: '已转人工' }\n   - GateAction: { ALLOW: '放行', REJECT: '拒绝' }\n   - SyncStatus: { PENDING: '待同步', SYNCING: '同步中', SYNCED: '已同步', FAILED: '同步失败' }\n   - AccessCodeStatus: { SYNC_SUCCESS: '同步成功', SYNC_FAIL: '同步失败', PENDING_SYNC: '待同步', EXPIRED: '已过期', USED: '已使用' }\n   - VehicleStatus: { NORMAL: '正常', DISABLED: '停用' }\n   - VehicleType: { PRODUCTION: '生产车辆', LOGISTICS: '物流车辆', OUTSOURCE: '外协车辆', TEMPORARY: '临时车辆' }\n   - ExpireStatus: { NORMAL: '正常', EXPIRING: '临近到期', EXPIRED: '已过期' }\n   - OperationType: { REASSIGN: '改派', CANCEL: '取消', ADD: '加派' }\n\n3. 这些 mock 数据采用 ES Module 导出，每个文件导出一个名为 `mockXXX` 的函数，返回包含随机生成数据的数组（每类数据至少5条示例）。枚举常量使用 export const 导出。\n\n验收标准：\n- 每个 mock 文件包含 schema 中声明的所有字段，数据类型正确。\n- 枚举常量与后端定义保持一致，并可直接在业务代码中引用。\n- mock 数据可独立运行，不依赖前端框架。"
    },
    {
      "step": 2,
      "title": "生成通用组件",
      "prompt": "请基于以下组件接口契约，生成所有通用组件的 Vue 3 实现（使用 Composition API 和 TypeScript）。组件文件统一放在 src/components/common/ 目录。\n\n技术要求：\n- 使用 Vue 3 + TypeScript + Script Setup\n- 支持 v-model 双向绑定（如适用）\n- 组件中要处理空状态、加载状态、错误状态（通过 props 控制）\n- 样式使用 scoped CSS，支持通过 props 自定义颜色/尺寸\n- 每个组件需导出 props 类型定义\n\n需要生成的组件列表：\n\n1. StatusTag.vue\n   - props: statusType (string, required), statusValue (string, required), size ('small'|'medium'|'large', default 'medium')\n   - 功能：根据 statusType 和 statusValue 映射颜色方案，例如 taskStatus 映射：待接单灰色，进行中蓝色，已完成绿色，已取消红色。\n   - 无事件和插槽。\n\n2. FilterBar.vue\n   - props: filters (array, required): 每个元素 {id, label, type: 'select'|'date'|'text'|'cascader', options?, value?}; modelValue (object, 支持 v-model)\n   - 事件：update:modelValue (object)\n   - 插槽：extra 用于在栏末尾添加按钮\n   - 功能：根据 filters 配置渲染对应的筛选控件，任一变化时触发 update:modelValue。\n\n3. DataTable.vue\n   - props: columns (array, required): {key, label, width?, sortable?, slotName?}; data (array); loading (boolean); emptyText (string, default '暂无数据'); rowKey (string, default 'id'); pagination (object|null): {page, pageSize, total}\n   - 事件：row-click (rowData, rowIndex); sort-change ({key, order}); page-change (page); page-size-change (pageSize)\n   - 插槽：default 作用域 {row, column, index} 用于自定义列渲染；empty 自定义空状态\n   - 功能：表格展示，支持排序、分页、展开详情（通过 row-click 传递）。\n\n4. PaginationBar.vue\n   - props: page (number, v-model), pageSize (number, default 20), total (number), pageSizes (array, default [10,20,50,100])\n   - 事件：update:page, update:pageSize\n   - 功能：独立分页控件，显示总条数和页码。\n\n5. SearchInput.vue\n   - props: modelValue (string, v-model), placeholder (string, default '搜索...'), debounce (number, default 300)\n   - 事件：update:modelValue (已防抖), search (string, 回车或点击搜索图标), clear\n   - 功能：带搜索图标和清除按钮的输入框，防抖后触发 update:modelValue。\n\n6. ExportButton.vue\n   - props: loading (boolean), formats (array, default ['Excel']), range ('current'|'all', default 'current')\n   - 事件：export ({format, range})\n   - 功能：导出按钮，可显示加载状态，点击后触发 export 事件。\n\n7. ConfirmDialog.vue\n   - props: visible (boolean, v-model), title (string, default '确认操作'), confirmText (string, default '确认'), cancelText (string, default '取消'), loading (boolean), type ('warning'|'danger'|'info', default 'warning')\n   - 事件：update:visible, confirm, cancel\n   - 插槽：default 用于展示额外内容\n   - 功能：通用确认弹窗，支持加载状态。\n\n8. ImageUploader.vue\n   - props: value (array, v-model): 每项 {url, uid, name, type, status?}; maxCount (number, default 9); accept (string, default 'image/*'); disabled (boolean)\n   - 事件：update:value, preview (imageItem), error (errorMessage)\n   - 插槽：upload-trigger 自定义上传触发区域\n   - 功能：支持拍照/相册选择、预览、删除、替换的多图片上传组件。\n\n验收标准：\n- 每个组件均使用 TypeScript 严格类型定义。\n- 组件内部正确处理空/加载/错误状态，并对外暴露必要的状态。\n- 样式兼容 PC 端和移动端（响应式，移动端默认全宽）。\n- 组件可独立运行，有默认导出。"
    },
    {
      "step": 3,
      "title": "生成页面（按优先级 P0→P1→P2）",
      "prompt": "请基于以下页面规范，生成所有页面的 Vue 3 实现。页面文件放在 src/views/ 目录，按模块划分子文件夹（dispatch, gate, outsource, vehicle, report）。每个页面必须包含 zones、states、keyInteractions 中定义的所有实现。\n\n技术要求：\n- 使用 Vue 3 + TypeScript + Composition API\n- 页面引用通用组件（StatusTag, FilterBar, DataTable, PaginationBar, SearchInput, ExportButton, ConfirmDialog, ImageUploader），从 '@/components/common/' 导入\n- 页面使用 Mock 数据（未接真实 API 时，从 '@/mock/' 导入并使用），加载状态模拟 500ms 延迟\n- 页面要处理四种状态：empty（无数据）、loading（加载中）、success（正常）、error（接口失败），并在状态变化时展示对应 UI\n- 移动端适配：页面在移动端宽度自适应，使用弹性布局\n- 所有 keyInteractions 均需实现交互逻辑，包括 API 调用（模拟）\n\n按优先级生成：\nP0（必选）：\n- DispatchWorkbenchView.vue（调度工作台）：地图区域、状态看板、需求列表、派车操作面板；状态：empty/loading/success/error；交互：地图点击车辆、看板分类筛选、派车确认、框选车辆\n- AlertAndTaskMonitorView.vue（告警与任务监控）：告警列表、处理弹窗、任务列表、任务详情抽屉；状态：empty/loading/success/error；交互：确认/忽略/转人工告警、催办/取消任务、导出\n- DriverTaskListView.vue（司机任务列表）：顶部筛选栏、任务卡片列表、底部导航、未读角标；状态：empty/loading/success/error；交互：下拉刷新、点击卡片跳转、确认接单、切换筛选\n- DriverTaskExecuteView.vue（任务执行）：任务信息卡片、操作按钮（导航/到达/完成）、照片上传、异常反馈；状态：empty/loading/success/error；交互：导航、拨号、查看物资、到达确认、完成确认（上传照片）、提交异常反馈\n- WorkspaceView.vue（预约工作台）：筛选排序栏、待办列表、详情操作区、操作日志快照；状态：empty/loading/success/error/overdue_warning；交互：点击列表项、筛选、通过/驳回审批、重新同步、手动刷新\n- GateAccessCheckView.vue（门禁核验）：状态栏、待核验列表、核验详情操作区、底部日志；状态：empty/loading/success/error；交互：选择车辆、放行、手动放行、拒绝、异常原因提交、降级操作、筛选\n\nP1（重要）：\n- MobileDispatchView.vue（移动调度）：告警反馈滚动通知、车辆地图/列表、底部浮动栏、即时通讯面板；状态：empty/loading/success/error；交互：点击告警、点击车辆标记、通讯按钮、切换视图、下拉刷新、改派/取消/新增任务\n- TaskAdjustView.vue（任务调整）：任务车辆摘要、操作类型选择、表单区、异常处理记录、提交确认；状态：empty/loading/success/error；交互：选择操作类型、司机关联选择、作业点选择、提交确认（二次确认）\n- GateEntryRecordsView.vue（入场记录）：筛选栏、记录列表、详情弹窗；状态：empty/loading/success/error；交互：筛选条件变更、重新同步、查看详情\n- ManagementReportsView.vue（管理报表）：顶部筛选、指标卡片、趋势图、导出区；状态：empty/loading/success/error；交互：筛选查询、点击卡片下钻、切换指标/粒度、导出\n- ReportDetailView.vue（报表明细）：面包屑、筛选标签、明细标签页、表格、导出；状态：empty/loading/success/error；交互：切换明细类型、搜索、排序、分页、导出、返回概览\n- AccessCodeView.vue（授权码管理）：状态筛选、列表、展开详情；状态：empty/loading/success/error；交互：切换筛选、查看详情、重新同步、搜索\n- VehicleArchiveList.vue（车辆档案列表）：顶部操作栏、筛选区、到期提醒横幅、列表、分页；状态：empty/loading/success/error；交互：新增/导出/批量操作、搜索、筛选、停用/启用\n- VehicleArchiveEdit.vue（车辆档案编辑）：基本信息、有效期设置、证照图片管理、操作按钮、日志摘要；状态：empty/loading/success/error；交互：保存（校验）、取消、上传/预览/替换/删除图片、操作日志跳转\n\nP2（可选）：\n- HistoryView.vue（预约历史）：筛选栏、历史记录列表、详情弹窗、导出；状态：empty/loading/success/error；交互：筛选、查看详情、导出、分页\n- VehicleArchiveLogs.vue（档案操作日志）：筛选区、日志列表、导出、分页；状态：empty/loading/success/error；交互：导出、点击日志行展开前后对比\n\n验收标准：\n- 每个页面都要包含完整的 zones、四种状态的 UI 展示。\n- 所有 keyInteractions 实现为可交互的 Vue 方法，并在模板中绑定事件。\n- 页面之间支持通过 vue-router 导航（使用 useRouter 的 push 方法）。\n- 使用 TypeScript 类型定义 props 和 emits。\n- 移动端布局良好，无水平溢出。\n- 所有异步操作显示加载状态，失败时提示错误。"
    },
    {
      "step": 4,
      "title": "生成路由配置和 API 调用层",
      "prompt": "请生成完整的路由配置文件和 API 调用层代码。\n\n1. 路由配置：在 src/router/index.ts 中配置 vue-router 路由，使用 createRouter 和 createWebHistory。包含以下路由：\n   - 默认重定向到 /dispatch/workbench\n   - 调度与任务模块：\n     * /dispatch/workbench -> DispatchWorkbenchView\n     * /dispatch/alert-monitor -> AlertAndTaskMonitorView\n     * /dispatch/mobile -> MobileDispatchView\n     * /dispatch/task-adjust -> TaskAdjustView\n     * /dispatch/driver-tasks -> DriverTaskListView\n     * /dispatch/driver-execute -> DriverTaskExecuteView\n   - 门禁管理模块：\n     * /gate/access-check -> GateAccessCheckView\n     * /gate/entry-records -> GateEntryRecordsView\n   - 外协管理模块：\n     * /outsource/workspace -> WorkspaceView\n     * /outsource/access-code -> AccessCodeView\n     * /outsource/history -> HistoryView\n   - 车辆档案模块：\n     * /vehicle/archive-list -> VehicleArchiveList\n     * /vehicle/archive-edit -> VehicleArchiveEdit\n     * /vehicle/archive-logs -> VehicleArchiveLogs\n   - 报表与统计模块：\n     * /report/management -> ManagementReportsView\n     * /report/detail -> ReportDetailView\n   - 每个路由需配置 name（驼峰命名）、meta（包括 title、group、icon、roles）。\n   - 路由使用懒加载：component: () => import('@/views/...')\n\n2. API 调用层：在 src/api/ 目录下生成以下模块，每个模块导出对应接口函数（使用异步函数，内部调用 fetch 或 axios，但当前返回 Mock 数据）：\n   - dispatch.ts:\n     * postTaskDispatch(data) -> POST /api/v1/tasks/dispatch\n     * getAlertsRealtime() -> GET /api/alerts/realtime\n     * postTaskAdjustment(data) -> POST /api/v1/tasks/adjustment\n   - driver.ts:\n     * getDriverTasks(status) -> GET /api/driver/tasks\n     * postTaskAccept(taskId) -> POST /api/driver/tasks/{taskId}/accept\n     * postTaskArrive(taskId) -> POST /api/driver/tasks/{taskId}/arrive\n     * postTaskComplete(taskId, photos) -> POST /api/driver/tasks/{taskId}/complete\n     * postDriverFeedback(data) -> POST /api/driver/feedback\n   - gate.ts:\n     * postGateVehicleAction(data) -> POST /api/gate/vehicle-action\n     * getGateEntryRecords(params) -> GET /api/gate/entry-records\n     * postGateEntryRecordSync(recordId) -> POST /api/gate/entry-records/{recordId}/sync\n   - reservation.ts:\n     * getReservationsList(params) -> GET /api/reservations\n     * postReservationApprove(id, data) -> POST /api/reservations/{id}/approve\n     * postReservationReject(id, data) -> POST /api/reservations/{id}/reject\n     * getReservationsHistory(params) -> GET /api/reservations/history\n     * getAccessCodes(params) -> GET /api/access-codes\n     * postAccessCodeSync(codeId) -> POST /api/access-codes/{codeId}/sync\n   - vehicle.ts:\n     * getVehicles(params) -> GET /api/vehicles\n     * postVehicle(data) -> POST /api/vehicles\n     * putVehicle(id, data) -> PUT /api/vehicles/{id}\n     * patchVehicleStatus(id, data) -> PATCH /api/vehicles/{id}/status\n     * getVehicleLogs(params) -> GET /api/vehicles/logs\n     * postVehicleLogsExport(params) -> POST /api/vehicles/logs/export\n   - report.ts:\n     * getReportOverview(params) -> GET /api/reports/overview\n     * getReportDetail(params) -> GET /api/reports/detail\n     * postReportExport(params) -> POST /api/reports/export\n\n每个 API 函数先返回 Mock 数据（延迟 300ms），但注释中保留真实的 API 接口路径和请求体格式。\n\n3. 在 src/api/index.ts 中统一导出所有 API 模块。\n\n验收标准：\n- 路由配置完整，覆盖所有页面，懒加载正确。\n- API 函数参数和返回值类型使用 TypeScript 定义。\n- API 调用层可 mock 数据，方便前端独立开发。\n- 路由的 meta 信息包含 roles 字段（后续用于权限控制）。"
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
  "savedAt": "2026-07-04T04:50:02.958Z"
}
```
<!-- FDE_STEP_RESULT_JSON_END -->
