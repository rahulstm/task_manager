import api from './api'
import type { Project, Task, ProjectCreatePayload } from '../types'

export async function fetchProjects(): Promise<Project[]> {
  const response = await api.get<Project[]>('/projects')
  return response.data
}

export async function fetchProject(projectId: string): Promise<Project> {
  const response = await api.get<Project>(`/projects/${projectId}`)
  return response.data
}

export async function createProject(payload: ProjectCreatePayload): Promise<Project> {
  const response = await api.post<Project>('/projects', payload)
  return response.data
}

export async function fetchProjectTasks(projectId: string): Promise<Task[]> {
  const response = await api.get<Task[]>(`/projects/${projectId}/tasks`)
  return response.data
}
