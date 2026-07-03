<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="brand">
        <span class="brand-mark">HG</span>
        <div>
          <strong>车辆管理原型</strong>
          <small>调度、司机、门岗、报表一体化</small>
        </div>
      </div>

      <label class="role-picker">
        <span>当前角色</span>
        <select v-model="activeRole" @change="ensureVisiblePage">
          <option value="dispatcher">调度员</option>
          <option value="driver">司机</option>
          <option value="gate">门岗人员</option>
          <option value="manager">管理人员</option>
          <option value="all">系统管理员</option>
        </select>
      </label>

      <nav class="nav-list">
        <button
          v-for="item in visibleNav"
          :key="item.key"
          type="button"
          :class="{ active: activePage === item.key }"
          @click="activePage = item.key"
        >
          <span>{{ item.group }}</span>
          <strong>{{ item.title }}</strong>
        </button>
      </nav>
    </aside>

    <main class="main-content">
      <VehicleDispatchView v-if="activePage === 'dispatch'" />
      <DriverTaskView v-else-if="activePage === 'driver'" />
      <GateCheckView v-else-if="activePage === 'gate'" />
      <ManagerReportsView v-else />
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import VehicleDispatchView from './views/VehicleDispatchView.vue'
import DriverTaskView from './views/DriverTaskView.vue'
import GateCheckView from './views/GateCheckView.vue'
import ManagerReportsView from './views/ManagerReportsView.vue'

const activeRole = ref('dispatcher')
const activePage = ref('dispatch')

const nav = [
  { key: 'dispatch', group: '调度指挥', title: '车辆调度看板', roles: ['dispatcher', 'all'] },
  { key: 'driver', group: '任务执行', title: '司机任务管理', roles: ['driver', 'all'] },
  { key: 'gate', group: '场地管理', title: '门岗核验', roles: ['gate', 'all'] },
  { key: 'reports', group: '报表分析', title: '综合报表', roles: ['manager', 'all'] },
]

const visibleNav = computed(() => nav.filter((item) => item.roles.includes(activeRole.value)))

function ensureVisiblePage() {
  if (!visibleNav.value.some((item) => item.key === activePage.value)) {
    activePage.value = visibleNav.value[0]?.key || 'dispatch'
  }
}
</script>
