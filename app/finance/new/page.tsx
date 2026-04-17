'use client'

import { useCreateTransaction } from '@/lib/hooks/useFinance'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = {
  expense: ['Oziq-ovqat', 'Transport', 'Kommunal', 'Kiyim', 'Sog\'liq', 'O\'yin-kulgi', 'Boshqa'],
  income: ['Ish haqi', 'Biznes', 'Investitsiya', 'Sovg\'a', 'Boshqa'],
}

export default function NewTransactionPage() {
  const router = useRouter()
  const createTransaction = useCreateTransaction()

  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createTransaction.mutateAsync({
        type: formData.type,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description || undefined,
        date: formData.date,
      })

      router.push('/finance')
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
          <h1 className="text-2xl font-bold text-telegram-text">Yangi Transaction</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-telegram-text mb-2">
              Turi *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
                className={`py-3 rounded-xl font-medium ${
                  formData.type === 'income'
                    ? 'bg-green-500 text-white'
                    : 'bg-telegram-secondaryBg text-telegram-text'
                }`}
              >
                💰 Kirim
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
                className={`py-3 rounded-xl font-medium ${
                  formData.type === 'expense'
                    ? 'bg-red-500 text-white'
                    : 'bg-telegram-secondaryBg text-telegram-text'
                }`}
              >
                💸 Chiqim
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-telegram-text mb-2">
              Summa (UZS) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-telegram-secondaryBg text-telegram-text border-none outline-none"
              placeholder="50000"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-telegram-text mb-2">
              Kategoriya *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-telegram-secondaryBg text-telegram-text border-none outline-none"
            >
              <option value="">Tanlang</option>
              {CATEGORIES[formData.type].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-telegram-text mb-2">
              Tavsif
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-telegram-secondaryBg text-telegram-text border-none outline-none"
              placeholder="Qo'shimcha ma'lumot..."
            />
          </div>

          {/* Date */}
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

          <button
            type="submit"
            disabled={createTransaction.isPending}
            className="w-full bg-telegram-button text-telegram-buttonText py-3 rounded-xl font-medium disabled:opacity-50"
          >
            {createTransaction.isPending ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </form>
      </div>
    </main>
  )
}
