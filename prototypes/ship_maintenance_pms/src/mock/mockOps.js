// 运维管理模拟数据：设备维保计划、航前健康检查、工单执行跟踪

export const equipmentTree = [
  {
    id: 'SYS-PROP', label: '主推进系统', status: '进行中',
    children: [
      { id: 'EQ-ME-FP-001', label: '主机燃油泵', status: '即将到期' },
      { id: 'EQ-ME-FP-002', label: '主机燃油增压泵', status: '正常' },
      { id: 'EQ-ME-CYL', label: '主机气缸单元', status: '异常' },
    ],
  },
  {
    id: 'SYS-ELEC', label: '电力系统', status: '正常',
    children: [
      { id: 'EQ-GEN-001', label: '应急发电机', status: '正常' },
      { id: 'EQ-GEN-002', label: '主发电机 G2', status: '即将到期' },
      { id: 'EQ-BAT', label: '蓄电池组', status: '正常' },
    ],
  },
  {
    id: 'SYS-FIRE', label: '消防救生系统', status: '异常',
    children: [
      { id: 'EQ-FP-001', label: '消防泵', status: '异常' },
      { id: 'EQ-LIFE-001', label: '救生艇吊架', status: '正常' },
    ],
  },
  {
    id: 'SYS-DECK', label: '甲板机械', status: '正常',
    children: [
      { id: 'EQ-RUD-001', label: '舵机液压站', status: '正常' },
      { id: 'EQ-WINCH', label: '锚机绞缆', status: '已闭环' },
    ],
  },
]

export const maintenancePlans = [
  { id: 'PLN-2026-001', equipmentId: 'EQ-ME-FP-001', equipmentName: '主机燃油泵', ship: 'HG-01 启航轮', planType: '运行小时', cycleValue: 500, cycleUnit: '小时', startDate: '2026-01-15', advanceWarningDays: 15, priority: '高', status: '已生效', nextDue: '2026-07-20', lastDone: '2026-04-15', progress: 72 },
  { id: 'PLN-2026-002', equipmentId: 'EQ-GEN-001', equipmentName: '应急发电机', ship: 'HG-02 宏远轮', planType: '日历周期', cycleValue: 3, cycleUnit: '月', startDate: '2026-02-01', advanceWarningDays: 7, priority: '中', status: '审核中', nextDue: '2026-08-01', lastDone: '2026-05-01', progress: 45 },
  { id: 'PLN-2026-003', equipmentId: 'EQ-FP-001', equipmentName: '消防泵', ship: 'HG-01 启航轮', planType: '工况触发', cycleValue: 1, cycleUnit: '次/航次', startDate: '2026-03-10', advanceWarningDays: 3, priority: '高', status: '即将到期', nextDue: '2026-07-09', lastDone: '2026-06-10', progress: 90 },
  { id: 'PLN-2026-004', equipmentId: 'EQ-RUD-001', equipmentName: '舵机液压站', ship: 'HG-03 海工保障船', planType: '运行小时', cycleValue: 2000, cycleUnit: '小时', startDate: '2026-01-20', advanceWarningDays: 20, priority: '中', status: '已生效', nextDue: '2026-09-15', lastDone: '2026-03-20', progress: 30 },
  { id: 'PLN-2026-005', equipmentId: 'EQ-GEN-002', equipmentName: '主发电机 G2', ship: 'HG-02 宏远轮', planType: '日历周期', cycleValue: 6, cycleUnit: '月', startDate: '2026-01-05', advanceWarningDays: 14, priority: '高', status: '已过期', nextDue: '2026-07-05', lastDone: '2026-01-05', progress: 100 },
  { id: 'PLN-2026-006', equipmentId: 'EQ-ME-CYL', equipmentName: '主机气缸单元', ship: 'HG-01 启航轮', planType: '运行小时', cycleValue: 8000, cycleUnit: '小时', startDate: '2026-02-12', advanceWarningDays: 10, priority: '高', status: '审核中', nextDue: '2026-10-12', lastDone: '2026-02-12', progress: 18 },
  { id: 'PLN-2026-007', equipmentId: 'EQ-WINCH', equipmentName: '锚机绞缆', ship: 'HG-03 海工保障船', planType: '日历周期', cycleValue: 12, cycleUnit: '月', startDate: '2026-01-01', advanceWarningDays: 30, priority: '低', status: '已生效', nextDue: '2027-01-01', lastDone: '2026-01-01', progress: 50 },
  { id: 'PLN-2026-008', equipmentId: 'EQ-LIFE-001', equipmentName: '救生艇吊架', ship: 'HG-02 宏远轮', planType: '日历周期', cycleValue: 3, cycleUnit: '月', startDate: '2026-04-01', advanceWarningDays: 7, priority: '高', status: '即将到期', nextDue: '2026-07-10', lastDone: '2026-04-01', progress: 85 },
]

export const approvals = [
  { id: 'APP-001', applicant: '机务主管 张工', planId: 'PLN-2026-002', action: '新建计划', summary: '应急发电机季度试车，周期3月', status: '待审批', submitAt: '2026-07-06 14:20', priority: '中',
    before: null,
    after: { planType: '日历周期', cycleValue: '3 月', advanceWarningDays: 7, priority: '中', workOrderTemplate: '应急发电机季度试车模板' },
    history: [{ operator: '机务主管 张工', action: '提交申请', time: '2026-07-06 14:20', comment: '按船级社要求调整试车周期' }] },
  { id: 'APP-002', applicant: '机务工程师 李工', planId: 'PLN-2026-006', action: '新建计划', summary: '主机气缸单元大修周期计划', status: '待审批', submitAt: '2026-07-05 09:10', priority: '高',
    before: null,
    after: { planType: '运行小时', cycleValue: '8000 小时', advanceWarningDays: 10, priority: '高', workOrderTemplate: '主机气缸大修模板' },
    history: [{ operator: '机务工程师 李工', action: '提交申请', time: '2026-07-05 09:10', comment: '依据厂家维保手册设定周期' }] },
  { id: 'APP-003', applicant: '机务主管 张工', planId: 'PLN-2026-001', action: '调整周期', summary: '主机燃油泵周期由750小时调整为500小时', status: '待审批', submitAt: '2026-07-04 16:30', priority: '高',
    before: { planType: '运行小时', cycleValue: '750 小时', advanceWarningDays: 7, priority: '中', workOrderTemplate: '主机燃油泵月度保养模板' },
    after: { planType: '运行小时', cycleValue: '500 小时', advanceWarningDays: 15, priority: '高', workOrderTemplate: '主机燃油泵月度保养模板' },
    history: [
      { operator: '机务主管 张工', action: '提交申请', time: '2026-07-04 16:30', comment: '近期磨损加剧，缩短周期' },
      { operator: '系统', action: '冲突检测', time: '2026-07-04 16:31', comment: '未检测到与其他计划冲突' },
    ] },
  { id: 'APP-004', applicant: '机务工程师 李工', planId: 'PLN-2026-005', action: '调整周期', summary: '主发电机G2由6月调整为4月', status: '已驳回', submitAt: '2026-07-02 11:00', priority: '高',
    before: { planType: '日历周期', cycleValue: '6 月', advanceWarningDays: 14, priority: '高', workOrderTemplate: '发电机半年保养模板' },
    after: { planType: '日历周期', cycleValue: '4 月', advanceWarningDays: 14, priority: '高', workOrderTemplate: '发电机半年保养模板' },
    history: [
      { operator: '机务工程师 李工', action: '提交申请', time: '2026-07-02 11:00', comment: '考虑运行负荷增加' },
      { operator: '机务主任 王工', action: '驳回', time: '2026-07-03 09:15', comment: '4月周期过于频繁，建议5月并加强状态监测' },
    ] },
  { id: 'APP-005', applicant: '机务主管 张工', planId: 'PLN-2026-004', action: '新建计划', summary: '舵机液压站2000小时保养', status: '已通过', submitAt: '2026-06-28 10:00', priority: '中',
    before: null,
    after: { planType: '运行小时', cycleValue: '2000 小时', advanceWarningDays: 20, priority: '中', workOrderTemplate: '舵机液压站保养模板' },
    history: [
      { operator: '机务主管 张工', action: '提交申请', time: '2026-06-28 10:00', comment: '' },
      { operator: '机务主任 王工', action: '通过', time: '2026-06-29 14:20', comment: '同意，按计划执行' },
    ] },
]

export const voyageHealthChecks = [
  { checkId: 'CHK-2026-007', shipId: 'HG-01', shipName: 'HG-01 启航轮', status: '不通过', score: 72, interceptStatus: '拦截', issueCount: 4, voyageNo: 'V2026-014', checkTime: '2026-07-07 08:00', summary: '2项设备异常+1项缺件预警+1项证书临期' },
  { checkId: 'CHK-2026-006', shipId: 'HG-02', shipName: 'HG-02 宏远轮', status: '通过', score: 96, interceptStatus: '放行', issueCount: 0, voyageNo: 'V2026-009', checkTime: '2026-07-06 16:30', summary: '全部校验项通过' },
  { checkId: 'CHK-2026-005', shipId: 'HG-03', shipName: 'HG-03 海工保障船', status: '待检查', score: null, interceptStatus: '待定', issueCount: null, voyageNo: 'V2026-021', checkTime: null, summary: '等待发起航前检查' },
  { checkId: 'CHK-2026-004', shipId: 'HG-01', shipName: 'HG-01 启航轮', status: '通过', score: 91, interceptStatus: '放行', issueCount: 1, voyageNo: 'V2026-013', checkTime: '2026-07-01 09:00', summary: '1项豁免处置后通过' },
  { checkId: 'CHK-2026-003', shipId: 'HG-02', shipName: 'HG-02 宏远轮', status: '不通过', score: 68, interceptStatus: '拦截', issueCount: 3, voyageNo: 'V2026-008', checkTime: '2026-06-25 07:30', summary: '应急发电机故障已处置后复查通过' },
]

export const voyageHealthIssues = [
  { issueId: 'ISS-001', checkId: 'CHK-2026-007', category: '关键设备', severity: '高', title: '主机燃油泵出口压力低于阈值', relatedObject: 'EQ-ME-FP-001 主机燃油泵', expireDate: '2026-07-08', disposalProgress: 40, status: '处置中', description: '出口压力 2.1bar 低于标准 2.8bar，疑似滤器堵塞', linkedWorkOrder: null, linkedWorkOrderId: null, linkedWorkOrderStatus: null, reinspectionStatus: null, linkedMaterial: '燃油滤芯 FP-200', linkedCertificate: null },
  { issueId: 'ISS-002', checkId: 'CHK-2026-007', category: '备件库存', severity: '中', title: '消防泵密封件缺件预警', relatedObject: 'FP-SEAL-01 机械密封', expireDate: '2026-07-10', disposalProgress: 0, status: '待处置', description: '库存剩余1件，低于安全库存3件', linkedWorkOrder: null, linkedWorkOrderId: null, linkedWorkOrderStatus: null, reinspectionStatus: null, linkedMaterial: 'FP-SEAL-01', linkedCertificate: null },
  { issueId: 'ISS-003', checkId: 'CHK-2026-007', category: '船员证书', severity: '低', title: '轮机长适任证书临期', relatedObject: '证书 CERT-OPS-022', expireDate: '2026-07-20', disposalProgress: 0, status: '待处置', description: '证书将于13天后到期，需安排换证', linkedWorkOrder: null, linkedWorkOrderId: null, linkedWorkOrderStatus: null, reinspectionStatus: null, linkedMaterial: null, linkedCertificate: 'CERT-OPS-022' },
  { issueId: 'ISS-004', checkId: 'CHK-2026-007', category: '未闭环工单', severity: '中', title: '应急发电机试车工单未闭环', relatedObject: 'WO-2026-1188', expireDate: '2026-07-09', disposalProgress: 60, status: '处置中', description: '试车发现启动延时偏长，需复测', linkedWorkOrder: 'WO-2026-1188', linkedWorkOrderId: 'WO-2026-1188', linkedWorkOrderStatus: '执行中', reinspectionStatus: '待复检', linkedMaterial: null, linkedCertificate: null },
]

export const healthCheckMatrix = [
  { name: '关键设备', result: '2项异常', tone: 'danger', detail: '主机燃油泵压力异常、气缸温度偏高' },
  { name: '备件库存', result: '1项缺件', tone: 'warn', detail: '消防泵密封件低于安全库存' },
  { name: '船员证书', result: '1项临期', tone: 'warn', detail: '轮机长适任证书13天后到期' },
  { name: '未闭环工单', result: '3项待审', tone: 'warn', detail: '含1项应急发电机试车工单' },
  { name: '通信同步', result: '18分钟前', tone: 'ok', detail: '船岸数据同步正常' },
  { name: '开航判定', result: '暂不通过', tone: 'danger', detail: '存在高风险拦截项' },
]

export const workOrders = [
  { id: 'WO-2026-1201', type: '预防性维护', status: '待审核', priority: '高', ship: 'HG-01 启航轮', equipment: 'EQ-ME-FP-001 主机燃油泵', planDate: '2026-07-06', planId: 'PLN-2026-001', executor: '轮机长 陈海', reportData: { actualHours: 3.5, materials: [{ name: '燃油滤芯 FP-200', qty: 2 }, { name: '密封垫片', qty: 4 }], findings: '更换滤芯，出口压力恢复至3.0bar' }, attachments: 3, submittedAt: '2026-07-06 16:20' },
  { id: 'WO-2026-1198', type: '故障维修', status: '需整改', priority: '高', ship: 'HG-01 启航轮', equipment: 'EQ-FP-001 消防泵', planDate: '2026-07-05', planId: null, executor: '机工 刘洋', reportData: { actualHours: 5, materials: [{ name: '机械密封 FP-SEAL-01', qty: 1 }], findings: '密封更换后仍有渗漏，需复测' }, attachments: 5, submittedAt: '2026-07-05 18:00' },
  { id: 'WO-2026-1195', type: '预防性维护', status: '已闭环', priority: '中', ship: 'HG-02 宏远轮', equipment: 'EQ-GEN-001 应急发电机', planDate: '2026-07-04', planId: 'PLN-2026-002', executor: '轮机长 赵峰', reportData: { actualHours: 2, materials: [{ name: '柴油滤芯', qty: 1 }], findings: '空载试车正常，启动延时1.2s达标' }, attachments: 2, submittedAt: '2026-07-04 15:30' },
  { id: 'WO-2026-1190', type: '专项检查', status: '待审核', priority: '中', ship: 'HG-03 海工保障船', equipment: 'EQ-RUD-001 舵机液压站', planDate: '2026-07-03', planId: 'PLN-2026-004', executor: '机工 孙磊', reportData: { actualHours: 4, materials: [{ name: '液压油', qty: 20 }], findings: '油液更换完毕，取样化验中' }, attachments: 4, submittedAt: '2026-07-03 17:10' },
  { id: 'WO-2026-1188', type: '故障维修', status: '需整改', priority: '高', ship: 'HG-01 启航轮', equipment: 'EQ-GEN-001 应急发电机', planDate: '2026-07-02', planId: null, executor: '轮机长 陈海', reportData: { actualHours: 6, materials: [], findings: '启动延时2.8s偏长，建议复测调速器' }, attachments: 6, submittedAt: '2026-07-02 19:40' },
  { id: 'WO-2026-1180', type: '预防性维护', status: '已闭环', priority: '低', ship: 'HG-02 宏远轮', equipment: 'EQ-LIFE-001 救生艇吊架', planDate: '2026-06-30', planId: 'PLN-2026-008', executor: '机工 周明', reportData: { actualHours: 1.5, materials: [{ name: '润滑脂', qty: 1 }], findings: '吊架润滑完成，限位开关正常' }, attachments: 2, submittedAt: '2026-06-30 11:00' },
]

// 船端移动工单：待执行/执行中/待同步（区别于岸基审核工单的待审核/需整改/已闭环）
export const mobileWorkOrders = [
  { id: 'WO-2026-1301', type: '预防性维护', status: '待执行', priority: '高', ship: 'HG-01 启航轮', equipment: 'EQ-ME-FP-001 主机燃油泵', planDate: '2026-07-07', planId: 'PLN-2026-001', executor: '轮机长 陈海', reportData: { actualHours: null, materials: [], findings: '' }, attachments: 0, submittedAt: '', steps: ['断电挂牌穿戴PPE', '拆卸滤器检查密封面', '更换燃油滤芯及密封垫片', '复装管路恢复供电', '启泵试压记录参数'] },
  { id: 'WO-2026-1302', type: '故障维修', status: '待执行', priority: '高', ship: 'HG-01 启航轮', equipment: 'EQ-FP-001 消防泵', planDate: '2026-07-07', planId: null, executor: '机工 刘洋', reportData: { actualHours: null, materials: [], findings: '' }, attachments: 0, submittedAt: '', steps: ['断电挂牌', '拆卸消防泵端盖', '检查机械密封磨损', '更换密封件', '复装试压'] },
  { id: 'WO-2026-1303', type: '预防性维护', status: '执行中', priority: '中', ship: 'HG-01 启航轮', equipment: 'EQ-GEN-001 应急发电机', planDate: '2026-07-06', planId: 'PLN-2026-002', executor: '轮机长 陈海', reportData: { actualHours: 1.5, materials: [{ name: '柴油滤芯', qty: 1 }], findings: '已完成滤芯更换，待试车' }, attachments: 2, submittedAt: '', steps: ['断电挂牌', '更换柴油滤芯', '检查油路密封', '空载试车', '记录启动参数'] },
  { id: 'WO-2026-1304', type: '专项检查', status: '待执行', priority: '中', ship: 'HG-01 启航轮', equipment: 'EQ-RUD-001 舵机液压站', planDate: '2026-07-08', planId: 'PLN-2026-004', executor: '机工 刘洋', reportData: { actualHours: null, materials: [], findings: '' }, attachments: 0, submittedAt: '', steps: ['检查液压油位', '取样化验', '检查管路渗漏', '测试转向响应', '记录压力参数'] },
  { id: 'WO-2026-1305', type: '预防性维护', status: '待同步', priority: '低', ship: 'HG-01 启航轮', equipment: 'EQ-LIFE-001 救生艇吊架', planDate: '2026-07-05', planId: 'PLN-2026-008', executor: '机工 刘洋', reportData: { actualHours: 1.5, materials: [{ name: '润滑脂', qty: 1 }], findings: '吊架润滑完成，限位开关正常' }, attachments: 2, submittedAt: '2026-07-05 15:00', steps: ['检查吊架结构', '润滑活动部件', '测试限位开关', '记录保养结果'] },
  { id: 'WO-2026-1306', type: '故障维修', status: '待执行', priority: '高', ship: 'HG-01 启航轮', equipment: 'EQ-ME-CYL 主机气缸单元', planDate: '2026-07-09', planId: 'PLN-2026-006', executor: '轮机长 陈海', reportData: { actualHours: null, materials: [], findings: '' }, attachments: 0, submittedAt: '', steps: ['拆检气缸盖', '测量缸套磨损', '更换密封圈', '复装测试', '记录参数'] },
]

export const workOrderSteps = [
  { step: 1, name: '安全准备', desc: '断电、挂牌、穿戴PPE', done: true },
  { step: 2, name: '拆卸检查', desc: '拆卸滤器、检查密封面', done: true },
  { step: 3, name: '更换备件', desc: '更换燃油滤芯及密封垫片', done: true },
  { step: 4, name: '组装复位', desc: '复装管路、恢复供电', done: true },
  { step: 5, name: '试运行', desc: '启泵试压、记录参数', done: false },
]

export const auditLogs = [
  { id: 'LOG-9001', operator: '机务主管 张工', action: '提交计划变更', objectType: '维保计划', timestamp: '2026-07-06 14:20', detail: 'PLN-2026-001 周期 750→500 小时' },
  { id: 'LOG-9002', operator: '机务主任 王工', action: '审批通过', objectType: '维保计划', timestamp: '2026-07-05 10:30', detail: 'PLN-2026-004 舵机液压站计划' },
  { id: 'LOG-9003', operator: '系统', action: '自动生成工单', objectType: '工单', timestamp: '2026-07-05 00:05', detail: 'PLN-2026-003 到期触发 WO-2026-1198' },
  { id: 'LOG-9004', operator: '轮机长 陈海', action: '提交报工', objectType: '工单', timestamp: '2026-07-06 16:20', detail: 'WO-2026-1201 主机燃油泵保养' },
  { id: 'LOG-9005', operator: '机务主管 张工', action: '退回工单', objectType: '工单', timestamp: '2026-07-05 18:30', detail: 'WO-2026-1198 渗漏未解决' },
]
