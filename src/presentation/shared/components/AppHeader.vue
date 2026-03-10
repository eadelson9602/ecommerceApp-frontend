<script setup lang="ts">
import { useAuthStore } from '@/presentation/modules/auth/store/auth.store'
import { RouterLink } from 'vue-router'

const authStore = useAuthStore()
</script>

<template>
  <header class="border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
    <div class="mx-auto flex max-w-6xl items-center justify-between">
      <RouterLink to="/" class="text-xl font-semibold text-gray-900 hover:text-gray-700">
        E-commerce App
      </RouterLink>
      <nav class="flex items-center gap-4">
        <RouterLink
          to="/products"
          class="text-sm text-gray-600 hover:text-gray-900"
          active-class="font-medium text-gray-900"
        >
          Productos
        </RouterLink>
        <RouterLink
          to="/inventory"
          class="text-sm text-gray-600 hover:text-gray-900"
          active-class="font-medium text-gray-900"
        >
          Inventario
        </RouterLink>
        <RouterLink
          v-if="!authStore.isAuthenticated"
          to="/login"
          class="text-sm text-gray-600 hover:text-gray-900"
        >
          Entrar
        </RouterLink>
        <span v-if="authStore.isAuthenticated" class="text-sm text-gray-500">
          {{ authStore.username }}
        </span>
        <span v-else class="text-sm text-gray-500">Sin sesión</span>
      </nav>
    </div>
  </header>
</template>
