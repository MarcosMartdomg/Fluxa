# Fluxa

Fluxa is a professional, clean, and scalable event-based workflow automation platform inspired by Zapier/Make.

## Project Goal
A platform where users can:
- Register and login.
- Create workflows.
- Configure triggers and actions.
- Execute workflows and view logs.
- Use webhooks and scheduled triggers.

## Tech Stack
- **Backend**: NestJS, TypeScript, Prisma, PostgreSQL, Redis, BullMQ, JWT, Swagger.
- **Frontend**: React, Vite, TypeScript, Tailwind CSS, React Router DOM, TanStack Query, Axios.
- **Infrastructure**: Docker Compose (PostgreSQL, Redis).

## Project Structure
```text
fluxa/
├── backend/     # NestJS application
├── frontend/    # React application
├── docs/        # Documentation
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- Docker and Docker Compose
- npm or yarn

### 1. Database & Infrastructure
Start PostgreSQL and Redis:
```bash
docker-compose up -d
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your local configuration
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Update .env with your local configuration
npm run dev
```

## Prisma Notes
- Use `npx prisma studio` to explore the database visually.
- Models included: `User`, `Workflow`, `Trigger`, `Action`, `Execution`, `ExecutionLog`.

## License
MIT
