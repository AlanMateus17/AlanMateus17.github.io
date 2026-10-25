"use client";
/**
 * Cabeçalho do site: marca, navegação em "pílula", busca ⌘K e tema.
 * No celular a navegação fica num menu que abre por cima da página,
 * e o dock flutuante (mobile-dock.tsx) cobre os atalhos principais.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { MAIN_NAV, isActive } from "@/lib/nav";
import { cn } from "@/lib/utils";
import ThemeToggle from "./theme-toggle";
import CommandPalette, { openPalette, type PaletteItem } from "./command-palette";

type Props = { posts: PaletteItem[]; sistemas: PaletteItem[] };

export default function Header({ posts, sistemas }: Props) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      data-print-hide
      className={cn(
        "sticky top-0 z-40 border-b transition-colors",
        scrolled ? "border-line bg-paper/90 backdrop-blur-md" : "border-transparent bg-paper/0",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group inline-flex items-center gap-2.5 font-display text-xl font-semibold text-ink">
          <span aria-hidden="true" className="size-2.5 rounded-full bg-gold transition-transform group-hover:scale-125" />
          Alan Mateus
          <span className="hidden font-mono text-xs font-normal tracking-wider text-muted uppercase sm:inline">| AMtech Digital</span>
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-1 rounded-full border border-line bg-surface p-1 lg:flex">
          {MAIN_NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm transition-colors",
                  active ? "bg-aura-tint text-ink" : "text-muted hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openPalette}
            aria-label="Abrir busca (paleta de comandos)"
            className="hidden h-11 items-center gap-2.5 rounded-md border border-line px-3 font-mono text-[13px] text-muted transition-colors hover:text-ink sm:inline-flex"
          >
            Buscar
            <kbd className="rounded-sm border border-line px-1.5 py-0.5 text-xs text-ink">{isMac ? "⌘K" : "Ctrl K"}</kbd>
          </button>
          <Link href="/contato/" className="btn btn-primary hidden h-11 md:inline-flex">
            Contato
          </Link>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="menu-celular"
            className="inline-flex size-11 items-center justify-center rounded-md border border-line text-ink lg:hidden"
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-celular" aria-label="Menu" className="border-t border-line bg-paper lg:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:px-6">
            {[{ href: "/", label: "Início" }, ...MAIN_NAV, { href: "/contato/", label: "Contato" }].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 items-center border-b border-line text-base",
                    isActive(pathname, item.href) ? "font-semibold text-ink" : "text-muted",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openPalette();
                }}
                className="flex min-h-12 w-full items-center text-base text-muted"
              >
                Buscar no site…
              </button>
            </li>
          </ul>
        </nav>
      )}

      <CommandPalette posts={posts} sistemas={sistemas} />
    </header>
  );
}
