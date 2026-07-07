<template>
  <div class="app-shell" :class="{ 'nav-collapsed': navCollapsed }">
    <aside class="side-nav">
      <div class="brand">
        <span class="brand-mark">PMS</span>
        <div v-show="!navCollapsed">
          <strong>{{ data.projectName }}</strong>
          <small>{{ data.customerName }} 船舶维护平台</small>
        </div>
      </div>

      <button class="nav-toggle" type="button" @click="navCollapsed = !navCollapsed" :title="navCollapsed ? '展开导航' : '收起导航'">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path :d="navCollapsed ? 'M6 3l5 5-5 5' : 'M10 3L5 8l5 5'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>

      <div class="nav-scroll">
        <section v-for="group in visibleGroups" :key="group.key" class="nav-group">
          <button class="nav-group-title" type="button" @click="toggleGroup(group.key)">
            <span>{{ group.title }}</span>
            <b v-show="!navCollapsed">{{ expandedGroups.has(group.key) ? '-' : '+' }}</b>
          </button>
          <div v-if="expandedGroups.has(group.key) && !navCollapsed" class="route-list">
            <button
              v-for="page in pagesOf(group)"
              :key="page.key"
              class="route-item"
              :class="{ active: page.key === currentPageKey }"
              type="button"
              :title="page.title"
              @click="navigateTo(page.key)"
            >
              <span>{{ page.title }}</span>
              <small>{{ page.priority }}</small>
            </button>
          </div>
        </section>
      </div>
    </aside>

    <main class="workspace">
      <header class="workspace-header">
        <label class="role-picker">
          <span>当前业务角色</span>
          <select v-model="currentRoleKey" @change="resetRoute">
            <option v-for="role in data.roles" :key="role.key" :value="role.key">{{ role.label }}</option>
          </select>
          <em>{{ currentRole.user }}</em>
        </label>
      </header>
      <component :is="currentComponent" />
    </main>
  </div>
</template>

<script setup>
import { computed, provide, ref } from 'vue'
import { pageComponents } from './pages/index.js'
import { pages, prototypeData as data } from './data/prototypeData.js'

const currentRoleKey = ref('shore_engineer')
const currentPageKey = ref('MaintenancePlanWorkbench')
const expandedGroups = ref(new Set(['maintenance', 'voyage', 'workorder']))
const navCollapsed = ref(false)
const routeContext = ref({})

const currentRole = computed(() => data.roles.find(role => role.key === currentRoleKey.value) || data.roles[0])
const visibleGroups = computed(() => data.groups.filter(group => group.roles.includes(currentRoleKey.value)))
const currentComponent = computed(() => pageComponents[currentPageKey.value] || pageComponents.MaintenancePlanWorkbench)

provide('prototypeNavigation', {
  currentPageKey,
  routeContext,
  navigateTo,
})

function pagesOf(group) {
  return pages.filter(page => page.groupKey === group.key)
}

function resetRoute() {
  const preferredGroupKey = {
    ship_manager: 'ship',
    shore_engineer: 'maintenance',
    ship_operator: 'mobile_work',
  }[currentRoleKey.value]
  const firstGroup = visibleGroups.value.find(group => group.key === preferredGroupKey) || visibleGroups.value[0]
  const firstPage = firstGroup ? pagesOf(firstGroup)[0] : pages[0]
  routeContext.value = {}
  currentPageKey.value = firstPage.key
  expandedGroups.value = new Set(visibleGroups.value.slice(0, 3).map(group => group.key))
}

function navigateTo(pageKey, context = {}) {
  if (!pageComponents[pageKey]) return
  routeContext.value = { ...context, from: currentPageKey.value }
  currentPageKey.value = pageKey
  const target = pages.find(page => page.key === pageKey)
  if (target?.groupKey) {
    expandedGroups.value = new Set([...expandedGroups.value, target.groupKey])
  }
}

function toggleGroup(key) {
  const next = new Set(expandedGroups.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  expandedGroups.value = next
}
</script>

<style scoped>
.app-shell { height: 100vh; display: grid; grid-template-columns: 292px minmax(0, 1fr); overflow: hidden; transition: grid-template-columns .28s cubic-bezier(.4,0,.2,1); }
.app-shell.nav-collapsed { grid-template-columns: 60px minmax(0, 1fr); }

.side-nav { min-height: 0; background: #10213d; color: #d9e5f2; padding: 18px 14px; display: flex; flex-direction: column; gap: 16px; overflow: hidden; transition: padding .28s cubic-bezier(.4,0,.2,1); }
.nav-collapsed .side-nav { padding: 18px 10px; align-items: center; }

.brand { display: flex; align-items: center; gap: 12px; padding: 4px 4px 10px; flex-shrink: 0; }
.nav-collapsed .brand { justify-content: center; padding: 4px 0 10px; }
.brand-mark { width: 48px; height: 48px; border-radius: 8px; display: grid; place-items: center; background: #1e6fd9; color: #fff; font-weight: 900; flex-shrink: 0; }
.nav-collapsed .brand-mark { width: 40px; height: 40px; font-size: 14px; }
.brand strong { display: block; color: #fff; font-size: 18px; letter-spacing: 0; }
.brand small { display: block; margin-top: 4px; color: #9cb0c8; font-size: 12px; }

.nav-toggle { align-self: flex-end; width: 28px; height: 28px; border: 1px solid rgba(255,255,255,.15); border-radius: 6px; background: rgba(255,255,255,.06); color: #9cb0c8; cursor: pointer; display: grid; place-items: center; flex-shrink: 0; transition: background .15s, color .15s; }
.nav-toggle:hover { background: rgba(255,255,255,.12); color: #fff; }

.nav-scroll { min-height: 0; overflow-y: auto; overflow-x: hidden; display: grid; align-content: start; gap: 8px; padding: 2px; }
.nav-group { display: grid; gap: 4px; }
.nav-group-title { width: 100%; min-height: 38px; border: 0; border-radius: 8px; padding: 9px 10px; color: #d9e5f2; background: transparent; display: flex; align-items: center; justify-content: space-between; text-align: left; white-space: nowrap; }
.nav-collapsed .nav-group-title { justify-content: center; padding: 9px 6px; }
.nav-group-title:hover { background: rgba(255,255,255,.08); }
.nav-group-title span { min-width: 0; font-weight: 800; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nav-collapsed .nav-group-title span { display: none; }
.nav-group-title b { color: #86a1bf; flex-shrink: 0; }
.route-list { display: grid; gap: 2px; padding-left: 18px; }
.route-item { border: 0; border-radius: 7px; padding: 8px 9px; color: #a9bad0; background: transparent; display: flex; align-items: center; justify-content: space-between; gap: 8px; text-align: left; }
.route-item span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; }
.route-item small { color: #89a2bd; font-size: 11px; }
.route-item:hover, .route-item.active { background: rgba(54, 133, 230, .23); color: #fff; }

.workspace { min-width: 0; min-height: 0; overflow-x: hidden; overflow-y: auto; padding: 18px 24px 34px; background: #eef3f8; display: flex; flex-direction: column; gap: 18px; }
.workspace-header { display: flex; justify-content: flex-end; align-items: center; gap: 12px; }
.role-picker { display: flex; align-items: center; gap: 10px; padding: 8px 14px; border: 1px solid #d9e4ef; border-radius: 10px; background: #fff; box-shadow: 0 1px 3px rgba(15, 23, 42, .04); }
.role-picker span { font-size: 12px; color: #64748b; font-weight: 800; }
.role-picker select { border: 1px solid #d9e4ef; border-radius: 8px; padding: 8px 10px; min-width: 140px; color: #172033; background: #f8fbfe; font-size: 13px; font-weight: 700; cursor: pointer; transition: border-color .15s, box-shadow .15s; }
.role-picker select:focus { outline: none; border-color: #1e6fd9; box-shadow: 0 0 0 3px rgba(30, 111, 217, .1); }
.role-picker em { color: #64748b; font-size: 12px; font-style: normal; }

@media (max-width: 920px) {
  .app-shell { grid-template-columns: 1fr; }
  .app-shell.nav-collapsed { grid-template-columns: 1fr; }
  .side-nav { max-height: 42vh; }
  .workspace { padding: 16px; }
}
</style>
