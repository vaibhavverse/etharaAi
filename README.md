# 🚀 TeamPilot | Modern Team Task Management SaaS

TeamPilot is a high-performance, collaborative task management platform designed for fast-moving teams. Built with a focus on premium user experience, security, and scalability, it provides a seamless workflow for project organization and team collaboration.

![TeamPilot Landing Page](https://via.placeholder.com/1200x600/000000/FFFFFF?text=TeamPilot+Dashboard)

## ✨ Features

- **📊 Dynamic Kanban Boards**: Drag-and-drop task management with real-time status updates.
- **🛡️ Advanced RBAC**: Role-Based Access Control (Admin/Member) scoped per project.
- **📈 Insightful Dashboard**: Real-time project statistics, task distribution, and completion rates.
- **🔐 Secure Authentication**: JWT-based auth with protected routes and persistent sessions.
- **👥 Team Collaboration**: Invite members to projects, assign tasks, and track progress together.
- **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop views.
- **🎨 Premium UI**: Dark-mode-first aesthetic with glassmorphism and smooth Framer Motion animations.

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite 8**
- **Tailwind CSS 4.0** (Modern utility-first styling)
- **Framer Motion** (High-end animations)
- **React Query** (Server state management)
- **Zustand** (Global state management)
- **Lucide React** (Beautiful iconography)

### Backend
- **Node.js** + **Express 5.2** (Native async support & improved routing)
- **MongoDB Atlas** + **Mongoose** (Database & ODM)
- **JSON Web Tokens (JWT)** (Secure authentication)
- **Zod** (Schema validation)
- **Bcrypt.js** (Password hashing)
- **Morgan & Winston** (Logging)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance

### 1. Clone the repository
```bash
git clone https://github.com/vaibhavverse/etharaAi.git
cd etharaAi
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```
Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api/v1
```
Run the frontend:
```bash
npm run dev
```

## 🛤️ API Endpoints

### Auth
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login and receive JWT
- `POST /api/v1/auth/logout` - Clear session
- `GET /api/v1/auth/me` - Get current user profile

### Projects
- `GET /api/v1/projects` - Get all projects for user
- `POST /api/v1/projects` - Create a new project
- `GET /api/v1/projects/:id` - Get project details (RBAC)
- `PATCH /api/v1/projects/:id` - Update project (Admin only)
- `DELETE /api/v1/projects/:id` - Delete project (Admin only)
- `POST /api/v1/projects/:id/members/add` - Add member to project

### Tasks
- `GET /api/v1/tasks/project/:projectId` - Get tasks by project
- `POST /api/v1/tasks` - Create a task
- `PATCH /api/v1/tasks/:id` - Update task status/details
- `DELETE /api/v1/tasks/:id` - Delete task

## 📝 License

This project is licensed under the ISC License.

---

Built with ❤️ by [Vaibhav](https://github.com/vaibhavverse)
