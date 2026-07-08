// 物料齐套：任务能否开工、缺什么、影响什么
export const kittingRecords = [
  { id: 'K-01', task: 'BRACE-001 组对', profession: '导管架', status: '齐套', missing: '无', impact: '可开工', trend: '稳定' },
  { id: 'K-02', task: 'PIPE-001 焊接', profession: '管线', status: '部分齐套', missing: '阀门未到', impact: '试压延期', trend: '风险' },
  { id: 'K-03', task: 'OUTFIT-001 安装', profession: '舾装', status: '风险齐套', missing: '阳极未到', impact: '不影响当前', trend: '关注' },
  { id: 'K-04', task: 'PAINT-001 面漆', profession: '涂装', status: '缺关键件', missing: '面漆未到', impact: '涂装延期', trend: '告警' },
  { id: 'K-05', task: 'BLOCK-ASSY-001 吊装', profession: '总装', status: '图纸未冻结', missing: 'Rev.C 未发布', impact: '禁止下发', trend: '阻断' },
  { id: 'K-06', task: 'NODE-002 焊接', profession: '导管架', status: '齐套', missing: '无', impact: '可开工', trend: '稳定' },
  { id: 'K-07', task: 'PIPE-002 试压', profession: '管线', status: '部分齐套', missing: '试压封头不足', impact: '试压推后', trend: '风险' },
  { id: 'K-08', task: 'OUTFIT-002 预制', profession: '舾装', status: '齐套', missing: '无', impact: '可开工', trend: '稳定' },
  { id: 'K-09', task: 'PAINT-002 底漆', profession: '涂装', status: '齐套', missing: '无', impact: '可开工', trend: '稳定' },
  { id: 'K-10', task: 'LEG-01-S02 坡口', profession: '导管架', status: '齐套', missing: '无', impact: '可开工', trend: '稳定' },
  { id: 'K-11', task: 'BLOCK-002 合拢', profession: '总装', status: '风险齐套', missing: '履带吊窗口未确认', impact: '吊装待定', trend: '关注' },
  { id: 'K-12', task: 'PIPE-003 安装', profession: '管线', status: '缺关键件', missing: '大口径管材晚到 7 天', impact: '安装延期', trend: '告警' },
  { id: 'K-13', task: 'OUTFIT-003 检查', profession: '舾装', status: '齐套', missing: '无', impact: '可开工', trend: '稳定' },
  { id: 'K-14', task: 'PAINT-003 中间漆', profession: '涂装', status: '部分齐套', missing: '中间漆批次待检', impact: '可分批', trend: '关注' },
]

export const kittingSummary = [
  { status: '齐套', count: 6, tone: 'green' },
  { status: '部分齐套', count: 3, tone: 'yellow' },
  { status: '风险齐套', count: 2, tone: 'amber' },
  { status: '缺关键件', count: 2, tone: 'red' },
  { status: '图纸未冻结', count: 1, tone: 'purple' },
]
