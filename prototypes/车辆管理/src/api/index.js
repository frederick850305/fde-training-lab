import { fetchDispatchData } from '../data/mockDispatch.js';
import { fetchAlertsData } from '../data/mockAlerts.js';
import { fetchTasksData } from '../data/mockTasks.js';
import { fetchGateData } from '../data/mockGate.js';
import { fetchReservationsData } from '../data/mockReservations.js';
import { fetchVehiclesData } from '../data/mockVehicles.js';

// 从当前步骤的结构化输出导入（实际开发中会从配置文件导入）
const prototypeContract = {
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
  "navigationGroups": [],
  "pages": [
    { "file": "DispatchWorkbenchView.vue", "component": "DispatchWorkbenchView", "title": "DispatchWorkbenchView", "responsibility": "", "mocks": [], "apis": [ { "method": "POST", "path": "/api/v1/tasks/dispatch", "usage": "调度员派车" }, { "method": "POST", "path": "/api/tasks/adjustment", "usage": "调度员调整任务" } ] },
    { "file": "AlertAndTaskMonitorView.vue", "component": "AlertAndTaskMonitorView", "title": "AlertAndTaskMonitorView", "responsibility": "", "mocks": [], "apis": [ { "method": "POST", "path": "/api/v1/alerts/handle", "usage": "处理告警" }, { "method": "GET", "path": "/api/alerts/realtime", "usage": "获取实时告警" }, { "method": "POST", "path": "/api/tasks/adjustment", "usage": "干预任务" } ] },
    { "file": "DriverTaskListView.vue", "component": "DriverTaskListView", "title": "DriverTaskListView", "responsibility": "", "mocks": [], "apis": [ { "method": "GET", "path": "/api/driver/tasks", "usage": "获取司机任务列表" } ] },
    { "file": "DriverTaskExecuteView.vue", "component": "DriverTaskExecuteView", "title": "DriverTaskExecuteView", "responsibility": "", "mocks": [], "apis": [ { "method": "POST", "path": "/api/driver/tasks/{taskId}/complete", "usage": "司机完成任务" }, { "method": "POST", "path": "/api/tasks/adjustment", "usage": "司机异常反馈" } ] },
    { "file": "MobileDispatchView.vue", "component": "MobileDispatchView", "title": "MobileDispatchView", "responsibility": "", "mocks": [], "apis": [ { "method": "GET", "path": "/api/alerts/realtime", "usage": "移动端获取告警" }, { "method": "POST", "path": "/api/tasks/adjustment", "usage": "移动端调整任务" }, { "method": "POST", "path": "/api/v1/tasks/dispatch", "usage": "移动端派车" } ] },
    { "file": "TaskAdjustView.vue", "component": "TaskAdjustView", "title": "TaskAdjustView", "responsibility": "", "mocks": [], "apis": [ { "method": "POST", "path": "/api/tasks/adjustment", "usage": "提交任务调整" } ] },
    { "file": "GateAccessCheckView.vue", "component": "GateAccessCheckView", "title": "GateAccessCheckView", "responsibility": "", "mocks": [], "apis": [ { "method": "POST", "path": "/api/gate/vehicle-action", "usage": "执行入场操作" } ] },
    { "file": "GateEntryRecordsView.vue", "component": "GateEntryRecordsView", "title": "GateEntryRecordsView", "responsibility": "", "mocks": [], "apis": [ { "method": "GET", "path": "/api/gate/entry-records", "usage": "获取入场记录" } ] },
    { "file": "ManagementReportsView.vue", "component": "ManagementReportsView", "title": "ManagementReportsView", "responsibility": "", "mocks": [], "apis": [ { "method": "GET", "path": "/api/reports/overview", "usage": "获取运营概览" } ] },
    { "file": "ReportDetailView.vue", "component": "ReportDetailView", "title": "ReportDetailView", "responsibility": "", "mocks": [], "apis": [ { "method": "GET", "path": "/api/reports/detail", "usage": "获取报表明细" } ] },
    { "file": "WorkspaceView.vue", "component": "WorkspaceView", "title": "WorkspaceView", "responsibility": "", "mocks": [], "apis": [ { "method": "POST", "path": "/api/reservations/{id}/approve", "usage": "审批预约" }, { "method": "GET", "path": "/api/access-codes", "usage": "获取授权码列表" } ] },
    { "file": "AccessCodeView.vue", "component": "AccessCodeView", "title": "AccessCodeView", "responsibility": "", "mocks": [], "apis": [ { "method": "GET", "path": "/api/access-codes", "usage": "获取授权码列表" } ] },
    { "file": "HistoryView.vue", "component": "HistoryView", "title": "HistoryView", "responsibility": "", "mocks": [], "apis": [ { "method": "GET", "path": "/api/reservations/history", "usage": "获取历史预约记录" } ] },
    { "file": "VehicleArchiveList.vue", "component": "VehicleArchiveList", "title": "VehicleArchiveList", "responsibility": "", "mocks": [], "apis": [ { "method": "GET", "path": "/api/vehicles", "usage": "获取车辆档案列表" }, { "method": "POST", "path": "/api/vehicles", "usage": "更新车辆状态" }, { "method": "GET", "path": "/api/vehicles/logs", "usage": "获取操作日志" } ] },
    { "file": "VehicleArchiveEdit.vue", "component": "VehicleArchiveEdit", "title": "VehicleArchiveEdit", "responsibility": "", "mocks": [], "apis": [ { "method": "GET", "path": "/api/vehicles", "usage": "获取车辆详情用于编辑" }, { "method": "POST", "path": "/api/vehicles", "usage": "保存车辆档案" } ] },
    { "file": "VehicleArchiveLogs.vue", "component": "VehicleArchiveLogs", "title": "VehicleArchiveLogs", "responsibility": "", "mocks": [], "apis": [ { "method": "GET", "path": "/api/vehicles/logs", "usage": "获取日志列表" } ] }
  ],
  "mocks": []
};

// API 路径与 mock 数据函数的映射，同时指定 filters.type 以区分同一 mock 文件的不同数据类型
const mockRouter = [
  { path: '/api/v1/tasks/dispatch', handler: fetchDispatchData, type: 'dispatchTask' },
  { path: '/api/tasks/adjustment', handler: fetchDispatchData, type: 'adjustmentOperation' },
  { path: '/api/alerts/realtime', handler: fetchAlertsData, type: 'alertItem' },
  { path: '/api/v1/alerts/handle', handler: fetchAlertsData, type: 'alertItem' },
  { path: '/api/driver/tasks', handler: fetchTasksData, type: 'taskItem' },
  { path: '/api/driver/tasks/{taskId}/complete', handler: fetchTasksData, type: 'taskCompletion' },
  { path: '/api/gate/vehicle-action', handler: fetchGateData, type: 'pendingVehicle' },
  { path: '/api/gate/entry-records', handler: fetchGateData, type: 'entryRecord' },
  { path: '/api/reservations/{id}/approve', handler: fetchReservationsData, type: 'approvalAction' },
  { path: '/api/access-codes', handler: fetchReservationsData, type: 'accessCode' },
  { path: '/api/reservations/history', handler: fetchReservationsData, type: 'historyRecord' },
  { path: '/api/vehicles', handler: fetchVehiclesData, type: 'vehicleItem' },
  { path: '/api/vehicles/logs', handler: fetchVehiclesData, type: 'operationLog' },
  { path: '/api/reports/overview', handler: null },
  { path: '/api/reports/detail', handler: null }
];

function matchPath(path) {
  // 精确匹配，忽略参数
  for (const route of mockRouter) {
    const routePath = route.path.replace(/\{[^}]+\}/g, '[^/]+'); // 将 {id} 替换为正则
    const regex = new RegExp(`^${routePath}$`);
    if (regex.test(path)) {
      return route;
    }
  }
  return null;
}

/**
 * 模拟异步请求
 * @param {string} path - API 路径
 * @param {object} params - 请求参数，可包含 roleKey, currentUser, filters 等
 * @returns {Promise} 返回模拟数据
 */
export function requestMock(path, params = {}) {
  const route = matchPath(path);
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!route || !route.handler) {
        // 没有 mock 数据，返回空数组
        resolve({ data: [] });
        return;
      }
      const { roleKey = prototypeContract.defaultRole, currentUser, filters = {} } = params;
      // 合并 type
      const mergedFilters = { ...filters, type: route.type };
      route.handler({ roleKey, currentUser, filters: mergedFilters }).then(data => {
        resolve({ data });
      });
    }, 500); // 模拟 500ms 延迟
  });
}

/**
 * 获取所有原型 API 列表
 * @returns {Array} 包含 method, path, usage 的对象数组
 */
export function listPrototypeApis() {
  const apis = [];
  for (const page of prototypeContract.pages) {
    if (page.apis && Array.isArray(page.apis)) {
      for (const api of page.apis) {
        // 去重
        if (!apis.some(a => a.path === api.path && a.method === api.method)) {
          apis.push({
            method: api.method,
            path: api.path,
            usage: api.usage || ''
          });
        }
      }
    }
  }
  return apis;
}
