export const prototypeContract = {
  "version": 1,
  "projectName": "车辆管理",
  "customerName": "HG",
  "defaultRole": "dispatcher",
  "roles": [
    { "key": "dispatcher", "label": "调度员", "userName": "调度员-王敏", "description": "处理派车、监控告警和任务调整" },
    { "key": "driver", "label": "司机", "userName": "司机-李师傅", "description": "查看并执行本人运输任务" },
    { "key": "gate", "label": "门岗", "userName": "门岗-赵工", "description": "车辆入场核验与放行记录处理" },
    { "key": "approver", "label": "审批人员", "userName": "审批-陈主管", "description": "审批外协预约和授权码同步" },
    { "key": "manager", "label": "管理层", "userName": "管理层-刘总", "description": "查看运营报表和管理分析" },
    { "key": "admin", "label": "系统管理员", "userName": "管理员-周工", "description": "维护车辆档案和系统配置" }
  ],
  "navigationGroups": [
    {
      "group": "调度指挥", "icon": "🚦", "defaultRole": "dispatcher",
      "routes": [
        { "path": "/dispatch/workbench", "component": "DispatchWorkbenchView", "title": "调度工作台", "default": true, "roles": ["dispatcher"] },
        { "path": "/dispatch/monitor", "component": "AlertAndTaskMonitorView", "title": "告警与任务监控", "default": false, "roles": ["dispatcher"] },
        { "path": "/dispatch/mobile", "component": "MobileDispatchView", "title": "移动调度", "default": false, "roles": ["dispatcher"] },
        { "path": "/dispatch/task-adjust", "component": "TaskAdjustView", "title": "任务调整", "default": false, "roles": ["dispatcher"] }
      ]
    },
    {
      "group": "任务执行", "icon": "🚚", "defaultRole": "driver",
      "routes": [
        { "path": "/task/list", "component": "DriverTaskListView", "title": "司机任务列表", "default": true, "roles": ["driver"] },
        { "path": "/task/execute", "component": "DriverTaskExecuteView", "title": "任务执行", "default": false, "roles": ["driver"] }
      ]
    },
    {
      "group": "场地管理", "icon": "🏢", "defaultRole": "gate",
      "routes": [
        { "path": "/gate/access-check", "component": "GateAccessCheckView", "title": "门岗核验", "default": true, "roles": ["gate"] },
        { "path": "/gate/entry-records", "component": "GateEntryRecordsView", "title": "入场记录", "default": false, "roles": ["gate"] }
      ]
    },
    {
      "group": "外协管理", "icon": "📋", "defaultRole": "approver",
      "routes": [
        { "path": "/external/workspace", "component": "WorkspaceView", "title": "预约工作台", "default": true, "roles": ["approver"] },
        { "path": "/external/access-code", "component": "AccessCodeView", "title": "授权码管理", "default": false, "roles": ["approver"] },
        { "path": "/external/history", "component": "HistoryView", "title": "历史记录", "default": false, "roles": ["approver"] }
      ]
    },
    {
      "group": "综合管理", "icon": "📊", "defaultRole": "manager",
      "routes": [
        { "path": "/management/reports", "component": "ManagementReportsView", "title": "运营报表", "default": true, "roles": ["manager"] },
        { "path": "/management/report-detail", "component": "ReportDetailView", "title": "报表详情", "default": false, "roles": ["manager"] },
        { "path": "/management/vehicle-archive", "component": "VehicleArchiveList", "title": "车辆档案列表", "default": false, "roles": ["admin"] },
        { "path": "/management/vehicle-archive/edit", "component": "VehicleArchiveEdit", "title": "车辆档案编辑", "default": false, "roles": ["admin"] },
        { "path": "/management/vehicle-archive/logs", "component": "VehicleArchiveLogs", "title": "档案操作日志", "default": false, "roles": ["admin"] }
      ]
    }
  ],
  "pages": [
    { "file": "DispatchWorkbenchView.vue", "component": "DispatchWorkbenchView", "title": "调度工作台", "responsibility": "调度员集中管理实时车辆状态、接收用车需求、执行派车操作", "mocks": [{ "file": "mockDispatch.js", "importPath": "../data/mockDispatch.js", "dataExport": "dispatchRecords", "readFunction": "fetchDispatchData", "schema": [{ "field": "demand", "type": "object" }] }], "apis": [] },
    { "file": "AlertAndTaskMonitorView.vue", "component": "AlertAndTaskMonitorView", "title": "告警与任务监控", "responsibility": "实时监控车辆异常告警并处理", "mocks": [{ "file": "mockAlerts.js", "importPath": "../data/mockAlerts.js", "dataExport": "alertRecords", "readFunction": "fetchAlertData", "schema": [{ "field": "alertItem", "type": "object" }] }, { "file": "mockTasks.js", "importPath": "../data/mockTasks.js", "dataExport": "taskRecords", "readFunction": "fetchTaskData", "schema": [{ "field": "taskItem", "type": "object" }] }], "apis": [] },
    { "file": "DriverTaskListView.vue", "component": "DriverTaskListView", "title": "司机任务列表", "responsibility": "司机查看并确认接单", "mocks": [{ "file": "mockTasks.js", "importPath": "../data/mockTasks.js", "dataExport": "taskRecords", "readFunction": "fetchTaskData", "schema": [{ "field": "taskItem", "type": "object" }] }], "apis": [] },
    { "file": "DriverTaskExecuteView.vue", "component": "DriverTaskExecuteView", "title": "任务执行", "responsibility": "司机查看任务详情、导航、确认完成", "mocks": [{ "file": "mockTasks.js", "importPath": "../data/mockTasks.js", "dataExport": "taskRecords", "readFunction": "fetchTaskData", "schema": [{ "field": "taskItem", "type": "object" }] }], "apis": [] },
    { "file": "MobileDispatchView.vue", "component": "MobileDispatchView", "title": "移动调度", "responsibility": "实时接收告警、查看车辆状态、即时通讯", "mocks": [{ "file": "mockDispatch.js", "importPath": "../data/mockDispatch.js", "dataExport": "dispatchRecords", "readFunction": "fetchDispatchData", "schema": [{ "field": "mobileAlert", "type": "object" }] }, { "file": "mockAlerts.js", "importPath": "../data/mockAlerts.js", "dataExport": "alertRecords", "readFunction": "fetchAlertData", "schema": [{ "field": "alertItem", "type": "object" }] }], "apis": [] },
    { "file": "TaskAdjustView.vue", "component": "TaskAdjustView", "title": "任务调整", "responsibility": "对车辆/任务执行改派、取消或新增", "mocks": [{ "file": "mockDispatch.js", "importPath": "../data/mockDispatch.js", "dataExport": "dispatchRecords", "readFunction": "fetchDispatchData", "schema": [{ "field": "adjustmentOperation", "type": "object" }] }], "apis": [] },
    { "file": "GateAccessCheckView.vue", "component": "GateAccessCheckView", "title": "门岗核验", "responsibility": "门岗查看待核验车辆、放行或拒绝", "mocks": [{ "file": "mockGate.js", "importPath": "../data/mockGate.js", "dataExport": "gateRecords", "readFunction": "fetchGateData", "schema": [{ "field": "pendingVehicle", "type": "object" }] }], "apis": [] },
    { "file": "GateEntryRecordsView.vue", "component": "GateEntryRecordsView", "title": "入场记录", "responsibility": "查看历史入场处理记录", "mocks": [{ "file": "mockGate.js", "importPath": "../data/mockGate.js", "dataExport": "gateRecords", "readFunction": "fetchGateData", "schema": [{ "field": "entryRecord", "type": "object" }] }], "apis": [] },
    { "file": "ManagementReportsView.vue", "component": "ManagementReportsView", "title": "运营报表", "responsibility": "查看运营指标卡片和趋势图", "mocks": [{ "file": "mockVehicles.js", "importPath": "../data/mockVehicles.js", "dataExport": "vehicleRecords", "readFunction": "fetchVehicleData", "schema": [{ "field": "vehicleItem", "type": "object" }] }], "apis": [] },
    { "file": "ReportDetailView.vue", "component": "ReportDetailView", "title": "报表详情", "responsibility": "展示明细数据、搜索、排序、分页", "mocks": [{ "file": "mockVehicles.js", "importPath": "../data/mockVehicles.js", "dataExport": "vehicleRecords", "readFunction": "fetchVehicleData", "schema": [{ "field": "vehicleItem", "type": "object" }] }], "apis": [] },
    { "file": "WorkspaceView.vue", "component": "WorkspaceView", "title": "预约工作台", "responsibility": "处理外协/临时车辆预约审批", "mocks": [{ "file": "mockReservations.js", "importPath": "../data/mockReservations.js", "dataExport": "reservationRecords", "readFunction": "fetchReservationData", "schema": [{ "field": "reservationItem", "type": "object" }] }], "apis": [] },
    { "file": "AccessCodeView.vue", "component": "AccessCodeView", "title": "授权码管理", "responsibility": "查看授权码列表及同步状态", "mocks": [{ "file": "mockReservations.js", "importPath": "../data/mockReservations.js", "dataExport": "reservationRecords", "readFunction": "fetchReservationData", "schema": [{ "field": "accessCode", "type": "object" }] }], "apis": [] },
    { "file": "HistoryView.vue", "component": "HistoryView", "title": "历史记录", "responsibility": "查询预约历史、追溯详情、导出", "mocks": [{ "file": "mockReservations.js", "importPath": "../data/mockReservations.js", "dataExport": "reservationRecords", "readFunction": "fetchReservationData", "schema": [{ "field": "historyRecord", "type": "object" }] }], "apis": [] },
    { "file": "VehicleArchiveList.vue", "component": "VehicleArchiveList", "title": "车辆档案列表", "responsibility": "查看车辆档案列表，到期提醒", "mocks": [{ "file": "mockVehicles.js", "importPath": "../data/mockVehicles.js", "dataExport": "vehicleRecords", "readFunction": "fetchVehicleData", "schema": [{ "field": "vehicleItem", "type": "object" }] }], "apis": [] },
    { "file": "VehicleArchiveEdit.vue", "component": "VehicleArchiveEdit", "title": "车辆档案编辑", "responsibility": "新增或编辑车辆档案信息", "mocks": [{ "file": "mockVehicles.js", "importPath": "../data/mockVehicles.js", "dataExport": "vehicleRecords", "readFunction": "fetchVehicleData", "schema": [{ "field": "vehicleSaveParams", "type": "object" }] }], "apis": [] },
    { "file": "VehicleArchiveLogs.vue", "component": "VehicleArchiveLogs", "title": "档案操作日志", "responsibility": "查询导出车辆档案操作日志", "mocks": [{ "file": "mockVehicles.js", "importPath": "../data/mockVehicles.js", "dataExport": "vehicleRecords", "readFunction": "fetchVehicleData", "schema": [{ "field": "operationLog", "type": "object" }] }], "apis": [] }
  ],
  "mocks": [
    { "file": "mockDispatch.js", "domain": "dispatch", "dataExport": "dispatchRecords", "readFunction": "fetchDispatchData" },
    { "file": "mockAlerts.js", "domain": "alerts", "dataExport": "alertRecords", "readFunction": "fetchAlertData" },
    { "file": "mockTasks.js", "domain": "tasks", "dataExport": "taskRecords", "readFunction": "fetchTaskData" },
    { "file": "mockGate.js", "domain": "gate", "dataExport": "gateRecords", "readFunction": "fetchGateData" },
    { "file": "mockReservations.js", "domain": "reservations", "dataExport": "reservationRecords", "readFunction": "fetchReservationData" },
    { "file": "mockVehicles.js", "domain": "vehicles", "dataExport": "vehicleRecords", "readFunction": "fetchVehicleData" }
  ]
}

export default prototypeContract
