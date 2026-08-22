import { useState } from "react";
import { useGetServicesQuery, useCreateServiceMutation, useUpdateServiceMutation } from "@/store/api/serviceApi";
import { useAppSelector } from "@/store/hooks";
import { hasPermission } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { Plus, X, Edit2, Layers } from "lucide-react";
import type { ServiceMaster } from "@/domain/models";

const CATEGORIES = ["Audit", "Tax", "GST", "Accounting", "Certification", "Consultancy"];
const FREQUENCIES = ["monthly", "quarterly", "annual", "one_time"] as const;
const FREQUENCY_LABELS: Record<typeof FREQUENCIES[number], string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  annual: "Annual",
  one_time: "One-Time",
};
const DEPARTMENTS = ["Income Tax & TDS", "Auditing & Certification", "GST & Consultancy", "Accounting"];

export function ServiceMasterPage() {
  const { permissions } = useAppSelector((state) => state.auth);
  const canCreate = hasPermission(permissions, "services", "create");
  const canEdit = hasPermission(permissions, "services", "edit");
  const { data: services = [], isLoading } = useGetServicesQuery();
  const [createService] = useCreateServiceMutation();
  const [updateService] = useUpdateServiceMutation();
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<ServiceMaster | null>(null);
  const [filterCategory, setFilterCategory] = useState("all");

  const activeServices = services.filter((s) => s.status === "active");
  const filtered = filterCategory === "all" ? activeServices : activeServices.filter((s) => s.category === filterCategory);
  const grouped = CATEGORIES.map((cat) => ({
    category: cat,
    items: filtered.filter((s) => s.category === cat),
  })).filter((g) => g.items.length > 0);

  function handleEdit(service: ServiceMaster) {
    setEditingService(service);
    setShowForm(true);
  }

  if (isLoading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Service Master</h1>
          <p className="text-sm text-muted-foreground">{activeServices.length} services across {CATEGORIES.length} categories</p>
        </div>
        {canCreate && (
          <button onClick={() => { setEditingService(null); setShowForm(true); }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Add Service
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilterCategory("all")}
          className={cn("rounded-full px-3 py-1.5 text-xs font-medium border transition-colors", filterCategory === "all" ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted")}>
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setFilterCategory(cat)}
            className={cn("rounded-full px-3 py-1.5 text-xs font-medium border transition-colors", filterCategory === cat ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted")}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grouped List */}
      {grouped.map((group) => (
        <div key={group.category} className="rounded-lg border bg-card">
          <div className="flex items-center gap-2 border-b p-4">
            <Layers className="h-4 w-4 text-primary" />
            <h2 className="font-semibold">{group.category}</h2>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{group.items.length}</span>
          </div>
          <div className="divide-y">
            {group.items.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium">{service.name}</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{FREQUENCY_LABELS[service.frequency] ?? service.frequency}</span>
                    <span className="text-xs text-muted-foreground">{service.department}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">{service.clientCount}</p>
                    <p className="text-xs text-muted-foreground">clients</p>
                  </div>
                  {canEdit && (
                    <button onClick={() => handleEdit(service)} className="rounded-lg p-2 hover:bg-muted">
                      <Edit2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="rounded-lg border p-8 text-center">
          <Layers className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <p className="mt-2 text-muted-foreground">No services in this category.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <ServiceFormModal
          service={editingService}
          onClose={() => { setShowForm(false); setEditingService(null); }}
          onCreate={async (data) => { await createService(data).unwrap(); setShowForm(false); }}
          onUpdate={async (id, data) => { await updateService({ id, patch: data }).unwrap(); setShowForm(false); setEditingService(null); }}
        />
      )}
    </div>
  );
}

function ServiceFormModal({ service, onClose, onCreate, onUpdate }: {
  service: ServiceMaster | null;
  onClose: () => void;
  onCreate: (data: Partial<ServiceMaster>) => Promise<void>;
  onUpdate: (id: string, data: Partial<ServiceMaster>) => Promise<void>;
}) {
  const [form, setForm] = useState({
    name: service?.name || "",
    category: service?.category || "Audit",
    frequency: (service?.frequency === ("occasional" as string) ? "one_time" : service?.frequency) || ("annual" as typeof FREQUENCIES[number]),
    department: service?.department || "Auditing & Certification",
    description: service?.description || "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true);
    if (service) {
      await onUpdate(service.id, form);
    } else {
      await onCreate(form);
    }
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-xl border bg-card p-6 shadow-lg mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{service ? "Edit Service" : "Add Service"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Service Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. Internal Audit" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Category</label>
              <p className="text-xs text-muted-foreground mt-0.5">Groups services for filtering and reporting (Audit, Tax, GST, etc.)</p>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Frequency</label>
              <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value as typeof FREQUENCIES[number] })}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {FREQUENCIES.map((f) => <option key={f} value={f}>{FREQUENCY_LABELS[f]}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Department</label>
            <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" rows={2} placeholder="Brief description..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              {saving ? "Saving..." : service ? "Update" : "Add Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
