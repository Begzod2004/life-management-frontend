'use client'

import { useTransactions, useBalance } from '@/lib/hooks/useFinance'
import { TransactionCard } from '@/components/finance/TransactionCard'
import { BalanceCard } from '@/components/finance/BalanceCard'
import Link from 'next/link'
import { useState } from 'react'

export default function FinancePage() {
  const [filter, setFilter] = useState<string>('all')
  const { data: transactions, isLoading } = useTransactions(
    filter !== 'all' ? { type: filter } : undefined
  )
  const { data: balance } = useBalance()

  return (
    <main className="min-h-screen bg-telegram-bg p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-telegram-text">Moliya</h1>
          <Link
            href="/finance/new"
            className="bg-telegram-button text-telegram-buttonText px-4 py-2 rounded-xl font-medium"
          >
            + Yangi
          </Link>
        </div>

        {/* Balance Card */}
        {balance && (
          <BalanceCard
            balance={balance.balance}
            income={balance.total_income}
            expense={balance.total_expense}
          />
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'income', 'expense'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap ${
                filter === type
                  ? 'bg-telegram-button text-telegram-buttonText'
                  : 'bg-telegram-secondaryBg text-telegram-text'
              }`}
            >
              {type === 'all' ? 'Barchasi' : type === 'income' ? 'Kirim' : 'Chiqim'}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        {isLoading ? (
          <div className="text-center py-8 text-telegram-hint">Yuklanmoqda...</div>
        ) : transactions && transactions.length > 0 ? (
          <div>
            {transactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-telegram-hint">
            <div className="text-6xl mb-4">💰</div>
            <p>Hozircha transactionlar yo'q</p>
            <Link
              href="/finance/new"
              className="inline-block mt-4 text-telegram-link"
            >
              Birinchi transactionni yarating
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
