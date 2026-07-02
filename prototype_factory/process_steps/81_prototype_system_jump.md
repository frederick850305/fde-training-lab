# 2-43：FDE 方法链路闭环后自动跳转原型系统

## 目标

当用户在 07 步「前端原型方案」中点击「确认前端原型方案」后，不再仅停留在当前页面，而是自动跳转到「业务原型系统」Tab，打开「项目总览」页面，让用户即刻看到原型成果。

## 背景

此前 `handleSuggestionConfirm` 确认后仅标记 `contextStatus: 'FDE 自助式方法链路已闭环'`，没有跳转动作。用户需要手动切换到 `prototypeSystem` Tab 才能看到业务原型页面。

## 实现要点

1. `handleSuggestionConfirm` 在保存 `prototype` 结果后，设置 `activeMainTab = 'prototypeSystem'`、`activeWorkspace = 'projectOverview'`
2. 更新 `contextStatus` 为「已进入原型系统」
3. 更新 `summary` 提示用户可在原型系统中查看成果

## 修改文件

- `frontend/src/App.vue`：`handleSuggestionConfirm` 函数末尾添加跳转逻辑
- `frontend/src/App.vue`：`progressItems` 新增 2-43

## 验收方式

1. `npm run dev` 正常启动
2. 在方法链路中从 01 走到 07，点击「确认前端原型方案」
3. 确认后自动切换到「业务原型系统」Tab，显示「项目总览」页面
4. 浏览器 Console 无红色错误
