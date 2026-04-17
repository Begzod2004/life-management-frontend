import { Transaction } from '@/lib/api/finance'
import { useDeleteTransaction } from '@/lib/hooks/useFinance'

interface TransactionCardProps {
  transaction: Transaction
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const deleteTransaction = useDeleteTransaction()

  const handleDelete = () => {
    if (confirm('Transactionni o\'chirmoqchimisiz?')) {
      deleteTransaction.mutate(transaction.id)
    }
  }

  const isIncome = transaction.type === 'income'

  return (
    <div className="bg-telegram-secondaryBg rounded-xl p-4 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`text-2xl ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
            {isIncome ? '💰' : '💸'}
          </div>
          <div>
            <h3 className="font-medium text-telegram-text">{transaction.category}</h3>
            {transaction.description && (
              <p className="text-sm text-telegram-hint">{transaction.description}</p>
            )}
            <p className="text-xs text-telegram-hint mt-1">📅 {transaction.date}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p
              className={`text-lg font-bold ${
                isIncome ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {isIncome ? '+' : '-'}{transaction.amount.toLocaleString()} UZS
            </p>
          </div>
          <button
            onClick={handleDelete}
            className="text-red-500 text-sm p-2 hover:bg-red-50 rounded-lg"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}
