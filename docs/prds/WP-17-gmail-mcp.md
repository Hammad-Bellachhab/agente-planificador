---
id: WP-17
title: Gmail MCP — leer y redactar
status: skeleton
size: M
depends_on: [WP-09, WP-07, WP-15]
owner: hammad
external: true
tasks_done: 0
tasks_total: 8
issue: null
subtitle: Fase 3 — bloqueador externo (OAuth Testing)
---

# WP-17 — Gmail MCP — leer y redactar

## Qué es

Rellena `nucleo/herramientas/gmail_mcp.py`: un servidor MCP Python propio y mínimo sobre
`google-api-python-client` (igual que Calendar, no hay servidor MCP oficial de Google para
Gmail) que expone tools de leer y redactar correo. Reutiliza el cliente OAuth compartido (WP-09)
con scopes de Gmail, y se hospeda con el mismo plumbing de subprocess stdio (WP-07) — solo
registra un servidor nuevo, sin tocar el núcleo del cliente MCP, que es exactamente el objetivo
de haber separado WP-07 del wiring de cada servidor.

**Bloqueador externo flagged explícitamente (`external: true`)**: como el proyecto es open
source instalable por terceros (README §12), Gmail requiere que cada instalación individual
mantenga su propio proyecto de Google Cloud en modo **"Testing"** de verificación OAuth (no
"Production" — eso exigiría una revisión de Google que no tiene sentido para una app personal de
un solo usuario). Esto es una restricción de Google, no del código de este proyecto: cada
instalador debe crear sus propias credenciales OAuth y añadirse como test user.

## Por qué depende de WP-09, WP-07, WP-15

Necesita el cliente OAuth compartido (WP-09, ya construido para Calendar) y el plumbing de
subprocess stdio (WP-07). Depende de WP-15 por orden secuencial de fase (README §7: no se
empieza Fase 3 hasta que Fase 2 esté validada), no por una dependencia técnica directa con las
consultas de lectura.

## Fuera de alcance

- Redacción automática de respuestas basada en contenido (más allá de lo que el usuario dicte
  explícitamente) → no planificado, "redactar" aquí es asistido, no autónomo.
- Cualquier procesamiento de adjuntos → fuera de alcance.
- La documentación del propio proceso de configurar el proyecto de Google Cloud en modo Testing
  → se escribe en WP-18 (docs de instalación), no en el código de este WP.

## Estado

Esqueleto sin especificar. Ejecutar fase de "fill" antes de construir. Bloqueador externo
documentado: modo Testing de OAuth de Google por instalación.
