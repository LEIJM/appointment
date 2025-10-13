<template>
  <div class="past-activities">
    <!-- 背景图片 -->
    <div class="background-overlay"></div>
    
    <div class="container">
      <!-- 页面标题 -->
      <div style="text-align: center; margin-bottom: 2rem;">
        <h1 style="color: var(--gray-900); font-size: 1.75rem; font-weight: 600; margin: 0 0 0.5rem 0;">往期活动回顾</h1>
        <p style="color: var(--gray-500); font-size: 0.9rem; margin: 0;">美好回忆，值得珍藏</p>
        <div v-if="pastActivities.length > 0" style="margin-top: 1rem; display: inline-flex; align-items: center; gap: 0.5rem; background: var(--primary-red); color: white; padding: 0.5rem 1rem; border-radius: 2rem; font-size: 0.9rem;">
          <span>📸</span>
          <span>共 {{ pastActivities.length }} 个精彩活动</span>
        </div>
      </div>

      <!-- 返回按钮 -->
      <div style="margin-bottom: 1.5rem;">
        <button @click="$router.push('/activities')" 
                style="background: rgba(255, 255, 255, 0.9); border: 1px solid var(--gray-300); color: var(--gray-700); padding: 0.5rem 1rem; border-radius: var(--radius-md); font-size: 0.85rem; cursor: pointer; transition: all 0.2s ease;"
                @mouseenter="$event.target.style.backgroundColor = 'rgba(255, 255, 255, 1)'"
                @mouseleave="$event.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'">
          ← 返回活动列表
        </button>
      </div>

      <!-- 往期活动列表 -->
      <div v-if="loading" style="text-align: center; padding: 3rem;">
        <div style="font-size: 2rem; margin-bottom: 1rem; color: var(--gray-400);">加载中...</div>
      </div>
      
      <div v-else-if="pastActivities.length > 0" style="display: grid; gap: 1rem;">
        <div v-for="(activity, index) in pastActivities" :key="activity.id" 
             class="activity-card fade-in-up"
             :style="{ animationDelay: `${index * 0.1}s` }"
             style="background: rgba(255, 255, 255, 0.95); border-radius: var(--radius-lg); overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: all 0.2s ease; cursor: pointer;"
             @mouseenter="$event.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'"
             @mouseleave="$event.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'"
             @click="viewActivityDetails(activity)">
          
          <!-- 活动图片 -->
            <div style="height: 12rem; background: linear-gradient(135deg, var(--primary-red), #ff6b6b); display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;">
              <img 
                v-if="activity.photos"
                :src="activity.photos.split(',')[0]" 
                :alt="activity.title"
                style="width: 100%; height: 100%; object-fit: cover;"
                @error="$event.target.style.display='none'"
              >
              <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 3rem; opacity: 0.8;">📸</div>
            </div>
          
          <!-- 活动信息 -->
          <div style="padding: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <h3 style="color: var(--gray-900); font-size: 1.2rem; font-weight: 600; margin: 0; line-height: 1.4; flex: 1; margin-right: 0.5rem;">{{ activity.title }}</h3>
              <span style="background: var(--gray-300); color: var(--gray-700); padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 500; white-space: nowrap;">
                已结束
              </span>
            </div>
            <p style="color: var(--gray-600); font-size: 0.85rem; margin: 0 0 0.75rem 0; line-height: 1.4;">{{ activity.details }}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: var(--gray-500); font-size: 0.75rem;">
                📅 {{ formatDate(activity.date) }}
              </span>
              <span style="color: var(--primary-red); font-size: 0.75rem; font-weight: 500;">
                查看详情 →
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else style="background: rgba(255, 255, 255, 0.9); border-radius: var(--radius-lg); padding: 3rem; text-align: center; color: var(--gray-500);">
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">📸</div>
        <p style="font-size: 0.9rem; margin: 0;">暂无往期活动记录</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { activityService } from '../services'

const router = useRouter()
const loading = ref(true)
const activities = ref([])

// 获取所有活动
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

// 计算属性：只显示已结束的活动
const pastActivities = computed(() => {
  const now = new Date()
  return activities.value.filter(activity => {
    const activityDate = new Date(activity.date)
    return activityDate < now // 只显示已结束的活动
  }).sort((a, b) => new Date(b.date) - new Date(a.date)) // 按日期降序排列
})

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

// 查看活动详情
const viewActivityDetails = (activity) => {
  router.push(`/activities/${activity.id}`)
}

onMounted(() => {
  fetchActivities()
})
</script>

<style scoped>
.past-activities {
  min-height: 100vh;
  padding: 1rem 0;
  background: transparent;
  position: relative;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

/* 背景图片样式 */
.background-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/uploads/background.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  opacity: 0.2;
  z-index: -1;
  pointer-events: none;
  min-height: 100vh;
  width: 100vw;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .page-header p {
    font-size: 0.9rem;
  }
  
  .activity-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .back-button {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .activity-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>