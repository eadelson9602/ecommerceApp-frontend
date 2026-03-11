import { test, expect } from '@playwright/test'

/**
 * E2E: listar productos → ver detalle → compra exitosa.
 * Requiere backend (products 8080, inventory 8081) en marcha con datos de prueba.
 */
test.describe('Flujo listar → detalle → compra exitosa', () => {
  test('login, listar, ir a detalle, comprar con cantidad 1', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel(/usuario/i).fill('demo')
    await page.getByLabel(/contraseña/i).fill('demo')
    await page.getByRole('button', { name: /entrar/i }).click()

    await expect(page).toHaveURL(/\/(products)?$/)
    await expect(page.getByRole('heading', { name: /productos/i })).toBeVisible({ timeout: 10000 })

    const firstProductLink = page.getByRole('link', { name: /ver detalle/i }).first()
    await firstProductLink.click()

    await expect(page).toHaveURL(/\/products\/[a-f0-9-]+$/i)
    await expect(page.getByText(/inventario/i)).toBeVisible({ timeout: 5000 })

    const quantityInput = page.getByLabel(/cantidad/i)
    await quantityInput.fill('1')
    await page.getByRole('button', { name: /comprar/i }).click()

    await expect(page.getByText(/compra realizada correctamente/i)).toBeVisible({ timeout: 10000 })
  })
})
