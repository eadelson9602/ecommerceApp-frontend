import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '../store/auth.store'
import { isJwtExpired } from '@/infrastructure/auth/jwt'

/**
 * Guard de autenticación: redirige a login si no hay token o si el JWT ha expirado.
 * En ese caso cierra la sesión antes de redirigir.
 */
export function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  if (to.meta.public) {
    next()
    return
  }

  const authStore = useAuthStore()
  const token = authStore.token

  if (!token) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  if (isJwtExpired(token)) {
    authStore.clearAuth()
    next({ name: 'Login', query: { redirect: to.fullPath, expired: '1' } })
    return
  }

  next()
}
