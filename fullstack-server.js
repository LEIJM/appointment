import { createServer } from 'vite'
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { spawn } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 创建Express后端服务器
const app = express()
const PORT = process.env.PORT || 3001
const FRONTEND_PORT = process.env.FRONTEND_PORT || 5173

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'))

// 创建上传目录
import fs from 'fs'
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads')
}

// 动态导入后端路由
async function setupBackend() {
  try {
    const { setupRoutes } = await import('./server-routes.js')
    setupRoutes(app)
    console.log('✅ Backend routes loaded successfully')
  } catch (error) {
    console.log('⚠️  Using fallback backend setup')
    // Fallback basic routes
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', message: 'Backend server is running' })
    })
    
    app.get('/api', (req, res) => {
      res.json({ message: 'API server is running' })
    })
  }
}

// 启动后端服务器
async function startBackend() {
  await setupBackend()
  
  return new Promise((resolve) => {
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Backend server running on http://localhost:${PORT}`)
      console.log(`🌐 Backend server accessible on network: http://0.0.0.0:${PORT}`)
      resolve(server)
    })
  })
}

// 启动前端开发服务器
async function startFrontend() {
  console.log('🔄 Starting frontend development server...')
  
  const viteProcess = spawn('node', ['node_modules/vite/bin/vite.js', '--port', FRONTEND_PORT, '--host', '0.0.0.0'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  })
  
  viteProcess.on('error', (error) => {
    console.error('❌ Frontend server error:', error)
  })
  
  viteProcess.on('exit', (code) => {
    if (code !== 0) {
      console.log(`⚠️  Frontend server exited with code ${code}`)
    }
  })
  
  return viteProcess
}

// 主函数
async function main() {
  console.log('🎯 Starting fullstack application...')
  console.log('='.repeat(50))
  
  try {
    // 启动后端服务器
    const backendServer = await startBackend()
    
    // 等待一小段时间确保后端启动完成
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 启动前端服务器
    const frontendProcess = await startFrontend()
    
    console.log('='.repeat(50))
    console.log('🎉 Fullstack application started successfully!')
    console.log(`📱 Frontend: http://localhost:${FRONTEND_PORT}`)
    console.log(`🌐 Frontend network: http://0.0.0.0:${FRONTEND_PORT}`)
    console.log(`🔧 Backend API: http://localhost:${PORT}/api`)
    console.log(`🌐 Backend API network: http://0.0.0.0:${PORT}/api`)
    console.log(`👨‍💻 Admin: http://localhost:${FRONTEND_PORT}/admin (admin/admin123)`)
    console.log(`📱 Admin network: http://0.0.0.0:${FRONTEND_PORT}/admin (admin/admin123)`)
    console.log('=' .repeat(50))
    
    // 优雅关闭处理
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down servers...')
      frontendProcess.kill()
      backendServer.close(() => {
        console.log('✅ Servers stopped')
        process.exit(0)
      })
    })
    
    process.on('SIGTERM', () => {
      console.log('\n🛑 Shutting down servers...')
      frontendProcess.kill()
      backendServer.close(() => {
        console.log('✅ Servers stopped')
        process.exit(0)
      })
    })
    
  } catch (error) {
    console.error('❌ Failed to start application:', error)
    process.exit(1)
  }
}

// 启动应用
main()