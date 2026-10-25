"use client";
import Link from "next/link";
import { useState } from "react";
import FilterBar from "./filter-bar";
import StatusBadge from "@/components/site/status-badge";
import { ICONES_MATERIA } from "@/lib/icones-materia";

type Materia = { ano: number; nome: string; icone: string; status: string; desc: string };
type Curso = { id: string; nome: string; materias: Materia[] };

export default function EnsinoList({ cursos }: { cursos: Curso[] }) {
  const [filtro, setFiltro] = useState("all");
  const total = cursos.reduce((n, c) => n + c.materias.length, 0);
  const itens = cursos
    .filter((c) => filtro === "all" || c.id === filtro)
    .flatMap((c) => [...c.materias].sort((a, b) => a.ano - b.ano).map((m) => ({ ...m, curso: c.nome, cursoId: c.id })));

  return (
    <>
      <FilterBar
        label="Filtrar por curso"
        value={filtro}
        onChange={setFiltro}
        options={[
          { value: "all", label: `Todas (${total})` },
          ...cursos.map((c) => ({ value: c.id, label: `${c.nome} (${c.materias.length})` })),
        ]}
      />
      <ul className="mt-8 grid gap-3 md:grid-cols-2">
        {itens.map((m) => {
          const disponivel = m.status === "disponivel";
          return (
            <li key={`${m.cursoId}-${m.nome}`} className="card flex gap-4 p-5">
              <span
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-md bg-gold-tint text-gold-ink [&_svg]:size-6"
                dangerouslySetInnerHTML={{ __html: ICONES_MATERIA[m.icone] ?? "" }}
              />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <h3 className="font-display text-lg leading-snug font-semibold">{m.nome}</h3>
                <p className="text-[15px] leading-relaxed text-muted">{m.desc}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="tag">{m.ano}º ano</span>
                  <StatusBadge status={disponivel ? "disponivel" : "em-producao"} />
                </div>
                <Link href="/contato/" className="mt-1 self-start text-sm text-aura underline underline-offset-2">
                  {disponivel ? "Solicitar material" : "Avisem quando sair"}
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
