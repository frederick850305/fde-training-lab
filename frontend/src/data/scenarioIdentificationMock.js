export const scenarioIdentificationMock = {
  roles: [
    {
      name: '项目经理',
      focus: '项目整体进度、关键风险、异常闭环和跨部门协同。',
      actions: ['查看项目总览', '关注异常风险', '确认关键节点', '推动问题闭环'],
    },
    {
      name: '计划员',
      focus: '计划任务、关键工序、进度偏差和资源约束。',
      actions: ['维护计划任务', '跟踪工序状态', '识别进度偏差', '发起调整建议'],
    },
    {
      name: '现场调度员',
      focus: '现场作业节奏、人员设备占用、物料到位和异常处置。',
      actions: ['查看当日作业', '协调现场资源', '反馈异常问题', '更新处置进展'],
    },
  ],
  scenarios: [
    {
      key: 'projectOverview',
      name: '项目经理查看项目总览',
      priority: 'P0',
      description: '项目经理进入系统后，快速了解项目总体进度、关键节点、异常风险和资源占用情况。',
      workflow: [
        '进入项目总览页',
        '查看项目进度、节点状态和风险数量',
        '筛选异常问题和延期任务',
        '查看异常详情与责任人',
        '确认是否需要召开协调会或发起处理要求',
      ],
      pageMapping: {
        role: '项目经理',
        page: 'ProjectOverviewView.vue',
        modules: ['项目进度概览', '关键节点状态', '异常问题列表', '资源占用摘要'],
      },
    },
    {
      key: 'scheduleTracking',
      name: '计划员跟踪关键工序',
      priority: 'P0',
      description: '计划员基于计划任务清单，跟踪关键工序执行状态，识别延期、阻塞和待协调事项。',
      workflow: [
        '进入计划任务页',
        '按项目、区域、工序状态筛选任务',
        '查看关键工序完成情况',
        '标记延期或阻塞任务',
        '生成计划调整建议',
      ],
      pageMapping: {
        role: '计划员',
        page: 'ScheduleTrackingView.vue',
        modules: ['计划任务列表', '工序状态筛选', '延期任务标记', '调整建议区'],
      },
    },
    {
      key: 'siteDispatch',
      name: '现场调度员处理异常',
      priority: 'P1',
      description: '现场调度员发现现场作业、物料或设备异常后，记录问题、分派责任人并跟踪处理进展。',
      workflow: [
        '进入现场调度页',
        '查看当日作业面和资源占用',
        '新增异常问题记录',
        '分派责任人和处理时限',
        '跟踪处理进展并更新状态',
      ],
      pageMapping: {
        role: '现场调度员',
        page: 'SiteDispatchView.vue',
        modules: ['当日作业面', '资源占用看板', '异常问题登记', '处理进展跟踪'],
      },
    },
  ],
}
