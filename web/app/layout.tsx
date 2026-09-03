import type { Metadata } from "next";
import { Geist_Mono, Instrument_Serif, Montserrat } from "next/font/google";
import { SiteNav } from "./components/site-nav";
import "./globals.css";

// Cuerpo de texto y UI. Sans geométrica proporcional, con más personalidad
// que la Geist por defecto del scaffold.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

// Solo para nombres de archivo/ruta en /docs. No como costume "técnico".
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Voz editorial para titulares: cursiva, en el registro de un Times New
// Roman itálico pero con más carácter propio. Solo para titulares grandes;
// el cuerpo de texto se queda en Montserrat por legibilidad.
const instrumentSerif = Instrument_Serif({
  variable: "--font-serif-display",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agente planificador",
  description: "Bot conversacional personal de planificación universitaria.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="flex h-full min-h-dvh flex-col overflow-hidden bg-background text-foreground">
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
