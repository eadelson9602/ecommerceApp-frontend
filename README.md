# ecommerceApp Frontend

Frontend del ecommerce: Vue 3 + Vite, conectado al backend **ecommerceApp** (Products Service e Inventory Service). Incluye listado y detalle de productos, inventario y flujo de compra con autenticación JWT.

---

## Documentación de arquitectura

La estructura del proyecto sigue una **arquitectura hexagonal** con presentación modular. Detalle de capas, módulos y rutas:

→ **[ARCHITECTURE.md](./ARCHITECTURE.md)**

---

## Stack técnico

| Área         | Tecnología                           |
| ------------ | ------------------------------------ |
| Framework    | Vue 3 + TypeScript                   |
| Build        | Vite 7                               |
| Router       | Vue Router 5                         |
| Estado       | Pinia + Pinia Colada (queries)       |
| Persistencia | pinia-plugin-persistedstate (auth)   |
| UI           | Tailwind CSS 4 + PrimeVue (unstyled) |
| API          | JSON:API, JWT (Bearer)               |

---

## Requisitos previos

- **Node.js** 18+ (recomendado 20+)
- **npm** o **yarn**
- Backend **ecommerceApp** en ejecución (Products en `8080`, Inventory en `8081`) para desarrollo completo

---

## Variables de entorno

Copia el ejemplo y ajusta las URLs del backend según el entorno:

```bash
cp .env.example .env
```

**Importante:** No versiones el archivo `.env` (contiene valores locales). El token JWT se persiste en `localStorage` bajo la clave del store de auth; en entornos sensibles valora usar `sessionStorage` o memoria y no commitear credenciales.

| Variable                 | Descripción                                 | Por defecto (dev)       |
| ------------------------ | ------------------------------------------- | ----------------------- |
| `VITE_PRODUCTS_API_URL`  | URL del Products Service (login, productos) | `http://localhost:8080` |
| `VITE_INVENTORY_API_URL` | URL del Inventory Service                   | `http://localhost:8081` |

En producción, apunta estas variables a las URLs públicas de tus APIs (por ejemplo `https://api.ejemplo.com/products`, `https://api.ejemplo.com/inventory`).

---

## Pasos de ejecución

### 1. Instalar dependencias

```bash
npm install
# o
yarn install
```

### 2. Configurar entorno

```bash
cp .env.example .env
# Editar .env si las URLs del backend no son localhost:8080 y localhost:8081
```

### 3. Desarrollo local

```bash
npm run dev
# o
yarn dev
```

La app se sirve en **http://localhost:5173**. Asegúrate de tener el backend levantado (Products en 8080, Inventory en 8081) para login y datos.

---

## Usuarios de prueba (frontend)

El login del frontend usa el endpoint `POST /auth/login` del **Products Service**. Los seeders del backend crean estos usuarios por defecto; todos comparten la misma contraseña:

| Usuario   | Contraseña | Uso típico |
| --------- | ---------- | ---------- |
| **admin** | `password` | Acceso completo |
| **operator** | `password` | Operaciones |
| **viewer** | `password` | Solo lectura |

Para probar la app: abre http://localhost:5173, ve a **Entrar** (o serás redirigido si no hay sesión) e inicia sesión con cualquiera de los usuarios de la tabla. El token JWT se guarda en Pinia y se persiste en `localStorage` bajo la clave `auth`.

### 4. Build de producción

```bash
npm run build
# o
yarn build
```

Genera la salida estática en **`dist/`**. Incluye compilación TypeScript (`vue-tsc -b`) y build de Vite.

### 5. Vista previa del build

```bash
npm run preview
# o
yarn preview
```

Sirve la carpeta `dist/` localmente para probar el build antes de desplegar. Ten en cuenta que las variables `VITE_*` se inyectan en build time; para probar contra otro backend, vuelve a hacer `build` con el `.env` adecuado o usa un proxy.

---

## Despliegue (deploy)

El proyecto es una **SPA estática**. Tras `npm run build`, el contenido de **`dist/`** se puede desplegar en cualquier servidor de archivos estáticos o CDN.

### Opción 1: Servidor estático (Nginx, Apache, etc.)

1. Ejecutar `npm run build`.
2. Subir el contenido de `dist/` al servidor (por ejemplo `/var/www/app`).
3. Configurar el servidor para que todas las rutas de la SPA devuelvan `index.html` (fallback para Vue Router en modo `history`).

Ejemplo mínimo **Nginx**:

```nginx
server {
  listen 80;
  root /var/www/app;
  index index.html;
  location / {
    try_files $uri $uri/ /index.html;
  }
  location /api {
    # Opcional: proxy al backend si lo sirves desde el mismo dominio
    proxy_pass http://backend:8080;
  }
}
```

### Opción 2: Docker (imagen estática)

Ejemplo de **Dockerfile** para servir `dist/` con Nginx:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

`nginx.conf` con soporte SPA (history mode):

```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

Build y ejecución:

```bash
docker build -t ecommerceapp-frontend .
docker run -p 80:80 ecommerceapp-frontend
```

### Opción 3: Plataformas (Vercel, Netlify, etc.)

- Conectar el repositorio y usar **Build command**: `npm run build`, **Publish directory**: `dist`.
- Definir las variables de entorno `VITE_PRODUCTS_API_URL` y `VITE_INVENTORY_API_URL` en el panel de la plataforma (se inyectan en el build).

---

## Puntos importantes del proyecto

- **Autenticación**: Login contra `POST /auth/login` del Products Service. La respuesta trae `accessToken`; se guarda en Pinia y se persiste en `localStorage`. Todas las peticiones a `/api/*` envían `Authorization: Bearer <token>`.
- **Guard de sesión**: Un guard de Vue Router comprueba en cada navegación que exista token y que no esté expirado (claim `exp` del JWT). Si falta o está expirado, se cierra sesión y se redirige a `/login` con `?expired=1` o `?redirect=...`.
- **401**: Si el backend responde 401, el cliente cierra sesión y redirige a login automáticamente.
- **CORS**: El backend debe permitir el origen del frontend (en dev, `http://localhost:5173`). Si ves errores de CORS, revisa la configuración en Products e Inventory Service.
- **Estados de UI**: Listado de productos maneja **loading**, **error**, **empty** y **success** (tabla paginada con filtros y ordenación).
- **Rutas protegidas**: Todo excepto `/login` requiere estar autenticado; el guard redirige a login si no hay token válido.

---

## Scripts disponibles

| Script            | Descripción                                                         |
| ----------------- | ------------------------------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo (Vite), por defecto en http://localhost:5173 |
| `npm run build`   | Compila TypeScript y genera build de producción en `dist/`          |
| `npm run preview` | Sirve `dist/` localmente para probar el build                       |

---

## Pruebas E2E

Las pruebas E2E se ejecutan con Playwright:

```bash
yarn test:e2e
```

Incluyen flujo de compra, caso de error por **stock insuficiente** y caso de **inventario/producto caído** (botón Reintentar). Los dos casos de error no se saltan y pasan siempre.

**Evidencia de ejecución:**

![Resultado de yarn test:e2e](public/Screenshot%20from%202026-03-10%2020-27-46.png)

---

## Estructura rápida

```
src/
├── domain/           # Tipos y entidades (Product, Inventory, Auth)
├── application/      # Casos de uso y queries (product-queries, inventory-queries)
├── infrastructure/   # Cliente API, JWT (auth)
├── presentation/     # Módulos (auth, products, inventory) + shared
├── router/          # Vue Router y guard de auth
├── App.vue
├── main.ts
└── style.css
```
