<template>
  <div class="driver-task-execute">
    <!-- loading 状态 -->
    <div v-if="state === 'loading'" class="skeleton">
      <div class="skeleton-header"></div>
      <div class="skeleton-card"></div>
      <div class="skeleton-buttons"></div>
    </div>

    <!-- error 状态 -->
    <div v-else-if="state === 'error'" class="error-state">
      <p>加载失败，请重试</p>
      <button @click="fetchTaskDetail">重试</button>
    </div>

    <!-- empty 状态（实际不会出现，但保留） -->
    <div v-else-if="state === 'empty'" class="empty-state">
      <p>暂无任务</p>
    </div>

    <!-- success 状态 -->
    <div v-else class="content">
      <!-- 顶部导航栏 -->
      <div class="top-nav">
        <button @click="goBack">返回</button>
        <span class="task-id">任务ID: {{ task.id }}</span>
        <span class="status-tag" :class="task.status">{{ task.statusLabel }}</span>
      </div>

      <!-- 任务信息卡片 -->
      <div class="task-info-card">
        <p><strong>作业点：</strong>{{ task.workPointName }}</p>
        <p><strong>地址：</strong>{{ task.address }}</p>
        <p><strong>预计时间：</strong>{{ task.estimatedTime }}</p>
        <p><strong>提货单号：</strong>{{ task.pickupOrderNo }}</p>
        <p><strong>车牌：</strong>{{ task.plateNumber }}</p>
        <p><strong>司机电话：</strong><a :href="'tel:' + task.driverPhone">{{ task.driverPhone }}</a></p>
        <p><strong>调度员电话：</strong><a :href="'tel:' + task.dispatcherPhone">{{ task.dispatcherPhone }}</a></p>
      </div>

      <!-- 操作按钮区 -->
      <div class="action-buttons">
        <button class="btn-navigate" @click="navigate">导航</button>
        <button class="btn-arrive" :disabled="task.status === 'arrived'" @click="confirmArrive">
          {{ task.status === 'arrived' ? '已到达' : '确认到达' }}
        </button>
        <button class="btn-complete" :disabled="task.status === 'completed'" @click="confirmComplete">
          完成确认
        </button>
      </div>

      <!-- 照片上传区域 -->
      <div class="photo-upload">
        <FileUpload
          :fileList="photos"
          @update:fileList="photos = $event"
          accept="image/*"
          :multiple="true"
          :maxCount="9"
          uploadUrl="/api/upload"
        />
      </div>

      <!-- 异常反馈入口 -->
      <div class="feedback-entry">
        <button @click="showFeedbackForm = true">提交异常反馈</button>
        <DetailPanel
          :visible="showFeedbackForm"
          title="异常反馈"
          mode="modal"
          @close="showFeedbackForm = false"
        >
          <!-- 反馈表单内容简写，实际会包含类型、描述、照片等 -->
          <div>
            <p>反馈表单（略）</p>
            <button @click="submitFeedback">提交</button>
          </div>
        </DetailPanel>
      </div>

      <!-- 历史反馈记录列表 -->
      <div class="history-feedback">
        <h3>历史反馈记录</h3>
        <div v-if="feedbacks.length === 0" class="empty-feedback">暂无反馈</div>
        <div v-else>
          <div v-for="fb in feedbacks" :key="fb.id" class="feedback-item" @click="toggleFeedbackDetail(fb.id)">
            <span>{{ fb.type }}</span>
            <span>{{ fb.time }}</span>
            <div v-if="expandedFeedbackId === fb.id" class="feedback-detail">
              <p>{{ fb.description }}</p>
              <img v-for="img in fb.photos" :src="img" :key="img" />
              <p>处理状态: {{ fb.status }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getTaskDetail, confirmArrive as apiConfirmArrive, confirmComplete as apiConfirmComplete } from '@/data/mockTasks.js'
import FileUpload from '@/components/FileUpload.vue'
import DetailPanel from '@/components/DetailPanel.vue'

const router = useRouter()

// 页面状态
const state = ref('loading')
const task = ref({})
const photos = ref([])
const showFeedbackForm = ref(false)
const feedbacks = ref([])
const expandedFeedbackId = ref(null)

// 模拟获取任务详情
async function fetchTaskDetail() {
  state.value = 'loading'
  try {
    const res = await getTaskDetail()
    task.value = res
    feedbacks.value = res.feedbacks || []
    state.value = 'success'
  } catch (e) {
    state.value = 'error'
  }
}

function goBack() {
  router.back()
}

function navigate() {
  // 调用系统地图
  const { latitude, longitude, address } = task.value
  const url = `https://maps.apple.com/?q=${encodeURIComponent(address)}&ll=${latitude},${longitude}`
  window.open(url, '_system')
}

function confirmArrive() {
  if (task.value.status === 'arrived') return
  // 调用 API
  apiConfirmArrive(task.value.id).then(() => {
    task.value.status = 'arrived'
    task.value.statusLabel = '已到达'
  })
}

function confirmComplete() {
  if (task.value.status === 'completed') return
  // 完成需要先上传至少一张照片
  if (photos.value.length === 0) {
    alert('请至少上传一张现场照片')
    return
  }
  apiConfirmComplete(task.value.id, { photos: photos.value }).then(() => {
    task.value.status = 'completed'
    task.value.statusLabel = '已完成'
  })
}

function submitFeedback() {
  // 调用异常反馈 API
  const newFeedback = {
    id: Date.now(),
    type: '其他',
    description: '模拟反馈',
    time: new Date().toLocaleString(),
    photos: [],
    status: '待处理'
  }
  feedbacks.value.unshift(newFeedback)
  showFeedbackForm.value = false
}

function toggleFeedbackDetail(id) {
  expandedFeedbackId.value = expandedFeedbackId.value === id ? null : id
}

onMounted(fetchTaskDetail)
</script>

<style scoped>
.driver-task-execute {
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* skeleton 样式简略 */
.skeleton {
  background: #f0f0f0;
}
.skeleton-header {
  height: 48px;
  background: #e0e0e0;
  margin-bottom: 16px;
}
.skeleton-card {
  height: 200px;
  background: #e0e0e0;
  margin-bottom: 16px;
}
.skeleton-buttons {
  height: 120px;
  background: #e0e0e0;
}

.error-state {
  text-align: center;
  padding: 40px;
  color: #f5222d;
}
.error-state button {
  margin-top: 16px;
  padding: 8px 24px;
  border: none;
  background: #1890ff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
}

.top-nav {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 16px;
}
.top-nav button {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
}
.task-id {
  flex: 1;
  text-align: center;
  font-weight: 500;
}
.status-tag {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  background: #e6f7ff;
  color: #1890ff;
}
.status-tag.completed {
  background: #f6ffed;
  color: #52c41a;
}
.status-tag.arrived {
  background: #fff7e6;
  color: #faad14;
}

.task-info-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}
.task-info-card p {
  margin: 8px 0;
}
.task-info-card a {
  color: #1890ff;
  text-decoration: none;
}

.action-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.action-buttons button {
  flex: 1;
  padding: 12px 0;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}
.btn-navigate {
  background: #1890ff;
  color: #fff;
}
.btn-arrive {
  background: #faad14;
  color: #fff;
}
.btn-complete {
  background: #52c41a;
  color: #fff;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.photo-upload {
  margin-bottom: 16px;
}

.feedback-entry {
  margin-bottom: 16px;
}
.feedback-entry button {
  width: 100%;
  padding: 12px;
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.history-feedback {
  border-top: 1px solid #eee;
  padding-top: 16px;
}
.history-feedback h3 {
  margin-bottom: 8px;
}
.empty-feedback {
  color: #999;
  text-align: center;
  padding: 24px;
}
.feedback-item {
  padding: 8px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
}
.feedback-detail {
  margin-top: 8px;
  padding: 8px;
  background: #fafafa;
  border-radius: 4px;
}
.feedback-detail img {
  max-width: 100px;
  margin: 4px;
}
</style>
