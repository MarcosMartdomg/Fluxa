# Architecture Decisions

## Backend: NestJS + Prisma
- **NestJS**: Provides a robust, modular architecture that scales well.
- **Prisma**: Type-safe ORM for PostgreSQL, simplifying database interactions and migrations.
- **BullMQ**: Reliable queue system for handling background workflow executions.
- **JWT**: Secure industry-standard authentication.

## Frontend: React + Vite + Tailwind
- **Vite**: Ultra-fast development server and build tool.
- **Tailwind CSS**: Utility-first CSS framework for rapid and consistent UI development.
- **TanStack Query**: Powerful state management for asynchronous data fetching.
- **React Router**: Standard routing library with support for protected routes.
