export const tasksRecords = [
  {
    taskItem: {
      taskId: 'T001',
      title: '从A区仓库到B区产线',
      plateNo: '沪A·12345',
      departure: 'A区仓库',
      destination: 'B区产线',
      workPoint: 'B区装卸区',
      status: '待接单',
      createTime: '2025-04-10 08:00',
      estimatedTime: '2025-04-10 09:00'
    },
    taskDetail: {
      taskId: 'T001',
      vehicleInfo: { plate: '沪A·12345', type: '货车' },
      driverInfo: { name: '李师傅', phone: '13800138001' },
      materialList: ['钢材', '水泥'],
      navigationInfo: { start: 'A区仓库', end: 'B区产线' },
      actionButtons: ['确认到达', '完成任务']
    },
    taskCompletion: {
      photos: [],
      completionTime: '2025-04-10 09:30',
      remark: '完成'
    },
    driverFeedback: {
      feedbackId: 'FB001',
      type: '异常',
      content: '道路拥堵',
      time: '2025-04-10 08:50',
      attachment: null
    }
  },
  {
    taskItem: {
      taskId: 'T002',
      title: '从行政楼到物流中心',
      plateNo: '沪C·13579',
      departure: '行政楼',
      destination: '物流中心',
      workPoint: '物流中心1号门',
      status: '进行中',
      createTime: '2025-04-10 09:00',
      estimatedTime: '2025-04-10 10:00'
    },
    taskDetail: {
      taskId: 'T002',
      vehicleInfo: { plate: '沪C·13579', type: '轿车' },
      driverInfo: { name: '赵师傅', phone: '13800138003' },
      materialList: ['文件'],
      navigationInfo: { start: '行政楼', end: '物流中心' },
      actionButtons: ['完成']
    },
    taskCompletion: {},
    driverFeedback: {}
  }
];

function enhanceTasksRows(rows) {
  const tasksRecordsResult = rows.map((row, index) => ({
    id: row.taskItem?.taskId || row.taskDetail?.taskId || `TASK-${index + 1}`,
    taskId: row.taskItem?.taskId || row.taskDetail?.taskId || `TASK-${index + 1}`,
    title: row.taskItem?.title || row.taskDetail?.title || `运输任务 ${index + 1}`,
    plateNumber: row.taskItem?.plateNumber || row.taskItem?.plateNo || row.taskDetail?.vehicleInfo?.plate || '',
    plate: row.taskItem?.plateNo || row.taskDetail?.vehicleInfo?.plate || '',
    origin: row.taskItem?.departure || row.taskDetail?.navigationInfo?.start || '',
    destination: row.taskItem?.destination || row.taskDetail?.navigationInfo?.end || '',
    workPoint: row.taskItem?.workPoint || '',
    status: row.taskItem?.status || row.taskDetail?.status || 'pending',
    createdAt: row.taskItem?.createTime || '',
    estimatedTime: row.taskItem?.estimatedTime || '',
    ...row,
  }));
  return Object.assign(rows, {
    success: true,
    total: rows.length,
    records: rows,
    data: rows,
    tasksRecords: tasksRecordsResult,
    taskItem: rows[0]?.taskItem || {},
    taskDetail: rows[0]?.taskDetail || {},
    taskCompletion: rows[0]?.taskCompletion || {},
    driverFeedback: rows[0]?.driverFeedback || {},
  });
}

export function fetchTasksData({ roleKey, currentUser, filters } = {}) {
  let data = tasksRecords;
  // 可按角色过滤
  if (roleKey === 'driver' && currentUser?.driverName) {
    data = data.filter(rec => rec.taskDetail.driverInfo.name === currentUser.driverName);
  }
  return enhanceTasksRows([...data]);
}
