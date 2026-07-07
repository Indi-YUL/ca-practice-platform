# CJ Practice Manager — POC v3

**Version:** 3.0  
**Date:** 7 July 2026  
**Type:** Frontend POC with MSW mock server (localStorage persistence)  
**Purpose:** Authentication, user management, and permission-based access control  
**Stack:** React 18 · TypeScript · Redux Toolkit + RTK Query · MSW · Tailwind CSS · Vite

---

## What's New in v3 (vs v2.1)

| Area | v2.1 | v3 |
|------|------|-----|
| Authentication | Auto-logged in as Partner (demo) | Username/password login with session persistence |
| Role Switching | Demo dropdown (Partner / Manager / Staff) | Removed — real login per user account |
| Access Control | Hardcoded admin (`u1` only) | Configurable permissions per user per module |
| User Management | None | Full admin page — create accounts, set rights, reset passwords |
| Profile | None | View account details, change password |
| Route Protection | All pages open | Login required; unauthenticated users redirected |
| Staff Creation | Free-form (name, email, etc.) | Must select an **existing user** from User Management |
| User Creation | Required existing staff | Standalone — create user first, add to Staff later |
| Calendar | Direct navigation on click | Quick-preview modal with link to full details |

---

## Architecture: Authentication Flow

```
Login Page → POST /api/auth/login → MSW validates credentials → AuthSession
  → Redux auth slice + localStorage (cj_auth_session)
  → ProtectedRoute allows access to app

Profile → POST /api/auth/change-password → updates stored password

Logout → clears session → redirect to /login
```

### Session Persistence

- Session stored in `localStorage` under `cj_auth_session`
- Page refresh restores logged-in state automatically
- Logout clears session and returns to login page

### Data Stores (localStorage)

| Key | Entity |
|-----|--------|
| `cj_users` | Master user profiles (name, email, role, office, department) |
| `cj_app_users` | Login accounts (username, password, permissions, isAdmin) |
| `cj_staff` | Staff directory records (linked to user via `userId`) |
| `cj_clients` | Client master |
| `cj_services` | Service master |
| `cj_assignments` | Assignments, tasks, comments, worklogs |
| `cj_auth_session` | Current login session |

---

## New Feature: Login (M0)

**Route:** `/login` (public — only accessible when logged out)

### Sign In
- **Username** — unique login identifier (e.g. `rajesh.chauhan`)
- **Password** — minimum 8 characters
- Invalid credentials show an error message
- Inactive accounts are blocked

### Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin (Partner) | `rajesh.chauhan` | `Cjca@1234` |
| Admin (Partner) | `nilesh.jain` | `Cjca@1234` |
| Manager | `priya.sharma` | `Cjca@1234` |
| Staff (no form rights) | `rahul.trivedi` | `Cjca@1234` |

Default password for all seeded accounts: **`Cjca@1234`**

---

## New Feature: User Management (M10)

**Route:** `/users` (admin only — visible in sidebar and profile menu)

### Who Can Access
- Users with **Administrator** flag (`isAdmin: true`)
- Multiple admins supported (all 3 Partners are admins by default)

### User List
- Table of all login accounts: name, username, role, admin badge, status, permission summary
- Edit button per row

### Add User Account
Create a user **before** adding them to Staff:
- Full Name, Email, Role, Office, Department
- Username (auto-suggested from name)
- Default Password (min 8 chars — user can change after login)
- Administrator toggle
- **Permission matrix** — per module: Add / Edit checkboxes

### Edit User Account
- Update username, admin flag, active/inactive status
- Edit permission matrix (grant all / revoke all shortcuts)
- Optional password reset

### Permission Matrix

| Module | Add | Edit |
|--------|-----|------|
| Clients | Create new clients | Edit existing clients |
| Staff | Add staff from existing users | Edit staff records |
| Services | Create services | Edit services |
| Assignments | Create assignments | Edit assignments |

Permissions are **independent of role** — an admin configures exactly what each user can do.

---

## New Feature: Profile (M0)

**Route:** `/profile` (accessible from profile icon dropdown)

### Account Details (read-only)
- Name, Username, Email, Office, Department, Role badge

### Change Password
- Current password verification
- New password (minimum 8 characters)
- Confirm new password
- Success/error feedback

---

## Updated Feature: Access Control

### Before (v2.1)
- `isAdmin(user)` checked if `user.id === "u1"` (hardcoded)
- Demo role switcher changed the view without real auth

### After (v3)
- `hasPermission(permissions, resource, action)` checks configured rights
- Add/Edit buttons hidden when user lacks permission
- Assignment edit: permission **or** assignment owner (`assignedById`)
- User Management and admin nav: `isAdmin` flag only

### Pages with Permission Gating

| Page | Gated Action | Permission |
|------|-------------|------------|
| Clients | Add Client | `clients.create` |
| Client Detail | Edit | `clients.edit` |
| Staff | Add Staff | `staff.create` |
| Services | Add / Edit | `services.create` / `services.edit` |
| Assignments | Create | `assignments.create` |
| Assignment Detail | Edit | `assignments.edit` or owner |

---

## Updated Feature: Staff Creation Workflow

### New Two-Step Flow

```
Step 1: User Management → Add User Account (name, email, username, password, permissions)
Step 2: Staff Directory → Add Staff → Select existing user → Configure staff profile
```

### Add Staff Modal
- **Select User** dropdown — only users with active login accounts who are **not** already active staff
- Read-only display: Name, Email, Role, Office (from user profile)
- Staff-specific fields: Phone, Date of Joining, Departments, Services
- Partners auto-select all departments and services

### Validation (MSW)
- `userId` required — must select an existing user
- User must have an active login account
- Cannot add a user who is already active staff

---

## Updated Feature: Calendar Preview Modal

**Route:** `/calendar`

- Clicking an assignment in the monthly grid or timeline opens a **quick-preview modal**
- Shows: title, client, service, status, priority, assignee, hours vs estimate, task progress, due date, overdue indicator
- **View Full Details** button navigates to the assignment detail page
- Avoids leaving the calendar context for a quick check

---

## API Endpoints (New in v3)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Authenticate with username + password |
| GET | `/api/auth/session/:accountId` | Restore session |
| POST | `/api/auth/change-password` | Change password (requires current password) |
| GET | `/api/app-users` | List all user accounts (enriched with profile) |
| POST | `/api/app-users` | Create user account (+ user profile if new) |
| PATCH | `/api/app-users/:id` | Update account, permissions, password |

Existing v2 endpoints (`/api/staff`, `/api/clients`, `/api/services`, `/api/assignments`) unchanged except:
- `POST /api/staff` now requires `userId` and validates against existing user accounts

---

## File Structure (v3 additions)

```
apps/web/src/
├── lib/
│   ├── authStorage.ts          # Session save/load/clear
│   └── permissions.ts          # hasPermission() helper
├── mocks/
│   ├── authAccounts.ts         # Seed login accounts (12 users)
│   └── handlers/
│       ├── auth.ts             # Login, session, change-password
│       └── appUsers.ts         # User account CRUD
├── store/
│   ├── api/
│   │   ├── authApi.ts          # Login, changePassword mutations
│   │   └── appUserApi.ts       # User management CRUD
│   └── slices/
│       └── authSlice.ts        # Session state, logout, permissions
├── ui/
│   ├── components/
│   │   └── ProtectedRoute.tsx  # Auth guard wrapper
│   └── pages/
│       ├── LoginPage.tsx       # Sign-in form
│       ├── ProfilePage.tsx     # Account + password change
│       └── UserManagementPage.tsx  # Admin user & permission management
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

You will land on the **login page**. Use demo credentials above.

---

## Demo Highlights for Stakeholder

1. **Real login** — Sign in as different users; each sees their own name and permissions
2. **Permission control** — Log in as `rahul.trivedi` (staff) — no Add/Edit buttons anywhere
3. **Admin configures rights** — Log in as `rajesh.chauhan`, go to User Management, grant `rahul.trivedi` client create permission — sign in as Rahul to verify
4. **User-first workflow** — Create a new user in User Management, then add them to Staff directory
5. **Password change** — Profile → Change Password → sign in with new password
6. **Calendar preview** — Click any assignment on calendar for quick details without leaving the page
7. **Session persistence** — Refresh the page — still logged in
8. **Multiple admins** — All 3 Partners have admin access to User Management

---

## Suggested Demo Flow

1. Open app → Login page appears
2. Sign in as `rajesh.chauhan` / `Cjca@1234` (admin, full permissions)
3. Navigate to **User Management** → show permission matrix on a staff user
4. Sign out → Sign in as `rahul.trivedi` → show view-only access (no Add buttons)
5. Sign out → Sign in as admin again
6. **User Management** → Add User Account (new person) → **Staff** → Add Staff (select that user)
7. **Profile** → Change password demo
8. **Calendar** → Click assignment → preview modal → View Full Details

---

## What's Next (v4)

- [ ] Billing module (price list, invoice generation, billed/unbilled toggle)
- [ ] Communication Hub (broadcast, direct messages, acknowledgements)
- [ ] Timer-based time entry (start/stop, auto-calculate duration)
- [ ] Client Portal (OTP login, service request, query submission)
- [ ] Real backend (Node.js/Fastify + PostgreSQL) with JWT auth
- [ ] Push notifications for overdue items
- [ ] PDF report exports (staff utilization, client MIS)
- [ ] Document management (upload, link to assignments)

---

*POC v3 builds on v2.1. All v2 features (Client CRUD, Assignment lifecycle, Time Logging, Staff Master, Service Master, Calendar, AI Assistant) remain available — now behind authentication and permission controls.*
