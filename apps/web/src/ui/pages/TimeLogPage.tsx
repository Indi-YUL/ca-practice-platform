import { useState, useMemo } from "react";
import { useGetAssignmentsQuery } from "@/store/api/assignmentApi";
import { cn } from "@/lib/utils";
import { Clock, Plus, Calendar, TrendingUp } from "lucide-react";
import { TimeLogFormModal } from "@/ui/components/shared/TimeLogFormModal";

export function TimeLogPage() {
  const { data: assignments = [] } = useGetAssignmentsQuery();
  const [showLogModal, setShowLogModal] = useState(false);
  const [dateFilter, setDateFilter] = useState<"today" | "week" | "month" | "all">("week");
  const [staffFilter, setStaffFilter] = useState("all");

  const allWorklogs = useMemo(
    () => assignments.flatMap((a) => a.worklogs.map((w) => ({ ...w, clientName: a.clientName, serviceName: a.serviceName }))),
    [assignments]
  );

  const staffNames = useMemo(() => [...new Set(allWorklogs.map((w) => w.userName))].sort(), [allWorklogs]);

  const filtered = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    return allWorklogs.filter((w) => {
      const matchStaff = staffFilter === "all" || w.userName === staffFilter;
      let matchDate = true;
      if (dateFilter === "today") matchDate = w.date === todayStr;
      else if (dateFilter === "week") matchDate = w.date >= weekAgo;
      else if (dateFilter === "month") matchDate = w.date >= monthAgo;
      return matchStaff && matchDate;
    });
  }, [allWorklogs, dateFilter, staffFilter]);

  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));
  const totalHours = filtered.reduce((sum, w) => sum + w.hours, 0);

  const dailySummary = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((w) => map.set(w.date, (map.get(w.date) || 0) + w.hours));
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0])).slice(0, 7);
  }, [filtered]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Time Log</h1>
          <p className="text-sm text-muted-foreground">Track and manage time entries</p>
        </div>
        <button onClick={() => setShowLogModal(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Log Time
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium">Total Hours</span>
          </div>
          <p className="mt-1 text-2xl font-bold">{totalHours.toFixed(1)}h</p>
          <p className="text-xs text-muted-foreground">{filtered.length} entries</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-medium">Avg / Day</span>
          </div>
          <p className="mt-1 text-2xl font-bold">{dailySummary.length > 0 ? (totalHours / dailySummary.length).toFixed(1) : "0"}h</p>
          <p className="text-xs text-muted-foreground">across {dailySummary.length} days</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-xs font-medium">Daily Breakdown</span>
          </div>
          <div className="mt-2 flex items-end gap-1 h-8">
            {dailySummary.slice(0, 7).reverse().map(([date, hours]) => (
              <div key={date} className="flex-1 bg-primary/70 rounded-t" style={{ height: `${Math.min((hours / 10) * 100, 100)}%` }} title={`${date}: ${hours}h`} />
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex rounded-lg border overflow-hidden">
          {(["today", "week", "month", "all"] as const).map((period) => (
            <button key={period} onClick={() => setDateFilter(period)}
              className={cn("px-3 py-2 text-xs font-medium capitalize transition-colors", dateFilter === period ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>
              {period === "week" ? "This Week" : period === "month" ? "This Month" : period}
            </button>
          ))}
        </div>
        <select value={staffFilter} onChange={(e) => setStaffFilter(e.target.value)}
          className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Staff</option>
          {staffNames.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
      </div>

      {/* Time Entries Table */}
      <div className="rounded-lg border bg-card">
        <div className="divide-y">
          {sorted.map((w) => (
            <div key={w.id} className="flex items-center justify-between p-4 hover:bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2"><Clock className="h-4 w-4 text-primary" /></div>
                <div>
                  <p className="text-sm font-medium">{w.clientName}</p>
                  <p className="text-xs text-muted-foreground">{w.serviceName} · {w.note}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">by {w.userName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{w.hours}h</p>
                <p className="text-xs text-muted-foreground">{w.date}</p>
              </div>
            </div>
          ))}
          {sorted.length === 0 && <div className="p-8 text-center text-muted-foreground">No time entries match your filters.</div>}
        </div>
      </div>

      {showLogModal && <TimeLogFormModal onClose={() => setShowLogModal(false)} />}
    </div>
  );
}
