"use client";
/**
 * Botão de tema (escuro ⇄ claro). O tema escuro da Aura é o padrão; a escolha
 * fica salva no navegador (chave "theme", a mesma do site antigo). O script
 * que aplica o tema ANTES da página desenhar fica inline no <head> (layout.tsx),
 * pra não piscar o tema errado.
 */
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function getTheme(): "dark" | "light" {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

export default function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    setTheme(getTheme());
    const sync = () => setTheme(getTheme());
    window.addEventListener("tema-mudou", sync);
    return () => window.removeEventListener("tema-mudou", sync);
  }, []);

  function toggle() {
    const next = getTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
    window.dispatchEvent(new Event("tema-mudou"));
  }

  const label = theme === "dark" ? "Mudar para o tema claro" : "Mudar para o tema escuro";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-md border border-line text-muted transition-colors hover:bg-aura-tint hover:text-ink",
        className,
      )}
    >
      {theme === "dark" ? <Sun className="size-[18px]" aria-hidden="true" /> : <Moon className="size-[18px]" aria-hidden="true" />}
    </button>
  );
}
