// 工艺路线状态管理（模拟“DB”）：默认数据来自 routes.js，运行时变更持久化到 localStorage
import { reactive, watch } from 'vue'
import { routeDetails as defaultRoutes } from './routes.js'

const STORAGE_KEY = 'aps_route_store_v1'

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    /* ignore */
  }
  return deepClone(defaultRoutes)
}

export const routeStore = reactive({ routes: load() })

// 任何变更写回 localStorage，模拟后台数据库持久化
watch(
  () => routeStore.routes,
  (v) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(v))
    } catch (e) {
      /* ignore */
    }
  },
  { deep: true }
)

export function getRoute(profession) {
  return routeStore.routes.find((r) => r.profession === profession)
}

export function saveFlow(profession, flow) {
  const r = getRoute(profession)
  if (r) r.flow = flow
}

function toBool(v) {
  return ['是', 'true', '1', 'yes', 'y'].includes(String(v).trim().toLowerCase())
}

// 统一字段名（支持中文表头与英文键），并规整布尔/枚举
export function normalizeOp(o) {
  return {
    name: (o['工序名称'] ?? o.name ?? '').trim(),
    prev: (o['前序'] ?? o.prev ?? '').trim(),
    next: (o['后序'] ?? o.next ?? '').trim(),
    resourceTypes: (o['资源类型'] ?? o.resourceTypes ?? '').trim(),
    std: (o['标准工时'] ?? o.std ?? '').trim(),
    inspect: toBool(o['质检点'] ?? o.inspect),
    outsourcable: (o['允许外协'] ?? o.outsourcable ?? '').trim(),
    kitting: (o['齐套要求'] ?? o.kitting ?? '').trim(),
  }
}

export function addOperation(profession, op) {
  const r = getRoute(profession)
  if (r) r.ops.push(normalizeOp(op))
}

export function updateOperation(profession, index, op) {
  const r = getRoute(profession)
  if (r && r.ops[index]) r.ops[index] = normalizeOp(op)
}

export function deleteOperation(profession, index) {
  const r = getRoute(profession)
  if (r) r.ops.splice(index, 1)
}

export function importOperations(profession, ops) {
  const r = getRoute(profession)
  if (r) r.ops = ops.map(normalizeOp)
}

export function resetRoutes() {
  routeStore.routes = deepClone(defaultRoutes)
}

// ---------- Excel/CSV 解析与模板 ----------

function splitCSVLine(line) {
  const result = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        cur += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ',') {
      result.push(cur)
      cur = ''
    } else {
      cur += c
    }
  }
  result.push(cur)
  return result
}

// 解析 CSV 文本为对象数组（表头支持中文列名）
export function parseRouteCSV(text) {
  const clean = String(text || '').replace(/^\uFEFF/, '')
  const lines = clean.split(/\r?\n/).filter((l) => l.trim() !== '')
  if (!lines.length) return []
  const headers = splitCSVLine(lines[0]).map((h) => h.trim())
  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const cells = splitCSVLine(lines[i])
    const obj = {}
    headers.forEach((h, idx) => {
      obj[h] = (cells[idx] ?? '').trim()
    })
    if (obj['工序名称'] || obj.name) rows.push(obj)
  }
  return rows
}

// 工序表导出为 CSV 文本
export function opsToCSV(ops) {
  const header = '工序名称,前序,后序,资源类型,标准工时,质检点,允许外协,齐套要求'
  const body = ops.map((o) =>
    [
      o.name,
      o.prev,
      o.next,
      o.resourceTypes,
      o.std,
      o.inspect ? '是' : '否',
      o.outsourcable,
      o.kitting,
    ]
      .map((v) => {
        const s = String(v ?? '')
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
      })
      .join(',')
  )
  return header + '\n' + body.join('\n')
}

// 下载用的空白模板（含示例行，可用 Excel 直接打开）
export function routeTemplateCSV() {
  const header = '工序名称,前序,后序,资源类型,标准工时,质检点,允许外协,齐套要求'
  const examples = [
    '切割,坡口,组对,数控切割机,3 m/小时,否,部分允许,图纸、板材、套料程序',
    '焊接,组对,NDT,高级焊工、焊机、焊接工位,0.8 h/焊口,是,部分允许,图纸、焊材、WPS、工位',
    'NDT,焊接,打磨,NDT 班组、探伤设备,12 道口/人天,是,允许,焊口清单、探伤标准',
  ]
  return header + '\n' + examples.join('\n')
}
