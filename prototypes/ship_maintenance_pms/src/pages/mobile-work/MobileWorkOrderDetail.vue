<template>
  <section class="page mobile-page">
    <header class="page-head">
      <div class="title-block">
        <span class="eyebrow">移动作业 / 工单详情</span>
        <h1>移动端工单详情</h1>
        <p>展示工单基本信息、设备信息、操作步骤、物料清单与安全注意事项，附件可本地查看。</p>
      </div>
    </header>

    <div class="phone-shell">
      <article class="phone-frame">
        <div class="phone-notch"></div>
        <div class="phone-screen">
          <div v-if="uiState === 'loading'" class="state-box">
            <div class="skeleton-block" v-for="n in 3" :key="n">
              <span class="sk-line w40"></span>
              <span class="sk-line w90"></span>
              <span class="sk-line w70"></span>
            </div>
          </div>

          <div v-else-if="uiState === 'error'" class="state-box">
            <strong>工单加载失败</strong>
            <p>请检查网络或返回列表重选工单。</p>
            <button @click="reload">重试</button>
          </div>

          <div v-else-if="uiState === 'empty'" class="state-box">
            <strong>未选择工单</strong>
            <p>请从工单列表中选择一条记录。</p>
          </div>

          <template v-else>
            <!-- 工单基本信息 -->
            <div class="detail-card">
              <div class="card-top">
                <span class="wo-id">{{ workOrder.id }}</span>
                <StatusBadge :label="workOrder.status" />
              </div>
              <h2 class="equip-title">{{ workOrder.equipment }}</h2>
              <div class="info-grid">
                <div><span>类型</span><b>{{ workOrder.type }}</b></div>
                <div><span>船舶</span><b>{{ workOrder.ship }}</b></div>
                <div><span>计划日期</span><b>{{ workOrder.planDate }}</b></div>
                <div><span>优先级</span><b :class="priorityTone(workOrder.priority)">{{ workOrder.priority }}</b></div>
                <div><span>执行人</span><b>{{ workOrder.executor }}</b></div>
                <div><span>提交时间</span><b>{{ workOrder.submittedAt }}</b></div>
              </div>
            </div>

            <!-- 设备信息 -->
            <div class="detail-card">
              <h3 class="card-title">设备信息</h3>
              <div class="equip-info">
                <div><span>设备编码</span><b>{{ equipCode }}</b></div>
                <div><span>设备名称</span><b>{{ equipName }}</b></div>
                <div><span>所在位置</span><b>{{ equipLocation }}</b></div>
              </div>
            </div>

            <!-- 操作步骤 -->
            <div class="detail-card">
              <h3 class="card-title">操作步骤 <em>{{ doneStepsCount }}/{{ workOrderSteps.length }}</em></h3>
              <ol class="step-list">
                <li v-for="step in workOrderSteps" :key="step.step" :class="{ done: step.done }">
                  <span class="step-no">{{ step.step }}</span>
                  <div class="step-body">
                    <strong>{{ step.name }}</strong>
                    <p>{{ step.desc }}</p>
                  </div>
                  <span class="step-mark">{{ step.done ? '已完成' : '待执行' }}</span>
                </li>
              </ol>
            </div>

            <!-- 物料清单 -->
            <div class="detail-card">
              <h3 class="card-title">物料清单</h3>
              <ul v-if="materials.length" class="mat-list">
                <li v-for="(m, i) in materials" :key="i">
                  <span>{{ m.name }}</span>
                  <b>×{{ m.qty }}</b>
                </li>
              </ul>
              <p v-else class="empty-note">暂无消耗物料</p>
            </div>

            <!-- 安全注意事项 -->
            <div class="detail-card safe-card">
              <h3 class="card-title">安全注意事项</h3>
              <ul class="safe-list">
                <li>作业前必须断电、挂牌、穿戴PPE</li>
                <li>更换备件时确认设备完全泄压</li>
                <li>试运行阶段人员保持安全距离</li>
                <li>异常情况立即停止并上报机务主管</li>
              </ul>
            </div>

            <!-- 附件本地查看 -->
            <div class="detail-card">
              <h3 class="card-title">附件（{{ attachments.length }}）</h3>
              <FileUploader :file-list="attachments" readonly @preview="onPreview" />
            </div>

            <!-- 开始执行按钮 -->
            <button class="cta-btn" @click="startExecute">开始执行</button>
          </template>
        </div>
      </article>
    </div>

    <ConfirmationDialog
      :open="confirmOpen"
      title="开始执行工单"
      message="将进入步骤执行流程，执行过程中可离线暂存报工数据。"
      @cancel="confirmOpen = false"
      @confirm="confirmStart"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import FileUploader from '@/components/FileUploader.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { fetchWorkOrderSteps } from '@/mock/api.js'

const uiState = ref('loading')
const workOrder = ref(null)
const workOrderSteps = ref([])
const confirmOpen = ref(false)

const materials = computed(() => workOrder.value?.reportData?.materials || [])
const doneStepsCount = computed(() => workOrderSteps.value.filter(s => s.done).length)
const equipCode = computed(() => (workOrder.value?.equipment || '').split(' ')[0] || '—')
const equipName = computed(() => (workOrder.value?.equipment || '').split(' ').slice(1).join(' ') || '—')
const equipLocation = computed(() => {
  // 根据设备编码推断位置（原型模拟）
  const code = equipCode.value
  if (code.includes('ME')) return '机舱底层'
  if (code.includes('GEN')) return '机舱上平台'
  if (code.includes('FP')) return '消防泵舱'
  if (code.includes('RUD')) return '舵机舱'
  return '—'
})

// 模拟已有附件
const attachments = computed(() => {
  const n = workOrder.value?.attachments || 0
  const list = []
  for (let i = 1; i <= n; i++) {
    list.push({
      id: `att-${i}`,
      name: `现场照片_${i}.jpg`,
      type: 'image',
      size: 1024 * 800 + i * 1024,
      url: '#',
      uploadedAt: workOrder.value?.submittedAt || '',
    })
  }
  return list
})

function priorityTone(p) {
  if (p === '高') return 'high'
  if (p === '中') return 'mid'
  return 'low'
}

function onPreview(file) {
  alert(`预览附件：${file.name}`)
}

async function reload() {
  uiState.value = 'loading'
  try {
    // 优先从 sessionStorage 读取选中工单
    const raw = sessionStorage.getItem('pms-current-wo')
    if (!raw) {
      uiState.value = 'empty'
      return
    }
    workOrder.value = JSON.parse(raw)
    workOrderSteps.value = await fetchWorkOrderSteps()
    uiState.value = 'success'
  } catch (e) {
    uiState.value = 'error'
  }
}

function startExecute() {
  confirmOpen.value = true
}

function confirmStart() {
  confirmOpen.value = false
  alert('已进入步骤执行流程（原型占位）')
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
.sk-line.w40 { width: 40%; } .sk-line.w90 { width: 90%; } .sk-line.w70 { width: 70%; }

.detail-card { background: #fff; border: 1px solid #d9e4ef; border-radius: 10px; padding: 13px 14px; display: grid; gap: 10px; }
.card-top { display: flex; justify-content: space-between; align-items: center; }
.wo-id { font-weight: 900; color: #1e6fd9; font-size: 13px; }
.equip-title { margin: 0; font-size: 16px; color: #172033; }
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px; }
.info-grid div { display: grid; gap: 2px; }
.info-grid span { color: #64748b; font-size: 11px; }
.info-grid b { font-size: 13px; color: #172033; font-weight: 800; }
.info-grid b.high { color: #b4232d; } .info-grid b.mid { color: #8a5a00; } .info-grid b.low { color: #11734d; }

.card-title { margin: 0; font-size: 14px; color: #172033; display: flex; justify-content: space-between; align-items: center; }
.card-title em { font-size: 11px; color: #64748b; font-style: normal; font-weight: 800; }

.equip-info { display: grid; gap: 6px; }
.equip-info div { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #eef3f8; }
.equip-info span { color: #64748b; font-size: 12px; }
.equip-info b { font-size: 13px; color: #172033; }

.step-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.step-list li { display: grid; grid-template-columns: 28px 1fr auto; gap: 10px; align-items: center; padding: 8px 10px; border: 1px solid #e2eaf3; border-radius: 8px; background: #f8fbfe; }
.step-list li.done { background: #f0f9f3; border-color: #c5e8d2; }
.step-no { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; background: #1e6fd9; color: #fff; font-weight: 900; font-size: 12px; }
.step-list li.done .step-no { background: #11734d; }
.step-body strong { font-size: 13px; color: #172033; display: block; }
.step-body p { margin: 2px 0 0; font-size: 12px; color: #64748b; }
.step-mark { font-size: 11px; font-weight: 900; color: #64748b; }
.step-list li.done .step-mark { color: #11734d; }

.mat-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.mat-list li { display: flex; justify-content: space-between; padding: 8px 10px; border: 1px solid #e2eaf3; border-radius: 8px; background: #f8fbfe; font-size: 13px; }
.mat-list b { color: #1e6fd9; font-weight: 900; }
.empty-note { margin: 0; color: #8b9aab; font-size: 12px; text-align: center; padding: 8px; }

.safe-card { border-left: 3px solid #d4743f; }
.safe-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.safe-list li { padding-left: 18px; position: relative; font-size: 12px; color: #3e5068; line-height: 1.5; }
.safe-list li::before { content: "!"; position: absolute; left: 0; top: 0; width: 14px; height: 14px; border-radius: 50%; background: #d4743f; color: #fff; font-size: 10px; font-weight: 900; display: grid; place-items: center; }

.cta-btn { margin-top: 4px; border: 0; border-radius: 10px; padding: 14px; background: #1e6fd9; color: #fff; font-weight: 900; font-size: 15px; }
.cta-btn:active { transform: scale(0.98); }
</style>
