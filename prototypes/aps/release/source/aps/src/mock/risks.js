// 风险事件清单
export const risks = [
  { id: 'RK-01', level: '高', title: '涂装房严重超负荷', type: '资源', related: '涂装房 (156%)', impact: '面漆与中间漆工序排队，预计延误 4 天', date: '2026-10-09', owner: '涂装车间' },
  { id: 'RK-02', level: '高', title: 'NDT 检验排队', type: '资源', related: 'NDT 班组 (148%)', impact: 'PIPE-001、BRACE-003 焊口积压 2 天', date: '2026-10-09', owner: '质检部' },
  { id: 'RK-03', level: '高', title: '高级焊工严重超负荷', type: '资源', related: '高级焊工 (135%)', impact: '焊接工序成为关键路径瓶颈', date: '2026-10-09', owner: '结构车间' },
  { id: 'RK-04', level: '高', title: '大口径管材晚到', type: '物料', related: 'PIPE-003', impact: '管线安装预计晚到 7 天', date: '2026-10-08', owner: '采购部' },
  { id: 'RK-05', level: '中', title: '总装场地冲突', type: '资源', related: '总装场地 (142%)', impact: 'BLOCK-02 合拢与 BLOCK-01 焊接争用', date: '2026-10-09', owner: '总装车间' },
  { id: 'RK-06', level: '中', title: '焊接实绩低于计划', type: '实绩', related: 'BRACE-001 焊接', impact: '实际 52/80 焊口，产生返修', date: '2026-10-08', owner: '结构车间' },
  { id: 'RK-07', level: '中', title: '面漆未到货', type: '物料', related: 'PAINT-001 面漆', impact: '成品面漆工序无法开工', date: '2026-10-09', owner: '采购部' },
  { id: 'RK-08', level: '中', title: '图纸未冻结', type: '设计', related: 'BLOCK-ASSY-001 Rev.C', impact: '总装工作指令禁止下发', date: '2026-10-09', owner: '设计部' },
  { id: 'RK-09', level: '中', title: '卷板机超负荷', type: '资源', related: '卷板机 (118%)', impact: '筒节预制节拍受限', date: '2026-10-08', owner: '结构车间' },
  { id: 'RK-10', level: '低', title: '阳极未到货', type: '物料', related: 'OUTFIT-001 安装', impact: '风险齐套，暂不影响当前', date: '2026-10-08', owner: '采购部' },
  { id: 'RK-11', level: '低', title: '履带吊窗口临界', type: '资源', related: '吊装窗口 (100%)', impact: '大件吊装需精确排窗', date: '2026-10-09', owner: '总装车间' },
  { id: 'RK-12', level: '中', title: '试压封头不足', type: '物料', related: 'PIPE-002 试压', impact: '试压工序推后', date: '2026-10-08', owner: '管加工车间' },
  { id: 'RK-13', level: '低', title: '中间漆批次待检', type: '物料', related: 'PAINT-002 中间漆', impact: '可分批施工', date: '2026-10-09', owner: '涂装车间' },
  { id: 'RK-14', level: '中', title: '第三方报验排期', type: '检验', related: '第三方报验', impact: '关键里程碑节点需提前预约', date: '2026-10-07', owner: '质检部' },
  { id: 'RK-15', level: '高', title: '片体进度滞后', type: '进度', related: '片体 BLOCK-01', impact: '总装合拢窗口受挤压', date: '2026-10-09', owner: '总装车间' },
]
