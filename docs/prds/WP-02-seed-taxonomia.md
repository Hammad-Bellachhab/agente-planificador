---
id: WP-02
title: Seed de taxonomía
status: skeleton
size: S
depends_on: [WP-01]
owner: hammad
external: false
tasks_done: 0
tasks_total: 5
issue: null
subtitle: Fase 0
---

# WP-02 — Seed de taxonomía

## Qué es

Rellena `db/seed.sql`: inserta en `taxonomia` los valores por defecto de `tipo`, `prioridad`,
`tiempo_estimado` y `energia` que se cargan al instalar (README §8) — los valores reales del
Notion de origen del autor, ya pensados, no inventados de nuevo. Es lo que permite que
`construir_herramienta_crear_tarea` (README §5) tenga enums no vacíos desde el primer arranque,
sin exigirle nada al usuario en el onboarding.

## Por qué depende de WP-01

`seed.sql` hace `INSERT` sobre la tabla `taxonomia` — no puede escribirse ni probarse hasta que
esa tabla exista con su forma final (columnas `campo`/`valor`/`orden`, el CHECK de `campo` ya
corregido sin `'estado'`).

## Fuera de alcance

- El comando `/personalizar` que permite al usuario editar `taxonomia` después de instalar → no
  tiene WP propio todavía; candidato natural para Fase 1 o 1.5 si se decide priorizar, hoy sin
  comprometer.
- Datos personales (`asignaturas`, `horario_clases`, `examenes`) — esos no se siembran, se
  recogen en el onboarding conversacional (WP-05), README §8 es explícito en esta distinción.

## Estado

Esqueleto sin especificar. Ejecutar fase de "fill" antes de construir.
