---
id: WP-18
title: Documentación de instalación
status: skeleton
size: S
depends_on: [WP-11, WP-21]
owner: hammad
external: false
tasks_done: 0
tasks_total: 5
issue: null
subtitle: Transversal — pospuesto (ver README §12)
---

# WP-18 — Documentación de instalación

## Qué es

**(v0.4) Pospuesto y reducido de alcance.** Este WP escribía cuatro documentos de instalación
(`localhost-docker.md`, `vps.md`, `dispositivo-propio.md`, `n8n-cloud.md`) para que terceros
desconocidos pudieran instalar el proyecto por caminos alternativos. Con el pivote a app
personal de un solo usuario (README §2, §9, §13), esa sección deja de tener sentido tal cual:
ya no hay "cuatro caminos" que documentar, hay **un único despliegue propio** — Vercel
(frontend) + Google Cloud Run (núcleo) + Supabase (Postgres), el mismo que ejecuta WP-21. Este WP pasa a
escribir un solo documento en `docs/instalacion/` que registra ese despliegue paso a paso, para
referencia futura propia (reinstalar en otra cuenta, recuperarse de un fallo) — no como
onboarding para desconocidos.

**Explícitamente pospuesto** (README §12): mientras el proyecto sea de un solo usuario, esto no
es trabajo activo de roadmap. Se mantiene como PRD de referencia, no se borra, para cuando (si
alguna vez) se retome la idea de publicar el repo.

## Por qué depende de WP-11, WP-21

Sigue sin tener sentido documentar cómo instalar algo que todavía no hace nada útil de punta a
punta — espera a la Fase 1 / MVP (WP-11). Añade WP-21 (v0.4): el documento describe un
despliegue real Vercel + Google Cloud Run + Supabase, así que no puede escribirse verificado hasta que
ese despliegue (WP-21) se haya ejecutado al menos una vez.

## Fuera de alcance

- El propio `docker-compose.yml` y `.env.example` como artefactos de config → WP-03, este WP
  solo los documenta y los prueba, no los diseña desde cero.
- La ejecución del despliegue en sí (crear los proyectos, aplicar el esquema, conectar las
  piezas) → WP-21; este WP solo documenta ese proceso una vez ejecutado.
- Los cuatro documentos de instalación multi-camino originales → retirados en v0.4 junto con la
  visión open-source (README §12, §13); no se retoman mientras sea app de un solo usuario.
- Configuración del proyecto de Google Cloud en modo Testing para Gmail (WP-17) → se documenta
  aquí como sección incremental una vez WP-17 exista, sin bloquear la primera versión.

## Estado

Esqueleto sin especificar, **pospuesto** — no es trabajo activo de roadmap mientras el proyecto
sea de un solo usuario (README §12). Se retoma la fase de "fill" si/cuando se reabra la
intención open source.
