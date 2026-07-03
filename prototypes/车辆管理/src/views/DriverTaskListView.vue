<template>
  <div class="driver-task-list">
    <!-- 非司机角色提示 -->
    <div v-if="currentRoleKey !== 'driver'" class="role-notice">
      <p>当前角色“{{ currentRole }}”无权查看此页面，请切换至司机角色。</p>
    </div>

    <template v-else>
      <!-- 顶部状态筛选栏 -->
      <div class="filter-bar">
        <span
          v-for="tab in filterTabs"
          :key="tab.key"
          class="filter-tab"
          :class="{ active: currentFilter === tab.key }"
          @click="handleFilterChange(tab.key)"
        >
          {{ tab.label }}
        </span>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="skeleton" v-for="i in 3" :key="i"></div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button class="retry-btn" @click="loadTasks">重试</button>
      </div>

      <!-- 空状态 -->
      <div v-else-if="filteredTasks.length === 0" class="empty-state">
        <p>暂无任务</p>
      </div>

      <!-- 成功状态：任务卡片列表 -->
      <div v-else class="task-list">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="task-card"
          @click="handleCardClick(task)"
        >
          <div class="card-header">
            <span class="task-title">{{ task.title }}</span>
            <StatusTag :status="task.status" :text="statusMap[task.status]" size="small" />
          </div>
          <div class="card-info">
            <span>车牌：{{ task.licensePlate }}</span>
            <span>作业点：{{ task.workSite }}</span>
            <span>预计时间：{{ task.estimatedTime }}</span>
          </div>
          <div v-if="task.status === 'pending'" class="card-actions">
            <button class="accept-btn" @click.stop="handleConfirmAccept(task.id)">确认接单</button>
          </div>
        </div>
      </div>

      <!-- 任务详情弹窗 (模拟) -->
      <div v-if="selectedTask" class="detail-overlay" @click.self="selectedTask = null">
        <div class="detail-panel">
          <h3>{{ selectedTask.title }}</h3>
          <p><strong>任务ID：</strong>{{ selectedTask.id }}</p>
          <p><strong>车牌号：</strong>{{ selectedTask.licensePlate }}</p>
          <p><strong>出发地：</strong>{{ selectedTask.departure }}</p>
          <p><strong>目的地：</strong>{{ selectedTask.destination }}</p>
          <p><strong>作业点：</strong>{{ selectedTask.workSite }}</p>
          <p><strong>预计时间：</strong>{{ selectedTask.estimatedTime }}</p>
          <p><strong>状态：</strong>{{ statusMap[selectedTask.status] }}</p>
          <button class="close-btn" @click="selectedTask = null">关闭</button>
        </div>
      </div>

      <!-- 确认接单对话框 -->
      <ConfirmDialog
        :visible="showConfirm"
        title="确认接单"
        content="确定接受该任务吗？"
        confirm-text="确定"
        cancel-text="取消"
        @update:visible="showConfirm = $event"
        @confirm="onAccept"
        @cancel="onCancel"
      />
    </template>
  </div>
</template>

<script setup>
import { inject, ref, reactive, computed, onMounted } from 'vue'
import { prototypeContract } from '../prototypeContract.js'
import { fetchTasksData } from '../data/mockTasks.js'
import StatusTag from '../components/StatusTag.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

// 注入上下文
const context = inject('prototypeContext', {
  currentRole: '司机',
  currentRoleKey: 'driver'
})
const { currentRole, currentRoleKey } = context

// 状态映射
const statusMap = reactive({
  pending: '待接单',
  inProgress: '进行中',
  completed: '已完成'
})

// 筛选标签
const filterTabs = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待接单' },
  { key: 'inProgress', label: '进行中' },
  { key: 'completed', label: '已完成' }
]

// 根据角色设置默认筛选
const defaultFilter = currentRoleKey === 'driver' ? 'pending' : 'all'
const currentFilter = ref(defaultFilter)

// 数据状态
const tasks = ref([])
const loading = ref(false)
const error = ref(null)
const selectedTask = ref(null)
const showConfirm = ref(false)
const confirmTaskId = ref(null)

// 计算过滤后的任务
const filteredTasks = computed(() => {
  if (currentFilter.value === 'all') return tasks.value
  return tasks.value.filter(t => t.status === currentFilter.value)
})

// 加载任务数据
async function loadTasks() {
  loading.value = true
  error.value = null
  try {
    const data = await fetchTasksData()
    // 假设返回的是数组，若无则设为空数组
    tasks.value = Array.isArray(data) ? data : []
  } catch (e) {
    error.value = '网络异常，请重试'
  } finally {
    loading.value = false
  }
}

onMounted(loadTasks)

// 切换筛选
function handleFilterChange(filter) {
  currentFilter.value = filter
}

// 点击卡片查看详情
function handleCardClick(task) {
  selectedTask.value = task
}

// 弹出确认接单对话框
function handleConfirmAccept(taskId) {
  confirmTaskId.value = taskId
  showConfirm.value = true
}

// 确认接单
function onAccept() {
  const task = tasks.value.find(t => t.id === confirmTaskId.value)
  if (task) {
    task.status = 'inProgress'
  }
  showConfirm.value = false
  confirmTaskId.value = null
}

// 取消接单
function onCancel() {
  showConfirm.value = false
  confirmTaskId.value = null
}
</script>

<style scoped>
.driver-task-list {
  max-width: 480px;
  margin: 0 auto;
  padding: 16px;
  font-family: sans-serif;
}

.role-notice {
  color: #856404;
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
}

.filter-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.filter-tab {
  padding: 6px 14px;
  border-radius: 20px;
  background-color: #f0f0f0;
  color: #333;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  transition: background-color 0.2s;
}

.filter-tab.active {
  background-color: #409eff;
  color: #fff;
}

.filter-tab:hover:not(.active) {
  background-color: #e0e0e0;
}

.loading-state .skeleton {
  height: 80px;
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
  margin-bottom: 12px;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.error-state,
.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

.retry-btn {
  margin-top: 12px;
  padding: 8px 20px;
  background-color: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.task-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.task-title {
  font-weight: 600;
  font-size: 16px;
}

.card-info {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  font-size: 13px;
  color: #666;
}

.card-actions {
  margin-top: 10px;
}

.accept-btn {
  padding: 6px 16px;
  background-color: #67c23a;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.accept-btn:hover {
  background-color: #5daf34;
}

.detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.detail-panel {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}

.detail-panel h3 {
  margin-top: 0;
}

.detail-panel p {
  margin: 8px 0;
  font-size: 14px;
}

.close-btn {
  margin-top: 16px;
  padding: 8px 20px;
  background-color: #909399;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  float: right;
}
</style>