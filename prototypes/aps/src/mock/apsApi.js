// 模拟 APS 排程接口（Mock）：替代真实求解器，返回业务结果
import { ganttTasks, ganttStats, ganttBaseDate } from './ganttTasks.js'
import { risks } from './risks.js'

function clone(tasks) {
  return tasks.map((t) => ({ ...t }))
}

// POST /api/schedule/run-midterm
export function runMidterm(projectId = 'JKT-001', scenario = 'normal') {
  return {
    success: true,
    message: '中期负荷计划已生成',
    summary: {
      overloadResources: ['高级焊工', 'NDT 班组', '涂装房', '总装场地', '卷板机'],
      overloadCount: 5,
      scenario,
    },
    suggestions: [
      '将 12 根斜撑转外协加工，释放卷板机与焊工负荷',
      '11 月高级焊工增加 2 小时加班，缓解焊接瓶颈',
      'NDT 增加第三方检测资源，缩短焊口排队',
      '涂装任务提前分批释放，规避涂装房后期冲突',
      '总装场地提前清场，预留 BLOCK-02 合拢窗口',
    ],
  }
}

// POST /api/schedule/run-shortterm
export function runShortTerm(projectId = 'JKT-001', range = '35d', scenario = 'normal') {
  return {
    success: true,
    message: '短期排程模拟完成',
    summary: {
      taskCount: ganttStats.taskCount,
      conflictCount: ganttStats.conflictCount,
      criticalTaskCount: ganttStats.criticalTaskCount,
      kittingRiskCount: ganttStats.kittingRiskCount,
    },
    ganttTasks: clone(ganttTasks),
    risks: risks.slice(0, 6),
    suggestions: [
      '优先释放关键路径焊接资源，避免总装窗口被挤压',
      '涂装房任务建议外协分流，减少资源冲突',
      'NDT 排队任务建议启用第三方检测',
    ],
  }
}

// 异常场景预设
export const exceptionScenarios = [
  { key: 'pipe_late', name: '大口径管材晚到 7 天', profession: '管线', icon: '📦' },
  { key: 'welder_load', name: '高级焊工负荷 135%', profession: '导管架', icon: '🔥' },
  { key: 'ndt_queue', name: 'NDT 检验排队', profession: '检验', icon: '⏳' },
  { key: 'paint_conflict', name: '涂装房资源冲突', profession: '涂装', icon: '🎨' },
  { key: 'weld_defect', name: '焊接实绩偏低并产生返修', profession: '导管架', icon: '⚠' },
]

const scenarioResults = {
  pipe_late: {
    delayDays: 7,
    affectedTasks: ['PIPE-003 安装', 'PIPE-002 试压'],
    impactPath: '大口径管材晚到 → PIPE-003 安装延期 → 舾装与总装接口后移',
    suggestions: ['将非关键管段安装后移 7 天', '启用外协管段预制补产能', '重新确认履带吊吊装窗口'],
  },
  welder_load: {
    delayDays: 3,
    affectedTasks: ['BRACE-001 焊接', 'LEG-01-S01 焊接', 'LEG-01-S02 焊接', 'BLOCK-001 总装焊接'],
    impactPath: '焊工超负荷 → 焊接工序堆积 → 关键路径 BLOCK-001 总装焊接顺延',
    suggestions: ['增加外协焊接资源', '关键路径焊口优先排班', '安排高级焊工加班 2 小时/天'],
  },
  ndt_queue: {
    delayDays: 2,
    affectedTasks: ['PIPE-001 NDT', 'BLOCK-001 NDT', 'BRACE-003 后续涂装'],
    impactPath: 'NDT 排队 → PIPE-001 试压延期 → 安装与涂装后移',
    suggestions: ['增加第三方 NDT 资源', '非关键舾装任务后移', '优先检测关键路径焊口'],
  },
  paint_conflict: {
    delayDays: 4,
    affectedTasks: ['PAINT-001 面漆', 'PAINT-002 中间漆', 'BLOCK-01 补漆'],
    impactPath: '涂装房冲突 → 面漆/中间漆排队 → 成品交付节点顺延',
    suggestions: ['外协涂装部分构件', '涂装任务分批释放', '调整面漆施工顺序'],
  },
  weld_defect: {
    delayDays: 2,
    affectedTasks: ['BRACE-001 焊接', 'BRACE-001 返修'],
    impactPath: '焊接实绩 52/80 → 插入返修 → NDT 与涂装计划顺延',
    suggestions: ['插入返修任务并重排', '调整 NDT 与涂装计划', '提示交付延期 2 天'],
  },
}

// POST /api/schedule/simulate-exception
export function simulateException(scenarioKey) {
  const scenario = exceptionScenarios.find((s) => s.key === scenarioKey)
  if (!scenario) return { success: false, message: '未知场景' }
  const result = scenarioResults[scenarioKey]
  const base = clone(ganttTasks)
  let adjusted = base.map((t) => {
    if (result.affectedTasks.some((a) => t.name.startsWith(a.replace(/ 返修$/, '')))) {
      return { ...t, startOff: t.startOff + result.delayDays, status: t.status === '资源冲突' ? '资源冲突' : '齐套风险' }
    }
    return t
  })
  if (scenarioKey === 'weld_defect') {
    adjusted.push({
      id: 'T-REWORK', name: 'BRACE-001 返修', profession: '导管架', resource: '焊工2班',
      pkg: 'BRACE-001', startOff: 8, dur: 2, status: '已排程', critical: true, rework: true,
    })
  }
  const fmt = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  adjusted = adjusted.map((t) => {
    const x = new Date(ganttBaseDate)
    x.setDate(x.getDate() + t.startOff)
    const y = new Date(ganttBaseDate)
    y.setDate(y.getDate() + t.startOff + t.dur - 1)
    return { ...t, start: fmt(x), end: fmt(y) }
  })
  return {
    success: true,
    scenario: scenario.name,
    ...result,
    suggestions: result.suggestions,
    adjustedGantt: adjusted,
  }
}

// POST /api/schedule/reschedule
export function reschedule(projectId = 'JKT-001', exceptionKey = null) {
  const base = clone(ganttTasks)
  const adjusted = base.map((t) => ({ ...t, status: t.status === '资源冲突' ? '已排程' : t.status }))
  return {
    success: true,
    message: '已基于约束重排，资源冲突已消解',
    summary: { conflictBefore: ganttStats.conflictCount, conflictAfter: 0, delayDays: exceptionKey ? 2 : 0 },
    ganttTasks: adjusted,
  }
}

// POST /api/actual-feedback
export function submitActualFeedback(payload) {
  return {
    success: true,
    message: `实绩已提交：${payload.taskId || '任务'}`,
    needReschedule: payload.needReschedule !== false,
  }
}
