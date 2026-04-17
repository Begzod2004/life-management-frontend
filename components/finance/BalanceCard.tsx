interface BalanceCardProps {
  balance: number
  income: number
  expense: number
  currency?: string
}

export function BalanceCard({ balance, income, expense, currency = 'UZS' }: BalanceCardProps) {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 mb-4 shadow-lg text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-white/80 text-sm mb-1">Balans</p>
          <p className="text-3xl font-bold">{balance.toLocaleString()} {currency}</p>
        </div>
        <div className="text-4xl">💰</div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
        <div>
          <p className="text-white/80 text-xs mb-1">Kirim</p>
          <p className="text-lg font-semibold text-green-300">
            +{income.toLocaleString()} {currency}
          </p>
        </div>
        <div>
          <p className="text-white/80 text-xs mb-1">Chiqim</p>
          <p className="text-lg font-semibold text-red-300">
            -{expense.toLocaleString()} {currency}
          </p>
        </div>
      </div>
    </div>
  )
}
