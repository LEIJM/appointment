import { createServer } from 'vite'
import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export function createFullStackPlugin() {
  return {
    name: 'fullstack-plugin',
    configureServer(server) {
      // 集成Express后端
      const app = express()
      
      // 添加CORS中间件
      app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
        if (req.method === 'OPTIONS') {
          res.sendStatus(200)
        } else {
          next()
        }
      })
      
      // 导入后端路由
      const setupBackendRoutes = async () => {
        try {
          // 动态导入server.js中的路由配置
          const serverModule = await import('./server-routes.js')
          serverModule.setupRoutes(app)
          console.log('✅ Backend routes integrated successfully')
        } catch (error) {
          console.log('⚠️  Backend routes not found, using proxy mode')
        }
      }
      
      setupBackendRoutes()
      
      // 监听3001端口作为后端服务
      const backendServer = app.listen(3001, () => {
        console.log('🚀 Backend server integrated on port 3001')
      })
      
      // 清理函数
      server.httpServer.on('close', () => {
        backendServer.close()
        console.log('🔒 Backend server closed')
      })
    }
  }
}