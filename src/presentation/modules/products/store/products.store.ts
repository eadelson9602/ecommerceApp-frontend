import { defineStore } from 'pinia'
import type { ProductFilter } from '@/domain/product'

export interface ProductsUiState {
  filter: Partial<ProductFilter>
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
