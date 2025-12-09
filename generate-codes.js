/**
 * 激活码生成工具
 * 
 * 使用方法：
 * node generate-codes.js [数量]
 * 
 * 例如：node generate-codes.js 50
 */

// 生成随机字符串
function randomString(length, chars) {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 生成激活码
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 去掉容易混淆的 I, O, 0, 1
  const part1 = 'HORSE';  // 固定前缀（马）
  const part2 = '2026';   // 年份
  const part3 = randomString(4, chars);
  const part4 = randomString(4, chars);
  return `${part1}-${part2}-${part3}-${part4}`;
}

// 主函数
function main() {
  const count = parseInt(process.argv[2]) || 10;
  
  console.log(`\n🐴 马钞预约助手 - 激活码生成器\n`);
  console.log(`生成 ${count} 个激活码...\n`);
  console.log('═'.repeat(50));
  
  const codes = {};
  const codeList = [];
  
  for (let i = 0; i < count; i++) {
    let code;
    // 确保不重复
    do {
      code = generateCode();
    } while (codes[code]);
    
    codes[code] = {
      createdAt: new Date().toISOString(),
      index: i + 1
    };
    codeList.push(code);
    console.log(`${String(i + 1).padStart(3, ' ')}. ${code}`);
  }
  
  console.log('═'.repeat(50));
  console.log(`\n✅ 生成完成！共 ${count} 个激活码\n`);
  
  // 输出 JSON 格式（用于初始化 JSONBin）
  const jsonData = {
    codes: codes,
    usedCodes: {},
    createdAt: new Date().toISOString(),
    totalCount: count
  };
  
  console.log('\n📋 JSONBin 初始化数据（复制以下内容）：\n');
  console.log(JSON.stringify(jsonData, null, 2));
  
  // 保存到文件
  const fs = require('fs');
  const filename = `codes_${new Date().toISOString().slice(0,10)}.json`;
  fs.writeFileSync(filename, JSON.stringify(jsonData, null, 2));
  console.log(`\n💾 已保存到文件: ${filename}`);
  
  // 输出激活码列表（便于复制给用户）
  const listFilename = `codes_list_${new Date().toISOString().slice(0,10)}.txt`;
  fs.writeFileSync(listFilename, codeList.join('\n'));
  console.log(`📝 激活码列表已保存到: ${listFilename}\n`);
}

main();

