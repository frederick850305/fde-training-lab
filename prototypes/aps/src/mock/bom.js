// 制造 BOM / 施工包：构件树 + 工序任务拆分
const stdOps = {
  导管架: ['材料到货', '套料', '切割', '坡口', '组对', '焊接', 'NDT', '打磨', '涂装', '入库/安装'],
  管线: ['管材到货', '下料', '坡口', '组对', '焊接', 'NDT', '试压', '涂装', '安装'],
  舾装: ['材料到货', '下料', '预制', '打磨', '涂装', '配送', '安装', '检查'],
  涂装: ['表面处理', '喷砂', '底漆', '中间漆', '面漆', '漆膜检测', '固化'],
  总装: ['场地准备', '片体转运', '吊装定位', '组对', '总装焊接', 'NDT', '补漆', '出运准备'],
}

function buildTasks(profession, startProgress) {
  return stdOps[profession].map((op, i) => {
    const done = startProgress >= (i + 1) / stdOps[profession].length * 100
    const partial = !done && startProgress > i / stdOps[profession].length * 100
    return {
      op,
      prev: i === 0 ? '—' : stdOps[profession][i - 1],
      next: i === stdOps[profession].length - 1 ? '—' : stdOps[profession][i + 1],
      status: done ? '已完成' : partial ? '执行中' : '待排',
    }
  })
}

export const bomTree = [
  {
    id: 'JKT-001', code: 'JKT-001', name: '导管架 JKT-001', type: '项目', parent: null,
    weight: '—', material: '—', zone: '—', route: '综合', status: '进行中', kitting: '齐套', progress: 62, children: [],
  },
  {
    id: 'LEG-01', code: 'LEG-01', name: '腿柱 LEG-01', type: '腿柱', parent: 'JKT-001',
    weight: '86t', material: 'DH36', zone: 'A 区', route: '导管架主结构路线', status: '组对中', kitting: '齐套', progress: 68,
    tasks: buildTasks('导管架', 68),
  },
  {
    id: 'LEG-01-S01', code: 'LEG-01-S01', name: '筒节 S01', type: '筒节', parent: 'LEG-01',
    weight: '12t', material: 'DH36', zone: 'A 区', route: '导管架主结构路线', status: '已切割', kitting: '齐套', progress: 90,
    tasks: buildTasks('导管架', 90),
  },
  {
    id: 'LEG-01-S02', code: 'LEG-01-S02', name: '筒节 S02', type: '筒节', parent: 'LEG-01',
    weight: '11t', material: 'DH36', zone: 'A 区', route: '导管架主结构路线', status: '坡口中', kitting: '齐套', progress: 78,
    tasks: buildTasks('导管架', 78),
  },
  {
    id: 'BRACE-001', code: 'BRACE-001', name: '斜撑 BRACE-001', type: '斜撑', parent: 'JKT-001',
    weight: '18t', material: 'DH36', zone: 'A 区', route: '导管架主结构路线', status: '待坡口', kitting: '部分齐套', progress: 45,
    tasks: buildTasks('导管架', 45),
  },
  {
    id: 'NODE-001', code: 'NODE-001', name: '节点 NODE-001', type: '节点', parent: 'JKT-001',
    weight: '6t', material: 'EH36', zone: 'B 区', route: '导管架主结构路线', status: '待焊接', kitting: '齐套', progress: 60,
    tasks: buildTasks('导管架', 60),
  },
  {
    id: 'PIPE-PKG-001', code: 'PIPE-PKG-001', name: '管线包 PIPE-PKG-001', type: '管线包', parent: 'JKT-001',
    weight: '32t', material: 'API 5L', zone: 'C 区', route: '管线路线', status: '焊接中', kitting: '部分齐套', progress: 52,
    tasks: buildTasks('管线', 52),
  },
  {
    id: 'OUTFIT-PKG-001', code: 'OUTFIT-PKG-001', name: '舾装包 OUTFIT-PKG-001', type: '舾装包', parent: 'JKT-001',
    weight: '24t', material: 'Q235B', zone: 'D 区', route: '舾装路线', status: '预制中', kitting: '风险齐套', progress: 38,
    tasks: buildTasks('舾装', 38),
  },
  {
    id: 'PAINT-PKG-001', code: 'PAINT-PKG-001', name: '涂装包 PAINT-PKG-001', type: '涂装包', parent: 'JKT-001',
    weight: '—', material: '环氧漆', zone: '涂装房', route: '涂装路线', status: '待面漆', kitting: '缺关键件', progress: 30,
    tasks: buildTasks('涂装', 30),
  },
  {
    id: 'BLOCK-ASSY-001', code: 'BLOCK-ASSY-001', name: '片体合拢包 BLOCK-ASSY-001', type: '总装包', parent: 'JKT-001',
    weight: '210t', material: 'DH36', zone: '总装场地', route: '总装路线', status: '待吊装', kitting: '图纸未冻结', progress: 18,
    tasks: buildTasks('总装', 18),
  },
]

export const bomStats = {
  componentCount: 8,
  taskCount: bomTree.reduce((s, c) => s + (c.tasks ? c.tasks.length : 0), 0),
  kittingBreakdown: [
    { status: '齐套', count: 4 },
    { status: '部分齐套', count: 2 },
    { status: '风险齐套', count: 1 },
    { status: '缺关键件', count: 1 },
    { status: '图纸未冻结', count: 1 },
  ],
}
