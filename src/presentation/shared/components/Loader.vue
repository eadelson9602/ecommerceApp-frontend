<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Texto bajo el spinner (opcional) */
    label?: string
    /** Tamaño: 'sm' | 'md' | 'lg' */
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { label: '', size: 'md' }
)
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 text-gray-500">
    <svg
      class="animate-spin text-gray-500"
      :class="{
        'h-5 w-5': size === 'sm',
        'h-8 w-8': size === 'md',
        'h-10 w-10': size === 'lg',
      }"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="3"
        fill="none"
        stroke-dasharray="48 16"
        stroke-linecap="round"
      />
    </svg>
    <p v-if="label" class="text-sm animate-pulse">{{ label }}</p>
  </div>
</template>
