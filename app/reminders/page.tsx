'use client'

import { useReminders } from '@/lib/hooks/useReminders'
import { ReminderCard } from '@/components/reminders/ReminderCard'
import Link from 'next/link'

export default function RemindersPage() {
  const { data: reminders, isLoading } = useReminders()

  return (
    <main className="min-h-screen bg-telegram-bg p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-telegram-text">Eslatmalar</h1>
          <Link
            href="/reminders/new"
            className="bg-telegram-button text-telegram-buttonText px-4 py-2 rounded-xl font-medium"
          >
            + Yangi
          </Link>
        </div>

        {/* Reminders List */}
        {isLoading ? (
          <div className="text-center py-8 text-telegram-hint">Yuklanmoqda...</div>
        ) : reminders && reminders.length > 0 ? (
          <div>
            {reminders.map((reminder) => (
              <ReminderCard key={reminder.id} reminder={reminder} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-telegram-hint">
            <div className="text-6xl mb-4">⏰</div>
            <p>Hozircha eslatmalar yo'q</p>
            <Link
              href="/reminders/new"
              className="inline-block mt-4 text-telegram-link"
            >
              Birinchi eslatmani yarating
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
