<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProductsStore } from '../store/products.store'
import ProductList from '../components/ProductList.vue'
import PageContainer from '@/presentation/shared/components/PageContainer.vue'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()
const { filter } = storeToRefs(productsStore)

// Sincronizar paginación con la URL para que las peticiones al backend usen page/size
watch(
  () => ({ path: route.path, query: route.query }),
  () => {
    const q = route.query
    const pageFromUrl = q.page ? Math.max(1, parseInt(String(q.page), 10)) : undefined
    const sizeFromUrl = q.size ? Math.min(100, Math.max(1, parseInt(String(q.size), 10))) : undefined
    if (pageFromUrl != null || sizeFromUrl != null) {
      productsStore.setFilter({
        ...(pageFromUrl != null && !Number.isNaN(pageFromUrl) && { page: pageFromUrl }),
        ...(sizeFromUrl != null && !Number.isNaN(sizeFromUrl) && { size: sizeFromUrl }),
      })
    }
  },
  { immediate: true }
)

function updateQuery(partial: { page?: number; size?: number }) {
  const q = { ...route.query }
  if (partial.page != null) q.page = String(partial.page)
  if (partial.size != null) q.size = String(partial.size)
  router.replace({ query: q })
}

const page = computed(() => filter.value?.page ?? 1)
const size = computed(() => filter.value?.size ?? 20)
const totalPages = computed(() => {
  const total = productsStore.listTotalRecords ?? 0
  return Math.max(1, Math.ceil(total / (size.value || 1)))
})
const canPrev = computed(() => page.value > 1)
const canNext = computed(() => page.value < totalPages.value)

function setSearch(value: string) {
  productsStore.setFilter({ search: value, page: 1 })
  updateQuery({ page: 1, size: size.value })
}
function setStatus(value: string) {
  productsStore.setFilter({ status: value, page: 1 })
  updateQuery({ page: 1, size: size.value })
}
function setSort(value: string) {
  productsStore.setFilter({ sort: value, page: 1 })
  updateQuery({ page: 1, size: size.value })
}
function setSize(value: number) {
  const sizeClamped = Math.min(100, Math.max(1, value))
  productsStore.setFilter({ size: sizeClamped, page: 1 })
  updateQuery({ page: 1, size: sizeClamped })
}
function goToPage(p: number) {
  const newPage = Math.max(1, Math.min(p, totalPages.value))
  productsStore.setFilter({ page: newPage })
  updateQuery({ page: newPage, size: size.value })
}
</script>

<template>
  <PageContainer>
    <section class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-lg font-medium text-gray-900">Productos</h2>

        <!-- Filtros -->
        <div class="flex flex-wrap items-center gap-3">
          <label class="sr-only" for="search">Buscar</label>
          <input
            id="search"
            type="search"
            :value="filter.search"
            placeholder="Buscar..."
            class="rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            @input="setSearch(($event.target as HTMLInputElement).value)"
          />
          <label class="sr-only" for="status">Estado</label>
          <select
            id="status"
            :value="filter.status"
            class="rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            @change="setStatus(($event.target as HTMLSelectElement).value)"
          >
            <option value="">Todos los estados</option>
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
          </select>
          <label class="sr-only" for="sort">Ordenar</label>
          <select
            id="sort"
            :value="filter.sort"
            class="rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            @change="setSort(($event.target as HTMLSelectElement).value)"
          >
            <option value="">Sin orden</option>
            <option value="name">Nombre (A–Z)</option>
            <option value="-name">Nombre (Z–A)</option>
            <option value="price">Precio (menor a mayor)</option>
            <option value="-price">Precio (mayor a menor)</option>
          </select>
          <label class="sr-only" for="size">Filas por página</label>
          <select
            id="size"
            :value="filter.size"
            class="rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            @change="setSize(Number(($event.target as HTMLSelectElement).value))"
          >
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>

      <ProductList
        :page="page"
        :size="size"
        :status="filter.status"
        :search="filter.search"
        :sort="filter.sort"
      />

      <!-- Paginación (debajo de la tabla, el ProductList ya muestra "Mostrando X–Y de Z") -->
      <div
        v-if="productsStore.listTotalRecords != null && productsStore.listTotalRecords > 0"
        class="mt-3 flex items-center justify-between border-t border-gray-200 pt-3"
      >
        <span class="text-sm text-gray-500">
          Página {{ page }} de {{ totalPages }}
        </span>
        <div class="flex gap-2">
          <button
            type="button"
            :disabled="!canPrev"
            class="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            @click="goToPage(page - 1)"
          >
            Anterior
          </button>
          <button
            type="button"
            :disabled="!canNext"
            class="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            @click="goToPage(page + 1)"
          >
            Siguiente
          </button>
        </div>
      </div>
    </section>
  </PageContainer>
</template>
