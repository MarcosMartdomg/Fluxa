# Project Context: Fluxa

Fluxa is a professional, event-based workflow automation platform designed to connect external services and automate complex tasks through a visual builder. Inspired by platforms like Zapier and Make, Fluxa emphasizes a canvas-first design philosophy where users construct automation flows visually and the system translates them into executable backend pipelines.

---

## 🚀 Core Tech Stack

### Backend
- **Framework**: [NestJS](https://nestjs.com/) (Modular architecture)
- **Language**: TypeScript
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Queues**: [BullMQ](https://docs.bullmq.io/) (registered, not yet active for execution)
- **Auth**: JWT (JSON Web Tokens)
- **Documentation**: Swagger UI

### Frontend
- **Framework**: [React](https://reactjs.org/) (via Vite)
- **Language**: TypeScript
- **Workflow Canvas**: [@xyflow/react](https://reactflow.dev/) (React Flow)
- **Styling**: Vanilla CSS + custom design system
- **State Management**: React Context (Auth, Projects, Connections)
- **Routing**: React Router DOM

---

## 🏗️ Architecture & Core Systems

### 1. Visual Workflow Builder (Frontend Core)

The center of the product is a **drag-and-drop node-based canvas** built with React Flow. Users design automation workflows by placing and connecting typed nodes:

| Node Type | Purpose | Visual Behavior |
|---|---|---|
| **Trigger** | Entry point (Webhook, Schedule, Event) | Indigo accent, shows webhook URL |
| **Action** | Executes a task (HTTP, Email, Google Sheets, etc.) | Dark accent, shows provider label |
| **Condition** | Branching logic (if/else) | Amber accent, dual output handles |
| **Delay** | Pauses execution for N seconds | Gray accent |
| **AddNode** | Sequential "+" button to insert new steps | Minimal, auto-managed |

Each node carries structured data (`label`, `sublabel`, `provider`, `actionKey`, `config`, `execStatus`, `execResult`) that is persisted as a JSON canvas and synchronized to executable backend records.

**Key frontend capabilities:**
- Node selection, editing via `NodeEditorPanel`
- Integration configuration via `ActionConfigPanel` with field schemas
- Real-time execution status badges per node (IDLE → RUNNING → COMPLETED/FAILED)
- Execution result inspection in the editor panel
- Keyboard shortcuts (Delete/Backspace to remove nodes)
- Canvas panning, zooming, and minimap navigation

---

### 2. Workflow Engine (Backend Core)

The execution engine follows a **dynamic action handler registry** pattern, replacing the original hardcoded switch dispatch.

#### Architecture

```
WorkflowEngineService
  ├── Injects: ACTION_HANDLERS[] (via token)
  ├── Builds: Map<ActionType, ActionHandler> at construction
  └── executeWorkflow(workflowId, payload, executionId?)
        ├── Creates/updates Execution record
        ├── Fetches workflow + ordered actions
        ├── For each action:
        │     ├── Creates StepExecution (status: RUNNING)
        │     ├── Resolves handler from registry
        │     ├── Executes with retry support
        │     ├── Updates StepExecution (COMPLETED/FAILED)
        │     └── Logs step result
        └── Updates Execution (COMPLETED/FAILED)
```

#### Registered Handlers

| Handler | ActionType | Status | Description |
|---|---|---|---|
| `HttpRequestHandler` | `HTTP_REQUEST` | ✅ Working | Executes fetch() with configurable method, headers, body |
| `DelayHandler` | `DELAY` | ✅ Working | Pauses execution for N seconds |
| `EmailHandler` | `EMAIL` | ⚠️ Mock | Logs email details, returns mock success |
| `GoogleSheetsHandler` | `GOOGLE_SHEETS` | ⚠️ Backend-Ready | Retrieves user credentials, validates config, mock API calls |

#### Retry Support
Each action supports configurable retry behavior via its `config` object:
- `retryCount`: Number of retry attempts before marking as failed (default: 0)
- `retryDelayMs`: Milliseconds to wait between retries (default: 1000)

The engine logs each retry attempt as a `WARNING` and only halts the workflow after all retries are exhausted.

---

### 3. Credentials Module

A dedicated module for storing and retrieving external integration credentials per user.

- **Model**: `Connection` (userId + providerId + name → unique; credentials stored as encrypted JSON)
- **Service**: `CredentialsService` — upsert, find by provider, find by ID, delete
- **Controller**: `CredentialsController` — REST API at `/credentials`, protected by JWT
- **Integration**: `GoogleSheetsHandler` resolves credentials at runtime via `CredentialsService.findByProvider(userId, 'google')`

---

### 4. Canvas → Action Sync Layer

A synchronization mechanism that translates visual canvas nodes into executable database records.

**How it works:**
1. When a user saves the canvas (`ProjectsService.updateCanvas`), the system automatically triggers `WorkflowsService.syncActionsFromCanvas(workflowId)`
2. The sync method reads the `ProjectCanvas` JSON (cards + edges)
3. It identifies the trigger node and upserts a `Trigger` record
4. It follows edges from the trigger to build a linear execution order of action nodes
5. It clears existing `Action` records and recreates them with:
   - Correct `ActionType` mapping (e.g., `provider: 'google'` → `GOOGLE_SHEETS`)
   - The `actionKey` merged into the config object
   - Sequential `order` values

This layer is **transparent to the user** — saving the canvas automatically prepares the workflow for execution.

---

### 5. Execution & Step Execution Logging

Two-level execution tracking system:

| Model | Purpose | Key Fields |
|---|---|---|
| `Execution` | Workflow-level run record | status, payload, startedAt, finishedAt |
| `StepExecution` | Per-action result record | actionId, status, input, output, error, timestamps |
| `ExecutionLog` | Detailed audit trail | level (INFO/WARNING/ERROR), message, meta |

The frontend polls execution status and maps `StepExecution` results back to individual canvas nodes, enabling real-time visual feedback during workflow runs.

---

## 📊 Data Models (Prisma Schema)

| Model | Description |
|---|---|
| `User` | Authentication, profile, ownership of projects/workflows/connections |
| `Project` | Workspace for organizing workflows; includes a JSON-based canvas |
| `ProjectCanvas` | Visual state (cards + edges) for the workflow builder |
| `Workflow` | Automation definition linking a project to triggers and actions |
| `Trigger` | Entry point configuration (`WEBHOOK`, `SCHEDULE`, `EVENT`) |
| `Action` | Executable step (`HTTP_REQUEST`, `EMAIL`, `DELAY`, `CONDITION`, `GOOGLE_SHEETS`) |
| `Execution` | Runtime instance of a workflow with status tracking |
| `StepExecution` | Per-action execution result with input/output/error capture |
| `ExecutionLog` | Detailed log entries per execution step |
| `Connection` | User credentials per provider (API keys, OAuth tokens) |
| `Contact` | Landing page contact form submissions |

---

## 🔌 Integrations Status

### Integration Maturity Levels

| Level | Definition |
|---|---|
| **UI-Only** | Frontend metadata and action schemas exist. No backend handler. Selectable in the builder but not executable. |
| **Backend-Ready** | Backend handler implemented with credential lookup and input validation. Execution is mocked (no real external API call). |
| **Functional** | Full end-to-end: UI config → backend handler → real API call → result logging. |

### Current Integration Map

| Provider | Resource | Actions | Maturity | Notes |
|---|---|---|---|---|
| **Google** | Sheets | `append_row`, `read_rows` | **Backend-Ready** | Handler resolves credentials, validates config, returns mock response |
| **Google** | Docs | `create_document`, `append_text` | UI-Only | Frontend schemas only |
| **Microsoft** | Excel | `add_row` | UI-Only | Frontend schemas only |
| **Microsoft** | Outlook | `send_email` | UI-Only | Frontend schemas only |
| **Slack** | Messages | `send_message` | UI-Only | Frontend schemas only |
| **Discord** | Messages | `send_message` | UI-Only | Frontend schemas only |
| **Shopify** | Orders | `create_order` | UI-Only | Frontend schemas only |
| **Core** | HTTP | Configurable request | **Functional** | Real fetch() execution |
| **Core** | Email | Send email | Backend-Ready | Mock — no SMTP configured |
| **Core** | Delay | Wait N seconds | **Functional** | Real setTimeout execution |

---

## 🌐 Interface Structure

### Landing Pages (Marketing)
- **Home**: Main value proposition and hero section
- **Product**: Technical overview and architecture details
- **Features**: Core functionalities (Webhooks, Scheduling, etc.)
- **Use Cases**: Practical automation examples
- **Contact**: Functional contact form with database persistence

### App (Product)
- **Dashboard**: Project activity overview
- **Workflow Builder**: Visual canvas for designing automation flows (React Flow)
- **Executions Page**: Execution history with timeline and node-level status visualization
- **Settings**: User configuration
- **Auth Flow**: JWT-based login and registration with session persistence

---

## 🛠️ Development Environment

- **Local Launch**:
  - Infrastructure: `docker compose up -d` (PostgreSQL & Redis)
  - Backend: `cd backend && npm run start:dev` (Port 3000)
  - Frontend: `cd frontend && npm run dev` (Port 5173)
- **Environment**: Configuration via `.env` files in `backend/` and `frontend/`
- **CORS**: Backend configured to accept requests from `http://localhost:5173` with credentials

---

## 🗺️ Known Gaps & Next Steps

### Blocking Issues
1. **Execution trigger is disconnected**: `ExecutionsService.trigger()` creates a DB record but does not call `WorkflowEngineService.executeWorkflow()` — clicking "Ejecutar Flujo" does nothing real
2. **ConnectionContext is mocked**: Frontend simulates OAuth with `setTimeout` — never calls the real `/credentials` API
3. **ExecutionsPage shows mock data**: Hardcoded `mockExecutions[]` instead of real backend data
4. **StepExecution not returned by API**: `ExecutionsService.findOne()` doesn't include `stepExecutions` in the response

### Planned Improvements
- Wire execution trigger to the real workflow engine
- Replace mocked `ConnectionContext` with real credentials API calls
- Replace `ExecutionsPage` mock data with real execution history
- Auto-create workflow for new projects
- Implement real OAuth2 flows for Google integration
- Replace `alert()` debug modals with a toast notification system
- Add action-level input schema validation in the backend
