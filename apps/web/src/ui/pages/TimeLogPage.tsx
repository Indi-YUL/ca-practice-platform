import { useGetAssignmentsQuery } from "@/store/api/assignmentApi";
import { Clock } from "lucide-react";

export function TimeLogPage() {
  const { data: assignments = [] } = useGetAssignmentsQuery();
  const allWorklogs = assignments.flatMap((a) => a.worklogs.map((w) => ({ ...w, clientName: a.clientName, serviceName: a.serviceName })));
  const sorted = [...allWorklogs].sort((a, b) => b.date.localeCompare(a.date));
  const totalHours = allWorklogs.reduce((sum, w) => sum + w.hours, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Time Log</h1>
          <p className="text-sm text-muted-foreground">All time entries across assignments</p>
        </div>
        <div className="rounded-lg border bg-card p-3 text-center">
          <p className="text-xs text-muted-foreground">Total Logged</p>
          <p className="text-xl font-bold">{totalHours}h</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="divide-y">
          {sorted.map((w) => (
            <div key={w.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2"><Clock className="h-4 w-4 text-primary" /></div>
                <div>
                  <p className="text-sm font-medium">{w.clientName}</p>
                  <p className="text-xs text-muted-foreground">{w.serviceName} · {w.note}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{w.hours}h</p>
                <p className="text-xs text-muted-foreground">{w.date}</p>
              </div>
            </div>
          ))}
          {sorted.length === 0 && <div className="p-8 text-center text-muted-foreground">No time entries yet.</div>}
        </div>
      </div>
    </div>
  );
}
