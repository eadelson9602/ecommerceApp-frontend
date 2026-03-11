import { ref } from 'vue'

const message = ref<string | null>(null)

export function getGlobalError() {
  return message
}

export function setGlobalError(msg: string) {
  message.value = msg
}

export function clearGlobalError() {
  message.value = null
}
