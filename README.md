# 💬 Real-time Chat Application

<div align="center">
  
![Chat App Banner](https://img.shields.io/badge/Chat%20App-Real--time%20Messaging-blue?style=for-the-badge&logo=chat&logoColor=white)

**A modern, full-featured chat application built with cutting-edge technologies**

[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16.0+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--time-010101?style=flat&logo=socket.io&logoColor=white)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat&logo=mongodb&logoColor=white)](https://mongodb.com/)


</div>

---

## 🌟 Features

### 🚀 **Core Functionality**
- 💬 **Real-time messaging** with Socket.io
- 🔐 **Secure authentication** (register/login)
- 🏠 **Room creation & management**
- 📧 **Email invitations** for seamless onboarding
- ✋ **Join request system** with owner approval
- 📁 **File & image sharing** with drag-n-drop
- 😀 **Emoji reactions** with comprehensive picker
- 🌙 **Dark/Light theme** toggle
- 🎨 **Customizable chat backgrounds**
- 🔔 **Smart notification system** with dedicated panel
- 📱 **Responsive design** for all devices

### 🎨 **UI/UX Excellence**
- ✨ Beautiful gradient backgrounds with glassmorphism
- 🎭 Smooth animations and micro-interactions
- 📱 Mobile-first responsive design
- 👤 Profile customization with avatar upload
- 💫 Modern card-based layouts
- 🎪 Interactive emoji system

### 🔧 **Technical Prowess**
- 🗄️ **MongoDB** with optimized schemas
- 🔑 **JWT authentication** with secure token handling
- 📤 **File upload** system with validation
- ⚡ **Socket.io** for lightning-fast communication
- 🛠️ **RESTful API** with comprehensive error handling
- 🏗️ **Modular architecture** for scalability

---

## 🏗️ Project Architecture

```
📦 chat-app/
├── 🖥️  server/                 # Backend powerhouse
│   ├── 📋 models/             # MongoDB schemas
│   ├── 🛣️  routes/             # API endpoints
│   ├── 🛡️  middleware/         # Auth & security
│   ├── 📁 uploads/            # File storage
│   └── 🚀 index.js           # Server entry
├── 🎨 src/                   # Frontend magic
│   ├── 🧩 components/        # React components
│   ├── 🔄 context/          # State management
│   ├── 🌐 services/         # API & socket services
│   └── 🏠 App.jsx           # Main application
└── 📋 package.json          # Dependencies
```

---

## 🚀 Quick Start

### 📋 **Prerequisites**
- 📦 Node.js `v16+`
- 🗄️ MongoDB (local or cloud)
- 📦 npm or yarn

### 🖥️ **Backend Setup**

```bash
# 📁 Navigate to server directory
cd server

# 📦 Install dependencies
npm install

# ⚙️ Setup environment variables
cp .env.example .env
```

**Configure your `.env` file:**
```env
MONGODB_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
CLIENT_URL=http://localhost:5173
```

```bash
# 🚀 Launch the server
npm run dev
```

### 🎨 **Frontend Setup**

```bash
# 📦 Install dependencies
npm install

# ⚙️ Setup environment
cp .env.example .env
```

**Configure frontend `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

```bash
# 🎉 Start development server
npm run dev
```

---

## 🛠️ API Reference

### 🔐 **Authentication**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | 👤 User registration |
| `POST` | `/api/auth/login` | 🔑 User login |
| `GET` | `/api/auth/me` | 👨‍💻 Get current user |
| `PUT` | `/api/auth/profile` | ✏️ Update profile |
| `POST` | `/api/auth/logout` | 🚪 Logout |

### 🏠 **Rooms**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/rooms/my-rooms` | 🏠 Get user's rooms |
| `GET` | `/api/rooms/available` | 🔍 Get available rooms |
| `POST` | `/api/rooms/create` | ➕ Create new room |
| `POST` | `/api/rooms/:roomId/join-request` | ✋ Send join request |
| `POST` | `/api/rooms/:roomId/invite` | 📧 Invite user to room |
| `GET` | `/api/rooms/:roomId/members` | 👥 Get room members |

### 💬 **Messages**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/messages/:roomId` | 📜 Get room messages |
| `POST` | `/api/messages/:roomId` | 📤 Send message |
| `POST` | `/api/messages/:messageId/reaction` | 😀 Add reaction |

### 🔔 **Notifications**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notifications` | 📬 Get notifications |
| `PUT` | `/api/notifications/:id/read` | ✅ Mark as read |
| `POST` | `/api/notifications/:id/respond` | 💬 Respond to invitation |

### 📁 **Files**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/files/upload/:roomId` | 📤 Upload file |
| `GET` | `/api/files/:filename` | 📥 Download file |

---

## 🗄️ Database Schema

<details>
<summary><strong>👤 User Model</strong></summary>

```javascript
{
  username: String,        // 👤 Unique username
  email: String,          // 📧 Email address
  password: String,       // 🔒 Hashed password
  avatar: String,         // 🖼️ Profile picture
  bio: String,           // 📝 User biography
  isOnline: Boolean,     // 🟢 Online status
  lastSeen: Date,        // 👁️ Last activity
  joinedRooms: [ObjectId] // 🏠 Room memberships
}
```
</details>

<details>
<summary><strong>🏠 Room Model</strong></summary>

```javascript
{
  name: String,           // 🏷️ Room name
  description: String,    // 📝 Room description
  createdBy: ObjectId,    // 👤 Room creator
  members: [{
    user: ObjectId,       // 👤 User reference
    joinedAt: Date,       // 📅 Join date
    role: String          // 👑 User role
  }],
  isPrivate: Boolean,     // 🔒 Privacy setting
  maxMembers: Number      // 👥 Member limit
}
```
</details>

<details>
<summary><strong>💬 Message Model</strong></summary>

```javascript
{
  content: String,        // 💬 Message text
  type: String,          // 📝 Message type
  sender: ObjectId,      // 👤 Message author
  room: ObjectId,        // 🏠 Target room
  file: {
    filename: String,    // 📁 File name
    originalName: String, // 📋 Original name
    mimetype: String,    // 🎭 File type
    size: Number,        // 📏 File size
    url: String          // 🔗 File URL
  },
  reactions: [{
    user: ObjectId,      // 👤 Reactor
    emoji: String,       // 😀 Emoji
    createdAt: Date      // 📅 Reaction time
  }]
}
```
</details>

<details>
<summary><strong>🔔 Notification Model</strong></summary>

```javascript
{
  recipient: ObjectId,    // 👤 Notification target
  sender: ObjectId,       // 👤 Notification sender
  type: String,          // 🏷️ Notification type
  title: String,         // 📰 Notification title
  message: String,       // 💬 Notification content
  data: Object,          // 📦 Additional data
  isRead: Boolean,       // 👁️ Read status
  actionTaken: String    // ✅ Action performed
}
```
</details>

---

## ⭐ Key Features Implementation

### 🔄 **Duplicate Prevention**
- ✅ Users cannot join the same room twice
- 🔍 Smart invitation system checks existing memberships
- ⚡ Real-time validation for join requests

### 👥 **Member Management**
- 👀 Complete member visibility within rooms
- 🖼️ Rich member profiles with avatars and bios
- 🟢 Live online status and activity tracking

### 🔔 **Advanced Notifications**
- 📱 Dedicated notification center
- ⚡ Real-time push notifications
- ✅ Smart read/unread management
- 🎛️ Interactive action buttons

### 📁 **File Sharing System**
- 🖼️ Image preview and optimization
- 📄 Document sharing with type validation
- 🛡️ 10MB file size protection
- 💾 Secure storage and retrieval

### 😀 **Emoji Integration**
- 🎨 Comprehensive emoji picker
- ❤️ Message reaction system
- 📱 Cross-platform emoji support

---

## 🔒 Security Features

| Feature | Description |
|---------|-------------|
| 🔑 **JWT Authentication** | Secure token-based authentication |
| 🔒 **Password Hashing** | bcrypt encryption for passwords |
| 🛡️ **File Validation** | Strict file type and size checking |
| 🌐 **CORS Protection** | Cross-origin request security |
| 🧹 **Input Sanitization** | XSS and injection prevention |
| 🚪 **Protected Routes** | Route-level access control |

---

## ⚡ Performance Optimizations

- 📊 **Database Indexing** for lightning-fast queries
- 📄 **Smart Pagination** for messages and notifications
- 🖼️ **Image Optimization** with automatic compression
- 🔄 **Lazy Loading** for improved performance
- ⚡ **Efficient Socket Connections** with connection pooling

---

## 🛠️ Tech Stack

<div align="center">

| Frontend | Backend | Database | Real-time |
|----------|---------|----------|-----------|
| ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white) | ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white) |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) | ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white) | ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white) | ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white) |

</div>

---

## 🤝 Contributing

We love contributions! Here's how you can help:

1. 🍴 **Fork** the repository
2. 🌿 **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. ✨ **Make** your changes
4. 🧪 **Add tests** if applicable
5. 📝 **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
6. 📤 **Push** to the branch (`git push origin feature/AmazingFeature`)
7. 🎉 **Open** a Pull Request

### 📋 **Contribution Guidelines**
- Follow existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation as needed

---






</div>
