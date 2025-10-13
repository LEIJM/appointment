<template>
  <div class="onboarding-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="完善资料" left-arrow @click-left="goBack" />
    
    <!-- 进度条 -->
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: '100%' }"></div>
      </div>
      <div class="progress-text">7/7</div>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-container">
      <div class="step-icon">📏</div>
      <h2 class="step-title">您的身高是？</h2>
      <p class="step-subtitle">选择您的身高范围（可跳过）</p>

      <!-- 身高选择卡片 -->
      <div class="height-selection">
        <div 
          v-for="height in heightOptions" 
          :key="height.value"
          class="height-card" 
          :class="{ active: selectedHeight === height.value }"
          @click="selectHeight(height.value)"
        >
          <div class="height-text">{{ height.label }}</div>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="bottom-actions">
      <van-button 
        plain 
        block 
        round
        @click="skipStep"
        style="margin-bottom: 12px;"
      >
        跳过
      </van-button>
      <van-button 
        type="primary" 
        block 
        round 
        @click="completeOnboarding"
      >
        完成
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showLoadingToast, closeToast } from 'vant'
import { userService } from '../../services/index.js'

const router = useRouter()

const selectedHeight = ref('')

const heightOptions = [
  { label: '155cm', value: '155' },
  { label: '156cm', value: '156' },
  { label: '157cm', value: '157' },
  { label: '158cm', value: '158' },
  { label: '159cm', value: '159' },
  { label: '160cm', value: '160' },
  { label: '161cm', value: '161' },
  { label: '162cm', value: '162' },
  { label: '163cm', value: '163' },
  { label: '164cm', value: '164' },
  { label: '165cm', value: '165' },
  { label: '166cm', value: '166' },
  { label: '167cm', value: '167' },
  { label: '168cm', value: '168' },
  { label: '169cm', value: '169' },
  { label: '170cm', value: '170' },
  { label: '171cm', value: '171' },
  { label: '172cm', value: '172' },
  { label: '173cm', value: '173' },
  { label: '174cm', value: '174' },
  { label: '175cm', value: '175' },
  { label: '176cm', value: '176' },
  { label: '177cm', value: '177' },
  { label: '178cm', value: '178' },
  { label: '179cm', value: '179' },
  { label: '180cm', value: '180' },
  { label: '181cm', value: '181' },
  { label: '182cm', value: '182' },
  { label: '183cm', value: '183' },
  { label: '184cm', value: '184' },
  { label: '185cm', value: '185' }
]

// 选择身高
const selectHeight = (height) => {
  selectedHeight.value = height
}

// 跳过此步骤
const skipStep = () => {
  completeOnboarding()
}

// 返回上一页
const goBack = () => {
  router.push('/onboarding/step6')
}

// 完成信息收集
const completeOnboarding = async () => {
  // 保存身高信息到sessionStorage
  const onboardingData = JSON.parse(sessionStorage.getItem('onboardingData') || '{}')
  onboardingData.height = selectedHeight.value
  sessionStorage.setItem('onboardingData', JSON.stringify(onboardingData))
  
  // 检查用户是否已登录
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')
  
  if (token && userId) {
    // 已登录用户，更新资料
    try {
      showLoadingToast({
        message: '保存资料中...', 
        forbidClick: true,
        duration: 0
      })

      const updateData = {}
      if (onboardingData.gender) {
        updateData.gender = onboardingData.gender
      }
      if (onboardingData.age) {
        updateData.age = parseInt(onboardingData.age) || null
      }
      if (onboardingData.location) {
        updateData.current_city = onboardingData.location
      }
      if (onboardingData.education) {
        updateData.education = onboardingData.education
      }
      if (onboardingData.income) {
        updateData.income = onboardingData.income
      }
      if (onboardingData.marriage) {
        updateData.marital_status = onboardingData.marriage
      }
      if (onboardingData.height) {
        updateData.height = parseInt(onboardingData.height) || null
      }

      await userService.updateUserDetails(userId, updateData)
      
      closeToast()
      showToast('资料更新成功！')
      sessionStorage.removeItem('onboardingData')
      router.push('/')
    } catch (updateError) {
      console.error('Failed to update onboarding data for logged-in user:', updateError)
      closeToast()
      showToast('资料更新失败，请重试')
      router.push('/') // 即使更新失败也跳转到主页
    }
  } else {
    // 未登录用户，跳转到快速注册页面
    router.push('/onboarding/register')
  }
}
</script>

<style scoped>
.onboarding-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
}

.progress-container {
  padding: 20px 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b, #ffa726);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-text {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.content-container {
  flex: 1;
  padding: 40px 20px;
  text-align: center;
  color: white;
}

.step-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.step-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
  color: white;
}

.step-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 40px;
}

.height-selection {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 40px;
}

.height-card {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.height-card:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.height-card.active {
  background: rgba(255, 255, 255, 0.9);
  border-color: white;
  color: #333;
}

.height-text {
  font-size: 16px;
  font-weight: 500;
}

.bottom-actions {
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

:deep(.van-button--primary) {
  background: linear-gradient(90deg, #ff6b6b, #ffa726);
  border: none;
  font-weight: 500;
}

:deep(.van-button--plain) {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: white;
}

:deep(.van-nav-bar) {
  background: transparent;
}

:deep(.van-nav-bar__title) {
  color: white;
  font-weight: 500;
}

:deep(.van-nav-bar .van-icon) {
  color: white;
}
</style>