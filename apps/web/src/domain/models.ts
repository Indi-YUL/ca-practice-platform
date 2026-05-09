/**
 * Domain models for frontend state management
 * Mirrors backend domain but adapted for UI needs
 */

export interface User {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  officeId: string;
}

export interface Client {
  id: string;
  name: string;
  legalType: string;
  officeId: string;
  isActive: boolean;
}

export interface Assignment {
  id: string;
  clientId: string;
  serviceId: string;
  status: string;
  dueDate: Date;
  isOverdue: boolean;
  assignedToUserId: string;
}

export interface Task {
  id: string;
  assignmentId: string;
  title: string;
  status: string;
  order: number;
}
