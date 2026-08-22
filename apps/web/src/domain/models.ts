export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  office: string;
  department: string;
  departments?: string[];
  avatar?: string;
}

export type UserRole = "partner" | "manager" | "staff" | "trainee";

export interface ResourcePermissions {
  create: boolean;
  edit: boolean;
}

export type PermissionResource = "clients" | "staff" | "services" | "assignments";

export interface UserPermissions {
  clients: ResourcePermissions;
  staff: ResourcePermissions;
  services: ResourcePermissions;
  assignments: ResourcePermissions;
}

export interface AppUserAccount {
  id: string;
  userId: string;
  username: string;
  password: string;
  isAdmin: boolean;
  permissions: UserPermissions;
  status: "active" | "inactive";
}

export interface AuthSession {
  accountId: string;
  user: User;
  username: string;
  isAdmin: boolean;
  permissions: UserPermissions;
}

export const DEFAULT_PASSWORD = "Cjca@1234";

export const FULL_PERMISSIONS: UserPermissions = {
  clients: { create: true, edit: true },
  staff: { create: true, edit: true },
  services: { create: true, edit: true },
  assignments: { create: true, edit: true },
};

export const NO_PERMISSIONS: UserPermissions = {
  clients: { create: false, edit: false },
  staff: { create: false, edit: false },
  services: { create: false, edit: false },
  assignments: { create: false, edit: false },
};

export const MANAGER_PERMISSIONS: UserPermissions = {
  clients: { create: false, edit: false },
  staff: { create: false, edit: false },
  services: { create: false, edit: false },
  assignments: { create: true, edit: true },
};

export interface BankDetails {
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  accountHolderName?: string;
}

export type EmploymentType = "full_time" | "articleship" | "intern";

export interface Staff extends User {
  employeeId: string;
  phone: string;
  dateOfJoining: string;
  status: "active" | "inactive";
  departments: string[];
  services: string[];
  designation?: string;
  employmentType?: EmploymentType;
  reportingManagerId?: string;
  reportingManagerName?: string;
  bankDetails?: BankDetails;
}

export interface Client {
  id: string;
  name: string;
  legalType: string;
  pan?: string;
  gstin?: string;
  tan?: string;
  office: string;
  contactPerson: string;
  email: string;
  phone: string;
  registeredAddress?: string;
  correspondenceAddress?: string;
  dateOfIncorporation?: string;
  assignedPartnerId?: string;
  assignedPartnerName?: string;
  status: "active" | "inactive";
  groupName?: string;
  services: string[];
  assignmentsCount: number;
}

export type ServiceFrequency = "monthly" | "quarterly" | "annual" | "one_time";

export interface ServiceMaster {
  id: string;
  name: string;
  category: string;
  frequency: ServiceFrequency;
  department: string;
  description?: string;
  clientCount: number;
  status: "active" | "inactive";
}

export type RecurringFrequency = ServiceFrequency;

export type Priority = "high" | "medium" | "low";

export interface Assignment {
  id: string;
  title?: string;
  estimatedHours?: number;
  clientId: string;
  clientName: string;
  serviceName: string;
  period: string;
  startDate?: string;
  dueDate: string;
  feeAmount?: number;
  recurringFrequency?: RecurringFrequency;
  requiredDocuments?: string[];
  description?: string;
  assigneeId: string;
  assigneeName: string;
  assignedById?: string;
  assignedByName?: string;
  reviewerId?: string;
  reviewerName?: string;
  status: AssignmentStatus;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
  comments: Comment[];
  worklogs: Worklog[];
}

export const ASSIGNMENT_STATUS = {
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  QUERY_HOLD: "query_hold",
  WAITING_FOR_INFO: "waiting_for_info",
  COMPLETED: "completed",
  REVIEWED: "reviewed",
  BILLED: "billed",
} as const;

export type AssignmentStatus = (typeof ASSIGNMENT_STATUS)[keyof typeof ASSIGNMENT_STATUS];

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  type: "note" | "query" | "resolution" | "review_remark";
  text: string;
  createdAt: string;
}

export interface Worklog {
  id: string;
  userId: string;
  userName: string;
  assignmentId: string;
  date: string;
  hours: number;
  note: string;
}

export interface DashboardStats {
  totalActive: number;
  completedThisWeek: number;
  overdue: number;
  pendingByDepartment: { department: string; count: number }[];
  staffWorkload: { name: string; pending: number; completed: number }[];
  recentCompleted: Assignment[];
  overdueItems: Assignment[];
}
