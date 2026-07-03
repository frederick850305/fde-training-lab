export const reservationItem = {
  reservationId: 'R-001',
  plateNo: '京E·22222',
  vehicleType: '小型货车',
  company: '外协物流A',
  workArea: '仓库区',
  reservationTime: '2025-06-15 10:00',
  status: '待审批',
  timeoutFlag: false
};

export const approvalAction = {
  reservationId: 'R-001',
  approved: true,
  comment: '同意进入',
  forceApprove: false
};

export const accessCode = {
  codeId: 'AC-001',
  codeValue: 'AC20250615001',
  plateNo: '京E·22222',
  syncStatus: '待同步',
  validPeriod: { start: '2025-06-15 09:00', end: '2025-06-15 18:00' },
  useStatus: '未使用'
};

export const historyRecord = {
  recordId: 'HR-001',
  plateNo: '京E·22222',
  reservationTime: '2025-06-10 14:00',
  approvalStatus: '已通过',
  accessCode: 'AC20250610001',
  entryTime: '2025-06-10 14:05',
  exitTime: '2025-06-10 16:30',
  fee: 0
};

const reservations = [
  reservationItem,
  { ...reservationItem, reservationId: 'R-002', plateNo: '京E·33333', status: '待审批', timeoutFlag: true },
  { ...reservationItem, reservationId: 'R-003', plateNo: '京E·44444', status: '已通过' },
].map((item, index) => ({
  ...item,
  id: item.reservationId,
  plateNumber: item.plateNo,
  unit: item.company,
  applyTime: item.reservationTime,
  overdue: item.timeoutFlag,
  status: item.status === '待审批' ? 'pending' : item.status === '已通过' ? 'approved' : 'rejected',
  statusLabel: item.status,
  urgency: item.timeoutFlag ? 'high' : index === 0 ? 'medium' : 'normal',
  verification: item.timeoutFlag
    ? { passed: false, reason: '预约超时未处理，需要复核' }
    : { passed: true, reason: '' },
  logs: [
    { id: `${item.reservationId}-log-1`, time: item.reservationTime, action: '提交预约', operator: item.company, comment: '等待审批' },
  ],
}));

export async function fetchReservations() {
  return reservations;
}

export async function fetchDetail(id) {
  return reservations.find(item => item.id === id || item.reservationId === id) || reservations[0];
}

export async function approveReservation(id, payload = {}) {
  return {
    ...approvalAction,
    reservationId: id,
    comment: payload.comment || '同意',
    accessCode: {
      ...accessCode,
      reservationId: id,
      code: accessCode.codeValue,
      syncStatus: 'synced',
      syncStatusLabel: '已同步',
    },
  };
}

export async function rejectReservation(id, payload = {}) {
  return { reservationId: id, approved: false, comment: payload.comment || '驳回' };
}

export async function fetchAccessCode(id) {
  return { ...accessCode, reservationId: id };
}
