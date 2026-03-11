import {
  getApiErrorMessage,
  getTimeoutErrorMessage,
  DEFAULT_REQUEST_TIMEOUT_MS,
} from './api-errors'

export const JSON_API_MEDIA_TYPE = 'application/vnd.api+json'
const API_VERSION = '/api/v1'

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

function withApiVersion(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return p.startsWith(API_VERSION) ? p : p.replace(/^\/api\b/, API_VERSION)
}

export function getProductsApiUrl(path: string): string {
  const base = PRODUCTS_BASE.replace(/\/$/, '')
  return `${base}${withApiVersion(path)}`
}

export function getInventoryApiUrl(path: string): string {
  const base = INVENTORY_BASE.replace(/\/$/, '')
  return `${base}${withApiVersion(path)}`
}

export interface RequestOptions extends RequestInit {
  jsonApi?: boolean
  base?: 'products' | 'inventory'
  timeoutMs?: number
}

export async function apiFetch(
  path: string,
  options: RequestOptions = {}
): Promise<Response> {
  const {
    jsonApi = true,
    base = 'products',
    timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS,
    signal: outerSignal,
    ...init
  } = options
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

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  const signal = outerSignal ?? controller.signal

  try {
    const res = await fetch(url, { ...init, headers, signal })
    clearTimeout(timeoutId)
    if (res.status === 401) {
      const { useAuthStore } = await import(
        '@/presentation/modules/auth/store/auth.store'
      )
      const router = (await import('@/router')).default
      useAuthStore().clearAuth()
      router.push({ name: 'Login', query: { redirect: window.location.pathname } })
    }
    return res
  } catch (err) {
    clearTimeout(timeoutId)
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(getTimeoutErrorMessage(timeoutMs))
    }
    throw err
  }
}

export async function apiGet<T>(
  path: string,
  base: 'products' | 'inventory' = 'products',
  options?: { timeoutMs?: number }
): Promise<T> {
  const res = await apiFetch(path, { method: 'GET', base, ...options })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(getApiErrorMessage(res.status, text, options))
  }
  return JSON.parse(text || 'null') as T
}

export async function apiMutate(
  path: string,
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  body?: unknown,
  base: 'products' | 'inventory' = 'products',
  options?: { timeoutMs?: number; headers?: HeadersInit }
): Promise<Response> {
  return apiFetch(path, {
    method,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    base,
    headers: options?.headers,
    timeoutMs: options?.timeoutMs,
  })
}

export async function apiPurchase(
  productId: string,
  quantity: number,
  idempotencyKey: string
): Promise<{ ok: true } | { ok: false; message: string; status: number }> {
  const headers = new Headers()
  headers.set('Idempotency-Key', idempotencyKey)
  const body = {
    data: {
      type: 'purchase',
      attributes: { productId, quantity },
    },
  }
  const res = await apiMutate(
    '/api/purchases',
    'POST',
    body,
    'inventory',
    { headers }
  )
  const text = await res.text()
  if (res.ok) return { ok: true }
  return {
    ok: false,
    status: res.status,
    message: getApiErrorMessage(res.status, text),
  }
}
