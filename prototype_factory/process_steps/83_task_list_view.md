# 2-46：生成 P0 核心原型页面 - TaskListView（司机任务列表）

## 目标

根据 07 步输出的页面清单，在独立原型系统 `prototypes/sea-industry-dispatch/` 中生成第二个 P0 页面：TaskListView。

## 设计依据

来源：`prototype_factory/local_step_outputs/prototype.md` pageDetailSpecs

- **文件**：`TaskListView.vue`
- **优先级**：P0
- **职责**：司机查看个人任务列表，接收新任务通知，筛选和查看不同状态的任务
- **布局**：顶部通知横幅 + 筛选栏（状态标签/搜索/排序） + 任务卡片列表
- **UI 状态**：loading(骨架屏)、empty、error、success、new_task_notification

## 新增/修改

| 操作 | 文件 |
|------|------|
| 新增 | `prototypes/sea-industry-dispatch/src/data/taskListMock.js` |
| 替换 | `prototypes/sea-industry-dispatch/src/views/TaskListView.vue` |

## 验收

1. 独立原型 `http://127.0.0.1:5180/` 点击「任务列表」正常显示
2. 8 条任务卡片、状态筛选、搜索、排序均可用
3. 新任务通知横幅可关闭
4. 浏览器 Console 无红色错误
