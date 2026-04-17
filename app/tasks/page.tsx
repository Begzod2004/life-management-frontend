'use client'

import { useTasks } from '@/lib/hooks/useTasks'
import { TaskCard } from '@/components/tasks/TaskCard'
import Link from 'next/link'
import { useState } from 'react'

export default function TasksPage() {
  const [filter, setFilter] = useState<string>('all')
  const { data: tasks, isLoading } = useTasks(
    filter !== 'all' ? { status: filter } : undefined
  )

  return (
    <main className="min-h-screen bg-telegram-bg p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-telegram-text">Tasklar</h1>
          <Link
            href="/tasks/new"
            className="bg-telegram-button text-telegram-buttonText px-4 py-2 rounded-xl font-medium"
          >
            + Yangi
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'pending', 'done'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap ${
                filter === status
                  ? 'bg-telegram-button text-telegram-buttonText'
                  : 'bg-telegram-secondaryBg text-telegram-text'
              }`}
            >
              {status === 'all' ? 'Barchasi' : status === 'pending' ? 'Kutilmoqda' : 'Bajarilgan'}
            </button>
          ))}
        </div>

        {/* Tasks List */}
        {isLoading ? (
          <div className="text-center py-8 text-telegram-hint">Yuklanmoqda...</div>
        ) : tasks && tasks.length > 0 ? (
          <div>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-telegram-hint">
            <div className="text-6xl mb-4">📋</div>
            <p>Hozircha tasklar yo'q</p>
            <Link
              href="/tasks/new"
              className="inline-block mt-4 text-telegram-link"
            >
              Birinchi taskni yarating
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
