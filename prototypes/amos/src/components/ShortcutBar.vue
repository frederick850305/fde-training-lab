<template>
  <aside class="shortcut-bar">
    <button class="sb-btn" :class="{ active: store.activeKey === 'dashboard' }" @click="open('dashboard')">
      <span v-html="iconHome" class="sb-ico" />
      <span class="sb-label" v-show="showLabels">首页</span>
    </button>
    <div v-for="m in modules" :key="m.key" class="sb-group" @mouseenter="showFlyout(m.key)" @mouseleave="scheduleClose">
      <button class="sb-btn" :class="{ active: isActiveModule(m.key) }" @click="openFirst(m.key)">
        <span v-html="moduleIcon(m.icon)" class="sb-ico" />
        <span class="sb-label" v-show="showLabels">{{ m.label }}</span>
      </button>
      <div v-show="flyout === m.key" class="sb-flyout" @mouseenter="keepOpen" @mouseleave="scheduleClose">
        <div class="sb-flyout-head">{{ m.title }}</div>
        <button v-for="p in pagesOf(m.key)" :key="p.key" class="sb-flyout-item" :class="{ active: store.activeKey === p.key }" @click="open(p.key)">
          {{ p.title }}
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, onBeforeUnmount, computed } from 'vue'
import { modules, AMOS_PAGES } from '../data/amosData.js'
import { store, openWindow } from '../store.js'

const flyout = ref('')
let closeTimer = null

function clearTimer() {
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
}
function showFlyout(key) {
  clearTimer()
  flyout.value = key
}
function keepOpen() {
  clearTimer()
}
function scheduleClose() {
  clearTimer()
  closeTimer = setTimeout(() => { flyout.value = '' }, 160)
}
onBeforeUnmount(clearTimer)

const iconHome = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="5" rx="1"/><rect x="13" y="10" width="8" height="11" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/></svg>'

// Icon bar = 仅图标；List bar = 图标+文字
const showLabels = computed(() => store.options.shortcutMode !== 'icon')

const iconMap = {
  wrench: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L4 16.8 7.2 20l5.3-5.3a4 4 0 0 0 5.2-5.4l-3 3-2.5-.5-.5-2.5z"/></svg>',
  box: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 8l-9-5-9 5v8l9 5 9-5z M3 8l9 5 9-5 M12 13v8"/></svg>',
  cart: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 4h2l2.5 12h11l2-8H6"/></svg>',
  coin: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6 M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></svg>',
}
function moduleIcon(name) {
  return iconMap[name] || iconMap.box
}
function pagesOf(key) {
  return AMOS_PAGES.filter((p) => p.module === key && key !== 'home')
}
function isActiveModule(key) {
  const cur = AMOS_PAGES.find((p) => p.key === store.activeKey)
  return cur?.module === key
}
function open(key) {
  openWindow(key)
  flyout.value = ''
}
function openFirst(key) {
  const mod = modules.find((m) => m.key === key)
  const target = mod?.defaultPage || (pagesOf(key)[0]?.key)
  if (target) open(target)
}
</script>

<style scoped>
.shortcut-bar { width: 76px; background: linear-gradient(180deg, #2a5ca8, #1e4c8e); display: flex; flex-direction: column; align-items: center; padding: 8px 0; gap: 6px; position: relative; }
.sb-btn { width: 64px; min-height: 52px; border: none; border-radius: 8px; background: rgba(255,255,255,.08); color: #cfe0f5; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; padding: 6px 2px; transition: all .15s ease; }
.sb-btn:hover, .sb-btn.active { background: #fff; color: var(--amos-blue); }
.sb-ico { display: flex; }
.sb-label { font-size: 11px; line-height: 1.1; text-align: center; white-space: nowrap; }
.sb-group { position: relative; width: 64px; }
.sb-flyout { position: absolute; left: 70px; top: 0; min-width: 220px; background: #fff; border: 1px solid var(--amos-border-strong); border-radius: 0 6px 6px 6px; box-shadow: var(--amos-shadow); z-index: 300; padding: 4px; }
.sb-flyout::before { content: ''; position: absolute; left: -14px; top: 0; bottom: 0; width: 14px; }
.sb-flyout-head { font-weight: 800; color: var(--amos-blue); padding: 6px 12px; font-size: 12px; border-bottom: 1px solid var(--amos-border); margin-bottom: 3px; }
.sb-flyout-item { display: block; width: 100%; text-align: left; border: none; background: transparent; padding: 7px 12px; border-radius: 4px; cursor: pointer; font-size: 12.5px; color: #2b3a4d; }
.sb-flyout-item:hover, .sb-flyout-item.active { background: var(--amos-blue-soft); color: var(--amos-blue); }
</style>
