<template>
  <div class="driver-task-list-view">
    <!-- 顶部状态筛选栏 -->
    <div class="filter-bar">
      <span
        v-for="tab in filterTabs"
        :key="tab.value"
        :class="['filter-tag', { active: currentFilter === tab.value }]"
        @click="switchFilter(tab.value)"
      >
        {{ tab.label }}
      </span>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 加载状态 -->
      <div v-if="loading" class="state-container">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="state-container">
        <p class="error-text">网络异常，请重试</p>
        <button class="retry-btn" @click="fetchTasks">重试</button>
      </div>

      <!-- 空状态 -->
      <div v-else-if="filteredTasks.length === 0" class="state-container">
        <img src="@/assets/empty.svg" alt="暂无任务" class="empty-img" />
        <p>暂无任务</p>
      </div>

      <!-- 任务卡片列表 -->
      <div v-else class="task-list">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="task-card"
          @click="goToDetail(task.id)"
        >
          <div class="task-header">
            <span class="task-id">任务ID: {{ task.id }}</span>
            <StatusTag
              :status="task.status"
              :text="statusTextMap[task.status]"
              size="small"
            />
          </div>
          <div class="task-body">
            <p>作业点: {{ task.workPoint }}</p>
            <p>预计时间: {{ task.estimatedTime }}</p>
            <p>车牌: {{ task.plate }}</p>
          </div>
          <div v-if="task.status === 'pending'" class="task-action">
            <button class="accept-btn" @click.stop="confirmAccept(task)">确认接单</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 确认接单对话框 -->
    <ConfirmDialog
      :visible="showConfirm"
      title="确认接单"
      content="确认接受该任务？"
      confirmText="确认"
      cancelText="取消"
      :loading="accepting"
      @confirm="handleAccept"
      @cancel="showConfirm = false"
    />

    <!-- 底部导航栏 -->
    <div class="bottom-nav">
      <button class="nav-btn" @click="goBackToWorkbench">回到工作台</button>
      <!-- 未读推送通知角标 -->
      <div class="notification-badge">
        <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StatusTag from '@/components/StatusTag.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { tasks as mockTasks } from '@/data/mockTasks'

const router = useRouter()

// 筛选标签
const filterTabs = [
  { label: '全部', value: 'all' },
  { label: '待接单', value: 'pending' },
  { label: '进行中', value: 'inProgress' },
  { label: '已完成', value: 'completed' }
]

const currentFilter = ref('all')
const loading = ref(false)
const error = ref(false)
const tasks = ref([])
const showConfirm = ref(false)
const accepting = ref(false)
const selectedTask = ref(null)
const unreadCount = ref(3) // 模拟未读数

// 状态文本映射
const statusTextMap = {
  pending: '待接单',
  inProgress: '进行中',
  completed: '已完成'
}

// 根据筛选过滤任务
const filteredTasks = computed(() => {
  if (currentFilter.value === 'all') {
    return tasks.value
  }
  return tasks.value.filter(t => t.status === currentFilter.value)
})

// 模拟获取任务列表
const fetchTasks = async () => {
  loading.value = true
  error.value = false
  try {
    // 模拟异步延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    // 使用 mock 数据，假设返回数组合适
    tasks.value = mockTasks.map(t => ({
      id: t.id,
      workPoint: t.workPoint,
      estimatedTime: t.estimatedTime,
      plate: t.plate,
      status: t.status
    }))
  } catch (e) {
    error.value = true
  } finally {
    loading.value = false
  }
}

const switchFilter = (value) => {
  currentFilter.value = value
  // 不重新请求，只切换过滤；原型可按需
}

const confirmAccept = (task) => {
  selectedTask.value = task
  showConfirm.value = true
}

const handleAccept = async () => {
  if (!selectedTask.value) return
  accepting.value = true
  try {
    // 模拟接单请求
    await new Promise(resolve => setTimeout(resolve, 300))
    // 更新本地任务状态
    const task = tasks.value.find(t => t.id === selectedTask.value.id)
    if (task) {
      task.status = 'inProgress'
    }
    showConfirm.value = false
  } catch (e) {
    // 处理失败，原型中简单提示
    alert('接单失败，请重试')
  } finally {
    accepting.value = false
  }
}

const goToDetail = (taskId) => {
  router.push({ name: 'DriverTaskExecuteView', params: { taskId } })
}

const goBackToWorkbench = () => {
  router.push({ name: 'WorkbenchView' })
}

onMounted(() => {
  fetchTasks()
})
</script>

<style scoped>
.driver-task-list-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f5f5;
}

.filter-bar {
  display: flex;
  justify-content: space-around;
  padding: 10px 8px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
}

.filter-tag {
  padding: 6px 16px;
  border-radius: 20px;
  background: #f0f0f0;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
}

.filter-tag.active {
  background: #1890ff;
  color: #fff;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #999;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e0e0e0;
  border-top: 4px solid #1890ff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-text {
  color: #ff4d4f;
  margin-bottom: 12px;
}

.retry-btn {
  padding: 8px 24px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.empty-img {
  width: 120px;
  height: 120px;
  margin-bottom: 12px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-card {
  background: #fff;
  border-radius: 8px;
  padding: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  cursor: pointer;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.task-id {
  font-weight: bold;
  color: #333;
}

.task-body {
  font-size: 14px;
  color: #555;
}

.task-body p {
  margin: 4px 0;
}

.task-action {
  margin-top: 10px;
  text-align: right;
}

.accept-btn {
  padding: 6px 20px;
  background: #52c41a;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.bottom-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #fff;
  border-top: 1px solid #e8e8e8;
}

.nav-btn {
  padding: 8px 20px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.notification-badge {
  position: relative;
  width: 24px;
  height: 24px;
  background: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ff4d4f;
  color: #fff;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
}
</style>