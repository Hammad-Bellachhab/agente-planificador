# ROADMAP

> Generado por `generate_map.py`. No editar a mano — regenerar desde el frontmatter de los PRDs.

```mermaid
graph TD
  WP-01["WP-01 — Esquema PostgreSQL"]
  WP-02["WP-02 — Seed de taxonomía"]
  WP-03["WP-03 — Infra local (Docker n8n + env)"]
  WP-04["WP-04 — Esqueleto del núcleo Python"]
  WP-05["WP-05 — Onboarding conversacional"]
  WP-06["WP-06 — n8n — automatizaciones secundarias (opcional)"]
  WP-07["WP-07 — Cliente MCP (plumbing multi-servidor)"]
  WP-08["WP-08 — Notion MCP — capa de traducción"]
  WP-09["WP-09 — Cliente OAuth de Google (compartido)"]
  WP-10["WP-10 — Calendar MCP — servidor propio"]
  WP-11["WP-11 — Herramienta crear_tarea_universidad"]
  WP-12["WP-12 — Casos de evaluación — Fase 1"]
  WP-13["WP-13 — editar_tarea / eliminar_tarea + confirmaciones"]
  WP-14["WP-14 — Sync horario_clases → Calendar (opcional)"]
  WP-15["WP-15 — Consultas de lectura"]
  WP-16["WP-16 — Inbox — captura rápida"]
  WP-17["WP-17 — Gmail MCP — leer y redactar"]
  WP-18["WP-18 — Documentación de instalación"]
  WP-19["WP-19 — Open source readiness"]
  WP-20["WP-20 — Frontend — UI de chat real"]
  WP-21["WP-21 — Infra y despliegue (Vercel + Supabase + Cloud Run)"]
  WP-01 --> WP-02
  WP-01 --> WP-04
  WP-03 --> WP-04
  WP-04 --> WP-05
  WP-04 --> WP-06
  WP-04 --> WP-07
  WP-07 --> WP-08
  WP-04 --> WP-09
  WP-09 --> WP-10
  WP-07 --> WP-10
  WP-08 --> WP-11
  WP-10 --> WP-11
  WP-05 --> WP-11
  WP-11 --> WP-12
  WP-11 --> WP-13
  WP-05 --> WP-14
  WP-10 --> WP-14
  WP-12 --> WP-15
  WP-15 --> WP-16
  WP-09 --> WP-17
  WP-07 --> WP-17
  WP-15 --> WP-17
  WP-11 --> WP-18
  WP-21 --> WP-18
  WP-18 --> WP-19
  WP-04 --> WP-20
  WP-01 --> WP-21
  WP-02 --> WP-21
  WP-04 --> WP-21
  WP-20 --> WP-21
```

| ID | Título | Estado | Progreso | Tamaño | Depende de | Camino crítico |
|---|---|---|---|---|---|---|
| WP-01 | Esquema PostgreSQL | done | 13/13 | L | — | sí |
| WP-02 | Seed de taxonomía | skeleton | 0/5 | S | WP-01 |  |
| WP-03 | Infra local (Docker n8n + env) | skeleton | 0/5 | S | — |  |
| WP-04 | Esqueleto del núcleo Python | done | 8/8 | M | WP-01, WP-03 | sí |
| WP-05 | Onboarding conversacional | skeleton | 0/13 | L | WP-04 |  |
| WP-06 | n8n — automatizaciones secundarias (opcional) | skeleton | 0/5 | S | WP-04 |  |
| WP-07 | Cliente MCP (plumbing multi-servidor) | skeleton | 0/8 | M | WP-04 | sí |
| WP-08 | Notion MCP — capa de traducción | skeleton | 0/13 | L | WP-07 | sí |
| WP-09 | Cliente OAuth de Google (compartido) | skeleton | 0/5 | S | WP-04 |  |
| WP-10 | Calendar MCP — servidor propio | skeleton | 0/8 | M | WP-09, WP-07 |  |
| WP-11 | Herramienta crear_tarea_universidad | skeleton | 0/8 | M | WP-08, WP-10, WP-05 | sí |
| WP-12 | Casos de evaluación — Fase 1 | skeleton | 0/5 | S | WP-11 | sí |
| WP-13 | editar_tarea / eliminar_tarea + confirmaciones | skeleton | 0/13 | L | WP-11 |  |
| WP-14 | Sync horario_clases → Calendar (opcional) | skeleton | 0/5 | S | WP-05, WP-10 |  |
| WP-15 | Consultas de lectura | skeleton | 0/13 | L | WP-12 | sí |
| WP-16 | Inbox — captura rápida | skeleton | 0/5 | S | WP-15 |  |
| WP-17 | Gmail MCP — leer y redactar | skeleton | 0/8 | M | WP-09, WP-07, WP-15 | sí |
| WP-18 | Documentación de instalación | skeleton | 0/5 | S | WP-11, WP-21 |  |
| WP-19 | Open source readiness | skeleton | 0/5 | S | WP-18 |  |
| WP-20 | Frontend — UI de chat real | done | 10/10 | L | WP-04 |  |
| WP-21 | Infra y despliegue (Vercel + Supabase + Cloud Run) | skeleton | 0/8 | M | WP-01, WP-02, WP-04, WP-20 |  |
