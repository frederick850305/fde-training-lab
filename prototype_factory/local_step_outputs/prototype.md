# 07 前端原型方案

- 步骤标识：`prototype`
- 保存时间：2026-07-02T03:26:38.592012+00:00
- 用途：作为下一步工作台的输入来源。

## 内容摘要

- 已保存该步骤的结构化输出。

## 结构化数据

<!-- FDE_STEP_RESULT_JSON_START -->
```json
{
  "viewFiles": [
    {
      "file": "DispatchMapView.vue",
      "responsibility": "基于地图看板实时展示所有车辆的位置、状态（空闲、排队、任务中、异常）、作业区域，支持缩放、点击查看车辆详情",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "OnsiteVehicleFilter.vue",
      "responsibility": "支持按车辆类型、状态（空闲/排队/任务中）、作业区域、距离远近等条件筛选车辆，便于调度员快速定位合适车辆",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "OnsiteDispatchDialog.vue",
      "responsibility": "调度员为选中的车辆分配任务，支持选择用车申请、输入作业点、选择优先级，并一键下发至司机移动端",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "OnsiteExceptionAlert.vue",
      "responsibility": "实时接收车辆异常告警（超速、禁入区域、异常停留、未授权入场等），支持调度员查看详情、处理告警、标记解决",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "TaskListView.vue",
      "responsibility": "司机查看个人任务列表，接收新任务通知，筛选和查看不同状态的任务",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P0"
    },
    {
      "file": "TaskDetailView.vue",
      "responsibility": "展示任务的详细信息，包括作业点位置、任务要求、物资信息等",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "NavigationView.vue",
      "responsibility": "从司机当前位置导航至指定作业点，实时显示路径和预计到达时间",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "SiteFeedbackView.vue",
      "responsibility": "司机在到达作业点后确认到达，并上传现场照片或备注信息",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "EntryCheckPanel.vue",
      "responsibility": "支持通过扫描车牌或预约二维码，自动核验车辆预约有效性及派车任务关联，快速得出入场许可结果",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "ReleaseManagementPanel.vue",
      "responsibility": "根据核验结果执行放行或拒绝操作，记录放行时间、车辆信息，并更新相关任务状态",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "AlertPanel.vue",
      "responsibility": "实时处理未授权入场、证照过期、异常停留等告警，支持告警确认、解除与上报",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "ReleaseRecordQueryView.vue",
      "responsibility": "按时间、车牌、车辆类型等条件检索放行记录，查看核验详情，支持导出用于审计追溯",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "StatisticsAnalysisView.vue",
      "responsibility": "提供车辆利用率、任务完成率、平均等待时长、空驶率、排队情况、外协车辆使用次数、异常入场记录等核心统计指标的图表展示与分析功能",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "ReportExportView.vue",
      "responsibility": "支持将统计分析结果导出为Excel、PDF等格式，便于管理人员存档、分发和进一步分析",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    },
    {
      "file": "ResourceAllocationView.vue",
      "responsibility": "基于历史数据与当前车辆使用情况，提供车辆资源配置优化建议和外协车辆费用管理参考",
      "source": "页面设计：页面清单 + 页面详情",
      "priority": "P1"
    }
  ],
  "pageDetailSpecs": [
    {
      "file": "DispatchMapView.vue",
      "layoutZones": [
        {
          "zone": "地图主区域",
          "content": "占据屏幕大部分空间的高德/百度地图，显示车辆标记、作业区域热力图、园区电子围栏"
        },
        {
          "zone": "顶部状态栏",
          "content": "车辆统计卡片（空闲/排队/任务中/异常数量）、刷新按钮、当前视图层级指示"
        },
        {
          "zone": "底部车辆预览面板",
          "content": "可收起/展开的卡片列表，显示当前地图视野内最近5辆车的摘要信息"
        }
      ],
      "uiStates": [
        {
          "state": "loading",
          "content": "地图底图加载中，显示旋转加载动画和“地图加载中...”文字，车辆标记暂不显示"
        },
        {
          "state": "empty",
          "content": "当前视野内无可用车辆，地图区域显示灰色遮罩和“当前区域无车辆”提示"
        },
        {
          "state": "error",
          "content": "地图API加载失败或网络异常，显示错误图标和“地图加载失败，请检查网络或稍后重试”，并提供重试按钮"
        },
        {
          "state": "success",
          "content": "地图正常显示，车辆标记按类型/状态着色，图例清晰，交互正常"
        },
        {
          "state": "vehicle_selected",
          "content": "点击车辆标记后该标记放大并高亮，底部面板展开显示该车辆的详细信息（车牌、司机、速度、状态、任务单号）"
        },
        {
          "state": "zoomed_in",
          "content": "地图缩放级别≥15时，车辆标记变为详细图标（含方向箭头），并显示车牌号缩写"
        }
      ],
      "keyInteractions": [
        "点击车辆标记 → 弹出信息气泡（含车辆基本信息），同时底部面板展开详情",
        "双击地图空白处 → 以点击位置为中心放大一级，并重新加载该区域车辆列表",
        "单指拖动地图 → 实时更新底部预览面板中的车辆列表，保持与视野同步",
        "点击顶部统计卡片中的状态数字（如“空闲 12”） → 自动过滤地图只显示该状态的车辆标记",
        "两指捏合缩放 → 车辆标记大小自适应，缩放级别低于12时合并重叠标记并显示数量角标"
      ]
    },
    {
      "file": "OnsiteVehicleFilter.vue",
      "layoutZones": [
        {
          "zone": "筛选条件区",
          "content": "位于页面顶部，包含车辆类型下拉框（叉车/牵引车/AGV）、状态多选按钮组、作业区域树形选择器、距离范围滑块"
        },
        {
          "zone": "结果列表区",
          "content": "位于页面中部，以卡片列表形式展示匹配车辆，每项包含车牌、类型、状态、当前位置、距调度员距离"
        },
        {
          "zone": "底部操作栏",
          "content": "悬浮于底部，包含“重置筛选”按钮、“选定派车”按钮（仅在勾选车辆后可用）"
        }
      ],
      "uiStates": [
        {
          "state": "loading",
          "content": "筛选条件保留用户选择，结果区显示骨架屏（3个灰色卡片脉冲动画）"
        },
        {
          "state": "empty",
          "content": "结果区显示空状态插图（放大镜+无结果文案）和“尝试调整筛选条件”引导文字"
        },
        {
          "state": "error",
          "content": "结果区显示错误提示（红色感叹号+“筛选项加载失败”），并提供“重试”按钮"
        },
        {
          "state": "success",
          "content": "正常展示筛选结果列表，每项右侧有复选框，可多选"
        },
        {
          "state": "filter_active",
          "content": "筛选条件区有任一条件被选中时，筛选条件区背景变为浅蓝色，底部显示“已筛选X项”标签"
        },
        {
          "state": "vehicle_selected",
          "content": "用户勾选至少一辆车后，底部“选定派车”按钮从灰色变为高亮蓝色，并显示已选数量"
        }
      ],
      "keyInteractions": [
        "点击车辆类型下拉选项 → 列表即时刷新，所选类型高亮，其他类型置灰",
        "拖动距离范围滑块（0-50km） → 滑块右侧数字实时更新，结果列表自动按距离排序并过滤超出范围的车辆",
        "点击结果列表中车辆的复选框 → 选中时复选框打勾并该行背景高亮；再次点击取消选中",
        "点击“重置筛选”按钮 → 所有筛选条件恢复默认值（类型=全部、状态=无、距离=50km），结果列表重新加载全部车辆",
        "点击“选定派车”按钮（至少选1辆车） → 触发派车弹窗（OnsiteDispatchDialog）并传入已选车辆ID数组"
      ]
    },
    {
      "file": "OnsiteDispatchDialog.vue",
      "layoutZones": [
        {
          "zone": "已选车辆展示区",
          "content": "位于弹窗顶部，显示已选车辆的车牌号、类型、当前位置，可点击“×”移除某辆车"
        },
        {
          "zone": "任务表单区",
          "content": "包含用车申请编号下拉选择（来自待分配申请列表）、作业点输入（支持地图选点或文字输入）、优先级单选组（高/中/低）、预计到达时间显示（自动计算）"
        },
        {
          "zone": "底部按钮区",
          "content": "左侧“取消”按钮，右侧“下发任务”主按钮，提交时显示加载状态"
        }
      ],
      "uiStates": [
        {
          "state": "loading",
          "content": "提交“下发任务”后：按钮变为禁用并显示转圈动画，同时显示“正在下发...”，弹窗不可关闭"
        },
        {
          "state": "empty",
          "content": "未选中任何车辆时弹窗不应被打开（此状态不会出现）；若用车申请列表为空，下拉框显示“暂无待分配申请”占位文字"
        },
        {
          "state": "error",
          "content": "提交失败：按钮恢复可用，弹窗顶部显示红色错误横幅（如“下发失败：网络异常，请重试”）"
        },
        {
          "state": "success",
          "content": "提交成功：弹窗自动关闭，并在页面右下角弹出绿色成功通知（“已成功派车给【车牌号】”）"
        },
        {
          "state": "form_incomplete",
          "content": "必填项（用车申请、作业点）未填写时，“下发任务”按钮为灰色禁用状态，且鼠标悬停显示tooltip提示“请完成所有必填项”"
        },
        {
          "state": "submitting",
          "content": "提交过程中，表单所有输入组件变为只读，防止重复操作"
        }
      ],
      "keyInteractions": [
        "点击用车申请下拉框 → 展开列表显示所有状态为“待派车”的申请编号及创建时间，选中后自动填充作业点（若申请单已有作业位置）",
        "在作业点输入框点击地图图标 → 弹出一个微型地图选择器，用户可点击地图上的位置进行定位然后自动填入坐标和地址",
        "切换优先级单选按钮 → 下方预计到达时间动态变化（高优先级预估时间缩短30%）",
        "点击“下发任务”按钮（表单有效时） → 弹出二次确认对话框（显示派车摘要：车辆+申请+作业点+优先级），确认后调用后端API并进入loading状态",
        "点击已选车辆右侧的“×”图标 → 该车辆从列表移除，若移除后车辆数变为0则自动关闭弹窗并返回筛选页面"
      ]
    },
    {
      "file": "NavigationView.vue",
      "layoutZones": [
        {
          "zone": "顶部导航信息栏",
          "content": "显示目的地名称、预计到达时间和剩余距离"
        },
        {
          "zone": "地图区域",
          "content": "高德/百度地图组件，显示当前位置到目的地的路径，实时更新位置标记"
        },
        {
          "zone": "底部操作栏",
          "content": "包含‘开始导航’、‘结束导航’、‘重新规划’按钮"
        }
      ],
      "uiStates": [
        {
          "state": "loading",
          "content": "地图加载中，显示加载动画"
        },
        {
          "state": "empty",
          "content": "无路径数据，提示‘请输入目的地或选择作业点’"
        },
        {
          "state": "error",
          "content": "定位失败或网络异常，显示错误提示和重试按钮"
        },
        {
          "state": "success",
          "content": "正常导航中，路径高亮，实时更新车辆位置和预计到达时间"
        },
        {
          "state": "arrived",
          "content": "到达目的地附近，弹出确认到达对话框，自动跳转到现场反馈页面"
        }
      ],
      "keyInteractions": [
        "点击‘开始导航’ → 请求路径规划，地图显示最佳路径，开始实时导航",
        "点击‘结束导航’ → 确认结束导航，弹出是否到达确认提示",
        "点击‘重新规划’ → 重新请求路径，避开拥堵或关闭路段",
        "地图长按 → 查看路径详情，包括途经节点和预计耗时"
      ]
    },
    {
      "file": "SiteFeedbackView.vue",
      "layoutZones": [
        {
          "zone": "顶部状态栏",
          "content": "显示当前作业点名称和‘已到达’标签"
        },
        {
          "zone": "照片上传区",
          "content": "拍照或从相册选择，支持多张照片预览和删除"
        },
        {
          "zone": "备注输入区",
          "content": "文本输入框，支持输入现场备注信息"
        },
        {
          "zone": "底部确认栏",
          "content": "‘确认到达并提交’按钮，提交后显示结果"
        }
      ],
      "uiStates": [
        {
          "state": "loading",
          "content": "正在上传照片或提交反馈，显示进度条"
        },
        {
          "state": "empty",
          "content": "尚未上传任何照片和备注，提示‘请添加现场照片’"
        },
        {
          "state": "error",
          "content": "提交失败，显示错误原因和重试按钮"
        },
        {
          "state": "success",
          "content": "反馈提交成功，显示成功图标和‘已反馈’文字"
        },
        {
          "state": "confirmed",
          "content": "用户已点击确认到达，但尚未提交反馈，显示灰色‘已确认’状态"
        }
      ],
      "keyInteractions": [
        "点击‘确认到达’ → 弹出确认对话框，确认后标志变为‘已到达’",
        "点击拍照按钮 → 打开手机相机，拍照后自动添加到照片列表",
        "点击备注输入框 → 弹出键盘，实时保存草稿",
        "点击‘确认到达并提交’ → 验证必填项（至少一张照片），上传数据；成功后跳转回任务列表"
      ]
    },
    {
      "file": "EntryCheckPanel.vue",
      "layoutZones": [
        {
          "zone": "扫描区域",
          "content": "摄像头实时预览，自动识别车牌或二维码，显示识别结果"
        },
        {
          "zone": "核验结果展示区",
          "content": "显示核验通过/不通过状态、车辆信息、任务关联信息"
        },
        {
          "zone": "手动输入区",
          "content": "车牌号输入框和‘手动核验’按钮，用于摄像头无法识别时备用"
        }
      ],
      "uiStates": [
        {
          "state": "loading",
          "content": "正在扫描或核验中，显示扫描动画和‘请稍候’"
        },
        {
          "state": "empty",
          "content": "未开始扫描，提示‘将摄像头对准车牌或二维码’"
        },
        {
          "state": "error",
          "content": "核验失败（如未预约、任务不匹配），显示失败原因和‘重新扫描’按钮"
        },
        {
          "state": "success",
          "content": "核验通过，显示绿色‘允许入场’和车辆信息"
        },
        {
          "state": "scanning",
          "content": "正在自动识别车牌或二维码，边框高亮显示识别区域"
        },
        {
          "state": "verified",
          "content": "已成功完成一次核验，结果保持在屏幕上，等待下次扫描"
        }
      ],
      "keyInteractions": [
        "自动扫描车牌 → 识别车牌号，自动触发核验请求",
        "手动输入车牌号 → 点击‘手动核验’按钮，发起核验",
        "核验通过 → 显示入场许可二维码，可点击‘打印凭条’",
        "核验不通过 → 显示具体原因并高亮错误项，提供‘联系管理人员’快速入口"
      ]
    },
    {
      "file": "ReleaseManagementPanel.vue",
      "layoutZones": [
        {
          "zone": "查询过滤区",
          "content": "包含时间范围、车牌号、车辆类型等筛选条件输入框，以及搜索/重置按钮"
        },
        {
          "zone": "放行操作区",
          "content": "展示当前待核验车辆信息（车牌、车型、核验结果），提供放行、拒绝按钮，以及放行/拒绝备注输入框"
        },
        {
          "zone": "放行记录列表区",
          "content": "以表格形式展示近期放行记录，包含放行时间、车牌、车辆类型、核验结果、操作人、状态（已放行/已拒绝）"
        }
      ],
      "uiStates": [
        {
          "state": "loading",
          "content": "列表区域显示骨架屏或旋转加载图标，操作按钮禁用"
        },
        {
          "state": "empty",
          "content": "列表区域显示‘暂无放行记录’提示，操作区显示默认占位信息"
        },
        {
          "state": "error",
          "content": "列表区域显示错误提示（如‘数据加载失败，请重试’），操作区保持上次有效状态或隐藏"
        },
        {
          "state": "success",
          "content": "正常显示所有区域数据，操作区根据当前待核验车辆状态显示对应按钮"
        },
        {
          "state": "pending",
          "content": "操作区显示待核验车辆信息，放行按钮和拒绝按钮均可用，列表区正常显示"
        },
        {
          "state": "rejected",
          "content": "操作区显示已拒绝信息（含拒绝原因），放行按钮禁用，拒绝按钮变为‘撤销拒绝’"
        }
      ],
      "keyInteractions": [
        "点击放行按钮 → 弹出确认对话框，点击确认后提交放行请求，列表刷新并显示新记录，操作区切换到下一个待核验车辆",
        "点击拒绝按钮 → 弹出拒绝原因输入框（必填），提交后列表新增拒绝记录，操作区更新状态",
        "点击列表行 → 高亮选中行，操作区显示对应记录的详情（只读）",
        "修改筛选条件后点击查询 → 列表重新加载匹配数据，操作区重置为默认待核验状态"
      ]
    },
    {
      "file": "AlertPanel.vue",
      "layoutZones": [
        {
          "zone": "告警筛选区",
          "content": "包含告警类型（未授权、证照过期、异常停留等）、状态（新告警、已确认、已解除、已上报）、时间范围等筛选条件"
        },
        {
          "zone": "告警列表区",
          "content": "以列表形式显示告警事件，每项包含时间、车辆信息、告警类型、状态、操作按钮（确认、解除、上报）"
        },
        {
          "zone": "告警详情/操作区",
          "content": "展示选中告警的详细信息（车辆图片、证照图片、停留时长等），并提供批量操作按钮（批量确认、批量解除）"
        }
      ],
      "uiStates": [
        {
          "state": "loading",
          "content": "列表区域显示加载指示器，操作按钮不可用"
        },
        {
          "state": "empty",
          "content": "列表区域显示‘无告警事件’，详情区显示‘请选择告警’提示"
        },
        {
          "state": "error",
          "content": "列表区域显示错误信息（如‘获取告警数据失败’），详情区清空"
        },
        {
          "state": "success",
          "content": "正常显示所有区域，根据选中告警显示相应按钮（新告警显示确认、解除；已确认显示解除、上报等）"
        },
        {
          "state": "new",
          "content": "告警列表项标记为红色‘新’标签，操作区显示‘确认’、‘解除’、‘上报’按钮（全部可用）"
        },
        {
          "state": "acknowledged",
          "content": "告警列表项状态显示为‘已确认’，操作区显示‘解除’、‘上报’按钮，‘确认’按钮隐藏"
        },
        {
          "state": "escalated",
          "content": "告警列表项状态显示为‘已上报’，操作区仅显示‘解除’按钮，且上报按钮禁用"
        }
      ],
      "keyInteractions": [
        "点击告警列表中的某一行 → 右侧详情区显示该告警的完整信息，同时操作按钮根据状态更新",
        "点击‘确认’按钮 → 确认该告警（状态变为已确认），列表刷新，操作按钮更新",
        "点击‘解除’按钮 → 弹出确认对话框，确认后告警状态变为已解除，列表刷新",
        "点击‘上报’按钮 → 弹出上级处理人选择对话框，提交后状态变为已上报",
        "勾选多条告警后点击批量确认/批量解除 → 对选中的告警执行批量操作，列表实时更新"
      ]
    },
    {
      "file": "ReleaseRecordQueryView.vue",
      "layoutZones": [
        {
          "zone": "查询条件区",
          "content": "包含入厂时间范围、出厂时间范围（可选）、车牌号输入框、车辆类型下拉选择、放行结果下拉选择（全部/已放行/已拒绝），以及查询和重置按钮"
        },
        {
          "zone": "查询结果列表区",
          "content": "以表格形式展示符合条件的放行记录，包含序号、车牌号、车辆类型、入厂时间、放行时间、放行结果、操作人、操作列（查看详情）"
        },
        {
          "zone": "导出操作区",
          "content": "位于列表上方或右侧，提供‘导出全部’、‘导出选中’按钮，以及导出格式选择（Excel/CSV）"
        }
      ],
      "uiStates": [
        {
          "state": "loading",
          "content": "列表区域显示加载动画，查询按钮显示‘查询中…’并禁用"
        },
        {
          "state": "empty",
          "content": "列表区域显示‘未查询到相关记录，请调整查询条件’，查询条件区保留用户输入"
        },
        {
          "state": "error",
          "content": "列表区域显示错误提示（如‘查询失败，请稍后重试’），并显示重试按钮"
        },
        {
          "state": "success",
          "content": "列表正常显示查询结果，底部显示分页组件"
        },
        {
          "state": "exporting",
          "content": "导出按钮显示‘导出中…’并禁用，列表区域上方显示导出进度条（如‘正在导出，请勿关闭页面’）"
        }
      ],
      "keyInteractions": [
        "填写查询条件后点击‘查询’ → 列表显示加载状态，完成查询后展示结果列表，若结果为空则显示空状态提示",
        "点击列表行中的‘查看详情’ → 弹出详情弹窗，展示该记录的完整核验信息（包括车辆照片、证照、核验结果等）",
        "点击‘导出全部’ → 根据当前查询条件导出所有记录，下载文件（Excel/CSV）至本地",
        "勾选列表中的记录后点击‘导出选中’ → 仅导出勾选的记录",
        "点击重置按钮 → 清空所有查询条件，并自动触发一次默认查询（显示最近一天的记录）"
      ]
    },
    {
      "file": "StatisticsAnalysisView.vue",
      "layoutZones": [
        {
          "zone": "筛选条件区",
          "content": "位于页面顶部，提供日期范围选择器、车辆类型下拉框、任务状态过滤等筛选控件，支持快速选择预设时段（今日、本周、本月、自定义）"
        },
        {
          "zone": "KPI指标区",
          "content": "紧接筛选区下方，以卡片形式展示车辆利用率、任务完成率、平均等待时长、空驶率、排队情况、外协车辆使用次数、异常入场记录等关键数值，每个卡片包含图标、数值和环比变化指示"
        },
        {
          "zone": "图表分析区",
          "content": "页面中部，使用折线图、柱状图、饼图等可视化组件展示各指标趋势及分布，支持图表联动与钻取，图表标题显示当前筛选范围"
        },
        {
          "zone": "明细数据表格区",
          "content": "页面底部，以表格形式展示每辆车的详细运营数据，支持分页、排序和自定义列，表格行可点击查看详情弹窗"
        }
      ],
      "uiStates": [
        {
          "state": "loading",
          "content": "骨架屏占位，筛选控件禁用，KPI卡片显示加载动画，图表区域显示旋转加载图标"
        },
        {
          "state": "empty",
          "content": "提示文字“暂无运营数据，请调整筛选条件或确认数据源”，所有图表区域显示空状态插画，表格显示空行"
        },
        {
          "state": "error",
          "content": "顶部红色错误横幅提示“数据加载失败，请稍后重试”，筛选控件可用，图表区显示错误图标与重试按钮"
        },
        {
          "state": "success",
          "content": "正常显示所有数据和图表，KPI卡片数值以动画递增呈现，图表使用完整配色"
        },
        {
          "state": "filterApplied",
          "content": "筛选条件区显示已选条件标签，清除按钮可见，图表标题追加当前筛选描述，KPI卡片数值相应更新"
        }
      ],
      "keyInteractions": [
        "选择日期范围 → 所有KPI卡片和图表的数值、趋势线即时刷新，表格数据重新加载",
        "点击KPI卡片 → 弹窗展示该指标的详细趋势图及同期对比数据",
        "点击图表数据点 → 在图表附近显示Tooltip，包含该点的具体数值与时间戳",
        "切换车辆类型下拉 → 过滤数据并更新所有区域，同时保留其他筛选条件"
      ]
    },
    {
      "file": "ReportExportView.vue",
      "layoutZones": [
        {
          "zone": "导出配置区",
          "content": "页面左侧或顶部区域，包含导出格式选择（Excel / PDF）、报表模板选择（简洁报表、详细报表）、时间范围选择、数据范围（全部车辆/筛选车辆）等设置项"
        },
        {
          "zone": "预览区",
          "content": "页面中央，根据当前配置实时显示报表预览缩略图或示例数据表格，支持分页预览，预览内容随配置变化动态更新"
        },
        {
          "zone": "操作区",
          "content": "页面底部，包含“导出报表”主按钮、“取消”次按钮，以及进度条（导出中）状态，下方可选设置项如文件名自定义、是否包含图表等"
        }
      ],
      "uiStates": [
        {
          "state": "loading",
          "content": "预览区显示加载骨架，按钮禁用且显示“正在生成预览”，配置区所有控件可用但轻微置灰"
        },
        {
          "state": "empty",
          "content": "提示“未找到可导出的报表数据”，预览区显示空状态提示，导出按钮禁用"
        },
        {
          "state": "error",
          "content": "预览区顶部显示错误消息“预览生成失败”，导出按钮可用但点击后提示“请先解决错误”，配置区高亮错误项"
        },
        {
          "state": "success",
          "content": "预览区正常显示报表内容，导出按钮亮起可点击，点击后开始异步导出"
        },
        {
          "state": "exporting",
          "content": "操作区进度条显示百分比，按钮文字变为“导出中...”，配置区锁定不可修改，完成后自动变为成功状态"
        },
        {
          "state": "exportSuccess",
          "content": "顶部绿色提示“导出成功”，自动触发浏览器下载，按钮恢复为“导出报表”，并提供“再次导出”链接"
        }
      ],
      "keyInteractions": [
        "切换导出格式（Excel/PDF） → 预览区立即更新为对应格式的模拟样式（如Excel显示网格，PDF显示分页）",
        "点击“导出报表”按钮 → 触发后台生成任务，操作区显示进度条，按钮禁用，生成完成后自动下载文件",
        "选择时间范围 → 预览区数据刷新，并显示所选时间段的统计摘要",
        "点击预览区某行 → 高亮该行并在右侧弹窗显示该报表项的详细信息"
      ]
    },
    {
      "file": "ResourceAllocationView.vue",
      "layoutZones": [
        {
          "zone": "优化建议概览区",
          "content": "页面顶部，以卡片形式展示系统自动生成的资源配置优化建议摘要，包括建议标题、预期效果（节省成本/提升利用率）、置信等级和推荐优先级，卡片可点击展开详情"
        },
        {
          "zone": "车辆使用热力图区",
          "content": "页面中部左侧，使用热力图展示各时间段各车辆的使用频率，横轴为时间（小时/天），纵轴为车辆或车组，颜色深浅表示使用强度，帮助识别闲置与繁忙车辆"
        },
        {
          "zone": "详细建议列表区",
          "content": "页面中部右侧或下方，以列表形式逐条展示具体优化建议，每条包含车辆编号、建议类型（增加/减少/外协）、依据数据（当前利用率、任务量）、预估收益与风险评估，支持批量操作"
        },
        {
          "zone": "外协费用参考区",
          "content": "页面底部，以表格或图表对比自营车辆成本与外协车辆费用，展示历史外协使用次数与费用趋势，辅助决策是否扩大外协比例"
        }
      ],
      "uiStates": [
        {
          "state": "loading",
          "content": "概览区显示骨架卡片，热力图区显示加载动画，列表区显示占位行，外协费用区显示旋转图标"
        },
        {
          "state": "empty",
          "content": "提示“当前无资源配置优化建议，可能数据不足或配置已最优”，所有区域显示空状态图标，建议列表显示“暂无建议”"
        },
        {
          "state": "error",
          "content": "页面顶部错误横幅“计算服务异常，请稍后重试”，建议概览区显示错误提示，操作按钮均可用但点击提示服务不可用"
        },
        {
          "state": "success",
          "content": "正常显示所有优化建议和图表，概览卡片带有绿色/黄色/红色标签表示建议优先度，热力图使用色阶正常渲染"
        },
        {
          "state": "calculationInProgress",
          "content": "概览区显示“正在计算优化方案...”的进度提示，热力图显示当前数据，列表区显示“等待计算结果”，外协费用区保留上次数据"
        }
      ],
      "keyInteractions": [
        "点击优化建议概览卡片 → 下方详细列表自动滚动至对应位置并高亮该建议条目",
        "点击详细列表中的“应用建议”按钮 → 弹出确认对话框，确认后提交变更请求并刷新概览区状态",
        "切换热力图时间粒度（日/周/月） → 热力图重新绘制，同时详细建议列表根据新粒度重新排序",
        "勾选多条建议并点击“批量导出” → 下载包含所选建议的Excel文件，文件名包含当前时间",
        "点击外协费用趋势图上的数据点 → 显示该时间点的具体费用构成明细"
      ]
    },
    {
      "file": "OnsiteExceptionAlert.vue",
      "layoutZones": [
        {
          "zone": "告警列表",
          "content": "显示实时告警条目，包含告警类型、车辆、时间、状态标签，支持按类型筛选"
        },
        {
          "zone": "告警详情",
          "content": "选中告警后展开显示详细信息：车辆信息、位置、速度、时间戳、告警原因等"
        },
        {
          "zone": "操作面板",
          "content": "底部固化的处理按钮区域，包括标记解决、忽略、转派等操作"
        }
      ],
      "uiStates": [
        {
          "state": "loading",
          "content": "全屏加载动画，骨架屏占位列表"
        },
        {
          "state": "empty",
          "content": "空状态插图，文字提示'暂无告警'，附带刷新按钮"
        },
        {
          "state": "error",
          "content": "错误提示条，显示网络异常或加载失败，重试按钮"
        },
        {
          "state": "success",
          "content": "正常列表显示，告警条目按时间倒序排列"
        },
        {
          "state": "alert_detected",
          "content": "列表中存在未处理告警，条目左侧显示红色脉冲圆点"
        },
        {
          "state": "processing",
          "content": "点击处理按钮后按钮变为加载状态，显示'处理中...'"
        }
      ],
      "keyInteractions": [
        "点击告警条目 → 列表右侧/下方展开详情面板，高亮选中行",
        "点击'标记解决'按钮 → 弹出确认弹窗，确认后按钮变为'已解决'，列表项状态更新",
        "点击筛选标签(超速/禁入/异常停留) → 刷新列表，仅显示对应类型告警",
        "下拉列表 → 触发刷新，获取最新告警数据，显示加载指示器",
        "左右滑动告警条目 → 显示快速处理(忽略/标记解决)按钮"
      ]
    },
    {
      "file": "TaskListView.vue",
      "layoutZones": [
        {
          "zone": "顶部筛选栏",
          "content": "包含任务状态标签(全部/待执行/进行中/已完成)、关键字搜索框、排序选项"
        },
        {
          "zone": "任务列表",
          "content": "卡片式列表，每项显示任务编号、目的地、时间、状态标签，支持点击进入详情"
        },
        {
          "zone": "新任务通知",
          "content": "顶部横幅区域，当有新任务推送时显示通知横幅，可关闭"
        }
      ],
      "uiStates": [
        {
          "state": "loading",
          "content": "列表区域显示骨架屏，顶部筛选栏正常显示"
        },
        {
          "state": "empty",
          "content": "空状态插图，文字'暂无任务'，附加'刷新'按钮"
        },
        {
          "state": "error",
          "content": "列表区域显示网络错误提示，'点击重试'按钮"
        },
        {
          "state": "success",
          "content": "列表正常显示任务卡片，每张卡片带状态色条"
        },
        {
          "state": "new_task_notification",
          "content": "顶部横幅滑动出现，显示'您有X条新任务'，右侧'查看'按钮"
        },
        {
          "state": "task_updated",
          "content": "列表项后部出现'已更新'徽章，表示任务信息有变更"
        }
      ],
      "keyInteractions": [
        "点击状态标签(待执行/进行中) → 列表刷新，仅显示对应状态任务",
        "下拉列表 → 触发刷新，顶部显示刷新动画，更新列表",
        "点击任务卡片 → 跳转至任务详情页(TaskDetailView)，传递任务ID参数",
        "接收推送通知 → 顶部横幅弹出，5秒后自动消失，点击横幅跳转至新任务",
        "长按任务卡片 → 弹出操作菜单(分享/取消/备注)"
      ]
    },
    {
      "file": "TaskDetailView.vue",
      "layoutZones": [
        {
          "zone": "任务头部信息",
          "content": "显示任务编号、任务类型、当前状态、优先级标签，以及司机/车辆信息"
        },
        {
          "zone": "作业点详情",
          "content": "嵌入式地图显示作业点位置标记，下方列出地址、联系人、预计到达时间"
        },
        {
          "zone": "物资/要求清单",
          "content": "可折叠列表，展示任务要求的物资清单或作业要求，每项带勾选框"
        },
        {
          "zone": "底部操作栏",
          "content": "根据任务状态显示不同按钮：开始任务、完成任务、上传凭证等"
        }
      ],
      "uiStates": [
        {
          "state": "loading",
          "content": "全屏加载动画，内容区域骨架占位"
        },
        {
          "state": "empty",
          "content": "数据缺失提示，'任务信息未找到'，返回列表按钮"
        },
        {
          "state": "error",
          "content": "错误提示卡片，'加载任务详情失败'，重试按钮"
        },
        {
          "state": "success",
          "content": "正常展示所有区域，地图正常加载，任务状态显示"
        },
        {
          "state": "task_assigned",
          "content": "底部操作栏显示'开始任务'按钮，任务状态标签为'待执行'"
        },
        {
          "state": "task_in_progress",
          "content": "底部操作栏显示'完成任务'和'暂停'按钮，地图显示实时导航"
        },
        {
          "state": "task_completed",
          "content": "底部操作栏显示'重新打开'和'查看报告'，任务状态标签为'已完成'"
        },
        {
          "state": "pending_upload",
          "content": "底部操作栏出现'上传凭证'按钮，且有红色角标提示未上传数量"
        }
      ],
      "keyInteractions": [
        "点击地图标记 → 弹出信息窗，显示详细地址和导航入口",
        "点击'开始任务'按钮 → 弹出确认弹窗，确认后状态变为进行中，底部按钮变化",
        "点击物资清单中的勾选框 → 切换完成状态，进度条更新",
        "点击'完成任务'按钮 → 校验必填项(如凭证)，弹出拍照/上传组件",
        "点击'上传凭证'按钮 → 唤起相机/相册选择，上传后显示缩略图和进度"
      ]
    }
  ],
  "componentFiles": [
    {
      "file": "VehicleInfoCard.vue",
      "responsibility": "通用车辆信息卡片，展示车牌、类型、状态、当前位置、距离等摘要信息，支持选中和点击交互",
      "reusedBy": [
        "DispatchMapView.vue",
        "OnsiteVehicleFilter.vue",
        "OnsiteDispatchDialog.vue"
      ],
      "props": [
        {
          "name": "vehicle",
          "type": "Object",
          "required": true,
          "default": "",
          "description": "车辆数据对象，包含plate, type, status, location, distance等字段"
        },
        {
          "name": "selectable",
          "type": "Boolean",
          "required": false,
          "default": "false",
          "description": "是否显示复选框，允许选中/取消选中"
        },
        {
          "name": "selected",
          "type": "Boolean",
          "required": false,
          "default": "false",
          "description": "当前选中状态（仅当selectable为true时生效）"
        },
        {
          "name": "highlight",
          "type": "Boolean",
          "required": false,
          "default": "false",
          "description": "是否高亮显示（用于地图选中车辆时联动）"
        }
      ],
      "events": [
        {
          "name": "click",
          "payload": "vehicle: Object",
          "description": "点击卡片区域时触发，传递当前车辆对象"
        },
        {
          "name": "select-change",
          "payload": "{ vehicle: Object, selected: Boolean }",
          "description": "复选框状态变化时触发"
        }
      ],
      "slots": []
    },
    {
      "file": "StatusBadge.vue",
      "responsibility": "通用状态标签，显示车辆或任务的状态文本及对应颜色，支持不同尺寸和自定义颜色",
      "reusedBy": [
        "DispatchMapView.vue",
        "OnsiteVehicleFilter.vue",
        "OnsiteDispatchDialog.vue",
        "TaskListView.vue",
        "AlertPanel.vue",
        "OnsiteExceptionAlert.vue"
      ],
      "props": [
        {
          "name": "status",
          "type": "String",
          "required": true,
          "default": "",
          "description": "状态枚举值，如'空闲','排队','任务中','异常','已到达','已完成'等"
        },
        {
          "name": "size",
          "type": "String",
          "required": false,
          "default": "medium",
          "description": "标签尺寸：small / medium / large"
        },
        {
          "name": "customColor",
          "type": "String",
          "required": false,
          "default": "",
          "description": "自定义状态颜色（覆盖默认映射），格式为十六进制或CSS色值"
        }
      ],
      "events": [],
      "slots": []
    },
    {
      "file": "TaskCard.vue",
      "responsibility": "任务摘要卡片，展示任务编号、状态、作业点、截止时间等关键信息，支持点击和长按操作",
      "reusedBy": [
        "TaskListView.vue",
        "TaskDetailView.vue"
      ],
      "props": [
        {
          "name": "task",
          "type": "Object",
          "required": true,
          "default": "",
          "description": "任务数据对象，包含id, title, status, location, deadline, assignee等字段"
        },
        {
          "name": "compact",
          "type": "Boolean",
          "required": false,
          "default": "false",
          "description": "紧凑模式（用于列表密集展示时）"
        }
      ],
      "events": [
        {
          "name": "click",
          "payload": "task: Object",
          "description": "点击卡片时触发"
        },
        {
          "name": "longpress",
          "payload": "task: Object",
          "description": "长按卡片时触发"
        }
      ],
      "slots": [
        {
          "name": "default",
          "description": "卡片主体内容外部扩展区域，可用于添加自定义操作按钮或状态标签"
        }
      ]
    },
    {
      "file": "AlertItem.vue",
      "responsibility": "告警条目组件，显示告警类型、时间、车辆/人员、详情摘要，并提供确认、解除、上报等操作按钮",
      "reusedBy": [
        "OnsiteExceptionAlert.vue",
        "AlertPanel.vue"
      ],
      "props": [
        {
          "name": "alert",
          "type": "Object",
          "required": true,
          "default": "",
          "description": "告警数据对象，包含type, time, source, description, severity等"
        },
        {
          "name": "actions",
          "type": "Array",
          "required": false,
          "default": "['confirm','resolve']",
          "description": "可用操作按钮名称列表，支持'confirm','resolve','report'"
        }
      ],
      "events": [
        {
          "name": "action",
          "payload": "{ action: String, alert: Object }",
          "description": "点击某个操作按钮时触发，携带动作名称及告警对象"
        }
      ],
      "slots": []
    },
    {
      "file": "PagedList.vue",
      "responsibility": "通用分页列表容器，内置加载、空状态、错误状态，支持自定义列表项渲染",
      "reusedBy": [
        "ReleaseRecordQueryView.vue",
        "TaskListView.vue",
        "OnsiteVehicleFilter.vue"
      ],
      "props": [
        {
          "name": "data",
          "type": "Array",
          "required": true,
          "default": "",
          "description": "列表数据源"
        },
        {
          "name": "loading",
          "type": "Boolean",
          "required": false,
          "default": "false",
          "description": "是否处于加载状态"
        },
        {
          "name": "emptyText",
          "type": "String",
          "required": false,
          "default": "暂无数据",
          "description": "数据为空时的提示文字"
        },
        {
          "name": "total",
          "type": "Number",
          "required": false,
          "default": "0",
          "description": "总记录数（用于分页）"
        },
        {
          "name": "pageSize",
          "type": "Number",
          "required": false,
          "default": "10",
          "description": "每页条数"
        }
      ],
      "events": [
        {
          "name": "page-change",
          "payload": "page: Number",
          "description": "切换页码时触发"
        }
      ],
      "slots": [
        {
          "name": "item",
          "description": "用于渲染每个列表项的自定义内容，绑定作用域 slot props: { item, index }"
        },
        {
          "name": "empty",
          "description": "数据为空时展示的定制内容（覆盖默认空状态）"
        }
      ]
    },
    {
      "file": "MapLocationPicker.vue",
      "responsibility": "地图选点组件，弹出微型地图供用户选择地理位置，返回经纬度和地址文本",
      "reusedBy": [
        "OnsiteDispatchDialog.vue",
        "NavigationView.vue"
      ],
      "props": [
        {
          "name": "initialLocation",
          "type": "Object",
          "required": false,
          "default": "null",
          "description": "默认选中的位置 { lng, lat }"
        },
        {
          "name": "readonly",
          "type": "Boolean",
          "required": false,
          "default": "false",
          "description": "是否只读（仅显示地图，不可选点）"
        },
        {
          "name": "height",
          "type": "String",
          "required": false,
          "default": "400px",
          "description": "地图容器高度"
        }
      ],
      "events": [
        {
          "name": "location-selected",
          "payload": "{ lng: Number, lat: Number, address: String }",
          "description": "用户选择位置后触发，返回坐标和地址"
        }
      ],
      "slots": []
    },
    {
      "file": "ConfirmDialog.vue",
      "responsibility": "通用确认对话框，包含标题、消息、确认和取消按钮，支持异步加载状态",
      "reusedBy": [
        "OnsiteDispatchDialog.vue",
        "NavigationView.vue",
        "OnsiteExceptionAlert.vue"
      ],
      "props": [
        {
          "name": "visible",
          "type": "Boolean",
          "required": true,
          "default": "false",
          "description": "对话框是否可见"
        },
        {
          "name": "title",
          "type": "String",
          "required": false,
          "default": "确认操作",
          "description": "对话框标题"
        },
        {
          "name": "message",
          "type": "String",
          "required": false,
          "default": "确定要执行此操作吗？",
          "description": "确认消息文本"
        },
        {
          "name": "confirmText",
          "type": "String",
          "required": false,
          "default": "确认",
          "description": "确认按钮文字"
        },
        {
          "name": "cancelText",
          "type": "String",
          "required": false,
          "default": "取消",
          "description": "取消按钮文字"
        },
        {
          "name": "loading",
          "type": "Boolean",
          "required": false,
          "default": "false",
          "description": "确认按钮是否显示加载状态"
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
          "description": "用户点击取消或关闭对话框时触发"
        }
      ],
      "slots": []
    },
    {
      "file": "MediaUploader.vue",
      "responsibility": "媒体文件上传组件，支持照片/视频选择、预览、删除，可限制文件类型和数量",
      "reusedBy": [
        "SiteFeedbackView.vue",
        "ReleaseManagementPanel.vue"
      ],
      "props": [
        {
          "name": "accept",
          "type": "String",
          "required": false,
          "default": "image/*",
          "description": "允许的文件类型，如'image/*','video/*'"
        },
        {
          "name": "multiple",
          "type": "Boolean",
          "required": false,
          "default": "true",
          "description": "是否允许多选"
        },
        {
          "name": "maxCount",
          "type": "Number",
          "required": false,
          "default": "9",
          "description": "最多可上传文件数量"
        },
        {
          "name": "maxSize",
          "type": "Number",
          "required": false,
          "default": "10485760",
          "description": "单个文件大小上限（字节），默认10MB"
        },
        {
          "name": "disabled",
          "type": "Boolean",
          "required": false,
          "default": "false",
          "description": "是否禁用上传"
        }
      ],
      "events": [
        {
          "name": "files-selected",
          "payload": "files: File[]",
          "description": "用户选择文件后触发（尚未上传），传递文件列表"
        },
        {
          "name": "file-removed",
          "payload": "file: File",
          "description": "用户删除已选文件时触发"
        }
      ],
      "slots": [
        {
          "name": "trigger",
          "description": "自定义上传触发区域（默认是一个加号图标按钮）"
        }
      ]
    }
  ],
  "mockDataFiles": [
    {
      "file": "mockDispatch.js",
      "content": "模拟派车调度相关接口数据，包括调度工作台、用车申请列表、审批用车申请、下发派车任务等",
      "usedBy": [
        "DispatchMapView.vue",
        "OnsiteVehicleFilter.vue",
        "OnsiteDispatchDialog.vue",
        "OnsiteExceptionAlert.vue"
      ],
      "schema": [
        {
          "field": "id",
          "type": "string",
          "description": "业务对象标识"
        },
        {
          "field": "applicant",
          "type": "string",
          "description": "申请人姓名"
        },
        {
          "field": "status",
          "type": "string",
          "description": "审批状态：pending/approved/rejected"
        },
        {
          "field": "vehicleType",
          "type": "string",
          "description": "所需车辆类型"
        },
        {
          "field": "priority",
          "type": "string",
          "description": "优先级：high/medium/low"
        },
        {
          "field": "applicationId",
          "type": "string",
          "description": "用车申请唯一标识"
        },
        {
          "field": "selectedVehicle",
          "type": "string",
          "description": "派车车辆ID"
        },
        {
          "field": "dispatchRemark",
          "type": "string",
          "description": "派车额外说明"
        }
      ]
    },
    {
      "file": "mockTasks.js",
      "content": "模拟任务管理相关接口数据，包括查询任务列表、更新任务状态",
      "usedBy": [
        "TaskListView.vue",
        "TaskDetailView.vue"
      ],
      "schema": [
        {
          "field": "taskId",
          "type": "string",
          "description": "任务ID"
        },
        {
          "field": "status",
          "type": "string",
          "description": "任务状态：dispatched/cancelled/abnormal/redispatched"
        },
        {
          "field": "reason",
          "type": "string",
          "description": "状态变更原因"
        },
        {
          "field": "newVehiclePlate",
          "type": "string",
          "description": "重新派车时的车牌号"
        },
        {
          "field": "newDriverName",
          "type": "string",
          "description": "重新派车时的司机姓名"
        },
        {
          "field": "applicant",
          "type": "string",
          "description": "申请人"
        },
        {
          "field": "applyTime",
          "type": "string",
          "description": "申请时间"
        }
      ]
    },
    {
      "file": "mockAlerts.js",
      "content": "模拟异常告警相关接口数据，包括查询异常告警列表、处理异常告警",
      "usedBy": [
        "AlertPanel.vue",
        "OnsiteExceptionAlert.vue"
      ],
      "schema": [
        {
          "field": "id",
          "type": "string",
          "description": "告警ID"
        },
        {
          "field": "exceptionType",
          "type": "string",
          "description": "异常类型：排队超时/重复派车/车辆故障/位置偏移"
        },
        {
          "field": "exceptionDescription",
          "type": "string",
          "description": "异常描述"
        },
        {
          "field": "vehiclePlate",
          "type": "string",
          "description": "车辆牌照"
        },
        {
          "field": "driverName",
          "type": "string",
          "description": "司机姓名"
        },
        {
          "field": "status",
          "type": "string",
          "description": "状态：待处理/处理中/已处理"
        },
        {
          "field": "handlerName",
          "type": "string",
          "description": "处理人"
        }
      ]
    },
    {
      "file": "mockStatistics.js",
      "content": "模拟统计分析相关接口数据，包括统计分析概览、导出报表、费用分析、数据下钻",
      "usedBy": [
        "StatisticsAnalysisView.vue",
        "ReportExportView.vue",
        "ResourceAllocationView.vue"
      ],
      "schema": [
        {
          "field": "reportType",
          "type": "string",
          "description": "报表类型：vehicleUtilization/taskCompletionRate等"
        },
        {
          "field": "timeRange",
          "type": "object",
          "description": "时间范围，含startDate和endDate，格式yyyy-MM-dd"
        },
        {
          "field": "region",
          "type": "string",
          "description": "作业区域编码"
        },
        {
          "field": "vehicleType",
          "type": "string",
          "description": "车辆类型编码"
        },
        {
          "field": "totalCost",
          "type": "number",
          "description": "总费用"
        },
        {
          "field": "count",
          "type": "integer",
          "description": "记录总数"
        },
        {
          "field": "charts",
          "type": "array",
          "description": "图表数据数组"
        },
        {
          "field": "indicators",
          "type": "object",
          "description": "关键指标对象"
        }
      ]
    },
    {
      "file": "mockDriver.js",
      "content": "模拟司机端相关接口数据，包括查询司机任务列表、查询导航路线",
      "usedBy": [
        "NavigationView.vue",
        "SiteFeedbackView.vue"
      ],
      "schema": [
        {
          "field": "currentPosition",
          "type": "string",
          "description": "当前GPS坐标，格式'经度,纬度'"
        },
        {
          "field": "destination",
          "type": "string",
          "description": "目的作业点标识或地址"
        },
        {
          "field": "routeType",
          "type": "string",
          "description": "导航方式：driving/walking"
        },
        {
          "field": "voiceGuide",
          "type": "boolean",
          "description": "是否开启语音播报"
        },
        {
          "field": "routeList",
          "type": "array",
          "description": "路线列表，每条含routeId/distance/estimatedTime/polyline"
        },
        {
          "field": "totalDistance",
          "type": "number",
          "description": "总距离（米）"
        },
        {
          "field": "estimatedTime",
          "type": "number",
          "description": "预估时间（秒）"
        }
      ]
    }
  ],
  "generationSteps": [
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
      "prompt": "请根据以下车辆管理系统的原型设计，生成所有必要的 Mock 数据文件和枚举常量定义。要求：\n\n1. 枚举常量：\n   - 车辆状态枚举：IDLE('空闲'), QUEUING('排队'), ON_TASK('任务中'), ABNORMAL('异常')\n   - 任务状态枚举：DISPATCHED('已派发'), ACCEPTED('已接单'), ARRIVED('已到达'), LOADING('装卸中'), COMPLETED('已完成'), CANCELLED('已取消')\n   - 车辆类型枚举：FORKLIFT('叉车'), TRACTOR('牵引车'), AGV('AGV')\n   - 告警类型枚举：SPEEDING('超速'), FORBIDDEN_ZONE('禁入区域'), EXPIRED_CERT('证照过期'), ABNORMAL_STAY('异常停留'), UNAUTHORIZED_ENTRY('未授权入场')\n   - 优先级枚举：HIGH('高'), MEDIUM('中'), LOW('低')\n\n2. Mock 数据文件（使用 mockjs 或简单 JSON 对象）：\n   - mockDispatch.js：提供调度相关接口的模拟数据，包括所有车辆列表（至少20辆，覆盖不同状态和类型）、用车申请列表（待处理）、异常告警列表（含不同异常类型）。数据字段需包含 id、plate、type、status、location（lng/lat）、driverName、priority、applicationId、dispatchRemark 等。\n   - mockTasks.js：提供司机任务列表详情，至少10条任务，包含字段 taskId、status、reason、newVehiclePlate、newDriverName、applicant、applyTime、作业点信息、生产资料关联数据。\n   - mockAlerts.js：提供告警数据，至少15条，包含 id、exceptionType、exceptionDescription、vehiclePlate、driverName、status（待处理/处理中/已处理）、handlerName、alertTime。\n   - mockStatistics.js：提供统计分析数据，包含不同 timeRange 下的图表数据（柱状图、折线图、饼图原始数据）、关键指标对象（利用率、完成率、平均等待时长等）、外协车辆费用明细。\n\n3. 所有 Mock 数据需与页面 API 接口路径对应（如 /api/siteDispatch/map、/api/siteDispatch/vehicles、/api/dispatch/applications、/api/siteDispatch/dispatch、/api/driver/tasks、/api/mobile/tasks/{id}、/api/siteDispatch/alerts、/api/alerts/{id}/handle）。\n\n4. 文件结构：在 src/mock/ 目录下创建上述文件和枚举常量文件 constants.js。\n\n5. 验收标准：\n   - 枚举常量清晰可导出，所有状态值在组件中可直接引用。\n   - Mock 数据能独立运行（无后端依赖），使用 Promise 模拟异步返回，延迟 200-500ms。\n   - 数据覆盖所有 UI 状态（loading/empty/error/success），例如车辆列表为空、告警为空等边界情况至少有对应 mock 分支。\n   - 每个 Mock 数据文件需提供 export 的异步函数（如 fetchVehicles(filters)、fetchAlerts()），接受查询参数并返回模拟响应。"
    },
    {
      "step": 2,
      "title": "生成通用组件",
      "prompt": "请根据车辆管理系统原型设计，生成以下 5 个通用组件。要求每个组件独立可复用，使用 Vue 3 + TypeScript + Composition API，样式使用 scoped CSS。组件需放在 src/components/common/ 目录下。\n\n1. VehicleInfoCard.vue\n   - 职责：通用车辆信息卡片，展示车牌、类型、状态、当前位置、距离等摘要信息，支持选中和点击交互。\n   - Props：vehicle: Object (必填，含 plate, type, status, location, distance)，selectable: Boolean (默认false)，selected: Boolean (默认false)，highlight: Boolean (默认false)\n   - Events：click -> 传出 vehicle，select-change -> 传出 {vehicle, selected}\n   - 样式：默认白色圆角卡片，阴影；高亮时边框变为蓝色；选中时左侧显示蓝色条。状态区域使用 StatusBadge 组件。\n   - 验收标准：可以独立渲染车辆摘要，点击和选中功能正常，能与其他页面联动。\n\n2. StatusBadge.vue\n   - 职责：通用状态标签，显示状态文本及对应颜色（空闲-绿色，排队-橙色，任务中-蓝色，异常-红色，已到达-紫色，已完成-灰色等），支持不同尺寸。\n   - Props：status: String (必填)，size: String (small/medium/large，默认medium)，customColor: String (可选)\n   - 使用圆角小标签样式，颜色映射内置，不支持自定义时自动根据 status 取值。\n   - 验收标准：传入不同 status 显示正确颜色和文本；尺寸改变字体和 padding 合适。\n\n3. TaskCard.vue\n   - 职责：任务摘要卡片，展示任务编号、状态、作业点、截止时间等。\n   - Props：task: Object (必填，含 id, title, status, location, deadline, assignee)，compact: Boolean (默认false，紧凑模式时隐藏部分字段)\n   - Events：click -> 传出 task，longpress -> 传出 task（使用 @longpress 自定义指令或 touch 事件）\n   - Slots：default 用于插入额外操作按钮。\n   - 验收标准：紧凑模式下卡片高度降低，信息精简；长按触发事件；默认 slot 可扩展。\n\n4. AlertItem.vue\n   - 职责：告警条目组件，显示告警类型图标、时间、车辆/人员、详情，并带有确认、解除、上报按钮。\n   - Props：alert: Object (必填，含 type, time, source, description, severity)，actions: Array (默认['confirm','resolve']，可选'confirm','resolve','report')\n   - Events：action -> 传出 {action, alert}\n   - 根据 severity 显示不同颜色（error-红，warning-黄，info-蓝）。\n   - 验收标准：告警条目可折叠/展开详情；按钮点击触发 action 事件；不同 severity 风格不同。\n\n5. PagedList.vue\n   - 职责：通用分页列表容器，内置 loading、empty、error 状态，支持自定义列表项渲染。\n   - Props：data: Array (必填)，loading: Boolean (默认false)，emptyText: String (默认'暂无数据')，total: Number (默认0)，pageSize: Number (默认10)\n   - Events：page-change -> 传出 page: Number\n   - Slots：item（作用域插槽绑定 item, index），empty（空状态定制内容）\n   - 验收标准：loading 时显示骨架屏（3个脉冲灰色块）；empty 时显示空状态插画+提示文字；error 状态由外部控制，容器内可传入 error 标记；分页控件在底部。"
    },
    {
      "step": 3,
      "title": "生成页面（按优先级 P0→P1→P2）",
      "prompt": "请根据车辆管理系统原型设计，生成所有页面组件（Vue 3 + TypeScript + Composition API，使用 Element Plus UI 库）。页面文件放在 src/views/ 目录下，按功能分组子目录。需要依次实现所有 P0 和 P1 优先级的页面，P2 暂不要求。\n\nP0 页面（必做）：\n1. DispatchMapView.vue（调度指挥-地图看板）\n   - 使用高德地图 JS API 或百度地图，在地图上实时展示车辆标记（圆形图标按类型着色），支持缩放（≥15级显示车牌简写）、点击查看详情。\n   - 顶部状态栏显示车辆统计卡片（空闲/排队/任务中/异常数量，点击可过滤地图）。\n   - 底部车辆预览面板显示最近5辆车摘要，使用 VehicleInfoCard 组件。\n   - 支持地图加载、空视野、错误等 UI 状态（使用全屏遮罩提示）。\n   - 集成 API：/api/siteDispatch/map（获取车辆位置）、/api/siteDispatch/vehicles（筛选）。\n   - 验收标准：地图渲染正确；车辆标记根据状态着色；点击标记弹出气泡并联动底部面板；状态过滤功能正常；错误重试可用。\n\n2. TaskListView.vue（任务执行-任务列表）\n   - 司机视角：展示个人任务列表，每项使用 TaskCard 组件，支持筛选（状态、日期）和排序。\n   - 下拉刷新、上拉加载更多（使用分页组件 PagedList）。\n   - 点击任务跳转到 TaskDetailView（通过路由传参 taskId）。\n   - 集成 API：/api/driver/tasks。\n   - 验收标准：列表分页正确；下拉刷新触发 API；空列表显示空状态；点击可跳转详情。\n\nP1 页面（必做）：\n3. OnsiteVehicleFilter.vue（调度指挥-车辆筛选）\n   - 顶部筛选条件区：车辆类型下拉、状态多选按钮组、作业区域树形选择、距离范围滑块。\n   - 结果列表区使用 VehicleInfoCard 组件（带复选框），支持多选后派车。\n   - 底部操作栏有重置和选定派车按钮。\n   - 集成 API：/api/siteDispatch/vehicles。\n   - 验收标准：筛选条件联动结果列表即时刷新；距离排序正确；选中车辆后“选定派车”按钮激活并打开派车对话框。\n\n4. OnsiteDispatchDialog.vue（调度指挥-任务下发，弹窗形式）\n   - 弹窗展示已选车辆、用车申请下拉选择、作业点输入（支持地图选点）、优先级单选，预计到达时间自动计算。\n   - 点击“下发任务”二次确认后调用 POST /api/siteDispatch/dispatch。\n   - 处理 loading/error/success 状态。\n   - 验收标准：弹窗正确接收车辆ID；表单验证必填项；提交成功后关闭并显示通知。\n\n5. OnsiteExceptionAlert.vue（调度指挥-异常告警）\n   - 使用 AlertItem 组件展示实时告警，支持按类型过滤、时间排序。\n   - 调度员可处理告警（确认、解决），调用 PUT /api/alerts/{id}/handle。\n   - 定时刷新（每30秒）。\n   - 验收标准：告警列表显示正常；操作按钮触发 API；处理成功后告警状态更新。\n\n6. TaskDetailView.vue（任务执行-任务详情）\n   - 展示任务完整信息：作业点位置（小地图）、车辆司机、物资清单、时间线。\n   - 集成 API：/api/mobile/tasks/{id}。\n   - 验收标准：从列表页进入加载正确数据；显示地图标记。\n\n7. NavigationView.vue（任务执行-导航到作业点）\n   - 地图显示路径，实时更新位置，显示预计到达时间和剩余距离。\n   - 开始导航、结束导航、重新规划按钮。\n   - 到达目的地后自动弹出确认到达对话框并跳转到 SiteFeedbackView。\n   - 验收标准：使用地图 SDK 导航功能（模拟即可）；到达判定合理。\n\n8. SiteFeedbackView.vue（任务执行-到达确认与反馈）\n   - 司机确认到达，上传现场照片（拍照或相册），填写备注。\n   - 提交后调用 API 更新任务状态。\n   - 验收标准：照片上传功能正常；提交后返回任务列表并刷新。\n\n9. EntryCheckPanel.vue（出入管理-核验面板）\n   - 支持扫描车牌（模拟输入）或预约二维码，自动核验有效性及派车关联。\n   - 显示核验结果（通过/拒绝），可手动放行或拒绝。\n   - 验收标准：输入车牌后调用 Mock 核验逻辑并展示结果。\n\n10. ReleaseManagementPanel.vue（出入管理-放行管理）\n    - 显示待放行车辆列表，点击放行或拒绝，记录放行时间。\n    - 调用 API 更新任务状态。\n    - 验收标准：放行操作后列表更新。\n\n11. AlertPanel.vue（出入管理-告警处理）\n    - 类似 OnsiteExceptionAlert，但针对门岗告警（未授权入场、证照过期等）。\n    - 使用 AlertItem 组件，可确认、解除、上报。\n    - 验收标准：与 OnsiteExceptionAlert 类似，但数据源不同。\n\n12. ReleaseRecordQueryView.vue（出入管理-放行记录查询）\n    - 按时间、车牌、车辆类型检索放行记录，使用 PagedList 展示。\n    - 支持导出（模拟下载）。\n    - 验收标准：筛选条件生效，分页正常。\n\n13. StatisticsAnalysisView.vue（运营分析-统计分析）\n    - 图表展示车辆利用率、完成率、等待时长、空驶率等，使用 ECharts 或 Chart.js。\n    - 支持时间范围筛选、区域/车辆类型下钻。\n    - 集成 API：/api/statistics/overview 等。\n    - 验收标准：图表渲染正确；筛选器联动图表更新。\n\n14. ReportExportView.vue（运营分析-报表导出）\n    - 选择报表类型、时间范围、格式（Excel/PDF），点击导出按钮下载。\n    - 验收标准：导出按钮触发下载流程。\n\n15. ResourceAllocationView.vue（运营分析-资源配置建议）\n    - 基于历史数据展示车辆利用趋势图，提供优化建议文本。\n    - 外协车辆费用管理表格。\n    - 验收标准：图表+表格展示正常。\n\n所有页面需包含完整的 UI 状态处理（loading、empty、error、success）以及路由跳转的交互。使用 mock 数据，确保无后端运行时能演示。"
    },
    {
      "step": 4,
      "title": "生成路由配置和 API 调用层",
      "prompt": "请根据车辆管理系统原型设计，生成以下两个核心模块：\n\n1. 路由配置（src/router/index.ts）\n   - 使用 Vue Router 4，定义所有页面的路由规则。要求：\n   - 顶部导航分组（调度指挥、任务执行、出入管理、运营分析），每组有一个默认路由（重定向到该组第一个页面）。\n   - 路由路径与组件对应关系如下：\n     - /dispatch/map-view -> DispatchMapView.vue (默认)\n     - /dispatch/vehicle-filter -> OnsiteVehicleFilter.vue\n     - /dispatch/dispatch-dialog -> OnsiteDispatchDialog.vue（作为弹窗，不单独路由，需在父页面动态打开，但预留路由入口便于调试）\n     - /dispatch/exception-alert -> OnsiteExceptionAlert.vue\n     - /task/task-list -> TaskListView.vue (默认)\n     - /task/task-detail/:taskId -> TaskDetailView.vue\n     - /task/navigation/:taskId -> NavigationView.vue\n     - /task/site-feedback/:taskId -> SiteFeedbackView.vue\n     - /entry/check-panel -> EntryCheckPanel.vue (默认)\n     - /entry/release-management -> ReleaseManagementPanel.vue\n     - /entry/alert-panel -> AlertPanel.vue\n     - /entry/release-record-query -> ReleaseRecordQueryView.vue\n     - /analysis/statistics -> StatisticsAnalysisView.vue (默认)\n     - /analysis/report-export -> ReportExportView.vue\n     - /analysis/resource-allocation -> ResourceAllocationView.vue\n   - 使用懒加载（import.meta.glob 或 () => import）。\n   - 导航守卫：无特殊要求。\n   - 验收标准：路由配置正确，按组分组，命名路由清晰。\n\n2. API 调用层（src/api/ 目录）\n   - 使用 axios 实例，统一配置 baseURL（默认为空，后续可改环境变量），请求拦截器加入 token（模拟从 localStorage 获取），响应拦截器统一处理错误（401 跳转登录，其他提示错误信息）。\n   - 为每个页面（或功能模块）创建独立的 API 模块文件：\n     - dispatchApi.ts：包含 fetchMapData(), fetchVehicles(filters), fetchApplications(), dispatchTask(data), fetchAlerts(), handleAlert(id, action)\n     - taskApi.ts：包含 fetchDriverTasks(params), fetchTaskDetail(taskId), updateTaskStatus(taskId, data)\n     - entryApi.ts：包含 checkVehicle(plate), approveEntry(recordId), rejectEntry(recordId), fetchEntryRecords(params), fetchEntryAlerts(), handleEntryAlert(id, action)\n     - statisticsApi.ts：包含 fetchOverview(params), fetchReport(reportType, params), exportReport(reportType, format, params), fetchResourceSuggestion(params)\n   - 所有 API 函数返回 Promise，在开发环境自动切换到 mock 数据（通过检查环境变量 VITE_USE_MOCK 或直接导入 mock 文件）。\n   - 验收标准：API 模块正确导出函数，参数类型定义完善（使用接口），调用时返回正确形态的数据。需要提供一份简单的类型声明文件（src/types/api.ts）定义所有请求和响应类型。"
    }
  ],
  "pageApiMapping": [
    {
      "page": "DispatchMapView.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/siteDispatch/map",
          "usage": "页面加载时获取所有车辆的实时位置、状态和告警信息，用于地图展示"
        },
        {
          "method": "GET",
          "path": "/api/siteDispatch/vehicles",
          "usage": "在地图初始化或筛选条件变化时获取车辆列表，用于标注和过滤显示"
        }
      ]
    },
    {
      "page": "OnsiteVehicleFilter.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/siteDispatch/vehicles",
          "usage": "用户选择筛选条件（类型、状态、区域等）时调用，返回符合条件的车辆列表供调度员选择"
        }
      ]
    },
    {
      "page": "OnsiteDispatchDialog.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/dispatch/applications",
          "usage": "打开派车对话框时加载待处理的用车申请列表，供调度员选择要分配的申请"
        },
        {
          "method": "POST",
          "path": "/api/siteDispatch/dispatch",
          "usage": "调度员确认派车时提交任务信息（车辆、作业点、优先级等），创建并下发任务"
        }
      ]
    },
    {
      "page": "OnsiteExceptionAlert.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/siteDispatch/alerts",
          "usage": "页面加载或定时刷新时获取实时异常告警列表，展示在告警面板"
        },
        {
          "method": "PUT",
          "path": "/api/alerts/{id}/handle",
          "usage": "调度员点击处理告警时提交处理结果，标记告警状态为已解决"
        }
      ]
    },
    {
      "page": "TaskListView.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/driver/tasks",
          "usage": "司机打开任务列表页面时加载个人任务，支持按状态、日期等筛选，接收新任务通知后刷新"
        }
      ]
    },
    {
      "page": "TaskDetailView.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/mobile/tasks/{id}",
          "usage": "进入任务详情页时，根据任务ID获取完整信息，包括作业点、车辆、司机、物资等"
        }
      ]
    },
    {
      "page": "NavigationView.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/mobile/navigation",
          "usage": "用户开始导航时，根据当前位置和目标作业点获取路线、距离、预计到达时间并展示"
        },
        {
          "method": "GET",
          "path": "/api/mobile/tasks/{id}",
          "usage": "在导航前或导航中，可返回任务详情页查看作业点坐标等辅助信息"
        }
      ]
    },
    {
      "page": "SiteFeedbackView.vue",
      "apis": [
        {
          "method": "POST",
          "path": "/api/mobile/tasks/{id}/feedback",
          "usage": "司机到达作业点后，点击确认到达并上传照片和备注时调用"
        },
        {
          "method": "GET",
          "path": "/api/mobile/tasks/{id}",
          "usage": "进入反馈页面前，加载任务详情用于展示当前作业点信息"
        }
      ]
    },
    {
      "page": "EntryCheckPanel.vue",
      "apis": [
        {
          "method": "POST",
          "path": "/api/gate/entry/verify",
          "usage": "门岗扫描车牌或二维码后，调用此接口核验车辆预约及任务关联，返回入场许可结果"
        },
        {
          "method": "POST",
          "path": "/api/reservation/entry/verify",
          "usage": "当车辆凭预约授权码入场时，通过此接口核验登记"
        }
      ]
    },
    {
      "page": "ReleaseManagementPanel.vue",
      "apis": [
        {
          "method": "POST",
          "path": "/api/gate/entry/release",
          "usage": "核验通过后，点击放行按钮时记录放行信息并联动抬杆"
        },
        {
          "method": "POST",
          "path": "/api/gate/exception/handle",
          "usage": "核验异常时，记录异常原因、处理结果并通知相关人员"
        },
        {
          "method": "PUT",
          "path": "/api/tasks/{id}/status",
          "usage": "放行或拒绝后，根据结果更新关联任务的状态（如已入场、已取消）"
        },
        {
          "method": "GET",
          "path": "/api/gate/logs",
          "usage": "进入放行管理页时，查询历史核验记录供参考"
        }
      ]
    },
    {
      "page": "AlertPanel.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/alerts",
          "usage": "页面加载时或筛选条件变化时，获取异常告警列表"
        },
        {
          "method": "PUT",
          "path": "/api/alerts/{id}/handle",
          "usage": "用户对告警进行确认、解除或上报操作时调用"
        }
      ]
    },
    {
      "page": "ReleaseRecordQueryView.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/gate/logs",
          "usage": "用户按条件检索放行记录时调用，展示核验详情"
        }
      ]
    },
    {
      "page": "StatisticsAnalysisView.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/statistics/overview",
          "usage": "页面初始化时加载核心统计指标的图表和汇总数据"
        },
        {
          "method": "GET",
          "path": "/api/statistics/drilldown",
          "usage": "用户点击图表下钻时获取明细数据"
        },
        {
          "method": "GET",
          "path": "/api/statistics/fees",
          "usage": "展示费用统计图表和明细时调用"
        }
      ]
    },
    {
      "page": "ReportExportView.vue",
      "apis": [
        {
          "method": "POST",
          "path": "/api/statistics/export",
          "usage": "用户选择报表类型、时间范围和导出格式后触发导出操作"
        }
      ]
    },
    {
      "page": "ResourceAllocationView.vue",
      "apis": [
        {
          "method": "GET",
          "path": "/api/report/optimization",
          "usage": "页面加载时获取资源配置优化建议和热点图数据"
        },
        {
          "method": "GET",
          "path": "/api/statistics/fees",
          "usage": "加载外协车辆费用汇总和明细，为费用管理提供参考"
        }
      ]
    }
  ],
  "navigationRoutes": [
    {
      "group": "调度指挥",
      "icon": "🚗",
      "routes": [
        {
          "path": "/dispatch/map-view",
          "component": "DispatchMapView.vue",
          "title": "地图看板",
          "default": true
        },
        {
          "path": "/dispatch/vehicle-filter",
          "component": "OnsiteVehicleFilter.vue",
          "title": "车辆筛选",
          "default": false
        },
        {
          "path": "/dispatch/dispatch-dialog",
          "component": "OnsiteDispatchDialog.vue",
          "title": "任务下发",
          "default": false
        },
        {
          "path": "/dispatch/exception-alert",
          "component": "OnsiteExceptionAlert.vue",
          "title": "异常告警",
          "default": false
        }
      ]
    },
    {
      "group": "任务执行",
      "icon": "📋",
      "routes": [
        {
          "path": "/task/task-list",
          "component": "TaskListView.vue",
          "title": "任务列表",
          "default": true
        },
        {
          "path": "/task/task-detail",
          "component": "TaskDetailView.vue",
          "title": "任务详情",
          "default": false
        },
        {
          "path": "/task/navigation",
          "component": "NavigationView.vue",
          "title": "导航到作业点",
          "default": false
        },
        {
          "path": "/task/site-feedback",
          "component": "SiteFeedbackView.vue",
          "title": "到达确认与反馈",
          "default": false
        }
      ]
    },
    {
      "group": "出入管理",
      "icon": "🚧",
      "routes": [
        {
          "path": "/entry/check-panel",
          "component": "EntryCheckPanel.vue",
          "title": "核验面板",
          "default": true
        },
        {
          "path": "/entry/release-management",
          "component": "ReleaseManagementPanel.vue",
          "title": "放行管理",
          "default": false
        },
        {
          "path": "/entry/alert-panel",
          "component": "AlertPanel.vue",
          "title": "告警处理",
          "default": false
        },
        {
          "path": "/entry/release-record-query",
          "component": "ReleaseRecordQueryView.vue",
          "title": "放行记录查询",
          "default": false
        }
      ]
    },
    {
      "group": "运营分析",
      "icon": "📊",
      "routes": [
        {
          "path": "/analysis/statistics",
          "component": "StatisticsAnalysisView.vue",
          "title": "统计分析",
          "default": true
        },
        {
          "path": "/analysis/report-export",
          "component": "ReportExportView.vue",
          "title": "报表导出",
          "default": false
        },
        {
          "path": "/analysis/resource-allocation",
          "component": "ResourceAllocationView.vue",
          "title": "资源配置建议",
          "default": false
        }
      ]
    }
  ],
  "projectBackground": {
    "projectName": "车辆管理",
    "customerName": "HG",
    "businessDomain": "运营调度系统",
    "requirementSummary": "我们希望建设一套海工基地车辆管理系统，用于统一管理厂区内生产车辆、物流车辆、外协车辆和临时入场车辆。当前车辆调度主要依靠电话、微信群和人工登记，车辆位置、任务状态、使用效率无法实时掌握，现场经常出现车辆排队等待、重复派车、空驶率高、司机找不到作业点、门岗放行信息不一致等问题。\n系统需要支持车辆基础档案管理，包括车辆类型、车牌号、所属单位、司机信息、车辆证照、年检状态、保险状态、准入有效期等信息。对于外协车辆和临时车辆，需要支持预约登记、审批、入场授权、出场核验和历史记录追溯。\n在生产作业方面，系统需要支持用车申请、调度派车、任务下发、司机接单、到达确认、装卸完成、任务关闭等流程。调度人员希望能够在一张地图或看板上看到车辆当前位置、任务状态、空闲车辆、排队车辆和异常车辆，并根据作业区域、车辆类型、任务优先级、距离远近等因素进行合理派车。\n系统还需要与门禁系统、生产计划系统、物资管理系统进行集成。门岗可以根据车辆预约和派车任务自动核验是否允许入场；生产计划系统可以推送吊装、转运、配送等用车需求；物资系统可以提供物料提货、配送、签收等信息，实现车辆任务与物资流转过程的关联。\n管理人员希望系统能够提供车辆利用率、任务完成率、平均等待时长、空驶率、车辆排队情况、外协车辆使用次数、异常入场记录等统计分析报表，用于优化车辆资源配置和外协车辆费用管理。\n系统需要支持移动端使用，司机可以在手机上查看任务、导航到作业点、上传现场照片、确认到达和完成任务。现场调度员可以通过移动端临时调整任务、查看车辆状态、处理异常情况。\n系统还需要具备安全管理能力，包括车辆超速提醒、禁入区域告警、证照过期提醒、异常停留提醒、未授权入场告警等。所有关键操作需要留痕，便于后续审计和责任追溯。\n希望通过该系统提升海工基地车辆调度效率，减少人工沟通成本，降低车辆等待和空驶时间，实现车辆、司机、任务、物资、门禁的一体化管理。",
    "userRoles": [
      {
        "role": "调度员",
        "description": "负责用车申请审批、调度派车、任务下发、查看车辆状态地图、进行合理派车、处理异常情况"
      },
      {
        "role": "司机",
        "description": "通过移动端查看任务、导航到作业点、上传现场照片、确认到达和完成任务"
      },
      {
        "role": "门岗人员",
        "description": "根据车辆预约和派车任务自动核验是否允许入场"
      },
      {
        "role": "管理人员",
        "description": "查看统计分析报表，优化车辆资源配置，管理外协车辆费用"
      }
    ],
    "scenarioSummary": "调度员现场调度：调度员通过地图看板实时查看车辆位置、状态和任务信息，根据作业需求进行智能派车、任务下发和异常处理"
  },
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
  },
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
    "savedAt": "2026-07-02T03:26:31.214Z"
  },
  "apiContract": {
    "contracts": [
      {
        "key": "contract-scenario-1782831312544-0-page-1-0-query",
        "method": "GET",
        "name": "查询调度工作台数据",
        "path": "/api/dispatch/dashboard",
        "goal": "获取区域筛选、车辆状态概览、异常告警等聚合数据，用于工作台整体展示",
        "trigger": "页面加载、区域筛选变更、状态概览区卡片点击",
        "resourceGroupKey": "dispatch",
        "resourceGroupLabel": "调度管理",
        "requestParams": [
          {
            "name": "id",
            "type": "string",
            "required": false,
            "description": "业务对象标识，按接口场景可选。"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "接口处理成功",
          "data": {
            "key": "contract-scenario-1782831312544-0-page-1-0-query",
            "records": [],
            "summary": {}
          },
          "error_code": null
        },
        "errorResponse": {
          "success": false,
          "message": "接口处理失败",
          "data": null,
          "error_code": "DISPATCH_FAILED"
        },
        "errorCodes": [
          {
            "code": "DISPATCH_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
          },
          {
            "code": "DISPATCH_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782831312544-0-page-2-1-queryApplications",
        "method": "GET",
        "name": "查询用车申请列表",
        "path": "/api/dispatch/applications",
        "goal": "获取待审批的用车申请列表，支持筛选和排序",
        "trigger": "页面加载、状态切换",
        "resourceGroupKey": "dispatch",
        "resourceGroupLabel": "调度管理",
        "requestParams": [
          {
            "name": "page",
            "type": "integer",
            "required": false,
            "description": "当前页码，默认1"
          },
          {
            "name": "pageSize",
            "type": "integer",
            "required": false,
            "description": "每页条数，默认20"
          },
          {
            "name": "status",
            "type": "string",
            "required": false,
            "description": "审批状态筛选，如 pending/approved/rejected"
          },
          {
            "name": "keyword",
            "type": "string",
            "required": false,
            "description": "申请单号或用车人模糊搜索"
          },
          {
            "name": "sortBy",
            "type": "string",
            "required": false,
            "description": "排序字段，如 applyTime/priority"
          },
          {
            "name": "sortOrder",
            "type": "string",
            "required": false,
            "description": "排序方向，asc/desc"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "查询成功",
          "data": {
            "list": [
              {
                "id": "string",
                "applicant": "string",
                "applyTime": "string",
                "status": "string",
                "purpose": "string",
                "region": "string",
                "vehicleType": "string",
                "priority": "string"
              }
            ],
            "total": 0,
            "page": 1,
            "pageSize": 20
          },
          "error_code": 0
        },
        "errorResponse": {
          "success": false,
          "message": "请求异常",
          "data": null,
          "error_code": 5001
        },
        "errorCodes": [
          {
            "code": "API_FAILED",
            "meaning": "成功",
            "frontendAdvice": "正常处理返回数据"
          },
          {
            "code": 4001,
            "meaning": "请求参数校验失败",
            "frontendAdvice": "提示用户检查筛选条件"
          },
          {
            "code": 5001,
            "meaning": "服务器内部错误",
            "frontendAdvice": "显示错误提示，提供重试按钮"
          },
          {
            "code": 5002,
            "meaning": "数据库查询异常",
            "frontendAdvice": "稍后重试，若持续失败联系管理员"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782831312544-0-page-2-1-approve",
        "method": "PUT",
        "name": "审批用车申请",
        "path": "/api/dispatch/applications/{id}/approve",
        "goal": "对用车申请进行通过或驳回操作",
        "trigger": "审核通过、审核驳回",
        "resourceGroupKey": "dispatch",
        "resourceGroupLabel": "调度管理",
        "requestParams": [
          {
            "name": "id",
            "type": "string",
            "required": false,
            "description": "业务对象标识，按接口场景可选。"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "接口处理成功",
          "data": {
            "key": "contract-scenario-1782831312544-0-page-2-1-approve",
            "records": [],
            "summary": {}
          },
          "error_code": null
        },
        "errorResponse": {
          "success": false,
          "message": "接口处理失败",
          "data": null,
          "error_code": "DISPATCH_FAILED"
        },
        "errorCodes": [
          {
            "code": "DISPATCH_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
          },
          {
            "code": "DISPATCH_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782831312544-0-page-2-1-dispatchTask",
        "method": "POST",
        "name": "下发派车任务",
        "path": "/api/dispatch/tasks",
        "goal": "将审批通过的申请与选定车辆绑定并下发任务给司机",
        "trigger": "下发派车按钮点击",
        "resourceGroupKey": "dispatch",
        "resourceGroupLabel": "调度管理",
        "requestParams": [
          {
            "name": "applicationId",
            "type": "string",
            "required": true,
            "description": "用车申请的唯一标识，从已审批通过的列表中选取"
          },
          {
            "name": "selectedVehicle",
            "type": "string",
            "required": true,
            "description": "派车车辆ID，由智能推荐或手动选择确定"
          },
          {
            "name": "priorityOverride",
            "type": "string",
            "required": false,
            "description": "手动调整的任务优先级，可选值：high/medium/low"
          },
          {
            "name": "dispatchRemark",
            "type": "string",
            "required": false,
            "description": "派车额外说明信息，如作业点、注意事项"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "派车任务下发成功",
          "data": {
            "taskId": "任务ID",
            "status": "dispatched"
          },
          "error_code": null
        },
        "errorResponse": {
          "success": false,
          "message": "派车任务下发失败",
          "data": null,
          "error_code": "DISPATCH_FAILED"
        },
        "errorCodes": [
          {
            "code": "DISPATCH_FAILED",
            "meaning": "系统内部错误导致下发失败",
            "frontendAdvice": "提示用户稍后重试，或联系管理员"
          },
          {
            "code": "VEHICLE_UNAVAILABLE",
            "meaning": "所选车辆已被其他任务占用或离线",
            "frontendAdvice": "提示用户重新选择车辆，并刷新可用车辆列表"
          },
          {
            "code": "APPLICATION_NOT_APPROVED",
            "meaning": "用车申请未通过审核或状态异常",
            "frontendAdvice": "提示用户检查申请状态，确保已通过审核"
          },
          {
            "code": "PARAM_MISSING",
            "meaning": "缺少必要参数（如未选择车辆或申请）",
            "frontendAdvice": "提示用户补全必填项后再下发"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782831312544-0-page-3-2-queryTaskList",
        "method": "GET",
        "name": "查询任务列表",
        "path": "/api/tasks",
        "goal": "按条件查询任务列表，支持状态、区域、关键字筛选",
        "trigger": "页面加载、筛选任务、刷新任务列表",
        "resourceGroupKey": "dispatch",
        "resourceGroupLabel": "调度管理",
        "requestParams": [
          {
            "name": "id",
            "type": "string",
            "required": false,
            "description": "业务对象标识，按接口场景可选。"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "接口处理成功",
          "data": {
            "key": "contract-scenario-1782831312544-0-page-3-2-queryTaskList",
            "records": [],
            "summary": {}
          },
          "error_code": null
        },
        "errorResponse": {
          "success": false,
          "message": "接口处理失败",
          "data": null,
          "error_code": "DISPATCH_FAILED"
        },
        "errorCodes": [
          {
            "code": "DISPATCH_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
          },
          {
            "code": "DISPATCH_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782831312544-0-page-3-2-updateTaskStatus",
        "method": "PUT",
        "name": "更新任务状态",
        "path": "/api/tasks/{id}/status",
        "goal": "取消任务、标记异常、重新派车等状态变更操作",
        "trigger": "取消任务、标记异常、重新派车",
        "resourceGroupKey": "dispatch",
        "resourceGroupLabel": "调度管理",
        "requestParams": [
          {
            "name": "id",
            "type": "string",
            "required": true,
            "description": "任务ID，路径参数"
          },
          {
            "name": "status",
            "type": "string",
            "required": true,
            "description": "目标状态：cancelled（取消）、abnormal（异常）、redispatched（重新派车）"
          },
          {
            "name": "reason",
            "type": "string",
            "required": false,
            "description": "状态变更原因，取消或标记异常时必填"
          },
          {
            "name": "newVehiclePlate",
            "type": "string",
            "required": false,
            "description": "重新派车时的新车牌号"
          },
          {
            "name": "newDriverName",
            "type": "string",
            "required": false,
            "description": "重新派车时的司机姓名"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "任务状态更新成功",
          "data": {},
          "error_code": null
        },
        "errorResponse": {
          "success": false,
          "message": "任务状态更新失败",
          "data": null,
          "error_code": "UPDATE_FAILED"
        },
        "errorCodes": [
          {
            "code": "TASK_NOT_FOUND",
            "meaning": "任务不存在",
            "frontendAdvice": "提示用户任务已失效，建议刷新列表"
          },
          {
            "code": "INVALID_STATUS_TRANSITION",
            "meaning": "不允许的状态变更",
            "frontendAdvice": "提示用户当前状态无法执行该操作，并提供可操作的状态列表"
          },
          {
            "code": "MISSING_REASON",
            "meaning": "缺少变更原因",
            "frontendAdvice": "提示用户填写原因，聚焦到原因输入框"
          },
          {
            "code": "VEHICLE_UNAVAILABLE",
            "meaning": "所选车辆不可用",
            "frontendAdvice": "提示用户选择其他车辆，并提供可用车辆列表"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782831312544-0-page-4-3-queryAlerts",
        "method": "GET",
        "name": "查询异常告警列表",
        "path": "/api/alerts",
        "goal": "获取异常告警记录，支持按类型、状态筛选",
        "trigger": "页面加载、筛选",
        "resourceGroupKey": "dispatch",
        "resourceGroupLabel": "调度管理",
        "requestParams": [
          {
            "name": "exceptionType",
            "type": "string",
            "required": false,
            "description": "异常类型：排队超时、重复派车、车辆故障、位置偏移等"
          },
          {
            "name": "status",
            "type": "string",
            "required": false,
            "description": "异常状态：待处理、处理中、已处理"
          },
          {
            "name": "vehiclePlate",
            "type": "string",
            "required": false,
            "description": "车辆牌照"
          },
          {
            "name": "driverName",
            "type": "string",
            "required": false,
            "description": "司机姓名"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "查询成功",
          "data": {
            "list": [
              {
                "id": "string",
                "exceptionType": "string",
                "exceptionDescription": "string",
                "vehiclePlate": "string",
                "driverName": "string",
                "handlerName": "string",
                "actionType": "string",
                "remark": "string",
                "status": "string",
                "createTime": "string",
                "updateTime": "string"
              }
            ],
            "total": 0,
            "page": 1,
            "pageSize": 20
          },
          "error_code": 0
        },
        "errorResponse": {
          "success": false,
          "message": "请求失败",
          "data": null,
          "error_code": 50000
        },
        "errorCodes": [
          {
            "code": 40000,
            "meaning": "请求参数错误",
            "frontendAdvice": "检查筛选条件是否合法"
          },
          {
            "code": 40100,
            "meaning": "未授权",
            "frontendAdvice": "请重新登录"
          },
          {
            "code": 50000,
            "meaning": "服务器内部错误",
            "frontendAdvice": "请稍后重试或联系管理员"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782831312544-0-page-4-3-handleAlert",
        "method": "PUT",
        "name": "处理异常告警",
        "path": "/api/alerts/{id}/handle",
        "goal": "确认处理异常，包括增派车辆、修改路线等操作",
        "trigger": "处理异常、确认处理",
        "resourceGroupKey": "dispatch",
        "resourceGroupLabel": "调度管理",
        "requestParams": [
          {
            "name": "id",
            "type": "string",
            "required": false,
            "description": "业务对象标识，按接口场景可选。"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "接口处理成功",
          "data": {
            "key": "contract-scenario-1782831312544-0-page-4-3-handleAlert",
            "records": [],
            "summary": {}
          },
          "error_code": null
        },
        "errorResponse": {
          "success": false,
          "message": "接口处理失败",
          "data": null,
          "error_code": "DISPATCH_FAILED"
        },
        "errorCodes": [
          {
            "code": "DISPATCH_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
          },
          {
            "code": "DISPATCH_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782831312544-1-page-1-0-queryStatistics",
        "method": "GET",
        "name": "查询统计分析数据",
        "path": "/api/statistics/overview",
        "goal": "按报表类型、时间范围、区域等获取统计图表与指标数据",
        "trigger": "页面加载、切换报表、刷新数据",
        "resourceGroupKey": "statistics",
        "resourceGroupLabel": "统计分析",
        "requestParams": [
          {
            "name": "reportType",
            "type": "string",
            "required": true,
            "description": "报表类型，如 vehicleUtilization, taskCompletionRate 等"
          },
          {
            "name": "timeRange",
            "type": "object",
            "required": true,
            "description": "时间范围，包含 startDate 和 endDate 字段，格式 yyyy-MM-dd"
          },
          {
            "name": "region",
            "type": "string",
            "required": false,
            "description": "作业区域编码，为空时查询全部区域"
          },
          {
            "name": "vehicleType",
            "type": "string",
            "required": false,
            "description": "车辆类型编码，为空时查询全部类型"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "操作成功",
          "data": {
            "charts": [],
            "indicators": {}
          },
          "error_code": 0
        },
        "errorResponse": {
          "success": false,
          "message": "请求失败",
          "data": null,
          "error_code": 400
        },
        "errorCodes": [
          {
            "code": 400,
            "meaning": "请求参数错误或缺失必填参数",
            "frontendAdvice": "检查表单输入是否完整，提示用户修正参数"
          },
          {
            "code": 403,
            "meaning": "无权限访问该接口",
            "frontendAdvice": "提示用户无权限，联系管理员赋权"
          },
          {
            "code": 500,
            "meaning": "服务器内部错误",
            "frontendAdvice": "显示系统异常提示，引导用户稍后重试或联系支持"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782831312544-1-page-1-0-exportReport",
        "method": "POST",
        "name": "导出统计报表",
        "path": "/api/statistics/export",
        "goal": "根据当前报表类型和时间范围导出文件",
        "trigger": "导出报表",
        "resourceGroupKey": "statistics",
        "resourceGroupLabel": "统计分析",
        "requestParams": [
          {
            "name": "id",
            "type": "string",
            "required": false,
            "description": "业务对象标识，按接口场景可选。"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "接口处理成功",
          "data": {
            "key": "contract-scenario-1782831312544-1-page-1-0-exportReport",
            "records": [],
            "summary": {}
          },
          "error_code": null
        },
        "errorResponse": {
          "success": false,
          "message": "接口处理失败",
          "data": null,
          "error_code": "STATISTICS_FAILED"
        },
        "errorCodes": [
          {
            "code": "STATISTICS_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
          },
          {
            "code": "STATISTICS_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782831312544-1-page-2-1-queryFeeAnalysis",
        "method": "GET",
        "name": "查询费用分析数据",
        "path": "/api/statistics/fees",
        "goal": "按时间范围、车辆类型等获取费用统计数据和明细记录",
        "trigger": "查询、下钻",
        "resourceGroupKey": "statistics",
        "resourceGroupLabel": "统计分析",
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
            "type": "string",
            "required": false,
            "description": "按车辆类型筛选（如外协、临时等）"
          },
          {
            "name": "vehiclePlate",
            "type": "string",
            "required": false,
            "description": "按车牌号模糊搜索"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "success",
          "data": {
            "totalCost": 0,
            "count": 0,
            "records": []
          },
          "error_code": 0
        },
        "errorResponse": {
          "success": false,
          "message": "请求失败，请稍后重试",
          "data": null,
          "error_code": 500
        },
        "errorCodes": [
          {
            "code": 400,
            "meaning": "参数校验失败",
            "frontendAdvice": "请检查输入参数是否符合要求后重试"
          },
          {
            "code": 401,
            "meaning": "未授权访问",
            "frontendAdvice": "请重新登录后重试"
          },
          {
            "code": 500,
            "meaning": "服务器内部错误",
            "frontendAdvice": "请联系系统管理员或稍后重试"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782831312544-1-page-3-2-exportReport",
        "method": "POST",
        "name": "导出报表文件",
        "path": "/api/statistics/export",
        "goal": "按选择的报表类型、时间范围、格式导出文件",
        "trigger": "导出按钮点击",
        "resourceGroupKey": "statistics",
        "resourceGroupLabel": "统计分析",
        "requestParams": [
          {
            "name": "reportType",
            "type": "String",
            "required": true,
            "description": "选择要导出的报表类型，例如车辆利用率报表、任务完成率报表等。"
          },
          {
            "name": "timeRange",
            "type": "String",
            "required": true,
            "description": "选择数据导出涵盖的时间范围，格式为起始日期,结束日期 (yyyy-MM-dd,yyyy-MM-dd)。"
          },
          {
            "name": "exportFormat",
            "type": "String",
            "required": true,
            "description": "选择导出文件格式，支持Excel或PDF。"
          },
          {
            "name": "scope",
            "type": "String",
            "required": false,
            "description": "可选：全部数据、当前视图数据、所选下钻数据。"
          },
          {
            "name": "fileName",
            "type": "String",
            "required": false,
            "description": "自定义导出文件的名称，留空则使用默认名称。"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "导出任务已提交",
          "data": {
            "taskId": "string",
            "estimatedWaitTime": "number"
          },
          "error_code": 0
        },
        "errorResponse": {
          "success": false,
          "message": "导出失败",
          "data": null,
          "error_code": 1001
        },
        "errorCodes": [
          {
            "code": 1001,
            "meaning": "参数校验失败，必填项缺失或格式错误",
            "frontendAdvice": "请检查报表类型、时间范围、导出格式是否填写正确，时间范围不能超过90天。"
          },
          {
            "code": 1002,
            "meaning": "数据量过大，导出超时",
            "frontendAdvice": "请缩小时间范围或选择更细粒度的导出范围后重试。"
          },
          {
            "code": 1003,
            "meaning": "系统内部异常",
            "frontendAdvice": "请稍后重试或联系管理员。"
          },
          {
            "code": 1004,
            "meaning": "不支持的导出格式",
            "frontendAdvice": "请选择Excel或PDF格式。"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782831312544-1-page-4-3-queryDrillDown",
        "method": "GET",
        "name": "查询数据下钻明细",
        "path": "/api/statistics/drilldown",
        "goal": "根据下钻条件获取明细数据，支持司机、车辆详情查看",
        "trigger": "下钻至详情、查看司机/车辆详情",
        "resourceGroupKey": "statistics",
        "resourceGroupLabel": "统计分析",
        "requestParams": [
          {
            "name": "id",
            "type": "string",
            "required": false,
            "description": "业务对象标识，按接口场景可选。"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "接口处理成功",
          "data": {
            "key": "contract-scenario-1782831312544-1-page-4-3-queryDrillDown",
            "records": [],
            "summary": {}
          },
          "error_code": null
        },
        "errorResponse": {
          "success": false,
          "message": "接口处理失败",
          "data": null,
          "error_code": "STATISTICS_FAILED"
        },
        "errorCodes": [
          {
            "code": "STATISTICS_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
          },
          {
            "code": "STATISTICS_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782831312544-2-page-1-0-queryTaskList",
        "method": "GET",
        "name": "查询司机任务列表",
        "path": "/api/driver/tasks",
        "goal": "按状态、日期、关键字获取当前司机的任务列表",
        "trigger": "搜索、查看历史任务",
        "resourceGroupKey": "driver",
        "resourceGroupLabel": "司机任务",
        "requestParams": [
          {
            "name": "id",
            "type": "string",
            "required": false,
            "description": "业务对象标识，按接口场景可选。"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "接口处理成功",
          "data": {
            "key": "contract-scenario-1782831312544-2-page-1-0-queryTaskList",
            "records": [],
            "summary": {}
          },
          "error_code": null
        },
        "errorResponse": {
          "success": false,
          "message": "接口处理失败",
          "data": null,
          "error_code": "DRIVER_FAILED"
        },
        "errorCodes": [
          {
            "code": "DRIVER_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
          },
          {
            "code": "DRIVER_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782831312544-2-page-2-1-queryNavigation",
        "method": "GET",
        "name": "查询导航路线",
        "path": "/api/driver/navigation",
        "goal": "根据当前任务获取推荐路线、距离、预计时间等信息",
        "trigger": "开始导航、切换路线、刷新路线",
        "resourceGroupKey": "driver",
        "resourceGroupLabel": "司机任务",
        "requestParams": [
          {
            "name": "currentPosition",
            "type": "string",
            "required": false,
            "description": "当前GPS坐标，格式为'经度,纬度'，不传则服务端自动获取"
          },
          {
            "name": "destination",
            "type": "string",
            "required": true,
            "description": "目的作业点标识或地址，从任务中获取"
          },
          {
            "name": "routeType",
            "type": "string",
            "required": true,
            "description": "导航方式，枚举值：driving / walking，默认driving"
          },
          {
            "name": "voiceGuide",
            "type": "boolean",
            "required": false,
            "description": "是否开启语音播报（影响响应是否包含语音数据）"
          }
        ],
        "successResponse": {
          "success": true,
          "message": "success",
          "data": {
            "routeList": [
              {
                "routeId": "string",
                "distance": "number（单位:米）",
                "estimatedTime": "number（单位:秒）",
                "polyline": "string（路线编码）",
                "voiceGuideEnabled": "boolean"
              }
            ],
            "totalDistance": "number",
            "estimatedTime": "number",
            "currentPosition": "string",
            "destination": "string"
          },
          "error_code": 0
        },
        "errorResponse": {
          "success": false,
          "message": "string",
          "data": null,
          "error_code": "number"
        },
        "errorCodes": [
          {
            "code": 1001,
            "meaning": "定位权限未开启或无法获取GPS信号",
            "frontendAdvice": "提示用户检查定位权限并确保GPS开启"
          },
          {
            "code": 1002,
            "meaning": "目的地不在系统作业点范围内",
            "frontendAdvice": "提示用户确认作业点正确或联系调度"
          },
          {
            "code": 1003,
            "meaning": "网络连接失败",
            "frontendAdvice": "提示用户检查网络连接后重试"
          },
          {
            "code": 1004,
            "meaning": "路线规划失败",
            "frontendAdvice": "提示用户稍后重试或联系调度员"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782831312544-2-page-3-2-submitArrival",
        "method": "POST",
        "name": "提交到达确认",
        "path": "/api/driver/arrival",
        "goal": "上传现场照片、GPS位置，完成签到确认",
        "trigger": "签到确认按钮点击",
        "resourceGroupKey": "driver",
        "resourceGroupLabel": "司机任务",
        "requestParams": [
          {
            "name": "id",
            "type": "string",
            "required": false,
            "description": "业务对象标识，按接口场景可选。"
          }
        ],
        "successResponse": {
          "code": 0,
          "message": "success",
          "data": {
            "key": "contract-scenario-1782831312544-2-page-3-2-submitArrival",
            "records": [],
            "pagination": {
              "page": 1,
              "pageSize": 20,
              "total": 0
            },
            "summary": {}
          },
          "traceId": "trace-id"
        },
        "errorResponse": {
          "code": 500,
          "message": "接口处理失败",
          "data": null,
          "error": {
            "code": "DRIVER_FAILED",
            "message": "业务处理失败或状态流转不合法。",
            "details": []
          },
          "traceId": "trace-id"
        },
        "errorCodes": [
          {
            "code": "DRIVER_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
          },
          {
            "code": "DRIVER_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782831312544-2-page-4-3-submitTaskCompletion",
        "method": "POST",
        "name": "提交任务完成报告",
        "path": "/api/driver/tasks/{id}/complete",
        "goal": "填写装卸数量、作业结果、异常情况并关闭任务",
        "trigger": "关闭任务、提交异常报告",
        "resourceGroupKey": "driver",
        "resourceGroupLabel": "司机任务",
        "requestParams": [
          {
            "name": "id",
            "type": "string",
            "required": true,
            "description": "任务ID，路径参数"
          },
          {
            "name": "cargoQuantity",
            "type": "number",
            "required": true,
            "description": "实际装卸数量"
          },
          {
            "name": "operationResult",
            "type": "string",
            "required": true,
            "description": "作业结果，取值：COMPLETED / ABNORMAL"
          },
          {
            "name": "remarks",
            "type": "string",
            "required": false,
            "description": "备注"
          },
          {
            "name": "abnormalDescription",
            "type": "string",
            "required": false,
            "description": "异常情况描述，当operationResult为ABNORMAL时必填"
          }
        ],
        "successResponse": {
          "code": 0,
          "message": "success",
          "data": {
            "taskId": "string",
            "completionTime": "string (ISO 8601)",
            "status": "CLOSED"
          },
          "traceId": "string"
        },
        "errorResponse": {
          "code": 40001,
          "message": "任务状态不允许关闭",
          "data": null,
          "traceId": "string"
        },
        "errorCodes": [
          {
            "code": 40001,
            "meaning": "任务状态错误，无法关闭",
            "frontendAdvice": "提示用户任务状态已变更，请刷新后重试"
          },
          {
            "code": 40002,
            "meaning": "必填参数缺失",
            "frontendAdvice": "检查表单必填项是否填写"
          },
          {
            "code": 404,
            "meaning": "任务不存在",
            "frontendAdvice": "提示用户任务已被删除或ID错误"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782831312544-3-page-1-0-verifyEntry",
        "method": "POST",
        "name": "核验入场车辆",
        "path": "/api/gate/entry/verify",
        "goal": "通过车牌号或扫描码进行入场核验，返回核验结果",
        "trigger": "扫描车牌、手动输入后核验",
        "resourceGroupKey": "gate",
        "resourceGroupLabel": "门岗核验",
        "requestParams": [
          {
            "name": "plateNo",
            "type": "string",
            "required": false,
            "description": "车牌号，与scanCode至少填写一个"
          },
          {
            "name": "scanCode",
            "type": "string",
            "required": false,
            "description": "入场二维码/条形码扫描码，与plateNo至少填写一个"
          }
        ],
        "successResponse": {
          "code": 0,
          "message": "success",
          "data": {
            "vehicleInfo": {
              "plateNo": "京A12345",
              "vehicleType": "大型货车",
              "driver": "张三",
              "phone": "13800138000"
            },
            "permission": {
              "allowed": true,
              "validUntil": "2025-12-31 23:59:59",
              "area": "生产区A"
            }
          },
          "traceId": "trace-id-string"
        },
        "errorResponse": {
          "code": 1001,
          "message": "车辆未登记",
          "data": null,
          "traceId": "trace-id-string"
        },
        "errorCodes": [
          {
            "code": "VEHICLE_NOT_FOUND",
            "meaning": "车辆在系统内未登记",
            "frontendAdvice": "提示用户车辆未登记，引导联系门岗管理员"
          },
          {
            "code": "VEHICLE_NO_ENTRY_PERMISSION",
            "meaning": "车辆无入场权限或权限已过期",
            "frontendAdvice": "提示无入场权限，展示原因和联系方式"
          },
          {
            "code": "INVALID_SCAN_CODE",
            "meaning": "扫描码无效或已过期",
            "frontendAdvice": "提示重新扫描或手动输入车牌号"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782831312544-3-page-1-0-releaseVehicle",
        "method": "POST",
        "name": "放行车辆入场",
        "path": "/api/gate/entry/release",
        "goal": "记录放行操作，联动门禁抬杆",
        "trigger": "放行按钮点击",
        "resourceGroupKey": "gate",
        "resourceGroupLabel": "门岗核验",
        "requestParams": [
          {
            "name": "vehiclePlate",
            "type": "string",
            "required": true,
            "description": "车牌号，例：京A12345"
          },
          {
            "name": "driverName",
            "type": "string",
            "required": false,
            "description": "司机姓名"
          },
          {
            "name": "orderId",
            "type": "string",
            "required": false,
            "description": "关联订单号，若为空则只做入场登记"
          },
          {
            "name": "releaseOperator",
            "type": "string",
            "required": true,
            "description": "放行操作人账号"
          }
        ],
        "successResponse": {
          "code": 0,
          "message": "success",
          "data": {
            "releaseId": "REL20250321001",
            "vehiclePlate": "京A12345",
            "entryTime": "2025-03-21T10:30:00Z",
            "gateId": "GATE-01"
          },
          "traceId": "trace-001"
        },
        "errorResponse": {
          "code": -1,
          "message": "操作失败",
          "data": null,
          "traceId": "trace-002"
        },
        "errorCodes": [
          {
            "code": "VEHICLE_NOT_FOUND",
            "meaning": "车辆预约记录不存在或已过期",
            "frontendAdvice": "提示用户确认预约信息或重新预约"
          },
          {
            "code": "GATE_DEVICE_ERROR",
            "meaning": "门禁设备响应超时或故障",
            "frontendAdvice": "提示稍后重试，并记录设备异常"
          },
          {
            "code": "PERMISSION_DENIED",
            "meaning": "当前用户无该门岗的放行权限",
            "frontendAdvice": "提示联系管理员分配权限"
          },
          {
            "code": "RELEASE_LOCKED",
            "meaning": "该车辆正在被其他操作员处理",
            "frontendAdvice": "提示等待或联系当前操作员"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782831312544-3-page-2-1-verifyExit",
        "method": "POST",
        "name": "核验出场车辆",
        "path": "/api/gate/exit/verify",
        "goal": "通过扫描或输入车牌进行出场核验，返回车辆信息和任务状态",
        "trigger": "扫描车牌/二维码、核验通过/不通过",
        "resourceGroupKey": "gate",
        "resourceGroupLabel": "门岗核验",
        "requestParams": [
          {
            "name": "id",
            "type": "string",
            "required": false,
            "description": "业务对象标识，按接口场景可选。"
          }
        ],
        "successResponse": {
          "code": 0,
          "message": "success",
          "data": {
            "key": "contract-scenario-1782831312544-3-page-2-1-verifyExit",
            "records": [],
            "pagination": {
              "page": 1,
              "pageSize": 20,
              "total": 0
            },
            "summary": {}
          },
          "traceId": "trace-id"
        },
        "errorResponse": {
          "code": 500,
          "message": "接口处理失败",
          "data": null,
          "error": {
            "code": "GATE_FAILED",
            "message": "业务处理失败或状态流转不合法。",
            "details": []
          },
          "traceId": "trace-id"
        },
        "errorCodes": [
          {
            "code": "GATE_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
          },
          {
            "code": "GATE_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": "2026-07-01T14:58:12.502Z"
      },
      {
        "key": "contract-scenario-1782831312544-3-page-3-2-handleException",
        "method": "POST",
        "name": "处理核验异常",
        "path": "/api/gate/exception/handle",
        "goal": "记录异常原因、处理结果和通知对象",
        "trigger": "放行、拒绝、通知",
        "resourceGroupKey": "gate",
        "resourceGroupLabel": "门岗核验",
        "requestParams": [
          {
            "name": "id",
            "type": "string",
            "required": false,
            "description": "业务对象标识，按接口场景可选。"
          }
        ],
        "successResponse": {
          "code": 0,
          "message": "success",
          "data": {
            "key": "contract-scenario-1782831312544-3-page-3-2-handleException",
            "records": [],
            "pagination": {
              "page": 1,
              "pageSize": 20,
              "total": 0
            },
            "summary": {}
          },
          "traceId": "trace-id"
        },
        "errorResponse": {
          "code": 500,
          "message": "接口处理失败",
          "data": null,
          "error": {
            "code": "GATE_FAILED",
            "message": "业务处理失败或状态流转不合法。",
            "details": []
          },
          "traceId": "trace-id"
        },
        "errorCodes": [
          {
            "code": "GATE_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
          },
          {
            "code": "GATE_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782831312544-3-page-4-3-queryLogs",
        "method": "GET",
        "name": "查询核验日志",
        "path": "/api/gate/logs",
        "goal": "按车牌、时间范围、结果、方向查询核验记录",
        "trigger": "查询、重置、查看详情",
        "resourceGroupKey": "gate",
        "resourceGroupLabel": "门岗核验",
        "requestParams": [
          {
            "name": "plateNumber",
            "type": "string",
            "required": false,
            "description": "车牌号，支持模糊查询"
          },
          {
            "name": "startTime",
            "type": "string",
            "required": false,
            "description": "开始时间，格式 yyyy-MM-dd HH:mm:ss"
          },
          {
            "name": "endTime",
            "type": "string",
            "required": false,
            "description": "结束时间，格式 yyyy-MM-dd HH:mm:ss"
          },
          {
            "name": "result",
            "type": "string",
            "required": false,
            "description": "核验结果：pass/fail/unknown"
          },
          {
            "name": "direction",
            "type": "string",
            "required": false,
            "description": "方向：in/out"
          },
          {
            "name": "page",
            "type": "number",
            "required": false,
            "description": "当前页码，从1开始，默认1"
          },
          {
            "name": "pageSize",
            "type": "number",
            "required": false,
            "description": "每页条数，默认20"
          }
        ],
        "successResponse": {
          "code": 0,
          "message": "success",
          "data": {
            "records": [
              {
                "id": "string",
                "plateNumber": "string",
                "direction": "string",
                "result": "string",
                "time": "string",
                "imageUrl": "string"
              }
            ],
            "pagination": {
              "page": 1,
              "pageSize": 20,
              "total": 0
            },
            "summary": {
              "totalPass": 0,
              "totalFail": 0
            }
          },
          "traceId": "uuid"
        },
        "errorResponse": {
          "code": -1,
          "message": "error",
          "data": {
            "error": {
              "code": "VEHICLE_VALIDATION_FAILED",
              "message": "车辆核验失败",
              "details": []
            }
          },
          "traceId": "uuid"
        },
        "errorCodes": [
          {
            "code": "VEHICLE_VALIDATION_FAILED",
            "meaning": "车辆核验失败",
            "frontendAdvice": "提示用户重试或联系管理员"
          },
          {
            "code": "INVALID_PARAMETER",
            "meaning": "请求参数不合法",
            "frontendAdvice": "前端校验参数格式"
          },
          {
            "code": "SYSTEM_ERROR",
            "meaning": "系统内部错误",
            "frontendAdvice": "显示错误页面并提供重试按钮"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782831312544-4-page-1-0-createReservation",
        "method": "POST",
        "name": "创建预约申请",
        "path": "/api/reservation/applications",
        "goal": "提交外协车辆入场预约申请，含车辆、司机、时间信息",
        "trigger": "提交预约申请",
        "resourceGroupKey": "reservation",
        "resourceGroupLabel": "外协车辆预约",
        "requestParams": [
          {
            "name": "id",
            "type": "string",
            "required": false,
            "description": "业务对象标识，按接口场景可选。"
          }
        ],
        "successResponse": {
          "code": 0,
          "message": "success",
          "data": {
            "key": "contract-scenario-1782831312544-4-page-1-0-createReservation",
            "records": [],
            "pagination": {
              "page": 1,
              "pageSize": 20,
              "total": 0
            },
            "summary": {}
          },
          "traceId": "trace-id"
        },
        "errorResponse": {
          "code": 500,
          "message": "接口处理失败",
          "data": null,
          "error": {
            "code": "RESERVATION_FAILED",
            "message": "业务处理失败或状态流转不合法。",
            "details": []
          },
          "traceId": "trace-id"
        },
        "errorCodes": [
          {
            "code": "RESERVATION_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
          },
          {
            "code": "RESERVATION_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782831312544-4-page-2-1-queryAuthorization",
        "method": "GET",
        "name": "查询授权凭证",
        "path": "/api/reservation/authorization/{id}",
        "goal": "获取预约审批通过后生成的授权二维码和凭证信息",
        "trigger": "查看预约详情、下载凭证",
        "resourceGroupKey": "reservation",
        "resourceGroupLabel": "外协车辆预约",
        "requestParams": [
          {
            "name": "id",
            "type": "string",
            "required": false,
            "description": "业务对象标识，按接口场景可选。"
          }
        ],
        "successResponse": {
          "code": 0,
          "message": "success",
          "data": {
            "key": "contract-scenario-1782831312544-4-page-2-1-queryAuthorization",
            "records": [],
            "pagination": {
              "page": 1,
              "pageSize": 20,
              "total": 0
            },
            "summary": {}
          },
          "traceId": "trace-id"
        },
        "errorResponse": {
          "code": 500,
          "message": "接口处理失败",
          "data": null,
          "error": {
            "code": "RESERVATION_FAILED",
            "message": "业务处理失败或状态流转不合法。",
            "details": []
          },
          "traceId": "trace-id"
        },
        "errorCodes": [
          {
            "code": "RESERVATION_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
          },
          {
            "code": "RESERVATION_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782831312544-4-page-3-2-verifyEntry",
        "method": "POST",
        "name": "核验预约入场",
        "path": "/api/reservation/entry/verify",
        "goal": "通过授权码扫描或手动输入，核验并登记入场",
        "trigger": "扫描入场授权码、确认登记",
        "resourceGroupKey": "reservation",
        "resourceGroupLabel": "外协车辆预约",
        "requestParams": [
          {
            "name": "id",
            "type": "string",
            "required": false,
            "description": "业务对象标识，按接口场景可选。"
          }
        ],
        "successResponse": {
          "code": 0,
          "message": "success",
          "data": {
            "key": "contract-scenario-1782831312544-4-page-3-2-verifyEntry",
            "records": [],
            "pagination": {
              "page": 1,
              "pageSize": 20,
              "total": 0
            },
            "summary": {}
          },
          "traceId": "trace-id"
        },
        "errorResponse": {
          "code": 500,
          "message": "接口处理失败",
          "data": null,
          "error": {
            "code": "RESERVATION_FAILED",
            "message": "业务处理失败或状态流转不合法。",
            "details": []
          },
          "traceId": "trace-id"
        },
        "errorCodes": [
          {
            "code": "RESERVATION_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
          },
          {
            "code": "RESERVATION_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782831312544-4-page-4-3-verifyExit",
        "method": "POST",
        "name": "核验预约出场",
        "path": "/api/reservation/exit/verify",
        "goal": "核验出场车辆，更新预约状态为已核销",
        "trigger": "扫描入场凭证、核验出场",
        "resourceGroupKey": "reservation",
        "resourceGroupLabel": "外协车辆预约",
        "requestParams": [
          {
            "name": "id",
            "type": "string",
            "required": false,
            "description": "业务对象标识，按接口场景可选。"
          }
        ],
        "successResponse": {
          "code": 0,
          "message": "success",
          "data": {
            "key": "contract-scenario-1782831312544-4-page-4-3-verifyExit",
            "records": [],
            "pagination": {
              "page": 1,
              "pageSize": 20,
              "total": 0
            },
            "summary": {}
          },
          "traceId": "trace-id"
        },
        "errorResponse": {
          "code": 500,
          "message": "接口处理失败",
          "data": null,
          "error": {
            "code": "RESERVATION_FAILED",
            "message": "业务处理失败或状态流转不合法。",
            "details": []
          },
          "traceId": "trace-id"
        },
        "errorCodes": [
          {
            "code": "RESERVATION_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
          },
          {
            "code": "RESERVATION_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782887819107-0-page-1-0-queryMapData",
        "method": "GET",
        "name": "查询地图监控数据",
        "path": "/api/siteDispatch/map",
        "goal": "获取车辆实时位置、状态、告警等信息用于地图展示",
        "trigger": "页面加载、筛选变更、切换图层",
        "resourceGroupKey": "siteDispatch",
        "resourceGroupLabel": "现场调度地图",
        "requestParams": [
          {
            "name": "id",
            "type": "string",
            "required": false,
            "description": "业务对象标识，按接口场景可选。"
          }
        ],
        "successResponse": {
          "code": 0,
          "message": "success",
          "data": {
            "key": "contract-scenario-1782887819107-0-page-1-0-queryMapData",
            "records": [],
            "pagination": {
              "page": 1,
              "pageSize": 20,
              "total": 0
            },
            "summary": {}
          },
          "traceId": "trace-id"
        },
        "errorResponse": {
          "code": 500,
          "message": "接口处理失败",
          "data": null,
          "error": {
            "code": "SITEDISPATCH_FAILED",
            "message": "业务处理失败或状态流转不合法。",
            "details": []
          },
          "traceId": "trace-id"
        },
        "errorCodes": [
          {
            "code": "SITEDISPATCH_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
          },
          {
            "code": "SITEDISPATCH_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782887819107-0-page-2-1-queryVehicleList",
        "method": "GET",
        "name": "查询现场车辆列表",
        "path": "/api/siteDispatch/vehicles",
        "goal": "按类型、状态、区域、关键字筛选车辆列表",
        "trigger": "应用筛选、重置、切换视图",
        "resourceGroupKey": "siteDispatch",
        "resourceGroupLabel": "现场调度地图",
        "requestParams": [
          {
            "name": "type",
            "type": "string",
            "required": false,
            "description": "车辆类型筛选"
          },
          {
            "name": "status",
            "type": "string",
            "required": false,
            "description": "车辆状态筛选"
          },
          {
            "name": "area",
            "type": "string",
            "required": false,
            "description": "区域筛选"
          },
          {
            "name": "keyword",
            "type": "string",
            "required": false,
            "description": "关键字搜索车辆"
          },
          {
            "name": "page",
            "type": "integer",
            "required": false,
            "description": "当前页码，默认为1"
          },
          {
            "name": "pageSize",
            "type": "integer",
            "required": false,
            "description": "每页条数，默认为20"
          }
        ],
        "successResponse": {
          "code": 0,
          "message": "success",
          "data": {
            "records": [],
            "pagination": {
              "page": 1,
              "pageSize": 20,
              "total": 0
            },
            "summary": {}
          },
          "traceId": "string"
        },
        "errorResponse": {
          "code": -1,
          "message": "error message",
          "data": null,
          "traceId": "string",
          "error": {
            "code": "VEHICLE_VALIDATION_FAILED",
            "message": "具体的错误原因",
            "details": []
          }
        },
        "errorCodes": [
          {
            "code": "VEHICLE_VALIDATION_FAILED",
            "meaning": "车辆参数校验失败",
            "frontendAdvice": "显示具体字段错误提示"
          },
          {
            "code": "VEHICLE_NOT_FOUND",
            "meaning": "车辆不存在",
            "frontendAdvice": "提示用户重新选择"
          },
          {
            "code": "VEHICLE_SYNC_FAILED",
            "meaning": "车辆数据同步失败",
            "frontendAdvice": "提供重试按钮"
          },
          {
            "code": "500",
            "meaning": "服务器内部错误",
            "frontendAdvice": "统一错误弹窗并提供重试"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782887819107-0-page-3-2-createDispatch",
        "method": "POST",
        "name": "创建现场派车任务",
        "path": "/api/siteDispatch/dispatch",
        "goal": "根据用车申请或紧急派车请求，指定车辆、作业点、优先级后创建并派发任务",
        "trigger": "派发按钮点击",
        "resourceGroupKey": "siteDispatch",
        "resourceGroupLabel": "现场调度地图",
        "requestParams": [
          {
            "name": "dispatchType",
            "type": "string",
            "required": true,
            "description": "派车类型：APPLICATION（用车申请）或 EMERGENCY（紧急派车）"
          },
          {
            "name": "applicationId",
            "type": "string",
            "required": false,
            "description": "当 dispatchType=APPLICATION 时必填，关联的用车申请单ID"
          },
          {
            "name": "vehicleId",
            "type": "string",
            "required": true,
            "description": "指定派发的车辆ID"
          },
          {
            "name": "workPointId",
            "type": "string",
            "required": true,
            "description": "作业点ID（即目的地）"
          },
          {
            "name": "priority",
            "type": "integer",
            "required": true,
            "description": "任务优先级：1-低，2-中，3-高，4-紧急"
          },
          {
            "name": "remark",
            "type": "string",
            "required": false,
            "description": "派车备注信息"
          }
        ],
        "successResponse": {
          "code": 0,
          "message": "success",
          "data": {
            "dispatchId": "string",
            "dispatchStatus": "string",
            "vehicleId": "string",
            "vehiclePlate": "string",
            "driverName": "string",
            "workPointName": "string",
            "priority": "integer",
            "estimatedArrivalTime": "string",
            "createdAt": "string"
          },
          "traceId": "string"
        },
        "errorResponse": {
          "code": "integer",
          "message": "string",
          "data": null,
          "traceId": "string"
        },
        "errorCodes": [
          {
            "code": "VEHICLE_NOT_FOUND",
            "meaning": "指定的车辆不存在或已停用",
            "frontendAdvice": "提示用户重新选择车辆，并刷新车辆列表"
          },
          {
            "code": "WORK_POINT_INVALID",
            "meaning": "作业点无效或不在可调度范围内",
            "frontendAdvice": "提示用户选择有效的作业点"
          },
          {
            "code": "PRIORITY_INVALID",
            "meaning": "优先级数值不合法",
            "frontendAdvice": "提示用户选择正确的优先级"
          },
          {
            "code": "APPLICATION_NOT_FOUND",
            "meaning": "关联的用车申请单不存在或已取消",
            "frontendAdvice": "提示用户确认申请单状态，或转为紧急派车"
          },
          {
            "code": "DISPATCH_FAILED",
            "meaning": "派车创建失败，系统内部错误",
            "frontendAdvice": "提示用户稍后重试，或者联系运维"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782887819107-0-page-4-3-queryAlerts",
        "method": "GET",
        "name": "查询现场异常告警",
        "path": "/api/siteDispatch/alerts",
        "goal": "按告警类型、状态、时间范围查询告警列表",
        "trigger": "筛选、查询历史告警",
        "resourceGroupKey": "siteDispatch",
        "resourceGroupLabel": "现场调度地图",
        "requestParams": [
          {
            "name": "id",
            "type": "string",
            "required": false,
            "description": "业务对象标识，按接口场景可选。"
          }
        ],
        "successResponse": {
          "code": 0,
          "message": "success",
          "data": {
            "key": "contract-scenario-1782887819107-0-page-4-3-queryAlerts",
            "records": [],
            "pagination": {
              "page": 1,
              "pageSize": 20,
              "total": 0
            },
            "summary": {}
          },
          "traceId": "trace-id"
        },
        "errorResponse": {
          "code": 500,
          "message": "接口处理失败",
          "data": null,
          "error": {
            "code": "SITEDISPATCH_FAILED",
            "message": "业务处理失败或状态流转不合法。",
            "details": []
          },
          "traceId": "trace-id"
        },
        "errorCodes": [
          {
            "code": "SITEDISPATCH_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
          },
          {
            "code": "SITEDISPATCH_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782887819107-1-page-1-0-queryTaskList",
        "method": "GET",
        "name": "查询司机任务列表(移动端)",
        "path": "/api/mobile/tasks",
        "goal": "按状态筛选获取任务列表，支持分页加载",
        "trigger": "下拉刷新、分页加载、接收通知",
        "resourceGroupKey": "taskList",
        "resourceGroupLabel": "移动端任务",
        "requestParams": [
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
            "description": "每页条数"
          },
          {
            "name": "status",
            "type": "string",
            "required": false,
            "description": "任务状态筛选，可选值：WAITING / PROCESSING / COMPLETED / CANCELLED"
          },
          {
            "name": "keyword",
            "type": "string",
            "required": false,
            "description": "搜索关键词，匹配任务编号或目的地"
          }
        ],
        "successResponse": {
          "code": 0,
          "message": "success",
          "data": {
            "records": [],
            "pagination": {
              "page": 1,
              "pageSize": 20,
              "total": 100
            },
            "summary": {}
          },
          "traceId": "xxx-trace-id"
        },
        "errorResponse": {
          "code": -1,
          "message": "请求处理失败",
          "data": null,
          "traceId": "xxx-trace-id"
        },
        "errorCodes": [
          {
            "code": "TASK_NOT_FOUND",
            "meaning": "任务不存在或已被删除",
            "frontendAdvice": "提示用户任务已失效，建议刷新列表"
          },
          {
            "code": "STATUS_INVALID",
            "meaning": "传入的状态参数不合法",
            "frontendAdvice": "前端应校验状态值，错误时提示用户重新筛选"
          },
          {
            "code": "SERVER_ERROR",
            "meaning": "服务器内部错误",
            "frontendAdvice": "弹窗提示‘服务器繁忙，请稍后重试’，并提供重试按钮"
          },
          {
            "code": "PARAM_MISSING",
            "meaning": "缺少必填参数",
            "frontendAdvice": "前端需要确保 page 和 pageSize 不为空，否则提示参数错误"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782887819107-1-page-2-1-queryTaskDetail",
        "method": "GET",
        "name": "查询任务详情",
        "path": "/api/mobile/tasks/{id}",
        "goal": "获取任务完整信息，包括车辆、司机、作业点等",
        "trigger": "点击任务项",
        "resourceGroupKey": "taskList",
        "resourceGroupLabel": "移动端任务",
        "requestParams": [
          {
            "name": "id",
            "type": "string",
            "required": false,
            "description": "业务对象标识，按接口场景可选。"
          }
        ],
        "successResponse": {
          "code": 0,
          "message": "success",
          "data": {
            "key": "contract-scenario-1782887819107-1-page-2-1-queryTaskDetail",
            "records": [],
            "pagination": {
              "page": 1,
              "pageSize": 20,
              "total": 0
            },
            "summary": {}
          },
          "traceId": "trace-id"
        },
        "errorResponse": {
          "code": 500,
          "message": "接口处理失败",
          "data": null,
          "error": {
            "code": "TASKLIST_FAILED",
            "message": "业务处理失败或状态流转不合法。",
            "details": []
          },
          "traceId": "trace-id"
        },
        "errorCodes": [
          {
            "code": "TASKLIST_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
          },
          {
            "code": "TASKLIST_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782887819107-1-page-3-2-queryNavigation",
        "method": "GET",
        "name": "查询导航路径",
        "path": "/api/mobile/navigation",
        "goal": "根据当前位置和目标作业点获取路线、距离、预计时间",
        "trigger": "开始导航、切换路线、刷新路线",
        "resourceGroupKey": "taskList",
        "resourceGroupLabel": "移动端任务",
        "requestParams": [
          {
            "name": "latitude",
            "type": "number",
            "required": true,
            "description": "当前位置纬度（WGS84）"
          },
          {
            "name": "longitude",
            "type": "number",
            "required": true,
            "description": "当前位置经度（WGS84）"
          },
          {
            "name": "targetTaskId",
            "type": "string",
            "required": true,
            "description": "目标作业任务 ID，用于定位目标点"
          },
          {
            "name": "mode",
            "type": "string",
            "required": false,
            "description": "导航模式，可选值：driving（默认）、walking"
          }
        ],
        "successResponse": {
          "code": 0,
          "message": "success",
          "data": {
            "route": {
              "waypoints": [
                {
                  "latitude": 22.543,
                  "longitude": 113.943,
                  "name": "当前位置"
                },
                {
                  "latitude": 22.548,
                  "longitude": 113.95,
                  "name": "目标作业点A"
                }
              ],
              "distance": 1200,
              "estimatedTime": 480
            }
          },
          "traceId": "generated-trace-id"
        },
        "errorResponse": {
          "code": -1,
          "message": "error",
          "data": {
            "error": {
              "code": "NAVIGATION_FAILED",
              "message": "无法计算导航路径",
              "details": []
            }
          },
          "traceId": "generated-trace-id"
        },
        "errorCodes": [
          {
            "code": "TASK_NOT_FOUND",
            "meaning": "目标作业任务不存在或已被删除",
            "frontendAdvice": "提示用户任务已失效，返回任务列表"
          },
          {
            "code": "NAVIGATION_FAILED",
            "meaning": "路线计算失败（如起点/终点无效、无通行路径）",
            "frontendAdvice": "显示失败原因，建议用户检查位置或稍后重试"
          },
          {
            "code": "VEHICLE_VALIDATION_FAILED",
            "meaning": "当前车辆不符合导航条件（如未授权、未激活）",
            "frontendAdvice": "引导用户联系管理员或切换到其他车辆"
          },
          {
            "code": "INTERNAL_SERVER_ERROR",
            "meaning": "服务器内部错误",
            "frontendAdvice": "提示网络异常，自动重试最多3次"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782887819107-1-page-4-3-submitFeedback",
        "method": "POST",
        "name": "提交现场反馈",
        "path": "/api/mobile/tasks/{id}/feedback",
        "goal": "上传到达确认时间、照片和备注",
        "trigger": "到达确认、提交反馈",
        "resourceGroupKey": "taskList",
        "resourceGroupLabel": "移动端任务",
        "requestParams": [
          {
            "name": "id",
            "type": "string",
            "required": true,
            "description": "任务ID（路径参数）"
          },
          {
            "name": "arrivalTime",
            "type": "string",
            "required": true,
            "description": "到达确认时间，格式 yyyy-MM-dd HH:mm:ss"
          },
          {
            "name": "photos",
            "type": "array",
            "required": false,
            "description": "现场照片URL列表"
          },
          {
            "name": "remark",
            "type": "string",
            "required": false,
            "description": "备注信息"
          }
        ],
        "successResponse": {
          "code": 0,
          "message": "success",
          "data": {
            "feedbackId": "生成的反馈记录ID"
          },
          "traceId": "请求链路追踪ID"
        },
        "errorResponse": {
          "code": 40001,
          "message": "请求参数错误",
          "data": {
            "error": {
              "code": "PARAM_ERROR",
              "message": "参数校验失败详情",
              "details": []
            }
          },
          "traceId": "请求链路追踪ID"
        },
        "errorCodes": [
          {
            "code": "PARAM_ERROR",
            "meaning": "请求参数校验失败",
            "frontendAdvice": "检查必填字段和格式，提示用户修正"
          },
          {
            "code": "UPLOAD_FAILED",
            "meaning": "文件上传失败",
            "frontendAdvice": "请检查网络后重试"
          },
          {
            "code": "TASK_NOT_FOUND",
            "meaning": "任务不存在",
            "frontendAdvice": "请刷新任务列表"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782887819107-2-page-1-0-verifyEntry",
        "method": "POST",
        "name": "核验入场（门岗移动端）",
        "path": "/api/mobile/entry/verify",
        "goal": "通过扫描车牌或二维码进行入场核验",
        "trigger": "扫描车牌/二维码、手动核验",
        "resourceGroupKey": "entryCheck",
        "resourceGroupLabel": "移动端入场核验",
        "requestParams": [
          {
            "name": "id",
            "type": "string",
            "required": false,
            "description": "业务对象标识，按接口场景可选。"
          }
        ],
        "successResponse": {
          "code": 0,
          "message": "success",
          "data": {
            "key": "contract-scenario-1782887819107-2-page-1-0-verifyEntry",
            "records": [],
            "pagination": {
              "page": 1,
              "pageSize": 20,
              "total": 0
            },
            "summary": {}
          },
          "traceId": "trace-id"
        },
        "errorResponse": {
          "code": 500,
          "message": "接口处理失败",
          "data": null,
          "error": {
            "code": "ENTRYCHECK_FAILED",
            "message": "业务处理失败或状态流转不合法。",
            "details": []
          },
          "traceId": "trace-id"
        },
        "errorCodes": [
          {
            "code": "ENTRYCHECK_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
          },
          {
            "code": "ENTRYCHECK_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782887819107-2-page-2-1-releaseVehicle",
        "method": "POST",
        "name": "放行车辆（门岗移动端）",
        "path": "/api/mobile/entry/release",
        "goal": "确认放行或拒绝入场，记录时间与备注",
        "trigger": "确认放行、拒绝入场、批量放行",
        "resourceGroupKey": "entryCheck",
        "resourceGroupLabel": "移动端入场核验",
        "requestParams": [
          {
            "name": "id",
            "type": "string",
            "required": false,
            "description": "业务对象标识，按接口场景可选。"
          }
        ],
        "successResponse": {
          "code": 0,
          "message": "success",
          "data": {
            "key": "contract-scenario-1782887819107-2-page-2-1-releaseVehicle",
            "records": [],
            "pagination": {
              "page": 1,
              "pageSize": 20,
              "total": 0
            },
            "summary": {}
          },
          "traceId": "trace-id"
        },
        "errorResponse": {
          "code": 500,
          "message": "接口处理失败",
          "data": null,
          "error": {
            "code": "ENTRYCHECK_FAILED",
            "message": "业务处理失败或状态流转不合法。",
            "details": []
          },
          "traceId": "trace-id"
        },
        "errorCodes": [
          {
            "code": "ENTRYCHECK_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
          },
          {
            "code": "ENTRYCHECK_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782887819107-2-page-3-2-queryAlerts",
        "method": "GET",
        "name": "查询入场告警（门岗移动端）",
        "path": "/api/mobile/entry/alerts",
        "goal": "获取入场违规与安全告警列表",
        "trigger": "筛选、查询历史告警",
        "resourceGroupKey": "entryCheck",
        "resourceGroupLabel": "移动端入场核验",
        "requestParams": [
          {
            "name": "id",
            "type": "string",
            "required": false,
            "description": "业务对象标识，按接口场景可选。"
          }
        ],
        "successResponse": {
          "code": 0,
          "message": "success",
          "data": {
            "key": "contract-scenario-1782887819107-2-page-3-2-queryAlerts",
            "records": [],
            "pagination": {
              "page": 1,
              "pageSize": 20,
              "total": 0
            },
            "summary": {}
          },
          "traceId": "trace-id"
        },
        "errorResponse": {
          "code": 500,
          "message": "接口处理失败",
          "data": null,
          "error": {
            "code": "ENTRYCHECK_FAILED",
            "message": "业务处理失败或状态流转不合法。",
            "details": []
          },
          "traceId": "trace-id"
        },
        "errorCodes": [
          {
            "code": "ENTRYCHECK_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
          },
          {
            "code": "ENTRYCHECK_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782887819107-2-page-4-3-queryReleaseRecords",
        "method": "GET",
        "name": "查询放行记录",
        "path": "/api/mobile/entry/releaseRecords",
        "goal": "按时间、车牌、结果查询历史放行记录",
        "trigger": "查询、重置、查看详情",
        "resourceGroupKey": "entryCheck",
        "resourceGroupLabel": "移动端入场核验",
        "requestParams": [
          {
            "name": "id",
            "type": "string",
            "required": false,
            "description": "业务对象标识，按接口场景可选。"
          }
        ],
        "successResponse": {
          "code": 0,
          "message": "success",
          "data": {
            "key": "contract-scenario-1782887819107-2-page-4-3-queryReleaseRecords",
            "records": [],
            "pagination": {
              "page": 1,
              "pageSize": 20,
              "total": 0
            },
            "summary": {}
          },
          "traceId": "trace-id"
        },
        "errorResponse": {
          "code": 500,
          "message": "接口处理失败",
          "data": null,
          "error": {
            "code": "ENTRYCHECK_FAILED",
            "message": "业务处理失败或状态流转不合法。",
            "details": []
          },
          "traceId": "trace-id"
        },
        "errorCodes": [
          {
            "code": "ENTRYCHECK_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
          },
          {
            "code": "ENTRYCHECK_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782887819107-3-page-1-0-queryOperationReport",
        "method": "GET",
        "name": "查询车辆运营报表",
        "path": "/api/report/operations",
        "goal": "按日期范围获取车辆运营统计数据",
        "trigger": "查询、查看详情",
        "resourceGroupKey": "operationReport",
        "resourceGroupLabel": "运营报表",
        "requestParams": [
          {
            "name": "startDate",
            "type": "string",
            "required": true,
            "description": "查询起始日期，格式 yyyy-MM-dd"
          },
          {
            "name": "endDate",
            "type": "string",
            "required": true,
            "description": "查询结束日期，格式 yyyy-MM-dd"
          },
          {
            "name": "page",
            "type": "number",
            "required": false,
            "description": "当前页码，从 1 开始，默认 1"
          },
          {
            "name": "pageSize",
            "type": "number",
            "required": false,
            "description": "每页条数，默认 20"
          }
        ],
        "successResponse": {
          "code": 0,
          "message": "success",
          "data": {
            "records": [],
            "pagination": {
              "page": 1,
              "pageSize": 20,
              "total": 0
            },
            "summary": {}
          },
          "traceId": "string"
        },
        "errorResponse": {
          "code": 1000,
          "message": "error message",
          "data": {
            "error": {
              "code": "ERROR_CODE",
              "message": "详细错误描述",
              "details": []
            }
          },
          "traceId": "string"
        },
        "errorCodes": [
          {
            "code": "INVALID_PARAMS",
            "meaning": "请求参数校验失败",
            "frontendAdvice": "检查必填参数是否符合格式要求"
          },
          {
            "code": "SERVER_ERROR",
            "meaning": "服务器内部错误",
            "frontendAdvice": "稍后重试或联系管理员"
          },
          {
            "code": "DATA_NOT_FOUND",
            "meaning": "未找到匹配数据",
            "frontendAdvice": "展示空状态，提示用户调整查询条件"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782887819107-3-page-2-1-exportReport",
        "method": "POST",
        "name": "导出报表数据",
        "path": "/api/report/export",
        "goal": "按格式和范围导出报表文件",
        "trigger": "导出、重置",
        "resourceGroupKey": "operationReport",
        "resourceGroupLabel": "运营报表",
        "requestParams": [
          {
            "name": "exportFormat",
            "type": "string",
            "required": true,
            "description": "导出文件格式，例如 xlsx、csv"
          },
          {
            "name": "exportScope",
            "type": "string",
            "required": true,
            "description": "导出范围，可选值：currentPage, all, selected"
          },
          {
            "name": "selectedIds",
            "type": "array",
            "required": false,
            "description": "当 exportScope 为 selected 时，需要传入选中记录的 ID 数组"
          },
          {
            "name": "filters",
            "type": "object",
            "required": false,
            "description": "当前报表的筛选条件，用于导出全部时保持与页面一致的筛选"
          }
        ],
        "successResponse": {
          "code": 0,
          "message": "success",
          "data": {
            "fileUrl": "string",
            "fileName": "string"
          },
          "traceId": "string"
        },
        "errorResponse": {
          "code": -1,
          "message": "导出失败",
          "data": {
            "error": {
              "code": "EXPORT_ERROR",
              "message": "具体错误原因",
              "details": []
            }
          },
          "traceId": "string"
        },
        "errorCodes": [
          {
            "code": "EXPORT_FORMAT_NOT_SUPPORTED",
            "meaning": "不支持的导出格式",
            "frontendAdvice": "提示用户选择支持的格式"
          },
          {
            "code": "EXPORT_DATA_TOO_LARGE",
            "meaning": "导出数据量过大",
            "frontendAdvice": "提示用户缩小导出范围或分批导出"
          },
          {
            "code": "EXPORT_SERVICE_ERROR",
            "meaning": "导出服务异常",
            "frontendAdvice": "提示用户稍后重试"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      },
      {
        "key": "contract-scenario-1782887819107-3-page-3-2-queryOptimizationAdvice",
        "method": "GET",
        "name": "查询资源配置优化建议",
        "path": "/api/report/optimization",
        "goal": "根据时间范围、车辆类型、区域获取热点图、推荐列表和费用汇总",
        "trigger": "查询分析、预览优化报告",
        "resourceGroupKey": "operationReport",
        "resourceGroupLabel": "运营报表",
        "requestParams": [
          {
            "name": "id",
            "type": "string",
            "required": false,
            "description": "业务对象标识，按接口场景可选。"
          }
        ],
        "successResponse": {
          "code": 0,
          "message": "success",
          "data": {
            "key": "contract-scenario-1782887819107-3-page-3-2-queryOptimizationAdvice",
            "records": [],
            "pagination": {
              "page": 1,
              "pageSize": 20,
              "total": 0
            },
            "summary": {}
          },
          "traceId": "trace-id"
        },
        "errorResponse": {
          "code": 500,
          "message": "接口处理失败",
          "data": null,
          "error": {
            "code": "OPERATIONREPORT_FAILED",
            "message": "业务处理失败或状态流转不合法。",
            "details": []
          },
          "traceId": "trace-id"
        },
        "errorCodes": [
          {
            "code": "OPERATIONREPORT_VALIDATION_FAILED",
            "meaning": "请求参数或状态流转不合法。",
            "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
          },
          {
            "code": "OPERATIONREPORT_SYNC_FAILED",
            "meaning": "服务端保存或同步失败。",
            "frontendAdvice": "展示失败原因并提供重试入口。"
          }
        ],
        "detailGenerated": true,
        "detailStatus": "done",
        "detailError": "",
        "detailGeneratedAt": ""
      }
    ],
    "selectedContract": {
      "key": "contract-scenario-1782831312544-3-page-2-1-verifyExit",
      "method": "POST",
      "name": "核验出场车辆",
      "path": "/api/gate/exit/verify",
      "goal": "通过扫描或输入车牌进行出场核验，返回车辆信息和任务状态",
      "trigger": "扫描车牌/二维码、核验通过/不通过",
      "resourceGroupKey": "gate",
      "resourceGroupLabel": "门岗核验",
      "requestParams": [
        {
          "name": "id",
          "type": "string",
          "required": false,
          "description": "业务对象标识，按接口场景可选。"
        }
      ],
      "successResponse": {
        "code": 0,
        "message": "success",
        "data": {
          "key": "contract-scenario-1782831312544-3-page-2-1-verifyExit",
          "records": [],
          "pagination": {
            "page": 1,
            "pageSize": 20,
            "total": 0
          },
          "summary": {}
        },
        "traceId": "trace-id"
      },
      "errorResponse": {
        "code": 500,
        "message": "接口处理失败",
        "data": null,
        "error": {
          "code": "GATE_FAILED",
          "message": "业务处理失败或状态流转不合法。",
          "details": []
        },
        "traceId": "trace-id"
      },
      "errorCodes": [
        {
          "code": "GATE_VALIDATION_FAILED",
          "meaning": "请求参数或状态流转不合法。",
          "frontendAdvice": "在页面字段旁提示错误，并保留用户输入。"
        },
        {
          "code": "GATE_SYNC_FAILED",
          "meaning": "服务端保存或同步失败。",
          "frontendAdvice": "展示失败原因并提供重试入口。"
        }
      ],
      "detailGenerated": true,
      "detailStatus": "done",
      "detailError": "",
      "detailGeneratedAt": "2026-07-01T14:58:12.502Z"
    },
    "responseStandard": {
      "sections": [
        {
          "key": "legacy",
          "title": "统一返回 Envelope",
          "description": "历史保存的响应格式已兼容显示，后续重新生成会采用新的统一结构。",
          "items": [
            {
              "name": "code",
              "description": 0
            },
            {
              "name": "message",
              "description": "success"
            },
            {
              "name": "data",
              "description": {}
            }
          ]
        },
        {
          "key": "pagination",
          "title": "列表分页 Data",
          "description": "查询列表类接口统一把分页、统计和数据记录放在 data 内，避免每个接口重复定义。",
          "items": [
            {
              "name": "data.records",
              "description": "array。当前页业务记录。"
            },
            {
              "name": "data.pagination.page",
              "description": "number。当前页码，从 1 开始。"
            },
            {
              "name": "data.pagination.pageSize",
              "description": "number。每页条数。"
            },
            {
              "name": "data.pagination.total",
              "description": "number。符合筛选条件的总记录数。"
            },
            {
              "name": "data.summary",
              "description": "object。当前查询范围内的统计摘要，可为空对象。"
            }
          ]
        },
        {
          "key": "error",
          "title": "失败与错误信息",
          "description": "失败响应仍保留统一外壳，错误原因放入 error，方便前端统一弹窗、字段提示和重试。",
          "items": [
            {
              "name": "error.code",
              "description": "string。稳定错误码，例如 VEHICLE_VALIDATION_FAILED。"
            },
            {
              "name": "error.message",
              "description": "string。失败原因的可读说明。"
            },
            {
              "name": "error.details",
              "description": "array。字段级错误、状态流转错误或校验详情。"
            }
          ]
        },
        {
          "key": "frontend",
          "title": "前端处理规则",
          "description": "每个接口契约只描述自身参数和业务 data，下面这些规则作为全局约定复用。",
          "items": [
            {
              "name": "成功判断",
              "description": "code === 0 视为成功；否则进入统一错误处理。"
            },
            {
              "name": "表单错误",
              "description": "error.details 中带 field 时，优先落到对应字段旁。"
            },
            {
              "name": "空状态",
              "description": "records 为空数组且 code 为 0 时展示空状态，不作为异常。"
            },
            {
              "name": "重试入口",
              "description": "网络错误、5xx 或 *_SYNC_FAILED 错误码需要保留重试操作。"
            }
          ]
        }
      ]
    },
    "generationSource": {
      "interactionPageCount": 35
    },
    "confirmedAt": "2026-07-02T03:26:35.146Z"
  }
}
```
<!-- FDE_STEP_RESULT_JSON_END -->
