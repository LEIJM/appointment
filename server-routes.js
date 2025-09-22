import sqlite3 from 'sqlite3'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import express from 'express'

// 数据库初始化
const db = new sqlite3.Database('matchmaking.db')

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

  app.post('/api/activities', authenticateToken, requireAdmin, upload.array('photos'), (req, res) => {
    const { date, title, details, notes } = req.body
    
    db.run('INSERT INTO activities (date, title, details, notes) VALUES (?, ?, ?, ?)', 
      [date, title, details, notes], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      
      const activityId = this.lastID
      
      if (req.files && req.files.length > 0) {
        const photoPromises = req.files.map(file => {
          return new Promise((resolve, reject) => {
            db.run('INSERT INTO activity_photos (activity_id, photo_url) VALUES (?, ?)', 
              [activityId, `/uploads/${file.filename}`], (err) => {
              if (err) reject(err)
              else resolve()
            })
          })
        })
        
        Promise.all(photoPromises)
          .then(() => res.json({ message: 'Activity created successfully', id: activityId }))
          .catch(err => res.status(500).json({ error: err.message }))
      } else {
        res.json({ message: 'Activity created successfully', id: activityId })
      }
    })
  })
}