import { createRouter, createWebHistory } from "vue-router";
import { authGuard } from "@/presentation/modules/auth/guards/auth.guard";
import LoginLayout from "@/presentation/shared/layouts/LoginLayout.vue";
import MainLayout from "@/presentation/shared/layouts/MainLayout.vue";

const DEFAULT_TITLE = 'E-commerce App'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      component: LoginLayout,
      meta: { public: true, title: 'Iniciar sesión' },
      children: [
        {
          path: "",
          name: "Login",
          component: () =>
            import("@/presentation/modules/auth/pages/LoginPage.vue"),
        },
      ],
    },
    {
      path: "/",
      component: MainLayout,
      children: [
        {
          path: "",
          name: "Home",
          meta: { title: 'Productos' },
          component: () =>
            import("@/presentation/modules/products/pages/ProductListPage.vue"),
        },
        {
          path: "products",
          name: "Products",
          meta: { title: 'Productos' },
          component: () =>
            import("@/presentation/modules/products/pages/ProductListPage.vue"),
        },
        {
          path: "products/:id",
          name: "ProductDetail",
          meta: { title: 'Detalle producto' },
          component: () =>
            import("@/presentation/modules/products/pages/ProductDetailPage.vue"),
          props: true,
        },
        {
          path: "compras",
          name: "Purchases",
          meta: { title: 'Realizar compra' },
          component: () =>
            import("@/presentation/modules/purchases/pages/PurchasePage.vue"),
        },
        {
          path: "compras-realizadas",
          name: "PurchasesHistory",
          meta: { requiresPurchasesHistory: true, title: 'Compras realizadas' },
          component: () =>
            import("@/presentation/modules/purchases/pages/PurchasesHistoryPage.vue"),
        },
        {
          path: "/:pathMatch(.*)*",
          name: "NotFound",
          meta: { public: true, title: 'Página no encontrada' },
          component: () =>
            import("@/presentation/shared/pages/NotFoundPage.vue"),
        },
      ],
    },
  ],
})

router.beforeEach(authGuard)

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE
})

export default router
