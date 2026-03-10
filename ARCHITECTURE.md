# Arquitectura hexagonal (frontend)

Estructura por capas y presentación modular. Este documento complementa el [README principal](./README.md) (ejecución, deploy, variables de entorno).

## Capas

- **`domain/`** – Entidades y tipos de dominio (Product, Inventory, Auth). Sin dependencias de framework.
- **`application/`** – Casos de uso y consultas (Pinia Colada: product-queries, inventory-queries). Depende de `infrastructure` para llamar al API.
- **`infrastructure/`** – Adaptadores externos: cliente HTTP (`api/client.ts`) para el backend ecommerceApp (JSON:API, JWT).
- **`presentation/`** – UI: componentes compartidos y **módulos** (cada uno con store, components, pages, routes).

## Presentación modular

Cada módulo bajo `presentation/modules/<nombre>/` tiene:

- **`store/`** – Store Pinia del módulo (estado de UI o datos locales).
- **`components/`** – Componentes usados solo en ese módulo.
- **`pages/`** – Vistas (páginas) que se asignan a rutas.
- **`routes.ts`** – Definición de rutas del módulo (exportadas para el router global).

### Módulos

- **auth** – Login, store de sesión (persistida), guard de navegación que cierra sesión si el token expira o falta.
- **products** – Listado (tabla paginada, filtros, búsqueda, ordenación) y detalle de productos, store de filtros/paginación y total de registros.
- **inventory** – Página de inventario y componente `InventoryCard` (reutilizado en detalle de producto).

## Shared

`presentation/shared/components/` – Componentes compartidos entre módulos (p. ej. `AppHeader`, `PageContainer`).

## Router y autenticación

- **`router/index.ts`** – Crea el router con `createWebHistory`, define rutas y registra un **guard global** (`authGuard`).
- **Guard** – En cada navegación: si la ruta no es `meta.public`, exige token en el store; si el token está expirado (claim `exp` del JWT) o falta, cierra sesión y redirige a `/login` con `query.redirect` y opcionalmente `query.expired=1`.
- **Infraestructura** – `infrastructure/auth/jwt.ts` expone `isJwtExpired(token)` para leer la expiración sin verificar firma. El cliente API (`infrastructure/api/client.ts`) ante respuesta 401 cierra sesión y redirige a login.

## Rutas

- `/` – Listado de productos (home).
- `/products` – Listado de productos.
- `/products/:id` – Detalle de producto + inventario.
- `/inventory` – Página de inventario.
- `/login` – Login (pública). Tras login exitoso redirige a `query.redirect` o a `/products`.
