"use client";
/**
 * Paleta de comandos (⌘K / Ctrl+K): busca rápida por páginas, posts e
 * sistemas, mais algumas ações (trocar tema, copiar link, abrir o terminal
 * secreto). Qualquer botão do site pode abri-la disparando o evento
 * "abrir-paleta" na window.
 */
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FileText, FolderGit2, Link2, Search, SunMoon, Terminal } from "lucide-react";
import { ALL_PAGES } from "@/lib/nav";

export type PaletteItem = { href: string; label: string; hint?: string };

type Props = {
  posts: PaletteItem[];
  sistemas: PaletteItem[];
};

export function openPalette() {
  window.dispatchEvent(new Event("abrir-paleta"));
}

const itemClass =
  "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-[15px] text-ink aria-selected:bg-aura-tint data-[selected=true]:bg-aura-tint";

export default function CommandPalette({ posts, sistemas }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("abrir-paleta", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("abrir-paleta", onOpen);
    };
  }, []);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  function toggleTheme() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    window.dispatchEvent(new Event("tema-mudou"));
    setOpen(false);
  }

  function copyLink() {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setOpen(false);
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Buscar no site"
      loop
      overlayClassName="fixed inset-0 z-[60] bg-black/60"
      contentClassName="fixed left-1/2 top-[12vh] z-[61] w-[calc(100%-32px)] max-w-xl -translate-x-1/2 overflow-hidden rounded-lg border border-line bg-surface"
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Search className="size-4 shrink-0 text-muted" aria-hidden="true" />
        <Command.Input
          placeholder="Buscar páginas, posts e sistemas…"
          className="h-14 w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-muted"
        />
        <kbd className="hidden rounded-sm border border-line px-1.5 py-0.5 font-mono text-xs text-muted sm:inline">esc</kbd>
      </div>
      <Command.List className="max-h-[60vh] overflow-y-auto p-2">
        <Command.Empty className="px-3 py-8 text-center text-sm text-muted">Nada encontrado pra essa busca.</Command.Empty>

        <Command.Group heading="Páginas">
          {ALL_PAGES.map((p) => (
            <Command.Item key={p.href} value={`${p.label} ${p.hint ?? ""} ${p.href}`} onSelect={() => go(p.href)} className={itemClass}>
              <span className="text-gold" aria-hidden="true">→</span>
              <span className="flex-1">{p.label}</span>
              {p.hint && <span className="font-mono text-xs text-muted">{p.hint}</span>}
            </Command.Item>
          ))}
        </Command.Group>

        {posts.length > 0 && (
          <Command.Group heading="Posts">
            {posts.map((p) => (
              <Command.Item key={p.href} value={`post ${p.label}`} onSelect={() => go(p.href)} className={itemClass}>
                <FileText className="size-4 shrink-0 text-muted" aria-hidden="true" />
                <span className="flex-1 truncate">{p.label}</span>
              </Command.Item>
            ))}
          </Command.Group>
        )}

        <Command.Group heading="Sistemas AM">
          {sistemas.map((s) => (
            <Command.Item key={s.href} value={`sistema ${s.label} ${s.hint ?? ""}`} onSelect={() => go(s.href)} className={itemClass}>
              <FolderGit2 className="size-4 shrink-0 text-muted" aria-hidden="true" />
              <span>{s.label}</span>
              {s.hint && <span className="flex-1 truncate text-right text-xs text-muted">{s.hint}</span>}
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Ações">
          <Command.Item value="trocar tema claro escuro" onSelect={toggleTheme} className={itemClass}>
            <SunMoon className="size-4 shrink-0 text-muted" aria-hidden="true" />
            Trocar tema (claro / escuro)
          </Command.Item>
          <Command.Item value="copiar link desta página" onSelect={copyLink} className={itemClass}>
            <Link2 className="size-4 shrink-0 text-muted" aria-hidden="true" />
            Copiar link desta página
          </Command.Item>
          <Command.Item value="terminal secreto ~" onSelect={() => go("/terminal/")} className={itemClass}>
            <Terminal className="size-4 shrink-0 text-muted" aria-hidden="true" />
            Abrir o terminal
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
