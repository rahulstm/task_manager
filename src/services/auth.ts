import api from './api'
import type { AuthResponse } from '../types'

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', { email, password })
  return response.data
}

export async function signup(name: string, email: string, password: string, role: 'Admin' | 'Member'): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/signup', { name, email, password, role })
  return response.data
}
