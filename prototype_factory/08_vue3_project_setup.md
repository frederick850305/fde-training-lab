# 2-8 Vue3 项目初始化

本文件记录第二阶段前端工程初始化方法，用于建立后续可复用的 Vue3 原型项目骨架。

核心原则：

```text
先建立能启动、能演示、结构清楚的最小前端工程，再逐步生成页面和联调接口。
```

## 一、本节目标

从本节开始，第二阶段进入前端工程实践。

本节要完成：

```text
创建 frontend/
初始化 Vue3 + Vite 项目
建立基础目录结构
创建第一个 App 页面
确认 npm install 和 npm run build 可用
```

## 二、为什么选择 Vue3 + Vite

| 技术 | 作用 | 选择原因 |
|---|---|---|
| Vue3 | 前端框架 | 模板语法直观，适合快速做业务原型 |
| Vite | 构建工具 | 启动快，配置少，适合本地原型 |
| SFC | 单文件组件 | template/script/style 放在一个 `.vue` 文件中，便于 AI 生成和修改 |
| scoped CSS | 页面样式 | 避免样式互相污染，适合小步迭代 |

## 三、推荐目录结构

第二阶段前端项目建议放在：

```text
frontend/
```

初始化后的最小结构：

```text
frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.js
    ├── App.vue
    └── style.css
```

后续章节会逐步扩展为：

```text
frontend/
└── src/
    ├── api/
    ├── assets/
    ├── components/
    ├── router/
    └── views/
```

## 四、VSCode 操作建议

在 VSCode 中建议这样操作：

```text
1. 打开项目根目录
2. 确认 frontend/ 与 prototype_factory/ 位于同一级
3. 在终端进入 frontend/
4. 执行 npm install
5. 执行 npm run dev
6. 浏览器打开 Vite 输出的本地地址
```

## 五、常用命令

进入前端目录：

```bash
cd frontend
```

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

执行构建检查：

```bash
npm run build
```

## 六、本节产出

本节完成后，你会得到：

| 产出 | 说明 |
|---|---|
| `frontend/package.json` | 前端依赖和启动命令 |
| `frontend/vite.config.js` | Vite 配置 |
| `frontend/index.html` | 前端入口 HTML |
| `frontend/src/main.js` | Vue 应用入口 |
| `frontend/src/App.vue` | 第一版工作台占位页面 |
| `frontend/src/style.css` | 全局样式 |

## 七、生成 Vue3 项目前的 Prompt

以后你在新项目中可以先使用下面的 Prompt。

```text
请帮我初始化一个 Vue3 + Vite 的售前原型前端项目。

要求：
1. 项目目录为 frontend。
2. 使用 Vue3 单文件组件。
3. 先不引入复杂 UI 组件库。
4. 创建最小可运行结构：index.html、package.json、vite.config.js、src/main.js、src/App.vue、src/style.css。
5. App.vue 先做一个工作台占位页，展示项目名称、阶段说明和后续功能入口。
6. 样式简洁、适合企业级售前原型。
7. 给出 npm install、npm run dev、npm run build 命令。
```

## 八、质量检查

完成初始化后，用下面清单检查。

| 检查项 | 合格标准 |
|---|---|
| 目录是否清楚 | `frontend/` 独立存在 |
| 依赖是否安装 | `npm install` 成功 |
| 本地能否启动 | `npm run dev` 可启动 |
| 构建是否通过 | `npm run build` 成功 |
| 页面是否可见 | 浏览器能看到工作台占位页 |
| 后续是否可扩展 | 结构能继续添加 views/components/api |

## 九、下一步衔接

完成 2-8 后，下一节进入：

```text
2-9 工作台首页生成
```

下一节会在当前 Vue3 项目基础上，正式设计并生成 FDE Prototype Factory Web Console 的工作台首页。
