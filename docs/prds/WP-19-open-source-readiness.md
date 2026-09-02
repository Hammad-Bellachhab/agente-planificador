---
id: WP-19
title: Open source readiness
status: skeleton
size: S
depends_on: [WP-18]
owner: hammad
external: false
tasks_done: 0
tasks_total: 5
issue: null
subtitle: Transversal — pospuesto, gate futuro (ver README §12)
---

# WP-19 — Open source readiness

## Qué es

**(v0.4) Pospuesto.** README §12 marca explícitamente esta nota como "pospuesta" mientras el
proyecto sea una app personal de un solo usuario (README §2, §13 — revierte la visión
open-source de v0.2/v0.3). Este WP sigue documentando los mínimos no negociables para cuando
(si alguna vez) se retome esa idea: `LICENSE` (sugerencia MIT), verificación final de que
`.env.example` tiene cero valores reales o plausibles, confirmación de que alguien que no sea
el autor siguió las instrucciones de instalación (WP-18) literalmente y sin ayuda y le
funcionaron, evaluar si el enum de `materia` necesita generalizarse, y **(v0.4, nuevo)**
reintroducir Supabase Auth y aislamiento multi-usuario (RLS) — retirados al pasar a app personal
en v0.4 (README §13), tendrían que volver si se publica para terceros.

No es trabajo activo de roadmap ahora mismo — se mantiene como referencia futura, no se borra.

## Por qué depende de WP-18

No puede haber "alguien que siga las instrucciones de instalación" si esas instrucciones (WP-18)
todavía no existen — este WP es el gate final, posterior a que la documentación de instalación
esté escrita.

## Fuera de alcance

- Publicar el repo en sí (hacerlo público en GitHub) → acción operativa fuera del alcance de
  cualquier WP de código.
- Implementar de verdad Supabase Auth / RLS multi-usuario → mencionado en "Qué es" como algo que
  *tendría* que volver si se publica, pero no se construye aquí ni ahora; mientras el proyecto
  sea de un solo usuario (README §2, §13), cada instalación sigue siendo de una persona sin
  aislamiento multi-tenant en la BD.

## Estado

Esqueleto sin especificar y **pospuesto** — no es trabajo activo de roadmap mientras el proyecto
sea de un solo usuario (README §12). Se retoma la fase de "fill" si/cuando se reabra la
intención open source.
