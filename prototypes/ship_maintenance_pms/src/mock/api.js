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

export async function validateMaintenancePlanConflicts(payload, { ms = 420, fail = false } = {}) {
  await delay(ms)
  if (fail) throw new Error('VALIDATE_MAINTENANCE_PLAN_CONFLICTS_FAILED')
  const conflicts = ops.maintenancePlans.filter((plan) => {
    if (plan.equipmentId !== payload?.equipmentId) return false
    if (payload?.planId && plan.id === payload.planId) return false
    return ['已生效', '审核中', '即将到期'].includes(plan.status)
  })
  return {
    ok: true,
    equipmentId: payload?.equipmentId,
    conflictCount: conflicts.length,
    conflicts,
  }
}

export async function createMaintenancePlan(payload, { ms = 460, fail = false } = {}) {
  await delay(ms)
  if (fail) throw new Error('CREATE_MAINTENANCE_PLAN_FAILED')
  const now = new Date()
  const planId = payload?.planId || `PLN-${now.getFullYear()}-${String(now.getTime()).slice(-6)}`
  const approvalId = `APP-${String(now.getTime()).slice(-6)}`
  const action = payload?.mode === 'edit' ? '调整周期' : '新建计划'
  const cycleText = `${payload?.cycleValue || ''} ${payload?.cycleUnit || ''}`.trim()
  const approval = {
    id: approvalId,
    applicant: '岸基机务人员',
    planId,
    action,
    summary: `${payload?.equipmentName || '设备'} ${payload?.planType || ''}${cycleText ? `，周期${cycleText}` : ''}`,
    status: '待审批',
    submitAt: now.toISOString().slice(0, 16).replace('T', ' '),
    priority: payload?.priority || '中',
    before: payload?.before || null,
    after: {
      planType: payload?.planType,
      cycleValue: cycleText,
      advanceWarningDays: payload?.advanceWarningDays,
      priority: payload?.priority,
      workOrderTemplate: payload?.workOrderTemplate,
    },
    history: [
      {
        operator: '岸基机务人员',
        action: '提交申请',
        time: now.toISOString().slice(0, 16).replace('T', ' '),
        comment: payload?.submitComment || '',
      },
      {
        operator: '系统',
        action: '冲突检测',
        time: now.toISOString().slice(0, 16).replace('T', ' '),
        comment: payload?.conflictCount ? `检测到 ${payload.conflictCount} 条潜在冲突` : '未检测到与其他计划冲突',
      },
    ],
  }
  return {
    ok: true,
    plan: {
      id: planId,
      equipmentId: payload?.equipmentId,
      equipmentName: payload?.equipmentName,
      ship: payload?.ship || 'HG-01 启航轮',
      planType: payload?.planType,
      cycleValue: payload?.cycleValue,
      cycleUnit: payload?.cycleUnit,
      startDate: payload?.startDate,
      advanceWarningDays: payload?.advanceWarningDays,
      priority: payload?.priority,
      status: '审核中',
      nextDue: payload?.startDate,
      lastDone: '-',
      progress: 0,
    },
    approval,
    traceNo: `PMS-${String(now.getTime()).slice(-8)}`,
  }
}

export async function submitApprovalAction(approvalId, payload, { ms = 360, fail = false } = {}) {
  await delay(ms)
  if (fail) throw new Error('SUBMIT_APPROVAL_ACTION_FAILED')
  return {
    ok: true,
    approvalId,
    decision: payload?.decision,
    status: payload?.decision === '通过' ? '已通过' : '已驳回',
    traceNo: `PMS-${Date.now().toString().slice(-8)}`,
  }
}

export async function auditWorkOrder(workOrderId, payload, { ms = 360, fail = false } = {}) {
  await delay(ms)
  if (fail) throw new Error('AUDIT_WORK_ORDER_FAILED')
  return {
    ok: true,
    workOrderId,
    decision: payload?.decision,
    status: payload?.decision === '通过' ? '已闭环' : '需整改',
    rectifyRequirement: payload?.rectifyRequirement || payload?.comment || '',
    traceNo: `PMS-${Date.now().toString().slice(-8)}`,
  }
}

export async function createVoyageHealthCheckTask(payload, { ms = 420, fail = false } = {}) {
  await delay(ms)
  if (fail) throw new Error('CREATE_VOYAGE_HEALTH_CHECK_TASK_FAILED')
  const now = new Date()
  const taskId = `CHK-${now.getFullYear()}-${String(now.getTime()).slice(-10)}`
  return {
    checkId: taskId,
    sourceCheckId: payload?.checkId,
    shipId: payload?.shipId,
    shipName: payload?.shipName,
    voyageNo: payload?.voyageNo,
    triggerType: payload?.triggerType || 'manual',
    status: '进行中',
    statusLabel: '进行中',
    interceptStatus: '待定',
    issueCount: null,
    score: null,
    progress: 0,
    stage: '已发起·数据采集中',
    checkTime: now.toISOString().slice(0, 16).replace('T', ' '),
    summary: `${payload?.triggerType === 'auto' ? '自动' : '手动'}发起航前健康检查，正在采集设备、物资、证书与未闭环工单数据`,
    traceNo: `PMS-${String(now.getTime()).slice(-8)}`,
  }
}

export async function createVoyageHealthIssueDisposal(payload, { ms = 380, fail = false } = {}) {
  await delay(ms)
  if (fail) throw new Error('CREATE_VOYAGE_HEALTH_ISSUE_DISPOSAL_FAILED')
  const prefixMap = {
    紧急工单: 'WO-EMG',
    物资调拨: 'TRF',
    豁免审批: 'EXM',
  }
  const now = new Date()
  const flowId = `${prefixMap[payload?.action] || 'DSP'}-${now.getFullYear()}-${String(now.getTime()).slice(-6)}`
  const issue = findVoyageHealthIssue(payload?.issueId)

  if (payload?.action === '紧急工单' && issue) {
    const workOrderId = flowId
    const newWorkOrder = {
      id: workOrderId,
      type: '故障维修',
      status: '待执行',
      priority: issue.severity === '高' ? '高' : '中',
      ship: 'HG-01 启航轮',
      equipment: issue.relatedObject,
      planDate: now.toISOString().slice(0, 10),
      planId: null,
      executor: '轮机长 陈海',
      reportData: { actualHours: null, materials: [], findings: '' },
      attachments: 0,
      submittedAt: '',
      linkedIssueId: issue.issueId,
      steps: ['问题识别', '处置方案确定', '现场检修', '自检', '复检'],
    }
    ops.workOrders.push({
      id: workOrderId,
      type: '故障维修',
      status: '待审核',
      priority: issue.severity === '高' ? '高' : '中',
      ship: 'HG-01 启航轮',
      equipment: issue.relatedObject,
      planDate: now.toISOString().slice(0, 10),
      planId: null,
      executor: '轮机长 陈海',
      reportData: { actualHours: null, materials: [], findings: '' },
      attachments: 0,
      submittedAt: '',
      linkedIssueId: issue.issueId,
    })
    ops.mobileWorkOrders.push(newWorkOrder)
    issue.linkedWorkOrder = workOrderId
    issue.linkedWorkOrderId = workOrderId
    issue.linkedWorkOrderStatus = '待执行'
    issue.reinspectionStatus = '待复检'
    syncIssueProgress(issue)
  } else if (payload?.action === '豁免审批' && issue) {
    // 豁免审批：提交后进入"待审批"，走机务评估→船级社备案→批准/驳回链路
    issue.exemptionStatus = '待审批'
    issue.exemptionReason = payload?.reason || ''
    issue.exemptionValidUntil = payload?.validUntil || ''
    issue.exemptionFlowId = flowId
    issue.disposalProgress = 30
    issue.status = '豁免待审批'
  }

  return {
    ok: true,
    issueId: payload?.issueId,
    action: payload?.action,
    flowId,
    status: issue?.status || '处置中',
    disposalProgress: issue?.disposalProgress || (payload?.action === '豁免审批' ? 30 : 20),
    traceNo: `PMS-${String(now.getTime()).slice(-8)}`,
  }
}

// 航前健康问题闭环辅助
function findVoyageHealthIssue(issueId) {
  return ops.voyageHealthIssues.find((i) => i.issueId === issueId)
}

function syncIssueProgress(issue) {
  if (!issue) return
  if (issue.reinspectionStatus === '复检通过') {
    issue.disposalProgress = 100
    issue.status = '已闭环'
    issue.linkedWorkOrderStatus = '已闭环'
  } else if (issue.linkedWorkOrderStatus === '已闭环') {
    issue.disposalProgress = 80
    issue.status = '处置中'
  } else if (issue.linkedWorkOrderStatus === '执行中' || issue.linkedWorkOrderStatus === '待同步') {
    issue.disposalProgress = Math.max(issue.disposalProgress || 0, 60)
    issue.status = '处置中'
  } else if (issue.linkedWorkOrderId) {
    issue.disposalProgress = Math.max(issue.disposalProgress || 0, 20)
    issue.status = '处置中'
  }
}

export function fetchIssueLinkedWorkOrder(issueId) {
  const issue = findVoyageHealthIssue(issueId)
  if (!issue?.linkedWorkOrderId) return null
  const wo = ops.workOrders.find((w) => w.id === issue.linkedWorkOrderId) || ops.mobileWorkOrders.find((w) => w.id === issue.linkedWorkOrderId)
  return wo ? { ...wo, issueStatus: issue.status, reinspectionStatus: issue.reinspectionStatus } : null
}

export function updateIssueLinkedWorkOrderStatus(issueId, status) {
  const issue = findVoyageHealthIssue(issueId)
  if (!issue) return null
  issue.linkedWorkOrderStatus = status
  syncIssueProgress(issue)
  return issue
}

export function reinspectIssue(issueId) {
  const issue = findVoyageHealthIssue(issueId)
  if (!issue) return null
  issue.reinspectionStatus = '复检通过'
  syncIssueProgress(issue)
  return issue
}

// 豁免审批链路推进：待审批 → 机务评估中 → 船级社备案中 → 已批准 / 已驳回
const EXEMPTION_CHAIN = ['待审批', '机务评估中', '船级社备案中', '已批准']
export async function advanceExemptionApproval(issueId, { approve = true, rejectReason = '', ms = 360 } = {}) {
  await delay(ms)
  const issue = findVoyageHealthIssue(issueId)
  if (!issue || !issue.exemptionStatus) throw new Error('NO_EXEMPTION_PENDING')
  // 已处于终态则不再推进
  if (['已批准', '已驳回'].includes(issue.exemptionStatus)) {
    return issue
  }
  const idx = EXEMPTION_CHAIN.indexOf(issue.exemptionStatus)
  if (idx < 0) return issue
  if (idx === EXEMPTION_CHAIN.length - 1) {
    // 最后一步：批准或驳回
    if (approve) {
      issue.exemptionStatus = '已批准'
      issue.status = '已闭环'
      issue.disposalProgress = 100
      issue.exemptionApprovedAt = new Date().toISOString().slice(0, 16).replace('T', ' ')
    } else {
      issue.exemptionStatus = '已驳回'
      issue.status = '豁免已驳回'
      issue.rejectReason = rejectReason || '审批驳回'
      issue.disposalProgress = 30
    }
  } else {
    issue.exemptionStatus = EXEMPTION_CHAIN[idx + 1]
    issue.disposalProgress = 30 + Math.round((idx + 1) / (EXEMPTION_CHAIN.length - 1) * 50)
  }
  return issue
}

export function syncIssueOnWorkOrderClose(workOrderId) {
  const issue = ops.voyageHealthIssues.find((i) => i.linkedWorkOrderId === workOrderId)
  if (!issue) return null
  issue.linkedWorkOrderStatus = '已闭环'
  syncIssueProgress(issue)
  return issue
}

/* ============ 船舶监控调度 ============ */
export const fetchVessels = (opt) => wrap(vessel.vessels, opt)
export const fetchVesselDetail = (vesselIdOrOpt, opt) => {
  const vesselId = typeof vesselIdOrOpt === 'string' ? vesselIdOrOpt : null
  const options = typeof vesselIdOrOpt === 'object' ? vesselIdOrOpt : opt
  return wrap(vessel.vesselDetails?.[vesselId] || vessel.vesselDetail, options)
}
export const fetchDispatchCommands = (opt) => wrap(vessel.dispatchCommands, opt)
export const fetchFleetStats = (opt) => wrap(vessel.fleetStats, opt)

export async function createDispatchCommand(payload, { ms = 360, fail = false } = {}) {
  await delay(ms)
  if (fail) throw new Error('CREATE_DISPATCH_COMMAND_FAILED')
  const now = new Date()
  return {
    ok: true,
    command: {
      id: `CMD-${now.getFullYear()}-${String(now.getTime()).slice(-6)}`,
      ...payload,
      status: '已下发',
      issuedBy: '调度员 当前用户',
      issuedAt: now.toISOString().slice(0, 16).replace('T', ' '),
      progress: 5,
      timeline: [
        { status: '已下发', time: now.toISOString().slice(0, 16).replace('T', ' '), note: '调度指令已推送至船端' },
      ],
    },
    traceNo: `PMS-${String(now.getTime()).slice(-8)}`,
  }
}

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

/* ============ 移动端工单（船端执行语义） ============ */
export const fetchMobileWorkOrders = (opt) => wrap(ops.mobileWorkOrders, opt)

export async function reportWorkOrder(workOrderId, reportData, { ms = 360, fail = false } = {}) {
  await delay(ms)
  if (fail) throw new Error('REPORT_WORK_ORDER_FAILED')

  // 同步更新真实工单数据
  const targets = [ops.workOrders, ops.mobileWorkOrders]
  targets.forEach((list) => {
    const wo = list.find((w) => w.id === workOrderId)
    if (!wo) return
    wo.status = '待同步'
    wo.reportData = {
      ...wo.reportData,
      ...reportData,
      materials: reportData?.materials ? parseMaterials(reportData.materials) : wo.reportData?.materials,
    }
    if (reportData?.actualHours != null) wo.reportData.actualHours = reportData.actualHours
    if (reportData?.findings) wo.reportData.findings = reportData.findings
    wo.submittedAt = new Date().toISOString().slice(0, 16).replace('T', ' ')
    if (wo.linkedIssueId) {
      const issue = findVoyageHealthIssue(wo.linkedIssueId)
      if (issue) {
        issue.linkedWorkOrderStatus = '待同步'
        syncIssueProgress(issue)
      }
    }
  })

  // 更新本地工单缓存状态为"待同步"
  const cacheKey = 'pms-mobile-wo-cache'
  try {
    const cache = JSON.parse(localStorage.getItem(cacheKey) || '[]')
    const updated = cache.map(wo => wo.id === workOrderId ? { ...wo, status: '待同步' } : wo)
    localStorage.setItem(cacheKey, JSON.stringify(updated))
  } catch { /* ignore */ }
  // 写入离线队列（统一格式）
  appendOfflineQueue({
    type: '工单报工',
    recordId: workOrderId,
    shipName: reportData?.shipName || '当前船舶',
    summary: `工单 ${workOrderId} 报工提交，工时 ${reportData?.actualHours || '-'}h`,
    status: '待同步',
  })
  return { ok: true, workOrderId, status: '待同步', traceNo: `PMS-${Date.now().toString().slice(-8)}` }
}

function parseMaterials(str) {
  if (!str || typeof str !== 'string') return []
  return str.split(/[,，]/).map((s) => {
    const match = s.trim().match(/(.+?)[\s×xX]*(\d+)$/)
    if (match) return { name: match[1].trim(), qty: Number(match[2]) }
    return { name: s.trim(), qty: 1 }
  }).filter((m) => m.name)
}

/* ============ 库存专用提交 API ============ */
export async function submitPhysicalCount(record, { ms = 320, fail = false } = {}) {
  await delay(ms)
  if (fail) throw new Error('SUBMIT_PHYSICAL_COUNT_FAILED')
  appendOfflineQueue({
    type: '盘点记录',
    recordId: record?.taskId,
    shipName: '当前船舶',
    summary: `${record?.materialName} 盘点差异 ${record?.diff ?? 0}（系统${record?.systemInventory}/实物${record?.actualQuantity}）`,
    status: '待同步',
  })
  return { ok: true, recordId: record?.taskId, status: '待同步', traceNo: `PMS-${Date.now().toString().slice(-8)}` }
}

export async function submitRequisition(order, { ms = 320, fail = false } = {}) {
  await delay(ms)
  if (fail) throw new Error('SUBMIT_REQUISITION_FAILED')
  appendOfflineQueue({
    type: '领料单',
    recordId: order?.orderId,
    shipName: '当前船舶',
    summary: `${order?.materialName} 领用 ${order?.quantity}${order?.unit}，关联 ${order?.relatedOrder || '—'}`,
    status: '待同步',
  })
  return { ok: true, recordId: order?.orderId, status: '待同步', traceNo: `PMS-${Date.now().toString().slice(-8)}` }
}

export async function submitReturnOrder(order, { ms = 320, fail = false } = {}) {
  await delay(ms)
  if (fail) throw new Error('SUBMIT_RETURN_ORDER_FAILED')
  appendOfflineQueue({
    type: '退料单',
    recordId: order?.orderId,
    shipName: '当前船舶',
    summary: `${order?.materialName} 退料 ${order?.returnQuantity}${order?.unit}，原因：${order?.returnReason}`,
    status: '待同步',
  })
  return { ok: true, recordId: order?.orderId, status: '待同步', traceNo: `PMS-${Date.now().toString().slice(-8)}` }
}

/* ============ 离线队列展示格式化 ============ */
export function getOfflineQueueForDisplay() {
  return readOfflineQueue().map(item => ({
    taskId: `OFFLINE-${item.queuedAt?.slice(-6) || Date.now()}`,
    type: item.type || item.page || '未知',
    status: item.status || '待同步',
    shipName: item.shipName || '当前船舶',
    recordId: item.recordId || '—',
    summary: item.summary || item.comment || JSON.stringify(item),
    startTime: item.queuedAt || new Date().toISOString(),
  }))
}

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
