<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // Check if user is logged in
  const token = localStorage.getItem('token')
  if (token) {
    // Validate token or redirect to login
  }
})
</script>

<style>
/* 喜庆但现代的配色方案 */
:root {
  /* 主色调 - 温暖的珊瑚红和金色 */
  --primary-red: #FF6B6B;
  --primary-gold: #FFD93D;
  --primary-pink: #FF8E9B;
  --primary-orange: #FFA726;
  
  /* 辅助色调 - 现代感的渐变 */
  --secondary-purple: #A78BFA;
  --secondary-blue: #60A5FA;
  --secondary-green: #34D399;
  
  /* 中性色调 */
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;
  
  /* 渐变背景 */
  --gradient-primary: linear-gradient(135deg, var(--primary-red) 0%, var(--primary-pink) 100%);
  --gradient-secondary: linear-gradient(135deg, var(--primary-gold) 0%, var(--primary-orange) 100%);
  --gradient-accent: linear-gradient(135deg, var(--secondary-purple) 0%, var(--secondary-blue) 100%);
  
  /* 阴影 */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  
  /* 圆角 */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  background: linear-gradient(135deg, #FFF5F5 0%, #FFF8E1 100%);
  min-height: 100vh;
  color: var(--gray-700);
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}

/* 移动端优先的响应式设计 */
.container {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  min-height: 3rem;
}

.btn-primary {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background: var(--gradient-secondary);
  color: var(--gray-800);
  box-shadow: var(--shadow-md);
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--primary-red);
  color: var(--primary-red);
}

.btn-outline:hover {
  background: var(--primary-red);
  color: white;
}

/* 卡片样式 */
.card {
  background: white;
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  margin-bottom: 1rem;
}

.card-header {
  background: var(--gradient-primary);
  color: white;
  padding: 1rem 1.5rem;
  margin: -1.5rem -1.5rem 1.5rem -1.5rem;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
}

/* 表单样式 */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--gray-700);
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-red);
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

.form-input::placeholder {
  color: var(--gray-400);
}

/* 导航栏样式 */
.navbar {
  background: var(--gradient-primary);
  padding: 1rem;
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.navbar-brand {
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  text-decoration: none;
}

.navbar-menu {
  display: flex;
  gap: 1rem;
}

.navbar-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
}

.navbar-link:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 底部导航 */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-around;
  padding: 0.75rem 0;
  z-index: 100;
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: var(--gray-600);
  font-size: 0.75rem;
  transition: all 0.3s ease;
}

.bottom-nav-item.active {
  color: var(--primary-red);
}

.bottom-nav-item:hover {
  color: var(--primary-red);
}

/* 响应式设计 */
@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
  
  .card {
    padding: 2rem;
  }
  
  .card-header {
    margin: -2rem -2rem 2rem -2rem;
    padding: 1.5rem 2rem;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.pulse {
  animation: pulse 2s infinite;
}

/* 特殊效果 */
.heart-icon {
  color: var(--primary-red);
  animation: pulse 1.5s infinite;
}

.festive-bg {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 217, 61, 0.1) 100%);
  border-radius: var(--radius-xl);
  padding: 2rem;
  text-align: center;
}

.match-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 248, 225, 0.9) 100%);
  border: 2px solid var(--primary-gold);
  position: relative;
  overflow: hidden;
}

.match-card::before {
  content: '❤️';
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 2rem;
  opacity: 0.3;
  transform: rotate(15deg);
}
</style>
