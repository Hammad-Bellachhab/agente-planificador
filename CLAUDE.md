# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

The architecture went through a pivot (v0.3 → v0.4, see README.md §13 "Historial de decisiones") — Telegram was dropped in favor of a web frontend, deployed on Vercel + Supabase + Google Cloud Run instead of the original self-hosted Telegram/n8n/Docker Postgres design.

**What actually exists right now:**
- `web/` — a Next.js/TypeScript app scaffolded with `create-next-app` (App Router, Tailwind, ESLint). No real chat UI yet, just the default boilerplate plus the project favicon (`web/app/icon.png`, `web/app/apple-icon.png`).
- `docs/prds/` — the full Work Package roadmap (21 WP-NN skeleton PRDs + `map.html` + `ROADMAP.md`), generated via the `prd-blueprint` skill. All still `status: skeleton` — none have been filled or built yet.
- `db/schema.sql`, `nucleo/agente.py`, `.env.example` — still empty placeholders. This is the actual next work: WP-01 (schema) and WP-04 (núcleo skeleton) are the ready-to-start items with no unmet dependencies.
- `docker-compose.yml` — only runs n8n locally now (Postgres moved to Supabase, no longer in Docker).

The authoritative design source is `README.md` — read it before making architectural decisions, especially §2 (stack), §4 (architecture diagram), §13 (decision history, explains every v0.3→v0.4 change and why).

## Architecture

Personal-planning conversational agent, reachable from a web chat, that reads/writes Notion, Google Calendar, and Gmail, with Supabase (PostgreSQL) as persistent memory of every interaction and decision. Single-user app — no auth, no multi-tenancy.

**Layered flow**: `Next.js chat (Vercel) → HTTPS → nucleo/ API (Python, container on Google Cloud Run) → MCP client → MCP servers (Notion/Calendar/Gmail) → Supabase Postgres`

n8n is **not** in this path — it's kept only for secondary, optional automations (e.g. Fase 1.5's schedule→Calendar sync, future proactive reminders) that trigger the núcleo's API or Supabase directly, decoupled from the chat request path.

**Key architectural decisions** (full rationale in README §3, §13):
- MCP instead of n8n-native integrations for Notion/Calendar/Gmail — one uniform client/protocol instead of three bespoke SDKs.
- The núcleo can't live in Vercel's serverless functions because MCP needs to hold live connections per request; it runs as its own container on **Google Cloud Run** instead (Railway was considered and dropped — free tier there is trial-only, not permanent). Cloud Run scales to zero on idle, so cold starts reconnect the 3 MCP servers — acceptable for a low-traffic personal app, not a true always-on process.
- Notion uses the official `notion-mcp-server` (generic tools — search/fetch/create-pages — need a translation layer in `nucleo/herramientas/notion_mcp.py` to become the dynamic `crear_tarea_universidad` tool). Calendar and Gmail have no official Google MCP server, so those are built in-house on `google-api-python-client`, sharing one OAuth client with different scopes.

**Planned folder structure** (README §6): `web/` (Next.js frontend), `nucleo/` (Python core: `agente.py`, `onboarding.py`, `herramientas/{notion,calendar,gmail}_mcp.py`, `evaluacion/casos.py`), `db/` (schema.sql, seed.sql), `n8n/` (secondary-automation workflow export), `docs/prds/` (WP roadmap).

### Data model (PostgreSQL, on Supabase — schema drafted in README §5, not yet written to `db/schema.sql`)

No fixed enums in code except `tareas.estado` (fixed CHECK: pendiente/en_curso/hecha — deliberately not taxonomy-driven, this was a contradiction in an earlier README draft, now resolved). Everything else generated at tool-definition time from Postgres:
- `materia` from `asignaturas` (populated during onboarding)
- `tipo`/`prioridad`/`tiempo_estimado`/`energia` from `taxonomia`, seeded with defaults via `db/seed.sql`, editable later via a `/personalizar` command — never by editing code or JSON

Write tools must be blocked while `perfil.onboarding_completo = false` — an empty `asignaturas` table would otherwise generate a useless `enum: []` for `materia`.

`usuarios` is a single seeded row (no `telegram_id`, no auth) — kept as a table only so `tareas`/`perfil`/etc. foreign keys don't need to change if multi-user ever comes back.

`llamadas_herramienta` records which MCP server (`notion`/`calendar`/`gmail`/`NULL`) resolved each tool call, plus args/result/success/latency.

`confirmaciones_pendientes` implements ambiguity confirmation (README §11): edit/delete on an ambiguous target presents up to 3 candidates and waits for the next message to be the disambiguation choice, checked before interpreting any new message. This is its own scope (`editar_tarea`/`eliminar_tarea`, WP-13), separate from and after the create-only MVP (Fase 1) — Fase 1 has no ambiguity to resolve.

`conversaciones` has no session-close concept — one continuous conversation per user. Context sent to the LLM each turn is a recency window (default suggestion: last 20 messages or last 2 hours, whichever is smaller — unvalidated, tune from real usage).

### Roadmap (`docs/prds/`) — 21 Work Packages, dependency-ordered, not phase-ordered

Full graph and status table: `docs/prds/ROADMAP.md` / `docs/prds/map.html`. Critical path: **WP-01 → WP-04 → WP-07 → WP-08 → WP-11 → WP-12 → WP-15 → WP-17**. Ready to start today (no unmet dependencies): **WP-01** (Postgres schema) and **WP-03** (local n8n infra), in parallel.

Roughly maps to README §7's phases: Fase 0 (WP-01/02/03/04/05/06) onboarding + infra, Fase 1/MVP (WP-07 through WP-12) create task/event via Notion+Calendar MCP, Fase 1.x (WP-13) edit/delete + ambiguity confirmation, Fase 1.5 (WP-14, optional) schedule sync, Fase 2 (WP-15) read queries, Fase 3 (WP-16/17) Inbox + Gmail, plus WP-20 (real frontend chat UI) and WP-21 (Vercel+Supabase+Cloud Run provisioning) which run in parallel to the critical path. WP-18 (install docs) and WP-19 (open-source readiness) are explicitly **deferred** — not active roadmap work while this stays a single-user app (README §12).

**Phase-exit rule** (README §7): don't start the next phase until the current one's `casos_evaluacion` pass for real.

## Local development (once code exists)

```bash
docker compose up -d          # n8n only now — Postgres is Supabase, not Docker

psql "$SUPABASE_DB_URL" -f db/schema.sql
psql "$SUPABASE_DB_URL" -f db/seed.sql

cp .env.example .env          # SUPABASE_DB_URL, LLM_API_KEY, MCP credentials — .env.example is currently empty (WP-03)

python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt   # doesn't exist yet — WP-04
python nucleo/agente.py           # exposes the HTTP API the frontend calls — not built yet

cd web && npm install && npm run dev   # frontend, already scaffolded
```

Deploy targets: Vercel (root directory `web/`), Supabase (managed Postgres), Google Cloud Run (núcleo container — needs a `nucleo/Dockerfile`, doesn't exist yet). Full provisioning steps are WP-21.
