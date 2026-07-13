<template>
  <div class="toolbar">
    <button v-for="b in buttons" :key="b.action" class="tb-btn" :title="b.title" @click="run(b.action)">
      <span class="tb-ico" v-html="icons[b.icon]" />
      <span class="tb-label">{{ b.title }}</span>
    </button>
  </div>
</template>

<script setup>
import { openWindow, showDialog, showToast } from '../store.js'
import { windowRegistry } from '../windows/registry.js'
import { store } from '../store.js'

const icons = {
  new: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  open: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 7h6l2 2h10v10H3z"/></svg>',
  save: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 3h11l3 3v15H5z M8 3v6h7 M8 21v-6h8v6"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-3-6.7M21 4v4h-4"/></svg>',
  print: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 9V3h12v6 M6 18H4v-7h16v7h-2 M8 14h8v7H8z"/></svg>',
  search: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>',
  view: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  options: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg>',
  dashboard: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="5" rx="1"/><rect x="13" y="10" width="8" height="11" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/></svg>',
  lock: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  switch: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 8h13l-3-3M20 16H7l3 3"/></svg>',
  delete: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
}

const buttons = [
  { action: 'new', title: 'New', icon: 'new' },
  { action: 'open', title: 'Open', icon: 'open' },
  { action: 'save', title: 'Save', icon: 'save' },
  { action: 'delete', title: 'Delete', icon: 'delete' },
  { action: 'refresh', title: 'Refresh', icon: 'refresh' },
  { action: 'print', title: 'Print', icon: 'print' },
  { action: 'filter', title: 'Filter', icon: 'search' },
  { action: 'view', title: 'View', icon: 'view' },
  { action: 'selectview', title: 'Select View', icon: 'options' },
  { action: 'switch-department', title: 'Switch Dept', icon: 'switch' },
  { action: 'dashboard', title: 'Dashboard', icon: 'dashboard' },
  { action: 'options', title: 'Options', icon: 'options' },
  { action: 'lock', title: 'Lock', icon: 'lock' },
]

function run(action) {
  if (action === 'dashboard') return openWindow('dashboard')
  if (action === 'selectview') return showDialog('select-view')
  if (action === 'switch-department') return showDialog('switch-department')
  if (action === 'lock') return showToast('应用已锁定（原型演示）', 'warn')
  if (action === 'view') return window.dispatchEvent(new CustomEvent('amos-action', { detail: { action: 'view' } }))
  // New / Save / Delete / Open 等业务动作需要活动窗口；无窗口时提示用户
  if (action === 'new' || action === 'save' || action === 'delete' || action === 'open') {
    // 兼容两种窗口：通用窗口（windowRegistry）+ 专用视图（openTabs 中任意 tab）
    const hasBiz = !!windowRegistry[store.activeKey] || store.openTabs.some((t) => t.pageKey === store.activeKey)
    if (!hasBiz) return showToast(`请先打开一个业务窗口再使用 ${action === 'new' ? 'New' : action === 'save' ? 'Save' : action === 'delete' ? 'Delete' : 'Open'}（Maintenance / Stock / Purchase / Budget 菜单）`, 'warn')
  }
  // 业务动作派发给活动窗口（含 filter）
  window.dispatchEvent(new CustomEvent('amos-action', { detail: { action } }))
}
</script>

<style scoped>
.toolbar { display: flex; gap: 3px; padding: 5px 8px; background: var(--amos-panel); border-bottom: 1px solid var(--amos-border); align-items: center; }
.tb-btn { display: flex; flex-direction: column; align-items: center; gap: 2px; width: 56px; padding: 4px 2px; border: 1px solid transparent; border-radius: 5px; background: transparent; cursor: pointer; color: #3e5068; }
.tb-btn:hover { background: #fff; border-color: var(--amos-border); color: var(--amos-blue); }
.tb-ico { color: var(--amos-blue); display: flex; }
.tb-label { font-size: 10.5px; }
@media (max-width: 1100px) { .tb-label { display: none; } .tb-btn { width: 38px; } }
</style>
