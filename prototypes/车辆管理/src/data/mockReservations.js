export const reservationsRecords = [
  {
    reservationItem: {
      reservationId: 'RES001',
      plateNo: '沪A·12345',
      vehicleType: '货车',
      company: '物流A',
      workArea: 'B区',
      reservationTime: '2025-04-10 08:00',
      status: '待审批',
      timeoutFlag: false
    },
    approvalAction: {
      reservationId: 'RES001',
      approved: true,
      comment: '同意',
      force: false
    },
    accessCode: {
      codeId: 'AC001',
      codeValue: '123456',
      relatedPlate: '沪A·12345',
      syncStatus: '已同步',
      validUntil: '2025-04-10 20:00',
      usageStatus: '未使用'
    },
    historyRecord: {
      recordId: 'HIS001',
      plateNo: '沪A·12345',
      reservationTime: '2025-04-10 08:00',
      approvalStatus: '已通过',
      accessCode: '123456',
      entryTime: '2025-04-10 08:10',
      exitTime: '2025-04-10 10:00',
      cost: 50
    }
  },
  {
    reservationItem: {
      reservationId: 'RES002',
      plateNo: '沪C·13579',
      vehicleType: '轿车',
      company: '行政部',
      workArea: '行政楼',
      reservationTime: '2025-04-10 09:00',
      status: '已通过',
      timeoutFlag: false
    },
    approvalAction: {
      reservationId: 'RES002',
      approved: true,
      comment: '',
      force: false
    },
    accessCode: {
      codeId: 'AC002',
      codeValue: '654321',
      relatedPlate: '沪C·13579',
      syncStatus: '同步中',
      validUntil: '2025-04-10 21:00',
      usageStatus: '未使用'
    },
    historyRecord: {}
  }
];

function enhanceReservationsRows(rows) {
  const normalizedRows = rows.map((row, index) => ({
    id: row.reservationItem?.reservationId || `RES-${index + 1}`,
    applyId: row.reservationItem?.reservationId || `RES-${index + 1}`,
    plateNo: row.reservationItem?.plateNo || row.accessCode?.relatedPlate || '',
    plateNumber: row.reservationItem?.plateNo || row.accessCode?.relatedPlate || '',
    vehicleType: row.reservationItem?.vehicleType || '',
    unit: row.reservationItem?.company || '',
    department: row.reservationItem?.company || '',
    workArea: row.reservationItem?.workArea || '',
    applyTime: row.reservationItem?.reservationTime || '',
    reservationTime: row.reservationItem?.reservationTime || '',
    status: row.reservationItem?.status || '待审批',
    statusLabel: row.reservationItem?.status || '待审批',
    overdueFlag: Boolean(row.reservationItem?.timeoutFlag),
    accessCode: row.accessCode,
    approvalAction: row.approvalAction,
    historyRecord: row.historyRecord,
    ...row,
  }));
  rows.forEach((row, index) => {
    const normalized = normalizedRows[index]
    const syncText = row.accessCode?.syncStatus || ''
    const syncStatus = syncText === '已同步' ? 'success' : (syncText === '同步失败' ? 'failed' : 'pending')
    Object.assign(row, normalized, {
      accessCode: row.accessCode ? {
        id: row.accessCode.codeId || `AC-${index + 1}`,
        codeId: row.accessCode.codeId || `AC-${index + 1}`,
        code: row.accessCode.codeValue || row.accessCode.code || '',
        codeValue: row.accessCode.codeValue || row.accessCode.code || '',
        plateNumber: row.accessCode.plateNumber || row.accessCode.relatedPlate || normalized.plateNumber || '',
        syncStatus,
        syncStatusText: syncText || syncStatus,
        usageStatus: row.accessCode.usageStatus || '',
        validUntil: row.accessCode.validUntil || '',
        logs: row.accessCode.logs || [],
        ...row.accessCode,
        syncStatus,
      } : row.accessCode,
    })
  });
  const historyRecords = rows.map((row, index) => ({
    id: row.historyRecord?.recordId || `HIS-${index + 1}`,
    recordId: row.historyRecord?.recordId || `HIS-${index + 1}`,
    plateNumber: row.historyRecord?.plateNumber || row.historyRecord?.plateNo || row.reservationItem?.plateNo || '',
    vehiclePlate: row.historyRecord?.plateNo || row.reservationItem?.plateNo || '',
    reservationTime: row.historyRecord?.reservationTime || row.reservationItem?.reservationTime || '',
    approvalStatus: row.historyRecord?.approvalStatus || row.reservationItem?.status || '',
    accessCode: row.historyRecord?.accessCode || row.accessCode?.codeValue || '',
    entryTime: row.historyRecord?.entryTime || '',
    exitTime: row.historyRecord?.exitTime || '',
    fee: row.historyRecord?.fee || row.historyRecord?.cost || '0.00',
    operationLogs: row.historyRecord?.operationLogs || [],
    feeDetails: row.historyRecord?.feeDetails || [],
    ...row.historyRecord,
  })).filter(record => record.recordId || record.plateNumber);
  return Object.assign(rows, {
    success: true,
    total: rows.length,
    records: rows,
    data: rows,
    reservationsRecords: normalizedRows,
    reservationItem: rows[0]?.reservationItem || {},
    approvalAction: rows[0]?.approvalAction || {},
    accessCode: rows[0]?.accessCode || {},
    historyRecord: rows[0]?.historyRecord || {},
    historyRecords,
  });
}

export function fetchReservationsData({ roleKey, currentUser, filters } = {}) {
  let data = reservationsRecords;
  if (roleKey === 'approver') {
    // 审批者只看待审批的
    data = data.filter(rec => rec.reservationItem.status === '待审批');
  }
  return enhanceReservationsRows([...data]);
}
