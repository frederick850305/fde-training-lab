<template>
  <div class="driver-task-execute">
    <!-- 顶部导航栏 -->
    <div class="top-bar">
      <button class="back-btn">← 返回</button>
      <span class="task-id">{{ taskId || '任务ID' }}</span>
      <span class="status-tag" :class="taskStatus">{{ statusLabel }}</span>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="skeleton">
      <div class="skeleton-block"></div>
      <div class="skeleton-block"></div>
      <div class="skeleton-block"></div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <p>数据加载失败，请重试</p>
      <button @click="retryLoad">重试</button>
    </div>

    <!-- 空状态（理论上不会出现，但保留） -->
    <div v-else-if="empty" class="empty-state">
      <p>暂无任务数据</p>
    </div>

    <!-- 成功状态：任务详情 -->
    <div v-else class="content">
      <!-- 任务信息卡片 -->
      <div class="info-card">
        <div class="info-row">
          <label>作业点名称：</label>
          <span>{{ taskDetail.workPointName }}</span>
        </div>
        <div class="info-row">
          <label>作业点地址：</label>
          <span>{{ taskDetail.workPointAddress }}</span>
        </div>
        <div class="info-row">
          <label>经纬度：</label>
          <span>{{ taskDetail.latitude }}, {{ taskDetail.longitude }}</span>
        </div>
        <div class="info-row">
          <label>预计时间：</label>
          <span>{{ taskDetail.estimatedTime }}</span>
        </div>
        <div class="info-row">
          <label>提货单号：</label>
          <span class="link" @click="viewMaterial(taskDetail.materialOrderNo)">{{ taskDetail.materialOrderNo }}</span>
        </div>
        <div class="info-row">
          <label>车牌：</label>
          <span>{{ taskDetail.licensePlate }}</span>
        </div>
        <div class="info-row">
          <label>司机手机：</label>
          <span class="phone" @click="callPhone(taskDetail.driverPhone)">{{ taskDetail.driverPhone }}</span>
        </div>
        <div class="info-row">
          <label>调度员电话：</label>
          <span class="phone" @click="callPhone(taskDetail.dispatcherPhone)">{{ taskDetail.dispatcherPhone }}</span>
        </div>
      </div>

      <!-- 操作按钮区 -->
      <div class="action-buttons">
        <button @click="navigateTo">导航</button>
        <button :disabled="taskStatus === 'arrived' || taskStatus === 'completed'" @click="confirmArrive">确认到达</button>
        <button :disabled="taskStatus === 'completed'" @click="confirmComplete">完成确认</button>
      </div>

      <!-- 照片上传区域 -->
      <div class="photo-upload">
        <h4>现场照片</h4>
        <div class="photo-list">
          <div v-for="(photo, idx) in photos" :key="idx" class="photo-item">
            <img :src="photo" alt="照片" />
            <button @click="removePhoto(idx)">删除</button>
          </div>
          <button @click="addPhoto">+ 拍照/相册</button>
        </div>
      </div>

      <!-- 异常反馈入口 -->
      <div class="feedback-section">
        <button @click="showFeedbackForm = true">异常反馈</button>
        <div v-if="showFeedbackForm" class="feedback-form">
          <textarea v-model="feedbackContent" placeholder="描述异常情况"></textarea>
          <button @click="submitFeedback">提交</button>
        </div>
      </div>

      <!-- 历史反馈记录列表 -->
      <div class="history-feedback">
        <h4 @click="toggleFeedbackList">历史反馈 <span>{{ feedbackExpanded ? '▼' : '▶' }}</span></h4>
        <div v-if="feedbackExpanded">
          <div v-if="feedbackList.length === 0" class="no-feedback">暂无反馈</div>
          <div v-for="(fb, idx) in feedbackList" :key="idx" class="feedback-item" @click="toggleFeedbackDetail(idx)">
            <div class="fb-summary">{{ fb.type }} - {{ fb.time }}</div>
            <div v-if="fb.expanded" class="fb-detail">
              <p>{{ fb.description }}</p>
              <div v-if="fb.photos && fb.photos.length">
                <img v-for="(p, pi) in fb.photos" :key="pi" :src="p" />
              </div>
              <p>处理状态：{{ fb.status }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { prototypeContract } from '../prototypeContract'
import { fetchTasksData } from '../data/mockTasks.js'

const prototypeContext = inject('prototypeContext')
const currentRoleKey = prototypeContext?.currentRoleKey || 'driver'

const taskId = ref('TASK-2025-001')
const taskStatus = ref('pending') // pending / arrived / completed
const statusLabel = ref('待执行')
const loading = ref(true)
const error = ref(false)
const empty = ref(false)
const taskDetail = ref({
  workPointName: '',
  workPointAddress: '',
  latitude: '',
  longitude: '',
  estimatedTime: '',
  materialOrderNo: '',
  licensePlate: '',
  driverPhone: '',
  dispatcherPhone: ''
})
const photos = ref([])
const showFeedbackForm = ref(false)
const feedbackContent = ref('')
const feedbackExpanded = ref(false)
const feedbackList = ref([])

function normalizeTaskDetail(detail) {
  return {
    workPointName: detail.workPointName || detail.workpointName || '',
    workPointAddress: detail.workPointAddress || detail.address || '',
    latitude: detail.latitude || '',
    longitude: detail.longitude || '',
    estimatedTime: detail.estimatedTime || '',
    materialOrderNo: detail.materialOrderNo || '',
    licensePlate: detail.licensePlate || '',
    driverPhone: detail.driverPhone || '',
    dispatcherPhone: detail.dispatcherPhone || ''
  }
}

function normalizeFeedbackList(items) {
  return items.map((item, idx) => ({
    type: item.type || '异常',
    time: item.time || '',
    description: item.description || '',
    photos: item.photos || [],
    status: item.status || '待处理',
    expanded: false
  }))
}

async function loadTaskData() {
  loading.value = true
  error.value = false
  empty.value = false
  try {
    const data = await fetchTasksData()
    // 数据源是数组，取第一条作为示例
    if (!data || data.length === 0) {
      empty.value = true
      return
    }
    const taskItem = data[0]
    taskId.value = taskItem.taskId || 'TASK-2025-001'
    // 根据角色调整状态显示
    if (currentRoleKey === 'driver') {
      taskStatus.value = taskItem.taskStatus || 'pending'
    } else {
      // 其他角色可看到不同状态，这里保持样例
      taskStatus.value = taskItem.taskStatus || 'pending'
    }
    statusLabel.value = taskStatus.value === 'pending' ? '待执行' : taskStatus.value === 'arrived' ? '已到达' : '已完成'
    // 填充详情（从taskDetail或taskItem中提取）
    const detail = taskItem.taskDetail || taskItem
    taskDetail.value = normalizeTaskDetail(detail)
    // 模拟反馈列表
    feedbackList.value = normalizeFeedbackList(taskItem.driverFeedback ? [taskItem.driverFeedback] : [])
    // 模拟照片
    photos.value = []
    loading.value = false
  } catch (e) {
    error.value = true
    loading.value = false
  }
}

function retryLoad() {
  loadTaskData()
}

function navigateTo() {
  // 模拟导航调用系统地图
  console.log('导航到：', taskDetail.value.latitude, taskDetail.value.longitude)
}

function callPhone(phone) {
  if (phone) {
    window.location.href = `tel:${phone}`
  }
}

function viewMaterial(orderNo) {
  // 跳转到物资详情，模拟
  console.log('查看物资：', orderNo)
}

function confirmArrive() {
  // 模拟到达确认
  taskStatus.value = 'arrived'
  statusLabel.value = '已到达'
  console.log('POST /api/driver/tasks/{taskId}/arrive')
}

function confirmComplete() {
  // 需要至少一张照片
  if (photos.value.length === 0) {
    alert('请先上传至少一张现场照片')
    return
  }
  taskStatus.value = 'completed'
  statusLabel.value = '已完成'
  console.log('POST /api/driver/tasks/{taskId}/complete')
}

function addPhoto() {
  // 模拟选择照片
  photos.value.push('https://via.placeholder.com/150')
}

function removePhoto(idx) {
  photos.value.splice(idx, 1)
}

function submitFeedback() {
  if (!feedbackContent.value.trim()) return
  console.log('POST /api/driver/feedback', { content: feedbackContent.value })
  feedbackList.value.push({
    type: '异常反馈',
    time: new Date().toLocaleString(),
    description: feedbackContent.value,
    photos: [],
    status: '已提交',
    expanded: true
  })
  feedbackContent.value = ''
  showFeedbackForm.value = false
}

function toggleFeedbackList() {
  feedbackExpanded.value = !feedbackExpanded.value
}

function toggleFeedbackDetail(idx) {
  feedbackList.value[idx].expanded = !feedbackList.value[idx].expanded
}

onMounted(() => {
  loadTaskData()
})
</script>

<style scoped>
.driver-task-execute {
  font-family: sans-serif;
  padding: 12px;
  max-width: 480px;
  margin: 0 auto;
}
.top-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}
.back-btn {
  background: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
}
.task-id {
  font-weight: bold;
  flex: 1;
}
.status-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}
.status-tag.pending { background: #f0ad4e; color: white; }
.status-tag.arrived { background: #5bc0de; color: white; }
.status-tag.completed { background: #5cb85c; color: white; }
.skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.skeleton-block {
  height: 20px;
  background: #eee;
  border-radius: 4px;
}
.error-state, .empty-state {
  text-align: center;
  padding: 40px 0;
}
.info-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
}
.info-row {
  display: flex;
  margin-bottom: 8px;
  font-size: 14px;
}
.info-row label {
  width: 100px;
  color: #666;
  flex-shrink: 0;
}
.link {
  color: #1890ff;
  cursor: pointer;
  text-decoration: underline;
}
.phone {
  color: #1890ff;
  cursor: pointer;
}
.action-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}
.action-buttons button {
  flex: 1;
  padding: 8px 0;
  border: none;
  border-radius: 4px;
  background: #1890ff;
  color: white;
  cursor: pointer;
}
.action-buttons button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.photo-upload {
  margin-bottom: 16px;
}
.photo-upload h4 {
  margin: 0 0 8px;
}
.photo-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.photo-item {
  position: relative;
  width: 80px;
  height: 80px;
}
.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}
.photo-item button {
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  font-size: 12px;
  cursor: pointer;
}
.feedback-section {
  margin-bottom: 16px;
}
.feedback-section button {
  background: #ff4d4f;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
.feedback-form {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.feedback-form textarea {
  width: 100%;
  height: 80px;
  resize: vertical;
}
.history-feedback h4 {
  cursor: pointer;
  user-select: none;
  margin: 0 0 8px;
}
.no-feedback {
  color: #999;
  font-style: italic;
}
.feedback-item {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 8px;
  cursor: pointer;
}
.fb-summary {
  font-weight: 500;
}
.fb-detail {
  margin-top: 8px;
  font-size: 13px;
}
.fb-detail img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin-right: 4px;
}
</style>