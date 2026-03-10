import { defineStore } from 'pinia'
import type { AuthUser } from '@/domain/auth'

export interface AuthState {
  token: string | null
  username: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    username: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    setAuth(payload: AuthUser) {
      this.token = payload.token
      this.username = payload.username
    },
    clearAuth() {
      this.token = null
      this.username = null
    },
  },
  persist: true,
})
