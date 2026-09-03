const DOCS = [
  {
    name: "README.md",
    body: "El documento de diseño completo: stack, arquitectura, modelo de datos, fases del proyecto, y el historial de cada decisión importante que se tomó por el camino.",
  },
  {
    name: "CLAUDE.md",
    body: "Guía de arquitectura y comandos para trabajar en el repo, pensada para que cualquiera (humano o agente) se ponga al día rápido.",
  },
  {
    name: "docs/prds/",
    body: "El roadmap real: Work Packages con sus dependencias, el camino crítico calculado, y qué está listo para construirse hoy mismo.",
  },
];

export default function DocsPage() {
  return (
    <main className="flex flex-1 flex-col overflow-y-auto bg-background pt-14">
      <section className="flex flex-col items-center gap-8 px-6 py-24 text-center sm:px-12 sm:py-32">
        <h1 className="font-serif-display text-[40px] italic leading-[1.1] tracking-[-0.01em] text-foreground sm:text-[56px]">
          Documentación
        </h1>
        <p className="max-w-lg text-[17px] leading-relaxed text-muted">
          El código y el diseño viven en el mismo sitio. Nada de wiki
          separada que nadie actualiza y se desfasa sola con el tiempo.
        </p>
        <a
          href="https://github.com/Hammad-Bellachhab/agente-planificador"
          target="_blank"
          rel="noreferrer"
          className="group inline-flex h-14 w-fit shrink-0 items-center justify-center gap-2 rounded-full bg-foreground px-8 font-serif-display text-[19px] italic text-background transition-transform duration-200 ease-out hover:scale-[1.04] active:scale-[0.98]"
        >
          Ver el repositorio
          <span
            aria-hidden="true"
            className="not-italic transition-transform duration-200 ease-out group-hover:translate-x-1"
          >
            →
          </span>
        </a>
      </section>

      <section className="border-t border-border px-6 py-20 sm:px-12">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-10">
          {DOCS.map((doc) => (
            <div
              key={doc.name}
              className="flex flex-col gap-1.5 border-l border-border pl-6 text-left"
            >
              <h2 className="font-mono text-[15px] text-foreground">
                {doc.name}
              </h2>
              <p className="max-w-md text-[15px] leading-relaxed text-muted">
                {doc.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
