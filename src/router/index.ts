import { createRouter, createWebHistory } from "vue-router";
import { authGuard } from "@/presentation/modules/auth/guards/auth.guard";
import LoginLayout from "@/presentation/shared/layouts/LoginLayout.vue";
import MainLayout from "@/presentation/shared/layouts/MainLayout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      component: LoginLayout,
      meta: { public: true },
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
          component: () =>
            import("@/presentation/modules/products/pages/ProductListPage.vue"),
        },
        {
          path: "products",
          name: "Products",
          component: () =>
            import("@/presentation/modules/products/pages/ProductListPage.vue"),
        },
        {
          path: "products/:id",
          name: "ProductDetail",
          component: () =>
            import("@/presentation/modules/products/pages/ProductDetailPage.vue"),
          props: true,
        },
        {
          path: "compras",
          name: "Purchases",
          component: () =>
            import("@/presentation/modules/purchases/pages/PurchasePage.vue"),
        },
        {
          path: "compras-realizadas",
          name: "PurchasesHistory",
          meta: { requiresPurchasesHistory: true },
          component: () =>
            import("@/presentation/modules/purchases/pages/PurchasesHistoryPage.vue"),
        },
        {
          path: "/:pathMatch(.*)*",
          name: "NotFound",
          component: () =>
            import("@/presentation/shared/pages/NotFoundPage.vue"),
        },
      ],
    },
  ],
});

router.beforeEach(authGuard);

export default router;
