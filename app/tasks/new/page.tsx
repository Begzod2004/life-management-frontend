'use client'

import { useCreateTask } from '@/lib/hooks/useTasks'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewTaskPage() {
  const router = useRouter()
  const createTask = useCreateTask()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createTask.mutateAsync({
        title: formData.title,
        description: formData.description || undefined,
        date: formData.date,
        time: formData.time || undefined,
      })

      router.push('/tasks')
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
          <h1 className="text-2xl font-bold text-telegram-text">Yangi Task</h1>
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
              placeholder="Masalan: Kitob o'qish"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-telegram-text mb-2">
              Tavsif
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-telegram-secondaryBg text-telegram-text border-none outline-none"
              placeholder="Qo'shimcha ma'lumot..."
              rows={3}
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
                Vaqt
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-telegram-secondaryBg text-telegram-text border-none outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={createTask.isPending}
            className="w-full bg-telegram-button text-telegram-buttonText py-3 rounded-xl font-medium disabled:opacity-50"
          >
            {createTask.isPending ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </form>
      </div>
    </main>
  )
}
