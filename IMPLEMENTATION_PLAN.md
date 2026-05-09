# Implementation Plan — CA Practice Management Platform

Detailed phase-wise breakdown of all development work, with tasks, deliverables, dependencies, and acceptance criteria for each sprint.

**Tech stack**: React + TypeScript · Fastify + TypeScript · Prisma · PostgreSQL · Redis + BullMQ · Docker Compose · Ollama (Phase 3)

---

## Phase 1 — Core Operations MVP

**Duration**: 10–12 weeks  
**Goal**: Deliver the operational backbone — partners and staff can assign work, track progress, log time, manage clients/services, and view reports.

---

### Sprint 1 (Week 1–2): Foundation & Auth

#### Backend

| Task | Details |
|------|---------|
| Initialize monorepo | `apps/api` (Fastify), `apps/web` (React), `packages/shared` (types/constants) |
| Docker Compose | PostgreSQL 16, Redis 7, Fastify dev server, React dev server |
| Prisma schema v1 | `User`, `Role`, `Office`, `Department`, `Session` tables |
| Auth module | Login endpoint, password hashing (argon2), session creation in Redis |
| RBAC middleware | Role + permission check on every route; office/department scoping |
| User CRUD | Create, update, deactivate users; assign roles and offices |
| Seed script | Create default offices (Mehsana, Ahmedabad), departments, admin user, sample roles |

#### Frontend

| Task | Details |
|------|---------|
| React + Vite setup | TypeScript, Tailwind CSS, shadcn/ui component library |
| Auth pages | Login form, session management, protected route wrapper |
| Layout shell | Sidebar navigation, top bar with user info, responsive breakpoints |
| Admin: Users | User list table, create/edit form, role assignment |
| Admin: Offices & Depts | CRUD screens for offices and departments |

#### DevOps

| Task | Details |
|------|---------|
| ESLint + Prettier | Shared config across monorepo |
| Git hooks | Pre-commit lint + type-check (husky + lint-staged) |
| Environment config | `.env.example`, docker-compose.yml, README with setup instructions |

#### Acceptance Criteria

- [ ] `docker compose up` starts full dev environment
- [ ] Admin can login and manage users, roles, offices, departments
- [ ] Non-admin cannot access admin routes
- [ ] Sessions expire after configured timeout
- [ ] API returns 401/403 appropriately based on auth state

---

### Sprint 2 (Week 3–4): Client Master

#### Backend

| Task | Details |
|------|---------|
| Prisma schema | `Client`, `ClientGroup`, `ClientIdentifier`, `ContactPerson` tables |
| Client CRUD API | Create, update, list, get, soft-delete clients |
| Client Group API | Create groups, link/unlink clients to groups |
| Identifiers API | Add PAN/GSTIN per client; uniqueness validation |
| Contact Persons API | Multiple contacts per client with designation, phone, email |
| Search & filters | Full-text search on client name; filter by office, group, legal type |
| Pagination | Cursor-based pagination on list endpoints |

#### Frontend

| Task | Details |
|------|---------|
| Client list page | Searchable table with filters (office, legal type, group) |
| Client detail page | Tabbed view: info, identifiers, contacts, groups, services (empty for now) |
| Client create/edit form | Multi-step or single-page form; legal type dropdown, office selector |
| Client group page | List groups, view members, create/link |
| Bulk actions | Select multiple clients for group assignment |

#### Acceptance Criteria

- [ ] Create client with PAN, GSTIN, contacts, group linkage
- [ ] Search clients by name, PAN, or GSTIN
- [ ] Filter by office, legal type, and group
- [ ] Group view shows all related entities
- [ ] Pagination works with 100+ clients (seed test data)

---

### Sprint 3 (Week 4–5): Service Master & Client-Service Mapping

#### Backend

| Task | Details |
|------|---------|
| Prisma schema | `ServiceMaster`, `ClientService`, `ServicePeriod` tables |
| Service Master API | CRUD for service templates (category, frequency, due-date rules, checklist template, department) |
| Client-Service API | Subscribe a client to a service; set period, frequency override, assignees |
| Period generation | Given a client-service and frequency, generate `ServicePeriod` records for the current FY |
| Due-date calculation | Configurable rules: "15th of next month", "30th September", "31st July" etc. |

#### Frontend

| Task | Details |
|------|---------|
| Service master list | Table with category, frequency, department columns |
| Service master form | Create/edit with checklist template builder (ordered items) |
| Client → Services tab | Show subscribed services; add/remove service subscription |
| Service period view | Calendar or list of generated periods with status indicators |

#### Acceptance Criteria

- [ ] Create service templates with all configurable fields
- [ ] Subscribe a client to multiple services
- [ ] Periods auto-generate based on frequency and FY
- [ ] Due dates calculated correctly for monthly/quarterly/annual
- [ ] Checklist template attached to service and carried to assignments

---

### Sprint 4 (Week 5–7): Assignment Engine & Workflow

#### Backend

| Task | Details |
|------|---------|
| Prisma schema | `Assignment`, `Task` (checklist items), `TaskComment`, `StatusHistory` tables |
| Assignment CRUD | Create assignment from client-service-period; assign to user; set reviewer |
| Status machine | Enforce valid transitions (draft→assigned→in_progress→…); record history |
| Task checklist | CRUD for tasks under an assignment; individual task status |
| Comments/Remarks | Add comment with type (note, query, resolution, review_remark); mention users |
| Assignment filters | By status, assignee, reviewer, client, service, department, office, due date range, overdue flag |
| Bulk assignment | Create assignments for multiple client-service-periods at once |
| Auto-assign rules | Optional: default assignee from client-service config |

#### Frontend

| Task | Details |
|------|---------|
| Assignment list | Data table with all filter options; sortable columns; overdue highlighting |
| Assignment detail | Header info, checklist with checkboxes, comment thread, status change dropdown |
| Assignment create | Select client → service → period → assignee → reviewer; or bulk create |
| Status workflow UI | Status badge; transition buttons based on current status and user role |
| Comment thread | Chronological list with type badges; add comment form with type selector |
| Status timeline | Visual history of all status changes with timestamps and actors |

#### Acceptance Criteria

- [ ] Partner can create and assign work to any user
- [ ] Manager can assign to juniors/trainees in their team
- [ ] Status transitions enforce valid paths
- [ ] Invalid transitions return clear error
- [ ] Comments support queries, notes, resolutions, review remarks
- [ ] Assignment list loads with 500+ records efficiently
- [ ] Bulk creation works for recurring period assignments

---

### Sprint 5 (Week 7–8): Recurring Task Engine

#### Backend

| Task | Details |
|------|---------|
| BullMQ scheduler | Cron job: daily check for upcoming periods needing assignment creation |
| Auto-generation logic | For each active client-service, generate next period's assignment if not exists |
| Template application | Copy checklist from service template; apply default assignee/reviewer |
| Reminder jobs | Queue reminders at configurable intervals before due date (7, 3, 1 day) |
| Escalation jobs | If assignment is overdue, notify manager/partner; mark as escalated |
| Missed cycle detection | If a period passes without assignment creation, flag it separately |

#### Frontend

| Task | Details |
|------|---------|
| Scheduler dashboard | Admin view: next scheduled runs, recent generation log, errors |
| Recurring config UI | Per client-service: enable/disable auto-generation, override assignee |
| Upcoming work view | "Next 30 days" preview of auto-generated assignments |

#### Acceptance Criteria

- [ ] Monthly services auto-generate assignments on schedule
- [ ] Quarterly and annual services generate at correct boundaries
- [ ] Reminders fire at 7/3/1 days before due date
- [ ] Overdue items escalate to appropriate manager/partner
- [ ] Missed cycles are clearly flagged (not mixed with delays)
- [ ] Admin can pause/resume auto-generation per client-service

---

### Sprint 6 (Week 8–9): Time Tracking & Work Register

#### Backend

| Task | Details |
|------|---------|
| Prisma schema | `Worklog`, `WorkRegister` tables |
| Worklog CRUD | Create time entry linked to assignment/task; manual or timer-based |
| Timer support | Start/stop endpoints; calculate duration server-side |
| Daily timesheet API | Get/create entries for a specific date; bulk save |
| Work register | Auto-populate on assignment completion; summary record with all metadata |
| Approval workflow | Optional: manager approves time entries before they count in reports |
| Aggregation queries | Total time by user/client/service/period; billable vs non-billable split |

#### Frontend

| Task | Details |
|------|---------|
| Quick time entry | Floating action button → select assignment → enter time + note |
| Timer widget | Start/stop timer with active assignment indicator in header |
| Daily timesheet | Table: rows = assignments, columns = time + note; bulk edit for a day |
| Weekly summary | Visual bar chart of hours per day; total hours |
| Work register list | Completed work records with all metadata; filterable |
| Assignment detail: time tab | Show all worklogs for that assignment; total time |

#### Acceptance Criteria

- [ ] Log time manually against any assigned task
- [ ] Timer start/stop calculates correct duration
- [ ] Daily timesheet shows all entries for a date; editable
- [ ] Work register auto-populates when assignment marked complete
- [ ] Time aggregation correct across filters
- [ ] Billable/non-billable flag works on each entry

---

### Sprint 7 (Week 9–10): Dashboards

#### Backend

| Task | Details |
|------|---------|
| Partner dashboard API | Aggregated: pending by dept/office, overdue count, unbilled, staff workload, query backlog |
| Manager dashboard API | Team pending, due soon (7/15/30), unresolved queries, staff productivity |
| Staff dashboard API | My tasks (grouped by status), due today, overdue, recent completions, time summary |
| Admin dashboard API | Missing masters, unmapped services, unbilled work, delayed cycles |
| Caching strategy | Redis cache for expensive aggregations; invalidate on status changes |

#### Frontend

| Task | Details |
|------|---------|
| Dashboard layout | Role-aware: show appropriate dashboard based on logged-in user's role |
| Partner dashboard | Metric cards + charts (overdue trend, dept breakdown, workload heatmap) |
| Manager dashboard | Team workload table, due-date timeline, query list |
| Staff dashboard | Task cards grouped by status, time logged today/week, announcements feed |
| Admin dashboard | Alert cards for data quality issues and operational gaps |
| Quick actions | Contextual buttons: assign work, log time, view client, run report |

#### Acceptance Criteria

- [ ] Each role sees only their relevant dashboard
- [ ] Numbers match actual database state (verified with test data)
- [ ] Dashboard loads in <2 seconds with production-scale data
- [ ] Cached aggregations update within 30 seconds of status changes
- [ ] Quick actions navigate to correct screens with context

---

### Sprint 8 (Week 10–11): Reports

#### Backend

| Task | Details |
|------|---------|
| Report engine | Parameterized queries with filters (office, dept, user, client, service, period, date range) |
| Person-wise report | Tasks by status per employee; overdue count; time logged |
| Department workload | Volume and stage distribution by department |
| Billing status report | Completed work — billed vs unbilled; amount if tracked |
| Time spent report | By person, client, service, period; billable breakdown |
| Performance report | On-time rate, avg delay, utilization, query turnaround |
| Export engine | Generate Excel (xlsx via exceljs) and PDF (via puppeteer or pdfkit) |

#### Frontend

| Task | Details |
|------|---------|
| Reports center | List of available reports; recent runs; saved filter presets |
| Report viewer | Tabular display with column sorting; summary row |
| Filter panel | Reusable filter component: office, dept, user, client, service, date range |
| Export buttons | Download as Excel or PDF |
| Saved presets | Save and load filter combinations |

#### Acceptance Criteria

- [ ] All 6 core reports generate correctly with test data
- [ ] Filters apply independently and in combination
- [ ] Excel export contains all visible data with formatting
- [ ] PDF export is print-ready with header/footer
- [ ] Saved presets persist across sessions
- [ ] Reports run in <5 seconds for 1 year of data

---

### Sprint 9 (Week 11–12): Notifications, Announcements & Billing

#### Backend

| Task | Details |
|------|---------|
| Notification system | In-app notifications (stored in DB); triggered by status changes, assignments, reminders, escalations |
| Real-time delivery | WebSocket (via fastify-websocket) or SSE for live notification push |
| Announcement CRUD | Create announcement with scope (firm-wide, department, specific users) |
| Read tracking | Track who has read mandatory announcements |
| Billing tracker | Mark assignments billable/non-billable; set billing status; add invoice ref |
| Billing filters | Ready to bill, unbilled completed, billed pending payment |

#### Frontend

| Task | Details |
|------|---------|
| Notification bell | Header icon with unread count; dropdown with recent notifications |
| Notification center | Full list with filters (unread, type, date) |
| Announcements page | Create/view announcements; department selector; mandatory flag |
| Read receipts | Show who has/hasn't read a mandatory announcement |
| Billing screen | Table of assignments with billing status; bulk status update |
| Billing filters | Quick tabs: ready to bill, unbilled, billed, paid |

#### Acceptance Criteria

- [ ] Notifications appear in real-time when assignments change
- [ ] Announcements visible to correct audience (firm-wide vs department)
- [ ] Read tracking shows completion percentage for mandatory notices
- [ ] Billing status changes reflect in dashboards and reports
- [ ] Filter by billing status works on assignment list and dedicated billing screen
- [ ] WebSocket/SSE reconnects gracefully on network interruption

---

### Phase 1 Completion Checklist

- [ ] All 11 screens functional and tested
- [ ] Role-based access enforced end-to-end
- [ ] 50+ test clients, services, and assignments seeded for demo
- [ ] Docker Compose production build working
- [ ] Deployment guide written
- [ ] Partner, manager, and staff walkthroughs recorded or documented
- [ ] Performance: page loads <2s, API responses <500ms at expected scale
- [ ] Backup and restore procedure tested

---

## Phase 2 — Refinement & Mobility

**Duration**: 4–6 weeks  
**Goal**: Polish UX, enable true mobile usage, and add operational improvements based on Phase 1 feedback.

---

### Sprint 10 (Week 13–14): PWA & Mobile Optimization

| Task | Details |
|------|---------|
| Service worker | Offline caching for app shell; background sync for time entries |
| Install prompt | PWA manifest with icons; "Add to Home Screen" flow |
| Mobile layouts | Responsive redesign of all screens for 375px–428px widths |
| Touch optimizations | Larger tap targets, swipe actions on task cards, bottom sheet modals |
| Push notifications | Web Push API for due-date reminders and assignment notifications |
| Performance audit | Lighthouse score >90; lazy loading for routes; image optimization |

#### Acceptance Criteria

- [ ] App installable on Android/iOS home screen
- [ ] Core features usable offline (view tasks, draft time entries)
- [ ] Time entries sync when connection restores
- [ ] Push notifications work on mobile browsers
- [ ] Lighthouse performance >90, accessibility >85

---

### Sprint 11 (Week 15–16): Advanced Filters, Views & Query Workflow

| Task | Details |
|------|---------|
| Saved views | Users can save filter combinations as named views; pin to sidebar |
| Custom columns | Choose visible columns on assignment list; persist preference |
| Kanban view | Optional board view for assignments (columns = statuses) |
| Query workflow v2 | Dedicated "My Queries" inbox; reply thread; resolution marking; SLA timer |
| Bulk operations | Multi-select assignments → change status, reassign, update billing |
| Search improvements | Global search across clients, assignments, comments; keyboard shortcut |

#### Acceptance Criteria

- [ ] Saved views appear in sidebar for quick access
- [ ] Kanban drag-and-drop updates assignment status
- [ ] Query inbox shows all open queries for a user with age indicators
- [ ] Bulk operations handle 50+ items without timeout
- [ ] Global search returns relevant results in <1 second

---

### Sprint 12 (Week 17–18): Analytics, Exports & Partner Scorecards

| Task | Details |
|------|---------|
| Office-wise analytics | Compare Mehsana vs Ahmedabad on all metrics |
| Trend charts | Weekly/monthly completion trend, overdue trend, time logged trend |
| Partner scorecards | Per-partner: portfolio health, team performance, billing realization |
| Export formatting | Branded Excel templates; PDF with firm letterhead |
| Scheduled reports | Configure recurring report generation (weekly email to partners) |
| Email/SMS integration | Nodemailer for email; SMS gateway hook (MSG91/Twilio) for reminders |

#### Acceptance Criteria

- [ ] Office comparison dashboard with visual charts
- [ ] Partner scorecards generate on demand and weekly
- [ ] Exports use firm branding (logo, header)
- [ ] Email delivery works for scheduled reports
- [ ] SMS reminders fire for high-priority overdue items (if configured)

---

## Phase 3 — AI Layer

**Duration**: 4–6 weeks  
**Goal**: Add intelligent assistance on top of the operational data using locally-hosted open-source models.

**Prerequisite**: Office server hardware capable of running quantized 7B–13B models (minimum 16GB RAM, ideally GPU with 8GB+ VRAM).

---

### Sprint 13 (Week 19–20): AI Infrastructure & NL Queries

| Task | Details |
|------|---------|
| Ollama deployment | Install Ollama in Docker Compose; configure model pull (Llama 3 8B Q4) |
| AI service module | Backend service wrapping Ollama API; retry, timeout, fallback handling |
| Prompt templates | Structured prompts for each AI feature; version-controlled |
| NL → SQL/filter | User types natural language → AI converts to structured DB query → execute → return results |
| Safety layer | Validate generated queries; enforce role-based data scoping; block dangerous operations |
| AI query UI | Chat-style input on dashboard; results displayed as filtered assignment/report views |

#### Acceptance Criteria

- [ ] Ollama runs reliably in Docker with auto-restart
- [ ] "Show all overdue GST returns" correctly translates to filtered results
- [ ] AI queries respect user's role/office/department scope
- [ ] Response time <10 seconds for NL queries
- [ ] Malformed AI output handled gracefully (no data exposure)

---

### Sprint 14 (Week 21–22): Briefings, Summaries & Drafts

| Task | Details |
|------|---------|
| Partner daily briefing | Automated morning summary: pending, overdue, blocked, unbilled — delivered in-app and optionally via email |
| Thread summarization | "Summarize this" button on long comment threads; AI condenses into key points |
| Draft announcements | Partner provides bullet points → AI generates full announcement text |
| Task description assist | AI suggests structured task description from brief input |
| Tone/formatting | Ensure AI outputs match firm's communication style (professional, concise) |

#### Acceptance Criteria

- [ ] Daily briefing generates correct summary from live data
- [ ] Thread summary captures key decisions and open items
- [ ] Draft announcements are usable with minor edits
- [ ] All AI outputs clearly marked as "AI Draft — Review before sending"
- [ ] AI features degrade gracefully if Ollama is down (show fallback message)

---

### Sprint 15 (Week 23–24): Risk Alerts & Smart Prioritization

| Task | Details |
|------|---------|
| Historical analysis | Analyze past assignment durations by service type to establish baselines |
| Risk scoring | Score active assignments: likelihood of missing due date based on current progress vs historical pace |
| Risk alerts | Surface high-risk items on dashboard; optional push notification |
| Priority queue | AI-suggested work order for each staff member for next 3 days |
| Workload balancing hints | Flag uneven distribution; suggest reassignment candidates |
| Feedback loop | User can dismiss/accept suggestions; feed back to improve scoring |

#### Acceptance Criteria

- [ ] Risk scores correlate with actual delays (validated against historical data)
- [ ] High-risk alerts appear 5+ days before due date
- [ ] Priority suggestions consider due dates, complexity, and dependencies
- [ ] Users can dismiss suggestions without penalty
- [ ] System works with 3+ months of historical data

---

## Phase 4 — Integrations & Extensions

**Duration**: Ongoing (parallel tracks)  
**Goal**: Connect with existing firm tools and add optional modules.

---

### Track A: External Software Links (2–3 weeks)

| Task | Details |
|------|---------|
| Reference ID fields | Add "External Reference" field to assignments (Tally voucher #, Genius return ID, GST ARN) |
| Quick-link generation | Clickable links to external systems where URL patterns are known |
| Import utility | CSV import for client master from existing records |
| Export for Tally | Generate work-register export in Tally-compatible format |
| Status sync webhook | Optional: receive status updates from external systems via webhook |

---

### Track B: Payment & Billing (2–3 weeks)

| Task | Details |
|------|---------|
| Fee master | Configure standard fees per service type |
| Invoice generation | Basic invoice from completed work + fee master |
| Payment links | Razorpay/UPI payment link generation per invoice |
| Payment tracking | Mark invoices as paid (manual or webhook from gateway) |
| Outstanding report | Client-wise outstanding fees dashboard |

---

### Track C: HR & Payroll Lite (3–4 weeks)

| Task | Details |
|------|---------|
| Attendance | Daily check-in/check-out; leave requests and approvals |
| Leave management | Leave balance, types (CL/EL/SL), carry-forward rules |
| Payroll basics | Monthly salary calculation; deductions; payslip generation |
| Holiday calendar | Office-wise holiday list; auto-adjust due dates |

---

### Track D: Advanced Analytics (2–3 weeks)

| Task | Details |
|------|---------|
| Client profitability | Revenue (billed) vs effort (time cost) per client |
| Service profitability | Which services are most/least efficient |
| Capacity planning | Projected workload vs available staff hours for next quarter |
| Partner portfolio view | Bird's eye view of each partner's client portfolio health |
| YoY comparison | Compare metrics across financial years |

---

## Development Practices

| Practice | Standard |
|----------|----------|
| Version control | Git; feature branches; PR reviews before merge to main |
| Testing | Unit tests (Vitest); API integration tests (supertest); E2E (Playwright) |
| CI pipeline | Lint → type-check → npm audit → test → build on every PR |
| Security scanning | npm audit + ESLint security plugin on every PR; Snyk weekly |
| Code review | All PRs require 1 approval; security-sensitive PRs need 2 |
| Documentation | API documented via OpenAPI/Swagger (auto-generated from routes) |
| Database changes | All via Prisma migrations; never manual DDL in production |
| Input validation | Zod schemas shared between frontend/backend; reject invalid early |
| Environments | Local (Docker) → Staging (same server, separate DB) → Production |
| Release cycle | Deploy to production at end of each sprint after QA sign-off |
| Logging | Structured JSON (pino); correlation IDs; never log PAN/GSTIN/passwords |
| Error handling | Consistent error response shape; no stack traces in production |

---

## Testing Strategy

### Test Pyramid

| Level | Tool | Coverage Target | What to Test |
|-------|------|----------------|--------------|
| Unit | Vitest | >80% of business logic | Status transitions, due-date calculations, permission checks, validators |
| Integration | Supertest + test DB | All API endpoints | Request/response contracts, auth enforcement, error codes |
| E2E | Playwright | Critical flows | Login → assign → complete → dashboard update; mobile viewport |
| Load | k6 | Pre-release | 50 concurrent users; <500ms API response; <2s page load |
| Security | OWASP ZAP (baseline) | Pre-release | Automated vulnerability scan against staging |

### Security Test Cases (Every Sprint)

- [ ] Unauthenticated request returns 401
- [ ] User cannot access another user's scoped data
- [ ] Invalid PAN/GSTIN rejected with clear error
- [ ] SQL injection attempts in search/filter fields fail safely
- [ ] Rate limit triggers on brute-force login
- [ ] Expired/blacklisted session returns 401
- [ ] Sensitive fields not present in API responses to unauthorized roles

---

## Resource Requirements

### Team (Recommended)

| Role | Count | Responsibility |
|------|-------|---------------|
| Full-stack developer | 1–2 | Core development (backend + frontend) |
| UI/UX designer | 1 (part-time) | Design system, mobile layouts, UX review |
| QA / tester | 1 (part-time from Sprint 4) | Test plans, regression testing, UAT coordination |
| Project lead | 1 | Scope management, firm communication, sprint planning |

### Hardware (For Deployment)

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Server CPU | 4 cores | 8 cores |
| RAM | 16 GB | 32 GB (needed for AI in Phase 3) |
| Storage | 256 GB SSD | 512 GB SSD |
| GPU (Phase 3) | None (CPU inference OK for 7B) | NVIDIA with 8GB+ VRAM for faster AI |
| Network | Static IP or DDNS | Static IP + VPN appliance |
| UPS | Required | Protect server from power issues |

---

## Non-Functional Requirements

| Metric | Target |
|--------|--------|
| API response time (p95) | <500ms |
| Dashboard load time | <2 seconds |
| Concurrent users | 50 (all 20 employees + buffer) |
| Uptime | 99.5% during business hours (9am–8pm IST) |
| Data backup | Daily automated; tested restore monthly |
| Recovery time (RTO) | <1 hour from backup |
| Recovery point (RPO) | <24 hours (daily backup) |
| Audit log retention | 3 years |
| Password hashing time | <500ms (argon2 tuned) |
| Max file upload | 25MB per document |

---

## Summary Timeline

```
Week  1–2   ██ Foundation & Auth
Week  3–4   ██ Client Master
Week  4–5   ██ Service Master
Week  5–7   ████ Assignment Engine
Week  7–8   ██ Recurring Engine
Week  8–9   ██ Time Tracking
Week  9–10  ██ Dashboards
Week 10–11  ██ Reports
Week 11–12  ██ Notifications & Billing
            ─── Phase 1 Complete ───
Week 13–14  ██ PWA & Mobile
Week 15–16  ██ Advanced Filters & Views
Week 17–18  ██ Analytics & Exports
            ─── Phase 2 Complete ───
Week 19–20  ██ AI Infrastructure & NL Queries
Week 21–22  ██ Briefings & Summaries
Week 23–24  ██ Risk Alerts & Prioritization
            ─── Phase 3 Complete ───
Week 25+    ▓▓▓▓ Integrations & Extensions (ongoing)
```

**Total to production-ready MVP**: ~12 weeks  
**Total to AI-enabled platform**: ~24 weeks

---

## Document History

| Version | Date | Notes |
|---------|------|-------|
| 1.0 | 2026-05-09 | Detailed implementation plan with sprint-level tasks and acceptance criteria |
| 1.1 | 2026-05-09 | Added testing strategy, security test cases, non-functional requirements |
