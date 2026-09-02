---
id: WP-14
title: Sync horario_clases → Calendar (opcional)
status: skeleton
size: S
depends_on: [WP-05, WP-10]
owner: hammad
external: false
tasks_done: 0
tasks_total: 5
issue: null
subtitle: Fase 1.5 (opcional, sin comprometer)
---

# WP-14 — Sync horario_clases → Calendar (opcional)

## Qué es

Al terminar el onboarding, crea automáticamente en Google Calendar los eventos recurrentes
correspondientes a `horario_clases`, en vez de exigir que el usuario los introduzca manualmente.
README §7 lo marca explícitamente como sugerencia "sin comprometer" — candidato natural una vez
Fase 1 esté probada, no forma parte del compromiso de alcance actual.

## Por qué depende de WP-05, WP-10

Necesita `horario_clases` ya poblado por el onboarding (WP-05) como fuente de datos, y el
servidor Calendar (WP-10) ya construido como destino de escritura.

## Fuera de alcance

- Mantener la sincronización actualizada si el usuario edita `horario_clases` después (vía
  `/personalizar` o similar) → no planificado, esto es solo la sincronización inicial post-onboarding.
- Sincronizar `examenes` a Calendar → posible extensión futura del mismo WP en fill, no
  comprometida aquí.

## Estado

Esqueleto sin especificar, alcance opcional/sin comprometer. Ejecutar fase de "fill" antes de
construir, o descartar si el uso real de Fase 1 no lo justifica.
