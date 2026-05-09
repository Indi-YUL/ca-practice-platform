---
name: add-shadcn-component
description: Add a shadcn/ui component to the project. Use when adding a new UI component like button, dialog, select, dropdown, toast, tabs, card, or any shadcn/ui component.
---

# Add a shadcn/ui Component

shadcn/ui components are copy-pasted into the project (not installed via npm). They live in `apps/web/src/ui/components/ui/`.

## Steps

### 1. Check if `cn()` utility exists

File: `apps/web/src/lib/utils.ts`

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

If this file doesn't exist, create it first.

### 2. Add the component

Copy the component code from [ui.shadcn.com](https://ui.shadcn.com/docs/components) and place it in:

```
apps/web/src/ui/components/ui/{component-name}.tsx
```

### 3. Adapt imports

shadcn/ui components use `@/lib/utils` for `cn()`. Make sure the import path resolves correctly:

```tsx
// In the copied component, verify this import works:
import { cn } from "@/lib/utils";
```

### 4. Common components needed for this project

| Component | Use Case |
|-----------|----------|
| `button` | All actions, form submits |
| `input` | Form fields |
| `select` | Dropdowns (office, department, status filters) |
| `dialog` | Modals (create client, assign task) |
| `card` | Dashboard metric cards |
| `badge` | Status badges on assignments |
| `table` | Base for DataTable component |
| `tabs` | Client detail page (info, services, assignments) |
| `skeleton` | Loading states |
| `toast` / `sonner` | Success/error notifications |
| `dropdown-menu` | Action menus on table rows |
| `sheet` | Mobile sidebar navigation |
| `avatar` | User display in headers and comments |
| `calendar` | Date pickers for due dates |

## Rules

- Always use named exports (modify if shadcn defaults to `export default`)
- Keep components in `ui/components/ui/` — don't scatter them
- Don't modify shadcn component internals unless necessary; wrap them in project-specific components instead
- Use semantic color tokens from shadcn theme (not hardcoded Tailwind colors)

## Example: Wrapping shadcn for project use

```tsx
// ui/components/shared/StatusBadge.tsx
import { Badge } from "@/ui/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_STYLES = { /* ... */ };

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge className={cn("text-xs", STATUS_STYLES[status])}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
```
