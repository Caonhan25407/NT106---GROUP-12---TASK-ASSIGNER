export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

// Maps to the SQL tables from the supplied ERD. Additional UI-only fields are documented below.
export interface User {
  userId: number
  username: string
  email: string
  fullName: string // UI extension: add FullName to Users on the backend
  avatarPath: string // database field AvataPath (correct the typo in a migration)
  timezone: string // UI extension
  bio: string // UI extension
  roleLabel: string // UI extension, not an authorization claim
}
export interface Project {
  projectId: number
  projectName: string
  description: string
  status: string
  startDate: string
  dueDate: string
  createdAt: string
  finishedAt: string | null
  color: string // UI-only display color
}
export interface ProjectMember {
  userId: number
  projectId: number
  role: string
}
export interface Task {
  taskId: number
  projectId: number
  title: string
  description: string
  status: TaskStatus
  startDate: string
  dueDate: string
  createdByUser: number
  assignedToUser: number | null
  createdAt: string
  finishedAt: string | null
  priority: TaskPriority // UI extension: add Priority to Tasks on backend
}
export interface Notification {
  notiId: number
  userReceive: number
  title: string
  content: string
  createdAt: string
  isRead: boolean // UI extension: add IsRead to Notifications on backend
}
export const statusLabels: Record<TaskStatus, string> = {
  todo: 'Cần làm',
  in_progress: 'Đang thực hiện',
  review: 'Chờ duyệt',
  done: 'Hoàn thành'
}
export const priorityLabels: Record<TaskPriority, string> = {
  low: 'Thấp', medium: 'Trung bình', high: 'Cao'
}
