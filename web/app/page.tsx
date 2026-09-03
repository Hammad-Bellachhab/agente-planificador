{
  /*
    THESIS: la app real (Notion/Calendar hoy, Gmail en roadmap) es la fuente
    de verdad; el agente es una capa conversacional auditable encima, no un
    SaaS que finge tracción que no tiene.
    OWN-WORLD: paleta monocromática heredada del chat (fondo #0a0a0a, texto
    #ededed/#838383, sin gradientes ni acentos de color); titular en serif
    itálico (Instrument Serif, registro "Times New Roman cursivo" pedido por
    el usuario), cuerpo en Geist Sans, composición centrada. Logo real del
    favicon (sin máscara, ya trae su propia forma). Burbuja de chat real
    como prueba, marcada "Ejemplo" y con un momento de entrada animado
    (message-in + dot-pulse reutilizado del chat) como único gesto de motion.
    STORY: el visitante ve el mecanismo real (chat → MCP → Notion/Calendar →
    Supabase), entiende que es una herramienta de una sola persona sin
    cuentas ni señales de tracción inventadas, y entra al chat.
    FIRST VIEWPORT: marca + titular editorial centrado + intercambio de
    ejemplo, CTA "Entrar al chat" visible sin hacer scroll.
    FORM: estructura larga de scroll pausado, composición centrada (revisión
    dirigida por el usuario sobre el candidato 7 de mi lista por resonancia,
    seed 664265cd — evidencia en .impeccable/surface-seed-664265cd.txt) — 4
    secciones reales sin relleno.
    FINISH: unreviewed and undocumented is unfinished; this build ends with
    the finish review, the verdict, and DESIGN.md.
  */
}
import Image from "next/image";
import Link from "next/link";

function ProofExchange() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3 sm:max-w-lg">
      <p className="text-xs uppercase tracking-[0.08em] text-subtle">
        Ejemplo
      </p>
      <div className="flex w-full flex-col gap-5 text-left">
        <div
          className="message-beat flex flex-col items-end gap-1.5 self-end opacity-0"
          style={{ animation: "message-in 0.45s ease-out 0.5s both" }}
        >
          <div className="max-w-[85%] rounded-2xl rounded-br-md bg-surface-2 px-4 py-2.5 text-[15px] leading-relaxed text-foreground sm:max-w-[75%]">
            Tengo examen de PBDA el 15 y se me olvidó apuntarlo. Y mira si
            esta semana me choca algo con el horario de BDNR.
          </div>
        </div>

        <div
          className="message-beat flex items-center gap-1.5 py-1 opacity-0"
          style={{ animation: "typing-window 1s ease-in-out 1s both" }}
          role="status"
          aria-hidden="true"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-subtle"
              style={{
                animation: "dot-pulse 1.4s ease-in-out infinite",
                animationDelay: `${i * 0.16}s`,
              }}
            />
          ))}
        </div>

        <div
          className="message-beat flex max-w-[90%] flex-col gap-1 border-l border-border pl-4 opacity-0 sm:max-w-[85%]"
          style={{ animation: "message-in 0.45s ease-out 1.9s both" }}
        >
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground">
            Ya está creado: examen de PBDA el 15 a las 09:00, en Notion y en
            Calendar. Revisé tu horario de BDNR esa semana también, y no hay
            ningún choque; tu clase termina a las 08:30, media hora antes.
          </p>
        </div>
        <div
          className="message-beat flex flex-col items-end gap-1.5 self-end opacity-0"
          style={{ animation: "message-in 0.45s ease-out 2.3s both" }}
        >
          <div className="max-w-[85%] rounded-2xl rounded-br-md bg-surface-2 px-4 py-2.5 text-[15px] leading-relaxed text-foreground sm:max-w-[75%]">
            perfecto, gracias
          </div>
        </div>
      </div>
    </div>
  );
}

const STACK: { name: string; icon?: string }[] = [
  { name: "Notion", icon: "/logo-notion.png" },
  { name: "Gmail", icon: "/logo-gmail.png" },
  { name: "Google Calendar", icon: "/logo-calendar.png" },
];

function StackStrip() {
  const items = [...STACK, ...STACK];
  return (
    <div className="marquee-fade w-full overflow-hidden border-y border-border py-8">
      <div
        className="marquee-track flex w-fit shrink-0 items-center gap-14"
        style={{ animation: "marquee 26s linear infinite" }}
      >
        {items.map((item, i) => (
          <div key={`${item.name}-${i}`} className="flex shrink-0 items-center gap-14">
            <span className="flex shrink-0 items-center gap-2.5 whitespace-nowrap">
              {item.icon ? (
                <Image
                  src={item.icon}
                  alt=""
                  width={18}
                  height={18}
                  className="opacity-70"
                />
              ) : null}
              <span className="text-sm uppercase tracking-[0.1em] text-subtle">
                {item.name}
              </span>
            </span>
            <span aria-hidden="true" className="text-subtle">
              ·
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CtaButton() {
  return (
    <Link
      href="/chat"
      className="group inline-flex h-16 w-fit shrink-0 items-center justify-center gap-2 self-center rounded-full bg-foreground px-10 font-serif-display text-[22px] italic text-background transition-transform duration-200 ease-out hover:scale-[1.04] active:scale-[0.98]"
    >
      Entrar al chat
      <span
        aria-hidden="true"
        className="not-italic transition-transform duration-200 ease-out group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="flex flex-1 flex-col overflow-y-auto bg-background pt-14">
      {/* 1 — Marca + prueba: el mecanismo, en pantalla, sin explicarlo primero. */}
      <section className="flex min-h-dvh flex-col items-center justify-center gap-12 px-6 py-20 text-center sm:px-12">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-12">
          <div
            className="message-beat flex flex-col items-center gap-10 opacity-0"
            style={{ animation: "message-in 0.6s ease-out 0.05s both" }}
          >
            <Image
              src="/logo-landing.png"
              alt="Agente planificador"
              width={168}
              height={112}
              priority
            />
            <h1 className="max-w-2xl font-serif-display text-[46px] italic leading-[1.1] tracking-[-0.01em] text-foreground sm:text-[64px] lg:text-[76px]">
              Le hablas. Él lo escribe en tu Notion, tu Calendar y tu Gmail.
            </h1>
          </div>
          <ProofExchange />
          <CtaButton />
        </div>
      </section>

      {/* 2 — Mecanismo: cómo, en una secuencia real, no en tarjetas de icono. */}
      <section className="border-t border-border px-6 py-28 text-center sm:px-12 sm:py-36">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-14">
          <h2 className="max-w-xl font-serif-display text-[34px] italic leading-[1.15] tracking-[-0.01em] text-foreground sm:text-[46px]">
            No es una base de datos nueva. Es una capa encima de las
            herramientas donde ya vives.
          </h2>
          <p className="max-w-xl text-[17px] leading-relaxed text-muted">
            La mayoría de asistentes te piden que muevas tu vida a su propia
            base de datos. Este no. Lee y escribe directamente donde ya
            organizas todo, así que no tienes que aprenderte una app nueva ni
            duplicar nada a mano.
          </p>
          <ol className="flex w-full max-w-xl flex-col gap-8 border-l border-border pl-6 text-left sm:pl-8">
            <li className="text-[17px] leading-relaxed text-muted">
              <span className="text-foreground">Escribes un mensaje.</span> El
              agente lee la intención y decide qué herramienta llamar. No
              adivina ni improvisa una respuesta suelta, llama una función
              concreta con argumentos concretos.
            </li>
            <li className="text-[17px] leading-relaxed text-muted">
              <span className="text-foreground">
                Habla MCP con Notion, Calendar y Gmail,
              </span>{" "}
              el mismo protocolo que usa Claude Desktop para hablar con tus
              apps. Un solo cliente, tres servicios, sin un SDK distinto para
              cada uno.
            </li>
            <li className="text-[17px] leading-relaxed text-muted">
              <span className="text-foreground">
                Cada acción queda registrada en Supabase,
              </span>{" "}
              con qué se pidió, qué herramienta se llamó y si funcionó. Puedes
              revisarlo todo después. Auditable, no una caja negra.
            </li>
          </ol>
        </div>
      </section>

      {/* 2.5 — Con qué habla, deslizándose — no logos de clientes, logos de integraciones reales. */}
      <StackStrip />

      {/* 2.75 — Más ejemplos de lo que le puedes pedir. */}
      <section className="border-b border-border px-6 py-24 text-center sm:px-12">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8">
          <p className="text-xs uppercase tracking-[0.08em] text-subtle">
            También le puedes pedir
          </p>
          <p className="max-w-md text-[15px] leading-relaxed text-muted">
            Crear una tarea es solo el principio. También lee, redacta y
            responde por ti cuando hace falta.
          </p>
          <div className="flex w-full flex-col gap-5">
            <p className="font-serif-display text-[22px] italic leading-relaxed text-muted sm:text-[26px]">
              &ldquo;Redáctame un borrador para pedir prórroga del trabajo de
              PROG.&rdquo;
            </p>
            <p className="font-serif-display text-[22px] italic leading-relaxed text-muted sm:text-[26px]">
              &ldquo;¿Qué tengo pendiente de PBDA esta semana?&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* 3 — Honestidad de escala: la ausencia de prueba social como contenido real. */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center border-t border-border px-6 py-24 text-center sm:px-12">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
          <h2 className="font-serif-display text-[34px] italic leading-[1.15] tracking-[-0.01em] text-foreground sm:text-[46px]">
            Una persona. Sin cuentas.
          </h2>
          <p className="max-w-xl text-[17px] leading-relaxed text-muted">
            Esto no es un producto que se vende, es una herramienta personal.
            No hay login, no hay planes de precios, no hay más usuarios que
            quien la instaló. Si buscas logos de clientes o cifras de uso, no
            los vas a encontrar aquí: no existen, y no los vamos a inventar.
          </p>
        </div>
      </section>

      {/* 4 — Cierre: la misma acción, anclada. */}
      <section className="border-t border-border px-6 py-28 text-center sm:px-12">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-7">
          <p className="text-[15px] leading-relaxed text-subtle">
            El chat recuerda la conversación mientras hablas con él.
          </p>
          <CtaButton />
        </div>
      </section>
    </main>
  );
}
