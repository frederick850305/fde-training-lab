<template>
  <div class="app-layout">
    <!-- 左侧深色导航 -->
    <aside class="sidebar" aria-label="主导航">
      <div class="sidebar-brand">
        <span class="brand-icon">🏭</span>
        <div>
          <span class="brand-title">海工生产调度</span>
          <span class="brand-sub">原型系统 v0.1</span>
        </div>
      </div>

      <!-- 角色切换 -->
      <div class="role-switcher">
        <span class="role-label">当前角色</span>
        <select v-model="activeRole" @change="onRoleChange">
          <option v-for="r in roles" :key="r.key" :value="r.key">
            {{ r.icon }} {{ r.label }}
          </option>
        </select>
      </div>

      <nav class="sidebar-nav">
        <div v-for="group in visibleNavGroups" :key="group.label" class="nav-group">
          <span class="nav-group-label">{{ group.label }}</span>
          <button
            v-for="item in group.items"
            :key="item.key"
            type="button"
            :class="{ active: item.key === activePage }"
            @click="activePage = item.key"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-text">{{ item.label }}</span>
            <span class="nav-badge">{{ item.stage }}</span>
          </button>
        </div>
      </nav>

      <div class="sidebar-footer">
        <small>FDE Prototype Factory</small>
      </div>
    </aside>

    <!-- 右侧主内容 -->
    <main class="main-content">
      <DispatchMapView v-if="activePage === 'dispatchMap'" key="dispatchMap"/>
      <TaskListView v-else-if="activePage === 'taskList'" key="taskList"/>
      <TaskDetailView v-else-if="activePage === 'taskDetail'" key="taskDetail"/>
      <NavigationView v-else-if="activePage === 'navigation'" key="navigation"/>
      <SiteFeedbackView v-else-if="activePage === 'siteFeedback'" key="siteFeedback"/>
      <OnsiteVehicleFilterView v-else-if="activePage === 'vehicleFilter'" key="vehicleFilter"/>
      <OnsiteDispatchDialogView v-else-if="activePage === 'dispatchDialog'" key="dispatchDialog"/>
      <OnsiteExceptionAlertView v-else-if="activePage === 'exceptionAlert'" key="exceptionAlert"/>
      <EntryCheckPanelView v-else-if="activePage === 'entryCheck'" key="entryCheck"/>
      <ReleaseManagementPanelView v-else-if="activePage === 'releaseMgmt'" key="releaseMgmt"/>
      <AlertPanelView v-else-if="activePage === 'alertPanel'" key="alertPanel"/>
      <ReleaseRecordQueryView v-else-if="activePage === 'releaseRecord'" key="releaseRecord"/>
      <StatisticsAnalysisView v-else-if="activePage === 'statistics'" key="statistics"/>
      <ReportExportView v-else-if="activePage === 'reportExport'" key="reportExport"/>
      <ResourceAllocationView v-else-if="activePage === 'resourceAlloc'" key="resourceAlloc"/>
      <section v-else class="placeholder-page">
        <span class="ph-icon">🚧</span><h3>{{ currentPageLabel }}</h3><p>开发中，即将上线。</p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import AlertPanelView from './views/AlertPanelView.vue'
import DispatchMapView from './views/DispatchMapView.vue'
import EntryCheckPanelView from './views/EntryCheckPanelView.vue'
import NavigationView from './views/NavigationView.vue'
import OnsiteDispatchDialogView from './views/OnsiteDispatchDialogView.vue'
import OnsiteExceptionAlertView from './views/OnsiteExceptionAlertView.vue'
import OnsiteVehicleFilterView from './views/OnsiteVehicleFilterView.vue'
import ReleaseManagementPanelView from './views/ReleaseManagementPanelView.vue'
import ReleaseRecordQueryView from './views/ReleaseRecordQueryView.vue'
import ReportExportView from './views/ReportExportView.vue'
import ResourceAllocationView from './views/ResourceAllocationView.vue'
import SiteFeedbackView from './views/SiteFeedbackView.vue'
import StatisticsAnalysisView from './views/StatisticsAnalysisView.vue'
import TaskDetailView from './views/TaskDetailView.vue'
import TaskListView from './views/TaskListView.vue'

const activePage = ref('dispatchMap')
const activeRole = ref('admin')

// 角色定义 + 权限映射
const roles = [
  { key: 'admin', label: '系统管理员', icon: '👑', groups: ['dispatch', 'task', 'gate', 'analysis'] },
  { key: 'dispatcher', label: '调度员', icon: '🎧', groups: ['dispatch'] },
  { key: 'driver', label: '司机', icon: '🚛', groups: ['task'] },
  { key: 'gate', label: '门岗管理员', icon: '🛂', groups: ['gate'] },
  { key: 'manager', label: '管理人员', icon: '📊', groups: ['analysis'] },
]

const ALL_NAV_GROUPS = [
  {
    groupKey: 'dispatch',
    label: '调度指挥',
    items: [
      { key: 'dispatchMap', stage: 'P0', label: '地图监控', icon: '🗺️' },
      { key: 'vehicleFilter', stage: 'P1', label: '车辆筛选', icon: '🔍' },
      { key: 'dispatchDialog', stage: 'P1', label: '现场派车', icon: '📋' },
      { key: 'exceptionAlert', stage: 'P1', label: '异常告警', icon: '🚨' },
    ],
  },
  {
    groupKey: 'task',
    label: '任务执行',
    items: [
      { key: 'taskList', stage: 'P0', label: '任务列表', icon: '📝' },
      { key: 'taskDetail', stage: 'P1', label: '任务详情', icon: '📄' },
      { key: 'navigation', stage: 'P1', label: '导航', icon: '🧭' },
      { key: 'siteFeedback', stage: 'P1', label: '现场反馈', icon: '📷' },
    ],
  },
  {
    groupKey: 'gate',
    label: '门岗管理',
    items: [
      { key: 'entryCheck', stage: 'P1', label: '入场核验', icon: '🛂' },
      { key: 'releaseMgmt', stage: 'P1', label: '放行管理', icon: '🚦' },
      { key: 'alertPanel', stage: 'P1', label: '门岗告警', icon: '🔔' },
      { key: 'releaseRecord', stage: 'P1', label: '放行记录', icon: '📊' },
    ],
  },
  {
    groupKey: 'analysis',
    label: '管理分析',
    items: [
      { key: 'statistics', stage: 'P1', label: '统计分析', icon: '📈' },
      { key: 'reportExport', stage: 'P1', label: '报告导出', icon: '📤' },
      { key: 'resourceAlloc', stage: 'P1', label: '资源配置', icon: '⚙️' },
    ],
  },
]

const currentRole = computed(() => roles.find(r => r.key === activeRole.value))
const allowedGroups = computed(() => currentRole.value?.groups || [])

const visibleNavGroups = computed(() =>
  ALL_NAV_GROUPS.filter(g => allowedGroups.value.includes(g.groupKey))
)

const allVisibleKeys = computed(() =>
  visibleNavGroups.value.flatMap(g => g.items.map(i => i.key))
)

function onRoleChange() {
  // 切换角色后，若当前页面不在新角色权限内，跳转到第一个可见页面
  if (!allVisibleKeys.value.includes(activePage.value)) {
    const firstKey = visibleNavGroups.value[0]?.items[0]?.key
    if (firstKey) activePage.value = firstKey
  }
}

const currentPageLabel = computed(() => {
  for (const g of ALL_NAV_GROUPS) {
    const item = g.items.find(i => i.key === activePage.value)
    if (item) return item.label
  }
  return '未知页面'
})
</script>

<style>
/* 全局重置 */
*{box-sizing:border-box}body{margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,sans-serif;background:#f4f7fb;color:#172033;-webkit-font-smoothing:antialiased}
button,input,select,textarea{font:inherit}button{cursor:pointer}

/* 布局 */
.app-layout{display:flex;min-height:100vh}

/* ===== 左侧深色导航 ===== */
.sidebar{
  width:240px;min-width:240px;background:#0f172a;color:#e2e8f0;
  display:flex;flex-direction:column;position:sticky;top:0;height:100vh;
  overflow-y:auto;z-index:10;
  border-right:1px solid #1e293b;
}

.sidebar-brand{
  display:flex;align-items:center;gap:10px;
  padding:20px 18px;border-bottom:1px solid #1e293b;
}
.brand-icon{font-size:26px;line-height:1}
.brand-title{display:block;font-size:15px;font-weight:800;color:#f1f5f9}
.brand-sub{display:block;font-size:10px;color:#64748b;margin-top:2px}

/* 角色切换器 */
.role-switcher{padding:12px 18px;border-bottom:1px solid #1e293b}
.role-label{display:block;font-size:9px;color:#475569;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px}
.role-switcher select{
  width:100%;padding:7px 10px;border:1px solid #334155;border-radius:6px;
  background:#1e293b;color:#e2e8f0;font-size:12px;font-weight:600;outline:none;cursor:pointer
}
.role-switcher select:focus{border-color:#3b82f6}

.sidebar-nav{flex:1;padding:8px 0;overflow-y:auto}
.nav-group{margin-bottom:4px}
.nav-group-label{
  display:block;padding:8px 18px 4px;
  font-size:10px;font-weight:800;color:#475569;
  text-transform:uppercase;letter-spacing:1px;
}

.nav-group button{
  display:flex;align-items:center;gap:10px;
  width:100%;padding:9px 18px;border:none;
  background:transparent;color:#94a3b8;
  font-size:13px;font-weight:600;text-align:left;
  transition:all 0.12s;position:relative;
}
.nav-group button:hover{background:rgba(255,255,255,0.05);color:#e2e8f0}
.nav-group button.active{
  background:rgba(37,99,235,0.2);color:#ffffff;
}
.nav-group button.active::before{
  content:'';position:absolute;left:0;top:8px;bottom:8px;
  width:3px;background:#3b82f6;border-radius:0 3px 3px 0;
}

.nav-icon{font-size:15px;width:20px;text-align:center;flex-shrink:0}
.nav-text{flex:1}
.nav-badge{
  font-size:9px;padding:1px 6px;border-radius:8px;
  background:rgba(255,255,255,0.08);color:#64748b;font-weight:800;
}
.nav-group button.active .nav-badge{background:rgba(59,130,246,0.3);color:#93c5fd}

.sidebar-footer{padding:14px 18px;border-top:1px solid #1e293b}
.sidebar-footer small{font-size:10px;color:#475569}

/* ===== 右侧主内容 ===== */
.main-content{
  flex:1;min-width:0;padding:24px 32px 56px;
  max-width:calc(100vw - 240px);
}

.placeholder-page{
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  min-height:400px;text-align:center;color:#94a3b8;
}
.ph-icon{font-size:48px;margin-bottom:8px}
.placeholder-page h3{color:#0f172a;margin:0 0 4px}

/* 移动端响应式 */
@media(max-width:768px){
  .sidebar{width:200px;min-width:200px}
  .main-content{padding:16px 14px 40px;max-width:calc(100vw - 200px)}
}
@media(max-width:560px){
  .sidebar{width:56px;min-width:56px}
  .sidebar-brand{padding:14px 10px;justify-content:center}
  .brand-title,.brand-sub{display:none}
  .brand-icon{font-size:22px}
  .nav-group-label{display:none}
  .nav-group button{padding:10px;justify-content:center}
  .nav-text,.nav-badge{display:none}
  .nav-icon{font-size:18px;width:auto}
  .sidebar-footer{display:none}
  .main-content{padding:12px 10px 40px;max-width:calc(100vw - 56px)}
}
</style>
