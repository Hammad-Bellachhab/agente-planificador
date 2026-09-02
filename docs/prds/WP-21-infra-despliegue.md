---
id: WP-21
title: Infra y despliegue (Vercel + Supabase + Railway)
status: skeleton
size: M
depends_on: [WP-01, WP-02, WP-04, WP-20]
owner: hammad
external: false
tasks_done: 0
tasks_total: 8
issue: null
subtitle: Transversal — despliegue (nuevo en v0.4)
---

# WP-21 — Infra y despliegue (Vercel + Supabase + Railway)

## Qué es

**Nuevo en v0.4.** El pivote de arquitectura (README §2, §9, §13) reemplaza "cuatro caminos de
instalación documentados para terceros" por un único despliegue propio, en tres piezas cloud
que hay que aprovisionar y conectar:

- **Vercel**: crear el proyecto con root directory `web/`, conectar el repo, primer deploy del
  frontend Next.js.
- **Supabase**: crear el proyecto, aplicar `db/schema.sql` y `db/seed.sql` contra su Postgres
  gestionado (`psql "$SUPABASE_DB_URL" -f db/schema.sql` — comando ya documentado en README
  "Entorno de desarrollo").
- **Railway** (o el host persistente elegido): desplegar `nucleo/agente.py` como proceso
  persistente — no como función serverless, ver README §3 sobre por qué el cliente MCP no
  encaja en Vercel.
- **Conectar las tres piezas** por variables de entorno: `SUPABASE_DB_URL` (núcleo → Supabase),
  `NUCLEO_API_URL` (frontend en Vercel → núcleo en Railway), credenciales de cada servidor MCP
  (núcleo → Notion/Calendar/Gmail), y CORS en el núcleo para aceptar peticiones desde el
  dominio de Vercel.

Es la ejecución real del despliegue; `.env.example`/`docker-compose.yml` (WP-03) son plantillas
de config para desarrollo local, distintas de este WP.

## Por qué depende de WP-01, WP-02, WP-04, WP-20

- **WP-01**: no hay nada que aplicar contra Supabase sin `schema.sql` relleno.
- **WP-02**: `seed.sql` debe aplicarse junto al esquema para que la taxonomía tenga valores por
  defecto desde el primer despliegue (README §8).
- **WP-04**: no hay núcleo que desplegar en Railway sin el esqueleto de la API.
- **WP-20**: no hay frontend real que desplegar en Vercel sin la UI de chat — desplegar el
  boilerplate por defecto de `create-next-app` no demuestra que las tres piezas están
  conectadas de verdad.

## Fuera de alcance

- Diseñar el esquema, el seed, la API o la UI en sí → WP-01, WP-02, WP-04, WP-20
  respectivamente; este WP los despliega, no los construye.
- Documentar el proceso paso a paso para que otra persona lo repita → WP-18 (pospuesto,
  README §12), que además depende de este WP para documentar un despliegue ya verificado.
- CI/CD (despliegue automático en cada push) → no comprometido, se hace manual la primera vez;
  candidato futuro si el uso real lo pide.
- Dominio propio / DNS → fuera de alcance, se usa el subdominio por defecto de Vercel mientras
  el proyecto sea personal.

## Estado

Esqueleto sin especificar. Ejecutar fase de "fill" antes de construir.
