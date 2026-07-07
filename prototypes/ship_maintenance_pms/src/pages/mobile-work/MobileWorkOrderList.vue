<template>
  <section class="page mobile-page">
    <header class="page-head">
      <div class="title-block">
        <span class="eyebrow">移动作业 / 高优先级</span>
        <h1>移动端工单列表</h1>
        <p>船端轮机员离线可用的工单派发入口，弱网环境下优先加载本地缓存。</p>
      </div>
    </header>

    <div class="phone-shell">
      <article class="phone-frame">
        <div class="phone-notch"></div>
        <div class="phone-screen">
          <!-- 顶部状态条：网络状态 + 待同步数 -->
          <div class="net-banner" :class="netTone">
            <span class="net-dot"></span>
            <strong>{{ netLabel }}</strong>
            <em>{{ pendingCount }} 项待同步</em>
          </div>

          <!-- 筛选排序 -->
          <div class="filter-bar">
            <select v-model="priorityFilter" aria-label="按优先级筛选">
              <option value="">全部优先级</option>
              <option value="高">高优先级</option>
              <option value="中">中优先级</option>
              <option value="低">低优先级</option>
            </select>
            <select v-model="statusFilter" aria-label="按状态筛选">
              <option value="">全部状态</option>
              <option value="待执行">待执行</option>
              <option value="执行中">执行中</option>
              <option value="待同步">待同步</option>
            </select>
          </div>

          <!-- 状态区 -->
          <div v-if="uiState === 'loading'" class="state-box">
            <div class="skeleton-card" v-for="n in 4" :key="n">
              <span class="sk-line w60"></span>
              <span class="sk-line w90"></span>
              <span class="sk-line w40"></span>
            </div>
          </div>

          <div v-else-if="uiState === 'error'" class="state-box">
            <strong>数据加载失败</strong>
            <p>当前网络不可用，已切换到本地缓存展示。</p>
            <button @click="reload">重试</button>
          </div>

          <div v-else-if="uiState === 'empty'" class="state-box">
            <strong>暂无匹配工单</strong>
            <p>当前筛选条件下没有工单记录。</p>
            <button @click="resetFilters">清除筛选</button>
          </div>

          <!-- 工单卡片列表 -->
          <ul v-else class="wo-list">
            <li
              v-for="wo in filteredOrders"
              :key="wo.id"
              class="wo-card"
              :class="{ cached: wo.__fromCache }"
              @click="onPick(wo)"
            >
              <div class="wo-top">
                <span class="wo-id">{{ wo.id }}</span>
                <StatusBadge :label="wo.status" />
              </div>
              <div class="wo-equip">{{ wo.equipment }}</div>
              <div class="wo-meta">
                <span>{{ wo.ship }}</span>
                <span class="sep">·</span>
                <span>计划 {{ wo.planDate }}</span>
              </div>
              <div class="wo-foot">
                <span class="priority" :class="priorityTone(wo.priority)">{{ wo.priority }}优先级</span>
                <span class="executor">{{ wo.executor }}</span>
              </div>
              <div v-if="wo.__fromCache" class="cache-tag">本地缓存</div>
            </li>
          </ul>

          <div class="phone-foot">
            <span>共 {{ filteredOrders.length }} 条 · 队列 {{ pendingCount }}</span>
            <button @click="goSync">查看同步</button>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, inject, onMounted, ref } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import {
  fetchMobileWorkOrders,
  readOfflineQueue,
  getStorageUsage,
} from '@/mock/api.js'

const nav = inject('prototypeNavigation', null)

const CACHE_KEY = 'pms-mobile-wo-cache'

const uiState = ref('loading')
const workOrders = ref([])
const priorityFilter = ref('')
const statusFilter = ref('')
const offlineQueue = ref(readOfflineQueue())
const storage = ref(getStorageUsage())

const pendingCount = computed(() => offlineQueue.value.length)
const netLabel = computed(() => (pendingCount.value > 0 ? '弱网模式' : '在线'))
const netTone = computed(() => (pendingCount.value > 0 ? 'weak' : 'online'))

const filteredOrders = computed(() =>
  workOrders.value.filter(wo => {
    const p = !priorityFilter.value || wo.priority === priorityFilter.value
    const s = !statusFilter.value || wo.status === statusFilter.value
    return p && s
  })
)

function priorityTone(p) {
  if (p === '高') return 'high'
  if (p === '中') return 'mid'
  return 'low'
}

function onPick(wo) {
  sessionStorage.setItem('pms-current-wo', JSON.stringify(wo))
  if (nav) nav.navigateTo('MobileWorkOrderDetail', { workOrderId: wo.id })
}

function resetFilters() {
  priorityFilter.value = ''
  statusFilter.value = ''
}

async function reload() {
  uiState.value = 'loading'
  try {
    const data = await fetchMobileWorkOrders()
    workOrders.value = data
    // 写入本地缓存
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
    offlineQueue.value = readOfflineQueue()
    storage.value = getStorageUsage()
    uiState.value = filteredOrders.value.length ? 'success' : 'empty'
  } catch (e) {
    // 失败时从 localStorage 读取缓存
    try {
      const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '[]')
      workOrders.value = cache.map(wo => ({ ...wo, __fromCache: true }))
      uiState.value = workOrders.value.length ? 'success' : 'error'
    } catch {
      uiState.value = 'error'
    }
  }
}

function goSync() {
  if (nav) nav.navigateTo('MobileSyncStatus')
}

onMounted(reload)
</script>

<style scoped>
.mobile-page { display: grid; gap: 16px; }
.page-head { position: relative; border: 1px solid #d9e4ef; border-radius: 10px; padding: 18px 20px; background: #fff; }
.eyebrow { color: #1e6fd9; font-size: 12px; font-weight: 900; }
.page-head h1 { margin: 6px 0 6px; font-size: 22px; color: #172033; }
.page-head p { margin: 6px 0 0; color: #64748b; font-size: 13px; max-width: 760px; }

.phone-shell { display: flex; justify-content: center; padding: 8px 0; }
.phone-frame {
  width: 390px;
  max-width: 100%;
  border: 12px solid #172033;
  border-radius: 34px;
  background: #172033;
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.22);
  overflow: hidden;
}
.phone-notch {
  width: 140px; height: 22px; margin: 0 auto;
  background: #172033; border-radius: 0 0 14px 14px;
}
.phone-screen {
  background: #eef3f8; min-height: 640px; padding: 14px 14px 10px;
  display: flex; flex-direction: column; gap: 12px;
}

.net-banner {
  display: flex; align-items: center; gap: 8px;
  padding: 9px 12px; border-radius: 9px; font-size: 12px; font-weight: 900;
}
.net-banner.weak { background: #fff3d8; color: #8a5a00; }
.net-banner.online { background: #dff6e8; color: #11734d; }
.net-dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
.net-banner em { margin-left: auto; font-style: normal; }

.filter-bar { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.filter-bar select {
  border: 1px solid #cbd7e4; border-radius: 8px; padding: 9px 10px;
  background: #fff; color: #172033; font-size: 13px; font-weight: 800;
}

.state-box { display: grid; gap: 8px; padding: 24px 12px; justify-items: center; text-align: center; }
.state-box strong { color: #172033; font-size: 16px; }
.state-box p { color: #64748b; margin: 0; font-size: 13px; line-height: 1.5; }
.state-box button {
  border: 1px solid #1e6fd9; border-radius: 8px; padding: 8px 16px;
  background: #1e6fd9; color: #fff; font-weight: 900; font-size: 13px;
}

.skeleton-card { background: #fff; border-radius: 10px; padding: 14px; display: grid; gap: 8px; }
.sk-line { height: 12px; border-radius: 6px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }
.sk-line.w60 { width: 60%; } .sk-line.w90 { width: 90%; } .sk-line.w40 { width: 40%; }

.wo-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.wo-card {
  position: relative; background: #fff; border: 1px solid #d9e4ef; border-radius: 10px;
  padding: 12px 13px; display: grid; gap: 6px; cursor: pointer; transition: border-color .15s, transform .1s;
}
.wo-card:hover { border-color: #1e6fd9; transform: translateY(-1px); }
.wo-card.cached { border-left: 3px solid #d4743f; }
.wo-top { display: flex; justify-content: space-between; align-items: center; }
.wo-id { font-weight: 900; color: #1e6fd9; font-size: 13px; }
.wo-equip { font-size: 14px; font-weight: 800; color: #172033; }
.wo-meta { color: #64748b; font-size: 12px; display: flex; gap: 5px; }
.wo-meta .sep { opacity: .6; }
.wo-foot { display: flex; justify-content: space-between; align-items: center; margin-top: 2px; }
.priority { font-size: 11px; font-weight: 900; padding: 2px 8px; border-radius: 999px; }
.priority.high { color: #b4232d; background: #ffe1e3; }
.priority.mid { color: #8a5a00; background: #fff2cc; }
.priority.low { color: #11734d; background: #dff6e8; }
.executor { color: #64748b; font-size: 12px; }
.cache-tag {
  position: absolute; top: 10px; right: 10px;
  font-size: 10px; color: #d4743f; background: #fff3e6;
  padding: 2px 6px; border-radius: 4px; font-weight: 900;
}

.phone-foot {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: auto; padding-top: 10px; border-top: 1px solid #d9e4ef;
  font-size: 12px; color: #64748b; font-weight: 800;
}
.phone-foot button { border: 0; color: #1e6fd9; background: transparent; font-weight: 900; font-size: 12px; }
</style>
