// 司机任务 Mock 数据
export const tasksRecords = [
  {
    taskItem: {
      id: 'TSK-001',
      taskId: 'TSK-001',
      title: '原料运输-仓库A->车间C',
      plate: '京A·12345',
      plateNo: '京A·12345',
      startAddress: '原料仓库A',
      from: '原料仓库A',
      destination: '车间C',
      to: '车间C',
      workPoints: ['装载点1', '卸载点2'],
      status: '待接单',
      taskStatus: '待接单',
      createTime: '2024-12-01 09:00:00',
      estimatedTime: '2024-12-01 10:00:00'
    },
    taskDetail: {
      taskId: 'TSK-001',
      vehicleInfo: { id: 'V001', plate: '京A·12345', type: '叉车' },
      driverInfo: { name: '李师傅', phone: '13800000001' },
      materialList: ['原料A: 500kg', '原料B: 200kg'],
      navigation: { start: '原料仓库A', end: '车间C' },
      actions: ['确认到达', '完成']
    },
    taskCompletion: {
      photos: ['photo1.jpg', 'photo2.jpg'],
      completeTime: '2024-12-01 10:30:00',
      remark: '完成运输'
    },
    driverFeedback: {
      id: 'FB-001',
      feedbackId: 'FB-001',
      type: '异常',
      content: '车辆故障',
      time: '2024-12-01 10:05:00',
      attachment: 'fault.jpg'
    }
  },
  {
    taskItem: {
      id: 'TSK-002',
      taskId: 'TSK-002',
      title: '成品运输-成品库->发货平台',
      plate: '沪B·67890',
      plateNo: '沪B·67890',
      startAddress: '成品库',
      from: '成品库',
      destination: '发货平台',
      to: '发货平台',
      workPoints: ['发货平台'],
      status: '进行中',
      taskStatus: '进行中',
      createTime: '2024-12-01 09:30:00',
      estimatedTime: '2024-12-01 11:00:00'
    },
    taskDetail: {
      taskId: 'TSK-002',
      vehicleInfo: { id: 'V002', plate: '沪B·67890', type: '卡车' },
      driverInfo: { name: '王师傅', phone: '13800000002' },
      materialList: ['成品箱: 200箱'],
      navigation: { start: '成品库', end: '发货平台' },
      actions: ['确认到达']
    },
    taskCompletion: null,
    driverFeedback: null
  }
];

export function fetchTasksData({ roleKey, currentUser, filters = {} } = {}) {
  let data = tasksRecords;
  if (filters.type === 'taskItem') {
    data = data.map(r => r.taskItem);
  } else if (filters.type === 'taskDetail') {
    data = data.map(r => r.taskDetail).filter(Boolean);
  } else if (filters.type === 'taskCompletion') {
    data = data.map(r => r.taskCompletion).filter(Boolean);
  } else if (filters.type === 'driverFeedback') {
    data = data.flatMap(r => r.driverFeedback ? [r.driverFeedback] : []);
  }
  // 司机只能看到自己的任务（模拟根据 currentUser 过滤）
  if (roleKey === 'driver' && currentUser) {
    const driverName = currentUser.replace('司机-', '');
    data = data.filter(r => {
      const driver = r.driverInfo?.name || r.taskItem?.plateNo;
      return driver === driverName;
    });
  }
  return Promise.resolve(data);
}
