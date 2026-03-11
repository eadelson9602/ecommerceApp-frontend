<template>
  <div class="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
    <h1 class="text-6xl font-bold text-gray-300">404</h1>
    <p class="mt-2 text-lg text-gray-600">Página no encontrada</p>
    <p class="mt-1 text-sm text-gray-500">
      La ruta a la que intentas acceder no existe.
    </p>
    <router-link
      to="/"
      class="mt-6 inline-flex rounded bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
    >
      Ir al inicio
    </router-link>
  </div>
</template>
