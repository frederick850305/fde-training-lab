// API Mock 客户端
// 导入所有 mock 模块
import { fetchDispatchData } from '../data/mockDispatch.js';
import { fetchAlertsData } from '../data/mockAlerts.js';
import { fetchTasksData } from '../data/mockTasks.js';
import { fetchGateData } from '../data/mockGate.js';
import { fetchReservationsData } from '../data/mockReservations.js';
import { fetchVehiclesData } from '../data/mockVehicles.js';

// prototypeContract 定义
const prototypeContract = {
  projectName: '车辆管理',
  customerName: 'HG',
  roles: [
    { key: 'dispatcher', label: '调度员', userName: '调度员-王敏' },
    { key: 'driver', label: '司机', userName: '司机-李师傅' },
    { key: 'gate', label: '门岗', userName: '门岗-赵工' },
    { key: 'approver', label: '审批人员', userName: '审批-陈主管' },
    { key: 'manager', label: '管理层', userName: '管理层-刘总' },
    { key: 'admin', label: '系统管理员', userName: '管理员-周工' }
  ],
  pages: [
    { file: 'DispatchWorkbenchView.vue', apis: [{ method: 'POST', path: '/api/v1/tasks/dispatch' }, { method: 'POST', path: '/api/tasks/adjustment' }] },
    { file: 'AlertAndTaskMonitorView.vue', apis: [{ method: 'POST', path: '/api/v1/alerts/handle' }, { method: 'GET', path: '/api/alerts/realtime' }, { method: 'POST', path: '/api/tasks/adjustment' }] },
    { file: 'DriverTaskListView.vue', apis: [{ method: 'GET', path: '/api/driver/tasks' }] },
    { file: 'DriverTaskExecuteView.vue', apis: [{ method: 'POST', path: '/api/driver/tasks/{taskId}/complete' }, { method: 'POST', path: '/api/tasks/adjustment' }] },
    { file: 'MobileDispatchView.vue', apis: [{ method: 'GET', path: '/api/alerts/realtime' }, { method: 'POST', path: '/api/tasks/adjustment' }, { method: 'POST', path: '/api/v1/tasks/dispatch' }] },
    { file: 'TaskAdjustView.vue', apis: [{ method: 'POST', path: '/api/tasks/adjustment' }] },
    { file: 'GateAccessCheckView.vue', apis: [{ method: 'POST', path: '/api/gate/vehicle-action' }] },
    { file: 'GateEntryRecordsView.vue', apis: [{ method: 'GET', path: '/api/gate/entry-records' }] },
    { file: 'ManagementReportsView.vue', apis: [{ method: 'GET', path: '/api/reports/overview' }] },
    { file: 'ReportDetailView.vue', apis: [{ method: 'GET', path: '/api/reports/detail' }] },
    { file: 'WorkspaceView.vue', apis: [{ method: 'POST', path: '/api/reservations/{id}/approve' }, { method: 'GET', path: '/api/access-codes' }] },
    { file: 'AccessCodeView.vue', apis: [{ method: 'GET', path: '/api/access-codes' }] },
    { file: 'HistoryView.vue', apis: [{ method: 'GET', path: '/api/reservations/history' }] },
    { file: 'VehicleArchiveList.vue', apis: [{ method: 'GET', path: '/api/vehicles' }, { method: 'POST', path: '/api/vehicles' }, { method: 'GET', path: '/api/vehicles/logs' }] },
    { file: 'VehicleArchiveEdit.vue', apis: [{ method: 'GET', path: '/api/vehicles' }, { method: 'POST', path: '/api/vehicles' }] },
    { file: 'VehicleArchiveLogs.vue', apis: [{ method: 'GET', path: '/api/vehicles/logs' }] }
  ]
};

// API 路由映射到对应的 mock fetch 函数
const apiRouteMap = {
  '/api/v1/tasks/dispatch': fetchDispatchData,
  '/api/tasks/adjustment': fetchDispatchData, // 使用相同的 dispatch mock
  '/api/v1/alerts/handle': fetchAlertsData,
  '/api/alerts/realtime': fetchAlertsData,
  '/api/driver/tasks': fetchTasksData,
  '/api/driver/tasks/{taskId}/complete': fetchTasksData,
  '/api/gate/vehicle-action': fetchGateData,
  '/api/gate/entry-records': fetchGateData,
  '/api/reports/overview': null, // 暂无 mock
  '/api/reports/detail': null,
  '/api/reservations/{id}/approve': fetchReservationsData,
  '/api/access-codes': fetchReservationsData,
  '/api/reservations/history': fetchReservationsData,
  '/api/vehicles': fetchVehiclesData,
  '/api/vehicles/logs': fetchVehiclesData
};

/**
 * 模拟 API 请求
 * @param {string} path - API 路径
 * @param {object} params - 请求参数，包含 method, body, roleKey, currentUser, filters 等
 * @returns {Promise<any>} 模拟的响应数据
 */
export function requestMock(path, params = {}) {
  const { method = 'GET', body, roleKey, currentUser, filters } = params;
  // 匹配路径（忽略路径参数，简单匹配前缀）
  const matchedPath = Object.keys(apiRouteMap).find(p => path.startsWith(p) || p.startsWith(path));
  const fetchFn = apiRouteMap[matchedPath];
  if (!fetchFn) {
    return Promise.resolve({ error: 'No mock data for path: ' + path });
  }
  return fetchFn({ roleKey, currentUser, filters }).then(data => {
    // 模拟异步延迟
    return new Promise(resolve => setTimeout(() => resolve(data), 200));
  });
}

/**
 * 列出原型中所有可用的 API
 * @returns {Array<{method: string, path: string, page: string}>}
 */
export function listPrototypeApis() {
  const apis = [];
  for (const page of prototypeContract.pages) {
    for (const api of page.apis) {
      apis.push({ method: api.method, path: api.path, page: page.file });
    }
  }
  return apis;
}
