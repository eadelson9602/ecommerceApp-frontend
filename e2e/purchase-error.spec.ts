import { test, expect } from '@playwright/test'

/**
 * E2E: caso de error en compra (stock insuficiente).
 * Se intenta comprar una cantidad mayor a la disponible; debe mostrarse mensaje claro.
 */
test.describe('Caso de error: stock insuficiente o inventario no disponible', () => {
  test('al comprar cantidad mayor al stock se muestra mensaje de error', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/usuario/i).fill('demo')
    await page.getByLabel(/contraseña/i).fill('demo')
    await page.getByRole('button', { name: /entrar/i }).click()

    await expect(page).toHaveURL(/\/(products)?$/)
    const firstProductLink = page.getByRole('link', { name: /ver detalle/i }).first()
    await firstProductLink.click()

    await expect(page).toHaveURL(/\/products\/[a-f0-9-]+$/i)

    const quantityInput = page.getByLabel(/cantidad/i)
    await quantityInput.fill('99999')
    await page.getByRole('button', { name: /comprar/i }).click()

    await expect(
      page.getByText(/stock insuficiente|solo hay|no hay suficientes/i)
    ).toBeVisible({ timeout: 10000 })
  })

  test('botón Reintentar visible cuando falla la carga de inventario', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel(/usuario/i).fill('demo')
    await page.getByLabel(/contraseña/i).fill('demo')
    await page.getByRole('button', { name: /entrar/i }).click()

    await page.goto('/products/00000000-0000-0000-0000-000000000000')
    await expect(
      page.getByRole('button', { name: /reintentar/i })
    ).toBeVisible({ timeout: 10000 })
  })
})
