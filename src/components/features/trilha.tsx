"use client";
/** Página /trilha/: progresso de leitura, lista de posts e conquistas (tudo no navegador). */
import Link from "next/link";
import { useEffect, useState } from "react";
import { Award, Check } from "lucide-react";
import { KEYS, getList } from "@/lib/storage";
import type { GuidePost } from "./study-guide";

export default function Trilha({ posts }: { posts: GuidePost[] }) {
  const [lidos, setLidos] = useState<string[] | null>(null);
  useEffect(() => setLidos(getList(KEYS.postsLidos)), []);

  const l = lidos ?? [];
  const total = posts.length;
  const lidosCount = posts.filter((p) => l.includes(p.slug)).length;
  const pct = total > 0 ? Math.round((lidosCount / total) * 100) : 0;

  const conquistas: { nome: string; desc: string }[] = [];
  if (lidosCount >= 1) conquistas.push({ nome: "Primeira leitura", desc: "Leu o primeiro artigo" });
  if (lidosCount >= 5) conquistas.push({ nome: "5 artigos", desc: "Leu 5 artigos diferentes" });
  if (lidosCount >= 10) conquistas.push({ nome: "10 artigos", desc: "Leu 10 artigos diferentes" });
  if (total > 0 && lidosCount === total) conquistas.push({ nome: "Em dia", desc: "Leu tudo que já foi publicado" });
  const porTag = new Map<string, { total: number; lidos: number }>();
  for (const p of posts) {
    if (!p.tag) continue;
    const t = porTag.get(p.tag) ?? { total: 0, lidos: 0 };
    t.total++;
    if (l.includes(p.slug)) t.lidos++;
    porTag.set(p.tag, t);
  }
  for (const [tag, t] of porTag) if (t.total > 1 && t.lidos === t.total) conquistas.push({ nome: `Especialista: ${tag}`, desc: `Leu todos os artigos sobre ${tag}` });

  return (
    <div>
      <div className="card p-6">
        <div className="h-3 overflow-hidden rounded-full bg-aura-tint" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso de leitura">
          <div className="h-full rounded-full bg-gold transition-[width] duration-700" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-3 text-[15px] text-ink">
          {lidos === null
            ? "Carregando seu progresso…"
            : total > 0
              ? `Você leu ${lidosCount} de ${total} artigos publicados (${pct}%)`
              : "Ainda não tem artigos publicados pra acompanhar."}
        </p>
      </div>

      {conquistas.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-2xl font-semibold">Conquistas</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {conquistas.map((c) => (
              <li key={c.nome} className="card flex items-center gap-4 p-4">
                <span className="flex size-11 items-center justify-center rounded-full bg-gold-tint text-gold-ink">
                  <Award className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold text-ink">{c.nome}</span>
                  <span className="block text-sm text-muted">{c.desc}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ol className="mt-10 flex flex-col gap-2">
        {posts.length === 0 && <p className="text-muted">Ainda não tem artigos publicados.</p>}
        {posts.map((p, i) => {
          const lido = l.includes(p.slug);
          return (
            <li key={p.slug}>
              <Link href={p.url} className={`card flex items-center gap-4 p-4 transition-colors hover:border-gold/60 ${lido ? "border-success/40" : ""}`}>
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full font-mono text-sm ${lido ? "bg-success-tint text-success" : "border border-line text-muted"}`}
                >
                  {lido ? <Check className="size-4" aria-label="Lido" /> : i + 1}
                </span>
                <span className="text-[16px] text-ink">{p.title}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
