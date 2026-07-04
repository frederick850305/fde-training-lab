<script setup>
import { computed, h, provide, ref, watch } from 'vue'
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
import PrototypePage from './components/PrototypePage.vue'
import { installPrototypeRouter } from './routerShim.js'
import { prototypeContract } from './prototypeContract.js'

const generatedComponents = {
  DispatchWorkbenchView,
  AlertAndTaskMonitorView,
  DriverTaskListView,
  DriverTaskExecuteView,
  MobileDispatchView,
  TaskAdjustView,
  GateAccessCheckView,
  GateEntryRecordsView,
  ManagementReportsView,
  ReportDetailView,
  WorkspaceView,
  AccessCodeView,
  HistoryView,
  VehicleArchiveList,
  VehicleArchiveEdit,
  VehicleArchiveLogs,
}

function createGovernedComponent(page) {
  return {
    name: page.component,
    setup() {
      return () => h(PrototypePage, { pageKey: page.file })
    },
  }
}

const governedComponents = Object.fromEntries((prototypeContract.pages || []).map(page => [page.component, createGovernedComponent(page)]))
const components = Object.keys(governedComponents).length ? governedComponents : generatedComponents

const navigationGroups = prototypeContract.navigationGroups || []
const roles = prototypeContract.roles || []
const currentRoleKey = ref(prototypeContract.defaultRole || roles[0]?.key || 'admin')
const currentRoute = ref(findDefaultRoute(currentRoleKey.value)?.path || navigationGroups[0]?.routes?.[0]?.path || '/')
const routeHistory = ref([currentRoute.value])
const expandedGroups = ref(new Set())

const currentRole = computed(() => roles.find(role => role.key === currentRoleKey.value) || roles[0] || { key: 'admin', label: '系统管理员', userName: '演示用户' })
const visibleGroups = computed(() => navigationGroups
  .map(group => ({
    ...group,
    routes: (group.routes || []).filter(route => canAccess(route, currentRoleKey.value)),
  }))
  .filter(group => group.routes.length))
const currentRouteMeta = computed(() => findRouteByPath(currentRoute.value) || findDefaultRoute(currentRoleKey.value))
const currentComponent = computed(() => components[currentRouteMeta.value?.component] || Object.values(components)[0])

provide('prototypeContext', {
  currentRole,
  currentRoleKey,
  currentRoute,
  contract: prototypeContract,
})

function canAccess(route, roleKey) {
  return !route.roles?.length || route.roles.includes(roleKey) || roleKey === 'admin'
}

function findRouteByPath(path) {
  return navigationGroups.flatMap(group => group.routes || []).find(route => route.path === path)
}

function findDefaultRoute(roleKey) {
  return navigationGroups.flatMap(group => group.routes || []).find(route => route.default && canAccess(route, roleKey))
    || navigationGroups.flatMap(group => group.routes || []).find(route => canAccess(route, roleKey))
}

function groupKey(group) {
  return group.group
}

function groupHasRoute(group, path) {
  return (group.routes || []).some(route => route.path === path)
}

function ensureExpandedForRoute(path) {
  const group = navigationGroups.find(item => groupHasRoute(item, path))
  if (!group) return
  expandedGroups.value = new Set([...expandedGroups.value, groupKey(group)])
}

function toggleGroup(group) {
  const next = new Set(expandedGroups.value)
  const key = groupKey(group)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  expandedGroups.value = next
}

function isGroupExpanded(group) {
  return expandedGroups.value.has(groupKey(group))
}

function switchRoute(route) {
  currentRoute.value = route.path
  if (routeHistory.value[routeHistory.value.length - 1] !== route.path) routeHistory.value.push(route.path)
  ensureExpandedForRoute(route.path)
}

function navigateRoute(target) {
  if (target.path === '__back__') {
    routeHistory.value.pop()
    const previous = routeHistory.value[routeHistory.value.length - 1] || findDefaultRoute(currentRoleKey.value)?.path
    const route = findRouteByPath(previous)
    if (route && canAccess(route, currentRoleKey.value)) switchRoute(route)
    return
  }
  const route = findRouteByPath(target.path)
  if (route && canAccess(route, currentRoleKey.value)) switchRoute(route)
}

watch(currentRoleKey, roleKey => {
  const active = findRouteByPath(currentRoute.value)
  if (!active || !canAccess(active, roleKey)) {
    const nextRoute = findDefaultRoute(roleKey)
    if (nextRoute) switchRoute(nextRoute)
  }
}, { immediate: true })

watch(currentRoute, path => ensureExpandedForRoute(path), { immediate: true })

installPrototypeRouter(navigateRoute)
</script>

<template>
  <div class="app-shell">
    <nav class="side-nav" aria-label="原型导航">
      <div class="brand">
        <strong>{{ prototypeContract.projectName }}</strong>
        <span>{{ prototypeContract.customerName || 'Prototype Demo' }}</span>
      </div>

      <section class="role-panel" aria-label="演示角色">
        <label for="prototype-role">当前角色</label>
        <select id="prototype-role" v-model="currentRoleKey">
          <option v-for="role in roles" :key="role.key" :value="role.key">{{ role.label }}</option>
        </select>
        <div class="role-user">
          <span>{{ currentRole.userName }}</span>
          <span>{{ currentRole.label }}</span>
        </div>
      </section>

      <div class="nav-scroll">
        <section v-for="group in visibleGroups" :key="group.group" class="nav-group">
          <button class="nav-group-title" type="button" @click="toggleGroup(group)">
            <span class="nav-group-title-main">
              <span>{{ group.icon }}</span>
              <span>{{ group.group }}</span>
            </span>
            <span class="nav-group-count">{{ isGroupExpanded(group) ? '收起' : group.routes.length + '项' }}</span>
          </button>
          <ul v-if="isGroupExpanded(group)" class="nav-group-routes">
            <li v-for="route in group.routes" :key="route.path">
              <button class="nav-button" :class="{ active: currentRoute === route.path }" type="button" @click="switchRoute(route)">
                {{ route.title }}
              </button>
            </li>
          </ul>
        </section>
      </div>
    </nav>

    <main class="main-panel">
      <component :is="currentComponent" />
    </main>
  </div>
</template>
