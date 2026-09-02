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
subtitle: Transversal — gate final antes de publicar
---

# WP-19 — Open source readiness

## Qué es

Los mínimos no negociables de README §12 antes de publicar el repo como público e instalable por
terceros: `LICENSE` (sugerencia MIT), verificación final de que `.env.example` tiene cero
valores reales o plausibles, y confirmación de que alguien que no sea el autor siguió las
instrucciones de instalación (WP-18) literalmente y sin ayuda, y le funcionaron. Incluye
evaluar si el enum de `materia` (hoy sembrado desde el onboarding propio del autor, README §5)
necesita generalizarse para leer el esquema real de un Notion de un tercero — README es
explícito en que esto no es tarea de la Fase 1, se revisita aquí.

## Por qué depende de WP-18

No puede haber "alguien que siga las instrucciones de instalación" si esas instrucciones (WP-18)
todavía no existen — este WP es el gate final, posterior a que la documentación de instalación
esté escrita.

## Fuera de alcance

- Publicar el repo en sí (hacerlo público en GitHub) → acción operativa fuera del alcance de
  cualquier WP de código.
- Soporte multi-tenant o aislamiento entre usuarios en la misma instalación → README §13 es
  explícito: "no hace falta aislamiento multi-tenant en la BD", cada instalación es de una
  persona.

## Estado

Esqueleto sin especificar. Ejecutar fase de "fill" antes de construir.
