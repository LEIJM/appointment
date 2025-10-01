<template>
  <div class="register">
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
          <span style="font-size: 1.5rem;">📝</span>
          用户注册
        </div>
        
        <form @submit.prevent="handleRegister" style="padding: 1rem 0;">
          <div class="form-group">
            <label class="form-label">用户名</label>
            <input 
              v-model="form.username" 
              type="text" 
              class="form-input" 
              placeholder="请输入用户名（3-20个字符）"
              required
              minlength="3"
              maxlength="20"
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">密码</label>
            <input 
              v-model="form.password" 
              type="password" 
              class="form-input" 
              placeholder="请输入密码（至少6位）"
              required
              minlength="6"
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">确认密码</label>
            <input 
              v-model="form.confirmPassword" 
              type="password" 
              class="form-input" 
              placeholder="请再次输入密码"
              required
            >
          </div>
          
          <div v-if="error" style="background: rgba(255, 107, 107, 0.1); color: var(--primary-red); padding: 0.75rem; border-radius: var(--radius-md); margin-bottom: 1rem; font-size: 0.9rem;">
            {{ error }}
          </div>
          
          <button type="submit" class="btn btn-primary" style="width: 100%;" :disabled="loading">
            <span v-if="!loading">注册</span>
            <span v-else>注册中...</span>
          </button>
        </form>
        
        <div style="text-align: center; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--gray-200);">
          <p style="color: var(--gray-600); font-size: 0.9rem; margin-bottom: 0.5rem;">
            已有账号？
          </p>
          <router-link to="/login" class="btn btn-outline" style="width: 100%;">
            立即登录
          </router-link>
        </div>
      </div>
      
      <!-- 注册协议 -->
      <div style="background: rgba(255, 217, 61, 0.1); border-radius: var(--radius-lg); padding: 1rem; margin-top: 1rem;">
        <p style="color: var(--gray-600); font-size: 0.8rem; text-align: center;">
          注册即表示您同意我们的
          <a href="#" style="color: var(--primary-red); text-decoration: none;">服务条款</a>
          和
          <a href="#" style="color: var(--primary-red); text-decoration: none;">隐私政策</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { userService } from '../services/index.js'

const router = useRouter()

const form = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  // Validation
  if (form.value.password !== form.value.confirmPassword) {
    error.value = '两次输入的密码不一致'
    return
  }
  
  if (form.value.username.length < 3) {
    error.value = '用户名至少需要3个字符'
    return
  }
  
  if (form.value.password.length < 6) {
    error.value = '密码至少需要6个字符'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const { token, user } = await userService.register(form.value.username, form.value.password)
    
    // Store token and user info
    localStorage.setItem('token', token)
    localStorage.setItem('userId', user.id)
    localStorage.setItem('userRole', user.role)
    localStorage.setItem('username', user.username)
    
    // Redirect to profile to complete details
    router.push('/user-details')
    
  } catch (err) {
    error.value = err.response?.data?.error || '注册失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register {
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