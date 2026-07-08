<template>
  <div class="app-shell" :class="{ 'nav-collapsed': navCollapsed }">
    <aside class="side-nav">
      <div class="brand">
        <span class="brand-mark">APS</span>
        <div v-show="!navCollapsed">
          <strong>{{ data.projectName }}</strong>
          <small>{{ data.customerName }} 多专业协同排程</small>
        </div>
      </div>

      <button class="nav-toggle" type="button" @click="navCollapsed = !navCollapsed" :title="navCollapsed ? '展开导航' : '收起导航'">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path :d="navCollapsed ? 'M6 3l5 5-5 5' : 'M10 3L5 8l5 5'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>

      <div class="nav-scroll">
        <section v-for="group in visibleGroups" :key="group.key" class="nav-group">
          <!-- 折叠态：仅显示图标 -->
          <button
            v-if="navCollapsed"
            class="nav-group-icon"
            :class="{ active: isActiveGroup(group) }"
            type="button"
            :title="group.title"
            @click="navigateToFirstPage(group)"
          >
            <IconDashboard v-if="group.svgIcon === 'dashboard'" />
            <IconPlan v-else-if="group.svgIcon === 'plan'" />
            <IconResource v-else-if="group.svgIcon === 'resource'" />
            <IconSchedule v-else-if="group.svgIcon === 'schedule'" />
            <IconException v-else-if="group.svgIcon === 'exception'" />
          </button>
          <!-- 展开态：标题 + 子菜单 -->
          <button v-else class="nav-group-title" type="button" @click="toggleGroup(group.key)">
            <span><SvgIconWrap :icon="group.svgIcon" />{{ group.title }}</span>
            <b>{{ expandedGroups.has(group.key) ? '−' : '+' }}</b>
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
        <div class="ctx-title" v-show="!navCollapsed">
          <h1>{{ currentPage.title }}</h1>
          <p>{{ currentPage.desc }}</p>
        </div>
        <label class="role-picker">
          <span class="role-icon-wrap" :class="currentRoleKey">
            <svg v-if="currentRoleKey === 'leader'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></svg>
            <svg v-else-if="currentRoleKey === 'planner'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v5M16 4v5"/></svg>
            <svg v-else-if="currentRoleKey === 'workshop'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
          </span>
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
import { computed, provide, ref, h } from 'vue'
import { pageComponents } from './pages/index.js'
import { pages, prototypeData as data } from './data/apsData.js'

// ===== 图标定义（SVG path 数据） =====
const ICONS = {
  dashboard: [
    'M3 3h7v9H3z M14 3h7v5H14z M14 12h7v9H14z M3 16h7v5H3z',
  ],
  plan: [
    'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z M8 7h16 M8 11h16 M8 15h13',
  ],
  resource: [
    'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z M10 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0',
  ],
  schedule: [
    'M3 4h18a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M16 2v4 M8 2v4 M1 10h22 M8 15l2 2 5-5',
  ],
  exception: [
    'M13 2L3 14h9l-1 8 10-12h-9z',
  ],
}

// 小图标组件（展开态标题前缀）
const SvgIconWrap = {
  props: ['icon'],
  render() {
    const d = ICONS[this.icon] || []
    return h('svg', { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, d.map(p => h('path', { d: p })))
  },
}

// 大图标组件（折叠态导航按钮）
function makeCollapsedIcon(name) {
  return {
    render() {
      const d = ICONS[name] || []
      return h('svg', { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, d.map(p => h('path', { d: p })))
    },
  }
}

const IconDashboard = makeCollapsedIcon('dashboard')
const IconPlan = makeCollapsedIcon('plan')
const IconResource = makeCollapsedIcon('resource')
const IconSchedule = makeCollapsedIcon('schedule')
const IconException = makeCollapsedIcon('exception')

const currentRoleKey = ref('leader')
const currentPageKey = ref('Dashboard')
const expandedGroups = ref(new Set(['dashboard', 'scheduling', 'resource']))
const navCollapsed = ref(false)
const routeContext = ref({})

const currentRole = computed(() => data.roles.find((role) => role.key === currentRoleKey.value) || data.roles[0])
const visibleGroups = computed(() => data.groups.filter((group) => group.roles.includes(currentRoleKey.value)))
const currentComponent = computed(() => pageComponents[currentPageKey.value] || pageComponents.Dashboard)
const currentPage = computed(() => pages.find((page) => page.key === currentPageKey.value) || pages[0])

provide('prototypeNavigation', {
  currentPageKey,
  routeContext,
  navigateTo,
})

function pagesOf(group) {
  return pages.filter((page) => page.groupKey === group.key)
}

function resetRoute() {
  const preferredGroupKey = {
    leader: 'dashboard',
    planner: 'scheduling',
    workshop: 'scheduling',
    developer: 'exception',
  }[currentRoleKey.value]
  const firstGroup = visibleGroups.value.find((group) => group.key === preferredGroupKey) || visibleGroups.value[0]
  const firstPage = firstGroup ? pagesOf(firstGroup)[0] : pages[0]
  routeContext.value = {}
  currentPageKey.value = firstPage.key
  expandedGroups.value = new Set(visibleGroups.value.slice(0, 3).map((group) => group.key))
}

function navigateTo(pageKey, context = {}) {
  if (!pageComponents[pageKey]) return
  routeContext.value = { ...context, from: currentPageKey.value }
  currentPageKey.value = pageKey
  const target = pages.find((page) => page.key === pageKey)
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

function isActiveGroup(group) {
  return pagesOf(group).some((p) => p.key === currentPageKey.value)
}

function navigateToFirstPage(group) {
  const first = pagesOf(group)[0]
  if (first) navigateTo(first.key)
}
</script>

<style scoped>
/* 折叠态图标导航按钮 */
.nav-group-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  margin: 3px auto;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #7b94af;
  cursor: pointer;
  transition: all .18s ease;
}
.nav-group-icon:hover {
  color: #1e6fd9;
  background: rgba(30,111,217,.08);
}
.nav-group-icon.active {
  color: #fff;
  background: #1e6fd9;
  box-shadow: 0 2px 8px rgba(30,111,217,.35);
}
.nav-group-icon svg {
  flex-shrink: 0;
}

/* 展开态标题前的图标 */
.nav-group-title svg {
  flex-shrink: 0;
  margin-right: 6px;
  color: #7fb4ff;
}
</style>
