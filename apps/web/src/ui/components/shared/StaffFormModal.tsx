import { useState, useEffect, useRef } from "react";
import { useCreateStaffMutation } from "@/store/api/staffApi";
import type { UserRole } from "@/domain/models";
import { X, ChevronDown } from "lucide-react";

interface Props {
  onClose: () => void;
}

const DEPARTMENTS = ["Income Tax & TDS", "Auditing & Certification", "GST & Consultancy", "Accounting"];
const SERVICES = ["Statutory Audit", "Tax Audit", "Internal Audit", "Trust Audit", "Income Tax Return", "TDS Return", "GST Return", "Accounting & Book-keeping", "Certification (80G/12A)", "FEMA Advisory"];

function MultiSelectDropdown({ label, options, selected, onChange, hint }: {
  label: string; options: string[]; selected: string[]; onChange: (val: string[]) => void; hint?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggle(item: string) {
    onChange(selected.includes(item) ? selected.filter((s) => s !== item) : [...selected, item]);
  }

  function toggleAll() {
    onChange(selected.length === options.length ? [] : [...options]);
  }

  return (
    <div ref={ref} className="relative">
      <label className="text-sm font-medium">{label}</label>
      {hint && <span className="ml-2 text-xs text-muted-foreground">{hint}</span>}
      <button type="button" onClick={() => setOpen(!open)}
        className="mt-1 flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-ring">
        <span className={selected.length === 0 ? "text-muted-foreground" : ""}>
          {selected.length === 0 ? `Select ${label.toLowerCase()}...` : selected.length === options.length ? `All ${label} (${options.length})` : `${selected.length} selected`}
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border bg-card shadow-lg max-h-56 overflow-y-auto">
          <button type="button" onClick={toggleAll}
            className="w-full px-3 py-2 text-left text-xs font-medium text-primary hover:bg-muted border-b">
            {selected.length === options.length ? "Deselect All" : "Select All"}
          </button>
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 px-3 py-2 hover:bg-muted cursor-pointer">
              <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)}
                className="h-3.5 w-3.5 rounded border-gray-300 text-primary focus:ring-primary" />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      )}
      {selected.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {selected.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
              {s}
              <button type="button" onClick={() => toggle(s)} className="hover:text-primary/70"><X className="h-3 w-3" /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function StaffFormModal({ onClose }: Props) {
  const [createStaff, { isLoading }] = useCreateStaffMutation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "staff" as UserRole,
    office: "Mehsana",
    dateOfJoining: new Date().toISOString().split("T")[0],
    departments: [] as string[],
    services: [] as string[],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (form.role === "partner") {
      setForm((f) => ({ ...f, departments: [...DEPARTMENTS], services: [...SERVICES] }));
    }
  }, [form.role]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.phone) {
      setError("Please fill all required fields.");
      return;
    }
    if (form.departments.length === 0) {
      setError("Please select at least one department.");
      return;
    }
    try {
      await createStaff({
        ...form,
        department: form.departments[0],
      }).unwrap();
      onClose();
    } catch {
      setError("Failed to create staff member.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border bg-card p-6 shadow-lg mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Add Staff Member</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Full Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. Priya Sharma" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Email *</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="name@cjca.in" />
            </div>
            <div>
              <label className="text-sm font-medium">Phone *</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="9876543210" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium">Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="partner">Partner</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
                <option value="trainee">Trainee</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Office</label>
              <select value={form.office} onChange={(e) => setForm({ ...form, office: e.target.value })}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="Mehsana">Mehsana</option>
                <option value="Ahmedabad">Ahmedabad</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Date of Joining</label>
              <input type="date" value={form.dateOfJoining} onChange={(e) => setForm({ ...form, dateOfJoining: e.target.value })}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>

          <MultiSelectDropdown
            label="Departments *"
            options={DEPARTMENTS}
            selected={form.departments}
            onChange={(departments) => setForm({ ...form, departments })}
            hint={form.role === "partner" ? "(All selected for Partners)" : undefined}
          />

          <MultiSelectDropdown
            label="Services"
            options={SERVICES}
            selected={form.services}
            onChange={(services) => setForm({ ...form, services })}
            hint={form.role === "partner" ? "(All selected for Partners)" : undefined}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted">Cancel</button>
            <button type="submit" disabled={isLoading} className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              {isLoading ? "Adding..." : "Add Staff"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
