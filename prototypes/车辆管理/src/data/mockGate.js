export const gateRecords = [
  {
    pendingVehicle: {
      vehicleId: 'V001',
      plateNo: '沪A·12345',
      vehicleType: '货车',
      reservationInfo: { id: 'RES001', time: '2025-04-10 08:00' },
      certStatus: '已上传',
      entryPurpose: '送货'
    },
    entryRecord: {
      recordId: 'ENT001',
      plateNo: '沪A·12345',
      action: '放行',
      actionTime: '2025-04-10 08:10',
      operator: '赵工',
      rejectReason: '',
      syncStatus: '已同步'
    },
    gateActionParams: {
      vehicleId: 'V001',
      action: '放行',
      rejectReason: '',
      remark: '',
      operatorId: 'GATE001'
    },
    entryRecordFilter: {
      startDate: '2025-04-01',
      endDate: '2025-04-10',
      plateNo: '',
      action: '',
      syncStatus: ''
    }
  },
  {
    pendingVehicle: {
      vehicleId: 'V002',
      plateNo: '沪B·67890',
      vehicleType: '厢式车',
      reservationInfo: null,
      certStatus: '未上传',
      entryPurpose: '装卸'
    },
    entryRecord: {
      recordId: 'ENT002',
      plateNo: '沪B·67890',
      action: '拒绝',
      actionTime: '2025-04-10 09:00',
      operator: '赵工',
      rejectReason: '证照不全',
      syncStatus: '待同步'
    },
    gateActionParams: {},
    entryRecordFilter: {}
  }
];

function enhanceGateRows(rows) {
  const pendingVehicles = rows.map((row, index) => ({
    id: row.pendingVehicle?.vehicleId || `GATE-${index + 1}`,
    vehicleId: row.pendingVehicle?.vehicleId || `GATE-${index + 1}`,
    plateNo: row.pendingVehicle?.plateNo || '',
    plateNumber: row.pendingVehicle?.plateNumber || row.pendingVehicle?.plateNo || '',
    vehicleType: row.pendingVehicle?.vehicleType || '',
    certStatus: row.pendingVehicle?.certStatus || '',
    entryPurpose: row.pendingVehicle?.entryPurpose || '',
    ...row.pendingVehicle,
  })).filter(record => record.vehicleId);
  const entryRecords = rows.map((row, index) => ({
    id: row.entryRecord?.recordId || `ENT-${index + 1}`,
    recordId: row.entryRecord?.recordId || `ENT-${index + 1}`,
    plateNumber: row.entryRecord?.plateNumber || row.entryRecord?.plateNo || '',
    actionResult: row.entryRecord?.actionResult || row.entryRecord?.action || '',
    actionTime: row.entryRecord?.actionTime || '',
    operator: row.entryRecord?.operator || '',
    rejectReason: row.entryRecord?.rejectReason || '',
    syncStatus: row.entryRecord?.syncStatus || '',
    ...row.entryRecord,
  })).filter(record => record.recordId);
  return Object.assign(rows, {
    success: true,
    total: rows.length,
    records: rows,
    data: rows,
    list: pendingVehicles,
    gateRecords: pendingVehicles,
    pendingVehicle: rows[0]?.pendingVehicle || {},
    pendingVehicles,
    entryRecord: rows[0]?.entryRecord || {},
    entryRecords,
    gateActionParams: rows[0]?.gateActionParams || {},
    entryRecordFilter: rows[0]?.entryRecordFilter || {},
  });
}

export function fetchGateData(typeOrOptions = {}, maybeFilters = {}) {
  const type = typeof typeOrOptions === 'string' ? typeOrOptions : ''
  const { roleKey, currentUser, filters } = typeof typeOrOptions === 'object' ? typeOrOptions : maybeFilters
  let data = gateRecords;
  // gate 角色看到全部
  // 可添加基于 filters 的过滤
  const enhanced = enhanceGateRows([...data]);
  if (type === 'entryRecords') {
    return Promise.resolve({
      success: true,
      total: enhanced.entryRecords.length,
      list: enhanced.entryRecords,
      records: enhanced.entryRecords,
      data: enhanced.entryRecords,
    });
  }
  return Promise.resolve(enhanced);
}
