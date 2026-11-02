const { test, afterEach } = require('node:test')
const assert = require('node:assert/strict')
const telegram = require('../lib/telegram/init.ts')

afterEach(() => {
  delete globalThis.window
  delete globalThis.document
})

test('server rendering and browsers outside Telegram return safe defaults', () => {
  const defaults = { initData: '', user: null, theme: 'light' }
  assert.deepEqual(telegram.initTelegramWebApp(), defaults)
  assert.doesNotThrow(() => {
    telegram.showBackButton(() => {})
    telegram.hideBackButton()
    telegram.showMainButton('Save', () => {})
    telegram.hideMainButton()
    telegram.setMainButtonLoading(true)
    telegram.showAlert('Hello')
    telegram.showConfirm('Continue?', () => {})
    telegram.hapticFeedback('success')
  })
  globalThis.window = {}
  assert.deepEqual(telegram.initTelegramWebApp(), defaults)
})

test('Telegram initialization returns identity, expands the app and reacts to theme changes', () => {
  const user = { id: 123, first_name: 'Ali' }
  const attributes = new Map()
  const calls = []
  let themeChanged
  const webApp = {
    initData: 'signed-init-data', initDataUnsafe: { user }, colorScheme: 'dark',
    ready: () => calls.push('ready'),
    expand: () => calls.push('expand'),
    onEvent: (event, callback) => {
      assert.equal(event, 'themeChanged')
      themeChanged = callback
    },
  }
  globalThis.window = { Telegram: { WebApp: webApp } }
  globalThis.document = { documentElement: {
    setAttribute: (name, value) => attributes.set(name, value),
    removeAttribute: (name) => attributes.delete(name),
  } }
  assert.deepEqual(telegram.initTelegramWebApp(), { initData: 'signed-init-data', user, theme: 'dark' })
  assert.deepEqual(calls, ['ready', 'expand'])
  assert.equal(attributes.get('data-theme'), 'dark')
  webApp.colorScheme = 'light'
  themeChanged()
  assert.equal(attributes.has('data-theme'), false)
  webApp.colorScheme = 'dark'
  themeChanged()
  assert.equal(attributes.get('data-theme'), 'dark')
})

test('main button preserves the action callback and toggles progress', () => {
  const calls = []
  let click
  globalThis.window = { Telegram: { WebApp: { MainButton: {
    setText: (text) => calls.push(text),
    show: () => calls.push('show'),
    hide: () => calls.push('hide'),
    onClick: (callback) => { click = callback },
    showProgress: () => calls.push('loading'),
    hideProgress: () => calls.push('loaded'),
  } } } }
  const save = () => calls.push('saved')
  telegram.showMainButton('Save task', save)
  assert.equal(click, save)
  click()
  telegram.setMainButtonLoading(true)
  telegram.setMainButtonLoading(false)
  telegram.hideMainButton()
  assert.deepEqual(calls, ['Save task', 'show', 'saved', 'loading', 'loaded', 'hide'])
})

test('haptic feedback separates impacts from notifications', () => {
  const calls = []
  globalThis.window = { Telegram: { WebApp: { HapticFeedback: {
    impactOccurred: (type) => calls.push(['impact', type]),
    notificationOccurred: (type) => calls.push(['notification', type]),
  } } } }
  for (const type of ['light', 'medium', 'heavy', 'error', 'success', 'warning']) {
    telegram.hapticFeedback(type)
  }
  assert.deepEqual(calls, [
    ['impact', 'light'], ['impact', 'medium'], ['impact', 'heavy'],
    ['notification', 'error'], ['notification', 'success'], ['notification', 'warning'],
  ])
})
