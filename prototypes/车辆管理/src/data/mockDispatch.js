export const demand = {
  id: 'DEM-001',
  applicantName: '张三',
  applicantDept: '物流部',
  departure: '厂区A门',
  destination: '仓库B区',
  demandTime: '2025-06-15 09:30',
  vehicleType: '厢式货车',
  priority: '正常'
};

export const vehicleList = [
  {
    vehicleId: 'V001',
    plateNo: '京A·12345',
    vehicleType: '厢式货车',
    currentPos: { lng: 116.397, lat: 39.908 },
    driverName: '李四',
    driverPhone: '13800138001',
    onlineStatus: '在线'
  },
  {
    vehicleId: 'V002',
    plateNo: '京B·67890',
    vehicleType: '平板车',
    currentPos: { lng: 116.410, lat: 39.920 },
    driverName: '王五',
    driverPhone: '13800138002',
    onlineStatus: '离线'
  }
];

export const dispatchTask = {
  taskId: 'T-20250615001',
  status: '已派车',
  dispatchTime: '2025-06-15 09:35',
  driverId: 'D001',
  vehicleId: 'V001',
  demandId: 'DEM-001'
};

export const adjustmentOperation = {
  operationId: 'ADJ-001',
  operationType: '改派',
  reason: '原司机临时请假',
  targetDriverId: 'D002',
  additionalLocation: null,
  taskId: 'T-20250615001'
};

export const mobileAlert = {
  alertId: 'ALT-001',
  alertType: '超速',
  vehicleId: 'V001',
  plateNo: '京A·12345',
  latitude: 39.912,
  longitude: 116.405,
  time: '2025-06-15 10:00',
  urgency: '高'
};

export const nearbyVehicles = [
  {
    vehicleId: 'V003',
    plateNo: '京C·54321',
    currentPos: { lng: 116.395, lat: 39.905 },
    distance: 1.2,
    driverStatus: '空闲',
    driverName: '赵六',
    driverPhone: '13800138003',
    plate: '京C·54321',
    driver: '赵六',
    location: '厂区东侧环路',
    status: '空闲',
  }
];

const workbenchVehicles = vehicleList.map((vehicle, index) => ({
  ...vehicle,
  id: vehicle.vehicleId,
  plate: vehicle.plateNo,
  driver: vehicle.driverName,
  status: index === 0 ? 'idle' : 'busy',
  speed: index === 0 ? 32 : 0,
  task: index === 0 ? '待派车' : '执行运输任务',
}));

const workbenchDemands = [
  {
    ...demand,
    description: `${demand.departure} → ${demand.destination}`,
  },
  {
    ...demand,
    id: 'DEM-002',
    destination: '堆场C区',
    priority: '高',
    description: `${demand.departure} → 堆场C区`,
  },
];

export function mockVehicles() {
  return workbenchVehicles;
}

export function mockDemands() {
  return workbenchDemands;
}

export const mockAlerts = [{
  ...mobileAlert,
  id: mobileAlert.alertId,
  type: mobileAlert.alertType,
  time: mobileAlert.time,
  vehiclePlate: mobileAlert.plateNo,
  location: '厂区东侧环路',
  description: `${mobileAlert.plateNo} 触发${mobileAlert.alertType}告警`,
}];

const normalizedNearbyVehicles = nearbyVehicles.map(vehicle => ({
  ...vehicle,
  id: vehicle.vehicleId,
  plate: vehicle.plateNo,
  driver: vehicle.driverName,
  name: vehicle.driverName,
  location: `距当前位置 ${vehicle.distance} km`,
  status: vehicle.driverStatus,
}));

export const mockDispatch = {
  demand,
  vehicleList,
  dispatchTask,
  adjustmentOperation,
  mobileAlert,
  nearbyVehicles: normalizedNearbyVehicles,
};
