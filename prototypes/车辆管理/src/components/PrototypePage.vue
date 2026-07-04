<script setup>
import { computed, inject, ref, watch } from 'vue'
import { getGovernedPage } from '../data/governanceModel.js'

const props = defineProps({
  pageKey: { type: String, required: true },
})

const prototypeContext = inject('prototypeContext', {})
const currentRole = computed(() => prototypeContext.currentRole?.value || prototypeContext.currentRole || { label: '演示角色', userName: '演示用户' })
const page = computed(() => getGovernedPage(props.pageKey))
const query = ref('')
const selectedId = ref('')
const actionMessage = ref('')

const rows = computed(() => {
  const source = page.value.rows || []
  const keyword = query.value.trim().toLowerCase()
  if (!keyword) return source
  return source.filter(row => Object.values(row).some(value => String(value ?? '').toLowerCase().includes(keyword)))
})

const selectedRow = computed(() => rows.value.find(row => row.id === selectedId.value) || rows.value[0] || null)

watch(rows, nextRows => {
  if (!nextRows.length) {
    selectedId.value = ''
    return
  }
  if (!nextRows.some(row => row.id === selectedId.value)) selectedId.value = nextRows[0].id
}, { immediate: true })

function selectRow(row) {
  selectedId.value = row.id
}

function runAction(action) {
  const target = selectedRow.value?.id ? `：${selectedRow.value.id}` : ''
  actionMessage.value = `${action}${target} 已记录为原型演示操作`
}

function valueFor(row, key) {
  return row?.[key] ?? '-'
}

function metricClass(metric) {
  return {
    danger: metric.tone === 'danger',
    normal: !metric.tone || metric.tone === 'normal',
  }
}
</script>

<template>
  <section class="prototype-page">
    <header class="page-header">
      <div>
        <p class="role-line">{{ currentRole.label }} · {{ currentRole.userName }}</p>
        <h1>{{ page.title }}</h1>
        <p>{{ page.subtitle }}</p>
      </div>
      <label class="search-box">
        <span>搜索</span>
        <input v-model="query" type="search" placeholder="输入车牌、编号、状态或人员" />
      </label>
    </header>

    <div class="metric-grid">
      <article v-for="item in page.metrics" :key="item.label" class="metric-card" :class="metricClass(item)">
        <strong>{{ item.value }}</strong>
        <span>{{ item.label }}</span>
      </article>
    </div>

    <div class="content-grid">
      <section class="list-panel">
        <div class="panel-title">
          <h2>业务列表</h2>
          <span>{{ rows.length }} 条</span>
        </div>

        <div v-if="!rows.length" class="empty-state">暂无匹配数据</div>
        <div v-else class="table-wrap">
          <table>
            <thead>
              <tr>
                <th v-for="column in page.columns" :key="column.key">{{ column.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in rows"
                :key="row.id"
                :class="{ selected: selectedRow?.id === row.id }"
                @click="selectRow(row)"
              >
                <td v-for="column in page.columns" :key="column.key">
                  <span v-if="column.key === 'status' || column.key === 'sync' || column.key === 'result'" class="status-pill">
                    {{ valueFor(row, column.key) }}
                  </span>
                  <span v-else>{{ valueFor(row, column.key) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <aside class="detail-panel">
        <div class="panel-title">
          <h2>业务详情</h2>
          <span>{{ selectedRow?.id || '未选择' }}</span>
        </div>

        <dl v-if="selectedRow" class="detail-list">
          <template v-for="column in page.columns" :key="column.key">
            <dt>{{ column.label }}</dt>
            <dd>{{ valueFor(selectedRow, column.key) }}</dd>
          </template>
        </dl>
        <div v-else class="empty-state">请选择一条记录</div>

        <div class="actions">
          <button v-for="action in page.actions" :key="action" type="button" @click="runAction(action)">
            {{ action }}
          </button>
        </div>
        <p v-if="actionMessage" class="action-message">{{ actionMessage }}</p>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.prototype-page { display: grid; gap: 16px; min-height: 100%; }
.page-header { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; }
.page-header h1 { margin: 0; font-size: 24px; color: #0f172a; }
.page-header p { margin: 6px 0 0; color: #64748b; line-height: 1.5; }
.role-line { margin: 0 0 6px !important; font-size: 12px; font-weight: 900; color: #2563eb !important; }
.search-box { width: min(320px, 100%); display: grid; gap: 6px; font-size: 12px; font-weight: 900; color: #64748b; }
.search-box input { width: 100%; border: 1px solid #dbe3ef; border-radius: 8px; padding: 9px 11px; background: #fff; color: #0f172a; }
.metric-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.metric-card { border: 1px solid #dbe3ef; border-radius: 8px; padding: 14px; background: #fff; box-shadow: 0 10px 24px rgb(15 23 42 / 0.05); display: grid; gap: 4px; }
.metric-card strong { font-size: 24px; color: #0f172a; }
.metric-card span { font-size: 13px; color: #64748b; font-weight: 800; }
.metric-card.danger strong { color: #dc2626; }
.content-grid { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 16px; min-height: 0; }
.list-panel, .detail-panel { min-width: 0; border: 1px solid #dbe3ef; border-radius: 8px; background: #fff; padding: 14px; box-shadow: 0 10px 24px rgb(15 23 42 / 0.05); }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 10px; }
.panel-title h2 { margin: 0; font-size: 16px; color: #0f172a; }
.panel-title span { font-size: 12px; color: #64748b; font-weight: 900; }
.table-wrap { overflow: auto; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
th, td { padding: 11px 10px; border-bottom: 1px solid #e2e8f0; text-align: left; white-space: nowrap; }
th { color: #64748b; background: #f8fafc; font-size: 12px; }
tbody tr { cursor: pointer; }
tbody tr:hover, tbody tr.selected { background: #eff6ff; }
.status-pill { display: inline-flex; border-radius: 999px; padding: 3px 9px; background: #dbeafe; color: #1d4ed8; font-size: 12px; font-weight: 900; }
.detail-list { display: grid; grid-template-columns: 96px minmax(0, 1fr); gap: 8px 10px; margin: 0; font-size: 13px; }
.detail-list dt { color: #64748b; font-weight: 900; }
.detail-list dd { margin: 0; color: #0f172a; overflow-wrap: anywhere; }
.actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.actions button { border: 0; border-radius: 7px; padding: 8px 11px; background: #2563eb; color: #fff; font-weight: 900; font-size: 13px; }
.action-message { margin: 12px 0 0; color: #166534; font-size: 13px; font-weight: 800; }
.empty-state { min-height: 180px; display: grid; place-items: center; color: #94a3b8; font-weight: 900; background: #f8fafc; border-radius: 8px; }
@media (max-width: 1100px) {
  .page-header, .content-grid { grid-template-columns: 1fr; display: grid; }
  .metric-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 640px) {
  .metric-grid { grid-template-columns: 1fr; }
  th, td { white-space: normal; }
}
</style>
