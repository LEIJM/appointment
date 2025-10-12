import api from './api.js'
import { API_ENDPOINTS } from './endpoints.js'

export const userService = {
  // 用户登录
  async login(username, password) {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
      username,
      password
    })
    return response.data
  },

  // 用户注册
  async register(username, password) {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, {
      username,
      password
    })
    return response.data
  },

  // 获取用户信息
  async getUserById(userId) {
    const response = await api.get(API_ENDPOINTS.USERS.DETAILS(userId))
    return response.data
  },

  // 更新用户详情
  async updateUserDetails(userId, formData) {
    const response = await api.put(API_ENDPOINTS.USERS.UPDATE_DETAILS(userId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // 根据性别获取最新用户
  async getLatestUsersByGender(gender, limit = 1) {
    const response = await api.get(API_ENDPOINTS.USERS.LATEST_BY_GENDER(gender), {
      params: { limit }
    })
    return response.data
  },

  // 批量更新用户信息（用于onboarding流程）
  async batchUpdateUserInfo(userData) {
    const response = await api.put(API_ENDPOINTS.USERS.UPDATE_BATCH, userData)
    return response.data
  }
}