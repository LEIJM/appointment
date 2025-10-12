import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userService } from '../services/index.js'

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || '')
  
  // 登录
  const login = async (loginData) => {
    try {
      const response = await userService.login(loginData)
      if (response.success) {
        user.value = response.user
        token.value = response.token
        localStorage.setItem('token', response.token)
        localStorage.setItem('userId', response.user.id)
        return response
      }
      return response
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  }
  
  // 注册
  const register = async (registerData) => {
    try {
      const response = await userService.register(registerData.username, registerData.password)
      return response
    } catch (error) {
      console.error('注册失败:', error)
      // 确保错误信息能传递给调用者
      throw error
    }
  }
  
  // 登出
  const logout = () => {
    user.value = null
    token.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
  }
  
  // 获取用户信息
  const getUserInfo = async () => {
    try {
      const userId = localStorage.getItem('userId')
      if (userId) {
        const response = await userService.getUserById(userId)
        user.value = response
        return response
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }
  
  // 更新用户信息
  const updateUserInfo = async (userData) => {
    try {
      const response = await userService.updateUser(userData)
      if (response.success) {
        user.value = response.user
      }
      return response
    } catch (error) {
      console.error('更新用户信息失败:', error)
      throw error
    }
  }
  
  return {
    user,
    token,
    login,
    register,
    logout,
    getUserInfo,
    updateUserInfo
  }
})