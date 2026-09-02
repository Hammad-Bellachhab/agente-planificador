---
id: WP-07
title: Cliente MCP (plumbing multi-servidor)
status: skeleton
size: M
depends_on: [WP-04]
owner: hammad
external: false
tasks_done: 0
tasks_total: 8
issue: null
subtitle: Fase 1
---

# WP-07 — Cliente MCP (plumbing multi-servidor)

## Qué es

El plumbing genérico del cliente MCP: registro de servidores (Notion, Calendar, y más adelante
Gmail), gestión de subprocesos stdio uniforme para los tres, y logging de cada llamada en
`llamadas_herramienta` con el campo `servidor_mcp` correcto (`'notion'`/`'calendar'`/`'gmail'`/
`NULL` para llamadas internas a Postgres). Deliberadamente **no** conoce el nombre de ninguna
tool concreta de Notion o Calendar — solo sabe cómo lanzar, hablar y loguear contra un servidor
MCP genérico vía stdio.

Esta separación es una decisión explícita de arquitectura: el wiring de herramientas de
Notion/Calendar (WP-08, WP-10) es su propio WP, separado de este. Así, cuando llegue Gmail en
Fase 3 (WP-17), ese WP solo tiene que registrar un servidor nuevo contra este plumbing ya
existente, sin tocar el núcleo del cliente.

## Por qué depende de WP-04

Necesita el esqueleto del núcleo (WP-04) como el proceso padre que lanza y gestiona los
subprocesos stdio, y la conexión a Postgres ya establecida para escribir en
`llamadas_herramienta`.

## Fuera de alcance

- Traducción de la tool dinámica `crear_tarea_universidad` a las tools genéricas de Notion
  (`search`/`fetch`/`create-pages`/`update-page`/`query-data-source`) → WP-08.
- El servidor Python propio de Calendar → WP-10.
- El servidor Python propio de Gmail → WP-17 (Fase 3), que solo añade un registro nuevo a este
  plumbing.

## Estado

Esqueleto sin especificar. Ejecutar fase de "fill" antes de construir.
