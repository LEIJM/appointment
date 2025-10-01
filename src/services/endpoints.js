// API端点配置
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register'
  },
  
  // 用户相关
  USERS: {
    BASE: '/users',
    DETAILS: (id) => `/users/${id}`,
    UPDATE_DETAILS: (id) => `/users/${id}/details`,
    LATEST_BY_GENDER: (gender) => `/users/latest/${gender}`
  },
  
  // 活动相关
  ACTIVITIES: {
    BASE: '/activities',
    DETAILS: (id) => `/activities/${id}`,
    PUBLIC: '/activities/public',
    PUBLIC_DETAILS: (id) => `/activities/${id}/public`,
    REGISTER: (id) => `/activities/${id}/register`,
    CANCEL_REGISTRATION: (id) => `/activities/${id}/register`,
    REGISTRATIONS: (id) => `/activities/${id}/registrations`
  },
  
  // 管理后台
  ADMIN: {
    STATS: {
      USERS: '/admin/stats/users',
      ACTIVITIES: '/admin/stats/activities'
    },
    USERS: {
      BASE: '/admin/users',
      RECENT: '/admin/users/recent',
      BY_ID: (id) => `/admin/users/${id}`
    },
    ACTIVITIES: {
      BASE: '/admin/activities',
      RECENT: '/admin/activities/recent',
      CREATE: '/admin/activities/create',
      UPDATE: (id) => `/admin/activities/${id}`,
      UPDATE_STATUS: (id) => `/admin/activities/${id}/status`
    }
  }
}