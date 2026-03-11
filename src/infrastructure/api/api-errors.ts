/**
 * Mensajes claros para errores de API (404, 409, 422, timeout) según prueba técnica.
 */
export interface JsonApiError {
  status?: string
  code?: string
  title?: string
  detail?: string
}

export interface JsonApiErrorBody {
  errors?: JsonApiError[]
}

const DEFAULT_TIMEOUT_MS = 15000

function parseErrorBody(text: string): JsonApiErrorBody | null {
  try {
    return JSON.parse(text) as JsonApiErrorBody
  } catch {
    return null
  }
}

/**
 * Devuelve un mensaje amigable según status HTTP y cuerpo JSON:API.
 */
export function getApiErrorMessage(
  status: number,
  responseText: string,
  options?: { timeoutMs?: number }
): string {
  const body = parseErrorBody(responseText)
  const first = body?.errors?.[0]
  const title = first?.title?.trim()
  const detail = first?.detail?.trim()
  const fallback = detail || title || responseText || 'Error desconocido'

  switch (status) {
    case 404:
      return title || detail || 'Recurso no encontrado.'
    case 409:
      return title || detail || 'Conflicto: el recurso ya existe o hay conflicto de concurrencia. Puedes reintentar.'
    case 422:
      return title || detail || 'Datos no válidos (por ejemplo, stock insuficiente).'
    case 429:
      return 'Demasiadas peticiones. Espera un momento antes de reintentar.'
    case 500:
      return title || detail || 'Error interno del servidor. Intenta más tarde.'
    case 502:
    case 503:
      return title || detail || 'Servicio no disponible. Comprueba que el backend esté en marcha e intenta de nuevo.'
    default:
      return fallback
  }
}

/**
 * Mensaje cuando la petición hace timeout.
 */
export function getTimeoutErrorMessage(timeoutMs: number = DEFAULT_TIMEOUT_MS): string {
  return `Tiempo de espera agotado (${timeoutMs / 1000}s). Comprueba la conexión e intenta de nuevo.`
}

export const DEFAULT_REQUEST_TIMEOUT_MS = DEFAULT_TIMEOUT_MS
