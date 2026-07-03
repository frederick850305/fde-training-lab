export async function getReportDetail() {
  return {
    list: [
      { id: 'D-001', name: '外协车辆 A', type: '费用明细', value: '1200 元', status: '已确认' },
      { id: 'D-002', name: '异常入场 B', type: '异常记录', value: '证照过期', status: '已处理' },
      { id: 'D-003', name: '排队分析 C', type: '等待时长', value: '36 分钟', status: '待优化' },
    ],
    total: 3,
  }
}
