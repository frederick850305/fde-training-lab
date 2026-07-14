// ============================================================
// Counter Service —— 计数器读数（Counter Logs）领域的数据访问层
// ------------------------------------------------------------
// 与既有 service 同构：视图层只调用本 service。
//   * 读取方法同步返回（供 computed 派生，保持对 db 的响应式追踪）
// Counters Overview 为只读视图（手册 3.1：仅显示当前读数，不可更新），
// 故暂不提供写入方法。
// ============================================================

import { db } from '../mock/index.js'

export const counterService = {
  // ---- 读取 ----
  list() {
    return db.counterLogs
  },
  // 某组件的计数器读数
  byComponent(componentNo) {
    return db.counterLogs.filter((r) => r.component === componentNo)
  },
}
