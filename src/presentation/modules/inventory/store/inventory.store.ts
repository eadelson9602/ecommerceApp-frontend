import { defineStore } from 'pinia'

/** Store de UI del módulo inventario. */
export interface InventoryUiState {
  selectedProductId: string | null
}

export const useInventoryStore = defineStore('inventory-ui', {
  state: (): InventoryUiState => ({
    selectedProductId: null,
  }),
  actions: {
    setSelectedProductId(id: string | null) {
      this.selectedProductId = id
    },
  },
})
