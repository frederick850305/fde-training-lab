// ============================================================
// Stock Wanted Service —— 库存需求领域的数据访问层
// ------------------------------------------------------------
// 与 componentService 同构：视图层只调用本 service，后续接真实后端时
// 仅替换方法体（fetch/axios），方法签名保持不变。
// ============================================================

import { db } from '../mock/index.js'

export const stockWantedService = {
  async list() {
    return db.stockWanted.slice()
  },
  // 重新计算 Wanted = Max(0, Reorder Level − Current − Outstanding)
  async recalculate() {
    db.stockWanted.forEach((r) => {
      r.wantedQty = Math.max(0, r.reorderLevel - r.currentQty - (r.outstanding || 0))
    })
    return db.stockWanted.slice()
  },
}
