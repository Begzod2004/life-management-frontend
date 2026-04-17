import { Reminder } from '@/lib/api/reminders'
import { useDeleteReminder } from '@/lib/hooks/useReminders'

interface ReminderCardProps {
  reminder: Reminder
}

export function ReminderCard({ reminder }: ReminderCardProps) {
  const deleteReminder = useDeleteReminder()

  const handleDelete = () => {
    if (confirm('Reminderni o\'chirmoqchimisiz?')) {
      deleteReminder.mutate(reminder.id)
    }
  }

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime)
    return date.toLocaleString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getRepeatLabel = (type: string) => {
    const labels: Record<string, string> = {
      none: 'Bir marta',
      daily: 'Har kuni',
      weekly: 'Har hafta',
      monthly: 'Har oy',
    }
    return labels[type] || type
  }

  return (
    <div className="bg-telegram-secondaryBg rounded-xl p-4 mb-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="text-2xl">⏰</div>
          <div>
            <h3 className="font-medium text-telegram-text mb-1">{reminder.title}</h3>
            <p className="text-sm text-telegram-hint mb-1">
              📅 {formatDateTime(reminder.datetime)}
            </p>
            <span className="text-xs bg-telegram-button text-telegram-buttonText px-2 py-1 rounded">
              {getRepeatLabel(reminder.repeat_type)}
            </span>
          </div>
        </div>

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
