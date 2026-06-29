export const frontendPrototypeSuggestionMock = {
  viewFiles: [
    {
      file: 'ProjectOverviewView.vue',
      responsibility: '项目经理查看项目进度、关键节点、异常摘要和资源占用。',
      source: '页面清单设计 + API 契约：GET /api/projects/overview',
    },
    {
      file: 'ScheduleTrackingView.vue',
      responsibility: '计划员筛选计划任务、查看工序状态、识别延期和阻塞任务。',
      source: '页面清单设计 + API 契约：GET /api/schedules/tasks',
    },
    {
      file: 'IssueTrackingView.vue',
      responsibility: '现场调度员登记异常、分派责任人、更新处理状态。',
      source: '页面字段与交互设计 + API 契约：POST /api/issues',
    },
  ],
  componentFiles: [
    {
      file: 'MetricCard.vue',
      responsibility: '展示项目进度、延期任务、异常数量、资源占用等指标。',
      reusedBy: ['ProjectOverviewView.vue'],
    },
    {
      file: 'StatusTag.vue',
      responsibility: '展示任务状态、风险状态、异常状态。',
      reusedBy: ['ProjectOverviewView.vue', 'ScheduleTrackingView.vue', 'IssueTrackingView.vue'],
    },
    {
      file: 'DataTable.vue',
      responsibility: '展示计划任务、异常问题、物料到货等表格数据。',
      reusedBy: ['ScheduleTrackingView.vue', 'IssueTrackingView.vue'],
    },
    {
      file: 'EmptyState.vue',
      responsibility: '统一展示空状态、无数据提示和下一步动作。',
      reusedBy: ['ProjectOverviewView.vue', 'ScheduleTrackingView.vue', 'IssueTrackingView.vue'],
    },
  ],
  mockDataFiles: [
    {
      file: 'prototypeMockData.js',
      content: '项目总览指标、计划任务列表、异常问题列表、状态枚举。',
      usedBy: ['ProjectOverviewView.vue', 'ScheduleTrackingView.vue', 'IssueTrackingView.vue'],
    },
    {
      file: 'apiContractMock.js',
      content: '接口路径、请求参数、成功响应、失败响应和错误码。',
      usedBy: ['ApiContractView.vue', '后续 API 联调'],
    },
  ],
  generationSteps: [
    {
      step: 1,
      title: '先生成 mock 数据',
      description: '先创建 prototypeMockData.js，保证页面可以独立运行和展示。',
    },
    {
      step: 2,
      title: '再生成通用组件',
      description: '优先生成 MetricCard、StatusTag、DataTable、EmptyState，避免页面重复代码。',
    },
    {
      step: 3,
      title: '再生成 P0 页面',
      description: '先完成 ProjectOverviewView、ScheduleTrackingView、IssueTrackingView 三个核心页面。',
    },
    {
      step: 4,
      title: '最后预留 API 调用层',
      description: '先用 mock 数据，后续再替换为 FastAPI 请求，接口结构按 API 契约保持一致。',
    },
  ],
  prompt: `请基于 Vue3 + Vite 生成一个海工生产运营前端原型。

要求：
1. 先不调用真实后端，只使用本地 mock 数据。
2. 页面包含 ProjectOverviewView、ScheduleTrackingView、IssueTrackingView。
3. 通用组件包含 MetricCard、StatusTag、DataTable、EmptyState。
4. 页面需要体现 loading、empty、success、error 四类状态。
5. API 返回结构统一使用 success、message、data、error_code。
6. 不引入复杂 UI 组件库，优先使用普通 HTML、CSS 和 Vue3 Composition API。
7. 代码要便于后续替换为 FastAPI 接口调用。`,
}
