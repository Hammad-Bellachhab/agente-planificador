---
id: WP-15
title: Consultas de lectura
status: skeleton
size: L
depends_on: [WP-12]
owner: hammad
external: false
tasks_done: 0
tasks_total: 13
issue: null
subtitle: Fase 2
---

# WP-15 — Consultas de lectura

## Qué es

Herramientas de solo lectura para responder preguntas como "¿qué tengo pendiente de PBDA esta
semana?" — leyendo `tareas` (y, cuando haga falta, consultando Notion/Calendar directamente vía
las tools ya traducidas de WP-08/WP-10 para datos que no estén reflejados en Postgres). Es la
Fase 2 completa de README §7: "exige que el agente sepa escribir bien antes de razonar sobre lo
que ya existe".

## Por qué depende de WP-12

README §7 fija la regla de salida de fase de forma explícita: no se empieza la Fase 2 hasta que
la Fase 1 pase sus `casos_evaluacion` (WP-12) de verdad — no basta con que el código de WP-11
exista, tiene que estar demostrado que funciona.

## Fuera de alcance

- Inbox de captura rápida → WP-16 (Fase 3).
- Cualquier resumen automático o recordatorio proactivo → fuera de alcance sin fecha (README
  §7), cada uno es un dominio de datos distinto.
- Lectura de Gmail → WP-17, servidor y scope OAuth distintos.

## Estado

Esqueleto sin especificar. Ejecutar fase de "fill" antes de construir.
