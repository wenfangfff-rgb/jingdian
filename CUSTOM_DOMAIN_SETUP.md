# 自定义域名配置指南

## 概述

本指南将帮助您为景点预订系统配置自定义域名，提升品牌形象和用户体验。我们将分别介绍前端（Vercel）和后端（Railway/Render）的域名配置。

## 前端域名配置（Vercel）

### 1. 域名准备

#### 购买域名
推荐的域名注册商：
- **Namecheap**: 价格实惠，管理界面友好
- **GoDaddy**: 知名度高，服务稳定
- **Cloudflare**: 价格透明，集成 CDN
- **阿里云**: 国内用户友好
- **腾讯云**: 国内备案方便

#### 域名建议
- `your-company-booking.com`
- `scenic-spots-booking.com`
- `travel-booking-system.com`
- `your-brand-travel.com`

### 2. 在 Vercel 中添加域名

#### 步骤 1: 访问项目设置
1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择您的前端项目
3. 点击 "Settings" 标签
4. 在左侧菜单选择 "Domains"

#### 步骤 2: 添加自定义域名
1. 在 "Domains" 页面点击 "Add"
2. 输入您的域名（例如：`www.your-domain.com`）
3. 点击 "Add" 确认

#### 步骤 3: 配置 DNS 记录
Vercel 会提供 DNS 配置信息，通常包括：

**A 记录配置**:
```
类型: A
名称: www (或 @)
值: 76.76.19.61
TTL: 3600
```

**CNAME 记录配置**:
```
类型: CNAME
名称: www
值: cname.vercel-dns.com
TTL: 3600
```

### 3. DNS 配置示例

#### Cloudflare 配置
1. 登录 Cloudflare 控制面板
2. 选择您的域名
3. 进入 "DNS" 标签
4. 添加记录：
   ```
   类型: CNAME
   名称: www
   目标: cname.vercel-dns.com
   代理状态: 已代理（橙色云朵）
   ```

#### 阿里云 DNS 配置
1. 登录阿里云控制台
2. 进入 "域名与网站" → "云解析 DNS"
3. 选择域名，点击 "解析设置"
4. 添加记录：
   ```
   记录类型: CNAME
   主机记录: www
   记录值: cname.vercel-dns.com
   TTL: 600
   ```

### 4. SSL 证书配置

Vercel 会自动为您的自定义域名配置 SSL 证书：
- 使用 Let's Encrypt 免费证书
- 自动续期
- 支持通配符证书

等待 DNS 传播完成后（通常 5-30 分钟），SSL 证书会自动生效。

## 后端域名配置

### Railway 域名配置

#### 1. 添加自定义域名
1. 在 Railway 项目面板中点击 "Settings"
2. 选择 "Domains" 标签
3. 点击 "Custom Domain"
4. 输入域名（例如：`api.your-domain.com`）

#### 2. DNS 配置
添加 CNAME 记录：
```
类型: CNAME
名称: api
值: your-app-name.up.railway.app
TTL: 3600
```

### Render 域名配置

#### 1. 添加自定义域名
1. 在 Render 服务面板中点击 "Settings"
2. 滚动到 "Custom Domains" 部分
3. 点击 "Add Custom Domain"
4. 输入域名（例如：`api.your-domain.com`）

#### 2. DNS 配置
添加 CNAME 记录：
```
类型: CNAME
名称: api
值: your-app-name.onrender.com
TTL: 3600
```

## 完整域名架构示例

### 推荐的域名结构
```
https://www.your-domain.com          # 前端主站
https://api.your-domain.com          # 后端 API
https://admin.your-domain.com        # 管理后台（可选）
https://cdn.your-domain.com          # 静态资源（可选）
```

### DNS 记录配置汇总
```
# 前端
www    CNAME    cname.vercel-dns.com
@      A        76.76.19.61

# 后端 API
api    CNAME    your-backend.up.railway.app

# 重定向（可选）
@      CNAME    www.your-domain.com
```

## 更新应用配置

### 1. 更新前端环境变量

在 Vercel 项目设置中更新：
```
VITE_API_BASE_URL=https://api.your-domain.com/api
```

### 2. 更新后端 CORS 配置

在后端代码中更新 CORS 设置：
```javascript
// backend/src/app.js
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://www.your-domain.com',
    'https://your-domain.com'
  ],
  credentials: true
};
```

### 3. 更新后端环境变量

在 Railway/Render 中更新：
```
FRONTEND_URL=https://www.your-domain.com
```

## 域名验证和测试

### 1. DNS 传播检查

使用在线工具检查 DNS 传播状态：
- [DNS Checker](https://dnschecker.org/)
- [What's My DNS](https://www.whatsmydns.net/)
- [DNS Propagation Checker](https://www.dnsmap.io/)

### 2. SSL 证书验证

检查 SSL 证书状态：
- [SSL Labs](https://www.ssllabs.com/ssltest/)
- [SSL Checker](https://www.sslshopper.com/ssl-checker.html)

### 3. 功能测试

```bash
# 测试前端访问
curl -I https://www.your-domain.com

# 测试后端 API
curl https://api.your-domain.com/api/health

# 测试 HTTPS 重定向
curl -I http://www.your-domain.com
```

## 高级配置

### 1. CDN 配置（Cloudflare）

如果使用 Cloudflare 作为 DNS 提供商：

#### 优化设置
1. **Speed** → **Optimization**:
   - Auto Minify: 启用 HTML, CSS, JS
   - Brotli: 启用
   - Early Hints: 启用

2. **Caching** → **Configuration**:
   - Browser Cache TTL: 4 hours
   - Always Online: 启用

3. **Security** → **Settings**:
   - Security Level: Medium
   - Always Use HTTPS: 启用
   - Automatic HTTPS Rewrites: 启用

### 2. 子域名配置

#### 管理后台子域名
如果需要单独的管理后台域名：

1. 在 Vercel 创建新项目或使用子路径
2. 配置 DNS:
   ```
   admin    CNAME    cname.vercel-dns.com
   ```

#### API 版本管理
为不同 API 版本配置子域名：
```
api-v1    CNAME    your-backend-v1.up.railway.app
api-v2    CNAME    your-backend-v2.up.railway.app
```

### 3. 邮箱配置（可选）

配置企业邮箱以匹配域名：
```
# MX 记录
@    MX    10    mail.your-domain.com

# 邮箱服务器（以腾讯企业邮箱为例）
mail    CNAME    mxbiz2.qq.com
```

## 监控和维护

### 1. 域名监控

设置监控服务：
- **UptimeRobot**: 免费的网站监控
- **Pingdom**: 专业的性能监控
- **StatusCake**: 全面的监控解决方案

### 2. SSL 证书监控

- 设置证书到期提醒
- 监控证书链完整性
- 定期检查证书评级

### 3. DNS 健康检查

定期检查：
- DNS 记录正确性
- 解析速度
- 全球可访问性

## 故障排除

### 常见问题

#### 问题 1: 域名无法访问
**可能原因**:
- DNS 记录配置错误
- DNS 传播未完成
- 防火墙阻止访问

**解决方案**:
1. 检查 DNS 记录配置
2. 等待 DNS 传播完成（最多 48 小时）
3. 使用不同网络测试访问

#### 问题 2: SSL 证书错误
**可能原因**:
- 证书未生成
- 域名验证失败
- 证书链不完整

**解决方案**:
1. 等待证书自动生成
2. 检查域名所有权验证
3. 联系平台技术支持

#### 问题 3: API 跨域错误
**可能原因**:
- CORS 配置未更新
- 域名不在白名单中

**解决方案**:
1. 更新后端 CORS 配置
2. 重新部署后端服务
3. 检查环境变量配置

## 成本考虑

### 域名费用
- **.com 域名**: $10-15/年
- **.cn 域名**: ¥29-55/年
- **高级域名**: $20-100+/年

### 额外服务费用
- **Cloudflare Pro**: $20/月（可选）
- **企业邮箱**: $5-10/用户/月（可选）
- **高级监控**: $10-50/月（可选）

## 最佳实践

### 1. 域名选择
- 选择简短、易记的域名
- 避免使用连字符和数字
- 考虑品牌一致性
- 注册多个相关域名保护品牌

### 2. 安全考虑
- 启用域名锁定
- 使用强密码保护域名账户
- 定期更新联系信息
- 设置自动续费

### 3. SEO 优化
- 使用 HTTPS
- 配置正确的重定向
- 设置合适的缓存策略
- 优化页面加载速度

完成自定义域名配置后，您的景点预订系统将拥有专业的品牌形象和更好的用户体验！