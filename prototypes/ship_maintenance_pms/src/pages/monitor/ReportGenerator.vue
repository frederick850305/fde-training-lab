<template>
  <section class="report-generator">
    <header class="page-header">
      <div>
<div class="header-text">
            <span class="module-label">系统监控审计 / P1</span>
            <h1>运维报告生成</h1>
          </div>
<p>定期或按需生成系统运维状况报告与审计合规文档，支持模板选择、周期设置、任务进度跟踪与报告下载。</p>
</div>
      </header>

    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span></span><span></span><span></span><span></span>
    </div>

    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>报告数据加载失败</h2>
      <p>请检查网络后重试。</p>
      <button type="button" @click="loadData">重试</button>
    </div>

    <div v-else-if="!templates.length" class="state-panel empty">
      <h2>暂无报告模板</h2>
      <p>当前没有可用的报告模板。</p>
    </div>

    <template v-else>
      <section class="panel templates-panel">
        <div class="panel-title">
          <h2>报告模板选择</h2>
          <span>{{ templates.length }} 个可用模板</span>
        </div>
        <div class="templates-grid">
          <article
            v-for="tpl in templates"
            :key="tpl.id"
            :class="['template-card', { selected: selectedTemplate?.id === tpl.id }]"
            @click="selectTemplate(tpl)"
          >
            <div class="template-head">
              <strong>{{ tpl.name }}</strong>
              <span :class="['category-tag', categoryClass(tpl.category)]">{{ tpl.category }}</span>
            </div>
            <p>{{ tpl.description }}</p>
            <div class="template-fields">
              <small v-for="f in tpl.fields" :key="f" class="field-chip">{{ f }}</small>
            </div>
            <div v-if="selectedTemplate?.id === tpl.id" class="selected-mark">已选中</div>
          </article>
        </div>
      </section>

      <section class="report-layout">
        <article class="panel generate-panel">
          <div class="panel-title">
            <h2>生成任务配置</h2>
            <span v-if="selectedTemplate">{{ selectedTemplate.name }}</span>
          </div>
          <template v-if="selectedTemplate">
            <div class="generate-form">
              <label class="field">
                <span>报告周期</span>
                <input v-model="period" type="month" />
              </label>
              <label class="field">
                <span>报告名称</span>
                <input v-model="reportName" :placeholder="defaultReportName" />
              </label>
            </div>
            <div class="template-fields-preview">
              <span class="preview-label">包含字段：</span>
              <small v-for="f in selectedTemplate.fields" :key="f" class="field-chip">{{ f }}</small>
            </div>
            <div class="generate-actions">
              <button type="button" class="primary" @click="generateReport">生成报告</button>
            </div>
            <p v-if="generateHint" class="generate-hint">{{ generateHint }}</p>
          </template>
          <div v-else class="no-selection">
            <p>请从上方选择一个报告模板</p>
          </div>
        </article>

        <article class="panel tasks-panel">
          <div class="panel-title">
            <h2>生成任务进度</h2>
            <span>{{ tasks.length }} 个任务</span>
          </div>
          <div class="task-list">
            <div v-for="task in tasks" :key="task.taskId" :class="['task-card', taskClass(task.status)]">
              <div class="task-head">
                <strong>{{ task.templateName }}</strong>
                <span :class="['task-status', taskClass(task.status)]">{{ task.status }}</span>
              </div>
              <div class="task-meta">
                <span>周期：{{ task.period }}</span>
                <span>编号：{{ task.taskId }}</span>
              </div>
              <div class="progress-bar">
                <i :style="{ width: `${task.progress}%` }"></i>
                <em>{{ task.progress }}%</em>
              </div>
              <div class="task-footer">
                <span v-if="task.generatedAt" class="gen-time">生成于 {{ task.generatedAt }}</span>
                <span v-else class="gen-time pending">生成中…</span>
                <div class="task-actions">
                  <span v-if="task.size" class="file-size">{{ task.size }}</span>
                  <button
                    v-if="task.status === '已完成' && task.downloadUrl"
                    type="button"
                    class="download-btn"
                    @click="downloadReport(task)"
                  >下载</button>
                </div>
              </div>
            </div>
            <div v-if="!tasks.length" class="no-tasks">
              <p>暂无生成任务记录</p>
            </div>
          </div>
        </article>
      </section>
    </template>

    
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { fetchReportTemplates, fetchReportTasks, submitAction } from '@/mock/api.js'

const templates = ref([])
const tasks = ref([])
const uiState = ref('loading')
const selectedTemplate = ref(null)
const period = ref('')
const reportName = ref('')
const generateHint = ref('')
const defaultReportName = computed(() =>
  selectedTemplate.value ? `${selectedTemplate.value.name}_${period.value || '当期'}` : '',
)

function selectTemplate(tpl) {
  selectedTemplate.value = tpl
  reportName.value = ''
  generateHint.value = ''
}

function categoryClass(category) {
  return {
    '合规': 'compliance',
    '审查': 'review',
    '运维': 'ops',
    '审计': 'audit',
  }[category] || 'default'
}

function taskClass(status) {
  return status === '已完成' ? 'done' : 'running'
}

async function generateReport() {
  if (!selectedTemplate.value) return
  const finalPeriod = period.value || new Date().toISOString().slice(0, 7)
  await submitAction('generateReport', {
    templateId: selectedTemplate.value.id,
    period: finalPeriod,
  })
  const newTask = {
    taskId: `RPT-${Date.now().toString().slice(-5)}`,
    templateId: selectedTemplate.value.id,
    templateName: selectedTemplate.value.name,
    period: finalPeriod,
    status: '生成中',
    progress: 0,
    generatedAt: null,
    downloadUrl: null,
    size: null,
  }
  tasks.value = [newTask, ...tasks.value]
  generateHint.value = `已提交生成任务 ${newTask.taskId}，正在生成中…`
  simulateProgress(newTask)
}

function simulateProgress(task) {
  const timer = setInterval(() => {
    task.progress = Math.min(100, task.progress + Math.floor(Math.random() * 18) + 8)
    if (task.progress >= 100) {
      clearInterval(timer)
      task.status = '已完成'
      task.progress = 100
      task.generatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16)
      task.downloadUrl = '#'
      task.size = `${(Math.random() * 3 + 0.5).toFixed(1)}MB`
    }
  }, 600)
}

function downloadReport(task) {
  generateHint.value = `报告 ${task.taskId}（${task.templateName}）下载已触发，大小 ${task.size}。`
}

async function loadData() {
  uiState.value = 'loading'
  try {
    const [tpls, tsk] = await Promise.all([fetchReportTemplates(), fetchReportTasks()])
    templates.value = tpls
    tasks.value = tsk
    uiState.value = tpls.length ? 'success' : 'empty'
    selectedTemplate.value = tpls[0] || null
  } catch (e) {
    uiState.value = 'error'
  }
}

onMounted(loadData)
</script>

<style scoped>
.report-generator { display: grid; gap: 16px; position: relative; }

.page-header {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 18px;
  border: 1px solid #d9e4ef; border-radius: 8px; padding: 20px; background: #fff;
}
.module-label { color: #1e6fd9; font-size: 12px; font-weight: 900; }
.page-header h1 { margin: 6px 0 8px; font-size: 24px; color: #172033; }
.page-header p { max-width: 920px; margin: 0; color: #64748b; line-height: 1.55; }
.header-actions { display: flex; gap: 9px; }

.action-hint { margin: 6px 0 0; color: #8b9aab; font-size: 12px; }
button {
  border: 1px solid #cfdae6; border-radius: 7px; padding: 8px 13px;
  color: #24415f; background: #f6f9fc; font-weight: 900; cursor: pointer;
}
button:hover { background: #eef3f8; }
button.primary { color: #fff; border-color: #1e6fd9; background: #1e6fd9; }
button.primary:hover { background: #1a5fc0; }
.download-btn { padding: 5px 12px; font-size: 12px; color: #11734d; border-color: #b8e0c8; background: #dff6e8; }
.download-btn:hover { background: #c8eed6; }

.state-panel { min-height: 260px; border: 1px solid #d9e4ef; border-radius: 8px; display: grid; place-content: center; justify-items: center; gap: 12px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0; font-size: 20px; }
.state-panel.error h2 { color: #b4232d; }
.state-panel.empty h2 { color: #64748b; }
.skeleton { grid-template-columns: repeat(2, minmax(180px, 1fr)); padding: 24px; }
.skeleton span { width: 100%; height: 96px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); animation: pulse 1.4s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }

.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 14px; }
.panel-title h2 { margin: 0; font-size: 16px; color: #172033; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }

.templates-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
.template-card {
  position: relative; display: grid; gap: 10px; padding: 16px; border-radius: 8px;
  border: 2px solid #d9e4ef; background: #f8fbfe; cursor: pointer; transition: all 0.15s;
}
.template-card:hover { border-color: #1e6fd9; box-shadow: 0 6px 18px rgba(30, 111, 217, 0.12); }
.template-card.selected { border-color: #1e6fd9; background: #edf5ff; }
.template-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.template-head strong { font-size: 15px; color: #172033; line-height: 1.35; }
.category-tag { display: inline-flex; min-width: 36px; justify-content: center; border-radius: 999px; padding: 2px 8px; font-size: 11px; font-weight: 900; flex-shrink: 0; }
.category-tag.compliance { color: #11734d; background: #dff6e8; }
.category-tag.review { color: #b4232d; background: #ffe1e3; }
.category-tag.ops { color: #1e6fd9; background: #e3efff; }
.category-tag.audit { color: #d4743f; background: #fff3e6; }
.template-card p { margin: 0; font-size: 12px; color: #64748b; line-height: 1.5; }
.template-fields { display: flex; flex-wrap: wrap; gap: 6px; }
.field-chip { display: inline-flex; padding: 2px 7px; border-radius: 4px; font-size: 11px; color: #53657c; background: #e7edf4; }
.selected-mark { position: absolute; top: 8px; right: 8px; font-size: 11px; font-weight: 900; color: #1e6fd9; }

.report-layout { display: grid; grid-template-columns: 380px minmax(0, 1fr); gap: 16px; align-items: start; }
.generate-panel { display: grid; gap: 14px; position: sticky; top: 0; }
.generate-form { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.field { display: grid; gap: 6px; }
.field span { color: #53657c; font-size: 12px; font-weight: 900; }
.field input { min-height: 38px; border: 1px solid #cbd7e4; border-radius: 7px; padding: 8px 10px; color: #172033; background: #fff; font-size: 13px; }
.template-fields-preview { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; padding: 10px; border-radius: 6px; background: #f8fbfe; }
.preview-label { font-size: 12px; font-weight: 800; color: #53657c; }
.generate-btn { width: 100%; justify-self: stretch; }
.generate-hint { margin: 0; padding: 8px 10px; border-radius: 6px; background: #e3efff; color: #1e6fd9; font-size: 12px; font-weight: 700; }
.no-selection { padding: 30px 20px; text-align: center; color: #64748b; }

.task-list { display: grid; gap: 12px; }
.task-card { padding: 14px; border-radius: 8px; border: 1px solid #d9e4ef; border-left: 4px solid #1e6fd9; background: #f8fbfe; }
.task-card.done { border-left-color: #11734d; }
.task-card.running { border-left-color: #d4743f; }
.task-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 8px; }
.task-head strong { font-size: 14px; color: #172033; }
.task-status { display: inline-flex; min-width: 50px; justify-content: center; border-radius: 999px; padding: 3px 8px; font-size: 11px; font-weight: 900; }
.task-status.done { color: #11734d; background: #dff6e8; }
.task-status.running { color: #d4743f; background: #fff3e6; }
.task-meta { display: flex; gap: 16px; font-size: 12px; color: #64748b; margin-bottom: 10px; }
.progress-bar { position: relative; height: 8px; border-radius: 999px; background: #e7edf4; overflow: hidden; margin-bottom: 10px; }
.progress-bar i { display: block; height: 100%; border-radius: 999px; background: #1e6fd9; transition: width 0.6s ease; }
.task-card.done .progress-bar i { background: #11734d; }
.progress-bar em { position: absolute; right: 6px; top: -20px; font-style: normal; font-size: 11px; font-weight: 800; color: #64748b; }
.task-footer { display: flex; justify-content: space-between; align-items: center; }
.gen-time { font-size: 11px; color: #64748b; }
.gen-time.pending { color: #d4743f; font-weight: 700; }
.task-actions { display: flex; gap: 8px; align-items: center; }
.file-size { font-size: 11px; color: #64748b; }
.no-tasks { padding: 30px; text-align: center; color: #64748b; }

@media (max-width: 1100px) {
  .templates-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 980px) {
  .report-layout { grid-template-columns: 1fr; }
  .generate-panel { position: static; }
}
@media (max-width: 720px) {
  .page-header { flex-direction: column; }
  .templates-grid { grid-template-columns: 1fr; }
  .generate-form { grid-template-columns: 1fr; }
}
</style>
