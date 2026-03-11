/**
 * Servicio de compras: validaciones alineadas con el backend (Inventory POST /api/purchases).
 * - productId requerido
 * - quantity requerido, entero positivo
 * - opcional: quantity <= available (validación en front para mejor UX)
 */
import { apiPurchase } from "@/infrastructure/api/client";

export type PurchaseValidationResult =
  | { valid: true }
  | { valid: false; message: string };

/**
 * Valida los datos de compra según requisitos del backend (y prueba técnica).
 */
export function validatePurchaseInput(
  productId: string,
  quantity: number,
  options?: { available?: number },
): PurchaseValidationResult {
  if (!productId || String(productId).trim() === "") {
    return { valid: false, message: "El producto es obligatorio." };
  }
  if (quantity == null || Number.isNaN(quantity)) {
    return { valid: false, message: "La cantidad es obligatoria." };
  }
  if (!Number.isInteger(quantity)) {
    return { valid: false, message: "La cantidad debe ser un número entero." };
  }
  if (quantity < 1) {
    return { valid: false, message: "La cantidad debe ser al menos 1." };
  }
  if (options?.available != null && quantity > options.available) {
    return {
      valid: false,
      message: `Solo hay ${options.available} disponibles.`,
    };
  }
  return { valid: true };
}

export type ProcessPurchaseResult =
  | { ok: true }
  | { ok: false; message: string; status: number };

/**
 * Procesa una compra: valida y llama al backend (Idempotency-Key para reintentos).
 */
export async function processPurchase(
  productId: string,
  quantity: number,
  options?: { available?: number },
): Promise<ProcessPurchaseResult> {
  const validation = validatePurchaseInput(productId, quantity, options);
  if (!validation.valid) {
    return { ok: false, message: validation.message, status: 422 };
  }
  const idempotencyKey = crypto.randomUUID();
  return apiPurchase(productId, quantity, idempotencyKey);
}
