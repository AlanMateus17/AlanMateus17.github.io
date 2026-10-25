import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/site/page-hero";
import StatusBadge from "@/components/site/status-badge";
import { getPostsForSistema, getSistemas } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";

type Params = { slug: string };

export function generateStaticParams() {
  return getSistemas().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getSistemas().find((x) => x.slug === slug);
  return s ? { title: s.name, description: s.excerpt } : {};
}

export default async function SistemaPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const s = getSistemas().find((x) => x.slug === slug);
  if (!s) notFound();
  const html = await renderMarkdown(s.markdown);
  const relacionados = getPostsForSistema(s);

  return (
    <>
      <PageHero eyebrow="Portfólio" title={s.name}>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <StatusBadge status={s.status} long />
          {s.stack.map((t) => (
            <span key={t} className="tag">
              #{t}
            </span>
          ))}
        </div>
      </PageHero>

      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <p className="font-display text-2xl leading-snug text-ink">{s.excerpt}</p>
        {s.repoUrl && (
          <a href={s.repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-6">
            Ver código no GitHub ↗
          </a>
        )}
        <div className="post-body mt-8" dangerouslySetInnerHTML={{ __html: html }} />

        {relacionados.length > 0 && (
          <div className="card mt-12 p-6">
            <h2 className="font-display text-2xl font-semibold">Documentado no blog</h2>
            <p className="mt-2 text-[15px] text-muted">
              Antes de virar código, cada decisão de arquitetura desse sistema passa pelo blog. Acompanhe o raciocínio:
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {relacionados.map((p) => (
                <li key={p.url}>
                  <Link href={p.url} className="link">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link href="/portfolio/" className="btn btn-ghost mt-12">
          ← Voltar pro Portfólio
        </Link>
      </article>
    </>
  );
}
