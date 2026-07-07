<template>
  <section class="page mobile-page">
    <header class="page-head">
      <div class="title-block">
        <span class="eyebrow">移动作业 / 步骤执行</span>
        <h1>移动端步骤执行流</h1>
        <p>逐个展开步骤、记录工时物料与异常、拍照留痕，弱网时暂存到离线队列。</p>
      </div>
    </header>

    <div class="phone-shell">
      <article class="phone-frame">
        <div class="phone-notch"></div>
        <div class="phone-screen">
          <div v-if="uiState === 'loading'" class="state-box">
            <div class="skeleton-block" v-for="n in 3" :key="n">
              <span class="sk-line w50"></span>
              <span class="sk-line w90"></span>
            </div>
          </div>

          <div v-else-if="uiState === 'error'" class="state-box">
            <strong>步骤加载失败</strong>
            <p>请返回详情页重试。</p>
            <button @click="reload">重试</button>
          </div>

          <div v-else-if="uiState === 'empty'" class="state-box">
            <strong>未选择工单</strong>
            <p>请先从工单列表选择并进入详情。</p>
          </div>

          <template v-else>
            <!-- 进度条 -->
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
              <span>{{ doneCount }}/{{ steps.length }} 步完成</span>
            </div>

            <!-- 步骤流 -->
            <div class="step-flow">
              <div
                v-for="(step, idx) in steps"
                :key="step.step"
                class="exec-step"
                :class="{ done: step.done, current: idx === currentIdx, collapsed: idx !== currentIdx && !step.done }"
              >
                <div class="step-head" @click="toggleStep(idx)">
                  <span class="step-no">{{ step.step }}</span>
                  <div class="step-title">
                    <strong>{{ step.name }}</strong>
                    <small>{{ step.desc }}</small>
                  </div>
                  <span class="step-state">
                    <template v-if="step.done">✓ 完成</template>
                    <template v-else-if="idx === currentIdx">执行中</template>
                    <template v-else>待执行</template>
                  </span>
                </div>

                <div v-if="idx === currentIdx && !step.done" class="step-form">
                  <label>
                    <span>实际工时（小时）</span>
                    <input type="number" min="0" step="0.5" v-model.number="form.actualHours" placeholder="如 3.5" />
                  </label>
                  <label>
                    <span>消耗物料</span>
                    <input v-model="form.materials" placeholder="如 燃油滤芯×2,密封垫片×4" />
                  </label>
                  <label>
                    <span>异常情况</span>
                    <textarea v-model="form.findings" rows="3" placeholder="填写发现的异常、参数偏差或处置说明"></textarea>
                  </label>
                  <div class="step-photo">
                    <span class="label">拍照/录像留痕</span>
                    <FileUploader :file-list="photoFiles" @upload="onUpload" @delete="onDelete" @preview="onPreview" />
                  </div>
                  <div class="step-actions">
                    <button class="ghost" @click="saveOffline">离线暂存</button>
                    <button class="primary" @click="completeStep(idx)">完成并进入下一步</button>
                  </div>
                  <p v-if="savedHint" class="saved-hint">{{ savedHint }}</p>
                </div>
              </div>
            </div>

            <!-- 提交报工 -->
            <button class="cta-btn" :disabled="!allDone" @click="submitReport">
              {{ allDone ? '提交报工' : `还需完成 ${steps.length - doneCount} 步` }}
            </button>
          </template>
        </div>
      </article>
    </div>

    <ConfirmationDialog
      :open="confirmOpen"
      title="提交报工"
      message="将提交报工数据，弱网环境下会先暂存到离线队列等待同步。"
      @cancel="confirmOpen = false"
      @confirm="confirmSubmit"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import FileUploader from '@/components/FileUploader.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import {
  fetchWorkOrderSteps,
  appendOfflineQueue,
  submitAction,
} from '@/mock/api.js'

const uiState = ref('loading')
const steps = ref([])
const currentIdx = ref(0)
const photoFiles = ref([])
const savedHint = ref('')
const confirmOpen = ref(false)
const workOrder = ref(null)

const form = reactive({
  actualHours: null,
  materials: '',
  findings: '',
})

const doneCount = computed(() => steps.value.filter(s => s.done).length)
const progressPercent = computed(() => (steps.value.length ? Math.round((doneCount.value / steps.value.length) * 100) : 0))
const allDone = computed(() => steps.value.length > 0 && doneCount.value === steps.value.length)

function toggleStep(idx) {
  if (steps.value[idx].done) return
  currentIdx.value = idx
}

function onUpload(file) {
  photoFiles.value.push({
    id: `photo-${Date.now()}`,
    name: file.name,
    type: file.type || 'image',
    size: file.size,
    url: '#',
    uploadedAt: new Date().toLocaleString('zh-CN'),
  })
}

function onDelete(file) {
  photoFiles.value = photoFiles.value.filter(f => f.id !== file.id)
}

function onPreview(file) {
  alert(`预览：${file.name}`)
}

function saveOffline() {
  appendOfflineQueue({
    page: 'MobileWorkOrderExecute',
    recordId: workOrder.value?.id,
    step: currentIdx.value + 1,
    form: { ...form },
    photos: photoFiles.value.length,
  })
  savedHint.value = `已暂存第 ${currentIdx.value + 1} 步数据到离线队列（待同步）`
  setTimeout(() => (savedHint.value = ''), 3000)
}

function completeStep(idx) {
  if (!form.actualHours && form.actualHours !== 0) {
    alert('请填写实际工时')
    return
  }
  steps.value[idx].done = true
  // 重置表单
  form.actualHours = null
  form.materials = ''
  form.findings = ''
  photoFiles.value = []
  // 移动到下一步
  const next = steps.value.findIndex((s, i) => i > idx && !s.done)
  currentIdx.value = next === -1 ? steps.value.length - 1 : next
}

async function reload() {
  uiState.value = 'loading'
  try {
    const raw = sessionStorage.getItem('pms-current-wo')
    workOrder.value = raw ? JSON.parse(raw) : null
    const data = await fetchWorkOrderSteps()
    // 复制一份数据，避免污染 mock
    steps.value = data.map(s => ({ ...s, done: false }))
    currentIdx.value = 0
    uiState.value = 'success'
  } catch (e) {
    uiState.value = 'error'
  }
}

function submitReport() {
  if (!allDone.value) return
  confirmOpen.value = true
}

async function confirmSubmit() {
  confirmOpen.value = false
  // 弱网：先入离线队列
  appendOfflineQueue({
    page: 'MobileWorkOrderExecute',
    recordId: workOrder.value?.id,
    action: '提交报工',
    time: new Date().toISOString(),
  })
  // 再调提交
  await submitAction('submitWorkReport', { id: workOrder.value?.id })
  alert('报工已提交，已暂存至离线同步队列')
}

onMounted(reload)
</script>

<style scoped>
.mobile-page { display: grid; gap: 16px; }
.page-head { border: 1px solid #d9e4ef; border-radius: 10px; padding: 18px 20px; background: #fff; }
.eyebrow { color: #1e6fd9; font-size: 12px; font-weight: 900; }
.page-head h1 { margin: 6px 0 6px; font-size: 22px; color: #172033; }
.page-head p { margin: 0; color: #64748b; font-size: 13px; max-width: 760px; }

.phone-shell { display: flex; justify-content: center; padding: 8px 0; }
.phone-frame {
  width: 390px; max-width: 100%;
  border: 12px solid #172033; border-radius: 34px; background: #172033;
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.22); overflow: hidden;
}
.phone-notch { width: 140px; height: 22px; margin: 0 auto; background: #172033; border-radius: 0 0 14px 14px; }
.phone-screen { background: #eef3f8; min-height: 640px; padding: 14px; display: flex; flex-direction: column; gap: 12px; }

.state-box { display: grid; gap: 8px; padding: 24px 12px; justify-items: center; text-align: center; }
.state-box strong { color: #172033; font-size: 16px; }
.state-box p { color: #64748b; margin: 0; font-size: 13px; line-height: 1.5; }
.state-box button { border: 1px solid #1e6fd9; border-radius: 8px; padding: 8px 16px; background: #1e6fd9; color: #fff; font-weight: 900; font-size: 13px; }
.skeleton-block { background: #fff; border-radius: 10px; padding: 14px; display: grid; gap: 8px; }
.sk-line { height: 12px; border-radius: 6px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }
.sk-line.w50 { width: 50%; } .sk-line.w90 { width: 90%; }

.progress-bar { position: relative; height: 28px; border-radius: 999px; background: #d9e4ef; overflow: hidden; display: grid; align-items: center; padding: 0 12px; }
.progress-fill { position: absolute; left: 0; top: 0; bottom: 0; background: #1e6fd9; transition: width .3s; }
.progress-bar span { position: relative; color: #fff; font-size: 12px; font-weight: 900; text-shadow: 0 1px 2px rgba(0,0,0,.2); }

.step-flow { display: grid; gap: 10px; }
.exec-step { background: #fff; border: 1px solid #d9e4ef; border-radius: 10px; overflow: hidden; }
.exec-step.done { border-color: #c5e8d2; background: #f6fcf8; }
.exec-step.current { border-color: #1e6fd9; box-shadow: 0 0 0 2px rgba(30,111,217,.15); }
.step-head { display: grid; grid-template-columns: 28px 1fr auto; gap: 10px; align-items: center; padding: 12px 13px; cursor: pointer; }
.step-no { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; background: #1e6fd9; color: #fff; font-weight: 900; font-size: 12px; }
.exec-step.done .step-no { background: #11734d; }
.step-title strong { font-size: 13px; color: #172033; display: block; }
.step-title small { color: #64748b; font-size: 11px; }
.step-state { font-size: 11px; font-weight: 900; color: #64748b; white-space: nowrap; }
.exec-step.done .step-state { color: #11734d; }
.exec-step.current .step-state { color: #1e6fd9; }

.step-form { padding: 0 13px 13px; display: grid; gap: 10px; border-top: 1px solid #eef3f8; }
.step-form label { display: grid; gap: 5px; }
.step-form span { font-size: 12px; color: #53657c; font-weight: 800; }
.step-form input, .step-form textarea {
  width: 100%; border: 1px solid #cbd7e4; border-radius: 7px; padding: 9px 10px;
  background: #fff; color: #172033; font-size: 13px;
}
.step-form textarea { resize: vertical; }
.step-photo .label { display: block; font-size: 12px; color: #53657c; font-weight: 800; margin-bottom: 5px; }

.step-actions { display: grid; grid-template-columns: 1fr 1.4fr; gap: 8px; }
.step-actions button { border-radius: 8px; padding: 10px; font-weight: 900; font-size: 13px; border: 1px solid #cfdae6; }
.step-actions .ghost { background: #f6f9fc; color: #24415f; }
.step-actions .primary { background: #1e6fd9; color: #fff; border-color: #1e6fd9; }

.saved-hint { margin: 0; padding: 6px 10px; background: #fff3e6; color: #d4743f; border-radius: 6px; font-size: 12px; font-weight: 800; }

.cta-btn { margin-top: 4px; border: 0; border-radius: 10px; padding: 14px; background: #1e6fd9; color: #fff; font-weight: 900; font-size: 15px; }
.cta-btn:disabled { background: #b9c8d8; cursor: not-allowed; }
</style>
