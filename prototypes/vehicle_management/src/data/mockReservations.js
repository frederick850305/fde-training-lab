/* mockReservations.js - 预约审批相关 Mock 数据 */

export const reservationRecords = [
  { reservationId: 'RES-001', plate: '沪A-2601', vehicleType: '平板运输车', unit: 'HG物流公司', workArea: '东区堆场', reservationTime: '2026-07-05 08:00', status: '待审批', timeout: false },
  { reservationId: 'RES-002', plate: '沪F-7253', vehicleType: '重型卡车', unit: 'HG运输队', workArea: 'B区产线', reservationTime: '2026-07-05 09:00', status: '已通过', timeout: false },
  { reservationId: 'RES-003', plate: '沪G-8364', vehicleType: '搅拌车', unit: '外协-海建公司', workArea: '南门岗', reservationTime: '2026-07-04 14:00', status: '待审批', timeout: true },
]

export const approvalAction = {
  reservationId: 'RES-001', approved: true, comment: '准予入场', forceApprove: false,
}

export const accessCodeList = [
  { codeId: 'CODE-001', codeValue: '100137', plate: '沪F-7253', syncStatus: '已同步', validUntil: '2026-07-06 18:00', usageStatus: '未使用' },
  { codeId: 'CODE-002', codeValue: '100274', plate: '沪G-8364', syncStatus: '同步失败', validUntil: '2026-07-05 20:00', usageStatus: '已过期' },
  { codeId: 'CODE-003', codeValue: '100411', plate: '沪H-9475', syncStatus: '待同步', validUntil: '2026-07-06 12:00', usageStatus: '未使用' },
]

export const historyRecords = [
  { historyId: 'HIS-001', plate: '沪A-2601', reservationTime: '2026-06-28 08:00', approvalStatus: '已通过', accessCode: '100089', entryTime: '2026-06-28 08:30', exitTime: '2026-06-28 16:00', fee: 1200 },
  { historyId: 'HIS-002', plate: '沪B-3812', reservationTime: '2026-06-29 09:00', approvalStatus: '已通过', accessCode: '100100', entryTime: '2026-06-29 09:25', exitTime: '2026-06-29 14:00', fee: 800 },
  { historyId: 'HIS-003', plate: '沪D-5031', reservationTime: '2026-06-30 10:00', approvalStatus: '已驳回', accessCode: '—', entryTime: '—', exitTime: '—', fee: 0 },
]

export function fetchReservationData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ reservations: reservationRecords, accessCodes: accessCodeList, history: historyRecords })
    }, 500)
  })
}
