# 阶段 1：Git 学习记录

## 我已经完成的操作

- 创建 GitHub 仓库
- 将仓库 clone 到本地
- 使用 VS Code 编辑 README
- 使用 git add / commit / push 提交代码
- 创建 docs/git-cheatsheet.md
- 处理本地分支与远程分支分叉问题
- 使用 git pull --rebase 同步远程变更

## 我的理解

Git 是本地版本管理工具，GitHub 是远程代码托管和协作平台。

日常工作中，我需要先确认状态，再查看改动，然后提交和推送：

```bash
git status
git diff
git add .
git commit -m "说明这次改了什么"
git push