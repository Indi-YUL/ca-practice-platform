import { useState } from "react";
import { useGetAppUsersQuery, useCreateAppUserMutation, useUpdateAppUserMutation } from "@/store/api/appUserApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updatePermissions } from "@/store/slices/authSlice";
import type { AppUserListItem } from "@/store/api/appUserApi";
import type { PermissionResource, UserPermissions, UserRole } from "@/domain/models";
import { DEFAULT_PASSWORD, FULL_PERMISSIONS, NO_PERMISSIONS } from "@/domain/models";
import { PERMISSION_LABELS } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { Plus, Shield, Edit2, X } from "lucide-react";

const RESOURCES: PermissionResource[] = ["clients", "staff", "services", "assignments"];

export function UserManagementPage() {
  const { isAdmin, accountId } = useAppSelector((state) => state.auth);
  const { data: appUsers = [], isLoading } = useGetAppUsersQuery(undefined, { skip: !isAdmin });
  const [editingUser, setEditingUser] = useState<AppUserListItem | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  if (!isAdmin) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <Shield className="mx-auto h-10 w-10 text-muted-foreground" />
        <h2 className="mt-3 text-lg font-semibold">Access Denied</h2>
        <p className="mt-1 text-sm text-muted-foreground">Only administrators can manage user accounts.</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-sm text-muted-foreground">Manage login accounts, admin access, and form permissions</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add User Account
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">User</th>
              <th className="px-4 py-3 text-left font-medium">Username</th>
              <th className="px-4 py-3 text-left font-medium">Role</th>
              <th className="px-4 py-3 text-left font-medium">Admin</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Permissions</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {appUsers.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{user.username}</td>
                <td className="px-4 py-3 capitalize">{user.role}</td>
                <td className="px-4 py-3">
                  {user.isAdmin ? (
                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">Admin</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", user.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600")}>
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <PermissionSummary permissions={user.permissions} />
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditingUser(user)} className="rounded-lg p-2 hover:bg-muted">
                    <Edit2 className="h-4 w-4 text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <UserAccountModal
          user={editingUser}
          currentAccountId={accountId}
          onClose={() => setEditingUser(null)}
        />
      )}
      {showCreate && <CreateUserAccountModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}

function PermissionSummary({ permissions }: { permissions: UserPermissions }) {
  const enabled = RESOURCES.filter((r) => permissions[r].create || permissions[r].edit);
  if (enabled.length === 0) return <span className="text-xs text-muted-foreground">View only</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {enabled.map((r) => (
        <span key={r} className="rounded bg-muted px-1.5 py-0.5 text-xs">{PERMISSION_LABELS[r]}</span>
      ))}
    </div>
  );
}

function PermissionsEditor({
  permissions,
  onChange,
}: {
  permissions: UserPermissions;
  onChange: (p: UserPermissions) => void;
}) {
  function toggle(resource: PermissionResource, action: "create" | "edit") {
    onChange({
      ...permissions,
      [resource]: { ...permissions[resource], [action]: !permissions[resource][action] },
    });
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Form Permissions</p>
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/30">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Module</th>
              <th className="px-3 py-2 text-center font-medium">Add</th>
              <th className="px-3 py-2 text-center font-medium">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {RESOURCES.map((resource) => (
              <tr key={resource}>
                <td className="px-3 py-2">{PERMISSION_LABELS[resource]}</td>
                <td className="px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={permissions[resource].create}
                    onChange={() => toggle(resource, "create")}
                    className="h-4 w-4 rounded border"
                  />
                </td>
                <td className="px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={permissions[resource].edit}
                    onChange={() => toggle(resource, "edit")}
                    className="h-4 w-4 rounded border"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserAccountModal({
  user,
  currentAccountId,
  onClose,
}: {
  user: AppUserListItem;
  currentAccountId: string | null;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const [updateAppUser, { isLoading }] = useUpdateAppUserMutation();
  const [username, setUsername] = useState(user.username);
  const [isAdmin, setIsAdmin] = useState(user.isAdmin);
  const [status, setStatus] = useState(user.status);
  const [permissions, setPermissions] = useState<UserPermissions>(user.permissions);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSave() {
    setError("");
    try {
      const patch: Record<string, unknown> = { username, isAdmin, status, permissions };
      if (newPassword) patch.password = newPassword;

      const updated = await updateAppUser({ id: user.id, patch }).unwrap();
      if (user.id === currentAccountId) {
        dispatch(updatePermissions({ permissions: updated.permissions, isAdmin: updated.isAdmin }));
      }
      onClose();
    } catch {
      setError("Failed to update user. Username may already exist.");
    }
  }

  return (
    <Modal title={`Edit Account — ${user.name}`} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} className="h-4 w-4 rounded border" />
            Administrator (can manage users)
          </label>
          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
              className="rounded-lg border bg-background px-3 py-2 text-sm">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <PermissionsEditor permissions={permissions} onChange={setPermissions} />

        <div>
          <label className="mb-1.5 block text-sm font-medium">Reset Password (optional)</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
            minLength={8}
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="mt-1 text-xs text-muted-foreground">Minimum 8 characters if changing</p>
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={() => setPermissions(FULL_PERMISSIONS)} className="text-xs text-primary hover:underline">Grant all</button>
          <button type="button" onClick={() => setPermissions(NO_PERMISSIONS)} className="text-xs text-muted-foreground hover:underline">Revoke all</button>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end gap-2 border-t pt-4">
          <button onClick={onClose} className="rounded-lg border px-4 py-2 text-sm hover:bg-muted">Cancel</button>
          <button onClick={handleSave} disabled={isLoading} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function CreateUserAccountModal({ onClose }: { onClose: () => void }) {
  const [createAppUser, { isLoading }] = useCreateAppUserMutation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "staff" as UserRole,
    office: "Mehsana",
    department: "Income Tax & TDS",
    username: "",
    password: DEFAULT_PASSWORD,
    isAdmin: false,
  });
  const [permissions, setPermissions] = useState<UserPermissions>(NO_PERMISSIONS);
  const [error, setError] = useState("");

  function handleNameChange(name: string) {
    const suggested = name.toLowerCase().replace(/^ca\s+/i, "").replace(/\s+/g, ".");
    setForm((f) => ({ ...f, name, username: f.username || suggested }));
  }

  async function handleCreate() {
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.username.trim()) {
      setError("Name, email, and username are required.");
      return;
    }
    try {
      await createAppUser({
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        office: form.office,
        department: form.department,
        username: form.username.trim(),
        password: form.password,
        isAdmin: form.isAdmin,
        permissions,
      }).unwrap();
      onClose();
    } catch {
      setError("Failed to create account. Username may already exist.");
    }
  }

  return (
    <Modal title="Add User Account" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Create a user account first. They can be added to the Staff directory later.
        </p>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Full Name *</label>
          <input
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Priya Sharma"
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="name@cjca.in"
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm">
              <option value="partner">Partner</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
              <option value="trainee">Trainee</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Office</label>
            <select value={form.office} onChange={(e) => setForm({ ...form, office: e.target.value })}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm">
              <option value="Mehsana">Mehsana</option>
              <option value="Ahmedabad">Ahmedabad</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Department</label>
            <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm">
              <option value="Income Tax & TDS">Income Tax & TDS</option>
              <option value="Auditing & Certification">Auditing & Certification</option>
              <option value="GST & Consultancy">GST & Consultancy</option>
              <option value="Accounting">Accounting</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Username *</label>
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="firstname.lastname"
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Default Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            minLength={8}
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="mt-1 text-xs text-muted-foreground">Minimum 8 characters. User can change after login.</p>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isAdmin} onChange={(e) => setForm({ ...form, isAdmin: e.target.checked })} className="h-4 w-4 rounded border" />
          Administrator (can manage users)
        </label>

        <PermissionsEditor permissions={permissions} onChange={setPermissions} />

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end gap-2 border-t pt-4">
          <button onClick={onClose} className="rounded-lg border px-4 py-2 text-sm hover:bg-muted">Cancel</button>
          <button onClick={handleCreate} disabled={isLoading} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            {isLoading ? "Creating..." : "Create Account"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-muted"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
