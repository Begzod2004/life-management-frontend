'use client'

import { useDailyAnalytics, useWeeklyAnalytics } from '@/lib/hooks/useAnalytics'
import Link from 'next/link'

export default function AnalyticsPage() {
  const { data: daily } = useDailyAnalytics()
  const { data: weekly } = useWeeklyAnalytics()

  return (
    <main className="min-h-screen bg-telegram-bg p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-telegram-text mb-6">Statistika</h1>

        {/* Daily Summary */}
        {daily && (
          <div className="bg-telegram-secondaryBg rounded-2xl p-6 mb-4">
            <h2 className="text-lg font-semibold text-telegram-text mb-4">
              📅 Bugungi Xulosa
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-telegram-bg rounded-xl p-4">
                <p className="text-telegram-hint text-sm mb-1">Tasklar</p>
                <p className="text-2xl font-bold text-telegram-text">
                  {daily.completed_tasks}/{daily.total_tasks}
                </p>
                <p className="text-xs text-telegram-hint mt-1">
                  {daily.completion_rate.toFixed(0)}% bajarilgan
                </p>
              </div>

              <div className="bg-telegram-bg rounded-xl p-4">
                <p className="text-telegram-hint text-sm mb-1">Balans</p>
                <p className="text-2xl font-bold text-green-500">
                  {daily.balance.toLocaleString()}
                </p>
                <p className="text-xs text-telegram-hint mt-1">UZS</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-telegram-hint text-sm mb-1">Kirim</p>
                <p className="text-lg font-semibold text-green-500">
                  +{daily.total_income.toLocaleString()} UZS
                </p>
              </div>
              <div>
                <p className="text-telegram-hint text-sm mb-1">Chiqim</p>
                <p className="text-lg font-semibold text-red-500">
                  -{daily.total_expense.toLocaleString()} UZS
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Weekly Summary */}
        {weekly && (
          <div className="bg-telegram-secondaryBg rounded-2xl p-6 mb-4">
            <h2 className="text-lg font-semibold text-telegram-text mb-4">
              📊 Haftalik Hisobot
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-telegram-hint">Davr:</span>
                <span className="text-telegram-text font-medium">
                  {weekly.week_start} - {weekly.week_end}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-telegram-hint">Jami kirim:</span>
                <span className="text-green-500 font-semibold">
                  +{weekly.total_income.toLocaleString()} UZS
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-telegram-hint">Jami chiqim:</span>
                <span className="text-red-500 font-semibold">
                  -{weekly.total_expense.toLocaleString()} UZS
                </span>
              </div>

              {weekly.top_expense_category && (
                <div className="flex justify-between items-center pt-3 border-t border-telegram-hint/20">
                  <span className="text-telegram-hint">Eng ko'p chiqim:</span>
                  <div className="text-right">
                    <p className="text-telegram-text font-medium">
                      {weekly.top_expense_category}
                    </p>
                    <p className="text-sm text-red-500">
                      {weekly.top_expense_amount.toLocaleString()} UZS
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/tasks"
            className="bg-telegram-secondaryBg rounded-xl p-4 text-center"
          >
            <div className="text-3xl mb-2">📝</div>
            <p className="text-sm text-telegram-text">Tasklar</p>
          </Link>
          <Link
            href="/finance"
            className="bg-telegram-secondaryBg rounded-xl p-4 text-center"
          >
            <div className="text-3xl mb-2">💰</div>
            <p className="text-sm text-telegram-text">Moliya</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
