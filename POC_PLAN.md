# POC Plan — CA Practice Management Platform

**Purpose**: Demonstrate the platform's core value to Chauhan & Jain partners in a working prototype, enabling them to experience the system before committing to a full build.

**Duration**: 2–3 weeks  
**Outcome**: Live demo-ready application with real firm data (sample set) that partners can interact with on their phones and laptops.

---

## POC Objectives

| # | Objective | Why It Matters |
|---|-----------|---------------|
| 1 | Show task assignment and tracking working end-to-end | This is the firm's #1 stated need |
| 2 | Demonstrate role-based views (partner vs staff) | Proves the system understands hierarchy |
| 3 | Show client-service-period structure | Validates the data model against their reality |
| 4 | Demonstrate mobile accessibility | They explicitly want "on the go" access |
| 5 | Show a partner dashboard with real-looking metrics | Creates the "wow" moment |
| 6 | Prove local AI can generate useful summaries | Differentiator; shows future value |

---

## What the POC IS

- A working web app (not mockups or slides)
- Seeded with realistic sample data matching their firm structure
- Accessible on phone browsers (responsive)
- Demonstrates the core workflow: assign → track → complete → report
- Shows an AI-powered summary (even if simplified)
- Deployed locally or on a temporary server for the demo

## What the POC is NOT

- Production-ready (no hardened security, backups, etc.)
- Feature-complete (no recurring engine, billing, full reports)
- Using real confidential client data (sample/anonymized only)
- A throwaway — code structure should be reusable for MVP

---

## POC Scope — Features Included

### 1. Authentication & Roles (Simplified)

- Login with username/password (no MFA yet)
- 3 roles: Partner, Manager, Staff
- Pre-seeded users matching firm structure (3 partners, 2–3 managers, 5–6 staff)

### 2. Client Master (Read + Basic Create)

- Pre-seeded 20–30 clients matching firm's client types
- View client list with search
- View client detail (name, legal type, PAN, GSTIN, services)
- Create a new client (demonstrate the form)

### 3. Service Subscriptions (Pre-configured)

- 8–10 service types pre-loaded (Audit, ITR, GST Return, TDS, Accounting, Certification, etc.)
- Clients pre-linked to services with periods
- View which services a client is subscribed to

### 4. Assignment Workflow (Core Demo)

- Create assignment: pick client → service → period → assignee
- Assignment list with filters (status, assignee, client, overdue)
- Change status: Assigned → In Progress → Under Review → Completed
- Add comments/remarks on assignments
- Partner assigns to manager; manager assigns to junior
- View status history

### 5. Time Logging (Basic)

- Log time against an assignment (manual entry)
- View time logged per assignment
- Simple daily summary

### 6. Partner Dashboard

- Pending work count by department
- Overdue items (highlighted red)
- Staff workload (tasks per person)
- Recently completed items
- Quick stats: total active assignments, completed this week, overdue count

### 7. Staff Dashboard

- My tasks (grouped: due today, overdue, upcoming, completed)
- Simple time log summary

### 8. AI Demo (Lightweight)

- "Ask AI" button on partner dashboard
- Pre-configured prompts: "What's pending today?", "Who has the most overdue work?", "Summarize this week"
- AI generates a natural-language briefing from live database data
- Runs on Ollama locally OR uses a small pre-built summary engine as fallback

### 9. Mobile Experience

- Fully responsive — demo on phone during presentation
- Key flows: view my tasks, update status, log time — all work on mobile

---

## POC Scope — Features EXCLUDED

| Feature | Reason |
|---------|--------|
| Recurring task engine | Complex; not needed to prove value |
| Billing/invoicing | Secondary concern for POC |
| Announcements/communication | Can describe verbally |
| Full report suite | Dashboard metrics are sufficient |
| Excel/PDF export | Not needed for demo |
| File attachments | Adds complexity without demo value |
| Admin settings UI | Pre-seed everything |
| MFA / advanced security | Not relevant for POC |
| Real client data | Use anonymized/sample data |

---

## Sample Data Plan

Pre-seed the database with realistic (but fictional) data:

| Entity | Count | Notes |
|--------|-------|-------|
| Users | 12 | 3 partners, 3 managers, 4 juniors, 2 trainees |
| Clients | 25 | Mix of Pvt Ltd, LLP, Partnership, Individual, Trust |
| Client Groups | 5 | Show related entities concept |
| Services | 10 | Audit, ITR, GST, TDS, Accounting, Certification, etc. |
| Client-Services | 60 | Average 2–3 services per client |
| Assignments | 100 | Mix of statuses; some overdue, some completed |
| Comments | 50 | Queries, remarks, resolutions |
| Time entries | 80 | Distributed across staff |

Data should feel real: use Gujarat-style company names, realistic PAN/GSTIN formats, appropriate service-period combinations.

---

## Demo Script (Presentation Flow)

**Duration**: 20–30 minutes

### Act 1: The Problem (2 min)
- "Today you track work in spreadsheets, WhatsApp, and memory. Let's see something better."

### Act 2: Partner View (8 min)
1. Login as Partner (CJ) → see partner dashboard
2. Point out: pending by department, overdue highlighted, staff workload
3. Click into an overdue item → see who's assigned, what's the query
4. Assign a new piece of work: pick client → service → period → assign to manager
5. Show AI briefing: "What needs my attention today?" → AI responds with summary

### Act 3: Manager View (5 min)
1. Switch to Manager login → different dashboard
2. See team's pending work
3. Reassign a task from one junior to another
4. Add a review remark on a completed task

### Act 4: Staff View (5 min)
1. Switch to Staff login → "My Tasks" view
2. Update a task status: In Progress → mark checklist item → Under Review
3. Log 2 hours against the task
4. Raise a query on another task
5. **Do this on a phone** to show mobile access

### Act 5: Back to Partner (3 min)
1. Show that the status update and query are now visible
2. Dashboard numbers updated
3. "This is real-time visibility across your firm"

### Act 6: Future Vision (2 min)
- Briefly mention: recurring auto-generation, full reports, billing tracking, Tally links
- "This is week 2. Imagine week 12."

---

## Technology (Same as Full MVP — No Throwaway Code)

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript + Tailwind + shadcn/ui |
| Backend | Fastify + TypeScript + Prisma |
| Database | PostgreSQL (Docker) |
| AI | Ollama with Llama 3 8B (or fallback: pre-built summary logic) |
| Deployment | Docker Compose; demo from laptop or temporary cloud VM |

**Key principle**: POC code becomes the foundation for MVP. Same repo, same architecture, same patterns. POC is Sprint 0.5 of the real build.

---

## Success Criteria

The POC is successful if:

- [ ] Partners can see their firm's workflow reflected in the system
- [ ] The assignment flow feels natural (create → assign → track → complete)
- [ ] Mobile access works and impresses ("I can check this from anywhere")
- [ ] Dashboard gives instant visibility they don't have today
- [ ] AI summary demonstrates intelligence beyond basic CRUD
- [ ] Partners say "yes, build this" or provide actionable feedback for iteration

---

## Risks for POC

| Risk | Mitigation |
|------|-----------|
| AI feels slow on laptop | Pre-compute some summaries; use smaller model (Phi-3 or Qwen 2.5 3B) |
| Demo environment fails | Run everything locally in Docker; test 2 days before demo |
| Partners want features not in POC | Prepare "Phase 2/3" slide; acknowledge and note feedback |
| Sample data feels fake | Use realistic Gujarat company names, proper PAN formats, real service types |
| Mobile doesn't work well | Test on actual devices (Android + iPhone); fix responsive issues before demo |

---

---

# POC Implementation Plan

## Timeline: 2.5 Weeks (12 Working Days)

---

### Day 1–2: Project Setup & Foundation

| Task | Details | Hours |
|------|---------|-------|
| Monorepo init | Create `apps/api`, `apps/web`, `packages/shared`; configure TypeScript, ESLint | 3 |
| Docker Compose | PostgreSQL + Redis containers; dev scripts in package.json | 2 |
| Prisma schema (POC subset) | User, Role, Office, Department, Client, ClientIdentifier, ServiceMaster, ClientService, Assignment, Task, TaskComment, Worklog | 4 |
| Run migrations | Generate and apply; verify tables | 1 |
| Fastify bootstrap | Server setup, CORS, error handling, route registration | 2 |
| React bootstrap | Vite + React + Tailwind + shadcn/ui; routing setup (react-router) | 2 |
| Auth basics | Login endpoint + session; login page + protected routes | 3 |

**End of Day 2**: Dev environment running; can login; empty shell with navigation.

---

### Day 3–4: Client Master & Services

| Task | Details | Hours |
|------|---------|-------|
| Client CRUD API | List (with search), get by ID, create | 3 |
| Client list UI | Table with search bar; columns: name, type, PAN, GSTIN | 3 |
| Client detail UI | Info card + services tab (read-only for now) | 3 |
| Client create form | Name, legal type, PAN, GSTIN, office | 2 |
| Service master API | List all services (read-only, pre-seeded) | 1 |
| Client-Service display | Show subscribed services on client detail | 2 |
| Seed script v1 | 25 clients, 10 services, 60 client-service links | 3 |

**End of Day 4**: Can browse clients, see their services, create new clients.

---

### Day 5–7: Assignment Engine (Core)

| Task | Details | Hours |
|------|---------|-------|
| Assignment CRUD API | Create, list (with filters), get detail, update status | 5 |
| Status transitions | Validate allowed transitions; record status history | 3 |
| Task checklist API | CRUD for checklist items under assignment; toggle complete | 2 |
| Comments API | Add comment (note/query/resolution); list by assignment | 2 |
| Assignment list UI | Data table with filters: status, assignee, client, overdue badge | 5 |
| Assignment detail UI | Header, checklist, comment thread, status controls | 5 |
| Assignment create flow | Step form: client → service → period → assignee → create | 3 |
| Status update UI | Dropdown/buttons for valid transitions; confirmation | 2 |
| Comment UI | Thread display; add form with type selector | 2 |
| Seed script v2 | 100 assignments in various statuses; 50 comments | 2 |

**End of Day 7**: Full assignment workflow working — create, assign, update status, add comments, view history.

---

### Day 8–9: Time Tracking & Dashboards

| Task | Details | Hours |
|------|---------|-------|
| Worklog API | Create entry, list by assignment, list by user/date, daily summary | 3 |
| Time entry UI | Quick form: select assignment, enter hours, note | 2 |
| Assignment detail: time tab | Show logged time; total | 2 |
| Partner dashboard API | Aggregate queries: pending by dept, overdue count, staff workload, completed this week | 4 |
| Staff dashboard API | My tasks grouped by status; time summary | 2 |
| Partner dashboard UI | Metric cards, department breakdown chart, staff workload bars, overdue list | 5 |
| Staff dashboard UI | Task cards (due today / overdue / upcoming / completed); time today | 4 |

**End of Day 9**: Dashboards showing real aggregated data; time logging works.

---

### Day 10: AI Integration

| Task | Details | Hours |
|------|---------|-------|
| Ollama setup | Add to Docker Compose; pull Llama 3 8B Q4 (or Qwen 2.5 3B as fallback) | 2 |
| AI service | Backend module: send prompt to Ollama; parse response; timeout handling | 3 |
| Briefing prompt | Template: inject live stats (pending, overdue, top issues) → ask LLM for natural language summary | 2 |
| AI UI | "Ask AI" panel on partner dashboard; pre-built question buttons + free text | 3 |
| Fallback | If Ollama unavailable, show pre-formatted stats summary (no AI text) | 1 |

**End of Day 10**: Partner can click "What needs attention?" and get an AI-generated briefing from live data.

---

### Day 11: Mobile Polish & UX

| Task | Details | Hours |
|------|---------|-------|
| Responsive audit | Test every screen at 375px; fix layout breaks | 4 |
| Mobile navigation | Bottom nav bar on mobile; hamburger menu | 2 |
| Touch improvements | Larger buttons, card-based task list on mobile, swipe hints | 2 |
| Loading states | Skeleton loaders, optimistic UI for status changes | 2 |
| Error handling | Toast notifications for errors; form validation messages | 2 |

**End of Day 11**: App works beautifully on phone browsers.

---

### Day 12: Demo Prep & Final Polish

| Task | Details | Hours |
|------|---------|-------|
| Final seed data | Ensure data tells a compelling story (overdue items, queries, mixed statuses) | 2 |
| Demo user accounts | Partner (CJ), Manager (Priya), Staff (Rahul) with known passwords | 1 |
| Visual polish | Consistent spacing, color-coded statuses, firm name in header | 2 |
| Deploy for demo | Docker Compose build; test on clean machine or cloud VM | 2 |
| Demo rehearsal | Run through the full demo script; time it; fix any issues | 2 |
| Backup plan | Recorded video fallback if live demo has issues | 1 |

**End of Day 12**: Ready to present.

---

## POC File Structure

```
ca-practice-platform/
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── clients/
│   │   │   │   ├── services/
│   │   │   │   ├── assignments/
│   │   │   │   ├── worklogs/
│   │   │   │   ├── dashboard/
│   │   │   │   └── ai/
│   │   │   ├── middleware/
│   │   │   ├── lib/
│   │   │   └── server.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   └── package.json
│   └── web/
│       ├── src/
│       │   ├── components/
│       │   │   ├── ui/          (shadcn components)
│       │   │   ├── layout/
│       │   │   └── shared/
│       │   ├── pages/
│       │   │   ├── login/
│       │   │   ├── dashboard/
│       │   │   ├── clients/
│       │   │   ├── assignments/
│       │   │   └── time/
│       │   ├── hooks/
│       │   ├── lib/
│       │   └── App.tsx
│       └── package.json
├── packages/
│   └── shared/
│       ├── src/
│       │   ├── types/
│       │   └── constants/
│       └── package.json
├── docker-compose.yml
├── package.json            (workspace root)
├── PLAN.md
├── IMPLEMENTATION_PLAN.md
└── POC_PLAN.md
```

---

## POC → MVP Transition

After successful demo and client approval:

| POC Component | MVP Action |
|---------------|-----------|
| Auth module | Add MFA, session hardening, proper password policies |
| Client master | Add groups UI, bulk operations, pagination |
| Assignment engine | Add recurring generation, bulk creation, full filter set |
| Time tracking | Add timer, daily timesheet, approval workflow |
| Dashboard | Add manager view, admin view, caching layer |
| AI service | Add more prompt types, safety validation, rate limiting |
| Database schema | Add remaining entities (WorkRegister, BillingRecord, Announcement, Notification, AuditLog) |
| Tests | Add unit tests, integration tests, E2E tests |
| Security | Add rate limiting, CSRF, input sanitization, audit logging |
| Deployment | Production Docker config, backups, monitoring |

The POC is **Sprint 0** — all code carries forward. No rewrite needed.

---

## Effort Summary

| Phase | Days | Effort |
|-------|------|--------|
| Setup & Foundation | 2 | 17 hours |
| Client & Services | 2 | 17 hours |
| Assignment Engine | 3 | 31 hours |
| Time & Dashboards | 2 | 22 hours |
| AI Integration | 1 | 11 hours |
| Mobile & UX | 1 | 12 hours |
| Demo Prep | 1 | 10 hours |
| **Total** | **12 days** | **~120 hours** |

---

## Deliverables to Client

1. **Live demo** (20–30 min interactive session)
2. **Access link** — partners can play with the system after demo (temporary deployment)
3. **One-page summary** — what they saw, what's coming next, timeline to MVP
4. **Feedback form** — structured questions to capture their priorities for MVP

---

## Document History

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | 2026-05-09 | POC plan and implementation schedule |
