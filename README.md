# Eng Tasks API

## Setup
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev

## Architecture Decisions
- **Layered architecture** (routes → controllers → services → repositories): enforces separation of concerns; business logic lives only in services
- **Redis cache-aside**: GET /tasks and GET /users are cached; any write invalidates the pattern to prevent stale data
- **Socket.io**: emits `task.updated` and `comment.created` events to all connected clients on mutations
- **Zod validation in middleware**: all input is validated and sanitized before reaching the service layer — no raw input touches business logic
- **Fixed-window rate limiting**: simple and effective for this scale; sliding window would be preferable in production
- **SQLite + Prisma**: sufficient for assessment; swap `provider = "postgresql"` in schema.prisma for production

## Tradeoffs & What I'd Improve
- Add JWT auth + role-based access control (middleware pattern)  
- Switch to cursor-based pagination for large datasets  
- Use a message queue (BullMQ) for activity logging instead of inline awaits  
- Add unit tests for the service layer  
- Use PostgreSQL in production for proper enum ordering and full-text search