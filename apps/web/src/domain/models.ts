export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  office: string;
  department: string;
  avatar?: string;
}

export type UserRole = "partner" | "manager" | "staff" | "trainee";

export interface Client {
  id: string;
  name: string;
  legalType: string;
  pan?: string;
  gstin?: string;
  office: string;
  contactPerson: string;
  phone: string;
  groupName?: string;
  services: string[];
  assignmentsCount: number;
}

export interface ServiceMaster {
  id: string;
  name: string;
  category: string;
  frequency: "monthly" | "quarterly" | "annual" | "occasional";
  department: string;
}

export interface Assignment {
  id: string;
  clientId: string;
  clientName: string;
  serviceName: string;
  period: string;
  assigneeId: string;
  assigneeName: string;
  reviewerId?: string;
  reviewerName?: string;
  status: AssignmentStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
  comments: Comment[];
  worklogs: Worklog[];
}

export const ASSIGNMENT_STATUS = {
  DRAFT: "draft",
  ASSIGNED: "assigned",
  IN_PROGRESS: "in_progress",
  WAITING_FOR_INFO: "waiting_for_info",
  QUERY_RAISED: "query_raised",
  UNDER_REVIEW: "under_review",
  COMPLETED: "completed",
  CLOSED: "closed",
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
