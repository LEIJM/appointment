import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        {
          src: 'uploads/*',
          dest: 'uploads'
        }
      ]
    })
  ],
  // 环境变量配置
  envPrefix: 'VITE_',
  // 开发服务器配置
  server: {
    allowedHosts: ['appointment-85w.pages.dev','appointment.030516.xyz','localhost','www.xinqiaocz.com','xinqiaocz.com'],
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
