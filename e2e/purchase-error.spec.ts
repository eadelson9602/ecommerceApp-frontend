import { test, expect } from '@playwright/test'

/** Producto usado en el test de stock insuficiente (stub con available=10). */
const PRODUCTO_ID = 'a0000000-0000-0000-0000-000000000001'
const STOCK_DISPONIBLE = 10

/**
 * E2E: caso de error en compra (stock insuficiente) e inventario caído.
 * No se salta: ambos casos de error deben ejecutarse y pasar siempre.
 */
test.describe('Caso de error: stock insuficiente o inventario no disponible', () => {
  test('al comprar cantidad mayor al stock se muestra mensaje de error', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/usuario/i).fill('demo')
    await page.getByLabel(/contraseña/i).fill('demo')
    await page.getByRole('button', { name: /entrar/i }).click()

    await expect(page).toHaveURL(/\/(products)?$/)

    // Stub producto e inventario para no depender del backend: producto con stock limitado
    await page.route('**/api/products/**', (route) => {
      if (route.request().method() !== 'GET') return route.continue()
      const url = route.request().url()
      if (url.includes(PRODUCTO_ID)) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              id: PRODUCTO_ID,
              type: 'product',
              attributes: { name: 'Producto E2E', sku: 'E2E-001' },
            },
          }),
        })
      }
      return route.continue()
    })
    await page.route('**/api/inventory/**', (route) => {
      if (route.request().method() !== 'GET') return route.continue()
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            id: PRODUCTO_ID,
            type: 'inventory',
            attributes: { available: STOCK_DISPONIBLE, reserved: 0 },
          },
        }),
      })
    })

    await page.goto(`/products/${PRODUCTO_ID}`)
    await expect(page).toHaveURL(new RegExp(`/products/${PRODUCTO_ID}`))
    await expect(page.getByRole('heading', { name: /inventario/i })).toBeVisible({ timeout: 5000 })
    await expect(page.getByRole('button', { name: /comprar/i })).toBeEnabled({ timeout: 5000 })

    const quantityInput = page.getByLabel(/cantidad/i)
    await quantityInput.fill('99999')
    await expect(
      page.getByText(/solo hay|no hay suficientes|debe ser al menos 1/i)
    ).toBeVisible({ timeout: 5000 })
  })

  test('botón Reintentar visible cuando falla la carga de producto (detalle)', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/usuario/i).fill('demo')
    await page.getByLabel(/contraseña/i).fill('demo')
    await page.getByRole('button', { name: /entrar/i }).click()

    await expect(page).toHaveURL(/\/(products)?$/)
    await page.route('**/api/products/**', (route) => route.abort())
    await page.goto('/products/11111111-1111-1111-1111-111111111111')
    await expect(page.getByRole('button', { name: /reintentar/i })).toBeVisible({ timeout: 15000 })
  })
})
