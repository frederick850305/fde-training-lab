import { buildProjectPath } from './prototypeContract'

function extractNamedImports(content = '') {
  const imports = []
  const pattern = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g
  let match = pattern.exec(content)
  while (match) {
    imports.push({
      names: match[1].split(',').map(name => name.trim().split(/\s+as\s+/)[0]).filter(Boolean),
      source: match[2],
    })
    match = pattern.exec(content)
  }
  return imports
}

function hasNamedExport(content = '', name = '') {
  if (!name) return false
  if (new RegExp(`export\\s+(const|let|var)\\s+${name}\\b`).test(content)) return true
  if (new RegExp(`export\\s+(async\\s+)?function\\s+${name}\\b`).test(content)) return true
  const exportListPattern = /export\s*\{([^}]+)\}/g
  let match = exportListPattern.exec(content)
  while (match) {
    const exportedNames = match[1]
      .split(',')
      .map(item => item.trim().split(/\s+as\s+/).pop()?.trim())
      .filter(Boolean)
    if (exportedNames.includes(name)) return true
    match = exportListPattern.exec(content)
  }
  return false
}

function normalizeImportSource(source = '') {
  const text = String(source || '').trim()
  if (!text) return ''
  if (/\.js$/i.test(text)) return text
  if (text.startsWith('../data/') || text.startsWith('./data/') || text.startsWith('../prototypeContract')) {
    return `${text}.js`
  }
  return text
}

function importsPrototypeContract(content = '') {
  return /from\s+['"]\.\.\/prototypeContract(?:\.js)?['"]/.test(content)
}

export function validatePrototypeFiles({ slug, generatedFiles, contract }) {
  const filePaths = new Set(generatedFiles.map(file => file.path))
  const files = Object.fromEntries(generatedFiles.filter(file => file.content).map(file => [file.path, file.content]))
  const issues = []

  const contractPath = buildProjectPath(slug, 'src/prototypeContract.js')
  if (!filePaths.has(contractPath)) issues.push('缺少 src/prototypeContract.js 运行契约文件')

  const indexContent = files[buildProjectPath(slug, 'index.html')]
  if (indexContent && !/charset=["']?UTF-8/i.test(indexContent)) issues.push('index.html 缺少 UTF-8 charset')

  const appContent = files[buildProjectPath(slug, 'src/App.vue')]
  if (appContent) {
    if (!appContent.includes('currentRoleKey') || !appContent.includes('role-panel')) issues.push('App.vue 缺少角色选择运行时')
    if (!appContent.includes('expandedGroups') || !appContent.includes('toggleGroup')) issues.push('App.vue 缺少手风琴导航状态')
    for (const page of contract.pages || []) {
      if (!appContent.includes(`./views/${page.file}`)) issues.push(`App.vue 未导入页面 ${page.file}`)
    }
  }

  for (const mock of contract.mocks || []) {
    const content = files[buildProjectPath(slug, `src/data/${mock.file}`)]
    if (!content) continue
    if (!hasNamedExport(content, mock.dataExport)) {
      issues.push(`${mock.file} 缺少数据导出 ${mock.dataExport}`)
    }
    if (!hasNamedExport(content, mock.readFunction)) {
      issues.push(`${mock.file} 缺少读取函数 ${mock.readFunction}`)
    }
  }

  const allowedDataImports = new Map()
  for (const page of contract.pages || []) {
    allowedDataImports.set(page.file, new Set((page.mocks || []).map(mock => normalizeImportSource(mock.importPath))))
  }

  for (const page of contract.pages || []) {
    const content = files[buildProjectPath(slug, `src/views/${page.file}`)]
    if (!content) continue
    const imports = extractNamedImports(content)
    const dataImports = imports.filter(item => item.source.includes('/data/') || item.source.startsWith('../data/'))
    const allowed = allowedDataImports.get(page.file) || new Set()
    for (const item of dataImports) {
      const normalizedSource = normalizeImportSource(item.source)
      if (!allowed.has(normalizedSource)) issues.push(`${page.file} 使用了 contract 未声明的数据源 ${item.source}`)
      const mock = (page.mocks || []).find(candidate => normalizeImportSource(candidate.importPath) === normalizedSource)
      if (mock) {
        const allowedNames = new Set([mock.dataExport, mock.readFunction])
        for (const name of item.names) {
          if (!allowedNames.has(name)) issues.push(`${page.file} 从 ${item.source} 导入了未声明的 mock 导出 ${name}`)
        }
      }
    }
    if ((page.mocks || []).length && !importsPrototypeContract(content)) {
      issues.push(`${page.file} 未导入 prototypeContract，角色上下文和 mock 契约可能失效`)
    }
    for (const mock of page.mocks || []) {
      if (!content.includes(mock.readFunction) && !content.includes(mock.dataExport)) {
        issues.push(`${page.file} 未使用契约声明的 mock 入口 ${mock.readFunction}/${mock.dataExport}`)
      }
    }
  }

  return issues
}
