// ============================================================
// Component Service —— 组件领域的数据访问 / 业务逻辑层
// ------------------------------------------------------------
// 这是「前台 → 后台」演进的关键接缝：
//   * 视图层（ComponentsView / BusinessWindow）只调用本 service 的方法，
//     不再直接 import 或操作 db。
//   * 当前实现基于内存 mock（src/mock/index.js），所有方法返回 Promise，
//     以模拟真实后端异步接口（network latency / 事务）。
//   * 后续接入真实后端时，只需把每个方法体替换为 fetch/axios 调用，
//     方法签名与返回结构保持不变，视图层无需改动。
//
// 状态机（手册 Component Status）：
//   * 已安装到 function（functionNo 非空）→ 'In Use'
//   * 未安装到 function                         → 'Available'
//   * 手动可切换为 'Transferred' / 'Scrapped'
//   * 所有状态变更都会写入 componentStatusLog
// ============================================================

import { db, uid } from '../mock/index.js'

export const COMPONENT_STATUSES = ['In Use', 'Available', 'Transferred', 'Scrapped']

// 自动推导状态：仅当状态处于自动管理集合（In Use / Available）时才覆盖，
// 以免冲掉用户手动设置的 Transferred / Scrapped。
function deriveStatus(comp) {
  const installed = !!comp.functionNo
  const autoManaged = comp.status === 'In Use' || comp.status === 'Available'
  return autoManaged ? (installed ? 'In Use' : 'Available') : comp.status
}

// 写入一条状态变更日志（供 Options > Component Status Log 与 Maintenance > Component Status Log 使用）
function logStatus(comp, oldStatus, newStatus, reason = '') {
  db.componentStatusLog.push({
    id: uid('csl'),
    componentId: comp.id,
    componentNo: comp.number,
    componentName: comp.name,
    oldStatus,
    newStatus,
    changedBy: 'A. Admin',
    changedAt: new Date().toISOString().slice(0, 10),
    reason,
  })
}

export const componentService = {
  // ---- 查询 ----
  async list() {
    return db.components.slice()
  },
  async get(id) {
    return db.components.find((c) => c.id === id) || null
  },

  // ---- 注册组件（来自 Component Types 窗口 Options > Register as Component） ----
  // 注册时尚未安装到 function，状态按手册推导为 'Available'。
  async register({ typeNumber, name, maker, model, location, department, functionNo = '', installDate = '' }) {
    const comp = {
      id: uid('co'),
      number: 'C-' + (Date.now() % 1000000),
      typeNumber,
      name,
      maker,
      model,
      type: '',
      serialNo: '',
      status: '',
      location,
      functionNo: functionNo || '',
      vendor: maker,
      parentComponent: '',
      installDate: installDate || new Date().toISOString().slice(0, 10),
      department,
    }
    comp.status = deriveStatus(comp) // 注册默认无 function → Available
    db.components.push(comp)
    return comp
  },

  // ---- 设置功能位置（安装 / 拆卸） ----
  // 安装到 function → 自动推导为 In Use；移除 → Available；并记录日志。
  async setFunction(id, functionNo) {
    const comp = db.components.find((c) => c.id === id)
    if (!comp) return null
    const old = comp.status
    comp.functionNo = functionNo || ''
    comp.status = deriveStatus(comp)
    if (comp.status !== old) {
      logStatus(comp, old, comp.status, functionNo ? 'Installed on function' : 'Removed from function')
    }
    return comp
  },

  // ---- 修改状态（Options > Change Status） ----
  // cascadeSubComponents: 是否级联修改 parentComponent === 该组件编号 的子组件。
  // 返回 { ok, affectedWanted, updatedIds }：
  //   affectedWanted 非空表示新状态为 'Transferred' 且 Stock Wanted 中存在对该组件的引用，
  //     需要 UI 二次确认（保留数量 / 清空数量并移除引用）。
  //   updatedIds 包含所有被修改的组件 id，便于视图层同步列表中的浅拷贝行。
  async changeStatus(id, newStatus, { cascadeSubComponents = false } = {}) {
    const comp = db.components.find((c) => c.id === id)
    if (!comp) return { ok: false }
    if (!COMPONENT_STATUSES.includes(newStatus)) return { ok: false }

    const old = comp.status
    comp.status = newStatus
    logStatus(comp, old, newStatus)
    const updatedIds = [id]

    if (cascadeSubComponents) {
      db.components
        .filter((c) => c.parentComponent === comp.number)
        .forEach((ch) => {
          const co = ch.status
          ch.status = newStatus
          logStatus(ch, co, newStatus, `Cascade from ${comp.number}`)
          updatedIds.push(ch.id)
        })
    }

    let affectedWanted = []
    if (newStatus === 'Transferred') {
      affectedWanted = db.stockWanted.filter(
        (w) => w.forComponent && (w.forComponent === comp.number || w.forComponent === comp.functionNo),
      )
    }
    return { ok: true, affectedWanted, updatedIds }
  },

  // ---- 组件 Transferred 时处理 Stock Wanted 引用 ----
  // clearQuantity=true：清空需求数量并移除引用；false：保留数量仅移除引用。
  async resolveTransferredStock(componentId, { clearQuantity = false } = {}) {
    const comp = db.components.find((c) => c.id === componentId)
    if (!comp) return
    db.stockWanted.forEach((w) => {
      if (w.forComponent === comp.number || w.forComponent === comp.functionNo) {
        if (clearQuantity) w.wantedQty = 0
        w.forComponent = '' // 移除对组件的引用
      }
    })
  },

  // ---- 状态日志查询 ----
  async getStatusLog(id) {
    return db.componentStatusLog.filter((l) => l.componentId === id).slice().reverse()
  },
  async getAllStatusLogs() {
    return db.componentStatusLog.slice().reverse()
  },
}
