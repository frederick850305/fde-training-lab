/* mockAlerts.js - 告警监控相关 Mock 数据 */

export const alertRecords = [
  { alertId: 'ALT-001', alertType: '超速', vehicleId: 'V-002', plate: '沪B-3812', alertTime: '2026-07-04 09:30', urgency: '高', status: '待处理', handleNote: '' },
  { alertId: 'ALT-002', alertType: '禁入', vehicleId: 'V-005', plate: '沪E-6142', alertTime: '2026-07-04 09:15', urgency: '高', status: '处理中', handleNote: '已联系门岗' },
  { alertId: 'ALT-003', alertType: '异常停留', vehicleId: 'V-001', plate: '沪A-2601', alertTime: '2026-07-04 08:50', urgency: '中', status: '已处理', handleNote: '司机已确认到达' },
  { alertId: 'ALT-004', alertType: '司机反馈', vehicleId: 'V-004', plate: '沪D-5031', alertTime: '2026-07-04 08:30', urgency: '低', status: '已忽略', handleNote: '常规反馈已记录' },
]

export const taskProgress = [
  { taskId: 'TASK-001', vehicleId: 'V-001', plate: '沪A-2601', driver: '李师傅', taskStatus: '进行中', currentPhase: '运输中', estimatedComplete: '2026-07-04 10:30' },
  { taskId: 'TASK-002', vehicleId: 'V-002', plate: '沪B-3812', driver: '王师傅', taskStatus: '待接单', currentPhase: '—', estimatedComplete: '—' },
  { taskId: 'TASK-003', vehicleId: 'V-004', plate: '沪D-5031', driver: '周师傅', taskStatus: '已完成', currentPhase: '已签收', estimatedComplete: '2026-07-04 09:00' },
]

export const alertFilterParams = {
  alertType: '', vehicleType: '', urgency: '', sortBy: 'time',
}

export function fetchAlertData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ alerts: alertRecords, tasks: taskProgress, filterParams: alertFilterParams })
    }, 500)
  })
}
