<template>
  <div class="home">
    <!-- 顶部导航 -->
    <nav class="navbar">
      <div class="navbar-content">
        <div class="navbar-brand">
          <span class="heart-icon">❤️</span>
          缘来是你
        </div>
        <div class="navbar-menu">
          <router-link to="/login" class="navbar-link">登录</router-link>
          <router-link to="/register" class="navbar-link">注册</router-link>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <div class="container" style="padding-bottom: 80px;">
      <!-- 欢迎区域 -->
      <div class="festive-bg fade-in-up" style="margin: 1rem 0;">
        <h1 style="color: var(--primary-red); font-size: 1.5rem; margin-bottom: 0.5rem;">
          欢迎来到缘来是你
        </h1>
        <p style="color: var(--gray-600); font-size: 0.9rem;">
          在这里，遇见你的命中注定 💕
        </p>
      </div>

      <!-- 特色功能卡片 -->
      <div class="card fade-in-up">
        <div class="card-header">
          <span style="font-size: 1.2rem;">✨</span>
          平台特色
        </div>
        <div style="display: grid; gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 40px; height: 40px; background: var(--gradient-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem;">💝</div>
            <div>
              <h3 style="font-size: 1rem; color: var(--gray-800); margin-bottom: 0.25rem;">真实认证</h3>
              <p style="font-size: 0.85rem; color: var(--gray-600);">严格身份验证，确保交友安全</p>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 40px; height: 40px; background: var(--gradient-secondary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem;">🎯</div>
            <div>
              <h3 style="font-size: 1rem; color: var(--gray-800); margin-bottom: 0.25rem;">精准匹配</h3>
              <p style="font-size: 0.85rem; color: var(--gray-600);">智能算法推荐，找到最适合的你</p>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 40px; height: 40px; background: var(--gradient-accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem;">🌟</div>
            <div>
              <h3 style="font-size: 1rem; color: var(--gray-800); margin-bottom: 0.25rem;">丰富活动</h3>
              <p style="font-size: 0.85rem; color: var(--gray-600);">定期举办线下活动，增进了解</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 快速开始 -->
      <div class="card fade-in-up">
        <div class="card-header">
          <span style="font-size: 1.2rem;">🚀</span>
          快速开始
        </div>
        <div style="display: grid; gap: 1rem;">
          <router-link to="/register" class="btn btn-primary" style="text-align: center;">
            <span style="margin-right: 0.5rem;">💕</span>
            立即注册
          </router-link>
          <router-link to="/login" class="btn btn-outline" style="text-align: center;">
            <span style="margin-right: 0.5rem;">🔑</span>
            已有账号？立即登录
          </router-link>
        </div>
      </div>

      <!-- 最新活动 -->
      <div class="card fade-in-up">
        <div class="card-header">
          <span style="font-size: 1.2rem;">🎉</span>
          最新活动
        </div>
        <div v-if="activities.length > 0" style="display: grid; gap: 1rem;">
          <div v-for="activity in activities.slice(0, 2)" :key="activity.id" 
               style="border: 1px solid var(--gray-200); border-radius: var(--radius-lg); padding: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <h4 style="color: var(--primary-red); font-size: 1rem;">{{ activity.title }}</h4>
              <span style="background: var(--primary-gold); color: var(--gray-800); padding: 0.25rem 0.5rem; border-radius: var(--radius-sm); font-size: 0.75rem;">
                {{ formatDate(activity.date) }}
              </span>
            </div>
            <p style="color: var(--gray-600); font-size: 0.85rem; margin-bottom: 0.5rem;">{{ activity.details }}</p>
            <div style="display: flex; gap: 0.5rem;">
              <div v-for="(photo, index) in activity.photos?.split(',')" :key="index"
                   style="width: 60px; height: 60px; border-radius: var(--radius-md); overflow: hidden;">
                <img :src="photo" :alt="activity.title" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
            </div>
          </div>
        </div>
        <div v-else style="text-align: center; color: var(--gray-500); padding: 2rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🎈</div>
          <p>暂无活动信息</p>
        </div>
        <router-link to="/activities" class="btn btn-secondary" style="text-align: center; margin-top: 1rem;">
          查看更多活动
        </router-link>
      </div>
    </div>

    <!-- 底部导航 -->
    <div class="bottom-nav">
      <router-link to="/" class="bottom-nav-item active">
        <span style="font-size: 1.2rem;">🏠</span>
        <span>首页</span>
      </router-link>
      <router-link to="/activities" class="bottom-nav-item">
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
import axios from 'axios'

const activities = ref([])

const fetchActivities = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/activities/public')
    activities.value = response.data
  } catch (error) {
    console.error('Failed to fetch activities:', error)
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

onMounted(() => {
  fetchActivities()
})
</script>

<style scoped>
.home {
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