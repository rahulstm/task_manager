import api from './api'
import type { Project, Task, ProjectCreatePayload, User } from '../types'

const normalizeRole = (role: string) => (role === 'admin' ? 'Admin' : 'Member')

const buildUser = (user: any): User => {
  const firstName = user.firstName || ''
  const lastName = user.lastName || ''
  return {
    _id: user._id || user.id,
    firstName,
    lastName,
    name: `${firstName} ${lastName}`.trim(),
    email: user.email,
    role: normalizeRole(user.role),
  }
}

const normalizeProject = (project: any): Project => ({
  ...project,
  members: project.members?.map((member: any) => ({
    ...buildUser(member),
    role: normalizeRole(member.role),
  })),
})

const backendPriorityToLabel: Record<string, Task['priority']> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const backendStatusToLabel: Record<string, Task['status']> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  completed: 'Done',
}

const normalizeTask = (task: any): Task => ({
  ...task,
  status: backendStatusToLabel[task.status] ?? task.status,
  priority: backendPriorityToLabel[task.priority] ?? task.priority,
  assignee: task.assignedTo ? buildUser(task.assignedTo) : undefined,
})

export async function fetchProjects(): Promise<Project[]> {
  const response = await api.get('/projects')
  return response.data.projects.map(normalizeProject)
}

export async function fetchProject(projectId: string): Promise<Project> {
  const response = await api.get(`/projects/${projectId}`)
  return normalizeProject(response.data.project)
}

export async function createProject(payload: ProjectCreatePayload): Promise<Project> {
  const response = await api.post('/projects', payload)
  return normalizeProject(response.data.project)
}

export async function updateProject(projectId: string, payload: ProjectCreatePayload): Promise<Project> {
  const response = await api.put(`/projects/${projectId}`, payload)
  return normalizeProject(response.data.project)
}

export async function deleteProject(projectId: string): Promise<void> {
  await api.delete(`/projects/${projectId}`)
}

export async function addProjectMember(projectId: string, userId: string): Promise<Project> {
  const response = await api.post(`/projects/${projectId}/members`, { userId })
  return normalizeProject(response.data.project)
}

export async function removeProjectMember(projectId: string, userId: string): Promise<Project> {
  const response = await api.delete(`/projects/${projectId}/members/${userId}`)
  return normalizeProject(response.data.project)
}

export async function fetchProjectTasks(projectId: string): Promise<Task[]> {
  const response = await api.get(`/projects/${projectId}/tasks`)
  return response.data.tasks.map(normalizeTask)
}
