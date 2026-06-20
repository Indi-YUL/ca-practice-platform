# CJ Practice Manager — POC v2.0

**Version:** 2.0  
**Date:** 20 June 2026  
**Type:** Frontend POC with MSW mock server (localStorage persistence)  
**Purpose:** Extended product demonstration aligned to client blueprint  
**Stack:** React 18 · TypeScript · Redux Toolkit + RTK Query · MSW · Tailwind CSS · Vite

---

## What's New in v2 (vs v1)

| Area | v1 | v2 |
|------|----|----|
| Data Layer | In-memory Redux (resets on refresh) | MSW mock server + localStorage (persists) |
| API Architecture | Direct state manipulation | RTK Query with real HTTP requests |
| Staff Management | None | Full CRUD — list, detail, add/edit |
| Service Master | Static mock only | Full CRUD — grouped by category, add/edit |
| Task Workflow | 8 basic statuses | 7 aligned statuses per client blueprint + Priority field |
| Calendar | None | Monthly grid + Timeline list with toggle |
| Dashboard | Basic metrics | Role-specific views aligned to blueprint M7 |
| Navigation | 5 items | 8 items (added Staff, Services, Calendar) |
| Assignments | Basic status | Priority badges, assignedBy, improved workflow |

---

## Architecture: MSW Mock Server

```
Browser Request Flow:
  React Page → RTK Query hook → fetch("/api/staff") → MSW intercepts → localStorage → Response
```

- **MSW (Mock Service Worker)** runs inside the browser's service worker
- Intercepts all `/api/*` requests — no backend server needed
- **localStorage** acts as the database — data persists between page refreshes
- Network tab shows real HTTP requests (200, 201, 404 responses)
- When ready for production, remove MSW — RTK Query code stays identical

### API Endpoints (Mock)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/staff | List all staff |
| GET | /api/staff/:id | Get staff by ID |
| POST | /api/staff | Create staff member |
| PATCH | /api/staff/:id | Update staff member |
| GET | /api/services | List all services |
| GET | /api/services/:id | Get service by ID |
| POST | /api/services | Create service |
| PATCH | /api/services/:id | Update service |
| GET | /api/assignments | List all assignments |
| GET | /api/assignments/:id | Get assignment by ID |
| PATCH | /api/assignments/:id | Update assignment (status, tasks, etc.) |
| POST | /api/assignments/:id/comments | Add comment |
| POST | /api/assignments/:id/worklogs | Add worklog |
| GET | /api/clients | List all clients |
| GET | /api/clients/:id | Get client by ID |

---

## New Feature: Staff Master (M9 Partial)

**Routes:** `/staff` · `/staff/:id`

### Staff List (`/staff`)
- Card-grid layout showing all active staff members
- Avatar with initials, name, email, role badge, office, department
- Filters: by Role (Partner/Manager/Staff/Trainee), by Department, by Office
- Search by name or email
- **Add Staff** button opens a creation modal

### Staff Detail (`/staff/:id`)
- Full profile: name, role, email, phone, office, department, date of joining
- Performance summary: Active tasks count, Completed count, Total hours logged
- List of active assignments with priority badges and due dates
- Quick navigation to any assignment

### Add/Edit Staff (Modal)
- Fields: Name, Email, Phone, Role, Department, Office, Date of Joining
- Form validation (required fields)
- Saves to localStorage via MSW
- Instantly reflected in the staff list (RTK Query cache invalidation)

---

## New Feature: Service Master (M2 Partial)

**Route:** `/services`

### Service List
- Grouped by category: Audit, Tax, GST, Accounting, Certification, Consultancy
- Category filter pills at the top
- Each service shows: Name, Frequency badge, Department, Client count
- Edit button on each service

### Add/Edit Service (Modal)
- Fields: Service Name, Category (dropdown), Frequency (monthly/quarterly/annual/occasional), Department, Description
- Saves immediately via MSW API
- Cache invalidation updates the list in real-time

### Service Categories
| Category | Services |
|----------|----------|
| Audit | Statutory Audit, Tax Audit, Internal Audit, Trust Audit |
| Tax | Income Tax Return, TDS Return |
| GST | GST Return |
| Accounting | Accounting & Book-keeping |
| Certification | Certification (80G/12A) |
| Consultancy | FEMA Advisory |

---

## New Feature: Compliance Calendar (M4)

**Route:** `/calendar`

### Monthly Calendar View
- Full month grid showing all deadlines
- Color-coded by type:
  - Blue pills = Compliance deadlines (GSTR-1, GSTR-3B, TDS)
  - Red pills = High priority assignment deadlines
  - Yellow pills = Medium priority deadlines
- Today highlighted
- Navigate between months with arrows
- Click any date to see all deadlines

### Timeline View
- Toggle between Calendar and Timeline
- Grouped sections: Overdue, This Week, Next Week, Later
- Each item shows: Client, Service, Assignee, Priority badge, Due date
- Overdue items pinned at top with red badge
- Click any item to navigate to assignment detail

### Built-in Compliance Dates
- 7th: TDS Payment (monthly)
- 11th: GSTR-1 Due (monthly)
- 20th: GSTR-3B Due (monthly)
- 15th: TDS Return (quarterly — Apr, Jul, Oct, Jan)

---

## Updated Feature: Task Workflow (M2)

### New Status Flow (aligned to client blueprint)

```
Not Started → In Progress → Completed → Reviewed → Billed
                ↗ Query/Hold ↗
                ↗ Waiting for Info ↗
```

| Status | Meaning |
|--------|---------|
| Not Started | Task created, work not begun |
| In Progress | Staff has started work |
| Query/Hold | Paused — query raised internally or with client |
| Waiting for Info | Blocked on external information |
| Completed | Staff marks done, triggers reviewer notification |
| Reviewed | Manager/Partner approves |
| Billed | Invoice raised against this task |

### Priority System (New)
- **High** (red badge) — urgent, approaching deadline or overdue
- **Medium** (yellow badge) — standard work
- **Low** (green badge) — can wait

### Assigned By Field (New)
- Every assignment now shows who created/assigned it
- Supports Partner → Manager → Staff hierarchy tracking

---

## Updated Feature: Dashboards (M7)

### Partner Dashboard
- Firm-wide metrics: Active, In Progress, Overdue, Completion Rate %
- Department breakdown with visual progress bars
- Staff workload comparison (clickable to staff detail)
- Overdue alert panel with priority badges

### Staff Dashboard
- Personal metrics: Active, Overdue, Completed, Hours this month
- My Tasks list with priority and due date
- Quick navigation to assignments

---

## Updated Feature: AI Assistant

- Gemini Flash integration (when API key has quota)
- Context-aware: injects current firm data into prompts
- Fallback to pre-scripted responses for known queries
- Typing animation and suggested questions remain

---

## Data Persistence

| What | Storage | Behavior |
|------|---------|----------|
| Staff members | localStorage (`cj_staff`) | Persists across refresh. Add new staff, they stay. |
| Services | localStorage (`cj_services`) | Persists. Add/edit services reflected permanently. |
| Assignments | localStorage (`cj_assignments`) | Status changes, comments, worklogs all persist. |
| Clients | localStorage (`cj_clients`) | Read-only for now. |
| Auth/Role | Redux (in-memory) | Resets on refresh (role switcher for demo). |

**To reset all data:** Clear localStorage in browser DevTools → refresh.

---

## File Structure (Updated)

```
apps/web/src/
├── main.tsx                        # Bootstrap: MSW init → React render
├── App.tsx                         # 12 routes
├── domain/models.ts                # Staff, ServiceMaster, Assignment (with priority)
├── store/
│   ├── store.ts                    # Redux + RTK Query middleware
│   ├── hooks.ts                    # Typed hooks
│   ├── api/
│   │   ├── baseApi.ts             # RTK Query base (fetchBaseQuery → /api)
│   │   ├── staffApi.ts            # CRUD endpoints
│   │   ├── serviceApi.ts          # CRUD endpoints
│   │   ├── assignmentApi.ts       # Assignments + comments + worklogs
│   │   └── clientApi.ts           # Read-only
│   └── slices/
│       └── authSlice.ts           # Role switching
├── mocks/
│   ├── browser.ts                  # MSW worker setup
│   ├── db.ts                       # localStorage CRUD helpers
│   ├── handlers/
│   │   ├── index.ts               # All handlers combined
│   │   ├── staff.ts               # GET/POST/PATCH /api/staff
│   │   ├── services.ts            # GET/POST/PATCH /api/services
│   │   ├── assignments.ts         # GET/PATCH + comments + worklogs
│   │   └── clients.ts             # GET /api/clients
│   ├── users.ts                    # Seed data
│   ├── clients.ts                  # Seed data
│   ├── services.ts                 # Seed data
│   └── assignments.ts             # Seed data (12 items)
├── ui/
│   ├── layouts/AppLayout.tsx       # 8-item nav
│   ├── pages/
│   │   ├── DashboardPage.tsx      # Role-based
│   │   ├── ClientsPage.tsx
│   │   ├── ClientDetailPage.tsx
│   │   ├── AssignmentsPage.tsx    # Priority + status filters
│   │   ├── AssignmentDetailPage.tsx # RTK mutations
│   │   ├── StaffPage.tsx          # NEW — card grid + filters
│   │   ├── StaffDetailPage.tsx    # NEW — profile + stats
│   │   ├── ServiceMasterPage.tsx  # NEW — grouped + CRUD
│   │   ├── CalendarPage.tsx       # NEW — grid + timeline
│   │   ├── TimeLogPage.tsx
│   │   └── AiBriefingPage.tsx
│   └── components/shared/
│       └── StaffFormModal.tsx      # NEW — add staff form
```

---

## How to Run

```bash
cd ca-practice-platform
npm install
cd apps/web
npx vite --port 5173
# Open: http://localhost:5173/ca-practice-platform/
```

---

## Demo Highlights for Stakeholder

1. **Data persists** — Add a staff member, refresh the page — they're still there
2. **Real API calls** — Open DevTools Network tab to show professional HTTP requests
3. **Staff Master** — "Here's your team directory, you can add people, filter by department"
4. **Service Master** — "All your services organized by category, easy to manage"
5. **Calendar** — "Never miss a compliance deadline — see everything in one view"
6. **Priority** — "High-priority work is flagged red, so partners know what matters"
7. **Workflow** — "Track work from assignment to billing — complete audit trail"
8. **Role switching** — Switch Partner → Staff to show personalized views

---

## What's Next (v3)

- [ ] Add/Edit Client forms with PAN/GSTIN validation
- [ ] Billing module (price list, invoice generation, billed/unbilled toggle)
- [ ] Communication Hub (broadcast, direct messages, acknowledgements)
- [ ] Time entry form (start/stop timer, billable/non-billable)
- [ ] Client Portal (OTP login, service request, query submission)
- [ ] Real backend (Node.js/Fastify + PostgreSQL)
- [ ] Push notifications for overdue items
- [ ] PDF report exports (staff utilization, client MIS)

---

*Document prepared for: Stakeholder Review*  
*Prepared by: Development Team*  
*Version: 2.0 — Frontend POC with Mock Server*
