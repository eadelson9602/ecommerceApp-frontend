<script setup lang="ts">
import { useQuery } from '@pinia/colada'
import { useRoute } from 'vue-router'
import { productDetailQuery } from '@/application/products/product-queries'
import PageContainer from '@/presentation/shared/components/PageContainer.vue'
import InventoryCard from '@/presentation/modules/inventory/components/InventoryCard.vue'

const route = useRoute()
const id = route.params.id as string

const { state: productState, asyncStatus: productStatus } = useQuery(() => productDetailQuery(id))
</script>

<template>
  <PageContainer>
    <div v-if="productStatus === 'loading'" class="text-gray-500">Cargando…</div>
    <div v-else-if="productState.error" class="text-red-600">
      {{ productState.error?.message }}
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
