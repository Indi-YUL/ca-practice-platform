---
name: scaffold-data-table
description: Scaffold a filterable, sortable data table with RTK Query for lists like clients, assignments, worklogs, or reports. Use when building a list view, adding a table with filters, or creating a searchable grid.
---

# Scaffold a Data Table (RTK Query)

The app has many table-heavy screens (clients, assignments, worklogs, reports). This skill creates consistent tables powered by RTK Query.

## Steps

### 1. Define column configuration

```tsx
import type { Client } from "@/domain/models";

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

const clientColumns: Column<Client>[] = [
  { key: "name", label: "Client Name", sortable: true },
  { key: "legalType", label: "Type", render: (v) => <Badge>{v}</Badge> },
  { key: "pan", label: "PAN" },
  { key: "gstin", label: "GSTIN" },
  { key: "servicesCount", label: "Services", sortable: true },
];
```

### 2. Wire filters to RTK Query

Pass filter state as query params — RTK Query auto-refetches on change:

```tsx
export function ClientListPage() {
  const [search, setSearch] = useState("");
  const [office, setOffice] = useState("");

  const { data: clients, isLoading, error, refetch } = useGetClientsQuery(
    { search, office: office || undefined },
    { skip: false },
  );

  // RTK Query refetches automatically when search/office changes
}
```

### 3. Create filter bar

```tsx
interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  filters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
}

export function FilterBar({ search, onSearchChange, filters, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <input
        type="search"
        placeholder="Search..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="input flex-1"
      />
      {/* Dropdown filters for office, department, status, etc. */}
    </div>
  );
}
```

### 4. Build the table component

```tsx
export function DataTable<T extends { id: string }>({
  data,
  columns,
  onRowClick,
}: {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-4 py-3 text-left font-medium">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={cn("hover:bg-muted/30", onRowClick && "cursor-pointer")}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3">
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Table Features to Include

- **Search**: debounced text search (300ms) at the top
- **Filters**: dropdowns for office, department, status, date range as relevant
- **Sorting**: click column header to toggle asc/desc
- **Pagination**: show 20 rows per page; "Previous / Next" controls
- **Empty state**: "No results found" with option to clear filters
- **Row click**: navigate to detail page
- **Responsive**: horizontal scroll on mobile with sticky first column
- **Overdue highlighting**: red text/border for overdue items in assignment tables

## Status Badge Colors

Reuse consistently across all tables:

```tsx
const STATUS_STYLES: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  assigned: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  waiting_for_info: "bg-orange-100 text-orange-700",
  query_raised: "bg-red-100 text-red-700",
  under_review: "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
  closed: "bg-gray-200 text-gray-500",
};
```

## Checklist

- [ ] Column definitions typed with `Column<T>`
- [ ] Filter bar with search + relevant dropdown filters
- [ ] Sortable columns where appropriate
- [ ] Pagination (20 per page)
- [ ] Empty state when no results
- [ ] Row click navigates to detail page
- [ ] Status badges use consistent colors
- [ ] Table scrolls horizontally on mobile
- [ ] Overdue items visually highlighted
