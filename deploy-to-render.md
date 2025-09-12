# Render 部署指南

## 问题分析

之前的部署失败是因为 `render.yaml` 配置中的启动命令问题。错误 "Missing parameter name at index 1" 通常是由于：

1. **启动命令路径问题**: 原配置使用了 `cd backend && npm start`，但 Render 不支持在命令中使用 `cd`
2. **环境变量配置**: 某些环境变量可能配置不当
3. **根目录设置**: 需要正确设置 `rootDir` 来指定项目根目录

## 已修复的问题

✅ **render.yaml 配置优化**:
- 移除了启动命令中的 `cd backend &&`
- 正确设置了 `rootDir: backend`
- 简化了构建和启动命令

✅ **环境变量配置**:
- 添加了 `PORT: 10000` (Render 默认端口)
- 设置了生产环境变量
- 配置了管理员账号和JWT密钥

✅ **本地测试通过**:
- 后端服务可以正常启动
- API 端点响应正常

## 部署步骤

### 1. 准备代码

确保所有更改已提交到 Git：

```bash
git add .
git commit -m "Fix Render deployment configuration"
git push origin main
```

### 2. 在 Render 上创建服务

1. 访问 [Render Dashboard](https://dashboard.render.com/)
2. 点击 "New +" → "Web Service"
3. 连接你的 GitHub 仓库
4. 选择正确的分支 (main/master)
5. Render 会自动检测到 `render.yaml` 文件

### 3. 配置检查

Render 会自动使用 `render.yaml` 中的配置：

- **Service Name**: `scenic-spot-booking-backend`
- **Environment**: `node`
- **Build Command**: `npm ci`
- **Start Command**: `npm start`
- **Root Directory**: `backend`

### 4. 环境变量验证

确保以下环境变量已正确设置：

```yaml
NODE_ENV: production
PORT: 10000
JWT_SECRET: (自动生成)
JWT_EXPIRES_IN: 7d
ADMIN_USERNAME: admin
ADMIN_PASSWORD: admin123
MAX_FILE_SIZE: 5242880
UPLOAD_PATH: uploads
DATA_PATH: data
FRONTEND_URL: https://your-frontend-domain.vercel.app
```

### 5. 部署验证

部署成功后，你的后端 URL 将是：
```
https://scenic-spot-booking-backend.onrender.com
```

测试 API 端点：
```bash
# 健康检查
curl https://scenic-spot-booking-backend.onrender.com/api/health

# 获取景点列表
curl https://scenic-spot-booking-backend.onrender.com/api/scenic-spots
```

## 常见问题解决

### 问题 1: 构建失败
**解决方案**: 检查 `package.json` 中的依赖项是否完整

### 问题 2: 启动超时
**解决方案**: 确保应用在 `PORT` 环境变量指定的端口上监听

### 问题 3: 环境变量问题
**解决方案**: 在 Render 控制台手动添加缺失的环境变量

### 问题 4: 文件上传路径
**解决方案**: Render 的文件系统是只读的，上传功能需要使用云存储服务

## 部署后的下一步

1. **更新前端配置**: 将后端 URL 更新到前端环境变量中
2. **配置自定义域名**: 在 Render 控制台添加自定义域名
3. **设置监控**: 配置健康检查和日志监控
4. **安全加固**: 更改默认管理员密码

## 快速部署脚本

运行 `deploy-render.bat` 来快速提交和推送代码：

```bash
./deploy-render.bat
```

## 安全建议

⚠️ **重要**: 部署成功后，请立即：

1. 在 Render 控制台更改 `ADMIN_PASSWORD`
2. 设置强密码策略
3. 配置 HTTPS 重定向
4. 启用访问日志

---

**预期部署 URL**: `https://scenic-spot-booking-backend.onrender.com`

部署完成后，请使用此 URL 更新前端配置文件。