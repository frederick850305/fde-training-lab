<template>
  <div class="content-grid">
    <div class="panel">
      <div class="panel-head"><h3>现场实绩反馈</h3><span class="sub">录入实际完成情况</span></div>
      <form class="fb-form" @submit.prevent="submit">
        <label v-for="field in fields" :key="field.key" :class="{ full: ['reason'].includes(field.key) }">
          <span>{{ field.label }}</span>
          <input v-if="field.key !== 'affectDownstream' && field.key !== 'needReschedule'" v-model="form[field.key]" :placeholder="placeholder(field.key)" />
          <select v-else v-model="form[field.key]">
            <option value="是">是</option>
            <option value="否">否</option>
          </select>
        </label>
        <div class="full action-row">
          <button class="btn primary" type="submit">提交实绩</button>
          <button class="btn" type="button" @click="resetForm">重置</button>
        </div>
        <p v-if="msg" class="fb-msg">{{ msg }}</p>
      </form>
    </div>

    <div class="panel">
      <div class="panel-head"><h3>待反馈任务</h3><span class="sub">{{ workInstructions.length }} 条</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>任务</th><th>班组</th><th>计划/实际</th><th>状态</th></tr></thead>
          <tbody>
            <tr v-for="w in workInstructions" :key="w.id">
              <td>{{ w.task }}</td>
              <td>{{ w.team }}</td>
              <td>{{ w.planStart.slice(5, 10) }}</td>
              <td><StatusTag :status="w.status === '已排程' ? '已排程' : w.status === '执行中' ? '执行中' : w.status === '已完成' ? '已完成' : '待下发'" /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="note" style="margin-top:12px">实绩反馈（尤其焊接实绩低于计划）将为「异常与模拟重排」提供输入，触发重排建议。</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StatusTag from '../components/StatusTag.vue'
import { workInstructions, actualFeedbackFields, submitActualFeedback } from '../mock/index.js'

const fields = actualFeedbackFields
const form = ref(defaultForm())
const msg = ref('')

function defaultForm() {
  return {
    taskId: 'TASK-0001 / BRACE-001 焊接',
    planQty: '80 道焊口',
    actualQty: '52 道焊口',
    actualStart: '2026-10-09 08:20',
    actualEnd: '2026-10-09 17:30',
    reason: '焊工不足、NDT 排队',
    affectDownstream: '是',
    needReschedule: '是',
  }
}
function placeholder(key) {
  return { taskId: '任务编号', planQty: '计划完成量', actualQty: '实际完成量', actualStart: '实际开始', actualEnd: '实际结束', reason: '异常原因' }[key] || ''
}
function resetForm() {
  form.value = defaultForm()
  msg.value = ''
}
function submit() {
  const res = submitActualFeedback(form.value)
  msg.value = res.success ? `${res.message}；${res.needReschedule ? '建议前往「异常与模拟重排」查看重排。' : '无需重排。'}` : '提交失败'
}
</script>

<style scoped>
.fb-form { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.fb-form label { display: grid; gap: 6px; font-size: 13px; font-weight: 700; color: #53657c; }
.fb-form label.full { grid-column: 1 / -1; }
.fb-form input, .fb-form select { width: 100%; border: 1px solid #cbd7e4; border-radius: 8px; padding: 9px 11px; color: #172033; background: #fff; font-weight: 500; }
.fb-form .action-row { display: flex; gap: 10px; }
.fb-msg { grid-column: 1 / -1; color: #11734d; font-size: 13px; background: #e7f7ee; padding: 10px 12px; border-radius: 8px; margin: 0; }
@media (max-width: 620px) { .fb-form { grid-template-columns: 1fr; } }
</style>
