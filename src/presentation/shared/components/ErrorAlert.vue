<script setup lang="ts">
defineProps<{
  message: string
}>()
defineEmits<{
  retry: []
}>()
</script>

<template>
  <div
    class="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700"
    role="alert"
    aria-live="polite"
  >
    <p>{{ message }}</p>
    <button
      type="button"
      class="mt-2 rounded border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
      @click="$emit('retry')"
    >
      Reintentar
    </button>
  </div>
</template>
