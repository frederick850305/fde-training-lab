<template>
  <div class="task-adjust-view">
    <!-- Empty state -->
    <div v-if="isEmpty" class="empty-state">
      <el-alert title="无法获取任务信息，请返回重试" type="error" show-icon />
      <el-button disabled style="margin-top: 16px;">提交</el-button>
    </div>

    <!-- Normal content -->
    <div v-else>
      <!-- 顶部任务/车辆信息摘要区 -->
      <section class="summary-section">
        <p><strong>车牌：</strong>{{ vehicleInfo.plate }}</p>
        <p><strong>司机：</strong>{{ vehicleInfo.driver }}</p>
        <p><strong>任务描述：</strong>{{ vehicleInfo.taskDesc }}</p>
      </section>

      <!-- 操作类型选择按钮组 -->
      <section class="action-section">
        <el-radio-group v-model="actionType" size="small">
          <el-radio-button value="change">改派</el-radio-button>
          <el-radio-button value="cancel">取消</el-radio-button>
          <el-radio-button value="add">加派</el-radio-button>
        </el-radio-group>
      </section>

      <!-- 操作表单区 -->
      <section class="form-section">
        <!-- 改派 -->
        <div v-if="actionType === 'change'" class="change-form">
          <el-form label-width="100px">
            <el-form-item label="目标司机">
              <el-input v-model="targetDriverName" readonly placeholder="点击选择司机" @click="openDriverPicker" />
            </el-form-item>
          </el-form>
        </div>

        <!-- 取消 -->
        <div v-if="actionType === 'cancel'" class="cancel-form">
          <el-form label-width="100px">
            <el-form-item label="确认原因">
              <el-input v-model="cancelReason" type="textarea" rows="3" placeholder="请填写取消原因" />
            </el-form-item>
          </el-form>
        </div>

        <!-- 加派 -->
        <div v-if="actionType === 'add'" class="add-form">
          <el-form label-width="100px">
            <el-form-item label="作业地点">
              <el-input v-model="addLocation" readonly placeholder="点击选择作业点" @click="openLocationPicker" />
            </el-form-item>
            <el-form-item label="作业时间">
              <el-date-picker v-model="addTime" type="datetime" placeholder="选择日期时间" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="作业要求">
              <el-input v-model="addRequirement" type="textarea" rows="3" placeholder="请填写作业要求" />
            </el-form-item>
          </el-form>
        </div>
      </section>

      <!-- 异常处理记录区 -->
      <section class="exception-section">
        <el-form label-width="100px">
          <el-form-item label="处理原因">
            <el-input v-model="exceptionReason" type="textarea" rows="2" placeholder="请填写异常处理原因" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="remark" type="textarea" rows="2" placeholder="备注信息" />
          </el-form-item>
          <el-form-item label="附件">
            <el-upload action="#" :auto-upload="false" list-type="text">
              <el-button size="small" type="primary">选择文件</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </section>

      <!-- 底部提交确认按钮区 -->
      <section class="submit-section">
        <el-button type="primary" :loading="isLoading" :disabled="isSubmitting" @click="handleSubmit">
          {{ isLoading ? '提交中...' : '提交' }}
        </el-button>
      </section>
    </div>

    <!-- Driver picker dialog (simulated) -->
    <el-dialog v-model="driverPickerVisible" title="选择目标司机" width="90%" top="10vh">
      <el-table :data="nearbyDrivers" @row-click="selectDriver">
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="plate" label="车牌" />
        <el-table-column prop="location" label="当前位置" />
        <el-table-column prop="distance" label="距离" />
      </el-table>
    </el-dialog>

    <!-- Location picker (simulated) -->
    <el-dialog v-model="locationPickerVisible" title="选择作业地点" width="90%" top="10vh">
      <el-input v-model="searchLocation" placeholder="搜索地点" style="margin-bottom:12px;" />
      <div class="mock-map" @click="mockPick">
        <p>点击模拟地图选点：{{ selectedAddress }}</p>
      </div>
    </el-dialog>

    <!-- Confirm dialog -->
    <ConfirmDialog ref="confirmDialogRef" :visible="confirmVisible" title="确认操作" :content="confirmContent" @confirm="doSubmit" @cancel="confirmVisible=false" />

    <!-- Loading overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { nearbyVehicles } from '@/data/mockDispatch.js'

const route = useRoute()
const router = useRouter()

// —— Data ——
const isEmpty = ref(false)
const isLoading = ref(false)
const isSubmitting = ref(false)
const errorMsg = ref('')

const vehicleInfo = ref({
  plate: '',
  driver: '',
  taskDesc: ''
})

const actionType = ref('change')

// 改派
const targetDriverName = ref('')
const targetDriverId = ref('')

// 取消
const cancelReason = ref('')

// 加派
const addLocation = ref('')
const addTime = ref('')
const addRequirement = ref('')

// 异常记录
const exceptionReason = ref('')
const remark = ref('')
const files = ref([])

// 弹窗
const driverPickerVisible = ref(false)
const locationPickerVisible = ref(false)
const nearbyDrivers = ref([])
const searchLocation = ref('')
const selectedAddress = ref('')

// 确认弹窗
const confirmVisible = ref(false)
const confirmContent = computed(() => {
  let summary = `操作类型：${actionType.value === 'change' ? '改派' : actionType.value === 'cancel' ? '取消' : '加派'}\n`
  if (actionType.value === 'change') summary += `目标司机：${targetDriverName.value}\n`
  if (actionType.value === 'cancel') summary += `取消原因：${cancelReason.value}\n`
  if (actionType.value === 'add') {
    summary += `作业地点：${addLocation.value}\n`
    summary += `作业时间：${addTime.value}\n`
    summary += `作业要求：${addRequirement.value}\n`
  }
  summary += `异常处理原因：${exceptionReason.value}`
  return summary
})

// —— Lifecycle ——
onMounted(() => {
  const taskId = route.query.taskId
  if (!taskId) {
    isEmpty.value = true
    return
  }
  // Simulate fetching vehicle info (here using mock)
  vehicleInfo.value = {
    plate: '京A12345',
    driver: '张三',
    taskDesc: '从A仓库运送货物到B站点'
  }
  // Load nearby drivers
  nearbyDrivers.value = nearbyVehicles.map(v => ({
    id: v.vehicleId,
    name: v.driver || '未知',
    plate: v.plate,
    location: v.location || '未知',
    distance: v.distance || '--'
  }))
})

// —— Methods ——
function openDriverPicker() {
  driverPickerVisible.value = true
}

function selectDriver(row) {
  targetDriverName.value = row.name + ' (' + row.plate + ')'
  targetDriverId.value = row.id
  driverPickerVisible.value = false
}

function openLocationPicker() {
  locationPickerVisible.value = true
}

function mockPick() {
  selectedAddress.value = '北京市朝阳区望京SOHO'
  addLocation.value = selectedAddress.value
  locationPickerVisible.value = false
}

function handleSubmit() {
  // Validate
  if (actionType.value === 'change' && !targetDriverName.value) {
    ElMessage.warning('请选择目标司机')
    return
  }
  if (actionType.value === 'cancel' && !cancelReason.value) {
    ElMessage.warning('请填写取消原因')
    return
  }
  if (actionType.value === 'add' && (!addLocation.value || !addTime.value)) {
    ElMessage.warning('请填写作业地点和作业时间')
    return
  }
  if (!exceptionReason.value) {
    ElMessage.warning('请填写异常处理原因')
    return
  }
  // Show confirm dialog
  confirmVisible.value = true
}

async function doSubmit() {
  confirmVisible.value = false
  isSubmitting.value = true
  isLoading.value = true
  try {
    // Simulate API call
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        // 80% success for demo
        if (Math.random() > 0.2) {
          resolve()
        } else {
          reject(new Error('提交失败，请稍后重试'))
        }
      }, 1500)
    })
    ElMessage.success('操作成功')
    router.push({ path: '/workbench', query: { refresh: Date.now() } })
  } catch (e) {
    errorMsg.value = e.message || '操作失败：未知错误'
    ElMessage.error(errorMsg.value)
  } finally {
    isLoading.value = false
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.task-adjust-view {
  padding: 16px;
  position: relative;
  min-height: 100vh;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
}
.summary-section {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
}
.summary-section p {
  margin: 4px 0;
}
.action-section {
  margin-bottom: 16px;
}
.form-section {
  margin-bottom: 16px;
}
.exception-section {
  margin-bottom: 16px;
}
.submit-section {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #409eff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.mock-map {
  width: 100%;
  height: 200px;
  background: #e6f7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px dashed #91d5ff;
  border-radius: 4px;
}
</style>