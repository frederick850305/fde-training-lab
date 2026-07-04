<template>
  <div class="task-adjust">
    <div v-if="!taskInfo" class="error-state"><span>⚠️</span><p>无法获取任务信息，请返回重试</p><button @click="goBack">返回</button></div>
    <template v-else>
      <!-- 任务摘要 -->
      <div class="summary-card">
        <h3>{{ taskInfo.plate }}</h3>
        <p>司机：{{ taskInfo.driver }} · {{ taskInfo.taskTitle }}</p>
      </div>

      <!-- 操作类型选择 -->
      <div class="op-type-select">
        <button v-for="op in opTypes" :key="op.key" :class="{ active: opType === op.key }" @click="opType = op.key">{{ op.label }}</button>
      </div>

      <!-- 改派表单 -->
      <div v-if="opType === 'reassign'" class="form-card">
        <h4>选择目标司机</h4>
        <div v-for="d in availableDrivers" :key="d.id" class="driver-option" :class="{ selected: selectedDriver === d.id }" @click="selectedDriver = d.id">
          <strong>{{ d.name }}</strong><small>{{ d.plate }} · {{ d.location }}</small>
        </div>
      </div>

      <!-- 取消表单 -->
      <div v-if="opType === 'cancel'" class="form-card">
        <h4>取消原因</h4>
        <textarea v-model="cancelReason" placeholder="请填写取消原因..." rows="3"></textarea>
      </div>

      <!-- 加派表单 -->
      <div v-if="opType === 'add'" class="form-card">
        <h4>新增临时任务</h4>
        <div class="form-row"><label>作业地点</label><input v-model="addLocation" placeholder="如：东区堆场" /></div>
        <div class="form-row"><label>预计时间</label><input v-model="addTime" type="datetime-local" /></div>
        <div class="form-row"><label>要求</label><textarea v-model="addRequirement" rows="2"></textarea></div>
      </div>

      <!-- 异常处理记录 -->
      <div class="form-card">
        <h4>异常处理记录</h4>
        <div class="form-row"><label>处理原因</label><textarea v-model="reason" rows="2" placeholder="记录本次操作的原因..." ></textarea></div>
        <div class="form-row"><label>备注</label><input v-model="remark" placeholder="补充说明" /></div>
      </div>

      <!-- 提交 -->
      <div class="submit-area" v-if="opType">
        <button class="submit-btn" @click="submit" :disabled="submitting">
          {{ submitting ? '提交中...' : '提交' }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from '../routerShim.js'

const router = useRouter()
const opType = ref('')
const opTypes = [
  { key: 'reassign', label: '🔄 改派' },
  { key: 'cancel', label: '❌ 取消' },
  { key: 'add', label: '➕ 加派' },
]
const taskInfo = ref({ plate: '沪A-2601', driver: '李师傅', taskTitle: '吊装转运-东区堆场→B区产线' })
const selectedDriver = ref('')
const cancelReason = ref('')
const addLocation = ref('')
const addTime = ref('')
const addRequirement = ref('')
const reason = ref('')
const remark = ref('')
const submitting = ref(false)

const availableDrivers = [
  { id: 'd1', name: '赵师傅', plate: '沪C-4920', location: '总调度室' },
  { id: 'd2', name: '周师傅', plate: '沪D-5031', location: 'B区产线' },
]

function goBack() { router.push('/dispatch/workbench') }
function submit() {
  submitting.value = true
  setTimeout(() => {
    alert('操作提交成功！')
    submitting.value = false
    router.push('/dispatch/workbench')
  }, 800)
}
</script>

<style scoped>
.task-adjust { padding: 16px; max-width: 500px; margin: 0 auto; display: grid; gap: 12px; }
.summary-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; }
.summary-card h3 { margin: 0 0 4px; font-size: 16px; }
.summary-card p { margin: 0; font-size: 13px; color: #64748b; }
.op-type-select { display: flex; gap: 8px; }
.op-type-select button { flex: 1; padding: 12px; border: 2px solid #e2e8f0; border-radius: 10px; background: #fff; font-size: 14px; font-weight: 700; cursor: pointer; }
.op-type-select button.active { border-color: #1a56db; background: #e6f0ff; color: #1a56db; }
.form-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; }
.form-card h4 { margin: 0 0 10px; font-size: 14px; }
.form-row { display: grid; gap: 4px; margin-bottom: 10px; }
.form-row label { font-size: 12px; color: #64748b; font-weight: 600; }
.form-row input, .form-row textarea, textarea { width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; }
.driver-option { padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 6px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
.driver-option.selected { border-color: #1a56db; background: #e6f0ff; }
.driver-option strong { font-size: 13px; }
.driver-option small { color: #64748b; font-size: 12px; }
.submit-area { text-align: center; }
.submit-btn { padding: 12px 40px; background: #1a56db; color: #fff; border: none; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; }
.submit-btn:disabled { opacity: .6; }
.error-state { padding: 40px; text-align: center; color: #c62828; }
.error-state button { margin-top: 12px; padding: 8px 20px; background: #c62828; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
</style>
