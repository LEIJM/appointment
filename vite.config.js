import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 环境变量配置
  envPrefix: 'VITE_',
  // 开发服务器配置
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'https://api.030516.xyz',
        changeOrigin: true
      }
    }
  }
})
