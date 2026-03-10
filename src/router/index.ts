import { createRouter, createWebHistory } from 'vue-router'
import LoginLayout from '@/presentation/shared/layouts/LoginLayout.vue'
import MainLayout from '@/presentation/shared/layouts/MainLayout.vue'
import { authGuard } from '@/presentation/modules/auth/guards/auth.guard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: LoginLayout,
      meta: { public: true },
      children: [
        {
          path: '',
          name: 'Login',
          component: () => import('@/presentation/modules/auth/pages/LoginPage.vue'),
        },
      ],
    },
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('@/presentation/modules/products/pages/ProductListPage.vue'),
        },
        {
          path: 'products',
          name: 'Products',
          component: () => import('@/presentation/modules/products/pages/ProductListPage.vue'),
        },
        {
          path: 'products/:id',
          name: 'ProductDetail',
          component: () => import('@/presentation/modules/products/pages/ProductDetailPage.vue'),
          props: true,
        },
        {
          path: 'inventory',
          name: 'Inventory',
          component: () => import('@/presentation/modules/inventory/pages/InventoryPage.vue'),
        },
      ],
    },
  ],
})

router.beforeEach(authGuard)

export default router
