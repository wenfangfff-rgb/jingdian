# 后端部署指南

## 概述

本指南将帮助您将景点预订系统的后端 API 部署到云平台。我们提供了两个推荐的部署选项：Railway 和 Render。

## 选项 1: Railway 部署（推荐）

### 优势
- 简单易用的界面
- 自动 HTTPS
- 良好的免费额度
- 支持环境变量管理

### 部署步骤

1. **注册 Railway 账号**
   - 访问 [railway.app](https://railway.app)
   - 使用 GitHub 账号登录

2. **创建新项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择您的仓库

3. **配置部署设置**
   - Railway 会自动检测到 `railway.toml` 配置文件
   - 根目录设置为 `backend`
   - 构建命令：`npm ci`
   - 启动命令：`npm start`

4. **设置环境变量**
   在 Railway 项目设置中添加以下环境变量：
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-here
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

5. **部署**
   - Railway 会自动开始部署
   - 等待部署完成
   - 获取生成的 URL（格式：`https://your-app-name.up.railway.app`）

## 选项 2: Render 部署

### 优势
- 免费层支持
- 自动 SSL 证书
- 简单的配置文件

### 部署步骤

1. **注册 Render 账号**
   - 访问 [render.com](https://render.com)
   - 使用 GitHub 账号登录

2. **创建 Web Service**
   - 点击 "New +" → "Web Service"
   - 连接您的 GitHub 仓库
   - Render 会自动检测到 `render.yaml` 配置文件

3. **配置设置**
   - Name: `scenic-spot-booking-backend`
   - Environment: `Node`
   - Build Command: `cd backend && npm ci`
   - Start Command: `cd backend && npm start`

4. **设置环境变量**
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-here
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

5. **部署**
   - 点击 "Create Web Service"
   - 等待部署完成
   - 获取生成的 URL（格式：`https://your-app-name.onrender.com`）

## 部署后配置

### 1. 测试 API 端点

部署完成后，测试以下端点：

```bash
# 健康检查
curl https://your-backend-url.com/api/health

# 获取景点列表
curl https://your-backend-url.com/api/scenic-spots

# 管理员登录测试
curl -X POST https://your-backend-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'
```

### 2. 更新前端配置

获取后端部署 URL 后，需要更新前端的环境变量：

1. 在 Vercel 项目设置中更新 `VITE_API_BASE_URL`
2. 设置为：`https://your-backend-url.com/api`

### 3. 配置 CORS

确保后端 CORS 配置包含前端域名：

```javascript
// 在 backend/src/app.js 中
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://your-frontend-domain.vercel.app'
  ],
  credentials: true
};
```

## 环境变量说明

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `NODE_ENV` | 运行环境 | `production` |
| `PORT` | 服务端口 | `3000`（自动设置） |
| `JWT_SECRET` | JWT 密钥 | `your-super-secret-key` |
| `JWT_EXPIRES_IN` | JWT 过期时间 | `7d` |
| `ADMIN_USERNAME` | 管理员用户名 | `admin` |
| `ADMIN_PASSWORD` | 管理员密码 | `secure-password` |
| `FRONTEND_URL` | 前端域名 | `https://your-app.vercel.app` |
| `MAX_FILE_SIZE` | 最大文件大小 | `5242880` |
| `UPLOAD_PATH` | 上传路径 | `uploads` |
| `DATA_PATH` | 数据路径 | `data` |

## 故障排除

### 常见问题

1. **部署失败**
   - 检查 `package.json` 中的依赖
   - 确保 Node.js 版本兼容
   - 查看构建日志

2. **API 请求失败**
   - 检查 CORS 配置
   - 验证环境变量设置
   - 确认 API 端点 URL 正确

3. **文件上传问题**
   - 云平台通常不支持持久化文件存储
   - 考虑使用云存储服务（如 AWS S3、Cloudinary）

### 日志查看

**Railway:**
- 在项目面板中点击 "View Logs"

**Render:**
- 在服务面板中点击 "Logs" 标签

## 生产环境优化

### 1. 数据库
- 考虑使用云数据库（MongoDB Atlas、PostgreSQL）
- 当前使用 JSON 文件存储，适合演示

### 2. 文件存储
- 集成云存储服务
- 配置 CDN 加速

### 3. 监控
- 设置健康检查
- 配置错误监控
- 添加性能监控

## 下一步

1. 部署后端到选择的平台
2. 获取后端 URL
3. 更新前端环境变量
4. 测试前后端连接
5. 配置自定义域名（可选）

完成后端部署后，您的景点预订系统就可以完全在云端运行了！