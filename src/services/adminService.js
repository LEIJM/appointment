import api from './api.js'
import { API_ENDPOINTS } from './endpoints.js'

export const adminService = {
  // 获取用户统计
  async getUserStats() {
    const response = await api.get(API_ENDPOINTS.ADMIN.STATS.USERS)
    return response.data
  },

  // 获取活动统计
  async getActivityStats() {
    const response = await api.get(API_ENDPOINTS.ADMIN.STATS.ACTIVITIES)
    return response.data
  },

  // 获取用户列表
  async getUsers() {
    const response = await api.get(API_ENDPOINTS.ADMIN.USERS.BASE)
    return response.data
  },

  // 获取最近用户
  async getRecentUsers() {
    const response = await api.get(API_ENDPOINTS.ADMIN.USERS.RECENT)
    return response.data
  },

  // 创建用户
  async createUser(userData) {
    const response = await api.post(API_ENDPOINTS.ADMIN.USERS.BASE, userData)
    return response.data
  },

  // 更新用户
  async updateUser(userId, userData) {
    const response = await api.put(API_ENDPOINTS.ADMIN.USERS.BY_ID(userId), userData)
    return response.data
  },

  // 获取活动列表
  async getActivities() {
    const response = await api.get(API_ENDPOINTS.ADMIN.ACTIVITIES.BASE)
    return response.data
  },

  // 获取最近活动
  async getRecentActivities() {
    const response = await api.get(API_ENDPOINTS.ADMIN.ACTIVITIES.RECENT)
    return response.data
  },

  // 创建活动
  async createActivity(formData) {
    const response = await api.post(API_ENDPOINTS.ADMIN.ACTIVITIES.CREATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // 更新活动
  async updateActivity(activityId, formData) {
    const response = await api.put(API_ENDPOINTS.ADMIN.ACTIVITIES.UPDATE(activityId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // 更新活动状态
  async updateActivityStatus(activityId, status) {
    const response = await api.put(API_ENDPOINTS.ADMIN.ACTIVITIES.UPDATE_STATUS(activityId), { status })
    return response.data
  }
}