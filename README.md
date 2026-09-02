<div align="center">

# 🤖 Agente de Planificación Personal

![Banner](docs/assets/banner.png)

### Chat web (Next.js) · Notion + Google Calendar + Gmail vía MCP · Supabase como memoria persistente

<br>

![Estado](https://img.shields.io/badge/Estado-Draft%20v0.4-EF6C00?style=for-the-badge&logo=git&logoColor=white)
![Naturaleza](https://img.shields.io/badge/Naturaleza-Foto%20de%20intención-6A1B9A?style=for-the-badge&logo=notion&logoColor=white)
![Proyecto](https://img.shields.io/badge/Proyecto-Independiente-0A66C2?style=for-the-badge&logo=github&logoColor=white)

<br>

![Python](https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![Vercel](https://img.shields.io/badge/-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![n8n](https://img.shields.io/badge/-n8n-EA4B71?style=flat-square&logo=n8n&logoColor=white)
![MCP](https://img.shields.io/badge/-MCP-5A32A3?style=flat-square&logo=anthropic&logoColor=white)
![Supabase](https://img.shields.io/badge/-Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Notion](https://img.shields.io/badge/-Notion-000000?style=flat-square&logo=notion&logoColor=white)
![Gmail](https://img.shields.io/badge/-Gmail-EA4335?style=flat-square&logo=gmail&logoColor=white)

</div>

<br>

> **Naturaleza de este documento:** punto de partida. Se refina más adelante con Claude Code y con skills/plugins propios — esto es la foto de intención, no la especificación final. Repo propio, fuera de `ml-agents-data`. Coincide en gran parte con lo que el plan de estudios llama P2 (agente autónomo con herramientas), pero **no está atado a sus plazos ni a sus criterios de evaluación** — reclamar el solape es una decisión aparte, no una obligación de este documento.
>
> **v0.4:** pivote de interfaz — Telegram sale, entra un frontend web propio (Next.js en Vercel). El núcleo Python se mantiene como proceso persistente en un host aparte. Postgres pasa de Docker local a Supabase gestionado. Vuelve a ser una app de un solo usuario (no open-source instalable por terceros, por ahora). Detalle completo en [§13](#13-historial-de-decisiones).

---

## 📑 Índice

- [1. Qué es](#1-qué-es)
- [2. Stack confirmado](#2-stack-confirmado)
- [3. El cambio de fondo: MCP como capa de herramientas](#3-el-cambio-de-fondo-mcp-como-capa-de-herramientas)
- [4. Arquitectura de capas](#4-arquitectura-de-capas)
- [5. Modelo de datos](#5-modelo-de-datos-postgresql)
- [6. Estructura de carpetas](#6-estructura-de-carpetas)
- [7. Alcance por fases](#7-alcance-por-fases)
- [8. Personalización: datos personales vs. taxonomía](#8-personalización-datos-personales-vs-taxonomía-del-sistema)
- [9. Instalación: cuatro caminos](#9-instalación-cuatro-caminos-documentados)
- [10. Memoria de conversación](#10-memoria-de-conversación)
- [11. Confirmación ante ambigüedad](#11-confirmación-ante-ambigüedad)
- [12. Nota de open source](#12-nota-de-open-source)
- [13. Historial de decisiones](#13-historial-de-decisiones)
- [Entorno de desarrollo](#-entorno-de-desarrollo)

---

## 1. Qué es

Un agente conversacional, accesible desde un chat web propio, que gestiona planificación personal (tareas, notas, eventos, correo) leyendo y escribiendo en Notion, Google Calendar y Gmail, con Supabase (PostgreSQL) como memoria persistente de todo lo que hace y decide.

---

## 2. Stack confirmado

> **Cambio v0.3 → v0.4:** se sustituye Telegram por un frontend web propio, desplegado en Vercel, con Supabase como Postgres gestionado. Ver [§13](#13-historial-de-decisiones) para el porqué de cada cambio.

| Pieza | Rol |
|:---|:---|
| **Next.js / TypeScript** | Frontend: interfaz de chat web, único punto de entrada del usuario |
| **Vercel** | Hosting y deploy del frontend Next.js |
| **Python** | Núcleo del agente: LLM con function calling, cliente MCP, glue code — proceso persistente, alojado fuera de Vercel (ver §3) |
| **JavaScript** | Nodos Code de n8n |
| **JSON** | Formato de intercambio entre capas (payloads, definiciones de herramientas, export de workflows) |
| **n8n** | Automatizaciones secundarias (recordatorios proactivos, sync programado) — ya no está en el camino principal de la conversación, ver §4 |
| **Supabase (PostgreSQL)** | Persistencia: conversaciones, llamadas a herramientas, tareas, evaluación — Postgres gestionado, sin Docker en producción |
| **Docker** | Solo para desarrollo local del núcleo Python + n8n; Supabase sustituye al Postgres en Docker |
| **Notion, Google Calendar, Gmail** | Herramientas externas, todas accedidas vía **MCP** |

**Un solo usuario.** Esta instancia es una app personal, no multi-tenant. No hay Supabase Auth ni login — se asume que quien despliega es quien la usa. La tabla `usuarios` se simplifica a una única fila sembrada al instalar (ver §5).

---

## 3. El cambio de fondo: MCP como capa de herramientas

Notion, Calendar y Gmail se acceden vía **MCP** en vez de vía los nodos nativos de n8n. No es un detalle — cambia dónde vive la inteligencia del sistema.

**Qué es MCP aquí:** protocolo estándar por el que un cliente (el agente) pregunta a un servidor MCP qué herramientas ofrece y las invoca de forma uniforme, en vez de que cada integración tenga su propio SDK y su propia autenticación. Mismo concepto que usan Claude Desktop o Claude Code para hablar con Notion, Google Drive, etc.

**Consecuencia arquitectónica:** un cliente MCP necesita vivir en algún sitio que hable el protocolo y que mantenga conexiones vivas con cada servidor mientras atiende peticiones — algo que no encaja con las funciones de Vercel (arrancan y mueren por petición individual, sin margen para mantener 3 subprocesos MCP). Por eso el núcleo Python **no vive en Vercel**: Vercel aloja solo el frontend Next.js; el núcleo corre en un contenedor aparte, en Google Cloud Run.

> **Matiz sobre Cloud Run:** no es un servidor "siempre encendido" como una VM clásica — escala a cero tras un rato sin tráfico, y el primer request tras eso paga un cold start (arrancar el contenedor + reconectar los 3 servidores MCP). Mientras el contenedor está caliente, reutiliza las mismas conexiones MCP entre peticiones sin problema. Para una app personal de bajo tráfico es un compromiso razonable; si algún día el cold start molesta, la solución es fijar `min-instances=1` (dejar de escalar a cero, con coste).

n8n no tiene soporte nativo maduro de MCP a día de hoy, así que tampoco es candidato a alojar el cliente MCP.

---

## 4. Arquitectura de capas

```mermaid
flowchart TB
    subgraph Interfaz["Interfaz · Next.js en Vercel"]
        FE[Chat web]
    end

    subgraph Nucleo["Núcleo del agente · Python (contenedor, Google Cloud Run)"]
        API[API HTTP]
        LLM["LLM con function calling"]
        MCPC[Cliente MCP]
    end

    subgraph Servidores["Servidores MCP"]
        MCPN[MCP · Notion]
        MCPCA[MCP · Calendar]
        MCPG[MCP · Gmail]
    end

    subgraph Persistencia["Persistencia · Supabase (PostgreSQL)"]
        DB[(postgres)]
    end

    subgraph Automatizacion["Automatización secundaria · n8n"]
        CRON[Triggers programados]
    end

    FE -->|HTTPS| API
    API --> LLM
    LLM --> MCPC
    MCPC --> MCPN
    MCPC --> MCPCA
    MCPC --> MCPG
    LLM --> DB
    MCPC --> DB
    DB -->|historial de contexto| LLM
    API -->|respuesta| FE
    CRON -.->|dispara, no en el camino de chat| API

    style FE fill:#000,color:#fff
    style DB fill:#3ECF8E,color:#fff
    style MCPC fill:#5A32A3,color:#fff
```

| Capa | Rol |
|:---|:---|
| **Interfaz (Next.js/Vercel)** | Chat web como único punto de entrada. Llama directamente a la API del núcleo por HTTPS — sin intermediario. |
| **Núcleo (Python)** | LLM con function calling + cliente MCP. Contenedor aparte de Vercel, en Google Cloud Run (escala a cero, ver nota en §3). Es donde vive toda la inteligencia del sistema. |
| **Servidores MCP** | Notion, Calendar y Gmail, cada uno como servidor MCP independiente. |
| **Persistencia (Supabase)** | Postgres gestionado. Registra cada interacción antes de responder: qué se dijo, qué herramienta se llamó, con qué argumentos, qué devolvió, si tuvo éxito. |
| **Automatización (n8n)** | Fuera del camino de la conversación. Dispara acciones programadas (p. ej. Fase 1.5, recordatorios) llamando a la API del núcleo o a Supabase directamente. |

---

## 5. Modelo de datos (PostgreSQL, en Supabase)

`llamadas_herramienta` registra explícitamente qué servidor MCP resolvió cada llamada — con tres servidores distintos, saber cuál falla o tarda importa. `conversaciones` ya no gestiona cierre de sesión (ver [§10](#10-memoria-de-conversación)).

> App de un solo usuario (§2): `usuarios` se simplifica a una única fila sembrada al instalar, sin `telegram_id` ni credenciales — no hay Supabase Auth. Se mantiene como tabla (en vez de eliminarla) para no tener que tocar las foreign keys de `tareas`, `perfil`, etc. si algún día se añade multi-usuario.

```sql
CREATE TABLE usuarios (
    id            SERIAL PRIMARY KEY,
    nombre        TEXT NOT NULL,
    creado_en     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE conversaciones (
    id            SERIAL PRIMARY KEY,
    usuario_id    INTEGER NOT NULL REFERENCES usuarios(id),
    iniciada_en   TIMESTAMPTZ NOT NULL DEFAULT now()
    -- sin cerrada_en: conversación continua por usuario, ver §10
);

CREATE TABLE mensajes (
    id                SERIAL PRIMARY KEY,
    conversacion_id   INTEGER NOT NULL REFERENCES conversaciones(id),
    rol               TEXT NOT NULL CHECK (rol IN ('usuario', 'agente')),
    contenido         TEXT NOT NULL,
    creado_en         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- servidor_mcp: 'notion' | 'calendar' | 'gmail' | NULL si la
-- herramienta no pasa por MCP (p. ej. consulta interna a Postgres)
CREATE TABLE llamadas_herramienta (
    id              SERIAL PRIMARY KEY,
    mensaje_id      INTEGER NOT NULL REFERENCES mensajes(id),
    servidor_mcp    TEXT,
    herramienta     TEXT NOT NULL,
    argumentos      JSONB NOT NULL,
    resultado       JSONB,
    exito           BOOLEAN NOT NULL,
    latencia_ms     INTEGER,
    creado_en       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tareas (
    id                  SERIAL PRIMARY KEY,
    usuario_id          INTEGER NOT NULL REFERENCES usuarios(id),
    titulo              TEXT NOT NULL,
    descripcion         TEXT,
    estado              TEXT NOT NULL DEFAULT 'pendiente'
                         CHECK (estado IN ('pendiente','en_curso','hecha')),
    origen              TEXT NOT NULL CHECK (origen IN ('notion','calendar','gmail')),
    referencia_externa  TEXT,
    fecha_limite        DATE,
    creada_en           TIMESTAMPTZ NOT NULL DEFAULT now(),
    actualizada_en      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE casos_evaluacion (
    id                    SERIAL PRIMARY KEY,
    prompt                TEXT NOT NULL,
    herramienta_esperada  TEXT NOT NULL,
    herramienta_obtenida  TEXT,
    paso                  BOOLEAN,
    ejecutado_en          TIMESTAMPTZ
);

-- Onboarding conversacional (Fase 0, §7)
CREATE TABLE perfil (
    id                    SERIAL PRIMARY KEY,
    usuario_id            INTEGER NOT NULL REFERENCES usuarios(id),
    que_estudia           TEXT,
    institucion            TEXT,
    onboarding_completo   BOOLEAN NOT NULL DEFAULT false,
    creado_en             TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE asignaturas (
    id            SERIAL PRIMARY KEY,
    usuario_id    INTEGER NOT NULL REFERENCES usuarios(id),
    codigo        TEXT NOT NULL,
    nombre        TEXT,
    creado_en     TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(usuario_id, codigo)
);

CREATE TABLE horario_clases (
    id              SERIAL PRIMARY KEY,
    asignatura_id   INTEGER NOT NULL REFERENCES asignaturas(id),
    dia_semana      TEXT NOT NULL CHECK (dia_semana IN
                     ('lunes','martes','miercoles','jueves','viernes','sabado','domingo')),
    hora_inicio     TIME NOT NULL,
    hora_fin        TIME NOT NULL
);

CREATE TABLE examenes (
    id              SERIAL PRIMARY KEY,
    asignatura_id   INTEGER NOT NULL REFERENCES asignaturas(id),
    fecha           DATE NOT NULL,
    tipo            TEXT,
    notas           TEXT
);

-- Taxonomía personalizable del sistema (§8) — sustituye enums fijos.
-- 'estado' NO está aquí: tareas.estado es CHECK fijo (arriba), no taxonomía editable.
CREATE TABLE taxonomia (
    id            SERIAL PRIMARY KEY,
    usuario_id    INTEGER NOT NULL REFERENCES usuarios(id),
    campo         TEXT NOT NULL CHECK (campo IN
                   ('tipo','prioridad','tiempo_estimado','energia')),
    valor         TEXT NOT NULL,
    orden         INTEGER,
    UNIQUE(usuario_id, campo, valor)
);

-- Confirmación ante ambigüedad (§11)
CREATE TABLE confirmaciones_pendientes (
    id            SERIAL PRIMARY KEY,
    usuario_id    INTEGER NOT NULL REFERENCES usuarios(id),
    candidatos    JSONB NOT NULL,   -- [{"tarea_id": 12, "titulo": "...", "resumen": "..."}]
    accion        TEXT NOT NULL CHECK (accion IN ('editar', 'borrar')),
    creado_en     TIMESTAMPTZ NOT NULL DEFAULT now(),
    resuelto      BOOLEAN NOT NULL DEFAULT false
);
```

> Proyectos no lleva tabla propia en la v1 — se reutiliza `tareas` con `tipo = 'Proyecto'`. Tabla dedicada: sugerencia para cuando el uso real lo pida, no antes.

### Definición de herramienta, generada en tiempo de ejecución

Ningún enum queda fijo en el código. `materia` se construye desde `asignaturas`; `tipo`, `prioridad` y `tiempo_estimado`, desde `taxonomia` — un único mecanismo para todos:

```python
def construir_herramienta_crear_tarea(usuario_id: int) -> dict:
    return {
        "name": "crear_tarea_universidad",
        "parameters": {
            "type": "object",
            "properties": {
                "materia":         {"enum": obtener_asignaturas(usuario_id)},
                "tipo":            {"enum": obtener_taxonomia(usuario_id, "tipo")},
                "prioridad":       {"enum": obtener_taxonomia(usuario_id, "prioridad")},
                "tiempo_estimado": {"enum": obtener_taxonomia(usuario_id, "tiempo_estimado")},
            }
        }
    }
```

Al instalar, un script de siembra (`seed.sql`) inserta valores por defecto en `taxonomia` por cada `campo`. Un comando de personalización (`/personalizar`) hace `INSERT`/`DELETE` sobre esa tabla — nunca toca código ni JSON.

---

## 6. Estructura de carpetas

```
agente-planificador/
├── README.md
├── docker-compose.yml            # n8n en local (Postgres vive en Supabase, no aquí)
├── db/
│   ├── schema.sql                # aplicado contra el Postgres de Supabase
│   └── seed.sql                  # valores por defecto de taxonomia
├── n8n/
│   └── workflow-agente.json      # automatizaciones secundarias, no el camino de chat
├── nucleo/                       # el agente Python, cliente MCP — proceso persistente
│   ├── agente.py                 # expone la API HTTP que llama el frontend
│   ├── onboarding.py
│   ├── herramientas/
│   │   ├── notion_mcp.py
│   │   ├── calendar_mcp.py
│   │   └── gmail_mcp.py
│   └── evaluacion/
│       └── casos.py
├── web/                          # frontend Next.js/TypeScript, desplegado en Vercel
│   ├── app/
│   └── package.json
├── docs/
│   ├── DISENO.md
│   ├── prds/                     # Work Packages (skill prd-blueprint)
│   ├── instalacion/               # un único camino de despliegue (Vercel + Google Cloud Run + Supabase), no cuatro (ver §9)
│   └── decisiones/
└── .env.example
```

---

## 7. Alcance por fases

| Fase | Qué incluye | Por qué en ese orden |
|:---|:---|:---|
| **Fase 0 (agente)** | Onboarding conversacional: perfil, asignaturas, horario, exámenes, proyectos | Sin esto no hay con qué rellenar `materia` ni el resto de enums — es lo que hace que cada instalación se auto-configure sola |
| **Fase 1 (MVP)** | Crear tarea/evento en **To-Do Universidad**, **To-Do del día** o **Calendar**, usando lo aprendido en el onboarding | Esquema ya conocido, mayor valor inmediato |
| **Fase 1.5** *(sugerencia, sin comprometer)* | Sincronizar `horario_clases` con Calendar automáticamente al terminar el onboarding | Candidata natural una vez el resto esté probado — no se mete en el alcance todavía |
| **Fase 2** | Leer y responder consultas ("¿qué tengo pendiente de PBDA esta semana?") | Exige que el agente sepa escribir bien antes de razonar sobre lo que ya existe |
| **Fase 3** | Inbox (captura rápida sin clasificar) + Gmail (leer y redactar) | Inbox es de bajo impacto sin nada maduro debajo; Gmail tiene más fricción de auth |
| **Fuera de alcance, sin fecha** | Habit Tracker, Finance Tracker, Daily Journal, recordatorios proactivos, resumen automático | Cada uno es un dominio de datos distinto que merece su propio diseño, no un añadido apresurado |

> **Regla de salida de fase:** no se empieza la Fase 2 hasta que la Fase 1 funcione de verdad, con casos de evaluación pasando — mismo criterio de dominio que usa el plan de estudios para todo lo demás.

---

## 8. Personalización: datos personales vs. taxonomía del sistema

"Todo personalizable" son dos mecanismos distintos, no uno solo:

| Tipo | Ejemplos | Cuándo se define | Cómo |
|:---|:---|:---|:---|
| **Datos personales** | Materias, horario, exámenes, proyectos | Onboarding (Fase 0) | Conversación obligatoria — no existe otro origen posible |
| **Taxonomía del sistema** | Tipo, Prioridad, Tiempo estimado, Energía requerida | Al instalar, con defaults | Se siembra con valores por defecto; se edita después con un comando, no en la entrevista inicial |

Meter la taxonomía en el onboarding convertiría la primera conversación en un cuestionario de mantenimiento antes de poder crear una sola tarea. Los defaults de siembra son los valores reales del Notion de origen (ya están bien pensados); cualquiera los cambia luego sin tocar código.

---

## 9. Instalación: cuatro caminos documentados

> **Cambio v0.3 → v0.4:** con el pivote a app personal de un solo usuario (§2), esta sección deja de ser "cuatro caminos de instalación para desconocidos" y pasa a ser un único despliegue propio:

| Pieza | Dónde vive |
|:---|:---|
| Frontend (Next.js) | Vercel |
| Núcleo (Python) | Contenedor aparte de Vercel — Google Cloud Run |
| Postgres | Supabase (gestionado) |
| n8n (automatizaciones secundarias) | Docker local, o n8n Cloud si se prefiere no autogestionarlo |

`docker-compose.yml` en desarrollo local levanta n8n; Supabase se usa tanto en local como en producción (no hace falta un Postgres en Docker aparte). `docs/instalacion/` documenta este único camino de despliegue, no cuatro alternativas — la nota de open source (§12) queda pospuesta mientras el proyecto sea de un solo usuario.

---

## 10. Memoria de conversación

Sin corte explícito de sesión. `conversaciones` deja de decidir cuándo abrir una nueva fila — hay una conversación continua por usuario, y los mensajes se acumulan ahí sin más.

El contexto que se manda al LLM en cada turno es una ventana de los últimos N mensajes por recencia, no todo lo que hay en la conversación abierta.

> **N por defecto: 20 mensajes o las últimas 2 horas, lo que sea menor** — sugerencia sin cifra que la respalde; ajustar según comportamiento en uso real.

---

## 11. Confirmación ante ambigüedad

Cuando el agente detecta que "cámbiale la prioridad" o "borra esa tarea" puede referirse a más de una fila de `tareas`, no actúa. Presenta hasta 3 candidatas y guarda el estado de "esperando que elijas" — el siguiente mensaje del chat, por sí solo, no sabe que es la respuesta a esa pregunta.

**Flujo:** cada turno, antes de interpretar el mensaje como petición nueva, el agente comprueba si hay una fila en `confirmaciones_pendientes` sin resolver para ese usuario. Si la hay, el mensaje se interpreta como la elección entre los candidatos mostrados. Si no la hay, sigue el flujo normal.

Esto también cubre `editar_tarea` y `eliminar_tarea` — ambas herramientas pasan siempre por este mecanismo cuando el objetivo no es inequívoco.

---

## 12. Nota de open source

> **Estado v0.4:** pospuesto. Mientras el proyecto sea una app personal de un solo usuario (§2), publicarlo como instalable por terceros no es el objetivo activo. Se deja esta sección como referencia futura, no como trabajo de roadmap actual.

Si algún día se retoma la idea de publicar el repo como público e instalable por terceros, mínimos no negociables:

- `LICENSE` — sugerencia: MIT, default razonable para una utilidad personal sin ambición comercial. Decides tú.
- `.env.example` con **cero valores reales**, ni siquiera de ejemplo plausible.
- README con instrucciones de instalación probadas por alguien que no seas tú, siguiéndolas literalmente y sin ayuda.
- El `enum` de `materia` (§5), hoy sembrado desde onboarding propio, generalizado si se detecta que hace falta leer el esquema real de otro Notion.
- Reintroducir Supabase Auth y aislamiento multi-usuario (RLS), retirados en v0.4 al pasar a app personal — ver §13.

---

## 13. Historial de decisiones

| Pregunta | Respuesta | Implicación de diseño |
|:---|:---|:---|
| Cliente MCP | Núcleo Python | Sin cambios respecto al diseño de [§3](#3-el-cambio-de-fondo-mcp-como-capa-de-herramientas) |
| Features | Basadas en el Second Brain (PARA): Inbox, Weekly Planner, To-Do Universidad, To-Do Proyectos Personales, To-Do del día, Habit Tracker, Finance Tracker, Daily Journal | Demasiado para una v1 — priorizado en [§7](#7-alcance-por-fases) |
| **(v0.4)** Interfaz | Se sustituye Telegram por un frontend propio en Next.js | Deja de depender de la API de Bot de Telegram; abre la puerta a una UI más rica que texto plano |
| **(v0.4)** Deploy del frontend | Vercel | Frontend y núcleo se despliegan por separado — Vercel no aloja bien procesos MCP persistentes (ver §3) |
| **(v0.4)** Núcleo Python | Se mantiene, pero pasa a desplegarse como contenedor en Google Cloud Run, aparte de Vercel (evaluado Railway primero, descartado por ser solo trial gratis, no gratis permanente) | El frontend le habla por HTTPS directamente; ya no depende de que n8n reenvíe el webhook de Telegram. Cold start tras inactividad, ver §3 |
| **(v0.4)** n8n | Se mantiene, pero deja de estar en el camino principal de la conversación | Pasa a un rol de automatizaciones secundarias (recordatorios, sync programado) — no es la Fase 1 |
| **(v0.4)** Base de datos | Supabase (Postgres gestionado) en vez de Postgres en Docker | Un solo Postgres para local y producción; Docker queda solo para n8n en desarrollo |
| **(v0.4)** Usuarios | Vuelve a ser app personal de un solo usuario (revierte la visión open-source de v0.2/v0.3, ver §12) | Sin Supabase Auth ni multi-tenancy; `usuarios` se simplifica a una fila sembrada al instalar |

---

## 🛠️ Entorno de desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/<usuario>/agente-planificador.git
cd agente-planificador

# Levantar n8n local (Docker) — Postgres ya no está aquí, ver Supabase abajo
docker compose up -d

# Proyecto Supabase: crear uno en supabase.com, aplicar el esquema
# y la siembra de taxonomía contra su Postgres
psql "$SUPABASE_DB_URL" -f db/schema.sql
psql "$SUPABASE_DB_URL" -f db/seed.sql

# Variables de entorno
cp .env.example .env
# rellenar SUPABASE_DB_URL, LLM_API_KEY,
# y las credenciales de cada servidor MCP (Notion, Calendar, Gmail)

# Entorno del núcleo Python
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Arrancar el núcleo (proceso persistente, expone la API que llama el frontend)
python nucleo/agente.py

# Frontend Next.js
cd web
npm install
npm run dev          # local
vercel deploy        # producción

# Importar el workflow de automatizaciones secundarias en n8n (opcional)
# n8n → Import from File → n8n/workflow-agente.json
```

---

<div align="center">

<sub>Agente de Planificación Personal · Documento de diseño v0.2 · Draft · Repo independiente del plan de estudios</sub>

</div>