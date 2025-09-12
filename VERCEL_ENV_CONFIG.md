# Vercel 环境变量配置指南

## 概述

本指南将帮助您在 Vercel 中正确配置环境变量，确保前端应用能够正确连接到后端 API。

## 配置步骤

### 1. 访问 Vercel 项目设置

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择您的项目
3. 点击 "Settings" 标签
4. 在左侧菜单中选择 "Environment Variables"

### 2. 添加环境变量

点击 "Add New" 按钮，逐一添加以下环境变量：

#### 必需的环境变量

| 变量名 | 值 | 环境 | 说明 |
|--------|----|----- |------|
| `VITE_API_BASE_URL` | `https://your-backend-url.com/api` | Production, Preview, Development | 后端 API 基础地址 |
| `VITE_APP_TITLE` | `景点预订管理系统` | Production, Preview, Development | 应用标题 |
| `VITE_APP_VERSION` | `1.0.0` | Production, Preview, Development | 应用版本 |

#### 可选的环境变量

| 变量名 | 值 | 环境 | 说明 |
|--------|----|----- |------|
| `VITE_APP_DESCRIPTION` | `专业的景点预订和管理平台` | Production, Preview, Development | 应用描述 |
| `VITE_API_TIMEOUT` | `10000` | Production, Preview, Development | API 请求超时时间（毫秒） |
| `VITE_REQUEST_RETRY_COUNT` | `3` | Production, Preview, Development | 请求重试次数 |
| `VITE_ENABLE_ANALYTICS` | `true` | Production | 启用分析功能 |
| `VITE_ENABLE_ERROR_REPORTING` | `true` | Production | 启用错误报告 |

### 3. 环境选择说明

- **Production**: 生产环境，用户访问的正式版本
- **Preview**: 预览环境，用于测试分支部署
- **Development**: 开发环境，本地开发时使用

建议所有变量都添加到三个环境中，确保一致性。

### 4. 后端 URL 配置示例

根据您选择的后端部署平台，`VITE_API_BASE_URL` 的值应该是：

#### Railway 部署
```
VITE_API_BASE_URL = https://your-app-name.up.railway.app/api
```

#### Render 部署
```
VITE_API_BASE_URL = https://your-app-name.onrender.com/api
```

#### 其他平台
```
VITE_API_BASE_URL = https://your-custom-domain.com/api
```

## 配置完成后的操作

### 1. 重新部署

环境变量配置完成后，需要触发重新部署：

1. 在 Vercel 项目页面，点击 "Deployments" 标签
2. 点击最新部署右侧的三个点菜单
3. 选择 "Redeploy"
4. 确认重新部署

### 2. 验证配置

部署完成后，可以通过以下方式验证环境变量是否正确加载：

1. 打开浏览器开发者工具
2. 在 Console 中输入：
   ```javascript
   console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
   console.log('App Title:', import.meta.env.VITE_APP_TITLE);
   ```
3. 检查输出是否与配置的值一致

## 使用 Vercel CLI 配置（可选）

如果您更喜欢使用命令行，可以通过 Vercel CLI 配置环境变量：

### 1. 安装 Vercel CLI

```bash
npm i -g vercel
```

### 2. 登录并链接项目

```bash
vercel login
vercel link
```

### 3. 添加环境变量

```bash
# 添加生产环境变量
vercel env add VITE_API_BASE_URL production
# 输入值：https://your-backend-url.com/api

vercel env add VITE_APP_TITLE production
# 输入值：景点预订管理系统

vercel env add VITE_APP_VERSION production
# 输入值：1.0.0
```

### 4. 查看所有环境变量

```bash
vercel env ls
```

## 环境变量最佳实践

### 1. 安全性
- ✅ 只在环境变量中存储非敏感信息
- ✅ 前端环境变量对用户可见，不要存储密钥
- ❌ 不要在前端环境变量中存储 API 密钥或敏感数据

### 2. 命名规范
- ✅ 使用 `VITE_` 前缀（Vite 要求）
- ✅ 使用大写字母和下划线
- ✅ 使用描述性名称

### 3. 环境一致性
- ✅ 在所有环境中保持变量名一致
- ✅ 为不同环境设置适当的值
- ✅ 定期检查和更新过期的值

## 故障排除

### 问题 1: 环境变量未生效

**症状**: 应用中无法获取环境变量值

**解决方案**:
1. 确认变量名以 `VITE_` 开头
2. 检查是否已重新部署
3. 验证环境变量是否正确添加到对应环境

### 问题 2: API 请求失败

**症状**: 前端无法连接到后端 API

**解决方案**:
1. 检查 `VITE_API_BASE_URL` 是否正确
2. 确认后端服务正在运行
3. 检查 CORS 配置
4. 验证 API 端点是否可访问

### 问题 3: 部署后变量值不正确

**症状**: 部署后环境变量显示旧值

**解决方案**:
1. 清除浏览器缓存
2. 强制刷新页面 (Ctrl+F5)
3. 检查是否在正确的环境中配置了变量

## 快速配置脚本

为了简化配置过程，您可以使用项目根目录下的 `update-api-url.js` 脚本：

```bash
# 更新本地环境变量文件
node update-api-url.js https://your-backend-url.com

# 然后在 Vercel 中手动更新环境变量
```

## 下一步

配置完成后，您可以：

1. ✅ 测试前后端 API 连接
2. ✅ 验证所有功能正常工作
3. ✅ 配置自定义域名（可选）
4. ✅ 设置监控和分析

完成环境变量配置后，您的前端应用就能正确连接到后端 API 了！