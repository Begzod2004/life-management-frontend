import { apiClient } from './client'

// Types
export interface User {
  id: number
  telegram_id: number
  username?: string
  first_name: string
  last_name?: string
}

export interface AuthResponse {
  user: User
  message: string
}

// API functions
export const authApi = {
  telegram: async (initData: string) => {
    const { data } = await apiClient.post<AuthResponse>('/auth/telegram', { initData })
    return data
  },
}
