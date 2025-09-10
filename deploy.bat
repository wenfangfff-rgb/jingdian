@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 🚀 开始部署景点预订网站...

REM 检查Docker是否安装
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 请先安装 Docker Desktop
    pause
    exit /b 1
)

REM 检查必要文件
if not exist "Dockerfile" (
    echo ❌ 错误: 找不到 Dockerfile
    pause
    exit /b 1
)

if not exist "docker-compose.yml" (
    echo ❌ 错误: 找不到 docker-compose.yml
    pause
    exit /b 1
)

REM 停止现有容器
echo 🛑 停止现有容器...
docker-compose down --remove-orphans 2>nul

REM 清理旧镜像
echo 🧹 清理旧镜像...
docker system prune -f

REM 构建新镜像
echo 🔨 构建应用镜像...
docker-compose build --no-cache
if errorlevel 1 (
    echo ❌ 构建失败
    pause
    exit /b 1
)

REM 启动服务
echo 🚀 启动服务...
docker-compose up -d
if errorlevel 1 (
    echo ❌ 启动失败
    pause
    exit /b 1
)

REM 等待服务启动
echo ⏳ 等待服务启动...
timeout /t 30 /nobreak >nul

REM 健康检查
echo 🔍 检查服务状态...
curl -f http://localhost:3000/api/health >nul 2>&1
if errorlevel 1 (
    echo ❌ 部署失败，服务未正常启动
    echo 📋 查看日志:
    docker-compose logs --tail=50
    pause
    exit /b 1
)

echo ✅ 部署成功！
echo 📱 应用访问地址: http://localhost:3000
echo 🔧 管理后台: http://localhost:3000/admin
echo 👤 管理员账号: admin / admin123
echo 🎉 部署完成！

pause