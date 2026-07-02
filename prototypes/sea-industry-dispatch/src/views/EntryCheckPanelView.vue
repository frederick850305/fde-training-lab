<template>
  <section class="entry-check-view" aria-labelledby="entry-check-title">
    <ViewHeading
      eyebrow="P1 Prototype Page · 门岗管理"
      title="入场核验"
      title-id="entry-check-title"
      description="扫描车牌或二维码自动核验车辆预约有效性及任务关联，快速得出入场许可结果。"
    />

    <div class="check-layout">
      <!-- 左侧：扫描区 + 手动输入 -->
      <div class="scan-panel">
        <!-- 模拟摄像头扫描区 -->
        <div class="camera-area" :class="'state-' + scanState">
          <template v-if="scanState === 'idle'">
            <div class="camera-frame">
              <div class="scan-line"></div>
              <span class="camera-hint">将摄像头对准车牌或二维码</span>
            </div>
          </template>
          <template v-else-if="scanState === 'scanning'">
            <div class="camera-frame scanning">
              <div class="scan-line fast"></div>
              <span class="scan-plate">{{ scanningPlate }}</span>
              <span class="camera-hint">正在识别...</span>
            </div>
          </template>
          <template v-else-if="scanState === 'loading'">
            <div class="camera-overlay">
              <span class="spinner"></span>
              <p>正在核验车辆信息...</p>
            </div>
          </template>
        </div>

        <!-- 手动输入 -->
        <div class="manual-input">
          <label>手动输入车牌</label>
          <div class="input-row">
            <input
              v-model="manualPlate"
              type="text"
              placeholder="如：沪A-12345"
              :disabled="scanState === 'loading'"
              @keyup.enter="manualCheck"
            />
            <button type="button" class="primary-btn" @click="manualCheck" :disabled="!manualPlate.trim() || scanState === 'loading'">
              手动核验
            </button>
          </div>
          <div class="quick-plates">
            <span>快捷测试：</span>
            <button v-for="p in quickTestPlates" :key="p" type="button" class="quick-btn" @click="quickCheck(p)">
              {{ p.slice(-4) }}
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧：核验结果 -->
      <div class="result-panel">
        <!-- 未核验 -->
        <div v-if="!lastResult" class="result-placeholder">
          <span class="ph-icon">📷</span>
          <p>扫描或输入车牌<br>开始核验</p>
        </div>

        <!-- 核验通过 -->
        <div v-else-if="lastResult.result === 'pass'" class="result-card pass">
          <div class="result-header pass">
            <span class="result-icon">✅</span>
            <div>
              <strong>核验通过 · 允许入场</strong>
              <small>{{ new Date().toLocaleTimeString('zh-CN') }}</small>
            </div>
          </div>
          <div class="result-body">
            <div class="info-row"><span>车牌号</span><strong>{{ lastResult.plate }}</strong></div>
            <div class="info-row"><span>车辆类型</span>{{ lastResult.vehicle?.type }}</div>
            <div class="info-row"><span>司机</span>{{ lastResult.vehicle?.driver }}</div>
            <div class="info-row"><span>所属单位</span>{{ lastResult.vehicle?.company }}</div>
            <div class="info-row"><span>来访事由</span>{{ lastResult.vehicle?.purpose }}</div>
            <div class="info-row" v-if="lastResult.vehicle?.taskId">
              <span>关联任务</span>
              <strong style="color:#1d4ed8">{{ lastResult.vehicle.taskId }}</strong>
            </div>
            <div class="info-row"><span>预约有效期</span>至 {{ lastResult.vehicle?.validUntil }}</div>
          </div>
          <div class="result-footer">
            <button type="button" class="action-btn" @click="resetCheck">继续核验</button>
            <button type="button" class="primary-btn" @click="printPass">🖨️ 打印凭条</button>
          </div>
        </div>

        <!-- 核验不通过 -->
        <div v-else class="result-card reject">
          <div class="result-header reject">
            <span class="result-icon">🚫</span>
            <div>
              <strong>核验不通过</strong>
              <small>{{ new Date().toLocaleTimeString('zh-CN') }}</small>
            </div>
          </div>
          <div class="result-body">
            <div class="reject-reason">
              <span>拒绝原因</span>
              <p>{{ lastResult.reason }}</p>
            </div>
            <div class="info-row"><span>车牌号</span><strong>{{ lastResult.plate }}</strong></div>
          </div>
          <div class="result-footer">
            <button type="button" class="action-btn" @click="resetCheck">重新核验</button>
            <button type="button" class="ghost-btn" @click="contactManager">📞 联系管理人员</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近核验记录 -->
    <div class="recent-records">
      <span class="section-label">最近核验记录</span>
      <div class="record-list">
        <div v-for="r in recentCheckRecords" :key="r.id" class="record-item">
          <span class="record-result" :class="'result-' + r.result">
            {{ r.result === 'pass' ? '✓' : '✕' }}
          </span>
          <strong>{{ r.plate }}</strong>
          <span>{{ r.type }}</span>
          <span class="record-time">{{ r.time }}</span>
          <span>{{ r.operator }}</span>
          <span v-if="r.reason" class="record-reason">{{ r.reason }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import ViewHeading from '../components/ViewHeading.vue'
import { preRegisteredVehicles, recentCheckRecords } from '../data/entryCheckMock'

const scanState = ref('idle') // idle | scanning | loading
const scanningPlate = ref('')
const manualPlate = ref('')
const lastResult = ref(null)

const quickTestPlates = [
  '沪B-23456',  // 正常预约
  '沪H-89012',  // 预约过期
  '沪X-99999',  // 无预约
]

function simulateScan(plate) {
  scanState.value = 'scanning'
  scanningPlate.value = plate

  // 模拟扫描识别（0.8秒）
  setTimeout(() => {
    scanState.value = 'loading'
    // 模拟核验请求（1秒）
    setTimeout(() => {
      const vehicle = preRegisteredVehicles[plate]
      if (vehicle && vehicle.authorized) {
        lastResult.value = { plate, vehicle, result: 'pass' }
      } else if (vehicle) {
        lastResult.value = {
          plate,
          vehicle,
          result: 'reject',
          reason: vehicle.rejectReason || '预约信息异常',
        }
      } else {
        lastResult.value = {
          plate,
          result: 'reject',
          reason: '无预约记录，请联系管理人员办理临时入场。',
        }
      }
      scanState.value = 'idle'
    }, 1000)
  }, 800)
}

function manualCheck() {
  if (!manualPlate.value.trim()) return
  simulateScan(manualPlate.value.trim())
}

function quickCheck(plate) {
  manualPlate.value = plate
  simulateScan(plate)
}

function resetCheck() {
  lastResult.value = null
  manualPlate.value = ''
  scanState.value = 'idle'
}

function printPass() {
  alert(`打印入场凭条：${lastResult.value?.plate}\n有效期至：${lastResult.value?.vehicle?.validUntil}`)
}

function contactManager() {
  alert('已通知管理人员处理。')
}
</script>

<style scoped>
.entry-check-view { margin-top: 16px; }

.check-layout {
  display: grid; grid-template-columns: 1fr 380px; gap: 16px;
}

/* 扫描面板 */
.scan-panel {
  border: 1px solid #e2e8f0; border-radius: 10px; background: #fff; overflow: hidden;
}
.camera-area {
  height: 280px; display: flex; align-items: center; justify-content: center;
  background: #0f172a; position: relative; overflow: hidden;
}
.camera-area.state-loading { background: #1e293b; }

.camera-frame {
  width: 260px; height: 160px; border: 2px solid rgba(255,255,255,0.3);
  border-radius: 12px; display: flex; align-items: center; justify-content: center;
  position: relative;
}
.camera-frame.scanning { border-color: rgba(59, 130, 246, 0.6); }
.scan-line {
  position: absolute; left: 10px; right: 10px; height: 2px;
  background: linear-gradient(90deg, transparent, #3b82f6, transparent);
  animation: scanMove 2s ease-in-out infinite;
}
.scan-line.fast { animation-duration: 0.6s; }
@keyframes scanMove {
  0% { top: 10px; } 50% { top: calc(100% - 10px); } 100% { top: 10px; }
}
.scan-plate {
  color: #fff; font-size: 28px; font-weight: 900; letter-spacing: 4px;
}
.camera-hint {
  position: absolute; bottom: 12px; color: rgba(255,255,255,0.4); font-size: 11px;
}
.camera-overlay {
  text-align: center; color: #94a3b8;
}
.camera-overlay p { margin-top: 12px; font-size: 13px; }
.spinner {
  display: inline-block; width: 32px; height: 32px;
  border: 3px solid rgba(255,255,255,0.15); border-top-color: #3b82f6;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.manual-input { padding: 14px 18px; }
.manual-input label { display: block; margin-bottom: 6px; font-size: 13px; color: #334155; font-weight: 700; }
.input-row { display: flex; gap: 8px; }
.input-row input {
  flex: 1; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px;
  font-size: 14px; color: #0f172a; outline: none;
}
.input-row input:focus { border-color: #93c5fd; }
.primary-btn {
  padding: 8px 16px; border: none; border-radius: 6px;
  background: #1d4ed8; color: #fff; font-weight: 800; font-size: 13px; cursor: pointer; white-space: nowrap;
}
.primary-btn:disabled { background: #94a3b8; cursor: not-allowed; }
.quick-plates {
  display: flex; align-items: center; gap: 6px; margin-top: 8px;
  font-size: 11px; color: #94a3b8; flex-wrap: wrap;
}
.quick-btn {
  padding: 3px 10px; border: 1px solid #e2e8f0; border-radius: 12px;
  background: #f8fafc; color: #475569; font-size: 11px; font-weight: 700; cursor: pointer;
}
.quick-btn:hover { border-color: #93c5fd; background: #eff6ff; }

/* 结果面板 */
.result-panel {
  border: 1px solid #e2e8f0; border-radius: 10px; background: #fff; overflow: hidden;
}
.result-placeholder {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 280px; color: #94a3b8; text-align: center;
}
.ph-icon { font-size: 48px; margin-bottom: 8px; }

.result-card { display: flex; flex-direction: column; }
.result-header {
  display: flex; align-items: center; gap: 10px; padding: 14px 18px;
}
.result-header.pass { background: #f0fdf4; border-bottom: 1px solid #bbf7d0; }
.result-header.reject { background: #fef2f2; border-bottom: 1px solid #fecaca; }
.result-icon { font-size: 24px; }
.result-header strong { color: #0f172a; font-size: 15px; display: block; }
.result-header small { color: #94a3b8; font-size: 11px; }

.result-body { padding: 12px 18px; }
.info-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 7px 0; border-bottom: 1px solid #f8fafc; font-size: 13px;
}
.info-row span { color: #94a3b8; }
.info-row strong { color: #0f172a; }

.reject-reason {
  padding: 10px 14px; border-radius: 6px; background: #fef2f2;
  border: 1px solid #fecaca; margin-bottom: 10px;
}
.reject-reason span { font-size: 11px; color: #dc2626; font-weight: 800; display: block; }
.reject-reason p { margin: 4px 0 0; font-size: 13px; color: #991b1b; font-weight: 600; }

.result-footer {
  display: flex; gap: 8px; padding: 12px 18px;
  border-top: 1px solid #f1f5f9; background: #fafbfc;
}
.action-btn {
  padding: 7px 16px; border: 1px solid #e2e8f0; border-radius: 6px;
  background: #fff; color: #475569; font-weight: 700; font-size: 13px; cursor: pointer;
}
.ghost-btn {
  padding: 7px 16px; border: 1px solid #fecaca; border-radius: 6px;
  background: #fff; color: #dc2626; font-weight: 700; font-size: 13px; cursor: pointer;
}

/* 最近记录 */
.recent-records { margin-top: 16px; }
.section-label {
  display: block; margin-bottom: 8px;
  color: #2563eb; font-size: 12px; font-weight: 900;
  text-transform: uppercase; letter-spacing: 0.5px;
}
.record-list {
  border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; overflow: hidden;
}
.record-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 16px; border-bottom: 1px solid #f8fafc; font-size: 12px; color: #475569;
}
.record-item:last-child { border-bottom: none; }
.record-result {
  display: inline-flex; align-items: center; justify-content: center;
  width: 22px; height: 22px; border-radius: 50%; font-size: 11px; font-weight: 900;
}
.record-result.result-pass { background: #dcfce7; color: #16a34a; }
.record-result.result-reject { background: #fee2e2; color: #dc2626; }
.record-time { color: #94a3b8; margin-left: auto; }
.record-reason { color: #dc2626; font-size: 11px; }

@media (max-width: 820px) {
  .check-layout { grid-template-columns: 1fr; }
}
</style>
