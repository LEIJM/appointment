import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'

// Import pages
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import UserDetails from '../views/UserDetails.vue'
import Activities from '../views/Activities.vue'
import ActivityDetails from '../views/ActivityDetails.vue'
import AdminDashboard from '../views/admin/Dashboard.vue'
import AdminUsers from '../views/admin/Users.vue'
import AdminActivities from '../views/admin/Activities.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页 - 缘梦' }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录 - 缘梦' }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { title: '注册 - 缘梦' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { title: '个人中心 - 缘梦', requiresAuth: true }
  },
  {
    path: '/user-details',
    name: 'UserDetails',
    component: UserDetails,
    meta: { title: '详细资料 - 缘梦', requiresAuth: true }
  },
  {
    path: '/activities',
    name: 'Activities',
    component: Activities,
    meta: { title: '活动列表 - 缘梦', requiresAuth: true }
  },
  {
    path: '/activities/:id',
    name: 'ActivityDetails',
    component: ActivityDetails,
    meta: { title: '活动详情 - 缘梦', requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { title: '管理后台 - 缘梦', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: AdminUsers,
    meta: { title: '用户管理 - 缘梦', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/activities',
    name: 'AdminActivities',
    component: AdminActivities,
    meta: { title: '活动管理 - 缘梦', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/reports',
    name: 'AdminReports',
    component: {
      template: '<div class="container"><div class="card"><div class="card-header">📊 数据统计</div><div style="padding:1rem;">施工中...</div></div></div>'
    },
    meta: { title: '数据统计 - 缘梦', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/settings',
    name: 'AdminSettings',
    component: {
      template: '<div class="container"><div class="card"><div class="card-header">⚙️ 系统设置</div><div style="padding:1rem;">施工中...</div></div></div>'
    },
    meta: { title: '系统设置 - 缘梦', requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Set page title
  document.title = to.meta.title || '缘梦 - 相亲交友平台'
  
  // Check authentication
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
    return
  }
  
  if (to.meta.requiresAdmin && userRole !== 'admin') {
    next('/')
    return
  }
  
  next()
})

export default router

// Create Pinia store
export const pinia = createPinia()