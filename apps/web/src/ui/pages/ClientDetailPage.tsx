import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useGetClientByIdQuery } from "@/store/api/clientApi";
import { useGetAssignmentsQuery } from "@/store/api/assignmentApi";
import { useAppSelector } from "@/store/hooks";
import { hasPermission } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { ArrowLeft, Building2, Phone, MapPin, Edit2, Mail, User } from "lucide-react";
import { ClientFormModal } from "@/ui/components/shared/ClientFormModal";

export function ClientDetailPage() {
  const { id } = useParams();
  const { permissions } = useAppSelector((state) => state.auth);
  const admin = hasPermission(permissions, "clients", "edit");
  const { data: client, isLoading } = useGetClientByIdQuery(id!);
  const { data: allAssignments = [] } = useGetAssignmentsQuery();
  const [showEdit, setShowEdit] = useState(false);

  const assignments = allAssignments.filter((a) => a.clientId === id);

  if (isLoading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  if (!client) return <div className="p-8 text-center text-muted-foreground">Client not found.</div>;

  return (
    <div className="space-y-6">
      <Link to="/clients" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Clients
      </Link>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold">{client.name}</h1>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{client.legalType}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{client.office}</span>
              <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{client.contactPerson}</span>
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{client.email}</span>
              <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{client.phone}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("rounded-full px-3 py-1 text-xs font-medium capitalize", client.status === "active" ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-100 text-gray-600 border")}>{client.status}</span>
            {client.groupName && <span className="rounded-full border px-3 py-1 text-xs font-medium">{client.groupName}</span>}
            {admin && (
              <button onClick={() => setShowEdit(true)} className="rounded-lg border p-2 hover:bg-muted">
                <Edit2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {client.pan && <div className="rounded-lg bg-muted/50 p-3"><p className="text-xs text-muted-foreground">PAN</p><p className="font-mono text-sm font-medium">{client.pan}</p></div>}
          {client.gstin && <div className="rounded-lg bg-muted/50 p-3"><p className="text-xs text-muted-foreground">GSTIN</p><p className="font-mono text-sm font-medium">{client.gstin}</p></div>}
          {client.tan && <div className="rounded-lg bg-muted/50 p-3"><p className="text-xs text-muted-foreground">TAN</p><p className="font-mono text-sm font-medium">{client.tan}</p></div>}
          {client.dateOfIncorporation && <div className="rounded-lg bg-muted/50 p-3"><p className="text-xs text-muted-foreground">Date of Incorporation</p><p className="text-sm font-medium">{client.dateOfIncorporation}</p></div>}
          {client.assignedPartnerName && <div className="rounded-lg bg-muted/50 p-3"><p className="text-xs text-muted-foreground">Assigned Partner</p><p className="text-sm font-medium">{client.assignedPartnerName}</p></div>}
        </div>
        {(client.registeredAddress || client.correspondenceAddress) && (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {client.registeredAddress && <div className="rounded-lg bg-muted/50 p-3"><p className="text-xs text-muted-foreground">Registered Address</p><p className="text-sm">{client.registeredAddress}</p></div>}
            {client.correspondenceAddress && <div className="rounded-lg bg-muted/50 p-3"><p className="text-xs text-muted-foreground">Correspondence Address</p><p className="text-sm">{client.correspondenceAddress}</p></div>}
          </div>
        )}
      </div>

      <div className="rounded-lg border bg-card">
        <div className="border-b p-4"><h2 className="font-semibold">Active Services ({client.services.length})</h2></div>
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {client.services.map((s) => <span key={s} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{s}</span>)}
            {client.services.length === 0 && <p className="text-sm text-muted-foreground">No services linked yet.</p>}
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="border-b p-4"><h2 className="font-semibold">Assignments ({assignments.length})</h2></div>
        <div className="divide-y">
          {assignments.map((a) => (
            <Link key={a.id} to={`/assignments/${a.id}`} className="flex items-center justify-between p-4 hover:bg-muted/50">
              <div>
                <p className="text-sm font-medium">{a.serviceName}</p>
                <p className="text-xs text-muted-foreground">{a.period} · {a.assigneeName}</p>
              </div>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={a.priority} />
                <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusColor(a.status))}>{a.status.replace(/_/g, " ")}</span>
              </div>
            </Link>
          ))}
          {assignments.length === 0 && <p className="p-4 text-sm text-muted-foreground">No assignments for this client.</p>}
        </div>
      </div>

      {showEdit && <ClientFormModal client={client} onClose={() => setShowEdit(false)} />}
    </div>
  );
}

function statusColor(status: string): string {
  const map: Record<string, string> = {
    not_started: "bg-gray-100 text-gray-700", in_progress: "bg-yellow-100 text-yellow-700",
    query_hold: "bg-red-100 text-red-700", completed: "bg-green-100 text-green-700",
    reviewed: "bg-purple-100 text-purple-700", waiting_for_info: "bg-orange-100 text-orange-700",
    billed: "bg-blue-100 text-blue-700",
  };
  return map[status] || "bg-gray-100 text-gray-700";
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = { high: "bg-red-100 text-red-700", medium: "bg-yellow-100 text-yellow-700", low: "bg-green-100 text-green-700" };
  return <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", styles[priority])}>{priority}</span>;
}
