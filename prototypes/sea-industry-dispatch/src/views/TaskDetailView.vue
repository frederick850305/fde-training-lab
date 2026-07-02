<template>
  <section class="task-detail-view" aria-labelledby="detail-title">
    <ViewHeading
      eyebrow="P1 Prototype Page · 司机端"
      title="任务详情"
      title-id="detail-title"
      description="展示任务的详细信息，包括作业点位置、任务要求、物资信息等。"
    />

    <div v-if="pageState === 'loading'" class="state-box"><span class="spinner"></span><p>加载任务详情...</p></div>
    <div v-else-if="pageState === 'error'" class="state-box error"><span>⚠️</span><p>加载失败</p><button class="retry-btn" @click="retry">重试</button></div>

    <template v-else>
      <button type="button" class="back-btn" @click="goBack">← 返回任务列表</button>

      <!-- 任务头部 -->
      <div class="detail-header">
        <div>
          <div class="header-top">
            <h3>{{ task.type }} · {{ task.id }}</h3>
            <span class="priority-badge" :class="'p-' + task.priority">{{ priorityLabel }}</span>
            <span class="status-badge" :class="'s-' + task.status">{{ statusLabel }}</span>
          </div>
          <p class="header-desc">{{ task.description }}</p>
        </div>
        <div class="header-meta">
          <span>🚛 {{ task.vehiclePlate }}（{{ task.vehicleType }}）</span>
          <span>👤 {{ task.driver }} · {{ task.phone }}</span>
          <span>📦 {{ task.loadCapacity }}</span>
          <span>⏰ 截止 {{ task.deadline }}</span>
        </div>
      </div>

      <div class="detail-grid">
        <!-- 作业点详情 -->
        <div class="detail-card">
          <span class="card-title">📍 作业点详情</span>
          <div class="map-placeholder">
            <div class="map-pin">📍</div>
            <span>{{ task.jobSite.address }}</span>
          </div>
          <div class="info-rows">
            <div class="info-row"><span>地址</span><strong>{{ task.jobSite.address }}</strong></div>
            <div class="info-row"><span>联系人</span>{{ task.jobSite.contact }}</div>
            <div class="info-row"><span>电话</span>{{ task.jobSite.contactPhone }}</div>
            <div class="info-row"><span>预计到达</span><strong style="color:#1d4ed8">{{ task.jobSite.eta }}</strong></div>
          </div>
        </div>

        <!-- 物资清单 -->
        <div class="detail-card">
          <span class="card-title">📋 物资 / 要求清单</span>
          <div class="material-progress">
            <div class="prog-bar"><div class="prog-fill" :style="{ width: materialProgress + '%' }"></div></div>
            <span>{{ checkedCount }}/{{ task.materials.length }} 项已完成</span>
          </div>
          <div class="material-list">
            <label
              v-for="(m, i) in task.materials"
              :key="i"
              class="material-item"
              :class="{ done: m.checked }"
            >
              <input type="checkbox" v-model="m.checked" :disabled="task.status === 'completed'" />
              <span class="mat-name">{{ m.name }}</span>
              <span class="mat-qty">{{ m.quantity }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- 时间线 -->
      <div class="detail-card full-width">
        <span class="card-title">🕐 任务时间线</span>
        <div class="timeline">
          <div v-for="(t, i) in task.timeline" :key="i" class="tl-item" :class="{ last: i === task.timeline.length - 1 }">
            <div class="tl-dot"></div>
            <div class="tl-content">
              <div class="tl-head">
                <strong>{{ t.event }}</strong>
                <span>{{ t.time }}</span>
              </div>
              <p>{{ t.detail }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="bottom-bar">
        <button v-if="task.status === 'pending'" type="button" class="primary-btn" @click="startTask">▶ 开始任务</button>
        <button v-if="task.status === 'inProgress'" type="button" class="primary-btn" @click="completeTask">✓ 完成任务</button>
        <button v-if="task.status === 'inProgress'" type="button" class="ghost-btn" @click="pauseTask">⏸ 暂停</button>
        <button v-if="task.status === 'completed'" type="button" class="ghost-btn" @click="viewReport">📄 查看报告</button>
        <button type="button" class="ghost-btn" @click="uploadEvidence">📷 上传凭证</button>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import ViewHeading from '../components/ViewHeading.vue'
import { taskDetail } from '../data/taskDetailMock'

const pageState = ref('loading')
const task = ref({ ...taskDetail, materials: taskDetail.materials.map(m => ({ ...m })) })

const statusLabel = computed(() => ({ pending: '待执行', inProgress: '进行中', completed: '已完成' }[task.value.status] || task.value.status))
const priorityLabel = computed(() => ({ high: '高', medium: '中', low: '低' }[task.value.priority]))

const checkedCount = computed(() => task.value.materials.filter(m => m.checked).length)
const materialProgress = computed(() => task.value.materials.length ? Math.round(checkedCount.value / task.value.materials.length * 100) : 0)

function startTask() { task.value.status = 'inProgress'; task.value.timeline.push({ time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }), event: '开始执行', detail: '司机开始执行任务' }) }
function completeTask() { task.value.status = 'completed'; task.value.timeline.push({ time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }), event: '任务完成', detail: '所有物资装载完毕' }) }
function pauseTask() { alert('任务已暂停') }
function viewReport() { alert('查看任务完成报告') }
function uploadEvidence() { alert('打开相机/相册上传凭证') }
function goBack() { alert('返回任务列表（原型演示）') }
function retry() { pageState.value = 'loading'; setTimeout(() => pageState.value = 'success', 500) }

onMounted(() => { setTimeout(() => pageState.value = 'success', 400) })
</script>

<style scoped>
.task-detail-view { margin-top: 16px; }
.state-box { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px; border: 1px solid #e2e8f0; border-radius: 10px; background: #fff; }
.state-box p { margin-top: 8px; color: #64748b; }
.state-box.error p { color: #dc2626; }
.spinner { width: 28px; height: 28px; border: 3px solid #e2e8f0; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.retry-btn { margin-top: 8px; padding: 6px 16px; border: 1px solid #2563eb; border-radius: 6px; background: #fff; color: #2563eb; font-weight: 700; cursor: pointer; }

.back-btn { margin-bottom: 12px; border: none; background: transparent; color: #2563eb; font-weight: 700; cursor: pointer; font-size: 13px; }

.detail-header { padding: 16px 20px; border: 1px solid #e2e8f0; border-radius: 10px; background: #fff; margin-bottom: 14px; }
.header-top { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 6px; }
.header-top h3 { margin: 0; font-size: 18px; }
.priority-badge { padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 900; }
.priority-badge.p-high { background: #fee2e2; color: #dc2626; }
.priority-badge.p-medium { background: #fef3c7; color: #d97706; }
.priority-badge.p-low { background: #dcfce7; color: #16a34a; }
.status-badge { padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 900; }
.status-badge.s-pending { background: #fef3c7; color: #d97706; }
.status-badge.s-inProgress { background: #dbeafe; color: #2563eb; }
.status-badge.s-completed { background: #dcfce7; color: #16a34a; }
.header-desc { margin: 6px 0; color: #475569; font-size: 13px; }
.header-meta { display: flex; gap: 14px; flex-wrap: wrap; font-size: 12px; color: #94a3b8; }

.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
.detail-card { border: 1px solid #e2e8f0; border-radius: 10px; background: #fff; padding: 16px 18px; }
.detail-card.full-width { grid-column: 1 / -1; }
.card-title { display: block; margin-bottom: 12px; color: #0f172a; font-size: 14px; font-weight: 800; }

.map-placeholder {
  height: 120px; border-radius: 8px; background: linear-gradient(135deg, #dbeafe, #eff6ff);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  border: 1px solid #93c5fd; margin-bottom: 12px;
}
.map-pin { font-size: 28px; }
.map-placeholder span { font-size: 12px; color: #475569; font-weight: 700; margin-top: 4px; }

.info-rows { display: grid; gap: 0; }
.info-row { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid #f8fafc; font-size: 13px; }
.info-row span { color: #94a3b8; }
.info-row strong { color: #0f172a; }

.material-progress { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; font-size: 12px; color: #64748b; }
.prog-bar { flex: 1; height: 6px; border-radius: 3px; background: #f1f5f9; overflow: hidden; }
.prog-fill { height: 100%; border-radius: 3px; background: #16a34a; transition: width 0.3s; }

.material-list { display: grid; gap: 4px; }
.material-item {
  display: flex; align-items: center; gap: 8px; padding: 8px 10px;
  border-radius: 6px; cursor: pointer; transition: background 0.12s;
}
.material-item:hover { background: #f8fafc; }
.material-item.done { opacity: 0.5; }
.material-item.done .mat-name { text-decoration: line-through; }
.mat-name { flex: 1; font-size: 13px; color: #0f172a; }
.mat-qty { font-size: 12px; color: #94a3b8; font-weight: 700; }

.timeline { position: relative; padding-left: 20px; }
.timeline::before { content: ''; position: absolute; left: 7px; top: 8px; bottom: 8px; width: 2px; background: #e2e8f0; }
.tl-item { position: relative; padding-bottom: 16px; }
.tl-item.last { padding-bottom: 0; }
.tl-dot {
  position: absolute; left: -16px; top: 4px;
  width: 12px; height: 12px; border-radius: 50%; background: #2563eb; border: 2px solid #fff;
  box-shadow: 0 0 0 2px #2563eb;
}
.tl-head { display: flex; justify-content: space-between; align-items: center; }
.tl-head strong { font-size: 13px; color: #0f172a; }
.tl-head span { font-size: 11px; color: #94a3b8; }
.tl-content p { margin: 2px 0 0; font-size: 12px; color: #64748b; }

.bottom-bar {
  display: flex; gap: 10px; justify-content: flex-end; margin-top: 14px;
  padding: 14px 20px; border: 1px solid #e2e8f0; border-radius: 10px; background: #fff;
}
.primary-btn { padding: 10px 22px; border: none; border-radius: 8px; background: #1d4ed8; color: #fff; font-weight: 800; font-size: 14px; cursor: pointer; }
.ghost-btn { padding: 10px 18px; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; color: #475569; font-weight: 700; font-size: 13px; cursor: pointer; }

@media (max-width: 700px) { .detail-grid { grid-template-columns: 1fr; } }
</style>
