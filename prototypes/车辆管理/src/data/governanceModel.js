const commonPeople = {
  dispatcher: '调度员-王敏',
  driver: '司机-李师傅',
  gate: '门岗-赵工',
  approver: '审批-陈主管',
  manager: '管理层-刘总',
  admin: '管理员-周工',
}

const vehicles = [
  { id: 'V001', plate: '沪A-2601', type: '重型货车', driver: '李师傅', phone: '13800138001', location: '东区堆场', status: '空闲', task: '待命', inspection: '2026-04-01', insurance: '2026-03-15', unit: '物流一队' },
  { id: 'V002', plate: '沪B-3812', type: '厢式货车', driver: '王师傅', phone: '13800138002', location: '南门岗', status: '任务中', task: '钢材转运', inspection: '2026-02-20', insurance: '2026-01-18', unit: '物流二队' },
  { id: 'V003', plate: '沪C-4920', type: '平板车', driver: '赵师傅', phone: '13800138003', location: '维修车间', status: '异常', task: '等待维修', inspection: '2025-08-12', insurance: '2025-09-01', unit: '外协车队' },
  { id: 'V004', plate: '沪D-7356', type: '牵引车', driver: '陈师傅', phone: '13800138004', location: '北区仓库', status: '排队', task: '待装卸', inspection: '2026-06-09', insurance: '2026-05-22', unit: '物流一队' },
]

const demands = [
  { id: 'D001', applicant: '张工', start: 'A区仓库', end: 'B区产线', material: '钢材', status: '待派车', priority: '高', time: '2026-07-04 09:10' },
  { id: 'D002', applicant: '李主任', start: '行政楼', end: '物流中心', material: '资料箱', status: '待派车', priority: '中', time: '2026-07-04 09:35' },
  { id: 'D003', applicant: '王工', start: '南门岗', end: '维修车间', material: '备件', status: '已派车', priority: '中', time: '2026-07-04 10:05' },
]

const tasks = [
  { id: 'T001', title: 'A区仓库到B区产线', plate: '沪B-3812', driver: '王师傅', start: 'A区仓库', end: 'B区产线', status: '进行中', eta: '10:40', phase: '运输中' },
  { id: 'T002', title: '行政楼到物流中心', plate: '沪A-2601', driver: '李师傅', start: '行政楼', end: '物流中心', status: '待接单', eta: '11:10', phase: '待司机接单' },
  { id: 'T003', title: '南门岗到维修车间', plate: '沪C-4920', driver: '赵师傅', start: '南门岗', end: '维修车间', status: '异常', eta: '待确认', phase: '车辆异常' },
]

const alerts = [
  { id: 'A001', type: '异常停留', plate: '沪C-4920', location: '维修车间入口', level: '高', status: '未处理', time: '2026-07-04 09:42' },
  { id: 'A002', type: '偏离路线', plate: '沪B-3812', location: '东区支路', level: '中', status: '处理中', time: '2026-07-04 09:55' },
]

const gateItems = [
  { id: 'G001', plate: '沪E-8120', type: '外协货车', company: '宝山物流', cert: '已上传', purpose: '送货', status: '待核验', time: '2026-07-04 08:50' },
  { id: 'G002', plate: '沪F-6731', type: '临时车辆', company: '设备维保', cert: '缺少保险', purpose: '检修', status: '需人工判断', time: '2026-07-04 09:25' },
]

const gateRecords = [
  { id: 'E001', plate: '沪A-2601', action: '放行', operator: commonPeople.gate, sync: '已同步', time: '2026-07-04 08:10' },
  { id: 'E002', plate: '沪F-6731', action: '拒绝', operator: commonPeople.gate, sync: '同步失败', time: '2026-07-04 09:30' },
]

const reservations = [
  { id: 'R001', plate: '沪E-8120', company: '宝山物流', area: 'B区产线', status: '待审批', result: '档案通过', code: '-', sync: '待同步', time: '2026-07-04 08:40' },
  { id: 'R002', plate: '沪F-6731', company: '设备维保', area: '维修车间', status: '已通过', result: '证照临期', code: 'AC-562913', sync: '已同步', time: '2026-07-04 09:05' },
  { id: 'R003', plate: '沪G-9042', company: '第三方检测', area: '北区仓库', status: '已驳回', result: '保险缺失', code: '-', sync: '无需同步', time: '2026-07-04 09:50' },
]

const reports = [
  { id: 'M001', metric: '车辆在线率', value: '92%', trend: '+3%', owner: '调度中心', status: '正常' },
  { id: 'M002', metric: '任务准点率', value: '87%', trend: '-2%', owner: '运输班组', status: '关注' },
  { id: 'M003', metric: '门岗平均核验时长', value: '2.8分钟', trend: '-0.4分钟', owner: '场地管理', status: '正常' },
]

const logs = [
  { id: 'L001', object: '沪A-2601', action: '新增车辆档案', operator: commonPeople.admin, time: '2026-07-03 15:10', result: '成功' },
  { id: 'L002', object: '沪C-4920', action: '更新保险有效期', operator: commonPeople.admin, time: '2026-07-04 09:20', result: '成功' },
  { id: 'L003', object: '沪F-6731', action: '外协准入校验', operator: commonPeople.gate, time: '2026-07-04 09:30', result: '需复核' },
]

function metric(label, value, tone = 'normal') {
  return { label, value, tone }
}

function page(title, subtitle, rows, columns, metrics, actions = []) {
  return { title, subtitle, rows, columns, metrics, actions }
}

export const governedPages = {
  'DispatchWorkbenchView.vue': page(
    '调度工作台',
    '面向调度员的实时车辆、用车需求和派车操作总览。',
    demands,
    [
      { key: 'id', label: '需求编号' },
      { key: 'applicant', label: '申请人' },
      { key: 'start', label: '出发地' },
      { key: 'end', label: '目的地' },
      { key: 'priority', label: '优先级' },
      { key: 'status', label: '状态' },
    ],
    [metric('空闲车辆', 1), metric('任务中', 1), metric('待派车需求', 2), metric('异常车辆', 1, 'danger')],
    ['确认派车', '查看车辆', '联系司机']
  ),
  'AlertAndTaskMonitorView.vue': page(
    '告警与任务监控',
    '监控车辆异常和任务执行进度，支持调度员快速干预。',
    alerts,
    [
      { key: 'id', label: '告警编号' },
      { key: 'type', label: '类型' },
      { key: 'plate', label: '车辆' },
      { key: 'location', label: '位置' },
      { key: 'level', label: '等级' },
      { key: 'status', label: '处理状态' },
    ],
    [metric('未处理告警', 1, 'danger'), metric('进行中任务', 1), metric('需关注车辆', 2), metric('今日告警', 2)],
    ['标记处理中', '创建调整单', '通知司机']
  ),
  'MobileDispatchView.vue': page(
    '移动调度',
    '适配移动场景的周边车辆、告警通知和通讯入口。',
    vehicles,
    [
      { key: 'plate', label: '车牌' },
      { key: 'driver', label: '司机' },
      { key: 'location', label: '当前位置' },
      { key: 'status', label: '状态' },
      { key: 'task', label: '当前任务' },
    ],
    [metric('周边车辆', vehicles.length), metric('可调度', 1), metric('告警通知', alerts.length), metric('在线司机', 3)],
    ['发起通讯', '调整任务', '查看路线']
  ),
  'TaskAdjustView.vue': page(
    '任务调整',
    '处理改派、取消、加派和异常登记。',
    tasks,
    [
      { key: 'id', label: '任务编号' },
      { key: 'title', label: '任务' },
      { key: 'plate', label: '车辆' },
      { key: 'driver', label: '司机' },
      { key: 'phase', label: '阶段' },
      { key: 'status', label: '状态' },
    ],
    [metric('可调整任务', 3), metric('改派候选司机', 2), metric('异常任务', 1, 'danger'), metric('待提交', 1)],
    ['改派', '取消任务', '加派地点']
  ),
  'DriverTaskListView.vue': page(
    '司机任务列表',
    '司机查看待接单、执行中和已完成任务。',
    tasks,
    [
      { key: 'id', label: '任务编号' },
      { key: 'title', label: '任务' },
      { key: 'start', label: '起点' },
      { key: 'end', label: '终点' },
      { key: 'eta', label: '预计完成' },
      { key: 'status', label: '状态' },
    ],
    [metric('待接单', 1), metric('进行中', 1), metric('异常', 1, 'danger'), metric('今日任务', 3)],
    ['接单', '查看详情', '反馈异常']
  ),
  'DriverTaskExecuteView.vue': page(
    '任务执行',
    '司机执行运输任务，确认到达、完成任务并提交反馈。',
    tasks.slice(0, 1),
    [
      { key: 'id', label: '任务编号' },
      { key: 'title', label: '当前任务' },
      { key: 'start', label: '起点' },
      { key: 'end', label: '终点' },
      { key: 'phase', label: '执行阶段' },
      { key: 'status', label: '状态' },
    ],
    [metric('当前任务', 1), metric('剩余节点', 2), metric('预计完成', '10:40'), metric('异常反馈', 0)],
    ['确认到达', '完成任务', '上报异常']
  ),
  'GateAccessCheckView.vue': page(
    '门岗核验',
    '门岗对入场车辆进行预约、证照和准入核验。',
    gateItems,
    [
      { key: 'id', label: '核验编号' },
      { key: 'plate', label: '车牌' },
      { key: 'company', label: '单位' },
      { key: 'purpose', label: '入场目的' },
      { key: 'cert', label: '证照状态' },
      { key: 'status', label: '核验状态' },
    ],
    [metric('待核验', 2), metric('自动通过', 1), metric('需人工判断', 1, 'danger'), metric('平均耗时', '2.6分钟')],
    ['放行', '拒绝', '降级登记']
  ),
  'GateEntryRecordsView.vue': page(
    '入场记录',
    '追踪放行、拒绝和门禁同步状态。',
    gateRecords,
    [
      { key: 'id', label: '记录编号' },
      { key: 'plate', label: '车牌' },
      { key: 'action', label: '操作' },
      { key: 'operator', label: '操作人' },
      { key: 'sync', label: '同步状态' },
      { key: 'time', label: '时间' },
    ],
    [metric('今日入场', 2), metric('同步成功', 1), metric('同步失败', 1, 'danger'), metric('待复核', 1)],
    ['重新同步', '导出记录', '查看详情']
  ),
  'WorkspaceView.vue': page(
    '预约工作台',
    '审批外协和临时车辆预约，生成授权码并同步门禁。',
    reservations,
    [
      { key: 'id', label: '预约编号' },
      { key: 'plate', label: '车牌' },
      { key: 'company', label: '单位' },
      { key: 'area', label: '作业区域' },
      { key: 'result', label: '档案校验' },
      { key: 'status', label: '审批状态' },
    ],
    [metric('待审批', 1), metric('已通过', 1), metric('已驳回', 1), metric('证照风险', 1, 'danger')],
    ['审批通过', '驳回', '查看档案']
  ),
  'AccessCodeView.vue': page(
    '授权码管理',
    '查看授权码状态、门禁同步结果和使用情况。',
    reservations.filter(item => item.code !== '-'),
    [
      { key: 'id', label: '预约编号' },
      { key: 'plate', label: '车牌' },
      { key: 'company', label: '单位' },
      { key: 'code', label: '授权码' },
      { key: 'sync', label: '同步状态' },
      { key: 'time', label: '生成时间' },
    ],
    [metric('有效授权码', 1), metric('待同步', 0), metric('已同步', 1), metric('异常同步', 0)],
    ['重试同步', '查看日志', '作废授权码']
  ),
  'HistoryView.vue': page(
    '历史记录',
    '查询历史预约、入场、费用和审批链路。',
    reservations,
    [
      { key: 'id', label: '预约编号' },
      { key: 'plate', label: '车牌' },
      { key: 'company', label: '单位' },
      { key: 'status', label: '审批状态' },
      { key: 'sync', label: '同步状态' },
      { key: 'time', label: '预约时间' },
    ],
    [metric('历史预约', 3), metric('已通过', 1), metric('已驳回', 1), metric('可导出', 3)],
    ['导出Excel', '查看详情', '复用申请']
  ),
  'ManagementReportsView.vue': page(
    '运营报表',
    '管理层查看车辆、任务、门岗和外协准入关键指标。',
    reports,
    [
      { key: 'id', label: '指标编号' },
      { key: 'metric', label: '指标' },
      { key: 'value', label: '当前值' },
      { key: 'trend', label: '趋势' },
      { key: 'owner', label: '责任域' },
      { key: 'status', label: '状态' },
    ],
    [metric('车辆在线率', '92%'), metric('准点率', '87%'), metric('今日任务', 3), metric('异常次数', 2, 'danger')],
    ['下钻分析', '导出报表', '发送周报']
  ),
  'ReportDetailView.vue': page(
    '报表详情',
    '按指标查看明细、异常原因和责任域。',
    [...tasks, ...gateRecords],
    [
      { key: 'id', label: '明细编号' },
      { key: 'title', label: '事项' },
      { key: 'plate', label: '车辆' },
      { key: 'driver', label: '人员' },
      { key: 'status', label: '状态' },
      { key: 'time', label: '时间' },
    ],
    [metric('明细记录', 5), metric('异常项', 1, 'danger'), metric('责任域', 3), metric('可追溯', '100%')],
    ['筛选', '排序', '导出明细']
  ),
  'VehicleArchiveList.vue': page(
    '车辆档案列表',
    '维护车辆、司机、证照有效期和启停状态。',
    vehicles,
    [
      { key: 'id', label: '车辆编号' },
      { key: 'plate', label: '车牌' },
      { key: 'type', label: '车型' },
      { key: 'driver', label: '司机' },
      { key: 'unit', label: '所属单位' },
      { key: 'status', label: '状态' },
    ],
    [metric('车辆总数', 4), metric('启用', 3), metric('异常/停用', 1, 'danger'), metric('证照临期', 1)],
    ['新增车辆', '编辑档案', '停用车辆']
  ),
  'VehicleArchiveEdit.vue': page(
    '车辆档案编辑',
    '编辑车辆基础信息、证照有效期和司机绑定关系。',
    vehicles.slice(0, 1),
    [
      { key: 'id', label: '车辆编号' },
      { key: 'plate', label: '车牌' },
      { key: 'type', label: '车型' },
      { key: 'driver', label: '司机' },
      { key: 'inspection', label: '年检有效期' },
      { key: 'insurance', label: '保险有效期' },
    ],
    [metric('编辑车辆', 1), metric('必填项', 6), metric('证照附件', 2), metric('校验状态', '通过')],
    ['保存', '上传证照', '返回列表']
  ),
  'VehicleArchiveLogs.vue': page(
    '档案操作日志',
    '追踪车辆档案新增、变更、停用和证照更新记录。',
    logs,
    [
      { key: 'id', label: '日志编号' },
      { key: 'object', label: '对象' },
      { key: 'action', label: '操作' },
      { key: 'operator', label: '操作人' },
      { key: 'result', label: '结果' },
      { key: 'time', label: '时间' },
    ],
    [metric('今日操作', 3), metric('成功', 2), metric('需复核', 1, 'danger'), metric('可导出', 3)],
    ['导出Excel', '查看变更', '筛选操作人']
  ),
}

export function getGovernedPage(pageKey) {
  return governedPages[pageKey] || governedPages['DispatchWorkbenchView.vue']
}
