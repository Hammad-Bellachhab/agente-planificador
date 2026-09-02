---
id: WP-04
title: Esqueleto del núcleo Python
status: skeleton
size: M
depends_on: [WP-01, WP-03]
owner: hammad
external: false
tasks_done: 0
tasks_total: 8
issue: null
subtitle: Fase 0
---

# WP-04 — Esqueleto del núcleo Python

## Qué es

Rellena `nucleo/agente.py` (hoy vacío) como punto de entrada: recibe una petición HTTP desde
n8n, abre conexión a Postgres, registra el mensaje entrante en `mensajes` (usando
`telegram_message_id` para idempotencia ante reintentos de webhook — WP-01), y deja el punto de
enganche donde luego se conecta el LLM con function calling. Incluye `requirements.txt` (no
existe hoy) y la estructura mínima de `nucleo/` que README §6 describe (`herramientas/`,
`evaluacion/` como paquetes vacíos listos para poblarse).

Este WP es deliberadamente delgado: no incluye lógica de negocio (ni onboarding, ni MCP, ni
LLM) — solo el esqueleto que hace que "arrancar `python nucleo/agente.py`" sea real.

## Por qué depende de WP-01, WP-03

Necesita el esquema (WP-01) para saber contra qué tablas escribir (`mensajes`,
`conversaciones`, `usuarios`) y la config de entorno (WP-03) para las variables de conexión a
Postgres y el resto de credenciales que va a leer desde `.env`.

## Fuera de alcance

- Onboarding conversacional → WP-05.
- Cliente MCP y registro de servidores → WP-07.
- LLM con function calling propiamente dicho (prompt, function-calling loop) → se introduce
  junto con WP-05 y WP-11, no aquí; este WP deja el enganche pero no la lógica de decisión.

## Estado

Esqueleto sin especificar. Ejecutar fase de "fill" antes de construir.
