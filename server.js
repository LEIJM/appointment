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

// Public activities route (no authentication required)
app.get('/api/activities/public', (req, res) => {
  db.all(`SELECT a.*, GROUP_CONCAT(ap.photo_url) as photos
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