<script setup lang="ts">
/**
 * Layout principal de la aplicación: cabecera de navegación + área de contenido.
 */
import AppHeader from '@/presentation/shared/components/AppHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <AppHeader />
    <RouterView />
  </div>
</template>
