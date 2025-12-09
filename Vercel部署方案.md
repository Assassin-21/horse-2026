# 🚀 Vercel 部署方案（2024最新版）

> Vercel 界面已更新，不再直接支持文件夹上传。提供两种方案：

---

## 方案一：使用 Vercel CLI 命令行部署（推荐！最简单）

### 优点
- ✅ 不需要 Git 仓库
- ✅ 直接上传文件夹
- ✅ 操作简单快速

### 步骤

#### 1. 安装 Node.js（如果还没安装）

1. 访问 https://nodejs.org
2. 下载并安装 LTS 版本
3. 安装完成后，重启命令行

#### 2. 安装 Vercel CLI

打开 PowerShell 或 CMD，运行：

```powershell
npm install -g vercel
```

等待安装完成（约 1-2 分钟）

#### 3. 登录 Vercel

```powershell
vercel login
```

- 会打开浏览器，选择用 GitHub 登录
- 授权后回到命令行，显示 "Success! Logged in"

#### 4. 进入项目目录

```powershell
cd "C:\Users\15402\Desktop\2026马钞\激活码服务端"
```

#### 5. 部署项目

```powershell
vercel
```

**按提示操作：**
- `Set up and deploy?` → 输入 `Y` 回车
- `Which scope?` → 选择你的账号（直接回车）
- `Link to existing project?` → 输入 `N` 回车（创建新项目）
- `What's your project's name?` → 输入 `machao-activation` 回车
- `In which directory is your code located?` → 直接回车（默认 `./`）

#### 6. 设置环境变量

部署完成后，会提示是否添加环境变量，选择 `Y`：

```powershell
# 添加第一个环境变量
vercel env add JSONBIN_BIN_ID
# 输入你的 Bin ID，然后回车
# Environment: 选择 Production（输入 1 或直接回车）

# 添加第二个环境变量
vercel env add JSONBIN_API_KEY
# 输入你的 Master Key，然后回车
# Environment: 选择 Production（输入 1 或直接回车）
```

#### 7. 部署到生产环境

```powershell
vercel --prod
```

#### 8. 获取域名

部署完成后，会显示：
```
✅ Production: https://machao-activation-xxx.vercel.app
```

**这就是你的 API 地址！**

---

## 方案二：通过 Git 仓库部署（如果方案一不行）

### 步骤

#### 1. 创建 GitHub 仓库

1. 访问 https://github.com
2. 登录后，点击右上角 `+` → `New repository`
3. 仓库名称：`machao-activation`
4. 选择 `Private`（私有）
5. **不要**勾选 "Initialize with README"
6. 点击 `Create repository`

#### 2. 上传代码到 GitHub

**方法一：使用 GitHub Desktop（推荐新手）**

1. 下载 GitHub Desktop：https://desktop.github.com
2. 安装并登录
3. File → Add Local Repository
4. 选择 `激活码服务端` 文件夹
5. 点击 `Publish repository`
6. 选择刚创建的仓库，点击 `Publish`

**方法二：使用命令行**

在 `激活码服务端` 文件夹中打开 PowerShell：

```powershell
# 初始化 Git（如果还没初始化）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/machao-activation.git

# 推送
git branch -M main
git push -u origin main
```

#### 3. 在 Vercel 导入项目

1. 回到 Vercel：https://vercel.com/new
2. 点击 **"Import Git Repository"**
3. 找到你刚创建的 `machao-activation` 仓库
4. 点击 **"Import"**

#### 4. 配置项目

- **Project Name**: `machao-activation`
- **Framework Preset**: `Other`
- **Root Directory**: `./`

#### 5. 添加环境变量

在配置页面找到 **"Environment Variables"**：

1. 点击 **"Add"**
2. Name: `JSONBIN_BIN_ID`，Value: 你的 Bin ID
3. Environment: 全选
4. 再次点击 **"Add"**
5. Name: `JSONBIN_API_KEY`，Value: 你的 Master Key
6. Environment: 全选

#### 6. 部署

点击 **"Deploy"**，等待完成

---

## 🎯 推荐方案

**强烈推荐方案一（Vercel CLI）**，因为：
- ✅ 不需要 Git
- ✅ 操作更简单
- ✅ 直接上传文件夹
- ✅ 适合新手

---

## 📋 快速命令参考

如果选择方案一，直接复制以下命令：

```powershell
# 1. 安装 CLI（只需一次）
npm install -g vercel

# 2. 登录（只需一次）
vercel login

# 3. 进入项目目录
cd "C:\Users\15402\Desktop\2026马钞\激活码服务端"

# 4. 部署
vercel

# 5. 添加环境变量（部署后）
vercel env add JSONBIN_BIN_ID
vercel env add JSONBIN_API_KEY

# 6. 部署到生产环境
vercel --prod
```

---

## ❓ 如果遇到问题

### Q: `npm` 命令不存在？

**A:** 需要先安装 Node.js：
1. 访问 https://nodejs.org
2. 下载并安装 LTS 版本
3. 重启命令行

### Q: `vercel` 命令不存在？

**A:** 检查安装是否成功：
```powershell
npm list -g vercel
```
如果没有，重新安装：
```powershell
npm install -g vercel
```

### Q: 登录失败？

**A:** 
- 确保网络正常
- 尝试用浏览器手动登录 vercel.com
- 然后重新运行 `vercel login`

### Q: 环境变量添加失败？

**A:** 
- 确保在项目目录中
- 或者使用网页版：项目 → Settings → Environment Variables

---

**建议先尝试方案一，如果遇到问题再告诉我！** 🚀

