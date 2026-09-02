---
id: WP-03
title: Infra local (Docker n8n + env)
status: skeleton
size: S
depends_on: []
owner: hammad
external: false
tasks_done: 0
tasks_total: 5
issue: null
subtitle: Fase 0
---

# WP-03 — Infra local (Docker n8n + env)

## Qué es

**(v0.4) Alcance reducido.** Antes cubría Postgres + n8n en Docker; con el pivote a Supabase
gestionado (README §2, §6), `docker-compose.yml` deja de incluir un servicio `postgres` — según
README, "Docker queda solo para desarrollo local del núcleo Python + n8n". Este WP endurece lo
que queda de `docker-compose.yml` (servicio `n8n`, puerto 5678, `TZ=Europe/Madrid`) y rellena la
forma de `.env.example` (hoy vacío) con las claves que el proyecto necesitará para desarrollo
local — sin ningún valor real ni plausible: `SUPABASE_DB_URL`, `LLM_API_KEY`, credenciales de
cada servidor MCP (Notion, Calendar, Gmail). **Ya no incluye** `TELEGRAM_BOT_TOKEN` (interfaz
retirada) ni `DATABASE_URL` de un Postgres local (sustituido por `SUPABASE_DB_URL`).

**Decisión de diseño (resuelve la duda que el usuario planteó):** este WP se queda como
"solo desarrollo local" — plantilla de env y Docker de n8n para trabajar en el equipo del autor.
El aprovisionamiento real de Vercel/Supabase/Google Cloud Run y el cableado de esas tres piezas en
producción es un WP nuevo, WP-21, porque es una responsabilidad distinta (ejecutar
provisioning contra servicios cloud reales, no escribir plantillas de config) y depende de que
WP-01 y WP-04 ya existan, cosa que WP-03 no necesita.

## Por qué depende de []

Es configuración pura — nombres de variables y servicios — no necesita que `schema.sql` tenga
contenido para existir. Puede construirse en paralelo con WP-01.

## Fuera de alcance

- El documento único de instalación (antes "cuatro caminos") → WP-18, ese es documentación de
  uso, esto es la config base que ese documento referencia.
- Aprovisionar los proyectos reales de Vercel, Supabase y Google Cloud Run, y conectar sus variables de
  entorno en producción → WP-21 (nuevo en v0.4).
- Gestión de secretos en producción (vault, etc.) → fuera de alcance, proyecto personal de
  instalación individual (README §12), no multi-tenant.

## Estado

Esqueleto sin especificar. Ejecutar fase de "fill" antes de construir.
