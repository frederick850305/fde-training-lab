<template>
  <section class="task-list-view" aria-labelledby="task-list-title">
    <ViewHeading
      eyebrow="P0 Prototype Page · 司机端"
      title="任务列表"
      title-id="task-list-title"
      description="查看个人任务列表，接收新任务通知，筛选和查看不同状态的任务。"
    />

    <!-- 新任务通知横幅 -->
    <transition name="slide-down">
      <div v-if="visibleNotifications.length" class="notification-banner">
        <span class="notif-icon">🔔</span>
        <span class="notif-text">您有 <strong>{{ visibleNotifications.length }}</strong> 条新任务</span>
        <button type="button" class="notif-dismiss" @click="dismissAllNotifications">✕</button>
      </div>
    </transition>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <div class="status-tabs">
        <button
          v-for="tab in statusTabs"
          :key="tab.key"
          type="button"
          :class="{ active: activeStatus === tab.key }"
          @click="activeStatus = tab.key"
        >
          {{ tab.label }}
          <span v-if="tab.key !== 'all'" class="tab-count">{{ statusCounts[tab.key] || 0 }}</span>
        </button>
      </div>
      <div class="filter-right">
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="搜索任务编号、目的地…"
        />
        <select v-model="sortBy" class="sort-select">
          <option value="deadline">按截止时间</option>
          <option value="createdAt">按创建时间</option>
          <option value="priority">按优先级</option>
        </select>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="listState === 'loading'" class="state-box">
      <div class="skeleton-list">
        <div v-for="n in 4" :key="n" class="skeleton-card">
          <div class="sk-line w-60"></div>
          <div class="sk-line w-80"></div>
          <div class="sk-line w-40"></div>
        </div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="listState === 'error'" class="state-box error-box">
      <span class="state-icon">⚠️</span>
      <p>任务数据加载失败</p>
      <button type="button" class="retry-btn" @click="retryLoad">重试</button>
    </div>

    <!-- 空状态 -->
    <div v-else-if="filteredTasks.length === 0" class="state-box">
      <span class="state-icon">📋</span>
      <p>{{ activeStatus === 'all' ? '暂无任务' : `没有「${currentStatusLabel}」的任务` }}</p>
      <button v-if="activeStatus !== 'all'" type="button" class="text-btn" @click="activeStatus = 'all'">查看全部任务</button>
    </div>

    <!-- 任务卡片列表 -->
    <div v-else class="task-cards">
      <article
        v-for="task in filteredTasks"
        :key="task.id"
        class="task-card"
        :class="[
          'status-' + task.status,
          { 'is-updated': task.updated },
        ]"
        @click="selectTask(task)"
      >
        <div class="task-card-left">
          <span class="task-priority" :class="'priority-' + task.priority">
            {{ taskPriorityMap[task.priority].label }}
          </span>
          <div class="task-info">
            <h4>{{ task.type }} · {{ task.id }}</h4>
            <p class="task-dest">📍 {{ task.destination }}</p>
            <div class="task-meta">
              <span>🚛 {{ task.vehiclePlate }}</span>
              <span>👤 {{ task.driver }}</span>
            </div>
          </div>
        </div>
        <div class="task-card-right">
          <span class="task-status-tag" :class="'status-' + task.status">
            {{ taskStatusMap[task.status].label }}
          </span>
          <span class="task-time">⏰ {{ task.deadline }}</span>
          <span v-if="task.updated" class="update-badge">已更新</span>
        </div>
      </article>
    </div>

    <!-- 下拉刷新提示 -->
    <p v-if="filteredTasks.length > 0" class="pull-hint">↓ 下拉刷新</p>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import ViewHeading from '../components/ViewHeading.vue'
import {
  newTaskNotifications,
  taskPriorityMap,
  tasks,
  taskStatusMap,
} from '../data/taskListMock'

const activeStatus = ref('all')
const searchQuery = ref('')
const sortBy = ref('deadline')
const listState = ref('loading')
const notifications = ref([...newTaskNotifications])

const statusTabs = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待执行' },
  { key: 'inProgress', label: '进行中' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' },
]

const currentStatusLabel = computed(() => {
  const tab = statusTabs.find((t) => t.key === activeStatus.value)
  return tab ? tab.label : ''
})

const visibleNotifications = computed(() => notifications.value)

const statusCounts = computed(() => {
  const counts = { pending: 0, inProgress: 0, completed: 0, cancelled: 0 }
  tasks.forEach((t) => { if (counts[t.status] !== undefined) counts[t.status]++ })
  return counts
})

const priorityOrder = { high: 0, medium: 1, low: 2 }

const filteredTasks = computed(() => {
  let result = [...tasks]

  if (activeStatus.value !== 'all') {
    result = result.filter((t) => t.status === activeStatus.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q) ||
        t.type.toLowerCase().includes(q) ||
        t.vehiclePlate.toLowerCase().includes(q),
    )
  }

  if (sortBy.value === 'deadline') {
    result.sort((a, b) => a.deadline.localeCompare(b.deadline))
  } else if (sortBy.value === 'createdAt') {
    result.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  } else if (sortBy.value === 'priority') {
    result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  }

  return result
})

function selectTask(task) {
  alert(`任务详情：${task.id}\n${task.type}\n目的地：${task.destination}\n司机：${task.driver}\n截止：${task.deadline}`)
}

function dismissAllNotifications() {
  notifications.value = []
}

function retryLoad() {
  listState.value = 'loading'
  setTimeout(() => { listState.value = 'success' }, 600)
}

onMounted(() => {
  setTimeout(() => {
    listState.value = tasks.length > 0 ? 'success' : 'empty'
  }, 500)
})
</script>

<style scoped>
.task-list-view { margin-top: 16px; }

.notification-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  margin-bottom: 14px;
  border-radius: 8px;
  background: linear-gradient(135deg, #dbeafe, #eff6ff);
  border: 1px solid #93c5fd;
}
.notif-icon { font-size: 18px; }
.notif-text { flex: 1; font-size: 13px; color: #1e40af; font-weight: 600; }
.notif-text strong { color: #1d4ed8; font-weight: 900; }
.notif-dismiss { border: none; background: transparent; color: #94a3b8; font-size: 16px; cursor: pointer; padding: 2px 6px; }

.filter-bar {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; margin-bottom: 14px; flex-wrap: wrap;
}
.status-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.status-tabs button {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px; border: 1px solid #e2e8f0; border-radius: 20px;
  background: #ffffff; color: #475569; font-size: 13px; font-weight: 700;
  cursor: pointer; transition: all 0.15s;
}
.status-tabs button:hover { border-color: #93c5fd; background: #eff6ff; }
.status-tabs button.active { border-color: #1d4ed8; background: #1d4ed8; color: #ffffff; }
.tab-count {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 22px; height: 18px; border-radius: 9px; font-size: 10px; font-weight: 900;
}
.status-tabs button:not(.active) .tab-count { background: #f1f5f9; color: #64748b; }
.status-tabs button.active .tab-count { background: rgba(255,255,255,0.2); color: #ffffff; }

.filter-right { display: flex; gap: 8px; }
.search-input {
  padding: 7px 12px; border: 1px solid #e2e8f0; border-radius: 8px;
  font-size: 13px; color: #0f172a; width: 200px; outline: none;
}
.search-input:focus { border-color: #93c5fd; }
.search-input::placeholder { color: #94a3b8; }
.sort-select {
  padding: 7px 10px; border: 1px solid #e2e8f0; border-radius: 8px;
  font-size: 13px; color: #475569; background: #ffffff; cursor: pointer; outline: none;
}

.state-box {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 260px; border: 1px solid #e2e8f0; border-radius: 10px;
  background: #ffffff; text-align: center; padding: 32px;
}
.state-icon { font-size: 48px; }
.state-box p { margin: 8px 0 12px; color: #64748b; font-size: 14px; }
.error-box p { color: #dc2626; }
.text-btn { border: none; background: transparent; color: #2563eb; font-weight: 700; font-size: 13px; cursor: pointer; }
.retry-btn { padding: 6px 16px; border: 1px solid #2563eb; border-radius: 6px; background: #ffffff; color: #2563eb; font-weight: 700; cursor: pointer; }

.skeleton-list { display: grid; gap: 12px; width: 100%; }
.skeleton-card { padding: 16px; border-radius: 8px; background: #f8fafc; display: grid; gap: 8px; }
.sk-line {
  height: 14px; border-radius: 4px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%; animation: shimmer 1.5s infinite;
}
.w-60 { width: 60%; } .w-80 { width: 80%; } .w-40 { width: 40%; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

.task-cards { display: grid; gap: 10px; }
.task-card {
  display: flex; align-items: center; justify-content: space-between;
  gap: 14px; padding: 14px 18px; border: 1px solid #e2e8f0;
  border-left: 4px solid #e2e8f0; border-radius: 8px;
  background: #ffffff; cursor: pointer; transition: all 0.15s;
}
.task-card:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.06); transform: translateY(-1px); }
.task-card.status-pending { border-left-color: #d97706; }
.task-card.status-inProgress { border-left-color: #2563eb; }
.task-card.status-completed { border-left-color: #16a34a; opacity: 0.65; }
.task-card.status-cancelled { border-left-color: #94a3b8; opacity: 0.5; }
.task-card.is-updated { background: #fffbeb; }

.task-card-left { display: flex; align-items: flex-start; gap: 12px; flex: 1; min-width: 0; }
.task-priority {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 24px; height: 24px; border-radius: 4px; font-size: 10px;
  font-weight: 900; flex-shrink: 0; margin-top: 2px;
}
.task-priority.priority-high { background: #fee2e2; color: #dc2626; }
.task-priority.priority-medium { background: #fef3c7; color: #d97706; }
.task-priority.priority-low { background: #dcfce7; color: #16a34a; }
.task-info { min-width: 0; }
.task-info h4 { margin: 0 0 4px; color: #0f172a; font-size: 14px; }
.task-dest {
  margin: 0 0 6px; color: #475569; font-size: 13px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.task-meta { display: flex; gap: 12px; }
.task-meta span { font-size: 12px; color: #94a3b8; }

.task-card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
.task-status-tag { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 900; }
.task-status-tag.status-pending { background: #fef3c7; color: #d97706; }
.task-status-tag.status-inProgress { background: #dbeafe; color: #2563eb; }
.task-status-tag.status-completed { background: #dcfce7; color: #16a34a; }
.task-status-tag.status-cancelled { background: #f1f5f9; color: #94a3b8; }
.task-time { font-size: 11px; color: #94a3b8; }
.update-badge {
  display: inline-block; padding: 1px 6px; border-radius: 4px;
  background: #fef3c7; color: #d97706; font-size: 10px; font-weight: 800;
}
.pull-hint { text-align: center; margin-top: 12px; color: #cbd5e1; font-size: 12px; }

.slide-down-enter-active, .slide-down-leave-active { transition: all 0.3s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-20px); }

@media (max-width: 680px) {
  .filter-bar { flex-direction: column; align-items: stretch; }
  .filter-right { flex-direction: column; }
  .search-input { width: 100%; }
  .task-card { flex-direction: column; align-items: flex-start; }
  .task-card-right { flex-direction: row; align-items: center; gap: 8px; width: 100%; }
}
</style>
