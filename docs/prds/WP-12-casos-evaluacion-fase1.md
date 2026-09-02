---
id: WP-12
title: Casos de evaluación — Fase 1
status: skeleton
size: S
depends_on: [WP-11]
owner: hammad
external: false
tasks_done: 0
tasks_total: 5
issue: null
subtitle: Fase 1 — gate de salida
---

# WP-12 — Casos de evaluación — Fase 1

## Qué es

Rellena `nucleo/evaluacion/casos.py` y puebla `casos_evaluacion` con prompts reales de prueba
("apunta un examen de PBDA para el viernes", "añade tarea urgente de Cálculo") contra
`crear_tarea_universidad` (WP-11), comparando `herramienta_esperada` vs `herramienta_obtenida` y
registrando `paso`. Es el gate de salida explícito que README §7 exige: **no se empieza la Fase
2 hasta que la Fase 1 funcione de verdad, con casos de evaluación pasando**.

## Por qué depende de WP-11

No hay nada que evaluar hasta que `crear_tarea_universidad` exista y pueda invocarse de verdad
contra Notion/Calendar.

## Fuera de alcance

- Evaluación de `editar_tarea`/`eliminar_tarea` (WP-13) o de las consultas de lectura de Fase 2
  (WP-15) → cada fase futura añade sus propios casos a esta misma tabla/harness, no se cubren
  aquí.
- Un dashboard o reporte visual de resultados de evaluación → no planificado, se lee
  directamente de `casos_evaluacion`.

## Estado

Esqueleto sin especificar. Ejecutar fase de "fill" antes de construir.
