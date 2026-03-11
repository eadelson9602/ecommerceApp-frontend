<script setup lang="ts">
import { useQuery, useQueryCache } from '@pinia/colada'
import { useRoute } from 'vue-router'
import { productDetailQuery, PRODUCT_QUERY_KEYS } from '@/application/products/product-queries'
import PageContainer from '@/presentation/shared/components/PageContainer.vue'
import Loader from '@/presentation/shared/components/Loader.vue'
import InventoryCard from '@/presentation/modules/inventory/components/InventoryCard.vue'

const route = useRoute()
const id = route.params.id as string
const queryCache = useQueryCache()

const { state: productState, asyncStatus: productStatus } = useQuery(() => productDetailQuery(id))

function retry() {
  queryCache.invalidateQueries(
    { key: PRODUCT_QUERY_KEYS.byId(id), exact: true },
    true
  )
}
</script>

<template>
  <PageContainer>
    <div v-if="productStatus === 'loading'" class="flex justify-center py-12">
      <Loader label="Cargando producto…" size="md" />
    </div>
    <div v-else-if="productState.error" class="space-y-2 text-red-600">
      <p>{{ productState.error?.message }}</p>
      <button
        type="button"
        class="rounded border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
        @click="retry"
      >
        Reintentar
      </button>
    </div>
    <div v-else-if="productState.data?.data" class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h2 class="mb-2 font-medium">{{ (productState.data.data.attributes as { name?: string })?.name ?? productState.data.data.id }}</h2>
      <dl class="space-y-1 text-sm">
        <template v-if="productState.data.data.attributes">
          <div v-for="(val, key) in productState.data.data.attributes" :key="key">
            <dt class="inline font-medium">{{ key }}:</dt>
            <dd class="inline ml-1">{{ val }}</dd>
          </div>
        </template>
      </dl>
      <div class="mt-4 border-t border-gray-200 pt-4">
        <InventoryCard :product-id="id" />
      </div>
    </div>
  </PageContainer>
</template>
