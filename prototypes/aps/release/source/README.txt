海工制造 APS 原型系统 —— 源码版（可二次开发）
============================================

环境要求
--------
- Node.js 18 及以上（建议 20 LTS）
- 任意现代浏览器

运行步骤
--------
Windows（PowerShell / CMD）：
    cd aps
    npm install
    npm run dev
    # 打开终端提示的地址，默认 http://localhost:5180

macOS / Linux（终端）：
    cd aps
    npm install
    npm run dev
    # 打开 http://localhost:5180

构建与预览
----------
    npm run build      # 产物输出到 dist/
    npm run preview    # 本地预览 dist 静态包

更多说明见 aps/README.md
