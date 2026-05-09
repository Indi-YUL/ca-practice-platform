---
name: scaffold-page
description: Scaffold a new frontend page with RTK Query API slice, route, and loading/error/empty states. Use when creating a new page, adding a new route, or building a new screen in the CA Practice Platform.
---

# Scaffold a New Page

Creates a complete page with RTK Query data fetching following the project architecture.

## Steps

### 1. Ensure types exist in domain

File: `apps/web/src/domain/models.ts` — add interface if missing:

```ts
export interface Client {
  id: string;
  name: string;
  legalType: string;
  pan?: string;
  gstin?: string;
  officeId: string;
  servicesCount: number;
  createdAt: string;
}
```

### 2. Create the RTK Query API slice

File: `apps/web/src/store/api/{entity}Api.ts`

```ts
import { baseApi } from "./baseApi";
import type { Client, CreateClientInput } from "@/domain/models";

export const clientApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getClients: build.query<Client[], { search?: string; office?: string }>({
      query: (params) => ({ url: "/clients", params }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Client" as const, id })), { type: "Client", id: "LIST" }]
          : [{ type: "Client", id: "LIST" }],
    }),
    getClient: build.query<Client, string>({
      query: (id) => `/clients/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Client", id }],
    }),
    createClient: build.mutation<Client, CreateClientInput>({
      query: (body) => ({ url: "/clients", method: "POST", body }),
      invalidatesTags: [{ type: "Client", id: "LIST" }],
    }),
  }),
});

export const { useGetClientsQuery, useGetClientQuery, useCreateClientMutation } = clientApi;
```

### 3. Register the tag type (if new entity)

In `store/api/baseApi.ts`, add the entity name to `tagTypes` array:

```ts
tagTypes: ["Client", "Assignment", "Worklog", "Service", "User", "Notification"],
```

### 4. Create the page component

File: `apps/web/src/ui/pages/{EntityList}.tsx`

```tsx
import { useGetClientsQuery } from "@/store/api/clientApi";
import { Skeleton } from "@/ui/components/ui/skeleton";
import { ErrorMessage } from "@/ui/components/shared/ErrorMessage";
import { EmptyState } from "@/ui/components/shared/EmptyState";
import { useState } from "react";

export function ClientListPage() {
  const [search, setSearch] = useState("");
  const { data: clients, isLoading, error, refetch } = useGetClientsQuery({ search });

  if (isLoading) return <Skeleton className="h-96" />;
  if (error) return <ErrorMessage message="Failed to load clients" onRetry={refetch} />;
  if (!clients?.length) return <EmptyState title="No clients yet" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clients</h1>
        {/* Add create button */}
      </div>
      <input
        type="search"
        placeholder="Search clients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input w-full sm:w-80"
      />
      {/* Render DataTable with clients */}
    </div>
  );
}
```

### 5. Add the route

File: `apps/web/src/ui/router.tsx`:

```tsx
import { ClientListPage } from "@/ui/pages/ClientList";

{ path: "/clients", element: <ClientListPage /> }
```

## Checklist

- [ ] Types exist in `domain/models.ts`
- [ ] API slice in `store/api/` with `providesTags` and `invalidatesTags`
- [ ] Tag type registered in `baseApi`
- [ ] Page component in `ui/pages/`
- [ ] Route registered in `router.tsx`
- [ ] Loading, error, and empty states handled
- [ ] Page is responsive (test at 375px)
- [ ] Role-based visibility applied if needed
