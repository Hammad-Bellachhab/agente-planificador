---
id: WP-18
title: Documentación de instalación (4 caminos)
status: skeleton
size: M
depends_on: [WP-11]
owner: hammad
external: false
tasks_done: 0
tasks_total: 8
issue: null
subtitle: Transversal
---

# WP-18 — Documentación de instalación (4 caminos)

## Qué es

Escribe los cuatro documentos de `docs/instalacion/` (README §9): `localhost-docker.md`,
`vps.md`, `dispositivo-propio.md`, `n8n-cloud.md`. No se elige uno solo — los cuatro se
mantienen, cada uno probado literalmente antes de publicarse. En los tres primeros n8n corre en
Docker junto a Postgres (mismo `docker-compose.yml`); en `n8n-cloud` n8n vive gestionado fuera y
ese `docker-compose.yml` no incluye el servicio de n8n.

## Por qué depende de WP-11

No tiene sentido documentar cómo instalar algo que todavía no hace nada útil de punta a punta —
espera a que la Fase 1 / MVP (WP-11) exista para poder documentar un flujo real, verificable,
no aspiracional. Es deliberadamente un WP tardío/transversal: puede iterar en paralelo a Fase
1.x/2/3 según el usuario mencionó, no bloquea nada aguas abajo salvo WP-19.

## Fuera de alcance

- El propio `docker-compose.yml` y `.env.example` como artefactos de config → WP-03, este WP
  solo los documenta y los prueba, no los diseña desde cero.
- Configuración del proyecto de Google Cloud en modo Testing para Gmail (WP-17) → se documenta
  aquí como parte de `docs/instalacion/`, pero solo tiene sentido una vez WP-17 exista; puede
  añadirse como sección incremental sin bloquear la primera versión de estos cuatro documentos.

## Estado

Esqueleto sin especificar. Ejecutar fase de "fill" antes de construir.
