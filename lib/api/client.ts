import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add initData
apiClient.interceptors.request.use((config) => {
  const initData = localStorage.getItem('tg_init_data')
  if (initData) {
    config.headers['X-Telegram-Init-Data'] = initData
  }
  return config
})

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth data
      localStorage.removeItem('tg_init_data')
      localStorage.removeItem('user')
    }
    return Promise.reject(error)
  }
)
