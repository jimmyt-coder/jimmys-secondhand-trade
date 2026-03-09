import axios from 'axios'
import { message } from 'antd'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const request = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

// Request interceptor: attach token automatically
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: handle errors uniformly
request.interceptors.response.use(
  (response) => {
    const data = response.data
    if (data.code === 200) return data
    message.error(data.message || 'Request failed')
    return Promise.reject(new Error(data.message))
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    } else {
      message.error(error.response?.data?.message || 'Network error')
    }
    return Promise.reject(error)
  }
)

export const imageUrl = (path: string | null | undefined) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return BASE_URL + path
}

export default request
