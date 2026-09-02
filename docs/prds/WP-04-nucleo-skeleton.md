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

Rellena `nucleo/agente.py` (hoy vacío) como punto de entrada: expone una **API HTTP propia**
(recomendado: FastAPI) que el frontend Next.js en `web/` llama **directamente** por HTTPS — ya
no hay n8n en medio del camino de chat (README §3-4, cambio v0.3 → v0.4). El endpoint principal
recibe el mensaje del usuario, abre conexión a Postgres (Supabase), registra el mensaje entrante
en `mensajes`, y deja el punto de enganche donde luego se conecta el LLM con function calling.
Devuelve la respuesta del agente como respuesta HTTP síncrona a esa misma petición. Incluye
`requirements.txt` (no existe hoy) y la estructura mínima de `nucleo/` que README §6 describe
(`herramientas/`, `evaluacion/` como paquetes vacíos listos para poblarse).

Este WP fija el **contrato de petición/respuesta** entre `web/` y `nucleo/` — algo como
`POST /mensaje { usuario_id, contenido } → { respuesta, ... }`, exacto a decidir en fill — porque
WP-20 (frontend) y WP-21 (deploy/CORS) se construyen contra ese contrato.

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
- La UI de chat que consume esta API → WP-20.
- CORS/despliegue del núcleo en Google Cloud Run → WP-21; este WP deja el servidor arrancable
  en local, no lo despliega ni escribe el `Dockerfile`.
- n8n como cliente de esta API para automatizaciones secundarias → WP-06, no en el camino de
  Fase 1.

## Estado

Esqueleto sin especificar. Ejecutar fase de "fill" antes de construir.
