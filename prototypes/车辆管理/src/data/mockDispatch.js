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

function enhanceDispatchRows(rows) {
  const demand = rows.map(row => row.demand).filter(Boolean).map((item, index) => ({
    id: item.id || item.demandId || `DEM${index + 1}`,
    demandId: item.demandId || item.requestId || `DEM${index + 1}`,
    applyTime: item.applyTime || item.demandTime || '2025-04-10 08:00',
    applicant: item.applicant || item.requester || '申请人',
    departure: item.departure || item.from || '起点',
    destination: item.destination || item.to || '终点',
    status: item.status || '待派车',
    ...item,
  }));
  const vehicleList = rows.flatMap(row => row.vehicleList || []).map((item, index) => ({
    id: item.id || item.vehicleId || `V${index + 1}`,
    vehicleId: item.vehicleId || item.id || `V${index + 1}`,
    plateNumber: item.plateNumber || item.plateNo || item.plate || `沪A-${index + 1}`,
    plateNo: item.plateNo || item.plate || item.plateNumber || `沪A-${index + 1}`,
    driverName: item.driverName || item.driver || '司机',
    currentLocation: item.currentLocation || item.currentPosition || item.position || '厂区',
    onlineStatus: item.onlineStatus || item.driverStatus || (item.online ? '空闲' : '任务中'),
    speed: item.speed || 0,
    task: item.task || '待命',
    ...item,
  }));
  const nearbyVehicles = rows.flatMap(row => row.nearbyVehicles || []).map((item, index) => ({
    id: item.id || item.vehicleId || `NV${index + 1}`,
    vehicleId: item.vehicleId || item.id || `NV${index + 1}`,
    plateNumber: item.plateNumber || item.plateNo || item.plate || `沪N-${index + 1}`,
    driverName: item.driverName || item.driver || '附近司机',
    currentLocation: item.currentLocation || item.currentPosition || item.position || '周边区域',
    onlineStatus: item.onlineStatus || item.driverStatus || '空闲',
    ...item,
  }));
  const dispatchRecordsResult = Object.assign(rows, { demand, vehicleList, dispatchTask: rows[0]?.dispatchTask || {}, nearbyVehicles });
  return Object.assign(rows, {
    success: true,
    total: rows.length,
    records: rows,
    data: rows,
    dispatchRecords: dispatchRecordsResult,
    demand,
    vehicleList,
    dispatchTask: rows[0]?.dispatchTask || {},
    nearbyVehicles,
  });
}

export function fetchDispatchData({ roleKey, currentUser, filters } = {}) {
  let data = dispatchRecords;
  if (roleKey === 'driver') {
    // 司机只看与自己相关的任务
    data = data.filter(rec => rec.dispatchTask && rec.dispatchTask.driverId === currentUser?.driverId);
  }
  // 可根据 filters 进一步过滤
  return enhanceDispatchRows([...data]);
}
