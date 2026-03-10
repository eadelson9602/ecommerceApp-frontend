<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductsStore } from '../store/products.store'
import ProductList from '../components/ProductList.vue'
import PageContainer from '@/presentation/shared/components/PageContainer.vue'

const productsStore = useProductsStore()
const { filter } = storeToRefs(productsStore)

const page = computed(() => filter.page ?? 1)
const size = computed(() => filter.size ?? 20)
const totalPages = computed(() => {
  const total = productsStore.listTotalRecords ?? 0
  return Math.max(1, Math.ceil(total / (size.value || 1)))
})
const canPrev = computed(() => page.value > 1)
const canNext = computed(() => page.value < totalPages.value)

function setSearch(value: string) {
  productsStore.setFilter({ search: value, page: 1 })
}
function setStatus(value: string) {
  productsStore.setFilter({ status: value, page: 1 })
}
function setSort(value: string) {
  productsStore.setFilter({ sort: value, page: 1 })
}
function setSize(value: number) {
  productsStore.setFilter({ size: value, page: 1 })
}
function goToPage(p: number) {
  productsStore.setFilter({ page: Math.max(1, Math.min(p, totalPages.value)) })
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
