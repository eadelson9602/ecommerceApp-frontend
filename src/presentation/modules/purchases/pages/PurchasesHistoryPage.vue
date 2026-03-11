<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useQuery, useQueryCache } from '@pinia/colada'
import { useRoute, useRouter } from 'vue-router'
import {
  purchasesListQuery,
  PURCHASES_QUERY_KEYS,
} from '@/application/purchases/purchase-queries'
import PageContainer from '@/presentation/shared/components/PageContainer.vue'
import Loader from '@/presentation/shared/components/Loader.vue'

const route = useRoute()
const router = useRouter()
const queryCache = useQueryCache()

const page = computed(() => {
  const q = route.query.page
  const n = q ? parseInt(String(q), 10) : 1
  return Number.isNaN(n) || n < 1 ? 1 : n
})
const size = computed(() => {
  const q = route.query.size
  const n = q ? parseInt(String(q), 10) : 20
  if (Number.isNaN(n)) return 20
  return Math.min(100, Math.max(1, n))
})

const queryOptions = computed(() =>
  purchasesListQuery({ page: page.value, size: size.value })
)
const { state, asyncStatus } = useQuery(() => queryOptions.value)

onMounted(() => {
  queryCache.invalidateQueries(
    { key: PURCHASES_QUERY_KEYS.list(page.value, size.value), exact: true },
    true
  )
})

const items = computed(() => state.value.data?.data ?? [])
const totalRecords = computed(() => state.value.data?.meta?.totalRecords ?? 0)
const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalRecords.value / size.value))
)
const canPrev = computed(() => page.value > 1)
const canNext = computed(() => page.value < totalPages.value)

function retry() {
  queryCache.invalidateQueries(
    { key: PURCHASES_QUERY_KEYS.list(page.value, size.value), exact: true },
    true
  )
}

function formatDate(iso?: string) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('es-ES', {
      dateStyle: 'short',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

function updateQuery(partial: { page?: number; size?: number }) {
  const q = { ...route.query }
  if (partial.page != null) q.page = String(partial.page)
  if (partial.size != null) q.size = String(partial.size)
  router.replace({ query: q })
}

function goToPage(p: number) {
  const newPage = Math.max(1, Math.min(p, totalPages.value))
  updateQuery({ page: newPage, size: size.value })
}
</script>

<template>
  <PageContainer>
    <section class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h2 class="mb-4 text-lg font-medium text-gray-900">
        Compras realizadas
      </h2>

      <div v-if="asyncStatus === 'loading'" class="flex justify-center py-12">
        <Loader label="Cargando compras…" size="md" />
      </div>

      <div
        v-else-if="asyncStatus === 'error'"
        class="py-6 text-center"
        role="alert"
      >
        <p class="text-red-600">
          No se pudieron cargar las compras. Intenta de nuevo.
        </p>
        <button
          type="button"
          class="mt-3 rounded border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          @click="retry"
        >
          Reintentar
        </button>
      </div>

      <template v-else>
        <div class="overflow-x-auto">
          <table
            v-if="items.length > 0"
            class="min-w-full divide-y divide-gray-200 text-left text-sm"
          >
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 font-medium text-gray-700">ID compra</th>
                <th class="px-4 py-2 font-medium text-gray-700">Producto (ID)</th>
                <th class="px-4 py-2 font-medium text-gray-700">Cantidad</th>
                <th class="px-4 py-2 font-medium text-gray-700">Fecha</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr
                v-for="row in items"
                :key="row.id"
                class="hover:bg-gray-50"
              >
                <td class="px-4 py-2 font-mono text-gray-700">{{ row.id }}</td>
                <td class="px-4 py-2 font-mono text-gray-700">
                  {{ row.attributes?.productId ?? '—' }}
                </td>
                <td class="px-4 py-2 text-gray-700">
                  {{ row.attributes?.quantity ?? '—' }}
                </td>
                <td class="px-4 py-2 text-gray-600">
                  {{ formatDate(row.attributes?.processedAt) }}
                </td>
              </tr>
            </tbody>
          </table>
          <p
            v-else
            class="py-8 text-center text-gray-500"
          >
            No hay compras registradas.
          </p>
        </div>

        <div
          v-if="totalRecords > 0"
          class="mt-3 flex items-center justify-between border-t border-gray-200 pt-3"
        >
          <span class="text-sm text-gray-500">
            Total: {{ totalRecords }} compra(s). Página {{ page }} de {{ totalPages }}.
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
      </template>
    </section>
  </PageContainer>
</template>
