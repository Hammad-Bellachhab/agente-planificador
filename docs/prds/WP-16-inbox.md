---
id: WP-16
title: Inbox — captura rápida
status: skeleton
size: S
depends_on: [WP-15]
owner: hammad
external: false
tasks_done: 0
tasks_total: 5
issue: null
subtitle: Fase 3
---

# WP-16 — Inbox — captura rápida

## Qué es

Captura rápida sin clasificar: el usuario manda algo por el chat web que quiere guardar sin
decidir en el momento su tipo/materia/prioridad, y el agente lo deja en un "Inbox" (Notion) para
procesar después. **(v0.4)** antes el transporte de captura era Telegram; con el pivote de
interfaz (README §2-4) es el mismo chat web de WP-20 — la lógica de "guardar sin clasificar" no
cambia, solo el canal. README §7 nota que es "de bajo impacto sin nada maduro debajo" — por eso
vive después de que crear/editar/consultar tareas ya funcionen.

## Por qué depende de WP-15

README §7 fija el orden secuencial de fases (no se salta una hasta que la anterior esté
validada) — Fase 3 viene después de que Fase 2 (consultas de lectura) esté construida.
Funcionalmente, Inbox reutiliza el mismo servidor Notion (WP-08) que ya existe; la dependencia
es de orden de fase, no de un bloqueo técnico nuevo.

## Fuera de alcance

- Clasificación automática del contenido del Inbox (asignarle materia/tipo) → explícitamente
  fuera de alcance del concepto mismo de "Inbox sin clasificar" en README §7.
- Gmail → WP-17, aunque comparten número de fase, son WPs independientes.

## Estado

Esqueleto sin especificar. Ejecutar fase de "fill" antes de construir.
