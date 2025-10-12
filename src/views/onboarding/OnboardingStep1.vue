<template>
  <div class="onboarding-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="完善资料" left-arrow @click-left="goBack" />
    
    <!-- 进度条 -->
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: '14.3%' }"></div>
      </div>
      <div class="progress-text">1/7</div>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-container">
      <div class="step-icon">🎯</div>
      <h2 class="step-title">请选择您的性别</h2>
      <p class="step-subtitle">这是必填项，让我们为您提供更好的服务</p>

      <!-- 性别选择卡片 -->
      <div class="gender-selection">
        <div 
          class="gender-card" 
          :class="{ active: selectedGender === 'male' }"
          @click="selectGender('male')"
        >
          <div class="gender-image">
            <img src="/uploads/male.jpg" alt="男生" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div class="gender-text">男生</div>
        </div>
        
        <div 
          class="gender-card" 
          :class="{ active: selectedGender === 'female' }"
          @click="selectGender('female')"
        >
          <div class="gender-image">
            <img src="/uploads/female.jpg" alt="女生" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div class="gender-text">女生</div>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="bottom-actions">
      <van-button 
        type="primary" 
        block 
        round 
        :disabled="!selectedGender"
        @click="goToNextStep"
      >
        下一步
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const selectedGender = ref('')

// 选择性别
const selectGender = (gender) => {
  selectedGender.value = gender
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 进入下一步
const goToNextStep = () => {
  if (!selectedGender.value) return
  
  // 保存到sessionStorage
  const onboardingData = JSON.parse(sessionStorage.getItem('onboardingData') || '{}')
  onboardingData.gender = selectedGender.value
  sessionStorage.setItem('onboardingData', JSON.stringify(onboardingData))
  
  // 跳转到下一步
  router.push('/onboarding/step2')
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

.gender-selection {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 40px;
}

.gender-card {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 30px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.gender-card:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.gender-card.active {
  background: rgba(255, 255, 255, 0.9);
  border-color: white;
  color: #333;
}

.gender-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 10px;
  border: 3px solid rgba(255, 255, 255, 0.5);
}

.gender-text {
  font-size: 18px;
  font-weight: 500;
}

.bottom-actions {
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

:deep(.van-button) {
  background: linear-gradient(90deg, #ff6b6b, #ffa726);
  border: none;
  font-weight: 500;
}

:deep(.van-button:disabled) {
  background: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.6);
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