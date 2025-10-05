# Quiz App (React + Tailwind frontend, Node/Express + PostgreSQL backend)

## Overview
Full-stack quiz application where users can take quizzes, see scores, and review answers.

## Structure
- backend/  - Node.js + Express API
- frontend/ - React (Vite) + TailwindCSS

## Quick start (development)

### Requirements
- Node.js >=16
- npm or yarn
- PostgreSQL (or Docker)

### PostgreSQL
Create a database and user, or use Docker:

```bash
docker run --name quiz-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=quizdb -p 5432:5432 -d postgres
```

Set env var for backend (see backend/.env.example)

### Backend
```bash
cd backend
npm install
# create tables and seed:
psql "$DATABASE_URL" -f migrations/create_tables.sql
psql "$DATABASE_URL" -f migrations/seed.sql
# run server
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` (Vite default) for frontend and backend default is `http://localhost:4000`.

## API Endpoints
- POST /quiz -> create a quiz
- POST /quiz/:id/questions -> add questions
- GET /quiz -> list quizzes
- GET /quiz/:id/questions -> get questions for taking (without correctOptionId)
- POST /quiz/:id/submit -> submit answers -> returns { score, total, details }

## Notes
- This repo intentionally keeps things minimal and readable.
- See each folder README for extra details.
