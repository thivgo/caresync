export type Role = 'ADMIN' | 'MEMBER';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: Role;
  color: string; // For UI identification
  password: string; // Mandatory now
}

export interface ElderlyProfile {
  id: string;
  name: string;
  gender: 'MALE' | 'FEMALE';
  avatarUrl: string;
  conditions: string[];
  notes: string;
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED'
}

export enum TaskType {
  MEDICATION = 'MEDICATION',
  MEAL = 'MEAL',
  HYGIENE = 'HYGIENE',
  ACTIVITY = 'ACTIVITY',
  APPOINTMENT = 'APPOINTMENT'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  elderlyId: string; // Who is this for?
  assignedToId?: string | null; // NULL = Unassigned (Jira backlog style)
  createdBy: string;
  scheduledAt: string; // ISO String
  completedAt?: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
}

// Server Action Response Types (Mocking backend responses)
export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}