<template>
  <div class="vehicle-archive-edit">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>{{ isEdit ? '编辑车辆 - ' + vehicle.plate : '新增车辆' }}</h2>
      <span class="role-badge" v-if="currentRoleKey !== 'admin'">当前角色：{{ currentRoleKey }}（只读模式）</span>
    </div>

    <!-- Loadin状态 -->
    <div v-if="loading" class="loading-state">加载中...</div>
    <!-- Error状态 -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="loadData">重试</button>
    </div>
    <!-- Empty状态 + 正常内容 -->
    <div v-else class="page-content">
      <!-- 基本信息区 -->
      <section class="zone basic-info">
        <h3>基本信息</h3>
        <div class="form-row">
          <label>车辆类型</label>
          <select v-model="vehicle.type" :disabled="readonly">
            <option value="重型卡车">重型卡车</option>
            <option value="轻型货车">轻型货车</option>
            <option value="罐车">罐车</option>
          </select>
        </div>
        <div class="form-row">
          <label>车牌号</label>
          <input v-model="vehicle.plate" :disabled="readonly" />
        </div>
        <div class="form-row">
          <label>所属单位</label>
          <select v-model="vehicle.unit" :disabled="readonly">
            <option value="一车间">一车间</option>
            <option value="二车间">二车间</option>
            <option value="后勤部">后勤部</option>
          </select>
        </div>
        <div class="form-row">
          <label>司机姓名</label>
          <input v-model="vehicle.driverName" :disabled="readonly" />
        </div>
        <div class="form-row">
          <label>司机电话</label>
          <input v-model="vehicle.driverPhone" :disabled="readonly" />
        </div>
      </section>

      <!-- 有效期设置区 -->
      <section class="zone validity">
        <h3>有效期设置</h3>
        <div class="form-row">
          <label>年检有效期</label>
          <input type="date" v-model="vehicle.inspectionDate" :disabled="readonly" />
          <button v-if="!readonly" @click="vehicle.inspectionDate = ''">清除</button>
        </div>
        <div class="form-row">
          <label>保险有效期</label>
          <input type="date" v-model="vehicle.insuranceDate" :disabled="readonly" />
          <button v-if="!readonly" @click="vehicle.insuranceDate = ''">清除</button>
        </div>
        <div class="form-row">
          <label>准入有效期</label>
          <input type="date" v-model="vehicle.accessDate" :disabled="readonly" />
          <button v-if="!readonly" @click="vehicle.accessDate = ''">清除</button>
        </div>
      </section>

      <!-- 证照图片管理区 -->
      <section class="zone certificates">
        <h3>证照图片管理</h3>
        <div v-if="certificates.length === 0" class="empty-cert-list">暂无证照图片</div>
        <ul class="cert-list" v-else>
          <li v-for="(cert, idx) in certificates" :key="idx" class="cert-item">
            <span class="cert-type">{{ cert.type }}</span>
            <img :src="cert.thumbnail || cert.url" class="cert-thumb" @click="previewCert(cert)" />
            <div class="cert-actions">
              <button @click="previewCert(cert)" :disabled="readonly">预览</button>
              <button @click="replaceCert(idx)" :disabled="readonly">替换</button>
              <button @click="deleteCert(idx)" :disabled="readonly">删除</button>
            </div>
          </li>
        </ul>
        <div class="upload-area" v-if="!readonly">
          <input type="file" accept="image/*" @change="handleUpload" />
          <span>选择证照类型：</span>
          <select v-model="newCertType">
            <option value="行驶证">行驶证</option>
            <option value="驾驶证">驾驶证</option>
            <option value="保险单">保险单</option>
          </select>
          <button @click="triggerUpload">上传</button>
        </div>
      </section>

      <!-- 操作按钮区 -->
      <section class="zone actions">
        <button class="btn-save" @click="handleSave" :disabled="saving || readonly">
          {{ saving ? '保存中...' : '保存' }}
        </button>
        <button class="btn-cancel" @click="handleCancel">取消</button>
      </section>

      <!-- 操作日志摘要区 -->
      <section class="zone logs">
        <h3>操作日志摘要</h3>
        <div v-if="operationLogs.length === 0" class="empty-logs">暂无操作日志</div>
        <ul v-else class="log-list">
          <li v-for="log in operationLogs.slice(0, 4)" :key="log.id" class="log-item" @click="goToLogDetail(log)">
            <span class="log-type">{{ log.type }}</span>
            <span class="log-time">{{ log.time }}</span>
            <span class="log-user">{{ log.user }}</span>
          </li>
        </ul>
      </section>
    </div>

    <!-- 预览弹窗（简单模拟） -->
    <div v-if="previewVisible" class="preview-overlay" @click.self="previewVisible = false">
      <img :src="previewUrl" class="preview-image" />
      <button @click="previewVisible = false">关闭</button>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, computed, reactive } from 'vue'
import { fetchVehiclesData } from '../data/mockVehicles.js'

// inject prototype context
const prototypeContext = inject('prototypeContext')
const currentRole = prototypeContext?.currentRole || ''
const currentRoleKey = prototypeContext?.currentRoleKey || 'admin'

// state
const loading = ref(true)
const error = ref('')
const saving = ref(false)
const isEdit = ref(false) // 假设编辑模式通过URL参数控制，这里简化
const readonly = computed(() => currentRoleKey !== 'admin')

// 车辆表单数据（模拟 vehicleItem schema）
const vehicle = reactive({
  id: '',
  plate: '',
  type: '',
  unit: '',
  driverName: '',
  driverPhone: '',
  inspectionDate: '',
  insuranceDate: '',
  accessDate: '',
  status: ''
})

// 证照列表（模拟）
const certificates = ref([])
const newCertType = ref('行驶证')
const previewUrl = ref('')
const previewVisible = ref(false)

// 操作日志列表（模拟）
const operationLogs = ref([])

// 加载数据
async function loadData() {
  loading.value = true
  error.value = ''
  try {
    const data = await fetchVehiclesData()
    // 取第一条记录作为示例（编辑模式）
    if (data && data.length > 0) {
      const item = data[0]
      isEdit.value = true
      vehicle.id = item.vehicleId || item.id || ''
      vehicle.plate = item.plate || '京A12345'
      vehicle.type = item.type || '重型卡车'
      vehicle.unit = item.unit || '一车间'
      vehicle.driverName = item.driverName || '张三'
      vehicle.driverPhone = item.driverPhone || '13800001111'
      vehicle.inspectionDate = item.inspectionDate || '2025-06-01'
      vehicle.insuranceDate = item.insuranceDate || '2025-12-31'
      vehicle.accessDate = item.accessDate || '2025-09-30'
      vehicle.status = item.status || '启用'
      // 模拟证照数据（页面内normalize映射）
      certificates.value = [
        { id: 'c1', type: '行驶证', url: '', thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iMTUiIHk9IjM1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2NjYiPlRodW1iPC90ZXh0Pjwvc3ZnPg==' },
        { id: 'c2', type: '驾驶证', url: '', thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iMTUiIHk9IjM1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2NjYiPlRodW1iPC90ZXh0Pjwvc3ZnPg==' }
      ]
      // 模拟操作日志（数据来源于mock schema中的operationLog字段）
      operationLogs.value = [
        { id: 'log1', type: '编辑', time: '2025-04-01 10:00', user: '管理员-周工' },
        { id: 'log2', type: '启用', time: '2025-03-28 15:30', user: '管理员-周工' }
      ]
    } else {
      // 新增模式，字段为空
      isEdit.value = false
    }
  } catch (err) {
    error.value = '加载数据失败：' + (err.message || err)
  } finally {
    loading.value = false
  }
}
onMounted(loadData)

// 保存处理
async function handleSave() {
  saving.value = true
  // 模拟校验
  if (!vehicle.plate) {
    alert('车牌号不能为空')
    saving.value = false
    return
  }
  // 模拟保存请求
  await new Promise(resolve => setTimeout(resolve, 1000))
  saving.value = false
  alert('保存成功！')
  // 实际项目跳转列表页，这里模拟
}

// 取消处理
function handleCancel() {
  if (confirm('取消将丢失未保存的修改，确定返回？')) {
    // 返回上一页
    window.history.back()
  }
}

// 证照相关函数
function previewCert(cert) {
  previewUrl.value = cert.url || cert.thumbnail
  previewVisible.value = true
}

function replaceCert(index) {
  // 模拟替换：弹出文件选择器
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // 模拟替换成功，更新缩略图为对象URL
      const url = URL.createObjectURL(file)
      certificates.value[index] = { ...certificates.value[index], thumbnail: url, url: url }
      // 记录操作日志
      operationLogs.value.unshift({ id: 'log' + Date.now(), type: '替换证照', time: new Date().toLocaleString(), user: currentRole?.userName || '未知' })
    }
  }
  input.click()
}

function deleteCert(index) {
  if (confirm('确认删除该证照图片？')) {
    certificates.value.splice(index, 1)
    operationLogs.value.unshift({ id: 'log' + Date.now(), type: '删除证照', time: new Date().toLocaleString(), user: currentRole?.userName || '未知' })
  }
}

function handleUpload(e) {
  const file = e.target.files[0]
  if (file) {
    const url = URL.createObjectURL(file)
    certificates.value.push({ id: 'c' + Date.now(), type: newCertType.value, url: url, thumbnail: url })
    operationLogs.value.unshift({ id: 'log' + Date.now(), type: '上传证照', time: new Date().toLocaleString(), user: currentRole?.userName || '未知' })
  }
}

function triggerUpload() {
  // 触发文件选择
  const input = document.querySelector('.upload-area input[type="file"]')
  input && input.click()
}

function goToLogDetail(log) {
  // 模拟跳转到操作日志详情
  alert('查看日志：' + log.type + ' - ' + log.time)
}
</script>

<style scoped>
.vehicle-archive-edit {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  font-family: Arial, sans-serif;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.role-badge {
  background: #e6a23c;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}
.loading-state, .error-state {
  text-align: center;
  padding: 40px;
  color: #909399;
}
.error-state button {
  margin-top: 12px;
  padding: 8px 16px;
  cursor: pointer;
}
.zone {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  background: #fafafa;
}
.zone h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #303133;
}
.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.form-row label {
  width: 100px;
  flex-shrink: 0;
  color: #606266;
}
.form-row input, .form-row select {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-right: 8px;
}
.cert-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.cert-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 8px;
  background: white;
}
.cert-type {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}
.cert-thumb {
  width: 80px;
  height: 60px;
  object-fit: cover;
  cursor: pointer;
  border-radius: 4px;
}
.cert-actions button {
  margin: 4px 2px;
  padding: 2px 8px;
  font-size: 12px;
  cursor: pointer;
}
.upload-area {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.actions {
  display: flex;
  gap: 12px;
}
.btn-save, .btn-cancel {
  padding: 8px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
.btn-save {
  background: #409eff;
  color: white;
}
.btn-save:disabled {
  background: #a0cfff;
  cursor: not-allowed;
}
.btn-cancel {
  background: white;
  border: 1px solid #dcdfe6;
  color: #606266;
}
.log-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.log-item {
  display: flex;
  gap: 16px;
  padding: 6px 0;
  border-bottom: 1px solid #ebeef5;
  cursor: pointer;
}
.log-item:hover {
  background: #f0f9eb;
}
.log-type, .log-time, .log-user {
  color: #606266;
}
.empty-cert-list, .empty-logs {
  color: #c0c4cc;
  padding: 12px 0;
}
.preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.preview-image {
  max-width: 80%;
  max-height: 80%;
  border-radius: 8px;
}
.preview-overlay button {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  background: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>