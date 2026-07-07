// 船岸数据同步管理模拟数据

export const syncShipmentsSummary = [
  { shipId: 'HG-01', shipName: 'HG-01 启航轮', syncStatus: 'abnormal', lastSyncTime: '2026-07-07 09:07', taskCount: 12, pendingCount: 4, conflictCount: 2, failedCount: 1 },
  { shipId: 'HG-02', shipName: 'HG-02 宏远轮', syncStatus: 'normal', lastSyncTime: '2026-07-07 09:20', taskCount: 5, pendingCount: 0, conflictCount: 0, failedCount: 0 },
  { shipId: 'HG-03', shipName: 'HG-03 海工保障船', syncStatus: 'unsynced', lastSyncTime: '2026-07-07 08:40', taskCount: 9, pendingCount: 6, conflictCount: 1, failedCount: 2 },
  { shipId: 'HG-04', shipName: 'HG-04 远洋拖轮', syncStatus: 'unsynced', lastSyncTime: '2026-07-06 22:10', taskCount: 3, pendingCount: 3, conflictCount: 0, failedCount: 0 },
]

export const syncTasks = [
  { taskId: 'SYNC-5012', shipId: 'HG-01', shipName: 'HG-01 启航轮', type: '工单报工', status: '冲突', startTime: '2026-07-07 08:50', endTime: null, retryCount: 1, recordId: 'WO-2026-1201', summary: '实际工时字段船岸不一致' },
  { taskId: 'SYNC-5011', shipId: 'HG-01', shipName: 'HG-01 启航轮', type: '物料消耗', status: '失败', startTime: '2026-07-07 08:45', endTime: null, retryCount: 2, recordId: 'REQ-3301', summary: '目标物料编码不存在' },
  { taskId: 'SYNC-5010', shipId: 'HG-01', shipName: 'HG-01 启航轮', type: '盘点记录', status: '待同步', startTime: '2026-07-07 08:30', endTime: null, retryCount: 0, recordId: 'PC-882', summary: '消防泵密封件实物盘点' },
  { taskId: 'SYNC-5009', shipId: 'HG-03', shipName: 'HG-03 海工保障船', type: '工单报工', status: '冲突', startTime: '2026-07-07 07:20', endTime: null, retryCount: 1, recordId: 'WO-2026-1190', summary: '消耗物料数量不一致' },
  { taskId: 'SYNC-5008', shipId: 'HG-03', shipName: 'HG-03 海工保障船', type: '附件上传', status: '失败', startTime: '2026-07-07 06:10', endTime: null, retryCount: 3, recordId: 'ATT-7765', summary: '视频文件过大上传中断' },
  { taskId: 'SYNC-5007', shipId: 'HG-02', shipName: 'HG-02 宏远轮', type: '工单报工', status: '已完成', startTime: '2026-07-07 05:00', endTime: '2026-07-07 05:08', retryCount: 0, recordId: 'WO-2026-1195', summary: '应急发电机保养报工同步完成' },
  { taskId: 'SYNC-5006', shipId: 'HG-02', shipName: 'HG-02 宏远轮', type: '证书更新', status: '已完成', startTime: '2026-07-06 22:00', endTime: '2026-07-06 22:03', retryCount: 0, recordId: 'CERT-SAFE-008', summary: '高级消防培训证更新' },
  { taskId: 'SYNC-5005', shipId: 'HG-03', shipName: 'HG-03 海工保障船', type: '退料单', status: '待同步', startTime: '2026-07-06 20:15', endTime: null, retryCount: 0, recordId: 'RET-2103', summary: '液压油退料3桶' },
  { taskId: 'SYNC-5004', shipId: 'HG-01', shipName: 'HG-01 启航轮', type: '领料单', status: '已完成', startTime: '2026-07-06 18:00', endTime: '2026-07-06 18:05', retryCount: 0, recordId: 'REQ-3298', summary: '燃油滤芯领用2件' },
]

export const conflicts = [
  { conflictId: 'CFL-001', workOrderId: 'WO-2026-1201', fieldDifferences: [
    { field: 'actualHours', boatVersion: 3.5, shoreVersion: 4.0, resolved: false },
    { field: 'findingNote', boatVersion: '更换滤芯压力恢复', shoreVersion: '更换滤芯压力正常', resolved: false },
  ], resolveStatus: '待处理', boatVersion: { actualHours: 3.5, findingNote: '更换滤芯压力恢复', materialQty: 2 }, shoreVersion: { actualHours: 4.0, findingNote: '更换滤芯压力正常', materialQty: 2 } },
  { conflictId: 'CFL-002', workOrderId: 'WO-2026-1190', fieldDifferences: [
    { field: 'materialQty', boatVersion: 20, shoreVersion: 25, resolved: false },
  ], resolveStatus: '待处理', boatVersion: { materialName: '液压油', materialQty: 20 }, shoreVersion: { materialName: '液压油', materialQty: 25 } },
]

export const syncAuditLogs = [
  { id: 'SLOG-401', shipId: 'HG-02', actionType: '同步完成', operator: '系统', timestamp: '2026-07-07 05:08', detail: 'WO-2026-1195 报工数据同步成功' },
  { id: 'SLOG-400', shipId: 'HG-01', actionType: '冲突标记', operator: '系统', timestamp: '2026-07-07 08:50', detail: 'WO-2026-1201 实际工时冲突' },
  { id: 'SLOG-399', shipId: 'HG-03', actionType: '重试失败', operator: '系统', timestamp: '2026-07-07 06:30', detail: 'ATT-7765 视频上传第3次重试失败' },
  { id: 'SLOG-398', shipId: 'HG-01', actionType: '手动忽略', operator: '船舶管理员 孙莉', timestamp: '2026-07-06 23:10', detail: 'SYNC-5001 旧版附件忽略' },
]

export const syncStatusOverview = {
  networkStatus: '弱网',
  pendingCount: 13,
  conflictCount: 3,
  failedCount: 3,
  lastSyncTime: '2026-07-07 09:07',
  storageUsage: { used: 248, total: 512, unit: 'MB' },
  healthTrend: [88, 85, 90, 82, 78, 80, 76],
}

export const syncReportHistory = [
  { reportId: 'RPT-SYNC-06', period: '2026-07-01 ~ 2026-07-07', ships: 4, successRate: 89, conflictCount: 3, generatedAt: '2026-07-07 09:00', status: '可下载' },
  { reportId: 'RPT-SYNC-05', period: '2026-06-24 ~ 2026-06-30', ships: 4, successRate: 94, conflictCount: 1, generatedAt: '2026-06-30 09:00', status: '可下载' },
  { reportId: 'RPT-SYNC-04', period: '2026-06-17 ~ 2026-06-23', ships: 3, successRate: 91, conflictCount: 2, generatedAt: '2026-06-23 09:00', status: '可下载' },
]
