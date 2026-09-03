# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

The architecture went through a pivot (v0.3 → v0.4, see README.md §13 "Historial de decisiones") — Telegram was dropped in favor of a web frontend, deployed on Vercel + Supabase + Google Cloud Run instead of the original self-hosted Telegram/n8n/Docker Postgres design.

**What actually exists right now:**
- `db/schema.sql` — filled, applied against Supabase. All 12 tables live (verified with `\dt`). (WP-01, done)
- `nucleo/agente.py` — a working FastAPI skeleton: `GET /health`, `POST /mensaje` (body `{"contenido"}` → `{"respuesta", "conversacion_id"}`). Connects to Postgres via `SUPABASE_DB_URL`, registers messages in `mensajes`. Tested end-to-end (real request round-tripped through to the `mensajes` table). No LLM/MCP/onboarding logic yet — deliberately thin, that's WP-05/WP-07/WP-11. `requirements.txt`, `herramientas/__init__.py`, `evaluacion/__init__.py` exist as empty scaffolding. (WP-04, done)
- `web/` — a real multi-page Next.js/TypeScript app, not the create-next-app boilerplate anymore. Routes: `/` (landing), `/chat` (the working chat UI), `/como-se-usa`, `/infra`, `/docs`. A global `SiteNav` (fade-in on mount, gradient background, auto-hides on scroll-down/reveals on scroll-up — listens on `document` in the capture phase because the real scroll container is each page's `<main overflow-y-auto>`, not `window`) is shared across all routes via `layout.tsx`. Fonts: Montserrat (body/UI), Instrument Serif italic (display headlines), Geist Mono (file/path names on `/docs` only). Palette is the monochrome system from `docs/assets/banner.png`, encoded as CSS custom properties in `globals.css`. (WP-20, done — well beyond its original scope, which was just the chat UI)
- `PRODUCT.md` (repo root) — product-truth record written for the `impeccable` design skill's `init` flow. Read it before doing design work on `web/`. **Notable pinned exception, confirmed by the user after an explicit warning**: the landing page presents Gmail and read-queries as if already working, even though those are still roadmap (WP-15, WP-17), not built. Don't "fix" this back to roadmap-honest copy without asking first — it's a deliberate, disclosed call, not an oversight.
- `docs/prds/` — 21-WP roadmap (`prd-blueprint` skill). `docs/prds/ROADMAP.md` / `map.html` are generated — regenerate via `python3 <prd-blueprint skill dir>/scripts/generate_map.py --prds-dir docs/prds` after editing any WP's frontmatter, never hand-edit them.
- `.env.example` — still empty (WP-03's actual deliverable, not done yet). A real `.env` exists locally (gitignored) with a working `SUPABASE_DB_URL`.
- `docker-compose.yml` — only runs n8n locally (Postgres is Supabase, not Docker).
- `.impeccable/` — design-audit artifacts (screenshots, concept-seed evidence) from the `impeccable` skill runs on `web/`. Not source of truth for anything, just a paper trail.

The authoritative design source is `README.md` — read it before making architectural decisions, especially §2 (stack), §4 (architecture diagram), §13 (decision history, explains every v0.3→v0.4 change and why).

## Architecture

Personal-planning conversational agent, reachable from a web chat, that reads/writes Notion, Google Calendar, and Gmail, with Supabase (PostgreSQL) as persistent memory of every interaction and decision. Single-user app — no auth, no multi-tenancy.

**Layered flow**: `Next.js chat (Vercel) → HTTPS → nucleo/ API (Python, container on Google Cloud Run) → MCP client → MCP servers (Notion/Calendar/Gmail) → Supabase Postgres`

n8n is **not** in this path — it's kept only for secondary, optional automations (e.g. Fase 1.5's schedule→Calendar sync, future proactive reminders) that trigger the núcleo's API or Supabase directly, decoupled from the chat request path.

**Key architectural decisions** (full rationale in README §3, §13):
- MCP instead of n8n-native integrations for Notion/Calendar/Gmail — one uniform client/protocol instead of three bespoke SDKs.
- The núcleo can't live in Vercel's serverless functions because MCP needs to hold live connections per request; it runs as its own container on **Google Cloud Run** instead (Railway was considered and dropped — free tier there is trial-only, not permanent). Cloud Run scales to zero on idle, so cold starts reconnect the 3 MCP servers — acceptable for a low-traffic personal app, not a true always-on process. Not deployed yet (WP-21) — `nucleo/Dockerfile` doesn't exist.
- Notion uses the official `notion-mcp-server` (generic tools — search/fetch/create-pages — need a translation layer in `nucleo/herramientas/notion_mcp.py` to become the dynamic `crear_tarea_universidad` tool). Calendar and Gmail have no official Google MCP server, so those are built in-house on `google-api-python-client`, sharing one OAuth client with different scopes.

**Folder structure**: `web/` (Next.js frontend — see `web/app/` for routes and `web/app/components/` for shared UI), `nucleo/` (Python core: `agente.py` done, `onboarding.py`/`herramientas/`/`evaluacion/casos.py` still to build), `db/` (schema.sql done, seed.sql not yet), `n8n/` (secondary-automation workflow export, not yet built), `docs/prds/` (WP roadmap).

### Data model (PostgreSQL, on Supabase — schema live in `db/schema.sql`, matches README §5)

No fixed enums in code except `tareas.estado` (fixed CHECK: pendiente/en_curso/hecha — deliberately not taxonomy-driven, this was a contradiction in an earlier README draft, now resolved in both the README's own SQL block and the applied schema). Everything else generated at tool-definition time from Postgres:
- `materia` from `asignaturas` (populated during onboarding)
- `tipo`/`prioridad`/`tiempo_estimado`/`energia` from `taxonomia`, seeded with defaults via `db/seed.sql` (not written yet — WP-02), editable later via a `/personalizar` command — never by editing code or JSON

Write tools must be blocked while `perfil.onboarding_completo = false` — an empty `asignaturas` table would otherwise generate a useless `enum: []` for `materia`.

`usuarios` is a single seeded row (no `telegram_id`, no auth) — kept as a table only so `tareas`/`perfil`/etc. foreign keys don't need to change if multi-user ever comes back. `nucleo/agente.py` currently auto-creates this row on first request if missing.

`llamadas_herramienta` records which MCP server (`notion`/`calendar`/`gmail`/`NULL`) resolved each tool call, plus args/result/success/latency.

`confirmaciones_pendientes` implements ambiguity confirmation (README §11): edit/delete on an ambiguous target presents up to 3 candidates and waits for the next message to be the disambiguation choice, checked before interpreting any new message. This is its own scope (`editar_tarea`/`eliminar_tarea`, WP-13), separate from and after the create-only MVP (Fase 1) — Fase 1 has no ambiguity to resolve.

`conversaciones` has no session-close concept — one continuous conversation per user. Context sent to the LLM each turn is a recency window (default suggestion: last 20 messages or last 2 hours, whichever is smaller — unvalidated, tune from real usage).

### Roadmap (`docs/prds/`) — 21 Work Packages, dependency-ordered, not phase-ordered

Full graph and status table: `docs/prds/ROADMAP.md` / `docs/prds/map.html` (regenerate, don't hand-edit). Critical path: **WP-01 → WP-04 → WP-07 → WP-08 → WP-11 → WP-12 → WP-15 → WP-17** — **WP-01 and WP-04 are done**; next up on the critical path is **WP-07** (MCP client plumbing).

Ready to start today (no unmet dependencies, not yet built): **WP-02** (taxonomy seed), **WP-03** (local n8n infra / `.env.example`), **WP-05** (onboarding), **WP-06** (n8n secondary automation), **WP-07** (MCP client plumbing), **WP-09** (Google OAuth client).

Roughly maps to README §7's phases: Fase 0 (WP-01 ✅/02/03/04 ✅/05/06) onboarding + infra, Fase 1/MVP (WP-07 through WP-12) create task/event via Notion+Calendar MCP, Fase 1.x (WP-13) edit/delete + ambiguity confirmation, Fase 1.5 (WP-14, optional) schedule sync, Fase 2 (WP-15) read queries, Fase 3 (WP-16/17) Inbox + Gmail, plus WP-20 ✅ (real frontend, done — ahead of the critical path) and WP-21 (Vercel+Supabase+Cloud Run provisioning) which run in parallel to the critical path. WP-18 (install docs) and WP-19 (open-source readiness) are explicitly **deferred** — not active roadmap work while this stays a single-user app (README §12).

**Phase-exit rule** (README §7): don't start the next phase until the current one's `casos_evaluacion` pass for real.

## Local development

```bash
docker compose up -d          # n8n only — Postgres is Supabase, not Docker

psql "$SUPABASE_DB_URL" -f db/schema.sql   # already applied once; safe to re-run against a fresh DB
psql "$SUPABASE_DB_URL" -f db/seed.sql     # doesn't exist yet — WP-02

cp .env.example .env          # .env.example is still empty (WP-03) — for now, hand-write SUPABASE_DB_URL yourself

python -m venv .venv && source .venv/bin/activate
pip install -r nucleo/requirements.txt
python nucleo/agente.py       # exposes /health and /mensaje on :8000

cd web && npm install && npm run dev   # frontend on :3000, reads NEXT_PUBLIC_NUCLEO_API_URL from web/.env.local (defaults to http://localhost:8000)
```

Frontend quality checks: `cd web && npx tsc --noEmit && npm run lint`. This project uses the `impeccable` skill for design work on `web/` — read `PRODUCT.md` first, and re-run its mechanical detector (`node <impeccable skill dir>/scripts/detect.mjs --json <changed files>`) after UI edits.

Deploy targets (not live yet, WP-21): Vercel (root directory `web/`), Supabase (managed Postgres, already provisioned and in use for local dev too), Google Cloud Run (núcleo container — needs a `nucleo/Dockerfile`, doesn't exist yet).
