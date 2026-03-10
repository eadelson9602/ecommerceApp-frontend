import type { RouteRecordRaw } from 'vue-router'

export const productsRoutes: RouteRecordRaw[] = [
  {
    path: '/products',
    name: 'Products',
    component: () => import('./pages/ProductListPage.vue'),
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: () => import('./pages/ProductDetailPage.vue'),
    props: true,
  },
]
