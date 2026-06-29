# FDE Training Lab Copilot Instructions

你正在协助开发 FDE Training Lab 项目中的 AI 原型工厂前台系统。

## 项目目标

本项目第二阶段目标是构建一个基于 Vue3 + Vite 的“AI 原型工厂前台工作台”。

当前阶段不接真实大模型，不接真实后端服务，只做前台可交互流程和 mock 数据模拟。

完整流程是：

客户需求
-> 需求拆解
-> 场景识别
-> 功能模块设计
-> 页面清单设计
-> 页面字段与交互设计
-> API 契约设计
-> 前端原型建议
-> Vue3 前端原型页面

## 技术栈

- Vue3
- Vite
- JavaScript
- 单文件组件 .vue
- 当前不使用 React
- 当前不引入复杂 UI 框架
- 当前不接 DeepSeek
- 当前不接 FastAPI
- 当前优先使用本地 mock 数据

## 目录约定

练习说明文件放在：

prototype_factory/

前端代码放在：

frontend/src/

页面组件放在：

frontend/src/views/

通用组件放在：

frontend/src/components/

mock 数据放在：

frontend/src/data/

全局样式放在：

frontend/src/style.css

主入口文件是：

frontend/src/App.vue

## 开发规则

每次只完成一个小节，不要一次改太多。

每次新增练习小节时，必须：

1. 在 prototype_factory/ 下新增对应编号的 md 文件
2. 在 frontend/src/views 或 frontend/src/components 或 frontend/src/data 下新增必要代码
3. 修改 App.vue 接入新工作区
4. 更新 progressItems
5. 保持原有页面可用
6. 不删除已有练习成果
7. 不随意重构全局结构
8. 不引入新的 npm 依赖，除非用户明确同意

## 命名规则

页面组件使用 PascalCase，例如：

ProjectOverviewView.vue
MaterialTrackingView.vue

mock 数据文件使用 camelCase，例如：

prototypeMockData.js
apiContractMock.js

工作区 key 使用 camelCase，例如：

materialTracking
projectOverview

## 验收规则

每次修改后，优先检查：

- npm run dev 能正常启动
- 页面不是白屏
- 浏览器 Console 没有红色错误
- App.vue import 路径正确
- mock 数据 export/import 名称一致
- 工作区切换按钮能看到新增页面
- 进度列表更新到当前小节

## 输出要求

每次完成一个小节后，向用户说明：

- 本节目标
- 新增/修改了哪些文件
- 每个文件的位置
- 主要实现内容
- 本地验收方式

不要跳跃，不要一次性生成多个小节。