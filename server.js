import express from 'express';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

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

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Database setup
const db = new sqlite3.Database('matchmaking.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar TEXT,
    status INTEGER DEFAULT 1,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // User details table
  db.run(`CREATE TABLE IF NOT EXISTS user_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    nickname TEXT,
    real_name TEXT,
    gender TEXT,
    phone TEXT,
    phone_location TEXT,
    age INTEGER,
    birthday DATE,
    zodiac TEXT,
    constellation TEXT,
    height INTEGER,
    weight INTEGER,
    income TEXT,
    education TEXT,
    occupation TEXT,
    industry TEXT,
    marital_status TEXT,
    hobbies TEXT,
    only_child TEXT,
    family_background TEXT,
    marriage_timeline TEXT,
    has_car BOOLEAN DEFAULT 0,
    has_house BOOLEAN DEFAULT 0,
    household_province TEXT,
    household_city TEXT,
    household_district TEXT,
    household_street TEXT,
    current_province TEXT,
    current_city TEXT,
    current_district TEXT,
    current_street TEXT,
    characteristics TEXT,
    expected_age_min INTEGER,
    expected_age_max INTEGER,
    expected_height_min INTEGER,
    expected_height_max INTEGER,
    expected_occupation TEXT,
    expected_income TEXT,
    expected_education TEXT,
    expected_marital_status TEXT,
    expected_has_car BOOLEAN,
    expected_has_house BOOLEAN,
    expected_location TEXT,
    accept_children BOOLEAN,
    other_notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  )`);

  // Activities table
  db.run(`CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    title TEXT NOT NULL,
    details TEXT,
    notes TEXT,
    status INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Activity photos table
  db.run(`CREATE TABLE IF NOT EXISTS activity_photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    activity_id INTEGER NOT NULL,
    photo_url TEXT NOT NULL,
    FOREIGN KEY (activity_id) REFERENCES activities (id) ON DELETE CASCADE
  )`);

  // Insert default admin user
  const adminPassword = bcrypt.hashSync('admin123', 10);
  db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)`, 
    ['admin', adminPassword, 'admin'], (err) => {
      if (err) {
        console.error('Error inserting admin user:', err);
      } else {
        console.log('Admin user created (admin/admin123)');
      }
    });
}

// JWT middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Admin middleware
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Authentication routes
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, 'your-secret-key');
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  });
});

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  
  // 验证输入参数
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }
  
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function(err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        return res.status(400).json({ error: 'Username already exists' });
      }
      return res.status(500).json({ error: 'Database error' });
    }
    
    const token = jwt.sign({ id: this.lastID, username: username, role: 'user' }, 'your-secret-key');
    res.json({ token, user: { id: this.lastID, username: username, role: 'user' } });
  });
});

// User routes
app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
  db.all(`SELECT u.id, u.username, u.avatar, u.status, u.role, u.created_at,
          ud.nickname, ud.real_name, ud.gender, ud.age, ud.height, ud.weight,
          ud.education, ud.occupation, ud.marital_status, ud.current_city
          FROM users u
          LEFT JOIN user_details ud ON u.id = ud.user_id
          ORDER BY u.created_at DESC`, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get('/api/users/:id', authenticateToken, (req, res) => {
  const userId = req.params.id;
  
  db.get(`SELECT u.*, ud.* FROM users u
          LEFT JOIN user_details ud ON u.id = ud.user_id
          WHERE u.id = ?`, [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(row);
  });
});

app.put('/api/users/:id/details', authenticateToken, upload.single('avatar'), (req, res) => {
  const userId = req.params.id;
  const details = req.body;
  
  // Handle avatar upload
  if (req.file) {
    details.avatar = `/uploads/${req.file.filename}`;
  }
  
  // Check if user details exist
  db.get('SELECT id FROM user_details WHERE user_id = ?', [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (row) {
      // Update existing details
      const fields = Object.keys(details).map(key => `${key} = ?`).join(', ');
      const values = Object.values(details);
      
      db.run(`UPDATE user_details SET ${fields} WHERE user_id = ?`, [...values, userId], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'User details updated successfully' });
      });
    } else {
      // Insert new details
      const fields = Object.keys(details).join(', ');
      const placeholders = Object.keys(details).fill('?').join(', ');
      const values = Object.values(details);
      
      db.run(`INSERT INTO user_details (user_id, ${fields}) VALUES (?, ${placeholders})`, [userId, ...values], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'User details created successfully' });
      });
    }
  });
});

// Activity routes
app.get('/api/activities', authenticateToken, (req, res) => {
  db.all(`SELECT a.*, GROUP_CONCAT(ap.photo_url) as photos
          FROM activities a
          LEFT JOIN activity_photos ap ON a.id = ap.activity_id
          WHERE a.status = 1
          GROUP BY a.id
          ORDER BY a.date DESC`, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get single activity details
app.get('/api/activities/:id', authenticateToken, (req, res) => {
  const activityId = req.params.id;
  
  db.get(`SELECT a.*, GROUP_CONCAT(ap.photo_url) as photos,
          (SELECT COUNT(*) FROM activity_registrations ar WHERE ar.activity_id = a.id) as registration_count,
          CASE WHEN datetime('now') <= datetime(a.registration_deadline) THEN 1 ELSE 0 END as can_register
          FROM activities a
          LEFT JOIN activity_photos ap ON a.id = ap.activity_id
          WHERE a.id = ? AND a.status = 1
          GROUP BY a.id`, [activityId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    res.json(row);
  });
});

// Public activities route (no authentication required)
app.get('/api/activities/public', (req, res) => {
  db.all(`SELECT a.*, GROUP_CONCAT(ap.photo_url) as photos,
          (SELECT COUNT(*) FROM activity_registrations ar WHERE ar.activity_id = a.id) as registration_count,
          CASE WHEN datetime('now') <= datetime(a.registration_deadline) THEN 1 ELSE 0 END as can_register
          FROM activities a
          LEFT JOIN activity_photos ap ON a.id = ap.activity_id
          WHERE a.status = 1
          GROUP BY a.id
          ORDER BY a.date DESC
          LIMIT 10`, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/activities', authenticateToken, requireAdmin, upload.array('photos'), (req, res) => {
  const { date, title, details, notes } = req.body;
  
  db.run('INSERT INTO activities (date, title, details, notes) VALUES (?, ?, ?, ?)', 
    [date, title, details, notes], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const activityId = this.lastID;
    
    // Handle photo uploads
    if (req.files && req.files.length > 0) {
      const photoPromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
          db.run('INSERT INTO activity_photos (activity_id, photo_url) VALUES (?, ?)', 
            [activityId, `/uploads/${file.filename}`], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      });
      
      Promise.all(photoPromises)
        .then(() => res.json({ message: 'Activity created successfully', id: activityId }))
        .catch(err => res.status(500).json({ error: err.message }));
    } else {
      res.json({ message: 'Activity created successfully', id: activityId });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;