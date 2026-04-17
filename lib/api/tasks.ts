import { apiClient } from './client'

// Types
export interface Task {
  id: number
  user_id: number
  title: string
  description?: string
  date: string
  time?: string
  status: string
  created_at: string
}

export interface TaskCreate {
  title: string
  description?: string
  date: string
  time?: string
}

export interface TaskUpdate {
  title?: string
  description?: string
  date?: string
  time?: string
  status?: string
}

// API functions
export const tasksApi = {
  list: async (params?: { status?: string; date_filter?: string }) => {
    const { data } = await apiClient.get<Task[]>('/tasks', { params })
    return data
  },

  create: async (task: TaskCreate) => {
    const { data } = await apiClient.post<Task>('/tasks', task)
    return data
  },

  get: async (id: number) => {
    const { data } = await apiClient.get<Task>(`/tasks/${id}`)
    return data
  },

  update: async (id: number, task: TaskUpdate) => {
    const { data } = await apiClient.patch<Task>(`/tasks/${id}`, task)
    return data
  },

  delete: async (id: number) => {
    await apiClient.delete(`/tasks/${id}`)
  },
}
