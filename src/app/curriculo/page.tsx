import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { CartaoQr, CurriculoActions } from "@/components/features/curriculo-tools";
import RadarChart from "@/components/features/radar-chart";
import { getCurriculo, getDepoimentos, getSite } from "@/lib/content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Currículo",
  description: "Currículo de Alan Mateus — Professor de TI, Desenvolvedor .NET e Fundador do Grupo AMtech Digital.",
};

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-8 break-inside-avoid">
      <h2 className="eyebrow mb-5">{titulo}</h2>
      {children}
    </section>
  );
}

function Item({ titulo, periodo, onde, desc, extra }: { titulo: string; periodo?: string; onde?: string; desc?: string; extra?: React.ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[1fr_auto] sm:gap-x-6">
      <p className="font-display text-lg font-semibold text-ink">
        {titulo} {extra}
      </p>
      {periodo && <p className="font-mono text-sm text-gold-ink sm:text-right">{periodo}</p>}
      {onde && <p className="text-sm text-muted sm:col-span-2">{onde}</p>}
      {desc && <p className="mt-1 text-[15px] leading-relaxed text-ink sm:col-span-2">{desc}</p>}
    </div>
  );
}

const CERT_STATUS: Record<string, { label: string; cls: string }> = {
  obtida: { label: "obtida", cls: "bg-success-tint text-success" },
  "em-andamento": { label: "em andamento", cls: "bg-warning-tint text-warning" },
  planejada: { label: "planejada", cls: "bg-gold-tint text-gold-ink" },
};

export default function CurriculoPage() {
  const cv = getCurriculo();
  const site = getSite();
  const depoimentos = getDepoimentos().slice(0, 2);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div data-print-hide className="mb-8 flex flex-wrap items-center gap-3">
        {cv.aberto_a_oportunidades && (
          <span className="inline-flex items-center gap-2 rounded-full bg-success-tint px-3 py-1.5 font-mono text-xs text-success">
            <span aria-hidden="true" className="size-2 animate-pulse rounded-full bg-success" />
            Aberto a oportunidades
          </span>
        )}
        <div className="ml-auto flex flex-wrap gap-2">
          <Link href="/roteiro/" className="btn btn-ghost">
            Ver roteiro público
          </Link>
          <CurriculoActions />
        </div>
      </div>

      <article id="cv" className="card px-6 py-8 sm:px-10 sm:py-10">
        <header data-share-target className="flex flex-wrap items-start justify-between gap-6 pb-8">
          <div className="min-w-0">
            {cv.foto && <img src={cv.foto} alt={`Foto de ${cv.nome}`} className="mb-4 size-24 rounded-full border border-line object-cover" />}
            <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{cv.nome}</h1>
            <p className="mt-2 text-lg text-ink">{cv.cargo}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted">
              <MapPin className="size-4" aria-hidden="true" /> {cv.localizacao}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-sm">
              {cv.github && (
                <a href={cv.github} target="_blank" rel="noopener noreferrer" className="link">
                  {cv.github.replace("https://", "")}
                </a>
              )}
              {cv.linkedin && (
                <a href={cv.linkedin} target="_blank" rel="noopener noreferrer" className="link">
                  {cv.linkedin.replace("https://", "")}
                </a>
              )}
            </div>
          </div>
          <CartaoQr path="/contato/cartao/" />
        </header>

        <Bloco titulo="Objetivo">
          <p className="text-[16px] leading-relaxed">{cv.objetivo}</p>
          <p className="mt-2 text-sm text-muted">Disponibilidade: {cv.disponibilidade}</p>
        </Bloco>

        <Bloco titulo="Resumo">
          <p className="text-[16px] leading-relaxed">{cv.resumo}</p>
        </Bloco>

        <Bloco titulo="Experiência">
          <div className="flex flex-col gap-6">
            {cv.experiencia.map((e) => (
              <Item key={e.cargo} titulo={e.cargo} periodo={e.periodo} onde={e.local} desc={e.descricao} />
            ))}
          </div>
        </Bloco>

        <Bloco titulo="Formação acadêmica">
          <div className="flex flex-col gap-5">
            {cv.formacao_academica.map((f) => (
              <Item key={f.curso} titulo={f.curso} periodo={f.periodo} onde={f.local} />
            ))}
          </div>
        </Bloco>

        <Bloco titulo="Idiomas">
          <ul className="flex flex-col gap-2">
            {cv.idiomas.map((i) => (
              <li key={i.idioma} className="flex flex-wrap gap-x-3">
                <span className="font-semibold">{i.idioma}</span>
                <span className="text-muted">{i.nivel}</span>
              </li>
            ))}
          </ul>
        </Bloco>

        <Bloco titulo="Competências técnicas">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {cv.competencias.map((g) => (
              <div key={g.categoria} className="rounded-lg border border-line p-4">
                <p className="font-semibold text-ink">{g.categoria}</p>
                <ul className="mt-2 flex flex-col gap-1">
                  {g.itens.map((it) => (
                    <li key={it} className="text-sm text-muted">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div data-print-hide>
            <RadarChart user={site.author.github} nivelSeguranca={cv.nivel_seguranca ?? 1} />
          </div>
        </Bloco>

        <Bloco titulo="Certificações">
          <ul className="flex flex-wrap gap-2">
            {cv.certificacoes.map((c) => {
              const st = CERT_STATUS[c.status] ?? CERT_STATUS.planejada;
              return (
                <li key={c.nome} className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm">
                  {c.nome}
                  <em className={cn("rounded-sm px-1.5 py-0.5 font-mono text-[11px] not-italic", st.cls)}>{st.label}</em>
                </li>
              );
            })}
          </ul>
        </Bloco>

        {depoimentos.length > 0 && (
          <Bloco titulo="O que dizem">
            <div className="grid gap-3 sm:grid-cols-2">
              {depoimentos.map((d, i) => (
                <blockquote key={i} className="rounded-lg border border-line p-5">
                  <p className="text-[15px] leading-relaxed">“{d.texto}”</p>
                  <cite className="mt-3 block text-sm text-muted not-italic">
                    {d.nome} — {d.papel}
                  </cite>
                </blockquote>
              ))}
            </div>
            <p className="mt-4 text-sm" data-print-hide>
              <Link href="/depoimentos/" className="link">
                Ver todos os depoimentos →
              </Link>
            </p>
          </Bloco>
        )}

        <Bloco titulo="Projetos em destaque">
          <div className="flex flex-col gap-6">
            {cv.projetos_destaque.map((p) => (
              <Item
                key={p.nome}
                titulo={p.nome}
                periodo={p.periodo}
                desc={p.descricao}
                extra={
                  p.repo_url ? (
                    <a href={p.repo_url} target="_blank" rel="noopener noreferrer" className="ml-2 font-sans text-sm font-normal link">
                      Ver código →
                    </a>
                  ) : null
                }
              />
            ))}
          </div>
        </Bloco>

        <Bloco titulo="Formação complementar">
          <div className="flex flex-col gap-6">
            {cv.formacao_complementar.map((f) => (
              <Item key={f.titulo} titulo={f.titulo} periodo={f.periodo} onde={f.onde} desc={f.descricao} />
            ))}
          </div>
        </Bloco>
      </article>
    </div>
  );
}
