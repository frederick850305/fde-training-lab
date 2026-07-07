// 船舶运行监控与调度指令模拟数据

export const vessels = [
  { id: 'HG-01', name: 'HG-01 启航轮', position: { lng: 122.45, lat: 30.18 }, speed: 12.5, heading: 85, operationalStatus: '航行中', communicationStatus: '在线', route: '宁波→釜山', lastReport: '2026-07-07 09:25', eta: '2026-07-09 06:00', healthScore: 72, alertCount: 4 },
  { id: 'HG-02', name: 'HG-02 宏远轮', position: { lng: 121.90, lat: 29.82 }, speed: 0, heading: 0, operationalStatus: '靠泊作业', communicationStatus: '在线', route: '舟山港', lastReport: '2026-07-07 09:20', eta: '—', healthScore: 96, alertCount: 0 },
  { id: 'HG-03', name: 'HG-03 海工保障船', position: { lng: 123.10, lat: 30.65 }, speed: 8.0, heading: 200, operationalStatus: '航行中', communicationStatus: '弱网', route: '东海作业区', lastReport: '2026-07-07 08:40', eta: '2026-07-07 14:00', healthScore: 88, alertCount: 1 },
  { id: 'HG-04', name: 'HG-04 远洋拖轮', position: { lng: 122.05, lat: 30.92 }, speed: 0, heading: 0, operationalStatus: '锚泊待命', communicationStatus: '离线', route: '锚地B-3', lastReport: '2026-07-06 22:10', eta: '—', healthScore: null, alertCount: 2 },
]

const hg01Detail = {
  id: 'HG-01',
  name: 'HG-01 启航轮',
  currentVoyage: { voyageNo: 'V2026-014', departure: '宁波', destination: '釜山', departTime: '2026-07-07 06:00', eta: '2026-07-09 06:00', cargoType: '集装箱', progress: 18 },
  workOrderProgress: { total: 6, done: 3, inProgress: 2, pending: 1 },
  healthCheckResult: { checkId: 'CHK-2026-007', status: '不通过', score: 72, interceptStatus: '拦截', issues: 4 },
  certificateAlerts: [
    { certId: 'CERT-OPS-022', name: '轮机长适任证书', holder: '陈海', expireDate: '2026-07-20', status: '临期' },
    { certId: 'CERT-SAFE-008', name: '高级消防培训证', holder: '刘洋', expireDate: '2026-08-15', status: '正常' },
    { certId: 'CERT-MED-015', name: '精通急救证', holder: '周明', expireDate: '2026-06-30', status: '过期' },
  ],
  recentIssues: [
    { id: 'ISS-001', title: '主机燃油泵出口压力低', severity: '高', status: '处置中' },
    { id: 'ISS-004', title: '应急发电机启动延时偏长', severity: '中', status: '处置中' },
  ],
}

export const vesselDetails = {
  'HG-01': hg01Detail,
  'HG-02': {
    id: 'HG-02',
    name: 'HG-02 宏远轮',
    currentVoyage: { voyageNo: 'V2026-009', departure: '上海', destination: '舟山', departTime: '2026-07-05 08:00', eta: '2026-07-05 18:00', cargoType: '散货', progress: 100 },
    workOrderProgress: { total: 4, done: 4, inProgress: 0, pending: 0 },
    healthCheckResult: { checkId: 'CHK-2026-006', status: '通过', score: 96, interceptStatus: '放行', issues: 0 },
    certificateAlerts: [
      { certId: 'CERT-OPS-041', name: '船长适任证书', holder: '赵峰', expireDate: '2027-02-15', status: '正常' },
      { certId: 'CERT-SAFE-031', name: '基本安全培训证', holder: '钱明', expireDate: '2026-09-01', status: '正常' },
    ],
    recentIssues: [],
  },
  'HG-03': {
    id: 'HG-03',
    name: 'HG-03 海工保障船',
    currentVoyage: { voyageNo: 'V2026-021', departure: '母港', destination: '东海作业区', departTime: '2026-07-07 05:30', eta: '2026-07-07 14:00', cargoType: '平台物资', progress: 45 },
    workOrderProgress: { total: 5, done: 2, inProgress: 2, pending: 1 },
    healthCheckResult: { checkId: 'CHK-2026-005', status: '待检查', score: 88, interceptStatus: '待定', issues: 1 },
    certificateAlerts: [
      { certId: 'CERT-OPS-055', name: '轮机员适任证书', holder: '孙磊', expireDate: '2026-07-18', status: '临期' },
      { certId: 'CERT-MED-019', name: '精通急救证', holder: '周明', expireDate: '2026-11-30', status: '正常' },
    ],
    recentIssues: [
      { id: 'ISS-HG03-001', title: '船岸同步延迟导致健康校验待复核', severity: '中', status: '待处置' },
    ],
  },
  'HG-04': {
    id: 'HG-04',
    name: 'HG-04 远洋拖轮',
    currentVoyage: { voyageNo: 'V2026-005', departure: '锚地B-3', destination: '待命', departTime: '—', eta: '—', cargoType: '拖带待命', progress: 0 },
    workOrderProgress: { total: 3, done: 1, inProgress: 0, pending: 2 },
    healthCheckResult: { checkId: null, status: '待检查', score: '—', interceptStatus: '待定', issues: 0 },
    certificateAlerts: [
      { certId: 'CERT-RAD-012', name: 'GMDSS证书', holder: '李远', expireDate: '2026-06-20', status: '过期' },
    ],
    recentIssues: [],
  },
}

export const vesselDetail = vesselDetails['HG-01']

export const dispatchCommands = [
  { id: 'CMD-2026-031', vesselId: 'HG-01', vesselName: 'HG-01 启航轮', voyageNumber: 'V2026-014', departureTime: '2026-07-07 06:00', estimatedArrivalTime: '2026-07-09 06:00', route: '宁波→釜山', taskRequirements: '按计划靠泊釜山港3号泊位，注意台风外围涌浪', status: '执行中', issuedBy: '调度主任 林涛', issuedAt: '2026-07-06 20:00', progress: 18 },
  { id: 'CMD-2026-030', vesselId: 'HG-02', vesselName: 'HG-02 宏远轮', voyageNumber: 'V2026-009', departureTime: '2026-07-05 08:00', estimatedArrivalTime: '2026-07-05 18:00', route: '上海→舟山', taskRequirements: '靠泊舟山港完成卸货补给', status: '已闭环', issuedBy: '调度主任 林涛', issuedAt: '2026-07-04 16:00', progress: 100 },
  { id: 'CMD-2026-029', vesselId: 'HG-03', vesselName: 'HG-03 海工保障船', voyageNumber: 'V2026-021', departureTime: '2026-07-07 05:30', estimatedArrivalTime: '2026-07-07 14:00', route: '母港→东海作业区', taskRequirements: '前往作业区执行平台物资转运', status: '执行中', issuedBy: '调度员 周敏', issuedAt: '2026-07-06 18:00', progress: 45 },
  { id: 'CMD-2026-028', vesselId: 'HG-04', vesselName: 'HG-04 远洋拖轮', voyageNumber: 'V2026-005', departureTime: null, estimatedArrivalTime: null, route: '锚地B-3待命', taskRequirements: '原地待命，保持通讯', status: '待下发', issuedBy: null, issuedAt: null, progress: 0 },
]

export const fleetStats = {
  total: 4,
  sailing: 2,
  berthing: 1,
  anchoring: 1,
  online: 3,
  weakNetwork: 1,
  offline: 1,
  avgHealth: 85,
  activeAlerts: 7,
}
