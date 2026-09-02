---
id: WP-09
title: Cliente OAuth de Google (compartido)
status: skeleton
size: S
depends_on: [WP-04]
owner: hammad
external: false
tasks_done: 0
tasks_total: 5
issue: null
subtitle: Fase 1
---

# WP-09 — Cliente OAuth de Google (compartido)

## Qué es

Un único cliente OAuth de Google, construido una vez sobre `google-api-python-client`, que
Calendar (WP-10, Fase 1) y Gmail (WP-17, Fase 3) reutilizan cada uno con sus propios scopes
(`calendar` vs `gmail.readonly`/`gmail.send`, etc.) en vez de duplicar el flujo de
autenticación. Gestiona el intercambio y refresco de tokens por instalación individual (README
§12 — proyecto open source instalable por terceros, no multi-tenant).

## Por qué depende de WP-04

Necesita el esqueleto del núcleo como el proceso que va a almacenar/leer las credenciales OAuth
(vía `.env`/config), pero no depende de MCP ni de ningún servidor concreto — es una utilidad
compartida, no un servidor MCP en sí mismo.

## Fuera de alcance

- El servidor MCP de Calendar que usa este cliente → WP-10.
- El servidor MCP de Gmail que reutiliza este cliente con otros scopes → WP-17.
- El modo "Testing" de verificación OAuth de Google que Gmail necesita por instalación
  individual (README §12) → se flaggea explícitamente en WP-17, no aquí; este WP es agnóstico al
  scope.

## Estado

Esqueleto sin especificar. Ejecutar fase de "fill" antes de construir.
