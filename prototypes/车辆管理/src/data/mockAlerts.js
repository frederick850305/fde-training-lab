export const alertItem = {
  alertId: 'ALT-001',
  alertType: '超速',
  vehicleId: 'V001',
  plateNo: '京A·12345',
  alertTime: '2025-06-15 10:05',
  urgency: '高',
  status: '未处理',
  remark: ''
};

export const taskProgress = {
  taskId: 'T-20250615001',
  vehicleId: 'V001',
  plateNo: '京A·12345',
  driverName: '李四',
  taskStatus: '进行中',
  currentPhase: '前往目的地',
  estimatedCompletion: '2025-06-15 11:30'
};

export const alertFilterParams = {
  alertType: '超速',
  vehicleType: '厢式货车',
  urgency: '高',
  sortField: 'alertTime'
};

const alertStatusMap = {
  '未处理': { status: 'pending', label: '未处理' },
  '处理中': { status: 'handling', label: '处理中' },
  '已处理': { status: 'resolved', label: '已处理' },
};

const taskStatusMap = {
  '进行中': { status: 'in_progress', label: '进行中', progress: 68 },
  '待接单': { status: 'pending_review', label: '待接单', progress: 20 },
  '已完成': { status: 'completed', label: '已完成', progress: 100 },
};

function normalizeAlert(source, overrides = {}) {
  const statusInfo = alertStatusMap[source.status] || { status: source.status || 'pending', label: source.status || '未处理' };
  return {
    ...source,
    ...overrides,
    id: overrides.id || source.id || source.alertId,
    type: overrides.type || source.alertType,
    time: overrides.time || source.alertTime,
    status: overrides.status || statusInfo.status,
    statusLabel: overrides.statusLabel || statusInfo.label,
    vehiclePlate: overrides.vehiclePlate || source.plateNo,
    location: overrides.location || '厂区主干道 K2+300',
    description: overrides.description || `${source.plateNo} 触发${source.alertType}告警，请调度员确认处理。`,
  };
}

function normalizeTask(source, overrides = {}) {
  const statusInfo = taskStatusMap[source.taskStatus] || taskStatusMap[source.status] || { status: 'in_progress', label: source.status || source.taskStatus || '进行中', progress: 50 };
  return {
    ...source,
    ...overrides,
    id: overrides.id || source.id || source.taskId,
    title: overrides.title || `${source.plateNo} 运输任务`,
    status: overrides.status || statusInfo.status,
    statusLabel: overrides.statusLabel || statusInfo.label,
    progress: overrides.progress ?? statusInfo.progress,
    deadline: overrides.deadline || source.estimatedCompletion,
    driver: overrides.driver || source.driverName,
    vehiclePlate: overrides.vehiclePlate || source.plateNo,
    steps: overrides.steps || [
      { id: 'step-1', time: '09:35', action: '调度员已派车' },
      { id: 'step-2', time: '09:48', action: source.currentPhase || '司机前往目的地' },
    ],
    relatedAlerts: overrides.relatedAlerts || [],
  };
}

export const alerts = [
  normalizeAlert(alertItem, { severity: 'high' }),
  normalizeAlert(
    { ...alertItem, alertId: 'ALT-002', alertType: '禁入区域', urgency: '中', status: '处理中' },
    { severity: 'medium', location: '仓库 B 区东侧门禁', description: '车辆进入未授权区域，系统已通知现场安保。' }
  ),
  normalizeAlert(
    { ...alertItem, alertId: 'ALT-003', alertType: '长时间停车', urgency: '低', status: '已处理', alertTime: '2025-06-15 09:42' },
    { severity: 'low', location: '装卸区 3 号泊位', description: '车辆停留超过阈值，已核实为等待装卸。' }
  ),
];

export const tasks = [
  normalizeTask(taskProgress, {
    title: '仓库 B 区物料转运',
    relatedAlerts: [alerts[0]],
  }),
  normalizeTask(
    { ...taskProgress, taskId: 'T-20250615002', taskStatus: '待接单', plateNo: '京B·67890', driverName: '王五', estimatedCompletion: '2025-06-15 12:10' },
    { title: '堆场 C 区车辆调度' }
  ),
  normalizeTask(
    { ...taskProgress, taskId: 'T-20250615003', taskStatus: '已完成', plateNo: '京C·24680', driverName: '赵六', estimatedCompletion: '2025-06-15 10:20' },
    { title: '装配区备件配送' }
  ),
];
