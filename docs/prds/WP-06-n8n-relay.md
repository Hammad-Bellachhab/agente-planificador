---
id: WP-06
title: Relay n8n (Telegram → núcleo)
status: skeleton
size: S
depends_on: [WP-04]
owner: hammad
external: false
tasks_done: 0
tasks_total: 5
issue: null
subtitle: Fase 0
---

# WP-06 — Relay n8n (Telegram → núcleo)

## Qué es

Construye `n8n/workflow-agente.json` (no existe hoy): un workflow n8n con un nodo Webhook que
recibe el update de Telegram, un nodo `HTTP Request` que llama al núcleo Python, y la respuesta
de vuelta al usuario. Sin lógica de decisión propia (README §4) — n8n es puro relay, toda la
inteligencia vive en `nucleo/`.

## Por qué depende de WP-04

Necesita que el núcleo exponga ya un endpoint HTTP con un contrato de petición/respuesta
estable (WP-04) para que el nodo `HTTP Request` tenga contra qué apuntar. No depende de que el
onboarding (WP-05) exista — el relay es agnóstico a qué lógica hay detrás del endpoint.

## Fuera de alcance

- Cualquier transformación o validación de payload más allá de reenviar — si aparece lógica
  aquí es una señal de que se está rompiendo la separación de capas de README §4.
- Los cuatro caminos de instalación (dónde corre n8n: Docker local, VPS, n8n Cloud) → WP-18.

## Estado

Esqueleto sin especificar. Ejecutar fase de "fill" antes de construir.
