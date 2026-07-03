<script setup>
import { ref } from 'vue'
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
import { installPrototypeRouter } from './routerShim.js'

const components = {
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
  VehicleArchiveLogs
}

const navigationGroups = [
  {
    group: '调度指挥',
    icon: '🚦',
    routes: [
      { path: '/dispatch/workbench', component: 'DispatchWorkbenchView', title: '调度工作台', default: true },
      { path: '/dispatch/monitor', component: 'AlertAndTaskMonitorView', title: '告警与任务监控', default: false },
      { path: '/dispatch/mobile', component: 'MobileDispatchView', title: '移动调度', default: false },
      { path: '/dispatch/task-adjust', component: 'TaskAdjustView', title: '任务调整', default: false }
    ]
  },
  {
    group: '任务执行',
    icon: '🚚',
    routes: [
      { path: '/task/list', component: 'DriverTaskListView', title: '司机任务列表', default: true },
      { path: '/task/execute', component: 'DriverTaskExecuteView', title: '任务执行', default: false }
    ]
  },
  {
    group: '场地管理',
    icon: '🏢',
    routes: [
      { path: '/gate/access-check', component: 'GateAccessCheckView', title: '门岗核验', default: true },
      { path: '/gate/entry-records', component: 'GateEntryRecordsView', title: '入场记录', default: false }
    ]
  },
  {
    group: '外协管理',
    icon: '📋',
    routes: [
      { path: '/external/workspace', component: 'WorkspaceView', title: '预约工作台', default: true },
      { path: '/external/access-code', component: 'AccessCodeView', title: '授权码管理', default: false },
      { path: '/external/history', component: 'HistoryView', title: '历史记录', default: false }
    ]
  },
  {
    group: '综合管理',
    icon: '📊',
    routes: [
      { path: '/management/reports', component: 'ManagementReportsView', title: '运营报表', default: true },
      { path: '/management/report-detail', component: 'ReportDetailView', title: '报表详情', default: false },
      { path: '/management/vehicle-archive', component: 'VehicleArchiveList', title: '车辆档案列表', default: false },
      { path: '/management/vehicle-archive/edit', component: 'VehicleArchiveEdit', title: '车辆档案编辑', default: false },
      { path: '/management/vehicle-archive/logs', component: 'VehicleArchiveLogs', title: '档案操作日志', default: false }
    ]
  }
]

const currentComponent = ref(components['DispatchWorkbenchView'])
const currentRoute = ref('/dispatch/workbench')
const routeHistory = ref(['/dispatch/workbench'])

const routeAliases = {
  '/dashboard': '/management/reports',
  '/vehicles': '/management/vehicle-archive',
  '/vehicles/add': '/management/vehicle-archive/edit',
}

const nameAliases = {
  DriverTaskExecuteView: '/task/execute',
  WorkbenchView: '/dispatch/workbench',
  Detail: '/management/report-detail',
}

function routeToComponent(path) {
  const normalized = routeAliases[path] || path
  const exact = navigationGroups.flatMap(group => group.routes).find(route => route.path === normalized)
  if (exact) return exact
  if (normalized.startsWith('/vehicles/edit')) {
    return { path: '/management/vehicle-archive/edit', component: 'VehicleArchiveEdit' }
  }
  if (normalized.startsWith('/management/report-detail')) {
    return { path: '/management/report-detail', component: 'ReportDetailView' }
  }
  return null
}

function switchComponent(componentName, path) {
  currentComponent.value = components[componentName]
  currentRoute.value = path
  if (routeHistory.value[routeHistory.value.length - 1] !== path) routeHistory.value.push(path)
}

function navigateRoute(target) {
  if (target.path === '__back__') {
    routeHistory.value.pop()
    const previous = routeHistory.value[routeHistory.value.length - 1] || '/dispatch/workbench'
    const route = routeToComponent(previous)
    if (route) {
      currentComponent.value = components[route.component]
      currentRoute.value = route.path
    }
    return
  }
  const path = target.path || nameAliases[target.name] || ''
  const route = routeToComponent(path)
  if (route) switchComponent(route.component, route.path)
}

installPrototypeRouter(navigateRoute)
</script>

<template>
  <div class="app-shell">
    <nav class="side-nav">
      <div v-for="group in navigationGroups" :key="group.group" class="nav-group">
        <div class="nav-group-title">
          <span>{{ group.icon }}</span>
          <span>{{ group.group }}</span>
        </div>
        <ul class="nav-group-routes">
          <li v-for="route in group.routes" :key="route.path" 
              :class="{ 'active': currentRoute === route.path }"
              @click="switchComponent(route.component, route.path)">
            {{ route.title }}
          </li>
        </ul>
      </div>
    </nav>
    <main class="main-panel">
      <component :is="currentComponent" />
    </main>
  </div>
</template>

<style scoped>
.nav-group-routes {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 6px;
}
.side-nav ul li {
  list-style: none;
  cursor: pointer;
  padding: 10px 14px;
  border-radius: 8px;
  transition: background 0.2s;
  color: #cbd5e1;
  font-weight: 750;
}
.side-nav ul li:hover {
  background: rgba(255,255,255,0.08);
  color: #fff;
}
.side-nav ul li.active {
  background: #2563eb;
  color: #fff;
  font-weight: bold;
}
.nav-group-title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-weight: bold;
  color: #94a3b8;
}
</style>
