/**
 * 码支付 API - 创建支付订单
 * 
 * 此接口负责：
 * 1. 从环境变量获取商户ID和密钥（安全！）
 * 2. 生成签名
 * 3. 调用码支付 API
 * 4. 返回支付链接给前端
 * 
 * 使用方式：
 * POST /api/create-payment
 * Body: { order_id, price, type: 1 }
 */

import crypto from 'crypto';

// CORS 响应头
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  // 设置 CORS
  setCorsHeaders(res);

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只接受 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: '只接受 POST 请求'
    });
  }

  try {
    // ===== 第1步：获取环境变量中的商户信息（关键安全） =====
    const MERCHANT_ID = process.env.MERCHANT_ID;
    const MERCHANT_SECRET = process.env.MERCHANT_SECRET;
    const NOTIFY_URL = process.env.NOTIFY_URL || '';
    const RETURN_URL = process.env.RETURN_URL || '';

    // 验证环境变量是否配置
    if (!MERCHANT_ID || !MERCHANT_SECRET) {
      console.error('环境变量缺失：MERCHANT_ID 或 MERCHANT_SECRET');
      return res.status(500).json({
        success: false,
        error: '服务器配置错误：缺少商户信息'
      });
    }

    // ===== 第2步：验证请求参数 =====
    const { order_id, price, type = 1 } = req.body;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数：order_id'
      });
    }

    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数或价格无效：price'
      });
    }

    // ===== 第3步：生成签名（核心逻辑） =====
    // 签名算法：MD5(商户ID + 订单号 + 金额 + 通知URL + 密钥)
    const signStr = `${MERCHANT_ID}${order_id}${price}${NOTIFY_URL}${MERCHANT_SECRET}`;
    
    console.log(`[支付请求] 订单号: ${order_id}, 金额: ${price}, 商户ID: ${MERCHANT_ID.substring(0, 5)}...`);
    console.log(`[签名] 原文: ${MERCHANT_ID}${order_id}${price}${NOTIFY_URL}[密钥]`);

    const sign = crypto
      .createHash('md5')
      .update(signStr)
      .digest('hex');

    console.log(`[签名] 结果: ${sign}`);

    // ===== 第4步：构建码支付 API 请求 =====
    const paymentData = {
      id: MERCHANT_ID,              // 商户ID
      pay_id: order_id,             // 订单号
      price: String(price),         // 价格（转为字符串）
      notify_url: NOTIFY_URL,       // 异步通知URL
      return_url: RETURN_URL,       // 同步跳转URL
      sign: sign,                   // 签名
      param: '',                    // 自定义参数（可选）
      type: String(type)            // 支付类型：1=支付宝，2=微信
    };

    console.log(`[API请求] 即将调用码支付 API`);
    console.log(`[API请求参数]`, paymentData);

    // ===== 第5步：调用码支付 API =====
    const mzfResponse = await fetch('https://mzf.akwl.net/api.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(paymentData).toString()
    });

    const mzfResult = await mzfResponse.json();

    console.log(`[API响应]`, mzfResult);

    // ===== 第6步：处理码支付的响应 =====
    if (mzfResult.code === 1) {
      // 成功
      console.log(`[支付成功] 订单号: ${order_id}, 支付链接: ${mzfResult.url}`);

      return res.status(200).json({
        success: true,
        order_id: order_id,
        payment_url: mzfResult.url,        // 支付页面链接
        qrcode_url: mzfResult.qrcode || '', // 二维码链接（如果有）
        message: '支付请求成功'
      });
    } else {
      // 失败
      console.error(`[支付失败] 订单号: ${order_id}, 错误: ${mzfResult.msg}`);

      return res.status(400).json({
        success: false,
        error: mzfResult.msg || '码支付 API 返回错误',
        mzf_code: mzfResult.code
      });
    }

  } catch (error) {
    console.error('[错误]', error);
    return res.status(500).json({
      success: false,
      error: error.message || '服务器错误'
    });
  }
}

