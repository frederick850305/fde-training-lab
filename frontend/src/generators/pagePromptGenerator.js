export function buildPageGenerationPrompt({ slug, file, responsibility }) {
  return [
    `生成 Vue3 页面组件：prototypes/${slug}/src/views/${file}`,
    `职责：${responsibility || file}`,
    `只生成这一个页面文件，不要生成其他文件。`,
    `必须从 ../prototypeContract.js 导入 prototypeContract，导入路径必须带 .js 后缀；并可 inject('prototypeContext') 读取 currentRole/currentRoleKey；不同角色看到的数据或默认筛选要有差异。`,
    `必须严格使用 pageContract.mocks 中列出的 mock 入口；只允许从指定 importPath 原样导入 readFunction/dataExport，importPath 通常形如 ../data/mockXxx.js，禁止省略 .js，禁止新增未在 contract 中出现的 mock 文件。`,
    `可以用相对路径导入 ../components 和 ../data 下的文件；禁止使用 @ 别名。`,
    `禁止导入 vue-router、element-plus、vuedraggable 或任何未在 package.json 声明的外部库。`,
    `禁止引用任何未生成的静态资源，包括 ../assets/*.svg、../assets/*.png、图片 URL 或 CSS url(...)；空状态请用纯 CSS、文字、emoji 或内联小型 SVG。`,
    `页面展示字段必须来自 pageContract.mocks.schema 或在页面内做 normalize 映射；禁止直接渲染可能不存在的字段导致空白内容。`,
    `调用 readFunction 后必须先 normalize 响应：兼容 Array、response.records、response.data、response[pageContract.mocks[i].dataExport] 和按 schema 字段挂载的顶层对象；禁止直接假设返回值一定是某一种结构。`,
    `当 schema 字段是 object/array 时，页面必须从返回值顶层字段、records[0] 对应字段、records 展开结果中至少兜底一种，确保 mock 有数据时页面不能显示全 0 或空白。`,
    `禁止在页面内定义超过 3 条记录的大块业务 mock 数组；演示数据必须来自 contract 指定的 mock 读取函数。`,
    `列表、卡片、详情区必须展示可见业务文本和关键字段，至少包含标题、状态、时间/地点/人员中的两类信息。`,
    `要求：script setup + scoped CSS，包含 loading/empty/error 状态，适合原型演示；<script setup> 内禁止出现 export function/export const。`,
    `输出 JSON：{"files":[{"path":"prototypes/${slug}/src/views/${file || 'Page.vue'}","content":"..."}]}`,
  ].filter(Boolean).join('\n')
}

export function buildComponentGenerationPrompt({ slug, file, description }) {
  return [
    `生成 Vue3 组件：prototypes/${slug}/src/components/${file}`,
    `职责：${description}`,
    `禁止导入 element-plus、vuedraggable 或任何未在 package.json 声明的外部库；禁止使用 @ 别名。`,
    `要求：纯展示组件，通过 props 接收数据，无业务逻辑。script setup + scoped CSS；<script setup> 内禁止出现 export function/export const。`,
    `输出 JSON：{"files":[{"path":"prototypes/${slug}/src/components/${file}","content":"..."}]}`,
  ].join('\n')
}
