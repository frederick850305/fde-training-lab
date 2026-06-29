export const pageInteractionMock = {
  pages: [
    {
      key: 'projectOverview',
      name: '项目总览页',
      vueFile: 'ProjectOverviewView.vue',
      fields: [
        {
          name: 'projectId',
          label: '项目',
          type: 'select',
          required: true,
          description: '用于切换当前查看的项目范围。',
        },
        {
          name: 'dateRange',
          label: '统计周期',
          type: 'date-range',
          required: false,
          description: '用于筛选项目进度、节点和异常统计周期。',
        },
        {
          name: 'riskStatus',
          label: '风险状态',
          type: 'select',
          required: false,
          description: '用于筛选正常、预警、延期等风险状态。',
        },
      ],
      actions: [
        {
          label: '查询',
          trigger: '根据筛选条件刷新项目总览数据。',
          feedback: '刷新指标卡片、节点状态和异常摘要。',
        },
        {
          label: '查看异常',
          trigger: '跳转到异常问题闭环页，并带入当前项目条件。',
          feedback: '进入异常问题列表，展示当前项目相关异常。',
        },
      ],
      validations: ['项目字段不能为空', '统计周期开始日期不能晚于结束日期'],
      states: {
        empty: '无项目数据时展示空状态和“请选择项目”提示。',
        loading: '查询时禁用按钮，并展示总览区域骨架屏。',
        success: '查询成功后刷新指标卡片、节点状态和异常摘要。',
        error: '查询失败时展示错误提示和重试按钮。',
      },
    },
    {
      key: 'scheduleTracking',
      name: '计划任务跟踪页',
      vueFile: 'ScheduleTrackingView.vue',
      fields: [
        {
          name: 'projectId',
          label: '项目',
          type: 'select',
          required: true,
          description: '用于限定计划任务所属项目。',
        },
        {
          name: 'area',
          label: '区域',
          type: 'select',
          required: false,
          description: '用于按建造区域筛选任务。',
        },
        {
          name: 'taskStatus',
          label: '任务状态',
          type: 'select',
          required: false,
          description: '用于筛选未开始、进行中、延期、阻塞、已完成任务。',
        },
      ],
      actions: [
        {
          label: '筛选任务',
          trigger: '根据项目、区域和任务状态刷新任务列表。',
          feedback: '更新计划任务表格和状态统计。',
        },
        {
          label: '标记延期',
          trigger: '对选中任务设置延期状态。',
          feedback: '任务状态变为延期，并在列表中高亮。',
        },
        {
          label: '生成调整建议',
          trigger: '基于延期和阻塞任务生成计划调整建议。',
          feedback: '在建议区展示模拟调整建议。',
        },
      ],
      validations: ['项目字段不能为空', '标记延期前必须先选择一条任务'],
      states: {
        empty: '无任务数据时展示空表格和“暂无计划任务”。',
        loading: '筛选任务时展示表格 loading 状态。',
        success: '筛选成功后刷新任务列表和状态统计。',
        error: '任务加载失败时展示错误提示，并允许重新筛选。',
      },
    },
    {
      key: 'issueTracking',
      name: '异常问题闭环页',
      vueFile: 'IssueTrackingView.vue',
      fields: [
        {
          name: 'issueTitle',
          label: '异常标题',
          type: 'text',
          required: true,
          description: '用于简要描述现场异常问题。',
        },
        {
          name: 'owner',
          label: '责任人',
          type: 'select',
          required: true,
          description: '用于指定异常处理责任人。',
        },
        {
          name: 'deadline',
          label: '处理时限',
          type: 'date',
          required: true,
          description: '用于明确异常处理截止时间。',
        },
        {
          name: 'description',
          label: '异常说明',
          type: 'textarea',
          required: false,
          description: '用于补充异常发生背景、影响范围和处理要求。',
        },
      ],
      actions: [
        {
          label: '新增异常',
          trigger: '打开新增异常表单。',
          feedback: '显示表单弹层或页面内编辑区。',
        },
        {
          label: '提交异常',
          trigger: '提交异常标题、责任人、处理时限和异常说明。',
          feedback: '新增异常记录，并刷新异常列表。',
        },
        {
          label: '更新状态',
          trigger: '修改异常处理状态。',
          feedback: '更新处理进展时间线。',
        },
      ],
      validations: ['异常标题不能为空', '责任人不能为空', '处理时限不能为空', '处理时限不能早于当前日期'],
      states: {
        empty: '无异常数据时展示“暂无异常问题”。',
        loading: '提交或更新状态时禁用操作按钮。',
        success: '提交成功后刷新列表，并展示成功提示。',
        error: '提交失败时保留表单内容，并展示错误原因。',
      },
    },
  ],
  commonRules: [
    '所有查询类按钮都需要 loading 状态，防止重复点击。',
    '所有表单类操作都需要前端必填校验。',
    '所有列表页都需要空状态、加载状态、成功状态和失败状态。',
    '所有失败状态都需要给出可恢复动作，例如重试、重新筛选或保留表单内容。',
  ],
}
