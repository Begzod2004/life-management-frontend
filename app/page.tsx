'use client'

import { useAuthStore } from '@/lib/store/authStore'
import { useTasks } from '@/lib/hooks/useTasks'
import { useBalance } from '@/lib/hooks/useFinance'
import { BalanceCard } from '@/components/finance/BalanceCard'
import { TaskCard } from '@/components/tasks/TaskCard'
import Link from 'next/link'

export default function HomePage() {
  const user = useAuthStore((state) => state.user)
  const today = new Date().toISOString().split('T')[0]
  const { data: tasks } = useTasks({ date_filter: today })
  const { data: balance } = useBalance()

  return (
    <main className="min-h-screen bg-telegram-bg p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-telegram-text mb-2">
            Salom, {user?.first_name || 'User'}! 👋
          </h1>
          <p className="text-telegram-hint">
            Bugun nima rejalashtirdingiz?
          </p>
        </div>

        {/* Balance Card */}
        {balance && (
          <BalanceCard
            balance={balance.balance}
            income={balance.total_income}
            expense={balance.total_expense}
          />
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link
            href="/tasks/new"
            className="bg-telegram-button text-telegram-buttonText rounded-xl p-4 text-center font-medium active:opacity-80 transition-opacity"
          >
            <div className="text-2xl mb-2">📝</div>
            Task qo&apos;shish
          </Link>
          <Link
            href="/finance/new"
            className="bg-telegram-button text-telegram-buttonText rounded-xl p-4 text-center font-medium active:opacity-80 transition-opacity"
          >
            <div className="text-2xl mb-2">💸</div>
            Transaction qo&apos;shish
          </Link>
        </div>

        {/* Today's Tasks */}
        <div className="bg-telegram-secondaryBg rounded-2xl p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-telegram-text">
              Bugungi tasklar
            </h2>
            <Link href="/tasks" className="text-telegram-link text-sm">
              Barchasi
            </Link>
          </div>
          {tasks && tasks.length > 0 ? (
            <div>
              {tasks.slice(0, 3).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-telegram-hint">
              <div className="text-4xl mb-2">📋</div>
              <p>Hozircha tasklar yo&apos;q</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-4 gap-2 mt-6">
          <Link
            href="/tasks"
            className="flex flex-col items-center p-3 rounded-xl hover:bg-telegram-secondaryBg transition-colors"
          >
            <div className="text-2xl mb-1">📅</div>
            <span className="text-xs text-telegram-text">Tasklar</span>
          </Link>
          <Link
            href="/finance"
            className="flex flex-col items-center p-3 rounded-xl hover:bg-telegram-secondaryBg transition-colors"
          >
            <div className="text-2xl mb-1">💰</div>
            <span className="text-xs text-telegram-text">Moliya</span>
          </Link>
          <Link
            href="/analytics"
            className="flex flex-col items-center p-3 rounded-xl hover:bg-telegram-secondaryBg transition-colors"
          >
            <div className="text-2xl mb-1">📊</div>
            <span className="text-xs text-telegram-text">Statistika</span>
          </Link>
          <Link
            href="/settings"
            className="flex flex-col items-center p-3 rounded-xl hover:bg-telegram-secondaryBg transition-colors"
          >
            <div className="text-2xl mb-1">⚙️</div>
            <span className="text-xs text-telegram-text">Sozlamalar</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
