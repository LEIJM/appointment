<template>
  <div class="register-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="快速注册" left-arrow @click-left="goBack" />
    
    <!-- 主要内容区域 -->
    <div class="content-container">
      <div class="register-icon">👋</div>
      <h2 class="register-title">欢迎加入我们！</h2>
      <p class="register-subtitle">请填写以下信息完成注册</p>

      <!-- 注册表单 -->
      <van-form @submit="onSubmit" ref="registerForm">
        <!-- 用户名 -->
        <van-field
          v-model="formData.username"
          name="username"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请输入用户名' }]"
        />

        <!-- 手机号 -->
        <van-field
          v-model="formData.phone"
          name="phone"
          label="手机号"
          placeholder="请输入手机号"
          type="tel"
          :rules="[
            { required: true, message: '请输入手机号' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
          ]"
        />

        <!-- 密码 -->
        <van-field
          v-model="formData.password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          type="password"
          :rules="[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码至少6位' }
          ]"
        />

        <!-- 确认密码 -->
        <van-field
          v-model="formData.confirmPassword"
          name="confirmPassword"
          label="确认密码"
          placeholder="请再次输入密码"
          type="password"
          :rules="[
            { required: true, message: '请确认密码' },
            { validator: validateConfirmPassword, message: '两次密码输入不一致' }
          ]"
        />
      </van-form>
    </div>

    <!-- 底部按钮 -->
    <div class="bottom-actions">
      <van-button 
        type="primary" 
        block 
        round 
        @click="onSubmit"
        :loading="loading"
      >
        立即注册
      </van-button>
      <p class="login-tips">
        已有账号？<span @click="goToLogin" class="login-link">立即登录</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showLoadingToast, closeToast } from 'vant'
import { useUserStore } from '../../stores/user.js'

const router = useRouter()
const userStore = useUserStore()
const registerForm = ref(null)
const loading = ref(false)

const formData = reactive({
  username: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

// 验证确认密码
const validateConfirmPassword = (value) => {
  return value === formData.password
}

// 返回上一页
const goBack = () => {
  router.push('/onboarding/step7')
}

// 跳转到登录页
const goToLogin = () => {
  router.push('/login')
}

// 提交注册
const onSubmit = async () => {
  try {
    // 验证表单
    await registerForm.value.validate()
    
    loading.value = true
    showLoadingToast({
      message: '注册中...',
      forbidClick: true,
      duration: 0
    })

    // 获取onboarding数据
    const onboardingData = JSON.parse(sessionStorage.getItem('onboardingData') || '{}')
    
    // 构建注册数据
    const registerData = {
      username: formData.username,
      phone: formData.phone,
      password: formData.password,
      gender: onboardingData.gender || '',
      age: onboardingData.age || '',
      region: onboardingData.region || '',
      education: onboardingData.education || '',
      occupation: onboardingData.occupation || '',
      income: onboardingData.income || '',
      height: onboardingData.height || ''
    }

    // 调用注册API
    const response = await userStore.register({
      username: formData.username,
      password: formData.password
    })
    
    closeToast()
    
    if (response.token && response.user) {
      showToast('注册成功！')
      
      // 存储token和用户信息
      localStorage.setItem('token', response.token)
      localStorage.setItem('userId', response.user.id)
      localStorage.setItem('userRole', response.user.role)
      localStorage.setItem('username', response.user.username)
      
      // 自动登录（更新用户状态）
      userStore.token = response.token
      userStore.user = response.user
      
      // 清理sessionStorage
      sessionStorage.removeItem('onboardingData')
      
      // 跳转到主页
      router.push('/')
    } else {
      showToast(response.message || '注册失败，请重试')
    }
  } catch (error) {
    closeToast()
    // 显示具体的错误信息
    const errorMessage = error.response?.data?.error || error.message || '注册失败，请重试'
    showToast(errorMessage)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
}

.content-container {
  flex: 1;
  padding: 40px 20px 20px;
  text-align: center;
  color: white;
}

.register-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.register-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
  color: white;
}

.register-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 40px;
}

:deep(.van-form) {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
}

:deep(.van-field) {
  background: transparent;
  border-radius: 8px;
  margin-bottom: 10px;
}

:deep(.van-field__label) {
  color: #333;
  font-weight: 500;
}

:deep(.van-field__control) {
  color: #333;
}

.bottom-actions {
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

:deep(.van-button--primary) {
  background: linear-gradient(90deg, #ff6b6b, #ffa726);
  border: none;
  font-weight: 500;
  margin-bottom: 15px;
}

.login-tips {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  text-align: center;
  margin: 0;
}

.login-link {
  color: #ffa726;
  font-weight: 500;
  cursor: pointer;
}

.login-link:hover {
  text-decoration: underline;
}

:deep(.van-nav-bar) {
  background: transparent;
}

:deep(.van-nav-bar__title) {
  color: white;
  font-weight: 500;
}

:deep(.van-nav-bar .van-icon) {
  color: white;
}
</style>