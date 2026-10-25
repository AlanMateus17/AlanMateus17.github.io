import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import MobileDock from "@/components/site/mobile-dock";
import FloatingActions from "@/components/site/floating-actions";
import { getPosts, getSistemas, getSite, isConfigured } from "@/lib/content";

const site = getSite();

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.title} — ${site.tagline}`, template: `%s — ${site.title}` },
  description: site.description,
  authors: [{ name: site.author.name, url: site.url }],
  manifest: "/manifest.json",
  icons: { icon: "/assets/icons/icon-192.png", apple: "/assets/icons/icon-192.png" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.title,
    title: site.title,
    description: site.description,
    url: site.url,
    images: [{ url: "/assets/img/og-default.png" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { types: { "application/rss+xml": "/feed.xml" } },
};

export const viewport: Viewport = {
  themeColor: "#0b1a1e",
  width: "device-width",
  initialScale: 1,
};

/* Aplica o tema salvo ANTES de desenhar a página (escuro é o padrão). */
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const posts = getPosts().map((p) => ({ href: p.url, label: p.title }));
  const sistemas = getSistemas().map((s) => ({ href: s.url, label: s.name, hint: s.excerpt }));
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.author.name,
    url: site.url,
    jobTitle: "Desenvolvedor .NET e Professor de Informática",
    worksFor: { "@type": "Organization", name: "Grupo AMtech Digital" },
    address: { "@type": "PostalAddress", addressLocality: "Barbacena", addressRegion: "MG", addressCountry: "BR" },
    sameAs: [`https://github.com/${site.author.github}`, `https://linkedin.com/in/${site.author.linkedin}`],
  };

  return (
    <html lang="pt-BR" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:rounded-md focus:bg-surface focus:px-4 focus:py-3 focus:text-ink"
        >
          Pular para o conteúdo
        </a>
        <Header posts={posts} sistemas={sistemas} />
        <main id="conteudo" tabIndex={-1} className="pb-24 outline-none lg:pb-0">
          {children}
        </main>
        <Footer />
        <MobileDock />
        <FloatingActions />
        {isConfigured(site.goatcounter_username) && (
          <Script
            data-goatcounter={`https://${site.goatcounter_username}.goatcounter.com/count`}
            src="https://gc.zgo.at/count.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
