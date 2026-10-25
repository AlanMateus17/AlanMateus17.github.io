"use client";
/**
 * Atividade pública no GitHub, ao vivo (API pública, sem login):
 *   - um mapa de atividade dos últimos 91 dias (eventos públicos por dia)
 *   - os 6 commits mais recentes
 * A API pública só devolve os últimos ~90 dias / 300 eventos — por isso o
 * mapa cobre 13 semanas e não o ano inteiro.
 */
import { useEffect, useMemo, useState } from "react";

type GhEvent = {
  type: string;
  created_at: string;
  repo: { name: string };
  payload: { commits?: { sha: string; message: string }[] };
};
type Commit = { repo: string; mensagem: string; data: string; url: string };

const DAYS = 91;

function tempoRelativo(iso: string) {
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 60) return `há ${Math.max(min, 1)} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h}h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `há ${d} dia${d > 1 ? "s" : ""}`;
  const m = Math.floor(d / 30);
  return `há ${m} ${m > 1 ? "meses" : "mês"}`;
}

const LEVELS = ["bg-aura-tint", "bg-aura/30", "bg-aura/55", "bg-aura/80", "bg-aura"];

export default function GithubActivity({ user }: { user: string }) {
  const [state, setState] = useState<"loading" | "ok" | "erro">("loading");
  const [events, setEvents] = useState<GhEvent[]>([]);

  useEffect(() => {
    Promise.all([1, 2, 3].map((page) =>
      fetch(`https://api.github.com/users/${user}/events/public?per_page=100&page=${page}`).then((r) => {
        if (!r.ok) throw new Error("falhou");
        return r.json() as Promise<GhEvent[]>;
      }),
    ))
      .then((pages) => {
        setEvents(pages.flat());
        setState("ok");
      })
      .catch(() => setState("erro"));
  }, [user]);

  const { cells, commits, total } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const counts = new Map<string, number>();
    for (const e of events) {
      const d = new Date(e.created_at);
      d.setHours(0, 0, 0, 0);
      const key = d.toISOString().slice(0, 10);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    const cells = Array.from({ length: DAYS }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (DAYS - 1 - i));
      const key = d.toISOString().slice(0, 10);
      const n = counts.get(key) ?? 0;
      const level = n === 0 ? 0 : n < 2 ? 1 : n < 4 ? 2 : n < 7 ? 3 : 4;
      return { key, n, level, label: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) };
    });
    const commits: Commit[] = [];
    for (const e of events) {
      if (e.type !== "PushEvent" || !e.payload.commits) continue;
      for (const c of e.payload.commits) {
        commits.push({
          repo: e.repo.name.split("/")[1],
          mensagem: c.message.split("\n")[0],
          data: e.created_at,
          url: `https://github.com/${e.repo.name}/commit/${c.sha}`,
        });
      }
    }
    return { cells, commits: commits.slice(0, 6), total: events.length };
  }, [events]);

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto border-b border-line p-5 sm:p-6">
        <div
          role="img"
          aria-label={state === "ok" ? `${total} eventos públicos no GitHub nos últimos 90 dias` : "Mapa de atividade do GitHub"}
          className="grid w-max grid-flow-col grid-rows-7 gap-1"
        >
          {cells.map((c) => (
            <span
              key={c.key}
              title={`${c.label}: ${c.n} evento${c.n === 1 ? "" : "s"}`}
              className={`size-3.5 rounded-[3px] ${state === "ok" ? LEVELS[c.level] : "bg-aura-tint"}`}
            />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-muted">
          <span>
            {state === "ok" && `${total} eventos públicos nos últimos 90 dias`}
            {state === "loading" && "Buscando a atividade no GitHub…"}
            {state === "erro" && "Não foi possível carregar o GitHub agora (limite da API pública) — tenta mais tarde."}
          </span>
          <span className="flex items-center gap-1.5" aria-hidden="true">
            menos {LEVELS.map((l) => <span key={l} className={`size-3 rounded-[3px] ${l}`} />)} mais
          </span>
        </div>
      </div>

      {state === "ok" && commits.length === 0 && (
        <p className="p-5 text-sm text-muted sm:p-6">
          Nenhum commit público recente — a construção continua, só não apareceu no GitHub esta semana.
        </p>
      )}
      {commits.length > 0 && (
        <ul className="divide-y divide-line">
          {commits.map((c) => (
            <li key={c.url}>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="grid gap-1 px-5 py-3.5 transition-colors hover:bg-aura-tint sm:grid-cols-[180px_1fr_auto] sm:items-center sm:gap-4 sm:px-6"
              >
                <span className="truncate font-mono text-[13px] text-aura">{c.repo}</span>
                <span className="truncate text-[15px] text-ink">{c.mensagem}</span>
                <span className="font-mono text-xs text-muted">{tempoRelativo(c.data)}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
