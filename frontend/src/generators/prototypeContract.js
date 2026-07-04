export function buildProjectPath(slug, path) {
  return `prototypes/${slug}/${path}`
}

export function stripVueExt(file = '') {
  return file.replace(/\.vue$/i, '')
}

export function stripJsExt(file = '') {
  return file.replace(/\.js$/i, '')
}

export function toPascalName(text = 'Prototype') {
  const cleaned = String(text).replace(/\.(vue|js)$/i, '').replace(/[^a-zA-Z0-9\u4e00-\u9fff]+/g, ' ')
  const ascii = cleaned
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
  return ascii || 'Prototype'
}

export function toCamelName(text = 'prototype') {
  const pascal = toPascalName(text)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

function uniq(arr) {
  return [...new Set((arr || []).filter(Boolean))]
}

function inferRouteRoles(route = {}, groupName = '') {
  const source = `${route.title || ''} ${route.path || ''} ${route.component || ''} ${groupName}`.toLowerCase()
  const roles = []
  if (/司机|driver|task\/list|task\/execute/.test(source)) roles.push('driver')
  if (/门岗|gate|入场|核验/.test(source)) roles.push('gate')
  if (/外协|预约|授权|审批|reservation|access-code|external/.test(source)) roles.push('approver')
  if (/调度|dispatch|告警|monitor|调整/.test(source)) roles.push('dispatcher')
  if (/管理|报表|档案|report|vehicle-archive|management/.test(source)) roles.push('manager', 'admin')
  return uniq(roles.length ? roles : ['admin'])
}

function inferPrimaryRole(group = {}, routes = []) {
  const counts = new Map()
  for (const route of routes) {
    for (const role of route.roles || inferRouteRoles(route, group.group)) {
      counts.set(role, (counts.get(role) || 0) + 1)
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || 'admin'
}

function roleCatalog() {
  return [
    { key: 'dispatcher', label: '调度员', userName: '调度员-王敏', description: '处理派车、监控告警和任务调整' },
    { key: 'driver', label: '司机', userName: '司机-李师傅', description: '查看并执行本人运输任务' },
    { key: 'gate', label: '门岗', userName: '门岗-赵工', description: '车辆入场核验与放行记录处理' },
    { key: 'approver', label: '审批人员', userName: '审批-陈主管', description: '审批外协预约和授权码同步' },
    { key: 'manager', label: '管理层', userName: '管理层-刘总', description: '查看运营报表和管理分析' },
    { key: 'admin', label: '系统管理员', userName: '管理员-周工', description: '维护车辆档案和系统配置' },
  ]
}

function fallbackNavigationGroups(suggestion) {
  const pages = suggestion?.viewFiles || []
  return [{
    group: '原型页面',
    icon: '📄',
    routes: pages.map((page, index) => ({
      path: `/${stripVueExt(page.file).replace(/View$/i, '').replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`,
      component: page.file,
      title: page.title || page.name || stripVueExt(page.file),
      default: index === 0,
    })),
  }]
}

export function buildPrototypeContract({
  suggestion,
  projectName = '',
  customerName = '',
}) {
  const groupsSource = suggestion?.navigationRoutes?.length ? suggestion.navigationRoutes : fallbackNavigationGroups(suggestion)
  const mockFiles = suggestion?.mockDataFiles || []
  const pageSpecs = suggestion?.pageDetailSpecs || []
  const apiMappings = suggestion?.pageApiMapping || []

  const mockContracts = mockFiles.map(mock => {
    const base = stripJsExt(mock.file)
    const domain = base.replace(/^mock/i, '') || base
    const dataExport = `${toCamelName(domain)}Records`
    const readFunction = `fetch${toPascalName(domain)}Data`
    return {
      file: mock.file,
      domain,
      dataExport,
      readFunction,
      usedBy: mock.usedBy || [],
      schema: mock.schema || [],
      description: mock.content || '',
    }
  })

  const routeGroups = groupsSource.map((group, groupIndex) => {
    const routes = (group.routes || []).map((route, routeIndex) => {
      const componentFile = route.component?.endsWith('.vue') ? route.component : `${route.component || ''}.vue`
      const roles = inferRouteRoles({ ...route, component: componentFile }, group.group)
      return {
        path: route.path || `/${stripVueExt(componentFile).toLowerCase()}`,
        component: toPascalName(componentFile),
        file: componentFile,
        title: route.title || stripVueExt(componentFile),
        default: Boolean(route.default || (groupIndex === 0 && routeIndex === 0)),
        roles,
      }
    })
    return {
      group: group.group || `分组 ${groupIndex + 1}`,
      icon: group.icon || '▸',
      defaultRole: inferPrimaryRole(group, routes),
      routes,
    }
  })

  const pages = (suggestion?.viewFiles || []).map(page => {
    const relatedMocks = mockContracts.filter(mock => (mock.usedBy || []).includes(page.file))
    return {
      file: page.file,
      component: toPascalName(page.file),
      title: page.title || page.name || stripVueExt(page.file),
      responsibility: pageSpecs.find(spec => spec.file === page.file)?.responsibility || page.responsibility || '',
      mocks: relatedMocks.map(mock => ({
        file: mock.file,
        importPath: `../data/${mock.file}`,
        dataExport: mock.dataExport,
        readFunction: mock.readFunction,
        schema: mock.schema || [],
        description: mock.description || '',
      })),
      apis: apiMappings.find(mapping => mapping.page === page.file)?.apis || [],
    }
  })

  const routeRoles = uniq(routeGroups.flatMap(group => group.routes.flatMap(route => route.roles || [])))
  const roles = roleCatalog().filter(role => routeRoles.includes(role.key) || role.key === 'admin')
  const defaultRoute = routeGroups.flatMap(group => group.routes).find(route => route.default) || routeGroups[0]?.routes?.[0]

  return {
    version: 1,
    projectName: projectName || suggestion?.projectName || '原型系统',
    customerName: customerName || suggestion?.customerName || '',
    defaultRole: defaultRoute?.roles?.[0] || roles[0]?.key || 'admin',
    roles,
    navigationGroups: routeGroups,
    pages,
    mocks: mockContracts,
  }
}

export function buildPrototypeContractFiles({ slug, contract }) {
  return [{
    path: buildProjectPath(slug, 'src/prototypeContract.js'),
    content: `export const prototypeContract = ${JSON.stringify(contract, null, 2)}\n\nexport default prototypeContract\n`,
  }]
}
