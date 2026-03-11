import { test, expect } from '@playwright/test'

/**
 * E2E: listar productos → ver detalle → compra exitosa.
 * Requiere backend (products 8080, inventory 8081) en marcha con datos de prueba.
 * Usa un producto del seed (a0000000-0000-0000-0000-000000000001) con stock conocido.
 */
const PRODUCTO_CON_STOCK = 'a0000000-0000-0000-0000-000000000001'

test.describe('Flujo listar → detalle → compra exitosa', () => {
  test('login, listar, ir a detalle, comprar con cantidad 1', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel(/usuario/i).fill('demo')
    await page.getByLabel(/contraseña/i).fill('demo')
    await page.getByRole('button', { name: /entrar/i }).click()

    await expect(page).toHaveURL(/\/(products)?$/)
    await page.goto(`/products/${PRODUCTO_CON_STOCK}`)

    await expect(page).toHaveURL(new RegExp(`/products/${PRODUCTO_CON_STOCK}`))
    await expect(page.getByRole('heading', { name: /inventario/i })).toBeVisible({ timeout: 5000 })
    const buyBtn = page.getByRole('button', { name: /comprar/i })
    await buyBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {})
    if (!(await buyBtn.isEnabled())) {
      test.skip(true, 'Producto sin stock (requiere backend 8080/8081 con seed para flujo exitoso)')
    }

    const quantityInput = page.getByLabel(/cantidad/i)
    await quantityInput.fill('1')
    await page.getByRole('button', { name: /comprar/i }).click()
    await expect(page.getByRole('button', { name: /sí, confirmar/i })).toBeVisible({ timeout: 5000 })

    const purchaseResponse = page.waitForResponse(
      (res) => res.url().includes('/api/purchases') && res.request().method() === 'POST',
      { timeout: 20000 }
    )
    await page.getByRole('button', { name: /sí, confirmar/i }).click()
    const res = await purchaseResponse
    expect(res.status()).toBe(201)
    await expect(page.getByRole('dialog')).toBeHidden({ timeout: 5000 })
    await page.waitForTimeout(500)
    const successMsg = page.getByTestId('purchase-success-message').or(page.getByText(/compra realizada correctamente\.?/i))
    await expect(successMsg).toBeVisible({ timeout: 15000 })
    await expect(successMsg).toContainText(/compra realizada correctamente/i)
  })
})
