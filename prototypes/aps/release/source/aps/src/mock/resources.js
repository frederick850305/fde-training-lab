// 资源能力：设备 / 人员 / 检验 / 场地 / 吊装 / 外协
export const resources = [
  { id: 'R-CUT-01', name: '数控切割机', category: '设备', qty: 2, unit: '台', dailyCapacity: '80 米/天', load: 76, status: '正常' },
  { id: 'R-ROLL-01', name: '卷板机', category: '设备', qty: 1, unit: '台', dailyCapacity: '3 筒节/天', load: 118, status: '超负荷' },
  { id: 'R-BEAM-01', name: '坡口机', category: '设备', qty: 3, unit: '台', dailyCapacity: '40 个/天', load: 88, status: '正常' },
  { id: 'R-WELD-01', name: '焊机', category: '设备', qty: 28, unit: '台', dailyCapacity: '22 工时/天', load: 102, status: '超负荷' },
  { id: 'R-WELDER-01', name: '高级焊工', category: '人员', qty: 20, unit: '人', dailyCapacity: '160 工时/天', load: 135, status: '严重超负荷' },
  { id: 'R-RIVET-01', name: '铆工班组', category: '人员', qty: 4, unit: '班', dailyCapacity: '32 工时/天', load: 84, status: '正常' },
  { id: 'R-PIPE-01', name: '管工班组', category: '人员', qty: 3, unit: '班', dailyCapacity: '24 工时/天', load: 79, status: '正常' },
  { id: 'R-OUTFIT-01', name: '舾装班组', category: '人员', qty: 3, unit: '班', dailyCapacity: '24 工时/天', load: 71, status: '正常' },
  { id: 'R-NDT-01', name: 'NDT 班组', category: '检验', qty: 2, unit: '组', dailyCapacity: '80 道口/天', load: 148, status: '严重超负荷' },
  { id: 'R-UT-01', name: 'UT 探伤', category: '检验', qty: 1, unit: '组', dailyCapacity: '40 道口/天', load: 122, status: '超负荷' },
  { id: 'R-RT-01', name: 'RT 射线', category: '检验', qty: 1, unit: '组', dailyCapacity: '20 道口/天', load: 96, status: '正常' },
  { id: 'R-THIRD-01', name: '第三方报验', category: '检验', qty: 1, unit: '组', dailyCapacity: '30 道口/天', load: 60, status: '正常' },
  { id: 'R-PAINT-01', name: '涂装房', category: '场地', qty: 1, unit: '个', dailyCapacity: '200 ㎡/天', load: 156, status: '严重超负荷' },
  { id: 'R-PREFAB-01', name: '预制区', category: '场地', qty: 2, unit: '块', dailyCapacity: '4 片体/周', load: 90, status: '正常' },
  { id: 'R-YARD-01', name: '堆场', category: '场地', qty: 3, unit: '块', dailyCapacity: '6 片体', load: 67, status: '正常' },
  { id: 'R-ASSY-01', name: '总装场地', category: '场地', qty: 1, unit: '块', dailyCapacity: '1 片体/周', load: 142, status: '冲突' },
  { id: 'R-GANTRY-01', name: '龙门吊', category: '吊装', qty: 1, unit: '台', dailyCapacity: '2 吊次/天', load: 95, status: '正常' },
  { id: 'R-CRAWLER-01', name: '履带吊', category: '吊装', qty: 2, unit: '台', dailyCapacity: '3 吊次/天', load: 108, status: '超负荷' },
  { id: 'R-WINDOW-01', name: '吊装窗口', category: '吊装', qty: 1, unit: '窗口', dailyCapacity: '1 大件/天', load: 100, status: '临界' },
  { id: 'R-OUTCUT-01', name: '外协切割', category: '外协', qty: 2, unit: '厂', dailyCapacity: '60 米/天', load: 40, status: '正常' },
  { id: 'R-OUTPAINT-01', name: '外协涂装', category: '外协', qty: 1, unit: '厂', dailyCapacity: '150 ㎡/天', load: 35, status: '正常' },
  { id: 'R-OUTNDT-01', name: '外协检测', category: '外协', qty: 1, unit: '组', dailyCapacity: '50 道口/天', load: 50, status: '正常' },
]

export const resourceCategories = ['设备', '人员', '检验', '场地', '吊装', '外协']
