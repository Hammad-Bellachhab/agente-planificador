const DEFAULT_BASE_URL = "http://localhost:8000";

export const NUCLEO_API_URL = (
  process.env.NEXT_PUBLIC_NUCLEO_API_URL || DEFAULT_BASE_URL
).replace(/\/+$/, "");

export interface EnviarMensajeResponse {
  respuesta: string;
  conversacion_id: number;
}

/** Error de red o de respuesta del backend, con un mensaje ya listo para mostrar. */
export class NucleoApiError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = "NucleoApiError";
  }
}

export async function enviarMensaje(
  contenido: string,
): Promise<EnviarMensajeResponse> {
  let res: Response;
  try {
    res = await fetch(`${NUCLEO_API_URL}/mensaje`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contenido }),
    });
  } catch (err) {
    throw new NucleoApiError(
      `No se pudo conectar con el backend en ${NUCLEO_API_URL}. ¿Está corriendo?`,
      err,
    );
  }

  if (!res.ok) {
    let detail: string | undefined;
    try {
      const body = await res.json();
      detail = typeof body?.detail === "string" ? body.detail : undefined;
    } catch {
      // el cuerpo no era JSON: se ignora y se usa el mensaje genérico
    }
    throw new NucleoApiError(
      detail || `El backend respondió con un error (${res.status}).`,
    );
  }

  return res.json();
}
