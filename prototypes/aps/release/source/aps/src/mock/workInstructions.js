// 工作指令：车间班组"今日任务卡片"（基准日 2026-10-09）
export const workInstructions = [
  {
    id: 'WI-20261009-01', task: 'BRACE-001 组对', project: 'JKT-001', profession: '导管架结构',
    team: '铆工一班', station: '组对工位-02', planStart: '2026-10-09 08:00', planEnd: '2026-10-09 17:00',
    drawing: 'Rev.B', kitting: '齐套', prev: '坡口已完成', next: '焊接', quality: '组对尺寸复核', status: '执行中',
  },
  {
    id: 'WI-20261009-02', task: 'PIPE-001 焊接', project: 'JKT-001', profession: '管线',
    team: '焊工二班', station: '焊接工位-04', planStart: '2026-10-09 08:30', planEnd: '2026-10-09 17:30',
    drawing: 'Rev.C', kitting: '部分齐套(阀门未到)', prev: '组对完成', next: 'NDT', quality: '按 WPS 施焊', status: '待开工',
  },
  {
    id: 'WI-20261009-03', task: 'PIPE-001 切割', project: 'JKT-001', profession: '管线',
    team: '切割班', station: '切割机-02', planStart: '2026-10-09 08:00', planEnd: '2026-10-09 12:00',
    drawing: 'Rev.C', kitting: '齐套', prev: '套料完成', next: '坡口', quality: '坡口面保护', status: '已完成',
  },
  {
    id: 'WI-20261009-04', task: 'LEG-01-S02 焊接', project: 'JKT-001', profession: '导管架结构',
    team: '焊工三班', station: '焊接工位-06', planStart: '2026-10-09 08:00', planEnd: '2026-10-09 17:00',
    drawing: 'Rev.B', kitting: '齐套', prev: '坡口完成', next: 'NDT', quality: 'UT 抽检', status: '待开工',
  },
  {
    id: 'WI-20261009-05', task: 'OUTFIT-001 预制', project: 'JKT-001', profession: '舾装',
    team: '铆工三班', station: '预制区-03', planStart: '2026-10-09 08:00', planEnd: '2026-10-09 16:30',
    drawing: 'Rev.A', kitting: '齐套', prev: '下料完成', next: '打磨', quality: '尺寸公差复核', status: '执行中',
  },
  {
    id: 'WI-20261009-06', task: 'PAINT-001 底漆', project: 'JKT-001', profession: '涂装',
    team: '涂装一班', station: '涂装房-01', planStart: '2026-10-09 09:00', planEnd: '2026-10-09 16:00',
    drawing: 'Rev.B', kitting: '齐套', prev: '喷砂完成', next: '中间漆', quality: '漆膜厚度检测', status: '待开工',
  },
  {
    id: 'WI-20261009-07', task: 'PIPE-001 NDT', project: 'JKT-001', profession: '管线',
    team: 'NDT 一组', station: '探伤室-01', planStart: '2026-10-09 13:00', planEnd: '2026-10-09 17:00',
    drawing: 'Rev.C', kitting: '齐套', prev: '焊接完成', next: '试压', quality: 'RT 抽检比例', status: '待开工',
  },
  {
    id: 'WI-20261009-08', task: 'NODE-002 焊接', project: 'JKT-001', profession: '导管架结构',
    team: '焊工一班', station: '焊接工位-01', planStart: '2026-10-09 08:00', planEnd: '2026-10-09 15:00',
    drawing: 'Rev.B', kitting: '齐套', prev: '组对完成', next: 'NDT', quality: '节点全溶透', status: '执行中',
  },
]

// 现场实绩反馈模板字段
export const actualFeedbackFields = [
  { key: 'taskId', label: '任务编号' },
  { key: 'planQty', label: '计划完成量' },
  { key: 'actualQty', label: '实际完成量' },
  { key: 'actualStart', label: '实际开始' },
  { key: 'actualEnd', label: '实际结束' },
  { key: 'reason', label: '异常原因' },
  { key: 'affectDownstream', label: '是否影响后续' },
  { key: 'needReschedule', label: '是否需要重排' },
]
