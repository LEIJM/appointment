<template>
  <div class="login">
    <!-- 顶部导航 -->
    <nav class="navbar">
      <div class="navbar-content">
        <router-link to="/" class="navbar-brand">
          <span class="heart-icon">❤️</span>
          缘梦—时光主理人
        </router-link>
        <div class="navbar-menu">
          <router-link to="/" class="navbar-link">返回首页</router-link>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <div class="container" style="padding: 2rem 1rem;">
      <div class="card fade-in-up">
        <div class="card-header">
          <span style="font-size: 1.5rem;">🔐</span>
          用户登录
        </div>
        
        <form @submit.prevent="handleLogin" style="padding: 1rem 0;">
          <div class="form-group">
            <label class="form-label">用户名</label>
            <input 
              v-model="form.username" 
              type="text" 
              class="form-input" 
              placeholder="请输入用户名"
              required
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">密码</label>
            <input 
              v-model="form.password" 
              type="password" 
              class="form-input" 
              placeholder="请输入密码"
              required
            >
          </div>
          
          <div v-if="error" style="background: rgba(255, 107, 107, 0.1); color: var(--primary-red); padding: 0.75rem; border-radius: var(--radius-md); margin-bottom: 1rem; font-size: 0.9rem;">
            {{ error }}
          </div>
          
          <button type="submit" class="btn btn-primary" style="width: 100%;" :disabled="loading">
            <span v-if="!loading">登录</span>
            <span v-else>登录中...</span>
          </button>
        </form>
        
        <div style="text-align: center; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--gray-200);">
          <p style="color: var(--gray-600); font-size: 0.9rem; margin-bottom: 0.5rem;">
            还没有账号？
          </p>
          <router-link to="/register" class="btn btn-outline" style="width: 100%;">
            立即注册
          </router-link>
        </div>
      </div>
      
      <!-- 温馨提示 -->
      <div style="background: rgba(255, 217, 61, 0.1); border-radius: var(--radius-lg); padding: 1rem; margin-top: 1rem; text-align: center;">
        <p style="color: var(--gray-600); font-size: 0.85rem;">
          💡 温馨提示：请妥善保管您的账号密码，不要与他人分享
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const form = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await axios.post('http://localhost:3001/api/login', {
      username: form.value.username,
      password: form.value.password
    })
    
    const { token, user } = response.data
    
    // Store token and user info
    localStorage.setItem('token', token)
    localStorage.setItem('userId', user.id)
    localStorage.setItem('userRole', user.role)
    localStorage.setItem('username', user.username)
    
    // Redirect based on role
    if (user.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/profile')
    }
    
  } catch (err) {
    error.value = err.response?.data?.error || '登录失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  background: linear-gradient(135deg, #FFF5F5 0%, #FFF8E1 100%);
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

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
</style>