/* mockGate.js - 门禁管理相关 Mock 数据 */

export const gateRecords = [
  { recordId: 'REC-001', plate: '沪A-2601', vehicleType: '平板运输车', reservationInfo: '预约-2026-0704-001', certStatus: '正常', intent: '入场装货', operation: '放行', operator: '赵工', operateTime: '2026-07-04 08:45', rejectReason: '', syncStatus: '已同步' },
  { recordId: 'REC-002', plate: '沪B-3812', vehicleType: '厢式货车', reservationInfo: '预约-2026-0704-002', certStatus: '临近过期', intent: '入场卸货', operation: '拒绝', operator: '赵工', operateTime: '2026-07-04 08:30', rejectReason: '证件过期', syncStatus: '同步失败' },
  { recordId: 'REC-003', plate: '沪F-7253', vehicleType: '重型卡车', reservationInfo: '无预约', certStatus: '无证', intent: '临时入场', operation: '放行', operator: '周工', operateTime: '2026-07-04 07:50', rejectReason: '', syncStatus: '已同步' },
]

export const pendingVehicles = [
  { vehicleId: 'V-006', plate: '沪G-8364', vehicleType: '搅拌车', reservationId: '预约-2026-0704-003', certStatus: '正常', intent: '入场作业', arrivalTime: '2026-07-04 10:15' },
  { vehicleId: 'V-007', plate: '沪H-9475', vehicleType: '吊车', reservationId: '预约-2026-0704-004', certStatus: '正常', intent: '入场吊装', arrivalTime: '2026-07-04 10:30' },
]

export const gateActionParams = {
  vehicleId: 'V-006', actionType: '放行', rejectReason: '', remark: '已核对预约信息', operatorId: 'OP-GATE-001',
}

export function fetchGateData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ pendingVehicles, records: gateRecords })
    }, 500)
  })
}
