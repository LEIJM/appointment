<template>
  <div class="activities">
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
          <router-link v-else to="/profile" class="navbar-link">个人中心</router-link>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <div class="container" style="padding-bottom: 80px;">
      <!-- 页面标题 -->
      <div class="festive-bg fade-in-up" style="margin: 1rem 0; text-align: center;">
        <h1 style="color: var(--primary-red); font-size: 1.5rem; margin-bottom: 0.5rem;">
          精彩活动
        </h1>
        <p style="color: var(--gray-600); font-size: 0.9rem;">
          参与线下活动，遇见更多可能 🎉
        </p>
      </div>

      <!-- 活动分类筛选 -->
      <div class="card fade-in-up">
        <div class="card-header">
          <span style="font-size: 1.2rem;">🔍</span>
          活动筛选
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button 
            @click="filterCategory = 'all'" 
            :class="['btn', filterCategory === 'all' ? 'btn-primary' : 'btn-outline']"
            style="padding: 0.5rem 1rem; font-size: 0.85rem;"
          >
            全部活动
          </button>
          <button 
            @click="filterCategory = 'upcoming'" 
            :class="['btn', filterCategory === 'upcoming' ? 'btn-primary' : 'btn-outline']"
            style="padding: 0.5rem 1rem; font-size: 0.85rem;"
          >
            即将开始
          </button>
          <button 
            @click="filterCategory = 'past'" 
            :class="['btn', filterCategory === 'past' ? 'btn-primary' : 'btn-outline']"
            style="padding: 0.5rem 1rem; font-size: 0.85rem;"
          >
            往期活动
          </button>
        </div>
      </div>

      <!-- 活动列表 -->
      <div class="card fade-in-up">
        <div class="card-header">
          <span style="font-size: 1.2rem;">🎊</span>
          活动列表
        </div>
        
        <div v-if="loading" style="text-align: center; padding: 2rem;">
          <div style="font-size: 2rem; margin-bottom: 1rem;">⏳</div>
          <p>加载中...</p>
        </div>
        
        <div v-else-if="filteredActivities.length > 0" style="display: grid; gap: 1rem;">
          <div v-for="activity in filteredActivities" :key="activity.id" 
               style="border: 1px solid var(--gray-200); border-radius: var(--radius-lg); padding: 1rem; background: white;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <h4 style="color: var(--primary-red); font-size: 1.1rem;">{{ activity.title }}</h4>
              <span :class="['activity-status', getStatusClass(activity.date)]">
                {{ getStatusText(activity.date) }}
              </span>
            </div>
            <p style="color: var(--gray-600); font-size: 0.9rem; margin-bottom: 0.75rem;">{{ activity.details }}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: var(--gray-500); font-size: 0.8rem;">
                📅 {{ formatDate(activity.date) }}
              </span>
              <button @click="viewActivityDetails(activity)" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
                查看详情
              </button>
            </div>
          </div>
        </div>
        
        <div v-else style="text-align: center; padding: 2rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🎈</div>
          <p style="color: var(--gray-500);">暂无活动信息</p>
        </div>
      </div>

      <!-- 活动推荐 -->
      <div class="card fade-in-up">
        <div class="card-header">
          <span style="font-size: 1.2rem;">💝</span>
          推荐活动
        </div>
        <div style="background: var(--gradient-primary); color: white; padding: 1.5rem; border-radius: var(--radius-lg); text-align: center;">
          <h4 style="margin-bottom: 0.5rem;">春季相亲大会</h4>
          <p style="font-size: 0.9rem; margin-bottom: 1rem;">春暖花开，遇见真爱 💕</p>
          <button class="btn" style="background: white; color: var(--primary-red);">
            立即报名
          </button>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { activityService } from '../services/index.js'
import { userService } from '../services/index.js'

const router = useRouter()
const activities = ref([])
const loading = ref(true)
const filterCategory = ref('all')
const currentUser = ref(null)

const fetchActivities = async () => {
  try {
    const response = await activityService.getPublicActivities()
    activities.value = response
  } catch (error) {
    console.error('Failed to fetch activities:', error)
  } finally {
    loading.value = false
  }
}

const filteredActivities = computed(() => {
  const now = new Date()
  return activities.value.filter(activity => {
    const activityDate = new Date(activity.date)
    switch (filterCategory.value) {
      case 'upcoming':
        return activityDate >= now
      case 'past':
        return activityDate < now
      default:
        return true
    }
  })
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
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

const viewActivityDetails = (activity) => {
  // Navigate to activity details page
  router.push(`/activities/${activity.id}`)
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
  fetchActivities()
  fetchCurrentUser()
})
</script>

<style scoped>
.activities {
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