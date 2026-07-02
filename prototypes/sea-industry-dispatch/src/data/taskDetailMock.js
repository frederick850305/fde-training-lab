/**
 * TaskDetailView Mock 数据
 * 任务详情
 */

export const taskDetail = {
  id: 'T-2026-0781',
  type: '装车作业',
  status: 'inProgress', // pending | inProgress | completed
  priority: 'high',
  driver: '李师傅',
  phone: '139****7890',
  vehiclePlate: '沪B-23456',
  vehicleType: '物流车',
  loadCapacity: '12吨',
  createdAt: '2026-07-02 08:30',
  deadline: '2026-07-02 11:00',
  description: '成品钢材装车，发往华东仓储中心。共 28 吨，需叉车配合。',

  jobSite: {
    address: 'B区-成品仓 3号装货口',
    contact: '仓库管理员 王主管',
    contactPhone: '138****1234',
    coordinates: '31.2304, 121.4737',
    eta: '2026-07-02 09:15',
  },

  materials: [
    { name: 'H型钢 200×200mm', quantity: '12 根', checked: true },
    { name: '钢板 10mm×2m×6m', quantity: '8 张', checked: true },
    { name: '角钢 50×50mm', quantity: '20 根', checked: false },
    { name: '螺栓 M20×80', quantity: '200 套', checked: false },
    { name: '防护垫', quantity: '4 块', checked: false },
  ],

  timeline: [
    { time: '08:30', event: '任务创建', detail: '调度员派发任务至李师傅' },
    { time: '08:35', event: '司机确认', detail: '李师傅确认接受任务' },
    { time: '08:50', event: '到达装货点', detail: '车辆到达 B区-成品仓 3号口' },
    { time: '09:00', event: '开始装车', detail: '叉车配合开始装载' },
  ],
}
