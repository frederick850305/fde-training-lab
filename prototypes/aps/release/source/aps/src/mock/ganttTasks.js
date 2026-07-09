// 短期甘特排程任务（未来 14 天，基准日 2026-10-08）
// 按工单视图设计：
//   - 左侧 = 生产资源/机台（CUT-01 / WLD-01 / QC-01 …）
//   - 颜色 = 5 张并行工单
//   - 每个条形 = 该资源上某工单的具体工序段
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
export const ganttWindowDays = 14

// 资源机台/工位清单
export const resourceCatalog = {
  'CUT-01': { name: '数控切割机', load: 16, order: 1 },
  'CUT-02': { name: '数控切割机', load: 14, order: 2 },
  'ROL-01': { name: '卷板机', load: 11, order: 3 },
  'BEV-01': { name: '坡口机', load: 13, order: 4 },
  'PROF-01': { name: '型材加工机', load: 10, order: 5 },
  'PIPE-01': { name: '配管工位', load: 11, order: 6 },
  'WLD-01': { name: '焊接工位', load: 21, order: 7 },
  'WLD-02': { name: '焊接工位', load: 20, order: 8 },
  'ASM-01': { name: '总装平台', load: 22, order: 9 },
  'PNT-01': { name: '涂装房', load: 11, order: 10 },
  'QC-01': { name: '检验工位', load: 18, order: 11 },
  'OPR-01': { name: '操作班组A', load: 17, order: 12 },
  'OPR-02': { name: '操作班组B', load: 17, order: 13 },
  'CRN-01': { name: '行车', load: 13, order: 14 },
}

function res(code) {
  const r = resourceCatalog[code]
  return { resource: code, resourceName: r.name, load: r.load, order: r.order }
}

export const ganttTasks = [
  // ════════════ WO-3010：BRACE 斜撑制造 ════════════
  { id: 'T01', name: '切割下料', profession: '导管架', ...res('CUT-01'), pkg: 'BRACE-3010', wo: 'WO-3010', startOff: 0, dur: 3, status: '已完成', critical: false },
  { id: 'T02', name: '坡口加工', profession: '导管架', ...res('BEV-01'), pkg: 'BRACE-3010', wo: 'WO-3010', startOff: 2, dur: 2, status: '已完成', critical: false },
  { id: 'T03', name: '焊接',     profession: '导管架', ...res('WLD-01'), pkg: 'BRACE-3010', wo: 'WO-3010', startOff: 4, dur: 3, status: '执行中', critical: false },
  { id: 'T04', name: 'NDT检测',  profession: '检验',   ...res('QC-01'),  pkg: 'BRACE-3010', wo: 'WO-3010', startOff: 7, dur: 1, status: '已排程', critical: false },

  // ════════════ WO-3012：LEG 腿柱制造 ════════════
  { id: 'T05', name: '切割下料', profession: '导管架', ...res('CUT-02'), pkg: 'LEG-3012', wo: 'WO-3012', startOff: 0, dur: 3, status: '已完成', critical: false },
  { id: 'T06', name: '型材加工', profession: '导管架', ...res('PROF-01'), pkg: 'LEG-3012', wo: 'WO-3012', startOff: 3, dur: 2, status: '执行中', critical: false },
  { id: 'T07', name: '接长焊接', profession: '导管架', ...res('WLD-02'), pkg: 'LEG-3012', wo: 'WO-3012', startOff: 5, dur: 3, status: '延期',   critical: true },
  { id: 'T08', name: '终检',     profession: '检验',   ...res('QC-01'),  pkg: 'LEG-3012', wo: 'WO-3012', startOff: 8, dur: 1, status: '已排程', critical: false },

  // ════════════ WO-3014：PIPE 管线预制 ════════════
  { id: 'T09', name: '配管',     profession: '管线', ...res('PIPE-01'), pkg: 'PIPE-3014', wo: 'WO-3014', startOff: 1, dur: 3, status: '已完成',   critical: false },
  { id: 'T10', name: '管焊',     profession: '管线', ...res('WLD-01'),  pkg: 'PIPE-3014', wo: 'WO-3014', startOff: 4, dur: 2, status: '执行中',   critical: false },
  { id: 'T11', name: '试压检验', profession: '管线', ...res('QC-01'),   pkg: 'PIPE-3014', wo: 'WO-3014', startOff: 6, dur: 2, status: '资源冲突', critical: false },
  { id: 'T12', name: '安装定位', profession: '舾装', ...res('OPR-01'),  pkg: 'PIPE-3014', wo: 'WO-3014', startOff: 8, dur: 2, status: '已排程',   critical: false },

  // ════════════ WO-3016：BLOCK 总装 ════════════
  { id: 'T13', name: '卷板',     profession: '总装', ...res('ROL-01'), pkg: 'BLOCK-3016', wo: 'WO-3016', startOff: 2, dur: 2, status: '已完成',   critical: false },
  { id: 'T14', name: '总装',     profession: '总装', ...res('ASM-01'), pkg: 'BLOCK-3016', wo: 'WO-3016', startOff: 4, dur: 3, status: '关键路径', critical: true },
  { id: 'T15', name: '结构焊接', profession: '总装', ...res('WLD-02'), pkg: 'BLOCK-3016', wo: 'WO-3016', startOff: 6, dur: 3, status: '关键路径', critical: true },
  { id: 'T16', name: '涂装',     profession: '涂装', ...res('PNT-01'), pkg: 'BLOCK-3016', wo: 'WO-3016', startOff: 9, dur: 2, status: '已排程',   critical: false },

  // ════════════ WO-3002：OUTFIT 舾装 ════════════
  { id: 'T17', name: '二次下料', profession: '舾装', ...res('CUT-01'), pkg: 'OUTFIT-3002', wo: 'WO-3002', startOff: 3, dur: 2, status: '已完成',   critical: false },
  { id: 'T18', name: '舾装预制', profession: '舾装', ...res('OPR-01'), pkg: 'OUTFIT-3002', wo: 'WO-3002', startOff: 5, dur: 2, status: '已排程',   critical: false },
  { id: 'T19', name: '吊装',     profession: '舾装', ...res('CRN-01'), pkg: 'OUTFIT-3002', wo: 'WO-3002', startOff: 7, dur: 1, status: '资源冲突', critical: false },
  { id: 'T20', name: '报检',     profession: '检验', ...res('QC-01'),  pkg: 'OUTFIT-3002', wo: 'WO-3002', startOff: 9, dur: 1, status: '延期',     critical: false },
].map((t) => ({ ...t, start: d(t.startOff), end: d(t.startOff + t.dur - 1) }))

export const ganttStats = {
  taskCount: ganttTasks.length,
  conflictCount: ganttTasks.filter((t) => t.status === '资源冲突').length,
  delayCount: ganttTasks.filter((t) => t.status === '延期').length,
  criticalTaskCount: ganttTasks.filter((t) => t.critical).length,
  kittingRiskCount: ganttTasks.filter((t) => t.status === '齐套风险').length,
}
