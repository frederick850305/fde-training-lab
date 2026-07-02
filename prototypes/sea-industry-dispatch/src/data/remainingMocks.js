/**
 * NavigationView / SiteFeedbackView / ReleaseManagement Mock 数据
 */

export const navigationMock = {
  destination: 'B区-成品仓 3号装货口',
  taskId: 'T-2026-0781',
  remainingDistance: '1.2 km',
  eta: '4 分钟',
  currentLocation: 'A区-原料仓主干道',
  steps: [
    { instruction: '沿主干道向东行驶 300 米', distance: '300m' },
    { instruction: '在交叉口右转进入 B区', distance: '500m' },
    { instruction: '直行至成品仓 3号装货口', distance: '400m' },
  ],
}

export const siteFeedbackMock = {
  taskId: 'T-2026-0781',
  jobSite: 'B区-成品仓 3号装货口',
  arrivedAt: '09:15',
  photos: [],
}

export const releaseMock = {
  pendingVehicles: [
    { id: 'REL-001', plate: '沪B-23456', type: '物流车', checkResult: 'pass', checkTime: '14:32', taskId: 'T-2026-0781' },
    { id: 'REL-002', plate: '沪G-78901', type: '临时车', checkResult: 'reject', checkTime: '13:50', reason: '无有效预约' },
  ],
  releaseLog: [
    { id: 'LOG-001', plate: '沪K-01234', action: '放行', time: '14:30', operator: '门岗A' },
    { id: 'LOG-002', plate: '沪L-12346', action: '放行', time: '14:28', operator: '门岗A' },
    { id: 'LOG-003', plate: '沪X-99999', action: '拒绝', time: '14:25', operator: '门岗B', reason: '无预约记录' },
  ],
}

export const alertPanelMock = {
  gateAlerts: [
    { id: 'GA-001', type: '证照过期', plate: '沪G-78901', time: '13:50', status: 'pending', description: '驾驶员证照48小时内过期' },
    { id: 'GA-002', type: '黑名单车辆', plate: '沪X-99999', time: '14:25', status: 'pending', description: '该车辆在系统黑名单中' },
  ],
}

export const releaseRecordsMock = [
  { id: 'REC-001', plate: '沪K-01234', type: '外协车', checkResult: '通过', action: '放行', time: '2026-07-02 14:30', operator: '门岗A', taskId: 'T-2026-0788' },
  { id: 'REC-002', plate: '沪L-12346', type: '生产车', checkResult: '通过', action: '放行', time: '2026-07-02 14:28', operator: '门岗A', taskId: null },
  { id: 'REC-003', plate: '沪X-99999', type: '未知', checkResult: '无预约', action: '拒绝', time: '2026-07-02 14:25', operator: '门岗B', taskId: null },
  { id: 'REC-004', plate: '沪B-23456', type: '物流车', checkResult: '通过', action: '放行', time: '2026-07-02 08:45', operator: '门岗A', taskId: 'T-2026-0781' },
  { id: 'REC-005', plate: '沪H-89012', type: '物流车', checkResult: '预约过期', action: '拒绝', time: '2026-07-01 16:20', operator: '门岗B', taskId: null },
]

export const reportMock = {
  formats: ['Excel (.xlsx)', 'PDF (.pdf)'],
  dateRange: { from: '2026-06-26', to: '2026-07-02' },
  availableReports: [
    { name: '车辆利用率报告', description: '各类型车辆利用率趋势及对比', size: '2.3 MB' },
    { name: '任务完成统计', description: '每日任务完成/取消/待执行统计', size: '1.8 MB' },
    { name: '异常告警汇总', description: '告警类型分布及处理时效分析', size: '1.2 MB' },
    { name: '入场核验记录', description: '车辆入场核验通过/拒绝明细', size: '3.1 MB' },
  ],
}

export const resourceMock = {
  recommendations: [
    { type: '生产车', current: 18, suggested: 20, reason: '利用率 78%，高峰时段供不应求', priority: 'high' },
    { type: '物流车', current: 12, suggested: 12, reason: '利用率适中，暂不需调整', priority: 'low' },
    { type: '外协车', current: 8, suggested: 6, reason: '空驶率偏高（35%），建议减少外协依赖', priority: 'medium' },
  ],
  costSummary: [
    { month: '6月', internalCost: 28.5, externalCost: 15.2, unit: '万元' },
    { month: '5月', internalCost: 26.0, externalCost: 18.7, unit: '万元' },
    { month: '4月', internalCost: 30.2, externalCost: 12.5, unit: '万元' },
  ],
}
