<template>
  <div class="admin-activities">
    <!-- 顶部导航 -->
    <nav class="navbar">
      <div class="navbar-content">
        <router-link to="/" class="navbar-brand">
          <span class="heart-icon">❤️</span>
          缘梦—时光主理人 - 活动管理
        </router-link>
        <div class="navbar-menu">
          <button @click="showCreateModal = true" class="btn btn-primary">创建活动</button>
          <router-link to="/admin" class="navbar-link">返回后台</router-link>
          <button @click="logout" class="btn btn-outline">退出</button>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <div class="container" style="padding-bottom: 80px;">
      <!-- 页面标题 -->
      <div class="festive-bg fade-in-up" style="margin: 1rem 0; text-align: center;">
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
          <h1 style="color: var(--primary-red); font-size: 1.5rem; margin-bottom: 0.5rem;">
            活动管理
          </h1>
          <span class="activity-count" style="color: var(--gray-600); font-size: 0.9rem;">共 {{ filteredActivities.length }} 个活动</span>
        </div>
        <p style="color: var(--gray-600); font-size: 0.9rem;">
          管理平台所有相亲活动 🎉
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
              placeholder="搜索活动标题、描述、地点或备注..."
              @keyup.enter="searchActivities"
            >
            <button @click="searchActivities" class="btn btn-primary">🔍 搜索</button>
            <button @click="clearFilters" class="btn btn-outline" v-if="searchQuery || filterStatus || filterType">
              🔄 清除筛选
            </button>
          </div>
          <div class="filter-section">
            <select v-model="filterStatus" @change="filterActivities" class="form-input" title="按活动状态筛选">
              <option value="">全部状态</option>
              <option value="upcoming">即将开始</option>
              <option value="ongoing">进行中</option>
              <option value="completed">已结束</option>
              <option value="cancelled">已取消</option>
            </select>
            <select v-model="filterType" @change="filterActivities" class="form-input" title="按活动类型筛选">
              <option value="">全部类型</option>
              <option value="speed_dating">速配活动</option>
              <option value="group_activity">团体活动</option>
              <option value="themed_party">主题派对</option>
              <option value="outdoor_activity">户外活动</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 活动列表 -->
      <div class="card fade-in-up">
        <div class="card-header">
          <span style="font-size: 1.2rem;">🎉</span>
          活动列表 ({{ filteredActivities.length }})
        </div>
        
        <div v-if="loading" style="text-align: center; padding: 2rem;">
          <div class="loading-spinner"></div>
          <p>正在加载活动数据...</p>
        </div>
        
        <div v-else-if="filteredActivities.length === 0" class="no-results" style="text-align: center; padding: 2rem; color: var(--gray-600);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
          <h3>没有找到匹配的活动</h3>
          <p>尝试调整搜索条件或创建新活动</p>
        </div>
        
        <div v-else-if="filteredActivities.length === 0" style="text-align: center; padding: 2rem; color: var(--gray-500);">
          暂无活动数据
        </div>
        
        <div v-else class="activity-list">
          <div v-for="activity in paginatedActivities" :key="activity.id" class="activity-item" :class="{ 'activity-cancelled': activity.status === 'cancelled' }">
            <div class="activity-image" v-if="activity.image">
              <img :src="activity.image" :alt="activity.title" />
            </div>
            <div class="activity-content">
              <div class="activity-header">
                <div class="activity-title">{{ activity.title }}</div>
                <div :class="['activity-status', activity.status]">
                  {{ getStatusText(activity.status) }}
                </div>
              </div>
              <div class="activity-description">{{ activity.description }}</div>
              <div class="activity-details">
                <div class="activity-detail">
                  <span>📅</span>
                  {{ formatDate(activity.date) }}
                </div>
                <div class="activity-detail">
                  <span>⏰</span>
                  截止: {{ formatDate(activity.registration_deadline) }}
                </div>
                <div class="activity-detail">
                  <span>📍</span>
                  {{ activity.location }}
                </div>
                <div class="activity-detail">
                  <span>💰</span>
                  ¥{{ activity.price }}
                </div>
                <div class="activity-detail">
                  <span>👥</span>
                  {{ activity.current_participants }}/{{ activity.max_participants }}
                </div>
              </div>
              <div class="activity-tags">
                <span class="activity-tag">{{ getTypeText(activity.type) }}</span>
                <span class="activity-tag">{{ activity.age_range }}</span>
              </div>
            </div>
            <div class="activity-actions">
              <button @click="viewActivity(activity)" class="btn btn-sm btn-outline" title="查看详情">
              👁️ 查看
            </button>
            <button @click="editActivity(activity)" class="btn btn-sm btn-outline" title="编辑活动">
              ✏️ 编辑
            </button>
            <button @click="toggleActivityStatus(activity)" class="btn btn-sm btn-outline" title="切换状态">
              {{ activity.status === 'cancelled' ? '✅ 恢复' : '❌ 取消' }}
            </button>
            <button @click="deleteActivity(activity)" class="btn btn-sm btn-danger" title="删除活动" @mouseenter="$event.target.style.backgroundColor='#c0392b'" @mouseleave="$event.target.style.backgroundColor=''">
              🗑️ 删除
            </button>
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

    <!-- 底部导航（统一样式与高亮逻辑） -->
    <div class="bottom-nav">
      <router-link to="/admin" class="bottom-nav-item" title="返回概览">
        <span style="font-size: 1.2rem;">📊</span>
        <span>概览</span>
      </router-link>
      <router-link to="/admin/users" class="bottom-nav-item" title="用户管理">
        <span style="font-size: 1.2rem;">👥</span>
        <span>用户</span>
      </router-link>      
      <router-link to="/admin/activities" class="bottom-nav-item" title="活动管理">
        <span style="font-size: 1.2rem;">🎉</span>
        <span>活动</span>
      </router-link>
      <div class="bottom-nav-item" @click="logout" title="退出登录">
        <span style="font-size: 1.2rem;">🚪</span>
        <span>退出</span>
      </div>
    </div>

    <!-- 创建活动模态框 -->
    <div v-if="showCreateModal" class="modal-overlay" @click="closeCreateModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ isEditing ? '编辑活动' : '创建新活动' }}</h3>
          <button @click="closeCreateModal" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createActivity">
            <div class="form-group">
              <label class="form-label">活动标题</label>
              <input v-model="newActivity.title" type="text" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">活动描述</label>
              <textarea v-model="newActivity.description" class="form-input" rows="3" required></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">活动日期</label>
              <input v-model="newActivity.date" type="datetime-local" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">报名截止时间</label>
              <input v-model="newActivity.registration_deadline" type="datetime-local" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">活动地点</label>
              <input v-model="newActivity.location" type="text" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">活动类型</label>
              <select v-model="newActivity.type" class="form-input" required>
                <option value="speed_dating">速配活动</option>
                <option value="group_activity">团体活动</option>
                <option value="themed_party">主题派对</option>
                <option value="outdoor_activity">户外活动</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">价格 (元)</label>
              <input v-model.number="newActivity.price" type="number" class="form-input" min="0" required>
            </div>
            <div class="form-group">
              <label class="form-label">最大参与人数</label>
              <input v-model.number="newActivity.max_participants" type="number" class="form-input" min="1" required>
            </div>
            <div class="form-group">
              <label class="form-label">年龄范围</label>
              <input v-model="newActivity.age_range" type="text" class="form-input" placeholder="如：25-35岁">
            </div>
            <div class="form-group">
              <label class="form-label">活动图片</label>
              <div class="image-upload-area" @drop="handleImageDrop" @dragover.prevent @dragenter.prevent>
                <input 
                  ref="imageInput" 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  @change="handleImageSelect"
                  style="display: none"
                >
                <div class="upload-placeholder" @click="triggerImageUpload">
                  <div style="font-size: 2rem; margin-bottom: 0.5rem;">📷</div>
                  <div>点击上传图片或拖拽图片到此处</div>
                  <div style="font-size: 0.8rem; color: var(--gray-500); margin-top: 0.25rem;">支持多张图片上传</div>
                </div>
              </div>
              <div v-if="selectedImages.length > 0" class="selected-images">
                <div v-for="(image, index) in selectedImages" :key="index" class="selected-image-item">
                  <img :src="image.preview" :alt="`活动图片 ${index + 1}`" class="preview-image">
                  <button @click="removeImage(index)" class="remove-image-btn">×</button>
                  <div class="image-name">{{ image.file.name }}</div>
                </div>
              </div>
            </div>
            <!-- 活动备注 -->
            <div class="form-group">
              <label for="notes">活动备注</label>
              <textarea
                id="notes"
                v-model="newActivity.notes"
                placeholder="添加活动备注信息..."
                rows="3"
                class="form-input"
                maxlength="500"
              ></textarea>
              <small style="color: var(--gray-600); font-size: 0.8rem;">
                {{ newActivity.notes?.length || 0 }}/500 字符
              </small>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="closeCreateModal" class="btn btn-outline">取消</button>
          <button @click="createActivity" class="btn btn-primary" :disabled="creating">
            {{ creating ? (isEditing ? '更新中...' : '创建中...') : (isEditing ? '更新活动' : '创建活动') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 活动详情模态框 -->
    <div v-if="showActivityModal" class="modal-overlay" @click="closeActivityModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>活动详情</h3>
          <button @click="closeActivityModal" class="modal-close">×</button>
        </div>
        <div v-if="selectedActivity" class="modal-body">
          <div class="activity-detail-section">
            <h4>基本信息</h4>
            <div class="detail-row">
              <span class="detail-label">活动标题</span>
              <span class="detail-value">{{ selectedActivity.title }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">活动类型</span>
              <span class="detail-value">{{ getTypeText(selectedActivity.type) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">活动状态</span>
              <span class="detail-value">
                <span :class="['activity-status', selectedActivity.status]">{{ getStatusText(selectedActivity.status) }}</span>
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">活动日期</span>
              <span class="detail-value">{{ formatDate(selectedActivity.date) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">报名截止</span>
              <span class="detail-value">{{ formatDate(selectedActivity.registration_deadline) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">活动地点</span>
              <span class="detail-value">{{ selectedActivity.location }}</span>
            </div>
          </div>
          
          <div class="activity-detail-section">
            <h4>参与信息</h4>
            <div class="detail-row">
              <span class="detail-label">价格</span>
              <span class="detail-value">¥{{ selectedActivity.price }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">最大人数</span>
              <span class="detail-value">{{ selectedActivity.max_participants }}人</span>
            </div>
            <div class="detail-row" v-if="selectedActivity.current_participants !== undefined">
              <span class="detail-label">当前报名</span>
              <span class="detail-value">{{ selectedActivity.current_participants }}人</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">年龄范围</span>
              <span class="detail-value">{{ selectedActivity.age_range || '不限' }}</span>
            </div>
          </div>
          
          <div class="activity-detail-section">
            <h4>活动描述</h4>
            <div class="detail-row">
              <span class="detail-value">{{ selectedActivity.description }}</span>
            </div>
          </div>
          
          <div class="activity-detail-section" v-if="selectedActivity.notes">
            <h4>活动备注</h4>
            <div class="detail-row">
              <span class="detail-value">{{ selectedActivity.notes }}</span>
            </div>
          </div>

          <div class="activity-detail-section">
            <h4>报名用户</h4>
            <div v-if="selectedRegistrations.length === 0" class="detail-row">
              <span class="detail-value" style="color: var(--gray-500)">暂无报名记录</span>
            </div>
            <div v-else>
              <div v-for="reg in selectedRegistrations" :key="reg.id" class="detail-row">
                <span class="detail-label">{{ reg.nickname || reg.username }}</span>
                <span class="detail-value">{{ reg.gender || '-' }} · {{ reg.age || '-' }}岁</span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeActivityModal" class="btn btn-outline" title="关闭 (Esc)">关闭</button>
        </div>
      </div>
    </div>

    <!-- 创建活动模态框 -->
    <div v-if="showCreateModal" class="modal-overlay" @click="closeCreateModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ isEditing ? '编辑活动' : '创建新活动' }}</h3>
          <button @click="closeCreateModal" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createActivity">
            <div class="form-group">
              <label class="form-label">活动标题</label>
              <input v-model="newActivity.title" type="text" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">活动描述</label>
              <textarea v-model="newActivity.description" class="form-input" rows="3" required></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">活动日期</label>
              <input v-model="newActivity.date" type="datetime-local" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">报名截止时间</label>
              <input v-model="newActivity.registration_deadline" type="datetime-local" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">活动地点</label>
              <input v-model="newActivity.location" type="text" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">活动类型</label>
              <select v-model="newActivity.type" class="form-input" required>
                <option value="speed_dating">速配活动</option>
                <option value="group_activity">团体活动</option>
                <option value="themed_party">主题派对</option>
                <option value="outdoor_activity">户外活动</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">价格 (元)</label>
              <input v-model.number="newActivity.price" type="number" class="form-input" min="0" required>
            </div>
            <div class="form-group">
              <label class="form-label">最大参与人数</label>
              <input v-model.number="newActivity.max_participants" type="number" class="form-input" min="1" required>
            </div>
            <div class="form-group">
              <label class="form-label">年龄范围</label>
              <input v-model="newActivity.age_range" type="text" class="form-input" placeholder="如：25-35岁">
            </div>
            <div class="form-group">
              <label class="form-label">活动图片</label>
              <div class="image-upload-area" @drop="handleImageDrop" @dragover.prevent @dragenter.prevent>
                <input 
                  ref="imageInput" 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  @change="handleImageSelect"
                  style="display: none"
                >
                <div class="upload-placeholder" @click="triggerImageUpload">
                  <div style="font-size: 2rem; margin-bottom: 0.5rem;">📷</div>
                  <div>点击上传图片或拖拽图片到此处</div>
                  <div style="font-size: 0.8rem; color: var(--gray-500); margin-top: 0.25rem;">支持多张图片上传</div>
                </div>
              </div>
              <div v-if="selectedImages.length > 0" class="selected-images">
                <div v-for="(image, index) in selectedImages" :key="index" class="selected-image-item">
                  <img :src="image.preview" :alt="`活动图片 ${index + 1}`" class="preview-image">
                  <button @click="removeImage(index)" class="remove-image-btn">×</button>
                  <div class="image-name">{{ image.file.name }}</div>
                </div>
              </div>
            </div>
            <!-- 活动备注 -->
            <div class="form-group">
              <label for="notes">活动备注</label>
              <textarea
                id="notes"
                v-model="newActivity.notes"
                placeholder="添加活动备注信息..."
                rows="3"
                class="form-input"
                maxlength="500"
              ></textarea>
              <small style="color: var(--gray-600); font-size: 0.8rem;">
                {{ newActivity.notes?.length || 0 }}/500 字符
              </small>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="closeCreateModal" class="btn btn-outline">取消</button>
          <button @click="createActivity" class="btn btn-primary" :disabled="creating">
            {{ creating ? (isEditing ? '更新中...' : '创建中...') : (isEditing ? '更新活动' : '创建活动') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminService } from '../../services/index.js'

const router = useRouter()
const loading = ref(false)
const activities = ref([])
const filteredActivities = ref([])
const searchQuery = ref('')
const filterStatus = ref('')
const filterType = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const showCreateModal = ref(false)
const showActivityModal = ref(false)
const selectedActivity = ref(null)
const selectedRegistrations = ref([])
const creating = ref(false)
const isEditing = ref(false)
const selectedImages = ref([])
const imageInput = ref(null)

const newActivity = ref({
  title: '',
  description: '',
  date: '',
  registration_deadline: '',
  location: '',
  type: 'speed_dating',
  price: 0,
  max_participants: 20,
  age_range: '',
  image: '',
  notes: ''
})

const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredActivities.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredActivities.value.length / itemsPerPage)
})

const fetchActivities = async () => {
  loading.value = true
  try {
    const response = await adminService.getActivities()
    
    // adminService.getActivities() 已经返回 response.data，所以 response 就是活动数组
    const activityData = Array.isArray(response) ? response : (response || [])
    
    // 确保数据完整性
    activities.value = activityData.map(activity => {
      // 后端返回的是 a.* + photos + status（字符串）
      // 统一映射到当前前端所需的字段命名
      return {
        id: activity.id,
        title: activity.title,
        description: activity.details || '',
        date: activity.date,
        registration_deadline: activity.registration_deadline,
        location: activity.location || null,
        type: activity.type || 'group_activity',
        price: activity.price ?? 0,
        max_participants: activity.max_participants ?? 0,
        age_range: activity.age_range || '',
        image: activity.image || '',
        photos: activity.photos || '',
        current_participants: activity.current_participants ?? 0,
        notes: activity.notes || '',
        status: activity.status
      }
    })
    
    filteredActivities.value = activities.value
  } catch (error) {
    console.error('Failed to fetch activities:', error)
    if (error.response?.status === 401) {
      router.push('/login')
    }
    // 出错时设置为空数组
    activities.value = []
    filteredActivities.value = []
  } finally {
    loading.value = false
  }
}

const searchActivities = () => {
  filterActivities()
}

const filterActivities = () => {
  filteredActivities.value = activities.value.filter(activity => {
    const matchesSearch = !searchQuery.value || 
      activity.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      activity.description?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      activity.location?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (activity.notes && activity.notes.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    const matchesStatus = !filterStatus.value || activity.status === filterStatus.value
    const matchesType = !filterType.value || activity.type === filterType.value
    
    return matchesSearch && matchesStatus && matchesType
  })
  currentPage.value = 1
}

const createActivity = async () => {
  // 表单验证
  if (!newActivity.value.title || !newActivity.value.description || !newActivity.value.date || 
      !newActivity.value.registration_deadline || !newActivity.value.location) {
    alert('请填写所有必填字段')
    return
  }
  
  if (new Date(newActivity.value.registration_deadline) >= new Date(newActivity.value.date)) {
    alert('报名截止时间必须早于活动开始时间')
    return
  }
  
  if (newActivity.value.max_participants < 1) {
    alert('最大参与人数必须大于0')
    return
  }
  
  if (newActivity.value.price < 0) {
    alert('价格不能为负数')
    return
  }
  
  creating.value = true
  
  try {
    // Create FormData to handle file uploads
    const formData = new FormData()
    
    // Add activity data
    Object.keys(newActivity.value).forEach(key => {
      if (newActivity.value[key] !== null && newActivity.value[key] !== undefined) {
        formData.append(key, newActivity.value[key])
      }
    })
    
    // Add images
    selectedImages.value.forEach((image, index) => {
      formData.append('images', image.file)
    })
    
    // Use different endpoint for create vs update
    if (isEditing.value && selectedActivity.value) {
      // Update existing activity
      await adminService.updateActivity(selectedActivity.value.id, formData)
      alert('活动更新成功！')
    } else {
      // Create new activity
      await adminService.createActivity(formData)
      alert('活动创建成功！')
    }
    
    await fetchActivities()
    closeCreateModal()
    
  } catch (error) {
    console.error('Failed to create activity:', error)
    alert(isEditing.value ? '更新活动失败，请重试' : '创建活动失败，请重试')
  } finally {
    creating.value = false
  }
}

const viewActivity = async (activity) => {
  selectedActivity.value = activity
  showActivityModal.value = true
  selectedRegistrations.value = []
  try {
    const res = await adminService.getActivityRegistrations(activity.id)
    selectedRegistrations.value = res.data || []
    // 同步更新当前报名人数，避免列表数据延迟导致弹窗显示为0
    selectedActivity.value.current_participants = selectedRegistrations.value.length
  } catch (e) {
    console.error('Failed to fetch registrations:', e)
  }
}

const editActivity = (activity) => {
  // Open edit modal with activity data
  selectedActivity.value = activity
  newActivity.value = {
    title: activity.title,
    description: activity.description,
    date: activity.date,
    registration_deadline: activity.registration_deadline,
    location: activity.location,
    type: activity.type,
    price: activity.price,
    max_participants: activity.max_participants,
    age_range: activity.age_range,
    notes: activity.notes || ''
  }
  showCreateModal.value = true
  isEditing.value = true
}

const toggleActivityStatus = async (activity) => {
  try {
    const newStatus = activity.status === 'cancelled' ? 'upcoming' : 'cancelled'
    
    await adminService.updateActivityStatus(activity.id, { status: newStatus })
    
    activity.status = newStatus
    
  } catch (error) {
    console.error('Failed to toggle activity status:', error)
    alert('操作失败，请重试')
  }
}

const deleteActivity = async (activity) => {
  const confirmed = await new Promise((resolve) => {
    const modal = document.createElement('div')
    modal.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
        <div style="background: white; padding: 2rem; border-radius: 8px; max-width: 400px; text-align: center;">
          <h3 style="color: #e74c3c; margin-bottom: 1rem;">⚠️ 确认删除</h3>
          <p style="margin-bottom: 1.5rem;">确定要删除活动 "${activity.title}" 吗？此操作无法撤销。</p>
          <div style="display: flex; gap: 1rem; justify-content: center;">
            <button id="confirmBtn" style="background: #e74c3c; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">确认删除</button>
            <button id="cancelBtn" style="background: #95a5a6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">取消</button>
          </div>
        </div>
      </div>
    `
    document.body.appendChild(modal)
    
    document.getElementById('confirmBtn').onclick = () => {
      document.body.removeChild(modal)
      resolve(true)
    }
    document.getElementById('cancelBtn').onclick = () => {
      document.body.removeChild(modal)
      resolve(false)
    }
  })
  
  if (!confirmed) return
  
  try {
    await adminService.deleteActivity(activity.id)
    
    // Remove activity from lists
    activities.value = activities.value.filter(a => a.id !== activity.id)
    filterActivities()
    
  } catch (error) {
    console.error('Failed to delete activity:', error)
    alert('删除失败，请重试')
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
  isEditing.value = false
  newActivity.value = {
    title: '',
    description: '',
    date: '',
    registration_deadline: '',
    location: '',
    type: 'speed_dating',
    price: 0,
    max_participants: 20,
    age_range: '',
    image: '',
    notes: ''
  }
  selectedImages.value = []
}

const closeActivityModal = () => {
  showActivityModal.value = false
  selectedActivity.value = null
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
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

const getTypeText = (type) => {
  const typeMap = {
    'speed_dating': '速配活动',
    'group_activity': '团体活动',
    'themed_party': '主题派对',
    'outdoor_activity': '户外活动'
  }
  return typeMap[type] || type
}

// Image handling methods
const triggerImageUpload = () => {
  imageInput.value?.click()
}

const handleImageSelect = (event) => {
  const files = Array.from(event.target.files)
  processImageFiles(files)
}

const handleImageDrop = (event) => {
  event.preventDefault()
  const files = Array.from(event.dataTransfer.files)
  processImageFiles(files)
}

const processImageFiles = (files) => {
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      // 验证文件大小 (最大5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`图片 ${file.name} 大小超过5MB限制`)
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        selectedImages.value.push({
          file,
          preview: e.target.result
        })
      }
      reader.readAsDataURL(file)
    } else {
      alert(`文件 ${file.name} 不是有效的图片格式`)
    }
  })
}

const removeImage = (index) => {
  selectedImages.value.splice(index, 1)
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  typeFilter.value = ''
  filterActivities()
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  localStorage.removeItem('username')
  localStorage.removeItem('role')
  localStorage.removeItem('userRole')
  router.push('/login')
}

onMounted(() => {
  fetchActivities()
  
  // 添加键盘快捷键支持
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'n') {
      e.preventDefault()
      showCreateModal.value = true
    }
    if (e.key === 'Escape') {
      if (showCreateModal.value) closeCreateModal()
      if (showActivityModal.value) closeActivityModal()
    }
  })
})
</script>

<style scoped>
.admin-activities {
  min-height: 100vh;
  padding-top: 1rem;
  background: linear-gradient(135deg, #fff5f5 0%, #ffe0e0 100%);
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

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 4px solid var(--primary-red);
}

.activity-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.activity-item.activity-cancelled {
  opacity: 0.7;
  background: #f8f9fa;
}

.activity-image {
  width: 6rem;
  height: 4rem;
  border-radius: var(--radius-md);
  overflow: hidden;
  flex-shrink: 0;
}

.activity-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.activity-content {
  flex: 1;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.activity-title {
  font-weight: 600;
  color: var(--gray-800);
  font-size: 1.1rem;
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

.activity-description {
  color: var(--gray-600);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.activity-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.activity-detail {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: var(--gray-700);
}

.activity-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.activity-tag {
  background: var(--primary-red);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
}

.activity-actions {
  display: flex;
  flex-direction: column;
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
  max-width: 600px;
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

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--gray-200);
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.activity-detail-section {
  margin-bottom: 1.5rem;
}

.activity-detail-section h4 {
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

/* Image upload styles */
.image-upload-area {
  border: 2px dashed var(--gray-300);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.image-upload-area:hover {
  border-color: var(--primary-red);
  background-color: rgba(239, 68, 68, 0.05);
}

.upload-placeholder {
  color: var(--gray-500);
  cursor: pointer;
}

.selected-images {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.selected-image-item {
  position: relative;
  width: 6rem;
  height: 6rem;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.selected-image-item:hover {
  transform: scale(1.05);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background: rgba(239, 68, 68, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
}

.remove-image-btn:hover {
  background: var(--primary-red);
}

.image-name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 0.7rem;
  padding: 0.25rem;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

/* 加载动画 */
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-red);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-section {
    flex-direction: column;
  }
  
  .search-box {
    flex-direction: column;
  }
  
  .filter-section {
    flex-wrap: wrap;
  }
  
  .activity-item {
    flex-direction: column;
    text-align: center;
  }
  
  .activity-actions {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-body {
    padding: 1rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
}
</style>