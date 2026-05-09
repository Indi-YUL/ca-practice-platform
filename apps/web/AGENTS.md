# Frontend Agent Guide — CA Practice Platform

## About This App

React + TypeScript frontend for a CA (Chartered Accountant) practice management platform. The firm has 3 partners, 2 offices, ~20 employees across 4 departments. This app manages task assignments, client records, time tracking, dashboards, and internal communication.

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18.x | UI framework |
| TypeScript | 5.x (strict) | Type safety |
| Redux Toolkit (RTK) | 2.x | State management |
| RTK Query | 2.x (part of RTK) | Server data fetching, caching, mutations |
| Vite | 5.x | Bundler and dev server |
| Tailwind CSS | 3.x | Utility-first styling |
| shadcn/ui | latest | Component library (copy-paste, not npm) |
| React Router | 6.x | Client-side routing |
| Zod | 3.x | Runtime validation (forms) |
| Vitest | latest | Unit tests |
| Playwright | latest | E2E tests |

**Note**: No Axios. RTK Query's `fetchBaseQuery` handles all HTTP calls.

## Architecture

```
src/
├── domain/         → Interfaces and types (never imports other layers)
├── store/
│   ├── api/        → RTK Query API slices (baseApi.ts, clientApi.ts, etc.)
│   ├── slices/     → Redux slices for UI/client state (authSlice, uiSlice)
│   ├── hooks.ts    → Typed useAppSelector and useAppDispatch
│   └── store.ts    → Store configuration
├── ui/
│   ├── components/ → Reusable UI components
│   ├── pages/      → Route-level page components
│   ├── layouts/    → App shell, sidebar, navigation
│   └── router.tsx  → Route definitions
└── lib/
    ├── utils.ts    → cn() helper, formatters
    └── schemas/    → Zod validation schemas
```

## Data Flow

```
Component → RTK Query hook → fetchBaseQuery → Backend API
               ↓ (auto-cached)
         Component re-renders with data
```

- Server data (clients, assignments): **RTK Query cache** (never duplicate in slices)
- Auth state (user, role): **Redux slice** (`authSlice`)
- UI state (sidebar, filters): **Redux slice** (`uiSlice`)
- Form inputs: **Local `useState`**

## Conventions

### Components
- Named exports only (never `export default`)
- Props interface: `{ComponentName}Props`
- One component per file
- Handle loading, error, empty states in every data-fetching component

### RTK Query Usage
- One API slice per domain entity, all injecting into `baseApi`
- Use `providesTags` on queries, `invalidatesTags` on mutations
- Use auto-generated hooks: `useGet{Entity}Query`, `useCreate{Entity}Mutation`
- Use `.unwrap()` on mutations in try/catch
- Use `skip` param for conditional fetching: `useGetClientQuery(id, { skip: !id })`
- Never use raw `fetch`, Axios, or manual hooks for API calls

### State Management
- Always use typed hooks: `useAppSelector`, `useAppDispatch` (from `store/hooks.ts`)
- Never use plain `useSelector` or `useDispatch`
- Don't copy RTK Query cached data into slices
- Slices only for client-side state (auth, UI preferences)

### Styling
- Tailwind utilities only (no custom CSS files)
- Use `cn()` for conditional classes
- Mobile-first responsive (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`)
- Use shadcn/ui semantic color tokens (`text-muted-foreground`, not `text-gray-500`)

### TypeScript
- `strict: true` enforced
- Never use `any` — use `unknown` and narrow
- Use `as const` objects instead of enums
- Shared types in `domain/models.ts`

### Forms
- Controlled components with local `useState`
- Validate with Zod schemas (in `lib/schemas/`)
- Submit via RTK mutation with `.unwrap()`
- Show inline field errors; disable button during `isLoading`

### Testing
- Unit tests: Vitest for slices, utilities, and selectors
- E2E: Playwright for critical flows (login, assign task, log time)
- Mock RTK Query in tests using `setupServer` from msw

## User Roles

| Role | What they see |
|------|--------------|
| Partner | Everything: all clients, all assignments, dashboards, billing, reports, admin |
| Manager | Their team's work, can assign to juniors, departmental view |
| Staff / Trainee | Only their own assignments, time logging, personal dashboard |
| Admin | User management, service config, system settings |

Guard UI sections by role using auth state from Redux store:

```tsx
const { user } = useAppSelector((state) => state.auth);
{user.role === "partner" && <BillingSection />}
```

## Key Domain Terms

| Term | Meaning |
|------|---------|
| Client | A company/individual the firm serves (has PAN, GSTIN) |
| ClientGroup | Multiple related clients under one promoter |
| ServiceMaster | Template for a service type (Audit, ITR, GST Return, etc.) |
| ClientService | A specific client subscribed to a specific service |
| ServicePeriod | A time period for a service (e.g., GST April 2026) |
| Assignment | A work item for a person: client + service + period |
| Task | A checklist item within an assignment |
| Worklog | Time logged against an assignment |
| WorkRegister | Completed work summary record |

## RTK Query Tag Types

Registered in `baseApi`: `Client`, `Assignment`, `Worklog`, `Service`, `User`, `Notification`

Always use `{ type: "Entity", id }` for specific items and `{ type: "Entity", id: "LIST" }` for collections.

## Environment Variables

Prefix all with `VITE_`:

```
VITE_API_URL=http://localhost:8080/api
```

## Common Pitfalls

- The Java backend uses `context-path: /api` — set `VITE_API_URL` correctly, don't duplicate `/api` prefix
- PAN format: `AAAAA0000A` (5 letters, 4 digits, 1 letter)
- GSTIN format: `22AAAAA0000A1Z5` (2 digits, PAN, 1 char, Z, 1 digit)
- Assignment statuses must follow valid transitions (see PLAN.md status model)
- Dates in India: display as `DD/MM/YYYY` or `DD MMM YYYY`, never `MM/DD/YYYY`
- Use `.unwrap()` on mutations — without it, errors are silently swallowed
- Don't store server data in slices — that's what RTK Query cache is for
