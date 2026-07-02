# 03 交互与API

- 步骤标识：`interactionapi`
- 保存时间：2026-07-02T10:39:22.068372+00:00
- 用途：作为下一步工作台的输入来源。

## 内容摘要

- **接口**：查询运营报表数据

## 结构化数据

<!-- FDE_STEP_RESULT_JSON_START -->
```json
{
  "generatedPagesByKey": {
    "scenario-1782887819107-0-scenario-1782887819107-0-page-1-0": {
      "key": "scenario-1782887819107-0-scenario-1782887819107-0-page-1-0",
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
      "sections": [
        "地图主区域",
        "车辆状态筛选与任务派发控制面板",
        "异常告警通知区域"
      ],
      "fields": [
        {
          "name": "statusFilter",
          "label": "车辆状态筛选",
          "type": "select",
          "required": false,
          "description": "按车辆状态（空闲、排队、任务中、异常）筛选地图标记"
        },
        {
          "name": "searchPlate",
          "label": "搜索车牌",
          "type": "text",
          "required": false,
          "description": "输入车牌号快速定位并高亮车辆"
        }
      ],
      "actions": [
        {
          "label": "点击车辆标记",
          "trigger": "click",
          "feedback": "弹出车辆详情窗口，显示车牌、司机、任务、状态信息"
        },
        {
          "label": "缩放地图",
          "trigger": "mousewheel/pinch",
          "feedback": "地图缩放级别变化，标注大小和密度自适应"
        },
        {
          "label": "切换图层",
          "trigger": "click layer toggle button",
          "feedback": "地图切换显示作业区域/禁入区域/排队区域图层"
        },
        {
          "label": "派发任务",
          "trigger": "click task dispatch button in panel",
          "feedback": "打开任务派发弹窗，选择目标车辆和任务内容"
        }
      ],
      "validations": [
        "现场调度地图监控 的关键筛选或处理字段不能为空。",
        "提交前校验状态流转是否合法，并给出明确错误提示。"
      ],
      "states": {
        "empty": "地图区域显示提示信息：暂无车辆数据，请确认车辆在线或刷新",
        "loading": "地图区域显示加载动画（旋转图标或进度条）",
        "success": "地图正常显示车辆标注及图层",
        "error": "地图区域显示错误提示：地图加载失败，请检查网络或刷新"
      },
      "generatedAt": "2026-07-02T07:29:42.222Z"
    },
    "scenario-1782887819107-0-scenario-1782887819107-0-page-2-1": {
      "key": "scenario-1782887819107-0-scenario-1782887819107-0-page-2-1",
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
      "sections": [
        "筛选条件面板",
        "筛选结果展示区（地图/列表）",
        "快捷操作栏"
      ],
      "fields": [
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "select",
          "required": false,
          "description": "多选，选项：生产车、物流车、外协车、临时车"
        },
        {
          "name": "status",
          "label": "车辆状态",
          "type": "select",
          "required": false,
          "description": "单选，选项：空闲、排队、任务中"
        },
        {
          "name": "area",
          "label": "作业区域",
          "type": "select",
          "required": false,
          "description": "单选或级联选择，根据区域层级"
        },
        {
          "name": "distance",
          "label": "距离远近",
          "type": "input",
          "required": false,
          "description": "数值输入，单位公里，支持范围筛选"
        }
      ],
      "actions": [
        {
          "label": "筛选",
          "trigger": "点击筛选按钮",
          "feedback": "触发条件查询，结果在地图高亮和列表显示"
        },
        {
          "label": "重置",
          "trigger": "点击重置按钮",
          "feedback": "清空所有筛选条件，恢复地图和列表初始状态"
        },
        {
          "label": "排序",
          "trigger": "选择排序条件（如距离、状态）",
          "feedback": "列表按所选条件重新排序"
        },
        {
          "label": "查看详情",
          "trigger": "点击列表项或地图标记",
          "feedback": "弹出车辆详情弹窗或跳转至详情页"
        }
      ],
      "validations": [
        "筛选条件至少包含一项",
        "距离输入必须为数字"
      ],
      "states": {
        "empty": "无匹配车辆，显示空状态提示，引导重新设置条件",
        "loading": "显示加载旋转图标或骨架屏",
        "success": "地图和列表正常展示筛选结果",
        "error": "查询失败时显示错误提示，提供重试按钮"
      },
      "generatedAt": "2026-07-02T07:30:36.953Z"
    },
    "scenario-1782887819107-0-scenario-1782887819107-0-page-3-2": {
      "key": "scenario-1782887819107-0-scenario-1782887819107-0-page-3-2",
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
      "sections": [
        "待派发用车申请列表",
        "车辆选择与任务匹配",
        "派发参数配置",
        "派发操作与日志"
      ],
      "fields": [
        {
          "name": "selectedRequest",
          "label": "用车申请",
          "type": "select",
          "required": true,
          "description": "从待派发用车申请列表中选择一项任务，支持单选"
        },
        {
          "name": "vehicleSelection",
          "label": "选择车辆",
          "type": "select",
          "required": true,
          "description": "当前已选中的车辆，显示车辆编号/车牌号"
        },
        {
          "name": "workPoint",
          "label": "作业点",
          "type": "text",
          "required": true,
          "description": "输入或选择具体作业地点"
        },
        {
          "name": "priority",
          "label": "优先级",
          "type": "select",
          "required": false,
          "description": "任务优先级：高、中、低"
        },
        {
          "name": "emergencyTask",
          "label": "紧急派车（手动创建）",
          "type": "checkbox",
          "required": false,
          "description": "勾选后跳过申请选择，手动输入任务详情"
        }
      ],
      "actions": [
        {
          "label": "确认派发",
          "trigger": "click",
          "feedback": "提交派发请求，成功后弹出成功提示并关闭对话框；失败显示错误信息"
        },
        {
          "label": "取消",
          "trigger": "click",
          "feedback": "关闭对话框，不做任何保存"
        }
      ],
      "validations": [
        "所选车辆必须为非空闲状态时不可派发",
        "作业点不能为空",
        "紧急派车时任务描述不能为空"
      ],
      "states": {
        "empty": "无待派发用车申请时，显示空状态提示：当前暂无待派发任务",
        "loading": "提交派发请求时，按钮显示加载中，并禁用操作",
        "success": "派发成功后，显示成功通知并关闭对话框",
        "error": "派发失败时，显示错误提示并保持对话框打开"
      },
      "generatedAt": "2026-07-02T07:30:56.764Z"
    },
    "scenario-1782887819107-0-scenario-1782887819107-0-page-4-3": {
      "key": "scenario-1782887819107-0-scenario-1782887819107-0-page-4-3",
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
      "sections": [
        "告警实时列表区域",
        "告警详情与处理区域",
        "历史告警查询区域"
      ],
      "fields": [
        {
          "name": "alertTypeFilter",
          "label": "告警类型",
          "type": "select",
          "required": false,
          "description": "用于筛选告警类型，选项包括超速、禁入区域、异常停留、未授权入场等"
        },
        {
          "name": "vehicleFilter",
          "label": "车辆",
          "type": "text",
          "required": false,
          "description": "输入车牌号或车辆编号模糊筛选"
        },
        {
          "name": "startTime",
          "label": "开始时间",
          "type": "date",
          "required": false,
          "description": "历史告警查询的起始时间"
        },
        {
          "name": "endTime",
          "label": "结束时间",
          "type": "date",
          "required": false,
          "description": "历史告警查询的结束时间"
        },
        {
          "name": "alertId",
          "label": "告警ID",
          "type": "text",
          "required": false,
          "description": "查看告警详情时显示的告警唯一标识"
        },
        {
          "name": "alertTypeDetail",
          "label": "告警类型",
          "type": "text",
          "required": false,
          "description": "告警详情区域显示的告警分类"
        },
        {
          "name": "vehicleDetail",
          "label": "车辆",
          "type": "text",
          "required": false,
          "description": "告警详情区域显示的车辆信息"
        },
        {
          "name": "timeDetail",
          "label": "告警时间",
          "type": "text",
          "required": false,
          "description": "告警详情区域显示的告警发生时间"
        },
        {
          "name": "locationDetail",
          "label": "位置",
          "type": "text",
          "required": false,
          "description": "告警详情区域显示的位置描述"
        },
        {
          "name": "statusDetail",
          "label": "状态",
          "type": "text",
          "required": false,
          "description": "告警详情区域显示的当前处理状态（待处理/已确认/已忽略等）"
        }
      ],
      "actions": [
        {
          "label": "确认告警",
          "trigger": "点击告警详情或列表项中的确认按钮",
          "feedback": "弹窗确认后，告警状态更新为已确认，实时列表刷新，显示成功提示"
        },
        {
          "label": "忽略告警",
          "trigger": "点击告警详情或列表项中的忽略按钮",
          "feedback": "弹窗确认后，告警从实时列表移除，标记为已忽略，显示提示"
        },
        {
          "label": "通知相关人员",
          "trigger": "点击告警详情中的通知按钮",
          "feedback": "弹出通知方式选择（短信/邮件/系统消息），选择后发送通知，显示发送成功提示"
        },
        {
          "label": "查看详情",
          "trigger": "点击告警列表中的某条告警",
          "feedback": "在地图上定位该车辆并显示告警详情区域信息"
        },
        {
          "label": "查询历史告警",
          "trigger": "点击历史告警查询区域的查询按钮",
          "feedback": "根据筛选条件展示历史告警列表，若查询中显示加载状态，结果为空显示空状态提示"
        },
        {
          "label": "导出历史告警",
          "trigger": "点击导出按钮",
          "feedback": "生成导出任务，完成后下载文件或提示导出成功"
        }
      ],
      "validations": [
        "开始时间不能晚于结束时间",
        "历史查询时开始时间和结束时间至少填写一个",
        "通知相关人员时至少选择一个通知方式"
      ],
      "states": {
        "empty": "当前无告警数据，请检查筛选条件或稍后刷新",
        "loading": "正在加载告警信息，请稍候...",
        "success": "操作已成功处理",
        "error": "加载失败，请检查网络后重试"
      },
      "generatedAt": "2026-07-02T07:32:17.845Z"
    },
    "scenario-1782887819107-1-scenario-1782887819107-1-page-1-0": {
      "key": "scenario-1782887819107-1-scenario-1782887819107-1-page-1-0",
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
      "sections": [
        "任务通知区域",
        "任务状态筛选区域",
        "任务列表展示区域"
      ],
      "fields": [
        {
          "name": "taskId",
          "label": "任务编号",
          "type": "text",
          "required": false,
          "description": "任务唯一标识"
        },
        {
          "name": "workPoint",
          "label": "作业点",
          "type": "text",
          "required": false,
          "description": "任务作业地点"
        },
        {
          "name": "requiredTime",
          "label": "要求时间",
          "type": "datetime",
          "required": false,
          "description": "任务要求完成时间"
        },
        {
          "name": "statusFilter",
          "label": "状态筛选",
          "type": "select",
          "required": false,
          "description": "按任务状态筛选：待接单、进行中、已完成"
        }
      ],
      "actions": [
        {
          "label": "接收任务通知",
          "trigger": "点击通知区域",
          "feedback": "清除未读标记并刷新列表"
        },
        {
          "label": "筛选任务",
          "trigger": "选择状态筛选值",
          "feedback": "触发列表更新，显示对应状态任务"
        },
        {
          "label": "下拉刷新",
          "trigger": "下拉手势",
          "feedback": "重新加载列表数据"
        },
        {
          "label": "分页加载",
          "trigger": "滚动至列表底部",
          "feedback": "加载更多任务"
        }
      ],
      "validations": [
        "任务列表 的关键筛选或处理字段不能为空。",
        "提交前校验状态流转是否合法，并给出明确错误提示。"
      ],
      "states": {
        "empty": "无任务时显示空状态提示和引导",
        "loading": "加载中显示加载动画",
        "success": "加载成功显示任务列表",
        "error": "加载失败显示错误提示和重试按钮"
      },
      "generatedAt": "2026-07-02T07:32:52.324Z"
    },
    "scenario-1782887819107-1-scenario-1782887819107-1-page-2-1": {
      "key": "scenario-1782887819107-1-scenario-1782887819107-1-page-2-1",
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
      "sections": [
        "任务基本信息区域",
        "作业点信息区域",
        "任务时间区域",
        "操作区域"
      ],
      "fields": [
        {
          "name": "taskId",
          "label": "任务编号",
          "type": "text",
          "required": false,
          "description": "任务唯一标识，仅供查看"
        },
        {
          "name": "taskStatus",
          "label": "任务状态",
          "type": "text",
          "required": false,
          "description": "当前任务执行状态，如待执行、进行中、已完成"
        },
        {
          "name": "workPointName",
          "label": "作业点名称",
          "type": "text",
          "required": false,
          "description": "作业地点名称"
        },
        {
          "name": "address",
          "label": "地址",
          "type": "text",
          "required": false,
          "description": "作业点详细地址"
        },
        {
          "name": "contactPerson",
          "label": "联系人",
          "type": "text",
          "required": false,
          "description": "现场联系人姓名"
        },
        {
          "name": "contactPhone",
          "label": "联系电话",
          "type": "phone",
          "required": false,
          "description": "现场联系人电话"
        },
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "text",
          "required": false,
          "description": "所需车辆类型要求"
        },
        {
          "name": "materialType",
          "label": "物资种类",
          "type": "text",
          "required": false,
          "description": "需携带的物资种类"
        },
        {
          "name": "operationInstruction",
          "label": "作业说明",
          "type": "text",
          "required": false,
          "description": "具体作业要求说明"
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
          "description": "计划完成作业的时间"
        }
      ],
      "actions": [
        {
          "label": "导航",
          "trigger": "点击",
          "feedback": "打开第三方地图应用并传入作业点坐标地址"
        },
        {
          "label": "联系调度员",
          "trigger": "点击",
          "feedback": "弹出调度员联系方式或直接拨打电话"
        },
        {
          "label": "确认到达",
          "trigger": "点击",
          "feedback": "弹出确认框提示，确认后更新任务状态为已到达并记录时间"
        },
        {
          "label": "完成任务",
          "trigger": "点击",
          "feedback": "弹出确认框提示，确认后更新任务状态为已完成并记录完成时间"
        }
      ],
      "validations": [
        "任务详情 的关键筛选或处理字段不能为空。",
        "提交前校验状态流转是否合法，并给出明确错误提示。"
      ],
      "states": {
        "empty": "页面无数据时，显示空状态提示：暂无任务详情信息",
        "loading": "页面数据加载中，显示骨架屏或加载动画",
        "success": "数据加载成功，正常展示所有字段和操作按钮",
        "error": "数据加载失败，显示错误提示并提供重新加载操作"
      },
      "generatedAt": "2026-07-02T07:33:26.818Z"
    },
    "scenario-1782887819107-1-scenario-1782887819107-1-page-3-2": {
      "key": "scenario-1782887819107-1-scenario-1782887819107-1-page-3-2",
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
      "sections": [
        "地图显示区域",
        "导航信息区域",
        "操作与提示区域"
      ],
      "fields": [
        {
          "name": "currentPosition",
          "label": "当前位置",
          "type": "text",
          "required": true,
          "description": "自动获取的司机实时位置信息"
        },
        {
          "name": "destination",
          "label": "作业点",
          "type": "text",
          "required": true,
          "description": "从任务派发中获取的指定作业点位置"
        },
        {
          "name": "estimatedArrivalTime",
          "label": "预计到达时间",
          "type": "text",
          "required": false,
          "description": "系统计算的预计到达时间"
        },
        {
          "name": "distance",
          "label": "剩余距离",
          "type": "text",
          "required": false,
          "description": "当前位置到目的地的剩余距离"
        },
        {
          "name": "routeInfo",
          "label": "导航路径",
          "type": "text",
          "required": false,
          "description": "显示在地图上的最优路径信息"
        }
      ],
      "actions": [
        {
          "label": "开始导航",
          "trigger": "用户点击开始导航按钮",
          "feedback": "地图切换到导航模式，开始语音播报指引"
        },
        {
          "label": "结束导航",
          "trigger": "用户点击结束导航按钮或到达后自动触发",
          "feedback": "退出导航模式，清除路线，回到任务详情页"
        },
        {
          "label": "切换语音播报",
          "trigger": "用户点击语音开关",
          "feedback": "开启或关闭语音导航提示"
        },
        {
          "label": "路线偏离提醒",
          "trigger": "检测到偏离原路线",
          "feedback": "弹出偏离提醒提示框，重新计算路径或返回原路"
        },
        {
          "label": "到达确认",
          "trigger": "到达作业点附近（距离<50米）",
          "feedback": "自动弹出到达确认弹窗，提示司机确认到达"
        }
      ],
      "validations": [
        "导航与路径 的关键筛选或处理字段不能为空。",
        "提交前校验状态流转是否合法，并给出明确错误提示。"
      ],
      "states": {
        "empty": {
          "description": "未获取到导航起点或目的地的状态",
          "ui": "地图显示默认位置，提示‘请确认任务作业点’"
        },
        "loading": {
          "description": "正在计算路径或刷新位置",
          "ui": "显示加载动画，路径待显示"
        },
        "success": {
          "description": "路径计算成功，导航正常进行",
          "ui": "地图显示完整路径，显示距离和ETA，语音正常播报"
        },
        "error": {
          "description": "定位失败、路径计算失败或网络异常",
          "ui": "显示错误提示，提供重试按钮或返回上一页操作"
        }
      },
      "generatedAt": "2026-07-02T07:33:52.388Z"
    },
    "scenario-1782887819107-1-scenario-1782887819107-1-page-4-3": {
      "key": "scenario-1782887819107-1-scenario-1782887819107-1-page-4-3",
      "name": "现场反馈",
      "vueFile": "SiteFeedbackView.vue",
      "goal": "司机在到达作业点后确认到达，并上传现场照片或备注信息",
      "features": [
        "点击'到达确认'并记录到达时间",
        "现场拍照上传（支持多张照片）",
        "添加文字备注或异常说明",
        "反馈信息与任务关联并同步至调度端"
      ],
      "sections": [
        "到达确认区域",
        "现场反馈与上传区域"
      ],
      "fields": [
        {
          "name": "photos",
          "label": "现场照片",
          "type": "file",
          "required": false,
          "description": "支持多张照片上传"
        },
        {
          "name": "remark",
          "label": "备注说明",
          "type": "textarea",
          "required": false,
          "description": "添加文字备注或异常说明"
        }
      ],
      "actions": [
        {
          "label": "到达确认",
          "trigger": "click",
          "feedback": "记录到达时间，界面显示确认状态"
        },
        {
          "label": "提交反馈",
          "trigger": "click",
          "feedback": "上传照片和备注，同步至调度端，显示提交结果"
        }
      ],
      "validations": [
        "请至少上传一张照片或填写备注以便反馈"
      ],
      "states": {
        "empty": "页面初始无数据，展示到达确认按钮和输入区域",
        "loading": "正在提交反馈或确认到达，显示加载动画",
        "success": "反馈提交成功，显示成功提示",
        "error": "提交失败，显示错误信息，允许用户重试"
      },
      "generatedAt": "2026-07-02T07:34:23.231Z"
    },
    "scenario-1782887819107-2-scenario-1782887819107-2-page-1-0": {
      "key": "scenario-1782887819107-2-scenario-1782887819107-2-page-1-0",
      "name": "入场核验 - 支持扫描车牌或二维码，自动核验预约与任务关联",
      "vueFile": "EntryCheckPanel.vue",
      "goal": "支持通过扫描车牌或预约二维码，自动核验车辆预约有效性及派车任务关联，快速得出入场许可结果",
      "features": [
        "扫描车牌或预约二维码",
        "自动核验预约有效性及任务关联",
        "显示核验结果（放行/拒绝）",
        "处理核验异常并引导手动操作"
      ],
      "sections": [
        "扫描输入区",
        "核验结果展示区",
        "异常处理区",
        "操作记录区"
      ],
      "fields": [
        {
          "name": "scanInput",
          "label": "扫描输入",
          "type": "text",
          "required": true,
          "description": "支持扫描车牌或预约二维码，或手动输入"
        },
        {
          "name": "manualInput",
          "label": "手动补录",
          "type": "text",
          "required": false,
          "description": "当自动核验异常时，用于手动输入预约编号或车牌进行二次核验"
        }
      ],
      "actions": [
        {
          "label": "扫描/识别",
          "trigger": "点击扫描图标或自动调用相机",
          "feedback": "识别车牌或二维码内容并填充scanInput字段，自动触发核验（若开启自动核验）"
        },
        {
          "label": "核验",
          "trigger": "点击核验按钮（或自动核验）",
          "feedback": "根据scanInput内容查询预约及任务关联，更新verificationResult和页面状态"
        },
        {
          "label": "异常处理",
          "trigger": "点击异常处理区域的确认/重置按钮",
          "feedback": "根据manualInput内容重新核验或登记无预约入场"
        }
      ],
      "validations": [
        "车牌号格式校验：支持常见车牌格式（如粤B12345）",
        "预约二维码格式校验：应包含有效预约ID",
        "非空校验：扫描输入不能为空"
      ],
      "states": {
        "empty": "未输入扫描内容，扫描输入框为空，显示占位提示文字",
        "loading": "正在核验中，显示加载动画，按钮禁用",
        "success": "核验通过，显示绿色放行标识，允许入场，记录操作",
        "error": "核验失败，显示红色拒绝标识，显示具体错误原因，展示异常处理区"
      },
      "generatedAt": "2026-07-02T07:35:17.603Z"
    },
    "scenario-1782887819107-2-scenario-1782887819107-2-page-2-1": {
      "key": "scenario-1782887819107-2-scenario-1782887819107-2-page-2-1",
      "name": "放行管理 - 管理车辆入场放行操作与记录",
      "vueFile": "ReleaseManagementPanel.vue",
      "goal": "根据核验结果执行放行或拒绝操作，记录放行时间、车辆信息，并更新相关任务状态",
      "features": [
        "手动确认放行或拒绝",
        "记录入场时间与车辆信息",
        "关联更新派车任务状态",
        "支持批量放行操作"
      ],
      "sections": [
        "放行操作区",
        "车辆信息与记录区",
        "批量放行区",
        "任务状态关联区"
      ],
      "fields": [
        {
          "name": "vehiclePlate",
          "label": "车牌号",
          "type": "text",
          "required": true,
          "description": "核验车辆的车牌号，用于记录和关联任务"
        },
        {
          "name": "entryTime",
          "label": "入场时间",
          "type": "datetime",
          "required": true,
          "description": "车辆实际入场时间，自动记录当前时间"
        },
        {
          "name": "releaseOperator",
          "label": "放行人",
          "type": "text",
          "required": false,
          "description": "执行放行或拒绝操作的门岗人员"
        },
        {
          "name": "releaseRemark",
          "label": "放行备注",
          "type": "textarea",
          "required": false,
          "description": "放行或拒绝时的备注信息"
        },
        {
          "name": "batchSelection",
          "label": "批量选择",
          "type": "checkbox",
          "required": false,
          "description": "用于批量放行操作时选择多条记录"
        }
      ],
      "actions": [
        {
          "label": "放行",
          "trigger": "点击放行按钮",
          "feedback": "弹出确认对话框，确认后执行放行操作，记录入场时间，更新任务状态为已入场"
        },
        {
          "label": "拒绝",
          "trigger": "点击拒绝按钮",
          "feedback": "弹出确认对话框，确认后执行拒绝操作，记录拒绝原因，更新任务状态为拒绝入场"
        },
        {
          "label": "批量放行",
          "trigger": "点击批量放行按钮",
          "feedback": "批量选中的车辆记录执行放行操作，显示进度提示，完成后更新多条任务状态"
        }
      ],
      "validations": [
        "放行前必须确认车辆核验结果为通过",
        "拒绝操作需填写拒绝原因",
        "批量放行至少选择一条记录"
      ],
      "states": {
        "empty": {
          "description": "未加载任何待处理放行记录时的状态",
          "message": "暂无待放行车辆"
        },
        "loading": {
          "description": "加载放行数据或执行放行操作时的状态",
          "message": "正在处理，请稍候"
        },
        "success": {
          "description": "放行操作成功完成后的状态",
          "message": "放行成功，已记录入场信息"
        },
        "error": {
          "description": "放行操作失败或数据加载异常时的状态",
          "message": "操作失败，请重试"
        }
      },
      "generatedAt": "2026-07-02T07:36:10.746Z"
    },
    "scenario-1782887819107-2-scenario-1782887819107-2-page-3-2": {
      "key": "scenario-1782887819107-2-scenario-1782887819107-2-page-3-2",
      "name": "异常告警 - 处理入场违规与安全告警事件",
      "vueFile": "AlertPanel.vue",
      "goal": "实时处理未授权入场、证照过期、异常停留等告警，支持告警确认、解除与上报",
      "features": [
        "告警实时展示与分类",
        "告警处理（确认/解除/上报）",
        "告警历史查询"
      ],
      "sections": [
        "实时告警列表",
        "告警处理面板",
        "告警历史查询"
      ],
      "fields": [
        {
          "name": "keyword",
          "label": "关键字",
          "type": "text",
          "required": false,
          "description": "输入车牌号或告警描述进行查询"
        },
        {
          "name": "handleRemark",
          "label": "处理备注",
          "type": "textarea",
          "required": false,
          "description": "填写告警处理的补充说明"
        }
      ],
      "actions": [
        {
          "label": "确认告警",
          "trigger": "click",
          "feedback": "显示确认成功提示，更新告警状态为已确认"
        },
        {
          "label": "解除告警",
          "trigger": "click",
          "feedback": "显示解除成功提示，更新告警状态为已解除"
        },
        {
          "label": "上报告警",
          "trigger": "click",
          "feedback": "弹出上报表单，填写上报部门及说明后提交"
        },
        {
          "label": "查询",
          "trigger": "click",
          "feedback": "根据输入的关键字刷新告警历史列表"
        }
      ],
      "validations": [
        "上报时必须填写上报部门",
        "处理备注不超过200字"
      ],
      "states": {
        "empty": "暂无告警数据",
        "loading": "正在加载告警信息...",
        "success": "操作成功",
        "error": "操作失败，请重试"
      },
      "generatedAt": "2026-07-02T07:36:40.987Z"
    },
    "scenario-1782887819107-2-scenario-1782887819107-2-page-4-3": {
      "key": "scenario-1782887819107-2-scenario-1782887819107-2-page-4-3",
      "name": "放行记录查询 - 追溯车辆入场放行历史数据",
      "vueFile": "ReleaseRecordQueryView.vue",
      "goal": "按时间、车牌、车辆类型等条件检索放行记录，查看核验详情，支持导出用于审计追溯",
      "features": [
        "多条件组合查询放行记录",
        "查看核验详情与放行凭证",
        "导出记录报表"
      ],
      "sections": [
        "查询条件区",
        "数据列表区",
        "详情查看区",
        "导出操作区"
      ],
      "fields": [
        {
          "name": "startTime",
          "label": "开始时间",
          "type": "date",
          "required": false,
          "description": "查询放行记录的起始日期"
        },
        {
          "name": "endTime",
          "label": "结束时间",
          "type": "date",
          "required": false,
          "description": "查询放行记录的结束日期"
        },
        {
          "name": "plateNumber",
          "label": "车牌号",
          "type": "text",
          "required": false,
          "description": "输入完整或部分车牌号进行模糊匹配"
        },
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "select",
          "required": false,
          "description": "按车辆类型筛选，如轿车、货车等"
        },
        {
          "name": "releaseStatus",
          "label": "放行状态",
          "type": "select",
          "required": false,
          "description": "选择放行状态：成功、异常等"
        }
      ],
      "actions": [
        {
          "label": "查询",
          "trigger": "click",
          "feedback": "根据条件检索放行记录，更新数据列表区，并处理查询状态（加载/空/错误）"
        },
        {
          "label": "查看详情",
          "trigger": "click",
          "feedback": "弹窗或侧边栏展示该条记录的核验详情及放行凭证"
        },
        {
          "label": "导出报表",
          "trigger": "click",
          "feedback": "将当前查询结果导出为Excel或CSV文件，供审计追溯"
        }
      ],
      "validations": [
        "开始时间不能晚于结束时间",
        "车牌号需符合车牌格式（如：京A·12345）",
        "时间范围跨度不超过90天"
      ],
      "states": {
        "empty": "无匹配的放行记录，请调整查询条件",
        "loading": "正在查询放行记录，请稍候...",
        "success": "查询完成，共展示 N 条放行记录",
        "error": "查询失败，请检查网络或联系管理员"
      },
      "generatedAt": "2026-07-02T07:37:19.315Z"
    },
    "scenario-1782887819107-3-scenario-1782887819107-3-page-1-0": {
      "key": "scenario-1782887819107-3-scenario-1782887819107-3-page-1-0",
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
      "sections": [
        "筛选区域",
        "核心指标概览",
        "统计分析图表",
        "外协车辆与异常记录列表"
      ],
      "fields": [
        {
          "name": "timeRange",
          "label": "时间范围",
          "type": "dateRangePicker",
          "required": true,
          "description": "选择报表统计的起止日期，支持自定义时间范围"
        },
        {
          "name": "vehicleUtilization",
          "label": "车辆利用率",
          "type": "chart",
          "required": false,
          "description": "趋势图展示车辆利用率历史数据"
        },
        {
          "name": "taskCompletionRate",
          "label": "任务完成率",
          "type": "chart",
          "required": false,
          "description": "图表展示任务完成率与平均等待时长关系"
        },
        {
          "name": "emptyDrivingRate",
          "label": "空驶率",
          "type": "chart",
          "required": false,
          "description": "图表展示空驶率与排队统计"
        },
        {
          "name": "outsourceVehicleUsage",
          "label": "外协车辆使用次数",
          "type": "list",
          "required": false,
          "description": "展示外协车辆使用次数与异常记录列表"
        },
        {
          "name": "abnormalEntryRecords",
          "label": "异常入场记录",
          "type": "list",
          "required": false,
          "description": "展示异常入场记录明细"
        }
      ],
      "actions": [
        {
          "label": "查询",
          "trigger": "点击查询按钮",
          "feedback": "根据所选时间范围重新加载所有图表与列表数据"
        },
        {
          "label": "导出图表",
          "trigger": "点击导出按钮",
          "feedback": "将当前可见图表导出为图片或PDF格式，提供下载"
        },
        {
          "label": "重置",
          "trigger": "点击重置按钮",
          "feedback": "清空时间范围选择，恢复到默认时间段（如近7天）"
        }
      ],
      "validations": [
        "时间范围必填，必须选择有效的起止日期",
        "时间范围不得超过一年，避免数据过载"
      ],
      "states": {
        "empty": {
          "description": "无统计数据时显示提示信息，如“暂无数据”"
        },
        "loading": {
          "description": "数据加载中显示加载动画或骨架屏"
        },
        "success": {
          "description": "数据加载成功，正常展示图表与列表"
        },
        "error": {
          "description": "数据加载失败时显示错误提示，提供重试按钮"
        }
      },
      "generatedAt": "2026-07-02T07:37:36.730Z"
    },
    "scenario-1782887819107-3-scenario-1782887819107-3-page-2-1": {
      "key": "scenario-1782887819107-3-scenario-1782887819107-3-page-2-1",
      "name": "报表数据导出",
      "vueFile": "ReportExportView.vue",
      "goal": "支持将统计分析结果导出为Excel、PDF等格式，便于管理人员存档、分发和进一步分析",
      "features": [
        "选择导出格式（Excel/PDF）",
        "选择导出内容范围（全部报表/指定指标）",
        "一键导出并下载文件",
        "导出记录日志与审计追踪"
      ],
      "sections": [
        "导出配置区域",
        "导出操作区域",
        "导出记录日志区域"
      ],
      "fields": [
        {
          "name": "exportFormat",
          "label": "导出格式",
          "type": "select",
          "required": true,
          "description": "选择导出的文件格式，支持Excel和PDF"
        },
        {
          "name": "exportScope",
          "label": "导出范围",
          "type": "radio",
          "required": true,
          "description": "选择导出全部报表还是指定指标"
        },
        {
          "name": "selectedIndicators",
          "label": "指定指标",
          "type": "checkbox-group",
          "required": false,
          "description": "当导出范围为指定指标时，勾选需要导出的指标"
        }
      ],
      "actions": [
        {
          "label": "导出",
          "trigger": "点击导出按钮",
          "feedback": "触发导出流程，根据选择格式和范围生成文件并下载，同时记录日志"
        },
        {
          "label": "查看导出记录",
          "trigger": "点击日志记录区域中的查看按钮",
          "feedback": "展示历史导出记录详情"
        }
      ],
      "validations": [
        "必须选择导出格式",
        "必须选择导出范围",
        "如果选择指定指标，则必须至少勾选一个指标"
      ],
      "states": {
        "empty": {},
        "loading": {
          "message": "正在导出，请稍候..."
        },
        "success": {
          "message": "导出成功",
          "detail": "文件已保存到本地"
        },
        "error": {
          "message": "导出失败",
          "detail": "请检查网络连接或联系管理员"
        }
      },
      "generatedAt": "2026-07-02T07:38:05.907Z"
    },
    "scenario-1782887819107-3-scenario-1782887819107-3-page-3-2": {
      "key": "scenario-1782887819107-3-scenario-1782887819107-3-page-3-2",
      "name": "资源配置优化建议",
      "vueFile": "ResourceAllocationView.vue",
      "goal": "基于历史数据与当前车辆使用情况，提供车辆资源配置优化建议和外协车辆费用管理参考",
      "features": [
        "分析车辆使用热点与瓶颈区域",
        "推荐车辆增减数量与类型调整",
        "展示外协车辆费用汇总与趋势",
        "提供资源配置优化报告预览"
      ],
      "sections": [
        "筛选与时间范围区域",
        "热点与瓶颈分析区域",
        "资源配置推荐区域",
        "外协费用汇总区域",
        "优化报告预览区域"
      ],
      "fields": [
        {
          "name": "dateRange",
          "label": "时间范围",
          "type": "daterange",
          "required": true,
          "description": "选择要分析的时间段，用于过滤历史数据和趋势展示"
        },
        {
          "name": "region",
          "label": "区域",
          "type": "select",
          "required": false,
          "description": "按区域筛选车辆使用数据，例如东部、西部等"
        },
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "select",
          "required": false,
          "description": "按车辆类型筛选，如轿车、卡车、客车等"
        }
      ],
      "actions": [
        {
          "label": "查询",
          "trigger": "点击",
          "feedback": "触发数据加载，更新各分析区域图表与列表"
        },
        {
          "label": "预览报告",
          "trigger": "点击",
          "feedback": "弹出模态框或新页面显示优化报告预览内容"
        },
        {
          "label": "导出报告",
          "trigger": "点击",
          "feedback": "触发下载文件（PDF或Excel），包含当前筛选条件下的完整报告"
        }
      ],
      "validations": [
        "日期范围必填",
        "开始日期不能晚于结束日期"
      ],
      "states": {
        "empty": "显示空状态提示文字，例如“请选择时间范围后查询”",
        "loading": "各分析区域显示骨架屏或加载图标，禁用查询按钮并显示“加载中…”",
        "success": "正常显示图表、列表与报告预览区域",
        "error": "顶部出现错误提示条，文字为“数据请求失败，请重试”，查询按钮恢复可用"
      },
      "generatedAt": "2026-07-02T07:38:29.551Z"
    },
    "sc-1-page-1-0": {
      "key": "sc-1-page-1-0",
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
      ],
      "fields": [
        {
          "name": "areaFilter",
          "label": "作业区域",
          "type": "select",
          "required": false,
          "description": "按作业区域筛选任务"
        },
        {
          "name": "vehicleTypeFilter",
          "label": "车辆类型",
          "type": "select",
          "required": false,
          "description": "按车辆类型筛选"
        },
        {
          "name": "priorityFilter",
          "label": "任务优先级",
          "type": "select",
          "required": false,
          "description": "按优先级筛选"
        },
        {
          "name": "searchTask",
          "label": "搜索任务",
          "type": "text",
          "required": false,
          "description": "关键词搜索任务"
        }
      ],
      "actions": [
        {
          "label": "派车分配",
          "trigger": "点击任务卡片上的'派车'按钮",
          "feedback": "弹出派车分配弹窗，选择车辆后确认"
        },
        {
          "label": "查看详情",
          "trigger": "点击任务卡片或地图标记",
          "feedback": "显示任务详情侧边栏"
        },
        {
          "label": "处理告警",
          "trigger": "点击告警条目上的'处理'按钮",
          "feedback": "弹窗展示处理选项，提交后更新告警状态"
        },
        {
          "label": "刷新数据",
          "trigger": "点击刷新按钮或手动下拉",
          "feedback": "重新加载页面数据"
        }
      ],
      "validations": [
        "派车时需选择车辆且车辆状态可用",
        "处理告警时必填处理意见"
      ],
      "states": {
        "empty": {
          "description": "无待办任务或告警，显示提示文案"
        },
        "loading": {
          "description": "数据加载中，显示骨架屏或加载动画"
        },
        "success": {
          "description": "数据加载成功，正常展示地图、任务列表及告警"
        },
        "error": {
          "description": "网络或服务异常，显示错误提示及重试按钮"
        }
      },
      "generatedAt": "2026-07-02T10:26:48.598Z"
    },
    "sc-2-page-1-0": {
      "key": "sc-2-page-1-0",
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
      ],
      "fields": [
        {
          "name": "taskList",
          "label": "任务列表",
          "type": "list",
          "required": false,
          "description": "展示待接收或进行中的任务列表，包含任务编号、状态、作业地址等信息"
        },
        {
          "name": "taskDetail",
          "label": "任务详情",
          "type": "object",
          "required": false,
          "description": "选中任务后展示详细信息，包括任务编号、作业地址、计划时间等"
        },
        {
          "name": "photo",
          "label": "现场照片",
          "type": "file",
          "required": true,
          "description": "到达作业点后，必须拍照上传以确认任务完成"
        },
        {
          "name": "remarks",
          "label": "备注",
          "type": "textarea",
          "required": false,
          "description": "可选的附加说明信息"
        }
      ],
      "actions": [
        {
          "label": "刷新任务列表",
          "trigger": "用户点击顶部操作栏的刷新按钮",
          "feedback": "页面重新加载任务列表数据并更新界面"
        },
        {
          "label": "导航",
          "trigger": "用户点击任务详情中的导航按钮",
          "feedback": "调起设备默认地图应用并规划到作业点的路线"
        },
        {
          "label": "确认到达",
          "trigger": "用户到达作业点后点击确认到达按钮",
          "feedback": "记录到达时间并更新任务状态为‘已到达’"
        },
        {
          "label": "拍照",
          "trigger": "用户点击照片上传区的拍照按钮",
          "feedback": "调起相机拍照并在界面中显示预览图"
        },
        {
          "label": "提交任务",
          "trigger": "用户点击提交按钮",
          "feedback": "校验已拍照后提交任务，更新状态为‘已完成’，并返回任务列表"
        }
      ],
      "validations": [
        "必须上传至少一张现场照片",
        "任务状态为‘已到达’后才能提交"
      ],
      "states": {
        "empty": "任务列表为空时显示空状态提示‘暂无任务，请稍后刷新’",
        "loading": "页面加载数据时显示加载动画或骨架屏",
        "success": "操作成功时显示成功提示，如‘任务提交成功’并自动跳转",
        "error": "操作失败时显示错误提示，如‘网络异常，请重试’"
      },
      "generatedAt": "2026-07-02T10:27:10.299Z"
    },
    "sc-3-page-1-0": {
      "key": "sc-3-page-1-0",
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
      ],
      "fields": [
        {
          "name": "plateNumber",
          "label": "车牌号",
          "type": "text",
          "required": false,
          "description": "用于筛选列表中的车辆"
        },
        {
          "name": "arrivalTime",
          "label": "入场时间范围",
          "type": "date-range",
          "required": false,
          "description": "筛选指定时间段内的待入场车辆"
        },
        {
          "name": "vehicleType",
          "label": "车辆类型",
          "type": "select",
          "required": false,
          "description": "按车辆类型筛选"
        },
        {
          "name": "authorizationStatus",
          "label": "授权状态",
          "type": "select",
          "required": false,
          "description": "筛选已授权或未授权车辆"
        },
        {
          "name": "inspectionResult",
          "label": "核验结果",
          "type": "select",
          "required": true,
          "description": "人工核验后选择：通过、不通过"
        },
        {
          "name": "releaseAction",
          "label": "放行操作",
          "type": "button",
          "required": false,
          "description": "点击后执行放行"
        },
        {
          "name": "exceptionType",
          "label": "异常类型",
          "type": "select",
          "required": false,
          "description": "登记异常时选择类型"
        },
        {
          "name": "exceptionRemark",
          "label": "异常备注",
          "type": "textarea",
          "required": false,
          "description": "详细描述异常信息"
        }
      ],
      "actions": [
        {
          "label": "核验确认",
          "trigger": "点击核验详情区的确认按钮",
          "feedback": "更新核验结果状态，并记录核验日志"
        },
        {
          "label": "放行",
          "trigger": "点击放行按钮",
          "feedback": "触发道闸开启，车辆入场，列表移除该车辆"
        },
        {
          "label": "异常登记",
          "trigger": "点击异常登记按钮或填写异常表单",
          "feedback": "保存异常记录，车辆挂起或标记特殊状态"
        },
        {
          "label": "刷新列表",
          "trigger": "手动下拉刷新或点击刷新按钮",
          "feedback": "重新请求待入场车辆列表数据"
        }
      ],
      "validations": [
        "核验结果必须选择（通过/不通过）",
        "异常登记时，异常类型与备注至少填一项",
        "入场时间范围结束日期不能早于开始日期",
        "车牌号格式校验（车牌正则）"
      ],
      "states": {
        "empty": "无待入场车辆，显示空状态提示",
        "loading": "加载车辆列表时显示加载中动画",
        "success": "放行成功后显示短暂成功提示",
        "error": "核验失败或网络异常时显示错误提示"
      },
      "generatedAt": "2026-07-02T10:27:36.870Z"
    },
    "sc-4-page-1-0": {
      "key": "sc-4-page-1-0",
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
      ],
      "fields": [
        {
          "name": "startDate",
          "label": "开始日期",
          "type": "date",
          "required": true,
          "description": "选择报表统计的开始日期"
        },
        {
          "name": "endDate",
          "label": "结束日期",
          "type": "date",
          "required": true,
          "description": "选择报表统计的结束日期"
        },
        {
          "name": "metricType",
          "label": "指标类型",
          "type": "select",
          "required": false,
          "description": "选择要查看的指标，如运营效率、成本、收入等"
        },
        {
          "name": "department",
          "label": "部门",
          "type": "select",
          "required": false,
          "description": "按部门筛选报表数据"
        }
      ],
      "actions": [
        {
          "label": "查询",
          "trigger": "click",
          "feedback": "触发数据加载，图表区域显示loading状态并重新渲染"
        },
        {
          "label": "导出决策建议",
          "trigger": "click",
          "feedback": "下载生成的决策建议PDF或Excel文件"
        },
        {
          "label": "重置",
          "trigger": "click",
          "feedback": "清空所有筛选条件并恢复默认数据展示"
        }
      ],
      "validations": [
        "开始日期不能晚于结束日期",
        "至少选择一个筛选条件"
      ],
      "states": {
        "empty": {
          "description": "无报表数据时展示空状态提示，如“暂无报表数据，请调整筛选条件”"
        },
        "loading": {
          "description": "数据加载中，图表区域显示旋转加载动画"
        },
        "success": {
          "description": "数据加载成功，正常展示图表和摘要信息"
        },
        "error": {
          "description": "数据加载失败，显示错误提示及重试按钮"
        }
      },
      "generatedAt": "2026-07-02T10:39:13.239Z"
    }
  },
  "generatedApiByPageKey": {
    "scenario-1782887819107-0-scenario-1782887819107-0-page-1-0": {
      "key": "api-scenario-1782887819107-0-scenario-1782887819107-0-page-1-0",
      "method": "GET",
      "name": "获取车辆列表",
      "path": "/api/vehicles",
      "goal": "获取所有车辆的位置、状态、作业区域等信息，用于地图展示",
      "trigger": "页面加载时或状态筛选条件变化时",
      "requestParams": [
        {
          "name": "statusFilter",
          "type": "string",
          "required": false,
          "description": "车辆状态筛选：空闲、排队、任务中、异常"
        },
        {
          "name": "searchPlate",
          "type": "string",
          "required": false,
          "description": "车牌号模糊搜索"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "vehicles": [
            {
              "id": "string",
              "plate": "string",
              "status": "string",
              "latitude": 0,
              "longitude": 0,
              "driver": "string",
              "task": "string"
            }
          ]
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": -1,
        "message": "error message",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": 1001,
          "meaning": "参数校验失败",
          "frontendAdvice": "检查查询参数是否正确"
        },
        {
          "code": 2001,
          "meaning": "服务内部错误",
          "frontendAdvice": "请稍后重试或联系管理员"
        }
      ],
      "sourcePageKey": "scenario-1782887819107-0-scenario-1782887819107-0-page-1-0"
    },
    "scenario-1782887819107-0-scenario-1782887819107-0-page-2-1": {
      "key": "api-scenario-1782887819107-0-scenario-1782887819107-0-page-2-1",
      "method": "GET",
      "name": "车辆列表查询",
      "path": "/api/vehicles",
      "goal": "根据筛选条件查询现场车辆列表，返回匹配的车辆信息，用于地图和列表展示",
      "trigger": "用户点击“筛选”按钮或页面加载时",
      "requestParams": [
        {
          "name": "vehicleType",
          "type": "string",
          "required": false,
          "description": "多选，选项：生产车、物流车、外协车、临时车，多个逗号分隔"
        },
        {
          "name": "status",
          "type": "string",
          "required": false,
          "description": "单选，选项：空闲、排队、任务中"
        },
        {
          "name": "area",
          "type": "string",
          "required": false,
          "description": "作业区域编码"
        },
        {
          "name": "distance",
          "type": "number",
          "required": false,
          "description": "距离范围上限，单位公里"
        },
        {
          "name": "distanceFrom",
          "type": "number",
          "required": false,
          "description": "距离范围下限"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "成功",
        "data": {
          "vehicles": [
            {
              "id": "string",
              "plateNumber": "string",
              "vehicleType": "string",
              "status": "string",
              "latitude": "number",
              "longitude": "number",
              "distance": "number",
              "area": "string",
              "lastUpdateTime": "string"
            }
          ],
          "total": 0
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
          "code": 4001,
          "meaning": "参数校验失败",
          "frontendAdvice": "检查筛选条件是否合法"
        },
        {
          "code": 5000,
          "meaning": "服务器内部错误",
          "frontendAdvice": "显示错误提示，提供重试按钮"
        },
        {
          "code": 1003,
          "meaning": "无访问权限",
          "frontendAdvice": "提示用户无权限"
        }
      ],
      "sourcePageKey": "scenario-1782887819107-0-scenario-1782887819107-0-page-2-1"
    },
    "scenario-1782887819107-0-scenario-1782887819107-0-page-3-2": {
      "key": "api-scenario-1782887819107-0-scenario-1782887819107-0-page-4-3",
      "method": "GET",
      "name": "查询告警列表",
      "path": "/api/alerts",
      "goal": "分页查询异常告警列表，支持按告警类型、时间范围、车辆搜索筛选",
      "trigger": "页面加载时自动触发，或点击查询按钮时触发",
      "requestParams": [
        {
          "name": "alertTypeFilter",
          "type": "string",
          "required": false,
          "description": "告警类型筛选值，如 speeding、zone_entry"
        },
        {
          "name": "timeRangeFilter",
          "type": "string",
          "required": false,
          "description": "时间范围字符串，格式 'start,end' 如 '2025-01-01,2025-01-31'"
        },
        {
          "name": "vehicleSearch",
          "type": "string",
          "required": false,
          "description": "车牌号或车辆名称关键字"
        },
        {
          "name": "page",
          "type": "integer",
          "required": true,
          "description": "当前页码，从1开始"
        },
        {
          "name": "pageSize",
          "type": "integer",
          "required": true,
          "description": "每页记录数"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "查询成功",
        "data": {
          "total": 0,
          "list": [
            {
              "alertId": "string",
              "vehiclePlate": "string",
              "alertType": "string",
              "alertTime": "string",
              "status": "string",
              "location": "string",
              "description": "string"
            }
          ]
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
          "meaning": "请求参数格式或值不合法",
          "frontendAdvice": "检查筛选参数、分页参数是否符合要求"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "请稍后重试或联系管理员"
        }
      ],
      "sourcePageKey": "scenario-1782887819107-0-scenario-1782887819107-0-page-4-3"
    },
    "scenario-1782887819107-0-scenario-1782887819107-0-page-4-3": {
      "key": "api-scenario-1782887819107-0-scenario-1782887819107-0-page-4-3",
      "method": "GET",
      "name": "查询告警列表",
      "path": "/api/alerts",
      "goal": "根据筛选条件获取实时告警或历史告警列表，支持分页和筛选",
      "trigger": "页面加载时默认获取实时告警列表；点击查询历史告警按钮时根据筛选条件获取历史告警列表",
      "requestParams": [
        {
          "name": "alertType",
          "type": "string",
          "required": false,
          "description": "告警类型筛选，如超速、禁入区域、异常停留、未授权入场"
        },
        {
          "name": "vehicle",
          "type": "string",
          "required": false,
          "description": "车牌号或车辆编号模糊查询"
        },
        {
          "name": "startTime",
          "type": "string",
          "required": false,
          "description": "历史告警查询起始时间，格式 yyyy-MM-dd HH:mm:ss"
        },
        {
          "name": "endTime",
          "type": "string",
          "required": false,
          "description": "历史告警查询结束时间，格式 yyyy-MM-dd HH:mm:ss"
        },
        {
          "name": "page",
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
          "name": "history",
          "type": "boolean",
          "required": false,
          "description": "是否查询历史告警，默认false表示实时告警"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "操作成功",
        "data": {
          "total": 0,
          "records": [
            {
              "alertId": "string",
              "alertType": "string",
              "vehicle": "string",
              "time": "string",
              "location": "string",
              "status": "string",
              "description": "string"
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
          "code": 400,
          "meaning": "请求参数错误，如开始时间晚于结束时间或格式错误",
          "frontendAdvice": "检查筛选条件后重新提交"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "请稍后重试或联系管理员"
        }
      ],
      "sourcePageKey": "scenario-1782887819107-0-scenario-1782887819107-0-page-4-3"
    },
    "scenario-1782887819107-1-scenario-1782887819107-1-page-1-0": {
      "key": "api-scenario-1782887819107-1-scenario-1782887819107-1-page-1-0",
      "method": "GET",
      "name": "获取任务列表",
      "path": "/api/tasks",
      "goal": "司机获取个人任务列表，支持按状态筛选和分页",
      "trigger": "页面加载、筛选状态变化、下拉刷新、滚动到底部加载更多",
      "requestParams": [
        {
          "name": "statusFilter",
          "type": "string",
          "required": false,
          "description": "任务状态筛选：待接单、进行中、已完成"
        },
        {
          "name": "pageNum",
          "type": "integer",
          "required": false,
          "description": "页码，从1开始，默认1"
        },
        {
          "name": "pageSize",
          "type": "integer",
          "required": false,
          "description": "每页条数，默认10"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "成功",
        "data": {
          "tasks": [
            {
              "taskId": "string",
              "workPoint": "string",
              "requiredTime": "string",
              "status": "string"
            }
          ],
          "total": 0
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
          "meaning": "参数错误",
          "frontendAdvice": "检查请求参数是否合法"
        },
        {
          "code": 401,
          "meaning": "未授权",
          "frontendAdvice": "跳转登录页"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "提示用户稍后重试"
        }
      ],
      "sourcePageKey": "scenario-1782887819107-1-scenario-1782887819107-1-page-1-0"
    },
    "scenario-1782887819107-1-scenario-1782887819107-1-page-2-1": {
      "key": "api-scenario-1782887819107-1-scenario-1782887819107-1-page-2-1",
      "method": "GET",
      "name": "获取任务详情",
      "path": "/api/tasks/{taskId}",
      "goal": "获取指定任务的详细信息，包括作业点位置、任务要求、物资信息等",
      "trigger": "进入页面时自动调用",
      "requestParams": [
        {
          "name": "taskId",
          "type": "string",
          "required": true,
          "description": "任务唯一标识，从路由参数或上级传入"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "成功",
        "data": {
          "taskId": "string",
          "taskStatus": "string",
          "workPointName": "string",
          "address": "string",
          "contactPerson": "string",
          "contactPhone": "string",
          "vehicleType": "string",
          "materialType": "string",
          "operationInstruction": "string",
          "plannedArrivalTime": "string",
          "plannedCompletionTime": "string"
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
          "code": "1001",
          "meaning": "任务不存在",
          "frontendAdvice": "提示用户‘任务已删除或无效’，并返回上一页"
        },
        {
          "code": "1002",
          "meaning": "无权限访问",
          "frontendAdvice": "提示用户‘无权查看该任务’，并跳转至列表页"
        },
        {
          "code": "1003",
          "meaning": "参数错误",
          "frontendAdvice": "提示用户‘请求参数异常’，并记录日志"
        }
      ],
      "sourcePageKey": "scenario-1782887819107-1-scenario-1782887819107-1-page-2-1"
    },
    "scenario-1782887819107-1-scenario-1782887819107-1-page-3-2": {
      "key": "api-scenario-1782887819107-1-scenario-1782887819107-1-page-3-2",
      "method": "POST",
      "name": "获取导航路径",
      "path": "/api/navigation/route",
      "goal": "根据司机当前位置和目的地，计算并返回最优路径、预计到达时间和剩余距离",
      "trigger": "用户点击开始导航按钮",
      "requestParams": [
        {
          "name": "currentPosition",
          "type": "string",
          "required": true,
          "description": "司机实时位置坐标（格式：纬度,经度）"
        },
        {
          "name": "destination",
          "type": "string",
          "required": true,
          "description": "作业点坐标（格式：纬度,经度）"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "成功",
        "data": {
          "estimatedArrivalTime": "string",
          "distance": "string",
          "routeInfo": "string"
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 500,
        "message": "错误信息",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": "LOCATION_FAILED",
          "meaning": "无法获取当前位置",
          "frontendAdvice": "请检查定位权限或手动输入位置"
        },
        {
          "code": "DESTINATION_INVALID",
          "meaning": "目的地无效或无法到达",
          "frontendAdvice": "请确认作业点是否正确"
        },
        {
          "code": "ROUTE_CALCULATION_ERROR",
          "meaning": "路径计算失败",
          "frontendAdvice": "请稍后重试或联系管理员"
        }
      ],
      "sourcePageKey": "scenario-1782887819107-1-scenario-1782887819107-1-page-3-2"
    },
    "scenario-1782887819107-1-scenario-1782887819107-1-page-4-3": {
      "key": "api-scenario-1782887819107-1-scenario-1782887819107-1-page-4-3",
      "method": "POST",
      "name": "提交现场反馈",
      "path": "/api/tasks/feedback",
      "goal": "司机提交到达现场后的反馈信息，包括照片和备注，同步至调度端",
      "trigger": "用户点击“提交反馈”按钮",
      "requestParams": [
        {
          "name": "photos",
          "type": "array",
          "required": false,
          "description": "现场照片文件列表，支持多张，可选"
        },
        {
          "name": "remark",
          "type": "string",
          "required": false,
          "description": "文字备注或异常说明，可选（但至少与photos填一项）"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "反馈提交成功",
        "data": {
          "feedbackId": "string",
          "submitTime": "string"
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
          "meaning": "请求参数校验失败（如未上传照片也未填写备注）",
          "frontendAdvice": "提示用户至少上传一张照片或填写备注"
        },
        {
          "code": 401,
          "meaning": "用户未登录或token失效",
          "frontendAdvice": "引导用户重新登录"
        },
        {
          "code": 403,
          "meaning": "无权限提交该任务反馈",
          "frontendAdvice": "提示用户无操作权限，联系管理员"
        },
        {
          "code": 500,
          "meaning": "服务器异常",
          "frontendAdvice": "显示网络错误提示，允许用户重试"
        }
      ],
      "sourcePageKey": "scenario-1782887819107-1-scenario-1782887819107-1-page-4-3"
    },
    "scenario-1782887819107-2-scenario-1782887819107-2-page-1-0": {
      "key": "api-scenario-1782887819107-2-scenario-1782887819107-2-page-1-0",
      "method": "POST",
      "name": "入场核验",
      "path": "/api/verifications/check",
      "goal": "根据车牌或预约二维码核验车辆预约有效性及派车任务关联，返回入场许可结果",
      "trigger": "用户点击核验按钮或自动核验触发",
      "requestParams": [
        {
          "name": "scanInput",
          "type": "string",
          "required": true,
          "description": "车牌号或预约二维码内容"
        },
        {
          "name": "manualInput",
          "type": "string",
          "required": false,
          "description": "二次核验时手动输入的预约编号或车牌"
        }
      ],
      "successResponse": {
        "code": "200",
        "message": "核验通过",
        "data": {
          "permit": true,
          "vehicleInfo": {
            "plateNumber": "粤B12345",
            "vehicleType": "轿车"
          },
          "appointment": {
            "id": "AP20231001",
            "status": "valid",
            "taskId": "TASK20231001"
          },
          "task": {
            "id": "TASK20231001",
            "description": "供应商送货",
            "status": "inProgress"
          },
          "entryAllowed": true,
          "entryTime": "2023-10-01T10:00:00Z"
        },
        "traceId": "trace-xxx"
      },
      "errorResponse": {
        "code": "400",
        "message": "核验失败",
        "data": {
          "permit": false,
          "reason": "预约已过期",
          "suggestion": "请联系管理员更新预约信息"
        },
        "traceId": "trace-xxx"
      },
      "errorCodes": [
        {
          "code": "VER001",
          "meaning": "车牌格式不合法",
          "frontendAdvice": "提示用户检查车牌输入格式"
        },
        {
          "code": "VER002",
          "meaning": "预约二维码无效或已过期",
          "frontendAdvice": "提示用户确认二维码有效性或手动输入预约编号"
        },
        {
          "code": "VER003",
          "meaning": "预约与任务关联不存在",
          "frontendAdvice": "显示无关联任务，允许无预约入场登记"
        },
        {
          "code": "VER004",
          "meaning": "系统异常",
          "frontendAdvice": "重试或联系IT支持"
        }
      ],
      "sourcePageKey": "scenario-1782887819107-2-scenario-1782887819107-2-page-1-0"
    },
    "scenario-1782887819107-2-scenario-1782887819107-2-page-2-1": {
      "key": "api-scenario-1782887819107-2-scenario-1782887819107-2-page-2-1",
      "method": "POST",
      "name": "放行车辆",
      "path": "/api/releases",
      "goal": "执行车辆放行操作，记录入场时间并更新任务状态为已入场",
      "trigger": "用户点击放行按钮并确认后",
      "requestParams": [
        {
          "name": "vehiclePlate",
          "type": "string",
          "required": true,
          "description": "核验车辆的车牌号"
        },
        {
          "name": "entryTime",
          "type": "datetime",
          "required": true,
          "description": "车辆实际入场时间，默认为当前时间"
        },
        {
          "name": "releaseOperator",
          "type": "string",
          "required": false,
          "description": "执行放行操作的门岗人员"
        },
        {
          "name": "releaseRemark",
          "type": "string",
          "required": false,
          "description": "放行备注信息"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "放行成功",
        "data": {
          "releaseId": "UUID字符串",
          "vehiclePlate": "车辆车牌号",
          "entryTime": "2025-01-15T14:30:00",
          "status": "已入场"
        },
        "traceId": "请求追踪ID"
      },
      "errorResponse": {
        "code": 400,
        "message": "参数错误",
        "data": null,
        "traceId": "请求追踪ID"
      },
      "errorCodes": [
        {
          "code": 400,
          "meaning": "请求参数缺失或格式错误",
          "frontendAdvice": "检查车牌号和入场时间是否正确填写"
        },
        {
          "code": 404,
          "meaning": "车辆核验记录未找到",
          "frontendAdvice": "请确认车辆已通过核验"
        },
        {
          "code": 409,
          "meaning": "车辆已存在放行记录",
          "frontendAdvice": "该车辆已经放行，请刷新列表"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "请稍后重试，若持续失败请联系管理员"
        }
      ],
      "sourcePageKey": "scenario-1782887819107-2-scenario-1782887819107-2-page-2-1"
    },
    "scenario-1782887819107-2-scenario-1782887819107-2-page-3-2": {
      "key": "api-scenario-1782887819107-2-scenario-1782887819107-2-page-3-2",
      "method": "POST",
      "name": "处理告警",
      "path": "/api/alerts/{id}/process",
      "goal": "对指定告警进行确认、解除或上报操作，更新告警状态并返回处理结果",
      "trigger": "用户点击确认、解除或上报按钮时触发",
      "requestParams": [
        {
          "name": "action",
          "type": "string",
          "required": true,
          "description": "操作类型：confirm（确认）、dismiss（解除）、report（上报）"
        },
        {
          "name": "handleRemark",
          "type": "string",
          "required": false,
          "description": "处理备注，不超过200字"
        },
        {
          "name": "reportDepartment",
          "type": "string",
          "required": false,
          "description": "上报部门，当action=report时必填"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "操作成功",
        "data": {
          "alertId": "string",
          "status": "string",
          "handledAt": "datetime",
          "handler": "string"
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 400,
        "message": "操作失败",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": 1001,
          "meaning": "告警记录不存在",
          "frontendAdvice": "提示用户告警可能已被删除，建议刷新列表"
        },
        {
          "code": 2001,
          "meaning": "参数校验失败（如缺少必填字段、备注超长）",
          "frontendAdvice": "根据后端返回的具体字段错误信息，在前端对应输入框显示校验提示"
        },
        {
          "code": 3001,
          "meaning": "重复操作（告警已被处理）",
          "frontendAdvice": "提示用户该告警已被处理，并刷新状态"
        }
      ],
      "sourcePageKey": "scenario-1782887819107-2-scenario-1782887819107-2-page-3-2"
    },
    "scenario-1782887819107-2-scenario-1782887819107-2-page-4-3": {
      "key": "api-scenario-1782887819107-2-scenario-1782887819107-2-page-4-3",
      "method": "GET",
      "name": "查询放行记录",
      "path": "/api/release-records",
      "goal": "按条件检索车辆入场放行历史记录",
      "trigger": "用户点击查询按钮",
      "requestParams": [
        {
          "name": "startTime",
          "type": "string",
          "required": false,
          "description": "查询放行记录的起始日期，格式yyyy-MM-dd"
        },
        {
          "name": "endTime",
          "type": "string",
          "required": false,
          "description": "查询放行记录的结束日期，格式yyyy-MM-dd"
        },
        {
          "name": "plateNumber",
          "type": "string",
          "required": false,
          "description": "完整或部分车牌号，模糊匹配"
        },
        {
          "name": "vehicleType",
          "type": "string",
          "required": false,
          "description": "车辆类型，如轿车、货车"
        },
        {
          "name": "releaseStatus",
          "type": "string",
          "required": false,
          "description": "放行状态：success或异常"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "查询成功",
        "data": {
          "total": 0,
          "records": [
            {
              "id": "string",
              "plateNumber": "string",
              "vehicleType": "string",
              "releaseTime": "string",
              "releaseStatus": "string",
              "inspector": "string",
              "remarks": "string"
            }
          ]
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
          "meaning": "参数校验失败",
          "frontendAdvice": "请检查查询条件是否符合要求"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "查询失败，请稍后重试或联系管理员"
        }
      ],
      "sourcePageKey": "scenario-1782887819107-2-scenario-1782887819107-2-page-4-3"
    },
    "scenario-1782887819107-3-scenario-1782887819107-3-page-1-0": {
      "key": "api-scenario-1782887819107-3-scenario-1782887819107-3-page-1-0",
      "method": "GET",
      "name": "查询车辆运营报表数据",
      "path": "/api/reports/vehicle-operations",
      "goal": "根据时间范围获取车辆利用率、任务完成率、空驶率、外协车辆使用次数、异常入场记录等统计数据。",
      "trigger": "用户点击查询按钮时调用；页面初始化时自动调用。",
      "requestParams": [
        {
          "name": "timeRange",
          "type": "string",
          "required": true,
          "description": "统计的起止日期，格式为yyyy-MM-dd~yyyy-MM-dd"
        },
        {
          "name": "startDate",
          "type": "string",
          "required": false,
          "description": "可拆分传入，格式yyyy-MM-dd"
        },
        {
          "name": "endDate",
          "type": "string",
          "required": false,
          "description": "可拆分传入，格式yyyy-MM-dd"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "成功",
        "data": {
          "vehicleUtilization": [
            {
              "date": "2025-01-01",
              "rate": 0.85
            }
          ],
          "taskCompletionRate": [
            {
              "date": "2025-01-01",
              "rate": 0.92
            }
          ],
          "emptyDrivingRate": [
            {
              "date": "2025-01-01",
              "rate": 0.12
            }
          ],
          "outsourceVehicleUsage": [
            {
              "date": "2025-01-01",
              "count": 5
            }
          ],
          "abnormalEntryRecords": [
            {
              "id": 1,
              "vehicleNo": "粤B12345",
              "entryTime": "2025-01-01 10:00",
              "reason": "无预约"
            }
          ]
        },
        "traceId": "trace-xxxx"
      },
      "errorResponse": {
        "code": 500,
        "message": "服务器内部错误",
        "data": null,
        "traceId": "trace-xxxx"
      },
      "errorCodes": [
        {
          "code": 400,
          "meaning": "请求参数错误，如时间范围格式不对或超出限制",
          "frontendAdvice": "提示用户检查时间范围输入，确保格式正确且不超过一年。"
        },
        {
          "code": 401,
          "meaning": "用户未登录或无权限",
          "frontendAdvice": "跳转登录页或提示用户重新登录。"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "显示错误提示信息，并提供重试按钮。"
        }
      ],
      "sourcePageKey": "scenario-1782887819107-3-scenario-1782887819107-3-page-1-0"
    },
    "scenario-1782887819107-3-scenario-1782887819107-3-page-2-1": {
      "key": "api-scenario-1782887819107-3-scenario-1782887819107-3-page-2-1",
      "method": "POST",
      "name": "报表数据导出",
      "path": "/api/reports/export",
      "goal": "根据选择的格式、范围和指定指标，生成并返回报表文件下载链接或直接触发下载",
      "trigger": "用户点击导出按钮后，前端校验通过时调用",
      "requestParams": [
        {
          "name": "exportFormat",
          "type": "string",
          "required": true,
          "description": "导出的文件格式，值为 'excel' 或 'pdf'"
        },
        {
          "name": "exportScope",
          "type": "string",
          "required": true,
          "description": "导出范围，值为 'all' 或 'selected'"
        },
        {
          "name": "selectedIndicators",
          "type": "array",
          "required": false,
          "description": "当 exportScope 为 'selected' 时，需指定指标名称列表"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "导出成功",
        "data": {
          "downloadUrl": "http://example.com/reports/export/xxxxx.xlsx"
        },
        "traceId": "a1b2c3d4"
      },
      "errorResponse": {
        "code": -1,
        "message": "导出失败：参数校验错误或服务异常",
        "data": null,
        "traceId": "a1b2c3d4"
      },
      "errorCodes": [
        {
          "code": 40001,
          "meaning": "参数缺失或不符合要求",
          "frontendAdvice": "请检查导出格式、导出范围和指标选择是否完整"
        },
        {
          "code": 50001,
          "meaning": "服务器内部错误",
          "frontendAdvice": "提示用户稍后重试，若持续失败请联系管理员"
        }
      ],
      "sourcePageKey": "scenario-1782887819107-3-scenario-1782887819107-3-page-2-1"
    },
    "scenario-1782887819107-3-scenario-1782887819107-3-page-3-2": {
      "key": "api-scenario-1782887819107-3-scenario-1782887819107-3-page-3-2",
      "method": "GET",
      "name": "获取资源配置优化建议",
      "path": "/api/resource-allocation",
      "goal": "根据时间范围、区域和车辆类型等筛选条件，获取资源配置优化建议数据，包含车辆使用统计、优化建议列表、趋势图表等",
      "trigger": "用户点击查询按钮时",
      "requestParams": [
        {
          "name": "dateRange",
          "type": "string",
          "required": true,
          "description": "时间范围，格式为'开始日期,结束日期'，如'2023-01-01,2023-12-31'"
        },
        {
          "name": "region",
          "type": "string",
          "required": false,
          "description": "区域，如东部、西部等"
        },
        {
          "name": "vehicleType",
          "type": "string",
          "required": false,
          "description": "车辆类型，如轿车、卡车、客车等"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "成功",
        "data": {
          "summary": "优化建议综述",
          "trendChart": "趋势图数据",
          "allocationSuggestions": "资源配置建议列表",
          "costManagement": "外协费用管理参考"
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 0,
        "message": "string",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": "400",
          "meaning": "请求参数错误，如日期格式不正确或必填字段缺失",
          "frontendAdvice": "检查输入参数，确保日期格式正确且必填字段已填写"
        },
        {
          "code": "404",
          "meaning": "没有找到对应数据",
          "frontendAdvice": "提示用户当前筛选条件下没有数据，可尝试调整筛选条件"
        },
        {
          "code": "500",
          "meaning": "服务器内部错误",
          "frontendAdvice": "显示错误提示条，并允许用户重试"
        }
      ],
      "sourcePageKey": "scenario-1782887819107-3-scenario-1782887819107-3-page-3-2"
    },
    "sc-1-page-1-0": {
      "key": "api-sc-1-page-1-0",
      "method": "POST",
      "name": "派车分配",
      "path": "/api/tasks/dispatch",
      "goal": "为指定任务分配车辆并生成调度指令",
      "trigger": "用户在弹窗中选择车辆后点击确认",
      "requestParams": [
        {
          "name": "taskId",
          "type": "string",
          "required": true,
          "description": "任务ID"
        },
        {
          "name": "vehicleId",
          "type": "string",
          "required": true,
          "description": "选择的车辆ID"
        },
        {
          "name": "remark",
          "type": "string",
          "required": false,
          "description": "派车备注"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "派车成功",
        "data": {
          "dispatchId": "string",
          "taskId": "string",
          "vehicleId": "string",
          "status": "dispatched",
          "estimatedArrivalTime": "string"
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 400,
        "message": "参数错误或业务校验失败",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": "VEHICLE_NOT_AVAILABLE",
          "meaning": "所选车辆当前不可用",
          "frontendAdvice": "提示用户更换车辆"
        },
        {
          "code": "TASK_ALREADY_DISPATCHED",
          "meaning": "该任务已派车",
          "frontendAdvice": "提示用户任务已处理"
        },
        {
          "code": "INTERNAL_ERROR",
          "meaning": "服务器内部错误",
          "frontendAdvice": "提示用户稍后重试"
        }
      ],
      "sourcePageKey": "sc-1-page-1-0"
    },
    "sc-2-page-1-0": {
      "key": "api-sc-2-page-1-0",
      "method": "POST",
      "name": "提交任务",
      "path": "/api/tasks/submit",
      "goal": "司机到达作业点拍照后，提交任务完成确认，更新任务状态为已完成",
      "trigger": "用户点击提交按钮，且已校验至少上传一张照片",
      "requestParams": [
        {
          "name": "taskId",
          "type": "string",
          "required": true,
          "description": "任务唯一标识"
        },
        {
          "name": "photo",
          "type": "string",
          "required": true,
          "description": "现场照片的URL或文件标识（已通过拍照上传获取）"
        },
        {
          "name": "remarks",
          "type": "string",
          "required": false,
          "description": "附加备注信息"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "操作成功",
        "data": {
          "taskId": "string",
          "status": "已完成",
          "arrivedAt": "2025-04-08T10:30:00Z",
          "completedAt": "2025-04-08T10:35:00Z"
        },
        "traceId": "string"
      },
      "errorResponse": {
        "code": 400,
        "message": "业务校验失败",
        "data": null,
        "traceId": "string"
      },
      "errorCodes": [
        {
          "code": 4001,
          "meaning": "未上传现场照片",
          "frontendAdvice": "提示用户必须拍照后才能提交"
        },
        {
          "code": 4002,
          "meaning": "任务状态不允许提交（未到达或已完成）",
          "frontendAdvice": "提示用户当前任务状态不可提交，请确认到达后再试"
        },
        {
          "code": 5000,
          "meaning": "服务器内部错误",
          "frontendAdvice": "提示用户网络异常，请稍后重试"
        }
      ],
      "sourcePageKey": "sc-2-page-1-0"
    },
    "sc-3-page-1-0": {
      "key": "api-sc-4-page-1-0",
      "method": "POST",
      "name": "查询报表",
      "path": "/api/reports/query",
      "goal": "根据用户选择的日期范围、指标和报表类型，获取运营报表数据与关键指标摘要",
      "trigger": "点击查询按钮",
      "requestParams": [
        {
          "name": "dateRange",
          "type": "string",
          "required": true,
          "description": "报表统计的时间范围，格式如'2023-01-01,2023-01-31'"
        },
        {
          "name": "metrics",
          "type": "string",
          "required": false,
          "description": "需显示的指标列表，以逗号分隔，如'vehicleUtilization,avgDuration'"
        },
        {
          "name": "reportType",
          "type": "string",
          "required": false,
          "description": "报表类型，如'daily','weekly'"
        }
      ],
      "successResponse": {
        "code": 200,
        "message": "查询成功",
        "data": {
          "reportData": {},
          "summary": {},
          "charts": []
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
          "code": "PARAM_MISSING",
          "meaning": "必填参数缺失",
          "frontendAdvice": "检查日期范围是否已填写"
        },
        {
          "code": "INVALID_DATE_RANGE",
          "meaning": "日期范围格式错误或无效",
          "frontendAdvice": "请重新选择有效的日期范围"
        },
        {
          "code": "DATA_NOT_FOUND",
          "meaning": "所选条件下无报表数据",
          "frontendAdvice": "显示空状态提示，建议调整查询条件"
        },
        {
          "code": "INTERNAL_ERROR",
          "meaning": "服务器内部错误",
          "frontendAdvice": "显示错误提示，并请稍后重试"
        }
      ],
      "sourcePageKey": "sc-4-page-1-0"
    },
    "sc-4-page-1-0": {
      "key": "api-sc-4-page-1-0",
      "method": "GET",
      "name": "查询运营报表数据",
      "path": "/api/reports/operational",
      "goal": "根据筛选条件获取运营报表数据，用于展示图表和摘要信息",
      "trigger": "用户点击“查询”按钮或页面初始化时自动触发",
      "requestParams": [
        {
          "name": "startDate",
          "type": "string",
          "required": true,
          "description": "报表统计开始日期，格式 yyyy-MM-dd"
        },
        {
          "name": "endDate",
          "type": "string",
          "required": true,
          "description": "报表统计结束日期，格式 yyyy-MM-dd"
        },
        {
          "name": "metricType",
          "type": "string",
          "required": false,
          "description": "指标类型，如 OPERATION_EFFICIENCY, COST, REVENUE"
        },
        {
          "name": "department",
          "type": "string",
          "required": false,
          "description": "部门ID或名称，用于筛选"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "成功",
        "data": {
          "summary": {
            "totalVehicles": 0,
            "totalTrips": 0,
            "avgEfficiency": 0
          },
          "charts": {
            "trend": {
              "labels": [],
              "datasets": []
            },
            "distribution": {}
          },
          "suggestions": [
            "建议1",
            "建议2"
          ]
        },
        "traceId": "uuid"
      },
      "errorResponse": {
        "code": -1,
        "message": "系统错误",
        "data": null,
        "traceId": "uuid"
      },
      "errorCodes": [
        {
          "code": 400,
          "meaning": "请求参数校验失败，如日期格式错误或开始日期晚于结束日期",
          "frontendAdvice": "提示用户修正参数，并高亮错误字段"
        },
        {
          "code": 403,
          "meaning": "无权限访问该报表",
          "frontendAdvice": "提示用户联系管理员"
        },
        {
          "code": 500,
          "meaning": "服务器内部错误",
          "frontendAdvice": "显示错误提示及重试按钮"
        }
      ],
      "sourcePageKey": "sc-4-page-1-0"
    }
  },
  "scenarioPageGroups": [
    {
      "key": "sc-1",
      "name": "调度员现场调度派车与异常处理",
      "priority": "P0",
      "pages": [
        {
          "key": "sc-1-page-1-0",
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
          ],
          "originalPageKey": "page-1",
          "scenarioKey": "sc-1",
          "scenarioName": "调度员现场调度派车与异常处理"
        }
      ]
    },
    {
      "key": "sc-2",
      "name": "司机移动端任务接收与作业确认",
      "priority": "P0",
      "pages": [
        {
          "key": "sc-2-page-1-0",
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
          ],
          "originalPageKey": "page-1",
          "scenarioKey": "sc-2",
          "scenarioName": "司机移动端任务接收与作业确认"
        }
      ]
    },
    {
      "key": "sc-3",
      "name": "门岗人员入场核验与放行管理",
      "priority": "P1",
      "pages": [
        {
          "key": "sc-3-page-1-0",
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
          ],
          "originalPageKey": "page-1",
          "scenarioKey": "sc-3",
          "scenarioName": "门岗人员入场核验与放行管理"
        }
      ]
    },
    {
      "key": "sc-4",
      "name": "管理人员查看运营报表与资源优化",
      "priority": "P1",
      "pages": [
        {
          "key": "sc-4-page-1-0",
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
          ],
          "originalPageKey": "page-1",
          "scenarioKey": "sc-4",
          "scenarioName": "管理人员查看运营报表与资源优化"
        }
      ]
    }
  ],
  "pageDesign": {
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
  },
  "selectedPage": {
    "key": "sc-4-page-1-0",
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
    ],
    "fields": [
      {
        "name": "startDate",
        "label": "开始日期",
        "type": "date",
        "required": true,
        "description": "选择报表统计的开始日期"
      },
      {
        "name": "endDate",
        "label": "结束日期",
        "type": "date",
        "required": true,
        "description": "选择报表统计的结束日期"
      },
      {
        "name": "metricType",
        "label": "指标类型",
        "type": "select",
        "required": false,
        "description": "选择要查看的指标，如运营效率、成本、收入等"
      },
      {
        "name": "department",
        "label": "部门",
        "type": "select",
        "required": false,
        "description": "按部门筛选报表数据"
      }
    ],
    "actions": [
      {
        "label": "查询",
        "trigger": "click",
        "feedback": "触发数据加载，图表区域显示loading状态并重新渲染"
      },
      {
        "label": "导出决策建议",
        "trigger": "click",
        "feedback": "下载生成的决策建议PDF或Excel文件"
      },
      {
        "label": "重置",
        "trigger": "click",
        "feedback": "清空所有筛选条件并恢复默认数据展示"
      }
    ],
    "validations": [
      "开始日期不能晚于结束日期",
      "至少选择一个筛选条件"
    ],
    "states": {
      "empty": {
        "description": "无报表数据时展示空状态提示，如“暂无报表数据，请调整筛选条件”"
      },
      "loading": {
        "description": "数据加载中，图表区域显示旋转加载动画"
      },
      "success": {
        "description": "数据加载成功，正常展示图表和摘要信息"
      },
      "error": {
        "description": "数据加载失败，显示错误提示及重试按钮"
      }
    },
    "generatedAt": "2026-07-02T10:39:13.239Z"
  },
  "selectedApiContract": {
    "key": "api-sc-4-page-1-0",
    "method": "GET",
    "name": "查询运营报表数据",
    "path": "/api/reports/operational",
    "goal": "根据筛选条件获取运营报表数据，用于展示图表和摘要信息",
    "trigger": "用户点击“查询”按钮或页面初始化时自动触发",
    "requestParams": [
      {
        "name": "startDate",
        "type": "string",
        "required": true,
        "description": "报表统计开始日期，格式 yyyy-MM-dd"
      },
      {
        "name": "endDate",
        "type": "string",
        "required": true,
        "description": "报表统计结束日期，格式 yyyy-MM-dd"
      },
      {
        "name": "metricType",
        "type": "string",
        "required": false,
        "description": "指标类型，如 OPERATION_EFFICIENCY, COST, REVENUE"
      },
      {
        "name": "department",
        "type": "string",
        "required": false,
        "description": "部门ID或名称，用于筛选"
      }
    ],
    "successResponse": {
      "code": 0,
      "message": "成功",
      "data": {
        "summary": {
          "totalVehicles": 0,
          "totalTrips": 0,
          "avgEfficiency": 0
        },
        "charts": {
          "trend": {
            "labels": [],
            "datasets": []
          },
          "distribution": {}
        },
        "suggestions": [
          "建议1",
          "建议2"
        ]
      },
      "traceId": "uuid"
    },
    "errorResponse": {
      "code": -1,
      "message": "系统错误",
      "data": null,
      "traceId": "uuid"
    },
    "errorCodes": [
      {
        "code": 400,
        "meaning": "请求参数校验失败，如日期格式错误或开始日期晚于结束日期",
        "frontendAdvice": "提示用户修正参数，并高亮错误字段"
      },
      {
        "code": 403,
        "meaning": "无权限访问该报表",
        "frontendAdvice": "提示用户联系管理员"
      },
      {
        "code": 500,
        "meaning": "服务器内部错误",
        "frontendAdvice": "显示错误提示及重试按钮"
      }
    ],
    "sourcePageKey": "sc-4-page-1-0"
  },
  "savedAt": "2026-07-02T10:39:22.063Z"
}
```
<!-- FDE_STEP_RESULT_JSON_END -->
