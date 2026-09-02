---
id: WP-10
title: Calendar MCP — servidor propio
status: skeleton
size: M
depends_on: [WP-09, WP-07]
owner: hammad
external: false
tasks_done: 0
tasks_total: 8
issue: null
subtitle: Fase 1
---

# WP-10 — Calendar MCP — servidor propio

## Qué es

Rellena `nucleo/herramientas/calendar_mcp.py`: un servidor MCP Python propio y mínimo sobre
`google-api-python-client`, hospedado como subprocess stdio (vía el plumbing de WP-07), que
expone la tool de crear evento en Google Calendar. A diferencia de Notion, Google no publica un
servidor MCP oficial para Calendar — este servidor se construye desde cero, pero deliberadamente
mínimo (una tool: crear evento; no un wrapper completo de la API de Calendar).

## Por qué depende de WP-09, WP-07

Necesita el cliente OAuth compartido (WP-09) para autenticarse contra la API de Google con el
scope de Calendar, y el plumbing de subprocess stdio + registro de servidores (WP-07) para
hospedarse igual que Notion.

## Fuera de alcance

- Leer eventos existentes de Calendar (para las consultas de Fase 2) → WP-15.
- Editar/eliminar eventos → WP-13, junto con `editar_tarea`/`eliminar_tarea` de Notion.
- Sincronización automática de `horario_clases` → WP-14 (Fase 1.5, opcional).

## Estado

Esqueleto sin especificar. Ejecutar fase de "fill" antes de construir.
