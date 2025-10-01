import api from './api.js'
import { API_ENDPOINTS } from './endpoints.js'

export const activityService = {
  // 获取活动列表（需要认证）
  async getActivities() {
    const response = await api.get(API_ENDPOINTS.ACTIVITIES.BASE)
    return response.data
  },

  // 获取公开活动列表（无需认证）
  async getPublicActivities() {
    const response = await api.get(API_ENDPOINTS.ACTIVITIES.PUBLIC)
    return response.data
  },

  // 获取活动详情
  async getActivityById(activityId) {
    const response = await api.get(API_ENDPOINTS.ACTIVITIES.DETAILS(activityId))
    return response.data
  },

  // 获取活动详情（公开访问，无需认证）
  async getPublicActivityById(activityId) {
    const response = await api.get(API_ENDPOINTS.ACTIVITIES.PUBLIC_DETAILS(activityId))
    return response.data
  },

  // 活动报名
  async registerForActivity(activityId, notes = '') {
    const response = await api.post(API_ENDPOINTS.ACTIVITIES.REGISTER(activityId), { notes })
    return response.data
  },

  // 取消活动报名
  async cancelRegistration(activityId) {
    const response = await api.delete(API_ENDPOINTS.ACTIVITIES.CANCEL_REGISTRATION(activityId))
    return response.data
  },

  // 获取活动报名列表
  async getActivityRegistrations(activityId) {
    const response = await api.get(API_ENDPOINTS.ACTIVITIES.REGISTRATIONS(activityId))
    return response.data
  }
}