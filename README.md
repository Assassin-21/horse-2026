# 🐴 马钞预约助手 - 激活码服务端

## 📁 文件说明

```
激活码服务端/
├── api/
│   └── verify.js           # API 处理函数（Vercel Serverless）
├── package.json            # 项目配置
├── vercel.json             # Vercel 部署配置
├── generate-codes.js       # 激活码生成工具
├── test-local.js           # 本地测试脚本（逻辑测试）
├── test-api.js             # API 测试脚本（需要 node-fetch）
├── test-api.html           # 浏览器测试页面（推荐）
├── codes_*.json            # 生成的激活码数据
├── codes_list_*.txt        # 激活码列表（便于复制）
├── 部署说明.md             # 详细部署说明
├── 快速部署指南.md         # 快速部署步骤
└── README.md               # 本文件
```

---

## ✅ 已完成

- [x] 激活码生成工具
- [x] API 验证逻辑
- [x] 本地测试脚本
- [x] 浏览器测试页面
- [x] 部署配置
- [x] 快速部署指南

---

## 🚀 快速开始

### 1. 生成激活码

```bash
node generate-codes.js 50
```

### 2. 本地测试逻辑

```bash
node test-local.js
```

### 3. 部署到 Vercel

参考 `快速部署指南.md`

### 4. 测试 API

打开 `test-api.html`，输入你的 API 地址进行测试

---

## 📋 测试激活码

已生成的测试激活码（见 `codes_list_2025-12-09.txt`）：

```
HORSE-2026-L273-MXR5
HORSE-2026-T3W4-PA9P
HORSE-2026-7QB9-2GEF
...
```

---

## 🔧 API 接口

### POST /api/verify

**请求：**
```json
{
  "code": "HORSE-2026-XXXX-XXXX",
  "action": "activate",  // "activate" 或 "verify"
  "deviceId": "设备ID"   // 可选
}
```

**响应：**
```json
{
  "success": true,
  "message": "激活成功！",
  "code": "ACTIVATED"
}
```

---

## 📞 下一步

1. 按照 `快速部署指南.md` 部署到 Vercel
2. 测试 API 功能
3. 更新插件代码中的 API 地址
4. 将 `SKIP_ACTIVATION` 改为 `false`

