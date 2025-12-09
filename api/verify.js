/**
 * 激活码验证 API
 * 
 * 使用 JSONBin.io 作为免费存储
 * 你需要在 https://jsonbin.io 注册并创建一个 Bin
 */

// 环境变量配置（在 Vercel 中设置）
const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID;  // JSONBin 的 Bin ID
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY; // JSONBin 的 API Key

// 如果没有配置外部存储，使用内存存储（仅用于测试，重启后会丢失）
let memoryStore = {
  codes: {},
  usedCodes: {}
};

/**
 * 从 JSONBin 获取数据
 */
async function getData() {
  if (!JSONBIN_BIN_ID || !JSONBIN_API_KEY) {
    // 没有配置外部存储，使用内存
    return memoryStore;
  }
  
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
      headers: {
        'X-Master-Key': JSONBIN_API_KEY
      }
    });
    const result = await response.json();
    return result.record || { codes: {}, usedCodes: {} };
  } catch (e) {
    console.error('获取数据失败:', e);
    return { codes: {}, usedCodes: {} };
  }
}

/**
 * 保存数据到 JSONBin
 */
async function saveData(data) {
  if (!JSONBIN_BIN_ID || !JSONBIN_API_KEY) {
    memoryStore = data;
    return true;
  }
  
  try {
    await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY
      },
      body: JSON.stringify(data)
    });
    return true;
  } catch (e) {
    console.error('保存数据失败:', e);
    return false;
  }
}

/**
 * 主处理函数
 */
export default async function handler(req, res) {
  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // 只接受 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: '请使用 POST 请求' });
  }
  
  try {
    const { code, action, deviceId } = req.body;
    
    if (!code) {
      return res.status(400).json({ success: false, message: '请提供激活码' });
    }
    
    const normalizedCode = code.toUpperCase().trim();
    const data = await getData();
    
    // 检查激活码是否存在
    if (!data.codes[normalizedCode]) {
      return res.status(400).json({ 
        success: false, 
        message: '激活码无效',
        code: 'INVALID_CODE'
      });
    }
    
    // 检查是否已被使用
    if (data.usedCodes[normalizedCode]) {
      const usedInfo = data.usedCodes[normalizedCode];
      
      // 如果是同一设备，允许重复激活
      if (deviceId && usedInfo.deviceId === deviceId) {
        return res.status(200).json({
          success: true,
          message: '激活码有效（已激活）',
          code: 'ALREADY_ACTIVATED',
          activatedAt: usedInfo.activatedAt
        });
      }
      
      return res.status(400).json({
        success: false,
        message: '激活码已被使用',
        code: 'ALREADY_USED',
        usedAt: usedInfo.activatedAt
      });
    }
    
    // 激活
    if (action === 'activate') {
      data.usedCodes[normalizedCode] = {
        activatedAt: new Date().toISOString(),
        deviceId: deviceId || 'unknown',
        ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown'
      };
      
      const saved = await saveData(data);
      
      if (saved) {
        return res.status(200).json({
          success: true,
          message: '激活成功！',
          code: 'ACTIVATED'
        });
      } else {
        return res.status(500).json({
          success: false,
          message: '激活失败，请重试',
          code: 'SAVE_ERROR'
        });
      }
    }
    
    // 仅验证（不激活）
    return res.status(200).json({
      success: true,
      message: '激活码有效',
      code: 'VALID'
    });
    
  } catch (error) {
    console.error('验证错误:', error);
    return res.status(500).json({
      success: false,
      message: '服务器错误',
      code: 'SERVER_ERROR'
    });
  }
}

