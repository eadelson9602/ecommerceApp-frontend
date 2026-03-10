import { defineQueryOptions } from '@pinia/colada'
import { apiGet } from '@/infrastructure/api/client'

export interface InventoryResponse {
  data?: { id: string; type: string; attributes?: Record<string, unknown> }
  errors?: Array<{ status: string; code: string; title: string; detail?: string }>
}

export const INVENTORY_QUERY_KEYS = {
  root: ['inventory'] as const,
  byProductId: (productId: string) => [...INVENTORY_QUERY_KEYS.root, productId] as const,
}

export const inventoryByProductQuery = defineQueryOptions((productId: string) => ({
  key: INVENTORY_QUERY_KEYS.byProductId(productId),
  query: () => apiGet<InventoryResponse>(`/api/inventory/${productId}`, 'inventory'),
}))
