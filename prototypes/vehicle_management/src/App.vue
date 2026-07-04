<template>
  <div class="app-shell">
    <!-- 侧边导航-->
    <nav class="side-nav">
      <div class="brand">
        <strong>{{ contract.projectName }}</strong>
        <span>{{ contract.customerName }} 海工基地</span>
      </div>

      <!-- 角色选择 -->
      <div class="role-panel">
        <label>当前角色</label>
        <select :value="currentRoleKey" @change="switchRole($event.target.value)">
          <option v-for="role in contract.roles" :key="role.key" :value="role.key">{{ role.label }}</option>
        </select>
        <div class="role-user">{{ currentRole.userName }}</div>
      </div>

      <!-- 导航菜单 -->
      <div class="nav-scroll">
        <div v-for="group in visibleGroups" :key="group.group" class="nav-group">
          <button class="nav-group-title" @click="toggleGroup(group.group)">
            <span class="nav-group-title-main">
              <span>{{ group.icon }}</span>
              <span>{{ group.group }}</span>
            </span>
            <span class="nav-arrow">{{ expandedGroups.has(group.group) ? '▾' : '▸' }}</span>
          </button>
          <div v-if="expandedGroups.has(group.group)" class="nav-group-routes">
            <button
              v-for="route in group.routes"
              :key="route.path"
              class="nav-route"
              :class="{ active: currentRoute === route.path }"
              @click="navigateTo(route.path)"
            >
              {{ route.title }}
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主内容区 -->
    <main class="main-content">
      <component :is="currentComponent" />
    </main>
  </div>
</template>

<script setup>
import { computed, provide, ref } from 'vue'
import { installPrototypeRouter } from './routerShim.js'
import { prototypeContract as contract } from './prototypeContract.js'

/* 页面组件导入 */
import DispatchWorkbenchView from './views/DispatchWorkbenchView.vue'
import AlertAndTaskMonitorView from './views/AlertAndTaskMonitorView.vue'
import DriverTaskListView from './views/DriverTaskListView.vue'
import DriverTaskExecuteView from './views/DriverTaskExecuteView.vue'
import MobileDispatchView from './views/MobileDispatchView.vue'
import TaskAdjustView from './views/TaskAdjustView.vue'
import GateAccessCheckView from './views/GateAccessCheckView.vue'
import GateEntryRecordsView from './views/GateEntryRecordsView.vue'
import ManagementReportsView from './views/ManagementReportsView.vue'
import ReportDetailView from './views/ReportDetailView.vue'
import WorkspaceView from './views/WorkspaceView.vue'
import AccessCodeView from './views/AccessCodeView.vue'
import HistoryView from './views/HistoryView.vue'
import VehicleArchiveList from './views/VehicleArchiveList.vue'
import VehicleArchiveEdit from './views/VehicleArchiveEdit.vue'
import VehicleArchiveLogs from './views/VehicleArchiveLogs.vue'

const componentMap = {
  DispatchWorkbenchView, AlertAndTaskMonitorView, DriverTaskListView,
  DriverTaskExecuteView, MobileDispatchView, TaskAdjustView,
  GateAccessCheckView, GateEntryRecordsView, ManagementReportsView,
  ReportDetailView, WorkspaceView, AccessCodeView, HistoryView,
  VehicleArchiveList, VehicleArchiveEdit, VehicleArchiveLogs,
}

/* 状态 */
const currentRoleKey = ref(contract.defaultRole || 'dispatcher')
const currentRoute = ref(findDefaultRoute()?.path || '/dispatch/workbench')
const expandedGroups = ref(new Set([contract.navigationGroups[0]?.group]))
const routeHistory = ref([currentRoute.value])

const currentRole = computed(() =>
  contract.roles.find(r => r.key === currentRoleKey.value) || contract.roles[0]
)

const visibleGroups = computed(() =>
  contract.navigationGroups
    .map(group => ({
      ...group,
      routes: (group.routes || []).filter(route =>
        !route.roles?.length || route.roles.includes(currentRoleKey.value) || currentRoleKey.value === 'admin'
      ),
    }))
    .filter(group => group.routes.length)
)

const currentRouteMeta = computed(() => {
  for (const group of contract.navigationGroups) {
    const found = (group.routes || []).find(r => r.path === currentRoute.value)
    if (found) return found
  }
  return null
})

const currentComponent = computed(() =>
  componentMap[currentRouteMeta.value?.component] || DispatchWorkbenchView
)

/* 路由安装 */
installPrototypeRouter((target) => {
  if (target.path === '__back__') {
    if (routeHistory.value.length > 1) {
      routeHistory.value.pop()
      currentRoute.value = routeHistory.value[routeHistory.value.length - 1]
    }
  } else if (target.path) {
    currentRoute.value = target.path
    routeHistory.value.push(target.path)
  }
})

function navigateTo(path) {
  currentRoute.value = path
  routeHistory.value.push(path)
}

function switchRole(key) {
  currentRoleKey.value = key
  const defaultRoute = findDefaultRoute()
  if (defaultRoute) {
    currentRoute.value = defaultRoute.path
    routeHistory.value = [defaultRoute.path]
  }
}

function findDefaultRoute() {
  for (const group of contract.navigationGroups) {
    const found = (group.routes || []).find(r =>
      r.default && (!r.roles?.length || r.roles.includes(currentRoleKey.value) || currentRoleKey.value === 'admin')
    )
    if (found) return found
  }
  return visibleGroups.value[0]?.routes?.[0]
}

function toggleGroup(groupName) {
  const next = new Set(expandedGroups.value)
  if (next.has(groupName)) next.delete(groupName)
  else next.add(groupName)
  expandedGroups.value = next
}

provide('prototypeContext', { currentRole, currentRoleKey, currentRoute, contract })
</script>

<style scoped>
.app-shell { height: 100vh; display: grid; grid-template-columns: 280px minmax(0, 1fr); overflow: hidden; }
.side-nav { min-height: 0; background: #0f172a; color: #e2e8f0; padding: 18px 16px; display: flex; flex-direction: column; gap: 14px; box-shadow: 12px 0 30px rgba(15,23,42,.12); }
.brand { display: grid; gap: 4px; color: #fff; }
.brand strong { font-size: 18px; font-weight: 900; }
.brand span { color: #94a3b8; font-size: 12px; }
.role-panel { display: grid; gap: 8px; padding: 10px; border: 1px solid rgba(148,163,184,.28); border-radius: 8px; background: rgba(15,23,42,.32); }
.role-panel label { font-size: 12px; color: #94a3b8; font-weight: 800; }
.role-panel select { width: 100%; border: 1px solid rgba(148,163,184,.38); border-radius: 7px; padding: 8px 10px; background: #111827; color: #fff; font-size: 13px; }
.role-user { display: flex; justify-content: space-between; gap: 8px; color: #cbd5e1; font-size: 12px; }
.nav-scroll { min-height: 0; overflow-y: auto; display: grid; align-content: start; gap: 8px; }
.nav-group { display: grid; gap: 4px; }
.nav-group-title { width: 100%; border: 0; border-radius: 8px; padding: 9px 10px; display: flex; align-items: center; justify-content: space-between; gap: 8px; color: #cbd5e1; background: transparent; font-size: 12px; font-weight: 900; text-align: left; cursor: pointer; }
.nav-group-title:hover { background: rgba(255,255,255,.07); color: #fff; }
.nav-group-title-main { display: inline-flex; align-items: center; gap: 8px; min-width: 0; }
.nav-group-title-main span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nav-arrow { font-size: 10px; color: #64748b; flex-shrink: 0; }
.nav-group-routes { display: grid; gap: 2px; padding-left: 16px; }
.nav-route { width: 100%; border: 0; border-radius: 7px; padding: 8px 12px; color: #94a3b8; background: transparent; font-size: 12px; text-align: left; cursor: pointer; }
.nav-route:hover { background: rgba(255,255,255,.06); color: #e2e8f0; }
.nav-route.active { background: rgba(26,86,219,.25); color: #fff; font-weight: 700; }
.main-content { min-height: 0; overflow-y: auto; background: #eef3f8; }
</style>
