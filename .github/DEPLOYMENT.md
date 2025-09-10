# GitHub Actions 部署配置说明

本文档说明如何使用 GitHub Actions 自动部署项目到 Trae 平台。

## 前置要求

1. GitHub 仓库已启用 Actions
2. 拥有 Trae 平台账号和 API 密钥
3. GitHub Container Registry (ghcr.io) 访问权限（自动配置）

## GitHub Secrets 设置

在 GitHub 仓库的 Settings > Secrets and variables > Actions 中添加以下 Secrets：

### 必需的 Secrets

- `TRAE_API_KEY`: Trae 平台 API 密钥
- `TRAE_APP_NAME`: 应用名称（可选，默认使用仓库名）

### 应用配置 Secrets（可选）

- `JWT_SECRET`: JWT 密钥（建议使用强随机字符串）
- `ADMIN_USERNAME`: 管理员用户名
- `ADMIN_PASSWORD`: 管理员密码

### 注意事项

- 新版本脚本使用 GitHub Container Registry (ghcr.io)，无需额外配置镜像仓库
- `GITHUB_TOKEN` 会自动提供，无需手动设置
- 如果不设置 `TRAE_APP_NAME`，将使用 GitHub 仓库名作为应用名

## 2. 获取 Trae API 密钥

1. 登录 Trae 平台控制台
2. 进入 "设置" > "API 密钥"
3. 点击 "创建新密钥"
4. 复制生成的密钥到 GitHub Secrets 中的 `TRAE_API_KEY`

## 3. 配置容器镜像仓库

### 使用 Trae 内置镜像仓库
```
REGISTRY_URL=registry.trae.app
REGISTRY_USERNAME=your-trae-username
REGISTRY_PASSWORD=your-trae-password
```

### 使用 Docker Hub
```
REGISTRY_URL=docker.io
REGISTRY_USERNAME=your-dockerhub-username
REGISTRY_PASSWORD=your-dockerhub-token
```

### 使用 GitHub Container Registry
```
REGISTRY_URL=ghcr.io
REGISTRY_USERNAME=your-github-username
REGISTRY_PASSWORD=your-github-token
```

## 4. 部署流程

当代码推送到 `main` 或 `master` 分支时，GitHub Actions 会自动：

1. ✅ 检出代码
2. ✅ 安装 Node.js 和依赖
3. ✅ 构建前端应用
4. ✅ 运行测试（如果存在）
5. ✅ 构建 Docker 镜像
6. ✅ 推送镜像到容器仓库
7. ✅ 部署到 Trae 平台

## 5. 监控部署状态

- 在 GitHub 仓库的 "Actions" 标签页查看构建状态
- 在 Trae 平台控制台查看应用运行状态
- 通过应用域名访问部署的网站

## 6. 环境变量说明

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `NODE_ENV` | 运行环境 | `production` |
| `PORT` | 应用端口 | `3000` |
| `JWT_SECRET` | JWT 加密密钥 | 需要设置 |
| `ADMIN_USERNAME` | 管理员用户名 | `admin` |
| `ADMIN_PASSWORD` | 管理员密码 | 需要设置 |

## 7. 故障排除

### 构建失败
- 检查 Node.js 版本兼容性
- 确认所有依赖都在 package.json 中
- 查看 Actions 日志中的错误信息

### 部署失败
- 验证 Trae API 密钥是否正确
- 检查镜像仓库凭据
- 确认应用配置是否正确

### 应用无法访问
- 检查健康检查端点 `/api/health`
- 验证环境变量配置
- 查看 Trae 平台的应用日志

## 8. 手动部署

如需手动触发部署，可以：

1. 在 GitHub 仓库的 "Actions" 页面
2. 选择 "Deploy to Trae" workflow
3. 点击 "Run workflow" 按钮

## 9. 回滚操作

如果新版本有问题，可以在 Trae 平台控制台：

1. 进入应用详情页
2. 选择 "部署历史"
3. 点击之前版本的 "回滚" 按钮