---
id: WP-20
title: Frontend — UI de chat real
status: skeleton
size: L
depends_on: [WP-04]
owner: hammad
external: false
tasks_done: 0
tasks_total: 10
issue: null
subtitle: Fase 1 — interfaz (nuevo en v0.4)
---

# WP-20 — Frontend — UI de chat real

## Qué es

**Nuevo en v0.4.** `web/` ya existe en el repo, escafoldado con `create-next-app`
(`web/app/`, `web/package.json`, TypeScript) — pero es el boilerplate por defecto de
`create-next-app`, sin ninguna UI de chat construida todavía. Este WP construye la parte de
producto encima de ese scaffold: la interfaz de chat real que el usuario usa como único punto
de entrada al sistema (README §1, §2, §4).

Cubre, contra el contrato de petición/respuesta que fije WP-04:
- Componente de conversación: lista de mensajes (usuario/agente), input de envío.
- Llamada a la API del núcleo por HTTPS (`fetch`/`route handler` de Next.js hacia
  `NUCLEO_API_URL`), manejo de estados de carga y error de red.
- Estado de la conversación en el cliente: qué se ha mostrado ya, scroll, mensaje en curso.
- Manejo del caso "esperando confirmación" (README §11): la UI no necesita saber que hay una
  fila en `confirmaciones_pendientes` — solo renderiza lo que el núcleo le devuelve como
  siguiente turno — pero si el núcleo devuelve una lista de candidatos a elegir, la UI debe
  poder mostrarla de forma utilizable (no solo texto plano), a decidir en fill.

## Por qué depende de WP-04

Necesita el contrato de petición/respuesta de la API del núcleo (endpoint, forma del payload,
forma de la respuesta) para tener contra qué construir. No depende de WP-05 (onboarding) ni de
WP-11 (MVP): la UI de chat es agnóstica a qué lógica de negocio hay detrás del endpoint, igual
que WP-06 (n8n) lo era en el diseño anterior — mismo principio de separación de capas de
README §4, aplicado ahora al frontend en vez de al relay.

## Fuera de alcance

- El contrato de API en sí (forma exacta del payload) → WP-04, este WP lo consume, no lo define.
- Autenticación / login → explícitamente fuera de alcance mientras sea app de un solo usuario,
  sin Supabase Auth (README §2, §12).
- Desplegar esto en Vercel → WP-21; este WP deja la UI funcionando en local (`npm run dev`).
- Onboarding conversacional como lógica → WP-05; este WP solo renderiza los turnos que esa
  lógica produce, no decide qué preguntar.

## Estado

Esqueleto sin especificar. Ejecutar fase de "fill" antes de construir.
