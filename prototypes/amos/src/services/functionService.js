// ============================================================
// Function Service —— 功能位置（Functions / SFI）领域的数据访问层
// ------------------------------------------------------------
// 与既有 service 同构：视图层只调用本 service，后续接真实后端时
// 仅替换方法体（fetch/axios），方法签名保持不变。
//   * 读取方法同步返回（供 computed 派生，保持对 db 的响应式追踪）
// 功能位置在原型内多为只读展示（Hierarchy / Counters / Work Orders 派生），
// 暂不提供写入方法；后续如需增删改再补齐。
// ============================================================

import { db } from '../mock/index.js'

export const functionService = {
  // ---- 读取 ----
  list() {
    return db.functions
  },
  get(functionNo) {
    return db.functions.find((f) => f.functionNo === functionNo) || null
  },
  // functionNo → function 的映射（供 Hierarchy / Counters 快速查找）
  byNo() {
    return Object.fromEntries(db.functions.map((f) => [f.functionNo, f]))
  },
  // functionNo → location 的映射（供 Work Orders 列表展示）
  locationMap() {
    return Object.fromEntries(db.functions.map((f) => [f.functionNo, f.location]))
  },
  // 顶层功能（无父）——功能位置树的根
  roots() {
    return db.functions.filter((f) => !f.parentFunctionNo)
  },
  // 名称 / 编码片段模糊查找（供 Hierarchy 的 Find 窗口）
  search(text) {
    const s = (text || '').trim().toLowerCase()
    if (!s) return []
    return db.functions.filter((f) => (f.functionNo + ' ' + f.description).toLowerCase().includes(s))
  },
}
