// 统一 Mock API 层：按模块封装异步数据获取，原型阶段返回 mock 数据并模拟延迟
import * as ops from './mockOps.js'
import * as vessel from './mockVessel.js'
import * as sync from './mockSync.js'
import * as inv from './mockInventory.js'
import * as sys from './mockSystem.js'

const delay = (ms = 380) => new Promise(resolve => setTimeout(resolve, ms))

// 通用：模拟偶发失败（可在页面通过 forceFail 触发 error 状态）
async function wrap(data, { fail = false, ms = 380 } = {}) {
  await delay(ms)
  if (fail) throw new Error('MOCK_REQUEST_FAILED')
  return data
}

/* ============ 运维管理 ============ */
export const fetchEquipmentTree = (opt) => wrap(ops.equipmentTree, opt)
export const fetchMaintenancePlans = (opt) => wrap(ops.maintenancePlans, opt)
export const fetchApprovals = (opt) => wrap(ops.approvals, opt)
export const fetchVoyageHealthChecks = (opt) => wrap(ops.voyageHealthChecks, opt)
export const fetchVoyageHealthIssues = (opt) => wrap(ops.voyageHealthIssues, opt)
export const fetchHealthCheckMatrix = (opt) => wrap(ops.healthCheckMatrix, opt)
export const fetchWorkOrders = (opt) => wrap(ops.workOrders, opt)
export const fetchWorkOrderSteps = (opt) => wrap(ops.workOrderSteps, opt)
export const fetchOpsAuditLogs = (opt) => wrap(ops.auditLogs, opt)

/* ============ 船舶监控调度 ============ */
export const fetchVessels = (opt) => wrap(vessel.vessels, opt)
export const fetchVesselDetail = (opt) => wrap(vessel.vesselDetail, opt)
export const fetchDispatchCommands = (opt) => wrap(vessel.dispatchCommands, opt)
export const fetchFleetStats = (opt) => wrap(vessel.fleetStats, opt)

/* ============ 船岸同步 ============ */
export const fetchSyncSummary = (opt) => wrap(sync.syncShipmentsSummary, opt)
export const fetchSyncTasks = (opt) => wrap(sync.syncTasks, opt)
export const fetchSyncConflicts = (opt) => wrap(sync.conflicts, opt)
export const fetchSyncAuditLogs = (opt) => wrap(sync.syncAuditLogs, opt)
export const fetchSyncStatusOverview = (opt) => wrap(sync.syncStatusOverview, opt)
export const fetchSyncReportHistory = (opt) => wrap(sync.syncReportHistory, opt)

/* ============ 物资库存 ============ */
export const fetchInventoryWorkbench = (opt) => wrap(inv.inventoryWorkbench, opt)
export const fetchMaterials = (opt) => wrap(inv.materials, opt)
export const fetchPhysicalCountRecords = (opt) => wrap(inv.physicalCountRecords, opt)
export const fetchRequisitionOrders = (opt) => wrap(inv.requisitionOrders, opt)
export const fetchReturnOrders = (opt) => wrap(inv.returnOrders, opt)
export const fetchInspectionRecords = (opt) => wrap(inv.inspectionRecords, opt)
export const fetchLowStockAlerts = (opt) => wrap(inv.lowStockAlerts, opt)

/* ============ 系统管理 ============ */
export const fetchUsers = (opt) => wrap(sys.users, opt)
export const fetchRoles = (opt) => wrap(sys.roles, opt)
export const fetchPermissionModules = (opt) => wrap(sys.permissionModules, opt)
export const fetchWorkflows = (opt) => wrap(sys.workflows, opt)
export const fetchConfigAuditLogs = (opt) => wrap(sys.configAuditLogs, opt)
export const fetchMonitorOverview = (opt) => wrap(sys.monitorOverview, opt)
export const fetchAlerts = (opt) => wrap(sys.alerts, opt)
export const fetchOperationLogs = (opt) => wrap(sys.operationLogs, opt)
export const fetchReportTemplates = (opt) => wrap(sys.reportTemplates, opt)
export const fetchReportTasks = (opt) => wrap(sys.reportTasks, opt)
export const fetchProcurementRequirements = (opt) => wrap(sys.procurementRequirements, opt)
export const fetchProcurementOrders = (opt) => wrap(sys.procurementOrders, opt)

/* ============ 通用提交动作 ============ */
export async function submitAction(action, payload, { ms = 320 } = {}) {
  await delay(ms)
  return { ok: true, action, recordId: payload?.id, traceNo: `PMS-${Date.now().toString().slice(-8)}` }
}

/* ============ 离线缓存（移动端） ============ */
const QUEUE_KEY = 'pms-offline-queue'
const CACHE_KEY = 'pms-local-cache'

export function readOfflineQueue() {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]') } catch { return [] }
}
export function appendOfflineQueue(item) {
  const next = [{ ...item, queuedAt: new Date().toISOString() }, ...readOfflineQueue()].slice(0, 30)
  localStorage.setItem(QUEUE_KEY, JSON.stringify(next))
  return next
}
export function clearOfflineQueue() {
  localStorage.setItem(QUEUE_KEY, '[]')
  return []
}
export function removeOfflineItem(queuedAt) {
  const next = readOfflineQueue().filter(item => item.queuedAt !== queuedAt)
  localStorage.setItem(QUEUE_KEY, JSON.stringify(next))
  return next
}
export function readLocalCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') } catch { return {} }
}
export function writeLocalCache(data) {
  const prev = readLocalCache()
  localStorage.setItem(CACHE_KEY, JSON.stringify({ ...prev, ...data, cachedAt: new Date().toISOString() }))
  return { ...prev, ...data }
}
export function getStorageUsage() {
  try {
    const queue = JSON.stringify(readOfflineQueue()).length
    const cache = JSON.stringify(readLocalCache()).length
    return { used: Math.round((queue + cache) / 1024), total: 512, unit: 'KB' }
  } catch { return { used: 0, total: 512, unit: 'KB' } }
}
