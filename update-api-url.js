#!/usr/bin/env node

/**
 * 更新前端 API 端点配置脚本
 * 使用方法：node update-api-url.js <backend-url>
 * 示例：node update-api-url.js https://scenic-booking.up.railway.app
 */

const fs = require('fs');
const path = require('path');

function updateApiUrl(backendUrl) {
  // 确保 URL 格式正确
  const apiUrl = backendUrl.endsWith('/api') ? backendUrl : `${backendUrl}/api`;
  
  // 读取当前的 .env.production 文件
  const envPath = path.join(__dirname, 'frontend', '.env.production');
  
  try {
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // 更新 API URL
    envContent = envContent.replace(
      /VITE_API_BASE_URL=.*/,
      `VITE_API_BASE_URL=${apiUrl}`
    );
    
    // 写回文件
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ API URL 更新成功!');
    console.log(`🔗 新的 API 地址: ${apiUrl}`);
    console.log('\n📋 下一步操作:');
    console.log('1. 在 Vercel 项目设置中更新环境变量');
    console.log('2. 重新部署前端项目');
    console.log('3. 测试前后端连接');
    
  } catch (error) {
    console.error('❌ 更新失败:', error.message);
    process.exit(1);
  }
}

// 获取命令行参数
const backendUrl = process.argv[2];

if (!backendUrl) {
  console.log('📖 使用方法:');
  console.log('node update-api-url.js <backend-url>');
  console.log('\n📝 示例:');
  console.log('node update-api-url.js https://scenic-booking.up.railway.app');
  console.log('node update-api-url.js https://scenic-booking.onrender.com');
  process.exit(1);
}

// 验证 URL 格式
if (!backendUrl.startsWith('http')) {
  console.error('❌ 错误: URL 必须以 http:// 或 https:// 开头');
  process.exit(1);
}

updateApiUrl(backendUrl);