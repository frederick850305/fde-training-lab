import { demand, vehicleList, dispatchTask, adjustmentOperation, mobileAlert, nearbyVehicles } from '../data/mockDispatch.js';
import { alertItem, taskProgress, alertFilterParams } from '../data/mockAlerts.js';
import { taskItem, taskDetail, taskCompletion, driverFeedback } from '../data/mockTasks.js';
import { pendingVehicle, entryRecord, gateActionParams, entryRecordFilter } from '../data/mockGate.js';
import { reservationItem, approvalAction, accessCode, historyRecord } from '../data/mockReservations.js';
import { vehicleItem, vehicleSaveParams, operationLog, vehicleFilter } from '../data/mockVehicles.js';

// 模拟 API 调用延迟
function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 派车工作台 API
export function postTasksDispatch(params) {
  return delay().then(() => ({
    success: true,
    data: dispatchTask
  }));
}

export function postTasksAdjustment(params) {
  return delay().then(() => ({
    success: true,
    data: adjustmentOperation
  }));
}

// 告警监控 API
export function getAlertsRealtime(params) {
  return delay().then(() => ({
    success: true,
    data: {
      alerts: [alertItem],
      progress: [taskProgress]
    }
  }));
}

export function postAlertsHandle(params) {
  return delay().then(() => ({
    success: true,
    data: { ...alertItem, status: '已处理' }
  }));
}

// 司机任务 API
export function getDriverTasks(params) {
  return delay().then(() => ({
    success: true,
    data: [taskItem]
  }));
}

export function postDriverTasksComplete(taskId, params) {
  return delay().then(() => ({
    success: true,
    data: taskCompletion
  }));
}

// 移动端调度 API（复用已有函数）
// 已包含 postTasksDispatch 和 getAlertsRealtime

// 门禁管理 API
export function getGatePendingVehicles(params) {
  return delay().then(() => ({
    success: true,
    data: [pendingVehicle]
  }));
}

export function postGateVehicleAction(params) {
  return delay().then(() => ({
    success: true,
    data: entryRecord
  }));
}

export function getGateEntryRecords(params) {
  return delay().then(() => ({
    success: true,
    data: [entryRecord, { ...entryRecord, recordId: 'REC-002', plateNo: '京D·22222', action: '拒绝' }]
  }));
}

// 报表相关 API（简略）
export function getReportsOverview(params) {
  return delay().then(() => ({
    success: true,
    data: { vehicleCount: 50, dispatchCount: 120, alertCount: 5 }
  }));
}

export function getReportsDetail(params) {
  return delay().then(() => ({
    success: true,
    data: { items: [], total: 0 }
  }));
}

// 预约审批 API
export function getReservationList(params) {
  return delay().then(() => ({
    success: true,
    data: [reservationItem]
  }));
}

export function postReservationsApprove(reservationId, params) {
  return delay().then(() => ({
    success: true,
    data: { ...approvalAction, reservationId }
  }));
}

export function getAccessCodes(params) {
  return delay().then(() => ({
    success: true,
    data: [accessCode]
  }));
}

export function getReservationsHistory(params) {
  return delay().then(() => ({
    success: true,
    data: [historyRecord]
  }));
}

// 车辆档案 API
export function getVehicles(params) {
  return delay().then(() => ({
    success: true,
    data: [vehicleItem]
  }));
}

export function postVehicles(params) {
  return delay().then(() => ({
    success: true,
    data: vehicleSaveParams
  }));
}

export function getVehiclesLogs(params) {
  return delay().then(() => ({
    success: true,
    data: [operationLog]
  }));
}
