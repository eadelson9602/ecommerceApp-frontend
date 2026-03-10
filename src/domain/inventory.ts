/** Entidad de dominio: Inventario por producto (backend Inventory Service). */
export interface Inventory {
  id: string
  type: string
  attributes?: {
    productId?: string
    available?: number
    reserved?: number
    version?: number
  }
}
