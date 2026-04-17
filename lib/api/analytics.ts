import { apiClient } from './client'

// Types
export interface DailySummary {
  date: string
  total_tasks: number
  completed_tasks: number
  completion_rate: number
  total_income: number
  total_expense: number
  balance: number
}

export interface WeeklySummary {
  week_start: string
  week_end: string
  total_income: number
  total_expense: number
  top_expense_category: string | null
  top_expense_amount: number
}

// API functions
export const analyticsApi = {
  getDaily: async (target_date?: string) => {
    const { data } = await apiClient.get<DailySummary>('/analytics/daily', {
      params: target_date ? { target_date } : undefined,
    })
    return data
  },

  getWeekly: async () => {
    const { data } = await apiClient.get<WeeklySummary>('/analytics/weekly')
    return data
  },
}
