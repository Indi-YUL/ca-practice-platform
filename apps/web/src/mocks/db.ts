import type { Assignment, ServiceMaster } from "@/domain/models";
import type { Staff } from "@/domain/models";
import { users } from "./users";
import { clients } from "./clients";
import { services } from "./services";
import { assignments as seedAssignments } from "./assignments";

const STORAGE_KEYS = {
  staff: "cj_staff",
  clients: "cj_clients",
  services: "cj_services",
  assignments: "cj_assignments",
} as const;

function get<T>(key: string, seed: T[]): T[] {
  const stored = localStorage.getItem(key);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}

function set<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Staff seed — extend users with extra fields
const staffSeed: Staff[] = users.map((u) => ({
  ...u,
  phone: `98765${String(Math.floor(10000 + Math.random() * 90000))}`,
  dateOfJoining: u.role === "partner" ? "2010-04-01" : u.role === "manager" ? "2016-06-15" : u.role === "staff" ? "2020-01-10" : "2024-07-01",
  status: "active" as const,
}));

export const db = {
  staff: {
    getAll: (): Staff[] => get(STORAGE_KEYS.staff, staffSeed),
    getById: (id: string): Staff | undefined => db.staff.getAll().find((s) => s.id === id),
    create: (item: Staff) => { const all = db.staff.getAll(); all.push(item); set(STORAGE_KEYS.staff, all); return item; },
    update: (id: string, patch: Partial<Staff>) => {
      const all = db.staff.getAll();
      const idx = all.findIndex((s) => s.id === id);
      if (idx === -1) return null;
      all[idx] = { ...all[idx], ...patch };
      set(STORAGE_KEYS.staff, all);
      return all[idx];
    },
    delete: (id: string) => { const all = db.staff.getAll().filter((s) => s.id !== id); set(STORAGE_KEYS.staff, all); },
  },
  clients: {
    getAll: () => get(STORAGE_KEYS.clients, clients),
    getById: (id: string) => db.clients.getAll().find((c) => c.id === id),
  },
  services: {
    getAll: (): ServiceMaster[] => get(STORAGE_KEYS.services, services.map((s) => ({ ...s, description: "", clientCount: Math.floor(Math.random() * 50) + 5, status: "active" as const }))),
    getById: (id: string) => db.services.getAll().find((s) => s.id === id),
    create: (item: ServiceMaster) => { const all = db.services.getAll(); all.push(item); set(STORAGE_KEYS.services, all); return item; },
    update: (id: string, patch: Partial<ServiceMaster>) => {
      const all = db.services.getAll();
      const idx = all.findIndex((s) => s.id === id);
      if (idx === -1) return null;
      all[idx] = { ...all[idx], ...patch };
      set(STORAGE_KEYS.services, all);
      return all[idx];
    },
  },
  assignments: {
    getAll: (): Assignment[] => get(STORAGE_KEYS.assignments, seedAssignments),
    getById: (id: string) => db.assignments.getAll().find((a) => a.id === id),
    update: (id: string, patch: Partial<Assignment>) => {
      const all = db.assignments.getAll();
      const idx = all.findIndex((a) => a.id === id);
      if (idx === -1) return null;
      all[idx] = { ...all[idx], ...patch };
      set(STORAGE_KEYS.assignments, all);
      return all[idx];
    },
  },
};
