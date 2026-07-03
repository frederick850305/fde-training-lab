<template>
  <div class="driver-task-execute">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <button class="back-btn" @click="handleBack">← 返回</button>
      <span class="task-id">{{ detail?.taskId || '--' }}</span>
      <span class="status-badge" :class="statusClass">{{ detail?.status || '--' }}</span>
    </div>

    <!-- 错误状态 -->
    <div v-if="uiState === 'error'" class="state-error">
      <p>数据加载失败，请重试</p>
      <button @click="fetchTask">重试</button>
    </div>

    <!-- 加载状态 -->
    <div v-else-if="uiState === 'loading'" class="state-loading">
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="uiState === 'empty'" class="state-empty">
      <p>暂无任务数据</p>
    </div>

    <!-- 正常内容 -->
    <template v-else-if="uiState === 'success' && detail">
      <!-- 任务信息卡片区 -->
      <div class="task-info-card">
        <div class="info-row"><label>作业点名称：</label><span>{{ detail.workPointName }}</span></div>
        <div class="info-row"><label>地址：</label><span>{{ detail.address }}</span></div>
        <div class="info-row"><label>经纬度：</label><span>{{ detail.latitude }}, {{ detail.longitude }}</span></div>
        <div class="info-row"><label>预计时间：</label><span>{{ detail.estimatedTime }}</span></div>
        <div class="info-row"><label>物资提货单号：</label><span>{{ detail.materialOrderNo }}</span></div>
        <div class="info-row"><label>车牌：</label><span>{{ detail.licensePlate }}</span></div>
        <div class="info-row"><label>司机手机：</label><span class="clickable" @click="callPhone(detail.driverPhone)">{{ detail.driverPhone }}</span></div>
        <div class="info-row"><label>调度员电话：</label><span class="clickable" @click="callPhone(detail.dispatcherPhone)">{{ detail.dispatcherPhone }}</span></div>
      </div>

      <!-- 操作按钮区 -->
      <div class="action-buttons">
        <button class="btn btn-nav" @click="navigate">导航</button>
        <button class="btn btn-arrive" :disabled="arrived" @click="confirmArrive">{{ arrived ? '已到达' : '到达确认' }}</button>
        <button class="btn btn-complete" :disabled="completed" @click="confirmComplete">{{ completed ? '已完成' : '完成确认' }}</button>
      </div>

      <!-- 照片上传区域 -->
      <div class="photo-upload">
        <label>现场照片：</label>
        <div class="photo-list">
          <div v-for="(photo, idx) in photoList" :key="idx" class="photo-item">
            <img :src="photo.thumbnail" alt="photo" />
            <button class="delete-btn" @click="removePhoto(idx)">✕</button>
          </div>
          <button class="add-photo" @click="addPhoto">+ 拍照/相册</button>
        </div>
      </div>

      <!-- 异常反馈入口 -->
      <div class="feedback-section">
        <button class="btn btn-feedback" @click="showFeedbackForm = true">发起异常反馈</button>
      </div>

      <!-- 历史反馈记录列表 -->
      <div class="feedback-history">
        <h3>历史反馈</h3>
        <div v-for="(record, idx) in feedbackRecords" :key="record.id || idx" class="feedback-item" @click="toggleFeedbackDetail(idx)">
          <span class="feedback-type">{{ record.type }}</span>
          <span class="feedback-time">{{ record.time }}</span>
          <span class="feedback-status">{{ record.status }}</span>
          <div v-if="expandedFeedback === idx" class="feedback-detail">
            <p>{{ record.description }}</p>
            <div v-if="record.photos?.length" class="photo-list small">
              <img v-for="(p, pi) in record.photos" :key="pi" :src="p.thumbnail" />
            </div>
          </div>
        </div>
        <div v-if="!feedbackRecords.length" class="no-feedback">暂无反馈</div>
      </div>
    </template>

    <!-- 异常反馈弹窗（简化） -->
    <div v-if="showFeedbackForm" class="feedback-modal-overlay" @click.self="showFeedbackForm = false">
      <div class="feedback-modal">
        <h3>提交异常反馈</h3>
        <textarea v-model="feedbackContent" placeholder="请描述异常情况"></textarea>
        <button class="btn btn-submit" @click="submitFeedback">提交</button>
        <button class="btn btn-cancel" @click="showFeedbackForm = false">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, computed, onMounted } from 'vue'
import { tasksRecords, fetchTasksData } from '../data/mockTasks.js'
import prototypeContract from '../prototypeContract.js'

const prototypeContext = inject('prototypeContext')
const currentRole = computed(() => prototypeContext?.currentRole ?? 'driver')
const currentRoleKey = computed(() => prototypeContext?.currentRoleKey ?? 'driver')

const detail = ref(null)
const arrived = ref(false)
const completed = ref(false)
const photoList = ref([])
const feedbackRecords = ref([])
const expandedFeedback = ref(null)
const showFeedbackForm = ref(false)
const feedbackContent = ref('')
const uiState = ref('loading')

const statusClass = computed(() => {
  const s = detail.value?.status
  if (!s) return ''
  return `status-${s.toLowerCase().replace(/\s+/g, '-')}`
})

async function fetchTask() {
  uiState.value = 'loading'
  try {
    const data = await fetchTasksData()
    if (data && data.taskDetail) {
      detail.value = data.taskDetail
      feedbackRecords.value = data.driverFeedback ? [data.driverFeedback] : []
      uiState.value = 'success'
    } else {
      uiState.value = 'empty'
    }
  } catch (e) {
    uiState.value = 'error'
    console.error('fetch failed', e)
  }
}

onMounted(() => {
  fetchTask()
})

function handleBack() {
  // 原型中简单返回
  window.history.back()
}

function callPhone(phone) {
  if (phone) {
    window.location.href = `tel:${phone}`
  }
}

function navigate() {
  const lat = detail.value?.latitude
  const lng = detail.value?.longitude
  if (lat && lng) {
    window.open(`iosamap://path?sourceApplication=application&dname=${encodeURIComponent(detail.value.address || '')}&dlat=${lat}&dlon=${lng}`)
  }
}

function confirmArrive() {
  arrived.value = true
  // 原型中只做状态切换
}

async function confirmComplete() {
  if (photoList.value.length === 0) {
    alert('请至少上传一张照片')
    return
  }
  completed.value = true
  // 原型中模拟完成
}

function addPhoto() {
  photoList.value.push({
    id: Date.now(),
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiNlZGVkZWQiLz48dGV4dCB4PSI0MCIgeT0iNDUiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiPuWbvueJh+aRmOW6kzwvdGV4dD48L3N2Zz4=',
    url: ''
  })
}

function removePhoto(idx) {
  photoList.value.splice(idx, 1)
}

function toggleFeedbackDetail(idx) {
  expandedFeedback.value = expandedFeedback.value === idx ? null : idx
}

function submitFeedback() {
  if (!feedbackContent.value.trim()) {
    alert('请输入反馈内容')
    return
  }
  feedbackRecords.value.push({
    id: Date.now(),
    type: '异常',
    description: feedbackContent.value,
    time: new Date().toLocaleString(),
    status: '待处理',
    photos: []
  })
  feedbackContent.value = ''
  showFeedbackForm.value = false
  alert('反馈已提交')
}
</script>

<style scoped>
.driver-task-execute {
  padding: 12px;
  background: #f5f5f5;
  min-height: 100vh;
  font-size: 14px;
  color: #333;
}

.top-nav {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 12px;
}
.back-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
}
.task-id {
  font-weight: bold;
  flex: 1;
}
.status-badge {
  padding: 2px 8px;
  border-radius: 4px;
  background: #e0e0e0;
  font-size: 12px;
}
.status-进行中 {
  background: #ffc107;
  color: #000;
}
.status-已完成 {
  background: #4caf50;
  color: #fff;
}
.status-待接单 {
  background: #2196f3;
  color: #fff;
}

.state-loading, .state-empty, .state-error {
  text-align: center;
  padding: 40px 0;
}
.skeleton-card {
  height: 80px;
  background: #e0e0e0;
  border-radius: 8px;
  margin-bottom: 12px;
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

.task-info-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}
.info-row {
  display: flex;
  margin-bottom: 6px;
  line-height: 1.6;
}
.info-row label {
  color: #666;
  min-width: 100px;
  flex-shrink: 0;
}
.info-row span.clickable {
  color: #1976d2;
  cursor: pointer;
  text-decoration: underline;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}
.btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-nav {
  background: #1976d2;
  color: #fff;
}
.btn-arrive {
  background: #ff9800;
  color: #fff;
}
.btn-complete {
  background: #4caf50;
  color: #fff;
}
.btn-feedback {
  background: #f44336;
  color: #fff;
  flex: none;
  width: 100%;
}

.photo-upload {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}
.photo-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}
.photo-item {
  position: relative;
  width: 80px;
  height: 80px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}
.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.delete-btn {
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgba(0,0,0,0.5);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  cursor: pointer;
  line-height: 20px;
  text-align: center;
}
.add-photo {
  width: 80px;
  height: 80px;
  border: 1px dashed #999;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  cursor: pointer;
  color: #666;
}

.feedback-section {
  margin-bottom: 12px;
}

.feedback-history {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
}
.feedback-history h3 {
  margin: 0 0 8px;
  font-size: 16px;
}
.feedback-item {
  border-bottom: 1px solid #eee;
  padding: 8px 0;
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
}
.feedback-item:last-child {
  border-bottom: none;
}
.feedback-type {
  background: #e3f2fd;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}
.feedback-time {
  color: #999;
  font-size: 12px;
  flex: 1;
}
.feedback-status {
  font-size: 12px;
  color: #ff9800;
}
.feedback-detail {
  margin-top: 4px;
  width: 100%;
  padding: 8px;
  background: #fafafa;
  border-radius: 4px;
}
.no-feedback {
  color: #999;
  text-align: center;
  padding: 20px 0;
}

.feedback-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.feedback-modal {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  width: 80%;
  max-width: 400px;
}
.feedback-modal h3 {
  margin: 0 0 12px;
}
.feedback-modal textarea {
  width: 100%;
  height: 80px;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 8px;
  resize: vertical;
}
.btn-submit {
  background: #4caf50;
  color: #fff;
  margin-top: 8px;
  width: 100%;
}
.btn-cancel {
  background: #eee;
  color: #666;
  margin-top: 4px;
  width: 100%;
}
</style>