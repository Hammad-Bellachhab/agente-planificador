import Image from "next/image";

const STACK = [
  {
    piece: "Next.js / TypeScript",
    where: "Vercel",
    role: "El frontend. Esta misma interfaz que estás usando ahora mismo, chat incluido, desplegada con cada push.",
  },
  {
    piece: "Python",
    where: "Google Cloud Run",
    role: "El núcleo del agente: LLM con function calling y cliente MCP. Corre en un contenedor aparte de Vercel, porque MCP necesita mantener conexiones vivas, y eso no encaja con funciones serverless que se apagan entre peticiones.",
  },
  {
    piece: "PostgreSQL",
    where: "Supabase",
    role: "Memoria persistente. Guarda conversaciones, tareas, y qué herramienta se llamó en cada una, con su resultado.",
  },
  {
    piece: "MCP",
    where: "Notion oficial · Calendar y Gmail propios",
    role: "El protocolo que habla con cada servicio externo de forma uniforme, en vez de un SDK distinto por integración. El mismo lenguaje que usa Claude Desktop para conectar con tus apps.",
  },
  {
    piece: "n8n",
    where: "Automatizaciones secundarias",
    role: "Fuera del camino de la conversación. Solo dispara tareas programadas cuando hacen falta, sin tocar la lógica de decisión del agente.",
  },
];

export default function InfraPage() {
  return (
    <main className="flex flex-1 flex-col overflow-y-auto bg-background pt-14">
      <section className="flex flex-col items-center gap-10 px-6 py-24 text-center sm:px-12 sm:py-32">
        <Image
          src="/banner.png"
          alt="Arquitectura de agente-planificador"
          width={900}
          height={225}
          className="w-full max-w-3xl rounded-lg border border-border"
          priority
        />
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
          <h1 className="font-serif-display text-[40px] italic leading-[1.1] tracking-[-0.01em] text-foreground sm:text-[56px]">
            La infraestructura
          </h1>
          <p className="max-w-lg text-[17px] leading-relaxed text-muted">
            Cinco piezas, cada una con un trabajo concreto. Nada corre donde
            no le toca.
          </p>
        </div>
      </section>

      <section className="border-t border-border px-6 py-20 sm:px-12">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-10">
          {STACK.map((item) => (
            <div
              key={item.piece}
              className="flex flex-col gap-1.5 border-l border-border pl-6 text-left"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-foreground">
                  {item.piece}
                </h2>
                <span className="text-xs uppercase tracking-[0.08em] text-subtle">
                  {item.where}
                </span>
              </div>
              <p className="max-w-md text-[15px] leading-relaxed text-muted">
                {item.role}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
