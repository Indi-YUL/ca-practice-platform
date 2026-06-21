import { useParams, Link } from "react-router-dom";
import { useGetStaffByIdQuery } from "@/store/api/staffApi";
import { useGetAssignmentsQuery } from "@/store/api/assignmentApi";
import { cn, formatDate } from "@/lib/utils";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase } from "lucide-react";

export function StaffDetailPage() {
  const { id } = useParams();
  const { data: member, isLoading } = useGetStaffByIdQuery(id!);
  const { data: assignments = [] } = useGetAssignmentsQuery();

  if (isLoading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  if (!member) return <div className="p-8 text-center text-muted-foreground">Staff member not found.</div>;

  const memberAssignments = assignments.filter((a) => a.assigneeId === id);
  const active = memberAssignments.filter((a) => !["completed", "reviewed", "billed"].includes(a.status));
  const completed = memberAssignments.filter((a) => ["completed", "reviewed", "billed"].includes(a.status));
  const totalHours = memberAssignments.flatMap((a) => a.worklogs).filter((w) => w.userId === id).reduce((sum, w) => sum + w.hours, 0);

  return (
    <div className="space-y-6">
      <Link to="/staff" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Staff
      </Link>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <span className="text-xl font-bold text-primary">
              {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{member.name}</h1>
            <span className={cn("mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium", roleBadge(member.role))}>
              {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
            </span>
            <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              <span className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" />{member.email}</span>
              <span className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{member.phone}</span>
              <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{member.office} Office</span>
              <span className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" />Joined {formatDate(member.dateOfJoining)}</span>
            </div>
            <div className="mt-3">
              <p className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1"><Briefcase className="h-3 w-3" /> Departments</p>
              <div className="flex flex-wrap gap-1.5">
                {(member.departments || [member.department]).map((d) => (
                  <span key={d} className="rounded-full bg-muted px-2.5 py-0.5 text-xs">{d}</span>
                ))}
              </div>
            </div>
            {member.services && member.services.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Services</p>
                <div className="flex flex-wrap gap-1.5">
                  {member.services.map((s) => (
                    <span key={s} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-primary">{active.length}</p>
          <p className="text-xs text-muted-foreground">Active Tasks</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{completed.length}</p>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
        <div className="rounded-lg border bg-card p-4 text-center">
          <p className="text-2xl font-bold">{totalHours}h</p>
          <p className="text-xs text-muted-foreground">Hours Logged</p>
        </div>
      </div>

      {/* Active Assignments */}
      <div className="rounded-lg border bg-card">
        <div className="border-b p-4">
          <h2 className="font-semibold">Active Assignments ({active.length})</h2>
        </div>
        <div className="divide-y">
          {active.map((a) => (
            <Link key={a.id} to={`/assignments/${a.id}`} className="flex items-center justify-between p-4 hover:bg-muted/50">
              <div>
                <p className="text-sm font-medium">{a.clientName}</p>
                <p className="text-xs text-muted-foreground">{a.serviceName} · {a.period}</p>
              </div>
              <div className="text-right">
                <PriorityBadge priority={a.priority} />
                <p className="mt-1 text-xs text-muted-foreground">Due: {a.dueDate}</p>
              </div>
            </Link>
          ))}
          {active.length === 0 && <p className="p-4 text-sm text-muted-foreground">No active assignments.</p>}
        </div>
      </div>
    </div>
  );
}

function roleBadge(role: string): string {
  const map: Record<string, string> = { partner: "bg-purple-100 text-purple-700", manager: "bg-blue-100 text-blue-700", staff: "bg-green-100 text-green-700", trainee: "bg-yellow-100 text-yellow-700" };
  return map[role] || "bg-gray-100 text-gray-700";
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = { high: "bg-red-100 text-red-700", medium: "bg-yellow-100 text-yellow-700", low: "bg-green-100 text-green-700" };
  return <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", styles[priority])}>{priority}</span>;
}
