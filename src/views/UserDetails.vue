<template>
  <div class="user-details">
    <!-- 顶部导航 -->
    <nav class="navbar">
      <div class="navbar-content">
        <router-link to="/" class="navbar-brand">
          <span class="heart-icon">❤️</span>
          缘梦—时光主理人
        </router-link>
        <div class="navbar-menu">
          <router-link to="/profile" class="navbar-link">返回个人中心</router-link>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <div class="container" style="padding-bottom: 80px;">
      <!-- 页面标题 -->
      <div class="festive-bg fade-in-up" style="margin: 1rem 0; text-align: center;">
        <h1 style="color: var(--primary-red); font-size: 1.5rem; margin-bottom: 0.5rem;">
          完善详细资料
        </h1>
        <p style="color: var(--gray-600); font-size: 0.9rem;">
          完善您的资料，让更多人了解真实的你 📝
        </p>
      </div>

      <!-- 基本信息 -->
      <div class="card fade-in-up">
        <div class="card-header">
          <span style="font-size: 1.2rem;">👤</span>
          基本信息
        </div>
        <!-- 头像上传 -->
        <div class="form-group">
          <label class="form-label">头像</label>
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden; border: 3px solid var(--primary-red); cursor: pointer;" @click="triggerFileInput">
              <img :src="avatarPreview || form.avatar || '/uploads/customer.png'" alt="头像" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div>
              <input ref="fileInput" type="file" accept="image/*" style="display: none;" @change="handleAvatarUpload">
              <button type="button" @click="triggerFileInput" class="btn btn-secondary" style="margin-bottom: 0.5rem;">
                <span style="margin-right: 0.5rem;">📷</span>
                上传头像
              </button>
              <p style="color: var(--gray-500); font-size: 0.8rem;">点击头像或按钮上传新头像</p>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">昵称</label>
          <input v-model="form.nickname" type="text" class="form-input" placeholder="请输入您的昵称">
        </div>
        <div class="form-group">
          <label class="form-label">真实姓名</label>
          <input v-model="form.real_name" type="text" class="form-input" placeholder="请输入真实姓名">
        </div>
        <div class="form-group">
          <label class="form-label">性别</label>
          <select v-model="form.gender" class="form-input">
            <option value="">请选择性别</option>
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">年龄</label>
          <input v-model.number="form.age" type="number" class="form-input" placeholder="请输入年龄" min="18" max="80">
        </div>
        <div class="form-group">
          <label class="form-label">生日</label>
          <input v-model="form.birthday" type="date" class="form-input">
        </div>
      </div>

      <!-- 联系方式 -->
      <div class="card fade-in-up">
        <div class="card-header">
          <span style="font-size: 1.2rem;">📱</span>
          联系方式
        </div>
        <div class="form-group">
          <label class="form-label">手机号码</label>
          <input v-model="form.phone" type="tel" class="form-input" placeholder="请输入手机号码">
        </div>
        <div class="form-group">
          <label class="form-label">手机归属地</label>
          <input v-model="form.phone_location" type="text" class="form-input" placeholder="如：北京">
        </div>
      </div>

      <!-- 工作信息 -->
      <div class="card fade-in-up">
        <div class="card-header">
          <span style="font-size: 1.2rem;">💼</span>
          工作信息
        </div>
        <div class="form-group">
          <label class="form-label">职业</label>
          <input v-model="form.occupation" type="text" class="form-input" placeholder="请输入职业">
        </div>
        <div class="form-group">
          <label class="form-label">行业</label>
          <input v-model="form.industry" type="text" class="form-input" placeholder="请输入所在行业">
        </div>
        <div class="form-group">
          <label class="form-label">收入范围</label>
          <select v-model="form.income" class="form-input">
            <option value="">请选择收入范围</option>
            <option value="5万以下">5万以下</option>
            <option value="5-10万">5-10万</option>
            <option value="10-20万">10-20万</option>
            <option value="20-50万">20-50万</option>
            <option value="50万以上">50万以上</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">教育背景</label>
          <select v-model="form.education" class="form-input">
            <option value="">请选择教育背景</option>
            <option value="高中及以下">高中及以下</option>
            <option value="大专">大专</option>
            <option value="本科">本科</option>
            <option value="硕士">硕士</option>
            <option value="博士">博士</option>
          </select>
        </div>
      </div>

      <!-- 个人情况 -->
      <div class="card fade-in-up">
        <div class="card-header">
          <span style="font-size: 1.2rem;">💝</span>
          个人情况
        </div>
        <div class="form-group">
          <label class="form-label">身高 (cm)</label>
          <input v-model.number="form.height" type="number" class="form-input" placeholder="请输入身高" min="140" max="220">
        </div>
        <div class="form-group">
          <label class="form-label">体重 (kg)</label>
          <input v-model.number="form.weight" type="number" class="form-input" placeholder="请输入体重" min="30" max="200">
        </div>
        <div class="form-group">
          <label class="form-label">婚姻状况</label>
          <select v-model="form.marital_status" class="form-input">
            <option value="">请选择婚姻状况</option>
            <option value="未婚">未婚</option>
            <option value="离异">离异</option>
            <option value="丧偶">丧偶</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">兴趣爱好</label>
          <textarea v-model="form.hobbies" class="form-input" rows="3" placeholder="请输入您的兴趣爱好，如：旅游、阅读、运动等"></textarea>
        </div>
      </div>

      <!-- 地址信息 -->
      <div class="card fade-in-up">
        <div class="card-header">
          <span style="font-size: 1.2rem;">🏠</span>
          地址信息
        </div>
        <div class="form-group">
          <label class="form-label">户籍省份</label>
          <input v-model="form.household_province" type="text" class="form-input" placeholder="请输入户籍省份">
        </div>
        <div class="form-group">
          <label class="form-label">户籍城市</label>
          <input v-model="form.household_city" type="text" class="form-input" placeholder="请输入户籍城市">
        </div>
        <div class="form-group">
          <label class="form-label">现居省份</label>
          <input v-model="form.current_province" type="text" class="form-input" placeholder="请输入现居省份">
        </div>
        <div class="form-group">
          <label class="form-label">现居城市</label>
          <input v-model="form.current_city" type="text" class="form-input" placeholder="请输入现居城市">
        </div>
      </div>

      <!-- 个人特点 -->
      <div class="card fade-in-up">
        <div class="card-header">
          <span style="font-size: 1.2rem;">⭐</span>
          个人特点
        </div>
        <div class="form-group">
          <label class="form-label">性格特点</label>
          <textarea v-model="form.characteristics" class="form-input" rows="3" placeholder="请描述您的性格特点"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">家庭背景</label>
          <textarea v-model="form.family_background" class="form-input" rows="3" placeholder="请描述您的家庭背景"></textarea>
        </div>
      </div>

      <!-- 择偶期望 -->
      <div class="card fade-in-up">
        <div class="card-header">
          <span style="font-size: 1.2rem;">💕</span>
          择偶期望
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label">最小年龄</label>
            <input v-model.number="form.expected_age_min" type="number" class="form-input" placeholder="最小年龄" min="18" max="80">
          </div>
          <div class="form-group">
            <label class="form-label">最大年龄</label>
            <input v-model.number="form.expected_age_max" type="number" class="form-input" placeholder="最大年龄" min="18" max="80">
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label">最小身高 (cm)</label>
            <input v-model.number="form.expected_height_min" type="number" class="form-input" placeholder="最小身高" min="140" max="220">
          </div>
          <div class="form-group">
            <label class="form-label">最大身高 (cm)</label>
            <input v-model.number="form.expected_height_max" type="number" class="form-input" placeholder="最大身高" min="140" max="220">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">期望职业</label>
          <input v-model="form.expected_occupation" type="text" class="form-input" placeholder="请输入期望职业">
        </div>
        <div class="form-group">
          <label class="form-label">期望收入</label>
          <select v-model="form.expected_income" class="form-input">
            <option value="">请选择期望收入</option>
            <option value="不限">不限</option>
            <option value="5万以下">5万以下</option>
            <option value="5-10万">5-10万</option>
            <option value="10-20万">10-20万</option>
            <option value="20-50万">20-50万</option>
            <option value="50万以上">50万以上</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">期望教育背景</label>
          <select v-model="form.expected_education" class="form-input">
            <option value="">请选择期望教育背景</option>
            <option value="不限">不限</option>
            <option value="高中及以下">高中及以下</option>
            <option value="大专">大专</option>
            <option value="本科">本科</option>
            <option value="硕士">硕士</option>
            <option value="博士">博士</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">期望婚姻状况</label>
          <select v-model="form.expected_marital_status" class="form-input">
            <option value="">请选择期望婚姻状况</option>
            <option value="不限">不限</option>
            <option value="未婚">未婚</option>
            <option value="离异">离异</option>
            <option value="丧偶">丧偶</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">期望地区</label>
          <input v-model="form.expected_location" type="text" class="form-input" placeholder="请输入期望地区">
        </div>
        <div class="form-group">
          <label class="form-label">其他要求</label>
          <textarea v-model="form.other_notes" class="form-input" rows="3" placeholder="请输入其他要求或备注"></textarea>
        </div>
      </div>

      <!-- 保存按钮 -->
      <div class="card fade-in-up">
        <button @click="saveDetails" :disabled="saving" class="btn btn-primary" style="width: 100%;">
          <span style="margin-right: 0.5rem;">💾</span>
          {{ saving ? '保存中...' : '保存资料' }}
        </button>
        <div v-if="message" :style="{ background: messageType === 'success' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: messageType === 'success' ? 'var(--secondary-green)' : 'var(--primary-red)', padding: '1rem', borderRadius: 'var(--radius-lg)', marginTop: '1rem', textAlign: 'center' }">
          {{ message }}
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <div class="bottom-nav">
      <router-link to="/" class="bottom-nav-item">
        <span style="font-size: 1.2rem;">🏠</span>
        <span>首页</span>
      </router-link>
      <router-link to="/activities" class="bottom-nav-item">
        <span style="font-size: 1.2rem;">🎉</span>
        <span>活动</span>
      </router-link>
      <router-link to="/profile" class="bottom-nav-item active">
        <span style="font-size: 1.2rem;">👤</span>
        <span>我的</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const saving = ref(false)
const message = ref('')
const messageType = ref('')
const fileInput = ref(null)
const avatarPreview = ref('')
const avatarFile = ref(null)

const form = ref({
  nickname: '',
  real_name: '',
  gender: '',
  age: '',
  birthday: '',
  phone: '',
  phone_location: '',
  occupation: '',
  industry: '',
  income: '',
  education: '',
  height: '',
  weight: '',
  marital_status: '',
  hobbies: '',
  household_province: '',
  household_city: '',
  current_province: '',
  current_city: '',
  characteristics: '',
  family_background: '',
  expected_age_min: '',
  expected_age_max: '',
  expected_height_min: '',
  expected_height_max: '',
  expected_occupation: '',
  expected_income: '',
  expected_education: '',
  expected_marital_status: '',
  expected_location: '',
  other_notes: ''
})

const fetchUserDetails = async () => {
  try {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    
    const response = await axios.get(`http://localhost:3001/api/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    // Populate form with existing data
    Object.keys(form.value).forEach(key => {
      if (response.data[key] !== null && response.data[key] !== undefined) {
        form.value[key] = response.data[key]
      }
    })
    
  } catch (error) {
    console.error('Failed to fetch user details:', error)
    if (error.response?.status === 401) {
      router.push('/login')
    }
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleAvatarUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    message.value = '请选择图片文件'
    messageType.value = 'error'
    return
  }

  // 验证文件大小（限制为5MB）
  if (file.size > 5 * 1024 * 1024) {
    message.value = '图片文件大小不能超过5MB'
    messageType.value = 'error'
    return
  }

  avatarFile.value = file
  
  // 创建预览
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const saveDetails = async () => {
  saving.value = true
  message.value = ''
  
  try {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    
    // 创建表单数据
    const formData = new FormData()
    
    // 如果有头像文件，添加到表单
    if (avatarFile.value) {
      formData.append('avatar', avatarFile.value)
    }
    
    // 添加其他表单数据
    Object.keys(form.value).forEach(key => {
      if (form.value[key] !== null && form.value[key] !== undefined && form.value[key] !== '') {
        formData.append(key, form.value[key])
      }
    })
    
    // 一次性提交所有数据
    await axios.put(`http://localhost:3001/api/users/${userId}/details`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    
    message.value = '资料保存成功！'
    messageType.value = 'success'
    
    setTimeout(() => {
      router.push('/profile')
    }, 1500)
    
  } catch (error) {
    console.error('Failed to save details:', error)
    message.value = error.response?.data?.error || '保存失败，请重试'
    messageType.value = 'error'
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchUserDetails()
})
</script>

<style scoped>
.user-details {
  min-height: 100vh;
  padding-top: 1rem;
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