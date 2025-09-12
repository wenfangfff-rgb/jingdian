#!/usr/bin/env node

/**
 * API 连接测试脚本
 * 使用方法：node test-api.js <backend-url>
 * 示例：node test-api.js https://scenic-booking.up.railway.app
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// 测试配置
const TEST_CONFIG = {
  timeout: 10000,
  adminCredentials: {
    username: 'admin',
    password: 'admin123' // 请根据实际配置修改
  }
};

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'API-Test-Script/1.0',
        ...options.headers
      },
      timeout: TEST_CONFIG.timeout
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

async function testEndpoint(name, url, expectedStatus = 200, options = {}) {
  try {
    log(`\n🧪 测试: ${name}`, 'blue');
    log(`📡 URL: ${url}`, 'yellow');
    
    const response = await makeRequest(url, options);
    
    if (response.statusCode === expectedStatus) {
      log(`✅ 成功 - 状态码: ${response.statusCode}`, 'green');
      if (response.data && typeof response.data === 'object') {
        log(`📄 响应数据: ${JSON.stringify(response.data, null, 2).substring(0, 200)}...`, 'reset');
      }
      return { success: true, response };
    } else {
      log(`❌ 失败 - 期望状态码: ${expectedStatus}, 实际: ${response.statusCode}`, 'red');
      log(`📄 响应: ${JSON.stringify(response.data, null, 2)}`, 'red');
      return { success: false, response };
    }
  } catch (error) {
    log(`❌ 错误: ${error.message}`, 'red');
    return { success: false, error };
  }
}

async function runTests(baseUrl) {
  const apiUrl = baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
  
  log(`${colors.bold}🚀 开始 API 测试${colors.reset}`);
  log(`🔗 后端地址: ${apiUrl}\n`, 'blue');
  
  const results = [];
  
  // 1. 健康检查
  results.push(await testEndpoint(
    '健康检查',
    `${apiUrl}/health`
  ));
  
  // 2. 获取景点列表
  results.push(await testEndpoint(
    '获取景点列表',
    `${apiUrl}/scenic-spots`
  ));
  
  // 3. 获取单个景点详情（假设存在 ID 为 1 的景点）
  results.push(await testEndpoint(
    '获取景点详情',
    `${apiUrl}/scenic-spots/1`,
    200 // 如果不存在会返回 404，这是正常的
  ));
  
  // 4. 管理员登录测试
  results.push(await testEndpoint(
    '管理员登录',
    `${apiUrl}/auth/login`,
    200,
    {
      method: 'POST',
      body: TEST_CONFIG.adminCredentials
    }
  ));
  
  // 5. 获取订单列表（需要认证，可能返回 401）
  results.push(await testEndpoint(
    '获取订单列表',
    `${apiUrl}/orders`,
    200 // 可能返回 401，这是正常的
  ));
  
  // 6. CORS 预检请求测试
  results.push(await testEndpoint(
    'CORS 预检请求',
    `${apiUrl}/scenic-spots`,
    200,
    {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://your-frontend-domain.vercel.app',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    }
  ));
  
  // 测试结果统计
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  log(`\n${colors.bold}📊 测试结果统计${colors.reset}`);
  log(`✅ 成功: ${successCount}/${totalCount}`, successCount === totalCount ? 'green' : 'yellow');
  log(`❌ 失败: ${totalCount - successCount}/${totalCount}`, totalCount - successCount === 0 ? 'green' : 'red');
  
  if (successCount === totalCount) {
    log(`\n🎉 所有测试通过！后端 API 运行正常。`, 'green');
  } else {
    log(`\n⚠️  部分测试失败，请检查后端配置和运行状态。`, 'yellow');
  }
  
  // 提供后续建议
  log(`\n${colors.bold}📋 后续步骤建议:${colors.reset}`);
  log(`1. 如果健康检查失败，请检查后端是否正常运行`);
  log(`2. 如果 CORS 测试失败，请检查后端 CORS 配置`);
  log(`3. 如果登录失败，请检查管理员账号密码配置`);
  log(`4. 更新前端环境变量: VITE_API_BASE_URL=${apiUrl}`);
  log(`5. 在 Vercel 中配置相同的环境变量`);
  log(`6. 重新部署前端应用`);
  
  return {
    success: successCount === totalCount,
    results,
    apiUrl
  };
}

// 主函数
async function main() {
  const backendUrl = process.argv[2];
  
  if (!backendUrl) {
    log('📖 使用方法:', 'yellow');
    log('node test-api.js <backend-url>');
    log('\n📝 示例:', 'yellow');
    log('node test-api.js https://scenic-booking.up.railway.app');
    log('node test-api.js https://scenic-booking.onrender.com');
    process.exit(1);
  }
  
  if (!backendUrl.startsWith('http')) {
    log('❌ 错误: URL 必须以 http:// 或 https:// 开头', 'red');
    process.exit(1);
  }
  
  try {
    const testResult = await runTests(backendUrl);
    process.exit(testResult.success ? 0 : 1);
  } catch (error) {
    log(`❌ 测试过程中发生错误: ${error.message}`, 'red');
    process.exit(1);
  }
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = { runTests, testEndpoint };