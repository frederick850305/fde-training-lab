# 海工制造 APS 原型系统

面向导管架、管线、舾装、涂装、总装的多专业协同排程工作台（Vue 3 + Vite 前端原型，纯 Mock 数据）。

## 本地启动（源码方式）

```bash
# 1. 安装依赖（仅需一次）
npm install

# 2. 启动开发服务
npm run dev
# 打开终端提示的地址（默认 http://localhost:5180）
```

构建与本地预览生产包：

```bash
npm run build      # 产物输出到 dist/
npm run preview    # 预览 dist/ 静态包
```

## 分享给别人

**方式一：源码包（推荐，便于二次修改）**

将整个 `aps/` 目录（含 `package.json`、`vite.config.js`、`index.html`、`src/`）打包压缩发对方，对方解压后执行：

```bash
npm install
npm run dev
```

> 注意：无需拷贝 `node_modules` 与 `dist/`，对方 `npm install` 会自动安装。

**方式二：静态产物包（对方零依赖，无需 Node）**

本机执行 `npm run build`，把生成的 `dist/` 目录发给对方，任意静态服务器即可托管：

```bash
# 任选其一
npx serve dist
python3 -m http.server 8080 -d dist
```

## 技术栈

- Vue 3 + Vite 7
- 无 Element Plus / ECharts 依赖，甘特图、负荷图均为自定义组件
- 数据全部来自 `src/mock/`，排程结果由 `src/mock/apsApi.js` 模拟
