/**
 * 本地测试脚本
 * 用于测试激活码验证逻辑（不依赖 Vercel）
 * 
 * 使用方法：
 * node test-local.js
 */

// 模拟激活码数据
const testData = {
  codes: {
    'HORSE-2026-TEST-CODE': {
      createdAt: new Date().toISOString(),
      index: 1
    },
    'HORSE-2026-ABCD-1234': {
      createdAt: new Date().toISOString(),
      index: 2
    }
  },
  usedCodes: {}
};

// 模拟 API 处理函数
function testVerify(code, action, deviceId) {
  const normalizedCode = code.toUpperCase().trim();
  
  // 检查激活码是否存在
  if (!testData.codes[normalizedCode]) {
    return {
      success: false,
      message: '激活码无效',
      code: 'INVALID_CODE'
    };
  }
  
  // 检查是否已被使用
  if (testData.usedCodes[normalizedCode]) {
    const usedInfo = testData.usedCodes[normalizedCode];
    
    // 如果是同一设备，允许重复激活
    if (deviceId && usedInfo.deviceId === deviceId) {
      return {
        success: true,
        message: '激活码有效（已激活）',
        code: 'ALREADY_ACTIVATED',
        activatedAt: usedInfo.activatedAt
      };
    }
    
    return {
      success: false,
      message: '激活码已被使用',
      code: 'ALREADY_USED',
      usedAt: usedInfo.activatedAt
    };
  }
  
  // 激活
  if (action === 'activate') {
    testData.usedCodes[normalizedCode] = {
      activatedAt: new Date().toISOString(),
      deviceId: deviceId || 'unknown'
    };
    
    return {
      success: true,
      message: '激活成功！',
      code: 'ACTIVATED'
    };
  }
  
  // 仅验证（不激活）
  return {
    success: true,
    message: '激活码有效',
    code: 'VALID'
  };
}

// 测试用例
console.log('🧪 激活码服务端 - 本地测试\n');
console.log('═'.repeat(60));

// 测试1: 验证有效激活码
console.log('\n📋 测试1: 验证有效激活码（不激活）');
const result1 = testVerify('HORSE-2026-TEST-CODE', 'verify');
console.log('输入:', 'HORSE-2026-TEST-CODE');
console.log('结果:', JSON.stringify(result1, null, 2));
console.log('预期: success=true, code=VALID');
console.log('✅ 通过' + (result1.success && result1.code === 'VALID' ? '' : ' ❌ 失败'));

// 测试2: 激活有效激活码
console.log('\n📋 测试2: 激活有效激活码');
const deviceId1 = 'DEVICE-001';
const result2 = testVerify('HORSE-2026-TEST-CODE', 'activate', deviceId1);
console.log('输入:', 'HORSE-2026-TEST-CODE', 'deviceId:', deviceId1);
console.log('结果:', JSON.stringify(result2, null, 2));
console.log('预期: success=true, code=ACTIVATED');
console.log('✅ 通过' + (result2.success && result2.code === 'ACTIVATED' ? '' : ' ❌ 失败'));

// 测试3: 同一设备重复激活
console.log('\n📋 测试3: 同一设备重复激活（应该允许）');
const result3 = testVerify('HORSE-2026-TEST-CODE', 'activate', deviceId1);
console.log('输入:', 'HORSE-2026-TEST-CODE', 'deviceId:', deviceId1);
console.log('结果:', JSON.stringify(result3, null, 2));
console.log('预期: success=true, code=ALREADY_ACTIVATED');
console.log('✅ 通过' + (result3.success && result3.code === 'ALREADY_ACTIVATED' ? '' : ' ❌ 失败'));

// 测试4: 不同设备使用已激活的码
console.log('\n📋 测试4: 不同设备使用已激活的码（应该拒绝）');
const deviceId2 = 'DEVICE-002';
const result4 = testVerify('HORSE-2026-TEST-CODE', 'activate', deviceId2);
console.log('输入:', 'HORSE-2026-TEST-CODE', 'deviceId:', deviceId2);
console.log('结果:', JSON.stringify(result4, null, 2));
console.log('预期: success=false, code=ALREADY_USED');
console.log('✅ 通过' + (!result4.success && result4.code === 'ALREADY_USED' ? '' : ' ❌ 失败'));

// 测试5: 无效激活码
console.log('\n📋 测试5: 无效激活码');
const result5 = testVerify('HORSE-2026-INVALID-CODE', 'activate');
console.log('输入:', 'HORSE-2026-INVALID-CODE');
console.log('结果:', JSON.stringify(result5, null, 2));
console.log('预期: success=false, code=INVALID_CODE');
console.log('✅ 通过' + (!result5.success && result5.code === 'INVALID_CODE' ? '' : ' ❌ 失败'));

// 测试6: 激活另一个码
console.log('\n📋 测试6: 激活另一个有效码');
const result6 = testVerify('HORSE-2026-ABCD-1234', 'activate', 'DEVICE-003');
console.log('输入:', 'HORSE-2026-ABCD-1234', 'deviceId:', 'DEVICE-003');
console.log('结果:', JSON.stringify(result6, null, 2));
console.log('预期: success=true, code=ACTIVATED');
console.log('✅ 通过' + (result6.success && result6.code === 'ACTIVATED' ? '' : ' ❌ 失败'));

// 显示最终状态
console.log('\n═'.repeat(60));
console.log('\n📊 最终数据状态:');
console.log('已使用激活码:', Object.keys(testData.usedCodes).length);
console.log('使用记录:', JSON.stringify(testData.usedCodes, null, 2));

console.log('\n✅ 所有测试完成！\n');

