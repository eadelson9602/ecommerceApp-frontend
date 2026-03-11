<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery, useQueryCache } from '@pinia/colada'
import { productsListQuery, PRODUCT_QUERY_KEYS } from '@/application/products/product-queries'
import { inventoryByProductQuery, INVENTORY_QUERY_KEYS } from '@/application/inventory/inventory-queries'
import PageContainer from '@/presentation/shared/components/PageContainer.vue'
import Loader from '@/presentation/shared/components/Loader.vue'
import PurchaseForm from '../components/PurchaseForm.vue'

const selectedProductId = ref<string>('')
const queryCache = useQueryCache()

const { state: productsState, asyncStatus: productsStatus } = useQuery(() =>
  productsListQuery({ page: 1, size: 100 })
)
const productOptions = computed(() => {
  const data = productsState.value.data?.data ?? []
  return data.map((p: { id: string; attributes?: { name?: string; sku?: string } }) => ({
    id: p.id,
    label: (p.attributes?.name ?? p.attributes?.sku) || p.id,
  }))
})
const selectedProductName = computed(
  () => productOptions.value.find((o) => o.id === selectedProductId.value)?.label ?? ''
)

const { state: inventoryState } = useQuery(() => {
  if (!selectedProductId.value) {
    return {
      key: ['inventory', 'skip'] as const,
      query: async () => ({ data: undefined }),
    }
  }
  return inventoryByProductQuery(selectedProductId.value)
})
const available = computed(() => {
  if (!selectedProductId.value || !inventoryState.value.data?.data?.attributes) return undefined
  const attrs = inventoryState.value.data.data.attributes as { available?: number }
  return attrs.available ?? 0
})

function onPurchaseSuccess() {
  if (selectedProductId.value) {
    queryCache.invalidateQueries(
      { key: INVENTORY_QUERY_KEYS.byProductId(selectedProductId.value), exact: true },
      true
    )
  }
}

function retryProducts() {
  queryCache.invalidateQueries(
    { key: PRODUCT_QUERY_KEYS.list(1, 100), exact: true },
    true
  )
}

function retryInventory() {
  if (selectedProductId.value) {
    queryCache.invalidateQueries(
      { key: INVENTORY_QUERY_KEYS.byProductId(selectedProductId.value), exact: true },
      true
    )
  }
}
</script>

<template>
  <PageContainer>
    <section class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h2 class="mb-4 text-lg font-medium text-gray-900">Realizar compra</h2>
      <p class="mb-4 text-sm text-gray-600">
        Elige un producto y la cantidad. El backend valida producto, stock e idempotencia.
      </p>

      <div v-if="productsStatus === 'loading'" class="flex justify-center py-8">
        <Loader label="Cargando productos…" size="md" />
      </div>
      <div
        v-else-if="productsState.error"
        class="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        role="alert"
      >
        <p>{{ productsState.error?.message }}</p>
        <button
          type="button"
          class="mt-2 rounded border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
          @click="retryProducts"
        >
          Reintentar
        </button>
      </div>
      <template v-else>
        <div class="space-y-4">
          <div>
            <label for="purchase-product" class="block text-sm font-medium text-gray-700">Producto</label>
            <select
              id="purchase-product"
              v-model="selectedProductId"
              class="mt-1 block w-full max-w-md rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">— Selecciona un producto —</option>
              <option v-for="opt in productOptions" :key="opt.id" :value="opt.id">
                {{ opt.label }}
              </option>
            </select>
          </div>

          <template v-if="selectedProductId">
            <div v-if="inventoryState.data?.data?.attributes" class="rounded border border-gray-200 bg-gray-50 p-3">
              <h4 class="text-sm font-medium text-gray-700">Inventario</h4>
              <p class="mt-1 text-xs text-gray-600">
                Disponible: <strong>{{ available }}</strong>
              </p>
              <div class="mt-3 border-t border-gray-200 pt-3">
                <PurchaseForm
                  :product-id="selectedProductId"
                  :product-name="selectedProductName"
                  :available="available"
                  submit-label="Confirmar compra"
                  @success="onPurchaseSuccess"
                />
              </div>
            </div>
            <div
              v-else-if="inventoryState.error"
              class="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              role="alert"
            >
              <p>{{ inventoryState.error?.message }}</p>
              <button
                type="button"
                class="mt-2 rounded border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
                @click="retryInventory"
              >
                Reintentar
              </button>
            </div>
            <div v-else class="flex justify-center py-4">
              <Loader label="Cargando inventario…" size="sm" />
            </div>
          </template>
        </div>
      </template>
    </section>
  </PageContainer>
</template>
