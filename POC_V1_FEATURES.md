# CJ Practice Manager — POC v1.0

**Version:** 1.0  
**Date:** 25 May 2026  
**Type:** Frontend-only POC (static data)  
**Purpose:** Product demonstration for stakeholder review  
**Stack:** React 18 · TypeScript · Redux Toolkit · Tailwind CSS · Vite

---

## Table of Contents

1. [Overview](#1-overview)
2. [Application Architecture](#2-application-architecture)
3. [Feature Detail](#3-feature-detail)
4. [Demo Data Summary](#4-demo-data-summary)
5. [How to Run](#5-how-to-run)
6. [Demo Script](#6-demo-script)
7. [Known Limitations (POC Only)](#7-known-limitations-poc-only)
8. [Next Steps (v2)](#8-next-steps-v2)

---

## 1. Overview

CJ Practice Manager is a practice management platform designed for **Chauhan & Jain Chartered Accountants** — a multi-office CA firm with partners, managers, staff, and trainees handling services like Statutory Audit, Income Tax, GST, TDS, and Accounting.

This POC demonstrates the **core user experience** with realistic data representative of a Gujarat-based CA firm. All data is static (in-memory) — no backend or database is required.

---

## 2. Application Architecture

```
apps/web/src/
├── main.tsx                    # App entry point (React + Redux + Router)
├── App.tsx                     # Route definitions
├── index.css                   # Tailwind CSS + design tokens
├── domain/
│   └── models.ts               # TypeScript interfaces for all entities
├── store/
│   ├── store.ts                # Redux store configuration
│   ├── hooks.ts                # Typed useAppSelector / useAppDispatch
│   └── slices/
│       ├── authSlice.ts        # Authentication & role switching
│       └── assignmentSlice.ts  # Assignment state + actions
├── mocks/
│   ├── users.ts                # 12 users (3 partners, 3 managers, 4 staff, 2 trainees)
│   ├── clients.ts              # 15 clients (various entity types)
│   ├── services.ts             # 10 service types across 4 departments
│   └── assignments.ts          # 10 assignments with tasks, comments, worklogs
├── lib/
│   └── utils.ts                # Utility functions (cn, formatDate, daysUntil)
└── ui/
    ├── layouts/
    │   └── AppLayout.tsx       # Shell: sidebar, top bar, mobile nav, role switcher
    └── pages/
        ├── DashboardPage.tsx   # Partner/Manager overview + Staff personal view
        ├── ClientsPage.tsx     # Client list with search
        ├── ClientDetailPage.tsx# Client profile, services, assignments
        ├── AssignmentsPage.tsx # Filterable assignment list with progress bars
        ├── AssignmentDetailPage.tsx # Full assignment view with actions
        ├── TimeLogPage.tsx     # Time entry log across all assignments
        └── AiBriefingPage.tsx  # AI Assistant with chat interface
```

---

## 3. Feature Detail

### 3.1 Multi-Role Dashboard

**Route:** `/dashboard`

| Capability | Description |
|---|---|
| Partner/Manager View | Firm-wide metrics: Active work count, In Progress, Overdue, Completed |
| Department Breakdown | Visual bar chart showing pending work by department (Income Tax, Audit, GST, Accounting) |
| Staff Workload Panel | Each staff member's active vs completed assignments with overload indicators |
| Overdue Alerts | Red-highlighted section listing all overdue items with client name, service, assignee, and due date |
| Staff/Trainee View | Personal task list showing only their assignments with status and due dates |
| Quick Navigation | Click any item to jump directly to its assignment detail |

**Roles Supported:** Partner sees firm-wide data. Manager sees team data. Staff/Trainee see only their own.

---

### 3.2 Client Management

**Routes:** `/clients` · `/clients/:id`

| Capability | Description |
|---|---|
| Client List | Searchable table showing all 15 clients |
| Search | Real-time filtering by client name, PAN, or GSTIN |
| Client Profile | Legal type, office, contact person, group affiliation |
| PAN & GSTIN Display | Formatted display of tax identifiers |
| Active Services | Tags showing all services subscribed by the client |
| Client Assignments | List of all assignments linked to this client with status badges |
| Group Tagging | Clients belonging to a group (e.g., "Shreeji Group") are tagged |
| Entity Types | Supports Pvt Ltd, LLP, Partnership, Individual, Co-op Society, Trust, Proprietorship |

**Data:** 15 clients representing typical Gujarat CA practice portfolio including industrial companies, dairy co-ops, pharma, real estate, trusts, and individuals.

---

### 3.3 Assignment Workflow

**Routes:** `/assignments` · `/assignments/:id`

| Capability | Description |
|---|---|
| Assignment List | All work items with client name, service, period, assignee, status, and progress |
| Status Filtering | Dropdown filter: All, Assigned, In Progress, Query Raised, Waiting for Info, Under Review, Completed |
| Search | Filter by client name or service name |
| Overdue Highlighting | Red border + background for items past their due date |
| Progress Bars | Visual indicator showing completed tasks / total tasks |
| Status Workflow | One-click status transitions: Assigned → In Progress → Under Review → Completed |
| Task Checklist | Interactive checklist — click to mark tasks complete/incomplete |
| Comments System | Add notes, queries, resolutions, or review remarks with type badges |
| Comment Types | Note (general), Query (raises a question), Resolution (answers a query), Review Remark (from reviewer) |
| Time Tracking | Shows total hours logged on each assignment |
| Role Display | Shows Assignee + Reviewer with names |

**Status Flow:**

```
Draft → Assigned → In Progress → Under Review → Completed → Closed
                 ↗ Query Raised ↗
                 ↗ Waiting for Info ↗
```

**Interactions (live in POC):**
- Toggle task checkboxes ✅
- Change assignment status ✅
- Add comments with type selection ✅

---

### 3.4 Time Log

**Route:** `/time`

| Capability | Description |
|---|---|
| Global Time View | All time entries across all assignments in one place |
| Chronological Order | Sorted by date (most recent first) |
| Total Hours | Aggregate display of total time logged |
| Entry Details | Client name, service, note, hours, and date for each entry |

---

### 3.5 AI Practice Assistant

**Route:** `/ai`

| Capability | Description |
|---|---|
| Morning Briefing | Auto-generated summary card showing overdue count, upcoming deadlines, and active work |
| Chat Interface | Conversational UI — type questions or click suggestions |
| Suggested Questions | Pre-set clickable prompts for common queries |
| Typing Animation | Realistic "thinking" delay (2-3 seconds) with animated dots |
| Context-Aware Responses | AI references actual client names, staff, dates, and statuses from the practice data |

**Available AI Queries:**

| Query Type | What It Shows |
|---|---|
| "What's my priority today?" | Overdue items + upcoming deadlines + recommendation on what to tackle first |
| "Show me overdue items" | Detailed breakdown of each overdue item with risk level and suggested action |
| "How is my team's workload?" | Per-staff analysis with overloaded/available indicators and redistribution suggestions |
| "Brief me on [Client Name]" | Complete client profile: status, blocking issues, history, contact, actionable next steps |
| "Compliance calendar" | Month-by-month upcoming deadlines with planning tips |

**Supported Client Briefs:**
- Gujarat Ceramics Ltd (GST query issue)
- Shreeji Industries Pvt Ltd (audit in progress, reviewer flagged issue)

---

### 3.6 Layout & Navigation

| Capability | Description |
|---|---|
| Responsive Sidebar | Fixed sidebar on desktop (lg+), slide-out overlay on mobile |
| Top Bar | User info, role badge, office display |
| Role Switcher | Dropdown menu to switch between Partner/Manager/Staff view for demo |
| Active State | Current page highlighted in sidebar |
| Mobile Navigation | Hamburger menu with full-screen overlay |
| Firm Branding | "CJ" logo with "Chauhan & Jain · Practice Manager" in sidebar header |

---

### 3.7 Role-Based Experience

| Role | Dashboard | Assignments | AI |
|---|---|---|---|
| **Partner** | Firm-wide metrics, all departments, all staff workload | All assignments visible | Full briefing with strategic recommendations |
| **Manager** | Team summary with department focus | Team assignments | Team workload analysis |
| **Staff** | Personal task list only | Only their assignments | Personal priority list |

**Switch between roles** using the dropdown in the top-right corner. Data adapts instantly.

---

## 4. Demo Data Summary

### Users (12 total)

| Role | Count | Names |
|---|---|---|
| Partner | 3 | CA Rajesh Chauhan, CA Nilesh Jain, CA Amit Patel |
| Manager | 3 | Priya Sharma, Ketan Mehta, Sneha Desai |
| Staff | 4 | Rahul Trivedi, Pooja Bhatt, Vishal Shah, Meera Joshi |
| Trainee | 2 | Darshan Prajapati, Riya Pandya |

### Clients (15 total)

Entity types: 4 Pvt Ltd, 2 LLP, 2 Partnership, 2 Trust, 2 Proprietorship, 1 Co-op, 1 Individual, 1 HUF

Offices: Mehsana (10), Ahmedabad (5)

Groups: Shreeji Group (2 clients), Patel Group (2 clients), Shah Family (1 client)

### Services (10 types)

Departments: Auditing & Certification (4), Income Tax & TDS (2), GST & Consultancy (2), Accounting (1), Certification (1)

### Assignments (10 total)

| Status | Count |
|---|---|
| Assigned | 2 |
| In Progress | 3 |
| Query Raised | 1 |
| Waiting for Info | 1 |
| Under Review | 1 |
| Completed | 2 |

---

## 5. How to Run

```bash
# Navigate to project
cd ca-practice-platform

# Install dependencies
npm install

# Start development server
cd apps/web
npx vite --port 5173

# Open in browser
open http://localhost:5173
```

No backend, database, or API keys required. Everything runs locally in the browser.

---

## 6. Demo Script

**For non-technical stakeholder (5-7 minutes):**

### Opening (30 seconds)
> "This is your firm's practice management platform. When you open it each morning, you see everything at a glance."

### Dashboard (1 minute)
- Show the Partner dashboard with all metrics
- Point to overdue items in red — "These need immediate attention"
- Show staff workload — "You can see who's overloaded at a glance"

### Client Management (1 minute)
- Search for "Shreeji" — instant results
- Open client detail — show services, PAN/GSTIN, group tagging
- Click through to an assignment

### Assignment Workflow (2 minutes)
- Show the assignment list with filters
- Open "Gujarat Ceramics GST Return" — show the query raised
- Demonstrate checking off a task
- Add a comment — "This is how your team communicates without WhatsApp"
- Change status to show workflow

### AI Assistant (2 minutes)
- Navigate to AI — briefing appears automatically
- Click "What's my priority today?" — show the intelligent response
- Ask "Brief me on Gujarat Ceramics" — show the deep client insight
- Ask "How is my team's workload?" — show redistribution suggestion

### Role Switching (30 seconds)
- Switch to Staff view — "This is what your staff member sees"
- Show their personal task list — focused, no clutter

### Closing
> "This replaces your Excel trackers, WhatsApp groups, and morning meetings. Everything in one place — with AI that knows your practice."

---

## 7. Known Limitations (POC Only)

| Limitation | Resolution in v2 |
|---|---|
| Static data (no persistence) | Backend API + PostgreSQL database |
| No real authentication | JWT/session auth with proper login screen |
| AI responses are pre-scripted | Integration with LLM (Ollama/Llama 3) for dynamic responses |
| No file uploads | Document management with S3/local storage |
| No notifications | Real-time notifications via WebSocket |
| No billing/invoicing | Full billing module with GST invoice generation |
| No reports/exports | PDF export, Excel reports, MIS dashboards |
| Limited to 15 clients | Scalable to 500+ clients with pagination |
| No audit trail | Immutable audit log for compliance |

---

## 8. Next Steps (v2)

### Immediate (Week 2-3)
- [ ] Login screen with email/password
- [ ] Add new client form with validation (PAN, GSTIN format)
- [ ] Create assignment form with service/period selection
- [ ] Time entry form (log hours against assignments)
- [ ] Basic notification badges

### Short-term (Week 4-6)
- [ ] Backend API (Node.js/Fastify + PostgreSQL)
- [ ] Real data persistence
- [ ] Document upload per assignment
- [ ] Email notifications for overdue items
- [ ] Report generation (staff utilization, client MIS)

### Medium-term (Week 7-10)
- [ ] AI integration with Ollama for dynamic responses
- [ ] Billing & invoicing module
- [ ] Multi-office support with data segregation
- [ ] Mobile app (React Native or PWA)
- [ ] Client portal (read-only access for clients)

---

*Document prepared for: Stakeholder Review*  
*Prepared by: Development Team*  
*Version: 1.0 — Frontend POC*
