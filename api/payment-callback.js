/**
 * 码支付回调接口
 * 
 * 流程：
 * 1. 用户扫码支付 → 码支付平台处理
 * 2. 码支付调用此接口通知支付结果
 * 3. 验证签名确保来自码支付
 * 4. 记录订单，发送激活码
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// CORS 响应头
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// 生成随机激活码
function generateActivationCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'HORSE-2026-';
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (i < 3) code += '-';
  }
  return code;
}

// 计算签名（验证来源）
function calculateSign(data, secret) {
  // 签名算法：MD5(参数1参数2...密钥)
  const signStr = `${data.pay_id}${data.price}${data.type}${secret}`;
  return crypto.createHash('md5').update(signStr).digest('hex');
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);

  // 处理 OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只接受 POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // ===== 第1步：获取码支付的回调数据 =====
    const callbackData = req.body;
    console.log('[回调] 收到码支付回调:', callbackData);

    // 码支付回调字段说明：
    // pay_id: 订单号
    // price: 支付金额
    // type: 支付类型（1=支付宝，2=微信）
    // status: 支付状态（1=已支付）
    // sign: 签名（用于验证）

    // ===== 第2步：验证签名（防伪） =====
    const SECRET = process.env.MERCHANT_SECRET;
    const receivedSign = callbackData.sign;
    const expectedSign = calculateSign(callbackData, SECRET);

    if (receivedSign !== expectedSign) {
      console.error('[回调] 签名验证失败！');
      console.error('[回调] 期望签名:', expectedSign);
      console.error('[回调] 收到签名:', receivedSign);
      return res.status(403).json({
        success: false,
        error: '签名验证失败'
      });
    }

    console.log('[回调] ✓ 签名验证成功');

    // ===== 第3步：验证支付状态 =====
    if (callbackData.status !== '1' && callbackData.status !== 1) {
      console.log('[回调] 支付未完成，状态:', callbackData.status);
      return res.status(400).json({
        success: false,
        error: '支付未完成'
      });
    }

    console.log('[回调] ✓ 支付已完成');

    // ===== 第4步：生成激活码 =====
    const activationCode = generateActivationCode();
    console.log('[回调] 生成激活码:', activationCode);

    // ===== 第5步：保存订单数据 =====
    const orderData = {
      order_id: callbackData.pay_id,
      price: callbackData.price,
      type: callbackData.type === 1 ? '支付宝' : '微信',
      activation_code: activationCode,
      customer_name: callbackData.customer_name || '未知',
      customer_phone: callbackData.customer_phone || '未知',
      paid_at: new Date().toISOString(),
      status: 'paid'
    };

    // 这里应该保存到数据库（MongoDB/阿里云）
    // 现在临时保存到文件（演示）
    const ordersFile = path.join(__dirname, '../orders.json');
    let orders = [];
    
    try {
      if (fs.existsSync(ordersFile)) {
        const fileContent = fs.readFileSync(ordersFile, 'utf-8');
        orders = JSON.parse(fileContent);
      }
    } catch (e) {
      console.log('[回调] 订单文件创建中...');
    }

    orders.push(orderData);
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
    console.log('[回调] ✓ 订单已保存');

    // ===== 第6步：返回成功状态 =====
    // 重要！必须返回特定格式，码支付才会认为回调成功
    return res.status(200).json({
      success: true,
      order_id: callbackData.pay_id,
      activation_code: activationCode,
      message: '支付验证成功，激活码已生成'
    });

  } catch (error) {
    console.error('[回调] 错误:', error);
    return res.status(500).json({
      success: false,
      error: error.message || '服务器错误'
    });
  }
};

