import { defineQueryOptions } from '@pinia/colada'
import { apiGet } from '@/infrastructure/api/client'

export interface PurchasesListResponse {
  data?: Array<{
    id: string
    type: string
    attributes?: {
      productId?: string
      quantity?: number
      processedAt?: string
    }
  }>
  meta?: { totalRecords?: number }
}

export const PURCHASES_QUERY_KEYS = {
  root: ['purchases'] as const,
  list: (page = 1, size = 20) =>
    [...PURCHASES_QUERY_KEYS.root, 'list', page, size] as const,
}

function buildPurchasesListQueryString(page = 1, size = 20): string {
  const params = new URLSearchParams()
  params.set('page[number]', String(page))
  params.set('page[size]', String(size))
  return `?${params.toString()}`
}

export const purchasesListQuery = defineQueryOptions(
  (params: { page?: number; size?: number } = {}) => {
    const page = params.page ?? 1
    const size = params.size ?? 20
    return {
      key: PURCHASES_QUERY_KEYS.list(page, size),
      query: () =>
        apiGet<PurchasesListResponse>(
          `/api/purchases${buildPurchasesListQueryString(page, size)}`,
          'inventory'
        ),
    }
  }
)
