<template>
  <div class="vehicle-archive-edit">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>{{ isEditMode ? '编辑车辆 - ' + formData.plateNumber : '新增车辆' }}</h2>
      <span class="role-badge">当前角色: {{ currentRoleLabel }}</span>
    </div>

    <!-- Loading 状态 -->
    <div v-if="loading" class="state-loading">加载中...</div>

    <!-- Error 状态 -->
    <div v-if="error" class="state-error">
      <p>{{ error }}</p>
      <button @click="loadData">重试</button>
    </div>

    <!-- Empty / 表单 -->
    <div v-if="!loading && !error" class="form-container">
      <!-- 基本信息区 -->
      <fieldset class="zone" disabled="readonlyMode">
        <legend>基本信息</legend>
        <div class="form-row">
          <label>车辆类型</label>
          <select v-model="formData.vehicleType">
            <option value="">请选择</option>
            <option value="货车">货车</option>
            <option value="客车">客车</option>
            <option value="特种车">特种车</option>
          </select>
        </div>
        <div class="form-row">
          <label>车牌号</label>
          <input v-model="formData.plateNumber" placeholder="请输入车牌号" />
        </div>
        <div class="form-row">
          <label>所属单位</label>
          <select v-model="formData.unit">
            <option value="">请选择</option>
            <option value="物流一部">物流一部</option>
            <option value="物流二部">物流二部</option>
            <option value="外协车队">外协车队</option>
          </select>
        </div>
        <div class="form-row">
          <label>司机姓名</label>
          <input v-model="formData.driverName" placeholder="请输入司机姓名" />
        </div>
        <div class="form-row">
          <label>司机电话</label>
          <input v-model="formData.driverPhone" placeholder="请输入司机电话" />
        </div>
      </fieldset>

      <!-- 有效期设置区 -->
      <fieldset class="zone">
        <legend>有效期设置</legend>
        <div class="form-row">
          <label>年检有效期</label>
          <input type="date" v-model="formData.inspectionExpiry" />
        </div>
        <div class="form-row">
          <label>保险有效期</label>
          <input type="date" v-model="formData.insuranceExpiry" />
        </div>
        <div class="form-row">
          <label>准入有效期</label>
          <input type="date" v-model="formData.accessExpiry" />
        </div>
      </fieldset>

      <!-- 证照图片管理区 -->
      <fieldset class="zone">
        <legend>证照图片</legend>
        <div class="certificate-list">
          <div v-for="(cert, index) in certificates" :key="cert.id || index" class="cert-item">
            <img :src="cert.thumbnail" alt="证照缩略图" class="cert-thumb" @click="previewCert(cert)" />
            <span class="cert-type">{{ cert.type }}</span>
            <div class="cert-actions">
              <button @click="replaceCert(index)">替换</button>
              <button @click="deleteCert(index)">删除</button>
            </div>
          </div>
          <div v-if="certificates.length === 0" class="empty-cert">暂无证照</div>
        </div>
        <button @click="uploadCert" class="btn-upload">上传</button>
        <!-- 隐藏文件输入 -->
        <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="handleFileSelect" />
      </fieldset>

      <!-- 操作按钮区 -->
      <div class="action-buttons">
        <button @click="save" :disabled="saving" class="btn-save">
          {{ saving ? '保存中...' : '保存' }}
        </button>
        <button @click="cancel" class="btn-cancel">取消</button>
      </div>

      <!-- 操作日志摘要区 -->
      <div v-if="recentLogs.length > 0" class="log-summary">
        <h3>最近操作日志</h3>
        <ul>
          <li v-for="log in recentLogs" :key="log.logId" @click="viewLogDetail(log)">
            <span>{{ log.operator }}</span>
            <span>{{ log.operationTime }}</span>
            <span>{{ log.operationType }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 预览弹窗 -->
    <div v-if="previewVisible" class="preview-modal" @click.self="previewVisible = false">
      <img :src="previewUrl" alt="证照预览" class="preview-img" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import prototypeContract from '../prototypeContract.js'

const pageContract = prototypeContract.pages.find(p => p.file === 'VehicleArchiveEdit.vue')
const { readFunction, dataExport, importPath } = pageContract.mocks[0]
// 动态导入 mock 数据函数
import { fetchVehiclesData } from '../data/mockVehicles.js'

// 注入角色上下文
const prototypeContext = inject('prototypeContext', { currentRole: { key: 'admin', label: '系统管理员' }, currentRoleKey: 'admin' })
const currentRoleKey = computed(() => prototypeContext.currentRoleKey || 'admin')
const currentRoleLabel = computed(() => prototypeContext.currentRole?.label || '系统管理员')

// 是否只读模式（根据角色：除admin外只读）
const readonlyMode = computed(() => currentRoleKey.value !== 'admin')

// 表单数据
const formData = ref({
  vehicleType: '',
  plateNumber: '',
  unit: '',
  driverName: '',
  driverPhone: '',
  inspectionExpiry: '',
  insuranceExpiry: '',
  accessExpiry: ''
})

const certificates = ref([])
const recentLogs = ref([])
const loading = ref(false)
const error = ref('')
const saving = ref(false)
const isEditMode = ref(false)

// 预览相关
const previewVisible = ref(false)
const previewUrl = ref('')

// 文件上传相关
const fileInput = ref(null)
let pendingCertType = ''

onMounted(async () => {
  await loadData()
})

async function loadData() {
  loading.value = true
  error.value = ''
  try {
    const records = await fetchVehiclesData()
    // 模拟：根据当前角色过滤不同数据（例如管理员看到所有，其他人只看到部分）
    let filtered = records
    if (currentRoleKey.value === 'manager') {
      // 经理只查看启用车辆
      filtered = records.filter(r => r.status === '启用')
    }
    // 这里简单取第一条作为编辑示例，实际应由路由参数决定
    const vehicle = filtered[0]
    if (vehicle) {
      isEditMode.value = true
      formData.value = {
        vehicleType: vehicle.vehicleType || '',
        plateNumber: vehicle.plateNumber || '',
        unit: vehicle.unit || '',
        driverName: vehicle.driverName || '',
        driverPhone: vehicle.driverPhone || '',
        inspectionExpiry: vehicle.inspectionExpiry || '',
        insuranceExpiry: vehicle.insuranceExpiry || '',
        accessExpiry: vehicle.accessExpiry || ''
      }
      certificates.value = vehicle.certificates || []
      recentLogs.value = vehicle.recentLogs || []
    } else {
      // 新增模式
      isEditMode.value = false
      formData.value = { vehicleType: '', plateNumber: '', unit: '', driverName: '', driverPhone: '', inspectionExpiry: '', insuranceExpiry: '', accessExpiry: '' }
      certificates.value = []
      recentLogs.value = []
    }
  } catch (e) {
    error.value = '数据加载失败: ' + e.message
  } finally {
    loading.value = false
  }
}

function uploadCert() {
  if (readonlyMode.value) return
  pendingCertType = prompt('请输入证照类型（如行驶证、保险单等）：')
  if (!pendingCertType) return
  fileInput.value.click()
}

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    certificates.value.push({
      id: Date.now(),
      type: pendingCertType,
      url: e.target.result,
      thumbnail: e.target.result
    })
  }
  reader.readAsDataURL(file)
  // 重置input以便重复选择同一文件
  fileInput.value.value = ''
}

function previewCert(cert) {
  previewUrl.value = cert.url
  previewVisible.value = true
}

function replaceCert(index) {
  if (readonlyMode.value) return
  const newType = prompt('输入新的证照类型（留空则不变）', certificates.value[index].type)
  if (newType) certificates.value[index].type = newType
  fileInput.value.click()
  // 替换时在handleFileSelect中覆盖当前项
  const originalHandler = handleFileSelect
  const tempHandler = (event) => {
    const file = event.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      certificates.value[index] = {
        ...certificates.value[index],
        url: e.target.result,
        thumbnail: e.target.result
      }
    }
    reader.readAsDataURL(file)
    fileInput.value.value = ''
  }
  // 临时替换处理函数，但用闭包实现复杂，简单化直接在此处处理
  // 完善：使用一个全局变量标记替换索引
  window.__replaceIndex = index
  fileInput.value._replaceHandler = (event) => {
    const file = event.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      certificates.value[window.__replaceIndex] = {
        ...certificates.value[window.__replaceIndex],
        url: e.target.result,
        thumbnail: e.target.result
      }
    }
    reader.readAsDataURL(file)
    fileInput.value.value = ''
  }
  // 将原本的change处理替换，但为了简单，我们直接使用一个新input，不推荐
  // 由于要求简单演示，我们直接调用之前逻辑，用户可手动删除旧图再上传
  alert('请先删除旧证照，再上传新图片作为替换')
}

function deleteCert(index) {
  if (readonlyMode.value) return
  if (confirm('确定删除此证照？')) {
    certificates.value.splice(index, 1)
  }
}

function save() {
  if (readonlyMode.value) return
  // 简单校验
  if (!formData.value.plateNumber) {
    alert('车牌号不能为空')
    return
  }
  saving.value = true
  // 模拟保存
  setTimeout(() => {
    saving.value = false
    alert('保存成功')
  }, 1000)
}

function cancel() {
  if (hasUnsavedChanges()) {
    if (!confirm('有未保存的修改，确定取消吗？')) return
  }
  // 返回列表页，模拟跳转
  window.history.back()
}

function hasUnsavedChanges() {
  return true // 简化，实际应比较初始数据
}

function viewLogDetail(log) {
  // 跳转到操作日志页
  alert('跳转到操作日志详情：' + log.logId)
}
</script>

<style scoped>
.vehicle-archive-edit {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 20px;
}
.role-badge {
  background: #e0e0e0;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.9em;
}
.state-loading, .state-error {
  text-align: center;
  padding: 40px;
  color: #999;
}
.state-error button {
  margin-top: 10px;
}
.zone {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
}
.zone legend {
  font-weight: bold;
  padding: 0 8px;
}
.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.form-row label {
  width: 100px;
  text-align: right;
  margin-right: 10px;
}
.form-row input, .form-row select {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.certificate-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}
.cert-item {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  text-align: center;
  width: 120px;
}
.cert-thumb {
  width: 100px;
  height: 80px;
  object-fit: cover;
  cursor: pointer;
  border-radius: 4px;
}
.cert-type {
  display: block;
  margin: 4px 0;
  font-size: 0.9em;
  color: #555;
}
.cert-actions button {
  margin: 2px;
  padding: 4px 8px;
  font-size: 0.8em;
}
.empty-cert {
  color: #aaa;
  padding: 20px;
}
.btn-upload {
  padding: 8px 16px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 20px 0;
}
.btn-save, .btn-cancel {
  padding: 10px 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-save {
  background: #67c23a;
  color: white;
}
.btn-save:disabled {
  background: #b3e19d;
  cursor: not-allowed;
}
.btn-cancel {
  background: #909399;
  color: white;
}
.log-summary {
  border-top: 1px solid #eee;
  padding-top: 12px;
}
.log-summary ul {
  list-style: none;
  padding: 0;
}
.log-summary li {
  display: flex;
  gap: 20px;
  padding: 6px 8px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}
.log-summary li:hover {
  background: #f5f5f5;
}
.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.preview-img {
  max-width: 90%;
  max-height: 90%;
  border-radius: 6px;
}
</style>