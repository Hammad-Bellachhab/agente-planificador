---
id: WP-08
title: Notion MCP — capa de traducción
status: skeleton
size: L
depends_on: [WP-07]
owner: hammad
external: false
tasks_done: 0
tasks_total: 13
issue: null
subtitle: Fase 1
---

# WP-08 — Notion MCP — capa de traducción

## Qué es

Rellena `nucleo/herramientas/notion_mcp.py`: hospeda el servidor oficial
`makenotion/notion-mcp-server` vía `npx` como subprocess stdio (usando el plumbing de WP-07), y
construye la capa de traducción entre la tool dinámica que ve el LLM
(`construir_herramienta_crear_tarea`, README §5) y las tools genéricas que ese servidor oficial
expone (`search`, `fetch`, `create-pages`, `update-page`, `query-data-source`). Esto es trabajo
real, no trivial: no hay un mapeo 1:1 entre "crear una tarea en To-Do Universidad con estos
campos" y las tools genéricas de Notion — este WP decide y construye ese mapeo (qué data source
de Notion corresponde a "To-Do Universidad" vs "To-Do del día", cómo se mapean
materia/tipo/prioridad/tiempo_estimado a propiedades de página).

## Por qué depende de WP-07

Necesita el plumbing de subprocess stdio y el registro de servidores ya construido — este WP
solo añade el servidor Notion concreto y su lógica de traducción, no reconstruye cómo se lanza
o loguea un subprocess MCP.

## Fuera de alcance

- La decisión de bloquear la escritura si `asignaturas` está vacía (`perfil.onboarding_completo
  = false`) → vive en WP-11 (`crear_tarea_universidad`), que es quien construye la tool
  dinámica y decide si se genera o no; este WP solo traduce llamadas ya validadas.
- `editar_tarea`/`eliminar_tarea` sobre páginas de Notion → WP-13.
- Servidor de Calendar → WP-10, es un servidor Python propio distinto, no pasa por este archivo.

## Estado

Esqueleto sin especificar. Ejecutar fase de "fill" antes de construir.
