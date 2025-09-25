<template>
  <div class="admin-dashboard">
    <!-- 顶部导航 -->
    <nav class="navbar">
      <div class="navbar-content">
        <router-link to="/" class="navbar-brand">
          <span class="heart-icon">❤️</span>
          缘梦—时光主理人 - 管理后台
        </router-link>
        <div class="navbar-menu">
          <span style="color: var(--gray-600); margin-right: 1rem;">管理员: {{ adminName }}</span>
          <button @click="logout" class="btn btn-outline">退出</button>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <div class="container" style="padding-bottom: 80px;">
      <!-- 页面标题 -->
      <div class="festive-bg fade-in-up" style="margin: 1rem 0; text-align: center;">
        <h1 style="color: var(--primary-red); font-size: 1.5rem; margin-bottom: 0.5rem;">
          管理后台
        </h1>
        <p style="color: var(--gray-600); font-size: 0.9rem;">
          欢迎回来，管理员 🎯
        </p>
      </div>

      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div class="stats-card fade-in-up">
          <div class="stats-icon" style="background: rgba(239, 68, 68, 0.1); color: var(--primary-red);">
            👥
          </div>
          <div class="stats-content">
            <div class="stats-number">{{ stats.totalUsers }}</div>
            <div class="stats-label">总用户数</div>
          </div>
        </div>
        
        <div class="stats-card fade-in-up">
          <div class="stats-icon" style="background: rgba(52, 211, 153, 0.1); color: var(--secondary-green);">
            🎉
          </div>
          <div class="stats-content">
            <div class="stats-number">{{ stats.totalActivities }}</div>
            <div class="stats-label">总活动数</div>
          </div>
        </div>
        
        <div class="stats-card fade-in-up">
          <div class="stats-icon" style="background: rgba(251, 191, 36, 0.1); color: var(--accent-gold);">
            🔥
          </div>
          <div class="stats-content">
            <div class="stats-number">{{ stats.activeActivities }}</div>
            <div class="stats-label">进行中活动</div>
          </div>
        </div>
        
        <div class="stats-card fade-in-up">
          <div class="stats-icon" style="background: rgba(59, 130, 246, 0.1); color: var(--primary-blue);">
            📱
          </div>
          <div class="stats-content">
            <div class="stats-number">{{ stats.todayUsers }}</div>
            <div class="stats-label">今日新用户</div>
          </div>
        </div>
      </div>

      <!-- 快速操作 -->
      <div class="card fade-in-up">
        <div class="card-header">
          <span style="font-size: 1.2rem;">⚡</span>
          快速操作
        </div>
        <div class="quick-actions">
          <router-link to="/admin/users" class="quick-action">
            <div class="quick-action-icon">👥</div>
            <div class="quick-action-text">用户管理</div>
          </router-link>
          <router-link to="/admin/activities" class="quick-action">
            <div class="quick-action-icon">🎉</div>
            <div class="quick-action-text">活动管理</div>
          </router-link>
          <router-link to="/admin/reports" class="quick-action">
            <div class="quick-action-icon">📊</div>
            <div class="quick-action-text">数据统计</div>
          </router-link>
          <router-link to="/admin/settings" class="quick-action">
            <div class="quick-action-icon">⚙️</div>
            <div class="quick-action-text">系统设置</div>
          </router-link>
        </div>
      </div>

      <!-- 最近活动 -->
      <div class="card fade-in-up">
        <div class="card-header">
          <span style="font-size: 1.2rem;">🎉</span>
          最近活动
          <router-link to="/admin/activities" style="margin-left: auto; color: var(--primary-red); font-size: 0.9rem;">
            查看全部 →
          </router-link>
        </div>
        <div v-if="recentActivities.length === 0" style="text-align: center; padding: 2rem; color: var(--gray-500);">
          暂无活动数据
        </div>
        <div v-else class="activity-list">
          <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
            <div class="activity-info">
              <div class="activity-title">{{ activity.title }}</div>
              <div class="activity-date">{{ formatDate(activity.date) }}</div>
              <div class="activity-location">📍 {{ activity.location }}</div>
            </div>
            <div class="activity-stats">
              <div class="activity-participants">👥 {{ activity.participants }}/{{ activity.max_participants }}</div>
              <div :class="['activity-status', activity.status]">
                {{ getStatusText(activity.status) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近用户 -->
      <div class="card fade-in-up">
        <div class="card-header">
          <span style="font-size: 1.2rem;">👤</span>
          最近注册用户
          <router-link to="/admin/users" style="margin-left: auto; color: var(--primary-red); font-size: 0.9rem;">
            查看全部 →
          </router-link>
        </div>
        <div v-if="recentUsers.length === 0" style="text-align: center; padding: 2rem; color: var(--gray-500);">
          暂无用户数据
        </div>
        <div v-else class="user-list">
          <div v-for="user in recentUsers" :key="user.id" class="user-item">
            <div class="user-avatar">{{ user.nickname?.charAt(0) || user.username?.charAt(0) || '?' }}</div>
            <div class="user-info">
              <div class="user-name">{{ user.nickname || user.username }}</div>
              <div class="user-email">{{ user.email }}</div>
              <div class="user-date">{{ formatDate(user.created_at) }}</div>
            </div>
            <div class="user-status">
              <div :class="['status-dot', user.is_verified ? 'verified' : 'unverified']"></div>
              {{ user.is_verified ? '已验证' : '未验证' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <div class="bottom-nav">
      <router-link to="/admin" class="bottom-nav-item active">
        <span style="font-size: 1.2rem;">📊</span>
        <span>概览</span>
      </router-link>
      <router-link to="/admin/users" class="bottom-nav-item">
        <span style="font-size: 1.2rem;">👥</span>
        <span>用户</span>
      </router-link>
      <router-link to="/admin/activities" class="bottom-nav-item">
        <span style="font-size: 1.2rem;">🎉</span>
        <span>活动</span>
      </router-link>
      <div class="bottom-nav-item" @click="logout">
        <span style="font-size: 1.2rem;">🚪</span>
        <span>退出</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const adminName = ref('Admin')
const stats = ref({
  totalUsers: 0,
  totalActivities: 0,
  activeActivities: 0,
  todayUsers: 0
})
const recentActivities = ref([])
const recentUsers = ref([])

const fetchDashboardData = async () => {
  try {
    const token = localStorage.getItem('token')
    
    const [usersRes, activitiesRes, recentUsersRes, recentActivitiesRes] = await Promise.all([
      axios.get('http://localhost:3001/api/admin/stats/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      axios.get('http://localhost:3001/api/admin/stats/activities', {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      axios.get('http://localhost:3001/api/admin/users/recent', {
        headers: { 'Authorization': `Bearer ${token}` }
      }),
      axios.get('http://localhost:3001/api/admin/activities/recent', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    ])
    
    stats.value = usersRes.data
    recentUsers.value = recentUsersRes.data
    recentActivities.value = recentActivitiesRes.data
    
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
    if (error.response?.status === 401) {
      router.push('/login')
    }
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const getStatusText = (status) => {
  const statusMap = {
    'upcoming': '即将开始',
    'ongoing': '进行中',
    'completed': '已结束',
    'cancelled': '已取消'
  }
  return statusMap[status] || status
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  localStorage.removeItem('username')
  localStorage.removeItem('role')
  router.push('/login')
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  padding-top: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stats-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stats-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stats-number {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--gray-800);
}

.stats-label {
  font-size: 0.9rem;
  color: var(--gray-600);
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.quick-action {
  background: white;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;
}

.quick-action:hover {
  border-color: var(--primary-red);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.quick-action-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.quick-action-text {
  font-size: 0.9rem;
  color: var(--gray-700);
}

.activity-list, .user-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item, .user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--gray-50);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--primary-red);
}

.activity-info, .user-info {
  flex: 1;
}

.activity-title, .user-name {
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 0.25rem;
}

.activity-date, .activity-location, .user-email, .user-date {
  font-size: 0.8rem;
  color: var(--gray-600);
}

.activity-stats, .user-status {
  text-align: right;
}

.activity-participants {
  font-size: 0.9rem;
  color: var(--gray-700);
  margin-bottom: 0.25rem;
}

.activity-status {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-weight: 500;
}

.activity-status.upcoming {
  background: rgba(251, 191, 36, 0.1);
  color: var(--accent-gold);
}

.activity-status.ongoing {
  background: rgba(52, 211, 153, 0.1);
  color: var(--secondary-green);
}

.activity-status.completed {
  background: rgba(107, 114, 128, 0.1);
  color: var(--gray-600);
}

.activity-status.cancelled {
  background: rgba(239, 68, 68, 0.1);
  color: var(--primary-red);
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--primary-red);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 1rem;
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  display: inline-block;
  margin-right: 0.25rem;
}

.status-dot.verified {
  background: var(--secondary-green);
}

.status-dot.unverified {
  background: var(--gray-400);
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