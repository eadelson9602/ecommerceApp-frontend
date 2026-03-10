<script setup lang="ts">
import PageContainer from '@/presentation/shared/components/PageContainer.vue'
</script>

<template>
  <PageContainer>
    <section class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h2 class="mb-2 font-medium">Inventario</h2>
      <p class="text-sm text-gray-600">
        Consulta el inventario desde el detalle de cada producto en
        <router-link to="/products" class="text-blue-600 hover:underline">Productos</router-link>.
      </p>
    </section>
  </PageContainer>
</template>
