"""Núcleo del agente — WP-04: esqueleto que expone la API HTTP que llama web/.

Deliberadamente delgado: registra el mensaje entrante y deja el punto de
enganche para el LLM con function calling. Sin onboarding (WP-05), sin
cliente MCP (WP-07), sin lógica de decisión real (WP-11).
"""

import os
from contextlib import contextmanager
from datetime import datetime, timezone

import psycopg
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

DATABASE_URL = os.environ["SUPABASE_DB_URL"]
FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "*")

app = FastAPI(title="agente-planificador — núcleo")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@contextmanager
def get_conn():
    conn = psycopg.connect(DATABASE_URL)
    try:
        yield conn
    finally:
        conn.close()


def obtener_usuario_id(conn) -> int:
    """App de un solo usuario (README §2): siempre hay exactamente una fila en `usuarios`."""
    with conn.cursor() as cur:
        cur.execute("SELECT id FROM usuarios ORDER BY id LIMIT 1")
        row = cur.fetchone()
        if row is not None:
            return row[0]
        cur.execute("INSERT INTO usuarios (nombre) VALUES (%s) RETURNING id", ("Hammad",))
        row = cur.fetchone()
        conn.commit()
        return row[0]


def obtener_o_crear_conversacion(conn, usuario_id: int) -> int:
    """Conversación continua por usuario, sin cierre de sesión — README §10."""
    with conn.cursor() as cur:
        cur.execute(
            "SELECT id FROM conversaciones WHERE usuario_id = %s ORDER BY id DESC LIMIT 1",
            (usuario_id,),
        )
        row = cur.fetchone()
        if row is not None:
            return row[0]
        cur.execute(
            "INSERT INTO conversaciones (usuario_id) VALUES (%s) RETURNING id",
            (usuario_id,),
        )
        row = cur.fetchone()
        conn.commit()
        return row[0]


class MensajeEntrante(BaseModel):
    contenido: str


class MensajeSaliente(BaseModel):
    respuesta: str
    conversacion_id: int


@app.get("/health")
def health():
    return {"status": "ok", "time": datetime.now(timezone.utc).isoformat()}


@app.post("/mensaje", response_model=MensajeSaliente)
def recibir_mensaje(payload: MensajeEntrante) -> MensajeSaliente:
    if not payload.contenido.strip():
        raise HTTPException(status_code=400, detail="contenido vacío")

    with get_conn() as conn:
        usuario_id = obtener_usuario_id(conn)
        conversacion_id = obtener_o_crear_conversacion(conn, usuario_id)

        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO mensajes (conversacion_id, rol, contenido) VALUES (%s, 'usuario', %s)",
                (conversacion_id, payload.contenido),
            )

        # Punto de enganche: aquí se conecta el LLM con function calling.
        # Onboarding → WP-05, cliente MCP → WP-07, herramienta real → WP-11.
        respuesta = "Mensaje recibido. El agente todavía no piensa — eso es WP-05/WP-11."

        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO mensajes (conversacion_id, rol, contenido) VALUES (%s, 'agente', %s)",
                (conversacion_id, respuesta),
            )
        conn.commit()

    return MensajeSaliente(respuesta=respuesta, conversacion_id=conversacion_id)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
