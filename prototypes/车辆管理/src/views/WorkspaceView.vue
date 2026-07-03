<template>
  <div class="workspace-view">
    <!-- 顶部筛选与排序栏 -->
    <div class="filter-bar">
      <select v-model="filters.vehicleType" class="filter-item">
        <option value="">全部车辆类型</option>
        <option value="小型车">小型车</option>
        <option value="大型车">大型车</option>
        <option value="特种车">特种车</option>
      </select>
      <select v-model="filters.workArea" class="filter-item">
        <option value="">全部作业区域</option>
        <option value="A区">A区</option>
        <option value="B区">B区</option>
        <option value="C区">C区</option>
      </select>
      <input type="date" v-model="filters.date" class="filter-item" />
      <select v-model="filters.sort" class="filter-item">
        <option value="urgency">按紧急度排序</option>
        <option value="date">按申请日期排序</option>
      </select>
      <input v-model="filters.keyword" placeholder="搜索车牌号" class="filter-item search-input" />
      <button @click="refreshList" class="btn-refresh">刷新</button>
    </div>

    <!-- 超时提示 -->
    <div v-if="hasOverdue" class="overdue-banner">
      有超时未处理的申请，请及时处理。
    </div>

    <!-- 主体区域 -->
    <div class="main-content">
      <!-- 左侧待办列表 -->
      <div class="list-panel">
        <div v-if="loadingState === 'loading'" class="skeleton-list">
          <div v-for="n in 5" :key="n" class="skeleton-item"></div>
        </div>
        <div v-else-if="loadingState === 'error'" class="error-state">
          <p>{{ errorMessage }}</p>
          <button @click="refreshList">重试</button>
        </div>
        <div v-else-if="reservations.length === 0" class="empty-state">暂无待审批预约</div>
        <div v-else class="list-items">
          <div
            v-for="item in reservations"
            :key="item.id"
            class="list-item"
            :class="{ selected: selectedId === item.id, overdue: item.overdue }"
            @click="selectReservation(item.id)"
          >
            <div class="item-header">
              <StatusTag :status="item.status" :text="item.statusLabel" size="small" />
              <span v-if="item.overdue" class="overdue-badge">超时</span>
            </div>
            <div class="item-body">
              <span class="plate">{{ item.plateNumber }}</span>
              <span class="area">{{ item.workArea }}</span>
              <span class="time">{{ item.applyTime }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧详情与操作区 -->
      <div class="detail-panel">
        <div v-if="!selectedId" class="detail-placeholder">请选择一个预约申请查看详情</div>
        <div v-else-if="detailLoading" class="detail-loading">加载中...</div>
        <div v-else-if="detailError" class="detail-error">
          <p>加载详情失败</p>
          <button @click="loadDetail(selectedId)">重试</button>
        </div>
        <div v-else class="detail-content">
          <!-- 表单详情 -->
          <div class="detail-section">
            <h3>预约信息</h3>
            <p>车牌号：{{ currentDetail.plateNumber }}</p>
            <p>车辆类型：{{ currentDetail.vehicleType }}</p>
            <p>所属单位：{{ currentDetail.unit }}</p>
            <p>作业区域：{{ currentDetail.workArea }}</p>
            <p>预约时间：{{ currentDetail.applyTime }}</p>
            <p>状态：{{ currentDetail.statusLabel }}</p>
          </div>
          <!-- 车辆档案校验结果 -->
          <div class="detail-section" v-if="currentDetail.verification">
            <h3>车辆档案校验</h3>
            <p v-if="currentDetail.verification.passed" style="color: green;">通过</p>
            <p v-else style="color: red;">不通过：{{ currentDetail.verification.reason }}</p>
          </div>
          <!-- 授权码信息（审批通过后显示） -->
          <div class="detail-section" v-if="currentDetail.accessCode">
            <h3>授权码</h3>
            <p>授权码：{{ currentDetail.accessCode.code }}</p>
            <p>同步状态：
              <StatusTag :status="currentDetail.accessCode.syncStatus" :text="currentDetail.accessCode.syncStatusLabel" />
              <button v-if="currentDetail.accessCode.syncStatus !== 'synced'" @click="resyncAccessCode">重新同步</button>
            </p>
          </div>
          <!-- 审批操作 -->
          <div class="detail-actions">
            <label>审批意见：</label>
            <textarea v-model="approvalComment" placeholder="请输入审批意见（驳回必填）" class="comment-input"></textarea>
            <div class="action-buttons">
              <button class="btn-approve" @click="handleApprove">通过</button>
              <button class="btn-reject" @click="handleReject">驳回</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作日志快照 -->
    <div class="log-snapshot" v-if="approvalLogs.length > 0">
      <h3>审批记录</h3>
      <ul>
        <li v-for="log in approvalLogs" :key="log.id">
          {{ log.time }} - {{ log.action }} by {{ log.operator }}: {{ log.comment }}
        </li>
      </ul>
    </div>

    <!-- 二次确认对话框（驳回时使用） -->
    <ConfirmDialog
      :visible="showConfirmDialog"
      title="确认操作"
      :content="confirmContent"
      confirm-text="确认"
      cancel-text="取消"
      :loading="confirmLoading"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import StatusTag from '@/components/StatusTag.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { fetchReservations, fetchDetail, approveReservation, rejectReservation, fetchAccessCode } from '@/data/mockReservations'

// 状态定义
const loadingState = ref('loading') // 'loading' | 'empty' | 'error' | 'success'
const errorMessage = ref('')
const reservations = ref([])
const selectedId = ref(null)
const detailLoading = ref(false)
const detailError = ref(false)
const currentDetail = ref({})
const approvalLogs = ref([])
const hasOverdue = computed(() => reservations.value.some(r => r.overdue))
const approvalComment = ref('')
const showConfirmDialog = ref(false)
const confirmContent = ref('')
const confirmLoading = ref(false)
const pendingAction = ref(null) // 'approve' or 'reject'

// 筛选条件
const filters = reactive({
  vehicleType: '',
  workArea: '',
  date: '',
  sort: 'urgency',
  keyword: ''
})

// 加载列表
async function loadReservations() {
  loadingState.value = 'loading'
  try {
    const params = { ...filters }
    const data = await fetchReservations(params)
    if (data.length === 0) {
      loadingState.value = 'empty'
    } else {
      reservations.value = data
      loadingState.value = 'success'
    }
  } catch (e) {
    loadingState.value = 'error'
    errorMessage.value = e.message || '请求失败'
  }
}

// 选择列表项
async function selectReservation(id) {
  selectedId.value = id
  detailLoading.value = true
  detailError.value = false
  try {
    const detail = await fetchDetail(id)
    currentDetail.value = detail
    approvalLogs.value = detail.logs || []
    detailLoading.value = false
  } catch (e) {
    detailError.value = true
    detailLoading.value = false
  }
  approvalComment.value = ''
}

// 刷新
function refreshList() {
  loadReservations()
}

// 通过
function handleApprove() {
  if (!currentDetail.value.id) return
  // 检查车辆证照是否过期，假设从 detail 中获取
  const verificationPassed = currentDetail.value.verification?.passed !== false
  if (!verificationPassed) {
    confirmContent.value = '车辆证照过期，确定要通过吗？'
  } else {
    confirmContent.value = '确认通过该预约申请？'
  }
  pendingAction.value = 'approve'
  showConfirmDialog.value = true
}

// 驳回
function handleReject() {
  if (!approvalComment.value.trim()) {
    alert('驳回必须填写审批意见')
    return
  }
  confirmContent.value = '确认驳回该预约申请？'
  pendingAction.value = 'reject'
  showConfirmDialog.value = true
}

// 确认回调
async function onConfirm() {
  confirmLoading.value = true
  try {
    if (pendingAction.value === 'approve') {
      const result = await approveReservation(selectedId.value, { comment: approvalComment.value })
      // 成功后更新详情中的授权码
      currentDetail.value.accessCode = result.accessCode
      approvalLogs.value.push({
        id: Date.now(),
        time: new Date().toLocaleString(),
        action: '通过',
        operator: '当前审批人',
        comment: approvalComment.value || ''
      })
      // 触发重新加载列表
      loadReservations()
    } else if (pendingAction.value === 'reject') {
      await rejectReservation(selectedId.value, { comment: approvalComment.value })
      approvalLogs.value.push({
        id: Date.now(),
        time: new Date().toLocaleString(),
        action: '驳回',
        operator: '当前审批人',
        comment: approvalComment.value
      })
      // 关闭详情
      selectedId.value = null
      currentDetail.value = {}
      loadReservations()
    }
    showConfirmDialog.value = false
    confirmLoading.value = false
    pendingAction.value = null
  } catch (e) {
    alert('操作失败：' + (e.message || '未知错误'))
    confirmLoading.value = false
  }
}

function onCancel() {
  showConfirmDialog.value = false
  pendingAction.value = null
}

// 重新同步授权码
async function resyncAccessCode() {
  try {
    const newCode = await fetchAccessCode(selectedId.value)
    currentDetail.value.accessCode = newCode
  } catch (e) {
    alert('同步失败')
  }
}

onMounted(() => {
  loadReservations()
})
</script>

<style scoped>
.workspace-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.filter-bar {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
  align-items: center;
  flex-wrap: wrap;
}

.filter-item {
  padding: 6px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
  min-width: 120px;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.btn-refresh {
  padding: 6px 16px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.overdue-banner {
  background: #faecd8;
  color: #e6a23c;
  padding: 8px 16px;
  border-bottom: 1px solid #e6a23c;
  font-weight: bold;
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.list-panel {
  width: 320px;
  overflow-y: auto;
  border-right: 1px solid #e4e7ed;
  padding: 8px;
}

.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-item {
  height: 60px;
  background: #eef1f6;
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

.error-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
}

.list-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.list-item {
  padding: 10px 12px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.list-item:hover {
  background: #f0f5ff;
}

.list-item.selected {
  background: #ecf5ff;
  border-color: #409eff;
}

.list-item.overdue {
  border-left: 3px solid #e6a23c;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.overdue-badge {
  background: #e6a23c;
  color: #fff;
  font-size: 12px;
  padding: 1px 6px;
  border-radius: 10px;
}

.item-body {
  display: flex;
  gap: 12px;
  font-size: 14px;
}

.plate {
  font-weight: bold;
}

.detail-panel {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.detail-placeholder, .detail-loading, .detail-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
}

.detail-section {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.detail-section h3 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #303133;
}

.detail-section p {
  margin: 4px 0;
  font-size: 14px;
}

.detail-actions {
  margin-top: 16px;
}

.comment-input {
  width: 100%;
  min-height: 60px;
  padding: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  resize: vertical;
  margin-bottom: 12px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.btn-approve {
  padding: 8px 24px;
  background: #67c23a;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-reject {
  padding: 8px 24px;
  background: #f56c6c;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.log-snapshot {
  border-top: 1px solid #e4e7ed;
  padding: 12px 16px;
  background: #fafafa;
  max-height: 120px;
  overflow-y: auto;
}

.log-snapshot h3 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #606266;
}

.log-snapshot ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.log-snapshot li {
  font-size: 13px;
  color: #909399;
  padding: 2px 0;
}
</style>