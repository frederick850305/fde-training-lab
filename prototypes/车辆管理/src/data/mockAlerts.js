// 告警与任务监控 Mock 数据
export const alertsRecords = [
  {
    alertItem: {
      id: 'ALT-001',
      alertId: 'ALT-001',
      type: '超速',
      alertType: '超速',
      vehicleId: 'V001',
      plateNo: '京A·12345',
      time: '2024-12-01 09:50:00',
      severity: '高',
      status: '未处理',
      handleStatus: '未处理',
      remark: ''
    },
    taskProgress: {
      taskId: 'TSK-001',
      vehicleId: 'V001',
      plateNo: '京A·12345',
      driver: '李师傅',
      driverName: '李师傅',
      status: '进行中',
      taskStatus: '进行中',
      currentStage: '运输中',
      expectedEnd: '2024-12-01 11:00:00'
    },
    alertFilterParams: {
      type: '超速',
      alertType: '超速',
      vehicleType: '叉车',
      severity: '高',
      sort: 'time'
    }
  },
  {
    alertItem: {
      id: 'ALT-002',
      alertId: 'ALT-002',
      type: '异常停留',
      alertType: '异常停留',
      vehicleId: 'V002',
      plateNo: '沪B·67890',
      time: '2024-12-01 10:10:00',
      severity: '中',
      status: '处理中',
      handleStatus: '处理中',
      remark: '已通知司机'
    },
    taskProgress: {
      taskId: 'TSK-002',
      vehicleId: 'V002',
      plateNo: '沪B·67890',
      driver: '王师傅',
      driverName: '王师傅',
      status: '待接单',
      taskStatus: '待接单',
      currentStage: '等待司机确认',
      expectedEnd: '2024-12-01 10:30:00'
    },
    alertFilterParams: {
      type: '异常停留',
      alertType: '异常停留',
      vehicleType: '卡车',
      severity: '中',
      sort: 'time'
    }
  }
];

export function fetchAlertsData({ roleKey, currentUser, filters = {} } = {}) {
  let data = alertsRecords;
  if (filters.type === 'alertItem') {
    data = data.map(r => r.alertItem);
  } else if (filters.type === 'taskProgress') {
    data = data.map(r => r.taskProgress);
  } else if (filters.type === 'alertFilterParams') {
    data = data.map(r => r.alertFilterParams);
  }
  if (roleKey !== 'dispatcher' && roleKey !== 'manager') {
    data = [];
  }
  return Promise.resolve(data);
}
