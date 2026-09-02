---
id: WP-01
title: Esquema PostgreSQL
status: skeleton
size: L
depends_on: []
owner: hammad
external: false
tasks_done: 0
tasks_total: 13
issue: null
subtitle: Fase 0
---

# WP-01 — Esquema PostgreSQL

## Qué es

Rellena `db/schema.sql` (hoy vacío) con las tablas de README §5: `usuarios`, `conversaciones`,
`mensajes`, `llamadas_herramienta`, `tareas`, `casos_evaluacion`, `perfil`, `asignaturas`,
`horario_clases`, `examenes`, `taxonomia`, `confirmaciones_pendientes`. Es la única fuente de
verdad de la que se generan en runtime todos los enums dinámicos (materia, tipo, prioridad,
tiempo_estimado, energia) — ningún otro WP puede escribir código de verdad sin esto.

Dos correcciones respecto al borrador del README que este WP debe aplicar (no reabrir, ya
decididas):
- `tareas.estado` se queda como `CHECK (estado IN ('pendiente','en_curso','hecha'))` fijo.
  `taxonomia.campo` **no** incluye `'estado'` en su propio CHECK — el borrador lo listaba y es
  una contradicción con "estado es CHECK fijo, no taxonomía".
- `mensajes` gana una columna `telegram_message_id` (única por usuario o globalmente única según
  se decida en fill) para poder deduplicar reintentos de webhook de Telegram — idempotencia a
  nivel de escritura, no solo a nivel de UI.

## Por qué depende de []

Es la raíz del grafo. No depende de nada porque es la primera pieza de código real del
proyecto — hoy `db/schema.sql` está vacío y todo lo demás (núcleo, MCP, onboarding) necesita
tablas contra las que escribir y leer.

## Fuera de alcance

- `seed.sql` (valores por defecto de `taxonomia`) → WP-02.
- Cualquier lógica de aplicación (Python) que lea o escriba estas tablas → WP-04 en adelante.
- Migraciones incrementales / versionado de esquema → no planificado, fuera de alcance sin fecha.

## Estado

Esqueleto sin especificar. Ejecutar fase de "fill" antes de construir.
