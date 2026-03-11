import type { RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '../store/auth.store'
import { isJwtExpired } from '@/infrastructure/auth/jwt'

/**
 * Guard de autenticación: redirige a login si no hay token o si el JWT ha expirado.
 * En ese caso cierra la sesión antes de redirigir.
 */
export function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized
): void | { name: string; query: { redirect?: string; expired?: string } } {
  if (to.meta.public) {
    return
  }

  const authStore = useAuthStore()
  const token = authStore.token

  if (!token) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }

  if (isJwtExpired(token)) {
    authStore.clearAuth()
    return { name: 'Login', query: { redirect: to.fullPath, expired: '1' } }
  }

  if (to.meta.requiresPurchasesHistory && !authStore.canViewPurchasesHistory) {
    return { name: 'Home' }
  }
}
