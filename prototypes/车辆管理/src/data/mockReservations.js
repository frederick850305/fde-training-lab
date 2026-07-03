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

export function fetchReservationsData({ roleKey, currentUser, filters } = {}) {
  let data = reservationsRecords;
  if (roleKey === 'approver') {
    // 审批者只看待审批的
    data = data.filter(rec => rec.reservationItem.status === '待审批');
  }
  return Promise.resolve(data);
}
