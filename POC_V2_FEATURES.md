# CJ Practice Manager — POC v2.1

**Version:** 2.1  
**Date:** 21 June 2026  
**Type:** Frontend POC with MSW mock server (localStorage persistence)  
**Purpose:** Extended product demonstration aligned to client blueprint  
**Stack:** React 18 · TypeScript · Redux Toolkit + RTK Query · MSW · Tailwind CSS · Vite

---

## What's New in v2.1 (vs v2.0)

| Area | v2.0 | v2.1 |
|------|------|------|
| Client Management | Read-only list | Full CRUD — add, edit, search, detail page |
| Assignment Creation | None (pre-seeded only) | Full creation form with title, description, checklist |
| Assignment Editing | Status change only | Full edit modal (owner/partner only) |
| Time Logging | View only | Log time from TimeLog page or Assignment detail |
| Time Log Page | Basic list | Filters, summary cards, daily breakdown chart |
| Estimate Tracking | None | Estimated hours field with progress bar indicators |
| Staff Form | Single department dropdown | Multi-select dropdown for departments & services |
| Staff Roles | No auto-defaults | Partners auto-select all departments & services |

---

## What's New in v2.0 (vs v1)

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
| POST | /api/assignments | **NEW** — Create assignment |
| PATCH | /api/assignments/:id | Update assignment (status, tasks, etc.) |
| POST | /api/assignments/:id/comments | Add comment |
| POST | /api/assignments/:id/worklogs | Add worklog |
| GET | /api/clients | List all clients |
| GET | /api/clients/:id | Get client by ID |
| POST | /api/clients | **NEW** — Create client |
| PATCH | /api/clients/:id | **NEW** — Update client |

---

## New Feature: Client Management (M1)

**Routes:** `/clients` · `/clients/:id`

### Client List (`/clients`)
- Table view with all clients
- Search by name, PAN, GSTIN, or contact person
- Shows entity type, PAN, office, and service count
- **Add Client** button opens creation modal

### Client Detail (`/clients/:id`)
- Full profile: Name, entity type, PAN, GSTIN, office, contact, phone, group name
- Active services shown as colored chips
- Linked assignments with status and priority
- **Edit** button opens pre-filled form

### Add/Edit Client (Modal)
- Fields: Client/Entity Name, Entity Type (Individual, Proprietorship, Partnership, LLP, Pvt Ltd, Trust, Co-op Society, HUF), PAN (format validation), GSTIN, Office, Contact Person, Phone, Group Name
- Services: Multi-select toggle chips from available service list
- PAN validation enforces correct format (ABCDE1234F)
- Saves to localStorage via MSW

---

## New Feature: Assignment Creation & Editing (M2)

### Create Assignment (Modal from `/assignments`)
- **Title** — clear heading for the assignment (required)
- **Client** — dropdown from client master
- **Service** — dropdown from service master
- **Period** — FY, quarter, or month selector
- **Due Date** — date picker (required)
- **Estimated Hours** — time budget for the work
- **Description/Notes** — scope, instructions, context (required)
- **Checklist** — add multiple task items (at least one required), each becomes a trackable checkbox on the detail page
- **Assign To** — dropdown of all active staff
- **Reviewer** — partner or manager
- **Priority** — toggle between High / Medium / Low
- **Assigned By** — automatically set to current logged-in user

### Edit Assignment (Modal from `/assignments/:id`)
- Same fields as create, pre-filled with existing data
- **Restricted access**: Only the assignment owner (person who created it) or a Partner can edit
- Edit button (pencil icon) shown only to authorized users
- Checklist items can be added/removed during edit
- Completed items shown with strikethrough

---

## New Feature: Time Logging (M5)

### Log Time (Modal)
- Accessible from **Time Log page** ("Log Time" button) and **Assignment Detail page** (+ button on Time Logged card)
- Fields: Assignment (dropdown of active assignments), Date, Hours (0.25 increments), Work Description
- Logged by current user automatically
- Immediately reflects in both Time Log page and Assignment detail

### Time Log Page (`/time-log`)
- **Summary Cards**: Total hours, Average per day, Daily breakdown mini-chart
- **Filters**: Date range (Today / This Week / This Month / All) + Staff dropdown
- **Entry List**: Each entry shows client, service, description, staff name, hours, date
- All entries aggregated from assignment worklogs across the firm

### Assignment Detail — Time Tracking
- Time Logged card shows total hours vs estimated hours
- **Progress bar with color coding**:
  - Green: under 80% of estimate
  - Yellow: 80-100% of estimate (warning)
  - Red: over estimate — displays "Over by X.Xh"
- Hours number turns red when over budget
- "View X entries" button opens modal with full worklog list and estimate progress

---

## Updated Feature: Staff Master (M9)

### Multi-Select Departments & Services
- Staff members can belong to **multiple departments** (not just one)
- Each staff member has associated **services** they handle
- **Multi-select dropdown** with:
  - Checkboxes for each option
  - "Select All / Deselect All" toggle
  - Selected items shown as removable chips below
  - Summary text ("3 selected" or "All Departments (4)")
- **Partners**: Automatically have all departments and all services pre-selected when role is set to Partner
- Staff list shows department chips (max 2 visible + "+N" overflow)
- Staff detail page displays full departments and services as colored chips

---

## Updated Feature: Task Workflow (M2)

### Status Flow (aligned to client blueprint)

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

### Priority System
- **High** (red badge) — urgent, approaching deadline or overdue
- **Medium** (yellow badge) — standard work
- **Low** (green badge) — can wait

### Assignment Display Hierarchy
- **Heading**: Assignment title (e.g. "Statutory Audit FY 2025-26")
- **Sub-header**: Client name · Service · Period

---

## Updated Feature: Compliance Calendar (M4)

**Route:** `/calendar`

### Monthly Calendar View
- Full month grid showing all deadlines
- Color-coded by type:
  - Blue pills = Compliance deadlines (GSTR-1, GSTR-3B, TDS)
  - Red pills = High priority assignment deadlines
  - Yellow pills = Medium priority deadlines
- Today highlighted
- Navigate between months with arrows

### Timeline View
- Toggle between Calendar and Timeline
- Grouped sections: Overdue, This Week, Next Week, Later
- Each item shows: Client, Service, Assignee, Priority badge, Due date

### Built-in Compliance Dates
- 7th: TDS Payment (monthly)
- 11th: GSTR-1 Due (monthly)
- 20th: GSTR-3B Due (monthly)
- 15th: TDS Return (quarterly — Apr, Jul, Oct, Jan)

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
| Staff members | localStorage (`cj_staff`) | Persists across refresh. Multi-dept and services stored. |
| Services | localStorage (`cj_services`) | Persists. Add/edit services reflected permanently. |
| Assignments | localStorage (`cj_assignments`) | Create, edit, status changes, comments, worklogs all persist. |
| Clients | localStorage (`cj_clients`) | Full CRUD — add, edit, search all persist. |
| Auth/Role | Redux (in-memory) | Resets on refresh (role switcher for demo). |

**To reset all data:** Clear localStorage in browser DevTools → refresh.

---

## File Structure (Updated)

```
apps/web/src/
├── main.tsx                        # Bootstrap: MSW init → React render
├── App.tsx                         # 12 routes
├── domain/models.ts                # Staff (multi-dept), Assignment (title, estimate)
├── store/
│   ├── store.ts                    # Redux + RTK Query middleware
│   ├── hooks.ts                    # Typed hooks
│   ├── api/
│   │   ├── baseApi.ts             # RTK Query base (fetchBaseQuery → /api)
│   │   ├── staffApi.ts            # CRUD endpoints
│   │   ├── serviceApi.ts          # CRUD endpoints
│   │   ├── assignmentApi.ts       # Full CRUD + comments + worklogs
│   │   └── clientApi.ts           # Full CRUD endpoints
│   └── slices/
│       └── authSlice.ts           # Role switching
├── mocks/
│   ├── browser.ts                  # MSW worker setup
│   ├── db.ts                       # localStorage CRUD helpers (all entities)
│   ├── handlers/
│   │   ├── index.ts               # All handlers combined
│   │   ├── staff.ts               # GET/POST/PATCH /api/staff
│   │   ├── services.ts            # GET/POST/PATCH /api/services
│   │   ├── assignments.ts         # GET/POST/PATCH + comments + worklogs
│   │   └── clients.ts             # GET/POST/PATCH /api/clients
│   ├── users.ts                    # Seed data (12 staff)
│   ├── clients.ts                  # Seed data (15 clients)
│   ├── services.ts                 # Seed data (10 services)
│   └── assignments.ts             # Seed data (12 items)
├── ui/
│   ├── layouts/AppLayout.tsx       # 8-item nav
│   ├── pages/
│   │   ├── DashboardPage.tsx      # Role-based
│   │   ├── ClientsPage.tsx        # UPDATED — full CRUD
│   │   ├── ClientDetailPage.tsx   # UPDATED — edit button
│   │   ├── AssignmentsPage.tsx    # UPDATED — create button
│   │   ├── AssignmentDetailPage.tsx # UPDATED — edit, time log modal
│   │   ├── StaffPage.tsx          # UPDATED — multi-dept chips
│   │   ├── StaffDetailPage.tsx    # UPDATED — depts + services display
│   │   ├── ServiceMasterPage.tsx  # Grouped + CRUD
│   │   ├── CalendarPage.tsx       # Grid + timeline
│   │   ├── TimeLogPage.tsx        # UPDATED — filters, summary, log button
│   │   └── AiBriefingPage.tsx     # Fixed RTK Query migration
│   └── components/shared/
│       ├── StaffFormModal.tsx      # Multi-select dropdown
│       ├── ClientFormModal.tsx     # NEW — full client form
│       ├── AssignmentFormModal.tsx # NEW — create assignment
│       ├── AssignmentEditModal.tsx # NEW — edit assignment (owner only)
│       └── TimeLogFormModal.tsx   # NEW — log time entry
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

1. **Full client management** — Add a client with PAN, GSTIN, services — see them in the list
2. **Assignment lifecycle** — Create assignment with title, description, checklist → assign to staff → track progress → log time → mark reviewed → bill it
3. **Time tracking** — Log hours against any assignment, see budget vs actual with color indicators
4. **Over-budget alerts** — Progress bar turns red when logged time exceeds estimate
5. **Ownership control** — Only the assigner or partner can edit an assignment
6. **Staff multi-role** — Partners oversee all departments, staff assigned to specific ones
7. **Data persists** — Everything saves to localStorage — refresh and it's all still there
8. **Calendar** — Never miss a compliance deadline — see everything in one view
9. **Role switching** — Switch Partner → Staff to show personalized dashboard views
10. **Real API calls** — Open DevTools Network tab to show professional HTTP request/response

---

## What's Next (v3)

- [ ] Billing module (price list, invoice generation, billed/unbilled toggle)
- [ ] Communication Hub (broadcast, direct messages, acknowledgements)
- [ ] Timer-based time entry (start/stop, auto-calculate duration)
- [ ] Client Portal (OTP login, service request, query submission)
- [ ] Real backend (Node.js/Fastify + PostgreSQL)
- [ ] Push notifications for overdue items
- [ ] PDF report exports (staff utilization, client MIS)
- [ ] Document management (upload, link to assignments)

---

*Document prepared for: Stakeholder Review*  
*Prepared by: Development Team*  
*Version: 2.1 — Frontend POC with Full CRUD & Time Tracking*
