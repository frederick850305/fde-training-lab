<template>
  <section class="page-grid gate-view">
    <header class="page-header">
      <div>
        <span class="eyebrow">场地管理</span>
        <h1>门岗入场核验</h1>
        <p>门岗人员集中核验预约、任务、司机和车辆信息，完成授权放行或异常登记。</p>
      </div>
      <div class="header-actions">
        <input v-model="keyword" placeholder="搜索车牌或预约编号" />
        <button class="secondary-btn" type="button" @click="refreshList">刷新列表</button>
      </div>
    </header>

    <section class="panel">
      <div class="panel-title">
        <strong>待入场车辆</strong>
        <span>{{ filteredEntries.length }} 条记录</span>
      </div>
      <DataTable :columns="entryColumns" :rows="filteredEntries" row-key="id" :selected-key="selectedEntry?.id || ''" @row-click="selectedEntry = $event">
        <template #releaseStatus="{ row }"><StatusTag :label="row.releaseStatus" /></template>
        <template #entryAllowed="{ row }">{{ row.entryAllowed ? '允许' : '拦截' }}</template>
      </DataTable>
    </section>

    <aside class="panel side-panel">
      <div class="detail-card abnormal" :class="{ clear: selectedEntry.entryAllowed }">
        <span class="eyebrow">核验详情</span>
        <h3>{{ selectedEntry.plateNumber }}</h3>
        <p>{{ selectedEntry.vehicleType }} / {{ selectedEntry.driver }} / {{ selectedEntry.cargo }}</p>
        <dl class="detail-list">
          <div><dt>预约编号</dt><dd>{{ selectedEntry.appointmentId }}</dd></div>
          <div><dt>预约时间</dt><dd>{{ selectedEntry.entryTime }}</dd></div>
          <div><dt>核验结论</dt><dd>{{ selectedEntry.risk }}</dd></div>
          <div><dt>核验人员</dt><dd>{{ selectedEntry.inspector }}</dd></div>
        </dl>
      </div>

      <div class="operation-stack">
        <button class="primary-btn" type="button" :disabled="!selectedEntry.entryAllowed" @click="authorizeEntry">授权放行</button>
        <button class="danger-btn" type="button" @click="openAbnormal">登记异常</button>
      </div>

      <form v-if="showAbnormalForm" class="abnormal-form" @submit.prevent="submitAbnormal">
        <label>
          异常类型
          <select v-model="abnormal.type">
            <option>未预约</option>
            <option>证照不一致</option>
            <option>黑名单车辆</option>
          </select>
        </label>
        <label>
          备注
          <textarea v-model="abnormal.note" rows="3" placeholder="填写现场说明"></textarea>
        </label>
        <button class="danger-btn wide" type="submit">提交异常登记</button>
      </form>
    </aside>

    <section class="panel full-row">
      <div class="panel-title">
        <strong>放行日志</strong>
        <span>所有关键操作留痕审计</span>
      </div>
      <div class="timeline">
        <div v-for="log in logs" :key="log"><span></span>{{ log }}</div>
      </div>
    </section>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import DataTable from '../components/DataTable.vue'
import StatusTag from '../components/StatusTag.vue'
import { gateEntries } from '../data/mockData'

const entries = ref(gateEntries.map((item) => ({ ...item })))
const selectedEntry = ref(entries.value[0])
const keyword = ref('')
const toast = ref('')
const showAbnormalForm = ref(false)
const abnormal = reactive({ type: '未预约', note: '' })
const logs = ref(['10:18 沪B-91527 完成证照复核', '10:05 苏E-2X781 进入人工核验队列'])

const entryColumns = [
  { key: 'plateNumber', label: '车牌号' },
  { key: 'vehicleType', label: '车辆类型' },
  { key: 'appointmentId', label: '预约编号' },
  { key: 'entryAllowed', label: '许可' },
  { key: 'releaseStatus', label: '状态' },
]

const filteredEntries = computed(() =>
  entries.value.filter((item) =>
    !keyword.value ||
    item.plateNumber.includes(keyword.value) ||
    item.appointmentId.includes(keyword.value)
  )
)

function refreshList() {
  toast.value = '列表已刷新，已同步最新预约和门禁核验结果。'
}

function authorizeEntry() {
  selectedEntry.value.releaseStatus = '已入场'
  logs.value.unshift(`${selectedEntry.value.entryTime} ${selectedEntry.value.plateNumber} 授权放行，道闸开启`)
  toast.value = `${selectedEntry.value.plateNumber} 已授权放行。`
}

function openAbnormal() {
  showAbnormalForm.value = true
}

function submitAbnormal() {
  selectedEntry.value.releaseStatus = '异常'
  logs.value.unshift(`${selectedEntry.value.entryTime} ${selectedEntry.value.plateNumber} 登记异常：${abnormal.type}`)
  toast.value = '异常已登记，已通知调度员和安全管理人员。'
  showAbnormalForm.value = false
}
</script>
