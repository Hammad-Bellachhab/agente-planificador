---
id: WP-11
title: Herramienta crear_tarea_universidad
status: skeleton
size: M
depends_on: [WP-08, WP-10, WP-05]
owner: hammad
external: false
tasks_done: 0
tasks_total: 8
issue: null
subtitle: Fase 1 — MVP
---

# WP-11 — Herramienta crear_tarea_universidad

## Qué es

El punto de integración de la Fase 1 / MVP: construye `construir_herramienta_crear_tarea`
(README §5) que genera en tiempo de ejecución los enums de `materia` (desde `asignaturas`) y
`tipo`/`prioridad`/`tiempo_estimado` (desde `taxonomia`), decide si el destino de la tarea es
Notion (To-Do Universidad / To-Do del día, vía WP-08) o Calendar (vía WP-10), y **bloquea
explícitamente la escritura si `asignaturas` está vacía** (`perfil.onboarding_completo =
false`) en vez de generar silenciosamente un `enum: []`. Este bloqueo es una regla de negocio
explícita, no un efecto colateral — un `enum` vacío que el LLM intenta rellenar de todas formas
es peor que un rechazo claro.

Es, junto con WP-08 y WP-10, el entregable real de la Fase 1 de README §7: "crear tarea/evento
en To-Do Universidad, To-Do del día o Calendar, usando lo aprendido en el onboarding".

## Por qué depende de WP-08, WP-10, WP-05

Necesita ambos servidores MCP con sus tools ya traducidas (WP-08 para Notion, WP-10 para
Calendar) para poder enrutar hacia cualquiera de los dos, y necesita el onboarding (WP-05) para
que `asignaturas`/`perfil.onboarding_completo` tengan datos reales contra los que decidir
bloquear o no.

## Fuera de alcance

- `editar_tarea`/`eliminar_tarea` → WP-13, deliberadamente fuera de la Fase 1 porque introduce
  ambigüedad de target que crear_tarea no tiene.
- Casos de evaluación automatizados de esta tool → WP-12.
- El comando `/personalizar` sobre `taxonomia` → no tiene WP propio todavía.

## Estado

Esqueleto sin especificar. Ejecutar fase de "fill" antes de construir.
