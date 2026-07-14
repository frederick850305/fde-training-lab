// ============================================================
// Job Service —— 作业（Jobs）领域的数据访问 / 业务逻辑层
// ------------------------------------------------------------
// 与 componentService / stockWantedService 同构：视图层只调用本 service，
// 后续接真实后端时仅替换方法体（fetch/axios），方法签名保持不变。
//   * 读取方法同步返回（供 computed 派生，保持对 db 的响应式追踪）
//   * 写入方法异步（模拟后端事务）
// ============================================================

import { db, uid } from '../mock/index.js'

export const jobService = {
  // ---- 读取 ----
  list() {
    return db.jobs
  },
  // 手册 2.2(13)：组件 / 部件类型关联作业（同时匹配 Component 与 ComponentType 两种 target）
  relatedJobs(componentNumber, componentTypeNumber) {
    if (!componentNumber && !componentTypeNumber) return []
    return db.jobs.filter(
      (j) =>
        (j.targetType === 'Component' && j.targetId === componentNumber) ||
        (j.targetType === 'ComponentType' && j.targetId === componentTypeNumber),
    )
  },
  // 手册 2：某部件类型关联的作业数（Component Types 列表 Jobs 列动态计算）
  countForComponentType(typeNumber) {
    return db.jobs.filter((j) => j.targetType === 'ComponentType' && j.targetId === typeNumber).length
  },

  // ---- 写入 ----
  async create({ description, targetType, targetId, frequency = 'Monthly', planningMethod = 'Time', status = 'Planned', requiredDisciplines = [], requiredParts = [] }) {
    const job = {
      id: uid('jb'),
      jobNo: 'J-' + Math.floor(Math.random() * 90000 + 10000),
      description,
      targetType,
      targetId,
      frequency,
      planningMethod,
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      requiredDisciplines,
      requiredParts,
      status,
    }
    db.jobs.push(job)
    return job
  },
}
