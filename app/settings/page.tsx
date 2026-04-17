'use client'

import { useSettings, useUpdateSettings } from '@/lib/hooks/useSettings'
import { useState, useEffect } from 'react'

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings()
  const updateSettings = useUpdateSettings()

  const [formData, setFormData] = useState({
    currency: 'UZS',
    notifications_enabled: true,
    timezone: 'Asia/Tashkent',
    language: 'uz',
  })

  useEffect(() => {
    if (settings) {
      setFormData({
        currency: settings.currency,
        notifications_enabled: settings.notifications_enabled,
        timezone: settings.timezone,
        language: settings.language,
      })
    }
  }, [settings])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await updateSettings.mutateAsync(formData)
      alert('Sozlamalar saqlandi!')
    } catch (error) {
      alert('Xatolik yuz berdi')
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-telegram-bg p-4">
        <div className="text-center py-8 text-telegram-hint">Yuklanmoqda...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-telegram-bg p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-telegram-text mb-6">Sozlamalar</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Currency */}
          <div className="bg-telegram-secondaryBg rounded-xl p-4">
            <label className="block text-sm font-medium text-telegram-text mb-2">
              Valyuta
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-telegram-bg text-telegram-text border-none outline-none"
            >
              <option value="UZS">UZS - O'zbek so'mi</option>
              <option value="USD">USD - Dollar</option>
              <option value="EUR">EUR - Yevro</option>
              <option value="RUB">RUB - Rubl</option>
            </select>
          </div>

          {/* Language */}
          <div className="bg-telegram-secondaryBg rounded-xl p-4">
            <label className="block text-sm font-medium text-telegram-text mb-2">
              Til
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-telegram-bg text-telegram-text border-none outline-none"
            >
              <option value="uz">O'zbekcha</option>
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Timezone */}
          <div className="bg-telegram-secondaryBg rounded-xl p-4">
            <label className="block text-sm font-medium text-telegram-text mb-2">
              Vaqt zonasi
            </label>
            <select
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-telegram-bg text-telegram-text border-none outline-none"
            >
              <option value="Asia/Tashkent">Toshkent (UTC+5)</option>
              <option value="Asia/Almaty">Almaty (UTC+6)</option>
              <option value="Europe/Moscow">Moskva (UTC+3)</option>
            </select>
          </div>

          {/* Notifications */}
          <div className="bg-telegram-secondaryBg rounded-xl p-4">
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-telegram-text">
                Bildirishnomalar
              </span>
              <input
                type="checkbox"
                checked={formData.notifications_enabled}
                onChange={(e) =>
                  setFormData({ ...formData, notifications_enabled: e.target.checked })
                }
                className="w-5 h-5"
              />
            </label>
            <p className="text-xs text-telegram-hint mt-2">
              Eslatmalar va muhim xabarlar uchun bildirishnomalar
            </p>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={updateSettings.isPending}
            className="w-full bg-telegram-button text-telegram-buttonText py-3 rounded-xl font-medium disabled:opacity-50"
          >
            {updateSettings.isPending ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </form>

        {/* App Info */}
        <div className="mt-8 text-center text-telegram-hint text-sm">
          <p>Life Management System</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </div>
    </main>
  )
}
