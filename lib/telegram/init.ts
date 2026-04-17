export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

export interface TelegramWebAppData {
  initData: string
  user: TelegramUser | null
  theme: 'light' | 'dark'
}

export function initTelegramWebApp(): TelegramWebAppData {
  // Check if running in browser
  if (typeof window === 'undefined') {
    return {
      initData: '',
      user: null,
      theme: 'light',
    }
  }

  // Get WebApp from window
  const WebApp = (window as any).Telegram?.WebApp

  if (!WebApp) {
    return {
      initData: '',
      user: null,
      theme: 'light',
    }
  }

  // Initialize Telegram WebApp
  WebApp.ready()
  WebApp.expand()

  // Get init data
  const initData = WebApp.initData
  const user = WebApp.initDataUnsafe.user as TelegramUser | undefined
  const theme = WebApp.colorScheme as 'light' | 'dark'

  // Apply theme
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark')
  }

  // Listen for theme changes
  WebApp.onEvent('themeChanged', () => {
    const newTheme = WebApp.colorScheme
    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  })

  return {
    initData,
    user: user || null,
    theme,
  }
}

export function showBackButton(onClick: () => void) {
  if (typeof window === 'undefined') return
  const WebApp = (window as any).Telegram?.WebApp
  if (!WebApp) return
  WebApp.BackButton.show()
  WebApp.BackButton.onClick(onClick)
}

export function hideBackButton() {
  if (typeof window === 'undefined') return
  const WebApp = (window as any).Telegram?.WebApp
  if (!WebApp) return
  WebApp.BackButton.hide()
}

export function showMainButton(text: string, onClick: () => void) {
  if (typeof window === 'undefined') return
  const WebApp = (window as any).Telegram?.WebApp
  if (!WebApp) return
  WebApp.MainButton.setText(text)
  WebApp.MainButton.show()
  WebApp.MainButton.onClick(onClick)
}

export function hideMainButton() {
  if (typeof window === 'undefined') return
  const WebApp = (window as any).Telegram?.WebApp
  if (!WebApp) return
  WebApp.MainButton.hide()
}

export function setMainButtonLoading(loading: boolean) {
  if (typeof window === 'undefined') return
  const WebApp = (window as any).Telegram?.WebApp
  if (!WebApp) return
  if (loading) {
    WebApp.MainButton.showProgress()
  } else {
    WebApp.MainButton.hideProgress()
  }
}

export function showAlert(message: string) {
  if (typeof window === 'undefined') return
  const WebApp = (window as any).Telegram?.WebApp
  if (!WebApp) return
  WebApp.showAlert(message)
}

export function showConfirm(message: string, callback: (confirmed: boolean) => void) {
  if (typeof window === 'undefined') return
  const WebApp = (window as any).Telegram?.WebApp
  if (!WebApp) return
  WebApp.showConfirm(message, callback)
}

export function hapticFeedback(type: 'light' | 'medium' | 'heavy' | 'error' | 'success' | 'warning') {
  if (typeof window === 'undefined') return
  const WebApp = (window as any).Telegram?.WebApp
  if (!WebApp) return
  switch (type) {
    case 'light':
    case 'medium':
    case 'heavy':
      WebApp.HapticFeedback.impactOccurred(type)
      break
    case 'error':
    case 'success':
    case 'warning':
      WebApp.HapticFeedback.notificationOccurred(type)
      break
  }
}
