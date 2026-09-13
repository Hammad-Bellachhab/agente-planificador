"""Cliente MCP genérico (WP-07): plumbing multi-servidor sobre stdio.

Deliberadamente no conoce ninguna tool concreta de Notion/Calendar/Gmail —
solo sabe registrar servidores, lanzar sus subprocesos stdio, reutilizar la
sesión mientras el proceso viva, y loguear cada llamada en
`llamadas_herramienta` con el `servidor_mcp` correcto. El wiring de tools
reales vive en herramientas/notion_mcp.py (WP-08) y calendar_mcp.py (WP-10);
añadir Gmail (WP-17) es una entrada más en SERVIDORES, nada en esta clase.
"""

import os
import time
from contextlib import AsyncExitStack
from typing import Any

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from psycopg.types.json import Json

# Registro de servidores MCP conocidos, por nombre lógico (el mismo que se
# guarda en llamadas_herramienta.servidor_mcp). Calendar/Gmail se añaden aquí
# cuando WP-10/WP-17 tengan su servidor propio — no antes.
SERVIDORES: dict[str, StdioServerParameters] = {
    "notion": StdioServerParameters(
        command="npx",
        args=["-y", "@notionhq/notion-mcp-server"],
        env={
            "OPENAPI_MCP_HEADERS": os.environ.get("NOTION_MCP_HEADERS", ""),
        },
    ),
}


class ServidorMCPDesconocido(ValueError):
    pass


class ClienteMCP:
    """Una sesión stdio por servidor, abierta perezosamente y reutilizada."""

    def __init__(self) -> None:
        self._stack = AsyncExitStack()
        self._sesiones: dict[str, ClientSession] = {}

    async def _sesion(self, servidor: str) -> ClientSession:
        if servidor not in SERVIDORES:
            raise ServidorMCPDesconocido(servidor)
        if servidor not in self._sesiones:
            read, write = await self._stack.enter_async_context(
                stdio_client(SERVIDORES[servidor])
            )
            sesion = await self._stack.enter_async_context(ClientSession(read, write))
            await sesion.initialize()
            self._sesiones[servidor] = sesion
        return self._sesiones[servidor]

    async def listar_herramientas(self, servidor: str) -> list[dict]:
        sesion = await self._sesion(servidor)
        resultado = await sesion.list_tools()
        return [t.model_dump() for t in resultado.tools]

    async def llamar_herramienta(
        self,
        servidor: str,
        herramienta: str,
        argumentos: dict[str, Any],
        *,
        conn,
        mensaje_id: int,
    ):
        """Invoca la tool y registra la llamada en llamadas_herramienta.

        Loguea tanto el éxito como el fallo (con exito=False) antes de
        relanzar la excepción — el caller decide cómo responder al usuario,
        pero el registro de auditoría no depende de que lo haga bien.
        """
        inicio = time.monotonic()
        exito = True
        resultado_dump: dict | None = None
        try:
            sesion = await self._sesion(servidor)
            resultado = await sesion.call_tool(herramienta, argumentos)
            resultado_dump = resultado.model_dump()
            return resultado
        except Exception:
            exito = False
            raise
        finally:
            latencia_ms = int((time.monotonic() - inicio) * 1000)
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO llamadas_herramienta
                        (mensaje_id, servidor_mcp, herramienta, argumentos, resultado, exito, latencia_ms)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        mensaje_id,
                        servidor,
                        herramienta,
                        Json(argumentos),
                        Json(resultado_dump) if resultado_dump is not None else None,
                        exito,
                        latencia_ms,
                    ),
                )
            conn.commit()

    async def cerrar(self) -> None:
        await self._stack.aclose()
        self._sesiones.clear()
