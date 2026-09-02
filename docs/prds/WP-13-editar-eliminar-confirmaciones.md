---
id: WP-13
title: editar_tarea / eliminar_tarea + confirmaciones
status: skeleton
size: L
depends_on: [WP-11]
owner: hammad
external: false
tasks_done: 0
tasks_total: 13
issue: null
subtitle: Fase 1.x
---

# WP-13 — editar_tarea / eliminar_tarea + confirmaciones

## Qué es

Introduce las herramientas `editar_tarea` y `eliminar_tarea`, y el mecanismo de
`confirmaciones_pendientes` (README §11) que ambas requieren, **juntos, en el mismo WP** — no
tiene sentido dar de alta cualquiera de las dos herramientas sin el mecanismo de confirmación,
porque ambas pueden apuntar a más de una fila de `tareas` de forma ambigua ("cámbiale la
prioridad", "borra esa tarea"). Flujo: cada turno, antes de interpretar un mensaje como petición
nueva, el agente comprueba si hay una fila sin resolver en `confirmaciones_pendientes` para ese
usuario; si la hay, el mensaje se interpreta como la elección entre hasta 3 candidatas
mostradas, no como una petición nueva.

Deliberadamente su propio WP, separado de la Fase 1 (WP-11): crear una tarea nunca es ambiguo
(siempre genera una fila nueva), editar/eliminar casi siempre lo es — son problemas de UX y de
estado distintos.

## Por qué depende de WP-11

`editar_tarea`/`eliminar_tarea` operan sobre tareas que `crear_tarea_universidad` (WP-11) ya
creó — no hay nada que editar o borrar hasta que la creación funcione de verdad.

## Fuera de alcance

- Edición/eliminación de eventos de Calendar específicamente (más allá de lo que ya cubre
  `tareas` con `origen = 'calendar'`) → se cubre aquí mismo si el modelo de datos lo permite sin
  ampliación; si requiere tocar `calendar_mcp.py` (WP-10) más allá de una tool nueva, se
  reevalúa como sub-alcance en fill.
- Deshacer una confirmación ya resuelta → no planificado.

## Estado

Esqueleto sin especificar. Ejecutar fase de "fill" antes de construir.
