import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { PiniaColada } from '@pinia/colada'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import router from './router'
import App from './App.vue'
import { setGlobalError } from './globalError'
import './style.css'

const app = createApp(App)

app.config.errorHandler = (err: unknown) => {
  console.error('[App] Unhandled error:', err)
  setGlobalError('Ha ocurrido un error. Por favor, intente de nuevo.')
}
app.use(router)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(PiniaColada, {
  queryOptions: {
    staleTime: 1000 * 60 * 2, // 2 min
  },
  mutationOptions: {},
  plugins: [],
})
// PrimeVue: runtime acepta { unstyled }; tipos no lo declaran (primevue 4.x)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use(PrimeVue as any, { unstyled: true })
app.use(ToastService)
app.mount('#app')
