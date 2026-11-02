const { test, after } = require('node:test')
const assert = require('node:assert/strict')
const { createStorage } = require('./storage.cjs')
const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: createStorage() })
const { useAuthStore } = require('../lib/store/authStore.ts')

after(() => {
  if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage)
  else delete globalThis.localStorage
})

test('login persists the user and authentication status, then logout removes Telegram credentials', () => {
  assert.equal(useAuthStore.getState().user, null)
  assert.equal(useAuthStore.getState().isAuthenticated, false)
  const user = { id: 1, telegram_id: 123, first_name: 'Ali' }
  useAuthStore.getState().setUser(user)
  assert.deepEqual(useAuthStore.getState().user, user)
  assert.equal(useAuthStore.getState().isAuthenticated, true)
  const persisted = JSON.parse(localStorage.getItem('auth-storage'))
  assert.deepEqual(persisted.state.user, user)
  assert.equal(persisted.state.isAuthenticated, true)

  localStorage.setItem('tg_init_data', 'signed-init-data')
  useAuthStore.getState().logout()
  assert.equal(localStorage.getItem('tg_init_data'), null)
  assert.equal(useAuthStore.getState().user, null)
  assert.equal(useAuthStore.getState().isAuthenticated, false)
  assert.deepEqual(JSON.parse(localStorage.getItem('auth-storage')).state, {
    user: null, isAuthenticated: false,
  })
})

test('clearing the user also clears authenticated state', () => {
  useAuthStore.getState().setUser({ id: 2, telegram_id: 456, first_name: 'Vali' })
  useAuthStore.getState().setUser(null)
  assert.equal(useAuthStore.getState().user, null)
  assert.equal(useAuthStore.getState().isAuthenticated, false)
})
