// 海工制造 APS 原型系统 - 原型元数据（菜单 / 角色 / 页面注册表）
// 结构复刻现有 prototype 约定：prototypeData 提供 groups/roles，pages 为扁平页面清单。

const groups = [
  {
    key: 'dashboard',
    title: '项目驾驶舱',
    svgIcon: 'dashboard',
    roles: ['leader', 'planner', 'workshop', 'developer'],
    pages: [
      ['Dashboard', '项目驾驶舱', '面向客户领导与项目经理，一眼看清总体进度、交付风险、资源瓶颈与物料齐套状态', 'P0'],
    ],
  },
  {
    key: 'planning',
    title: '计划与工艺',
    svgIcon: 'plan',
    roles: ['planner', 'developer', 'leader'],
    pages: [
      ['Wbs', '项目计划 / WBS', '展示导管架项目从交付节点到 WBS 的多级分解与各级进度、风险', 'P0'],
      ['Bom', '制造 BOM / 施工包', '展示导管架、管线、舾装等对象如何拆分为可排程构件与工序任务', 'P0'],
      ['Route', '工艺路线', '展示导管架、管线、舾装、涂装、总装五类专业对象的工艺路线与工序详情', 'P1'],
    ],
  },
  {
    key: 'resource',
    title: '资源与物料',
    svgIcon: 'resource',
    roles: ['planner', 'workshop', 'developer', 'leader'],
    pages: [
      ['Resource', '资源能力', '展示海工制造排程依赖的设备、人员、检验、场地、吊装与外协资源能力负荷', 'P1'],
      ['Material', '物料齐套', '判断任务能否开工、缺什么、影响什么，是海工 APS 的核心亮点页面', 'P0'],
    ],
  },
  {
    key: 'scheduling',
    title: '排程与执行',
    svgIcon: 'schedule',
    roles: ['planner', 'workshop', 'leader', 'developer'],
    pages: [
      ['Midterm', '中期负荷计划', '展示未来 3~6 个月资源瓶颈，并提供模拟调优建议', 'P0'],
      ['Gantt', '短期甘特排程', '用甘特图直观展示未来 35 天详细排程，支持运行排程与模拟重排', 'P0'],
      ['WorkInstruction', '工作指令', '让车间班组知道今天干什么、在哪干、如何反馈', 'P0'],
      ['ActualFeedback', '现场实绩', '录入现场实际完成情况，为模拟重排提供依据', 'P1'],
    ],
  },
  {
    key: 'exception',
    title: '异常与接口',
    svgIcon: 'exception',
    roles: ['planner', 'developer', 'leader'],
    pages: [
      ['Reschedule', '异常与模拟重排', '预置典型异常场景，演示 APS 如何模拟影响并给出重排建议', 'P0'],
      ['ApiDoc', 'Mock 数据 / 接口说明', '展示原型使用的 Mock 数据结构与模拟排程接口清单', 'P2'],
    ],
  },
]

const pages = groups.flatMap((group) =>
  group.pages.map(([key, title, desc, priority]) => ({ groupKey: group.key, key, title, desc, priority })),
)

export const prototypeData = {
  projectName: '海工制造 APS',
  customerName: 'JKT-001',
  summary: '面向导管架、管线、舾装、涂装、总装的多专业协同高级计划排程工作台。',
  groups,
  roles: [
    { key: 'leader', label: '客户领导 / 项目经理', user: '项目总体进度与交付风险' },
    { key: 'planner', label: '计划员', user: '排程、负荷分析与重排' },
    { key: 'workshop', label: '车间班组', user: '工作指令与开完工反馈' },
    { key: 'developer', label: '内部研发', user: '数据结构与接口设计' },
  ],
}

export { pages }
