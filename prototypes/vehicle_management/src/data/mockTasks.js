/* mockTasks.js - 司机任务相关 Mock 数据 */

export const taskRecords = [
  { taskId: 'TASK-001', taskTitle: '吊装转运-东区堆场→B区产线', plate: '沪A-2601', departure: 'A区仓库', destination: 'B区产线', workPoint: 'B区产线3号吊装点', taskStatus: '待接单', createTime: '2026-07-04 09:00', estimatedTime: '2026-07-04 11:00' },
  { taskId: 'TASK-002', taskTitle: '物资配送-材料库→3号车间', plate: '沪B-3812', departure: '材料库', destination: '3号车间', workPoint: '3号车间收货区', taskStatus: '进行中', createTime: '2026-07-04 08:30', estimatedTime: '2026-07-04 10:30' },
  { taskId: 'TASK-003', taskTitle: '设备搬运-设备库→维修车间', plate: '沪C-4920', departure: '设备库', destination: '维修车间', workPoint: '维修车间1号工位', taskStatus: '已完成', createTime: '2026-07-03 14:00', estimatedTime: '2026-07-03 16:00' },
  { taskId: 'TASK-004', taskTitle: '废旧物资回收-3号车间→废料场', plate: '沪D-5031', departure: '3号车间', destination: '废料场', workPoint: '废料场A区', taskStatus: '待接单', createTime: '2026-07-04 10:00', estimatedTime: '2026-07-04 12:00' },
]

export const taskDetail = {
  taskId: 'TASK-002', taskTitle: '物资配送-材料库→3号车间', plate: '沪B-3812', vehicleType: '厢式货车',
  driver: '王师傅', driverPhone: '138-0002-0022',
  dispatcherPhone: '139-0001-0001',
  materialSlipNo: 'MTL-2026-0704-0001',
  workPoint: '3号车间收货区', workAddress: 'HG海工基地B区3号车间',
  estimatedTime: '2026-07-04 10:30',
  taskStatus: '进行中',
}

export const taskCompletion = {
  photos: [], completionTime: '', remark: '',
}

export const driverFeedback = {
  feedbackId: 'FB-001', type: '路况异常', content: '南门岗附近道路施工，需绕行', time: '2026-07-04 09:45', attachments: [],
}

export function fetchTaskData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ tasks: taskRecords, detail: taskDetail, feedback: [driverFeedback] })
    }, 500)
  })
}
