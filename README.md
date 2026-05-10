<div align="center">

# 🚀 TeamPilot
### *Next-Gen Team Collaboration & Task Management*

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

**TeamPilot** is a high-performance, collaborative task management SaaS designed for fast-moving teams. Built with a focus on premium user experience, security, and scalability.

[Explore Demo](https://teampilot.com) · [Report Bug](https://github.com/vaibhavverse/etharaAi/issues) · [Request Feature](https://github.com/vaibhavverse/etharaAi/issues)

</div>

---

## 💎 Features at a Glance

<details open>
<summary><b>Click to expand features</b></summary>

- **📊 Dynamic Kanban Boards**: Drag-and-drop task management with real-time status updates.
- **🛡️ Project-Scoped RBAC**: Advanced Role-Based Access Control (Admin/Member) scoped per project.
- **📈 Insightful Dashboard**: Real-time project statistics, task distribution, and completion rates.
- **🔐 Secure Authentication**: JWT-based auth with protected routes and persistent sessions.
- **👥 Team Collaboration**: Invite members to projects, assign tasks, and track progress together.
- **🎨 Premium UI**: Dark-mode-first aesthetic with glassmorphism and smooth Framer Motion animations.
</details>

---

## 📂 Project Structure

```text
TeamPilot/
├── backend/
│   ├── src/
│   │   ├── app.js             # Express app configuration & middleware
│   │   ├── server.js          # Server entry point & DB connection
│   │   ├── config/            # Environment & database config
│   │   ├── controllers/       # Request handlers (logic)
│   │   ├── middlewares/       # Auth, error, and validation guards
│   │   ├── models/            # Mongoose schemas (User, Project, Task)
│   │   ├── routes/            # API endpoint definitions
│   │   ├── services/          # Business logic layer
│   │   ├── utils/             # Helper functions (ApiError, asyncHandler)
│   │   └── validation/        # Zod schemas for input validation
│   └── .env                   # Backend environment variables
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI & Layout components
│   │   ├── lib/               # Axios instance & utility functions
│   │   ├── pages/             # Page views (Dashboard, Login, Register)
│   │   ├── store/             # Zustand state management
│   │   ├── App.jsx            # Root component & routing
│   │   └── main.jsx           # React entry point
│   ├── index.html             # Main HTML template
│   └── .env                   # Frontend environment variables
└── README.md                  # You are here!
```

---

## 🔐 Role-Based Access Control (RBAC)

TeamPilot implements a strict, project-scoped permission system to ensure data security and clear team boundaries.

### 👑 Admin
- [x] Create / Edit / Delete Projects
- [x] Add / Remove Members from Projects
- [x] Create / Edit / Delete Tasks
- [x] Assign Tasks to Members
- [x] View all Projects & Tasks
- [x] Manage User Roles within the Project

### 👤 Member
- [x] View Projects they belong to
- [x] View Tasks assigned to them
- [x] Update status of their own tasks (Drag & Drop)
- [x] Collaborative updates in real-time

---

## 🛠️ Technical Stack

### 💻 Frontend
- **Framework**: React 19 (Latest)
- **Styling**: Tailwind CSS 4.0 + Framer Motion
- **State**: Zustand (Global) + React Query (Server)
- **Icons**: Lucide React

### ⚙️ Backend
- **Engine**: Node.js + Express 5.2 (Native async support)
- **Database**: MongoDB Atlas + Mongoose
- **Validation**: Zod (Type-safe schemas)
- **Security**: JWT + Bcryptjs + Helmet

---

## 🚀 Getting Started

### 1️⃣ Clone & Install
```bash
git clone https://github.com/vaibhavverse/etharaAi.git
cd etharaAi

# Install Backend
cd backend && npm install

# Install Frontend
cd ../frontend && npm install
```

### 2️⃣ Environment Setup
Create `.env` files in both `frontend/` and `backend/` directories as per the provided `.env.example` (or use the templates in the README above).

### 3️⃣ Launch
```bash
# Start Backend (from /backend)
npm run dev

# Start Frontend (from /frontend)
npm run dev
```

---

<div align="center">

### Built with ❤️ for High-Performing Teams

[Website](https://teampilot.com) · [Support](mailto:support@teampilot.com) · [Twitter](https://twitter.com/teampilot)

</div>
