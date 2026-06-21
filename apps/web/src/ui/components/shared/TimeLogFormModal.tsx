import { useState } from "react";
import { useGetAssignmentsQuery, useAddWorklogMutation } from "@/store/api/assignmentApi";
import { useAppSelector } from "@/store/hooks";
import { X, Clock } from "lucide-react";

interface Props {
  assignmentId?: string;
  onClose: () => void;
}

export function TimeLogFormModal({ assignmentId, onClose }: Props) {
  const { currentUser } = useAppSelector((state) => state.auth);
  const { data: assignments = [] } = useGetAssignmentsQuery();
  const [addWorklog, { isLoading }] = useAddWorklogMutation();

  const activeAssignments = assignments.filter((a) => !["completed", "reviewed", "billed"].includes(a.status));

  const [form, setForm] = useState({
    assignmentId: assignmentId || "",
    date: new Date().toISOString().split("T")[0],
    hours: "",
    note: "",
  });
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.assignmentId || !form.hours || !form.note) {
      setError("Please fill all required fields.");
      return;
    }

    const hours = parseFloat(form.hours);
    if (isNaN(hours) || hours <= 0 || hours > 24) {
      setError("Hours must be between 0.25 and 24.");
      return;
    }

    try {
      await addWorklog({
        assignmentId: form.assignmentId,
        worklog: {
          userId: currentUser.id,
          userName: currentUser.name,
          assignmentId: form.assignmentId,
          date: form.date,
          hours,
          note: form.note,
        },
      }).unwrap();
      onClose();
    } catch {
      setError("Failed to log time.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border bg-card p-6 shadow-lg mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2"><Clock className="h-5 w-5 text-primary" /></div>
            <h2 className="text-lg font-semibold">Log Time</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Assignment *</label>
            <select value={form.assignmentId} onChange={(e) => setForm({ ...form, assignmentId: e.target.value })}
              disabled={!!assignmentId}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60">
              <option value="">Select assignment...</option>
              {activeAssignments.map((a) => (
                <option key={a.id} value={a.id}>{a.clientName} — {a.serviceName} ({a.period})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Date *</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-sm font-medium">Hours *</label>
              <input type="number" step="0.25" min="0.25" max="24" value={form.hours}
                onChange={(e) => setForm({ ...form, hours: e.target.value })}
                placeholder="e.g. 2.5"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Work Description *</label>
            <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
              rows={3} placeholder="What did you work on?"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted">Cancel</button>
            <button type="submit" disabled={isLoading} className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              {isLoading ? "Saving..." : "Log Time"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
