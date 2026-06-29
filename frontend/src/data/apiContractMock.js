export const apiContractMock = {
  contracts: [
    {
      key: 'projectOverview',
      name: '获取项目总览',
      method: 'GET',
      path: '/api/projects/overview',
      sourcePage: 'ProjectOverviewView.vue',
      trigger: '点击“查询”按钮后刷新项目总览数据。',
      goal: '返回项目进度、关键节点、异常摘要和资源占用摘要，支撑项目总览页展示。',
      requestParams: [
        {
          name: 'projectId',
          type: 'string',
          required: true,
          description: '项目 ID。',
        },
        {
          name: 'startDate',
          type: 'string',
          required: false,
          description: '统计周期开始日期，格式 YYYY-MM-DD。',
        },
        {
          name: 'endDate',
          type: 'string',
          required: false,
          description: '统计周期结束日期，格式 YYYY-MM-DD。',
        },
        {
          name: 'riskStatus',
          type: 'string',
          required: false,
          description: '风险状态筛选项，如 normal、warning、delay。',
        },
      ],
      successResponse: {
        success: true,
        message: '项目总览查询成功',
        data: {
          progressRate: 76,
          delayedTaskCount: 8,
          issueCount: 12,
          resourceUsageRate: 82,
        },
      },
      errorResponse: {
        success: false,
        message: '项目总览查询失败',
        error_code: 'PROJECT_OVERVIEW_QUERY_FAILED',
      },
      errorCodes: [
        {
          code: 'PROJECT_ID_REQUIRED',
          meaning: '项目 ID 为空。',
          frontendAdvice: '提示用户先选择项目。',
        },
        {
          code: 'PROJECT_OVERVIEW_QUERY_FAILED',
          meaning: '项目总览查询失败。',
          frontendAdvice: '展示错误提示和重试按钮。',
        },
      ],
    },
    {
      key: 'scheduleTasks',
      name: '查询计划任务',
      method: 'GET',
      path: '/api/schedules/tasks',
      sourcePage: 'ScheduleTrackingView.vue',
      trigger: '点击“筛选任务”按钮后刷新计划任务表格。',
      goal: '返回计划任务列表和任务状态统计，支撑计划任务跟踪页展示。',
      requestParams: [
        {
          name: 'projectId',
          type: 'string',
          required: true,
          description: '项目 ID。',
        },
        {
          name: 'area',
          type: 'string',
          required: false,
          description: '建造区域。',
        },
        {
          name: 'taskStatus',
          type: 'string',
          required: false,
          description: '任务状态，如 pending、running、delayed、blocked、done。',
        },
      ],
      successResponse: {
        success: true,
        message: '计划任务查询成功',
        data: {
          total: 128,
          delayed: 9,
          blocked: 4,
          items: [],
        },
      },
      errorResponse: {
        success: false,
        message: '计划任务查询失败',
        error_code: 'SCHEDULE_TASK_QUERY_FAILED',
      },
      errorCodes: [
        {
          code: 'PROJECT_ID_REQUIRED',
          meaning: '项目 ID 为空。',
          frontendAdvice: '提示用户先选择项目。',
        },
        {
          code: 'SCHEDULE_TASK_QUERY_FAILED',
          meaning: '计划任务查询失败。',
          frontendAdvice: '保留筛选条件，并允许用户重新筛选。',
        },
      ],
    },
    {
      key: 'createIssue',
      name: '新增异常问题',
      method: 'POST',
      path: '/api/issues',
      sourcePage: 'IssueTrackingView.vue',
      trigger: '点击“提交异常”按钮后新增异常问题。',
      goal: '提交异常标题、责任人、处理时限和异常说明，生成新的异常问题记录。',
      requestParams: [
        {
          name: 'issueTitle',
          type: 'string',
          required: true,
          description: '异常标题。',
        },
        {
          name: 'owner',
          type: 'string',
          required: true,
          description: '责任人 ID 或名称。',
        },
        {
          name: 'deadline',
          type: 'string',
          required: true,
          description: '处理时限，格式 YYYY-MM-DD。',
        },
        {
          name: 'description',
          type: 'string',
          required: false,
          description: '异常说明。',
        },
      ],
      successResponse: {
        success: true,
        message: '异常问题创建成功',
        data: {
          issueId: 'ISSUE-2026-0001',
          status: 'open',
        },
      },
      errorResponse: {
        success: false,
        message: '异常问题创建失败',
        error_code: 'ISSUE_CREATE_FAILED',
      },
      errorCodes: [
        {
          code: 'ISSUE_TITLE_REQUIRED',
          meaning: '异常标题为空。',
          frontendAdvice: '在异常标题字段下方展示必填提示。',
        },
        {
          code: 'OWNER_REQUIRED',
          meaning: '责任人为空。',
          frontendAdvice: '提示用户选择责任人。',
        },
        {
          code: 'ISSUE_CREATE_FAILED',
          meaning: '异常创建失败。',
          frontendAdvice: '保留表单内容，并展示失败原因。',
        },
      ],
    },
  ],
  responseStandard: {
    success: 'boolean，表示接口是否成功。',
    message: 'string，用于前端展示的人类可读信息。',
    data: 'object | array | null，成功时返回业务数据。',
    error_code: 'string | null，失败时返回错误码。',
  },
}
