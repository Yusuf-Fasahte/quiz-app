Backend README

1. Copy `.env.example` to `.env` and set DATABASE_URL, e.g.:
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/quizdb
2. Run migrations:
   psql "$DATABASE_URL" -f migrations/create_tables.sql
   psql "$DATABASE_URL" -f migrations/seed.sql
3. Start server:
   npm install
   npm run dev
