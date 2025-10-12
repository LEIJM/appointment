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
import OnboardingStep1 from '../views/onboarding/OnboardingStep1.vue'
import OnboardingStep2 from '../views/onboarding/OnboardingStep2.vue'
import OnboardingStep3 from '../views/onboarding/OnboardingStep3.vue'
import OnboardingStep4 from '../views/onboarding/OnboardingStep4.vue'
import OnboardingStep5 from '../views/onboarding/OnboardingStep5.vue'
import OnboardingStep6 from '../views/onboarding/OnboardingStep6.vue'
import OnboardingStep7 from '../views/onboarding/OnboardingStep7.vue'
import QuickRegister from '../views/onboarding/QuickRegister.vue'

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
    meta: { title: '活动列表 - 缘梦' }
  },
  {
    path: '/activities/:id',
    name: 'ActivityDetails',
    component: ActivityDetails,
    meta: { title: '活动详情 - 缘梦' }
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

  // 多步骤信息收集路由
  {
    path: '/onboarding/step1',
    name: 'OnboardingStep1',
    component: OnboardingStep1,
    meta: { title: '选择性别' }
  },
  {
    path: '/onboarding/step2',
    name: 'OnboardingStep2',
    component: OnboardingStep2,
    meta: { title: '选择年龄' }
  },
  {
    path: '/onboarding/step3',
    name: 'OnboardingStep3',
    component: OnboardingStep3,
    meta: { title: '选择地区' }
  },
  {
    path: '/onboarding/step4',
    name: 'OnboardingStep4',
    component: OnboardingStep4,
    meta: { title: '选择学历' }
  },
  {
    path: '/onboarding/step5',
    name: 'OnboardingStep5',
    component: OnboardingStep5,
    meta: { title: '选择职业' }
  },
  {
    path: '/onboarding/step6',
    name: 'OnboardingStep6',
    component: OnboardingStep6,
    meta: { title: '选择收入' }
  },
  {
    path: '/onboarding/step7',
    name: 'OnboardingStep7',
    component: OnboardingStep7,
    meta: { title: '选择身高' }
  },
  {
    path: '/onboarding/register',
    name: 'QuickRegister',
    component: QuickRegister,
    meta: { title: '快速注册' }
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