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

function enhanceAlertsRows(rows) {
  const taskProgress = rows.map(row => row.taskProgress).filter(Boolean).map((item, index) => ({
    id: item.taskId || `TASK-${index + 1}`,
    taskId: item.taskId || `TASK-${index + 1}`,
    title: item.title || `${item.plateNo || item.plateNumber || '车辆'}任务进度`,
    plateNumber: item.plateNumber || item.plateNo || '',
    driverName: item.driverName || item.driver || '',
    status: item.status || item.taskStatus || 'in_progress',
    statusText: item.statusText || item.taskStatus || '进行中',
    currentPhase: item.currentPhase || item.currentStage || '',
    estimatedEnd: item.estimatedEnd || item.estimatedComplete || '',
    ...item,
  }));
  return Object.assign(rows, {
    success: true,
    total: rows.length,
    records: rows,
    data: rows,
    alertsRecords: rows,
    alertItem: rows[0]?.alertItem || {},
    taskProgress,
    alertFilterParams: rows[0]?.alertFilterParams || {},
  });
}

export function fetchAlertsData({ roleKey, currentUser, filters } = {}) {
  let data = alertsRecords;
  if (roleKey === 'driver') {
    // 司机只看自己的告警
    data = data.filter(rec => rec.alertItem.vehicleId === currentUser?.vehicleId);
  }
  return enhanceAlertsRows([...data]);
}
