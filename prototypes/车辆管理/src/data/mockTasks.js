export const taskItem = {
  taskId: 'T-20250615001',
  title: '运送物料至仓库B',
  plateNo: '京A·12345',
  departure: '厂区A门',
  destination: '仓库B区',
  waypoints: ['卸货点1'],
  status: '进行中',
  createTime: '2025-06-15 09:00',
  estimatedTime: '2025-06-15 11:00'
};

export const taskDetail = {
  taskId: 'T-20250615001',
  vehicleInfo: { plateNo: '京A·12345', vehicleType: '厢式货车' },
  driverInfo: { name: '李四', phone: '13800138001' },
  materialList: [
    { name: '螺丝', quantity: '100kg' },
    { name: '螺母', quantity: '50kg' }
  ],
  navigation: { start: '厂区A门', end: '仓库B区', waypoints: ['卸货点1'] },
  actionButtons: ['confirm_arrival', 'complete']
};

export const taskCompletion = {
  photos: ['photo1.jpg', 'photo2.jpg'],
  completionTime: '2025-06-15 10:30',
  remark: '货物完好'
};

export const driverFeedback = {
  feedbackId: 'FB-001',
  type: '报修',
  content: '车辆有异响',
  time: '2025-06-15 10:10',
  attachment: 'audio.mp3'
};

const statusMap = {
  '待接单': { status: 'pending', statusLabel: '待接单' },
  '进行中': { status: 'inProgress', statusLabel: '进行中' },
  '已完成': { status: 'completed', statusLabel: '已完成' },
  pending: { status: 'pending', statusLabel: '待接单' },
  inProgress: { status: 'inProgress', statusLabel: '进行中' },
  completed: { status: 'completed', statusLabel: '已完成' },
};

function normalizeTask(source, index = 0) {
  const statusInfo = statusMap[source.status] || { status: source.status || 'pending', statusLabel: source.status || '待接单' };
  const id = source.id || source.taskId;
  const plate = source.plate || source.plateNo || source.vehicleInfo?.plateNo;
  const workPoint = source.workPoint || `${source.departure || '厂区'} → ${source.destination || '目的地'}`;
  return {
    ...source,
    id,
    taskId: id,
    plate,
    plateNumber: plate,
    workPoint,
    workPointName: source.workPointName || source.destination || '仓库 B 区',
    address: source.address || source.destination || '仓库 B 区',
    pickupOrderNo: source.pickupOrderNo || `PO-${String(index + 1).padStart(4, '0')}`,
    driverPhone: source.driverPhone || source.driverInfo?.phone || '13800138001',
    dispatcherPhone: source.dispatcherPhone || '13900139001',
    latitude: source.latitude || 39.908,
    longitude: source.longitude || 116.397,
    status: statusInfo.status,
    statusLabel: statusInfo.statusLabel,
    estimatedTime: source.estimatedTime,
    feedbacks: source.feedbacks || [
      { id: 'fb-1', type: '报修', time: '10:10', description: '车辆有异响，已上报调度。', photos: [], status: '待处理' },
    ],
  };
}

export const tasks = [
  normalizeTask(taskItem, 0),
  normalizeTask({ ...taskItem, taskId: 'T-20250615002', title: '配送备件至装配区', status: '待接单', plateNo: '京B·67890', destination: '装配区' }, 1),
  normalizeTask({ ...taskItem, taskId: 'T-20250615003', title: '转运钢材至码头', status: '已完成', plateNo: '京C·24680', destination: '码头作业区' }, 2),
];

export async function getTaskDetail(taskId) {
  const base = tasks.find(item => item.id === taskId || item.taskId === taskId) || tasks[0];
  return normalizeTask({
    ...base,
    ...taskDetail,
    taskId: taskId || base.taskId || taskDetail.taskId,
    title: base.title,
    status: base.status,
    estimatedTime: base.estimatedTime,
  });
}

export async function confirmArrive(taskId) {
  return { success: true, taskId, status: '已到达' };
}

export async function confirmComplete(taskId, payload = {}) {
  return { success: true, taskId, ...taskCompletion, ...payload };
}
