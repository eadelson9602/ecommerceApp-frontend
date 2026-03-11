<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { watch } from 'vue'
import Toast from 'primevue/toast'
import { getGlobalError, clearGlobalError } from './globalError'

const toast = useToast()

watch(
  () => getGlobalError().value,
  (msg) => {
    if (msg) {
      toast.add({ severity: 'error', summary: 'Error', detail: msg, life: 5000 })
      clearGlobalError()
    }
  }
)
</script>

<template>
  <Toast />
  <RouterView />
</template>
