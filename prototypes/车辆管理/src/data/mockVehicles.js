// 车辆档案 Mock 数据
export const vehiclesRecords = [
  {
    vehicleItem: {
      id: 'V001',
      vehicleId: 'V001',
      plate: '京A·12345',
      plateNo: '京A·12345',
      type: '叉车',
      vehicleType: '叉车',
      company: '自有',
      driver: '李师傅',
      driverName: '李师傅',
      phone: '13800000001',
      annualInspectionExpire: '2025-06-30',
      insuranceExpire: '2025-12-31',
      status: '启用',
      vehicleStatus: '启用'
    },
    vehicleSaveParams: {
      vehicleId: 'V001',
      plate: '京A·12345',
      plateNo: '京A·12345',
      type: '叉车',
      vehicleType: '叉车',
      company: '自有',
      driverName: '李师傅',
      phone: '13800000001',
      annualInspectionExpire: '2025-06-30',
      insuranceExpire: '2025-12-31'
    },
    operationLog: {
      id: 'LOG-001',
      logId: 'LOG-001',
      operator: '周工',
      operatorName: '周工',
      time: '2024-11-30 14:00:00',
      operationType: '新增',
      vehicleId: 'V001',
      detail: '新增车辆档案'
    },
    vehicleFilter: {
      type: '',
      vehicleType: '',
      company: '',
      status: '',
      vehicleStatus: '',
      expireStatus: '',
      keyword: ''
    }
  },
  {
    vehicleItem: {
      id: 'V002',
      vehicleId: 'V002',
      plate: '沪B·67890',
      plateNo: '沪B·67890',
      type: '卡车',
      vehicleType: '卡车',
      company: '外协-XX物流',
      driver: '王师傅',
      driverName: '王师傅',
      phone: '13800000002',
      annualInspectionExpire: '2024-12-01',
      insuranceExpire: '2025-03-15',
      status: '启用',
      vehicleStatus: '启用'
    },
    vehicleSaveParams: {
      vehicleId: 'V002',
      plate: '沪B·67890',
      plateNo: '沪B·67890',
      type: '卡车',
      vehicleType: '卡车',
      company: '外协-XX物流',
      driverName: '王师傅',
      phone: '13800000002',
      annualInspectionExpire: '2024-12-01',
      insuranceExpire: '2025-03-15'
    },
    operationLog: {
      id: 'LOG-002',
      logId: 'LOG-002',
      operator: '周工',
      operatorName: '周工',
      time: '2024-11-29 10:00:00',
      operationType: '编辑',
      vehicleId: 'V002',
      detail: '更新保险有效期'
    },
    vehicleFilter: {
      type: '卡车',
      vehicleType: '卡车',
      company: '',
      status: '启用',
      vehicleStatus: '启用',
      expireStatus: '即将到期',
      keyword: ''
    }
  }
];

export function fetchVehiclesData({ roleKey, currentUser, filters = {} } = {}) {
  let data = vehiclesRecords;
  if (filters.type === 'vehicleItem') {
    data = data.map(r => r.vehicleItem);
  } else if (filters.type === 'vehicleSaveParams') {
    data = data.map(r => r.vehicleSaveParams);
  } else if (filters.type === 'operationLog') {
    data = data.map(r => r.operationLog);
  } else if (filters.type === 'vehicleFilter') {
    data = data.map(r => r.vehicleFilter);
  }
  // 管理员看到全部，其他人只能看到启用车辆
  if (roleKey !== 'admin' && roleKey !== 'manager') {
    data = data.filter(r => r.vehicleItem?.status === '启用' || r.status === '启用');
  }
  return Promise.resolve(data);
}
