import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetAssignmentsQuery } from "@/store/api/assignmentApi";
import { cn } from "@/lib/utils";
import { Search, Filter } from "lucide-react";

const STATUS_OPTIONS = ["all", "not_started", "in_progress", "query_hold", "waiting_for_info", "completed", "reviewed", "billed"];
const PRIORITY_OPTIONS = ["all", "high", "medium", "low"];

export function AssignmentsPage() {
  const { data: assignments = [], isLoading } = useGetAssignmentsQuery();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const today = new Date().toISOString().split("T")[0];

  const filtered = assignments.filter((a) => {
    const matchesSearch = a.clientName.toLowerCase().includes(search.toLowerCase()) || a.serviceName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || a.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (isLoading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Assignments</h1>
        <p className="text-sm text-muted-foreground">{assignments.length} total work items</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="search" placeholder="Search client or service..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border bg-background py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s === "all" ? "All Statuses" : s.replace(/_/g, " ")}</option>)}
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p === "all" ? "All Priorities" : p}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((a) => (
          <Link key={a.id} to={`/assignments/${a.id}`}
            className={cn("block rounded-lg border p-4 hover:bg-muted/50 transition-colors",
              a.dueDate < today && !["completed", "reviewed", "billed"].includes(a.status) && "border-red-200 bg-red-50/50")}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{a.clientName}</p>
                  <PriorityBadge priority={a.priority} />
                </div>
                <p className="text-sm text-muted-foreground">{a.serviceName} · {a.period}</p>
                <p className="mt-1 text-xs text-muted-foreground">Assigned to: {a.assigneeName}{a.assignedByName ? ` · By: ${a.assignedByName}` : ""}</p>
              </div>
              <div className="text-right shrink-0">
                <StatusBadge status={a.status} />
                <p className={cn("mt-1 text-xs", a.dueDate < today && !["completed", "reviewed", "billed"].includes(a.status) ? "text-red-500 font-medium" : "text-muted-foreground")}>
                  Due: {a.dueDate}
                </p>
              </div>
            </div>
            {a.tasks.length > 0 && (
              <div className="mt-2">
                <div className="h-1.5 w-full rounded-full bg-muted">
                  <div className="h-1.5 rounded-full bg-primary" style={{ width: `${(a.tasks.filter((t) => t.completed).length / a.tasks.length) * 100}%` }} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{a.tasks.filter((t) => t.completed).length}/{a.tasks.length} tasks done</p>
              </div>
            )}
          </Link>
        ))}
        {filtered.length === 0 && <div className="rounded-lg border p-8 text-center text-muted-foreground">No assignments match your filters.</div>}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    not_started: "bg-gray-100 text-gray-700",
    in_progress: "bg-yellow-100 text-yellow-700",
    query_hold: "bg-red-100 text-red-700",
    waiting_for_info: "bg-orange-100 text-orange-700",
    completed: "bg-green-100 text-green-700",
    reviewed: "bg-purple-100 text-purple-700",
    billed: "bg-blue-100 text-blue-700",
  };
  return <span className={cn("inline-block rounded-full px-2 py-0.5 text-xs font-medium", styles[status])}>{status.replace(/_/g, " ")}</span>;
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = { high: "bg-red-100 text-red-700", medium: "bg-yellow-100 text-yellow-700", low: "bg-green-100 text-green-700" };
  return <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", styles[priority])}>{priority}</span>;
}
