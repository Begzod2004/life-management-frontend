import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '../api/analytics'

export function useDailyAnalytics(target_date?: string) {
  return useQuery({
    queryKey: ['analytics', 'daily', target_date],
    queryFn: () => analyticsApi.getDaily(target_date),
  })
}

export function useWeeklyAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'weekly'],
    queryFn: () => analyticsApi.getWeekly(),
  })
}
