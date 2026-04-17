import { apiClient } from './client'

// Types
export interface Settings {
  id: number
  user_id: number
  currency: string
  notifications_enabled: boolean
  timezone: string
  language: string
}

export interface SettingsUpdate {
  currency?: string
  notifications_enabled?: boolean
  timezone?: string
  language?: string
}

// API functions
export const settingsApi = {
  get: async () => {
    const { data } = await apiClient.get<Settings>('/settings')
    return data
  },

  update: async (settings: SettingsUpdate) => {
    const { data } = await apiClient.patch<Settings>('/settings', settings)
    return data
  },
}
