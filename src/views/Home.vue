<template>
  <div class="home">
    <!-- 顶部导航 -->
    <nav class="navbar">
      <div class="navbar-content">
        <div class="navbar-brand">
          <span class="heart-icon">❤️</span>
          缘梦—时光主理人
        </div>
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
          <div v-else style="display: flex; gap: 1rem;">
            <router-link to="/login" class="navbar-link">登录</router-link>
            <router-link to="/register" class="navbar-link">注册</router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <div class="container" style="padding-bottom: 80px;">
      <!-- 欢迎区域 -->
      <div class="festive-bg fade-in-up" style="margin: 1rem 0;">
        <div style="display: flex; align-items: center; gap: 2rem;">
          <!-- 左侧标题区域 -->
          <div style="flex: 1;">
            <h1 style="color: var(--primary-red); font-size: 1.5rem; margin-bottom: 0.5rem; text-align: left;">
              心桥·缘梦
            </h1>
            <h2 style="color: var(--gray-600); font-size: 0.9rem; text-align: left;">
              常州地区热门的脱单平台
            </h2>
          </div>
          <!-- 右侧图片区域 -->
          <div style="flex: 1; text-align: center;">
            <img src="/uploads/marry.png" alt="婚礼图标" style="max-width: 150px; height: auto; border-radius: var(--radius-lg);">
          </div>
        </div>
      </div>

      <!-- 性别选择 -->
      <div class="card fade-in-up">
        <div class="card-header" style="text-align: center; display: block;">
          <h2 style="font-size: 1.4rem; color: var(--gray-800); margin-bottom: 0.5rem;">您想找男生?还是找女生?</h2>
          <p style="color: var(--gray-500); font-size: 0.9rem;">登记资料后,推荐才能更精准</p>
        </div>
        <div style="display: flex; justify-content: space-around; gap: 1rem; margin-top: 1.5rem;">
          <!-- 男孩区域 -->
          <div style="text-align: center;">
            <div style="width: 120px; height: 120px; border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 0.75rem; border: 3px solid var(--purple-300); cursor: pointer;" @click="handleGenderSelection('male')">
              <img src="/uploads/male.jpg" alt="男孩" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <span style="background: linear-gradient(to right, #8A2BE2, #A569BD); color: white; padding: 0.5rem 1.5rem; border-radius: var(--radius-full); font-size: 1rem; cursor: pointer;" @click="handleGenderSelection('male')">男孩</span>
          </div>
          <!-- 女孩区域 -->
          <div style="text-align: center;">
            <div style="width: 120px; height: 120px; border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 0.75rem; border: 3px solid var(--red-300); cursor: pointer;" @click="handleGenderSelection('female')">
              <img src="/uploads/female.jpg" alt="女孩" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <span style="background: linear-gradient(to right, #FF6B6B, #FF8E8E); color: white; padding: 0.5rem 1.5rem; border-radius: var(--radius-full); font-size: 1rem; cursor: pointer;" @click="handleGenderSelection('female')">女孩</span>
          </div>
        </div>
        
        <!-- 推荐区域 - 男孩女孩交错排列 -->
        <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--gray-200);">
          <div v-if="interleavedUsers.length > 0" style="display: grid; gap: 1rem;">
            <div v-for="(user, index) in interleavedUsers" :key="user.id" 
                 :style="getUserCardStyle(user.gender)">
              <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                <div :style="getAvatarStyle(user.gender)">
                  <img :src="user.avatar || '/uploads/customer.png'" :alt="user.nickname || user.username" 
                       style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div>
                  <h4 :style="getUserNameStyle(user.gender)">{{ user.nickname || user.username }}</h4>
                  <p :style="getUserInfoStyle(user.gender)">{{ user.age }}岁 · {{ user.current_city }}</p>
                </div>
              </div>
              <p v-if="user.personal_introduction" 
                 style="color: var(--gray-600); font-size: 0.85rem; margin-bottom: 0.5rem;">
                {{ user.personal_introduction }}
              </p>
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <span :style="getTagStyle(user.gender)">
                  {{ user.height }}cm
                </span>
                <span :style="getTagStyle(user.gender)">
                  {{ user.education }}
                </span>
                <span :style="getTagStyle(user.gender)">
                  {{ user.occupation }}
                </span>
              </div>
            </div>
          </div>
          <div v-else-if="maleUsers.length === 0 && femaleUsers.length === 0" style="text-align: center; color: var(--gray-500); padding: 2rem;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">👥</div>
            <p>暂无推荐信息</p>
          </div>
          <div v-else style="text-align: center; color: var(--gray-500); padding: 1rem;">
            <p>加载推荐信息中...</p>
          </div>
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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { activityService } from '../services/index.js'
import { userService } from '../services/index.js'
import { useOnboardingStore } from '../stores/onboarding.js'

const router = useRouter()
const activities = ref([])
const maleUsers = ref([])
const femaleUsers = ref([])
const expandedSection = ref('')
const currentUser = ref(null)
const onboardingStore = useOnboardingStore()



const fetchActivities = async () => {
  try {
    const response = await activityService.getPublicActivities()
    activities.value = response
  } catch (error) {
    console.error('Failed to fetch activities:', error)
  }
}

const fetchUsersByGender = async (gender, limit = 1) => {
  try {
    const response = await userService.getLatestUsersByGender(gender, limit)
    if (gender === '男') {
      maleUsers.value = response
    } else {
      femaleUsers.value = response
    }
  } catch (error) {
    console.error(`Failed to fetch ${gender} users:`, error)
  }
}

const goToProfile = () => {
  router.push('/profile')
}

// 性别选择点击事件
const handleGenderSelection = (gender) => {
  // 开始onboarding流程，传入选择的性别
  onboardingStore.startOnboarding({ gender })
  
  // 跳转到步骤1页面
  router.push('/onboarding/step1')
}

const toggleSection = async (section) => {
  if (expandedSection.value === section) {
    expandedSection.value = ''
  } else {
    expandedSection.value = section
    if (section === 'male' && maleUsers.value.length === 0) {
      await fetchUsersByGender('男')
    } else if (section === 'female' && femaleUsers.value.length === 0) {
      await fetchUsersByGender('女')
    }
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

// 计算属性：交错排列的用户列表
const interleavedUsers = computed(() => {
  const result = []
  const maxLength = Math.max(maleUsers.value.length, femaleUsers.value.length)
  
  for (let i = 0; i < maxLength; i++) {
    if (i < maleUsers.value.length) {
      result.push(maleUsers.value[i])
    }
    if (i < femaleUsers.value.length) {
      result.push(femaleUsers.value[i])
    }
  }
  
  return result.slice(0, 10) // 限制显示10个用户（5男5女）
})

// 根据性别获取卡片样式
const getUserCardStyle = (gender) => {
  if (gender === '男') {
    return {
      border: '1px solid var(--purple-200)',
      borderRadius: 'var(--radius-lg)',
      padding: '1rem',
      background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)'
    }
  } else {
    return {
      border: '1px solid var(--red-200)',
      borderRadius: 'var(--radius-lg)',
      padding: '1rem',
      background: 'linear-gradient(135deg, #fef2f2, #fee2e2)'
    }
  }
}

// 根据性别获取头像样式
const getAvatarStyle = (gender) => {
  if (gender === '男') {
    return {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      overflow: 'hidden',
      border: '2px solid var(--purple-300)'
    }
  } else {
    return {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      overflow: 'hidden',
      border: '2px solid var(--red-300)'
    }
  }
}

// 根据性别获取用户名样式
const getUserNameStyle = (gender) => {
  if (gender === '男') {
    return {
      color: 'var(--purple-700)',
      fontSize: '1rem'
    }
  } else {
    return {
      color: 'var(--red-700)',
      fontSize: '1rem'
    }
  }
}

// 根据性别获取用户信息样式
const getUserInfoStyle = (gender) => {
  if (gender === '男') {
    return {
      color: 'var(--purple-600)',
      fontSize: '0.8rem'
    }
  } else {
    return {
      color: 'var(--red-600)',
      fontSize: '0.8rem'
    }
  }
}

// 根据性别获取标签样式
const getTagStyle = (gender) => {
  if (gender === '男') {
    return {
      background: 'var(--purple-100)',
      color: 'var(--purple-700)',
      padding: '0.25rem 0.5rem',
      borderRadius: 'var(--radius-sm)',
      fontSize: '0.75rem'
    }
  } else {
    return {
      background: 'var(--red-100)',
      color: 'var(--red-700)',
      padding: '0.25rem 0.5rem',
      borderRadius: 'var(--radius-sm)',
      fontSize: '0.75rem'
    }
  }
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

onMounted(async () => {
  await fetchCurrentUser()
  await fetchActivities()
  // 加载男女用户数据用于交错显示（各5个）
  await fetchUsersByGender('男', 5)
  await fetchUsersByGender('女', 5)
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