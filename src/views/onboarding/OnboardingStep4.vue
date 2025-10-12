<template>
  <div class="onboarding-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="完善资料" left-arrow @click-left="goBack" />
    
    <!-- 进度条 -->
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: '57.1%' }"></div>
      </div>
      <div class="progress-text">4/7</div>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-container">
      <div class="step-icon">🎓</div>
      <h2 class="step-title">您的学历是？</h2>
      <p class="step-subtitle">选择您的最高学历（可跳过）</p>

      <!-- 学历选择卡片 -->
      <div class="education-selection">
        <div 
          v-for="education in educationOptions" 
          :key="education.value"
          class="education-card" 
          :class="{ active: selectedEducation === education.value }"
          @click="selectEducation(education.value)"
        >
          <div class="education-text">{{ education.label }}</div>
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
        @click="goToNextStep"
      >
        下一步
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const selectedEducation = ref('')

const educationOptions = [
  { label: '高中及以下', value: 'high_school' },
  { label: '大专', value: 'college' },
  { label: '本科', value: 'bachelor' },
  { label: '硕士', value: 'master' },
  { label: '博士', value: 'phd' }
]

// 选择学历
const selectEducation = (education) => {
  selectedEducation.value = education
}

// 跳过此步骤
const skipStep = () => {
  router.push('/onboarding/step5')
}

// 返回上一页
const goBack = () => {
  router.push('/onboarding/step3')
}

// 进入下一步
const goToNextStep = () => {
  // 保存到sessionStorage
  const onboardingData = JSON.parse(sessionStorage.getItem('onboardingData') || '{}')
  onboardingData.education = selectedEducation.value
  sessionStorage.setItem('onboardingData', JSON.stringify(onboardingData))
  
  // 跳转到下一步
  router.push('/onboarding/step5')
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

.education-selection {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 40px;
}

.education-card {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.education-card:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.education-card.active {
  background: rgba(255, 255, 255, 0.9);
  border-color: white;
  color: #333;
}

.education-text {
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