import type { AppUserAccount } from "@/domain/models";
import { DEFAULT_PASSWORD, FULL_PERMISSIONS, MANAGER_PERMISSIONS, NO_PERMISSIONS } from "@/domain/models";

export const authAccountsSeed: AppUserAccount[] = [
  { id: "acc1", userId: "u1", username: "rajesh.chauhan", password: DEFAULT_PASSWORD, isAdmin: true, permissions: FULL_PERMISSIONS, status: "active" },
  { id: "acc2", userId: "u2", username: "nilesh.jain", password: DEFAULT_PASSWORD, isAdmin: true, permissions: FULL_PERMISSIONS, status: "active" },
  { id: "acc3", userId: "u3", username: "amit.patel", password: DEFAULT_PASSWORD, isAdmin: true, permissions: FULL_PERMISSIONS, status: "active" },
  { id: "acc4", userId: "u4", username: "priya.sharma", password: DEFAULT_PASSWORD, isAdmin: false, permissions: MANAGER_PERMISSIONS, status: "active" },
  { id: "acc5", userId: "u5", username: "ketan.mehta", password: DEFAULT_PASSWORD, isAdmin: false, permissions: MANAGER_PERMISSIONS, status: "active" },
  { id: "acc6", userId: "u6", username: "sneha.desai", password: DEFAULT_PASSWORD, isAdmin: false, permissions: MANAGER_PERMISSIONS, status: "active" },
  { id: "acc7", userId: "u7", username: "rahul.trivedi", password: DEFAULT_PASSWORD, isAdmin: false, permissions: NO_PERMISSIONS, status: "active" },
  { id: "acc8", userId: "u8", username: "pooja.bhatt", password: DEFAULT_PASSWORD, isAdmin: false, permissions: NO_PERMISSIONS, status: "active" },
  { id: "acc9", userId: "u9", username: "vishal.shah", password: DEFAULT_PASSWORD, isAdmin: false, permissions: NO_PERMISSIONS, status: "active" },
  { id: "acc10", userId: "u10", username: "meera.joshi", password: DEFAULT_PASSWORD, isAdmin: false, permissions: NO_PERMISSIONS, status: "active" },
  { id: "acc11", userId: "u11", username: "darshan.prajapati", password: DEFAULT_PASSWORD, isAdmin: false, permissions: NO_PERMISSIONS, status: "active" },
  { id: "acc12", userId: "u12", username: "riya.pandya", password: DEFAULT_PASSWORD, isAdmin: false, permissions: NO_PERMISSIONS, status: "active" },
];
