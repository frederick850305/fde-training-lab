# 2-15 工作台页面切换与状态修正

## 本节目标

本节将当前“所有练习页面纵向堆叠”的展示方式，调整为“工作区切换”方式。

用户可以在首页能力入口或工作区导航中切换：

- 需求输入
- 原型流程
- 需求分析

同时修正结果面板的状态兜底逻辑，避免因为状态值异常时直接展示 `UNKNOWN_ERROR`，影响页面观感和练习判断。

## 本节价值

前面 2-13 和 2-14 已经把“需求输入”和“模拟需求拆解”跑通了，但截图里可以看到，旧页面也一起展示在下方，会造成两个问题：

1. 页面太长，不像一个真正的工作台。
2. 用户当前只想看一个模块时，容易被旧练习页面的状态干扰。

本节完成后，页面会更接近真实的原型工厂工作台：顶部是能力入口，中间是流程和进度，下面只展示当前选中的工作区。

## 新增文件

| 类型 | 文件 | 位置 |
| --- | --- | --- |
| 新增 | `15_workspace_tab_navigation.md` | `prototype_factory/15_workspace_tab_navigation.md` |

## 修改文件

| 类型 | 文件 | 位置 |
| --- | --- | --- |
| 修改 | `App.vue` | `frontend/src/App.vue` |
| 修改 | `FeatureCard.vue` | `frontend/src/components/FeatureCard.vue` |
| 修改 | `ResultPanel.vue` | `frontend/src/components/ResultPanel.vue` |

## 页面变化

### 1. App.vue

新增 `activeWorkspace` 状态，用于记录当前选中的工作区。

新增工作区导航：

- 需求输入
- 原型流程
- 需求分析

根据 `activeWorkspace` 控制页面显示：

- `requirementInput` 显示 `RequirementInputView`
- `prototypeWorkflow` 显示 `PrototypeWorkflowView`
- `requirementSummary` 显示 `RequirementSummaryView`

### 2. FeatureCard.vue

能力卡片新增：

- `active` 属性
- `select` 事件

点击卡片按钮时，可以切换到对应工作区。

### 3. ResultPanel.vue

新增状态兜底：

如果传入的 `status` 不是：

- `empty`
- `loading`
- `success`
- `error`

则按 `empty` 处理，避免无意义地展示 `UNKNOWN_ERROR`。

## 验收方式

启动前端后检查：

```bash
cd frontend
npm run dev
```

浏览器打开页面后确认：

- 默认展示“需求输入工作台”
- 点击“原型流程”后，只展示“原型生成流程工作台”
- 点击“需求分析”后，只展示旧的“客户需求分析页”
- 首页能力卡片中的按钮可以切换工作区
- 页面下方不再一次性堆叠三个工作区
- 旧页面不应默认显示 `UNKNOWN_ERROR`
