import { useParams, Link } from "react-router-dom";
import { clients } from "@/mocks/clients";
import { useAppSelector } from "@/store/hooks";
import { ArrowLeft, Building2, Phone, MapPin } from "lucide-react";

export function ClientDetailPage() {
  const { id } = useParams();
  const client = clients.find((c) => c.id === id);
  const assignments = useAppSelector((state) => state.assignments.items.filter((a) => a.clientId === id));

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
              <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{client.contactPerson}</span>
            </div>
          </div>
          {client.groupName && (
            <span className="rounded-full border px-3 py-1 text-xs font-medium">{client.groupName}</span>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {client.pan && (
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">PAN</p>
              <p className="font-mono text-sm font-medium">{client.pan}</p>
            </div>
          )}
          {client.gstin && (
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">GSTIN</p>
              <p className="font-mono text-sm font-medium">{client.gstin}</p>
            </div>
          )}
        </div>
      </div>

      {/* Services */}
      <div className="rounded-lg border bg-card">
        <div className="border-b p-4">
          <h2 className="font-semibold">Active Services ({client.services.length})</h2>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {client.services.map((s) => (
              <span key={s} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Assignments */}
      <div className="rounded-lg border bg-card">
        <div className="border-b p-4">
          <h2 className="font-semibold">Assignments ({assignments.length})</h2>
        </div>
        <div className="divide-y">
          {assignments.map((a) => (
            <Link key={a.id} to={`/assignments/${a.id}`} className="flex items-center justify-between p-4 hover:bg-muted/50">
              <div>
                <p className="text-sm font-medium">{a.serviceName}</p>
                <p className="text-xs text-muted-foreground">{a.period} · {a.assigneeName}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(a.status)}`}>
                {a.status.replace(/_/g, " ")}
              </span>
            </Link>
          ))}
          {assignments.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground">No assignments for this client.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function statusColor(status: string): string {
  const map: Record<string, string> = {
    assigned: "bg-blue-100 text-blue-700",
    in_progress: "bg-yellow-100 text-yellow-700",
    query_raised: "bg-red-100 text-red-700",
    under_review: "bg-purple-100 text-purple-700",
    completed: "bg-green-100 text-green-700",
    waiting_for_info: "bg-orange-100 text-orange-700",
  };
  return map[status] || "bg-gray-100 text-gray-700";
}
