# PR 练习记录

本次练习目标是熟悉 GitHub Flow：

1. 从 main 创建 feature 分支
2. 在 feature 分支修改文件
3. push 到 GitHub
4. 创建 Pull Request
5. 合并回 main
6. 选择一个已有分支修改文件并提交合并
   
## 新增一个分支
# 1. 进入本地仓库
cd ~/Code/fde-training-lab

# 2. 切回 main
git checkout main

# 3. 拉取 GitHub 最新 main
git pull

# 4. 新建并切换到新分支
git checkout -b feature/add-branch-notes

# 5. 在 VS Code 中新增/修改文件，然后保存

# 6. 查看当前改动状态
git status

# 7. 查看具体改了什么
git diff

# 8. 添加要提交的文件
git add docs/git-branch-notes.md

# 如果你确定所有修改都要提交，也可以：
# git add .

# 9. 本地提交
git commit -m "Add Git branch notes"

# 10. 第一次推送这个新分支到 GitHub
git push --set-upstream origin feature/add-branch-notes

## 在一个分支上创建 Pull Request
# 1. 进入本地仓库
cd ~/Code/fde-training-lab

# 2. 查看本地有哪些分支
git branch

# 3. 切换到已有分支
git checkout feature/update-git-cheatsheet

# 4. 如果这个分支已经关联了 GitHub 远程分支，可以先拉一下最新内容
git pull

# 5. 在 VS Code 中新增/修改文件，然后保存

# 6. 查看当前状态
git status

# 7. 查看具体改了什么
git diff

# 8. 添加文件
git add docs/git-cheatsheet.md

# 9. 本地提交
git commit -m "Update Git cheatsheet"

# 10. 推送到 GitHub
git push 