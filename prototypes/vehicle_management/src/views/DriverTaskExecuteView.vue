<template>
  <div class="task-execute">
    <div v-if="loading" class="loading-state"><div class="skeleton sk-full"></div></div>
    <div v-else-if="error" class="error-state"><span>⚠️</span><p>{{ error }}</p><button @click="loadData">重试</button></div>
    <template v-else-if="task">
      <!-- 顶部导航栏 -->
      <div class="top-bar">
        <button class="back-btn" @click="goBack">← 返回</button>
        <strong>{{ task.taskId }}</strong>
        <StatusTag :status="task.taskStatus" />
      </div>

      <!-- 任务信息 -->
      <div class="info-card">
        <h3>{{ task.taskTitle }}</h3>
        <div class="info-grid">
          <div class="info-item"><span>作业点</span><strong>{{ task.workPoint }}</strong></div>
          <div class="info-item"><span>地址</span><strong>{{ task.departure }} → {{ task.destination }}</strong></div>
          <div class="info-item"><span>预计时间</span><strong>{{ task.estimatedTime }}</strong></div>
          <div class="info-item"><span>车牌</span><strong>{{ task.plate }}</strong></div>
          <div class="info-item clickable" @click="callPhone('138-0002-0022')"><span>司机电话</span><strong>📞 138-0002-0022</strong></div>
          <div class="info-item clickable" @click="callPhone('139-0001-0001')"><span>调度员电话</span><strong>📞 139-0001-0001</strong></div>
          <div class="info-item"><span>物资提货单</span><strong style="color:#1a56db;cursor:pointer" @click="viewMaterial">MTL-2026-0704-0001</strong></div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button class="nav-btn" @click="navigate">🧭 导航到作业点</button>
        <button class="arrive-btn" @click="confirmArrive" :disabled="arrived">📍 {{ arrived ? '已到达' : '到达确认' }}</button>
        <button class="complete-btn" @click="showComplete = true" :disabled="!arrived">✅ 完成确认</button>
      </div>

      <!-- 照片上传 (完成时) -->
      <div v-if="showComplete" class="complete-section">
        <h4>上传现场照片</h4>
        <FileUpload :fileList="photos" @update:fileList="photos = $event" />
        <button class="submit-btn" @click="doComplete" :disabled="photos.length === 0">提交完成</button>
      </div>

      <!-- 异常反馈 -->
      <div class="feedback-section">
        <button class="feedback-btn" @click="showFeedback = !showFeedback">⚠️ 异常反馈</button>
        <div v-if="showFeedback" class="feedback-form">
          <select v-model="feedbackType"><option>路况异常</option><option>车辆故障</option><option>其他</option></select>
          <textarea v-model="feedbackContent" placeholder="描述异常情况..." rows="3"></textarea>
          <button class="submit-btn" @click="submitFeedback">提交反馈</button>
        </div>
      </div>

      <!-- 历史反馈 -->
      <div class="history-section">
        <h4 @click="showHistory = !showHistory">📝 历史反馈 {{ showHistory ? '▾' : '▸' }}</h4>
        <div v-if="showHistory && feedbackList.length" class="feedback-list">
          <div v-for="fb in feedbackList" :key="fb.feedbackId" class="fb-item">
            <strong>{{ fb.type }}</strong><small>{{ fb.time }}</small>
            <p>{{ fb.content }}</p>
          </div>
        </div>
        <p v-else-if="showHistory" class="empty-hint">暂无反馈</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from '../routerShim.js'
import { fetchTaskData } from '../data/mockTasks.js'
import StatusTag from '../components/StatusTag.vue'
import FileUpload from '../components/FileUpload.vue'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const error = ref('')
const task = ref(null)
const arrived = ref(false)
const showComplete = ref(false)
const photos = ref([])
const showFeedback = ref(false)
const feedbackType = ref('路况异常')
const feedbackContent = ref('')
const showHistory = ref(false)
const feedbackList = ref([])

async function loadData() {
  loading.value = true; error.value = ''
  try {
    const data = await fetchTaskData()
    task.value = data.detail || data.tasks?.[0]
    feedbackList.value = data.feedback || []
  } catch (e) {
    error.value = '数据加载失败'
  } finally { loading.value = false }
}

function goBack() { router.push('/task/list') }
function callPhone(phone) { window.open('tel:' + phone) }
function navigate() { alert('打开系统地图导航...') }
function confirmArrive() { arrived.value = true; alert('已确认到达作业点') }
function doComplete() { alert('任务完成！照片已上传'); showComplete.value = false; photos.value = [] }
function viewMaterial() { alert('跳转物资详情页...') }
function submitFeedback() {
  feedbackList.value.unshift({ feedbackId: 'FB-' + Date.now(), type: feedbackType.value, time: new Date().toISOString(), content: feedbackContent.value })
  alert('反馈已提交，已推送通知给调度员')
  showFeedback.value = false; feedbackContent.value = ''
}

onMounted(loadData)
</script>

<style scoped>
.task-execute { padding: 16px; height: 100%; overflow-y: auto; }
.top-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding: 12px; background: #fff; border-radius: 10px; border: 1px solid #e2e8f0; }
.back-btn { padding: 6px 12px; border: 1px solid #cbd5e1; border-radius: 7px; background: #fff; cursor: pointer; font-size: 13px; }
.info-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
.info-card h3 { margin: 0 0 16px; font-size: 16px; }
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.info-item { display: grid; gap: 4px; }
.info-item span { font-size: 11px; color: #94a3b8; }
.info-item strong { font-size: 13px; }
.clickable { cursor: pointer; }
.clickable:hover strong { color: #1a56db; }
.action-buttons { display: flex; gap: 12px; margin-bottom: 16px; }
.action-buttons button { flex: 1; padding: 12px; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; }
.nav-btn { background: #e6f0ff; color: #1a56db; }
.arrive-btn { background: #e6f7e6; color: #1a7a1a; }
.arrive-btn:disabled { background: #f1f5f9; color: #94a3b8; }
.complete-btn { background: #1a56db; color: #fff; }
.complete-btn:disabled { background: #f1f5f9; color: #94a3b8; }
.complete-section { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
.complete-section h4 { margin: 0 0 12px; }
.submit-btn { margin-top: 12px; padding: 8px 20px; background: #1a56db; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
.feedback-section { margin-bottom: 16px; }
.feedback-btn { padding: 10px 16px; background: #fff3e0; color: #d84315; border: 1px solid #ffcc80; border-radius: 10px; font-weight: 700; cursor: pointer; }
.feedback-form { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-top: 12px; display: grid; gap: 12px; }
.feedback-form select, .feedback-form textarea { padding: 8px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; }
.history-section { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; }
.history-section h4 { margin: 0; cursor: pointer; font-size: 14px; }
.feedback-list { margin-top: 12px; display: grid; gap: 10px; }
.fb-item { padding: 10px; background: #f8fafc; border-radius: 8px; }
.fb-item strong { font-size: 13px; margin-right: 8px; }
.fb-item small { font-size: 11px; color: #94a3b8; }
.fb-item p { margin: 4px 0 0; font-size: 12px; color: #64748b; }
.loading-state { padding: 40px; }
.sk-full { height: 300px; background: #e2e8f0; border-radius: 12px; animation: shimmer 1.5s infinite; }
@keyframes shimmer { 0% { opacity: .5; } 50% { opacity: 1; } 100% { opacity: .5; } }
.error-state { padding: 40px; text-align: center; color: #c62828; }
.error-state button { margin-top: 12px; padding: 8px 20px; background: #c62828; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
.empty-hint { color: #94a3b8; font-size: 13px; padding: 8px 0; }
</style>
