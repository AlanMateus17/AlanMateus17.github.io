"use client";
/**
 * Radar de skills (Backend / Frontend / DevOps / Segurança). Os três primeiros
 * são calculados ao vivo pelos bytes de código nos repositórios públicos do
 * GitHub; Segurança é autoavaliação (nivel_seguranca em content/curriculo.yml).
 * A API pública do GitHub tem limite de 60 pedidos por hora por IP.
 */
import { useEffect, useState } from "react";

const MAPA: Record<"backend" | "frontend" | "devops", string[]> = {
  backend: ["C#", "Java", "Python", "PHP", "Ruby", "Go", "TSQL", "PLpgSQL"],
  frontend: ["JavaScript", "TypeScript", "HTML", "CSS", "Vue", "SCSS"],
  devops: ["Dockerfile", "Shell", "PowerShell", "YAML", "Makefile"],
};
const ETAPA = { 1: "Etapa 1 — Fundamentos", 2: "Etapa 2 — Praticando", 3: "Etapa 3 — Aplicado", 4: "Etapa 4 — Avançado" } as const;
type Nivel = 1 | 2 | 3 | 4;

function bytesParaEtapa(b: number): Nivel {
  if (b <= 0) return 1;
  if (b < 10000) return 2;
  if (b < 80000) return 3;
  return 4;
}

const C = 200;
const R = 160;
const pt = (nivel: number, eixo: "top" | "right" | "bottom" | "left") => {
  const r = (nivel / 4) * R;
  return eixo === "top" ? [C, C - r] : eixo === "right" ? [C + r, C] : eixo === "bottom" ? [C, C + r] : [C - r, C];
};

export default function RadarChart({ user, nivelSeguranca }: { user: string; nivelSeguranca: number }) {
  const seg = (Math.min(4, Math.max(1, nivelSeguranca)) as Nivel) || 1;
  const [niveis, setNiveis] = useState<{ backend: Nivel; frontend: Nivel; devops: Nivel } | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    fetch(`https://api.github.com/users/${user}/repos?per_page=100`)
      .then((r) => {
        if (!r.ok) throw new Error("falhou");
        return r.json() as Promise<{ fork: boolean; languages_url: string }[]>;
      })
      .then((repos) =>
        Promise.all(
          repos
            .filter((r) => !r.fork)
            .map((r) =>
              fetch(r.languages_url)
                .then((x) => x.json() as Promise<Record<string, number>>)
                .catch(() => ({}) as Record<string, number>),
            ),
        ),
      )
      .then((todas) => {
        const tot = { backend: 0, frontend: 0, devops: 0 };
        for (const langs of todas)
          for (const [nome, bytes] of Object.entries(langs))
            for (const cat of Object.keys(MAPA) as (keyof typeof MAPA)[]) if (MAPA[cat].includes(nome)) tot[cat] += bytes;
        setNiveis({ backend: bytesParaEtapa(tot.backend), frontend: bytesParaEtapa(tot.frontend), devops: bytesParaEtapa(tot.devops) });
      })
      .catch(() => setErro(true));
  }, [user]);

  const n = niveis ?? { backend: 1, frontend: 1, devops: 1 };
  const pts = [pt(n.backend, "top"), pt(n.frontend, "right"), pt(n.devops, "bottom"), pt(seg, "left")];
  const linhas = [
    ["Backend", niveis ? ETAPA[n.backend] : erro ? "indisponível agora" : "calculando…"],
    ["Frontend", niveis ? ETAPA[n.frontend] : erro ? "indisponível agora" : "calculando…"],
    ["DevOps", niveis ? ETAPA[n.devops] : erro ? "indisponível agora" : "calculando…"],
    ["Segurança", ETAPA[seg]],
  ];

  return (
    <div className="card mt-6 grid items-center gap-6 p-6 md:grid-cols-[minmax(0,360px)_1fr]">
      <svg viewBox="-70 -40 540 480" role="img" aria-label="Radar de competências" className="w-full max-w-[360px]">
        {[4, 3, 2, 1].map((k) => {
          const r = (k / 4) * R;
          return <polygon key={k} points={`${C},${C - r} ${C + r},${C} ${C},${C + r} ${C - r},${C}`} fill="none" stroke="var(--line)" strokeWidth="1" />;
        })}
        <line x1={C} y1={C - R} x2={C} y2={C + R} stroke="var(--line)" />
        <line x1={C - R} y1={C} x2={C + R} y2={C} stroke="var(--line)" />
        <polygon
          points={pts.map((p) => p.join(",")).join(" ")}
          fill="color-mix(in srgb, var(--aura-900) 22%, transparent)"
          stroke="var(--aura-900)"
          strokeWidth="3"
          style={{ transition: "all .6s ease" }}
        />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="6" fill="var(--gold-500)" stroke="var(--surface)" strokeWidth="2" />
        ))}
        <g fill="var(--ink)" fontFamily="var(--font-mono)" fontSize="18">
          <text x={C} y="24" textAnchor="middle">Backend</text>
          <text x="380" y="206" textAnchor="start">Frontend</text>
          <text x={C} y="390" textAnchor="middle">DevOps</text>
          <text x="20" y="206" textAnchor="end">Segurança</text>
        </g>
      </svg>
      <div>
        <ul className="flex flex-col gap-2">
          {linhas.map(([k, v]) => (
            <li key={k} className="flex items-center gap-2 text-[15px]">
              <span aria-hidden="true" className="size-2 rounded-full bg-gold" />
              {k}: <strong className="font-semibold text-ink">{v}</strong>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          {erro
            ? "Não foi possível carregar os dados do GitHub agora (limite de pedidos da API pode ter sido atingido — tenta de novo mais tarde). Segurança já é exibida normalmente."
            : "Backend, Frontend e DevOps calculados ao vivo pelo código real nos repositórios públicos do GitHub. Segurança é autoavaliação, atualizada manualmente por marco."}
        </p>
        <p className="mt-2 font-mono text-xs text-muted">1 Fundamentos · 2 Praticando · 3 Aplicado · 4 Avançado</p>
      </div>
    </div>
  );
}
