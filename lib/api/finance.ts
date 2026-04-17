import { apiClient } from './client'

// Types
export interface Transaction {
  id: number
  user_id: number
  amount: number
  type: 'income' | 'expense'
  category: string
  description?: string
  date: string
  created_at: string
}

export interface TransactionCreate {
  amount: number
  type: 'income' | 'expense'
  category: string
  description?: string
  date: string
}

export interface Balance {
  total_income: number
  total_expense: number
  balance: number
}

export interface Budget {
  id: number
  user_id: number
  category: string
  limit_amount: number
  period: string
  created_at: string
}

export interface BudgetCreate {
  category: string
  limit_amount: number
  period: string
}

// API functions
export const financeApi = {
  // Transactions
  listTransactions: async (params?: {
    type?: string
    category?: string
    date_from?: string
    date_to?: string
  }) => {
    const { data } = await apiClient.get<Transaction[]>('/transactions', { params })
    return data
  },

  createTransaction: async (transaction: TransactionCreate) => {
    const { data } = await apiClient.post<Transaction>('/transactions', transaction)
    return data
  },

  getTransaction: async (id: number) => {
    const { data } = await apiClient.get<Transaction>(`/transactions/${id}`)
    return data
  },

  updateTransaction: async (id: number, transaction: Partial<TransactionCreate>) => {
    const { data } = await apiClient.patch<Transaction>(`/transactions/${id}`, transaction)
    return data
  },

  deleteTransaction: async (id: number) => {
    await apiClient.delete(`/transactions/${id}`)
  },

  // Balance
  getBalance: async () => {
    const { data } = await apiClient.get<Balance>('/finance/balance')
    return data
  },

  // Budget
  getBudgets: async () => {
    const { data } = await apiClient.get<Budget[]>('/finance/budget')
    return data
  },

  setBudget: async (budget: BudgetCreate) => {
    const { data } = await apiClient.post<Budget>('/finance/budget', budget)
    return data
  },
}
