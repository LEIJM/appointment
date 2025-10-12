import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useOnboardingStore = defineStore('onboarding', () => {
  // 状态
  const onboardingData = ref({})
  const currentStep = ref(1)
  const isOnboarding = ref(false)
  
  // 计算属性
  const totalSteps = 7
  const progress = computed(() => (currentStep.value / totalSteps) * 100)
  
  // 获取保存的数据
  const getStoredData = () => {
    try {
      const stored = sessionStorage.getItem('onboardingData')
      if (stored) {
        onboardingData.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('获取onboarding数据失败:', error)
      onboardingData.value = {}
    }
    return onboardingData.value
  }
  
  // 保存数据
  const saveData = (data) => {
    try {
      onboardingData.value = { ...onboardingData.value, ...data }
      sessionStorage.setItem('onboardingData', JSON.stringify(onboardingData.value))
    } catch (error) {
      console.error('保存onboarding数据失败:', error)
    }
  }
  
  // 设置当前步骤
  const setCurrentStep = (step) => {
    currentStep.value = step
  }
  
  // 开始onboarding流程
  const startOnboarding = (initialData = {}) => {
    isOnboarding.value = true
    currentStep.value = 1
    onboardingData.value = initialData
    saveData(initialData)
  }
  
  // 下一步
  const nextStep = () => {
    if (currentStep.value < totalSteps) {
      currentStep.value++
    }
  }
  
  // 上一步
  const prevStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }
  
  // 跳过当前步骤
  const skipStep = () => {
    nextStep()
  }
  
  // 完成onboarding
  const completeOnboarding = () => {
    const finalData = { ...onboardingData.value }
    clearOnboarding()
    return finalData
  }
  
  // 清理onboarding数据
  const clearOnboarding = () => {
    onboardingData.value = {}
    currentStep.value = 1
    isOnboarding.value = false
    sessionStorage.removeItem('onboardingData')
  }
  
  // 获取特定字段的值
  const getFieldValue = (field) => {
    return onboardingData.value[field] || ''
  }
  
  // 设置特定字段的值
  const setFieldValue = (field, value) => {
    saveData({ [field]: value })
  }
  
  // 检查是否已登录
  const isUserLoggedIn = () => {
    return !!localStorage.getItem('token')
  }
  
  // 获取所有数据（包含标签映射）
  const getAllDataWithLabels = () => {
    const data = getStoredData()
    const labels = {}
    
    // 性别标签映射
    const genderLabels = {
      male: '男',
      female: '女'
    }
    
    // 年龄标签映射
    const ageLabels = {
      '18-25': '18-25岁',
      '26-30': '26-30岁',
      '31-35': '31-35岁',
      '36-40': '36-40岁',
      '41-45': '41-45岁',
      '46-50': '46-50岁',
      '50+': '50岁以上'
    }
    
    // 地区标签映射
    const regionLabels = {
      wujin: '武进区',
      xinbei: '新北区',
      tianning: '天宁区',
      zhonglou: '钟楼区',
      surrounding: '周边地区',
      other: '其他'
    }
    
    // 学历标签映射
    const educationLabels = {
      high_school: '高中及以下',
      college: '大专',
      bachelor: '本科',
      master: '硕士',
      phd: '博士'
    }
    
    // 职业标签映射
    const occupationLabels = {
      it: 'IT/互联网',
      finance: '金融/银行',
      education: '教育/培训',
      medical: '医疗/健康',
      business: '销售/商务',
      admin: '行政/人事',
      design: '设计/创意',
      service: '服务业',
      other: '其他'
    }
    
    // 收入标签映射
    const incomeLabels = {
      '3000-5000': '3000-5000元',
      '5000-8000': '5000-8000元',
      '8000-12000': '8000-12000元',
      '12000-20000': '12000-20000元',
      '20000+': '20000元以上',
      confidential: '保密'
    }
    
    // 身高标签映射
    const heightLabels = {
      below_160: '160cm以下',
      '160_165': '160-165cm',
      '166_170': '166-170cm',
      '171_175': '171-175cm',
      '176_180': '176-180cm',
      above_180: '180cm以上'
    }
    
    // 生成带标签的数据
    return {
      raw: data,
      labels: {
        gender: genderLabels[data.gender] || '',
        age: ageLabels[data.age] || '',
        region: regionLabels[data.region] || '',
        education: educationLabels[data.education] || '',
        occupation: occupationLabels[data.occupation] || '',
        income: incomeLabels[data.income] || '',
        height: heightLabels[data.height] || ''
      }
    }
  }
  
  return {
    // 状态
    onboardingData,
    currentStep,
    isOnboarding,
    totalSteps,
    progress,
    
    // 方法
    getStoredData,
    saveData,
    setCurrentStep,
    startOnboarding,
    nextStep,
    prevStep,
    skipStep,
    completeOnboarding,
    clearOnboarding,
    getFieldValue,
    setFieldValue,
    isUserLoggedIn,
    getAllDataWithLabels
  }
})