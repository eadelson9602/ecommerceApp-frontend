import type { RouteRecordRaw } from 'vue-router'

export const inventoryRoutes: RouteRecordRaw[] = [
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('./pages/InventoryPage.vue'),
  },
]
