import sqlite3 from 'sqlite3'
import bcrypt from 'bcryptjs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 连接到数据库
const db = new sqlite3.Database('matchmaking.db')

// 用户信息数组
const users = [
  {
    username: 'user_male_1',
    gender: '男',
    birthYear: 1993,
    height: 187,
    location: '江苏苏州',
    education: '专科',
    income: '1.3w',
    occupation: '影视行业',
    hobbies: '摩托车',
    nickname: '苏州影视男'
  },
  {
    username: 'user_female_1',
    gender: '女',
    birthYear: 2000,
    height: 161,
    location: '常州武进',
    education: '本科',
    income: '8k',
    occupation: '武进中医院护士',
    hobbies: '宠物',
    nickname: '武进护士'
  },
  {
    username: 'user_male_2',
    gender: '男',
    birthYear: 1996,
    height: 177,
    location: '江苏常州',
    education: '专科',
    income: '7k',
    occupation: '机械厂职工',
    hobbies: '动漫',
    nickname: '常州机械男'
  },
  {
    username: 'user_female_2',
    gender: '女',
    birthYear: 1988,
    height: 160,
    location: '常州武进',
    education: '专科',
    income: '8k',
    occupation: '母婴店管理者',
    hobbies: '做饭',
    nickname: '武进母婴姐'
  },
  {
    username: 'user_male_3',
    gender: '男',
    birthYear: 1991,
    height: 168,
    location: '江苏常州',
    education: '本科',
    income: '2w',
    occupation: '教育培训',
    hobbies: '学习',
    nickname: '常州教育男'
  },
  {
    username: 'user_female_3',
    gender: '女',
    birthYear: 1991,
    height: 158,
    location: '江苏常州',
    education: '高中',
    income: '8k',
    occupation: '私营业主',
    hobbies: '宠物',
    nickname: '常州私营业主'
  },
  {
    username: 'user_male_4',
    gender: '男',
    birthYear: 1991,
    height: 172,
    location: '江苏常州',
    education: '硕士',
    income: '2w',
    occupation: '企业管理',
    hobbies: '旅游',
    nickname: '常州管理男'
  },
  {
    username: 'user_female_4',
    gender: '女',
    birthYear: 1995,
    height: 160,
    location: '常州武进',
    education: '硕士',
    income: '2w',
    occupation: '公务员',
    hobbies: '做饭',
    nickname: '武进公务员'
  },
  {
    username: 'user_male_5',
    gender: '男',
    birthYear: 1993,
    height: 177,
    location: '江苏沭阳',
    education: '本科',
    income: '7k',
    occupation: '淹城动物园员工',
    hobbies: '摩托车',
    nickname: '沭阳动物园员工'
  },
  {
    username: 'user_female_5',
    gender: '女',
    birthYear: 1996,
    height: 162,
    location: '江苏宿迁',
    education: '本科',
    income: '1.1w',
    occupation: '电信公司正式员工',
    hobbies: '旅游',
    nickname: '宿迁电信员工'
  }
]

// 计算年龄
function calculateAge(birthYear) {
  const currentYear = new Date().getFullYear()
  return currentYear - birthYear
}

// 生成个人介绍
function generatePersonalIntroduction(user) {
  const age = calculateAge(user.birthYear)
  return `${user.location}人，${age}岁，${user.education}学历，从事${user.occupation}，月收入${user.income}。爱好${user.hobbies}。`
}

// 插入用户数据
async function insertUsers() {
  console.log('开始添加用户数据...')
  
  for (const user of users) {
    try {
      const password = bcrypt.hashSync('123456', 10) // 默认密码
      const age = calculateAge(user.birthYear)
      const personalIntroduction = generatePersonalIntroduction(user)
      
      // 插入用户基础信息
      const userId = await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO users (username, password, avatar, role) VALUES (?, ?, ?, ?)',
          [user.username, password, user.gender === '男' ? '/uploads/male.jpg' : '/uploads/female.jpg', 'user'],
          function(err) {
            if (err) reject(err)
            else resolve(this.lastID)
          }
        )
      })
      
      // 插入用户详细信息
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO user_details (
            user_id, nickname, gender, age, height, current_city, 
            education, income, occupation, hobbies, personal_introduction,
            marital_status, has_car, has_house
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            user.nickname,
            user.gender,
            age,
            user.height,
            user.location,
            user.education,
            user.income,
            user.occupation,
            user.hobbies,
            personalIntroduction,
            'single', // 默认单身
            0, // 默认无车
            0  // 默认无房
          ],
          function(err) {
            if (err) reject(err)
            else resolve()
          }
        )
      })
      
      console.log(`✅ 用户 ${user.nickname} (${user.gender}) 添加成功`)
      
    } catch (error) {
      console.error(`❌ 添加用户 ${user.nickname} 失败:`, error.message)
    }
  }
  
  console.log('用户数据添加完成！')
  db.close()
}

// 运行脚本
insertUsers()