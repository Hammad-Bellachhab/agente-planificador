import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Quita el indicador de "N" de Next.js dev en la esquina — pedido
  // explícitamente por el usuario, no es parte del diseño de la app.
  devIndicators: false,
};

export default nextConfig;
