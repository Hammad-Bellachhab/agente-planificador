# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repository is currently **design-only, pre-implementation**. `db/schema.sql`, `nucleo/agente.py`, and `.env.example` exist as empty placeholder files; no `requirements.txt`, no `n8n/` workflow export, no `docs/` tree yet. There is nothing to build, lint, or test yet — the near-term work is filling in these files to match the design below, starting with Fase 0 (see Phased scope).

The authoritative design source is `README.md` (§§1–13, Spanish) — read it before making architectural decisions. `agente-planificador-DISENO_aqruitectura_inicial..md` is an earlier draft (v0.2) of the same design superseded by the README; consult it only for historical context on decisions, not as a current spec.

## Architecture

Personal-planning conversational agent, reachable over Telegram, that reads/writes Notion, Google Calendar, and Gmail, with PostgreSQL as persistent memory of every interaction and decision.

**Layered flow**: `Telegram → n8n (webhook + HTTP Request) → nucleo/ (Python: LLM w/ function calling + MCP client) → MCP servers (Notion/Calendar/Gmail) → PostgreSQL`

The key architectural decision (README §3): Notion/Calendar/Gmail are accessed via **MCP**, not n8n's native nodes. Since n8n has no mature native MCP support, the Python core (`nucleo/`) is not a "rewrite later" — it's necessary from day one as the piece that speaks MCP. n8n's role is intentionally thin: receive the Telegram webhook, `HTTP Request` to the Python core, return the response. All decision-making logic lives in `nucleo/`.

**Planned folder structure** (README §6):
```
nucleo/
├── agente.py              # entry point: LLM + MCP client
├── onboarding.py          # Fase 0 conversational onboarding
├── herramientas/          # one MCP client wrapper per external server
│   ├── notion_mcp.py
│   ├── calendar_mcp.py
│   └── gmail_mcp.py
└── evaluacion/
    └── casos.py           # eval harness reading casos_evaluacion table
```

### Data model (PostgreSQL, `db/schema.sql`)

No fixed enums live in code. Anything that would be a hardcoded enum (`materia`, `tipo`, `prioridad`, `tiempo_estimado`, ...) is generated at tool-definition time from Postgres, via a single mechanism for all of them — see README §5 (`construir_herramienta_crear_tarea`):
- `materia` comes from the `asignaturas` table (per-user subjects, populated during onboarding)
- everything else (`tipo`, `prioridad`, `tiempo_estimado`, `energia`, `estado`) comes from the `taxonomia` table, keyed by `campo`, seeded with defaults via `db/seed.sql` and editable later via a `/personalizar` command — never by editing code or JSON

This distinction matters: **personal data** (subjects, schedule, exams, projects) only has one possible origin — the onboarding conversation — while **system taxonomy** (priority levels, task types, etc.) is seeded with sane defaults at install time and only touched later, never during onboarding (README §8).

`llamadas_herramienta` records which MCP server (`notion`/`calendar`/`gmail`/`NULL` for internal Postgres-only calls) resolved each tool call, plus args/result/success/latency — this is the system's observability layer across three independent external dependencies.

`confirmaciones_pendientes` implements ambiguity confirmation (README §11): when an edit/delete request could match more than one row in `tareas`, the agent does not act — it presents up to 3 candidates and stores pending-confirmation state. On the *next* turn, before interpreting a new message, the agent must first check for an unresolved row in this table for that user; if present, the message is interpreted as the candidate choice, not a fresh request. `editar_tarea` and `eliminar_tarea` must always route through this mechanism when the target isn't unambiguous.

`conversaciones` has no session-close concept — one continuous conversation per user, no `cerrada_en`. Context sent to the LLM each turn is a recency window (default suggestion: last 20 messages or last 2 hours, whichever is smaller — unvalidated, tune from real usage), not the full history.

### Phased scope (README §7) — build in this order, don't skip ahead

1. **Fase 0**: conversational onboarding (profile, subjects, class schedule, exams, projects) — populates the tables that later enums are generated from. Nothing else works without this.
2. **Fase 1 (MVP)**: create task/event in Notion To-Do Universidad / To-Do del día / Calendar.
3. **Fase 1.5** (proposed, not committed): auto-sync `horario_clases` to Calendar after onboarding.
4. **Fase 2**: read/query existing data ("what's pending for PBDA this week?").
5. **Fase 3**: Inbox capture + Gmail read/compose.
6. Out of scope, no date: Habit Tracker, Finance Tracker, Daily Journal, proactive reminders, auto-summaries — each is a distinct data domain deserving its own design.

**Phase-exit rule**: don't start Fase 2 until Fase 1 actually works with evaluation cases (`casos_evaluacion` table) passing.

### Four documented install paths (README §9)

`docs/instalacion/{localhost-docker,vps,dispositivo-propio,n8n-cloud}.md` (not yet written) — all four are meant to be maintained, not just one chosen. In the first three, n8n runs in Docker alongside Postgres via the root `docker-compose.yml`. For `n8n-cloud`, n8n is managed/hosted elsewhere and that variant's compose file omits the n8n service, leaving only Postgres + `nucleo/`.

## Local development (once code exists)

```bash
# Start Postgres + n8n
docker compose up -d

# Apply schema and taxonomy seed (schema.sql / seed.sql are currently empty — fill them per README §5 first)
psql -h localhost -U agente -d agente_planificador -f db/schema.sql
psql -h localhost -U agente -d agente_planificador -f db/seed.sql

# Env vars
cp .env.example .env
# fill TELEGRAM_BOT_TOKEN, LLM_API_KEY, and each MCP server's credentials (Notion, Calendar, Gmail)

# Python core
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt   # requirements.txt does not exist yet
python nucleo/agente.py

# Import n8n/workflow-agente.json into n8n via Import from File (file does not exist yet)
```

`docker-compose.yml` currently defines `postgres` (user `agente`, db `agente_planificador`, port 5432) and `n8n` (port 5678, `TZ=Europe/Madrid`) — the Postgres password in it is a placeholder (`cambia_esto`) and must never be used beyond local dev.

## Open-source readiness (README §12)

Before this repo is made public/installable by third parties, non-negotiable minimums: an MIT `LICENSE`, `.env.example` with zero real-looking values, install instructions verified by someone other than the author following them literally, and the `materia` enum generalized beyond the author's own onboarding-seeded data if reading an arbitrary third party's Notion schema is ever required.
