export const pendingVehicle = {
  vehicleId: 'V010',
  plateNo: '京D·11111',
  vehicleType: '半挂',
  reservationInfo: { reservationId: 'R-001', time: '2025-06-15 08:00' },
  certificateStatus: '有效',
  entryPurpose: '送货'
};

export const entryRecord = {
  recordId: 'REC-001',
  plateNo: '京D·11111',
  action: '放行',
  operateTime: '2025-06-15 08:05',
  operator: '门岗王',
  rejectReason: null,
  syncStatus: '已同步'
};

export const gateActionParams = {
  vehicleId: 'V010',
  actionType: '放行',
  rejectReason: null,
  remark: '正常放行',
  operatorId: 'G001'
};

export const entryRecordFilter = {
  startDate: '2025-06-01',
  endDate: '2025-06-15',
  plateNo: '京D·11111',
  action: '放行',
  syncStatus: '已同步'
};

function normalizePendingVehicle(source, overrides = {}) {
  const id = overrides.id || source.id || source.vehicleId;
  const plate = overrides.plate || source.plate || source.plateNo;
  const status = overrides.status || source.status || 'pending';
  const statusLabelMap = {
    pending: '待核验',
    approved: '已放行',
    rejected: '已拒绝',
  };
  return {
    ...source,
    ...overrides,
    id,
    plate,
    plateNumber: plate,
    type: overrides.type || source.type || source.vehicleType,
    appointment: overrides.appointment || `预约 ${source.reservationInfo?.reservationId || '-'} / ${source.reservationInfo?.time || '-'}`,
    certStatus: overrides.certStatus || source.certStatus || source.certificateStatus,
    intent: overrides.intent || source.intent || source.entryPurpose,
    source: overrides.source || '预约同步',
    status,
    statusLabel: overrides.statusLabel || statusLabelMap[status] || status,
    verificationStatus: overrides.verificationStatus || (source.certificateStatus === '有效' ? 'passed' : 'failed'),
    verificationDetail: overrides.verificationDetail || `${plate} 预约信息、证照状态和入场意图已完成自动核验。`,
  };
}

function normalizeEntryRecord(source, overrides = {}) {
  const id = overrides.id || source.id || source.recordId;
  const plate = overrides.plate || source.plate || source.plateNo;
  return {
    ...source,
    ...overrides,
    id,
    plate,
    plateNumber: plate,
    actionLabel: overrides.actionLabel || source.action,
    time: overrides.time || source.operateTime,
    syncStatusLabel: overrides.syncStatusLabel || source.syncStatus,
    snapshot: overrides.snapshot || { plateNo: plate, action: source.action, operator: source.operator },
    apiResponse: overrides.apiResponse || { success: true, recordId: id, syncStatus: source.syncStatus },
  };
}

const entryRecords = [
  normalizeEntryRecord(entryRecord),
  normalizeEntryRecord({ ...entryRecord, recordId: 'REC-002', plateNo: '京D·22222', action: '拒绝', rejectReason: '证照过期', syncStatus: '待同步' }),
  normalizeEntryRecord({ ...entryRecord, recordId: 'REC-003', plateNo: '京D·33333', action: '放行', syncStatus: '同步失败' }),
];

export async function fetchEntryRecords() {
  return {
    list: entryRecords,
    total: entryRecords.length,
  };
}

export async function retrySyncRecord(recordId) {
  return {
    success: true,
    recordId,
    syncStatus: '已同步',
  };
}

export const mockGate = {
  pendingVehicle: normalizePendingVehicle(pendingVehicle),
  pendingVehicles: [
    normalizePendingVehicle(pendingVehicle),
    normalizePendingVehicle(
      { ...pendingVehicle, vehicleId: 'V011', plateNo: '京D·22222', certificateStatus: '即将过期', entryPurpose: '提货' },
      { source: '人工登记', verificationStatus: 'failed', verificationDetail: '证照即将过期，需要门岗人工复核后决定是否放行。' }
    ),
  ],
  entryRecord,
  entryRecords,
  gateActionParams,
  entryRecordFilter,
};
