/**
 * 测试部署后的 API
 * 
 * 使用方法：
 * node test-api.js https://your-project.vercel.app
 */

const API_URL = process.argv[2] || 'http://localhost:3000';

console.log('🧪 测试激活码 API');
console.log('API 地址:', API_URL);
console.log('═'.repeat(60));

// 测试激活码
const testCodes = [
  'HORSE-2026-TEST-CODE',
  'HORSE-2026-ABCD-1234',
  'HORSE-2026-INVALID-CODE'
];

async function testAPI() {
  // 测试1: 验证激活码（不激活）
  console.log('\n📋 测试1: 验证激活码（不激活）');
  try {
    const response = await fetch(`${API_URL}/api/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: testCodes[0],
        action: 'verify'
      })
    });
    const result = await response.json();
    console.log('请求:', testCodes[0]);
    console.log('响应:', JSON.stringify(result, null, 2));
    console.log('✅ 通过' + (result.success ? '' : ' ❌ 失败'));
  } catch (e) {
    console.log('❌ 请求失败:', e.message);
  }

  // 测试2: 激活激活码
  console.log('\n📋 测试2: 激活激活码');
  try {
    const deviceId = 'TEST-DEVICE-' + Date.now();
    const response = await fetch(`${API_URL}/api/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: testCodes[0],
        action: 'activate',
        deviceId: deviceId
      })
    });
    const result = await response.json();
    console.log('请求:', testCodes[0], 'deviceId:', deviceId);
    console.log('响应:', JSON.stringify(result, null, 2));
    console.log('✅ 通过' + (result.success && result.code === 'ACTIVATED' ? '' : ' ❌ 失败'));
  } catch (e) {
    console.log('❌ 请求失败:', e.message);
  }

  // 测试3: 无效激活码
  console.log('\n📋 测试3: 无效激活码');
  try {
    const response = await fetch(`${API_URL}/api/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: testCodes[2],
        action: 'activate'
      })
    });
    const result = await response.json();
    console.log('请求:', testCodes[2]);
    console.log('响应:', JSON.stringify(result, null, 2));
    console.log('✅ 通过' + (!result.success && result.code === 'INVALID_CODE' ? '' : ' ❌ 失败'));
  } catch (e) {
    console.log('❌ 请求失败:', e.message);
  }

  console.log('\n═'.repeat(60));
  console.log('✅ 测试完成！\n');
}

// 检查是否安装了 node-fetch
try {
  require('node-fetch');
  testAPI();
} catch (e) {
  console.log('⚠️  需要安装 node-fetch: npm install node-fetch');
  console.log('或者使用浏览器打开 test-api.html 进行测试\n');
}

