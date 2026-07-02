/**
 * EntryCheckPanel Mock 数据
 * 入场核验 —— 预约记录、核验结果
 */

export const preRegisteredVehicles = {
  '沪A-12345': {
    plate: '沪A-12345', type: '生产车', driver: '张师傅',
    company: '华东海工', validUntil: '2026-07-03',
    taskId: null, purpose: '日常作业', authorized: true,
  },
  '沪B-23456': {
    plate: '沪B-23456', type: '物流车', driver: '李师傅',
    company: '华东海工', validUntil: '2026-07-05',
    taskId: 'T-2026-0781', purpose: '成品钢材装车发运', authorized: true,
  },
  '沪E-56789': {
    plate: '沪E-56789', type: '物流车', driver: '钱师傅',
    company: '华东海工', validUntil: '2026-07-04',
    taskId: 'T-2026-0783', purpose: '半成品转运', authorized: true,
  },
  '沪H-89012': {
    plate: '沪H-89012', type: '物流车', driver: '吴师傅',
    company: '华东海工', validUntil: '2026-06-30',
    taskId: null, purpose: '日常运输', authorized: false,
    rejectReason: '预约已过期（有效期至 2026-06-30）',
  },
  '沪D-45678': {
    plate: '沪D-45678', type: '外协车', driver: '赵师傅',
    company: '外协单位B', validUntil: '2026-07-10',
    taskId: 'T-2026-0788', purpose: '紧急备件卸车', authorized: true,
  },
  '沪G-78901': {
    plate: '沪G-78901', type: '临时车', driver: '周师傅',
    company: '3号工地', validUntil: '2026-07-02',
    taskId: null, purpose: '临时物资运送', authorized: true,
  },
}

export const recentCheckRecords = [
  {
    id: 'CHK-001', plate: '沪K-01234', type: '外协车',
    result: 'pass', time: '14:30:22', operator: '门岗A',
  },
  {
    id: 'CHK-002', plate: '沪L-12346', type: '生产车',
    result: 'pass', time: '14:28:15', operator: '门岗A',
  },
  {
    id: 'CHK-003', plate: '沪X-99999', type: '未知',
    result: 'reject', time: '14:25:08', operator: '门岗B',
    reason: '无预约记录',
  },
]
