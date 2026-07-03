export const alertsRecords = [
  {
    alertItem: {
      alertId: 'ALT001',
      alertType: '超速',
      vehicleId: 'V001',
      plateNo: '沪A·12345',
      alertTime: '2025-04-10 08:45',
      urgency: '高',
      processStatus: '未处理',
      remark: ''
    },
    taskProgress: {
      taskId: 'T001',
      vehicleId: 'V001',
      plateNo: '沪A·12345',
      driver: '李师傅',
      taskStatus: '进行中',
      currentStage: '运输中',
      estimatedComplete: '2025-04-10 10:00'
    },
    alertFilterParams: {
      alertType: '',
      vehicleType: '',
      urgency: '',
      sortField: 'alertTime'
    }
  },
  {
    alertItem: {
      alertId: 'ALT002',
      alertType: '禁入区域',
      vehicleId: 'V002',
      plateNo: '沪B·67890',
      alertTime: '2025-04-10 09:10',
      urgency: '中',
      processStatus: '已确认',
      remark: '司机误入'
    },
    taskProgress: {
      taskId: 'T002',
      vehicleId: 'V002',
      plateNo: '沪B·67890',
      driver: '王师傅',
      taskStatus: '等待中',
      currentStage: '待出发',
      estimatedComplete: '2025-04-10 11:00'
    },
    alertFilterParams: {}
  }
];

export function fetchAlertsData({ roleKey, currentUser, filters } = {}) {
  let data = alertsRecords;
  if (roleKey === 'driver') {
    // 司机只看自己的告警
    data = data.filter(rec => rec.alertItem.vehicleId === currentUser?.vehicleId);
  }
  return Promise.resolve(data);
}
