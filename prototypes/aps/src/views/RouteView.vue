<template>
  <div class="route-manage">
    <!-- 专业切换 -->
    <div class="tabs">
      <button
        v-for="p in professions"
        :key="p.profession"
        class="tab"
        :class="{ active: p.profession === active }"
        @click="active = p.profession"
      >{{ p.name }}</button>
    </div>

    <!-- 工艺路线流程 -->
    <div class="panel">
      <div class="panel-head">
        <h3>工艺路线流程</h3>
        <div class="ops-tools">
          <button v-if="!editingFlow" class="btn" @click="startEditFlow">编辑流程</button>
          <template v-else>
            <button class="btn ghost" @click="cancelEditFlow">取消</button>
            <button class="btn primary" @click="saveFlow">保存流程</button>
          </template>
        </div>
      </div>
      <div v-if="!editingFlow" class="flow">
        <template v-for="(step, i) in flowSteps" :key="i">
          <span class="flow-step">{{ step }}</span>
          <svg v-if="i < flowSteps.length - 1" class="flow-arrow" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#7fb4ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </template>
      </div>
      <textarea v-else v-model="flowDraft" class="flow-edit" rows="2"></textarea>
      <p class="hint">用 “ → ” 分隔各工序，例如：材料到货 → 套料 → 切割 → 坡口</p>
    </div>

    <!-- 工序表 -->
    <div class="panel">
      <div class="panel-head">
        <h3>工序表（作业主数据）</h3>
        <div class="ops-tools">
          <button class="btn" @click="showImport = !showImport">Excel/CSV 导入</button>
          <button class="btn" @click="exportCSV">导出 CSV</button>
          <button class="btn" @click="downloadTemplate">下载模板</button>
          <button class="btn primary" @click="openAdd">新增工序</button>
          <button class="btn ghost" @click="resetAll">恢复默认</button>
        </div>
      </div>

      <div v-if="showImport" class="import-box">
        <p>支持 <b>.csv</b>（Excel 可直接“另存为 CSV”）或粘贴文本。列顺序：<code>工序名称,前序,后序,资源类型,标准工时,质检点,允许外协,齐套要求</code></p>
        <div class="import-row">
          <input type="file" accept=".csv,.txt" @change="onFile" />
          <button class="btn primary" :disabled="!importPreview.length" @click="doImport">导入到「{{ currentName }}」</button>
          <span v-if="importMsg" class="import-msg">{{ importMsg }}</span>
        </div>
        <div v-if="importPreview.length" class="table-wrap" style="margin-top:10px">
          <div class="preview-tip">预览（{{ importPreview.length }} 行，导入后将覆盖当前专业的工序表）：</div>
          <table>
            <thead><tr><th>工序名称</th><th>前序</th><th>后序</th><th>资源类型</th><th>标准工时</th><th>质检点</th><th>允许外协</th></tr></thead>
            <tbody>
              <tr v-for="(o, i) in importPreview" :key="i">
                <td><strong>{{ o.name }}</strong></td>
                <td>{{ o.prev }}</td>
                <td>{{ o.next }}</td>
                <td>{{ o.resourceTypes }}</td>
                <td>{{ o.std }}</td>
                <td>{{ o.inspect ? '是' : '否' }}</td>
                <td>{{ o.outsourcable }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="table-wrap">
        <table>
          <thead><tr><th>工序名称</th><th>前序</th><th>后序</th><th>资源类型</th><th>标准工时</th><th>质检点</th><th>允许外协</th><th>齐套要求</th><th class="op-col">操作</th></tr></thead>
          <tbody>
            <tr v-for="(op, i) in currentOps" :key="i">
              <td><strong>{{ op.name }}</strong></td>
              <td>{{ op.prev }}</td>
              <td>{{ op.next }}</td>
              <td>{{ op.resourceTypes }}</td>
              <td>{{ op.std }}</td>
              <td><StatusTag :status="op.inspect ? '高' : '低'" :label="op.inspect ? '是' : '否'" /></td>
              <td>{{ op.outsourcable }}</td>
              <td class="wrap">{{ op.kitting }}</td>
              <td class="op-col">
                <button class="link" @click="openEdit(i)">编辑</button>
                <button class="link danger" @click="remove(i)">删除</button>
              </td>
            </tr>
            <tr v-if="!currentOps.length"><td colspan="9" class="empty">当前专业暂无工序，请新增或从 Excel/CSV 导入</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 新增/编辑弹窗 -->
    <div v-if="modalOpen" class="modal-mask" @click.self="modalOpen = false">
      <div class="modal">
        <div class="panel-head"><h3>{{ modalMode === 'add' ? '新增工序' : '编辑工序' }}</h3></div>
        <div class="form-grid">
          <label>工序名称<input v-model="form.name" placeholder="如：焊接" /></label>
          <label>前序<input v-model="form.prev" placeholder="如：组对" /></label>
          <label>后序<input v-model="form.next" placeholder="如：NDT" /></label>
          <label>资源类型<input v-model="form.resourceTypes" placeholder="如：高级焊工、焊机" /></label>
          <label>标准工时<input v-model="form.std" placeholder="如：0.8 h/焊口" /></label>
          <label>质检点
            <select v-model="form.inspect">
              <option :value="true">是</option>
              <option :value="false">否</option>
            </select>
          </label>
          <label>允许外协<input v-model="form.outsourcable" placeholder="如：部分允许" /></label>
          <label class="span-2">齐套要求<input v-model="form.kitting" placeholder="如：图纸、焊材、WPS、工位" /></label>
        </div>
        <div class="modal-actions">
          <button class="btn ghost" @click="modalOpen = false">取消</button>
          <button class="btn primary" @click="saveOp">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import StatusTag from '../components/StatusTag.vue'
import {
  routeStore,
  saveFlow as storeSaveFlow,
  addOperation,
  updateOperation,
  deleteOperation,
  importOperations,
  resetRoutes,
  parseRouteCSV,
  opsToCSV,
  routeTemplateCSV,
} from '../mock/index.js'

const professions = computed(() => routeStore.routes.map((r) => ({ profession: r.profession, name: r.name })))
const active = ref(professions.value[0]?.profession || '')
const currentRoute = computed(() => routeStore.routes.find((r) => r.profession === active.value) || { flow: '', ops: [], name: '' })
const currentName = computed(() => currentRoute.value.name)
const currentOps = computed(() => currentRoute.value.ops || [])
const flowSteps = computed(() => (currentRoute.value.flow || '').split(/\s*→\s*/).filter(Boolean))

// ---------- 流程编辑 ----------
const editingFlow = ref(false)
const flowDraft = ref('')
function startEditFlow() {
  flowDraft.value = currentRoute.value.flow || ''
  editingFlow.value = true
}
function cancelEditFlow() {
  editingFlow.value = false
}
function saveFlow() {
  storeSaveFlow(active.value, flowDraft.value)
  editingFlow.value = false
}

// ---------- 工序表增删改 ----------
const modalOpen = ref(false)
const modalMode = ref('add')
const editIndex = ref(-1)
const form = reactive({ name: '', prev: '', next: '', resourceTypes: '', std: '', inspect: true, outsourcable: '', kitting: '' })

function resetForm() {
  Object.assign(form, { name: '', prev: '', next: '', resourceTypes: '', std: '', inspect: true, outsourcable: '', kitting: '' })
}
function openAdd() {
  resetForm()
  modalMode.value = 'add'
  editIndex.value = -1
  modalOpen.value = true
}
function openEdit(i) {
  Object.assign(form, currentOps.value[i])
  modalMode.value = 'edit'
  editIndex.value = i
  modalOpen.value = true
}
function saveOp() {
  if (!form.name.trim()) return
  if (modalMode.value === 'add') addOperation(active.value, { ...form })
  else updateOperation(active.value, editIndex.value, { ...form })
  modalOpen.value = false
}
function remove(i) {
  if (confirm(`确认删除工序「${currentOps.value[i].name}」？`)) deleteOperation(active.value, i)
}

// ---------- 导入 / 导出 / 模板 ----------
const showImport = ref(false)
const importPreview = ref([])
const importMsg = ref('')

function onFile(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    const rows = parseRouteCSV(reader.result)
    importPreview.value = rows
    importMsg.value = rows.length ? `已解析 ${rows.length} 行` : '未解析到有效数据'
  }
  reader.readAsText(file, 'utf-8')
  e.target.value = ''
}

function doImport() {
  if (!importPreview.value.length) return
  importOperations(active.value, importPreview.value)
  importMsg.value = `已导入 ${importPreview.value.length} 道工序到「${currentName.value}」`
  showImport.value = false
  importPreview.value = []
}

function exportCSV() {
  downloadBlob(opsToCSV(currentOps.value), `工艺路线_${active.value}.csv`)
}
function downloadTemplate() {
  downloadBlob(routeTemplateCSV(), '工艺路线导入模板.csv')
}
function downloadBlob(content, filename) {
  const blob = new Blob(['﻿' + content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function resetAll() {
  if (confirm('确认恢复全部工艺路线为系统默认数据？当前修改将丢失。')) resetRoutes()
}
</script>

<style scoped>
.route-manage { display: grid; gap: 16px; }
.tabs { display: flex; gap: 8px; flex-wrap: wrap; }
.tab { border: 1px solid #d4e2f0; background: #fff; border-radius: 8px; padding: 8px 14px; font-weight: 700; color: #3e5068; cursor: pointer; }
.tab.active { background: #1e6fd9; border-color: #1e6fd9; color: #fff; }
.flow { background: #f5f8fb; border: 1px solid #e1e8f0; border-radius: 8px; padding: 12px 14px; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.flow-step { background: #fff; border: 1px solid #d4e2f0; border-radius: 6px; padding: 5px 11px; font-size: 12px; font-weight: 600; color: #24415f; white-space: nowrap; }
.flow-arrow { width: 18px; height: 18px; flex-shrink: 0; }
.flow-edit { width: 100%; border: 1px solid #cfdae6; border-radius: 8px; padding: 10px 12px; font-size: 13px; color: #24415f; resize: vertical; }
.hint { margin: 8px 0 0; color: #8194a8; font-size: 12px; }
.ops-tools { display: flex; gap: 8px; flex-wrap: wrap; }
.btn { border: 1px solid #cfdae6; background: #f6f9fc; border-radius: 8px; padding: 7px 12px; font-weight: 700; color: #24415f; cursor: pointer; }
.btn:hover { border-color: #1e6fd9; color: #1e6fd9; }
.btn.primary { background: #1e6fd9; border-color: #1e6fd9; color: #fff; }
.btn.primary:disabled { opacity: .5; cursor: not-allowed; }
.btn.ghost { background: #fff; }
.import-box { border: 1px dashed #c2d4e8; border-radius: 10px; padding: 14px; margin-bottom: 12px; background: #fbfdff; font-size: 13px; color: #3e5068; }
.import-box p { margin: 0 0 10px; }
.import-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.import-msg { color: #1f9d63; font-weight: 700; font-size: 12px; }
.preview-tip { color: #8194a8; font-size: 12px; margin-bottom: 6px; }
code { background: #eef3f8; padding: 2px 6px; border-radius: 5px; color: #1e6fd9; font-size: 12px; }
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
th, td { text-align: left; padding: 9px 10px; border-bottom: 1px solid #eef2f6; color: #3e5068; }
th { color: #8194a8; font-weight: 700; font-size: 12px; background: #f8fafc; }
.wrap { max-width: 220px; }
.op-col { white-space: nowrap; }
.empty { text-align: center; color: #9cb0c8; padding: 20px; }
.link { border: none; background: none; color: #1e6fd9; font-weight: 700; cursor: pointer; padding: 0 6px; font-size: 12px; }
.link.danger { color: #d64b54; }
.link:hover { text-decoration: underline; }
.modal-mask { position: fixed; inset: 0; background: rgba(15,35,66,.45); display: flex; align-items: center; justify-content: center; z-index: 30; }
.modal { background: #fff; border-radius: 14px; padding: 18px 20px; width: 560px; max-width: 92vw; box-shadow: 0 20px 60px rgba(0,0,0,.3); }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 16px; margin: 14px 0; }
.form-grid label { display: grid; gap: 5px; font-size: 12px; color: #8194a8; font-weight: 700; }
.form-grid .span-2 { grid-column: 1 / -1; }
.form-grid input, .form-grid select { border: 1px solid #cfdae6; border-radius: 8px; padding: 8px 10px; font-size: 13px; color: #24415f; font-weight: 500; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; }
</style>
