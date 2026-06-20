import { useAppSelector } from "@/store/hooks";
import { useGetAssignmentsQuery } from "@/store/api/assignmentApi";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { AlertCircle, CheckCircle2, Clock, TrendingUp, ArrowRight } from "lucide-react";

export function DashboardPage() {
  const { currentUser } = useAppSelector((state) => state.auth);
  const { data: assignments = [] } = useGetAssignmentsQuery();

  const today = new Date().toISOString().split("T")[0];
  const overdue = assignments.filter((a) => a.dueDate < today && !["completed", "reviewed", "billed"].includes(a.status));
  const active = assignments.filter((a) => !["completed", "reviewed", "billed"].includes(a.status));
  const completed = assignments.filter((a) => ["completed", "reviewed", "billed"].includes(a.status));
  const inProgress = assignments.filter((a) => a.status === "in_progress");

  if (currentUser.role === "staff" || currentUser.role === "trainee") {
    const myAssignments = assignments.filter((a) => a.assigneeId === currentUser.id);
    const myOverdue = myAssignments.filter((a) => a.dueDate < today && !["completed", "reviewed", "billed"].includes(a.status));
    const myActive = myAssignments.filter((a) => !["completed", "reviewed", "billed"].includes(a.status));
    const myCompleted = myAssignments.filter((a) => ["completed", "reviewed", "billed"].includes(a.status));
    const myHoursThisMonth = myAssignments.flatMap((a) => a.worklogs).filter((w) => w.userId === currentUser.id && w.date.startsWith(today.slice(0, 7))).reduce((sum, w) => sum + w.hours, 0);

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {currentUser.name.split(" ")[0]}</h1>
          <p className="text-muted-foreground">Here's your work summary</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard title="My Active" value={myActive.length} icon={Clock} color="blue" />
          <StatCard title="Overdue" value={myOverdue.length} icon={AlertCircle} color="red" />
          <StatCard title="Completed" value={myCompleted.length} icon={CheckCircle2} color="green" />
          <StatCard title="Hours (Month)" value={myHoursThisMonth} icon={TrendingUp} color="yellow" />
        </div>

        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="font-semibold">My Tasks</h2>
            <Link to="/assignments" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y">
            {myActive.slice(0, 5).map((a) => (
              <Link key={a.id} to={`/assignments/${a.id}`} className="flex items-center justify-between p-4 hover:bg-muted/50">
                <div>
                  <p className="text-sm font-medium">{a.clientName}</p>
                  <p className="text-xs text-muted-foreground">{a.serviceName} · {a.period}</p>
                </div>
                <div className="text-right">
                  <PriorityBadge priority={a.priority} />
                  <p className={cn("text-xs mt-1", a.dueDate < today ? "text-red-500 font-medium" : "text-muted-foreground")}>
                    Due: {a.dueDate}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Partner / Manager Dashboard
  const departments = ["Income Tax & TDS", "Auditing & Certification", "GST & Consultancy", "Accounting"];
  const deptStats = departments.map((dept) => ({
    department: dept,
    count: active.filter((a) => {
      const service = a.serviceName.toLowerCase();
      if (dept === "Income Tax & TDS") return service.includes("tax") || service.includes("tds");
      if (dept === "Auditing & Certification") return service.includes("audit") || service.includes("certif");
      if (dept === "GST & Consultancy") return service.includes("gst") || service.includes("advisory") || service.includes("fema");
      return service.includes("accounting") || service.includes("book");
    }).length,
  }));

  const staffWorkload = [
    { name: "Meera Joshi", id: "u10" },
    { name: "Rahul Trivedi", id: "u7" },
    { name: "Vishal Shah", id: "u9" },
    { name: "Pooja Bhatt", id: "u8" },
    { name: "Darshan Prajapati", id: "u11" },
  ].map((s) => ({
    ...s,
    pending: assignments.filter((a) => a.assigneeId === s.id && !["completed", "reviewed", "billed"].includes(a.status)).length,
    completed: assignments.filter((a) => a.assigneeId === s.id && ["completed", "reviewed", "billed"].includes(a.status)).length,
  }));

  const completionRate = assignments.length > 0
    ? Math.round((completed.length / assignments.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Practice Overview</h1>
        <p className="text-muted-foreground">
          {currentUser.role === "partner" ? "Firm-wide summary" : "Team summary"} · {currentUser.office}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Active Work" value={active.length} icon={Clock} color="blue" />
        <StatCard title="In Progress" value={inProgress.length} icon={TrendingUp} color="yellow" />
        <StatCard title="Overdue" value={overdue.length} icon={AlertCircle} color="red" />
        <StatCard title="Completion Rate" value={`${completionRate}%`} icon={CheckCircle2} color="green" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card">
          <div className="border-b p-4">
            <h2 className="font-semibold">Pending by Department</h2>
          </div>
          <div className="p-4 space-y-3">
            {deptStats.map((d) => (
              <div key={d.department} className="flex items-center justify-between">
                <span className="text-sm">{d.department}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 rounded-full bg-primary/20 w-24">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.min((d.count / Math.max(active.length, 1)) * 100, 100)}%` }} />
                  </div>
                  <span className="text-sm font-medium w-6 text-right">{d.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="border-b p-4">
            <h2 className="font-semibold">Staff Workload</h2>
          </div>
          <div className="p-4 space-y-3">
            {staffWorkload.map((s) => (
              <Link key={s.id} to={`/staff/${s.id}`} className="flex items-center justify-between hover:bg-muted/50 rounded-lg p-1 -mx-1">
                <span className="text-sm">{s.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{s.completed} done</span>
                  <span className={cn("text-sm font-medium rounded-full px-2 py-0.5", s.pending > 2 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700")}>
                    {s.pending} pending
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {overdue.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50">
          <div className="flex items-center gap-2 border-b border-red-200 p-4">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <h2 className="font-semibold text-red-700">Overdue Items ({overdue.length})</h2>
          </div>
          <div className="divide-y divide-red-100">
            {overdue.map((a) => (
              <Link key={a.id} to={`/assignments/${a.id}`} className="flex items-center justify-between p-4 hover:bg-red-100/50">
                <div>
                  <p className="text-sm font-medium">{a.clientName}</p>
                  <p className="text-xs text-red-600">{a.serviceName} · {a.period}</p>
                </div>
                <div className="text-right">
                  <PriorityBadge priority={a.priority} />
                  <p className="text-xs text-red-600 font-medium mt-1">Due: {a.dueDate}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: number | string; icon: React.ElementType; color: string }) {
  const colors = { blue: "bg-blue-50 text-blue-600", red: "bg-red-50 text-red-600", green: "bg-green-50 text-green-600", yellow: "bg-yellow-50 text-yellow-600" };
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className={cn("rounded-lg p-2", colors[color as keyof typeof colors])}><Icon className="h-4 w-4" /></div>
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = { high: "bg-red-100 text-red-700", medium: "bg-yellow-100 text-yellow-700", low: "bg-green-100 text-green-700" };
  return <span className={cn("inline-block rounded-full px-2 py-0.5 text-xs font-medium", styles[priority])}>{priority}</span>;
}
