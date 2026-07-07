<template>
  <section class="page-screen ship-monitoring-overview">
    <header class="page-header">
      <div>
        <span class="module-label">船舶监控调度 / 在线态势</span>
        <h1>船舶运行监控总览</h1>
        <p class="page-desc">实时呈现船队在线态势与通信状态，支持地图与列表切换；点击船舶定位点查看航速、航向、运行状态及航线信息。</p>
      </div>
      <div class="header-actions">
        <button type="button" class="primary" @click="toggleView">{{ viewMode === 'map' ? '切换列表' : '切换地图' }}</button>
      </div>
    </header>

    <!-- 顶部通信连接 KPI -->
    <section class="comm-kpi-bar">
      <article class="comm-card online">
        <span class="dot"></span>
        <div>
          <strong>{{ stats?.online ?? 0 }}</strong>
          <span>在线船舶</span>
        </div>
      </article>
      <article class="comm-card weak">
        <span class="dot"></span>
        <div>
          <strong>{{ stats?.weakNetwork ?? 0 }}</strong>
          <span>弱网船舶</span>
        </div>
      </article>
      <article class="comm-card offline">
        <span class="dot"></span>
        <div>
          <strong>{{ stats?.offline ?? 0 }}</strong>
          <span>离线船舶</span>
        </div>
      </article>
      <article class="comm-card fleet">
        <div>
          <strong>{{ stats?.total ?? 0 }}</strong>
          <span>船队总数</span>
        </div>
      </article>
      <article class="comm-card health">
        <div>
          <strong>{{ stats?.avgHealth ?? 0 }}</strong>
          <span>平均健康分</span>
        </div>
      </article>
      <article class="comm-card alerts">
        <div>
          <strong>{{ stats?.activeAlerts ?? 0 }}</strong>
          <span>活跃告警</span>
        </div>
      </article>
    </section>

    <!-- 骨架/空/错误 -->
    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span></span><span></span><span></span><span></span>
    </div>
    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>数据加载失败</h2>
      <p>船队态势数据获取异常，请检查网络或同步链路后重试。</p>
      <button type="button" @click="reload">重试</button>
    </div>
    <div v-else-if="uiState === 'empty'" class="state-panel">
      <h2>暂无船舶数据</h2>
      <p>当前没有可监控的船舶，请确认船队配置。</p>
      <button type="button" @click="reload">刷新</button>
    </div>

    <template v-else>
      <!-- 地图模式 -->
      <section v-if="viewMode === 'map'" class="monitor-layout map-mode">
        <article class="panel map-panel">
          <div class="panel-title">
            <h2>东海海域态势视图</h2>
            <span>点击定位点选中船舶</span>
          </div>
          <div class="map-ocean">
            <div class="map-grid"></div>
            <div class="map-radar"></div>
            <button
              v-for="(v, index) in vessels"
              :key="v.id"
              type="button"
              :class="['ship-dot', commClass(v), { selected: selectedId === v.id }]"
              :style="dotStyle(v, index)"
              :title="v.name"
              @click="selectVessel(v.id)"
            >
              <span class="dot-num">{{ index + 1 }}</span>
              <span class="dot-pulse" v-if="v.communicationStatus !== '离线'"></span>
            </button>
            <div class="map-legend">
              <span><i class="lg online"></i>在线</span>
              <span><i class="lg weak"></i>弱网</span>
              <span><i class="lg offline"></i>离线</span>
            </div>
          </div>
        </article>

        <article class="panel detail-panel">
          <div class="panel-title">
            <h2>选中船舶详情</h2>
            <StatusBadge v-if="selectedVessel" :label="selectedVessel.operationalStatus" />
          </div>
          <template v-if="selectedVessel">
            <div class="vessel-head">
              <div class="vessel-name">{{ selectedVessel.name }}</div>
              <div class="vessel-id">{{ selectedVessel.id }}</div>
            </div>
            <div class="detail-grid">
              <div class="detail-cell">
                <span>航速</span>
                <strong>{{ selectedVessel.speed }} <small>节</small></strong>
              </div>
              <div class="detail-cell">
                <span>航向</span>
                <strong>{{ selectedVessel.heading }}°</strong>
              </div>
              <div class="detail-cell">
                <span>运行状态</span>
                <strong>{{ selectedVessel.operationalStatus }}</strong>
              </div>
              <div class="detail-cell">
                <span>通信状态</span>
                <strong :class="commClass(selectedVessel)">{{ selectedVessel.communicationStatus }}</strong>
              </div>
              <div class="detail-cell wide">
                <span>航线</span>
                <strong>{{ selectedVessel.route }}</strong>
              </div>
              <div class="detail-cell">
                <span>健康分</span>
                <strong>{{ selectedVessel.healthScore ?? '—' }}</strong>
              </div>
              <div class="detail-cell">
                <span>告警数</span>
                <strong>{{ selectedVessel.alertCount }}</strong>
              </div>
              <div class="detail-cell wide">
                <span>最后上报</span>
                <strong>{{ selectedVessel.lastReport }}</strong>
              </div>
              <div class="detail-cell wide">
                <span>预计到达</span>
                <strong>{{ selectedVessel.eta }}</strong>
              </div>
              <div class="detail-cell wide">
                <span>坐标</span>
                <strong>{{ selectedVessel.position.lng }}, {{ selectedVessel.position.lat }}</strong>
              </div>
            </div>
            <div class="detail-actions">
              <button type="button" class="primary" @click="goDetail(selectedVessel)">进入船舶详情</button>
            </div>
          </template>
          <div v-else class="empty-hint">请在左侧地图选择一艘船舶查看详情</div>
        </article>
      </section>

      <!-- 列表模式 -->
      <section v-else class="panel list-mode">
        <div class="panel-title">
          <h2>船队船舶清单</h2>
          <span>{{ vessels.length }} 艘</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>编号</th>
              <th>船名</th>
              <th>运行状态</th>
              <th>通信状态</th>
              <th>航速(节)</th>
              <th>航向</th>
              <th>航线</th>
              <th>健康分</th>
              <th>告警</th>
              <th>最后上报</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="v in vessels"
              :key="v.id"
              :class="{ selected: selectedId === v.id }"
              @click="selectVessel(v.id)"
            >
              <td>{{ v.id }}</td>
              <td>{{ v.name }}</td>
              <td><StatusBadge :label="v.operationalStatus" /></td>
              <td><span :class="['comm-tag', commClass(v)]">{{ v.communicationStatus }}</span></td>
              <td>{{ v.speed }}</td>
              <td>{{ v.heading }}°</td>
              <td>{{ v.route }}</td>
              <td>{{ v.healthScore ?? '—' }}</td>
              <td>{{ v.alertCount }}</td>
              <td>{{ v.lastReport }}</td>
              <td><button type="button" class="link-btn" @click.stop="goDetail(v)">详情</button></td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>
  </section>
</template>

<script setup>
import { computed, inject, onMounted, ref } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { fetchVessels, fetchFleetStats } from '@/mock/api.js'

const navigation = inject('prototypeNavigation', null)
const vessels = ref([])
const stats = ref(null)
const uiState = ref('loading')
const viewMode = ref('map')
const selectedId = ref(null)

const selectedVessel = computed(() => vessels.value.find(v => v.id === selectedId.value) || null)

function commClass(v) {
  if (v.communicationStatus === '在线') return 'online'
  if (v.communicationStatus === '弱网') return 'weak'
  return 'offline'
}

function dotStyle(v, index) {
  // 将经纬度映射到地图范围
  const points = [
    { left: '22%', top: '32%' },
    { left: '40%', top: '48%' },
    { left: '62%', top: '26%' },
    { left: '54%', top: '68%' },
    { left: '30%', top: '62%' },
  ]
  return points[index] || points[0]
}

function selectVessel(id) {
  selectedId.value = id
}

function goDetail(vessel) {
  if (!vessel) return
  navigation?.navigateTo?.('ShipDetailBoard', {
    vesselId: vessel.id,
    vesselName: vessel.name,
  })
}

function toggleView() {
  viewMode.value = viewMode.value === 'map' ? 'list' : 'map'
}

async function reload() {
  uiState.value = 'loading'
  try {
    const [list, s] = await Promise.all([
      fetchVessels(),
      fetchFleetStats(),
    ])
    vessels.value = list
    stats.value = s
    if (!list.length) {
      uiState.value = 'empty'
      return
    }
    if (!selectedId.value || !list.find(v => v.id === selectedId.value)) {
      selectedId.value = list[0].id
    }
    uiState.value = 'success'
  } catch (e) {
    uiState.value = 'error'
  }
}

onMounted(reload)
</script>

<style scoped>
.page-screen { display: grid; gap: 16px; position: relative; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; border: 1px solid #d9e4ef; border-radius: 8px; padding: 20px; background: #fff; }
.module-label { color: #1e6fd9; font-size: 12px; font-weight: 900; }
h1 { margin: 6px 0 8px; font-size: 24px; }
.page-header p { max-width: 920px; margin: 0; color: #53657c; line-height: 1.55; }
.header-actions { display: flex; gap: 9px; flex-wrap: wrap; }
button { border: 1px solid #cfdae6; border-radius: 7px; padding: 8px 13px; color: #24415f; background: #f6f9fc; font-weight: 900; cursor: pointer; }
button.primary { color: #fff; border-color: #1e6fd9; background: #1e6fd9; }

/* KPI bar */
.comm-kpi-bar { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 12px; }
.comm-card { border: 1px solid #d9e4ef; border-radius: 8px; padding: 14px 16px; background: #fff; display: flex; align-items: center; gap: 12px; }
.comm-card .dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
.comm-card.online .dot { background: #11734d; }
.comm-card.weak .dot { background: #d97706; }
.comm-card.offline .dot { background: #b4232d; }
.comm-card strong { display: block; color: #1e6fd9; font-size: 26px; line-height: 1.1; }
.comm-card span { color: #64748b; font-size: 12px; font-weight: 800; }

/* state */
.state-panel { min-height: 260px; border: 1px solid #d9e4ef; border-radius: 8px; display: grid; place-content: center; justify-items: center; gap: 12px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0; font-size: 20px; }
.state-panel.error h2 { color: #b4232d; }
.state-panel p { color: #53657c; max-width: 460px; }
.skeleton { grid-template-columns: repeat(2, minmax(180px, 1fr)); padding: 24px; }
.skeleton span { width: 100%; height: 96px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }

/* layout */
.monitor-layout { display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 16px; align-items: start; }
.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.panel-title h2 { margin: 0; font-size: 16px; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }

/* map */
.map-ocean { position: relative; min-height: 540px; border-radius: 8px; overflow: hidden; background: linear-gradient(145deg, #0f3565, #0b1f3b); }
.map-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(137,197,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(137,197,255,.08) 1px, transparent 1px); background-size: 40px 40px; }
.map-radar { position: absolute; left: 50%; top: 50%; width: 320px; height: 320px; transform: translate(-50%, -50%); border: 1px solid rgba(137,197,255,.18); border-radius: 50%; box-shadow: 0 0 0 72px rgba(137,197,255,.04), 0 0 0 132px rgba(137,197,255,.03); }
.ship-dot { position: absolute; width: 38px; height: 38px; border-radius: 50%; padding: 0; display: grid; place-items: center; color: #fff; border: 2px solid rgba(255,255,255,.7); background: #11734d; box-shadow: 0 10px 26px rgba(0,0,0,.3); cursor: pointer; transform: translate(-50%, -50%); z-index: 2; }
.ship-dot.weak { background: #d97706; }
.ship-dot.offline { background: #b4232d; }
.ship-dot.selected { border-color: #fff; box-shadow: 0 0 0 4px rgba(255,255,255,.45), 0 10px 26px rgba(0,0,0,.3); transform: translate(-50%, -50%) scale(1.12); }
.dot-num { font-size: 13px; font-weight: 900; }
.dot-pulse { position: absolute; inset: -6px; border-radius: 50%; border: 2px solid rgba(255,255,255,.4); animation: pulse 1.8s ease-out infinite; }
@keyframes pulse { 0% { transform: scale(.8); opacity: .8; } 100% { transform: scale(1.6); opacity: 0; } }
.map-legend { position: absolute; left: 14px; bottom: 14px; display: flex; gap: 14px; padding: 8px 12px; border-radius: 6px; background: rgba(11,31,59,.7); color: #cfe2f5; font-size: 12px; font-weight: 800; }
.map-legend i { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 4px; vertical-align: middle; }
.map-legend .online { background: #11734d; }
.map-legend .weak { background: #d97706; }
.map-legend .offline { background: #b4232d; }

/* detail panel */
.vessel-head { display: flex; align-items: baseline; gap: 10px; padding-bottom: 12px; border-bottom: 1px solid #e7edf4; margin-bottom: 12px; }
.vessel-name { font-size: 18px; font-weight: 900; color: #172033; }
.vessel-id { color: #64748b; font-size: 12px; font-weight: 800; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.detail-cell { border: 1px solid #e7edf4; border-radius: 7px; padding: 10px 12px; background: #f8fbfe; }
.detail-cell.wide { grid-column: 1 / -1; }
.detail-cell span { display: block; color: #64748b; font-size: 12px; font-weight: 800; margin-bottom: 4px; }
.detail-cell strong { font-size: 16px; color: #172033; }
.detail-cell strong small { font-size: 12px; color: #64748b; }
.detail-cell strong.online { color: #11734d; }
.detail-cell strong.weak { color: #d97706; }
.detail-cell strong.offline { color: #b4232d; }
.empty-hint { padding: 40px 0; text-align: center; color: #64748b; font-size: 13px; }
.detail-actions { margin-top: 12px; display: flex; justify-content: flex-end; }

/* list mode */
.list-mode table { width: 100%; border-collapse: collapse; font-size: 13px; }
th, td { padding: 12px 10px; border-bottom: 1px solid #e7edf4; text-align: left; }
th { color: #63748a; background: #f7fafc; }
tr { cursor: pointer; }
tr.selected td { background: #edf5ff; }
.comm-tag { display: inline-flex; padding: 2px 8px; border-radius: 999px; font-size: 12px; font-weight: 900; }
.comm-tag.online { color: #11734d; background: #dff6e8; }
.comm-tag.weak { color: #8a5a00; background: #fff2cc; }
.comm-tag.offline { color: #b4232d; background: #ffe1e3; }
.link-btn { border: 0; background: transparent; color: #1e6fd9; padding: 4px 6px; font-weight: 900; }

@media (max-width: 980px) {
  .page-header { flex-direction: column; }
  .comm-kpi-bar { grid-template-columns: repeat(2, 1fr); }
  .monitor-layout { grid-template-columns: 1fr; }
  .map-ocean { min-height: 420px; }
  .list-mode table { display: block; overflow-x: auto; white-space: nowrap; }
}
</style>
