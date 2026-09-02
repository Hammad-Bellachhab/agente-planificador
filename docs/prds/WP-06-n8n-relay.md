---
id: WP-06
title: n8n — automatizaciones secundarias (opcional)
status: skeleton
size: S
depends_on: [WP-04]
owner: hammad
external: false
tasks_done: 0
tasks_total: 5
issue: null
subtitle: Fase 1.5+ — opcional, fuera del camino de Fase 1
---

# WP-06 — n8n — automatizaciones secundarias (opcional)

## Qué es

**(v0.4) Repropuesto.** Este WP era "Relay n8n (Telegram → núcleo)": un workflow que reenviaba
cada mensaje de chat del usuario al núcleo. Con el pivote de interfaz (README §2-4, §13),
Telegram desaparece y el frontend web llama **directamente** por HTTPS al núcleo — n8n deja de
estar en el camino de la conversación. No se retira del proyecto, se degrada de rol: construye
`n8n/workflow-agente.json` como automatizaciones **secundarias**, fuera del camino de chat —
ejemplos de README §4/§7: triggers programados (`CRON`) que llaman a la API del núcleo o a
Supabase directamente para recordatorios proactivos o sync periódico. Candidato natural para
Fase 1.5 en adelante, nunca Fase 1.

**Nada de la Fase 1 (MVP) depende de este WP** — es una hoja del grafo, no bloquea a ningún otro
WP aguas abajo (verificado: ningún otro PRD lo lista en `depends_on`).

## Por qué depende de WP-04

Sigue necesitando que el núcleo exponga un endpoint HTTP estable (WP-04) para que el nodo
`HTTP Request` de n8n tenga contra qué apuntar cuando dispara una automatización. No depende de
WP-20 (frontend) ni de WP-21 (deploy) — puede desarrollarse y probarse contra el núcleo en local.

## Fuera de alcance

- Cualquier lógica de decisión propia (routing por intención, etc.) — si aparece aquí es una
  señal de que se está rompiendo la separación de capas de README §4; n8n dispara, no decide.
- Relay de mensajes de chat en tiempo real → ya no aplica, retirado en v0.4; el chat web habla
  directamente con el núcleo (WP-04, WP-20).
- Documentación de despliegue de n8n (Docker local vs. n8n Cloud) → WP-03 (desarrollo local) /
  README §9.

## Estado

Esqueleto sin especificar, repropuesto para v0.4. Ejecutar fase de "fill" antes de construir, o
descartar si Fase 1.5 no llega a justificarlo.
