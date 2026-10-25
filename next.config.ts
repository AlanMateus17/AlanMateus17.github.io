import type { NextConfig } from "next";

/**
 * O site é 100% estático: `next build` gera a pasta `out/`, que o GitHub
 * Actions publica no GitHub Pages (veja .github/workflows/deploy.yml).
 * `trailingSlash` mantém os mesmos endereços do site antigo em Jekyll
 * (/blog/, /portfolio/kaixara/ …), pra nenhum link compartilhado quebrar.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
