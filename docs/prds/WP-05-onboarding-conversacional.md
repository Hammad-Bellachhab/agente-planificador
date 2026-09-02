---
id: WP-05
title: Onboarding conversacional
status: skeleton
size: L
depends_on: [WP-04]
owner: hammad
external: false
tasks_done: 0
tasks_total: 13
issue: null
subtitle: Fase 0
---

# WP-05 — Onboarding conversacional

## Qué es

Rellena `nucleo/onboarding.py`: el flujo conversacional que recoge `perfil` (qué estudia,
institución), `asignaturas`, `horario_clases` y `examenes`, y marca
`perfil.onboarding_completo = true` al terminar. Es la Fase 0 completa de README §7 — "sin
esto no hay con qué rellenar `materia`", el enum que Fase 1 necesita para poder crear una sola
tarea.

## Por qué depende de WP-04

Necesita el esqueleto del núcleo (conexión a Postgres, registro de mensajes) para tener dónde
vivir como flujo conversacional — no puede escribir en `perfil`/`asignaturas` sin la conexión
que WP-04 establece.

## Fuera de alcance

- Sincronizar `horario_clases` con Google Calendar automáticamente → Fase 1.5, WP-14, explícitamente
  "sin comprometer" en README §7.
- El transporte real por Telegram (webhook → HTTP Request) → WP-06; este WP construye la lógica
  de la conversación, no cómo llega el mensaje.
- Editar datos del onboarding después de completado (p. ej. añadir una asignatura a mitad de
  cuatrimestre) → no tiene WP propio todavía, candidato futuro si el uso real lo pide.

## Estado

Esqueleto sin especificar. Ejecutar fase de "fill" antes de construir.
