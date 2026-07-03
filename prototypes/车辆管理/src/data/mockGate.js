export const gateRecords = [
  {
    pendingVehicle: {
      vehicleId: 'V001',
      plateNo: '沪A·12345',
      vehicleType: '货车',
      reservationInfo: { id: 'RES001', time: '2025-04-10 08:00' },
      certStatus: '已上传',
      entryPurpose: '送货'
    },
    entryRecord: {
      recordId: 'ENT001',
      plateNo: '沪A·12345',
      action: '放行',
      actionTime: '2025-04-10 08:10',
      operator: '赵工',
      rejectReason: '',
      syncStatus: '已同步'
    },
    gateActionParams: {
      vehicleId: 'V001',
      action: '放行',
      rejectReason: '',
      remark: '',
      operatorId: 'GATE001'
    },
    entryRecordFilter: {
      startDate: '2025-04-01',
      endDate: '2025-04-10',
      plateNo: '',
      action: '',
      syncStatus: ''
    }
  },
  {
    pendingVehicle: {
      vehicleId: 'V002',
      plateNo: '沪B·67890',
      vehicleType: '厢式车',
      reservationInfo: null,
      certStatus: '未上传',
      entryPurpose: '装卸'
    },
    entryRecord: {
      recordId: 'ENT002',
      plateNo: '沪B·67890',
      action: '拒绝',
      actionTime: '2025-04-10 09:00',
      operator: '赵工',
      rejectReason: '证照不全',
      syncStatus: '待同步'
    },
    gateActionParams: {},
    entryRecordFilter: {}
  }
];

export function fetchGateData({ roleKey, currentUser, filters } = {}) {
  let data = gateRecords;
  // gate 角色看到全部
  // 可添加基于 filters 的过滤
  return Promise.resolve(data);
}
