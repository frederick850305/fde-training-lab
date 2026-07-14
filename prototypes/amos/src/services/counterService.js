// ============================================================
// Counter Service —— 计数器读数（Counter Logs）领域的数据访问层
// ------------------------------------------------------------
// 与既有 service 同构：视图层只调用本 service。
//   * 读取方法同步返回（供 computed 派生，保持对 db 的响应式追踪）
// Counters Overview 为只读视图（手册 3.1：仅显示当前读数，不可更新），
// 故暂不提供写入方法。
// ============================================================

import { db, uid } from '../mock/index.js'

export const counterService = {
  // ---- 读取 ----
  list() {
    return db.counterLogs
  },
  // 某组件的计数器读数
  byComponent(componentNo) {
    return db.counterLogs.filter((r) => r.component === componentNo)
  },

  // 手册 P44：依赖联动 —— 被依赖组件更新后，级联同步所有 dependsOn 指向它的同 code 计数器
  _syncDependents(targetComponentNo, code, value) {
    db.components.forEach((c) => {
      ;(c.componentCounters || []).forEach((cc) => {
        if (cc.dependsOn === targetComponentNo && cc.code === code) {
          cc.currentValue = value
          cc.readingDate = new Date().toISOString().slice(0, 10)
        }
      })
    })
  },

  // 手册 3（Update Counters）：记录一次读数——回写组件 componentCounters 当前值，并级联依赖组件
  recordReading(rec) {
    const comp = db.components.find((c) => c.number === rec.component)
    if (!comp) return null
    // 若该组件尚未从类型继承 counters，则惰性初始化
    if (!comp.componentCounters) {
      const ct = db.componentTypes.find((t) => t.typeNumber === comp.typeNumber)
      comp.componentCounters = (ct?.counters || []).map((x) => ({ ...x, startValue: 0, currentValue: 0, readingDate: comp.installDate || '' }))
    }
    const cc = (comp.componentCounters || []).find((c) => c.description === rec.counter)
    if (cc) {
      cc.currentValue = rec.newValue != null ? rec.newValue : rec.currentValue
      cc.readingDate = rec.readingDate
      // 同步所有依赖本组件该计数器的其它组件（手册 P44：Counters Dependent on Other Components' Counters）
      this._syncDependents(rec.component, cc.code, cc.currentValue)
    }
    // 追加一条只读历史日志
    db.counterLogs.push({
      id: uid('cl'),
      component: rec.component,
      function: rec.function,
      counter: rec.counter,
      currentValue: cc ? cc.currentValue : rec.currentValue,
      newValue: rec.newValue,
      unit: rec.unit,
      readingDate: rec.readingDate,
    })
    return cc
  },

  // 手册 3.1（Counters Overview）：聚合所有组件当前计数器读数（惰性从类型初始化）
  allCounters() {
    const arr = []
    db.components.forEach((c) => {
      let counters = c.componentCounters
      if (!counters) {
        const ct = db.componentTypes.find((t) => t.typeNumber === c.typeNumber)
        counters = (ct?.counters || []).map((x) => ({ ...x, startValue: 0, currentValue: 0, readingDate: c.installDate || '' }))
      }
      ;(counters || []).forEach((cc) => {
        arr.push({
          component: c.number,
          function: c.functionNo,
          counter: cc.code,
          description: cc.description,
          currentValue: cc.currentValue,
          unit: cc.unit,
          readingDate: cc.readingDate,
          dependsOn: cc.dependsOn || '',
        })
      })
    })
    return arr
  },
}
