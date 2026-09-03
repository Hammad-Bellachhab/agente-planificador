---
id: WP-01
title: Esquema PostgreSQL
status: done
size: L
depends_on: []
owner: hammad
external: false
tasks_done: 13
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

Una corrección respecto al borrador del README que este WP debe aplicar (no reabrir, ya
decidida):
- `tareas.estado` se queda como `CHECK (estado IN ('pendiente','en_curso','hecha'))` fijo.
  `taxonomia.campo` **no** incluye `'estado'` en su propio CHECK — el borrador lo listaba y es
  una contradicción con "estado es CHECK fijo, no taxonomía".

> **(v0.4)** `mensajes` ya no lleva `telegram_message_id`. Esa columna existía para deduplicar
> reintentos de webhook de Telegram — con el pivote a frontend web que llama por HTTPS
> directamente al núcleo (README §3-4), el patrón de transporte cambia de "webhook con reintentos
> at-least-once" a "petición/respuesta síncrona iniciada por el cliente", que no tiene la misma
> necesidad estructural de deduplicación. Si en fill aparece un caso real de doble envío (p. ej.
> el usuario reenvía por doble clic en el frontend), la idempotencia se resuelve en el lado del
> cliente (deshabilitar el botón de envío) o con un `request_id` generado por el frontend —
> agnóstico al transporte, sin acoplar el esquema a Telegram. No se añade columna especulativa
> hasta que WP-04/WP-20 confirmen que hace falta.

## Por qué depende de []

Es la raíz del grafo. No depende de nada porque es la primera pieza de código real del
proyecto — hoy `db/schema.sql` está vacío y todo lo demás (núcleo, MCP, onboarding) necesita
tablas contra las que escribir y leer.

## Fuera de alcance

- `seed.sql` (valores por defecto de `taxonomia`) → WP-02.
- Cualquier lógica de aplicación (Python) que lea o escriba estas tablas → WP-04 en adelante.
- Migraciones incrementales / versionado de esquema → no planificado, fuera de alcance sin fecha.
- Mecanismo de idempotencia a nivel de escritura (`request_id` o similar) → no decidido en este
  WP, ver nota v0.4 arriba; si hace falta, se especifica en WP-04 o WP-20 cuando haya un caso
  real que lo justifique.
- Aplicar este esquema contra el Postgres gestionado de Supabase (vs. diseñarlo) → WP-21.

## Estado

**Hecho.** `db/schema.sql` relleno con las 12 tablas, aplicado contra Supabase (verificado con
`\dt`). Las dos correcciones de diseño ya incorporadas: `taxonomia.campo` sin `'estado'`,
sin `telegram_message_id` (idempotencia por transporte pospuesta, ver README §13).
