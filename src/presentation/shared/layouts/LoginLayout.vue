<script setup lang="ts">
/**
 * Layout exclusivo para flujo de autenticación (login, registro, etc.).
 * Sin cabecera ni navegación; contenido centrado en la pantalla.
 */
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-sm">
      <RouterView />
    </div>
  </div>
</template>
