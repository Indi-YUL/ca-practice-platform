import { useState } from "react";
import { useCreateClientMutation, useUpdateClientMutation } from "@/store/api/clientApi";
import type { Client } from "@/domain/models";
import { X } from "lucide-react";

const ENTITY_TYPES = ["Individual", "Proprietorship", "Partnership", "LLP", "Pvt Ltd", "Trust", "Co-op Society", "HUF"];
const SERVICES_LIST = ["Statutory Audit", "Tax Audit", "Internal Audit", "Trust Audit", "Income Tax Return", "TDS Return", "GST Return", "Accounting & Book-keeping", "Certification (80G/12A)", "FEMA Advisory"];

interface Props {
  client?: Client | null;
  onClose: () => void;
}

export function ClientFormModal({ client, onClose }: Props) {
  const [createClient, { isLoading: creating }] = useCreateClientMutation();
  const [updateClient, { isLoading: updating }] = useUpdateClientMutation();
  const isEditing = !!client;

  const [form, setForm] = useState({
    name: client?.name || "",
    legalType: client?.legalType || "Pvt Ltd",
    pan: client?.pan || "",
    gstin: client?.gstin || "",
    office: client?.office || "Mehsana",
    contactPerson: client?.contactPerson || "",
    phone: client?.phone || "",
    groupName: client?.groupName || "",
    services: client?.services || [] as string[],
  });
  const [error, setError] = useState("");

  function toggleService(service: string) {
    setForm((f) => ({
      ...f,
      services: f.services.includes(service) ? f.services.filter((s) => s !== service) : [...f.services, service],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.contactPerson || !form.phone) {
      setError("Please fill all required fields.");
      return;
    }
    if (form.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.pan)) {
      setError("Invalid PAN format (e.g., ABCDE1234F).");
      return;
    }
    try {
      if (isEditing) {
        await updateClient({ id: client!.id, patch: form }).unwrap();
      } else {
        await createClient(form).unwrap();
      }
      onClose();
    } catch {
      setError("Failed to save client.");
    }
  }

  const saving = creating || updating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border bg-card p-6 shadow-lg mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{isEditing ? "Edit Client" : "Add Client"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Client / Entity Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. Shreeji Industries Pvt Ltd" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Entity Type</label>
              <select value={form.legalType} onChange={(e) => setForm({ ...form, legalType: e.target.value })}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {ENTITY_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Office</label>
              <select value={form.office} onChange={(e) => setForm({ ...form, office: e.target.value })}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Mehsana</option>
                <option>Ahmedabad</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">PAN</label>
              <input type="text" value={form.pan} onChange={(e) => setForm({ ...form, pan: e.target.value.toUpperCase() })}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring" placeholder="ABCDE1234F" maxLength={10} />
            </div>
            <div>
              <label className="text-sm font-medium">GSTIN</label>
              <input type="text" value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value.toUpperCase() })}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring" placeholder="24ABCDE1234F1Z5" maxLength={15} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Contact Person *</label>
              <input type="text" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Full name" />
            </div>
            <div>
              <label className="text-sm font-medium">Phone *</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="9876543210" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Group Name (optional)</label>
            <input type="text" value={form.groupName} onChange={(e) => setForm({ ...form, groupName: e.target.value })}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. Shreeji Group" />
          </div>

          <div>
            <label className="text-sm font-medium">Services</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {SERVICES_LIST.map((s) => (
                <button key={s} type="button" onClick={() => toggleService(s)}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${form.services.includes(s) ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              {saving ? "Saving..." : isEditing ? "Update Client" : "Add Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
