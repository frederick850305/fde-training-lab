<template>
  <main class="app-shell">
    <!-- 顶部标题栏 -->
    <header class="proto-header">
      <div class="proto-brand">
        <span class="brand-mark">🏭</span>
        <div>
          <span class="brand-name">海工生产调度原型</span>
          <small>由 FDE Prototype Factory 生成 · 独立可运行</small>
        </div>
      </div>
    </header>

    <!-- 导航栏 -->
    <nav class="proto-nav" aria-label="原型页面导航">
      <button
        v-for="item in navItems"
        :key="item.key"
        type="button"
        :class="{ active: item.key === activePage }"
        @click="activePage = item.key"
      >
        <span class="nav-stage">{{ item.stage }}</span>
        {{ item.label }}
      </button>
    </nav>

    <!-- 页面内容区 -->
    <DispatchMapView
      v-if="activePage === 'dispatchMap'"
      key="dispatchMap"
    />
    <TaskListView
      v-else-if="activePage === 'taskList'"
      key="taskList"
    />
    <section v-else class="placeholder-page">
      <div class="placeholder-content">
        <span class="placeholder-icon">🚧</span>
        <h3>{{ currentPageLabel }}</h3>
        <p>该页面正在开发中，即将上线。</p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import DispatchMapView from './views/DispatchMapView.vue'
import TaskListView from './views/TaskListView.vue'

const activePage = ref('dispatchMap')

const navItems = [
  { key: 'dispatchMap', stage: 'P0', label: '地图监控' },
  { key: 'taskList', stage: 'P0', label: '任务列表' },
  { key: 'vehicleFilter', stage: 'P1', label: '车辆筛选' },
  { key: 'dispatchDialog', stage: 'P1', label: '现场派车' },
  { key: 'exceptionAlert', stage: 'P1', label: '异常告警' },
  { key: 'entryCheck', stage: 'P1', label: '入场核验' },
  { key: 'statistics', stage: 'P1', label: '统计分析' },
]

const currentPageLabel = computed(() => {
  const item = navItems.find((n) => n.key === activePage.value)
  return item ? item.label : '未知页面'
})
</script>

<style scoped>
.app-shell {
  width: min(1200px, calc(100% - 40px));
  margin: 0 auto;
  padding: 24px 0 56px;
}

/* 顶部标题栏 */
.proto-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.proto-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  font-size: 32px;
  line-height: 1;
}

.brand-name {
  display: block;
  color: #0f172a;
  font-size: 20px;
  font-weight: 900;
}

.proto-brand small {
  display: block;
  color: #94a3b8;
  font-size: 12px;
  margin-top: 2px;
}

/* 导航 */
.proto-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
}

.proto-nav button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  color: #334155;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}

.proto-nav button:hover {
  border-color: #93c5fd;
  background: #eff6ff;
}

.proto-nav button.active {
  border-color: #1d4ed8;
  background: #1d4ed8;
  color: #ffffff;
}

.nav-stage {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 20px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.5px;
}

.proto-nav button:not(.active) .nav-stage {
  background: #f1f5f9;
  color: #64748b;
}

.proto-nav button.active .nav-stage {
  background: rgba(255,255,255,0.25);
  color: #ffffff;
}

/* 占位页面 */
.placeholder-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
}

.placeholder-content {
  text-align: center;
}

.placeholder-icon {
  font-size: 48px;
}

.placeholder-content h3 {
  margin: 12px 0 6px;
  color: #0f172a;
  font-size: 18px;
}

.placeholder-content p {
  color: #94a3b8;
  font-size: 14px;
}
</style>
