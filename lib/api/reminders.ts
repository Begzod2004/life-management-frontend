import { apiClient } from './client'

// Types
export interface Reminder {
  id: number
  user_id: number
  title: string
  datetime: string
  repeat_type: 'none' | 'daily' | 'weekly' | 'monthly'
  status: string
  created_at: string
}

export interface ReminderCreate {
  title: string
  datetime: string
  repeat_type: 'none' | 'daily' | 'weekly' | 'monthly'
}

// API functions
export const remindersApi = {
  list: async () => {
    const { data } = await apiClient.get<Reminder[]>('/reminders')
    return data
  },

  create: async (reminder: ReminderCreate) => {
    const { data } = await apiClient.post<Reminder>('/reminders', reminder)
    return data
  },

  get: async (id: number) => {
    const { data } = await apiClient.get<Reminder>(`/reminders/${id}`)
    return data
  },

  delete: async (id: number) => {
    await apiClient.delete(`/reminders/${id}`)
  },
}
