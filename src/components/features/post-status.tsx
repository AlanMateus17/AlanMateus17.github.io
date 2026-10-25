"use client";
/**
 * No topo do post: registra a leitura no navegador (histórico "posts-lidos",
 * usado pela trilha de estudos), mostra os selos "você já leu / já curtiu"
 * e conta a visualização no CounterAPI.
 */
import { useEffect, useState } from "react";
import { Check, Heart } from "lucide-react";
import { incrementCount } from "@/lib/counter";
import { KEYS, addToList, getItem, getList } from "@/lib/storage";

export function PostViews({ slug, namespace }: { slug: string; namespace: string }) {
  const [views, setViews] = useState<number | null>(null);
  useEffect(() => {
    incrementCount(namespace, "view", slug).then(setViews).catch(() => setViews(-1));
  }, [slug, namespace]);
  if (views === -1) return null;
  return <span>{views === null ? "– visualizações" : `${views} ${views === 1 ? "visualização" : "visualizações"}`}</span>;
}

export function ReadBadges({ slug }: { slug: string }) {
  const [state, setState] = useState({ lido: false, curtido: false });
  useEffect(() => {
    const lido = getList(KEYS.postsLidos).includes(slug);
    const curtido = !!getItem(KEYS.liked(slug));
    setState({ lido, curtido });
    if (!lido) addToList(KEYS.postsLidos, slug);
  }, [slug]);
  if (!state.lido && !state.curtido) return null;
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {state.lido && (
        <span className="inline-flex items-center gap-1.5 rounded-sm bg-success-tint px-2 py-1 font-mono text-xs text-success">
          <Check className="size-3.5" aria-hidden="true" /> Você já leu este post
        </span>
      )}
      {state.curtido && (
        <span className="inline-flex items-center gap-1.5 rounded-sm bg-gold-tint px-2 py-1 font-mono text-xs text-gold-ink">
          <Heart className="size-3.5 fill-current" aria-hidden="true" /> Você já curtiu este post
        </span>
      )}
    </div>
  );
}

export function ReadingProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const body = document.querySelector(".post-body") as HTMLElement | null;
    if (!body) return;
    const update = () => {
      const rect = body.getBoundingClientRect();
      const total = body.offsetHeight - window.innerHeight;
      setPct(total > 0 ? Math.min(100, Math.max(0, (-rect.top / total) * 100)) : 100);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return (
    <div data-print-hide aria-hidden="true" className="fixed inset-x-0 top-0 z-50 h-[3px]">
      <div className="h-full bg-gold transition-[width] duration-100" style={{ width: `${pct}%` }} />
    </div>
  );
}

/** Botão "Copiar" em todo bloco de código do post. */
export function CopyCodeButtons() {
  useEffect(() => {
    const added: HTMLButtonElement[] = [];
    document.querySelectorAll<HTMLPreElement>(".post-body pre").forEach((pre) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "Copiar";
      btn.className =
        "absolute top-2 right-2 rounded-md border border-line bg-paper px-2.5 py-1.5 font-mono text-xs text-muted hover:text-ink";
      btn.addEventListener("click", () => {
        const code = pre.querySelector("code");
        navigator.clipboard?.writeText((code ?? pre).textContent ?? "").then(() => {
          btn.textContent = "Copiado!";
          setTimeout(() => (btn.textContent = "Copiar"), 1800);
        });
      });
      pre.appendChild(btn);
      added.push(btn);
    });
    return () => added.forEach((b) => b.remove());
  }, []);
  return null;
}
