'use client'

import { useCreateReminder } from '@/lib/hooks/useReminders'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewReminderPage() {
  const router = useRouter()
  const createReminder = useCreateReminder()

  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    repeat_type: 'none' as 'none' | 'daily' | 'weekly' | 'monthly',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const datetime = `${formData.date}T${formData.time}:00Z`

      await createReminder.mutateAsync({
        title: formData.title,
        datetime,
        repeat_type: formData.repeat_type,
      })

      router.push('/reminders')
    } catch (error) {
      alert('Xatolik yuz berdi')
    }
  }

  return (
    <main className="min-h-screen bg-telegram-bg p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-telegram-link mb-4"
          >
            ← Orqaga
          </button>
          <h1 className="text-2xl font-bold text-telegram-text">Yangi Eslatma</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-telegram-text mb-2">
              Sarlavha *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-telegram-secondaryBg text-telegram-text border-none outline-none"
              placeholder="Masalan: Dori ichish"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-telegram-text mb-2">
                Sana *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-telegram-secondaryBg text-telegram-text border-none outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-telegram-text mb-2">
                Vaqt *
              </label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-telegram-secondaryBg text-telegram-text border-none outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-telegram-text mb-2">
              Takrorlash
            </label>
            <select
              value={formData.repeat_type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  repeat_type: e.target.value as 'none' | 'daily' | 'weekly' | 'monthly',
                })
              }
              className="w-full px-4 py-3 rounded-xl bg-telegram-secondaryBg text-telegram-text border-none outline-none"
            >
              <option value="none">Bir marta</option>
              <option value="daily">Har kuni</option>
              <option value="weekly">Har hafta</option>
              <option value="monthly">Har oy</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={createReminder.isPending}
            className="w-full bg-telegram-button text-telegram-buttonText py-3 rounded-xl font-medium disabled:opacity-50"
          >
            {createReminder.isPending ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </form>
      </div>
    </main>
  )
}
