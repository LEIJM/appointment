import sqlite3 from 'sqlite3'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import express from 'express'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

// 数据库初始化（使用绝对路径，避免工作目录差异导致的多个DB文件）
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const dbFilePath = path.resolve(__dirname, 'matchmaking.db')
const db = new sqlite3.Database(dbFilePath)

// 文件上传配置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads')
    }
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

// JWT中间件
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.sendStatus(401)
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

// 管理员中间件
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

export function setupRoutes(app) {
  // 静态文件服务
  app.use('/uploads', express.static('uploads'))
  
  // API文档路由
  app.get(['/', '/api'], (req, res) => {
    res.json({
      message: '欢迎来到相亲交友平台 API',
      version: '1.0.0',
      description: '这是一个完整的相亲交友平台后端API服务',
      endpoints: {
        auth: {
          login: 'POST /api/login - 用户登录',
          register: 'POST /api/register - 用户注册'
        },
        users: {
          getAll: 'GET /api/users - 获取所有用户（需要认证）',
          getById: 'GET /api/users/:id - 获取指定用户详情（需要认证）',
          updateDetails: 'PUT /api/users/:id/details - 更新用户详情（需要认证）',
          getLatestByGender: 'GET /api/users/latest/:gender - 按性别获取最新用户'
        },
        activities: {
          getAll: 'GET /api/activities - 获取所有活动（需要认证）',
          getPublic: 'GET /api/activities/public - 获取公开活动列表',
          create: 'POST /api/activities - 创建活动（管理员）',
          update: 'PUT /api/activities/:id - 更新活动（管理员）',
          delete: 'DELETE /api/activities/:id - 删除活动（管理员）',
          toggleStatus: 'PUT /api/activities/:id/status - 切换活动状态（管理员）',
          getRegistrations: 'GET /api/activities/:id/registrations - 获取活动报名列表（管理员）'
        },
        admin: {
          getUsers: 'GET /api/admin/users - 获取用户列表（管理员）',
          updateUser: 'PUT /api/admin/users/:id - 更新用户信息（管理员）',
          deleteUser: 'DELETE /api/admin/users/:id - 删除用户（管理员）',
          verifyUser: 'PUT /api/admin/users/:id/verify - 审核用户（管理员）',
          createUser: 'POST /api/admin/users - 创建用户（管理员）'
        }
      },
      authentication: {
        type: 'JWT Token',
        header: 'Authorization: Bearer <token>',
        login: '使用 /api/login 获取token'
      },
      admin: {
        defaultCredentials: '用户名: admin',
        access: '管理员可以访问所有管理端点'
      },
      database: 'SQLite',
      server: 'Node.js + Express',
      frontend: 'Vue.js 3',
      documentation: '访问 /api 获取此文档'
    });
  });
  
  // 认证路由
  app.post('/api/login', (req, res) => {
    const { username, password } = req.body
    
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' })
      }
      
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }
      
      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, 'your-secret-key')
      res.json({ token, user: { id: user.id, username: user.username, role: user.role } })
    })
  })

  app.post('/api/register', (req, res) => {
    const { username, password } = req.body
    
    // 验证输入参数
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' })
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' })
    }
    
    const hashedPassword = bcrypt.hashSync(password, 10)
    
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function(err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.status(400).json({ error: 'Username already exists' })
        }
        return res.status(500).json({ error: 'Database error' })
      }
      
      const token = jwt.sign({ id: this.lastID, username: username, role: 'user' }, 'your-secret-key')
      res.json({ token, user: { id: this.lastID, username: username, role: 'user' } })
    })
  })

  // 用户路由
  app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
    db.all(`SELECT u.id, u.username, u.avatar, u.status, u.role, u.created_at,
            ud.nickname, ud.real_name, ud.gender, ud.age, ud.height, ud.weight,
            ud.education, ud.occupation, ud.marital_status, ud.current_city
            FROM users u
            LEFT JOIN user_details ud ON u.id = ud.user_id
            ORDER BY u.created_at DESC`, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json(rows)
    })
  })

  app.get('/api/users/:id', authenticateToken, (req, res) => {
    const userId = req.params.id
    
    db.get(`SELECT u.*, ud.* FROM users u
            LEFT JOIN user_details ud ON u.id = ud.user_id
            WHERE u.id = ?`, [userId], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      if (!row) {
        return res.status(404).json({ error: 'User not found' })
      }
      res.json(row)
    })
  })

  app.put('/api/users/:id/details', authenticateToken, upload.single('avatar'), (req, res) => {
    const userId = req.params.id
    const details = req.body
    
    if (req.file) {
      details.avatar = `/uploads/${req.file.filename}`
    }
    
    db.get('SELECT id FROM user_details WHERE user_id = ?', [userId], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      
      if (row) {
        const fields = Object.keys(details).map(key => `${key} = ?`).join(', ')
        const values = Object.values(details)
        
        db.run(`UPDATE user_details SET ${fields} WHERE user_id = ?`, [...values, userId], function(err) {
          if (err) {
            return res.status(500).json({ error: err.message })
          }
          res.json({ message: 'User details updated successfully' })
        })
      } else {
        const fields = Object.keys(details).join(', ')
        const placeholders = Object.keys(details).fill('?').join(', ')
        const values = Object.values(details)
        
        db.run(`INSERT INTO user_details (user_id, ${fields}) VALUES (?, ${placeholders})`, [userId, ...values], function(err) {
          if (err) {
            return res.status(500).json({ error: err.message })
          }
          res.json({ message: 'User details created successfully' })
        })
      }
    })
  })

  // 活动路由
  app.get('/api/activities', authenticateToken, (req, res) => {
    db.all(`SELECT a.*, GROUP_CONCAT(ap.photo_url) as photos
            FROM activities a
            LEFT JOIN activity_photos ap ON a.id = ap.activity_id
            WHERE a.status = 1
            GROUP BY a.id
            ORDER BY a.date DESC`, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json(rows)
    })
  })

  app.get('/api/activities/public', (req, res) => {
    db.all(`SELECT a.*, GROUP_CONCAT(ap.photo_url) as photos
            FROM activities a
            LEFT JOIN activity_photos ap ON a.id = ap.activity_id
            WHERE a.status = 1
            GROUP BY a.id
            ORDER BY a.date DESC
            LIMIT 10`, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json(rows)
    })
  })

  // 管理员用户管理路由（基于现有表结构映射）
  app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
    db.all(`
      SELECT 
        u.id,
        u.username,
        u.role,
        u.created_at,
        u.status AS is_verified,
        ud.nickname,
        ud.gender,
        ud.age,
        ud.current_city AS location,
        NULL AS email
      FROM users u
      LEFT JOIN user_details ud ON u.id = ud.user_id
      ORDER BY u.created_at DESC
    `, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      // Normalize is_verified to boolean
      const normalized = rows.map(r => ({
        ...r,
        is_verified: !!r.is_verified
      }))
      res.json(normalized)
    })
  })

  app.get('/api/admin/users/recent', authenticateToken, requireAdmin, (req, res) => {
    db.all(`
      SELECT 
        u.id,
        u.username,
        u.role,
        u.created_at,
        u.status AS is_verified,
        ud.nickname,
        ud.gender,
        ud.age,
        ud.current_city AS location,
        NULL AS email
      FROM users u
      LEFT JOIN user_details ud ON u.id = ud.user_id
      ORDER BY u.created_at DESC
      LIMIT 5
    `, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      const normalized = rows.map(r => ({
        ...r,
        is_verified: !!r.is_verified
      }))
      res.json(normalized)
    })
  })

  app.put('/api/admin/users/:id/verification', authenticateToken, requireAdmin, (req, res) => {
    const { is_verified } = req.body
    const userId = req.params.id
    const statusValue = is_verified ? 1 : 0
    db.run('UPDATE users SET status = ? WHERE id = ?', [statusValue, userId], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json({ message: 'User verification status updated successfully' })
    })
  })

  app.put('/api/admin/users/:id', authenticateToken, requireAdmin, (req, res) => {
    const { nickname, gender, age, location, role, password } = req.body
    const userId = req.params.id

    const tasks = []

    if (role) {
      tasks.push(new Promise((resolve, reject) => {
        db.run('UPDATE users SET role = ? WHERE id = ?', [role, userId], function(err) {
          if (err) reject(err); else resolve()
        })
      }))
    }

    if (password) {
      const hashedPassword = bcrypt.hashSync(password, 10)
      tasks.push(new Promise((resolve, reject) => {
        db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], function(err) {
          if (err) reject(err); else resolve()
        })
      }))
    }

    // Upsert into user_details
    tasks.push(new Promise((resolve, reject) => {
      db.get('SELECT id FROM user_details WHERE user_id = ?', [userId], (err, row) => {
        if (err) return reject(err)
        const city = location || null
        if (row) {
          db.run('UPDATE user_details SET nickname = ?, gender = ?, age = ?, current_city = ? WHERE user_id = ?',
            [nickname || null, gender || null, age || null, city, userId], function(err2) {
              if (err2) reject(err2); else resolve()
            })
        } else {
          db.run('INSERT INTO user_details (user_id, nickname, gender, age, current_city) VALUES (?, ?, ?, ?, ?)',
            [userId, nickname || null, gender || null, age || null, city], function(err2) {
              if (err2) reject(err2); else resolve()
            })
        }
      })
    }))

    Promise.all(tasks)
      .then(() => res.json({ message: 'User updated successfully' }))
      .catch(err => res.status(500).json({ error: err.message }))
  })

  app.post('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
    const { username, password, nickname, gender, age, location, role } = req.body
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' })
    }

    const hashedPassword = bcrypt.hashSync(password, 10)

    db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, role || 'user'], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message })
        }
        const newUserId = this.lastID
        db.run('INSERT INTO user_details (user_id, nickname, gender, age, current_city) VALUES (?, ?, ?, ?, ?)',
          [newUserId, nickname || null, gender || null, age || null, location || null], function(err2) {
            if (err2) {
              return res.status(500).json({ error: err2.message })
            }
            res.json({ message: 'User created successfully', id: newUserId })
          })
      })
  })

  // 获取单个活动详情（包含报名状态）
  app.get('/api/activities/:id', authenticateToken, (req, res) => {
    const activityId = req.params.id
    const userId = req.user.id
    
    db.get(`SELECT a.*, GROUP_CONCAT(ap.photo_url) as photos,
            CASE WHEN ar.id IS NOT NULL THEN 1 ELSE 0 END as is_registered,
            CASE WHEN datetime('now') <= datetime(a.registration_deadline) THEN 1 ELSE 0 END as can_register
            FROM activities a
            LEFT JOIN activity_photos ap ON a.id = ap.activity_id
            LEFT JOIN activity_registrations ar ON a.id = ar.activity_id AND ar.user_id = ?
            WHERE a.id = ? AND a.status = 1
            GROUP BY a.id`, [userId, activityId], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      if (!row) {
        return res.status(404).json({ error: 'Activity not found' })
      }
      res.json(row)
    })
  })

  // 获取单个活动详情（公开访问，无需认证）
  app.get('/api/activities/:id/public', (req, res) => {
    const activityId = req.params.id
    
    db.get(`SELECT a.*, GROUP_CONCAT(ap.photo_url) as photos,
            (SELECT COUNT(*) FROM activity_registrations ar WHERE ar.activity_id = a.id) as registration_count,
            CASE WHEN datetime('now') <= datetime(a.registration_deadline) THEN 1 ELSE 0 END as can_register
            FROM activities a
            LEFT JOIN activity_photos ap ON a.id = ap.activity_id
            WHERE a.id = ? AND a.status = 1
            GROUP BY a.id`, [activityId], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      if (!row) {
        return res.status(404).json({ error: 'Activity not found' })
      }
      // 移除用户相关的字段
      delete row.is_registered
      res.json(row)
    })
  })

  // 管理员活动路由
  app.get('/api/admin/activities', authenticateToken, requireAdmin, (req, res) => {
    db.all(`SELECT 
              a.*, 
              GROUP_CONCAT(ap.photo_url) AS photos,
              CASE WHEN a.status = 1 THEN 'upcoming' ELSE 'cancelled' END AS status,
              (
                SELECT COUNT(1) 
                FROM activity_registrations ar 
                WHERE ar.activity_id = a.id
              ) AS current_participants
            FROM activities a
            LEFT JOIN activity_photos ap ON a.id = ap.activity_id
            GROUP BY a.id
            ORDER BY a.created_at DESC`, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json(rows)
    })
  })

  app.get('/api/admin/activities/recent', authenticateToken, requireAdmin, (req, res) => {
    db.all(`SELECT 
              a.id, a.title, a.date, a.registration_deadline,
              a.location, a.type, a.price, a.max_participants, a.age_range,
              CASE WHEN a.status = 1 THEN 'upcoming' ELSE 'cancelled' END AS status,
              (
                SELECT COUNT(1) 
                FROM activity_registrations ar 
                WHERE ar.activity_id = a.id
              ) AS current_participants,
              GROUP_CONCAT(ap.photo_url) AS photos
            FROM activities a
            LEFT JOIN activity_photos ap ON a.id = ap.activity_id
            GROUP BY a.id
            ORDER BY a.created_at DESC
            LIMIT 5`, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json(rows)
    })
  })

  app.put('/api/admin/activities/:id/status', authenticateToken, requireAdmin, (req, res) => {
    const { status } = req.body
    const activityId = req.params.id
    const statusValue = (status === 'cancelled' || status === 0 || status === '0') ? 0 : 1
    db.run('UPDATE activities SET status = ? WHERE id = ?', [statusValue, activityId], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json({ message: 'Activity status updated successfully' })
    })
  })

  app.delete('/api/admin/activities/:id', authenticateToken, requireAdmin, (req, res) => {
    const activityId = req.params.id
    db.run('DELETE FROM activities WHERE id = ?', [activityId], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json({ message: 'Activity deleted successfully' })
    })
  })

  // 创建活动（支持报名截止时间）
  app.post('/api/admin/activities/create', authenticateToken, requireAdmin, upload.array('images'), (req, res) => {
    const { title, description, date, registration_deadline, location, type, price, max_participants, age_range, notes } = req.body
    if (!title || !date || !registration_deadline) {
      return res.status(400).json({ error: 'title, date, and registration_deadline are required' })
    }
    const details = description || null
    const loc = location || null
    const actType = type || null
    const actPrice = (price === undefined || price === null || price === '') ? 0 : Number(price)
    const maxP = (max_participants === undefined || max_participants === null || max_participants === '') ? 0 : Number(max_participants)
    const ageRange = age_range || null
    const noteVal = notes || null
    db.run('INSERT INTO activities (date, registration_deadline, title, details, notes, location, type, price, max_participants, age_range) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [date, registration_deadline, title, details, noteVal, loc, actType, actPrice, maxP, ageRange], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message })
        }
      const activityId = this.lastID
      if (req.files && req.files.length > 0) {
        const photoPromises = req.files.map(file => {
          return new Promise((resolve, reject) => {
            db.run('INSERT INTO activity_photos (activity_id, photo_url) VALUES (?, ?)', 
                [activityId, `/uploads/${file.filename}`], (err2) => {
                  if (err2) reject(err2); else resolve()
                })
            })
          })
        Promise.all(photoPromises)
          .then(() => res.json({ message: 'Activity created successfully', id: activityId }))
            .catch(err2 => res.status(500).json({ error: err2.message }))
      } else {
        res.json({ message: 'Activity created successfully', id: activityId })
      }
      })
  })

  // 管理员统计接口（汇总返回，满足Dashboard需求）
  app.get('/api/admin/stats/users', authenticateToken, requireAdmin, (req, res) => {
    // 计算四个指标：总用户、总活动、进行中活动、今日新用户
    const result = { totalUsers: 0, totalActivities: 0, activeActivities: 0, todayUsers: 0 }
    db.get('SELECT COUNT(*) AS c FROM users', (err, row1) => {
      if (err) return res.status(500).json({ error: err.message })
      result.totalUsers = row1?.c || 0
      db.get('SELECT COUNT(*) AS c FROM activities', (err2, row2) => {
        if (err2) return res.status(500).json({ error: err2.message })
        result.totalActivities = row2?.c || 0
        db.get('SELECT COUNT(*) AS c FROM activities WHERE status = 1', (err3, row3) => {
          if (err3) return res.status(500).json({ error: err3.message })
          result.activeActivities = row3?.c || 0
          db.get("SELECT COUNT(*) AS c FROM users WHERE DATE(created_at) = DATE('now')", (err4, row4) => {
            if (err4) return res.status(500).json({ error: err4.message })
            result.todayUsers = row4?.c || 0
            res.json(result)
          })
        })
      })
    })
  })

  // 可选：活动统计（保持存在，避免404）
  app.get('/api/admin/stats/activities', authenticateToken, requireAdmin, (req, res) => {
    const result = { totalActivities: 0, activeActivities: 0 }
    db.get('SELECT COUNT(*) AS c FROM activities', (err, row1) => {
      if (err) return res.status(500).json({ error: err.message })
      result.totalActivities = row1?.c || 0
      db.get('SELECT COUNT(*) AS c FROM activities WHERE status = 1', (err2, row2) => {
        if (err2) return res.status(500).json({ error: err2.message })
        result.activeActivities = row2?.c || 0
        res.json(result)
      })
    })
  })

  // 报名相关API
  app.post('/api/activities/:id/register', authenticateToken, (req, res) => {
    const activityId = req.params.id
    const userId = req.user.id
    const { notes } = req.body

    // 检查活动是否存在且可报名
    db.get(`SELECT a.*, 
            CASE WHEN datetime('now') <= datetime(a.registration_deadline) THEN 1 ELSE 0 END as can_register
            FROM activities a
            WHERE a.id = ? AND a.status = 1`, [activityId], (err, activity) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      if (!activity) {
        return res.status(404).json({ error: 'Activity not found' })
      }
      if (!activity.can_register) {
        return res.status(400).json({ error: 'Registration deadline has passed' })
      }

      // 检查是否已报名
      db.get('SELECT id FROM activity_registrations WHERE activity_id = ? AND user_id = ?', 
        [activityId, userId], (err, existing) => {
        if (err) {
          return res.status(500).json({ error: err.message })
        }
        if (existing) {
          return res.status(400).json({ error: 'Already registered for this activity' })
        }

        // 创建报名记录
        db.run('INSERT INTO activity_registrations (activity_id, user_id, notes) VALUES (?, ?, ?)',
          [activityId, userId, notes || null], function(err) {
            if (err) {
              return res.status(500).json({ error: err.message })
            }
            res.json({ message: 'Registration successful', id: this.lastID })
          })
      })
    })
  })

  app.delete('/api/activities/:id/register', authenticateToken, (req, res) => {
    const activityId = req.params.id
    const userId = req.user.id

    db.run('DELETE FROM activity_registrations WHERE activity_id = ? AND user_id = ?',
      [activityId, userId], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message })
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Registration not found' })
        }
        res.json({ message: 'Registration cancelled successfully' })
      })
  })

  app.get('/api/activities/:id/registrations', authenticateToken, (req, res) => {
    const activityId = req.params.id

    db.all(`SELECT ar.*, u.username, ud.nickname, ud.gender, ud.age
            FROM activity_registrations ar
            JOIN users u ON ar.user_id = u.id
            LEFT JOIN user_details ud ON u.id = ud.user_id
            WHERE ar.activity_id = ?
            ORDER BY ar.registration_time DESC`, [activityId], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json(rows)
    })
  })

  // 获取最新用户数据（按性别）
  app.get('/api/users/latest/:gender', (req, res) => {
    const gender = req.params.gender
    const limit = parseInt(req.query.limit) || 1

    if (!['男', '女'].includes(gender)) {
      return res.status(400).json({ error: 'Invalid gender parameter' })
    }

    db.all(`SELECT u.id, u.username, u.avatar, ud.nickname, ud.gender, ud.age, 
                   ud.height, ud.education, ud.occupation, ud.current_city,
                   ud.personal_introduction
            FROM users u
            LEFT JOIN user_details ud ON u.id = ud.user_id
            WHERE ud.gender = ? AND u.status = 1
            ORDER BY u.created_at DESC
            LIMIT ?`, [gender, limit], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json(rows)
    })
  })
}