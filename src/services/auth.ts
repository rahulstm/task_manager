import api from './api'
import type { AuthResponse, UserRole } from '../types'

const normalizeRole = (role: string): UserRole =>
  role === 'admin' ? 'Admin' : 'Member'

const buildUser = (user: any) => {
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

const normalizeAuthResponse = (data: any): AuthResponse => ({
  token: data.token,
  user: buildUser(data.user),
})

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await api.post('/auth/login', { email, password })
  return normalizeAuthResponse(response.data)
}

export async function signup(name: string, email: string, password: string, role: UserRole): Promise<AuthResponse> {
  const [firstName, ...rest] = name.trim().split(' ')
  const lastName = rest.join(' ') || ''
  const response = await api.post('/auth/signup', {
    firstName,
    lastName,
    email,
    password,
    role: role.toLowerCase(),
  })
  return normalizeAuthResponse(response.data)
}

export async function getProfile(): Promise<AuthResponse> {
  const response = await api.get('/auth/profile')
  return normalizeAuthResponse(response.data)
}
