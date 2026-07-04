import { buildProjectPath, stripJsExt } from './prototypeContract'

function sampleFieldValue(fieldName = '', index = 0, mock = {}) {
  const lower = fieldName.toLowerCase()
  const domain = mock.domain || stripJsExt(mock.file || 'mock')
  if (/id|编号|编码|code/.test(lower)) return `${domain}-${String(index + 1).padStart(3, '0')}`
  if (/status|state|状态/.test(lower)) return ['待处理', '进行中', '已完成'][index % 3]
  if (/time|date|时间|日期/.test(lower)) return `2026-07-${String(index + 1).padStart(2, '0')} 09:${String(index * 7).padStart(2, '0')}`
  if (/location|address|place|位置|地点|区域/.test(lower)) return ['东区堆场', '南门岗', '总调度室'][index % 3]
  if (/driver|person|user|owner|负责人|人员|司机|操作人/.test(lower)) return ['王敏', '李师傅', '赵工'][index % 3]
  if (/vehicle|plate|car|车辆|车牌/.test(lower)) return ['沪A-2601', '沪B-3812', '沪C-4920'][index % 3]
  if (/count|num|数量|次数/.test(lower)) return (index + 1) * 3
  if (/amount|price|cost|金额|费用/.test(lower)) return (index + 1) * 1200
  if (/rate|percent|比例|占比/.test(lower)) return `${82 + index * 4}%`
  if (/title|name|名称|标题/.test(lower)) return `${mock.description || domain}样例${index + 1}`
  if (/desc|remark|note|说明|备注|描述/.test(lower)) return `${mock.description || domain}的演示记录，用于页面展示和交互验证`
  return `${fieldName || domain}样例${index + 1}`
}

function sampleObjectValue(fieldName = '', index = 0, mock = {}) {
  const lower = fieldName.toLowerCase()
  const base = mock.description || mock.domain || stripJsExt(mock.file || 'mock')
  const common = {
    id: `${mock.domain || 'mock'}-${String(index + 1).padStart(3, '0')}`,
    title: `${base} ${index + 1}`,
    name: `${base} ${index + 1}`,
    status: ['待处理', '进行中', '已完成'][index % 3],
    time: `2026-07-${String(index + 1).padStart(2, '0')} 09:${String(index * 7).padStart(2, '0')}`,
    location: ['东区堆场', '南门岗', '总调度室'][index % 3],
    person: ['王敏', '李师傅', '赵工'][index % 3],
  }

  if (/vehicle|车辆|车/.test(lower)) {
    return {
      ...common,
      vehicleId: `V-${String(index + 1).padStart(3, '0')}`,
      plate: ['沪A-2601', '沪B-3812', '沪C-4920'][index % 3],
      plateNo: ['沪A-2601', '沪B-3812', '沪C-4920'][index % 3],
      plateNumber: ['沪A-2601', '沪B-3812', '沪C-4920'][index % 3],
      driver: ['李师傅', '王师傅', '赵师傅'][index % 3],
      driverName: ['李师傅', '王师傅', '赵师傅'][index % 3],
      currentLocation: ['东区堆场', '南门岗', '总调度室'][index % 3],
      currentPosition: ['东区堆场', '南门岗', '总调度室'][index % 3],
      onlineStatus: ['空闲', '任务中', '异常'][index % 3],
      driverStatus: ['空闲', '执行中', '待命'][index % 3],
    }
  }
  if (/demand|request|需求/.test(lower)) {
    return {
      ...common,
      demandId: `DEM-${String(index + 1).padStart(3, '0')}`,
      requestId: `REQ-${String(index + 1).padStart(3, '0')}`,
      applicant: ['张工', '李主任', '王经理'][index % 3],
      requester: ['张工', '李主任', '王经理'][index % 3],
      departure: ['A区仓库', '行政楼', '南门岗'][index % 3],
      destination: ['B区产线', '物流中心', '维修车间'][index % 3],
      applyTime: common.time,
      demandTime: common.time,
    }
  }
  if (/task|任务/.test(lower)) {
    return {
      ...common,
      taskId: `TASK-${String(index + 1).padStart(3, '0')}`,
      taskStatus: common.status,
      dispatchTime: common.time,
      driverId: `DRV-${String(index + 1).padStart(3, '0')}`,
      vehicleId: `V-${String(index + 1).padStart(3, '0')}`,
    }
  }
  if (/history|record|log|历史|记录|日志/.test(lower)) {
    return {
      ...common,
      recordId: `REC-${String(index + 1).padStart(3, '0')}`,
      action: ['新增', '审批', '同步'][index % 3],
      operator: ['王敏', '赵工', '周工'][index % 3],
      description: `${base}操作记录 ${index + 1}`,
    }
  }
  if (/code|授权码/.test(lower)) {
    return {
      ...common,
      codeId: `CODE-${String(index + 1).padStart(3, '0')}`,
      codeValue: String(100000 + index * 137),
      syncStatus: ['已同步', '同步失败', '待同步'][index % 3],
      usageStatus: ['未使用', '已使用', '已过期'][index % 3],
    }
  }
  return common
}

function sampleStructuredValue(field = {}, index = 0, mock = {}) {
  const fieldName = field.field || field.name || ''
  const type = String(field.type || '').toLowerCase()
  if (type.includes('array')) return [0, 1, 2].map(offset => sampleObjectValue(fieldName, index + offset, mock))
  if (type.includes('object')) return sampleObjectValue(fieldName, index, mock)
  return sampleFieldValue(fieldName, index, mock)
}

function buildMockRecord(mock, index) {
  const baseTitle = mock.description || mock.domain || stripJsExt(mock.file)
  const record = {
    id: `${mock.domain || 'mock'}-${String(index + 1).padStart(3, '0')}`,
    title: `${baseTitle} ${index + 1}`,
    name: `${baseTitle} ${index + 1}`,
    status: ['待处理', '进行中', '已完成'][index % 3],
    time: `2026-07-${String(index + 1).padStart(2, '0')} 09:${String(index * 7).padStart(2, '0')}`,
    location: ['东区堆场', '南门岗', '总调度室'][index % 3],
    person: ['王敏', '李师傅', '赵工'][index % 3],
    roleKey: ['dispatcher', 'driver', 'gate', 'manager'][index % 4],
    summary: `${baseTitle}演示数据 ${index + 1}`,
  }

  for (const field of mock.schema || []) {
    const fieldName = field.field || field.name
    if (!fieldName || Object.prototype.hasOwnProperty.call(record, fieldName)) continue
    record[fieldName] = sampleStructuredValue(field, index, mock)
  }

  return record
}

function buildSingleMockFile(mock) {
  const records = [0, 1, 2, 3, 4, 5].map(index => buildMockRecord(mock, index))
  return `const clone = (value) => JSON.parse(JSON.stringify(value))\nconst schemaFields = ${JSON.stringify((mock.schema || []).map(field => field.field || field.name).filter(Boolean), null, 2)}\n\nexport const ${mock.dataExport} = ${JSON.stringify(records, null, 2)}\n\nfunction enhanceRows(inputRows = []) {\n  const rows = Array.isArray(inputRows) ? inputRows : []\n  const first = rows[0] || {}\n\n  for (const field of schemaFields) {\n    if (Object.prototype.hasOwnProperty.call(rows, field)) continue\n    const values = rows.map((row) => row?.[field]).filter((value) => value !== undefined && value !== null && value !== '')\n    if (Array.isArray(first[field])) rows[field] = rows.flatMap((row) => Array.isArray(row?.[field]) ? row[field] : [])\n    else rows[field] = values[0] ?? (field.endsWith('s') ? [] : {})\n  }\n\n  rows.success = true\n  rows.total = rows.length\n  rows.records = rows\n  rows.data = rows\n  rows[${JSON.stringify(mock.dataExport)}] = rows\n  return rows\n}\n\nexport function ${mock.readFunction}(options = {}) {\n  const { roleKey = '', filters = {} } = options || {}\n  let rows = clone(${mock.dataExport})\n\n  if (roleKey && roleKey !== 'admin') {\n    rows = rows.map((row) => ({ ...row, currentRole: roleKey }))\n  }\n\n  for (const [key, value] of Object.entries(filters || {})) {\n    if (value === undefined || value === null || value === '') continue\n    rows = rows.filter((row) => String(row[key] ?? '').includes(String(value)))\n  }\n\n  return enhanceRows(rows)\n}\n\nexport default ${mock.dataExport}\n`
}

function buildApiIndexFile(contract) {
  return `import { prototypeContract } from '../prototypeContract.js'\n\nconst delay = (value) => new Promise((resolve) => window.setTimeout(() => resolve(value), 120))\n\nexport function listPrototypeApis() {\n  return prototypeContract.pages.flatMap((page) => (page.apis || []).map((api) => ({\n    page: page.file,\n    ...api,\n  })))\n}\n\nexport function findPrototypeApi(path, method = '') {\n  return listPrototypeApis().find((api) => api.path === path && (!method || String(api.method || '').toUpperCase() === String(method).toUpperCase())) || null\n}\n\nexport async function requestMock(path, params = {}) {\n  const api = findPrototypeApi(path, params.method)\n  return delay({\n    success: true,\n    code: 0,\n    message: api ? 'mock success' : 'mock api not declared in prototypeContract',\n    api,\n    data: {\n      path,\n      params,\n      generatedAt: new Date().toISOString(),\n    },\n  })\n}\n`
}

export function buildMockFiles({ slug, contract }) {
  const mockFiles = (contract.mocks || []).map(mock => ({
    path: buildProjectPath(slug, `src/data/${mock.file}`),
    content: buildSingleMockFile(mock),
  }))

  return [
    ...mockFiles,
    {
      path: buildProjectPath(slug, 'src/api/index.js'),
      content: buildApiIndexFile(contract),
    },
  ]
}
