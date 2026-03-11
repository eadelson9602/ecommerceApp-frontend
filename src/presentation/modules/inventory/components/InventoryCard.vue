<script setup lang="ts">
import { computed } from 'vue'
import { useQuery, useQueryCache } from '@pinia/colada'
import { inventoryByProductQuery, INVENTORY_QUERY_KEYS } from '@/application/inventory/inventory-queries'
import Loader from '@/presentation/shared/components/Loader.vue'
import PurchaseForm from '@/presentation/modules/purchases/components/PurchaseForm.vue'

const props = defineProps<{ productId: string }>()

const { state, asyncStatus } = useQuery(() => inventoryByProductQuery(props.productId))
const queryCache = useQueryCache()

const available = computed(() => {
  const attrs = state.value.data?.data?.attributes as { available?: number } | undefined
  return attrs?.available ?? 0
})

async function retry() {
  await queryCache.invalidateQueries(
    { key: INVENTORY_QUERY_KEYS.byProductId(props.productId), exact: true },
    true
  )
}

function onPurchaseSuccess() {
  queryCache.invalidateQueries(
    { key: INVENTORY_QUERY_KEYS.byProductId(props.productId), exact: true },
    true
  )
}
</script>

<template>
  <div class="rounded border border-gray-200 bg-gray-50 p-3">
    <h4 class="text-sm font-medium text-gray-700">Inventario</h4>
    <div v-if="asyncStatus === 'loading'" class="mt-2 flex justify-center py-2">
      <Loader label="Cargando inventario…" size="sm" />
    </div>
    <div v-else-if="state.error" class="mt-1 space-y-2">
      <p class="text-xs text-red-600">{{ state.error?.message }}</p>
      <button
        type="button"
        class="text-xs font-medium text-blue-600 hover:text-blue-800 underline"
        @click="retry"
      >
        Reintentar
      </button>
    </div>
    <template v-else-if="state.data?.data?.attributes">
      <dl class="mt-1 space-y-0.5 text-xs text-gray-600">
        <div v-for="(val, key) in state.data.data.attributes" :key="key">
          <dt class="inline font-medium">{{ key }}:</dt>
          <dd class="inline ml-1">{{ val }}</dd>
        </div>
      </dl>
      <div class="mt-3 border-t border-gray-200 pt-3">
        <PurchaseForm
          :product-id="productId"
          :available="available"
          @success="onPurchaseSuccess"
        />
      </div>
    </template>
    <p v-else class="mt-1 text-xs text-gray-500">Sin datos</p>
  </div>
</template>
