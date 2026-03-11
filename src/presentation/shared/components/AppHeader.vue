<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/presentation/modules/auth/store/auth.store'
import { RouterLink } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const menuOpen = ref(false)

function logout() {
  authStore.clearAuth()
  menuOpen.value = false
  router.push({ name: 'Login' })
}

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <header class="border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
    <div class="mx-auto flex max-w-6xl items-center justify-between">
      <RouterLink
        to="/"
        class="text-xl font-semibold text-gray-900 hover:text-gray-700"
        @click="closeMenu"
      >
        E-commerce App
      </RouterLink>

      <!-- Desktop: menú horizontal -->
      <nav class="hidden items-center gap-4 md:flex">
        <RouterLink
          to="/products"
          class="text-sm text-gray-600 hover:text-gray-900"
          active-class="font-medium text-gray-900"
        >
          Productos
        </RouterLink>
        <RouterLink
          to="/compras"
          class="text-sm text-gray-600 hover:text-gray-900"
          active-class="font-medium text-gray-900"
        >
          Compras
        </RouterLink>
        <RouterLink
          v-if="authStore.canViewPurchasesHistory"
          to="/compras-realizadas"
          class="text-sm text-gray-600 hover:text-gray-900"
          active-class="font-medium text-gray-900"
        >
          Compras realizadas
        </RouterLink>
        <RouterLink
          v-if="!authStore.isAuthenticated"
          to="/login"
          class="text-sm text-gray-600 hover:text-gray-900"
        >
          Entrar
        </RouterLink>
        <template v-else>
          <span class="text-sm text-gray-500">{{ authStore.username }}</span>
          <button
            type="button"
            class="text-sm text-gray-600 hover:text-gray-900"
            @click="logout"
          >
            Cerrar sesión
          </button>
        </template>
      </nav>

      <!-- Mobile: botón hamburguesa -->
      <div class="flex items-center gap-2 md:hidden">
        <span
          v-if="authStore.isAuthenticated"
          class="max-w-[100px] truncate text-sm text-gray-500"
          :title="authStore.username ?? ''"
        >
          {{ authStore.username }}
        </span>
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
          :aria-expanded="menuOpen"
          aria-label="Abrir menú"
          @click="menuOpen = !menuOpen"
        >
          <svg
            v-if="!menuOpen"
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            v-else
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile: menú desplegable -->
    <div
      v-show="menuOpen"
      class="border-t border-gray-200 bg-white md:hidden"
      role="dialog"
      aria-label="Menú de navegación"
    >
      <nav class="flex flex-col py-2">
        <RouterLink
          to="/products"
          class="px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          active-class="font-medium text-gray-900 bg-gray-50"
          @click="closeMenu"
        >
          Productos
        </RouterLink>
        <RouterLink
          to="/compras"
          class="px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          active-class="font-medium text-gray-900 bg-gray-50"
          @click="closeMenu"
        >
          Compras
        </RouterLink>
        <RouterLink
          v-if="authStore.canViewPurchasesHistory"
          to="/compras-realizadas"
          class="px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          active-class="font-medium text-gray-900 bg-gray-50"
          @click="closeMenu"
        >
          Compras realizadas
        </RouterLink>
        <RouterLink
          v-if="!authStore.isAuthenticated"
          to="/login"
          class="px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          @click="closeMenu"
        >
          Entrar
        </RouterLink>
        <template v-else>
          <div class="border-t border-gray-100 px-4 py-3">
            <span class="block text-xs text-gray-400">Conectado como</span>
            <span class="block text-sm font-medium text-gray-700">{{ authStore.username }}</span>
          </div>
          <button
            type="button"
            class="px-4 py-3 text-left text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            @click="logout"
          >
            Cerrar sesión
          </button>
        </template>
      </nav>
    </div>
  </header>
</template>
