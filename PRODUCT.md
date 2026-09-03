# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Un único usuario: el dueño del proyecto, estudiante universitario. No es una app multi-tenant ni un producto que se vende a terceros — es una herramienta personal para gestionar su propia planificación académica. (Inferido del README y de la conversación de diseño del proyecto, no de una entrevista directa — ver nota de sustitución.)

## Product Purpose

Agente conversacional que gestiona planificación universitaria (tareas, notas, eventos, correo) leyendo y escribiendo directamente en las herramientas donde el usuario ya vive (Notion, Google Calendar, Gmail), en vez de ser una app de tareas más que mantener aparte. Éxito = pedir algo en lenguaje natural y que aparezca correctamente en Notion/Calendar sin abrir esas apps a mano.

## Positioning

Frente a un asistente de IA genérico o un bot de tareas: habla con las herramientas reales del usuario vía MCP (protocolo estándar), no con una base de datos propia aislada — y registra cada acción (qué se pidió, qué herramienta se llamó, si funcionó) en Supabase. Auditable, no una caja negra.

## Operating Context

Uso diario, conversacional, vía chat web (la interfaz original era Telegram; ver README §13 — pivote documentado). El usuario ya tiene Notion, Calendar y Gmail como su sistema real de organización; el agente actúa dentro de ese sistema, no lo reemplaza.

## Capabilities and Constraints

- Un solo usuario, sin login ni autenticación (README §2).
- Fase actual del roadmap (docs/prds/): onboarding y creación básica de tareas/eventos. Consultas, Gmail e Inbox son fases futuras — la landing no debe prometer lo que todavía no existe.
- Backend Python (FastAPI) + Supabase (Postgres) + servidores MCP (Notion oficial, Calendar/Gmail propios). El detalle técnico vive en README.md, no necesariamente en la landing.

## Brand Commitments

- Nombre: "Agente de Planificación Personal" / "Agente planificador".
- Identidad visual ya establecida: paleta monocromática negro/blanco/gris pura (`docs/assets/banner.png`, `web/app/globals.css`), sin gradientes, sin acentos de color. Fuente Geist Sans.
- Tono directo, sin lenguaje de marketing SaaS. Sin prueba social inventada (testimonios, logos de clientes, "trusted by") — sería falso para una herramienta de un solo usuario.
- **Excepción confirmada por el usuario** (no un descuido): la landing (`web/app/page.tsx`) presenta Gmail y las consultas de lectura como si ya funcionaran, aunque técnicamente están en roadmap (no construidas — ver `docs/prds/WP-15`, `WP-17`). Se advirtió explícitamente del riesgo de sobreclaim antes de escribirlo así, y el usuario confirmó que lo quería de todas formas. Cualquier trabajo futuro sobre esta página debe respetar esa decisión, no "corregirla" de vuelta a los caveats de roadmap sin preguntar primero.

## Evidence on Hand

- `docs/assets/banner.png` — banner visual ya generado y aprobado, referencia de paleta.
- `README.md` — documento de diseño completo, fuente de verdad de producto y arquitectura.
- `web/app/` — chat funcional ya construido y auditado (contraste, selección de texto themeada), primera superficie real del producto.
- No hay testimonios, logos, casos de estudio ni cifras de uso reales — no inventar ninguno.

## Product Principles

- Honestidad sobre escala: herramienta de una persona, no se disfraza de producto con tracción.
- La app real (Notion/Calendar/Gmail) es la fuente de verdad; el agente es una capa conversacional encima, no un silo nuevo de datos.
- Auditable por diseño: cada acción del agente queda registrada.
- Consistencia visual entre landing y chat: misma paleta, mismo idioma de diseño, una sola app.

## Accessibility & Inclusion

Sin requisito específico más allá de buenas prácticas estándar (contraste, foco visible, navegación por teclado) — ya aplicado y verificado en el chat.

---

**Nota de sustitución**: este archivo se escribió inferiendo del brief, README.md y la conversación de diseño ya mantenida con el usuario en esta sesión, sin una ronda de entrevista adicional — la evidencia existente (documento de diseño completo, decisiones ya tomadas) era lo bastante fuerte como para no repetir preguntas ya respondidas. Los hechos inferidos están marcados arriba donde aplica.
