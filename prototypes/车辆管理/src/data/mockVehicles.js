export const vehiclesRecords = [
  {
    vehicleItem: {
      vehicleId: 'V001',
      plateNo: '沪A·12345',
      vehicleType: '货车',
      company: '物流A',
      driverName: '李师傅',
      driverPhone: '13800138001',
      annualInspectionValid: '2026-04-01',
      insuranceValid: '2026-03-15',
      status: '启用'
    },
    vehicleSaveParams: {
      vehicleId: 'V001',
      type: '货车',
      plateNo: '沪A·12345',
      company: '物流A',
      driverInfo: { name: '李师傅', phone: '13800138001' },
      validUntil: { annual: '2026-04-01', insurance: '2026-03-15' }
    },
    operationLog: {
      logId: 'LOG001',
      operator: '管理员-周工',
      operateTime: '2025-04-01 10:00',
      operationType: '新增',
      relatedVehicleId: 'V001',
      changeDetail: '新增车辆档案'
    },
    vehicleFilter: {
      vehicleType: '',
      company: '',
      status: '',
      validStatus: '',
      keyword: ''
    }
  },
  {
    vehicleItem: {
      vehicleId: 'V002',
      plateNo: '沪B·67890',
      vehicleType: '厢式车',
      company: '物流B',
      driverName: '王师傅',
      driverPhone: '13800138002',
      annualInspectionValid: '2025-12-01',
      insuranceValid: '2025-11-20',
      status: '停用'
    },
    vehicleSaveParams: {
      vehicleId: 'V002',
      type: '厢式车',
      plateNo: '沪B·67890',
      company: '物流B',
      driverInfo: { name: '王师傅', phone: '13800138002' },
      validUntil: { annual: '2025-12-01', insurance: '2025-11-20' }
    },
    operationLog: {
      logId: 'LOG002',
      operator: '管理员-周工',
      operateTime: '2025-04-02 14:00',
      operationType: '停用',
      relatedVehicleId: 'V002',
      changeDetail: '车辆年检过期，已停用'
    },
    vehicleFilter: {}
  }
];

function enhanceVehiclesRows(rows) {
  const vehicleList = rows.map((row, index) => ({
    id: row.vehicleItem?.vehicleId || `V-${index + 1}`,
    vehicleId: row.vehicleItem?.vehicleId || `V-${index + 1}`,
    plateNumber: row.vehicleItem?.plateNumber || row.vehicleItem?.plateNo || '',
    plateNo: row.vehicleItem?.plateNo || '',
    vehicleType: row.vehicleItem?.vehicleType || row.vehicleSaveParams?.type || '',
    department: row.vehicleItem?.department || row.vehicleItem?.company || '',
    unit: row.vehicleItem?.company || '',
    driverName: row.vehicleItem?.driverName || row.vehicleSaveParams?.driverInfo?.name || '',
    driverPhone: row.vehicleItem?.driverPhone || row.vehicleSaveParams?.driverInfo?.phone || '',
    status: row.vehicleItem?.status || 'active',
    inspectionExpiry: row.vehicleItem?.inspectionExpiry || row.vehicleItem?.annualInspectionValid || '',
    insuranceExpiry: row.vehicleItem?.insuranceExpiry || row.vehicleItem?.insuranceValid || '',
    accessExpiry: row.vehicleItem?.accessExpiry || '',
    certificates: row.vehicleItem?.certificates || [],
    recentLogs: row.vehicleItem?.recentLogs || [row.operationLog].filter(Boolean),
    ...row,
  }));
  rows.forEach((row, index) => Object.assign(row, vehicleList[index]));
  const operationLogs = rows.map((row, index) => ({
    id: row.operationLog?.logId || `LOG-${index + 1}`,
    logId: row.operationLog?.logId || `LOG-${index + 1}`,
    operationTime: row.operationLog?.operationTime || row.operationLog?.operateTime || '',
    operatorName: row.operationLog?.operatorName || row.operationLog?.operator || '',
    operationType: row.operationLog?.operationType || '',
    vehicleId: row.operationLog?.vehicleId || row.operationLog?.relatedVehicleId || '',
    changeDetail: row.operationLog?.changeDetail || '',
    ...row.operationLog,
  })).filter(record => record.logId);
  return Object.assign(rows, {
    success: true,
    total: rows.length,
    records: rows,
    data: rows,
    list: vehicleList,
    vehiclesRecords: vehicleList,
    vehicleItem: rows[0]?.vehicleItem || {},
    vehicleSaveParams: rows[0]?.vehicleSaveParams || {},
    operationLog: operationLogs,
    operationLogs,
    vehicleFilter: rows[0]?.vehicleFilter || {},
  });
}

export function fetchVehiclesData({ roleKey, currentUser, filters } = {}) {
  let data = vehiclesRecords;
  // 管理员看到全部
  return enhanceVehiclesRows([...data]);
}
