# 03 交互与API

- 步骤标识：`interactionapi`
- 保存时间：2026-07-03T13:59:14.013439+00:00
- 用途：作为下一步工作台的输入来源。

## 内容摘要

- **接口**：派车确认

## 结构化数据

<!-- FDE_STEP_RESULT_JSON_START -->
```json
{
  "generatedPagesByKey": {
    "sc-1-page-1-0": {
      "key": "sc-1-page-1-0",
      "name": "调度员实时调度派车工作台",
      "vueFile": "DispatchWorkbenchView.vue",
      "goal": "调度员集中管理实时车辆状态、接收用车需求、执行派车操作，以地图和状态看板为核心支撑高效调度。",
      "features": [
        "车辆实时地图监控",
        "车辆状态看板",
        "用车需求管理",
        "智能派车操作面板"
      ],
      "sections": [
        "地图区域（左侧主区域）：显示车辆位置、状态、轨迹，支持缩放和点击弹窗",
        "状态看板区域（右侧顶部）：卡片式统计空闲/任务中/排队/异常车辆数量，可点击筛选",
        "需求列表区域（右侧中部）：展示待处理用车需求（含生产计划推送），支持排序和派车按钮",
        "派车操作面板（右侧底部/浮动弹窗）：选择车辆、确认派车、查看推荐车辆详情"
      ],
      "fields": [
        {
          "name": "vehicleMap",
          "label": "车辆实时地图",
          "type": "map",
          "required": true,
          "description": "显示车辆位置、状态、轨迹，支持缩放、点击弹窗、框选筛选"
        },
        {
          "name": "statusCard",
          "label": "车辆状态看板",
          "type": "cardGroup",
          "required": true,
          "description": "卡片式统计空闲/任务中/排队/异常车辆数量，可点击筛选"
        },
        {
          "name": "demandList",
          "label": "用车需求列表",
          "type": "table",
          "required": true,
          "description": "展示待处理用车需求，支持排序、筛选、查看详情和派车按钮"
        },
        {
          "name": "dispatchPanel",
          "label": "派车操作面板",
          "type": "dialog",
          "required": false,
          "description": "选择车辆、确认派车、查看推荐车辆详情，可浮动打开"
        },
        {
          "name": "vehicleInfoPopup",
          "label": "车辆信息弹窗",
          "type": "popup",
          "required": false,
          "description": "地图点击车辆弹出车牌、司机、速度、任务等信息"
        }
      ],
      "actions": [
        {
          "label": "地图点击车辆",
          "trigger": "click on vehicle marker",
          "feedback": "显示车辆信息弹窗，包含车牌、司机、速度、任务"
        },
        {
          "label": "状态看板点击分类",
          "trigger": "click on status card",
          "feedback": "跳转至对应车辆列表并在地图高亮该分类车辆"
        },
        {
          "label": "需求列表点击派车",
          "trigger": "click on dispatch button in demand row",
          "feedback": "打开派车操作面板，自动推荐可用车辆"
        },
        {
          "label": "派车面板确认派车",
          "trigger": "click on confirm button",
          "feedback": "刷新地图和看板状态，推送消息给司机"
        },
        {
          "label": "地图框选车辆",
          "trigger": "box select on map",
          "feedback": "筛选框内车辆并同步至看板和需求列表"
        },
        {
          "label": "异常状态突出显示",
          "trigger": "超速>30km/h或禁入区域触发",
          "feedback": "车辆图标闪烁并显示告警标记，地图高亮区域"
        }
      ],
      "validations": [
        "派车时需至少选择一辆可用车辆",
        "需求列表无数据时禁用派车按钮",
        "地图加载失败时显示重试按钮",
        "GPS数据中断时地图显示离线标记"
      ],
      "states": {
        "empty": "无车辆在线或无可调度车辆时，地图显示空区域提示，看板显示0，需求列表显示'暂无待处理需求'",
        "loading": "初次加载或数据刷新时，地图和列表显示骨架屏或加载动画",
        "success": "正常态：地图加载车辆位置、看板显示统计数据、需求列表有数据、派车面板就绪",
        "error": "接口超时或数据异常时，显示错误提示和重试按钮；GPS数据中断时地图显示车辆离线标记"
      },
      "generatedAt": "2026-07-03T03:41:18.126Z"
    },
    "sc-1-page-2-1": {
      "key": "sc-1-page-2-1",
      "name": "异常告警与任务跟踪看板",
      "vueFile": "AlertAndTaskMonitorView.vue",
      "goal": "实时监控车辆异常告警（超速、禁入、异常停留）并处理，同时跟踪已派发任务的执行进度，支持干预操作。",
      "features": [
        "异常告警分级处理",
        "任务下发记录与状态跟踪"
      ],
      "sections": [
        "告警列表区域（左侧）：按时间倒序展示告警事件，支持状态筛选和严重程度颜色标识",
        "告警处理弹窗（点击告警后弹出）：展示告警详情、车辆信息、位置，提供确认/忽略/转人工按钮及备注输入",
        "任务列表区域（右侧）：展示所有已派发任务的状态和进度，支持筛选和查看详情",
        "任务详情抽屉（点击任务后展开）：显示任务步骤时间戳、司机操作记录、现场照片、关联告警记录"
      ],
      "fields": [
        {
          "name": "alertHandleRemark",
          "label": "处理备注",
          "type": "textarea",
          "required": false,
          "description": "告警处理时的备注信息"
        },
        {
          "name": "taskCancelReason",
          "label": "取消原因",
          "type": "textarea",
          "required": true,
          "description": "取消任务的必填原因"
        }
      ],
      "actions": [
        {
          "label": "确认告警",
          "trigger": "点击告警详情弹窗中的确认按钮",
          "feedback": "调用POST /api/v1/alerts/handle，成功后更新告警状态为已处理，列表刷新"
        },
        {
          "label": "忽略告警",
          "trigger": "点击告警详情弹窗中的忽略按钮",
          "feedback": "调用POST /api/v1/alerts/handle，成功后告警标记为已忽略，列表刷新"
        },
        {
          "label": "转人工",
          "trigger": "点击告警详情弹窗中的转人工按钮",
          "feedback": "调用POST /api/v1/alerts/handle，状态转为转人工，提示操作成功"
        },
        {
          "label": "催办任务",
          "trigger": "点击任务详情中的催办按钮",
          "feedback": "调用POST /api/v1/tasks/remind，弹出提示已发送催办通知"
        },
        {
          "label": "取消任务",
          "trigger": "点击任务详情中的取消按钮",
          "feedback": "弹出确认对话框，要求填写取消原因，调用POST /api/v1/tasks/cancel，成功后任务状态更新"
        },
        {
          "label": "导出Excel",
          "trigger": "点击告警列表或任务列表的导出按钮（预留）",
          "feedback": "触发文件下载，导出当前筛选条件下的数据"
        },
        {
          "label": "地图定位",
          "trigger": "点击告警列表项",
          "feedback": "弹窗展示告警详情，同时在地图上定位车辆位置（假设通过路由参数或事件）"
        },
        {
          "label": "筛选告警状态",
          "trigger": "选择告警状态筛选下拉框",
          "feedback": "重新加载告警列表，根据选中状态过滤"
        },
        {
          "label": "筛选任务状态",
          "trigger": "选择任务状态筛选下拉框",
          "feedback": "重新加载任务列表，根据选中状态过滤"
        }
      ],
      "validations": [
        "取消任务原因不能为空",
        "备注长度不超过500字符"
      ],
      "states": {
        "empty": "告警列表显示“暂无告警”，任务列表显示“暂无任务”，无数据时展示空态占位",
        "loading": "数据加载时列表显示骨架屏，避免页面跳动",
        "success": "数据加载成功，正常展示列表",
        "error": "数据获取失败时，列表区域显示错误提示，并提供重试按钮"
      },
      "generatedAt": "2026-07-03T03:42:08.565Z"
    },
    "sc-2-page-1-0": {
      "key": "sc-2-page-1-0",
      "name": "司机移动端任务列表",
      "vueFile": "DriverTaskListView.vue",
      "goal": "司机查看并确认接单，管理待接单、进行中、已完成的任务",
      "features": [
        "任务列表与接单确认"
      ],
      "sections": [
        "顶部状态筛选栏（全部/待接单/进行中/已完成）",
        "任务卡片列表区（每项显示任务ID、作业点名称、预计时间、车牌、状态标签）",
        "底部导航栏（回到工作台等）",
        "未读推送通知角标"
      ],
      "fields": [
        {
          "name": "status",
          "label": "任务状态筛选",
          "type": "select",
          "required": false,
          "description": "选择筛选条件：全部、待接单、进行中、已完成"
        }
      ],
      "actions": [
        {
          "label": "下拉刷新",
          "trigger": "用户下拉列表",
          "feedback": "显示加载动画，调用GET /api/driver/tasks?status=当前筛选条件，刷新列表"
        },
        {
          "label": "点击任务卡片",
          "trigger": "用户点击卡片",
          "feedback": "跳转至DriverTaskExecuteView.vue，携带taskId"
        },
        {
          "label": "确认接单",
          "trigger": "用户点击待接单任务上的确认接单按钮",
          "feedback": "弹出确认对话框，调用POST /api/driver/tasks/{taskId}/accept，成功后卡片状态变为进行中并刷新列表；若失败则显示错误提示"
        },
        {
          "label": "切换筛选",
          "trigger": "用户点击顶部状态筛选标签（全部/待接单/进行中/已完成）",
          "feedback": "更新筛选条件，重新加载对应状态的任务列表"
        },
        {
          "label": "点击推送通知",
          "trigger": "用户点击通知角标或推送消息",
          "feedback": "跳转至对应任务详情页（若未读，标记已读）"
        }
      ],
      "validations": [
        "确认接单前需确保用户已登录且身份为司机",
        "进行中任务不可重复点击确认接单",
        "推送通知接收需确保网络在线（无需离线缓存）"
      ],
      "states": {
        "empty": "当任务列表为空时，显示空状态提示文字（如'暂无任务'）及插图，底部导航栏保留",
        "loading": "首次加载或下拉刷新时显示加载动画（骨架屏或转圈）",
        "success": "正常展示任务卡片列表，支持滚动",
        "error": "网络请求失败时显示错误提示（如'网络异常，请重试'）及重试按钮，点击重试重新加载"
      },
      "generatedAt": "2026-07-03T03:43:16.592Z"
    },
    "sc-2-page-2-1": {
      "key": "sc-2-page-2-1",
      "name": "司机移动端任务执行",
      "vueFile": "DriverTaskExecuteView.vue",
      "goal": "司机查看任务完整详情、导航到作业点、确认到达与完成、发起异常反馈",
      "features": [
        "任务详情与导航启动",
        "任务到达与完成确认",
        "异常反馈与协助请求"
      ],
      "sections": [
        "顶部导航栏（返回按钮、任务ID、状态标签）",
        "任务信息卡片区（作业点名称/地址/经纬度、预计时间、关联物资提货单号、车牌、司机手机号、调度员联系电话）",
        "操作按钮区（导航按钮、到达确认按钮、完成确认按钮）",
        "照片上传区域（拍照/相册选择、预览、删除）",
        "异常反馈入口（按钮，点击后弹出反馈表单）",
        "历史反馈记录列表（可展开查看）"
      ],
      "fields": [
        {
          "name": "taskId",
          "label": "任务ID",
          "type": "text",
          "required": false,
          "description": "任务唯一标识，从列表页跳转传入，仅展示不可编辑"
        },
        {
          "name": "jobPointName",
          "label": "作业点名称",
          "type": "text",
          "required": false,
          "description": "作业点名称，从任务详情接口获取展示"
        },
        {
          "name": "jobPointAddress",
          "label": "作业点地址",
          "type": "text",
          "required": false,
          "description": "作业点地址，从任务详情接口获取展示"
        },
        {
          "name": "jobPointLatitude",
          "label": "作业点纬度",
          "type": "text",
          "required": false,
          "description": "作业点纬度坐标，用于导航"
        },
        {
          "name": "jobPointLongitude",
          "label": "作业点经度",
          "type": "text",
          "required": false,
          "description": "作业点经度坐标，用于导航"
        },
        {
          "name": "expectedArrivalTime",
          "label": "预计到达时间",
          "type": "text",
          "required": false,
          "description": "预计到达时间，从任务详情获取展示"
        },
        {
          "name": "materialBillNo",
          "label": "关联物资提货单号",
          "type": "text",
          "required": false,
          "description": "物资提货单号，支持点击跳转查看物资详情"
        },
        {
          "name": "vehiclePlate",
          "label": "车牌",
          "type": "text",
          "required": false,
          "description": "车辆车牌号，从车辆台账获取展示"
        },
        {
          "name": "driverPhone",
          "label": "司机手机号",
          "type": "text",
          "required": false,
          "description": "司机手机号，支持点击拨号"
        },
        {
          "name": "dispatcherPhone",
          "label": "调度员联系电话",
          "type": "text",
          "required": false,
          "description": "调度员联系电话，支持点击拨号"
        },
        {
          "name": "photos",
          "label": "现场照片",
          "type": "image",
          "required": true,
          "description": "完成确认时必须上传至少1张照片，最多3张"
        },
        {
          "name": "arrivedTime",
          "label": "到达时间",
          "type": "text",
          "required": false,
          "description": "到达确认后自动获取客户端当前时间"
        },
        {
          "name": "completedTime",
          "label": "完成时间",
          "type": "text",
          "required": false,
          "description": "完成确认成功后自动记录"
        },
        {
          "name": "feedbackType",
          "label": "异常类型",
          "type": "select",
          "required": true,
          "description": "异常反馈表单中的问题类型：找不到作业点/任务信息错误/车辆故障/其他"
        },
        {
          "name": "feedbackDescription",
          "label": "文字描述",
          "type": "textarea",
          "required": true,
          "description": "异常反馈文字描述"
        },
        {
          "name": "feedbackPhotos",
          "label": "异常照片",
          "type": "image",
          "required": false,
          "description": "异常反馈可选上传现场照片"
        }
      ],
      "actions": [
        {
          "label": "导航",
          "trigger": "点击导航按钮",
          "feedback": "调用系统地图APP（通过URL Scheme传入经纬度或地址）打开导航界面"
        },
        {
          "label": "拨号（司机/调度员）",
          "trigger": "点击司机手机号或调度员联系电话",
          "feedback": "拔出系统拨号界面，显示对应电话号码"
        },
        {
          "label": "查看物资详情",
          "trigger": "点击关联物资提货单号",
          "feedback": "调用物资系统接口获取物资详情并跳转到物资详情页面"
        },
        {
          "label": "到达确认",
          "trigger": "点击到达确认按钮",
          "feedback": "调用POST /api/driver/tasks/{taskId}/arrive，按钮锁定，状态更新为已到达，记录到达时间"
        },
        {
          "label": "完成确认",
          "trigger": "点击完成确认按钮",
          "feedback": "弹出拍照/相册选择组件，用户选择至少1张照片后上传，然后调用POST /api/driver/tasks/{taskId}/complete，任务状态更新为已完成，按钮置灰禁用"
        },
        {
          "label": "提交异常反馈",
          "trigger": "在异常反馈表单中填写完成并点击提交",
          "feedback": "调用POST /api/driver/feedback提交异常事件，提交成功后关闭表单并刷新历史反馈列表，推送至调度员端"
        },
        {
          "label": "查看历史反馈",
          "trigger": "点击历史反馈记录列表项（可展开）",
          "feedback": "展开显示对应反馈的详细信息（类型、描述、照片、处理状态、时间）"
        },
        {
          "label": "重试加载",
          "trigger": "数据加载失败时点击错误提示中的重试按钮",
          "feedback": "重新调用GET /api/driver/tasks/{taskId}获取详情数据"
        }
      ],
      "validations": [
        "到达确认按钮仅当任务状态为“进行中”时可点击",
        "完成确认按钮仅当任务状态为“已到达”时可点击",
        "完成确认必须上传至少1张照片（最多3张）",
        "异常反馈表单中异常类型和文字描述为必填项",
        "拨号操作需获得设备电话权限",
        "导航启动前需检查是否已到达，若已到达则提示并禁用导航按钮",
        "物资提货单详情接口调用失败时需提示但不阻塞导航"
      ],
      "states": {
        "empty": "无任务或无数据时显示空状态示意，当前页面从列表跳转进来，一般不会空，但历史反馈无记录时显示'暂无反馈'",
        "loading": "页面加载时显示骨架屏，加载任务详情数据",
        "success": "正常展示任务详情和对应状态下的操作按钮",
        "error": "接口失败时显示错误提示和重试按钮；物资系统接口调用失败时显示提示但不阻塞导航"
      },
      "generatedAt": "2026-07-03T03:44:00.695Z"
    },
    "sc-3-page-1-0": {
      "key": "sc-3-page-1-0",
      "name": "现场调度移动端工作台",
      "vueFile": "MobileDispatchView.vue",
      "goal": "实时接收异常告警与司机反馈，查看周边车辆状态，并与司机即时通讯，快速发起任务调整。",
      "features": [
        "异常告警与司机反馈接收面板",
        "周边车辆实时状态视图",
        "即时通讯面板"
      ],
      "sections": [
        "顶部告警与反馈滚动通知栏（折叠/展开）",
        "中央车辆地图/列表视图（可切换）",
        "底部浮动操作栏（包含通讯入口、快速调整按钮）",
        "即时通讯面板（从底部弹出，含消息列表和输入框）"
      ],
      "fields": [
        {
          "name": "alertTypeFilter",
          "label": "告警类型",
          "type": "multi-select",
          "required": false,
          "description": "按告警类型筛选(超速/禁入/异常停留/司机反馈)"
        },
        {
          "name": "vehicleTypeFilter",
          "label": "车辆类型",
          "type": "multi-select",
          "required": false,
          "description": "按车辆类型筛选(生产/物流/外协/临时)"
        },
        {
          "name": "radiusFilter",
          "label": "搜索半径",
          "type": "select",
          "required": false,
          "description": "选择周边车辆搜索半径(1km/3km/5km/10km)"
        },
        {
          "name": "messageInput",
          "label": "消息内容",
          "type": "text",
          "required": true,
          "description": "输入文本消息发送给司机"
        },
        {
          "name": "quickReply",
          "label": "快捷回复模板",
          "type": "select",
          "required": false,
          "description": "选择预设回复模板"
        }
      ],
      "actions": [
        {
          "label": "告警项点击",
          "trigger": "点击告警卡片",
          "feedback": "弹出快捷操作菜单（查看车辆详情、发起通讯、转派任务）"
        },
        {
          "label": "车辆标记点击",
          "trigger": "点击地图车辆标注或列表行",
          "feedback": "弹出信息卡片（司机联系方式、当前任务、调整按钮）"
        },
        {
          "label": "通讯按钮点击",
          "trigger": "点击底部浮动操作栏通讯入口",
          "feedback": "展开即时通讯面板（从底部弹出）"
        },
        {
          "label": "切换视图",
          "trigger": "点击右上角切换图标",
          "feedback": "在地图和列表视图之间切换"
        },
        {
          "label": "下拉刷新",
          "trigger": "下拉手势",
          "feedback": "重新加载告警和车辆数据，显示加载动画"
        },
        {
          "label": "改派任务",
          "trigger": "在车辆信息卡片中选择改派",
          "feedback": "弹出改派表单（选择新司机、填写原因），提交后更新任务状态"
        },
        {
          "label": "取消任务",
          "trigger": "在车辆信息卡片中选择取消",
          "feedback": "弹出确认对话框，确认后取消任务并通知司机"
        },
        {
          "label": "新增临时任务",
          "trigger": "点击底部浮动操作栏快速调整按钮中的新增临时任务",
          "feedback": "弹出新增任务表单（作业点、预计时间、要求），提交后生成任务"
        },
        {
          "label": "发送消息",
          "trigger": "点击发送按钮或在输入框按回车",
          "feedback": "消息发送并显示在对话列表中，带送达状态"
        },
        {
          "label": "标记已读",
          "trigger": "滑动或点击已读按钮",
          "feedback": "告警标记为已读，通知列表刷新"
        }
      ],
      "validations": [
        "改派操作需填写改派原因",
        "取消任务需二次确认",
        "新增临时任务需填写作业点和预计时间",
        "通讯消息不能为空",
        "车辆空闲性检查（新增临时任务时）"
      ],
      "states": {
        "empty": "无告警且无周边车辆，显示提示信息",
        "loading": "正在获取告警和车辆数据，显示加载动画",
        "success": "数据加载完成，正常显示",
        "error": "网络错误或数据加载失败，显示重试按钮"
      },
      "generatedAt": "2026-07-03T03:46:48.545Z"
    },
    "sc-4-page-1-0": {
      "key": "sc-4-page-1-0",
      "name": "门岗车辆入场核验与放行工作台",
      "vueFile": "GateAccessCheckView.vue",
      "goal": "门岗人员在固定终端上实时查看待核验车辆、查看核验详情、执行放行或拒绝操作，并在接口异常时进行降级处理。",
      "features": [
        "入场待核验车辆队列",
        "核验结果与来源详情展示",
        "放行/拒绝操作确认",
        "异常原因登记与留痕",
        "接口异常降级处理"
      ],
      "sections": [
        "顶部状态栏：显示当前接口连接状态（正常/异常）、待处理车辆数",
        "左侧待核验车辆列表：车牌号、核验状态图标、来源标签，支持筛选",
        "右侧核验详情与操作区：车辆档案摘要、核验结果详情、预设原因列表、手动放行/拒绝按钮、异常原因登记弹窗",
        "底部操作日志/提示区域（可选）"
      ],
      "fields": [
        {
          "name": "filterStatus",
          "label": "核验状态",
          "type": "select",
          "required": false,
          "description": "按核验状态筛选车辆列表，选项：全部/通过/失败/需人工判断/接口异常"
        },
        {
          "name": "abnormalReason",
          "label": "原因分类",
          "type": "select",
          "required": true,
          "description": "拒绝操作时必须选择异常原因，预设选项：黑名单/证照过期/无预约/车辆不符/其他"
        },
        {
          "name": "abnormalRemark",
          "label": "详细说明",
          "type": "textarea",
          "required": true,
          "description": "对异常原因的详细描述，必填"
        },
        {
          "name": "degradedPlate",
          "label": "车牌号",
          "type": "text",
          "required": true,
          "description": "接口异常降级时，手动录入待入场车辆车牌号"
        },
        {
          "name": "degradedTask",
          "label": "预约/派车任务",
          "type": "select",
          "required": false,
          "description": "降级时选择关联的预约或派车任务（可选）"
        }
      ],
      "actions": [
        {
          "label": "选择车辆行",
          "trigger": "点击左侧待核验列表中的某一行",
          "feedback": "右侧区域加载该车的核验详情、车辆档案摘要及关联任务信息"
        },
        {
          "label": "放行（核验通过车辆）",
          "trigger": "点击选中车辆详情区的“放行”按钮",
          "feedback": "弹出二次确认弹窗，确认后调用POST /api/gate/vehicle-action接口，车辆从列表移除，显示放行成功反馈"
        },
        {
          "label": "手动放行（核验失败/需人工判断）",
          "trigger": "点击“手动放行”按钮",
          "feedback": "直接调用POST /api/gate/vehicle-action接口，车辆从列表移除，显示放行成功反馈"
        },
        {
          "label": "拒绝",
          "trigger": "点击“拒绝”按钮",
          "feedback": "弹出异常原因登记弹窗（含abnormalReason和abnormalRemark字段），提交后调用POST /api/gate/abnormal-record接口，车辆从列表移除，显示拒绝成功反馈"
        },
        {
          "label": "异常原因提交",
          "trigger": "在异常原因登记弹窗中点击“确认”按钮",
          "feedback": "提交表单，调用POST /api/gate/abnormal-record，关闭弹窗，列表更新"
        },
        {
          "label": "手动刷新",
          "trigger": "点击刷新按钮（或下拉手势）",
          "feedback": "重新请求GET /api/gate/pending-vehicles，列表更新，显示加载态"
        },
        {
          "label": "降级放行/拒绝",
          "trigger": "在降级面板中手动录入车牌并选择操作（放行或拒绝）后点击确认",
          "feedback": "调用POST /api/gate/degraded-action，操作成功或失败后给出相应反馈，关闭降级面板"
        },
        {
          "label": "筛选状态变更",
          "trigger": "改变筛选下拉框的值",
          "feedback": "重新请求列表（带上筛选参数）或本地过滤，列表刷新"
        }
      ],
      "validations": [
        "拒绝操作必须选择异常原因并填写详细说明",
        "降级操作中车牌号不能为空且需符合车牌格式",
        "放行操作需二次确认防止误操作",
        "异常原因提交后不可修改"
      ],
      "states": {
        "empty": "当前无待入场车辆，显示空状态提示",
        "loading": "数据加载中，显示骨架屏或加载动画",
        "success": "操作成功（放行/拒绝/降级成功）后显示短暂成功提示",
        "error": "接口异常时触发降级模式，显示降级面板；或操作失败时显示错误提示"
      },
      "generatedAt": "2026-07-03T03:47:43.629Z"
    },
    "sc-4-page-2-1": {
      "key": "sc-4-page-2-1",
      "name": "入场记录查询与同步管理",
      "vueFile": "GateEntryRecordsView.vue",
      "goal": "门岗或管理员查看历史入场处理记录（放行/拒绝），追踪记录同步状态，对同步失败的记录进行手动重新同步。",
      "features": [
        "入场记录同步与状态追踪"
      ],
      "sections": [
        "顶部筛选栏：时间范围、车牌号、操作结果（放行/拒绝）、同步状态",
        "记录列表：显示时间、车牌、操作类型、操作员、同步状态标签、重新同步按钮（仅同步失败时显示）",
        "记录详情弹窗（点击行展开）：显示完整核验结果快照、接口返回信息、异常原因、降级标记等"
      ],
      "fields": [
        {
          "name": "startDate",
          "label": "开始时间",
          "type": "date",
          "required": false,
          "description": "筛选时间范围的起始日期"
        },
        {
          "name": "endDate",
          "label": "结束时间",
          "type": "date",
          "required": false,
          "description": "筛选时间范围的结束日期"
        },
        {
          "name": "plateNumber",
          "label": "车牌号",
          "type": "text",
          "required": false,
          "description": "按车牌模糊搜索"
        },
        {
          "name": "operationResult",
          "label": "操作结果",
          "type": "select",
          "required": false,
          "description": "筛选放行或拒绝的记录"
        },
        {
          "name": "syncStatus",
          "label": "同步状态",
          "type": "select",
          "required": false,
          "description": "筛选同步状态"
        }
      ],
      "actions": [
        {
          "label": "筛选条件变更",
          "trigger": "用户修改任何筛选字段值",
          "feedback": "自动触发列表请求，列表重新加载，显示加载态"
        },
        {
          "label": "重新同步",
          "trigger": "点击“重新同步”按钮（仅在同步失败记录行中显示）",
          "feedback": "调用POST /api/gate/retry-sync/{recordId}，按钮变为加载状态，完成后更新该记录同步状态为“同步中”或“已同步”，若失败则保持“同步失败”并提示错误"
        },
        {
          "label": "查看详情",
          "trigger": "点击列表行",
          "feedback": "弹窗显示该条记录的完整核验结果快照，包括接口返回信息、异常原因、降级标记等"
        }
      ],
      "validations": [
        "入场记录查询与同步管理 的关键筛选或处理字段不能为空。",
        "提交前校验状态流转是否合法，并给出明确错误提示。"
      ],
      "states": {
        "empty": "显示“暂无入场记录”占位图",
        "loading": "列表区域显示加载状态，如骨架屏或加载指示器",
        "success": "列表正常展示记录数据",
        "error": "列表请求失败时显示错误提示，并提供重试按钮"
      },
      "generatedAt": "2026-07-03T03:48:18.730Z"
    },
    "sc-5-page-1-0": {
      "key": "sc-5-page-1-0",
      "name": "运营报表概览工作台",
      "vueFile": "ManagementReportsView.vue",
      "goal": "管理人员通过该页面查看实时关键运营指标，按时间、车辆类型、作业区域等维度筛选数据，通过指标卡片和趋势图快速掌握整体状况，并可导出报表或下钻到明细详情。",
      "features": [
        "多维度数据筛选与联动刷新",
        "关键运营指标卡片组",
        "指标趋势图分析",
        "报表导出与下载"
      ],
      "sections": [
        "顶部筛选区（时间范围选择器、车辆类型多选、作业区域多选、查询按钮）",
        "指标卡片区（5个卡片横向排列，支持点击下钻）",
        "趋势图区域（折线图/柱状图，指标切换下拉、粒度切换）",
        "导出操作区（“导出Excel”“导出PDF”按钮及范围选择）"
      ],
      "fields": [
        {
          "name": "timeRangeType",
          "label": "时间范围类型",
          "type": "select",
          "required": true,
          "description": "选择预定义时间范围（今日/本周/本月/自定义）"
        },
        {
          "name": "startDate",
          "label": "开始日期",
          "type": "date",
          "required": false,
          "description": "当时间范围类型为“自定义”时必填"
        },
        {
          "name": "endDate",
          "label": "结束日期",
          "type": "date",
          "required": false,
          "description": "当时间范围类型为“自定义”时必填，且不能早于开始日期"
        },
        {
          "name": "vehicleTypes",
          "label": "车辆类型",
          "type": "multi-select",
          "required": false,
          "description": "多选，可选值：生产车辆、物流车辆、外协车辆、临时车辆"
        },
        {
          "name": "areas",
          "label": "作业区域",
          "type": "multi-select",
          "required": false,
          "description": "多选，根据场地电子围栏动态加载"
        },
        {
          "name": "metric",
          "label": "趋势图指标",
          "type": "select",
          "required": false,
          "description": "切换趋势图展示的指标，默认车辆利用率"
        },
        {
          "name": "granularity",
          "label": "趋势图粒度",
          "type": "select",
          "required": false,
          "description": "日趋势/周趋势/月趋势，与时间范围联动"
        },
        {
          "name": "exportFormat",
          "label": "导出格式",
          "type": "select",
          "required": false,
          "description": "Excel 或 PDF"
        },
        {
          "name": "exportScope",
          "label": "导出范围",
          "type": "select",
          "required": false,
          "description": "仅指标摘要/仅明细数据/完整报表"
        }
      ],
      "actions": [
        {
          "label": "筛选查询",
          "trigger": "点击“查询”按钮或任意筛选条件变更后（自动查询）",
          "feedback": "所有数据区域（指标卡片、趋势图、导出选项）显示加载态，数据返回后更新显示，若出错显示错误提示"
        },
        {
          "label": "点击指标卡片",
          "trigger": "鼠标点击任意指标卡片",
          "feedback": "跳转至对应的明细数据详情页，并携带当前所有筛选条件作为参数"
        },
        {
          "label": "切换趋势图指标",
          "trigger": "趋势图指标下拉框选项变更",
          "feedback": "趋势图重新加载对应指标的数据，显示加载态后更新图表"
        },
        {
          "label": "切换趋势图粒度",
          "trigger": "趋势图粒度下拉框选项变更",
          "feedback": "趋势图重新加载对应粒度的数据，显示加载态后更新图表"
        },
        {
          "label": "点击趋势图数据点",
          "trigger": "鼠标点击趋势图上的数据点",
          "feedback": "跳转至该时间点的明细数据列表页，携带当前筛选条件及选中的时间点"
        },
        {
          "label": "导出报表",
          "trigger": "点击“导出Excel”或“导出PDF”按钮",
          "feedback": "若导出范围未选择，提示选择；随后显示导出进度（等待/生成中），完成后提供下载链接或自动下载；失败显示错误原因"
        },
        {
          "label": "重试加载",
          "trigger": "在异常态下点击“重试”按钮",
          "feedback": "重新触发当前页面的所有数据加载请求"
        }
      ],
      "validations": [
        "自定义时间范围时，结束日期不能早于开始日期",
        "时间范围类型与开始/结束日期的联动：仅当类型为“自定义”时开始和结束日期为必填",
        "导出时若当前筛选条件下无数据，应提示“暂无数据可导出”",
        "导出文件大小不得超过50MB，超出时提示用户缩小筛选范围"
      ],
      "states": {
        "empty": {
          "description": "当前筛选条件下没有任何数据，展示空状态提示“暂无统计数据”，指标卡片显示“暂无数据”，趋势图展示空白状态",
          "uiFeedback": "显示空状态插画及文字提示，所有数据区域均展示占位"
        },
        "loading": {
          "description": "数据加载中，展示骨架屏或加载动画",
          "uiFeedback": "筛选区域保持可操作，数据区域显示加载指示器，防止重复提交"
        },
        "success": {
          "description": "数据加载成功并正常展示",
          "uiFeedback": "指标卡片、趋势图、导出选项等区域正常渲染，无额外提示"
        },
        "error": {
          "description": "网络错误或接口异常，未能获取数据",
          "uiFeedback": "显示错误提示信息（如“加载失败，请重试”）和重试按钮，数据区域保留上次成功缓存或清空"
        }
      },
      "generatedAt": "2026-07-03T03:49:26.511Z"
    },
    "sc-6-page-1-0": {
      "key": "sc-6-page-1-0",
      "name": "外协/临时车辆预约审批工作台",
      "vueFile": "WorkspaceView.vue",
      "goal": "集中处理外协/临时车辆预约申请，支持待办列表浏览、快速筛选、查看详情和审批操作（通过/驳回），以及审批通过后授权码同步状态监控。",
      "features": [
        "预约申请待办列表",
        "预约审批详情与操作面板"
      ],
      "sections": [
        "顶部筛选与排序栏（车辆类型、作业区域、申请日期、紧急度排序）",
        "左侧待办申请列表区（状态标签、超时标识、关键字段摘要）",
        "右侧详情与操作区（表单详情、车辆档案校验结果、通过/驳回按钮、审批意见输入框、授权码生成与同步状态反馈）",
        "底部操作日志快照（审批记录）"
      ],
      "fields": [
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "select",
          "required": false,
          "description": "按车辆类型筛选，数据来源车辆台账"
        },
        {
          "name": "workArea",
          "label": "作业区域",
          "type": "select",
          "required": false,
          "description": "按作业区域筛选"
        },
        {
          "name": "applyDate",
          "label": "申请日期",
          "type": "date",
          "required": false,
          "description": "按申请日期筛选"
        },
        {
          "name": "sortBy",
          "label": "排序方式",
          "type": "select",
          "required": false,
          "description": "选项：申请时间升序、申请时间降序、紧急程度"
        },
        {
          "name": "licensePlate",
          "label": "车牌号",
          "type": "text",
          "required": false,
          "description": "模糊搜索车牌号"
        },
        {
          "name": "approvalOpinion",
          "label": "审批意见",
          "type": "textarea",
          "required": false,
          "description": "审批人填写的意见，驳回时必填"
        },
        {
          "name": "rejectReason",
          "label": "驳回原因",
          "type": "textarea",
          "required": true,
          "description": "驳回操作时必须填写原因"
        }
      ],
      "actions": [
        {
          "label": "点击列表项",
          "trigger": "用户点击待办列表中某一条申请",
          "feedback": "右侧详情面板加载该申请的完整信息，包括车辆档案校验结果"
        },
        {
          "label": "筛选条件变更",
          "trigger": "用户修改任意筛选条件（车辆类型、作业区域、申请日期、排序方式、车牌搜索）",
          "feedback": "重新请求待办列表，更新列表数据，若请求失败显示错误状态"
        },
        {
          "label": "通过审批",
          "trigger": "用户点击「通过」按钮",
          "feedback": "弹出二次确认对话框（若车辆证照过期则强制确认），确认后调用审批通过接口，成功后显示授权码和同步状态，若失败显示错误提示"
        },
        {
          "label": "驳回审批",
          "trigger": "用户点击「驳回」按钮",
          "feedback": "弹出原因输入框（必填），提交后调用审批驳回接口，成功后刷新列表并关闭详情面板"
        },
        {
          "label": "重新同步授权码",
          "trigger": "用户点击「重新同步」按钮",
          "feedback": "调用授权码同步接口，更新同步状态显示"
        },
        {
          "label": "手动刷新列表",
          "trigger": "用户点击刷新按钮或下拉刷新",
          "feedback": "重新请求待办列表，显示加载态"
        }
      ],
      "validations": [
        "驳回时必须填写驳回原因",
        "车辆证照过期时，点击「通过」必须进行二次确认（弹窗强制确认）",
        "审批通过后若门禁同步失败，允许用户手动重新同步，不可自动重试",
        "所有审批操作提交后不可撤销，需二次确认",
        "筛选条件中车辆类型的下拉选项来源于车辆台账，若为空则展示全部"
      ],
      "states": {
        "empty": "无待审批预约，列表区域显示「暂无待审批预约」，详情区域隐藏或提示选择申请",
        "loading": "列表加载中显示骨架屏，详情加载中显示 loading 指示",
        "success": "正常显示待办列表和详情面板，审批操作成功反馈",
        "error": "接口请求失败时显示网络错误提示和重试按钮，车辆档案校验接口失败时在详情面板局部提示",
        "overdue_warning": "列表中有超时未处理的申请时，对应项显示黄色角标，并在顶部显示提示信息"
      },
      "generatedAt": "2026-07-03T03:50:22.747Z"
    },
    "sc-6-page-2-1": {
      "key": "sc-6-page-2-1",
      "name": "授权码管理与同步监控",
      "vueFile": "AccessCodeView.vue",
      "goal": "查看所有已生成授权码的列表及状态，监控门禁同步情况，处理同步失败记录，并查看授权码使用详情。",
      "features": [
        "授权码管理与同步监控"
      ],
      "sections": [
        "顶部状态筛选栏（全部|同步成功|同步失败|待同步|已过期|已使用）",
        "授权码列表区（车牌号、授权码、有效期、同步状态、使用时间、门岗信息）",
        "单条记录展开详情（同步日志、重试按钮）"
      ],
      "fields": [
        {
          "name": "keyword",
          "label": "车牌号搜索",
          "type": "text",
          "required": false,
          "description": "按车牌号模糊搜索"
        },
        {
          "name": "statusFilter",
          "label": "状态筛选",
          "type": "select",
          "required": false,
          "description": "筛选授权码同步状态：全部、同步成功、同步失败、待同步、已过期、已使用"
        }
      ],
      "actions": [
        {
          "label": "切换状态筛选标签",
          "trigger": "点击状态筛选标签",
          "feedback": "切换列表数据，高亮选中标签"
        },
        {
          "label": "查看授权码详情",
          "trigger": "点击单条记录行或展开按钮",
          "feedback": "展开该记录详情区域，显示同步日志（失败原因）和重试按钮"
        },
        {
          "label": "重新同步",
          "trigger": "点击重新同步按钮",
          "feedback": "按钮显示加载状态，请求POST /api/access-codes/{id}/resync，成功后刷新列表对应记录状态，失败提示错误信息"
        },
        {
          "label": "搜索车牌号",
          "trigger": "输入回车或点击搜索图标",
          "feedback": "根据关键字重新加载列表数据"
        }
      ],
      "validations": [
        "授权码管理与同步监控 的关键筛选或处理字段不能为空。",
        "提交前校验状态流转是否合法，并给出明确错误提示。"
      ],
      "states": {
        "empty": "暂无授权码数据，显示占位提示",
        "loading": "列表区域显示骨架屏加载效果",
        "success": "列表正常展示，状态标签颜色区分（同步成功绿色、同步失败红色、待同步橙色、已过期灰色、已使用蓝色等）",
        "error": "接口请求失败，显示错误提示及重试按钮"
      },
      "generatedAt": "2026-07-03T03:52:26.738Z"
    },
    "sc-6-page-3-2": {
      "key": "sc-6-page-3-2",
      "name": "历史预约记录查询",
      "vueFile": "HistoryView.vue",
      "goal": "提供外协/临时车辆预约历史记录的多维度查询、详情追溯和导出，支持费用统计对账。",
      "features": [
        "历史预约记录查询"
      ],
      "sections": [
        "顶部多条件筛选栏（时间范围、车辆、所属单位、作业区域、审批状态）",
        "历史记录列表区（倒序展示，显示审批状态、授权码、入场/出场时间、费用）",
        "单条记录展开详情或弹窗（完整操作日志、费用明细）",
        "导出按钮及导出进度提示"
      ],
      "fields": [
        {
          "name": "startTime",
          "label": "开始时间",
          "type": "date",
          "required": false,
          "description": "筛选时间范围的起始日期"
        },
        {
          "name": "endTime",
          "label": "结束时间",
          "type": "date",
          "required": false,
          "description": "筛选时间范围的结束日期"
        },
        {
          "name": "vehicleId",
          "label": "车辆",
          "type": "select",
          "required": false,
          "description": "选择或搜索车辆，支持模糊匹配"
        },
        {
          "name": "unit",
          "label": "所属单位",
          "type": "select",
          "required": false,
          "description": "筛选所属单位，支持多选"
        },
        {
          "name": "area",
          "label": "作业区域",
          "type": "select",
          "required": false,
          "description": "筛选作业区域"
        },
        {
          "name": "status",
          "label": "审批状态",
          "type": "select",
          "required": false,
          "description": "筛选审批状态：待审批、已通过、已驳回等"
        }
      ],
      "actions": [
        {
          "label": "筛选条件变更",
          "trigger": "change",
          "feedback": "自动发起请求获取新列表，显示加载态"
        },
        {
          "label": "查看详情",
          "trigger": "click",
          "feedback": "打开详情弹窗，展示操作日志时间线和费用明细"
        },
        {
          "label": "导出Excel",
          "trigger": "click",
          "feedback": "确认后开始生成，显示进度条，完成后自动下载"
        },
        {
          "label": "分页",
          "trigger": "click",
          "feedback": "跳转目标页码，重新请求数据并更新列表"
        }
      ],
      "validations": [
        "结束时间不得早于开始时间",
        "车辆模糊搜索至少输入2个字符",
        "时间范围跨度不得超过90天"
      ],
      "states": {
        "empty": "按条件无数据时显示『暂无记录』并提示修改筛选条件",
        "loading": "列表数据加载中",
        "success": "数据加载成功，正常展示列表",
        "error": "接口请求失败时提示重试"
      },
      "generatedAt": "2026-07-03T03:55:03.753Z"
    },
    "sc-7-page-1-0": {
      "key": "sc-7-page-1-0",
      "name": "车辆台账列表工作台",
      "vueFile": "VehicleArchiveList.vue",
      "goal": "管理员查看全厂车辆档案列表，执行筛选、搜索、停用/启用操作，并接收到期提醒。",
      "features": [
        "车辆列表与高级筛选",
        "年检/保险/准入有效期设置与到期提醒",
        "车辆停用/启用管理与状态同步"
      ],
      "sections": [
        "顶部操作栏：新增车辆按钮、导出按钮、批量停用/启用（可选）",
        "筛选区：车辆类型、所属单位、车辆状态、有效期状态下拉框；车牌号/司机姓名搜索框",
        "到期提醒横幅/面板：展示临近30天到期的车辆条目列表（车辆、到期类型、剩余天数），可点击跳转编辑页",
        "车辆列表主体：展示车牌号、车辆类型、所属单位、司机、有效期状态、车辆状态；每行包含『编辑』、『停用/启用』按钮",
        "分页控件"
      ],
      "fields": [
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "select",
          "required": false,
          "description": "按车辆类型筛选，选项来自字典（生产车辆/物流车辆/外协车辆/临时车辆）"
        },
        {
          "name": "orgId",
          "label": "所属单位",
          "type": "select",
          "required": false,
          "description": "按所属单位筛选，选项来自单位列表"
        },
        {
          "name": "status",
          "label": "车辆状态",
          "type": "select",
          "required": false,
          "description": "正常/停用"
        },
        {
          "name": "expireStatus",
          "label": "有效期状态",
          "type": "select",
          "required": false,
          "description": "临近到期/已过期/正常"
        },
        {
          "name": "keyword",
          "label": "搜索关键字",
          "type": "text",
          "required": false,
          "description": "按车牌号或司机姓名模糊搜索"
        }
      ],
      "actions": [
        {
          "label": "新增车辆",
          "trigger": "点击顶部操作栏『新增车辆』按钮",
          "feedback": "跳转至新增车辆页面"
        },
        {
          "label": "导出",
          "trigger": "点击顶部操作栏『导出』按钮",
          "feedback": "导出当前筛选结果或全部列表为Excel文件"
        },
        {
          "label": "批量停用",
          "trigger": "点击顶部操作栏『批量停用』按钮（可选功能）",
          "feedback": "弹出批量停用弹窗，选择车辆并填写停用原因后提交"
        },
        {
          "label": "批量启用",
          "trigger": "点击顶部操作栏『批量启用』按钮（可选功能）",
          "feedback": "弹出确认弹窗，确认后批量启用"
        },
        {
          "label": "搜索",
          "trigger": "在搜索框输入后按回车或点击搜索图标",
          "feedback": "触发防抖（300ms）后请求接口刷新列表"
        },
        {
          "label": "筛选变化",
          "trigger": "任一筛选下拉框值变化",
          "feedback": "即时触发防抖请求刷新列表"
        },
        {
          "label": "点击到期提醒条目",
          "trigger": "点击到期提醒横幅/面板中的车辆条目",
          "feedback": "跳转至对应车辆编辑页并自动定位至有效期设置区域"
        },
        {
          "label": "停用车辆",
          "trigger": "点击列表行内『停用』按钮",
          "feedback": "弹出确认弹窗，要求填写停用原因（必填），提交后刷新列表并更新提醒区域"
        },
        {
          "label": "启用车辆",
          "trigger": "点击列表行内『启用』按钮",
          "feedback": "弹出确认弹窗（无需原因），确认后刷新列表"
        },
        {
          "label": "编辑车辆",
          "trigger": "点击列表行内『编辑』按钮",
          "feedback": "跳转至对应车辆编辑页"
        },
        {
          "label": "分页切换",
          "trigger": "切换分页控件页码或每页条数",
          "feedback": "请求新页面数据并刷新列表"
        }
      ],
      "validations": [
        "停用操作时停用原因必填",
        "车辆类型、所属单位、状态、有效期状态的值必须来自预定义字典",
        "搜索关键字长度不超过50字符"
      ],
      "states": {
        "empty": "无车辆数据时展示空态插画及提示文字“暂无车辆，请点击新增”，并突出显示新增按钮",
        "loading": "列表区域显示骨架屏或loading旋转动画",
        "success": "正常显示车辆列表，筛选、搜索、分页功能可用",
        "error": "网络异常或接口错误时展示错误提示信息及重试按钮"
      },
      "generatedAt": "2026-07-03T03:56:13.577Z"
    },
    "sc-7-page-2-1": {
      "key": "sc-7-page-2-1",
      "name": "车辆档案编辑页",
      "vueFile": "VehicleArchiveEdit.vue",
      "goal": "管理员新增或编辑车辆的全部基础档案信息，包括证照图片上传及有效期设置。",
      "features": [
        "车辆新增/编辑表单与数据校验",
        "证照图片上传与管理组件",
        "年检/保险/准入有效期设置与到期提醒"
      ],
      "sections": [
        "页面标题：『新增车辆』或『编辑车辆 - 车牌号』",
        "基本信息区：车辆类型（下拉）、车牌号（文本输入）、所属单位（下拉）、司机姓名、司机电话",
        "有效期设置区：年检有效期、保险有效期、准入有效期三个日期选择器（可单独清除）",
        "证照图片管理区：列表展示已有证照（类型、缩略图）；操作按钮『上传』、『预览』、『替换』、『删除』；支持拖拽排序（可选）",
        "操作按钮区：『保存』、『取消』；保存时触发完整校验",
        "操作日志摘要区（只读）：显示该车辆最近操作日志的简要列表（可选，不超过4条），点击可跳转到操作日志页"
      ],
      "fields": [
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "select",
          "required": true,
          "description": "从枚举列表中选择车辆类型"
        },
        {
          "name": "plateNumber",
          "label": "车牌号",
          "type": "text",
          "required": true,
          "description": "输入车牌号，实时校验格式和唯一性"
        },
        {
          "name": "department",
          "label": "所属单位",
          "type": "select",
          "required": true,
          "description": "从下拉列表中选择所属单位"
        },
        {
          "name": "driverName",
          "label": "司机姓名",
          "type": "text",
          "required": false,
          "description": "司机姓名，可选但建议填写"
        },
        {
          "name": "driverPhone",
          "label": "司机电话",
          "type": "text",
          "required": false,
          "description": "司机联系电话，可选"
        },
        {
          "name": "annualInspectionDate",
          "label": "年检有效期",
          "type": "date",
          "required": false,
          "description": "日期选择器，格式YYYY-MM-DD，不能早于当天"
        },
        {
          "name": "insuranceDate",
          "label": "保险有效期",
          "type": "date",
          "required": false,
          "description": "日期选择器，格式YYYY-MM-DD，不能早于当天"
        },
        {
          "name": "accessPermitDate",
          "label": "准入有效期",
          "type": "date",
          "required": false,
          "description": "日期选择器，格式YYYY-MM-DD，不能早于当天"
        },
        {
          "name": "documents",
          "label": "证照图片",
          "type": "file-upload",
          "required": false,
          "description": "支持上传多张证照，类型包括行驶证、营运证、其他，每张不超过10MB，jpg/png"
        }
      ],
      "actions": [
        {
          "label": "保存",
          "trigger": "点击保存按钮",
          "feedback": "执行完整校验：必填字段（车牌号、车辆类型、所属单位）不能为空，日期不能早于当天；校验通过后显示提交loading，成功后跳转到列表页并刷新；失败时显示错误信息并保留输入"
        },
        {
          "label": "取消",
          "trigger": "点击取消按钮",
          "feedback": "返回上一页（列表页），如果表单有未保存修改，弹出确认提示"
        },
        {
          "label": "上传证照",
          "trigger": "点击上传按钮",
          "feedback": "弹出文件选择器，选择图片后自动上传并显示缩略图，同时要求选择证照类型"
        },
        {
          "label": "预览证照",
          "trigger": "点击预览按钮（或图片缩略图）",
          "feedback": "弹出预览弹窗，可放大查看证照图片"
        },
        {
          "label": "替换证照",
          "trigger": "点击替换按钮",
          "feedback": "弹出文件选择器，选择新图片后上传并替换旧图，旧图标记为历史版本，并记录操作日志"
        },
        {
          "label": "删除证照",
          "trigger": "点击删除按钮",
          "feedback": "弹出确认弹窗，确认后删除图片并记录操作日志，缩略图移除"
        },
        {
          "label": "查看操作日志",
          "trigger": "点击操作日志摘要区的日志条目",
          "feedback": "跳转到操作日志详情页，显示该车辆的所有操作日志"
        }
      ],
      "validations": [
        "车牌号必填，格式需符合车牌号规范，且不可与已有车辆重复",
        "车辆类型必填",
        "所属单位必填",
        "年检有效期、保险有效期、准入有效期填写时，日期不能早于当前日期",
        "证照上传：仅支持jpg/png格式，单张不超过10MB",
        "保存前执行所有必填和逻辑校验，校验不通过阻止提交并提示错误"
      ],
      "states": {
        "empty": "新增模式下所有字段为空，证照图片区无图片；编辑模式下预填充数据",
        "loading": "页面加载车辆详情数据时显示loading；保存时按钮显示loading并禁用",
        "success": "保存成功后跳转到列表页并显示成功提示",
        "error": "保存失败时显示错误信息（如网络错误、数据冲突），保留用户输入；校验失败时在对应字段下显示错误信息"
      },
      "generatedAt": "2026-07-03T03:58:27.237Z"
    },
    "sc-7-page-3-2": {
      "key": "sc-7-page-3-2",
      "name": "操作日志查询页",
      "vueFile": "VehicleArchiveLogs.vue",
      "goal": "管理员查询和导出所有车辆档案的关键操作日志，用于审计追溯。",
      "features": [
        "操作日志查询与导出"
      ],
      "sections": [
        "筛选区：时间范围（日期选择器）、操作人（下拉或输入）、操作类型（多选下拉）、关联车辆（车牌号输入/选择）",
        "日志列表：展示时间、操作人、操作类型、关联车辆、修改内容摘要",
        "导出按钮：点击后导出当前筛选条件下的日志为Excel文件",
        "分页控件"
      ],
      "fields": [
        {
          "name": "startTime",
          "label": "开始日期",
          "type": "date",
          "required": false,
          "description": "筛选日志的开始日期，为空时不限制起始时间"
        },
        {
          "name": "endTime",
          "label": "结束日期",
          "type": "date",
          "required": false,
          "description": "筛选日志的结束日期，为空时不限制截止时间"
        },
        {
          "name": "operator",
          "label": "操作人",
          "type": "select",
          "required": false,
          "description": "基于操作人列表下拉选择，支持单个操作人筛选"
        },
        {
          "name": "actionTypes",
          "label": "操作类型",
          "type": "multiselect",
          "required": false,
          "description": "多选下拉，可选值：新增/编辑/停用/启用/上传证照/删除证照"
        },
        {
          "name": "vehicle",
          "label": "关联车辆",
          "type": "search-select-multiple",
          "required": false,
          "description": "输入车牌号搜索并支持多选关联车辆"
        }
      ],
      "actions": [
        {
          "label": "导出Excel",
          "trigger": "点击导出按钮",
          "feedback": "当筛选结果条数超过最大限制（默认10万）时弹出提示要求缩小范围；否则发起POST /api/vehicles/logs/export请求并显示loading，导出完成后根据结果提示成功或失败"
        },
        {
          "label": "查看日志详情",
          "trigger": "点击日志行",
          "feedback": "展开该行下方详细区域，展示修改内容的前后JSON对比（before/after）"
        }
      ],
      "validations": [
        "开始日期不能晚于结束日期",
        "导出时若查询结果超过10万条则提示用户缩小范围"
      ],
      "states": {
        "empty": "暂无操作记录",
        "loading": "查询或导出进行中，显示加载动画",
        "success": "操作成功",
        "error": "查询失败或导出失败时展示错误提示"
      },
      "generatedAt": "2026-07-03T04:01:13.683Z"
    },
    "sc-5-page-2-1": {
      "key": "sc-5-page-2-1",
      "name": "明细数据详情页",
      "vueFile": "ReportDetailView.vue",
      "goal": "展示从概览工作台下钻的明细数据，包括外协车辆费用明细、异常入场记录、排班排队分析等，支持进一步搜索、排序、分页以及当前明细的导出。",
      "features": [
        "明细数据下钻与详情查看"
      ],
      "sections": [
        "页面顶部面包屑导航及返回概览按钮",
        "当前筛选条件标签（显示继承自概览页的筛选条件，可微调）",
        "明细类型标签页（外协费用明细/异常入场记录/排班排队分析）",
        "表格区（含搜索框、排序箭头、分页控制器）",
        "导出当前明细按钮"
      ],
      "fields": [
        {
          "name": "timeRange",
          "label": "时间范围",
          "type": "date-range",
          "required": false,
          "description": "继承自概览页的筛选条件，可微调，用于限制明细数据的时间范围"
        },
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "select",
          "required": false,
          "description": "继承自概览页的筛选条件，可微调，用于过滤车辆类型"
        },
        {
          "name": "area",
          "label": "作业区域",
          "type": "select",
          "required": false,
          "description": "继承自概览页的筛选条件，可微调，用于过滤作业区域"
        },
        {
          "name": "keyword",
          "label": "搜索",
          "type": "text",
          "required": false,
          "description": "表格内关键字搜索，支持按车辆、司机、任务等模糊匹配"
        },
        {
          "name": "detailType",
          "label": "明细类型",
          "type": "tab",
          "required": true,
          "description": "切换明细类型标签页：外协费用明细/异常入场记录/排班排队分析"
        },
        {
          "name": "sortField",
          "label": "排序字段",
          "type": "hidden",
          "required": false,
          "description": "当前表格排序字段，通过点击列头设置"
        },
        {
          "name": "sortOrder",
          "label": "排序顺序",
          "type": "hidden",
          "required": false,
          "description": "升序或降序"
        },
        {
          "name": "page",
          "label": "当前页码",
          "type": "number",
          "required": true,
          "description": "分页当前页"
        },
        {
          "name": "pageSize",
          "label": "每页条数",
          "type": "number",
          "required": true,
          "description": "分页每页显示记录数"
        }
      ],
      "actions": [
        {
          "label": "切换明细类型",
          "trigger": "点击明细类型标签页",
          "feedback": "刷新表格数据，重置搜索和排序状态，更新URL参数或本地状态"
        },
        {
          "label": "搜索",
          "trigger": "在搜索框中输入关键字后按回车或点击搜索图标",
          "feedback": "根据关键字过滤表格数据，重新查询并更新分页"
        },
        {
          "label": "排序",
          "trigger": "点击列头排序箭头",
          "feedback": "切换升序/降序，重新排序表格数据，保留当前搜索和分页"
        },
        {
          "label": "分页",
          "trigger": "点击分页控件页码或上一页/下一页",
          "feedback": "加载新页码的数据，保持当前筛选和排序条件"
        },
        {
          "label": "导出",
          "trigger": "点击“导出当前明细”按钮",
          "feedback": "弹出导出确认或直接下载导出文件（CSV/Excel），提示导出进度"
        },
        {
          "label": "返回概览",
          "trigger": "点击面包屑导航中的概览层级或“返回概览”按钮",
          "feedback": "返回概览工作台页面，保留筛选条件"
        },
        {
          "label": "微调筛选条件",
          "trigger": "点击筛选条件标签旁的编辑或直接在筛选区域修改",
          "feedback": "更新筛选条件，重新加载表格数据"
        }
      ],
      "validations": [
        "明细数据详情页 的关键筛选或处理字段不能为空。",
        "提交前校验状态流转是否合法，并给出明确错误提示。"
      ],
      "states": {
        "empty": {
          "description": "无对应明细数据时，表格区展示'暂无记录'图片和文字提示，并提供清除筛选条件或重新选择的引导按钮"
        },
        "loading": {
          "description": "数据加载中，表格行显示骨架屏或加载中提示，禁用交互操作"
        },
        "success": {
          "description": "数据正常加载，表格展示数据，所有交互可用"
        },
        "error": {
          "description": "数据加载失败，表格区显示错误提示和重试按钮，点击重试重新请求"
        }
      },
      "generatedAt": "2026-07-03T04:02:26.815Z"
    },
    "sc-3-page-2-1": {
      "key": "sc-3-page-2-1",
      "name": "任务调整与异常上报",
      "vueFile": "TaskAdjustView.vue",
      "goal": "对选中车辆/任务执行改派、取消或新增临时任务，并填写异常处理记录提交上报。",
      "features": [
        "任务调整操作（改派/取消/加派）",
        "异常处理记录与上报表单"
      ],
      "sections": [
        "顶部任务/车辆信息摘要区（车牌、司机、任务描述）",
        "操作类型选择按钮组（改派、取消、加派）",
        "操作表单区（根据选择动态显示：改派→司机选择列表；取消→确认原因；加派→作业点、时间、要求）",
        "异常处理记录区（处理原因、备注、附件上传）",
        "底部提交确认按钮区"
      ],
      "fields": [
        {
          "name": "operationType",
          "label": "操作类型",
          "type": "radio",
          "required": true,
          "description": "选择要对当前任务/车辆执行的操作：改派、取消或加派"
        },
        {
          "name": "reassignDriverId",
          "label": "目标司机",
          "type": "select",
          "required": false,
          "description": "当操作类型为“改派”时必填，从周边空闲司机列表中选取，选项由 GET /api/drivers/available 提供"
        },
        {
          "name": "reassignReason",
          "label": "改派原因",
          "type": "text",
          "required": false,
          "description": "当操作类型为“改派”时必填，描述改派理由"
        },
        {
          "name": "cancelReason",
          "label": "取消原因",
          "type": "text",
          "required": false,
          "description": "当操作类型为“取消”时必填，描述取消任务的原因"
        },
        {
          "name": "addLocation",
          "label": "作业地点",
          "type": "select",
          "required": false,
          "description": "当操作类型为“加派”时必填，从作业地点列表选择或手动输入，列表由 GET /api/locations 提供"
        },
        {
          "name": "addEstimatedTime",
          "label": "预计时间",
          "type": "datetime-local",
          "required": false,
          "description": "当操作类型为“加派”时必填，填写新增临时任务的预计作业时间"
        },
        {
          "name": "addRequirements",
          "label": "工作要求",
          "type": "textarea",
          "required": false,
          "description": "当操作类型为“加派”时可选，补充临时任务的具体要求"
        },
        {
          "name": "incidentReason",
          "label": "处理原因",
          "type": "text",
          "required": true,
          "description": "异常处理记录的核心原因，需填写文本描述"
        },
        {
          "name": "incidentNote",
          "label": "备注",
          "type": "text",
          "required": false,
          "description": "异常处理的附加说明"
        },
        {
          "name": "attachments",
          "label": "上传附件",
          "type": "file",
          "required": false,
          "description": "支持拍照或从相册选取图片，可上传多张，格式 jpg/png，单张不超过 5MB"
        }
      ],
      "actions": [
        {
          "label": "选择操作类型",
          "trigger": "change",
          "feedback": "根据所选类型（改派/取消/加派）动态显示对应的表单区域，隐藏不相关的字段"
        },
        {
          "label": "改派-选择司机",
          "trigger": "click",
          "feedback": "弹出底部浮层或全屏列表，展示周边空闲司机（含姓名、车牌、当前位置），选中后回填至「目标司机」字段"
        },
        {
          "label": "加派-选择作业点",
          "trigger": "click",
          "feedback": "弹出作业点选择器（支持搜索或地图选点），选中后回填至「作业地点」字段"
        },
        {
          "label": "提交确认",
          "trigger": "click",
          "feedback": "触发二次确认弹窗，显示操作摘要（包括操作类型、关键字段值、异常处理原因），用户确认后开始提交；提交过程中显示加载遮罩，提交成功后自动返回主工作台页面并刷新列表，提交失败则展示错误消息并允许重新提交"
        }
      ],
      "validations": [
        "操作类型必须选择",
        "若操作类型为「改派」，则必须选择目标司机并填写改派原因",
        "若操作类型为「取消」，则必须填写取消原因",
        "若操作类型为「加派」，则必须选择作业地点并填写预计时间",
        "处理原因不能为空",
        "附件仅支持 jpg/png 格式，单张不超过 5MB",
        "提交前需在确认弹窗中再次确认所有必填项是否完整"
      ],
      "states": {
        "empty": {
          "description": "未从路由传入有效的任务/车辆数据，页面顶部显示错误提示「无法获取任务信息，请返回重试」，底部提交按钮置灰不可点击"
        },
        "loading": {
          "description": "提交按钮显示转圈动画，全屏显示半透明加载遮罩，禁止用户操作"
        },
        "success": {
          "description": "提交成功后自动返回主工作台页面，并触发任务列表刷新，同时页面底部可短暂显示成功提示 toast"
        },
        "error": {
          "description": "提交失败时关闭加载遮罩，在页面顶部显示红色错误消息（如操作失败：原因），提交按钮恢复可点击状态，允许用户修正后重新提交"
        }
      },
      "generatedAt": "2026-07-03T04:04:04.826Z"
    }
  },
  "generatedApiByPageKey": {
    "sc-1-page-1-0": {
      "key": "api-sc-1-page-1-0",
      "method": "POST",
      "name": "派车确认",
      "path": "/api/v1/tasks/dispatch",
      "goal": "提交派车请求，生成任务并下发通知给司机",
      "trigger": "点击派车操作面板“确认派车”按钮",
      "requestParams": [
        {
          "name": "demandId",
          "type": "string",
          "required": true,
          "description": "用车需求ID"
        },
        {
          "name": "vehicleIds",
          "type": "array[string]",
          "required": true,
          "description": "所选车辆ID列表，至少一辆"
        },
        {
          "name": "dispatchNote",
          "type": "string",
          "required": false,
          "description": "派车备注"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "成功",
        "data": {
          "taskId": "string",
          "status": "dispatched"
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 4001,
        "message": "请求参数缺失或无效",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": 4001,
          "meaning": "请求参数缺失或无效",
          "frontendAdvice": "请选择至少一辆可用车辆并确认需求"
        },
        {
          "code": 4002,
          "meaning": "所选车辆不可用（已被派或离线）",
          "frontendAdvice": "部分车辆当前不可用，请重新选择"
        },
        {
          "code": 5001,
          "meaning": "内部错误",
          "frontendAdvice": "派车失败，请稍后重试"
        }
      ],
      "sourcePageKey": "sc-1-page-1-0"
    },
    "sc-1-page-2-1": {
      "key": "api-sc-1-page-2-1",
      "method": "POST",
      "name": "处理告警",
      "path": "/api/v1/alerts/handle",
      "goal": "对异常告警进行确认、忽略或转人工处理，更新告警状态并记录处理备注",
      "trigger": "点击告警详情弹窗中的确认/忽略/转人工按钮后触发",
      "requestParams": [
        {
          "name": "alertId",
          "type": "string",
          "required": true,
          "description": "告警唯一标识"
        },
        {
          "name": "action",
          "type": "string",
          "required": true,
          "description": "处理动作：confirm（确认）、ignore（忽略）、transfer（转人工）"
        },
        {
          "name": "remark",
          "type": "string",
          "required": false,
          "description": "处理备注，长度不超过500字符"
        }
      ],
      "successResponse": {
        "code": "200",
        "message": "操作成功",
        "data": {
          "alertId": "string",
          "status": "string",
          "handleTime": "string",
          "handler": "string"
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": "400",
        "message": "请求参数错误",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": "40001",
          "meaning": "告警ID不存在",
          "frontendAdvice": "提示用户告警已失效，请刷新列表"
        },
        {
          "code": "40002",
          "meaning": "告警状态不允许处理",
          "frontendAdvice": "提示用户该告警已被处理，请刷新"
        },
        {
          "code": "40003",
          "meaning": "备注长度超过500字符",
          "frontendAdvice": "提示用户备注不能超过500字符"
        },
        {
          "code": "500",
          "meaning": "服务器内部错误",
          "frontendAdvice": "显示系统错误，请稍后重试"
        }
      ],
      "sourcePageKey": "sc-1-page-2-1"
    },
    "sc-2-page-1-0": {
      "key": "api-sc-2-page-1-0",
      "method": "GET",
      "name": "查询司机任务列表",
      "path": "/api/driver/tasks",
      "goal": "根据状态筛选条件获取当前司机的任务列表，用于司机端任务列表页展示",
      "trigger": "页面首次加载、下拉刷新、顶部筛选切换时调用",
      "requestParams": [
        {
          "name": "status",
          "type": "string",
          "required": false,
          "description": "任务状态筛选条件：全部(空或不传)/待接单/进行中/已完成"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "success",
        "data": {
          "tasks": [
            {
              "taskId": "string",
              "siteName": "string",
              "estimatedTime": "string",
              "vehiclePlate": "string",
              "materialOrderNo": "string",
              "status": "string"
            }
          ]
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
          "code": 401,
          "meaning": "用户未登录或token过期",
          "frontendAdvice": "跳转至登录页"
        },
        {
          "code": 403,
          "meaning": "用户无权访问该接口（非司机角色）",
          "frontendAdvice": "提示权限不足，返回工作台"
        },
        {
          "code": 500,
          "meaning": "服务器异常",
          "frontendAdvice": "显示网络异常提示，提供重试按钮"
        }
      ],
      "sourcePageKey": "sc-2-page-1-0"
    },
    "sc-2-page-2-1": {
      "key": "api-sc-2-page-2-1",
      "method": "POST",
      "name": "完成确认",
      "path": "/api/driver/tasks/{taskId}/complete",
      "goal": "司机上传现场照片并提交任务完成，系统将任务状态更新为已完成并触发后续同步",
      "trigger": "用户在任务状态为‘已到达’时点击【完成确认】按钮，弹出拍照/相册选择组件，上传至少1张照片后点击提交",
      "requestParams": [
        {
          "name": "taskId",
          "type": "string",
          "required": true,
          "description": "任务唯一标识，从路径参数获取"
        },
        {
          "name": "photos",
          "type": "array",
          "required": true,
          "description": "现场照片文件列表，至少1张，最多3张，支持jpg/png格式"
        },
        {
          "name": "completedTime",
          "type": "string",
          "required": false,
          "description": "客户端获取的完成时间，格式ISO 8601，如2025-03-20T14:30:00Z，为空则服务端自动记录"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "任务已完成",
        "data": {
          "taskId": "string",
          "status": "completed",
          "completedTime": "string",
          "arrivedTime": "string",
          "photosCount": "number"
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
          "meaning": "任务状态不是'已到达'，无法完成",
          "frontendAdvice": "提示司机必须先执行到达确认才能完成"
        },
        {
          "code": 4002,
          "meaning": "照片数量不满足要求（至少1张，最多3张）",
          "frontendAdvice": "提示司机按规范上传照片"
        },
        {
          "code": 4003,
          "meaning": "照片文件格式或大小不符合要求",
          "frontendAdvice": "提示司机选择符合要求的照片"
        },
        {
          "code": 5001,
          "meaning": "服务端内部错误",
          "frontendAdvice": "提示'提交失败，请稍后重试'，并记录日志"
        }
      ],
      "sourcePageKey": "sc-2-page-2-1"
    },
    "sc-3-page-1-0": {
      "key": "api-sc-3-page-1-0",
      "method": "GET",
      "name": "获取实时告警与司机反馈列表",
      "path": "/api/alerts/realtime",
      "goal": "按筛选条件获取当前调度员管辖范围内的实时车辆异常告警及司机反馈消息，支持分页与排序，为工作台顶部告警面板提供数据",
      "trigger": "进入页面时自动调用，后续通过下拉刷新或轮询触发",
      "requestParams": [
        {
          "name": "pageNum",
          "type": "integer",
          "required": false,
          "description": "页码，默认1"
        },
        {
          "name": "pageSize",
          "type": "integer",
          "required": false,
          "description": "每页条数，默认20"
        },
        {
          "name": "alertTypeFilter",
          "type": "string",
          "required": false,
          "description": "告警类型筛选，多个用逗号分隔，可选值：speeding(超速),zone_entry(禁入),abnormal_stay(异常停留),driver_feedback(司机反馈)"
        },
        {
          "name": "vehicleTypeFilter",
          "type": "string",
          "required": false,
          "description": "车辆类型筛选，多个用逗号分隔，可选值：production(生产),logistics(物流),outsource(外协),temporary(临时)"
        },
        {
          "name": "urgencyLevel",
          "type": "string",
          "required": false,
          "description": "紧急程度筛选，可选值：high(高),medium(中),low(低)"
        },
        {
          "name": "sortBy",
          "type": "string",
          "required": false,
          "description": "排序字段，可选值：alertTime(告警时间，默认降序),urgency(紧急程度降序)"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "total": 42,
          "pageNum": 1,
          "pageSize": 20,
          "records": [
            {
              "alertId": "alert_001",
              "vehicleId": "veh_123",
              "vehiclePlate": "粤B·12345",
              "alertType": "speeding",
              "alertTime": "2025-03-27T14:30:00+08:00",
              "location": "113.951,22.543",
              "description": "超速预警，当前车速35km/h",
              "urgencyLevel": "high",
              "isRead": false,
              "driverFeedback": null,
              "relatedTaskId": "task_456"
            }
          ]
        },
        "traceId": "trace-abc123"
      },
      "errorResponse": {
        "code": -1,
        "message": "系统繁忙，请稍后重试",
        "data": null,
        "traceId": "trace-def456"
      },
      "errorCodes": [
        {
          "code": 1001,
          "meaning": "权限不足，当前角色无查看告警权限",
          "frontendAdvice": "提示用户联系管理员开通调度权限"
        },
        {
          "code": 1002,
          "meaning": "参数错误，如非法的告警类型或页码格式",
          "frontendAdvice": "检查前端参数合法性，或显示通用错误提示"
        },
        {
          "code": 1003,
          "meaning": "数据源超时，告警服务响应超时",
          "frontendAdvice": "显示加载失败状态，提供重试按钮"
        },
        {
          "code": 1004,
          "meaning": "接口限流，请求过于频繁",
          "frontendAdvice": "降低轮询频率或等待后重试"
        }
      ],
      "sourcePageKey": "sc-3-page-1-0"
    },
    "sc-4-page-1-0": {
      "key": "api-sc-4-page-1-0",
      "method": "POST",
      "name": "车辆入场操作（放行/拒绝）",
      "path": "/api/gate/vehicle-action",
      "goal": "门岗人员对指定车辆执行放行或拒绝入场操作，触发道闸控制或生成拒绝记录。",
      "trigger": "用户点击“放行”或“拒绝”按钮并确认后触发。",
      "requestParams": [
        {
          "name": "vehicleId",
          "type": "string",
          "required": true,
          "description": "待核验车辆的唯一标识"
        },
        {
          "name": "action",
          "type": "string",
          "required": true,
          "description": "操作类型：allow（放行）或 reject（拒绝）"
        },
        {
          "name": "reason",
          "type": "string",
          "required": false,
          "description": "拒绝原因分类，当 action=reject 时必填；可选值：黑名单、证照过期、无预约、车辆不符、其他"
        },
        {
          "name": "remark",
          "type": "string",
          "required": false,
          "description": "拒绝操作时的详细说明，当 action=reject 时必填"
        },
        {
          "name": "operatorId",
          "type": "string",
          "required": false,
          "description": "操作员ID，默认由服务端从令牌获取，支持管理员代操作时传入"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "操作成功",
        "data": {
          "recordId": "string",
          "vehicleId": "string",
          "action": "string",
          "timestamp": "string",
          "gateStatus": "string"
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
          "meaning": "参数校验失败（如缺少必填字段、车牌格式错误）",
          "frontendAdvice": "提示用户检查输入信息"
        },
        {
          "code": 401,
          "meaning": "未登录或令牌过期",
          "frontendAdvice": "引导用户重新登录"
        },
        {
          "code": 403,
          "meaning": "当前用户无权限执行该操作",
          "frontendAdvice": "提示权限不足并联系管理员"
        },
        {
          "code": 404,
          "meaning": "车辆或预约任务不存在",
          "frontendAdvice": "提示已处理或数据异常，刷新列表"
        },
        {
          "code": 409,
          "meaning": "车辆操作冲突（如已被其他操作员处理）",
          "frontendAdvice": "提示车辆状态已变更，请刷新列表"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "请稍后重试或联系系统管理员"
        },
        {
          "code": 1001,
          "meaning": "道闸接口调用失败",
          "frontendAdvice": "放行操作失败，建议手动开关闸或降级处理"
        }
      ],
      "sourcePageKey": "sc-4-page-1-0"
    },
    "sc-4-page-2-1": {
      "key": "api-sc-4-page-2-1",
      "method": "GET",
      "name": "获取入场记录列表",
      "path": "/api/gate/entry-records",
      "goal": "支持按时间范围、车牌、操作结果、同步状态筛选历史入场处理记录，返回列表用于前端展示",
      "trigger": "页面加载或用户修改筛选条件后自动触发",
      "requestParams": [
        {
          "name": "startDate",
          "type": "string",
          "required": false,
          "description": "筛选时间范围的起始日期，格式YYYY-MM-DD"
        },
        {
          "name": "endDate",
          "type": "string",
          "required": false,
          "description": "筛选时间范围的结束日期，格式YYYY-MM-DD"
        },
        {
          "name": "plateNumber",
          "type": "string",
          "required": false,
          "description": "按车牌模糊搜索"
        },
        {
          "name": "operationResult",
          "type": "string",
          "required": false,
          "description": "筛选操作结果：PASS或REJECT"
        },
        {
          "name": "syncStatus",
          "type": "string",
          "required": false,
          "description": "筛选同步状态：PENDING/SYNCING/SYNCED/FAILED"
        },
        {
          "name": "page",
          "type": "integer",
          "required": false,
          "description": "页码，从1开始，默认1"
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
        "message": "成功",
        "data": {
          "records": [
            {
              "recordId": "string",
              "plateNumber": "string",
              "operationTime": "string (ISO datetime)",
              "operationResult": "string (PASS/REJECT)",
              "operator": "string",
              "syncStatus": "string (PENDING/SYNCING/SYNCED/FAILED)",
              "syncError": "string",
              "lastSyncTime": "string",
              "syncRetryCount": "integer"
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
        "message": "参数错误",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": 400,
          "meaning": "请求参数校验失败",
          "frontendAdvice": "检查筛选参数格式是否正确，如日期格式、枚举值"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "提示用户稍后重试，若持续失败联系管理员"
        }
      ],
      "sourcePageKey": "sc-4-page-2-1"
    },
    "sc-5-page-1-0": {
      "key": "api-sc-5-page-1-0",
      "method": "GET",
      "name": "获取运营报表概览数据",
      "path": "/api/reports/overview",
      "goal": "根据筛选条件返回指标卡片组和趋势图数据，用于渲染运营报表概览工作台",
      "trigger": "页面加载时自动请求；用户点击“查询”按钮或任何筛选条件变更（时间范围、车辆类型、作业区域）后重新请求；切换趋势图指标或粒度时也重新请求",
      "requestParams": [
        {
          "name": "timeRangeType",
          "type": "string",
          "required": true,
          "description": "预定义时间范围：今日(day)/本周(week)/本月(month)/自定义(custom)"
        },
        {
          "name": "startDate",
          "type": "string",
          "required": false,
          "description": "开始日期，格式YYYY-MM-DD，当timeRangeType为custom时必填"
        },
        {
          "name": "endDate",
          "type": "string",
          "required": false,
          "description": "结束日期，格式YYYY-MM-DD，必须大于等于startDate，当timeRangeType为custom时必填"
        },
        {
          "name": "vehicleTypes",
          "type": "string",
          "required": false,
          "description": "车辆类型多选，多个值用逗号分隔，可选值：production,logistics,outsource,temporary"
        },
        {
          "name": "areas",
          "type": "string",
          "required": false,
          "description": "作业区域多选，多个值用逗号分隔，根据系统配置动态加载"
        },
        {
          "name": "metric",
          "type": "string",
          "required": false,
          "description": "趋势图指标，默认utilization。可选值：utilization(车辆利用率),taskCompletionRate(任务完成率),avgWaitTime(平均等待时长),emptyRate(空驶率),queuedCount(排队车辆数)"
        },
        {
          "name": "granularity",
          "type": "string",
          "required": false,
          "description": "趋势图粒度，默认day。可选值：day(日趋势),week(周趋势),month(月趋势)"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "成功",
        "data": {
          "indicators": [
            {
              "name": "车辆利用率",
              "key": "utilization",
              "value": 82.5,
              "unit": "%",
              "changeDirection": "up",
              "changeRate": 2.1,
              "tooltip": "车辆利用率 = 使用时长 / 可用时长"
            },
            {
              "name": "任务完成率",
              "key": "taskCompletionRate",
              "value": 91.2,
              "unit": "%",
              "changeDirection": "up",
              "changeRate": 0.8,
              "tooltip": "已完成任务数 / 总任务数"
            },
            {
              "name": "平均等待时长",
              "key": "avgWaitTime",
              "value": 4.3,
              "unit": "分钟",
              "changeDirection": "down",
              "changeRate": -1.5,
              "tooltip": "车辆排队等待到开始执行的平均时间"
            },
            {
              "name": "空驶率",
              "key": "emptyRate",
              "value": 15.7,
              "unit": "%",
              "changeDirection": "up",
              "changeRate": 0.3,
              "tooltip": "空驶里程 / 总里程"
            },
            {
              "name": "排队车辆数",
              "key": "queuedCount",
              "value": 8,
              "unit": "辆",
              "changeDirection": "down",
              "changeRate": -2,
              "tooltip": "当前处于排队状态的车辆数（瞬时值）"
            }
          ],
          "trend": {
            "metric": "utilization",
            "granularity": "day",
            "dataPoints": [
              {
                "date": "2025-03-01",
                "value": 80.2
              },
              {
                "date": "2025-03-02",
                "value": 83.1
              }
            ]
          }
        },
        "traceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
      },
      "errorResponse": {
        "code": -1,
        "message": "系统繁忙，请稍后重试",
        "data": null,
        "traceId": "x1y2z3w4-v5b6-7890-abcd-ef1234567890"
      },
      "errorCodes": [
        {
          "code": 400,
          "meaning": "请求参数校验失败（如结束日期早于开始日期、必填项缺失）",
          "frontendAdvice": "根据后端返回的message提示用户修改参数"
        },
        {
          "code": 401,
          "meaning": "用户未登录或登录已过期",
          "frontendAdvice": "跳转到登录页"
        },
        {
          "code": 403,
          "meaning": "当前用户无权限查看报表数据",
          "frontendAdvice": "显示无权限提示，并引导联系管理员"
        },
        {
          "code": 404,
          "meaning": "请求的资源不存在（如所选区域ID非法）",
          "frontendAdvice": "提示用户检查筛选条件"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "显示“系统异常，请稍后重试”，并提供重试按钮"
        },
        {
          "code": 503,
          "meaning": "服务暂时不可用",
          "frontendAdvice": "显示维护中的提示，并建议稍后访问"
        }
      ],
      "sourcePageKey": "sc-5-page-1-0"
    },
    "sc-6-page-1-0": {
      "key": "api-sc-6-page-1-0",
      "method": "POST",
      "name": "批准预约申请",
      "path": "/api/reservations/{id}/approve",
      "goal": "审批通过预约申请，生成授权码并触发门禁同步",
      "trigger": "用户点击「通过」按钮并确认后调用",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": true,
          "description": "预约申请ID（路径参数）"
        },
        {
          "name": "reason",
          "type": "string",
          "required": false,
          "description": "审批意见，通过时选填"
        },
        {
          "name": "force",
          "type": "boolean",
          "required": false,
          "description": "是否强制通过（车辆证照过期时需为true）"
        }
      ],
      "successResponse": {
        "code": "0",
        "message": "操作成功",
        "data": {
          "reservationId": "",
          "approvalStatus": "approved",
          "accessCode": "",
          "syncStatus": "pending|synced|failed",
          "syncMessage": "门禁同步结果描述"
        },
        "traceId": ""
      },
      "errorResponse": {
        "code": "-1",
        "message": "操作失败",
        "data": null,
        "traceId": ""
      },
      "errorCodes": [
        {
          "code": "400",
          "meaning": "请求参数错误",
          "frontendAdvice": "检查参数是否正确"
        },
        {
          "code": "403",
          "meaning": "无审批权限",
          "frontendAdvice": "联系管理员获取权限"
        },
        {
          "code": "404",
          "meaning": "预约申请不存在",
          "frontendAdvice": "请刷新列表重试"
        },
        {
          "code": "409",
          "meaning": "预约申请状态已变更，无法操作",
          "frontendAdvice": "请刷新列表后重试"
        },
        {
          "code": "500",
          "meaning": "服务端内部错误",
          "frontendAdvice": "请稍后重试"
        }
      ],
      "sourcePageKey": "sc-6-page-1-0"
    },
    "sc-6-page-2-1": {
      "key": "api-sc-6-page-2-1",
      "method": "GET",
      "name": "获取授权码列表",
      "path": "/api/access-codes",
      "goal": "分页查询授权码列表，支持按同步状态筛选和车牌号模糊搜索",
      "trigger": "页面加载、切换状态筛选标签、点击搜索按钮或回车、分页切换",
      "requestParams": [
        {
          "name": "status",
          "type": "string",
          "required": false,
          "description": "同步状态筛选：ALL, SYNC_SUCCESS, SYNC_FAIL, PENDING_SYNC, EXPIRED, USED"
        },
        {
          "name": "keyword",
          "type": "string",
          "required": false,
          "description": "车牌号模糊搜索"
        },
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
          "description": "每页条数，默认20"
        }
      ],
      "successResponse": {
        "code": "0",
        "message": "success",
        "data": {
          "page": {
            "current": 1,
            "pageSize": 20,
            "total": 100
          },
          "records": [
            {
              "id": "string",
              "applyId": "string",
              "plateNumber": "string",
              "accessCode": "string",
              "generatedTime": "string",
              "validStartTime": "string",
              "validEndTime": "string",
              "syncStatus": "string",
              "syncFailReason": "string",
              "entryTime": "string",
              "exitTime": "string",
              "gateId": "string"
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
          "code": "400",
          "meaning": "请求参数错误（如分页参数非法）",
          "frontendAdvice": "提示用户检查筛选条件后重试"
        },
        {
          "code": "401",
          "meaning": "未登录或token过期",
          "frontendAdvice": "跳转登录页"
        },
        {
          "code": "403",
          "meaning": "无权限访问该接口",
          "frontendAdvice": "提示用户联系管理员获取权限"
        },
        {
          "code": "500",
          "meaning": "服务器内部错误",
          "frontendAdvice": "显示错误提示，并提供重试按钮"
        }
      ],
      "sourcePageKey": "sc-6-page-2-1"
    },
    "sc-6-page-3-2": {
      "key": "api-sc-6-page-3-2",
      "method": "GET",
      "name": "查询历史预约记录",
      "path": "/api/reservations/history",
      "goal": "根据筛选条件分页查询历史预约记录，返回审批状态、授权码、入场/出场时间及费用等信息",
      "trigger": "页面加载或筛选条件变更时自动触发",
      "requestParams": [
        {
          "name": "startTime",
          "type": "string",
          "required": false,
          "description": "筛选起始日期，格式 yyyy-MM-dd，与 endTime 配合使用，跨度不得超过90天"
        },
        {
          "name": "endTime",
          "type": "string",
          "required": false,
          "description": "筛选结束日期，格式 yyyy-MM-dd，不得早于 startTime"
        },
        {
          "name": "vehicleId",
          "type": "string",
          "required": false,
          "description": "车辆ID，支持模糊搜索（至少输入2字符）"
        },
        {
          "name": "unit",
          "type": "string",
          "required": false,
          "description": "所属单位，支持多选，逗号分隔"
        },
        {
          "name": "area",
          "type": "string",
          "required": false,
          "description": "作业区域"
        },
        {
          "name": "status",
          "type": "string",
          "required": false,
          "description": "审批状态：待审批、已通过、已驳回等"
        },
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
          "description": "每页条数，默认20"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "查询成功",
        "data": {
          "content": [
            {
              "id": 1,
              "vehicleLicense": "沪A12345",
              "unit": "物流部",
              "area": "东区",
              "status": "已通过",
              "authCode": "AC123456",
              "entryTime": "2025-01-15 08:30:00",
              "exitTime": "2025-01-15 17:30:00",
              "cost": 120.5,
              "settled": false
            }
          ],
          "totalElements": 100,
          "totalPages": 5,
          "page": 1,
          "size": 20
        },
        "traceId": "a1b2c3d4"
      },
      "errorResponse": {
        "code": 400,
        "message": "请求参数错误",
        "data": {},
        "traceId": "e5f6g7h8"
      },
      "errorCodes": [
        {
          "code": 400,
          "meaning": "参数校验失败（如日期格式错误、跨度超限）",
          "frontendAdvice": "根据后端返回的字段错误提示修正表单"
        },
        {
          "code": 401,
          "meaning": "未认证或登录过期",
          "frontendAdvice": "跳转登录页重新认证"
        },
        {
          "code": 403,
          "meaning": "无权限查看历史记录",
          "frontendAdvice": "提示用户联系管理员"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "提示『系统繁忙，请稍后重试』"
        }
      ],
      "sourcePageKey": "sc-6-page-3-2"
    },
    "sc-7-page-1-0": {
      "key": "api-sc-7-page-1-0",
      "method": "GET",
      "name": "车辆列表查询",
      "path": "/api/vehicles",
      "goal": "获取车辆档案列表，支持多维筛选和模糊搜索，用于管理员查看和管理车辆。",
      "trigger": "页面加载、筛选条件变化（防抖300ms）、搜索回车、点击分页或修改每页条数时触发",
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
          "description": "每页条数，默认20"
        },
        {
          "name": "vehicleType",
          "type": "string",
          "required": false,
          "description": "车辆类型筛选，可选值：生产车辆,物流车辆,外协车辆,临时车辆"
        },
        {
          "name": "orgId",
          "type": "string",
          "required": false,
          "description": "所属单位ID"
        },
        {
          "name": "status",
          "type": "string",
          "required": false,
          "description": "车辆状态筛选，可选值：正常,停用"
        },
        {
          "name": "expireStatus",
          "type": "string",
          "required": false,
          "description": "有效期状态筛选，可选值：临近到期,已过期,正常"
        },
        {
          "name": "keyword",
          "type": "string",
          "required": false,
          "description": "搜索关键字，模糊匹配车牌号或司机姓名"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "操作成功",
        "data": {
          "records": [
            {
              "id": "string",
              "plateNumber": "string",
              "vehicleType": "string",
              "orgName": "string",
              "driverName": "string",
              "status": "string",
              "annualInspectionExpire": "string",
              "insuranceExpire": "string",
              "accessExpire": "string",
              "expireStatus": "string",
              "remainingDays": "integer"
            }
          ],
          "total": 100,
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
          "meaning": "请求参数错误（如分页参数无效、筛选值不合法）",
          "frontendAdvice": "提示用户检查筛选条件或联系管理员"
        },
        {
          "code": 401,
          "meaning": "未认证或会话过期",
          "frontendAdvice": "跳转登录页"
        },
        {
          "code": 403,
          "meaning": "无权限查看车辆档案",
          "frontendAdvice": "提示权限不足"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "提示“系统繁忙，请稍后重试”并显示重试按钮"
        }
      ],
      "sourcePageKey": "sc-7-page-1-0"
    },
    "sc-7-page-2-1": {
      "key": "api-sc-7-page-2-1",
      "method": "POST",
      "name": "保存车辆档案",
      "path": "/api/vehicles",
      "goal": "新增一辆车辆或编辑已有车辆的基础档案信息，包括车辆类型、车牌号、所属单位、司机信息、有效期等。",
      "trigger": "用户点击保存按钮，且前端校验（必填项、日期逻辑、车牌号格式）通过后触发。",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": false,
          "description": "车辆ID，编辑模式时必传；新增模式时不传"
        },
        {
          "name": "vehicleType",
          "type": "string",
          "required": true,
          "description": "车辆类型枚举值"
        },
        {
          "name": "plateNumber",
          "type": "string",
          "required": true,
          "description": "车牌号，需符合格式且唯一"
        },
        {
          "name": "department",
          "type": "string",
          "required": true,
          "description": "所属单位ID或编码"
        },
        {
          "name": "driverName",
          "type": "string",
          "required": false,
          "description": "司机姓名"
        },
        {
          "name": "driverPhone",
          "type": "string",
          "required": false,
          "description": "司机电话"
        },
        {
          "name": "annualInspectionDate",
          "type": "string",
          "required": false,
          "description": "年检有效期，格式YYYY-MM-DD，不能早于当天"
        },
        {
          "name": "insuranceDate",
          "type": "string",
          "required": false,
          "description": "保险有效期，格式YYYY-MM-DD，不能早于当天"
        },
        {
          "name": "accessPermitDate",
          "type": "string",
          "required": false,
          "description": "准入有效期，格式YYYY-MM-DD，不能早于当天"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "操作成功",
        "data": {
          "id": "string"
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 400,
        "message": "校验失败或业务错误",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": 400,
          "meaning": "请求参数校验失败（如必填字段缺失、日期格式错误、车牌号重复）",
          "frontendAdvice": "根据具体错误信息提示用户，并高亮对应字段"
        },
        {
          "code": 409,
          "meaning": "车牌号已存在（唯一性冲突）",
          "frontendAdvice": "提示用户车牌号已被占用，请修改"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "显示通用错误提示，建议稍后重试"
        }
      ],
      "sourcePageKey": "sc-7-page-2-1"
    },
    "sc-7-page-3-2": {
      "key": "api-sc-7-page-3-2",
      "method": "GET",
      "name": "操作日志查询",
      "path": "/api/vehicles/logs",
      "goal": "根据筛选条件分页查询操作日志列表",
      "trigger": "页面加载时自动发起，筛选条件变化（防抖300ms）后自动刷新",
      "requestParams": [
        {
          "name": "startTime",
          "type": "string",
          "required": false,
          "description": "筛选的开始日期，格式 yyyy-MM-dd"
        },
        {
          "name": "endTime",
          "type": "string",
          "required": false,
          "description": "筛选的结束日期，格式 yyyy-MM-dd"
        },
        {
          "name": "operator",
          "type": "string",
          "required": false,
          "description": "操作人用户名或ID"
        },
        {
          "name": "actionTypes",
          "type": "string",
          "required": false,
          "description": "操作类型，多选用逗号分隔，可选值：新增,编辑,停用,启用,上传证照,删除证照"
        },
        {
          "name": "vehicleId",
          "type": "string",
          "required": false,
          "description": "关联车辆ID，支持多选，多个ID用逗号分隔"
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
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "success",
        "data": {
          "total": 0,
          "page": 1,
          "size": 20,
          "records": [
            {
              "logId": 123,
              "operator": "张三",
              "actionType": "编辑",
              "vehicleId": "V001",
              "plateNumber": "京A12345",
              "changeSummary": "修改了车辆品牌",
              "createdAt": "2025-04-10 10:30:00",
              "detail": {
                "before": {
                  "brand": "品牌A"
                },
                "after": {
                  "brand": "品牌B"
                }
              }
            }
          ]
        },
        "traceId": "xxx"
      },
      "errorResponse": {
        "code": 400,
        "message": "参数错误",
        "data": null,
        "traceId": "xxx"
      },
      "errorCodes": [
        {
          "code": 400,
          "meaning": "请求参数校验失败，如日期格式错误",
          "frontendAdvice": "检查输入的日期格式；确保结束日期不早于开始日期"
        },
        {
          "code": 401,
          "meaning": "未授权或无权限",
          "frontendAdvice": "提示用户登录或检查权限"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "提示用户稍后重试或联系管理员"
        }
      ],
      "sourcePageKey": "sc-7-page-3-2"
    },
    "sc-5-page-2-1": {
      "key": "api-sc-5-page-2-1",
      "method": "GET",
      "name": "获取明细数据",
      "path": "/api/reports/detail",
      "goal": "根据筛选条件获取当前明细类型下的表格数据，支持搜索、排序、分页",
      "trigger": "页面加载、切换明细类型标签、切换筛选条件、搜索、排序、分页时触发",
      "requestParams": [
        {
          "name": "timeRange",
          "type": "string",
          "required": false,
          "description": "时间范围，格式如'2024-01-01~2024-01-31'"
        },
        {
          "name": "vehicleType",
          "type": "string",
          "required": false,
          "description": "车辆类型"
        },
        {
          "name": "area",
          "type": "string",
          "required": false,
          "description": "作业区域"
        },
        {
          "name": "detailType",
          "type": "string",
          "required": true,
          "description": "明细类型：outsourcingFee（外协费用）/abnormalEntry（异常入场）/schedulingAnalysis（排班排队分析）"
        },
        {
          "name": "keyword",
          "type": "string",
          "required": false,
          "description": "搜索关键字，支持按车辆、司机、任务模糊匹配"
        },
        {
          "name": "sortField",
          "type": "string",
          "required": false,
          "description": "排序字段名，如'feeAmount','entryTime'等"
        },
        {
          "name": "sortOrder",
          "type": "string",
          "required": false,
          "description": "排序顺序：asc或desc"
        },
        {
          "name": "page",
          "type": "number",
          "required": true,
          "description": "当前页码，从1开始"
        },
        {
          "name": "pageSize",
          "type": "number",
          "required": true,
          "description": "每页条数，如20"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "success",
        "data": {
          "total": 128,
          "page": 1,
          "pageSize": 20,
          "list": [
            {
              "id": "001",
              "vehicleNo": "沪A12345",
              "driverName": "张三",
              "entryTime": "2024-01-15 08:30:00",
              "exitTime": "2024-01-15 17:30:00",
              "area": "A区",
              "feeAmount": 1500,
              "chargingType": "按时计费"
            }
          ]
        },
        "traceId": "xxx"
      },
      "errorResponse": {
        "code": 500,
        "message": "Internal Server Error",
        "data": null,
        "traceId": "xxx"
      },
      "errorCodes": [
        {
          "code": 400,
          "meaning": "请求参数不合法",
          "frontendAdvice": "检查筛选条件参数格式是否正确"
        },
        {
          "code": 403,
          "meaning": "无权限访问该数据",
          "frontendAdvice": "提示用户无权限，或跳转登录页"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "显示加载失败提示，提供重试按钮"
        }
      ],
      "sourcePageKey": "sc-5-page-2-1"
    },
    "sc-3-page-2-1": {
      "key": "api-sc-3-page-2-1",
      "method": "POST",
      "name": "提交任务调整与异常处理",
      "path": "/api/tasks/adjustment",
      "goal": "对选中车辆/任务执行改派、取消或加派操作，同时提交异常处理记录，更新任务状态并生成操作日志。",
      "trigger": "用户在确认弹窗中点击确认后触发",
      "requestParams": [
        {
          "name": "taskId",
          "type": "string",
          "required": true,
          "description": "当前任务ID，从路由参数传入"
        },
        {
          "name": "vehicleId",
          "type": "string",
          "required": true,
          "description": "当前车辆ID，从路由参数传入"
        },
        {
          "name": "operationType",
          "type": "string",
          "required": true,
          "description": "操作类型，可选值：reassign（改派）、cancel（取消）、add（加派）"
        },
        {
          "name": "reassignDriverId",
          "type": "string",
          "required": false,
          "description": "当operationType为reassign时必填，目标司机ID"
        },
        {
          "name": "reassignReason",
          "type": "string",
          "required": false,
          "description": "当operationType为reassign时必填，改派原因"
        },
        {
          "name": "cancelReason",
          "type": "string",
          "required": false,
          "description": "当operationType为cancel时必填，取消原因"
        },
        {
          "name": "addLocation",
          "type": "string",
          "required": false,
          "description": "当operationType为add时必填，作业地点"
        },
        {
          "name": "addEstimatedTime",
          "type": "string",
          "required": false,
          "description": "当operationType为add时必填，预计时间，格式ISO 8601"
        },
        {
          "name": "addRequirements",
          "type": "string",
          "required": false,
          "description": "当operationType为add时可选，工作要求"
        },
        {
          "name": "incidentReason",
          "type": "string",
          "required": true,
          "description": "异常处理记录的处理原因"
        },
        {
          "name": "incidentNote",
          "type": "string",
          "required": false,
          "description": "异常处理记录的备注"
        },
        {
          "name": "attachments",
          "type": "file",
          "required": false,
          "description": "附件图片文件，支持多文件上传，格式jpg/png，单张不超过5MB"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "操作成功",
        "data": {
          "adjustmentId": "string",
          "incidentRecordId": "string"
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
          "meaning": "必填参数缺失",
          "frontendAdvice": "检查请求参数，确保根据操作类型填写了所有必填字段"
        },
        {
          "code": 4002,
          "meaning": "车辆当前有未完成任务，无法加派",
          "frontendAdvice": "提示用户车辆繁忙，建议选择其他车辆或等待"
        },
        {
          "code": 4003,
          "meaning": "任务已开始执行，无法取消",
          "frontendAdvice": "提示用户任务已开始，无法取消"
        },
        {
          "code": 4004,
          "meaning": "目标司机当前不可用",
          "frontendAdvice": "提示用户选择其他司机"
        },
        {
          "code": 5001,
          "meaning": "服务器内部错误",
          "frontendAdvice": "提示用户稍后重试"
        }
      ],
      "sourcePageKey": "sc-3-page-2-1"
    }
  },
  "scenarioPageGroups": [
    {
      "key": "sc-1",
      "name": "调度员实时调度派车与异常监控",
      "priority": "P0",
      "pages": [
        {
          "key": "sc-1-page-1-0",
          "priority": "P0",
          "type": "工作台页",
          "name": "调度员实时调度派车工作台",
          "vueFile": "DispatchWorkbenchView.vue",
          "goal": "调度员集中管理实时车辆状态、接收用车需求、执行派车操作，以地图和状态看板为核心支撑高效调度。",
          "features": [
            "车辆实时地图监控",
            "车辆状态看板",
            "用车需求管理",
            "智能派车操作面板"
          ],
          "sections": [
            "地图区域（左侧主区域）：显示车辆位置、状态、轨迹，支持缩放和点击弹窗",
            "状态看板区域（右侧顶部）：卡片式统计空闲/任务中/排队/异常车辆数量，可点击筛选",
            "需求列表区域（右侧中部）：展示待处理用车需求（含生产计划推送），支持排序和派车按钮",
            "派车操作面板（右侧底部/浮动弹窗）：选择车辆、确认派车、查看推荐车辆详情"
          ],
          "states": [
            "正常态：地图加载车辆位置、看板显示统计数据、需求列表有数据、派车面板就绪",
            "空态：无车辆在线或无可调度车辆时，地图显示空区域提示，看板显示0，需求列表为空并提示“暂无待处理需求”",
            "加载态：初次加载或数据刷新时，地图和列表显示骨架屏或加载动画",
            "异常态：接口超时或数据异常时，显示错误提示和重试按钮；GPS数据中断时地图显示车辆离线标记"
          ],
          "keyInteractions": [
            "地图点击车辆弹出信息卡片（车牌、司机、速度、任务）",
            "状态看板点击分类跳转至对应车辆列表并在地图高亮",
            "需求列表点击“派车”打开派车面板，自动推荐可用车辆",
            "派车面板确认后刷新地图和看板状态，并推送消息给司机",
            "地图支持框选区域筛选车辆并同步至看板和需求列表"
          ],
          "dataInputs": [
            "GET /api/v1/vehicles/realtime-locations (返回所有车辆实时位置、速度、状态)",
            "GET /api/v1/vehicles/status-summary (返回各状态统计)",
            "GET /api/v1/request/demand-list (返回待处理用车需求列表)",
            "GET /api/v1/vehicles/available (返回推荐可用车辆列表，含距离、类型匹配)",
            "POST /api/v1/tasks/dispatch (提交派车请求，返回任务ID和状态)"
          ],
          "originalPageKey": "page-1",
          "scenarioKey": "sc-1",
          "scenarioName": "调度员实时调度派车与异常监控"
        },
        {
          "key": "sc-1-page-2-1",
          "priority": "P0",
          "type": "看板页",
          "name": "异常告警与任务跟踪看板",
          "vueFile": "AlertAndTaskMonitorView.vue",
          "goal": "实时监控车辆异常告警（超速、禁入、异常停留）并处理，同时跟踪已派发任务的执行进度，支持干预操作。",
          "features": [
            "异常告警分级处理",
            "任务下发记录与状态跟踪"
          ],
          "sections": [
            "告警列表区域（左侧）：按时间倒序展示告警事件，支持状态筛选和严重程度颜色标识",
            "告警处理弹窗（点击告警后弹出）：展示告警详情、车辆信息、位置，提供确认/忽略/转人工按钮及备注输入",
            "任务列表区域（右侧）：展示所有已派发任务的状态和进度，支持筛选和查看详情",
            "任务详情抽屉（点击任务后展开）：显示任务步骤时间戳、司机操作记录、现场照片、关联告警记录"
          ],
          "states": [
            "正常态：告警列表和任务列表正常显示，数据实时刷新",
            "空态：无未处理告警时显示“暂无告警”，无任务时显示“暂无任务”",
            "加载态：数据加载时列表显示骨架屏",
            "异常态：告警或任务数据获取失败时显示错误提示"
          ],
          "keyInteractions": [
            "告警列表项点击后弹窗展示详情，并在地图中定位（可调用地图组件，此处假设通过传参或路由跳转到工作台地图定位）",
            "告警处理按钮触发API变更状态，处理后列表即时更新",
            "任务列表支持按状态（待接收/进行中/已完成/异常）筛选",
            "任务详情中可点击“催办”或“取消”按钮，触发对应API",
            "告警和任务均支持导出Excel（预留接口）"
          ],
          "dataInputs": [
            "GET /api/v1/alerts/list (返回告警列表，支持分页和状态过滤)",
            "POST /api/v1/alerts/handle (提交告警处理结果)",
            "GET /api/v1/tasks/history (返回任务列表，支持状态过滤)",
            "POST /api/v1/tasks/remind (发送催办通知)",
            "POST /api/v1/tasks/cancel (取消任务并附带原因)",
            "GET /api/v1/tasks/{id}/detail (获取任务详细时间线和照片)"
          ],
          "originalPageKey": "page-2",
          "scenarioKey": "sc-1",
          "scenarioName": "调度员实时调度派车与异常监控"
        }
      ]
    },
    {
      "key": "sc-2",
      "name": "司机移动端任务接收与执行",
      "priority": "P0",
      "pages": [
        {
          "key": "sc-2-page-1-0",
          "priority": "P0",
          "type": "列表页",
          "name": "司机移动端任务列表",
          "vueFile": "DriverTaskListView.vue",
          "goal": "司机查看并确认接单，管理待接单、进行中、已完成的任务",
          "features": [
            "任务列表与接单确认"
          ],
          "sections": [
            "顶部状态筛选栏（全部/待接单/进行中/已完成）",
            "任务卡片列表区（每项显示任务ID、作业点名称、预计时间、车牌、状态标签）",
            "底部导航栏（回到工作台等）",
            "未读推送通知角标"
          ],
          "states": [
            "正常态：展示任务列表，支持下拉刷新",
            "空态：无任务时显示空状态提示（如'暂无任务'）",
            "加载态：首次加载或下拉刷新时显示加载动画",
            "异常态：网络请求失败时显示错误提示和重试按钮"
          ],
          "keyInteractions": [
            "下拉刷新触发 GET /api/driver/tasks?status=...",
            "点击任务卡片跳转至 DriverTaskExecuteView.vue 并传入 taskId",
            "在待接单任务上点击「确认接单」按钮，调用 POST /api/driver/tasks/{taskId}/accept，成功后更新卡片状态为进行中并刷新列表",
            "顶部筛选栏切换时过滤任务列表，更新页面数据",
            "点击推送通知直接跳转至对应任务详情"
          ],
          "dataInputs": [
            "任务列表数据（任务ID、作业点名称、预计时间、车辆车牌、物资提货单号、状态）",
            "推送通知消息（从消息中心获取，显示未读数量）",
            "车辆台账信息（仅用于显示车牌、类型，从管理员维护的台账获取）"
          ],
          "originalPageKey": "page-1",
          "scenarioKey": "sc-2",
          "scenarioName": "司机移动端任务接收与执行"
        },
        {
          "key": "sc-2-page-2-1",
          "priority": "P0",
          "type": "详情页",
          "name": "司机移动端任务执行",
          "vueFile": "DriverTaskExecuteView.vue",
          "goal": "司机查看任务完整详情、导航到作业点、确认到达与完成、发起异常反馈",
          "features": [
            "任务详情与导航启动",
            "任务到达与完成确认",
            "异常反馈与协助请求"
          ],
          "sections": [
            "顶部导航栏（返回按钮、任务ID、状态标签）",
            "任务信息卡片区（作业点名称/地址/经纬度、预计时间、关联物资提货单号、车牌、司机手机号、调度员联系电话）",
            "操作按钮区（导航按钮、到达确认按钮、完成确认按钮）",
            "照片上传区域（拍照/相册选择、预览、删除）",
            "异常反馈入口（按钮，点击后弹出反馈表单）",
            "历史反馈记录列表（可展开查看）"
          ],
          "states": [
            "正常态：展示任务详情和对应状态下的操作按钮",
            "加载态：从列表页跳转后加载详情数据时显示骨架屏",
            "异常态：接口失败时显示错误提示和重试按钮；物资系统接口调用失败时显示提示但不阻塞导航",
            "已到达状态：到达确认按钮变灰禁用，完成确认按钮可用",
            "已完成状态：所有操作按钮置灰禁用，显示完成时间",
            "空态：如果历史反馈无记录，显示'暂无反馈'"
          ],
          "keyInteractions": [
            "页面加载时调用 GET /api/driver/tasks/{taskId} 获取详情数据",
            "点击导航按钮调用系统地图APP（通过URL Scheme传入经纬度或地址）",
            "点击司机手机号或调度员电话直接拨号",
            "点击关联物资提货单号跳转至物资详情（需调用物资系统接口）",
            "点击到达确认按钮调用 POST /api/driver/tasks/{taskId}/arrive，按钮锁定，状态更新为已到达",
            "点击完成确认按钮弹出拍照/相册选择，上传至少1张照片后调用 POST /api/driver/tasks/{taskId}/complete，上传完成后任务状态更新为已完成，状态同步至后端",
            "点击异常反馈按钮弹出反馈表单，选择类型、填写描述、可选上传照片，提交后调用 POST /api/driver/feedback，生成异常事件并推送至调度员",
            "展开历史反馈列表调用 GET /api/driver/feedbacks?taskId=...",
            "任务状态变更时自动触发状态同步至门禁系统和物资系统，若同步失败在底部提示（非阻塞）"
          ],
          "dataInputs": [
            "任务详情数据（作业点坐标、地址、预计到达时间、物资提货单号、车辆基本信息、调度员联系方式）",
            "车辆基本信息（车牌、司机联系方式，来自车辆台账）",
            "物资提货单详情（如果跳转，需物资系统接口返回）",
            "照片文件（拍照或相册选择，最多3张，必需至少1张用于完成确认）",
            "异常反馈数据（异常类型枚举、文字描述、可选照片）",
            "历史反馈记录（反馈ID、类型、描述、处理状态、时间）"
          ],
          "originalPageKey": "page-2",
          "scenarioKey": "sc-2",
          "scenarioName": "司机移动端任务接收与执行"
        }
      ]
    },
    {
      "key": "sc-3",
      "name": "现场调度员移动端临时调整与异常处理",
      "priority": "P1",
      "pages": [
        {
          "key": "sc-3-page-1-0",
          "priority": "P0",
          "type": "工作台页",
          "name": "现场调度移动端工作台",
          "vueFile": "MobileDispatchView.vue",
          "goal": "实时接收异常告警与司机反馈，查看周边车辆状态，并与司机即时通讯，快速发起任务调整。",
          "features": [
            "异常告警与司机反馈接收面板",
            "周边车辆实时状态视图",
            "即时通讯面板"
          ],
          "sections": [
            "顶部告警与反馈滚动通知栏（折叠/展开）",
            "中央车辆地图/列表视图（可切换）",
            "底部浮动操作栏（包含通讯入口、快速调整按钮）",
            "即时通讯面板（从底部弹出，含消息列表和输入框）"
          ],
          "states": [
            "正常态：告警数据与车辆数据加载完成，地图显示车辆标记",
            "空态：无告警且无周边车辆，显示提示信息",
            "加载态：正在获取告警和车辆数据，显示加载动画",
            "异常态：网络错误或数据加载失败，显示重试按钮"
          ],
          "keyInteractions": [
            "点击告警项弹出快捷操作菜单（查看车辆详情、发起通讯、转派任务）",
            "点击车辆标记弹出信息卡片（含司机联系方式、当前任务、调整按钮）",
            "点击通讯按钮展开即时通讯面板，与指定司机实时对话",
            "切换地图/列表视图（右上角切换图标）",
            "下拉刷新告警和车辆数据"
          ],
          "dataInputs": [
            "告警列表（GET /api/alerts/realtime）",
            "周边车辆列表（GET /api/vehicles/nearby）",
            "即时通讯消息（WebSocket）"
          ],
          "originalPageKey": "page-1",
          "scenarioKey": "sc-3",
          "scenarioName": "现场调度员移动端临时调整与异常处理"
        },
        {
          "key": "sc-3-page-2-1",
          "priority": "P0",
          "type": "表单页",
          "name": "任务调整与异常上报",
          "vueFile": "TaskAdjustView.vue",
          "goal": "对选中车辆/任务执行改派、取消或新增临时任务，并填写异常处理记录提交上报。",
          "features": [
            "任务调整操作（改派/取消/加派）",
            "异常处理记录与上报表单"
          ],
          "sections": [
            "顶部任务/车辆信息摘要区（车牌、司机、任务描述）",
            "操作类型选择按钮组（改派、取消、加派）",
            "操作表单区（根据选择动态显示：改派→司机选择列表；取消→确认原因；加派→作业点、时间、要求）",
            "异常处理记录区（处理原因、备注、附件上传）",
            "底部提交确认按钮区"
          ],
          "states": [
            "正常态：信息加载完成，表单可编辑",
            "加载态：提交中，显示加载遮罩",
            "异常态：提交失败，显示错误消息并可重新提交",
            "空态：未传入有效任务/车辆数据，显示错误提示"
          ],
          "keyInteractions": [
            "选择操作类型后切换显示对应表单内容",
            "改派时弹出司机选择列表（从周边空闲司机中选取）",
            "新增临时任务时弹出作业点选择/输入，并填写预计时间",
            "提交前二次确认弹窗（显示操作摘要）",
            "提交成功后自动返回主工作台页面并刷新列表"
          ],
          "dataInputs": [
            "当前任务/车辆详情（从主页面路由参数传入）",
            "可用司机列表（GET /api/drivers/available）",
            "作业地点列表（GET /api/locations）或用户手动输入",
            "附件图片文件（通过拍照或相册选取）",
            "处理原因文本"
          ],
          "originalPageKey": "page-2",
          "scenarioKey": "sc-3",
          "scenarioName": "现场调度员移动端临时调整与异常处理"
        }
      ]
    },
    {
      "key": "sc-4",
      "name": "门岗车辆入场核验与放行",
      "priority": "P1",
      "pages": [
        {
          "key": "sc-4-page-1-0",
          "priority": "P0",
          "type": "工作台页",
          "name": "门岗车辆入场核验与放行工作台",
          "vueFile": "GateAccessCheckView.vue",
          "goal": "门岗人员在固定终端上实时查看待核验车辆、查看核验详情、执行放行或拒绝操作，并在接口异常时进行降级处理。",
          "features": [
            "入场待核验车辆队列",
            "核验结果与来源详情展示",
            "放行/拒绝操作确认",
            "异常原因登记与留痕",
            "接口异常降级处理"
          ],
          "sections": [
            "顶部状态栏：显示当前接口连接状态（正常/异常）、待处理车辆数",
            "左侧待核验车辆列表：车牌号、核验状态图标、来源标签，支持筛选",
            "右侧核验详情与操作区：车辆档案摘要、核验结果详情、预设原因列表、手动放行/拒绝按钮、异常原因登记弹窗",
            "底部操作日志/提示区域（可选）"
          ],
          "states": [
            "正常态：车辆队列正常刷新，接口在线",
            "空态：无待核验车辆，显示“当前无待入场车辆”",
            "加载态：列表或详情数据加载中，显示骨架屏",
            "异常态：接口超时/失败，触发降级模式，降级面板显示；或列表刷新失败提示"
          ],
          "keyInteractions": [
            "点击车辆行 → 加载该车核验详情到右侧区域",
            "核验通过车辆：点击“放行”按钮 → 二次确认弹窗 → 确认后调接口放行 → 该车从列表移除，并显示放行成功反馈",
            "核验失败/需人工判断车辆：点击“手动放行”或“拒绝” → 若拒绝则弹出异常原因登记弹窗 → 选择原因并填写说明 → 提交后记录并更新列表",
            "接口异常时自动显示降级面板，门岗可手动录入车牌/选择预约任务 → 判断放行/拒绝 → 标记降级",
            "支持手动刷新和自动轮询"
          ],
          "dataInputs": [
            "GET /api/gate/pending-vehicles（待核验车辆列表）",
            "GET /api/gate/vehicle-check-result/{vehicleId}（核验详情）",
            "POST /api/gate/vehicle-action（放行/拒绝）",
            "POST /api/gate/abnormal-record（异常登记）",
            "POST /api/gate/degraded-action（降级操作）",
            "获取预设拒绝原因列表"
          ],
          "originalPageKey": "page-1",
          "scenarioKey": "sc-4",
          "scenarioName": "门岗车辆入场核验与放行"
        },
        {
          "key": "sc-4-page-2-1",
          "priority": "P1",
          "type": "列表页",
          "name": "入场记录查询与同步管理",
          "vueFile": "GateEntryRecordsView.vue",
          "goal": "门岗或管理员查看历史入场处理记录（放行/拒绝），追踪记录同步状态，对同步失败的记录进行手动重新同步。",
          "features": [
            "入场记录同步与状态追踪"
          ],
          "sections": [
            "顶部筛选栏：时间范围、车牌号、操作结果（放行/拒绝）、同步状态",
            "记录列表：显示时间、车牌、操作类型、操作员、同步状态标签、重新同步按钮（仅同步失败时显示）",
            "记录详情弹窗（点击行展开）：显示完整核验结果快照、接口返回信息、异常原因、降级标记等"
          ],
          "states": [
            "正常态：列表正常展示，同步状态正常",
            "空态：无历史记录，显示“暂无入场记录”",
            "加载态：列表数据加载中",
            "部分异常态：某些记录同步失败，显示红色“同步失败”标签和重试按钮"
          ],
          "keyInteractions": [
            "筛选条件变化后自动请求列表",
            "点击同步失败记录的“重新同步”按钮 → 调用重试接口 → 更新同步状态",
            "点击行可查看详细核验结果快照"
          ],
          "dataInputs": [
            "GET /api/gate/entry-records（带筛选参数）",
            "POST /api/gate/retry-sync/{recordId}（重试同步）",
            "GET /api/gate/entry-record/{recordId}（详细记录）"
          ],
          "originalPageKey": "page-2",
          "scenarioKey": "sc-4",
          "scenarioName": "门岗车辆入场核验与放行"
        }
      ]
    },
    {
      "key": "sc-5",
      "name": "管理人员查看运营报表与决策分析",
      "priority": "P1",
      "pages": [
        {
          "key": "sc-5-page-1-0",
          "priority": "P1",
          "type": "工作台页",
          "name": "运营报表概览工作台",
          "vueFile": "ManagementReportsView.vue",
          "goal": "管理人员通过该页面查看实时关键运营指标，按时间、车辆类型、作业区域等维度筛选数据，通过指标卡片和趋势图快速掌握整体状况，并可导出报表或下钻到明细详情。",
          "features": [
            "多维度数据筛选与联动刷新",
            "关键运营指标卡片组",
            "指标趋势图分析",
            "报表导出与下载"
          ],
          "sections": [
            "顶部筛选区（时间范围选择器、车辆类型多选、作业区域多选、查询按钮）",
            "指标卡片区（5个卡片横向排列，支持点击下钻）",
            "趋势图区域（折线图/柱状图，指标切换下拉、粒度切换）",
            "导出操作区（“导出Excel”“导出PDF”按钮及范围选择）"
          ],
          "states": [
            "正常态：展示完整数据，图表和卡片正常渲染",
            "空态：无数据时展示“暂无统计数据”提示，卡片显示“暂无数据”，图表展示空白状态",
            "加载态：数据加载中展示骨架屏或加载动画",
            "异常态：网络错误或接口异常时展示错误提示与重试按钮"
          ],
          "keyInteractions": [
            "筛选变更后指标卡片、趋势图、导出选项联动刷新",
            "点击指标卡片跳转到明细数据详情页（携带当前筛选条件）",
            "趋势图数据点点击下钻至当日明细数据详情页",
            "导出按钮触发异步导出任务，显示进度并下载"
          ],
          "dataInputs": [
            "筛选条件：时间范围、车辆类型列表、作业区域列表",
            "指标数据：车辆利用率、任务完成率、平均等待时长、空驶率、排队车辆数",
            "趋势数据：各指标按日/周/月维度的数值数组",
            "导出任务ID、文件下载链接"
          ],
          "originalPageKey": "page-1",
          "scenarioKey": "sc-5",
          "scenarioName": "管理人员查看运营报表与决策分析"
        },
        {
          "key": "sc-5-page-2-1",
          "priority": "P1",
          "type": "列表页",
          "name": "明细数据详情页",
          "vueFile": "ReportDetailView.vue",
          "goal": "展示从概览工作台下钻的明细数据，包括外协车辆费用明细、异常入场记录、排班排队分析等，支持进一步搜索、排序、分页以及当前明细的导出。",
          "features": [
            "明细数据下钻与详情查看"
          ],
          "sections": [
            "页面顶部面包屑导航及返回概览按钮",
            "当前筛选条件标签（显示继承自概览页的筛选条件，可微调）",
            "明细类型标签页（外协费用明细/异常入场记录/排班排队分析）",
            "表格区（含搜索框、排序箭头、分页控制器）",
            "导出当前明细按钮"
          ],
          "states": [
            "正常态：表格数据正常展示",
            "空态：无对应明细数据时展示“暂无记录”",
            "加载态：表格行骨架屏或加载提示",
            "异常态：数据加载失败显示重试按钮"
          ],
          "keyInteractions": [
            "切换明细类型标签页，表格内容刷新",
            "搜索框输入关键字实时过滤表格（或按回车搜索）",
            "点击列头排序，切换升序/降序",
            "分页切换浏览数据",
            "导出按钮导出当前表格数据为CSV/Excel"
          ],
          "dataInputs": [
            "继承自概览页的筛选条件（时间范围、车辆类型、作业区域）",
            "明细类型参数（外协费用/异常入场/排班排队）",
            "搜索关键字、排序字段与顺序、分页参数"
          ],
          "originalPageKey": "page-2",
          "scenarioKey": "sc-5",
          "scenarioName": "管理人员查看运营报表与决策分析"
        }
      ]
    },
    {
      "key": "sc-6",
      "name": "外协/临时车辆预约与入场审批",
      "priority": "P1",
      "pages": [
        {
          "key": "sc-6-page-1-0",
          "priority": "P0",
          "type": "工作台页",
          "name": "外协/临时车辆预约审批工作台",
          "vueFile": "WorkspaceView.vue",
          "goal": "集中处理外协/临时车辆预约申请，支持待办列表浏览、快速筛选、查看详情和审批操作（通过/驳回），以及审批通过后授权码同步状态监控。",
          "features": [
            "预约申请待办列表",
            "预约审批详情与操作面板"
          ],
          "sections": [
            "顶部筛选与排序栏（车辆类型、作业区域、申请日期、紧急度排序）",
            "左侧待办申请列表区（状态标签、超时标识、关键字段摘要）",
            "右侧详情与操作区（表单详情、车辆档案校验结果、通过/驳回按钮、审批意见输入框、授权码生成与同步状态反馈）",
            "底部操作日志快照（审批记录）"
          ],
          "states": [
            "正常态：有待审批申请，列表和详情正常展示",
            "空态：无待审批申请，列表显示『暂无待审批预约』，详情区域隐藏或提示选择申请",
            "加载态：列表加载中（骨架屏），详情加载中（loading指示）",
            "异常态：接口请求失败（网络错误提示，重试按钮），车辆档案校验接口失败时显示局部错误",
            "超时提示态：列表中有超时待处理申请时显示黄色角标和提示"
          ],
          "keyInteractions": [
            "点击列表项切换详情面板，详情面板自动加载车辆档案校验结果",
            "筛选条件改变时重新请求列表，支持模糊搜索车牌",
            "点击「通过」按钮后弹出二次确认（若车辆证照过期则强制确认），确认后调用审批接口，成功后显示授权码并触发门禁同步",
            "点击「驳回」按钮弹出原因输入框（必填），提交后列表刷新",
            "审批成功后，详情面板显示授权码（QR码图片）和同步状态，提供「重新同步」按钮"
          ],
          "dataInputs": [
            "预约申请列表（GET /api/reservations?status=pending&vehicleType=&area=&date=&sort=）",
            "预约申请详情（GET /api/reservations/{id}）",
            "车辆档案校验结果（GET /api/vehicles/{id}/status）",
            "审批通过接口（POST /api/reservations/{id}/approve?reason=）",
            "审批驳回接口（POST /api/reservations/{id}/reject?reason=）",
            "授权码同步状态（GET /api/access-codes/{reservationId}/sync-status）",
            "手动重新同步（POST /api/access-codes/{id}/resync）"
          ],
          "originalPageKey": "page-1",
          "scenarioKey": "sc-6",
          "scenarioName": "外协/临时车辆预约与入场审批"
        },
        {
          "key": "sc-6-page-2-1",
          "priority": "P1",
          "type": "列表页",
          "name": "授权码管理与同步监控",
          "vueFile": "AccessCodeView.vue",
          "goal": "查看所有已生成授权码的列表及状态，监控门禁同步情况，处理同步失败记录，并查看授权码使用详情。",
          "features": [
            "授权码管理与同步监控"
          ],
          "sections": [
            "顶部状态筛选栏（全部|同步成功|同步失败|待同步|已过期|已使用）",
            "授权码列表区（车牌号、授权码、有效期、同步状态、使用时间、门岗信息）",
            "单条记录展开详情（同步日志、重试按钮）"
          ],
          "states": [
            "正常态：列表数据正常展示，状态标签颜色区分",
            "空态：暂无授权码数据时显示提示",
            "加载态：列表骨架屏加载",
            "异常态：接口失败提示重试",
            "异常项标识态：同步失败项红色高亮，待同步项橙色"
          ],
          "keyInteractions": [
            "点击状态筛选标签切换列表",
            "点击单条记录的行或展开按钮查看详细同步信息（失败原因）",
            "点击「重新同步」按钮对失败项重新推送至门禁，按钮显示加载反馈",
            "支持按车牌号搜索"
          ],
          "dataInputs": [
            "授权码列表（GET /api/access-codes?status=&keyword=&page=&size=）",
            "授权码详情同步日志（GET /api/access-codes/{id}）",
            "重新同步接口（POST /api/access-codes/{id}/resync）"
          ],
          "originalPageKey": "page-2",
          "scenarioKey": "sc-6",
          "scenarioName": "外协/临时车辆预约与入场审批"
        },
        {
          "key": "sc-6-page-3-2",
          "priority": "P2",
          "type": "列表页",
          "name": "历史预约记录查询",
          "vueFile": "HistoryView.vue",
          "goal": "提供外协/临时车辆预约历史记录的多维度查询、详情追溯和导出，支持费用统计对账。",
          "features": [
            "历史预约记录查询"
          ],
          "sections": [
            "顶部多条件筛选栏（时间范围、车辆、所属单位、作业区域、审批状态）",
            "历史记录列表区（倒序展示，显示审批状态、授权码、入场/出场时间、费用）",
            "单条记录展开详情或弹窗（完整操作日志、费用明细）",
            "导出按钮及导出进度提示"
          ],
          "states": [
            "正常态：有历史数据，列表展示",
            "空态：按条件无数据时显示『暂无记录』，并提示修改筛选条件",
            "加载态：列表加载中",
            "异常态：接口失败提示重试",
            "导出状态态：导出中显示进度条，完成后提供下载链接"
          ],
          "keyInteractions": [
            "筛选条件变更后自动请求新数据",
            "点击列表项查看详情弹窗，展示操作日志时间线",
            "点击「导出Excel」按钮，确认后开始生成，完成后自动下载",
            "支持分页浏览"
          ],
          "dataInputs": [
            "历史预约列表（GET /api/reservations/history?startTime=&endTime=&vehicleId=&unit=&area=&status=&page=&size=）",
            "单条详情含操作日志（GET /api/reservations/{id}/detail）",
            "导出接口（GET /api/reservations/history/export?parameters...）"
          ],
          "originalPageKey": "page-3",
          "scenarioKey": "sc-6",
          "scenarioName": "外协/临时车辆预约与入场审批"
        }
      ]
    },
    {
      "key": "sc-7",
      "name": "管理员车辆台账维护与证照管理",
      "priority": "P1",
      "pages": [
        {
          "key": "sc-7-page-1-0",
          "priority": "P1",
          "type": "列表页",
          "name": "车辆台账列表工作台",
          "vueFile": "VehicleArchiveList.vue",
          "goal": "管理员查看全厂车辆档案列表，执行筛选、搜索、停用/启用操作，并接收到期提醒。",
          "features": [
            "车辆列表与高级筛选",
            "年检/保险/准入有效期设置与到期提醒",
            "车辆停用/启用管理与状态同步"
          ],
          "sections": [
            "顶部操作栏：新增车辆按钮、导出按钮、批量停用/启用（可选）",
            "筛选区：车辆类型、所属单位、车辆状态、有效期状态下拉框；车牌号/司机姓名搜索框",
            "到期提醒横幅/面板：展示临近30天到期的车辆条目列表（车辆、到期类型、剩余天数），可点击跳转编辑页",
            "车辆列表主体：展示车牌号、车辆类型、所属单位、司机、有效期状态、车辆状态；每行包含『编辑』、『停用/启用』按钮",
            "分页控件"
          ],
          "states": [
            "正常态：列表数据正常加载，有筛选和翻页",
            "空态：无车辆档案时展示『暂无车辆，请点击新增』并引导操作",
            "加载态：骨架屏或loading指示器",
            "异常态：网络错误时展示错误提示与重试按钮"
          ],
          "keyInteractions": [
            "筛选条件变化时立即刷新列表（防抖300ms）",
            "搜索框支持回车触发搜索",
            "点击到期提醒条目跳转到该车辆编辑页，并自动定位至有效期设置区域",
            "点击行内『停用』按钮弹出确认弹窗，填写停用原因后提交；『启用』按钮无需原因直接确认",
            "停用/启用操作完成后刷新列表，并更新到期提醒区域（若车辆状态变更影响提醒）"
          ],
          "dataInputs": [
            "车辆类型字典（生产车辆/物流车辆/外协车辆/临时车辆）",
            "所属单位列表",
            "车辆状态枚举（正常/停用）",
            "有效期状态计算逻辑（临近30天/已过期/正常）",
            "停用原因（必填，字符串）",
            "到期提醒列表数据（车辆ID、到期类型、到期日期、剩余天数）"
          ],
          "originalPageKey": "page-1",
          "scenarioKey": "sc-7",
          "scenarioName": "管理员车辆台账维护与证照管理"
        },
        {
          "key": "sc-7-page-2-1",
          "priority": "P1",
          "type": "详情页",
          "name": "车辆档案编辑页",
          "vueFile": "VehicleArchiveEdit.vue",
          "goal": "管理员新增或编辑车辆的全部基础档案信息，包括证照图片上传及有效期设置。",
          "features": [
            "车辆新增/编辑表单与数据校验",
            "证照图片上传与管理组件",
            "年检/保险/准入有效期设置与到期提醒"
          ],
          "sections": [
            "页面标题：『新增车辆』或『编辑车辆 - 车牌号』",
            "基本信息区：车辆类型（下拉）、车牌号（文本输入）、所属单位（下拉）、司机姓名、司机电话",
            "有效期设置区：年检有效期、保险有效期、准入有效期三个日期选择器（可单独清除）",
            "证照图片管理区：列表展示已有证照（类型、缩略图）；操作按钮『上传』、『预览』、『替换』、『删除』；支持拖拽排序（可选）",
            "操作按钮区：『保存』、『取消』；保存时触发完整校验",
            "操作日志摘要区（只读）：显示该车辆最近操作日志的简要列表（可选，不超过4条），点击可跳转到操作日志页"
          ],
          "states": [
            "正常态：表单可编辑，数据已预填充（编辑模式）",
            "空态：新增模式下所有字段为空",
            "加载态：页面加载车辆详情数据时显示loading",
            "异常态：保存失败时展示错误信息并保留用户输入"
          ],
          "keyInteractions": [
            "车牌号输入时实时校验（格式、唯一性），输入框后显示校验图标",
            "日期选择器选择日期后自动校验不能早于当天",
            "证照上传：点击上传后弹出文件选择器，上传后显示缩略图并自动关联证照类型（用户需选择证照类型）",
            "替换证照：点击替换，上传新文件后旧图标记为历史（或覆盖，需在界面提示），并记录日志",
            "删除证照：点击删除后弹出确认弹窗，确认后删除并记录日志",
            "保存按钮：执行前端必填校验（车牌号、车辆类型、所属单位）及日期逻辑校验；校验通过后显示提交loading；成功后跳转回列表页并刷新",
            "取消按钮：若有未保存修改，弹出『放弃修改』确认框"
          ],
          "dataInputs": [
            "车辆ID（编辑时传参）",
            "车辆类型枚举列表",
            "所属单位下拉列表",
            "车牌号唯一性校验接口（前端可调用）",
            "日期字段格式（YYYY-MM-DD）",
            "证照类型枚举（行驶证、营运证、其他）",
            "证照图片最大大小（10MB）",
            "证照图片允许格式（jpg/png）",
            "每车最大证照数量（建议10张）"
          ],
          "originalPageKey": "page-2",
          "scenarioKey": "sc-7",
          "scenarioName": "管理员车辆台账维护与证照管理"
        },
        {
          "key": "sc-7-page-3-2",
          "priority": "P2",
          "type": "列表页",
          "name": "操作日志查询页",
          "vueFile": "VehicleArchiveLogs.vue",
          "goal": "管理员查询和导出所有车辆档案的关键操作日志，用于审计追溯。",
          "features": [
            "操作日志查询与导出"
          ],
          "sections": [
            "筛选区：时间范围（日期选择器）、操作人（下拉或输入）、操作类型（多选下拉）、关联车辆（车牌号输入/选择）",
            "日志列表：展示时间、操作人、操作类型、关联车辆、修改内容摘要",
            "导出按钮：点击后导出当前筛选条件下的日志为Excel文件",
            "分页控件"
          ],
          "states": [
            "正常态：列表数据正常加载",
            "空态：无匹配日志时展示『暂无操作记录』",
            "加载态：查询或导出时显示loading",
            "异常态：查询失败或导出失败时展示错误提示"
          ],
          "keyInteractions": [
            "筛选条件联动：选择时间范围或操作类型后自动刷新列表（防抖300ms）",
            "关联车辆支持使用车牌号搜索并支持多选（可从现有车辆列表选择）",
            "导出按钮：点击后生成下载请求，若数据量过大（如>10万条）则提示用户缩小范围",
            "点击日志行可展开查看详细的修改内容（before/after JSON）"
          ],
          "dataInputs": [
            "操作类型枚举（新增/编辑/停用/启用/上传证照/删除证照）",
            "操作人列表（从用户表获取）",
            "关联车辆列表（从车辆表获取）",
            "时间范围（开始日期、结束日期）",
            "导出最大条数限制（默认10万条，可在后端配置）"
          ],
          "originalPageKey": "page-3",
          "scenarioKey": "sc-7",
          "scenarioName": "管理员车辆台账维护与证照管理"
        }
      ]
    }
  ],
  "pageDesign": {
    "roles": [
      {
        "id": "role-1783042263482-0",
        "name": "调度员",
        "focus": "在调度中心通过地图看板实时监控车辆状态、派车、任务调整及异常处理",
        "tagText": "调度中心、实时监控、派车、异常告警"
      },
      {
        "id": "role-1783042263482-1",
        "name": "司机",
        "focus": "通过移动端接收任务、导航到作业点、确认作业完成并上传照片",
        "tagText": "任务接收、导航、状态回传、照片上传"
      },
      {
        "id": "role-1783042263482-2",
        "name": "现场调度员",
        "focus": "通过移动端在现场临时调整任务、查看车辆状态、处理异常情况",
        "tagText": "移动调度、临时调整、现场协调"
      },
      {
        "id": "role-1783042263482-3",
        "name": "门岗人员",
        "focus": "在道闸处核验车辆入场授权、手动放行或拒绝、处理异常",
        "tagText": "入场核验、门禁集成、异常登记"
      },
      {
        "id": "role-1783042263482-4",
        "name": "管理人员",
        "focus": "查看车辆运营统计报表、优化资源配置与外协费用管理",
        "tagText": "报表分析、决策支持、资源优化"
      },
      {
        "id": "role-1783042263482-5",
        "name": "外协/临时车辆申请者",
        "focus": "在线提交车辆预约登记、查看审批进度及入场授权",
        "tagText": "预约登记、审批跟踪、入场授权"
      },
      {
        "id": "role-1783042263482-6",
        "name": "管理员",
        "focus": "维护车辆基础档案、证照、年检保险状态及准入有效期",
        "tagText": "台账管理、档案维护、到期提醒"
      }
    ],
    "sourceRoles": [
      {
        "name": "调度员",
        "focus": "在调度中心通过地图看板实时监控车辆状态、派车、任务调整及异常处理",
        "tags": [
          "调度中心",
          "实时监控",
          "派车",
          "异常告警"
        ]
      },
      {
        "name": "司机",
        "focus": "通过移动端接收任务、导航到作业点、确认作业完成并上传照片",
        "tags": [
          "任务接收",
          "导航",
          "状态回传",
          "照片上传"
        ]
      },
      {
        "name": "现场调度员",
        "focus": "通过移动端在现场临时调整任务、查看车辆状态、处理异常情况",
        "tags": [
          "移动调度",
          "临时调整",
          "现场协调"
        ]
      },
      {
        "name": "门岗人员",
        "focus": "在道闸处核验车辆入场授权、手动放行或拒绝、处理异常",
        "tags": [
          "入场核验",
          "门禁集成",
          "异常登记"
        ]
      },
      {
        "name": "管理人员",
        "focus": "查看车辆运营统计报表、优化资源配置与外协费用管理",
        "tags": [
          "报表分析",
          "决策支持",
          "资源优化"
        ]
      },
      {
        "name": "外协/临时车辆申请者",
        "focus": "在线提交车辆预约登记、查看审批进度及入场授权",
        "tags": [
          "预约登记",
          "审批跟踪",
          "入场授权"
        ]
      },
      {
        "name": "管理员",
        "focus": "维护车辆基础档案、证照、年检保险状态及准入有效期",
        "tags": [
          "台账管理",
          "档案维护",
          "到期提醒"
        ]
      }
    ],
    "scenarios": [
      {
        "key": "sc-1",
        "name": "调度员实时调度派车与异常监控",
        "priority": "P0",
        "description": "调度员在调度中心通过地图看板实时查看所有车辆位置、任务状态、空闲/排队/异常车辆，接收来自生产计划系统推送的用车需求或手动创建的用车申请，根据作业区域、车辆类型、优先级和距离等因素进行派车，并对超速（>30km/h）、禁入区域、异常停留等告警进行处理，确认告警或转人工，确保调度高效。系统实时获取由管理员维护的车辆档案信息（如车辆类型、司机联系方式）。",
        "workflow": [
          "登录系统进入调度中心，地图看板加载车辆实时位置与状态",
          "查看待处理用车需求列表（含生产计划推送），查看异常告警列表",
          "选择可用车辆，综合考量距离、类型等因素进行派车，下发任务给司机；对异常告警进行确认、标记或转人工处理",
          "任务下发成功，异常处理记录留痕，状态同步至司机端和门禁系统"
        ],
        "pageMapping": {
          "role": "调度员",
          "page": "DispatchCenterView.vue",
          "modules": [
            "车辆实时地图（含位置、速度、状态标识）",
            "车辆状态看板（空闲/任务中/排队/异常）",
            "用车需求列表（含生产计划推送入口）",
            "派车操作面板（选择车辆、确认派车）",
            "异常告警列表（超速、禁入、异常停留）与处理弹窗",
            "任务下发记录与状态跟踪"
          ]
        }
      },
      {
        "key": "sc-2",
        "name": "司机移动端任务接收与执行",
        "priority": "P0",
        "description": "司机在移动端接收调度下发的任务，首先确认接单，然后查看任务详情，包括作业点位置、预计到达时间、关联的物资提货单号及车辆基本信息（车牌、司机联系方式）。使用内置导航或调用第三方地图APP前往作业点。到达后点击到达确认，装卸完成后点击完成确认并拍照上传，任务自动关闭。全程在线实时通讯，无需离线模式；如遇问题（找不到作业点、任务异常等）可通过异常反馈入口联系调度员或现场调度员。任务状态变更同步至调度中心、门禁系统及物资系统。",
        "workflow": [
          "收到任务推送通知，进入任务列表，点击任务确认接单",
          "查看任务详情（含关联物资提货单号、作业点、预计时间等），点击导航按钮前往作业点",
          "到达作业点后点击「到达确认」按钮",
          "装卸完成后点击「完成确认」按钮并拍照上传现场照片",
          "任务状态自动更新为关闭，系统同步状态至调度中心、门禁系统及物资系统"
        ],
        "pageMapping": {
          "role": "司机",
          "page": "DriverTaskView.vue",
          "modules": [
            "任务列表（待接单/进行中/已完成）",
            "任务详情（含车辆信息、关联物资提货单号）",
            "导航启动按钮（调用地图APP）",
            "到达确认按钮",
            "完成确认与照片上传组件",
            "异常反馈入口"
          ]
        }
      },
      {
        "key": "sc-3",
        "name": "现场调度员移动端临时调整与异常处理",
        "priority": "P1",
        "description": "现场调度员在作业现场通过移动端接收司机异常反馈（找不到作业点、车辆排队）或系统异常告警（超速>30km/h、禁入区域、异常停留），查看附近车辆实时位置、任务状态和可用性，对突发情况进行任务改派、加派或与司机即时通讯协调，并记录处理原因和结果。所有操作留痕，调整结果自动同步至调度中心。",
        "workflow": [
          "收到现场异常报告或系统告警通知（司机反馈/超速/禁入/异常停留）",
          "打开移动端查看周边车辆列表（含实时位置、任务状态、可用性及异常标识）",
          "选择目标车辆执行改派、取消任务或新增临时任务，必要时通过即时通讯与司机沟通",
          "确认调整，系统同步至调度中心并生成异常处理记录（含时间、处理人、原因、结果）"
        ],
        "pageMapping": {
          "role": "现场调度员",
          "page": "MobileDispatchView.vue",
          "modules": [
            "周边车辆状态列表（含异常标识）",
            "任务调整操作（改派车辆、取消任务、新增临时任务）",
            "与司机即时通讯入口",
            "异常情况记录与上报表单"
          ]
        }
      },
      {
        "key": "sc-4",
        "name": "门岗车辆入场核验与放行",
        "priority": "P1",
        "description": "车辆抵达入场道闸时，系统自动调用门禁接口，根据车辆预约审批记录或派车任务核验其入场授权。门岗人员在固定终端上查看待核验车辆列表及核验状态（通过、失败、需人工判断）。对于通过车辆，门岗点击放行，道闸开启；对于失败或需人工判断车辆，门岗可查看接口返回的详细信息（如黑名单、证照过期、无预约等），选择手动放行或拒绝，并登记异常原因。所有操作记录自动留存，入场记录同步至系统。接口异常时门岗可执行降级手动确认。",
        "workflow": [
          "车辆触发道闸感应，系统调用门禁接口获取核验结果（通过/失败/需人工判断）",
          "门岗查看待核验车辆列表，核验状态及来源信息显示",
          "对核验通过车辆点击放行，道闸开启",
          "对核验失败或需人工判断车辆，点击查看详情，手动判断放行或拒绝，并填写异常原因",
          "操作记录自动留痕，入场记录同步至系统，异常原因登记可追溯"
        ],
        "pageMapping": {
          "role": "门岗人员",
          "page": "GateAccessCheckView.vue",
          "modules": [
            "待核验车辆列表（车牌、核验状态、来源）",
            "核验结果详情展示（接口返回信息）",
            "手动放行/拒绝按钮组",
            "异常原因登记弹窗",
            "入场记录查询与同步状态显示"
          ]
        }
      },
      {
        "key": "sc-5",
        "name": "管理人员查看运营报表与决策分析",
        "priority": "P1",
        "description": "管理人员登录系统后，通过导航进入报表分析页面，系统自动从车辆档案、任务执行记录、门禁入场记录、告警记录等数据源实时统计关键运营指标（车辆利用率、任务完成率、平均等待时长、空驶率、排队车辆数、外协车辆使用次数、异常入场记录）。支持按时间范围（日/周/月/自定义）、车辆类型、作业区域等维度筛选并刷新图表。管理人员可下钻查看明细数据（如外协车辆费用明细含按次/按时计费、异常入场记录含原因），定位资源瓶颈或异常趋势。最终可导出Excel/PDF格式报表用于决策汇报，或基于分析结果调整派车规则与外协策略。",
        "workflow": [
          "登录系统后，在导航栏选择『报表分析』模块进入报表页面，默认展示当日概览",
          "选择筛选维度（时间范围、车辆类型、作业区域等），图表自动刷新",
          "查看关键指标卡片（利用率、完成率、平均等待时长等），点击卡片或趋势图可下钻查看明细列表",
          "下钻明细包括外协车辆使用次数及费用统计表、异常入场记录列表、排班与排队分析表等",
          "点击导出按钮，选择Excel或PDF格式，系统生成报表并提供下载"
        ],
        "pageMapping": {
          "role": "管理人员",
          "page": "ManagementReportsView.vue",
          "modules": [
            "维度筛选面板（时间、车辆类型、作业区域）",
            "关键指标卡片组（利用率、完成率、平均等待时长、空驶率、排队车辆数）",
            "趋势图组件（日/周/月）",
            "明细数据下钻表格（外协费用明细、异常入场记录、排班排队分析）",
            "报表导出按钮（Excel/PDF）"
          ]
        }
      },
      {
        "key": "sc-6",
        "name": "外协/临时车辆预约与入场审批",
        "priority": "P1",
        "description": "外协或临时车辆申请者通过移动端填写预约登记表单，包含车辆类型、车牌号、所属单位、司机信息、作业区域、作业时间等字段（车辆基础信息需与管理员维护的车辆台账关联校验）。提交后推送至调度员或指定审批人进行审批，审批通过后系统生成入场授权二维码/授权码，并同步至门禁系统。申请者在手机上可查看审批进度、授权信息及历史预约记录，入场时出示授权码由门岗核验放行。系统自动记录所有审批和入场操作，便于后续统计外协车辆使用次数和费用（费用可在系统内按次或按时记录，无需对接财务系统）。",
        "workflow": [
          "申请者进入预约登记页面，选择车辆（可选已存在档案中的车辆或临时录入新车辆）、填写所属单位、司机、作业区域与时间范围，系统自动校验准入有效期、证照状态",
          "提交预约申请，系统生成待审批任务并通知调度员/审批人",
          "审批人在待办列表中查看申请详情（含车辆档案关联信息），做出通过或驳回操作，并填写审批意见",
          "审批通过后，系统自动生成入场授权码（二维码），并推送至门禁系统；同时申请者手机端显示授权信息及有效时间",
          "入场时，门岗人员通过扫描授权码或手动输入授权码，调用门禁接口核验，核验通过后放行并记录入场时间",
          "申请者可随时查看历史预约记录，包括每次预约的审批状态、授权码、入场/出场时间、费用记录等"
        ],
        "pageMapping": {
          "role": "调度员",
          "page": "WorkspaceView.vue",
          "modules": [
            "列表区",
            "详情区",
            "操作区"
          ]
        }
      },
      {
        "key": "sc-7",
        "name": "管理员车辆台账维护与证照管理",
        "priority": "P1",
        "description": "管理员通过车辆台账管理页面，对全厂车辆（包括生产车辆、物流车辆、外协车辆、临时车辆）的基础档案进行增删改查。档案信息包括车辆类型、车牌号、所属单位、司机信息、证照图片（行驶证、营运证等）、年检状态、保险状态、准入有效期等。系统自动验证数据完整性，对临近到期的证照、年检、保险（如30天内）生成提醒通知，管理员可设置及更新有效期并上传/更换证照图片。所有关键操作自动记录操作日志，确保后续审计可追溯。车辆档案数据为调度派车、门禁核验、统计分析等场景提供准确的基础数据支撑。",
        "workflow": [
          "管理员登录系统后，进入车辆台账管理页面，页面自动加载车辆列表，并显示当前所有证照/年检/保险到期提醒（若有）。",
          "通过筛选条件（车辆类型、所属单位、车辆状态）或搜索框快速定位目标车辆。",
          "点击【新增车辆】填写表单（类型、车牌、单位、司机等），或点击已有车辆进入编辑模式，修改信息并上传/替换证照图片。",
          "设置年检有效期、保险有效期、准入有效期，系统自动校验日期合法性及证照图片是否已上传。",
          "保存后数据更新生效，系统自动更新到期提醒列表，并记录操作日志（时间、操作人、修改内容摘要）。",
          "对于已过期的证照，管理员可手动标记车辆为『停用』，系统同步至门禁核验、调度等关联功能，禁止该车辆进入作业区。"
        ],
        "pageMapping": {
          "role": "管理员",
          "page": "VehicleArchiveManager.vue",
          "modules": [
            "车辆列表与高级筛选",
            "车辆详情编辑表单（含全部字段）",
            "证照图片上传与管理组件",
            "年检/保险/准入有效期设置面板及到期提醒列表",
            "操作日志查询与导出"
          ]
        }
      }
    ],
    "availableScenarios": [
      {
        "key": "sc-1",
        "name": "调度员实时调度派车与异常监控",
        "priority": "P0",
        "description": "调度员在调度中心通过地图看板实时查看所有车辆位置、任务状态、空闲/排队/异常车辆，接收来自生产计划系统推送的用车需求或手动创建的用车申请，根据作业区域、车辆类型、优先级和距离等因素进行派车，并对超速（>30km/h）、禁入区域、异常停留等告警进行处理，确认告警或转人工，确保调度高效。系统实时获取由管理员维护的车辆档案信息（如车辆类型、司机联系方式）。",
        "workflow": [
          "登录系统进入调度中心，地图看板加载车辆实时位置与状态",
          "查看待处理用车需求列表（含生产计划推送），查看异常告警列表",
          "选择可用车辆，综合考量距离、类型等因素进行派车，下发任务给司机；对异常告警进行确认、标记或转人工处理",
          "任务下发成功，异常处理记录留痕，状态同步至司机端和门禁系统"
        ],
        "pageMapping": {
          "role": "调度员",
          "page": "DispatchCenterView.vue",
          "modules": [
            "车辆实时地图（含位置、速度、状态标识）",
            "车辆状态看板（空闲/任务中/排队/异常）",
            "用车需求列表（含生产计划推送入口）",
            "派车操作面板（选择车辆、确认派车）",
            "异常告警列表（超速、禁入、异常停留）与处理弹窗",
            "任务下发记录与状态跟踪"
          ]
        }
      },
      {
        "key": "sc-2",
        "name": "司机移动端任务接收与执行",
        "priority": "P0",
        "description": "司机在移动端接收调度下发的任务，首先确认接单，然后查看任务详情，包括作业点位置、预计到达时间、关联的物资提货单号及车辆基本信息（车牌、司机联系方式）。使用内置导航或调用第三方地图APP前往作业点。到达后点击到达确认，装卸完成后点击完成确认并拍照上传，任务自动关闭。全程在线实时通讯，无需离线模式；如遇问题（找不到作业点、任务异常等）可通过异常反馈入口联系调度员或现场调度员。任务状态变更同步至调度中心、门禁系统及物资系统。",
        "workflow": [
          "收到任务推送通知，进入任务列表，点击任务确认接单",
          "查看任务详情（含关联物资提货单号、作业点、预计时间等），点击导航按钮前往作业点",
          "到达作业点后点击「到达确认」按钮",
          "装卸完成后点击「完成确认」按钮并拍照上传现场照片",
          "任务状态自动更新为关闭，系统同步状态至调度中心、门禁系统及物资系统"
        ],
        "pageMapping": {
          "role": "司机",
          "page": "DriverTaskView.vue",
          "modules": [
            "任务列表（待接单/进行中/已完成）",
            "任务详情（含车辆信息、关联物资提货单号）",
            "导航启动按钮（调用地图APP）",
            "到达确认按钮",
            "完成确认与照片上传组件",
            "异常反馈入口"
          ]
        }
      },
      {
        "key": "sc-3",
        "name": "现场调度员移动端临时调整与异常处理",
        "priority": "P1",
        "description": "现场调度员在作业现场通过移动端接收司机异常反馈（找不到作业点、车辆排队）或系统异常告警（超速>30km/h、禁入区域、异常停留），查看附近车辆实时位置、任务状态和可用性，对突发情况进行任务改派、加派或与司机即时通讯协调，并记录处理原因和结果。所有操作留痕，调整结果自动同步至调度中心。",
        "workflow": [
          "收到现场异常报告或系统告警通知（司机反馈/超速/禁入/异常停留）",
          "打开移动端查看周边车辆列表（含实时位置、任务状态、可用性及异常标识）",
          "选择目标车辆执行改派、取消任务或新增临时任务，必要时通过即时通讯与司机沟通",
          "确认调整，系统同步至调度中心并生成异常处理记录（含时间、处理人、原因、结果）"
        ],
        "pageMapping": {
          "role": "现场调度员",
          "page": "MobileDispatchView.vue",
          "modules": [
            "周边车辆状态列表（含异常标识）",
            "任务调整操作（改派车辆、取消任务、新增临时任务）",
            "与司机即时通讯入口",
            "异常情况记录与上报表单"
          ]
        }
      },
      {
        "key": "sc-4",
        "name": "门岗车辆入场核验与放行",
        "priority": "P1",
        "description": "车辆抵达入场道闸时，系统自动调用门禁接口，根据车辆预约审批记录或派车任务核验其入场授权。门岗人员在固定终端上查看待核验车辆列表及核验状态（通过、失败、需人工判断）。对于通过车辆，门岗点击放行，道闸开启；对于失败或需人工判断车辆，门岗可查看接口返回的详细信息（如黑名单、证照过期、无预约等），选择手动放行或拒绝，并登记异常原因。所有操作记录自动留存，入场记录同步至系统。接口异常时门岗可执行降级手动确认。",
        "workflow": [
          "车辆触发道闸感应，系统调用门禁接口获取核验结果（通过/失败/需人工判断）",
          "门岗查看待核验车辆列表，核验状态及来源信息显示",
          "对核验通过车辆点击放行，道闸开启",
          "对核验失败或需人工判断车辆，点击查看详情，手动判断放行或拒绝，并填写异常原因",
          "操作记录自动留痕，入场记录同步至系统，异常原因登记可追溯"
        ],
        "pageMapping": {
          "role": "门岗人员",
          "page": "GateAccessCheckView.vue",
          "modules": [
            "待核验车辆列表（车牌、核验状态、来源）",
            "核验结果详情展示（接口返回信息）",
            "手动放行/拒绝按钮组",
            "异常原因登记弹窗",
            "入场记录查询与同步状态显示"
          ]
        }
      },
      {
        "key": "sc-5",
        "name": "管理人员查看运营报表与决策分析",
        "priority": "P1",
        "description": "管理人员登录系统后，通过导航进入报表分析页面，系统自动从车辆档案、任务执行记录、门禁入场记录、告警记录等数据源实时统计关键运营指标（车辆利用率、任务完成率、平均等待时长、空驶率、排队车辆数、外协车辆使用次数、异常入场记录）。支持按时间范围（日/周/月/自定义）、车辆类型、作业区域等维度筛选并刷新图表。管理人员可下钻查看明细数据（如外协车辆费用明细含按次/按时计费、异常入场记录含原因），定位资源瓶颈或异常趋势。最终可导出Excel/PDF格式报表用于决策汇报，或基于分析结果调整派车规则与外协策略。",
        "workflow": [
          "登录系统后，在导航栏选择『报表分析』模块进入报表页面，默认展示当日概览",
          "选择筛选维度（时间范围、车辆类型、作业区域等），图表自动刷新",
          "查看关键指标卡片（利用率、完成率、平均等待时长等），点击卡片或趋势图可下钻查看明细列表",
          "下钻明细包括外协车辆使用次数及费用统计表、异常入场记录列表、排班与排队分析表等",
          "点击导出按钮，选择Excel或PDF格式，系统生成报表并提供下载"
        ],
        "pageMapping": {
          "role": "管理人员",
          "page": "ManagementReportsView.vue",
          "modules": [
            "维度筛选面板（时间、车辆类型、作业区域）",
            "关键指标卡片组（利用率、完成率、平均等待时长、空驶率、排队车辆数）",
            "趋势图组件（日/周/月）",
            "明细数据下钻表格（外协费用明细、异常入场记录、排班排队分析）",
            "报表导出按钮（Excel/PDF）"
          ]
        }
      },
      {
        "key": "sc-6",
        "name": "外协/临时车辆预约与入场审批",
        "priority": "P1",
        "description": "外协或临时车辆申请者通过移动端填写预约登记表单，包含车辆类型、车牌号、所属单位、司机信息、作业区域、作业时间等字段（车辆基础信息需与管理员维护的车辆台账关联校验）。提交后推送至调度员或指定审批人进行审批，审批通过后系统生成入场授权二维码/授权码，并同步至门禁系统。申请者在手机上可查看审批进度、授权信息及历史预约记录，入场时出示授权码由门岗核验放行。系统自动记录所有审批和入场操作，便于后续统计外协车辆使用次数和费用（费用可在系统内按次或按时记录，无需对接财务系统）。",
        "workflow": [
          "申请者进入预约登记页面，选择车辆（可选已存在档案中的车辆或临时录入新车辆）、填写所属单位、司机、作业区域与时间范围，系统自动校验准入有效期、证照状态",
          "提交预约申请，系统生成待审批任务并通知调度员/审批人",
          "审批人在待办列表中查看申请详情（含车辆档案关联信息），做出通过或驳回操作，并填写审批意见",
          "审批通过后，系统自动生成入场授权码（二维码），并推送至门禁系统；同时申请者手机端显示授权信息及有效时间",
          "入场时，门岗人员通过扫描授权码或手动输入授权码，调用门禁接口核验，核验通过后放行并记录入场时间",
          "申请者可随时查看历史预约记录，包括每次预约的审批状态、授权码、入场/出场时间、费用记录等"
        ],
        "pageMapping": {
          "role": "调度员",
          "page": "WorkspaceView.vue",
          "modules": [
            "列表区",
            "详情区",
            "操作区"
          ]
        }
      },
      {
        "key": "sc-7",
        "name": "管理员车辆台账维护与证照管理",
        "priority": "P1",
        "description": "管理员通过车辆台账管理页面，对全厂车辆（包括生产车辆、物流车辆、外协车辆、临时车辆）的基础档案进行增删改查。档案信息包括车辆类型、车牌号、所属单位、司机信息、证照图片（行驶证、营运证等）、年检状态、保险状态、准入有效期等。系统自动验证数据完整性，对临近到期的证照、年检、保险（如30天内）生成提醒通知，管理员可设置及更新有效期并上传/更换证照图片。所有关键操作自动记录操作日志，确保后续审计可追溯。车辆档案数据为调度派车、门禁核验、统计分析等场景提供准确的基础数据支撑。",
        "workflow": [
          "管理员登录系统后，进入车辆台账管理页面，页面自动加载车辆列表，并显示当前所有证照/年检/保险到期提醒（若有）。",
          "通过筛选条件（车辆类型、所属单位、车辆状态）或搜索框快速定位目标车辆。",
          "点击【新增车辆】填写表单（类型、车牌、单位、司机等），或点击已有车辆进入编辑模式，修改信息并上传/替换证照图片。",
          "设置年检有效期、保险有效期、准入有效期，系统自动校验日期合法性及证照图片是否已上传。",
          "保存后数据更新生效，系统自动更新到期提醒列表，并记录操作日志（时间、操作人、修改内容摘要）。",
          "对于已过期的证照，管理员可手动标记车辆为『停用』，系统同步至门禁核验、调度等关联功能，禁止该车辆进入作业区。"
        ],
        "pageMapping": {
          "role": "管理员",
          "page": "VehicleArchiveManager.vue",
          "modules": [
            "车辆列表与高级筛选",
            "车辆详情编辑表单（含全部字段）",
            "证照图片上传与管理组件",
            "年检/保险/准入有效期设置面板及到期提醒列表",
            "操作日志查询与导出"
          ]
        }
      }
    ],
    "selectedScenarioKey": "sc-7",
    "modulesByScenarioKey": {
      "sc-1": [
        {
          "key": "mod-1",
          "priority": "P0",
          "name": "车辆实时地图监控",
          "description": "在地图上实时展示所有车辆的位置、速度、方向、当前任务状态（空闲/任务中/排队/异常），支持按区域、车辆类型筛选，并显示超速预警（>30km/h）和禁入区域告警触发点。",
          "features": [
            "加载并展示车辆实时位置与移动轨迹",
            "点击车辆弹窗查看详细信息（车牌、司机、速度、任务）",
            "根据车辆状态和告警类型动态更新图标颜色（正常/超速/禁入/异常停留）",
            "支持地图缩放、区域选择、电子围栏可视化"
          ],
          "pageSuggestion": "DispatchCenterView.vue",
          "apiSuggestion": "GET /api/v1/vehicles/realtime-locations, POST /api/v1/vehicles/geofence-events",
          "dataNeeds": [
            "车辆GPS坐标、速度、方向",
            "车辆档案信息（车牌、类型、所属单位、司机联系方式）",
            "电子围栏/禁入区域坐标数据",
            "任务状态与当前任务ID"
          ],
          "stateRules": [
            "速度超过30km/h时地图上车辆图标闪烁并显示超速标记（来源：用户明确阈值30km/h）",
            "车辆进入禁入区域时触发告警，地图高亮该区域并弹出提示（建议确认电子围栏实现方式是否为地图绘制并实时检测）",
            "异常停留通过摄像头系统推送告警，地图上标记停留位置和时长（建议确认本系统是否直接对接摄像头API或接收安全系统推送）"
          ]
        },
        {
          "key": "mod-2",
          "priority": "P0",
          "name": "车辆状态看板",
          "description": "以卡片或列表形式聚合显示所有车辆的当前状态分类统计（空闲/任务中/排队/异常），支持快速筛选和查看详情，帮助调度员掌握整体资源分布。",
          "features": [
            "按状态分类展示车辆数量及简要列表",
            "点击某状态分类进入对应车辆明细列表",
            "支持按车辆类型、所属单位、作业区域筛选状态车辆",
            "实时刷新状态统计，异常状态车辆突出显示"
          ],
          "pageSuggestion": "DispatchCenterView.vue",
          "apiSuggestion": "GET /api/v1/vehicles/status-summary, GET /api/v1/vehicles?status={status}",
          "dataNeeds": [
            "车辆当前状态（空闲/任务中/排队/异常）",
            "车辆类型、所属单位",
            "车辆当前位置（用于判断是否在作业区域）"
          ],
          "stateRules": [
            "车辆状态由任务状态自动变更：接单→任务中，到达→任务中，装卸完成→任务中，任务关闭→空闲",
            "排队状态由调度员手动标记或系统根据等待时间自动标记（建议确认排队规则：是否基于排队任务数量或现场调度员触发）",
            "异常状态包括超速、禁入区域、异常停留、证照过期等，需从异常告警模块同步"
          ]
        },
        {
          "key": "mod-3",
          "priority": "P0",
          "name": "用车需求管理",
          "description": "集中展示待处理的用车需求，包括生产计划系统推送的需求和调度员手动创建的用车申请，支持查看详情、筛选、排序，并快速转化为派车任务。",
          "features": [
            "展示用车需求列表（来源、优先级、作业区域、预计时间、物资或作业描述）",
            "支持按优先级（P0/P1/P2）、时间范围、来源筛选",
            "点击需求可查看详情（关联的生产计划任务号、物资提货号等）",
            "一键“派车”按钮跳转至派车操作面板"
          ],
          "pageSuggestion": "DispatchCenterView.vue",
          "apiSuggestion": "GET /api/v1/request/demand-list, POST /api/v1/request/convert-to-task",
          "dataNeeds": [
            "需求ID、来源（生产计划系统/手动）、优先级",
            "作业区域、预计开始时间、预计结束时间",
            "关联物资提货单号或生产计划任务号",
            "需求描述（如吊装、转运、配送）"
          ],
          "stateRules": [
            "需求状态：待处理/已派车/已取消",
            "生产计划系统推送的需求不可手动修改，但可设置自动转换规则或手动转换（用户确认接口集成）",
            "手动创建的用车申请需填写完整的作业信息"
          ]
        },
        {
          "key": "mod-4",
          "priority": "P0",
          "name": "智能派车操作面板",
          "description": "为调度员提供选车、派车的核心操作界面，支持根据距离、车辆类型、任务优先级等因素推荐可用车辆，确认派车后生成任务并下发。",
          "features": [
            "根据所选需求自动筛选推荐可用车辆（距离近、类型匹配、空闲状态）",
            "手动选择或替换车辆，查看车辆详细信息（档案、历史任务）",
            "确认派车后生成任务，自动下发任务通知给司机",
            "派车记录自动保存，支持查看派车历史"
          ],
          "pageSuggestion": "DispatchCenterView.vue",
          "apiSuggestion": "POST /api/v1/tasks/dispatch, GET /api/v1/vehicles/available",
          "dataNeeds": [
            "车辆实时位置（用于距离计算）",
            "车辆类型与作业区域匹配规则",
            "司机在线状态与任务负载",
            "任务优先级与预计时长"
          ],
          "stateRules": [
            "派车后车辆状态变为“任务中”，司机收到推送",
            "若推荐车辆不足时，给出提示并允许手动强制派车（需记录原因）",
            "任务下发后，门禁系统可获取该任务的入场授权信息（集成要求）"
          ]
        },
        {
          "key": "mod-5",
          "priority": "P0",
          "name": "异常告警分级处理",
          "description": "实时接收并展示超速（>30km/h）、禁入区域、异常停留等告警，支持按严重程度分级（紧急/普通），调度员可对告警进行确认、标记处理或转人工，处理过程留痕。",
          "features": [
            "告警列表实时更新，显示时间、车辆、类型、位置、处理状态",
            "点击告警可在地图上定位并查看详情",
            "提供确认、忽略、转人工处理按钮，并填写处理备注",
            "告警处理记录与任务关联，便于追溯"
          ],
          "pageSuggestion": "DispatchCenterView.vue",
          "apiSuggestion": "GET /api/v1/alerts/list, POST /api/v1/alerts/handle",
          "dataNeeds": [
            "告警来源（GPS/摄像头/电子围栏）",
            "告警类型（超速/禁入/异常停留/证照过期等）",
            "车辆信息与当前任务",
            "告警时间、位置坐标"
          ],
          "stateRules": [
            "超速告警阈值：30km/h（用户明确）",
            "禁入区域告警：车辆进入非授权电子围栏区域触发（建议确认围栏规则：按车辆类型、区域权限配置）",
            "异常停留告警：通过摄像头系统推送，停留超过阈值（如10分钟）且无任务活动时触发（建议确认停留时长阈值，默认10分钟需用户确认）",
            "告警状态：未处理/已确认/已处理/转人工",
            "证照过期提醒由管理员台账模块触发，在此模块统一展示"
          ]
        },
        {
          "key": "mod-6",
          "priority": "P0",
          "name": "任务下发记录与状态跟踪",
          "description": "记录所有已派发任务的详细信息（司机、车辆、作业内容、时间、状态），支持实时跟踪任务执行进度，并在任务异常时提供干预入口。",
          "features": [
            "展示任务列表（包含任务ID、车牌、司机、作业区域、状态、时间）",
            "支持按状态（待接收/进行中/已完成/异常）筛选",
            "点击任务可查看详情（包括车辆轨迹回放、司机操作记录、照片等）",
            "对进行中的任务可发起催办或取消操作"
          ],
          "pageSuggestion": "DispatchCenterView.vue",
          "apiSuggestion": "GET /api/v1/tasks/history, POST /api/v1/tasks/remind, POST /api/v1/tasks/cancel",
          "dataNeeds": [
            "任务状态（待接收/进行中/到达确认/装卸完成/已关闭/已取消）",
            "司机操作时间戳（接收、到达、完成）",
            "现场照片与备注",
            "关联异常告警记录"
          ],
          "stateRules": [
            "任务状态机：待接收 → 进行中（司机接单） → 到达确认 → 装卸完成 → 已关闭",
            "若司机超时未接单，系统自动告警（建议确认超时时间，如5分钟）",
            "任务取消需填写原因，且车辆状态重置为空闲"
          ]
        }
      ],
      "sc-2": [
        {
          "key": "mod-1",
          "priority": "P0",
          "name": "任务列表与接单确认",
          "description": "司机在移动端查看待接单、进行中、已完成的任务列表，接收任务推送通知，点击任务进入详情并确认接单，同时展示任务状态变更的实时同步。",
          "features": [
            "展示待接单/进行中/已完成三个分类的任务列表，支持下拉刷新",
            "接收任务推送通知并显示未读数量，点击推送直接跳转至对应任务详情",
            "在待接单任务上点击「确认接单」按钮，完成接单操作并更新任务状态"
          ],
          "pageSuggestion": "DriverTaskListView.vue",
          "apiSuggestion": "GET /api/driver/tasks?status={status}; POST /api/driver/tasks/{taskId}/accept",
          "dataNeeds": [
            "任务列表数据（任务ID、作业点名称、预计时间、车辆车牌、物资提货单号）",
            "推送通知消息（从消息中心获取）",
            "车辆台账信息（车牌、类型、所属单位，由管理员维护）"
          ],
          "stateRules": [
            "待接单状态->点击确认接单后变为进行中",
            "进行中任务不可重复接单",
            "推送通知需在在线网络正常时接收（无需离线缓存）"
          ]
        },
        {
          "key": "mod-2",
          "priority": "P0",
          "name": "任务详情与导航启动",
          "description": "展示任务完整的详细信息，包括作业点位置（地图坐标）、预计到达时间、关联物资提货单号、车辆基本信息（车牌、司机联系方式），提供启动第三方地图APP导航的功能，并支持电话直拨联系调度员。",
          "features": [
            "渲染任务详情卡片，包含作业点名称、地址、经纬度、预计到达时间、关联物资提货单号、车牌、司机手机号",
            "点击「导航」按钮，调用系统地图APP（高德/百度/腾讯）以经纬度或地址发起导航",
            "点击司机手机号或调度员联系电话直接拨打电话",
            "若关联物资提货单，显示提货单号并支持点击跳转查看物资详情（需物资系统接口）"
          ],
          "pageSuggestion": "DriverTaskDetailView.vue",
          "apiSuggestion": "GET /api/driver/tasks/{taskId} (返回完整详情, 含物资提货单号)",
          "dataNeeds": [
            "任务详情数据（作业点坐标、地址、预计到达时间、物资提货单号）",
            "车辆基本信息（车牌、司机联系方式，来自车辆台账）",
            "物资提货单详情（如果需跳转，调用物资系统接口）"
          ],
          "stateRules": [
            "在任务状态为“进行中”时才能查看详情和导航",
            "导航启动前需检查是否已到达（若已到达则提示并禁用导航按钮）",
            "物资提货单详情接口调用失败时需提示但不阻塞导航（建议确认物资系统接口可用性）"
          ]
        },
        {
          "key": "mod-3",
          "priority": "P0",
          "name": "任务到达与完成确认",
          "description": "在司机到达作业点后点击「到达确认」按钮，装卸完成后点击「完成确认」并拍照上传现场照片，任务自动进入关闭状态并同步至调度中心、门禁系统及物资系统。",
          "features": [
            "提供「到达确认」按钮，点击后记录到达时间并更新任务状态为“已到达”",
            "提供「完成确认」按钮，点击后弹出拍照/相册选择组件，上传1-3张现场照片",
            "上传完成后提交，任务状态更新为“已完成”，系统自动触发状态同步给调度中心、门禁系统及物资系统",
            "在任务状态为“已完成”后，所有操作按钮置灰禁用"
          ],
          "pageSuggestion": "DriverTaskExecuteView.vue",
          "apiSuggestion": "POST /api/driver/tasks/{taskId}/arrive; POST /api/driver/tasks/{taskId}/complete (multipart/form-data 上传照片)",
          "dataNeeds": [
            "任务ID",
            "拍照/相册选择的照片文件",
            "到达时间（客户端自动获取）",
            "完成时间（客户端自动获取）"
          ],
          "stateRules": [
            "到达确认按钮仅在任务状态为“进行中”时可操作，点击后立即锁定按钮",
            "完成确认按钮仅在任务状态为“已到达”时可操作，且必须上传至少一张照片（建议确认照片是否必需）",
            "照片上传需支持压缩和断点续传，但用户明确无需离线模式，故按照在线实时上传处理",
            "任务完成提交后，系统需在后台同步状态至门禁系统（更新入场授权）和物资系统（标记提货单已完成）",
            "若同步失败，需在界面上提示用户“状态已保存，同步稍后重试”（建议确认同步失败的处理策略）"
          ]
        },
        {
          "key": "mod-4",
          "priority": "P1",
          "name": "异常反馈与协助请求",
          "description": "司机在执行任务过程中遇到找不到作业点、任务信息错误、需要临时变更等情况时，通过该模块快速向调度员或现场调度员发起反馈或呼叫，并记录异常事件。",
          "features": [
            "提供「异常反馈」按钮，点击后弹窗选择问题类型（找不到作业点/任务信息错误/车辆故障/其他）",
            "填写文字描述并可选上传现场照片，提交后生成异常事件并通知对应调度员",
            "提供「联系调度员」一键拨号功能，可直接拨打调度员电话",
            "查看历史反馈记录及处理进度"
          ],
          "pageSuggestion": "DriverFeedbackView.vue",
          "apiSuggestion": "POST /api/driver/feedback (提交异常); GET /api/driver/feedbacks (历史记录)",
          "dataNeeds": [
            "当前任务ID",
            "异常类型枚举",
            "文字描述",
            "可选照片",
            "调度员联系方式（从任务详情或系统配置获取）"
          ],
          "stateRules": [
            "异常反馈提交后，系统需即时生成事件并推送至调度员端（建议确认推送方式，如WebSocket或轮询）",
            "历史反馈记录保留最近30天（建议确认保留时长）",
            "一键拨号需获取设备电话权限"
          ]
        }
      ],
      "sc-3": [
        {
          "key": "mod-0",
          "priority": "P0",
          "name": "异常告警与司机反馈接收面板",
          "description": "实时接收系统触发的车辆异常告警（超速>30km/h、禁入区域、异常停留）以及司机主动反馈的异常消息（找不到作业点、车辆排队等），支持按类型和紧急程度筛选，快速跳转至处理操作。",
          "features": [
            "展示实时告警与司机反馈消息列表（含时间、车辆、类型、紧急程度）",
            "支持按告警类型（超速/禁入/异常停留/司机反馈）筛选和排序",
            "点击告警项可弹出快捷处理入口（查看车辆详情、发起通讯、转派任务）",
            "已读/未读标记，告警自动消失或手动清除"
          ],
          "pageSuggestion": "MobileDispatchView.vue",
          "apiSuggestion": "GET /api/alerts/realtime?role=field_dispatcher; POST /api/alerts/ack",
          "dataNeeds": [
            "告警ID",
            "车辆ID",
            "告警类型",
            "告警时间",
            "告警位置",
            "告警描述",
            "紧急程度",
            "司机反馈内容",
            "处理状态"
          ],
          "stateRules": [
            "超速告警：车速>30km/h触发，建议确认GPS或车载设备上报频率",
            "禁入区域告警：基于预设电子围栏，车辆进入非授权区域触发，围栏配置由管理员维护",
            "异常停留告警：由外部摄像头系统推送，本系统接收事件，建议确认接口协议",
            "司机反馈：通过移动端提交，同步至调度员端",
            "告警未处理前一直显示，处理后自动标记为已处理"
          ]
        },
        {
          "key": "mod-1",
          "priority": "P0",
          "name": "周边车辆实时状态视图",
          "description": "在地图或列表模式下展示现场调度员周边车辆的实时位置、任务状态（空闲/任务中/排队/异常）、可用性及异常标识，支持按车辆类型、距离、状态筛选，方便快速定位目标车辆。",
          "features": [
            "地图模式：标注车辆位置、速度、状态颜色（绿色空闲/黄色任务中/红色异常）",
            "列表模式：展示车辆车牌、类型、当前任务、司机、位置距离、异常标识",
            "支持按车辆类型（生产/物流/外协/临时）和状态筛选",
            "点击车辆可查看详细信息（联系方式、当前任务详情）并跳转至任务调整操作"
          ],
          "pageSuggestion": "MobileDispatchView.vue",
          "apiSuggestion": "GET /api/vehicles/nearby?lat={}&lng={}&radius={}",
          "dataNeeds": [
            "车辆ID",
            "车牌号",
            "车辆类型",
            "实时位置（经纬度）",
            "速度",
            "任务状态",
            "可用性",
            "异常标识",
            "司机ID",
            "司机手机号"
          ],
          "stateRules": [
            "速度>30km/h时异常标识为“超速”",
            "车辆位于禁入区域时异常标识为“禁入”",
            "车辆停留超过设定阈值且无任务关联时异常标识为“异常停留”，阈值建议确认（默认10分钟）",
            "车辆任务状态包括：空闲、已接单、前往作业点、作业中、排队、异常"
          ]
        },
        {
          "key": "mod-2",
          "priority": "P0",
          "name": "任务调整操作（改派/取消/加派）",
          "description": "针对选中车辆或任务提供改派至其他司机、取消当前任务、新增临时任务的操作能力，操作时需记录原因和备注，确认后自动更新任务状态并同步至调度中心。",
          "features": [
            "选择目标车辆后，可执行“改派”：选择新司机（从周边空闲司机列表选择）并填写改派原因",
            "选择目标车辆后，可执行“取消任务”：取消当前关联任务，系统通知原司机",
            "可执行“新增临时任务”：填写作业点、预计时间、要求，生成新任务分配给当前车辆或司机",
            "所有调整操作需二次确认，系统生成操作日志并实时同步至调度中心"
          ],
          "pageSuggestion": "MobileDispatchView.vue",
          "apiSuggestion": "POST /api/tasks/reassign; POST /api/tasks/cancel; POST /api/tasks/create",
          "dataNeeds": [
            "任务ID",
            "车辆ID",
            "司机ID列表（可选用）",
            "调整原因",
            "备注",
            "操作时间",
            "操作人"
          ],
          "stateRules": [
            "改派后原司机任务状态变为“已取消”，新司机任务状态变为“待接单”",
            "取消任务需判断任务是否已经开始执行（已到达作业点则不可取消，建议确认）",
            "新增临时任务需验证车辆是否空闲，若车辆已在任务中则提示冲突",
            "所有调整记录保存至操作日志，支持审计追溯"
          ]
        },
        {
          "key": "mod-3",
          "priority": "P1",
          "name": "即时通讯面板",
          "description": "提供与目标车辆驾驶员的文本即时通讯能力，可在查看车辆详情或处理任务调整时快速发起会话，用于沟通位置、问题、协调等，消息记录留存备查。",
          "features": [
            "从车辆详情或告警项一键发起与司机的即时通讯会话",
            "支持文本消息发送、接收，显示消息时间和送达状态",
            "支持快捷回复模板（如“请等待”、“已改派”、“请前往XX区域”）",
            "消息记录按车辆/任务维度存储，可在历史记录中查看"
          ],
          "pageSuggestion": "MobileDispatchView.vue",
          "apiSuggestion": "WS /ws/chat; GET /api/chat/history?vehicleId={}",
          "dataNeeds": [
            "会话ID",
            "发送人ID",
            "接收人ID",
            "消息内容",
            "发送时间",
            "消息类型（文本/模板）",
            "阅读状态"
          ],
          "stateRules": [
            "移动端全程在线，消息实时推送，无需离线缓存",
            "消息记录保存至少30天（建议确认）",
            "通讯内容需遵守数据安全规范，敏感信息脱敏"
          ]
        },
        {
          "key": "mod-4",
          "priority": "P1",
          "name": "异常处理记录与上报表单",
          "description": "在执行完任务调整或处置告警后，填写异常处理记录（包含时间、车辆、处理人、处理类型、原因、结果），支持拍照或上传截图，确认后生成正式记录并同步至管理报表系统。",
          "features": [
            "自动预填处理人、处理时间、关联车辆和告警ID",
            "选择处理类型（改派/取消/加派/现场解决/已通知其他部门等）",
            "填写处理说明（文本）并支持拍照/图片上传",
            "提交后生成唯一记录编号，状态变为“已处理”，同步至调度中心和报表系统"
          ],
          "pageSuggestion": "MobileDispatchView.vue",
          "apiSuggestion": "POST /api/incident-records",
          "dataNeeds": [
            "记录ID",
            "关联告警ID",
            "关联任务ID",
            "车辆ID",
            "处理人ID",
            "处理类型",
            "处理说明",
            "附件图片URL",
            "处理时间"
          ],
          "stateRules": [
            "记录一旦提交不可修改，仅允许补充附件（建议确认）",
            "如果处理类型为“改派/取消”，必须关联对应的任务调整操作记录",
            "所有记录纳入操作日志，支持后续审计和责任追溯"
          ]
        }
      ],
      "sc-4": [
        {
          "key": "mod-1",
          "priority": "P0",
          "name": "入场待核验车辆队列",
          "description": "展示门岗前待核验的车辆列表，包括车牌号、核验状态（通过/失败/需人工判断/接口异常）及来源（预约/派车任务）。支持实时刷新和筛选，帮助门岗人员快速定位待处理车辆。",
          "features": [
            "按时间倒序展示待核验车辆列表（车牌、核验状态、来源）",
            "支持按核验状态（全部/通过/失败/需人工判断/接口异常）筛选",
            "支持手动刷新或自动轮询更新列表",
            "点击车辆行进入核验详情"
          ],
          "pageSuggestion": "GateAccessCheckView.vue",
          "apiSuggestion": "GET /api/gate/pending-vehicles",
          "dataNeeds": [
            "车辆基础信息（车牌号、车辆类型、所属单位）",
            "核验结果状态（通过/失败/需人工判断/接口异常）",
            "核验来源类型（预约、派车任务、临时入场）",
            "预约/任务编号"
          ],
          "stateRules": [
            "车辆触发道闸感应后自动进入待核验队列，状态初始为'待核验'",
            "门禁接口返回后更新状态为'通过'或'失败'或'需人工判断'",
            "接口调用超时或异常时标记为'接口异常'，允许降级处理",
            "核验通过车辆5秒内自动放行（建议确认自动放行时长）"
          ]
        },
        {
          "key": "mod-2",
          "priority": "P0",
          "name": "核验结果与来源详情展示",
          "description": "展示单辆车的详细核验结果，包括门禁接口返回的完整信息（如失败原因、黑名单标记、证照过期等），以及关联的预约审批记录或派车任务详情。帮助门岗人员做出人工判断决策。",
          "features": [
            "展示核验结果总览（通过/失败/需人工判断）及失败或需判断的具体原因",
            "展示车辆档案关键信息（车牌、类型、所属单位、司机、证照有效期）",
            "展示关联预约/派车任务的详细信息（作业区域、预计时间、任务编号）",
            "支持查看接口返回的原始数据（建议仅运维角色可见）"
          ],
          "pageSuggestion": "GateAccessCheckView.vue",
          "apiSuggestion": "GET /api/gate/vehicle-check-result/{vehicleId}",
          "dataNeeds": [
            "门禁接口返回的核验结果对象（包含状态码、描述、详细原因列表）",
            "车辆档案（车牌、类型、所属单位、司机联系方式、证照到期日）",
            "预约审批记录（审批状态、有效期、作业区域）",
            "派车任务（任务状态、作业点、计划时间）"
          ],
          "stateRules": [
            "核验失败原因映射：黑名单、证照过期、保险失效、年检过期、准入过期、无有效预约/任务",
            "需人工判断时，界面需高亮提示并给出判断依据（如证照即将到期、信息不完整）",
            "接口返回'失败'但原因不明确时，标记为'需人工判断'（建议确认）"
          ]
        },
        {
          "key": "mod-3",
          "priority": "P0",
          "name": "放行/拒绝操作确认",
          "description": "提供门岗人员执行放行或拒绝操作的交互控件，包括二次确认弹窗。放行时触发道闸开启（通过门禁接口），拒绝时需填写异常原因。支持一键放行已通过车辆，以及手动放行失败/需人工判断的车辆。",
          "features": [
            "对核验通过车辆提供一键放行按钮，点击后执行放行操作",
            "对核验失败或需人工判断车辆提供手动放行与拒绝两个操作按钮",
            "放行操作触发二次确认弹窗（防止误操作）",
            "拒绝操作要求必须填写异常原因（原因来自预设列表或手动输入）"
          ],
          "pageSuggestion": "GateAccessCheckView.vue",
          "apiSuggestion": "POST /api/gate/vehicle-action（body: {action: allow/reject, vehicleId, reason, remark}）",
          "dataNeeds": [
            "当前选中车辆的ID及核验结果",
            "预设拒绝原因列表（黑名单、证照过期、无预约、车辆不符、其他）",
            "门禁道闸接口调用状态（成功/失败）",
            "操作员身份（当前登录门岗人员）"
          ],
          "stateRules": [
            "已放行车辆从待核验列表中移除，进入已处理记录",
            "拒绝操作后车辆标记为拒绝入场，可生成告警通知安保（建议确认）",
            "道闸接口调用失败时，操作记录为'放行失败'，提供重试或降级手动开关闸（建议确认）",
            "所有操作必须留痕，记录时间、操作员、操作类型、原因"
          ]
        },
        {
          "key": "mod-4",
          "priority": "P1",
          "name": "异常原因登记与留痕",
          "description": "当门岗选择拒绝放行或进行人工降级处理时，必须登记异常原因。提供结构化表单（原因分类+详细描述），并自动关联车辆、任务、操作员信息，生成可追溯的审计记录。",
          "features": [
            "在拒绝或降级操作时弹出异常原因登记弹窗",
            "支持选择预设原因（黑名单/证照过期/无预约/车辆不符/其他）",
            "支持填写详细说明文本（必填）",
            "提交后自动生成异常事件记录，并推送至安全管控系统（建议确认）"
          ],
          "pageSuggestion": "GateAccessCheckView.vue",
          "apiSuggestion": "POST /api/gate/abnormal-record",
          "dataNeeds": [
            "车辆ID、操作类型（拒绝/降级放行）",
            "预设原因选项列表",
            "操作员ID、当前时间",
            "关联的任务ID或预约ID（如有）"
          ],
          "stateRules": [
            "异常记录需与入场记录关联，支持后续追溯查询",
            "若系统配置了安全管控告警，异常记录应触发告警通知（建议确认）",
            "异常原因登记不可修改（一旦提交，需管理员撤销才能更正）"
          ]
        },
        {
          "key": "mod-5",
          "priority": "P0",
          "name": "入场记录同步与状态追踪",
          "description": "展示所有入场处理记录（包括放行/拒绝），同步状态（已同步/同步中/同步失败），支持手动触发重新同步。确保入场记录与门禁系统、车辆管理系统数据一致，便于后续统计和审计。",
          "features": [
            "以列表形式展示历史入场记录（时间、车牌、操作、结果、同步状态）",
            "对同步失败的记录提供手动重新同步按钮",
            "支持按时间范围、车牌、操作结果筛选",
            "显示最后一次同步尝试的时间及错误信息"
          ],
          "pageSuggestion": "GateAccessCheckView.vue",
          "apiSuggestion": "GET /api/gate/entry-records，POST /api/gate/retry-sync/{recordId}",
          "dataNeeds": [
            "入场记录（时间、车牌、操作类型、结果、操作员）",
            "同步状态（待同步、同步中、已同步、同步失败）",
            "同步失败错误信息",
            "关联的核验结果快照"
          ],
          "stateRules": [
            "放行或拒绝操作后，记录状态为'待同步'，系统自动尝试同步",
            "自动同步重试3次仍失败后标记为'同步失败'，需人工干预（建议确认重试次数）",
            "同步失败不影响车辆已放行的物理状态，仅记录一致性延迟",
            "管理员可查看同步失败详情并手动触发重新同步"
          ]
        },
        {
          "key": "mod-6",
          "priority": "P1",
          "name": "接口异常降级处理",
          "description": "当门禁接口调用失败、超时或返回异常时，提供降级处理能力：门岗人员可基于车辆预约信息、派车任务或手动录入信息，人工判断是否放行，并记录降级原因。确保在接口异常期间车辆入场不受阻断。",
          "features": [
            "在接口异常状态下显示降级操作面板，标识'接口异常'",
            "支持手动录入或从预约/任务列表中选择车辆信息进行核验（脱机模式）",
            "人工判断后执行放行或拒绝，并标记操作为'人工降级'",
            "降级操作记录包括原始接口异常信息（超时/错误码等）"
          ],
          "pageSuggestion": "GateAccessCheckView.vue",
          "apiSuggestion": "POST /api/gate/degraded-action",
          "dataNeeds": [
            "接口异常类型（超时、连接拒绝、返回格式错误等）",
            "降级时所需的车辆信息（车牌、司机、预约单号等，可手动输入或选择）",
            "车辆基础档案（供门岗核验时参考）"
          ],
          "stateRules": [
            "接口异常状态自动检测，连续2次调用失败触发降级模式（建议确认阈值）",
            "降级模式下所有操作记录必须标记为'人工降级'，并记录原始接口异常原因",
            "降级放行车辆后续需在系统恢复正常后补录核验（建议确认）",
            "降级操作需双人复核（建议确认，根据安全级别）"
          ]
        }
      ],
      "sc-5": [
        {
          "key": "mod-1",
          "priority": "P0",
          "name": "多维度数据筛选与联动刷新",
          "description": "为管理人员提供时间范围（日/周/月/自定义）、车辆类型、作业区域等维度筛选面板，选择后自动刷新指标卡片、趋势图和明细数据，确保报表数据实时对应筛选条件。",
          "features": [
            "展示时间范围选择器（日/周/月/自定义）及日历控件",
            "展示车辆类型多选下拉（生产车辆/物流车辆/外协车辆/临时车辆）",
            "展示作业区域单选或复选（根据场地电子围栏区域动态加载）",
            "点击“查询”或筛选变更后触发所有图表和明细数据联动刷新"
          ],
          "pageSuggestion": "ManagementReportsView.vue",
          "apiSuggestion": "GET /api/reports/filterOptions（获取可选维度值）; GET /api/reports/summary?timeRange=...&vehicleType=...&area=...",
          "dataNeeds": [
            "时间范围预定义选项（今日/本周/本月/自定义）",
            "车辆类型枚举值（由车辆档案管理模块提供）",
            "作业区域列表（由场地管理或系统配置提供）",
            "当前筛选条件下各指标的聚合数据"
          ],
          "stateRules": [
            "筛选条件变更后，指标卡片、趋势图、明细表格应同步加载（加载中状态）",
            "自定义时间范围需包含开始日期和结束日期，结束日期不能早于开始日期",
            "若某一维度无数据（如该区域无车辆），应展示空状态提示"
          ]
        },
        {
          "key": "mod-2",
          "priority": "P0",
          "name": "关键运营指标卡片组",
          "description": "以卡片形式展示车辆利用率、任务完成率、平均等待时长、空驶率、排队车辆数等核心指标，支持点击卡片下钻至对应明细列表。",
          "features": [
            "展示5个指标卡片，每个卡片包含指标名称、数值、环比变化趋势（上升/下降/持平）",
            "卡片数值随筛选条件变化实时刷新",
            "点击卡片（如车辆利用率）跳转至下钻明细表格（如车辆利用率明细列表）",
            "鼠标悬停显示指标计算口径说明（如车辆利用率 = 使用时长 / 可用时长）"
          ],
          "pageSuggestion": "ManagementReportsView.vue",
          "apiSuggestion": "GET /api/reports/indicators?timeRange=...&vehicleType=...&area=...",
          "dataNeeds": [
            "车辆利用率（单位：百分比）",
            "任务完成率（已完成任务数/总任务数）",
            "平均等待时长（分钟）",
            "空驶率（空驶里程/总里程）",
            "排队车辆数（当前处于排队状态的车辆数）",
            "环比变化方向（与上一周期对比）"
          ],
          "stateRules": [
            "若某指标数据不足（如新系统无历史数据），应展示“暂无数据”占位",
            "环比计算周期与筛选时间范围对应：若选本周，则环比上周",
            "排队车辆数仅统计当前时间点（非历史），因此筛选时间范围不影响该值（建议确认：排队车辆数是当前值还是历史平均值？若为历史平均值则需调整）"
          ]
        },
        {
          "key": "mod-3",
          "priority": "P0",
          "name": "指标趋势图分析",
          "description": "通过折线图或柱状图展示关键指标（如车辆利用率、任务完成率、平均等待时长）随时间变化的趋势，支持日/周/月切换，并可点击数据点下钻查看当日详情。",
          "features": [
            "默认展示车辆利用率趋势折线图，可通过下拉切换为任务完成率或平均等待时长",
            "支持切换粒度（日趋势/周趋势/月趋势）",
            "鼠标悬停在数据点上显示日期和具体数值",
            "点击数据点跳转至该时间点的明细数据列表"
          ],
          "pageSuggestion": "ManagementReportsView.vue",
          "apiSuggestion": "GET /api/reports/trend?metric=utilization&granularity=day&timeRange=...&vehicleType=...&area=...",
          "dataNeeds": [
            "各指标按时间维度的数值数组",
            "时间标签（日期/周/月）",
            "当前选中指标名称"
          ],
          "stateRules": [
            "趋势图需与筛选面板中的时间范围联动，如选择“本周”则粒度默认“日”，选择“本月”默认“日”或“周”可配置",
            "若某一周期数据缺失，应使用虚线连接相邻数据点并标注缺失",
            "点击下钻时，需携带当前筛选条件及选中的时间点作为明细表格的过滤条件"
          ]
        },
        {
          "key": "mod-4",
          "priority": "P0",
          "name": "明细数据下钻与详情查看",
          "description": "提供外协车辆使用次数及费用统计表、异常入场记录列表、排班与排队分析表等明细数据，支持从指标卡片或趋势图点击下钻进入，也可在表格内进一步按车辆、司机、任务进行搜索和筛选。",
          "features": [
            "展示外协车辆使用次数及费用明细（按次/按时计费，含车辆、司机、作业时间、费用金额）",
            "展示异常入场记录列表（车牌、原因、时间、处理人、处理结果）",
            "展示排班与排队分析表（车辆排队时长、等待作业点等）",
            "表格支持按列排序、关键字搜索、分页浏览，并可导出当前明细数据"
          ],
          "pageSuggestion": "ManagementReportsView.vue（或通过弹窗/新页面展示）",
          "apiSuggestion": "GET /api/reports/detail?type=outsourcingFee&timeRange=...&vehicleType=...&area=...",
          "dataNeeds": [
            "外协车辆使用记录（车辆ID、所属单位、司机、入场时间、出场时间、作业区域、计费方式、费用金额）",
            "异常入场记录（入场时间、车辆、异常类型、详情、处理人、处理结果）",
            "排班与排队分析数据（车辆ID、任务ID、排队开始时间、等待时长、作业点）"
          ],
          "stateRules": [
            "外协费用统计无需对接财务系统，系统内按次/按时计费逻辑由管理员在车辆台账中配置计费方式（建议确认：计费标准由管理员在车辆档案中预设还是每次任务录入？）",
            "异常入场记录来源于门禁入场核验时标记的异常（黑名单、证照过期、无预约等）",
            "明细表格支持导出当前筛选条件下的所有数据（CSV/Excel格式），导出功能可复用导出模块"
          ]
        },
        {
          "key": "mod-5",
          "priority": "P1",
          "name": "报表导出与下载",
          "description": "允许管理人员将当前筛选条件下的指标卡片、趋势图及明细数据一键导出为Excel或PDF文件，用于汇报或存档。导出内容包含当前筛选条件说明、指标卡片汇总、趋势图快照及明细表格。",
          "features": [
            "提供“导出Excel”和“导出PDF”两个按钮",
            "导出时，系统生成包含摘要（筛选条件、时间）和完整报表的文件",
            "支持选择导出范围：仅指标摘要、仅明细数据、或完整报表",
            "导出完成后提供下载链接或直接下载文件，同时记录导出操作日志"
          ],
          "pageSuggestion": "ManagementReportsView.vue",
          "apiSuggestion": "POST /api/reports/export?format=excel&scope=full（生成异步任务）; GET /api/reports/export/status/{taskId}（轮询状态）; GET /api/reports/export/download/{taskId}（下载）",
          "dataNeeds": [
            "当前筛选条件（时间、车辆类型、作业区域）",
            "指标卡片数值",
            "趋势图数据（可选，PDF中可截图）",
            "明细表格数据"
          ],
          "stateRules": [
            "导出可能需要时间，应显示进度条或任务状态（等待/生成中/完成/失败）",
            "文件大小限制（如不超过50MB），若数据量过大提示用户缩小筛选范围",
            "导出日志需记录操作人、导出时间、筛选条件、文件格式，便于审计追溯"
          ]
        }
      ],
      "sc-6": [
        {
          "key": "mod-1",
          "priority": "P0",
          "name": "预约申请待办列表",
          "description": "展示所有待审批的外协/临时车辆预约申请，支持按申请时间、车辆类型、作业区域等条件筛选和排序，方便调度员快速定位待处理任务。",
          "features": [
            "查看待审批预约申请列表（含车牌号、所属单位、作业区域、申请时间、审批状态）",
            "按条件筛选（车辆类型、作业区域、申请日期）和排序（申请时间、紧急程度）",
            "点击申请项进入详情审批操作面板",
            "实时刷新列表，支持手动刷新"
          ],
          "pageSuggestion": "ReservationApprovalList.vue",
          "apiSuggestion": "GET /api/reservations?status=pending",
          "dataNeeds": [
            "预约申请列表数据（id, 车辆id, 车牌号, 所属单位, 司机姓名, 司机电话, 作业区域, 作业开始时间, 作业结束时间, 申请时间, 审批状态, 审批人, 审批意见）",
            "车辆档案信息（车辆类型, 年检状态, 保险状态, 准入有效期, 证照过期日期）用于列表展示"
          ],
          "stateRules": [
            "申请状态包括：待审批、已通过、已驳回、已过期",
            "若申请超过作业开始时间仍未审批，列表标记为「超时待处理」并显示黄色提示（建议确认）",
            "筛选条件中的车辆类型来源于管理员维护的车辆台账"
          ]
        },
        {
          "key": "mod-2",
          "priority": "P0",
          "name": "预约审批详情与操作面板",
          "description": "展示单个预约申请的完整详情（含关联车辆档案信息、证照状态、准入有效期校验结果），调度员可在此页面进行通过或驳回操作，并填写审批意见。审批通过后自动触发授权码生成与门禁同步。",
          "features": [
            "展示预约申请详细字段（车辆信息、司机、作业时间、区域等）",
            "自动调用车辆台账接口校验准入有效期、证照状态，并展示校验结果（正常/过期/即将过期）",
            "提供「通过」和「驳回」操作按钮，驳回时必填原因",
            "通过后自动生成入场授权码（二维码），并通过接口推送到门禁系统，推送状态实时反馈"
          ],
          "pageSuggestion": "ReservationApprovalDetail.vue",
          "apiSuggestion": "POST /api/reservations/{id}/approve (通过) / POST /api/reservations/{id}/reject (驳回)；GET /api/vehicles/{id}/status (车辆状态校验)",
          "dataNeeds": [
            "预约申请详情（所有字段）",
            "车辆档案完整信息（车辆类型, 车牌号, 所属单位, 司机信息, 证照图片URL, 年检状态, 保险状态, 准入有效期, 证照过期日期）",
            "门禁系统接口返回的状态（同步成功/失败）",
            "授权码（系统自动生成）"
          ],
          "stateRules": [
            "若车辆证照过期或准入有效期不足当前日期，系统自动拒绝并提示原因，审批人可覆盖通过（需二次确认）",
            "若门禁接口同步失败，系统保留授权码并标记「同步失败」状态，调度员可在列表中手动重试同步",
            "审批通过后，授权码有效期为作业时间范围，超时自动失效（建议确认）",
            "所有审批操作生成操作日志，不可修改"
          ]
        },
        {
          "key": "mod-3",
          "priority": "P1",
          "name": "授权码管理与同步监控",
          "description": "管理已生成的授权码列表，查看每个授权码的生效状态（有效/已使用/已过期/同步失败），支持手动重新推送授权码至门禁系统，确保入场核验无障碍。",
          "features": [
            "查看所有已生成的授权码列表（含预约申请、车辆、授权码、生成时间、有效期、同步状态）",
            "按状态筛选（同步成功/同步失败/待同步）",
            "手动触发指定授权码重新同步至门禁系统",
            "查看授权码使用记录（入场时间、出场时间、核验门岗）"
          ],
          "pageSuggestion": "AccessCodeManagement.vue",
          "apiSuggestion": "GET /api/access-codes; POST /api/access-codes/{id}/resync",
          "dataNeeds": [
            "授权码列表（id, 申请id, 车牌号, 授权码, 生成时间, 有效期开始, 有效期结束, 同步状态, 入场时间, 出场时间, 核验门岗ID）",
            "门禁系统同步接口结果"
          ],
          "stateRules": [
            "同步状态：待同步（自生成后未调用接口）、同步成功、同步失败",
            "已过期的授权码不可再次同步",
            "同步失败时，系统记录失败原因（如接口超时）并在列表中显示红色错误标识",
            "门岗核验入场后，授权码状态变为「已使用」，不可重复使用"
          ]
        },
        {
          "key": "mod-4",
          "priority": "P1",
          "name": "历史预约记录查询",
          "description": "提供所有外协/临时车辆预约的历史记录查询，包括审批状态、授权码、入场/出场时间、费用记录等，支持多维度筛选和导出，用于费用统计与对账。",
          "features": [
            "查看历史预约列表（按时间倒序，显示审批状态、授权码、入场/出场时间）",
            "按车辆、所属单位、作业区域、时间范围等筛选",
            "点击查看单条记录的完整操作日志（审批人、审批时间、修改记录）",
            "导出查询结果（Excel格式）用于费用统计"
          ],
          "pageSuggestion": "ReservationHistory.vue",
          "apiSuggestion": "GET /api/reservations/history?status=approved&startTime=&endTime=&vehicleId=&unit=",
          "dataNeeds": [
            "历史预约记录（所有字段，含审批日志、授权码使用记录）",
            "费用记录（按次/按时计费金额，计费方式，是否已结算）",
            "车辆档案信息"
          ],
          "stateRules": [
            "历史记录不可修改，仅供查询和导出",
            "费用记录由系统自动记录（根据派车次数或时长），无需对接财务系统",
            "导出操作生成导出日志，可追溯谁何时导出"
          ]
        }
      ],
      "sc-7": [
        {
          "key": "mod-1",
          "priority": "P0",
          "name": "车辆列表与高级筛选",
          "description": "提供车辆档案的列表展示、多维筛选和快速搜索能力，支撑管理员定位目标车辆并进行后续操作。",
          "features": [
            "展示车辆列表，包含车牌号、车辆类型、所属单位、司机、年检/保险/准入有效期、状态（正常/停用/待补证）等关键信息",
            "支持按车辆类型、所属单位、车辆状态（正常/停用/全部）、有效期状态（临近到期/已过期/正常）进行筛选",
            "支持按车牌号、司机姓名模糊搜索",
            "支持列表分页和每页条数调整"
          ],
          "pageSuggestion": "VehicleArchiveManager.vue",
          "apiSuggestion": "GET /api/vehicles 带查询参数（page, size, vehicleType, orgId, status, expireStatus, keyword）",
          "dataNeeds": [
            "车辆类型字典（生产车辆/物流车辆/外协车辆/临时车辆）",
            "所属单位列表（支持按单位名称筛选）",
            "车辆状态枚举（正常/停用）",
            "有效期状态计算逻辑（临近30天到期/已过期/正常）"
          ],
          "stateRules": [
            "列表默认加载所有车辆，按最近更新时间倒序排列",
            "临近30天到期的车辆在列表中高亮显示或增加标记",
            "已过期车辆状态自动变为‘证照过期’，但具体显示逻辑建议与用户确认",
            "停用车辆在列表中显示灰色或置底（建议确认界面交互）"
          ]
        },
        {
          "key": "mod-2",
          "priority": "P0",
          "name": "车辆新增/编辑表单与数据校验",
          "description": "支持管理员新增车辆或编辑已有车辆的全部基础档案信息，包括车辆类型、车牌号、所属单位、司机信息、有效期等，并自动进行数据完整性校验。",
          "features": [
            "新增车辆时填写完整表单：车辆类型、车牌号、所属单位、司机姓名、司机电话、年检有效期、保险有效期、准入有效期、证照图片上传",
            "编辑已有车辆时预填充现有数据，支持修改所有字段",
            "保存前系统自动校验必填字段（车牌号、车辆类型、所属单位）及日期格式、逻辑（如有效期不能早于当前日期）",
            "保存后数据更新生效，同步更新到期提醒列表并记录操作日志"
          ],
          "pageSuggestion": "VehicleArchiveManager.vue",
          "apiSuggestion": "POST /api/vehicles（新增）, PUT /api/vehicles/{id}（编辑）, GET /api/vehicles/{id}（获取详情）",
          "dataNeeds": [
            "车辆类型枚举列表",
            "所属单位下拉列表",
            "车牌号唯一性校验规则",
            "日期字段（年检/保险/准入有效期）必须为日期格式且不能早于当天",
            "司机信息（姓名、电话）为可选但建议必填（建议确认）"
          ],
          "stateRules": [
            "车牌号必填且不可重复，系统应做后台唯一性校验",
            "新增时若车牌号已存在则提示冲突并禁止保存",
            "年检/保险/准入有效期若填写，必须晚于当前日期；若留空则视为未设置",
            "保存时若必填字段缺失，在前端进行实时校验并阻止提交",
            "操作人信息自动从登录用户获取"
          ]
        },
        {
          "key": "mod-3",
          "priority": "P0",
          "name": "证照图片上传与管理组件",
          "description": "提供车辆行驶证、营运证等证照图片的上传、替换、预览和删除功能，支持多张图片管理，并与车辆档案关联。",
          "features": [
            "支持上传多张证照图片（行驶证、营运证、其他），支持jpg/png格式，单张大小不超过10MB（建议确认具体限制）",
            "支持预览已上传的证照图片，可点击放大查看",
            "支持替换已有证照图片（上传新图替换旧图，保留历史版本？建议确认是否保留历史记录）",
            "支持删除已上传的证照图片（删除后需用户确认，系统记录操作日志）"
          ],
          "pageSuggestion": "VehicleArchiveManager.vue",
          "apiSuggestion": "POST /api/vehicles/{id}/documents（上传）, DELETE /api/vehicles/{id}/documents/{docId}（删除）, GET /api/vehicles/{id}/documents（获取列表）",
          "dataNeeds": [
            "证照类型枚举（行驶证、营运证、其他）",
            "图片文件格式和大小限制",
            "每个车辆最多允许上传的证照数量（建议确认，如10张）"
          ],
          "stateRules": [
            "上传时自动压缩图片以节省存储（建议确认是否需要原图保存）",
            "替换图片时，旧图片标记为历史版本（如不保留则直接覆盖，建议确认）",
            "删除图片后，车辆档案中该证照字段显示为‘未上传’",
            "如果证照图片为空，则车辆状态标记为‘证照缺失’，影响车辆可用性（建议确认是否影响调度）"
          ]
        },
        {
          "key": "mod-4",
          "priority": "P0",
          "name": "年检/保险/准入有效期设置与到期提醒",
          "description": "管理车辆的年检、保险、准入有效期的具体日期，系统自动计算到期提醒（30天内），并在列表和管理面板中醒目提示。",
          "features": [
            "在车辆详情编辑表单中提供三个日期选择器分别设置年检、保险、准入有效期",
            "保存后系统自动计算每个有效期距离当前的天数，若<=30天则生成提醒记录并显示在提醒列表中",
            "提醒列表按到期日升序排列，显示车辆、到期类型（年检/保险/准入）、到期日期、剩余天数",
            "管理员可点击提醒记录跳转到对应车辆详情页进行处理"
          ],
          "pageSuggestion": "VehicleArchiveManager.vue",
          "apiSuggestion": "内部计算逻辑，无需额外API；提醒列表由GET /api/vehicles/expiring?days=30 获取",
          "dataNeeds": [
            "年检、保险、准入有效期字段",
            "到期提醒阈值（默认30天，可配置？建议确认）",
            "提醒状态（未处理/已处理/忽略）"
          ],
          "stateRules": [
            "日期若有值，且距当前日<=30天，则自动加入到期提醒列表",
            "若管理员更新有效期并保存，提醒列表中对应的记录自动更新或删除（若已过期重置）",
            "若有效期已过期（当前日 > 有效期），车辆在列表中状态标记为‘已过期’，并禁止在调度和门禁中使用（建议确认是否自动停用还是由管理员手动停用）",
            "提醒列表支持标记为‘已处理’，但不影响实际有效期状态"
          ]
        },
        {
          "key": "mod-5",
          "priority": "P0",
          "name": "车辆停用/启用管理与状态同步",
          "description": "管理员手动将车辆标记为‘停用’或‘启用’，停用后该车辆不可在调度派车、门禁核验等场景中使用，相关联动生效。",
          "features": [
            "在车辆详情页面提供‘停用车辆’/‘启用车辆’按钮，点击后弹出确认弹窗并填写停用原因（必填）",
            "停用操作后，车辆状态变为‘停用’，所有关联的进行中任务如何处理？建议确认：自动取消或标记异常？",
            "启用操作后，车辆恢复可用状态，可被调度",
            "停用/启用操作均记录操作日志，并同步至门禁系统（通过接口通知）和调度系统（更新车辆状态缓存）"
          ],
          "pageSuggestion": "VehicleArchiveManager.vue",
          "apiSuggestion": "PUT /api/vehicles/{id}/status（body: status: inactive/active, reason: string）",
          "dataNeeds": [
            "车辆状态枚举（正常/停用）",
            "停用原因字段",
            "同步门禁和调度系统的接口调用（建议确认具体集成方式）"
          ],
          "stateRules": [
            "停用车辆在调度看板中不可见或置灰，不能作为派车对象",
            "停用车辆在门禁系统自动拒绝入场（假设门禁系统可实时接收车辆状态变更）",
            "若车辆有未完成的任务，停用时需确认是否强制结束任务（建议确认：提示管理员先处理任务）",
            "启用操作仅恢复状态，不恢复之前的任务"
          ]
        },
        {
          "key": "mod-6",
          "priority": "P0",
          "name": "操作日志查询与导出",
          "description": "记录所有车辆档案相关的关键操作（新增、编辑、停用/启用、上传证照、删除证照等），支持查询、筛选和导出，用于审计和责任追溯。",
          "features": [
            "按车辆维度或全局查看操作日志，列表显示时间、操作人、操作类型（新增/编辑/状态变更/证照操作）、修改内容摘要",
            "支持按时间范围、操作人、操作类型、关联车辆进行筛选",
            "支持日志导出为Excel文件，包含所有筛选后的记录",
            "日志不可删除，保证审计链完整"
          ],
          "pageSuggestion": "VehicleArchiveManager.vue",
          "apiSuggestion": "GET /api/vehicles/logs?vehicleId=&operator=&actionType=&startTime=&endTime=&page=&size=, POST /api/vehicles/logs/export",
          "dataNeeds": [
            "操作类型枚举（新增/编辑/停用/启用/上传证照/删除证照等）",
            "操作人信息（从登录用户自动获取）",
            "修改内容摘要需要记录变更前后的关键字段（建议确认具体记录粒度）"
          ],
          "stateRules": [
            "每次关键操作（新增、编辑、停用/启用、证照上传/删除）均自动生成一条日志",
            "日志保存期限根据审计要求建议保留至少3年",
            "导出时支持最大导出数量限制（如10万条），建议确认"
          ]
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
      "sc-7": true
    },
    "pageDesignsByScenarioKey": {
      "sc-1": {
        "pages": [
          {
            "key": "page-1",
            "priority": "P0",
            "type": "工作台页",
            "name": "调度员实时调度派车工作台",
            "vueFile": "DispatchWorkbenchView.vue",
            "goal": "调度员集中管理实时车辆状态、接收用车需求、执行派车操作，以地图和状态看板为核心支撑高效调度。",
            "features": [
              "车辆实时地图监控",
              "车辆状态看板",
              "用车需求管理",
              "智能派车操作面板"
            ],
            "sections": [
              "地图区域（左侧主区域）：显示车辆位置、状态、轨迹，支持缩放和点击弹窗",
              "状态看板区域（右侧顶部）：卡片式统计空闲/任务中/排队/异常车辆数量，可点击筛选",
              "需求列表区域（右侧中部）：展示待处理用车需求（含生产计划推送），支持排序和派车按钮",
              "派车操作面板（右侧底部/浮动弹窗）：选择车辆、确认派车、查看推荐车辆详情"
            ],
            "states": [
              "正常态：地图加载车辆位置、看板显示统计数据、需求列表有数据、派车面板就绪",
              "空态：无车辆在线或无可调度车辆时，地图显示空区域提示，看板显示0，需求列表为空并提示“暂无待处理需求”",
              "加载态：初次加载或数据刷新时，地图和列表显示骨架屏或加载动画",
              "异常态：接口超时或数据异常时，显示错误提示和重试按钮；GPS数据中断时地图显示车辆离线标记"
            ],
            "keyInteractions": [
              "地图点击车辆弹出信息卡片（车牌、司机、速度、任务）",
              "状态看板点击分类跳转至对应车辆列表并在地图高亮",
              "需求列表点击“派车”打开派车面板，自动推荐可用车辆",
              "派车面板确认后刷新地图和看板状态，并推送消息给司机",
              "地图支持框选区域筛选车辆并同步至看板和需求列表"
            ],
            "dataInputs": [
              "GET /api/v1/vehicles/realtime-locations (返回所有车辆实时位置、速度、状态)",
              "GET /api/v1/vehicles/status-summary (返回各状态统计)",
              "GET /api/v1/request/demand-list (返回待处理用车需求列表)",
              "GET /api/v1/vehicles/available (返回推荐可用车辆列表，含距离、类型匹配)",
              "POST /api/v1/tasks/dispatch (提交派车请求，返回任务ID和状态)"
            ]
          },
          {
            "key": "page-2",
            "priority": "P0",
            "type": "看板页",
            "name": "异常告警与任务跟踪看板",
            "vueFile": "AlertAndTaskMonitorView.vue",
            "goal": "实时监控车辆异常告警（超速、禁入、异常停留）并处理，同时跟踪已派发任务的执行进度，支持干预操作。",
            "features": [
              "异常告警分级处理",
              "任务下发记录与状态跟踪"
            ],
            "sections": [
              "告警列表区域（左侧）：按时间倒序展示告警事件，支持状态筛选和严重程度颜色标识",
              "告警处理弹窗（点击告警后弹出）：展示告警详情、车辆信息、位置，提供确认/忽略/转人工按钮及备注输入",
              "任务列表区域（右侧）：展示所有已派发任务的状态和进度，支持筛选和查看详情",
              "任务详情抽屉（点击任务后展开）：显示任务步骤时间戳、司机操作记录、现场照片、关联告警记录"
            ],
            "states": [
              "正常态：告警列表和任务列表正常显示，数据实时刷新",
              "空态：无未处理告警时显示“暂无告警”，无任务时显示“暂无任务”",
              "加载态：数据加载时列表显示骨架屏",
              "异常态：告警或任务数据获取失败时显示错误提示"
            ],
            "keyInteractions": [
              "告警列表项点击后弹窗展示详情，并在地图中定位（可调用地图组件，此处假设通过传参或路由跳转到工作台地图定位）",
              "告警处理按钮触发API变更状态，处理后列表即时更新",
              "任务列表支持按状态（待接收/进行中/已完成/异常）筛选",
              "任务详情中可点击“催办”或“取消”按钮，触发对应API",
              "告警和任务均支持导出Excel（预留接口）"
            ],
            "dataInputs": [
              "GET /api/v1/alerts/list (返回告警列表，支持分页和状态过滤)",
              "POST /api/v1/alerts/handle (提交告警处理结果)",
              "GET /api/v1/tasks/history (返回任务列表，支持状态过滤)",
              "POST /api/v1/tasks/remind (发送催办通知)",
              "POST /api/v1/tasks/cancel (取消任务并附带原因)",
              "GET /api/v1/tasks/{id}/detail (获取任务详细时间线和照片)"
            ]
          }
        ],
        "navigation": [
          {
            "label": "实时调度派车",
            "target": "DispatchWorkbenchView.vue",
            "default": true
          },
          {
            "label": "异常告警与任务跟踪",
            "target": "AlertAndTaskMonitorView.vue",
            "default": false
          }
        ],
        "fileStructure": {
          "views": [
            "DispatchWorkbenchView.vue",
            "AlertAndTaskMonitorView.vue"
          ],
          "components": [
            "StatusTag.vue",
            "DataTable.vue",
            "MapView.vue",
            "VehicleInfoPopup.vue",
            "AlertHandleDialog.vue",
            "TaskDetailDrawer.vue"
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
            "type": "列表页",
            "name": "司机移动端任务列表",
            "vueFile": "DriverTaskListView.vue",
            "goal": "司机查看并确认接单，管理待接单、进行中、已完成的任务",
            "features": [
              "任务列表与接单确认"
            ],
            "sections": [
              "顶部状态筛选栏（全部/待接单/进行中/已完成）",
              "任务卡片列表区（每项显示任务ID、作业点名称、预计时间、车牌、状态标签）",
              "底部导航栏（回到工作台等）",
              "未读推送通知角标"
            ],
            "states": [
              "正常态：展示任务列表，支持下拉刷新",
              "空态：无任务时显示空状态提示（如'暂无任务'）",
              "加载态：首次加载或下拉刷新时显示加载动画",
              "异常态：网络请求失败时显示错误提示和重试按钮"
            ],
            "keyInteractions": [
              "下拉刷新触发 GET /api/driver/tasks?status=...",
              "点击任务卡片跳转至 DriverTaskExecuteView.vue 并传入 taskId",
              "在待接单任务上点击「确认接单」按钮，调用 POST /api/driver/tasks/{taskId}/accept，成功后更新卡片状态为进行中并刷新列表",
              "顶部筛选栏切换时过滤任务列表，更新页面数据",
              "点击推送通知直接跳转至对应任务详情"
            ],
            "dataInputs": [
              "任务列表数据（任务ID、作业点名称、预计时间、车辆车牌、物资提货单号、状态）",
              "推送通知消息（从消息中心获取，显示未读数量）",
              "车辆台账信息（仅用于显示车牌、类型，从管理员维护的台账获取）"
            ]
          },
          {
            "key": "page-2",
            "priority": "P0",
            "type": "详情页",
            "name": "司机移动端任务执行",
            "vueFile": "DriverTaskExecuteView.vue",
            "goal": "司机查看任务完整详情、导航到作业点、确认到达与完成、发起异常反馈",
            "features": [
              "任务详情与导航启动",
              "任务到达与完成确认",
              "异常反馈与协助请求"
            ],
            "sections": [
              "顶部导航栏（返回按钮、任务ID、状态标签）",
              "任务信息卡片区（作业点名称/地址/经纬度、预计时间、关联物资提货单号、车牌、司机手机号、调度员联系电话）",
              "操作按钮区（导航按钮、到达确认按钮、完成确认按钮）",
              "照片上传区域（拍照/相册选择、预览、删除）",
              "异常反馈入口（按钮，点击后弹出反馈表单）",
              "历史反馈记录列表（可展开查看）"
            ],
            "states": [
              "正常态：展示任务详情和对应状态下的操作按钮",
              "加载态：从列表页跳转后加载详情数据时显示骨架屏",
              "异常态：接口失败时显示错误提示和重试按钮；物资系统接口调用失败时显示提示但不阻塞导航",
              "已到达状态：到达确认按钮变灰禁用，完成确认按钮可用",
              "已完成状态：所有操作按钮置灰禁用，显示完成时间",
              "空态：如果历史反馈无记录，显示'暂无反馈'"
            ],
            "keyInteractions": [
              "页面加载时调用 GET /api/driver/tasks/{taskId} 获取详情数据",
              "点击导航按钮调用系统地图APP（通过URL Scheme传入经纬度或地址）",
              "点击司机手机号或调度员电话直接拨号",
              "点击关联物资提货单号跳转至物资详情（需调用物资系统接口）",
              "点击到达确认按钮调用 POST /api/driver/tasks/{taskId}/arrive，按钮锁定，状态更新为已到达",
              "点击完成确认按钮弹出拍照/相册选择，上传至少1张照片后调用 POST /api/driver/tasks/{taskId}/complete，上传完成后任务状态更新为已完成，状态同步至后端",
              "点击异常反馈按钮弹出反馈表单，选择类型、填写描述、可选上传照片，提交后调用 POST /api/driver/feedback，生成异常事件并推送至调度员",
              "展开历史反馈列表调用 GET /api/driver/feedbacks?taskId=...",
              "任务状态变更时自动触发状态同步至门禁系统和物资系统，若同步失败在底部提示（非阻塞）"
            ],
            "dataInputs": [
              "任务详情数据（作业点坐标、地址、预计到达时间、物资提货单号、车辆基本信息、调度员联系方式）",
              "车辆基本信息（车牌、司机联系方式，来自车辆台账）",
              "物资提货单详情（如果跳转，需物资系统接口返回）",
              "照片文件（拍照或相册选择，最多3张，必需至少1张用于完成确认）",
              "异常反馈数据（异常类型枚举、文字描述、可选照片）",
              "历史反馈记录（反馈ID、类型、描述、处理状态、时间）"
            ]
          }
        ],
        "navigation": [
          {
            "label": "任务列表",
            "target": "DriverTaskListView.vue",
            "default": true
          },
          {
            "label": "任务执行",
            "target": "DriverTaskExecuteView.vue",
            "default": false
          }
        ],
        "fileStructure": {
          "views": [
            "DriverTaskListView.vue",
            "DriverTaskExecuteView.vue"
          ],
          "components": [
            "StatusTag.vue",
            "TaskCard.vue",
            "NavigationButton.vue",
            "PhotoUpload.vue",
            "FeedbackForm.vue",
            "EmptyState.vue",
            "LoadingSkeleton.vue"
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
            "name": "现场调度移动端工作台",
            "vueFile": "MobileDispatchView.vue",
            "goal": "实时接收异常告警与司机反馈，查看周边车辆状态，并与司机即时通讯，快速发起任务调整。",
            "features": [
              "异常告警与司机反馈接收面板",
              "周边车辆实时状态视图",
              "即时通讯面板"
            ],
            "sections": [
              "顶部告警与反馈滚动通知栏（折叠/展开）",
              "中央车辆地图/列表视图（可切换）",
              "底部浮动操作栏（包含通讯入口、快速调整按钮）",
              "即时通讯面板（从底部弹出，含消息列表和输入框）"
            ],
            "states": [
              "正常态：告警数据与车辆数据加载完成，地图显示车辆标记",
              "空态：无告警且无周边车辆，显示提示信息",
              "加载态：正在获取告警和车辆数据，显示加载动画",
              "异常态：网络错误或数据加载失败，显示重试按钮"
            ],
            "keyInteractions": [
              "点击告警项弹出快捷操作菜单（查看车辆详情、发起通讯、转派任务）",
              "点击车辆标记弹出信息卡片（含司机联系方式、当前任务、调整按钮）",
              "点击通讯按钮展开即时通讯面板，与指定司机实时对话",
              "切换地图/列表视图（右上角切换图标）",
              "下拉刷新告警和车辆数据"
            ],
            "dataInputs": [
              "告警列表（GET /api/alerts/realtime）",
              "周边车辆列表（GET /api/vehicles/nearby）",
              "即时通讯消息（WebSocket）"
            ]
          },
          {
            "key": "page-2",
            "priority": "P0",
            "type": "表单页",
            "name": "任务调整与异常上报",
            "vueFile": "TaskAdjustView.vue",
            "goal": "对选中车辆/任务执行改派、取消或新增临时任务，并填写异常处理记录提交上报。",
            "features": [
              "任务调整操作（改派/取消/加派）",
              "异常处理记录与上报表单"
            ],
            "sections": [
              "顶部任务/车辆信息摘要区（车牌、司机、任务描述）",
              "操作类型选择按钮组（改派、取消、加派）",
              "操作表单区（根据选择动态显示：改派→司机选择列表；取消→确认原因；加派→作业点、时间、要求）",
              "异常处理记录区（处理原因、备注、附件上传）",
              "底部提交确认按钮区"
            ],
            "states": [
              "正常态：信息加载完成，表单可编辑",
              "加载态：提交中，显示加载遮罩",
              "异常态：提交失败，显示错误消息并可重新提交",
              "空态：未传入有效任务/车辆数据，显示错误提示"
            ],
            "keyInteractions": [
              "选择操作类型后切换显示对应表单内容",
              "改派时弹出司机选择列表（从周边空闲司机中选取）",
              "新增临时任务时弹出作业点选择/输入，并填写预计时间",
              "提交前二次确认弹窗（显示操作摘要）",
              "提交成功后自动返回主工作台页面并刷新列表"
            ],
            "dataInputs": [
              "当前任务/车辆详情（从主页面路由参数传入）",
              "可用司机列表（GET /api/drivers/available）",
              "作业地点列表（GET /api/locations）或用户手动输入",
              "附件图片文件（通过拍照或相册选取）",
              "处理原因文本"
            ]
          }
        ],
        "navigation": [
          {
            "label": "现场调度工作台",
            "target": "MobileDispatchView.vue",
            "default": true
          },
          {
            "label": "任务调整与上报",
            "target": "TaskAdjustView.vue",
            "default": false
          }
        ],
        "fileStructure": {
          "views": [
            "MobileDispatchView.vue",
            "TaskAdjustView.vue"
          ],
          "components": [
            "AlertPanel.vue",
            "VehicleMapView.vue",
            "VehicleListView.vue",
            "BottomSheet.vue",
            "ConfirmDialog.vue",
            "DriverSelector.vue",
            "ImageUploader.vue"
          ],
          "data": [
            "mockAlerts.js",
            "mockVehicles.js",
            "mockDrivers.js"
          ]
        }
      },
      "sc-4": {
        "pages": [
          {
            "key": "page-1",
            "priority": "P0",
            "type": "工作台页",
            "name": "门岗车辆入场核验与放行工作台",
            "vueFile": "GateAccessCheckView.vue",
            "goal": "门岗人员在固定终端上实时查看待核验车辆、查看核验详情、执行放行或拒绝操作，并在接口异常时进行降级处理。",
            "features": [
              "入场待核验车辆队列",
              "核验结果与来源详情展示",
              "放行/拒绝操作确认",
              "异常原因登记与留痕",
              "接口异常降级处理"
            ],
            "sections": [
              "顶部状态栏：显示当前接口连接状态（正常/异常）、待处理车辆数",
              "左侧待核验车辆列表：车牌号、核验状态图标、来源标签，支持筛选",
              "右侧核验详情与操作区：车辆档案摘要、核验结果详情、预设原因列表、手动放行/拒绝按钮、异常原因登记弹窗",
              "底部操作日志/提示区域（可选）"
            ],
            "states": [
              "正常态：车辆队列正常刷新，接口在线",
              "空态：无待核验车辆，显示“当前无待入场车辆”",
              "加载态：列表或详情数据加载中，显示骨架屏",
              "异常态：接口超时/失败，触发降级模式，降级面板显示；或列表刷新失败提示"
            ],
            "keyInteractions": [
              "点击车辆行 → 加载该车核验详情到右侧区域",
              "核验通过车辆：点击“放行”按钮 → 二次确认弹窗 → 确认后调接口放行 → 该车从列表移除，并显示放行成功反馈",
              "核验失败/需人工判断车辆：点击“手动放行”或“拒绝” → 若拒绝则弹出异常原因登记弹窗 → 选择原因并填写说明 → 提交后记录并更新列表",
              "接口异常时自动显示降级面板，门岗可手动录入车牌/选择预约任务 → 判断放行/拒绝 → 标记降级",
              "支持手动刷新和自动轮询"
            ],
            "dataInputs": [
              "GET /api/gate/pending-vehicles（待核验车辆列表）",
              "GET /api/gate/vehicle-check-result/{vehicleId}（核验详情）",
              "POST /api/gate/vehicle-action（放行/拒绝）",
              "POST /api/gate/abnormal-record（异常登记）",
              "POST /api/gate/degraded-action（降级操作）",
              "获取预设拒绝原因列表"
            ]
          },
          {
            "key": "page-2",
            "priority": "P1",
            "type": "列表页",
            "name": "入场记录查询与同步管理",
            "vueFile": "GateEntryRecordsView.vue",
            "goal": "门岗或管理员查看历史入场处理记录（放行/拒绝），追踪记录同步状态，对同步失败的记录进行手动重新同步。",
            "features": [
              "入场记录同步与状态追踪"
            ],
            "sections": [
              "顶部筛选栏：时间范围、车牌号、操作结果（放行/拒绝）、同步状态",
              "记录列表：显示时间、车牌、操作类型、操作员、同步状态标签、重新同步按钮（仅同步失败时显示）",
              "记录详情弹窗（点击行展开）：显示完整核验结果快照、接口返回信息、异常原因、降级标记等"
            ],
            "states": [
              "正常态：列表正常展示，同步状态正常",
              "空态：无历史记录，显示“暂无入场记录”",
              "加载态：列表数据加载中",
              "部分异常态：某些记录同步失败，显示红色“同步失败”标签和重试按钮"
            ],
            "keyInteractions": [
              "筛选条件变化后自动请求列表",
              "点击同步失败记录的“重新同步”按钮 → 调用重试接口 → 更新同步状态",
              "点击行可查看详细核验结果快照"
            ],
            "dataInputs": [
              "GET /api/gate/entry-records（带筛选参数）",
              "POST /api/gate/retry-sync/{recordId}（重试同步）",
              "GET /api/gate/entry-record/{recordId}（详细记录）"
            ]
          }
        ],
        "navigation": [
          {
            "label": "车辆入场核验",
            "target": "GateAccessCheckView.vue",
            "default": true
          },
          {
            "label": "入场记录",
            "target": "GateEntryRecordsView.vue",
            "default": false
          }
        ],
        "fileStructure": {
          "views": [
            "GateAccessCheckView.vue",
            "GateEntryRecordsView.vue"
          ],
          "components": [
            "VehicleListPanel.vue",
            "CheckResultDetail.vue",
            "ActionButtons.vue",
            "AbnormalReasonDialog.vue",
            "DegradedModePanel.vue",
            "EntryRecordsTable.vue",
            "FilterBar.vue"
          ],
          "data": [
            "gateMockData.js"
          ]
        }
      },
      "sc-5": {
        "pages": [
          {
            "key": "page-1",
            "priority": "P1",
            "type": "工作台页",
            "name": "运营报表概览工作台",
            "vueFile": "ManagementReportsView.vue",
            "goal": "管理人员通过该页面查看实时关键运营指标，按时间、车辆类型、作业区域等维度筛选数据，通过指标卡片和趋势图快速掌握整体状况，并可导出报表或下钻到明细详情。",
            "features": [
              "多维度数据筛选与联动刷新",
              "关键运营指标卡片组",
              "指标趋势图分析",
              "报表导出与下载"
            ],
            "sections": [
              "顶部筛选区（时间范围选择器、车辆类型多选、作业区域多选、查询按钮）",
              "指标卡片区（5个卡片横向排列，支持点击下钻）",
              "趋势图区域（折线图/柱状图，指标切换下拉、粒度切换）",
              "导出操作区（“导出Excel”“导出PDF”按钮及范围选择）"
            ],
            "states": [
              "正常态：展示完整数据，图表和卡片正常渲染",
              "空态：无数据时展示“暂无统计数据”提示，卡片显示“暂无数据”，图表展示空白状态",
              "加载态：数据加载中展示骨架屏或加载动画",
              "异常态：网络错误或接口异常时展示错误提示与重试按钮"
            ],
            "keyInteractions": [
              "筛选变更后指标卡片、趋势图、导出选项联动刷新",
              "点击指标卡片跳转到明细数据详情页（携带当前筛选条件）",
              "趋势图数据点点击下钻至当日明细数据详情页",
              "导出按钮触发异步导出任务，显示进度并下载"
            ],
            "dataInputs": [
              "筛选条件：时间范围、车辆类型列表、作业区域列表",
              "指标数据：车辆利用率、任务完成率、平均等待时长、空驶率、排队车辆数",
              "趋势数据：各指标按日/周/月维度的数值数组",
              "导出任务ID、文件下载链接"
            ]
          },
          {
            "key": "page-2",
            "priority": "P1",
            "type": "列表页",
            "name": "明细数据详情页",
            "vueFile": "ReportDetailView.vue",
            "goal": "展示从概览工作台下钻的明细数据，包括外协车辆费用明细、异常入场记录、排班排队分析等，支持进一步搜索、排序、分页以及当前明细的导出。",
            "features": [
              "明细数据下钻与详情查看"
            ],
            "sections": [
              "页面顶部面包屑导航及返回概览按钮",
              "当前筛选条件标签（显示继承自概览页的筛选条件，可微调）",
              "明细类型标签页（外协费用明细/异常入场记录/排班排队分析）",
              "表格区（含搜索框、排序箭头、分页控制器）",
              "导出当前明细按钮"
            ],
            "states": [
              "正常态：表格数据正常展示",
              "空态：无对应明细数据时展示“暂无记录”",
              "加载态：表格行骨架屏或加载提示",
              "异常态：数据加载失败显示重试按钮"
            ],
            "keyInteractions": [
              "切换明细类型标签页，表格内容刷新",
              "搜索框输入关键字实时过滤表格（或按回车搜索）",
              "点击列头排序，切换升序/降序",
              "分页切换浏览数据",
              "导出按钮导出当前表格数据为CSV/Excel"
            ],
            "dataInputs": [
              "继承自概览页的筛选条件（时间范围、车辆类型、作业区域）",
              "明细类型参数（外协费用/异常入场/排班排队）",
              "搜索关键字、排序字段与顺序、分页参数"
            ]
          }
        ],
        "navigation": [
          {
            "label": "运营报表概览",
            "target": "ManagementReportsView.vue",
            "default": true
          }
        ],
        "fileStructure": {
          "views": [
            "ManagementReportsView.vue",
            "ReportDetailView.vue"
          ],
          "components": [
            "FilterPanel.vue",
            "IndicatorCard.vue",
            "TrendChart.vue",
            "DataTable.vue",
            "ExportButton.vue",
            "StatusTag.vue",
            "Breadcrumb.vue"
          ],
          "data": [
            "reportMockData.js"
          ]
        }
      },
      "sc-6": {
        "pages": [
          {
            "key": "page-1",
            "priority": "P0",
            "type": "工作台页",
            "name": "外协/临时车辆预约审批工作台",
            "vueFile": "WorkspaceView.vue",
            "goal": "集中处理外协/临时车辆预约申请，支持待办列表浏览、快速筛选、查看详情和审批操作（通过/驳回），以及审批通过后授权码同步状态监控。",
            "features": [
              "预约申请待办列表",
              "预约审批详情与操作面板"
            ],
            "sections": [
              "顶部筛选与排序栏（车辆类型、作业区域、申请日期、紧急度排序）",
              "左侧待办申请列表区（状态标签、超时标识、关键字段摘要）",
              "右侧详情与操作区（表单详情、车辆档案校验结果、通过/驳回按钮、审批意见输入框、授权码生成与同步状态反馈）",
              "底部操作日志快照（审批记录）"
            ],
            "states": [
              "正常态：有待审批申请，列表和详情正常展示",
              "空态：无待审批申请，列表显示『暂无待审批预约』，详情区域隐藏或提示选择申请",
              "加载态：列表加载中（骨架屏），详情加载中（loading指示）",
              "异常态：接口请求失败（网络错误提示，重试按钮），车辆档案校验接口失败时显示局部错误",
              "超时提示态：列表中有超时待处理申请时显示黄色角标和提示"
            ],
            "keyInteractions": [
              "点击列表项切换详情面板，详情面板自动加载车辆档案校验结果",
              "筛选条件改变时重新请求列表，支持模糊搜索车牌",
              "点击「通过」按钮后弹出二次确认（若车辆证照过期则强制确认），确认后调用审批接口，成功后显示授权码并触发门禁同步",
              "点击「驳回」按钮弹出原因输入框（必填），提交后列表刷新",
              "审批成功后，详情面板显示授权码（QR码图片）和同步状态，提供「重新同步」按钮"
            ],
            "dataInputs": [
              "预约申请列表（GET /api/reservations?status=pending&vehicleType=&area=&date=&sort=）",
              "预约申请详情（GET /api/reservations/{id}）",
              "车辆档案校验结果（GET /api/vehicles/{id}/status）",
              "审批通过接口（POST /api/reservations/{id}/approve?reason=）",
              "审批驳回接口（POST /api/reservations/{id}/reject?reason=）",
              "授权码同步状态（GET /api/access-codes/{reservationId}/sync-status）",
              "手动重新同步（POST /api/access-codes/{id}/resync）"
            ]
          },
          {
            "key": "page-2",
            "priority": "P1",
            "type": "列表页",
            "name": "授权码管理与同步监控",
            "vueFile": "AccessCodeView.vue",
            "goal": "查看所有已生成授权码的列表及状态，监控门禁同步情况，处理同步失败记录，并查看授权码使用详情。",
            "features": [
              "授权码管理与同步监控"
            ],
            "sections": [
              "顶部状态筛选栏（全部|同步成功|同步失败|待同步|已过期|已使用）",
              "授权码列表区（车牌号、授权码、有效期、同步状态、使用时间、门岗信息）",
              "单条记录展开详情（同步日志、重试按钮）"
            ],
            "states": [
              "正常态：列表数据正常展示，状态标签颜色区分",
              "空态：暂无授权码数据时显示提示",
              "加载态：列表骨架屏加载",
              "异常态：接口失败提示重试",
              "异常项标识态：同步失败项红色高亮，待同步项橙色"
            ],
            "keyInteractions": [
              "点击状态筛选标签切换列表",
              "点击单条记录的行或展开按钮查看详细同步信息（失败原因）",
              "点击「重新同步」按钮对失败项重新推送至门禁，按钮显示加载反馈",
              "支持按车牌号搜索"
            ],
            "dataInputs": [
              "授权码列表（GET /api/access-codes?status=&keyword=&page=&size=）",
              "授权码详情同步日志（GET /api/access-codes/{id}）",
              "重新同步接口（POST /api/access-codes/{id}/resync）"
            ]
          },
          {
            "key": "page-3",
            "priority": "P2",
            "type": "列表页",
            "name": "历史预约记录查询",
            "vueFile": "HistoryView.vue",
            "goal": "提供外协/临时车辆预约历史记录的多维度查询、详情追溯和导出，支持费用统计对账。",
            "features": [
              "历史预约记录查询"
            ],
            "sections": [
              "顶部多条件筛选栏（时间范围、车辆、所属单位、作业区域、审批状态）",
              "历史记录列表区（倒序展示，显示审批状态、授权码、入场/出场时间、费用）",
              "单条记录展开详情或弹窗（完整操作日志、费用明细）",
              "导出按钮及导出进度提示"
            ],
            "states": [
              "正常态：有历史数据，列表展示",
              "空态：按条件无数据时显示『暂无记录』，并提示修改筛选条件",
              "加载态：列表加载中",
              "异常态：接口失败提示重试",
              "导出状态态：导出中显示进度条，完成后提供下载链接"
            ],
            "keyInteractions": [
              "筛选条件变更后自动请求新数据",
              "点击列表项查看详情弹窗，展示操作日志时间线",
              "点击「导出Excel」按钮，确认后开始生成，完成后自动下载",
              "支持分页浏览"
            ],
            "dataInputs": [
              "历史预约列表（GET /api/reservations/history?startTime=&endTime=&vehicleId=&unit=&area=&status=&page=&size=）",
              "单条详情含操作日志（GET /api/reservations/{id}/detail）",
              "导出接口（GET /api/reservations/history/export?parameters...）"
            ]
          }
        ],
        "navigation": [
          {
            "label": "预约审批工作台",
            "target": "WorkspaceView.vue",
            "default": true
          },
          {
            "label": "授权码管理",
            "target": "AccessCodeView.vue",
            "default": false
          },
          {
            "label": "历史记录",
            "target": "HistoryView.vue",
            "default": false
          }
        ],
        "fileStructure": {
          "views": [
            "WorkspaceView.vue",
            "AccessCodeView.vue",
            "HistoryView.vue"
          ],
          "components": [
            "StatusTag.vue",
            "DataTable.vue",
            "DetailPanel.vue",
            "FilterBar.vue",
            "QrCodeDisplay.vue",
            "ExportButton.vue"
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
            "type": "列表页",
            "name": "车辆台账列表工作台",
            "vueFile": "VehicleArchiveList.vue",
            "goal": "管理员查看全厂车辆档案列表，执行筛选、搜索、停用/启用操作，并接收到期提醒。",
            "features": [
              "车辆列表与高级筛选",
              "年检/保险/准入有效期设置与到期提醒",
              "车辆停用/启用管理与状态同步"
            ],
            "sections": [
              "顶部操作栏：新增车辆按钮、导出按钮、批量停用/启用（可选）",
              "筛选区：车辆类型、所属单位、车辆状态、有效期状态下拉框；车牌号/司机姓名搜索框",
              "到期提醒横幅/面板：展示临近30天到期的车辆条目列表（车辆、到期类型、剩余天数），可点击跳转编辑页",
              "车辆列表主体：展示车牌号、车辆类型、所属单位、司机、有效期状态、车辆状态；每行包含『编辑』、『停用/启用』按钮",
              "分页控件"
            ],
            "states": [
              "正常态：列表数据正常加载，有筛选和翻页",
              "空态：无车辆档案时展示『暂无车辆，请点击新增』并引导操作",
              "加载态：骨架屏或loading指示器",
              "异常态：网络错误时展示错误提示与重试按钮"
            ],
            "keyInteractions": [
              "筛选条件变化时立即刷新列表（防抖300ms）",
              "搜索框支持回车触发搜索",
              "点击到期提醒条目跳转到该车辆编辑页，并自动定位至有效期设置区域",
              "点击行内『停用』按钮弹出确认弹窗，填写停用原因后提交；『启用』按钮无需原因直接确认",
              "停用/启用操作完成后刷新列表，并更新到期提醒区域（若车辆状态变更影响提醒）"
            ],
            "dataInputs": [
              "车辆类型字典（生产车辆/物流车辆/外协车辆/临时车辆）",
              "所属单位列表",
              "车辆状态枚举（正常/停用）",
              "有效期状态计算逻辑（临近30天/已过期/正常）",
              "停用原因（必填，字符串）",
              "到期提醒列表数据（车辆ID、到期类型、到期日期、剩余天数）"
            ]
          },
          {
            "key": "page-2",
            "priority": "P1",
            "type": "详情页",
            "name": "车辆档案编辑页",
            "vueFile": "VehicleArchiveEdit.vue",
            "goal": "管理员新增或编辑车辆的全部基础档案信息，包括证照图片上传及有效期设置。",
            "features": [
              "车辆新增/编辑表单与数据校验",
              "证照图片上传与管理组件",
              "年检/保险/准入有效期设置与到期提醒"
            ],
            "sections": [
              "页面标题：『新增车辆』或『编辑车辆 - 车牌号』",
              "基本信息区：车辆类型（下拉）、车牌号（文本输入）、所属单位（下拉）、司机姓名、司机电话",
              "有效期设置区：年检有效期、保险有效期、准入有效期三个日期选择器（可单独清除）",
              "证照图片管理区：列表展示已有证照（类型、缩略图）；操作按钮『上传』、『预览』、『替换』、『删除』；支持拖拽排序（可选）",
              "操作按钮区：『保存』、『取消』；保存时触发完整校验",
              "操作日志摘要区（只读）：显示该车辆最近操作日志的简要列表（可选，不超过4条），点击可跳转到操作日志页"
            ],
            "states": [
              "正常态：表单可编辑，数据已预填充（编辑模式）",
              "空态：新增模式下所有字段为空",
              "加载态：页面加载车辆详情数据时显示loading",
              "异常态：保存失败时展示错误信息并保留用户输入"
            ],
            "keyInteractions": [
              "车牌号输入时实时校验（格式、唯一性），输入框后显示校验图标",
              "日期选择器选择日期后自动校验不能早于当天",
              "证照上传：点击上传后弹出文件选择器，上传后显示缩略图并自动关联证照类型（用户需选择证照类型）",
              "替换证照：点击替换，上传新文件后旧图标记为历史（或覆盖，需在界面提示），并记录日志",
              "删除证照：点击删除后弹出确认弹窗，确认后删除并记录日志",
              "保存按钮：执行前端必填校验（车牌号、车辆类型、所属单位）及日期逻辑校验；校验通过后显示提交loading；成功后跳转回列表页并刷新",
              "取消按钮：若有未保存修改，弹出『放弃修改』确认框"
            ],
            "dataInputs": [
              "车辆ID（编辑时传参）",
              "车辆类型枚举列表",
              "所属单位下拉列表",
              "车牌号唯一性校验接口（前端可调用）",
              "日期字段格式（YYYY-MM-DD）",
              "证照类型枚举（行驶证、营运证、其他）",
              "证照图片最大大小（10MB）",
              "证照图片允许格式（jpg/png）",
              "每车最大证照数量（建议10张）"
            ]
          },
          {
            "key": "page-3",
            "priority": "P2",
            "type": "列表页",
            "name": "操作日志查询页",
            "vueFile": "VehicleArchiveLogs.vue",
            "goal": "管理员查询和导出所有车辆档案的关键操作日志，用于审计追溯。",
            "features": [
              "操作日志查询与导出"
            ],
            "sections": [
              "筛选区：时间范围（日期选择器）、操作人（下拉或输入）、操作类型（多选下拉）、关联车辆（车牌号输入/选择）",
              "日志列表：展示时间、操作人、操作类型、关联车辆、修改内容摘要",
              "导出按钮：点击后导出当前筛选条件下的日志为Excel文件",
              "分页控件"
            ],
            "states": [
              "正常态：列表数据正常加载",
              "空态：无匹配日志时展示『暂无操作记录』",
              "加载态：查询或导出时显示loading",
              "异常态：查询失败或导出失败时展示错误提示"
            ],
            "keyInteractions": [
              "筛选条件联动：选择时间范围或操作类型后自动刷新列表（防抖300ms）",
              "关联车辆支持使用车牌号搜索并支持多选（可从现有车辆列表选择）",
              "导出按钮：点击后生成下载请求，若数据量过大（如>10万条）则提示用户缩小范围",
              "点击日志行可展开查看详细的修改内容（before/after JSON）"
            ],
            "dataInputs": [
              "操作类型枚举（新增/编辑/停用/启用/上传证照/删除证照）",
              "操作人列表（从用户表获取）",
              "关联车辆列表（从车辆表获取）",
              "时间范围（开始日期、结束日期）",
              "导出最大条数限制（默认10万条，可在后端配置）"
            ]
          }
        ],
        "navigation": [
          {
            "label": "车辆台账管理",
            "target": "VehicleArchiveList.vue",
            "default": true
          },
          {
            "label": "操作日志",
            "target": "VehicleArchiveLogs.vue",
            "default": false
          }
        ],
        "fileStructure": {
          "views": [
            "VehicleArchiveList.vue",
            "VehicleArchiveEdit.vue",
            "VehicleArchiveLogs.vue"
          ],
          "components": [
            "StatusTag.vue",
            "DataTable.vue",
            "DatePicker.vue",
            "ImageUploader.vue",
            "ConfirmDialog.vue",
            "ExpiringBanner.vue",
            "LogDetailPopover.vue"
          ],
          "data": [
            "scenarioMockData.js",
            "expiringNotifications.js",
            "logMocks.js"
          ]
        }
      }
    },
    "requirementInputSnapshot": {
      "projectName": "车辆管理",
      "customerName": "HG",
      "projectStage": "原型设计",
      "sourceRequirement": "我们希望建设一套海工基地车辆管理系统，用于统一管理厂区内生产车辆、物流车辆、外协车辆和临时入场车辆。当前车辆调度主要依靠电话、微信群和人工登记，车辆位置、任务状态、使用效率无法实时掌握，现场经常出现车辆排队等待、重复派车、空驶率高、司机找不到作业点、门岗放行信息不一致等问题。\n系统需要支持车辆基础档案管理，包括车辆类型、车牌号、所属单位、司机信息、车辆证照、年检状态、保险状态、准入有效期等信息。对于外协车辆和临时车辆，需要支持预约登记、审批、入场授权、出场核验和历史记录追溯。\n在生产作业方面，系统需要支持用车申请、调度派车、任务下发、司机接单、到达确认、装卸完成、任务关闭等流程。调度人员希望能够在一张地图或看板上看到车辆当前位置、任务状态、空闲车辆、排队车辆和异常车辆，并根据作业区域、车辆类型、任务优先级、距离远近等因素进行合理派车。\n系统还需要与门禁系统、生产计划系统、物资管理系统进行集成。门岗可以根据车辆预约和派车任务自动核验是否允许入场；生产计划系统可以推送吊装、转运、配送等用车需求；物资系统可以提供物料提货、配送、签收等信息，实现车辆任务与物资流转过程的关联。\n管理人员希望系统能够提供车辆利用率、任务完成率、平均等待时长、空驶率、车辆排队情况、外协车辆使用次数、异常入场记录等统计分析报表，用于优化车辆资源配置和外协车辆费用管理。\n系统需要支持移动端使用，司机可以在手机上查看任务、导航到作业点、上传现场照片、确认到达和完成任务。现场调度员可以通过移动端临时调整任务、查看车辆状态、处理异常情况。\n系统还需要具备安全管理能力，包括车辆超速提醒、禁入区域告警、证照过期提醒、异常停留提醒、未授权入场告警等。所有关键操作需要留痕，便于后续审计和责任追溯。\n希望通过该系统提升海工基地车辆调度效率，减少人工沟通成本，降低车辆等待和空驶时间，实现车辆、司机、任务、物资、门禁的一体化管理。",
      "manualRequirement": "我们希望建设一套海工基地车辆管理系统，用于统一管理厂区内生产车辆、物流车辆、外协车辆和临时入场车辆。当前车辆调度主要依靠电话、微信群和人工登记，车辆位置、任务状态、使用效率无法实时掌握，现场经常出现车辆排队等待、重复派车、空驶率高、司机找不到作业点、门岗放行信息不一致等问题。\n系统需要支持车辆基础档案管理，包括车辆类型、车牌号、所属单位、司机信息、车辆证照、年检状态、保险状态、准入有效期等信息。对于外协车辆和临时车辆，需要支持预约登记、审批、入场授权、出场核验和历史记录追溯。\n在生产作业方面，系统需要支持用车申请、调度派车、任务下发、司机接单、到达确认、装卸完成、任务关闭等流程。调度人员希望能够在一张地图或看板上看到车辆当前位置、任务状态、空闲车辆、排队车辆和异常车辆，并根据作业区域、车辆类型、任务优先级、距离远近等因素进行合理派车。\n系统还需要与门禁系统、生产计划系统、物资管理系统进行集成。门岗可以根据车辆预约和派车任务自动核验是否允许入场；生产计划系统可以推送吊装、转运、配送等用车需求；物资系统可以提供物料提货、配送、签收等信息，实现车辆任务与物资流转过程的关联。\n管理人员希望系统能够提供车辆利用率、任务完成率、平均等待时长、空驶率、车辆排队情况、外协车辆使用次数、异常入场记录等统计分析报表，用于优化车辆资源配置和外协车辆费用管理。\n系统需要支持移动端使用，司机可以在手机上查看任务、导航到作业点、上传现场照片、确认到达和完成任务。现场调度员可以通过移动端临时调整任务、查看车辆状态、处理异常情况。\n系统还需要具备安全管理能力，包括车辆超速提醒、禁入区域告警、证照过期提醒、异常停留提醒、未授权入场告警等。所有关键操作需要留痕，便于后续审计和责任追溯。\n希望通过该系统提升海工基地车辆调度效率，减少人工沟通成本，降低车辆等待和空驶时间，实现车辆、司机、任务、物资、门禁的一体化管理。",
      "attachmentText": "",
      "attachments": [],
      "analysis": {
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
        "userRoles": [
          {
            "name": "调度员",
            "responsibility": "在地图/看板上实时查看车辆状态，进行用车申请、派车、任务调整，处理异常"
          },
          {
            "name": "司机",
            "responsibility": "使用移动端查看任务、导航到作业点、确认到达/完成、上传照片"
          },
          {
            "name": "现场调度员（移动端）",
            "responsibility": "通过移动端临时调整任务、查看车辆状态、处理异常情况"
          },
          {
            "name": "门岗人员",
            "responsibility": "根据预约和派车任务核验车辆入场、执行出场核验"
          },
          {
            "name": "管理人员",
            "responsibility": "查看车辆利用率、任务完成率、外协车辆使用次数等统计分析报表，优化资源配置"
          },
          {
            "name": "外协/临时车辆申请者",
            "responsibility": "在线预约登记、提交审批、查看入场授权及历史记录"
          }
        ],
        "questions": [
          "现有的门禁系统、生产计划系统、物资管理系统的接口方式和技术实现方案是什么？",
          "移动端是否需要支持离线模式或弱网环境？",
          "车辆超速、禁入区域、异常停留等告警的判定阈值和范围如何定义？",
          "外协车辆的费用管理是否需要与财务系统对接？",
          "系统是否需要支持多基地或跨厂区管理？"
        ],
        "attachments": [],
        "generationSource": "deepseek",
        "sourceText": "我们希望建设一套海工基地车辆管理系统，用于统一管理厂区内生产车辆、物流车辆、外协车辆和临时入场车辆。当前车辆调度主要依靠电话、微信群和人工登记，车辆位置、任务状态、使用效率无法实时掌握，现场经常出现车辆排队等待、重复派车、空驶率高、司机找不到作业点、门岗放行信息不一致等问题。\n系统需要支持车辆基础档案管理，包括车辆类型、车牌号、所属单位、司机信息、车辆证照、年检状态、保险状态、准入有效期等信息。对于外协车辆和临时车辆，需要支持预约登记、审批、入场授权、出场核验和历史记录追溯。\n在生产作业方面，系统需要支持用车申请、调度派车、任务下发、司机接单、到达确认、装卸完成、任务关闭等流程。调度人员希望能够在一张地图或看板上看到车辆当前位置、任务状态、空闲车辆、排队车辆和异常车辆，并根据作业区域、车辆类型、任务优先级、距离远近等因素进行合理派车。\n系统还需要与门禁系统、生产计划系统、物资管理系统进行集成。门岗可以根据车辆预约和派车任务自动核验是否允许入场；生产计划系统可以推送吊装、转运、配送等用车需求；物资系统可以提供物料提货、配送、签收等信息，实现车辆任务与物资流转过程的关联。\n管理人员希望系统能够提供车辆利用率、任务完成率、平均等待时长、空驶率、车辆排队情况、外协车辆使用次数、异常入场记录等统计分析报表，用于优化车辆资源配置和外协车辆费用管理。\n系统需要支持移动端使用，司机可以在手机上查看任务、导航到作业点、上传现场照片、确认到达和完成任务。现场调度员可以通过移动端临时调整任务、查看车辆状态、处理异常情况。\n系统还需要具备安全管理能力，包括车辆超速提醒、禁入区域告警、证照过期提醒、异常停留提醒、未授权入场告警等。所有关键操作需要留痕，便于后续审计和责任追溯。\n希望通过该系统提升海工基地车辆调度效率，减少人工沟通成本，降低车辆等待和空驶时间，实现车辆、司机、任务、物资、门禁的一体化管理。",
        "manualRequirement": "我们希望建设一套海工基地车辆管理系统，用于统一管理厂区内生产车辆、物流车辆、外协车辆和临时入场车辆。当前车辆调度主要依靠电话、微信群和人工登记，车辆位置、任务状态、使用效率无法实时掌握，现场经常出现车辆排队等待、重复派车、空驶率高、司机找不到作业点、门岗放行信息不一致等问题。\n系统需要支持车辆基础档案管理，包括车辆类型、车牌号、所属单位、司机信息、车辆证照、年检状态、保险状态、准入有效期等信息。对于外协车辆和临时车辆，需要支持预约登记、审批、入场授权、出场核验和历史记录追溯。\n在生产作业方面，系统需要支持用车申请、调度派车、任务下发、司机接单、到达确认、装卸完成、任务关闭等流程。调度人员希望能够在一张地图或看板上看到车辆当前位置、任务状态、空闲车辆、排队车辆和异常车辆，并根据作业区域、车辆类型、任务优先级、距离远近等因素进行合理派车。\n系统还需要与门禁系统、生产计划系统、物资管理系统进行集成。门岗可以根据车辆预约和派车任务自动核验是否允许入场；生产计划系统可以推送吊装、转运、配送等用车需求；物资系统可以提供物料提货、配送、签收等信息，实现车辆任务与物资流转过程的关联。\n管理人员希望系统能够提供车辆利用率、任务完成率、平均等待时长、空驶率、车辆排队情况、外协车辆使用次数、异常入场记录等统计分析报表，用于优化车辆资源配置和外协车辆费用管理。\n系统需要支持移动端使用，司机可以在手机上查看任务、导航到作业点、上传现场照片、确认到达和完成任务。现场调度员可以通过移动端临时调整任务、查看车辆状态、处理异常情况。\n系统还需要具备安全管理能力，包括车辆超速提醒、禁入区域告警、证照过期提醒、异常停留提醒、未授权入场告警等。所有关键操作需要留痕，便于后续审计和责任追溯。\n希望通过该系统提升海工基地车辆调度效率，减少人工沟通成本，降低车辆等待和空驶时间，实现车辆、司机、任务、物资、门禁的一体化管理。",
        "attachmentText": "",
        "questionResponses": [
          {
            "question": "现有的门禁系统、生产计划系统、物资管理系统的接口方式和技术实现方案是什么？",
            "answer": "针对问题「现有的门禁系统、生产计划系统、物资管理系统的接口方式和技术实现方案是什么？」：通过接口方式和这些系统做交互"
          },
          {
            "question": "移动端是否需要支持离线模式或弱网环境？",
            "answer": "针对问题「移动端是否需要支持离线模式或弱网环境？」：不用考虑"
          },
          {
            "question": "车辆超速、禁入区域、异常停留等告警的判定阈值和范围如何定义？",
            "answer": "针对问题「车辆超速、禁入区域、异常停留等告警的判定阈值和范围如何定义？」：30km/小时以上都算超速行驶，场地内有行车路线和进入区域的标识，异常停留通过摄像头监控采集记录，给安全管控系统提供告警。"
          },
          {
            "question": "外协车辆的费用管理是否需要与财务系统对接？",
            "answer": "针对问题「外协车辆的费用管理是否需要与财务系统对接？」：不用"
          },
          {
            "question": "系统是否需要支持多基地或跨厂区管理？",
            "answer": "针对问题「系统是否需要支持多基地或跨厂区管理？」：不需要。"
          },
          {
            "question": "其他补充",
            "answer": "车辆的台账管理功能要增加进来，由管理员负责车辆台账管理。"
          }
        ],
        "clarificationMessages": [
          {
            "id": "u-1783041133350",
            "role": "user",
            "content": "针对问题「现有的门禁系统、生产计划系统、物资管理系统的接口方式和技术实现方案是什么？」：通过接口方式和这些系统做交互",
            "question": "现有的门禁系统、生产计划系统、物资管理系统的接口方式和技术实现方案是什么？"
          },
          {
            "id": "a-1783041133350",
            "role": "assistant",
            "content": "感谢确认接口集成方式。我会基于此补充系统集成的业务拆解，用于下一步的『场景→页面』设计。"
          },
          {
            "id": "u-1783041162983",
            "role": "user",
            "content": "针对问题「移动端是否需要支持离线模式或弱网环境？」：不用考虑",
            "question": "移动端是否需要支持离线模式或弱网环境？"
          },
          {
            "id": "a-1783041162983",
            "role": "assistant",
            "content": "已确认移动端无需支持离线模式，将据此调整移动端场景设计。其他集成方式也已明确，后续可聚焦于具体接口协议确认。"
          },
          {
            "id": "u-1783041367597",
            "role": "user",
            "content": "针对问题「车辆超速、禁入区域、异常停留等告警的判定阈值和范围如何定义？」：30km/小时以上都算超速行驶，场地内有行车路线和进入区域的标识，异常停留通过摄像头监控采集记录，给安全管控系统提供告警。",
            "question": "车辆超速、禁入区域、异常停留等告警的判定阈值和范围如何定义？"
          },
          {
            "id": "a-1783041367597",
            "role": "assistant",
            "content": "已收到超速、禁入区域和异常停留的告警阈值说明，将据此补充安全管控相关业务拆解。另外，外协费用与财务对接、多基地管理等事项尚未明确，建议后续确认。"
          },
          {
            "id": "u-1783041436346",
            "role": "user",
            "content": "针对问题「外协车辆的费用管理是否需要与财务系统对接？」：不用",
            "question": "外协车辆的费用管理是否需要与财务系统对接？"
          },
          {
            "id": "a-1783041436346",
            "role": "assistant",
            "content": "感谢您的确认。外协车辆费用管理无需对接财务系统，我们将在系统内实现费用记录与统计。同时，已确认超速告警阈值、禁入区域定义、异常停留告警来源、移动端无需离线模式。对于多基地管理需求尚未明确，建议后续确认。基于上述补充，我们已整理出对下一阶段场景与页面设计有直接影响的关键业务拆解点。"
          },
          {
            "id": "u-1783041571579",
            "role": "user",
            "content": "针对问题「系统是否需要支持多基地或跨厂区管理？」：不需要。",
            "question": "系统是否需要支持多基地或跨厂区管理？"
          },
          {
            "id": "a-1783041571579",
            "role": "assistant",
            "content": "感谢您对多基地管理需求的明确确认。根据您的补充，我已更新业务拆解清单，重点确认了：门禁/生产计划/物资系统通过接口集成，移动端全程在线，超速阈值30km/h，禁入区域基于电子围栏，异常停留通过摄像头告警，外协费用无需对接财务，且系统为单基地管理。这些信息将为下一步场景到页面的设计提供直接依据。"
          },
          {
            "id": "u-1783041712961",
            "role": "user",
            "content": "车辆的台账管理功能要增加进来，由管理员负责车辆台账管理。",
            "question": "其他补充：请补充任何会影响场景识别、页面拆解、流程边界、异常规则或系统对接的信息。"
          },
          {
            "id": "a-1783041712961",
            "role": "assistant",
            "content": "已记录车辆台账管理需求，管理员将负责车辆基础档案的维护和更新。此功能将作为角色边界和基础业务场景的一部分，直接影响后续车辆基础档案页面的设计以及调度、统计等场景的数据来源。"
          }
        ],
        "clarificationInsights": [
          {
            "id": "clarity-1783041143299-0",
            "category": "系统集成",
            "title": "门禁系统集成方式确认",
            "detail": "用户确认通过接口与门禁系统交互。建议进一步确认：门禁系统是否提供HTTP/REST API或OPC UA等具体协议；接口能力是否支持实时核验入场授权、读取车辆道闸状态、反馈入场记录。目前可按『第三方门禁系统提供标准API接口供我方调用』理解。",
            "scenarioValue": "影响门岗人员『入场核验』场景：页面需提供接口调用失败时的降级处理（如手动确认），以及入场记录自动同步逻辑。"
          },
          {
            "id": "clarity-1783041143299-1",
            "category": "系统集成",
            "title": "生产计划系统集成方式确认",
            "detail": "用户确认通过接口与生产计划系统交互。建议确认：是否支持接收计划系统推送的吊装、转运等用车需求；推送频率（实时/批量）；数据字段（任务编号、作业区域、预计时间）。当前可按『生产计划系统主动推送用车需求至本系统，系统接收后生成用车申请』理解。",
            "scenarioValue": "影响『用车申请』场景：页面需展示来自生产计划系统的需求列表，调度员可直接转为派车任务，无需手动录入。"
          },
          {
            "id": "clarity-1783041143299-2",
            "category": "系统集成",
            "title": "物资管理系统集成方式确认",
            "detail": "用户确认通过接口与物资管理系统交互。建议确认：物资系统能否提供物料提货单号、配送单、签收状态等数据；接口是单向查询还是双向更新。目前可按『本系统通过接口查询物资系统的物料数据，并将任务完成后的签收信息回传』理解。",
            "scenarioValue": "影响『任务与物资关联』场景：司机在移动端查看任务时，可显示关联的物资提货信息；任务完成时自动推送签收状态至物资系统。"
          },
          {
            "id": "clarity-1783041143299-3",
            "category": "角色边界",
            "title": "门岗人员的系统操作角色",
            "detail": "根据需求草案，门岗人员需按预约和派车任务核验入场。集成门禁系统后，门岗人员应能通过系统查看接口核验结果，并处理异常（如接口超时、黑名单车辆）。建议确认门岗人员是否计划使用专用终端（如工控机）或移动设备。",
            "scenarioValue": "影响门岗人员『入场核验』页面设计：需展示待核验车辆列表、核验状态（通过/失败/需人工判断），并提供手动放行或拒绝按钮。"
          },
          {
            "id": "clarity-1783041174387-0",
            "category": "系统集成",
            "title": "门禁系统集成方式确认",
            "detail": "用户确认通过接口与门禁系统交互。建议进一步确认：门禁系统是否提供HTTP/REST API或OPC UA等具体协议；接口能力是否支持实时核验入场授权、读取车辆道闸状态、反馈入场记录。目前可按『第三方门禁系统提供标准API接口供我方调用』理解。",
            "scenarioValue": "影响门岗人员『入场核验』场景：页面需提供接口调用失败时的降级处理（如手动确认），以及入场记录自动同步逻辑。"
          },
          {
            "id": "clarity-1783041174387-1",
            "category": "系统集成",
            "title": "生产计划系统集成方式确认",
            "detail": "用户确认通过接口与生产计划系统交互。建议确认：是否支持接收计划系统推送的吊装、转运等用车需求；推送频率（实时/批量）；数据字段（任务编号、作业区域、预计时间）。当前可按『生产计划系统主动推送用车需求至本系统，系统接收后生成用车申请』理解。",
            "scenarioValue": "影响『用车申请』场景：页面需展示来自生产计划系统的需求列表，调度员可直接转为派车任务，无需手动录入。"
          },
          {
            "id": "clarity-1783041174387-2",
            "category": "系统集成",
            "title": "物资管理系统集成方式确认",
            "detail": "用户确认通过接口与物资管理系统交互。建议确认：物资系统能否提供物料提货单号、配送单、签收状态等数据；接口是单向查询还是双向更新。目前可按『本系统通过接口查询物资系统的物料数据，并将任务完成后的签收信息回传』理解。",
            "scenarioValue": "影响『任务与物资关联』场景：司机在移动端查看任务时，可显示关联的物资提货信息；任务完成时自动推送签收状态至物资系统。"
          },
          {
            "id": "clarity-1783041174387-3",
            "category": "角色边界",
            "title": "门岗人员的系统操作角色",
            "detail": "根据需求草案，门岗人员需按预约和派车任务核验入场。集成门禁系统后，门岗人员应能通过系统查看接口核验结果，并处理异常（如接口超时、黑名单车辆）。建议确认门岗人员是否计划使用专用终端（如工控机）或移动设备。",
            "scenarioValue": "影响门岗人员『入场核验』页面设计：需展示待核验车辆列表、核验状态（通过/失败/需人工判断），并提供手动放行或拒绝按钮。"
          },
          {
            "id": "clarity-1783041174387-4",
            "category": "移动端约束",
            "title": "移动端无需支持离线/弱网模式",
            "detail": "用户明确表示移动端不需要考虑离线模式或弱网环境。当前可按移动端全程在线、依赖稳定网络理解。",
            "scenarioValue": "影响移动端场景设计：司机和现场调度员的页面无需设计离线缓存、断点续传等能力，所有操作实时提交；但需注意网络异常时的用户提示和重试机制。"
          },
          {
            "id": "clarity-1783041386840-0",
            "category": "异常规则",
            "title": "车辆超速告警阈值：30km/h",
            "detail": "用户明确：车辆速度超过30km/h即判定为超速行驶。系统需根据此阈值实时计算车辆速度（可能通过GPS或车载设备），当速度超过30km/h时触发超速告警。",
            "scenarioValue": "影响调度员看板中的异常车辆标识及告警通知页面；需在车辆实时位置显示速度信息，超速时高亮或弹窗告警。"
          },
          {
            "id": "clarity-1783041386840-1",
            "category": "异常规则",
            "title": "禁入区域告警：基于场地标识和行车路线",
            "detail": "用户明确：场地内有行车路线和进入区域的标识。系统需定义禁入区域（电子围栏），当车辆进入非授权区域时触发告警。可按车辆类型与区域权限关联理解。",
            "scenarioValue": "影响电子地图上的区域配置、车辆轨迹监测及告警功能；需支持区域绘制、车辆进入检测及告警推送。"
          },
          {
            "id": "clarity-1783041386840-2",
            "category": "异常规则",
            "title": "异常停留告警：基于摄像头监控采集记录",
            "detail": "用户明确：异常停留通过摄像头监控采集记录，提供给安全管控系统告警。说明异常停留的检测由外部摄像头系统负责，本系统可接收其告警事件或直接通过摄像头数据判断。建议确认：本系统是否直接接入摄像头数据，还是接收安全管控系统的告警推送。当前可按本系统通过接口接收摄像头或安全系统推送的异常停留告警事件理解。",
            "scenarioValue": "影响异常事件列表页面：需展示异常停留告警，包括时间、位置、车辆信息；并与车辆任务关联，判断是否属于正常停留（如装卸等待）。"
          },
          {
            "id": "clarity-1783041386840-3",
            "category": "指标口径",
            "title": "外协车辆费用管理需明确是否对接财务系统",
            "detail": "用户未回答此问题。建议进一步确认：外协车辆费用（如按次计费、按小时计费）是否需要与财务系统对接生成结算单据？当前可按系统需提供费用记录和统计报表，暂不涉及财务系统对接理解；但后续可能需调整。",
            "scenarioValue": "影响外协车辆费用管理页面：需设计费用录入、统计和导出功能；如果对接财务系统，则需增加财务凭证接口。"
          },
          {
            "id": "clarity-1783041386840-4",
            "category": "角色边界",
            "title": "多基地/跨厂区管理需求待确认",
            "detail": "用户未回答此问题。建议进一步确认：HG海工基地是否涉及多个厂区或基地？当前可按单基地管理理解，但页面设计应留有多基地扩展的余地（如组织树切换）。",
            "scenarioValue": "影响组织架构和权限设计：如果是多基地，需支持基地/厂区维度的数据隔离和切换。"
          },
          {
            "id": "clarity-1783041455656-0",
            "category": "系统集成",
            "title": "门禁系统集成方式确认",
            "detail": "用户确认通过接口与门禁系统交互。接口具体协议（如HTTP/REST、OPC UA）待进一步确认。可按『第三方门禁系统提供标准API接口供我方调用』理解。",
            "scenarioValue": "影响门岗入场核验页面设计：需展示接口调用结果、降级处理（手动确认）及入场记录同步逻辑。"
          },
          {
            "id": "clarity-1783041455656-1",
            "category": "系统集成",
            "title": "生产计划系统集成方式确认",
            "detail": "用户确认通过接口与生产计划系统交互。推送频率、数据字段待确认。可按『生产计划系统主动推送用车需求至本系统，系统接收后生成用车申请』理解。",
            "scenarioValue": "影响用车申请场景：页面需展示来自生产计划系统的需求列表，调度员可直接转为派车任务。"
          },
          {
            "id": "clarity-1783041455656-2",
            "category": "系统集成",
            "title": "物资管理系统集成方式确认",
            "detail": "用户确认通过接口与物资管理系统交互。接口是单向查询还是双向更新待确认。可按『本系统通过接口查询物资系统物料数据，任务完成时回传签收状态』理解。",
            "scenarioValue": "影响任务与物资关联场景：司机移动端显示提货信息，任务完成时自动推送签收状态。"
          },
          {
            "id": "clarity-1783041455656-3",
            "category": "移动端约束",
            "title": "移动端无需支持离线/弱网模式",
            "detail": "用户明确移动端不需要考虑离线模式或弱网环境。可按全程在线、依赖稳定网络理解。",
            "scenarioValue": "影响移动端场景设计：所有操作实时提交，无需设计离线缓存或断点续传，但需网络异常提示和重试机制。"
          },
          {
            "id": "clarity-1783041455656-4",
            "category": "异常规则",
            "title": "车辆超速告警阈值：30km/h",
            "detail": "用户明确速度超过30km/h即超速。系统需实时计算车辆速度（可能通过GPS或车载设备），超速时触发告警。",
            "scenarioValue": "影响调度看板异常车辆标识及告警通知页面：需显示速度信息，超速时高亮或弹窗。"
          },
          {
            "id": "clarity-1783041455656-5",
            "category": "异常规则",
            "title": "禁入区域告警：基于场地标识和行车路线",
            "detail": "用户明确场地内有行车路线和区域标识。系统需定义禁入区域（电子围栏），当车辆进入非授权区域时触发告警。可按车辆类型与区域权限关联理解。",
            "scenarioValue": "影响电子地图区域配置、车辆轨迹监测及告警功能：需支持区域绘制、进入检测及告警推送。"
          },
          {
            "id": "clarity-1783041455656-6",
            "category": "异常规则",
            "title": "异常停留告警：基于摄像头监控采集记录",
            "detail": "用户明确异常停留通过摄像头监控采集记录，提供给安全管控系统告警。本系统可接收其告警事件或直接通过摄像头数据判断。建议确认本系统是否直接接入摄像头数据还是接收安全系统推送。当前可按本系统通过接口接收摄像头或安全系统推送的异常停留告警事件理解。",
            "scenarioValue": "影响异常事件列表页面：需展示异常停留告警（时间、位置、车辆信息），并与车辆任务关联判断是否为正常停留。"
          },
          {
            "id": "clarity-1783041455656-7",
            "category": "指标口径",
            "title": "外协车辆费用管理无需对接财务系统",
            "detail": "用户明确外协车辆费用管理不需要与财务系统对接。可按系统提供费用记录、统计报表和导出功能理解。",
            "scenarioValue": "影响外协车辆费用管理页面：需设计费用录入、按次/按时计费统计和导出功能，无需设计财务凭证接口。"
          },
          {
            "id": "clarity-1783041455656-8",
            "category": "角色边界",
            "title": "门岗人员的系统操作角色",
            "detail": "根据需求草案，门岗人员需按预约和派车任务核验入场。集成门禁后，门岗应能查看接口核验结果并处理异常。建议确认门岗是否使用专用终端（如工控机）或移动设备。当前可按门岗使用固定终端理解。",
            "scenarioValue": "影响门岗入场核验页面设计：需展示待核验车辆列表、核验状态（通过/失败/需人工判断），并提供手动放行/拒绝按钮。"
          },
          {
            "id": "clarity-1783041455656-9",
            "category": "角色边界",
            "title": "多基地/跨厂区管理需求待确认",
            "detail": "用户未回答此问题。建议后续确认HG海工基地是否涉及多个厂区。当前可按单基地管理理解，但页面设计应留有多基地扩展余地（如组织树切换）。",
            "scenarioValue": "影响组织架构和权限设计：若为多基地需支持基地维度数据隔离和切换，当前设计可预留扩展点。"
          },
          {
            "id": "clarity-1783041592764-0",
            "category": "系统集成",
            "title": "门禁系统集成方式确认",
            "detail": "用户确认通过接口与门禁系统交互。接口具体协议（如HTTP/REST、OPC UA）待进一步确认。可按『第三方门禁系统提供标准API接口供我方调用』理解。",
            "scenarioValue": "影响门岗入场核验页面设计：需展示接口调用结果、降级处理（手动确认）及入场记录同步逻辑。"
          },
          {
            "id": "clarity-1783041592764-1",
            "category": "系统集成",
            "title": "生产计划系统集成方式确认",
            "detail": "用户确认通过接口与生产计划系统交互。推送频率、数据字段待确认。可按『生产计划系统主动推送用车需求至本系统，系统接收后生成用车申请』理解。",
            "scenarioValue": "影响用车申请场景：页面需展示来自生产计划系统的需求列表，调度员可直接转为派车任务。"
          },
          {
            "id": "clarity-1783041592764-2",
            "category": "系统集成",
            "title": "物资管理系统集成方式确认",
            "detail": "用户确认通过接口与物资管理系统交互。接口是单向查询还是双向更新待确认。可按『本系统通过接口查询物资系统物料数据，任务完成时回传签收状态』理解。",
            "scenarioValue": "影响任务与物资关联场景：司机移动端显示提货信息，任务完成时自动推送签收状态。"
          },
          {
            "id": "clarity-1783041592764-3",
            "category": "移动端约束",
            "title": "移动端无需支持离线/弱网模式",
            "detail": "用户明确移动端不需要考虑离线模式或弱网环境。可按全程在线、依赖稳定网络理解。",
            "scenarioValue": "影响移动端场景设计：所有操作实时提交，无需设计离线缓存或断点续传，但需网络异常提示和重试机制。"
          },
          {
            "id": "clarity-1783041592764-4",
            "category": "异常规则",
            "title": "车辆超速告警阈值30km/h",
            "detail": "用户明确速度超过30km/h即超速。系统需实时计算车辆速度（可能通过GPS或车载设备），超速时触发告警。",
            "scenarioValue": "影响调度看板异常车辆标识及告警通知页面：需显示速度信息，超速时高亮或弹窗。"
          },
          {
            "id": "clarity-1783041592764-5",
            "category": "异常规则",
            "title": "禁入区域告警基于场地标识和行车路线",
            "detail": "用户明确场地内有行车路线和区域标识。系统需定义禁入区域（电子围栏），当车辆进入非授权区域时触发告警。可按车辆类型与区域权限关联理解。",
            "scenarioValue": "影响电子地图区域配置、车辆轨迹监测及告警功能：需支持区域绘制、进入检测及告警推送。"
          },
          {
            "id": "clarity-1783041592764-6",
            "category": "异常规则",
            "title": "异常停留告警基于摄像头监控采集记录",
            "detail": "用户明确异常停留通过摄像头监控采集记录，提供给安全管控系统告警。本系统可接收其告警事件或直接通过摄像头数据判断。建议确认本系统是否直接接入摄像头数据还是接收安全系统推送。当前可按本系统通过接口接收摄像头或安全系统推送的异常停留告警事件理解。",
            "scenarioValue": "影响异常事件列表页面：需展示异常停留告警（时间、位置、车辆信息），并与车辆任务关联判断是否为正常停留。"
          },
          {
            "id": "clarity-1783041592764-7",
            "category": "指标口径",
            "title": "外协车辆费用管理无需对接财务系统",
            "detail": "用户明确外协车辆费用管理不需要与财务系统对接。可按系统提供费用记录、统计报表和导出功能理解。",
            "scenarioValue": "影响外协车辆费用管理页面：需设计费用录入、按次/按时计费统计和导出功能，无需设计财务凭证接口。"
          },
          {
            "id": "clarity-1783041592764-8",
            "category": "角色边界",
            "title": "门岗人员的系统操作角色",
            "detail": "根据需求草案，门岗人员需按预约和派车任务核验入场。集成门禁后，门岗应能查看接口核验结果并处理异常。建议确认门岗是否使用专用终端（如工控机）或移动设备。当前可按门岗使用固定终端理解。",
            "scenarioValue": "影响门岗入场核验页面设计：需展示待核验车辆列表、核验状态（通过/失败/需人工判断），并提供手动放行/拒绝按钮。"
          },
          {
            "id": "clarity-1783041592764-9",
            "category": "角色边界",
            "title": "系统不支持多基地/跨厂区管理",
            "detail": "用户明确系统不需要支持多基地或跨厂区管理。当前可按单基地管理设计，无需考虑多基地数据隔离和切换。",
            "scenarioValue": "影响组织架构和权限设计：按单基地管理，无需支持多基地维度数据隔离，页面设计无需预留多基地切换入口。"
          },
          {
            "id": "clarity-1783041720608-0",
            "category": "角色边界",
            "title": "新增管理员角色及车辆台账管理职责",
            "detail": "用户明确要求增加车辆台账管理功能，由管理员负责。台账管理应包含车辆类型、车牌号、所属单位、司机信息、车辆证照、年检状态、保险状态、准入有效期等信息的增删改查和状态更新。可按管理员拥有完整的车辆档案维护权限理解。",
            "scenarioValue": "影响『车辆基础档案管理』场景：需要为管理员设计独立的台账管理页面，包括车辆录入、编辑、证照上传、年检保险到期提醒、准入有效期设置等；同时为调度员、司机提供只读的车辆信息查询入口。此功能是后续派车、统计、门禁核验等场景的基础数据支撑。"
          }
        ]
      }
    },
    "scenarioGenerationMeta": {
      "source": "llm",
      "basedOn": "prototype_factory/local_step_outputs/requirement.md",
      "generatedAt": "2026-07-03T01:31:03.483Z",
      "planningNotes": [
        "基于问题回复：门禁、生产计划、物资系统通过接口集成，具体协议（HTTP/REST等）待确认，影响场景4（门禁核验）和场景1（生产计划推送）的接口交互设计；移动端无需离线，所有操作实时提交。",
        "异常规则：车辆超速阈值30km/h，禁入区域基于电子围栏，异常停留通过摄像头告警接收（来源待确认是否为安全系统），已在场景1告警模块体现。",
        "外协车辆费用管理无需对接财务，费用统计在场景5报表中体现。",
        "系统为单基地管理，无需多基地切换。",
        "新增管理员角色负责车辆台账管理（场景7），包含证照到期提醒，是车辆档案基础数据来源。",
        "推断项：车辆实时位置获取方式（GPS/车载设备）未明确，场景1地图加载需技术确认；生产计划系统推送频率未确认，设计需支持实时或批量；门禁接口协议未确认，需预留适配层。",
        "所有关键操作（派车、核验、调整、完成等）需操作日志留痕，场景中已通过模块或描述隐含。"
      ],
      "requirementSavedAt": "",
      "requirementProjectName": "车辆管理"
    },
    "activeKey": "sc-7",
    "savedAt": "2026-07-03T13:59:13.183Z"
  },
  "selectedPage": {
    "key": "sc-1-page-1-0",
    "name": "调度员实时调度派车工作台",
    "vueFile": "DispatchWorkbenchView.vue",
    "goal": "调度员集中管理实时车辆状态、接收用车需求、执行派车操作，以地图和状态看板为核心支撑高效调度。",
    "features": [
      "车辆实时地图监控",
      "车辆状态看板",
      "用车需求管理",
      "智能派车操作面板"
    ],
    "sections": [
      "地图区域（左侧主区域）：显示车辆位置、状态、轨迹，支持缩放和点击弹窗",
      "状态看板区域（右侧顶部）：卡片式统计空闲/任务中/排队/异常车辆数量，可点击筛选",
      "需求列表区域（右侧中部）：展示待处理用车需求（含生产计划推送），支持排序和派车按钮",
      "派车操作面板（右侧底部/浮动弹窗）：选择车辆、确认派车、查看推荐车辆详情"
    ],
    "fields": [
      {
        "name": "vehicleMap",
        "label": "车辆实时地图",
        "type": "map",
        "required": true,
        "description": "显示车辆位置、状态、轨迹，支持缩放、点击弹窗、框选筛选"
      },
      {
        "name": "statusCard",
        "label": "车辆状态看板",
        "type": "cardGroup",
        "required": true,
        "description": "卡片式统计空闲/任务中/排队/异常车辆数量，可点击筛选"
      },
      {
        "name": "demandList",
        "label": "用车需求列表",
        "type": "table",
        "required": true,
        "description": "展示待处理用车需求，支持排序、筛选、查看详情和派车按钮"
      },
      {
        "name": "dispatchPanel",
        "label": "派车操作面板",
        "type": "dialog",
        "required": false,
        "description": "选择车辆、确认派车、查看推荐车辆详情，可浮动打开"
      },
      {
        "name": "vehicleInfoPopup",
        "label": "车辆信息弹窗",
        "type": "popup",
        "required": false,
        "description": "地图点击车辆弹出车牌、司机、速度、任务等信息"
      }
    ],
    "actions": [
      {
        "label": "地图点击车辆",
        "trigger": "click on vehicle marker",
        "feedback": "显示车辆信息弹窗，包含车牌、司机、速度、任务"
      },
      {
        "label": "状态看板点击分类",
        "trigger": "click on status card",
        "feedback": "跳转至对应车辆列表并在地图高亮该分类车辆"
      },
      {
        "label": "需求列表点击派车",
        "trigger": "click on dispatch button in demand row",
        "feedback": "打开派车操作面板，自动推荐可用车辆"
      },
      {
        "label": "派车面板确认派车",
        "trigger": "click on confirm button",
        "feedback": "刷新地图和看板状态，推送消息给司机"
      },
      {
        "label": "地图框选车辆",
        "trigger": "box select on map",
        "feedback": "筛选框内车辆并同步至看板和需求列表"
      },
      {
        "label": "异常状态突出显示",
        "trigger": "超速>30km/h或禁入区域触发",
        "feedback": "车辆图标闪烁并显示告警标记，地图高亮区域"
      }
    ],
    "validations": [
      "派车时需至少选择一辆可用车辆",
      "需求列表无数据时禁用派车按钮",
      "地图加载失败时显示重试按钮",
      "GPS数据中断时地图显示离线标记"
    ],
    "states": {
      "empty": "无车辆在线或无可调度车辆时，地图显示空区域提示，看板显示0，需求列表显示'暂无待处理需求'",
      "loading": "初次加载或数据刷新时，地图和列表显示骨架屏或加载动画",
      "success": "正常态：地图加载车辆位置、看板显示统计数据、需求列表有数据、派车面板就绪",
      "error": "接口超时或数据异常时，显示错误提示和重试按钮；GPS数据中断时地图显示车辆离线标记"
    },
    "generatedAt": "2026-07-03T03:41:18.126Z"
  },
  "selectedApiContract": {
    "key": "api-sc-1-page-1-0",
    "method": "POST",
    "name": "派车确认",
    "path": "/api/v1/tasks/dispatch",
    "goal": "提交派车请求，生成任务并下发通知给司机",
    "trigger": "点击派车操作面板“确认派车”按钮",
    "requestParams": [
      {
        "name": "demandId",
        "type": "string",
        "required": true,
        "description": "用车需求ID"
      },
      {
        "name": "vehicleIds",
        "type": "array[string]",
        "required": true,
        "description": "所选车辆ID列表，至少一辆"
      },
      {
        "name": "dispatchNote",
        "type": "string",
        "required": false,
        "description": "派车备注"
      }
    ],
    "successResponse": {
      "code": 200,
      "message": "成功",
      "data": {
        "taskId": "string",
        "status": "dispatched"
      },
      "traceId": "string"
    },
    "errorResponse": {
      "code": 4001,
      "message": "请求参数缺失或无效",
      "data": null,
      "traceId": "string"
    },
    "errorCodes": [
      {
        "code": 4001,
        "meaning": "请求参数缺失或无效",
        "frontendAdvice": "请选择至少一辆可用车辆并确认需求"
      },
      {
        "code": 4002,
        "meaning": "所选车辆不可用（已被派或离线）",
        "frontendAdvice": "部分车辆当前不可用，请重新选择"
      },
      {
        "code": 5001,
        "meaning": "内部错误",
        "frontendAdvice": "派车失败，请稍后重试"
      }
    ],
    "sourcePageKey": "sc-1-page-1-0"
  },
  "selectedModuleApiHints": [
    {
      "key": "mod-1",
      "name": "车辆实时地图监控",
      "description": "在地图上实时展示所有车辆的位置、速度、方向、当前任务状态（空闲/任务中/排队/异常），支持按区域、车辆类型筛选，并显示超速预警（>30km/h）和禁入区域告警触发点。",
      "features": [
        "加载并展示车辆实时位置与移动轨迹",
        "点击车辆弹窗查看详细信息（车牌、司机、速度、任务）",
        "根据车辆状态和告警类型动态更新图标颜色（正常/超速/禁入/异常停留）",
        "支持地图缩放、区域选择、电子围栏可视化"
      ],
      "pageSuggestion": "DispatchCenterView.vue",
      "apiHint": "GET /api/v1/vehicles/realtime-locations, POST /api/v1/vehicles/geofence-events",
      "dataNeeds": [
        "车辆GPS坐标、速度、方向",
        "车辆档案信息（车牌、类型、所属单位、司机联系方式）",
        "电子围栏/禁入区域坐标数据",
        "任务状态与当前任务ID"
      ],
      "stateRules": [
        "速度超过30km/h时地图上车辆图标闪烁并显示超速标记（来源：用户明确阈值30km/h）",
        "车辆进入禁入区域时触发告警，地图高亮该区域并弹出提示（建议确认电子围栏实现方式是否为地图绘制并实时检测）",
        "异常停留通过摄像头系统推送告警，地图上标记停留位置和时长（建议确认本系统是否直接对接摄像头API或接收安全系统推送）"
      ]
    },
    {
      "key": "mod-2",
      "name": "车辆状态看板",
      "description": "以卡片或列表形式聚合显示所有车辆的当前状态分类统计（空闲/任务中/排队/异常），支持快速筛选和查看详情，帮助调度员掌握整体资源分布。",
      "features": [
        "按状态分类展示车辆数量及简要列表",
        "点击某状态分类进入对应车辆明细列表",
        "支持按车辆类型、所属单位、作业区域筛选状态车辆",
        "实时刷新状态统计，异常状态车辆突出显示"
      ],
      "pageSuggestion": "DispatchCenterView.vue",
      "apiHint": "GET /api/v1/vehicles/status-summary, GET /api/v1/vehicles?status={status}",
      "dataNeeds": [
        "车辆当前状态（空闲/任务中/排队/异常）",
        "车辆类型、所属单位",
        "车辆当前位置（用于判断是否在作业区域）"
      ],
      "stateRules": [
        "车辆状态由任务状态自动变更：接单→任务中，到达→任务中，装卸完成→任务中，任务关闭→空闲",
        "排队状态由调度员手动标记或系统根据等待时间自动标记（建议确认排队规则：是否基于排队任务数量或现场调度员触发）",
        "异常状态包括超速、禁入区域、异常停留、证照过期等，需从异常告警模块同步"
      ]
    },
    {
      "key": "mod-3",
      "name": "用车需求管理",
      "description": "集中展示待处理的用车需求，包括生产计划系统推送的需求和调度员手动创建的用车申请，支持查看详情、筛选、排序，并快速转化为派车任务。",
      "features": [
        "展示用车需求列表（来源、优先级、作业区域、预计时间、物资或作业描述）",
        "支持按优先级（P0/P1/P2）、时间范围、来源筛选",
        "点击需求可查看详情（关联的生产计划任务号、物资提货号等）",
        "一键“派车”按钮跳转至派车操作面板"
      ],
      "pageSuggestion": "DispatchCenterView.vue",
      "apiHint": "GET /api/v1/request/demand-list, POST /api/v1/request/convert-to-task",
      "dataNeeds": [
        "需求ID、来源（生产计划系统/手动）、优先级",
        "作业区域、预计开始时间、预计结束时间",
        "关联物资提货单号或生产计划任务号",
        "需求描述（如吊装、转运、配送）"
      ],
      "stateRules": [
        "需求状态：待处理/已派车/已取消",
        "生产计划系统推送的需求不可手动修改，但可设置自动转换规则或手动转换（用户确认接口集成）",
        "手动创建的用车申请需填写完整的作业信息"
      ]
    },
    {
      "key": "mod-4",
      "name": "智能派车操作面板",
      "description": "为调度员提供选车、派车的核心操作界面，支持根据距离、车辆类型、任务优先级等因素推荐可用车辆，确认派车后生成任务并下发。",
      "features": [
        "根据所选需求自动筛选推荐可用车辆（距离近、类型匹配、空闲状态）",
        "手动选择或替换车辆，查看车辆详细信息（档案、历史任务）",
        "确认派车后生成任务，自动下发任务通知给司机",
        "派车记录自动保存，支持查看派车历史"
      ],
      "pageSuggestion": "DispatchCenterView.vue",
      "apiHint": "POST /api/v1/tasks/dispatch, GET /api/v1/vehicles/available",
      "dataNeeds": [
        "车辆实时位置（用于距离计算）",
        "车辆类型与作业区域匹配规则",
        "司机在线状态与任务负载",
        "任务优先级与预计时长"
      ],
      "stateRules": [
        "派车后车辆状态变为“任务中”，司机收到推送",
        "若推荐车辆不足时，给出提示并允许手动强制派车（需记录原因）",
        "任务下发后，门禁系统可获取该任务的入场授权信息（集成要求）"
      ]
    }
  ],
  "generationStatus": {
    "selectedPageKey": "sc-1-page-1-0",
    "interactionReady": true,
    "apiReady": true
  },
  "savedAt": "2026-07-03T13:59:14.000Z"
}
```
<!-- FDE_STEP_RESULT_JSON_END -->
