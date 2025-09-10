# 景点预订网站

一个基于 React + Node.js 的现代化景点预订管理系统。

## 功能特性

### 前台功能
- 🏞️ 景点展示和搜索
- 🔍 分类筛选和价格排序
- 📱 响应式设计，支持移动端
- 🛒 在线预订和表单提交
- 📋 订单信息管理

### 后台管理
- 🔐 管理员登录认证
- 📝 景点信息管理（增删改查）
- 🖼️ 图片上传和管理
- 📊 订单数据查看和导出
- 🔍 数据搜索和筛选

## 技术栈

### 前端
- React 18 + TypeScript
- Ant Design UI 组件库
- React Router 路由管理
- Axios HTTP 客户端
- Vite 构建工具

### 后端
- Node.js + Express
- JWT 身份认证
- Multer 文件上传
- JSON 文件数据存储
- CORS 跨域支持

## 快速开始

### 开发环境

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd scenic-spot-booking
   ```

2. **安装依赖**
   ```bash
   # 安装前端依赖
   cd frontend
   npm install
   
   # 安装后端依赖
   cd ../backend
   npm install
   ```

3. **启动开发服务器**
   ```bash
   # 启动后端服务器（端口3000）
   cd backend
   npm run dev
   
   # 启动前端服务器（端口5173）
   cd ../frontend
   npm run dev
   ```

4. **访问应用**
   - 前台：http://localhost:5173
   - 后台：http://localhost:5173/admin
   - API：http://localhost:3000/api

### 生产环境部署

#### 方式一：Docker 部署（推荐）

1. **确保安装 Docker**
   - Windows: 安装 Docker Desktop
   - Linux: 安装 Docker 和 Docker Compose

2. **运行部署脚本**
   ```bash
   # Windows
   deploy.bat
   
   # Linux/Mac
   chmod +x deploy.sh
   ./deploy.sh
   ```

3. **访问应用**
   - 应用地址：http://localhost:3000
   - 管理后台：http://localhost:3000/admin

#### 方式二：手动部署

1. **构建前端**
   ```bash
   cd frontend
   npm run build
   ```

2. **复制构建产物**
   ```bash
   cp -r frontend/dist backend/public
   ```

3. **启动后端**
   ```bash
   cd backend
   NODE_ENV=production npm start
   ```

## 配置说明

### 环境变量

后端环境变量配置（`.env` 文件）：

```env
# 服务器配置
PORT=3000
NODE_ENV=production

# JWT配置
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# 管理员账号
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# 文件上传
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads
```

### 默认管理员账号
- 用户名：`admin`
- 密码：`admin123`

**⚠️ 生产环境请务必修改默认密码！**

## 项目结构

```
景点预订网站/
├── frontend/                 # 前端代码
│   ├── src/
│   │   ├── components/       # 公共组件
│   │   ├── pages/           # 页面组件
│   │   ├── services/        # API服务
│   │   ├── types/           # TypeScript类型
│   │   └── utils/           # 工具函数
│   └── package.json
├── backend/                  # 后端代码
│   ├── src/
│   │   └── app.js          # 应用入口
│   ├── routes/             # 路由定义
│   ├── controllers/        # 控制器
│   ├── middleware/         # 中间件
│   ├── models/             # 数据模型
│   ├── data/               # 数据文件
│   └── uploads/            # 上传文件
├── Dockerfile              # Docker配置
├── docker-compose.yml      # Docker Compose配置
├── deploy.sh              # Linux部署脚本
├── deploy.bat             # Windows部署脚本
└── README.md              # 项目说明
```

## API 接口

### 景点接口
- `GET /api/scenic-spots` - 获取景点列表
- `GET /api/scenic-spots/:id` - 获取景点详情

### 订单接口
- `POST /api/orders` - 创建订单
- `GET /api/orders` - 获取订单列表（需认证）

### 管理接口
- `POST /api/auth/login` - 管理员登录
- `POST /api/admin/scenic-spots` - 添加景点（需认证）
- `PUT /api/admin/scenic-spots/:id` - 更新景点（需认证）
- `DELETE /api/admin/scenic-spots/:id` - 删除景点（需认证）

## 部署到云平台

### Trae 平台部署

1. 将项目代码推送到 Git 仓库
2. 在 Trae 平台创建新应用
3. 选择 Docker 部署方式
4. 配置环境变量
5. 部署应用

### 其他云平台

- **Vercel**: 适合前端静态部署
- **Heroku**: 支持全栈应用部署
- **阿里云/腾讯云**: 使用云服务器部署

## 常见问题

### Q: 页面显示空白？
A: 检查前后端端口配置是否一致，确保API能正常访问。

### Q: 图片上传失败？
A: 检查 `uploads` 目录权限，确保应用有写入权限。

### Q: 管理员登录失败？
A: 检查用户名密码是否正确，默认为 `admin/admin123`。

## 开发指南

### 添加新功能
1. 后端：在 `routes/` 中添加路由，在 `controllers/` 中实现逻辑
2. 前端：在 `pages/` 中添加页面，在 `services/` 中添加API调用

### 数据存储
项目使用 JSON 文件存储数据，生产环境建议迁移到数据库（MySQL、MongoDB等）。

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交 Issue 或 Pull Request。