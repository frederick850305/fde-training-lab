// 短期甘特排程任务（未来 35 天，基准日 2026-10-08）
// 设计目标：按工单视图
//   - 左侧 = 7+ 种生产资源
//   - 颜色 = 5 张并行工单（每张 wo 跨多个资源）
//   - 每个条形 = 该资源上某工单的工序段
const BASE = new Date(2026, 9, 8) // 2026-10-08

function d(offset) {
  const x = new Date(BASE)
  x.setDate(x.getDate() + offset)
  const y = x.getFullYear()
  const m = String(x.getMonth() + 1).padStart(2, '0')
  const day = String(x.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const ganttBaseDate = '2026-10-08'
export const ganttWindowDays = 35

export const ganttTasks = [
  // ════════════ WO-01：LEG-01 腿柱制造 ════════════
  { id: 'T01', name: 'LEG-01 切割下料',   profession: '导管架', resource: '数控切割机', pkg: 'LEG-01',    wo: 'WO-01', startOff: 0,  dur: 3, status: '已完成', critical: true },
  { id: 'T02', name: 'LEG-01 坡口加工',   profession: '导管架', resource: '坡口机床',   pkg: 'LEG-01',    wo: 'WO-01', startOff: 2,  dur: 2, status: '已完成', critical: true },
  { id: 'T03', name: 'LEG-01 组对成型',   profession: '导管架', resource: '铆工1班',     pkg: 'LEG-01',    wo: 'WO-01', startOff: 4,  dur: 3, status: '执行中', critical: true },
  { id: 'T04', name: 'LEG-01 主缝焊接',   profession: '导管架', resource: '焊接机器人', pkg: 'LEG-01',    wo: 'WO-01', startOff: 7,  dur: 4, status: '已排程', critical: true },

  // ════════════ WO-02：BRACE 斜撑制造 ════════════
  { id: 'T05', name: 'BRACE 切割下料',    profession: '导管架', resource: '等离子切割', pkg: 'BRACE-01',  wo: 'WO-02', startOff: 1,  dur: 3, status: '已完成', critical: false },
  { id: 'T06', name: 'BRACE 坡口组对',    profession: '导管架', resource: '铆工2班',     pkg: 'BRACE-01',  wo: 'WO-02', startOff: 4,  dur: 3, status: '执行中', critical: false },
  { id: 'T07', name: 'BRACE 角焊缝焊接', profession: '导管架', resource: '焊工A班',     pkg: 'BRACE-01',  wo: 'WO-02', startOff: 7,  dur: 4, status: '已排程', critical: false },
  { id: 'T08', name: 'BRACE NDT检测',     profession: '导管架', resource: 'UT探伤班组',   pkg: 'BRACE-01',  wo: 'WO-02', startOff: 11, dur: 2, status: '待下发', critical: false },

  // ════════════ WO-03：BLOCK-01 总装 ════════════
  { id: 'T09', name: 'BLOCK 片体拼装',     profession: '总装',    resource: '总装平台',   pkg: 'BLOCK-01',  wo: 'WO-03', startOff: 10, dur: 5, status: '待排',   critical: false },
  { id: 'T10', name: 'BLOCK 吊装就位',     profession: '总装',    resource: '龙门吊车',   pkg: 'BLOCK-01',  wo: 'WO-03', startOff: 15, dur: 2, status: '已排程', critical: true },
  { id: 'T11', name: 'BLOCK 大接头组对',   profession: '总装',    resource: '铆工1班',     pkg: 'BLOCK-01',  wo: 'WO-03', startOff: 17, dur: 3, status: '已排程', critical: true },
  { id: 'T12', name: 'BLOCK 环缝焊接',     profession: '总装',    resource: '焊工B班',     pkg: 'BLOCK-01',  wo: 'WO-03', startOff: 19, dur: 5, status: '关键路径', critical: true },

  // ════════════ WO-04：PIPE 管线预制 ════════════
  { id: 'T13', name: 'PIPE 切割弯制',     profession: '管线',    resource: '管子切割机', pkg: 'PIPE-01',   wo: 'WO-04', startOff: 3,  dur: 4, status: '已完成', critical: false },
  { id: 'T14', name: 'PIPE 坡口打磨',     profession: '管线',    resource: '砂轮工位',   pkg: 'PIPE-01',   wo: 'WO-04', startOff: 6,  dur: 2, status: '已完成', critical: false },
  { id: 'T15', name: 'PIPE 法兰组对',     profession: '管线',    resource: '管工A班',     pkg: 'PIPE-01',   wo: 'WO-04', startOff: 8,  dur: 3, status: '执行中', critical: false },
  { id: 'T16', name: 'PIPE 焊接检验',     profession: '管线',    resource: '焊工B班',     pkg: 'PIPE-01',   wo: 'WO-04', startOff: 11, dur: 4, status: '已排程', critical: false },

  // ════════════ WO-05：OUTFIT+PAINT 舾装涂装 ════════════
  { id: 'T17', name: '舾装件预制',       profession: '舾装',    resource: '钣金车间',   pkg: 'OUTFIT-01', wo: 'WO-05', startOff: 6,  dur: 4, status: '已排程', critical: false },
  { id: 'T18', name: '舾装安装定位',     profession: '舾装',    resource: '安装班组',   pkg: 'OUTFIT-01', wo: 'WO-05', startOff: 12, dur: 4, status: '已排程', critical: false },
  { id: 'T19', name: '表面喷砂处理',      profession: '涂装',    resource: '喷砂房',     pkg: 'PAINT-01',  wo: 'WO-05', startOff: 16, dur: 2, status: '已排程', critical: false },
  { id: 'T20', name: '底漆+面漆涂装',    profession: '涂装',    resource: '喷漆房',     pkg: 'PAINT-01',  wo: 'WO-05', startOff: 18, dur: 4, status: '资源冲突', critical: false },
].map((t) => ({ ...t, start: d(t.startOff), end: d(t.startOff + t.dur - 1) }))

export const ganttStats = {
  taskCount: ganttTasks.length,
  conflictCount: ganttTasks.filter((t) => t.status === '资源冲突').length,
  criticalTaskCount: ganttTasks.filter((t) => t.critical).length,
  kittingRiskCount: ganttTasks.filter((t) => t.status === '齐套风险').length,
}
