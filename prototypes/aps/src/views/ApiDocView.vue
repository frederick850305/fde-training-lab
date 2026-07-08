<template>
  <div class="api-doc">
    <div class="panel wide">
      <div class="panel-head"><h3>核心业务链路</h3></div>
      <div class="flow-chain">
        <template v-for="(step, i) in chain" :key="i">
          <span class="flow-step">{{ step }}</span>
          <svg v-if="i < chain.length - 1" class="chain-arrow" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#7fb4ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </template>
      </div>
    </div>

    <div class="content-grid">
      <div class="panel">
        <div class="panel-head"><h3>Mock 接口清单</h3><span class="sub">第一版无后端</span></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>方法</th><th>接口</th><th>说明</th></tr></thead>
            <tbody>
              <tr v-for="e in endpoints" :key="e.path"><td><code class="m">{{ e.method }}</code></td><td><code>{{ e.path }}</code></td><td>{{ e.desc }}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head"><h3>模拟排程接口示例</h3></div>
        <div class="code-block">
          <div class="code-title">请求 POST /api/schedule/run-shortterm</div>
          <pre>{{ reqExample }}</pre>
        </div>
        <div class="code-block">
          <div class="code-title">响应（节选）</div>
          <pre>{{ resExample }}</pre>
        </div>
      </div>
    </div>

    <div class="panel wide">
      <div class="panel-head"><h3>Mock 数据结构</h3><span class="sub">src/mock 目录</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>数据对象</th><th>文件</th><th>规模</th><th>说明</th></tr></thead>
          <tbody>
            <tr v-for="d in dataMap" :key="d.file"><td>{{ d.name }}</td><td><code>{{ d.file }}</code></td><td>{{ d.scale }}</td><td>{{ d.desc }}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const chain = ['项目导入', 'WBS/BOM 拆解', '工艺路线建模', '资源能力建模', '物料齐套检查', '中期负荷计划', '短期甘特排程', '工作指令下发', '现场实绩反馈', '异常模拟与动态重排']

const endpoints = [
  { method: 'GET', path: '/api/projects', desc: '项目列表' },
  { method: 'GET', path: '/api/projects/:id/dashboard', desc: '驾驶舱汇总' },
  { method: 'GET', path: '/api/projects/:id/wbs', desc: 'WBS 分解' },
  { method: 'GET', path: '/api/projects/:id/bom', desc: '制造 BOM' },
  { method: 'GET', path: '/api/projects/:id/routes', desc: '工艺路线' },
  { method: 'GET', path: '/api/resources', desc: '资源能力' },
  { method: 'GET', path: '/api/material-kitting', desc: '物料齐套' },
  { method: 'GET', path: '/api/schedule/midterm-load', desc: '中期负荷' },
  { method: 'GET', path: '/api/schedule/gantt', desc: '甘特任务' },
  { method: 'POST', path: '/api/schedule/run-midterm', desc: '运行中期排程' },
  { method: 'POST', path: '/api/schedule/run-shortterm', desc: '运行短期排程' },
  { method: 'POST', path: '/api/schedule/simulate-exception', desc: '模拟异常' },
  { method: 'POST', path: '/api/schedule/reschedule', desc: '模拟重排' },
  { method: 'GET', path: '/api/work-instructions', desc: '工作指令' },
  { method: 'POST', path: '/api/actual-feedback', desc: '现场实绩反馈' },
]

const reqExample = `{
  "projectId": "JKT-001",
  "scheduleType": "shortTerm",
  "range": "35d",
  "scenario": "normal"
}`

const resExample = `{
  "success": true,
  "message": "短期排程模拟完成",
  "summary": {
    "taskCount": 32,
    "conflictCount": 4,
    "criticalTaskCount": 12,
    "kittingRiskCount": 2
  },
  "ganttTasks": [ ... ],
  "risks": [ ... ],
  "suggestions": [ ... ]
}`

const dataMap = [
  { name: '项目', file: 'projects.js', scale: '1 主项目', desc: 'KPI、里程碑、专业进度、瓶颈、风险' },
  { name: 'WBS', file: 'wbs.js', scale: '26 节点', desc: '设计/采购/结构/管线/舾装/涂装/总装' },
  { name: 'BOM', file: 'bom.js', scale: '8 构件包', desc: '构件树 + 工序任务拆分' },
  { name: '工艺路线', file: 'routes.js', scale: '5 专业', desc: '工序链与工序详情' },
  { name: '资源', file: 'resources.js', scale: '22 资源', desc: '设备/人员/检验/场地/吊装/外协' },
  { name: '物料齐套', file: 'materials.js', scale: '14 记录', desc: '齐套状态与缺料影响' },
  { name: '甘特任务', file: 'ganttTasks.js', scale: '32 任务', desc: '未来 35 天排程' },
  { name: '风险', file: 'risks.js', scale: '15 事件', desc: '资源/物料/实绩风险' },
  { name: '工作指令', file: 'workInstructions.js', scale: '8 指令', desc: '今日任务卡片' },
  { name: '排程接口', file: 'apsApi.js', scale: '5 函数', desc: '中期/短期/异常/重排/反馈' },
]
</script>

<style scoped>
.api-doc { display: grid; gap: 16px; }
.flow-chain { display: flex; flex-wrap: wrap; gap: 8px 4px; align-items: center; }
.flow-step { background: #eef3f8; border: 1px solid #dde8f3; border-radius: 8px; padding: 7px 11px; font-size: 12px; font-weight: 700; color: #24415f; }
.chain-arrow { width: 18px; height: 18px; flex-shrink: 0; }
code { background: #eef3f8; padding: 2px 6px; border-radius: 5px; color: #1e6fd9; font-size: 12px; }
code.m { color: #0d7377; }
.code-block { background: #0f2342; border-radius: 10px; padding: 12px 14px; margin-top: 12px; overflow-x: auto; }
.code-title { color: #7fb4ff; font-size: 12px; font-weight: 800; margin-bottom: 6px; }
.code-block pre { margin: 0; color: #d9e5f2; font-size: 12px; line-height: 1.6; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; white-space: pre; }
</style>
