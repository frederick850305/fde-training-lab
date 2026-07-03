export const mockOverviewData = {
  metrics: [
    { label: '车辆总数', value: 86, unit: '辆' },
    { label: '任务完成率', value: 94, unit: '%' },
    { label: '平均等待', value: 18, unit: '分钟' },
    { label: '异常告警', value: 7, unit: '条' },
  ],
  trends: [
    { date: '07-01', tasks: 42, alerts: 3 },
    { date: '07-02', tasks: 51, alerts: 4 },
    { date: '07-03', tasks: 48, alerts: 2 },
  ],
  details: [
    { id: 'RPT-001', name: '外协车辆费用', count: 12, amount: 3200 },
    { id: 'RPT-002', name: '异常入场记录', count: 5, amount: 0 },
  ],
}
