const { test, beforeEach, afterEach } = require('node:test')
const assert = require('node:assert/strict')
const { AxiosError } = require('axios')
const { createStorage } = require('./storage.cjs')

process.env.NEXT_PUBLIC_API_URL = 'https://api.example.test'
const { apiClient } = require('../lib/api/client.ts')
const { tasksApi } = require('../lib/api/tasks.ts')
const { financeApi } = require('../lib/api/finance.ts')
const { remindersApi } = require('../lib/api/reminders.ts')
const { analyticsApi } = require('../lib/api/analytics.ts')
const { settingsApi } = require('../lib/api/settings.ts')
const { authApi } = require('../lib/api/auth.ts')
const originalAdapter = apiClient.defaults.adapter
const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
let requests
let responseData

beforeEach(() => {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true, value: createStorage(),
  })
  requests = []
  responseData = { id: 42 }
  // Replace only the network boundary: Axios transforms and interceptors run.
  apiClient.defaults.adapter = async (config) => {
    requests.push(config)
    return { data: responseData, status: 200, statusText: 'OK', headers: {}, config }
  }
})
afterEach(() => {
  apiClient.defaults.adapter = originalAdapter
  if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage)
  else delete globalThis.localStorage
})

test('task filters reach the versioned API and response data is unwrapped', async () => {
  responseData = [{ id: 42, title: 'Pay rent', status: 'pending' }]
  const result = await tasksApi.list({ status: 'pending', date_filter: '2026-11-03' })
  assert.deepEqual(result, responseData)
  assert.equal(apiClient.getUri(requests[0]),
    'https://api.example.test/api/v1/tasks?status=pending&date_filter=2026-11-03')
})

test('task creation, completion and deletion preserve payloads and HTTP methods', async () => {
  const task = { title: 'Plan week', date: '2026-11-03', time: '09:00' }
  assert.deepEqual(await tasksApi.create(task), responseData)
  assert.deepEqual(await tasksApi.update(42, { status: 'completed' }), responseData)
  assert.equal(await tasksApi.delete(42), undefined)
  assert.deepEqual(requests.map(({ method, url }) => [method, url]), [
    ['post', '/tasks'], ['patch', '/tasks/42'], ['delete', '/tasks/42'],
  ])
  assert.deepEqual(JSON.parse(requests[0].data), task)
  assert.deepEqual(JSON.parse(requests[1].data), { status: 'completed' })
})

test('financial filters, expense creation and budget limits retain their values', async () => {
  const filters = { type: 'expense', category: 'Food', date_from: '2026-11-01', date_to: '2026-11-30' }
  const expense = { amount: 12500, type: 'expense', category: 'Food', date: '2026-11-03' }
  const budget = { category: 'Food', limit_amount: 500000, period: 'monthly' }
  assert.deepEqual(await financeApi.listTransactions(filters), responseData)
  assert.deepEqual(requests[0].params, filters)
  assert.equal(requests[0].url, '/transactions')
  assert.deepEqual(await financeApi.createTransaction(expense), responseData)
  assert.equal(requests[1].method, 'post')
  assert.equal(requests[1].url, '/transactions')
  assert.deepEqual(JSON.parse(requests[1].data), expense)
  assert.deepEqual(await financeApi.setBudget(budget), responseData)
  assert.equal(requests[2].url, '/finance/budget')
  assert.equal(requests[2].method, 'post')
  assert.deepEqual(JSON.parse(requests[2].data), budget)
})

test('balance response preserves income, expense and balance amounts', async () => {
  responseData = { total_income: 100000, total_expense: 25000, balance: 75000 }
  assert.deepEqual(await financeApi.getBalance(), responseData)
  assert.equal(requests[0].url, '/finance/balance')
})

test('recurring reminders preserve schedule and delete the selected reminder', async () => {
  const reminder = { title: 'Weekly review', datetime: '2026-11-03T09:00:00', repeat_type: 'weekly' }
  assert.deepEqual(await remindersApi.create(reminder), responseData)
  assert.deepEqual(JSON.parse(requests[0].data), reminder)
  assert.equal(requests[0].url, '/reminders')
  assert.equal(requests[0].method, 'post')
  assert.equal(await remindersApi.delete(42), undefined)
  assert.equal(requests[1].url, '/reminders/42')
  assert.equal(requests[1].method, 'delete')
})

test('daily analytics only sends a date filter when supplied', async () => {
  assert.deepEqual(await analyticsApi.getDaily('2026-11-03'), responseData)
  await analyticsApi.getDaily()
  assert.equal(requests[0].url, '/analytics/daily')
  assert.deepEqual(requests[0].params, { target_date: '2026-11-03' })
  assert.equal(requests[1].params, undefined)
})

test('settings updates preserve false notification preferences', async () => {
  const settings = { notifications_enabled: false, currency: 'UZS', timezone: 'Asia/Tashkent' }
  assert.deepEqual(await settingsApi.update(settings), responseData)
  assert.equal(requests[0].method, 'patch')
  assert.equal(requests[0].url, '/settings')
  assert.deepEqual(JSON.parse(requests[0].data), settings)
})

test('Telegram login posts initData and authenticated requests include it in headers', async () => {
  localStorage.setItem('tg_init_data', 'signed-init-data')
  assert.deepEqual(await authApi.telegram('signed-init-data'), responseData)
  assert.equal(requests[0].url, '/auth/telegram')
  assert.equal(requests[0].method, 'post')
  assert.deepEqual(JSON.parse(requests[0].data), { initData: 'signed-init-data' })
  assert.equal(requests[0].headers.get('X-Telegram-Init-Data'), 'signed-init-data')
})

test('requests without Telegram data omit the auth header', async () => {
  await tasksApi.list()
  assert.equal(requests[0].headers.has('X-Telegram-Init-Data'), false)
})

for (const status of [401, 500]) {
  test(`${status} failures propagate; only unauthorized errors clear credentials`, async () => {
    localStorage.setItem('tg_init_data', 'signed-init-data')
    localStorage.setItem('user', 'cached-user')
    localStorage.setItem('unrelated', 'keep')
    let failure
    apiClient.defaults.adapter = async (config) => {
      failure = new AxiosError('Request failed', undefined, config, undefined, {
        status, data: { detail: 'failure' }, headers: {}, statusText: 'Error', config,
      })
      throw failure
    }
    await assert.rejects(tasksApi.list(), (error) => error === failure)
    assert.equal(localStorage.getItem('tg_init_data'), status === 401 ? null : 'signed-init-data')
    assert.equal(localStorage.getItem('user'), status === 401 ? null : 'cached-user')
    assert.equal(localStorage.getItem('unrelated'), 'keep')
  })
}
