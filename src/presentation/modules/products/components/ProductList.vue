<script setup lang="ts">
import { computed, watch } from 'vue'
import { useQuery, useQueryCache } from '@pinia/colada'
import { useProductsStore } from '../store/products.store'
import { productsListQuery, PRODUCT_QUERY_KEYS } from '@/application/products/product-queries'
import Loader from '@/presentation/shared/components/Loader.vue'

interface ProductAttributes {
  name?: string
  sku?: string
  price?: number
  status?: string
}

const props = withDefaults(
  defineProps<{
    page?: number
    size?: number
    status?: string
    search?: string
    sort?: string
  }>(),
  { page: 1, size: 20, status: '', search: '', sort: '' }
)

const { state, asyncStatus } = useQuery(() =>
  productsListQuery({
    page: props.page,
    size: props.size,
    status: props.status,
    search: props.search,
    sort: props.sort,
  })
)

const items = computed(() => state.value.data?.data ?? [])
const totalRecords = computed(() => state.value.data?.meta?.totalRecords ?? 0)
const startRecord = computed(() => (props.page - 1) * props.size + 1)
const endRecord = computed(() =>
  Math.min(props.page * props.size, totalRecords.value)
)

const productsStore = useProductsStore()
const queryCache = useQueryCache()
watch(
  () => state.value.data?.meta?.totalRecords,
  (total) => {
    productsStore.setListTotalRecords(total ?? null)
  },
  { immediate: true }
)

function retry() {
  queryCache.invalidateQueries(
    {
      key: PRODUCT_QUERY_KEYS.list(props.page, props.size, props.status, props.search, props.sort),
      exact: true,
    },
    true
  )
}
</script>

<template>
  <div class="overflow-x-auto">
    <!-- Loading -->
    <div v-if="asyncStatus === 'loading'" class="flex justify-center py-12">
      <Loader label="Cargando productos…" size="md" />
    </div>

    <!-- Error -->
    <div
      v-else-if="state.error"
      class="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700"
      role="alert"
    >
      <p class="font-medium">Error al cargar productos</p>
      <p class="mt-1 text-sm">{{ state.error?.message }}</p>
      <button
        type="button"
        class="mt-2 rounded border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
        @click="retry"
      >
        Reintentar
      </button>
    </div>

    <!-- Empty -->
    <div
      v-else-if="!items.length"
      class="rounded border border-gray-200 bg-gray-50 px-4 py-8 text-center text-gray-600"
    >
      No hay productos que coincidan con los filtros.
    </div>

    <!-- Success: table -->
    <template v-else>
      <table class="min-w-full divide-y divide-gray-200 border border-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600"
            >
              Nombre
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600"
            >
              SKU
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-600"
            >
              Precio
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600"
            >
              Estado
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-600"
            >
              Acción
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr
            v-for="item in items"
            :key="item.id"
            class="hover:bg-gray-50"
          >
            <td class="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
              {{ (item.attributes as ProductAttributes)?.name ?? '—' }}
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
              {{ (item.attributes as ProductAttributes)?.sku ?? '—' }}
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900">
              {{ (item.attributes as ProductAttributes)?.price != null ? `$${(item.attributes as ProductAttributes).price}` : '—' }}
            </td>
            <td class="whitespace-nowrap px-4 py-3">
              <span
                class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                :class="
                  (item.attributes as ProductAttributes)?.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                "
              >
                {{ (item.attributes as ProductAttributes)?.status ?? '—' }}
              </span>
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-right text-sm">
              <router-link
                :to="`/products/${item.id}`"
                class="font-medium text-blue-600 hover:text-blue-800 hover:underline"
              >
                Ver detalle
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="mt-2 text-xs text-gray-500">
        Mostrando {{ startRecord }}–{{ endRecord }} de {{ totalRecords }}
      </p>
    </template>
  </div>
</template>
