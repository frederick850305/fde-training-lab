<template>
  <div class="driver-task-list-view">
    <!-- 顶部状态筛选栏 + 未读推送角标 -->
    <div class="status-filter-bar">
      <div class="tabs">
        <span
          v-for="tab in filterTabs"
          :key="tab.value"
          :class="['tab-item', { active: currentFilter === tab.value }]"
          @click="switchTab(tab.value)"
        >
          {{ tab.label }}
        </span>
      </div>
      <div class="notification-badge" @click="onNotificationClick">
        <span class="badge-icon">🔔</span>
        <span v-if="unreadCount > 0" class="badge-count">{{ unreadCount }}</span>
      </div>
    </div>

    <!-- 非司机角色提示 -->
    <div v-if="currentRoleKey !== 'driver'" class="role-warning">
      当前角色“{{ currentRole }}”非司机，此页面仅供司机使用，数据展示可能不完整。
    </div>

    <!-- 任务卡片列表区 -->
    <div class="task-list-area">
      <!-- loading 状态 -->
      <div v-if="loading" class="state-loading">
        <div class="skeleton-card" v-for="i in 3" :key="i">
          <div class="skeleton-line skeleton-title"></div>
          <div class="skeleton-line skeleton-body"></div>
          <div class="skeleton-line skeleton-footer"></div>
        </div>
      </div>

      <!-- error 状态 -->
      <div v-else-if="error" class="state-error">
        <p>网络异常，请重试</p>
        <button class="retry-btn" @click="loadTasks">重试</button>
      </div>

      <!-- empty 状态 -->
      <div v-else-if="tasks.length === 0" class="state-empty">
        <div class="empty-icon">📭</div>
        <p>暂无任务</p>
      </div>

      <!-- 正常列表 -->
      <div v-else class="scrollable-list">
        <div
          class="task-card"
          v-for="task in filteredTasks"
          :key="task.taskId"
          @click="onCardClick(task)"
        >
          <div class="card-header">
            <span class="task-id">{{ task.taskId }}</span>
            <StatusTag :status="task.status" :text="statusLabel(task.status)" size="small" />
          </div>
          <div class="card-body">
            <div class="info-row">
              <span class="info-label">作业点</span>
              <span class="info-value">{{ task.workPoint || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">预计时间</span>
              <span class="info-value">{{ task.estimatedTime || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">车牌号</span>
              <span class="info-value">{{ task.plateNumber || '-' }}</span>
            </div>
          </div>
          <!-- 待接单任务显示确认按钮 -->
          <div v-if="task.status === 'pending'" class="card-footer">
            <button class="accept-btn" @click.stop="onAccept(task)">确认接单</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部导航栏（占位） -->
    <div class="bottom-nav">
      <button class="nav-btn" @click="goBack">← 回到工作台</button>
      <button class="nav-btn" @click="showMyInfo">我的</button>
    </div>

    <!-- 确认接单对话框 -->
    <ConfirmDialog
      :visible="acceptDialogVisible"
      title="确认接单"
      :content="`确定接受任务 ${acceptingTaskId} 吗？`"
      @confirm="handleAcceptConfirm"
      @cancel="acceptDialogVisible = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { prototypeContract } from '../prototypeContract'
import StatusTag from '../components/StatusTag.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

// 从 pageContract.mocks 中读取 mock 入口
import { fetchTasksData } from '../data/mockTasks.js'

// 注入原型上下文
const prototypeContext = inject('prototypeContext', {
  currentRole: '司机-李师傅',
  currentRoleKey: 'driver'
})
const currentRole = computed(() => prototypeContext.currentRole)
const currentRoleKey = computed(() => prototypeContext.currentRoleKey)

// 状态管理
const loading = ref(true)
const error = ref(false)
const tasks = ref([])
const currentFilter = ref('pending') // 默认待接单
const acceptDialogVisible = ref(false)
const acceptingTaskId = ref(null)
const unreadCount = ref(0) // 模拟未读数

// 筛选标签：全部/待接单/进行中/已完成
const filterTabs = [
  { label: '全部', value: 'all' },
  { label: '待接单', value: 'pending' },
  { label: '进行中', value: 'inProgress' },
  { label: '已完成', value: 'completed' }
]

// 根据角色设置默认筛选
if (currentRoleKey.value === 'driver') {
  currentFilter.value = 'pending'
} else {
  currentFilter.value = 'all'
}

// 加载任务数据
async function loadTasks() {
  loading.value = true
  error.value = false
  try {
    // 调用 contract 指定的 mock 读取函数
    const data = await fetchTasksData()
    // 对数据进行 normalize，确保字段一致
    tasks.value = (data.tasksRecords || []).map(normalizeTask)
  } catch (e) {
    console.error('Failed to load tasks', e)
    error.value = true
  } finally {
    loading.value = false
  }
}

// 字段映射：确保 schema 中的字段存在
function normalizeTask(raw) {
  // 根据 pageContract.mocks.schema 中的 taskItem 字段
  return {
    taskId: raw.taskId || raw.id || '',
    title: raw.taskTitle || raw.title || '',
    plateNumber: raw.plateNumber || raw.plate || '',
    origin: raw.origin || raw.startPlace || '',
    destination: raw.destination || raw.endPlace || '',
    workPoint: raw.workPoint || raw.workplace || raw.workstation || '',
    status: raw.status || 'pending', // pending, inProgress, completed
    createdAt: raw.createdAt || raw.createTime || '',
    estimatedTime: raw.estimatedTime || raw.estimatedArrival || ''
  }
}

// 筛选后的任务列表
const filteredTasks = computed(() => {
  if (currentFilter.value === 'all') return tasks.value
  return tasks.value.filter(t => t.status === currentFilter.value)
})

// 状态标签文本
const statusMap = {
  pending: '待接单',
  inProgress: '进行中',
  completed: '已完成'
}
function statusLabel(status) {
  return statusMap[status] || status
}

// 切换筛选
function switchTab(value) {
  currentFilter.value = value
}

// 点击卡片（模拟跳转详情）
function onCardClick(task) {
  // 原型演示：弹出提示
  alert(`查看任务详情：${task.taskId}`)
}

// 确认接单按钮点击
function onAccept(task) {
  acceptingTaskId.value = task.taskId
  acceptDialogVisible.value = true
}

// 确认对话框确认
function handleAcceptConfirm() {
  acceptDialogVisible.value = false
  // 模拟接单成功：更新本地任务状态
  const task = tasks.value.find(t => t.taskId === acceptingTaskId.value)
  if (task) {
    task.status = 'inProgress'
  }
  // 模拟调用 API 成功
  alert(`任务 ${acceptingTaskId.value} 已接单`)
  acceptingTaskId.value = null
}

// 通知点击模拟
function onNotificationClick() {
  alert('推送通知列表')
}

// 底部导航按钮
function goBack() {
  alert('返回工作台（模拟）')
}
function showMyInfo() {
  alert('我的页面（模拟）')
}

// 生命周期
onMounted(() => {
  loadTasks()
})
</script>

<style scoped>
.driver-task-list-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f6f8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

/* 顶部筛选栏 + 通知 */
.status-filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  position: sticky;
  top: 0;
  z-index: 10;
}
.tabs {
  display: flex;
  gap: 8px;
}
.tab-item {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  background: #f0f0f0;
  transition: all 0.2s;
}
.tab-item.active {
  background: #1890ff;
  color: #fff;
}
.notification-badge {
  position: relative;
  cursor: pointer;
}
.badge-icon {
  font-size: 20px;
}
.badge-count {
  position: absolute;
  top: -6px;
  right: -10px;
  background: #ff4d4f;
  color: #fff;
  border-radius: 10px;
  padding: 1px 6px;
  font-size: 11px;
  line-height: 14px;
  min-width: 18px;
  text-align: center;
}

/* 角色提示 */
.role-warning {
  background: #fff3cd;
  color: #856404;
  padding: 8px 16px;
  font-size: 13px;
  border-bottom: 1px solid #ffc107;
}

/* 任务列表区 */
.task-list-area {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
}

/* Loading 骨架屏 */
.state-loading {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.skeleton-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.skeleton-line {
  height: 14px;
  background: #eee;
  border-radius: 4px;
  margin-bottom: 10px;
  animation: pulse 1.5s infinite;
}
.skeleton-title {
  width: 60%;
  height: 18px;
}
.skeleton-body {
  width: 90%;
}
.skeleton-footer {
  width: 40%;
}
@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

/* Error */
.state-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #999;
}
.state-error p {
  margin-bottom: 16px;
  font-size: 15px;
}
.retry-btn {
  padding: 8px 24px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
}

/* Empty */
.state-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #bbb;
}
.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}
.state-empty p {
  font-size: 16px;
}

/* 任务卡片 */
.scrollable-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.task-card {
  background: #fff;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.task-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.task-id {
  font-weight: 600;
  color: #333;
  font-size: 15px;
}
.card-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}
.info-label {
  color: #888;
}
.info-value {
  color: #333;
}
.card-footer {
  margin-top: 12px;
  text-align: right;
}
.accept-btn {
  padding: 6px 20px;
  background: #52c41a;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}
.accept-btn:hover {
  background: #45a817;
}

/* 底部导航 */
.bottom-nav {
  display: flex;
  justify-content: space-around;
  padding: 10px 16px;
  background: #fff;
  border-top: 1px solid #e8e8e8;
}
.nav-btn {
  padding: 8px 24px;
  background: #f0f0f0;
  border: none;
  border-radius: 20px;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}
.nav-btn:hover {
  background: #e0e0e0;
}
</style>
