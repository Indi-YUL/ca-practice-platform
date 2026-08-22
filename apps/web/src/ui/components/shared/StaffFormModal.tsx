import { useState, useEffect, useRef } from "react";
import { useCreateStaffMutation } from "@/store/api/staffApi";
import { useGetAppUsersQuery } from "@/store/api/appUserApi";
import { useGetStaffQuery } from "@/store/api/staffApi";
import type { AppUserListItem } from "@/store/api/appUserApi";
import { X, ChevronDown } from "lucide-react";

interface Props {
  onClose: () => void;
}

const DEPARTMENTS = ["Income Tax & TDS", "Auditing & Certification", "GST & Consultancy", "Accounting"];
const SERVICES = ["Statutory Audit", "Tax Audit", "Internal Audit", "Trust Audit", "Income Tax Return", "TDS Return", "GST Return", "Accounting & Book-keeping", "Certification (80G/12A)", "FEMA Advisory"];
const DESIGNATIONS = ["CA", "Article Assistant", "Accountant", "Manager", "Senior Executive", "Executive"];
const EMPLOYMENT_TYPES = [
  { value: "full_time", label: "Full-time" },
  { value: "articleship", label: "Articleship" },
  { value: "intern", label: "Intern" },
] as const;

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
  const { data: appUsers = [] } = useGetAppUsersQuery();
  const { data: staff = [] } = useGetStaffQuery();
  const [createStaff, { isLoading }] = useCreateStaffMutation();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUser, setSelectedUser] = useState<AppUserListItem | null>(null);
  const [form, setForm] = useState({
    employeeId: "",
    phone: "",
    dateOfJoining: new Date().toISOString().split("T")[0],
    designation: "",
    employmentType: "full_time" as "full_time" | "articleship" | "intern",
    reportingManagerId: "",
    departments: [] as string[],
    services: [] as string[],
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
  });
  const [error, setError] = useState("");

  const activeStaffIds = new Set(staff.filter((s) => s.status === "active").map((s) => s.id));
  const availableUsers = appUsers.filter((u) => u.status === "active" && !activeStaffIds.has(u.userId));
  const reportingManagers = staff.filter((s) => s.status === "active" && (s.role === "partner" || s.role === "manager"));

  useEffect(() => {
    if (selectedUser?.role === "partner") {
      setForm((f) => ({ ...f, departments: [...DEPARTMENTS], services: [...SERVICES] }));
    }
  }, [selectedUser?.role]);

  function handleUserSelect(userId: string) {
    setSelectedUserId(userId);
    const user = availableUsers.find((u) => u.userId === userId) ?? null;
    setSelectedUser(user);
    setForm({
      employeeId: `EMP${String(staff.length + 1).padStart(3, "0")}`,
      phone: "",
      dateOfJoining: new Date().toISOString().split("T")[0],
      designation: user?.role === "partner" ? "CA" : user?.role === "trainee" ? "Article Assistant" : "Accountant",
      employmentType: user?.role === "trainee" ? "articleship" : "full_time",
      reportingManagerId: "",
      departments: user?.role === "partner" ? [...DEPARTMENTS] : user?.department ? [user.department] : [],
      services: user?.role === "partner" ? [...SERVICES] : [],
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      accountHolderName: user?.name || "",
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!selectedUserId) {
      setError("Please select an existing user.");
      return;
    }
    if (!form.phone) {
      setError("Please enter a phone number.");
      return;
    }
    if (!form.employeeId.trim()) {
      setError("Please enter an employee / staff ID.");
      return;
    }
    if (!form.designation) {
      setError("Please select a designation.");
      return;
    }
    if (form.departments.length === 0) {
      setError("Please select at least one department.");
      return;
    }
    try {
      await createStaff({
        userId: selectedUserId,
        employeeId: form.employeeId.trim(),
        phone: form.phone,
        dateOfJoining: form.dateOfJoining,
        designation: form.designation,
        employmentType: form.employmentType,
        reportingManagerId: form.reportingManagerId || undefined,
        departments: form.departments,
        services: form.services,
        bankDetails: form.bankName || form.accountNumber || form.ifscCode
          ? {
              bankName: form.bankName || undefined,
              accountNumber: form.accountNumber || undefined,
              ifscCode: form.ifscCode.toUpperCase() || undefined,
              accountHolderName: form.accountHolderName || undefined,
            }
          : undefined,
      }).unwrap();
      onClose();
    } catch {
      setError("Failed to add staff member. User may already be active staff.");
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

        <p className="mb-4 text-sm text-muted-foreground">
          Select an existing user from User Management, then configure their staff profile.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Select User *</label>
            <select
              value={selectedUserId}
              onChange={(e) => handleUserSelect(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Choose an existing user...</option>
              {availableUsers.map((u) => (
                <option key={u.userId} value={u.userId}>
                  {u.name} ({u.username}) — {u.role}
                </option>
              ))}
            </select>
            {availableUsers.length === 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                No users available. Create a user account in User Management first.
              </p>
            )}
          </div>

          {selectedUser && (
            <div className="rounded-lg border bg-muted/30 p-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium">{selectedUser.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="font-medium capitalize">{selectedUser.role}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Office</p>
                <p className="font-medium">{selectedUser.office}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Employee / Staff ID *</label>
              <input
                type="text"
                value={form.employeeId}
                onChange={(e) => setForm({ ...form, employeeId: e.target.value.toUpperCase() })}
                disabled={!selectedUserId}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                placeholder="EMP001"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                disabled={!selectedUserId}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                placeholder="9876543210"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Date of Joining</label>
              <input
                type="date"
                value={form.dateOfJoining}
                onChange={(e) => setForm({ ...form, dateOfJoining: e.target.value })}
                disabled={!selectedUserId}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Designation / Qualification *</label>
              <select
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                disabled={!selectedUserId}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              >
                <option value="">Select...</option>
                {DESIGNATIONS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Employment Type *</label>
              <select
                value={form.employmentType}
                onChange={(e) => setForm({ ...form, employmentType: e.target.value as typeof form.employmentType })}
                disabled={!selectedUserId}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              >
                {EMPLOYMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Reporting Manager</label>
              <select
                value={form.reportingManagerId}
                onChange={(e) => setForm({ ...form, reportingManagerId: e.target.value })}
                disabled={!selectedUserId || selectedUser?.role === "partner"}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              >
                <option value="">Select manager...</option>
                {reportingManagers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          </div>

          <div className="rounded-lg border p-4 space-y-3">
            <p className="text-sm font-medium">Bank Details (optional)</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Bank Name</label>
                <input type="text" value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                  disabled={!selectedUserId} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm disabled:opacity-50" placeholder="HDFC Bank" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Account Holder Name</label>
                <input type="text" value={form.accountHolderName} onChange={(e) => setForm({ ...form, accountHolderName: e.target.value })}
                  disabled={!selectedUserId} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm disabled:opacity-50" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Account Number</label>
                <input type="text" value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                  disabled={!selectedUserId} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-mono disabled:opacity-50" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">IFSC Code</label>
                <input type="text" value={form.ifscCode} onChange={(e) => setForm({ ...form, ifscCode: e.target.value.toUpperCase() })}
                  disabled={!selectedUserId} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-mono disabled:opacity-50" placeholder="HDFC0001234" maxLength={11} />
              </div>
            </div>
          </div>

          <MultiSelectDropdown
            label="Departments *"
            options={DEPARTMENTS}
            selected={form.departments}
            onChange={(departments) => setForm({ ...form, departments })}
            hint={selectedUser?.role === "partner" ? "(All selected for Partners)" : undefined}
          />

          <MultiSelectDropdown
            label="Services"
            options={SERVICES}
            selected={form.services}
            onChange={(services) => setForm({ ...form, services })}
            hint={selectedUser?.role === "partner" ? "(All selected for Partners)" : "Services this staff member can handle — used for assignment routing"}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted">Cancel</button>
            <button
              type="submit"
              disabled={isLoading || !selectedUserId || availableUsers.length === 0}
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? "Adding..." : "Add Staff"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
