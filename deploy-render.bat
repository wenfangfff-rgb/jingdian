@echo off
echo 正在部署到 Render...
echo.
echo 请确保你已经:
echo 1. 在 Render 上创建了新的 Web Service
echo 2. 连接了你的 GitHub 仓库
echo 3. 设置了正确的分支 (通常是 main 或 master)
echo.
echo 部署步骤:
echo 1. 提交当前更改到 Git
echo 2. 推送到 GitHub
echo 3. Render 会自动检测到 render.yaml 并开始部署
echo.
echo 正在提交更改...
git add .
git commit -m "Fix Render deployment configuration"
echo.
echo 正在推送到 GitHub...
git push origin main
echo.
echo 部署完成！请在 Render 控制台查看部署状态。
echo 部署成功后，你的后端 URL 将是: https://scenic-spot-booking-backend.onrender.com
echo.
pause