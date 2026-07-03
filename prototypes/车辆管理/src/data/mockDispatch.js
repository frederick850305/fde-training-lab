export const dispatchRecords = [
  {
    demand: { demandId: 'DEM001', requestId: 'REQ001', applicant: '张工', requester: '张工', from: 'A区仓库', departure: 'A区仓库', to: 'B区产线', destination: 'B区产线', demandTime: '2025-04-10 08:00', vehicleType: '货车', carType: '货车', status: '待派车' },
    vehicleList: [
      { id: 'V001', vehicleId: 'V001', plate: '沪A·12345', plateNo: '沪A·12345', type: '货车', carType: '货车', currentPosition: 'A区停车场', position: 'A区停车场', driver: '李师傅', driverName: '李师傅', driverPhone: '13800138001', online: true },
      { id: 'V002', vehicleId: 'V002', plate: '沪B·67890', plateNo: '沪B·67890', type: '厢式车', carType: '厢式车', currentPosition: 'B区装卸点', position: 'B区装卸点', driver: '王师傅', driverName: '王师傅', driverPhone: '13800138002', online: false }
    ],
    dispatchTask: {
      taskId: 'T001',
      taskStatus: '待接单',
      dispatchTime: '2025-04-10 08:30',
      driverId: 'DRV001',
      vehicleId: 'V001',
      dispatchNote: ''
    },
    adjustmentOperation: {
      operationType: '改派',
      reason: '原司机身体不适',
      targetDriverId: 'DRV002',
      additionalLocation: '',
      timestamp: '2025-04-10 09:00'
    },
    mobileAlert: {
      alertId: 'ALT001',
      type: '异常停留',
      vehicleInfo: { plate: '沪A·12345' },
      position: 'B区东门',
      time: '2025-04-10 09:15',
      urgency: '高'
    },
    nearbyVehicles: [
      { vehicleId: 'V003', plate: '沪C·13579', currentPosition: 'C区', distance: '500m', driverStatus: '空闲' },
      { vehicleId: 'V004', plate: '沪D·24680', currentPosition: 'D区', distance: '1.2km', driverStatus: '执行中' }
    ]
  },
  {
    demand: { demandId: 'DEM002', requestId: 'REQ002', applicant: '李主任', requester: '李主任', from: '行政楼', departure: '行政楼', to: '物流中心', destination: '物流中心', demandTime: '2025-04-10 09:00', vehicleType: '轿车', carType: '轿车', status: '已派车' },
    vehicleList: [],
    dispatchTask: {
      taskId: 'T002',
      taskStatus: '进行中',
      dispatchTime: '2025-04-10 09:20',
      driverId: 'DRV003',
      vehicleId: 'V005',
      dispatchNote: '注意货物清单'
    },
    adjustmentOperation: {},
    mobileAlert: {},
    nearbyVehicles: []
  }
];

export function fetchDispatchData({ roleKey, currentUser, filters } = {}) {
  let data = dispatchRecords;
  if (roleKey === 'driver') {
    // 司机只看与自己相关的任务
    data = data.filter(rec => rec.dispatchTask && rec.dispatchTask.driverId === currentUser?.driverId);
  }
  // 可根据 filters 进一步过滤
  return Promise.resolve(data);
}
