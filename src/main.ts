import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { PiniaColada } from '@pinia/colada'
import PrimeVue from 'primevue/config'
import router from './router'
import App from './App.vue'
import './style.css'

const app = createApp(App)
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
// @ts-ignore PrimeVue runtime accepts config; types only declare (app)
app.use(PrimeVue, { unstyled: true })
app.mount('#app')
