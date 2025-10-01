<template>
  <div class="profile">
    <!-- 顶部导航 -->
    <nav class="navbar">
      <div class="navbar-content">
        <router-link to="/" class="navbar-brand">
          <span class="heart-icon">❤️</span>
          缘梦—时光主理人
        </router-link>
        <div class="navbar-menu">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <div style="width: 32px; height: 32px; border-radius: 50%; overflow: hidden; border: 2px solid var(--primary-red);">
                <img :src="userInfo.avatar || '/uploads/customer.png'" :alt="userInfo.nickname || userInfo.username" 
                     style="width: 100%; height: 100%; object-fit: cover;">
              </div>
              <span style="color: var(--gray-700); font-size: 0.9rem;">{{ userInfo.nickname || userInfo.username }}</span>
            </div>
            <button @click="handleLogout" class="navbar-link" style="background: none; border: none; cursor: pointer;">
              退出登录
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <div class="container" style="padding-bottom: 80px;">
      <!-- 用户信息卡片 -->
      <div class="card fade-in-up">
        <div class="card-header">
          <span style="font-size: 1.2rem;">👤</span>
          个人信息
        </div>
        <div style="text-align: center; padding: 1rem 0;">
          <div style="width: 80px; height: 80px; background: var(--gradient-primary); border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
            {{ userInfo.nickname ? userInfo.nickname.charAt(0) : '👤' }}
          </div>
          <h3 style="color: var(--gray-800); margin-bottom: 0.5rem;">{{ userInfo.nickname || '未设置昵称' }}</h3>
          <p style="color: var(--gray-600); font-size: 0.9rem;">@{{ userInfo.username }}</p>
          <div style="display: flex; gap: 0.5rem; justify-content: center; margin-top: 1rem;">
            <span style="background: var(--primary-gold); color: var(--gray-800); padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-size: 0.75rem;">
              {{ userInfo.role === 'admin' ? '管理员' : '普通用户' }}
            </span>
            <span style="background: var(--gradient-accent); color: white; padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-size: 0.75rem;">
              活跃度: {{ userInfo.activityLevel || '新手' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 资料概览 -->
      <div class="card fade-in-up">
        <div class="card-header">
          <span style="font-size: 1.2rem;">📊</span>
          资料概览
        </div>
        <div style="display: grid; gap: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--gray-50); border-radius: var(--radius-md);">
            <span style="color: var(--gray-700);">基本信息</span>
            <span :style="{ color: basicInfoComplete ? 'var(--secondary-green)' : 'var(--primary-red)' }">
              {{ basicInfoComplete ? '✅ 已完善' : '⚠️ 待完善' }}
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--gray-50); border-radius: var(--radius-md);">
            <span style="color: var(--gray-700);">联系方式</span>
            <span :style="{ color: contactInfoComplete ? 'var(--secondary-green)' : 'var(--primary-red)' }">
              {{ contactInfoComplete ? '✅ 已完善' : '⚠️ 待完善' }}
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--gray-50); border-radius: var(--radius-md);">
            <span style="color: var(--gray-700);">择偶期望</span>
            <span :style="{ color: expectationsComplete ? 'var(--secondary-green)' : 'var(--primary-red)' }">
              {{ expectationsComplete ? '✅ 已完善' : '⚠️ 待完善' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 我的期望 -->
      <div class="card fade-in-up" v-if="userDetails.expected_age_min">
        <div class="card-header">
          <span style="font-size: 1.2rem;">💕</span>
          我的期望
        </div>
        <div style="display: grid; gap: 0.75rem;">
          <div style="color: var(--gray-600); font-size: 0.9rem;">
            <strong>年龄范围：</strong> {{ userDetails.expected_age_min }} - {{ userDetails.expected_age_max }} 岁
          </div>
          <div style="color: var(--gray-600); font-size: 0.9rem;" v-if="userDetails.expected_height_min">
            <strong>身高范围：</strong> {{ userDetails.expected_height_min }} - {{ userDetails.expected_height_max }} cm
          </div>
          <div style="color: var(--gray-600); font-size: 0.9rem;" v-if="userDetails.expected_education">
            <strong>教育背景：</strong> {{ userDetails.expected_education }}
          </div>
          <div style="color: var(--gray-600); font-size: 0.9rem;" v-if="userDetails.expected_occupation">
            <strong>期望职业：</strong> {{ userDetails.expected_occupation }}
          </div>
          <div style="color: var(--gray-600); font-size: 0.9rem;" v-if="userDetails.expected_location">
            <strong>期望地区：</strong> {{ userDetails.expected_location }}
          </div>
        </div>
      </div>

      <!-- 快速操作 -->
      <div class="card fade-in-up">
        <div class="card-header">
          <span style="font-size: 1.2rem;">⚡</span>
          快速操作
        </div>
        <div style="display: grid; gap: 0.75rem;">
          <router-link to="/user-details" class="btn btn-primary">
            <span style="margin-right: 0.5rem;">📝</span>
            完善资料
          </router-link>
          <router-link to="/activities" class="btn btn-secondary">
            <span style="margin-right: 0.5rem;">🎉</span>
            查看活动
          </router-link>
          <div v-if="userInfo.role === 'admin'" style="display: grid; gap: 0.75rem;">
            <router-link to="/admin" class="btn btn-outline">
              <span style="margin-right: 0.5rem;">⚙️</span>
              管理后台
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <div class="bottom-nav">
      <router-link to="/" class="bottom-nav-item">
        <span style="font-size: 1.2rem;">🏠</span>
        <span>首页</span>
      </router-link>
      <router-link to="/activities" class="bottom-nav-item">
        <span style="font-size: 1.2rem;">🎉</span>
        <span>活动</span>
      </router-link>
      <router-link to="/profile" class="bottom-nav-item active">
        <span style="font-size: 1.2rem;">👤</span>
        <span>我的</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userService } from '../services/index.js'

const router = useRouter()
const userInfo = ref({})
const userDetails = ref({})

const basicInfoComplete = computed(() => {
  return userDetails.value.real_name && userDetails.value.age && userDetails.value.gender
})

const contactInfoComplete = computed(() => {
  return userDetails.value.phone && userDetails.value.current_city
})

const expectationsComplete = computed(() => {
  return userDetails.value.expected_age_min && userDetails.value.expected_age_max
})

const fetchUserInfo = async () => {
  try {
    const userId = localStorage.getItem('userId')
    
    // Fetch basic user info
    const userResponse = await userService.getUserById(userId)
    userInfo.value = userResponse
    
    // Fetch detailed user info
    if (userResponse.user_id) {
      userDetails.value = userResponse
    }
    
  } catch (error) {
    console.error('Failed to fetch user info:', error)
    if (error.response?.status === 401) {
      router.push('/login')
    }
  }
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  localStorage.removeItem('userRole')
  localStorage.removeItem('username')
  router.push('/login')
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
.profile {
  min-height: 100vh;
  padding-top: 1rem;
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