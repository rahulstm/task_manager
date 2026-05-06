import api from './api'
import type { Task, TaskCreatePayload, TaskUpdatePayload } from '../types'

const priorityMap: Record<TaskCreatePayload['priority'], string> = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
}

const statusMap: Record<Task['status'], string> = {
  'To Do': 'todo',
  'In Progress': 'in_progress',
  Done: 'completed',
}

const priorityLabelMap: Record<string, Task['priority']> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const statusLabelMap: Record<string, Task['status']> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  completed: 'Done',
}

const normalizeTask = (task: any): Task => ({
  ...task,
  status: statusLabelMap[task.status] ?? task.status,
  priority: priorityLabelMap[task.priority] ?? task.priority,
  assignee: task.assignedTo ? { _id: task.assignedTo._id || task.assignedTo } : undefined,
})

export async function fetchTasks(): Promise<Task[]> {
  const response = await api.get('/projects/stats/overview')
  return response.data.tasks.map(normalizeTask)
}

export async function createTask(projectId: string, payload: TaskCreatePayload): Promise<Task> {
  const body = {
    title: payload.title,
    description: payload.description,
    dueDate: payload.dueDate,
    priority: priorityMap[payload.priority],
    assignedTo: payload.assigneeId || null,
  }
  const response = await api.post(`/projects/${projectId}/tasks`, body)
  return normalizeTask(response.data.task)
}

export async function updateTask(taskId: string, payload: TaskUpdatePayload): Promise<Task> {
  const body: any = {}
  if (payload.status) {
    body.status = statusMap[payload.status]
  }
  if (payload.priority) {
    body.priority = priorityMap[payload.priority]
  }
  if (payload.assignedTo) {
    body.assignedTo = payload.assignedTo
  }
  const response = await api.put(`/projects/tasks/${taskId}`, body)
  return normalizeTask(response.data.task)
}

export async function deleteTask(taskId: string): Promise<void> {
  await api.delete(`/projects/tasks/${taskId}`)
}
