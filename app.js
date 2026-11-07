#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const tmpPath = require('os').tmpdir()

async function start() {
  // 检测是否存在 anonymous_token 文件,没有则生成
  const tokenPath = path.resolve(tmpPath, 'anonymous_token')
  if (!fs.existsSync(tokenPath)) {
    fs.writeFileSync(tokenPath, '', 'utf-8')
  }

  // 启动时更新 anonymous_token
  const generateConfig = require('./generateConfig')
  try {
    await generateConfig()
  } catch (err) {
    console.error('生成配置失败 (可能是云环境网络延迟):', err.message)
  }

  // 显式读取环境变量，强制使用 9000 端口和 0.0.0.0 Host
  const port = parseInt(process.env.PORT || process.env.FC_SERVER_PORT || '9000', 10)
  const host = process.env.HOST || '0.0.0.0'

  console.log(`[启动] 正在启动网易云 API，监听地址: http://${host}:${port}`)

  // 启动服务，显式传入配置
  require('./server').serveNcmApi({
    checkVersion: true,
    port: port,
    host: host
  })
}

start()
