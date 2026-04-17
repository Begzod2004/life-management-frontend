import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { financeApi, TransactionCreate, BudgetCreate } from '../api/finance'

export function useTransactions(params?: {
  type?: string
  category?: string
  date_from?: string
  date_to?: string
}) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => financeApi.listTransactions(params),
  })
}

export function useTransaction(id: number) {
  return useQuery({
    queryKey: ['transactions', id],
    queryFn: () => financeApi.getTransaction(id),
    enabled: !!id,
  })
}

export function useBalance() {
  return useQuery({
    queryKey: ['balance'],
    queryFn: () => financeApi.getBalance(),
  })
}

export function useBudgets() {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: () => financeApi.getBudgets(),
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (transaction: TransactionCreate) =>
      financeApi.createTransaction(transaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['balance'] })
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, transaction }: { id: number; transaction: Partial<TransactionCreate> }) =>
      financeApi.updateTransaction(id, transaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['balance'] })
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => financeApi.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['balance'] })
    },
  })
}

export function useSetBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (budget: BudgetCreate) => financeApi.setBudget(budget),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
  })
}
