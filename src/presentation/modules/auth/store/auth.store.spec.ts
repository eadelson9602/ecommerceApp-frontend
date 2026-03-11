import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from './auth.store'

describe('auth.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('inicialmente no está autenticado', () => {
    const store = useAuthStore()
    expect(store.token).toBeNull()
    expect(store.username).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('setAuth guarda token y username y marca autenticado', () => {
    const store = useAuthStore()
    store.setAuth({ token: 'jwt-123', username: 'test' })
    expect(store.token).toBe('jwt-123')
    expect(store.username).toBe('test')
    expect(store.isAuthenticated).toBe(true)
  })

  it('clearAuth limpia token y username', () => {
    const store = useAuthStore()
    store.setAuth({ token: 'jwt-123', username: 'test' })
    store.clearAuth()
    expect(store.token).toBeNull()
    expect(store.username).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })
})
