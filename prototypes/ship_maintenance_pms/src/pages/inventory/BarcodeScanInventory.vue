<template>
  <section class="page">
    <header class="page-head">
      <div class="title-block">
        <span class="eyebrow">物资库存 / 扫码盘点</span>
        <h1>扫码盘点</h1>
        <p>扫描物料条码识别物料，录入实物数量，与系统库存对比生成差异记录，支持拍照留痕。</p>
      </div>
    </header>

    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <div class="sk-row" v-for="n in 3" :key="n"></div>
    </div>

    <div v-else-if="uiState === 'error'" class="state-panel">
      <h2>数据加载失败</h2>
      <p>请检查网络后重试。</p>
      <button @click="reload">重试</button>
    </div>

    <template v-else>
      <div class="work-area">
        <!-- 左：扫码 + 物料 + 录入 -->
        <div class="left-col">
          <!-- 扫码识别区 -->
          <div class="panel scan-panel">
            <h3 class="panel-title">扫码识别区</h3>
            <div class="scan-box">
              <div class="scan-frame">
                <span class="corner tl"></span>
                <span class="corner tr"></span>
                <span class="corner bl"></span>
                <span class="corner br"></span>
                <p class="scan-hint">将条码对准扫描框</p>
              </div>
            </div>
            <div class="scan-input-row">
              <input v-model="barcodeInput" placeholder="输入或扫描物料条码" @keyup.enter="doScan" />
              <button @click="doScan">扫描</button>
            </div>
          </div>

          <!-- 物料信息 -->
          <div v-if="scannedMaterial" class="panel mat-panel">
            <h3 class="panel-title">物料信息</h3>
            <div class="mat-grid">
              <div><span>编码</span><b>{{ scannedMaterial.code }}</b></div>
              <div><span>名称</span><b>{{ scannedMaterial.name }}</b></div>
              <div><span>分类</span><b>{{ scannedMaterial.category }}</b></div>
              <div><span>单位</span><b>{{ scannedMaterial.unit }}</b></div>
              <div><span>存放位置</span><b>{{ scannedMaterial.location }}</b></div>
              <div><span>条码</span><b>{{ scannedMaterial.barcode }}</b></div>
            </div>
          </div>

          <!-- 实物数量录入 + 库存对比 -->
          <div v-if="scannedMaterial" class="panel input-panel">
            <h3 class="panel-title">实物数量录入与对比</h3>
            <label class="qty-input">
              <span>实际数量</span>
              <input type="number" min="0" v-model.number="actualQty" placeholder="录入盘点数量" />
            </label>
            <div class="compare-row">
              <div class="compare-cell">
                <span>系统库存</span>
                <strong>{{ scannedMaterial.systemInventory }} {{ scannedMaterial.unit }}</strong>
              </div>
              <div class="compare-arrow">VS</div>
              <div class="compare-cell">
                <span>实物数量</span>
                <strong>{{ actualQty ?? '—' }} {{ scannedMaterial.unit }}</strong>
              </div>
              <div class="compare-cell diff" :class="diffTone">
                <span>差异</span>
                <strong>{{ diffValue }}</strong>
              </div>
            </div>
            <p v-if="diffValue !== 0 && actualQty !== null" class="diff-tip" :class="diffTone">
              {{ diffValue > 0 ? '盘盈' : '盘亏' }} {{ Math.abs(diffValue) }} {{ scannedMaterial.unit }}，将生成差异记录
            </p>
            <div class="submit-row">
              <button class="primary" :disabled="!canSubmit" @click="submitCount">生成差异记录</button>
            </div>
            <p v-if="submitHint" class="submit-hint">{{ submitHint }}</p>
          </div>

          <!-- 拍照留痕 -->
          <div v-if="scannedMaterial" class="panel photo-panel">
            <h3 class="panel-title">拍照留痕</h3>
            <FileUploader :file-list="photoFiles" @upload="onUpload" @delete="onDelete" @preview="onPreview" />
          </div>
        </div>

        <!-- 右：历史盘点记录 -->
        <div class="right-col">
          <div class="panel history-panel">
            <h3 class="panel-title">盘点记录 <em>{{ records.length }}</em></h3>
            <ul class="record-list">
              <li v-for="r in records" :key="r.taskId" :class="{ 'has-diff': r.diff !== 0 }">
                <div class="rec-top">
                  <strong>{{ r.materialName }}</strong>
                  <span class="rec-status" :class="recStatusTone(r.status)">{{ r.status }}</span>
                </div>
                <div class="rec-meta">
                  <span>{{ r.taskId }}</span>
                  <span class="sep">·</span>
                  <span>{{ r.userId }}</span>
                  <span class="sep">·</span>
                  <span>{{ r.location }}</span>
                </div>
                <div class="rec-compare">
                  <span>系统 {{ r.systemInventory }}</span>
                  <span>实物 {{ r.actualQuantity }}</span>
                  <span class="diff" :class="r.diff === 0 ? 'ok' : 'danger'">差 {{ r.diff }}</span>
                </div>
                <small class="rec-time">{{ r.time }} · 附件 {{ r.attachmentMedia }}</small>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import FileUploader from '@/components/FileUploader.vue'
import { fetchMaterials, fetchPhysicalCountRecords, submitAction } from '@/mock/api.js'

const uiState = ref('loading')
const materials = ref([])
const records = ref([])
const barcodeInput = ref('')
const scannedMaterial = ref(null)
const actualQty = ref(null)
const photoFiles = ref([])
const submitHint = ref('')

const diffValue = computed(() => {
  if (!scannedMaterial.value || actualQty.value === null || actualQty.value === '') return 0
  return Number(actualQty.value) - Number(scannedMaterial.value.systemInventory)
})
const diffTone = computed(() => {
  if (diffValue.value === 0) return 'ok'
  return diffValue.value > 0 ? 'gain' : 'loss'
})
const canSubmit = computed(() => scannedMaterial.value && actualQty.value !== null && actualQty.value !== '')

function recStatusTone(s) {
  if (s === '已同步') return 'ok'
  return 'pending'
}

function doScan() {
  const code = barcodeInput.value.trim()
  if (!code) return
  const found = materials.value.find(m => m.barcode === code || m.code === code)
  if (found) {
    scannedMaterial.value = found
    actualQty.value = null
    photoFiles.value = []
    submitHint.value = ''
  } else {
    alert('未匹配到物料，请检查条码')
  }
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

async function submitCount() {
  if (!canSubmit.value) return
  const newRecord = {
    taskId: `PC-${Date.now().toString().slice(-4)}`,
    userId: '机工 当前用户',
    barcode: scannedMaterial.value.barcode,
    materialCode: scannedMaterial.value.code,
    materialName: scannedMaterial.value.name,
    systemInventory: scannedMaterial.value.systemInventory,
    actualQuantity: Number(actualQty.value),
    diff: diffValue.value,
    attachmentMedia: photoFiles.value.length,
    status: '待同步',
    time: new Date().toLocaleString('zh-CN'),
    location: scannedMaterial.value.location,
  }
  records.value = [newRecord, ...records.value]
  await submitAction('submitPhysicalCount', newRecord)
  submitHint.value = `差异记录 ${newRecord.taskId} 已生成，状态：待同步`
  // 重置
  scannedMaterial.value = null
  barcodeInput.value = ''
  actualQty.value = null
  photoFiles.value = []
}

async function reload() {
  uiState.value = 'loading'
  try {
    const [mats, recs] = await Promise.all([fetchMaterials(), fetchPhysicalCountRecords()])
    materials.value = mats
    records.value = recs
    uiState.value = 'success'
  } catch (e) {
    uiState.value = 'error'
  }
}

onMounted(reload)
</script>

<style scoped>
.page { display: grid; gap: 16px; }
.page-head { border: 1px solid #d9e4ef; border-radius: 10px; padding: 18px 20px; background: #fff; }
.eyebrow { color: #1e6fd9; font-size: 12px; font-weight: 900; }
.page-head h1 { margin: 6px 0 6px; font-size: 22px; color: #172033; }
.page-head p { margin: 0; color: #64748b; font-size: 13px; max-width: 760px; }

.state-panel { border: 1px solid #d9e4ef; border-radius: 10px; padding: 32px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0 0 8px; color: #b4232d; }
.state-panel p { color: #64748b; margin: 0 0 14px; }
.state-panel button { border: 1px solid #1e6fd9; border-radius: 8px; padding: 8px 18px; background: #1e6fd9; color: #fff; font-weight: 900; }
.skeleton { display: grid; gap: 12px; }
.sk-row { height: 80px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }

.work-area { display: grid; grid-template-columns: 1.2fr .8fr; gap: 16px; align-items: start; }
.panel { border: 1px solid #d9e4ef; border-radius: 10px; padding: 16px; background: #fff; }
.left-col { display: grid; gap: 14px; }
.right-col { display: grid; gap: 14px; }
.panel-title { margin: 0 0 12px; font-size: 15px; color: #172033; display: flex; align-items: center; gap: 8px; }
.panel-title em { font-size: 12px; color: #64748b; font-style: normal; font-weight: 800; background: #eef3f8; padding: 2px 8px; border-radius: 999px; }

.scan-box { display: grid; place-items: center; padding: 10px 0 14px; }
.scan-frame { position: relative; width: 240px; height: 160px; border-radius: 10px; background: linear-gradient(145deg, #0f3565, #0b1f3b); display: grid; place-items: center; }
.corner { position: absolute; width: 24px; height: 24px; border: 3px solid #62b7ff; }
.corner.tl { top: 12px; left: 12px; border-right: 0; border-bottom: 0; border-radius: 6px 0 0 0; }
.corner.tr { top: 12px; right: 12px; border-left: 0; border-bottom: 0; border-radius: 0 6px 0 0; }
.corner.bl { bottom: 12px; left: 12px; border-right: 0; border-top: 0; border-radius: 0 0 0 6px; }
.corner.br { bottom: 12px; right: 12px; border-left: 0; border-top: 0; border-radius: 0 0 6px 0; }
.scan-hint { color: #9cb0c8; font-size: 13px; font-weight: 800; }
.scan-input-row { display: grid; grid-template-columns: 1fr auto; gap: 8px; }
.scan-input-row input { border: 1px solid #cbd7e4; border-radius: 8px; padding: 11px 12px; font-size: 14px; color: #172033; background: #fff; }
.scan-input-row button { border: 0; border-radius: 8px; padding: 0 20px; background: #1e6fd9; color: #fff; font-weight: 900; }

.mat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.mat-grid div { display: grid; gap: 3px; padding: 8px 10px; border: 1px solid #e2eaf3; border-radius: 8px; background: #f8fbfe; }
.mat-grid span { color: #64748b; font-size: 11px; }
.mat-grid b { font-size: 13px; color: #172033; }

.qty-input { display: grid; gap: 6px; margin-bottom: 14px; }
.qty-input span { color: #53657c; font-size: 13px; font-weight: 800; }
.qty-input input { border: 1px solid #cbd7e4; border-radius: 8px; padding: 11px 12px; font-size: 15px; color: #172033; background: #fff; }

.compare-row { display: grid; grid-template-columns: 1fr 50px 1fr 1fr; gap: 10px; align-items: center; }
.compare-cell { display: grid; gap: 4px; padding: 12px; border: 1px solid #e2eaf3; border-radius: 8px; background: #f8fbfe; text-align: center; }
.compare-cell span { color: #64748b; font-size: 11px; font-weight: 800; }
.compare-cell strong { font-size: 18px; color: #172033; }
.compare-cell.diff.ok strong { color: #11734d; }
.compare-cell.diff.gain strong { color: #1e6fd9; }
.compare-cell.diff.loss strong { color: #b4232d; }
.compare-arrow { text-align: center; color: #64748b; font-weight: 900; font-size: 12px; }
.diff-tip { margin: 10px 0 0; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: 800; }
.diff-tip.ok { color: #11734d; background: #dff6e8; }
.diff-tip.gain { color: #1e6fd9; background: #e3efff; }
.diff-tip.loss { color: #b4232d; background: #ffe1e3; }

.submit-row { margin-top: 14px; display: flex; justify-content: flex-end; }
.submit-row .primary { border: 0; border-radius: 8px; padding: 10px 22px; background: #1e6fd9; color: #fff; font-weight: 900; font-size: 14px; }
.submit-row .primary:disabled { background: #b9c8d8; cursor: not-allowed; }
.submit-hint { margin: 10px 0 0; color: #11734d; font-size: 12px; font-weight: 800; }

.history-panel { position: sticky; top: 0; }
.record-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.record-list li { border: 1px solid #e2eaf3; border-radius: 8px; padding: 12px; background: #f8fbfe; display: grid; gap: 6px; }
.record-list li.has-diff { border-left: 3px solid #b4232d; }
.rec-top { display: flex; justify-content: space-between; align-items: center; }
.rec-top strong { font-size: 14px; color: #172033; }
.rec-status { font-size: 11px; font-weight: 900; padding: 3px 8px; border-radius: 999px; }
.rec-status.ok { color: #11734d; background: #dff6e8; }
.rec-status.pending { color: #8a5a00; background: #fff2cc; }
.rec-meta { display: flex; gap: 5px; color: #64748b; font-size: 11px; }
.rec-meta .sep { opacity: .6; }
.rec-compare { display: flex; gap: 12px; font-size: 12px; color: #3e5068; font-weight: 800; }
.rec-compare .diff.ok { color: #11734d; }
.rec-compare .diff.danger { color: #b4232d; }
.rec-time { color: #8b9aab; font-size: 11px; }

@media (max-width: 980px) {
  .work-area { grid-template-columns: 1fr; }
  .history-panel { position: static; }
}
</style>
