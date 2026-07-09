# 海工制造 APS 原型系统（源码分发包）

这是一份**可独立运行的源码包**，解压后只需安装运行环境即可启动，并可直接修改源码二次开发。

> 适用场景：直接发给同事/合作方，对方无需 Git、无需本仓库其它内容，
> 只要机器上有 **Node.js（建议 18+ / 20+）** 即可运行。

## 目录说明

```
aps/
├── index.html          # 应用入口 HTML
├── package.json        # 依赖与脚本定义
├── package-lock.json   # 锁定依赖版本（保证安装一致）
├── vite.config.js      # Vite 构建配置
├── public/             # 静态资源
└── src/                # 全部源码（Vue 3 + Vite）
    ├── main.js
    ├── Shell.vue
    ├── components/     # 甘特图、负荷图等自定义组件
    ├── views/          # 各页面
    ├── mock/           # 全部 Mock 数据 / 模拟排程接口
    └── data/           # 业务数据
```

## 运行环境要求

- **Node.js**：18.x 或 20.x（含 npm，随 Node 自带）
- 操作系统：Windows / macOS / Linux 均可

## 本地启动（三步）

```bash
# 1. 进入源码目录
cd aps

# 2. 安装依赖（仅需一次，会生成 node_modules/）
npm install

# 3. 启动开发服务
npm run dev
# 终端会输出访问地址，默认 http://localhost:5180
```

打开浏览器访问终端提示的地址即可使用。修改 `src/` 下任意文件，页面会热更新。

## 构建与预览生产包（可选）

```bash
npm run build      # 产物输出到 dist/
npm run preview    # 本地预览 dist/ 静态包
```

## 二次修改

- 全部数据为前端 Mock，位于 `src/mock/`，排程结果由 `src/mock/apsApi.js` 模拟。
- 排程/甘特图相关界面在 `src/views/GanttView.vue`、`src/components/ResourceGantt.vue`。
- 技术栈：Vue 3 + Vite 7，无 Element Plus / ECharts 依赖。

## 常见问题

- `npm install` 慢或失败：可切换镜像 `npm config set registry https://registry.npmmirror.com`，或确认网络可访问 npmjs。
- 端口被占用：`npm run dev` 会自动顺延端口；也可在 `vite.config.js` 中修改 `server.port`。
