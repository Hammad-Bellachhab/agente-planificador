"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "/chat", label: "Chat" },
  { href: "/como-se-usa", label: "Cómo se usa" },
  { href: "/infra", label: "Infra" },
  { href: "/docs", label: "Documentación" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let ticking = false;

    // El scroll real pasa dentro del <main> de cada página (overflow-y-auto),
    // no en window/body (que se quedan fijos a la altura del viewport).
    // Un listener en fase de captura en document sí ve el scroll de
    // cualquier descendiente, aunque el evento no haga bubbling.
    function onScroll(event: Event) {
      const target = event.target as HTMLElement | Document;
      const y =
        target instanceof Document
          ? window.scrollY
          : (target as HTMLElement).scrollTop;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const goingDown = y > lastY.current + 4;
        const goingUp = y < lastY.current - 4;
        if (goingDown && y > 80) setHidden(true);
        else if (goingUp || y < 80) setHidden(false);
        lastY.current = y;
        ticking = false;
      });
    }

    document.addEventListener("scroll", onScroll, {
      passive: true,
      capture: true,
    });
    return () =>
      document.removeEventListener("scroll", onScroll, { capture: true });
  }, []);

  return (
    <header
      className="site-nav-in fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-out"
      style={{ transform: hidden ? "translateY(-100%)" : "translateY(0)" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-background via-background/70 to-transparent"
      />
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6 sm:px-12">
        <Link
          href="/"
          className="font-serif-display text-[19px] italic text-foreground transition-colors hover:text-muted"
        >
          Agente planificador
        </Link>
        <ul className="flex items-center gap-6">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-[13px] transition-colors ${
                    active
                      ? "text-foreground"
                      : "text-subtle hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
