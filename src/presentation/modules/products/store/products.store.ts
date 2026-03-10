import { defineStore } from 'pinia'
import type { ProductFilter } from '@/domain/product'

/** Store de UI/estado local del módulo productos (filtros, paginación). */
export interface ProductsUiState {
  filter: Partial<ProductFilter>
  /** Total de registros de la última lista cargada (para paginación). */
  listTotalRecords: number | null
}

export const useProductsStore = defineStore('products-ui', {
  state: (): ProductsUiState => ({
    filter: {
      page: 1,
      size: 20,
      status: '',
      search: '',
      sort: '',
    },
    listTotalRecords: null,
  }),
  actions: {
    setFilter(partial: Partial<ProductFilter>) {
      this.filter = { ...this.filter, ...partial }
    },
    setListTotalRecords(total: number | null) {
      this.listTotalRecords = total
    },
  },
})
