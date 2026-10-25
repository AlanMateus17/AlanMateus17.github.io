"use client";
/**
 * Listagem do blog: busca por palavra-chave, filtro por categoria,
 * "Mais lidos" (visualizações do CounterAPI) e selo "Lido" nos posts
 * que a pessoa já abriu neste navegador.
 */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import FilterBar from "./filter-bar";
import { readCount } from "@/lib/counter";
import { formatDateBR } from "@/lib/date";
import { KEYS, getList } from "@/lib/storage";
import { cn } from "@/lib/utils";

export type ListPost = {
  slug: string;
  title: string;
  url: string;
  category: string;
  tags: string[];
  excerpt: string;
  date: string;
  readingMinutes: number;
};

function tone(category: string) {
  const c = category.toLowerCase();
  if (c.includes("segur")) return "text-warning";
  if (c.includes("educ") || c.includes("ensino")) return "text-gold-ink";
  return "text-aura";
}

const FILTROS = [
  { value: "all", label: "Todos" },
  { value: "desenvolvimento", label: "Desenvolvimento" },
  { value: "ensino", label: "Ensino" },
  { value: "seguranca", label: "Segurança" },
  { value: "carreira", label: "Carreira" },
];

export default function BlogList({ posts, namespace }: { posts: ListPost[]; namespace: string }) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("all");
  const [lidos, setLidos] = useState<string[]>([]);
  const [maisLidos, setMaisLidos] = useState<{ title: string; url: string; views: number }[]>([]);

  useEffect(() => {
    setLidos(getList(KEYS.postsLidos));
    Promise.all(
      posts.map((p) =>
        readCount(namespace, "view", p.slug)
          .then((views) => ({ title: p.title, url: p.url, views }))
          .catch(() => null),
      ),
    ).then((res) => {
      const top = res
        .filter((r): r is { title: string; url: string; views: number } => !!r && r.views > 1)
        .sort((a, b) => b.views - a.views)
        .slice(0, 3);
      setMaisLidos(top);
    });
  }, [posts, namespace]);

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return posts.filter((p) => {
      const okFiltro = filtro === "all" || p.category.toLowerCase() === filtro;
      const blob = `${p.title} ${p.excerpt} ${p.tags.join(" ")}`.toLowerCase();
      return okFiltro && (!termo || blob.includes(termo));
    });
  }, [posts, busca, filtro]);

  return (
    <div>
      {maisLidos.length > 0 && (
        <div className="card mb-8 p-5">
          <p className="eyebrow mb-3">Mais lidos</p>
          <ol className="flex flex-col gap-2">
            {maisLidos.map((m, i) => (
              <li key={m.url} className="flex gap-3">
                <span className="font-mono text-sm text-gold-ink">{String(i + 1).padStart(2, "0")}</span>
                <Link href={m.url} className="link">
                  {m.title}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <FilterBar options={FILTROS} value={filtro} onChange={setFiltro} label="Filtrar por categoria" />
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <label htmlFor="busca-blog" className="sr-only">
            Buscar posts
          </label>
          <input
            id="busca-blog"
            type="search"
            className="field pl-10"
            placeholder="Buscar por palavra-chave…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>
      <p className="mt-4 flex gap-5 text-sm">
        <Link href="/blog/tags/" className="link">
          Ver por tag
        </Link>
        <Link href="/blog/arquivo/" className="link">
          Arquivo completo
        </Link>
      </p>

      {visiveis.length > 0 ? (
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {visiveis.map((p, i) => (
            <li key={p.url} className="grid gap-4 py-7 sm:grid-cols-[56px_1fr_auto]">
              <span className="hidden font-mono text-sm text-muted sm:block">{String(i + 1).padStart(2, "0")}</span>
              <div className="min-w-0">
                <p className={cn("flex flex-wrap items-center gap-3 font-mono text-xs tracking-wider uppercase", tone(p.category))}>
                  {p.category}
                  {lidos.includes(p.slug) && (
                    <span className="inline-flex items-center gap-1 rounded-sm bg-success-tint px-1.5 py-0.5 tracking-normal text-success normal-case">
                      <Check className="size-3" aria-hidden="true" /> Lido
                    </span>
                  )}
                </p>
                <h2 className="mt-2 font-display text-2xl leading-snug font-semibold">
                  <Link href={p.url} className="hover:text-aura">
                    {p.title}
                  </Link>
                </h2>
                {p.excerpt && <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-muted">{p.excerpt}</p>}
                {p.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-4 font-mono text-xs text-muted sm:flex-col sm:items-end sm:gap-1">
                <span>{formatDateBR(p.date)}</span>
                <span>{p.readingMinutes} min</span>
              </div>
            </li>
          ))}
        </ul>
      ) : busca ? (
        <p className="mt-8 text-muted">Nenhum post encontrado pra essa busca.</p>
      ) : (
        <p className="mt-8 text-muted">
          Ainda não tenho nenhum post publicado nesse tema — mas está no roteiro.{" "}
          <Link href="/roteiro/" className="link">
            Confere o que vem por aí →
          </Link>
        </p>
      )}
    </div>
  );
}
