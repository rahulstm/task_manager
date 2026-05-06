import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('task_manager_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API error response:', error.response.status, error.response.data)
    } else if (error.request) {
      console.error('No response received. Check network/CORS or server availability.', error.request)
    } else {
      console.error('API request setup error:', error.message)
    }
    return Promise.reject(error)
  },
)

export default api
