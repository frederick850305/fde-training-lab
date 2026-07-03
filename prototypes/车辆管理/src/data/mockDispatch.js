// 派车调度 Mock 数据
export const dispatchRecords = [
  {
    demand: {
      id: 'DEM-001',
      demandId: 'DEM-001',
      applicationTime: '2024-12-01 09:30:00',
      applicant: '生产部-张工',
      startAddress: '原料仓库A',
      from: '原料仓库A',
      destination: '车间C',
      to: '车间C',
      requiredTime: '2024-12-01 10:00:00',
      vehicleType: '叉车',
      type: '叉车'
    },
    vehicleList: [
      { id: 'V001', plate: '京A·12345', vehicleId: 'V001', plateNo: '京A·12345', type: '叉车', vehicleType: '叉车', position: '仓库B', lat: 39.9042, lng: 116.4074, driver: '李师傅', driverName: '李师傅', phone: '13800000001', online: true },
      { id: 'V002', plate: '沪B·67890', vehicleId: 'V002', plateNo: '沪B·67890', type: '卡车', vehicleType: '卡车', position: '厂区西门', lat: 39.9050, lng: 116.4080, driver: '王师傅', driverName: '王师傅', phone: '13800000002', online: false }
    ],
    dispatchTask: {
      id: 'TSK-001',
      taskId: 'TSK-001',
      status: '待接单',
      taskStatus: '待接单',
      dispatchTime: '2024-12-01 09:35:00',
      driverId: 'D001',
      vehicleId: 'V001'
    },
    adjustmentOperation: {
      type: '改派',
      operationType: '改派',
      reason: '原司机请假',
      targetDriverId: 'D002',
      extraLocation: '仓库C'
    },
    mobileAlert: {
      id: 'ALR-001',
      alertId: 'ALR-001',
      type: '超速',
      alertType: '超速',
      vehicleId: 'V001',
      plateNo: '京A·12345',
      position: '厂区东门',
      lat: 39.906, lng: 116.409,
      time: '2024-12-01 09:40:00',
      severity: '高'
    },
    nearbyVehicles: [
      { id: 'V003', plate: '粤C·00001', vehicleId: 'V003', plateNo: '粤C·00001', position: '仓库A', lat: 39.903, lng: 116.406, distance: 200, driverStatus: '空闲' },
      { id: 'V004', plate: '粤C·00002', vehicleId: 'V004', plateNo: '粤C·00002', position: '车间B', lat: 39.904, lng: 116.410, distance: 350, driverStatus: '执行中' }
    ]
  },
  {
    demand: {
      id: 'DEM-002',
      demandId: 'DEM-002',
      applicationTime: '2024-12-01 10:00:00',
      applicant: '物流部-刘工',
      startAddress: '成品库',
      from: '成品库',
      destination: '发货平台',
      to: '发货平台',
      requiredTime: '2024-12-01 10:30:00',
      vehicleType: '卡车',
      type: '卡车'
    },
    vehicleList: [
      { id: 'V005', plate: '浙D·11111', vehicleId: 'V005', plateNo: '浙D·11111', type: '卡车', vehicleType: '卡车', position: '停车场', lat: 39.902, lng: 116.405, driver: '赵师傅', driverName: '赵师傅', phone: '13800000005', online: true }
    ],
    dispatchTask: null,
    adjustmentOperation: null,
    mobileAlert: null,
    nearbyVehicles: []
  }
];

export function fetchDispatchData({ roleKey = 'dispatcher', currentUser, filters = {} } = {}) {
  let data = dispatchRecords;
  if (filters.type === 'demand') {
    data = data.map(r => r.demand);
  } else if (filters.type === 'vehicleList') {
    data = data.flatMap(r => r.vehicleList || []);
  } else if (filters.type === 'dispatchTask') {
    data = data.map(r => r.dispatchTask).filter(Boolean);
  } else if (filters.type === 'adjustmentOperation') {
    data = data.map(r => r.adjustmentOperation).filter(Boolean);
  } else if (filters.type === 'mobileAlert') {
    data = data.map(r => r.mobileAlert).filter(Boolean);
  } else if (filters.type === 'nearbyVehicles') {
    data = data.flatMap(r => r.nearbyVehicles || []);
  }
  // 角色过滤示例：非调度员只返回简单数据
  if (roleKey !== 'dispatcher') {
    data = data.slice(0, 1);
  }
  return Promise.resolve(data);
}
