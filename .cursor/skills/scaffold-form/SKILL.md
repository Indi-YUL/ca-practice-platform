---
name: scaffold-form
description: Scaffold a validated form with Zod schema, controlled inputs, RTK mutation, and error handling. Use when creating a new form, adding a create/edit modal, or building an input-heavy screen like client creation or assignment creation.
---

# Scaffold a Validated Form (RTK Mutation)

Creates a form with Zod validation and RTK Query mutation for submitting data.

## Steps

### 1. Define the Zod schema

File: `apps/web/src/lib/schemas/{entity}.ts`

```ts
import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string().min(1, "Client name is required").max(200),
  legalType: z.enum(["pvt_ltd", "llp", "partnership", "proprietorship", "individual", "trust", "coop"]),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN format").optional().or(z.literal("")),
  gstin: z.string().regex(/^\d{2}[A-Z]{5}\d{4}[A-Z]\d[Z][A-Z\d]$/, "Invalid GSTIN format").optional().or(z.literal("")),
  officeId: z.string().min(1, "Office is required"),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
```

### 2. Ensure RTK mutation exists

In `store/api/clientApi.ts`:

```ts
createClient: build.mutation<Client, CreateClientInput>({
  query: (body) => ({ url: "/clients", method: "POST", body }),
  invalidatesTags: [{ type: "Client", id: "LIST" }],
}),
```

### 3. Create the form component

File: `apps/web/src/ui/components/forms/{EntityForm}.tsx`

```tsx
import { useState } from "react";
import { createClientSchema, type CreateClientInput } from "@/lib/schemas/client";
import { useCreateClientMutation } from "@/store/api/clientApi";
import { cn } from "@/lib/utils";

interface ClientFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialValues?: Partial<CreateClientInput>;
}

export function ClientForm({ onSuccess, onCancel, initialValues }: ClientFormProps) {
  const [values, setValues] = useState<Partial<CreateClientInput>>(initialValues ?? {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createClient, { isLoading }] = useCreateClientMutation();

  function handleChange(field: keyof CreateClientInput, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = createClientSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    try {
      await createClient(result.data).unwrap();
      onSuccess();
    } catch (err) {
      setErrors({ _form: "Failed to save. Please try again." });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors._form && <p className="text-sm text-red-500">{errors._form}</p>}

      <div>
        <label htmlFor="name" className="text-sm font-medium">Client Name</label>
        <input
          id="name"
          value={values.name ?? ""}
          onChange={(e) => handleChange("name", e.target.value)}
          className={cn("input w-full", errors.name && "border-red-500")}
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
```

## Key Patterns

- Use `.unwrap()` on mutations to get the result or throw on error
- `isLoading` from mutation hook disables the submit button
- Zod `safeParse` validates before calling mutation
- On success: call `onSuccess` callback (parent closes modal/navigates)
- RTK Query auto-invalidates the list cache via `invalidatesTags`
- Support both create (empty) and edit (`initialValues`) with same form
- PAN regex: `/^[A-Z]{5}[0-9]{4}[A-Z]$/`
- GSTIN regex: `/^\d{2}[A-Z]{5}\d{4}[A-Z]\d[Z][A-Z\d]$/`

## Checklist

- [ ] Zod schema in `lib/schemas/`
- [ ] RTK mutation endpoint in `store/api/`
- [ ] Form component in `ui/components/forms/`
- [ ] Every field has a `<label>` with matching `htmlFor`
- [ ] Validation errors display inline per field
- [ ] Submit button disabled during `isLoading`
- [ ] `.unwrap()` used on mutation call with try/catch
- [ ] Cache invalidated automatically on success
- [ ] Works for both create and edit flows
