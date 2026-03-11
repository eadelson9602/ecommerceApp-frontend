import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import LoginPage from './LoginPage.vue'

describe('LoginPage', () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/login', name: 'Login', component: LoginPage },
      { path: '/products', name: 'Products', component: { template: '<div>Products</div>' } },
    ],
  })

  beforeEach(async () => {
    setActivePinia(createPinia())
    await router.push('/login')
  })

  it('muestra el formulario de login', () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [createPinia(), router],
      },
    })
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.get('input#username').exists()).toBe(true)
    expect(wrapper.get('input#password').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').text()).toBe('Entrar')
  })

  it('muestra error de validación si usuario está vacío', async () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [createPinia(), router],
      },
    })
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('El usuario es obligatorio')
  })

  it('muestra error de validación si contraseña está vacía', async () => {
    const wrapper = mount(LoginPage, {
      global: {
        plugins: [createPinia(), router],
      },
    })
    await wrapper.get('input#username').setValue('user')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('La contraseña es obligatoria')
  })
})
