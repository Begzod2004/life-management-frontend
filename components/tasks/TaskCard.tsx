import { Task } from '@/lib/api/tasks'
import { useUpdateTask, useDeleteTask } from '@/lib/hooks/useTasks'

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  const toggleStatus = () => {
    const newStatus = task.status === 'done' ? 'pending' : 'done'
    updateTask.mutate({ id: task.id, task: { status: newStatus } })
  }

  const handleDelete = () => {
    if (confirm('Taskni o\'chirmoqchimisiz?')) {
      deleteTask.mutate(task.id)
    }
  }

  return (
    <div className="bg-telegram-secondaryBg rounded-xl p-4 mb-3">
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={toggleStatus}
          className="mt-1 w-5 h-5 rounded border-2 border-telegram-hint flex items-center justify-center flex-shrink-0"
        >
          {task.status === 'done' && (
            <span className="text-telegram-button text-sm">✓</span>
          )}
        </button>

        {/* Content */}
        <div className="flex-1">
          <h3
            className={`font-medium text-telegram-text mb-1 ${
              task.status === 'done' ? 'line-through opacity-60' : ''
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-telegram-hint mb-2">{task.description}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-telegram-hint">
            <span>📅 {task.date}</span>
            {task.time && <span>🕐 {task.time}</span>}
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="text-red-500 text-sm p-2 hover:bg-red-50 rounded-lg"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
