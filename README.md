# 🧠 Online Quiz Application

A full-stack quiz platform built with React, Node.js, Express, and PostgreSQL.  
Created as part of the **Verto ASE Challenge 2025**.

---

## 🚀 Features

- Create, edit, and delete quizzes dynamically
- Add and modify questions, options, and correct answers
- Set custom time limits for quizzes
- Automatically grade results with percentage display
- Sleek **glassmorphic UI** with subtle glowing animations
- Real-time countdown and progress handling
- Fully responsive, animated interface

---

## 🧩 Tech Stack

### Frontend:

- React + Vite
- TailwindCSS
- Framer Motion (animations)

### Backend:

- Node.js + Express
- PostgreSQL
- Axios (API communication)

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/quizly-app.git
cd quizly-app
```

### 2️⃣ Install Dependencies

#### Backend:

```bash
cd backend
npm install
```

#### Frontend:

```bash
cd ../frontend
npm install
```

### 3️⃣ Set Up Environment Variables

In `backend/.env`:

```
PORT=4000
DATABASE_URL=your_postgres_connection_string
```

In `frontend/.env`:

```
VITE_API_URL=http://localhost:4000
```

### 4️⃣ Run Locally

Start backend:

```bash
cd backend
npm start
```

Start frontend:

```bash
cd frontend
npm run dev
```

Then visit:  
👉 **http://localhost:5173**

---

## 🧠 Architecture Overview

```
Frontend (React)
   ↕ REST API Calls
Backend (Express)
   ↕
Database (PostgreSQL)
```

Each quiz, question, and option is stored relationally, with quiz metadata (title, time limit, etc.) saved separately.  
The backend ensures correctness validation, and the frontend handles timing logic, user input, and transitions.

---

## 🎥 Demo Video

Watch my short Loom video explaining the project:  
👉 [https://www.loom.com/share/YOUR_VIDEO_LINK](https://www.loom.com/share/YOUR_VIDEO_LINK)

In the video, I cover:

- My thought process while designing
- Challenges faced and how I solved them
- Improvements I’d add in the next version

---

## 💡 Design Choices

- Used **modular state management** (React useState/useEffect per component)
- Added **time limit** logic in frontend with safe auto-submit on expiry
- Designed UI around **modern fintech glassmorphism** with subtle motion
- Kept backend **RESTful** and extendable (future: user login, analytics)

---

## 🏗️ Deployment Links

- **Frontend:** https://quizly-app.vercel.app
- **Backend API:** https://quizly-backend.onrender.com
- **Repository:** https://github.com/YOUR_USERNAME/quizly-app

---

## ✨ Author

**Yusuf [Your Full Name]**  
🌐 [LinkedIn Profile](https://www.linkedin.com/in/YOUR-LINKEDIN/)  
📧 your.email@example.com

---

## 📚 Notes for Reviewers

This project was built as part of the **Verto Associate Software Engineer Challenge (2025)**.  
I focused on:

- Writing clean, readable code
- Building a working, deployable full-stack product
- Creating an engaging yet professional interface
- Demonstrating end-to-end ownership

---

## ⚡ Future Improvements

- Add authentication for quiz creators
- Add leaderboard and user analytics
- Implement WebSocket live quizzes
- Enhance accessibility & performance optimizations
