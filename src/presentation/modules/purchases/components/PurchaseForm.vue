<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { processPurchase, validatePurchaseInput } from '@/application/purchases/purchase-service'

const props = withDefaults(
  defineProps<{
    productId: string
    /** Nombre del producto para mostrar en el modal de confirmación */
    productName?: string
    /** Si se pasa, se valida cantidad <= available */
    available?: number
    /** Etiqueta del botón */
    submitLabel?: string
  }>(),
  { submitLabel: 'Comprar' }
)

const emit = defineEmits<{
  success: []
  error: [message: string]
}>()

const quantity = ref<number>(1)
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const message = ref('')
const showConfirmModal = ref(false)

const validation = computed(() =>
  validatePurchaseInput(props.productId, quantity.value, { available: props.available })
)
const canSubmit = computed(
  () => validation.value.valid && status.value !== 'loading' && (props.available == null || props.available >= 1)
)

const confirmSummary = computed(() => ({
  productName: props.productName || props.productId,
  quantity: quantity.value,
}))

function openConfirmModal() {
  if (!validation.value.valid) {
    status.value = 'error'
    message.value = validation.value.message
    emit('error', validation.value.message)
    return
  }
  showConfirmModal.value = true
}

function closeConfirmModal() {
  showConfirmModal.value = false
}

async function confirmPurchase() {
  message.value = ''
  status.value = 'loading'
  closeConfirmModal()
  const result = await processPurchase(props.productId, quantity.value, {
    available: props.available,
  })
  if (result.ok) {
    status.value = 'success'
    message.value = 'Compra realizada correctamente.'
    emit('success')
  } else {
    status.value = 'error'
    message.value = result.message
    emit('error', result.message)
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && showConfirmModal.value) closeConfirmModal()
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <form class="space-y-2" @submit.prevent="openConfirmModal">
    <div>
      <label for="purchase-qty" class="block text-xs font-medium text-gray-700">Cantidad</label>
      <input
        id="purchase-qty"
        v-model.number="quantity"
        type="number"
        min="1"
        :max="available"
        step="1"
        class="mt-0.5 w-20 rounded border border-gray-300 px-2 py-1 text-sm"
        :disabled="status === 'loading' || (available != null && available < 1)"
      />
      <p v-if="!validation.valid && quantity != null" class="mt-0.5 text-xs text-red-600">
        {{ validation.message }}
      </p>
    </div>
    <button
      type="submit"
      class="inline-flex items-center gap-2 rounded bg-gray-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-700 disabled:opacity-50"
      :disabled="!canSubmit"
    >
      <span
        v-if="status === 'loading'"
        class="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"
        aria-hidden="true"
      />
      {{ status === 'loading' ? 'Procesando…' : submitLabel }}
    </button>
    <p v-if="status === 'success'" class="mt-2 text-xs text-green-700">{{ message }}</p>
    <p v-else-if="status === 'error' && message" class="mt-2 text-xs text-red-600">{{ message }}</p>
  </form>

  <!-- Modal de confirmación -->
  <Teleport to="body">
    <div
      v-show="showConfirmModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-purchase-title"
    >
      <div
        class="absolute inset-0 bg-black/50"
        aria-hidden="true"
        @click="closeConfirmModal"
      />
      <div
        class="relative w-full max-w-sm rounded-lg bg-white p-5 shadow-xl"
        @click.stop
      >
        <h3
          id="confirm-purchase-title"
          class="text-lg font-semibold text-gray-900"
        >
          Confirmar compra
        </h3>
        <p class="mt-3 text-sm text-gray-600">
          Vas a comprar
          <strong class="text-gray-900">{{ confirmSummary.quantity }}</strong>
          {{ confirmSummary.quantity === 1 ? 'unidad' : 'unidades' }} de
          <strong class="text-gray-900">{{ confirmSummary.productName }}</strong
          >.
        </p>
        <p class="mt-1 text-xs text-gray-500">
          ¿Deseas continuar?
        </p>
        <div class="mt-5 flex justify-end gap-2">
          <button
            type="button"
            class="rounded border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            @click="closeConfirmModal"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="rounded bg-gray-800 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
            @click="confirmPurchase"
          >
            Sí, confirmar
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
