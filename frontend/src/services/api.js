import axios from 'axios'
import { useAuth } from './auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

// Add interceptor to include auth token
api.interceptors.request.use(async (config) => {
  const { getToken } = useAuth()
  const token = await getToken()
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

export default api