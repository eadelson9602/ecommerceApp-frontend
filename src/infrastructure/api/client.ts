/**
 * Cliente HTTP para el backend ecommerceApp (Products 8080, Inventory 8081).
 * JSON:API y JWT opcional (lee de localStorage clave 'auth').
 */
export const JSON_API_MEDIA_TYPE = 'application/vnd.api+json'

const PRODUCTS_BASE =
  import.meta.env.VITE_PRODUCTS_API_URL ?? 'http://localhost:8080'
const INVENTORY_BASE =
  import.meta.env.VITE_INVENTORY_API_URL ?? 'http://localhost:8081'

const AUTH_STORAGE_KEY = 'auth'

function getAuthToken(): string | null {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!stored) return null
    const data = JSON.parse(stored) as { token?: string }
    return data.token ?? null
  } catch {
    return null
  }
}

export function getProductsApiUrl(path: string): string {
  const base = PRODUCTS_BASE.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

export function getInventoryApiUrl(path: string): string {
  const base = INVENTORY_BASE.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

export interface RequestOptions extends RequestInit {
  jsonApi?: boolean
  base?: 'products' | 'inventory'
}

export async function apiFetch(
  path: string,
  options: RequestOptions = {}
): Promise<Response> {
  const { jsonApi = true, base = 'products', ...init } = options
  const url =
    base === 'inventory' ? getInventoryApiUrl(path) : getProductsApiUrl(path)
  const token = getAuthToken()

  const headers = new Headers(init.headers)
  if (jsonApi) {
    headers.set('Accept', JSON_API_MEDIA_TYPE)
    if (init.method !== 'GET' && init.body !== undefined) {
      headers.set('Content-Type', JSON_API_MEDIA_TYPE)
    }
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(url, { ...init, headers })

  if (res.status === 401) {
    const { useAuthStore } = await import(
      '@/presentation/modules/auth/store/auth.store'
    )
    const router = (await import('@/router')).default
    useAuthStore().clearAuth()
    router.push({ name: 'Login', query: { redirect: window.location.pathname } })
  }

  return res
}

export async function apiGet<T>(
  path: string,
  base: 'products' | 'inventory' = 'products'
): Promise<T> {
  const res = await apiFetch(path, { method: 'GET', base })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API ${res.status}: ${text || res.statusText}`)
  }
  return res.json() as Promise<T>
}

export async function apiMutate(
  path: string,
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  body?: unknown,
  base: 'products' | 'inventory' = 'products'
): Promise<Response> {
  const res = await apiFetch(path, {
    method,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    base,
  })
  return res
}
