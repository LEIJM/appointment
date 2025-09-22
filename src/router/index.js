import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'

// Import pages
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import UserDetails from '../views/UserDetails.vue'
import Activities from '../views/Activities.vue'
import AdminDashboard from '../views/admin/Dashboard.vue'
import AdminUsers from '../views/admin/Users.vue'
import AdminActivities from '../views/admin/Activities.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页 - 缘来是你' }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录 - 缘来是你' }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { title: '注册 - 缘来是你' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { title: '个人中心 - 缘来是你', requiresAuth: true }
  },
  {
    path: '/user-details',
    name: 'UserDetails',
    component: UserDetails,
    meta: { title: '详细资料 - 缘来是你', requiresAuth: true }
  },
  {
    path: '/activities',
    name: 'Activities',
    component: Activities,
    meta: { title: '活动 - 缘来是你', requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { title: '管理后台 - 缘来是你', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: AdminUsers,
    meta: { title: '用户管理 - 缘来是你', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/activities',
    name: 'AdminActivities',
    component: AdminActivities,
    meta: { title: '活动管理 - 缘来是你', requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Set page title
  document.title = to.meta.title || '缘来是你 - 相亲交友平台'
  
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