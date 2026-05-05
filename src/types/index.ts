export type UserRole = 'Admin' | 'Member'

export type User = {
  _id?: string
  name: string
  email: string
  role: UserRole
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Done'
export type TaskPriority = 'Low' | 'Medium' | 'High'

export type Task = {
  _id?: string
  title: string
  description: string
  dueDate: string
  priority: TaskPriority
  status: TaskStatus
  assignee?: User
  projectId?: string
}

export type Project = {
  _id?: string
  name: string
  description: string
  members?: User[]
  tasks?: Task[]
  adminId?: string
}

export type AuthResponse = {
  token: string
  user: User
}

export type ProjectCreatePayload = {
  name: string
  description: string
}

export type TaskCreatePayload = {
  title: string
  description: string
  dueDate: string
  priority: TaskPriority
  assigneeId?: string
}

export type TaskUpdatePayload = {
  status?: TaskStatus
}
