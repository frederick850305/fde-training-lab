<template>
  <div class="gate-entry-records-view">
    <!-- 顶部筛选栏 -->
    <DataFilterBar
      :filters="filterConfig"
      v-model="filterValues"
      :showSearchButton="false"
      :autoSearchDelay="300"
      @update:modelValue="handleFilterChange"
    />

    <!-- 加载状态 -->
    <div v-if="loading" class="state-loading">
      <div v-for="n in 5" :key="n" class="skeleton-row"></div>
    </div>

    <!-- 出错状态 -->
    <div v-else-if="error" class="state-error">
      <p>{{ errorMessage }}</p>
      <button @click="loadRecords">重试</button>
    </div>

    <!-- 空状态 -->
    <div v-else-if="records.length === 0" class="state-empty">
      <img src="@/assets/empty.svg" alt="暂无入场记录" />
      <p>暂无入场记录</p>
    </div>

    <!-- 记录列表 -->
    <DataTable
      v-else
      :columns="tableColumns"
      :data="tableData"
      :loading="loading"
      emptyText="暂无入场记录"
      :pagination="paginationConfig"
      rowKey="id"
      @row-click="handleRowClick"
    >
      <template #syncStatus="{ row }">
        <StatusTag
          :status="row.syncStatus"
          :text="syncStatusText(row.syncStatus)"
          size="small"
        />
        <button
          v-if="row.syncStatus === 'failed'"
          class="retry-btn"
          @click.stop="retrySync(row.id)"
          :disabled="retryingId === row.id"
        >
          {{ retryingId === row.id ? '重试中...' : '重新同步' }}
        </button>
      </template>
    </DataTable>

    <!-- 详情弹窗 -->
    <DetailPanel
      :visible="detailVisible"
      title="入场记录详情"
      mode="modal"
      width="600px"
      @close="detailVisible = false"
    >
      <template v-if="selectedRecord">
        <div class="detail-content">
          <div><strong>记录ID：</strong>{{ selectedRecord.id }}</div>
          <div><strong>车牌号：</strong>{{ selectedRecord.plate }}</div>
          <div><strong>操作类型：</strong>{{ selectedRecord.action }}</div>
          <div><strong>操作员：</strong>{{ selectedRecord.operator }}</div>
          <div><strong>操作时间：</strong>{{ selectedRecord.time }}</div>
          <div><strong>同步状态：</strong>{{ syncStatusText(selectedRecord.syncStatus) }}</div>
          <div v-if="selectedRecord.reason"><strong>拒绝原因：</strong>{{ selectedRecord.reason }}</div>
          <div v-if="selectedRecord.snapshot">
            <h4>核验结果快照</h4>
            <pre>{{ JSON.stringify(selectedRecord.snapshot, null, 2) }}</pre>
          </div>
          <div v-if="selectedRecord.apiResponse">
            <h4>接口返回信息</h4>
            <pre>{{ JSON.stringify(selectedRecord.apiResponse, null, 2) }}</pre>
          </div>
        </div>
      </template>
    </DetailPanel>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import DataFilterBar from '@/components/DataFilterBar.vue';
import DataTable from '@/components/DataTable.vue';
import StatusTag from '@/components/StatusTag.vue';
import DetailPanel from '@/components/DetailPanel.vue';
import { fetchEntryRecords, retrySyncRecord } from '@/data/mockGate.js';

// 筛选配置
const filterConfig = [
  { type: 'dateRange', label: '时间范围', key: 'dateRange', placeholder: ['起始日期', '结束日期'] },
  { type: 'input', label: '车牌号', key: 'plate', placeholder: '请输入车牌号' },
  { type: 'select', label: '操作结果', key: 'action', options: [{ label: '全部', value: '' }, { label: '放行', value: 'pass' }, { label: '拒绝', value: 'reject' }] },
  { type: 'select', label: '同步状态', key: 'syncStatus', options: [{ label: '全部', value: '' }, { label: '已同步', value: 'synced' }, { label: '同步失败', value: 'failed' }, { label: '同步中', value: 'syncing' }] }
];

const filterValues = ref({
  dateRange: null,
  plate: '',
  action: '',
  syncStatus: ''
});

// 表格列定义
const tableColumns = [
  { key: 'time', title: '时间', sortable: true },
  { key: 'plate', title: '车牌号' },
  { key: 'action', title: '操作类型', customRender: ({ value }) => value === 'pass' ? '放行' : '拒绝' },
  { key: 'operator', title: '操作员' },
  { key: 'syncStatus', title: '同步状态', slot: 'syncStatus' }
];

// 数据
const records = ref([]);
const loading = ref(false);
const error = ref(false);
const errorMessage = ref('');
const paginationConfig = ref({ current: 1, pageSize: 20, total: 0 });

// 重试状态
const retryingId = ref(null);

// 详情状态
const detailVisible = ref(false);
const selectedRecord = ref(null);

// 同步状态文字映射
const syncStatusText = (status) => {
  const map = {
    synced: '已同步',
    failed: '同步失败',
    syncing: '同步中'
  };
  return map[status] || status;
};

// 表格数据（添加同步状态插槽字段）
const tableData = computed(() => {
  return records.value.map(rec => ({
    ...rec,
    // 确保同步状态字段存在
    syncStatus: rec.syncStatus || 'synced'
  }));
});

// 加载记录
const loadRecords = async () => {
  loading.value = true;
  error.value = false;
  try {
    const params = {
      startDate: filterValues.value.dateRange?.[0] || '',
      endDate: filterValues.value.dateRange?.[1] || '',
      plate: filterValues.value.plate,
      action: filterValues.value.action,
      syncStatus: filterValues.value.syncStatus
    };
    const result = await fetchEntryRecords(params);
    records.value = result.data;
    paginationConfig.value.total = result.total;
  } catch (e) {
    error.value = true;
    errorMessage.value = e.message || '加载失败';
  } finally {
    loading.value = false;
  }
};

// 筛选变化处理
const handleFilterChange = () => {
  loadRecords();
};

// 重新同步
const retrySync = async (recordId) => {
  retryingId.value = recordId;
  try {
    const result = await retrySyncRecord(recordId);
    if (result.success) {
      // 更新该记录同步状态
      const index = records.value.findIndex(r => r.id === recordId);
      if (index !== -1) {
        records.value[index].syncStatus = 'syncing';
      }
      // 模拟同步完成
      setTimeout(() => {
        const idx = records.value.findIndex(r => r.id === recordId);
        if (idx !== -1) {
          records.value[idx].syncStatus = 'synced';
        }
        retryingId.value = null;
      }, 2000);
    } else {
      alert('重新同步失败，请稍后重试');
      retryingId.value = null;
    }
  } catch (e) {
    alert('网络错误，请重试');
    retryingId.value = null;
  }
};

// 查看详情
const handleRowClick = (row) => {
  selectedRecord.value = row;
  detailVisible.value = true;
};

onMounted(() => {
  loadRecords();
});
</script>

<style scoped>
.gate-entry-records-view {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}

.state-loading,
.state-error,
.state-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #999;
}

.skeleton-row {
  width: 100%;
  height: 40px;
  background: #f0f0f0;
  margin-bottom: 8px;
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.state-error button {
  margin-top: 12px;
  padding: 8px 16px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.state-empty img {
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
}

.retry-btn {
  margin-left: 8px;
  padding: 2px 8px;
  font-size: 12px;
  background: #e6a23c;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.retry-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.detail-content {
  padding: 16px;
}

.detail-content div {
  margin-bottom: 8px;
  line-height: 1.6;
}

.detail-content pre {
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
}
</style>