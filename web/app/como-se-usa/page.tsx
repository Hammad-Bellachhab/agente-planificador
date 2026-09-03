import Link from "next/link";

const STEPS = [
  {
    n: "01",
    title: "Escribes en lenguaje natural",
    body: "Nada de formularios ni menús. Le cuentas lo que necesitas, tal cual se lo dirías a alguien: “apunta el examen de PBDA el 15”.",
  },
  {
    n: "02",
    title: "El agente decide qué herramienta llamar",
    body: "No adivina ni improvisa una respuesta genérica. Llama una función concreta, con argumentos concretos, contra Notion o Calendar vía MCP: crear tarea, crear evento, revisar horario.",
  },
  {
    n: "03",
    title: "Queda escrito en tus herramientas reales",
    body: "La tarea aparece en tu Notion, el evento en tu Calendar, tal cual como si lo hubieras escrito tú a mano. Nada de una base de datos aparte que tienes que acordarte de ir a mirar.",
  },
  {
    n: "04",
    title: "Y queda registrado",
    body: "Cada llamada queda guardada en Supabase: qué se pidió, qué herramienta se llamó, si funcionó. Puedes preguntarle al agente qué hizo, y puedes auditarlo tú mismo cuando quieras.",
  },
];

export default function ComoSeUsaPage() {
  return (
    <main className="flex flex-1 flex-col overflow-y-auto bg-background pt-14">
      <section className="px-6 py-24 text-center sm:px-12 sm:py-32">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
          <h1 className="font-serif-display text-[40px] italic leading-[1.1] tracking-[-0.01em] text-foreground sm:text-[56px]">
            Cómo se usa
          </h1>
          <p className="max-w-lg text-[17px] leading-relaxed text-muted">
            No hay onboarding largo ni configuración previa que rellenar a
            mano. Cuatro pasos, y el tercero es el que importa: aparece en tu
            Notion, no en otro sitio nuevo que mantener.
          </p>
        </div>
      </section>

      <section className="border-t border-border px-6 py-20 sm:px-12">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-14">
          {STEPS.map((step) => (
            <div key={step.n} className="flex gap-6 text-left">
              <span className="font-serif-display text-[28px] italic leading-none text-subtle">
                {step.n}
              </span>
              <div className="flex flex-col gap-2">
                <h2 className="text-[19px] font-semibold tracking-[-0.01em] text-foreground">
                  {step.title}
                </h2>
                <p className="max-w-md text-[15px] leading-relaxed text-muted">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border px-6 py-24 text-center sm:px-12">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-7">
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
        </div>
      </section>
    </main>
  );
}
