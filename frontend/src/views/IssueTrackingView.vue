<template>
  <section class="issue-tracking-view" aria-labelledby="issue-tracking-title">
    <ViewHeading
      eyebrow="P0 Prototype Page"
      title="异常问题闭环原型页"
      title-id="issue-tracking-title"
      description="面向现场调度员的异常登记与闭环跟踪页面。当前使用本地 mock 数据，后续可替换为 FastAPI 接口。"
    />

    <div class="issue-layout">
      <form class="issue-form" @submit.prevent="submitIssue">
        <div class="panel-heading">
          <span>新增异常</span>
          <strong>登记问题并分派责任人</strong>
        </div>

        <label>
          <span>异常标题 <strong>*</strong></span>
          <input v-model.trim="form.issueTitle" type="text" placeholder="例如：B 区焊材到货延迟" />
        </label>

        <label>
          <span>责任人 <strong>*</strong></span>
          <input v-model.trim="form.owner" type="text" placeholder="例如：物资协调员" />
        </label>

        <label>
          <span>处理时限 <strong>*</strong></span>
          <input v-model="form.deadline" type="date" />
        </label>

        <label>
          <span>异常说明</span>
          <textarea v-model.trim="form.description" rows="4" placeholder="补充异常背景、影响范围和处理要求"></textarea>
        </label>

        <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="form-success">{{ successMessage }}</p>

        <button class="primary-button" type="submit">提交异常</button>
      </form>

      <article class="issue-rules">
        <div class="panel-heading">
          <span>闭环规则</span>
          <strong>异常必须形成处理链路</strong>
        </div>

        <ol>
          <li>发现问题：记录异常标题和影响范围</li>
          <li>分派责任人：明确处理人和截止时间</li>
          <li>跟踪处理：持续更新处理状态</li>
          <li>关闭问题：确认处理结果并归档</li>
        </ol>
      </article>
    </div>

    <section class="issue-summary" aria-label="异常状态摘要">
      <article v-for="item in summaryItems" :key="item.label">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
        <p>{{ item.description }}</p>
      </article>
    </section>

    <article class="issue-table-panel">
      <div class="panel-heading">
        <span>异常问题列表</span>
        <strong>优先处理待处理与处理中问题</strong>
      </div>

      <DataTable
        :columns="issueColumns"
        :rows="issues"
        empty-title="暂无异常问题"
        empty-description="当前没有需要处理的异常。"
      >
        <template #status="{ row }">
          <StatusTag :label="statusOptions[row.status] || row.status" :type="row.status" />
        </template>
      </DataTable>
    </article>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import DataTable from '../components/DataTable.vue'
import StatusTag from '../components/StatusTag.vue'
import ViewHeading from '../components/ViewHeading.vue'
import { issueListMock, statusOptions } from '../data/prototypeMockData'

const issues = ref([...issueListMock])
const errorMessage = ref('')
const successMessage = ref('')

const form = reactive({
  issueTitle: '',
  owner: '',
  deadline: '',
  description: '',
})

const issueColumns = [
  { key: 'id', label: '编号' },
  { key: 'title', label: '异常标题' },
  { key: 'owner', label: '责任人' },
  { key: 'status', label: '状态' },
  { key: 'deadline', label: '截止日期' },
]

const summaryItems = computed(() => {
  const openCount = issues.value.filter((item) => item.status === 'open').length
  const processingCount = issues.value.filter((item) => item.status === 'processing').length
  const closedCount = issues.value.filter((item) => item.status === 'closed').length

  return [
    {
      label: '全部异常',
      value: issues.value.length,
      description: '当前项目异常总数',
    },
    {
      label: '待处理',
      value: openCount,
      description: '需要尽快明确责任人',
    },
    {
      label: '处理中',
      value: processingCount,
      description: '需要持续跟踪进展',
    },
    {
      label: '已关闭',
      value: closedCount,
      description: '已完成处理归档',
    },
  ]
})

function resetForm() {
  form.issueTitle = ''
  form.owner = ''
  form.deadline = ''
  form.description = ''
}

function submitIssue() {
  successMessage.value = ''

  if (!form.issueTitle || !form.owner || !form.deadline) {
    errorMessage.value = '请填写异常标题、责任人和处理时限'
    return
  }

  const nextIndex = String(issues.value.length + 1).padStart(3, '0')
  issues.value = [
    {
      id: `ISSUE-${nextIndex}`,
      title: form.issueTitle,
      owner: form.owner,
      status: 'open',
      deadline: form.deadline,
    },
    ...issues.value,
  ]

  errorMessage.value = ''
  successMessage.value = '异常已模拟提交，当前仅写入前端内存列表'
  resetForm()
}
</script>

<style scoped>
.issue-tracking-view {
  margin-top: 16px;
}

.issue-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.75fr);
  gap: 16px;
}

.issue-form,
.issue-rules,
.issue-summary article,
.issue-table-panel {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.issue-form,
.issue-rules,
.issue-table-panel {
  padding: 22px;
}

.panel-heading {
  display: grid;
  gap: 6px;
  margin-bottom: 16px;
}

.panel-heading span,
.issue-summary span,
.issue-form label > span {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.panel-heading strong {
  color: #0f172a;
  font-size: 18px;
}

.issue-form {
  display: grid;
  gap: 14px;
}

.issue-form label {
  display: grid;
  gap: 8px;
}

.issue-form label strong {
  color: #dc2626;
}

.issue-form input,
.issue-form textarea {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 11px 12px;
  background: #ffffff;
  color: #172033;
}

.issue-form textarea {
  resize: vertical;
  line-height: 1.65;
}

.form-error,
.form-success {
  margin: 0;
  border-radius: 8px;
  padding: 10px 12px;
  font-weight: 800;
}

.form-error {
  background: #fef2f2;
  color: #b91c1c;
}

.form-success {
  background: #f0fdf4;
  color: #166534;
}

.issue-rules ol {
  display: grid;
  gap: 10px;
  margin: 0;
  padding-left: 22px;
  color: #263244;
  line-height: 1.65;
  font-weight: 700;
}

.issue-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 16px;
}

.issue-summary article {
  padding: 16px;
}

.issue-summary strong {
  display: block;
  margin: 8px 0;
  color: #0f172a;
  font-size: 28px;
}

.issue-summary p {
  margin: 0;
  color: #526174;
  line-height: 1.55;
}

.issue-table-panel {
  margin-top: 16px;
}

@media (max-width: 920px) {
  .issue-layout,
  .issue-summary {
    grid-template-columns: 1fr;
  }
}
</style>
