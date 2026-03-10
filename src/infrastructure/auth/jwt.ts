/**
 * Lectura del payload JWT solo para comprobar expiración (sin verificación de firma).
 * Uso exclusivo en el cliente para cerrar sesión cuando el token ha expirado.
 */
export function getJwtExp(token: string): number | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    ) as { exp?: number }
    return decoded.exp ?? null
  } catch {
    return null
  }
}

/** Devuelve true si el token no tiene exp o si la fecha actual >= exp (en segundos). */
export function isJwtExpired(token: string): boolean {
  const exp = getJwtExp(token)
  if (exp == null) return true
  return Date.now() >= exp * 1000
}
