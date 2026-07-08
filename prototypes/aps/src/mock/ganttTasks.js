// 短期甘特排程任务（未来 35 天，基准日 2026-10-08）
// 每个任务含：专业(profession)、资源(resource)、施工包(pkg)、起止、状态、关键路径标记
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
  // 导管架
  { id: 'T01', name: 'LEG-01-S01 切割', profession: '导管架', resource: '切割机1', pkg: 'LEG-01', startOff: 0, dur: 2, status: '已完成', critical: true },
  { id: 'T02', name: 'LEG-01-S02 切割', profession: '导管架', resource: '切割机1', pkg: 'LEG-01', startOff: 1, dur: 2, status: '已完成', critical: true },
  { id: 'T03', name: 'BRACE-001 坡口', profession: '导管架', resource: '坡口机', pkg: 'BRACE-001', startOff: 2, dur: 1, status: '已完成', critical: false },
  { id: 'T04', name: 'BRACE-001 组对', profession: '导管架', resource: '铆工1班', pkg: 'BRACE-001', startOff: 3, dur: 2, status: '执行中', critical: true },
  { id: 'T05', name: 'BRACE-001 焊接', profession: '导管架', resource: '焊工2班', pkg: 'BRACE-001', startOff: 5, dur: 3, status: '齐套风险', critical: true },
  { id: 'T06', name: 'NODE-002 焊接', profession: '导管架', resource: '焊工1班', pkg: 'NODE-002', startOff: 4, dur: 2, status: '已排程', critical: false },
  { id: 'T07', name: 'LEG-01-S01 焊接', profession: '导管架', resource: '焊工3班', pkg: 'LEG-01', startOff: 4, dur: 3, status: '已排程', critical: true },
  { id: 'T08', name: 'LEG-01-S02 焊接', profession: '导管架', resource: '焊工3班', pkg: 'LEG-01', startOff: 7, dur: 3, status: '已排程', critical: true },
  { id: 'T09', name: 'NODE-001 打磨', profession: '导管架', resource: '打磨工位', pkg: 'NODE-001', startOff: 10, dur: 1, status: '已排程', critical: false },
  { id: 'T10', name: '片体 BLOCK-01 拼装', profession: '导管架', resource: '铆工2班', pkg: 'BLOCK-01', startOff: 12, dur: 4, status: '待排', critical: false },
  // 管线
  { id: 'T11', name: 'PIPE-001 切割', profession: '管线', resource: '切割机2', pkg: 'PIPE-001', startOff: 3, dur: 2, status: '已完成', critical: false },
  { id: 'T12', name: 'PIPE-001 焊接', profession: '管线', resource: '焊工4班', pkg: 'PIPE-001', startOff: 6, dur: 3, status: '齐套风险', critical: false },
  { id: 'T13', name: 'PIPE-001 NDT', profession: '管线', resource: 'NDT1组', pkg: 'PIPE-001', startOff: 9, dur: 1, status: '待下发', critical: false },
  { id: 'T14', name: 'PIPE-002 试压', profession: '管线', resource: '管工1班', pkg: 'PIPE-002', startOff: 11, dur: 2, status: '待排', critical: false },
  { id: 'T15', name: 'PIPE-003 安装', profession: '管线', resource: '管工2班', pkg: 'PIPE-003', startOff: 20, dur: 3, status: '待排', critical: false },
  // 舾装
  { id: 'T16', name: 'OUTFIT-001 预制', profession: '舾装', resource: '铆工3班', pkg: 'OUTFIT-001', startOff: 8, dur: 3, status: '已排程', critical: false },
  { id: 'T17', name: 'OUTFIT-001 安装', profession: '舾装', resource: '舾装1班', pkg: 'OUTFIT-001', startOff: 13, dur: 2, status: '待排', critical: false },
  { id: 'T18', name: 'OUTFIT-002 预制', profession: '舾装', resource: '铆工3班', pkg: 'OUTFIT-002', startOff: 10, dur: 2, status: '已排程', critical: false },
  { id: 'T19', name: 'OUTFIT-003 检查', profession: '舾装', resource: '舾装2班', pkg: 'OUTFIT-003', startOff: 18, dur: 1, status: '待排', critical: false },
  // 涂装
  { id: 'T20', name: 'PAINT-001 底漆', profession: '涂装', resource: '涂装房', pkg: 'PAINT-001', startOff: 9, dur: 2, status: '已排程', critical: false },
  { id: 'T21', name: 'PAINT-001 面漆', profession: '涂装', resource: '涂装房', pkg: 'PAINT-001', startOff: 15, dur: 2, status: '资源冲突', critical: false },
  { id: 'T22', name: 'PAINT-002 喷砂', profession: '涂装', resource: '涂装房', pkg: 'PAINT-002', startOff: 6, dur: 2, status: '已排程', critical: false },
  { id: 'T23', name: 'PAINT-002 中间漆', profession: '涂装', resource: '涂装房', pkg: 'PAINT-002', startOff: 14, dur: 2, status: '资源冲突', critical: false },
  { id: 'T24', name: 'BLOCK-01 补漆', profession: '涂装', resource: '涂装房', pkg: 'BLOCK-01', startOff: 24, dur: 1, status: '资源冲突', critical: false },
  // 总装
  { id: 'T25', name: 'BLOCK-001 吊装', profession: '总装', resource: '履带吊', pkg: 'BLOCK-001', startOff: 16, dur: 1, status: '已排程', critical: true },
  { id: 'T26', name: 'BLOCK-001 组对', profession: '总装', resource: '铆工2班', pkg: 'BLOCK-001', startOff: 17, dur: 3, status: '已排程', critical: true },
  { id: 'T27', name: 'BLOCK-001 总装焊接', profession: '总装', resource: '焊工1班', pkg: 'BLOCK-001', startOff: 20, dur: 4, status: '关键路径', critical: true },
  { id: 'T28', name: 'BLOCK-001 NDT', profession: '总装', resource: 'NDT1组', pkg: 'BLOCK-001', startOff: 24, dur: 1, status: '待下发', critical: true },
  { id: 'T29', name: '片体 BLOCK-02 合拢', profession: '总装', resource: '总装场地', pkg: 'BLOCK-02', startOff: 22, dur: 3, status: '资源冲突', critical: false },
  { id: 'T30', name: '出运准备', profession: '总装', resource: '总装场地', pkg: 'BLOCK-01', startOff: 29, dur: 3, status: '待排', critical: false },
  // 外协
  { id: 'T31', name: '斜撑外协加工', profession: '导管架', resource: '外协切割', pkg: 'BRACE-EXT', startOff: 6, dur: 5, status: '外协', critical: false },
  { id: 'T32', name: '管段外协预制', profession: '管线', resource: '外协切割', pkg: 'PIPE-EXT', startOff: 5, dur: 4, status: '外协', critical: false },
].map((t) => ({ ...t, start: d(t.startOff), end: d(t.startOff + t.dur - 1) }))

export const ganttStats = {
  taskCount: ganttTasks.length,
  conflictCount: ganttTasks.filter((t) => t.status === '资源冲突').length,
  criticalTaskCount: ganttTasks.filter((t) => t.critical).length,
  kittingRiskCount: ganttTasks.filter((t) => t.status === '齐套风险').length,
}
