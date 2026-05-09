# CA Practice Management Platform — Detailed Project Plan

AI-assisted **practice management and office automation** for Chauhan & Jain, an Indian Chartered Accountancy firm (multi-office, multi-service). Built on **open-source** components with **privacy-first architecture** — no confidential client financial data in external AI pipelines.

---

## Business Context

| Aspect | Detail |
|--------|--------|
| Firm | Chauhan & Jain (CA practice) |
| Partners | 3 |
| Offices | 2 — Mehsana (head office, central server), Ahmedabad |
| Employees | ~20 (managers, senior staff, juniors, CA trainees) |
| Departments | Income Tax & TDS · Auditing & Certification · GST & Consultancy · Accounting & Book-keeping |
| Services | Audits, certifications, bookkeeping, ITR, GST returns, TDS returns, consultancy (FEMA, international tax, corporate law, subsidy, virtual CFO, transaction advisory) |
| Existing tools | Tally, Genius (Income Tax filing), GST filing software — remain separate systems |
| Key constraint | **No upload** of highly confidential financial documents/data to external services |

---

## Goals

1. **Operational backbone**: Task assignment, visibility, time tracking, due-date-driven recurring work, client-service mapping, communication, work register, billing status, performance reporting.
2. **Access**: Web-first responsive + mobile-friendly (PWA); usable outside office on the go.
3. **AI layer**: Metadata and workflow intelligence only — drafting, task structuring, NL queries over operational data, summarization — using self-hosted open-source models.
4. **Security**: Private deployment, role-based access, audit trails, encrypted storage.

---

## Technology Stack (Decided)

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | React 18+ with TypeScript | Component ecosystem, PWA support, large talent pool |
| **UI Framework** | Tailwind CSS + shadcn/ui | Modern, responsive, accessible components |
| **Mobile** | PWA (Progressive Web App) | No app store dependency; offline-capable; install on phone |
| **Backend** | Node.js with Fastify (TypeScript) | Fast, type-safe, excellent PostgreSQL integration |
| **ORM** | Prisma | Type-safe queries, migrations, schema-first workflow |
| **Database** | PostgreSQL 16 + pgvector | ACID, JSON support, full-text search, vector embeddings for AI |
| **Cache / Jobs** | Redis + BullMQ | Sessions, token blacklist, job queues, notification delivery |
| **Auth** | Session-based (httpOnly cookies + Redis) | Secure; MFA for partners via TOTP; token blacklisting |
| **File Storage** | MinIO (self-hosted S3-compatible) | AES-256 encrypted; private; no cloud dependency |
| **AI Inference** | Ollama (local) | Run quantized Llama 3 / Mistral / Qwen on office hardware |
| **Vector Search** | pgvector (PostgreSQL extension) | Semantic search over tasks/comments for AI RAG pipeline |
| **Text Search** | PostgreSQL full-text + pg_trgm | Fast keyword search across all entities |
| **Input Validation** | Zod (shared schemas) | PAN, GSTIN, email, phone validators; shared between frontend/backend |
| **Logging** | Pino (structured JSON) + Loki | Correlation IDs, log aggregation, no sensitive data in logs |
| **Monitoring** | Grafana + Loki + Uptime Kuma | Dashboards for logs, uptime, and performance metrics |
| **Deployment** | Docker Compose on office server | Single-command setup; easy backups; VPN for remote access |
| **Reverse Proxy** | Caddy | Auto TLS 1.3, security headers (CSP, HSTS), rate limiting |
| **Security Scanning** | npm audit + Snyk + ESLint security | Dependency vulnerabilities, code quality in CI |
| **Load Testing** | k6 | Validate 50 concurrent users; API response <500ms |

---

## User Roles & Permissions

| Role | Key Capabilities |
|------|-----------------|
| **Partner** | Create clients, assign work to anyone, self-assign, review dashboards, approve completion, view billing and performance reports, manage firm settings |
| **Manager / Senior Staff** | Manage team work, assign to juniors/trainees, review remarks, track deadlines, validate time entries |
| **Junior Staff** | View assigned tasks, update status, add work notes, raise queries, log time |
| **CA Trainee** | Similar to junior; limited service/client access |
| **Admin / Operations** | Manage masters, billing status, internal settings, service calendars, user accounts |

### Permission Dimensions

- **Office scope**: Mehsana, Ahmedabad, or both
- **Department scope**: one or more departments
- **Client access scope**: assigned clients or all
- **Reporting scope**: own work, team, department, or firm-wide

---

## Data Model

### Core Entities

| Entity | Purpose |
|--------|---------|
| `Office` | Mehsana, Ahmedabad, future locations |
| `User` | All employees, partners, trainees |
| `Role` | RBAC with hierarchical permissions |
| `Department` | Functional work area |
| `Client` | Legal/client master record |
| `ClientGroup` | Grouping of related entities under one promoter/family |
| `ClientIdentifier` | PAN, GSTIN, and other unique IDs per client |
| `ContactPerson` | Multiple contacts per client |
| `ServiceMaster` | Library of available services with templates |
| `ClientService` | A client's active subscribed service |
| `ServicePeriod` | Monthly/quarterly/annual period instance |
| `Assignment` | Work item assigned to a person for a client-service-period |
| `Task` | Checklist step within an assignment |
| `TaskComment` | Query, note, remark, or resolution |
| `Worklog` | Time-spent entries linked to assignments/tasks |
| `WorkRegister` | Record of completed work (closure record) |
| `BillingRecord` | Billed/unbilled tracking per assignment |
| `Announcement` | Firm-wide, department, or personal communication |
| `Notification` | System alerts and reminders |
| `AuditLog` | Immutable record of all state changes |

### Client Master Fields

- Client name and legal type (Pvt Ltd, LLP, Partnership, Proprietorship, Individual, Trust, Co-op Society, etc.)
- PAN / GSTIN
- Contact persons with phone, email, designation
- Client group and related entities
- Office owner / relationship partner
- Department associations
- Active subscribed services
- Confidentiality level and access restrictions

### Service Master Configuration

Each service template defines:

- Category and subtype
- Default frequency: monthly / quarterly / annual / occasional
- Default due-date rules (e.g., "15th of following month" for GST)
- Default task checklist template
- Required reviewer/approver role
- Applicable department
- Default billing model

---

## Assignment & Workflow Engine

The assignment engine is the core of the system — structured work delegation across hierarchy levels.

### Assignment Levels

1. **Client → Service → Period**: e.g., ABC Pvt Ltd → GST Return → April 2026
2. **Assignment**: work package owned by a person or team
3. **Task checklist**: preparation, review, clarification, filing, approval, billing closure

### Status Model

```
Draft → Assigned → In Progress → Under Review → Completed → Closed
                 ↘ Waiting for Info ↗
                 ↘ Query Raised ↗
                       ↓
                   Reopened
                       ↓
                   Cancelled
```

Statuses: `draft` · `assigned` · `in_progress` · `waiting_for_info` · `query_raised` · `under_review` · `completed` · `closed` · `cancelled` · `reopened`

### Query & Remarks Flow

Every assignment and task supports:

- Internal note (visible to team)
- Query to assigner (escalation)
- Query to client-owner / partner
- Resolution note
- Review remark from reviewer
- Optional attachment reference

---

## Recurring Compliance Engine

Handles large volumes of periodic work automatically.

### Responsibilities

- Generate assignment instances from active client-services at period boundaries
- Attach correct time period and calculated due date
- Apply department, owner, and checklist templates
- Trigger reminders before due date (configurable: 7/3/1 days)
- Escalate overdue work to managers and partners
- Distinguish missed-cycle tasks from general delays

### Frequency Support

| Frequency | Examples |
|-----------|----------|
| Monthly | Accounting, GST returns |
| Quarterly | TDS returns, internal audit |
| Annual | Statutory audit, ITR, annual certifications |
| Occasional | Certificates, advisory, project work |
| Period-linked | Tied to specific compliance calendar |

---

## Time Tracking & Work Register

### Worklog Entry

Each time entry captures:

- User, date, client, assignment/task
- Time spent (hours:minutes)
- Type of work performed
- Summary note
- Billable / non-billable flag
- Approval status

### Entry Modes

- Manual entry (quick log)
- Start/stop timer
- Bulk daily timesheet view

### Work Done Register

Summarizes completed work with: date, category, client, responsible person, reviewer, time spent, billing status, completion notes. Exportable to Excel/PDF.

---

## Billing & Revenue Visibility

MVP tracks operational billing state (not full accounting):

- Mark assignment/service-period as billable or non-billable
- Billing statuses: `not_ready` · `ready_to_bill` · `billed` · `paid` · `waived`
- Add billing note and invoice reference number
- Filter completed-but-unbilled work
- Partner review report: work done vs. billed status

---

## Communication & Collaboration

- **Firm-wide announcements** from partners
- **Department-specific circulars**
- **Direct comments** within assignments (context-linked)
- **Mention/tagging** by @username
- **Read/unread** tracking for critical instructions
- **Reminder notices** for overdue items

Design principle: keep communication tied to work contexts — this is an operations tool, not a chat app.

---

## Dashboards

### Partner Dashboard

- Total pending work by department and office
- Overdue and due-today count
- Staff-wise workload and time logged
- High-value clients with pending items
- Completion trend (weekly/monthly)
- Completed but unbilled work
- Query backlog needing partner input

### Manager Dashboard

- Team pending tasks
- Work due in next 7 / 15 / 30 days
- Tasks with unresolved queries
- Staff productivity and turnaround
- Checklist completion rate
- Time spent vs. expected effort

### Staff Dashboard

- My assigned tasks
- Due today / overdue / upcoming
- Queries awaiting response
- Recently completed
- Time log summary (today/week)
- Recent announcements

### Admin / Operations Dashboard

- Missing client masters / unmapped services
- Unbilled completed work
- Inactive users
- Delayed recurring cycles
- Data quality exceptions

---

## Reports

All reports filterable by: office, department, user, partner, service, client, period.

| Report | Purpose |
|--------|---------|
| Person-wise task status | Pending, completed, query, overdue by employee |
| Department workload | Volume and stage of work by department |
| Client service register | All active services per client |
| Due-date compliance | On-time vs. overdue assignments |
| Work done register | Operational closure record |
| Billing status | Completed work — billed vs. unbilled |
| Time spent | By person, client, service, period |
| Performance | Employee and partner review metrics |
| Query/remark | Open and resolved issues |

### Performance Metrics

**For employees**: assigned vs. completed count, on-time rate, average delay, time logged, query resolution turnaround, review rework rate.

**For partners/managers**: team completion rate, average pending age, billing realization, bottleneck index (review backlog), client service continuity.

---

## Screen-by-Screen Product Flow

### 1. Login & Office Selection
- Secure login (username/password + optional MFA for partners)
- Office context selector for multi-office users
- Role-aware redirect to appropriate dashboard

### 2. Home Dashboard
- Role-specific summary (see Dashboards section)
- Quick actions: assign work, log time, add client, run report

### 3. Client Master
- Basic info + legal type
- PAN/GSTIN and identifiers
- Contact persons
- Group relationships
- Service subscriptions
- Relationship partner/manager
- Access flags

### 4. Service Master
- Category/subtype configuration
- Frequency and period rules
- Default checklist template
- Department mapping
- Billing defaults

### 5. Assignment List
- Central work tracking grid with filters: office, department, partner, user, client, service, period, status, overdue, billed/unbilled
- Columns: ID, client, service, period, assignee, reviewer, due date, status, query flag, time spent, billing status

### 6. Assignment Detail
- Header summary
- Checklist tasks with status
- Query/remarks thread
- Time logs
- Status history timeline
- Billing info
- Related documents/notes

### 7. Time Log
- Quick entry form
- Timer mode
- Bulk daily timesheet
- Weekly summary view

### 8. Communication Center
- Firm-wide announcements
- Department circulars
- Assignment-linked discussions
- Mandatory notices (read tracking)

### 9. Reports Center
- Saved filter presets
- Export to Excel/PDF
- AI summary button (Phase 3)

### 10. Billing & Work Register
- Ready to bill view
- Unbilled completed work
- Billed & pending payment
- Work register by period/service/user

### 11. Admin Settings
- User management
- Role configuration
- Service templates
- Due-date rule editor
- Department and office settings
- System preferences

---

## Navigation Structure

**Desktop sidebar:**

```
Dashboard · Clients · Services · Assignments · Time Logs · Communication · Reports · Billing · Admin
```

**Mobile bottom nav:**

```
Home · Tasks · Clients · Time · More
```

---

## API Structure

### Backend Modules

- Auth & RBAC
- Client & Service Management
- Assignment Engine
- Recurring Scheduler (BullMQ jobs)
- Worklog Service
- Reporting Service
- Notification Service
- Announcement Service
- Billing Tracker
- AI Insights Service (Phase 3)
- Audit & Security Service

### Key API Endpoints

```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/clients
POST   /api/clients
GET    /api/clients/:id
GET    /api/clients/:id/services
POST   /api/clients/:id/services

GET    /api/services          (master list)
POST   /api/services

GET    /api/assignments
POST   /api/assignments
GET    /api/assignments/:id
PATCH  /api/assignments/:id/status
POST   /api/assignments/:id/comments
GET    /api/assignments/:id/worklogs

POST   /api/worklogs
GET    /api/worklogs/my

GET    /api/dashboard/partner
GET    /api/dashboard/manager
GET    /api/dashboard/me

GET    /api/reports/person-wise
GET    /api/reports/department
GET    /api/reports/performance
GET    /api/reports/unbilled
GET    /api/reports/time-spent

POST   /api/announcements
GET    /api/announcements

GET    /api/notifications
```

---

## AI Strategy (Phase 3 — Self-Hosted)

### Principles

- Run LLMs **on-premise** (Mehsana server hardware) via Ollama
- AI inputs: structured fields, task titles, internal notes, aggregated metrics — **never** raw financials
- All AI outputs labeled as drafts requiring human review
- Multi-agent architecture: specialized agents for different tasks

### Runtime

| Component | Technology |
|-----------|-----------|
| Inference server | Ollama (HTTP API) |
| Models | Llama 3.x or Mistral (quantized Q4/Q5 to fit available RAM/GPU) |
| Vector store | PostgreSQL + pgvector extension (semantic search over tasks/comments) |
| Embeddings | Local embedding model via Ollama (nomic-embed-text or similar) |
| Integration | Backend calls Ollama REST API; strict JSON output schemas |
| Orchestration | Multi-agent router: classifies query → routes to specialized agent |
| Fallback | Graceful degradation if LLM is unavailable — show raw data instead |

### AI Agents (Specialized)

| Agent | Purpose | Input |
|-------|---------|-------|
| Briefing Agent | Daily/on-demand partner summary | Live dashboard aggregation queries |
| Query Agent | Natural language → database filter | User's question + schema context |
| Summary Agent | Condense long threads/worklogs | Comment text + task metadata |
| Draft Agent | Generate announcements/memos | Bullet points + tone/audience |
| Risk Agent | Predict missed due dates | Historical completion patterns + current progress |
| Priority Agent | Suggest work order per person | Due dates, complexity scores, dependencies |

### RAG Pipeline (Semantic Search)

- Index task titles, comments, and work notes as vector embeddings in pgvector
- On NL query: embed the question → find top-K relevant records → inject as context → generate answer
- Embeddings regenerated nightly (batch job) + on new content (real-time)
- Scoped by user's RBAC permissions — never surfaces data user shouldn't see

### Phase 3 AI Features

- **Daily partner briefing**: "What is pending, overdue, blocked, unbilled today?"
- **NL queries** over database: "Show me all pending GST returns for April"
- **Semantic search**: "Find tasks related to ABC company audit issues"
- **Task summarization**: condense long comment threads
- **Draft generation**: internal memos, announcements from bullet points
- **Risk alerts**: predict likely missed due dates from historical patterns
- **Smart priority queue**: suggested next 3 days of work per person

### Explicitly Out of Scope for AI

- Processing uploaded bank statements, agreements, Tally/Genius data
- Automated tax/legal advice without human sign-off
- Sending any client data to external/cloud AI services
- Training or fine-tuning on client documents

---

## Security & Deployment

### Deployment Model

```
[Office Server — Docker Compose]
├── caddy (reverse proxy, TLS 1.3, security headers)
├── app-frontend (React, static build)
├── app-backend (Fastify, Node.js)
├── postgres (data, encrypted at rest)
├── redis (sessions, jobs, token blacklist)
├── ollama (AI, Phase 3)
├── minio (file storage, AES-256 encrypted)
└── loki + grafana (log aggregation, Phase 2)
```

- Private web app behind VPN or Tailscale for remote access
- Ahmedabad office connects over secure tunnel to Mehsana server
- Automated daily backups (pg_dump + encrypted offsite copy)
- No external network dependencies — fully air-gappable

### Authentication & Token Strategy

| Mechanism | Details |
|-----------|---------|
| Login | Username + password (argon2 hashing, cost factor 12) |
| Sessions | httpOnly secure cookies + Redis-backed sessions |
| Token refresh | Sliding window; re-auth after 8 hours of inactivity |
| MFA | TOTP (Google Authenticator) for partners — optional for others |
| Token blacklist | Redis set; checked on every request; cleared on expiry |
| Brute-force protection | 5 failed attempts → 15-minute lockout; progressive backoff |
| Password policy | Min 10 chars, mixed case + number + special; no reuse of last 5 |

### Authorization Model (RBAC)

Permissions follow the pattern: `resource:action:scope`

| Scope Level | Example |
|-------------|---------|
| FIRM | Partner sees everything across both offices |
| OFFICE | Manager scoped to Mehsana only |
| DEPARTMENT | Staff sees only their department's clients |
| TEAM | Manager sees their direct reports' work |
| PERSONAL | Staff sees only their own assignments |

Enforced via middleware on every API route — no endpoint is unprotected.

### Data Protection

| Layer | Standard |
|-------|----------|
| In transit | TLS 1.3 (Caddy auto-certificates) |
| At rest (DB) | PostgreSQL TDE or disk-level LUKS encryption |
| At rest (files) | AES-256-GCM via MinIO server-side encryption |
| Sensitive fields | PAN, GSTIN encrypted in DB columns (application-level encryption) |
| Backups | GPG-encrypted before offsite transfer |

### API Security

- **Security headers**: CSP, HSTS, X-Frame-Options, X-Content-Type-Options via Caddy
- **Rate limiting**: 1000 req/hour per user; 5 login attempts per 15 min
- **CORS**: Strict origin whitelist (only office IPs + VPN range)
- **Input validation**: Dedicated validators for PAN (AAAAA0000A), GSTIN (22AAAAA0000A1Z5), email, phone
- **SQL injection prevention**: Prisma parameterized queries only; no raw SQL without explicit review
- **XSS prevention**: React's built-in escaping + CSP headers + sanitization on text inputs

### Audit & Logging

- **Immutable audit trail**: Append-only `AuditLog` table; no UPDATE/DELETE allowed
- **What's logged**: Every assignment status change, data access, login/logout, admin action, failed auth attempt
- **Structured logs**: JSON format via pino (Fastify's logger); correlation IDs per request
- **Log management**: Loki for aggregation + Grafana for dashboards (Phase 2); file rotation in Phase 1
- **No sensitive data in logs**: PAN/GSTIN/passwords never logged; masked in error messages
- **Retention**: 1 year for audit logs; 90 days for application logs

### Security Testing (CI Pipeline)

| Check | Tool | When |
|-------|------|------|
| Dependency vulnerabilities | `npm audit` + Snyk | Every PR |
| Code quality | ESLint security plugin + TypeScript strict mode | Every PR |
| OWASP Top 10 | Manual review checklist per sprint | Sprint end |
| Penetration testing | OWASP ZAP (automated baseline scan) | Before each release |
| Load testing | k6 (target: 50 concurrent users for MVP) | Before release |

### OWASP Top 10 Coverage

| # | Threat | Mitigation |
|---|--------|-----------|
| 1 | Broken Access Control | RBAC middleware + scope filtering on every route |
| 2 | Cryptographic Failures | AES-256, TLS 1.3, argon2, no plaintext secrets |
| 3 | Injection | Prisma ORM (parameterized); input validation |
| 4 | Insecure Design | Modular architecture; threat modeling per module |
| 5 | Security Misconfiguration | Environment variables via Docker secrets; no defaults |
| 6 | Vulnerable Components | npm audit in CI; Snyk monitoring |
| 7 | Auth Failures | Session management; token blacklist; MFA |
| 8 | Data Integrity | Audit logs; status history; checksums on exports |
| 9 | Logging Failures | Structured logging; alert on auth anomalies |
| 10 | SSRF | No user-controlled URLs; outbound network blocked in production |

---

## Delivery Roadmap

### Phase 1 — Core Operations MVP (10–12 weeks)

| Week | Deliverable |
|------|-------------|
| 1–2 | Project setup, DB schema, auth system, user/role/office management |
| 3–4 | Client master + client groups + identifiers |
| 4–5 | Service master + client-service subscriptions + period logic |
| 5–7 | Assignment engine + status workflow + task checklists + comments |
| 7–8 | Recurring task generation engine (BullMQ scheduler) |
| 8–9 | Time tracking (manual + timer) + work register |
| 9–10 | Dashboards (partner, manager, staff) |
| 10–11 | Reports (person-wise, department, billing status, performance) |
| 11–12 | Notifications + announcements + billing status tracker |

### Phase 2 — Refinement & Mobility (4–6 weeks)

- PWA optimization (offline support, install prompt)
- Advanced filters and saved views
- Enhanced query workflow
- Office-wise analytics
- Export improvements (Excel/PDF formatting)
- Email/SMS reminders (if policy permits)
- Partner scorecards

### Phase 3 — AI Layer (4–6 weeks)

- Deploy Ollama on office hardware
- NL query interface over operational data
- Partner daily briefing
- Task/thread summarization
- Draft generation for announcements
- Risk/delay prediction

### Phase 4 — Integrations & Extensions (ongoing)

- Tally/Genius/GST software links (reference IDs, minimal exports)
- Payment links for professional fees (Razorpay/UPI)
- HR/payroll lite (attendance, leave)
- Advanced partner analytics

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Confidential data leakage via AI | Local-only models; block uploads to cloud LLMs; AI processes only metadata |
| Wrong deadlines / regulatory advice | AI outputs labeled "draft"; calendars human-verified; retain accountability |
| Server downtime affecting all users | Docker health checks; automated restart; daily backup verification |
| Remote access security | VPN/Tailscale; session management; MFA for partners |
| Scope creep delaying MVP | Strict Phase 1 boundary; defer HR/payroll/integrations |
| Hardware limitations for AI | Use quantized models (Q4_K_M); test on actual server before Phase 3 |

---

## Immediate Next Steps

1. ~~Confirm plan~~ → **This document**
2. Initialize project repository with monorepo structure
3. Set up Docker Compose for local development (Postgres + Redis)
4. Implement database schema with Prisma migrations
5. Build auth system (login, sessions, RBAC middleware)
6. Begin Client Master module (first end-to-end feature)

---

## Document History

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | 2026-05-09 | Initial plan from firm requirements xlsx |
| 2.0 | 2026-05-09 | Comprehensive rewrite with detailed specs, defined tech stack, data model, screens, API structure, and phased roadmap |
| 2.1 | 2026-05-09 | Enhanced security (OWASP, auth tokens, encryption, audit), AI strategy (pgvector, multi-agent, RAG), logging (Loki/Grafana), validation (Zod), load testing (k6) |
