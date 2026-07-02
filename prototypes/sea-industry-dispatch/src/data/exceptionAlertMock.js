/**
 * OnsiteExceptionAlert Mock 数据
 * 现场异常告警处理
 */

export const alertSeverityMap = {
  critical: { label: '严重', color: '#dc2626', bg: '#fee2e2' },
  high: { label: '高', color: '#f97316', bg: '#fff7ed' },
  medium: { label: '中', color: '#eab308', bg: '#fefce8' },
  low: { label: '低', color: '#3b82f6', bg: '#eff6ff' },
}

export const alertTypes = [
  '超速告警', '禁入区域', '异常停留', '未授权入场',
  '证照过期', '偏离路线', '设备故障', '超时未归',
]

export const activeAlerts = [
  {
    id: 'ALT-001', type: '超速告警', severity: 'high',
    plate: '沪K-01234', driver: '冯师傅',
    location: 'B区主干道', time: '14:32:15',
    description: '外协车在限速15km/h区域行驶速度达28km/h，持续超过2分钟。',
    status: 'pending',
  },
  {
    id: 'ALT-002', type: '禁入区域', severity: 'critical',
    plate: '沪D-45678', driver: '赵师傅',
    location: 'D区禁入区域', time: '14:28:40',
    description: '外协车进入未授权禁入区域，已触发电子围栏告警。',
    status: 'pending',
  },
  {
    id: 'ALT-003', type: '异常停留', severity: 'medium',
    plate: '沪J-90123', driver: '郑师傅',
    location: 'D区作业区', time: '14:15:02',
    description: '生产车在非停车区停留超过15分钟，疑似故障或违规停靠。',
    status: 'processing',
  },
  {
    id: 'ALT-005', type: '偏离路线', severity: 'high',
    plate: '沪E-56789', driver: '钱师傅',
    location: 'C区→B区交叉口', time: '14:10:22',
    description: '物流车偏离预定运输路线超过500米，未按规定路径行驶。',
    status: 'pending',
  },
  {
    id: 'ALT-006', type: '证照过期', severity: 'medium',
    plate: '沪G-78901', driver: '周师傅',
    location: 'C区门岗3', time: '13:50:30',
    description: '临时车辆驾驶员证照将于48小时内过期，需提醒更新。',
    status: 'pending',
  },
  {
    id: 'ALT-007', type: '设备故障', severity: 'low',
    plate: '沪C-34567', driver: '王师傅',
    location: 'C区-装卸点3', time: '13:35:00',
    description: '车辆GPS信号间歇性丢失，可能为设备天线故障。',
    status: 'pending',
  },
]

export const alertHistory = [
  {
    id: 'ALT-004', type: '未授权入场', severity: 'critical',
    plate: '沪G-78901', driver: '周师傅',
    location: 'C区门岗3', time: '13:50:30',
    description: '临时车无有效预约记录尝试入场。',
    status: 'resolved',
    resolvedAt: '13:55:00',
    resolution: '已确认并拒绝入场，通知管理人员。',
  },
  {
    id: 'ALT-008', type: '超时未归', severity: 'medium',
    plate: '沪L-12346', driver: '陈师傅',
    location: 'C区-停车场', time: '12:20:00',
    description: '车辆外出超过预定归还时间30分钟。',
    status: 'ignored',
    resolvedAt: '12:35:00',
    resolution: '经核实为正常延迟，已更新归还时间。',
  },
]
