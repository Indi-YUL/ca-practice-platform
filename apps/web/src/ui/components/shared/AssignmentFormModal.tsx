import { useState } from "react";
import { useCreateAssignmentMutation } from "@/store/api/assignmentApi";
import { useGetClientsQuery } from "@/store/api/clientApi";
import { useGetServicesQuery } from "@/store/api/serviceApi";
import { useGetStaffQuery } from "@/store/api/staffApi";
import type { Priority, Task } from "@/domain/models";
import { X, Plus, Trash2 } from "lucide-react";

interface Props {
  onClose: () => void;
}

const PERIOD_OPTIONS = [
  "FY 2025-26",
  "FY 2024-25",
  "Q1 2025-26 (Apr-Jun)",
  "Q2 2025-26 (Jul-Sep)",
  "Q3 2025-26 (Oct-Dec)",
  "Q4 2025-26 (Jan-Mar)",
  "Mar 2026",
  "Apr 2026",
  "May 2026",
  "Jun 2026",
];

export function AssignmentFormModal({ onClose }: Props) {
  const [createAssignment, { isLoading }] = useCreateAssignmentMutation();
  const { data: clients = [] } = useGetClientsQuery();
  const { data: services = [] } = useGetServicesQuery();
  const { data: staff = [] } = useGetStaffQuery();

  const [form, setForm] = useState({
    title: "",
    clientId: "",
    serviceName: "",
    period: "FY 2025-26",
    assigneeId: "",
    assignedById: "",
    reviewerId: "",
    priority: "medium" as Priority,
    dueDate: "",
    estimatedHours: "",
    description: "",
  });
  const [tasks, setTasks] = useState<{ id: string; title: string }[]>([]);
  const [newTask, setNewTask] = useState("");
  const [error, setError] = useState("");

  const partners = staff.filter((s) => s.role === "partner");
  const managers = staff.filter((s) => s.role === "manager");
  const allAssignees = staff.filter((s) => s.status === "active");

  function addTask() {
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: `t${Date.now()}`, title: newTask.trim() }]);
    setNewTask("");
  }

  function removeTask(id: string) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.title || !form.clientId || !form.serviceName || !form.assigneeId || !form.dueDate) {
      setError("Please fill all required fields.");
      return;
    }

    const client = clients.find((c) => c.id === form.clientId);
    const assignee = staff.find((s) => s.id === form.assigneeId);
    const assignedBy = staff.find((s) => s.id === form.assignedById);
    const reviewer = staff.find((s) => s.id === form.reviewerId);

    try {
      await createAssignment({
        title: form.title,
        estimatedHours: form.estimatedHours ? parseFloat(form.estimatedHours) : undefined,
        clientId: form.clientId,
        clientName: client?.name || "",
        serviceName: form.serviceName,
        period: form.period,
        assigneeId: form.assigneeId,
        assigneeName: assignee?.name || "",
        assignedById: form.assignedById || undefined,
        assignedByName: assignedBy?.name || undefined,
        reviewerId: form.reviewerId || undefined,
        reviewerName: reviewer?.name || undefined,
        priority: form.priority,
        dueDate: form.dueDate,
        status: "not_started",
        tasks: tasks.map((t) => ({ ...t, completed: false } as Task)),
      }).unwrap();
      onClose();
    } catch {
      setError("Failed to create assignment.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border bg-card p-6 shadow-lg mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Create Assignment</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm font-medium">Assignment Title *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Statutory Audit FY 2025-26, GST Return Q2 Filing"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          {/* Client & Service */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Client *</label>
              <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Select client...</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Service *</label>
              <select value={form.serviceName} onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Select service...</option>
                {services.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
          </div>

          {/* Period, Due Date & Estimate */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-medium">Period</label>
              <select value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {PERIOD_OPTIONS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Due Date *</label>
              <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-sm font-medium">Estimate (hrs)</label>
              <input type="number" step="0.5" min="0.5" value={form.estimatedHours}
                onChange={(e) => setForm({ ...form, estimatedHours: e.target.value })}
                placeholder="e.g. 8"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description / Notes</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3} placeholder="Brief description of the work, special instructions, or scope notes..."
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>

          {/* Checklist */}
          <div>
            <label className="text-sm font-medium">Checklist</label>
            <div className="mt-2 space-y-2">
              {tasks.map((task, idx) => (
                <div key={task.id} className="flex items-center gap-2 rounded-lg border px-3 py-2">
                  <span className="text-xs text-muted-foreground w-5">{idx + 1}.</span>
                  <span className="flex-1 text-sm">{task.title}</span>
                  <button type="button" onClick={() => removeTask(task.id)} className="p-1 text-muted-foreground hover:text-red-500">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTask(); } }}
                  placeholder="Add a checklist item..."
                  className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                <button type="button" onClick={addTask} className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Assignment Team */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-medium">Assign To *</label>
              <select value={form.assigneeId} onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Select staff...</option>
                {allAssignees.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.role})</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Assigned By</label>
              <select value={form.assignedById} onChange={(e) => setForm({ ...form, assignedById: e.target.value })}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Select...</option>
                {[...partners, ...managers].map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Reviewer</label>
              <select value={form.reviewerId} onChange={(e) => setForm({ ...form, reviewerId: e.target.value })}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Select...</option>
                {[...partners, ...managers].map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="text-sm font-medium">Priority</label>
            <div className="mt-2 flex gap-3">
              {(["high", "medium", "low"] as Priority[]).map((p) => (
                <button key={p} type="button" onClick={() => setForm({ ...form, priority: p })}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium capitalize transition-colors ${form.priority === p
                    ? p === "high" ? "border-red-300 bg-red-50 text-red-700" : p === "medium" ? "border-yellow-300 bg-yellow-50 text-yellow-700" : "border-green-300 bg-green-50 text-green-700"
                    : "hover:bg-muted"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted">Cancel</button>
            <button type="submit" disabled={isLoading} className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              {isLoading ? "Creating..." : "Create Assignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
