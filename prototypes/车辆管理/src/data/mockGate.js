// 门禁管理 Mock 数据
export const gateRecords = [
  {
    pendingVehicle: {
      id: 'PV-001',
      vehicleId: 'PV-001',
      plate: '京A·12345',
      plateNo: '京A·12345',
      type: '卡车',
      vehicleType: '卡车',
      reservationInfo: {
        id: 'RSV-001',
        reservationId: 'RSV-001',
        time: '2024-12-01 09:00:00'
      },
      licenseStatus: '已上传',
      entryPurpose: '送货'
    },
    entryRecord: {
      id: 'ER-001',
      recordId: 'ER-001',
      plate: '沪B·67890',
      plateNo: '沪B·67890',
      action: '放行',
      actionResult: '放行',
      time: '2024-12-01 08:30:00',
      operator: '赵工',
      operatorName: '赵工',
      rejectReason: '',
      syncStatus: '已同步'
    },
    gateActionParams: {
      vehicleId: 'PV-001',
      action: '放行',
      rejectReason: '',
      remark: '正常通行',
      operatorId: 'G001'
    },
    entryRecordFilter: {
      startDate: '2024-12-01',
      endDate: '2024-12-07',
      plate: '',
      plateNo: '',
      actionResult: '全部',
      syncStatus: '全部'
    }
  },
  {
    pendingVehicle: {
      id: 'PV-002',
      vehicleId: 'PV-002',
      plate: '粤C·00001',
      plateNo: '粤C·00001',
      type: '叉车',
      vehicleType: '叉车',
      reservationInfo: {
        id: 'RSV-002',
        reservationId: 'RSV-002',
        time: '2024-12-01 10:00:00'
      },
      licenseStatus: '未上传',
      entryPurpose: '维修'
    },
    entryRecord: {
      id: 'ER-002',
      recordId: 'ER-002',
      plate: '浙D·11111',
      plateNo: '浙D·11111',
      action: '拒绝',
      actionResult: '拒绝',
      time: '2024-12-01 09:00:00',
      operator: '赵工',
      operatorName: '赵工',
      rejectReason: '证照不全',
      syncStatus: '未同步'
    },
    gateActionParams: {
      vehicleId: 'PV-002',
      action: '拒绝',
      rejectReason: '证照不全',
      remark: '请补充完整证照',
      operatorId: 'G001'
    },
    entryRecordFilter: {
      startDate: '2024-12-01',
      endDate: '2024-12-07',
      plate: '',
      plateNo: '',
      actionResult: '拒绝',
      syncStatus: '未同步'
    }
  }
];

export function fetchGateData({ roleKey, currentUser, filters = {} } = {}) {
  let data = gateRecords;
  if (filters.type === 'pendingVehicle') {
    data = data.map(r => r.pendingVehicle);
  } else if (filters.type === 'entryRecord') {
    data = data.map(r => r.entryRecord);
  } else if (filters.type === 'gateActionParams') {
    data = data.map(r => r.gateActionParams);
  } else if (filters.type === 'entryRecordFilter') {
    data = data.map(r => r.entryRecordFilter);
  }
  // 角色过滤：门岗看到待核验车辆，管理员看到全部入场记录（模拟）
  if (roleKey === 'gate') {
    if (filters.type === 'entryRecord') {
      data = data.filter(r => r.actionResult === '放行');
    }
  } else if (roleKey === 'manager' || roleKey === 'admin') {
    // 管理员看到更多
  } else {
    data = [];
  }
  return Promise.resolve(data);
}
