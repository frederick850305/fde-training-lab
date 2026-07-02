export const frontendPrototypeSuggestionMock = {
  viewFiles: [
    {
      file: 'DispatchMapView.vue',
      responsibility: '实时地图看板，展示车辆位置、状态和调度概览。',
      source: '页面清单设计 + API 契约',
      priority: 'P0',
    },
    {
      file: 'OnsiteVehicleFilter.vue',
      responsibility: '按车型、状态、区域、距离筛选车辆。',
      source: '页面清单设计 + API 契约',
      priority: 'P0',
    },
    {
      file: 'OnsiteDispatchDialog.vue',
      responsibility: '调度员创建派车任务弹窗。',
      source: '页面清单设计 + API 契约',
      priority: 'P0',
    },
    {
      file: 'OnsiteExceptionAlert.vue',
      responsibility: '实时车辆异常告警面板。',
      source: '页面清单设计 + API 契约',
      priority: 'P0',
    },
    {
      file: 'TaskListView.vue',
      responsibility: '司机个人任务列表，按状态切换。',
      source: '页面清单设计 + API 契约',
      priority: 'P0',
    },
    {
      file: 'TaskDetailView.vue',
      responsibility: '任务详情，支持状态流转和反馈。',
      source: '页面清单设计 + API 契约',
      priority: 'P0',
    },
    {
      file: 'NavigationView.vue',
      responsibility: '驾驶员导航视图，路线规划和到达反馈。',
      source: '页面清单设计 + API 契约',
      priority: 'P1',
    },
    {
      file: 'SiteFeedbackView.vue',
      responsibility: '现场作业反馈表单，支持拍照和备注。',
      source: '页面清单设计 + API 契约',
      priority: 'P1',
    },
    {
      file: 'EntryCheckPanel.vue',
      responsibility: '入场检查面板，车辆和人员资质核验。',
      source: '页面清单设计 + API 契约',
      priority: 'P1',
    },
    {
      file: 'AlertPanel.vue',
      responsibility: '告警汇总面板，多类型异常统一展示。',
      source: '页面清单设计 + API 契约',
      priority: 'P1',
    },
    {
      file: 'ReleaseManagementPanel.vue',
      responsibility: '放行管理面板，审核和放行操作。',
      source: '页面清单设计 + API 契约',
      priority: 'P1',
    },
    {
      file: 'ReleaseRecordQueryView.vue',
      responsibility: '放行记录查询，支持按时间、车辆筛选。',
      source: '页面清单设计 + API 契约',
      priority: 'P2',
    },
    {
      file: 'StatisticsAnalysisView.vue',
      responsibility: '统计分析看板，多维度数据图表。',
      source: '页面清单设计 + API 契约',
      priority: 'P2',
    },
    {
      file: 'ReportExportView.vue',
      responsibility: '报表导出视图，支持多格式导出。',
      source: '页面清单设计 + API 契约',
      priority: 'P2',
    },
    {
      file: 'ResourceAllocationView.vue',
      responsibility: '资源分配视图，车辆和人员排班。',
      source: '页面清单设计 + API 契约',
      priority: 'P2',
    },
  ],
  componentFiles: [
    {
      file: 'MetricCard.vue',
      responsibility: '展示单个统计指标卡片：数值 + 标签 + 趋势箭头。',
      reusedBy: ['DispatchMapView.vue', 'StatisticsAnalysisView.vue', 'AlertPanel.vue'],
      props: [
        { name: 'label', type: 'String', required: true, default: '', description: '指标名称' },
        { name: 'value', type: 'Number|String', required: true, default: '0', description: '指标数值' },
        { name: 'unit', type: 'String', required: false, default: "''", description: '单位（辆/次/分钟）' },
        { name: 'trend', type: 'String', required: false, default: "''", description: '趋势方向：up/down/stable' },
        { name: 'color', type: 'String', required: false, default: "'primary'", description: '主题色：primary/success/warning/danger' },
      ],
      events: [{ name: 'click', payload: 'void', description: '点击卡片时触发，用于跳转详情' }],
      slots: [],
    },
    {
      file: 'StatusTag.vue',
      responsibility: '展示任务状态、风险状态、异常状态的彩色标签。',
      reusedBy: ['TaskListView.vue', 'TaskDetailView.vue', 'AlertPanel.vue', 'EntryCheckPanel.vue'],
      props: [
        { name: 'status', type: 'String', required: true, default: '', description: '状态值：pending/inProgress/completed/cancelled' },
        { name: 'size', type: 'String', required: false, default: "'md'", description: '尺寸：sm/md/lg' },
        { name: 'dot', type: 'Boolean', required: false, default: 'false', description: '是否显示圆点指示器' },
      ],
      events: [],
      slots: [{ name: 'default', description: '自定义标签文字内容，默认显示 status 映射的中文' }],
    },
    {
      file: 'DataTable.vue',
      responsibility: '通用数据表格：排序、分页、行选择、自定义列。',
      reusedBy: ['ReleaseRecordQueryView.vue', 'AlertPanel.vue', 'EntryCheckPanel.vue'],
      props: [
        { name: 'columns', type: 'Array', required: true, default: '[]', description: '列定义：[{ key, title, sortable, width }]' },
        { name: 'data', type: 'Array', required: true, default: '[]', description: '表格数据' },
        { name: 'loading', type: 'Boolean', required: false, default: 'false', description: '加载状态' },
        { name: 'selectable', type: 'Boolean', required: false, default: 'false', description: '是否支持行选择' },
        { name: 'pageSize', type: 'Number', required: false, default: '20', description: '每页条数' },
      ],
      events: [
        { name: 'sort-change', payload: '{ key, order }', description: '排序变更' },
        { name: 'selection-change', payload: 'Array', description: '选中行变更' },
        { name: 'row-click', payload: 'Object', description: '点击行' },
      ],
      slots: [{ name: 'empty', description: '自定义空状态内容' }],
    },
    {
      file: 'EmptyState.vue',
      responsibility: '统一空状态展示：插图 + 提示文字 + 操作按钮。',
      reusedBy: ['TaskListView.vue', 'EntryCheckPanel.vue', 'ReleaseRecordQueryView.vue'],
      props: [
        { name: 'title', type: 'String', required: false, default: "'暂无数据'", description: '空状态标题' },
        { name: 'description', type: 'String', required: false, default: "''", description: '补充说明文字' },
        { name: 'actionLabel', type: 'String', required: false, default: "''", description: '操作按钮文字' },
        { name: 'image', type: 'String', required: false, default: "'default'", description: '插图类型：default/search/error' },
      ],
      events: [{ name: 'action', payload: 'void', description: '点击操作按钮' }],
      slots: [{ name: 'extra', description: '底部额外内容区域' }],
    },
    {
      file: 'PageHeader.vue',
      responsibility: '页面标题栏：标题 + 面包屑 + 右侧操作按钮区域。',
      reusedBy: ['所有页面'],
      props: [
        { name: 'title', type: 'String', required: true, default: '', description: '页面标题' },
        { name: 'breadcrumb', type: 'Array', required: false, default: '[]', description: '面包屑：[{ label, path }]' },
      ],
      events: [],
      slots: [{ name: 'actions', description: '右侧操作按钮区域' }],
    },
    {
      file: 'FilterBar.vue',
      responsibility: '通用筛选栏：多条件筛选 + 搜索框 + 查询/重置按钮。',
      reusedBy: ['OnsiteVehicleFilter.vue', 'TaskListView.vue', 'ReleaseRecordQueryView.vue'],
      props: [
        { name: 'filters', type: 'Array', required: true, default: '[]', description: '筛选项定义：[{ key, label, type, options }]' },
        { name: 'modelValue', type: 'Object', required: true, default: '{}', description: 'v-model 绑定的筛选值' },
      ],
      events: [
        { name: 'update:modelValue', payload: 'Object', description: '筛选值变更' },
        { name: 'search', payload: 'Object', description: '点击查询' },
        { name: 'reset', payload: 'void', description: '点击重置' },
      ],
      slots: [],
    },
    {
      file: 'ConfirmDialog.vue',
      responsibility: '二次确认弹窗：警告图标 + 确认文字 + 取消/确认按钮。',
      reusedBy: ['OnsiteDispatchDialog.vue', 'TaskDetailView.vue', 'EntryCheckPanel.vue'],
      props: [
        { name: 'visible', type: 'Boolean', required: true, default: 'false', description: '是否显示' },
        { name: 'title', type: 'String', required: false, default: "'确认操作'", description: '弹窗标题' },
        { name: 'message', type: 'String', required: false, default: "''", description: '确认提示文字' },
        { name: 'confirmText', type: 'String', required: false, default: "'确认'", description: '确认按钮文字' },
        { name: 'danger', type: 'Boolean', required: false, default: 'false', description: '是否为危险操作（确认按钮变红）' },
      ],
      events: [
        { name: 'confirm', payload: 'void', description: '点击确认' },
        { name: 'cancel', payload: 'void', description: '点击取消' },
      ],
      slots: [],
    },
    {
      file: 'ToastNotification.vue',
      responsibility: '全局 Toast 通知：成功/错误/警告/信息四种类型。',
      reusedBy: ['所有页面（全局注册）'],
      props: [],
      events: [],
      slots: [],
      usage: '通过 provide/inject 或全局事件总线调用：$toast.success("操作成功")、$toast.error("操作失败")',
    },
  ],
  mockDataFiles: [
    {
      file: 'mockEnums.js',
      content: '全局状态枚举和常量定义。',
      usedBy: ['所有页面和组件'],
      schema: [
        { field: 'TASK_STATUS', type: 'Object', description: '{ PENDING: "待接单", IN_PROGRESS: "进行中", COMPLETED: "已完成", CANCELLED: "已取消" }' },
        { field: 'VEHICLE_STATUS', type: 'Object', description: '{ ONLINE: "在线", OFFLINE: "离线", DISPATCHED: "已派车", MAINTENANCE: "维修中" }' },
        { field: 'ALERT_LEVEL', type: 'Object', description: '{ INFO: "提示", WARNING: "警告", CRITICAL: "严重" }' },
        { field: 'ENTRY_CHECK_STATUS', type: 'Object', description: '{ PENDING: "待检查", PASSED: "已通过", REJECTED: "已驳回" }' },
      ],
    },
    {
      file: 'mockDispatch.js',
      content: '调度工作台数据：车辆列表、调度统计、实时告警。',
      usedBy: ['DispatchMapView.vue', 'OnsiteVehicleFilter.vue', 'OnsiteExceptionAlert.vue'],
      schema: [
        { field: 'vehicles', type: 'Array<Vehicle>', description: '车辆列表，Vehicle: { id, plate, type, status, lat, lng, driver }' },
        { field: 'dashboardStats', type: 'Object', description: '{ onlineVehicles, pendingTasks, inProgressTasks, alertCount }' },
        { field: 'activeAlerts', type: 'Array<Alert>', description: '实时告警，Alert: { id, vehicleId, level, message, time }' },
      ],
    },
    {
      file: 'mockTasks.js',
      content: '任务数据：任务列表、任务详情、状态流转。',
      usedBy: ['TaskListView.vue', 'TaskDetailView.vue', 'OnsiteDispatchDialog.vue'],
      schema: [
        { field: 'tasks', type: 'Array<Task>', description: '任务列表，Task: { id, name, vehicleId, driverId, status, startTime, endTime, origin, destination, feedback }' },
        { field: 'availableVehicles', type: 'Array', description: '可用车辆简要列表（id + plate）' },
        { field: 'availableDrivers', type: 'Array', description: '可用司机简要列表（id + name）' },
      ],
    },
    {
      file: 'mockEntry.js',
      content: '入场检查数据：待检查列表、检查项、核验记录。',
      usedBy: ['EntryCheckPanel.vue', 'ReleaseManagementPanel.vue'],
      schema: [
        { field: 'entryChecks', type: 'Array<EntryCheck>', description: '入场记录，EntryCheck: { id, plate, driver, entryTime, status, checkItems }' },
        { field: 'checkItems', type: 'Array', description: '检查项：[{ name, passed, comment }]' },
        { field: 'releaseList', type: 'Array<Release>', description: '放行记录，Release: { id, entryId, plate, status, approver, time }' },
      ],
    },
    {
      file: 'mockAlerts.js',
      content: '告警数据：多类型告警汇总、告警统计。',
      usedBy: ['AlertPanel.vue', 'OnsiteExceptionAlert.vue'],
      schema: [
        { field: 'alerts', type: 'Array<Alert>', description: '告警列表，Alert: { id, type, level, vehicleId, message, status, createdAt, handledBy }' },
        { field: 'alertStats', type: 'Object', description: '{ total, pending, resolved, byLevel: { info, warning, critical } }' },
      ],
    },
    {
      file: 'mockStatistics.js',
      content: '统计数据：运营概览、趋势数据、分维度明细。',
      usedBy: ['StatisticsAnalysisView.vue', 'ReportExportView.vue'],
      schema: [
        { field: 'overviewStats', type: 'Object', description: '{ totalTasks, completionRate, avgResponseTime, exceptionRate }' },
        { field: 'trendData', type: 'Array<TrendPoint>', description: '趋势：[{ date, value, category }]' },
        { field: 'detailRecords', type: 'Array<Record>', description: '明细：[{ id, date, type, vehicleId, ... }]' },
        { field: 'reportTypes', type: 'Array', description: '可导出报表类型：[{ type, name, format }]' },
      ],
    },
  ],
  generationSteps: [
    {
      step: 1,
      title: '先生成 mock 数据',
      description: '先创建 prototypeMockData.js，保证页面可以独立运行和展示。',
    },
    {
      step: 2,
      title: '再生成通用组件',
      description: '优先生成 MetricCard、StatusTag、DataTable、EmptyState，避免页面重复代码。',
    },
    {
      step: 3,
      title: '再生成 P0 页面',
      description: '先完成实时地图、车辆筛选、派车弹窗、异常告警、任务列表、任务详情 6 个 P0 核心页面。',
    },
    {
      step: 4,
      title: '最后预留 API 调用层',
      description: '先用 mock 数据，后续再替换为 FastAPI 请求，接口结构按 API 契约保持一致。',
    },
  ],
  stepPrompts: [
    {
      step: 1,
      title: '生成 Mock 数据和枚举常量',
      prompt: `请基于以下 mock 数据 Schema 生成前端 mock 数据文件。

要求：
1. 生成 mockEnums.js：包含所有状态枚举常量（TASK_STATUS、VEHICLE_STATUS、ALERT_LEVEL 等）。
2. 生成 mockDispatch.js、mockTasks.js、mockEntry.js、mockAlerts.js、mockStatistics.js。
3. 每个 mock 文件导出默认数据数组和辅助查询函数（如 getTaskById、filterByStatus）。
4. 数据量适中：列表类 15-30 条，统计类 4-6 个指标。
5. 使用 ES Module 导出（export const / export default）。
6. 数据之间有关联性（如 task.vehicleId 能匹配到 vehicles 中的车辆）。`,
    },
    {
      step: 2,
      title: '生成通用组件',
      prompt: `请基于以下组件接口契约生成 Vue3 通用组件。

要求：
1. 使用 <script setup> + Composition API。
2. 按 Props/Events/Slots 定义严格实现接口。
3. MetricCard 支持 4 种主题色，trend 箭头动画。
4. StatusTag 根据 status 自动映射颜色和中文标签。
5. DataTable 支持排序、分页、行选择，空状态用 EmptyState。
6. EmptyState 支持 3 种插图类型，action 按钮可选。
7. ConfirmDialog 支持 danger 模式（红色确认按钮）。
8. ToastNotification 通过 provide/inject 全局使用。
9. 所有组件不引入外部 UI 库，纯 CSS 实现。
10. 组件样式使用 scoped CSS，颜色值引用 CSS 变量。`,
    },
    {
      step: 3,
      title: '生成 P0/P1/P2 页面',
      prompt: `请基于以下页面规格详情生成 Vue3 页面组件。

要求：
1. 先按 P0 → P1 → P2 优先级顺序生成，每生成一个页面后确认无误再继续。
2. 使用 <script setup> + Composition API。
3. 严格按照 layoutZones 划分页面区域。
4. 严格实现 uiStates（loading/empty/error/success + 业务状态）。
5. 严格实现 keyInteractions 中描述的所有交互行为。
6. 页面通过 mock 数据独立运行，不依赖真实后端。
7. 使用已生成的通用组件（MetricCard、StatusTag、DataTable、EmptyState 等）。
8. API 调用先封装为独立的 api/ 模块，再在页面中调用 mock 数据。
9. 路由跳转使用 vue-router 的 useRouter。
10. 样式使用 scoped CSS，响应式适配 mobile/tablet/desktop。`,
    },
    {
      step: 4,
      title: '生成路由配置和 API 调用层',
      prompt: `请基于导航路由设计和页面-API 映射生成路由配置和 API 调用模块。

要求：
1. 生成 router/index.js：按导航分组配置路由，设置默认页和 404 页面。
2. 生成 api/ 目录下的 API 调用模块（每组业务一个文件）。
3. API 模块先使用 mock 数据直接返回，保留 async/await 模式便于后续替换。
4. API 返回结构统一为 { code, message, data, traceId }。
5. 在 main.js 中注册路由和全局 Toast 插件。
6. App.vue 中使用 <router-view> 作为路由出口。
7. 侧边栏导航根据 navigationRoutes 生成。`,
    },
  ],
  pageApiMapping: [
    {
      page: 'DispatchMapView.vue',
      apis: [
        { method: 'GET', path: '/api/dispatch/dashboard', usage: '页面加载时获取调度工作台数据' },
        { method: 'GET', path: '/api/vehicles/status', usage: '获取所有车辆实时状态' },
        { method: 'GET', path: '/api/alerts', usage: '获取当前异常告警列表' },
      ],
    },
    {
      page: 'OnsiteVehicleFilter.vue',
      apis: [
        { method: 'GET', path: '/api/vehicles', usage: '按条件筛选车辆列表' },
        { method: 'GET', path: '/api/vehicles/status', usage: '获取车辆状态枚举值' },
      ],
    },
    {
      page: 'OnsiteDispatchDialog.vue',
      apis: [
        { method: 'POST', path: '/api/dispatch/tasks', usage: '创建并下发派车任务' },
        { method: 'GET', path: '/api/vehicles/available', usage: '获取可用车辆列表' },
        { method: 'GET', path: '/api/drivers/available', usage: '获取可用司机列表' },
      ],
    },
    {
      page: 'OnsiteExceptionAlert.vue',
      apis: [
        { method: 'GET', path: '/api/alerts', usage: '获取实时异常告警列表' },
        { method: 'PUT', path: '/api/alerts/{id}/handle', usage: '处理/确认异常告警' },
      ],
    },
    {
      page: 'TaskListView.vue',
      apis: [
        { method: 'GET', path: '/api/tasks', usage: '获取当前司机的任务列表' },
        { method: 'PUT', path: '/api/tasks/{id}/status', usage: '更新任务状态（接单/开始/完成）' },
      ],
    },
    {
      page: 'TaskDetailView.vue',
      apis: [
        { method: 'GET', path: '/api/tasks/{id}', usage: '获取任务详细信息' },
        { method: 'PUT', path: '/api/tasks/{id}/status', usage: '更新任务状态流转' },
        { method: 'POST', path: '/api/tasks/{id}/feedback', usage: '提交任务完成反馈' },
      ],
    },
    {
      page: 'NavigationView.vue',
      apis: [
        { method: 'GET', path: '/api/navigation/route', usage: '获取从当前点到目的地的路线' },
        { method: 'POST', path: '/api/navigation/arrival', usage: '确认到达目的地' },
      ],
    },
    {
      page: 'SiteFeedbackView.vue',
      apis: [
        { method: 'POST', path: '/api/feedback', usage: '提交现场作业反馈（含图片）' },
        { method: 'GET', path: '/api/feedback/categories', usage: '获取反馈类型枚举' },
      ],
    },
    {
      page: 'EntryCheckPanel.vue',
      apis: [
        { method: 'GET', path: '/api/entry/check', usage: '获取入场待检查列表' },
        { method: 'PUT', path: '/api/entry/check/{id}/verify', usage: '核验车辆/人员资质' },
        { method: 'POST', path: '/api/entry/check/{id}/reject', usage: '驳回不合格入场申请' },
      ],
    },
    {
      page: 'AlertPanel.vue',
      apis: [
        { method: 'GET', path: '/api/alerts', usage: '获取多类型告警汇总列表' },
        { method: 'PUT', path: '/api/alerts/{id}/handle', usage: '处理告警' },
        { method: 'GET', path: '/api/alerts/statistics', usage: '获取告警统计摘要' },
      ],
    },
    {
      page: 'ReleaseManagementPanel.vue',
      apis: [
        { method: 'GET', path: '/api/release/pending', usage: '获取待放行列表' },
        { method: 'PUT', path: '/api/release/{id}/approve', usage: '审核通过并放行' },
        { method: 'PUT', path: '/api/release/{id}/reject', usage: '驳回放行申请' },
      ],
    },
    {
      page: 'ReleaseRecordQueryView.vue',
      apis: [
        { method: 'GET', path: '/api/release/records', usage: '按条件查询放行记录' },
        { method: 'GET', path: '/api/release/{id}', usage: '获取单条放行记录详情' },
      ],
    },
    {
      page: 'StatisticsAnalysisView.vue',
      apis: [
        { method: 'GET', path: '/api/statistics/overview', usage: '获取运营统计概览数据' },
        { method: 'GET', path: '/api/statistics/trend', usage: '获取趋势图表数据' },
        { method: 'GET', path: '/api/statistics/detail', usage: '获取分维度统计明细' },
      ],
    },
    {
      page: 'ReportExportView.vue',
      apis: [
        { method: 'GET', path: '/api/reports/types', usage: '获取可导出报表类型列表' },
        { method: 'POST', path: '/api/reports/export', usage: '提交导出请求并下载文件' },
      ],
    },
    {
      page: 'ResourceAllocationView.vue',
      apis: [
        { method: 'GET', path: '/api/resources/vehicles', usage: '获取车辆资源池' },
        { method: 'GET', path: '/api/resources/drivers', usage: '获取司机排班情况' },
        { method: 'PUT', path: '/api/resources/allocate', usage: '调整车辆/人员分配' },
      ],
    },
  ],
  navigationRoutes: [
    {
      group: '调度指挥',
      icon: '📡',
      routes: [
        { path: '/dispatch/map', component: 'DispatchMapView.vue', title: '调度地图', default: true },
        { path: '/dispatch/filter', component: 'OnsiteVehicleFilter.vue', title: '车辆筛选' },
        { path: '/dispatch/alert', component: 'OnsiteExceptionAlert.vue', title: '异常告警' },
      ],
    },
    {
      group: '任务执行',
      icon: '📋',
      routes: [
        { path: '/tasks/list', component: 'TaskListView.vue', title: '任务列表', default: true },
        { path: '/tasks/navigation', component: 'NavigationView.vue', title: '导航' },
        { path: '/tasks/feedback', component: 'SiteFeedbackView.vue', title: '现场反馈' },
      ],
    },
    {
      group: '场地管理',
      icon: '🏗️',
      routes: [
        { path: '/site/entry-check', component: 'EntryCheckPanel.vue', title: '入场检查', default: true },
        { path: '/site/alert-panel', component: 'AlertPanel.vue', title: '告警面板' },
        { path: '/site/release', component: 'ReleaseManagementPanel.vue', title: '放行管理' },
      ],
    },
    {
      group: '数据看板',
      icon: '📊',
      routes: [
        { path: '/data/statistics', component: 'StatisticsAnalysisView.vue', title: '统计分析', default: true },
        { path: '/data/report-export', component: 'ReportExportView.vue', title: '报表导出' },
        { path: '/data/resource-allocation', component: 'ResourceAllocationView.vue', title: '资源分配' },
        { path: '/data/release-records', component: 'ReleaseRecordQueryView.vue', title: '放行记录' },
      ],
    },
  ],
  pageDetailSpecs: [
    {
      file: 'DispatchMapView.vue',
      layoutZones: [
        { zone: '顶部统计栏', content: '4 个 MetricCard：在线车辆、待派任务、进行中任务、异常告警数' },
        { zone: '地图区域', content: '全屏地图，标注车辆位置（不同颜色表示不同状态），点击车辆弹出信息浮窗' },
        { zone: '底部操作栏', content: '筛选条件（区域、车型）、刷新按钮、进入派车弹窗的入口按钮' },
      ],
      uiStates: [
        { state: 'loading', content: '地图骨架屏 + 统计栏数值闪烁占位' },
        { state: 'empty', content: '地图正常显示，统计栏显示 0，提示"暂无车辆在线"' },
        { state: 'error', content: '地图区域显示错误提示 + 重试按钮，统计栏保留上次数据' },
        { state: 'success', content: '地图正常渲染，统计栏实时更新，车辆标记可交互' },
      ],
      keyInteractions: [
        '点击车辆标记 → 弹出车辆详情浮窗',
        '点击"创建任务"按钮 → 打开 OnsiteDispatchDialog 弹窗',
        '筛选条件变更 → 地图和统计栏联动刷新',
        '异常告警数 > 0 时红色角标闪烁',
      ],
    },
    {
      file: 'OnsiteDispatchDialog.vue',
      layoutZones: [
        { zone: '弹窗标题栏', content: '标题"创建派车任务" + 关闭按钮' },
        { zone: '表单区域', content: '选择车辆（下拉搜索）、选择司机、任务类型、备注、预计时长' },
        { zone: '底部按钮', content: '取消 + 确认派车（主按钮）' },
      ],
      uiStates: [
        { state: 'loading', content: '车辆/司机下拉框显示加载中，提交按钮禁用' },
        { state: 'empty', content: '车辆下拉列表为空时提示"暂无可用车辆"' },
        { state: 'error', content: '提交失败 toast 提示错误原因，表单保留填写内容' },
        { state: 'validating', content: '必填项为空时字段标红 + 错误提示文字' },
      ],
      keyInteractions: [
        '选择车辆后实时显示车辆当前状态',
        '选择司机后校验司机是否有冲突任务',
        '提交成功后关闭弹窗，地图上的车辆状态更新',
      ],
    },
    {
      file: 'TaskListView.vue',
      layoutZones: [
        { zone: '顶部筛选栏', content: '状态 Tab 切换（全部/待接单/进行中/已完成）+ 日期筛选' },
        { zone: '任务卡片列表', content: '每张卡片显示：任务名称、派车时间、起点→终点、状态标签、操作按钮' },
        { zone: '空状态提示', content: '无任务时显示 EmptyState 组件' },
      ],
      uiStates: [
        { state: 'loading', content: '骨架屏卡片 × 3' },
        { state: 'empty', content: 'EmptyState："暂无任务"，配图 + 下拉刷新提示' },
        { state: 'error', content: '列表区域显示错误 + 重试' },
        { state: 'success', content: '任务卡片按时间倒序排列，状态标签颜色区分' },
      ],
      keyInteractions: [
        '点击任务卡片 → 跳转 TaskDetailView',
        '状态 Tab 切换 → 列表动画过渡刷新',
        '下拉刷新 → 重新加载当前状态列表',
        '滑动操作：左滑显示"接单"/"开始"快捷操作',
      ],
    },
    {
      file: 'TaskDetailView.vue',
      layoutZones: [
        { zone: '顶部信息栏', content: '任务名称、状态标签（大号）、派车时间、预计时长' },
        { zone: '详情区', content: '车辆信息卡片（车牌、车型、位置）、路线信息（起点→终点→途径点）、司机信息' },
        { zone: '操作区', content: '状态流转按钮（接单→开始→完成→提交反馈），每步按钮根据当前状态显示' },
        { zone: '反馈区', content: '任务完成后显示反馈表单：评分、文字备注、拍照上传' },
      ],
      uiStates: [
        { state: 'loading', content: '详情骨架屏' },
        { state: 'error', content: '加载失败提示 + 返回按钮' },
        { state: 'pending', content: '显示"接单"主按钮，其他信息只读' },
        { state: 'inProgress', content: '显示"完成任务"按钮 + "开始导航"入口' },
        { state: 'completed', content: '显示反馈表单，信息区变为只读回顾' },
      ],
      keyInteractions: [
        '状态流转点击需二次确认弹窗',
        '点击"开始导航"→ 跳转 NavigationView',
        '反馈提交后任务标记为"已评价"',
        '拍照上传支持相机 + 相册两种方式',
      ],
    },
    {
      file: 'EntryCheckPanel.vue',
      layoutZones: [
        { zone: '筛选栏', content: '状态筛选（待检查/已通过/已驳回）+ 搜索车牌号' },
        { zone: '检查列表', content: '每条记录显示：车牌号、司机、入场时间、检查项状态、操作按钮' },
        { zone: '详情抽屉', content: '点击记录展开右侧抽屉，显示全部检查项及核验结果' },
      ],
      uiStates: [
        { state: 'loading', content: '表格骨架屏' },
        { state: 'empty', content: 'EmptyState："暂无待检查车辆"' },
        { state: 'error', content: '表格区域错误提示 + 重试' },
      ],
      keyInteractions: [
        '点击"核验"→ 逐项勾选检查项后提交',
        '点击"驳回"→ 弹出驳回原因输入框',
        '批量操作：勾选多条记录后批量通过',
      ],
    },
    {
      file: 'StatisticsAnalysisView.vue',
      layoutZones: [
        { zone: '顶部指标卡', content: '4 个概览卡片：总任务量、完成率、平均响应时长、异常率' },
        { zone: '图表区', content: '趋势折线图（日/周/月）+ 分类饼图（车型/区域）+ 对比柱状图' },
        { zone: '明细表格', content: '可排序、筛选的统计明细表，支持导出' },
      ],
      uiStates: [
        { state: 'loading', content: '图表区域骨架屏 + 指标卡数值闪烁' },
        { state: 'empty', content: '无数据时图表区显示空状态插图' },
        { state: 'error', content: '图表区错误提示 + 重试' },
      ],
      keyInteractions: [
        '时间范围切换（今日/本周/本月/自定义）',
        '图表 hover 显示具体数值 tooltip',
        '点击饼图扇区下钻到明细列表',
      ],
    },
  ],
  projectBackground: {
    projectName: '海工生产运营调度系统',
    customerName: '示范客户',
    businessDomain: '海洋工程生产运营 - 车辆调度与现场管理',
    requirementSummary: '构建一套覆盖调度指挥、任务执行、场地管理和数据看板的车辆调度运营系统。核心目标是替代现有的纸质和电话调度方式，实现车辆状态实时可视、任务在线分派、异常即时告警和运营数据自动统计。',
    userRoles: [
      { role: '调度员', description: '查看实时车辆状态和位置，创建派车任务，处理异常告警' },
      { role: '司机', description: '接收任务、查看路线导航、更新任务状态、提交作业反馈' },
      { role: '场地管理员', description: '车辆入场核验、放行审批、告警处理' },
      { role: '运营经理', description: '查看统计分析看板、导出报表、资源调配决策' },
    ],
    scenarioSummary: '系统包含 4 个核心业务场景：调度指挥（实时地图监控 + 任务分派）、任务执行（司机接单 → 导航 → 作业 → 反馈）、场地管理（入场核验 + 放行管理 + 告警闭环）、数据看板（多维度统计 + 报表导出 + 资源优化）。',
  },
  projectStructure: {
    description: '基于 Vue3 + Vite 的前端项目目录结构',
    tree: [
      'frontend/',
      '├── index.html',
      '├── package.json',
      '├── vite.config.js',
      '└── src/',
      '    ├── App.vue                    # 根组件，路由出口',
      '    ├── main.js                   # 入口：createApp + router + 全局样式',
      '    ├── style.css                 # 全局样式变量和基础重置',
      '    ├── router/',
      '    │   └── index.js              # vue-router 路由配置',
      '    ├── views/                    # 页面组件',
      '    │   ├── DispatchMapView.vue',
      '    │   ├── OnsiteVehicleFilter.vue',
      '    │   ├── OnsiteDispatchDialog.vue',
      '    │   ├── OnsiteExceptionAlert.vue',
      '    │   ├── TaskListView.vue',
      '    │   ├── TaskDetailView.vue',
      '    │   ├── NavigationView.vue',
      '    │   ├── SiteFeedbackView.vue',
      '    │   ├── EntryCheckPanel.vue',
      '    │   ├── AlertPanel.vue',
      '    │   ├── ReleaseManagementPanel.vue',
      '    │   ├── ReleaseRecordQueryView.vue',
      '    │   ├── StatisticsAnalysisView.vue',
      '    │   ├── ReportExportView.vue',
      '    │   └── ResourceAllocationView.vue',
      '    ├── components/               # 通用组件',
      '    │   ├── MetricCard.vue',
      '    │   ├── StatusTag.vue',
      '    │   ├── DataTable.vue',
      '    │   ├── EmptyState.vue',
      '    │   ├── PageHeader.vue        # 页面标题栏（标题 + 面包屑 + 操作按钮）',
      '    │   ├── FilterBar.vue         # 通用筛选栏（条件 + 搜索 + 重置）',
      '    │   ├── ConfirmDialog.vue     # 二次确认弹窗',
      '    │   └── ToastNotification.vue # 全局 Toast 通知',
      '    └── data/                     # Mock 数据',
      '        ├── mockDispatch.js       # 调度相关 mock',
      '        ├── mockTasks.js          # 任务相关 mock',
      '        ├── mockAlerts.js         # 告警相关 mock',
      '        ├── mockStatistics.js     # 统计相关 mock',
      '        ├── mockEntry.js          # 入场检查 mock',
      '        └── mockEnums.js          # 状态/类型枚举常量',
    ],
  },
  styleGuide: {
    colorTokens: [
      { name: '--color-primary', value: '#1d4ed8', usage: '主按钮、链接、选中态' },
      { name: '--color-success', value: '#16a34a', usage: '成功状态、在线标签' },
      { name: '--color-warning', value: '#d97706', usage: '警告状态、待处理标签' },
      { name: '--color-danger', value: '#dc2626', usage: '错误状态、异常告警' },
      { name: '--color-bg', value: '#f8fafc', usage: '页面背景' },
      { name: '--color-surface', value: '#ffffff', usage: '卡片、面板背景' },
      { name: '--color-text', value: '#0f172a', usage: '主文字' },
      { name: '--color-text-secondary', value: '#64748b', usage: '辅助文字' },
    ],
    spacing: '使用 4px 基准：4/8/12/16/20/24/32/48',
    fontSize: '12/13/14/16/18/20/24/32px',
    breakpoints: [
      { name: 'mobile', value: '640px' },
      { name: 'tablet', value: '1024px' },
      { name: 'desktop', value: '1280px' },
    ],
    componentNaming: 'PascalCase 文件名、kebab-case 路由 path、camelCase JS 变量',
    vueConvention: '使用 <script setup> + Composition API，Props 用 defineProps，Events 用 defineEmits',
  },
  prompt: `请基于 Vue3 + Vite 生成一个海工生产运营前端原型。

要求：
1. 先不调用真实后端，只使用本地 mock 数据。
2. 页面包含实时地图看板、车辆筛选、派车弹窗、异常告警、任务列表、任务详情等核心页面。
3. 通用组件包含 MetricCard、StatusTag、DataTable、EmptyState。
4. 页面需要体现 loading、empty、success、error 四类状态。
5. API 返回结构统一使用 success、message、data、error_code。
6. 不引入复杂 UI 组件库，优先使用普通 HTML、CSS 和 Vue3 Composition API。
7. 代码要便于后续替换为 FastAPI 接口调用。`,
}
