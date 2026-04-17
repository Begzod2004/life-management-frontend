import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { remindersApi, ReminderCreate } from '../api/reminders'

export function useReminders() {
  return useQuery({
    queryKey: ['reminders'],
    queryFn: () => remindersApi.list(),
  })
}

export function useReminder(id: number) {
  return useQuery({
    queryKey: ['reminders', id],
    queryFn: () => remindersApi.get(id),
    enabled: !!id,
  })
}

export function useCreateReminder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reminder: ReminderCreate) => remindersApi.create(reminder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] })
    },
  })
}

export function useDeleteReminder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => remindersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] })
    },
  })
}
