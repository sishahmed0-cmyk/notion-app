# 🚀 Notion Clone - Full Stack App

A feature-rich Notion-like workspace app built with React, Node.js, and MongoDB.

## ✨ Features

- 📝 Rich block-based editor (text, headings, bullet, todo, code, quote, callout...)
- 🗂️ Nested page hierarchy with sidebar navigation
- ✅ Kanban board for task management (drag & drop)
- 🔐 JWT-based authentication (register/login)
- 🌙 Dark & Light theme toggle
- ⭐ Favorites, Trash/Restore pages
- 📱 Responsive design (mobile-friendly)
- ⚡ Auto-save while typing

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, React Router v6         |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB + Mongoose                |
| Auth       | JWT (JSON Web Tokens) + bcryptjs  |
| Styling    | Pure CSS with CSS Variables       |

---

## 📁 Project Structure

```
notion-app/
├── backend/
│   ├── models/          # Mongoose models (User, Page, Task, Workspace)
│   ├── routes/          # Express routes (auth, pages, tasks, blocks)
│   ├── middleware/       # JWT auth middleware
│   ├── server.js        # Main Express server
│   ├── .env.example     # Environment variables template
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── sidebar/     # Sidebar + page tree
│   │   │   └── editor/      # Block editor
│   │   ├── context/         # React Context (Auth, App)
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Axios API instance
│   │   ├── styles/          # Global CSS
│   │   ├── App.js           # Routes
│   │   └── index.js         # Entry point
│   └── package.json
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+ → https://nodejs.org
- MongoDB (choose one):
  - **Local**: Install from https://www.mongodb.com/try/download/community
  - **Cloud (recommended)**: Free at https://www.mongodb.com/atlas

---

### Step 1 — Clone / Open project
Open the `notion-app` folder in VS Code.

---

### Step 2 — Backend Setup

Open terminal in VS Code (`Ctrl + backtick`):

```bash
cd backend
npm install
```

Create your `.env` file:
```bash
copy .env.example .env
```

Open `.env` and fill in:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notionclone
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

> **MongoDB Atlas (cloud):** Replace MONGODB_URI with your Atlas connection string:
> `mongodb+srv://<user>:<password>@cluster.mongodb.net/notionclone`

Start backend:
```bash
npm run dev
```
✅ You should see: `MongoDB connected` + `Server running on port 5000`

---

### Step 3 — Frontend Setup

Open a **new terminal** in VS Code:

```bash
cd frontend
npm install
npm start
```

✅ Browser opens at `http://localhost:3000`

---

## 🎯 Usage

1. Go to `http://localhost:3000`
2. Click **"Create one"** to register
3. Your workspace is ready!
4. Create pages, add blocks, manage tasks

---

## 🔧 Customization Ideas

- Add real-time collaboration with Socket.io
- Add image upload with Cloudinary
- Add database views (table, gallery, calendar)
- Add export to PDF/Markdown
- Add workspace members & permissions

---

## 📝 API Endpoints

| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| POST   | /api/auth/register    | Register user       |
| POST   | /api/auth/login       | Login user          |
| GET    | /api/auth/me          | Get current user    |
| GET    | /api/pages            | Get all pages       |
| POST   | /api/pages            | Create page         |
| PUT    | /api/pages/:id        | Update page         |
| DELETE | /api/pages/:id        | Archive page        |
| GET    | /api/tasks            | Get all tasks       |
| POST   | /api/tasks            | Create task         |
| PUT    | /api/tasks/:id        | Update task         |
| DELETE | /api/tasks/:id        | Delete task         |
