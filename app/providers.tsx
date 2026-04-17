'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store/authStore'
import { apiClient } from '@/lib/api/client'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)
  const setUser = useAuthStore((state) => state.setUser)

  useEffect(() => {
    setIsClient(true)

    // Initialize Telegram WebApp only on client
    if (typeof window !== 'undefined') {
      const WebApp = (window as any).Telegram?.WebApp

      if (WebApp) {
        WebApp.ready()
        WebApp.expand()

        const initData = WebApp.initData
        const user = WebApp.initDataUnsafe?.user

        if (initData && user) {
          // Store initData for API requests
          localStorage.setItem('tg_init_data', initData)

          // Authenticate with backend
          apiClient
            .post('/auth/telegram', { initData })
            .then((response) => {
              setUser(response.data.user)
            })
            .catch((error) => {
              console.error('Authentication failed:', error)
            })
        }
      }
    }
  }, [setUser])

  // Prevent hydration mismatch by only rendering on client
  if (!isClient) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
