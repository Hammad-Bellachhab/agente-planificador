"""Self-check de ClienteMCP (WP-07) — no requiere un servidor MCP real.

Simula stdio_client/ClientSession para comprobar lo que realmente importa
del plumbing: que loguea cada llamada en llamadas_herramienta con el
servidor_mcp correcto, que reutiliza la sesión entre llamadas al mismo
servidor, y que un fallo se loguea con exito=False y se relanza.
"""

import asyncio
import sys
import unittest
from contextlib import asynccontextmanager
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from mcp_cliente import ClienteMCP, ServidorMCPDesconocido  # noqa: E402


class FakeCursor:
    def __init__(self, llamadas: list[tuple]) -> None:
        self._llamadas = llamadas

    def __enter__(self) -> "FakeCursor":
        return self

    def __exit__(self, *_exc) -> None:
        return None

    def execute(self, _sql: str, params: tuple) -> None:
        self._llamadas.append(params)


class FakeConn:
    def __init__(self) -> None:
        self.llamadas: list[tuple] = []
        self.commits = 0

    def cursor(self) -> FakeCursor:
        return FakeCursor(self.llamadas)

    def commit(self) -> None:
        self.commits += 1


def _resultado_mock(texto: str) -> MagicMock:
    resultado = MagicMock()
    resultado.model_dump.return_value = {"content": [{"type": "text", "text": texto}]}
    return resultado


class ClienteMCPTest(unittest.TestCase):
    def _cliente_con_sesion_falsa(self, sesion: MagicMock) -> ClienteMCP:
        cliente = ClienteMCP()

        @asynccontextmanager
        async def fake_stdio_client(_params):
            yield (MagicMock(), MagicMock())

        patch("mcp_cliente.stdio_client", fake_stdio_client).start()
        patch("mcp_cliente.ClientSession", return_value=sesion).start()
        self.addCleanup(patch.stopall)
        return cliente

    def test_llamada_exitosa_se_loguea(self) -> None:
        sesion = MagicMock()
        sesion.__aenter__ = AsyncMock(return_value=sesion)
        sesion.__aexit__ = AsyncMock(return_value=False)
        sesion.initialize = AsyncMock()
        sesion.call_tool = AsyncMock(return_value=_resultado_mock("ok"))

        cliente = self._cliente_con_sesion_falsa(sesion)
        conn = FakeConn()

        resultado = asyncio.run(
            cliente.llamar_herramienta(
                "notion", "search", {"query": "tarea"}, conn=conn, mensaje_id=42
            )
        )

        self.assertEqual(resultado.model_dump()["content"][0]["text"], "ok")
        self.assertEqual(len(conn.llamadas), 1)
        mensaje_id, servidor_mcp, herramienta, _args, _resultado, exito, latencia_ms = conn.llamadas[0]
        self.assertEqual(mensaje_id, 42)
        self.assertEqual(servidor_mcp, "notion")
        self.assertEqual(herramienta, "search")
        self.assertTrue(exito)
        self.assertGreaterEqual(latencia_ms, 0)
        self.assertEqual(conn.commits, 1)

    def test_fallo_se_loguea_con_exito_false_y_relanza(self) -> None:
        sesion = MagicMock()
        sesion.__aenter__ = AsyncMock(return_value=sesion)
        sesion.__aexit__ = AsyncMock(return_value=False)
        sesion.initialize = AsyncMock()
        sesion.call_tool = AsyncMock(side_effect=RuntimeError("servidor caído"))

        cliente = self._cliente_con_sesion_falsa(sesion)
        conn = FakeConn()

        with self.assertRaises(RuntimeError):
            asyncio.run(
                cliente.llamar_herramienta(
                    "notion", "search", {}, conn=conn, mensaje_id=1
                )
            )

        self.assertEqual(len(conn.llamadas), 1)
        self.assertFalse(conn.llamadas[0][5])  # exito

    def test_sesion_se_reutiliza_entre_llamadas(self) -> None:
        sesion = MagicMock()
        sesion.__aenter__ = AsyncMock(return_value=sesion)
        sesion.__aexit__ = AsyncMock(return_value=False)
        sesion.initialize = AsyncMock()
        sesion.call_tool = AsyncMock(return_value=_resultado_mock("ok"))

        cliente = self._cliente_con_sesion_falsa(sesion)
        conn = FakeConn()

        async def dos_llamadas():
            await cliente.llamar_herramienta("notion", "search", {}, conn=conn, mensaje_id=1)
            await cliente.llamar_herramienta("notion", "fetch", {}, conn=conn, mensaje_id=2)

        asyncio.run(dos_llamadas())

        sesion.initialize.assert_awaited_once()
        self.assertEqual(len(conn.llamadas), 2)

    def test_servidor_desconocido_lanza_error_claro(self) -> None:
        cliente = ClienteMCP()
        with self.assertRaises(ServidorMCPDesconocido):
            asyncio.run(cliente._sesion("slack"))


if __name__ == "__main__":
    unittest.main()
