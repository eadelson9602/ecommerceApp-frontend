/** Entidad de dominio: Producto (backend Products Service). */
export interface Product {
  id: string
  type: string
  attributes?: {
    sku?: string
    name?: string
    price?: number
    status?: string
    createdAt?: string
    updatedAt?: string
  }
}

export interface ProductFilter {
  status?: string
  search?: string
  page?: number
  size?: number
  sort?: string
}
