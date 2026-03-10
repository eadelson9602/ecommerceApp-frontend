<script setup lang="ts">
import { useQuery } from '@pinia/colada'
import { inventoryByProductQuery } from '@/application/inventory/inventory-queries'

const props = defineProps<{ productId: string }>()

const { state, asyncStatus } = useQuery(() => inventoryByProductQuery(props.productId))
</script>

<template>
  <div class="rounded border border-gray-200 bg-gray-50 p-3">
    <h4 class="text-sm font-medium text-gray-700">Inventario</h4>
    <div v-if="asyncStatus === 'loading'" class="mt-1 text-xs text-gray-500">Cargando…</div>
    <div v-else-if="state.error" class="mt-1 text-xs text-red-600">{{ state.error?.message }}</div>
    <dl v-else-if="state.data?.data?.attributes" class="mt-1 space-y-0.5 text-xs text-gray-600">
      <div v-for="(val, key) in state.data.data.attributes" :key="key">
        <dt class="inline font-medium">{{ key }}:</dt>
        <dd class="inline ml-1">{{ val }}</dd>
      </div>
    </dl>
    <p v-else class="mt-1 text-xs text-gray-500">Sin datos</p>
  </div>
</template>
