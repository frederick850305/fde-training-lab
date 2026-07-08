// 工艺路线：五类专业对象的工序链与工序详情
export const routeDetails = [
  {
    profession: '导管架结构',
    name: '导管架主结构路线',
    flow: '材料到货 → 套料 → 切割 → 坡口 → 组对 → 焊接 → NDT → 打磨 → 涂装 → 入库/安装',
    ops: [
      { name: '切割', prev: '坡口', next: '组对', resourceTypes: '数控切割机', std: '3 m/小时', inspect: false, outsourcable: '部分允许', kitting: '图纸、板材、套料程序' },
      { name: '焊接', prev: '组对', next: 'NDT', resourceTypes: '高级焊工、焊机、焊接工位', std: '0.8 h/焊口', inspect: true, outsourcable: '部分允许', kitting: '图纸、焊材、WPS、工位' },
      { name: 'NDT', prev: '焊接', next: '打磨', resourceTypes: 'NDT 班组、探伤设备', std: '12 道口/人天', inspect: true, outsourcable: '允许', kitting: '焊口清单、探伤标准' },
    ],
  },
  {
    profession: '管线',
    name: '管线路线',
    flow: '管材到货 → 下料 → 坡口 → 组对 → 焊接 → NDT → 试压 → 涂装 → 安装',
    ops: [
      { name: '焊接', prev: '组对', next: 'NDT', resourceTypes: '管工班组、焊机', std: '1.2 h/焊口', inspect: true, outsourcable: '部分允许', kitting: '管段、焊材、WPS' },
      { name: '试压', prev: 'NDT', next: '涂装', resourceTypes: '试压泵组、管工', std: '0.5 h/管段', inspect: true, outsourcable: '不允许', kitting: '阀门、试压方案' },
    ],
  },
  {
    profession: '舾装',
    name: '舾装路线',
    flow: '材料到货 → 下料 → 预制 → 打磨 → 涂装 → 配送 → 安装 → 检查',
    ops: [
      { name: '预制', prev: '下料', next: '打磨', resourceTypes: '铆工班组、卷板机', std: '2 件/天', inspect: false, outsourcable: '允许', kitting: '型材、图纸' },
      { name: '安装', prev: '配送', next: '检查', resourceTypes: '舾装班组、吊装', std: '4 件/天', inspect: true, outsourcable: '不允许', kitting: '构件、安装图、定位基准' },
    ],
  },
  {
    profession: '涂装',
    name: '涂装路线',
    flow: '表面处理 → 喷砂 → 底漆 → 中间漆 → 面漆 → 漆膜检测 → 固化',
    ops: [
      { name: '喷砂', prev: '表面处理', next: '底漆', resourceTypes: '涂装房、喷砂设备', std: '120 ㎡/天', inspect: false, outsourcable: '允许', kitting: '构件、磨料、涂装房' },
      { name: '面漆', prev: '中间漆', next: '漆膜检测', resourceTypes: '涂装房、喷涂设备', std: '200 ㎡/天', inspect: true, outsourcable: '不允许', kitting: '面漆、温湿度条件' },
    ],
  },
  {
    profession: '总装',
    name: '总装路线',
    flow: '场地准备 → 片体转运 → 吊装定位 → 组对 → 总装焊接 → NDT → 补漆 → 出运准备',
    ops: [
      { name: '吊装定位', prev: '片体转运', next: '组对', resourceTypes: '龙门吊、履带吊、吊装窗口', std: '1 片体/天', inspect: true, outsourcable: '不允许', kitting: '片体、吊装方案、场地' },
      { name: '总装焊接', prev: '组对', next: 'NDT', resourceTypes: '高级焊工、总装场地', std: '0.6 h/焊口', inspect: true, outsourcable: '部分允许', kitting: '图纸、焊材、场地' },
    ],
  },
]
