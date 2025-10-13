<template>
  <div class="onboarding-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="完善资料" left-arrow @click-left="goBack" />
    
    <!-- 进度条 -->
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: '85.7%' }"></div>
      </div>
      <div class="progress-text">6/7</div>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-container">
      <div class="step-icon">💰</div>
      <h2 class="step-title">您的年收入大约是？</h2>
      <p class="step-subtitle">选择您的收入范围（可跳过）</p>

      <!-- 收入选择卡片 -->
      <div class="income-selection">
        <div 
          v-for="income in incomeOptions" 
          :key="income.value"
          class="income-card" 
          :class="{ active: selectedIncome === income.value }"
          @click="selectIncome(income.value)"
        >
          <div class="income-text">{{ income.label }}</div>
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

const selectedIncome = ref('')

const incomeOptions = [
  { label: '5万以下', value: '5万以下' },
  { label: '5-10万', value: '5-10万' },
  { label: '10-20万', value: '10-20万' },
  { label: '20-50万', value: '20-50万' },
  { label: '50万以上', value: '50万以上' },
  { label: '保密', value: '保密' }
]

// 选择收入
const selectIncome = (income) => {
  selectedIncome.value = income
}

// 跳过此步骤
const skipStep = () => {
  router.push('/onboarding/step7')
}

// 返回上一页
const goBack = () => {
  router.push('/onboarding/step5')
}

// 进入下一步
const goToNextStep = () => {
  // 保存到sessionStorage
  const onboardingData = JSON.parse(sessionStorage.getItem('onboardingData') || '{}')
  onboardingData.income = selectedIncome.value
  sessionStorage.setItem('onboardingData', JSON.stringify(onboardingData))
  
  // 跳转到下一步
  router.push('/onboarding/step7')
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

.income-selection {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 40px;
}

.income-card {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.income-card:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.income-card.active {
  background: rgba(255, 255, 255, 0.9);
  border-color: white;
  color: #333;
}

.income-text {
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