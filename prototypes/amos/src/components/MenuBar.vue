<template>
  <nav class="menu-bar">
    <div
      v-for="m in menu"
      :key="m.label"
      class="menu-item"
      :class="{ open: openMenu === m.label }"
      @click="toggle(m.label)"
      @mouseenter="openMenu && (openMenu = m.label)"
    >
      <span>{{ m.label }}</span>
      <div v-if="openMenu === m.label" class="menu-dropdown">
        <button
          v-for="(it, i) in m.items"
          :key="i"
          class="menu-leaf"
          :class="{ disabled: it.disabled }"
          :disabled="it.disabled"
          @click.stop="handle(it)"
        >{{ it.label }}</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { menu } from '../data/amosData.js'
import { openWindow, showDialog, closeTab, showToast, store } from '../store.js'

const openMenu = ref('')

function toggle(label) {
  openMenu.value = openMenu.value === label ? '' : label
}
function handle(it) {
  openMenu.value = ''
  if (it.disabled) return
  if (it.page) return openWindow(it.page)
  switch (it.action) {
    case 'print': window.print(); break
    case 'lock': showToast('应用已锁定（原型演示）', 'warn'); break
    case 'save': window.dispatchEvent(new CustomEvent('amos-action', { detail: { action: 'save' } })); break
    case 'close': if (store.activeKey) closeTab(store.activeKey); break
    case 'exit': showToast('退出（原型演示）', 'info'); break
    case 'select-view': showDialog('select-view'); break
    case 'switch-department': showDialog('switch-department'); break
    case 'change-password': showDialog('change-password'); break
    case 'filter': window.dispatchEvent(new CustomEvent('amos-action', { detail: { action: 'filter' } })); break
    case 'license': showToast('License 有效至 2027-12-31（国产化原型）', 'ok'); break
    case 'cascade': showToast('窗口已层叠（原型演示）', 'info'); break
    case 'maximize': showToast('窗口已最大化（原型演示）', 'info'); break
    case 'open-windows': showToast(`当前打开 ${store.openTabs.length} 个窗口`, 'info'); break
    case 'userguide': showToast('用户手册见 AMOS M&P Vrs.10.0.30 User Guide.pdf', 'info'); break
    case 'sfi-info': showDialog('sfi-info'); break
    case 'about': showDialog('about'); break
    default: break
  }
}
</script>

<style scoped>
.menu-bar { display: flex; background: linear-gradient(180deg, #f4f7fb, #e6ecf4); border-bottom: 1px solid var(--amos-border); padding: 0 6px; height: 28px; }
.menu-item { position: relative; padding: 0 12px; display: flex; align-items: center; font-size: 12.5px; color: #36506e; cursor: pointer; border-radius: 4px 4px 0 0; }
.menu-item:hover, .menu-item.open { background: #fff; color: var(--amos-blue); }
.menu-dropdown { position: absolute; top: 28px; left: 0; min-width: 210px; background: #fff; border: 1px solid var(--amos-border-strong); border-radius: 0 6px 6px 6px; box-shadow: var(--amos-shadow); z-index: 200; padding: 4px; }
.menu-leaf { display: block; width: 100%; text-align: left; border: none; background: transparent; padding: 7px 12px; border-radius: 4px; cursor: pointer; font-size: 12.5px; color: #2b3a4d; }
.menu-leaf:hover:not(:disabled) { background: var(--amos-blue-soft); color: var(--amos-blue); }
.menu-leaf:disabled { color: #b3bcc8; cursor: default; }
</style>
