/* mockDispatch.js - 调度派车相关 Mock 数据 */

export const dispatchRecords = [
  {
    demandId: 'DEM-001', demandTitle: '吊装转运-东区堆场', applicant: '张工',
    departure: 'A区仓库', destination: 'B区产线', demandTime: '2026-07-04 09:00',
    vehicleType: '平板运输车', status: '待派车', priority: '高',
  },
  {
    demandId: 'DEM-002', demandTitle: '物资配送-南门岗', applicant: '李主任',
    departure: '材料库', destination: '3号车间', demandTime: '2026-07-04 10:30',
    vehicleType: '厢式货车', status: '待派车', priority: '中',
  },
  {
    demandId: 'DEM-003', demandTitle: '设备搬运-总调度室', applicant: '王经理',
    departure: '设备库', destination: '维修车间', demandTime: '2026-07-04 11:00',
    vehicleType: '重型卡车', status: '待派车', priority: '高',
  },
]

export const vehicleList = [
  { vehicleId: 'V-001', plate: '沪A-2601', vehicleType: '平板运输车', currentLocation: '东区堆场', driver: '李师傅', driverPhone: '138-0001-0011', onlineStatus: '空闲' },
  { vehicleId: 'V-002', plate: '沪B-3812', vehicleType: '厢式货车', currentLocation: '南门岗', driver: '王师傅', driverPhone: '138-0002-0022', onlineStatus: '任务中' },
  { vehicleId: 'V-003', plate: '沪C-4920', vehicleType: '重型卡车', currentLocation: '总调度室', driver: '赵师傅', driverPhone: '138-0003-0033', onlineStatus: '空闲' },
  { vehicleId: 'V-004', plate: '沪D-5031', vehicleType: '平板运输车', currentLocation: 'B区产线', driver: '周师傅', driverPhone: '138-0004-0044', onlineStatus: '排队' },
  { vehicleId: 'V-005', plate: '沪E-6142', vehicleType: '厢式货车', currentLocation: '行政楼', driver: '刘师傅', driverPhone: '138-0005-0055', onlineStatus: '异常' },
]

export const dispatchTask = {
  taskId: 'TASK-001', status: '已派发', dispatchTime: '2026-07-04 09:15',
  driverId: 'DRV-001', vehicleId: 'V-001', plate: '沪A-2601',
}

export const adjustmentOperation = {
  operationId: 'ADJ-001', type: '改派', reason: '原司机车辆故障',
  targetDriverId: 'DRV-003', newLocation: '东区堆场',
}

export const mobileAlert = {
  alertId: 'ALT-001', type: '超速', vehicleId: 'V-002', plate: '沪B-3812',
  location: '南门岗', time: '2026-07-04 09:30', urgency: '高',
}

export const nearbyVehicles = [
  { vehicleId: 'V-001', plate: '沪A-2601', currentLocation: '东区堆场', distance: '0.5km', driverStatus: '空闲' },
  { vehicleId: 'V-003', plate: '沪C-4920', currentLocation: '总调度室', distance: '1.2km', driverStatus: '空闲' },
]

export function fetchDispatchData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        demands: dispatchRecords,
        vehicles: vehicleList,
        task: dispatchTask,
        alerts: [mobileAlert],
        nearby: nearbyVehicles,
      })
    }, 500)
  })
}
