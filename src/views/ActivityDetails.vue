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
                <div v-else-if="countdown" style="color: var(--primary-red); font-size: 0.8rem; margin-top: 0.2rem;">
                  {{ countdown }}
                </div>
              </span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="font-weight: 600;">参与人数：</span>
              <span>
                {{ activity.registration_count || 0 }} / {{ activity.max_participants || '不限' }}
                <span v-if="activity.max_participants && activity.registration_count >= activity.max_participants" 
                      style="color: var(--danger-red); margin-left: 0.5rem;">
                  (已满)
                </span>
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
                 style="border-radius: var(--radius-lg); overflow: hidden; aspect-ratio: 16/9; cursor: pointer;"
                 @click="openPhotoViewer(index)">
              <img :src="photo" :alt="`活动照片 ${index + 1}`" 
                   style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;"
                   @mouseenter="$event.target.style.transform = 'scale(1.05)'"
                   @mouseleave="$event.target.style.transform = 'scale(1)'">
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
            <button 
              class="btn btn-outline" 
              style="padding: 0.75rem 2rem;"
              @click="shareActivity"
            >
              📤 分享活动
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

    <!-- 照片查看器 -->
    <div v-if="showPhotoViewer" class="photo-viewer-overlay" @click="closePhotoViewer">
      <div class="photo-viewer-container">
        <!-- 关闭按钮 -->
        <button class="photo-viewer-close" @click="closePhotoViewer">✕</button>
        
        <!-- 图片显示区域 -->
        <div class="photo-viewer-image-container"
             @touchstart="handleTouchStart"
             @touchmove="handleTouchMove"
             @touchend="handleTouchEnd">
          <img :src="currentPhotos[currentPhotoIndex]" 
               :alt="`活动照片 ${currentPhotoIndex + 1}`"
               class="photo-viewer-image"
               @click.stop>
        </div>
        
        <!-- 图片计数器 -->
        <div class="photo-viewer-counter">
          {{ currentPhotoIndex + 1 }} / {{ currentPhotos.length }}
        </div>
        
        <!-- 导航按钮 -->
        <button v-if="currentPhotos.length > 1" 
                class="photo-viewer-nav photo-viewer-prev" 
                @click.stop="prevPhoto"
                :disabled="currentPhotoIndex === 0">
          ‹
        </button>
        <button v-if="currentPhotos.length > 1" 
                class="photo-viewer-nav photo-viewer-next" 
                @click.stop="nextPhoto"
                :disabled="currentPhotoIndex === currentPhotos.length - 1">
          ›
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { activityService } from '../services/index.js'
import { userService } from '../services/index.js'

const router = useRouter()
const route = useRoute()
const activity = ref(null)
const loading = ref(true)
const error = ref('')
const currentUser = ref(null)
const showPhotoViewer = ref(false)
const currentPhotoIndex = ref(0)
const currentPhotos = ref([])

// 触摸手势相关
const touchStartX = ref(0)
const touchEndX = ref(0)
const isDragging = ref(false)

// 倒计时相关
const countdown = ref('')
let countdownTimer = null

const fetchActivityDetails = async () => {
  try {
    const activityId = route.params.id
    const token = localStorage.getItem('token')
    
    // 如果用户已登录，使用需要认证的接口获取详细信息（包含报名状态）
    // 如果用户未登录，使用公开接口获取基本信息
    const response = token 
      ? await activityService.getActivityById(activityId)
      : await activityService.getPublicActivityById(activityId)
    
    activity.value = response
    
    // 确保 registration_count 有值
    if (activity.value && typeof activity.value.registration_count === 'undefined') {
      activity.value.registration_count = 0
    }
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

  // 检查用户是否登录
  const token = localStorage.getItem('token')
  if (!token) {
    // 未登录，跳转到登录页面
    router.push('/login')
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

const openPhotoViewer = (index) => {
  if (activity.value && activity.value.photos) {
    currentPhotos.value = activity.value.photos.split(',')
    currentPhotoIndex.value = index
    showPhotoViewer.value = true
    document.body.style.overflow = 'hidden'
  }
}

const closePhotoViewer = () => {
  showPhotoViewer.value = false
  document.body.style.overflow = ''
}

const prevPhoto = () => {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--
  }
}

const nextPhoto = () => {
  if (currentPhotoIndex.value < currentPhotos.value.length - 1) {
    currentPhotoIndex.value++
  }
}

// 键盘导航
const handleKeyNavigation = (event) => {
  if (!showPhotoViewer.value) return
  
  switch (event.key) {
    case 'Escape':
      closePhotoViewer()
      break
    case 'ArrowLeft':
      prevPhoto()
      break
    case 'ArrowRight':
      nextPhoto()
      break
  }
}

// 触摸手势支持
const handleTouchStart = (event) => {
  touchStartX.value = event.touches[0].clientX
  isDragging.value = true
}

const handleTouchMove = (event) => {
  if (!isDragging.value) return
  touchEndX.value = event.touches[0].clientX
}

const handleTouchEnd = () => {
  if (!isDragging.value) return
  isDragging.value = false
  
  const swipeThreshold = 50 // 最小滑动距离
  const diff = touchStartX.value - touchEndX.value
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // 向左滑动 - 下一张照片
      nextPhoto()
    } else {
      // 向右滑动 - 上一张照片
      prevPhoto()
    }
  }
}

// 倒计时函数
const updateCountdown = () => {
  if (!activity.value || !activity.value.registration_deadline) return
  
  const deadline = new Date(activity.value.registration_deadline)
  const now = new Date()
  const diff = deadline - now
  
  if (diff <= 0) {
    countdown.value = ''
    return
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  if (days > 0) {
    countdown.value = `剩余 ${days}天 ${hours}小时`
  } else if (hours > 0) {
    countdown.value = `剩余 ${hours}小时 ${minutes}分钟`
  } else if (minutes > 0) {
    countdown.value = `剩余 ${minutes}分钟 ${seconds}秒`
  } else {
    countdown.value = `剩余 ${seconds}秒`
  }
}

// 分享功能
const shareActivity = async () => {
  try {
    const shareUrl = `${window.location.origin}/activity/${activity.value.id}`
    const shareText = `快来参加${activity.value.title}活动吧！`
    
    // 如果支持 Web Share API
    if (navigator.share) {
      await navigator.share({
        title: activity.value.title,
        text: shareText,
        url: shareUrl
      })
    } else {
      // 复制到剪贴板
      await navigator.clipboard.writeText(shareUrl)
      alert('活动链接已复制到剪贴板，快去分享给朋友吧！')
    }
  } catch (error) {
    console.error('分享失败:', error)
    // 降级方案：复制到剪贴板
    try {
      const shareUrl = `${window.location.origin}/activity/${activity.value.id}`
      await navigator.clipboard.writeText(shareUrl)
      alert('活动链接已复制到剪贴板，快去分享给朋友吧！')
    } catch (clipboardError) {
      alert('分享失败，请手动复制页面链接')
    }
  }
}

// 添加键盘事件监听
onMounted(() => {
  fetchActivityDetails()
  fetchCurrentUser()
  document.addEventListener('keydown', handleKeyNavigation)
  
  // 启动倒计时
  updateCountdown()
  countdownTimer = setInterval(updateCountdown, 1000)
})

// 清理事件监听
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyNavigation)
  document.body.style.overflow = ''
  // 清理倒计时定时器
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
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

/* 照片查看器样式 */
.photo-viewer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.photo-viewer-container {
  position: relative;
  width: 90%;
  height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-viewer-image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: pan-y;
  -webkit-user-select: none;
  user-select: none;
}

.photo-viewer-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: var(--radius-lg);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  animation: zoomIn 0.3s ease;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
}

.photo-viewer-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 24px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10000;
}

.photo-viewer-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.photo-viewer-counter {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: 500;
  z-index: 10000;
}

.photo-viewer-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10000;
}

.photo-viewer-nav:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
}

.photo-viewer-nav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.photo-viewer-prev {
  left: 20px;
}

.photo-viewer-next {
  right: 20px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoomIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .photo-viewer-container {
    width: 95%;
    height: 95%;
  }
  
  .photo-viewer-close {
    top: 15px;
    right: 15px;
    width: 35px;
    height: 35px;
    font-size: 20px;
  }
  
  .photo-viewer-nav {
    width: 40px;
    height: 40px;
    font-size: 24px;
  }
  
  .photo-viewer-prev {
    left: 10px;
  }
  
  .photo-viewer-next {
    right: 10px;
  }
}
</style>