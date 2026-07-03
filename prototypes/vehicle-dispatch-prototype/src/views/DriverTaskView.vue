<template>
  <section class="page-grid driver-view">
    <header class="page-header compact-mobile">
      <div>
        <span class="eyebrow">司机移动端</span>
        <h1>任务接收与作业确认</h1>
        <p>司机可查看任务、接单、导航、到达打卡，并模拟拍照提交任务完成。</p>
      </div>
      <StatusTag :label="currentState" />
    </header>

    <section class="panel mobile-shell">
      <div class="phone-top">
        <strong>我的任务</strong>
        <span>{{ pendingCount }} 个待处理</span>
      </div>
      <div class="task-list mobile">
        <button
          v-for="task in tasks"
          :key="task.taskId"
          type="button"
          :class="{ active: selectedTask.taskId === task.taskId }"
          @click="selectedTask = task"
        >
          <span><strong>{{ task.workPointName }}</strong>{{ task.taskId }} / {{ task.distance }}</span>
          <StatusTag :label="task.status" />
        </button>
      </div>
    </section>

    <section class="panel map-panel">
      <div class="panel-title">
        <strong>导航预览</strong>
        <span>{{ selectedTask.distance }} / 预计 {{ selectedTask.estimatedArrivalTime }}</span>
      </div>
      <YardMap :markers="routeMarkers" selected-id="driver" :routes="['driver-route']">
        <div class="route-summary">
          <strong>{{ selectedTask.workPointName }}</strong>
          <span>路线已规划，避开禁入区域和排队区。</span>
        </div>
      </YardMap>
    </section>

    <aside class="panel side-panel">
      <div class="detail-card">
        <span class="eyebrow">任务详情</span>
        <h3>{{ selectedTask.taskId }}</h3>
        <p>{{ selectedTask.material }} / {{ selectedTask.contact }}</p>
        <dl class="detail-list">
          <div><dt>计划到达</dt><dd>{{ selectedTask.plannedArrivalTime }}</dd></div>
          <div><dt>预计到达</dt><dd>{{ selectedTask.estimatedArrivalTime }}</dd></div>
          <div><dt>优先级</dt><dd>{{ selectedTask.priority }}</dd></div>
        </dl>
      </div>

      <div class="operation-stack">
        <button class="primary-btn" type="button" :disabled="selectedTask.status !== '待接单'" @click="acceptTask">接收任务</button>
        <button class="secondary-btn" type="button" :disabled="!canArrive" @click="confirmArrival">到达确认</button>
        <button class="secondary-btn" type="button" :disabled="!canComplete" @click="completeTask">拍照提交完成</button>
      </div>

      <div class="upload-box" :class="{ done: photoUploaded }">
        <strong>{{ photoUploaded ? '现场照片已上传' : '现场照片待上传' }}</strong>
        <span>{{ photoUploaded ? '反馈编号：FB-NEW-2026' : '点击提交完成时模拟调用摄像头。' }}</span>
      </div>
    </aside>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import StatusTag from '../components/StatusTag.vue'
import YardMap from '../components/YardMap.vue'
import { driverTasks } from '../data/mockData'

const tasks = ref(driverTasks.map((item) => ({ ...item })))
const selectedTask = ref(tasks.value[0])
const toast = ref('')
const arrived = ref(false)
const photoUploaded = ref(false)

const pendingCount = computed(() => tasks.value.filter((item) => item.status !== '已完成').length)
const currentState = computed(() => {
  if (!selectedTask.value) return '暂无任务'
  if (photoUploaded.value || selectedTask.value.status === '已完成') return '已完成'
  if (arrived.value) return '已到达'
  return selectedTask.value.status
})
const canArrive = computed(() => selectedTask.value.status === '进行中' || selectedTask.value.status === '已接单')
const canComplete = computed(() => arrived.value && selectedTask.value.status !== '已完成')
const routeMarkers = computed(() => [
  { id: 'driver', plate: '当前位置', status: '任务中', x: 24, y: 70 },
  { id: 'target', plate: selectedTask.value.workPointName, status: '空闲', x: 62, y: 33 },
])

function acceptTask() {
  selectedTask.value.status = '进行中'
  toast.value = '任务已接收，语音播报和导航已启动。'
}

function confirmArrival() {
  arrived.value = true
  toast.value = '已自动定位打卡，到达信息已上传。'
}

function completeTask() {
  photoUploaded.value = true
  selectedTask.value.status = '已完成'
  selectedTask.value.feedbackId = 'FB-NEW-2026'
  toast.value = '任务完成照片和备注已提交，任务关闭。'
}
</script>
