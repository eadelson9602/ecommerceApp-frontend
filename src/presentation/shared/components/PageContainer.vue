<script setup lang="ts">
defineSlots<{
  default?: () => unknown
}>()
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-8">
    <slot />
  </main>
</template>
