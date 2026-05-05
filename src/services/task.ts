import api from './api'
import type { Task, TaskCreatePayload, TaskUpdatePayload } from '../types'

export async function fetchTasks(): Promise<Task[]> {
  const response = await api.get<Task[]>('/tasks')
  return response.data
}

export async function createTask(projectId: string, payload: TaskCreatePayload): Promise<Task> {
  const response = await api.post<Task>(`/projects/${projectId}/tasks`, payload)
  return response.data
}

export async function updateTask(taskId: string, payload: TaskUpdatePayload): Promise<Task> {
  const response = await api.patch<Task>(`/tasks/${taskId}`, payload)
  return response.data
}
