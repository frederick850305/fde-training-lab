<template>
  <div class="vehicle-archive-edit">
    <!-- 页面标题 -->
    <div class="page-title">
      <h2>{{ isEdit ? '编辑车辆 - ' + formData.plateNumber : '新增车辆' }}</h2>
    </div>

    <!-- Loading 状态 -->
    <div v-if="pageLoading" class="loading-mask">
      <div class="loading-indicator">加载中...</div>
    </div>

    <!-- Error 状态 -->
    <div v-else-if="pageError" class="error-mask">
      <p>加载失败：{{ pageErrorMessage }}</p>
      <button @click="reloadPage">重试</button>
    </div>

    <!-- 主要内容区域 -->
    <div v-else class="form-container">
      <!-- 基本信息区 -->
      <section class="form-section">
        <h3>基本信息</h3>
        <div class="form-row">
          <div class="form-item">
            <label>车辆类型</label>
            <select v-model="formData.vehicleType" required>
              <option value="">请选择</option>
              <option value="truck">卡车</option>
              <option value="van">厢式货车</option>
              <option value="trailer">挂车</option>
            </select>
          </div>
          <div class="form-item">
            <label>车牌号</label>
            <input v-model="formData.plateNumber" placeholder="请输入车牌号" required />
          </div>
          <div class="form-item">
            <label>所属单位</label>
            <select v-model="formData.organization" required>
              <option value="">请选择</option>
              <option value="dept1">部门一</option>
              <option value="dept2">部门二</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-item">
            <label>司机姓名</label>
            <input v-model="formData.driverName" placeholder="请输入司机姓名" />
          </div>
          <div class="form-item">
            <label>司机电话</label>
            <input v-model="formData.driverPhone" placeholder="请输入司机电话" />
          </div>
        </div>
      </section>

      <!-- 有效期设置区 -->
      <section class="form-section">
        <h3>有效期设置</h3>
        <div class="form-row">
          <div class="form-item">
            <label>年检有效期</label>
            <input type="date" v-model="formData.inspectionDate" />
            <button v-if="formData.inspectionDate" @click="formData.inspectionDate = ''" class="clear-btn">清除</button>
          </div>
          <div class="form-item">
            <label>保险有效期</label>
            <input type="date" v-model="formData.insuranceDate" />
            <button v-if="formData.insuranceDate" @click="formData.insuranceDate = ''" class="clear-btn">清除</button>
          </div>
          <div class="form-item">
            <label>准入有效期</label>
            <input type="date" v-model="formData.accessDate" />
            <button v-if="formData.accessDate" @click="formData.accessDate = ''" class="clear-btn">清除</button>
          </div>
        </div>
      </section>

      <!-- 证照图片管理区 -->
      <section class="form-section">
        <h3>证照图片</h3>
        <div class="image-list">
          <div v-for="(img, index) in certificateImages" :key="img.id || index" class="image-item">
            <img :src="img.thumbnail || img.url" :alt="img.name" class="thumbnail" @click="previewImage(img)" />
            <div class="image-info">
              <span>{{ img.typeLabel }}</span>
              <div class="image-actions">
                <button @click="replaceImage(index)">替换</button>
                <button @click="deleteImage(index)">删除</button>
              </div>
            </div>
          </div>
          <div v-if="certificateImages.length === 0" class="empty-hint">暂无证照图片</div>
        </div>
        <div class="upload-area">
          <button @click="triggerUpload">上传图片</button>
          <span class="hint">支持 JPG/PNG，单张不超过5MB</span>
        </div>
      </section>

      <!-- 操作日志摘要区 -->
      <section class="form-section" v-if="recentLogs.length > 0">
        <h3>最近操作日志</h3>
        <ul class="log-list">
          <li v-for="log in recentLogs" :key="log.id" @click="viewLogDetail(log)">
            <span class="log-time">{{ log.operateTime }}</span>
            <span class="log-action">{{ log.action }}</span>
            <span class="log-operator">{{ log.operatorName }}</span>
          </li>
        </ul>
      </section>

      <!-- 操作按钮区 -->
      <div class="form-actions">
        <button @click="handleSave" :disabled="saving" class="btn-save">
          {{ saving ? '保存中...' : '保存' }}
        </button>
        <button @click="handleCancel" class="btn-cancel">取消</button>
      </div>

      <!-- 图片预览弹窗（简单实现） -->
      <div v-if="previewVisible" class="preview-overlay" @click.self="closePreview">
        <img :src="previewImgUrl" class="preview-img" />
        <button @click="closePreview" class="close-preview">关闭</button>
      </div>

      <!-- 确认弹窗（简单实现） -->
      <div v-if="confirmVisible" class="confirm-overlay" @click.self="cancelConfirm">
        <div class="confirm-box">
          <p>{{ confirmMessage }}</p>
          <div class="confirm-actions">
            <button @click="confirmCallback" class="confirm-yes">确定</button>
            <button @click="cancelConfirm">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 假设 mock 数据在 src/data 中
import { getVehicleDetail, saveVehicle, getOperationLogs } from '@/data/mockVehicles'

const router = useRouter()
const route = useRoute()

// 页面状态
const pageLoading = ref(true)
const pageError = ref(false)
const pageErrorMessage = ref('')
const saving = ref(false)

// 是否为编辑模式
const isEdit = computed(() => route.query.id || route.params.id)

// 表单数据
const formData = reactive({
  vehicleType: '',
  plateNumber: '',
  organization: '',
  driverName: '',
  driverPhone: '',
  inspectionDate: '',
  insuranceDate: '',
  accessDate: ''
})

// 证照图片列表
const certificateImages = ref([])

// 最近操作日志
const recentLogs = ref([])

// 预览控制
const previewVisible = ref(false)
const previewImgUrl = ref('')

// 确认弹窗控制
const confirmVisible = ref(false)
const confirmMessage = ref('')
let confirmCallback = null

// 加载页面数据
async function loadPageData() {
  pageLoading.value = true
  pageError.value = false
  pageErrorMessage.value = ''
  try {
    if (isEdit.value) {
      const vehicleId = route.query.id || route.params.id
      const detail = await getVehicleDetail(vehicleId)
      // 填充表单
      Object.assign(formData, {
        vehicleType: detail.vehicleType,
        plateNumber: detail.plateNumber,
        organization: detail.organization,
        driverName: detail.driverName,
        driverPhone: detail.driverPhone,
        inspectionDate: detail.inspectionDate,
        insuranceDate: detail.insuranceDate,
        accessDate: detail.accessDate
      })
      certificateImages.value = detail.certificateImages || []
    } else {
      // 新增模式：清空表单（已初始化为空）
    }
    // 加载最近日志（可选）
    if (isEdit.value) {
      const logs = await getOperationLogs(route.query.id, { limit: 4 })
      recentLogs.value = logs
    }
  } catch (e) {
    pageError.value = true
    pageErrorMessage.value = e.message || '加载数据失败'
  } finally {
    pageLoading.value = false
  }
}

onMounted(loadPageData)

// 重试加载
function reloadPage() {
  loadPageData()
}

// 保存
async function handleSave() {
  // 简单校验
  if (!formData.plateNumber || !formData.vehicleType) {
    alert('请填写必填字段')
    return
  }
  saving.value = true
  try {
    await saveVehicle({ ...formData, certificateImages: certificateImages.value })
    // 成功处理
    router.push({ name: 'VehicleList', query: { refresh: Date.now() } })
  } catch (e) {
    alert('保存失败：' + (e.message || '未知错误'))
  } finally {
    saving.value = false
  }
}

// 取消
function handleCancel() {
  // 检查是否有未保存修改（简化处理，直接返回并提示）
  if (true) {
    showConfirm('表单有未保存的修改，确定要离开吗？', () => {
      router.back()
    })
  } else {
    router.back()
  }
}

// 上传图片
function triggerUpload() {
  // 模拟选择文件
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'image/*'
  fileInput.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // 模拟上传并添加
      const imgObj = {
        id: Date.now(),
        url: URL.createObjectURL(file),
        thumbnail: URL.createObjectURL(file),
        name: file.name,
        type: '行驶证', // 需要用户选择类型，这里简化
        typeLabel: '行驶证'
      }
      certificateImages.value.push(imgObj)
    }
  }
  fileInput.click()
}

// 预览
function previewImage(img) {
  previewImgUrl.value = img.url || img.thumbnail
  previewVisible.value = true
}

function closePreview() {
  previewVisible.value = false
}

// 替换
function replaceImage(index) {
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'image/*'
  fileInput.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // 模拟替换：生成新对象，旧图标记为历史（简化处理）
      const oldImg = certificateImages.value[index]
      const newImg = {
        id: Date.now(),
        url: URL.createObjectURL(file),
        thumbnail: URL.createObjectURL(file),
        name: file.name,
        type: oldImg.type,
        typeLabel: oldImg.typeLabel
      }
      certificateImages.value[index] = newImg
      // 记录操作日志（此处省略）
    }
  }
  fileInput.click()
}

// 删除
function deleteImage(index) {
  showConfirm('确定要删除该证照图片吗？', () => {
    certificateImages.value.splice(index, 1)
    // 记录操作日志（省略）
  })
}

// 查看日志详情
function viewLogDetail(log) {
  router.push({ name: 'OperationLogDetail', params: { id: log.id } })
}

// 通用确认弹窗
function showConfirm(message, callback) {
  confirmMessage.value = message
  confirmCallback = callback
  confirmVisible.value = true
}

function cancelConfirm() {
  confirmVisible.value = false
  confirmCallback = null
}
</script>

<style scoped>
.vehicle-archive-edit {
  padding: 24px;
  background: #fff;
  min-height: 100vh;
  position: relative;
}

.page-title h2 {
  margin: 0 0 24px;
  font-size: 20px;
}

.loading-mask, .error-mask {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.form-section {
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.form-section h3 {
  margin: 0 0 12px;
  font-size: 16px;
}

.form-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.form-item {
  flex: 1;
  min-width: 200px;
}

.form-item label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
}

.form-item input,
.form-item select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-item input:focus,
.form-item select:focus {
  border-color: #409eff;
  outline: none;
}

.clear-btn {
  margin-left: 8px;
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}

.image-item {
  width: 120px;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 8px;
  text-align: center;
}

.thumbnail {
  width: 100%;
  height: 80px;
  object-fit: cover;
  cursor: pointer;
}

.image-info {
  margin-top: 8px;
  font-size: 12px;
}

.image-actions button {
  margin: 2px;
  padding: 2px 6px;
  border: 1px solid #ccc;
  border-radius: 2px;
  background: #fafafa;
  cursor: pointer;
}

.empty-hint {
  color: #999;
}

.upload-area {
  margin-top: 8px;
}

.upload-area button {
  padding: 6px 16px;
  border: 1px solid #409eff;
  border-radius: 4px;
  background: #409eff;
  color: #fff;
  cursor: pointer;
}

.hint {
  margin-left: 12px;
  color: #999;
  font-size: 12px;
}

.log-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.log-list li {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  display: flex;
  gap: 12px;
}

.log-list li:hover {
  background: #f5f5f5;
}

.log-time {
  color: #999;
  font-size: 12px;
}

.log-action {
  font-weight: 500;
}

.log-operator {
  color: #666;
}

.form-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-save {
  padding: 8px 24px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-save:disabled {
  background: #a0cfff;
  cursor: not-allowed;
}

.btn-cancel {
  padding: 8px 24px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
}

/* 预览弹窗 */
.preview-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.preview-img {
  max-width: 80%;
  max-height: 80%;
  border-radius: 4px;
}

.close-preview {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  background: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* 确认弹窗 */
.confirm-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.confirm-box {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  min-width: 300px;
  text-align: center;
}

.confirm-actions {
  margin-top: 16px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.confirm-yes {
  padding: 6px 20px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-box button {
  padding: 6px 20px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}
</style>