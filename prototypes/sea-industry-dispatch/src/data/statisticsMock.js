/**
 * StatisticsAnalysisView Mock 数据
 * 统计分析 —— 车辆利用率、任务完成率、等待时长等核心指标
 */

export const kpiCards = [
  { key: 'utilization', label: '车辆利用率', value: '78.5%', change: '+5.2%', trend: 'up', helper: '较上周提升' },
  { key: 'completion', label: '任务完成率', value: '92.3%', change: '+1.8%', trend: 'up', helper: '目标 ≥ 90%' },
  { key: 'waitTime', label: '平均等待时长', value: '18 min', change: '-3.5 min', trend: 'up', helper: '较上月改善' },
  { key: 'emptyRate', label: '空驶率', value: '12.7%', change: '-2.1%', trend: 'up', helper: '低于目标 15%' },
]

export const dailyStats = [
  { date: '06-26', completed: 42, pending: 8, cancelled: 3 },
  { date: '06-27', completed: 38, pending: 12, cancelled: 2 },
  { date: '06-28', completed: 45, pending: 6, cancelled: 4 },
  { date: '06-29', completed: 40, pending: 10, cancelled: 3 },
  { date: '06-30', completed: 48, pending: 5, cancelled: 1 },
  { date: '07-01', completed: 44, pending: 9, cancelled: 2 },
  { date: '07-02', completed: 35, pending: 14, cancelled: 2 },
]

export const vehicleTypeStats = [
  { type: '生产车', total: 18, active: 14, idle: 3, maintenance: 1 },
  { type: '物流车', total: 12, active: 9, idle: 2, maintenance: 1 },
  { type: '外协车', total: 8, active: 5, idle: 1, maintenance: 2 },
  { type: '临时车', total: 5, active: 3, idle: 1, maintenance: 1 },
]

export const areaStats = [
  { area: 'A区-原料仓', taskCount: 128, avgDuration: '45 min', efficiency: 88 },
  { area: 'B区-成品仓', taskCount: 96, avgDuration: '52 min', efficiency: 82 },
  { area: 'C区-装卸区', taskCount: 115, avgDuration: '38 min', efficiency: 91 },
  { area: 'D区-作业区', taskCount: 72, avgDuration: '60 min', efficiency: 76 },
  { area: '停车场', taskCount: 34, avgDuration: '15 min', efficiency: 95 },
]

export const alertSummary = [
  { type: '超速告警', count: 23, ratio: '28%', color: '#f97316' },
  { type: '禁入区域', count: 15, ratio: '18%', color: '#dc2626' },
  { type: '异常停留', count: 18, ratio: '22%', color: '#eab308' },
  { type: '未授权入场', count: 12, ratio: '15%', color: '#dc2626' },
  { type: '其他', count: 14, ratio: '17%', color: '#94a3b8' },
]
