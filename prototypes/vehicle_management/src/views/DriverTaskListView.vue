<template>
  <div class="driver-task-list">
    <div v-if="loading" class="loading-state">
      <div class="skeleton sk-card" v-for="n in 3" :key="n"></div>
    </div>
    <div v-else-if="error" class="error-state"><span>⚠️</span><p>{{ error }}</p><button @click="loadData">重试</button></div>
    <template v-else>
      <!-- 状态筛选栏 -->
      <div class="status-filter-bar">
        <button v-for="s in statusFilters" :key="s.key" :class="{ active: currentFilter === s.key }" @click="currentFilter = s.key">
          {{ s.label }}
          <span v-if="s.key" class="count-badge">{{ tasks.filter(t => t.taskStatus === s.key).length }}</span>
        </button>
      </div>

      <!-- 任务卡片列表 -->
      <div v-if="filteredTasks.length === 0" class="empty-hint">
        <span>📭</span><p>暂无任务</p>
      </div>
      <div v-else class="task-cards">
        <div v-for="t in filteredTasks" :key="t.taskId" class="task-card" @click="openDetail(t)">
          <div class="tc-header">
            <StatusTag :status="t.taskStatus" />
            <span class="task-id">{{ t.taskId }}</span>
          </div>
          <h4>{{ t.taskTitle }}</h4>
          <div class="tc-meta">
            <span>🚛 {{ t.plate }}</span>
            <span>📍 {{ t.departure }} → {{ t.destination }}</span>
            <span>🕐 {{ t.estimatedTime }}</span>
          </div>
          <div class="tc-actions" v-if="t.taskStatus === '待接单'" @click.stop>
            <button class="accept-btn" @click="acceptTask(t)">确认接单</button>
          </div>
        </div>
      </div>
    </template>

    <ConfirmDialog :visible="showAcceptConfirm" title="确认接单" :content="'确定接受任务 ' + (acceptingTask?.taskId || '') + '？'" @confirm="doAccept" @cancel="showAcceptConfirm = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useRouter } from '../routerShim.js'
import { fetchTaskData } from '../data/mockTasks.js'
import StatusTag from '../components/StatusTag.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const router = useRouter()
const loading = ref(true)
const error = ref('')
const tasks = ref([])
const currentFilter = ref('')
const showAcceptConfirm = ref(false)
const acceptingTask = ref(null)

const statusFilters = [
  { key: '', label: '全部' },
  { key: '待接单', label: '待接单' },
  { key: '进行中', label: '进行中' },
  { key: '已完成', label: '已完成' },
]

const filteredTasks = computed(() => {
  if (!currentFilter.value) return tasks.value
  return tasks.value.filter(t => t.taskStatus === currentFilter.value)
})

async function loadData() {
  loading.value = true; error.value = ''
  try {
    const data = await fetchTaskData()
    tasks.value = data.tasks || []
  } catch (e) {
    error.value = '网络异常，请重试'
  } finally { loading.value = false }
}

function openDetail(t) {
  router.push({ path: '/task/execute', query: { taskId: t.taskId } })
}

function acceptTask(t) {
  acceptingTask.value = t
  showAcceptConfirm.value = true
}

function doAccept() {
  if (acceptingTask.value) {
    const idx = tasks.value.findIndex(t => t.taskId === acceptingTask.value.taskId)
    if (idx >= 0) tasks.value[idx] = { ...tasks.value[idx], taskStatus: '进行中' }
  }
  showAcceptConfirm.value = false
  acceptingTask.value = null
}

onMounted(loadData)
</script>

<style scoped>
.driver-task-list { padding: 16px; height: 100%; overflow-y: auto; }
.status-filter-bar { display: flex; gap: 8px; margin-bottom: 16px; }
.status-filter-bar button { padding: 8px 16px; border: 1px solid #cbd5e1; border-radius: 8px; background: #fff; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px; }
.status-filter-bar button.active { background: #1a56db; color: #fff; border-color: #1a56db; }
.count-badge { background: rgba(0,0,0,.1); padding: 1px 6px; border-radius: 10px; font-size: 11px; }
.task-cards { display: grid; gap: 12px; }
.task-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; cursor: pointer; transition: box-shadow .2s; }
.task-card:hover { box-shadow: 0 4px 15px rgba(0,0,0,.08); }
.tc-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.task-id { font-size: 11px; color: #94a3b8; }
.task-card h4 { margin: 0 0 8px; font-size: 14px; }
.tc-meta { display: flex; flex-wrap: wrap; gap: 12px; font-size: 12px; color: #64748b; }
.tc-actions { margin-top: 12px; }
.accept-btn { padding: 6px 16px; background: #1a56db; color: #fff; border: none; border-radius: 7px; font-size: 13px; font-weight: 700; cursor: pointer; }
.loading-state { display: grid; gap: 12px; padding: 20px; }
.sk-card { height: 120px; background: #e2e8f0; border-radius: 12px; animation: shimmer 1.5s infinite; }
@keyframes shimmer { 0% { opacity: .5; } 50% { opacity: 1; } 100% { opacity: .5; } }
.error-state { padding: 40px; text-align: center; color: #c62828; }
.error-state button { margin-top: 12px; padding: 8px 20px; background: #c62828; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
.empty-hint { text-align: center; padding: 40px; color: #94a3b8; }
.empty-hint span { font-size: 32px; display: block; margin-bottom: 8px; }
</style>
