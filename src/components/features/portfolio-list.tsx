"use client";
import Link from "next/link";
import { useState } from "react";
import FilterBar from "./filter-bar";
import LikeButton from "./like-button";
import StatusBadge from "@/components/site/status-badge";

type Item = { slug: string; name: string; excerpt: string; status: "dev" | "plan"; stack: string[]; url: string };

export default function PortfolioList({ sistemas, namespace }: { sistemas: Item[]; namespace: string }) {
  const [filtro, setFiltro] = useState("all");
  const dev = sistemas.filter((s) => s.status === "dev").length;
  const visiveis = sistemas.filter((s) => filtro === "all" || s.status === filtro);

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-sm text-muted">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="size-2 rounded-full bg-success" />
          <strong className="text-ink">{dev}</strong> em desenvolvimento
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="size-2 rounded-full bg-gold" />
          <strong className="text-ink">{sistemas.length - dev}</strong> planejados
        </span>
        <span>
          <strong className="text-ink">{sistemas.length}</strong> sistemas no total
        </span>
      </div>
      <div className="mb-6">
        <FilterBar
          value={filtro}
          onChange={setFiltro}
          label="Filtrar sistemas"
          options={[
            { value: "all", label: `Todos (${sistemas.length})` },
            { value: "dev", label: "Em desenvolvimento" },
            { value: "plan", label: "Planejados" },
          ]}
        />
      </div>
      <ul className="grid gap-3 md:grid-cols-2">
        {visiveis.map((s) => (
          <li key={s.slug} className="card flex flex-col gap-4 p-6">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-2xl font-semibold">
                <Link href={s.url} className="hover:text-aura">
                  {s.name}
                </Link>
              </h3>
              <StatusBadge status={s.status} />
            </div>
            <p className="text-[15px] leading-relaxed text-muted">{s.excerpt}</p>
            <div className="flex flex-wrap gap-2">
              {s.stack.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-auto flex items-center justify-between gap-3 border-t border-dashed border-line pt-4">
              <LikeButton namespace={namespace} likeKey={`portfolio--${s.slug}`} label={s.name} />
              <Link href={s.url} className="btn btn-ghost">
                Ver detalhes →
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
