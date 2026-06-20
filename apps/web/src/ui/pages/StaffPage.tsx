import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetStaffQuery } from "@/store/api/staffApi";
import { cn } from "@/lib/utils";
import { Search, Plus, Users, Filter } from "lucide-react";
import { StaffFormModal } from "@/ui/components/shared/StaffFormModal";
import type { UserRole } from "@/domain/models";

const ROLE_OPTIONS: ("all" | UserRole)[] = ["all", "partner", "manager", "staff", "trainee"];
const DEPT_OPTIONS = ["all", "Income Tax & TDS", "Auditing & Certification", "GST & Consultancy", "Accounting"];

export function StaffPage() {
  const { data: staff = [], isLoading } = useGetStaffQuery();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const activeStaff = staff.filter((s) => s.status === "active");
  const filtered = activeStaff.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || s.role === roleFilter;
    const matchesDept = deptFilter === "all" || s.department === deptFilter;
    return matchesSearch && matchesRole && matchesDept;
  });

  if (isLoading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Staff Directory</h1>
          <p className="text-sm text-muted-foreground">{activeStaff.length} active members across 2 offices</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Add Staff
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="search" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border bg-background py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r === "all" ? "All Roles" : r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
          </select>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
            className="rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring hidden md:block">
            {DEPT_OPTIONS.map((d) => <option key={d} value={d}>{d === "all" ? "All Departments" : d}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((member) => (
          <Link key={member.id} to={`/staff/${member.id}`}
            className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <span className="text-sm font-semibold text-primary">
                  {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{member.name}</p>
                <p className="text-xs text-muted-foreground truncate">{member.email}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", roleBadge(member.role))}>
                {member.role}
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{member.office}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{member.department}</p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-lg border p-8 text-center">
          <Users className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <p className="mt-2 text-muted-foreground">No staff match your filters.</p>
        </div>
      )}

      {showAddModal && <StaffFormModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}

function roleBadge(role: string): string {
  const map: Record<string, string> = {
    partner: "bg-purple-100 text-purple-700",
    manager: "bg-blue-100 text-blue-700",
    staff: "bg-green-100 text-green-700",
    trainee: "bg-yellow-100 text-yellow-700",
  };
  return map[role] || "bg-gray-100 text-gray-700";
}
