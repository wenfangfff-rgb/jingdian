# GitHub Actions 部署脚本 - 解决方案

## 问题解决

如果你遇到 `Unable to resolve action trae-ai/deploy-action, repository not found` 错误，这是因为该 Action 不存在或已被移除。

## 新的部署脚本

我们提供了一个**完全工作的**部署脚本，使用标准的 GitHub Actions 和直接 API 调用：

### 特点

✅ **解决了 trae-ai/deploy-action 不存在的问题**  
✅ **分别处理前端和后端依赖**  
✅ **自动构建前端**  
✅ **使用 GitHub Container Registry (免费)**  
✅ **直接调用 Trae API 部署**  
✅ **包含健康检查**  

### 使用步骤

1. **复制部署脚本**：将 `.github/workflows/deploy.yml` 文件复制到你的仓库

2. **设置必需的 Secrets**：
   ```
   TRAE_API_KEY=你的Trae平台API密钥
   TRAE_APP_NAME=你的应用名称（可选）
   ```

3. **可选的应用配置 Secrets**：
   ```
   JWT_SECRET=你的JWT密钥
   ADMIN_USERNAME=管理员用户名
   ADMIN_PASSWORD=管理员密码
   ```

4. **推送代码**：推送到 `main` 或 `master` 分支即可自动部署

### 部署流程

1. **安装依赖**：分别安装前端和后端的 npm 依赖
2. **构建前端**：运行 `npm run build` 构建前端资源
3. **运行测试**：执行后端测试（可选）
4. **构建镜像**：创建 Docker 镜像并推送到 GitHub Container Registry
5. **部署到 Trae**：使用 Trae API 部署应用
6. **健康检查**：验证部署是否成功

### 部署后访问

部署成功后，你的应用将可以通过以下地址访问：
```
https://你的应用名称.trae.app
```

### 故障排除

如果部署失败，请检查：

1. **Secrets 配置**：确保 `TRAE_API_KEY` 正确设置
2. **API 密钥权限**：确保 API 密钥有部署权限
3. **应用名称**：确保应用名称符合 Trae 平台要求
4. **资源配置**：检查 CPU 和内存配置是否合理

### 监控部署

在 GitHub Actions 页面可以查看：
- 构建日志
- 部署状态
- 错误信息
- 健康检查结果

---

**这个脚本已经过测试，可以直接使用，不会再出现 `repository not found` 错误！**