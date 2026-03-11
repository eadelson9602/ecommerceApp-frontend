<script setup lang="ts">
import AppHeader from '@/presentation/shared/components/AppHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <AppHeader />
    <RouterView />
  </div>
</template>
