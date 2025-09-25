<template>
  <div class="admin-users">
    <!-- 顶部导航 -->
    <nav class="navbar">
      <div class="navbar-content">
        <router-link to="/" class="navbar-brand">
          <span class="heart-icon">❤️</span>
          缘梦—时光主理人 - 用户管理
        </router-link>
        <div class="navbar-menu">
          <router-link to="/admin" class="navbar-link">返回后台</router-link>
          <button @click="logout" class="btn btn-outline">退出</button>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <div class="container" style="padding-bottom: 80px;">
      <!-- 页面标题 -->
      <div class="festive-bg fade-in-up" style="margin: 1rem 0; text-align: center;">
        <h1 style="color: var(--primary-red); font-size: 1.5rem; margin-bottom: 0.5rem;">
          用户管理
        </h1>
        <p style="color: var(--gray-600); font-size: 0.9rem;">
          管理平台所有用户信息 👥
        </p>
      </div>

      <!-- 搜索和筛选 -->
      <div class="card fade-in-up">
        <div class="search-section">
          <div class="search-box">
            <input 
              v-model="searchQuery" 
              type="text" 
              class="form-input" 
              placeholder="搜索用户名、邮箱或昵称..."
              @input="searchUsers"
            >
            <button @click="searchUsers" class="btn btn-primary">搜索</button>
          </div>
          <div class="filter-section">
            <select v-model="filterStatus" @change="filterUsers" class="form-input">
              <option value="">全部状态</option>
              <option value="verified">已验证</option>
              <option value="unverified">未验证</option>
            </select>
            <select v-model="filterGender" @change="filterUsers" class="form-input">
              <option value="">全部性别</option>
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
            <button @click="showCreateModal = true" class="btn btn-success">➕ 创建用户</button>
          </div>
        </div>
      </div>

      <!-- 用户列表 -->
      <div class="card fade-in-up">
        <div class="card-header">
          <span style="font-size: 1.2rem;">👥</span>
          用户列表 ({{ filteredUsers.length }})
        </div>
        
        <div v-if="loading" style="text-align: center; padding: 2rem;">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">⏳</div>
          <div>加载中...</div>
        </div>
        
        <div v-else-if="filteredUsers.length === 0" style="text-align: center; padding: 2rem; color: var(--gray-500);">
          暂无用户数据
        </div>
        
        <div v-else class="user-list">
          <div v-for="user in paginatedUsers" :key="user.id" class="user-item">
            <div class="user-avatar">
              {{ user.nickname?.charAt(0) || user.username?.charAt(0) || '?' }}
            </div>
            <div class="user-info">
              <div class="user-name">{{ user.nickname || user.username }}</div>
              <div class="user-email">📧 {{ user.email }}</div>
              <div class="user-details">
                <span v-if="user.gender">{{ user.gender }}</span>
                <span v-if="user.age">{{ user.age }}岁</span>
                <span v-if="user.location">📍 {{ user.location }}</span>
              </div>
              <div class="user-date">注册时间: {{ formatDate(user.created_at) }}</div>
            </div>
            <div class="user-actions">
              <div class="user-status">
                <div :class="['status-dot', user.is_verified ? 'verified' : 'unverified']"></div>
                {{ user.is_verified ? '已验证' : '未验证' }}
              </div>
              <div class="action-buttons">
                <button @click="viewUser(user)" class="btn btn-outline btn-sm">查看</button>
                <button @click="editUser(user)" class="btn btn-primary btn-sm">编辑</button>
                <button 
                  @click="toggleVerification(user)" 
                  :class="['btn btn-sm', user.is_verified ? 'btn-warning' : 'btn-success']"
                >
                  {{ user.is_verified ? '取消验证' : '验证用户' }}
                </button>
                <button @click="deleteUser(user)" class="btn btn-danger btn-sm">删除</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="totalPages > 1" class="pagination">
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1" 
            class="btn btn-outline"
          >
            上一页
          </button>
          <div class="page-info">
            第 {{ currentPage }} 页，共 {{ totalPages }} 页
          </div>
          <button 
            @click="currentPage++" 
            :disabled="currentPage === totalPages" 
            class="btn btn-outline"
          >
            下一页
          </button>
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <div class="bottom-nav">
      <router-link to="/admin" class="bottom-nav-item">
        <span style="font-size: 1.2rem;">📊</span>
        <span>概览</span>
      </router-link>
      <router-link to="/admin/users" class="bottom-nav-item active">
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

    <!-- 用户详情模态框 -->
    <div v-if="showUserModal" class="modal-overlay" @click="closeUserModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>用户详情</h3>
          <button @click="closeUserModal" class="modal-close">×</button>
        </div>
        <div v-if="selectedUser" class="modal-body">
          <div class="user-detail-section">
            <h4>基本信息</h4>
            <div class="detail-row">
              <span class="detail-label">用户名:</span>
              <span class="detail-value">{{ selectedUser.username }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">昵称:</span>
              <span class="detail-value">{{ selectedUser.nickname || '未设置' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">邮箱:</span>
              <span class="detail-value">{{ selectedUser.email }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">性别:</span>
              <span class="detail-value">{{ selectedUser.gender || '未设置' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">年龄:</span>
              <span class="detail-value">{{ selectedUser.age || '未设置' }}</span>
            </div>
          </div>
          <div class="user-detail-section">
            <h4>账户信息</h4>
            <div class="detail-row">
              <span class="detail-label">注册时间:</span>
              <span class="detail-value">{{ formatDate(selectedUser.created_at) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">验证状态:</span>
              <span :class="['detail-value', selectedUser.is_verified ? 'verified' : 'unverified']">
                {{ selectedUser.is_verified ? '已验证' : '未验证' }}
              </span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeUserModal" class="btn btn-outline">关闭</button>
        </div>
      </div>
    </div>

    <!-- 创建/编辑用户模态框 -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeCreateModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ showEditModal ? '编辑用户' : '创建用户' }}</h3>
          <button @click="closeCreateModal" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveUser" class="user-form">
            <div class="form-group">
              <label>用户名 *</label>
              <input 
                v-model="userForm.username" 
                type="text" 
                class="form-input" 
                required
                :disabled="showEditModal"
              >
            </div>
            <div class="form-group">
              <label>邮箱 *</label>
              <input 
                v-model="userForm.email" 
                type="email" 
                class="form-input" 
                required
              >
            </div>
            <div class="form-group">
              <label>密码 {{ showEditModal ? '(留空则不修改)' : '*' }}</label>
              <input 
                v-model="userForm.password" 
                type="password" 
                class="form-input" 
                :required="!showEditModal"
              >
            </div>
            <div class="form-group">
              <label>昵称</label>
              <input 
                v-model="userForm.nickname" 
                type="text" 
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label>性别</label>
              <select v-model="userForm.gender" class="form-input">
                <option value="">请选择</option>
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>
            <div class="form-group">
              <label>年龄</label>
              <input 
                v-model="userForm.age" 
                type="number" 
                class="form-input"
                min="18"
                max="100"
              >
            </div>
            <div class="form-group">
              <label>位置</label>
              <input 
                v-model="userForm.location" 
                type="text" 
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label>验证状态</label>
              <select v-model="userForm.is_verified" class="form-input">
                <option value="1">已验证</option>
                <option value="0">未验证</option>
              </select>
            </div>
            <div class="form-group">
              <label>角色</label>
              <select v-model="userForm.role" class="form-input">
                <option value="user">普通用户</option>
                <option value="admin">管理员</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="closeCreateModal" class="btn btn-outline">取消</button>
          <button @click="saveUser" class="btn btn-primary" :disabled="saving">
            {{ saving ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const loading = ref(false)
const users = ref([])
const filteredUsers = ref([])
const searchQuery = ref('')
const filterStatus = ref('')
const filterGender = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const showUserModal = ref(false)
const selectedUser = ref(null)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const saving = ref(false)
const userForm = ref({
  username: '',
  email: '',
  password: '',
  nickname: '',
  gender: '',
  age: '',
  location: '',
  is_verified: '1',
  role: 'user'
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUsers.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage)
})

const fetchUsers = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:3001/api/admin/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    users.value = response.data
    filteredUsers.value = response.data
  } catch (error) {
    console.error('Failed to fetch users:', error)
    if (error.response?.status === 401) {
      router.push('/login')
    }
  } finally {
    loading.value = false
  }
}

const searchUsers = () => {
  filterUsers()
}

const filterUsers = () => {
  filteredUsers.value = users.value.filter(user => {
    const matchesSearch = !searchQuery.value || 
      user.username?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.nickname?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = !filterStatus.value || 
      (filterStatus.value === 'verified' && user.is_verified) ||
      (filterStatus.value === 'unverified' && !user.is_verified)
    
    const matchesGender = !filterGender.value || user.gender === filterGender.value
    
    return matchesSearch && matchesStatus && matchesGender
  })
  currentPage.value = 1
}

const viewUser = (user) => {
  selectedUser.value = user
  showUserModal.value = true
}

const editUser = (user) => {
  userForm.value = {
    id: user.id,
    username: user.username,
    email: user.email,
    password: '',
    nickname: user.nickname || '',
    gender: user.gender || '',
    age: user.age || '',
    location: user.location || '',
    is_verified: user.is_verified ? '1' : '0',
    role: user.role || 'user'
  }
  showEditModal.value = true
}

const toggleVerification = async (user) => {
  try {
    const token = localStorage.getItem('token')
    await axios.put(`http://localhost:3001/api/admin/users/${user.id}/verification`, {
      is_verified: !user.is_verified
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    user.is_verified = !user.is_verified
    
  } catch (error) {
    console.error('Failed to toggle verification:', error)
    alert('操作失败，请重试')
  }
}

const deleteUser = async (user) => {
  if (!confirm(`确定要删除用户 "${user.nickname || user.username}" 吗？此操作不可恢复。`)) {
    return
  }
  
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`http://localhost:3001/api/admin/users/${user.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    // Remove user from lists
    users.value = users.value.filter(u => u.id !== user.id)
    filterUsers()
    
  } catch (error) {
    console.error('Failed to delete user:', error)
    alert('删除失败，请重试')
  }
}

const closeUserModal = () => {
  showUserModal.value = false
  selectedUser.value = null
}

const closeCreateModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  userForm.value = {
    username: '',
    email: '',
    password: '',
    nickname: '',
    gender: '',
    age: '',
    location: '',
    is_verified: '1',
    role: 'user'
  }
}

const saveUser = async () => {
  saving.value = true
  try {
    const token = localStorage.getItem('token')
    const formData = { ...userForm.value }
    
    // Remove password field if empty during edit
    if (showEditModal.value && !formData.password) {
      delete formData.password
    }
    
    let response
    if (showEditModal.value) {
      response = await axios.put(`http://localhost:3001/api/admin/users/${formData.id}`, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    } else {
      response = await axios.post('http://localhost:3001/api/admin/users', formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    }
    
    // Refresh user list
    await fetchUsers()
    closeCreateModal()
    
  } catch (error) {
    console.error('Failed to save user:', error)
    alert('保存失败，请重试')
  } finally {
    saving.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  localStorage.removeItem('username')
  localStorage.removeItem('role')
  router.push('/login')
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.admin-users {
  min-height: 100vh;
  padding-top: 1rem;
}

.search-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-box {
  display: flex;
  gap: 0.5rem;
}

.search-box .form-input {
  flex: 1;
}

.filter-section {
  display: flex;
  gap: 0.5rem;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--gray-50);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--primary-red);
}

.user-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: var(--primary-red);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 0.25rem;
}

.user-email {
  font-size: 0.9rem;
  color: var(--gray-600);
  margin-bottom: 0.25rem;
}

.user-details {
  font-size: 0.8rem;
  color: var(--gray-500);
  margin-bottom: 0.25rem;
}

.user-details span {
  margin-right: 1rem;
}

.user-date {
  font-size: 0.8rem;
  color: var(--gray-500);
}

.user-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.user-status {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: var(--gray-600);
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  margin-right: 0.25rem;
}

.status-dot.verified {
  background: var(--secondary-green);
}

.status-dot.unverified {
  background: var(--gray-400);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.page-info {
  font-size: 0.9rem;
  color: var(--gray-600);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: var(--radius-lg);
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-200);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--gray-500);
}

.modal-body {
  padding: 1.5rem;
}

.user-detail-section {
  margin-bottom: 1.5rem;
}

.user-detail-section h4 {
  color: var(--primary-red);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--gray-100);
}

.detail-label {
  font-weight: 500;
  color: var(--gray-700);
}

.detail-value {
  color: var(--gray-800);
}

.detail-value.verified {
  color: var(--secondary-green);
  font-weight: 500;
}

.detail-value.unverified {
  color: var(--gray-500);
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--gray-200);
  display: flex;
  justify-content: flex-end;
}

.user-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: var(--gray-700);
  font-size: 0.9rem;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-red);
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

.btn-success {
  background: var(--secondary-green);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.btn-success:hover {
  background: #45a049;
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