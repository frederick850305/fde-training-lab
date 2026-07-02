<template>
  <section class="dispatch-dialog-view" aria-labelledby="dispatch-dialog-title">
    <ViewHeading
      eyebrow="P1 Prototype Page · 现场调度"
      title="现场派车"
      title-id="dispatch-dialog-title"
      description="为选中的车辆分配任务，选择用车申请、输入作业点、设置优先级，一键下发至司机移动端。"
    />

    <!-- 派车表单卡片 -->
    <div class="dispatch-card">
      <!-- 已选车辆 -->
      <div class="card-section">
        <span class="section-label">已选车辆（{{ selectedVehicles.length }} 辆）</span>
        <div v-if="selectedVehicles.length === 0" class="no-vehicles">
          <p>暂无选中车辆，请从「车辆筛选」页面选择车辆后再派车。</p>
        </div>
        <div v-else class="vehicle-chips">
          <span
            v-for="v in selectedVehicles"
            :key="v.id"
            class="vehicle-chip"
          >
            <strong>{{ v.plate }}</strong>
            <small>{{ v.type }} · {{ v.area }}</small>
            <button type="button" class="chip-remove" @click="removeVehicle(v.id)" aria-label="移除">×</button>
          </span>
        </div>
      </div>

      <!-- 任务表单 -->
      <div class="card-section">
        <span class="section-label">任务信息</span>

        <div class="form-grid">
          <!-- 紧急派车开关 -->
          <div class="form-item full-width">
            <label class="toggle-row">
              <input type="checkbox" v-model="isEmergency" />
              <span>🚨 紧急派车（跳过用车申请，手动创建任务）</span>
            </label>
          </div>

          <!-- 用车申请（非紧急模式） -->
          <div v-if="!isEmergency" class="form-item">
            <label>用车申请 <span class="required">*</span></label>
            <select v-model="form.applicationId" :disabled="isSubmitting">
              <option value="">-- 请选择待派发申请 --</option>
              <option
                v-for="app in pendingApplications"
                :key="app.id"
                :value="app.id"
              >
                {{ app.id }} — {{ app.requester }}（{{ app.material }}）
              </option>
            </select>
            <small v-if="selectedApplication" class="form-hint">
              申请方：{{ selectedApplication.requester }} · 物料：{{ selectedApplication.material }} · 截止：{{ selectedApplication.deadline }}
            </small>
          </div>

          <!-- 紧急模式：手动输入 -->
          <template v-if="isEmergency">
            <div class="form-item">
              <label>任务类型 <span class="required">*</span></label>
              <select v-model="form.emergencyType" :disabled="isSubmitting">
                <option value="">-- 选择类型 --</option>
                <option value="装车作业">装车作业</option>
                <option value="卸车作业">卸车作业</option>
                <option value="转运作业">转运作业</option>
              </select>
            </div>
            <div class="form-item">
              <label>物料描述</label>
              <input v-model="form.emergencyMaterial" type="text" placeholder="如：应急备件 5箱" :disabled="isSubmitting" />
            </div>
          </template>

          <!-- 作业点 -->
          <div class="form-item">
            <label>作业点 <span class="required">*</span></label>
            <div class="input-with-btn">
              <input
                v-model="form.jobSite"
                type="text"
                placeholder="输入作业点地址或点击右侧地图选点"
                :disabled="isSubmitting"
              />
              <button type="button" class="map-pick-btn" @click="simulateMapPick" :disabled="isSubmitting" title="地图选点">
                🗺️
              </button>
            </div>
          </div>

          <!-- 优先级 -->
          <div class="form-item">
            <label>优先级</label>
            <div class="priority-radio-group">
              <label
                v-for="p in priorityOptions"
                :key="p.value"
                class="priority-radio"
                :class="{ checked: form.priority === p.value }"
              >
                <input type="radio" v-model="form.priority" :value="p.value" :disabled="isSubmitting" />
                <span :style="{ color: p.color }">{{ p.label }}</span>
              </label>
            </div>
          </div>

          <!-- 预计到达时间 -->
          <div class="form-item">
            <label>预计到达时间</label>
            <div class="eta-display">{{ computedEta }}</div>
            <small class="form-hint">高优先级任务预估时间缩短 30%</small>
          </div>

          <!-- 备注 -->
          <div class="form-item full-width">
            <label>派车备注</label>
            <textarea
              v-model="form.remark"
              rows="2"
              placeholder="输入额外说明信息…"
              :disabled="isSubmitting"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- 提交状态横幅 -->
      <div v-if="submitState === 'error'" class="submit-banner error">
        ⚠️ 下发失败：网络异常，请重试
      </div>
      <div v-if="submitState === 'success'" class="submit-banner success">
        ✅ 已成功派车给 {{ selectedVehicles.map(v => v.plate).join('、') }}
      </div>

      <!-- 底部按钮 -->
      <div class="card-footer">
        <button type="button" class="ghost-btn" @click="handleCancel" :disabled="isSubmitting">取消</button>
        <button
          type="button"
          class="primary-btn"
          :disabled="!isFormValid || isSubmitting"
          @click="handleSubmit"
        >
          <span v-if="isSubmitting" class="btn-spinner"></span>
          {{ isSubmitting ? '正在下发...' : '下发任务' }}
        </button>
      </div>
    </div>

    <!-- 派发日志 -->
    <div v-if="dispatchLog.length" class="dispatch-log">
      <span class="section-label">派发日志</span>
      <div class="log-list">
        <div v-for="log in dispatchLog" :key="log.id" class="log-item">
          <span class="log-time">{{ log.time }}</span>
          <span>{{ log.message }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import ViewHeading from '../components/ViewHeading.vue'
import { pendingApplications, preselectedVehicles } from '../data/dispatchDialogMock'

const selectedVehicles = ref([...preselectedVehicles])
const isEmergency = ref(false)
const isSubmitting = ref(false)
const submitState = ref(null) // null | 'success' | 'error'
const dispatchLog = ref([])

const form = reactive({
  applicationId: '',
  jobSite: '',
  priority: 'medium',
  remark: '',
  emergencyType: '',
  emergencyMaterial: '',
})

const priorityOptions = [
  { value: 'high', label: '🔴 高', color: '#dc2626' },
  { value: 'medium', label: '🟡 中', color: '#d97706' },
  { value: 'low', label: '🟢 低', color: '#16a34a' },
]

const selectedApplication = computed(() => {
  if (!form.applicationId) return null
  return pendingApplications.find((a) => a.id === form.applicationId) || null
})

const computedEta = computed(() => {
  const baseMinutes = 25
  if (form.priority === 'high') return `${Math.round(baseMinutes * 0.7)} 分钟`
  if (form.priority === 'low') return `${Math.round(baseMinutes * 1.3)} 分钟`
  return `${baseMinutes} 分钟`
})

const isFormValid = computed(() => {
  if (selectedVehicles.value.length === 0) return false
  if (!isEmergency.value && !form.applicationId) return false
  if (isEmergency.value && !form.emergencyType) return false
  if (!form.jobSite.trim()) return false
  return true
})

// 选择用车申请时自动填入作业点
const autoFillJobSite = () => {
  if (selectedApplication.value) {
    form.jobSite = selectedApplication.value.jobSite
  }
}

const originalForm = { ...form }
const handleApplicationChange = () => {
  autoFillJobSite()
}

// 监听申请变化
const watchApplication = () => {
  const appId = form.applicationId
  if (appId && appId !== originalForm.applicationId) {
    autoFillJobSite()
    originalForm.applicationId = appId
  }
}

function removeVehicle(id) {
  const idx = selectedVehicles.value.findIndex((v) => v.id === id)
  if (idx >= 0) selectedVehicles.value.splice(idx, 1)
}

function simulateMapPick() {
  const mockLocations = [
    'B区-成品仓 3号装货口', 'C区-装卸点3', 'A区-原料仓 1号口',
    'D区-作业区', 'C区-装卸点2',
  ]
  const picked = mockLocations[Math.floor(Math.random() * mockLocations.length)]
  form.jobSite = picked
}

function handleCancel() {
  form.applicationId = ''
  form.jobSite = ''
  form.priority = 'medium'
  form.remark = ''
  form.emergencyType = ''
  form.emergencyMaterial = ''
  isEmergency.value = false
  submitState.value = null
}

async function handleSubmit() {
  if (!isFormValid.value) return

  isSubmitting.value = true
  submitState.value = null

  // 模拟 API 调用
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // 模拟成功
  submitState.value = 'success'
  isSubmitting.value = false

  const now = new Date().toLocaleTimeString('zh-CN')
  dispatchLog.value.unshift({
    id: Date.now(),
    time: now,
    message: `已派车 ${selectedVehicles.value.map(v => v.plate).join('、')} → ${form.jobSite}（${form.priority === 'high' ? '高' : form.priority === 'low' ? '低' : '中'}优先级）`,
  })

  // 3秒后清除成功状态
  setTimeout(() => { submitState.value = null }, 3000)
}
</script>

<style scoped>
.dispatch-dialog-view { margin-top: 16px; }

.dispatch-card {
  border: 1px solid #e2e8f0; border-radius: 10px;
  background: #ffffff; overflow: hidden;
}

.card-section {
  padding: 16px 20px; border-bottom: 1px solid #f1f5f9;
}
.card-section:last-of-type { border-bottom: none; }

.section-label {
  display: block; margin-bottom: 10px;
  color: #2563eb; font-size: 12px; font-weight: 900;
  text-transform: uppercase; letter-spacing: 0.5px;
}

/* 车辆标签 */
.vehicle-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.vehicle-chip {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 10px; border: 1px solid #93c5fd; border-radius: 8px;
  background: #eff6ff;
}
.vehicle-chip strong { font-size: 13px; color: #0f172a; }
.vehicle-chip small { font-size: 11px; color: #64748b; }
.chip-remove {
  border: none; background: transparent; color: #94a3b8;
  font-size: 16px; cursor: pointer; padding: 0 2px; line-height: 1;
}
.chip-remove:hover { color: #dc2626; }
.no-vehicles { padding: 20px; text-align: center; }
.no-vehicles p { color: #94a3b8; font-size: 13px; }

/* 表单 */
.form-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 14px 20px;
}
.form-item { display: grid; gap: 5px; }
.form-item.full-width { grid-column: 1 / -1; }
.form-item label { font-size: 13px; color: #334155; font-weight: 700; }
.required { color: #dc2626; }
.form-hint { font-size: 11px; color: #94a3b8; }

.form-item select,
.form-item input,
.form-item textarea {
  padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px;
  font-size: 13px; color: #0f172a; outline: none;
  background: #ffffff; font-family: inherit;
}
.form-item select:focus,
.form-item input:focus,
.form-item textarea:focus { border-color: #93c5fd; }
.form-item textarea { resize: vertical; }

.input-with-btn { display: flex; gap: 6px; }
.input-with-btn input { flex: 1; }
.map-pick-btn {
  padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px;
  background: #ffffff; font-size: 18px; cursor: pointer;
}
.map-pick-btn:hover { background: #f1f5f9; }

/* 紧急派车开关 */
.toggle-row {
  display: flex; align-items: center; gap: 8px; cursor: pointer;
  font-size: 13px; color: #d97706; font-weight: 700;
}
.toggle-row input { width: 16px; height: 16px; }

/* 优先级 */
.priority-radio-group { display: flex; gap: 10px; }
.priority-radio {
  display: flex; align-items: center; gap: 4px;
  padding: 6px 14px; border: 1px solid #e2e8f0; border-radius: 8px;
  cursor: pointer; font-size: 13px; font-weight: 700;
}
.priority-radio.checked { border-color: #93c5fd; background: #eff6ff; }
.priority-radio input { display: none; }

/* ETA */
.eta-display {
  padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px;
  background: #f8fafc; font-size: 18px; font-weight: 900; color: #1d4ed8;
}

/* 提交横幅 */
.submit-banner {
  margin: 0 20px; padding: 10px 16px; border-radius: 8px;
  font-size: 13px; font-weight: 700;
}
.submit-banner.error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
.submit-banner.success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }

/* 底部 */
.card-footer {
  display: flex; justify-content: flex-end; gap: 10px;
  padding: 14px 20px; border-top: 1px solid #e2e8f0; background: #fafbfc;
}
.ghost-btn {
  padding: 9px 22px; border: 1px solid #e2e8f0; border-radius: 8px;
  background: #fff; color: #475569; font-weight: 700; font-size: 14px; cursor: pointer;
}
.primary-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 26px; border: none; border-radius: 8px;
  background: #1d4ed8; color: #fff; font-weight: 800; font-size: 14px; cursor: pointer;
}
.primary-btn:disabled { background: #94a3b8; cursor: not-allowed; }

.btn-spinner {
  width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* 日志 */
.dispatch-log { margin-top: 18px; }
.log-list {
  margin-top: 8px; border: 1px solid #e2e8f0; border-radius: 8px;
  background: #ffffff; overflow: hidden;
}
.log-item {
  display: flex; gap: 12px; padding: 10px 16px; border-bottom: 1px solid #f8fafc;
  font-size: 12px; color: #475569;
}
.log-item:last-child { border-bottom: none; }
.log-time { color: #94a3b8; font-weight: 700; white-space: nowrap; }

@media (max-width: 680px) {
  .form-grid { grid-template-columns: 1fr; }
}
</style>
