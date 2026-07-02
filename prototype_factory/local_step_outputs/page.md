# 04 页面设计

- 步骤标识：`page`
- 保存时间：2026-07-02T03:26:31.217347+00:00
- 用途：作为下一步工作台的输入来源。

## 内容摘要

- **场景**：调度员现场调度
- **页面**：现场调度地图监控

## 结构化数据

<!-- FDE_STEP_RESULT_JSON_START -->
```json
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
  "savedAt": "2026-07-02T03:26:31.214Z"
}
```
<!-- FDE_STEP_RESULT_JSON_END -->
