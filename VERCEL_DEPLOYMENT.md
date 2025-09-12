# Vercel 部署指南

## 项目概述

这是一个景点预订管理系统，包含前端 React 应用和后端 Node.js API。本指南将帮助您将前端部署到 Vercel。

## 前端部署到 Vercel

### 1. 准备工作

确保您的代码已经推送到 GitHub 仓库。

### 2. Vercel 部署步骤

#### 方法一：通过 Vercel 网站部署

1. 访问 [Vercel](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "New Project"
4. 选择您的 GitHub 仓库
5. 配置项目设置：
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`

#### 方法二：使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 在项目根目录运行
vercel

# 按照提示配置项目
```

### 3. 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

```
VITE_API_BASE_URL=https://your-backend-api.vercel.app/api
VITE_APP_TITLE=景点预订管理系统
VITE_APP_VERSION=1.0.0
```

### 4. 自定义域名（可选）

1. 在 Vercel 项目设置中点击 "Domains"
2. 添加您的自定义域名
3. 按照提示配置 DNS 记录

## 后端部署

由于 Vercel 主要用于前端和无服务器函数，建议将后端部署到以下平台之一：

- **Railway**: 适合 Node.js 应用
- **Render**: 免费层支持
- **Heroku**: 经典选择
- **DigitalOcean App Platform**: 性价比高

## 项目结构

```
├── frontend/          # React 前端应用
│   ├── src/
│   ├── dist/          # 构建输出目录
│   ├── package.json
│   └── .env.production
├── backend/           # Node.js 后端 API
├── vercel.json        # Vercel 配置文件
└── README.md
```

## 配置文件说明

### vercel.json

```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm ci && npm run build",
  "outputDirectory": "frontend/dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### .env.production

```env
VITE_API_BASE_URL=https://your-backend-api.vercel.app/api
VITE_APP_TITLE=景点预订管理系统
VITE_APP_VERSION=1.0.0
```

## 常见问题

### 1. 构建失败

- 检查 Node.js 版本兼容性
- 确保所有依赖都在 package.json 中
- 检查 TypeScript 类型错误

### 2. API 请求失败

- 确保后端 API 已正确部署
- 检查 CORS 配置
- 验证环境变量设置

### 3. 路由问题

- 确保 vercel.json 中的 rewrites 配置正确
- 检查 React Router 配置

## 部署后验证

1. 访问部署的网站 URL
2. 测试主要功能：
   - 景点列表显示
   - 景点详情页面
   - 订单提交功能
   - 管理后台登录

## 监控和维护

- 使用 Vercel Analytics 监控网站性能
- 设置部署通知
- 定期检查依赖更新
- 监控 API 响应时间

## 支持

如果遇到问题，请检查：
- [Vercel 文档](https://vercel.com/docs)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- 项目的 GitHub Issues