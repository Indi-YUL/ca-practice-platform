import type { PermissionResource, UserPermissions } from "@/domain/models";

export function hasPermission(
  permissions: UserPermissions | null,
  resource: PermissionResource,
  action: "create" | "edit",
): boolean {
  if (!permissions) return false;
  return permissions[resource][action];
}

export const PERMISSION_LABELS: Record<PermissionResource, string> = {
  clients: "Clients",
  staff: "Staff",
  services: "Services",
  assignments: "Assignments",
};
