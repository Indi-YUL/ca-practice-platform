import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetClientsQuery } from "@/store/api/clientApi";
import { useAppSelector } from "@/store/hooks";
import { isAdmin } from "@/store/slices/authSlice";
import { cn } from "@/lib/utils";
import { Search, Plus } from "lucide-react";
import { ClientFormModal } from "@/ui/components/shared/ClientFormModal";

export function ClientsPage() {
  const { currentUser } = useAppSelector((state) => state.auth);
  const { data: clients = [], isLoading } = useGetClientsQuery();
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const admin = isAdmin(currentUser);

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.pan?.toLowerCase().includes(search.toLowerCase()) ||
      c.gstin?.toLowerCase().includes(search.toLowerCase()) ||
      c.contactPerson?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-sm text-muted-foreground">{clients.length} total clients</p>
        </div>
        {admin && (
          <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Add Client
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search by name, PAN, GSTIN, or contact..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border bg-background py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Client Name</th>
              <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Type</th>
              <th className="px-4 py-3 text-left font-medium hidden md:table-cell">PAN</th>
              <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Office</th>
              <th className="px-4 py-3 text-right font-medium">Services</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((client) => (
              <tr key={client.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <Link to={`/clients/${client.id}`} className="font-medium text-primary hover:underline">
                    {client.name}
                  </Link>
                  <p className="text-xs text-muted-foreground sm:hidden">{client.legalType}</p>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{client.legalType}</span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell font-mono text-xs">{client.pan || "—"}</td>
                <td className="px-4 py-3 hidden lg:table-cell">{client.office}</td>
                <td className="px-4 py-3 text-right">
                  <span className={cn("text-sm font-medium", client.services.length > 3 ? "text-primary" : "")}>
                    {client.services.length}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">No clients match your search.</div>
        )}
      </div>

      {showAddModal && <ClientFormModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
