# Git Cheatsheet

这个文件只记录我真正用过的 Git 命令。

## 查看状态

```bash
git status
```

查看当前工作区和暂存区的变化。

## 查看提交历史

```bash
git log
```

查看当前分支的提交记录。

## 添加文件到暂存区


```bash
git add <file>
```

把指定文件加入暂存区。

```bash
git add .
```

把当前目录下的改动加入暂存区。

## 提交更改

```bash
git commit -m "message"
```

提交暂存区里的更改。

## 查看分支

```bash
git branch
```

查看本地分支。

## 创建并切换分支

```bash
git checkout -b <branch-name>
```

创建一个新分支，并切换到这个分支。

## 切换分支

```bash
git checkout <branch-name>
```

切换到已有分支。

## 拉取远程更新

```bash
git pull
```

从远程仓库拉取并合并更新。

## 推送到远程仓库

```bash
git push
```
把本地提交推送到远程仓库。

## 练习记录
我正在学习 git diff 和 git log。

