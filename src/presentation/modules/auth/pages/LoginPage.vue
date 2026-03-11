<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../store/auth.store'

const username = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const redirectAfterLogin = computed(() => (route.query.redirect as string) || '/products')
const isSessionExpired = computed(() => route.query.expired === '1')

const usernameError = ref('')
const passwordError = ref('')

function validateForm(): boolean {
  usernameError.value = ''
  passwordError.value = ''
  let valid = true
  if (!username.value?.trim()) {
    usernameError.value = 'El usuario es obligatorio.'
    valid = false
  }
  if (!password.value) {
    passwordError.value = 'La contraseña es obligatoria.'
    valid = false
  }
  return valid
}

async function onSubmit() {
  error.value = ''
  usernameError.value = ''
  passwordError.value = ''
  if (!validateForm()) return
  isLoading.value = true
  try {
    const res = await fetch(
      `${import.meta.env.VITE_PRODUCTS_API_URL ?? 'http://localhost:8080'}/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.value,
          password: password.value,
        }),
      }
    )
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.message ?? 'Credenciales incorrectas')
    }
    const data = await res.json() as { accessToken: string }
    authStore.setAuth({ token: data.accessToken, username: username.value })
    await router.push(redirectAfterLogin.value)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error al iniciar sesión'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    <h2 class="mb-4 text-lg font-medium">Iniciar sesión</h2>
    <p v-if="isSessionExpired" class="mb-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
      Tu sesión ha expirado. Inicia sesión de nuevo para continuar.
    </p>
    <form @submit.prevent="onSubmit" class="space-y-3">
      <div>
        <label for="username" class="block text-sm text-gray-600">Usuario</label>
        <input
          id="username"
          v-model="username"
          type="text"
          class="mt-1 w-full rounded border px-3 py-2 text-gray-900"
          :class="usernameError ? 'border-red-500' : 'border-gray-300'"
          autocomplete="username"
        />
        <p v-if="usernameError" class="mt-0.5 text-xs text-red-600">{{ usernameError }}</p>
      </div>
      <div>
        <label for="password" class="block text-sm text-gray-600">Contraseña</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="mt-1 w-full rounded border px-3 py-2 text-gray-900"
          :class="passwordError ? 'border-red-500' : 'border-gray-300'"
          autocomplete="current-password"
        />
        <p v-if="passwordError" class="mt-0.5 text-xs text-red-600">{{ passwordError }}</p>
      </div>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <button
        type="submit"
        class="flex w-full items-center justify-center gap-2 rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-70"
        :disabled="isLoading"
      >
        <span v-if="isLoading" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        {{ isLoading ? 'Entrando…' : 'Entrar' }}
      </button>
    </form>
  </div>
</template>
