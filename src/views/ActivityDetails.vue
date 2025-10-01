<template>
  <div class="activity-details">
    <!-- 顶部导航 -->
    <nav class="navbar">
      <div class="navbar-content">
        <router-link to="/" class="navbar-brand">
          <span class="heart-icon">❤️</span>
          缘梦—时光主理人
        </router-link>
        <div class="navbar-menu">
          <div v-if="currentUser" style="display: flex; align-items: center; gap: 0.5rem;">
            <router-link to="/profile" class="navbar-link" style="display: flex; align-items: center; gap: 0.5rem;">
              <div style="width: 32px; height: 32px; border-radius: 50%; overflow: hidden; border: 2px solid var(--primary-red);">
                <img :src="currentUser.avatar || '/uploads/customer.png'" :alt="currentUser.nickname || currentUser.username" 
                     style="width: 100%; height: 100%; object-fit: cover;">
              </div>
              <span>{{ currentUser.nickname || currentUser.username }}</span>
            </router-link>
          </div>
          <router-link v-else to="/activities" class="navbar-link">返回活动列表</router-link>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <div class="container" style="padding-bottom: 80px;">
      <!-- 加载状态 -->
      <div v-if="loading" style="text-align: center; padding: 2rem;">
        <div style="font-size: 2rem; margin-bottom: 1rem;">⏳</div>
        <p>加载中...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" style="text-align: center; padding: 2rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
        <p style="color: var(--gray-500);">{{ error }}</p>
        <router-link to="/activities" class="btn btn-primary" style="margin-top: 1rem;">
          返回活动列表
        </router-link>
      </div>

      <!-- 活动详情 -->
      <div v-else-if="activity" class="fade-in-up">
        <!-- 页面标题 -->
        <div class="festive-bg" style="margin: 1rem 0; text-align: center;">
          <h1 style="color: var(--primary-red); font-size: 1.5rem; margin-bottom: 0.5rem;">
            {{ activity.title }}
          </h1>
          <p style="color: var(--gray-600); font-size: 0.9rem;">
            活动详情信息 📋
          </p>
        </div>

        <!-- 活动基本信息 -->
        <div class="card">
          <div class="card-header">
            <span style="font-size: 1.2rem;">📅</span>
            活动信息
          </div>
          <div style="display: grid; gap: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: 600;">活动状态：</span>
              <span :class="['activity-status', getStatusClass(activity.date)]">
                {{ getStatusText(activity.date) }}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="font-weight: 600;">活动时间：</span>
              <span>{{ formatDate(activity.date) }}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="font-weight: 600;">活动地点：</span>
              <span>{{ activity.location }}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="font-weight: 600;">报名截止：</span>
              <span :class="{'text-danger': !activity.can_register}">
                {{ formatDate(activity.registration_deadline) }}
                <span v-if="!activity.can_register" style="color: var(--danger-red);"> (已截止)</span>
              </span>
            </div>
            <div>
              <span style="font-weight: 600;">活动描述：</span>
              <p style="margin-top: 0.5rem; color: var(--gray-600);">{{ activity.details }}</p>
            </div>
            <div v-if="activity.notes">
              <span style="font-weight: 600;">备注信息：</span>
              <p style="margin-top: 0.5rem; color: var(--gray-600);">{{ activity.notes }}</p>
            </div>
          </div>
        </div>

        <!-- 活动照片 -->
        <div v-if="activity.photos" class="card">
          <div class="card-header">
            <span style="font-size: 1.2rem;">📸</span>
            活动照片
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div v-for="(photo, index) in activity.photos.split(',')" :key="index"
                 style="border-radius: var(--radius-lg); overflow: hidden; aspect-ratio: 16/9;">
              <img :src="photo" :alt="`活动照片 ${index + 1}`" 
                   style="width: 100%; height: 100%; object-fit: cover;">
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="card">
          <div style="display: flex; gap: 1rem; justify-content: center;">
            <button 
              class="btn btn-primary" 
              style="padding: 0.75rem 2rem;"
              @click="handleRegistration"
              :disabled="!activity.can_register || activity.is_registered"
            >
              {{ activity.is_registered ? '已报名' : (activity.can_register ? '立即报名' : '报名已截止') }}
            </button>
            <router-link to="/activities" class="btn btn-outline" style="padding: 0.75rem 2rem;">
              返回列表
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
      <router-link to="/activities" class="bottom-nav-item active">
        <span style="font-size: 1.2rem;">🎉</span>
        <span>活动</span>
      </router-link>
      <router-link to="/profile" class="bottom-nav-item">
        <span style="font-size: 1.2rem;">👤</span>
        <span>我的</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { activityService } from '../services/index.js'
import { userService } from '../services/index.js'

const router = useRouter()
const route = useRoute()
const activity = ref(null)
const loading = ref(true)
const error = ref('')
const currentUser = ref(null)

const fetchActivityDetails = async () => {
  try {
    const activityId = route.params.id
    
    const response = await activityService.getActivityById(activityId)
    
    activity.value = response
  } catch (err) {
    console.error('Failed to fetch activity details:', err)
    error.value = err.response?.data?.error || '获取活动详情失败'
  } finally {
    loading.value = false
  }
}

const handleRegistration = async () => {
  if (!activity.value.can_register || activity.value.is_registered) {
    return
  }

  try {
    const activityId = route.params.id
    
    await activityService.registerForActivity(activityId)
    
    alert('报名成功！')
    // 重新获取活动详情以更新状态
    await fetchActivityDetails()
  } catch (err) {
    console.error('Registration failed:', err)
    alert(err.response?.data?.error || '报名失败，请重试')
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
}

const getStatusClass = (dateString) => {
  const activityDate = new Date(dateString)
  const now = new Date()
  return activityDate >= now ? 'status-upcoming' : 'status-past'
}

const getStatusText = (dateString) => {
  const activityDate = new Date(dateString)
  const now = new Date()
  return activityDate >= now ? '即将开始' : '已结束'
}

const fetchCurrentUser = async () => {
  try {
    const userId = localStorage.getItem('userId')
    
    if (userId) {
      const response = await userService.getUserById(userId)
      currentUser.value = response
    }
  } catch (error) {
    console.error('Failed to fetch current user:', error)
    // 如果获取失败，清除本地存储
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
  }
}

onMounted(() => {
  fetchActivityDetails()
  fetchCurrentUser()
})
</script>

<style scoped>
.activity-details {
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

.activity-status {
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
}

.status-upcoming {
  background: var(--primary-gold);
  color: var(--gray-800);
}

.status-past {
  background: var(--gray-200);
  color: var(--gray-600);
}
</style>