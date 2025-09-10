#!/bin/bash

# 景点预订网站部署脚本
# 适用于 Trae 平台部署

set -e

echo "🚀 开始部署景点预订网站..."

# 检查必要文件
if [ ! -f "Dockerfile" ]; then
    echo "❌ 错误: 找不到 Dockerfile"
    exit 1
fi

if [ ! -f "docker-compose.yml" ]; then
    echo "❌ 错误: 找不到 docker-compose.yml"
    exit 1
fi

# 停止现有容器
echo "🛑 停止现有容器..."
docker-compose down --remove-orphans || true

# 清理旧镜像
echo "🧹 清理旧镜像..."
docker system prune -f

# 构建新镜像
echo "🔨 构建应用镜像..."
docker-compose build --no-cache

# 启动服务
echo "🚀 启动服务..."
docker-compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 30

# 健康检查
echo "🔍 检查服务状态..."
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ 部署成功！"
    echo "📱 应用访问地址: http://localhost:3000"
    echo "🔧 管理后台: http://localhost:3000/admin"
    echo "👤 管理员账号: admin / admin123"
else
    echo "❌ 部署失败，服务未正常启动"
    echo "📋 查看日志:"
    docker-compose logs --tail=50
    exit 1
fi

echo "🎉 部署完成！"