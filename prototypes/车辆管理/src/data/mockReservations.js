// 预约审批 Mock 数据
export const reservationsRecords = [
  {
    reservationItem: {
      id: 'RSV-001',
      reservationId: 'RSV-001',
      plate: '京A·12345',
      plateNo: '京A·12345',
      vehicleType: '卡车',
      type: '卡车',
      company: 'XX物流公司',
      workArea: '车间A',
      reservationTime: '2024-12-01 09:00:00',
      status: '待审批',
      applyStatus: '待审批',
      overTimeMark: false
    },
    approvalAction: {
      reservationId: 'RSV-001',
      approved: true,
      comment: '同意',
      forceApprove: false
    },
    accessCode: {
      id: 'AC-001',
      codeId: 'AC-001',
      code: '1234ABCD',
      plate: '京A·12345',
      plateNo: '京A·12345',
      syncStatus: '已同步',
      validUntil: '2024-12-01 18:00:00',
      used: false
    },
    historyRecord: {
      id: 'HR-001',
      historyId: 'HR-001',
      plate: '京A·12345',
      plateNo: '京A·12345',
      reservationTime: '2024-12-01 09:00:00',
      approvalStatus: '已通过',
      code: '1234ABCD',
      entryTime: '2024-12-01 09:15:00',
      exitTime: '2024-12-01 10:00:00',
      fee: 50.00
    }
  },
  {
    reservationItem: {
      id: 'RSV-002',
      reservationId: 'RSV-002',
      plate: '沪B·67890',
      plateNo: '沪B·67890',
      vehicleType: '叉车',
      type: '叉车',
      company: 'XX叉车租赁',
      workArea: '仓库B',
      reservationTime: '2024-12-01 10:00:00',
      status: '已通过',
      applyStatus: '已通过',
      overTimeMark: true
    },
    approvalAction: {
      reservationId: 'RSV-002',
      approved: true,
      comment: '已审批',
      forceApprove: false
    },
    accessCode: {
      id: 'AC-002',
      codeId: 'AC-002',
      code: '5678EFGH',
      plate: '沪B·67890',
      plateNo: '沪B·67890',
      syncStatus: '同步失败',
      validUntil: '2024-12-01 18:00:00',
      used: false
    },
    historyRecord: {
      id: 'HR-002',
      historyId: 'HR-002',
      plate: '沪B·67890',
      plateNo: '沪B·67890',
      reservationTime: '2024-12-01 10:00:00',
      approvalStatus: '已通过',
      code: '5678EFGH',
      entryTime: '2024-12-01 10:20:00',
      exitTime: null,
      fee: 0
    }
  }
];

export function fetchReservationsData({ roleKey, currentUser, filters = {} } = {}) {
  let data = reservationsRecords;
  if (filters.type === 'reservationItem') {
    data = data.map(r => r.reservationItem);
  } else if (filters.type === 'approvalAction') {
    data = data.map(r => r.approvalAction);
  } else if (filters.type === 'accessCode') {
    data = data.map(r => r.accessCode);
  } else if (filters.type === 'historyRecord') {
    data = data.map(r => r.historyRecord);
  }
  if (roleKey === 'approver') {
    // 审批人只能看到待审批的预约
    if (filters.type === 'reservationItem' || !filters.type) {
      data = data.filter(r => r.reservationItem?.status === '待审批');
    }
  }
  return Promise.resolve(data);
}
