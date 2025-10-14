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
      <!-- 页面标题（简化版） -->
      <div class="fade-in-up" style="margin: 1.5rem 0; text-align: center;">
        <h1 style="color: var(--gray-900); font-size: 1.5rem; margin: 0 0 0.25rem 0; font-weight: 500;">
          活动列表
        </h1>
        <p style="color: var(--gray-500); font-size: 0.8rem; margin: 0;">
          遇见美好的TA
        </p>
      </div>

      <!-- 简化筛选器 -->
      <div class="fade-in-up" style="margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <h3 style="font-size: 1rem; color: var(--gray-800); font-weight: 500; margin: 0;">筛选条件</h3>
          <button @click="$router.push('/past-activities')" 
                  style="background: var(--primary-red); color: white; border: none; padding: 0.4rem 0.8rem; border-radius: var(--radius-md); font-size: 0.8rem; cursor: pointer; transition: all 0.2s ease;">
            往期活动回顾 →
          </button>
        </div>
        
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button 
            @click="filterStatus = 'all'" 
            :style="{
              padding: '0.4rem 0.8rem',
              border: '1px solid var(--gray-200)',
              borderRadius: 'var(--radius-md)',
              background: filterStatus === 'all' ? 'var(--primary-red)' : 'white',
              color: filterStatus === 'all' ? 'white' : 'var(--gray-700)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }"
          >
            全部
          </button>
          <button 
            @click="filterStatus = 'upcoming'" 
            :style="{
              padding: '0.4rem 0.8rem',
              border: '1px solid var(--gray-200)',
              borderRadius: 'var(--radius-md)',
              background: filterStatus === 'upcoming' ? 'var(--primary-red)' : 'white',
              color: filterStatus === 'upcoming' ? 'white' : 'var(--gray-700)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }"
          >
            即将开始
          </button>
          <button 
            @click="filterStatus = 'ongoing'" 
            :style="{
              padding: '0.4rem 0.8rem',
              border: '1px solid var(--gray-200)',
              borderRadius: 'var(--radius-md)',
              background: filterStatus === 'ongoing' ? 'var(--primary-red)' : 'white',
              color: filterStatus === 'ongoing' ? 'white' : 'var(--gray-700)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }"
          >
            进行中
          </button>
        </div>
      </div>

      <!-- 简化活动列表 -->
      <div class="fade-in-up">
        <div v-if="loading" style="text-align: center; padding: 3rem;">
          <div style="font-size: 2rem; margin-bottom: 1rem; color: var(--gray-400);">加载中...</div>
        </div>
        
        <div v-else-if="filteredActivities.length > 0" style="display: grid; gap: 0.75rem;">
          <div v-for="activity in filteredActivities" :key="activity.id" 
               style="background: white; border-radius: var(--radius-lg); padding: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: all 0.2s ease;"
               @mouseenter="$event.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'"
               @mouseleave="$event.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'"
               @click="viewActivityDetails(activity)">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <h4 style="color: var(--gray-800); font-size: 1rem; font-weight: 500; margin: 0;">{{ activity.title }}</h4>
              <span :class="['activity-status', getStatusClass(activity.date)]" style="font-size: 0.7rem;">
                {{ getStatusText(activity.date) }}
              </span>
            </div>
            <p style="color: var(--gray-600); font-size: 0.85rem; margin: 0 0 0.75rem 0; line-height: 1.4;">{{ activity.details }}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: var(--gray-500); font-size: 0.75rem;">
                {{ formatDate(activity.date) }}
              </span>
              <span style="color: var(--primary-red); font-size: 0.75rem; font-weight: 500;">
                查看详情 →
              </span>
            </div>
          </div>
        </div>
        
        <div v-else style="text-align: center; padding: 3rem; color: var(--gray-500);">
          <p style="font-size: 0.9rem;">暂无符合条件的活动</p>
        </div>
      </div>

      <!-- 简化推荐活动 -->
      <div class="fade-in-up" style="margin-top: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <h3 style="color: var(--gray-800); font-size: 1.1rem; font-weight: 500; margin: 0;">推荐活动</h3>
          <button v-if="recommendedActivity" @click="viewActivityDetails(recommendedActivity)" 
                  style="background: none; border: none; color: var(--primary-red); font-size: 0.8rem; cursor: pointer;">
            查看全部 →
          </button>
        </div>
        
        <div v-if="recommendedActivity" 
             style="background: linear-gradient(135deg, var(--primary-red) 0%, #ff6b6b 100%); border-radius: var(--radius-lg); padding: 1.25rem; color: white; cursor: pointer; transition: all 0.2s ease;"
             @mouseenter="$event.target.style.transform = 'translateY(-2px)'"
             @mouseleave="$event.target.style.transform = 'translateY(0)'"
             @click="viewActivityDetails(recommendedActivity)">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
            <h4 style="font-size: 1.1rem; font-weight: 500; margin: 0;">{{ recommendedActivity.title }}</h4>
            <span style="background: rgba(255,255,255,0.2); padding: 0.25rem 0.5rem; border-radius: var(--radius-sm); font-size: 0.7rem;">
              {{ getStatusText(recommendedActivity.date) }}
            </span>
          </div>
          <p style="font-size: 0.85rem; margin: 0 0 0.75rem 0; opacity: 0.9; line-height: 1.4;">{{ recommendedActivity.details }}</p>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.75rem; opacity: 0.8;">{{ formatDate(recommendedActivity.date) }}</span>
            <span style="font-size: 0.75rem; font-weight: 500;">立即参与 →</span>
          </div>
        </div>
        
        <div v-else style="background: var(--gray-50); border-radius: var(--radius-lg); padding: 2rem; text-align: center; color: var(--gray-500);">
          
          <p style="font-size: 0.85rem; margin: 0;">暂无推荐活动，敬请期待</p>
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
const filterStatus = ref('all')
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
    
    // 状态筛选
    let statusMatch = true
    if (filterStatus.value !== 'all') {
      const activityStatus = getActivityStatus(activityDate)
      statusMatch = activityStatus === filterStatus.value
    }
    
    return statusMatch
  })
})

const recommendedActivity = computed(() => {
  const now = new Date()
  // 获取最近的可报名活动（状态为即将开始或正在进行）
  const availableActivities = activities.value.filter(activity => {
    const activityDate = new Date(activity.date)
    const status = getActivityStatus(activityDate)
    return status === 'upcoming' || status === 'ongoing'
  })
  
  // 按日期排序，返回最近的一个
  return availableActivities.sort((a, b) => new Date(a.date) - new Date(b.date))[0]
})



const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

const getActivityStatus = (activityDate) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const activityDay = new Date(activityDate.getFullYear(), activityDate.getMonth(), activityDate.getDate())
  
  const diffTime = activityDay - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'past'
  if (diffDays === 0) return 'ongoing'
  return 'upcoming'
}

const getStatusClass = (dateString) => {
  const activityDate = new Date(dateString)
  const status = getActivityStatus(activityDate)
  
  switch (status) {
    case 'upcoming':
      return 'status-upcoming'
    case 'ongoing':
      return 'status-ongoing'
    case 'past':
      return 'status-past'
    default:
      return 'status-past'
  }
}

const getStatusText = (dateString) => {
  const activityDate = new Date(dateString)
  const status = getActivityStatus(activityDate)
  
  switch (status) {
    case 'upcoming':
      return '即将开始'
    case 'ongoing':
      return '正在进行'
    case 'past':
      return '已结束'
    default:
      return '已结束'
  }
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
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.7rem;
  font-weight: 500;
  display: inline-block;
  min-width: 3rem;
  text-align: center;
}

.status-upcoming {
  background: var(--primary-red);
  color: white;
}

.status-ongoing {
  background: #10b981;
  color: white;
}

.status-past {
  background: var(--gray-300);
  color: var(--gray-700);
}
</style>