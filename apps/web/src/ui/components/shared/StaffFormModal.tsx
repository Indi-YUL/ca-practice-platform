import { useState } from "react";
import { useCreateStaffMutation } from "@/store/api/staffApi";
import type { UserRole } from "@/domain/models";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
}

export function StaffFormModal({ onClose }: Props) {
  const [createStaff, { isLoading }] = useCreateStaffMutation();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", role: "staff" as UserRole,
    department: "Income Tax & TDS", office: "Mehsana", dateOfJoining: new Date().toISOString().split("T")[0],
  });
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.phone) {
      setError("Please fill all required fields.");
      return;
    }
    try {
      await createStaff(form).unwrap();
      onClose();
    } catch {
      setError("Failed to create staff member.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-xl border bg-card p-6 shadow-lg mx-4">
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
          <div className="grid grid-cols-2 gap-3">
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
          </div>
          <div>
            <label className="text-sm font-medium">Department</label>
            <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option>Income Tax & TDS</option>
              <option>Auditing & Certification</option>
              <option>GST & Consultancy</option>
              <option>Accounting</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Date of Joining</label>
            <input type="date" value={form.dateOfJoining} onChange={(e) => setForm({ ...form, dateOfJoining: e.target.value })}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
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
