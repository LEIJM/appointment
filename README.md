# 💕 相亲交友网站

一个现代化的相亲交友平台，基于Vue 3 + Vite前端和Express.js + SQLite后端构建的全栈应用。

## ✨ 功能特性

### 用户功能
- 🔐 用户注册与登录
- 👤 个人资料管理
- 📱 用户列表浏览
- 🔍 用户详情查看
- 🎯 活动参与
- 📸 头像上传

### 管理功能
- 👨‍💻 管理员仪表板
- 📊 数据统计
- 👥 用户管理
- 🎯 活动管理
- 📸 内容审核

### 技术亮点
- 🚀 全栈一体化启动
- 🔄 热重载开发环境
- 📱 响应式设计
- 🔒 JWT身份认证
- 📸 文件上传支持
- 💾 SQLite数据库

## 🚀 快速开始

### 环境要求
- Node.js (v14 或更高版本)
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 启动应用
```bash
npm run dev
```

应用启动后：
- 🌐 前端地址: http://localhost:5173
- 🔧 后端API: https://api.030516.xyz/api
- 👨‍💻 管理后台: http://localhost:5173/admin

### 默认管理员账户
- 用户名: `admin`
- 密码: `admin123`

## 📁 项目结构

```
相亲/
├── 📁 src/                    # 前端源码
│   ├── 📁 views/              # 页面组件
│   │   ├── Home.vue          # 首页
│   │   ├── Login.vue         # 登录页
│   │   ├── Register.vue      # 注册页
│   │   ├── Profile.vue       # 个人资料
│   │   ├── Activities.vue    # 活动页面
│   │   ├── UserDetails.vue   # 用户详情
│   │   └── AdminDashboard.vue # 管理后台
│   ├── 📁 router/            # 路由配置
│   └── 📁 components/        # 公共组件
├── 📁 uploads/               # 文件上传目录
├── 📁 server-routes.js       # 后端路由
├── 📁 fullstack-server.js    # 全栈服务器
└── 📁 matchmaking.db        # SQLite数据库
```

## 🛠️ 开发脚本

```bash
# 全栈开发模式（推荐）
npm run dev

# 仅启动前端开发服务器
npm run dev:vite

# 仅启动后端服务器
npm run dev:server

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 🔧 API 接口

### 认证接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/profile` - 获取用户信息
- `PUT /api/auth/profile` - 更新用户信息

### 用户接口
- `GET /api/users` - 获取用户列表
- `GET /api/users/:id` - 获取用户详情
- `POST /api/users/upload` - 上传头像

### 活动接口
- `GET /api/activities` - 获取活动列表
- `GET /api/activities/public` - 获取公开活动
- `POST /api/activities` - 创建活动
- `PUT /api/activities/:id` - 更新活动
- `DELETE /api/activities/:id` - 删除活动

### 管理接口
- `GET /api/admin/stats` - 获取统计数据
- `GET /api/admin/users` - 管理用户列表
- `DELETE /api/admin/users/:id` - 删除用户

## 🎯 使用说明

### 用户注册
1. 访问 http://localhost:5173
2. 点击"注册"按钮
3. 填写注册信息
4. 上传头像（可选）
5. 开始使用平台功能

### 活动参与
1. 登录账户
2. 访问活动页面
3. 查看活动详情
4. 参与活动

### 管理后台
1. 访问 http://localhost:5173/admin
2. 使用管理员账户登录
3. 管理用户和活动

## 🔒 安全特性

- JWT令牌认证
- 密码加密存储
- 文件上传类型限制
- 管理员权限控制
- CORS跨域保护

## 🚀 部署说明

### 生产环境构建
```bash
npm run build
```

### 环境变量
- `PORT` - 服务器端口（默认：3001）
- `JWT_SECRET` - JWT密钥
- `NODE_ENV` - 运行环境

## 📝 技术栈

### 前端
- ⚡ Vue 3
- 🚀 Vite
- 🎯 Vue Router
- 💾 Axios
- 🎨 响应式CSS

### 后端
- 🟢 Node.js
- 🚀 Express.js
- 💾 SQLite
- 🔒 JWT
- 📸 Multer (文件上传)

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

