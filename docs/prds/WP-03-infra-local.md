---
id: WP-03
title: Infra local (Docker + env)
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

# WP-03 — Infra local (Docker + env)

## Qué es

Endurece lo que ya existe en `docker-compose.yml` (servicios `postgres` y `n8n`, puerto 5678,
`TZ=Europe/Madrid`) y rellena la forma de `.env.example` (hoy vacío) con las claves que el
proyecto necesitará — sin ningún valor real ni plausible: `TELEGRAM_BOT_TOKEN`, `LLM_API_KEY`,
credenciales de cada servidor MCP, `DATABASE_URL`. Incluye sacar el password de Postgres
(`cambia_esto`, hardcodeado hoy) a una variable de entorno con placeholder.

## Por qué depende de []

Es configuración pura — nombres de variables y servicios — no necesita que `schema.sql` tenga
contenido para existir. Puede construirse en paralelo con WP-01.

## Fuera de alcance

- Los cuatro caminos de instalación documentados (localhost-docker, vps, dispositivo-propio,
  n8n-cloud) → WP-18, ese es documentación de uso, esto es la config base que esos documentos
  referencian.
- Gestión de secretos en producción (vault, etc.) → fuera de alcance, proyecto personal/open
  source de instalación individual (README §12), no multi-tenant.

## Estado

Esqueleto sin especificar. Ejecutar fase de "fill" antes de construir.
