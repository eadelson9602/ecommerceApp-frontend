import { defineQueryOptions } from '@pinia/colada'
import { apiGet } from '@/infrastructure/api/client'

export interface ProductsListResponse {
  data?: Array<{ id: string; type: string; attributes?: Record<string, unknown> }>
  meta?: { totalRecords?: number }
  links?: Record<string, string>
}

export interface ProductDetailResponse {
  data?: { id: string; type: string; attributes?: Record<string, unknown> }
  errors?: Array<{ status: string; code: string; title: string; detail?: string }>
}

export const PRODUCT_QUERY_KEYS = {
  root: ['products'] as const,
  list: (page = 1, size = 20, status = '', search = '', sort = '') =>
    [...PRODUCT_QUERY_KEYS.root, 'list', page, size, status, search, sort] as const,
  byId: (id: string) => [...PRODUCT_QUERY_KEYS.root, id] as const,
}

function buildListQueryString(
  page = 1,
  size = 20,
  status?: string,
  search?: string,
  sort?: string
): string {
  const params = new URLSearchParams()
  params.set('page[number]', String(page))
  params.set('page[size]', String(size))
  if (status) params.set('status', status)
  if (search) params.set('filter[search]', search)
  if (sort) params.set('sort', sort)
  return `?${params.toString()}`
}

export const productsListQuery = defineQueryOptions(
  (params: { page?: number; size?: number; status?: string; search?: string; sort?: string } = {}) => {
    const page = params.page ?? 1
    const size = params.size ?? 20
    const status = params.status ?? ''
    const search = params.search ?? ''
    const sort = params.sort ?? ''
    return {
      key: PRODUCT_QUERY_KEYS.list(page, size, status, search, sort),
      query: () =>
        apiGet<ProductsListResponse>(
          `/api/products${buildListQueryString(page, size, status || undefined, search || undefined, sort || undefined)}`
        ),
    }
  }
)

export const productDetailQuery = defineQueryOptions((id: string) => ({
  key: PRODUCT_QUERY_KEYS.byId(id),
  query: () => apiGet<ProductDetailResponse>(`/api/products/${id}`),
}))
