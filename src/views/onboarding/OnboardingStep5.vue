<template>
  <div class="onboarding-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="完善资料" left-arrow @click-left="goBack" />
    
    <!-- 进度条 -->
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: '71.4%' }"></div>
      </div>
      <div class="progress-text">5/7</div>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-container">
      <div class="step-icon">💼</div>
      <h2 class="step-title">您的职业是？</h2>
      <p class="step-subtitle">选择您的职业类别（可跳过）</p>

      <!-- 职业选择卡片 -->
      <div class="occupation-selection">
        <div 
          v-for="occupation in occupationOptions" 
          :key="occupation.value"
          class="occupation-card" 
          :class="{ active: selectedOccupation === occupation.value }"
          @click="selectOccupation(occupation.value)"
        >
          <div class="occupation-text">{{ occupation.label }}</div>
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

const selectedOccupation = ref('')

const occupationOptions = [
  { label: 'IT/互联网', value: 'IT/互联网' },
  { label: '金融', value: '金融' },
  { label: '教育', value: '教育' },
  { label: '医疗', value: '医疗' },
  { label: '公务员', value: '公务员' },
  { label: '制造业', value: '制造业' },
  { label: '服务业', value: '服务业' },
  { label: '自由职业', value: '自由职业' },
  { label: '其他', value: '其他' }
]

// 选择职业
const selectOccupation = (occupation) => {
  selectedOccupation.value = occupation
}

// 跳过此步骤
const skipStep = () => {
  router.push('/onboarding/step6')
}

// 返回上一页
const goBack = () => {
  router.push('/onboarding/step4')
}

// 进入下一步
const goToNextStep = () => {
  // 保存到sessionStorage
  const onboardingData = JSON.parse(sessionStorage.getItem('onboardingData') || '{}')
  onboardingData.occupation = selectedOccupation.value
  sessionStorage.setItem('onboardingData', JSON.stringify(onboardingData))
  
  // 跳转到下一步
  router.push('/onboarding/step6')
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

.occupation-selection {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 40px;
}

.occupation-card {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.occupation-card:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.occupation-card.active {
  background: rgba(255, 255, 255, 0.9);
  border-color: white;
  color: #333;
}

.occupation-text {
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