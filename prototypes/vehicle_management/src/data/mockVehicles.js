/* mockVehicles.js - 车辆档案相关 Mock 数据 */

export const vehicleRecords = [
  { vehicleId: 'V-001', plate: '沪A-2601', vehicleType: '平板运输车', unit: 'HG物流公司', driverName: '李师傅', driverPhone: '138-0001-0011', annualCheckExpiry: '2027-03-15', insuranceExpiry: '2027-01-20', status: '启用' },
  { vehicleId: 'V-002', plate: '沪B-3812', vehicleType: '厢式货车', unit: 'HG运输队', driverName: '王师傅', driverPhone: '138-0002-0022', annualCheckExpiry: '2026-08-30', insuranceExpiry: '2026-06-15', status: '启用' },
  { vehicleId: 'V-003', plate: '沪C-4920', vehicleType: '重型卡车', unit: 'HG物流公司', driverName: '赵师傅', driverPhone: '138-0003-0033', annualCheckExpiry: '2027-05-10', insuranceExpiry: '2027-02-28', status: '启用' },
  { vehicleId: 'V-004', plate: '沪D-5031', vehicleType: '平板运输车', unit: 'HG运输队', driverName: '周师傅', driverPhone: '138-0004-0044', annualCheckExpiry: '2026-12-01', insuranceExpiry: '2026-09-30', status: '停用' },
  { vehicleId: 'V-005', plate: '沪E-6142', vehicleType: '厢式货车', unit: '外协-海建公司', driverName: '刘师傅', driverPhone: '138-0005-0055', annualCheckExpiry: '2026-07-20', insuranceExpiry: '2026-05-10', status: '启用' },
]

export const vehicleSaveParams = {
  vehicleId: '', vehicleType: '平板运输车', plate: '', unit: 'HG物流公司',
  driverName: '', driverPhone: '',
  annualCheckExpiry: '', insuranceExpiry: '',
}

export const operationLogs = [
  { logId: 'LOG-001', operator: '周工', operateTime: '2026-07-04 09:00', operateType: '新增', vehicleId: 'V-006', changeDetail: '新增车辆沪G-8364档案' },
  { logId: 'LOG-002', operator: '周工', operateTime: '2026-07-03 16:30', operateType: '编辑', vehicleId: 'V-002', changeDetail: '更新保险有效期至2027-06-15' },
  { logId: 'LOG-003', operator: '周工', operateTime: '2026-07-03 14:00', operateType: '停用', vehicleId: 'V-004', changeDetail: '车辆故障停用，原因：发动机大修' },
]

export const vehicleFilter = {
  vehicleType: '', unit: '', status: '', expiryStatus: '', keyword: '',
}

export function fetchVehicleData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ vehicles: vehicleRecords, logs: operationLogs, filterParams: vehicleFilter })
    }, 500)
  })
}
