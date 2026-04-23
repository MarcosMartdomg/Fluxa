# Project Context: Fluxa

Fluxa is a professional, event-based workflow automation platform (similar to Zapier or Make) designed to connect systems and automate tasks through triggers and actions.

## 🚀 Core Tech Stack

### Backend
- **Framework**: [NestJS](https://nestjs.com/) (Modular architecture)
- **Language**: TypeScript
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Caching & Queues**: [Redis](https://redis.io/) & [BullMQ](https://docs.bullmq.io/) (for asynchronous task processing)
- **Auth**: JWT (JSON Web Tokens)
- **Documentation**: Swagger UI

### Frontend
- **Framework**: [React](https://reactjs.org/) (via Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (with a custom premium design system)
- **State Management**: React Context & [TanStack Query](https://tanstack.com/query/latest)
- **Routing**: React Router DOM

---

## 🏗️ Architecture & Functionality

### 1. Workflow Engine
The core of Fluxa is its execution engine. Workflows consist of:
- **Triggers**: The entry point (e.g., a Webhook, a scheduled Cron job, or an internal Event).
- **Actions**: The steps executed sequentially (e.g., sending an HTTP request, sending an email, adding a delay, or checking a condition).
- **Executions**: Every time a workflow runs, an `Execution` record is created to track its status (`PENDING`, `RUNNING`, `COMPLETED`, `FAILED`) and store detailed `ExecutionLogs`.

### 2. Project & Canvas
Users organize their work into **Projects**.
- Each project has a **Canvas** (`ProjectCanvas` model) that stores visual data (cards and edges) for a node-based workflow builder UI.
- Projects act as workspaces to group related workflows.

### 3. Asynchronous Processing
Fluxa uses **BullMQ** to handle executions. When a trigger is activated:
1. An execution job is added to a Redis queue.
2. A worker picks up the job and executes the actions defined in the workflow.
3. This ensures the system remains responsive even under heavy load.

---

## 📊 Data Models (Prisma Schema)

- **User**: Authentication, profile, and ownership of projects/workflows.
- **Project**: Workspaces for organizing workflows; includes a JSON-based `canvas`.
- **Workflow**: Definition of the automation logic (links one trigger to many actions).
- **Trigger**: Defines what starts the workflow (`TriggerType`: `WEBHOOK`, `SCHEDULE`, `EVENT`).
- **Action**: Defines what the workflow does (`ActionType`: `HTTP_REQUEST`, `EMAIL`, `DELAY`, `CONDITION`).
- **Execution**: The runtime instance of a workflow.
- **ExecutionLog**: Detailed audit trail for every step of an execution.
- **Contact**: Stores messages from the "Contact Us" landing page.

---

## 🌐 Current Interface Structure

### Landing Pages (Marketing)
- **Home**: Main value proposition and hero section.
- **Product**: Technical overview and architecture details.
- **Features**: List of core functionalities (Webhooks, Scheduling, etc.).
- **Use Cases**: Practical examples of how to use the platform.
- **Contact**: Functional contact form with database persistence.

### App/Tool (Product)
- **Dashboard**: Overview of project activity.
- **Project Canvas**: Visual builder for workflows.
- **Executions Page**: Table and detail view for tracking workflow runs and logs.
- **Auth Flow**: Secure login and registration.

---

## 🛠️ Development Environment
- **Local Launch**:
  - Infra: `docker compose up -d` (Postgres & Redis)
  - Backend: `npm run start:dev` (Port 3000)
  - Frontend: `npm run dev` (Port 5173)
- **Environment**: Configuration is managed via `.env` files in both `backend` and `frontend` folders.
