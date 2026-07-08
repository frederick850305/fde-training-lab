// 项目 WBS：多级分解（设计 / 采购 / 导管架主结构 / 管线 / 舾装 / 涂装 / 总装）
export const wbsTree = [
  {
    id: 'JKT-001', code: 'JKT-001', name: '导管架 JKT-001 项目', parent: null,
    profession: '总体', planStart: '2026-09-20', planEnd: '2027-03-30', progress: 62, dept: '项目管理部', risk: '中',
  },
  { id: 'DESIGN', code: 'JKT-DESIGN', name: '设计阶段', parent: 'JKT-001', profession: '设计', planStart: '2026-09-20', planEnd: '2026-10-15', progress: 100, dept: '设计部', risk: '低' },
  { id: 'DESIGN-DET', code: 'JKT-DESIGN-DET', name: '详细设计', parent: 'DESIGN', profession: '设计', planStart: '2026-09-20', planEnd: '2026-10-08', progress: 100, dept: '设计部', risk: '低' },
  { id: 'DESIGN-DWG', code: 'JKT-DESIGN-DWG', name: '图纸发布与冻结', parent: 'DESIGN', profession: '设计', planStart: '2026-10-08', planEnd: '2026-10-15', progress: 92, dept: '设计部', risk: '中' },
  { id: 'PROC', code: 'JKT-PROC', name: '采购阶段', parent: 'JKT-001', profession: '采购', planStart: '2026-09-25', planEnd: '2026-11-10', progress: 88, dept: '采购部', risk: '中' },
  { id: 'PROC-STEEL', code: 'JKT-PROC-STEEL', name: '主结构钢材', parent: 'PROC', profession: '采购', planStart: '2026-09-25', planEnd: '2026-11-05', progress: 95, dept: '采购部', risk: '低' },
  { id: 'PROC-WELD', code: 'JKT-PROC-WELD', name: '焊材与焊丝', parent: 'PROC', profession: '采购', planStart: '2026-09-28', planEnd: '2026-10-30', progress: 80, dept: '采购部', risk: '中' },
  { id: 'PROC-PAINT', code: 'JKT-PROC-PAINT', name: '涂装材料', parent: 'PROC', profession: '采购', planStart: '2026-10-10', planEnd: '2026-11-10', progress: 55, dept: '采购部', risk: '高' },
  { id: 'STRUCT', code: 'JKT-STRUCT', name: '导管架主结构', parent: 'JKT-001', profession: '导管架结构', planStart: '2026-10-08', planEnd: '2027-01-20', progress: 58, dept: '结构车间', risk: '中' },
  { id: 'STRUCT-LEG', code: 'JKT-STRUCT-LEG', name: '腿柱', parent: 'STRUCT', profession: '导管架结构', planStart: '2026-10-08', planEnd: '2026-12-10', progress: 66, dept: '结构车间', risk: '中' },
  { id: 'STRUCT-LEG-S01', code: 'JKT-STRUCT-LEG-S01', name: '腿柱筒节预制', parent: 'STRUCT-LEG', profession: '导管架结构', planStart: '2026-10-08', planEnd: '2026-11-20', progress: 70, dept: '结构车间', risk: '低' },
  { id: 'STRUCT-BRACE', code: 'JKT-STRUCT-BRACE', name: '斜撑', parent: 'STRUCT', profession: '导管架结构', planStart: '2026-10-15', planEnd: '2026-12-20', progress: 52, dept: '结构车间', risk: '中' },
  { id: 'STRUCT-NODE', code: 'JKT-STRUCT-NODE', name: '节点', parent: 'STRUCT', profession: '导管架结构', planStart: '2026-10-12', planEnd: '2026-12-15', progress: 60, dept: '结构车间', risk: '中' },
  { id: 'STRUCT-BLOCK', code: 'JKT-STRUCT-BLOCK', name: '片体', parent: 'STRUCT', profession: '导管架结构', planStart: '2026-11-10', planEnd: '2027-01-20', progress: 35, dept: '结构车间', risk: '高' },
  { id: 'PIPE', code: 'JKT-PIPE', name: '管线专业', parent: 'JKT-001', profession: '管线', planStart: '2026-10-20', planEnd: '2027-01-15', progress: 48, dept: '管加工车间', risk: '高' },
  { id: 'PIPE-FAB', code: 'JKT-PIPE-FAB', name: '管段预制', parent: 'PIPE', profession: '管线', planStart: '2026-10-20', planEnd: '2026-12-20', progress: 52, dept: '管加工车间', risk: '中' },
  { id: 'PIPE-INST', code: 'JKT-PIPE-INST', name: '管系安装', parent: 'PIPE', profession: '管线', planStart: '2026-12-15', planEnd: '2027-01-15', progress: 22, dept: '管加工车间', risk: '高' },
  { id: 'OUTFIT', code: 'JKT-OUTFIT', name: '舾装专业', parent: 'JKT-001', profession: '舾装', planStart: '2026-11-05', planEnd: '2027-01-25', progress: 38, dept: '舾装车间', risk: '中' },
  { id: 'OUTFIT-PLT', code: 'JKT-OUTFIT-PLT', name: '平台舾装', parent: 'OUTFIT', profession: '舾装', planStart: '2026-11-05', planEnd: '2027-01-10', progress: 40, dept: '舾装车间', risk: '中' },
  { id: 'OUTFIT-HRA', code: 'JKT-OUTFIT-HRA', name: '栏杆 / 梯子 / 支架', parent: 'OUTFIT', profession: '舾装', planStart: '2026-11-20', planEnd: '2027-01-25', progress: 30, dept: '舾装车间', risk: '低' },
  { id: 'PAINT', code: 'JKT-PAINT', name: '涂装专业', parent: 'JKT-001', profession: '涂装', planStart: '2026-11-15', planEnd: '2027-02-20', progress: 30, dept: '涂装车间', risk: '高' },
  { id: 'PAINT-STR', code: 'JKT-PAINT-STR', name: '结构涂装', parent: 'PAINT', profession: '涂装', planStart: '2026-11-15', planEnd: '2027-01-30', progress: 32, dept: '涂装车间', risk: '高' },
  { id: 'PAINT-FIN', code: 'JKT-PAINT-FIN', name: '成品面漆', parent: 'PAINT', profession: '涂装', planStart: '2027-01-10', planEnd: '2027-02-20', progress: 12, dept: '涂装车间', risk: '高' },
  { id: 'ASSY', code: 'JKT-ASSY', name: '总装阶段', parent: 'JKT-001', profession: '总装', planStart: '2026-12-20', planEnd: '2027-03-20', progress: 18, dept: '总装车间', risk: '高' },
  { id: 'ASSY-JOIN', code: 'JKT-ASSY-JOIN', name: '片体合拢', parent: 'ASSY', profession: '总装', planStart: '2026-12-20', planEnd: '2027-02-05', progress: 20, dept: '总装车间', risk: '高' },
  { id: 'ASSY-WELD', code: 'JKT-ASSY-WELD', name: '总装焊接', parent: 'ASSY', profession: '总装', planStart: '2027-01-05', planEnd: '2027-02-25', progress: 15, dept: '总装车间', risk: '高' },
  { id: 'ASSY-OUT', code: 'JKT-ASSY-OUT', name: '出运准备', parent: 'ASSY', profession: '总装', planStart: '2027-02-25', planEnd: '2027-03-20', progress: 5, dept: '总装车间', risk: '中' },
]

// 将扁平树转为可被视图消费的层级结构
export function buildWbsForest() {
  const byId = new Map(wbsTree.map((n) => [n.id, { ...n, children: [] }]))
  const roots = []
  for (const node of byId.values()) {
    if (node.parent && byId.has(node.parent)) byId.get(node.parent).children.push(node)
    else roots.push(node)
  }
  return roots
}
