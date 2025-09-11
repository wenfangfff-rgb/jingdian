# 多阶段构建 - 前端构建阶段
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# 后端运行阶段
FROM node:18-alpine AS production
WORKDIR /app

# 安装后端依赖
COPY backend/package*.json ./
RUN npm ci

# 复制后端代码
COPY backend/ ./

# 复制前端构建产物
COPY --from=frontend-build /app/frontend/dist ./public

# 创建必要的目录
RUN mkdir -p uploads data

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "src/app.js"]